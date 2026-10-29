---
title: "Web API: Raw"
description: Explorer API endpoints that build, check and broadcast VFX transactions signed on the client, without running a Core CLI node.
sidebar:
  label: "Raw"
  order: 15
---

The Raw API lets an application build, sign, and broadcast VFX transactions without running its own Core CLI node. Each endpoint forwards to the matching node endpoint (`/txapi/TXV1/...` on the explorer's node) and returns the node's response unchanged, so request and response bodies are the same JSON the node accepts. Private keys never leave the client: the client signs the transaction hash locally and submits the signed transaction.

Testnet: `https://data-testnet.verifiedx.io/api/raw/` (testnet addresses start with `x`).

## Base URL
```
/api/raw/
```

## The transaction object

Every transaction endpoint takes a JSON body with a single `transaction` field holding the node's transaction model, the same object described in [Transaction Creation](/build/node-api/transaction-creation/):

```json
{
  "transaction": {
    "Hash": null,
    "ToAddress": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
    "FromAddress": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
    "Amount": 1.0,
    "Nonce": 38,
    "Fee": 0.0,
    "Timestamp": 1788556164,
    "Data": null,
    "Signature": null,
    "Height": 0,
    "TransactionType": 0,
    "TransactionRating": 1,
    "TransactionStatus": null,
    "UnlockTime": null
  }
}
```

Fields are filled in as the flow proceeds: `Fee` after the fee call, `Hash` after the hash call, `Signature` after signing. `Amount` is required on every call. A body without the `transaction` wrapper is rejected:

```json
HTTP 400
{"transaction": ["This field is required."]}
```

## Flow

1. `POST /api/raw/timestamp/` for the timestamp.
2. `POST /api/raw/nonce/{address}/` for the sender's next nonce.
3. Build the transaction with `Fee: 0` and `Hash: null`, then `POST /api/raw/fee/`.
4. Set `Fee`, then `POST /api/raw/hash/`.
5. Sign the hash locally (the signature format is described in [Transaction Creation](/build/node-api/transaction-creation/)); set `Hash` and `Signature`.
6. `POST /api/raw/verify/` (optional, recommended).
7. `POST /api/raw/send/`.

## Endpoints

### Get Current Timestamp
```http
POST /api/raw/timestamp/
```

Returns the current Unix timestamp in seconds as a bare number.

**Response:**
```json
1788556164
```

### Get Address Nonce
```http
POST /api/raw/nonce/{address}/
```

Returns the next nonce for an address as a bare number. `GET` is not accepted (405).

**Parameters:**
- `address` (string): The VFX address

**Response:**
```json
926
```

### Get Transaction Fee
```http
POST /api/raw/fee/
```

Body: the transaction object with `Fee: 0`.

**Response** (from the node's `GetRawTxFee`):
```json
{"Result": "Success", "Message": "TX Fee Calculated", "Fee": 0.00000454}
```

### Get Transaction Hash
```http
POST /api/raw/hash/
```

Body: the transaction object with the fee set.

**Response** (from the node's `GetTxHash`):
```json
{"Result": "Success", "Message": "Hash Calculated.", "Hash": "e6eb50ff020bc259a3b7d6920dbc0fae1c4bdf3488fd88515dc4e7930e0e1d10"}
```

### Verify Transaction
```http
POST /api/raw/verify/
```

Body: the complete, signed transaction object. Verifies without broadcasting.

**Response** (from the node's `VerifyRawTransaction`):
```json
{"Result": "Success", "Message": "Transaction has been verified.", "Hash": "67d97333e5b62abfd6dc8d28a3200677a53b58526aecafd80190b13c5507083e"}
```

Failures return `"Result": "Fail"` with the node's message, for example:
```json
{"Result": "Fail", "Message": "Transaction was not verified. Error: The timestamp of this transactions is too old to be sent now."}
```

### Send Transaction
```http
POST /api/raw/send/
```

Body: the complete, signed transaction object. Broadcasts it to the network.

**Response** (from the node's `SendRawTransaction`):
```json
{"Result": "Success", "Message": "Transaction has been broadcasted.", "Hash": "67d97333e5b62abfd6dc8d28a3200677a53b58526aecafd80190b13c5507083e"}
```

### Validate Signature
```http
POST /api/raw/validate-signature/{message}/{address}/{signature}/
```

Returns `true` with HTTP 200 when the signature is valid for the message and address, and `false` with HTTP 500 otherwise.

### Smart Contract Compile Data
```http
POST /api/raw/smart-contract-data/
```

Body: a smart contract payload as described in [Compiling and Minting](/build/smart-contracts/compiling-and-minting/) (or [vBTC Raw](/build/vbtc/raw-integration/) for a vBTC token). Returns the node's compiled deploy data, which becomes the `Data` of the mint transaction. An asset `Location` other than `default` must be a URL the explorer can download, for example one returned by the [Media API](/build/web-api/media/); the explorer places the file where the node can read it before compiling.

### NFT Transfer, Evolve, and Burn Data
```http
POST /api/raw/nft-transfer-data/{id}/{address}/{locator}/
POST /api/raw/nft-evolve-data/{id}/{address}/{next_state}/
POST /api/raw/nft-burn-data/{id}/{address}/
```

Return the node's `Data` payload for the corresponding transaction (from `GetNftTransferData`, `GetNFTEvolveData`, and `GetNFTBurnData`). `id` is the smart contract identifier; `locator` comes from the beacon upload request below.

### Get Locators
```http
GET /api/raw/locators/{id}/
```

Returns the last known beacon locators for a smart contract (from the node's `GetLastKnownLocators`).

### Beacon Upload Request
```http
GET /api/raw/beacon/upload/{id}/{to_address}/{signature}/
```

Starts a beacon upload of the contract's assets for a transfer. `signature` is the current owner's signature over the smart contract identifier.

**Response:**
```json
{"success": true, "locator": "..."}
```

On failure: `{"success": false, "error": "Beacon upload request failed"}` with HTTP 500.

### Beacon Assets
```http
GET /api/raw/beacon-assets/{id}/{locators}/{address}/{signature}/
```

Asks the node to fetch the contract's assets from the beacon; the explorer then imports the media.

**Response:**
```json
{"success": true}
```

### Withdraw vBTC (raw)
```http
POST /api/raw/withdraw-vbtc/
```

Body: the pre-signed withdrawal payload accepted by the node's `btcapi/BTCV2/WithdrawalCoinRawTX` endpoint.

:::caution
This is a V1 vBTC withdrawal. V1 vBTC was retired at block 7,400,500 on mainnet (from block 1 on the testnet since its October 2026 restart), and the network refuses V1 withdrawals from that height. For vBTC V2 withdrawals see [vBTC Raw Integration](/build/vbtc/raw-integration/).
:::

**Response:**
```json
{"success": true, "result": { "...": "node response" }}
```

## Notes

- Signing happens client-side. Never send private keys to the API.
- The service normalizes `Amount` before forwarding hash, verify, and send calls, so `Amount` must be present.
- Node error messages are returned as-is in `Message`.
- Transactions are irreversible once confirmed. Verify before sending.
