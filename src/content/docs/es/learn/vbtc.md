---
sourceHash: 6a4d398e9dd5
title: Acerca de vBTC
description: vBTC es la propiedad programable, no sintética y sin intermediarios de confianza de Bitcoin, verificada por el consenso de VerifiedX.
sidebar:
  order: 2
  attrs:
    class: sidebar-btc
---

vBTC transforma Bitcoin de una reserva de valor pasiva en un activo de liquidación programable, de nivel institucional y capaz de generar rendimiento, que no depende de intermediarios de confianza, sin tokens envueltos (wrapped), sin riesgo de custodia y sin exposición sintética. El consenso de VerifiedX verifica el Bitcoin detrás de cada bóveda (vault) y fija cada redención, de modo que vBTC sigue a su Bitcoin con exactitud.

> vBTC es la propiedad programable, no sintética y sin intermediarios de confianza de Bitcoin, diseñada para habilitar un verdadero DeFi nativo de Bitcoin sin puentes custodiales, pagarés ni el riesgo de los activos envueltos.

## Aspectos clave

- **Propiedad real:** respaldo 1:1 en Bitcoin, no sintético y totalmente verificable on-chain.
- **Sin riesgo de puente:** elimina a los custodios centralizados y las vulnerabilidades de los puentes multifirma.
- **DeFi nativo:** permite otorgar y tomar préstamos y hacer prime brokerage directamente con Bitcoin.
- **Listo para instituciones:** finalidad instantánea y comisiones predecibles, adecuadas para bancos, fondos y creadores de mercado.

## Garantías institucionales fundamentales

- **Sin intermediarios de confianza por diseño:** no hay un custodio centralizado ni una autoridad de emisión discrecional. La emisión se rige por reglas.
- **Bitcoin no sintético:** no es un derivado. No hay rehipotecación ni exposición de balance. Propiedad directa y demostrable.
- **Respaldo 1:1 en Bitcoin:** emisión, quema y redención deterministas.
- **Verificabilidad on-chain:** la oferta y la liquidación se pueden auditar on-chain. Los validadores (validators) certifican en la cadena el Bitcoin de cada bóveda, así que los saldos no dependen de un informe externo a la cadena.

## Verificado por consenso

- **Consenso que conoce Bitcoin:** cada nodo verifica la cadena de encabezados de prueba de trabajo de Bitcoin y la inclusión Merkle de cada depósito y gasto de las bóvedas. No se confía ciegamente en ningún servidor de Bitcoin ni en ningún productor de bloques. Consulta [Integración con Bitcoin](/es/learn/bitcoin-integration/).
- **Redención fijada por consenso:** cuando se solicita un retiro, el consenso determina la transacción de Bitcoin exacta que lo paga antes de que se haga cualquier firma. Los firmantes de la bóveda solo pueden firmar esa transacción.
- **Firma por umbral:** la clave de Bitcoin de cada bóveda existe solo en partes distribuidas entre validadores (FROST); ninguna parte tiene la clave completa.
- **Firma controlada por la institución:** las instituciones pueden restringir la ceremonia de claves y la firma de una bóveda a tres o más validadores que ellas mismas operan (S3C). Consulta [Firma institucional](/es/learn/institutional/s3c-signing/).

## Velocidad, costo y liquidación

- **Finalidad instantánea:** liquidación casi instantánea frente a la latencia de Bitcoin L1.
- **Comisiones bajas y predecibles:** costos de transacción fijos y mínimos.
- **Siempre activo:** disponibilidad global 24/7 (sin lotes ni horarios de corte).

## Bitcoin programable

- **Contratos inteligentes nativos:** Bitcoin se vuelve programable sin modificar Bitcoin.
- **Ejecución determinista:** los contratos se ejecutan exactamente como están escritos, sin cambios de estado impulsados por oráculos.
- **Infraestructura componible:** se integra en el otorgamiento y la toma de préstamos, los depósitos en garantía, la compensación y la liquidación.

## Verdadero DeFi nativo de Bitcoin

- **Sin riesgo de puente:** sin puente multifirma y sin un custodio único: la clave de Bitcoin de cada bóveda existe solo en partes distribuidas entre validadores, y la cadena registra el Bitcoin de cada bóveda.
- **Arquitectura centrada en Bitcoin:** Bitcoin es el activo de referencia, no un token secundario.
- **Nivel institucional:** cercano a la banca (no un mercado gris). Apto como colateral y para compensación.

## Principales casos de uso institucionales

- **Otorgar y tomar préstamos:** vBTC es un colateral impecable, sin riesgo de rehipotecación.
- **Prime brokerage on-chain:** margen, compensación neta y liquidación.
- **Optimización de tesorería:** conserva la exposición mientras liberas eficiencia de capital.
- **Compensación y liquidación:** liquidación atómica y definitiva, sin intermediarios.
- **DeFi compatible con la custodia:** se integra con los marcos de cumplimiento institucionales.

## Para quién está diseñado vBTC

- Bancos y casas de bolsa
- Fondos y gestores de activos
- Exchanges y plataformas de liquidez
- Custodios y proveedores de infraestructura
- Creadores de mercado y mesas de prime brokerage

## Documentos

- [vBTC Hero Doc](/es/resources/documents/vbtc-hero-doc/)
- [vBTC One Sheet](/es/resources/documents/vbtc-one-sheet/)
- [vBTC: tecnología y flujo](/es/resources/documents/vbtc-flow/)

## Técnico

- [vBTC en Core](/es/learn/vbtc-protocol/)
- [vBTC en la GUI](/es/wallet/vbtc/)
- [Integración de vBTC](/es/build/vbtc/integration/)
- [Integración de vBTC sin SDK](/es/build/vbtc/raw-integration/)
- [Integración con Bitcoin en VerifiedX Core](/es/learn/bitcoin-integration/)
- [Firma institucional (S3C)](/es/learn/institutional/s3c-signing/)

## Soluciones

- [Panorama institucional](/es/learn/institutional/overview/)
- [Integración con custodios](/es/learn/institutional/custody-integration/)
