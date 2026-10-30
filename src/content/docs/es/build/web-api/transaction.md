---
sourceHash: a24d896ab04d
title: "Web API: Transaction"
description: Endpoints de la API del explorador para detalles de transacciones y transacciones por dirección, por varias direcciones o por bloque, con los tipos de transacción.
sidebar:
  label: "Transaction"
  order: 17
---

La API de Transaction ofrece endpoints para obtener información de transacciones, incluidos los detalles de una transacción, consultas por dirección y listados de transacciones por bloque.

## URL base
```
/api/transaction/
```

## Endpoints

### Listar transacciones
```http
GET /api/transaction/
```

Devuelve una lista paginada de transacciones, ordenada de la más reciente a la más antigua.

**Parámetros de consulta:**
- `search`: busca por hash de la transacción o por direcciones
- `ordering`: ordena los resultados (p. ej., `-height`, `timestamp`)
- `type`: filtra por tipo de transacción
- `from_address`: filtra por dirección del remitente
- `to_address`: filtra por dirección del destinatario

**Respuesta:**
```json
{
  "count": 1250000,
  "next": "http://localhost:8000/api/transaction/?page=2",
  "previous": null,
  "results": [
    {
      "hash": "tx123456789abcdef...",
      "type": "TRANSFER",
      "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "to_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "total_amount": "100.0",
      "total_fee": "0.001",
      "timestamp": "2024-01-01T12:00:00Z",
      "height": 12345,
      "confirmations": 6,
      "status": "confirmed"
    }
  ]
}
```

### Obtener los detalles de una transacción
```http
GET /api/transaction/{hash}/
```

Devuelve la información detallada de una transacción específica.

**Parámetros:**
- `hash` (string): hash de la transacción

**Respuesta:**
```json
{
  "hash": "tx123456789abcdef...",
  "type": "TRANSFER",
  "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "to_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
  "total_amount": "100.0",
  "total_fee": "0.001",
  "timestamp": "2024-01-01T12:00:00Z",
  "height": 12345,
  "block_hash": "block123...",
  "confirmations": 6,
  "status": "confirmed",
  "size": 256,
  "nonce": 42,
  "data": null,
  "signature": "sig123...",
  "inputs": [
    {
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "amount": "100.001"
    }
  ],
  "outputs": [
    {
      "address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "amount": "100.0"
    },
    {
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "amount": "0.0",
      "type": "fee"
    }
  ],
  "smart_contract_data": null
}
```

### Obtener transacciones por dirección
```http
GET /api/transaction/address/{address}/
```

Devuelve las transacciones en las que participa una dirección específica (como remitente o destinatario).

**Parámetros:**
- `address` (string): dirección de VFX

**Parámetros de consulta:**
- `type`: filtra por tipo de transacción
- `direction`: filtra por dirección del flujo (`sent`, `received`, `all`) - predeterminado: `all`

**Respuesta:**
```json
{
  "count": 150,
  "results": [
    {
      "hash": "tx123456789abcdef...",
      "type": "TRANSFER",
      "direction": "sent",
      "counterparty_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "amount": "100.0",
      "fee": "0.001",
      "timestamp": "2024-01-01T12:00:00Z",
      "height": 12345,
      "status": "confirmed"
    }
  ]
}
```

### Obtener transacciones de varias direcciones
```http
GET /api/transaction/addresses/{addresses}/
```

Devuelve las transacciones en las que participa cualquiera de las direcciones indicadas.

**Parámetros:**
- `addresses` (string): lista de direcciones de VFX separadas por comas

### Obtener transacciones por bloque
```http
GET /api/transaction/block/{height}/
```

Devuelve todas las transacciones de un bloque específico.

**Parámetros:**
- `height` (integer): altura del bloque

**Respuesta:**
```json
{
  "block_height": 12345,
  "block_hash": "block123...",
  "timestamp": "2024-01-01T12:00:00Z",
  "transaction_count": 15,
  "transactions": [
    {
      "hash": "tx123456789abcdef...",
      "type": "TRANSFER",
      "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "to_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "total_amount": "100.0",
      "total_fee": "0.001",
      "position_in_block": 1
    }
  ]
}
```

## Tipos de transacción

### Tipos básicos
- **TRANSFER**: transferencia básica del token VFX
- **SMART_CONTRACT**: despliegue o ejecución de un contrato inteligente
- **NFT**: operaciones de emisión, transferencia o quema de NFTs
- **RESERVE**: operaciones de cuentas de reserva (Reserve Account)
- **STAKING**: operaciones de stake de validadores (validators)
- **VOTE**: transacciones de votación de gobernanza

### Subtipos de NFT
- **NFT_MINT**: creación de un nuevo NFT
- **NFT_TRANSFER**: transferencia de la propiedad de un NFT
- **NFT_BURN**: destrucción de un NFT
- **NFT_EVOLVE**: mejora o evolución de un NFT

### Subtipos de contrato inteligente
- **CONTRACT_DEPLOY**: despliegue de un nuevo contrato inteligente
- **CONTRACT_CALL**: llamada a una función de un contrato inteligente
- **TOKEN_CREATE**: creación de un token fungible

## Descripción de los campos

### Datos básicos de la transacción
- `hash`: identificador único de la transacción
- `type`: categoría de la transacción
- `from_address`: dirección de VFX del remitente
- `to_address`: dirección de VFX del destinatario  
- `total_amount`: monto transferido (sin comisiones)
- `total_fee`: comisión de procesamiento de la transacción
- `timestamp`: cuándo se creó la transacción
- `height`: altura del bloque que contiene esta transacción
- `confirmations`: número de bloques que confirman esta transacción
- `status`: estado actual de la transacción

### Detalles técnicos
- `size`: tamaño de la transacción en bytes
- `nonce`: número de secuencia de las transacciones del remitente
- `data`: datos adicionales de la transacción (para contratos inteligentes)
- `signature`: firma criptográfica que prueba la autenticidad
- `inputs`: entradas de la transacción con sus montos
- `outputs`: salidas de la transacción y sus destinos

### Campos de las consultas por dirección
- `direction`: si la dirección fue remitente o destinataria
- `counterparty_address`: la otra parte de la transacción
- `amount`: monto correspondiente a la dirección consultada
- `fee`: comisión pagada (solo en transacciones enviadas)

## Estado de la transacción

- `pending`: transacción enviada pero aún no confirmada
- `confirmed`: transacción incluida en un bloque
- `failed`: la transacción no se ejecutó correctamente
- `rejected`: transacción rechazada por la red

## Notas

- Todos los montos monetarios se devuelven como strings para conservar la precisión
- Las confirmaciones aumentan a medida que se agregan nuevos bloques después de la transacción
- Las transacciones de contratos inteligentes pueden incluir campos de datos adicionales
- Las transacciones de NFT hacen referencia a identificadores de token específicos
- El cálculo de las comisiones depende de la complejidad de la transacción y de la congestión de la red
- Los conjuntos de resultados grandes se paginan para mejorar el rendimiento
