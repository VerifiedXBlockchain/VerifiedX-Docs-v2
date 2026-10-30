---
sourceHash: 4fd00f4301a0
title: "Contratos inteligentes de VerifiedX y el lenguaje Trillium"
description: El lenguaje de contratos inteligentes Trillium y los casos de uso de los contratos inteligentes sin gas de VerifiedX que admite.
sidebar:
  order: 11
  label: Contratos inteligentes y Trillium
---

La blockchain VerifiedX (VFX) admite un sistema de contratos inteligentes versátil y sin gas, impulsado por el lenguaje **Trillium**. Este sistema habilita una amplia gama de aplicaciones descentralizadas y funcionalidades de gestión de activos digitales. Los contratos de VerifiedX tienen un amplio conjunto de posibles casos de uso, todos sin comisiones de gas, lo que los hace más eficientes y accesibles.

## El lenguaje de contratos inteligentes Trillium

**Trillium** es el lenguaje propio que se usa para desarrollar y ejecutar contratos inteligentes en la blockchain VerifiedX. Sus funciones clave incluyen:

- **Ejecución sin gas**: no se requieren comisiones de transacción para ejecutar contratos ni para interactuar con ellos.
- **Seguridad**: los contratos están diseñados con funciones de seguridad avanzadas para prevenir vulnerabilidades como la reentrada y los bucles o la recursión infinitos. 
- **Personalización**: permite contratos flexibles y escalables, adecuados para una amplia gama de casos de uso.

## Casos de uso de los contratos inteligentes de VerifiedX

El ecosistema actual de VerifiedX admite un conjunto diverso de tipos de contratos inteligentes que son parte integral de las finanzas descentralizadas, los activos digitales y más. A continuación se presentan los principales tipos de contratos y sus casos de uso:

### 1. **NFTs (tokens no fungibles / VFX10)**
Los contratos inteligentes de VerifiedX permiten crear y gestionar **NFTs**, que son tokens únicos e indivisibles que representan la propiedad de activos digitales o físicos. Pueden ser obras de arte, coleccionables, bienes raíces o cualquier activo que requiera prueba de autenticidad y de propiedad.

- **Caso de uso**: arte digital, coleccionables, activos dentro de juegos, títulos de propiedad.

### 2. **Regalías**
Los contratos inteligentes en VerifiedX admiten **pagos de regalías** para los creadores de contenido, lo que permite distribuir ingresos de forma automática cada vez que se vende o se transfiere un NFT o un activo digital. Los creadores pueden incorporar lógica de regalías en el contrato para asegurarse de recibir un porcentaje de las ventas futuras.

- **Caso de uso**: música, arte o propiedad intelectual con pagos de regalías continuos para los creadores.

### 3. **NFTs evolutivos**
Los **NFTs evolutivos** son un tipo innovador de NFT que cambia con el tiempo o según condiciones externas. Pueden representar personajes de un juego que suben de nivel, o activos que se revalorizan con el tiempo, y el contrato inteligente dicta los criterios de evolución.

- **Caso de uso**: activos de juegos que mejoran, arte dinámico que cambia según eventos del mundo real, o activos que desbloquean nuevos atributos con el tiempo.

### 4. **Tokens fungibles (VFX20)**
Además de los NFTs, los contratos inteligentes de VerifiedX permiten crear **tokens fungibles**, que son activos intercambiables como monedas o acciones. Estos tokens pueden representar cualquier activo divisible, desde una criptomoneda hasta la propiedad fraccionada de activos del mundo real.

- **Caso de uso**: tokens de finanzas descentralizadas (DeFi), monedas basadas en VFX o propiedad fraccionada de bienes físicos.

### 5. **Votación con tokens**
VerifiedX ofrece **sistemas de votación basados en tokens**, en los que los usuarios pueden participar en la gobernanza descentralizada votando propuestas con sus tokens. Este sistema garantiza procesos de votación transparentes e inmutables que pueden impulsar decisiones dentro de las comunidades descentralizadas.

