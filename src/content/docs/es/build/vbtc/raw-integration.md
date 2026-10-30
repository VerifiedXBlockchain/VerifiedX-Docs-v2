---
sourceHash: b4b75741a7f3
title: "Guía de integración de vBTC sin SDK"
description: "Construye, firma y envía transacciones de vBTC V2 fuera del nodo: creación de bóvedas, transferencias, cambios de propiedad y retiros con claves que guarda tu propio firmante."
sidebar:
  order: 2
  label: Integración sin SDK
  attrs:
    class: sidebar-btc
---

Esta guía es para integraciones cuyas claves de VFX nunca llegan al nodo: billeteras web, firmantes de exchanges, HSM. Un nodo construye cada transacción de vBTC sin firmar, el cliente la revisa y firma su hash, y el nodo verifica y transmite la transacción firmada. El nodo no necesita ninguna cuenta, clave ni saldo tuyo.

Describe vBTC V2 en Core 9.0. Lee primero [vBTC](/es/build/vbtc/integration/) para los conceptos (bóvedas (vaults), propietarios y tenedores, bóvedas vigiladas y heredadas, redes y alturas, tipos de transacción): esta página trata lo que cambia cuando firmas fuera del nodo. Todas las rutas están bajo `/vbtcapi/VBTC` en la API del nodo (`http://localhost:7292`, testnet `17292`); envía el encabezado `apitoken` si el nodo lo exige.

## Cómo funcionan las rutas sin firmar

Cada acción que envía una transacción de VFX sigue los mismos cuatro pasos.

### 1. Construye

Llama a la ruta `GetRaw…` de la acción. Comprueba la solicitud con las mismas reglas que aplica la validación de bloques y responde con un rechazo (`"Success": false` y un `Message`) o con la transacción sin firmar:

```json
{
  "Success": true,
  "Hash": "39ff6b9b…a22b",
  "Timestamp": 1792774390,
  "FromAddress": "<signer>",
  "ToAddress": "<signer or recipient>",
  "Amount": 0.0,
  "Fee": 0.00001375,
  "Nonce": 2,
  "TransactionType": "VBTC_V2_WITHDRAWAL_REQUEST",
  "Data": "{\"Function\":\"VBTCWithdrawalRequestMultiV2()\",…}",
  "HashPreimage": "1792774390<signer><signer>0.00.000013752VBTC_V2_WITHDRAWAL_REQUEST{\"Function\":…}",
  "Message": "Sign the Hash field and submit via SendRawRequestWithdrawalTx. …"
}
```

La construcción se conserva en ese nodo durante unos 65 minutos. Envíala al mismo nodo.

### 2. Revisa antes de firmar

Nunca firmes un hash que no hayas revisado. El hash es:

```
Hash = SHA-256( lowercase hex of SHA-256( HashPreimage as UTF-8 ) ), as lowercase hex
HashPreimage = Timestamp + FromAddress + ToAddress + Amount + Fee + Nonce + TransactionType + Data
```

sin separadores, con `TransactionType` como su nombre (por ejemplo `VBTC_V2_WITHDRAWAL_REQUEST`) y `Data` exactamente como se devolvió. Una transferencia de reserva (`xRBX`) añade su `UnlockTime` al final.

1. **Vuelve a calcular el hash.** Donde la ruta devuelve `HashPreimage` (creación de bóvedas, transferencia desde varias bóvedas, retiro desde varias bóvedas), calcula su hash y compáralo con `Hash`, y comprueba que la preimagen empiece con `Timestamp` y `FromAddress` y contenga `Data` tal cual. Los constructores de transferencia simple, subida de comisión y liberación devuelven todos los campos de la preimagen. Los constructores de solicitud de retiro simple y de cancelación omiten `ToAddress` y `Amount`, que siempre son la dirección del remitente y `0.0`. `Amount` y `Fee` entran en la preimagen como el texto decimal del nodo (`0.0` para cero), que un analizador JSON puede no reproducir, así que compara campo por campo si no puedes reconstruir el texto con exactitud.
2. **Lee `Data`** y comprueba que diga lo que pediste: la `Function` de la acción, la bóveda (`ContractUID`), el monto o la asignación, la dirección de Bitcoin y la tasa de comisión. Las secciones de abajo indican qué revisar en cada acción.
3. **Comprueba que `FromAddress`** sea la dirección cuya clave vas a usar, y que `Fee` (en VFX) sea lo que esperas.

