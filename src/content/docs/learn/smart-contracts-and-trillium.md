---
title: "VerifiedX Smart Contracts and Trillium Language"
description: The Trillium smart contract language and the gasless VerifiedX smart contract use cases it supports.
sidebar:
  order: 11
  label: Smart contracts and Trillium
---

The VerifiedX (VFX) blockchain supports a versatile, gasless smart contract system powered by the **Trillium** language. This system enables a wide range of decentralized applications and digital asset management functionalities. VerifiedX contracts have a broad set of potential use cases, all running with no gas fees, making them more efficient and accessible.

## Trillium Smart Contract Language

**Trillium** is the custom language used for developing and executing smart contracts on the VerifiedX blockchain. Its key features include:

- **Gasless Execution**: No transaction fees are required for executing or interacting with contracts.
- **Security**: Contracts are designed with advanced security features to prevent vulnerabilities like re-entrance, and infinite looping/recursion. 
- **Customizability**: Allows for flexible and scalable contracts suited to a wide range of use cases.

## Use Cases for VerifiedX Smart Contracts

The current VerifiedX ecosystem supports a diverse set of smart contract types that are integral to decentralized finance, digital assets, and beyond. Below are the key contract types and their use cases:

### 1. **NFTs (Non-Fungible Tokens/ VFX10)**
VerifiedX smart contracts enable the creation and management of **NFTs**, which are unique, indivisible tokens that represent ownership of digital or physical assets. These could be artwork, collectibles, real estate, or any asset that requires proof of authenticity and ownership.

- **Use Case**: Digital art, collectibles, in-game assets, property titles.

### 2. **Royalties**
Smart contracts on VerifiedX support **royalty payments** for content creators, allowing for automated distribution of revenue whenever an NFT or digital asset is sold or transferred. Creators can embed royalty logic into the contract to ensure they receive a percentage of future sales.

- **Use Case**: Music, art, or intellectual property with ongoing royalty payments for creators.

### 3. **Evolving NFTs**
An innovative type of NFT, **Evolving NFTs** change over time or based on external conditions. These could represent characters in a game that level up, or assets that appreciate in value over time, with the smart contract dictating the evolution criteria.

- **Use Case**: Gaming assets that upgrade, dynamic art that changes based on real-world events, or assets that unlock new traits over time.

### 4. **Fungible Tokens (VFX20)**
In addition to NFTs, VerifiedX smart contracts support the creation of **fungible tokens**, which are interchangeable assets such as currencies or stocks. These tokens can represent any divisible asset, from cryptocurrency to fractional ownership of real-world assets.

- **Use Case**: Decentralized finance (DeFi) tokens, VFX-based currencies, or fractional ownership of physical goods.

### 5. **Token Voting**
VerifiedX provides **token-based voting systems**, where users can participate in decentralized governance by voting on proposals with their tokens. This system ensures transparent and immutable voting processes that can drive decisions within decentralized communities.

- **Use Case**: Better governance for decentralized applications that current DAOs fall short of. Community voting platforms where token holders influence project direction.

### 6. **Multi Assets**
VerifiedX smart contracts allow for the creation of contracts that handle **multiple assets** simultaneously, enabling complex systems such as portfolios of tokens or hybrid assets combining NFTs and fungible tokens in one contract.

- **Use Case**: Decentralized asset management platforms, portfolios with multiple token types (e.g., a mix of NFTs and fungible tokens).

### 7. **vBTC (Vaulted Bitcoin on VerifiedX)**
The **vBTC** smart contract feature enables **Vault Bitcoin** (vBTC) on the VerifiedX blockchain, allowing Bitcoin holders to bring their BTC into the VerifiedX ecosystem. This opens up opportunities for Bitcoin holders to participate in DeFi activities and interact with VerifiedX-based applications.

- **Use Case**: Using Bitcoin within the VerifiedX ecosystem, interacting with VFX smart contracts, or enabling cross-chain applications. Near zero fees, and recovery options through vault accounts. 

### 8. **Tokenization**
VerifiedX smart contracts facilitate the **tokenization** of real-world assets, converting them into digital tokens on the blockchain. These tokens can represent ownership in physical goods like real estate, cars, or even commodities, making it easier to transfer, trade, and manage physical assets digitally.

- **Use Case**: Tokenized real estate, fractional ownership of high-value assets, tokenized commodities (e.g., gold).

### 9. **Soulbound Tokens**
**Soulbound Tokens (SBTs)** are non-transferable tokens that represent an individual’s credentials or achievements, ensuring that they are bound to the recipient’s identity. These tokens can be used for reputation systems, certifications, or other use cases where transferability is not desirable.

- **Use Case**: Academic certifications, professional qualifications, identity-based credentials.

## Smart Contract Execution

All VerifiedX smart contracts are gasless, meaning users are not required to pay any transaction fees to interact with or deploy contracts. This significantly reduces barriers for developers and users alike, allowing for scalable, cost-effective decentralized applications. These can be referred to as SENs (Self-Executing Nodes). This is our replacement for EVMs and how we can do this without gas. 

### Key Points About VerifiedX Smart Contracts:
- **Gasless**: No transaction fees required for any operations.
- **Secure**: Designed with top-tier security to prevent contract vulnerabilities.
- **Flexible**: Supports a wide range of use cases, from NFTs to DeFi to identity management.
- **Infinite Potential**: While current use cases are outlined, the flexibility of the system allows for limitless contract creation possibilities.

## Conclusion

The **VerifiedX Smart Contract System** offers a gasless, scalable, and highly flexible environment for building decentralized applications using the **Trillium** language. With support for NFTs, fungible tokens, voting, asset tokenization, and more, VerifiedX enables developers and users to engage in a wide range of decentralized use cases, from digital art to governance and finance.

To explore more technical details and review the smart contract models, visit the [VerifiedX-Core GitHub repository](https://github.com/VerifiedXBlockchain/VerifiedX-Core/tree/testnet/ReserveBlockCore/Models/SmartContracts).
