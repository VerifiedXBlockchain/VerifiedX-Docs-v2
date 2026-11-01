---
title: "Web API: Price"
description: Explorer API endpoints for current and historical VFX price data and price trends.
sidebar:
  label: "Price"
  order: 14
---

The Price API provides VFX/USDT price information: the live exchange price and the explorer's recorded price history. Prices come from the Bitrue `RBXUSDT` ticker (the market still lists VFX under its legacy RBX symbol). For CoinMarketCap data, see [CMC Price](/build/web-api/cmc-price/).

## Base URL
```
/api/price/
```

## Endpoints

### List Price History
```http
GET /api/price/
```

Returns the recorded prices between two Unix timestamps, oldest first. The list is not paginated.

**Query Parameters:**
- `start` (integer): Start of the range as a Unix timestamp in seconds (default: one hour ago)
- `end` (integer): End of the range as a Unix timestamp in seconds (default: now)

**Response:**
```json
[
  {
    "price": 0.0051,
    "created_at": "2023-11-14T22:14:46.453988Z",
    "ts": 1700000086
  }
]
```

:::note
The explorer stopped recording prices on 2025-01-11. A range after that date returns an empty list; use Get Current Price for the live price.
:::

### Get Current Price
```http
GET /api/price/current/
```

Returns the live VFX price, fetched from the exchange ticker at request time.

**Response:**
```json
{
  "price": 0.0005,
  "created_at": "2026-11-01T11:57:33.287090Z",
  "ts": 1793534253
}
```

### Get Latest Price
```http
GET /api/price/latest/
```

Returns the most recent recorded price.

**Response:**
```json
{
  "price": 0.0016,
  "created_at": "2025-01-11T03:36:48.699087Z",
  "ts": 1736566609
}
```

## Field Descriptions

- `price`: VFX price in USDT, as a JSON number
- `created_at`: When the price was recorded (ISO 8601, UTC); for the current price, the time of the request
- `ts`: The same moment as a Unix timestamp in seconds

## Notes

- The current price is fetched live from the exchange on every request and is not cached
- Recorded prices were sampled every five minutes until recording stopped
