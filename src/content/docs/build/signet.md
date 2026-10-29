---
title: "VerifiedX Signet (Testnet Bitcoin)"
description: "The VerifiedX signet, the private Bitcoin test network behind the VFX testnet: how it works, its explorer and APIs, signet BTC and Partner API access."
sidebar:
  label: Signet
  order: 4
---

The VerifiedX testnet does not use a public Bitcoin test network. Its Bitcoin side is the **VerifiedX signet**: a private Bitcoin network, run by the VerifiedX team, that follows Bitcoin's rules but whose blocks only the VerifiedX team can produce. Everything Bitcoin-related on the VFX testnet uses it: vBTC vault deposits and withdrawals, the wallets' Bitcoin accounts and the SDK's `BtcClient` on testnet.

It replaced Bitcoin testnet4 in October 2026. Testnet4's block times swing from seconds to hours and its chain reorganises often, so vBTC deposits and withdrawals could not be confirmed on a predictable schedule. The signet gives the testnet a Bitcoin chain that behaves like mainnet and stays up.

## How it works

A signet ([BIP 325](https://github.com/bitcoin/bips/blob/master/bip-0325.mediawiki)) is a Bitcoin test network where every block must carry a signature from the network's signing key. Proof of work is still checked, but at a low difficulty: what makes a block valid is the signature. Only the VerifiedX team holds the key, so nobody else can mine on the VerifiedX signet and nobody can reorganise it.

| | VerifiedX signet |
|---|---|
| Block producer | The VerifiedX team's signer (no one else can mine) |
| Block time | About 10 minutes, like mainnet |
| Reorganisations | None |
| Fees | 1 sat/vB is enough |
| Addresses | Testnet formats: `tb1…` (SegWit and Taproot), `m…`/`n…`, `2…` |
| Coins | Signet BTC (sBTC). It has no value and cannot be bought |
| Genesis | The standard signet genesis block (`00000008819873e9…bee1ef6`) |
| Message start | `c69e715c` |

The VFX testnet counts a vBTC vault event (a deposit, or a withdrawal's payment) once 3 signet blocks are on top of its block, so a deposit is usually credited 30 to 40 minutes after it is sent. See [vBTC](/build/vbtc/integration/).

## Explorer and APIs

The signet runs its own [mempool](https://signet.verifiedx.io) explorer, the same software as mempool.space.

| What | Where |
|------|-------|
| Explorer (blocks, transactions, addresses, mempool) | https://signet.verifiedx.io |
| Transaction page | `https://signet.verifiedx.io/tx/<txid>` |
| Esplora REST API (balances, UTXOs, broadcast) | `https://signet.verifiedx.io/api/…` |
| mempool API (fee estimates and more) | `https://signet.verifiedx.io/api/v1/…` |
| Electrum server (TLS) | `signet.verifiedx.io:50002`, `signet-2.verifiedx.io:50002` |
| Bitcoin P2P | `signet.verifiedx.io:38333`, `signet-2.verifiedx.io:38333` |

The APIs follow the mempool.space API, so a client written for mempool.space works by changing its base URL. For example:

```bash
# Current block height
curl https://signet.verifiedx.io/api/blocks/tip/height

# An address's balance and transactions
curl https://signet.verifiedx.io/api/address/tb1q.../txs

# Recommended fees
curl https://signet.verifiedx.io/api/v1/fees/recommended
```

VerifiedX Core on testnet, the VerifiedX wallets and the SDK's `BtcClient('testnet')` already point at these servers.

## Getting signet BTC

The [testnet faucet](https://spyglass-testnet.verifiedx.io/faucet) pays signet BTC on its **Signet BTC** tab: enter a `tb1…` address, the amount and your phone number, then the code you receive by SMS. Each phone number can receive up to 0.01 sBTC in total. The payment shows in the signet explorer at once and confirms in the next block. See [Testnet](/build/testnet/#getting-test-funds) for both faucet tabs, and [Web API: Faucet](/build/web-api/faucet/) for the API.

For more sBTC than the faucet gives, ask in the `Testnet Faucet` channel on [Discord](https://discord.gg/7cd5ebDQCj).

## Mining blocks

Blocks come only from the VerifiedX team's signer, which produces one about every 10 minutes. Because the network is the team's own, it can also produce blocks on demand: partners with [Partner API access](#partner-api-access) can mine up to 10 blocks at once instead of waiting about 10 minutes for each confirmation.

## Partner API access

Teams that integrate with VerifiedX and test against the testnet from scripts or CI can get Partner API access. It comes as two tokens:

| Token | What it does |
|-------|--------------|
| **Faucet token** | Funds testnet VFX and signet BTC addresses through the faucet API at once, with no phone number or SMS code |
| **Mining token** | Mines 1 to 10 signet blocks on demand, so a test gets its confirmations in seconds |

To ask for access, write in the `Testnet Faucet` channel on [Discord](https://discord.gg/7cd5ebDQCj) with your team and what you are testing. The tokens and the mining endpoint come with access. Treat the tokens as secrets: keep them in your secret store or CI secrets, never in a repository, a log or an issue, and ask for a new one if one leaks.

### Fund an address

```http
POST https://data-testnet.verifiedx.io/api/faucet/request/
X-Faucet-Token: <faucet token>
Content-Type: application/json
```

```json
{
  "address": "xC1zNn7596TC4Bcyn1vE88pj12hfieqCoa",
  "amount": "10",
  "btc_address": "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
  "btc_amount": "0.002"
}
```

Send the VFX part (`address`, `amount`), the signet BTC part (`btc_address`, `btc_amount`) or both. The faucet pays before it answers:

```json
{
  "message": "Funds requested successfully.",
  "hash": "60ab…",
  "btc_hash": "9f3c…",
  "uuid": "6f1c2a9e-3b7d-4c55-9a4e-0d2f8e1b7c31"
}
```

- **Minimums:** 0.0001 VFX and 0.00001 BTC. There is no per-request maximum.
- **Daily limits:** 1,000 VFX and 0.1 BTC per rolling 24 hours, shared by every partner. Ask on Discord if a test needs more.
- **Refusals:** HTTP 400 with a `message` (see [Web API: Faucet](/build/web-api/faucet/#errors)). When one part is paid and the other fails, the answer still carries the paid part's hash.
- **Unknown BTC result:** if the message says the BTC payment may have gone through, it is never sent again and still counts against the limit. Check the [signet explorer](https://signet.verifiedx.io) before asking again.

### Mine blocks on demand

```http
POST <mining endpoint>
Authorization: Bearer <mining token>
Content-Type: application/json
```

```json
{ "blocks": 6 }
```

`blocks` is 1 to 10. The answer is HTTP 202 with a request to follow:

```json
{
  "id": 42,
  "status": "pending",
  "blocks": 6,
  "start_height": null,
  "end_height": null,
  "block_hashes": [],
  "error": "",
  "created_at": "2026-10-28T15:04:05+00:00",
  "finished_at": null
}
```

Poll `GET <mining endpoint><id>/` with the same header until `status` is `done` or `failed`. It moves `pending` → `mining` → `done`. A finished request has `start_height`, `end_height` and `block_hashes`; a failed one has `error`.

| Answer | Meaning |
|--------|---------|
| `202` | Accepted; poll the request |
| `400` | `blocks` is not a whole number from 1 to 10 |
| `401` | The token is missing or wrong |
| `503` | On-demand mining is switched off |

Rules for using it:

- **Broadcast first, then mine.** A block only includes what is already in the mempool.
- **Mine what a step needs in one call.** For 6 confirmations, ask for 6 blocks once; do not mine in a loop.
- **Mine only when a test needs it.** Every extra block shortens the current difficulty period, so heavy use raises the next difficulty a little for everyone. The 10-minute blocks keep coming either way.

### Example: fund, then confirm

```bash
# FAUCET_TOKEN, MINING_TOKEN and MINE_URL come from your secret store
RESULT=$(curl -s -X POST https://data-testnet.verifiedx.io/api/faucet/request/ \
  -H "X-Faucet-Token: $FAUCET_TOKEN" -H "Content-Type: application/json" \
  -d '{"btc_address": "tb1q...", "btc_amount": "0.002"}')
echo "$RESULT" | jq -r .btc_hash

# One block confirms the payment; a vBTC vault deposit needs 4 (its block and 3 on top)
ID=$(curl -s -X POST "$MINE_URL" \
  -H "Authorization: Bearer $MINING_TOKEN" -H "Content-Type: application/json" \
  -d '{"blocks": 1}' | jq -r .id)
until curl -s "${MINE_URL}${ID}/" -H "Authorization: Bearer $MINING_TOKEN" \
  | jq -e '.status == "done" or .status == "failed"' > /dev/null; do sleep 2; done
curl -s "${MINE_URL}${ID}/" -H "Authorization: Bearer $MINING_TOKEN" | jq '{status, end_height, error}'
```

## Running your own node

You can follow the signet with your own Bitcoin Core node, peering with `signet.verifiedx.io:38333` and `signet-2.verifiedx.io:38333`. A node needs the signet's challenge script (`signetchallenge`) to accept its blocks; ask in the `Testnet Faucet` channel on [Discord](https://discord.gg/7cd5ebDQCj) for it. Most integrations do not need a node: the Esplora API and the Electrum servers above serve wallets directly.
