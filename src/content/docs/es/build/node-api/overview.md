---
sourceHash: "32339ba59f0d"
title: "Descripción general de la API del nodo de VFX CLI"
description: "Descripción general de los espacios de nombres de la API de VFX Core y para qué sirve cada uno."
sidebar:
  order: 1
---

Este documento ofrece una descripción general de los distintos espacios de nombres de la API y sus propósitos dentro de la API Kestrel de VFX Core.

## Espacios de nombres de la API de Core

### 1. **API principal** (`api/`)
- **Rutas base**: `api/v1`, `api/v2`
- **Controladores**: V1Controller, V2Controller
- **Propósito**: funcionalidad central de la blockchain, operaciones de billetera, gestión de saldos y operaciones generales del sistema
- **Funciones clave**:
  - Estado e información de la blockchain
  - Consultas de saldo y gestión del estado
  - Operaciones del bloque génesis
  - Gestión del pool de validadores (validators)
  - Operaciones de consenso de la red

### 2. **API de Beacon** (`bcapi/`)
- **Ruta base**: `bcapi/bcv1`
- **Controlador**: BCV1Controller
- **Propósito**: funcionalidad de la red de beacons para la retransmisión de activos y el almacenamiento distribuido
- **Funciones clave**:
  - Creación y gestión de beacons
  - Operaciones de retransmisión de activos
  - Descubrimiento de beacons en la red
  - Caché y distribución de archivos

### 3. **API de integración con Bitcoin** (`btcapi/`)
- **Ruta base**: `btcapi/btcv2`
- **Controlador**: BTCV2Controller
- **Propósito**: integración con la blockchain de Bitcoin y operaciones multicadena
- **Funciones clave**:
  - Gestión de direcciones de Bitcoin
  - Creación y transmisión de transacciones
  - Gestión de UTXO
  - Nombres de dominio BTC (ADNR `.btc`)
  - Datos de Bitcoin de la billetera a través de servidores Electrum (el consenso verifica por su cuenta el Bitcoin de las bóvedas (vaults); consulta [Integración con Bitcoin](/es/learn/bitcoin-integration/))

### 4. **API de contratos inteligentes** (`scapi/`)
- **Ruta base**: `scapi/scv1`
- **Controlador**: SCV1Controller
- **Propósito**: despliegue, gestión e interacción con contratos inteligentes
- **Funciones clave**:
  - Despliegue de contratos inteligentes
  - Operaciones y transferencias de NFTs
  - Gestión del estado de los contratos
  - Emisión y quema de activos
  - Búsqueda y descubrimiento de contratos

### 5. **API de tokens** (`tkapi/`)
- **Ruta base**: `tkapi/tkv2`
- **Controlador**: TKV2Controller
- **Propósito**: gestión y operaciones de contratos de tokens
- **Funciones clave**:
  - Transferencias de tokens y gestión de saldos
  - Emisión y quema de tokens
  - Gestión de la propiedad de los contratos
  - Funciones para bloquear direcciones y pausar
  - Administración de contratos de tokens

### 6. **API de transacciones** (`txapi/`)
- **Ruta base**: `txapi/txv1`
- **Controlador**: TXV1Controller
- **Propósito**: creación, validación y gestión de transacciones
- **Funciones clave**:
  - Construcción de transacciones
  - Cálculo de comisiones
  - Transmisión de transacciones
  - Operaciones del mempool
  - Historial y consultas de transacciones

### 7. **API de validadores** (`valapi/`)
- **Ruta base**: `valapi/validator`
- **Controlador**: ValidatorController
- **Propósito**: llamadas de consenso entre validadores. Este controlador no se sirve en el puerto de la API de la billetera: se ejecuta en el host del validador (`ValAPIPort`, 7294 en mainnet, 17294 en testnet) y no usa el filtro `ActionFilterController`
- **Funciones clave**:
  - Estado y heartbeat del validador
  - Validación y aprobación de bloques
  - Gestión de pruebas de consenso
  - Coordinación de la red de validadores
  - Operaciones de emisión de bloques (block casting)

