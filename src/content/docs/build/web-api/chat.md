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

### List/Create Chat Threads
```http
GET /api/chat/
POST /api/chat/
```

**GET** - Returns a paginated list of chat threads.

**Response:**
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

**POST** - Creates a new chat thread.

**Request:**
```json
{
  "participants": ["R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR", "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P"],
  "shop_id": 1,
  "initial_message": "I'm interested in your NFT collection"
}
```

### Get/Update/Delete Chat Thread
```http
GET /api/chat/{uuid}/
PATCH /api/chat/{uuid}/
DELETE /api/chat/{uuid}/
```

**Parameters:**
- `uuid` (string): The chat thread UUID

**GET Response:**
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

### Lookup Chat Thread
```http
GET /api/chat/lookup/
```

Find existing chat threads between participants.

**Query Parameters:**
- `participants`: Comma-separated list of participant addresses
- `shop_id`: Optional shop ID to filter by

**Response:**
```json
{
  "thread": {
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "participants": ["R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR", "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P"],
    "shop_id": 1
  }
}
```

### List/Create Messages in Thread
```http
GET /api/chat/{thread_uuid}/message/
POST /api/chat/{thread_uuid}/message/
```

**Parameters:**
- `thread_uuid` (string): The chat thread UUID

**GET** - Returns messages in the thread.

**Response:**
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

**POST** - Creates a new message in the thread.

**Request:**
```json
{
  "sender": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "content": "Yes, it's still available. Would you like to make an offer?"
}
```

### Get Latest Chat Messages
```http
GET /api/chat/new-messages/
```

Returns the latest messages across all threads for a user.

**Query Parameters:**
- `address`: User's address to get messages for
- `since`: Timestamp to get messages since (ISO format)

**Response:**
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

## Field Descriptions

### Chat Thread
- `uuid`: Unique identifier for the chat thread
- `participants`: Array of VFX addresses participating in the chat
- `shop`: Associated shop information (if applicable)
- `created_at`: When the thread was created
- `updated_at`: When the thread was last updated
- `last_message`: Preview of the most recent message

### Chat Message
- `id`: Unique message identifier
- `sender`: VFX address of the message sender
- `content`: Message text content
- `timestamp`: When the message was sent
- `is_read`: Whether the message has been read by recipients

## Notes

- Chat threads are typically associated with shops/marketplace interactions
- All participants must have valid VFX addresses
- Messages support text content with potential for future multimedia support
- Threads are identified by UUID for privacy and security