- **Caso de uso**: una mejor gobernanza para aplicaciones descentralizadas, que las DAO actuales no logran ofrecer. Plataformas de votación comunitaria en las que los poseedores de tokens influyen en la dirección del proyecto.

### 6. **Multiactivos**
Los contratos inteligentes de VerifiedX permiten crear contratos que manejan **múltiples activos** a la vez, lo que habilita sistemas complejos como portafolios de tokens o activos híbridos que combinan NFTs y tokens fungibles en un mismo contrato.

- **Caso de uso**: plataformas descentralizadas de gestión de activos, portafolios con varios tipos de tokens (por ejemplo, una combinación de NFTs y tokens fungibles).

### 7. **vBTC (Bitcoin en bóveda en VerifiedX)**
La función de contrato inteligente **vBTC** habilita el **Bitcoin en bóveda** (Vault Bitcoin, vBTC) en la blockchain VerifiedX, lo que permite a los poseedores de Bitcoin traer su BTC al ecosistema VerifiedX. Esto abre oportunidades para que los poseedores de Bitcoin participen en actividades DeFi e interactúen con aplicaciones basadas en VerifiedX.

- **Caso de uso**: usar Bitcoin dentro del ecosistema VerifiedX, interactuar con contratos inteligentes de VFX o habilitar aplicaciones multicadena. Comisiones casi nulas y opciones de recuperación mediante cuentas de bóveda (vault). 

### 8. **Tokenización**
Los contratos inteligentes de VerifiedX facilitan la **tokenización** de activos del mundo real, que se convierten en tokens digitales en la blockchain. Estos tokens pueden representar la propiedad de bienes físicos como bienes raíces, autos o incluso materias primas, lo que facilita transferir, intercambiar y gestionar activos físicos de forma digital.

- **Caso de uso**: bienes raíces tokenizados, propiedad fraccionada de activos de alto valor, materias primas tokenizadas (por ejemplo, oro).

### 9. **Tokens soulbound**
Los **tokens soulbound (SBT)** son tokens no transferibles que representan las credenciales o los logros de una persona, lo que garantiza que queden vinculados a la identidad de quien los recibe. Estos tokens se pueden usar en sistemas de reputación, certificaciones u otros casos de uso en los que no conviene que sean transferibles.

- **Caso de uso**: certificaciones académicas, cualificaciones profesionales, credenciales basadas en la identidad.

## Ejecución de contratos inteligentes

Todos los contratos inteligentes de VerifiedX son sin gas, lo que significa que los usuarios no tienen que pagar comisiones de transacción para interactuar con contratos ni para desplegarlos. Esto reduce de forma significativa las barreras para desarrolladores y usuarios por igual, y permite aplicaciones descentralizadas escalables y económicas. Se les puede llamar SEN (Self-Executing Nodes, nodos autoejecutables). Este es el reemplazo de VerifiedX para las EVM y la forma en que puede lograrlo sin gas. 

### Puntos clave sobre los contratos inteligentes de VerifiedX:
- **Sin gas**: no se requieren comisiones de transacción para ninguna operación.
- **Seguros**: diseñados con seguridad de primer nivel para prevenir vulnerabilidades en los contratos.
- **Flexibles**: admiten una amplia gama de casos de uso, desde NFTs hasta DeFi y la gestión de identidades.
- **Potencial infinito**: aunque aquí se describen los casos de uso actuales, la flexibilidad del sistema permite posibilidades ilimitadas de creación de contratos.

## Conclusión

El **sistema de contratos inteligentes de VerifiedX** ofrece un entorno sin gas, escalable y muy flexible para crear aplicaciones descentralizadas con el lenguaje **Trillium**. Con soporte para NFTs, tokens fungibles, votación, tokenización de activos y más, VerifiedX permite a desarrolladores y usuarios participar en una amplia gama de casos de uso descentralizados, desde el arte digital hasta la gobernanza y las finanzas.

Para explorar más detalles técnicos y revisar los modelos de contratos inteligentes, visita el [repositorio de VerifiedX-Core en GitHub](https://github.com/VerifiedXBlockchain/VerifiedX-Core/tree/testnet/ReserveBlockCore/Models/SmartContracts).
