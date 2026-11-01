---
sourceHash: "23c36572e159"
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

Devuelve una lista paginada de todos los dominios ADNR activos (los dominios eliminados se excluyen), ordenada por altura de creación (los más recientes primero).

**Parámetros de consulta:**
- `search`: busca por nombre de dominio o dirección
- `ordering`: ordena por un campo de la respuesta, por ejemplo `domain` o `-domain`
- `page` (integer): número de página
- `limit` (integer): resultados por página (30 de forma predeterminada, máximo 500)

**Respuesta:**
```json
{
  "count": 500,
  "page": 1,
  "num_pages": 17,
  "results": [
    {
      "domain": "example.vfx",
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "is_btc": false,
      "btc_address": null,
      "create_transaction": {
        "hash": "14fd35ecae8705c1f3e699bb6fc6f40546e8a28a2b0175e8ac9dc76d936c3ac2",
        "height": 7587359,
        "type": 6,
        "to_address": "Adnr_Base",
        "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
        "total_amount": 5.0,
        "data": "{\"Function\":\"AdnrCreate()\",\"Name\":\"example\"}"
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
- `domain` (string): el nombre de dominio completo, con su sufijo, por ejemplo `example.vfx` o `example.btc`

**Respuesta:**
```json
{
  "domain": "example.vfx",
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "is_btc": false,
  "btc_address": null,
  "create_transaction": {
    "hash": "14fd35ecae8705c1f3e699bb6fc6f40546e8a28a2b0175e8ac9dc76d936c3ac2",
    "height": 7587359,
    "type": 6,
    "to_address": "Adnr_Base",
    "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
    "total_amount": 5.0,
    "data": "{\"Function\":\"AdnrCreate()\",\"Name\":\"example\"}"
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
  "domain": "satoshi.btc"
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
- `create_transaction`: la transacción que creó este dominio, en el formato completo que se describe en la página [Transaction](/es/build/web-api/transaction/) (abreviado arriba)

## Notas

- Los dominios ADNR dan nombres legibles a las direcciones de VFX (p. ej., "example.vfx" en lugar de "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR")
- Algunos dominios pueden vincularse a direcciones de Bitcoin para funciones multicadena; esos terminan en `.btc`
- Los nombres de dominio están en minúsculas y la búsqueda es una coincidencia exacta: `Example.vfx` devuelve `404`
- El sufijo se guarda en el campo `domain` (`.vfx` o `.btc`) y debe incluirse en las búsquedas
- Los resultados se almacenan en caché para mejorar el rendimiento
