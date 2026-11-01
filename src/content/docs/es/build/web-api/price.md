---
sourceHash: "a00a17986f51"
title: "Web API: Price"
description: Endpoints de la API del explorador para datos de precios actuales e históricos de VFX y tendencias de precio.
sidebar:
  label: "Price"
  order: 14
---

La API de Price ofrece información del precio VFX/USDT: el precio en vivo del exchange y el historial de precios que registró el explorador. Los precios vienen del ticker `RBXUSDT` de Bitrue (el mercado todavía lista VFX con su símbolo heredado RBX). Para datos de CoinMarketCap, consulta [CMC Price](/es/build/web-api/cmc-price/).

## URL base
```
/api/price/
```

## Endpoints

### Listar el historial de precios
```http
GET /api/price/
```

Devuelve los precios registrados entre dos marcas de tiempo Unix, del más antiguo al más reciente. La lista no está paginada.

**Parámetros de consulta:**
- `start` (integer): inicio del rango como marca de tiempo Unix en segundos (por defecto: hace una hora)
- `end` (integer): fin del rango como marca de tiempo Unix en segundos (por defecto: ahora)

**Respuesta:**
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
El explorador dejó de registrar precios el 2025-01-11. Un rango posterior a esa fecha devuelve una lista vacía; usa Obtener el precio actual para el precio en vivo.
:::

### Obtener el precio actual
```http
GET /api/price/current/
```

Devuelve el precio en vivo de VFX, obtenido del ticker del exchange en el momento de la solicitud.

**Respuesta:**
```json
{
  "price": 0.0005,
  "created_at": "2026-11-01T11:57:33.287090Z",
  "ts": 1793534253
}
```

### Obtener el precio más reciente
```http
GET /api/price/latest/
```

Devuelve el precio registrado más reciente.

**Respuesta:**
```json
{
  "price": 0.0016,
  "created_at": "2025-01-11T03:36:48.699087Z",
  "ts": 1736566609
}
```

## Descripción de los campos

- `price`: precio de VFX en USDT, como número JSON
- `created_at`: cuándo se registró el precio (ISO 8601, UTC); para el precio actual, la hora de la solicitud
- `ts`: el mismo momento como marca de tiempo Unix en segundos

## Notas

- El precio actual se obtiene en vivo del exchange en cada solicitud y no se guarda en caché
- Los precios registrados se muestrearon cada cinco minutos hasta que se dejó de registrar
