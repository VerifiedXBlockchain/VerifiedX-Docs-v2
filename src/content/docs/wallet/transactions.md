---
title: "Transactions"
description: Use the Transactions tab to review your accounts' activity, transaction components, and transaction types.
sidebar:
  order: 5
---

The Transactions tab offers comprehensive tools to manage your accounts' activity:


- **Filter Options**: Sort transactions by type, address, or status.
- **Detailed View**: Inspect transaction details, including timestamps and confirmations.
- **Spyglass Integration**: Open transactions in the network explorer for deeper analysis.

## Transaction Components
- **Hash** - This is created by the wallet once a full TX is prepared. A hash consist of the follow pieces of information: `Timestamp + FromAddress + ToAddress + Amount + Fee + Nonce + TransactionType + Data`
- **ToAddress** - This is the VFX address in which the transaction is being sent to
- **FromAddress** - This is the VFX address in which the transaction is being sent from.
- **Amount** - This is the amount of VFX that is being sent in a transaction
- **Nonce** - This is the transaction counter for a given address. As transactions are sent this counter is increased by 1
- **Fee** - This is the near zero atomic fee that is associated with a transaction and is calculated through the wallet.
- **Timestamp** - This is a unix timestamp in seconds
- **Data** - This is the associated tx data for when a transaction is more than just a basic transfer of VFX (ex: NFTs, ADNRs, etc.). This will be _null_ if performing a basic VFX tx.
- **Signature** - This is an ECDSA Signature where the message is always the Hash of the transaction.
- **Height** - This is the block height a TX is associated with once crafted.
- **TransactionType** - The type of transaction.
- **TransactionStatus** - Pending, Success, Fail

## Transaction Types

- **TX** - A standard VFX coin transfer
- **NFT Mint** - A smart contract has been minted into a non-fungible token
- **NFT Tx** - A transaction connected to an NFT (transfer, evolve, etc.)
- **NFT Burn** - A transaction burning (destroying) and NFT
- **NFT Sale** - A transaction for the sale of an NFT
- **ADNR** - A domain related transaction
- **DST Registration** - A p2p shop registration transaction
- **Topic Create** - A validating voting topic create transaction
- **Topic Vote** - A validator voting topic vote transaction
- **Vault TX** - A vault related transaction (activation, callback, recover, etc.)
- **Smart Contract Mint** - A smart contract mint transaction
- **Smart Contract TX** - A smart contract related transaction (evolve)
- **Smart Contract Burn** - A smart contract burn transaction
- **Fungible Token Mint** - A mint of a non-fixed supply fungible token
- **Fungible Token TX** - A fungible token related transaction (transfer, vote, etc.)
- **Fungible Token Burn** - A transfer of an amount of fungible tokens.
- **Tokenization Mint** - The creation of a vBTC token
- **Tokenization TX** - A vBTC token related transaction (ie. transfer funds)
- **Tokenization Withdrawl** - A withdrawl transaction of vBTC
