---
title: "vBTC Raw Integration Guide"
description: "Build, sign and submit vBTC V2 transactions outside the node: vault creation, transfers, ownership changes and withdrawals with keys held by your own signer."
sidebar:
  order: 2
  label: Raw integration
  attrs:
    class: sidebar-btc
---

This guide is for integrations whose VFX keys never reach the node: web wallets, exchange signers, HSMs. A node builds each vBTC transaction unsigned, the client checks it and signs its hash, and the node verifies and broadcasts the signed transaction. The node needs no account, key or balance of yours.

It describes vBTC V2 on Core 9.0. Read [vBTC](/build/vbtc/integration/) first for the concepts (vaults, owners and holders, watched and legacy vaults, networks and heights, transaction types): this page covers what differs when you sign outside the node. All routes are under `/vbtcapi/VBTC` on the node's API (`http://localhost:7292`, testnet `17292`); send the `apitoken` header if the node requires one.

## How the raw routes work

Every action that sends a VFX transaction follows the same four steps.

### 1. Build

Call the action's `GetRaw…` route. It checks the request against the same rules block validation applies and answers either with a refusal (`"Success": false` and a `Message`) or with the unsigned transaction:

```json
{
  "Success": true,
  "Hash": "39ff6b9b…a22b",
  "Timestamp": 1792774390,
  "FromAddress": "<signer>",
  "ToAddress": "<signer or recipient>",
  "Amount": 0.0,
  "Fee": 0.00001375,
  "Nonce": 2,
  "TransactionType": "VBTC_V2_WITHDRAWAL_REQUEST",
  "Data": "{\"Function\":\"VBTCWithdrawalRequestMultiV2()\",…}",
  "HashPreimage": "1792774390<signer><signer>0.00.000013752VBTC_V2_WITHDRAWAL_REQUEST{\"Function\":…}",
  "Message": "Sign the Hash field and submit via SendRawRequestWithdrawalTx. …"
}
```

The build is kept on that node for about 65 minutes. Submit it to the same node.

### 2. Check before signing

Never sign a hash you have not checked. The hash is:

```
Hash = SHA-256( lowercase hex of SHA-256( HashPreimage as UTF-8 ) ), as lowercase hex
HashPreimage = Timestamp + FromAddress + ToAddress + Amount + Fee + Nonce + TransactionType + Data
```

with no separators, `TransactionType` as its name (for example `VBTC_V2_WITHDRAWAL_REQUEST`), and `Data` exactly as returned. A reserve (`xRBX`) transfer appends its `UnlockTime`.

1. **Recompute the hash.** Where the route returns `HashPreimage` (vault creation, multi-vault transfer, multi-vault withdrawal), hash it and compare with `Hash`, and check that the preimage starts with `Timestamp` and `FromAddress` and contains `Data` verbatim. The single transfer, fee-raise and release builders return every field of the preimage. The single withdrawal-request and cancel builders leave out `ToAddress` and `Amount`, which are always the sender's address and `0.0`. `Amount` and `Fee` enter the preimage as the node's decimal text (`0.0` for zero), which a JSON parser may not reproduce, so compare field by field if you can't rebuild the text exactly.
2. **Read `Data`** and check that it says what you asked for: the action's `Function`, the vault (`ContractUID`), the amount or allocation, the Bitcoin address and the fee rate. The sections below list what to check for each action.
3. **Check `FromAddress`** is the address whose key you are about to use, and `Fee` (in VFX) is what you expect.

### 3. Sign

Sign `Hash` (the hex string, as UTF-8 text) with the sender's key, ECDSA over secp256k1, exactly as for any VFX transaction (see [Transaction Creation](/build/node-api/transaction-creation/)). The signature is the DER signature in Base64, a `.`, and the public key (64 bytes, without the `04` prefix) in Base58.

### 4. Submit

Post to the matching `SendRaw…` route:

```json
{
  "Hash": "<the Hash the build returned>",
  "Signature": "<Base64 DER signature>.<Base58 public key>",
  "PublicKey": "<the signer's public key>"
}
```

The node runs its full transaction check on the signed build, then broadcasts it:

