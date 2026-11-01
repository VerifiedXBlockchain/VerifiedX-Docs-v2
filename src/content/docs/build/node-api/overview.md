---
title: "VFX CLI Core API Overview"
description: "Overview of the namespaces of the VFX Core API and what each one is for."
sidebar:
  order: 1
---

This document provides an overview of the different API namespaces and their purposes within the VFX Core Kestrel API.

## Core API Namespaces

### 1. **Main API** (`api/`)
- **Base Routes**: `api/v1`, `api/v2`
- **Controllers**: V1Controller, V2Controller
- **Purpose**: Core blockchain functionality, wallet operations, balance management, and general system operations
- **Key Features**:
  - Blockchain status and information
  - Balance queries and state management
  - Genesis block operations
  - Validator pool management
  - Network consensus operations

### 2. **Beacon API** (`bcapi/`)
- **Base Route**: `bcapi/bcv1`
- **Controller**: BCV1Controller
- **Purpose**: Beacon network functionality for asset relay and distributed storage
- **Key Features**:
  - Beacon creation and management
  - Asset relay operations
  - Network beacon discovery
  - File caching and distribution

### 3. **Bitcoin Integration API** (`btcapi/`)
- **Base Route**: `btcapi/btcv2`
- **Controller**: BTCV2Controller
- **Purpose**: Bitcoin blockchain integration and cross-chain operations
- **Key Features**:
  - Bitcoin address management
  - Transaction creation and broadcasting
  - UTXO management
  - BTC domain names (`.btc` ADNR)
  - Wallet Bitcoin data through Electrum servers (consensus verifies vault Bitcoin on its own; see [Bitcoin Integration](/learn/bitcoin-integration/))

### 4. **Smart Contract API** (`scapi/`)
- **Base Route**: `scapi/scv1`
- **Controller**: SCV1Controller
- **Purpose**: Smart contract deployment, management, and interaction
- **Key Features**:
  - Smart contract deployment
  - NFT operations and transfers
  - Contract state management
  - Asset minting and burning
  - Contract search and discovery

### 5. **Token API** (`tkapi/`)
- **Base Route**: `tkapi/tkv2`
- **Controller**: TKV2Controller
- **Purpose**: Token contract management and operations
- **Key Features**:
  - Token transfers and balance management
  - Token minting and burning
  - Contract ownership management
  - Address banning and pausing functionality
  - Token contract administration

### 6. **Transaction API** (`txapi/`)
- **Base Route**: `txapi/txv1`
- **Controller**: TXV1Controller
- **Purpose**: Transaction creation, validation, and management
- **Key Features**:
  - Transaction construction
  - Fee calculation
  - Transaction broadcasting
  - Mempool operations
  - Transaction history and queries

### 7. **Validator API** (`valapi/`)
- **Base Route**: `valapi/validator`
- **Controller**: ValidatorController
- **Purpose**: Validator-to-validator consensus calls. This controller is not served on the wallet API port: it runs on the validator host (`ValAPIPort`, 7294 on mainnet, 17294 on testnet) and does not use the `ActionFilterController` filter
- **Key Features**:
  - Validator status and heartbeat
  - Block validation and approval
  - Consensus proof management
  - Validator network coordination
  - Block casting operations

### 8. **Voting API** (`voapi/`)
- **Base Route**: `voapi/vov1`
- **Controller**: VOV1Controller
- **Purpose**: Governance and voting system operations
- **Key Features**:
  - Vote casting and management
  - Proposal creation and tracking
  - Governance participation
  - Voting results and statistics

### 9. **Reserve API** (`rsapi/`)
- **Base Route**: `rsapi/rsv1`
- **Controller**: RSV1Controller
- **Purpose**: Reserve (vault) accounts: `xRBX…` addresses whose outgoing transactions wait out a delay and can be called back or recovered
- **Key Features**:
  - Create, restore and publish reserve accounts
  - Delayed sends and NFT transfers from a reserve account
  - Callback and recovery of pending reserve transactions
  - Reserve account info and transaction lists

### 10. **Adjudicator API** (`adjapi/`)
- **Base Route**: `adjapi/adjv1`
- **Controller**: ADJV1Controller
- **Purpose**: Diagnostic reads of the node's consensus state
- **Key Features**:
  - Duplicate validator broadcasts
  - Consensus and Fortis pool broadcast transactions
  - Masternode (validator) lists seen by the node
  - Adjudicator info

### 11. **Decentralized Shop API** (`dstapi/`)
- **Base Route**: `dstapi/dstv1`
- **Controller**: DSTV1Controller
- **Purpose**: Decentralized Shops (DST): the node-hosted NFT marketplace
- **Key Features**:
  - Shop creation, publishing, update and deletion
  - Collections and listings
  - Auctions, bids and buy-now purchases
  - Buyer and seller chat

