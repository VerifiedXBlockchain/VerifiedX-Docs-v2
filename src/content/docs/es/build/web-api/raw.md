---
sourceHash: 237b2a634989
title: "Web API: Raw"
description: Endpoints de la API del explorador que construyen, comprueban y transmiten transacciones de VFX firmadas en el cliente, sin ejecutar un nodo Core CLI.
sidebar:
  label: "Raw"
  order: 15
---

La API de Raw permite que una aplicación construya, firme y transmita transacciones de VFX sin ejecutar su propio nodo Core CLI. Cada endpoint reenvía la solicitud al endpoint correspondiente del nodo (`/txapi/TXV1/...` en el nodo del explorador) y devuelve la respuesta del nodo sin cambios, así que los cuerpos de solicitud y respuesta son el mismo JSON que acepta el nodo. Las claves privadas nunca salen del cliente: el cliente firma el hash de la transacción localmente y envía la transacción firmada.

Testnet: `https://data-testnet.verifiedx.io/api/raw/` (las direcciones de testnet empiezan con `x`).

## URL base
```
/api/raw/
```

## El objeto de transacción

Todos los endpoints de transacción reciben un cuerpo JSON con un único campo `transaction` que contiene el modelo de transacción del nodo, el mismo objeto descrito en [Creación de transacciones](/es/build/node-api/transaction-creation/):

```json
{
  "transaction": {
    "Hash": null,
    "ToAddress": "RNiQrW3aBUWZhfadqKxPuN46iGaR13ox7P",
    "FromAddress": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
    "Amount": 1.0,
    "Nonce": 38,
    "Fee": 0.0,
    "Timestamp": 1788556164,
    "Data": null,
    "Signature": null,
    "Height": 0,
    "TransactionType": 0,
    "TransactionRating": 1,
    "TransactionStatus": null,
    "UnlockTime": null
  }
}
```

Los campos se completan a medida que avanza el flujo: `Fee` después de la llamada de comisión, `Hash` después de la llamada de hash y `Signature` después de firmar. `Amount` es obligatorio en todas las llamadas. Un cuerpo sin el contenedor `transaction` se rechaza:

```json
HTTP 400
{"transaction": ["This field is required."]}
```

## Flujo

1. `POST /api/raw/timestamp/` para obtener la marca de tiempo.
2. `POST /api/raw/nonce/{address}/` para obtener el siguiente nonce del remitente.
3. Construye la transacción con `Fee: 0` y `Hash: null`, y luego `POST /api/raw/fee/`.
4. Define `Fee` y luego `POST /api/raw/hash/`.
5. Firma el hash localmente (el formato de la firma se describe en [Creación de transacciones](/es/build/node-api/transaction-creation/)); define `Hash` y `Signature`.
6. `POST /api/raw/verify/` (opcional, recomendado).
7. `POST /api/raw/send/`.

## Endpoints

### Obtener la marca de tiempo actual
```http
POST /api/raw/timestamp/
```

Devuelve la marca de tiempo Unix actual en segundos, como un número solo.

**Respuesta:**
```json
1788556164
```

### Obtener el nonce de una dirección
```http
POST /api/raw/nonce/{address}/
```

Devuelve el siguiente nonce de una dirección, como un número solo. No se acepta `GET` (405).

**Parámetros:**
- `address` (string): la dirección de VFX

**Respuesta:**
```json
926
```

### Obtener la comisión de la transacción
```http
POST /api/raw/fee/
```

Cuerpo: el objeto de transacción con `Fee: 0`.

**Respuesta** (de `GetRawTxFee` del nodo):
```json
{"Result": "Success", "Message": "TX Fee Calculated", "Fee": 0.00000454}
```

### Obtener el hash de la transacción
```http
POST /api/raw/hash/
```

Cuerpo: el objeto de transacción con la comisión definida.

**Respuesta** (de `GetTxHash` del nodo):
```json
{"Result": "Success", "Message": "Hash Calculated.", "Hash": "e6eb50ff020bc259a3b7d6920dbc0fae1c4bdf3488fd88515dc4e7930e0e1d10"}
```

### Verificar la transacción
```http
POST /api/raw/verify/
```

Cuerpo: el objeto de transacción completo y firmado. Verifica sin transmitir.

