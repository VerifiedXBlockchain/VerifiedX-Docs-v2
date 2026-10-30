---
sourceHash: a38e0f5f9658
title: "Integración con Bitcoin en VerifiedX Core"
description: Cómo el consenso de VerifiedX verifica la cadena de encabezados y la inclusión de transacciones de Bitcoin, de dónde provienen sus datos de Bitcoin y qué red de Bitcoin sigue cada red de VerifiedX.
sidebar:
  order: 6
  label: Integración con Bitcoin
  attrs:
    class: sidebar-btc
---

VerifiedX tiene un consenso que conoce Bitcoin. A partir de Core 9.0, la propia cadena verifica la cadena de encabezados de prueba de trabajo de Bitcoin y la inclusión de las transacciones de Bitcoin, y registra como estado de consenso el Bitcoin que tiene cada bóveda (vault) de vBTC. Cada nodo llega al mismo veredicto sobre ese estado de Bitcoin a partir de los datos de sus propios bloques, sin consultar a un servidor de Bitcoin y sin confiar ciegamente en un productor de bloques.

Esto es lo que permite que vBTC siga a su Bitcoin con exactitud: el saldo de una bóveda es el Bitcoin que la cadena ha verificado, y un retiro se paga con una transacción de Bitcoin que el consenso fija de antemano. Consulta [vBTC](/es/learn/vbtc-protocol/) para ver cómo lo usan las bóvedas.

## Cómo verifica la cadena a Bitcoin

### La cadena de encabezados

La cadena conserva los encabezados de bloque de Bitcoin a partir de un punto de control fijo. Un encabezado se acepta solo cuando extiende la punta almacenada y cumple las propias reglas de encabezados de Bitcoin: el objetivo de prueba de trabajo, el reajuste de dificultad cada 2,016 bloques y la regla de la mediana del tiempo pasado (median-time-past). Estas reglas solo leen encabezados anteriores, así que cada nodo las verifica sin acceso a la red. Se rechaza cualquier rama que se separe de la cadena por debajo del punto de control.

La única regla de Bitcoin que deliberadamente no se verifica es "no más de dos horas en el futuro", porque depende de un reloj local, que el consenso no puede usar. No hace falta: un bloque de Bitcoin cuenta solo cuando se ha construido más prueba de trabajo encima de él.

### Informes de Bitcoin

Los validadores (validators) convierten los bloques de Bitcoin en **informes de Bitcoin** (tipo de transacción 43). Un informe lleva los nuevos encabezados y cada evento de bóveda de un bloque de Bitcoin: un depósito al script de depósito de una bóveda, o el gasto de una moneda que la cadena tiene para una bóveda. Cada evento viene con la transacción de Bitcoin y su rama Merkle hasta el encabezado del bloque.

Un informe es válido solo cuando está firmado por dos tercios del conjunto de firmantes validadores actual y cada nodo puede verificarlo por su cuenta:

- los encabezados cumplen las reglas de encabezados anteriores y extienden la cadena almacenada;
- la rama Merkle de cada transacción lleva al encabezado que indica;
- el efecto de cada transacción sobre las monedas de las bóvedas lo calcula el propio nodo que verifica, a partir de la transacción y del estado de la cadena. Un informe nunca declara sus propios efectos.

Los validadores que están a la misma altura de VFX y tienen el mismo bloque de Bitcoin construyen informes idénticos byte por byte, así que los firmantes honestos coinciden.

### Profundidad de enterramiento

Un evento de bóveda cuenta solo cuando su bloque de Bitcoin está enterrado: con 6 bloques de Bitcoin encima en mainnet y 3 en testnet. Hasta entonces, un depósito no se acredita y un gasto no se liquida.

### Reorganizaciones

Si Bitcoin se reorganiza por debajo de eventos que la cadena ha registrado, los validadores reportan la rama más pesada y los eventos de los bloques reemplazados se revierten (tipo de transacción 45). No se sigue una rama que sea más larga pero que tenga menos trabajo.

### Lo que registra la cadena

Para cada bóveda vigilada, la cadena registra sus monedas de Bitcoin (outpoint y monto), a cuál de las claves de la bóveda paga cada moneda y la altura de Bitcoin en la que se creó o se gastó cada una. Los saldos, los retiros y las rotaciones de claves de esas bóvedas se calculan a partir de este registro. Consulta [Certificación de Bitcoin](/es/learn/vbtc-protocol/#certificación-de-bitcoin-core-90).

## De dónde provienen los datos de Bitcoin

El consenso no necesita acceso a Bitcoin: un nodo juzga un informe a partir del propio informe. Solo los validadores que firman informes obtienen datos de Bitcoin, y las funciones de billetera usan sus propios servidores.

### Validadores firmantes

Un validador firmante ejecuta un cliente ligero de Bitcoin integrado, sin un segundo proceso que instalar:

- Mantiene unos cuantos pares de Bitcoin encontrados mediante las semillas DNS de Bitcoin, elegidos de redes distintas para que ningún proveedor de hosting los suministre todos.
- Sigue la cadena de encabezados que esos pares sirven desde el punto de control y obtiene los bloques recientes de esa cadena. Cada bloque obtenido se verifica contra su encabezado antes de conservarlo. En mainnet se conservan en disco unos 300 MB de bloques recientes.
- También pide sus encabezados a algunos otros validadores activos en cada ronda.
- Los exploradores Esplora públicos (mempool.space y blockstream.info en mainnet) se consultan solo cuando ningún par entrega un bloque, y lo que devuelven se verifica como cualquier otra fuente.

Un validador que no puede obtener un bloque de la cadena más pesada espera; no firma un informe que no puede construir. El validador necesita acceso saliente a la red peer-to-peer de Bitcoin (puerto 8333 en mainnet). Consulta [Ejecutar un validador](/es/node/validator/).

### Funciones de billetera

Las funciones de billetera de Bitcoin del nodo (cuentas BTC, saldos, salidas no gastadas y la transmisión de transacciones de Bitcoin) usan servidores Electrum. Viene integrada una lista predeterminada de servidores públicos; configura los tuyos en `config.txt` con una lista separada por comas, usando `https://` para una conexión TLS:

```
ElectrumServers=https://electrum.example.com:50002,http://10.0.0.5:50001
```

Estos servidores solo proporcionan datos de billetera. No tienen ningún papel en el consenso ni ninguna influencia sobre los saldos de las bóvedas.

## Redes

- **Mainnet** sigue a Bitcoin mainnet.
- **Testnet** sigue a la signet de VerifiedX, una signet privada de Bitcoin (BIP 325) con bloques de 10 minutos. Cada bloque de la signet debe llevar la firma de la signet, y los encabezados provienen solo de los propios nodos de la signet y de su explorador en `https://signet.verifiedx.io`. La configuración de Electrum del nodo apunta automáticamente a los propios servidores de la signet. Consulta [Testnet](/es/build/testnet/).

## Relacionado

- [vBTC](/es/learn/vbtc-protocol/): bóvedas, retiros vigilados y S3C.
- [Integración de vBTC](/es/build/vbtc/integration/) e [integración de vBTC sin SDK](/es/build/vbtc/raw-integration/).
- [Firma institucional (S3C)](/es/learn/institutional/s3c-signing/): ejecutar la firma de una bóveda en tus propios validadores.
- [Repositorio de VerifiedX Core](https://github.com/VerifiedXBlockchain/VerifiedX-Core) (`VerifiedXCore/Bitcoin/Attestation`).
