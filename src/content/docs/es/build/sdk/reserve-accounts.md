---
sourceHash: 3603d9b0ff95
title: "Cuentas de reserva: bóvedas con retraso y recuperables"
description: Crea, usa y recupera una cuenta de reserva (bóveda) con el VerifiedX Web SDK, incluidos los envíos con retraso, las devoluciones y la recuperación a una dirección segura.
sidebar:
  label: Cuentas de reserva
  order: 4
---

Una cuenta de reserva (también llamada bóveda, o vault) es una dirección `xRBX…` cuyos envíos salientes esperan hasta una hora de desbloqueo antes de liquidarse. Hasta entonces, el propietario puede devolver un envío (call back), y si la clave de la bóveda llega a verse comprometida, una clave de recuperación independiente puede barrer todo lo que hay en la bóveda hacia una dirección segura. Esta guía explica cómo crear, usar y recuperar una cuenta de reserva con el VerifiedX Web SDK.

## Requisitos previos

- `vfx-web-sdk` 3.4.0 o posterior
- Una dirección de VFX común con fondos desde la cual fondear la bóveda (5 VFX cubren la activación)

## Cómo funcionan las cuentas de reserva

- **Activación.** Una bóveda se convierte en cuenta de reserva al enviar una transacción `Register()`: 4 VFX a `Reserve_Base`, indicando su dirección de recuperación. Después deben quedar al menos 0.5 VFX en la bóveda.
- **Envíos con retraso.** Cada envío desde una bóveda activada lleva una hora de desbloqueo, al menos 24 horas en el futuro. Hasta entonces, el monto aparece como bloqueado: ya salió del saldo disponible de la bóveda, pero todavía no llegó al destinatario.
- **Retorno.** Antes de la hora de desbloqueo, la bóveda puede cancelar un envío pendiente y los fondos regresan.
- **Recuperación.** La clave de recuperación firma un `Recover()` que barre el saldo de la bóveda hacia la dirección de recuperación y desactiva la bóveda de forma permanente.
- **Alcance.** El retraso se aplica a los envíos de VFX, vBTC y NFTs. Una transferencia de token fungible desde una bóveda lleva la hora de desbloqueo, pero se liquida de inmediato, así que una bóveda protege la tesorería, no los tokens de fondos. Las operaciones con dominios, el despliegue de tokens y las transferencias de vBTC de varios contratos se rechazan desde una bóveda.

## Paso 1: deriva las claves de la bóveda

La bóveda que la billetera web de VerifiedX asocia a una cuenta se deriva de la clave principal de esa cuenta, así que el SDK produce la misma dirección de bóveda y la misma clave de recuperación que la billetera.

```typescript
import { VfxClient, Network } from 'vfx-web-sdk';

const client = new VfxClient(Network.Testnet);

const mainPrivateKey = process.env.VFX_PRIVATE_KEY!;
const main = {
  privateKey: mainPrivateKey,
  publicKey: client.publicFromPrivate(mainPrivateKey),
  address: client.addressFromPrivate(mainPrivateKey),
};

const vault = client.reserveKeypairFromPrivateKey(mainPrivateKey);
console.log(vault.address);         // xRBX...
console.log(vault.recoveryAddress); // ordinary x... address that receives a recovery sweep
console.log(vault.restoreCode);     // back this up: it restores both keys
```

Otras formas de obtener una bóveda:

```typescript
client.reserveKeypairFromRestoreCode(code);          // a CLI or wallet restore code
client.reserveKeypairFromReservePrivateKey(key);     // from the vault key alone
client.generateReserveKeypair();                     // a standalone vault
client.reserveAddressFromPublic(publicKeyHex);       // the xRBX address of an HSM-held key
```

Pasa siempre el propio objeto `ReserveKeypair` al firmar. Su clave privada por sí sola corresponde a la dirección `x…` común de esa clave, no a la bóveda.

## Paso 2: fondea y registra

