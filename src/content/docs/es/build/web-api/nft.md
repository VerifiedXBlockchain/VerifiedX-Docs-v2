---
sourceHash: 4ba1a13ffa52
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

Devuelve una lista paginada de NFTs con opciones de filtrado y búsqueda.

**Parámetros de consulta:**
- `search`: busca por nombre o identificador del NFT
- `ordering`: ordena los resultados (p. ej., `-created_at`, `name`)
- `owner`: filtra por dirección del propietario
- `collection`: filtra por contrato inteligente de la colección

**Respuesta:**
```json
{
  "count": 75000,
  "next": "http://localhost:8000/api/nft/?page=2",
  "previous": null,
  "results": [
    {
      "identifier": "NFT123...",
      "name": "Digital Artwork #1",
      "description": "A beautiful piece of digital art",
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "creator_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "collection": "Cool Art Collection",
      "image_url": "https://media.vfx.io/nft/image123.png",
      "thumbnail_url": "https://media.vfx.io/nft/thumb123.png",
      "mint_date": "2024-01-01T12:00:00Z",
      "last_sale_price": "150.0",
      "attributes": [
        {
          "trait_type": "Background",
          "value": "Blue"
        }
      ]
    }
  ]
}
```

### Obtener NFTs de varias direcciones
```http
GET /api/nft/addresses/{addresses}/
```

Devuelve los NFTs que poseen varias direcciones (separadas por comas).

**Parámetros:**
- `addresses` (string): lista de direcciones de VFX separadas por comas

### Obtener los identificadores de NFTs publicados
```http
GET /api/nft/listed/{owner_address}/
```

Devuelve los identificadores de los NFTs que un propietario tiene publicados a la venta actualmente.

**Parámetros:**
- `owner_address` (string): la dirección de VFX del propietario

**Respuesta:**
```json
{
  "results": [
    "NFT123...",
    "NFT456...",
    "NFT789..."
  ]
}
```

### Obtener los detalles de un NFT
```http
GET /api/nft/{identifier}/
```

Devuelve la información detallada de un NFT específico.

**Parámetros:**
- `identifier` (string): el identificador del NFT

**Respuesta:**
```json
{
  "identifier": "NFT123...",
  "name": "Digital Artwork #1",
  "description": "A beautiful piece of digital art",
  "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "creator_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
  "collection": {
    "name": "Cool Art Collection",
    "smart_contract_uid": "SC456..."
  },
  "metadata": {
    "image": "https://media.vfx.io/nft/image123.png",
    "animation_url": "https://media.vfx.io/nft/animation123.mp4",
    "external_url": "https://example.com/nft123"
  },
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue",
      "rarity": "15%"
    },
    {
      "trait_type": "Style",
      "value": "Abstract",
      "rarity": "8%"
    }
  ],
  "mint_transaction": {
    "hash": "tx123...",
    "block_height": 12345,
    "timestamp": "2024-01-01T12:00:00Z"
  },
  "royalty_info": {
    "percentage": 5.0,
    "recipient": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P"
  },
  "listing": {
    "price": "200.0",
    "currency": "VFX",
    "marketplace": "VFX Marketplace",
    "expires_at": "2024-02-01T12:00:00Z"
  }
}
```

### Obtener el historial de un NFT
```http
GET /api/nft/{identifier}/history/
```

Devuelve el historial completo de transacciones de un NFT.

**Parámetros:**
- `identifier` (string): el identificador del NFT

**Respuesta:**
```json
{
  "num_pages": 1,
  "page": 1,
  "count": 5,
  "results": [
    {
      "type": "mint",
      "hash": "tx123...",
      "from_address": null,
      "to_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "amount": null,
      "timestamp": "2024-01-01T12:00:00Z",
      "block_height": 12345
    },
    {
      "type": "transfer",
      "hash": "tx456...",
      "from_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "to_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "amount": "150.0",
      "timestamp": "2024-01-15T14:30:00Z",
      "block_height": 12678
    },
    {
      "type": "sale",
      "hash": "tx789...",
      "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "to_address": "RQKDU4UUCwbKXoydjknnH1y7Y3QYYHkvUz",
      "amount": "200.0",
      "timestamp": "2024-01-20T16:45:00Z",
      "block_height": 12890
    }
  ]
}
```

### Verificar la propiedad de un NFT
```http
POST /api/nft/verify-ownership/
```

Verifica la propiedad de un NFT mediante una firma criptográfica.

**Solicitud:**
```json
{
  "signature": "signature_data_here...",
  "message": "I own this NFT",
  "nft_identifier": "NFT123...",
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR"
}
```

**Respuesta:**
```json
{
  "verified": true,
  "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "nft_identifier": "NFT123...",
  "verification_timestamp": "2024-01-01T12:00:00Z"
}
```

## Descripción de los campos

### Datos del NFT
- `identifier`: identificador único del NFT / ID del token
- `name`: nombre legible del NFT
- `description`: descripción detallada del NFT
- `owner_address`: dirección de VFX del propietario actual
- `creator_address`: dirección de VFX del creador original
- `collection`: información o nombre de la colección
- `image_url`: URL de la imagen principal del NFT
- `thumbnail_url`: URL de una imagen de vista previa más pequeña

### Metadatos
- `image`: URL de la imagen principal
- `animation_url`: URL del contenido animado o de video
- `external_url`: enlace a un sitio web o marketplace externo

### Atributos
- `trait_type`: categoría o tipo del atributo
- `value`: el valor del atributo
- `rarity`: qué tan raro es este atributo dentro de la colección

### Historial de transacciones
- `type`: tipo de transacción (mint, transfer, sale, burn)
- `hash`: hash de la transacción
- `from_address/to_address`: direcciones del remitente y del destinatario
- `amount`: precio de venta (si corresponde)
- `timestamp`: cuándo ocurrió la transacción

## Tipos de transacción

- `mint`: el NFT se creó o se emitió
- `transfer`: el NFT se transfirió entre direcciones
- `sale`: el NFT se vendió (transferencia con pago)
- `burn`: el NFT se destruyó o se quemó
- `misc`: otras interacciones con contratos inteligentes

## Notas

- Los identificadores de NFT son únicos dentro del ecosistema de VFX
- Las imágenes y los metadatos pueden almacenarse en IPFS para descentralizarlos
- Los porcentajes de rareza se calculan dentro de cada colección
- La información de regalías define las ganancias del creador en las ventas secundarias
- La información de publicación muestra la disponibilidad actual en el marketplace
- La verificación de propiedad usa el sistema de firmas criptográficas de VFX
