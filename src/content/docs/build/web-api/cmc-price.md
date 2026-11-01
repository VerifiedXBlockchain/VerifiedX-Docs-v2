---
title: "Web API: CMC Price"
description: Explorer API endpoints for current and historical CoinMarketCap price data.
sidebar:
  label: "CMC Price"
  order: 7
---

The CMC Price API provides the latest and recent CoinMarketCap USD price data for BTC and VFX. The explorer records a CoinMarketCap quote for each coin every five minutes.

## Base URL
```
/api/cmc-price/
```

## Endpoints

### Get Latest Price
```http
GET /api/cmc-price/{coin_type}/
```

Returns the latest recorded price for a coin.

**Parameters:**
- `coin_type` (string): `btc` or `vfx` (case-insensitive)

**Response:**
```json
{
  "success": true,
  "message": "success",
  "data": {
    "coin_type": "btc",
    "usdt_price": 77831.54028038826,
    "volume_24h": 12365223751.733767,
    "percent_change_24h": 0.43023492,
    "last_updated": "2026-11-01T11:54:00Z",
    "percent_change_1h": -0.09301457640333757
  }
}
```

Any other `coin_type` answers `400`:

```json
{
  "success": false,
  "message": "Not a valid coin type, Must be `btc` or `vfx`"
}
```

### Get Price History
```http
GET /api/cmc-price/{coin_type}/history/
```

Returns up to the 1,000 most recent recorded prices for a coin, newest first. It takes no query parameters.

**Parameters:**
- `coin_type` (string): `btc` or `vfx`

**Response:**
```json
{
  "success": true,
  "message": "success",
  "data": [
    [77831.54028038826, 1793534040.0],
    [77837.80384232599, 1793533743.0]
  ]
}
```

Each entry is `[usd_price, unix_timestamp_seconds]`.

## Field Descriptions

### Price Data
- `coin_type`: `btc` or `vfx`
- `usdt_price`: Price in USD
- `volume_24h`: 24-hour trading volume in USD
- `percent_change_24h`: Price change percentage in the last 24 hours
- `percent_change_1h`: Price change percentage in the last hour (may be 0 when not recorded)
- `last_updated`: CoinMarketCap's timestamp for the quote (ISO 8601, UTC)

## Notes

- Price data is sourced from the CoinMarketCap API
- Prices are JSON numbers
- When CoinMarketCap quotes no market price for a coin, no new row is recorded and the API keeps serving the last quote that had one; check `last_updated` before relying on a price
- Responses are cached for a short time
