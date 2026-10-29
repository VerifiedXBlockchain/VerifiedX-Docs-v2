---
title: "vBTC"
description: Create vBTC V2 vaults, deposit, transfer, withdraw to Bitcoin and bridge to Base through the node's API when the node's wallet holds the keys.
sidebar:
  label: Integration
  order: 1
  attrs:
    class: sidebar-btc
---

This page covers vBTC V2 through the node's API when the node's wallet holds the keys: the node builds, signs and broadcasts each transaction for you. If your keys stay outside the node (a web wallet, an exchange signer, an HSM), see [vBTC Raw Integration](/build/vbtc/raw-integration/), which uses the same vaults and the same rules.

It describes Core 9.0. For the full list of routes in the node, see [CLI API Details](/build/node-api/details/#15-vbtc-v2-api-90-additions).

## Concepts

- **Vault.** A vBTC V2 smart contract. Each vault has its own Bitcoin Taproot deposit address, whose key is held in shares by a set of VerifiedX validators (FROST threshold signing). Nobody holds the whole key.
- **Owner.** The VFX address that owns the vault. Bitcoin deposited to the vault's address is credited to the owner as vBTC.
- **Holder.** Any VFX address with a vBTC balance on a vault. The owner can transfer vBTC to holders, and holders can transfer it on. Any holder, not only the owner, can withdraw its own balance to Bitcoin.
- **vBTC amounts** are in BTC with at most 8 decimal places. 1 vBTC is backed by 1 BTC held in the vault.

### Watched and legacy vaults

Core 9.0 puts each vault's Bitcoin into consensus. From the **Bitcoin attestation recording height**, validators report every Bitcoin block's vault transactions to the chain (transaction type 43), and a vault created from that height on is **watched**:

- The owner's balance is the vault's Bitcoin as the chain records it, not what a Bitcoin server says.
- A withdrawal is paid by a Bitcoin transaction the chain fixes ("pins") when the request is mined. The vault's signers sign exactly that transaction and broadcast it on their own, and the withdrawal completes when Bitcoin confirms it.
- **There is no completion transaction and no cancellation vote.** The node refuses a type 28 completion and a type 30 vote for a watched vault. Nothing has to be sent after the request.
- While a withdrawal is waiting for its Bitcoin transaction, its requester can cancel it at once (type 29). Once it is pinned, the requester can raise its fee or release it (type 44).

A vault created before the recording height is **legacy**. It keeps the earlier way of working (a completion transaction and a cancellation vote) until the **enforcement height**, and is frozen from then on. See [Legacy vaults](#legacy-vaults).

Every route that describes a vault says which kind it is: `Attested` (watched), `Legacy`, `FreezeHeight` and `Frozen`.

### Networks and heights

| | Mainnet | Testnet |
| --- | --- | --- |
| Node API | `http://localhost:7292` | `http://localhost:17292` (start the node with `testnet`) |
| Bitcoin network | Bitcoin mainnet | The VerifiedX signet, a private Bitcoin signet: explorer `https://signet.verifiedx.io`, Esplora API `https://signet.verifiedx.io/api`, 10-minute blocks, `tb1…` addresses. Test BTC from the [testnet faucet](https://spyglass-testnet.verifiedx.io/faucet) (Signet BTC tab) |
| Bitcoin confirmations before a vault event counts | 6 blocks on top of the block that holds it | 3 blocks on top |
| Attestation recording height (vaults created from here are watched) | 7,568,350 | 400 |
| Attestation enforcement height (legacy vaults frozen) | 7,658,350 (recording height + 90,000, about 12 days) | 401 |

The testnet restarted from genesis on 22 October 2026 when it moved to the VerifiedX signet, so every testnet vault is watched. `GET /vbtcapi/VBTC/GetBitcoinAttestationStatus` returns the heights a node is running with (see [Attestation status](#attestation-status)).

If the node was started with `apitoken=...`, send the token in the `apitoken` header on every call.

### Lifecycle on a watched vault

1. **Create.** The owner starts a key ceremony (MPC, FROST distributed key generation) among the validators, then creates the vault with its result (type 25). The deposit address is usable once the creation transaction is in a block.
2. **Deposit.** Anyone sends Bitcoin to the deposit address. When the Bitcoin transaction is buried under 6 blocks (3 on testnet), the validators report it and the owner's vBTC balance rises in that VFX block.
3. **Transfer.** The owner or a holder sends vBTC to any VFX address (type 26), from one vault or from several in one transaction.
4. **Ownership.** The owner can hand the vault to another address. The new owner gets the vault's vBTC that no holder holds.
5. **Withdrawal request.** A holder asks for an amount to a Bitcoin address at a fee rate (type 27). The vBTC is debited when the request is mined.
6. **Pin.** In the same block, the chain works out the Bitcoin transaction that pays it, from the vault's coins, and holds those coins for it. If the vault's free coins cannot pay it yet, it waits and is tried again whenever the vault's coins change.
7. **Signing.** The vault's signers sign the pinned transaction and broadcast it, typically within a few minutes.
8. **Close.** The withdrawal completes when Bitcoin shows the pinned transaction buried as deep as a deposit. If it is not confirming, the requester can raise the fee or release it (type 44). While it is still waiting for its transaction, the requester can cancel it (type 29).

## Transaction types

| Type | Name | Sent by | Explorer label |
| --- | --- | --- | --- |
| 25 | `VBTC_V2_CONTRACT_CREATE` | Owner | vBTC V2 Mint |
| 26 | `VBTC_V2_TRANSFER` | Owner or holder | vBTC V2 Transfer |
| 27 | `VBTC_V2_WITHDRAWAL_REQUEST` | Requester | vBTC V2 Withdrawal Request |
| 28 | `VBTC_V2_WITHDRAWAL_COMPLETE` | Legacy vaults only, until the enforcement height | vBTC V2 Withdrawal Complete |
| 29 | `VBTC_V2_WITHDRAWAL_CANCEL` | Requester | vBTC V2 Withdrawal Cancel |
| 30 | `VBTC_V2_WITHDRAWAL_VOTE` | Validators, legacy vaults only, until the enforcement height | vBTC V2 Withdrawal Vote |
| 43 | `VBTC_V2_BTC_REPORT` | Validators (no sender) | Bitcoin Report |
| 44 | `VBTC_V2_COIN_PIN` | Requester | vBTC Withdrawal Fee Raise (data `Function` `VBTCWithdrawalFeeBump()`) or vBTC Withdrawal Release (`VBTCWithdrawalRelease()`); vBTC Withdrawal Pin when the data can't be read |
| 45 | `VBTC_V2_BTC_REORG` | Validators (no sender) | Bitcoin Reorg |
| 46 | `VBTC_V2_VAULT_REKEY` | Validators (no sender) | vBTC Vault Rekey |

The VerifiedX wallets use the same labels for types 43 to 46, and label a type 27 vBTC Withdrawal Request.

Types 43, 45 and 46 have `From` and `To` set to `BTC_Attestation`, no amount and no fee; their authority is the validator signatures inside their data. A type 43 report carries Bitcoin headers and the vault transactions of reported Bitcoin blocks. A type 45 takes back reported events after a Bitcoin reorganisation. A type 46 moves a vault to a new key made by the current validators when too many holders of its old key have left; the vault's coins are then moved to the new key by transactions the chain fixes and the old key's holders sign (shown as a `Sweep` in the vault's withdrawals). The full list of types is in [Transaction Creation](/build/node-api/transaction-creation/).

## API status

```
GET /vbtcapi/VBTC
```

Returns `["VFX/vBTC-V2", "vBTC API V2 - MPC Based"]`.

## Creating a vault

### 1. Start the key ceremony

```
POST /vbtcapi/VBTC/InitiateMPCCeremony/{ownerAddress}
```

`ownerAddress` must be an account in this node's wallet. The ceremony runs in the background among the reachable validators that are eligible (registered, holding their 5,000 VFX bond for long enough). At least three must be reachable. An owner can have one ceremony running at a time, and a node runs at most 100 at once.

```json
{
  "Success": true,
  "Message": "MPC ceremony initiated successfully. Use GetCeremonyStatus to check progress.",
  "CeremonyId": "<32 hex>:<unix time>",
  "Status": "Initiated",
  "InitiatedTimestamp": 1792763000
}
```

Errors: `You already have an active MPC ceremony in progress. Complete or cancel it before starting a new one.`, `Maximum concurrent ceremony limit reached (100). Please try again later.`, and on a node configured for S3C with an invalid pool, `S3C configuration is present but invalid; refusing to mint. Fix the S3C= config and restart.`

### 2. Follow the ceremony

```
GET /vbtcapi/VBTC/GetCeremonyStatus/{ceremonyId}
```

`Status` moves through `Initiated`, `ValidatingValidators`, `Round1InProgress`, `Round2InProgress`, `Round3InProgress` to `Completed`, or ends in `Failed` or `TimedOut` with `ErrorMessage`. A ceremony left for an hour times out. A validator that fails a ceremony is dropped and the ceremony runs again without it, as long as enough remain (`DroppedValidators`).

```json
{
  "Success": true,
  "CeremonyId": "<ceremony id>",
  "Status": "Completed",
  "OwnerAddress": "<owner>",
  "ProgressPercentage": 100,
  "CurrentRound": 3,
  "ErrorMessage": null,
  "DepositAddress": null,
  "FrostGroupPublicKey": "03…",
  "DKGProof": "…",
  "ValidatorCount": 13,
  "RequiredThreshold": 51,
  "ProofBlockHeight": 2839,
  "ContractUID": "<contract UID>",
  "DroppedValidators": null
}
```

`DepositAddress` is always `null` here: the address is served only once the vault is on chain (step 4). Typical failures: `Insufficient reachable validators for DKG ceremony. Only N of M registered validators are online on FROST port (minimum 3 required).` and `Only N validator(s) are reachable; a vBTC V2 contract needs a key ceremony with at least K of the M eligible validators, so its creation would be refused. Try again when more validators are online.`

To abandon a ceremony:

```
POST /vbtcapi/VBTC/CancelCeremony/{ceremonyId}/{ownerAddress}
```

### 3. Create the vault

```
POST /vbtcapi/VBTC/CreateVBTCContract
```

```json
{
  "OwnerAddress": "<owner>",
  "CeremonyId": "<ceremony id>",
  "Name": "Treasury vault",
  "Description": "optional",
  "Ticker": "optional, default vBTC",
  "ImageBase": null,
  "LinkedContractUID": null
}
```

The node writes the contract, signs the creation (type 25) with the owner's key and broadcasts it. `ImageBase` is ignored while the network uses the default vBTC image.

```json
{
  "Success": true,
  "Message": "vBTC V2 contract created and published to blockchain successfully",
  "SmartContractUID": "<contract UID>",
  "TransactionHash": "<VFX hash>",
  "CeremonyId": "<ceremony id>",
  "DepositAddress": "bc1p…",
  "DepositAddressConfirmed": false,
  "FrostGroupPublicKey": "03…",
  "DKGProof": "…",
  "ValidatorCount": 13,
  "ProofBlockHeight": 2839,
  "RequiredThreshold": 51
}
```

Errors: `Ceremony is not complete. Current status: …`, `Owner address does not match the ceremony owner address.`, `Ceremony not found. Please initiate a new ceremony with InitiateMPCCeremony.` and `Failed to create or broadcast smart contract transaction` (the contract was refused; nothing was created).

### 4. Get the deposit address

```
GET /vbtcapi/VBTC/GetMPCDepositAddress/{scUID}
```

:::caution[Do not deposit before this route returns the address]
`DepositAddressConfirmed: false` in step 3 means the creation is not in a block yet. Bitcoin sent to the address of a contract that never reaches the chain has no vault and no way to withdraw it. Any node answers this route once the contract is on chain.
:::

```json
{
  "Success": true,
  "Message": "Deposit address retrieved",
  "SmartContractUID": "<contract UID>",
  "Attested": true,
  "Legacy": false,
  "Frozen": false,
  "Note": null,
  "DepositAddress": "bc1p…",
  "FrostGroupPublicKey": "03…",
  "RequiredThreshold": 51,
  "DKGProof": "…"
}
```

Before the contract is in a block: `The contract is not confirmed on chain yet. Do not deposit until it is; try again after its creation transaction is in a block.` For a frozen legacy vault the message is `Deposit address retrieved. DO NOT DEPOSIT: this vault is frozen and Bitcoin sent to it is not credited.` If a watched vault has been moved to a new key (type 46), this route returns the current key's address.

## Depositing

Send Bitcoin to the deposit address from any wallet. On a watched vault:

- A deposit counts once its Bitcoin block has 6 blocks on top of it (3 on testnet) and the validators have reported it. Validators report as soon as a vault event is that deep, so the credit normally appears one VFX block after the burying Bitcoin block.
- The owner's balance rises by the deposited amount in that VFX block. `GetVaultBitcoin` shows the new coin.
- A coinbase output counts but can't be spent for 100 Bitcoin blocks.
- An output sent to the address of a vault the chain has moved to a new key is still credited while that key's holders sign; deposit to the address `GetMPCDepositAddress` returns.

## Reading balances and vaults

These read routes answer from chain state, so any node gives the same answer for any address or vault, whether or not its wallet holds the keys.

### Balance on one vault

```
GET /vbtcapi/VBTC/GetVBTCBalance/{address}/{scUID}
```

```json
{
  "Success": true,
  "Attested": true,
  "Legacy": false,
  "FreezeHeight": null,
  "Frozen": false,
  "VaultNote": null,
  "Address": "<address>",
  "SmartContractUID": "<contract UID>",
  "Balance": 0.00007,
  "DepositAddressBalance": 0.0001,
  "DepositBalanceStale": false,
  "LedgerBalance": -0.00003,
  "AvailableBalance": 0.00007,
  "PendingWithdrawals": 0,
  "PendingReserveSends": 0,
  "EscrowedWithdrawalAmount": 0.00002,
  "ExpiredEscrowAmount": 0,
  "EscrowedWithdrawals": [ { "RequestHash": "…", "Amount": 0.00002, "Attested": true, "AttestedState": "Pinned", "BitcoinTxid": "…", "ExpiresAtHeight": null } ],
  "IsOwner": true,
  "TransactionCount": 3
}
```

- For the owner, `Balance` is the vault's Bitcoin (`DepositAddressBalance`; on a watched vault, as the chain records it) plus `LedgerBalance` (negative for vBTC it has sent to holders). For a holder, `Balance` is `LedgerBalance`.
- An open withdrawal's amount is already out of `Balance`: it is debited when the request is mined and listed under `EscrowedWithdrawals`.
- `AvailableBalance` also subtracts reserve sends still in their 24-hour window.

### Balances on every vault

```
GET /vbtcapi/VBTC/GetAllVBTCBalances/{address}
```

Returns `TotalBalance`, `ContractCount` and `Contracts`: one entry per vault the address owns or holds vBTC on, with the fields above plus `DepositAddress` and `WithdrawalStatus`.

### Vault details, list and health

```
GET /vbtcapi/VBTC/GetContractDetails/{scUID}
GET /vbtcapi/VBTC/GetContractList/{ownerAddress?}
GET /vbtcapi/VBTC/GetContractHealth/{scUID}
```

`GetContractDetails` returns `Vault` (the kind), `Bitcoin` (as `GetVaultBitcoin`) and `Contract`. `GetContractList` lists every vault, or those an address owns, with its kind, deposit address and balance. `GetContractHealth` reports how many of the vault's original key holders are active validators (`HealthStatus` `Excellent`, `Healthy`, `Degraded`, `Critical` or `Offline`).

### A watched vault's Bitcoin

```
GET /vbtcapi/VBTC/GetVaultBitcoin/{scUID}
```

The vault's Bitcoin as consensus holds it: deposit script, every unspent coin and which withdrawal holds it, totals, keys, and open withdrawals.

```json
{
  "Success": true,
  "Message": "Vault Bitcoin retrieved",
  "SmartContractUID": "<contract UID>",
  "Vault": { "Attested": true, "Legacy": false, "FreezeHeight": null, "Frozen": false, "Note": null },
  "Bitcoin": {
    "DepositAddress": "bc1p…",
    "DepositScriptHex": "5120…",
    "BitcoinTipHeight": 2195,
    "EventsThroughBitcoinHeight": 2192,
    "ConfirmationsRequired": 6,
    "HeldBtc": 0.00007,
    "HeldSats": 7000,
    "UnspentSats": 7000,
    "PinnedSats": 0,
    "ReleaseFeesSats": 308,
    "SweepFeesSats": 0,
    "Keys": [ { "Generation": 0, "DepositAddress": "bc1p…", "Holders": 13, "MinSigners": 7, "Current": true, "RekeyDue": false } ],
    "CanSign": true,
    "Coins": [ { "Outpoint": "<txid>:1", "ValueSats": 7000, "Status": "Unspent", "HeldFor": null } ],
    "OrphanedCoins": [],
    "OpenWithdrawals": []
  }
}
```

For a legacy vault, `Success` is `false`, `Bitcoin` is `null` and `Message` explains; `Vault` is still filled in.

### Attestation status

```
GET /vbtcapi/VBTC/GetBitcoinAttestationStatus
```

```json
{
  "Success": true,
  "Attestation": {
    "Network": "testnet",
    "VfxHeight": 4217,
    "ObserveHeight": 300,
    "RecordHeight": 400,
    "EnforceHeight": 401,
    "Recording": true,
    "Enforced": true,
    "Started": true,
    "BitcoinCheckpointHeight": 2016,
    "BitcoinTipHeight": 2195,
    "EventsThroughBitcoinHeight": 2192,
    "ConfirmationsRequired": 3,
    "SignerEpoch": 5,
    "Signers": 13,
    "SignaturesRequired": 9,
    "OpenWithdrawals": 0
  }
}
```

A height that is not set yet is `null`. `BitcoinTipHeight` moves only when a report is mined: validators report when a vault event is deep enough, or once after 144 Bitcoin blocks with none, so an attested tip that stands still while nothing happens to any vault is normal. The signer set changes every 600 VFX blocks (`SignerEpoch`) and a report needs two thirds of it, at least three.

## Transferring vBTC

### From one vault

```
POST /vbtcapi/VBTC/TransferVBTC
```

```json
{
  "SmartContractUID": "<contract UID>",
  "FromAddress": "<sender in this wallet>",
  "ToAddress": "<recipient>",
  "Amount": 0.00003
}
```

```json
{
  "Success": true,
  "Message": "vBTC V2 transfer transaction created and broadcast successfully",
  "TransactionHash": "<VFX hash>",
  "From": "<sender>",
  "To": "<recipient>",
  "Amount": 0.00003,
  "SmartContractUID": "<contract UID>"
}
```

Errors: `Amount must be greater than zero`, `Insufficient balance. Available: …, Requested: …`, `Account not found: …` (the sender is not in this wallet), and for a frozen vault `Vault … was created before Bitcoin attestation and has been frozen since block …. Its vBTC can no longer be transferred, withdrawn or bridged.` A reserve (`xRBX`) sender's transfer is held for 24 hours and can be called back until then; it cannot go to another reserve address.

### From several vaults at once

```
POST /vbtcapi/VBTC/TransferVBTCMulti
```

```json
{
  "FromAddress": "<sender in this wallet>",
  "ToAddress": "<recipient>",
  "TotalAmount": 0.00012
}
```

The node splits `TotalAmount` across the vaults the sender holds vBTC on and sends one type 26 transaction (one nonce, one fee) with up to 25 vaults. The answer lists `Allocations` (`SmartContractUID`, `Amount`). Reserve senders can't use it: `Reserve accounts cannot use multi-contract vBTC transfers. Send from a single contract instead.`

## Transferring ownership

```
GET /vbtcapi/VBTC/TransferOwnership/{scUID}/{toAddress}
```

Signed by the current owner's account on this node. It moves the vault to `toAddress` with a smart-contract transfer (type 18, `Transfer()`). The owner's figure on a vault is its Bitcoin less what other addresses hold, so the new owner takes over the vBTC no holder holds; vBTC already sent to holders stays theirs. A reserve owner's transfer takes effect after the reserve's unlock delay and can only go to a normal VFX address.

```json
{ "Success": true, "Message": "vBTC V2 Contract Transfer has been started." }
```

## Withdrawing to Bitcoin

### Request a withdrawal

```
POST /vbtcapi/VBTC/RequestWithdrawal
```

```json
{
  "SmartContractUID": "<contract UID>",
  "RequestorAddress": "<holder in this wallet>",
  "BTCAddress": "bc1q…",
  "Amount": 0.00002,
  "FeeRate": 3
}
```

- `FeeRate` is a whole number of sat/vB, from 1 to 5,000.
- The Bitcoin fee comes out of `Amount`: the destination receives `Amount` less the fee. The fee is the rate times the transaction's size: 154 vB with one input, 212 vB with two, and about 57.5 vB more for each further input the vault's coins need.
- After the smallest fee (154 vB at your rate), at least 546 sats must be left to pay. So the smallest withdrawal is `154 × FeeRate + 546` sats: 1,008 sats at 3 sat/vB.
- `BTCAddress` must be an address on the chain's Bitcoin network, with nothing around it, and can't be the vault's own deposit address.
- A holder can have several withdrawals open at once, on one vault or many; each is debited when its request is mined.

```json
{
  "Success": true,
  "Message": "vBTC V2 withdrawal request created successfully. Nothing more is needed: when it is mined its Bitcoin transaction is fixed by the chain, the vault's signers sign and broadcast it, and it completes when Bitcoin confirms it. Follow it with GetWithdrawalPin.",
  "RequestHash": "<VFX hash>",
  "SmartContractUID": "<contract UID>",
  "Amount": 0.00002,
  "Destination": "bc1q…",
  "FeeRate": 3,
  "Status": "Requested",
  "Attested": true,
  "CompleteWithdrawalNeeded": false
}
```

`RequestHash` identifies the withdrawal in every other route. `CompleteWithdrawalNeeded` is `true` only for a legacy vault.

### Follow a withdrawal

```
GET /vbtcapi/VBTC/GetWithdrawalPin/{scUID}/{withdrawalRequestHash}
```

Answered from chain state by any node. A withdrawal moves through these states:

| `State` | Meaning | What the requester can do |
| --- | --- | --- |
| `Waiting` | Mined, but the vault's free coins can't pay it yet (`WaitingFor` says why). Tried again whenever the vault's coins change | Cancel |
| `Pinned` | Its Bitcoin transaction is fixed and its coins are held for it. The signers sign and broadcast it | Raise the fee, or release |
| `Settled` | Bitcoin shows its transaction, buried: paid | |
| `Cancelled` | Cancelled by its requester while waiting; vBTC refunded | |
| `Expired` | Not pinned by its `ExpiresAtVfxHeight`: 360 VFX blocks after its request, or later while it waits to take over coins held by a withdrawal paying a lower fee rate; vBTC refunded | |
| `Void` | A coin it held was spent by another transaction, so it can never confirm; vBTC refunded | |
| `Released` | Its coins went back to the vault at the requester's wish; vBTC refunded less that transaction's Bitcoin fee | |

```json
{
  "Success": true,
  "Attested": true,
  "Message": "Withdrawal retrieved",
  "Withdrawal": {
    "SmartContractUID": "<contract UID>",
    "RequestHash": "<request hash>",
    "Kind": "Withdrawal",
    "Requester": "<requester>",
    "State": "Pinned",
    "Summary": "This withdrawal is paid by Bitcoin transaction c314d462…, fixed by the chain. The vault's signers sign and broadcast it on their own, and it completes when Bitcoin has confirmed it 6 times. Nothing needs to be done. If it is not confirming, its requester can raise the fee, or give the withdrawal up and have the vBTC back (a release).",
    "Amount": 0.00002,
    "AmountSats": 2000,
    "FeeRate": 3,
    "RequestVfxHeight": 2990,
    "ExpiresAtVfxHeight": null,
    "WaitingFor": null,
    "ClosedBecause": null,
    "BitcoinTxid": "c314d462…",
    "SettledTxid": null,
    "ClosedAtVfxHeight": null,
    "CanCancel": false,
    "CanRaiseFee": true,
    "CanRelease": true,
    "Releasing": false,
    "CoinsCanBeTakenFromVfxHeight": 5150,
    "Transactions": [
      {
        "Txid": "c314d462…",
        "Kind": "Payment",
        "FeeRate": 3,
        "FeeSats": 462,
        "DestinationSats": 1538,
        "ChangeSats": 8000,
        "Inputs": [ "<txid>:0" ],
        "PinnedAtVfxHeight": 2990,
        "Superseded": false,
        "Dead": false,
        "Confirmed": false,
        "UnsignedTxHex": "0200…"
      }
    ]
  }
}
```

- The pin is in the node's answer from the block that mines the request. The explorer API learns it later, so follow withdrawals through the node.
- `BitcoinTxid` is the newest live transaction; `SettledTxid` the one that paid. `Transactions` lists every transaction pinned for the withdrawal, oldest first. They spend the same coins, so at most one can ever confirm.
- `CoinsCanBeTakenFromVfxHeight`: if the withdrawal has not confirmed by this block (2,160 VFX blocks, about 7.2 hours, after its first Bitcoin transaction was pinned; a fee raise restarts the count only if it at least doubles the fee rate, and a release never does), another withdrawal of the vault paying a higher fee rate may be pinned on its coins. If that one confirms, this withdrawal is closed as `Void` and refunded.
- A request not mined yet, or a hash that isn't on this vault: `"Success": false, "Attested": true, "Withdrawal": null, "Message": "No such withdrawal request is recorded on this vault. If it was just sent, it has not been mined yet."` Ask again after the next block.
- A legacy vault: `"Success": false, "Attested": false` with `Vault` and `This vault is not one the chain watches (it was created before Bitcoin attestation). Its withdrawals are completed with CompleteWithdrawal.`

`GET /vbtcapi/VBTC/GetWithdrawalStatus/{scUID}` lists every open withdrawal of a vault (under `Bitcoin.OpenWithdrawals`), and `GET /vbtcapi/VBTC/GetWithdrawalHistory/{scUID}` lists paid withdrawals (`WithdrawalHistory`) and those closed without payment (`Refunded`).

### Cancel a waiting withdrawal

```
POST /vbtcapi/VBTC/CancelWithdrawal
```

```json
{
  "SmartContractUID": "<contract UID>",
  "OwnerAddress": "<the requester, in this wallet>",
  "WithdrawalRequestHash": "<request hash>"
}
```

`OwnerAddress` is the address that requested the withdrawal (the name predates withdrawals by holders). The node signs a type 29 cancel with that account. On a watched vault there is no vote: when the cancel is mined the withdrawal closes as `Cancelled` and the vBTC is back at once.

```json
{
  "Success": true,
  "Attested": true,
  "Message": "Cancel transaction broadcast. When it is mined the withdrawal is closed and its vBTC returned at once; no vote is held.",
  "CancelTxHash": "<VFX hash>"
}
```

Only a `Waiting` withdrawal can be cancelled (`CanCancel: true`). Once it is pinned: `This withdrawal's Bitcoin transaction is fixed and may already be signed, so it cannot be cancelled. It completes when Bitcoin confirms it.` Raise the fee or release it instead. Other errors: `Only the requester can cancel a withdrawal.` and, when this node does not hold the requester's key, `This node does not hold the key for …, so it cannot sign the cancel. Build it with GetRawCancelWithdrawalTxData, sign the hash, and submit it with SendRawCancelWithdrawalTx.`

### Raise the fee of a pinned withdrawal

```
POST /vbtcapi/VBTC/BumpWithdrawalFee
```

```json
{
  "SmartContractUID": "<contract UID>",
  "RequestorAddress": "<the requester, in this wallet>",
  "WithdrawalRequestHash": "<request hash>",
  "FeeRate": 8
}
```

The node signs a type 44 transaction (`VBTCWithdrawalFeeBump()`) with the requester's account. When it is mined, the chain pins a replacement that spends the same coins at the new rate. The higher fee comes out of the withdrawal's own amount, so the destination receives less; the vault and its owner pay nothing. Whichever of the withdrawal's transactions Bitcoin confirms completes it.

```json
{
  "Success": true,
  "Message": "Fee bump transaction broadcast. When it is mined the replacement Bitcoin transaction is fixed and the vault's signers sign it. Follow it with GetWithdrawalPin.",
  "FeeBumpTxHash": "<VFX hash>",
  "Release": false,
  "SmartContractUID": "<contract UID>",
  "WithdrawalRequestHash": "<request hash>",
  "FeeRate": 8
}
```

Rules: `FeeRate` must be above the rate the newest transaction pays, and at most 5,000. A withdrawal can have up to 8 payment transactions pinned, and none is raised once a release is pending. The original stays valid: if it confirms before the replacement reaches Bitcoin, the withdrawal is paid by it, and the raise has no effect. Signers broadcast a new pin a few minutes after it is fixed, so with 10-minute Bitcoin blocks this happens.

### Release a pinned withdrawal

```
POST /vbtcapi/VBTC/ReleaseWithdrawal
```

Same body as `BumpWithdrawalFee`. The node signs a type 44 transaction (`VBTCWithdrawalRelease()`). When it is mined, the chain pins a Bitcoin transaction that sends the withdrawal's coins back to the vault. When Bitcoin shows it buried, the withdrawal closes as `Released` and the vBTC is refunded to the requester, less that transaction's Bitcoin fee; the requester can then withdraw again. If one of the withdrawal's payments confirms first, it is paid as usual.

```json
{
  "Success": true,
  "Message": "Release transaction broadcast. When it is mined the Bitcoin transaction that returns the withdrawal's coins to the vault is fixed and the vault's signers sign it; the vBTC is refunded, less its Bitcoin fee, when Bitcoin has confirmed it. Follow it with GetWithdrawalPin.",
  "FeeBumpTxHash": "<VFX hash>",
  "Release": true,
  "SmartContractUID": "<contract UID>",
  "WithdrawalRequestHash": "<request hash>",
  "FeeRate": 6
}
```

Rules: `FeeRate` must be above the rate the newest transaction pays, the release's total fee must be at least the newest transaction's fee plus 1 sat for each vB of the release (what Bitcoin requires to replace a transaction), and the fee can't exceed the withdrawal's amount. A withdrawal can have up to 4 release transactions.

### What the completion route returns on a watched vault

```
POST /vbtcapi/VBTC/CompleteWithdrawal
```

```json
{ "SmartContractUID": "<contract UID>", "WithdrawalRequestHash": "<request hash>" }
```

On a watched vault this route signs and sends nothing: it says where the withdrawal stands. A caller that used to poll it can keep doing so.

```json
{
  "Success": true,
  "Paid": false,
  "Attested": true,
  "Message": "[AWAITING-BTC-CONFIRMATION] This withdrawal is paid by Bitcoin transaction c314d462…, fixed by the chain. …",
  "Status": "Awaiting_BTC_Confirmation",
  "NothingToDo": true,
  "NotMinedYet": false,
  "VFXTransactionHash": null,
  "BTCTransactionHash": null,
  "PinnedBTCTransactionHash": "c314d462…",
  "SmartContractUID": "<contract UID>",
  "WithdrawalRequestHash": "<request hash>",
  "Withdrawal": { "State": "Pinned", "…": "as GetWithdrawalPin" }
}
```

- `Status` is `Awaiting_BTC_Transaction` (waiting), `Awaiting_BTC_Confirmation` (pinned), `Completed` (paid: `BTCTransactionHash` is the paying txid), `Closed` (closed without payment) or `Unknown` (not mined yet).
- `Success` is `true` while the withdrawal is paid or being paid; `Paid` says whether it is paid. `false` with `NotMinedYet: true` means ask again after the next block.

## Multi-vault withdrawal

A holder with vBTC on several vaults, such as an exchange, withdraws a total amount to one Bitcoin address with one request. The node allocates the total across the vaults the requester holds vBTC on, largest available balance first (ties by contract UID), so as few vaults as possible are used.

- **One VFX transaction** (type 27, `VBTCWithdrawalRequestMultiV2()`) opens the whole withdrawal: one nonce, one VFX fee.
- **Each allocated vault is a share**, paid by its own Bitcoin transaction from that vault. The requester pays one Bitcoin miner fee per share, out of that share's amount.
- **Shares settle independently.** Each share is pinned, signed, paid, raised, released, cancelled or closed on its own, so a withdrawal can be partly paid.
- A total that one vault covers is sent as an ordinary single withdrawal (`VBTCWithdrawalRequest()`). The routes below handle it the same way.
- At most 10 vaults per request. A frozen legacy vault is never allocated.

### Request

```
POST /vbtcapi/VBTC/RequestWithdrawalMulti
```

The requester must be an account in this node's wallet. `SmartContractUID` is not needed.

```json
{
  "RequestorAddress": "<holder in this wallet>",
  "BTCAddress": "bc1q…",
  "Amount": 0.000035,
  "FeeRate": 3
}
```

```json
{
  "Success": true,
  "Message": "vBTC V2 multi-contract withdrawal request created successfully",
  "RequestHash": "2b391bf4…7840",
  "TotalAmount": 0.000035,
  "Destination": "bc1q…",
  "FeeRate": 3,
  "Allocations": [
    { "SCUID": "<vault A UID>", "Amount": 0.00002 },
    { "SCUID": "<vault B UID>", "Amount": 0.000015 }
  ],
  "BitcoinTransactions": 2,
  "Status": "Requested",
  "AttestedContracts": [ "<vault A UID>", "<vault B UID>" ]
}
```

Each share pays its own fee, so check the destination receives what you expect: in this example each share paid 462 sats (154 vB at 3 sat/vB) and the address received 3,500 − 2 × 462 = 2,576 sats. `AttestedContracts` lists the shares on watched vaults: the vault's signers pay those, and nothing else needs to be sent.

### Follow each share

```
GET /vbtcapi/VBTC/GetWithdrawalRequestShares/{withdrawalRequestHash}
```

Lists the shares once the request is mined.

```json
{
  "Success": true,
  "WithdrawalRequestHash": "<request hash>",
  "RequestorAddress": "<requester>",
  "IsMultiContract": true,
  "TotalAmount": 0.00007,
  "ShareCount": 2,
  "CompletedCount": 2,
  "AllComplete": true,
  "PaidCount": 1,
  "RefundedCount": 1,
  "AllPaid": false,
  "Shares": [
    { "SmartContractUID": "<vault A UID>", "Amount": 0.00005, "BTCDestination": "bc1q…", "FeeRate": 1, "IsCompleted": true, "Paid": true, "Refunded": false, "Status": "Completed", "BTCTxHash": "2407c724…67cf", "RequestBlockHeight": 4179 },
    { "SmartContractUID": "<vault B UID>", "Amount": 0.00002, "BTCDestination": "bc1q…", "FeeRate": 1, "IsCompleted": true, "Paid": false, "Refunded": true, "Status": "Cancelled", "BTCTxHash": null, "RequestBlockHeight": 4179 }
  ]
}
```

`IsCompleted` means a share is closed, whichever way. `Paid` and `Refunded` say which way. A released share shows `Status: "Cancelled"` here; `GetWithdrawalPin` gives its exact state (`Released`) and the refund less the release fee. Before the request is mined: `No withdrawal shares found for … The REQUEST transaction may not be mined yet.`

For each share's Bitcoin transaction and what can be done with it, call `GET /vbtcapi/VBTC/GetWithdrawalPin/{shareUID}/{withdrawalRequestHash}` with the share's vault UID and the request hash. A share goes through the same states as a single withdrawal (`Waiting`, `Pinned`, then `Settled`, `Cancelled`, `Expired`, `Void` or `Released`).

### Raise, release or cancel one share

Every share is a withdrawal of its own vault under the shared request hash. Pass the share's vault UID as `SmartContractUID` and the request hash as `WithdrawalRequestHash` to `BumpWithdrawalFee`, `ReleaseWithdrawal` or `CancelWithdrawal`. Each fee raise or release is one type 44 transaction for one share and leaves the other shares as they are. On testnet, one request had one share raised from 1 to 3 sat/vB and paid by the replacement, and its other share released at 2 sat/vB and refunded less the 308-sat release fee.

### CompleteWithdrawalMulti

```
POST /vbtcapi/VBTC/CompleteWithdrawalMulti
```

```json
{ "WithdrawalRequestHash": "<request hash>" }
```

**On watched vaults an integrator does not need this route.** It sends nothing for a watched share and reports each share's state: paid, being paid by the chain (with its pinned Bitcoin transaction) or closed and refunded.

```json
{
  "Success": false,
  "Message": "0/2 withdrawal share(s) paid; 2 being paid by the chain (nothing to do; ask again later)",
  "WithdrawalRequestHash": "<request hash>",
  "Paid": 0,
  "BeingPaid": 2,
  "Refunded": 0,
  "Failed": 0,
  "Results": [
    { "SmartContractUID": "<vault A UID>", "Amount": 0.00002, "Success": false, "BeingPaid": true, "Refunded": false, "AlreadyComplete": false, "VFXTxHash": null, "ErrorMessage": "[AWAITING-BTC-CONFIRMATION] This withdrawal is paid by Bitcoin transaction 54b8ef18…, fixed by the chain. …" }
  ]
}
```

When every share is paid: `"Success": true, "Message": "All withdrawal shares completed"`, with each share's paying `BTCTxHash`. A share closed without payment reads `This share was closed without being paid (Cancelled); its vBTC was returned to the requester. No Bitcoin was or will be sent for it.`

On a legacy vault, before the enforcement height, this route is what pays the shares: for each open share it runs a FROST signing ceremony, broadcasts the share's Bitcoin transaction and records its completion (type 28). A share that fails stays open and is retried by calling the route again. From the enforcement height legacy shares can't be completed.

### Errors

| Situation | Message |
| --- | --- |
| The vaults together hold less than the total | `Insufficient combined vBTC balance. Available: 0.000055, Requested: 0.0001` |
| The requester holds no vBTC | `No spendable vBTC balance found for this address.` |
| Zero or negative amount | `Amount must be greater than zero` |
| More than 8 decimals | `Amount cannot have more than 8 decimal places.` |
| Fee rate 0 or below | `Fee rate must be greater than zero` (a fractional `FeeRate` is refused with HTTP 400) |
| Fee rate above 5,000 sat/vB | `A withdrawal's fee rate is at most 5000 sat/vB; this one names …` |
| A share too small to pay after its fee | `Withdrawal share from contract …: 0.000004 BTC cannot pay a Bitcoin withdrawal at 3 sat/vB. … (The total was split across 2 contracts; each share pays its own Bitcoin fee.)` On a watched vault each share must leave at least 546 sats after `154 × FeeRate`: `A withdrawal of … sats from vault … at … sat/vB leaves less than 546 sats to pay: …` |
| More than 10 vaults needed | `Withdrawal would require N contract inputs (max 10). Withdraw a smaller amount or split it across several requests.` |
| Not a Bitcoin address on this network | `TX Verify Failed: The withdrawal's Bitcoin address is not an address on this network: …` |
| A reserve requester | `Reserve accounts cannot request BTC withdrawals. Move the vBTC to a normal VFX address first.` |
| The requester is not in this wallet | `Account not found: …` (use the [raw multi-vault withdrawal](/build/vbtc/raw-integration/#multi-vault-withdrawal)) |

## Errors you can hit on a withdrawal

| Situation | Message |
| --- | --- |
| Amount too small for its fee | `vBTC V2 withdrawal request: … BTC cannot pay a Bitcoin withdrawal at … sat/vB. The smallest withdrawal transaction costs … sats in fees and the payout must be at least 330 sats, so the minimum at this fee rate is … BTC. Raise the amount or lower the fee rate.` (the node's check), then, on a watched vault, `A withdrawal of … sats from vault … at … sat/vB leaves less than 546 sats to pay: its Bitcoin transaction costs at least … sats, taken out of the amount. Raise the amount or lower the fee rate.` |
| Fee rate out of bounds | `Fee rate must be greater than zero`; `A withdrawal's fee rate is at most 5000 sat/vB; this one names …` |
| Bad destination | `The withdrawal's Bitcoin address is not an address on this network: …`; `The withdrawal's Bitcoin address has spaces around it.`; `The withdrawal's Bitcoin address is the deposit address of vault …, which it withdraws from. …` |
| Not enough vBTC | `Insufficient balance. Available: …, Requested: …` |
| With the requester's pending transactions it would overspend | `Together with this address's pending transactions the withdrawal exceeds its balance: …` |
| Wrong requester | `Only the requester can raise a withdrawal's Bitcoin fee.`; `Only the requester can cancel a withdrawal.` |
| Cancel after the pin | `This withdrawal's Bitcoin transaction is fixed and may already be signed, so it cannot be cancelled. It completes when Bitcoin confirms it.` |
| Raise or release before the pin | `This withdrawal has no Bitcoin transaction yet. Cancel it and request again with the fee rate you want.` |
| Raise or release at a rate not above the current one | `The new fee rate must be above the 3 sat/vB the withdrawal's newest Bitcoin transaction pays.` |
| Raise while a release is pending | `This withdrawal is being released back to the vault; its payment is not raised any more. A release at a higher fee rate is accepted.` |
| Too many pinned transactions | `This withdrawal already has 8 Bitcoin transactions; no more replacements are accepted. It can still be released.`; `This withdrawal already has 4 release transactions; no more are accepted.` |
| Release fee too low or too high | `At … sat/vB the release pays … sats; it must pay at least … sats to replace the withdrawal's newest Bitcoin transaction. Name a higher fee rate.`; `At … sat/vB the release costs … sats of Bitcoin fee, more than the … sats the withdrawal is for; the fee is taken out of the refund.` |
| Withdrawal already closed | `This withdrawal is already closed (Settled).` |
| Raise or release on a legacy vault | `Only a withdrawal from a vault the chain watches can have its Bitcoin fee raised.` |
| The vault's key can no longer sign | Refused before anyone is debited; the vault is due to be moved to a new key (type 46) |
| A frozen legacy vault | `Vault … was created before Bitcoin attestation and has been frozen since block …. Its vBTC can no longer be transferred, withdrawn or bridged.` |

When an error comes back from the node's transaction check it is prefixed `TX Verify Failed: `.

## Bridging to Base (vBTC.b)

vBTC.b is vBTC on Base, an ERC-20 (`vBTCb`, symbol `vBTC.b`, 8 decimals) minted against vBTC locked on VerifiedX. See [vBTC.b on Base](/learn/vbtc-protocol/#vbtcb-on-base) for the model.

### To Base

The owner's node runs the whole flow: it broadcasts the lock (type 37), collects the bridge validators' mint attestations once the lock is 30 VFX blocks deep, and submits `mintWithProof` on Base from a Base address derived from the owner's VFX key. That address pays the Base gas, so fund it with a little ETH first.

```
GET  /wallet/api/base-address/{vfxAddress}
GET  /wallet/api/vbtc/bridge/preflight/{ownerAddress}/{scUID}
POST /wallet/api/vbtc/bridge/toBase
```

`preflight` shows what the bridge will need, including the ETH balance of the derived Base address. `toBase` takes a camel-case body with the amount as a string:

```json
{
  "scUID": "<vault UID>",
  "ownerAddress": "<owner VFX address>",
  "amount": "0.0005",
  "evmDestination": "0x<40 hex characters>"
}
```

It is refused when the derived Base address holds no ETH. Follow it with `GET /wallet/api/vbtc/bridge/status/{lockId}`; if the Base submission fails, `POST /wallet/api/vbtc/bridge/retry/{lockId}/{ownerAddress}` (or `forceRetry`) submits it again.

A lock is refused when the sender is a vault (reserve) account, the vault is S3C, the amount is not a whole number of satoshis, or `evmDestination` is not `0x` followed by 40 hex characters.

`POST /vbtcapi/VBTC/BridgeToBase` (`SmartContractUID`, `OwnerAddress`, `Amount`, `EvmDestination`) broadcasts the lock only. To mint yourself, read the signatures from `GET /vbtcapi/VBTC/GetMintAttestation/{lockId}` and the contract address and ABI from `GET /vbtcapi/VBTC/GetBridgeConfig`, and call `mintWithProof` from your own EVM wallet.

### Back to VerifiedX or out to Bitcoin

Exits start on Base, from the holder's own EVM wallet; the node has no burn route.

- `burnForVfxExit(amount, vfxDestinationAddress)` returns vBTC to a VFX address. The bridge's casters see the burn, agree on it and broadcast a pool unlock (type 39) that credits the destination.
- `burnForBTCExit(amount, btcDestination)` pays Bitcoin. The casters record the exit on VerifiedX (type 40), and on watched vaults consensus pins each vault's part in the same block, exactly like a withdrawal. Follow it on any node with `GET /vbtcapi/VBTC/GetBridgeExit/{baseBurnTxHash}`: `Status` is `Waiting`, `Pinned`, `Complete` or `Failed`, and `Parts` lists each vault's pinned Bitcoin transaction. An exit not pinned within 360 blocks fails by rule and its locks are restored. The Bitcoin fee starts at 10 sat/vB and comes out of the payout.

### Bridge status and balances

- `GET /vbtcapi/VBTC/GetBridgeStatus`: whether the bridge is configured on this node, the contract, chain id and total vBTC.b supply on Base.
- `GET /vbtcapi/VBTC/GetBridgeConfig`: `IsEnabled`, `ContractAddress`, `ChainId`, `Network` and the contract `Abi`.
- `GET /vbtcapi/VBTC/GetBaseBalance/{evmAddress}`: an address's vBTC.b balance.
- `GET /vbtcapi/VBTC/GetBridgeLockStatus/{lockId}`, `GetBridgeLocks/{scUID}` and `GetBridgeLocksByOwner/{ownerAddress}` read this node's own records, so ask the node that made the lock.

Mainnet uses Base (chain id 8453) and testnet uses Base Sepolia (chain id 84532). A new `config.txt` is written with the network's contract and RPC (`BaseBridgeContract`, `BaseBridgeRpcUrl`, `BaseBridgeRpcUrl2`, `BaseBridgeRpcUrl3`, `BaseBridgeChainId`); a node whose existing `config.txt` lacks them reports `BridgeEnabled: false`.

## Legacy vaults

A legacy vault was created before the attestation recording height. Its Bitcoin is not in consensus: its owner's balance comes from Bitcoin servers, and its withdrawals work the earlier way.

**Until the enforcement height:**

1. Request the withdrawal (`RequestWithdrawal`, `RequestWithdrawalMulti`). The answer has `Attested: false` and `CompleteWithdrawalNeeded: true`.
2. Complete it: `POST /vbtcapi/VBTC/CompleteWithdrawal` (or `CompleteWithdrawalMulti`) coordinates FROST signing among the vault's validators, broadcasts the Bitcoin transaction and records the completion (type 28). The answer has `VFXTransactionHash`, `BTCTransactionHash` and `Status: "Pending_BTC"`; if the transaction takes back coins another withdrawal was holding, `Status` is `Awaiting_BTC_Confirmation` and the completion follows its first confirmation. A request that can never be paid at its fee rate answers `Unpayable: true`: cancel it.
3. To cancel, send `CancelWithdrawal` (type 29). The vault's active validators vote on it (type 30, 75% to approve); an approved cancellation refunds the escrowed vBTC. Follow it with `GET /vbtcapi/VBTC/GetCancellationStatus/{scUID}/{withdrawalRequestHash}`. A validator that signed a Bitcoin transaction for the withdrawal votes against. `POST /vbtcapi/VBTC/VoteOnCancellation` lets a validator's operator cast that node's vote by hand.

**From the enforcement height** the vault is frozen:

- Nothing debits a balance on it: no transfer, withdrawal, bridge lock or bridge exit, for the owner or any holder. Bitcoin deposited to it is not credited. Two settlements still move vBTC between holders inside it, leaving its total unchanged: a reserve's delayed send that falls due, and a reserve's recovery sweep; the new holder can take nothing off the vault.
- Withdrawal completions (type 28), cancellation votes (type 30), bridge exit completions (type 41) and bridge exit failures (type 42) are refused for every vault.
- A withdrawal already requested from a legacy vault is completed or settled by hand. It is not cancelled by vote.
- Validators keep their key shares for legacy vaults; no retirement or re-key deletes them.

**What holders should do before the enforcement height:** create a new vault (it is watched) and move to it, or withdraw to Bitcoin. Whatever is left on a legacy vault at the enforcement height stays there. `GetMPCDepositAddress`, the balance routes and `GetContractList` return `Legacy`, `FreezeHeight` and a `Note` that says so.

On testnet, legacy vaults no longer exist: the chain restarted in October 2026 and the enforcement height is 401.

## S3C vaults

S3C (self-custodial smart contracts) lets an owner have a vault's key held only by validators the owner runs, instead of by the public validator set.

- **Validators.** Each S3C validator runs with `S3CValidator=true` in `config.txt`, which flags it as S3C on chain when it registers. An S3C validator takes part only in S3C ceremonies; public vaults never use it. Like any validator it must be registered, active, and hold its 5,000 VFX bond.
- **The minting node** lists the pool in `config.txt` as `S3C=IP:ValidatorAddress,IP:ValidatorAddress,IP:ValidatorAddress`: at least three entries, public IP addresses only, valid VFX addresses. Every vault this node creates is then an S3C vault. The configured IP is the one contacted.
- **All or nothing.** Every configured validator must be registered, active, flagged S3C, funded and bonded long enough, and all of them take part in the key ceremony. If any is unusable, the ceremony fails and names it. If the `S3C=` value is invalid, the node refuses to create vaults rather than fall back to the public pool.
- **Check before minting:** `GET /vbtcapi/VBTC/GetS3CStatus` returns `Enabled`, `ConfigInvalid`, `IsS3CValidator` and, per configured validator, `RegisteredOnChain`, `Reachable` and `ConfigIPMismatch`.
- **Keys.** The chain never moves an S3C vault to a new key: who holds its key is its owner's matter.
- `POST /vbtcapi/VBTC/StartS3CAutoBridge` (`S3CContractUID`, `RequesterAddress`, `Amount`, `EvmDestination`) withdraws S3C vBTC to a public companion vault and bridges it to Base in one orchestration; `GET /vbtcapi/VBTC/GetS3CAutoBridgeStatus/{orchestrationId}` follows it. Its state is held in memory: after a node restart, finish by hand.

## The node's browser wallet

A node started with its browser wallet serves the same operations, signed by the node's accounts, under `/wallet/api/vbtc`. Bodies are camel-case and amounts and fee rates are strings (a JSON number is refused with HTTP 400).

| Route | Body or parameters |
| --- | --- |
| `GET /wallet/api/vbtc/{address}` | The address's vaults |
| `POST /wallet/api/vbtc/withdraw/request` | `scUID`, `ownerAddress` (the requester), `btcAddress`, `amount`, `feeRate` (default 10) |
| `GET /wallet/api/vbtc/withdraw/pin/{scUID}/{requestHash}` | `{success, withdrawal, message}`, where `withdrawal` is the object `GetWithdrawalPin` returns |
| `GET /wallet/api/vbtc/withdraw/status/{scUID}` | The vault's withdrawal status |
| `POST /wallet/api/vbtc/withdraw/cancel` | `scUID`, `ownerAddress`, `requestHash` |
| `POST /wallet/api/vbtc/withdraw/bumpfee` | `scUID`, `ownerAddress`, `requestHash`, `feeRate` |
| `POST /wallet/api/vbtc/withdraw/release` | `scUID`, `ownerAddress`, `requestHash`, `feeRate` |
| `POST /wallet/api/vbtc/withdraw/complete` | `scUID`, `requestHash` (legacy vaults; on a watched vault it reports the state) |
| `POST /wallet/api/vbtc/transfer` | `scUID`, `fromAddress`, `toAddress`, `amount` |

## Other vBTC routes

These are in the same controller and not covered on this page: the shielded vBTC pool (`ShieldVBTC`, `UnshieldVBTC`, `PrivateTransferVBTC`, `GetShieldedVBTCBalance`, `GetShieldedVBTCPoolState/{scUID}`), the bridge to Base (`BridgeToBase`, `GetBridgeLockStatus/{lockId}`, `GetBridgeLocks/{scUID}`, `GetBridgeLocksByOwner/{ownerAddress}`, `GetBaseBalance/{evmAddress}`, `GetBridgeStatus`, `GetBridgeConfig`, `GetBridgeExit/{baseBurnTxHash}`), validator routes (`GetValidatorList`, `GetValidatorStatus/{address}`, `GetValidatorBond/{address}`, `ExitValidator/{address}`, see [Run a Validator](/node/validator/)) and operator routes.

## V1 vBTC is retired

V1 vBTC (arbiter tokenization under `btcapi/BTCV2`: `TokenizeBitcoin`, `TransferCoin`, `TransferCoinMulti`, `WithdrawalCoin`, `WithdrawalCoinRawTX`, transaction types 17 to 21) was retired at block 7,400,500 on mainnet. From that height the network accepts no new V1 token, transfer or withdrawal, and no transaction may touch an existing V1 contract, so V1 balances are frozen as they stand. On the testnet, which restarted in October 2026, V1 has been retired since block 1. The Bitcoin wallet routes of `btcapi/BTCV2` (accounts, sends, fees, `.btc` names) are unaffected and are listed in [CLI API Details](/build/node-api/details/#3-bitcoin-integration-api).
