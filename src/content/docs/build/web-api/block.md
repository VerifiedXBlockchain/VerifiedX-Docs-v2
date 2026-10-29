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
/api/block/
```

## Endpoints

### List Blocks
```http
GET /api/block/
```

Returns a paginated list of blocks, ordered by height (newest first).

**Query Parameters:**
- `search`: Search by hash, height, validator address, or master node name
- `ordering`: Order results (e.g., `-height`, `height`)
- `master_node`: Filter by master node ID

**Response:**
```json
{
  "count": 1000,
  "next": "http://localhost:8000/api/block/?page=2",
  "previous": null,
  "results": [
    {
      "height": 12345,
      "hash": "block_hash_123...",
      "validator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "timestamp": "2024-01-01T12:00:00Z",
      "transaction_count": 15,
      "master_node": {
        "id": 1,
        "name": "MasterNode1",
        "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR"
      }
    }
  ]
}
```

### Get Block by Height
```http
GET /api/block/{height}/
```

Returns detailed information for a specific block by height.

**Parameters:**
- `height` (integer): The block height

**Response:**
```json
{
  "height": 12345,
  "hash": "block_hash_123...",
  "validator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "timestamp": "2024-01-01T12:00:00Z",
  "transaction_count": 15,
  "size": 1024,
  "master_node": {
    "id": 1,
    "name": "MasterNode1",
    "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR"
  },
  "transactions": [
    {
      "hash": "tx_hash_123...",
      "type": "TRANSFER",
      "amount": "100.0"
    }
  ]
}
```

### Get Block by Hash
```http
GET /api/block/hash/{hash}/
```

Returns detailed information for a specific block by hash.

**Parameters:**
- `hash` (string): The block hash

**Response:**
```json
{
  "height": 12345,
  "hash": "block_hash_123...",
  "validator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "timestamp": "2024-01-01T12:00:00Z",
  "transaction_count": 15,
  "master_node": {
    "id": 1,
    "name": "MasterNode1"
  }
}
```

### Get Blocks by Validator Address
```http
GET /api/block/address/{address}/
```

Returns a paginated list of blocks validated by a specific address.

**Parameters:**
- `address` (string): The validator address

**Response:**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/block/address/R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR/?page=2",
  "previous": null,
  "results": [
    {
      "height": 12345,
      "hash": "block_hash_123...",
      "validator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "timestamp": "2024-01-01T12:00:00Z",
      "transaction_count": 15
    }
  ]
}
```

## Field Descriptions

- `height`: The sequential block number
- `hash`: Unique block hash identifier
- `validator_address`: Address of the validator who created this block
- `timestamp`: When the block was created (ISO 8601 format)
- `transaction_count`: Number of transactions in the block
- `size`: Block size in bytes
- `master_node`: Information about the associated master node

## Notes

- Blocks are ordered by height in descending order (newest first) by default
- All endpoints support caching for improved performance
- Block validation is performed by validator addresses associated with master nodes
- Transaction details may be included in block responses depending on the endpoint
