---
sourceHash: 18c75b35ea2d
title: "Firma institucional (S3C)"
description: Cómo una institución usa S3C para restringir la ceremonia de claves y la firma de Bitcoin de sus bóvedas de vBTC a tres o más validadores que opera.
sidebar:
  order: 3
  attrs:
    class: sidebar-btc
---

S3C (Self-Custodial Smart Contracts, contratos inteligentes en autocustodia) permite que una institución ejecute la firma de sus propias bóvedas (vaults) de vBTC. La institución opera al menos tres validadores (validators) de VerifiedX y los registra como su pool de firma. A partir de entonces, la clave de cada bóveda que crea su nodo la generan esos validadores, y solo ellos la tienen: el conjunto público de validadores nunca tiene una parte, y cada firma de Bitcoin de la bóveda proviene de la propia infraestructura de la institución.

Nada más cambia en la bóveda. El consenso sigue verificando los depósitos y gastos de Bitcoin de la bóveda a partir de la propia prueba de trabajo de Bitcoin y de las pruebas Merkle, y sigue fijando la transacción de Bitcoin exacta que paga cada retiro antes de que se firme. La institución controla la autorización y la ejecución; las reglas de la red siguen decidiendo qué se puede ejecutar. Consulta [Integración con Bitcoin](/es/learn/bitcoin-integration/) y [vBTC](/es/learn/vbtc-protocol/).

## Cómo funciona