```typescript
await client.sendCoin(main, vault.address, 5);   // fund the vault
// wait for it to confirm, then:
await client.registerReserveAccount(vault);      // 4 VFX Register()
```

Confirma la activación antes de enviar desde la bóveda:

```typescript
const details = await client.getAddressDetails(vault.address);
// { address: 'xRBX...', balance: 1.49999273, balanceLocked: 0, activated: true, deactivated: false, ... }
```

## Paso 3: envía desde la bóveda

```typescript
const hash = await client.sendCoin(vault, 'xRecipient...', 100);                       // settles in 24 hours
const later = await client.sendCoin(vault, 'xRecipient...', 100, { unlockHours: 72 }); // or later
```

El SDK aplica el mínimo de 24 horas (la red exige un poco menos) y rechaza `unlockHours` en una cuenta común. Mientras un envío está pendiente, `getAddressDetails` lo muestra en `balanceLocked`:

```typescript
// after sending 0.25 from a vault holding 1.5:
// { balance: 1.24998667, balanceTotal: 1.49998667, balanceLocked: 0.25, ... }
```

## Paso 4: devuelve un envío

Antes de que pase la hora de desbloqueo, la bóveda puede cancelar el envío:

```typescript
await client.callBackReserveTransaction(vault, { hash });
// once confirmed: balanceLocked returns to 0 and the amount is spendable again
```

## Paso 5: recupera una bóveda comprometida

Si la clave de la bóveda queda expuesta, la clave de recuperación mueve todo a la dirección de recuperación y desactiva la bóveda para siempre:

```typescript
await client.recoverReserveAccount(vault);
// vault: { balance: 0, activated: true, deactivated: true }
// recovery address: receives the vault's full balance
```

Un `ReserveKeypair` lleva su clave de recuperación, así que la llamada no necesita nada más. La firma de recuperación lleva una marca de tiempo y es válida durante 10 minutos, así que envíala pronto después de construirla.

## Claves en un HSM

Tanto la clave de la bóveda como la clave de recuperación pueden guardarse externamente. El `Signer` de la bóveda presenta la dirección `xRBX`; la recuperación recibe su propio firmante (o par de claves):

```typescript
const vaultSigner = {
  address: client.reserveAddressFromPublic(vaultPublicKey),
  publicKey: vaultPublicKey,
  signDigest: (digestHex) => hsm.sign('vault-key', digestHex),
};

await client.registerReserveAccount(vaultSigner, { recoveryAddress });
await client.sendCoin(vaultSigner, 'xRecipient...', 100);
await client.recoverReserveAccount(vaultSigner, { recoverySigner });
```

Consulta [Firma externa](/es/build/sdk/external-signing/) para ver el contrato de `Signer`.

## Problemas comunes

### `A send from a reserve account must wait at least 24 hours`
El mínimo del SDK es de 24 horas, igual que en la billetera.

### `... cannot be sent from a reserve account`
La compra y la administración de dominios, el despliegue de tokens y las transferencias de vBTC de varios contratos no están permitidos desde una bóveda. Usa una cuenta común.

### `Invalid Transaction` al registrar
La bóveda necesita al menos 4.5 VFX (4 para la activación más el mínimo de 0.5) y la transacción de fondeo debe estar confirmada antes.

### La firma produjo la dirección equivocada
Una clave privada de bóveda pasada como un par de claves simple o como `privateKey` firma para la dirección común de esa clave. Pasa el `ReserveKeypair` que devuelven las funciones de derivación, o un `Signer` cuya dirección tenga la forma `xRBX`.

## ¿Qué sigue?

- [Firma externa](/es/build/sdk/external-signing/): claves de bóveda y de recuperación guardadas en un HSM
- [Tokens fungibles](/es/build/sdk/fungible-tokens/)
- [Referencia de la API de VfxClient](/es/build/sdk/reference/vfx-client/): cada método de reserva y sus parámetros
