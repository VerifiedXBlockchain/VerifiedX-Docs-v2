---
sourceHash: 33d4e047da55
title: "vBTC: Bitcoin verificado en la red VFX"
description: "Cómo las bóvedas de vBTC mantienen Bitcoin uno a uno: depósitos, transferencias, retiros, certificación de Bitcoin, bóvedas S3C y vBTC.b en Base."
sidebar:
  order: 7
  label: Protocolo vBTC
  attrs:
    class: sidebar-btc
---

vBTC lleva Bitcoin a la red VerifiedX (VFX) uno a uno. El Bitcoin se guarda en bóvedas (vaults) cuyas claves están divididas entre los validadores (validators) de VerifiedX, y el vBTC de la bóveda se mueve en VFX: se transfiere en segundos por una pequeña comisión en VFX, se usa en contratos inteligentes y se retira de vuelta a Bitcoin en cualquier momento.

## Cómo funciona

- **Bóvedas.** Una bóveda es un contrato inteligente vBTC V2 con su propia dirección de depósito Taproot de Bitcoin. Su clave se crea en una ceremonia de claves entre los validadores (generación distribuida de claves FROST) y se guarda en partes: ninguna parte, ni siquiera los validadores, tiene la clave completa, y para gastar se necesita un umbral de quienes tienen las partes.
- **Depósito.** El Bitcoin enviado a la dirección de depósito de una bóveda se acredita al dueño de la bóveda como vBTC, uno a uno, una vez que queda enterrado bajo suficientes bloques de Bitcoin.
- **Uso.** El dueño transfiere vBTC a cualquier dirección de VFX. Los poseedores lo transfieren a su vez, lo usan en contratos o lo llevan por el puente a Base como vBTC.b.
- **Retiro.** Cualquier poseedor puede pedir que su vBTC se pague a una dirección de Bitcoin. El vBTC sale de circulación y la bóveda paga el Bitcoin.

## Certificación de Bitcoin (Core 9.0)

A partir de Core 9.0, la propia red registra el Bitcoin de cada bóveda. Los validadores reportan a la cadena las transacciones de bóvedas de cada bloque de Bitcoin (informes de Bitcoin, tipo de transacción 43), firmadas por dos tercios del conjunto de firmantes validadores actual, y un evento de bóveda cuenta solo cuando su bloque de Bitcoin tiene 6 bloques encima (3 en testnet). Una bóveda creada después de la altura de registro de la certificación es **vigilada**:

- **Los saldos siguen al Bitcoin certificado.** El vBTC del dueño en una bóveda es el Bitcoin de la bóveda tal como lo registra la cadena, menos lo que tienen otros poseedores. Ningún nodo consulta a un servidor de Bitcoin, y no se confía ciegamente en ningún productor de bloques.
- **La cadena fija los retiros.** Cuando se mina una solicitud de retiro, cada nodo calcula la misma transacción de Bitcoin que lo paga, a partir de las monedas de la bóveda y con reglas fijas, y la registra (el "pin"). Los firmantes de la bóveda firman exactamente esa transacción y la transmiten. El retiro se completa cuando Bitcoin lo confirma. No se necesita una transacción de finalización ni una votación.
- **El solicitante mantiene el control.** Mientras el retiro espera su transacción de Bitcoin, su solicitante puede cancelarlo y recuperar el vBTC de inmediato. Una vez fijado, el solicitante puede aumentar su comisión de Bitcoin si no se está confirmando, o liberarlo, lo que devuelve las monedas a la bóveda y reembolsa el vBTC menos la comisión de esa transacción (tipo de transacción 44).
- **Las bóvedas mantienen vivas sus claves.** Cuando demasiados poseedores de la clave de una bóveda han salido del conjunto de validadores, los validadores crean una nueva clave para ella (tipo 46) y las monedas de la bóveda se mueven a la nueva clave mientras la anterior todavía puede firmar.
- **Se siguen las reorganizaciones de Bitcoin.** Si Bitcoin se reorganiza por debajo de eventos reportados, estos se revierten (tipo 45).

