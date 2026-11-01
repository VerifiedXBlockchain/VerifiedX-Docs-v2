---
title: "Web API: Chat"
description: Explorer API endpoints for chat threads and messages between users in marketplace and shop contexts.
sidebar:
  label: "Chat"
  order: 6
---

The Chat API provides endpoints for managing chat threads and messages within the VFX ecosystem, typically used for communication between users in marketplace and shop contexts.

## Base URL
```
/api/chat/
```

## Endpoints

A thread joins one buyer address and one shop. Each message records whether the buyer sent it (`is_from_buyer`); the other side is the shop.

### List/Create Chat Threads
```http
GET /api/chat/
POST /api/chat/
```

**GET** - Returns a paginated list of chat threads for a buyer or for a shop.

**Query Parameters (one is required):**
- `address`: The buyer's VFX address
- `shop_url`: The shop URL, for example `rbx://myshop`

Without either parameter the call answers `400` with ``{"detail": "Param `address` or `shop_url` is required."}``.

**Response:**
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

`latest_message` is `null` when the thread has no messages.

**POST** - Creates a chat thread, or returns the existing one for the same shop and buyer.

**Request:**
```json
{
  "shop_url": "rbx://myshop",
  "buyer_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
  "is_third_party": true
}
```

The response is the thread in the Get Chat Thread format.

### Get/Delete Chat Thread
```http
GET /api/chat/{uuid}/
DELETE /api/chat/{uuid}/
```

**Parameters:**
- `uuid` (string): The chat thread UUID

**GET Response:**
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

**DELETE** removes the thread and answers `204`.

### Lookup Chat Thread
```http
GET /api/chat/lookup/
```

Finds the thread between a shop and a buyer.

**Query Parameters:**
- `url` (required): The shop URL; `rbx://` is added when missing
- `buyer_address` (required): The buyer's VFX address

**Response:** the thread in the Get Chat Thread format. A missing parameter or an unknown thread answers `400` with a `detail` message.

### List/Create Messages in Thread
```http
GET /api/chat/{thread_uuid}/message/
POST /api/chat/{thread_uuid}/message/
```

**Parameters:**
- `thread_uuid` (string): The chat thread UUID

**GET** - Returns the thread's messages, paginated.

:::caution
On 2026-11-01 the GET form answered `500` on both networks. Read a thread's messages from `GET /api/chat/{uuid}/` instead.
:::

**POST** - Adds a message to the thread and answers `201` with the message.

**Request:**
```json
{
  "body": "Yes, it's still available. Would you like to make an offer?",
  "is_from_buyer": false
}
```

**Response:**
```json
{
  "uuid": "6f1c2d3e-4b5a-4c7d-8e9f-0a1b2c3d4e5f",
  "is_from_buyer": true,
  "body": "Hello, is this item still available?",
  "is_delivered": true,
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Get Latest Chat Messages
```http
GET /api/chat/new-messages/
```

Reserved for new-message polling. It currently always returns an empty list:

```json
{
  "results": []
}
```

## Field Descriptions

### Chat Thread
- `uuid`: Unique identifier for the chat thread
- `shop`: The shop in the thread, in the format described on the [Shop](/build/web-api/shop/) page
- `is_third_party`: Whether the shop is a third-party shop
- `buyer_address`: VFX address of the buyer
- `created_at`: When the thread was created
- `latest_message` (list) / `messages` (detail): The newest message, or all messages

### Chat Message
- `uuid`: Unique message identifier
- `is_from_buyer`: `true` when the buyer sent the message, `false` when the shop did
- `body`: Message text
- `is_delivered`: Whether the message was delivered
- `created_at`: When the message was sent

## Notes

- Chat threads are associated with shop interactions: one thread per shop and buyer
- Threads are identified by UUID
