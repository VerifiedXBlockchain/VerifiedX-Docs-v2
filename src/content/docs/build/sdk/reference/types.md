---
title: "Types & Interfaces"
description: TypeScript type definitions for the VerifiedX Web SDK, including VFX, Bitcoin, utility, and error types, constants, type guards, and module exports.
sidebar:
  order: 3
---

This page lists the TypeScript types the VerifiedX Web SDK (`vfx-web-sdk` 9.0.4) exports. Import them with `import type { … } from 'vfx-web-sdk'`; Bitcoin types live in the `btc` namespace (`btc.BtcKeypair`).

## VFX Types

### Core Types

```typescript
// Network enumeration
enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet'
}

// Core's TransactionType, values 0 to 46 (complete from 9.0.4; 9.0.3 held only the types the SDK builds)
enum TxType {
  RbxTransfer = 0,                     // TX
  Node = 1,
  NftMint = 2,
  NftTx = 3,
  NftBurn = 4,
  NftSale = 5,
  Adnr = 6,
  DstShop = 7,                         // DSTR: DST shop registration
  VoteTopic = 8,
  Vote = 9,
  Reserve = 10,
  ScMint = 11,                         // SC_MINT: standard smart contract mint
  ScTx = 12,                           // SC_TX
  ScBurn = 13,                         // SC_BURN
  FungibleTokenMint = 14,              // FTKN_MINT: fungible token mint
  TokenTx = 15,                        // FTKN_TX: fungible token transfer and operations
  FungibleTokenBurn = 16,              // FTKN_BURN
  TokenDeploy = 17,                    // TKNZ_MINT in Core; the live fungible-token deploy type
  TokenizationTx = 18,                 // TKNZ_TX
  TokenizationBurn = 19,               // TKNZ_BURN
  TokenizationWithdrawalArbiter = 20,  // TKNZ_WD_ARB
  TokenizationWithdrawalOwner = 21,    // TKNZ_WD_OWNER
  VbtcV2ValidatorRegister = 22,
  VbtcV2ValidatorHeartbeat = 23,
  VbtcV2ValidatorExit = 24,
  VbtcV2ContractCreate = 25,
  VbtcV2Transfer = 26,
  VbtcV2WithdrawalRequest = 27,
  VbtcV2WithdrawalComplete = 28,
  VbtcV2WithdrawalCancel = 29,
  VbtcV2WithdrawalVote = 30,           // Validator vote on a withdrawal cancellation
  VfxShield = 31,
  VfxUnshield = 32,
  VfxPrivateTransfer = 33,
  VbtcV2Shield = 34,
  VbtcV2Unshield = 35,
  VbtcV2PrivateTransfer = 36,
  VbtcV2BridgeLock = 37,               // Lock vBTC for bridging to Base
  VbtcV2BridgeUnlock = 38,             // Unlock vBTC after a burn on Base (single lock)
  VbtcV2BridgePoolUnlock = 39,         // Credit vBTC from several locks to one VFX address
  VbtcV2BridgeExitToBtc = 40,          // Record a Base burnForBTCExit as a Bitcoin withdrawal intent
  VbtcV2BridgeExitToBtcComplete = 41,
  VbtcV2BridgeExitToBtcFail = 42,
  VbtcV2BtcReport = 43,                // Sender-less (BTC_Attestation): Bitcoin headers and vault transactions of one Bitcoin block
  VbtcV2CoinPin = 44,                  // Raises the Bitcoin fee of, or releases, a pinned withdrawal on a watched vault.
  VbtcV2BtcReorg = 45,                 // Sender-less (BTC_Attestation): rewinds reported events after a Bitcoin reorg
  VbtcV2VaultRekey = 46                // Sender-less: replaces a vault's key with one made by the current validators
}

// Second constructor argument of VfxClient (or pass a boolean dryRun)
interface VfxClientOptions {
  dryRun?: boolean;    // verify but do not broadcast
  baseUrl?: string;    // data API origin including /api
  timeoutMs?: number;  // per request, default 30000, 0 disables
}
```

### Keypair Interface

```typescript
interface Keypair {
  privateKey: string;   // Private key in hexadecimal format
  publicKey: string;    // Public key in hexadecimal format
  address: string;      // VFX address (R… on mainnet, x… on testnet)
}
```

### Signer Interface

