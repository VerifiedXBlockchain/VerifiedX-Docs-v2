---
title: "Web API: BTC"
description: Explorer API endpoints for Bitcoin address information and vBTC vault data, including vBTC V2 vaults and attestation heights.
sidebar:
  label: "BTC"
  order: 5
  attrs:
    class: sidebar-btc
---

The BTC API of the VerifiedX explorer provides Bitcoin address information and vBTC (Verified Bitcoin) vault data.

## Base URL
```
/api/btc/
```

## Endpoints

### Get Bitcoin Address Information
```http
GET /api/btc/address/{address}/
```

Returns a Bitcoin address's confirmed balance, its transactions from the last seven days and its UTXOs, read from a third-party Bitcoin data provider.

:::caution
On 2026-11-01 this endpoint answered `500` on both networks. Use a Bitcoin explorer or the node's BTC routes for address data until it is fixed.
:::

**Parameters:**
- `address` (string): The Bitcoin address
- `offset` (query parameter): Pagination offset for transactions and UTXOs (default: 0, 50 per page)

**Response:**
```json
{
  "balance": "0.0005",
  "transactions": {
    "total": 25,
    "results": [
      {
        "id": "abc123...",
        "index": 0,
        "hash": "abc123...",
        "recipients": [{ "address": "bc1q...", "amount": "0.0005" }],
        "senders": [{ "address": "bc1q...", "amount": "0.00051" }],
        "timestamp": "abc123...",
        "fee": "0.00001"
      }
    ]
  },
  "utxos": {
    "total": 3,
    "results": [
      {
        "address": "bc1q...",
        "amount": "0.00025",
        "index": 0,
        "is_available": true,
        "is_confirmed": true,
        "timestamp": 1640995200,
        "transaction_id": "def456..."
      }
    ]
  }
}
```

### Broadcast a Bitcoin Transaction
```http
POST /api/btc/broadcast/
```

Broadcasts a signed Bitcoin transaction.

**Request Body:**
```json
{
  "raw_tx_hex": "0200000001..."
}
```

**Response:**
```json
{
  "success": true,
  "txid": "def456..."
}
```

A missing `raw_tx_hex` answers `400` with `{"success": false, "message": "raw_tx_hex required"}`; a refused broadcast answers `500` with `success: false` and a `message`.

### Get Default vBTC Image Data
```http
GET /api/btc/vbtc-image-data/
```

Returns the default base64 image the node uses for a vBTC vault that has no image of its own.

