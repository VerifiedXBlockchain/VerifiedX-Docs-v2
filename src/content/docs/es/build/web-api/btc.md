---
sourceHash: c53fd1a620fe
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

Devuelve el saldo, las transacciones y los UTXO de una dirección de Bitcoin.

**Parámetros:**
- `address` (string): la dirección de Bitcoin
- `offset` (parámetro de consulta): desplazamiento de la paginación (predeterminado: 0)

**Respuesta:**
```json
{
  "balance": {
    "confirmed": 50000000,
    "unconfirmed": 0,
    "total": 50000000
  },
  "transactions": {
    "total": 25,
    "results": [
      {
        "txid": "abc123...",
        "confirmations": 6,
        "time": 1640995200,
        "inputs": [...],
        "outputs": [...]
      }
    ]
  },
  "utxos": {
    "total": 3,
    "results": [
      {
        "txid": "def456...",
        "vout": 0,
        "value": 25000000,
        "confirmations": 10
      }
    ]
  }
}
```

### Listar todos los tokens VBTC
```http
GET /api/btc/vbtc/
```

Devuelve una lista de todos los tokens VBTC del sistema.

**Respuesta:**
```json
{
  "count": 100,
  "results": [
    {
      "id": 1,
      "smart_contract_uid": "SC123...",
      "vfx_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "btc_amount": "0.001",
      "status": "active",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Obtener los tokens VBTC de una dirección de VFX
```http
GET /api/btc/vbtc/{vfx_address}/
```

Devuelve los tokens VBTC asociados a una dirección de VFX específica.

**Parámetros:**
- `vfx_address` (string): la dirección de la blockchain de VFX

**Respuesta:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "smart_contract_uid": "SC123...",
      "vfx_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "btc_amount": "0.001",
      "btc_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "status": "active",
      "transfers": [
        {
          "from_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
          "to_address": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
          "amount": "0.0005",
          "timestamp": "2024-01-01T12:00:00Z"
        }
      ]
    }
  ]
}
```

### Obtener los detalles de un token VBTC
```http
GET /api/btc/vbtc/detail/{sc_identifier}/
```

Devuelve la información detallada de un token VBTC específico.

**Parámetros:**
- `sc_identifier` (string): el identificador del contrato inteligente

