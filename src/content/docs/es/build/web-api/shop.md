---
sourceHash: 9043ffeedb27
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

## Endpoints

### Listar o crear tiendas
```http
GET /api/shop/
POST /api/shop/
```

**GET** - Devuelve una lista paginada de tiendas.

**Parámetros de consulta:**
- `search`: busca por nombre de la tienda, URL o dirección del propietario
- `ordering`: ordena los resultados (p. ej., `-created_at`, `name`)

**Respuesta:**
```json
{
  "count": 150,
  "results": [
    {
      "id": 1,
      "name": "Digital Art Gallery",
      "url": "rbx://digital-art-gallery",
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "description": "Premium digital artwork collection",
      "banner_image": "https://media.vfx.io/shop/banner1.png",
      "profile_image": "https://media.vfx.io/shop/profile1.png",
      "is_verified": true,
      "is_third_party": false,
      "created_at": "2024-01-01T12:00:00Z",
      "collections_count": 5,
      "total_sales": "15000.0"
    }
  ]
}
```

**POST** - Crea una nueva tienda.

**Solicitud:**
```json
{
  "name": "My NFT Shop",
  "url": "rbx://my-nft-shop",
  "description": "A collection of unique digital assets",
  "banner_image": "https://example.com/banner.png"
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

### Buscar una tienda por URL
```http
GET /api/shop/url/?url=rbx://shop-name
```

Devuelve la información de una tienda según su URL.

**Parámetros de consulta:**
- `url` (string): URL de la tienda (con o sin el prefijo rbx://)

### Comprobar la disponibilidad de la URL de una tienda
```http
GET /api/shop/available/?url=rbx://shop-name
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

Inicia una resincronización de los datos de la tienda.

### Colecciones

#### Listar o crear colecciones
```http
GET /api/shop/{shop_id}/collection/
POST /api/shop/{shop_id}/collection/
```

**Respuesta de GET:**
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "name": "Pixel Art Collection",
      "description": "8-bit style digital art",
      "image": "https://media.vfx.io/collection/pixel1.png",
      "shop_id": 1,
      "nft_count": 25,
      "floor_price": "50.0",
      "total_volume": "2500.0"
    }
  ]
}
```

#### Obtener, actualizar o eliminar una colección
```http
GET /api/shop/{shop_id}/collection/{id}/
PATCH /api/shop/{shop_id}/collection/{id}/
DELETE /api/shop/{shop_id}/collection/{id}/
```

### Publicaciones

#### Listar o crear publicaciones
```http
GET /api/shop/{shop_id}/collection/{collection_id}/listing/
POST /api/shop/{shop_id}/collection/{collection_id}/listing/
```

**Respuesta de GET:**
```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "smart_contract_uid": "NFT123...",
      "name": "Pixel Warrior #1",
      "description": "A brave digital warrior",
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "floor_price": "100.0",
      "buy_now_price": "150.0",
      "is_auction": true,
      "is_buy_now": true,
      "auction_end_time": "2024-01-08T12:00:00Z",
      "current_bid": "120.0",
      "bid_count": 5,
      "is_sale_complete": false
    }
  ]
}
```

**POST** - Crea una nueva publicación.

**Solicitud:**
```json
{
  "smart_contract_uid": "NFT123...",
  "floor_price": "100.0",
  "buy_now_price": "150.0",
  "is_auction": true,
  "is_buy_now": true,
  "auction_duration_hours": 168
}
```

#### Obtener, actualizar o eliminar una publicación
```http
GET /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
PATCH /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
DELETE /api/shop/{shop_id}/collection/{collection_id}/listing/{id}/
```

### Ofertas

#### Crear una oferta
```http
POST /api/shop/bid/
```

Hace una oferta en una publicación.

**Solicitud:**
```json
{
  "listing": 1,
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "amount": "125.0",
  "signature": "bid_signature_here...",
  "is_buy_now": false,
  "from_third_party": false
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Bid Placed",
  "bid_id": "bid_123...",
  "amount": "125.0",
  "estimated_confirmation": "2024-01-01T12:02:00Z"
}
```

#### Obtener los detalles de una oferta
```http
GET /api/shop/bid/{id}/
```

Devuelve la información detallada de una oferta específica.

#### Enviar una oferta aceptada
```http
POST /api/shop/bid/accepted/
```

Confirma y procesa una oferta aceptada (para la integración con webhooks).

## Descripción de los campos

### Tienda
- `name`: nombre visible de la tienda
- `url`: URL única de la tienda (formato rbx://)
- `owner_address`: dirección de VFX del propietario de la tienda
- `is_verified`: si la tienda está verificada oficialmente
- `is_third_party`: si está integrada desde plataformas externas
- `collections_count`: número de colecciones en la tienda
- `total_sales`: volumen total de ventas en VFX

### Colección
- `shop_id`: ID de la tienda a la que pertenece
- `nft_count`: número de NFTs en la colección
- `floor_price`: precio de publicación más bajo de la colección
- `total_volume`: volumen total de negociación de la colección

### Publicación
- `smart_contract_uid`: identificador del NFT que se publica
- `floor_price`: precio mínimo aceptable (para subastas)
- `buy_now_price`: precio de compra fijo
- `is_auction`: si las ofertas de subasta están habilitadas
- `is_buy_now`: si la compra inmediata está habilitada
- `current_bid`: monto de la oferta más alta actual
- `bid_count`: número de ofertas recibidas
- `is_sale_complete`: si el artículo ya se vendió

### Oferta
- `listing`: ID de la publicación sobre la que se ofrece
- `amount`: monto de la oferta en VFX
- `signature`: firma criptográfica para verificar la oferta
- `is_buy_now`: si se trata de una compra de **Comprar ahora** (Buy Now)
- `from_third_party`: si la oferta proviene de una plataforma externa

## Tipos de publicación

- **Solo subasta**: `is_auction: true, is_buy_now: false`
- **Solo Comprar ahora**: `is_auction: false, is_buy_now: true`
- **Subasta + Comprar ahora**: `is_auction: true, is_buy_now: true`

## Notas

- Las URL de las tiendas deben ser únicas y seguir el formato rbx://
- Todos los montos monetarios están en tokens VFX
- Las ofertas requieren firmas criptográficas por seguridad
- Las tiendas de terceros se integran con plataformas de NFT externas
- Los contratos inteligentes hacen cumplir los temporizadores de las subastas
- La verificación de las tiendas se revisa manualmente para confirmar su autenticidad
