---
sourceHash: "a6dcc1c50727"
title: "Solución de problemas de la GUI"
description: "Soluciones para problemas comunes de la billetera de VerifiedX: inicio, saldos incorrectos y claves perdidas después de importar un snapshot."
sidebar:
  order: 16
---

Esta guía te ayudará a depurar problemas comunes y deberías revisarla antes de pedir soporte en Discord.

## Inicio

### La GUI muestra "Cargando CLI de VFX" ("VFX CLI Loading") pero nunca termina de cargar.

Por lo general, esto significa que el CLI tiene problemas para iniciarse. Suele ocurrir si el CLI ya se está ejecutando.
Lo primero que deberías probar es simplemente reiniciar tu computadora y volver a abrir la GUI. Así descartas la posibilidad de que haya un proceso del CLI descontrolado en ejecución.

### Ya reinicié, pero sigo teniendo este problema.

Puede que tengas un archivo de base de datos dañado. Asegúrate de tener respaldadas tus claves privadas y luego sigue estos pasos:

> Nota: la carpeta de datos conserva el nombre original de la red por compatibilidad con versiones anteriores: `RBX` en Windows y `rbx` en macOS (`RBXTest` y `rbxtest` en testnet). Es posible que se migre en el futuro.

1. Cierra tu billetera.

2. Asegúrate de que VerifiedXCore (el CLI) no se esté ejecutando. Puedes hacer una de estas dos cosas:

    a. Reiniciar tu computadora OTRA VEZ

    b. Revisar el Administrador de tareas (Windows) o el Monitor de Actividad (macOS) en busca de un proceso llamado VerifiedXCore y finalizarlo. Ten en cuenta que es un proceso en segundo plano y que quizá tengas que cambiar al modo avanzado. Si no sabes cómo hacerlo, usa la opción `a` de arriba.

3. Ve a tu carpeta de la base de datos

    a. Windows: estará en `C:\Users\{username}\AppData\Local` (la carpeta `%LOCALAPPDATA%`). Ten en cuenta que quizá tengas que activar `Hidden Files` para ver la carpeta AppData en tu directorio de usuario.

    b. macOS: estará en tu carpeta de inicio, `/Users/{username}`.

4. Elimina la carpeta llamada `RBX` (Windows) o `rbx` (macOS).

5. Abre tu GUI.

### Podría ser un problema de permisos (Windows)

En algunas versiones de Windows, puedes encontrarte con problemas de permisos cuando el CLI de Core inicia la API. Para resolverlo, configura tanto la GUI como el CLI para que se ejecuten como administrador:

1. Ve a la carpeta de instalación de la billetera, normalmente `C:\Program Files\VFXWallet\` (las instalaciones antiguas pueden estar en `C:\Program Files (x86)\VFXWallet\`)

2. Haz clic derecho en `VFXWallet.exe` y elige `Properties`
> Si no ves `VFXWallet.exe`, probablemente es porque no tienes visibles las extensiones en tu equipo. En ese caso, busca `VFXWallet`.

3. Ve a la pestaña Compatibilidad (Compatibility) y haz clic en `Change settings for all users`

4. Activa la casilla `Run this program as administrator` y haz clic en Aceptar, y luego en Aceptar otra vez.

5. Entra en la carpeta `VFXCore` y repite el mismo paso para `VerifiedXCore.exe`
> Si no tienes visibles las extensiones, busca `VerifiedXCore` con el ícono del cubo de VFX.

6. Luego abre la GUI como de costumbre y todo debería funcionar como se espera.

### Sigue sin funcionar.

Si no es un proceso descontrolado ni una base de datos dañada, el siguiente paso es iniciar el CLI manualmente.

1. Asegúrate de que tu billetera esté cerrada y de que no haya procesos del CLI en ejecución (sigue las instrucciones de arriba).

2. Inicia VerifiedXCore

    a. Windows: ve a la carpeta `VFXCore` dentro de la carpeta de instalación, normalmente `C:\Program Files\VFXWallet\VFXCore`. Luego, inicia `VerifiedXCore.exe`. Nota: según la configuración de tu Windows, quizá no veas `.exe`.

    b. macOS: ve a `/Applications`, haz clic derecho en `VFXWallet.app` y elige `Show Package Contents`. Abre `Contents > Resources > VFXCore` y luego inicia `VerifiedXCore`.

3. Deberías ver que el CLI arranca y que llegan bloques. Si aparece un mensaje de error, revisa lo siguiente:

    a. Tienes la versión más reciente

    b. No te queda poco espacio en disco (asegúrate de tener al menos 10GB libres en tu unidad principal)

    c. Nota: si la ventana de la terminal solo se abre y desaparece, probablemente significa que ya tienes el CLI en ejecución. Reinicia tu computadora.

4. Si no hay errores, escribe `10` y presiona Enter, lo que habilitará la API.

5. Visita esta URL en tu navegador web: `http://localhost:7292/api/V1/CheckStatus` (en testnet, el puerto `17292`).

6. Deberías ver `Online` en tu navegador web. 

    a. Si no lo ves, comunícate con el canal de soporte en Discord.
    
    b. Si lo ves, ya deberías poder abrir tu GUI.

7. Si tu GUI se abrió correctamente, lo mejor que puedes probar ahora es cerrar tu GUI (lo que también termina la sesión del CLI) y volver a abrirla. Si esta vez no inicia, comunícate con el canal de soporte en Discord.  
    

## Saldo incorrecto

Por lo general, esto ocurre porque todavía no llegaste a la altura de bloque local en la que se produjo la transacción. Compara tu altura de bloque local con el [explorador de la red](https://spyglass.verifiedx.io).

También es posible que no hayas importado las claves correctas. Revísalas bien.

Si aun así sigue sin cuadrar, a veces reconstruir el árbol de estado puede ayudar. Tendrás que forzar el cierre de `VerifiedXCore` en el Administrador de tareas (Windows) o el Monitor de Actividad (macOS) y luego cerrar la GUI. Reinicia la GUI y el árbol de estado se reconstruirá.

## Importé un snapshot y perdí mis claves

Una importación de snapshot reemplaza solo los datos de la blockchain. Tus bases de datos de cuentas, claves y bóvedas se mantienen, y antes de cambiar nada la billetera guarda una copia de ellas en una carpeta `SnapshotBackups` dentro de tu carpeta de datos, en una subcarpeta llamada `snapshot-import-{timestamp}`. La billetera muestra la ruta cuando termina la importación.

1. Cierra tu billetera y asegúrate de que `VerifiedXCore` no se esté ejecutando (consulta más arriba).

2. Abre la carpeta de datos (`RBX` en Windows, `rbx` en macOS) y luego `SnapshotBackups`. Elige la carpeta `snapshot-import-{timestamp}` más reciente.

3. Copia los archivos `.db` de esa carpeta a la carpeta `Databases` (`DatabasesTestNet` en testnet) y reemplaza los archivos que tienen el mismo nombre.

4. Vuelve a abrir la billetera y verás tus claves. Respáldalas.

Las versiones anteriores de la billetera borraban toda la carpeta de datos durante una importación de snapshot y dejaban junto a ella una carpeta llamada `VFX_BACKUP_{timestamp}`. Si tienes una, elimina la carpeta de datos actual, cambia el nombre del respaldo al nombre original (`RBX` o `rbx`) y vuelve a abrir la billetera.

:::note[Consejo]
**¿No encuentras la respuesta que buscas? ¡Pregúntale a la comunidad!**
> <a href="https://discord.gg/7cd5ebDQCj">Unirse a Discord</a>
:::
