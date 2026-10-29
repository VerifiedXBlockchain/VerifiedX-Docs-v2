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
/api/fungible-token/
```

## Endpoints

### List Fungible Tokens
```http
GET /api/fungible-token/
```

Returns a paginated list of all fungible tokens on the VFX blockchain.

**Query Parameters:**
- `search`: Search by token name, symbol, or smart contract identifier
- `ordering`: Order results (e.g., `name`, `-created_at`)

**Response:**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/fungible-token/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "smart_contract_uid": "SC123...",
      "name": "VFX Utility Token",
      "symbol": "VUT",
      "total_supply": "1000000.0",
      "decimals": 18,
      "creator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "created_at": "2024-01-01T12:00:00Z",
      "is_voting_enabled": true,
      "description": "A utility token for the VFX ecosystem"
    }
  ]
}
```

### Get Fungible Token Details
```http
GET /api/fungible-token/{sc_identifier}/
```

Returns detailed information about a specific fungible token.

**Parameters:**
- `sc_identifier` (string): The smart contract identifier

**Response:**
```json
{
  "id": 1,
  "smart_contract_uid": "SC123...",
  "name": "VFX Utility Token",
  "symbol": "VUT",
  "total_supply": "1000000.0",
  "decimals": 18,
  "creator_address": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "created_at": "2024-01-01T12:00:00Z",
  "is_voting_enabled": true,
  "description": "A utility token for the VFX ecosystem",
  "metadata": {
    "website": "https://example.com",
    "logo": "https://example.com/logo.png",
    "whitepaper": "https://example.com/whitepaper.pdf"
  },
  "holders_count": 500,
  "transfer_count": 1250
}
```

### List Token Voting Topics
```http
GET /api/fungible-token/{sc_identifier}/voting-topics/
```

Returns voting topics associated with a specific fungible token.

**Parameters:**
- `sc_identifier` (string): The smart contract identifier

**Response:**
```json
{
  "count": 5,
  "results": [
    {
      "topic_id": "topic_123",
      "title": "Proposal to Increase Token Supply",
      "description": "Vote on whether to increase the total token supply by 20%",
      "status": "active",
      "created_by": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
      "start_time": "2024-01-01T12:00:00Z",
      "end_time": "2024-01-08T12:00:00Z",
      "votes_for": 1500,
      "votes_against": 800,
      "total_votes": 2300,
      "participation_rate": "46%"
    }
  ]
}
```

### Get Voting Topic Details
```http
GET /api/fungible-token/voting-topics/{topic_id}/
```

Returns detailed information about a specific voting topic.

**Parameters:**
- `topic_id` (string): The voting topic identifier

**Response:**
```json
{
  "topic_id": "topic_123",
  "token": {
    "smart_contract_uid": "SC123...",
    "name": "VFX Utility Token",
    "symbol": "VUT"
  },
  "title": "Proposal to Increase Token Supply",
  "description": "Vote on whether to increase the total token supply by 20%",
  "full_description": "This proposal suggests increasing the total supply...",
  "status": "active",
  "created_by": "R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR",
  "start_time": "2024-01-01T12:00:00Z",
  "end_time": "2024-01-08T12:00:00Z",
  "votes_for": 1500,
  "votes_against": 800,
  "abstain": 100,
  "total_votes": 2400,
  "participation_rate": "48%",
  "quorum_required": "25%",
  "quorum_met": true,
  "voting_options": ["For", "Against", "Abstain"]
}
```

## Field Descriptions

### Fungible Token
- `smart_contract_uid`: Unique identifier for the token's smart contract
- `name`: Full name of the token
- `symbol`: Trading symbol/ticker for the token
- `total_supply`: Total number of tokens in circulation
- `decimals`: Number of decimal places supported
- `creator_address`: Address that created the token
- `is_voting_enabled`: Whether governance voting is enabled
- `holders_count`: Number of addresses holding the token
- `transfer_count`: Total number of transfers

### Voting Topic
- `topic_id`: Unique identifier for the voting topic
- `title`: Short title of the proposal
- `description`: Brief description of the proposal
- `status`: Current status (active, completed, cancelled)
- `start_time`: When voting begins
- `end_time`: When voting ends
- `votes_for/against`: Vote counts for each option
- `participation_rate`: Percentage of eligible voters who participated
- `quorum_required`: Minimum participation needed for validity
- `quorum_met`: Whether the quorum requirement was satisfied

## Voting Status Values

- `pending`: Voting has not yet started
- `active`: Voting is currently open
- `completed`: Voting has ended successfully
- `cancelled`: Voting was cancelled before completion
- `failed`: Voting failed to meet quorum requirements

## Notes

- Token amounts are returned as strings to preserve decimal precision
- Voting is only available for tokens with `is_voting_enabled: true`
- Voting power is typically based on token holdings at a snapshot block
- Topics may have different voting mechanisms (simple majority, supermajority, etc.)
- Historical voting data is preserved for transparency and auditing
