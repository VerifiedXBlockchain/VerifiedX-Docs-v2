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

## Authentication

Reads and creates are open. `PATCH` and `DELETE` on a shop, collection or listing require the shop owner's token in the `Authorization` header. Get a token, valid for one hour, by signing a message with the owner's key:

```http
POST /api/auth/sign-token/
```

```json
{
  "message": "any message",
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "signature": "<signature of message by address>"
}
```

The response carries `token` and `expires_at`. Send it as `Authorization: <token>`.

## Endpoints

### List/Create Shops
```http
GET /api/shop/
POST /api/shop/
```

**GET** - Returns a paginated list of shops that are not deleted.

**Query Parameters:**
- `search`: Search by shop URL, name, or owner address
- `owner_address`: Filter by owner address
- `is_published`: `true` or `false`
- `is_third_party`: `true` or `false`
- `page` (integer): Page number
- `limit` (integer): Results per page (default 30, max 500)

**Response:**
```json
{
  "count": 875,
  "page": 1,
  "num_pages": 30,
  "results": [
    {
      "id": 20,
      "unique_id": "rRjDVmfLCS1683686043",
      "name": "Digital Art Gallery",
      "description": "Premium digital artwork collection",
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "is_third_party": true,
      "url": "rbx://digital-art-gallery",
      "is_published": true,
      "is_online": false
    }
  ]
}
```

**POST** - Creates a third-party shop. `rbx://` is added to `url` when missing.

**Request:**
```json
{
  "name": "My NFT Shop",
  "url": "rbx://my-nft-shop",
  "description": "A collection of unique digital assets",
  "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR"
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

`PATCH` accepts `name`, `description` and `is_published`. `DELETE` marks the shop deleted. Both need the owner's token.

### Lookup Shop by URL
```http
GET /api/shop/url/?url=rbx://shop-name
```

Returns the shop with that URL. A missing or unknown URL answers `400`.

**Query Parameters:**
- `url` (string): Shop URL (with or without the `rbx://` prefix)