### 8. **API de votación** (`voapi/`)
- **Ruta base**: `voapi/vov1`
- **Controlador**: VOV1Controller
- **Propósito**: operaciones del sistema de gobernanza y votación
- **Funciones clave**:
  - Emisión y gestión de votos
  - Creación y seguimiento de propuestas
  - Participación en la gobernanza
  - Resultados y estadísticas de votación

### 9. **API de reserva** (`rsapi/`)
- **Ruta base**: `rsapi/rsv1`
- **Controlador**: RSV1Controller
- **Propósito**: cuentas de reserva (de bóveda): direcciones `xRBX…` cuyas transacciones salientes esperan un plazo y se pueden devolver (call back) o recuperar
- **Funciones clave**:
  - Crear, restaurar y publicar cuentas de reserva
  - Envíos diferidos y transferencias de NFTs desde una cuenta de reserva
  - Devolución y recuperación de transacciones de reserva pendientes
  - Información de la cuenta de reserva y listas de transacciones

### 10. **API del adjudicador** (`adjapi/`)
- **Ruta base**: `adjapi/adjv1`
- **Controlador**: ADJV1Controller
- **Propósito**: lecturas de diagnóstico del estado de consenso del nodo
- **Funciones clave**:
  - Transmisiones duplicadas de validadores
  - Transacciones de transmisión del consenso y del pool de Fortis
  - Listas de masternodes (validadores) que ve el nodo
  - Información del adjudicador

### 11. **API de tiendas descentralizadas** (`dstapi/`)
- **Ruta base**: `dstapi/dstv1`
- **Controlador**: DSTV1Controller
- **Propósito**: tiendas descentralizadas (DST): el marketplace de NFTs alojado en el nodo
- **Funciones clave**:
  - Creación, publicación, actualización y eliminación de tiendas
  - Colecciones y publicaciones
  - Subastas, ofertas y compras inmediatas (buy now)
  - Chat entre comprador y vendedor

### 12. **API de tienda web** (`wsapi/`)
- **Ruta base**: `wsapi/webshopv1`
- **Controlador**: WebShopV1Controller
- **Propósito**: conectarse a la tienda descentralizada de otro nodo y comerciar en ella
- **Funciones clave**:
  - Conectarse a una tienda remota y hacerle ping
  - Leer los datos, las subastas y las ofertas de una tienda remota
  - Enviar ofertas y ofertas de compra inmediata
  - Chatear con el propietario de la tienda

### 13. **API de integraciones** (`iapi/`)
- **Ruta base**: `iapi/integrationsv1`
- **Controlador**: IntegrationsV1Controller
- **Propósito**: lecturas mínimas de la cadena para integraciones de terceros (exchanges, sitios de listados)
- **Funciones clave**:
  - `Network`: altura, hash y hora del último bloque, versión del bloque, versiones del CLI y de GitHub, antigüedad de la red, suministro total
  - `Height`: altura actual del bloque
  - `LastBlock`: el bloque más reciente

### 14. **API de privacidad** (`privacyapi/`)
- **Ruta base**: `privacyapi/privacyv1`
- **Controlador**: PrivacyV1Controller
- **Propósito**: capa de privacidad Prism (pruebas PLONK)
- **Funciones clave**:
  - Direcciones y saldos blindados
  - Blindaje, desblindaje y transferencias privadas de VFX y vBTC
  - Estado del fondo blindado y escaneos de la billetera
  - Estado de los parámetros de PLONK

### 15. **API de vBTC** (`vbtcapi/`)
- **Ruta base**: `vbtcapi/vbtc`
- **Controlador**: VBTCController
- **Propósito**: vBTC V2: bóvedas FROST, depósitos en bóvedas vigiladas, transferencias y retiros
- **Funciones clave**:
  - Registro de validadores de vBTC y ceremonias DKG
  - Creación de contratos de bóveda
  - Transferencias de vBTC, incluidas las transferencias desde varias bóvedas
  - Solicitud, finalización, subida de comisión, liberación y cancelación de retiros
  - Puente a Base (vBTC.b)

