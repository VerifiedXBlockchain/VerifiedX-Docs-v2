---
sourceHash: 0efd119f8cce
title: "Instrucciones de compilación del CLI"
description: "Compila y ejecuta el VerifiedX Core CLI desde el código fuente en Linux, Windows y Mac con .NET 6, incluidas sus bibliotecas nativas de FROST y PLONK."
sidebar:
  order: 2
---

Las siguientes instrucciones cubren cómo compilar y ejecutar VFX en Windows, Linux y Mac.
El paso más importante es instalar .net core 6.

Para Linux, encontrarás las instrucciones de instalación aquí: https://docs.microsoft.com/en-us/dotnet/core/install/linux. Este documento explica cómo instalarlo en Ubuntu.

En el último paso, si _dotnet VerifiedXCore(.dll o .exe o en blanco)_ no funciona, también puedes probar _dotnet run VerifiedXCore(.dll o .exe o en blanco)_

## Linux

Instalación en Linux para Ubuntu 22.04:

1. wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
2. sudo dpkg -i packages-microsoft-prod.deb
3. rm packages-microsoft-prod.deb
4. sudo apt-get update && sudo apt-get install -y dotnet-sdk-6.0
5. sudo apt-get update && sudo apt-get install -y aspnetcore-runtime-6.0
6. Ejecuta `dotnet --version`. Deberías ver un número de versión 6.0.xxx
7. `mkdir vfx`: crea un directorio para VFX
8. cd vfx
9. a) Clona el repositorio con git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`

   b) Descarga la versión ya empaquetada desde https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. Si haces esto, navega a la carpeta donde descargaste los binarios y salta al paso 12.

8. `cd VerifiedX-Core`
9. `dotnet build`: debería haber 0 (cero) errores.
10. `dotnet publish -c Release -r linux-x64 --output ./vfxpublished` \*\*ten en cuenta que puedes cambiar `linux-x64` si usas otra arquitectura
11. `cd vfxpublished`
12. `dotnet VerifiedXCore.dll`

¡Listo! Ahora deberías ver una billetera en ejecución. Algunos errores comunes suelen estar relacionados con los permisos de archivos. Asegúrate de haber dado los permisos adecuados a la carpeta de VFX recién creada

### Conflictos de dotnet

Si ves un error como este, significa que tienes un conflicto entre versiones de dotnet.
```
A fatal error occurred. The folder [/usr/share/dotnet/host/fxr] does not exist
```
Para solucionarlo, ejecuta los siguientes comandos:
```
sudo apt remove dotnet*
sudo apt remove aspnetcore*
sudo apt remove netstandard*

sudo nano /etc/apt/preferences.d/99microsoft-dotnet.pref
```

Luego pega lo siguiente y guarda y sal de nano:
```
Package: *
Pin: origin "packages.microsoft.com"
Pin-Priority: 1001
```

Después ejecuta:
```
sudo apt update
sudo apt install dotnet-sdk-6.0
```


## Windows

Instala el SDK de dotnet más reciente desde aquí: https://dotnet.microsoft.com/en-us/download/dotnet/6.0
Una vez instalado, sigue los pasos a continuación.

1. Crea un directorio para VFX y luego abre el símbolo del sistema como administrador y navega a ese directorio.
2. Asegúrate de tener instalada una versión funcional de git.
3. a) Clona el repositorio con git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`
   b) Descarga la versión ya empaquetada desde https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. Si haces esto, navega a la carpeta donde descargaste los binarios y salta al paso 8.
4. `cd VerifiedX-Core`
5. `dotnet build`: debería haber 0 (cero) errores.
6. `dotnet publish` -c Release -r win-x64 --output ./vfxpublished \*\*ten en cuenta que puedes cambiar `win-x64` si usas otra arquitectura
7. `cd vfxpublished`
8. `dotnet VerifiedXCore.exe`

## Mac OSX

Instala el SDK de dotnet más reciente desde aquí: https://dotnet.microsoft.com/en-us/download/dotnet/6.0
Una vez instalado, sigue los pasos a continuación.

1. Crea un directorio para VFX y luego abre el símbolo del sistema como administrador y navega a ese directorio.
2. Asegúrate de tener instalada una versión funcional de git.
3. - Clona el repositorio con git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`
   - Descarga la versión ya empaquetada desde https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. Si haces esto, navega a la carpeta donde descargaste los binarios y salta al paso 8.
4. cd VerifiedX-Core
5. `dotnet build`: debería haber 0 (cero) errores.
6. `dotnet publish -c Release -r osx-x64 --output ./vfxpublished `\*\*ten en cuenta que puedes cambiar `osx-x64` si usas otra arquitectura, como arm.
7. `cd vfxpublished`
8. `dotnet VerifiedXCore`

## Bibliotecas nativas y parámetros de PLONK

La salida de publicación incluye las bibliotecas nativas de FROST y PLONK para el runtime que elegiste (`-r`), incluidas las compilaciones arm64 para `linux-arm64`. Ejecuta las bibliotecas que vienen con la versión publicada: la biblioteca de FROST está fijada a la versión `0.2.0-frost-real`, y un nodo que carga cualquier otra versión queda fuera de las ceremonias de claves y las firmas de vBTC.

En el primer arranque, el nodo descarga `vfx_plonk_v4.params` (unos 400 MB) en `PlonkParams` dentro de su directorio de datos y verifica su SHA-256. Define `VFX_PLONK_PARAMS_PATH` con la ruta completa de una copia existente para omitir la descarga. Una copia que no coincide con el hash fijado se ignora.
