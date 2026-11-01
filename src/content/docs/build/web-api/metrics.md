---
title: "Web API: Metrics"
description: Explorer API endpoints for network totals, block cadence health, and circulation and burn figures.
sidebar:
  label: "Metrics"
  order: 12
---

Network-level statistics. Three endpoint groups exist: `/api/metrics/` for chain totals and the current block time, `/api/network-metrics/` for block-cadence health, and `/api/circulation/` for the supply and burn figures used by the explorer and by supply trackers. All are `GET`, take no parameters, and are cached on the server for a few seconds.

## Network Metrics
```http
GET /api/metrics/
```

**Response:**
```json
{
  "latest_block": 7624995,
  "active_validators": 162,
  "total_transactions": 1014007,
  "total_burned": 102193.45511584131,
  "circulating_supply": 199897806.54488415,
  "lifetime_supply": 199897806.54488415,
  "block_time": 12.666666666666666
}
```

**Fields:**
- `latest_block`: number of blocks indexed by the explorer, which tracks the current chain height
- `active_validators`: validators currently in the active set
- `total_transactions`: indexed transactions, excluding block-reward coinbase records
- `total_burned`: VFX burned to date: all transaction fees plus the amounts burned by domain registrations, shop registrations, and vault (reserve account) activations, and on mainnet the one-time burn Core applied at block 7,568,350
- `circulating_supply`, `lifetime_supply`: 200,000,000 minus `total_burned`; both are the same figure because the supply is fixed and fully circulated
- `block_time`: average seconds between blocks over the last five minutes (`0` when fewer than two blocks fall in that window)

A burn category with no transactions yet, such as shop registrations on testnet, counts as zero.

The `ordering`, `search`, `page`, and `limit` parameters shown for this endpoint in Swagger are ignored.

## Block Cadence
```http
GET /api/network-metrics/
```

**Response:**
```json
{
  "block_difference_average": 12.5,
  "block_last_received": "2026-09-04T07:41:41Z",
  "block_last_delay": 22,
  "time_since_last_block": 10,
  "blocks_averages": "3456/3456",
  "vbtc_v2_rewind_hold": null
}
```

**Fields:**
- `block_difference_average`: average interval between recent blocks, in seconds
- `block_last_received`: when the explorer's node received the last block
- `block_last_delay`: delay of the last block, in seconds
- `time_since_last_block`: seconds since the last block at the time of the request
- `blocks_averages`: a short text summary of block counts reported by the node's network information
- `vbtc_v2_rewind_hold`: `null` normally. While the explorer holds vBTC V2 data after a chain rewind it has not yet reconciled, an object with `rewind_height`, `reconciled_height` and `blocks_held` (indexed blocks since the rewind)

Values refresh at most every 10 seconds.

## Circulation
```http
GET /api/circulation/
```

**Response:**
```json
{
  "balance": 199897806.54488415,
  "lifetime_supply": 199897806.54488415,
  "fees_burned_sum": 102193.45511584131,
  "fees_burned": 102193,
  "total_staked": 810000.0,
  "active_master_nodes": 162,
  "total_master_nodes": 19740,
  "total_addresses": 24028,
  "total_transactions": 1013961,
  "cli_version": "5.0.1.xxx-beta"
}
```

**Fields:**
- `balance`: circulating supply in VFX
- `lifetime_supply`: total supply after burns (equal to `balance`)
- `fees_burned_sum`: exact VFX burned (the same figure as `total_burned` above); `fees_burned`: the same figure as an integer
- `total_staked`: VFX assured by active validators (5,000 VFX per active validator)
- `active_master_nodes`, `total_master_nodes`: validators active now, and every validator address the explorer has recorded
- `total_addresses`: addresses known to the explorer
- `total_transactions`: indexed transactions
- `cli_version`: the CLI version reported by the explorer's node, in the form `<major>.<minor>.<revision>.<build>-beta`, cached for ten minutes. When the node does not answer, the field falls back to the static string `5.0.1.xxx-beta` for a minute.

Values refresh at most every 30 seconds; a request that finds them older syncs them first and serves the fresh figures. Empty totals count as zero.

Two plain-text variants serve supply trackers:

```http
GET /api/circulation/circulating/
GET /api/circulation/lifetime/
```

Each returns the bare number as `text/plain`, for example `199897806.54488415`.

## Notes

- Amounts are VFX as JSON numbers, as on the other Web API endpoints.
- There are no hash-rate, difficulty, fee-percentile, or per-hour breakdown fields: the network uses Proof of Assurance, not mining, and the API does not aggregate fees by time.
- Per-period metrics (24h, 7d, 30d) are not offered; compute them from the [Block](/build/web-api/block/) and [Transaction](/build/web-api/transaction/) endpoints.
