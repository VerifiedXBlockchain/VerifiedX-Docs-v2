---
sourceHash: 5f3e6421c543
title: "Referencia de la API de BtcClient"
description: Referencia de BtcClient en el VerifiedX Web SDK, que abarca la generación de billeteras de Bitcoin, la información de direcciones, las transacciones, las tasas de comisión y la firma de mensajes.
sidebar:
  order: 2
---

`BtcClient` ofrece administración de billeteras de Bitcoin, transacciones e información de comisiones a través de una API al estilo de mempool.space (Esplora): mempool.space para mainnet y la API del signet de VerifiedX para testnet.

## Constructor

### `new btc.BtcClient(network, options?)`

Crea una nueva instancia de BtcClient.

**Parámetros:**
- `network` ('mainnet' | 'testnet'): la red de Bitcoin a la que te conectas. `'testnet'` es la red de Bitcoin que sigue la testnet de VerifiedX: el signet de VerifiedX.
- `options` (opcional): `{ dryRun?: boolean, apiBaseUrl?: string }`. `apiBaseUrl` sobrescribe el origen de la API de Esplora, incluido `/api`. Valores predeterminados: `https://mempool.space/api` en mainnet; en testnet, `https://signet.verifiedx.io/api` a partir del SDK 3.7.0. El SDK 3.6.0 y las versiones anteriores usan por defecto Bitcoin testnet4 en testnet, que la testnet de VerifiedX ya no usa: con esas versiones, pasa `{ apiBaseUrl: 'https://signet.verifiedx.io/api' }`.

**Ejemplo:**
```typescript
import { btc } from 'vfx-web-sdk';

const client = new btc.BtcClient('testnet');
const mainnetClient = new btc.BtcClient('mainnet');

// SDK 3.6.0 and earlier: point testnet at the VerifiedX signet
const signetClient = new btc.BtcClient('testnet', { apiBaseUrl: 'https://signet.verifiedx.io/api' });
```

## Generación de billeteras

### `generatePrivateKey()`

Genera una nueva billetera de Bitcoin aleatoria con todos los tipos de dirección.

**Devuelve:** `BtcKeypair` - Par de claves completo con varios formatos de dirección

**Objeto de respuesta:**
```typescript
{
  privateKey: string;
  publicKey: string;
  wif: string;
  address: string; // Default address (bech32)
  addresses: {
    p2pkh: string;    // Legacy (starts with 1)
    p2sh: string;     // Nested SegWit (starts with 3)
    bech32: string;   // Native SegWit (starts with bc1/tb1)
    bech32m: string;  // Taproot (starts with bc1p/tb1p)
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

Genera una nueva billetera con una frase de recuperación (mnemónico) BIP39.

**Devuelve:** `BtcMnemonicKeypair` - Par de claves con la frase de recuperación para restaurarla

**Objeto de respuesta:**
```typescript
{
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  wif: string;
  address: string;
  addresses: {
    p2pkh: string;
    p2sh: string;
    bech32: string;
    bech32m: string;
  };
}
```

**Ejemplo:**
```typescript
const wallet = client.generateMnemonic();
console.log('Mnemonic:', wallet.mnemonic);
console.log('Address:', wallet.address);
```

### `privateKeyFromMnemonic(mnemonic, index)`

Deriva una clave privada a partir de una frase de recuperación.

**Parámetros:**
- `mnemonic` (string): la frase de recuperación BIP39
- `index` (number): el índice de derivación (normalmente 0)

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

### `generateEmailKeypair(email, password, index)`

Genera una billetera determinista a partir de un correo electrónico y una contraseña.

**Parámetros:**
- `email` (string): dirección de correo electrónico
- `password` (string): contraseña
- `index` (number): índice de derivación

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

### `getAddressInfo(address)`

Obtiene información detallada sobre una dirección de Bitcoin.

**Parámetros:**
- `address` (string): la dirección de Bitcoin que consultas

**Devuelve:** `Promise<BtcAddressInfo>` - Información de la dirección

**Objeto de respuesta:**
```typescript
{
  address: string;
  balance: number;        // Balance in satoshis
  totalRecieved: number;  // Total received in satoshis
  totalSent: number;      // Total sent in satoshis
  txCount: number;        // Number of transactions
}
```

**Ejemplo:**
```typescript
const addressInfo = await client.getAddressInfo("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");
console.log(`Balance: ${addressInfo.balance} satoshis`);
console.log(`BTC Balance: ${addressInfo.balance / 100000000} BTC`);
```

### `getTransactions(address)`

Obtiene el historial de transacciones de una dirección.

**Parámetros:**
- `address` (string): la dirección de Bitcoin que consultas

**Devuelve:** `Promise<BtcTransaction[]>` - Arreglo de transacciones

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

### `sendBtc(wif, toAddress, amountSats, feeRate?)`

Envía Bitcoin a otra dirección (método simplificado).

**Parámetros:**
- `wif` (string): la clave en Wallet Import Format del remitente
- `toAddress` (string): la dirección de Bitcoin del destinatario
- `amountSats` (number): el monto que envías, en satoshis
- `feeRate` (number, opcional): tasa de comisión en sat/vB (si no la indicas, usa la estimación de la red)

**Devuelve:** `Promise<string>` - ID de la transacción

**Ejemplo:**
```typescript
const txId = await client.sendBtc(
  wallet.wif,
  "bc1qrecipient...",
  50000,  // 0.0005 BTC
  20      // 20 sat/vB fee rate
);
console.log('Transaction sent:', txId);
```

### `createTransaction(wif, toAddress, amountSats, feeRate?)`

Crea una transacción de Bitcoin sin transmitirla.

**Parámetros:**
- `wif` (string): el WIF del remitente
- `toAddress` (string): la dirección del destinatario
- `amountSats` (number): monto en satoshis
- `feeRate` (number, opcional): tasa de comisión en sat/vB

**Devuelve:** `Promise<TransactionResult>` - Resultado de la creación de la transacción

**Objeto de respuesta:**
```typescript
{
  success: boolean;
  result?: string;  // Raw transaction hex
  error?: string;   // Error message if failed
}
```

**Ejemplo:**
```typescript
const result = await client.createTransaction(
  wallet.wif,
  "bc1qrecipient...",
  100000,
  15
);

