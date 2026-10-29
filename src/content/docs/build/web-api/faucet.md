---
title: "Web API: Faucet"
description: The testnet faucet API that pays testnet VFX and signet BTC after SMS verification, and faucet access for test automation.
sidebar:
  label: "Faucet"
  order: 8
---

The testnet faucet pays testnet VFX and signet BTC (Bitcoin on the [VerifiedX signet](/build/signet/), the testnet's own Bitcoin network) for development and testing. It is the API behind the [faucet page](https://spyglass-testnet.verifiedx.io/faucet) on the testnet explorer, and it only runs on testnet.

A request is confirmed by a code sent by SMS to a phone number, and each verified phone number has a lifetime limit for each asset.

## Base URL
```
https://data-testnet.verifiedx.io/api/faucet/
```

## Endpoints

### Get Faucet Info
```http
GET /api/faucet/request/
```

Returns the faucet's sending address, its balance and the request limits.

**Response:**
```json
{
  "address": "x8NemQSjMUKXaLqbpVU6YNq4P2d6Jbcrra",
  "available": 14999607.98989756,
  "max_amount": 1000.0,
  "min_amount": 0.0001,
  "btc": {
    "enabled": true,
    "max_amount": 0.01,
    "min_amount": 0.00001
  }
}
```

- `max_amount`: the most VFX one phone number can receive in total, or the faucet's balance if that is lower
- `btc.enabled`: whether the faucet pays signet BTC right now
- `btc.max_amount`: the most signet BTC one phone number can receive in total

### Request Funds
```http
POST /api/faucet/request/
```

Starts a request and sends a verification code by SMS to `phone`. Nothing is paid until the request is verified.

**Request:**
```json
{
  "address": "xC1zNn7596TC4Bcyn1vE88pj12hfieqCoa",
  "amount": 10,
  "btc_address": "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
  "btc_amount": 0.002,
  "phone": "+12223334444"
}
```

- `address`, `amount`: the VFX part. A testnet VFX address (it starts with `x`) and an amount from `min_amount`
- `btc_address`, `btc_amount`: the signet BTC part. A testnet-format Bitcoin address (`tb1…`, `m…`, `n…` or `2…`) and an amount from `btc.min_amount`
- `phone`: the phone number that receives the code, in international format (`+` and country code)

Send the VFX part, the BTC part or both. Each part needs both of its fields. The faucet page asks for one asset at a time.

**Response:**
```json
{
  "message": "Verification Required.",
  "uuid": "6f1c2a9e-3b7d-4c55-9a4e-0d2f8e1b7c31"
}
```

### Verify Request
```http
POST /api/faucet/verify/
```

Confirms a request with the code from the SMS and pays it.

**Request:**
```json
{
  "uuid": "6f1c2a9e-3b7d-4c55-9a4e-0d2f8e1b7c31",
  "verification_code": "123456"
}
```

**Response:**
```json
{
  "message": "Funds requested successfully.",
  "hash": "60ab…",
  "btc_hash": "9f3c…"
}
```

- `hash`: the VFX transaction. Some answers carry the node's whole reply as a JSON string (`{"Result":"Success","Message":"…","Hash":"60ab…"}`); the hash is its `Hash` field
- `btc_hash`: the signet BTC transaction id. Look it up at `https://signet.verifiedx.io/tx/<btc_hash>`

When one part is paid and the other fails, the answer is HTTP 400 with `message` saying what failed, and it still carries the hash of the part that was paid. Verifying the same request again retries only the unpaid part. When the BTC part's result is unknown, the message says the payment may have gone through. That payment is never sent again, so check the signet explorer before asking for more.

The BTC payment is in the signet mempool at once and confirms in the next signet block (about 10 minutes).

## Errors

All refusals are HTTP 400 with a `message`:

| Message | Cause |
|---------|-------|
| `Testnet faucet is disabled.` | The faucet is off |
| `Invalid request.` | Neither part was sent, a part is missing a field, or `phone` is missing |
| `Minimum amount is 0.0001 VFX.` / `Minimum amount is 0.00001 BTC.` | The amount is below the minimum |
| `Maximum amount is … VFX.` / `Maximum amount is … BTC.` | The amount is above one number's limit |
| `There is a withdrawl limit of … This account has already withdrawn …` | This phone number has reached its lifetime limit |
| `Not a testnet BTC address (tb1…, m…, n… or 2…).` | The Bitcoin address is not a testnet-format address |
| `The BTC faucet is disabled.` | The faucet is not paying signet BTC right now |
| `Invalid verification code` | The SMS code is wrong |
| `Request not found with uuid of …` | No request has that `uuid` |
| `Already verified. Hash: …` | The request was verified and fully paid before |

## Faucet access for test automation

Teams that test against the VerifiedX testnet from scripts or CI can ask for an automation token. A request that carries it in an `X-Faucet-Token` header needs no `phone` and no SMS code: `POST /api/faucet/request/` pays at once and answers with `hash`, `btc_hash` and `uuid`. Automation has its own daily limits, shared by every token request.

The VerifiedX team can also give automation access to mine signet blocks on demand, so a test does not have to wait about 10 minutes for each confirmation.

Both are part of [Partner API access](/build/signet/#partner-api-access), which explains how to ask for it, the limits, and how to call both APIs. Keep the tokens out of repositories, logs and issue trackers.