### 3. Firma

Firma `Hash` (la cadena hexadecimal, como texto UTF-8) con la clave del remitente, ECDSA sobre secp256k1, exactamente igual que cualquier transacción de VFX (consulta [Creación de transacciones](/es/build/node-api/transaction-creation/)). La firma es la firma DER en Base64, un `.` y la clave pública (64 bytes, sin el prefijo `04`) en Base58.

### 4. Envía

Haz un POST a la ruta `SendRaw…` correspondiente:

```json
{
  "Hash": "<the Hash the build returned>",
  "Signature": "<Base64 DER signature>.<Base58 public key>",
  "PublicKey": "<the signer's public key>"
}
```

El nodo ejecuta su comprobación completa de transacciones sobre la construcción firmada y luego la transmite:

- `{"Success": true, "Hash": "…", "Message": "Withdrawal request transaction broadcast successfully."}`
- Una firma incorrecta: `Transaction verification failed: Signature Failed to verify.` La construcción se conserva, así que vuelve a firmar y reenvía el mismo hash.
- Un hash desconocido o ya usado: `No pending transaction found for hash …. Call GetRawRequestWithdrawalTxData first.` o `Transaction … was already submitted.`
- Con las demás transacciones del remitente todavía esperando a minarse, gastaría de más: `Not broadcast: together with this address's transactions still waiting to be mined it would overspend (…). Submit it again once they are mined.`
- `Hash, Signature, and PublicKey are required`.

Las rutas `SendRaw…` de solicitud de retiro, cancelación, finalización, subida de comisión y liberación solo aceptan su propio tipo de construcción, y una subida de comisión no se puede enviar como liberación ni al revés. Las rutas de transferencia y de creación de bóvedas no comprueban el tipo, así que envía siempre cada construcción por su ruta correspondiente. Envía las construcciones de vBTC por estas rutas, no por las rutas sin firmar generales de `txapi/TXV1`.

Los constructores toman el siguiente nonce del remitente del estado de la cadena al construir. Construye y envía una transacción a la vez por dirección, y construye la siguiente cuando la anterior esté en un bloque, salvo que la ruta te permita pasar `Nonce`.

## Consultar el estado sin billetera en el nodo

Las rutas de lectura responden a partir del estado de la cadena, así que cualquier nodo responde para cualquier dirección o bóveda:

- Saldos: `GET GetAllVBTCBalances/{address}`, `GET GetVBTCBalance/{address}/{scUID}`.
- Una bóveda: `GET GetContractDetails/{scUID}`, `GET GetVaultBitcoin/{scUID}`, `GET GetMPCDepositAddress/{scUID}`.
- Un retiro: `GET GetWithdrawalPin/{scUID}/{withdrawalRequestHash}` y, para cada porción de una solicitud, `GET GetWithdrawalRequestShares/{withdrawalRequestHash}`.
- La red: `GET GetBitcoinAttestationStatus`.

