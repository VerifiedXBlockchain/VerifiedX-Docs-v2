---
sourceHash: 3badf1237131
title: "Referencia de la API de VfxClient"
description: Referencia de los métodos de VfxClient en el VerifiedX Web SDK, que abarca pares de claves, firma externa, transacciones, vBTC V2, tokens VFX20, cuentas de reserva y operaciones con direcciones.
sidebar:
  order: 1
---

`VfxClient` es la interfaz principal para interactuar con la blockchain de VerifiedX. Ofrece métodos para administrar billeteras, hacer transacciones y operar con direcciones.

## Constructor

### `new VfxClient(network, dryRun?)`

Crea una nueva instancia de VfxClient.

**Parámetros:**
- `network` (Network | string): la red a la que te conectas (`Network.Mainnet`, `Network.Testnet` o su equivalente como cadena)
- `dryRun` (boolean, opcional): si es true, las transacciones no se transmiten (valor predeterminado: false)

**Ejemplo:**
```typescript
import { VfxClient, Network } from 'vfx-web-sdk';

const client = new VfxClient(Network.Testnet);
const dryRunClient = new VfxClient('mainnet', true);
```

## Administración de pares de claves

### `generatePrivateKey()`

Genera una nueva clave privada aleatoria.

**Devuelve:** `string` - Una clave privada en hexadecimal

**Ejemplo:**
```typescript
const privateKey = client.generatePrivateKey();
console.log(privateKey); // "a1b2c3d4e5f6..."
```

### `generateMnemonic(words?)`

Genera una frase de recuperación (mnemónico) BIP39.

**Parámetros:**
- `words` (12 | 24, opcional): cantidad de palabras de la frase de recuperación (valor predeterminado: 12)

**Devuelve:** `string` - Una frase de recuperación con las palabras separadas por espacios

**Ejemplo:**
```typescript
const mnemonic12 = client.generateMnemonic(12);
const mnemonic24 = client.generateMnemonic(24);
console.log(mnemonic12); // "word1 word2 word3 ..."
```

### `privateKeyFromMneumonic(mnemonic, index)`

Deriva una clave privada a partir de una frase de recuperación.

**Parámetros:**
- `mnemonic` (string): la frase de recuperación BIP39
- `index` (number): el índice de derivación (normalmente 0 para la primera cuenta)

**Devuelve:** `string` - La clave privada derivada

**Ejemplo:**
```typescript
const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const privateKey = client.privateKeyFromMneumonic(mnemonic, 0);
```

### `publicFromPrivate(privateKey)`

Deriva la clave pública a partir de una clave privada.

**Parámetros:**
- `privateKey` (string): la clave privada en formato hexadecimal

**Devuelve:** `string` - La clave pública correspondiente

**Ejemplo:**
```typescript
const privateKey = client.generatePrivateKey();
const publicKey = client.publicFromPrivate(privateKey);
```

### `addressFromPrivate(privateKey)`

Deriva la dirección de VFX a partir de una clave privada.

**Parámetros:**
- `privateKey` (string): la clave privada en formato hexadecimal

**Devuelve:** `string` - La dirección de VFX

**Ejemplo:**
```typescript
const privateKey = client.generatePrivateKey();
const address = client.addressFromPrivate(privateKey);
console.log(address); // "VFX..."
```

### `getSignature(message, privateKey)`

Firma un mensaje con una clave privada.

**Parámetros:**
- `message` (string): el mensaje que firmas
- `privateKey` (string): la clave privada con la que firmas

**Devuelve:** `string` - La firma

**Ejemplo:**
```typescript
const signature = client.getSignature("Hello, VerifiedX!", privateKey);
```

## Firma externa

Todo método que firma acepta un `Keypair` o un `Signer`. Un `Signer` guarda la clave privada en otro lugar (HSM, servicio MPC, billetera de hardware):

```typescript
interface Signer {
  address: string;     // the VFX address the signature is verified against
  publicKey: string;   // uncompressed secp256k1 public key, hex, 04 prefix optional
  // digestHex: 32-byte SHA-256 digest of the message, as hex.
  // Return the DER-encoded ECDSA signature as bytes, hex, or base64.
  signDigest(digestHex: string): Promise<Uint8Array | string> | Uint8Array | string;
}
```

El SDK arma la firma de la red (`base64(DER).base58(publicKey)`) a partir del DER que recibe y fuerza low-s, así que los firmantes que devuelven firmas high-s (AWS KMS) no necesitan un envoltorio. La dirección se verifica contra la clave pública en la red del cliente antes de hacer cualquier solicitud.

### `addressFromPublic(publicKeyHex)`

Deriva la dirección de red de una clave pública sin comprimir. Úsalo para obtener la dirección de una clave guardada en un HSM.

```typescript
const address = client.addressFromPublic(await hsm.getPublicKeyHex());
```

## Métodos de transacción

### `sendCoin(keypair, toAddress, amount)`

Envía tokens VFX a otra dirección.