**Respuesta:**
```json
{
  "id": 1,
  "smart_contract_uid": "SC123...",
  "vfx_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "btc_amount": "0.001",
  "btc_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "status": "active",
  "metadata": {
    "name": "VBTC Token #1",
    "description": "VFX Bitcoin Token",
    "image": "data:image/png;base64,..."
  },
  "transfers": [],
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Obtener los datos de compilación de VBTC
```http
GET /api/btc/vbtc-compile-data/{address}/
```

Devuelve los datos de compilación para crear un token VBTC según la dirección.

**Parámetros:**
- `address` (string): la dirección de VFX

**Respuesta:**
```json
{
  "success": true,
  "compile_data": {
    "smart_contract_code": "...",
    "constructor_args": "...",
    "compilation_artifacts": "..."
  }
}
```

### Obtener los datos de la imagen predeterminada de VBTC
```http
GET /api/btc/vbtc-image-data/
```

Devuelve los datos de imagen en base64 predeterminados de los tokens VBTC.

**Respuesta:**
```json
{
  "image_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## vBTC V2

Las rutas `/api/btc/vbtc/` anteriores listan los tokens de vBTC V1, que se retiraron en el bloque 7,400,500 en mainnet. Las bóvedas de vBTC V2 están en `/api/btc/vbtc-v2/`. El explorador las indexa desde la cadena; para el estado en vivo de un retiro, consulta el nodo (ver más abajo).

:::note
El explorador de testnet ya ofrece estas rutas y campos, y el explorador de mainnet los ofrece desde la versión 9.0.
:::

### Alturas de certificación
```http
GET /api/btc/vbtc-v2/heights/
```

```json
{ "record_height": 400, "enforcement_height": 401, "latest_block_height": 4217 }
```

Desde `record_height`, una bóveda nueva es vigilada; desde `enforcement_height`, las bóvedas anteriores quedan congeladas. Una altura es `null` mientras Core no la haya definido.

### Listar bóvedas
```http
GET /api/btc/vbtc-v2/
GET /api/btc/vbtc-v2/{vfx_address}/
```

Todas las bóvedas, o las que una dirección posee o en las que ha enviado o recibido vBTC, como `{"results": [...]}`.

### Detalles de una bóveda
```http
GET /api/btc/vbtc-v2/detail/{sc_identifier}/
```

```json
{
  "sc_identifier": "<contract UID>",
  "name": "Treasury vault",
  "description": "",
  "owner_address": "<owner>",
  "pending_owner_address": null,
  "is_watched": true,
  "image_url": "…",
  "deposit_address": "bc1p…",
  "frost_group_public_key": "03…",
  "required_threshold": 51,
  "proof_block_height": 2839,
  "global_balance": "0.0001",
  "total_received": "…",
  "total_sent": "…",
  "tx_count": 1,
  "is_pending_withdrawal": false,
  "addresses": { "<owner>": "0.00007", "<holder>": "0.00003" },
  "available_balances": { "<owner>": "0.00007", "<holder>": "0.00003" },
  "nft": { "…": "…" },
  "withdrawal_requests": [ ],
  "created_at": "2026-10-23T13:01:20Z"
}
```

- `is_watched`: la bóveda se creó a partir de la altura de registro y la cadena registra su Bitcoin. El respaldo de una bóveda vigilada es `global_balance`, leído de la cadena; `total_received` y `total_sent` provienen de proveedores de Bitcoin y solo se mantienen actualizados para las bóvedas que la cadena no vigila.
- `addresses` es el vBTC bruto de cada dirección en la bóveda; `available_balances` descuenta sus retiros abiertos y es la cifra con la que una billetera debe calcular los envíos.
- `pending_owner_address`: la transferencia de propiedad de un propietario de reserva, que entra en vigor al desbloquearse.

### Transferencias y retiros de una bóveda
```http
GET /api/btc/vbtc-v2/transfers/{sc_identifier}/
GET /api/btc/vbtc-v2/withdrawals/{sc_identifier}/
```

Una fila de retiro (una por cada porción de bóveda de una solicitud):

```json
{
  "requestor_address": "<requester>",
  "btc_address": "bc1q…",
  "amount": "0.00002",
  "fee_rate": 3,
  "btc_transaction_hash": "c314d462…",
  "status": "completed",
  "request_transaction_hash": "<request hash>",
  "completion_transaction_hash": null,
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

Las rutas `/api/btc/vbtc-v2/…/prepare/` y `…/send/` reenvían las construcciones raw y los envíos firmados a las rutas raw `vbtcapi/VBTC` de un nodo. Reciben campos en snake case (para una solicitud de retiro `sc_identifier`, `requestor_address`, `btc_address`, `amount`, `fee_rate`; para un envío `hash`, `signature`, `public_key`) y responden con la respuesta del nodo y `success`, o con `success: false`, `message` y la respuesta del nodo en `raw`. Los pasos y las comprobaciones son los de la [integración de vBTC sin SDK](/es/build/vbtc/raw-integration/).

Un retiro desde varias bóvedas se construye con `POST /api/btc/vbtc-v2/withdraw/multi/prepare/`, que lo reenvía a `GetRawRequestWithdrawalMultiTxData` del nodo. Recibe `requestor_address`, `btc_address`, `total_amount`, `fee_rate` e `inputs`, un `{"sc_identifier", "amount"}` por bóveda (como máximo 10, que sumen `total_amount`). El nodo comprueba cada porción contra la bóveda, la comisión mínima por porción y el destino antes de responder con el hash que hay que firmar. El hash firmado pasa por `withdraw/request/send/`, como una solicitud de una sola bóveda. Un rechazo responde HTTP 500 con el `message` del nodo, y un campo faltante HTTP 400.

El explorador no tiene ninguna ruta para subir la comisión o liberar un retiro; envía esas operaciones a un nodo.

## Descripción de los campos

### Datos de la dirección de Bitcoin
- `balance.confirmed`: saldo de Bitcoin confirmado, en satoshis
- `balance.unconfirmed`: saldo de Bitcoin sin confirmar, en satoshis
- `balance.total`: saldo total de Bitcoin (confirmado + sin confirmar)

### Datos del token VBTC
- `smart_contract_uid`: identificador único del contrato inteligente de VBTC
- `vfx_address`: dirección de la blockchain de VFX asociada
- `btc_amount`: monto de Bitcoin que representa este token (en BTC)
- `btc_address`: dirección de Bitcoin original usada para crear el token
- `status`: estado del token (active, burned, etc.)
- `transfers`: arreglo de registros de transferencias de este token

## Notas

- vBTC es Bitcoin mantenido uno a uno en bóvedas cuyas claves están repartidas entre validadores (validators) de VerifiedX
- Los montos de Bitcoin normalmente se representan como strings para conservar la precisión
- Los UTXO (Unspent Transaction Outputs, salidas de transacción no gastadas) se usan para construir transacciones de Bitcoin
- Todos los endpoints usan caché para mejorar el rendimiento
- La validación de direcciones de Bitcoin sigue los formatos estándar de direcciones de Bitcoin
