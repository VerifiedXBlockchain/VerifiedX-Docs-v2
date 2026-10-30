---
sourceHash: a9a823995b9e
title: "Web API: Block"
description: Endpoints de la API del explorador para listar bloques y obtener un bloque por altura, por hash o por dirección del validador.
sidebar:
  label: "Block"
  order: 4
---

La API de Block ofrece endpoints para obtener información de los bloques de la blockchain, como los detalles de un bloque, los datos de validación y consultas por validador (validator).

## URL base
```
/api/block/
```

## Endpoints

### Listar bloques
```http
GET /api/block/
```

Devuelve una lista paginada de bloques, ordenada por altura (los más recientes primero).

**Parámetros de consulta:**
- `search`: busca por hash, altura, dirección del validador o nombre del nodo maestro
- `ordering`: ordena los resultados (p. ej., `-height`, `height`)
- `master_node`: filtra por ID del nodo maestro

**Respuesta:**
```json
{
  "count": 1000,
  "next": "http://localhost:8000/api/block/?page=2",
  "previous": null,
  "results": [
    {
      "height": 12345,
      "hash": "block_hash_123...",
      "validator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "timestamp": "2024-01-01T12:00:00Z",
      "transaction_count": 15,
      "master_node": {
        "id": 1,
        "name": "MasterNode1",
        "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR"
      }
    }
  ]
}
```

### Obtener un bloque por altura
```http
GET /api/block/{height}/
```

Devuelve la información detallada de un bloque específico según su altura.

**Parámetros:**
- `height` (integer): la altura del bloque

**Respuesta:**
```json
{
  "height": 12345,
  "hash": "block_hash_123...",
  "validator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "timestamp": "2024-01-01T12:00:00Z",
  "transaction_count": 15,
  "size": 1024,
  "master_node": {
    "id": 1,
    "name": "MasterNode1",
    "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR"
  },
  "transactions": [
    {
      "hash": "tx_hash_123...",
      "type": "TRANSFER",
      "amount": "100.0"
    }
  ]
}
```

### Obtener un bloque por hash
```http
GET /api/block/hash/{hash}/
```

Devuelve la información detallada de un bloque específico según su hash.

**Parámetros:**
- `hash` (string): el hash del bloque

**Respuesta:**
```json
{
  "height": 12345,
  "hash": "block_hash_123...",
  "validator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "timestamp": "2024-01-01T12:00:00Z",
  "transaction_count": 15,
  "master_node": {
    "id": 1,
    "name": "MasterNode1"
  }
}
```

### Obtener bloques por dirección del validador
```http
GET /api/block/address/{address}/
```

Devuelve una lista paginada de los bloques validados por una dirección específica.

**Parámetros:**
- `address` (string): la dirección del validador

**Respuesta:**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/block/address/R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR/?page=2",
  "previous": null,
  "results": [
    {
      "height": 12345,
      "hash": "block_hash_123...",
      "validator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "timestamp": "2024-01-01T12:00:00Z",
      "transaction_count": 15
    }
  ]
}
```

## Descripción de los campos

- `height`: el número secuencial del bloque
- `hash`: identificador único del bloque (hash)
- `validator_address`: dirección del validador que creó este bloque
- `timestamp`: cuándo se creó el bloque (formato ISO 8601)
- `transaction_count`: número de transacciones en el bloque
- `size`: tamaño del bloque en bytes
- `master_node`: información sobre el nodo maestro asociado

## Notas

- De forma predeterminada, los bloques se ordenan por altura en orden descendente (los más recientes primero)
- Todos los endpoints usan caché para mejorar el rendimiento
- La validación de bloques la realizan las direcciones de validador asociadas a los nodos maestros
- Según el endpoint, las respuestas de bloques pueden incluir los detalles de las transacciones
