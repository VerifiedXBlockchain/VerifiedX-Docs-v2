---
sourceHash: 0456bb1fd308
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

### Listar o crear hilos de chat
```http
GET /api/chat/
POST /api/chat/
```

**GET** - Devuelve una lista paginada de hilos de chat.

**Respuesta:**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/chat/?page=2",
  "previous": null,
  "results": [
    {
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "participants": ["R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR", "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P"],
      "shop": {
        "id": 1,
        "name": "My Shop",
        "url": "rbx://myshop"
      },
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T13:00:00Z",
      "last_message": "Hello, is this item still available?"
    }
  ]
}
```

**POST** - Crea un nuevo hilo de chat.

**Solicitud:**
```json
{
  "participants": ["R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR", "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P"],
  "shop_id": 1,
  "initial_message": "I'm interested in your NFT collection"
}
```

### Obtener, actualizar o eliminar un hilo de chat
```http
GET /api/chat/{uuid}/
PATCH /api/chat/{uuid}/
DELETE /api/chat/{uuid}/
```

**Parámetros:**
- `uuid` (string): el UUID del hilo de chat

**Respuesta de GET:**
```json
{
  "uuid": "123e4567-e89b-12d3-a456-426614174000",
  "participants": ["R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR", "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P"],
  "shop": {
    "id": 1,
    "name": "My Shop",
    "url": "rbx://myshop"
  },
  "messages": [
    {
      "id": 1,
      "sender": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "content": "Hello, is this item available?",
      "timestamp": "2024-01-01T12:00:00Z",
      "is_read": false
    }
  ],
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T13:00:00Z"
}
```

### Buscar un hilo de chat
```http
GET /api/chat/lookup/
```

Encuentra hilos de chat existentes entre participantes.

**Parámetros de consulta:**
- `participants`: lista de direcciones de los participantes separadas por comas
- `shop_id`: ID de tienda opcional para filtrar

**Respuesta:**
```json
{
  "thread": {
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "participants": ["R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR", "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P"],
    "shop_id": 1
  }
}
```

### Listar o crear mensajes en un hilo
```http
GET /api/chat/{thread_uuid}/message/
POST /api/chat/{thread_uuid}/message/
```

**Parámetros:**
- `thread_uuid` (string): el UUID del hilo de chat

**GET** - Devuelve los mensajes del hilo.

**Respuesta:**
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "sender": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "content": "Hello, is this item available?",
      "timestamp": "2024-01-01T12:00:00Z",
      "is_read": false
    }
  ]
}
```

**POST** - Crea un nuevo mensaje en el hilo.

**Solicitud:**
```json
{
  "sender": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "content": "Yes, it's still available. Would you like to make an offer?"
}
```

### Obtener los mensajes de chat más recientes
```http
GET /api/chat/new-messages/
```

Devuelve los mensajes más recientes de todos los hilos de un usuario.

**Parámetros de consulta:**
- `address`: dirección del usuario cuyos mensajes quieres obtener
- `since`: marca de tiempo desde la cual obtener mensajes (formato ISO)

**Respuesta:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "thread_uuid": "123e4567-e89b-12d3-a456-426614174000",
      "sender": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
      "content": "I'd like to buy this NFT",
      "timestamp": "2024-01-01T14:00:00Z",
      "is_read": false
    }
  ]
}
```

## Descripción de los campos

### Hilo de chat
- `uuid`: identificador único del hilo de chat
- `participants`: arreglo de direcciones de VFX que participan en el chat
- `shop`: información de la tienda asociada (si corresponde)
- `created_at`: cuándo se creó el hilo
- `updated_at`: cuándo se actualizó el hilo por última vez
- `last_message`: vista previa del mensaje más reciente

### Mensaje de chat
- `id`: identificador único del mensaje
- `sender`: dirección de VFX del remitente del mensaje
- `content`: contenido de texto del mensaje
- `timestamp`: cuándo se envió el mensaje
- `is_read`: si los destinatarios ya leyeron el mensaje

## Notas

- Los hilos de chat suelen estar asociados a interacciones con tiendas o el marketplace
- Todos los participantes deben tener direcciones de VFX válidas
- Los mensajes admiten contenido de texto, con posible soporte multimedia en el futuro
- Los hilos se identifican por UUID por privacidad y seguridad