**Response:**
```json
{
  "data": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## vBTC V2

vBTC V2 vaults are under `/api/btc/vbtc-v2/`. The explorer indexes them from the chain; for a withdrawal's live state, read the node (see below). Amounts in these responses are JSON numbers in BTC.

### Attestation heights
```http
GET /api/btc/vbtc-v2/heights/
```

```json
{ "record_height": 7568350, "enforcement_height": 7658350, "latest_block_height": 7624952 }
```

These are the mainnet values; testnet answers `400` and `401`.

From `record_height` a new vault is watched; from `enforcement_height` older vaults are frozen. A height is `null` while Core has not set it.

### List vaults
```http
GET /api/btc/vbtc-v2/
GET /api/btc/vbtc-v2/{vfx_address}/
```

All vaults, or those an address owns or has sent or received vBTC on, as `{"results": [...]}` (not paginated). Each result has the vault details shape below.

### Vault details
```http
GET /api/btc/vbtc-v2/detail/{sc_identifier}/
```

```json
{
  "sc_identifier": "9344ffaded944166b2992957f133c8df:1793028387",
  "name": "Treasury vault",
  "description": "",
  "owner_address": "<owner>",
  "pending_owner_address": null,
  "is_watched": true,
  "image_url": "…",
  "deposit_address": "bc1p…",
  "frost_group_public_key": "03…",
  "required_threshold": 51,
  "proof_block_height": 7585002,
  "global_balance": 0.0001,
  "total_received": 0.0,
  "total_sent": 0.0,
  "tx_count": 0,
  "is_pending_withdrawal": false,
  "addresses": { "<owner>": 0.00007, "<holder>": 0.00003 },
  "available_balances": { "<owner>": 0.00007, "<holder>": 0.00003 },
  "nft": { "…": "…" },
  "withdrawal_requests": [ ],
  "created_at": "2026-10-23T13:01:20Z"
}
```

- `is_watched`: the vault was created from the recording height, and the chain records its Bitcoin. A watched vault's backing is `global_balance`, read from the chain; `total_received` and `total_sent` come from Bitcoin providers and are kept up to date only for vaults the chain does not watch.
- `addresses` is each address's gross vBTC on the vault; `available_balances` nets out its open withdrawals and is what a wallet should size sends from.
- `pending_owner_address`: a reserve owner's ownership transfer that takes effect at its unlock.
- `nft` is the vault's smart contract in the format described on the [NFT](/build/web-api/nft/) page, and `withdrawal_requests` holds the withdrawal rows described below.

A transfer row:

```json
{
  "id": 31,
  "from_address": "xPiYBbYNvhNvjmS2nJZDnZ2Py6JDYSuKpa",
  "to_address": "xGru3UjbC8Q6oLr4nMR61Z22JZYBNcoAwq",
  "amount": 0.00001297,
  "is_multi": false,
  "transaction_hash": "8cdc0f6d121803e7ca1a0c8fbabbfb1d7d32676059360da54f940785d16ee307",
  "refused_at_maturity": false,
  "created_at": "2026-10-30T00:59:51Z"
}
```

`is_multi` marks a share of a multi-vault transfer. `refused_at_maturity` marks a reserve-account send the node refused when it fell due, which moved nothing.

### Transfers and withdrawals of a vault
```http
GET /api/btc/vbtc-v2/transfers/{sc_identifier}/
GET /api/btc/vbtc-v2/withdrawals/{sc_identifier}/
```

A withdrawal row (one per vault share of a request):

```json
{
  "id": 19,
  "requestor_address": "<requester>",
  "btc_address": "bc1q…",
  "amount": 0.00002,
  "fee_rate": 3.0,
  "btc_transaction_hash": "c314d462…",
  "status": "completed",
  "signed_at": null,
  "request_transaction_hash": "<request hash>",
  "completion_transaction_hash": null,
  "created_at": "2026-10-28T14:02:11Z",
  "completed_at": "2026-10-28T14:40:03Z",
  "pin_state": null,
  "pin_txid": null,
  "pin_fee_rate": null,
  "releasing": null,
  "expires_at_height": null,
  "closed_because": null,
  "refunded_amount": null
}
```

- `status` is `requested`, `pending_btc`, `completed`, `cancellation_requested` or `cancelled`. A watched vault's withdrawal goes from `requested` to `completed` (paid, with the paying `btc_transaction_hash`) or `cancelled`.
- `closed_because` says why a `cancelled` row closed without payment: `Cancelled`, `Released`, `Expired` or `Void`. `refunded_amount` is set when less than the amount came back (a release keeps its Bitcoin fee).
- While a watched vault's withdrawal is open, `pin_state` is `Waiting` or `Pinned`, with the newest pin's `pin_txid` and `pin_fee_rate`, `releasing`, and `expires_at_height` while it waits.

:::caution[Follow open withdrawals through the node]
The node reports a withdrawal's pin in the block that mines the request. The explorer reads it later, after a following Bitcoin report, so `pin_state` and `pin_txid` can be empty while a withdrawal is already pinned. Integrators should follow open withdrawals with the node's `GetWithdrawalPin` and `GetWithdrawalRequestShares` routes ([vBTC](/build/vbtc/integration/#follow-a-withdrawal)).
:::

### Write routes

The `/api/btc/vbtc-v2/…/prepare/` and `…/send/` routes forward raw builds and signed submissions to a node's `vbtcapi/VBTC` raw routes. They take snake-case fields (for a withdrawal request `sc_identifier`, `requestor_address`, `btc_address`, `amount`, `fee_rate`; for a send `hash`, `signature`, `public_key`) and answer with the node's answer and `success`, or with `success: false`, `message` and the node's answer under `raw`. The steps and checks are those of [vBTC Raw Integration](/build/vbtc/raw-integration/).

| Route | Required fields |
|---|---|
| `POST /api/btc/vbtc-v2/ceremony/prepare/` | `owner_address` |
| `POST /api/btc/vbtc-v2/ceremony/execute/` | `ceremony_id`, `session_id`, `owner_address`, `start_signature`, `start_timestamp`, `share_distribution_signature`, `share_distribution_timestamp` |
| `GET /api/btc/vbtc-v2/ceremony/{ceremony_id}/` | (ceremony status; an unknown id answers `500` "Ceremony not found") |
| `POST /api/btc/vbtc-v2/create/prepare/` | `owner_address`, `name`, `description`, `ticker`, `ceremony_id`, `timestamp`, `unique_id`, `owner_signature` |
| `POST /api/btc/vbtc-v2/create/send/` | `hash`, `signature`, `public_key` |
| `POST /api/btc/vbtc-v2/transfer/prepare/` | `sc_identifier`, `from_address`, `to_address`, `amount` |
| `POST /api/btc/vbtc-v2/transfer/send/` | `hash`, `signature`, `public_key` |
| `POST /api/btc/vbtc-v2/withdraw/request/prepare/` | `sc_identifier`, `requestor_address`, `btc_address`, `amount`, `fee_rate` |
| `POST /api/btc/vbtc-v2/withdraw/multi/prepare/` | `requestor_address`, `btc_address`, `total_amount`, `fee_rate`; optional `inputs`, `unique_id` |
| `POST /api/btc/vbtc-v2/withdraw/request/send/` | `hash`, `signature`, `public_key` |
| `POST /api/btc/vbtc-v2/withdraw/complete/prepare/` | `sc_identifier`, `withdrawal_request_hash`, `owner_address` |
| `POST /api/btc/vbtc-v2/withdraw/complete/execute/` | `owner_address`, `sc_identifier`, `withdrawal_request_hash`, `session_id`, `start_timestamp`, `start_signature`, `share_distribution_timestamp`, `share_distribution_signature`, `amount`, `btc_destination`; optional `fee_rate` |
| `GET /api/btc/vbtc-v2/withdraw/complete/status/{job_id}/` | (signing job status; an unknown id answers `404` "Job not found") |
| `POST /api/btc/vbtc-v2/withdraw/complete/tx/prepare/` | `sc_identifier`, `from_address`, `withdrawal_request_hash`, `btc_transaction_hash`, `amount`, `btc_destination` |
| `POST /api/btc/vbtc-v2/withdraw/complete/tx/send/` | `hash`, `signature`, `public_key` |
| `POST /api/btc/vbtc-v2/withdraw/cancel/prepare/` | `sc_identifier`, `owner_address`, `withdrawal_request_hash` |
| `POST /api/btc/vbtc-v2/withdraw/cancel/send/` | `hash`, `signature`, `public_key` |
| `GET /api/btc/vbtc-v2/ownership-transfer/{sc_identifier}/{to_address}/{locator}/` | (returns `{"success": true, "tx_data": [...]}` for a vault ownership transfer) |
| `GET /api/btc/vbtc-v2/beacon-upload/{sc_identifier}/{to_address}/{signature}/` | (uploads the vault's assets to a beacon for the recipient) |

A missing required field answers `400` with `{"success": false, "message": "<field> required"}`.

A multi-vault withdrawal is built with `POST /api/btc/vbtc-v2/withdraw/multi/prepare/`, which forwards to the node's `GetRawRequestWithdrawalMultiTxData`. It takes `requestor_address`, `btc_address`, `total_amount`, `fee_rate` and, optionally, `inputs`, one `{"sc_identifier", "amount"}` per vault (at most 10, summing to `total_amount`). With `inputs`, the node checks every share against the vault, the per-share fee floor and the destination; without it, the node allocates from chain state, largest vault first, and answers with the single-vault shape when one vault covers the total. The answer carries the hash to sign. The signed hash goes through `withdraw/request/send/`, like a single-vault request. A refusal answers HTTP 500 with the node's `message`, and a missing field or malformed `inputs` HTTP 400.

The explorer has no route for a fee raise or release; send those to a node.

## Field Descriptions

### Bitcoin Address Data
- `balance`: Confirmed Bitcoin balance in BTC, as a string
- `transactions.total`, `utxos.total`: Totals reported by the data provider

## Notes

- vBTC is Bitcoin held one to one in vaults whose keys are split among VerifiedX validators
- vBTC V2 amounts are JSON numbers in BTC; the Bitcoin address endpoint returns provider amounts as strings
- UTXOs (Unspent Transaction Outputs) are used for Bitcoin transaction construction
- Read endpoints are cached for performance
- Bitcoin address validation follows standard Bitcoin address formats
