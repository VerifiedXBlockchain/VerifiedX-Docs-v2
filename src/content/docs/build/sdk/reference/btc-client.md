---
title: "BtcClient API Reference"
description: Reference for the BtcClient in the VerifiedX Web SDK, covering Bitcoin wallet generation, address information, transactions, fee rates, and message signing.
sidebar:
  order: 2
---

The `BtcClient` provides Bitcoin wallet management, transactions and fee information through a mempool.space-style (Esplora) API: mempool.space for mainnet, and on testnet the VerifiedX signet's API when you pass it (see the constructor).

## Constructor

### `new btc.BtcClient(network?, dryRunOrOptions?)`

Creates a new BtcClient instance.

**Parameters:**
- `network` ('mainnet' | 'testnet', optional): The Bitcoin network (default `'mainnet'`). `'testnet'` uses Bitcoin testnet address formats (`tb1…`, `m…`/`n…`, `2…`), which the VerifiedX signet shares.
- `dryRunOrOptions` (boolean | `BtcClientOptions`, optional): `true` for a dry-run client, or `{ dryRun?: boolean, apiBaseUrl?: string }`. `apiBaseUrl` overrides the Esplora API origin, including `/api`.

API defaults: `https://mempool.space/api` on mainnet and, from `vfx-web-sdk` 9.0.4, the [VerifiedX signet](/build/signet/) at `https://signet.verifiedx.io/api` on testnet. 9.0.3 and earlier default testnet to the public testnet4 API, so on those versions pass `{ apiBaseUrl: 'https://signet.verifiedx.io/api' }` or balances, UTXOs and broadcasts go to testnet4.

**Example:**
```typescript
import { btc } from 'vfx-web-sdk';

// Testnet is the VerifiedX signet (the Bitcoin side of the VFX testnet)
const client = new btc.BtcClient('testnet');
const mainnetClient = new btc.BtcClient('mainnet');
const dryRunClient = new btc.BtcClient('testnet', { dryRun: true });
// A self-hosted Esplora or mempool API
const customClient = new btc.BtcClient('mainnet', { apiBaseUrl: 'https://my-mempool.example.com/api' });
```

## Wallet Generation

### `generatePrivateKey()`

Generates a new random Bitcoin wallet with all address types.

**Returns:** `BtcKeypair` - Complete keypair with multiple address formats

**Response Object:**
```typescript
{
  privateKey: string | undefined;  // hex
  publicKey: string;
  wif: string;
  address: string | undefined;     // Default address (bech32)
  addresses: {
    p2pkh: string | undefined;     // Legacy (starts with 1; m or n on testnet)
    p2sh: string | undefined;      // Nested SegWit (starts with 3; 2 on testnet)
    bech32: string | undefined;    // Native SegWit (starts with bc1q/tb1q)
    bech32m: string | undefined;   // Taproot (starts with bc1p/tb1p)
  };
}
```

**Example:**
```typescript
const keypair = client.generatePrivateKey();
console.log('Default address:', keypair.address);
console.log('Legacy address:', keypair.addresses.p2pkh);
console.log('SegWit address:', keypair.addresses.bech32);
console.log('Taproot address:', keypair.addresses.bech32m);
```

### `generateMnemonic()`

Generates a new wallet with a 24-word BIP39 mnemonic phrase.

**Returns:** `BtcKeypair` - Keypair with `mnemonic` set for recovery

**Response Object:**
```typescript
{
  mnemonic: string;  // 24 words
  privateKey: string | undefined;
  publicKey: string;
  wif: string;
  address: string | undefined;
  addresses: BtcAddresses;
}
```

**Example:**
```typescript
const wallet = client.generateMnemonic();
console.log('Mnemonic:', wallet.mnemonic);
console.log('Address:', wallet.address);
```

### `privateKeyFromMnemonic(mnemonic, index?)`

Derives a private key from a mnemonic phrase.

