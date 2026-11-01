---
sourceHash: "5484fc54551c"
title: "Tokens fungibles"
description: "Despliega un contrato inteligente de token fungible y emite, transfiere, quema, pausa, transfiere la propiedad de sus tokens y vota con ellos a través de la API de Core."
sidebar:
  order: 6
---

## Despliegue de un contrato inteligente de token fungible

Desplegar un contrato inteligente de token fungible sigue el mismo proceso que cualquier contrato inteligente. Revisa esta [documentación](/es/build/smart-contracts/compiling-and-minting/).

Agrega al payload un tipo de función (feature) con los detalles del token. `FeatureName` 13 es la función `Token`.

```jsonc

{
    ...
    "Features": [
        {
        "FeatureName": 13,
        "FeatureFeatures": {
            "TokenName": "My Token Name",
            "TokenTicker": "My Token Ticker",
            "TokenDecimalPlaces": 16,
            "TokenSupply": 1000, //0 for infinite supply
             "TokenBurnable": true,
             "TokenMintable": true,
             "TokenVoting": true,
             "TokenImageURL": "https://...", // optional
             "TokenImageBase": "base64ImageData..."
        },
      }
    ]
}
```

Después de compilarlo, el contrato inteligente del token todavía debe emitirse, con el mismo método que cualquier contrato inteligente.

```text
GET http://localhost:7292/scapi/scv1/MintSmartContract/{SMART_CONTRACT_UID}
```

## Emisión de tokens

Nota: el contrato inteligente del token base debe tener un suministro infinito para poder emitir tokens.

### Endpoint de la API

```text
GET http://localhost:7292/tkapi/TKV2/TokenMint/{scUID}/{fromAddress}/{amount}
```

### Parámetros de URL:
`scUID`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del propietario del contrato inteligente.

`amount`: la cantidad de tokens que se emitirán (admite decimales)

### Respuesta exitosa
```json
{
    "Success": true,
    "Message": "Result: TX Success. SCUID: ..."
}
```
> Nota: todos los métodos de acciones de tokens devuelven una estructura de respuesta similar. Si `Success` es `false`, el parámetro `Message` incluirá los detalles. Cada acción se envía desde una cuenta que guarda la billetera del nodo, y una billetera cifrada debe desbloquearse primero.

## Transferencia de tokens

### Endpoint de la API

```text
GET http://localhost:7292/tkapi/TKV2/TransferToken/{scUID}/{fromAddress}/{toAddress}/{amount}
```

### Parámetros de URL:

`scUID`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del remitente

`toAddress`: la dirección del destinatario

`amount`: la cantidad de tokens que se transferirán (admite decimales)

## Quema de tokens

### Endpoint de la API

```text
GET http://localhost:7292/tkapi/TKV2/BurnToken/{scUID}/{fromAddress}/{amount}
```

### Parámetros de URL:

`scUID`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del propietario de los tokens desde la que se quemarán.

`amount`: la cantidad de tokens que se quemarán (admite decimales)

## Pausa (y reanudación) de las transacciones del token

### Endpoint de la API

```text
GET http://localhost:7292/tkapi/TKV2/PauseTokenContract/{scUID}/{fromAddress}
```

### Parámetros de URL:

`scUID`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del propietario del token.

La misma llamada alterna: en un contrato pausado, lo reanuda.

## Bloqueo de una dirección

### Endpoint de la API

```text
GET http://localhost:7292/tkapi/TKV2/BanAddress/{scUID}/{fromAddress}/{banAddress}
```

### Parámetros de URL:

`scUID`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del propietario del token.

`banAddress`: la dirección que se bloqueará en el token.

## Cambio de propiedad

### Endpoint de la API

```text
GET http://localhost:7292/tkapi/TKV2/ChangeTokenContractOwnership/{scUID}/{fromAddress}/{toAddress}
```

### Parámetros de URL:

`scUID`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del remitente

`toAddress`: la dirección del destinatario

## Creación de un tema de votación

### Endpoint de la API

```text
POST http://localhost:7292/tkapi/TKV2/CreateTokenTopic
```

### Parámetros de datos POST:

```json
{
    "TopicName": "Raise the supply",
    "TopicDescription": "Mint 1,000 more tokens for the community fund.",
    "SmartContractUID": "<token smart contract UID>",
    "MinimumVoteRequirement": 10,
    "FromAddress": "<token owner address>",
    "VotingEndDays": 30
}
```

`TopicName` tiene como máximo 128 caracteres y `TopicDescription` como máximo 1,600. `MinimumVoteRequirement` es un número entero. `VotingEndDays` es uno de `30`, `60`, `90` o `180`. `FromAddress` debe ser el propietario del contrato del token.

## Emisión de un voto

### Endpoint de la API

```text
GET http://localhost:7292/tkapi/TKV2/CastTokenTopicVote/{scUID}/{fromAddress}/{topicUID}/{voteType}
```

### Parámetros de URL:

`scUID`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del votante

`topicUID`: el identificador único del tema

`voteType`: `1` == SÍ; `0` == NO

## Lectura de tokens y votos

- `GET /tkapi/TKV2/GetTokens/{scUID}/{getAll}`: los tokens que tienen las cuentas de la billetera (`getAll=true`), o los detalles de un token.
- `GET /tkapi/TKV2/GetTokensUpdate`: reconstruye la lista de tokens en memoria de la billetera.
- `GET /tkapi/TKV2/GetVoteBySmartContractUID/{scUID}`: los votos de la billetera en los temas de un token.
- `GET /tkapi/TKV2/GetVoteByTopic/{topicUID}`: los votos registrados para un tema.
- `GET /tkapi/TKV2/GetVotesByAddress/{fromAddress}`: todos los votos de tokens emitidos por una dirección.
- `GET /tkapi/TKV2/GetTokenOwnerVoteList/{tUID}`: la lista de votos que ve el propietario del token para un tema.
