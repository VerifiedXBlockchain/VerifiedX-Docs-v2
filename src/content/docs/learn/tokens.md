---
title: "VerifiedX Token Contract Service"
description: The Token Contract Service for creating, managing, and transferring fungible tokens written in Trillium.
sidebar:
  order: 12
  label: Token contracts
---

The **Token Contract Service** in the **VerifiedX blockchain** is responsible for managing and interacting with token-based smart contracts. These contracts are crucial for creating fungible tokens, such as custom currencies, that can be issued, transferred, and tracked on the **VerifiedX blockchain**.

The service facilitates the creation of fungible tokens through the **Trillium** smart contract language, allowing users to deploy tokens on the blockchain and define their own custom token rules. The VerifiedX network provides a gasless experience, meaning users do not need to pay gas fees for deploying or interacting with these token contracts.

## Key Features

### 1. **Create and Deploy Fungible Tokens**
The **Token Contract Service** allows developers to create custom tokens by writing Trillium smart contracts that define the behavior of the tokens. These tokens can represent anything from digital assets to in-game currency, loyalty points, and more.

### 2. **Manage Token Supply**
With the **Token Contract Service**, developers can control the total supply of the token, manage minting and burning processes, and define rules for token transfer and ownership. This provides a flexible framework for various tokenization use cases.

### 3. **Gasless Token Operations**
A unique feature of the VerifiedX blockchain is that the **Token Contract Service** operates without requiring gas payments. This gasless environment allows token operations (e.g., transferring tokens, creating tokens) to be more efficient and cost-effective for users and developers.

### 4. **Support for Custom Token Logic**
The **Token Contract Service** provides flexibility in how tokens behave. Developers can define custom logic for token transfers, conditions under which tokens are minted or burned, and other special functionalities such as staking or rewards.

### 5. **Transaction Tracking**
The Token Contract Service keeps track of token transactions on the blockchain, ensuring that all transfers and changes to token balances are recorded in a secure and immutable manner.

### 6. **Voting**
Tokens also have a unique voting mechanism allowing them to perform true on chain voting. 

## Trillium Code for Token Creation

The **TokenSourceGenerator** generates **Trillium** code to create fungible tokens. This code is written in a way that simplifies the deployment of new tokens by abstracting the technical complexities of contract creation. Below is an example of what a basic token contract written in **Trillium** might look like:

### Example Token Contract in Trillium:

```trillium
let TokenName = "Vote Demo"
let TokenTicker = "VOTE"
let TokenDecimalPlaces = 8
let TokenSupply = 0
let TokenBurnable = true
let TokenVoting = true
let TokenMintable = true
let TokenImageURL = ""
let TokenImageBase = "base64_of_image"
let Name = "Vote Demo"
let Description = "VOTE"
let MinterAddress = "xJcWLXPJ8rGcs4CrKmhY35RC9JZP4NefC1"
let MinterName = "xJcWLXPJ8rGcs4CrKmhY35RC9JZP4NefC1"
let SmartContractUID = "54b75872cf2d4078bb66273ae933de5a:1734577732"
let Features = "13"
let SCVersion = 1
let FileSize = "5456"
let FileName = "5a7zyFswUAYDmlGK.png"
let AssetAuthorName = "xJcWLXPJ8rGcs4CrKmhY35RC9JZP4NefC1"
function NftMain(data : string) : string
{
  if data == "nftdata"
   {
       return GetNFTData(Name, Description, MinterAddress)
   }
  else if data == "getnftassetdata"
   {
       return GetNFTAssetData(FileName, FileSize, AssetAuthorName)
   }
  return "No Method Named " + data + " was found."
}
function GetNFTData(name : string, desc : string, mintAddr: string) : string
{
   return name + "|->" + desc + "|->" + mintAddr
}
function GetNFTAssetData(fileName : string, fileSize : string, assetAuthor : string) : string
{
   return (fileName + "|->" + fileSize + "|->" + assetAuthor)
}
function GetNFTId() : string
{
   return SmartContractUID
}
function GetNFTFeatures() : string
{
   return Features
}
function GetTokenDetails() : any
{
   return getTokenDetails(TokenName, TokenTicker, TokenDecimalPlaces, TokenSupply, TokenVoting, TokenBurnable, TokenImageURL, TokenImageBase)
}
function GetVotingRules() : any
{
   return getVotingRules(1, "nDPkmoWjuUDmhNxbtR", 30, true)
}
function GetBurnRules() : int
{
   return 0
}
function GetTokenFunctions() : any
{
   return "TokenTransfer()" + "|->""TokenDeploy()" + "|->" + "TokenVote()" + "|->" + "TokenCreateVote()" + "|->" + "TokenBurn()" + "|->" + "TokenMint()"
}
