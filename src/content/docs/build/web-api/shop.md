---
title: "Web API: Shop"
description: Explorer API endpoints for NFT marketplace shops, collections, listings and bids.
sidebar:
  label: "Shop"
  order: 16
---

The Shop API provides endpoints for managing NFT marketplace functionality, including shops, collections, listings, and bidding operations within the VFX ecosystem.

## Base URL
```
/api/shop/
```

## Endpoints

### List/Create Shops
```http
GET /api/shop/
POST /api/shop/
```

**GET** - Returns a paginated list of shops.

**Query Parameters:**
- `search`: Search by shop name, URL, or owner address
- `ordering`: Order results (e.g., `-created_at`, `name`)

**Response:**
```json
{
  "count": 150,
  "results": [
    {
      "id": 1,
      "name": "Digital Art Gallery",
      "url": "rbx://digital-art-gallery",
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "description": "Premium digital artwork collection",
      "banner_image": "https://media.vfx.io/shop/banner1.png",
      "profile_image": "https://media.vfx.io/shop/profile1.png",
      "is_verified": true,
      "is_third_party": false,
      "created_at": "2024-01-01T12:00:00Z",
      "collections_count": 5,
      "total_sales": "15000.0"
    }
  ]
}
```

**POST** - Creates a new shop.

**Request:**
```json
{
  "name": "My NFT Shop",
  "url": "rbx://my-nft-shop",
  "description": "A collection of unique digital assets",
  "banner_image": "https://example.com/banner.png"
}
```

### Get/Update/Delete Shop
```http
GET /api/shop/{id}/
PATCH /api/shop/{id}/
DELETE /api/shop/{id}/
```

**Parameters:**
- `id` (integer): Shop ID

### Lookup Shop by URL
```http
GET /api/shop/url/?url=rbx://shop-name
```

Returns shop information by URL.

**Query Parameters:**
- `url` (string): Shop URL (with or without rbx:// prefix)

### Check Shop URL Availability
```http
GET /api/shop/available/?url=rbx://shop-name
```

Checks if a shop URL is available for registration.

**Response:**
```json
{
  "available": true
}
```

### Resync Shop
```http
GET /api/shop/resync/?url=rbx://shop-name&delay=35
```

Triggers a resynchronization of shop data.

### Collections

#### List/Create Collections
```http
GET /api/shop/{shop_id}/collection/
POST /api/shop/{shop_id}/collection/
```

**GET Response:**
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "name": "Pixel Art Collection",
      "description": "8-bit style digital art",
      "image": "https://media.vfx.io/collection/pixel1.png",
      "shop_id": 1,
      "nft_count": 25,
      "floor_price": "50.0",
      "total_volume": "2500.0"
    }
  ]
}
```

#### Get/Update/Delete Collection
```http
GET /api/shop/{shop_id}/collection/{id}/
PATCH /api/shop/{shop_id}/collection/{id}/
DELETE /api/shop/{shop_id}/collection/{id}/
```

### Listings

#### List/Create Listings
```http
GET /api/shop/{shop_id}/collection/{collection_id}/listing/
POST /api/shop/{shop_id}/collection/{collection_id}/listing/
```

**GET Response:**
```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "smart_contract_uid": "NFT123...",
      "name": "Pixel Warrior #1",
      "description": "A brave digital warrior",
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "floor_price": "100.0",
      "buy_now_price": "150.0",
      "is_auction": true,
      "is_buy_now": true,
      "auction_end_time": "2024-01-08T12:00:00Z",
      "current_bid": "120.0",
      "bid_count": 5,
      "is_sale_complete": false
    }
  ]
}
```

**POST** - Creates a new listing.

**Request:**
```json
{
  "smart_contract_uid": "NFT123...",
  "floor_price": "100.0",
  "buy_now_price": "150.0",
  "is_auction": true,
  "is_buy_now": true,
  "auction_duration_hours": 168
}
```

#### Get/Update/Delete Listing
```http
GET /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
PATCH /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
DELETE /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
```

### Bidding

#### Create Bid
```http
POST /api/shop/bid/
```

Places a bid on a listing.

**Request:**
```json
{
  "listing": 1,
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "amount": "125.0",
  "signature": "bid_signature_here...",
  "is_buy_now": false,
  "from_third_party": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bid Placed",
  "bid_id": "bid_123...",
  "amount": "125.0",
  "estimated_confirmation": "2024-01-01T12:02:00Z"
}
```

#### Get Bid Details
```http
GET /api/shop/bid/{id}/
```

Returns detailed information about a specific bid.

#### Submit Accepted Bid
```http
POST /api/shop/bid/accepted/
```

Confirms and processes an accepted bid (for webhook integration).

## Field Descriptions

### Shop
- `name`: Display name of the shop
- `url`: Unique shop URL (rbx:// format)
- `owner_address`: VFX address of the shop owner
- `is_verified`: Whether the shop is officially verified
- `is_third_party`: Whether it's integrated from external platforms
- `collections_count`: Number of collections in the shop
- `total_sales`: Total sales volume in VFX

### Collection
- `shop_id`: ID of the parent shop
- `nft_count`: Number of NFTs in the collection
- `floor_price`: Lowest listing price in the collection
- `total_volume`: Total trading volume for the collection

### Listing
- `smart_contract_uid`: NFT identifier being listed
- `floor_price`: Minimum acceptable price (for auctions)
- `buy_now_price`: Fixed purchase price
- `is_auction`: Whether auction bidding is enabled
- `is_buy_now`: Whether immediate purchase is enabled
- `current_bid`: Highest current bid amount
- `bid_count`: Number of bids received
- `is_sale_complete`: Whether the item has been sold

### Bid
- `listing`: ID of the listing being bid on
- `amount`: Bid amount in VFX
- `signature`: Cryptographic signature for bid verification
- `is_buy_now`: Whether this is a buy-now purchase
- `from_third_party`: Whether bid originates from external platform

## Listing Types

- **Auction Only**: `is_auction: true, is_buy_now: false`
- **Buy Now Only**: `is_auction: false, is_buy_now: true`
- **Auction + Buy Now**: `is_auction: true, is_buy_now: true`

## Notes

- Shop URLs must be unique and follow rbx:// format
- All monetary amounts are in VFX tokens
- Bids require cryptographic signatures for security
- Third-party shops integrate with external NFT platforms
- Auction timers are enforced by smart contracts
- Shop verification is manually reviewed for authenticity
