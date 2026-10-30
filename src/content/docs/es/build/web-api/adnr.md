---
sourceHash: c9af1c9a6b5d
title: "Web API: ADNR"
description: Endpoints de la API del explorador para listar y resolver dominios ADNR (Address Domain Name Resolution) de direcciones de VFX.
sidebar:
  label: "ADNR"
  order: 3
---

La API de ADNR (Address Domain Name Resolution) ofrece endpoints para gestionar y resolver nombres de dominio legibles para las direcciones de la blockchain de VFX.

## URL base
```
/api/adnr/
```

## Endpoints

### Listar dominios ADNR
```http
GET /api/adnr/
```

Devuelve una lista paginada de todos los dominios ADNR, ordenada por altura de creación (los más recientes primero).

**Parámetros de consulta:**
- `search`: busca por nombre de dominio o dirección
- `ordering`: ordena los resultados (p. ej., `-create_transaction__height`)

**Respuesta:**
```json
{
  "count": 500,
  "next": "http://localhost:8000/api/adnr/?page=2",
  "previous": null,
  "results": [
    {
      "domain": "example",
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "is_btc": false,
      "btc_address": null,
      "create_transaction": {
        "hash": "tx123...",
        "height": 12345
      }
    }
  ]
}
```

### Obtener los detalles de un dominio ADNR
```http
GET /api/adnr/{domain}/
```

Devuelve la información detallada de un dominio ADNR específico.

**Parámetros:**
- `domain` (string): el nombre de dominio (sin el sufijo .rbx)

**Respuesta:**
```json
{
  "domain": "example",
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "is_btc": false,
  "btc_address": null,
  "create_transaction": {
    "hash": "tx123...",
    "height": 12345
  }
}
```

**Códigos de estado:**
- `200 OK`: dominio encontrado
- `404 Not Found`: dominio no encontrado

### Buscar un ADNR por dirección de Bitcoin
```http
GET /api/adnr/btc/{btc_address}/
```

Devuelve el dominio ADNR asociado a una dirección de Bitcoin (para dominios vinculados a Bitcoin).

**Parámetros:**
- `btc_address` (string): la dirección de Bitcoin

**Respuesta:**
```json
{
  "btc_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "domain": "satoshi"
}
```

Si no se encuentra ningún dominio:
```json
{
  "btc_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "domain": null
}
```

## Descripción de los campos

- `domain`: el nombre de dominio legible
- `address`: la dirección de la blockchain de VFX asociada
- `is_btc`: si este dominio está vinculado a una dirección de Bitcoin
- `btc_address`: la dirección de Bitcoin asociada (si `is_btc` es true)
- `create_transaction`: información sobre la transacción que creó este dominio

## Notas

- Los dominios ADNR dan nombres legibles a las direcciones de VFX (p. ej., "example.rbx" en lugar de "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR")
- Algunos dominios pueden vincularse a direcciones de Bitcoin para funciones multicadena
- Los nombres de dominio no distinguen entre mayúsculas y minúsculas
- El sufijo `.rbx` está implícito y no se guarda en el campo domain
- Los resultados se almacenan en caché para mejorar el rendimiento
