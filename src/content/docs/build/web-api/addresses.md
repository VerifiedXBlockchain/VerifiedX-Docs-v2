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

Returns the top 100 addresses by balance, sorted in descending order. The list is not paginated. Each balance is computed from indexed transactions: `received` is the sum of incoming amounts, `sent` is the sum of outgoing amounts plus fees, and `balance` is `received - sent`.

**Response:**
```json
[
  {
    "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
    "balance": 50000.123456789,
    "received": 60000.0,
    "sent": 9999.876543211
  }
]
```

:::caution
On mainnet this aggregate runs over the full transaction history and can take longer than a typical client timeout.
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
