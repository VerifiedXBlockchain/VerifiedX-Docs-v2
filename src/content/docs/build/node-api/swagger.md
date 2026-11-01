---
title: "Swagger"
description: "Where to find the Swagger API playgrounds for the Core CLI and for Spyglass."
sidebar:
  order: 7
---

## CLI Swagger

The swagger API playground can be found at <a href="http://localhost:7292/swagger">http://localhost:7292/swagger</a> on a machine running the CLI (or <a href="http://localhost:17292/swagger">http://localhost:17292/swagger</a> for testnet).
> The Swagger page loads on loopback without further setup, but the calls you try from it answer only after the API is enabled through the CLI (`10` on the main menu) or with the `enableapi` launch argument. On a node started with `openapi`, the Swagger page itself also requires the `apitoken` header (see [Authentication](/build/node-api/overview/#authentication)).

Read more about this [here](/build/node-api/overview/).


## Spyglass (Network Explorer) Swagger

You can visit the explorer's swagger at this URL: <a href="https://data.verifiedx.io/docs/">https://data.verifiedx.io/docs/</a> (testnet: <a href="https://data-testnet.verifiedx.io/docs/">https://data-testnet.verifiedx.io/docs/</a>). The raw Swagger 2.0 description is at `https://data.verifiedx.io/docs.json`.
