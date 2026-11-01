---
title: "Web API: NFT"
description: Explorer API endpoints for NFT details, ownership, transfer history and marketplace listings.
sidebar:
  label: "NFT"
  order: 13
---

The NFT API provides endpoints for retrieving information about non-fungible tokens, including NFT details, ownership, transfer history, and marketplace listings.

## Base URL
```
/api/nft/
```

## Endpoints

### List NFTs
```http
GET /api/nft/
```

Returns a paginated list of on-chain NFTs. Burned NFTs, fungible token contracts and vBTC vaults are excluded.

**Query Parameters:**
- `search`: Search by NFT name or identifier
- `ordering`: Order by a response field, for example `-minted_at` or `name`
- `owner_address`: Filter by owner address
- `minter_address`: Filter by minter address
- `page` (integer): Page number
- `limit` (integer): Results per page (default 30, max 500)

**Response:**
```json
{
  "count": 2542,
  "page": 1,
  "num_pages": 85,
  "results": [
    {
      "identifier": "e70f10e2f68f4905ae310a2111abb6f5:1793057907",
      "name": "Bridge 2026 Receipt 2 of 3",
      "description": "A receipt token from The Bridge 2026, New York.",
      "minter_address": "RQBfMgJyMARNv3qXv75Kh9tf4rwdBahdvJ",
      "owner_address": "RQBfMgJyMARNv3qXv75Kh9tf4rwdBahdvJ",
      "minter_name": "RQBfMgJyMARNv3qXv75Kh9tf4rwdBahdvJ",
      "smart_contract_data": "{\"SmartContractMain\": {...}}",
      "primary_asset_name": "receipt-2.png",
      "primary_asset_size": 515234,
      "minted_at": "2026-10-26T23:38:35Z",
      "mint_transaction": "b39767ff71137a8a78bbc85cb25e5079dbe7c19f361433c014a64dde34672fa8",
      "burn_transaction": null,
      "is_burned": false,
      "data": "[{\"Function\":\"Mint()\",\"ContractUID\":\"e70f10e2f68f4905ae310a2111abb6f5:1793057907\",\"Data\":\"H4sI...\"}]",
      "asset_urls": {
        "receipt-2.png": "https://rbx-nft-web-assets.s3.amazonaws.com/jFhps372uEHEFHHSuYhWCI4c5LNUSxmf/receipt-2.png"
      },
      "is_listed": false
    }
  ]
}
```

### Get NFTs by Multiple Addresses
```http
GET /api/nft/addresses/{addresses}/
```

Returns a paginated list of the NFTs owned by any of the given addresses, in the List NFTs format.

**Parameters:**
- `addresses` (string): Comma-separated list of VFX addresses

### Get Listed NFT Identifiers
```http
GET /api/nft/listed/{owner_address}/
```

Returns identifiers of NFTs an owner currently lists in a shop.

**Parameters:**
- `owner_address` (string): The owner's VFX address

**Response:**
```json
{
  "results": [
    "e70f10e2f68f4905ae310a2111abb6f5:1793057907",
    "18c187fbe7fd46b9aed368cd3e1ac938:1792838812"
  ]
}
```

### Get NFT Details
```http
GET /api/nft/{identifier}/
```

Returns one NFT, in the same format as a List NFTs result.

**Parameters:**
- `identifier` (string): The NFT smart contract identifier

### Get NFT History
```http
GET /api/nft/{identifier}/history/
```

Returns the NFT's transactions (mint, transfers, sales, other smart contract calls, burn) in block order.

**Parameters:**
- `identifier` (string): The NFT identifier

**Response:**
```json
{
  "num_pages": 1,
  "page": 1,
  "count": 1,
  "results": [
    {
      "hash": "b39767ff71137a8a78bbc85cb25e5079dbe7c19f361433c014a64dde34672fa8",
      "height": 7587361,
      "type": 2,
      "type_label": "Nft Mint",
      "to_address": "RQBfMgJyMARNv3qXv75Kh9tf4rwdBahdvJ",
      "from_address": "RQBfMgJyMARNv3qXv75Kh9tf4rwdBahdvJ",
      "total_amount": 0.0,
      "total_fee": 0.00002708,
      "data": "[{\"Function\":\"Mint()\", ...}]",
      "date_crafted": "2026-10-26T23:38:35Z",
      "signature": "MEUCIQ..."
    }
  ]
}
```

All transactions are returned on one page. An unknown identifier answers `404`.

### Verify NFT Ownership
```http
POST /api/nft/verify-ownership/
```

Checks an ownership proof with a node. The proof is the signature string a node's `ProveOwnership` smart contract route produces (see the [Node API](/build/node-api/overview/)).

**Request:**
```json
{
  "signature": "<ownership proof>"
}
```

**Response:**
```json
{
  "verified": true
}
```

A missing `signature` answers `400` with `{"signature": ["This field is required."]}`.

## Field Descriptions

### NFT Data
- `identifier`: The NFT's smart contract identifier
- `name`, `description`: Name and description from the smart contract
- `minter_address`, `minter_name`: Address and name of the minter
- `owner_address`: Current owner's VFX address
- `smart_contract_data`: The smart contract as a JSON string
- `primary_asset_name`, `primary_asset_size`: File name and size in bytes of the primary asset
- `minted_at`: When the NFT was minted
- `mint_transaction`, `burn_transaction`: Hashes of the mint and burn transactions (`burn_transaction` is `null` unless burned)
- `is_burned`: Whether the NFT has been burned
- `data`: The mint transaction's data field
- `asset_urls`: Map of asset file name to a URL where the explorer serves it
- `is_listed`: Whether the NFT is listed in a shop

### Transaction History
- `type`, `type_label`: Transaction type number and label, as on the [Transaction](/build/web-api/transaction/) page
- `hash`, `height`, `date_crafted`: Transaction hash, block height and time
- `from_address`, `to_address`: Sender and recipient addresses
- `total_amount`, `total_fee`: Amount and fee in VFX
- `data`, `signature`: The transaction's data and signature

## Notes

- NFT identifiers are unique within the VFX ecosystem
- `asset_urls` is the explorer's hosted copy of the NFT's assets, for display; it is set through the [Media](/build/web-api/media/) API
- Ownership verification uses VFX's cryptographic signature system
