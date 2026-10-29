---
title: "Validating"
description: What you need to become a VerifiedX validator from the wallet, and what validators do.
sidebar:
  order: 13
---

To become a validator on the VerifiedX network, you'll need:

- **5,000 VFX, bonded.** While your address is a registered validator, 5,000 VFX on it cannot be sent. Anything above 5,000 stays spendable. When you stop validating, the wallet sends a validator exit transaction, and the 5,000 VFX unlocks 1,200 blocks (about four hours) after the exit is mined. There are no fees and no penalties. Hold 5,001 VFX so a transaction fee never takes you below 5,000.
- **A machine meeting the standard specs, with a static public IP address.**
- **Open ports:** `3338`, `3339`, `7294` and `7295` (testnet: `13338`, `13339`, `17294` and `17295`). The wallet checks `3339`, `7294` and `7295` from the outside before it starts validating and keeps checking them; if they stay unreachable for about 90 seconds, validating stops (without an exit, so the 5,000 VFX stays bonded) until you start it again.
- **Outbound access to the Bitcoin network** (port `8333`), because validators follow Bitcoin for vBTC.

Validators receive no block rewards. They secure the network, and from Core 9.0 they also follow Bitcoin, sign the reports that record vBTC vault deposits and spends, and take part in vBTC key ceremonies and withdrawal signing once their bond has been in place for about two days. See [Run a Validator](/node/validator/) for the full picture.

Each validator you run grants you one vote on network proposals, changes, and enhancements, creating a truly decentralized governing body with a one CPU one vote methodology, where validators collectively shape the future of the network. This is all accomplished with real-time ‘one-click’ actions and visuals in the wallets.
