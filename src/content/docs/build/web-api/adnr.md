---
title: "Web API: ADNR"
description: Explorer API endpoints for listing and resolving ADNR (Address Domain Name Resolution) domains for VFX addresses.
sidebar:
  label: "ADNR"
  order: 3
---

The ADNR (Address Domain Name Resolution) API provides endpoints for managing and resolving human-readable domain names for VFX blockchain addresses.

## Base URL
```
/api/adnr/
```

## Endpoints

### List ADNR Domains
```http
GET /api/adnr/
```

Returns a paginated list of all ADNR domains, ordered by creation height (newest first).

**Query Parameters:**
- `search`: Search by domain name or address
- `ordering`: Order results (e.g., `-create_transaction__height`)

**Response:**
```json
{
  "count": 500,
  "next": "http://localhost:8000/api/adnr/?page=2",
  "previous": null,
  "results": [
    {
      "domain": "example",
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "is_btc": false,
      "btc_address": null,
      "create_transaction": {
        "hash": "tx123...",
        "height": 12345
      }
    }
  ]
}
```

### Get ADNR Domain Details
```http
GET /api/adnr/{domain}/
```

Returns detailed information for a specific ADNR domain.

**Parameters:**
- `domain` (string): The domain name (without .rbx suffix)

**Response:**
```json
{
  "domain": "example",
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "is_btc": false,
  "btc_address": null,
  "create_transaction": {
    "hash": "tx123...",
    "height": 12345
  }
}
```

**Status Codes:**
- `200 OK`: Domain found
- `404 Not Found`: Domain not found

### Lookup ADNR by Bitcoin Address
```http
GET /api/adnr/btc/{btc_address}/
```

Returns the ADNR domain associated with a Bitcoin address (for Bitcoin-linked domains).

**Parameters:**
- `btc_address` (string): The Bitcoin address

**Response:**
```json
{
  "btc_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "domain": "satoshi"
}
```

If no domain is found:
```json
{
  "btc_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "domain": null
}
```

## Field Descriptions

- `domain`: The human-readable domain name
- `address`: The associated VFX blockchain address
- `is_btc`: Whether this domain is linked to a Bitcoin address
- `btc_address`: The associated Bitcoin address (if `is_btc` is true)
- `create_transaction`: Information about the transaction that created this domain

## Notes

- ADNR domains provide human-readable names for VFX addresses (e.g., "example.rbx" instead of "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR")
- Some domains can be linked to Bitcoin addresses for cross-chain functionality
- Domain names are case-insensitive
- The `.rbx` suffix is implied and not stored in the domain field
- Results are cached for performance