- `{"Success": true, "Hash": "…", "Message": "Withdrawal request transaction broadcast successfully."}`
- A bad signature: `Transaction verification failed: Signature Failed to verify.` The build is kept, so sign again and resubmit the same hash.
- An unknown or already used hash: `No pending transaction found for hash …. Call GetRawRequestWithdrawalTxData first.`, or `Transaction … was already submitted.`
- With the sender's other transactions still waiting to be mined it would overspend: `Not broadcast: together with this address's transactions still waiting to be mined it would overspend (…). Submit it again once they are mined.`
- `Hash, Signature, and PublicKey are required`.

The withdrawal-request, cancel, completion, fee-raise and release `SendRaw…` routes accept only their own build type, and a fee raise can't be sent as a release or the reverse. The transfer and vault-creation routes don't check the type, so always submit a build through its matching route. Submit vBTC builds through these routes, not the general `txapi/TXV1` raw routes.

The builders take the sender's next nonce from chain state when they build. Build and submit one transaction at a time per address, and build the next once the previous one is in a block, unless the route lets you pass `Nonce`.

## Reading state without a node wallet

The read routes answer from chain state, so any node answers for any address or vault:

- Balances: `GET GetAllVBTCBalances/{address}`, `GET GetVBTCBalance/{address}/{scUID}`.
- A vault: `GET GetContractDetails/{scUID}`, `GET GetVaultBitcoin/{scUID}`, `GET GetMPCDepositAddress/{scUID}`.
- A withdrawal: `GET GetWithdrawalPin/{scUID}/{withdrawalRequestHash}` and, for every share of a request, `GET GetWithdrawalRequestShares/{withdrawalRequestHash}`.
- The network: `GET GetBitcoinAttestationStatus`.

The answers are described on the [vBTC](/build/vbtc/integration/#reading-balances-and-vaults) page.

`POST PrepareCompleteWithdrawalRaw` also tells a raw client where a withdrawal stands. On a watched vault it prepares nothing and returns the completion answer (`Attested: true`, `Status`, `Paid`, `NothingToDo`, `NotMinedYet`, `PinnedBTCTransactionHash`, `BTCTransactionHash` and the `Withdrawal` object); on a legacy vault it prepares a FROST signing session (see [Legacy vaults](#legacy-vaults)). Read `Attested` to tell the two apart.

```json
{ "OwnerAddress": "<requester>", "SmartContractUID": "<contract UID>", "WithdrawalRequestHash": "<request hash>" }
```

## Create a vault

A vault is created by its owner in two parts: a key ceremony among the validators, authorised by the owner's signatures, and the creation transaction (type 25).

1. **Prepare the ceremony.** `POST PrepareMPCCeremonyRaw` with `{"OwnerAddress": "<owner>"}`. The node checks that enough validators are reachable and returns the messages to sign:

   ```json
   {
     "Success": true,
     "CeremonyId": "<32 hex>:<unix time>",
     "SessionId": "<guid>",
     "OwnerAddress": "<owner>",
     "ValidatorCount": 13,
     "Threshold": 51,
     "StartMessage": "<sessionId>.<owner>.<timestamp>",
     "StartTimestamp": 1792760000,
     "ShareDistributionMessage": "<sessionId>.<owner>.<timestamp + 1>",
     "ShareDistributionTimestamp": 1792760001,
     "RetrySessions": [ { "SessionId": "…", "StartMessage": "…", "StartTimestamp": 0, "ShareDistributionMessage": "…", "ShareDistributionTimestamp": 0 } ]
   }
   ```

2. **Sign** `StartMessage` and `ShareDistributionMessage` with the owner's key (the same signature format). Check that each message names your owner address. Sign the `RetrySessions` messages too: they let the ceremony run again without a validator that fails it. Without them it runs once.
3. **Run it.** `POST ExecuteMPCCeremonyRaw`:

   ```json
   {
     "OwnerAddress": "<owner>",
     "CeremonyId": "<ceremony id>",
     "SessionId": "<session id>",
     "StartTimestamp": 1792760000,
     "StartSignature": "<signature>",
     "ShareDistributionTimestamp": 1792760001,
     "ShareDistributionSignature": "<signature>",
     "RetrySessions": [ { "SessionId": "…", "StartTimestamp": 0, "StartSignature": "…", "ShareDistributionTimestamp": 0, "ShareDistributionSignature": "…" } ]
   }
   ```

   Errors: `Invalid start signature`, `Invalid share distribution signature`, `Invalid retry session signature (…)`, `Active ceremony already in progress.`
4. **Wait.** Poll `GET GetCeremonyStatus/{ceremonyId}` until `Status` is `Completed` (or `Failed`, with `ErrorMessage`). Use `ContractUID` from that answer.
5. **Build the creation.** `POST GetRawCreateContractTxData` on the same node (the ceremony's result is held in that node's memory):

   ```json
   { "OwnerAddress": "<owner>", "CeremonyId": "<ceremony id>", "Name": "Treasury vault", "Description": "", "Ticker": "vBTC" }
   ```

   The answer has `Hash`, `HashPreimage`, `SmartContractUID`, `DepositAddress`, `DepositAddressConfirmed: false` and the transaction's fields. **Check:** `TransactionType` is `VBTC_V2_CONTRACT_CREATE`, `FromAddress` and `ToAddress` are the owner, `Amount` is 0, and `Data` is `[{"Function":"Mint()","ContractUID":"<the ceremony's contract UID>",…}]`.
6. **Sign and submit** with `POST SendRawCreateContractTx`: `vBTC contract creation transaction broadcast successfully.`
7. **Get the deposit address** with `GET GetMPCDepositAddress/{scUID}` once the creation is in a block. Do not deposit before this route returns the address.

`CreateVBTCContractRaw` is not an external-signer route: it verifies a signed request but then signs the creation with the owner's account on the node.

## Transfer vBTC

### From one vault

1. `POST GetRawTransferVBTCData`:

   ```json
   { "SmartContractUID": "<contract UID>", "FromAddress": "<sender>", "ToAddress": "<recipient>", "Amount": 0.00003 }
   ```

2. **Check:** `TransactionType` is `VBTC_V2_TRANSFER`, `Amount` (the VFX amount) is 0, and `Data` is `{"Function":"TransferVBTCV2()","ContractUID":…,"FromAddress":<sender>,"ToAddress":<recipient>,"Amount":<vBTC amount>}`. For a reserve (`xRBX`) sender, `IsReserveSend` is `true` and `UnlockTime` is part of the hash: the transfer is held for 24 hours and can be called back until then.
3. Sign and submit with `POST SendRawTransferVBTCTx`.

Refusals at build: `Insufficient balance. Available: …, Requested: …`, `Reserve accounts cannot send vBTC to another Reserve Account.`

### From several vaults (bulk transfer)

1. `POST GetRawTransferVBTCMultiData`:

   ```json
   {
     "FromAddress": "<sender>",
     "ToAddress": "<recipient>",
     "TotalAmount": 0.00012,
     "Inputs": [ { "SCUID": "<vault A UID>", "Amount": 0.00008 }, { "SCUID": "<vault B UID>", "Amount": 0.00004 } ],
     "Nonce": null
   }
   ```

   Pass `Inputs` yourself where you can: the node checks them against chain state. Without `Inputs` the node plans the split from the vaults it knows. `Nonce` is optional; without it the node uses the next one.
2. **Check:** `HashPreimage` hashes to `Hash`; `Function` is `TransferVBTCMultiV2()` (or `TransferVBTCV2()` when one vault covers the total, `IsMultiContract: false`); `Allocations` sum to `TotalAmount`; `Data` names your recipient.
3. Sign and submit with `POST SendRawTransferVBTCTx`.

At most 25 vaults per transfer, amounts with at most 8 decimals, no reserve senders and no shielded recipient.

## Transfer ownership

Ownership moves with a smart-contract transfer (type 18, `TKNZ_TX`) built through the general raw transaction routes.

1. `GET /vbtcapi/VBTC/GetVBTCOwnershipTransferData/{scUID}/{toAddress}/NA` returns the transaction's `Data`: `[{"Function":"Transfer()","ContractUID":…,"ToAddress":<new owner>,"Data":…,"Locators":"NA","MD5List":"NA"}]`. While the network uses the default vBTC image no beacon upload is needed and the locator is `NA`.
2. Build a transaction with `TransactionType` 18, `FromAddress` the current owner, `ToAddress` the new owner, `Amount` 0 and that `Data`, then use `txapi/TXV1/GetRawTxFee`, `GetTxHash`, sign, `VerifyRawTransaction` and `SendRawTransaction` as in [Transaction Creation](/build/node-api/transaction-creation/).

The new owner takes over the vault's vBTC that no holder holds.

## Withdraw to Bitcoin

### Request

1. `POST GetRawRequestWithdrawalTxData`:

   ```json
   {
     "SmartContractUID": "<contract UID>",
     "RequestorAddress": "<holder>",
     "BTCAddress": "bc1q…",
     "Amount": 0.00002,
     "FeeRate": 3,
     "UniqueId": null
   }
   ```

2. **Check before signing:** `TransactionType` is `VBTC_V2_WITHDRAWAL_REQUEST`; `FromAddress` is the holder; `Data` is `{"Function":"VBTCWithdrawalRequest()","ContractUID":<vault>,"RequestorAddress":<holder>,"BTCAddress":<your destination, exactly>,"Amount":<amount>,"FeeRate":<rate>,"UniqueId":…}`. Validate the Bitcoin address yourself for the right network. Work out what the destination will receive: `Amount` less `FeeRate × 154` sats (more if the vault needs several coins), which must leave at least 546 sats.
3. Sign and submit with `POST SendRawRequestWithdrawalTx`. The transaction's hash is the withdrawal's `RequestHash` from now on.

Refusals at build: `Fee rate must be greater than zero`, the fee-floor message (`… cannot pay a Bitcoin withdrawal at … sat/vB. …`), `Insufficient balance. Available: …, Requested: …`, and at submit the consensus refusals listed on the [vBTC](/build/vbtc/integration/#errors-you-can-hit-on-a-withdrawal) page (address not on this network, fee rate above 5,000, less than 546 sats left, a frozen vault).

`RequestWithdrawalRaw` is not part of this flow: it only records a request on that node and puts nothing on chain.

### Follow it

On a watched vault nothing more needs to be sent. In the block that mines the request the chain pins the Bitcoin transaction that pays it; the vault's signers sign it and broadcast it; it completes when Bitcoin confirms it. Follow it with `GET GetWithdrawalPin/{scUID}/{requestHash}` (or `PrepareCompleteWithdrawalRaw`): `State` goes from `Waiting` or `Pinned` to `Settled`, or to `Cancelled`, `Expired`, `Void` or `Released` with the vBTC refunded. Until the request is mined the answer is `Success: false, Attested: true, Withdrawal: null`; ask again after the next block.

The node reports a withdrawal's pin in the same block as the request. The explorer API shows it only after a later Bitcoin report, so follow withdrawals through the node.

### Cancel while waiting

While `State` is `Waiting` (`CanCancel: true`) the requester can cancel at once, with no vote:

1. `POST GetRawCancelWithdrawalTxData` with `{"SmartContractUID": "<vault>", "RequestorAddress": "<requester>", "WithdrawalRequestHash": "<request hash>"}`.
2. **Check:** `TransactionType` is `VBTC_V2_WITHDRAWAL_CANCEL`, `Data` is `{"Function":"VBTCWithdrawalCancel()","ContractUID":<vault>,"WithdrawalRequestHash":<request hash>}`, and `Attested: true` (the message says no vote is held).
3. Sign and submit with `POST SendRawCancelWithdrawalTx`. When it is mined the withdrawal closes as `Cancelled` and the vBTC is back.

The builder refuses before you sign when the cancel can't be accepted: `Only the original requestor can cancel.`, `Cannot cancel an already completed withdrawal.`, and once the withdrawal is pinned `This withdrawal's Bitcoin transaction is fixed and may already be signed, so it cannot be cancelled. It completes when Bitcoin confirms it.` (with the `Withdrawal` object). `CancelWithdrawalRaw` does not cancel anything: it answers with the message to use these routes.

