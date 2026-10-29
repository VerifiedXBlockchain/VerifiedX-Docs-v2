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

### List Transactions
```http
GET /api/transaction/
```

Returns a paginated list of transactions, ordered by most recent first.

**Query Parameters:**
- `search`: Search by transaction hash or addresses
- `ordering`: Order results (e.g., `-height`, `timestamp`)
- `type`: Filter by transaction type
- `from_address`: Filter by sender address
- `to_address`: Filter by recipient address

**Response:**
```json
{
  "count": 1250000,
  "next": "http://localhost:8000/api/transaction/?page=2",
  "previous": null,
  "results": [
    {
      "hash": "tx123456789abcdef...",
      "type": "TRANSFER",
      "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "to_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "total_amount": "100.0",
      "total_fee": "0.001",
      "timestamp": "2024-01-01T12:00:00Z",
      "height": 12345,
      "confirmations": 6,
      "status": "confirmed"
    }
  ]
}
```

### Get Transaction Details
```http
GET /api/transaction/{hash}/
```

Returns detailed information about a specific transaction.

**Parameters:**
- `hash` (string): Transaction hash

**Response:**
```json
{
  "hash": "tx123456789abcdef...",
  "type": "TRANSFER",
  "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "to_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
  "total_amount": "100.0",
  "total_fee": "0.001",
  "timestamp": "2024-01-01T12:00:00Z",
  "height": 12345,
  "block_hash": "block123...",
  "confirmations": 6,
  "status": "confirmed",
  "size": 256,
  "nonce": 42,
  "data": null,
  "signature": "sig123...",
  "inputs": [
    {
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "amount": "100.001"
    }
  ],
  "outputs": [
    {
      "address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "amount": "100.0"
    },
    {
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "amount": "0.0",
      "type": "fee"
    }
  ],
  "smart_contract_data": null
}
```

### Get Transactions by Address
```http
GET /api/transaction/address/{address}/
```

Returns transactions involving a specific address (as sender or recipient).

**Parameters:**
- `address` (string): VFX address

**Query Parameters:**
- `type`: Filter by transaction type
- `direction`: Filter by direction (`sent`, `received`, `all`) - default: `all`

**Response:**
```json
{
  "count": 150,
  "results": [
    {
      "hash": "tx123456789abcdef...",
      "type": "TRANSFER",
      "direction": "sent",
      "counterparty_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "amount": "100.0",
      "fee": "0.001",
      "timestamp": "2024-01-01T12:00:00Z",
      "height": 12345,
      "status": "confirmed"
    }
  ]
}
```

### Get Transactions by Multiple Addresses
```http
GET /api/transaction/addresses/{addresses}/
```

Returns transactions involving any of the specified addresses.

**Parameters:**
- `addresses` (string): Comma-separated list of VFX addresses

### Get Transactions by Block
```http
GET /api/transaction/block/{height}/
```

Returns all transactions in a specific block.

**Parameters:**
- `height` (integer): Block height

**Response:**
```json
{
  "block_height": 12345,
  "block_hash": "block123...",
  "timestamp": "2024-01-01T12:00:00Z",
  "transaction_count": 15,
  "transactions": [
    {
      "hash": "tx123456789abcdef...",
      "type": "TRANSFER",
      "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "to_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "total_amount": "100.0",
      "total_fee": "0.001",
      "position_in_block": 1
    }
  ]
}
```

## Transaction Types

### Basic Types
- **TRANSFER**: Basic VFX token transfer
- **SMART_CONTRACT**: Smart contract deployment or execution
- **NFT**: NFT minting, transfer, or burn operations
- **RESERVE**: Reserve account operations
- **STAKING**: Validator staking operations
- **VOTE**: Governance voting transactions

### NFT Subtypes
- **NFT_MINT**: Creating a new NFT
- **NFT_TRANSFER**: Transferring NFT ownership
- **NFT_BURN**: Destroying an NFT
- **NFT_EVOLVE**: Upgrading/evolving an NFT

### Smart Contract Subtypes
- **CONTRACT_DEPLOY**: Deploying new smart contract
- **CONTRACT_CALL**: Calling smart contract function
- **TOKEN_CREATE**: Creating fungible token

## Field Descriptions

### Basic Transaction Data
- `hash`: Unique transaction identifier
- `type`: Category of transaction
- `from_address`: Sender's VFX address
- `to_address`: Recipient's VFX address  
- `total_amount`: Amount transferred (excluding fees)
- `total_fee`: Transaction processing fee
- `timestamp`: When the transaction was created
- `height`: Block height containing this transaction
- `confirmations`: Number of blocks confirming this transaction
- `status`: Current transaction status

### Technical Details
- `size`: Transaction size in bytes
- `nonce`: Sequence number for sender's transactions
- `data`: Additional transaction data (for smart contracts)
- `signature`: Cryptographic signature proving authenticity
- `inputs`: Transaction inputs with amounts
- `outputs`: Transaction outputs and destinations

### Address Query Fields
- `direction`: Whether address was sender or recipient
- `counterparty_address`: The other party in the transaction
- `amount`: Amount relevant to the queried address
- `fee`: Fee paid (only for sent transactions)

## Transaction Status

- `pending`: Transaction submitted but not yet confirmed
- `confirmed`: Transaction included in a block
- `failed`: Transaction failed to execute properly
- `rejected`: Transaction rejected by network

## Notes

- All monetary amounts are returned as strings to preserve precision
- Confirmations increase as new blocks are added after the transaction
- Smart contract transactions may include additional data fields
- NFT transactions reference specific token identifiers
- Fee calculations depend on transaction complexity and network congestion
- Large result sets are paginated for performance
