---
sourceHash: 0ceb6abf6dc5
title: "Web API: Faucet"
description: La API del faucet de testnet, que paga VFX de testnet y BTC de signet después de la verificación por SMS, y el acceso al faucet para automatizar pruebas.
sidebar:
  label: "Faucet"
  order: 8
---

El faucet de testnet paga VFX de testnet y BTC de signet (Bitcoin en el [signet de VerifiedX](/es/build/signet/), la red de Bitcoin propia de la testnet) para desarrollo y pruebas. Es la API detrás de la [página del faucet](https://spyglass-testnet.verifiedx.io/faucet) del explorador de testnet, y solo funciona en testnet.

Cada solicitud se confirma con un código enviado por SMS a un número de teléfono, y cada número de teléfono verificado tiene un límite total de por vida para cada activo.

## URL base
```
https://data-testnet.verifiedx.io/api/faucet/
```

## Endpoints

### Obtener la información del faucet
```http
GET /api/faucet/request/
```

Devuelve la dirección de envío del faucet, su saldo y los límites de las solicitudes.

**Respuesta:**
```json
{
  "address": "x8NemQSjMUKXaLqbpVU6YNq4P2d6Jbcrra",
  "available": 14999607.98989756,
  "max_amount": 1000.0,
  "min_amount": 0.0001,
  "btc": {
    "enabled": true,
    "max_amount": 0.01,
    "min_amount": 0.00001
  }
}
```

- `max_amount`: lo máximo en VFX que puede recibir en total un número de teléfono, o el saldo del faucet si es menor
- `btc.enabled`: si el faucet está pagando BTC de signet en este momento
- `btc.max_amount`: lo máximo en BTC de signet que puede recibir en total un número de teléfono

### Solicitar fondos
```http
POST /api/faucet/request/
```

Inicia una solicitud y envía un código de verificación por SMS a `phone`. No se paga nada hasta que la solicitud se verifica.

**Solicitud:**
```json
{
  "address": "xC1zNn7596TC4Bcyn1vE88pj12hfieqCoa",
  "amount": 10,
  "btc_address": "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
  "btc_amount": 0.002,
  "phone": "+12223334444"
}
```

- `address`, `amount`: la parte de VFX. Una dirección de VFX de testnet (empieza con `x`) y un monto a partir de `min_amount`
- `btc_address`, `btc_amount`: la parte de BTC de signet. Una dirección de Bitcoin con formato de testnet (`tb1…`, `m…`, `n…` o `2…`) y un monto a partir de `btc.min_amount`
- `phone`: el número de teléfono que recibe el código, en formato internacional (`+` y código de país)

Envía la parte de VFX, la de BTC o ambas. Cada parte necesita sus dos campos. La página del faucet pide un activo a la vez.

**Respuesta:**
```json
{
  "message": "Verification Required.",
  "uuid": "6f1c2a9e-3b7d-4c55-9a4e-0d2f8e1b7c31"
}
```

### Verificar la solicitud
```http
POST /api/faucet/verify/
```

Confirma una solicitud con el código del SMS y la paga.

**Solicitud:**
```json
{
  "uuid": "6f1c2a9e-3b7d-4c55-9a4e-0d2f8e1b7c31",
  "verification_code": "123456"
}
```

**Respuesta:**
```json
{
  "message": "Funds requested successfully.",
  "hash": "60ab…",
  "btc_hash": "9f3c…"
}
```

- `hash`: la transacción de VFX. Algunas respuestas incluyen la respuesta completa del nodo como un string JSON (`{"Result":"Success","Message":"…","Hash":"60ab…"}`); el hash es su campo `Hash`
- `btc_hash`: el id de la transacción de BTC de signet. Búscalo en `https://signet.verifiedx.io/tx/<btc_hash>`

Cuando una parte se paga y la otra falla, la respuesta es HTTP 400 con un `message` que dice qué falló, y aun así incluye el hash de la parte que se pagó. Verificar la misma solicitud de nuevo reintenta solo la parte no pagada. Cuando se desconoce el resultado de la parte de BTC, el mensaje indica que el pago podría haberse realizado. Ese pago nunca se vuelve a enviar, así que revisa el explorador de signet antes de pedir más.

El pago de BTC entra de inmediato en el mempool de signet y se confirma en el siguiente bloque de signet (unos 10 minutos).

## Errores

Todos los rechazos son HTTP 400 con un `message`:

| Mensaje | Causa |
|---------|-------|
| `Testnet faucet is disabled.` | El faucet está apagado |
| `Invalid request.` | No se envió ninguna parte, a una parte le falta un campo o falta `phone` |
| `Minimum amount is 0.0001 VFX.` / `Minimum amount is 0.00001 BTC.` | El monto está por debajo del mínimo |
| `Maximum amount is … VFX.` / `Maximum amount is … BTC.` | El monto supera el límite de un número |
| `There is a withdrawl limit of … This account has already withdrawn …` | Este número de teléfono alcanzó su límite de por vida |
| `Not a testnet BTC address (tb1…, m…, n… or 2…).` | La dirección de Bitcoin no tiene formato de testnet |
| `The BTC faucet is disabled.` | El faucet no está pagando BTC de signet en este momento |
| `Invalid verification code` | El código del SMS es incorrecto |
| `Request not found with uuid of …` | Ninguna solicitud tiene ese `uuid` |
| `Already verified. Hash: …` | La solicitud ya se había verificado y pagado por completo |

## Acceso al faucet para automatizar pruebas

Los equipos que hacen pruebas contra la testnet de VerifiedX desde scripts o CI pueden pedir un token de automatización. Una solicitud que lo lleva en un encabezado `X-Faucet-Token` no necesita `phone` ni código SMS: `POST /api/faucet/request/` paga de inmediato y responde con `hash`, `btc_hash` y `uuid`. La automatización tiene sus propios límites diarios, compartidos por todas las solicitudes con token.

El equipo de VerifiedX también puede dar acceso de automatización para minar bloques de signet bajo demanda, de modo que una prueba no tenga que esperar unos 10 minutos por cada confirmación.

Ambos forman parte del [acceso a la API de socios](/es/build/signet/#acceso-a-la-api-de-socios), donde se explica cómo solicitarlo, los límites y cómo llamar a ambas API. Mantén los tokens fuera de los repositorios, los logs y los gestores de incidencias.