### 12. **Web Shop API** (`wsapi/`)
- **Base Route**: `wsapi/webshopv1`
- **Controller**: WebShopV1Controller
- **Purpose**: Connecting to another node's Decentralized Shop and trading on it
- **Key Features**:
  - Connect to and ping a remote shop
  - Read a remote shop's data, auctions and bids
  - Send bids and buy-now bids
  - Chat with the shop owner

### 13. **Integrations API** (`iapi/`)
- **Base Route**: `iapi/integrationsv1`
- **Controller**: IntegrationsV1Controller
- **Purpose**: Minimal chain reads for third-party integrations (exchanges, listing sites)
- **Key Features**:
  - `Network`: height, last block hash and time, block version, CLI and GitHub versions, network age, total supply
  - `Height`: current block height
  - `LastBlock`: the latest block

### 14. **Privacy API** (`privacyapi/`)
- **Base Route**: `privacyapi/privacyv1`
- **Controller**: PrivacyV1Controller
- **Purpose**: Prism privacy layer (PLONK proofs)
- **Key Features**:
  - Shielded addresses and balances
  - Shield, unshield and private transfers of VFX and vBTC
  - Shielded pool state and wallet scans
  - PLONK parameter status

### 15. **vBTC API** (`vbtcapi/`)
- **Base Route**: `vbtcapi/vbtc`
- **Controller**: VBTCController
- **Purpose**: vBTC V2: FROST vaults, watched-vault deposits, transfers and withdrawals
- **Key Features**:
  - vBTC validator registration and DKG ceremonies
  - Vault contract creation
  - vBTC transfers, including multi-vault transfers
  - Withdrawal request, completion, fee bump, release and cancellation
  - Bridge to Base (vBTC.b)

### 16. **Browser Wallet API** (`wallet/`)
- **Base Route**: `wallet`
- **Controller**: WalletController
- **Purpose**: JSON routes behind the node's built-in browser wallet page (`/wallet`)
- **Key Features**:
  - Accounts, transactions and NFTs
  - VFX and vBTC sends, vBTC withdrawals and the Base bridge
  - Shielded (Prism) operations

### 17. **Explorer API** (`explorer/`)
- **Base Route**: `explorer`
- **Controller**: ExplorerController
- **Purpose**: The node's built-in read-only block explorer page and its JSON routes
- **Key Features**:
  - Stats, blocks, transactions, addresses, mempool and search (`explorer/api/...`)
  - Served without the API token or the enable-API switch

## Common Features Across All APIs

### Authentication
Every controller on the wallet API port except the Explorer controller uses the `ActionFilterController` attribute for request filtering:

- **API token**: when the node is started with `apitoken=<value>`, every request must send the header `apitoken: <value>`, or it gets `403`. A few status reads (`CheckStatus`, `GetCLIVersion`, `GetWalletInfo`, `NetworkMetrics`, `SyncBalances`, `Mother`, `Egg`) answer without it.
- **API password**: with `AlwaysRequireAPIPassword=true` in the config, the password goes in the optional `{somePassword?}` route segment (for example `api/V1/{somePassword}/GetWalletInfo`); without it the request gets `403`. The Integrations controller has no password segment.
- **Locked wallet**: while an encrypted wallet is locked, actions that are not reads, raw relays of externally signed transactions or unlock calls return `401` with "You must type in your encryption password first!".
- **Network access**: the API listens on loopback only and refuses non-loopback `Host` headers and cross-origin browser requests. The `openapi` launch argument (or `OpenAPI=true`) opens it on all interfaces, and the node refuses `openapi` unless an API token (or an API password with `AlwaysRequireAPIPassword=true`) is set.

### Response Format
APIs typically return JSON responses with consistent error handling and status reporting.

### Swagger Documentation
All endpoints are documented with Swagger/OpenAPI specifications for interactive testing and documentation. On a machine running the CLI, visit `http://localhost:7292/swagger` (or `http://localhost:17292/swagger` on testnet). The API calls themselves answer only after the API is enabled with the `enableapi` launch argument or option `10` on the main menu. See [Swagger](/build/node-api/swagger/).


## Usage Notes

1. **Version Control**: APIs use versioning (V1, V2) to maintain backward compatibility
2. **Route Structure**: Most routes follow the pattern `{namespace}api/{controller}/{action}`, for example `txapi/TXV1/GetTimestamp`; the browser wallet (`wallet/api/...`) and explorer (`explorer/api/...`) routes are the exceptions
3. **Security**: See [Authentication](#authentication) above
4. **Async Operations**: Most operations are asynchronous for better performance

This structure provides a comprehensive REST API surface for all VFX Core functionality, organized by domain-specific concerns.


## API Endpoint Details
Details about each endpoint can be found [here](/build/node-api/details/).
