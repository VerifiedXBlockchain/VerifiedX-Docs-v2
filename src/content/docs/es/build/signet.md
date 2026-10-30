---
sourceHash: 535b2d227579
title: "Signet de VerifiedX (Bitcoin de testnet)"
description: "El signet de VerifiedX, la red privada de prueba de Bitcoin detrás de la testnet de VFX: cómo funciona, su explorador y sus API, el BTC de signet y el acceso a la API de socios (Partner API)."
sidebar:
  label: Signet
  order: 4
---

La testnet de VerifiedX no usa una red pública de prueba de Bitcoin. Su lado de Bitcoin es el **signet de VerifiedX**: una red privada de Bitcoin, operada por el equipo de VerifiedX, que sigue las reglas de Bitcoin pero cuyos bloques solo puede producir el equipo de VerifiedX. Todo lo relacionado con Bitcoin en la testnet de VFX lo usa: los depósitos y retiros de las bóvedas (vaults) de vBTC, las cuentas de Bitcoin de las billeteras y el `BtcClient` del SDK en testnet.

Reemplazó a Bitcoin testnet4 en octubre de 2026. Los tiempos de bloque de testnet4 varían de segundos a horas y su cadena se reorganiza con frecuencia, así que los depósitos y retiros de vBTC no se podían confirmar con un calendario predecible. El signet le da a la testnet una cadena de Bitcoin que se comporta como mainnet y se mantiene en línea.

## Cómo funciona

