---
sourceHash: cf19192509fa
title: "Conceptos básicos de VFX: primeros pasos con VerifiedX"
description: Crea billeteras, consulta saldos, envía VFX y trabaja con dominios usando el VerifiedX Web SDK.
sidebar:
  label: Conceptos básicos de VFX
  order: 1
---

Esta guía te lleva por los fundamentos del VerifiedX Web SDK para interactuar con la blockchain de VFX. Al terminar este tutorial, sabrás cómo crear billeteras, consultar saldos y enviar transacciones.

## Requisitos previos

- Node.js 20+ o un navegador moderno
- Conocimientos básicos de JavaScript/TypeScript
- `vfx-web-sdk` instalado en tu proyecto

## Instalación

```bash
npm install vfx-web-sdk
```

## Las redes de VFX

VerifiedX opera en dos redes:

- **Mainnet**: la red de producción, con tokens VFX reales
- **Testnet**: la red de desarrollo, con tokens de prueba (recomendada para aprender)

## Paso 1: inicializa el cliente de VFX

`VfxClient` es tu punto de acceso a la blockchain de VerifiedX.

```typescript
import { VfxClient, Network } from 'vfx-web-sdk';

// Initialize client for testnet (recommended for learning)
const client = new VfxClient(Network.Testnet);

// For mainnet (production)
// const client = new VfxClient(Network.Mainnet);
```

## Paso 2: genera una billetera

Hay varias formas de crear una billetera de VFX. Veamos las más comunes:

### Método 1: genera una clave privada aleatoria

```typescript
// Generate a new random private key
const privateKey = client.generatePrivateKey();
const publicKey = client.publicFromPrivate(privateKey);
const address = client.addressFromPrivate(privateKey);

console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);
console.log('Address:', address);
```

### Método 2: usa una frase mnemotécnica

Las frases mnemotécnicas son más fáciles de usar y sirven para recuperar billeteras:

```typescript
// Generate a 12-word mnemonic
const mnemonic = client.generateMnemonic(12);
console.log('Mnemonic:', mnemonic);

// Derive a private key from the mnemonic
const privateKey = client.privateKeyFromMneumonic(mnemonic, 0); // index 0
const address = client.addressFromPrivate(privateKey);

console.log('Address from mnemonic:', address);
```

### Crea un objeto de par de claves

Para las transacciones necesitas un objeto de par de claves completo:

```typescript
function createKeypair(privateKey: string) {
  return {
    private: privateKey,
    public: client.publicFromPrivate(privateKey),
    address: client.addressFromPrivate(privateKey)
  };
}

const keypair = createKeypair(privateKey);
```

## Paso 3: consulta los detalles de una dirección

Antes de enviar transacciones, consultemos el saldo y la información de una dirección:

```typescript
async function checkBalance(address: string) {
  try {
    const addressDetails = await client.getAddressDetails(address);

    console.log('Address Details:');
    console.log('- Balance:', addressDetails.balance, 'VFX');
    console.log('- Transaction Count:', addressDetails.txCount);
    console.log('- Domain:', addressDetails.adnr || 'None');

    return addressDetails;
  } catch (error) {
    console.error('Error fetching address details:', error.message);
  }
}

// Check your wallet balance
await checkBalance(keypair.address);
```

## Paso 4: envía tu primera transacción

Ahora enviemos tokens VFX a otra dirección:

```typescript
async function sendVfx(fromKeypair: any, toAddress: string, amount: number) {
  try {
    console.log(`Sending ${amount} VFX from ${fromKeypair.address} to ${toAddress}`);

    const result = await client.sendCoin(fromKeypair, toAddress, amount);

    console.log('Transaction successful!');
    console.log('Transaction Hash:', result.txHash);
    console.log('Status:', result.status);

    return result;
  } catch (error) {
    console.error('Transaction failed:', error.message);
  }
}

// Example usage (make sure you have sufficient balance)
const recipientAddress = 'VFX_RECIPIENT_ADDRESS_HERE';
await sendVfx(keypair, recipientAddress, 100); // Send 100 VFX
```

## Paso 5: trabaja con los dominios de VFX

