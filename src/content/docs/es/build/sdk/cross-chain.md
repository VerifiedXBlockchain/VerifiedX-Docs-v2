---
sourceHash: "9785a8201140"
title: "Integración multicadena: crea con VFX y Bitcoin"
description: Crea aplicaciones que usan VerifiedX y Bitcoin con el VerifiedX Web SDK, desde billeteras para las dos redes hasta paneles de cuentas, coordinación de transacciones y dominios.
sidebar:
  label: Integración multicadena
  order: 5
---

Esta guía explora cómo crear aplicaciones que aprovechan tanto la red de VerifiedX como la de Bitcoin. VerifiedX es una blockchain de capa 1 (L1) creada como cadena de alivio (reliever chain) de Bitcoin: amplía lo que Bitcoin puede hacer sin envolverlo, lo que abre nuevas posibilidades para las aplicaciones descentralizadas.

## Requisitos previos

- Conocer los [conceptos básicos de VFX](/es/build/sdk/vfx-basics/)
- Conocer los [conceptos básicos de Bitcoin](/es/build/sdk/bitcoin-basics/)
- Familiaridad con los conceptos de blockchain

## La relación entre VFX y Bitcoin

VerifiedX es su propia cadena de capa 1 que funciona junto a Bitcoin:

- **Operaciones de capa 1**: funcionalidad completa de la blockchain de VFX (transferencias de VFX, nombres `.vfx`, tokens, contratos inteligentes)
- **Operaciones de Bitcoin**: billeteras y transacciones de Bitcoin comunes a través del `BtcClient` del SDK, además de nombres `.btc` que vinculan una dirección de Bitcoin a una cuenta de VFX
- **vBTC**: tokens respaldados 1:1 por BTC, guardados en bóvedas (vaults) protegidas con FROST en Bitcoin y que se mueven en VerifiedX (consulta [vBTC](/es/build/vbtc/integration/) y los métodos de vBTC en la [API de VfxClient](/es/build/sdk/reference/vfx-client/))

## Configura la compatibilidad con las dos redes

Inicializa ambos clientes para las operaciones multicadena:

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
    this.btcClient = new btc.BtcClient(btcNetwork);
  }

  // Access both clients
  get vfx() { return this.vfxClient; }
  get bitcoin() { return this.btcClient; }
}

const crossChain = new CrossChainClient(Network.Testnet, 'testnet');
```

:::note[La testnet de Bitcoin significa el signet de VerifiedX]
La testnet de VFX vigila el [signet de VerifiedX](/es/build/signet/). Desde `vfx-web-sdk` 9.0.4, `new btc.BtcClient('testnet')` lo usa de forma predeterminada, así que los ejemplos de esta página no necesitan ninguna sobrescritura de la API. En 9.0.3 o anterior, pasa `apiBaseUrl: 'https://signet.verifiedx.io/api'` en testnet.
:::

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

## Panel de cuentas multicadena

Crea un panel unificado que muestre los saldos de VFX y de Bitcoin:

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

## Integración de nombres de dominio

Aprovecha los dominios de VFX para resolver direcciones entre cadenas. Un nombre `.vfx` apunta a una dirección de VFX. Un nombre `.btc` apunta a una dirección de Bitcoin y lo administra una cuenta de VFX; comprar uno cuesta 5 VFX y se firma con la clave de esa dirección de Bitcoin:

```typescript
class CrossChainDomainService {
  private vfxClient: VfxClient;
  private btcClient: btc.BtcClient;

  constructor(vfxNetwork: Network, btcNetwork: 'mainnet' | 'testnet') {
    this.vfxClient = new VfxClient(vfxNetwork);
    this.btcClient = new btc.BtcClient(btcNetwork);
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

      // Purchase the .vfx name (5 VFX). buyVfxDomain resolves to the transaction hash, or null when nothing was sent.
      const vfxResult = await this.vfxClient.buyVfxDomain(vfxKeypair, vfxDomain);
      if (!vfxResult) {
        throw new Error(`${vfxDomain} was not purchased (insufficient balance or the transaction was refused)`);
      }
      console.log(`Domain ${vfxDomain} registered for VFX address: ${vfxKeypair.address}`);

      // Purchase the .btc name (5 VFX), linking the Bitcoin address to this VFX account
      const btcResult = await this.vfxClient.buyBtcDomain(vfxKeypair, btcDomain, btcPrivateKey);
      const bitcoinAddress = this.btcClient.addressFromPrivate(btcPrivateKey).address;
      if (!btcResult) {
        // The .vfx name is already bought: return its hash so the caller can retry only the .btc purchase
        console.error(`${btcDomain} was not purchased; ${vfxDomain} is registered (${vfxResult})`);
        return {
          success: false,
          error: `${btcDomain} was not purchased`,
          name,
          vfxAddress: vfxKeypair.address,
          transactions: { vfx: vfxResult, btc: null }
        };
      }
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

## Ejemplo completo de aplicación multicadena

Este es un ejemplo completo que reúne todo lo anterior:

```typescript
import { VfxClient, btc, Network } from 'vfx-web-sdk';
import type { Keypair } from 'vfx-web-sdk';

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

## Buenas prácticas para el desarrollo multicadena

### Seguridad
- **Guarda las credenciales de forma segura**: protege las combinaciones de correo electrónico y contraseña
- **Separa la gestión de claves**: usa distintos niveles de seguridad para distintos montos
- **Compatibilidad con multifirma**: considera usar multifirma para montos grandes

### Experiencia de usuario
- **Interfaces unificadas**: presenta ambas redes de forma fluida
- **Indicadores de red claros**: muestra siempre a qué red afectan las operaciones
- **Estimación de comisiones**: muestra los costos en ambas redes (las comisiones de VFX dependen del tamaño y se queman; las de Bitcoin siguen la tasa de comisión)

### Arquitectura
- **Diseño modular**: separa la lógica de VFX de la de Bitcoin
- **Aislamiento de errores**: no dejes que los problemas de una red afecten a la otra
- **Operaciones asíncronas**: maneja con elegancia los retrasos de la red

## ¿Qué sigue?

Ahora que conoces la integración multicadena:

1. **Ve más ejemplos**: revisa los [fragmentos de código](/es/build/sdk/examples/snippets/)
2. **Tokens respaldados por Bitcoin**: lee sobre [vBTC](/es/build/vbtc/integration/)
3. **Profundiza en la API**: estudia las [referencias de la API](/es/build/sdk/reference/vfx-client/)

El desarrollo multicadena abre posibilidades emocionantes. ¡Empieza a construir el futuro de las finanzas descentralizadas!
