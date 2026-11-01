---
sourceHash: "607b3a722017"
title: "Web API: Metrics"
description: Endpoints de la API del explorador para totales de la red, salud de la cadencia de bloques y cifras de circulación y quema.
sidebar:
  label: "Metrics"
  order: 12
---

Estadísticas a nivel de red. Hay tres grupos de endpoints: `/api/metrics/` para los totales de la cadena y el tiempo de bloque actual, `/api/network-metrics/` para la salud de la cadencia de bloques y `/api/circulation/` para las cifras de suministro y quema que usan el explorador y los rastreadores de suministro. Todos son `GET`, no reciben parámetros y se almacenan en caché en el servidor durante unos segundos.

## Métricas de la red
```http
GET /api/metrics/
```

**Respuesta:**
```json
{
  "latest_block": 7624995,
  "active_validators": 162,
  "total_transactions": 1014007,
  "total_burned": 102193.45511584131,
  "circulating_supply": 199897806.54488415,
  "lifetime_supply": 199897806.54488415,
  "block_time": 12.666666666666666
}
```

**Campos:**
- `latest_block`: número de bloques indexados por el explorador, que sigue la altura actual de la cadena
- `active_validators`: validadores (validators) que están actualmente en el conjunto activo
- `total_transactions`: transacciones indexadas, sin contar los registros coinbase de recompensas de bloque
- `total_burned`: VFX quemado hasta la fecha: todas las comisiones de transacción más los montos quemados por registros de dominios, registros de tiendas y activaciones de bóvedas (vaults) (cuentas de reserva), y en mainnet la quema única que Core aplicó en el bloque 7,568,350
- `circulating_supply`, `lifetime_supply`: 200,000,000 menos `total_burned`; ambos son la misma cifra porque el suministro es fijo y está totalmente en circulación
- `block_time`: promedio de segundos entre bloques en los últimos cinco minutos (`0` cuando caen menos de dos bloques en esa ventana)

Los parámetros `ordering`, `search`, `page` y `limit` que Swagger muestra para este endpoint se ignoran.

## Cadencia de bloques
```http
GET /api/network-metrics/
```

**Respuesta:**
```json
{
  "block_difference_average": 12.5,
  "block_last_received": "2026-09-04T07:41:41Z",
  "block_last_delay": 22,
  "time_since_last_block": 10,
  "blocks_averages": "3456/3456",
  "vbtc_v2_rewind_hold": null
}
```

**Campos:**
- `block_difference_average`: intervalo promedio entre los bloques recientes, en segundos
- `block_last_received`: cuándo recibió el nodo del explorador el último bloque
- `block_last_delay`: retraso del último bloque, en segundos
- `time_since_last_block`: segundos transcurridos desde el último bloque en el momento de la solicitud
- `blocks_averages`: un breve resumen en texto de los conteos de bloques que reporta la información de red del nodo
- `vbtc_v2_rewind_hold`: `null` normalmente. Mientras el explorador retiene datos de vBTC V2 tras un rebobinado de la cadena que todavía no ha conciliado, es un objeto con `rewind_height`, `reconciled_height` y `blocks_held` (bloques indexados desde el rebobinado)

Los valores se actualizan como máximo cada 10 segundos.

## Circulación
```http
GET /api/circulation/
```

**Respuesta:**
```json
{
  "balance": 199897806.54488415,
  "lifetime_supply": 199897806.54488415,
  "fees_burned_sum": 102193.45511584131,
  "fees_burned": 102193,
  "total_staked": 810000.0,
  "active_master_nodes": 162,
  "total_master_nodes": 19740,
  "total_addresses": 24028,
  "total_transactions": 1013961,
  "cli_version": "5.0.1.xxx-beta"
}
```

**Campos:**
- `balance`: suministro circulante en VFX
- `lifetime_supply`: suministro total después de las quemas (igual a `balance`)
- `fees_burned_sum`: VFX quemado exacto (la misma cifra que `total_burned` arriba); `fees_burned`: la misma cifra como entero
- `total_staked`: VFX garantizado por los validadores activos (5,000 VFX por validador activo)
- `active_master_nodes`, `total_master_nodes`: validadores activos ahora, y todas las direcciones de validador que el explorador ha registrado
- `total_addresses`: direcciones conocidas por el explorador
- `total_transactions`: transacciones indexadas
- `cli_version`: un string estático en el servicio actual; no lo uses para detectar la versión de Core

Los valores se actualizan como máximo cada 30 segundos.

Dos variantes en texto plano sirven a los rastreadores de suministro:

```http
GET /api/circulation/circulating/
GET /api/circulation/lifetime/
```

Cada una devuelve el número solo como `text/plain`, por ejemplo `199897806.54488415`.

## Notas

- Los montos son VFX como números JSON, igual que en los demás endpoints de la Web API.
- No hay campos de tasa de hash, dificultad, percentiles de comisiones ni desgloses por hora: la red usa Prueba de Garantía (Proof of Assurance), no minería, y la API no agrega las comisiones por tiempo.
- No se ofrecen métricas por período (24h, 7d, 30d); calcúlalas a partir de los endpoints de [Block](/es/build/web-api/block/) y [Transaction](/es/build/web-api/transaction/).
