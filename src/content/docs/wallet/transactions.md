---
title: "Transactions"
description: Use the Transactions tab to review your accounts' activity, transaction components, and transaction types.
sidebar:
  order: 5
---

The Transactions tab offers comprehensive tools to manage your accounts' activity:


- **Filter Options**: Filter transactions by type or address.
- **Detailed View**: Inspect transaction details, including timestamps and confirmations.
- **Spyglass Integration**: Open transactions in the network explorer for deeper analysis.

## Transaction Components
- **Hash** - This is created by the wallet once a full TX is prepared. A hash consists of the following pieces of information, hashed twice with SHA-256: `Timestamp + FromAddress + ToAddress + Amount + Fee + Nonce + TransactionType + Data` (plus `UnlockTime` when the transaction has one)
- **ToAddress** - This is the VFX address in which the transaction is being sent to
- **FromAddress** - This is the VFX address in which the transaction is being sent from.
- **Amount** - This is the amount of VFX that is being sent in a transaction
- **Nonce** - This is the transaction counter for a given address. As transactions are sent this counter is increased by 1
- **Fee** - This is the near zero network fee associated with a transaction. The wallet calculates it from the transaction's size, and the network burns it.
- **Timestamp** - This is a unix timestamp in seconds
- **Data** - This is the associated tx data for when a transaction is more than just a basic transfer of VFX (ex: NFTs, ADNRs, etc.). This will be _null_ if performing a basic VFX tx.
- **Signature** - This is an ECDSA Signature where the message is always the Hash of the transaction.
- **Height** - This is the block height a TX is associated with once crafted.
- **TransactionType** - The type of transaction.
- **TransactionStatus** - Pending, Success, Fail. Vault account transactions can also show Vault, Called Back or Recovered.

## Transaction Types

The wallet labels each transaction with one of these types. Some labels add detail from the transaction data, such as the amount and ticker.

- **Tx** - A standard VFX coin transfer
- **Node** - A node related transaction
- **NFT Mint** - A smart contract has been minted into a non-fungible token
- **NFT Transfer**, **NFT Evolution**, **NFT Tx** - A transaction connected to an NFT (transfer, evolve, etc.)
- **NFT Burn** - A transaction burning (destroying) an NFT
- **NFT Sale Start**, **NFT Sale Complete**, **NFT Sale** - A transaction for the sale of an NFT
- **ADNR Create**, **ADNR Transfer**, **ADNR Delete** - A VFX domain transaction
- **BTC ADNR Create**, **BTC ADNR Transfer**, **BTC ADNR Delete** - A BTC domain transaction
- **DST Registration** - A P2P shop (Auction House) registration transaction
- **Topic Create** - A validator voting topic create transaction
- **Topic Vote** - A validator voting topic vote transaction
- **Vault (Register)**, **Vault (Callback)**, **Vault (Recover)** - A vault account transaction (activation, callback, recover)
- **Smart Contract Mint** - A smart contract mint transaction
- **Smart Contract TX** - A smart contract related transaction (evolve)
- **Smart Contract Burn** - A smart contract burn transaction
- **Fungible Token Deploy** - The deployment of a fungible token
- **Fungible Token Mint** - A mint of a non-fixed supply fungible token
- **Fungible Token Transfer** - A transfer of an amount of fungible tokens
- **Fungible Token Burn** - A burn of an amount of fungible tokens
- **Fungible Token Pause**, **Resume**, **Ban Address**, **Ownership Change**, **Topic Created**, **Vote Cast** - A fungible token management or voting transaction (shown as **Fungible Token TX** when no detail is available)
- **vBTC Validator Register**, **vBTC Validator Heartbeat**, **vBTC Validator Exit** - A validator joining, staying in or leaving the vBTC validator set
- **vBTC Contract Mint** - The creation of a vBTC vault contract
- **vBTC Transfer**, **vBTC Bulk Transfer** - A transfer of vBTC, from one vault contract or from several at once
- **vBTC Withdrawal Request**, **vBTC Withdrawal Complete**, **vBTC Withdrawal Cancel**, **vBTC Withdrawal Vote** - The steps of a vBTC withdrawal to Bitcoin
- **vBTC Withdrawal Fee Raise** - The requester pins a pending withdrawal again at a higher Bitcoin fee rate
- **vBTC Withdrawal Release** - The requester gives up a pending withdrawal; once Bitcoin shows the coins back in the vault, the vBTC returns, less that Bitcoin fee
- **vBTC Withdrawal Pin** - Any other pin of a withdrawal's Bitcoin payment
- **Bitcoin Report** - Bitcoin headers and the transactions of one Bitcoin block that touch a vault, recorded on chain with validator signatures
- **Bitcoin Reorg** - Bitcoin reorganized below reported events, so they are taken back and the headers replaced
- **vBTC Vault Rekey** - A vault's key is replaced by a new one made by the current validators
- **VFX Shield**, **VFX Unshield**, **VFX Private Transfer** - A private VFX transaction
- **vBTC Bridge Lock**, **Unlock**, **Pool Unlock**, **Exit to BTC**, **Exit to BTC Complete**, **Exit to BTC Failed** - A vBTC transaction for the Base bridge (vBTC.b)
