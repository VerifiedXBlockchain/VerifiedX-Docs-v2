---
sourceHash: e89b609ef252
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

**Respuesta:**
```json
{
  "count": 1000,
  "next": "http://localhost:8000/api/addresses/?page=2",
  "previous": null,
  "results": [
    {
      "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "balance": "1000.123456789",
      "adnr": {
        "domain": "example.rbx"
      }
    }
  ]
}
```

### Obtener los principales poseedores
```http
GET /api/addresses/top-holders/
```

Devuelve las 100 direcciones con mayor saldo, en orden descendente.

**Respuesta:**
```json
[
  {
    "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
    "balance": "50000.123456789",
    "received": "60000.0",
    "sent": "9999.876543211"
  }
]
```

### Obtener los detalles de una dirección
```http
GET /api/addresses/{address}/
```

Devuelve la información detallada de una dirección específica.

**Parámetros:**
- `address` (string): la dirección RBX que quieres consultar

**Respuesta:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "balance": "1000.123456789",
  "balance_total": "1000.123456789",
  "balance_locked": "0.0",
  "adnr": "example.rbx",
  "activated": true,
  "deactivated": false
}
```

**Campos:**
- `address`: la dirección RBX
- `balance`: saldo disponible
- `balance_total`: saldo total (disponible + bloqueado)
- `balance_locked`: saldo bloqueado/en stake
- `adnr`: nombre de dominio ADNR asociado (si lo hay)
- `activated`: si la dirección es una Cuenta de reserva (Reserve Account) registrada
- `deactivated`: si la Cuenta de reserva se desactivó

### Obtener los tokens en posesión de una dirección
```http
GET /api/addresses/{address}/tokens/
```

Devuelve todos los saldos de tokens fungibles de una dirección específica.

**Parámetros:**
- `address` (string): la dirección RBX que quieres consultar

**Respuesta:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "tokens": [
    {
      "token": {
        "id": 1,
        "name": "Example Token",
        "symbol": "EXT",
        "smart_contract_uid": "SC123..."
      },
      "balance": "500.0"
    }
  ]
}
```

### Buscar una dirección por dominio ADNR
```http
GET /api/addresses/adnr/{domain}/
```

Devuelve la información de la dirección de un nombre de dominio ADNR dado.

**Parámetros:**
- `domain` (string): el nombre de dominio ADNR (sin el sufijo .rbx)

**Respuesta:**
```json
{
  "address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "balance": "1000.123456789",
  "balance_total": "1000.123456789",
  "balance_locked": "0.0",
  "adnr": "example.rbx"
}
```

**Códigos de estado:**
- `200 OK`: dirección encontrada
- `404 Not Found`: dominio no encontrado

## Notas

- Todos los montos de saldo se devuelven como strings para conservar la precisión
- Las direcciones de mainnet empiezan con `R`; las de testnet empiezan con `x`
- Las Cuentas de reserva tienen los campos adicionales `activated` y `deactivated`
- Los dominios ADNR dan nombres legibles a las direcciones
- Los saldos de tokens solo incluyen tokens fungibles, no NFTs
