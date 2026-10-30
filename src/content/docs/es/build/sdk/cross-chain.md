---
sourceHash: 85bc5d7aa7a9
title: "Integración multicadena: crea con VFX y Bitcoin"
description: Crea aplicaciones que usan VerifiedX y Bitcoin con el VerifiedX Web SDK, desde billeteras para las dos redes hasta paneles de cuentas, coordinación de transacciones y dominios.
sidebar:
  label: Integración multicadena
  order: 5
---

Esta guía explora cómo crear aplicaciones que aprovechan tanto la red de VerifiedX como la de Bitcoin. Como cadena lateral (sidechain) de Bitcoin, VerifiedX ofrece potentes funciones multicadena que abren nuevas posibilidades para las aplicaciones descentralizadas.

## Requisitos previos

- Conocer los [conceptos básicos de VFX](/es/build/sdk/vfx-basics/)
- Conocer los [conceptos básicos de Bitcoin](/es/build/sdk/bitcoin-basics/)
- Familiaridad con los conceptos de blockchain

## La relación entre VFX y Bitcoin

VerifiedX funciona como una blockchain independiente y, a la vez, como una cadena lateral de Bitcoin:

- **Operaciones independientes**: funcionalidad completa de la blockchain de VFX
- **Operaciones de cadena lateral**: transacciones compatibles con Bitcoin e interoperabilidad
- **Funciones multicadena**: integración fluida entre ambas redes

## Configura la compatibilidad con las dos redes

Inicializa ambos clientes para las operaciones multicadena:

```typescript
import { VfxClient, btc, Network } from 'vfx-web-sdk';

class CrossChainClient {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(
    vfxNetwork: Network = Network.Testnet,
    btcNetwork: 'mainnet' | 'testnet' = 'testnet'
  ) {
    this.vfxClient = new VfxClient(vfxNetwork);
    this.btcClient = new btc.BtcClient(btcNetwork);
  }

  // Access both clients
  get vfx() { return this.vfxClient; }
  get bitcoin() { return this.btcClient; }
}

const crossChain = new CrossChainClient(Network.Testnet, 'testnet');
```

## Generación de billeteras multiplataforma

Crea billeteras que funcionen en distintas plataformas con generación determinista:

### Método 1: billeteras deterministas basadas en correo electrónico

