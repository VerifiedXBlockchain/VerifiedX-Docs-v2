---
title: "Fungible Tokens"
description: "Deploy a fungible token smart contract and mint, transfer, burn, pause, transfer ownership of and vote with its tokens through the Core API."
sidebar:
  order: 6
---

## Deploying a Fungible Token Smart Contract

Deploying a fungible token smart contract follows the same process as any smart contract. Please review this [documentation](/build/smart-contracts/compiling-and-minting/).

Adding a feature type with the token details to the payload.

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

After compiling, the token smart contract still needs to be minted, following the same approach as any smart contract.

```
GET http://localhost:7292/scapi/scv1/MintSmartContract/{SMART_CONTRACT_UID}
```

## Minting Tokens

Note: The base token's smart contract must be of infinite supply in order to mint tokens.

### API Endpoint

```
GET http://localhost:7292/tkapi/TKV2/TokenMint/{id}/{fromAddress}/{amount}
```

### URL Params:
`id`: The token's smart contract identifier.

`fromAddress`: The smart contract owner's address.

`amount`: The amount of tokens to mint (decimals supported)

### Success Response
```json
{
    "Success": true,
    "Message": "TX Success. SCUID: ..."
}
```
> Note: all token action methods will return a similar response structure. If `Success` is `false` the `Message` param will include details.

## Transferring Tokens

### API Endpoint

```
GET http://localhost:7292/tkapi/TKV2/TransferToken/{id}/{fromAddress}/{toAddress}/{amount}
```

### URL Params:

`id`: The token's smart contract identifier.

`fromAddress`: The sender's address

`toAddress`: The recipient's address

`amount`: The amount of tokens to transfer (decimals supported)

## Burning Tokens

### API Endpoint

```
GET http://localhost:7292/tkapi/TKV2/BurnToken/{id}/{fromAddress}/{amount}
```

### URL Params:

`id`: The token's smart contract identifier.

`fromAddress`: The address of the token owner to burn from.

`amount`: The amount of tokens to burn (decimals supported)

## Pausing (and Unpausing) Token Transactions

### API Endpoint

```
GET http://localhost:7292/tkapi/TKV2/PauseTokenContract/{id}/{fromAddress}
```

### URL Params:

`id`: The token's smart contract identifier.

`fromAddress`: The address of the token owner.

## Change Ownership

### API Endpoint

```
GET http://localhost:7292/tkapi/TKV2/ChangeTokenContractOwnership/{id}/{fromAddress}/{toAddress}
```

### URL Params:

`id`: The token's smart contract identifier.

`fromAddress`: The sender's address

`toAddress`: The recipient's address

## Create Voting Topic Ownership

### API Endpoint

```
POST http://localhost:7292/tkapi/TKV2/CreateTokenTopic
```

### POST Data Params:

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

## Cast Vote

### API Endpoint

```
GET http://localhost:7292/tkapi/TKV2/CastTokenTopicVote/{id}/{fromAddress}/{topicUid}/{vote}
```

### URL Params:

`id`: The token's smart contract identifier.

`fromAddress`: The voter's address

`topicUid`: The topic's unique identifier

`vote`: `1` == YES; `0` == NO

