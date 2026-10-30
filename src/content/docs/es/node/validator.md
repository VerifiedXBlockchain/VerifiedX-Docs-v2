---
sourceHash: 2ee1d0325296
title: "Ejecuta un validador"
description: "Lleva un servidor Ubuntu vacío a un validador activo en la mainnet de VerifiedX: compilación, sincronización rápida, watchdog contra fallos, fondeo, validación, detención y actualización."
sidebar:
  order: 4
---

Esta guía te lleva de un servidor Linux vacío a un validador (validator) activo en mainnet: instala las dependencias, compila el Core CLI desde el código fuente, sincroniza rápido desde un snapshot, ejecuta el nodo con un watchdog contra fallos, fondea tu dirección y empieza a validar, ya sea desde la consola del CLI o mediante la API de la billetera.

Los pasos siguen decisiones concretas para que funcionen de principio a fin. La guía usa Ubuntu 22.04 LTS, ejecuta el CLI dentro de una sesión de `screen` e instala un pequeño watchdog con cron que reinicia el nodo después de un fallo o un reinicio del servidor. Nada aquí es específico de un proveedor de nube o de hosting; si sabes lo que haces, ajústalo libremente.

:::note[Testnet]
Los avisos como este indican qué cambia cuando trabajas con **testnet** en lugar de mainnet. También hay una [referencia rápida de testnet](#referencia-rápida-de-testnet) al final.
:::

## Lo que necesitas

- **5,000 VFX.** A partir de la altura de fianza (bond) del validador (`ValidatorBondHeight`; bloque 7,568,349 en mainnet; bloque 399 en testnet desde su reinicio de octubre de 2026), los 5,000 VFX quedan bloqueados como fianza: no se pueden enviar mientras seas un validador registrado y se desbloquean 1,200 bloques después de que se mine tu transacción de salida de validador (consulta [Detener y actualizar](#10-detener-y-actualizar)). Todo lo que supere los 5,000 VFX sigue disponible para gastar. No hay penalización. Antes de esa altura, tus VFX siguen totalmente líquidos. Envía 5,001 VFX para que una comisión de transacción nunca te deje por debajo del mínimo de 5,000.
- **Un servidor.** Ubuntu 22.04 LTS, 2 vCPU, 4 GB de RAM, SSD de 40 GB o más, con una IP pública estática. Funcionan tanto x64 como ARM64. La cadena de mainnet ocupa unos 15 GB a mediados de 2026 y sigue creciendo, así que deja margen en el disco, más unos 300 MB para los bloques recientes de Bitcoin y unos 400 MB para los parámetros de PLONK.
- **Puertos abiertos.** Consulta la tabla a continuación.
- **Acceso saliente a la red de Bitcoin.** Un validador sigue a Bitcoin directamente (consulta [Qué hace un validador](#qué-hace-un-validador)), así que necesita llegar a pares de Bitcoin en el puerto `8333` y, como respaldo, a `mempool.space` y `blockstream.info` por HTTPS. La mayoría de los servidores permiten el tráfico saliente de forma predeterminada.
- **Una billetera con tus VFX** (por ejemplo, [Switchblade](/es/wallet/installation/)) desde la cual fondear la dirección del validador.

### Puertos

| Puerto | Qué es | Exposición |
| --- | --- | --- |
| `3338` | Peer-to-peer | Abierto al mundo |
| `3339` | Peer-to-peer del validador | Abierto al mundo |
| `7294` | API del validador | Abierto al mundo |
| `7295` | Puerto del validador (FROST) | Abierto al mundo; **necesario para validar** |
| `7296` | Puerto del validador (FROST) sobre TLS | Opcional; el nodo lo abre junto a `7295` con un certificado autofirmado; no se verifica en la activación |
| `7292` | API de la billetera (HTTP) | Mantenlo cerrado; llámalo desde el propio servidor |
| `7293` | API de la billetera (HTTPS, con `openapi`) | Mantenlo cerrado |
| `22` | SSH | Restríngelo a tu propia IP si es posible |

El CLI verifica sus propios puertos `3339`, `7294` y `7295` cuando activas un validador y los sigue revisando mientras valida. Si alguno no es accesible desde fuera, la activación falla aunque el CLI esté escuchando; la causa más común es que falte una regla del firewall. `3338` no se verifica, pero sin él tu nodo no tiene pares entrantes.

Si tu servidor no tiene un firewall externo, `ufw` funciona bien:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 3338/tcp
sudo ufw allow 3339/tcp
sudo ufw allow 7294/tcp
sudo ufw allow 7295/tcp
sudo ufw allow 7296/tcp
sudo ufw enable
```

Si tu proveedor ofrece un firewall o grupos de seguridad, abre los mismos puertos ahí.

:::note[Testnet]
Los puertos de testnet son `13338` y `13339` (peer-to-peer), `17294` (API del validador), `17295` (puerto del validador/FROST), `17296` (FROST sobre TLS) y `17292` (API de la billetera; mantenlo cerrado).
:::

## 1. Prepara el servidor

Todos los comandos suponen un usuario normal con sudo (el usuario `ubuntu` predeterminado en la mayoría de las imágenes de nube).

```bash
sudo apt-get update -y
sudo apt-get install -y git wget curl unzip screen ca-certificates jq
```

> Nota: en un nodo dedicado conviene desactivar las actualizaciones automáticas para que una ejecución de apt en segundo plano nunca reinicie cosas sin que te enteres: `sudo systemctl disable --now unattended-upgrades`

## 2. Instala el SDK de .NET 6

El Core CLI es una aplicación de .NET 6. Ubuntu trae sus propios paquetes de dotnet, que entran en conflicto con los de Microsoft; fija primero el repositorio de Microsoft y nunca te toparás con el conflicto:

```bash
sudo bash -c 'cat > /etc/apt/preferences.d/99microsoft-dotnet.pref << EOF
Package: *
Pin: origin "packages.microsoft.com"
Pin-Priority: 1001
EOF'

wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O /tmp/packages-microsoft-prod.deb
sudo dpkg -i /tmp/packages-microsoft-prod.deb
rm /tmp/packages-microsoft-prod.deb

sudo apt-get update -y
sudo apt-get install -y dotnet-sdk-6.0
```

Verifica con `dotnet --version`: deberías ver `6.0.x`. Si dotnet ya estaba instalado y te aparece `A fatal error occurred. The folder [/usr/share/dotnet/host/fxr] does not exist`, consulta [Conflictos de dotnet](/es/node/build-from-source/#conflictos-de-dotnet).

## 3. Clona y compila

Mainnet usa la rama `main`:

```bash
cd ~
git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git vfx-cli
cd vfx-cli
git checkout main

dotnet build
```

La compilación debería terminar con 0 errores. Luego publica una compilación de release para tu arquitectura (`uname -m` muestra `x86_64` o `aarch64`):

```bash
# x64
dotnet publish -c Release -r linux-x64 --self-contained false --output ./published

# ARM64 (Graviton, Ampere, Raspberry Pi 5, ...)
dotnet publish -c Release -r linux-arm64 --self-contained false --output ./published
```

El nodo queda ahora en `~/vfx-cli/published/VerifiedXCore.dll`.

La publicación también copia junto al nodo las bibliotecas nativas de FROST y PLONK para tu arquitectura. En `linux-arm64` toma las compilaciones arm64 de ambas. Antes de 9.0, una publicación arm64 incluía la biblioteca de PLONK para x86-64, así que publica 9.0 desde cero en lugar de reutilizar una carpeta de salida anterior. La biblioteca de FROST está fijada a la versión `0.2.0-frost-real`. Un nodo que carga cualquier otra versión falla su verificación de arranque y queda fuera de las ceremonias de claves y las firmas de vBTC, así que nunca copies bibliotecas nativas de otra versión.

En el primer arranque, el nodo descarga el archivo de parámetros de PLONK, `vfx_plonk_v4.params` (unos 400 MB), en `PlonkParams` dentro del directorio de datos (`PlonkParamsTestNet` en testnet), y verifica su SHA-256 antes de usarlo. Deja espacio y tiempo para ello. Para usar una copia que ya tengas, define `VFX_PLONK_PARAMS_PATH` con su ruta completa. Un archivo que no coincide con el hash fijado se ignora y se descarga el publicado en su lugar.

:::note[Testnet]
Cambia a la rama `testnet` en lugar de `main`.
:::

## 4. Sincroniza rápido desde un snapshot (recomendado)

Un nodo nuevo se sincroniza desde el bloque 0, lo que lleva mucho tiempo. En su lugar, carga la base de datos de la cadena desde el snapshot más reciente de la red **antes del primer arranque**. Los snapshots se publican en [sync.verifiedx.io](https://sync.verifiedx.io): descarga los archivos en tu navegador o bájalos directamente al servidor:

```bash
mkdir -p ~/.local/share/RBX/Databases
cd ~/.local/share/RBX/Databases

curl -s "https://sync.verifiedx.io/api/snapshots?network=mainnet" \
  | jq -r '.urls[]' \
  | xargs -n 1 -P 4 wget -q --show-progress -c
```

En Linux, los datos de mainnet están en `~/.local/share/RBX/`: las bases de datos de la cadena en `Databases/` y la configuración en `Config/config.txt` (consulta [Configuración del CLI](/es/node/configuration/)). El CLI crea estas carpetas en la primera ejecución; crear `Databases/` de antemano y llenarla, como arriba, equivale exactamente a una larga sincronización natural.

:::note[Volver a aplicar un snapshot a un nodo existente]
Los snapshots contienen solo datos de la cadena, nunca datos de la billetera. Si alguna vez actualizas un nodo que ya tiene claves, detén primero el CLI y reemplaza solo los archivos de la cadena que descargaste. **No** elimines `rsrvwaldata.db`, `rsrvhdwaldata.db`, `rsrvkeystore.db`, `rsrvbitcoin.db`, `DB_Privacy.db`, `rsrvvbtc.db` ni `rsrvshares.db` (ni sus archivos `-log.db` asociados): ahí están tus claves y el estado local de tu billetera.
:::

:::note[Testnet]
Usa `?network=testnet` y el directorio de datos `~/.local/share/RBXTest/DatabasesTestNet`.
:::

## 5. Inicia el nodo

Primero genera un token de API, cualquier cadena aleatoria. La API de la billetera lo exigirá como encabezado en cada llamada, así la API queda protegida aunque el puerto llegue a quedar expuesto:

```bash
openssl rand -hex 16
```

Inicia el CLI dentro de una sesión de `screen` en segundo plano (reemplaza `YOUR_API_TOKEN` aquí y en todo lo que sigue):

```bash
cd ~/vfx-cli/published
screen -dmS vfx bash -lc "dotnet VerifiedXCore.dll enableapi openapi apitoken=YOUR_API_TOKEN"
```

Qué hacen las opciones de arranque:

- `enableapi`: activa la API local de la billetera en el puerto `7292`. Está desactivada de forma predeterminada, y esta guía depende de ella.
- `openapi`: expone la API en todas las interfaces en lugar de solo en localhost. Con `7292` cerrado en tu firewall, esto no cambia nada en el día a día, pero te permite abrir el puerto más adelante para administrar el nodo de forma remota sin reiniciarlo. Quítala si solo vas a llamar a la API desde el propio servidor.
- `apitoken=...`: exige el encabezado `apitoken` en cada llamada a la API.

Desde Core 9.0, los valores de `apitoken=` y `encpass=` se toman exactamente como los escribes: se conservan las mayúsculas y minúsculas, y también cualquier `=` dentro del valor (`apitoken=AbC123==` da el token `AbC123==`). Las versiones anteriores los pasaban a minúsculas y los cortaban en un segundo `=`. Si iniciaste un nodo anterior con un token con mayúsculas y minúsculas o que contiene `=`, tus llamadas a la API ahora deben enviar el token exactamente como lo diste. Un token de `openssl rand -hex 16` está en minúsculas y no tiene `=`, así que para él nada cambia.

Conéctate para ver la consola y vuelve a desconectarte con `Ctrl+A` y luego `D`; **no** presiones `Ctrl+C`, porque eso mata el nodo:

```bash
screen -r vfx
```

Dale un minuto para arrancar y luego revisa el progreso de la sincronización:

```bash
curl -s -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/api/V1/GetWalletInfo
```

Compara la altura de bloque que reporta con la del [explorador Spyglass](https://spyglass.verifiedx.io). Cuando las alturas coincidan, estás sincronizado. En la consola, `/info` muestra lo mismo.

:::note[Testnet]
Agrega la opción `testnet` (`dotnet VerifiedXCore.dll enableapi openapi testnet apitoken=...`) y usa el puerto `17292` en las llamadas a la API.
:::

## 6. Mantenlo en ejecución: watchdog contra fallos

Un validador tiene que sobrevivir a fallos y reinicios sin supervisión. Dos scripts pequeños y dos entradas de cron hacen que la configuración se recupere sola. La convención que los une: el archivo marcador `~/.vfx_cli_stopped` significa "detenido a propósito"; el watchdog no interviene mientras exista.

Crea `~/vfx-start.sh`:

```bash
#!/bin/bash
set -e

API_TOKEN="YOUR_API_TOKEN"

# Hold the watchdog off during the (re)start; cleared on success below.
touch "$HOME/.vfx_cli_stopped"

# Kill any existing session
screen -S vfx -X quit 2>/dev/null || true
sleep 1

cd "$HOME/vfx-cli/published"
screen -dmS vfx bash -lc "dotnet VerifiedXCore.dll enableapi openapi apitoken=$API_TOKEN"

sleep 2
if screen -list | grep -q "\.vfx"; then
    rm -f "$HOME/.vfx_cli_stopped"
    echo "VFX CLI started. Attach with: screen -r vfx"
else
    echo "ERROR: failed to start the vfx screen session" >&2
    exit 1
fi
```

Crea `~/vfx-watchdog.sh`:

```bash
#!/bin/bash
# Restarts the VFX CLI screen session if it dies. Stays quiet when:
#   - ~/.vfx_cli_stopped exists (the CLI was stopped on purpose)
#   - the screen session is alive

FLAG="$HOME/.vfx_cli_stopped"
START="$HOME/vfx-start.sh"
LOG="$HOME/vfx-watchdog.log"

[ -f "$FLAG" ] && exit 0
[ -f "$START" ] || exit 0

if screen -list 2>/dev/null | grep -q "\.vfx"; then
    exit 0
fi

echo "$(date -Is) CLI screen session missing — restarting" >> "$LOG"
bash "$START" >> "$LOG" 2>&1
echo "$(date -Is) restart script exited with $?" >> "$LOG"

# Keep the log bounded
tail -n 500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
```

Hazlos ejecutables e instala las entradas de cron (cada 2 minutos, más una poco después del arranque):

```bash
chmod 700 ~/vfx-start.sh
chmod 755 ~/vfx-watchdog.sh

( crontab -l 2>/dev/null | grep -v "vfx-watchdog.sh"
  echo "*/2 * * * * $HOME/vfx-watchdog.sh"
  echo "@reboot sleep 45 && $HOME/vfx-watchdog.sh"
) | crontab -
```

De ahora en adelante, inicia (y reinicia) el nodo con:

```bash
bash ~/vfx-start.sh
```

Cuando *quieras* el nodo detenido (mantenimiento, actualizaciones), crea primero el marcador para que el watchdog no te lleve la contraria y luego apágalo de forma ordenada:

```bash
touch ~/.vfx_cli_stopped
curl -s -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/api/V1/SendExit
```

(`screen -S vfx -X quit` sirve como alternativa si la API no responde). Ejecutar `bash ~/vfx-start.sh` borra el marcador y vuelve a levantar todo.

:::note[Testnet]
Agrega la opción `testnet` a la línea `screen -dmS vfx ...` dentro de `vfx-start.sh`, como en el paso 5.
:::

## 7. Crea o importa la dirección de tu validador

Necesitas en el nodo una dirección con al menos 5,000 VFX, ya sea una nueva o una que ya tengas. Tanto la consola como la API pueden hacerlo; elige la que prefieras.

**Desde la consola del CLI** (`screen -r vfx`; escribe `/menu` para ver todas las opciones):

- Escribe `2` para crear una dirección nueva, o
- Escribe `3` para restaurar una dirección a partir de una clave privada existente. Te preguntará si quieres volver a escanear la cadena en busca de transacciones anteriores; responde `y` si la dirección tiene historial.

**Desde la API:**

```bash
# Create a new address
curl -s -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/api/V1/GetNewAddress

# Or import an existing private key (the trailing /true rescans the chain for its history)
curl -s -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/api/V1/ImportPrivateKey/YOUR_PRIVATE_KEY/true
```

:::note[Respalda tu clave privada]
Escribe `/printkeys` en la consola para mostrar las claves privadas de todas las direcciones del nodo y guárdalas en un lugar seguro y sin conexión. Si el servidor deja de funcionar, la clave privada es la única forma de recuperar los fondos.
:::

Una nota sobre el cifrado de la billetera: el CLI permite cifrar la billetera. Una billetera cifrada puede seguir arrancando sin supervisión si pasas su contraseña en la línea de arranque con `encpass=YOUR_PASSWORD` (se toma exactamente como la escribes). La contraseña queda entonces en `~/vfx-start.sh`, por eso ese archivo tiene `chmod 700`. En cualquier caso, mantén el servidor bien protegido por firewall y con autenticación SSH solo por clave.

## 8. Fondea la dirección

Envía **5,001 VFX** (los 5,000 requeridos más un margen para la comisión) desde tu billetera, por ejemplo Switchblade, a la dirección del paso 7. El nodo debe estar totalmente sincronizado para que aparezca el saldo. Revísalo:

```bash
curl -s -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/api/V1/GetAllAddresses
```

El equivalente en la consola es la opción `7` (Account Info).

:::note[Testnet]
Obtén fondos de testnet en el [faucet](https://spyglass-testnet.verifiedx.io/faucet) o pide en el canal `Testnet Faucet` de Discord. Consulta [Testnet](/es/build/testnet/) para más información.
:::

## 9. Empieza a validar

Antes de activar, confirma que el nodo está totalmente sincronizado, que la dirección tiene al menos 5,000 VFX y que los puertos `3338`, `3339`, `7294` y `7295` son accesibles desde fuera.

Cuando empieza a validar, el nodo se registra on-chain automáticamente: una vez verificados sus puertos, conocida su IP pública, encontrado un par validador y transcurridos 10 bloques, envía la transacción de registro del validador, que también registra la clave pública FROST del validador. No hay un paso aparte para registrar la clave. Después envía un latido (heartbeat) cada 500 bloques; un validador sin latido en los últimos 1,000 bloques deja de contar como activo.

### Desde la consola del CLI

Conéctate con `screen -r vfx` y escribe `8` (Startup Masternode). El CLI muestra tus direcciones con sus saldos: elige la fondeada por su número, confirma con `y` y dale a tu validador un nombre único (o déjalo en blanco para que se asigne uno automáticamente). Desconéctate con `Ctrl+A` y luego `D`.

### Desde la API

```bash
curl -s -H "apitoken: YOUR_API_TOKEN" "http://localhost:7292/api/V1/StartValidating/YOUR_VFX_ADDRESS/YOUR_VALIDATOR_NAME"
```

El nombre debe ser único en la red; de lo contrario recibirás `Node name already taken.`. Codifica el nombre para URL si contiene espacios.

### Verifícalo

- En la consola, `/val` muestra la información de tu validador.
- Tu nodo aparece en la lista de master nodes de la red; consulta la [Web API de Master Node](/es/build/web-api/master-node/) para buscarlo por nombre o dirección de forma programática.
- `GetAllAddresses` (paso 8) muestra la dirección marcada como validando.

:::note[Mantente accesible]
El CLI revisa continuamente sus puertos de validador. Si tu nodo deja de ser accesible durante unos 90 segundos (un cambio de firewall, una caída de red, una migración de servidor), desactiva la validación y **no** se reactiva solo. No envía ninguna transacción de salida cuando esto ocurre, así que tus 5,000 VFX siguen bloqueados como fianza. Arregla la conectividad y luego vuelve a empezar a validar como se indica arriba.
:::

## Qué hace un validador

Desde Core 9.0, un validador hace más que producir bloques. Cuando su fianza lleva 14,400 bloques (unos dos días), también:

- **Sigue a Bitcoin.** Un cliente ligero de Bitcoin integrado, que solo se ejecuta mientras el nodo valida, mantiene ocho pares de Bitcoin encontrados mediante las semillas DNS de Bitcoin, sigue la cadena de encabezados y guarda unos 300 MB de bloques recientes en `Databases/BtcBlocks`. Solo se consulta a los exploradores públicos cuando ningún par entrega un bloque. No hay nada que instalar ni configurar. Consulta [Integración con Bitcoin](/es/learn/bitcoin-integration/).
- **Firma reportes de Bitcoin.** Los validadores crean y firman los reportes que registran on-chain los depósitos y gastos de las bóvedas (vaults). Un validador que no puede obtener un bloque de Bitcoin espera y no firma nada para ese bloque.
- **Participa en las ceremonias de claves y las firmas de vBTC.** Un validador puede ser elegido para guardar una parte de la clave de una bóveda de vBTC. Entonces firma los retiros de esa bóveda, que la cadena ya fijó, y ayuda a mover la bóveda a una nueva clave cuando se han ido demasiados de sus titulares.

Los validadores que ya estaban activos en el bloque 7,496,000 de mainnet cuentan con antigüedad desde el inicio. Reiniciar un validador durante una espera de salida reanuda la fianza y vuelve a iniciar su antigüedad.

Revisa el estado de atestación de la red, incluidos el conjunto de firmantes y la punta de Bitcoin atestada, con:

```bash
curl -s -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/vbtcapi/VBTC/GetBitcoinAttestationStatus
```

Para que la firma de una bóveda se haga solo en tus propios validadores, consulta [Firma institucional (S3C)](/es/learn/institutional/s3c-signing/).

## 10. Detener y actualizar

**Deja de validar:**

- Consola: escribe `11` (stop masternode), o
- API: `curl -s -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/api/V1/TurnOffValidator/YOUR_VFX_ADDRESS`

A partir de la altura de fianza, ambos envían la transacción de salida del validador antes de que el nodo se detenga e indican si se envió. El validador deja de contar on-chain de inmediato, y su stake de 5,000 VFX se desbloquea 1,200 bloques (unas cuatro horas a 12 segundos por bloque) después de que se mine la salida. Antes de la altura de fianza no hay stake bloqueado y no se envía ninguna salida: tus fondos se pueden gastar de inmediato.

Quedarse en silencio no desbloquea nada. Un validador cuyo nodo está caído o inaccesible sigue con su fianza bloqueada hasta que se mine una salida. Para hacer salir una dirección que tiene esta billetera, esté o no validando el nodo con ella:

```bash
curl -s -X POST -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/vbtcapi/VBTC/ExitValidator/YOUR_VFX_ADDRESS
```

La respuesta incluye `ExitTxHash` y la fianza. Un registro o un latido minado durante la espera, por ejemplo al reiniciar la validación, reanuda la fianza. Si el validador guarda partes de clave de bóvedas de vBTC, conserva su nodo y sus partes de clave después de la salida: los retiros de esas bóvedas siguen necesitando su firma.

Revisa una fianza en cualquier momento, para cualquier dirección:

```bash
curl -s -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/vbtcapi/VBTC/GetValidatorBond/YOUR_VFX_ADDRESS
```

`Bond.Bonded`, `Bond.Spendable`, `Bond.ExitHeight` y `Bond.UnlocksAtHeight` muestran si el stake está bloqueado, qué puedes enviar ahora y cuándo se libera. `Bond.RuleActive` es `false` antes de la altura de fianza.

**Core 9.0.1** debe estar en ejecución antes del bloque 7,575,250 en mainnet (bloque 7,400 en testnet), donde activa las reglas del libro mayor que Core 9.0 incluyó desactivadas (consulta [Reglas del libro mayor de Core 9.0.1](/es/build/node-api/transaction-creation/#reglas-del-libro-mayor-de-core-901)). A partir de esa altura, el VRF de un productor de bloques se genera a partir del bloque ancla de su época, 100 bloques por debajo de la primera altura de la época, y las épocas son de 8,640 bloques. Un validador registrado después del ancla de una época produce a partir de la época siguiente, así que un validador recién registrado puede esperar hasta una época y 100 bloques (unas 30 horas a 12 segundos por bloque) antes de producir.

**Actualiza el nodo** compilando primero y luego intercambiando, para que una compilación rota nunca pueda tumbar tu validador:

```bash
cd ~/vfx-cli
git fetch origin && git reset --hard origin/main

# Build the new version alongside the running one (use linux-arm64 on ARM)
dotnet publish -c Release -r linux-x64 --self-contained false --output ./published_next
test -f ./published_next/VerifiedXCore.dll && echo "BUILD OK" || echo "BUILD FAILED - old version untouched"

# Swap and restart
touch ~/.vfx_cli_stopped
curl -s -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/api/V1/SendExit
sleep 5
rm -rf published_prev
mv published published_prev
mv published_next published
bash ~/vfx-start.sh
```

La compilación anterior queda en `published_prev`; si algo sale mal, vuelve a intercambiarla de la misma forma. En servidores con 4 GB de RAM o menos, ejecutar `dotnet publish` mientras el nodo está en ejecución puede agotar la memoria; si la compilación se interrumpe, detén primero el CLI (marcador + `SendExit`) y luego compila, intercambia e inicia.

Después de cualquier reinicio, confirma que el validador sigue activo (`/val`) y vuelve a activarlo con el paso 9 si hace falta.

## Solución de problemas

- **`A fatal error occurred. The folder [/usr/share/dotnet/host/fxr] does not exist`**: paquetes de dotnet en conflicto; consulta [Conflictos de dotnet](/es/node/build-from-source/#conflictos-de-dotnet).
- **La altura de bloque no avanza**: detén el CLI (marcador + `SendExit`), vuelve a aplicar el snapshot más reciente (paso 4; ten en cuenta la advertencia sobre los archivos de la billetera) e inicia de nuevo.
- **El validador se desactivó sin avisar**: casi siempre es la autoverificación de puertos. Comprueba que `3339`, `7294` y `7295` sean accesibles desde fuera y vuelve a empezar a validar. La fianza sigue bloqueada; no se envió ninguna salida.
- **El nodo no volvió después de un reinicio**: revisa `~/vfx-watchdog.log` y asegúrate de que `~/.vfx_cli_stopped` no haya quedado ahí (ejecutar `bash ~/vfx-start.sh` lo borra).
- **¿Qué está haciendo ahora mismo?**: `screen -r vfx` muestra la consola en vivo; desconéctate con `Ctrl+A` y luego `D`.

## Referencia rápida de testnet

| | Mainnet | Testnet |
| --- | --- | --- |
| Rama | `main` | `testnet` |
| Opciones de arranque | `enableapi openapi apitoken=...` | `enableapi openapi testnet apitoken=...` |
| Puerto de la API de la billetera | `7292` | `17292` |
| Puertos peer-to-peer | `3338`, `3339` | `13338`, `13339` |
| Puerto de la API del validador | `7294` | `17294` |
| Puerto del validador (FROST) | `7295` | `17295` |
| Puerto del validador (FROST) sobre TLS | `7296` | `17296` |
| Directorio de datos | `~/.local/share/RBX` | `~/.local/share/RBXTest` |
| Bases de datos de la cadena | `.../RBX/Databases` | `.../RBXTest/DatabasesTestNet` |
| Archivo de configuración | `.../RBX/Config/config.txt` | `.../RBXTest/ConfigTestNet/config.txt` |
| Snapshot | `?network=mainnet` | `?network=testnet` |
| Explorador | [spyglass.verifiedx.io](https://spyglass.verifiedx.io) | [spyglass-testnet.verifiedx.io](https://spyglass-testnet.verifiedx.io) |
| Obtención de fondos | 5,000 VFX desde tu billetera | [Faucet](https://spyglass-testnet.verifiedx.io/faucet) |
| Fianza del validador desde el bloque | `7568349` | `399` |
