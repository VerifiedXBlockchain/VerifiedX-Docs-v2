---
title: "Web API"
description: "The VFX Explorer (Spyglass) Web API: its namespaces, base URLs, Swagger playground, authentication and response format."
sidebar:
  order: 1
---

This section documents the VFX Explorer Web API endpoints organized by namespace. The API provides access to blockchain data including addresses, transactions, blocks, NFTs, and more.

## Available Namespaces

The following API namespaces are available (excluding applications, auth, and galxe):

1. **[Addresses](/build/web-api/addresses/)** - Address information, balances, and token holdings
2. **[ADNR](/build/web-api/adnr/)** - Address Domain Name Resolution system
3. **[Block](/build/web-api/block/)** - Blockchain blocks and block data
4. **[BTC](/build/web-api/btc/)** - Bitcoin-related functionality and cross-chain features
5. **[Chat](/build/web-api/chat/)** - Chat and messaging features
6. **[CMC Price](/build/web-api/cmc-price/)** - CoinMarketCap price data integration
7. **[Faucet](/build/web-api/faucet/)** - Testnet faucet functionality
8. **[Fungible Token](/build/web-api/fungible-token/)** - Fungible token information and operations
9. **[Master Node](/build/web-api/master-node/)** - Master node data and statistics
10. **[Media](/build/web-api/media/)** - Media file storage and retrieval
11. **[Metrics](/build/web-api/metrics/)** - Network metrics and analytics
12. **[NFT](/build/web-api/nft/)** - Non-fungible token data and operations
13. **[Price](/build/web-api/price/)** - Price data and market information
14. **[Raw](/build/web-api/raw/)** - Raw blockchain operations and utilities
15. **[Shop](/build/web-api/shop/)** - NFT marketplace and shop functionality
16. **[Transaction](/build/web-api/transaction/)** - Transaction data and operations

## Base URL

All API endpoints are accessible under:
```
Mainnet: https://data.verifiedx.io/api/
Testnet: https://data-testnet.verifiedx.io/api/
```

## Swagger
You can use the swagger playground here:
```
Mainnet: https://data.verifiedx.io/docs/
Testnet: https://data-testnet.verifiedx.io/docs/
```



## Authentication

Most endpoints are publicly accessible. Authentication requirements are noted in individual endpoint documentation where applicable.

## Response Format

All API responses follow a consistent JSON format with appropriate HTTP status codes. Paginated endpoints include standard pagination metadata.