**Parameters:**
- `mnemonic` (string): The BIP39 mnemonic phrase
- `index` (number, optional): The derivation index (default 0)

**Returns:** `BtcKeypair` - Derived keypair

**Example:**
```typescript
const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const restoredWallet = client.privateKeyFromMnemonic(mnemonic, 0);
console.log('Restored address:', restoredWallet.address);
```

### `publicFromPrivate(privateKey)`

Derives public key and addresses from a private key.

**Parameters:**
- `privateKey` (string): The private key in hexadecimal format

**Returns:** `BtcKeypair` - Complete keypair derived from private key

**Example:**
```typescript
const privateKey = "your-private-key-hex";
const keypair = client.publicFromPrivate(privateKey);
```

### `addressFromPrivate(privateKey)`

Same as `publicFromPrivate`: returns the full `BtcKeypair` for a hex private key; read `.address` for the default (bech32) address.

**Example:**
```typescript
const address = client.addressFromPrivate(privateKey).address;
```

### `addressFromWif(wif)`

Imports a wallet from Wallet Import Format (WIF).

**Parameters:**
- `wif` (string): The WIF string

**Returns:** `BtcKeypair` - Keypair imported from WIF

**Example:**
```typescript
const wif = "your-wif-string";
const importedWallet = client.addressFromWif(wif);
```

### `generateEmailKeypair(email, password, index?)`

Generates a deterministic wallet from email and password.

**Parameters:**
- `email` (string): Email address
- `password` (string): Password
- `index` (number, optional): Derivation index (default 0)

**Returns:** `BtcKeypair` - Deterministic keypair

**Example:**
```typescript
const emailWallet = client.generateEmailKeypair(
  "user@example.com",
  "secure-password",
  0
);
```

## Address Information

### `getAddressInfo(address, inSatoshis?)`

Retrieves detailed information about a Bitcoin address, counting confirmed transactions only.

**Parameters:**
- `address` (string): The Bitcoin address to query
- `inSatoshis` (boolean, optional): `true` (default) for satoshis, `false` for BTC

**Returns:** `Promise<AccountInfo>` - Address information. Throws `Error fetching address info: <status>` when the API refuses the request (for example an invalid address)

**Response Object:**
```typescript
{
  balance: number;        // Balance (satoshis by default)
  totalRecieved: number;  // Total received (spelling as in the SDK)
  totalSent: number;      // Total sent
  txCount: number;        // Number of transactions
}
```

**Example:**
```typescript
const addressInfo = await client.getAddressInfo("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");
console.log(`Balance: ${addressInfo.balance} satoshis`);
console.log(`BTC Balance: ${addressInfo.balance / 100000000} BTC`);
```

### `getTransactions(address, limit?, before?)`

Retrieves transaction history for an address, newest first: unconfirmed transactions, then confirmed ones, up to `limit` entries.

**Parameters:**
- `address` (string): The Bitcoin address to query
- `limit` (number, optional): Maximum number of transactions to return (default 50)
- `before` (string | null, optional): A txid already seen. From 9.0.4 only confirmed transactions older than it are returned (no unconfirmed ones), so pass the last confirmed txid of one call as the next call's `before` to page back through the history. 9.0.3 accepted `limit` and `before` but ignored them

**Returns:** `Promise<Transaction[]>` - Array of transactions

**Transaction Object:**
```typescript
{
  txid: string;
  version: number;
  locktime: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout?: {
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      scriptpubkey_address: string;
      value: number;
    };
    scriptsig: string;
    scriptsig_asm: string;
    witness: string[];
    is_coinbase: boolean;
    sequence: number;
  }>;
  vout: Array<{
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: number;
  }>;
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}
```

**Example:**
```typescript
const transactions = await client.getTransactions(address);
transactions.forEach(tx => {
  console.log(`TX: ${tx.txid}`);
  console.log(`Confirmed: ${tx.status.confirmed}`);
  console.log(`Fee: ${tx.fee} satoshis`);
});
```

