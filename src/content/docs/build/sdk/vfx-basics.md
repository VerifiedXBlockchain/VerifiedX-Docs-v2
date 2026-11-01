---
title: "VFX Basics: Getting Started with VerifiedX"
description: Create wallets, check balances, send VFX, and work with domains using the VerifiedX Web SDK.
sidebar:
  label: VFX basics
  order: 1
---

This guide will walk you through the fundamentals of using the VerifiedX Web SDK to interact with the VFX blockchain. By the end of this tutorial, you'll understand how to create wallets, check balances, and send transactions.

## Prerequisites

- Node.js 20+ or a modern browser
- Basic JavaScript/TypeScript knowledge
- `vfx-web-sdk` installed in your project

## Installation

```bash
npm install vfx-web-sdk
```

## Understanding VFX Networks

VerifiedX operates on two networks:

- **Mainnet**: The production network with real VFX tokens
- **Testnet**: The development network with test tokens (recommended for learning)

## Step 1: Initialize the VFX Client

The `VfxClient` is your gateway to the VerifiedX blockchain.

```typescript
import { VfxClient, Network } from 'vfx-web-sdk';

// Initialize client for testnet (recommended for learning)
const client = new VfxClient(Network.Testnet);

// For mainnet (production)
// const client = new VfxClient(Network.Mainnet);
```

## Step 2: Generate a Wallet

There are several ways to create a VFX wallet. The most common methods:

### Method 1: Generate a Random Private Key

```typescript
// Generate a new random private key
const privateKey = client.generatePrivateKey();
const publicKey = client.publicFromPrivate(privateKey);
const address = client.addressFromPrivate(privateKey);

console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);
console.log('Address:', address);
```

### Method 2: Use a Mnemonic Phrase

Mnemonic phrases are more user-friendly and can be used to recover wallets:

```typescript
// Generate a 12-word mnemonic
const mnemonic = client.generateMnemonic(12);
console.log('Mnemonic:', mnemonic);

// Derive a private key from the mnemonic
const privateKey = client.privateKeyFromMnemonic(mnemonic, 0); // index 0
const address = client.addressFromPrivate(privateKey);

console.log('Address from mnemonic:', address);
```

`privateKeyFromMnemonic` is the correctly spelled alias of the original `privateKeyFromMneumonic`. Both exist and derive the same key.

### Creating a Keypair Object

For transactions, you'll need a complete keypair object. Its fields are `privateKey`, `publicKey` and `address` (the `Keypair` type):

```typescript
import type { Keypair } from 'vfx-web-sdk';

function createKeypair(privateKey: string): Keypair {
  return {
    privateKey,
    publicKey: client.publicFromPrivate(privateKey),
    address: client.addressFromPrivate(privateKey)
  };
}

const keypair = createKeypair(privateKey);
```

## Step 3: Check Address Details

Before sending transactions, check an address's balance and information:

```typescript
async function checkBalance(address: string) {
  try {
    const addressDetails = await client.getAddressDetails(address);

    console.log('Address Details:');
    console.log('- Balance:', addressDetails.balance, 'VFX');
    console.log('- Locked:', addressDetails.balanceLocked, 'VFX');
    console.log('- Domain:', addressDetails.adnr || 'None');

    return addressDetails;
  } catch (error) {
    console.error('Error fetching address details:', error.message);
  }
}

// Check your wallet balance
await checkBalance(keypair.address);
```

`getAddressDetails` returns a `VfxAddress` (`address`, `balance`, `balanceTotal`, `balanceLocked`, `adnr`, `activated`, `deactivated`). An address the explorer has never seen comes back with a zero balance, and so does an API outage unless you pass `{ strict: true }`, which rethrows anything but a 404.

## Step 4: Send Your First Transaction

Now send VFX tokens to another address:

```typescript
async function sendVfx(fromKeypair: Keypair, toAddress: string, amount: number) {
  try {
    console.log(`Sending ${amount} VFX from ${fromKeypair.address} to ${toAddress}`);

    const hash = await client.sendCoin(fromKeypair, toAddress, amount);

    if (!hash) {
      console.log('Transaction was not sent');
      return null;
    }

    console.log('Transaction Hash:', hash);
    return hash;
  } catch (error) {
    console.error('Transaction failed:', error.message);
  }
}

// Example usage (make sure you have sufficient balance)
const recipientAddress = 'VFX_RECIPIENT_ADDRESS_HERE';
await sendVfx(keypair, recipientAddress, 1); // Send 1 VFX
```

`sendCoin` resolves to the transaction hash, or `null` when the transaction failed before it reached the node (nothing was sent). It throws `TransactionDispatchError` when the request went out but no answer came back: look the hash up on the explorer before sending again. The recipient can also be a `.vfx` or `.btc` name.

## Step 5: Working with VFX Domains

VerifiedX supports human-readable domain names for addresses:

### Check Domain Availability

```typescript
async function checkDomain(domain: string) {
  const isAvailable = await client.domainAvailable(domain);
  console.log(`Domain ${domain} is ${isAvailable ? 'available' : 'taken'}`);
  return isAvailable;
}

await checkDomain('myawesomeapp.vfx');
```

