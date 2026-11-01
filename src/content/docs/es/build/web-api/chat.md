---
sourceHash: "47fa08679f5a"
title: "Web API: Chat"
description: Endpoints de la API del explorador para hilos de chat y mensajes entre usuarios en el contexto del marketplace y las tiendas.
sidebar:
  label: "Chat"
  order: 6
---

La API de Chat ofrece endpoints para gestionar hilos de chat y mensajes dentro del ecosistema de VFX; normalmente se usa para la comunicación entre usuarios en el contexto del marketplace y las tiendas.

## URL base
```
/api/chat/
```

## Endpoints

Un hilo une una dirección de comprador con una tienda. Cada mensaje registra si lo envió el comprador (`is_from_buyer`); la otra parte es la tienda.

### Listar o crear hilos de chat
```http
GET /api/chat/
POST /api/chat/
```

**GET** - Devuelve una lista paginada de hilos de chat de un comprador o de una tienda.

**Parámetros de consulta (se requiere uno):**
- `address`: la dirección de VFX del comprador
- `shop_url`: la URL de la tienda, por ejemplo `rbx://myshop`

Sin ninguno de los dos parámetros, la llamada responde `400` con ``{"detail": "Param `address` or `shop_url` is required."}``.

**Respuesta:**
```json
{
  "count": 1,
  "page": 1,
  "num_pages": 1,
  "results": [
    {
      "uuid": "4a3f65a8-a361-434d-a120-b4341a55cea7",
      "shop": {
          "id": 923,
          "unique_id": "lTRSoDPluH1752177270",
          "name": "My Shop",
          "description": "Digital collectibles",
          "url": "rbx://myshop",
          "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
          "is_published": true,
          "is_third_party": true,
          "is_online": false
        },
      "is_third_party": true,
      "buyer_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "created_at": "2024-01-01T12:00:00Z",
      "latest_message": {
        "uuid": "6f1c2d3e-4b5a-4c7d-8e9f-0a1b2c3d4e5f",
        "is_from_buyer": true,
        "body": "Hello, is this item still available?",
        "is_delivered": true,
        "created_at": "2024-01-01T12:00:00Z"
      }
    }
  ]
}
```

`latest_message` es `null` cuando el hilo no tiene mensajes.

**POST** - Crea un hilo de chat, o devuelve el existente para la misma tienda y el mismo comprador.

**Solicitud:**
```json
{
  "shop_url": "rbx://myshop",
  "buyer_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
  "is_third_party": true
}
```

La respuesta es el hilo en el formato de Obtener un hilo de chat.

### Obtener o eliminar un hilo de chat
```http
GET /api/chat/{uuid}/
DELETE /api/chat/{uuid}/
```

**Parámetros:**
- `uuid` (string): el UUID del hilo de chat

**Respuesta de GET:**
```json
{
  "uuid": "4a3f65a8-a361-434d-a120-b4341a55cea7",
  "shop": {
      "id": 923,
      "unique_id": "lTRSoDPluH1752177270",
      "name": "My Shop",
      "description": "Digital collectibles",
      "url": "rbx://myshop",
      "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "is_published": true,
      "is_third_party": true,
      "is_online": false
    },
  "is_third_party": true,
  "buyer_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
  "created_at": "2024-01-01T12:00:00Z",
  "messages": [
    {
      "uuid": "6f1c2d3e-4b5a-4c7d-8e9f-0a1b2c3d4e5f",
      "is_from_buyer": true,
      "body": "Hello, is this item still available?",
      "is_delivered": true,
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

**DELETE** elimina el hilo y responde `204`.

### Buscar un hilo de chat
```http
GET /api/chat/lookup/
```

Encuentra el hilo entre una tienda y un comprador.

**Parámetros de consulta:**
- `url` (requerido): la URL de la tienda; se agrega `rbx://` cuando falta
- `buyer_address` (requerido): la dirección de VFX del comprador

**Respuesta:** el hilo en el formato de Obtener un hilo de chat. Un parámetro faltante o un hilo desconocido responde `400` con un mensaje `detail`.

### Listar o crear mensajes en un hilo
```http
GET /api/chat/{thread_uuid}/message/
POST /api/chat/{thread_uuid}/message/
```

**Parámetros:**
- `thread_uuid` (string): el UUID del hilo de chat

**GET** - Devuelve los mensajes del hilo, paginados.

:::caution
El 2026-11-01 la forma GET respondió `500` en ambas redes. Lee los mensajes de un hilo desde `GET /api/chat/{uuid}/` en su lugar.
:::

**POST** - Agrega un mensaje al hilo y responde `201` con el mensaje.

**Solicitud:**
```json
{
  "body": "Yes, it's still available. Would you like to make an offer?",
  "is_from_buyer": false
}
```

**Respuesta:**
```json
{
  "uuid": "6f1c2d3e-4b5a-4c7d-8e9f-0a1b2c3d4e5f",
  "is_from_buyer": true,
  "body": "Hello, is this item still available?",
  "is_delivered": true,
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Obtener los mensajes de chat más recientes
```http
GET /api/chat/new-messages/
```

Reservado para consultar periódicamente si hay mensajes nuevos. Por ahora siempre devuelve una lista vacía:

```json
{
  "results": []
}
```

## Descripción de los campos

### Hilo de chat
- `uuid`: identificador único del hilo de chat
- `shop`: la tienda del hilo, en el formato descrito en la página [Shop](/es/build/web-api/shop/)
- `is_third_party`: si la tienda es una tienda de terceros
- `buyer_address`: dirección de VFX del comprador
- `created_at`: cuándo se creó el hilo
- `latest_message` (lista) / `messages` (detalle): el mensaje más reciente, o todos los mensajes

### Mensaje de chat
- `uuid`: identificador único del mensaje
- `is_from_buyer`: `true` cuando el comprador envió el mensaje, `false` cuando lo envió la tienda
- `body`: texto del mensaje
- `is_delivered`: si el mensaje se entregó
- `created_at`: cuándo se envió el mensaje

## Notas

- Los hilos de chat están asociados a interacciones con tiendas: un hilo por tienda y comprador
- Los hilos se identifican por UUID
