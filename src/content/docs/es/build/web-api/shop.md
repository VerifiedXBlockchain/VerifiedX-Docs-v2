---
sourceHash: 5a6a3226c5b8
title: "Web API: Shop"
description: Endpoints de la API del explorador para tiendas, colecciones, publicaciones y ofertas del marketplace de NFTs.
sidebar:
  label: "Shop"
  order: 16
---

La API de Shop ofrece endpoints para gestionar las funciones del marketplace de NFTs, incluidas las tiendas, colecciones, publicaciones y operaciones de ofertas dentro del ecosistema de VFX.

## URL base
```
/api/shop/
```

## Autenticación

Las lecturas y las creaciones son abiertas. `PATCH` y `DELETE` sobre una tienda, colección o publicación requieren el token del propietario de la tienda en el encabezado `Authorization`. Obtén un token, válido durante una hora, firmando un mensaje con la clave del propietario:

```http
POST /api/auth/sign-token/
```

```json
{
  "message": "any message",
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "signature": "<signature of message by address>"
}
```

La respuesta trae `token` y `expires_at`. Envíalo como `Authorization: <token>`.

## Endpoints

### Listar o crear tiendas
```http
GET /api/shop/
POST /api/shop/
```

**GET** - Devuelve una lista paginada de las tiendas que no están eliminadas.

**Parámetros de consulta:**
- `search`: busca por URL de la tienda, nombre o dirección del propietario
- `owner_address`: filtra por dirección del propietario
- `is_published`: `true` o `false`
- `is_third_party`: `true` o `false`
- `page` (integer): número de página
- `limit` (integer): resultados por página (30 de forma predeterminada, 500 como máximo)

**Respuesta:**
```json
{
  "count": 875,
  "page": 1,
  "num_pages": 30,
  "results": [
    {
      "id": 20,
      "unique_id": "rRjDVmfLCS1683686043",
      "name": "Digital Art Gallery",
      "description": "Premium digital artwork collection",
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "is_third_party": true,
      "url": "rbx://digital-art-gallery",
      "is_published": true,
      "is_online": false
    }
  ]
}
```

**POST** - Crea una tienda de terceros. Se agrega `rbx://` a `url` cuando falta.

**Solicitud:**
```json
{
  "name": "My NFT Shop",
  "url": "rbx://my-nft-shop",
  "description": "A collection of unique digital assets",
  "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR"
}
```

### Obtener, actualizar o eliminar una tienda
```http
GET /api/shop/{id}/
PATCH /api/shop/{id}/
DELETE /api/shop/{id}/
```

**Parámetros:**
- `id` (integer): ID de la tienda

`PATCH` acepta `name`, `description` e `is_published`. `DELETE` marca la tienda como eliminada. Ambos necesitan el token del propietario.

### Buscar una tienda por URL
```http
GET /api/shop/url/?url=rbx://shop-name
```

Devuelve la tienda con esa URL. Una URL ausente o desconocida responde `400`.

**Parámetros de consulta:**
- `url` (string): URL de la tienda (con o sin el prefijo `rbx://`)

### Comprobar la disponibilidad de la URL de una tienda
```http
GET /api/shop/url/available/?url=rbx://shop-name
```

Comprueba si una URL de tienda está disponible para registrarla.

**Respuesta:**
```json
{
  "available": true
}
```

### Resincronizar una tienda
```http
GET /api/shop/resync/?url=rbx://shop-name&delay=35
```

Programa una nueva importación de una tienda alojada en un nodo después de `delay` segundos (35 de forma predeterminada). Una tienda de terceros responde `400`.

**Respuesta:**
```json
{
  "success": true
}
```

### Colecciones

#### Listar o crear colecciones
```http
GET /api/shop/{shop_id}/collection/
POST /api/shop/{shop_id}/collection/
```

