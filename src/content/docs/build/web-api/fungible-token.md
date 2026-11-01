---
title: "Web API: Fungible Token"
description: Explorer API endpoints for fungible token details and token voting topics.
sidebar:
  label: "Fungible Token"
  order: 9
---

The Fungible Token API provides endpoints for retrieving information about fungible tokens, including token details, voting topics, and governance features.

## Base URL
```
/api/fungible-tokens/
```

## Endpoints

### List Fungible Tokens
```http
GET /api/fungible-tokens/
```

Returns a paginated list of all fungible tokens on the VFX blockchain, newest first.

**Query Parameters:**
- `search`: Tokens whose name, ticker, contract identifier or owner address contains the term
- `page` (integer): Page number
- `limit` (integer): Results per page (default 30, max 500)

**Response:**
```json
{
  "count": 400,
  "page": 1,
  "num_pages": 14,
  "results": [
    {
      "sc_identifier": "9541c645d3ae4d15886885d4627278b3:1792822131",
      "name": "QA Token W2",
      "ticker": "LR24AW2",
      "description": "Two-decimal test token",
      "owner_address": "xXVdgxHRzmr5WnSsi3c2v9wEjsFdk7jnkf",
      "can_mint": true,
      "can_burn": true,
      "can_vote": false,
      "created_at": "2026-10-24T06:08:57Z",
      "initial_supply": 0.0,
      "circulating_supply": 501.0,
      "decimal_places": 2,
      "image_url": "https://rbx-nft-web-assets-testnet.s3.amazonaws.com/9541c645d3ae4d15886885d4627278b31792822131/tmpol_eqhuk.png",
      "is_paused": false,
      "banned_addresses": [],
      "nsfw": false
    }
  ]
}
```

### Get Fungible Token Details
```http
GET /api/fungible-tokens/{sc_identifier}/
```

Returns a token and the balance of every address that has held it.

**Parameters:**
- `sc_identifier` (string): The smart contract identifier

**Response:**
```json
{
  "token": {
    "sc_identifier": "9541c645d3ae4d15886885d4627278b3:1792822131",
    "name": "QA Token W2",
    "ticker": "LR24AW2",
    "description": "Two-decimal test token",
    "owner_address": "xXVdgxHRzmr5WnSsi3c2v9wEjsFdk7jnkf",
    "can_mint": true,
    "can_burn": true,
    "can_vote": false,
    "created_at": "2026-10-24T06:08:57Z",
    "initial_supply": 0.0,
    "circulating_supply": 501.0,
    "decimal_places": 2,
    "image_url": "https://rbx-nft-web-assets-testnet.s3.amazonaws.com/9541c645d3ae4d15886885d4627278b31792822131/tmpol_eqhuk.png",
    "is_paused": false,
    "banned_addresses": [],
    "nsfw": false
  },
  "holders": {
    "xVWNbcBXTtiiL7ZHCqxRP1q12tcgUTQA4m": 399.5,
    "xXVdgxHRzmr5WnSsi3c2v9wEjsFdk7jnkf": 101.5
  }
}
```

### List Token Voting Topics
```http
GET /api/fungible-tokens/{sc_identifier}/voting-topics/
```

Returns a paginated list of the voting topics of a token.

**Parameters:**
- `sc_identifier` (string): The smart contract identifier

**Response:**
```json
{
  "count": 2,
  "page": 1,
  "num_pages": 1,
  "results": [
    {
      "sc_identifier": "39685758c457473686504b4c16516a5b:1793534071",
      "token": { "sc_identifier": "39685758c457473686504b4c16516a5b:1793534071", "name": "...", "ticker": "..." },
      "from_address": "xWhMdq5TPzdXCib68kSHVUBhgdxdAZ1G2s",
      "topic_id": "u9GGgZ0R1793534287",
      "name": "Distribute Q3",
      "description": "Pay out the Q3 distribution",
      "vote_requirement": 51.0,
      "created_at": "2026-11-01T11:58:07Z",
      "voting_ends_at": "2026-11-08T11:58:07Z",
      "vote_data": {
        "votes": [
          { "address": "xWhMdq5TPzdXCib68kSHVUBhgdxdAZ1G2s", "value": true, "created_at": "2026-11-01T12:10:00Z" }
        ],
        "vote_yes": 1,
        "vote_no": 0,
        "total_votes": 1,
        "percent_yes": 1.0,
        "percent_no": 0.0
      }
    }
  ]
}
```

### Get Voting Topic Details
```http
GET /api/fungible-tokens/voting-topics/{topic_id}/
```

Returns one voting topic, in the same format as a list result.

**Parameters:**
- `topic_id` (string): The voting topic identifier, for example `u9GGgZ0R1793534287`

## Field Descriptions

### Fungible Token
- `sc_identifier`: Unique identifier for the token's smart contract
- `name`: Full name of the token
- `ticker`: Trading symbol of the token
- `description`: Token description
- `owner_address`: Current owner of the token contract
- `can_mint`, `can_burn`, `can_vote`: Whether the token allows minting, burning and voting topics
- `created_at`: When the token was deployed
- `initial_supply`: Supply minted at deployment
- `circulating_supply`: Current supply
- `decimal_places`: Number of decimal places supported
- `image_url`: Token image
- `is_paused`: Whether the owner has paused the token
- `banned_addresses`: Addresses the owner has banned from the token
- `nsfw`: Whether the token is flagged as not safe for work
- `holders` (detail only): Balance per address

### Voting Topic
- `topic_id`: Unique identifier for the voting topic
- `sc_identifier`, `token`: The token the topic belongs to
- `from_address`: Address that created the topic
- `name`: Short title of the proposal
- `description`: Description of the proposal
- `vote_requirement`: Minimum token balance a holder needs to vote
- `created_at`: When the topic was created
- `voting_ends_at`: When voting ends
- `vote_data.votes`: Each vote cast, with the voter's `address`, its `value` (`true` = yes) and `created_at`
- `vote_data.vote_yes`, `vote_data.vote_no`, `vote_data.total_votes`: Vote counts
- `vote_data.percent_yes`, `vote_data.percent_no`: Shares of the votes cast, as fractions from 0 to 1

## Notes

- Token amounts are JSON numbers
- Voting topics exist only for tokens with `can_vote: true`
- The explorer counts each recorded vote once; `vote_data` does not weight votes by token balance
