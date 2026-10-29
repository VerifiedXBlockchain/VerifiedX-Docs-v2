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

**Response:**
```json
{
  "count": 1000,
  "next": "http://localhost:8000/api/addresses/?page=2",
  "previous": null,
  "results": [
    {
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "balance": "1000.123456789",
      "adnr": {
        "domain": "example.rbx"
      }
    }
  ]
}
```

### Get Top Holders
```http
GET /api/addresses/top-holders/
```

Returns the top 100 addresses by balance, sorted in descending order.

**Response:**
```json
[
  {
    "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
    "balance": "50000.123456789",
    "received": "60000.0",
    "sent": "9999.876543211"
  }
]
```

### Get Address Details
```http
GET /api/addresses/{address}/
```

Returns detailed information for a specific address.

**Parameters:**
- `address` (string): The RBX address to query

**Response:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "balance": "1000.123456789",
  "balance_total": "1000.123456789",
  "balance_locked": "0.0",
  "adnr": "example.rbx",
  "activated": true,
  "deactivated": false
}
```

**Fields:**
- `address`: The RBX address
- `balance`: Available balance
- `balance_total`: Total balance (available + locked)
- `balance_locked`: Locked/staked balance
- `adnr`: Associated ADNR domain name (if any)
- `activated`: Whether the address is a registered Reserve Account
- `deactivated`: Whether the Reserve Account has been deactivated

### Get Address Token Holdings
```http
GET /api/addresses/{address}/tokens/
```

Returns all fungible token balances for a specific address.

**Parameters:**
- `address` (string): The RBX address to query

**Response:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "tokens": [
    {
      "token": {
        "id": 1,
        "name": "Example Token",
        "symbol": "EXT",
        "smart_contract_uid": "SC123..."
      },
      "balance": "500.0"
    }
  ]
}
```

### Lookup Address by ADNR Domain
```http
GET /api/addresses/adnr/{domain}/
```

Returns address information for a given ADNR domain name.

**Parameters:**
- `domain` (string): The ADNR domain name (without .rbx suffix)

**Response:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "balance": "1000.123456789",
  "balance_total": "1000.123456789",
  "balance_locked": "0.0",
  "adnr": "example.rbx"
}
```

**Status Codes:**
- `200 OK`: Address found
- `404 Not Found`: Domain not found

## Notes

- All balance amounts are returned as strings to preserve precision
- Mainnet addresses start with `R`; testnet addresses start with `x`
- Reserve Accounts have additional `activated` and `deactivated` fields
- ADNR domains provide human-readable names for addresses
- Token balances only include fungible tokens, not NFTs
