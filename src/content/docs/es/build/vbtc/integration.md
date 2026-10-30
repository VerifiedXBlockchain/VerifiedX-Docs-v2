---
sourceHash: 5a12527df5d1
title: "vBTC"
description: Crea bóvedas de vBTC V2, deposita, transfiere, retira a Bitcoin y lleva vBTC a Base por puente con la API del nodo cuando la billetera del nodo tiene las claves.
sidebar:
  label: Integración
  order: 1
  attrs:
    class: sidebar-btc
---

Esta página trata vBTC V2 a través de la API del nodo cuando la billetera del nodo tiene las claves: el nodo construye, firma y transmite cada transacción por ti. Si tus claves se quedan fuera del nodo (una billetera web, un firmante de un exchange, un HSM), consulta [Integración de vBTC sin SDK](/es/build/vbtc/raw-integration/), que usa las mismas bóvedas y las mismas reglas.

Describe Core 9.0. Para ver la lista completa de rutas del nodo, consulta [Detalles de la API del CLI](/es/build/node-api/details/#15-api-de-vbtc-v2-novedades-de-90).

## Conceptos

- **Bóveda (vault).** Un contrato inteligente de vBTC V2. Cada bóveda tiene su propia dirección de depósito Taproot de Bitcoin, cuya clave está repartida en partes entre un conjunto de validadores (validators) de VerifiedX (firma por umbral FROST). Nadie tiene la clave completa.
- **Propietario.** La dirección de VFX dueña de la bóveda. El Bitcoin depositado en la dirección de la bóveda se acredita al propietario como vBTC.
- **Tenedor.** Cualquier dirección de VFX con saldo de vBTC en una bóveda. El propietario puede transferir vBTC a tenedores, y los tenedores pueden transferirlo a su vez. Cualquier tenedor, no solo el propietario, puede retirar su propio saldo a Bitcoin.
- **Los montos de vBTC** se expresan en BTC con un máximo de 8 decimales. 1 vBTC está respaldado por 1 BTC que custodia la bóveda.

### Bóvedas vigiladas y heredadas

Core 9.0 lleva el Bitcoin de cada bóveda al consenso. Desde la **altura de registro de la certificación de Bitcoin**, los validadores informan a la cadena las transacciones de bóvedas de cada bloque de Bitcoin (tipo de transacción 43), y una bóveda creada a partir de esa altura es **vigilada**:

- El saldo del propietario es el Bitcoin de la bóveda tal como lo registra la cadena, no lo que diga un servidor de Bitcoin.
- Un retiro se paga con una transacción de Bitcoin que la cadena fija cuando se mina la solicitud. Los firmantes de la bóveda firman exactamente esa transacción y la transmiten por su cuenta, y el retiro se completa cuando Bitcoin la confirma.
- **No hay transacción de finalización ni votación de cancelación.** El nodo rechaza una finalización de tipo 28 y un voto de tipo 30 para una bóveda vigilada. No hay que enviar nada después de la solicitud.
- Mientras un retiro espera su transacción de Bitcoin, quien lo solicitó puede cancelarlo de inmediato (tipo 29). Una vez fijado, el solicitante puede subir su comisión o liberarlo (tipo 44).

Una bóveda creada antes de la altura de registro es **heredada** (legacy). Conserva la forma de trabajo anterior (una transacción de finalización y una votación de cancelación) hasta la **altura de aplicación**, y desde entonces queda congelada. Consulta [Bóvedas heredadas](#bóvedas-heredadas).

Cada ruta que describe una bóveda indica de qué tipo es: `Attested` (vigilada), `Legacy`, `FreezeHeight` y `Frozen`.

### Redes y alturas

| | Mainnet | Testnet |
| --- | --- | --- |
| API del nodo | `http://localhost:7292` | `http://localhost:17292` (inicia el nodo con `testnet`) |
| Red de Bitcoin | Bitcoin mainnet | El signet de VerifiedX, un signet privado de Bitcoin: explorador `https://signet.verifiedx.io`, API de Esplora `https://signet.verifiedx.io/api`, bloques de 10 minutos, direcciones `tb1…`. BTC de prueba en el [faucet de testnet](https://spyglass-testnet.verifiedx.io/faucet) (pestaña Signet BTC) |
| Confirmaciones de Bitcoin antes de que cuente un evento de bóveda | 6 bloques encima del bloque que lo contiene | 3 bloques encima |
| Altura de registro de la certificación (las bóvedas creadas desde aquí son vigiladas) | 7,568,350 | 400 |
| Altura de aplicación de la certificación (bóvedas heredadas congeladas) | 7,658,350 (altura de registro + 90,000, unos 12 días) | 401 |

La testnet se reinició desde el génesis el 22 de octubre de 2026, cuando pasó al signet de VerifiedX, así que todas las bóvedas de testnet son vigiladas. `GET /vbtcapi/VBTC/GetBitcoinAttestationStatus` devuelve las alturas con las que funciona un nodo (consulta [Estado de la certificación](#estado-de-la-certificación)).

Si el nodo se inició con `apitoken=...`, envía el token en el encabezado `apitoken` en cada llamada.

### Ciclo de vida de una bóveda vigilada

1. **Creación.** El propietario inicia una ceremonia de claves (MPC, generación distribuida de claves FROST) entre los validadores y luego crea la bóveda con su resultado (tipo 25). La dirección de depósito se puede usar cuando la transacción de creación está en un bloque.
2. **Depósito.** Cualquiera envía Bitcoin a la dirección de depósito. Cuando la transacción de Bitcoin queda enterrada bajo 6 bloques (3 en testnet), los validadores la informan y el saldo de vBTC del propietario sube en ese bloque de VFX.
3. **Transferencia.** El propietario o un tenedor envía vBTC a cualquier dirección de VFX (tipo 26), desde una bóveda o desde varias en una sola transacción.
4. **Propiedad.** El propietario puede entregar la bóveda a otra dirección. El nuevo propietario recibe el vBTC de la bóveda que no tiene ningún tenedor.
5. **Solicitud de retiro.** Un tenedor pide un monto hacia una dirección de Bitcoin con una tasa de comisión (tipo 27). El vBTC se debita cuando se mina la solicitud.
6. **Fijación.** En el mismo bloque, la cadena calcula la transacción de Bitcoin que la paga, con las monedas de la bóveda, y reserva esas monedas para ella. Si las monedas libres de la bóveda todavía no alcanzan para pagarla, espera y se vuelve a intentar cada vez que cambian las monedas de la bóveda.
7. **Firma.** Los firmantes de la bóveda firman la transacción fijada y la transmiten, normalmente en pocos minutos.
8. **Cierre.** El retiro se completa cuando Bitcoin muestra la transacción fijada enterrada a la misma profundidad que un depósito. Si no se está confirmando, el solicitante puede subir la comisión o liberarlo (tipo 44). Mientras sigue esperando su transacción, el solicitante puede cancelarlo (tipo 29).

## Tipos de transacción

| Tipo | Nombre | Enviada por | Etiqueta en el explorador |
| --- | --- | --- | --- |
| 25 | `VBTC_V2_CONTRACT_CREATE` | Propietario | vBTC V2 Mint |
| 26 | `VBTC_V2_TRANSFER` | Propietario o tenedor | vBTC V2 Transfer |
| 27 | `VBTC_V2_WITHDRAWAL_REQUEST` | Solicitante | vBTC V2 Withdrawal Request |
| 28 | `VBTC_V2_WITHDRAWAL_COMPLETE` | Solo bóvedas heredadas, hasta la altura de aplicación | vBTC V2 Withdrawal Complete |
| 29 | `VBTC_V2_WITHDRAWAL_CANCEL` | Solicitante | vBTC V2 Withdrawal Cancel |
| 30 | `VBTC_V2_WITHDRAWAL_VOTE` | Validadores, solo bóvedas heredadas, hasta la altura de aplicación | vBTC V2 Withdrawal Vote |
| 43 | `VBTC_V2_BTC_REPORT` | Validadores (sin remitente) | Bitcoin Report |
| 44 | `VBTC_V2_COIN_PIN` | Solicitante | vBTC Withdrawal Fee Raise (`Function` de los datos `VBTCWithdrawalFeeBump()`) o vBTC Withdrawal Release (`VBTCWithdrawalRelease()`); vBTC Withdrawal Pin cuando los datos no se pueden leer |
| 45 | `VBTC_V2_BTC_REORG` | Validadores (sin remitente) | Bitcoin Reorg |
| 46 | `VBTC_V2_VAULT_REKEY` | Validadores (sin remitente) | vBTC Vault Rekey |

Las billeteras de VerifiedX usan las mismas etiquetas para los tipos 43 a 46, y etiquetan un tipo 27 como vBTC Withdrawal Request.

Los tipos 43, 45 y 46 tienen `From` y `To` con el valor `BTC_Attestation`, sin monto y sin comisión; su autoridad son las firmas de los validadores que van en sus datos. Un informe de tipo 43 lleva encabezados de Bitcoin y las transacciones de bóvedas de los bloques de Bitcoin informados. Un tipo 45 revierte eventos informados después de una reorganización de Bitcoin. Un tipo 46 pasa una bóveda a una clave nueva creada por los validadores actuales cuando se han ido demasiados poseedores de partes de su clave anterior; las monedas de la bóveda se pasan luego a la clave nueva con transacciones que fija la cadena y que firman los poseedores de la clave anterior (se muestran como un `Sweep` en los retiros de la bóveda). La lista completa de tipos está en [Creación de transacciones](/es/build/node-api/transaction-creation/).

## Estado de la API

```
GET /vbtcapi/VBTC
```

Devuelve `["VFX/vBTC-V2", "vBTC API V2 - MPC Based"]`.

## Crear una bóveda

### 1. Inicia la ceremonia de claves

```
POST /vbtcapi/VBTC/InitiateMPCCeremony/{ownerAddress}
```

`ownerAddress` debe ser una cuenta de la billetera de este nodo. La ceremonia se ejecuta en segundo plano entre los validadores alcanzables que cumplen los requisitos (registrados y con su fianza de 5,000 VFX durante el tiempo suficiente). Al menos tres deben estar alcanzables. Un propietario puede tener una sola ceremonia en curso a la vez, y un nodo ejecuta como máximo 100 a la vez.

```json
{
  "Success": true,
  "Message": "MPC ceremony initiated successfully. Use GetCeremonyStatus to check progress.",
  "CeremonyId": "<32 hex>:<unix time>",
  "Status": "Initiated",
  "InitiatedTimestamp": 1792763000
}
```

Errores: `You already have an active MPC ceremony in progress. Complete or cancel it before starting a new one.`, `Maximum concurrent ceremony limit reached (100). Please try again later.` y, en un nodo configurado para S3C con un grupo no válido, `S3C configuration is present but invalid; refusing to mint. Fix the S3C= config and restart.`

### 2. Sigue la ceremonia

```
GET /vbtcapi/VBTC/GetCeremonyStatus/{ceremonyId}
```

`Status` pasa por `Initiated`, `ValidatingValidators`, `Round1InProgress`, `Round2InProgress`, `Round3InProgress` hasta `Completed`, o termina en `Failed` o `TimedOut` con `ErrorMessage`. Una ceremonia abandonada durante una hora agota su tiempo. Un validador que hace fallar una ceremonia queda fuera y la ceremonia se vuelve a ejecutar sin él, siempre que queden suficientes (`DroppedValidators`).

```json
{
  "Success": true,
  "CeremonyId": "<ceremony id>",
  "Status": "Completed",
  "OwnerAddress": "<owner>",
  "ProgressPercentage": 100,
  "CurrentRound": 3,
  "ErrorMessage": null,
  "DepositAddress": null,
  "FrostGroupPublicKey": "03…",
  "DKGProof": "…",
  "ValidatorCount": 13,
  "RequiredThreshold": 51,
  "ProofBlockHeight": 2839,
  "ContractUID": "<contract UID>",
  "DroppedValidators": null
}
```

Aquí `DepositAddress` siempre es `null`: la dirección solo se entrega cuando la bóveda está en la cadena (paso 4). Fallos habituales: `Insufficient reachable validators for DKG ceremony. Only N of M registered validators are online on FROST port (minimum 3 required).` y `Only N validator(s) are reachable; a vBTC V2 contract needs a key ceremony with at least K of the M eligible validators, so its creation would be refused. Try again when more validators are online.`

Para abandonar una ceremonia:

```
POST /vbtcapi/VBTC/CancelCeremony/{ceremonyId}/{ownerAddress}
```

### 3. Crea la bóveda

```
POST /vbtcapi/VBTC/CreateVBTCContract
```

```json
{
  "OwnerAddress": "<owner>",
  "CeremonyId": "<ceremony id>",
  "Name": "Treasury vault",
  "Description": "optional",
  "Ticker": "optional, default vBTC",
  "ImageBase": null,
  "LinkedContractUID": null
}
```

El nodo escribe el contrato, firma la creación (tipo 25) con la clave del propietario y la transmite. `ImageBase` se ignora mientras la red use la imagen predeterminada de vBTC.

```json
{
  "Success": true,
  "Message": "vBTC V2 contract created and published to blockchain successfully",
  "SmartContractUID": "<contract UID>",
  "TransactionHash": "<VFX hash>",
  "CeremonyId": "<ceremony id>",
  "DepositAddress": "bc1p…",
  "DepositAddressConfirmed": false,
  "FrostGroupPublicKey": "03…",
  "DKGProof": "…",
  "ValidatorCount": 13,
  "ProofBlockHeight": 2839,
  "RequiredThreshold": 51
}
```

Errores: `Ceremony is not complete. Current status: …`, `Owner address does not match the ceremony owner address.`, `Ceremony not found. Please initiate a new ceremony with InitiateMPCCeremony.` y `Failed to create or broadcast smart contract transaction` (el contrato fue rechazado; no se creó nada).

### 4. Obtén la dirección de depósito

```
GET /vbtcapi/VBTC/GetMPCDepositAddress/{scUID}
```

:::caution[No deposites antes de que esta ruta devuelva la dirección]
`DepositAddressConfirmed: false` en el paso 3 significa que la creación todavía no está en un bloque. El Bitcoin enviado a la dirección de un contrato que nunca llega a la cadena no tiene bóveda ni forma de retirarse. Cualquier nodo responde esta ruta una vez que el contrato está en la cadena.
:::

```json
{
  "Success": true,
  "Message": "Deposit address retrieved",
  "SmartContractUID": "<contract UID>",
  "Attested": true,
  "Legacy": false,
  "Frozen": false,
  "Note": null,
  "DepositAddress": "bc1p…",
  "FrostGroupPublicKey": "03…",
  "RequiredThreshold": 51,
  "DKGProof": "…"
}
```

Antes de que el contrato esté en un bloque: `The contract is not confirmed on chain yet. Do not deposit until it is; try again after its creation transaction is in a block.` Para una bóveda heredada congelada, el mensaje es `Deposit address retrieved. DO NOT DEPOSIT: this vault is frozen and Bitcoin sent to it is not credited.` Si una bóveda vigilada se pasó a una clave nueva (tipo 46), esta ruta devuelve la dirección de la clave actual.

## Depositar

Envía Bitcoin a la dirección de depósito desde cualquier billetera. En una bóveda vigilada:

- Un depósito cuenta cuando su bloque de Bitcoin tiene 6 bloques encima (3 en testnet) y los validadores lo han informado. Los validadores informan en cuanto un evento de bóveda tiene esa profundidad, así que el crédito normalmente aparece un bloque de VFX después del bloque de Bitcoin que lo entierra.
- El saldo del propietario sube por el monto depositado en ese bloque de VFX. `GetVaultBitcoin` muestra la moneda nueva.
- Una salida coinbase cuenta, pero no se puede gastar durante 100 bloques de Bitcoin.
- Una salida enviada a la dirección de una bóveda que la cadena pasó a una clave nueva se sigue acreditando mientras firmen los poseedores de esa clave; deposita en la dirección que devuelve `GetMPCDepositAddress`.

## Consultar saldos y bóvedas

Estas rutas de lectura responden a partir del estado de la cadena, así que cualquier nodo da la misma respuesta para cualquier dirección o bóveda, tenga o no las claves en su billetera.

### Saldo en una bóveda

```
GET /vbtcapi/VBTC/GetVBTCBalance/{address}/{scUID}
```

```json
{
  "Success": true,
  "Attested": true,
  "Legacy": false,
  "FreezeHeight": null,
  "Frozen": false,
  "VaultNote": null,
  "Address": "<address>",
  "SmartContractUID": "<contract UID>",
  "Balance": 0.00007,
  "DepositAddressBalance": 0.0001,
  "DepositBalanceStale": false,
  "LedgerBalance": -0.00003,
  "AvailableBalance": 0.00007,
  "PendingWithdrawals": 0,
  "PendingReserveSends": 0,
  "EscrowedWithdrawalAmount": 0.00002,
  "ExpiredEscrowAmount": 0,
  "EscrowedWithdrawals": [ { "RequestHash": "…", "Amount": 0.00002, "Attested": true, "AttestedState": "Pinned", "BitcoinTxid": "…", "ExpiresAtHeight": null } ],
  "IsOwner": true,
  "TransactionCount": 3
}
```

- Para el propietario, `Balance` es el Bitcoin de la bóveda (`DepositAddressBalance`; en una bóveda vigilada, tal como lo registra la cadena) más `LedgerBalance` (negativo por el vBTC que ha enviado a tenedores). Para un tenedor, `Balance` es `LedgerBalance`.
- El monto de un retiro abierto ya está fuera de `Balance`: se debita cuando se mina la solicitud y aparece en `EscrowedWithdrawals`.
- `AvailableBalance` también resta los envíos de reserva que siguen dentro de su ventana de 24 horas.

### Saldos en todas las bóvedas

```
GET /vbtcapi/VBTC/GetAllVBTCBalances/{address}
```

Devuelve `TotalBalance`, `ContractCount` y `Contracts`: una entrada por cada bóveda de la que la dirección es propietaria o en la que tiene vBTC, con los campos anteriores más `DepositAddress` y `WithdrawalStatus`.

### Detalles, lista y salud de las bóvedas

```
GET /vbtcapi/VBTC/GetContractDetails/{scUID}
GET /vbtcapi/VBTC/GetContractList/{ownerAddress?}
GET /vbtcapi/VBTC/GetContractHealth/{scUID}
```

`GetContractDetails` devuelve `Vault` (el tipo), `Bitcoin` (como `GetVaultBitcoin`) y `Contract`. `GetContractList` lista todas las bóvedas, o las que pertenecen a una dirección, con su tipo, dirección de depósito y saldo. `GetContractHealth` informa cuántos de los poseedores originales de la clave de la bóveda son validadores activos (`HealthStatus` `Excellent`, `Healthy`, `Degraded`, `Critical` u `Offline`).

### El Bitcoin de una bóveda vigilada

```
GET /vbtcapi/VBTC/GetVaultBitcoin/{scUID}
```

El Bitcoin de la bóveda tal como lo tiene el consenso: script de depósito, cada moneda sin gastar y qué retiro la reserva, totales, claves y retiros abiertos.

```json
{
  "Success": true,
  "Message": "Vault Bitcoin retrieved",
  "SmartContractUID": "<contract UID>",
  "Vault": { "Attested": true, "Legacy": false, "FreezeHeight": null, "Frozen": false, "Note": null },
  "Bitcoin": {
    "DepositAddress": "bc1p…",
    "DepositScriptHex": "5120…",
    "BitcoinTipHeight": 2195,
    "EventsThroughBitcoinHeight": 2192,
    "ConfirmationsRequired": 6,
    "HeldBtc": 0.00007,
    "HeldSats": 7000,
    "UnspentSats": 7000,
    "PinnedSats": 0,
    "ReleaseFeesSats": 308,
    "SweepFeesSats": 0,
    "Keys": [ { "Generation": 0, "DepositAddress": "bc1p…", "Holders": 13, "MinSigners": 7, "Current": true, "RekeyDue": false } ],
    "CanSign": true,
    "Coins": [ { "Outpoint": "<txid>:1", "ValueSats": 7000, "Status": "Unspent", "HeldFor": null } ],
    "OrphanedCoins": [],
    "OpenWithdrawals": []
  }
}
```

Para una bóveda heredada, `Success` es `false`, `Bitcoin` es `null` y `Message` lo explica; `Vault` sigue completo.

### Estado de la certificación

```
GET /vbtcapi/VBTC/GetBitcoinAttestationStatus
```

```json
{
  "Success": true,
  "Attestation": {
    "Network": "testnet",
    "VfxHeight": 4217,
    "ObserveHeight": 300,
    "RecordHeight": 400,
    "EnforceHeight": 401,
    "Recording": true,
    "Enforced": true,
    "Started": true,
    "BitcoinCheckpointHeight": 2016,
    "BitcoinTipHeight": 2195,
    "EventsThroughBitcoinHeight": 2192,
    "ConfirmationsRequired": 3,
    "SignerEpoch": 5,
    "Signers": 13,
    "SignaturesRequired": 9,
    "OpenWithdrawals": 0
  }
}
```

Una altura que todavía no está definida es `null`. `BitcoinTipHeight` solo avanza cuando se mina un informe: los validadores informan cuando un evento de bóveda tiene suficiente profundidad, o una vez después de 144 bloques de Bitcoin sin ninguno, así que es normal que la punta certificada se quede quieta mientras no le pasa nada a ninguna bóveda. El conjunto de firmantes cambia cada 600 bloques de VFX (`SignerEpoch`) y un informe necesita dos tercios de ese conjunto, con un mínimo de tres.

## Transferir vBTC

### Desde una bóveda

```
POST /vbtcapi/VBTC/TransferVBTC
```

```json
{
  "SmartContractUID": "<contract UID>",
  "FromAddress": "<sender in this wallet>",
  "ToAddress": "<recipient>",
  "Amount": 0.00003
}
```

```json
{
  "Success": true,
  "Message": "vBTC V2 transfer transaction created and broadcast successfully",
  "TransactionHash": "<VFX hash>",
  "From": "<sender>",
  "To": "<recipient>",
  "Amount": 0.00003,
  "SmartContractUID": "<contract UID>"
}
```

Errores: `Amount must be greater than zero`, `Insufficient balance. Available: …, Requested: …`, `Account not found: …` (el remitente no está en esta billetera) y, para una bóveda congelada, `Vault … was created before Bitcoin attestation and has been frozen since block …. Its vBTC can no longer be transferred, withdrawn or bridged.` La transferencia de un remitente de reserva (`xRBX`) queda retenida durante 24 horas y se puede revertir hasta entonces; no puede ir a otra dirección de reserva.

### Desde varias bóvedas a la vez

```
POST /vbtcapi/VBTC/TransferVBTCMulti
```

```json
{
  "FromAddress": "<sender in this wallet>",
  "ToAddress": "<recipient>",
  "TotalAmount": 0.00012
}
```

El nodo reparte `TotalAmount` entre las bóvedas en las que el remitente tiene vBTC y envía una sola transacción de tipo 26 (un nonce, una comisión) con hasta 25 bóvedas. La respuesta lista `Allocations` (`SmartContractUID`, `Amount`). Los remitentes de reserva no pueden usarla: `Reserve accounts cannot use multi-contract vBTC transfers. Send from a single contract instead.`

## Transferir la propiedad

```
GET /vbtcapi/VBTC/TransferOwnership/{scUID}/{toAddress}
```

La firma la cuenta del propietario actual en este nodo. Pasa la bóveda a `toAddress` con una transferencia de contrato inteligente (tipo 18, `Transfer()`). La cifra del propietario en una bóveda es su Bitcoin menos lo que tienen otras direcciones, así que el nuevo propietario se queda con el vBTC que no tiene ningún tenedor; el vBTC ya enviado a tenedores sigue siendo de ellos. La transferencia de un propietario de reserva entra en vigor después del plazo de desbloqueo de la reserva y solo puede ir a una dirección de VFX normal.

```json
{ "Success": true, "Message": "vBTC V2 Contract Transfer has been started." }
```

## Retirar a Bitcoin

### Solicita un retiro

```
POST /vbtcapi/VBTC/RequestWithdrawal
```

```json
{
  "SmartContractUID": "<contract UID>",
  "RequestorAddress": "<holder in this wallet>",
  "BTCAddress": "bc1q…",
  "Amount": 0.00002,
  "FeeRate": 3
}
```

- `FeeRate` es un número entero de sat/vB, de 1 a 5,000.
- La comisión de Bitcoin sale de `Amount`: el destino recibe `Amount` menos la comisión. La comisión es la tasa por el tamaño de la transacción: 154 vB con una entrada, 212 vB con dos, y unos 57.5 vB más por cada entrada adicional que necesiten las monedas de la bóveda.
- Después de la comisión mínima (154 vB a tu tasa), deben quedar al menos 546 sats para pagar. Así que el retiro mínimo es `154 × FeeRate + 546` sats: 1,008 sats a 3 sat/vB.
- `BTCAddress` debe ser una dirección de la red de Bitcoin de la cadena, sin nada alrededor, y no puede ser la propia dirección de depósito de la bóveda.
- Un tenedor puede tener varios retiros abiertos a la vez, en una bóveda o en muchas; cada uno se debita cuando se mina su solicitud.

```json
{
  "Success": true,
  "Message": "vBTC V2 withdrawal request created successfully. Nothing more is needed: when it is mined its Bitcoin transaction is fixed by the chain, the vault's signers sign and broadcast it, and it completes when Bitcoin confirms it. Follow it with GetWithdrawalPin.",
  "RequestHash": "<VFX hash>",
  "SmartContractUID": "<contract UID>",
  "Amount": 0.00002,
  "Destination": "bc1q…",
  "FeeRate": 3,
  "Status": "Requested",
  "Attested": true,
  "CompleteWithdrawalNeeded": false
}
```

`RequestHash` identifica el retiro en todas las demás rutas. `CompleteWithdrawalNeeded` es `true` solo para una bóveda heredada.

### Sigue un retiro

```
GET /vbtcapi/VBTC/GetWithdrawalPin/{scUID}/{withdrawalRequestHash}
```

Cualquier nodo lo responde a partir del estado de la cadena. Un retiro pasa por estos estados:

| `State` | Significado | Qué puede hacer el solicitante |
| --- | --- | --- |
| `Waiting` | Minado, pero las monedas libres de la bóveda todavía no alcanzan para pagarlo (`WaitingFor` indica por qué). Se vuelve a intentar cada vez que cambian las monedas de la bóveda | Cancelar |
| `Pinned` | Su transacción de Bitcoin está fijada y sus monedas están reservadas para ella. Los firmantes la firman y la transmiten | Subir la comisión o liberar |
| `Settled` | Bitcoin muestra su transacción enterrada: pagado | |
| `Cancelled` | Cancelado por su solicitante mientras esperaba; vBTC reembolsado | |
| `Expired` | No se fijó antes de su `ExpiresAtVfxHeight`: 360 bloques de VFX después de su solicitud, o más tarde mientras espera quedarse con monedas reservadas por un retiro que paga una tasa de comisión menor; vBTC reembolsado | |
| `Void` | Una moneda que tenía reservada se gastó en otra transacción, así que nunca puede confirmarse; vBTC reembolsado | |
| `Released` | Sus monedas volvieron a la bóveda a petición del solicitante; vBTC reembolsado menos la comisión de Bitcoin de esa transacción | |

```json
{
  "Success": true,
  "Attested": true,
  "Message": "Withdrawal retrieved",
  "Withdrawal": {
    "SmartContractUID": "<contract UID>",
    "RequestHash": "<request hash>",
    "Kind": "Withdrawal",
    "Requester": "<requester>",
    "State": "Pinned",
    "Summary": "This withdrawal is paid by Bitcoin transaction c314d462…, fixed by the chain. The vault's signers sign and broadcast it on their own, and it completes when Bitcoin has confirmed it 6 times. Nothing needs to be done. If it is not confirming, its requester can raise the fee, or give the withdrawal up and have the vBTC back (a release).",
    "Amount": 0.00002,
    "AmountSats": 2000,
    "FeeRate": 3,
    "RequestVfxHeight": 2990,
    "ExpiresAtVfxHeight": null,
    "WaitingFor": null,
    "ClosedBecause": null,
    "BitcoinTxid": "c314d462…",
    "SettledTxid": null,
    "ClosedAtVfxHeight": null,
    "CanCancel": false,
    "CanRaiseFee": true,
    "CanRelease": true,
    "Releasing": false,
    "CoinsCanBeTakenFromVfxHeight": 5150,
    "Transactions": [
      {
        "Txid": "c314d462…",
        "Kind": "Payment",
        "FeeRate": 3,
        "FeeSats": 462,
        "DestinationSats": 1538,
        "ChangeSats": 8000,
        "Inputs": [ "<txid>:0" ],
        "PinnedAtVfxHeight": 2990,
        "Superseded": false,
        "Dead": false,
        "Confirmed": false,
        "UnsignedTxHex": "0200…"
      }
    ]
  }
}
```

- La fijación aparece en la respuesta del nodo desde el bloque que mina la solicitud. La API del explorador se entera más tarde, así que sigue los retiros a través del nodo.
- `BitcoinTxid` es la transacción vigente más reciente; `SettledTxid`, la que pagó. `Transactions` lista todas las transacciones fijadas para el retiro, de la más antigua a la más reciente. Gastan las mismas monedas, así que como máximo una puede confirmarse.
- `CoinsCanBeTakenFromVfxHeight`: si el retiro no se ha confirmado para este bloque (2,160 bloques de VFX, unas 7.2 horas, después de que se fijó su primera transacción de Bitcoin; una subida de comisión reinicia la cuenta solo si al menos duplica la tasa de comisión, y una liberación nunca la reinicia), otro retiro de la bóveda que pague una tasa de comisión mayor puede fijarse sobre sus monedas. Si ese se confirma, este retiro se cierra como `Void` y se reembolsa.
- Una solicitud que todavía no se ha minado, o un hash que no pertenece a esta bóveda: `"Success": false, "Attested": true, "Withdrawal": null, "Message": "No such withdrawal request is recorded on this vault. If it was just sent, it has not been mined yet."` Vuelve a preguntar después del siguiente bloque.
- Una bóveda heredada: `"Success": false, "Attested": false` con `Vault` y `This vault is not one the chain watches (it was created before Bitcoin attestation). Its withdrawals are completed with CompleteWithdrawal.`

`GET /vbtcapi/VBTC/GetWithdrawalStatus/{scUID}` lista todos los retiros abiertos de una bóveda (en `Bitcoin.OpenWithdrawals`), y `GET /vbtcapi/VBTC/GetWithdrawalHistory/{scUID}` lista los retiros pagados (`WithdrawalHistory`) y los cerrados sin pago (`Refunded`).

### Cancela un retiro en espera

```
POST /vbtcapi/VBTC/CancelWithdrawal
```

```json
{
  "SmartContractUID": "<contract UID>",
  "OwnerAddress": "<the requester, in this wallet>",
  "WithdrawalRequestHash": "<request hash>"
}
```

`OwnerAddress` es la dirección que solicitó el retiro (el nombre es anterior a los retiros por parte de tenedores). El nodo firma una cancelación de tipo 29 con esa cuenta. En una bóveda vigilada no hay votación: cuando se mina la cancelación, el retiro se cierra como `Cancelled` y el vBTC vuelve de inmediato.

```json
{
  "Success": true,
  "Attested": true,
  "Message": "Cancel transaction broadcast. When it is mined the withdrawal is closed and its vBTC returned at once; no vote is held.",
  "CancelTxHash": "<VFX hash>"
}
```

Solo se puede cancelar un retiro `Waiting` (`CanCancel: true`). Una vez fijado: `This withdrawal's Bitcoin transaction is fixed and may already be signed, so it cannot be cancelled. It completes when Bitcoin confirms it.` En su lugar, sube la comisión o libéralo. Otros errores: `Only the requester can cancel a withdrawal.` y, cuando este nodo no tiene la clave del solicitante, `This node does not hold the key for …, so it cannot sign the cancel. Build it with GetRawCancelWithdrawalTxData, sign the hash, and submit it with SendRawCancelWithdrawalTx.`

### Sube la comisión de un retiro fijado

```
POST /vbtcapi/VBTC/BumpWithdrawalFee
```

```json
{
  "SmartContractUID": "<contract UID>",
  "RequestorAddress": "<the requester, in this wallet>",
  "WithdrawalRequestHash": "<request hash>",
  "FeeRate": 8
}
```

El nodo firma una transacción de tipo 44 (`VBTCWithdrawalFeeBump()`) con la cuenta del solicitante. Cuando se mina, la cadena fija un reemplazo que gasta las mismas monedas a la nueva tasa. La comisión más alta sale del propio monto del retiro, así que el destino recibe menos; la bóveda y su propietario no pagan nada. Cualquiera de las transacciones del retiro que Bitcoin confirme lo completa.

```json
{
  "Success": true,
  "Message": "Fee bump transaction broadcast. When it is mined the replacement Bitcoin transaction is fixed and the vault's signers sign it. Follow it with GetWithdrawalPin.",
  "FeeBumpTxHash": "<VFX hash>",
  "Release": false,
  "SmartContractUID": "<contract UID>",
  "WithdrawalRequestHash": "<request hash>",
  "FeeRate": 8
}
```

Reglas: `FeeRate` debe ser mayor que la tasa que paga la transacción más reciente, y como máximo 5,000. Un retiro puede tener hasta 8 transacciones de pago fijadas, y ninguna se sube una vez que hay una liberación pendiente. La original sigue siendo válida: si se confirma antes de que el reemplazo llegue a Bitcoin, el retiro se paga con ella y la subida no tiene efecto. Los firmantes transmiten una nueva fijación pocos minutos después de que se fija, así que con bloques de Bitcoin de 10 minutos esto ocurre.

### Libera un retiro fijado

```
POST /vbtcapi/VBTC/ReleaseWithdrawal
```

El mismo cuerpo que `BumpWithdrawalFee`. El nodo firma una transacción de tipo 44 (`VBTCWithdrawalRelease()`). Cuando se mina, la cadena fija una transacción de Bitcoin que devuelve las monedas del retiro a la bóveda. Cuando Bitcoin la muestra enterrada, el retiro se cierra como `Released` y el vBTC se reembolsa al solicitante, menos la comisión de Bitcoin de esa transacción; el solicitante puede entonces volver a retirar. Si uno de los pagos del retiro se confirma primero, se paga como de costumbre.

```json
{
  "Success": true,
  "Message": "Release transaction broadcast. When it is mined the Bitcoin transaction that returns the withdrawal's coins to the vault is fixed and the vault's signers sign it; the vBTC is refunded, less its Bitcoin fee, when Bitcoin has confirmed it. Follow it with GetWithdrawalPin.",
  "FeeBumpTxHash": "<VFX hash>",
  "Release": true,
  "SmartContractUID": "<contract UID>",
  "WithdrawalRequestHash": "<request hash>",
  "FeeRate": 6
}
```

Reglas: `FeeRate` debe ser mayor que la tasa que paga la transacción más reciente, la comisión total de la liberación debe ser al menos la comisión de la transacción más reciente más 1 sat por cada vB de la liberación (lo que Bitcoin exige para reemplazar una transacción), y la comisión no puede superar el monto del retiro. Un retiro puede tener hasta 4 transacciones de liberación.

### Qué devuelve la ruta de finalización en una bóveda vigilada

```
POST /vbtcapi/VBTC/CompleteWithdrawal
```

```json
{ "SmartContractUID": "<contract UID>", "WithdrawalRequestHash": "<request hash>" }
```

En una bóveda vigilada, esta ruta no firma ni envía nada: indica en qué punto está el retiro. Quien la consultaba periódicamente puede seguir haciéndolo.

```json
{
  "Success": true,
  "Paid": false,
  "Attested": true,
  "Message": "[AWAITING-BTC-CONFIRMATION] This withdrawal is paid by Bitcoin transaction c314d462…, fixed by the chain. …",
  "Status": "Awaiting_BTC_Confirmation",
  "NothingToDo": true,
  "NotMinedYet": false,
  "VFXTransactionHash": null,
  "BTCTransactionHash": null,
  "PinnedBTCTransactionHash": "c314d462…",
  "SmartContractUID": "<contract UID>",
  "WithdrawalRequestHash": "<request hash>",
  "Withdrawal": { "State": "Pinned", "…": "as GetWithdrawalPin" }
}
```

- `Status` es `Awaiting_BTC_Transaction` (en espera), `Awaiting_BTC_Confirmation` (fijado), `Completed` (pagado: `BTCTransactionHash` es el txid que pagó), `Closed` (cerrado sin pago) o `Unknown` (todavía no minado).
- `Success` es `true` mientras el retiro está pagado o en proceso de pago; `Paid` indica si está pagado. `false` con `NotMinedYet: true` significa que debes volver a preguntar después del siguiente bloque.

## Retiro desde varias bóvedas

Un tenedor con vBTC en varias bóvedas, como un exchange, retira un monto total a una dirección de Bitcoin con una sola solicitud. El nodo reparte el total entre las bóvedas en las que el solicitante tiene vBTC, empezando por el mayor saldo disponible (en caso de empate, por UID del contrato), de modo que se use el menor número posible de bóvedas.

- **Una transacción de VFX** (tipo 27, `VBTCWithdrawalRequestMultiV2()`) abre todo el retiro: un nonce, una comisión de VFX.
- **Cada bóveda asignada es una porción**, pagada con su propia transacción de Bitcoin desde esa bóveda. El solicitante paga una comisión de minero de Bitcoin por porción, que sale del monto de esa porción.
- **Las porciones se liquidan por separado.** Cada porción se fija, se firma, se paga, se le sube la comisión, se libera, se cancela o se cierra por su cuenta, así que un retiro puede quedar pagado en parte.
- Un total que cubre una sola bóveda se envía como un retiro simple normal (`VBTCWithdrawalRequest()`). Las rutas de abajo lo tratan de la misma manera.
- Como máximo 10 bóvedas por solicitud. Nunca se asigna una bóveda heredada congelada.

### Solicitud

```
POST /vbtcapi/VBTC/RequestWithdrawalMulti
```

El solicitante debe ser una cuenta de la billetera de este nodo. No se necesita `SmartContractUID`.

```json
{
  "RequestorAddress": "<holder in this wallet>",
  "BTCAddress": "bc1q…",
  "Amount": 0.000035,
  "FeeRate": 3
}
```

```json
{
  "Success": true,
  "Message": "vBTC V2 multi-contract withdrawal request created successfully",
  "RequestHash": "2b391bf4…7840",
  "TotalAmount": 0.000035,
  "Destination": "bc1q…",
  "FeeRate": 3,
  "Allocations": [
    { "SCUID": "<vault A UID>", "Amount": 0.00002 },
    { "SCUID": "<vault B UID>", "Amount": 0.000015 }
  ],
  "BitcoinTransactions": 2,
  "Status": "Requested",
  "AttestedContracts": [ "<vault A UID>", "<vault B UID>" ]
}
```

Cada porción paga su propia comisión, así que comprueba que el destino reciba lo que esperas: en este ejemplo cada porción pagó 462 sats (154 vB a 3 sat/vB) y la dirección recibió 3,500 − 2 × 462 = 2,576 sats. `AttestedContracts` lista las porciones en bóvedas vigiladas: las pagan los firmantes de la bóveda y no hay que enviar nada más.

### Sigue cada porción

```
GET /vbtcapi/VBTC/GetWithdrawalRequestShares/{withdrawalRequestHash}
```

Lista las porciones una vez que se mina la solicitud.

```json
{
  "Success": true,
  "WithdrawalRequestHash": "<request hash>",
  "RequestorAddress": "<requester>",
  "IsMultiContract": true,
  "TotalAmount": 0.00007,
  "ShareCount": 2,
  "CompletedCount": 2,
  "AllComplete": true,
  "PaidCount": 1,
  "RefundedCount": 1,
  "AllPaid": false,
  "Shares": [
    { "SmartContractUID": "<vault A UID>", "Amount": 0.00005, "BTCDestination": "bc1q…", "FeeRate": 1, "IsCompleted": true, "Paid": true, "Refunded": false, "Status": "Completed", "BTCTxHash": "2407c724…67cf", "RequestBlockHeight": 4179 },
    { "SmartContractUID": "<vault B UID>", "Amount": 0.00002, "BTCDestination": "bc1q…", "FeeRate": 1, "IsCompleted": true, "Paid": false, "Refunded": true, "Status": "Cancelled", "BTCTxHash": null, "RequestBlockHeight": 4179 }
  ]
}
```

`IsCompleted` significa que una porción está cerrada, de la forma que sea. `Paid` y `Refunded` indican de qué forma. Una porción liberada aparece aquí con `Status: "Cancelled"`; `GetWithdrawalPin` da su estado exacto (`Released`) y el reembolso menos la comisión de liberación. Antes de que se mine la solicitud: `No withdrawal shares found for … The REQUEST transaction may not be mined yet.`

Para ver la transacción de Bitcoin de cada porción y qué se puede hacer con ella, llama a `GET /vbtcapi/VBTC/GetWithdrawalPin/{shareUID}/{withdrawalRequestHash}` con el UID de la bóveda de la porción y el hash de la solicitud. Una porción pasa por los mismos estados que un retiro simple (`Waiting`, `Pinned` y luego `Settled`, `Cancelled`, `Expired`, `Void` o `Released`).

### Sube la comisión, libera o cancela una porción

Cada porción es un retiro de su propia bóveda bajo el hash de solicitud compartido. Pasa el UID de la bóveda de la porción como `SmartContractUID` y el hash de la solicitud como `WithdrawalRequestHash` a `BumpWithdrawalFee`, `ReleaseWithdrawal` o `CancelWithdrawal`. Cada subida de comisión o liberación es una transacción de tipo 44 para una porción y deja las demás porciones como están. En testnet, una solicitud tuvo una porción con la comisión subida de 1 a 3 sat/vB y pagada por el reemplazo, y su otra porción liberada a 2 sat/vB y reembolsada menos la comisión de liberación de 308 sats.

### CompleteWithdrawalMulti

```
POST /vbtcapi/VBTC/CompleteWithdrawalMulti
```

```json
{ "WithdrawalRequestHash": "<request hash>" }
```

**En bóvedas vigiladas, un integrador no necesita esta ruta.** No envía nada para una porción vigilada e informa el estado de cada porción: pagada, en proceso de pago por la cadena (con su transacción de Bitcoin fijada) o cerrada y reembolsada.

```json
{
  "Success": false,
  "Message": "0/2 withdrawal share(s) paid; 2 being paid by the chain (nothing to do; ask again later)",
  "WithdrawalRequestHash": "<request hash>",
  "Paid": 0,
  "BeingPaid": 2,
  "Refunded": 0,
  "Failed": 0,
  "Results": [
    { "SmartContractUID": "<vault A UID>", "Amount": 0.00002, "Success": false, "BeingPaid": true, "Refunded": false, "AlreadyComplete": false, "VFXTxHash": null, "ErrorMessage": "[AWAITING-BTC-CONFIRMATION] This withdrawal is paid by Bitcoin transaction 54b8ef18…, fixed by the chain. …" }
  ]
}
```

Cuando todas las porciones están pagadas: `"Success": true, "Message": "All withdrawal shares completed"`, con el `BTCTxHash` que pagó cada porción. Una porción cerrada sin pago dice `This share was closed without being paid (Cancelled); its vBTC was returned to the requester. No Bitcoin was or will be sent for it.`

En una bóveda heredada, antes de la altura de aplicación, esta ruta es la que paga las porciones: para cada porción abierta ejecuta una ceremonia de firma FROST, transmite la transacción de Bitcoin de la porción y registra su finalización (tipo 28). Una porción que falla sigue abierta y se reintenta llamando de nuevo a la ruta. Desde la altura de aplicación, las porciones heredadas no se pueden completar.

### Errores

| Situación | Mensaje |
| --- | --- |
| Las bóvedas juntas tienen menos que el total | `Insufficient combined vBTC balance. Available: 0.000055, Requested: 0.0001` |
| El solicitante no tiene vBTC | `No spendable vBTC balance found for this address.` |
| Monto cero o negativo | `Amount must be greater than zero` |
| Más de 8 decimales | `Amount cannot have more than 8 decimal places.` |
| Tasa de comisión de 0 o menos | `Fee rate must be greater than zero` (un `FeeRate` fraccionario se rechaza con HTTP 400) |
| Tasa de comisión mayor a 5,000 sat/vB | `A withdrawal's fee rate is at most 5000 sat/vB; this one names …` |
| Una porción demasiado pequeña para pagar después de su comisión | `Withdrawal share from contract …: 0.000004 BTC cannot pay a Bitcoin withdrawal at 3 sat/vB. … (The total was split across 2 contracts; each share pays its own Bitcoin fee.)` En una bóveda vigilada, cada porción debe dejar al menos 546 sats después de `154 × FeeRate`: `A withdrawal of … sats from vault … at … sat/vB leaves less than 546 sats to pay: …` |
| Se necesitan más de 10 bóvedas | `Withdrawal would require N contract inputs (max 10). Withdraw a smaller amount or split it across several requests.` |
| No es una dirección de Bitcoin de esta red | `TX Verify Failed: The withdrawal's Bitcoin address is not an address on this network: …` |
| Un solicitante de reserva | `Reserve accounts cannot request BTC withdrawals. Move the vBTC to a normal VFX address first.` |
| El solicitante no está en esta billetera | `Account not found: …` (usa el [retiro desde varias bóvedas sin SDK](/es/build/vbtc/raw-integration/#retiro-desde-varias-bóvedas)) |

## Errores que puedes encontrar en un retiro

| Situación | Mensaje |
| --- | --- |
| Monto demasiado pequeño para su comisión | `vBTC V2 withdrawal request: … BTC cannot pay a Bitcoin withdrawal at … sat/vB. The smallest withdrawal transaction costs … sats in fees and the payout must be at least 330 sats, so the minimum at this fee rate is … BTC. Raise the amount or lower the fee rate.` (la comprobación del nodo) y luego, en una bóveda vigilada, `A withdrawal of … sats from vault … at … sat/vB leaves less than 546 sats to pay: its Bitcoin transaction costs at least … sats, taken out of the amount. Raise the amount or lower the fee rate.` |
| Tasa de comisión fuera de los límites | `Fee rate must be greater than zero`; `A withdrawal's fee rate is at most 5000 sat/vB; this one names …` |
| Destino incorrecto | `The withdrawal's Bitcoin address is not an address on this network: …`; `The withdrawal's Bitcoin address has spaces around it.`; `The withdrawal's Bitcoin address is the deposit address of vault …, which it withdraws from. …` |
| No hay suficiente vBTC | `Insufficient balance. Available: …, Requested: …` |
| Junto con las transacciones pendientes del solicitante gastaría de más | `Together with this address's pending transactions the withdrawal exceeds its balance: …` |
| Solicitante equivocado | `Only the requester can raise a withdrawal's Bitcoin fee.`; `Only the requester can cancel a withdrawal.` |
| Cancelación después de la fijación | `This withdrawal's Bitcoin transaction is fixed and may already be signed, so it cannot be cancelled. It completes when Bitcoin confirms it.` |
| Subida o liberación antes de la fijación | `This withdrawal has no Bitcoin transaction yet. Cancel it and request again with the fee rate you want.` |
| Subida o liberación a una tasa que no supera la actual | `The new fee rate must be above the 3 sat/vB the withdrawal's newest Bitcoin transaction pays.` |
| Subida mientras hay una liberación pendiente | `This withdrawal is being released back to the vault; its payment is not raised any more. A release at a higher fee rate is accepted.` |
| Demasiadas transacciones fijadas | `This withdrawal already has 8 Bitcoin transactions; no more replacements are accepted. It can still be released.`; `This withdrawal already has 4 release transactions; no more are accepted.` |
| Comisión de liberación demasiado baja o demasiado alta | `At … sat/vB the release pays … sats; it must pay at least … sats to replace the withdrawal's newest Bitcoin transaction. Name a higher fee rate.`; `At … sat/vB the release costs … sats of Bitcoin fee, more than the … sats the withdrawal is for; the fee is taken out of the refund.` |
| Retiro ya cerrado | `This withdrawal is already closed (Settled).` |
| Subida o liberación en una bóveda heredada | `Only a withdrawal from a vault the chain watches can have its Bitcoin fee raised.` |
| La clave de la bóveda ya no puede firmar | Se rechaza antes de debitar a nadie; la bóveda debe pasarse a una clave nueva (tipo 46) |
| Una bóveda heredada congelada | `Vault … was created before Bitcoin attestation and has been frozen since block …. Its vBTC can no longer be transferred, withdrawn or bridged.` |

Cuando un error viene de la comprobación de transacciones del nodo, lleva el prefijo `TX Verify Failed: `.

## Puente a Base (vBTC.b)

vBTC.b es vBTC en Base, un ERC-20 (`vBTCb`, símbolo `vBTC.b`, 8 decimales) emitido contra vBTC bloqueado en VerifiedX. Consulta [vBTC.b en Base](/es/learn/vbtc-protocol/#vbtcb-en-base) para conocer el modelo.

### Hacia Base

El nodo del propietario ejecuta todo el flujo: transmite el bloqueo (tipo 37), reúne las certificaciones de emisión de los validadores del puente cuando el bloqueo tiene 30 bloques de VFX de profundidad, y envía `mintWithProof` en Base desde una dirección de Base derivada de la clave de VFX del propietario. Esa dirección paga el gas de Base, así que antes fóndeala con un poco de ETH.

```
GET  /wallet/api/base-address/{vfxAddress}
GET  /wallet/api/vbtc/bridge/preflight/{ownerAddress}/{scUID}
POST /wallet/api/vbtc/bridge/toBase
```

`preflight` muestra lo que necesitará el puente, incluido el saldo de ETH de la dirección de Base derivada. `toBase` recibe un cuerpo en camel case con el monto como cadena:

```json
{
  "scUID": "<vault UID>",
  "ownerAddress": "<owner VFX address>",
  "amount": "0.0005",
  "evmDestination": "0x<40 hex characters>"
}
```

Se rechaza cuando la dirección de Base derivada no tiene ETH. Síguelo con `GET /wallet/api/vbtc/bridge/status/{lockId}`; si el envío a Base falla, `POST /wallet/api/vbtc/bridge/retry/{lockId}/{ownerAddress}` (o `forceRetry`) lo vuelve a enviar.

Un bloqueo se rechaza cuando el remitente es una cuenta de bóveda (reserva), la bóveda es S3C, el monto no es un número entero de satoshis o `evmDestination` no es `0x` seguido de 40 caracteres hexadecimales.

`POST /vbtcapi/VBTC/BridgeToBase` (`SmartContractUID`, `OwnerAddress`, `Amount`, `EvmDestination`) solo transmite el bloqueo. Para emitir por tu cuenta, lee las firmas de `GET /vbtcapi/VBTC/GetMintAttestation/{lockId}` y la dirección y el ABI del contrato de `GET /vbtcapi/VBTC/GetBridgeConfig`, y llama a `mintWithProof` desde tu propia billetera EVM.

### De vuelta a VerifiedX o hacia Bitcoin

Las salidas empiezan en Base, desde la propia billetera EVM del tenedor; el nodo no tiene una ruta de quema.

- `burnForVfxExit(amount, vfxDestinationAddress)` devuelve vBTC a una dirección de VFX. Los casters del puente ven la quema, se ponen de acuerdo sobre ella y transmiten un desbloqueo del fondo (tipo 39) que acredita al destino.
- `burnForBTCExit(amount, btcDestination)` paga en Bitcoin. Los casters registran la salida en VerifiedX (tipo 40) y, en bóvedas vigiladas, el consenso fija la parte de cada bóveda en el mismo bloque, exactamente como un retiro. Síguela en cualquier nodo con `GET /vbtcapi/VBTC/GetBridgeExit/{baseBurnTxHash}`: `Status` es `Waiting`, `Pinned`, `Complete` o `Failed`, y `Parts` lista la transacción de Bitcoin fijada de cada bóveda. Una salida que no se fija en 360 bloques falla por regla y sus bloqueos se restauran. La comisión de Bitcoin empieza en 10 sat/vB y sale del pago.

### Estado y saldos del puente

- `GET /vbtcapi/VBTC/GetBridgeStatus`: si el puente está configurado en este nodo, el contrato, el chain id y la oferta total de vBTC.b en Base.
- `GET /vbtcapi/VBTC/GetBridgeConfig`: `IsEnabled`, `ContractAddress`, `ChainId`, `Network` y el `Abi` del contrato.
- `GET /vbtcapi/VBTC/GetBaseBalance/{evmAddress}`: el saldo de vBTC.b de una dirección.
- `GET /vbtcapi/VBTC/GetBridgeLockStatus/{lockId}`, `GetBridgeLocks/{scUID}` y `GetBridgeLocksByOwner/{ownerAddress}` leen los registros propios de este nodo, así que pregúntale al nodo que hizo el bloqueo.

Mainnet usa Base (chain id 8453) y testnet usa Base Sepolia (chain id 84532). Un `config.txt` nuevo se escribe con el contrato y el RPC de la red (`BaseBridgeContract`, `BaseBridgeRpcUrl`, `BaseBridgeRpcUrl2`, `BaseBridgeRpcUrl3`, `BaseBridgeChainId`); un nodo cuyo `config.txt` existente no los tenga informa `BridgeEnabled: false`.

## Bóvedas heredadas

Una bóveda heredada se creó antes de la altura de registro de la certificación. Su Bitcoin no está en el consenso: el saldo de su propietario viene de servidores de Bitcoin, y sus retiros funcionan de la forma anterior.

**Hasta la altura de aplicación:**

1. Solicita el retiro (`RequestWithdrawal`, `RequestWithdrawalMulti`). La respuesta tiene `Attested: false` y `CompleteWithdrawalNeeded: true`.
2. Complétalo: `POST /vbtcapi/VBTC/CompleteWithdrawal` (o `CompleteWithdrawalMulti`) coordina la firma FROST entre los validadores de la bóveda, transmite la transacción de Bitcoin y registra la finalización (tipo 28). La respuesta tiene `VFXTransactionHash`, `BTCTransactionHash` y `Status: "Pending_BTC"`; si la transacción recupera monedas que tenía reservadas otro retiro, `Status` es `Awaiting_BTC_Confirmation` y la finalización llega después de su primera confirmación. Una solicitud que nunca puede pagarse a su tasa de comisión responde `Unpayable: true`: cancélala.
3. Para cancelar, envía `CancelWithdrawal` (tipo 29). Los validadores activos de la bóveda votan sobre la cancelación (tipo 30, 75% para aprobarla); una cancelación aprobada reembolsa el vBTC retenido. Síguela con `GET /vbtcapi/VBTC/GetCancellationStatus/{scUID}/{withdrawalRequestHash}`. Un validador que firmó una transacción de Bitcoin para el retiro vota en contra. `POST /vbtcapi/VBTC/VoteOnCancellation` permite al operador de un validador emitir a mano el voto de ese nodo.

**Desde la altura de aplicación**, la bóveda queda congelada:

- Nada debita un saldo en ella: ni transferencias, ni retiros, ni bloqueos ni salidas del puente, para el propietario ni para ningún tenedor. El Bitcoin depositado en ella no se acredita. Dos liquidaciones todavía mueven vBTC entre tenedores dentro de ella, sin cambiar su total: un envío diferido de una reserva cuyo plazo vence, y un barrido de recuperación de una reserva; el nuevo tenedor no puede sacar nada de la bóveda.
- Se rechazan las finalizaciones de retiro (tipo 28), los votos de cancelación (tipo 30), las finalizaciones de salida del puente (tipo 41) y los fallos de salida del puente (tipo 42) para todas las bóvedas.
- Un retiro ya solicitado desde una bóveda heredada se completa o se liquida a mano. No se cancela por votación.
- Los validadores conservan sus partes de clave de las bóvedas heredadas; ninguna baja de validadores ni cambio de clave las borra.

**Qué deben hacer los tenedores antes de la altura de aplicación:** crear una bóveda nueva (será vigilada) y pasarse a ella, o retirar a Bitcoin. Lo que quede en una bóveda heredada al llegar a la altura de aplicación se queda ahí. `GetMPCDepositAddress`, las rutas de saldo y `GetContractList` devuelven `Legacy`, `FreezeHeight` y una `Note` que lo indica.

En testnet ya no existen bóvedas heredadas: la cadena se reinició en octubre de 2026 y la altura de aplicación es 401.

## Bóvedas S3C

S3C (contratos inteligentes autocustodiados) permite que un propietario haga que la clave de una bóveda la tengan solo validadores que opera ese mismo propietario, en lugar del conjunto público de validadores.

- **Validadores.** Cada validador S3C funciona con `S3CValidator=true` en `config.txt`, lo que lo marca como S3C en la cadena cuando se registra. Un validador S3C solo participa en ceremonias S3C; las bóvedas públicas nunca lo usan. Como cualquier validador, debe estar registrado, activo y tener su fianza de 5,000 VFX.
- **El nodo emisor** lista el grupo en `config.txt` como `S3C=IP:ValidatorAddress,IP:ValidatorAddress,IP:ValidatorAddress`: al menos tres entradas, solo direcciones IP públicas y direcciones de VFX válidas. Entonces todas las bóvedas que crea este nodo son bóvedas S3C. Se contacta la IP configurada.
- **Todo o nada.** Cada validador configurado debe estar registrado, activo, marcado como S3C, con fondos y con la garantía durante el tiempo suficiente, y todos participan en la ceremonia de claves. Si alguno no se puede usar, la ceremonia falla y lo nombra. Si el valor de `S3C=` no es válido, el nodo se niega a crear bóvedas en lugar de recurrir al grupo público.
- **Comprueba antes de emitir:** `GET /vbtcapi/VBTC/GetS3CStatus` devuelve `Enabled`, `ConfigInvalid`, `IsS3CValidator` y, por cada validador configurado, `RegisteredOnChain`, `Reachable` y `ConfigIPMismatch`.
- **Claves.** La cadena nunca pasa una bóveda S3C a una clave nueva: quién tiene su clave es asunto de su propietario.
- `POST /vbtcapi/VBTC/StartS3CAutoBridge` (`S3CContractUID`, `RequesterAddress`, `Amount`, `EvmDestination`) retira vBTC de S3C a una bóveda pública asociada y lo lleva a Base por el puente en una sola orquestación; `GET /vbtcapi/VBTC/GetS3CAutoBridgeStatus/{orchestrationId}` la sigue. Su estado se guarda en memoria: después de reiniciar el nodo, termínala a mano.

## La billetera de navegador del nodo

Un nodo iniciado con su billetera de navegador ofrece las mismas operaciones, firmadas por las cuentas del nodo, bajo `/wallet/api/vbtc`. Los cuerpos van en camel case y los montos y las tasas de comisión son cadenas (un número JSON se rechaza con HTTP 400).

| Ruta | Cuerpo o parámetros |
| --- | --- |
| `GET /wallet/api/vbtc/{address}` | Las bóvedas de la dirección |
| `POST /wallet/api/vbtc/withdraw/request` | `scUID`, `ownerAddress` (el solicitante), `btcAddress`, `amount`, `feeRate` (predeterminado 10) |
| `GET /wallet/api/vbtc/withdraw/pin/{scUID}/{requestHash}` | `{success, withdrawal, message}`, donde `withdrawal` es el objeto que devuelve `GetWithdrawalPin` |
| `GET /wallet/api/vbtc/withdraw/status/{scUID}` | El estado de los retiros de la bóveda |
| `POST /wallet/api/vbtc/withdraw/cancel` | `scUID`, `ownerAddress`, `requestHash` |
| `POST /wallet/api/vbtc/withdraw/bumpfee` | `scUID`, `ownerAddress`, `requestHash`, `feeRate` |
| `POST /wallet/api/vbtc/withdraw/release` | `scUID`, `ownerAddress`, `requestHash`, `feeRate` |
| `POST /wallet/api/vbtc/withdraw/complete` | `scUID`, `requestHash` (bóvedas heredadas; en una bóveda vigilada informa el estado) |
| `POST /wallet/api/vbtc/transfer` | `scUID`, `fromAddress`, `toAddress`, `amount` |

## Otras rutas de vBTC

Están en el mismo controlador y no se tratan en esta página: el fondo blindado de vBTC (`ShieldVBTC`, `UnshieldVBTC`, `PrivateTransferVBTC`, `GetShieldedVBTCBalance`, `GetShieldedVBTCPoolState/{scUID}`), el puente a Base (`BridgeToBase`, `GetBridgeLockStatus/{lockId}`, `GetBridgeLocks/{scUID}`, `GetBridgeLocksByOwner/{ownerAddress}`, `GetBaseBalance/{evmAddress}`, `GetBridgeStatus`, `GetBridgeConfig`, `GetBridgeExit/{baseBurnTxHash}`), las rutas de validadores (`GetValidatorList`, `GetValidatorStatus/{address}`, `GetValidatorBond/{address}`, `ExitValidator/{address}`; consulta [Ejecutar un validador](/es/node/validator/)) y las rutas de operador.

## vBTC V1 está retirado

vBTC V1 (tokenización por árbitros en `btcapi/BTCV2`: `TokenizeBitcoin`, `TransferCoin`, `TransferCoinMulti`, `WithdrawalCoin`, `WithdrawalCoinRawTX`, tipos de transacción 17 a 21) se retiró en el bloque 7,400,500 de mainnet. Desde esa altura, la red no acepta ningún token, transferencia ni retiro nuevo de V1, y ninguna transacción puede tocar un contrato V1 existente, así que los saldos de V1 quedan congelados tal como están. En la testnet, que se reinició en octubre de 2026, V1 está retirado desde el bloque 1. Las rutas de billetera de Bitcoin de `btcapi/BTCV2` (cuentas, envíos, comisiones, nombres `.btc`) no se ven afectadas y están listadas en [Detalles de la API del CLI](/es/build/node-api/details/#3-api-de-integración-con-bitcoin).
