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

Returns a paginated list of NFTs with filtering and search capabilities.

**Query Parameters:**
- `search`: Search by NFT name or identifier
- `ordering`: Order results (e.g., `-created_at`, `name`)
- `owner`: Filter by owner address
- `collection`: Filter by collection smart contract

**Response:**
```json
{
  "count": 75000,
  "next": "http://localhost:8000/api/nft/?page=2",
  "previous": null,
  "results": [
    {
      "identifier": "NFT123...",
      "name": "Digital Artwork #1",
      "description": "A beautiful piece of digital art",
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "creator_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "collection": "Cool Art Collection",
      "image_url": "https://media.vfx.io/nft/image123.png",
      "thumbnail_url": "https://media.vfx.io/nft/thumb123.png",
      "mint_date": "2024-01-01T12:00:00Z",
      "last_sale_price": "150.0",
      "attributes": [
        {
          "trait_type": "Background",
          "value": "Blue"
        }
      ]
    }
  ]
}
```

### Get NFTs by Multiple Addresses
```http
GET /api/nft/addresses/{addresses}/
```

Returns NFTs owned by multiple addresses (comma-separated).

**Parameters:**
- `addresses` (string): Comma-separated list of VFX addresses

### Get Listed NFT Identifiers
```http
GET /api/nft/listed/{owner_address}/
```

Returns identifiers of NFTs currently listed for sale by an owner.

**Parameters:**
- `owner_address` (string): The owner's VFX address

**Response:**
```json
{
  "results": [
    "NFT123...",
    "NFT456...",
    "NFT789..."
  ]
}
```

### Get NFT Details
```http
GET /api/nft/{identifier}/
```

Returns detailed information about a specific NFT.

**Parameters:**
- `identifier` (string): The NFT identifier

**Response:**
```json
{
  "identifier": "NFT123...",
  "name": "Digital Artwork #1",
  "description": "A beautiful piece of digital art",
  "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "creator_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
  "collection": {
    "name": "Cool Art Collection",
    "smart_contract_uid": "SC456..."
  },
  "metadata": {
    "image": "https://media.vfx.io/nft/image123.png",
    "animation_url": "https://media.vfx.io/nft/animation123.mp4",
    "external_url": "https://example.com/nft123"
  },
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue",
      "rarity": "15%"
    },
    {
      "trait_type": "Style",
      "value": "Abstract",
      "rarity": "8%"
    }
  ],
  "mint_transaction": {
    "hash": "tx123...",
    "block_height": 12345,
    "timestamp": "2024-01-01T12:00:00Z"
  },
  "royalty_info": {
    "percentage": 5.0,
    "recipient": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P"
  },
  "listing": {
    "price": "200.0",
    "currency": "VFX",
    "marketplace": "VFX Marketplace",
    "expires_at": "2024-02-01T12:00:00Z"
  }
}
```

### Get NFT History
```http
GET /api/nft/{identifier}/history/
```

Returns the complete transaction history for an NFT.

**Parameters:**
- `identifier` (string): The NFT identifier

**Response:**
```json
{
  "num_pages": 1,
  "page": 1,
  "count": 5,
  "results": [
    {
      "type": "mint",
      "hash": "tx123...",
      "from_address": null,
      "to_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "amount": null,
      "timestamp": "2024-01-01T12:00:00Z",
      "block_height": 12345
    },
    {
      "type": "transfer",
      "hash": "tx456...",
      "from_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "to_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "amount": "150.0",
      "timestamp": "2024-01-15T14:30:00Z",
      "block_height": 12678
    },
    {
      "type": "sale",
      "hash": "tx789...",
      "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "to_address": "RQKDU4UUCwbKXoydjknnH1y7Y3QYYHkvUz",
      "amount": "200.0",
      "timestamp": "2024-01-20T16:45:00Z",
      "block_height": 12890
    }
  ]
}
```

### Verify NFT Ownership
```http
POST /api/nft/verify-ownership/
```

Verifies ownership of an NFT using cryptographic signature.

**Request:**
```json
{
  "signature": "signature_data_here...",
  "message": "I own this NFT",
  "nft_identifier": "NFT123...",
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR"
}
```

**Response:**
```json
{
  "verified": true,
  "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "nft_identifier": "NFT123...",
  "verification_timestamp": "2024-01-01T12:00:00Z"
}
```

## Field Descriptions

### NFT Data
- `identifier`: Unique NFT identifier/token ID
- `name`: Human-readable name of the NFT
- `description`: Detailed description of the NFT
- `owner_address`: Current owner's VFX address
- `creator_address`: Original creator's VFX address
- `collection`: Collection information or name
- `image_url`: URL to the main NFT image
- `thumbnail_url`: URL to a smaller preview image

### Metadata
- `image`: Main image URL
- `animation_url`: URL for animated/video content
- `external_url`: Link to external website or marketplace

### Attributes
- `trait_type`: Category/type of the attribute
- `value`: The actual attribute value
- `rarity`: How rare this attribute is within the collection

### Transaction History
- `type`: Transaction type (mint, transfer, sale, burn)
- `hash`: Transaction hash
- `from_address/to_address`: Sender and recipient addresses
- `amount`: Sale price (if applicable)
- `timestamp`: When the transaction occurred

## Transaction Types

- `mint`: NFT was created/minted
- `transfer`: NFT was transferred between addresses
- `sale`: NFT was sold (transfer with payment)
- `burn`: NFT was destroyed/burned
- `misc`: Other smart contract interactions

## Notes

- NFT identifiers are unique within the VFX ecosystem
- Images and metadata may be stored on IPFS for decentralization
- Rarity percentages are calculated within each collection
- Royalty information defines creator earnings on secondary sales
- Listing information shows current marketplace availability
- Ownership verification uses VFX's cryptographic signature system
