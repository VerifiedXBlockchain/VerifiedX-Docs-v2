---
sourceHash: "64d50a9346d4"
title: "Web API: NFT"
description: Endpoints de la API del explorador para detalles de NFTs, propiedad, historial de transferencias y publicaciones en el marketplace.
sidebar:
  label: "NFT"
  order: 13
---

La API de NFT ofrece endpoints para obtener información sobre tokens no fungibles, incluidos los detalles del NFT, la propiedad, el historial de transferencias y las publicaciones en el marketplace.

## URL base
```
/api/nft/
```

## Endpoints

### Listar NFTs
```http
GET /api/nft/
```

Devuelve una lista paginada de NFTs on-chain. Se excluyen los NFTs quemados, los contratos de tokens fungibles y las bóvedas de vBTC.

**Parámetros de consulta:**
- `search`: busca por nombre o identificador del NFT
- `ordering`: ordena por un campo de la respuesta, por ejemplo `-minted_at` o `name`
- `owner_address`: filtra por dirección del propietario
- `minter_address`: filtra por dirección de quien lo emitió
- `page` (integer): número de página
- `limit` (integer): resultados por página (predeterminado 30, máximo 500)

**Respuesta:**
```json
{
  "count": 2542,
  "page": 1,
  "num_pages": 85,
  "results": [
    {
      "identifier": "e70f10e2f68f4905ae310a2111abb6f5:1793057907",
      "name": "Bridge 2026 Receipt 2 of 3",
      "description": "A receipt token from The Bridge 2026, New York.",
      "minter_address": "RQBfMgJyMARNv3qXv75Kh9tf4rwdBahdvJ",
      "owner_address": "RQBfMgJyMARNv3qXv75Kh9tf4rwdBahdvJ",
      "minter_name": "RQBfMgJyMARNv3qXv75Kh9tf4rwdBahdvJ",
      "smart_contract_data": "{\"SmartContractMain\": {...}}",
      "primary_asset_name": "receipt-2.png",
      "primary_asset_size": 515234,
      "minted_at": "2026-10-26T23:38:35Z",
      "mint_transaction": "b39767ff71137a8a78bbc85cb25e5079dbe7c19f361433c014a64dde34672fa8",
      "burn_transaction": null,
      "is_burned": false,
      "data": "[{\"Function\":\"Mint()\",\"ContractUID\":\"e70f10e2f68f4905ae310a2111abb6f5:1793057907\",\"Data\":\"H4sI...\"}]",
      "asset_urls": {
        "receipt-2.png": "https://rbx-nft-web-assets.s3.amazonaws.com/jFhps372uEHEFHHSuYhWCI4c5LNUSxmf/receipt-2.png"
      },
      "is_listed": false
    }
  ]
}
```

### Obtener NFTs de varias direcciones
```http
GET /api/nft/addresses/{addresses}/
```

Devuelve una lista paginada de los NFTs que posee cualquiera de las direcciones indicadas, en el formato de Listar NFTs.

**Parámetros:**
- `addresses` (string): lista de direcciones de VFX separadas por comas

### Obtener los identificadores de NFTs publicados
```http
GET /api/nft/listed/{owner_address}/
```

Devuelve los identificadores de los NFTs que un propietario tiene publicados actualmente en una tienda.

**Parámetros:**
- `owner_address` (string): la dirección de VFX del propietario

**Respuesta:**
```json
{
  "results": [
    "e70f10e2f68f4905ae310a2111abb6f5:1793057907",
    "18c187fbe7fd46b9aed368cd3e1ac938:1792838812"
  ]
}
```

### Obtener los detalles de un NFT
```http
GET /api/nft/{identifier}/
```

Devuelve un NFT, en el mismo formato que un resultado de Listar NFTs.

**Parámetros:**
- `identifier` (string): el identificador del contrato inteligente del NFT

### Obtener el historial de un NFT
```http
GET /api/nft/{identifier}/history/
```

Devuelve las transacciones del NFT (emisión, transferencias, ventas, otras llamadas al contrato inteligente, quema) en orden de bloque.

**Parámetros:**
- `identifier` (string): el identificador del NFT

**Respuesta:**
```json
{
  "num_pages": 1,
  "page": 1,
  "count": 1,
  "results": [
    {
      "hash": "b39767ff71137a8a78bbc85cb25e5079dbe7c19f361433c014a64dde34672fa8",
      "height": 7587361,
      "type": 2,
      "type_label": "Nft Mint",
      "to_address": "RQBfMgJyMARNv3qXv75Kh9tf4rwdBahdvJ",
      "from_address": "RQBfMgJyMARNv3qXv75Kh9tf4rwdBahdvJ",
      "total_amount": 0.0,
      "total_fee": 0.00002708,
      "data": "[{\"Function\":\"Mint()\", ...}]",
      "date_crafted": "2026-10-26T23:38:35Z",
      "signature": "MEUCIQ..."
    }
  ]
}
```

Todas las transacciones se devuelven en una sola página. Un identificador desconocido responde `404`.

### Verificar la propiedad de un NFT
```http
POST /api/nft/verify-ownership/
```

Verifica una prueba de propiedad con un nodo. La prueba es la cadena de firma que produce la ruta de contrato inteligente `ProveOwnership` de un nodo (consulta la [API del nodo](/es/build/node-api/overview/)).

**Solicitud:**
```json
{
  "signature": "<ownership proof>"
}
```

**Respuesta:**
```json
{
  "verified": true
}
```

Si falta `signature`, responde `400` con `{"signature": ["This field is required."]}`.

## Descripción de los campos

### Datos del NFT
- `identifier`: el identificador del contrato inteligente del NFT
- `name`, `description`: nombre y descripción del contrato inteligente
- `minter_address`, `minter_name`: dirección y nombre de quien lo emitió
- `owner_address`: dirección de VFX del propietario actual
- `smart_contract_data`: el contrato inteligente como string JSON
- `primary_asset_name`, `primary_asset_size`: nombre de archivo y tamaño en bytes del activo principal
- `minted_at`: cuándo se emitió el NFT
- `mint_transaction`, `burn_transaction`: hashes de las transacciones de emisión y de quema (`burn_transaction` es `null` salvo que se haya quemado)
- `is_burned`: si el NFT se quemó
- `data`: el campo de datos de la transacción de emisión
- `asset_urls`: mapa del nombre de archivo de cada activo a una URL donde el explorador lo sirve
- `is_listed`: si el NFT está publicado en una tienda

### Historial de transacciones
- `type`, `type_label`: número y etiqueta del tipo de transacción, como en la página [Transaction](/es/build/web-api/transaction/)
- `hash`, `height`, `date_crafted`: hash, altura de bloque y hora de la transacción
- `from_address`, `to_address`: direcciones del remitente y del destinatario
- `total_amount`, `total_fee`: monto y comisión en VFX
- `data`, `signature`: los datos y la firma de la transacción

## Notas

- Los identificadores de NFT son únicos dentro del ecosistema de VFX
- `asset_urls` es la copia alojada en el explorador de los activos del NFT, para mostrarlos; se establece a través de la API de [Media](/es/build/web-api/media/)
- La verificación de propiedad usa el sistema de firmas criptográficas de VFX
