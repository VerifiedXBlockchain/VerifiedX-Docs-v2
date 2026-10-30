---
sourceHash: d9e129937608
title: "Tokens fungibles"
description: "Despliega un contrato inteligente de token fungible y emite, transfiere, quema, pausa, transfiere la propiedad de sus tokens y vota con ellos a través de la API de Core."
sidebar:
  order: 6
---

## Despliegue de un contrato inteligente de token fungible

Desplegar un contrato inteligente de token fungible sigue el mismo proceso que cualquier contrato inteligente. Revisa esta [documentación](/es/build/smart-contracts/compiling-and-minting/).

Agrega al payload un tipo de función (feature) con los detalles del token.

```json

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

```
GET http://localhost:7292/scapi/scv1/MintSmartContract/{SMART_CONTRACT_UID}
```

## Emisión de tokens

Nota: el contrato inteligente del token base debe tener un suministro infinito para poder emitir tokens.

### Endpoint de la API

```
GET http://localhost:7292/tkapi/TKV2/TokenMint/{id}/{fromAddress}/{amount}
```

### Parámetros de URL:
`id`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del propietario del contrato inteligente.

`amount`: la cantidad de tokens que se emitirán (admite decimales)

### Respuesta exitosa
```json
{
    "Success": true,
    "Message": "TX Success. SCUID: ..."
}
```
> Nota: todos los métodos de acciones de tokens devuelven una estructura de respuesta similar. Si `Success` es `false`, el parámetro `Message` incluirá los detalles.

## Transferencia de tokens

### Endpoint de la API

```
GET http://localhost:7292/tkapi/TKV2/TransferToken/{id}/{fromAddress}/{toAddress}/{amount}
```

### Parámetros de URL:

`id`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del remitente

`toAddress`: la dirección del destinatario

`amount`: la cantidad de tokens que se transferirán (admite decimales)

## Quema de tokens

### Endpoint de la API

```
GET http://localhost:7292/tkapi/TKV2/BurnToken/{id}/{fromAddress}/{amount}
```

### Parámetros de URL:

`id`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del propietario de los tokens desde la que se quemarán.

`amount`: la cantidad de tokens que se quemarán (admite decimales)

## Pausa (y reanudación) de las transacciones del token

### Endpoint de la API

```
GET http://localhost:7292/tkapi/TKV2/PauseTokenContract/{id}/{fromAddress}
```

### Parámetros de URL:

`id`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del propietario del token.

## Cambio de propiedad

### Endpoint de la API

```
GET http://localhost:7292/tkapi/TKV2/ChangeTokenContractOwnership/{id}/{fromAddress}/{toAddress}
```

### Parámetros de URL:

`id`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del remitente

`toAddress`: la dirección del destinatario

## Creación de la propiedad de un tema de votación

### Endpoint de la API

```
POST http://localhost:7292/tkapi/TKV2/CreateTokenTopic
```

### Parámetros de datos POST:

```json
    {
        "TopicName": "",
        "TopicDescription": "",
        "SmartContractUID": "",
        "MinimumVoteRequirement": "",
        "FromAddress": "",
        "VotingEndDays": "",
    }

```

## Emisión de un voto

### Endpoint de la API

```
GET http://localhost:7292/tkapi/TKV2/CastTokenTopicVote/{id}/{fromAddress}/{topicUid}/{vote}
```

### Parámetros de URL:

`id`: el identificador del contrato inteligente del token.

`fromAddress`: la dirección del votante

`topicUid`: el identificador único del tema

`vote`: `1` == SÍ; `0` == NO
