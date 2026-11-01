---
sourceHash: b0d197dc2141
title: "Swagger"
description: "Dónde encontrar los entornos de prueba de API de Swagger para el Core CLI y para Spyglass."
sidebar:
  order: 7
---

## Swagger del CLI

El entorno de prueba de la API de Swagger se encuentra en <a href="http://localhost:7292/swagger">http://localhost:7292/swagger</a> en una máquina que ejecute el CLI (o en <a href="http://localhost:17292/swagger">http://localhost:17292/swagger</a> para testnet).
> La página de Swagger carga en loopback sin más configuración, pero las llamadas que pruebes desde ella solo responden después de habilitar la API desde el CLI (`10` en el menú principal) o con el argumento de inicio `enableapi`. En un nodo iniciado con `openapi`, la propia página de Swagger también requiere el encabezado `apitoken` (consulta [Autenticación](/es/build/node-api/overview/#autenticación)).

Lee más sobre esto [aquí](/es/build/node-api/overview/).


## Swagger de Spyglass (explorador de la red)

Puedes visitar el Swagger del explorador en esta URL: <a href="https://data.verifiedx.io/docs/">https://data.verifiedx.io/docs/</a> (testnet: <a href="https://data-testnet.verifiedx.io/docs/">https://data-testnet.verifiedx.io/docs/</a>). La descripción Swagger 2.0 sin procesar está en `https://data.verifiedx.io/docs.json`.