An external signing authority (HSM, MPC service, hardware wallet). Accepted
everywhere a `Keypair` is.

```typescript
interface Signer {
  address: string;     // VFX address the signature is verified against
  publicKey: string;   // uncompressed secp256k1 public key, hex, 04 prefix optional
  // Sign the 32-byte SHA-256 digest (hex). Return DER as bytes, hex, or base64.
  signDigest(digestHex: string): Promise<Uint8Array | string> | Uint8Array | string;
}

type KeypairOrSigner = Keypair | Signer;
```

### Reserve (Vault) Account Types

```typescript
interface ReserveKeypair extends Keypair {
  // address is the xRBX form; privateKey/publicKey are the vault's own key
  recoveryPrivateKey: string;
  recoveryPublicKey: string;
  recoveryAddress: string;   // ordinary address that can sweep the vault
  restoreCode: string;       // base64("<privateKey>//<recoveryPrivateKey>"), CLI/wallet compatible
}

interface ReserveSendOptions {
  unlockHours?: number;      // delay for a send from a vault; default 24, the network minimum
}
```

### Fungible Token Types

```typescript
interface FungibleToken {
  sc_identifier: string;
  name: string;
  ticker: string;
  description: string | null;
  owner_address: string;
  can_mint: boolean;
  can_burn: boolean;
  can_vote: boolean;
  created_at: string;
  initial_supply: number;
  circulating_supply: number;
  decimal_places: number;
  image_url: string | null;
  is_paused: boolean;
  banned_addresses: string[];
  nsfw: boolean;
}

interface FungibleTokenDetail {
  token: FungibleToken;
  holders: Record<string, number>;   // address → balance
}

interface FungibleTokenBalance {
  token: FungibleToken;
  balance: number;
}

interface TokenImage {
  url: string;               // publicly fetchable; becomes the contract's primary asset
  name?: string;             // defaults to the last path segment of url
  extension?: string;        // defaults to the extension of name
  fileSize?: number;
  thumbnailBase64?: string;  // small inline image wallets display
}

interface DeployTokenParams {
  name: string;
  ticker: string;            // ≤ 20 chars, stored upper-case
  description?: string;      // defaults to name
  decimalPlaces?: number;    // 1–18, default 8
  initialSupply?: number;    // whole tokens; must be 0 when mintable
  mintable?: boolean;
  burnable?: boolean;
  voting?: boolean;
  image?: TokenImage;
}

interface DeployTokenResult {
  transactionHash: string;
  scIdentifier: string;
}

interface TokenVotingTopic {
  sc_identifier: string;
  token: FungibleToken;
  from_address: string;
  topic_id: string;
  name: string;
  description: string;
  vote_requirement: number;
  created_at: string;
  voting_ends_at: string;
  vote_data: unknown;
}
```

### VFX Address Information

```typescript
interface VfxAddress {
  address: string;        // The VFX address
  balance: number;        // Spendable balance in VFX
  balanceTotal: number;   // Balance including locked amounts
  balanceLocked: number;  // Reserve-account sends waiting to settle
  adnr: string | null;    // Associated .vfx name (if any)
  activated: boolean;     // Reserve accounts: Register() has been sent
  deactivated?: boolean;  // Reserve accounts: Recover() has been sent
}
```

### Transaction Interface

As Spyglass returns it from `listTransactionsForAddress`:

```typescript
interface Transaction {
  hash: string;
  height: number;               // Block height
  type: number;                 // Core TransactionType
  type_label: string;           // e.g. "Tx", "Address"
  to_address: string;
  from_address: string;
  total_amount: number;
  total_fee: number;
  data: string | null;          // JSON string for contract, name and token transactions
  date_crafted: string;         // ISO timestamp
  signature: string;
  nft: unknown;
  unlock_time: string | null;   // Reserve-account sends
  callback_details: unknown;
  recovery_details: unknown;
}
```

### Paginated Response

```typescript
interface PaginatedResponse<T> {
  count: number;       // Total number of items
  page: number;        // Current page number
  num_pages: number;   // Number of pages
  results: T[];        // Items on this page
}
```

### Media Upload

```typescript
interface MediaUploadResult { url: string }   // what MediaApiClient.uploadAsset resolves to (9.0.4)
```

### vBTC V2 Types

