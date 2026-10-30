---
sourceHash: 47cc97b1f4de
title: "Detalles de la API del nodo de VFX CLI"
description: "Referencia de todos los endpoints de la API de VFX Core, agrupados por espacio de nombres, con sus parámetros y valores devueltos."
sidebar:
  order: 2
---

Este documento ofrece una documentación completa de todos los endpoints de la API Kestrel de VFX Core con integración de Swagger.

## Tabla de contenidos

1. [API principal (V1)](#1-api-principal-v1) - `/api/V1`
2. [API principal (V2)](#2-api-principal-v2) - `/api/V2`  
3. [API de integración con Bitcoin](#3-api-de-integración-con-bitcoin) - `/btcapi/BTCV2`
4. [API de contratos inteligentes](#4-api-de-contratos-inteligentes) - `/scapi/SCV1`
5. [API de tokens V2](#5-api-de-tokens-v2) - `/tkapi/TKV2`
6. [API de transacciones](#6-api-de-transacciones) - `/txapi/TXV1`
7. [API de comercio de DecShop](#7-api-de-comercio-de-decshop) - `/dstapi/DSTV1`
8. [API de votación](#8-api-de-votación) - `/voapi/VOV1`
9. [API de Beacon](#9-api-de-beacon) - `/bcapi/BCV1`
10. [API de tienda web](#10-api-de-tienda-web) - `/wsapi/WebShopV1`
11. [API de cuentas de reserva](#11-api-de-cuentas-de-reserva) - `/rsapi/RSV1`
12. [API del adjudicador](#12-api-del-adjudicador) - `/adjapi/ADJV1`
13. [API del nodo validador](#13-api-del-nodo-validador) - `/valapi/Validator`
14. [API de integraciones](#14-api-de-integraciones) - `/iapi/IntegrationsV1`
15. [API de vBTC V2 (novedades de 9.0)](#15-api-de-vbtc-v2-novedades-de-90) - `/vbtcapi/VBTC`
16. [API de privacidad: VFX blindado en bruto (novedades de 9.0)](#16-api-de-privacidad-vfx-blindado-en-bruto-novedades-de-90) - `/privacyapi/PrivacyV1`

## 1. API principal (V1)
**Rutas base:** `api/V1`, `api/V1/{somePassword?}`  
**Controlador:** V1Controller  

### Endpoints principales del sistema

#### GET `/`
**Resumen:** Comprueba el estado de la API  
**Devuelve:** Arreglo de cadenas que indica el estado de la API  
**Respuesta:** `["VFX-Wallet", "API"]`

#### GET `/{id}`
**Resumen:** Ejecuta un comando específico por ID  
**Parámetros:**
- `id` (string, ruta) - Identificador del comando  
**Comandos admitidos:**
- `"getgenesisblock"` - Devuelve el bloque génesis en formato JSON  
**Devuelve:** Resultado del comando o "Command not recognized"

### Endpoints de gestión de la billetera

#### GET `/UnlockWallet/{password}`
**Resumen:** Desbloquea la API con la contraseña  
**Parámetros:**
- `password` (string, ruta) - Contraseña de la billetera  
**Devuelve:** JSON con el estado de éxito y un mensaje

#### GET `/LockWallet/{password}`
**Resumen:** Bloquea la API con la contraseña  
**Parámetros:**
- `password` (string, ruta) - Contraseña de la billetera  
**Devuelve:** JSON con el estado de éxito y un mensaje

#### GET `/GetCheckEncryptionStatus`
**Resumen:** Comprueba el estado de cifrado de la billetera  
**Devuelve:** JSON que indica el estado de cifrado

#### GET `/CheckPasswordNeeded`
**Resumen:** Comprueba si se necesita contraseña para las operaciones de la GUI  
**Devuelve:** Booleano que indica si se requiere contraseña

#### GET `/GetNewAddress`
**Resumen:** Genera una nueva dirección de billetera  
**Devuelve:** JSON con los detalles de la nueva dirección

#### GET `/GetWalletInfo`
**Resumen:** Obtiene la información completa de la billetera  
**Devuelve:** JSON con el saldo, la cantidad de direcciones y los detalles de la billetera

#### GET `/GetAllAddresses`
**Resumen:** Obtiene todas las direcciones de la billetera  
**Devuelve:** Arreglo de objetos de dirección con sus saldos

#### GET `/GetValidatorAddresses`
**Resumen:** Obtiene las direcciones que pueden ser validadoras  
**Devuelve:** Arreglo de direcciones que pueden validar

#### GET `/GetAddressInfo/{id}`
**Resumen:** Obtiene la información de una dirección específica  
**Parámetros:**
- `id` (string, ruta) - Dirección de la billetera  
**Devuelve:** Detalles de la dirección, incluidos el saldo y el estado de validación

#### GET `/GetChainBalance/{rbxAddress}`
**Resumen:** Obtiene el saldo desde el estado de la blockchain  
**Parámetros:**
- `rbxAddress` (string, ruta) - Dirección de VFX  
**Devuelve:** Saldo actual según el estado de la cadena

#### GET `/ImportPrivateKey/{id}/{scan?}`
**Resumen:** Importa una clave privada a la billetera  
**Parámetros:**
- `id` (string, ruta) - Clave privada  
- `scan` (bool?, ruta, opcional) - Escanea la blockchain en busca de transacciones  
**Devuelve:** Estado del resultado de la importación

### Endpoints de validación

#### GET `/IsValidating`
**Resumen:** Comprueba si se está validando actualmente  
**Devuelve:** Estado de validación como booleano

#### GET `/TurnOnValidator/{id}`
**Resumen:** Activa el validador para una dirección  
**Parámetros:**
- `id` (string, ruta) - Dirección del validador  
**Devuelve:** Resultado de la activación

#### GET `/TurnOffValidator/{id}`
**Resumen:** Desactiva el validador  
**Parámetros:**
- `id` (string, ruta) - Dirección del validador  
**Devuelve:** Resultado de la desactivación

#### GET `/StartValidating/{addr}/{uname}`
**Resumen:** Inicia el proceso de validación  
**Parámetros:**
- `addr` (string, ruta) - Dirección del validador  
- `uname` (string, ruta) - Nombre de usuario  
**Devuelve:** Resultado del inicio de la validación

### Endpoints de transacciones

#### GET `/SendTransaction/{faddr}/{taddr}/{amt}`
**Resumen:** Envía una transacción (método obsoleto)  
**Parámetros:**
- `faddr` (string, ruta) - Dirección de origen  
- `taddr` (string, ruta) - Dirección de destino  
- `amt` (decimal, ruta) - Monto  
**Devuelve:** Resultado de la transacción
**Nota:** Obsoleto: usa los métodos de la API V2

### Endpoints de utilidades

#### GET `/ValidateAddress/{**address}`
**Resumen:** Valida una dirección de VFX o un ADNR  
**Parámetros:**
- `address` (string, ruta, comodín) - Dirección o ADNR que se validará  
**Devuelve:** Resultado de la validación con información del formato

#### GET `/CreateSignature/{message}/{address}`
**Resumen:** Crea una firma criptográfica  
**Parámetros:**
- `message` (string, ruta) - Mensaje que se firmará  
- `address` (string, ruta) - Dirección firmante  
**Devuelve:** Firma generada

#### GET `/ValidateSignature/{message}/{address}/{**sigScript}`
**Resumen:** Valida una firma criptográfica  
**Parámetros:**
- `message` (string, ruta) - Mensaje original  
- `address` (string, ruta) - Dirección firmante  
- `sigScript` (string, ruta, comodín) - Firma que se validará  
**Devuelve:** Resultado de la validación

### Endpoints de consulta de la blockchain

#### GET `/GetMempool`
**Resumen:** Obtiene las transacciones actuales del mempool  
**Devuelve:** Arreglo de transacciones pendientes

#### GET `/GetBlockByHeight`
**Resumen:** Obtiene un bloque por su número de altura  
**Devuelve:** Información del bloque

#### GET `/GetBlockByHash`
**Resumen:** Obtiene un bloque por su hash  
**Devuelve:** Información del bloque

### Endpoints de red

#### GET `/AddPeer/{**ipAddr}`
**Resumen:** Agrega un par (peer) y se conecta a él  
**Parámetros:**
- `ipAddr` (string, ruta, comodín) - Dirección IP y puerto  
**Devuelve:** Resultado de la conexión

#### GET `/getabl`
**Resumen:** Obtiene la lista anti-lista negra (Anti-Black List)  
**Devuelve:** Entradas actuales de la lista anti-lista negra

#### GET `/checkaddress/{addr}`
**Resumen:** Comprueba si una dirección está en la lista negra  
**Parámetros:**
- `addr` (string, ruta) - Dirección que se comprobará  
**Devuelve:** Estado en la lista negra

## 2. API principal (V2)
**Rutas base:** `api/V2`, `api/V2/{somePassword?}`  
**Controlador:** V2Controller  

### Estado del sistema

#### GET `/`
**Resumen:** Comprueba el estado de la API V2  
**Devuelve:** Arreglo que indica el estado de la API V2

### Gestión de saldos

#### GET `/GetBalances`
**Resumen:** Obtiene los saldos de VFX y de tokens de todas las cuentas  
**Devuelve:** Información completa de saldos de todas las direcciones

#### GET `/GetStateBalance/{address}`
**Resumen:** Obtiene el saldo desde el estado de la cadena para una dirección específica  
**Parámetros:**
- `address` (string, ruta) - Dirección de VFX  
**Devuelve:** Saldo actual según el estado de la blockchain

### ADNR (resolución de nombres de direcciones)

#### GET `/ResolveAdnr/{**adnr}`
**Resumen:** Resuelve un ADNR a una dirección  
**Parámetros:**
- `adnr` (string, ruta, comodín) - ADNR que se resolverá (admite .vfx, .rbx, .btc)  
**Devuelve:** Información de la dirección resuelta

#### GET `/ResolveAddressAdnr/{address}/{asset}`
**Resumen:** Obtiene el ADNR a partir de la dirección y el tipo de activo  
**Parámetros:**
- `address` (string, ruta) - Dirección que se buscará  
- `asset` (string, ruta) - Tipo de activo  
**Devuelve:** ADNR asociado

### Información de validadores y de la red

#### GET `/GetWinningProofs`
**Resumen:** Obtiene las pruebas ganadoras de los validadores  
**Devuelve:** Pruebas ganadoras actuales de los validadores

#### GET `/ValidatorPool`
**Resumen:** Obtiene el pool de validadores de la red  
**Devuelve:** Lista de validadores activos

#### GET `/ConsensusHeaderQueue`
**Resumen:** Obtiene la cola de encabezados de consenso  
**Devuelve:** Estado actual de la cola de consenso

#### GET `/Producers`
**Resumen:** Obtiene el diccionario de productores  
**Devuelve:** Información de los productores de bloques

#### GET `/FailedProducers`
**Resumen:** Obtiene los productores de bloques fallidos  
**Devuelve:** Lista de productores fallidos

#### GET `/BannedFailedProducers`
**Resumen:** Obtiene los productores fallidos vetados  
**Devuelve:** Información de los productores vetados

#### GET `/GetBackupProofs`
**Resumen:** Obtiene las pruebas de respaldo  
**Devuelve:** Pruebas de validación de respaldo

#### GET `/GetFinalizedProofs`
**Resumen:** Obtiene las pruebas finalizadas  
**Devuelve:** Pruebas de validación finalizadas

#### GET `/GetNextValBlock`
**Resumen:** Obtiene el siguiente bloque del validador  
**Devuelve:** Siguiente bloque que se validará

#### GET `/GetNetworkBlockQueue`
**Resumen:** Obtiene la cola de bloques de la red  
**Devuelve:** Cola de bloques actual de la red

#### GET `/GetValLists`
**Resumen:** Obtiene las listas de validadores  
**Devuelve:** Información de las listas de validadores

#### GET `/GetCasterRounds`
**Resumen:** Obtiene la información de las rondas de casters  
**Devuelve:** Datos de las rondas de los casters de bloques

### Procesamiento de imágenes

#### POST `/GetImageUncompressedByte`
**Resumen:** Descomprime una imagen base64 a un arreglo de bytes  
**Cuerpo de la solicitud:** Cadena de imagen en base64  
**Devuelve:** Arreglo de bytes descomprimido

#### POST `/GetImageUncompressedBase`
**Resumen:** Descomprime una imagen base64 a una cadena  
**Cuerpo de la solicitud:** Cadena de imagen en base64  
**Devuelve:** Cadena de imagen descomprimida

## 3. API de integración con Bitcoin
**Rutas base:** `btcapi/BTCV2`, `btcapi/BTCV2/{somePassword?}`  
**Controlador:** BTCV2Controller  

### Estado de la API

#### GET `/`
**Resumen:** Comprueba el estado de la API de Bitcoin  
**Devuelve:** `["VFX/BTC-Wallet", "BTC API Standard V2"]`

### Gestión de direcciones

#### GET `/GetDefaultAddressType`
**Resumen:** Obtiene el tipo de dirección de Bitcoin predeterminado  
**Devuelve:** Configuración actual del tipo de dirección

#### GET `/GetNewAddress`
**Resumen:** Crea una nueva dirección de Bitcoin  
**Devuelve:** Detalles de la nueva dirección de Bitcoin

#### GET `/ImportPrivateKey/{privateKey}/{addressFormat?}`
**Resumen:** Importa una clave privada de Bitcoin  
**Parámetros:**
- `privateKey` (string, ruta) - Clave privada de Bitcoin  
- `addressFormat` (string?, ruta, opcional) - Formato de dirección preferido  
**Devuelve:** Resultado de la importación

### Gestión de cuentas

#### GET `/GetBitcoinAccountList/{omitKeys?}`
**Resumen:** Obtiene todas las cuentas de Bitcoin  
**Parámetros:**
- `omitKeys` (bool?, ruta, opcional) - Omite las claves privadas en la respuesta  
**Devuelve:** Lista de cuentas de Bitcoin

#### GET `/GetBitcoinAccount/{address}/{omitKeys?}`
**Resumen:** Obtiene una cuenta de Bitcoin específica  
**Parámetros:**
- `address` (string, ruta) - Dirección de Bitcoin  
- `omitKeys` (bool?, ruta, opcional) - Omite las claves privadas  
**Devuelve:** Detalles de la cuenta

#### GET `/ResetAccount`
**Resumen:** Restablece las cuentas de Bitcoin y los UTXO  
**Devuelve:** Resultado de la operación de restablecimiento

### Gestión de UTXO

#### GET `/GetAddressUTXOList/{address}`
**Resumen:** Obtiene los UTXO de una dirección de Bitcoin  
**Parámetros:**
- `address` (string, ruta) - Dirección de Bitcoin  
**Devuelve:** Lista de salidas de transacción no gastadas

#### GET `/GetAddressTXList/{address}`
**Resumen:** Obtiene la lista de transacciones de una dirección de Bitcoin  
**Parámetros:**
- `address` (string, ruta) - Dirección de Bitcoin  
**Devuelve:** Historial de transacciones

### Transacciones de Bitcoin

#### GET `/SendTransaction/{faddr}/{taddr}/{amt}/{feeRate}/{overrideInternalSend?}`
**Resumen:** Envía una transacción de Bitcoin  
**Parámetros:**
- `faddr` (string, ruta) - Dirección de origen  
- `taddr` (string, ruta) - Dirección de destino  
- `amt` (decimal, ruta) - Monto en BTC  
- `feeRate` (decimal, ruta) - Tasa de comisión (sat/vB)  
- `overrideInternalSend` (bool?, ruta, opcional) - Anula la lógica de envío interno  
**Devuelve:** Resultado de la transacción

#### GET `/CalculateFee/{faddr}/{taddr}/{amt}/{feeRate}`
**Resumen:** Calcula la comisión de una transacción de Bitcoin  
**Parámetros:**
- `faddr` (string, ruta) - Dirección de origen  
- `taddr` (string, ruta) - Dirección de destino  
- `amt` (decimal, ruta) - Monto  
- `feeRate` (decimal, ruta) - Tasa de comisión  
**Devuelve:** Monto de la comisión calculada

### Gestión de ADNR

#### GET `/CreateAdnr/{address}/{btcAddress}/{name}`
**Resumen:** Crea un ADNR de Bitcoin  
**Parámetros:**
- `address` (string, ruta) - Dirección de VFX  
- `btcAddress` (string, ruta) - Dirección de Bitcoin  
- `name` (string, ruta) - Nombre del ADNR  
**Devuelve:** Resultado de la creación del ADNR

A partir de la altura del firmante de nombres BTC (bloque 7,575,250 en mainnet, bloque 7,400 en testnet, desde Core 9.0.1), el nodo firma `<unix seconds>:<address>:<name>.btc` con la clave de `btcAddress`, que debe estar en esta billetera con la billetera desbloqueada. La firma es válida durante 30 minutos. Pasa `name` sin `.btc`.

#### GET `/SignAdnrTransferAcceptance/{btcAddress}/{name}/{newOwner}`
**Resumen:** Firma, como receptor, que un nombre `.btc` puede transferirse a una de las direcciones de Bitcoin de esta billetera para un propietario de VFX  
**Parámetros:**
- `btcAddress` (string, ruta) - La dirección de Bitcoin de esta billetera que recibirá el nombre; su clave debe estar en esta billetera y la billetera debe estar desbloqueada  
- `name` (string, ruta) - El nombre, con o sin `.btc`  
- `newOwner` (string, ruta) - La dirección de VFX que será propietaria del nombre  
**Devuelve:** `{"Success": true, "Message": "Signed.", "BTCToMessage": "...", "BTCToSignature": "..."}`. `BTCToMessage` es `<unix seconds>:<newOwner>:<name>.btc`, y `BTCToSignature` es la firma de ese mensaje con la clave de Bitcoin receptora. Entrega ambos al remitente para `TransferAdnr`. La aceptación es válida durante 24 horas desde su marca de tiempo.

#### GET `/TransferAdnr/{toAddress}/{btcFromAddress}/{btcToAddress}?btcToMessage={message}&btcToSignature={signature}`
**Resumen:** Transfiere un ADNR de Bitcoin  
**Parámetros:**
- `toAddress` (string, ruta) - Dirección de VFX de destino  
- `btcFromAddress` (string, ruta) - Dirección de Bitcoin de origen  
- `btcToAddress` (string, ruta) - Dirección de Bitcoin de destino  
- `btcToMessage` (string, consulta, opcional) - El mensaje de aceptación del receptor, obtenido de `SignAdnrTransferAcceptance`  
- `btcToSignature` (string, consulta, opcional) - La firma de aceptación del receptor sobre `btcToMessage`  
**Devuelve:** Resultado de la transferencia

A partir de la altura del firmante de nombres BTC (`BtcNameSignerOwnsAddressHeight`: bloque 7,575,250 en mainnet, bloque 7,400 en testnet, desde Core 9.0.1), una transferencia debe incluir la aceptación firmada del nombre por parte de la dirección de Bitcoin receptora para el nuevo propietario. Antes de esa altura, los dos parámetros de consulta se ignoran.

- **Misma billetera:** cuando la clave de `btcToAddress` está en esta billetera, omite ambos parámetros. El nodo firma la aceptación por su cuenta.
- **Entre billeteras:** el receptor llama a `SignAdnrTransferAcceptance` en su propio nodo y le envía al remitente el mensaje y la firma. El remitente pasa ambos, codificados para URL, como `btcToMessage` y `btcToSignature`. La billetera SwitchBlade maneja el par como un único código de aceptación que se puede copiar, `<message>|<signature>`.
- La transferencia se rechaza si la aceptación indica otro propietario u otro nombre, si no está firmada con la clave de `btcToAddress` o si tiene más de 24 horas.

#### GET `/DeleteAdnr/{btcFromAddress}`
**Resumen:** Elimina un ADNR de Bitcoin  
**Parámetros:**
- `btcFromAddress` (string, ruta) - Dirección de Bitcoin  
**Devuelve:** Resultado de la eliminación

### vBTC (Bitcoin tokenizado)

:::caution[vBTC V1 está retirado]
Estas son las rutas de vBTC V1. V1 se retiró en el bloque 7,400,500 en mainnet (bloque 1 en testnet desde su reinicio de octubre de 2026): la red no acepta nuevos tokens, transferencias ni retiros de V1, y los saldos de V1 están congelados. vBTC V2 está en [`vbtcapi/VBTC`](#15-api-de-vbtc-v2-novedades-de-90); consulta [vBTC](/es/build/vbtc/integration/).
:::

#### POST `/TokenizeBitcoin`
**Resumen:** Crea tokens vBTC a partir de Bitcoin  
**Cuerpo de la solicitud:** Parámetros de tokenización  
**Devuelve:** Resultado de la tokenización

#### GET `/GetTokenizationDetails/{vfxAddress}`
**Resumen:** Obtiene los detalles de tokenización de una dirección  
**Parámetros:**
- `vfxAddress` (string, ruta) - Dirección de VFX  
**Devuelve:** Información de tokenización

#### GET `/GetvBTCBalance/{address}/{scUID}`
**Resumen:** Obtiene el saldo de vBTC de un contrato inteligente específico  
**Parámetros:**
- `address` (string, ruta) - Dirección de VFX  
- `scUID` (string, ruta) - UID del contrato inteligente  
**Devuelve:** Saldo de vBTC

#### GET `/GetAllvBTCBalances/{address}`
**Resumen:** Obtiene todos los saldos de vBTC de una dirección  
**Parámetros:**
- `address` (string, ruta) - Dirección de VFX  
**Devuelve:** Todos los saldos de vBTC

#### POST `/TransferCoin`
**Resumen:** Transfiere vBTC a la red de VFX  
**Cuerpo de la solicitud:** Parámetros de la transferencia  
**Devuelve:** Resultado de la transferencia

#### POST `/WithdrawalCoin`
**Resumen:** Retira vBTC de vuelta a Bitcoin  
**Cuerpo de la solicitud:** Parámetros del retiro  
**Devuelve:** Resultado del retiro

### Transmisión

#### GET `/Broadcast/{txHash}`
**Resumen:** Transmite una transacción de Bitcoin  
**Parámetros:**
- `txHash` (string, ruta) - Hash de la transacción  
**Devuelve:** Resultado de la transmisión

#### GET `/Rebroadcast/{txid}`
**Resumen:** Vuelve a transmitir una transacción de Bitcoin  
**Parámetros:**
- `txid` (string, ruta) - ID de la transacción  
**Devuelve:** Resultado de la retransmisión

## 4. API de contratos inteligentes
**Rutas base:** `scapi/SCV1`, `scapi/SCV1/{somePassword?}`  
**Controlador:** SCV1Controller  

### Estado de la API

#### GET `/`
**Resumen:** Comprobación del estado de la API de contratos inteligentes  
**Devuelve:** Información del estado de la API

#### GET `/{id}`
**Resumen:** Obtiene comandos específicos de contratos inteligentes  
**Parámetros:**
- `id` (string, ruta) - Identificador del comando  
**Devuelve:** Resultado del comando

### Endpoints de prueba

#### POST `/SCPassTest`
**Resumen:** Prueba el formato del payload JSON para contratos inteligentes  
**Cuerpo de la solicitud:** Payload JSON de prueba  
**Devuelve:** Resultado de la prueba de formato

#### POST `/SCPassDesTest`
**Resumen:** Prueba la deserialización de JSON para contratos inteligentes  
**Cuerpo de la solicitud:** JSON para probar la deserialización  
**Devuelve:** Resultado de la prueba de deserialización

### Consultas de contratos inteligentes

#### GET `/GetCurrentSCOwner/{scUID}`
**Resumen:** Obtiene el propietario actual del contrato inteligente  
**Parámetros:**
- `scUID` (string, ruta) - Identificador único del contrato inteligente  
**Devuelve:** Dirección del propietario actual

#### GET `/GetAllSmartContracts/{pageNumber}`
**Resumen:** Obtiene una lista paginada de todos los contratos inteligentes  
**Parámetros:**
- `pageNumber` (int, ruta) - Número de página para la paginación  
**Devuelve:** Lista paginada de contratos inteligentes

#### GET `/GetAllSmartContracts/{pageNumber}/{**search}`
**Resumen:** Obtiene contratos inteligentes con un filtro de búsqueda  
**Parámetros:**
- `pageNumber` (int, ruta) - Número de página  
- `search` (string, ruta, comodín) - Términos de búsqueda  
**Devuelve:** Lista filtrada de contratos inteligentes

#### GET `/GetAllSmartContracts/{pageNumber}/{excludeToken?}`
**Resumen:** Obtiene contratos inteligentes excluyendo los tokens  
**Parámetros:**
- `pageNumber` (int, ruta) - Número de página  
- `excludeToken` (bool?, ruta, opcional) - Excluye los contratos de tokens  
**Devuelve:** Lista filtrada de contratos inteligentes

#### GET `/GetAllSmartContracts/{pageNumber}/{excludeToken?}/{tokensOnly?}`
**Resumen:** Obtiene contratos inteligentes con filtrado de tokens  
**Parámetros:**
- `pageNumber` (int, ruta) - Número de página  
- `excludeToken` (bool?, ruta, opcional) - Excluye los tokens  
- `tokensOnly` (bool?, ruta, opcional) - Muestra solo tokens  
**Devuelve:** Lista filtrada de contratos inteligentes

#### GET `/GetAllSmartContracts/{pageNumber}/{excludeToken?}/{tokensOnly?}/{**search}`
**Resumen:** Obtiene contratos inteligentes con un filtrado completo  
**Parámetros:**
- `pageNumber` (int, ruta) - Número de página  
- `excludeToken` (bool?, ruta, opcional) - Excluye los tokens  
- `tokensOnly` (bool?, ruta, opcional) - Solo tokens  
- `search` (string, ruta, comodín) - Términos de búsqueda  
**Devuelve:** Lista con filtrado completo

#### GET `/GetMintedSmartContracts/{pageNumber}`
**Resumen:** Obtiene los contratos inteligentes emitidos, paginados  
**Parámetros:**
- `pageNumber` (int, ruta) - Número de página  
**Devuelve:** Contratos inteligentes emitidos

#### GET `/GetMintedSmartContracts/{pageNumber}/{**search}`
**Resumen:** Obtiene los contratos inteligentes emitidos con búsqueda  
**Parámetros:**
- `pageNumber` (int, ruta) - Número de página  
- `search` (string, ruta, comodín) - Términos de búsqueda  
**Devuelve:** Contratos emitidos filtrados

#### GET `/GetSingleSmartContract/{id}`
**Resumen:** Obtiene los detalles de un contrato inteligente específico  
**Parámetros:**
- `id` (string, ruta) - Identificador del contrato inteligente  
**Devuelve:** Información completa del contrato inteligente

### Operaciones de NFTs

#### GET `/TransferNFT/{id}/{toAddress}`
**Resumen:** Transfiere un NFT a otra dirección  
**Parámetros:**
- `id` (string, ruta) - Identificador del NFT  
- `toAddress` (string, ruta) - Dirección de destino  
**Devuelve:** Resultado de la transferencia

#### GET `/TransferNFT/{id}/{toAddress}/{**backupURL}`
**Resumen:** Transfiere un NFT con una URL de respaldo  
**Parámetros:**
- `id` (string, ruta) - Identificador del NFT  
- `toAddress` (string, ruta) - Dirección de destino  
- `backupURL` (string, ruta, comodín) - URL del almacenamiento de respaldo  
**Devuelve:** Resultado de la transferencia

#### GET `/TransferSale/{scUID}/{toAddress}/{saleAmount}`
**Resumen:** Transfiere un NFT con un monto de venta  
**Parámetros:**
- `scUID` (string, ruta) - UID del contrato inteligente  
- `toAddress` (string, ruta) - Dirección del comprador  
- `saleAmount` (decimal, ruta) - Precio de venta  
**Devuelve:** Resultado de la transferencia de venta

#### GET `/TransferSale/{scUID}/{toAddress}/{saleAmount}/{**backupURL}`
**Resumen:** Transfiere una venta de NFT con una URL de respaldo  
**Parámetros:**
- `scUID` (string, ruta) - UID del contrato inteligente  
- `toAddress` (string, ruta) - Dirección del comprador  
- `saleAmount` (decimal, ruta) - Precio de venta  
- `backupURL` (string, ruta, comodín) - URL de respaldo  
**Devuelve:** Resultado de la transferencia de venta

## 5. API de tokens V2
**Rutas base:** `tkapi/TKV2`, `tkapi/TKV2/{somePassword?}`  
**Controlador:** TKV2Controller  

### Estado de la API

#### GET `/`
**Resumen:** Comprueba el estado de la API de tokens  
**Devuelve:** Información del estado de la API de tokens

### Información de tokens

#### GET `/GetTokens/{scUID}/{getAll}`
**Resumen:** Obtiene la información del token de un contrato inteligente  
**Parámetros:**
- `scUID` (string, ruta) - Identificador único del contrato inteligente  
- `getAll` (bool, ruta) - Obtiene todos los detalles del token  
**Devuelve:** Información del contrato del token

#### GET `/GetTokensUpdate`
**Resumen:** Actualiza la lista de tokens en memoria  
**Devuelve:** Resultado de la operación de actualización

### Operaciones de tokens

#### GET `/TransferToken/{scUID}/{fromAddress}/{toAddress}/{amount}`
**Resumen:** Transfiere tokens entre direcciones  
**Parámetros:**
- `scUID` (string, ruta) - UID del contrato inteligente  
- `fromAddress` (string, ruta) - Dirección de origen  
- `toAddress` (string, ruta) - Dirección de destino  
- `amount` (decimal, ruta) - Monto de tokens  
**Devuelve:** Resultado de la transacción de transferencia

#### GET `/BurnToken/{scUID}/{fromAddress}/{amount}`
**Resumen:** Quema tokens en circulación  
**Parámetros:**
- `scUID` (string, ruta) - UID del contrato inteligente  
- `fromAddress` (string, ruta) - Dirección desde la que se quemará  
- `amount` (decimal, ruta) - Monto que se quemará  
**Devuelve:** Resultado de la transacción de quema

#### GET `/TokenMint/{scUID}/{fromAddress}/{amount}`
**Resumen:** Emite nuevos tokens  
**Parámetros:**
- `scUID` (string, ruta) - UID del contrato inteligente  
- `fromAddress` (string, ruta) - Dirección emisora (debe ser la propietaria)  
- `amount` (decimal, ruta) - Monto que se emitirá  
**Devuelve:** Resultado de la transacción de emisión

### Administración del contrato

#### GET `/PauseTokenContract/{scUID}/{fromAddress}`
**Resumen:** Pausa las operaciones del contrato del token  
**Parámetros:**
- `scUID` (string, ruta) - UID del contrato inteligente  
- `fromAddress` (string, ruta) - Dirección del propietario  
**Devuelve:** Resultado de la operación de pausa

#### GET `/BanAddress/{scUID}/{fromAddress}/{banAddress}`
**Resumen:** Veta una dirección de las operaciones del token  
**Parámetros:**
- `scUID` (string, ruta) - UID del contrato inteligente  
- `fromAddress` (string, ruta) - Dirección del propietario  
- `banAddress` (string, ruta) - Dirección que se bloqueará  
**Devuelve:** Resultado de la operación de bloqueo

#### GET `/ChangeTokenContractOwnership/{scUID}/{fromAddress}/{toAddress}`
**Resumen:** Transfiere la propiedad del contrato del token  
**Parámetros:**
- `scUID` (string, ruta) - UID del contrato inteligente  
- `fromAddress` (string, ruta) - Propietario actual  
- `toAddress` (string, ruta) - Nuevo propietario  
**Devuelve:** Resultado de la transferencia de propiedad

## 6. API de transacciones
**Rutas base:** `txapi/TXV1`, `txapi/TXV1/{somePassword?}`  
**Controlador:** TXV1Controller  

### Funciones de utilidad

#### GET `/GetTimestamp`
**Resumen:** Obtiene la marca de tiempo Unix actual  
**Devuelve:** Valor actual de la marca de tiempo

### Consultas de transacciones locales

#### GET `/GetSuccessfulLocalTX`
**Resumen:** Obtiene las transacciones locales exitosas  
**Devuelve:** Lista de transacciones locales completadas

#### GET `/GetReserveLocalTX`
**Resumen:** Obtiene las transacciones de las cuentas de reserva  
**Devuelve:** Historial de transacciones de las cuentas de reserva

#### GET `/GetMinedLocalTX`
**Resumen:** Obtiene las transacciones de recompensas minadas  
**Devuelve:** Lista de transacciones de recompensas de minado

## 7. API de comercio de DecShop
**Rutas base:** `dstapi/DSTV1`, `dstapi/DSTV1/{somePassword?}`  
**Controlador:** DSTV1Controller  

### Estado de la API

#### GET `/`
**Resumen:** Comprueba el estado de la API de DecShop  
**Devuelve:** Información del estado de la API

### Gestión de colecciones

#### POST `/SaveCollection`
**Resumen:** Guarda o actualiza una colección de NFTs  
**Cuerpo de la solicitud:** Objeto de datos de la colección  
**Devuelve:** Resultado de la operación de guardado

#### GET `/GetCollection/{collectionId}`
**Resumen:** Obtiene la información de una colección  
**Parámetros:**
- `collectionId` (string, ruta) - Identificador de la colección  
**Devuelve:** Detalles de la colección

#### GET `/GetAllCollections`
**Resumen:** Obtiene todas las colecciones  
**Devuelve:** Lista de todas las colecciones de NFTs

#### GET `/DeleteCollection/{collectionId}`
**Resumen:** Elimina una colección  
**Parámetros:**
- `collectionId` (string, ruta) - Colección que se eliminará  
**Devuelve:** Resultado de la eliminación

### Gestión de publicaciones

#### POST `/SaveListing`
**Resumen:** Crea o actualiza una publicación de NFT  
**Cuerpo de la solicitud:** Objeto de datos de la publicación  
**Devuelve:** Resultado del guardado de la publicación

#### GET `/GetCollectionListings/{collectionId}`
**Resumen:** Obtiene las publicaciones de una colección  
**Parámetros:**
- `collectionId` (string, ruta) - Identificador de la colección  
**Devuelve:** Publicaciones activas de la colección

#### GET `/GetListing/{listingId}`
**Resumen:** Obtiene los detalles de una publicación específica  
**Parámetros:**
- `listingId` (string, ruta) - Identificador de la publicación  
**Devuelve:** Información completa de la publicación

### Conectividad de DecShop

#### GET `/ConnectToDecShop/{address}/{**url}`
**Resumen:** Se conecta a una instancia de DecShop  
**Parámetros:**
- `address` (string, ruta) - Dirección del propietario de la tienda  
- `url` (string, ruta, comodín) - URL de DecShop  
**Devuelve:** Resultado de la conexión

#### GET `/GetShopListings/{page}`
**Resumen:** Obtiene las publicaciones de la tienda con paginación  
**Parámetros:**
- `page` (int, ruta) - Número de página  
**Devuelve:** Publicaciones de la tienda paginadas

#### GET `/PingShop/{pingId}`
**Resumen:** Comprueba el estado de la conexión con la tienda  
**Parámetros:**
- `pingId` (string, ruta) - Identificador del ping  
**Devuelve:** Estado de la conexión

### Operaciones de comercio

#### POST `/SendBid`
**Resumen:** Envía una oferta en una publicación  
**Cuerpo de la solicitud:** Objeto con los detalles de la oferta  
**Devuelve:** Resultado del envío de la oferta

#### POST `/SendBuyNowBid`
**Resumen:** Envía una oferta de compra inmediata  
**Cuerpo de la solicitud:** Detalles de la oferta de compra inmediata  
**Devuelve:** Resultado de la compra

#### POST `/SendChatMessage`
**Resumen:** Envía un mensaje de chat a una publicación  
**Cuerpo de la solicitud:** Objeto del mensaje de chat  
**Devuelve:** Resultado del envío del mensaje

#### GET `/GetBids/{sendReceive}`
**Resumen:** Obtiene la información de las ofertas  
**Parámetros:**
- `sendReceive` (string, ruta) - Filtro: "sent" (enviadas) o "received" (recibidas)  
**Devuelve:** Lista de ofertas según el filtro

### Finalización de la compra

#### GET `/CompleteNFTPurchase/{keySign}/{**scUID}`
**Resumen:** Completa la transacción de compra de un NFT  
**Parámetros:**
- `keySign` (string, ruta) - Firma de la transacción  
- `scUID` (string, ruta, comodín) - UID del contrato inteligente  
**Devuelve:** Resultado de la finalización de la compra

## 8. API de votación
**Rutas base:** `voapi/VOV1`, `voapi/VOV1/{somePassword?}`  
**Controlador:** VOV1Controller  

### Consultas de temas

#### GET `/GetAllTopics`
**Resumen:** Obtiene todos los temas de votación  
**Devuelve:** Lista completa de temas de votación

#### GET `/GetActiveTopics`
**Resumen:** Obtiene los temas de votación activos actualmente  
**Devuelve:** Temas de votación activos

#### GET `/GetInactiveTopics`
**Resumen:** Obtiene los temas de votación inactivos o cerrados  
**Devuelve:** Temas de votación cerrados

#### GET `/GetTopicDetails/{topicUID}`
**Resumen:** Obtiene la información detallada de un tema  
**Parámetros:**
- `topicUID` (string, ruta) - Identificador único del tema  
**Devuelve:** Detalles completos del tema

#### GET `/GetMyTopics`
**Resumen:** Obtiene los temas que creaste  
**Devuelve:** Temas creados por el usuario actual

#### GET `/GetMyVotes`
**Resumen:** Obtiene los votos que emitiste  
**Devuelve:** Tu historial de votación

#### GET `/GetTopicVotes/{topicUID}`
**Resumen:** Obtiene todos los votos de un tema específico  
**Parámetros:**
- `topicUID` (string, ruta) - Identificador del tema  
**Devuelve:** Resultados de la votación del tema

#### GET `/GetSearchTopics/{**search}`
**Resumen:** Busca temas por palabras clave  
**Parámetros:**
- `search` (string, ruta, comodín) - Términos de búsqueda  
**Devuelve:** Temas que coinciden

### Operaciones de votación

#### GET `/CastTopicVote/{topicUID}/{voteType}`
**Resumen:** Emite un voto en un tema  
**Parámetros:**
- `topicUID` (string, ruta) - Identificador del tema  
- `voteType` (string, ruta) - Opción de voto  
**Devuelve:** Resultado de la emisión del voto

#### POST `/PostNewTopic`
**Resumen:** Crea un nuevo tema de votación  
**Cuerpo de la solicitud:** Datos para crear el tema  
**Devuelve:** Resultado de la creación del tema

## 9. API de Beacon
**Rutas base:** `bcapi/BCV1`, `bcapi/BCV1/{somePassword?}`  
**Controlador:** BCV1Controller  

### Gestión de beacons

#### GET `/CreateBeacon/{name}/{isPrivate}/{autoDelete}/{fileCachePeriod}/{port}`
**Resumen:** Crea un nuevo beacon para la retransmisión de activos  
**Parámetros:**
- `name` (string, ruta) - Nombre del beacon  
- `isPrivate` (bool, ruta) - Indicador de beacon privado  
- `autoDelete` (bool, ruta) - Eliminación automática cuando está inactivo  
- `fileCachePeriod` (int, ruta) - Período de caché en minutos  
- `port` (int, ruta) - Puerto del beacon (0 para automático)  
**Devuelve:** Resultado de la creación del beacon

#### GET `/GetBeacons`
**Resumen:** Obtiene la lista de beacons locales  
**Devuelve:** Información de los beacons locales

#### GET `/AddBeacon/{name}/{port}/{**ip}`
**Resumen:** Agrega un beacon externo a la red  
**Parámetros:**
- `name` (string, ruta) - Nombre del beacon  
- `port` (int, ruta) - Puerto del beacon  
- `ip` (string, ruta, comodín) - Dirección IP  
**Devuelve:** Resultado de agregar el beacon

#### GET `/DeleteBeacon/{id}`
**Resumen:** Elimina un beacon por ID  
**Parámetros:**
- `id` (string, ruta) - Identificador del beacon  
**Devuelve:** Resultado de la eliminación

#### GET `/SetBeaconState`
**Resumen:** Alterna el estado activo o inactivo del beacon  
**Devuelve:** Resultado del cambio de estado

### Operaciones de beacons

#### GET `/DecodeBeaconLocator/{**locator}`
**Resumen:** Decodifica la cadena localizadora del beacon  
**Parámetros:**
- `locator` (string, ruta, comodín) - Localizador del beacon  
**Devuelve:** Información decodificada del beacon

#### GET `/GetBeaconAssets/{scUID}/{locators}/{address}/{**signature}`
**Resumen:** Obtiene activos de la red de beacons  
**Parámetros:**
- `scUID` (string, ruta) - UID del contrato inteligente  
- `locators` (string, ruta) - Localizadores de activos  
- `address` (string, ruta) - Dirección del solicitante  
- `signature` (string, ruta, comodín) - Firma de la solicitud  
**Devuelve:** Datos de activos de los beacons

#### GET `/GetAssetQueue`
**Resumen:** Obtiene la cola de procesamiento de activos del beacon  
**Devuelve:** Estado actual de la cola de activos

## 10. API de tienda web
**Rutas base:** `wsapi/WebShopV1`, `wsapi/WebShopV1/{somePassword?}`  
**Controlador:** WebShopV1Controller  

### Estado de la API

#### GET `/`
**Resumen:** Comprueba el estado de la API de tienda web  
**Devuelve:** Información del estado de la API

### Gestión de varias tiendas

#### GET `/ConnectToDecShop/{address}/{**url}`
**Resumen:** Se conecta a DecShop (versión para varias tiendas)  
**Parámetros:**
- `address` (string, ruta) - Dirección del propietario de la tienda  
- `url` (string, ruta, comodín) - URL de DecShop  
**Devuelve:** Resultado de la conexión

#### GET `/PingShop/{pingId}/{**url}`
**Resumen:** Hace ping a la conexión de una tienda específica  
**Parámetros:**
- `pingId` (string, ruta) - Identificador del ping  
- `url` (string, ruta, comodín) - URL de la tienda  
**Devuelve:** Resultado del ping

#### GET `/GetDecShopData`
**Resumen:** Obtiene los datos de la tienda guardados en memoria  
**Devuelve:** Datos de la tienda en caché

#### GET `/GetConnections`
**Resumen:** Obtiene la lista de tiendas conectadas  
**Devuelve:** Información de las tiendas conectadas

### Operaciones de tiendas

#### GET `/GetShopSpecificAuction/{listingId}/{address}/{**shopURL}`
**Resumen:** Obtiene una subasta específica de una tienda  
**Parámetros:**
- `listingId` (string, ruta) - Identificador de la publicación  
- `address` (string, ruta) - Dirección de la tienda  
- `shopURL` (string, ruta, comodín) - URL de la tienda  
**Devuelve:** Detalles de la subasta

#### POST `/SendBid/{address}/{**shopURL}`
**Resumen:** Envía una oferta a una tienda específica  
**Parámetros:**
- `address` (string, ruta) - Dirección de la tienda  
- `shopURL` (string, ruta, comodín) - URL de la tienda  
**Cuerpo de la solicitud:** Datos de la oferta  
**Devuelve:** Resultado del envío de la oferta

#### POST `/SendChatMessage/{address}/{**shopURL}`
**Resumen:** Envía un mensaje de chat a una tienda  
**Parámetros:**
- `address` (string, ruta) - Dirección de la tienda  
- `shopURL` (string, ruta, comodín) - URL de la tienda  
**Cuerpo de la solicitud:** Mensaje de chat  
**Devuelve:** Resultado del envío del mensaje

#### GET `/Debug`
**Resumen:** Obtiene información de depuración de la API de tienda web  
**Devuelve:** Datos de depuración

## 11. API de cuentas de reserva
**Rutas base:** `rsapi/RSV1`, `rsapi/RSV1/{somePassword?}`  
**Controlador:** RSV1Controller  

### Gestión de cuentas de reserva

#### GET `/GetAllReserveAccounts`
**Resumen:** Obtiene todas las cuentas de reserva del sistema  
**Devuelve:** Lista de todas las cuentas de reserva

#### GET `/GetReserveAccountInfo/{address}`
**Resumen:** Obtiene la información de una cuenta de reserva específica  
**Parámetros:**
- `address` (string, ruta) - Dirección de la cuenta de reserva  
**Devuelve:** Detalles de la cuenta de reserva

#### GET `/GetReserveAccountNFTAssets/{scUID}/{address}/{**password}`
**Resumen:** Obtiene los activos NFT de una cuenta de reserva  
**Parámetros:**
- `scUID` (string, ruta) - UID del contrato inteligente  
- `address` (string, ruta) - Dirección de la cuenta de reserva  
- `password` (string, ruta, comodín) - Contraseña de acceso  
**Devuelve:** Información de los activos NFT

## 12. API del adjudicador
**Rutas base:** `adjapi/ADJV1`, `adjapi/ADJV1/{somePassword?}`  
**Controlador:** ADJV1Controller  

### Estado de la API

#### GET `/`
**Resumen:** Comprueba el estado de la API del adjudicador  
**Devuelve:** Información del estado de la API

### Información del estado de la red

#### GET `/GetDups`
**Resumen:** Obtiene el diccionario de duplicados  
**Devuelve:** Información de duplicados de la red

#### GET `/GetConsensusBroadcastTx`
**Resumen:** Obtiene las transacciones transmitidas para el consenso  
**Devuelve:** Datos de transacciones de consenso

#### GET `/GetFortisBroadcastTx`
**Resumen:** Obtiene las transacciones transmitidas del pool Fortis  
**Devuelve:** Datos de transacciones del pool Fortis

#### GET `/GetMasternodes`
**Resumen:** Obtiene la lista de masternodes  
**Devuelve:** Información actual de los masternodes

#### GET `/GetMasternodesSent`
**Resumen:** Obtiene los masternodes enviados  
**Devuelve:** Datos de los masternodes enviados

#### GET `/GetTaskAnswersList`
**Resumen:** Obtiene la lista de respuestas de tareas  
**Devuelve:** Respuestas de tareas de la red

#### GET `/GetAdjInfo`
**Resumen:** Obtiene la información del adjudicador  
**Devuelve:** Datos del estado del adjudicador

#### GET `/GetConsensusInfo`
**Resumen:** Obtiene la información detallada del consenso  
**Devuelve:** Datos completos del consenso

## 13. API del nodo validador
**Ruta base:** `valapi/Validator`  
**Controlador:** ValidatorController  

### Estado básico

#### GET `/`
**Resumen:** Saludo simple de la API del validador  
**Devuelve:** "Hello from Validator API"

### Operaciones del validador

#### POST `/Status`
**Resumen:** Envía una actualización del estado del validador  
**Cuerpo de la solicitud:** Datos del estado del validador  
**Devuelve:** Resultado del envío del estado

#### POST `/ReceiveWinningProof`
**Resumen:** Envía una prueba ganadora a la red  
**Cuerpo de la solicitud:** Datos de la prueba ganadora  
**Devuelve:** Resultado del envío de la prueba

#### GET `/SendWinningProof/{blockHeight}`
**Resumen:** Obtiene la prueba ganadora de una altura de bloque  
**Parámetros:**
- `blockHeight` (int, ruta) - Número de altura del bloque  
**Devuelve:** Datos de la prueba ganadora

#### GET `/GetCasterVote`
**Resumen:** Obtiene el voto actual del caster  
**Devuelve:** Información del voto actual del caster

### Operaciones de bloques

#### GET `/GetBlock/{blockHeight}`
**Resumen:** Obtiene un bloque por altura para validarlo  
**Parámetros:**
- `blockHeight` (int, ruta) - Altura del bloque  
**Devuelve:** Datos del bloque para validación

#### GET `/GetApproval/{blockHeight}`
**Resumen:** Obtiene el estado de aprobación del bloque  
**Parámetros:**
- `blockHeight` (int, ruta) - Altura del bloque  
**Devuelve:** Información de la aprobación

#### GET `/SendApproval/{blockHeight}/{validatorAddress}`
**Resumen:** Envía la aprobación del bloque  
**Parámetros:**
- `blockHeight` (int, ruta) - Altura del bloque  
- `validatorAddress` (string, ruta) - Dirección del validador  
**Devuelve:** Resultado del envío de la aprobación

### Salud de la red

#### GET `/HeartBeat/{address}`
**Resumen:** Heartbeat del validador con dirección  
**Parámetros:**
- `address` (string, ruta) - Dirección del validador  
**Devuelve:** Confirmación del heartbeat

#### GET `/HeartBeat`
**Resumen:** Heartbeat simple del validador  
**Devuelve:** Respuesta del heartbeat

### Operaciones de consenso

#### GET `/SendSeedPart`
**Resumen:** Obtiene la parte de la semilla para el consenso  
**Devuelve:** Parte de la semilla del consenso

#### GET `/VerifyBlock/{nextBlock}/{**proofHash}`
**Resumen:** Verifica un bloque con una prueba  
**Parámetros:**
- `nextBlock` (int, ruta) - Número del siguiente bloque  
- `proofHash` (string, ruta, comodín) - Hash de la prueba  
**Devuelve:** Resultado de la verificación del bloque

### Información de la red

#### GET `/Blockcasters`
**Resumen:** Obtiene la lista de blockcasters  
**Devuelve:** Información actual de los blockcasters

#### GET `/ValidatorInfo`
**Resumen:** Obtiene la información completa de los validadores  
**Devuelve:** Datos de la red de validadores

#### GET `/ClearAttestationGuard`
**Resumen:** Solo localhost. Olvida qué bloque firmó este caster en cada altura. El nodo guarda esas reclamaciones en disco para que un reinicio no las libere; esta es la forma deliberada de liberar una altura que nunca podrá certificarse con el bloque que firmó este nodo. Si se llama desde cualquier otra dirección, devuelve `401`  
**Devuelve:** `{"Success": true, "ClaimsRemoved": 3}`

## 14. API de integraciones
**Ruta base:** `iapi/IntegrationsV1`  
**Controlador:** IntegrationsV1Controller  

### Información de la red

#### GET `/Network`
**Resumen:** Obtiene la información completa de la red  
**Devuelve:** Estado y estadísticas completos de la red

#### GET `/Height`
**Resumen:** Obtiene la altura actual de la blockchain  
**Devuelve:** Número de la altura de bloque actual

#### GET `/LastBlock`
**Resumen:** Obtiene la información del último bloque  
**Devuelve:** Datos del bloque más reciente

## 15. API de vBTC V2 (novedades de 9.0)
**Rutas base:** `vbtcapi/VBTC`, `vbtcapi/VBTC/{somePassword?}`  
**Controlador:** VBTCController  

Esta sección cubre las rutas que Core 9.0 agrega a la API de vBTC V2: los retiros de bóvedas (vaults) que la cadena vigila, las lecturas de la certificación de Bitcoin y la fianza del validador (validator). Todo el ciclo de vida de una bóveda (creación, depósitos, transferencias, propiedad, retiros, incluido el retiro de varias bóvedas, bóvedas heredadas y S3C) está documentado con ejemplos en la página [vBTC](/es/build/vbtc/integration/), y el flujo con firmante externo en [Integración en bruto de vBTC](/es/build/vbtc/raw-integration/).

**Bóvedas vigiladas y heredadas.** A partir de la altura de registro de la certificación de Bitcoin (`BitcoinAttestationRecordHeight`; bloque 7,568,350 en mainnet; bloque 400 en testnet desde su reinicio de octubre de 2026), una bóveda recién creada es *vigilada*: sus depósitos y retiros se registran on-chain a partir de los informes de Bitcoin, y el saldo del propietario son sus monedas certificadas. El retiro de una bóveda vigilada no tiene transacción de finalización ni voto de cancelación. Después de que se mina la solicitud, la cadena fija la transacción de Bitcoin que la paga, y el retiro se completa cuando Bitcoin la confirma. Hasta que se fija, el solicitante puede cancelarlo, y la cancelación surte efecto cuando se mina. Si no se confirma, el solicitante puede subir su comisión (bump) o abandonarlo (release), ambas como una transacción `VBTC_V2_COIN_PIN` (tipo 44). Las bóvedas creadas antes de esa altura son *heredadas* (legacy). Conservan el flujo anterior de solicitud, finalización y cancelación hasta la altura de aplicación (`BitcoinAttestationHeight`; bloque 401 en testnet, definida en mainnet con el lanzamiento de 9.0, unas dos semanas después de la altura de registro). A partir de entonces quedan congeladas, y la finalización de retiros (tipo 28), el voto de cancelación (tipo 30), la finalización de salidas del puente (tipo 41) y el fallo de salidas del puente (tipo 42) se rechazan para todas las bóvedas. `GetVaultBitcoin` te indica de qué tipo es una bóveda.

### Flujos de retiro

Primero comprueba el tipo de la bóveda con `GET vbtcapi/VBTC/GetVaultBitcoin/{scUID}` (`Vault.Attested`, `Vault.Legacy`, `Vault.Frozen`). Ambos tipos comienzan igual: `POST vbtcapi/VBTC/RequestWithdrawal` cuando este nodo tiene la clave del solicitante, o `POST vbtcapi/VBTC/GetRawRequestWithdrawalTxData` y luego `POST vbtcapi/VBTC/SendRawRequestWithdrawalTx` para una clave externa.

**Bóveda vigilada** (creada a partir de la altura de registro):
1. Solicita el retiro. El vBTC se debita cuando se mina la solicitud.
2. Mientras no haya una transacción de Bitcoin fijada para el retiro (`Withdrawal.State` es `Waiting` y `Withdrawal.CanCancel` es `true` en `GetWithdrawalPin`), el solicitante puede cancelarlo con una `VBTC_V2_WITHDRAWAL_CANCEL` (tipo 29) ordinaria: `POST vbtcapi/VBTC/CancelWithdrawal` cuando este nodo tiene la clave del solicitante, `POST vbtcapi/VBTC/GetRawCancelWithdrawalTxData` y luego `POST vbtcapi/VBTC/SendRawCancelWithdrawalTx` para una clave externa, o `POST wallet/api/vbtc/withdraw/cancel` en la billetera integrada. Solo el solicitante puede cancelar. No hay voto de los validadores (un voto de tipo 30 se rechaza en una bóveda vigilada). El retiro se cierra como cancelado en el bloque que mina la cancelación, y se reembolsa el vBTC en depósito en garantía. Una vez que se fija una transacción de Bitcoin, la cancelación se rechaza y solo queda subir la comisión o liberar el retiro (paso 5). La parte de una salida del puente no se puede cancelar de esta forma.
3. La cadena fija la transacción de Bitcoin que paga el retiro, y los firmantes de la bóveda la firman. Dale seguimiento con `GET vbtcapi/VBTC/GetWithdrawalPin/{scUID}/{withdrawalRequestHash}` (en la billetera integrada: `GET wallet/api/vbtc/withdraw/pin/{scUID}/{requestHash}`). No hay transacción de finalización que enviar, y `POST vbtcapi/VBTC/CompleteWithdrawal` devuelve el estado de la fijación en lugar de firmar.
4. Bitcoin confirma el pago y el retiro se completa.
5. Si el pago no se confirma, sube su comisión (una transacción de tipo 44; la comisión más alta sale del retiro) o libéralo (también de tipo 44): las monedas vuelven a la bóveda y se reembolsa el vBTC, menos la comisión de Bitcoin de la liberación. Un retiro fijado no se puede cancelar.

   | | Subir comisión (bump) | Liberar (release) |
   | --- | --- | --- |
   | El nodo tiene la clave del solicitante | `POST vbtcapi/VBTC/BumpWithdrawalFee` | `POST vbtcapi/VBTC/ReleaseWithdrawal` |
   | Clave externa (construye, firma `Hash`, envía) | `POST vbtcapi/VBTC/GetRawBumpWithdrawalFeeTxData` y luego `POST vbtcapi/VBTC/SendRawBumpWithdrawalFeeTx` | `POST vbtcapi/VBTC/GetRawReleaseWithdrawalTxData` y luego `POST vbtcapi/VBTC/SendRawReleaseWithdrawalTx` |
   | Billetera de navegador integrada (cuenta del nodo) | `POST wallet/api/vbtc/withdraw/bumpfee` | `POST wallet/api/vbtc/withdraw/release` |

Una solicitud que todavía espera monedas puede vencer, y entonces su vBTC se reembolsa igual que en una cancelación. Una vez que su transacción de Bitcoin está fijada, ya no puede vencer.

**Bóveda heredada** (creada antes de la altura de registro), hasta la altura de aplicación:
1. Solicita el retiro.
2. Complétalo con `POST vbtcapi/VBTC/CompleteWithdrawal` (o `POST vbtcapi/VBTC/GetRawCompleteWithdrawalTxData` y luego `POST vbtcapi/VBTC/SendRawCompleteWithdrawalTx`), que firma y transmite la transacción de Bitcoin y registra la finalización (tipo 28).
3. Para cancelar, envía `POST vbtcapi/VBTC/CancelWithdrawal` (tipo 29); los validadores votan sobre la cancelación (tipo 30).

A partir de la altura de aplicación, una bóveda heredada queda congelada: nada debita su saldo, y la finalización de retiros (tipo 28), el voto de cancelación (tipo 30), la finalización de salidas del puente (tipo 41) y el fallo de salidas del puente (tipo 42) se rechazan para todas las bóvedas.

### Certificación de Bitcoin

#### GET `/GetBitcoinAttestationStatus`
**Resumen:** La capa de certificación según la guarda el estado de la cadena de este nodo: las tres alturas, la punta de Bitcoin que la cadena ha certificado, hasta dónde están registrados los eventos de las bóvedas, el conjunto de firmantes y las confirmaciones que necesita un bloque de Bitcoin antes de reportarse  
**Devuelve:** `{"Success": true, "Attestation": {...}}`

#### GET `/GetVaultBitcoin/{scUID}`
**Resumen:** El Bitcoin de una bóveda según lo guarda el consenso: el script de depósito, cada moneda no gastada y lo que la retiene, los totales a partir de los cuales se calcula el saldo del propietario y los retiros que siguen abiertos  
**Parámetros:**
- `scUID` (string, ruta) - El UID del contrato inteligente de la bóveda  
**Devuelve:** `Vault` (el tipo: `Attested`, `Legacy`, `FreezeHeight`, `Frozen`) y `Bitcoin`. Para una bóveda que la cadena no vigila, `Success` es `false`, `Bitcoin` es `null` y `Message` indica el motivo; `Vault` se completa de todos modos

#### GET `/GetBridgeExit/{baseBurnTxHash}`
**Resumen:** La salida del puente que la cadena guarda para una quema en Base: en espera, fijada, completada o fallida, y, para una salida en bóvedas vigiladas, la parte de cada bóveda con su transacción de Bitcoin  
**Parámetros:**
- `baseBurnTxHash` (string, ruta) - El hash de la transacción de quema en Base  
**Devuelve:** `{"Success": true, "Exit": {...}}`, o `Success: false` cuando no hay ninguna salida registrada para la quema

### Retiros de bóvedas vigiladas

#### GET `/GetWithdrawalPin/{scUID}/{withdrawalRequestHash}`
**Resumen:** En qué estado está un retiro de una bóveda vigilada: esperando monedas, con su transacción de Bitcoin fijada (con cada transacción fijada para él, sus comisiones y los bytes sin firmar), pagado, o cerrado y reembolsado. Se responde a partir del estado de la cadena, así que cualquier nodo da la misma respuesta  
**Parámetros:**
- `scUID` (string, ruta) - El UID del contrato inteligente de la bóveda  
- `withdrawalRequestHash` (string, ruta) - El hash de la transacción de solicitud de retiro  
**Devuelve:** `{"Success": true, "Attested": true, "Withdrawal": {...}}`. Para una bóveda que la cadena no vigila, `Success` es `false`, `Attested` es `false`, `Vault` indica su tipo y el retiro se completa con `CompleteWithdrawal` en su lugar. En una bóveda vigilada cuya solicitud todavía no se ha minado (o no corresponde a esa bóveda), `Success` es `false`, `Attested` es `true` y `Withdrawal` es `null`. Vuelve a intentarlo cuando se mine la solicitud.

#### POST `/BumpWithdrawalFee`
**Resumen:** Sube la comisión de Bitcoin de un retiro fijado que no se confirma, firmado por la cuenta del solicitante en este nodo. La cadena fija un reemplazo que gasta las mismas monedas; la comisión más alta sale del propio monto del retiro  
**Cuerpo de la solicitud:**
```json
{
  "SmartContractUID": "...",
  "RequestorAddress": "...", // the address that requested the withdrawal; it signs
  "WithdrawalRequestHash": "...",
  "FeeRate": 12 // sat/vB, above the rate the withdrawal's newest Bitcoin transaction pays
}
```
**Devuelve:** `{"Success": true, "FeeBumpTxHash": "...", "Release": false, ...}`. Dale seguimiento con `GetWithdrawalPin`.

#### POST `/ReleaseWithdrawal`
**Resumen:** Abandona un retiro fijado que no se confirma, firmado por la cuenta del solicitante en este nodo. La cadena fija una transacción de Bitcoin que devuelve las monedas a la bóveda; cuando Bitcoin la muestra, el retiro se cierra y se reembolsa el vBTC, menos la comisión de Bitcoin de esa transacción, y el solicitante puede volver a retirar. Si un pago del retiro se confirma primero, se paga como de costumbre  
**Cuerpo de la solicitud:** Igual que `BumpWithdrawalFee`; `FeeRate` debe ser mayor que la tasa que paga la transacción más reciente del retiro  
**Devuelve:** `{"Success": true, "FeeBumpTxHash": "...", "Release": true, ...}`

#### POST `/GetRawBumpWithdrawalFeeTxData`
#### POST `/GetRawReleaseWithdrawalTxData`
**Resumen:** Construye el aumento de comisión o la liberación de tipo 44 sin firmar para un solicitante cuya clave no tiene este nodo. Antes de devolverlo, el nodo lo comprueba con la misma regla que aplica la validación de bloques  
**Cuerpo de la solicitud:** Igual que `BumpWithdrawalFee`  
**Devuelve:** La transacción sin firmar (`Hash`, `Timestamp`, `FromAddress`, `ToAddress`, `Amount`, `Fee`, `Nonce`, `TransactionType`, `TransactionTypeId`, `Data`). Firma `Hash` y envíala con la ruta de envío correspondiente.

#### POST `/SendRawBumpWithdrawalFeeTx`
#### POST `/SendRawReleaseWithdrawalTx`
**Resumen:** Envía una transacción de tipo 44 firmada, construida con la ruta `GetRaw...TxData` correspondiente. Cada ruta de envío acepta solo lo que construyó su propia ruta de construcción, así que un aumento de comisión no se puede enviar por error como una liberación  
**Cuerpo de la solicitud:**
```json
{
  "Hash": "...", // the Hash the build route returned
  "Signature": "...", // the requester's signature over Hash
  "PublicKey": "..." // the requester's public key (required)
}
```
**Devuelve:** `{"Success": true, "Hash": "...", "Message": "..."}`

La billetera de navegador integrada del nodo tiene las mismas tres operaciones en `GET /wallet/api/vbtc/withdraw/pin/{scUID}/{requestHash}`, `POST /wallet/api/vbtc/withdraw/bumpfee` y `POST /wallet/api/vbtc/withdraw/release`, firmadas por la cuenta del nodo. El cuerpo del aumento de comisión y de la liberación está en camel-case, y `feeRate` es una cadena; un número JSON se rechaza con `400`:

```json
{
  "scUID": "...",
  "ownerAddress": "...", // the requester
  "requestHash": "...",
  "feeRate": "12"
}
```

### Fianza del validador

#### GET `/GetValidatorBond/{address}`
**Resumen:** La fianza de validador de cualquier dirección: si su participación está bloqueada, cuánto puede enviar, cuándo se desbloquea después de una salida y a partir de qué bloque cuenta para la ceremonia de claves de una bóveda  
**Parámetros:**
- `address` (string, ruta) - Dirección de VFX  
**Devuelve:** `Bond` con `RuleActive`, `RuleStartsAtHeight`, `Bonded`, `BondedAmount`, `Balance`, `Spendable`, `BondedAtHeight`, `ExitHeight`, `UnlocksAtHeight`, `ExitWaitBlocks`, `StakeLockedSinceHeight`, `CountsForKeyCeremoniesFromHeight`, `CountsForKeyCeremoniesNow`, `CountsForReportSignersFromHeight`, `Note`

#### POST `/ExitValidator/{address}`
**Resumen:** Envía la transacción de salida del validador para una dirección que tiene esta billetera. El validador deja de contar on-chain de inmediato, y sus 5,000 VFX en fianza se desbloquean 1,200 bloques después de que se mina la salida. También funciona para un validador que ya no está en ejecución. Si este nodo está validando con esa dirección, también deja de validar. Se rechaza antes de la altura de fianza de validadores (`ValidatorBondHeight`), cuando no hay ninguna participación bloqueada  
**Parámetros:**
- `address` (string, ruta) - La dirección de VFX del validador  
**Devuelve:** `{"Success": true, "ExitTxHash": "...", "Bond": {...}}`

Consulta [Ejecuta un validador](/es/node/validator/#10-detener-y-actualizar) para ver la salida completa.

## 16. API de privacidad: VFX blindado en bruto (novedades de 9.0)
**Rutas base:** `privacyapi/PrivacyV1`, `privacyapi/PrivacyV1/{somePassword?}`  
**Controlador:** PrivacyV1Controller  

Para billeteras que guardan sus propias claves y no mantienen una billetera blindada en este nodo, como una billetera web. El nodo lee el fondo, encuentra las notas de quien hace la llamada y ejecuta el probador; quien hace la llamada firma (solo al blindar) y envía. El resto del controlador de privacidad todavía no está documentado aquí.

- **Blindar (T→Z):** `GetRawShieldTxData` → firma `Hash` con la clave transparente → `SendRawPrivateTx` con `Hash` y `Signature`.
- **Desblindar (Z→T) y transferencia privada (Z→Z):** `GetRawUnshieldTxData` o `GetRawPrivateTransferTxData` con la dirección `zfx_` y su clave de visualización → `SendRawPrivateTx` solo con `Hash`. Estas se autorizan con la prueba de conocimiento cero, no con una firma.

:::caution
En este esquema, la clave de visualización da autoridad para gastar. Envíala solo a un nodo en el que confíes, por TLS.
:::

Una transacción construida espera en el nodo durante 30 minutos (`ExpiresUtc`). Un gasto también queda obsoleto cuando cambia la raíz de Merkle del fondo, así que envíala pronto y vuelve a construirla si aparece "merkle_root does not match".

Las respuestas son `{"Success": true, "Result": {...}}` o `{"Success": false, "Message": "..."}`.

#### POST `/GetRawShieldTxData`
**Resumen:** Un blindaje sin firmar y ya probado para una `FromAddress` que este nodo no tiene  
**Cuerpo de la solicitud:**
```json
{
  "FromAddress": "...",
  "RecipientZfxAddress": "zfx_...",
  "ShieldAmount": 10.0,
  "TransparentFee": null, // optional; the node calculates it when omitted
  "Memo": null // optional
}
```
**Devuelve:** `Result` con `Hash`, `Transaction`, `Fee`, `RequiresSignature` (`true`), `MerkleRoot`, `ExpiresUtc`

#### POST `/GetShieldedNotesRaw`
**Resumen:** Escaneo sin estado: las notas de VFX que una clave de visualización puede abrir, con su posición, su estado de gastada, pendiente y gastable, y su aleatoriedad. No necesita una billetera en este nodo  
**Cuerpo de la solicitud:**
```json
{
  "ZfxAddress": "zfx_...",
  "ViewingKey": "...", // 32 bytes, Base64 or 64 hex characters
  "FromHeight": null, // optional; default the proof-rules height once active, else 0
  "ToHeight": null, // optional; default the chain tip
  "IncludeSpent": false
}
```
**Devuelve:** `Result` con `Notes` (`Commitment`, `Amount`, `TreePosition`, `BlockHeight`, `Spent`, `PendingSpend`, `Spendable`, ...), `UnspentBalance`, `SpendableBalance`, `ProofRulesActive`

#### POST `/GetRawUnshieldTxData`
**Resumen:** Un desblindaje completo y ya probado a partir de las notas de quien hace la llamada. No necesita firma  
**Cuerpo de la solicitud:**
```json
{
  "ZfxAddress": "zfx_...",
  "ViewingKey": "...",
  "TransparentToAddress": "...",
  "TransparentAmount": 5.0,
  "InputCommitments": null // optional: spend exactly these 1 or 2 notes; the node selects when omitted
}
```
**Devuelve:** `Result` con `Hash`, `Transaction`, `Fee`, `SpentCommitments`, `ChangeAmount`, `MerkleRoot`, `ExpiresUtc`

#### POST `/GetRawPrivateTransferTxData`
**Resumen:** Una transferencia privada completa y ya probada a otra dirección `zfx_`, o a la tuya propia para consolidar. No necesita firma  
**Cuerpo de la solicitud:** `ZfxAddress`, `ViewingKey`, `RecipientZfxAddress`, `PaymentAmount`, `InputCommitments` (opcional)  
**Devuelve:** Igual que `GetRawUnshieldTxData`

#### POST `/VerifyRawPrivateTx`
**Resumen:** Ejecución de prueba: el verificador completo del nodo sobre una transacción construida, con la firma en el caso de un blindaje. No se transmite nada  
**Cuerpo de la solicitud:** `{"Hash": "...", "Signature": "..."}` (`Signature` solo para un blindaje)  
**Devuelve:** `Result` con `Hash` y `"Transaction verifies."`, o el motivo por el que no se verifica

#### POST `/SendRawPrivateTx`
**Resumen:** Envía una transacción construida: un blindaje con `Hash` y `Signature`, un desblindaje o una transferencia solo con `Hash`  
**Cuerpo de la solicitud:** `{"Hash": "...", "Signature": "..."}`  
**Devuelve:** `Result` con `Hash` y `Message`

## Patrones de respuesta comunes

### Formato de respuesta exitosa
```json
{
  "Success": true,
  "Message": "Operation completed successfully",
  "Data": { /* Response data */ }
}
```

### Formato de respuesta de error  
```json
{
  "Success": false,
  "Message": "Error description",
  "Data": null
}
```

### Autenticación
Todas las API admiten autenticación opcional por contraseña mediante el parámetro de ruta `{somePassword?}`.

### Tipos de parámetros
- **Parámetros de ruta**: valores obligatorios en la ruta de la URL
- **Parámetros de consulta**: valores opcionales en la cadena de consulta de la URL  
- **Cuerpo de la solicitud**: payload JSON para las solicitudes POST
- **Parámetros comodín** (`{**param}`): capturan segmentos completos de la ruta

### Códigos de estado HTTP
- **200 OK**: éxito
- **400 Bad Request**: parámetros no válidos
- **401 Unauthorized**: se requiere autenticación
- **404 Not Found**: recurso no encontrado
- **500 Internal Server Error**: error del servidor

Esta documentación completa cubre los 14 controladores de la API con información detallada de los endpoints para la integración con Swagger y los consumidores de la API.