Un signet ([BIP 325](https://github.com/bitcoin/bips/blob/master/bip-0325.mediawiki)) es una red de prueba de Bitcoin en la que cada bloque debe llevar una firma de la clave de firma de la red. La prueba de trabajo se sigue verificando, pero con una dificultad baja: lo que hace válido a un bloque es la firma. Solo el equipo de VerifiedX tiene la clave, así que nadie más puede minar en el signet de VerifiedX ni reorganizarlo.

| | Signet de VerifiedX |
|---|---|
| Productor de bloques | El firmante del equipo de VerifiedX (nadie más puede minar) |
| Tiempo de bloque | Unos 10 minutos, como en mainnet |
| Reorganizaciones | Ninguna |
| Comisiones | 1 sat/vB es suficiente |
| Direcciones | Formatos de testnet: `tb1…` (SegWit y Taproot), `m…`/`n…`, `2…` |
| Monedas | BTC de signet (sBTC). No tiene valor y no se puede comprar |
| Génesis | El bloque génesis estándar de signet (`00000008819873e9…bee1ef6`) |
| Inicio de mensaje | `c69e715c` |

La testnet de VFX cuenta un evento de una bóveda de vBTC (un depósito o el pago de un retiro) una vez que hay 3 bloques del signet encima de su bloque, así que un depósito suele acreditarse entre 30 y 40 minutos después de enviarse. Consulta [vBTC](/es/build/vbtc/integration/).

## Explorador y API

El signet ejecuta su propio explorador [mempool](https://signet.verifiedx.io), el mismo software que mempool.space.

| Qué | Dónde |
|------|-------|
| Explorador (bloques, transacciones, direcciones, mempool) | https://signet.verifiedx.io |
| Página de transacción | `https://signet.verifiedx.io/tx/<txid>` |
| API REST de Esplora (saldos, UTXO, transmisión) | `https://signet.verifiedx.io/api/…` |
| API de mempool (estimaciones de comisiones y más) | `https://signet.verifiedx.io/api/v1/…` |
| Servidor Electrum (TLS) | `signet.verifiedx.io:50002`, `signet-2.verifiedx.io:50002` |
| P2P de Bitcoin | `signet.verifiedx.io:38333`, `signet-2.verifiedx.io:38333` |

Las API siguen la API de mempool.space, así que un cliente escrito para mempool.space funciona cambiando su URL base. Por ejemplo:

```bash
# Current block height
curl https://signet.verifiedx.io/api/blocks/tip/height

# An address's balance and transactions
curl https://signet.verifiedx.io/api/address/tb1q.../txs

# Recommended fees
curl https://signet.verifiedx.io/api/v1/fees/recommended
```

VerifiedX Core en testnet, las billeteras de VerifiedX y el `BtcClient('testnet')` del SDK ya apuntan a estos servidores.

## Obtén BTC de signet

El [faucet de testnet](https://spyglass-testnet.verifiedx.io/faucet) paga BTC de signet en su pestaña **Signet BTC**: ingresa una dirección `tb1…`, el monto y tu número de teléfono, y luego el código que recibes por SMS. Cada número de teléfono puede recibir hasta 0.01 sBTC en total. El pago aparece en el explorador del signet de inmediato y se confirma en el siguiente bloque. Consulta [Testnet](/es/build/testnet/#obtén-fondos-de-prueba) para ver las dos pestañas del faucet, y [Web API: Faucet](/es/build/web-api/faucet/) para la API.

Si necesitas más sBTC del que da el faucet, pide en el canal `Testnet Faucet` de [Discord](https://discord.gg/7cd5ebDQCj).

## Minado de bloques

Los bloques vienen solo del firmante del equipo de VerifiedX, que produce uno cada 10 minutos aproximadamente. Como la red es del propio equipo, también puede producir bloques bajo demanda: los socios con [acceso a la API de socios](#acceso-a-la-api-de-socios) pueden minar hasta 10 bloques a la vez en lugar de esperar unos 10 minutos por cada confirmación.

## Acceso a la API de socios

Los equipos que se integran con VerifiedX y hacen pruebas contra la testnet desde scripts o CI pueden obtener acceso a la API de socios (Partner API). Viene en forma de dos tokens:

| Token | Qué hace |
|-------|--------------|
| **Token del faucet** | Fondea al instante direcciones de VFX de testnet y de BTC de signet mediante la API del faucet, sin número de teléfono ni código SMS |
| **Token de minado** | Mina de 1 a 10 bloques del signet bajo demanda, para que una prueba obtenga sus confirmaciones en segundos |

Para solicitar acceso, escribe en el canal `Testnet Faucet` de [Discord](https://discord.gg/7cd5ebDQCj) indicando tu equipo y lo que estás probando. Los tokens y el endpoint de minado vienen con el acceso. Trata los tokens como secretos: guárdalos en tu almacén de secretos o en los secretos de CI, nunca en un repositorio, un log o un issue, y pide uno nuevo si alguno se filtra.

### Fondea una dirección

```http
POST https://data-testnet.verifiedx.io/api/faucet/request/
X-Faucet-Token: <faucet token>
Content-Type: application/json
```

```json
{
  "address": "xC1zNn7596TC4Bcyn1vE88pj12hfieqCoa",
  "amount": "10",
  "btc_address": "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
  "btc_amount": "0.002"
}
```

Envía la parte de VFX (`address`, `amount`), la parte de BTC de signet (`btc_address`, `btc_amount`) o ambas. El faucet paga antes de responder:

```json
{
  "message": "Funds requested successfully.",
  "hash": "60ab…",
  "btc_hash": "9f3c…",
  "uuid": "6f1c2a9e-3b7d-4c55-9a4e-0d2f8e1b7c31"
}
```

- **Mínimos:** 0.0001 VFX y 0.00001 BTC. No hay máximo por solicitud.
- **Límites diarios:** 1,000 VFX y 0.1 BTC por cada 24 horas móviles, compartidos entre todos los socios. Pregunta en Discord si una prueba necesita más.
- **Rechazos:** HTTP 400 con un `message` (consulta [Web API: Faucet](/es/build/web-api/faucet/#errores)). Cuando una parte se paga y la otra falla, la respuesta igual incluye el hash de la parte pagada.
- **Resultado de BTC desconocido:** si el mensaje dice que el pago de BTC pudo haberse realizado, nunca se vuelve a enviar y igual cuenta para el límite. Revisa el [explorador del signet](https://signet.verifiedx.io) antes de volver a pedir.

### Mina bloques bajo demanda

```http
POST <mining endpoint>
Authorization: Bearer <mining token>
Content-Type: application/json
```

```json
{ "blocks": 6 }
```

`blocks` va de 1 a 10. La respuesta es HTTP 202 con una solicitud a la que darle seguimiento:

```json
{
  "id": 42,
  "status": "pending",
  "blocks": 6,
  "start_height": null,
  "end_height": null,
  "block_hashes": [],
  "error": "",
  "created_at": "2026-10-28T15:04:05+00:00",
  "finished_at": null
}
```

Consulta `GET <mining endpoint><id>/` con el mismo encabezado hasta que `status` sea `done` o `failed`. Pasa por `pending` → `mining` → `done`. Una solicitud terminada tiene `start_height`, `end_height` y `block_hashes`; una fallida tiene `error`.

| Respuesta | Significado |
|--------|---------|
| `202` | Aceptada; consulta la solicitud |
| `400` | `blocks` no es un número entero del 1 al 10 |
| `401` | Falta el token o es incorrecto |
| `503` | El minado bajo demanda está desactivado |

Reglas de uso:

- **Primero transmite, luego mina.** Un bloque solo incluye lo que ya está en el mempool.
- **Mina en una sola llamada lo que necesita un paso.** Para 6 confirmaciones, pide 6 bloques una vez; no mines en un bucle.
- **Mina solo cuando una prueba lo necesite.** Cada bloque extra acorta el período de dificultad actual, así que un uso intensivo sube un poco la siguiente dificultad para todos. Los bloques de 10 minutos siguen llegando de todas formas.

### Ejemplo: fondea y luego confirma

```bash
# FAUCET_TOKEN, MINING_TOKEN and MINE_URL come from your secret store
RESULT=$(curl -s -X POST https://data-testnet.verifiedx.io/api/faucet/request/ \
  -H "X-Faucet-Token: $FAUCET_TOKEN" -H "Content-Type: application/json" \
  -d '{"btc_address": "tb1q...", "btc_amount": "0.002"}')
echo "$RESULT" | jq -r .btc_hash

# One block confirms the payment; a vBTC vault deposit needs 4 (its block and 3 on top)
ID=$(curl -s -X POST "$MINE_URL" \
  -H "Authorization: Bearer $MINING_TOKEN" -H "Content-Type: application/json" \
  -d '{"blocks": 1}' | jq -r .id)
until curl -s "${MINE_URL}${ID}/" -H "Authorization: Bearer $MINING_TOKEN" \
  | jq -e '.status == "done" or .status == "failed"' > /dev/null; do sleep 2; done
curl -s "${MINE_URL}${ID}/" -H "Authorization: Bearer $MINING_TOKEN" | jq '{status, end_height, error}'
```

## Ejecuta tu propio nodo

Puedes seguir el signet con tu propio nodo de Bitcoin Core, conectándote como par con `signet.verifiedx.io:38333` y `signet-2.verifiedx.io:38333`. Un nodo necesita el script de desafío del signet (`signetchallenge`) para aceptar sus bloques; pídelo en el canal `Testnet Faucet` de [Discord](https://discord.gg/7cd5ebDQCj). La mayoría de las integraciones no necesitan un nodo: la API de Esplora y los servidores Electrum anteriores atienden directamente a las billeteras.