```typescript
interface VbtcV2Token {
  sc_identifier: string;
  name: string;
  description: string;
  owner_address: string;
  image_url: string;
  deposit_address: string;            // Bitcoin (Taproot) deposit address of the vault
  frost_group_public_key: string;
  required_threshold: number;
  proof_block_height: number;
  global_balance: number;
  total_received: number;
  total_sent: number;
  tx_count: number;
  is_pending_withdrawal: boolean;
  pending_owner_address?: string | null; // next owner while a reserve-account transfer of the vault is locked (9.0.4)
  is_watched?: boolean;               // the chain watches this vault (Core 9.0)
  addresses: Record<string, number>;  // holder → balance
  available_balances?: Record<string, number>; // balance minus open withdrawal requests
  nft: unknown;
  withdrawal_requests: VbtcWithdrawalRequest[];
  created_at: string;
}

type VbtcWithdrawalStatus = 'requested' | 'pending_btc' | 'completed' | 'cancelled' | 'cancellation_requested';

interface VbtcWithdrawalRequest {
  id: number;
  requestor_address: string;
  btc_address: string;
  amount: string;
  fee_rate: string;
  btc_transaction_hash: string;
  status: VbtcWithdrawalStatus;
  request_transaction_hash: string;
  completion_transaction_hash: string | null;
  created_at: string;
  completed_at: string | null;
}

interface VbtcTransfer {
  id: number;
  from_address: string;
  to_address: string;
  amount: string;
  transaction_hash: string;
  is_multi?: boolean;             // one share of a multi-vault transfer (9.0.4)
  refused_at_maturity?: boolean;  // a reserve-account send the node refused when it fell due; nothing moved (9.0.4)
  created_at: string;
}

interface CreateVbtcResult { transactionHash: string; scIdentifier: string; depositAddress: string }
interface VbtcTransferResult { transactionHash: string }
interface VbtcMultiTransferResult { transactionHash: string; inputs: Array<{ scIdentifier: string; amount: number }> }
interface VbtcCancelResult { transactionHash: string }

interface VbtcWithdrawalResult {
  btcTransactionHash: string;         // empty while paid is false
  completionTransactionHash: string;  // empty while paid is false
  withdrawalRequestHash: string;
  paid: boolean;
  watched: VbtcWatchedWithdrawal | null;
  lastError?: string;
}

interface VbtcWatchedWithdrawal {
  status: string;              // Completed, Awaiting_BTC_Confirmation, Awaiting_BTC_Transaction, Closed or Unknown
  paid: boolean;
  notMinedYet: boolean;
  closed: boolean;
  message: string | null;
  state: string | null;        // Waiting, Pinned, Settled, Released, or another closed state
  summary: string | null;
  feeRate: number | null;      // sat/vB of the newest live Bitcoin transaction
  minimumNextFeeRate: number;
  canRaiseFee: boolean;
  canRelease: boolean;
  releasing: boolean;
  canCancel: boolean;
  pinnedBtcTransactionHash: string | null;
  btcTransactionHash: string | null;
  completionTransactionHash: string | null;
  transactions: VbtcWatchedWithdrawalTransaction[];
}

interface VbtcWatchedWithdrawalTransaction {
  txid: string;
  kind: 'Payment' | 'Release';
  feeRate: number | null;
  feeSats: number | null;
  superseded: boolean;
  dead: boolean;
  confirmed: boolean;
}

type VbtcWithdrawalShareOutcome =
  'paid' | 'released' | 'cancelled' | 'closed' | 'being_paid' | 'waiting' | 'not_mined' | 'legacy';

interface VbtcWithdrawalShare {
  scIdentifier: string;
  amount: number;
  outcome: VbtcWithdrawalShareOutcome;
  watched: VbtcWatchedWithdrawal | null;
  pinnedBtcTransactionHash: string | null;
  btcTransactionHash: string | null;
}

interface VbtcMultiWithdrawalResult {
  withdrawalRequestHash: string;
  inputs: Array<{ scIdentifier: string; amount: number }>;
  totalAmount: number;
  btcAddress: string;
  feeRate: number;
  fee: number;                 // VFX fee the request paid
}

interface VbtcWithdrawalSharesResult {
  withdrawalRequestHash: string;
  shares: VbtcWithdrawalShare[];
  settled: boolean;
  lastError?: string;
}

type VbtcProgressPhase =
  | 'ceremony_started' | 'ceremony_polling' | 'ceremony_complete'
  | 'contract_preparing' | 'contract_sent'
  | 'withdraw_request_sent'
  | 'frost_preparing' | 'frost_polling' | 'frost_complete'
  | 'btc_broadcast' | 'completion_recorded'
  | 'watched_polling';

interface VbtcProgressEvent {
  phase: VbtcProgressPhase;
  message: string;
  progress?: number;
  data?: unknown;
}

// Multi-contract allocation (allocateVbtcInputs)
interface VbtcAllocationInput { scIdentifier: string; amount: number }
type VbtcAllocationFailure = 'insufficientBalance' | 'tooManyInputs';
interface VbtcAllocation { inputs: VbtcAllocationInput[]; available: number; failure?: VbtcAllocationFailure }
```