### Purchase a Domain

A `.vfx` name costs 5 VFX plus the network fee, and an address can hold only one.

```typescript
async function buyDomain(keypair: Keypair, domain: string) {
  try {
    // Check if domain is available first
    const available = await client.domainAvailable(domain);
    if (!available) {
      console.log('Domain is not available');
      return;
    }

    const result = await client.buyVfxDomain(keypair, domain);
    console.log('Domain purchased successfully!');
    console.log('Transaction:', result);

    return result;
  } catch (error) {
    console.error('Domain purchase failed:', error.message);
  }
}

// Purchase a domain (requires sufficient VFX balance)
await buyDomain(keypair, 'myapp.vfx');
```

### Lookup Domain

Pass the full name with its `.vfx` suffix. `lookupDomain` resolves to `null` for a name that does not exist.

```typescript
async function lookupDomain(domain: string) {
  try {
    const address = await client.lookupDomain(domain);
    console.log(`Domain ${domain} resolves to: ${address}`);
    return address;
  } catch (error) {
    console.error('Domain lookup failed:', error.message);
  }
}

await lookupDomain('example.vfx');
```

## Complete Example: VFX Wallet Manager

Here's a complete example that puts everything together:

```typescript title="wallet-manager.ts"
import { VfxClient, Network } from 'vfx-web-sdk';
import type { Keypair } from 'vfx-web-sdk';

class VfxWalletManager {
  private client: VfxClient;

  constructor(network: Network = Network.Testnet) {
    this.client = new VfxClient(network);
  }

  // Create a new wallet
  createWallet() {
    const mnemonic = this.client.generateMnemonic(12);
    const privateKey = this.client.privateKeyFromMnemonic(mnemonic, 0);

    return {
      mnemonic,
      keypair: {
        privateKey,
        publicKey: this.client.publicFromPrivate(privateKey),
        address: this.client.addressFromPrivate(privateKey)
      }
    };
  }

  // Restore wallet from mnemonic
  restoreWallet(mnemonic: string, index: number = 0) {
    const privateKey = this.client.privateKeyFromMnemonic(mnemonic, index);

    return {
      privateKey,
      publicKey: this.client.publicFromPrivate(privateKey),
      address: this.client.addressFromPrivate(privateKey)
    };
  }

  // Get wallet info
  async getWalletInfo(address: string) {
    return await this.client.getAddressDetails(address);
  }

  // Send transaction
  async sendTransaction(fromKeypair: Keypair, toAddress: string, amount: number) {
    return await this.client.sendCoin(fromKeypair, toAddress, amount);
  }
}

// Usage example
async function main() {
  const walletManager = new VfxWalletManager(Network.Testnet);

  // Create a new wallet
  const wallet = walletManager.createWallet();
  console.log('New wallet created:');
  console.log('Mnemonic:', wallet.mnemonic);
  console.log('Address:', wallet.keypair.address);

  // Check wallet info
  const info = await walletManager.getWalletInfo(wallet.keypair.address);
  console.log('Wallet balance:', info.balance, 'VFX');

  // Note: You'll need testnet VFX to send transactions
  // Get testnet VFX from the testnet faucet
}

main().catch(console.error);
```

## Best Practices

### Security
- **Never expose private keys**: Keep them secure and never log them in production
- **Use mnemonics for user wallets**: They're more user-friendly and secure
- **Validate addresses**: Always validate recipient addresses before sending transactions

### Error Handling
- **Always use try-catch**: Network operations can fail
- **Check balances**: Ensure sufficient balance before transactions
- **Validate inputs**: Check domain formats and address validity

### Testing
- **Use testnet for development**: Always test on testnet first
- **Test all scenarios**: Include error cases in your testing
- **Monitor transaction status**: Check if transactions are confirmed

## What's Next?

Now that you understand VFX basics, you can:

1. **Explore Bitcoin Integration**: Learn about [Bitcoin Basics](/build/sdk/bitcoin-basics/)
2. **Build Cross-Chain Apps**: Check out the [Cross-Chain Guide](/build/sdk/cross-chain/)
3. **See Examples**: Browse [Code Snippets](/build/sdk/examples/snippets/)

## Common Issues

### Transaction Fails with Insufficient Balance
Make sure your wallet has enough VFX tokens. On testnet, get tokens from the faucet (see [Testnet](/build/testnet/#getting-test-funds)).

### Domain Purchase Fails
A `.vfx` name costs 5 VFX plus the fee. Ensure you have sufficient balance, the name is available, and the address does not already hold a name. Names cannot be bought from a reserve account.

### Network Connection Issues
Check your internet connection and try again. The SDK does not retry failed requests on its own; each request times out after 30 seconds by default (set `timeoutMs` in the client options to change it).

## Getting Help

- Check the [API Reference](/build/sdk/reference/vfx-client/) for detailed method documentation
- Browse [Code Snippets](/build/sdk/examples/snippets/) for more code samples
- Report issues on [GitHub](https://github.com/VerifiedXBlockchain/VerifiedX-WebSdk/issues)
