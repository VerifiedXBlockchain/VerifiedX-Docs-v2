---
title: "First Launch"
description: What to do the first time you launch VerifiedX Switchblade, and a tour of the dashboard, address switcher, and address management.
sidebar:
  order: 3
---

The VerifiedX Switchblade dashboard is designed for simplicity and efficiency, providing all critical information at a glance. 

When you launch VerifiedX Switchblade for the first time, follow these steps to ensure a smooth start:

1. **Snapshot Import**:
   - When your local block height is more than 5,000 blocks behind the latest network snapshot, the wallet asks “Import Snapshot?”.
   - Click “Import”, confirm that your private keys are backed up with “I'm Backed Up”, and the wallet downloads the snapshot for you. There is no file to select.
   - Your account, key and vault databases are kept, and a copy of them is saved to a `SnapshotBackups` folder in your data folder before any chain data is replaced.
   - This process significantly reduces the time required to sync the blockchain. You can also start it later from **Operations** with **Import Snapshot**.
2. **CLI Restart**:
   - The wallet stops the Command Line Interface (CLI) before the download and starts it again when the snapshot is in place.
   - Let the application complete this process without interruption.
3. **Sync Completion**:
   - Allow the wallet to finish syncing with the blockchain. Depending on your internet connection, this may take several minutes.

For any issues, consult the [troubleshooting section](/wallet/troubleshooting/) or ask the VerifiedX support team on [Discord](https://discord.gg/7cd5ebDQCj).



## Features
- **Balances**: Displays your current holdings in VFX and BTC.
- **Recent Transactions**: Shows a log of your latest activity.
- **Asset Pricing**: Provides real-time prices of supported cryptocurrencies.
- **Quick Actions**:
  - Create new addresses.
  - Transfer funds.
  - Manage tokens.

## Address Context Switcher
The context switcher allows you to quickly toggle between different addresses. You can also view real-time block details with the integrated Spyglass snapshot, which provides:
- Latest block information.
- One-click access to the VerifiedX Network Explorer.

## Creating and Managing Addresses
1. **Creating a New Address**:
   - Click “New Address” on the dashboard.
   - Choose the type of address (“Add VFX Account” or “Add BTC Account”), then “Create”.
2. **Importing a Private Key**:
   - Click “New Address”, choose VFX or BTC, then choose “Import” and paste the private key (a BTC key can also be a WIF key).
   - Confirm the import and ensure the key is stored securely.
3. **Backing Up Addresses**:
   - In **Operations**, click **Backup**, then **Backup Keys**, to export your VFX and BTC private keys and addresses to a text file. Vault account keys are not included in this export.
   - Save private keys using a secure password manager or encrypted file.
