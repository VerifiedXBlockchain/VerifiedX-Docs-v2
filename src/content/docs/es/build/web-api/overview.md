---
sourceHash: "5b6254328da1"
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
9. **[Master Node](/es/build/web-api/master-node/)** - Validadores (validators), también llamados nodos maestros (master nodes): estado, ubicación y bloques producidos
10. **[Media](/es/build/web-api/media/)** - Almacenamiento y obtención de archivos multimedia
11. **[Metrics](/es/build/web-api/metrics/)** - Totales de la red, cadencia de bloques y cifras de circulación y quema
12. **[NFT](/es/build/web-api/nft/)** - Datos y operaciones de tokens no fungibles
13. **[Price](/es/build/web-api/price/)** - Precio de VFX en exchanges e historial de precios registrado
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

La mayoría de los endpoints son de acceso público. Actualizar o eliminar una tienda, una colección o una publicación requiere el token del propietario; la página [Shop](/es/build/web-api/shop/#autenticación) explica cómo obtenerlo.

## Formato de respuesta

Las respuestas son JSON con códigos de estado HTTP estándar. Los montos son números JSON. Los endpoints paginados aceptan `page` y `limit` (30 de forma predeterminada, máximo 500) y responden con esta estructura:

```json
{
  "count": 7624911,
  "page": 1,
  "num_pages": 254164,
  "results": []
}
```

No hay enlaces `next` ni `previous`; solicita la siguiente `page` en su lugar.
