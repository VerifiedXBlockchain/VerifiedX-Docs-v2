---
sourceHash: "bedcafd81dd0"
title: "Web API: BTC"
description: Endpoints de la API del explorador para información de direcciones de Bitcoin y datos de bóvedas de vBTC, incluidas las bóvedas de vBTC V2 y las alturas de certificación.
sidebar:
  label: "BTC"
  order: 5
  attrs:
    class: sidebar-btc
---

La API de BTC del explorador de VerifiedX ofrece información de direcciones de Bitcoin y datos de bóvedas (vaults) de vBTC (Verified Bitcoin).

## URL base
```
/api/btc/
```

## Endpoints

### Obtener la información de una dirección de Bitcoin
```http
GET /api/btc/address/{address}/
```

Devuelve el saldo confirmado de una dirección de Bitcoin, sus transacciones de los últimos siete días y sus UTXO, leídos de un proveedor externo de datos de Bitcoin.

:::caution
El 2026-11-01 este endpoint respondía `500` en ambas redes. Usa un explorador de Bitcoin o las rutas de BTC del nodo para obtener los datos de una dirección hasta que se corrija.
:::

**Parámetros:**
- `address` (string): la dirección de Bitcoin
- `offset` (parámetro de consulta): desplazamiento de la paginación de las transacciones y los UTXO (predeterminado: 0, 50 por página)

**Respuesta:**
```json
{
  "balance": "0.0005",
  "transactions": {
    "total": 25,
    "results": [
      {
        "id": "abc123...",
        "index": 0,
        "hash": "abc123...",
        "recipients": [{ "address": "bc1q...", "amount": "0.0005" }],
        "senders": [{ "address": "bc1q...", "amount": "0.00051" }],
        "timestamp": "abc123...",
        "fee": "0.00001"
      }
    ]
  },
  "utxos": {
    "total": 3,
    "results": [
      {
        "address": "bc1q...",
        "amount": "0.00025",
        "index": 0,
        "is_available": true,
        "is_confirmed": true,
        "timestamp": 1640995200,
        "transaction_id": "def456..."
      }
    ]
  }
}
```

### Transmitir una transacción de Bitcoin
```http
POST /api/btc/broadcast/
```

Transmite una transacción de Bitcoin firmada.

**Cuerpo de la solicitud:**
```json
{
  "raw_tx_hex": "0200000001..."
}
```

**Respuesta:**
```json
{
  "success": true,
  "txid": "def456..."
}
```

Si falta `raw_tx_hex`, responde `400` con `{"success": false, "message": "raw_tx_hex required"}`; una transmisión rechazada responde `500` con `success: false` y un `message`.

### Obtener los datos de la imagen predeterminada de vBTC
```http
GET /api/btc/vbtc-image-data/
```

Devuelve la imagen en base64 predeterminada que el nodo usa para una bóveda de vBTC que no tiene imagen propia.

