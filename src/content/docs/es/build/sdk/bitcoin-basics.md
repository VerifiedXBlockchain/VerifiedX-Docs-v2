---
sourceHash: 3bb4e27180e0
title: "Conceptos básicos de Bitcoin: primeros pasos con la integración de Bitcoin"
description: Genera billeteras de Bitcoin, consulta saldos y tarifas de comisión, envía transacciones y firma mensajes con el cliente de Bitcoin del VerifiedX Web SDK.
sidebar:
  label: Conceptos básicos de Bitcoin
  order: 2
---

Esta guía explica cómo usar el VerifiedX Web SDK para operaciones de Bitcoin. El SDK ofrece un cliente de Bitcoin completo que admite la gestión de billeteras, las transacciones y la interacción con la mempool a través de la API de Mempool.space.

## Requisitos previos

- Node.js 20+ o un navegador moderno
- Conocimientos básicos de los conceptos de Bitcoin
- `vfx-web-sdk` instalado en tu proyecto

## Las redes de Bitcoin

El SDK admite las dos redes de Bitcoin:

- **Mainnet**: la red de producción de Bitcoin, con BTC reales
- **Testnet**: la red de prueba, con BTC de prueba (recomendada para desarrollar)

## Paso 1: inicializa el cliente de Bitcoin

`BtcClient` ofrece toda la funcionalidad de Bitcoin en una sola interfaz:

```typescript
import { btc } from 'vfx-web-sdk';

// Initialize for testnet (recommended for development)
const client = new btc.BtcClient('testnet');

// For mainnet (production)
// const client = new btc.BtcClient('mainnet');
```

## Paso 2: genera billeteras de Bitcoin

El SDK admite varias formas de crear billeteras de Bitcoin:

### Método 1: genera una billetera aleatoria

```typescript
// Generate a completely random wallet
const keypair = client.generatePrivateKey();

console.log('Bitcoin Addresses:');
console.log('- Legacy (P2PKH):', keypair.addresses.p2pkh);
console.log('- Nested SegWit (P2SH):', keypair.addresses.p2sh);
console.log('- Native SegWit (Bech32):', keypair.addresses.bech32);
console.log('- Taproot (Bech32m):', keypair.addresses.bech32m);
console.log('- Default Address:', keypair.address);
console.log('- WIF:', keypair.wif);
```

### Método 2: genera a partir de una frase de recuperación

```typescript
// Generate wallet with mnemonic for recovery
const mnemonicWallet = client.generateMnemonic();

console.log('Mnemonic Wallet:');
console.log('- Mnemonic:', mnemonicWallet.mnemonic);
console.log('- Address:', mnemonicWallet.address);
console.log('- WIF:', mnemonicWallet.wif);
```

### Método 3: restaura a partir de una frase de recuperación

```typescript
// Restore an existing wallet from mnemonic
const restoredWallet = client.privateKeyFromMnemonic(
  'your twelve word mnemonic phrase goes here like this example',
  0 // account index
);

console.log('Restored wallet address:', restoredWallet.address);
```

### Método 4: importa desde WIF o una clave privada

```typescript
// Import from Wallet Import Format (WIF)
const wifWallet = client.addressFromWif('your-wif-string-here');

// Import from private key hex
const privateKeyWallet = client.publicFromPrivate('your-private-key-hex');
```

### Método 5: billetera basada en correo electrónico (multiplataforma)

Para la compatibilidad multiplataforma con las billeteras web:

```typescript
// Generate deterministic wallet from email/password
const emailWallet = client.generateEmailKeypair(
  'user@example.com',
  'secure-password',
  0 // index
);

console.log('Email-based wallet:', emailWallet.address);
```

## Paso 3: consulta la información de la cuenta

Obtén información detallada de cualquier dirección de Bitcoin:

```typescript
async function getAccountInfo(address: string) {
  try {
    const info = await client.getAddressInfo(address);

    console.log('Account Information:');
    console.log('- Balance:', info.balance, 'satoshis');
    console.log('- Balance (BTC):', info.balance / 100000000, 'BTC');
    console.log('- Total Received:', info.totalRecieved, 'satoshis');
    console.log('- Total Sent:', info.totalSent, 'satoshis');
    console.log('- Transaction Count:', info.txCount);

    return info;
  } catch (error) {
    console.error('Error fetching account info:', error.message);
  }
}

// Check your wallet balance
const wallet = client.generatePrivateKey();
await getAccountInfo(wallet.address);
```

## Paso 4: obtén el historial de transacciones

Recupera el historial de transacciones de cualquier dirección:

```typescript
async function getTransactionHistory(address: string) {
  try {
    const transactions = await client.getTransactions(address);

    console.log(`Found ${transactions.length} transactions:`);

    transactions.forEach((tx, index) => {
      console.log(`\nTransaction ${index + 1}:`);
      console.log('- TX ID:', tx.txid);
      console.log('- Confirmed:', tx.status.confirmed);
      console.log('- Block Height:', tx.status.block_height);
      console.log('- Fee:', tx.fee, 'satoshis');
      console.log('- Size:', tx.size, 'bytes');
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
  }
}

await getTransactionHistory(wallet.address);
```