**Parámetros:**
- `keypair` (Keypair | Signer): un par de claves local o un Signer (consulta Firma externa)
- `toAddress` (string): la dirección de VFX del destinatario
- `amount` (number): el monto de VFX que envías

**Devuelve:** `Promise<string | null>` - El hash de la transacción, o `null` si la transacción nunca llegó al nodo. Un envío cuyo resultado se desconoce (la solicitud salió, pero no volvió ninguna respuesta) lanza `TransactionDispatchError` con el hash.

**Ejemplo:**
```typescript
const keypair = {
  private: privateKey,
  public: client.publicFromPrivate(privateKey),
  address: client.addressFromPrivate(privateKey)
};

const result = await client.sendCoin(keypair, "VFX_RECIPIENT_ADDRESS", 100);
console.log(result.txHash);
```

### `buyVfxDomain(keypair, domain)`

Compra un nombre de dominio de VFX.

**Parámetros:**
- `keypair` (Keypair): el par de claves del comprador
- `domain` (string): el nombre de dominio que compras (p. ej., "myapp.vfx")

**Devuelve:** `Promise<any>` - Objeto con el resultado de la transacción

**Ejemplo:**
```typescript
const result = await client.buyVfxDomain(keypair, "myawesomeapp.vfx");
```

**Requisitos:**
- El dominio debe estar disponible
- La dirección no debe tener ya un dominio
- Saldo de VFX suficiente para cubrir el costo del dominio

### `transferVfxDomain(keypair, toAddress)`

Entrega el dominio .vfx del firmante a `toAddress`. Cuesta 5 VFX. El nombre que posee se lee de Spyglass y se verifica si el destinatario ya tiene un dominio, ambas cosas de forma estricta: una caída de la API hace fallar la llamada en lugar de interpretarse como "sin dominio".

### `deleteVfxDomain(keypair)`

Libera el dominio .vfx del firmante. Cuesta 5 VFX.

### `transferBtcDomain(keypair, { btcFromAddress, btcToAddress, vfxToAddress })`

Mueve un dominio .btc a otra dirección de Bitcoin, que a partir de entonces administra `vfxToAddress`. Cuesta 5 VFX. El firmante debe ser la cuenta de VFX que administra actualmente el dominio de `btcFromAddress`; el nodo verifica esa vinculación y que `btcToAddress` no tenga dominio. No hace falta ninguna firma de Bitcoin.

### `deleteBtcDomain(keypair, { btcFromAddress })`

Libera el dominio .btc de `btcFromAddress`, que administra el firmante. Cuesta 5 VFX.

La red rechaza toda operación con dominios desde una cuenta de reserva (xRBX).

## vBTC V2

