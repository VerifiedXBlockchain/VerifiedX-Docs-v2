---
title: "Bitcoin Basics: Getting Started with Bitcoin Integration"
description: Generate Bitcoin wallets, check balances and fee rates, send transactions, and sign messages with the Bitcoin client in the VerifiedX Web SDK.
sidebar:
  label: Bitcoin basics
  order: 2
---

This guide covers how to use the VerifiedX Web SDK for Bitcoin operations. The SDK provides a comprehensive Bitcoin client that supports wallet management, transactions, and mempool interactions through a mempool.space-style API: mempool.space on mainnet, and the VerifiedX signet's own explorer API on testnet.

## Prerequisites

- Node.js 20+ or a modern browser
- Basic understanding of Bitcoin concepts
- `vfx-web-sdk` installed in your project

## Understanding Bitcoin Networks

The SDK supports two Bitcoin networks:

- **Mainnet**: The production Bitcoin network with real BTC
- **Testnet**: For VerifiedX development this is the [VerifiedX signet](/build/signet/), the private Bitcoin test network the VFX testnet watches. It uses testnet address formats (`tb1…`, `m…`/`n…`, `2…`) and signet BTC from the testnet faucet

:::note[Testnet is the VerifiedX signet]
From `vfx-web-sdk` 9.0.4, `new btc.BtcClient('testnet')` uses the VerifiedX signet (`https://signet.verifiedx.io/api`) by default. Keys and addresses are the same on every Bitcoin test network, but balances, UTXOs and broadcasts are not, so on 9.0.3 or earlier upgrade or pass `apiBaseUrl: 'https://signet.verifiedx.io/api'`.
:::

## Step 1: Initialize the Bitcoin Client

The `BtcClient` provides all Bitcoin functionality in a single interface:

```typescript
import { btc } from 'vfx-web-sdk';

// Initialize for testnet, the VerifiedX signet (recommended for development)
const client = new btc.BtcClient('testnet');

// For mainnet (production)
// const client = new btc.BtcClient('mainnet');
```

## Step 2: Generate Bitcoin Wallets

The SDK supports multiple ways to create Bitcoin wallets:

### Method 1: Generate Random Wallet

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

The default `address` is the native SegWit (`bech32`) address, which is also the address `sendBtc` spends from.

### Method 2: Generate from Mnemonic

```typescript
// Generate wallet with mnemonic for recovery
const mnemonicWallet = client.generateMnemonic();

console.log('Mnemonic Wallet:');
console.log('- Mnemonic:', mnemonicWallet.mnemonic);
console.log('- Address:', mnemonicWallet.address);
console.log('- WIF:', mnemonicWallet.wif);
```

`generateMnemonic()` returns a keypair whose `mnemonic` is a 24-word phrase.

### Method 3: Restore from Mnemonic

```typescript
// Restore an existing wallet from mnemonic
const restoredWallet = client.privateKeyFromMnemonic(
  'your mnemonic phrase goes here',
  0 // account index
);

console.log('Restored wallet address:', restoredWallet.address);
```

### Method 4: Import from WIF or Private Key

```typescript
// Import from Wallet Import Format (WIF)
const wifWallet = client.addressFromWif('your-wif-string-here');

// Import from private key hex
const privateKeyWallet = client.publicFromPrivate('your-private-key-hex');
```

### Method 5: Email-Based Wallet (Cross-Platform)

For cross-platform compatibility with web wallets:

```typescript
// Generate deterministic wallet from email/password
const emailWallet = client.generateEmailKeypair(
  'user@example.com',
  'secure-password',
  0 // index
);

console.log('Email-based wallet:', emailWallet.address);
```

## Step 3: Check Account Information

Get detailed information about any Bitcoin address:

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

