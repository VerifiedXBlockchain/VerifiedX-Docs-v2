---
sourceHash: 82fdfb946ad0
title: "Contratos inteligentes"
description: Integra los contratos inteligentes de VFX con aplicaciones de terceros mediante la API del CLI de Core, con notas de configuración y un índice de las operaciones.
sidebar:
  order: 0
---

Esta sección explica cómo integrar los contratos inteligentes de VFX con aplicaciones de terceros mediante la API del CLI de Core.

## Código de ejemplo

Revisa este repositorio, que incluye ejemplos completos de todas las integraciones de contratos inteligentes en node/javascript:
<a href="https://github.com/ReserveBlockIO/rbx-integration-js-examples" target="_blank">https://github.com/ReserveBlockIO/rbx-integration-js-examples</a>

<p></p>

:::note[Consejo]
Los fragmentos de este repositorio también aparecen en las siguientes páginas, pero el repositorio de ejemplo te permite interactuar con el código.
:::

## Notas generales

1. Necesitas un CLI de Core en ejecución con su API habilitada
    - Presiona `10` para habilitar la API en la interfaz del CLI
    - O inícialo así: `./VerifiedXCore enableapi`

2. Si la billetera se ejecutará en otra máquina, tienes que habilitar la opción `openapi` al iniciarlo
    - `./VerifiedXCore enableapi openapi`
    - Esto te permite comunicarte con la API del CLI desde fuera de localhost

3. Si planeas ejecutarlo con openapi, se recomienda definir un `apitoken` para bloquear el acceso no autenticado.
    - `./VerifiedXCore enableapi openapi apitoken=random_lowercase_string`
    - Luego, en todas las solicitudes tienes que agregar este par clave/valor a los encabezados: `{"apitoken": "random_lowercase_string"}`
    - Si no lo incluyes o el token no es correcto, la API devuelve un error 403

4. Hay muchos más endpoints de la API disponibles. Visita http://localhost:7292/swagger en la máquina que ejecuta el CLI+API para revisar todo lo disponible e interactuar con ello.

5. Verás una referencia a `CLI_BASE_URL` en todos los ejemplos. En la mayoría de los casos debe ser `http://localhost:7292`.

## Contenido

1. [Compilar y emitir](/es/build/smart-contracts/compiling-and-minting/)

2. [Transferir NFTs](/es/build/smart-contracts/transferring/)

3. [Quemar NFTs](/es/build/smart-contracts/burning/)

4. [Evolucionar NFTs](/es/build/smart-contracts/evolving/)

5. [Casas de subastas](/es/build/smart-contracts/auction-house/)

6. [Colecciones](/es/build/smart-contracts/collections/)

7. [Publicaciones](/es/build/smart-contracts/listings/)