**Respuesta** (de `VerifyRawTransaction` del nodo):
```json
{"Result": "Success", "Message": "Transaction has been verified.", "Hash": "67d97333e5b62abfd6dc8d28a3200677a53b58526aecafd80190b13c5507083e"}
```

Los fallos devuelven `"Result": "Fail"` con el mensaje del nodo, por ejemplo:
```json
{"Result": "Fail", "Message": "Transaction was not verified. Error: The timestamp of this transactions is too old to be sent now."}
```

### Enviar la transacción
```http
POST /api/raw/send/
```

Cuerpo: el objeto de transacción completo y firmado. Lo transmite a la red.

**Respuesta** (de `SendRawTransaction` del nodo):
```json
{"Result": "Success", "Message": "Transaction has been broadcasted.", "Hash": "67d97333e5b62abfd6dc8d28a3200677a53b58526aecafd80190b13c5507083e"}
```

### Validar una firma
```http
POST /api/raw/validate-signature/{message}/{address}/{signature}/
```

Devuelve `true` con HTTP 200 cuando la firma es válida para el mensaje y la dirección, y `false` con HTTP 500 en caso contrario.

### Datos de compilación de un contrato inteligente
```http
POST /api/raw/smart-contract-data/
```

Cuerpo: una carga útil de contrato inteligente como se describe en [Compilación y emisión](/es/build/smart-contracts/compiling-and-minting/) (o en la [integración de vBTC sin SDK](/es/build/vbtc/raw-integration/) para un token vBTC). Devuelve los datos de despliegue compilados por el nodo, que se convierten en el `Data` de la transacción de emisión. Un `Location` de recurso distinto de `default` debe ser una URL que el explorador pueda descargar, por ejemplo una devuelta por la [API de Media](/es/build/web-api/media/); el explorador coloca el archivo donde el nodo pueda leerlo antes de compilar.

### Datos de transferencia, evolución y quema de NFTs
```http
POST /api/raw/nft-transfer-data/{id}/{address}/{locator}/
POST /api/raw/nft-evolve-data/{id}/{address}/{next_state}/
POST /api/raw/nft-burn-data/{id}/{address}/
```

Devuelven la carga útil `Data` del nodo para la transacción correspondiente (de `GetNftTransferData`, `GetNFTEvolveData` y `GetNFTBurnData`). `id` es el identificador del contrato inteligente; `locator` proviene de la solicitud de carga al beacon que se describe más abajo.

### Obtener los localizadores
```http
GET /api/raw/locators/{id}/
```

Devuelve los últimos localizadores de beacon conocidos de un contrato inteligente (de `GetLastKnownLocators` del nodo).

### Solicitud de carga al beacon
```http
GET /api/raw/beacon/upload/{id}/{to_address}/{signature}/
```

Inicia una carga al beacon de los recursos del contrato para una transferencia. `signature` es la firma del propietario actual sobre el identificador del contrato inteligente.

**Respuesta:**
```json
{"success": true, "locator": "..."}
```

Si falla: `{"success": false, "error": "Beacon upload request failed"}` con HTTP 500.

### Recursos del beacon
```http
GET /api/raw/beacon-assets/{id}/{locators}/{address}/{signature}/
```

Le pide al nodo que obtenga los recursos del contrato desde el beacon; luego el explorador importa los archivos multimedia.

**Respuesta:**
```json
{"success": true}
```

### Retirar vBTC (raw)
```http
POST /api/raw/withdraw-vbtc/
```

Cuerpo: la carga útil de retiro prefirmada que acepta el endpoint `btcapi/BTCV2/WithdrawalCoinRawTX` del nodo.

:::caution
Este es un retiro de vBTC V1. vBTC V1 se retiró en el bloque 7,400,500 en mainnet (desde el bloque 1 en la testnet, desde su reinicio de octubre de 2026), y la red rechaza los retiros V1 a partir de esa altura. Para retiros de vBTC V2, consulta la [integración de vBTC sin SDK](/es/build/vbtc/raw-integration/).
:::

**Respuesta:**
```json
{"success": true, "result": { "...": "node response" }}
```

## Notas

- La firma se hace en el cliente. Nunca envíes claves privadas a la API.
- El servicio normaliza `Amount` antes de reenviar las llamadas de hash, verificación y envío, así que `Amount` debe estar presente.
- Los mensajes de error del nodo se devuelven tal cual en `Message`.
- Las transacciones son irreversibles una vez confirmadas. Verifica antes de enviar.