## Paso 5: consulta las tarifas de comisión actuales

Antes de enviar transacciones, consulta las tarifas de comisión actuales de la red:

```typescript
async function getCurrentFees() {
  try {
    const fees = await client.getFeeRates();

    if (fees) {
      console.log('Current Fee Rates (sat/vB):');
      console.log('- Fastest (next block):', fees.fastestFee);
      console.log('- Half hour:', fees.halfHourFee);
      console.log('- One hour:', fees.hourFee);
      console.log('- Economy:', fees.economyFee);
      console.log('- Minimum:', fees.minimumFee);
    }

    return fees;
  } catch (error) {
    console.error('Error fetching fees:', error.message);
  }
}

await getCurrentFees();
```

## Paso 6: envía transacciones de Bitcoin

### Envío simple (recomendado)

La forma más sencilla de enviar Bitcoin:

```typescript
async function sendBitcoin(senderWif: string, recipientAddress: string, amountSats: number) {
  try {
    console.log(`Sending ${amountSats} satoshis to ${recipientAddress}`);

    // This method handles transaction creation and broadcasting
    const txId = await client.sendBtc(
      senderWif,
      recipientAddress,
      amountSats,
      20 // fee rate in sat/vB (optional)
    );

    console.log('Transaction sent successfully!');
    console.log('Transaction ID:', txId);

    return txId;
  } catch (error) {
    console.error('Transaction failed:', error.message);
  }
}

// Send 50,000 satoshis (0.0005 BTC)
const wallet = client.generatePrivateKey();
await sendBitcoin(
  wallet.wif,
  'recipient-bitcoin-address',
  50000
);
```

### Envío avanzado (control manual)

Para tener más control sobre el proceso de la transacción:

```typescript
async function advancedSend(senderWif: string, recipientAddress: string, amountSats: number) {
  try {
    // Step 1: Create the transaction
    const createResult = await client.createTransaction(
      senderWif,
      recipientAddress,
      amountSats,
      15 // custom fee rate
    );

    if (!createResult.success) {
      console.error('Failed to create transaction:', createResult.error);
      return;
    }

    console.log('Transaction created successfully');
    console.log('Raw transaction:', createResult.result);

    // Step 2: Broadcast the transaction
    const broadcastResult = await client.broadcastTransaction(createResult.result!);

    if (!broadcastResult.success) {
      console.error('Failed to broadcast transaction:', broadcastResult.error);
      return;
    }

    console.log('Transaction broadcast successfully');
    console.log('Transaction ID:', broadcastResult.result);

    return broadcastResult.result;
  } catch (error) {
    console.error('Advanced send failed:', error.message);
  }
}
```

## Paso 7: firma de mensajes

Firma y verifica mensajes de Bitcoin:

```typescript
function signMessage(message: string, wallet: any) {
  try {
    // Sign with WIF
    const signature = client.getSignatureFromWif(message, wallet.wif);
    console.log('Message signature:', signature);

    // Alternative: Sign with private key
    // const signature2 = client.getSignature(message, wallet.privateKey);

    return signature;
  } catch (error) {
    console.error('Signing failed:', error.message);
  }
}

const wallet = client.generatePrivateKey();
const signature = signMessage('Hello, Bitcoin!', wallet);
```

## Ejemplo completo: administrador de billeteras de Bitcoin

Este es un administrador de billeteras de Bitcoin completo:

