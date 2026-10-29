---
title: "Web API: Price"
description: Explorer API endpoints for current and historical VFX price data and price trends.
sidebar:
  label: "Price"
  order: 14
---

The Price API provides endpoints for retrieving VFX token price information, including current market prices, historical data, and price trends.

## Base URL
```
/api/price/
```

## Endpoints

### List Price History
```http
GET /api/price/
```

Returns a paginated list of historical price data.

**Query Parameters:**
- `ordering`: Order results (e.g., `-timestamp`, `price`)
- `date_from`: Start date for price data (YYYY-MM-DD)
- `date_to`: End date for price data (YYYY-MM-DD)

**Response:**
```json
{
  "count": 1000,
  "next": "http://localhost:8000/api/price/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "price_usd": "5.25",
      "price_btc": "0.000125",
      "market_cap": "262500000.0",
      "volume_24h": "1500000.0",
      "timestamp": "2024-01-01T12:00:00Z",
      "source": "external_api",
      "change_24h": "2.5%",
      "change_7d": "-1.2%"
    }
  ]
}
```

### Get Current Price
```http
GET /api/price/current/
```

Returns the most recent price information for VFX token.

**Response:**
```json
{
  "price_usd": "5.25",
  "price_btc": "0.000125",
  "price_eth": "0.0015",
  "market_cap": "262500000.0",
  "volume_24h": "1500000.0",
  "circulating_supply": "50000000.0",
  "total_supply": "100000000.0",
  "rank": 245,
  "change_1h": "0.5%",
  "change_24h": "2.5%",
  "change_7d": "-1.2%",
  "change_30d": "15.8%",
  "last_updated": "2024-01-01T12:00:00Z",
  "sources": [
    "coinmarketcap",
    "coingecko",
    "internal_dex"
  ]
}
```

### Get Latest Price
```http
GET /api/price/latest/
```

Returns the latest price data point (similar to current, but may include additional metadata).

**Response:**
```json
{
  "id": 1,
  "price_usd": "5.25",
  "price_btc": "0.000125",
  "market_cap": "262500000.0",
  "volume_24h": "1500000.0",
  "timestamp": "2024-01-01T12:00:00Z",
  "source": "aggregated",
  "confidence_score": 95.5,
  "data_points": 3,
  "price_range_24h": {
    "high": "5.45",
    "low": "5.10"
  },
  "volatility_index": 0.12
}
```

## Field Descriptions

### Price Data
- `price_usd`: Current price in US Dollars
- `price_btc`: Current price in Bitcoin
- `price_eth`: Current price in Ethereum (if available)
- `market_cap`: Total market capitalization in USD
- `volume_24h`: 24-hour trading volume in USD
- `circulating_supply`: Number of tokens currently in circulation
- `total_supply`: Maximum total supply of tokens

### Market Statistics
- `rank`: Market capitalization ranking among cryptocurrencies
- `change_1h/24h/7d/30d`: Price change percentages for different timeframes
- `last_updated`: Timestamp of the last price update

### Price Range
- `high`: Highest price in the last 24 hours
- `low`: Lowest price in the last 24 hours

### Quality Indicators
- `source`: Data source (external_api, internal_dex, aggregated)
- `confidence_score`: Reliability score (0-100) based on data quality
- `data_points`: Number of sources used for price aggregation
- `volatility_index`: Measure of price volatility (0-1 scale)

## Price Sources

### External APIs
- **CoinMarketCap**: Major cryptocurrency data provider
- **CoinGecko**: Alternative crypto market data
- **CryptoCompare**: Aggregated market data

### Internal Sources
- **Internal DEX**: VFX's internal decentralized exchange
- **Partner Exchanges**: Integrated trading platforms

### Aggregation
- Multiple sources are combined for accuracy
- Outlier detection removes anomalous data points
- Weighted averages based on volume and reliability

## Update Frequency

- **Current Price**: Updated every 1-5 minutes
- **Historical Data**: Updated every hour
- **Market Statistics**: Updated every 15 minutes
- **Volatility Metrics**: Updated every 30 minutes

## Data Retention

- **Real-time data**: 30 days
- **Hourly data**: 2 years
- **Daily data**: Indefinite
- **Weekly/Monthly aggregates**: Indefinite

## Notes

- All price values are returned as strings to preserve precision
- Percentage changes are calculated from previous close prices
- Market cap is calculated as circulating_supply × current_price
- Volume data represents trading volume across all tracked exchanges
- Confidence scores help identify reliable price data
- Historical data may have gaps during network maintenance or data source issues
