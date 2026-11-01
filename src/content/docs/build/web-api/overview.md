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
9. **[Master Node](/build/web-api/master-node/)** - Validators (master nodes): status, location and blocks produced
10. **[Media](/build/web-api/media/)** - Media file storage and retrieval
11. **[Metrics](/build/web-api/metrics/)** - Network totals, block cadence, and circulation and burn figures
12. **[NFT](/build/web-api/nft/)** - Non-fungible token data and operations
13. **[Price](/build/web-api/price/)** - VFX exchange price and recorded price history
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

Most endpoints are publicly accessible. Updating or deleting a shop, collection or listing needs the owner's token; the [Shop](/build/web-api/shop/#authentication) page explains how to get one.

## Response Format

Responses are JSON with standard HTTP status codes. Amounts are JSON numbers. Paginated endpoints take `page` and `limit` (default 30, max 500) and answer in this envelope:

```json
{
  "count": 7624911,
  "page": 1,
  "num_pages": 254164,
  "results": []
}
```

There are no `next` or `previous` links; request the next `page` instead.