```typescript
import { btc } from 'vfx-web-sdk';

class BitcoinWalletManager {
  private client: btc.BtcClient;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    this.client = new btc.BtcClient(network);
  }

  // Create new wallet
  createWallet() {
    return this.client.generateMnemonic();
  }

  // Restore wallet from mnemonic
  restoreWallet(mnemonic: string, index: number = 0) {
    return this.client.privateKeyFromMnemonic(mnemonic, index);
  }

  // Import wallet from WIF
  importWallet(wif: string) {
    return this.client.addressFromWif(wif);
  }

  // Get wallet balance and info
  async getWalletInfo(address: string) {
    const [accountInfo, transactions] = await Promise.all([
      this.client.getAddressInfo(address),
      this.client.getTransactions(address)
    ]);

    return {
      balance: accountInfo.balance,
      balanceBTC: accountInfo.balance / 100000000,
      totalReceived: accountInfo.totalRecieved,
      totalSent: accountInfo.totalSent,
      transactionCount: accountInfo.txCount,
      recentTransactions: transactions.slice(0, 5) // Last 5 transactions
    };
  }

  // Send Bitcoin
  async sendBitcoin(fromWif: string, toAddress: string, amountSats: number, feeRate?: number) {
    return await this.client.sendBtc(fromWif, toAddress, amountSats, feeRate);
  }

  // Get current network fees
  async getNetworkFees() {
    return await this.client.getFeeRates();
  }

  // Sign a message
  signMessage(message: string, wif: string) {
    return this.client.getSignatureFromWif(message, wif);
  }
}

// Usage example
async function main() {
  const walletManager = new BitcoinWalletManager('testnet');

  // Create a new wallet
  const wallet = walletManager.createWallet();
  console.log('New Bitcoin wallet created:');
  console.log('Mnemonic:', wallet.mnemonic);
  console.log('Address:', wallet.address);
  console.log('All address types:', wallet.addresses);

  // Get wallet information
  try {
    const walletInfo = await walletManager.getWalletInfo(wallet.address);
    console.log('\nWallet Information:');
    console.log('Balance:', walletInfo.balanceBTC, 'BTC');
    console.log('Transactions:', walletInfo.transactionCount);
  } catch (error) {
    console.log('New wallet - no transactions yet');
  }

  // Check network fees
  const fees = await walletManager.getNetworkFees();
  if (fees) {
    console.log('\nCurrent Network Fees:');
    console.log('Fast:', fees.fastestFee, 'sat/vB');
    console.log('Standard:', fees.hourFee, 'sat/vB');
    console.log('Economy:', fees.economyFee, 'sat/vB');
  }

  // Sign a message
  const message = 'Hello from VerifiedX SDK!';
  const signature = walletManager.signMessage(message, wallet.wif);
  console.log('\nMessage Signature:');
  console.log('Message:', message);
  console.log('Signature:', signature);
}

main().catch(console.error);
```

## Los tipos de direcciones

El SDK genera varios tipos de direcciones para lograr la máxima compatibilidad:

### Legacy (P2PKH): las direcciones empiezan con '1'
- El formato de dirección más antiguo
- Las comisiones más altas
- La máxima compatibilidad

### Nested SegWit (P2SH): las direcciones empiezan con '3'
- Comisiones intermedias
- Buena compatibilidad
- Transacciones SegWit envueltas (wrapped)

### Native SegWit (Bech32): las direcciones empiezan con 'bc1' (mainnet) o 'tb1' (testnet)
- Comisiones más bajas
- El estándar moderno
- La mejor opción para la mayoría de los casos

### Taproot (Bech32m): las direcciones empiezan con 'bc1p' (mainnet) o 'tb1p' (testnet)
- Las comisiones más bajas
- La actualización más reciente de Bitcoin
- Funciones de privacidad avanzadas

## Buenas prácticas

### Seguridad
- **Guarda las claves WIF de forma segura**: las claves WIF dan acceso total a los fondos
- **Usa contraseñas seguras**: para las billeteras basadas en correo electrónico
- **Prueba primero en testnet**: prueba siempre con Bitcoin de testnet

### Rendimiento
- **Guarda en caché las tarifas de comisión**: no consultes las comisiones en cada transacción
- **Agrupa las operaciones**: combina varias llamadas a la API cuando sea posible
- **Maneja los límites de solicitudes**: Mempool.space tiene límites de solicitudes en su API

### Manejo de errores
- **Consulta los saldos**: asegúrate de tener saldo suficiente antes de enviar
- **Valida las direcciones**: verifica las direcciones de los destinatarios
- **Monitorea las confirmaciones**: haz seguimiento de las confirmaciones de las transacciones

## ¿Qué sigue?

Ahora que conoces los conceptos básicos de Bitcoin:

1. **Aprende sobre multicadena**: explora la [integración multicadena](/es/build/sdk/cross-chain/)
2. **Crea aplicaciones**: revisa las [aplicaciones completas](/es/build/sdk/examples/applications/)
3. **Referencia de la API**: explora la [API de BtcClient](/es/build/sdk/reference/btc-client/)

## Problemas comunes

### Saldo insuficiente
Asegúrate de que tu billetera tenga suficiente Bitcoin. En testnet, obtén BTC de signet en el [faucet de testnet](https://spyglass-testnet.verifiedx.io/faucet) (pestaña Signet BTC).

### La comisión de la transacción es demasiado baja
Aumenta la tasa de comisión si las transacciones se quedan atascadas en la mempool.

### Formato de dirección no válido
Asegúrate de usar el formato de dirección correcto para la billetera del destinatario.

### Problemas de conexión a la red
Revisa tu conexión a internet e inténtalo de nuevo. El SDK reintenta automáticamente las solicitudes fallidas.

## Obtén ayuda

- Consulta la [referencia de la API de BtcClient](/es/build/sdk/reference/btc-client/)
- Explora los [ejemplos de Bitcoin](/es/build/sdk/examples/snippets/)
- Reporta problemas en [GitHub](https://github.com/VerifiedXBlockchain/VerifiedX-WebSdk/issues)