- **El pool.** El nodo que crea las bóvedas (el nodo de emisión) enumera los validadores del pool en su configuración. Sus ceremonias de claves usan exactamente esos validadores y ningún otro.
- **Todo o nada.** Cada validador del pool debe estar utilizable, y todos participan en la ceremonia de claves. Si alguno no lo está, la ceremonia falla e indica cuál. Si la configuración del pool no es válida, el nodo se niega a crear bóvedas en lugar de recurrir al conjunto público de validadores.
- **Umbral.** Un retiro necesita las firmas del 51% del pool, redondeado hacia arriba: 2 de 3, 3 de 4, 3 de 5.
- **Retiros.** Cuando se solicita un retiro, el consenso fija la transacción de Bitcoin que lo paga, en el mismo bloque. Los validadores del pool firman exactamente esa transacción y la transmiten. No pueden firmar nada más para la bóveda.
- **Separación.** Los validadores S3C no participan en las ceremonias de claves ni en las rotaciones de claves de las bóvedas públicas. Como todo validador con antigüedad suficiente, siguen firmando los informes de Bitcoin que registran los eventos de bóvedas para toda la red.
- **Las claves se quedan con el pool.** La cadena nunca mueve una bóveda S3C a una clave nueva. Mantener en buen estado una parte suficiente del pool es responsabilidad de la institución (consulta [Planifica la redundancia](#planifica-la-redundancia)).

## Lo que necesitas

- **Al menos tres validadores**, cada uno configurado como en [Ejecutar un validador](/es/node/validator/): su propio servidor con una **dirección IPv4 pública** estática (en el pool no se aceptan direcciones IPv6 ni nombres de host), los puertos del validador abiertos y su propia dirección con 5,000 VFX bloqueados como garantía (bond).
- **Dos días de antigüedad de la fianza.** Un validador se une a una ceremonia de claves solo cuando su fianza lleva 14,400 bloques en su lugar (unos dos días).
- **Un nodo de emisión**: el nodo que tiene la dirección del dueño de la bóveda y crea las bóvedas, con su API de billetera habilitada. Debe poder llegar a cada validador del pool en las direcciones que indiques.

## 1. Marca cada validador como S3C

En cada validador del pool, agrega esta línea a `config.txt` (`~/.local/share/RBX/Config/config.txt` en Linux mainnet):

```
S3CValidator=true
```

Las claves distinguen mayúsculas de minúsculas, y el nodo deja de leer `config.txt` en la primera línea en blanco, así que coloca la línea en el bloque continuo de ajustes de la parte superior.

Reinicia el nodo y empieza a validar (paso 9 de la guía del validador). El registro del validador y cada heartbeat que envía llevan ahora la marca S3C on-chain. La marca sigue a la más reciente de esas transacciones, así que deja `S3CValidator=true` en su lugar: un heartbeat enviado sin ella convierte al validador de nuevo en uno público.

## 2. Configura el nodo de emisión

En el nodo de emisión, enumera el pool en `config.txt`, con una entrada `IP:ValidatorAddress` por validador, separadas por comas:

```
S3C=203.0.113.10:xVALIDATOR_ADDRESS_1,203.0.113.11:xVALIDATOR_ADDRESS_2,203.0.113.12:xVALIDATOR_ADDRESS_3
```

El nodo revisa la lista al arrancar: al menos tres entradas, solo direcciones IPv4 públicas y direcciones de VFX válidas. A partir de entonces, cada bóveda que crea este nodo es una bóveda S3C en este pool.

Reinicia el nodo y luego revisa el pool antes de crear cualquier cosa:

```bash
curl -s -H "apitoken: YOUR_API_TOKEN" http://localhost:7292/vbtcapi/VBTC/GetS3CStatus
```

Devuelve `Enabled`, `ConfigInvalid` e `IsS3CValidator`, y para cada validador configurado `RegisteredOnChain`, `Reachable` y `ConfigIPMismatch`. Cada validador debe estar registrado y ser alcanzable antes de que crees una bóveda.

## 3. Crea una bóveda

Las bóvedas S3C se crean mediante la API del nodo, en los mismos tres pasos que cualquier bóveda:

1. `POST /vbtcapi/VBTC/InitiateMPCCeremony/{ownerAddress}` inicia la ceremonia de claves en el pool.
2. `GET /vbtcapi/VBTC/GetCeremonyStatus/{ceremonyId}` le da seguimiento hasta que se completa.
3. `POST /vbtcapi/VBTC/CreateVBTCContract` crea la bóveda, y a continuación su dirección de depósito de Bitcoin.

Consulta [Crear una bóveda](/es/build/vbtc/integration/#crear-una-bóveda) para ver cada solicitud y respuesta. Las rutas de creación sin SDK que usa la billetera web siempre usan el conjunto público de validadores, así que las bóvedas S3C deben crearse mediante estas rutas del nodo.

A partir de aquí, la bóveda funciona como cualquier otra: los depósitos se acreditan una vez enterrados bajo 6 bloques de Bitcoin, el vBTC se transfiere libremente y los retiros siguen el [flujo de bóveda vigilada](/es/build/vbtc/integration/#retirar-a-bitcoin).

## Operación del pool

- **Mantén validando a los validadores.** Un validador del pool firma retiros solo mientras su nodo está validando. Un validador que deja de validar (por ejemplo, tras fallar su verificación de puertos) no firma nada hasta que se vuelve a iniciar.
- **Mantén actualizadas las IP registradas.** La ceremonia de claves contacta a cada validador en la IP de la línea `S3C=` del nodo de emisión, pero la firma de retiros encuentra a cada validador en la IP registrada on-chain. Si un validador cambia de lugar, actualiza ambas.
- **La salida de un validador no elimina su parte.** Un validador del pool que sale sigue teniendo partes de la clave de las bóvedas del pool. Conserva su nodo y sus partes de la clave hasta que esas bóvedas se vacíen: sus retiros todavía lo necesitan. Los respaldos de claves se comparten solo dentro del propio pool de la bóveda.
- **Mover vBTC a Base.** No se puede llevar vBTC por el puente a Base directamente desde una bóveda S3C. `POST /vbtcapi/VBTC/StartS3CAutoBridge` (`S3CContractUID`, `RequesterAddress`, `Amount`, `EvmDestination`) retira el monto a una bóveda pública acompañante y lo lleva por el puente desde ahí en una sola orquestación; dale seguimiento con `GET /vbtcapi/VBTC/GetS3CAutoBridgeStatus/{orchestrationId}`. Su progreso se guarda en memoria, así que, tras un reinicio del nodo, termina a mano los pasos restantes.

## Planifica la redundancia

Como la cadena nunca cambia la clave de una bóveda S3C, el pool debe conservar suficientes validadores en buen estado para firmar. Si quedan menos poseedores en buen estado que el umbral, las nuevas solicitudes de retiro de la bóveda se rechazan hasta que vuelvan suficientes de ellos.

| Tamaño del pool | Firmas necesarias | Validadores que se pueden perder |
|---|---|---|
| 3 | 2 | 1 |
| 4 | 3 | 1 |
| 5 | 3 | 2 |

Un pool de cinco tolera dos validadores caídos a la vez. Distribuye los validadores del pool entre distintos hosts y ubicaciones para que una sola interrupción no pueda dejar fuera a suficientes de ellos.

## Relacionado

- [Ejecutar un validador](/es/node/validator/)
- [vBTC](/es/learn/vbtc-protocol/) e [integración de vBTC](/es/build/vbtc/integration/#bóvedas-s3c)
- [Integración con Bitcoin en VerifiedX Core](/es/learn/bitcoin-integration/)
- [Panorama institucional](/es/learn/institutional/overview/)
