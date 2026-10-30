---
sourceHash: a7dcef1914d6
title: "Web API: Price"
description: Endpoints de la API del explorador para datos de precios actuales e históricos de VFX y tendencias de precio.
sidebar:
  label: "Price"
  order: 14
---

La API de Price ofrece endpoints para obtener información del precio del token VFX, incluidos los precios de mercado actuales, los datos históricos y las tendencias de precio.

## URL base
```
/api/price/
```

## Endpoints

### Listar el historial de precios
```http
GET /api/price/
```

Devuelve una lista paginada de datos históricos de precios.

**Parámetros de consulta:**
- `ordering`: ordena los resultados (p. ej., `-timestamp`, `price`)
- `date_from`: fecha de inicio de los datos de precio (YYYY-MM-DD)
- `date_to`: fecha de fin de los datos de precio (YYYY-MM-DD)

**Respuesta:**
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

### Obtener el precio actual
```http
GET /api/price/current/
```

Devuelve la información de precio más reciente del token VFX.

**Respuesta:**
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

### Obtener el precio más reciente
```http
GET /api/price/latest/
```

Devuelve el dato de precio más reciente (similar a current, pero puede incluir metadatos adicionales).

**Respuesta:**
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

## Descripción de los campos

### Datos de precio
- `price_usd`: precio actual en dólares estadounidenses
- `price_btc`: precio actual en Bitcoin
- `price_eth`: precio actual en Ethereum (si está disponible)
- `market_cap`: capitalización de mercado total en USD
- `volume_24h`: volumen de negociación de 24 horas en USD
- `circulating_supply`: número de tokens actualmente en circulación
- `total_supply`: suministro total máximo de tokens

### Estadísticas de mercado
- `rank`: posición en el ranking de capitalización de mercado entre las criptomonedas
- `change_1h/24h/7d/30d`: porcentajes de cambio del precio en distintos períodos
- `last_updated`: marca de tiempo de la última actualización del precio

### Rango de precios
- `high`: precio más alto de las últimas 24 horas
- `low`: precio más bajo de las últimas 24 horas

### Indicadores de calidad
- `source`: fuente de los datos (external_api, internal_dex, aggregated)
- `confidence_score`: puntuación de confiabilidad (0-100) según la calidad de los datos
- `data_points`: número de fuentes usadas para agregar el precio
- `volatility_index`: medida de la volatilidad del precio (escala de 0 a 1)

## Fuentes de precios

### API externas
- **CoinMarketCap**: proveedor importante de datos de criptomonedas
- **CoinGecko**: datos alternativos del mercado cripto
- **CryptoCompare**: datos de mercado agregados

### Fuentes internas
- **DEX interno**: el exchange descentralizado interno de VFX
- **Exchanges asociados**: plataformas de negociación integradas

### Agregación
- Se combinan varias fuentes para mayor precisión
- La detección de valores atípicos elimina los datos anómalos
- Promedios ponderados según el volumen y la confiabilidad

## Frecuencia de actualización

- **Precio actual**: se actualiza cada 1-5 minutos
- **Datos históricos**: se actualizan cada hora
- **Estadísticas de mercado**: se actualizan cada 15 minutos
- **Métricas de volatilidad**: se actualizan cada 30 minutos

## Retención de datos

- **Datos en tiempo real**: 30 días
- **Datos por hora**: 2 años
- **Datos diarios**: indefinida
- **Agregados semanales/mensuales**: indefinida

## Notas

- Todos los valores de precio se devuelven como strings para conservar la precisión
- Los cambios porcentuales se calculan a partir de los precios de cierre anteriores
- La capitalización de mercado se calcula como circulating_supply × precio actual
- Los datos de volumen representan el volumen de negociación en todos los exchanges monitoreados
- Las puntuaciones de confianza ayudan a identificar datos de precio confiables
- Los datos históricos pueden tener vacíos durante el mantenimiento de la red o por problemas con las fuentes de datos
