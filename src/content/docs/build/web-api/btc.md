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

Returns Bitcoin address balance, transactions, and UTXOs.

**Parameters:**
- `address` (string): The Bitcoin address
- `offset` (query parameter): Pagination offset (default: 0)

**Response:**
```json
{
  "balance": {
    "confirmed": 50000000,
    "unconfirmed": 0,
    "total": 50000000
  },
  "transactions": {
    "total": 25,
    "results": [
      {
        "txid": "abc123...",
        "confirmations": 6,
        "time": 1640995200,
        "inputs": [...],
        "outputs": [...]
      }
    ]
  },
  "utxos": {
    "total": 3,
    "results": [
      {
        "txid": "def456...",
        "vout": 0,
        "value": 25000000,
        "confirmations": 10
      }
    ]
  }
}
```

### List All VBTC Tokens
```http
GET /api/btc/vbtc/
```

Returns a list of all VBTC tokens in the system.

**Response:**
```json
{
  "count": 100,
  "results": [
    {
      "id": 1,
      "smart_contract_uid": "SC123...",
      "vfx_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "btc_amount": "0.001",
      "status": "active",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Get VBTC Tokens by VFX Address
```http
GET /api/btc/vbtc/{vfx_address}/
```

Returns VBTC tokens associated with a specific VFX address.

**Parameters:**
- `vfx_address` (string): The VFX blockchain address

**Response:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "smart_contract_uid": "SC123...",
      "vfx_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "btc_amount": "0.001",
      "btc_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "status": "active",
      "transfers": [
        {
          "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
          "to_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
          "amount": "0.0005",
          "timestamp": "2024-01-01T12:00:00Z"
        }
      ]
    }
  ]
}
```

### Get VBTC Token Details
```http
GET /api/btc/vbtc/detail/{sc_identifier}/
```

Returns detailed information for a specific VBTC token.

**Parameters:**
- `sc_identifier` (string): The smart contract identifier

