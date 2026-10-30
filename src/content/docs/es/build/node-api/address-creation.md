---
sourceHash: 7bd0ff98bfd8
title: "Creación de direcciones de VFX"
description: "Cómo se deriva una dirección de VFX a partir de una clave privada ECDSA, paso a paso."
sidebar:
  order: 3
---

## Resumen:

El propósito de este documento es enseñarte cómo se crea una dirección de
VFX. Te guiará desde el primer paso hasta el final, que es una dirección
legible para las personas.

## Cómo crear una dirección de VFX

**La forma correcta de crear una dirección de VFX es usar software de billetera bien probado, de código abierto y revisado por pares.** Manejar las claves manualmente puede provocar, y ha provocado una y otra vez, la pérdida de fondos. A diferencia de otros sistemas centralizados, las pérdidas en VFX suelen ser irrecuperables. Continúa bajo tu propio riesgo.

Esta es una breve descripción de cómo funciona la generación de direcciones,
con fines informativos:

- Tener una clave privada ECDSA

  `18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725`

1.  Toma la clave pública correspondiente generada con ella y agrega el
    identificador hexadecimal '04'. Las claves privadas de VFX se crean a partir
    de la multiplicación ECDSA de `(curve.G, secret, curve.N, curve.A, curve.P)`.
    En el código se ve así:

        multiply(Point p, BigInteger n, BigInteger N, BigInteger A, BigIntegerP)

    Forma rápida de multiplicar un punto y un escalar en curvas elípticas

    - param p: primer punto que se multiplica

    - param n: escalar que se multiplica

    - param N: orden de la curva elíptica

    - param P:` Prime number in the module of the equation Y\^2 = X \^ 3 + A \* X + B(mod p)`

    - param A: `Coefficient of the first-order term of the equation Y \^ 2 = X \^ 3 + A \* X + B(mod p)`

    - return: **punto que representa la suma del primer y el segundo punto**

    Puedes verlo en el código en EllipticCurve-\>Math

    > Ten en cuenta que muchas bibliotecas de ECDSA manejan las claves públicas
    > de esta forma, así que quizá no necesites hacer el cálculo jacobiano anterior.

    ```
    \[04\*\*added\]50863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b23522cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6 =
    0450863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b23522cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6
    ```

1.  Aplica el hash SHA-256 a la clave pública del paso 1.

    `600ffe422b4e00731a59557a5cca46cc183944191006324a447bdb2d98d4b408`

1.  Aplica el hash RIPEMD-160 al resultado del SHA-256 del paso 2.

    `010966776006953d5567439e5e39f86a0d273bee`

1.  Agrega el byte de versión delante del hash RIPEMD-160 del paso 3 (0x3C
    para la red principal).

    `3c010966776006953d5567439e5e39f86a0d273bee`

    > _(ten en cuenta que los pasos siguientes son la codificación Base58Check,
    > que cuenta con varias bibliotecas que la implementan)_

1.  Aplica el hash SHA-256 al resultado extendido de RIPEMD-160 del paso 4.

    `24295fdd7e8c04bbc84f1e5151b4afa3380f900a5da58533a647c36fdc2d4cfd`

1.  Aplica el hash SHA-256 al resultado del hash SHA-256 anterior del
    paso 5.

    `3699e7d4f297550311c32721b57c801f873d07ef5a886cbd07146f478178b362`

1.  Toma los primeros 4 bytes del segundo hash SHA-256 del paso 6. Esta es
    la suma de verificación (checksum) de la dirección.

    `3699e7d4`

1.  Agrega los 4 bytes de la suma de verificación de la etapa 7 al final del
    hash RIPEMD-160 extendido de la etapa 4. Esta es la dirección de VFX
    binaria de 25 bytes.

    `3c010966776006953d5567439e5e39f86a0d273bee3699e7d4`

1.  Convierte el resultado de una cadena de bytes a una cadena base58 con la
    codificación Base58Check del paso 8.

    `R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR`
