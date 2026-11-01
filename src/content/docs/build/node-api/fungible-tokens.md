---
title: "Fungible Tokens"
description: "Deploy a fungible token smart contract and mint, transfer, burn, pause, transfer ownership of and vote with its tokens through the Core API."
sidebar:
  order: 6
---

## Deploying a Fungible Token Smart Contract

Deploying a fungible token smart contract follows the same process as any smart contract. Please review this [documentation](/build/smart-contracts/compiling-and-minting/).

Adding a feature type with the token details to the payload. `FeatureName` 13 is the `Token` feature.

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

After compiling, the token smart contract still needs to be minted, following the same approach as any smart contract.

```text
GET http://localhost:7292/scapi/scv1/MintSmartContract/{SMART_CONTRACT_UID}
```

## Minting Tokens

Note: The base token's smart contract must be of infinite supply in order to mint tokens.

### API Endpoint

```text
GET http://localhost:7292/tkapi/TKV2/TokenMint/{scUID}/{fromAddress}/{amount}
```

### URL Params:
`scUID`: The token's smart contract identifier.

`fromAddress`: The smart contract owner's address.

`amount`: The amount of tokens to mint (decimals supported)

### Success Response
```json
{
    "Success": true,
    "Message": "Result: TX Success. SCUID: ..."
}
```
> Note: all token action methods will return a similar response structure. If `Success` is `false` the `Message` param will include details. Every action is sent from an account held by the node's wallet, and an encrypted wallet must be unlocked first.

## Transferring Tokens

### API Endpoint

```text
GET http://localhost:7292/tkapi/TKV2/TransferToken/{scUID}/{fromAddress}/{toAddress}/{amount}
```

### URL Params:

`scUID`: The token's smart contract identifier.

`fromAddress`: The sender's address

`toAddress`: The recipient's address

`amount`: The amount of tokens to transfer (decimals supported)

## Burning Tokens

### API Endpoint

```text
GET http://localhost:7292/tkapi/TKV2/BurnToken/{scUID}/{fromAddress}/{amount}
```

### URL Params:

`scUID`: The token's smart contract identifier.

`fromAddress`: The address of the token owner to burn from.

`amount`: The amount of tokens to burn (decimals supported)

## Pausing (and Unpausing) Token Transactions

### API Endpoint

```text
GET http://localhost:7292/tkapi/TKV2/PauseTokenContract/{scUID}/{fromAddress}
```

### URL Params:

`scUID`: The token's smart contract identifier.

`fromAddress`: The address of the token owner.

The same call toggles: on a paused contract it unpauses.

## Banning an Address

### API Endpoint

```text
GET http://localhost:7292/tkapi/TKV2/BanAddress/{scUID}/{fromAddress}/{banAddress}
```

### URL Params:

`scUID`: The token's smart contract identifier.

`fromAddress`: The address of the token owner.

`banAddress`: The address to ban from the token.

## Change Ownership

### API Endpoint

```text
GET http://localhost:7292/tkapi/TKV2/ChangeTokenContractOwnership/{scUID}/{fromAddress}/{toAddress}
```

### URL Params:

`scUID`: The token's smart contract identifier.

`fromAddress`: The sender's address

`toAddress`: The recipient's address

## Create Voting Topic

### API Endpoint

```text
POST http://localhost:7292/tkapi/TKV2/CreateTokenTopic
```

### POST Data Params:

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

`TopicName` is at most 128 characters and `TopicDescription` at most 1,600. `MinimumVoteRequirement` is a whole number. `VotingEndDays` is one of `30`, `60`, `90` or `180`. `FromAddress` must be the token contract's owner.

## Cast Vote

### API Endpoint

```text
GET http://localhost:7292/tkapi/TKV2/CastTokenTopicVote/{scUID}/{fromAddress}/{topicUID}/{voteType}
```

### URL Params:

`scUID`: The token's smart contract identifier.

`fromAddress`: The voter's address

`topicUID`: The topic's unique identifier

`voteType`: `1` == YES; `0` == NO

## Reading Tokens and Votes

- `GET /tkapi/TKV2/GetTokens/{scUID}/{getAll}`: the tokens held by the wallet's accounts (`getAll=true`), or one token's details.
- `GET /tkapi/TKV2/GetTokensUpdate`: rebuilds the wallet's in-memory token list.
- `GET /tkapi/TKV2/GetVoteBySmartContractUID/{scUID}`: the wallet's votes on a token's topics.
- `GET /tkapi/TKV2/GetVoteByTopic/{topicUID}`: the votes recorded for one topic.
- `GET /tkapi/TKV2/GetVotesByAddress/{fromAddress}`: every token vote cast by an address.
- `GET /tkapi/TKV2/GetTokenOwnerVoteList/{tUID}`: the vote list the token owner sees for a topic.