## Transaction Operations

### `sendBtc(wif, toAddress, amount, feeRate?)`

Builds, signs and broadcasts a payment (simplified method). It spends the UTXOs of the WIF's native SegWit (bech32) address and returns change to it.

**Parameters:**
- `wif` (string): Sender's Wallet Import Format key
- `toAddress` (string): Recipient's Bitcoin address
- `amount` (number): Amount to send in **BTC** (not satoshis)
- `feeRate` (number, optional): Fee rate in sat/vB (default 0 = the API's economy rate, falling back to 2 on testnet and 5 on mainnet)

**Returns:** `Promise<string | null>` - The txid, or `null` when nothing was sent (the transaction could not be built, for example for lack of funds, or the network refused it; the reason is logged). Throws `BtcBroadcastUnknownError` when the broadcast went out but no definite answer came back: do not call `sendBtc` again for it, resolve it with `checkBroadcast(error.signedTxHex)` and `broadcastTransaction(error.signedTxHex)`.

**Example:**
```typescript
const txId = await client.sendBtc(
  wallet.wif,
  "tb1qrecipient...",
  0.0005, // 50,000 satoshis
  2       // 2 sat/vB fee rate
);
console.log('Transaction sent:', txId);
```

### `createTransaction(wif, toAddress, amount, feeRate?)`

Creates and signs a Bitcoin transaction without broadcasting. A dry-run client returns `result: 'dry_run_transaction_hex'`.

**Parameters:**
- `wif` (string): Sender's WIF
- `toAddress` (string): Recipient's address
- `amount` (number): Amount in **BTC**
- `feeRate` (number, optional): Fee rate in sat/vB

**Returns:** `Promise<CreateTxResponse>` - Transaction creation result

**Response Object:**
```typescript
{
  success: boolean;
  result: string | null;  // Signed raw transaction hex
  error: string | null;   // Error message if failed (e.g. "Insufficient funds: …")
}
```

**Example:**
```typescript
const result = await client.createTransaction(
  wallet.wif,
  "tb1qrecipient...",
  0.001, // 100,000 satoshis
  15
);

if (result.success) {
  console.log('Transaction created:', result.result);
} else {
  console.error('Failed:', result.error);
}
```

### `broadcastTransaction(rawTransaction)`

Broadcasts a signed raw transaction. Safe to repeat with the same hex: a transaction the network already has is reported as accepted. A dry-run client returns `result: 'dry_run_transaction_id'`.

**Parameters:**
- `rawTransaction` (string): Raw transaction hex

**Returns:** `Promise<BroadcastTxResponse>` - `{ success, result: txid | null, error }`. `success: false` means the network did not take it; an unknown outcome (no answer within 30 seconds, or a dropped connection) throws `BtcBroadcastUnknownError` carrying `txid` and `signedTxHex`

**Example:**
```typescript
const broadcastResult = await client.broadcastTransaction(rawTransaction);
if (broadcastResult.success) {
  console.log('Transaction ID:', broadcastResult.result);
}
```

### `checkBroadcast(signedTxHex)`

Where a signed transaction stands on the network, for resolving a `BtcBroadcastUnknownError`.

**Returns:** `Promise<BroadcastCheck>`, one of:
- `{ state: 'found', txid, confirmed }`: in the mempool or a block
- `{ state: 'conflicted', txid, conflictingTxid }`: an input is spent by another transaction, so it can never confirm
- `{ state: 'absent', txid }`: not seen and its inputs are unspent; re-broadcast the same hex
- `{ state: 'unresolved', txid }`: an input is spent by a transaction the API does not report

Throws when the API cannot answer.

**Example:**
```typescript
const check = await client.checkBroadcast(signedTxHex);
if (check.state === 'absent') {
  await client.broadcastTransaction(signedTxHex);
}
```

### `getRawTransaction(txId)`

Fetches a transaction's raw bytes.

**Returns:** `Promise<Buffer>`

```typescript
const raw = await client.getRawTransaction(txId);
const hex = raw.toString('hex');
```

## Network Information

### `getFeeRates()`

Retrieves current network fee rates.

**Returns:** `Promise<FeeRates | null>` - Current fee rates, or `null` if the API is unreachable or answers an error (it never throws). On the VerifiedX signet every rate is 1 sat/vB

**Response Object:**
```typescript
{
  fastestFee: number;    // Fastest confirmation (sat/vB)
  halfHourFee: number;   // ~30 minutes (sat/vB)
  hourFee: number;       // ~1 hour (sat/vB)
  economyFee: number;    // Economic rate (sat/vB)
  minimumFee: number;    // Minimum fee (sat/vB)
}
```

**Example:**
```typescript
const fees = await client.getFeeRates();
if (fees) {
  console.log('Fast fee:', fees.fastestFee, 'sat/vB');
  console.log('Standard fee:', fees.hourFee, 'sat/vB');
  console.log('Economy fee:', fees.economyFee, 'sat/vB');
}
```

## Message Signing

### `getSignature(message, privateKey)`

Signs a message with a private key.

**Parameters:**
- `message` (string): The message to sign
- `privateKey` (string): The private key in hex format

**Returns:** `string` - Message signature

**Example:**
```typescript
const signature = client.getSignature("Hello Bitcoin!", privateKey);
console.log('Signature:', signature);
```

### `getSignatureFromWif(message, wif)`

Signs a message using a WIF key.

**Parameters:**
- `message` (string): The message to sign
- `wif` (string): The WIF key

**Returns:** `string` - Message signature

**Example:**
```typescript
const signature = client.getSignatureFromWif("Hello Bitcoin!", wallet.wif);
```

## Types

All are exported from the `btc` namespace (`import type { btc } from 'vfx-web-sdk'`, then `btc.BtcKeypair`), each also under an `I`-prefixed name (`IBtcKeypair`, …).

### BtcKeypair

```typescript
interface BtcKeypair {
  address: string | undefined;
  addresses: BtcAddresses;
  wif: string;
  privateKey: string | undefined;
  publicKey: string;
  mnemonic?: string;  // set by generateMnemonic
}

interface BtcAddresses {
  p2pkh: string | undefined;
  p2sh: string | undefined;
  bech32: string | undefined;
  bech32m: string | undefined;
}
```

### AccountInfo

```typescript
interface AccountInfo {
  balance: number;
  totalRecieved: number;
  totalSent: number;
  txCount: number;
}
```

### CreateTxResponse / BroadcastTxResponse

```typescript
interface CreateTxResponse {
  success: boolean;
  result: string | null;
  error: string | null;
}
// BroadcastTxResponse has the same shape; result is the txid
```

### BroadcastCheck

```typescript
type BroadcastCheck =
  | { state: 'found'; txid: string; confirmed: boolean }
  | { state: 'conflicted'; txid: string; conflictingTxid: string }
  | { state: 'absent'; txid: string }
  | { state: 'unresolved'; txid: string };
```

### FeeRates

```typescript
interface FeeRates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}
```

## Error Handling

Bitcoin operations report failure in different ways:

### Insufficient Balance
`sendBtc` does not throw for a payment it cannot build; it logs the reason and resolves to `null`. Use `createTransaction` to read the reason:
```typescript
const created = await client.createTransaction(wif, toAddress, amount);
if (!created.success) {
  console.log(created.error); // "Insufficient funds: …" or "No UTXOs found for the given address."
}
```

### Unknown Broadcast Outcome
```typescript
import { BtcBroadcastUnknownError } from 'vfx-web-sdk';

try {
  await client.sendBtc(wif, toAddress, amount);
} catch (error) {
  if (error instanceof BtcBroadcastUnknownError) {
    const check = await client.checkBroadcast(error.signedTxHex);
    if (check.state === 'absent') await client.broadcastTransaction(error.signedTxHex);
  }
}
```

### Invalid Address
```typescript
try {
  await client.getAddressInfo(address);
} catch (error) {
  console.log(error.message); // "Error fetching address info: 400"
}
```

### Network Errors
```typescript
const fees = await client.getFeeRates();
if (!fees) {
  // API unreachable: fall back to a default fee rate
}
```

## Best Practices

### Security
- **Secure WIF storage**: WIF keys provide full control over funds
- **Validate addresses**: Always verify recipient addresses before sending
- **Use appropriate fee rates**: Balance between speed and cost

### Performance
- **Cache fee rates**: Don't fetch fees for every transaction
- **Batch address lookups**: Group multiple address queries when possible
- **Handle rate limits**: the mempool.space API has rate limiting

### Address Types
- **Use bech32 for new applications**: Lower fees and better support
- **Support multiple formats**: For maximum compatibility
- **Default to bech32**: Unless specific requirements dictate otherwise

## Constants

### Conversion Constants
```typescript
const BTC_TO_SATOSHI_MULTIPLIER = 100000000;
const SATOSHI_TO_BTC_MULTIPLIER = 0.00000001;
```

### Networks
The client automatically configures the correct Bitcoin network based on the constructor parameter:
- `'mainnet'`: Bitcoin mainnet
- `'testnet'`: Bitcoin testnet address formats. From 9.0.4 the testnet client uses the [VerifiedX signet](/build/signet/) by default: a private Bitcoin signet with 10-minute blocks and `tb1…` addresses (explorer `https://signet.verifiedx.io`, API `https://signet.verifiedx.io/api`). On 9.0.3 or earlier, pass `apiBaseUrl: 'https://signet.verifiedx.io/api'`. Test BTC comes from the [testnet faucet](https://spyglass-testnet.verifiedx.io/faucet) (Signet BTC tab).

## Examples

### Complete Bitcoin Wallet Implementation

```typescript
import { btc } from 'vfx-web-sdk';

class BitcoinWallet {
  private client: btc.BtcClient;
  private keypair: btc.BtcKeypair | null = null;

  constructor(network: 'mainnet' | 'testnet' = 'testnet') {
    this.client = new btc.BtcClient(network);
  }

  createWallet(): { mnemonic: string; address: string } {
    const wallet = this.client.generateMnemonic();
    this.keypair = wallet;

    return {
      mnemonic: wallet.mnemonic!,
      address: wallet.address!
    };
  }

  restoreWallet(mnemonic: string, index: number = 0): string {
    this.keypair = this.client.privateKeyFromMnemonic(mnemonic, index);
    return this.keypair.address!;
  }

  async getBalance(): Promise<number> {
    if (!this.keypair) throw new Error('Wallet not initialized');

    const info = await this.client.getAddressInfo(this.keypair.address!);
    return info.balance;
  }

  async getBalanceBTC(): Promise<number> {
    const satoshis = await this.getBalance();
    return satoshis / 100000000;
  }

  // amount in BTC; resolves to the txid, or null when nothing was sent
  async send(toAddress: string, amountBtc: number, feeRate?: number): Promise<string | null> {
    if (!this.keypair) throw new Error('Wallet not initialized');

    return await this.client.sendBtc(
      this.keypair.wif,
      toAddress,
      amountBtc,
      feeRate
    );
  }

  async getTransactionHistory(): Promise<btc.Transaction[]> {
    if (!this.keypair) throw new Error('Wallet not initialized');

    return await this.client.getTransactions(this.keypair.address!);
  }

  signMessage(message: string): string {
    if (!this.keypair) throw new Error('Wallet not initialized');

    return this.client.getSignatureFromWif(message, this.keypair.wif);
  }
}
```

## Integration with VFX

For cross-chain applications combining Bitcoin and VFX functionality, see the [Cross-Chain Integration Guide](/build/sdk/cross-chain/).