Las respuestas se describen en la página [vBTC](/es/build/vbtc/integration/#consultar-saldos-y-bóvedas).

`POST PrepareCompleteWithdrawalRaw` también le indica a un cliente sin billetera en el nodo en qué punto está un retiro. En una bóveda vigilada no prepara nada y devuelve la respuesta de finalización (`Attested: true`, `Status`, `Paid`, `NothingToDo`, `NotMinedYet`, `PinnedBTCTransactionHash`, `BTCTransactionHash` y el objeto `Withdrawal`); en una bóveda heredada prepara una sesión de firma FROST (consulta [Bóvedas heredadas](#bóvedas-heredadas)). Lee `Attested` para distinguir los dos casos.

```json
{ "OwnerAddress": "<requester>", "SmartContractUID": "<contract UID>", "WithdrawalRequestHash": "<request hash>" }
```

## Crea una bóveda

Su propietario crea una bóveda en dos partes: una ceremonia de claves entre los validadores (validators), autorizada con las firmas del propietario, y la transacción de creación (tipo 25).

1. **Prepara la ceremonia.** `POST PrepareMPCCeremonyRaw` con `{"OwnerAddress": "<owner>"}`. El nodo comprueba que haya suficientes validadores alcanzables y devuelve los mensajes que hay que firmar:

   ```json
   {
     "Success": true,
     "CeremonyId": "<32 hex>:<unix time>",
     "SessionId": "<guid>",
     "OwnerAddress": "<owner>",
     "ValidatorCount": 13,
     "Threshold": 51,
     "StartMessage": "<sessionId>.<owner>.<timestamp>",
     "StartTimestamp": 1792760000,
     "ShareDistributionMessage": "<sessionId>.<owner>.<timestamp + 1>",
     "ShareDistributionTimestamp": 1792760001,
     "RetrySessions": [ { "SessionId": "…", "StartMessage": "…", "StartTimestamp": 0, "ShareDistributionMessage": "…", "ShareDistributionTimestamp": 0 } ]
   }
   ```

2. **Firma** `StartMessage` y `ShareDistributionMessage` con la clave del propietario (el mismo formato de firma). Comprueba que cada mensaje nombre tu dirección de propietario. Firma también los mensajes de `RetrySessions`: permiten que la ceremonia se vuelva a ejecutar sin un validador que la haga fallar. Sin ellos se ejecuta una sola vez.
3. **Ejecútala.** `POST ExecuteMPCCeremonyRaw`:

   ```json
   {
     "OwnerAddress": "<owner>",
     "CeremonyId": "<ceremony id>",
     "SessionId": "<session id>",
     "StartTimestamp": 1792760000,
     "StartSignature": "<signature>",
     "ShareDistributionTimestamp": 1792760001,
     "ShareDistributionSignature": "<signature>",
     "RetrySessions": [ { "SessionId": "…", "StartTimestamp": 0, "StartSignature": "…", "ShareDistributionTimestamp": 0, "ShareDistributionSignature": "…" } ]
   }
   ```

   Errores: `Invalid start signature`, `Invalid share distribution signature`, `Invalid retry session signature (…)`, `Active ceremony already in progress.`
4. **Espera.** Consulta `GET GetCeremonyStatus/{ceremonyId}` hasta que `Status` sea `Completed` (o `Failed`, con `ErrorMessage`). Usa el `ContractUID` de esa respuesta.
5. **Construye la creación.** `POST GetRawCreateContractTxData` en el mismo nodo (el resultado de la ceremonia se guarda en la memoria de ese nodo):

   ```json
   { "OwnerAddress": "<owner>", "CeremonyId": "<ceremony id>", "Name": "Treasury vault", "Description": "", "Ticker": "vBTC" }
   ```

   La respuesta tiene `Hash`, `HashPreimage`, `SmartContractUID`, `DepositAddress`, `DepositAddressConfirmed: false` y los campos de la transacción. **Revisa:** `TransactionType` es `VBTC_V2_CONTRACT_CREATE`, `FromAddress` y `ToAddress` son el propietario, `Amount` es 0 y `Data` es `[{"Function":"Mint()","ContractUID":"<the ceremony's contract UID>",…}]`.
6. **Firma y envía** con `POST SendRawCreateContractTx`: `vBTC contract creation transaction broadcast successfully.`
7. **Obtén la dirección de depósito** con `GET GetMPCDepositAddress/{scUID}` cuando la creación esté en un bloque. No deposites antes de que esta ruta devuelva la dirección.

`CreateVBTCContractRaw` no es una ruta para firmantes externos: verifica una solicitud firmada, pero luego firma la creación con la cuenta del propietario en el nodo.

## Transfiere vBTC

### Desde una bóveda

1. `POST GetRawTransferVBTCData`:

   ```json
   { "SmartContractUID": "<contract UID>", "FromAddress": "<sender>", "ToAddress": "<recipient>", "Amount": 0.00003 }
   ```

2. **Revisa:** `TransactionType` es `VBTC_V2_TRANSFER`, `Amount` (el monto en VFX) es 0 y `Data` es `{"Function":"TransferVBTCV2()","ContractUID":…,"FromAddress":<sender>,"ToAddress":<recipient>,"Amount":<vBTC amount>}`. Para un remitente de reserva (`xRBX`), `IsReserveSend` es `true` y `UnlockTime` forma parte del hash: la transferencia queda retenida durante 24 horas y se puede revertir hasta entonces.
3. Firma y envía con `POST SendRawTransferVBTCTx`.

Rechazos al construir: `Insufficient balance. Available: …, Requested: …`, `Reserve accounts cannot send vBTC to another Reserve Account.`

### Desde varias bóvedas (transferencia en bloque)

1. `POST GetRawTransferVBTCMultiData`:

   ```json
   {
     "FromAddress": "<sender>",
     "ToAddress": "<recipient>",
     "TotalAmount": 0.00012,
     "Inputs": [ { "SCUID": "<vault A UID>", "Amount": 0.00008 }, { "SCUID": "<vault B UID>", "Amount": 0.00004 } ],
     "Nonce": null
   }
   ```

   Pasa `Inputs` tú mismo cuando puedas: el nodo los comprueba con el estado de la cadena. Sin `Inputs`, el nodo planifica el reparto a partir de las bóvedas que conoce. `Nonce` es opcional; sin él, el nodo usa el siguiente.
2. **Revisa:** el hash de `HashPreimage` coincide con `Hash`; `Function` es `TransferVBTCMultiV2()` (o `TransferVBTCV2()` cuando una sola bóveda cubre el total, `IsMultiContract: false`); la suma de `Allocations` es `TotalAmount`; `Data` nombra a tu destinatario.
3. Firma y envía con `POST SendRawTransferVBTCTx`.

Como máximo 25 bóvedas por transferencia, montos con un máximo de 8 decimales, sin remitentes de reserva y sin destinatarios blindados.

## Transfiere la propiedad

La propiedad se transfiere con una transferencia de contrato inteligente (tipo 18, `TKNZ_TX`) que se construye con las rutas generales de transacciones sin firmar.

1. `GET /vbtcapi/VBTC/GetVBTCOwnershipTransferData/{scUID}/{toAddress}/NA` devuelve los `Data` de la transacción: `[{"Function":"Transfer()","ContractUID":…,"ToAddress":<new owner>,"Data":…,"Locators":"NA","MD5List":"NA"}]`. Mientras la red use la imagen predeterminada de vBTC, no hace falta subir nada a un beacon y el localizador es `NA`.
2. Construye una transacción con `TransactionType` 18, `FromAddress` el propietario actual, `ToAddress` el nuevo propietario, `Amount` 0 y esos `Data`, y luego usa `txapi/TXV1/GetRawTxFee`, `GetTxHash`, firma, `VerifyRawTransaction` y `SendRawTransaction` como en [Creación de transacciones](/es/build/node-api/transaction-creation/).

El nuevo propietario se queda con el vBTC de la bóveda que no tiene ningún tenedor.

## Retira a Bitcoin

### Solicitud

1. `POST GetRawRequestWithdrawalTxData`:

   ```json
   {
     "SmartContractUID": "<contract UID>",
     "RequestorAddress": "<holder>",
     "BTCAddress": "bc1q…",
     "Amount": 0.00002,
     "FeeRate": 3,
     "UniqueId": null
   }
   ```

2. **Revisa antes de firmar:** `TransactionType` es `VBTC_V2_WITHDRAWAL_REQUEST`; `FromAddress` es el tenedor; `Data` es `{"Function":"VBTCWithdrawalRequest()","ContractUID":<vault>,"RequestorAddress":<holder>,"BTCAddress":<your destination, exactly>,"Amount":<amount>,"FeeRate":<rate>,"UniqueId":…}`. Valida tú mismo la dirección de Bitcoin para la red correcta. Calcula lo que recibirá el destino: `Amount` menos `FeeRate × 154` sats (más si la bóveda necesita varias monedas), lo que debe dejar al menos 546 sats.
3. Firma y envía con `POST SendRawRequestWithdrawalTx`. A partir de ahora, el hash de la transacción es el `RequestHash` del retiro.

Rechazos al construir: `Fee rate must be greater than zero`, el mensaje del mínimo de comisión (`… cannot pay a Bitcoin withdrawal at … sat/vB. …`), `Insufficient balance. Available: …, Requested: …` y, al enviar, los rechazos de consenso que se listan en la página [vBTC](/es/build/vbtc/integration/#errores-que-puedes-encontrar-en-un-retiro) (dirección que no es de esta red, tasa de comisión mayor a 5,000, menos de 546 sats restantes, una bóveda congelada).

`RequestWithdrawalRaw` no forma parte de este flujo: solo registra una solicitud en ese nodo y no pone nada en la cadena.

### Síguela

En una bóveda vigilada no hay que enviar nada más. En el bloque que mina la solicitud, la cadena fija la transacción de Bitcoin que la paga; los firmantes de la bóveda la firman y la transmiten; se completa cuando Bitcoin la confirma. Síguela con `GET GetWithdrawalPin/{scUID}/{requestHash}` (o `PrepareCompleteWithdrawalRaw`): `State` pasa de `Waiting` o `Pinned` a `Settled`, o a `Cancelled`, `Expired`, `Void` o `Released` con el vBTC reembolsado. Hasta que se mina la solicitud, la respuesta es `Success: false, Attested: true, Withdrawal: null`; vuelve a preguntar después del siguiente bloque.

El nodo informa la fijación de un retiro en el mismo bloque que la solicitud. La API del explorador solo la muestra después de un informe de Bitcoin posterior, así que sigue los retiros a través del nodo.

### Cancela mientras espera

Mientras `State` es `Waiting` (`CanCancel: true`), el solicitante puede cancelar de inmediato, sin votación:

1. `POST GetRawCancelWithdrawalTxData` con `{"SmartContractUID": "<vault>", "RequestorAddress": "<requester>", "WithdrawalRequestHash": "<request hash>"}`.
2. **Revisa:** `TransactionType` es `VBTC_V2_WITHDRAWAL_CANCEL`, `Data` es `{"Function":"VBTCWithdrawalCancel()","ContractUID":<vault>,"WithdrawalRequestHash":<request hash>}` y `Attested: true` (el mensaje dice que no se hace votación).
3. Firma y envía con `POST SendRawCancelWithdrawalTx`. Cuando se mina, el retiro se cierra como `Cancelled` y el vBTC vuelve.

El constructor se niega antes de que firmes cuando la cancelación no se puede aceptar: `Only the original requestor can cancel.`, `Cannot cancel an already completed withdrawal.` y, una vez fijado el retiro, `This withdrawal's Bitcoin transaction is fixed and may already be signed, so it cannot be cancelled. It completes when Bitcoin confirms it.` (con el objeto `Withdrawal`). `CancelWithdrawalRaw` no cancela nada: responde con el mensaje de usar estas rutas.

### Sube la comisión

Cuando un retiro fijado no se está confirmando (`CanRaiseFee: true`):

1. `POST GetRawBumpWithdrawalFeeTxData`:

   ```json
   { "SmartContractUID": "<vault>", "RequestorAddress": "<requester>", "WithdrawalRequestHash": "<request hash>", "FeeRate": 8 }
   ```

2. **Revisa:** `TransactionType` es `VBTC_V2_COIN_PIN` (`TransactionTypeId` 44), `FromAddress` y `ToAddress` son el solicitante, `Amount` es 0 y `Data` es `{"Function":"VBTCWithdrawalFeeBump()","ContractUID":<vault>,"WithdrawalRequestHash":<request hash>,"FeeRate":<new rate>}`. La nueva tasa debe ser mayor que el `FeeRate` que paga ahora el retiro. La comisión más alta sale del retiro: el destino recibe menos.
3. Firma y envía con `POST SendRawBumpWithdrawalFeeTx`. Cuando se mina, la cadena fija un reemplazo que gasta las mismas monedas; síguelo con `GetWithdrawalPin`.

### Liberación

Cuando un retiro fijado no se está confirmando y el solicitante prefiere recuperar el vBTC (`CanRelease: true`):

1. `POST GetRawReleaseWithdrawalTxData` con el mismo cuerpo que una subida de comisión.
2. **Revisa:** lo mismo que en una subida de comisión, con `Function` `VBTCWithdrawalRelease()`. La comisión de Bitcoin de la liberación sale del reembolso.
3. Firma y envía con `POST SendRawReleaseWithdrawalTx`. Cuando se mina, la cadena fija una transacción de Bitcoin que devuelve las monedas a la bóveda; cuando Bitcoin la muestra, el retiro se cierra como `Released` y el vBTC se reembolsa menos esa comisión. Si uno de los pagos del retiro se confirma primero, en cambio se paga.

Ambos constructores comprueban la solicitud con la regla que aplica la validación de bloques y la rechazan con el motivo y el objeto `Withdrawal`, por ejemplo `The new fee rate must be above the 3 sat/vB the withdrawal's newest Bitcoin transaction pays.` o `This withdrawal has no Bitcoin transaction yet. Cancel it and request again with the fee rate you want.` Una subida de comisión enviada a la ruta de liberación, o al revés, se rechaza: `This transaction is a fee bump; submit it with SendRawBumpWithdrawalFeeTx.`

## Retiro desde varias bóvedas

Así es como un exchange o cualquier tenedor con vBTC en varias bóvedas retira un monto total a una dirección de Bitcoin. Una transacción de VFX (tipo 27, `VBTCWithdrawalRequestMultiV2()`) abre el retiro; cada bóveda que incluye es una **porción**, pagada con su propia transacción de Bitcoin desde esa bóveda. El solicitante paga una comisión de minero por porción, que sale de esa porción, y las porciones se liquidan por separado, así que un retiro puede quedar pagado en parte. Un total que cubre una sola bóveda se construye como un retiro simple normal. Como máximo 10 bóvedas por solicitud.

### Construcción

`POST GetRawRequestWithdrawalMultiTxData`:

```json
{
  "RequestorAddress": "<holder>",
  "BTCAddress": "bc1q…",
  "TotalAmount": 0.00006,
  "FeeRate": 2,
  "Inputs": [
    { "SCUID": "<vault A UID>", "Amount": 0.00003 },
    { "SCUID": "<vault B UID>", "Amount": 0.00003 }
  ],
  "UniqueId": null
}
```

Pasa `Inputs` (cada bóveda y el monto que se toma de ella) siempre que puedas: el nodo los comprueba con el estado de la cadena, así que cualquier nodo puede construir para cualquier tenedor. Sin `Inputs`, el nodo asigna el total por su cuenta, empezando por el mayor saldo disponible, entre las bóvedas que puede ver.

```json
{
  "Success": true,
  "Hash": "39ff6b9b…a22b",
  "Timestamp": 1792774390,
  "FromAddress": "<holder>",
  "Fee": 0.00001375,
  "Nonce": 2,
  "TransactionType": "VBTC_V2_WITHDRAWAL_REQUEST",
  "Data": "{\"Function\":\"VBTCWithdrawalRequestMultiV2()\",\"RequestorAddress\":\"<holder>\",\"BTCAddress\":\"bc1q…\",\"TotalAmount\":0.00006,\"FeeRate\":2,\"Inputs\":[{\"SCUID\":\"<vault A UID>\",\"Amount\":0.00003},{\"SCUID\":\"<vault B UID>\",\"Amount\":0.00003}],\"UniqueId\":null}",
  "HashPreimage": "…",
  "Function": "VBTCWithdrawalRequestMultiV2()",
  "IsMultiContract": true,
  "Allocations": [ { "SCUID": "<vault A UID>", "Amount": 0.00003 }, { "SCUID": "<vault B UID>", "Amount": 0.00003 } ],
  "BitcoinTransactions": 2,
  "TotalAmount": 0.00006,
  "Destination": "bc1q…",
  "Message": "Sign the Hash field and submit via SendRawRequestWithdrawalTx. …"
}
```

En una bóveda vigilada, ignora la parte de `Message` que te pide completar cada contrato: los firmantes de la bóveda pagan todas las porciones.

### Revisa antes de firmar

1. **Hash.** El SHA-256 del hexadecimal en minúsculas de SHA-256(`HashPreimage`) es igual a `Hash`. La preimagen empieza con `Timestamp` y la dirección del tenedor (como `FromAddress` y `ToAddress`) y termina con `Data` exactamente como se devolvió.
2. **Asignación.** `Data.Inputs` (y `Allocations`) nombran las bóvedas y los montos que querías, cada bóveda una sola vez, y suman `TotalAmount`.
3. **Destino.** `Data.BTCAddress` es exactamente tu destino, válido para la red. Compruébalo tú mismo antes de construir.
4. **Comisiones.** `Data.FeeRate` es la tasa que querías. Cada porción paga `FeeRate × 154` sats o más de su propio monto, así que el destino recibe `TotalAmount` menos `BitcoinTransactions` comisiones, y cada porción debe dejar al menos 546 sats después de su comisión. `Fee` es la comisión de VFX de la solicitud.
5. **Firmante.** `FromAddress` es el tenedor cuya clave estás usando.

### Firma y envía

Firma `Hash` con la clave del tenedor y envíalo con `POST SendRawRequestWithdrawalTx`, igual que un retiro simple. En testnet, una solicitud de dos porciones a 2 sat/vB se minó en el bloque siguiente, cada porción se fijó en ese bloque a su propia transacción de Bitcoin (2,692 sats al destino, 308 sats de comisión cada una), y ambas se cerraron pagadas cuando Bitcoin las confirmó.

### Sigue cada porción

- `GET GetWithdrawalRequestShares/{requestHash}` lista las porciones una vez que se mina la solicitud: cada bóveda, monto, `Status`, `IsCompleted`, `Paid`, `Refunded` y `BTCTxHash`, y los totales `PaidCount`, `RefundedCount`, `AllPaid`.
- `GET GetWithdrawalPin/{shareVaultUID}/{requestHash}` da el estado de una porción, su transacción de Bitcoin fijada y qué se puede hacer con ella. Una porción pasa por los mismos estados que un retiro simple.

Para subir la comisión, liberar o cancelar una porción, usa las rutas anteriores con el UID de la bóveda de esa porción como `SmartContractUID` y el hash de la solicitud como `WithdrawalRequestHash`. Cada una es una transacción para una porción; las demás porciones no se tocan.

No necesitas `CompleteWithdrawalMulti` ni `PrepareCompleteWithdrawalRaw`/`ExecuteCompleteWithdrawalRaw` para porciones en bóvedas vigiladas: no envían nada para ellas.

### Rechazos al construir

| Situación | Mensaje |
| --- | --- |
| Los `Inputs` no suman el total | `TotalAmount must equal the sum of input amounts for multi-contract vBTC withdrawal.` |
| Una bóveda listada dos veces | `Multi-contract vBTC withdrawal inputs must reference distinct contracts.` |
| Una entrada mayor que el saldo del tenedor en esa bóveda | `Insufficient vBTC balance for withdrawal input …. Available: …, Requested: …` |
| Sin `Inputs` y sin saldo suficiente entre las bóvedas | `Insufficient combined vBTC balance. Available: …, Requested: …` |
| El tenedor no tiene nada | `No spendable vBTC balance found for this address.` |
| Más de 8 decimales | `TotalAmount cannot have more than 8 decimal places` |
| Más de 10 bóvedas | `Multi-contract vBTC withdrawal exceeds the maximum of 10 inputs.` |
| Una porción demasiado pequeña para su comisión | `Multi-contract vBTC withdrawal input …: … BTC cannot pay a Bitcoin withdrawal at … sat/vB. …` |
| Tasa de comisión 0 | `FeeRate must be greater than zero` |
| No es una dirección de Bitcoin de esta red | `The withdrawal's Bitcoin address is not an address on this network: …` |
| Un tenedor de reserva | `Reserve accounts cannot request BTC withdrawals. Move the vBTC to a normal VFX address first.` |

## Bóvedas heredadas

En una bóveda creada antes de la altura de registro de la certificación, hasta la altura de aplicación, su solicitante completa el retiro después de que se mina la solicitud:

1. `POST PrepareCompleteWithdrawalRaw` (`OwnerAddress` = el solicitante, `SmartContractUID`, `WithdrawalRequestHash`) devuelve `SessionId`, `StartMessage`, `ShareDistributionMessage`, sus marcas de tiempo, `InputCount` y `StartMessages` (uno por cada entrada de Bitcoin), además del `Amount`, el `BTCDestination` y el `FeeRate` del retiro para confirmar. `Unpayable: true` significa que la solicitud nunca puede pagarse a su tasa de comisión: cancélala.
2. Firma cada mensaje de `StartMessages` y `ShareDistributionMessage`, y haz `POST ExecuteCompleteWithdrawalRaw` con `StartSignature`, `ShareDistributionSignature`, `StartSignatures` y los campos confirmados. Los validadores firman la transacción de Bitcoin y el nodo devuelve `SignedBTCTxHex`.
3. Transmite `SignedBTCTxHex` a Bitcoin. Si `CompleteAfterConfirmation` es `true`, espera su primera confirmación.
4. Registra la finalización: `POST GetRawCompleteWithdrawalTxData` (`SmartContractUID`, `FromAddress`, `WithdrawalRequestHash`, `BTCTransactionHash`, `Amount`, `BTCDestination`), firma y haz `POST SendRawCompleteWithdrawalTx` (tipo 28, sin comisión).

Una cancelación en una bóveda heredada es la misma transacción de tipo 29, después de la cual votan los validadores de la bóveda (tipo 30). Desde la altura de aplicación, una bóveda heredada queda congelada: se rechazan las transferencias, los retiros y las cancelaciones en ella, y los tipos 28 y 30 se rechazan para todas las bóvedas.

## vBTC V1 está retirado

El flujo V1 sin firmar (`btcapi/BTCV2/GetTokenizationDetails`, `TokenizeBitcoin`, `WithdrawalCoinRawTX`, tipos de transacción 17 a 21) se retiró en el bloque 7,400,500 de mainnet. La red ya no acepta tokens, transferencias ni retiros de V1, y los saldos de V1 quedan congelados tal como están.