VerifiedX admite nombres de dominio legibles para las direcciones:

### Verifica si un dominio está disponible

```typescript
async function checkDomain(domain: string) {
  const isAvailable = await client.domainAvailable(domain);
  console.log(`Domain ${domain} is ${isAvailable ? 'available' : 'taken'}`);
  return isAvailable;
}

await checkDomain('myawesomeapp.vfx');
```

### Compra un dominio

```typescript
async function buyDomain(keypair: any, domain: string) {
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

### Busca un dominio

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

## Ejemplo completo: administrador de billeteras de VFX

Este es un ejemplo completo que reúne todo lo anterior:

```typescript title="wallet-manager.ts"
import { VfxClient, Network } from 'vfx-web-sdk';

class VfxWalletManager {
  private client: VfxClient;

  constructor(network: Network = Network.Testnet) {
    this.client = new VfxClient(network);
  }

  // Create a new wallet
  createWallet() {
    const mnemonic = this.client.generateMnemonic(12);
    const privateKey = this.client.privateKeyFromMneumonic(mnemonic, 0);

    return {
      mnemonic,
      keypair: {
        private: privateKey,
        public: this.client.publicFromPrivate(privateKey),
        address: this.client.addressFromPrivate(privateKey)
      }
    };
  }

  // Restore wallet from mnemonic
  restoreWallet(mnemonic: string, index: number = 0) {
    const privateKey = this.client.privateKeyFromMneumonic(mnemonic, index);

    return {
      private: privateKey,
      public: this.client.publicFromPrivate(privateKey),
      address: this.client.addressFromPrivate(privateKey)
    };
  }

  // Get wallet info
  async getWalletInfo(address: string) {
    return await this.client.getAddressDetails(address);
  }

  // Send transaction
  async sendTransaction(fromKeypair: any, toAddress: string, amount: number) {
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
  // You can get testnet VFX from a faucet or by mining
}

main().catch(console.error);
```

## Buenas prácticas

### Seguridad
- **Nunca expongas las claves privadas**: guárdalas de forma segura y nunca las registres en los logs de producción
- **Usa frases mnemotécnicas para las billeteras de los usuarios**: son más fáciles de usar y más seguras
- **Valida las direcciones**: valida siempre la dirección del destinatario antes de enviar una transacción

### Manejo de errores
- **Usa siempre try-catch**: las operaciones de red pueden fallar
- **Consulta los saldos**: asegúrate de tener saldo suficiente antes de cada transacción
- **Valida las entradas**: revisa el formato de los dominios y la validez de las direcciones

### Pruebas
- **Usa testnet para desarrollar**: prueba siempre primero en testnet
- **Prueba todos los escenarios**: incluye los casos de error en tus pruebas
- **Monitorea el estado de las transacciones**: verifica que las transacciones se confirmen

## ¿Qué sigue?

Ahora que conoces los conceptos básicos de VFX, puedes:

1. **Explorar la integración con Bitcoin**: aprende sobre los [conceptos básicos de Bitcoin](/es/build/sdk/bitcoin-basics/)
2. **Crear apps cross-chain**: revisa la [guía cross-chain](/es/build/sdk/cross-chain/)
3. **Ver ejemplos**: explora las [aplicaciones completas](/es/build/sdk/examples/applications/)

## Problemas comunes

### La transacción falla por saldo insuficiente
Asegúrate de que tu billetera tenga suficientes tokens VFX. En testnet, quizás necesites obtener tokens de un faucet.

### La compra de un dominio falla
Los dominios cuestan tokens VFX. Asegúrate de tener saldo suficiente y de que el dominio esté disponible.

### Problemas de conexión a la red
Revisa tu conexión a internet e inténtalo de nuevo. El SDK reintenta automáticamente las solicitudes fallidas.

## Obtén ayuda

- Consulta la [referencia de la API](/es/build/sdk/reference/vfx-client/) para ver la documentación detallada de cada método
- Explora los [fragmentos de código](/es/build/sdk/examples/snippets/) para ver más ejemplos
- Reporta problemas en [GitHub](https://github.com/VerifiedXBlockchain/VerifiedX-WebSdk/issues)