### Check Shop URL Availability
```http
GET /api/shop/url/available/?url=rbx://shop-name
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

Schedules a re-import of a node-hosted shop after `delay` seconds (default 35). A third-party shop answers `400`.

**Response:**
```json
{
  "success": true
}
```

### Collections

#### List/Create Collections
```http
GET /api/shop/{shop_id}/collection/
POST /api/shop/{shop_id}/collection/
```

**GET Response:**
```json
{
  "count": 1,
  "page": 1,
  "num_pages": 1,
  "results": [
    {
      "id": 11,
      "shop": {
        "id": 20,
        "unique_id": "rRjDVmfLCS1683686043",
        "name": "Digital Art Gallery",
        "description": "Premium digital artwork collection",
        "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
        "is_third_party": true,
        "url": "rbx://digital-art-gallery",
        "is_published": true,
        "is_online": false
      },
      "name": "Pixel Art Collection",
      "is_live": true,
      "description": "8-bit style digital art"
    }
  ]
}
```

**POST** takes `name` and `description`.

#### Get/Update/Delete Collection
```http
GET /api/shop/{shop_id}/collection/{id}/
PATCH /api/shop/{shop_id}/collection/{id}/
DELETE /api/shop/{shop_id}/collection/{id}/
```

`PATCH` accepts `name`, `description` and `is_live`; it and `DELETE` need the owner's token.

### Listings

#### List/Create Listings
```http
GET /api/shop/{shop_id}/collection/{collection_id}/listing/
POST /api/shop/{shop_id}/collection/{collection_id}/listing/
```

**GET** returns the collection's open listings (not deleted, sale not complete).

**GET Response:**
```json
{
  "count": 1,
  "page": 1,
  "num_pages": 1,
  "results": [
    {
      "id": 244,
      "listing_id": 1,
      "collection": { "id": 11, "shop": { "...": "..." }, "name": "Pixel Art Collection", "is_live": true, "description": "..." },
      "smart_contract_uid": "f1e9cd967899476292cb503ed39b1d2c:1739326665",
      "nft": { "identifier": "f1e9cd967899476292cb503ed39b1d2c:1739326665", "...": "..." },
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "buy_now_price": null,
      "floor_price": 3000.0,
      "reserve_price": 3000.0,
      "start_date": "2025-02-11T21:46:36.959000Z",
      "end_date": "2025-02-18T21:46:36.959000Z",
      "has_started": true,
      "has_ended": true,
      "is_visible_before_start_date": true,
      "is_visible_after_end_date": true,
      "final_price": null,
      "is_sale_complete": false,
      "is_sale_pending": false,
      "winning_address": null,
      "thumbnails": ["https://rbx-nft-web-assets.s3.amazonaws.com/BHf55hcvm0hXLQJqDMGzDOOsROyj1dib/IMG_2502.jpeg"],
      "thumbnail_previews": null,
      "purchase_key": "...",
      "auction": {
        "id": 204,
        "current_bid_price": 3000.0,
        "increment_amount": 75.0,
        "is_reserve_met": true,
        "is_auction_over": false,
        "current_winning_address": "RBgMw2d1pe3DPaf387Y8zpXqRPE8ZZ1bUv"
      },
      "bids": []
    }
  ]
}
```

**POST** - Creates a listing. The owner is taken from the NFT.

**Request:**
```json
{
  "collection": 11,
  "smart_contract_uid": "f1e9cd967899476292cb503ed39b1d2c:1739326665",
  "buy_now_price": 150.0,
  "floor_price": 100.0,
  "reserve_price": 120.0,
  "start_date": "2026-11-01T12:00:00Z",
  "end_date": "2026-11-08T12:00:00Z",
  "thumbnails": []
}
```

#### Get/Update/Delete Listing
```http
GET /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
PATCH /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
DELETE /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
```

`PATCH` accepts `buy_now_price`, `floor_price`, `reserve_price`, `start_date` and `end_date`; it and `DELETE` need the owner's token.

### Bidding

#### Create Bid
```http
POST /api/shop/bid/
```

Places a bid or a buy-now purchase on a listing.

**Request:**
```json
{
  "listing": 244,
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "amount": 3100.0,
  "signature": "bid_signature_here...",
  "is_buy_now": false,
  "from_third_party": true,
  "pre_signed_sale_complete_tx": null
}
```

`listing`, `address` and `amount` are required. A bid must exceed the floor price, or the highest accepted bid, by the auction's `increment_amount`. A buy-now `amount` must match `buy_now_price`.

**Response** (`201`):
```json
{
  "success": true,
  "message": "Bid Placed"
}
```

A refused bid answers `200` with only a `message`, for example `"Listing not found."`, `"Not enough balance to process this transaction"` or `"The amount is less than the floor price."`.

#### Get Bid Details
```http
GET /api/shop/bid/{id}/
```

Returns one bid:

```json
{
  "id": 1,
  "bid_id": "6f1c2d3e-4b5a-4c7d-8e9f-0a1b2c3d4e5f",
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "signature": "...",
  "amount": 3100.0,
  "send_time": 1793534700,
  "is_buy_now": false,
  "is_processed": false,
  "purchase_key": "...",
  "status": 0,
  "send_receive": 0
}
```

`status` is `0` accepted, `1` rejected, `2` sent or `3` received; `send_receive` is `0` send or `1` received.

#### Submit Accepted Bid
```http
POST /api/shop/bid/submit/
```

Records a bid a node has already accepted (for node integration). Takes `bid_id`, `amount`, `address`, `listing`, `signature` and optional `is_buy_now`. An already-recorded `bid_id` answers `200`; a new one `201`.

## Field Descriptions

### Shop
- `id`, `unique_id`: Explorer ID and the shop's unique identifier
- `name`, `description`: Display name and description
- `url`: Unique shop URL (`rbx://` format)
- `owner_address`: VFX address of the shop owner
- `is_third_party`: Whether the shop was created through this API rather than hosted by a node
- `is_published`: Whether the shop is published
- `is_online`: Whether the shop's node is online

### Collection
- `shop`: The parent shop
- `name`, `description`: Collection name and description
- `is_live`: Whether the collection is live

### Listing
- `smart_contract_uid`, `nft`: The listed NFT's identifier and its NFT record
- `buy_now_price`: Fixed purchase price (`null` when buy now is off)
- `floor_price`, `reserve_price`: Auction starting price and reserve (`null` when there is no auction)
- `start_date`, `end_date`, `has_started`, `has_ended`: The listing window
- `final_price`, `winning_address`, `is_sale_complete`, `is_sale_pending`: Sale outcome
- `thumbnails`, `thumbnail_previews`: Image URLs for display
- `auction`: Current bid, increment, reserve status and leading address, or `null`
- `bids`: Bids recorded on the listing

### Bid
- `listing`: ID of the listing being bid on
- `amount`: Bid amount in VFX
- `signature`: Signature for bid verification
- `is_buy_now`: Whether this is a buy-now purchase
- `from_third_party`: Whether the bid comes through this API; other bids are only checked and answer "Bid Accepted"

## Listing Types

- **Auction Only**: `floor_price` set, `buy_now_price` null
- **Buy Now Only**: `buy_now_price` set, `floor_price` null
- **Auction + Buy Now**: both set

## Notes

- Shop URLs must be unique and follow the `rbx://` format
- All monetary amounts are in VFX, as JSON numbers
- Thumbnails are served from the explorer's asset bucket (see [Media](/build/web-api/media/))