Las bóvedas creadas antes de la altura de registro (bóvedas **heredadas**, legacy) mantienen la forma de funcionar anterior hasta la altura de aplicación, y a partir de ella quedan congeladas. Sus poseedores deben pasar a una bóveda nueva o retirar antes de esa altura. En mainnet son 7,568,350 y 7,658,350; en testnet son 400 y 401.

## Bóvedas S3C

Un dueño puede hacer que la clave de una bóveda la tengan solo validadores que opera el propio dueño (S3C, contratos inteligentes en autocustodia): al menos tres de los validadores registrados del propio dueño, y todos participan en la ceremonia de claves y en la firma. Las bóvedas públicas nunca usan validadores S3C. Consulta [Bóvedas S3C](/es/build/vbtc/integration/#bóvedas-s3c).

## vBTC.b en Base

vBTC.b ("Verified Bitcoin on Base") lleva vBTC a Base como un ERC-20 con 8 decimales, mientras el Bitcoin permanece en sus bóvedas de VerifiedX y la emisión sigue siendo canónica: cada vBTC.b está respaldado por vBTC bloqueado en VerifiedX.

- **Hacia Base.** El dueño bloquea vBTC en VerifiedX (tipo de transacción 37). Cuando el bloqueo tiene 30 bloques de VFX de profundidad, cada validador del puente firma una certificación del bloqueo, y el nodo del dueño envía esas firmas al contrato de vBTC.b en Base, que emite solo con las firmas de al menos dos tercios de sus validadores (nunca menos de dos). El dueño paga el gas de Base desde una dirección de Base derivada de su clave de VFX.
- **De vuelta a VerifiedX.** Un poseedor quema vBTC.b en Base indicando una dirección de VFX. Los casters del puente ven la quema, se ponen de acuerdo sobre ella y acreditan el vBTC desde el fondo bloqueado (tipo 39).
- **Directo a Bitcoin.** Un poseedor quema vBTC.b en Base indicando una dirección de Bitcoin. Los casters registran la salida en VerifiedX (tipo 40), el consenso fija las transacciones de Bitcoin que la pagan a partir de las monedas de las bóvedas, y los firmantes de las bóvedas las firman, exactamente como en un retiro. La salida se completa cuando Bitcoin la confirma.

No se puede llevar vBTC por el puente directamente desde una bóveda S3C; consulta [Firma institucional (S3C)](/es/learn/institutional/s3c-signing/#operación-del-pool). Consulta [Puente a Base](/es/build/vbtc/integration/#puente-a-base-vbtcb) para ver las rutas.

## Redes

vBTC en mainnet está respaldado por Bitcoin mainnet. La testnet de VerifiedX sigue a la signet de VerifiedX, una signet privada de Bitcoin con bloques de 10 minutos y un explorador en `https://signet.verifiedx.io` (API Esplora en `https://signet.verifiedx.io/api`); el BTC de prueba se obtiene del [faucet de testnet](https://spyglass-testnet.verifiedx.io/faucet) (pestaña Signet BTC). Consulta [Testnet](/es/build/testnet/#obtén-fondos-de-prueba).

## Beneficios

- **Uno a uno.** Cada vBTC está respaldado por Bitcoin en una bóveda, y la cadena registra ese Bitcoin.
- **Sin un custodio único.** La clave de una bóveda existe solo en partes distribuidas entre validadores.
- **Rápido y económico.** Las transferencias de vBTC se liquidan en bloques de VFX por una pequeña comisión en VFX.
- **Programable.** vBTC funciona en contratos inteligentes de VFX y se puede llevar por el puente a Base.

## Integración

- [vBTC](/es/build/vbtc/integration/): la API del nodo, con cada ruta, ejemplo y error.
- [Integración de vBTC sin SDK](/es/build/vbtc/raw-integration/): construir y firmar fuera del nodo.
- [vBTC en la billetera](/es/wallet/vbtc/).

## Documentos

[vBTC Flow](/es/resources/documents/vbtc-flow/)

[vBTC One Sheet](/es/resources/documents/vbtc-one-sheet/)

El código fuente está en el [repositorio de VerifiedX Core](https://github.com/VerifiedXBlockchain/VerifiedX-Core).
