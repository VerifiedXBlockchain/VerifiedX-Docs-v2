---
title: "Bitcoin Integration in VerifiedX Core"
description: How VerifiedX consensus verifies Bitcoin's header chain and transaction inclusion, where its Bitcoin data comes from, and which Bitcoin network each VerifiedX network follows.
sidebar:
  order: 6
  label: Bitcoin integration
  attrs:
    class: sidebar-btc
---

VerifiedX has Bitcoin-aware consensus. From Core 9.0 the chain itself verifies Bitcoin's proof-of-work header chain and the inclusion of Bitcoin transactions, and records the Bitcoin held by every vBTC vault as consensus state. Every node reaches the same verdict on that Bitcoin state from the data in its own blocks, without asking a Bitcoin server and without taking a block producer's word for it.

This is what lets vBTC follow its Bitcoin exactly: a vault's balance is the Bitcoin the chain has verified, and a withdrawal is paid by a Bitcoin transaction that consensus fixes in advance. See [vBTC](/learn/vbtc-protocol/) for how vaults use it.

## How the chain verifies Bitcoin

### The header chain

The chain keeps Bitcoin's block headers from a fixed checkpoint onward. A header is accepted only when it extends the stored tip and passes Bitcoin's own header rules: the proof-of-work target, the difficulty retarget every 2,016 blocks, and the median-time-past rule. These rules read nothing but earlier headers, so every node checks them with no network access. A branch that leaves the chain below the checkpoint is refused.

The one Bitcoin rule deliberately not checked is "no more than two hours in the future", because it depends on a local clock, which consensus cannot use. It is not needed: a Bitcoin block counts only once further proof-of-work is built on top of it.

### Bitcoin reports

Validators turn Bitcoin blocks into **Bitcoin reports** (transaction type 43). A report carries the new headers and every vault event in a Bitcoin block: a deposit to a vault's deposit script, or a spend of a coin the chain holds for a vault. Each event comes with the Bitcoin transaction and its Merkle branch to the block header.

A report is valid only when it is signed by two thirds of the current validator signer set and every node can verify it on its own:

- the headers pass the header rules above and extend the stored chain;
- each transaction's Merkle branch leads to the header it claims;
- the effect of each transaction on the vaults' coins is worked out by the verifying node itself from the transaction and chain state. A report never states its own effects.

Validators at the same VFX height holding the same Bitcoin block build byte-identical reports, so honest signers agree.

### Burial depth

A vault event counts only once its Bitcoin block is buried: 6 Bitcoin blocks on top of it on mainnet, 3 on testnet. Until then a deposit is not credited and a spend is not settled.

### Reorganisations

If Bitcoin reorganises below events the chain has recorded, validators report the heavier branch and the events of the replaced blocks are taken back (transaction type 45). A branch that is longer but carries less work is not followed.

### What the chain records

For every watched vault the chain records its Bitcoin coins (outpoint and amount), which of the vault's keys each coin pays, and the Bitcoin height each was created or spent at. Balances, withdrawals and key rotations for those vaults are computed from this record. See [Bitcoin attestation](/learn/vbtc-protocol/#bitcoin-attestation-core-90).

## Where Bitcoin data comes from

Consensus needs no Bitcoin access: a node judges a report from the report itself. Only validators that sign reports fetch Bitcoin data, and wallet features use their own servers.

### Signing validators

A signing validator runs a built-in Bitcoin light client, with no second process to install:

- It keeps a handful of Bitcoin peers found through the Bitcoin DNS seeds, chosen from different networks so that no single hosting provider supplies all of them.
- It follows the header chain those peers serve from the checkpoint and fetches recent blocks of that chain. Every fetched block is checked against its header before it is kept. About 300 MB of recent blocks are kept on disk on mainnet.
- It also asks a few other active validators for their headers each round.
- Public Esplora explorers (mempool.space and blockstream.info on mainnet) are asked only when no peer delivers a block, and what they return is checked like any other source.

A validator that cannot fetch a block of the heaviest chain waits; it does not sign a report it cannot build. The validator needs outbound access to the Bitcoin peer-to-peer network (port 8333 on mainnet). See [Run a Validator](/node/validator/).

### Wallet features

The node's Bitcoin wallet features (BTC accounts, balances, unspent outputs and broadcasting Bitcoin transactions) use Electrum servers. A default list of public servers is built in; set your own in `config.txt` with a comma-separated list, using `https://` for a TLS connection:

```
ElectrumServers=https://electrum.example.com:50002,http://10.0.0.5:50001
```

These servers serve wallet data only. They have no part in consensus and no say over vault balances.

## Networks

- **Mainnet** follows Bitcoin mainnet.
- **Testnet** follows the VerifiedX signet, a private Bitcoin signet (BIP 325) with 10-minute blocks. Every signet block must carry the signet's signature, and headers come only from the signet's own nodes and its explorer at `https://signet.verifiedx.io`. The node's Electrum settings point at the signet's own servers automatically. See [Testnet](/build/testnet/).

## Related

- [vBTC](/learn/vbtc-protocol/): vaults, watched withdrawals and S3C.
- [vBTC integration](/build/vbtc/integration/) and [vBTC raw integration](/build/vbtc/raw-integration/).
- [Institutional signing (S3C)](/learn/institutional/s3c-signing/): running a vault's signing on your own validators.
- [VerifiedX Core repository](https://github.com/VerifiedXBlockchain/VerifiedX-Core) (`VerifiedXCore/Bitcoin/Attestation`).