`VbtcWithdrawalStatus` is exported by name from 9.0.4; 9.0.3 only used it inside `VbtcWithdrawalRequest`, so write the union yourself there.

### .btc Name Types

```typescript
// parseBtcNameAcceptanceCode() result
interface BtcNameAcceptance {
  message: string;
  signature: string;
  timestamp: number;   // Unix seconds when the receiver signed
  owner: string;       // VFX address that will own the name
  name: string;
}
```

## Bitcoin Types

All are exported from the `btc` namespace, each also under an `I`-prefixed name (`IBtcKeypair`, …).

### Bitcoin Keypair Types

```typescript
interface BtcKeypair {
  address: string | undefined;    // Default address (bech32)
  addresses: BtcAddresses;
  wif: string;                    // Wallet Import Format
  privateKey: string | undefined; // Private key in hexadecimal format
  publicKey: string;              // Public key in hexadecimal format
  mnemonic?: string;              // 24-word phrase, set by generateMnemonic()
}

interface BtcAddresses {
  p2pkh: string | undefined;      // Legacy (starts with 1, or m/n on testnet)
  p2sh: string | undefined;       // Nested SegWit (starts with 3, or 2 on testnet)
  bech32: string | undefined;     // Native SegWit (starts with bc1q/tb1q)
  bech32m: string | undefined;    // Taproot (starts with bc1p/tb1p)
}

interface BtcClientOptions {
  dryRun?: boolean;
  apiBaseUrl?: string;            // e.g. 'https://signet.verifiedx.io/api' for the VFX testnet
}
```

### Bitcoin Address Information

```typescript
interface AccountInfo {
  balance: number;         // Confirmed balance (satoshis, or BTC with inSatoshis = false)
  totalRecieved: number;   // Total received (spelling as in the SDK)
  totalSent: number;       // Total sent
  txCount: number;         // Number of transactions
}
```

### Bitcoin Transaction Types

```typescript
interface TransactionInput {
  txid: string;            // Previous transaction ID
  vout: number;            // Output index
  prevout: TransactionOutput;
  scriptsig: string;
  scriptsig_asm: string;
  witness: string[];
  is_coinbase: boolean;
  sequence: number;
}

interface TransactionOutput {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address?: string;
  value: number;           // Value in satoshis
}

interface TransactionStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

// btc.Transaction, as getTransactions returns it
interface Transaction {
  txid: string;
  version: number;
  locktime: number;
  vin: TransactionInput[];
  vout: TransactionOutput[];
  size: number;            // bytes
  weight: number;
  fee: number;             // satoshis
  status: TransactionStatus;
}

interface UTXO {
  txid: string;
  vout: number;
  status: TransactionStatus;
  value: number;
}
```

### Bitcoin Fee Rates

```typescript
interface FeeRates {
  fastestFee: number;     // Fastest confirmation fee (sat/vB)
  halfHourFee: number;    // ~30 minute confirmation fee (sat/vB)
  hourFee: number;        // ~1 hour confirmation fee (sat/vB)
  economyFee: number;     // Economy fee rate (sat/vB)
  minimumFee: number;     // Minimum fee rate (sat/vB)
}
```

### Transaction Result Types

```typescript
// createTransaction()
interface CreateTxResponse {
  success: boolean;
  result: string | null;  // Signed raw transaction hex
  error: string | null;
}

// broadcastTransaction()
interface BroadcastTxResponse {
  success: boolean;
  result: string | null;  // Transaction ID
  error: string | null;
}

// checkBroadcast()
type BroadcastCheck =
  | { state: 'found'; txid: string; confirmed: boolean }
  | { state: 'conflicted'; txid: string; conflictingTxid: string }
  | { state: 'absent'; txid: string }
  | { state: 'unresolved'; txid: string };
```

