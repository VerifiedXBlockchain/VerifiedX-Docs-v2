---
sourceHash: "70d69b3d5eb4"
title: "Referencia de la API de BtcClient"
description: Referencia de BtcClient en el VerifiedX Web SDK, que abarca la generación de billeteras de Bitcoin, la información de direcciones, las transacciones, las tasas de comisión y la firma de mensajes.
sidebar:
  order: 2
---

`BtcClient` ofrece administración de billeteras de Bitcoin, transacciones e información de comisiones a través de una API al estilo de mempool.space (Esplora): mempool.space para mainnet y, en testnet, la API del signet de VerifiedX cuando la pasas (consulta el constructor).

## Constructor

### `new btc.BtcClient(network?, dryRunOrOptions?)`

Crea una nueva instancia de BtcClient.

**Parámetros:**
- `network` ('mainnet' | 'testnet', opcional): la red de Bitcoin (predeterminada: `'mainnet'`). `'testnet'` usa los formatos de dirección de la testnet de Bitcoin (`tb1…`, `m…`/`n…`, `2…`), que comparte el signet de VerifiedX.
- `dryRunOrOptions` (boolean | `BtcClientOptions`, opcional): `true` para un cliente de ejecución de prueba (dry run), o `{ dryRun?: boolean, apiBaseUrl?: string }`. `apiBaseUrl` sobrescribe el origen de la API de Esplora, incluido `/api`.

Valores predeterminados de la API en `vfx-web-sdk` 9.0.3: `https://mempool.space/api` en mainnet y `https://mempool.space/testnet4/api` en testnet. La testnet de VerifiedX sigue el [signet de VerifiedX](/es/build/signet/), no testnet4, así que en testnet pasa `{ apiBaseUrl: 'https://signet.verifiedx.io/api' }`. Sin él, los saldos, los UTXO y las transmisiones van a testnet4.

**Ejemplo:**
```typescript
import { btc } from 'vfx-web-sdk';

// VerifiedX signet (the Bitcoin side of the VFX testnet)
const client = new btc.BtcClient('testnet', { apiBaseUrl: 'https://signet.verifiedx.io/api' });
const mainnetClient = new btc.BtcClient('mainnet');
const dryRunClient = new btc.BtcClient('testnet', { dryRun: true, apiBaseUrl: 'https://signet.verifiedx.io/api' });
```

## Generación de billeteras

### `generatePrivateKey()`

Genera una nueva billetera de Bitcoin aleatoria con todos los tipos de dirección.

**Devuelve:** `BtcKeypair` - Par de claves completo con varios formatos de dirección

**Objeto de respuesta:**
```typescript
{
  privateKey: string | undefined;  // hex
  publicKey: string;
  wif: string;
  address: string | undefined;     // Default address (bech32)
  addresses: {
    p2pkh: string | undefined;     // Legacy (starts with 1; m or n on testnet)
    p2sh: string | undefined;      // Nested SegWit (starts with 3; 2 on testnet)
    bech32: string | undefined;    // Native SegWit (starts with bc1q/tb1q)
    bech32m: string | undefined;   // Taproot (starts with bc1p/tb1p)
  };
}
```

**Ejemplo:**
```typescript
const keypair = client.generatePrivateKey();
console.log('Default address:', keypair.address);
console.log('Legacy address:', keypair.addresses.p2pkh);
console.log('SegWit address:', keypair.addresses.bech32);
console.log('Taproot address:', keypair.addresses.bech32m);
```

### `generateMnemonic()`

Genera una nueva billetera con una frase de recuperación (mnemónico) BIP39 de 24 palabras.

**Devuelve:** `BtcKeypair` - Par de claves con `mnemonic` establecido para restaurarla

**Objeto de respuesta:**
```typescript
{
  mnemonic: string;  // 24 words
  privateKey: string | undefined;
  publicKey: string;
  wif: string;
  address: string | undefined;
  addresses: BtcAddresses;
}
```

**Ejemplo:**
```typescript
const wallet = client.generateMnemonic();
console.log('Mnemonic:', wallet.mnemonic);
console.log('Address:', wallet.address);
```

### `privateKeyFromMnemonic(mnemonic, index?)`

Deriva una clave privada a partir de una frase de recuperación.

