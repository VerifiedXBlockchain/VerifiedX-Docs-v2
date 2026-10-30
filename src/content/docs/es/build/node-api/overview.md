---
sourceHash: 3189151158b8
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
  - Operaciones de tokenización de Bitcoin
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
- **Propósito**: operaciones de nodos validadores y mecanismos de consenso
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
- **Propósito**: operaciones de bloques de reserva y funciones especiales de la blockchain
- **Funciones clave**:
  - Gestión de bloques de reserva
  - Manejo de transacciones especiales
  - Operaciones de reserva de la red
  - Utilidades avanzadas de la blockchain

### 10. **API del adjudicador** (`adjapi/`)
- **Ruta base**: `adjapi/adjv1`
- **Controlador**: ADJV1Controller
- **Propósito**: servicios de resolución de disputas y adjudicación
- **Funciones clave**:
  - Manejo de disputas
  - Procesos de adjudicación
  - Resolución de conflictos
  - Arbitraje de la red

### 11. **API de almacén de datos** (`dstapi/`)
- **Ruta base**: `dstapi/dstv1`
- **Controlador**: DSTV1Controller
- **Propósito**: almacenamiento y recuperación descentralizados de datos
- **Funciones clave**:
  - Operaciones de almacenamiento de datos
  - Gestión de archivos
  - Direccionamiento por contenido
  - Coordinación del almacenamiento distribuido

### 12. **API de tienda web** (`wsapi/`)
- **Ruta base**: `wsapi/webshopv1`
- **Controlador**: WebShopV1Controller
- **Propósito**: funcionalidad de comercio electrónico y marketplace
- **Funciones clave**:
  - Listados de productos
  - Gestión de pedidos
  - Procesamiento de pagos
  - Operaciones del marketplace

### 13. **API de integraciones** (`iapi/`)
- **Ruta base**: `iapi/integrationsv1`
- **Controlador**: IntegrationsV1Controller
- **Propósito**: integraciones con servicios de terceros
- **Funciones clave**:
  - Conectividad con servicios externos
  - Puentes entre API
  - Gestión de integraciones
  - Operaciones multiplataforma

## Funciones comunes a todas las API

### Autenticación
Todos los controladores de la API implementan autenticación por contraseña mediante el parámetro de ruta `{somePassword?}` y usan el atributo `ActionFilterController` para filtrar las solicitudes.

### Formato de respuesta
Las API suelen devolver respuestas JSON con un manejo de errores y un reporte de estado consistentes.

### Documentación de Swagger
Todos los endpoints están documentados con especificaciones Swagger/OpenAPI para pruebas interactivas y documentación. Puedes encontrarlas mientras ejecutas un CLI con la opción `enableapi` activada y visitando `http://localhost:7292` (o `http://localhost:17292` en testnet).


## Notas de uso

1. **Control de versiones**: las API usan versiones (V1, V2) para mantener la compatibilidad con versiones anteriores
2. **Estructura de rutas**: todas las rutas siguen el patrón `{namespace}api/[controller]/{action}`
3. **Seguridad**: todas las API requieren la autenticación y autorización adecuadas
4. **Límite de solicitudes**: algunos endpoints pueden tener un límite de solicitudes implementado
5. **Operaciones asíncronas**: la mayoría de las operaciones son asíncronas para un mejor rendimiento

Esta estructura ofrece una superficie completa de API REST para toda la funcionalidad de VFX Core, organizada por áreas de cada dominio.


## Detalles de los endpoints de la API
Puedes encontrar los detalles de cada endpoint [aquí](/es/build/node-api/details/).
