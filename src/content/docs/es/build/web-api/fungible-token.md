---
sourceHash: bf86b565dc5e
title: "Web API: Fungible Token"
description: Endpoints de la API del explorador para los detalles de tokens fungibles y sus temas de votación.
sidebar:
  label: "Fungible Token"
  order: 9
---

La API de Fungible Token ofrece endpoints para obtener información sobre tokens fungibles, incluidos los detalles del token, los temas de votación y las funciones de gobernanza.

## URL base
```
/api/fungible-tokens/
```

## Endpoints

### Listar tokens fungibles
```http
GET /api/fungible-tokens/
```

Devuelve una lista paginada de todos los tokens fungibles de la blockchain de VFX, de los más recientes a los más antiguos.

**Parámetros de consulta:**
- `page` (integer): número de página
- `limit` (integer): resultados por página (30 de forma predeterminada, 500 como máximo)

**Respuesta:**
```json
{
  "count": 400,
  "page": 1,
  "num_pages": 14,
  "results": [
    {
      "sc_identifier": "9541c645d3ae4d15886885d4627278b3:1792822131",
      "name": "QA Token W2",
      "ticker": "LR24AW2",
      "description": "Two-decimal test token",
      "owner_address": "xXVdgxHRzmr5WnSsi3c2v9wEjsFdk7jnkf",
      "can_mint": true,
      "can_burn": true,
      "can_vote": false,
      "created_at": "2026-10-24T06:08:57Z",
      "initial_supply": 0.0,
      "circulating_supply": 501.0,
      "decimal_places": 2,
      "image_url": "https://rbx-nft-web-assets-testnet.s3.amazonaws.com/9541c645d3ae4d15886885d4627278b31792822131/tmpol_eqhuk.png",
      "is_paused": false,
      "banned_addresses": [],
      "nsfw": false
    }
  ]
}
```

### Obtener los detalles de un token fungible
```http
GET /api/fungible-tokens/{sc_identifier}/
```

Devuelve un token y el saldo de cada dirección que lo ha tenido.

**Parámetros:**
- `sc_identifier` (string): el identificador del contrato inteligente

**Respuesta:**
```json
{
  "token": {
    "sc_identifier": "9541c645d3ae4d15886885d4627278b3:1792822131",
    "name": "QA Token W2",
    "ticker": "LR24AW2",
    "description": "Two-decimal test token",
    "owner_address": "xXVdgxHRzmr5WnSsi3c2v9wEjsFdk7jnkf",
    "can_mint": true,
    "can_burn": true,
    "can_vote": false,
    "created_at": "2026-10-24T06:08:57Z",
    "initial_supply": 0.0,
    "circulating_supply": 501.0,
    "decimal_places": 2,
    "image_url": "https://rbx-nft-web-assets-testnet.s3.amazonaws.com/9541c645d3ae4d15886885d4627278b31792822131/tmpol_eqhuk.png",
    "is_paused": false,
    "banned_addresses": [],
    "nsfw": false
  },
  "holders": {
    "xVWNbcBXTtiiL7ZHCqxRP1q12tcgUTQA4m": 399.5,
    "xXVdgxHRzmr5WnSsi3c2v9wEjsFdk7jnkf": 101.5
  }
}
```

### Listar los temas de votación de un token
```http
GET /api/fungible-tokens/{sc_identifier}/voting-topics/
```

Devuelve una lista paginada de los temas de votación de un token.

**Parámetros:**
- `sc_identifier` (string): el identificador del contrato inteligente

**Respuesta:**
```json
{
  "count": 2,
  "page": 1,
  "num_pages": 1,
  "results": [
    {
      "sc_identifier": "39685758c457473686504b4c16516a5b:1793534071",
      "token": { "sc_identifier": "39685758c457473686504b4c16516a5b:1793534071", "name": "...", "ticker": "..." },
      "from_address": "xWhMdq5TPzdXCib68kSHVUBhgdxdAZ1G2s",
      "topic_id": "u9GGgZ0R1793534287",
      "name": "Distribute Q3",
      "description": "Pay out the Q3 distribution",
      "vote_requirement": 51.0,
      "created_at": "2026-11-01T11:58:07Z",
      "voting_ends_at": "2026-11-08T11:58:07Z",
      "vote_data": {
        "votes": [
          { "address": "xWhMdq5TPzdXCib68kSHVUBhgdxdAZ1G2s", "value": true, "created_at": "2026-11-01T12:10:00Z" }
        ],
        "vote_yes": 1,
        "vote_no": 0,
        "total_votes": 1,
        "percent_yes": 1.0,
        "percent_no": 0.0
      }
    }
  ]
}
```

### Obtener los detalles de un tema de votación
```http
GET /api/fungible-tokens/voting-topics/{topic_id}/
```

Devuelve un tema de votación, con el mismo formato que un resultado de la lista.

**Parámetros:**
- `topic_id` (string): el identificador del tema de votación, por ejemplo `u9GGgZ0R1793534287`

## Descripción de los campos

### Token fungible
- `sc_identifier`: identificador único del contrato inteligente del token
- `name`: nombre completo del token
- `ticker`: símbolo de cotización del token
- `description`: descripción del token
- `owner_address`: propietario actual del contrato del token
- `can_mint`, `can_burn`, `can_vote`: si el token permite la emisión, la quema y los temas de votación
- `created_at`: cuándo se desplegó el token
- `initial_supply`: suministro emitido en el despliegue
- `circulating_supply`: suministro actual
- `decimal_places`: número de decimales admitidos
- `image_url`: imagen del token
- `is_paused`: si el propietario pausó el token
- `banned_addresses`: direcciones que el propietario bloqueó en el token
- `nsfw`: si el token está marcado como contenido no apto para el trabajo (NSFW)
- `holders` (solo en el detalle): saldo por dirección

### Tema de votación
- `topic_id`: identificador único del tema de votación
- `sc_identifier`, `token`: el token al que pertenece el tema
- `from_address`: dirección que creó el tema
- `name`: título corto de la propuesta
- `description`: descripción de la propuesta
- `vote_requirement`: porcentaje de votos a favor que pide el tema
- `created_at`: cuándo se creó el tema
- `voting_ends_at`: cuándo termina la votación
- `vote_data.votes`: cada voto emitido, con la `address` del votante, su `value` (`true` = sí) y `created_at`
- `vote_data.vote_yes`, `vote_data.vote_no`, `vote_data.total_votes`: conteos de votos
- `vote_data.percent_yes`, `vote_data.percent_no`: proporción de los votos emitidos, como fracciones de 0 a 1

## Notas

- Los montos de tokens son números JSON
- Los temas de votación solo existen para tokens con `can_vote: true`
- El explorador cuenta cada voto registrado una vez; `vote_data` no pondera los votos según el saldo de tokens
