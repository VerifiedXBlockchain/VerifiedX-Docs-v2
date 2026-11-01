---
sourceHash: "70d549d08331"
title: "Primer inicio"
description: Qué hacer la primera vez que abres VerifiedX Switchblade, y un recorrido por el panel, el selector de direcciones y la administración de direcciones.
sidebar:
  order: 3
---

El panel de VerifiedX Switchblade está diseñado para ser simple y eficiente, y muestra toda la información esencial de un vistazo. 

Cuando abras VerifiedX Switchblade por primera vez, sigue estos pasos para empezar sin problemas:

1. **Importación del snapshot**:
   - Cuando tu altura de bloque local está más de 5,000 bloques por detrás del snapshot más reciente de la red, la billetera pregunta “¿Importar snapshot?”.
   - Haz clic en “Importar”, confirma que tus claves privadas están respaldadas con “Ya tengo respaldo” y la billetera descarga el snapshot por ti. No hay que seleccionar ningún archivo.
   - Tus bases de datos de cuentas, claves y bóvedas se conservan, y se guarda una copia de ellas en una carpeta `SnapshotBackups` dentro de tu carpeta de datos antes de reemplazar cualquier dato de la cadena.
   - Este proceso reduce considerablemente el tiempo necesario para sincronizar la blockchain. También puedes iniciarlo más tarde desde **Operaciones** con **Importar snapshot**.
2. **Reinicio del CLI**:
   - La billetera detiene la interfaz de línea de comandos (CLI) antes de la descarga y la vuelve a iniciar cuando el snapshot está en su lugar.
   - Deja que la aplicación complete este proceso sin interrupciones.
3. **Fin de la sincronización**:
   - Deja que la billetera termine de sincronizarse con la blockchain. Según tu conexión a internet, esto puede tardar varios minutos.

Si tienes algún problema, consulta la [sección de solución de problemas](/es/wallet/troubleshooting/) o pregunta al equipo de soporte de VerifiedX en [Discord](https://discord.gg/7cd5ebDQCj).



## Funciones
- **Saldos**: muestra lo que tienes actualmente en VFX y BTC.
- **Transacciones recientes**: muestra un registro de tu actividad más reciente.
- **Precios de activos**: ofrece precios en tiempo real de las criptomonedas compatibles.
- **Acciones rápidas**:
  - Crear direcciones nuevas.
  - Transferir fondos.
  - Administrar tokens.

## Selector de contexto de direcciones
El selector de contexto (context switcher) te permite alternar rápidamente entre distintas direcciones. También puedes ver detalles de bloques en tiempo real con el resumen integrado de Spyglass, que ofrece:
- Información del último bloque.
- Acceso con un clic al explorador de la red de VerifiedX.

## Creación y administración de direcciones
1. **Crear una dirección nueva**:
   - Haz clic en “Nueva dirección” en el panel.
   - Elige el tipo de dirección (“Agregar cuenta VFX” o “Agregar cuenta BTC”) y luego “Crear”.
2. **Importar una clave privada**:
   - Haz clic en “Nueva dirección”, elige VFX o BTC, luego elige “Importar” y pega la clave privada (una clave BTC también puede ser una clave WIF).
   - Confirma la importación y asegúrate de guardar la clave de forma segura.
3. **Respaldar direcciones**:
   - En **Operaciones**, haz clic en **Respaldo** y luego en **Respaldar claves** para exportar tus claves privadas y direcciones de VFX y BTC a un archivo de texto. Las claves de las cuentas de bóveda no se incluyen en esta exportación.
   - Guarda las claves privadas en un administrador de contraseñas seguro o en un archivo cifrado.
