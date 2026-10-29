---
title: "vBTC: Verified Bitcoin on the VFX Network"
description: "How vBTC vaults hold Bitcoin one to one: deposits, transfers, withdrawals, Bitcoin attestation, S3C vaults, and vBTC.b on Base."
sidebar:
  order: 7
  label: vBTC protocol
  attrs:
    class: sidebar-btc
---

vBTC brings Bitcoin onto the VerifiedX (VFX) network one to one. Bitcoin is held in vaults whose keys are split among VerifiedX validators, and the vault's vBTC moves on VFX: transferred in seconds for a small VFX fee, used in smart contracts, and withdrawn back to Bitcoin at any time.

## How it works

- **Vaults.** A vault is a vBTC V2 smart contract with its own Bitcoin Taproot deposit address. Its key is created in a key ceremony among the validators (FROST distributed key generation) and held in shares: no single party, the validators included, holds the whole key, and spending needs a threshold of the share holders.
- **Deposit.** Bitcoin sent to a vault's deposit address is credited to the vault's owner as vBTC, one to one, once it is buried under enough Bitcoin blocks.
- **Use.** The owner transfers vBTC to any VFX address. Holders transfer it on, use it in contracts, or bridge it to Base as vBTC.b.
- **Withdraw.** Any holder asks for its vBTC to be paid to a Bitcoin address. The vBTC is taken out of circulation and the vault pays the Bitcoin.

## Bitcoin attestation (Core 9.0)

From Core 9.0 the network itself records each vault's Bitcoin. Validators report every Bitcoin block's vault transactions to the chain (Bitcoin reports, transaction type 43), signed by two thirds of the current validator signer set, and a vault event counts only once its Bitcoin block has 6 blocks on top of it (3 on testnet). A vault created after the attestation recording height is **watched**:

- **Balances follow the attested Bitcoin.** The owner's vBTC on a vault is the vault's Bitcoin as the chain records it, less what other holders hold. No node asks a Bitcoin server, and no block producer's word is taken for it.
- **Withdrawals are fixed by the chain.** When a withdrawal request is mined, every node works out the same Bitcoin transaction that pays it, from the vault's coins, by fixed rules, and records it (the "pin"). The vault's signers sign exactly that transaction and broadcast it. The withdrawal completes when Bitcoin confirms it. No completion transaction and no vote are needed.
- **The requester stays in control.** While the withdrawal waits for its Bitcoin transaction, its requester can cancel it and have the vBTC back at once. Once it is pinned, the requester can raise its Bitcoin fee if it is not confirming, or release it, which returns the coins to the vault and refunds the vBTC less that transaction's fee (transaction type 44).
- **Vaults keep their keys alive.** When too many holders of a vault's key have left the validator set, the validators make a new key for it (type 46) and the vault's coins are moved to the new key while the old one can still sign.
- **Bitcoin reorganisations are followed.** If Bitcoin reorganises below reported events, they are taken back (type 45).

Vaults created before the recording height (**legacy** vaults) keep the earlier way of working until the enforcement height, and are frozen from then on. Their holders should move to a new vault or withdraw before that height. On mainnet they are 7,568,350 and 7,658,350; on testnet they are 400 and 401.

## S3C vaults

An owner can have a vault's key held only by validators the owner runs (S3C, self-custodial smart contracts): at least three of the owner's own registered validators, all of which take part in the key ceremony and in signing. Public vaults never use S3C validators. See [S3C vaults](/build/vbtc/integration/#s3c-vaults).

## vBTC.b on Base

vBTC.b ("Verified Bitcoin on Base") carries vBTC to Base as an ERC-20 with 8 decimals, while the Bitcoin stays in its VerifiedX vaults and issuance stays canonical: every vBTC.b is backed by vBTC locked on VerifiedX.

- **To Base.** The owner locks vBTC on VerifiedX (transaction type 37). Once the lock is 30 VFX blocks deep, the bridge's validators each sign an attestation of it, and the owner's node submits those signatures to the vBTC.b contract on Base, which mints only with at least two thirds of its validators' signatures (never fewer than two). The owner pays the Base gas from a Base address derived from the owner's VFX key.
- **Back to VerifiedX.** A holder burns vBTC.b on Base naming a VFX address. The bridge's casters see the burn, agree on it, and credit the vBTC from the locked pool (type 39).
- **Straight to Bitcoin.** A holder burns vBTC.b on Base naming a Bitcoin address. The casters record the exit on VerifiedX (type 40), consensus fixes the Bitcoin transactions that pay it from the vaults' coins, and the vaults' signers sign them, exactly as for a withdrawal. The exit completes when Bitcoin confirms it.

vBTC cannot be bridged directly from an S3C vault; see [Institutional Signing (S3C)](/learn/institutional/s3c-signing/#operating-the-pool). See [Bridging to Base](/build/vbtc/integration/#bridging-to-base-vbtcb) for the routes.

## Networks

vBTC on mainnet is backed by Bitcoin mainnet. The VerifiedX testnet follows the VerifiedX signet, a private Bitcoin signet with 10-minute blocks and an explorer at `https://signet.verifiedx.io` (Esplora API at `https://signet.verifiedx.io/api`); test BTC comes from the [testnet faucet](https://spyglass-testnet.verifiedx.io/faucet) (Signet BTC tab). See [Testnet](/build/testnet/#getting-test-funds).

## Benefits

- **One to one.** Every vBTC is backed by Bitcoin in a vault, and the chain records that Bitcoin.
- **No single custodian.** A vault's key exists only in shares among validators.
- **Fast and cheap.** vBTC transfers settle in VFX blocks for a small VFX fee.
- **Programmable.** vBTC works in VFX smart contracts and can be bridged to Base.

## Integrating

- [vBTC](/build/vbtc/integration/): the node API, with every route, example and error.
- [vBTC Raw Integration](/build/vbtc/raw-integration/): building and signing outside the node.
- [vBTC in the wallet](/wallet/vbtc/).

## Documents

[vBTC Flow](/resources/documents/vbtc-flow/)

[vBTC One Sheet](/resources/documents/vbtc-one-sheet/)

The source is in the [VerifiedX Core repository](https://github.com/VerifiedXBlockchain/VerifiedX-Core).
