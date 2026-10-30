---
sourceHash: 5d2023ae3a74
title: "Web API"
description: "La Web API del VFX Explorer (Spyglass): sus espacios de nombres, URL base, entorno de pruebas de Swagger, autenticación y formato de respuesta."
sidebar:
  order: 1
---

Esta sección documenta los endpoints de la Web API del VFX Explorer, organizados por espacio de nombres. La API da acceso a datos de la blockchain, como direcciones, transacciones, bloques, NFTs y más.

## Espacios de nombres disponibles

Estos son los espacios de nombres de la API disponibles (sin incluir applications, auth y galxe):

1. **[Addresses](/es/build/web-api/addresses/)** - Información de direcciones, saldos y tokens en posesión
2. **[ADNR](/es/build/web-api/adnr/)** - Sistema de resolución de nombres de dominio para direcciones (Address Domain Name Resolution)
3. **[Block](/es/build/web-api/block/)** - Bloques de la blockchain y sus datos
4. **[BTC](/es/build/web-api/btc/)** - Funciones relacionadas con Bitcoin y funciones multicadena
5. **[Chat](/es/build/web-api/chat/)** - Funciones de chat y mensajería
6. **[CMC Price](/es/build/web-api/cmc-price/)** - Integración de datos de precios de CoinMarketCap
7. **[Faucet](/es/build/web-api/faucet/)** - Funciones del faucet de testnet
8. **[Fungible Token](/es/build/web-api/fungible-token/)** - Información y operaciones de tokens fungibles
9. **[Master Node](/es/build/web-api/master-node/)** - Datos y estadísticas de los nodos maestros
10. **[Media](/es/build/web-api/media/)** - Almacenamiento y obtención de archivos multimedia
11. **[Metrics](/es/build/web-api/metrics/)** - Métricas y analítica de la red
12. **[NFT](/es/build/web-api/nft/)** - Datos y operaciones de tokens no fungibles
13. **[Price](/es/build/web-api/price/)** - Datos de precios e información de mercado
14. **[Raw](/es/build/web-api/raw/)** - Operaciones y utilidades de bajo nivel de la blockchain
15. **[Shop](/es/build/web-api/shop/)** - Funciones del marketplace y las tiendas de NFTs
16. **[Transaction](/es/build/web-api/transaction/)** - Datos y operaciones de transacciones

## URL base

Todos los endpoints de la API están disponibles en:
```
Mainnet: https://data.verifiedx.io/api/
Testnet: https://data-testnet.verifiedx.io/api/
```

## Swagger
Puedes usar el entorno de pruebas de Swagger aquí:
```
Mainnet: https://data.verifiedx.io/docs/
Testnet: https://data-testnet.verifiedx.io/docs/
```



## Autenticación

La mayoría de los endpoints son de acceso público. Los requisitos de autenticación se indican en la documentación de cada endpoint cuando corresponde.

## Formato de respuesta

Todas las respuestas de la API siguen un formato JSON uniforme con los códigos de estado HTTP adecuados. Los endpoints paginados incluyen los metadatos de paginación estándar.
