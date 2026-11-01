---
sourceHash: "50028ca0e2ae"
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

Todos los endpoints devuelven las transacciones en el formato que se muestra en Obtener los detalles de una transacción. Los endpoints de listas se paginan con `count`, `page`, `num_pages` y `results`, de la más reciente a la más antigua.

**Parámetros de consulta (todos los endpoints de listas):**
- `search`: busca por hash de la transacción o por dirección del remitente o del destinatario
- `ordering`: `date_crafted` o `-date_crafted` (predeterminado)
- `reverse`: `true` invierte el orden
- `page` (integer): número de página
- `limit` (integer): resultados por página (predeterminado 30, máximo 500)

### Listar transacciones
```http
GET /api/transaction/
```

Devuelve una lista paginada de todas las transacciones.

**Respuesta:**
```json
{
  "count": 67095,
  "page": 1,
  "num_pages": 2237,
  "results": [
    {
      "hash": "a66687be178fa4fe670738fdcaf3a1ffef066b3926ee2824eefe3268a94d4dd1",
      "height": 65095,
      "type": 0,
      "type_label": "Tx",
      "to_address": "x8NemQSjMUKXaLqbpVU6YNq4P2d6Jbcrra",
      "from_address": "xSSy9Zh3ojDFoGuo2VNFxffMCYPM94xv2V",
      "total_amount": 0.1,
      "total_fee": 0.00000604,
      "data": "null",
      "date_crafted": "2026-11-01T12:05:25Z",
      "signature": "MEQCID2AN8Z4foT2Lu1LR9MM7dMitfavinZAfDhanC2lej77AiA8AYePQ0Fs83NOs8xobAcPRyuV8k5j6EECUQ3kRNoXmw==.3qHA89AEGdWsnEVdmqykUg3rr2yuRipvBXD4za193M9hiCEhPYDSkY86xc1NBrC6DU181NSddJx3xyo2rQR7MyYw",
      "nft": null,
      "unlock_time": null,
      "callback_details": null,
      "recovery_details": null
    }
  ]
}
```

### Obtener los detalles de una transacción
```http
GET /api/transaction/{hash}/
```

Devuelve una transacción. Un hash desconocido responde `404` con `{"detail": "Not found."}`.

**Parámetros:**
- `hash` (string): hash de la transacción

**Respuesta:**
```json
{
  "hash": "a66687be178fa4fe670738fdcaf3a1ffef066b3926ee2824eefe3268a94d4dd1",
  "height": 65095,
  "type": 0,
  "type_label": "Tx",
  "to_address": "x8NemQSjMUKXaLqbpVU6YNq4P2d6Jbcrra",
  "from_address": "xSSy9Zh3ojDFoGuo2VNFxffMCYPM94xv2V",
  "total_amount": 0.1,
  "total_fee": 0.00000604,
  "data": "null",
  "date_crafted": "2026-11-01T12:05:25Z",
  "signature": "MEQCID2AN8Z4foT2Lu1LR9MM7dMitfavinZAfDhanC2lej77AiA8AYePQ0Fs83NOs8xobAcPRyuV8k5j6EECUQ3kRNoXmw==.3qHA89AEGdWsnEVdmqykUg3rr2yuRipvBXD4za193M9hiCEhPYDSkY86xc1NBrC6DU181NSddJx3xyo2rQR7MyYw",
  "nft": null,
  "unlock_time": null,
  "callback_details": null,
  "recovery_details": null
}
```

### Obtener transacciones por dirección
```http
GET /api/transaction/address/{address}/
```

Devuelve una lista paginada de las transacciones que una dirección envió o recibió.

**Parámetros:**
- `address` (string): dirección de VFX

### Obtener transacciones de varias direcciones
```http
GET /api/transaction/addresses/{addresses}/
```

Devuelve una lista paginada de las transacciones que cualquiera de las direcciones envió o recibió.

**Parámetros:**
- `addresses` (string): lista de direcciones de VFX separadas por comas

### Obtener transacciones por bloque
```http
GET /api/transaction/block/{height}/
```

Devuelve una lista paginada de las transacciones de un bloque.

**Parámetros:**
- `height` (integer): altura del bloque

## Tipos de transacción