**Respuesta de GET:**
```json
{
  "count": 1,
  "page": 1,
  "num_pages": 1,
  "results": [
    {
      "id": 11,
      "shop": {
        "id": 20,
        "unique_id": "rRjDVmfLCS1683686043",
        "name": "Digital Art Gallery",
        "description": "Premium digital artwork collection",
        "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
        "is_third_party": true,
        "url": "rbx://digital-art-gallery",
        "is_published": true,
        "is_online": false
      },
      "name": "Pixel Art Collection",
      "is_live": true,
      "description": "8-bit style digital art"
    }
  ]
}
```

**POST** recibe `name` y `description`.

#### Obtener, actualizar o eliminar una colección
```http
GET /api/shop/{shop_id}/collection/{id}/
PATCH /api/shop/{shop_id}/collection/{id}/
DELETE /api/shop/{shop_id}/collection/{id}/
```

`PATCH` acepta `name`, `description` e `is_live`; tanto él como `DELETE` necesitan el token del propietario.

### Publicaciones

#### Listar o crear publicaciones
```http
GET /api/shop/{shop_id}/collection/{collection_id}/listing/
POST /api/shop/{shop_id}/collection/{collection_id}/listing/
```

**GET** devuelve las publicaciones abiertas de la colección (no eliminadas y con la venta sin completar).

**Respuesta de GET:**
```json
{
  "count": 1,
  "page": 1,
  "num_pages": 1,
  "results": [
    {
      "id": 244,
      "listing_id": 1,
      "collection": { "id": 11, "shop": { "...": "..." }, "name": "Pixel Art Collection", "is_live": true, "description": "..." },
      "smart_contract_uid": "f1e9cd967899476292cb503ed39b1d2c:1739326665",
      "nft": { "identifier": "f1e9cd967899476292cb503ed39b1d2c:1739326665", "...": "..." },
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "buy_now_price": null,
      "floor_price": 3000.0,
      "reserve_price": 3000.0,
      "start_date": "2025-02-11T21:46:36.959000Z",
      "end_date": "2025-02-18T21:46:36.959000Z",
      "has_started": true,
      "has_ended": true,
      "is_visible_before_start_date": true,
      "is_visible_after_end_date": true,
      "final_price": null,
      "is_sale_complete": false,
      "is_sale_pending": false,
      "winning_address": null,
      "thumbnails": ["https://rbx-nft-web-assets.s3.amazonaws.com/BHf55hcvm0hXLQJqDMGzDOOsROyj1dib/IMG_2502.jpeg"],
      "thumbnail_previews": null,
      "purchase_key": "...",
      "auction": {
        "id": 204,
        "current_bid_price": 3000.0,
        "increment_amount": 75.0,
        "is_reserve_met": true,
        "is_auction_over": false,
        "current_winning_address": "RBgMw2d1pe3DPaf387Y8zpXqRPE8ZZ1bUv"
      },
      "bids": []
    }
  ]
}
```

**POST** - Crea una publicación. El propietario se toma del NFT.

**Solicitud:**
```json
{
  "collection": 11,
  "smart_contract_uid": "f1e9cd967899476292cb503ed39b1d2c:1739326665",
  "buy_now_price": 150.0,
  "floor_price": 100.0,
  "reserve_price": 120.0,
  "start_date": "2026-11-01T12:00:00Z",
  "end_date": "2026-11-08T12:00:00Z",
  "thumbnails": []
}
```

#### Obtener, actualizar o eliminar una publicación
```http
GET /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
PATCH /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
DELETE /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
```

`PATCH` acepta `buy_now_price`, `floor_price`, `reserve_price`, `start_date` y `end_date`; tanto él como `DELETE` necesitan el token del propietario.

### Ofertas

#### Crear una oferta
```http
POST /api/shop/bid/
```

Hace una oferta o una compra inmediata en una publicación.

**Solicitud:**
```json
{
  "listing": 244,
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "amount": 3100.0,
  "signature": "bid_signature_here...",
  "is_buy_now": false,
  "from_third_party": true,
  "pre_signed_sale_complete_tx": null
}
```

