---
sourceHash: "e9245a383488"
title: "Web API: Block"
description: Endpoints de la API del explorador para listar bloques y obtener un bloque por altura, por hash o por dirección del validador.
sidebar:
  label: "Block"
  order: 4
---

La API de Block ofrece endpoints para obtener información de los bloques de la blockchain, como los detalles de un bloque, los datos de validación y consultas por validador (validator).

## URL base
```
/api/blocks/
```

## Endpoints

### Listar bloques
```http
GET /api/blocks/
```

Devuelve una lista paginada de bloques, ordenada por altura (los más recientes primero). Cada resultado es un objeto de bloque completo, con sus transacciones.

**Parámetros de consulta:**
- `search`: busca por hash, altura, dirección del validador o nombre del validador
- `ordering`: ordena los resultados (`-height` o `height`)
- `master_node`: filtra por dirección del validador
- `page` (integer): número de página
- `limit` (integer): resultados por página (30 de forma predeterminada, 500 como máximo)

**Respuesta:**
```json
{
  "count": 7624911,
  "page": 1,
  "num_pages": 254164,
  "results": [
    {
      "height": 7624910,
      "master_node": {
        "address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
        "name": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
        "is_active": true,
        "date_connected": "2026-10-24T19:49:15.367843Z",
        "city": "Helsinki",
        "country": "Finland",
        "latitude": 60.1719,
        "longitude": 24.9347,
        "block_count": 36163,
        "unique_name": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
        "connect_date": "2026-10-24T19:49:15.367843Z"
      },
      "hash": "14085c2b9d88a8fe0ca8c6d85223f0ace107dee72447d0c7e438e1f5052fb876",
      "previous_hash": "b1f92deb8dada255fa8cbdcc362174c153160a0508aceb10f813e98559419d43",
      "validator_address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
      "validator_signature": "MEUCIQDpLN0L3fmto6Z5...",
      "chain_ref_id": "m1_Gi9RNxviAq1TmvuPZsZBzdAa8AWVJtNa7cm1dFaT4dWDbdqSNSTh",
      "merkle_root": "de388c28ee953e5cc05b516c1738a2aec4f1e69c3d8865047234a9b45a9fa74a",
      "state_root": "0f75ae4b1a97f9c9e1beb2a2e53346ef463e7b0b71c77eba67d87c61640cc652",
      "total_reward": 0.0,
      "total_amount": 0.0,
      "total_validators": 161,
      "version": 4,
      "size": 1310,
      "craft_time": 13,
      "date_crafted": "2026-11-01T11:44:07Z",
      "transactions": [...]
    }
  ]
}
```

:::caution
En mainnet, un `search` por altura recorre toda la tabla de bloques y puede agotar el tiempo de espera. Para obtener un bloque por su altura, usa `GET /api/blocks/{height}/`.
:::

### Obtener un bloque por altura
```http
GET /api/blocks/{height}/
```

Devuelve la información detallada de un bloque específico según su altura.

**Parámetros:**
- `height` (integer): la altura del bloque

