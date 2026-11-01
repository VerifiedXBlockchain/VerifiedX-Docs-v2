---
title: "Cross-Chain Integration: Building with VFX and Bitcoin"
description: Build applications that use both VerifiedX and Bitcoin with the VerifiedX Web SDK, from dual-network wallets to account dashboards, transaction coordination, and domains.
sidebar:
  label: Cross-chain integration
  order: 5
---

This guide explores how to build applications that leverage both VerifiedX and Bitcoin networks. VerifiedX is a Layer 1 blockchain built as a Bitcoin reliever chain: it extends what Bitcoin can do without wrapping it, which opens up new possibilities for decentralized applications.

## Prerequisites

- Understanding of [VFX Basics](/build/sdk/vfx-basics/)
- Understanding of [Bitcoin Basics](/build/sdk/bitcoin-basics/)
- Familiarity with blockchain concepts

## Understanding the VFX-Bitcoin Relationship

VerifiedX is its own Layer 1 chain that works alongside Bitcoin:

- **Layer 1 Operations**: Full VFX blockchain functionality (VFX transfers, `.vfx` names, tokens, smart contracts)
- **Bitcoin Operations**: Ordinary Bitcoin wallets and transactions through the SDK's `BtcClient`, plus `.btc` names that link a Bitcoin address to a VFX account
- **vBTC**: 1:1 BTC-backed tokens held in FROST-secured vaults on Bitcoin and moved on VerifiedX (see [vBTC](/build/vbtc/integration/) and the vBTC methods in the [VfxClient API](/build/sdk/reference/vfx-client/))

## Setting Up Dual Network Support

Initialize both clients for cross-chain operations:

```typescript
import { VfxClient, btc, Network } from 'vfx-web-sdk';
import type { Keypair } from 'vfx-web-sdk';

class CrossChainClient {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(
    vfxNetwork: Network = Network.Testnet,
    btcNetwork: 'mainnet' | 'testnet' = 'testnet'
  ) {
    this.vfxClient = new VfxClient(vfxNetwork);
    this.btcClient = new btc.BtcClient(btcNetwork, btcNetwork === 'testnet' ? { apiBaseUrl: 'https://signet.verifiedx.io/api' } : {});
  }

  // Access both clients
  get vfx() { return this.vfxClient; }
  get bitcoin() { return this.btcClient; }
}

const crossChain = new CrossChainClient(Network.Testnet, 'testnet');
```

:::caution[Bitcoin testnet means the VerifiedX signet]
The VFX testnet watches the [VerifiedX signet](/build/signet/). In `vfx-web-sdk` 9.0.3 `new btc.BtcClient('testnet')` still defaults to the public testnet4 API, so every example on this page passes `apiBaseUrl: 'https://signet.verifiedx.io/api'` on testnet.
:::

## Cross-Platform Wallet Generation

Create wallets that work across platforms using deterministic generation:

### Method 1: Email-Based Deterministic Wallets

