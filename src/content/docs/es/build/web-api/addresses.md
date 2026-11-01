---
sourceHash: ea9bc824f9aa
title: "Web API: Addresses"
description: Endpoints de la API del explorador para información de direcciones, saldos, principales poseedores, tokens en posesión y búsqueda de dominios ADNR.
sidebar:
  label: "Addresses"
  order: 2
---

La API de Addresses ofrece endpoints para obtener información de direcciones, saldos y tokens en posesión en la blockchain de VFX.

## URL base
```
/api/addresses/
```

## Endpoints

### Listar direcciones
```http
GET /api/addresses/
```

Devuelve una lista paginada de todas las direcciones con información básica.

**Parámetros de consulta:**
- `page` (integer): número de página
- `limit` (integer): resultados por página (30 por defecto, 500 como máximo)

**Respuesta:**
```json
{
  "count": 1000,
  "page": 1,
  "num_pages": 34,
  "results": [
    {
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "balance": 1000.123456789,
      "adnr": {
        "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
        "domain": "example.vfx",
        "create_transaction": { "hash": "...", "type": 6 },
        "is_btc": false,
        "btc_address": null
      }
    }
  ]
}
```

`adnr` es `null` cuando la dirección no tiene dominio. `create_transaction` es el objeto de transacción completo que se describe en la página [Transaction](/es/build/web-api/transaction/).

### Obtener los principales poseedores
```http
GET /api/addresses/top-holders/
```

Devuelve las 100 direcciones con mayor saldo, en orden descendente. La lista no está paginada. Cada saldo se calcula a partir de las transacciones indexadas: `received` es la suma de los montos entrantes, `sent` es la suma de los montos salientes más las comisiones, y `balance` es `received - sent`.

**Respuesta:**
```json
[
  {
    "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
    "balance": 50000.123456789,
    "received": 60000.0,
    "sent": 9999.876543211
  }
]
```

:::caution
En mainnet, esta agregación recorre todo el historial de transacciones y puede tardar más que el tiempo de espera habitual de un cliente.
:::

### Obtener los detalles de una dirección
```http
GET /api/addresses/{address}/
```

Devuelve la información detallada de una dirección específica.

**Parámetros:**
- `address` (string): la dirección VFX que quieres consultar

**Respuesta:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "balance": 1000.123456789,
  "balance_total": 1000.123456789,
  "balance_locked": 0.0,
  "adnr": "example.vfx",
  "activated": true,
  "deactivated": false
}
```

**Campos:**
- `address`: la dirección VFX
- `balance`: saldo disponible
- `balance_total`: saldo total (disponible + bloqueado)
- `balance_locked`: saldo bloqueado/en stake
- `adnr`: nombre de dominio ADNR asociado (si lo hay)
- `activated`: si la dirección es una Cuenta de reserva (Reserve Account) registrada
- `deactivated`: si la Cuenta de reserva se desactivó

**Códigos de estado:**
- `200 OK`: dirección encontrada
- `404 Not Found`: `{"detail": "Address not found"}`

### Obtener los tokens en posesión de una dirección
```http
GET /api/addresses/{address}/tokens/
```

Devuelve todos los saldos de tokens fungibles de una dirección específica.

**Parámetros:**
- `address` (string): la dirección VFX que quieres consultar

**Respuesta:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "tokens": [
    {
      "token": {
        "sc_identifier": "661df86da7314186a63091943547e582:1793057882",
        "name": "Example Token",
        "ticker": "EXT",
        "description": "An example token",
        "owner_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
        "can_mint": true,
        "can_burn": true,
        "can_vote": true,
        "created_at": "2026-10-24T05:35:20Z",
        "initial_supply": 0.0,
        "circulating_supply": 1250.0,
        "decimal_places": 8,
        "image_url": "https://...",
        "is_paused": false,
        "banned_addresses": [],
        "nsfw": false
      },
      "balance": 500.0
    }
  ]
}
```

`token` es el mismo objeto que devuelven los endpoints de [Fungible Token](/es/build/web-api/fungible-token/). Una dirección desconocida devuelve `404`.

### Buscar una dirección por dominio ADNR
```http
GET /api/addresses/adnr/{domain}/
```

Devuelve la información de la dirección de un nombre de dominio ADNR dado.

**Parámetros:**
- `domain` (string): el nombre de dominio completo con su sufijo, por ejemplo `example.vfx` o `example.btc`. Un nombre sin el sufijo devuelve `404`.

**Respuesta:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "balance": 1000.123456789,
  "balance_total": 1000.123456789,
  "balance_locked": 0.0,
  "adnr": "example.vfx"
}
```

**Códigos de estado:**
- `200 OK`: dirección encontrada
- `404 Not Found`: dominio no encontrado

## Notas

- Los montos de saldo son números JSON. En los endpoints de detalle y de dominio, un saldo tan pequeño que se imprimiría en notación exponencial se devuelve en su lugar como string con 16 decimales
- Las direcciones de mainnet empiezan con `R`; las de testnet empiezan con `x`
- Las Cuentas de reserva tienen los campos adicionales `activated` y `deactivated`
- Los dominios ADNR dan nombres legibles a las direcciones
- Los saldos de tokens solo incluyen tokens fungibles, no NFTs
