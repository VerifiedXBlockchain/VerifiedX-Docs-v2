---
sourceHash: 0210519412e0
title: "Instrucciones de compilación del CLI"
description: "Compila y ejecuta el VerifiedX Core CLI desde el código fuente en Linux, Windows y Mac con .NET 6, incluidas sus bibliotecas nativas de FROST y PLONK."
sidebar:
  order: 2
---

Las siguientes instrucciones cubren cómo compilar y ejecutar el VerifiedX Core CLI en Windows, Linux y Mac.
El paso más importante es instalar .NET 6.

Para Linux, encontrarás las instrucciones de instalación aquí: https://docs.microsoft.com/en-us/dotnet/core/install/linux. Este documento explica cómo instalarlo en Ubuntu.

Una compilación desde el código fuente se ejecuta con `dotnet VerifiedXCore.dll`. Las versiones empaquetadas (`verifiedx-core-<platform>.zip` en la [página de versiones](https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/)) son compilaciones autocontenidas de un solo archivo: se ejecutan directamente como `./VerifiedXCore` o `VerifiedXCore.exe` y no necesitan .NET instalado. Agrega el argumento `testnet` para ejecutar en testnet, y `enableapi` para activar la API REST, que está desactivada de forma predeterminada.

## Linux

Instalación en Linux para Ubuntu 22.04:

1. `wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb`
2. `sudo dpkg -i packages-microsoft-prod.deb`
3. `rm packages-microsoft-prod.deb`
4. `sudo apt-get update && sudo apt-get install -y dotnet-sdk-6.0`
5. `sudo apt-get update && sudo apt-get install -y aspnetcore-runtime-6.0`
6. Ejecuta `dotnet --version`. Deberías ver un número de versión 6.0.xxx
7. `mkdir vfx`: crea un directorio para VFX
8. `cd vfx`
9. a) Clona el repositorio con git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`

   b) O descarga la versión empaquetada para tu plataforma (`verifiedx-core-linux-x64.zip` o `verifiedx-core-linux-arm64.zip`) desde https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. Si haces esto, descomprímela, navega a esa carpeta y salta al paso 14, ejecutando `./VerifiedXCore` en su lugar. Los pasos 1 a 6 no son necesarios para una versión empaquetada.

10. `cd VerifiedX-Core`
11. `dotnet build`: debería haber 0 (cero) errores.
12. `dotnet publish VerifiedXCore/VerifiedXCore.csproj -c Release -r linux-x64 --output ./vfxpublished` \*\*ten en cuenta que puedes cambiar `linux-x64` si usas otra arquitectura, por ejemplo `linux-arm64`
13. `cd vfxpublished`
14. `dotnet VerifiedXCore.dll`

¡Listo! Ahora deberías ver una billetera en ejecución. Algunos errores comunes suelen estar relacionados con los permisos de archivos. Asegúrate de haber dado los permisos adecuados a la carpeta de datos recién creada (`~/.local/share/RBX`, un nombre de carpeta heredado que el código todavía usa; `RBXTest` en testnet).

### Conflictos de dotnet

Si ves un error como este, significa que tienes un conflicto entre versiones de dotnet.
```text
A fatal error occurred. The folder [/usr/share/dotnet/host/fxr] does not exist
```
Para solucionarlo, ejecuta los siguientes comandos:
```bash
sudo apt remove dotnet*
sudo apt remove aspnetcore*
sudo apt remove netstandard*

sudo nano /etc/apt/preferences.d/99microsoft-dotnet.pref
```

Luego pega lo siguiente y guarda y sal de nano:
```text
Package: *
Pin: origin "packages.microsoft.com"
Pin-Priority: 1001
```

Después ejecuta:
```bash
sudo apt update
sudo apt install dotnet-sdk-6.0
```


## Windows

Instala el SDK de .NET 6 más reciente desde aquí: https://dotnet.microsoft.com/en-us/download/dotnet/6.0
Una vez instalado, sigue los pasos a continuación.

1. Crea un directorio para VFX y luego abre un símbolo del sistema como administrador y navega a ese directorio.
2. Asegúrate de tener instalada una versión funcional de git.
3. a) Clona el repositorio con git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`

   b) O descarga la versión empaquetada `verifiedx-core-win-x64.zip` desde https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. Si haces esto, descomprímela, navega a esa carpeta y salta al paso 8, ejecutando `VerifiedXCore.exe` en su lugar.
4. `cd VerifiedX-Core`
5. `dotnet build`: debería haber 0 (cero) errores.
6. `dotnet publish VerifiedXCore/VerifiedXCore.csproj -c Release -r win-x64 --output ./vfxpublished` \*\*ten en cuenta que puedes cambiar `win-x64` si usas otra arquitectura
7. `cd vfxpublished`
8. `dotnet VerifiedXCore.dll` (o ejecuta `VerifiedXCore.exe`)

## macOS

Instala el SDK de .NET 6 más reciente desde aquí: https://dotnet.microsoft.com/en-us/download/dotnet/6.0
Una vez instalado, sigue los pasos a continuación.

1. Crea un directorio para VFX, luego abre una terminal y navega a ese directorio.
2. Asegúrate de tener instalada una versión funcional de git.
3. a) Clona el repositorio con git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`

   b) O descarga la versión empaquetada (`verifiedx-core-osx-arm64.zip` para Apple silicon, `verifiedx-core-osx-x64.zip` para Intel) desde https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. Si haces esto, descomprímela, navega a esa carpeta y salta al paso 8, ejecutando `./VerifiedXCore` en su lugar.
4. `cd VerifiedX-Core`
5. `dotnet build`: debería haber 0 (cero) errores.
6. `dotnet publish VerifiedXCore/VerifiedXCore.csproj -c Release -r osx-x64 --output ./vfxpublished` \*\*ten en cuenta que `osx-x64` debe ser `osx-arm64` en Apple silicon.
7. `cd vfxpublished`
8. `dotnet VerifiedXCore.dll`

## Bibliotecas nativas y parámetros de PLONK

La salida de publicación incluye las bibliotecas nativas de FROST y PLONK para el runtime que elegiste (`-r`), incluidas las compilaciones arm64 para `linux-arm64`. Ejecuta las bibliotecas que vienen con la versión publicada: la biblioteca de FROST está fijada a la versión `0.2.0-frost-real`, y un nodo que carga cualquier otra versión queda fuera de las ceremonias de claves y las firmas de vBTC.

En el primer arranque, el nodo descarga `vfx_plonk_v4.params` (unos 400 MB) en `PlonkParams` dentro de su directorio de datos y verifica su SHA-256. Define `VFX_PLONK_PARAMS_PATH` con la ruta completa de una copia existente para omitir la descarga. Una copia que no coincide con el hash fijado se ignora.