```typescript
class CrossPlatformWallet {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    this.vfxClient = new VfxClient(network === 'mainnet' ? Network.Mainnet : Network.Testnet);
    this.btcClient = new btc.BtcClient(network, network === 'testnet' ? { apiBaseUrl: 'https://signet.verifiedx.io/api' } : {});
  }

  // Generate wallets that can be recreated on any platform
  generateCrossPlatformWallet(email: string, password: string, index: number = 0) {
    // Generate VFX wallet from the same email/password
    const vfxPrivateKey = this.vfxClient.privateKeyFromEmailPassword(email, password, index);
    const vfxKeypair = {
      privateKey: vfxPrivateKey,
      publicKey: this.vfxClient.publicFromPrivate(vfxPrivateKey),
      address: this.vfxClient.addressFromPrivate(vfxPrivateKey)
    };

    // Generate Bitcoin wallet using email/password for cross-platform compatibility
    const btcKeypair = this.btcClient.generateEmailKeypair(email, password, index);

    return {
      vfx: vfxKeypair,
      bitcoin: btcKeypair,
      credentials: { email, password, index }
    };
  }

  // Restore wallets on any platform
  restoreCrossPlatformWallet(email: string, password: string, index: number = 0) {
    const btcKeypair = this.btcClient.generateEmailKeypair(email, password, index);
    const vfxPrivateKey = this.vfxClient.privateKeyFromEmailPassword(email, password, index);

    return {
      vfx: {
        privateKey: vfxPrivateKey,
        publicKey: this.vfxClient.publicFromPrivate(vfxPrivateKey),
        address: this.vfxClient.addressFromPrivate(vfxPrivateKey)
      },
      bitcoin: btcKeypair
    };
  }
}

// Usage
const walletManager = new CrossPlatformWallet('testnet');
const crossWallet = walletManager.generateCrossPlatformWallet(
  'user@example.com',
  'secure-password-123',
  0
);

console.log('Cross-platform wallet created:');
console.log('VFX Address:', crossWallet.vfx.address);
console.log('Bitcoin Address:', crossWallet.bitcoin.address);
```

### Method 2: Mnemonic-Based Cross-Chain Wallets

```typescript
class MnemonicCrossChainWallet {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    this.vfxClient = new VfxClient(network === 'mainnet' ? Network.Mainnet : Network.Testnet);
    this.btcClient = new btc.BtcClient(network, network === 'testnet' ? { apiBaseUrl: 'https://signet.verifiedx.io/api' } : {});
  }

  // Generate wallets using the same mnemonic
  generateFromMnemonic(mnemonic?: string, vfxIndex: number = 0, btcIndex: number = 0) {
    // Use provided mnemonic or generate new one
    const seed = mnemonic || this.vfxClient.generateMnemonic(12);

    // Generate VFX wallet from mnemonic
    const vfxPrivateKey = this.vfxClient.privateKeyFromMnemonic(seed, vfxIndex);
    const vfxKeypair = {
      privateKey: vfxPrivateKey,
      publicKey: this.vfxClient.publicFromPrivate(vfxPrivateKey),
      address: this.vfxClient.addressFromPrivate(vfxPrivateKey)
    };

    // Generate Bitcoin wallet from same mnemonic
    const btcKeypair = this.btcClient.privateKeyFromMnemonic(seed, btcIndex);

    return {
      mnemonic: seed,
      vfx: vfxKeypair,
      bitcoin: btcKeypair
    };
  }
}

// Usage
const mnemonicWallet = new MnemonicCrossChainWallet('testnet');
const crossChainWallet = mnemonicWallet.generateFromMnemonic();

console.log('Mnemonic:', crossChainWallet.mnemonic);
console.log('VFX Address:', crossChainWallet.vfx.address);
console.log('Bitcoin Address:', crossChainWallet.bitcoin.address);
```

## Cross-Chain Account Dashboard

Build a unified dashboard showing both VFX and Bitcoin balances:

