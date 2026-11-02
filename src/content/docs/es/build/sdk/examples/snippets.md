---
sourceHash: "0a7c7330db50"
title: "Fragmentos de código"
description: Fragmentos de código listos para copiar y pegar para tareas comunes con el VerifiedX Web SDK en VFX, Bitcoin, multicadena, React, Node.js y pruebas.
sidebar:
  order: 1
---

Esta sección ofrece ejemplos de código puntuales para tareas comunes con el VerifiedX Web SDK. Estos fragmentos están pensados para que los copies y pegues directamente en tus aplicaciones.

En testnet, los ejemplos de Bitcoin se ejecutan en la [signet de VerifiedX](/es/build/signet/), que `BtcClient('testnet')` usa de forma predeterminada desde `vfx-web-sdk` 9.0.4. En 9.0.3 o anterior, pasa `apiBaseUrl: 'https://signet.verifiedx.io/api'`.

## Ejemplos de VFX

### Configuración rápida de una billetera

```typescript
import { VfxClient, Network } from 'vfx-web-sdk';

// Create client
const client = new VfxClient(Network.Testnet);

// Generate wallet
const privateKey = client.generatePrivateKey();
const keypair = {
  privateKey,
  publicKey: client.publicFromPrivate(privateKey),
  address: client.addressFromPrivate(privateKey)
};

console.log('VFX Address:', keypair.address);
```

### Envía una transacción de VFX

```typescript
async function sendVfx(client, fromKeypair, toAddress, amount) {
  try {
    // Check balance first
    const details = await client.getAddressDetails(fromKeypair.address);
    if (details.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Send transaction: resolves to the hash, or null when nothing was sent
    const hash = await client.sendCoin(fromKeypair, toAddress, amount);
    if (!hash) {
      throw new Error('Transaction was not sent');
    }
    console.log('Transaction sent:', hash);
    return hash;
  } catch (error) {
    console.error('Transaction failed:', error.message);
    throw error;
  }
}
```

### Consulta el saldo de una dirección

```typescript
async function checkBalance(client, address) {
  try {
    const details = await client.getAddressDetails(address, { strict: true });
    console.log(`Balance: ${details.balance} VFX`);
    console.log(`Locked: ${details.balanceLocked} VFX`);
    if (details.adnr) {
      console.log(`Domain: ${details.adnr}`);
    }
    return details;
  } catch (error) {
    console.error('Failed to fetch balance:', error.message);
    return null;
  }
}
```

### Operaciones con dominios

```typescript
// Check domain availability
async function checkDomain(client, domain) {
  const available = await client.domainAvailable(domain);
  console.log(`${domain} is ${available ? 'available' : 'taken'}`);
  return available;
}

// Purchase domain
async function buyDomain(client, keypair, domain) {
  try {
    const available = await client.domainAvailable(domain);
    if (!available) {
      throw new Error('Domain not available');
    }

    const result = await client.buyVfxDomain(keypair, domain);
    console.log('Domain purchased:', result);
    return result;
  } catch (error) {
    console.error('Domain purchase failed:', error.message);
    throw error;
  }
}

// Lookup domain (full name with its .vfx suffix; resolves to null when not found)
async function lookupDomain(client, domain) {
  try {
    const address = await client.lookupDomain(domain);
    console.log(`${domain} → ${address}`);
    return address;
  } catch (error) {
    console.log(`${domain} not found`);
    return null;
  }
}
```

### Recupera una billetera con la frase de recuperación (mnemónico)

```typescript
function restoreVfxWallet(client, mnemonic, index = 0) {
  try {
    const privateKey = client.privateKeyFromMnemonic(mnemonic, index);
    const keypair = {
      privateKey,
      publicKey: client.publicFromPrivate(privateKey),
      address: client.addressFromPrivate(privateKey)
    };

    console.log('Wallet restored:', keypair.address);
    return keypair;
  } catch (error) {
    console.error('Failed to restore wallet:', error.message);
    throw error;
  }
}
```