### Raise the fee

When a pinned withdrawal is not confirming (`CanRaiseFee: true`):

1. `POST GetRawBumpWithdrawalFeeTxData`:

   ```json
   { "SmartContractUID": "<vault>", "RequestorAddress": "<requester>", "WithdrawalRequestHash": "<request hash>", "FeeRate": 8 }
   ```

2. **Check:** `TransactionType` is `VBTC_V2_COIN_PIN` (`TransactionTypeId` 44), `FromAddress` and `ToAddress` are the requester, `Amount` is 0, and `Data` is `{"Function":"VBTCWithdrawalFeeBump()","ContractUID":<vault>,"WithdrawalRequestHash":<request hash>,"FeeRate":<new rate>}`. The new rate must be above the `FeeRate` the withdrawal pays now. The higher fee comes out of the withdrawal: the destination receives less.
3. Sign and submit with `POST SendRawBumpWithdrawalFeeTx`. When it is mined, the chain pins a replacement that spends the same coins; follow it with `GetWithdrawalPin`.

### Release

When a pinned withdrawal is not confirming and the requester would rather have the vBTC back (`CanRelease: true`):

1. `POST GetRawReleaseWithdrawalTxData` with the same body as a fee raise.
2. **Check:** as for a fee raise, with `Function` `VBTCWithdrawalRelease()`. The release's Bitcoin fee comes out of the refund.
3. Sign and submit with `POST SendRawReleaseWithdrawalTx`. When it is mined, the chain pins a Bitcoin transaction returning the coins to the vault; when Bitcoin shows it, the withdrawal closes as `Released` and the vBTC is refunded less that fee. If one of the withdrawal's payments confirms first, it is paid instead.