if (result.success) {
  console.log('Transaction created:', result.result);
} else {
  console.error('Failed:', result.error);
}
```

### `broadcastTransaction(rawTransaction)`

Transmite una transacción en bruto a la red de Bitcoin.

**Parámetros:**
- `rawTransaction` (string): la transacción en bruto en hexadecimal

**Devuelve:** `Promise<TransactionResult>` - Resultado de la transmisión

**Ejemplo:**
```typescript
const broadcastResult = await client.broadcastTransaction(rawTransaction);
if (broadcastResult.success) {
  console.log('Transaction ID:', broadcastResult.result);
}
```

## Información de la red

### `getFeeRates()`

Obtiene las tasas de comisión actuales de la red.

**Devuelve:** `Promise<BtcFeeRates | null>` - Tasas de comisión actuales, o null si no están disponibles

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

### BtcKeypair

```typescript
interface BtcKeypair {
  privateKey: string;
  publicKey: string;
  wif: string;
  address: string;
  addresses: {
    p2pkh: string;
    p2sh: string;
    bech32: string;
    bech32m: string;
  };
}
```

### BtcMnemonicKeypair

```typescript
interface BtcMnemonicKeypair extends BtcKeypair {
  mnemonic: string;
}
```

### BtcAddressInfo

```typescript
interface BtcAddressInfo {
  address: string;
  balance: number;
  totalRecieved: number;
  totalSent: number;
  txCount: number;
}
```

### TransactionResult

```typescript
interface TransactionResult {
  success: boolean;
  result?: string;
  error?: string;
}
```

### BtcFeeRates

```typescript
interface BtcFeeRates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}
```

## Manejo de errores

Las operaciones de Bitcoin pueden fallar por varias razones. Envuelve siempre las llamadas asíncronas en bloques try-catch:

### Saldo insuficiente
```typescript
try {
  await client.sendBtc(wif, toAddress, amount);
} catch (error) {
  if (error.message.includes('insufficient')) {
    console.log('Not enough Bitcoin balance');
  }
}
```

### Dirección no válida
```typescript
try {
  await client.getAddressInfo(address);
} catch (error) {
  if (error.message.includes('address')) {
    console.log('Invalid Bitcoin address format');
  }
}
```

### Errores de red
```typescript
try {
  const fees = await client.getFeeRates();
} catch (error) {
  console.log('Network connectivity issue');
  // Fallback to default fee rates
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
- `'testnet'`: el signet de VerifiedX, un signet privado de Bitcoin con bloques de 10 minutos y direcciones `tb1…` (explorador `https://signet.verifiedx.io`). Los BTC de prueba se obtienen del [faucet de testnet](https://spyglass-testnet.verifiedx.io/faucet) (pestaña Signet BTC).

## Ejemplos

### Implementación completa de una billetera de Bitcoin

```typescript
import { btc } from 'vfx-web-sdk';

class BitcoinWallet {
  private client: btc.BtcClient;
  private keypair: btc.BtcKeypair | null = null;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    this.client = new btc.BtcClient(network);
  }

  createWallet(): { mnemonic: string; address: string } {
    const wallet = this.client.generateMnemonic();
    this.keypair = wallet;

    return {
      mnemonic: wallet.mnemonic,
      address: wallet.address
    };
  }

  restoreWallet(mnemonic: string, index: number = 0): string {
    this.keypair = this.client.privateKeyFromMnemonic(mnemonic, index);
    return this.keypair.address;
  }

  async getBalance(): Promise<number> {
    if (!this.keypair) throw new Error('Wallet not initialized');

    const info = await this.client.getAddressInfo(this.keypair.address);
    return info.balance;
  }

  async getBalanceBTC(): Promise<number> {
    const satoshis = await this.getBalance();
    return satoshis / 100000000;
  }

  async send(toAddress: string, amountSats: number, feeRate?: number): Promise<string> {
    if (!this.keypair) throw new Error('Wallet not initialized');

    return await this.client.sendBtc(
      this.keypair.wif,
      toAddress,
      amountSats,
      feeRate
    );
  }

  async getTransactionHistory(): Promise<btc.BtcTransaction[]> {
    if (!this.keypair) throw new Error('Wallet not initialized');

    return await this.client.getTransactions(this.keypair.address);
  }

  signMessage(message: string): string {
    if (!this.keypair) throw new Error('Wallet not initialized');

    return this.client.getSignatureFromWif(message, this.keypair.wif);
  }
}
```

## Notas de migración

### Desde el uso directo de vfx-btc-js

Si migras desde el uso directo de vfx-btc-js:

```typescript
// Old way
import BtcClient from 'vfx-btc-js';
const client = new BtcClient('testnet');

// New way
import { btc } from 'vfx-web-sdk';
const client = new btc.BtcClient('testnet');
```

### Compatibilidad de la API

BtcClient mantiene compatibilidad total con la API original de vfx-btc-js, y a la vez forma parte del SDK unificado.

## Integración con VFX

Para aplicaciones multicadena que combinan funciones de Bitcoin y VFX, consulta la [guía de integración multicadena](/es/build/sdk/cross-chain/).