**Parámetros:**
- `mnemonic` (string): la frase de recuperación BIP39
- `index` (number, opcional): el índice de derivación (predeterminado: 0)

**Devuelve:** `BtcKeypair` - Par de claves derivado

**Ejemplo:**
```typescript
const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const restoredWallet = client.privateKeyFromMnemonic(mnemonic, 0);
console.log('Restored address:', restoredWallet.address);
```

### `publicFromPrivate(privateKey)`

Deriva la clave pública y las direcciones a partir de una clave privada.

**Parámetros:**
- `privateKey` (string): la clave privada en formato hexadecimal

**Devuelve:** `BtcKeypair` - Par de claves completo derivado de la clave privada

**Ejemplo:**
```typescript
const privateKey = "your-private-key-hex";
const keypair = client.publicFromPrivate(privateKey);
```

### `addressFromPrivate(privateKey)`

Igual que `publicFromPrivate`: devuelve el `BtcKeypair` completo para una clave privada en hexadecimal; lee `.address` para obtener la dirección predeterminada (bech32).

**Ejemplo:**
```typescript
const address = client.addressFromPrivate(privateKey).address;
```

### `addressFromWif(wif)`

Importa una billetera desde el formato Wallet Import Format (WIF).

**Parámetros:**
- `wif` (string): la cadena WIF

**Devuelve:** `BtcKeypair` - Par de claves importado desde WIF

**Ejemplo:**
```typescript
const wif = "your-wif-string";
const importedWallet = client.addressFromWif(wif);
```

### `generateEmailKeypair(email, password, index?)`

Genera una billetera determinista a partir de un correo electrónico y una contraseña.

**Parámetros:**
- `email` (string): dirección de correo electrónico
- `password` (string): contraseña
- `index` (number, opcional): índice de derivación (predeterminado: 0)

**Devuelve:** `BtcKeypair` - Par de claves determinista

**Ejemplo:**
```typescript
const emailWallet = client.generateEmailKeypair(
  "user@example.com",
  "secure-password",
  0
);
```

## Información de direcciones

### `getAddressInfo(address, inSatoshis?)`

Obtiene información detallada sobre una dirección de Bitcoin, contando solo las transacciones confirmadas.

**Parámetros:**
- `address` (string): la dirección de Bitcoin que consultas
- `inSatoshis` (boolean, opcional): `true` (predeterminado) para satoshis, `false` para BTC

**Devuelve:** `Promise<AccountInfo>` - Información de la dirección. Lanza `Error fetching address info: <status>` cuando la API rechaza la solicitud (por ejemplo, con una dirección no válida)

**Objeto de respuesta:**
```typescript
{
  balance: number;        // Balance (satoshis by default)
  totalRecieved: number;  // Total received (spelling as in the SDK)
  totalSent: number;      // Total sent
  txCount: number;        // Number of transactions
}
```

**Ejemplo:**
```typescript
const addressInfo = await client.getAddressInfo("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");
console.log(`Balance: ${addressInfo.balance} satoshis`);
console.log(`BTC Balance: ${addressInfo.balance / 100000000} BTC`);
```

### `getTransactions(address, limit?, before?)`

Obtiene el historial de transacciones de una dirección: la primera página de la API, de la más reciente a la más antigua, incluidas las no confirmadas.

**Parámetros:**
- `address` (string): la dirección de Bitcoin que consultas
- `limit` (number, opcional) y `before` (number | null, opcional): se aceptan, pero en 9.0.3 no se envían a la API, así que no tienen efecto

**Devuelve:** `Promise<Transaction[]>` - Arreglo de transacciones

**Objeto de transacción:**
```typescript
{
  txid: string;
  version: number;
  locktime: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout?: {
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      scriptpubkey_address: string;
      value: number;
    };
    scriptsig: string;
    scriptsig_asm: string;
    witness: string[];
    is_coinbase: boolean;
    sequence: number;
  }>;
  vout: Array<{
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: number;
  }>;
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}
```

**Ejemplo:**
```typescript
const transactions = await client.getTransactions(address);
transactions.forEach(tx => {
  console.log(`TX: ${tx.txid}`);
  console.log(`Confirmed: ${tx.status.confirmed}`);
  console.log(`Fee: ${tx.fee} satoshis`);
});
```

## Operaciones con transacciones

### `sendBtc(wif, toAddress, amount, feeRate?)`