Both builders check the request against the rule block validation applies and refuse with the reason and the `Withdrawal` object, for example `The new fee rate must be above the 3 sat/vB the withdrawal's newest Bitcoin transaction pays.` or `This withdrawal has no Bitcoin transaction yet. Cancel it and request again with the fee rate you want.` A fee raise sent to the release route, or the reverse, is refused: `This transaction is a fee bump; submit it with SendRawBumpWithdrawalFeeTx.`

## Multi-vault withdrawal

This is how an exchange or any holder with vBTC on several vaults withdraws a total amount to one Bitcoin address. One VFX transaction (type 27, `VBTCWithdrawalRequestMultiV2()`) opens the withdrawal; each vault in it is a **share**, paid by its own Bitcoin transaction from that vault. The requester pays one miner fee per share, out of that share, and shares settle independently, so a withdrawal can be partly paid. A total that one vault covers is built as an ordinary single withdrawal. At most 10 vaults per request.

### Build

`POST GetRawRequestWithdrawalMultiTxData`:

```json
{
  "RequestorAddress": "<holder>",
  "BTCAddress": "bc1q…",
  "TotalAmount": 0.00006,
  "FeeRate": 2,
  "Inputs": [
    { "SCUID": "<vault A UID>", "Amount": 0.00003 },
    { "SCUID": "<vault B UID>", "Amount": 0.00003 }
  ],
  "UniqueId": null
}
```