## Ejemplos de Bitcoin

### Billetera de Bitcoin rápida

```typescript
import { btc } from 'vfx-web-sdk';

// Create a testnet client (the VerifiedX signet)
const client = new btc.BtcClient('testnet');

// Generate wallet with all address types
const wallet = client.generatePrivateKey();
console.log('Bitcoin Addresses:');
console.log('Default (bech32):', wallet.address);
console.log('Legacy:', wallet.addresses.p2pkh);
console.log('SegWit:', wallet.addresses.bech32);
console.log('Taproot:', wallet.addresses.bech32m);
```

### Envía una transacción de Bitcoin

```typescript
async function sendBitcoin(client, wif, toAddress, amountBtc, feeRate = 2) {
  try {
    console.log(`Sending ${amountBtc} BTC to ${toAddress}`);

    // amount is in BTC, not satoshis; resolves to null when nothing was sent
    const txId = await client.sendBtc(wif, toAddress, amountBtc, feeRate);
    console.log('Transaction sent:', txId);
    return txId;
  } catch (error) {
    console.error('Bitcoin transaction failed:', error.message);
    throw error;
  }
}
```

### Consulta el saldo de Bitcoin

```typescript
async function checkBitcoinBalance(client, address) {
  try {
    const info = await client.getAddressInfo(address);
    console.log(`Balance: ${info.balance} satoshis`);
    console.log(`BTC: ${info.balance / 100000000} BTC`);
    console.log(`Transactions: ${info.txCount}`);
    return info;
  } catch (error) {
    console.error('Failed to fetch Bitcoin balance:', error.message);
    return null;
  }
}
```

### Obtén estimaciones de comisiones

```typescript
async function getFeeEstimates(client) {
  try {
    const fees = await client.getFeeRates();
    if (fees) {
      console.log('Fee rates (sat/vB):');
      console.log(`Fastest: ${fees.fastestFee}`);
      console.log(`Half hour: ${fees.halfHourFee}`);
      console.log(`One hour: ${fees.hourFee}`);
      console.log(`Economy: ${fees.economyFee}`);
      return fees;
    }
  } catch (error) {
    console.error('Failed to get fee rates:', error.message);
    return null;
  }
}
```

### Billetera de Bitcoin con frase de recuperación

```typescript
// Generate with mnemonic
function createBitcoinWallet(client) {
  const wallet = client.generateMnemonic();
  console.log('Mnemonic:', wallet.mnemonic);
  console.log('Address:', wallet.address);
  return wallet;
}

// Restore from mnemonic
function restoreBitcoinWallet(client, mnemonic, index = 0) {
  const wallet = client.privateKeyFromMnemonic(mnemonic, index);
  console.log('Restored address:', wallet.address);
  return wallet;
}
```

### Firma mensajes de Bitcoin

```typescript
function signBitcoinMessage(client, message, wif) {
  try {
    const signature = client.getSignatureFromWif(message, wif);
    console.log('Message signature:', signature);
    return signature;
  } catch (error) {
    console.error('Failed to sign message:', error.message);
    throw error;
  }
}
```

## Ejemplos multicadena

### Billetera unificada con una sola frase de recuperación

```typescript
import { VfxClient, btc, Network } from 'vfx-web-sdk';

function createUnifiedWallet(network: 'mainnet' | 'testnet' = 'testnet') {
  const vfxClient = new VfxClient(
    network === 'mainnet' ? Network.Mainnet : Network.Testnet
  );
  const btcClient = new btc.BtcClient(network);

  // Generate shared mnemonic
  const mnemonic = vfxClient.generateMnemonic(12);

  // Create VFX wallet
  const vfxPrivateKey = vfxClient.privateKeyFromMnemonic(mnemonic, 0);
  const vfxWallet = {
    privateKey: vfxPrivateKey,
    publicKey: vfxClient.publicFromPrivate(vfxPrivateKey),
    address: vfxClient.addressFromPrivate(vfxPrivateKey)
  };

  // Create Bitcoin wallet
  const btcWallet = btcClient.privateKeyFromMnemonic(mnemonic, 0);

  return {
    mnemonic,
    vfx: vfxWallet,
    btc: btcWallet
  };
}
```

