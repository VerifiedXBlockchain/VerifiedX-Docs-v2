---
title: "VerifiedX (VFX) Coin Summary"
description: The supply, burn model, utility, and details of VFX, the native coin of the VerifiedX network.
sidebar:
  order: 4
  label: Coinomics
---

The VerifiedX (VFX) coin is the native coin of the VerifiedX network. It pays for every transaction, secures the network through validator bonds, and gives validators their voice in governance.

## Coinomics

- **Total Lifetime Supply**: The total lifetime supply of VFX is capped at 200,000,000 coins. There will never be more than this amount of VFX in circulation.

- **No Validator Rewards**: Validators receive no new coins. Block rewards ended at block 3,074,181, and the supply was completed at 200,000,000 at block 3,074,185. No VFX has been minted since, and consensus refuses any block that pays a reward.

- **Anti-Inflationary Model**: VFX is permanently burned, never collected. Every transaction fee is destroyed, as are the VFX paid to register a domain, open an auction house, register a vault account, or create a governance proposal. Once burned, coins are removed from the circulating supply for good.

- **Sustainable Model**: No new issuance, combined with continuous burning, makes VFX a fixed and deflationary supply that supports long-term value retention.

## Coin Utility

- **Transactions**: VFX is required to transact on the VerifiedX network. Every transaction, including vBTC, token and NFT transactions, pays its network fee in VFX.

- **Becoming a Validator**: Running a validator requires 5,000 VFX, bonded to the validator address. The bond cannot be spent while the validator is registered and unlocks 1,200 blocks after the validator's exit transaction is mined. A validator takes part in vBTC key ceremonies and Bitcoin report signing once its bond has been in place for 14,400 blocks (about two days). See [Run a Validator](/node/validator/).

- **Proposing and Voting**: On-chain governance is open to validators. A proposal (topic) is created from a validator address that holds at least 5,000 VFX and costs 10 VFX, which is burned. Validators vote on proposals, one vote per validator, and a vote costs only the network fee. Voting periods are 30, 60, 90 or 180 days.

- **Utility Fees**: VFX pays the network's utility fees, all of which are burned:

| Action | Cost |
|---|---|
| Domain name (`.vfx` or `.btc`): create, transfer or delete | 5 VFX |
| Auction house: create / update / delete | 10 / 1 / 1 VFX |
| Vault (reserve) account registration | 4 VFX |
| Governance proposal | 10 VFX |
| Vote | network fee only |

- **Fees**: VFX is the only coin used for fees on the VerifiedX network. The network fee is 0.00002 VFX per KB of transaction, with a minimum of 0.000003 VFX. Bitcoin-side fees for vBTC withdrawals are paid in BTC.

- **Gasless**: VerifiedX smart contracts do not run on an EVM and do not need gas. They have built-in recursion protection, so execution costs no gas fees.

## Coin Details

- VFX is capped at 200,000,000.
- Near zero transaction fees, all of them burned.
- Is a native coin and not built on another network.
- Generally only uses 8 decimals.
- Is recoverable through vault accounts.
