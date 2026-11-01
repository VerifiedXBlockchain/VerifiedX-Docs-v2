---
sourceHash: 32f9bd975424
title: "Cuentas HD"
description: Crea y recupera cuentas jerárquicas deterministas (HD) que generan varias direcciones a partir de una sola frase de recuperación.
sidebar:
  order: 6
---

## Descripción general
Las cuentas jerárquicas deterministas (HD) generan varias direcciones a partir de una sola frase de recuperación.

## Crear una cuenta HD
1. **Genera la frase de recuperación**:
   - En **Operaciones**, en **Seguridad de la cuenta**, haz clic en **Crear cuenta HD**.
   - Elige entre una frase de 12 o de 24 palabras (“12 palabras” o “24 palabras”).
   - No se puede crear una cuenta HD mientras la billetera está cifrada.
   - Guarda la frase de forma segura, ya que es indispensable para la recuperación.
2. **Generación de direcciones nuevas**:
   - Cada dirección nueva se deriva de la frase de recuperación.
   - Las claves creadas antes de la cuenta HD no se pueden recuperar con la frase, así que respáldalas por separado.

## Recuperación
- En una billetera que aún no tiene cuentas, haz clic en **Restaurar cuenta HD** en **Operaciones** e ingresa la frase de recuperación.
- Vuelve a crear las direcciones generadas anteriormente según lo necesites.
- En la [billetera web](/es/wallet/web-wallet/), inicia sesión con **Mnemónico (cuenta HD)** para restaurar desde la frase.
