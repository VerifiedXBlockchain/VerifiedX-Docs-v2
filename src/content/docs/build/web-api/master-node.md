---
title: "Web API: Master Node"
description: "Explorer API endpoints for validators (master nodes): details, lookup by name, and map data."
sidebar:
  label: "Master Node"
  order: 10
---

Validators (master nodes) as recorded by the explorer: address, name, active flag, connection time, geolocation, and blocks produced.

## Base URL
```
/api/masternodes/
```

## Endpoints

### List Master Nodes
```http
GET /api/masternodes/
```

Returns a paginated list of every validator address the explorer has recorded. Filter with `is_active=true` for the current validator set.

**Query Parameters:**
- `is_active`: `true` or `false`
- `search`: match on address or name; results then use the full record shape (see details below)
- `ordering`: a response field, prefixed with `-` for descending (for example `-date_connected`)
- `compact`: any value; each result then has only `address`, `name`, `is_active`, and `location_name` (city, region, country joined with commas, or `-`)
- `page`, `limit`: page number and page size; the default and maximum page size is 15000

**Response:**
```json
{
  "count": 19673,
  "page": 1,
  "num_pages": 2,
  "results": [
    {
      "address": "RNLsAwj8pn6EXbHv1LYokuFGHXTVnxcwfr",
      "name": "Merkle Science 1",
      "is_active": true,
      "date_connected": "2026-08-31T11:01:23.701409Z",
      "city": "Boardman",
      "country": "United States",
      "latitude": 45.8401,
      "longitude": -119.705
    }
  ]
}
```

### Get Master Node Details
```http
GET /api/masternodes/{address}/
```

**Parameters:**
- `address` (string): The validator's VFX address

**Response:**
```json
{
  "address": "RNLsAwj8pn6EXbHv1LYokuFGHXTVnxcwfr",
  "name": "Merkle Science 1",
  "is_active": true,
  "date_connected": "2026-08-31T11:01:23.701409Z",
  "city": "Boardman",
  "country": "United States",
  "latitude": 45.8401,
  "longitude": -119.705,
  "block_count": 24250,
  "unique_name": "Merkle Science 1",
  "connect_date": "2026-08-31T11:01:23.701409Z"
}
```

### Get Master Node by Name
```http
GET /api/masternodes/name/{name}/
```

Same response shape as the details endpoint. URL-encode names that contain spaces.

### Map Data
```http
GET /api/masternodes/map/
```

Paginated like the list, with the same query parameters. Each result carries only the coordinates and the address:

```json
{
  "count": 19673,
  "page": 1,
  "num_pages": 2,
  "results": [
    {
      "latitude": 45.8401,
      "longitude": -119.705,
      "address": "RNLsAwj8pn6EXbHv1LYokuFGHXTVnxcwfr"
    }
  ]
}
```

## Field Descriptions

- `address`: the validator's VFX address
- `name`, `unique_name`: the validator name chosen at activation (unique on the network); `unique_name` repeats `name`
- `is_active`: whether the node is in the current active validator set
- `date_connected`, `connect_date`: when the node was last recorded connecting; `connect_date` repeats `date_connected`
- `city`, `country`, `latitude`, `longitude`: geolocation derived from the node's IP address; may be null or `0.0` when unknown
- `block_count`: blocks this validator has produced (details and name lookups only)

## Notes

- `count` on the unfiltered list includes every validator address ever recorded; `is_active=true` gives the current set.
- There are no uptime, version, performance, rewards, or port fields, and IP addresses are not exposed. Proof of Assurance pays no block rewards.
- `POST /api/masternodes/send/` is an internal ingestion endpoint used by the explorer's own node infrastructure; it is not part of the public API and is not listed in Swagger.
