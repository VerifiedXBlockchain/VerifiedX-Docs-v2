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
  - Bitcoin tokenization operations
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
- **Purpose**: Validator node operations and consensus mechanisms
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
- **Purpose**: Reserve block operations and special blockchain functions
- **Key Features**:
  - Reserve block management
  - Special transaction handling
  - Network reserve operations
  - Advanced blockchain utilities

### 10. **Adjudicator API** (`adjapi/`)
- **Base Route**: `adjapi/adjv1`
- **Controller**: ADJV1Controller
- **Purpose**: Dispute resolution and adjudication services
- **Key Features**:
  - Dispute handling
  - Adjudication processes
  - Conflict resolution
  - Network arbitration

### 11. **Data Store API** (`dstapi/`)
- **Base Route**: `dstapi/dstv1`
- **Controller**: DSTV1Controller
- **Purpose**: Decentralized data storage and retrieval
- **Key Features**:
  - Data storage operations
  - File management
  - Content addressing
  - Distributed storage coordination

### 12. **Web Shop API** (`wsapi/`)
- **Base Route**: `wsapi/webshopv1`
- **Controller**: WebShopV1Controller
- **Purpose**: E-commerce and marketplace functionality
- **Key Features**:
  - Product listings
  - Order management
  - Payment processing
  - Marketplace operations

### 13. **Integrations API** (`iapi/`)
- **Base Route**: `iapi/integrationsv1`
- **Controller**: IntegrationsV1Controller
- **Purpose**: Third-party service integrations
- **Key Features**:
  - External service connectivity
  - API bridging
  - Integration management
  - Cross-platform operations

## Common Features Across All APIs

### Authentication
All API controllers implement password-based authentication through the `{somePassword?}` route parameter and use the `ActionFilterController` attribute for request filtering.

### Response Format
APIs typically return JSON responses with consistent error handling and status reporting.

### Swagger Documentation
All endpoints are documented with Swagger/OpenAPI specifications for interactive testing and documentation. These can be found while running a cli with then `enableapi` flag enabled and visiting `http://localhost:7292` (or `http://localhost:17292` on testnet).


## Usage Notes

1. **Version Control**: APIs use versioning (V1, V2) to maintain backward compatibility
2. **Route Structure**: All routes follow the pattern `{namespace}api/[controller]/{action}`
3. **Security**: All APIs require appropriate authentication and authorization
4. **Rate Limiting**: Some endpoints may have rate limiting implemented
5. **Async Operations**: Most operations are asynchronous for better performance

This structure provides a comprehensive REST API surface for all VFX Core functionality, organized by domain-specific concerns.


## API Endpoint Details
Details about each endpoint can be found [here](/build/node-api/details/).