### Consulta de saldos multicadena

```typescript
async function checkAllBalances(vfxClient, btcClient, vfxAddress, btcAddress) {
  try {
    const [vfxDetails, btcInfo] = await Promise.allSettled([
      vfxClient.getAddressDetails(vfxAddress),
      btcClient.getAddressInfo(btcAddress)
    ]);

    const balances = {
      vfx: 0,
      btc: 0,
      btcSats: 0
    };

    if (vfxDetails.status === 'fulfilled') {
      balances.vfx = vfxDetails.value.balance;
    }

    if (btcInfo.status === 'fulfilled') {
      balances.btcSats = btcInfo.value.balance;
      balances.btc = btcInfo.value.balance / 100000000;
    }

    console.log('Balances:', balances);
    return balances;
  } catch (error) {
    console.error('Failed to fetch balances:', error.message);
    return null;
  }
}
```

### Firma de mensajes en ambas cadenas

```typescript
function signOnBothChains(vfxClient, btcClient, message, vfxPrivateKey, btcWif) {
  try {
    const signatures = {
      vfx: vfxClient.getSignature(message, vfxPrivateKey),
      btc: btcClient.getSignatureFromWif(message, btcWif)
    };

    console.log('Signatures:', signatures);
    return signatures;
  } catch (error) {
    console.error('Failed to sign message:', error.message);
    throw error;
  }
}
```

## Funciones utilitarias

### Validación de direcciones

```typescript
// Mainnet addresses start with 'R', testnet addresses with 'x', reserve (vault) addresses with 'xRBX'.
// The SDK's exported isOtherNetworksAddress(address, network) checks the version byte and checksum.
function isValidVfxAddress(address, network = 'testnet') {
  if (!address || typeof address !== 'string') return false;
  // Mainnet: R… addresses and xRBX… reserve (vault) accounts. Testnet: x… addresses, including xRBX… reserve accounts.
  return network === 'mainnet'
    ? address.startsWith('R') || address.startsWith('xRBX')
    : address.startsWith('x');
}

function isValidBitcoinAddress(address, network = 'testnet') {
  if (!address || typeof address !== 'string') return false;

  if (network === 'mainnet') {
    return address.startsWith('1') ||
           address.startsWith('3') ||
           address.startsWith('bc1');
  } else {
    return address.startsWith('m') ||
           address.startsWith('n') ||
           address.startsWith('2') ||
           address.startsWith('tb1');
  }
}
```

### Formato de montos

```typescript
function formatVfxAmount(amount) {
  return `${amount.toLocaleString()} VFX`;
}

function formatBtcAmount(satoshis) {
  const btc = satoshis / 100000000;
  return {
    satoshis: satoshis.toLocaleString(),
    btc: btc.toFixed(8),
    formatted: `${btc.toFixed(8)} BTC`
  };
}
```

### Envoltorio para el manejo de errores

```typescript
function withErrorHandling(asyncFn) {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      console.error(`Operation failed: ${error.message}`);
      return null;
    }
  };
}

// Usage
const safeCheckBalance = withErrorHandling(checkBalance);
const safeGetFees = withErrorHandling(getFeeEstimates);
```

### Lógica de reintentos

```typescript
async function withRetry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

// Usage
const balanceWithRetry = () => withRetry(() =>
  client.getAddressDetails(address)
);
```

## Ejemplos de integración con React

### Hook de saldo de VFX