`listing`, `address` y `amount` son obligatorios. Una oferta debe superar el precio mínimo, o la oferta aceptada más alta, por el `increment_amount` de la subasta. El `amount` de una compra inmediata debe coincidir con `buy_now_price`.

**Respuesta** (`201`):
```json
{
  "success": true,
  "message": "Bid Placed"
}
```

Una oferta rechazada responde `200` solo con un `message`, por ejemplo `"Listing not found."`, `"Not enough balance to process this transaction"` o `"The amount is less than the floor price."`.

#### Obtener los detalles de una oferta
```http
GET /api/shop/bid/{id}/
```

Devuelve una oferta:

```json
{
  "id": 1,
  "bid_id": "6f1c2d3e-4b5a-4c7d-8e9f-0a1b2c3d4e5f",
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "signature": "...",
  "amount": 3100.0,
  "send_time": 1793534700,
  "is_buy_now": false,
  "is_processed": false,
  "purchase_key": "...",
  "status": 0,
  "send_receive": 0
}
```

`status` es `0` aceptada, `1` rechazada, `2` enviada o `3` recibida; `send_receive` es `0` envío o `1` recibida.

#### Enviar una oferta aceptada
```http
POST /api/shop/bid/submit/
```

Registra una oferta que un nodo ya aceptó (para la integración con nodos). Recibe `bid_id`, `amount`, `address`, `listing`, `signature` y, de forma opcional, `is_buy_now`. Un `bid_id` ya registrado responde `200`; uno nuevo, `201`.

## Descripción de los campos

### Tienda
- `id`, `unique_id`: ID en el explorador e identificador único de la tienda
- `name`, `description`: nombre visible y descripción
- `url`: URL única de la tienda (formato `rbx://`)
- `owner_address`: dirección de VFX del propietario de la tienda
- `is_third_party`: si la tienda se creó con esta API en lugar de estar alojada en un nodo
- `is_published`: si la tienda está publicada
- `is_online`: si el nodo de la tienda está en línea

### Colección
- `shop`: la tienda a la que pertenece
- `name`, `description`: nombre y descripción de la colección
- `is_live`: si la colección está activa

### Publicación
- `smart_contract_uid`, `nft`: el identificador del NFT publicado y su registro de NFT
- `buy_now_price`: precio de compra fijo (`null` cuando la compra inmediata está desactivada)
- `floor_price`, `reserve_price`: precio inicial y precio de reserva de la subasta (`null` cuando no hay subasta)
- `start_date`, `end_date`, `has_started`, `has_ended`: el periodo de la publicación
- `final_price`, `winning_address`, `is_sale_complete`, `is_sale_pending`: resultado de la venta
- `thumbnails`, `thumbnail_previews`: URL de las imágenes que se muestran
- `auction`: oferta actual, incremento, estado del precio de reserva y dirección que va ganando, o `null`
- `bids`: ofertas registradas en la publicación

### Oferta
- `listing`: ID de la publicación sobre la que se ofrece
- `amount`: monto de la oferta en VFX
- `signature`: firma para verificar la oferta
- `is_buy_now`: si se trata de una compra de **Comprar ahora** (Buy Now)
- `from_third_party`: si la oferta llega por esta API; las demás ofertas solo se comprueban y responden "Bid Accepted"

## Tipos de publicación

- **Solo subasta**: `floor_price` definido, `buy_now_price` null
- **Solo Comprar ahora**: `buy_now_price` definido, `floor_price` null
- **Subasta + Comprar ahora**: ambos definidos

## Notas

- Las URL de las tiendas deben ser únicas y seguir el formato `rbx://`
- Todos los montos monetarios están en VFX, como números JSON
- Las miniaturas se sirven desde el bucket de recursos del explorador (consulta [Media](/es/build/web-api/media/))