**Respuesta:**
```json
{
  "data": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## vBTC V2

Las bóvedas de vBTC V2 están en `/api/btc/vbtc-v2/`. El explorador las indexa desde la cadena; para el estado en vivo de un retiro, consulta el nodo (ver más abajo). Los montos de estas respuestas son números JSON en BTC.

### Alturas de certificación
```http
GET /api/btc/vbtc-v2/heights/
```

```json
{ "record_height": 7568350, "enforcement_height": 7658350, "latest_block_height": 7624952 }
```

Estos son los valores de mainnet; testnet responde `400` y `401`.

Desde `record_height`, una bóveda nueva es vigilada; desde `enforcement_height`, las bóvedas anteriores quedan congeladas. Una altura es `null` mientras Core no la haya definido.

### Listar bóvedas
```http
GET /api/btc/vbtc-v2/
GET /api/btc/vbtc-v2/{vfx_address}/
```

Todas las bóvedas, o las que una dirección posee o en las que ha enviado o recibido vBTC, como `{"results": [...]}` (sin paginación). Cada resultado tiene la forma de los detalles de una bóveda que se describe abajo.

### Detalles de una bóveda
```http
GET /api/btc/vbtc-v2/detail/{sc_identifier}/
```

```json
{
  "sc_identifier": "9344ffaded944166b2992957f133c8df:1793028387",
  "name": "Treasury vault",
  "description": "",
  "owner_address": "<owner>",
  "pending_owner_address": null,
  "is_watched": true,
  "image_url": "…",
  "deposit_address": "bc1p…",
  "frost_group_public_key": "03…",
  "required_threshold": 51,
  "proof_block_height": 7585002,
  "global_balance": 0.0001,
  "total_received": 0.0,
  "total_sent": 0.0,
  "tx_count": 0,
  "is_pending_withdrawal": false,
  "addresses": { "<owner>": 0.00007, "<holder>": 0.00003 },
  "available_balances": { "<owner>": 0.00007, "<holder>": 0.00003 },
  "nft": { "…": "…" },
  "withdrawal_requests": [ ],
  "created_at": "2026-10-23T13:01:20Z"
}
```

- `is_watched`: la bóveda se creó a partir de la altura de registro y la cadena registra su Bitcoin. El respaldo de una bóveda vigilada es `global_balance`, leído de la cadena; `total_received` y `total_sent` provienen de proveedores de Bitcoin y solo se mantienen actualizados para las bóvedas que la cadena no vigila.
- `addresses` es el vBTC bruto de cada dirección en la bóveda; `available_balances` descuenta sus retiros abiertos y es la cifra con la que una billetera debe calcular los envíos.
- `pending_owner_address`: la transferencia de propiedad de un propietario de reserva, que entra en vigor al desbloquearse.
- `nft` es el contrato inteligente de la bóveda, en el formato que se describe en la página [NFT](/es/build/web-api/nft/), y `withdrawal_requests` contiene las filas de retiro que se describen abajo.

Una fila de transferencia:

```json
{
  "id": 31,
  "from_address": "xPiYBbYNvhNvjmS2nJZDnZ2Py6JDYSuKpa",
  "to_address": "xGru3UjbC8Q6oLr4nMR61Z22JZYBNcoAwq",
  "amount": 0.00001297,
  "is_multi": false,
  "transaction_hash": "8cdc0f6d121803e7ca1a0c8fbabbfb1d7d32676059360da54f940785d16ee307",
  "refused_at_maturity": false,
  "created_at": "2026-10-30T00:59:51Z"
}
```

`is_multi` marca una porción de una transferencia desde varias bóvedas. `refused_at_maturity` marca un envío desde una cuenta de reserva que el nodo rechazó cuando venció, y que no movió nada.

### Transferencias y retiros de una bóveda
```http
GET /api/btc/vbtc-v2/transfers/{sc_identifier}/
GET /api/btc/vbtc-v2/withdrawals/{sc_identifier}/
```

Una fila de retiro (una por cada porción de bóveda de una solicitud):

```json
{
  "id": 19,
  "requestor_address": "<requester>",
  "btc_address": "bc1q…",
  "amount": 0.00002,
  "fee_rate": 3.0,
  "btc_transaction_hash": "c314d462…",
  "status": "completed",
  "signed_at": null,
  "request_transaction_hash": "<request hash>",
  "completion_transaction_hash": null,
  "created_at": "2026-10-28T14:02:11Z",
  "completed_at": "2026-10-28T14:40:03Z",
  "pin_state": null,
  "pin_txid": null,
  "pin_fee_rate": null,
  "releasing": null,
  "expires_at_height": null,
  "closed_because": null,
  "refunded_amount": null
}
```

- `status` es `requested`, `pending_btc`, `completed`, `cancellation_requested` o `cancelled`. El retiro de una bóveda vigilada pasa de `requested` a `completed` (pagado, con el `btc_transaction_hash` que lo paga) o a `cancelled`.
- `closed_because` indica por qué una fila `cancelled` se cerró sin pago: `Cancelled`, `Released`, `Expired` o `Void`. `refunded_amount` se define cuando volvió menos que el monto (una liberación conserva su comisión de Bitcoin).
- Mientras el retiro de una bóveda vigilada está abierto, `pin_state` es `Waiting` o `Pinned`, con el `pin_txid` y el `pin_fee_rate` de la fijación más reciente, `releasing`, y `expires_at_height` mientras espera.

:::caution[Sigue los retiros abiertos a través del nodo]
El nodo informa la fijación de un retiro en el bloque que mina la solicitud. El explorador la lee más tarde, después de un informe de Bitcoin posterior, así que `pin_state` y `pin_txid` pueden estar vacíos aunque el retiro ya esté fijado. Los integradores deben seguir los retiros abiertos con las rutas `GetWithdrawalPin` y `GetWithdrawalRequestShares` del nodo ([vBTC](/es/build/vbtc/integration/#sigue-un-retiro)).
:::

### Rutas de escritura

Las rutas `/api/btc/vbtc-v2/…/prepare/` y `…/send/` reenvían las construcciones raw y los envíos firmados a las rutas raw `vbtcapi/VBTC` de un nodo. Reciben campos en snake case (para una solicitud de retiro `sc_identifier`, `requestor_address`, `btc_address`, `amount`, `fee_rate`; para un envío `hash`, `signature`, `public_key`) y responden con la respuesta del nodo y `success`, o con `success: false`, `message` y la respuesta del nodo en `raw`. Los pasos y las comprobaciones son los de la [integración de vBTC sin SDK](/es/build/vbtc/raw-integration/).

| Ruta | Campos obligatorios |
|---|---|
| `POST /api/btc/vbtc-v2/ceremony/prepare/` | `owner_address` |
| `POST /api/btc/vbtc-v2/ceremony/execute/` | `ceremony_id`, `session_id`, `owner_address`, `start_signature`, `start_timestamp`, `share_distribution_signature`, `share_distribution_timestamp` |
| `GET /api/btc/vbtc-v2/ceremony/{ceremony_id}/` | (estado de la ceremonia; un id desconocido responde `500` "Ceremony not found") |
| `POST /api/btc/vbtc-v2/create/prepare/` | `owner_address`, `name`, `description`, `ticker`, `ceremony_id`, `timestamp`, `unique_id`, `owner_signature` |
| `POST /api/btc/vbtc-v2/create/send/` | `hash`, `signature`, `public_key` |
| `POST /api/btc/vbtc-v2/transfer/prepare/` | `sc_identifier`, `from_address`, `to_address`, `amount` |
| `POST /api/btc/vbtc-v2/transfer/send/` | `hash`, `signature`, `public_key` |
| `POST /api/btc/vbtc-v2/withdraw/request/prepare/` | `sc_identifier`, `requestor_address`, `btc_address`, `amount`, `fee_rate` |
| `POST /api/btc/vbtc-v2/withdraw/multi/prepare/` | `requestor_address`, `btc_address`, `total_amount`, `fee_rate`; opcionales `inputs`, `unique_id` |
| `POST /api/btc/vbtc-v2/withdraw/request/send/` | `hash`, `signature`, `public_key` |
| `POST /api/btc/vbtc-v2/withdraw/complete/prepare/` | `sc_identifier`, `withdrawal_request_hash`, `owner_address` |
| `POST /api/btc/vbtc-v2/withdraw/complete/execute/` | `owner_address`, `sc_identifier`, `withdrawal_request_hash`, `session_id`, `start_timestamp`, `start_signature`, `share_distribution_timestamp`, `share_distribution_signature`, `amount`, `btc_destination`; opcional `fee_rate` |
| `GET /api/btc/vbtc-v2/withdraw/complete/status/{job_id}/` | (estado del trabajo de firma; un id desconocido responde `404` "Job not found") |
| `POST /api/btc/vbtc-v2/withdraw/complete/tx/prepare/` | `sc_identifier`, `from_address`, `withdrawal_request_hash`, `btc_transaction_hash`, `amount`, `btc_destination` |
| `POST /api/btc/vbtc-v2/withdraw/complete/tx/send/` | `hash`, `signature`, `public_key` |
| `POST /api/btc/vbtc-v2/withdraw/cancel/prepare/` | `sc_identifier`, `owner_address`, `withdrawal_request_hash` |
| `POST /api/btc/vbtc-v2/withdraw/cancel/send/` | `hash`, `signature`, `public_key` |
| `GET /api/btc/vbtc-v2/ownership-transfer/{sc_identifier}/{to_address}/{locator}/` | (devuelve `{"success": true, "tx_data": [...]}` para una transferencia de propiedad de una bóveda) |
| `GET /api/btc/vbtc-v2/beacon-upload/{sc_identifier}/{to_address}/{signature}/` | (sube los archivos de la bóveda a un beacon para el destinatario) |

Si falta un campo obligatorio, responde `400` con `{"success": false, "message": "<field> required"}`.

Un retiro desde varias bóvedas se construye con `POST /api/btc/vbtc-v2/withdraw/multi/prepare/`, que lo reenvía a `GetRawRequestWithdrawalMultiTxData` del nodo. Recibe `requestor_address`, `btc_address`, `total_amount`, `fee_rate` y, de forma opcional, `inputs`, un `{"sc_identifier", "amount"}` por bóveda (como máximo 10, que sumen `total_amount`). Con `inputs`, el nodo comprueba cada porción contra la bóveda, la comisión mínima por porción y el destino; sin él, el nodo asigna a partir del estado de la cadena, empezando por la bóveda más grande, y responde con la forma de una sola bóveda cuando una bóveda cubre el total. La respuesta lleva el hash que hay que firmar. El hash firmado pasa por `withdraw/request/send/`, como una solicitud de una sola bóveda. Un rechazo responde HTTP 500 con el `message` del nodo, y un campo faltante o un `inputs` mal formado HTTP 400.

El explorador no tiene ninguna ruta para subir la comisión o liberar un retiro; envía esas operaciones a un nodo.

## Descripción de los campos

### Datos de la dirección de Bitcoin
- `balance`: saldo de Bitcoin confirmado en BTC, como string
- `transactions.total`, `utxos.total`: totales que informa el proveedor de datos

## Notas

- vBTC es Bitcoin mantenido uno a uno en bóvedas cuyas claves están repartidas entre validadores (validators) de VerifiedX
- Los montos de vBTC V2 son números JSON en BTC; el endpoint de direcciones de Bitcoin devuelve los montos del proveedor como strings
- Los UTXO (Unspent Transaction Outputs, salidas de transacción no gastadas) se usan para construir transacciones de Bitcoin
- Los endpoints de lectura usan caché para mejorar el rendimiento
- La validación de direcciones de Bitcoin sigue los formatos estándar de direcciones de Bitcoin
