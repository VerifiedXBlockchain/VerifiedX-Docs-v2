---
title: "Javascript SDK"
description: Overview of the VerifiedX Web SDK, a unified interface for the VerifiedX blockchain and the Bitcoin network, with installation, basic usage, and a map of the guides.
sidebar:
  label: Overview
  order: 0
---

Welcome to the VerifiedX Web SDK documentation. This SDK provides a unified interface for interacting with both the VerifiedX blockchain and Bitcoin network, enabling powerful cross-chain applications.

## SDK Overview

The VerifiedX Web SDK is designed with simplicity and power in mind:

```typescript
import { VfxClient, btc, Network } from 'vfx-web-sdk';

// VerifiedX operations
const vfxClient = new VfxClient(Network.Testnet);

// Bitcoin operations
const btcClient = new btc.BtcClient('testnet');
```

## Key Features

### Dual Blockchain Support
- **Native VFX Operations**: Full support for VerifiedX blockchain transactions, domain management, and address operations
- **Bitcoin Integration**: Complete Bitcoin functionality including wallet management, transactions, and mempool interaction
- **Cross-Chain Compatibility**: Seamless integration between VFX and Bitcoin operations

### Issuance and Custody
- **Fungible Tokens (VFX20)**: Deploy, mint, transfer, burn, pause, ban and vote
- **External Signing**: Sign every transaction with an HSM, KMS or MPC key the SDK never sees
- **Reserve Accounts**: Time-delayed vault sends that can be called back, with key recovery

### Developer Experience
- **TypeScript First**: Full type safety with comprehensive definitions
- **Universal Compatibility**: Works in Node.js, browsers, and modern bundlers
- **Multiple Build Targets**: CommonJS, ES Modules, and browser-ready bundles
- **Consistent API**: Similar patterns across VFX and Bitcoin operations


## Quick Start

### Installation

```bash
npm install vfx-web-sdk
```

### Basic Usage

```typescript
import { VfxClient, btc, Network } from 'vfx-web-sdk';

function quickStart() {
  // Initialize clients
  const vfxClient = new VfxClient(Network.Testnet);
  const btcClient = new btc.BtcClient('testnet');

  // Generate VFX wallet
  const vfxPrivateKey = vfxClient.generatePrivateKey();
  const vfxAddress = vfxClient.addressFromPrivate(vfxPrivateKey);

  // Generate Bitcoin wallet
  const btcKeypair = btcClient.generatePrivateKey();

  console.log('VFX Address:', vfxAddress);
  console.log('BTC Address:', btcKeypair.address);
}
```

## Documentation Structure

This documentation is organized into several sections:

### Getting Started
- [VFX Basics](/build/sdk/vfx-basics/) - Learn VerifiedX fundamentals
- [Bitcoin Basics](/build/sdk/bitcoin-basics/) - Bitcoin operations with the SDK
- [Cross-Chain Guide](/build/sdk/cross-chain/) - Building cross-chain applications
- [Fungible Tokens](/build/sdk/fungible-tokens/) - Issuing and managing VFX20 tokens
- [External Signing](/build/sdk/external-signing/) - HSM, KMS and MPC keys
- [Reserve Accounts](/build/sdk/reserve-accounts/) - Time-delayed, recoverable vaults

### API Reference
- [VfxClient API](/build/sdk/reference/vfx-client/) - Complete VFX client documentation
- [BtcClient API](/build/sdk/reference/btc-client/) - Complete Bitcoin client documentation
- [Types & Interfaces](/build/sdk/reference/types/) - TypeScript definitions


### Examples
- [Code Snippets](/build/sdk/examples/snippets/)

## Community and Support

- **GitHub**: [VerifiedX WebSDK Repository](https://github.com/VerifiedXBlockchain/VerifiedX-WebSdk)
- **Issues**: Report bugs and request features
- **Discussions**: Join the community discussions

## Next Steps

Ready to start building? Choose your path:

1. **New to VerifiedX?** Start with [VFX Basics](/build/sdk/vfx-basics/)
2. **Bitcoin Developer?** Jump to [Bitcoin Basics](/build/sdk/bitcoin-basics/)
3. **Building Cross-Chain?** Explore [Cross-Chain Guide](/build/sdk/cross-chain/)
4. **Issuing a token?** Read [Fungible Tokens](/build/sdk/fungible-tokens/) and [External Signing](/build/sdk/external-signing/)
4. **Need Examples?** Browse [Complete Applications](/build/sdk/examples/applications/)

Let's build the future of cross-chain applications together!
