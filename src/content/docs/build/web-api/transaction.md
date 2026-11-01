---
title: "Web API: Transaction"
description: Explorer API endpoints for transaction details and transactions by address, by several addresses or by block, with the transaction types.
sidebar:
  label: "Transaction"
  order: 17
---

The Transaction API provides endpoints for retrieving transaction information, including transaction details, address-specific queries, and block-based transaction listings.

## Base URL
```
/api/transaction/
```

## Endpoints

Every endpoint returns transactions in the format shown under Get Transaction Details. The list endpoints are paginated with `count`, `page`, `num_pages` and `results`, newest first.

**Query Parameters (all list endpoints):**
- `search`: Transactions whose hash, sender or recipient address starts with the term (case-sensitive). A term shorter than 4 characters matches nothing.
- `type`: One transaction type number, or a comma-separated list such as `0,1` (see [Transaction Types](#transaction-types))
- `from_address`: Exact sender address
- `to_address`: Exact recipient address
- `ordering`: `date_crafted` or `-date_crafted` (default)
- `reverse`: `true` reverses the order
- `page` (integer): Page number
- `limit` (integer): Results per page (default 30, max 500)

### List Transactions
```http
GET /api/transaction/
```

Returns a paginated list of all transactions.

**Response:**
```json
{
  "count": 67095,
  "page": 1,
  "num_pages": 2237,
  "results": [
    {
      "hash": "a66687be178fa4fe670738fdcaf3a1ffef066b3926ee2824eefe3268a94d4dd1",
      "height": 65095,
      "type": 0,
      "type_label": "Tx",
      "to_address": "x8NemQSjMUKXaLqbpVU6YNq4P2d6Jbcrra",
      "from_address": "xSSy9Zh3ojDFoGuo2VNFxffMCYPM94xv2V",
      "total_amount": 0.1,
      "total_fee": 0.00000604,
      "data": "null",
      "date_crafted": "2026-11-01T12:05:25Z",
      "signature": "MEQCID2AN8Z4foT2Lu1LR9MM7dMitfavinZAfDhanC2lej77AiA8AYePQ0Fs83NOs8xobAcPRyuV8k5j6EECUQ3kRNoXmw==.3qHA89AEGdWsnEVdmqykUg3rr2yuRipvBXD4za193M9hiCEhPYDSkY86xc1NBrC6DU181NSddJx3xyo2rQR7MyYw",
      "nft": null,
      "unlock_time": null,
      "callback_details": null,
      "recovery_details": null
    }
  ]
}
```

### Get Transaction Details
```http
GET /api/transaction/{hash}/
```

Returns one transaction. An unknown hash answers `404` with `{"detail": "Not found."}`.

**Parameters:**
- `hash` (string): Transaction hash

**Response:**
```json
{
  "hash": "a66687be178fa4fe670738fdcaf3a1ffef066b3926ee2824eefe3268a94d4dd1",
  "height": 65095,
  "type": 0,
  "type_label": "Tx",
  "to_address": "x8NemQSjMUKXaLqbpVU6YNq4P2d6Jbcrra",
  "from_address": "xSSy9Zh3ojDFoGuo2VNFxffMCYPM94xv2V",
  "total_amount": 0.1,
  "total_fee": 0.00000604,
  "data": "null",
  "date_crafted": "2026-11-01T12:05:25Z",
  "signature": "MEQCID2AN8Z4foT2Lu1LR9MM7dMitfavinZAfDhanC2lej77AiA8AYePQ0Fs83NOs8xobAcPRyuV8k5j6EECUQ3kRNoXmw==.3qHA89AEGdWsnEVdmqykUg3rr2yuRipvBXD4za193M9hiCEhPYDSkY86xc1NBrC6DU181NSddJx3xyo2rQR7MyYw",
  "nft": null,
  "unlock_time": null,
  "callback_details": null,
  "recovery_details": null
}
```

### Get Transactions by Address
```http
GET /api/transaction/address/{address}/
```

Returns a paginated list of the transactions an address sent or received.

**Parameters:**
- `address` (string): VFX address

### Get Transactions by Multiple Addresses
```http
GET /api/transaction/addresses/{addresses}/
```

Returns a paginated list of the transactions that any of the addresses sent or received.

**Parameters:**
- `addresses` (string): Comma-separated list of VFX addresses

### Get Transactions by Block
```http
GET /api/transaction/block/{height}/
```

Returns a paginated list of the transactions in a block.

**Parameters:**
- `height` (integer): Block height

## Transaction Types

| `type` | `type_label` | Meaning |
|---|---|---|
| 0 | Tx | VFX transfer |
| 1 | Node | Node registration |
| 2 | Nft Mint | NFT mint |
| 3 | NFT Tx | NFT transfer |
| 4 | NFT Burn | NFT burn |
| 5 | NFT Sale | NFT sale |
| 6 | Address | ADNR domain create, transfer or delete |
| 7 | DST Registration | Decentralized shop registration |
| 8 | Vote Topic | Governance topic |
| 9 | Vote | Governance vote |
| 10 | Reserve | Reserve (vault) account register, callback or recover |
| 11 | Smart Contract Mint | Smart contract mint |
| 12 | Smart Contract Tx | Smart contract transaction |
| 13 | Smart Contract Burn | Smart contract burn |
| 14 | Fungible Token Mint | Fungible token contract mint |
| 15 | Fungible Token Tx | Fungible token operations: transfer, mint, burn, pause, ban, ownership change, vote topic and vote (the `Function` in `data` names it) |
| 16 | Fungible Token Burn | Fungible token burn |
| 17 | Tokenization Mint | Fungible token deploy (`TokenDeploy()` in `data`) |
| 22 | Validator Registration | vBTC validator registration |
| 23 | Validator Heartbeat | vBTC validator heartbeat |
| 24 | Validator Exit | vBTC validator exit |
| 25 | vBTC V2 Mint | vBTC V2 vault contract create |
| 26 | vBTC V2 Transfer | vBTC V2 transfer |
| 27 | vBTC V2 Withdrawal Request | vBTC V2 withdrawal request |
| 28 | vBTC V2 Withdrawal Complete | vBTC V2 withdrawal complete |
| 29 | vBTC Withdrawal Cancel | vBTC V2 withdrawal cancel |
| 30 | vBTC Withdrawal Vote | vBTC V2 cancellation vote |
| 31 | VFX Shield | VFX shield (Prism) |
| 32 | VFX Unshield | VFX unshield (Prism) |
| 33 | VFX Private Transfer | VFX private transfer (Prism) |
| 34 | vBTC Shield | vBTC shield (Prism) |
| 35 | vBTC Unshield | vBTC unshield (Prism) |
| 36 | vBTC Private Transfer | vBTC private transfer (Prism) |
| 37 | vBTC Bridge Lock | vBTC.b bridge lock |
| 38 | vBTC Bridge Unlock | vBTC.b bridge unlock |
| 39 | vBTC Bridge Pool Unlock | vBTC.b bridge pool unlock |
| 40 | vBTC Bridge Exit to BTC | vBTC.b exit to Bitcoin |
| 41 | vBTC Bridge Exit to BTC Complete | vBTC.b exit to Bitcoin complete |
| 42 | vBTC Bridge Exit to BTC Failed | vBTC.b exit to Bitcoin failed |
| 43 | vBTC Bitcoin Report | Bitcoin report entering consensus (no sender) |
| 44 | vBTC Withdrawal Fee Bump | Withdrawal coin pin (fee raise) |
| 45 | vBTC Bitcoin Rewind | Bitcoin reorg report (no sender) |
| 46 | vBTC Vault Rekey | Vault key renewal |

Numbers 18 to 21 belong to retired transaction types and are not listed.

## Field Descriptions

- `hash`: Unique transaction identifier
- `height`: Block height containing this transaction
- `type`, `type_label`: Transaction type number and its label (see the table above)
- `from_address`: Sender's address, or a system name such as `Coinbase_BlkRwd` for block reward records
- `to_address`: Recipient's address, or a base address such as `Adnr_Base`, `Reserve_Base` or `Token_Base`
- `total_amount`: Amount transferred in VFX (excluding fees)
- `total_fee`: Network fee in VFX, which is burned
- `data`: The transaction's data field as a JSON string (smart contract calls, ADNR, vBTC operations)
- `date_crafted`: When the transaction was created (ISO 8601, UTC)
- `signature`: The sender's signature
- `nft`: The NFT the transaction concerns, in the format described on the [NFT](/build/web-api/nft/) page, or `null`
- `unlock_time`: For a reserve account send, when it unlocks; otherwise `null`
- `callback_details`: For a reserve account callback, the transaction it called back (same fields as this one, without `callback_details` and `recovery_details`), or `null`
- `recovery_details`: For a reserve account recover, `original_address`, `new_address`, `amount` and `outstanding_transactions`, or `null`

## Notes

- Only transactions included in blocks are indexed; there are no pending, confirmations or status fields
- All monetary amounts are JSON numbers
- Large result sets are paginated for performance
