---
title: "Web API: CMC Price"
description: Explorer API endpoints for current and historical CoinMarketCap price data.
sidebar:
  label: "CMC Price"
  order: 7
---

The CMC Price API provides endpoints for retrieving cryptocurrency price data from CoinMarketCap integration, including current prices and historical data.

## Base URL
```
/api/cmc-price/
```

## Endpoints

### Get Latest Price
```http
GET /api/cmc-price/{coin_type}/
```

Returns the latest price information for a specific cryptocurrency.

**Parameters:**
- `coin_type` (string): The coin identifier (e.g., "bitcoin", "ethereum", "vfx")

**Response:**
```json
{
  "coin_type": "bitcoin",
  "symbol": "BTC",
  "name": "Bitcoin",
  "price_usd": "45000.123456",
  "price_btc": "1.0",
  "market_cap": "850000000000.0",
  "volume_24h": "25000000000.0",
  "percent_change_1h": "0.5",
  "percent_change_24h": "2.3",
  "percent_change_7d": "-1.2",
  "last_updated": "2024-01-01T12:00:00Z",
  "rank": 1
}
```

### Get Price History
```http
GET /api/cmc-price/{coin_type}/history/
```

Returns historical price data for a specific cryptocurrency.

**Parameters:**
- `coin_type` (string): The coin identifier

**Query Parameters:**
- `days` (integer): Number of days of history to return (default: 30)
- `interval` (string): Data interval - "1h", "24h" (default: "24h")

**Response:**
```json
{
  "coin_type": "bitcoin",
  "symbol": "BTC",
  "name": "Bitcoin",
  "history": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "price_usd": "44500.0",
      "market_cap": "845000000000.0",
      "volume_24h": "24000000000.0"
    },
    {
      "timestamp": "2024-01-02T00:00:00Z", 
      "price_usd": "45000.123456",
      "market_cap": "850000000000.0",
      "volume_24h": "25000000000.0"
    }
  ],
  "count": 30
}
```

## Field Descriptions

### Price Data
- `coin_type`: Internal identifier for the cryptocurrency
- `symbol`: Trading symbol (e.g., BTC, ETH)
- `name`: Full name of the cryptocurrency
- `price_usd`: Current price in USD
- `price_btc`: Current price in BTC (Bitcoin equivalent)
- `market_cap`: Total market capitalization in USD
- `volume_24h`: 24-hour trading volume in USD
- `percent_change_1h`: Price change percentage in the last hour
- `percent_change_24h`: Price change percentage in the last 24 hours
- `percent_change_7d`: Price change percentage in the last 7 days
- `last_updated`: Timestamp of the last price update
- `rank`: CoinMarketCap ranking position

### Historical Data
- `timestamp`: Date and time of the price snapshot
- `price_usd`: Historical price in USD at that time
- `market_cap`: Historical market cap at that time
- `volume_24h`: 24-hour volume at that time

## Supported Coin Types

Common coin types supported:
- `bitcoin` - Bitcoin (BTC)
- `ethereum` - Ethereum (ETH)
- `vfx` - VFX Token
- `litecoin` - Litecoin (LTC)
- `bitcoin-cash` - Bitcoin Cash (BCH)

## Notes

- Price data is sourced from CoinMarketCap API
- All price values are returned as strings to preserve decimal precision
- Data is cached for performance - cache duration varies by endpoint
- Historical data availability depends on CoinMarketCap's data retention
- Rate limiting may apply based on CoinMarketCap API limits
- Timestamps are in UTC format (ISO 8601)
