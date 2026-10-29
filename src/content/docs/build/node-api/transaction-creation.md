---
title: "VFX Transaction & Signature Creation"
description: "Build, hash, sign, verify and broadcast a raw VFX transaction through the Core API without exposing the private key, and the Core 9.0.1 ledger rules."
sidebar:
  label: Transaction creation
  order: 4
---

## Summary:

The purpose of this document is to teach you how to create a transaction and sign the transaction to then broadcast over the VFX network. Please note with this process you are never needed to expose your private key to the wallet or anywhere outside your own building application. At the end of this document in the extra section is how you can send a TX if your private key is associated with a wallet.

## Core 9.0.1 ledger rules

Core 9.0 shipped a batch of ledger and consensus rules switched off. Core 9.0.1 turns them on at one height (`LedgerRulesBatchHeight`): block **7,575,250** on mainnet and block **7,400** on testnet. Every validator and caster must run Core 9.0.1 before that height. What changes for integrators from that height:

- **`.btc` name create:** signed by the key of the Bitcoin address the name points at. The signed message is `<unix seconds>:<VFX owner>:<name>.btc` and is valid for 30 minutes. The name is sent without `.btc`. See [VFX Domain Services](/learn/domains/#creating-a-btc-name).
- **`.btc` name transfer:** carries the receiving Bitcoin key's acceptance, `<unix seconds>:<new VFX owner>:<name>.btc`, valid for 24 hours. See [`TransferAdnr`](/build/node-api/details/#adnr-management).
- **`.vfx` names (`AdnrCreate()`):** lowercase letters, digits and `-`, 1 to 65 characters, sent with no suffix. A label whose legacy `.rbx` name exists cannot be taken.
- **Token mints (`TokenMint()`):** refused on a paused contract, with more decimal places than the token's `DecimalPlaces`, or when the supply or the holder's balance would overflow. One mint per contract per block.
- **NFT `Update()`, `Transfer()`, `Burn()`, `Evolve()`, `Devolve()` and `ChangeEvolveStateSpecific()`:** `Data` must be in the array form. A single object, which used to be mined with no effect, is refused.
- **Evolve:** `Evolve()`, `Devolve()` and `ChangeEvolveStateSpecific()` only apply to a contract with the Evolving feature, and carry a body that keeps it.
- **Contract moves:** a block moves a contract (`Transfer()` or `Burn()`) at most once.
- **Vote topics (`VOTE_TOPIC`):** the function is `TopicAdd()` only. The chain sets the new topic's owner, tally, creation time and validator count; values sent for them are not used.
- **`DecShopCreate()`:** the shop's owner is the transaction's sender.
- **`TokenContractOwnerChange()`:** the new owner is the transaction's recipient (`ToAddress`).
- **Fee:** below 1 VFX (private transactions hash differently and are exempt).
- **Fractional amounts:** a transaction with a non-whole `Amount` must hash with that amount. A signature over a hash made with `0` is refused.
- **Recipient network:** `ToAddress` carries this network's version byte. A testnet address on mainnet, or the reverse, is refused (nodes already refuse it at admission).
- **Block producers (VRF seed):** a producer's VRF is seeded from its epoch's anchor block, 100 blocks below the epoch's first height, not from the parent block's hash. Epochs are 8,640 blocks counted from the activation height. A validator registered after an epoch's anchor produces from the next epoch.
- **Block size:** at most 3,000 transactions per block, the coinbase included.

The same height also turns on: a reserve's `Recover()` reading every pending row; no `Amount` on a reserve transaction other than a transfer; each key named once in a contract-call vBTC V2 transfer's `Data`; the replay guard kept by block time; token transfers that credit the recipient before debiting the sender; one `.btc` name per Bitcoin address, with delete and transfer acting only on the sender's own record; `TopicAdd()` judged only on state every node holds; shields that carry no nullifier; and the signer-age rule for the Bitcoin-report signer set.

## How to create an VFX Transaction

To first create a transaction you must understand how the transaction class is made. Below is the class in its full form and the enums associated with it.

```csharp
public class Transaction {

   public ObjectId Id { get; set; }

   public string Hash { get; set; }

   public string ToAddress { get; set; }

   public string FromAddress { get; set; }

   public decimal Amount { get; set; }

   public long Nonce { get; set; }

   public decimal Fee { get; set; }

   public long Timestamp { get; set; }

   public string? Data { get; set; }

   public string Signature { get; set; }

   public long Height { get; set; }

   public TransactionType TransactionType { get; set; }

   public TransactionRating? TransactionRating { get; set; }

   public TransactionStatus? TransactionStatus { get; set; }

}
```

- **Id** - This field is auto generated and you do not need to do anything with

- **Hash** - This is created by the wallet once a full TX is prepared. A hash consist of the follow pieces of information: `Timestamp + FromAddress + ToAddress + Amount + Fee + Nonce + TransactionType + Data`
- **ToAddress** - This is the VFX address in which the transaction is being sent to
- **FromAddress** - This is the VFX address in which the transaction is being sent from.
- **Amount** - This is the amount of VFX that is being sent in a transaction
- **Nonce** - This is the transaction counter for a given address. As transactions are sent this counter is increased by 1
- **Fee** - This is the near zero atomic fee that is associated with a transaction and is calculated through the wallet.
- **Timestamp** - This is a unix timestamp in seconds
- **Data** - This is the associated tx data for when a transaction is more than just a basic transfer of VFX (ex: NFTs, ADNRs, etc.). This can be left as _null_ if performing a basic VFX tx.
- **Signature** - This is an ECDSA Signature where the message is always the Hash of the transaction.
- **Height** - This is the block height a TX is associated with once crafted. This is auto populated and can be left as 0 when creating a TX.
- **TransactionType** - This is from the enum below. If you are performing a basic TX then you would choose TransactionType.TX or 0.
- **TransactionRating** - This is auto filled through TX Verify and can be left _null._
- **TransactionStatus** - This needs to be defaulted to 1.

The enums below match `VerifiedXCore/Models/Transaction.cs` in Core 9.0. Types 43, 45 and 46 are created by the validators and have no sender (`From` and `To` are `BTC_Attestation`, with no amount and no fee), so a client never builds them; it may still see them in blocks and transaction lists. Type 44 is an ordinary transaction signed by the withdrawal's requester.

```csharp
 public enum TransactionType
{
    TX = 0,
    NODE = 1,
    NFT_MINT = 2, //mint
    NFT_TX = 3, //transfer or other process (not for sale or burn)
    NFT_BURN = 4, //burn nft
    NFT_SALE = 5, //sale NFT
    ADNR = 6, //address dnr
    DSTR = 7, //DST shop registration
    VOTE_TOPIC = 8, //voting topic for validators to vote on
    VOTE = 9, //cast vote for topic
    RESERVE = 10, //create a reserve TX
    SC_MINT = 11, //standard sc mint
    SC_TX = 12, //standard sc tx
    SC_BURN = 13, //standard sc burn
    FTKN_MINT = 14, //fungible token mint
    FTKN_TX = 15, //fungible token tx
    FTKN_BURN = 16, //fungible token burn
    TKNZ_MINT = 17, //tokenization token mint
    TKNZ_TX = 18, //tokenization token tx
    TKNZ_BURN = 19, //tokenization token burn
    TKNZ_WD_ARB = 20,
    TKNZ_WD_OWNER = 21,
    VBTC_V2_VALIDATOR_REGISTER = 22, //validator registers for vBTC v2
    VBTC_V2_VALIDATOR_HEARTBEAT = 23, //validator heartbeat
    VBTC_V2_VALIDATOR_EXIT = 24, //validator exits the vBTC v2 pool
    VBTC_V2_CONTRACT_CREATE = 25, //create a vBTC v2 contract
    VBTC_V2_TRANSFER = 26, //transfer vBTC v2 tokens
    VBTC_V2_WITHDRAWAL_REQUEST = 27, //request a withdrawal to BTC
    VBTC_V2_WITHDRAWAL_COMPLETE = 28, //complete a withdrawal
    VBTC_V2_WITHDRAWAL_CANCEL = 29, //request a cancellation
    VBTC_V2_WITHDRAWAL_VOTE = 30, //validator votes on a cancellation
    VFX_SHIELD = 31,
    VFX_UNSHIELD = 32,
    VFX_PRIVATE_TRANSFER = 33,
    VBTC_V2_SHIELD = 34,
    VBTC_V2_UNSHIELD = 35,
    VBTC_V2_PRIVATE_TRANSFER = 36,
    VBTC_V2_BRIDGE_LOCK = 37, //lock vBTC for bridging to Base
    VBTC_V2_BRIDGE_UNLOCK = 38, //unlock vBTC after a burn on Base (legacy, single lock)
    VBTC_V2_BRIDGE_POOL_UNLOCK = 39, //pool unlock: credit vBTC from several locks to a VFX address
    VBTC_V2_BRIDGE_EXIT_TO_BTC = 40, //Base burn for a BTC exit: records the withdrawal on VFX
    VBTC_V2_BRIDGE_EXIT_TO_BTC_COMPLETE = 41, //after the BTC broadcast
    VBTC_V2_BRIDGE_EXIT_TO_BTC_FAIL = 42, //FROST failed for some locks: reverse and retry
    VBTC_V2_BTC_REPORT = 43, //Bitcoin headers and the vault transactions of one Bitcoin block (validators, sender-less)
    VBTC_V2_COIN_PIN = 44, //the requester re-pins its withdrawal at a higher Bitcoin fee rate (fee bump; watched vaults)
    VBTC_V2_BTC_REORG = 45, //Bitcoin reorganised below reported events: they are taken back (validators, sender-less)
    VBTC_V2_VAULT_REKEY = 46 //a vault's key is replaced by one the current validators made (validators, sender-less)
}

public enum TransactionStatus {
   Pending,
   Success,
   Failed,
   Reserved,
   CalledBack,
   Recovered,
   ReplacedByFee,
   Invalid = 999
}

public enum TransactionRating {
   A = 1,
   B = 2,
   C = 3,
   D = 4,
   E = 5,
   F = 6
}
```

Now that you understand what each element is for you will learn how to craft a TX and send it to mempool for confirmation.

- You must first know the To and From address

  - To: xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9
  - From: xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC

- You must get the next nonce for your from address
  **[http://localhost:7292/txapi/TXV1/GetAddressNonce/xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC](http://localhost:7292/txapi/TXV1/GetAddressNonce/xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC)**  
   The response is as follow:
  `{"Result":"Success","Message":"Next Nonce Found.","Nonce":38}`
- The next nonce for our from address `(xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC)` is: 38

- You will also want to get a timestamp. You can either generate your own UNIX timestamp in seconds or use the wallet API to get it:
  - **[http://localhost:7292/txapi/TXV1/GetTimestamp](http://localhost:7292/txapi/TXV1/GetTimestamp)**
  - `{"Result":"Success","Message":"Timestamp Acquired.","Timestamp":1672795597}`
- You will then create your class of Transaction

```csharp
 Transaction tx1 = new Transaction {
   ToAddress = "xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9",
   FromAddress = "xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC",
   Amount = 1.0M,
   Data = null,
   Nonce = 38,
   TransactionType = TransactionType.TX, // or 0
   Fee = 0.0M,
   Timestamp = 1672795597,
   TransactionRating = TransactionRating.A, //or 1
};
```

- You will then take that class and Json Serialize it and send it to the next API call to get the fee.

  ` {"Hash":null,"ToAddress":"xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9","FromAddress":"xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC","Amount":1.0,"Nonce":38,"Fee":0.0,"Timestamp":1672789611,"Data":null,"Signature":null,"Height":0,"TransactionType":0,"TransactionRating":1,"TransactionStatus":null}`
  **[http://localhost:7292/txapi/TXV1/GetRawTxFee](http://localhost:7292/txapi/TXV1/GetRawTxFee)**

  Response is as follows from the **POST** method:  
  `{"Result":"Success","Message":"TX Fee Calculated","Fee":0.0000028515625}`

- You will take the fee **0.0000028515625** and paste it into your class. Now you have the following transactions:

```csharp
  Transaction tx2 = new Transaction{
      ToAddress = "xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9",
      FromAddress = "xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC",
      Amount = 1.0M,
      Data = null,
      Nonce = 38,
      TransactionType = TransactionType.TX,
      Fee = 0.0000028515625M,
      Timestamp = 1672795597,
      TransactionRating = TransactionRating.A, //or 1
  };
```

- You will take that class and Json Serialize it again and send it to the **POST** method for hash.

  - `{"Hash":null,"ToAddress":"xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9","FromAddress":"xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC","Amount":1.0,"Nonce":38,"Fee":0.0000028515625,"Timestamp":1672789611,"Data":null,"Signature":null,"Height":0,"TransactionType":0,"TransactionRating":1,"TransactionStatus":null}`

    **[http://localhost:7292/txapi/TXV1/GetTxHash](http://localhost:7292/txapi/TXV1/GetTxHash)**

    Response is as follows from the **POST** Method:

    `{"Result":"Success","Message":"TX Fee Calculated","Hash":"9528d9693a824e55c456bd8646df10a060e7d6bdfcf0d5e04fcbfec9d718742a"}`

- You now have an almost completed TX. Now you simply need to take the hash `(“9528d9693a824e55c456bd8646df10a060e7d6bdfcf0d5e04fcbfec9d718742a”)` and insert it into the classes Hash field. You will have a TX Class like this:

```csharp
Transaction tx3 = new Transaction{
   ToAddress = "xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9",
   FromAddress = "xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC",
   Amount = 1.0M,
   Data = null,
   Nonce = 38,
   TransactionType = TransactionType.TX,
   Fee = 0.0000028515625M,
   Timestamp = 1672795597,
   TransactionRating = TransactionRating.A, //or 1
   Hash = "9528d9693a824e55c456bd8646df10a060e7d6bdfcf0d5e04fcbfec9d718742a"
};
```

- All that is left now is to sign the hash. Whatever ECDSA library you are using to produce private keys will most likely have a signature method as well. You need to sign the hash and then combine it with the public key.

- Once signed the signature is converted to Base64 (toDer)

  The Public key from the address minus the hex identifier (remove the 04 at beginning of publickey if it is there) and then base58 encoded.  
  Combine `a + a period + b`

  You would effectively have something that looks like this:

  - ` MEYCIQDd141oBoBfcznYAI05CnoCWVhEkMaBpthmqG8bLjusqgIhAOkywWZ2h0cYjcbFx6MT5Yc1pJmRdQvMzZdQP4O2O3QE.`
  - `5msmMuPGKwpvtYofSdr6zk1AWG5Rz1vmf5z5DTVb6PYXibwovzkKM7Eg2BTQ5KDeUKwSyEAzHq9KjTFc1hyhfiFg`
  - `MEYCIQDd141oBoBfcznYAI05CnoCWVhEkMaBpthmqG8bLjusqgIhAOkywWZ2h0cYjcbFx6MT5Yc1pJmRdQvMzZdQP4O2O3QE` - This is the Base64 (toDer) signature script
  - `5msmMuPGKwpvtYofSdr6zk1AWG5Rz1vmf5z5DTVb6PYXibwovzkKM7Eg2BTQ5KDeUKwSyEAzHq9KjTFc1hyhfiFg` - this is the public key with a Base58 Encoding on it minus the hex identifier of ‘04’
  - If you would like to see the method of signing it can be found here:**[https://github.com/VerifiedXBlockchain/VerifiedX-Core/blob/main/ReserveBlockCore/EllipticCurve/Ecdsa.cs](https://github.com/VerifiedXBlockchain/VerifiedX-Core/blob/main/ReserveBlockCore/EllipticCurve/Ecdsa.cs)**

- The method is **public static Signature sign(string message, PrivateKey privateKey)**

- Once you have a signature you need to add it back to your Transaction class you have been creating. You should have this now:

```csharp
Transaction tx3 = new Transaction{
   ToAddress = "xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9",
   FromAddress = "xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC",
   Amount = 1.0M,
   Data = null,
   Nonce = 38,
   TransactionType = TransactionType.TX,
   Fee = 0.0000028515625M,
   Timestamp = 1672795597,
   TransactionRating = TransactionRating.A, //or 1
   Hash = "9528d9693a824e55c456bd8646df10a060e7d6bdfcf0d5e04fcbfec9d718742a"
   Signature = "MEUCIQCUckWn1yDGpyQfbrylYMg50pOn2LrTyvErwcPA6CMKNQIgJYUxe1/xJ+MVnprGgY7tYR3fDZyqtarlgaailYBC/Ek=.5msmMuPGKwpvtYofSdr6zk1AWG5Rz1vmf5z5DTVb6PYXibwovzkKM7Eg2BTQ5KDeUKwSyEAzHq9KjTFc1hyhfiFg"
};
```

- With the signature in place you are ready to verify the TX.

  `{"Hash":"9528d9693a824e55c456bd8646df10a060e7d6bdfcf0d5e04fcbfec9d718742a","ToAddress":"xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9","FromAddress":"xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC","Amount":1.0,"Nonce":38,"Fee":0.0000028515625,"Timestamp":1672789611,"Data":null,"Signature":"MEUCIQCUckWn1yDGpyQfbrylYMg50pOn2LrTyvErwcPA6CMKNQIgJYUxe1/xJ+MVnprGgY7tYR3fDZyqtarlgaailYBC/Ek=.5msmMuPGKwpvtYofSdr6zk1AWG5Rz1vmf5z5DTVb6PYXibwovzkKM7Eg2BTQ5KDeUKwSyEAzHq9KjTFc1hyhfiFg","Height":0,"TransactionType":0,"TransactionRating":1,"TransactionStatus":null}`
  **[http://localhost:7292/txapi/TXV1/VerifyRawTransaction](http://localhost:7292/txapi/TXV1/VerifyRawTransaction)**

- Passing: `{"Result":"Success","Message":"Transaction has been verified.","Hash":"67d97333e5b62abfd6dc8d28a3200677a53b58526aecafd80190b13c5507083e"}`

- Should it fail. The response will contain something like:

  - `{"Result":"Fail","Message":"Transaction was not verified. Error: The timestamp of this transactions is too old to be sent now."}`
  - `{"Result":"Fail","Message":"Transaction was not verified. Error: This transactions hash is not equal to the original hash."}`

- Once the payload above has a **“Success”** then you can send the TX out to be broadcasted

  - {"Hash":"67d97333e5b62abfd6dc8d28a3200677a53b58526aecafd80190b13c5507083e","ToAddress":"xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9","FromAddress":"xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC","Amount":1.0,"Nonce":38,"Fee":0.0000028515625,"Timestamp":1672795597,"Data":null,"Signature":"MEQCIF+sAjfQ07bBRxjv7eFwlcoz5OUn3t8rRAkdWqUJj1MRAiARlubEIprX2tlHw6eBUZUGTDOGf9/IzdKSte67m0Y6pw==.5msmMuPGKwpvtYofSdr6zk1AWG5Rz1vmf5z5DTVb6PYXibwovzkKM7Eg2BTQ5KDeUKwSyEAzHq9KjTFc1hyhfiFg","Height":0,"TransactionType":0,"TransactionRating":1,"TransactionStatus":null}

  - **[http://localhost:7292/txapi/TXV1/SendRawTransaction](http://localhost:7292/txapi/TXV1/SendRawTransaction)**
  - `{"Result":"Success","Message":"Transaction has been broadcasted.","Hash":"67d97333e5b62abfd6dc8d28a3200677a53b58526aecafd80190b13c5507083e"}`

At this point you have successfully created a raw TX, signed it, and broadcasted it out

### You are now done.

![The broadcast transaction in the explorer](../../../../assets/media/integration/complete-transaction-image.png)

## Extra:

---

If you however do have the key associated to the wallet You can simply use the in built API to send a TX:

![SendTransaction in the Swagger page](../../../../assets/media/integration/api-transaction-image.png)
**[http://localhost:7292/txapi/TXV1/SendTransaction](http://localhost:7292/txapi/TXV1/SendTransaction/)/faddr/taddr/amt**

```
Faddr = xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC
Taddr = xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9
Amt = 1.0
http://localhost:7292/txapi/TXV1/SendTransaction/xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC/xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9/1
Response body is: Success! TxId: a09f62b718c7552c33fd5fe213341af39881668fa41ad9ffbe67d3140739aa4b
```