| `type` | `type_label` | Significado |
|---|---|---|
| 0 | Tx | Transferencia de VFX |
| 1 | Node | Registro de nodo |
| 2 | Nft Mint | Emisión de NFT |
| 3 | NFT Tx | Transferencia de NFT |
| 4 | NFT Burn | Quema de NFT |
| 5 | NFT Sale | Venta de NFT |
| 6 | Address | Creación, transferencia o eliminación de un dominio ADNR |
| 7 | DST Registration | Registro de una tienda descentralizada |
| 8 | Vote Topic | Tema de gobernanza |
| 9 | Vote | Voto de gobernanza |
| 10 | Reserve | Registro, devolución o recuperación de una cuenta de reserva (de bóveda) |
| 11 | Smart Contract Mint | Emisión de un contrato inteligente |
| 12 | Smart Contract Tx | Transacción de un contrato inteligente |
| 13 | Smart Contract Burn | Quema de un contrato inteligente |
| 14 | Fungible Token Mint | Emisión del contrato de un token fungible |
| 15 | Fungible Token Tx | Operaciones de un token fungible: transferencia, emisión, quema, pausa, bloqueo, cambio de propietario, tema de votación y voto (la `Function` en `data` la identifica) |
| 16 | Fungible Token Burn | Quema de un token fungible |
| 17 | Tokenization Mint | Despliegue de un token fungible (`TokenDeploy()` en `data`) |
| 22 | Validator Registration | Registro de un validador de vBTC |
| 23 | Validator Heartbeat | Latido (heartbeat) de un validador de vBTC |
| 24 | Validator Exit | Salida de un validador de vBTC |
| 25 | vBTC V2 Mint | Creación de un contrato de bóveda de vBTC V2 |
| 26 | vBTC V2 Transfer | Transferencia de vBTC V2 |
| 27 | vBTC V2 Withdrawal Request | Solicitud de retiro de vBTC V2 |
| 28 | vBTC V2 Withdrawal Complete | Retiro de vBTC V2 completado |
| 29 | vBTC Withdrawal Cancel | Cancelación de un retiro de vBTC V2 |
| 30 | vBTC Withdrawal Vote | Voto de cancelación de vBTC V2 |
| 31 | VFX Shield | Blindaje de VFX (Prism) |
| 32 | VFX Unshield | Desblindaje de VFX (Prism) |
| 33 | VFX Private Transfer | Transferencia privada de VFX (Prism) |
| 34 | vBTC Shield | Blindaje de vBTC (Prism) |
| 35 | vBTC Unshield | Desblindaje de vBTC (Prism) |
| 36 | vBTC Private Transfer | Transferencia privada de vBTC (Prism) |
| 37 | vBTC Bridge Lock | Bloqueo en el puente de vBTC.b |
| 38 | vBTC Bridge Unlock | Desbloqueo en el puente de vBTC.b |
| 39 | vBTC Bridge Pool Unlock | Desbloqueo del pool del puente de vBTC.b |
| 40 | vBTC Bridge Exit to BTC | Salida de vBTC.b a Bitcoin |
| 41 | vBTC Bridge Exit to BTC Complete | Salida de vBTC.b a Bitcoin completada |
| 42 | vBTC Bridge Exit to BTC Failed | Salida de vBTC.b a Bitcoin fallida |
| 43 | vBTC Bitcoin Report | Informe de Bitcoin que entra al consenso (sin remitente) |
| 44 | vBTC Withdrawal Fee Bump | Fijación de la moneda de un retiro (subida de comisión) |
| 45 | vBTC Bitcoin Rewind | Informe de una reorganización de Bitcoin (sin remitente) |
| 46 | vBTC Vault Rekey | Renovación de la clave de una bóveda |

Los números del 18 al 21 pertenecen a tipos de transacción retirados y no se incluyen.

## Descripción de los campos

- `hash`: identificador único de la transacción
- `height`: altura del bloque que contiene esta transacción
- `type`, `type_label`: número del tipo de transacción y su etiqueta (consulta la tabla de arriba)
- `from_address`: dirección del remitente, o un nombre del sistema como `Coinbase_BlkRwd` en los registros de recompensas de bloque
- `to_address`: dirección del destinatario, o una dirección base como `Adnr_Base`, `Reserve_Base` o `Token_Base`
- `total_amount`: monto transferido en VFX (sin comisiones)
- `total_fee`: comisión de la red en VFX, que se quema
- `data`: el campo de datos de la transacción como string JSON (llamadas a contratos inteligentes, ADNR, operaciones de vBTC)
- `date_crafted`: cuándo se creó la transacción (ISO 8601, UTC)
- `signature`: la firma del remitente
- `nft`: el NFT al que se refiere la transacción, en el formato descrito en la página [NFT](/es/build/web-api/nft/), o `null`
- `unlock_time`: en un envío desde una cuenta de reserva, cuándo se desbloquea; en otro caso, `null`
- `callback_details`: en una devolución (call back) de una cuenta de reserva, la transacción que devolvió (con los mismos campos que esta, sin `callback_details` ni `recovery_details`), o `null`
- `recovery_details`: en una recuperación de una cuenta de reserva, `original_address`, `new_address`, `amount` y `outstanding_transactions`, o `null`

## Notas

- Solo se indexan las transacciones incluidas en bloques; no hay campos de pendientes, confirmaciones ni estado
- Todos los montos monetarios son números JSON
- Los conjuntos de resultados grandes se paginan para mejorar el rendimiento