### 16. **API de la billetera de navegador** (`wallet/`)
- **Ruta base**: `wallet`
- **Controlador**: WalletController
- **Propósito**: rutas JSON detrás de la página de billetera de navegador integrada en el nodo (`/wallet`)
- **Funciones clave**:
  - Cuentas, transacciones y NFTs
  - Envíos de VFX y vBTC, retiros de vBTC y el puente a Base
  - Operaciones blindadas (Prism)

### 17. **API del explorador** (`explorer/`)
- **Ruta base**: `explorer`
- **Controlador**: ExplorerController
- **Propósito**: la página de explorador de bloques de solo lectura integrada en el nodo y sus rutas JSON
- **Funciones clave**:
  - Estadísticas, bloques, transacciones, direcciones, mempool y búsqueda (`explorer/api/...`)
  - Se sirve sin el token de la API ni el interruptor que habilita la API

## Funciones comunes a todas las API

### Autenticación
Todos los controladores del puerto de la API de la billetera, excepto el controlador del explorador, usan el atributo `ActionFilterController` para filtrar las solicitudes:

- **Token de la API**: cuando el nodo se inicia con `apitoken=<value>`, cada solicitud debe enviar el encabezado `apitoken: <value>`, o recibe `403`. Algunas lecturas de estado (`CheckStatus`, `GetCLIVersion`, `GetWalletInfo`, `NetworkMetrics`, `SyncBalances`, `Mother`, `Egg`) responden sin él.
- **Contraseña de la API**: con `AlwaysRequireAPIPassword=true` en la configuración, la contraseña va en el segmento opcional de ruta `{somePassword?}` (por ejemplo, `api/V1/{somePassword}/GetWalletInfo`); sin ella, la solicitud recibe `403`. El controlador de integraciones no tiene segmento de contraseña.
- **Billetera bloqueada**: mientras una billetera cifrada está bloqueada, las acciones que no son lecturas, retransmisiones sin procesar de transacciones firmadas externamente ni llamadas de desbloqueo devuelven `401` con "You must type in your encryption password first!".
- **Acceso de red**: la API escucha solo en loopback y rechaza los encabezados `Host` que no son de loopback y las solicitudes de navegador de otro origen. El argumento de inicio `openapi` (o `OpenAPI=true`) la abre en todas las interfaces, y el nodo rechaza `openapi` a menos que haya un token de la API (o una contraseña de la API con `AlwaysRequireAPIPassword=true`) configurado.

### Formato de respuesta
Las API suelen devolver respuestas JSON con un manejo de errores y un reporte de estado consistentes.

### Documentación de Swagger
Todos los endpoints están documentados con especificaciones Swagger/OpenAPI para pruebas interactivas y documentación. En una máquina que ejecuta el CLI, visita `http://localhost:7292/swagger` (o `http://localhost:17292/swagger` en testnet). Las llamadas a la API solo responden después de habilitar la API con el argumento de inicio `enableapi` o la opción `10` del menú principal. Consulta [Swagger](/es/build/node-api/swagger/).


## Notas de uso

1. **Control de versiones**: las API usan versiones (V1, V2) para mantener la compatibilidad con versiones anteriores
2. **Estructura de rutas**: la mayoría de las rutas siguen el patrón `{namespace}api/{controller}/{action}`, por ejemplo `txapi/TXV1/GetTimestamp`; las rutas de la billetera de navegador (`wallet/api/...`) y del explorador (`explorer/api/...`) son las excepciones
3. **Seguridad**: consulta [Autenticación](#autenticación) más arriba
4. **Operaciones asíncronas**: la mayoría de las operaciones son asíncronas para un mejor rendimiento

Esta estructura ofrece una superficie completa de API REST para toda la funcionalidad de VFX Core, organizada por áreas de cada dominio.


## Detalles de los endpoints de la API
Puedes encontrar los detalles de cada endpoint [aquí](/es/build/node-api/details/).
