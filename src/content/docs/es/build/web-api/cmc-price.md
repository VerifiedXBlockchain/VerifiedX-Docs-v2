---
sourceHash: 8a241dff0134
title: "Web API: CMC Price"
description: Endpoints de la API del explorador para datos de precios actuales e históricos de CoinMarketCap.
sidebar:
  label: "CMC Price"
  order: 7
---

La API de CMC Price ofrece los datos de precio en USD más recientes de CoinMarketCap para BTC y VFX. El explorador registra una cotización de CoinMarketCap para cada moneda cada cinco minutos.

## URL base
```
/api/cmc-price/
```

## Endpoints

### Obtener el precio más reciente
```http
GET /api/cmc-price/{coin_type}/
```

Devuelve el precio registrado más reciente de una moneda.

**Parámetros:**
- `coin_type` (string): `btc` o `vfx` (no distingue mayúsculas de minúsculas)

**Respuesta:**
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

Cualquier otro `coin_type` responde `400`:

```json
{
  "success": false,
  "message": "Not a valid coin type, Must be `btc` or `vfx`"
}
```

### Obtener el historial de precios
```http
GET /api/cmc-price/{coin_type}/history/
```

Devuelve hasta los 1,000 precios registrados más recientes de una moneda, primero el más reciente. No recibe parámetros de consulta.

**Parámetros:**
- `coin_type` (string): `btc` o `vfx`

**Respuesta:**
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

Cada entrada es `[usd_price, unix_timestamp_seconds]`.

## Descripción de los campos

### Datos de precio
- `coin_type`: `btc` o `vfx`
- `usdt_price`: precio en USD
- `volume_24h`: volumen de negociación de 24 horas en USD
- `percent_change_24h`: porcentaje de cambio del precio en las últimas 24 horas
- `percent_change_1h`: porcentaje de cambio del precio en la última hora (puede ser 0 cuando no se registró)
- `last_updated`: la marca de tiempo de CoinMarketCap para la cotización (ISO 8601, UTC)

## Notas

- Los datos de precios provienen de la API de CoinMarketCap
- Los precios son números JSON
- Cuando CoinMarketCap no cotiza un precio de mercado para una moneda, no se registra ninguna fila nueva y la API sigue sirviendo la última cotización que sí lo tenía; revisa `last_updated` antes de confiar en un precio
- Las respuestas se guardan en caché por poco tiempo