## Utility Types

The SDK has no aliases for addresses, keys or amounts; they are plain `string` and `number`. The conventions:

- **VFX addresses** start with `R` on mainnet and `x` on testnet; reserve (vault) addresses start with `xRBX`.
- **Bitcoin addresses** use mainnet formats (`1…`, `3…`, `bc1q…`, `bc1p…`) or, on testnet and the VerifiedX signet, `m…`/`n…`, `2…`, `tb1q…`, `tb1p…`.
- **Amounts**: VFX in VFX (decimals allowed); `sendBtc` and `createTransaction` take BTC; `getAddressInfo` reports satoshis by default; fee rates are sat/vB.

## Error Types

Error classes exported from `vfx-web-sdk` (use `instanceof`):

```typescript
class VfxApiError extends Error {          // non-2xx answer from the data API
  readonly status: number | undefined;
  readonly url: string;
  readonly body: string | undefined;
}

class VfxNetworkError extends VfxApiError {  // no HTTP response at all: DNS failure, refused or dropped connection, timeout (9.0.4)
  readonly status: undefined;
  readonly cause: unknown;                   // the underlying fetch TypeError or AbortError
}

class TransactionDispatchError extends Error {  // sent, but no answer came back
  readonly hash: string;
  readonly cause: unknown;
}

class TransactionRefusedError extends Error {   // the node refused it (methods that opt in)
  readonly hash: string;
  readonly reason: string | null;
}

class PreSignCheckError extends Error {}        // the transaction to sign was not the one asked for

class VbtcWithdrawalIncompleteError extends Error {   // request on chain, completion failed
  readonly withdrawalRequestHash: string;
  readonly cause: unknown;
}

class VbtcWithdrawalUnrecordedError extends Error {   // Bitcoin sent (or maybe sent), completion not recorded
  readonly withdrawalRequestHash: string;
  readonly btcTransactionHash: string | null;
  readonly signedBtcTxHex: string | null;
  readonly cause: unknown;
}

class VbtcWithdrawalClosedError extends Error {       // watched withdrawal closed unpaid
  readonly withdrawalRequestHash: string;
  readonly withdrawal: VbtcWatchedWithdrawal;
}

class VbtcNodeUnreachableError extends Error {        // Spyglass could not reach the node; ask again
  readonly answer: string;
}

class BtcBroadcastUnknownError extends Error {        // Bitcoin broadcast outcome unknown (also btc.BtcBroadcastUnknownError)
  readonly txid: string;
  readonly signedTxHex: string;
  readonly cause: unknown;
}
```

## Constants and Enums

### VFX Constants

```typescript
const TOKEN_BASE_ADDRESS = 'Token_Base';
const RESERVE_BASE_ADDRESS = 'Reserve_Base';
const RESERVE_ACTIVATION_COST = 4;              // VFX sent with Register()
const RESERVE_MIN_UNLOCK_HOURS = 24;
const VBTC_MULTI_MAX_INPUTS = 25;               // contracts per multi transfer
const VBTC_MULTI_WITHDRAWAL_MAX_INPUTS = 10;    // vaults per multi withdrawal
const VBTC_MULTI_WITHDRAWAL_FUNCTION = 'VBTCWithdrawalRequestMultiV2()';
const VBTC_WITHDRAWAL_DUST_SATS = 546;
const VBTC_WATCHED_MAX_FEE_RATE = 5000;         // sat/vB
const BTC_NAME_ACCEPTANCE_MAX_AGE_SECONDS = 86400;
const BTC_NAME_SIGNED_MESSAGE_HEIGHT_MAINNET = 7_575_250;
const BTC_NAME_SIGNED_MESSAGE_HEIGHT_TESTNET = 7400;
```

### Bitcoin Constants

```typescript
// btc namespace
const BTC_TO_SATOSHI_MULTIPLIER = 100000000;
const SATOSHI_TO_BTC_MULTIPLIER = 0.00000001;
// btc.networks re-exports bitcoinjs-lib's networks (bitcoin, testnet, regtest)
```

## Type Guards

The SDK exports two address checks:

- `isOtherNetworksAddress(address, network)`: true for a well-formed VFX address of the other network (the node refuses those as recipients).
- `assertRecipientOnNetwork(address, network, label?)` and `assertBtcAddressOnNetwork(btcAddress, network, label)`: throw when the address belongs to another network.

Helpers you can write yourself:

```typescript
import type { Keypair } from 'vfx-web-sdk';

// VFX address prefix check (use isOtherNetworksAddress for checksum and version)
function isVfxAddress(value: unknown, network: 'mainnet' | 'testnet'): value is string {
  if (typeof value !== 'string') return false;
  // Reserve (vault) accounts start with xRBX on both networks
  return network === 'mainnet' ? value.startsWith('R') || value.startsWith('xRBX') : value.startsWith('x');
}

// Check if object is a local keypair the SDK can sign with
function isKeypair(value: any): value is Keypair {
  return (
    typeof value === 'object' &&
    typeof value.privateKey === 'string' &&
    typeof value.publicKey === 'string' &&
    typeof value.address === 'string'
  );
}
```

## Module Exports

What `vfx-web-sdk` 9.0.4 exports (`src/index.ts`):

```typescript
// Clients
export { VfxClient, MediaApiClient };   // VfxClient is also the default export and vfx.VfxClient
export * as btc from './btc';           // btc.BtcClient, btc types, KeypairService, TransactionService,
                                        // AccountService, publicKeyToAddress, wifToPrivateKey,
                                        // seedToPrivateKey, hashSeed, regtestUtils, networks

// Enums and constants
export { Network, TxType };
export {
  TOKEN_BASE_ADDRESS, RESERVE_BASE_ADDRESS, RESERVE_ACTIVATION_COST, RESERVE_MIN_UNLOCK_HOURS,
  VBTC_MULTI_MAX_INPUTS, VBTC_MULTI_WITHDRAWAL_FUNCTION, VBTC_MULTI_WITHDRAWAL_MAX_INPUTS,
  VBTC_WITHDRAWAL_DUST_SATS, VBTC_WATCHED_MAX_FEE_RATE, BTC_NAME_ACCEPTANCE_MAX_AGE_SECONDS,
  BTC_NAME_SIGNED_MESSAGE_HEIGHT_MAINNET, BTC_NAME_SIGNED_MESSAGE_HEIGHT_TESTNET,
};

// Errors
export {
  VfxApiError, VfxNetworkError, TransactionDispatchError, TransactionRefusedError, PreSignCheckError,
  VbtcWithdrawalIncompleteError, VbtcWithdrawalUnrecordedError, VbtcWithdrawalClosedError,
  VbtcNodeUnreachableError, BtcBroadcastUnknownError,
};

// Functions
export {
  verifySignature, vfxSignatureFromDer,
  allocateVbtcInputs, vbtcMultiTransferData, vbtcMultiWithdrawalData, withdrawalFeeFloorError,
  parseWatchedWithdrawal, assertBtcAddressOnNetwork, isOtherNetworksAddress, assertRecipientOnNetwork,
  btcNameAcceptanceMessage, buildBtcNameAcceptanceCode, parseBtcNameAcceptanceCode,
  btcNameSignedMessageHeight, btcNameSignedMessagesActive,
};

// Types
export type {
  VfxClientOptions, ReserveSendOptions, Signer, KeypairOrSigner,
  Keypair, VfxAddress, Transaction, PaginatedResponse,
  VbtcV2Token, VbtcWithdrawalRequest, VbtcWithdrawalStatus, VbtcTransfer, CreateVbtcResult, VbtcTransferResult,
  VbtcMultiTransferResult, VbtcMultiWithdrawalResult, VbtcWithdrawalShare, VbtcWithdrawalShareOutcome,
  VbtcWithdrawalSharesResult, VbtcWithdrawalResult, VbtcWatchedWithdrawal,
  VbtcWatchedWithdrawalTransaction, VbtcCancelResult, VbtcProgressPhase, VbtcProgressEvent,
  VbtcAllocation, VbtcAllocationInput, VbtcAllocationFailure, BtcNameAcceptance,
  FungibleToken, FungibleTokenDetail, FungibleTokenBalance, TokenVotingTopic, TokenImage,
  DeployTokenParams, DeployTokenResult, ReserveKeypair, MediaUploadResult,
};
```

These type definitions give full TypeScript support for the VerifiedX Web SDK, with type safety and IntelliSense in your applications.