Construye, firma y transmite un pago (método simplificado). Gasta los UTXO de la dirección SegWit nativa (bech32) del WIF y le devuelve el cambio.

**Parámetros:**
- `wif` (string): la clave en Wallet Import Format del remitente
- `toAddress` (string): la dirección de Bitcoin del destinatario
- `amount` (number): el monto que envías, en **BTC** (no en satoshis)
- `feeRate` (number, opcional): tasa de comisión en sat/vB (predeterminada: 0 = la tasa económica de la API, con 2 en testnet y 5 en mainnet como respaldo)

**Devuelve:** `Promise<string | null>` - El txid, o `null` cuando no se envió nada (no se pudo construir la transacción, por ejemplo por falta de fondos, o la red la rechazó; el motivo queda registrado). Lanza `BtcBroadcastUnknownError` cuando la transmisión salió pero no llegó una respuesta definitiva: no vuelvas a llamar a `sendBtc` para ese pago; resuélvelo con `checkBroadcast(error.signedTxHex)` y `broadcastTransaction(error.signedTxHex)`.

**Ejemplo:**
```typescript
const txId = await client.sendBtc(
  wallet.wif,
  "tb1qrecipient...",
  0.0005, // 50,000 satoshis
  2       // 2 sat/vB fee rate
);
console.log('Transaction sent:', txId);
```

### `createTransaction(wif, toAddress, amount, feeRate?)`

Crea y firma una transacción de Bitcoin sin transmitirla. Un cliente de ejecución de prueba devuelve `result: 'dry_run_transaction_hex'`.

**Parámetros:**
- `wif` (string): el WIF del remitente
- `toAddress` (string): la dirección del destinatario
- `amount` (number): monto en **BTC**
- `feeRate` (number, opcional): tasa de comisión en sat/vB

**Devuelve:** `Promise<CreateTxResponse>` - Resultado de la creación de la transacción

**Objeto de respuesta:**
```typescript
{
  success: boolean;
  result: string | null;  // Signed raw transaction hex
  error: string | null;   // Error message if failed (e.g. "Insufficient funds: …")
}
```

**Ejemplo:**
```typescript
const result = await client.createTransaction(
  wallet.wif,
  "tb1qrecipient...",
  0.001, // 100,000 satoshis
  15
);

if (result.success) {
  console.log('Transaction created:', result.result);
} else {
  console.error('Failed:', result.error);
}
```

### `broadcastTransaction(rawTransaction)`

Transmite una transacción en bruto firmada. Puedes repetirla sin riesgo con el mismo hex: una transacción que la red ya tiene se informa como aceptada. Un cliente de ejecución de prueba devuelve `result: 'dry_run_transaction_id'`.

**Parámetros:**
- `rawTransaction` (string): la transacción en bruto en hexadecimal

**Devuelve:** `Promise<BroadcastTxResponse>` - `{ success, result: txid | null, error }`. `success: false` significa que la red no la aceptó; un resultado desconocido (sin respuesta en 30 segundos, o una conexión caída) lanza `BtcBroadcastUnknownError` con `txid` y `signedTxHex`

**Ejemplo:**
```typescript
const broadcastResult = await client.broadcastTransaction(rawTransaction);
if (broadcastResult.success) {
  console.log('Transaction ID:', broadcastResult.result);
}
```

### `checkBroadcast(signedTxHex)`

Indica en qué estado está una transacción firmada en la red, para resolver un `BtcBroadcastUnknownError`.

**Devuelve:** `Promise<BroadcastCheck>`, uno de:
- `{ state: 'found', txid, confirmed }`: está en el mempool o en un bloque
- `{ state: 'conflicted', txid, conflictingTxid }`: otra transacción gasta una de sus entradas, así que nunca podrá confirmarse
- `{ state: 'absent', txid }`: no se ha visto y sus entradas no están gastadas; vuelve a transmitir el mismo hex
- `{ state: 'unresolved', txid }`: una entrada la gasta una transacción que la API no informa

Lanza un error cuando la API no puede responder.

**Ejemplo:**
```typescript
const check = await client.checkBroadcast(signedTxHex);
if (check.state === 'absent') {
  await client.broadcastTransaction(signedTxHex);
}
```

### `getRawTransaction(txId)`

Obtiene los bytes en bruto de una transacción.

