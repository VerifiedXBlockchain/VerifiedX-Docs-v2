---
title: "Web API: Block"
description: Explorer API endpoints for listing blocks and fetching a block by height, by hash or by validator address.
sidebar:
  label: "Block"
  order: 4
---

The Block API provides endpoints for retrieving blockchain block information, including block details, validation data, and validator-specific queries.

## Base URL
```
/api/blocks/
```

## Endpoints

### List Blocks
```http
GET /api/blocks/
```

Returns a paginated list of blocks, ordered by height (newest first). Each result is a full block object, including its transactions.

**Query Parameters:**
- `search`: Search by hash, height, validator address, or validator name
- `ordering`: Order results (`-height` or `height`)
- `master_node`: Filter by validator address
- `page` (integer): Page number
- `limit` (integer): Results per page (default 30, max 500)

**Response:**
```json
{
  "count": 7624911,
  "page": 1,
  "num_pages": 254164,
  "results": [
    {
      "height": 7624910,
      "master_node": {
        "address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
        "name": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
        "is_active": true,
        "date_connected": "2026-10-24T19:49:15.367843Z",
        "city": "Helsinki",
        "country": "Finland",
        "latitude": 60.1719,
        "longitude": 24.9347,
        "block_count": 36163,
        "unique_name": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
        "connect_date": "2026-10-24T19:49:15.367843Z"
      },
      "hash": "14085c2b9d88a8fe0ca8c6d85223f0ace107dee72447d0c7e438e1f5052fb876",
      "previous_hash": "b1f92deb8dada255fa8cbdcc362174c153160a0508aceb10f813e98559419d43",
      "validator_address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
      "validator_signature": "MEUCIQDpLN0L3fmto6Z5...",
      "chain_ref_id": "m1_Gi9RNxviAq1TmvuPZsZBzdAa8AWVJtNa7cm1dFaT4dWDbdqSNSTh",
      "merkle_root": "de388c28ee953e5cc05b516c1738a2aec4f1e69c3d8865047234a9b45a9fa74a",
      "state_root": "0f75ae4b1a97f9c9e1beb2a2e53346ef463e7b0b71c77eba67d87c61640cc652",
      "total_reward": 0.0,
      "total_amount": 0.0,
      "total_validators": 161,
      "version": 4,
      "size": 1310,
      "craft_time": 13,
      "date_crafted": "2026-11-01T11:44:07Z",
      "transactions": [...]
    }
  ]
}
```

:::caution
On mainnet a `search` by height scans the whole block table and can time out. To fetch a block by height, use `GET /api/blocks/{height}/` instead.
:::

### Get Block by Height
```http
GET /api/blocks/{height}/
```

Returns detailed information for a specific block by height.

**Parameters:**
- `height` (integer): The block height

**Response:**
```json
{
  "height": 7624910,
  "master_node": {
    "address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
    "name": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
    "is_active": true,
    "date_connected": "2026-10-24T19:49:15.367843Z",
    "city": "Helsinki",
    "country": "Finland",
    "latitude": 60.1719,
    "longitude": 24.9347,
    "block_count": 36163,
    "unique_name": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
    "connect_date": "2026-10-24T19:49:15.367843Z"
  },
  "hash": "14085c2b9d88a8fe0ca8c6d85223f0ace107dee72447d0c7e438e1f5052fb876",
  "previous_hash": "b1f92deb8dada255fa8cbdcc362174c153160a0508aceb10f813e98559419d43",
  "validator_address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
  "validator_signature": "MEUCIQDpLN0L3fmto6Z5...",
  "chain_ref_id": "m1_Gi9RNxviAq1TmvuPZsZBzdAa8AWVJtNa7cm1dFaT4dWDbdqSNSTh",
  "merkle_root": "de388c28ee953e5cc05b516c1738a2aec4f1e69c3d8865047234a9b45a9fa74a",
  "state_root": "0f75ae4b1a97f9c9e1beb2a2e53346ef463e7b0b71c77eba67d87c61640cc652",
  "total_reward": 0.0,
  "total_amount": 0.0,
  "total_validators": 161,
  "version": 4,
  "size": 1310,
  "craft_time": 13,
  "date_crafted": "2026-11-01T11:44:07Z",
  "transactions": [
    {
      "hash": "de388c28ee953e5cc05b516c1738a2aec4f1e69c3d8865047234a9b45a9fa74a",
      "height": 7624910,
      "type": 0,
      "type_label": "Tx",
      "to_address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
      "from_address": "Coinbase_BlkRwd",
      "total_amount": 0.0,
      "total_fee": 0.0,
      "data": null,
      "date_crafted": "2026-11-01T11:44:07Z",
      "signature": null,
      "nft": null,
      "unlock_time": null,
      "callback_details": null,
      "recovery_details": null
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Block found
- `404 Not Found`: `{"detail": "Not found."}`

### Get Block by Hash
```http
GET /api/blocks/hash/{hash}/
```

Returns detailed information for a specific block by hash. The response has the same shape as Get Block by Height.

**Parameters:**
- `hash` (string): The block hash

### Get Blocks by Validator Address
```http
GET /api/blocks/address/{address}/
```

Returns a paginated list of blocks validated by a specific address, newest first. Each result has the same shape as Get Block by Height.

**Parameters:**
- `address` (string): The validator address

**Response:**
```json
{
  "count": 36161,
  "page": 1,
  "num_pages": 1206,
  "results": [
    {
      "height": 7624910,
      "hash": "14085c2b9d88a8fe0ca8c6d85223f0ace107dee72447d0c7e438e1f5052fb876",
      "validator_address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
      "date_crafted": "2026-11-01T11:44:07Z",
      "transactions": [...]
    }
  ]
}
```

## Field Descriptions

- `height`: The sequential block number
- `master_node`: The validator that produced the block, in the format described on the [Master Node](/build/web-api/master-node/) page
- `hash`: Unique block hash identifier
- `previous_hash`: Hash of the previous block
- `validator_address`: Address of the validator who created this block
- `validator_signature`: The validator's signature over the block
- `chain_ref_id`: Chain reference identifier carried by the block
- `merkle_root`, `state_root`: Merkle root of the block's transactions and the state root
- `total_reward`: Block reward paid in this block (0 since block rewards ended at height 3,074,181)
- `total_amount`: Sum of the transaction amounts in the block
- `total_validators`: Validator count recorded in the block
- `version`: Block version
- `size`: Block size in bytes
- `craft_time`: Time the validator took to craft the block, as reported by the node
- `date_crafted`: When the block was created (ISO 8601 format)
- `transactions`: The block's transactions, in the format described on the [Transaction](/build/web-api/transaction/) page

## Notes

- Blocks are ordered by height in descending order (newest first) by default
- All endpoints support caching for improved performance
- Blocks are produced by validators; the API names the validator record `master_node` for historical reasons
- Every block endpoint includes the block's full transaction list