```typescript
import { useState, useEffect } from 'react';
import { VfxClient, Network } from 'vfx-web-sdk';

function useVfxBalance(address, network = Network.Testnet) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) return;

    const client = new VfxClient(network);
    setLoading(true);

    client.getAddressDetails(address)
      .then(details => {
        setBalance(details.balance);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setBalance(null);
      })
      .finally(() => setLoading(false));
  }, [address, network]);

  return { balance, loading, error };
}
```

### Hook de transacciones de Bitcoin

```typescript
import { useState } from 'react';
import { btc } from 'vfx-web-sdk';

function useBitcoinTransaction(network: 'mainnet' | 'testnet' = 'testnet') {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const sendTransaction = async (wif, toAddress, amount, feeRate) => {
    setSending(true);
    setError(null);

    try {
      const client = new btc.BtcClient(network);
      const txId = await client.sendBtc(wif, toAddress, amount, feeRate); // amount in BTC
      return txId;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSending(false);
    }
  };

  return { sendTransaction, sending, error };
}
```

## Ejemplos de Node.js

### Configuración del entorno

```typescript
// For Node.js applications
import { VfxClient, btc, Network } from 'vfx-web-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const network = process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet';
const vfxClient = new VfxClient(
  network === 'mainnet' ? Network.Mainnet : Network.Testnet
);
const btcClient = new btc.BtcClient(network);
```

### Almacenamiento seguro de claves

```typescript
import * as crypto from 'crypto';

// AES-256-GCM with a key derived from the password (scrypt) and a random salt and IV.
// crypto.createCipher was removed in Node.js 22; use createCipheriv.
function encryptPrivateKey(privateKey, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(password, salt, 32);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(privateKey, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [salt, iv, tag, encrypted].map((part) => part.toString('hex')).join(':');
}

function decryptPrivateKey(encryptedKey, password) {
  const [salt, iv, tag, encrypted] = encryptedKey.split(':').map((part) => Buffer.from(part, 'hex'));
  const key = crypto.scryptSync(password, salt, 32);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}
```

### Operaciones por lotes

```typescript
async function batchCheckBalances(client, addresses) {
  const promises = addresses.map(address =>
    client.getAddressDetails(address)
      .catch(error => ({ address, error: error.message }))
  );

  const results = await Promise.all(promises);
  return results;
}
```

## Ejemplos de pruebas

### Clientes simulados

```typescript
// Mock VFX client for testing
class MockVfxClient {
  generatePrivateKey() {
    return 'mock-private-key';
  }

  addressFromPrivate(privateKey) {
    return 'xMockAddress';
  }

  async getAddressDetails(address) {
    return { address, balance: 1000, balanceTotal: 1000, balanceLocked: 0, adnr: null, activated: false };
  }

  async sendCoin(keypair, toAddress, amount) {
    return 'mock-tx-hash'; // sendCoin resolves to the transaction hash
  }
}
```

### Ejemplo de prueba unitaria

```typescript
describe('VFX Operations', () => {
  let client;

  beforeEach(() => {
    client = new MockVfxClient();
  });

  test('should generate wallet', () => {
    const privateKey = client.generatePrivateKey();
    const address = client.addressFromPrivate(privateKey);

    expect(privateKey).toBeDefined();
    expect(address).toMatch(/^[Rx]/);
  });

  test('should check balance', async () => {
    const details = await client.getAddressDetails('xTestAddress');

    expect(details.balance).toBeGreaterThanOrEqual(0);
    expect(details.balanceLocked).toBeGreaterThanOrEqual(0);
  });
});
```

Estos fragmentos ofrecen código práctico, listo para copiar y pegar, para operaciones comunes. Para ver recorridos más extensos, consulta las guías [Conceptos básicos de VFX](/es/build/sdk/vfx-basics/), [Conceptos básicos de Bitcoin](/es/build/sdk/bitcoin-basics/) y [Multicadena](/es/build/sdk/cross-chain/).
