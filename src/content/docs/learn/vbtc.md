---
title: About vBTC
description: vBTC is trustless, non-synthetic, programmable ownership of Bitcoin, verified by VerifiedX consensus.
sidebar:
  order: 2
  attrs:
    class: sidebar-btc
---

vBTC transforms Bitcoin from a passive store of value into a trustless, programmable, institutional-grade settlement and yield-enabled asset, without wrapped tokens, custody risk, or synthetic exposure. VerifiedX consensus verifies the Bitcoin behind every vault and fixes every redemption, so vBTC follows its Bitcoin exactly.

> vBTC is a trustless, non-synthetic, programmable ownership of Bitcoin, designed to enable true native Bitcoin DeFi without custodial bridges, IOUs, or wrapped risk.

## Key Highlights

- **True Ownership:** 1:1 Bitcoin backed, non-synthetic, and fully verifiable on-chain.
- **No Bridge Risk:** Eliminates centralized custodians and multi-sig bridge vulnerabilities.
- **Native DeFi:** Enables lending, borrowing, and prime brokerage directly with Bitcoin.
- **Institutional Ready:** Instant finality and predictable fees suitable for banks, funds, and market makers.

## Core Institutional Guarantees

- **Trustless by Design:** No centralized custodian or discretionary minting authority. Rules-based issuance.
- **Non-Synthetic Bitcoin:** Not a derivative. No rehypothecation or balance-sheet exposure. Direct, provable ownership.
- **1:1 Bitcoin Backing:** Deterministic mint, burn, and redemption.
- **On-Chain Verifiability:** Supply and settlement are auditable on-chain. Validators attest each vault's Bitcoin to the chain, so balances do not rest on an off-chain report.

## Verified by Consensus

- **Bitcoin-Aware Consensus:** Every node verifies Bitcoin's proof-of-work header chain and the Merkle inclusion of each vault deposit and spend. No Bitcoin server or block producer is taken at its word. See [Bitcoin Integration](/learn/bitcoin-integration/).
- **Consensus-Fixed Redemption:** When a withdrawal is requested, consensus determines the exact Bitcoin transaction that pays it before any signature is made. The vault's signers can sign only that transaction.
- **Threshold Signing:** Each vault's Bitcoin key exists only in shares among validators (FROST); no single party holds the whole key.
- **Allocator-Controlled Signing:** Institutions can restrict a vault's key ceremony and signing to three or more validators they run (S3C). See [Institutional Signing](/learn/institutional/s3c-signing/).

## Speed, Cost & Settlement

- **Instant Finality:** Near-instant settlement vs Bitcoin L1 latency.
- **Low, Predictable Fees:** Fixed, minimal transaction costs.
- **Always-On:** 24/7 global availability (no batch/cutoff constraints).

## Programmable Bitcoin

- **Native Smart Contracts:** Bitcoin becomes programmable without altering Bitcoin itself.
- **Deterministic Execution:** Contracts execute exactly as written with no oracle-driven state changes.
- **Composable Infrastructure:** Embeddable across lending, borrowing, escrow, clearing, and settlement.

## True Native Bitcoin DeFi

- **No Bridge Risk:** No multi-sig bridge and no single custodian: each vault's Bitcoin key exists only in shares among validators, and the chain records each vault's Bitcoin.
- **Bitcoin-First Architecture:** Bitcoin is the asset of record, not a secondary token.
- **Institutional-Grade:** Bank-adjacent (not grey market). Suitable for collateral and clearing.

## Primary Institutional Use Cases

- **Lending & Borrowing:** vBTC is pristine collateral with no rehypothecation risk.
- **On-Chain Prime Brokerage:** Margin, netting, and settlement.
- **Treasury Optimization:** Retain exposure while unlocking capital efficiency.
- **Clearing & Settlement:** Atomic, final settlement without intermediaries.
- **Custody-Compatible DeFi:** Integrates with institutional compliance frameworks.

## Who vBTC Is Designed For

- Banks & Broker-Dealers
- Funds & Asset Managers
- Exchanges & Liquidity Venues
- Custodians & Infrastructure Providers
- Market Makers & Prime Desks

## Documents

- [vBTC Hero Doc](/resources/documents/vbtc-hero-doc/)
- [vBTC One Sheet](/resources/documents/vbtc-one-sheet/)
- [vBTC Tech & Flow](/resources/documents/vbtc-flow/)

## Technical

- [vBTC Core](/learn/vbtc-protocol/)
- [vBTC GUI](/wallet/vbtc/)
- [vBTC Integration](/build/vbtc/integration/)
- [vBTC Raw Integration](/build/vbtc/raw-integration/)
- [Bitcoin Integration in VerifiedX Core](/learn/bitcoin-integration/)
- [Institutional Signing (S3C)](/learn/institutional/s3c-signing/)

## Solutions

- [Institutional Overview](/learn/institutional/overview/)
- [Custody Integration](/learn/institutional/custody-integration/)
