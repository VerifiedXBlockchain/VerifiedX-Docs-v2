---
sourceHash: bf4933ca28ca
title: "Validación"
description: Lo que necesitas para convertirte en validador de VerifiedX desde la billetera, y qué hacen los validadores.
sidebar:
  order: 13
---

Para convertirte en validador (validator) en la red de VerifiedX, necesitarás:

- **5,000 VFX en garantía.** Mientras tu dirección sea un validador registrado, 5,000 VFX de ella no se pueden enviar. Todo lo que supere los 5,000 sigue disponible para gastar. Cuando dejas de validar, la billetera envía una transacción de salida de validador, y los 5,000 VFX se desbloquean 1,200 bloques (unas cuatro horas) después de que la salida se mina. No hay comisiones ni penalizaciones. Mantén 5,001 VFX para que una comisión de transacción nunca te deje por debajo de 5,000.
- **Una máquina que cumpla las especificaciones estándar, con una dirección IP pública estática.**
- **Puertos abiertos:** `3338`, `3339`, `7294` y `7295` (testnet: `13338`, `13339`, `17294` y `17295`). La billetera comprueba `3339`, `7294` y `7295` desde el exterior antes de empezar a validar y los sigue comprobando; si siguen inaccesibles durante unos 90 segundos, la validación se detiene (sin una salida, así que los 5,000 VFX siguen en garantía) hasta que la vuelvas a iniciar.
- **Acceso saliente a la red de Bitcoin** (puerto `8333`), porque los validadores siguen Bitcoin para vBTC.

Los validadores no reciben recompensas por bloque. Protegen la red y, desde Core 9.0, también siguen Bitcoin, firman los informes que registran los depósitos y gastos de las bóvedas (vaults) de vBTC, y participan en las ceremonias de claves y la firma de retiros de vBTC una vez que su garantía lleva unos dos días activa. Consulta [Ejecutar un validador](/es/node/validator/) para ver el panorama completo.

Cada validador que ejecutas te otorga un voto en las propuestas, cambios y mejoras de la red, lo que crea un órgano de gobierno verdaderamente descentralizado con una metodología de un CPU, un voto, en la que los validadores definen en conjunto el futuro de la red. Todo esto se logra con acciones ‘de un clic’ y elementos visuales en tiempo real en las billeteras.
