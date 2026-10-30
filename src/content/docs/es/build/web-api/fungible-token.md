---
sourceHash: c8208a143ad1
title: "Web API: Fungible Token"
description: Endpoints de la API del explorador para los detalles de tokens fungibles y sus temas de votación.
sidebar:
  label: "Fungible Token"
  order: 9
---

La API de Fungible Token ofrece endpoints para obtener información sobre tokens fungibles, incluidos los detalles del token, los temas de votación y las funciones de gobernanza.

## URL base
```
/api/fungible-token/
```

## Endpoints

### Listar tokens fungibles
```http
GET /api/fungible-token/
```

Devuelve una lista paginada de todos los tokens fungibles de la blockchain de VFX.

**Parámetros de consulta:**
- `search`: busca por nombre del token, símbolo o identificador del contrato inteligente
- `ordering`: ordena los resultados (p. ej., `name`, `-created_at`)

**Respuesta:**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/fungible-token/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "smart_contract_uid": "SC123...",
      "name": "VFX Utility Token",
      "symbol": "VUT",
      "total_supply": "1000000.0",
      "decimals": 18,
      "creator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "created_at": "2024-01-01T12:00:00Z",
      "is_voting_enabled": true,
      "description": "A utility token for the VFX ecosystem"
    }
  ]
}
```

### Obtener los detalles de un token fungible
```http
GET /api/fungible-token/{sc_identifier}/
```

Devuelve la información detallada de un token fungible específico.

**Parámetros:**
- `sc_identifier` (string): el identificador del contrato inteligente

**Respuesta:**
```json
{
  "id": 1,
  "smart_contract_uid": "SC123...",
  "name": "VFX Utility Token",
  "symbol": "VUT",
  "total_supply": "1000000.0",
  "decimals": 18,
  "creator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "created_at": "2024-01-01T12:00:00Z",
  "is_voting_enabled": true,
  "description": "A utility token for the VFX ecosystem",
  "metadata": {
    "website": "https://example.com",
    "logo": "https://example.com/logo.png",
    "whitepaper": "https://example.com/whitepaper.pdf"
  },
  "holders_count": 500,
  "transfer_count": 1250
}
```

### Listar los temas de votación de un token
```http
GET /api/fungible-token/{sc_identifier}/voting-topics/
```

Devuelve los temas de votación asociados a un token fungible específico.

**Parámetros:**
- `sc_identifier` (string): el identificador del contrato inteligente

**Respuesta:**
```json
{
  "count": 5,
  "results": [
    {
      "topic_id": "topic_123",
      "title": "Proposal to Increase Token Supply",
      "description": "Vote on whether to increase the total token supply by 20%",
      "status": "active",
      "created_by": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "start_time": "2024-01-01T12:00:00Z",
      "end_time": "2024-01-08T12:00:00Z",
      "votes_for": 1500,
      "votes_against": 800,
      "total_votes": 2300,
      "participation_rate": "46%"
    }
  ]
}
```

### Obtener los detalles de un tema de votación
```http
GET /api/fungible-token/voting-topics/{topic_id}/
```

Devuelve la información detallada de un tema de votación específico.

**Parámetros:**
- `topic_id` (string): el identificador del tema de votación

**Respuesta:**
```json
{
  "topic_id": "topic_123",
  "token": {
    "smart_contract_uid": "SC123...",
    "name": "VFX Utility Token",
    "symbol": "VUT"
  },
  "title": "Proposal to Increase Token Supply",
  "description": "Vote on whether to increase the total token supply by 20%",
  "full_description": "This proposal suggests increasing the total supply...",
  "status": "active",
  "created_by": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "start_time": "2024-01-01T12:00:00Z",
  "end_time": "2024-01-08T12:00:00Z",
  "votes_for": 1500,
  "votes_against": 800,
  "abstain": 100,
  "total_votes": 2400,
  "participation_rate": "48%",
  "quorum_required": "25%",
  "quorum_met": true,
  "voting_options": ["For", "Against", "Abstain"]
}
```

## Descripción de los campos

### Token fungible
- `smart_contract_uid`: identificador único del contrato inteligente del token
- `name`: nombre completo del token
- `symbol`: símbolo o ticker de cotización del token
- `total_supply`: número total de tokens en circulación
- `decimals`: número de decimales admitidos
- `creator_address`: dirección que creó el token
- `is_voting_enabled`: si la votación de gobernanza está habilitada
- `holders_count`: número de direcciones que poseen el token
- `transfer_count`: número total de transferencias

### Tema de votación
- `topic_id`: identificador único del tema de votación
- `title`: título corto de la propuesta
- `description`: breve descripción de la propuesta
- `status`: estado actual (active, completed, cancelled)
- `start_time`: cuándo comienza la votación
- `end_time`: cuándo termina la votación
- `votes_for/against`: conteo de votos de cada opción
- `participation_rate`: porcentaje de votantes habilitados que participaron
- `quorum_required`: participación mínima necesaria para que sea válida
- `quorum_met`: si se cumplió el requisito de quórum

## Valores de estado de la votación

- `pending`: la votación aún no ha comenzado
- `active`: la votación está abierta
- `completed`: la votación terminó correctamente
- `cancelled`: la votación se canceló antes de completarse
- `failed`: la votación no alcanzó los requisitos de quórum

## Notas

- Los montos de tokens se devuelven como strings para conservar la precisión decimal
- La votación solo está disponible para tokens con `is_voting_enabled: true`
- El poder de voto normalmente se basa en los tokens en posesión en un bloque de captura (snapshot)
- Los temas pueden tener distintos mecanismos de votación (mayoría simple, mayoría calificada, etc.)
- Los datos históricos de votación se conservan por transparencia y para auditorías
