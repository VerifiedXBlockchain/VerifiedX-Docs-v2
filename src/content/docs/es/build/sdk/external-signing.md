---
sourceHash: affe7c8a8003
title: "Firma externa: claves de HSM, KMS y MPC"
description: Firma transacciones de VerifiedX con una clave guardada en un HSM, un KMS en la nube o un servicio de MPC pasando un Signer al VerifiedX Web SDK en lugar de una clave privada.
sidebar:
  label: Firma externa
  order: 6
---

El VerifiedX Web SDK puede firmar cada transacción con una clave que nunca ve. En lugar de una clave privada, pasa un `Signer`: un objeto que conoce su dirección y su clave pública y que puede firmar un digest. Así es como un emisor guarda una clave de tesorería o de propietario de un token en un HSM, un KMS en la nube o un servicio de MPC, y aun así usa el SDK para construir y enviar transacciones.

## Requisitos previos

- `vfx-web-sdk` 3.4.0 o posterior
- Una clave secp256k1 guardada en el servicio de firma (en AWS KMS, con la especificación de clave `ECC_SECG_P256K1`)

## El contrato de Signer

```typescript
import { Signer } from 'vfx-web-sdk';

interface Signer {
  address: string;   // the VFX address the signature is verified against
  publicKey: string; // uncompressed secp256k1 public key, hex, with or without the 04 prefix
  signDigest(digestHex: string): Promise<Uint8Array | string> | Uint8Array | string;
}
```

Para cada mensaje que hay que firmar, el SDK calcula su digest SHA-256 y llama a `signDigest` con el digest de 32 bytes como 64 caracteres hexadecimales. El firmante devuelve una firma ECDSA simple codificada en DER sobre ese digest, como bytes, hex o base64. Ese es el formato que los productos de KMS y HSM emiten de forma nativa.

Luego, el SDK:

- normaliza una firma high-s a low-s, así que los firmantes que no la canonicalizan (AWS KMS, por ejemplo) funcionan sin un envoltorio;
- arma la cadena de firma de la red, `base64(DER).base58(publicKey)`;
- comprueba, antes de hacer cualquier solicitud, que `address` realmente pertenezca a `publicKey` en la red del cliente. Una clave equivocada, o una dirección de testnet en un cliente de mainnet, falla de inmediato en lugar de fallar en el nodo.

## Dónde se acepta un Signer

En todos los lugares donde el SDK firma:

| Método | Cómo pasarlo |
|---|---|
| `sendCoin`, `buyVfxDomain`, `buyBtcDomain`, transferencia y eliminación de dominios | primer argumento, en lugar del par de claves |
| Todos los métodos de tokens (`deployToken`, `mintToken`, `transferToken`, …) | primer argumento |
| Métodos de cuentas de reserva (`registerReserveAccount`, `callBackReserveTransaction`, `recoverReserveAccount`) | primer argumento |
| Flujos de vBTC (`transferVbtc`, `transferVbtcMulti`, `createVbtcToken`, retiros) | `signer` en el objeto de parámetros, en lugar de `privateKey` (pasar ambos es un error) |
| `RawTransactionService` | opción `signer` |

## Paso 1: deriva la dirección a partir de la clave pública

```typescript
import { VfxClient, Network } from 'vfx-web-sdk';

const client = new VfxClient(Network.Mainnet);

const publicKey = await hsm.getPublicKeyHex(); // uncompressed, 65 bytes as hex
const address = client.addressFromPublic(publicKey);
```

Fondea esta dirección como cualquier otra. Para una cuenta de reserva (bóveda, vault) guardada en un HSM, usa `client.reserveAddressFromPublic(publicKey)` para obtener la dirección `xRBX…`.

## Paso 2: construye el Signer y úsalo

```typescript
const signer: Signer = {
  address,
  publicKey,
  signDigest: (digestHex) => hsm.signDigest(digestHex), // returns DER
};

await client.sendCoin(signer, 'xRecipient...', 10);
await client.mintToken(signer, { scIdentifier, amount: 1000 });
await client.transferVbtc({ scIdentifier, fromAddress: signer.address, toAddress, amount: 0.5, signer });
```

## Ejemplo: AWS KMS

Un esbozo con AWS SDK v3. KMS devuelve la clave pública como un `SubjectPublicKeyInfo` en DER; para una clave secp256k1, el punto sin comprimir son sus últimos 65 bytes. KMS firma un digest precalculado cuando `MessageType` es `DIGEST` y devuelve una firma DER que puede ser high-s, que el SDK normaliza.

```typescript
import { KMSClient, GetPublicKeyCommand, SignCommand } from '@aws-sdk/client-kms';
import { VfxClient, Network, Signer } from 'vfx-web-sdk';

const kms = new KMSClient({ region: 'us-east-1' });
const KeyId = 'arn:aws:kms:...:key/...'; // key spec ECC_SECG_P256K1, usage SIGN_VERIFY

async function kmsSigner(client: VfxClient): Promise<Signer> {
  const { PublicKey } = await kms.send(new GetPublicKeyCommand({ KeyId }));
  const publicKey = Buffer.from(PublicKey!).subarray(-65).toString('hex');

  return {
    address: client.addressFromPublic(publicKey),
    publicKey,
    signDigest: async (digestHex) => {
      const { Signature } = await kms.send(
        new SignCommand({
          KeyId,
          Message: Buffer.from(digestHex, 'hex'),
          MessageType: 'DIGEST',
          SigningAlgorithm: 'ECDSA_SHA_256',
        }),
      );
      return Signature!; // DER bytes
    },
  };
}

const client = new VfxClient(Network.Mainnet);
const signer = await kmsSigner(client);
await client.sendCoin(signer, 'xRecipient...', 1);
```

## Prueba un Signer sin gastar

Un cliente `dryRun` firma y hace que el nodo verifique la transacción, y luego se detiene antes de enviarla. Es la forma más rápida de comprobar que una nueva integración de firmante produce firmas que la red acepta:

```typescript
const dry = new VfxClient(Network.Mainnet, true);
const hash = await dry.sendCoin(signer, 'xRecipient...', 0.01);
// a hash means the node verified the signature; nothing was broadcast
```

Los flujos de vBTC mueven valor real respaldado por Bitcoin y rechazan un cliente `dryRun`; pruébalos en testnet.

## Firmas sin procesar

Quienes manejan directamente la API de transacciones sin procesar pueden convertir una firma DER al formato de la red:

```typescript
import { vfxSignatureFromDer } from 'vfx-web-sdk';

const signature = vfxSignatureFromDer(derBytes, publicKey); // low-s normalised
```

## Problemas comunes

### `Signer address ... does not match its public key`
La `address` se derivó de otra clave o para la otra red. Derívala con `addressFromPublic` en un cliente de la misma red.

### El nodo rechaza la firma
Comprueba que `signDigest` firme el digest que recibe tal como está. Un servicio que vuelve a aplicar un hash a su entrada (por ejemplo, KMS con `MessageType: 'RAW'`) produce una firma sobre el mensaje equivocado.

## ¿Qué sigue?

- [Tokens fungibles](/es/build/sdk/fungible-tokens/): emite y administra un token VFX20 con un firmante como propietario
- [Cuentas de reserva](/es/build/sdk/reserve-accounts/): cuentas de bóveda, incluidas las claves de bóveda y de recuperación guardadas en un HSM
- [Referencia de la API de VfxClient](/es/build/sdk/reference/vfx-client/)
