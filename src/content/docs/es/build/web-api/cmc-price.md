---
sourceHash: d521134cda5b
title: "Web API: CMC Price"
description: Endpoints de la API del explorador para datos de precios actuales e históricos de CoinMarketCap.
sidebar:
  label: "CMC Price"
  order: 7
---

La API de CMC Price ofrece endpoints para obtener datos de precios de criptomonedas a través de la integración con CoinMarketCap, incluidos los precios actuales y los datos históricos.

## URL base
```
/api/cmc-price/
```

## Endpoints

### Obtener el precio más reciente
```http
GET /api/cmc-price/{coin_type}/
```

Devuelve la información de precio más reciente de una criptomoneda específica.

**Parámetros:**
- `coin_type` (string): el identificador de la moneda (p. ej., "bitcoin", "ethereum", "vfx")

**Respuesta:**
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

### Obtener el historial de precios
```http
GET /api/cmc-price/{coin_type}/history/
```

Devuelve los datos históricos de precios de una criptomoneda específica.

**Parámetros:**
- `coin_type` (string): el identificador de la moneda

**Parámetros de consulta:**
- `days` (integer): número de días de historial que se devuelven (predeterminado: 30)
- `interval` (string): intervalo de los datos - "1h", "24h" (predeterminado: "24h")

**Respuesta:**
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

## Descripción de los campos

### Datos de precio
- `coin_type`: identificador interno de la criptomoneda
- `symbol`: símbolo de cotización (p. ej., BTC, ETH)
- `name`: nombre completo de la criptomoneda
- `price_usd`: precio actual en USD
- `price_btc`: precio actual en BTC (equivalente en Bitcoin)
- `market_cap`: capitalización de mercado total en USD
- `volume_24h`: volumen de negociación de 24 horas en USD
- `percent_change_1h`: porcentaje de cambio del precio en la última hora
- `percent_change_24h`: porcentaje de cambio del precio en las últimas 24 horas
- `percent_change_7d`: porcentaje de cambio del precio en los últimos 7 días
- `last_updated`: marca de tiempo de la última actualización del precio
- `rank`: posición en el ranking de CoinMarketCap

### Datos históricos
- `timestamp`: fecha y hora de la captura del precio
- `price_usd`: precio histórico en USD en ese momento
- `market_cap`: capitalización de mercado histórica en ese momento
- `volume_24h`: volumen de 24 horas en ese momento

## Tipos de moneda compatibles

Tipos de moneda comunes compatibles:
- `bitcoin` - Bitcoin (BTC)
- `ethereum` - Ethereum (ETH)
- `vfx` - Token VFX
- `litecoin` - Litecoin (LTC)
- `bitcoin-cash` - Bitcoin Cash (BCH)

## Notas

- Los datos de precios provienen de la API de CoinMarketCap
- Todos los valores de precio se devuelven como strings para conservar la precisión decimal
- Los datos se almacenan en caché para mejorar el rendimiento; la duración de la caché varía según el endpoint
- La disponibilidad de datos históricos depende de la retención de datos de CoinMarketCap
- Pueden aplicarse límites de solicitudes según los límites de la API de CoinMarketCap
- Las marcas de tiempo están en formato UTC (ISO 8601)