**Respuesta:**
```json
{
  "height": 7624910,
  "master_node": {
    "address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
    "name": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
    "is_active": true,
    "date_connected": "2026-10-24T19:49:15.367843Z",
    "city": "Helsinki",
    "country": "Finland",
    "latitude": 60.1719,
    "longitude": 24.9347,
    "block_count": 36163,
    "unique_name": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
    "connect_date": "2026-10-24T19:49:15.367843Z"
  },
  "hash": "14085c2b9d88a8fe0ca8c6d85223f0ace107dee72447d0c7e438e1f5052fb876",
  "previous_hash": "b1f92deb8dada255fa8cbdcc362174c153160a0508aceb10f813e98559419d43",
  "validator_address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
  "validator_signature": "MEUCIQDpLN0L3fmto6Z5...",
  "chain_ref_id": "m1_Gi9RNxviAq1TmvuPZsZBzdAa8AWVJtNa7cm1dFaT4dWDbdqSNSTh",
  "merkle_root": "de388c28ee953e5cc05b516c1738a2aec4f1e69c3d8865047234a9b45a9fa74a",
  "state_root": "0f75ae4b1a97f9c9e1beb2a2e53346ef463e7b0b71c77eba67d87c61640cc652",
  "total_reward": 0.0,
  "total_amount": 0.0,
  "total_validators": 161,
  "version": 4,
  "size": 1310,
  "craft_time": 13,
  "date_crafted": "2026-11-01T11:44:07Z",
  "transactions": [
    {
      "hash": "de388c28ee953e5cc05b516c1738a2aec4f1e69c3d8865047234a9b45a9fa74a",
      "height": 7624910,
      "type": 0,
      "type_label": "Tx",
      "to_address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
      "from_address": "Coinbase_BlkRwd",
      "total_amount": 0.0,
      "total_fee": 0.0,
      "data": null,
      "date_crafted": "2026-11-01T11:44:07Z",
      "signature": null,
      "nft": null,
      "unlock_time": null,
      "callback_details": null,
      "recovery_details": null
    }
  ]
}
```

**Códigos de estado:**
- `200 OK`: se encontró el bloque
- `404 Not Found`: `{"detail": "Not found."}`

### Obtener un bloque por hash
```http
GET /api/blocks/hash/{hash}/
```

Devuelve la información detallada de un bloque específico según su hash. La respuesta tiene la misma forma que en Obtener un bloque por altura.

**Parámetros:**
- `hash` (string): el hash del bloque

### Obtener bloques por dirección del validador
```http
GET /api/blocks/address/{address}/
```

Devuelve una lista paginada de los bloques validados por una dirección específica, los más recientes primero. Cada resultado tiene la misma forma que en Obtener un bloque por altura.

**Parámetros:**
- `address` (string): la dirección del validador

**Respuesta:**
```json
{
  "count": 36161,
  "page": 1,
  "num_pages": 1206,
  "results": [
    {
      "height": 7624910,
      "hash": "14085c2b9d88a8fe0ca8c6d85223f0ace107dee72447d0c7e438e1f5052fb876",
      "validator_address": "RAfscE8RAHBMXUa8aXU3MGLtX3oarm9AuP",
      "date_crafted": "2026-11-01T11:44:07Z",
      "transactions": [...]
    }
  ]
}
```

## Descripción de los campos

- `height`: el número secuencial del bloque
- `master_node`: el validador que produjo el bloque, en el formato que se describe en la página [Master Node](/es/build/web-api/master-node/)
- `hash`: identificador único del bloque (hash)
- `previous_hash`: hash del bloque anterior
- `validator_address`: dirección del validador que creó este bloque
- `validator_signature`: la firma del validador sobre el bloque
- `chain_ref_id`: identificador de referencia de la cadena que lleva el bloque
- `merkle_root`, `state_root`: raíz de Merkle de las transacciones del bloque y raíz de estado
- `total_reward`: recompensa de bloque pagada en este bloque (0 desde que las recompensas de bloque terminaron en la altura 3,074,181)
- `total_amount`: suma de los montos de las transacciones del bloque
- `total_validators`: número de validadores registrado en el bloque
- `version`: versión del bloque
- `size`: tamaño del bloque en bytes
- `craft_time`: tiempo que tardó el validador en crear el bloque, según lo informa el nodo
- `date_crafted`: cuándo se creó el bloque (formato ISO 8601)
- `transactions`: las transacciones del bloque, en el formato que se describe en la página [Transaction](/es/build/web-api/transaction/)

## Notas

- De forma predeterminada, los bloques se ordenan por altura en orden descendente (los más recientes primero)
- Todos los endpoints usan caché para mejorar el rendimiento
- Los bloques los producen los validadores; la API llama `master_node` al registro del validador por razones históricas
- Todos los endpoints de bloques incluyen la lista completa de transacciones del bloque