**Devuelve:** `Promise<Buffer>`

```typescript
const raw = await client.getRawTransaction(txId);
const hex = raw.toString('hex');
```

## Información de la red

### `getFeeRates()`

Obtiene las tasas de comisión actuales de la red.

**Devuelve:** `Promise<FeeRates | null>` - Tasas de comisión actuales, o `null` si la API no está disponible o responde con un error (nunca lanza errores). En el signet de VerifiedX, todas las tasas son de 1 sat/vB

**Objeto de respuesta:**
```typescript
{
  fastestFee: number;    // Fastest confirmation (sat/vB)
  halfHourFee: number;   // ~30 minutes (sat/vB)
  hourFee: number;       // ~1 hour (sat/vB)
  economyFee: number;    // Economic rate (sat/vB)
  minimumFee: number;    // Minimum fee (sat/vB)
}
```

**Ejemplo:**
```typescript
const fees = await client.getFeeRates();
if (fees) {
  console.log('Fast fee:', fees.fastestFee, 'sat/vB');
  console.log('Standard fee:', fees.hourFee, 'sat/vB');
  console.log('Economy fee:', fees.economyFee, 'sat/vB');
}
```

## Firma de mensajes

### `getSignature(message, privateKey)`

Firma un mensaje con una clave privada.

**Parámetros:**
- `message` (string): el mensaje que firmas
- `privateKey` (string): la clave privada en formato hexadecimal

**Devuelve:** `string` - Firma del mensaje

**Ejemplo:**
```typescript
const signature = client.getSignature("Hello Bitcoin!", privateKey);
console.log('Signature:', signature);
```

### `getSignatureFromWif(message, wif)`

Firma un mensaje con una clave WIF.

**Parámetros:**
- `message` (string): el mensaje que firmas
- `wif` (string): la clave WIF

**Devuelve:** `string` - Firma del mensaje

**Ejemplo:**
```typescript
const signature = client.getSignatureFromWif("Hello Bitcoin!", wallet.wif);
```

## Tipos

Todos se exportan desde el espacio de nombres `btc` (`import type { btc } from 'vfx-web-sdk'` y luego `btc.BtcKeypair`), y cada uno también con un nombre con el prefijo `I` (`IBtcKeypair`, …).

### BtcKeypair

```typescript
interface BtcKeypair {
  address: string | undefined;
  addresses: BtcAddresses;
  wif: string;
  privateKey: string | undefined;
  publicKey: string;
  mnemonic?: string;  // set by generateMnemonic
}

interface BtcAddresses {
  p2pkh: string | undefined;
  p2sh: string | undefined;
  bech32: string | undefined;
  bech32m: string | undefined;
}
```

### AccountInfo

```typescript
interface AccountInfo {
  balance: number;
  totalRecieved: number;
  totalSent: number;
  txCount: number;
}
```

### CreateTxResponse / BroadcastTxResponse

```typescript
interface CreateTxResponse {
  success: boolean;
  result: string | null;
  error: string | null;
}
// BroadcastTxResponse has the same shape; result is the txid
```

### BroadcastCheck

```typescript
type BroadcastCheck =
  | { state: 'found'; txid: string; confirmed: boolean }
  | { state: 'conflicted'; txid: string; conflictingTxid: string }
  | { state: 'absent'; txid: string }
  | { state: 'unresolved'; txid: string };
```

### FeeRates

```typescript
interface FeeRates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}
```

## Manejo de errores

Las operaciones de Bitcoin informan los fallos de distintas formas:

### Saldo insuficiente
`sendBtc` no lanza un error por un pago que no puede construir; registra el motivo y se resuelve en `null`. Usa `createTransaction` para leer el motivo:
```typescript
const created = await client.createTransaction(wif, toAddress, amount);
if (!created.success) {
  console.log(created.error); // "Insufficient funds: …" or "No UTXOs found for the given address."
}
```

### Resultado de transmisión desconocido
```typescript
import { BtcBroadcastUnknownError } from 'vfx-web-sdk';

try {
  await client.sendBtc(wif, toAddress, amount);
} catch (error) {
  if (error instanceof BtcBroadcastUnknownError) {
    const check = await client.checkBroadcast(error.signedTxHex);
    if (check.state === 'absent') await client.broadcastTransaction(error.signedTxHex);
  }
}
```

