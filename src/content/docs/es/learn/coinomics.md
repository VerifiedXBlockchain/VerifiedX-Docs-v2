---
sourceHash: 286557cb7455
title: "Resumen de la moneda VerifiedX (VFX)"
description: La oferta, el modelo de quema, la utilidad y los detalles de VFX, la moneda nativa de la red VerifiedX.
sidebar:
  order: 4
  label: Coinomics
---

La moneda VerifiedX (VFX) es la moneda nativa de la red VerifiedX. Paga cada transacción, asegura la red mediante las garantías de los validadores (validators) y les da a los validadores su voz en la gobernanza.

## Coinomics

- **Oferta total**: la oferta total de VFX tiene un tope de 200,000,000 monedas. Nunca habrá en circulación más VFX que esta cantidad.

- **Sin recompensas para los validadores**: los validadores no reciben monedas nuevas. Las recompensas de bloque terminaron en el bloque 3,074,181 y la oferta se completó en 200,000,000 en el bloque 3,074,185. Desde entonces no se ha emitido ningún VFX, y el consenso rechaza cualquier bloque que pague una recompensa.

- **Modelo antiinflacionario**: VFX se quema de forma permanente; nunca se recauda. Cada comisión de transacción se destruye, al igual que los VFX que se pagan para registrar un dominio, abrir una casa de subastas, registrar una cuenta de bóveda (vault) o crear una propuesta de gobernanza. Una vez quemadas, las monedas salen de la oferta en circulación para siempre.

- **Modelo sostenible**: sin nueva emisión y con quema continua, VFX tiene una oferta fija y deflacionaria que favorece la conservación del valor a largo plazo.

## Utilidad de la moneda

- **Transacciones**: VFX es necesario para realizar transacciones en la red VerifiedX. Cada transacción, incluidas las de vBTC, tokens y NFTs, paga su comisión de red en VFX.

- **Convertirse en validador**: operar un validador requiere 5,000 VFX, bloqueados como fianza (bond) en la dirección del validador. La fianza no se puede gastar mientras el validador esté registrado y se libera 1,200 bloques después de que se mine la transacción de salida del validador. Un validador participa en las ceremonias de claves de vBTC y en la firma de los informes de Bitcoin una vez que su garantía lleva 14,400 bloques en su lugar (unos dos días). Consulta [Ejecutar un validador](/es/node/validator/).

- **Proponer y votar**: la gobernanza on-chain está abierta a los validadores. Una propuesta (tema) se crea desde una dirección de validador que tenga al menos 5,000 VFX y cuesta 10 VFX, que se queman. Los validadores votan las propuestas, un voto por validador, y un voto cuesta solo la comisión de red. Los periodos de votación son de 30, 60, 90 o 180 días.

- **Comisiones de servicio**: VFX paga las comisiones de servicio de la red, y todas se queman:

| Acción | Costo |
|---|---|
| Nombre de dominio (`.vfx` o `.btc`): crear, transferir o eliminar | 5 VFX |
| Casa de subastas: crear / actualizar / eliminar | 10 / 1 / 1 VFX |
| Registro de cuenta de bóveda (reserva) | 4 VFX |
| Propuesta de gobernanza | 10 VFX |
| Voto | solo la comisión de red |

- **Comisiones**: VFX es la única moneda que se usa para las comisiones en la red VerifiedX. La comisión de red es de 0.00002 VFX por KB de transacción, con un mínimo de 0.000003 VFX. Las comisiones del lado de Bitcoin de los retiros de vBTC se pagan en BTC.

- **Sin gas**: los contratos inteligentes de VerifiedX no se ejecutan en una EVM y no necesitan gas. Tienen protección integrada contra la recursión, así que la ejecución no cuesta comisiones de gas.

## Detalles de la moneda

- VFX tiene un tope de 200,000,000.
- Comisiones de transacción casi nulas, y todas se queman.
- Es una moneda nativa y no está construida sobre otra red.
- Por lo general usa solo 8 decimales.
- Se puede recuperar mediante cuentas de bóveda.