Estos métodos crean bóvedas (vaults) de vBTC V2, mueven vBTC y lo retiran a Bitcoin a través de la API del explorador (Spyglass). Para conocer el protocolo detrás de ellos (bóvedas vigiladas, retiros fijados, mínimos de comisión), consulta [Integración de vBTC](/es/build/vbtc/integration/). Todo método que firma recibe `privateKey` o un `signer` externo (consulta [Firma externa](#firma-externa)), y ninguno se ejecuta en un cliente con `dryRun`.

Desde Core 9.0, la cadena vigila las bóvedas creadas a partir de la altura de registro de atestaciones: sus retiros los pagan los firmantes de la bóveda en una transacción de Bitcoin que la cadena fija, sin ceremonia FROST y sin transacción de finalización. Las bóvedas creadas antes de esa altura (bóvedas "heredadas", `is_watched: false`) siguen finalizando los retiros con una ceremonia FROST. Los métodos de retiro de abajo manejan ambos casos e indican con cuál están tratando.

### Lectura de bóvedas

| Método | Devuelve |
|--------|---------|
| `listVbtcTokens()` | Todas las bóvedas V2 que indexa el explorador |
| `getVbtcTokens(address)` | Las bóvedas que posee `address` o en las que tiene vBTC |
| `getVbtcTokenDetail(scIdentifier)` | Una bóveda |
| `getVbtcTransfers(scIdentifier)` | Las transferencias de vBTC de la bóveda |
| `getVbtcWithdrawals(scIdentifier)` | Las solicitudes de retiro de la bóveda y su estado |

Una bóveda (`VbtcV2Token`) contiene `sc_identifier`, `owner_address`, `deposit_address`, `global_balance`, `is_watched`, `addresses` (el saldo de cada tenedor) y `available_balances` (el saldo de cada tenedor menos sus solicitudes de retiro abiertas, que es lo que se puede enviar). Las versiones anteriores del explorador omiten los dos últimos; en ese caso, usa `addresses`.

### `createVbtcToken({ ownerAddress, privateKey | signer, name, description, ticker, onProgress?, pollIntervalMs?, timeoutMs? })`

Crea una bóveda cuyo propietario es `ownerAddress`: ejecuta la ceremonia de claves (el propietario firma los mensajes de inicio y de distribución de partes), espera a que termine (tiempo de espera predeterminado de 3 minutos, con consultas cada 4 s) y luego firma y envía la transacción de creación del contrato. `onProgress` informa `ceremony_started`, `ceremony_polling`, `ceremony_complete`, `contract_preparing` y `contract_sent`.

**Devuelve:** `Promise<{ transactionHash: string; scIdentifier: string; depositAddress: string }>`

Envía Bitcoin a `depositAddress` para fondear la bóveda. El explorador puede responder 404 para una bóveda nueva durante uno o dos minutos, hasta que indexe la transacción de creación.

### `transferVbtc({ scIdentifier, fromAddress, toAddress, amount, privateKey | signer })`

Envía `amount` vBTC de una bóveda a `toAddress`. Un nombre `.vfx` se resuelve primero a su dirección, y un destinatario de la otra red se rechaza antes de construir nada.

**Devuelve:** `Promise<{ transactionHash: string }>`

### `transferVbtcMulti({ toAddress, totalAmount, privateKey | signer, inputs? })`

Envía `totalAmount` vBTC en una sola transacción, tomada de varios contratos V2 en los que el firmante tiene saldo disponible. Sin `inputs`, los saldos salen de `available_balances` de Spyglass (el saldo de la dirección menos sus solicitudes de retiro abiertas) y se asignan como lo hace la CLI: primero el más grande, los empates por id de contrato, de forma voraz y en satoshis enteros, para que las entradas sumen exactamente el total. Una transferencia que un solo contrato puede cubrir pasa por `transferVbtc`, como hace la billetera. El nodo limita una transferencia a 25 contratos y la rechaza desde una cuenta de reserva o hacia una dirección blindada.

**Devuelve:** `Promise<{ transactionHash: string; inputs: Array<{ scIdentifier: string; amount: number }> }>`

`allocateVbtcInputs(balances, total)` y `vbtcMultiTransferData(...)` se exportan para quienes consultan los saldos o eligen los contratos por su cuenta.

### `requestWithdrawal({ scIdentifier, requestorAddress, btcAddress, amount, feeRate, privateKey | signer, onProgress?, pollIntervalMs?, timeoutMs? })`

Retira `amount` vBTC de una bóveda a `btcAddress` a `feeRate` sat/vB: envía la solicitud de retiro (tipo 27) y luego llama a `completeWithdrawal` para ella. La comisión de Bitcoin sale de `amount`, y deben quedar al menos 546 sats después de una comisión de 154 vB a `feeRate`, así que el retiro mínimo es de `154 × feeRate + 546` sats. El SDK rechaza uno menor antes de construirlo.

**Devuelve:** `Promise<VbtcWithdrawalResult>`: `withdrawalRequestHash`, `paid`, `btcTransactionHash` y `completionTransactionHash` (ambos vacíos mientras `paid` sea false), y `watched` (el estado del retiro en una bóveda vigilada; si no, `null`).

En una bóveda vigilada, el resultado suele volver con `paid: false`: la cadena aceptó la solicitud y los firmantes de la bóveda la están pagando, lo que requiere confirmaciones de Bitcoin. No hace falta enviar nada más. Dale seguimiento con `getWithdrawalPin` o vuelve a llamar a `completeWithdrawal` más tarde.

Si la solicitud está en la cadena, pero falla su finalización, el error es un `VbtcWithdrawalIncompleteError` con `withdrawalRequestHash`. La cadena rechaza una solicitud nueva mientras esa siga vigente, así que retómala con `completeWithdrawal`.

### `completeWithdrawal({ scIdentifier, requestorAddress, withdrawalRequestHash, btcAddress, amount, feeRate, privateKey | signer, onProgress?, pollIntervalMs?, timeoutMs? })`

Finaliza una solicitud de retiro que ya está en la cadena.

- **Bóveda vigilada:** no envía nada. Espera (hasta `timeoutMs`, 3 minutos por defecto) a que el nodo registre la solicitud y luego se resuelve con `paid: true` y la transacción que la paga, si Bitcoin ya la pagó, o con `paid: false` y su estado en `watched`. `onProgress` informa `watched_polling`. Lanza `VbtcWithdrawalClosedError` si el retiro se cerró sin pagarse (liberado, vencido o anulado); en ese caso, el vBTC ya volvió al solicitante.
- **Bóveda heredada:** ejecuta la ceremonia de firma FROST, transmite la transacción de Bitcoin firmada y registra la finalización (tipo 28). `onProgress` informa `frost_preparing`, `frost_polling`, `frost_complete`, `btc_broadcast` y `completion_recorded`. Puedes volver a llamarlo sin riesgo para una solicitud cuyo intento anterior se detuvo antes de la transmisión. Si la ceremonia falla de forma transitoria, el error lo indica: espera unos 60 segundos y vuelve a llamarlo.

Si la transacción de Bitcoin pudo haberse transmitido, pero la finalización no se registró, lanza `VbtcWithdrawalUnrecordedError` con `btcTransactionHash` y, cuando se desconoce el resultado de la transmisión, `signedBtcTxHex`. **No vuelvas a llamar a `completeWithdrawal` en ese estado**: una segunda ceremonia puede pagarle dos veces al destino. Busca la transacción, vuelve a transmitir `signedBtcTxHex` si no aparece (la misma transacción solo se puede confirmar una vez) y luego llama a `recordWithdrawalCompletion`.

### `recordWithdrawalCompletion({ scIdentifier, requestorAddress, withdrawalRequestHash, btcTransactionHash, amount, btcDestination, privateKey | signer, onProgress? })`

Registra en la cadena de VFX (tipo 28) un retiro heredado que ya se transmitió, sin volver a ejecutar la ceremonia. Es la vía de recuperación después de un `VbtcWithdrawalUnrecordedError` y no necesita el estado de la ceremonia, así que funciona desde un proceso nuevo siempre que se haya guardado el txid de Bitcoin.

**Devuelve:** `Promise<VbtcWithdrawalResult>` con `paid: true`.

### `requestWithdrawalMulti({ btcAddress, totalAmount, feeRate, privateKey | signer, inputs?, vaults?, maxFee? })`

Retira `totalAmount` vBTC a una sola dirección de Bitcoin desde varias bóvedas en una sola solicitud (un tipo 27, una firma). La cadena abre una porción por bóveda bajo el hash de la solicitud, y cada porción se paga con su propia transacción de Bitcoin, así que `feeRate` (un número entero de sat/vB) se paga una vez por porción, con cargo a esa porción.

- Sin `inputs`, las bóvedas y los montos se eligen a partir de los saldos disponibles del solicitante (primero el más grande, como máximo 10 bóvedas), limitados a `vaults` si se indica. Con `inputs`, deben sumar `totalAmount`.
- Cuando una sola bóveda cubre el total, se envía en su lugar la solicitud ordinaria de una sola bóveda, como hace el nodo.
- Antes de firmar, el SDK verifica que `btcAddress` sea de esta red, que cada porción supere el mínimo de comisión y que la transacción sea el tipo 27 propio del solicitante con exactamente estas porciones y una comisión en VFX no mayor que `maxFee` (0.01 por defecto). Si no, lanza `PreSignCheckError` y no firma nada.
- No está disponible desde una cuenta de reserva (xRBX).

Envía la solicitud y regresa; no espera el pago.

**Devuelve:** `Promise<{ withdrawalRequestHash: string; inputs: Array<{ scIdentifier: string; amount: number }>; totalAmount: number; btcAddress: string; feeRate: number; fee: number }>`

Guarda `inputs`: los métodos de porciones de abajo los reciben como `shares`.

### `getWithdrawalShares({ withdrawalRequestHash, requestorAddress, shares })`

Lee desde el nodo en qué estado está cada porción de una solicitud. Una solicitud de una sola bóveda tiene una porción.

**Devuelve:** `Promise<VbtcWithdrawalShare[]>`, cada una con `scIdentifier`, `amount`, `outcome`, `watched`, `pinnedBtcTransactionHash` y `btcTransactionHash`. `outcome` es uno de los siguientes:

| Resultado | Significado |
|---------|---------|
| `paid` | Bitcoin la pagó |
| `being_paid` | Fijada: los firmantes de la bóveda la están pagando. Se puede subir su comisión o se puede liberar |
| `waiting` | Las monedas libres de la bóveda todavía no la cubren; se fija cuando la cubran. Se puede cancelar |
| `released` | Su solicitante renunció a ella; el vBTC volvió, menos la comisión de la transacción de liberación |
| `cancelled` | Se canceló mientras esperaba; el vBTC volvió |
| `closed` | Se cerró sin pagarse de otra forma (vencida, anulada); el vBTC volvió |
| `not_mined` | El nodo todavía no minó la solicitud |
| `legacy` | Una bóveda que la cadena no vigila: finaliza esta porción con `completeWithdrawal` |

### `followWithdrawalShares({ withdrawalRequestHash, requestorAddress, shares, onProgress?, pollIntervalMs?, timeoutMs? })`

Lee las porciones (cada 15 s por defecto) hasta que todas sean definitivas (`paid`, `released`, `cancelled`, `closed` o `legacy`) o pase `timeoutMs` (10 minutos por defecto), y pasa cada lectura a `onProgress`. El pago requiere confirmaciones de Bitcoin, así que un tiempo de espera corto suele devolver `settled: false` con las porciones tal como están; vuelve a llamarlo más tarde.

**Devuelve:** `Promise<{ withdrawalRequestHash: string; shares: VbtcWithdrawalShare[]; settled: boolean; lastError?: string }>`

### `getWithdrawalPin({ scIdentifier, withdrawalRequestHash, requestorAddress })`

En qué estado está un retiro (o una porción) en una bóveda vigilada: `state` (`Waiting`, `Pinned`, `Settled`, `Released` u otro estado cerrado), `paid`, `closed`, la transacción de Bitcoin fijada y su `feeRate`, la transacción que lo paga, `minimumNextFeeRate` y si se puede subir la comisión (`canRaiseFee`), liberar (`canRelease`) o cancelar (`canCancel`). Devuelve `null` para una bóveda heredada. Lanza `VbtcNodeUnreachableError` cuando el explorador no pudo llegar al nodo; vuelve a consultar.

### `bumpWithdrawalFee({ scIdentifier, withdrawalRequestHash, feeRate, privateKey | signer })`

Sube la comisión de Bitcoin de un retiro fijado en una bóveda vigilada que no se está confirmando (tipo 44). La cadena fija un reemplazo que gasta las mismas monedas, y la comisión más alta sale del monto del retiro. `feeRate` debe ser al menos el `minimumNextFeeRate` de `getWithdrawalPin`. El SDK lee primero el retiro y se niega si no se puede subir la comisión; un rechazo del nodo lanza `TransactionRefusedError` con el motivo del nodo. Para una solicitud de varias bóvedas, indica la bóveda de la porción y el hash de la solicitud.

**Devuelve:** `Promise<string | null>`, el hash de la transacción.

### `releaseWithdrawal({ scIdentifier, withdrawalRequestHash, feeRate, privateKey | signer })`

Renuncia a un retiro fijado en una bóveda vigilada (tipo 44): la cadena fija una transacción de Bitcoin que devuelve sus monedas a la bóveda y, una vez que Bitcoin la confirma, el vBTC vuelve al solicitante, menos la comisión de esa transacción. Si alguno de sus pagos se confirma primero, el retiro se paga en su lugar. `feeRate` sigue la misma regla que en `bumpWithdrawalFee`, y el nodo también rechaza una liberación cuya comisión no supere la de la transacción fijada por su costo de retransmisión.

**Devuelve:** `Promise<string | null>`, el hash de la transacción.

### `cancelWithdrawal({ scIdentifier, ownerAddress, withdrawalRequestHash, privateKey | signer })`

Cancela una solicitud de retiro (tipo 29). En una bóveda vigilada, esto solo funciona mientras está en `Waiting` (`canCancel`), y el vBTC vuelve de inmediato; una fijada se puede liberar en su lugar. Para una solicitud de varias bóvedas, indica la bóveda de la porción y el hash de la solicitud.

**Devuelve:** `Promise<{ transactionHash: string }>`

### Errores de vBTC

Todos se exportan desde `vfx-web-sdk`.

| Error | Cuándo | Qué hacer |
|-------|------|------------|
| `VbtcWithdrawalIncompleteError` | La solicitud está en la cadena, pero su finalización falló | Llama a `completeWithdrawal` con su `withdrawalRequestHash` |
| `VbtcWithdrawalUnrecordedError` | La transacción de Bitcoin de un retiro heredado puede haber salido, pero su finalización no se registró | Nunca vuelvas a ejecutar `completeWithdrawal`. Vuelve a transmitir `signedBtcTxHex` si la transacción no aparece y luego llama a `recordWithdrawalCompletion` |
| `VbtcWithdrawalClosedError` | Un retiro vigilado se cerró sin pagarse | Nada; el vBTC volvió al solicitante. `withdrawal` contiene su estado final |
| `VbtcNodeUnreachableError` | El explorador no pudo llegar al nodo para consultar el estado de un retiro | Vuelve a consultar |
| `PreSignCheckError` | La transacción por firmar no era la que se pidió | No se firmó nada; revisa las entradas |
| `TransactionRefusedError` | El nodo rechazó la transacción | Lee el motivo del nodo en el mensaje |

## Métodos de tokens fungibles (VFX20)

Todo método que modifica estado devuelve `Promise<string | null>` con el mismo contrato que `sendCoin`, respeta `dryRun` y paga la comisión ordinaria de la red con el saldo de VFX del firmante. La dirección del firmante es la dirección que actúa: el propietario para emitir, pausar, bloquear, cambiar la titularidad y crear temas; el tenedor para transferir, quemar y votar.

### `deployToken(signer, params)`

Despliega un contrato de token fungible cuyo propietario es el firmante. El contenido se compila en el nodo a través de Spyglass; el despliegue de tipo 17 resultante se envía desde la dirección del firmante.

**Parámetros** (`DeployTokenParams`):
- `name` (string)
- `ticker` (string): 20 caracteres como máximo; se guarda en mayúsculas
- `description` (string, opcional): por defecto, `name`
- `decimalPlaces` (number, opcional): de 1 a 18, 8 por defecto
- `initialSupply` (number, opcional): tokens enteros que se emiten para quien despliega al momento de la creación. Debe ser `0` para un token emitible: emite el saldo inicial con `mintToken` después del despliegue. Un token no emitible necesita un suministro positivo.
- `mintable`, `burnable`, `voting` (boolean, opcional): `false` por defecto
- `image` (`TokenImage`, opcional): `url` debe poder descargarse públicamente, porque Spyglass la descarga en el nodo como el activo principal del contrato. `thumbnailBase64` es la imagen pequeña en línea que muestran las billeteras; sin ella, el nodo usa su imagen de token predeterminada.

**Devuelve:** `Promise<{ transactionHash: string; scIdentifier: string } | null>`: el id del contrato se conoce antes del envío, así que también se devuelve con `dryRun`.

```typescript
const deployed = await client.deployToken(signer, {
  name: 'Acme Fund I',
  ticker: 'ACME1',
  description: 'Units of Acme Fund I',
  mintable: true,
  burnable: true,
});
// deployed.scIdentifier is what every later call is addressed to
```

### `mintToken(signer, { scIdentifier, amount, ticker?, name? })`

Solo el propietario; el token debe ser emitible. Los tokens se acreditan al firmante.

### `transferToken(signer, { scIdentifier, toAddress, amount, ticker?, name? })`

Mueve `amount` del firmante a `toAddress`.

### `burnToken(signer, { scIdentifier, amount, ticker?, name? })`

Quema del propio saldo del firmante; el token debe ser quemable. Solo un tenedor puede quemar sus propios tokens: no existe la quema por parte del emisor.

### `toggleTokenPause(signer, { scIdentifier })`

Solo el propietario. Alterna el token entre pausado (sin transferencias) y activo. El nodo invierte el estado que tenga en ese momento, así que nunca envíes esto dos veces para un mismo cambio deseado. El SDK lee primero el `is_paused` actual desde Spyglass y envía el estado resultante en el campo `Pause` de la transacción, como hace el propio endpoint del nodo; los exploradores y las billeteras muestran ese campo. Lanza un error si no puede leer el estado actual.

### `banTokenAddress(signer, { scIdentifier, address })`

Solo el propietario. Impide que `address` envíe el token. Todavía puede recibirlo, y la red no tiene forma de levantar un bloqueo.

### `transferTokenOwnership(signer, { scIdentifier, toAddress })`

Solo el propietario. Entrega el rol de propietario a `toAddress`.

### `createTokenVoteTopic(signer, { scIdentifier, name, description, votingDays, minimumVoteRequirement, blockHeight? })`

Solo el propietario; el token debe tener la votación habilitada. Abre un tema de sí o no durante `votingDays` días, anclado a la altura de bloque actual (que se obtiene de Spyglass, salvo que indiques `blockHeight`).

### `castTokenVote(signer, { scIdentifier, topicUid, vote, ownerAddress? })`

Emite el voto del firmante. La transacción va dirigida al propietario del token, que se busca en Spyglass salvo que lo indiques.

### Lecturas de tokens

- `listFungibleTokens(page?, limit?)` → `PaginatedResponse<FungibleToken>`
- `getFungibleToken(scIdentifier)` → `{ token: FungibleToken; holders: Record<string, number> }`
- `getFungibleTokenBalances(address)` → `FungibleTokenBalance[]` (una dirección que Spyglass nunca vio devuelve `[]`)
- `listTokenVotingTopics(scIdentifier, page?, limit?)` → `PaginatedResponse<TokenVotingTopic>`
- `getTokenVotingTopic(topicId)` → `TokenVotingTopic`

`ticker` y `name` viajan en cada transacción de token para los indexadores y las billeteras; si se omiten, el SDK los lee primero desde Spyglass.

## Métodos de cuentas de reserva (cuenta de bóveda)

Una cuenta de reserva es una dirección `xRBX…` sobre el mismo material de claves que una dirección ordinaria, con un prefijo de versión distinto. Los envíos desde ella esperan un tiempo de desbloqueo (24 horas como mínimo) y se pueden devolver (callback) hasta que se liquidan; una clave de recuperación puede vaciar la bóveda (vault). El nodo aplica la demora a los envíos de VFX, vBTC y NFTs; una transferencia de token fungible desde una bóveda lleva el tiempo de desbloqueo, pero se liquida de inmediato.

### Claves

- `reserveKeypairFromPrivateKey(mainPrivateKey)` → `ReserveKeypair`: la bóveda que la billetera web vincula con una cuenta principal, derivada de la misma forma (semilla a partir de los primeros 32 caracteres hexadecimales más un contador, con reintentos hasta que la dirección sea `xRBX`; la clave de recuperación usa como semilla la clave de la bóveda). Las pruebas de compatibilidad la fijan contra el paquete de generación de claves de la billetera.
- `reserveKeypairFromReservePrivateKey(reservePrivateKey)`: solo a partir de la clave de la bóveda; la clave de recuperación se deriva de ella.
- `reserveKeypairFromRestoreCode(code)`: a partir de `base64("<privateKey>//<recoveryPrivateKey>")`, el código que imprime la CLI y que respalda la billetera. La clave de recuperación del código se usa tal cual.
- `generateReserveKeypair()`: una bóveda independiente sobre una clave nueva.
- `reserveAddressFromPublic(publicKeyHex)`: la dirección `xRBX` de una clave pública, para claves de bóveda guardadas en un HSM.

Firma con el propio objeto `ReserveKeypair`. Su clave privada por sí sola se resuelve a la dirección ordinaria de la clave. Un `Signer` cuya `address` tiene la forma `xRBX` se verifica contra `reserveAddressFromPublic` y firma por la bóveda.

### `registerReserveAccount(signer, { recoveryAddress? })`

Activa una bóveda fondeada con un `Register()` de 4 VFX que indica la dirección de recuperación. La bóveda ya debe tener los 4 VFX, más la comisión, más el mínimo de 0.5 VFX que el nodo mantiene en las cuentas de reserva (5 VFX es el monto con el que la fondea la billetera). `recoveryAddress` viene de un `ReserveKeypair`; un `Signer` debe proporcionarla, y debe ser una cuenta ordinaria.

### `sendCoin(keypair, toAddress, amount, { unlockHours? })`

Desde una bóveda, el envío se liquida después de `unlockHours` (24 por defecto, el mínimo de la red) y se puede devolver antes de ese momento. Pedir menos de 24 horas, o indicar `unlockHours` desde una cuenta ordinaria, lanza un error antes de cualquier solicitud. Todo método de token acepta el mismo `unlockHours` para los envíos desde una bóveda.

### `callBackReserveTransaction(signer, { hash })`

Cancela un envío pendiente desde la bóveda antes de su hora de desbloqueo. `hash` es el hash del envío. El nodo lo rechaza una vez que se liquidó, y solo la bóveda que lo envió puede devolverlo.

### `recoverReserveAccount(signer, { recoverySigner?, recoveryAddress? })`

Vacía la bóveda hacia su dirección de recuperación: los envíos pendientes se revierten y el saldo se mueve. Se necesitan dos firmas. La clave de la bóveda firma la transacción; la clave de recuperación firma `${SignatureTime}${recoveryAddress}`. Un `ReserveKeypair` lleva ambas. Con un `Signer` para la bóveda, pasa `recoverySigner` (un par de claves u otro `Signer`) para la clave de recuperación. El nodo acepta la firma de recuperación durante diez minutos.

### No disponible desde una bóveda

`deployToken`, `buyVfxDomain` y `buyBtcDomain` lanzan un error cuando los firma una bóveda: la red solo permite esos tipos de transacción desde una cuenta ordinaria.

### Lectura del estado de una bóveda

`getAddressDetails` sobre la dirección `xRBX` devuelve `activated` (se envió un `Register()`), `deactivated` (se envió un `Recover()`) y `balanceLocked` (envíos que todavía esperan liquidarse). `listTransactionsForAddress` muestra el `unlock_time` de cada envío pendiente y cualquier `callback_details`.

## Operaciones con direcciones

### `getAddressDetails(address)`

Obtiene información detallada sobre una dirección de VFX.

**Parámetros:**
- `address` (string): la dirección de VFX que consultas

**Devuelve:** `Promise<VfxAddress>` - Objeto con los detalles de la dirección

**Objeto de respuesta:**
```typescript
{
  address: string;
  balance: number;
  txCount: number;
  adnr?: string; // Domain name if owned
}
```

**Ejemplo:**
```typescript
const details = await client.getAddressDetails("VFX_ADDRESS");
console.log(`Balance: ${details.balance} VFX`);
console.log(`Transactions: ${details.txCount}`);
console.log(`Domain: ${details.adnr || 'None'}`);
```

### `domainAvailable(domain)`

Verifica si un nombre de dominio está disponible para comprarse.

**Parámetros:**
- `domain` (string): el nombre de dominio que verificas

**Devuelve:** `Promise<boolean>` - True si está disponible, false si está ocupado

**Ejemplo:**
```typescript
const isAvailable = await client.domainAvailable("myapp.vfx");
if (isAvailable) {
  console.log("Domain is available!");
} else {
  console.log("Domain is already taken");
}
```

### `lookupDomain(domain)`

Resuelve un nombre de dominio a su dirección de VFX.

**Parámetros:**
- `domain` (string): el nombre de dominio que resuelves

**Devuelve:** `Promise<string>` - La dirección de VFX asociada al dominio

**Ejemplo:**
```typescript
try {
  const address = await client.lookupDomain("example.vfx");
  console.log(`example.vfx resolves to: ${address}`);
} catch (error) {
  console.log("Domain not found");
}
```

### `lookupBtcDomain(domain)`

Resuelve un nombre de dominio a su dirección de Bitcoin asociada.

**Parámetros:**
- `domain` (string): el nombre de dominio que resuelves

**Devuelve:** `Promise<string>` - La dirección de Bitcoin asociada al dominio

**Ejemplo:**
```typescript
try {
  const btcAddress = await client.lookupBtcDomain("example.vfx");
  console.log(`Bitcoin address: ${btcAddress}`);
} catch (error) {
  console.log("No Bitcoin address associated with domain");
}
```

### `listTransactionsForAddress(address, page?, limit?)`

Obtiene el historial de transacciones de una dirección.

**Parámetros:**
- `address` (string): la dirección de VFX que consultas
- `page` (number, opcional): número de página para la paginación (valor predeterminado: 1)
- `limit` (number, opcional): cantidad de transacciones por página (valor predeterminado: 10)

**Devuelve:** `Promise<PaginatedResponse<Transaction>>` - Lista paginada de transacciones

**Ejemplo:**
```typescript
const transactions = await client.listTransactionsForAddress(
  "VFX_ADDRESS",
  1,  // page
  20  // limit
);

console.log(`Found ${transactions.data.length} transactions`);
transactions.data.forEach(tx => {
  console.log(`TX: ${tx.hash}, Amount: ${tx.amount}`);
});
```

## Tipos

### Keypair

```typescript
interface Keypair {
  private: string;
  public: string;
  address: string;
}
```

### Signer

```typescript
interface Signer {
  address: string;
  publicKey: string;
  signDigest(digestHex: string): Promise<Uint8Array | string> | Uint8Array | string;
}
```

### ReserveKeypair

```typescript
interface ReserveKeypair extends Keypair {
  recoveryPrivateKey: string;
  recoveryPublicKey: string;
  recoveryAddress: string;
  restoreCode: string;   // base64("<privateKey>//<recoveryPrivateKey>")
}
```

### FungibleToken

```typescript
interface FungibleToken {
  sc_identifier: string;
  name: string;
  ticker: string;
  description: string | null;
  owner_address: string;
  can_mint: boolean;
  can_burn: boolean;
  can_vote: boolean;
  created_at: string;
  initial_supply: number;
  circulating_supply: number;
  decimal_places: number;
  image_url: string | null;
  is_paused: boolean;
  banned_addresses: string[];
  nsfw: boolean;
}
```

### VfxAddress

```typescript
interface VfxAddress {
  address: string;
  balance: number;
  txCount: number;
  adnr?: string;
}
```

### Transaction

```typescript
interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  timestamp: number;
  blockHeight?: number;
  status: 'pending' | 'confirmed' | 'failed';
}
```

### PaginatedResponse

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

## Manejo de errores

Todos los métodos asíncronos pueden lanzar errores. Escenarios de error comunes:

### Errores de red
```typescript
try {
  const details = await client.getAddressDetails(address);
} catch (error) {
  if (error.message.includes('Network')) {
    console.log('Network connectivity issue');
  }
}
```

### Saldo insuficiente
```typescript
try {
  await client.sendCoin(keypair, toAddress, amount);
} catch (error) {
  if (error.message.includes('insufficient')) {
    console.log('Not enough VFX balance');
  }
}
```

### Errores de dominio
```typescript
try {
  await client.buyVfxDomain(keypair, domain);
} catch (error) {
  if (error.message.includes('already exists')) {
    console.log('Domain is already taken');
  } else if (error.message.includes('already has')) {
    console.log('Address already owns a domain');
  }
}
```

## Constantes

### Redes

```typescript
enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet'
}
```

### Tipos de transacción

```typescript
enum TxType {
  Transfer = 'transfer',
  Adnr = 'adnr'
}
```

## Buenas prácticas

### Seguridad
- Nunca registres en logs ni expongas las claves privadas
- Valida las direcciones antes de enviar transacciones
- Usa el modo de prueba (dry run) para hacer pruebas

### Rendimiento
- Guarda en caché los detalles de las direcciones cuando sea posible
- Usa la paginación para listas grandes de transacciones
- Maneja con cuidado los tiempos de espera agotados de la red

### Manejo de errores
- Envuelve siempre las llamadas asíncronas en try-catch
- Muestra a los usuarios mensajes de error claros
- Reintenta las solicitudes fallidas con retroceso exponencial

## Ejemplos

### Implementación completa de una billetera

```typescript
class VfxWallet {
  private client: VfxClient;
  private keypair: Keypair | null = null;

  constructor(network: Network) {
    this.client = new VfxClient(network);
  }

  async createWallet(): Promise<{ mnemonic: string; address: string }> {
    const mnemonic = this.client.generateMnemonic(12);
    const privateKey = this.client.privateKeyFromMneumonic(mnemonic, 0);

    this.keypair = {
      private: privateKey,
      public: this.client.publicFromPrivate(privateKey),
      address: this.client.addressFromPrivate(privateKey)
    };

    return {
      mnemonic,
      address: this.keypair.address
    };
  }

  async getBalance(): Promise<number> {
    if (!this.keypair) throw new Error('Wallet not initialized');

    const details = await this.client.getAddressDetails(this.keypair.address);
    return details.balance;
  }

  async send(toAddress: string, amount: number) {
    if (!this.keypair) throw new Error('Wallet not initialized');

    return await this.client.sendCoin(this.keypair, toAddress, amount);
  }
}
```

## Notas de migración

### De v1.x a v2.x

- El constructor ahora requiere el parámetro de red explícito
- Se agregó el espacio de nombres `btc` para las funciones de Bitcoin
- Nuevo método de lista de transacciones con paginación
- Mensajes y tipos de error mejorados