```typescript
class CrossPlatformWallet {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    this.vfxClient = new VfxClient(network === 'mainnet' ? Network.Mainnet : Network.Testnet);
    this.btcClient = new btc.BtcClient(network);
  }

  // Generate wallets that can be recreated on any platform
  generateCrossPlatformWallet(email: string, password: string, index: number = 0) {
    // Generate VFX wallet
    const vfxPrivateKey = this.vfxClient.generatePrivateKey();
    const vfxKeypair = {
      private: vfxPrivateKey,
      public: this.vfxClient.publicFromPrivate(vfxPrivateKey),
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

    return {
      bitcoin: btcKeypair,
      // Note: VFX wallet would need to be restored separately using mnemonic or private key
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

### Método 2: billeteras multicadena basadas en una frase de recuperación (mnemónico)

```typescript
class MnemonicCrossChainWallet {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    this.vfxClient = new VfxClient(network === 'mainnet' ? Network.Mainnet : Network.Testnet);
    this.btcClient = new btc.BtcClient(network);
  }

  // Generate wallets using the same mnemonic
  generateFromMnemonic(mnemonic?: string, vfxIndex: number = 0, btcIndex: number = 0) {
    // Use provided mnemonic or generate new one
    const seed = mnemonic || this.vfxClient.generateMnemonic(12);

    // Generate VFX wallet from mnemonic
    const vfxPrivateKey = this.vfxClient.privateKeyFromMneumonic(seed, vfxIndex);
    const vfxKeypair = {
      private: vfxPrivateKey,
      public: this.vfxClient.publicFromPrivate(vfxPrivateKey),
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

## Panel de cuentas multicadena

Crea un panel unificado que muestre los saldos de VFX y de Bitcoin:

```typescript
interface CrossChainAccountInfo {
  vfx: {
    address: string;
    balance: number;
    domain?: string;
    txCount: number;
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
    this.btcClient = new btc.BtcClient(btcNetwork);
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
          balance: vfxInfo.balance,
          domain: vfxInfo.adnr,
          txCount: vfxInfo.txCount
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
    // If we have the original keypair, we could show all address types
    // For now, just return the queried address
    return { primary: address };
  }

  async getUnifiedTransactionHistory(vfxAddress: string, btcAddress: string) {
    try {
      const [vfxTxs, btcTxs] = await Promise.all([
        this.vfxClient.getAddressDetails(vfxAddress), // VFX doesn't have separate tx history endpoint
        this.btcClient.getTransactions(btcAddress, 10) // Get last 10 Bitcoin transactions
      ]);

      return {
        vfx: {
          transactionCount: vfxTxs.txCount,
          // Note: VFX SDK doesn't currently expose transaction history
          // This would need to be added to get detailed transaction list
        },
        bitcoin: {
          transactionCount: btcTxs.length,
          transactions: btcTxs.map(tx => ({
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
  console.log('VFX Transactions:', accountInfo.vfx.txCount);
  console.log('');
  console.log('Bitcoin Balance:', accountInfo.bitcoin.balanceBTC, 'BTC');
  console.log('Bitcoin Balance (sats):', accountInfo.bitcoin.balance);
  console.log('Bitcoin Transactions:', accountInfo.bitcoin.txCount);
}
```

## Coordinador de transacciones multicadena

Coordina transacciones en ambas redes:

```typescript
class CrossChainTransactionCoordinator {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(vfxNetwork: Network, btcNetwork: 'mainnet' | 'testnet') {
    this.vfxClient = new VfxClient(vfxNetwork);
    this.btcClient = new btc.BtcClient(btcNetwork);
  }

  // Send VFX transaction
  async sendVfxTransaction(fromKeypair: any, toAddress: string, amount: number) {
    try {
      console.log(`Sending ${amount} VFX to ${toAddress}`);
      const result = await this.vfxClient.sendCoin(fromKeypair, toAddress, amount);
      console.log('VFX transaction successful:', result.txHash);
      return { success: true, txHash: result.txHash, network: 'vfx' };
    } catch (error) {
      console.error('VFX transaction failed:', error.message);
      return { success: false, error: error.message, network: 'vfx' };
    }
  }

  // Send Bitcoin transaction
  async sendBitcoinTransaction(fromWif: string, toAddress: string, amountSats: number, feeRate?: number) {
    try {
      console.log(`Sending ${amountSats} satoshis to ${toAddress}`);
      const txId = await this.btcClient.sendBtc(fromWif, toAddress, amountSats, feeRate);
      console.log('Bitcoin transaction successful:', txId);
      return { success: true, txHash: txId, network: 'bitcoin' };
    } catch (error) {
      console.error('Bitcoin transaction failed:', error.message);
      return { success: false, error: error.message, network: 'bitcoin' };
    }
  }

  // Coordinate simultaneous transactions (for atomic swaps or similar)
  async coordinateTransactions(
    vfxTx: { fromKeypair: any; toAddress: string; amount: number },
    btcTx: { fromWif: string; toAddress: string; amountSats: number; feeRate?: number }
  ) {
    try {
      console.log('Coordinating cross-chain transactions...');

      // Execute both transactions in parallel
      const [vfxResult, btcResult] = await Promise.all([
        this.sendVfxTransaction(vfxTx.fromKeypair, vfxTx.toAddress, vfxTx.amount),
        this.sendBitcoinTransaction(btcTx.fromWif, btcTx.toAddress, btcTx.amountSats, btcTx.feeRate)
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

    // Note: This would require additional API endpoints to check transaction status
    // For now, we'll return the initial status
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
    private: 'vfx-private-key',
    public: 'vfx-public-key',
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
      amountSats: 50000,
      feeRate: 20
    }
  );

  console.log('Cross-chain transaction result:', result);
}
```

## Integración de nombres de dominio

Aprovecha los dominios de VFX para resolver direcciones entre cadenas:

```typescript
class CrossChainDomainService {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(vfxNetwork: Network, btcNetwork: 'mainnet' | 'testnet') {
    this.vfxClient = new VfxClient(vfxNetwork);
    this.btcClient = new btc.BtcClient(btcNetwork);
  }

  // Register a domain with both VFX and Bitcoin addresses
  async registerCrossChainDomain(
    vfxKeypair: any,
    domain: string,
    bitcoinAddress: string
  ) {
    try {
      // Check if domain is available
      const available = await this.vfxClient.domainAvailable(domain);
      if (!available) {
        throw new Error(`Domain ${domain} is not available`);
      }

      // Purchase VFX domain
      const result = await this.vfxClient.buyVfxDomain(vfxKeypair, domain);
      console.log(`Domain ${domain} registered for VFX address: ${vfxKeypair.address}`);

      // Store Bitcoin address association (would require additional service)
      // For now, we'll just log it
      console.log(`Bitcoin address ${bitcoinAddress} associated with ${domain}`);

      return {
        success: true,
        domain,
        vfxAddress: vfxKeypair.address,
        bitcoinAddress,
        transaction: result
      };
    } catch (error) {
      console.error('Domain registration failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Resolve domain to get both addresses
  async resolveCrossChainDomain(domain: string) {
    try {
      // Get VFX address from domain
      const vfxAddress = await this.vfxClient.lookupDomain(domain);

      // Get Bitcoin address (would require additional service/storage)
      // For demonstration, we'll try the Bitcoin domain lookup
      let bitcoinAddress;
      try {
        bitcoinAddress = await this.vfxClient.lookupBtcDomain(domain);
      } catch {
        bitcoinAddress = null;
      }

      return {
        domain,
        vfxAddress,
        bitcoinAddress,
        resolved: true
      };
    } catch (error) {
      console.error('Domain resolution failed:', error.message);
      return {
        domain,
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
  const resolution = await domainService.resolveCrossChainDomain('example.vfx');
  console.log('Domain resolution:', resolution);
}
```

## Ejemplo completo de aplicación multicadena

Este es un ejemplo completo que reúne todo lo anterior:

```typescript
import { VfxClient, btc, Network } from 'vfx-web-sdk';

class CrossChainWalletApp {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;
  private wallet: any;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    this.vfxClient = new VfxClient(network === 'mainnet' ? Network.Mainnet : Network.Testnet);
    this.btcClient = new btc.BtcClient(network);
  }

  // Initialize wallet from credentials
  async initializeWallet(email: string, password: string, vfxMnemonic?: string) {
    // Create Bitcoin wallet from email/password
    const btcWallet = this.btcClient.generateEmailKeypair(email, password, 0);

    // Create VFX wallet (from mnemonic if provided, otherwise generate new)
    let vfxWallet;
    if (vfxMnemonic) {
      const vfxPrivateKey = this.vfxClient.privateKeyFromMneumonic(vfxMnemonic, 0);
      vfxWallet = {
        mnemonic: vfxMnemonic,
        private: vfxPrivateKey,
        public: this.vfxClient.publicFromPrivate(vfxPrivateKey),
        address: this.vfxClient.addressFromPrivate(vfxPrivateKey)
      };
    } else {
      const mnemonic = this.vfxClient.generateMnemonic(12);
      const vfxPrivateKey = this.vfxClient.privateKeyFromMneumonic(mnemonic, 0);
      vfxWallet = {
        mnemonic,
        private: vfxPrivateKey,
        public: this.vfxClient.publicFromPrivate(vfxPrivateKey),
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
          balance: vfxInfo.balance,
          domain: vfxInfo.adnr,
          transactions: vfxInfo.txCount
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
        private: this.wallet.vfx.private,
        public: this.wallet.vfx.public,
        address: this.wallet.vfx.address
      },
      toAddress,
      amount
    );
  }

  // Send Bitcoin
  async sendBitcoin(toAddress: string, amountSats: number, feeRate?: number) {
    if (!this.wallet) throw new Error('Wallet not initialized');

    return await this.btcClient.sendBtc(
      this.wallet.bitcoin.wif,
      toAddress,
      amountSats,
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

## Buenas prácticas para el desarrollo multicadena

### Seguridad
- **Guarda las credenciales de forma segura**: protege las combinaciones de correo electrónico y contraseña
- **Separa la gestión de claves**: usa distintos niveles de seguridad para distintos montos
- **Compatibilidad con multifirma**: considera usar multifirma para montos grandes

### Experiencia de usuario
- **Interfaces unificadas**: presenta ambas redes de forma fluida
- **Indicadores de red claros**: muestra siempre a qué red afectan las operaciones
- **Estimación de gas y comisiones**: muestra los costos en ambas redes

### Arquitectura
- **Diseño modular**: separa la lógica de VFX de la de Bitcoin
- **Aislamiento de errores**: no dejes que los problemas de una red afecten a la otra
- **Operaciones asíncronas**: maneja con elegancia los retrasos de la red

## ¿Qué sigue?

Ahora que conoces la integración multicadena:

1. **Crea apps avanzadas**: explora las [aplicaciones completas](/es/build/sdk/examples/applications/)
2. **Ve más ejemplos**: revisa los [fragmentos de código](/es/build/sdk/examples/snippets/)
3. **Profundiza en la API**: estudia las [referencias de la API](/es/build/sdk/reference/vfx-client/)

El desarrollo multicadena abre posibilidades emocionantes. ¡Empieza a construir el futuro de las finanzas descentralizadas!