### Dirección no válida
```typescript
try {
  await client.getAddressInfo(address);
} catch (error) {
  console.log(error.message); // "Error fetching address info: 400"
}
```

### Errores de red
```typescript
const fees = await client.getFeeRates();
if (!fees) {
  // API unreachable: fall back to a default fee rate
}
```

## Buenas prácticas

### Seguridad
- **Guarda los WIF de forma segura**: las claves WIF dan control total sobre los fondos
- **Valida las direcciones**: verifica siempre la dirección del destinatario antes de enviar
- **Usa tasas de comisión adecuadas**: equilibra velocidad y costo

### Rendimiento
- **Guarda en caché las tasas de comisión**: no consultes las comisiones en cada transacción
- **Agrupa las consultas de direcciones**: reúne varias consultas de direcciones cuando sea posible
- **Maneja los límites de solicitudes**: la API de mempool.space limita la cantidad de solicitudes

### Tipos de dirección
- **Usa bech32 en aplicaciones nuevas**: comisiones más bajas y mejor compatibilidad
- **Admite varios formatos**: para lograr la máxima compatibilidad
- **Usa bech32 por defecto**: salvo que haya requisitos específicos que indiquen lo contrario

## Constantes

### Constantes de conversión
```typescript
const BTC_TO_SATOSHI_MULTIPLIER = 100000000;
const SATOSHI_TO_BTC_MULTIPLIER = 0.00000001;
```

### Redes
El cliente configura automáticamente la red de Bitcoin correcta según el parámetro del constructor:
- `'mainnet'`: la mainnet de Bitcoin
- `'testnet'`: los formatos de dirección de la testnet de Bitcoin. Para la testnet de VerifiedX, pasa `apiBaseUrl: 'https://signet.verifiedx.io/api'` para usar el [signet de VerifiedX](/es/build/signet/), un signet privado de Bitcoin con bloques de 10 minutos y direcciones `tb1…` (explorador `https://signet.verifiedx.io`); el valor predeterminado de 9.0.3 es la API pública de testnet4. Los BTC de prueba se obtienen del [faucet de testnet](https://spyglass-testnet.verifiedx.io/faucet) (pestaña Signet BTC).

## Ejemplos

### Implementación completa de una billetera de Bitcoin

```typescript
import { btc } from 'vfx-web-sdk';

class BitcoinWallet {
  private client: btc.BtcClient;
  private keypair: btc.BtcKeypair | null = null;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    this.client = network === 'testnet'
      ? new btc.BtcClient('testnet', { apiBaseUrl: 'https://signet.verifiedx.io/api' })
      : new btc.BtcClient('mainnet');
  }

  createWallet(): { mnemonic: string; address: string } {
    const wallet = this.client.generateMnemonic();
    this.keypair = wallet;

    return {
      mnemonic: wallet.mnemonic!,
      address: wallet.address!
    };
  }

  restoreWallet(mnemonic: string, index: number = 0): string {
    this.keypair = this.client.privateKeyFromMnemonic(mnemonic, index);
    return this.keypair.address!;
  }

  async getBalance(): Promise<number> {
    if (!this.keypair) throw new Error('Wallet not initialized');

    const info = await this.client.getAddressInfo(this.keypair.address!);
    return info.balance;
  }

  async getBalanceBTC(): Promise<number> {
    const satoshis = await this.getBalance();
    return satoshis / 100000000;
  }

  // amount in BTC; resolves to the txid, or null when nothing was sent
  async send(toAddress: string, amountBtc: number, feeRate?: number): Promise<string | null> {
    if (!this.keypair) throw new Error('Wallet not initialized');

    return await this.client.sendBtc(
      this.keypair.wif,
      toAddress,
      amountBtc,
      feeRate
    );
  }

  async getTransactionHistory(): Promise<btc.Transaction[]> {
    if (!this.keypair) throw new Error('Wallet not initialized');

    return await this.client.getTransactions(this.keypair.address!);
  }

  signMessage(message: string): string {
    if (!this.keypair) throw new Error('Wallet not initialized');

    return this.client.getSignatureFromWif(message, this.keypair.wif);
  }
}
```

## Integración con VFX

Para aplicaciones multicadena que combinan funciones de Bitcoin y VFX, consulta la [guía de integración multicadena](/es/build/sdk/cross-chain/).