Pass `Inputs` (each vault and the amount to draw from it) whenever you can: the node checks them against chain state, so any node can build for any holder. Without `Inputs` the node allocates the total itself, largest available balance first, from the vaults it can see.

```json
{
  "Success": true,
  "Hash": "39ff6b9b…a22b",
  "Timestamp": 1792774390,
  "FromAddress": "<holder>",
  "Fee": 0.00001375,
  "Nonce": 2,
  "TransactionType": "VBTC_V2_WITHDRAWAL_REQUEST",
  "Data": "{\"Function\":\"VBTCWithdrawalRequestMultiV2()\",\"RequestorAddress\":\"<holder>\",\"BTCAddress\":\"bc1q…\",\"TotalAmount\":0.00006,\"FeeRate\":2,\"Inputs\":[{\"SCUID\":\"<vault A UID>\",\"Amount\":0.00003},{\"SCUID\":\"<vault B UID>\",\"Amount\":0.00003}],\"UniqueId\":null}",
  "HashPreimage": "…",
  "Function": "VBTCWithdrawalRequestMultiV2()",
  "IsMultiContract": true,
  "Allocations": [ { "SCUID": "<vault A UID>", "Amount": 0.00003 }, { "SCUID": "<vault B UID>", "Amount": 0.00003 } ],
  "BitcoinTransactions": 2,
  "TotalAmount": 0.00006,
  "Destination": "bc1q…",
  "Message": "Sign the Hash field and submit via SendRawRequestWithdrawalTx. …"
}
```

On a watched vault, ignore the part of `Message` that asks you to complete each contract: the vault's signers pay every share.

### Check before signing

1. **Hash.** SHA-256 of the lowercase hex of SHA-256(`HashPreimage`) equals `Hash`. The preimage starts with `Timestamp` and the holder's address (as `FromAddress` and `ToAddress`) and ends with `Data` exactly as returned.
2. **Allocation.** `Data.Inputs` (and `Allocations`) name the vaults and amounts you intended, each vault once, and add up to `TotalAmount`.
3. **Destination.** `Data.BTCAddress` is your destination exactly, valid for the network. Check it yourself before you build.
4. **Fees.** `Data.FeeRate` is the rate you meant. Each share pays `FeeRate × 154` sats or more out of its own amount, so the destination receives `TotalAmount` less `BitcoinTransactions` fees, and every share must leave at least 546 sats after its fee. `Fee` is the VFX fee of the request.
5. **Signer.** `FromAddress` is the holder whose key you are using.

### Sign and submit

