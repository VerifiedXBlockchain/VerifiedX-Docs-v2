---
title: "HD Accounts"
description: Create and recover hierarchical deterministic (HD) accounts that generate multiple addresses from one recovery phrase.
sidebar:
  order: 6
---

## Overview
Hierarchical Deterministic (HD) accounts generate multiple addresses from a single recovery phrase.

## Creating an HD Account
1. **Generate Recovery Phrase**:
   - In **Operations**, under **Account Security**, click **Create HD Account**.
   - Choose between a 12-word or 24-word phrase (“12 Words” or “24 Words”).
   - An HD account cannot be created while the wallet is encrypted.
   - Securely store the phrase as it’s essential for recovery.
2. **New Address Generation**:
   - Each new address is derived from the recovery phrase.
   - Keys created before the HD account are not recoverable from the phrase, so back them up separately.

## Recovery
- On a wallet with no accounts yet, click **Restore HD Account** in **Operations** and enter the recovery phrase.
- Recreate previously generated addresses as needed.
- In the [web wallet](/wallet/web-wallet/), sign in with **Mnemonic (HD account)** to restore from the phrase.