```typescript
interface CrossChainAccountInfo {
  vfx: {
    address: string;
    balance: number;
    domain?: string | null;
  };
  bitcoin: {
    address: string;
    balance: number;
    balanceBTC: number;
    txCount: number;
    addressTypes: any;
  };
  totalValue?: {
    usd: number; // Would require price API integration
  };
}

class CrossChainDashboard {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(vfxNetwork: Network, btcNetwork: 'mainnet' | 'testnet') {
    this.vfxClient = new VfxClient(vfxNetwork);
    this.btcClient = new btc.BtcClient(btcNetwork, btcNetwork === 'testnet' ? { apiBaseUrl: 'https://signet.verifiedx.io/api' } : {});
  }

  async getUnifiedAccountInfo(vfxAddress: string, btcAddress: string): Promise<CrossChainAccountInfo> {
    try {
      // Fetch data from both networks in parallel
      const [vfxInfo, btcInfo] = await Promise.all([
        this.vfxClient.getAddressDetails(vfxAddress),
        this.btcClient.getAddressInfo(btcAddress)
      ]);

      return {
        vfx: {
          address: vfxAddress,
          balance: vfxInfo?.balance ?? 0,
          domain: vfxInfo?.adnr
        },
        bitcoin: {
          address: btcAddress,
          balance: btcInfo.balance,
          balanceBTC: btcInfo.balance / 100000000,
          txCount: btcInfo.txCount,
          addressTypes: await this.getBitcoinAddressTypes(btcAddress)
        }
      };
    } catch (error) {
      console.error('Error fetching cross-chain account info:', error);
      throw error;
    }
  }

  private async getBitcoinAddressTypes(address: string) {
    // With the original keypair, all address types could be shown
    // For now, just return the queried address
    return { primary: address };
  }

  async getUnifiedTransactionHistory(vfxAddress: string, btcAddress: string) {
    try {
      const [vfxTxs, btcTxs] = await Promise.all([
        this.vfxClient.listTransactionsForAddress(vfxAddress, 1, 10), // First page, 10 per page
        this.btcClient.getTransactions(btcAddress) // The API's newest page of Bitcoin transactions
      ]);

      return {
        vfx: {
          transactionCount: vfxTxs?.count ?? 0,
          transactions: (vfxTxs?.results ?? []).map(tx => ({
            id: tx.hash,
            type: tx.type_label,
            height: tx.height,
            amount: tx.total_amount
          }))
        },
        bitcoin: {
          transactionCount: btcTxs.length,
          transactions: btcTxs.slice(0, 10).map(tx => ({
            id: tx.txid,
            confirmed: tx.status.confirmed,
            blockHeight: tx.status.block_height,
            fee: tx.fee,
            size: tx.size
          }))
        }
      };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }
}

// Usage
async function showCrossChainDashboard() {
  const dashboard = new CrossChainDashboard(Network.Testnet, 'testnet');

  const accountInfo = await dashboard.getUnifiedAccountInfo(
    'vfx-address-here',
    'bitcoin-address-here'
  );

  console.log('Cross-Chain Account Dashboard:');
  console.log('=============================');
  console.log('VFX Balance:', accountInfo.vfx.balance, 'VFX');
  console.log('VFX Domain:', accountInfo.vfx.domain || 'None');
  console.log('');
  console.log('Bitcoin Balance:', accountInfo.bitcoin.balanceBTC, 'BTC');
  console.log('Bitcoin Balance (sats):', accountInfo.bitcoin.balance);
  console.log('Bitcoin Transactions:', accountInfo.bitcoin.txCount);
}
```

## Cross-Chain Transaction Coordinator

Coordinate transactions across both networks:

```typescript
class CrossChainTransactionCoordinator {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(vfxNetwork: Network, btcNetwork: 'mainnet' | 'testnet') {
    this.vfxClient = new VfxClient(vfxNetwork);
    this.btcClient = new btc.BtcClient(btcNetwork, btcNetwork === 'testnet' ? { apiBaseUrl: 'https://signet.verifiedx.io/api' } : {});
  }

  // Send VFX transaction
  async sendVfxTransaction(fromKeypair: Keypair, toAddress: string, amount: number) {
    try {
      console.log(`Sending ${amount} VFX to ${toAddress}`);
      const hash = await this.vfxClient.sendCoin(fromKeypair, toAddress, amount);
      if (!hash) {
        return { success: false, error: 'not sent', network: 'vfx' };
      }
      console.log('VFX transaction sent:', hash);
      return { success: true, txHash: hash, network: 'vfx' };
    } catch (error) {
      console.error('VFX transaction failed:', error.message);
      return { success: false, error: error.message, network: 'vfx' };
    }
  }

  // Send Bitcoin transaction
  async sendBitcoinTransaction(fromWif: string, toAddress: string, amountBtc: number, feeRate?: number) {
    try {
      console.log(`Sending ${amountBtc} BTC to ${toAddress}`);
      const txId = await this.btcClient.sendBtc(fromWif, toAddress, amountBtc, feeRate); // amount in BTC
      if (!txId) {
        return { success: false, error: 'not sent', network: 'bitcoin' };
      }
      console.log('Bitcoin transaction sent:', txId);
      return { success: true, txHash: txId, network: 'bitcoin' };
    } catch (error) {
      console.error('Bitcoin transaction failed:', error.message);
      return { success: false, error: error.message, network: 'bitcoin' };
    }
  }

  // Coordinate simultaneous transactions (for atomic swaps or similar)
  async coordinateTransactions(
    vfxTx: { fromKeypair: Keypair; toAddress: string; amount: number },
    btcTx: { fromWif: string; toAddress: string; amountBtc: number; feeRate?: number }
  ) {
    try {
      console.log('Coordinating cross-chain transactions...');

      // Execute both transactions in parallel
      const [vfxResult, btcResult] = await Promise.all([
        this.sendVfxTransaction(vfxTx.fromKeypair, vfxTx.toAddress, vfxTx.amount),
        this.sendBitcoinTransaction(btcTx.fromWif, btcTx.toAddress, btcTx.amountBtc, btcTx.feeRate)
      ]);

      return {
        vfx: vfxResult,
        bitcoin: btcResult,
        success: vfxResult.success && btcResult.success
      };
    } catch (error) {
      console.error('Cross-chain coordination failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Monitor transaction confirmations across both networks
  async monitorTransactions(vfxTxHash?: string, btcTxHash?: string) {
    const status = {
      vfx: { confirmed: false, txHash: vfxTxHash },
      bitcoin: { confirmed: false, txHash: btcTxHash }
    };

    // To check status, look the VFX hash up on the Spyglass API
    // (GET /api/transaction/<hash>/) and the Bitcoin txid with
    // btcClient.checkBroadcast(signedTxHex) or the explorer's /api/tx/<txid>/status
    console.log('Transaction monitoring started...');
    console.log('VFX TX:', vfxTxHash);
    console.log('BTC TX:', btcTxHash);

    return status;
  }
}

// Usage example
async function performCrossChainTransaction() {
  const coordinator = new CrossChainTransactionCoordinator(Network.Testnet, 'testnet');

  // Prepare VFX transaction
  const vfxKeypair = {
    privateKey: 'vfx-private-key',
    publicKey: 'vfx-public-key',
    address: 'vfx-address'
  };

  // Coordinate transactions
  const result = await coordinator.coordinateTransactions(
    {
      fromKeypair: vfxKeypair,
      toAddress: 'recipient-vfx-address',
      amount: 100
    },
    {
      fromWif: 'sender-bitcoin-wif',
      toAddress: 'recipient-bitcoin-address',
      amountBtc: 0.0005, // 50,000 satoshis
      feeRate: 2
    }
  );

  console.log('Cross-chain transaction result:', result);
}
```

## Domain Name Integration

Leverage VFX domains for cross-chain address resolution. A `.vfx` name points at a VFX address. A `.btc` name points at a Bitcoin address and is managed by a VFX account; buying one costs 5 VFX and is signed by that Bitcoin address's key:

```typescript
class CrossChainDomainService {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(vfxNetwork: Network, btcNetwork: 'mainnet' | 'testnet') {
    this.vfxClient = new VfxClient(vfxNetwork);
    this.btcClient = new btc.BtcClient(btcNetwork, btcNetwork === 'testnet' ? { apiBaseUrl: 'https://signet.verifiedx.io/api' } : {});
  }

  // Register name.vfx for the VFX address and name.btc for the Bitcoin address
  async registerCrossChainDomain(
    vfxKeypair: Keypair,
    name: string,
    btcPrivateKey: string // hex private key of the Bitcoin address
  ) {
    try {
      // Check that both names are free
      const vfxDomain = `${name}.vfx`;
      const btcDomain = `${name}.btc`;
      if (!(await this.vfxClient.domainAvailable(vfxDomain)) || !(await this.vfxClient.domainAvailable(btcDomain))) {
        throw new Error(`${name} is not available`);
      }

      // Purchase the .vfx name (5 VFX)
      const vfxResult = await this.vfxClient.buyVfxDomain(vfxKeypair, vfxDomain);
      console.log(`Domain ${vfxDomain} registered for VFX address: ${vfxKeypair.address}`);

      // Purchase the .btc name (5 VFX), linking the Bitcoin address to this VFX account
      const btcResult = await this.vfxClient.buyBtcDomain(vfxKeypair, btcDomain, btcPrivateKey);
      const bitcoinAddress = this.btcClient.addressFromPrivate(btcPrivateKey).address;
      console.log(`Domain ${btcDomain} registered for Bitcoin address: ${bitcoinAddress}`);

      return {
        success: true,
        name,
        vfxAddress: vfxKeypair.address,
        bitcoinAddress,
        transactions: { vfx: vfxResult, btc: btcResult }
      };
    } catch (error) {
      console.error('Domain registration failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Resolve name.vfx and name.btc (each lookup resolves to null when the name does not exist)
  async resolveCrossChainDomain(name: string) {
    try {
      const vfxAddress = await this.vfxClient.lookupDomain(`${name}.vfx`);
      const bitcoinAddress = await this.vfxClient.lookupBtcDomain(`${name}.btc`);

      return {
        name,
        vfxAddress,
        bitcoinAddress,
        resolved: true
      };
    } catch (error) {
      console.error('Domain resolution failed:', error.message);
      return {
        name,
        resolved: false,
        error: error.message
      };
    }
  }
}

// Usage
async function domainExample() {
  const domainService = new CrossChainDomainService(Network.Testnet, 'testnet');

  // Resolve existing domain
  const resolution = await domainService.resolveCrossChainDomain('example');
  console.log('Domain resolution:', resolution);
}
```

## Complete Cross-Chain Application Example

Here's a complete example bringing everything together:

```typescript
import { VfxClient, btc, Network } from 'vfx-web-sdk';
import type { Keypair } from 'vfx-web-sdk';

class CrossChainWalletApp {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;
  private wallet: any;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    this.vfxClient = new VfxClient(network === 'mainnet' ? Network.Mainnet : Network.Testnet);
    this.btcClient = new btc.BtcClient(network, network === 'testnet' ? { apiBaseUrl: 'https://signet.verifiedx.io/api' } : {});
  }

  // Initialize wallet from credentials
  async initializeWallet(email: string, password: string, vfxMnemonic?: string) {
    // Create Bitcoin wallet from email/password
    const btcWallet = this.btcClient.generateEmailKeypair(email, password, 0);

    // Create VFX wallet (from mnemonic if provided, otherwise generate new)
    let vfxWallet;
    if (vfxMnemonic) {
      const vfxPrivateKey = this.vfxClient.privateKeyFromMnemonic(vfxMnemonic, 0);
      vfxWallet = {
        mnemonic: vfxMnemonic,
        privateKey: vfxPrivateKey,
        publicKey: this.vfxClient.publicFromPrivate(vfxPrivateKey),
        address: this.vfxClient.addressFromPrivate(vfxPrivateKey)
      };
    } else {
      const mnemonic = this.vfxClient.generateMnemonic(12);
      const vfxPrivateKey = this.vfxClient.privateKeyFromMnemonic(mnemonic, 0);
      vfxWallet = {
        mnemonic,
        privateKey: vfxPrivateKey,
        publicKey: this.vfxClient.publicFromPrivate(vfxPrivateKey),
        address: this.vfxClient.addressFromPrivate(vfxPrivateKey)
      };
    }

    this.wallet = {
      credentials: { email, password },
      vfx: vfxWallet,
      bitcoin: btcWallet
    };

    return this.wallet;
  }

  // Get complete wallet status
  async getWalletStatus() {
    if (!this.wallet) throw new Error('Wallet not initialized');

    try {
      const [vfxInfo, btcInfo] = await Promise.all([
        this.vfxClient.getAddressDetails(this.wallet.vfx.address),
        this.btcClient.getAddressInfo(this.wallet.bitcoin.address)
      ]);

      return {
        vfx: {
          address: this.wallet.vfx.address,
          balance: vfxInfo?.balance ?? 0,
          domain: vfxInfo?.adnr
        },
        bitcoin: {
          address: this.wallet.bitcoin.address,
          addresses: this.wallet.bitcoin.addresses,
          balance: btcInfo.balance,
          balanceBTC: btcInfo.balance / 100000000,
          transactions: btcInfo.txCount
        }
      };
    } catch (error) {
      console.error('Error fetching wallet status:', error);
      throw error;
    }
  }

  // Send VFX
  async sendVfx(toAddress: string, amount: number) {
    if (!this.wallet) throw new Error('Wallet not initialized');

    return await this.vfxClient.sendCoin(
      {
        privateKey: this.wallet.vfx.privateKey,
        publicKey: this.wallet.vfx.publicKey,
        address: this.wallet.vfx.address
      },
      toAddress,
      amount
    );
  }

  // Send Bitcoin
  async sendBitcoin(toAddress: string, amountBtc: number, feeRate?: number) {
    if (!this.wallet) throw new Error('Wallet not initialized');

    return await this.btcClient.sendBtc(
      this.wallet.bitcoin.wif,
      toAddress,
      amountBtc, // in BTC, not satoshis
      feeRate
    );
  }

  // Export wallet for backup
  exportWallet() {
    if (!this.wallet) throw new Error('Wallet not initialized');

    return {
      email: this.wallet.credentials.email,
      password: this.wallet.credentials.password,
      vfxMnemonic: this.wallet.vfx.mnemonic,
      vfxAddress: this.wallet.vfx.address,
      bitcoinAddress: this.wallet.bitcoin.address,
      bitcoinWif: this.wallet.bitcoin.wif
    };
  }
}

// Usage demonstration
async function demonstrateCrossChainApp() {
  const app = new CrossChainWalletApp('testnet');

  // Initialize wallet
  const wallet = await app.initializeWallet('user@example.com', 'secure-password');
  console.log('Wallet initialized:');
  console.log('VFX Address:', wallet.vfx.address);
  console.log('Bitcoin Address:', wallet.bitcoin.address);
  console.log('VFX Mnemonic:', wallet.vfx.mnemonic);

  // Get wallet status
  try {
    const status = await app.getWalletStatus();
    console.log('\nWallet Status:');
    console.log('VFX Balance:', status.vfx.balance, 'VFX');
    console.log('Bitcoin Balance:', status.bitcoin.balanceBTC, 'BTC');
  } catch (error) {
    console.log('New wallet - no balance yet');
  }

  // Export for backup
  const backup = app.exportWallet();
  console.log('\nWallet backup data:', backup);
}

demonstrateCrossChainApp().catch(console.error);
```

## Best Practices for Cross-Chain Development

### Security
- **Secure credential storage**: Protect email/password combinations
- **Separate key management**: Use different security levels for different amounts
- **Multi-signature support**: Consider multi-sig for large amounts

### User Experience
- **Unified interfaces**: Present both networks seamlessly
- **Clear network indicators**: Always show which network operations affect
- **Fee estimation**: Show costs for both networks (VFX fees are size-based and burned; Bitcoin fees follow the fee rate)

### Architecture
- **Modular design**: Separate VFX and Bitcoin logic
- **Error isolation**: Don't let one network's issues affect the other
- **Async operations**: Handle network delays gracefully

## What's Next?

Now that you understand cross-chain integration:

1. **See More Examples**: Check out [Code Snippets](/build/sdk/examples/snippets/)
2. **Bitcoin-backed tokens**: Read about [vBTC](/build/vbtc/integration/)
3. **API Deep Dive**: Study the [API References](/build/sdk/reference/vfx-client/)

Cross-chain development opens up exciting possibilities. Start building the future of decentralized finance!