The figures count confirmed transactions only (the API's `chain_stats`); an unconfirmed payment shows up after its block. Pass `false` as the second argument to get BTC instead of satoshis.

## Step 4: Get Transaction History

Retrieve transaction history for any address:

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

`getTransactions` returns the API's first page for the address (the newest transactions, unconfirmed ones first). In 9.0.3 its `limit` and `before` parameters are accepted but not sent, so they have no effect.

## Step 5: Check Current Fee Rates

Before sending transactions, check current network fee rates:

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

## Step 6: Send Bitcoin Transactions

### Simple Send (Recommended)

The easiest way to send Bitcoin:

```typescript
async function sendBitcoin(senderWif: string, recipientAddress: string, amountBtc: number) {
  try {
    console.log(`Sending ${amountBtc} BTC to ${recipientAddress}`);

    // This method handles transaction creation and broadcasting
    const txId = await client.sendBtc(
      senderWif,
      recipientAddress,
      amountBtc, // in BTC, not satoshis
      2 // fee rate in sat/vB (optional; 1 sat/vB is enough on the signet)
    );

    if (!txId) {
      console.error('Nothing was sent');
      return null;
    }

    console.log('Transaction ID:', txId);
    return txId;
  } catch (error) {
    // BtcBroadcastUnknownError: the broadcast went out but no answer came back
    console.error('Transaction failed:', error.message);
  }
}

// Send 0.0005 BTC (50,000 satoshis)
const wallet = client.generatePrivateKey();
await sendBitcoin(
  wallet.wif,
  'recipient-bitcoin-address',
  0.0005
);
```

`sendBtc` takes the amount in **BTC**. It spends the UTXOs of the WIF's native SegWit (`bech32`) address, sends change back to it, and picks the API's economy fee rate when `feeRate` is 0. It resolves to the txid, or `null` when nothing was sent (the transaction could not be built or the network refused it). It throws `BtcBroadcastUnknownError` when the broadcast went out but no definite answer came back: do not call `sendBtc` again, check with `checkBroadcast(error.signedTxHex)` and re-broadcast that same hex if it is absent.

### Advanced Send (Manual Control)

For more control over the transaction process:

```typescript
async function advancedSend(senderWif: string, recipientAddress: string, amountBtc: number) {
  try {
    // Step 1: Create the transaction (amount in BTC)
    const createResult = await client.createTransaction(
      senderWif,
      recipientAddress,
      amountBtc,
      15 // custom fee rate in sat/vB
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

## Step 7: Message Signing

Sign and verify Bitcoin messages:

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

## Complete Example: Bitcoin Wallet Manager

Here's a comprehensive Bitcoin wallet manager:

```typescript
import { btc } from 'vfx-web-sdk';

class BitcoinWalletManager {
  private client: btc.BtcClient;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    // On testnet the client reads and broadcasts on the VerifiedX signet
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

  // Send Bitcoin (amount in BTC)
  async sendBitcoin(fromWif: string, toAddress: string, amountBtc: number, feeRate?: number) {
    return await this.client.sendBtc(fromWif, toAddress, amountBtc, feeRate);
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

## Address Types Explained

The SDK generates multiple address types for maximum compatibility:

### Legacy (P2PKH) - addresses start with '1' (mainnet) or 'm'/'n' (testnet and signet)
- Oldest address format
- Highest fees
- Maximum compatibility

### Nested SegWit (P2SH) - addresses start with '3' (mainnet) or '2' (testnet and signet)
- Medium fees
- Good compatibility
- Wrapped SegWit transactions

### Native SegWit (Bech32) - addresses start with 'bc1q' (mainnet) or 'tb1q' (testnet and signet)
- Lower fees
- Modern standard
- Best for most use cases

### Taproot (Bech32m) - addresses start with 'bc1p' (mainnet) or 'tb1p' (testnet and signet)
- Lowest fees
- Latest Bitcoin upgrade
- Advanced privacy features

## Best Practices

### Security
- **Secure WIF storage**: WIF keys provide full access to funds
- **Use strong passwords**: For email-based wallets
- **Test on testnet first**: Always test with testnet Bitcoin

### Performance
- **Cache fee rates**: Don't fetch fees for every transaction
- **Batch operations**: Group multiple API calls when possible
- **Handle rate limits**: mempool.space (the mainnet default) has API rate limits

### Error Handling
- **Check balances**: Ensure sufficient balance before sending
- **Validate addresses**: Verify recipient addresses
- **Monitor confirmations**: Track transaction confirmations

## What's Next?

Now that you understand Bitcoin basics:

1. **Learn Cross-Chain**: Explore [Cross-Chain Integration](/build/sdk/cross-chain/)
2. **See Examples**: Browse [Code Snippets](/build/sdk/examples/snippets/)
3. **API Reference**: Browse the [BtcClient API](/build/sdk/reference/btc-client/)

## Common Issues

### Insufficient Balance
Make sure your wallet has enough Bitcoin. On testnet, get signet BTC from the [testnet faucet](https://spyglass-testnet.verifiedx.io/faucet) (Signet BTC tab).

### Transaction Fee Too Low
Increase the fee rate if transactions are stuck in mempool. On the VerifiedX signet 1 sat/vB is enough and a block comes about every 10 minutes (see [Signet](/build/signet/)).

### Invalid Address Format
Ensure you're using the correct address format for the recipient's wallet.

### Network Connection Issues
Check internet connection and try again. The SDK does not retry failed requests on its own. A broadcast that gets no answer within 30 seconds throws `BtcBroadcastUnknownError` instead of failing, so check it with `checkBroadcast` before sending again.

## Getting Help

- Check the [BtcClient API Reference](/build/sdk/reference/btc-client/)
- Browse [Bitcoin Examples](/build/sdk/examples/snippets/)
- Report issues on [GitHub](https://github.com/VerifiedXBlockchain/VerifiedX-WebSdk/issues)