Sign `Hash` with the holder's key and submit with `POST SendRawRequestWithdrawalTx`, as for a single withdrawal. On testnet a two-share request at 2 sat/vB was mined in the next block, each share pinned in that block to its own Bitcoin transaction (2,692 sats to the destination, 308 sats fee each), and both closed paid when Bitcoin confirmed them.

### Follow each share

- `GET GetWithdrawalRequestShares/{requestHash}` lists the shares once the request is mined: each vault, amount, `Status`, `IsCompleted`, `Paid`, `Refunded` and `BTCTxHash`, and the totals `PaidCount`, `RefundedCount`, `AllPaid`.
- `GET GetWithdrawalPin/{shareVaultUID}/{requestHash}` gives one share's state, its pinned Bitcoin transaction and what can be done with it. A share goes through the same states as a single withdrawal.

To raise the fee of, release or cancel one share, use the routes above with that share's vault UID as `SmartContractUID` and the request hash as `WithdrawalRequestHash`. Each is one transaction for one share; the other shares are not touched.

You don't need `CompleteWithdrawalMulti` or `PrepareCompleteWithdrawalRaw`/`ExecuteCompleteWithdrawalRaw` for shares on watched vaults: they send nothing for them.

### Refusals at build

| Situation | Message |
| --- | --- |
| `Inputs` don't add up | `TotalAmount must equal the sum of input amounts for multi-contract vBTC withdrawal.` |
| A vault listed twice | `Multi-contract vBTC withdrawal inputs must reference distinct contracts.` |
| An input above the holder's balance on that vault | `Insufficient vBTC balance for withdrawal input …. Available: …, Requested: …` |
| No `Inputs` and not enough across the vaults | `Insufficient combined vBTC balance. Available: …, Requested: …` |
| The holder has nothing | `No spendable vBTC balance found for this address.` |
| More than 8 decimals | `TotalAmount cannot have more than 8 decimal places` |
| More than 10 vaults | `Multi-contract vBTC withdrawal exceeds the maximum of 10 inputs.` |
| A share too small for its fee | `Multi-contract vBTC withdrawal input …: … BTC cannot pay a Bitcoin withdrawal at … sat/vB. …` |
| Fee rate 0 | `FeeRate must be greater than zero` |
| Not a Bitcoin address on this network | `The withdrawal's Bitcoin address is not an address on this network: …` |
| A reserve holder | `Reserve accounts cannot request BTC withdrawals. Move the vBTC to a normal VFX address first.` |

## Legacy vaults

On a vault created before the attestation recording height, until the enforcement height, a withdrawal is completed by its requester after the request is mined:

1. `POST PrepareCompleteWithdrawalRaw` (`OwnerAddress` = the requester, `SmartContractUID`, `WithdrawalRequestHash`) returns `SessionId`, `StartMessage`, `ShareDistributionMessage`, their timestamps, `InputCount` and `StartMessages` (one per Bitcoin input), plus the withdrawal's `Amount`, `BTCDestination` and `FeeRate` to confirm. `Unpayable: true` means the request can never be paid at its fee rate: cancel it.
2. Sign every message in `StartMessages` and `ShareDistributionMessage`, and `POST ExecuteCompleteWithdrawalRaw` with `StartSignature`, `ShareDistributionSignature`, `StartSignatures` and the confirmed fields. The validators sign the Bitcoin transaction and the node returns `SignedBTCTxHex`.
3. Broadcast `SignedBTCTxHex` to Bitcoin. If `CompleteAfterConfirmation` is `true`, wait for its first confirmation.
4. Record the completion: `POST GetRawCompleteWithdrawalTxData` (`SmartContractUID`, `FromAddress`, `WithdrawalRequestHash`, `BTCTransactionHash`, `Amount`, `BTCDestination`), sign, and `POST SendRawCompleteWithdrawalTx` (type 28, no fee).

A cancel on a legacy vault is the same type 29 transaction, after which the vault's validators vote (type 30). From the enforcement height a legacy vault is frozen: transfers, withdrawals and cancels on it are refused, and types 28 and 30 are refused for every vault.

## V1 vBTC is retired

The raw V1 flow (`btcapi/BTCV2/GetTokenizationDetails`, `TokenizeBitcoin`, `WithdrawalCoinRawTX`, transaction types 17 to 21) was retired at block 7,400,500 on mainnet. The network no longer accepts V1 tokens, transfers or withdrawals, and V1 balances are frozen as they stand.
