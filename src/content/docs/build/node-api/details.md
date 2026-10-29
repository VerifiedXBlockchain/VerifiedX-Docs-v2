---
title: "VFX CLI Core API Details"
description: "Reference for every endpoint of the VFX Core API, grouped by namespace, with parameters and return values."
sidebar:
  order: 2
---

This document provides comprehensive documentation for all API endpoints in the VFX Core Kestrel API with Swagger integration.

## Table of Contents

1. [Main API (V1)](#1-main-api-v1) - `/api/V1`
2. [Main API (V2)](#2-main-api-v2) - `/api/V2`  
3. [Bitcoin Integration API](#3-bitcoin-integration-api) - `/btcapi/BTCV2`
4. [Smart Contracts API](#4-smart-contracts-api) - `/scapi/SCV1`
5. [Tokens API V2](#5-tokens-api-v2) - `/tkapi/TKV2`
6. [Transactions API](#6-transactions-api) - `/txapi/TXV1`
7. [DecShop Trading API](#7-decshop-trading-api) - `/dstapi/DSTV1`
8. [Voting API](#8-voting-api) - `/voapi/VOV1`
9. [Beacon API](#9-beacon-api) - `/bcapi/BCV1`
10. [Web Shop API](#10-web-shop-api) - `/wsapi/WebShopV1`
11. [Reserve Accounts API](#11-reserve-accounts-api) - `/rsapi/RSV1`
12. [Adjudicator API](#12-adjudicator-api) - `/adjapi/ADJV1`
13. [Validator Node API](#13-validator-node-api) - `/valapi/Validator`
14. [Integrations API](#14-integrations-api) - `/iapi/IntegrationsV1`
15. [vBTC V2 API (9.0 additions)](#15-vbtc-v2-api-90-additions) - `/vbtcapi/VBTC`
16. [Privacy API: raw shielded VFX (9.0 additions)](#16-privacy-api-raw-shielded-vfx-90-additions) - `/privacyapi/PrivacyV1`

## 1. Main API (V1)
**Base Routes:** `api/V1`, `api/V1/{somePassword?}`  
**Controller:** V1Controller  

### Core System Endpoints

#### GET `/`
**Summary:** Check Status of API  
**Returns:** Array of strings indicating API status  
**Response:** `["VFX-Wallet", "API"]`

#### GET `/{id}`
**Summary:** Execute specific command by ID  
**Parameters:**
- `id` (string, path) - Command identifier  
**Supported Commands:**
- `"getgenesisblock"` - Returns Genesis block in JSON format  
**Returns:** Command result or "Command not recognized"

### Wallet Management Endpoints

#### GET `/UnlockWallet/{password}`
**Summary:** Unlock API using password  
**Parameters:**
- `password` (string, path) - Wallet password  
**Returns:** JSON with success status and message

#### GET `/LockWallet/{password}`
**Summary:** Lock API using password  
**Parameters:**
- `password` (string, path) - Wallet password  
**Returns:** JSON with success status and message

#### GET `/GetCheckEncryptionStatus`
**Summary:** Check wallet encryption status  
**Returns:** JSON indicating encryption state

#### GET `/CheckPasswordNeeded`
**Summary:** Check if password needed for GUI operations  
**Returns:** Boolean indicating password requirement

#### GET `/GetNewAddress`
**Summary:** Generate new wallet address  
**Returns:** JSON containing new address details

#### GET `/GetWalletInfo`
**Summary:** Get comprehensive wallet information  
**Returns:** JSON with balance, address count, and wallet details

#### GET `/GetAllAddresses`
**Summary:** Get all wallet addresses  
**Returns:** Array of address objects with balances

#### GET `/GetValidatorAddresses`
**Summary:** Get validator-eligible addresses  
**Returns:** Array of addresses that can validate

#### GET `/GetAddressInfo/{id}`
**Summary:** Get specific address information  
**Parameters:**
- `id` (string, path) - Wallet address  
**Returns:** Address details including balance and validation status

#### GET `/GetChainBalance/{rbxAddress}`
**Summary:** Get balance from blockchain state  
**Parameters:**
- `rbxAddress` (string, path) - VFX address  
**Returns:** Current balance from chain state

#### GET `/ImportPrivateKey/{id}/{scan?}`
**Summary:** Import private key to wallet  
**Parameters:**
- `id` (string, path) - Private key  
- `scan` (bool?, path, optional) - Scan blockchain for transactions  
**Returns:** Import result status

### Validation Endpoints

#### GET `/IsValidating`
**Summary:** Check if currently validating  
**Returns:** Boolean validation status

#### GET `/TurnOnValidator/{id}`
**Summary:** Enable validator for address  
**Parameters:**
- `id` (string, path) - Validator address  
**Returns:** Activation result

#### GET `/TurnOffValidator/{id}`
**Summary:** Disable validator  
**Parameters:**
- `id` (string, path) - Validator address  
**Returns:** Deactivation result

#### GET `/StartValidating/{addr}/{uname}`
**Summary:** Start validation process  
**Parameters:**
- `addr` (string, path) - Validator address  
- `uname` (string, path) - Username  
**Returns:** Validation start result

### Transaction Endpoints

#### GET `/SendTransaction/{faddr}/{taddr}/{amt}`
**Summary:** Send transaction (deprecated method)  
**Parameters:**
- `faddr` (string, path) - From address  
- `taddr` (string, path) - To address  
- `amt` (decimal, path) - Amount  
**Returns:** Transaction result
**Note:** Deprecated - use V2 API methods

### Utility Endpoints

#### GET `/ValidateAddress/{**address}`
**Summary:** Validate VFX address or ADNR  
**Parameters:**
- `address` (string, path, catch-all) - Address or ADNR to validate  
**Returns:** Validation result with format information

#### GET `/CreateSignature/{message}/{address}`
**Summary:** Create cryptographic signature  
**Parameters:**
- `message` (string, path) - Message to sign  
- `address` (string, path) - Signing address  
**Returns:** Generated signature

#### GET `/ValidateSignature/{message}/{address}/{**sigScript}`
**Summary:** Validate cryptographic signature  
**Parameters:**
- `message` (string, path) - Original message  
- `address` (string, path) - Signing address  
- `sigScript` (string, path, catch-all) - Signature to validate  
**Returns:** Validation result

### Blockchain Query Endpoints

#### GET `/GetMempool`
**Summary:** Get current mempool transactions  
**Returns:** Array of pending transactions

#### GET `/GetBlockByHeight`
**Summary:** Get block by height number  
**Returns:** Block information

#### GET `/GetBlockByHash`
**Summary:** Get block by hash  
**Returns:** Block information

### Network Endpoints

#### GET `/AddPeer/{**ipAddr}`
**Summary:** Add and connect to peer  
**Parameters:**
- `ipAddr` (string, path, catch-all) - IP address and port  
**Returns:** Connection result

#### GET `/getabl`
**Summary:** Get Anti-Black List  
**Returns:** Current anti-blacklist entries

#### GET `/checkaddress/{addr}`
**Summary:** Check if address is blacklisted  
**Parameters:**
- `addr` (string, path) - Address to check  
**Returns:** Blacklist status

## 2. Main API (V2)
**Base Routes:** `api/V2`, `api/V2/{somePassword?}`  
**Controller:** V2Controller  

### System Status

#### GET `/`
**Summary:** Check API V2 status  
**Returns:** Array indicating V2 API status

### Balance Management

#### GET `/GetBalances`
**Summary:** Get VFX and Token balances for all accounts  
**Returns:** Comprehensive balance information for all addresses

#### GET `/GetStateBalance/{address}`
**Summary:** Get balance from chain state for specific address  
**Parameters:**
- `address` (string, path) - VFX address  
**Returns:** Current balance from blockchain state

### ADNR (Address Name Resolution)

#### GET `/ResolveAdnr/{**adnr}`
**Summary:** Resolve ADNR to address  
**Parameters:**
- `adnr` (string, path, catch-all) - ADNR to resolve (supports .vfx, .rbx, .btc)  
**Returns:** Resolved address information

#### GET `/ResolveAddressAdnr/{address}/{asset}`
**Summary:** Get ADNR from address and asset type  
**Parameters:**
- `address` (string, path) - Address to lookup  
- `asset` (string, path) - Asset type  
**Returns:** Associated ADNR

### Validator & Network Information

#### GET `/GetWinningProofs`
**Summary:** Get validator winning proofs  
**Returns:** Current winning proofs from validators

#### GET `/ValidatorPool`
**Summary:** Get network validator pool  
**Returns:** List of active validators

#### GET `/ConsensusHeaderQueue`
**Summary:** Get consensus header queue  
**Returns:** Current consensus queue state

#### GET `/Producers`
**Summary:** Get producer dictionary  
**Returns:** Block producer information

#### GET `/FailedProducers`
**Summary:** Get failed block producers  
**Returns:** Failed producer list

#### GET `/BannedFailedProducers`
**Summary:** Get banned failed producers  
**Returns:** Banned producer information

#### GET `/GetBackupProofs`
**Summary:** Get backup proofs  
**Returns:** Backup validation proofs

#### GET `/GetFinalizedProofs`
**Summary:** Get finalized proofs  
**Returns:** Finalized validation proofs

#### GET `/GetNextValBlock`
**Summary:** Get next validator block  
**Returns:** Next block to be validated

#### GET `/GetNetworkBlockQueue`
**Summary:** Get network block queue  
**Returns:** Current network block queue

#### GET `/GetValLists`
**Summary:** Get validator lists  
**Returns:** Validator list information

#### GET `/GetCasterRounds`
**Summary:** Get caster round information  
**Returns:** Block caster round data

### Image Processing

#### POST `/GetImageUncompressedByte`
**Summary:** Decompress base64 image to byte array  
**Request Body:** Base64 image string  
**Returns:** Decompressed byte array

#### POST `/GetImageUncompressedBase`
**Summary:** Decompress base64 image to string  
**Request Body:** Base64 image string  
**Returns:** Decompressed image string

## 3. Bitcoin Integration API
**Base Routes:** `btcapi/BTCV2`, `btcapi/BTCV2/{somePassword?}`  
**Controller:** BTCV2Controller  

### API Status

#### GET `/`
**Summary:** Check Bitcoin API status  
**Returns:** `["VFX/BTC-Wallet", "BTC API Standard V2"]`

### Address Management

#### GET `/GetDefaultAddressType`
**Summary:** Get default Bitcoin address type  
**Returns:** Current address type configuration

#### GET `/GetNewAddress`
**Summary:** Create new Bitcoin address  
**Returns:** New Bitcoin address details

#### GET `/ImportPrivateKey/{privateKey}/{addressFormat?}`
**Summary:** Import Bitcoin private key  
**Parameters:**
- `privateKey` (string, path) - Bitcoin private key  
- `addressFormat` (string?, path, optional) - Address format preference  
**Returns:** Import result

### Account Management

#### GET `/GetBitcoinAccountList/{omitKeys?}`
**Summary:** Get all Bitcoin accounts  
**Parameters:**
- `omitKeys` (bool?, path, optional) - Omit private keys from response  
**Returns:** List of Bitcoin accounts

#### GET `/GetBitcoinAccount/{address}/{omitKeys?}`
**Summary:** Get specific Bitcoin account  
**Parameters:**
- `address` (string, path) - Bitcoin address  
- `omitKeys` (bool?, path, optional) - Omit private keys  
**Returns:** Account details

#### GET `/ResetAccount`
**Summary:** Reset Bitcoin accounts and UTXOs  
**Returns:** Reset operation result

### UTXO Management

#### GET `/GetAddressUTXOList/{address}`
**Summary:** Get UTXOs for Bitcoin address  
**Parameters:**
- `address` (string, path) - Bitcoin address  
**Returns:** List of unspent transaction outputs

#### GET `/GetAddressTXList/{address}`
**Summary:** Get transaction list for Bitcoin address  
**Parameters:**
- `address` (string, path) - Bitcoin address  
**Returns:** Transaction history

### Bitcoin Transactions

#### GET `/SendTransaction/{faddr}/{taddr}/{amt}/{feeRate}/{overrideInternalSend?}`
**Summary:** Send Bitcoin transaction  
**Parameters:**
- `faddr` (string, path) - From address  
- `taddr` (string, path) - To address  
- `amt` (decimal, path) - Amount in BTC  
- `feeRate` (decimal, path) - Fee rate (sat/vB)  
- `overrideInternalSend` (bool?, path, optional) - Override internal send logic  
**Returns:** Transaction result

#### GET `/CalculateFee/{faddr}/{taddr}/{amt}/{feeRate}`
**Summary:** Calculate Bitcoin transaction fee  
**Parameters:**
- `faddr` (string, path) - From address  
- `taddr` (string, path) - To address  
- `amt` (decimal, path) - Amount  
- `feeRate` (decimal, path) - Fee rate  
**Returns:** Calculated fee amount

### ADNR Management

#### GET `/CreateAdnr/{address}/{btcAddress}/{name}`
**Summary:** Create Bitcoin ADNR  
**Parameters:**
- `address` (string, path) - VFX address  
- `btcAddress` (string, path) - Bitcoin address  
- `name` (string, path) - ADNR name  
**Returns:** ADNR creation result

From the BTC-name signer height (block 7,575,250 on mainnet, block 7,400 on testnet, from Core 9.0.1), the node signs `<unix seconds>:<address>:<name>.btc` with the key of `btcAddress`, which must be in this wallet with the wallet unlocked. The signature is valid for 30 minutes. Pass `name` without `.btc`.

#### GET `/SignAdnrTransferAcceptance/{btcAddress}/{name}/{newOwner}`
**Summary:** Sign, as the receiver, that a `.btc` name may be transferred to one of this wallet's Bitcoin addresses for a VFX owner  
**Parameters:**
- `btcAddress` (string, path) - This wallet's Bitcoin address that will receive the name; its key must be in this wallet and the wallet must be unlocked  
- `name` (string, path) - The name, with or without `.btc`  
- `newOwner` (string, path) - The VFX address that will own the name  
**Returns:** `{"Success": true, "Message": "Signed.", "BTCToMessage": "...", "BTCToSignature": "..."}`. `BTCToMessage` is `<unix seconds>:<newOwner>:<name>.btc`, and `BTCToSignature` is the receiving Bitcoin key's signature of it. Give both to the sender for `TransferAdnr`. The acceptance is valid for 24 hours from its timestamp.

#### GET `/TransferAdnr/{toAddress}/{btcFromAddress}/{btcToAddress}?btcToMessage={message}&btcToSignature={signature}`
**Summary:** Transfer Bitcoin ADNR  
**Parameters:**
- `toAddress` (string, path) - Target VFX address  
- `btcFromAddress` (string, path) - Source Bitcoin address  
- `btcToAddress` (string, path) - Target Bitcoin address  
- `btcToMessage` (string, query, optional) - The receiver's acceptance message, from `SignAdnrTransferAcceptance`  
- `btcToSignature` (string, query, optional) - The receiver's acceptance signature over `btcToMessage`  
**Returns:** Transfer result

From the BTC-name signer height (`BtcNameSignerOwnsAddressHeight`: block 7,575,250 on mainnet, block 7,400 on testnet, from Core 9.0.1), a transfer must carry the receiving Bitcoin address's signed acceptance of the name for the new owner. Before it, the two query parameters are ignored.

- **Same wallet:** when the key for `btcToAddress` is in this wallet, leave both parameters out. The node signs the acceptance itself.
- **Cross-wallet:** the receiver calls `SignAdnrTransferAcceptance` on their own node and sends the sender the message and signature. The sender passes both, URL-encoded, as `btcToMessage` and `btcToSignature`. The SwitchBlade wallet carries the pair as one copyable acceptance code, `<message>|<signature>`.
- The transfer is refused if the acceptance names a different owner or name, is not signed by the key of `btcToAddress`, or is more than 24 hours old.

#### GET `/DeleteAdnr/{btcFromAddress}`
**Summary:** Delete Bitcoin ADNR  
**Parameters:**
- `btcFromAddress` (string, path) - Bitcoin address  
**Returns:** Deletion result

### vBTC (Tokenized Bitcoin)

:::caution[V1 vBTC is retired]
These are the V1 vBTC routes. V1 was retired at block 7,400,500 on mainnet (block 1 on the testnet since its October 2026 restart): the network accepts no new V1 token, transfer or withdrawal, and V1 balances are frozen. vBTC V2 is under [`vbtcapi/VBTC`](#15-vbtc-v2-api-90-additions); see [vBTC](/build/vbtc/integration/).
:::

#### POST `/TokenizeBitcoin`
**Summary:** Create vBTC tokens from Bitcoin  
**Request Body:** Tokenization parameters  
**Returns:** Tokenization result

#### GET `/GetTokenizationDetails/{vfxAddress}`
**Summary:** Get tokenization details for address  
**Parameters:**
- `vfxAddress` (string, path) - VFX address  
**Returns:** Tokenization information

#### GET `/GetvBTCBalance/{address}/{scUID}`
**Summary:** Get vBTC balance for specific smart contract  
**Parameters:**
- `address` (string, path) - VFX address  
- `scUID` (string, path) - Smart contract UID  
**Returns:** vBTC balance

#### GET `/GetAllvBTCBalances/{address}`
**Summary:** Get all vBTC balances for address  
**Parameters:**
- `address` (string, path) - VFX address  
**Returns:** All vBTC balances

#### POST `/TransferCoin`
**Summary:** Transfer vBTC to VFX network  
**Request Body:** Transfer parameters  
**Returns:** Transfer result

#### POST `/WithdrawalCoin`
**Summary:** Withdraw vBTC back to Bitcoin  
**Request Body:** Withdrawal parameters  
**Returns:** Withdrawal result

### Broadcasting

#### GET `/Broadcast/{txHash}`
**Summary:** Broadcast Bitcoin transaction  
**Parameters:**
- `txHash` (string, path) - Transaction hash  
**Returns:** Broadcast result

#### GET `/Rebroadcast/{txid}`
**Summary:** Rebroadcast Bitcoin transaction  
**Parameters:**
- `txid` (string, path) - Transaction ID  
**Returns:** Rebroadcast result

## 4. Smart Contracts API
**Base Routes:** `scapi/SCV1`, `scapi/SCV1/{somePassword?}`  
**Controller:** SCV1Controller  

### API Status

#### GET `/`
**Summary:** Smart Contract API status check  
**Returns:** API status information

#### GET `/{id}`
**Summary:** Get specific smart contract commands  
**Parameters:**
- `id` (string, path) - Command identifier  
**Returns:** Command result

### Testing Endpoints

#### POST `/SCPassTest`
**Summary:** Test JSON payload formatting for smart contracts  
**Request Body:** Test JSON payload  
**Returns:** Formatting test result

#### POST `/SCPassDesTest`
**Summary:** Test JSON deserialization for smart contracts  
**Request Body:** JSON to test deserialization  
**Returns:** Deserialization test result

### Smart Contract Queries

#### GET `/GetCurrentSCOwner/{scUID}`
**Summary:** Get current smart contract owner  
**Parameters:**
- `scUID` (string, path) - Smart contract unique identifier  
**Returns:** Current owner address

#### GET `/GetAllSmartContracts/{pageNumber}`
**Summary:** Get paginated list of all smart contracts  
**Parameters:**
- `pageNumber` (int, path) - Page number for pagination  
**Returns:** Paginated smart contract list

#### GET `/GetAllSmartContracts/{pageNumber}/{**search}`
**Summary:** Get smart contracts with search filter  
**Parameters:**
- `pageNumber` (int, path) - Page number  
- `search` (string, path, catch-all) - Search terms  
**Returns:** Filtered smart contract list

#### GET `/GetAllSmartContracts/{pageNumber}/{excludeToken?}`
**Summary:** Get smart contracts excluding tokens  
**Parameters:**
- `pageNumber` (int, path) - Page number  
- `excludeToken` (bool?, path, optional) - Exclude token contracts  
**Returns:** Filtered smart contract list

#### GET `/GetAllSmartContracts/{pageNumber}/{excludeToken?}/{tokensOnly?}`
**Summary:** Get smart contracts with token filtering  
**Parameters:**
- `pageNumber` (int, path) - Page number  
- `excludeToken` (bool?, path, optional) - Exclude tokens  
- `tokensOnly` (bool?, path, optional) - Only show tokens  
**Returns:** Filtered smart contract list

#### GET `/GetAllSmartContracts/{pageNumber}/{excludeToken?}/{tokensOnly?}/{**search}`
**Summary:** Get smart contracts with comprehensive filtering  
**Parameters:**
- `pageNumber` (int, path) - Page number  
- `excludeToken` (bool?, path, optional) - Exclude tokens  
- `tokensOnly` (bool?, path, optional) - Only tokens  
- `search` (string, path, catch-all) - Search terms  
**Returns:** Comprehensively filtered list

#### GET `/GetMintedSmartContracts/{pageNumber}`
**Summary:** Get paginated minted smart contracts  
**Parameters:**
- `pageNumber` (int, path) - Page number  
**Returns:** Minted smart contracts

#### GET `/GetMintedSmartContracts/{pageNumber}/{**search}`
**Summary:** Get minted smart contracts with search  
**Parameters:**
- `pageNumber` (int, path) - Page number  
- `search` (string, path, catch-all) - Search terms  
**Returns:** Filtered minted contracts

#### GET `/GetSingleSmartContract/{id}`
**Summary:** Get specific smart contract details  
**Parameters:**
- `id` (string, path) - Smart contract identifier  
**Returns:** Complete smart contract information

### NFT Operations

#### GET `/TransferNFT/{id}/{toAddress}`
**Summary:** Transfer NFT to another address  
**Parameters:**
- `id` (string, path) - NFT identifier  
- `toAddress` (string, path) - Destination address  
**Returns:** Transfer result

#### GET `/TransferNFT/{id}/{toAddress}/{**backupURL}`
**Summary:** Transfer NFT with backup URL  
**Parameters:**
- `id` (string, path) - NFT identifier  
- `toAddress` (string, path) - Destination address  
- `backupURL` (string, path, catch-all) - Backup storage URL  
**Returns:** Transfer result

#### GET `/TransferSale/{scUID}/{toAddress}/{saleAmount}`
**Summary:** Transfer NFT with sale amount  
**Parameters:**
- `scUID` (string, path) - Smart contract UID  
- `toAddress` (string, path) - Buyer address  
- `saleAmount` (decimal, path) - Sale price  
**Returns:** Sale transfer result

#### GET `/TransferSale/{scUID}/{toAddress}/{saleAmount}/{**backupURL}`
**Summary:** Transfer NFT sale with backup URL  
**Parameters:**
- `scUID` (string, path) - Smart contract UID  
- `toAddress` (string, path) - Buyer address  
- `saleAmount` (decimal, path) - Sale price  
- `backupURL` (string, path, catch-all) - Backup URL  
**Returns:** Sale transfer result

## 5. Tokens API V2
**Base Routes:** `tkapi/TKV2`, `tkapi/TKV2/{somePassword?}`  
**Controller:** TKV2Controller  

### API Status

#### GET `/`
**Summary:** Check Token API status  
**Returns:** Token API status information

### Token Information

#### GET `/GetTokens/{scUID}/{getAll}`
**Summary:** Get token information for smart contract  
**Parameters:**
- `scUID` (string, path) - Smart contract unique identifier  
- `getAll` (bool, path) - Get all token details  
**Returns:** Token contract information

#### GET `/GetTokensUpdate`
**Summary:** Update token list in memory  
**Returns:** Update operation result

### Token Operations

#### GET `/TransferToken/{scUID}/{fromAddress}/{toAddress}/{amount}`
**Summary:** Transfer tokens between addresses  
**Parameters:**
- `scUID` (string, path) - Smart contract UID  
- `fromAddress` (string, path) - Source address  
- `toAddress` (string, path) - Destination address  
- `amount` (decimal, path) - Token amount  
**Returns:** Transfer transaction result

#### GET `/BurnToken/{scUID}/{fromAddress}/{amount}`
**Summary:** Burn tokens from circulation  
**Parameters:**
- `scUID` (string, path) - Smart contract UID  
- `fromAddress` (string, path) - Address to burn from  
- `amount` (decimal, path) - Amount to burn  
**Returns:** Burn transaction result

#### GET `/TokenMint/{scUID}/{fromAddress}/{amount}`
**Summary:** Mint new tokens  
**Parameters:**
- `scUID` (string, path) - Smart contract UID  
- `fromAddress` (string, path) - Minting address (must be owner)  
- `amount` (decimal, path) - Amount to mint  
**Returns:** Mint transaction result

### Contract Administration

#### GET `/PauseTokenContract/{scUID}/{fromAddress}`
**Summary:** Pause token contract operations  
**Parameters:**
- `scUID` (string, path) - Smart contract UID  
- `fromAddress` (string, path) - Owner address  
**Returns:** Pause operation result

#### GET `/BanAddress/{scUID}/{fromAddress}/{banAddress}`
**Summary:** Ban address from token operations  
**Parameters:**
- `scUID` (string, path) - Smart contract UID  
- `fromAddress` (string, path) - Owner address  
- `banAddress` (string, path) - Address to ban  
**Returns:** Ban operation result

#### GET `/ChangeTokenContractOwnership/{scUID}/{fromAddress}/{toAddress}`
**Summary:** Transfer token contract ownership  
**Parameters:**
- `scUID` (string, path) - Smart contract UID  
- `fromAddress` (string, path) - Current owner  
- `toAddress` (string, path) - New owner  
**Returns:** Ownership transfer result

## 6. Transactions API
**Base Routes:** `txapi/TXV1`, `txapi/TXV1/{somePassword?}`  
**Controller:** TXV1Controller  

### Utility Functions

#### GET `/GetTimestamp`
**Summary:** Get current Unix timestamp  
**Returns:** Current timestamp value

### Local Transaction Queries

#### GET `/GetSuccessfulLocalTX`
**Summary:** Get successful local transactions  
**Returns:** List of completed local transactions

#### GET `/GetReserveLocalTX`
**Summary:** Get reserve account transactions  
**Returns:** Reserve account transaction history

#### GET `/GetMinedLocalTX`
**Summary:** Get mined reward transactions  
**Returns:** Mining reward transaction list

## 7. DecShop Trading API
**Base Routes:** `dstapi/DSTV1`, `dstapi/DSTV1/{somePassword?}`  
**Controller:** DSTV1Controller  

### API Status

#### GET `/`
**Summary:** Check DecShop API status  
**Returns:** API status information

### Collection Management

#### POST `/SaveCollection`
**Summary:** Save or update NFT collection  
**Request Body:** Collection data object  
**Returns:** Save operation result

#### GET `/GetCollection/{collectionId}`
**Summary:** Get collection information  
**Parameters:**
- `collectionId` (string, path) - Collection identifier  
**Returns:** Collection details

#### GET `/GetAllCollections`
**Summary:** Get all collections  
**Returns:** List of all NFT collections

#### GET `/DeleteCollection/{collectionId}`
**Summary:** Delete collection  
**Parameters:**
- `collectionId` (string, path) - Collection to delete  
**Returns:** Deletion result

### Listing Management

#### POST `/SaveListing`
**Summary:** Create or update NFT listing  
**Request Body:** Listing data object  
**Returns:** Listing save result

#### GET `/GetCollectionListings/{collectionId}`
**Summary:** Get listings for collection  
**Parameters:**
- `collectionId` (string, path) - Collection identifier  
**Returns:** Collection's active listings

#### GET `/GetListing/{listingId}`
**Summary:** Get specific listing details  
**Parameters:**
- `listingId` (string, path) - Listing identifier  
**Returns:** Complete listing information

### DecShop Connectivity

#### GET `/ConnectToDecShop/{address}/{**url}`
**Summary:** Connect to DecShop instance  
**Parameters:**
- `address` (string, path) - Shop owner address  
- `url` (string, path, catch-all) - DecShop URL  
**Returns:** Connection result

#### GET `/GetShopListings/{page}`
**Summary:** Get shop listings with pagination  
**Parameters:**
- `page` (int, path) - Page number  
**Returns:** Paginated shop listings

#### GET `/PingShop/{pingId}`
**Summary:** Check shop connection status  
**Parameters:**
- `pingId` (string, path) - Ping identifier  
**Returns:** Connection status

### Trading Operations

#### POST `/SendBid`
**Summary:** Send bid on listing  
**Request Body:** Bid details object  
**Returns:** Bid submission result

#### POST `/SendBuyNowBid`
**Summary:** Send buy now bid  
**Request Body:** Buy now bid details  
**Returns:** Purchase result

#### POST `/SendChatMessage`
**Summary:** Send chat message to listing  
**Request Body:** Chat message object  
**Returns:** Message send result

#### GET `/GetBids/{sendReceive}`
**Summary:** Get bid information  
**Parameters:**
- `sendReceive` (string, path) - Filter: "sent" or "received"  
**Returns:** Bid list based on filter

### Purchase Completion

#### GET `/CompleteNFTPurchase/{keySign}/{**scUID}`
**Summary:** Complete NFT purchase transaction  
**Parameters:**
- `keySign` (string, path) - Transaction signature  
- `scUID` (string, path, catch-all) - Smart contract UID  
**Returns:** Purchase completion result

## 8. Voting API
**Base Routes:** `voapi/VOV1`, `voapi/VOV1/{somePassword?}`  
**Controller:** VOV1Controller  

### Topic Queries

#### GET `/GetAllTopics`
**Summary:** Get all voting topics  
**Returns:** Complete list of vote topics

#### GET `/GetActiveTopics`
**Summary:** Get currently active voting topics  
**Returns:** Active voting topics

#### GET `/GetInactiveTopics`
**Summary:** Get inactive/closed voting topics  
**Returns:** Closed voting topics

#### GET `/GetTopicDetails/{topicUID}`
**Summary:** Get detailed topic information  
**Parameters:**
- `topicUID` (string, path) - Topic unique identifier  
**Returns:** Complete topic details

#### GET `/GetMyTopics`
**Summary:** Get topics you created  
**Returns:** Topics created by current user

#### GET `/GetMyVotes`
**Summary:** Get votes you have cast  
**Returns:** Your voting history

#### GET `/GetTopicVotes/{topicUID}`
**Summary:** Get all votes for specific topic  
**Parameters:**
- `topicUID` (string, path) - Topic identifier  
**Returns:** Topic vote results

#### GET `/GetSearchTopics/{**search}`
**Summary:** Search topics by keywords  
**Parameters:**
- `search` (string, path, catch-all) - Search terms  
**Returns:** Matching topics

### Voting Operations

#### GET `/CastTopicVote/{topicUID}/{voteType}`
**Summary:** Cast vote on topic  
**Parameters:**
- `topicUID` (string, path) - Topic identifier  
- `voteType` (string, path) - Vote choice  
**Returns:** Vote casting result

#### POST `/PostNewTopic`
**Summary:** Create new voting topic  
**Request Body:** Topic creation data  
**Returns:** Topic creation result

## 9. Beacon API
**Base Routes:** `bcapi/BCV1`, `bcapi/BCV1/{somePassword?}`  
**Controller:** BCV1Controller  

### Beacon Management

#### GET `/CreateBeacon/{name}/{isPrivate}/{autoDelete}/{fileCachePeriod}/{port}`
**Summary:** Create new beacon for asset relay  
**Parameters:**
- `name` (string, path) - Beacon name  
- `isPrivate` (bool, path) - Private beacon flag  
- `autoDelete` (bool, path) - Auto-delete when idle  
- `fileCachePeriod` (int, path) - Cache period in minutes  
- `port` (int, path) - Beacon port (0 for auto)  
**Returns:** Beacon creation result

#### GET `/GetBeacons`
**Summary:** Get list of local beacons  
**Returns:** Local beacon information

#### GET `/AddBeacon/{name}/{port}/{**ip}`
**Summary:** Add external beacon to network  
**Parameters:**
- `name` (string, path) - Beacon name  
- `port` (int, path) - Beacon port  
- `ip` (string, path, catch-all) - IP address  
**Returns:** Beacon addition result

#### GET `/DeleteBeacon/{id}`
**Summary:** Delete beacon by ID  
**Parameters:**
- `id` (string, path) - Beacon identifier  
**Returns:** Deletion result

#### GET `/SetBeaconState`
**Summary:** Toggle beacon active/inactive state  
**Returns:** State change result

### Beacon Operations

#### GET `/DecodeBeaconLocator/{**locator}`
**Summary:** Decode beacon locator string  
**Parameters:**
- `locator` (string, path, catch-all) - Beacon locator  
**Returns:** Decoded beacon information

#### GET `/GetBeaconAssets/{scUID}/{locators}/{address}/{**signature}`
**Summary:** Get assets from beacon network  
**Parameters:**
- `scUID` (string, path) - Smart contract UID  
- `locators` (string, path) - Asset locators  
- `address` (string, path) - Requester address  
- `signature` (string, path, catch-all) - Request signature  
**Returns:** Asset data from beacons

#### GET `/GetAssetQueue`
**Summary:** Get beacon asset processing queue  
**Returns:** Current asset queue status

## 10. Web Shop API
**Base Routes:** `wsapi/WebShopV1`, `wsapi/WebShopV1/{somePassword?}`  
**Controller:** WebShopV1Controller  

### API Status

#### GET `/`
**Summary:** Check Web Shop API status  
**Returns:** API status information

### Multi-Shop Management

#### GET `/ConnectToDecShop/{address}/{**url}`
**Summary:** Connect to DecShop (multi-shop version)  
**Parameters:**
- `address` (string, path) - Shop owner address  
- `url` (string, path, catch-all) - DecShop URL  
**Returns:** Connection result

#### GET `/PingShop/{pingId}/{**url}`
**Summary:** Ping specific shop connection  
**Parameters:**
- `pingId` (string, path) - Ping identifier  
- `url` (string, path, catch-all) - Shop URL  
**Returns:** Ping result

#### GET `/GetDecShopData`
**Summary:** Get shop data stored in memory  
**Returns:** Cached shop data

#### GET `/GetConnections`
**Summary:** Get list of connected shops  
**Returns:** Connected shop information

### Shop Operations

#### GET `/GetShopSpecificAuction/{listingId}/{address}/{**shopURL}`
**Summary:** Get specific auction from shop  
**Parameters:**
- `listingId` (string, path) - Listing identifier  
- `address` (string, path) - Shop address  
- `shopURL` (string, path, catch-all) - Shop URL  
**Returns:** Auction details

#### POST `/SendBid/{address}/{**shopURL}`
**Summary:** Send bid to specific shop  
**Parameters:**
- `address` (string, path) - Shop address  
- `shopURL` (string, path, catch-all) - Shop URL  
**Request Body:** Bid data  
**Returns:** Bid submission result

#### POST `/SendChatMessage/{address}/{**shopURL}`
**Summary:** Send chat message to shop  
**Parameters:**
- `address` (string, path) - Shop address  
- `shopURL` (string, path, catch-all) - Shop URL  
**Request Body:** Chat message  
**Returns:** Message send result

#### GET `/Debug`
**Summary:** Get debug information for Web Shop API  
**Returns:** Debug data

## 11. Reserve Accounts API
**Base Routes:** `rsapi/RSV1`, `rsapi/RSV1/{somePassword?}`  
**Controller:** RSV1Controller  

### Reserve Account Management

#### GET `/GetAllReserveAccounts`
**Summary:** Get all reserve accounts in system  
**Returns:** List of all reserve accounts

#### GET `/GetReserveAccountInfo/{address}`
**Summary:** Get specific reserve account information  
**Parameters:**
- `address` (string, path) - Reserve account address  
**Returns:** Reserve account details

#### GET `/GetReserveAccountNFTAssets/{scUID}/{address}/{**password}`
**Summary:** Get NFT assets for reserve account  
**Parameters:**
- `scUID` (string, path) - Smart contract UID  
- `address` (string, path) - Reserve account address  
- `password` (string, path, catch-all) - Access password  
**Returns:** NFT asset information

## 12. Adjudicator API
**Base Routes:** `adjapi/ADJV1`, `adjapi/ADJV1/{somePassword?}`  
**Controller:** ADJV1Controller  

### API Status

#### GET `/`
**Summary:** Check Adjudicator API status  
**Returns:** API status information

### Network State Information

#### GET `/GetDups`
**Summary:** Get duplicates dictionary  
**Returns:** Network duplicate information

#### GET `/GetConsensusBroadcastTx`
**Summary:** Get consensus broadcast transactions  
**Returns:** Consensus transaction data

#### GET `/GetFortisBroadcastTx`
**Summary:** Get Fortis pool broadcast transactions  
**Returns:** Fortis pool transaction data

#### GET `/GetMasternodes`
**Summary:** Get masternode list  
**Returns:** Current masternode information

#### GET `/GetMasternodesSent`
**Summary:** Get sent masternodes  
**Returns:** Sent masternode data

#### GET `/GetTaskAnswersList`
**Summary:** Get task answers list  
**Returns:** Network task answers

#### GET `/GetAdjInfo`
**Summary:** Get adjudicator information  
**Returns:** Adjudicator state data

#### GET `/GetConsensusInfo`
**Summary:** Get detailed consensus information  
**Returns:** Comprehensive consensus data

## 13. Validator Node API
**Base Route:** `valapi/Validator`  
**Controller:** ValidatorController  

### Basic Status

#### GET `/`
**Summary:** Simple validator API greeting  
**Returns:** "Hello from Validator API"

### Validator Operations

#### POST `/Status`
**Summary:** Submit validator status update  
**Request Body:** Validator status data  
**Returns:** Status submission result

#### POST `/ReceiveWinningProof`
**Summary:** Submit winning proof to network  
**Request Body:** Winning proof data  
**Returns:** Proof submission result

#### GET `/SendWinningProof/{blockHeight}`
**Summary:** Get winning proof for block height  
**Parameters:**
- `blockHeight` (int, path) - Block height number  
**Returns:** Winning proof data

#### GET `/GetCasterVote`
**Summary:** Get current caster vote  
**Returns:** Current caster vote information

### Block Operations

#### GET `/GetBlock/{blockHeight}`
**Summary:** Get block by height for validation  
**Parameters:**
- `blockHeight` (int, path) - Block height  
**Returns:** Block data for validation

#### GET `/GetApproval/{blockHeight}`
**Summary:** Get block approval status  
**Parameters:**
- `blockHeight` (int, path) - Block height  
**Returns:** Approval information

#### GET `/SendApproval/{blockHeight}/{validatorAddress}`
**Summary:** Send block approval  
**Parameters:**
- `blockHeight` (int, path) - Block height  
- `validatorAddress` (string, path) - Validator address  
**Returns:** Approval submission result

### Network Health

#### GET `/HeartBeat/{address}`
**Summary:** Validator heartbeat with address  
**Parameters:**
- `address` (string, path) - Validator address  
**Returns:** Heartbeat acknowledgment

#### GET `/HeartBeat`
**Summary:** Simple validator heartbeat  
**Returns:** Heartbeat response

### Consensus Operations

#### GET `/SendSeedPart`
**Summary:** Get seed part for consensus  
**Returns:** Consensus seed part

#### GET `/VerifyBlock/{nextBlock}/{**proofHash}`
**Summary:** Verify block with proof  
**Parameters:**
- `nextBlock` (int, path) - Next block number  
- `proofHash` (string, path, catch-all) - Proof hash  
**Returns:** Block verification result

### Network Information

#### GET `/Blockcasters`
**Summary:** Get blockcaster list  
**Returns:** Current blockcaster information

#### GET `/ValidatorInfo`
**Summary:** Get comprehensive validator information  
**Returns:** Validator network data

#### GET `/ClearAttestationGuard`
**Summary:** Localhost only. Forgets which block this caster signed at each height. The node keeps those claims on disk so a restart doesn't release them; this is the deliberate way to release a height that can never be certified with the block this node signed. Called from any other address it returns `401`  
**Returns:** `{"Success": true, "ClaimsRemoved": 3}`

## 14. Integrations API
**Base Route:** `iapi/IntegrationsV1`  
**Controller:** IntegrationsV1Controller  

### Network Information

#### GET `/Network`
**Summary:** Get comprehensive network information  
**Returns:** Complete network status and statistics

#### GET `/Height`
**Summary:** Get current blockchain height  
**Returns:** Current block height number

#### GET `/LastBlock`
**Summary:** Get last block information  
**Returns:** Most recent block data

## 15. vBTC V2 API (9.0 additions)
**Base Routes:** `vbtcapi/VBTC`, `vbtcapi/VBTC/{somePassword?}`  
**Controller:** VBTCController  

This section covers the routes Core 9.0 adds to the vBTC V2 API: withdrawals from vaults the chain watches, the Bitcoin attestation reads, and the validator bond. The whole vault lifecycle (creation, deposits, transfers, ownership, withdrawals including the multi-vault withdrawal, legacy vaults and S3C) is documented with examples on the [vBTC](/build/vbtc/integration/) page, and the external-signer flow on [vBTC Raw Integration](/build/vbtc/raw-integration/).

**Watched and legacy vaults.** From the Bitcoin attestation recording height (`BitcoinAttestationRecordHeight`; block 7,568,350 on mainnet; block 400 on testnet since its October 2026 restart), a newly created vault is *watched*: its deposits and withdrawals are recorded on chain from Bitcoin reports, and the owner's balance is its attested coins. A watched vault's withdrawal has no completion transaction and no cancellation vote. After the request is mined, the chain fixes ("pins") the Bitcoin transaction that pays it, and the withdrawal completes when Bitcoin confirms it. Until it is pinned, the requester can cancel it, and the cancel takes effect when mined. If it does not confirm, the requester can raise its fee (bump) or give it up (release), both as a `VBTC_V2_COIN_PIN` (type 44) transaction. Vaults created before that height are *legacy*. They keep the earlier request, complete and cancel flow until the enforcement height (`BitcoinAttestationHeight`; block 401 on testnet, set at the 9.0 release on mainnet, about two weeks after the recording height). From then on they are frozen, and withdrawal completion (type 28), the cancellation vote (type 30), bridge exit completion (type 41) and bridge exit failure (type 42) are refused for every vault. `GetVaultBitcoin` tells you which kind a vault is.

### Withdrawal Flows

Check the vault's kind first with `GET vbtcapi/VBTC/GetVaultBitcoin/{scUID}` (`Vault.Attested`, `Vault.Legacy`, `Vault.Frozen`). Both kinds start the same way: `POST vbtcapi/VBTC/RequestWithdrawal` when this node holds the requester's key, or `POST vbtcapi/VBTC/GetRawRequestWithdrawalTxData` then `POST vbtcapi/VBTC/SendRawRequestWithdrawalTx` for an external key.

**Watched vault** (created from the recording height):
1. Request the withdrawal. The vBTC is debited when the request is mined.
2. While no Bitcoin transaction is pinned for it (`Withdrawal.State` is `Waiting` and `Withdrawal.CanCancel` is `true` in `GetWithdrawalPin`), the requester can cancel it with an ordinary `VBTC_V2_WITHDRAWAL_CANCEL` (type 29): `POST vbtcapi/VBTC/CancelWithdrawal` when this node holds the requester's key, `POST vbtcapi/VBTC/GetRawCancelWithdrawalTxData` then `POST vbtcapi/VBTC/SendRawCancelWithdrawalTx` for an external key, or `POST wallet/api/vbtc/withdraw/cancel` in the built-in wallet. Only the requester can cancel. There is no validator vote (a type-30 vote is refused on a watched vault). The withdrawal closes as cancelled in the block that mines the cancel, and the escrowed vBTC is refunded. Once a Bitcoin transaction is pinned, a cancel is refused, and only a bump or a release (step 5) is left. A bridge exit's part can't be cancelled this way.
3. The chain pins the Bitcoin transaction that pays it, and the vault's signers sign it. Follow it with `GET vbtcapi/VBTC/GetWithdrawalPin/{scUID}/{withdrawalRequestHash}` (the built-in wallet: `GET wallet/api/vbtc/withdraw/pin/{scUID}/{requestHash}`). There is no completion transaction to send, and `POST vbtcapi/VBTC/CompleteWithdrawal` returns the pin's state instead of signing.
4. Bitcoin confirms the payment and the withdrawal is complete.
5. If the payment isn't confirming, either bump it (a type-44 transaction; the higher fee comes out of the withdrawal) or release it (also type 44): the coins go back to the vault and the vBTC is refunded, less the release's Bitcoin fee. A pinned withdrawal can't be cancelled.

   | | Bump | Release |
   | --- | --- | --- |
   | Node holds the requester's key | `POST vbtcapi/VBTC/BumpWithdrawalFee` | `POST vbtcapi/VBTC/ReleaseWithdrawal` |
   | External key (build, sign `Hash`, send) | `POST vbtcapi/VBTC/GetRawBumpWithdrawalFeeTxData` then `POST vbtcapi/VBTC/SendRawBumpWithdrawalFeeTx` | `POST vbtcapi/VBTC/GetRawReleaseWithdrawalTxData` then `POST vbtcapi/VBTC/SendRawReleaseWithdrawalTx` |
   | Built-in browser wallet (node's account) | `POST wallet/api/vbtc/withdraw/bumpfee` | `POST wallet/api/vbtc/withdraw/release` |

A request still waiting for coins can run out, and its vBTC is then refunded as for a cancel. Once its Bitcoin transaction is pinned, it can't run out.

**Legacy vault** (created before the recording height), until the enforcement height:
1. Request the withdrawal.
2. Complete it with `POST vbtcapi/VBTC/CompleteWithdrawal` (or `POST vbtcapi/VBTC/GetRawCompleteWithdrawalTxData` then `POST vbtcapi/VBTC/SendRawCompleteWithdrawalTx`), which signs and broadcasts the Bitcoin transaction and records the completion (type 28).
3. To cancel, send `POST vbtcapi/VBTC/CancelWithdrawal` (type 29); validators vote on it (type 30).

From the enforcement height a legacy vault is frozen: nothing debits its balance, and withdrawal completion (type 28), the cancellation vote (type 30), bridge exit completion (type 41) and bridge exit failure (type 42) are refused for every vault.

### Bitcoin Attestation

#### GET `/GetBitcoinAttestationStatus`
**Summary:** The attestation layer as this node's chain state holds it: the three heights, the Bitcoin tip the chain has attested, how far vault events are recorded, the signer set, and the confirmations a Bitcoin block needs before it is reported  
**Returns:** `{"Success": true, "Attestation": {...}}`

#### GET `/GetVaultBitcoin/{scUID}`
**Summary:** A vault's Bitcoin as consensus holds it: the deposit script, every unspent coin and what holds it, the totals the owner's balance is computed from, and the withdrawals still open  
**Parameters:**
- `scUID` (string, path) - The vault's smart contract UID  
**Returns:** `Vault` (the kind: `Attested`, `Legacy`, `FreezeHeight`, `Frozen`) and `Bitcoin`. For a vault the chain does not watch, `Success` is `false`, `Bitcoin` is `null` and `Message` gives the reason; `Vault` is still filled in

#### GET `/GetBridgeExit/{baseBurnTxHash}`
**Summary:** The bridge exit the chain holds for a Base burn: waiting, pinned, complete or failed, and for an exit on watched vaults each vault's part with its Bitcoin transaction  
**Parameters:**
- `baseBurnTxHash` (string, path) - The Base burn transaction hash  
**Returns:** `{"Success": true, "Exit": {...}}`, or `Success: false` when no exit is recorded for the burn

### Withdrawals from Watched Vaults

#### GET `/GetWithdrawalPin/{scUID}/{withdrawalRequestHash}`
**Summary:** Where a withdrawal from a watched vault stands: waiting for coins, its Bitcoin transaction pinned (with every transaction pinned for it, their fees and the unsigned bytes), paid, or closed and refunded. Answered from chain state, so any node gives the same answer  
**Parameters:**
- `scUID` (string, path) - The vault's smart contract UID  
- `withdrawalRequestHash` (string, path) - The hash of the withdrawal request transaction  
**Returns:** `{"Success": true, "Attested": true, "Withdrawal": {...}}`. For a vault the chain does not watch, `Success` is `false`, `Attested` is `false`, `Vault` gives its kind, and the withdrawal is completed with `CompleteWithdrawal` instead. On a watched vault whose request isn't mined yet (or isn't on that vault), `Success` is `false`, `Attested` is `true` and `Withdrawal` is `null`. Try again once the request is mined.

#### POST `/BumpWithdrawalFee`
**Summary:** Raise the Bitcoin fee of a pinned withdrawal that is not confirming, signed by the requester's account on this node. The chain pins a replacement that spends the same coins; the higher fee comes out of the withdrawal's own amount  
**Request Body:**
```json
{
  "SmartContractUID": "...",
  "RequestorAddress": "...", // the address that requested the withdrawal; it signs
  "WithdrawalRequestHash": "...",
  "FeeRate": 12 // sat/vB, above the rate the withdrawal's newest Bitcoin transaction pays
}
```
**Returns:** `{"Success": true, "FeeBumpTxHash": "...", "Release": false, ...}`. Follow it with `GetWithdrawalPin`.

#### POST `/ReleaseWithdrawal`
**Summary:** Give up a pinned withdrawal that is not confirming, signed by the requester's account on this node. The chain pins a Bitcoin transaction that returns the coins to the vault; when Bitcoin shows it, the withdrawal is closed and the vBTC refunded, less that transaction's Bitcoin fee, and the requester can withdraw again. If a payment of the withdrawal confirms first, it is paid as usual  
**Request Body:** Same as `BumpWithdrawalFee`; `FeeRate` must be above the rate the withdrawal's newest transaction pays  
**Returns:** `{"Success": true, "FeeBumpTxHash": "...", "Release": true, ...}`

#### POST `/GetRawBumpWithdrawalFeeTxData`
#### POST `/GetRawReleaseWithdrawalTxData`
**Summary:** Build the unsigned type-44 fee bump or release for a requester whose key this node does not hold. The node checks it against the same rule block validation applies before returning it  
**Request Body:** Same as `BumpWithdrawalFee`  
**Returns:** The unsigned transaction (`Hash`, `Timestamp`, `FromAddress`, `ToAddress`, `Amount`, `Fee`, `Nonce`, `TransactionType`, `TransactionTypeId`, `Data`). Sign `Hash` and submit it with the matching send route.

#### POST `/SendRawBumpWithdrawalFeeTx`
#### POST `/SendRawReleaseWithdrawalTx`
**Summary:** Submit a signed type-44 transaction built by the matching `GetRaw...TxData` route. Each send route accepts only what its own build route made, so a fee bump can't be sent as a release by mistake  
**Request Body:**
```json
{
  "Hash": "...", // the Hash the build route returned
  "Signature": "...", // the requester's signature over Hash
  "PublicKey": "..." // the requester's public key (required)
}
```
**Returns:** `{"Success": true, "Hash": "...", "Message": "..."}`

The node's built-in browser wallet has the same three operations at `GET /wallet/api/vbtc/withdraw/pin/{scUID}/{requestHash}`, `POST /wallet/api/vbtc/withdraw/bumpfee` and `POST /wallet/api/vbtc/withdraw/release`, signed by the node's account. The bump and release body is camel-case, and `feeRate` is a string; a JSON number is rejected with `400`:

```json
{
  "scUID": "...",
  "ownerAddress": "...", // the requester
  "requestHash": "...",
  "feeRate": "12"
}
```

### Validator Bond

#### GET `/GetValidatorBond/{address}`
**Summary:** The validator bond of any address: whether its stake is locked, how much it can send, when it unlocks after an exit, and from which block it counts for a vault's key ceremony  
**Parameters:**
- `address` (string, path) - VFX address  
**Returns:** `Bond` with `RuleActive`, `RuleStartsAtHeight`, `Bonded`, `BondedAmount`, `Balance`, `Spendable`, `BondedAtHeight`, `ExitHeight`, `UnlocksAtHeight`, `ExitWaitBlocks`, `StakeLockedSinceHeight`, `CountsForKeyCeremoniesFromHeight`, `CountsForKeyCeremoniesNow`, `CountsForReportSignersFromHeight`, `Note`

#### POST `/ExitValidator/{address}`
**Summary:** Send the validator exit transaction for an address this wallet holds. The validator stops counting on chain at once, and its bonded 5,000 VFX unlocks 1,200 blocks after the exit is mined. Works for a validator that is no longer running too. If this node is validating with that address, it also stops validating. Refused before the validator bond height (`ValidatorBondHeight`), when no stake is locked  
**Parameters:**
- `address` (string, path) - The validator's VFX address  
**Returns:** `{"Success": true, "ExitTxHash": "...", "Bond": {...}}`

See [Run a Validator](/node/validator/#10-stopping-and-updating) for the full exit.

## 16. Privacy API: raw shielded VFX (9.0 additions)
**Base Routes:** `privacyapi/PrivacyV1`, `privacyapi/PrivacyV1/{somePassword?}`  
**Controller:** PrivacyV1Controller  

For wallets that hold their own keys and keep no shielded wallet on this node, such as a web wallet. The node reads the pool, finds the caller's notes and runs the prover; the caller signs (shield only) and submits. The rest of the privacy controller is not documented here yet.

- **Shield (T→Z):** `GetRawShieldTxData` → sign `Hash` with the transparent key → `SendRawPrivateTx` with `Hash` and `Signature`.
- **Unshield (Z→T) and private transfer (Z→Z):** `GetRawUnshieldTxData` or `GetRawPrivateTransferTxData` with the `zfx_` address and its viewing key → `SendRawPrivateTx` with `Hash` only. These are authorised by the zero-knowledge proof, not a signature.

:::caution
In this scheme the viewing key is spend authority. Send it only to a node you trust, over TLS.
:::

A built transaction waits on the node for 30 minutes (`ExpiresUtc`). A spend also goes stale when the pool's Merkle root moves, so submit promptly and rebuild on "merkle_root does not match".

Responses are `{"Success": true, "Result": {...}}` or `{"Success": false, "Message": "..."}`.

#### POST `/GetRawShieldTxData`
**Summary:** An unsigned, proven shield for a `FromAddress` this node does not hold  
**Request Body:**
```json
{
  "FromAddress": "...",
  "RecipientZfxAddress": "zfx_...",
  "ShieldAmount": 10.0,
  "TransparentFee": null, // optional; the node calculates it when omitted
  "Memo": null // optional
}
```
**Returns:** `Result` with `Hash`, `Transaction`, `Fee`, `RequiresSignature` (`true`), `MerkleRoot`, `ExpiresUtc`

#### POST `/GetShieldedNotesRaw`
**Summary:** Stateless scan: the VFX notes a viewing key can open, with position, spent, pending and spendable state, and randomness. Needs no wallet on this node  
**Request Body:**
```json
{
  "ZfxAddress": "zfx_...",
  "ViewingKey": "...", // 32 bytes, Base64 or 64 hex characters
  "FromHeight": null, // optional; default the proof-rules height once active, else 0
  "ToHeight": null, // optional; default the chain tip
  "IncludeSpent": false
}
```
**Returns:** `Result` with `Notes` (`Commitment`, `Amount`, `TreePosition`, `BlockHeight`, `Spent`, `PendingSpend`, `Spendable`, ...), `UnspentBalance`, `SpendableBalance`, `ProofRulesActive`

#### POST `/GetRawUnshieldTxData`
**Summary:** A complete, proven unshield from the caller's notes. No signature needed  
**Request Body:**
```json
{
  "ZfxAddress": "zfx_...",
  "ViewingKey": "...",
  "TransparentToAddress": "...",
  "TransparentAmount": 5.0,
  "InputCommitments": null // optional: spend exactly these 1 or 2 notes; the node selects when omitted
}
```
**Returns:** `Result` with `Hash`, `Transaction`, `Fee`, `SpentCommitments`, `ChangeAmount`, `MerkleRoot`, `ExpiresUtc`

#### POST `/GetRawPrivateTransferTxData`
**Summary:** A complete, proven private transfer to another `zfx_` address, or to your own to consolidate. No signature needed  
**Request Body:** `ZfxAddress`, `ViewingKey`, `RecipientZfxAddress`, `PaymentAmount`, `InputCommitments` (optional)  
**Returns:** As `GetRawUnshieldTxData`

#### POST `/VerifyRawPrivateTx`
**Summary:** Dry run: the node's full verifier on a built transaction, with the signature for a shield. Nothing is broadcast  
**Request Body:** `{"Hash": "...", "Signature": "..."}` (`Signature` for a shield only)  
**Returns:** `Result` with `Hash` and `"Transaction verifies."`, or the reason it doesn't

#### POST `/SendRawPrivateTx`
**Summary:** Submit a built transaction: a shield with `Hash` and `Signature`, an unshield or transfer with `Hash` only  
**Request Body:** `{"Hash": "...", "Signature": "..."}`  
**Returns:** `Result` with `Hash` and `Message`

## Common Response Patterns

### Success Response Format
```json
{
  "Success": true,
  "Message": "Operation completed successfully",
  "Data": { /* Response data */ }
}
```

### Error Response Format  
```json
{
  "Success": false,
  "Message": "Error description",
  "Data": null
}
```

### Authentication
All APIs support optional password authentication through the `{somePassword?}` route parameter.

### Parameter Types
- **Path Parameters**: Required values in URL path
- **Query Parameters**: Optional values as URL query string  
- **Request Body**: JSON payload for POST requests
- **Catch-all Parameters** (`{**param}`): Capture entire path segments

### HTTP Status Codes
- **200 OK**: Success
- **400 Bad Request**: Invalid parameters
- **401 Unauthorized**: Authentication required
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

This comprehensive documentation covers all 14 API controllers with detailed endpoint information for integration with Swagger and API consumers.
