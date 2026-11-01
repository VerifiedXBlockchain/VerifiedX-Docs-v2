---
sourceHash: 143b3a17badc
title: "Conceptos básicos de VFX: primeros pasos con VerifiedX"
description: Crea billeteras, consulta saldos, envía VFX y trabaja con dominios con el VerifiedX Web SDK.
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

Hay varias formas de crear una billetera de VFX. Las más comunes:

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

### Método 2: usa una frase de recuperación

Las frases de recuperación (mnemónicos) son más fáciles de usar y sirven para recuperar billeteras:

```typescript
// Generate a 12-word mnemonic
const mnemonic = client.generateMnemonic(12);
console.log('Mnemonic:', mnemonic);

// Derive a private key from the mnemonic
const privateKey = client.privateKeyFromMnemonic(mnemonic, 0); // index 0
const address = client.addressFromPrivate(privateKey);

console.log('Address from mnemonic:', address);
```

`privateKeyFromMnemonic` es el alias con la ortografía correcta del `privateKeyFromMneumonic` original. Ambos existen y derivan la misma clave.

### Crea un objeto de par de claves

Para las transacciones necesitas un objeto de par de claves completo. Sus campos son `privateKey`, `publicKey` y `address` (el tipo `Keypair`):

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

## Paso 3: consulta los detalles de una dirección

Antes de enviar transacciones, consulta el saldo y la información de una dirección:

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

`getAddressDetails` devuelve un `VfxAddress` (`address`, `balance`, `balanceTotal`, `balanceLocked`, `adnr`, `activated`, `deactivated`). Una dirección que el explorador nunca ha visto vuelve con saldo cero, y lo mismo ocurre si la API no está disponible, a menos que pases `{ strict: true }`, que vuelve a lanzar cualquier error que no sea un 404.

## Paso 4: envía tu primera transacción

Ahora envía tokens VFX a otra dirección:

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

`sendCoin` se resuelve con el hash de la transacción, o con `null` cuando la transacción falló antes de llegar al nodo (no se envió nada). Lanza `TransactionDispatchError` cuando la solicitud salió pero no llegó respuesta: busca el hash en el explorador antes de volver a enviar. El destinatario también puede ser un nombre `.vfx` o `.btc`.

## Paso 5: trabaja con los dominios de VFX

VerifiedX admite nombres de dominio legibles por personas para las direcciones:

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

Un nombre `.vfx` cuesta 5 VFX más la comisión de red, y una dirección solo puede tener uno.

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

### Busca un dominio

Pasa el nombre completo, en minúsculas, con su sufijo `.vfx`. `lookupDomain` y `domainAvailable` envían el nombre tal como se lo pasas, así que la forma en mayúsculas o sin sufijo de un nombre ocupado aparece como inexistente o disponible; `buyVfxDomain` pasa el nombre a minúsculas y le agrega el sufijo por su cuenta. `lookupDomain` se resuelve con `null` para un nombre que no existe.

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

## Buenas prácticas

### Seguridad
- **Nunca expongas las claves privadas**: guárdalas de forma segura y nunca las registres en los logs de producción
- **Usa frases de recuperación para las billeteras de los usuarios**: son más fáciles de usar y más seguras
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
2. **Crear apps multicadena**: revisa la [guía multicadena](/es/build/sdk/cross-chain/)
3. **Ver ejemplos**: explora los [fragmentos de código](/es/build/sdk/examples/snippets/)

## Problemas comunes

### La transacción falla por saldo insuficiente
Asegúrate de que tu billetera tenga suficientes tokens VFX. En testnet, obtén tokens del faucet (consulta [Testnet](/es/build/testnet/#obtén-fondos-de-prueba)).

### La compra de un dominio falla
Un nombre `.vfx` cuesta 5 VFX más la comisión. Asegúrate de tener saldo suficiente, de que el nombre esté disponible y de que la dirección no tenga ya un nombre. Los nombres no se pueden comprar desde una cuenta de reserva.

### Problemas de conexión a la red
Revisa tu conexión a internet e inténtalo de nuevo. El SDK no reintenta por su cuenta las solicitudes fallidas; cada solicitud vence a los 30 segundos de forma predeterminada (define `timeoutMs` en las opciones del cliente para cambiarlo).

## Obtén ayuda

- Consulta la [referencia de la API](/es/build/sdk/reference/vfx-client/) para ver la documentación detallada de cada método
- Explora los [fragmentos de código](/es/build/sdk/examples/snippets/) para ver más ejemplos
- Reporta problemas en [GitHub](https://github.com/VerifiedXBlockchain/VerifiedX-WebSdk/issues)
