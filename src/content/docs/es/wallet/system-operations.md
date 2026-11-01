---
sourceHash: "eeeb7bf5b302"
title: "Operaciones avanzadas del sistema"
description: Operaciones avanzadas de la billetera para cuentas, tokens y NFTs, validadores y diagnóstico.
sidebar:
  order: 15
---

## Operaciones generales
1. Funciones básicas:
   - Reinicio del CLI
   - Impresión de direcciones
   - Acceso a la carpeta de la base de datos
   - Importación de snapshots (las bases de datos de cuentas, claves y bóvedas se mantienen en su lugar; antes se guarda una copia en `SnapshotBackups/snapshot-import-{timestamp}` en tu carpeta de datos)

2. Administración de la red:
   - Seguimiento del estado de sincronización
   - Administración de conexiones
   - Diagnóstico de la red

## Seguridad de la cuenta
1. Funciones de seguridad:
   - Cifrado de la billetera
   - Creación de billeteras HD
   - Sistema de respaldo de claves
   - Protección de activos

2. Administración de respaldos:
   - Almacenamiento de claves
   - Respaldo de activos
   - Guardado de la configuración
   - Opciones de recuperación

## Operaciones con tokens y NFTs
1. Verificación de activos:
   - Verificación de la propiedad de tokens
   - Importación de contenido multimedia
   - Sistema de lanzamiento de beacons
   - Protocolo de transferencia de contenido multimedia

2. Opciones de transferencia:
   - Transferencias privadas
   - Participación en la red pública
   - Movimiento seguro de datos
   - Cumplimiento del protocolo

## Administración de validadores

:::note
En la billetera 9.0.1 la pantalla Validador está oculta: no hay un elemento Validador en el menú lateral ni una sección Validador en Operaciones, así que el estado del validador, las propuestas y las votaciones no se pueden usar desde la billetera. La búsqueda de **Pool de validadores** sigue en **Operaciones**, **General**. Para validar, ejecuta el Core CLI como se describe en [Ejecuta un validador](/es/node/validator/).
:::

1. Herramientas de estado:
   - Verificación del estado del validador (validator)
   - Búsqueda de pools
   - Creación de propuestas
   - Administración de votaciones

2. Integración con MOTHER:
   - Supervisión de los validadores de la red
   - Administración de varios validadores
   - Seguimiento del estado
   - Supervisión del rendimiento

## Herramientas de diagnóstico
1. Supervisión del sistema:
   - Visualización de registros
   - Acceso a los datos de depuración
   - Inspección del mempool
   - Seguimiento de transacciones

2. Solución de problemas:
   - Registro de errores
   - Comprobación del estado
   - Supervisión del rendimiento
   - Diagnóstico de la red