**Response:**
```json
{
  "id": 1,
  "smart_contract_uid": "SC123...",
  "vfx_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "btc_amount": "0.001",
  "btc_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "status": "active",
  "metadata": {
    "name": "VBTC Token #1",
    "description": "VFX Bitcoin Token",
    "image": "data:image/png;base64,..."
  },
  "transfers": [],
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Get VBTC Compile Data
```http
GET /api/btc/vbtc-compile-data/{address}/
```

Returns compilation data for VBTC token creation by address.

**Parameters:**
- `address` (string): The VFX address

**Response:**
```json
{
  "success": true,
  "compile_data": {
    "smart_contract_code": "...",
    "constructor_args": "...",
    "compilation_artifacts": "..."
  }
}
```

### Get Default VBTC Image Data
```http
GET /api/btc/vbtc-image-data/
```

Returns the default base64 image data for VBTC tokens.

**Response:**
```json
{
  "image_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## vBTC V2

The `/api/btc/vbtc/` routes above list V1 vBTC tokens, which were retired at block 7,400,500 on mainnet. vBTC V2 vaults are under `/api/btc/vbtc-v2/`. The explorer indexes them from the chain; for a withdrawal's live state, read the node (see below).

:::note
These routes and fields are served by the testnet explorer now and by the mainnet explorer from the 9.0 release.
:::

### Attestation heights
```http
GET /api/btc/vbtc-v2/heights/
```

```json
{ "record_height": 400, "enforcement_height": 401, "latest_block_height": 4217 }
```

From `record_height` a new vault is watched; from `enforcement_height` older vaults are frozen. A height is `null` while Core has not set it.

### List vaults
```http
GET /api/btc/vbtc-v2/
GET /api/btc/vbtc-v2/{vfx_address}/
```

All vaults, or those an address owns or has sent or received vBTC on, as `{"results": [...]}`.

### Vault details
```http
GET /api/btc/vbtc-v2/detail/{sc_identifier}/
```

```json
{
  "sc_identifier": "<contract UID>",
  "name": "Treasury vault",
  "description": "",
  "owner_address": "<owner>",
  "pending_owner_address": null,
  "is_watched": true,
  "image_url": "…",
  "deposit_address": "bc1p…",
  "frost_group_public_key": "03…",
  "required_threshold": 51,
  "proof_block_height": 2839,
  "global_balance": "0.0001",
  "total_received": "…",
  "total_sent": "…",
  "tx_count": 1,
  "is_pending_withdrawal": false,
  "addresses": { "<owner>": "0.00007", "<holder>": "0.00003" },
  "available_balances": { "<owner>": "0.00007", "<holder>": "0.00003" },
  "nft": { "…": "…" },
  "withdrawal_requests": [ ],
  "created_at": "2026-10-23T13:01:20Z"
}
```

- `is_watched`: the vault was created from the recording height, and the chain records its Bitcoin. A watched vault's backing is `global_balance`, read from the chain; `total_received` and `total_sent` come from Bitcoin providers and are kept up to date only for vaults the chain does not watch.
- `addresses` is each address's gross vBTC on the vault; `available_balances` nets out its open withdrawals and is what a wallet should size sends from.
- `pending_owner_address`: a reserve owner's ownership transfer that takes effect at its unlock.

### Transfers and withdrawals of a vault
```http
GET /api/btc/vbtc-v2/transfers/{sc_identifier}/
GET /api/btc/vbtc-v2/withdrawals/{sc_identifier}/
```

A withdrawal row (one per vault share of a request):

```json
{
  "requestor_address": "<requester>",
  "btc_address": "bc1q…",
  "amount": "0.00002",
  "fee_rate": 3,
  "btc_transaction_hash": "c314d462…",
  "status": "completed",
  "request_transaction_hash": "<request hash>",
  "completion_transaction_hash": null,
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

The `/api/btc/vbtc-v2/…/prepare/` and `…/send/` routes forward raw builds and signed submissions to a node's `vbtcapi/VBTC` raw routes. They take snake-case fields (for a withdrawal request `sc_identifier`, `requestor_address`, `btc_address`, `amount`, `fee_rate`; for a send `hash`, `signature`, `public_key`) and answer with the node's answer and `success`, or with `success: false`, `message` and the node's answer under `raw`. The steps and checks are those of [vBTC Raw Integration](/build/vbtc/raw-integration/).

A multi-vault withdrawal is built with `POST /api/btc/vbtc-v2/withdraw/multi/prepare/`, which forwards to the node's `GetRawRequestWithdrawalMultiTxData`. It takes `requestor_address`, `btc_address`, `total_amount`, `fee_rate` and `inputs`, one `{"sc_identifier", "amount"}` per vault (at most 10, summing to `total_amount`). The node checks every share against the vault, the per-share fee floor and the destination before answering with the hash to sign. The signed hash goes through `withdraw/request/send/`, like a single-vault request. A refusal answers HTTP 500 with the node's `message`, and a missing field HTTP 400.

The explorer has no route for a fee raise or release; send those to a node.

## Field Descriptions

### Bitcoin Address Data
- `balance.confirmed`: Confirmed Bitcoin balance in satoshis
- `balance.unconfirmed`: Unconfirmed Bitcoin balance in satoshis
- `balance.total`: Total Bitcoin balance (confirmed + unconfirmed)

### VBTC Token Data
- `smart_contract_uid`: Unique identifier for the VBTC smart contract
- `vfx_address`: Associated VFX blockchain address
- `btc_amount`: Bitcoin amount represented by this token (in BTC)
- `btc_address`: Original Bitcoin address used to create the token
- `status`: Token status (active, burned, etc.)
- `transfers`: Array of transfer records for this token

## Notes

- vBTC is Bitcoin held one to one in vaults whose keys are split among VerifiedX validators
- Bitcoin amounts are typically represented as strings to preserve precision
- UTXOs (Unspent Transaction Outputs) are used for Bitcoin transaction construction
- All endpoints support caching for improved performance
- Bitcoin address validation follows standard Bitcoin address formats
