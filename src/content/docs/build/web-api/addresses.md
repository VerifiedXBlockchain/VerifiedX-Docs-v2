---
title: "Web API: Addresses"
description: Explorer API endpoints for address information, balances, top holders, token holdings and ADNR domain lookup.
sidebar:
  label: "Addresses"
  order: 2
---

The Addresses API provides endpoints for retrieving address information, balances, and token holdings on the VFX blockchain.

## Base URL
```
/api/addresses/
```

## Endpoints

### List Addresses
```http
GET /api/addresses/
```

Returns a paginated list of all addresses with basic information.

**Query Parameters:**
- `ordering`: `balance` or `address`; prefix with `-` for descending order, for example `-balance`
- `search`: Addresses that start with the term (case-sensitive). A term shorter than 4 characters matches nothing.
- `page` (integer): Page number
- `limit` (integer): Results per page (default 30, max 500)

**Response:**
```json
{
  "count": 1000,
  "page": 1,
  "num_pages": 34,
  "results": [
    {
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "balance": 1000.123456789,
      "adnr": {
        "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
        "domain": "example.vfx",
        "create_transaction": { "hash": "...", "type": 6 },
        "is_btc": false,
        "btc_address": null
      }
    }
  ]
}
```

`adnr` is `null` when the address has no domain. `create_transaction` is the full transaction object described on the [Transaction](/build/web-api/transaction/) page.

### Get Top Holders
```http
GET /api/addresses/top-holders/
```

Returns the 100 addresses with the largest balances, sorted in descending order. The list is not paginated and is cached on the server. `balance` is the same balance the address list serves, and system names such as `Adnr_Base` are left out. Each row has the address list's shape.

**Response:**
```json
[
  {
    "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
    "balance": 50000.123456789,
    "adnr": null
  }
]
```

:::caution
Mainnet still serves the older version of this endpoint until the explorer update reaches it. There, each row carries `received` and `sent` totals computed over the full transaction history, and the request can take longer than a typical client timeout.
:::

### Get Address Details
```http
GET /api/addresses/{address}/
```

Returns detailed information for a specific address.

**Parameters:**
- `address` (string): The VFX address to query

**Response:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "balance": 1000.123456789,
  "balance_total": 1000.123456789,
  "balance_locked": 0.0,
  "adnr": "example.vfx",
  "activated": true,
  "deactivated": false
}
```

**Fields:**
- `address`: The VFX address
- `balance`: Available balance
- `balance_total`: Total balance (available + locked)
- `balance_locked`: Locked/staked balance
- `adnr`: Associated ADNR domain name (if any)
- `activated`: Whether the address is a registered Reserve Account
- `deactivated`: Whether the Reserve Account has been deactivated

**Status Codes:**
- `200 OK`: Address found
- `404 Not Found`: `{"detail": "Address not found"}`

### Get Address Token Holdings
```http
GET /api/addresses/{address}/tokens/
```

Returns all fungible token balances for a specific address.

**Parameters:**
- `address` (string): The VFX address to query

**Response:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "tokens": [
    {
      "token": {
        "sc_identifier": "661df86da7314186a63091943547e582:1793057882",
        "name": "Example Token",
        "ticker": "EXT",
        "description": "An example token",
        "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
        "can_mint": true,
        "can_burn": true,
        "can_vote": true,
        "created_at": "2026-10-24T05:35:20Z",
        "initial_supply": 0.0,
        "circulating_supply": 1250.0,
        "decimal_places": 8,
        "image_url": "https://...",
        "is_paused": false,
        "banned_addresses": [],
        "nsfw": false
      },
      "balance": 500.0
    }
  ]
}
```

`token` is the same object returned by the [Fungible Token](/build/web-api/fungible-token/) endpoints. An unknown address returns `404`.

### Lookup Address by ADNR Domain
```http
GET /api/addresses/adnr/{domain}/
```

Returns address information for a given ADNR domain name.

**Parameters:**
- `domain` (string): The full domain name including its suffix, for example `example.vfx` or `example.btc`. A name without the suffix returns `404`.

**Response:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "balance": 1000.123456789,
  "balance_total": 1000.123456789,
  "balance_locked": 0.0,
  "adnr": "example.vfx"
}
```

**Status Codes:**
- `200 OK`: Address found
- `404 Not Found`: Domain not found

## Notes

- Balance amounts are JSON numbers. On the detail and domain endpoints, a balance small enough to print in exponent notation comes back as a string with 16 decimal places instead
- Mainnet addresses start with `R`; testnet addresses start with `x`
- Reserve Accounts have additional `activated` and `deactivated` fields
- ADNR domains provide human-readable names for addresses
- Token balances only include fungible tokens, not NFTs
