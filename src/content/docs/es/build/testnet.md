---
sourceHash: a5c8b7f448e6
title: "Testnet"
description: "Ejecuta el CLI y la GUI en testnet: sus puertos y direcciones, el signet de VerifiedX y cómo obtener fondos de prueba."
sidebar:
  order: 3
---

## CLI

Puedes acceder a testnet ejecutando el CLI con la opción `testnet`.

Los archivos de base de datos de testnet se guardan junto a tus archivos de base de datos de mainnet, con el sufijo `test`.

Todos los puertos tienen un dígito más, con un `1` como prefijo:

| | Mainnet | Testnet |
|---|---|---|
| Peer-to-peer | `3338`, `3339` | `13338`, `13339` |
| API del validador (validator) | `7294` | `17294` |
| Validador (FROST) | `7295` | `17295` |
| Validador (FROST) sobre TLS | `7296` | `17296` |
| API de la billetera | `7292` | `17292` |

Así, accederías a Swagger con este enlace: `http://localhost:17292/swagger`.


## GUI

Puedes iniciar la GUI en modo testnet agregando la opción `--testnet` por línea de comandos al iniciarla.

### MacOS

En MacOS, usa este comando de terminal para iniciar en testnet:
```shell
/Applications/VFXWallet.app/Contents/MacOS/VFX\ Switchblade --testnet
```

### Windows
En Windows, usa este comando de terminal para iniciar en testnet:
```shell
"C:\Program Files\VFXWallet\VFXWallet.exe" --testnet
```

> También puedes cambiarlo en la configuración de tu acceso directo: haz clic derecho para editar las propiedades y actualiza el Destino con el fragmento anterior.

## Direcciones

Ten en cuenta que todas las direcciones de testnet empiezan con una `x` en lugar de una `R`.

## Enlaces importantes

Explorador de testnet: https://spyglass-testnet.verifiedx.io

Faucet de testnet: https://spyglass-testnet.verifiedx.io/faucet

## Bitcoin: el signet de VerifiedX

Para todo lo relacionado con Bitcoin, la testnet de VerifiedX usa el signet de VerifiedX, un signet privado de Bitcoin operado por el equipo de VerifiedX. Reemplaza a Bitcoin testnet4. Consulta [Signet de VerifiedX](/es/build/signet/) para ver cómo funciona, su explorador y sus API, y cómo minar bloques bajo demanda.

Explorador del signet de Bitcoin: https://signet.verifiedx.io

API Esplora del signet de Bitcoin: https://signet.verifiedx.io/api

El signet mantiene los bloques de 10 minutos de Bitcoin. Un evento de una bóveda (vault) de vBTC (un depósito o el pago de un retiro) cuenta una vez que hay 3 bloques del signet encima de su bloque. La testnet se reinició desde el génesis en octubre de 2026 para pasar al signet: todas las bóvedas en ella son vigiladas (la altura de registro de atestaciones es 400). Consulta [vBTC](/es/build/vbtc/integration/).

Las direcciones de Bitcoin se ven igual que en otras redes de prueba de Bitcoin (`tb1…`).

## Obtén fondos de prueba

El [faucet de testnet](https://spyglass-testnet.verifiedx.io/faucet) paga tanto VFX de testnet como BTC de signet:

1. Abre el faucet y elige la pestaña **VFX** o **Signet BTC**.
2. Ingresa tu dirección (una dirección de VFX que empieza con `x`, o una dirección de signet que empieza con `tb1`), el monto y tu número de teléfono.
3. Ingresa el código que recibes por SMS. El faucet envía los fondos y muestra la transacción.

Cada número de teléfono puede recibir hasta los límites que muestra la página del faucet (actualmente 1,000 VFX y 0.01 BTC en total). El BTC de signet se confirma en el siguiente bloque del signet, en unos 10 minutos. Si necesitas más, pide en el canal `Testnet Faucet` de Discord.

El mismo faucet está disponible como API: consulta [Web API: Faucet](/es/build/web-api/faucet/).

### Para automatización de pruebas

Los equipos que ejecutan pruebas automatizadas contra la testnet pueden solicitar:

- **Un token de automatización del faucet**, que fondea direcciones mediante la API del faucet sin el paso del SMS.
- **Bloques del signet bajo demanda**, para que una prueba no espere unos 10 minutos por cada confirmación.

Ambos vienen con el [acceso a la API de socios (Partner API)](/es/build/signet/#acceso-a-la-api-de-socios), donde se explica cómo solicitarlo y cómo llamar a ambas API.

---

Los desarrolladores recibirán con gusto tus preguntas en Discord.
