---
title: "VFX Transaction & Signature Creation"
description: "Build, hash, sign, verify and broadcast a raw VFX transaction through the Core API without exposing the private key, and the Core 9.0.1 ledger rules."
sidebar:
  label: Transaction creation
  order: 4
---

## Summary:

The purpose of this document is to teach you how to create a transaction and sign the transaction to then broadcast over the VFX network. Please note that with this process you never need to expose your private key to the wallet or anywhere outside your own building application. At the end of this document in the extra section is how you can send a TX if your private key is associated with a wallet.

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

## How to create a VFX Transaction

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

   public long? UnlockTime { get; set; }

   public string Signature { get; set; }

   public long Height { get; set; }

   public TransactionType TransactionType { get; set; }

   public TransactionRating? TransactionRating { get; set; }

   public TransactionStatus? TransactionStatus { get; set; }

}
```

- **Id** - This field is auto generated and you do not need to do anything with

- **Hash** - This is created by the wallet once a full TX is prepared. The hash is computed over the plain concatenation, with no separators, of `Timestamp + FromAddress + ToAddress + Amount + Fee + Nonce + TransactionType + Data` (plus `UnlockTime` only when it is set). `TransactionType` is the enum name (`TX`, not `0`), and `Amount` and `Fee` are the decimal text (a whole amount reads `1.0`). The hash is SHA-256 of that string, then SHA-256 again over the lowercase hex text of the first result. The `GetTxHash` call below computes it for you.
- **ToAddress** - This is the VFX address in which the transaction is being sent to
- **FromAddress** - This is the VFX address in which the transaction is being sent from.
- **Amount** - This is the amount of VFX that is being sent in a transaction
- **Nonce** - This is the transaction counter for a given address. As transactions are sent this counter is increased by 1
- **Fee** - This is the near zero atomic fee that is associated with a transaction and is calculated through the wallet: the size of the transaction's JSON in bytes ÷ 1024 × 0.00002 VFX, at least 0.000003 VFX, rounded up to 8 decimal places. Fees are burned.
- **Timestamp** - This is a unix timestamp in seconds
- **Data** - This is the associated tx data for when a transaction is more than just a basic transfer of VFX (ex: NFTs, ADNRs, etc.). This can be left as _null_ if performing a basic VFX tx. Note that the raw transaction calls below read `"Data": null` as the text `null`, so the hash then ends in `TXnull`; leave the `Data` key out entirely to hash with empty data.
- **UnlockTime** - Only used by reserve (vault) account transactions. Leave it out or _null_ for a normal transaction.
- **Signature** - This is an ECDSA Signature where the message is always the Hash of the transaction.
- **Height** - This is the block height a TX is associated with once crafted. This is auto populated and can be left as 0 when creating a TX.
- **TransactionType** - This is from the enum below. If you are performing a basic TX then you would choose TransactionType.TX or 0.
- **TransactionRating** - The node rates the transaction itself when it is broadcast; a rating you send is ignored, so leave it _null._
- **TransactionStatus** - Set by the node; leave it _null._

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
    TKNZ_WD_ARB = 20, //retired: refused by the chain
    TKNZ_WD_OWNER = 21, //retired: refused by the chain
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

Now that you understand what each element is for you will learn how to craft a TX and send it to mempool for confirmation. The example below is a real testnet transaction (block 65,021), so the calls use the testnet API port `17292`; on mainnet use `7292` and `R…` addresses.

- You must first know the To and From address

  - To: xWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ
  - From: xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s

- You must get the next nonce for your from address
  **[http://localhost:17292/txapi/TXV1/GetAddressNonce/xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s](http://localhost:17292/txapi/TXV1/GetAddressNonce/xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s)**
   The response is as follow:
  `{"Result":"Success","Message":"Next Nonce Found.","Nonce":0}`
- The next nonce for the from address `(xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s)` is: 0

- You will also want to get a timestamp. You can either generate your own UNIX timestamp in seconds or use the wallet API to get it:
  - **[http://localhost:17292/txapi/TXV1/GetTimestamp](http://localhost:17292/txapi/TXV1/GetTimestamp)**
  - `{"Result":"Success","Message":"Timestamp Acquired.","Timestamp":1793533801}`
- You will then create your class of Transaction

```csharp
 Transaction tx1 = new Transaction {
   ToAddress = "xWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ",
   FromAddress = "xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s",
   Amount = 1.0M,
   Data = null,
   Nonce = 0,
   TransactionType = TransactionType.TX, // or 0
   Fee = 0.0M,
   Timestamp = 1793533801,
};
```

- You will then take that class and Json Serialize it and send it to the next API call to get the fee.

  `{"Hash":null,"ToAddress":"xWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ","FromAddress":"xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s","Amount":1.0,"Nonce":0,"Fee":0.0,"Timestamp":1793533801,"Data":null,"Signature":null,"Height":0,"TransactionType":0,"TransactionRating":null,"TransactionStatus":null}`
  **[http://localhost:17292/txapi/TXV1/GetRawTxFee](http://localhost:17292/txapi/TXV1/GetRawTxFee)**

  Response is as follows from the **POST** method:
  `{"Result":"Success","Message":"TX Fee Calculated","Fee":0.00000604}`

- You will take the fee **0.00000604** and paste it into your class. Now you have the following transactions:

```csharp
  Transaction tx2 = new Transaction{
      ToAddress = "xWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ",
      FromAddress = "xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s",
      Amount = 1.0M,
      Data = null,
      Nonce = 0,
      TransactionType = TransactionType.TX,
      Fee = 0.00000604M,
      Timestamp = 1793533801,
  };
```

- You will take that class and Json Serialize it again and send it to the **POST** method for hash.

  - `{"Hash":null,"ToAddress":"xWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ","FromAddress":"xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s","Amount":1.0,"Nonce":0,"Fee":0.00000604,"Timestamp":1793533801,"Data":null,"Signature":null,"Height":0,"TransactionType":0,"TransactionRating":null,"TransactionStatus":null}`

    **[http://localhost:17292/txapi/TXV1/GetTxHash](http://localhost:17292/txapi/TXV1/GetTxHash)**

    Response is as follows from the **POST** Method:

    `{"Result":"Success","Message":"Hash Calculated.","Hash":"f774360a86bf044b982ddcc2e6fcb1f3483177a521f9bd94733c2cfac7196a63"}`

    To check it yourself: the hashed string here is `1793533801xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45sxWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ1.00.000006040TXnull` (the `null` is the `Data` field sent as JSON null).

- You now have an almost completed TX. Now you simply need to take the hash `("f774360a86bf044b982ddcc2e6fcb1f3483177a521f9bd94733c2cfac7196a63")` and insert it into the classes Hash field. You will have a TX Class like this:

```csharp
Transaction tx3 = new Transaction{
   ToAddress = "xWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ",
   FromAddress = "xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s",
   Amount = 1.0M,
   Data = null,
   Nonce = 0,
   TransactionType = TransactionType.TX,
   Fee = 0.00000604M,
   Timestamp = 1793533801,
   Hash = "f774360a86bf044b982ddcc2e6fcb1f3483177a521f9bd94733c2cfac7196a63"
};
```

- All that is left now is to sign the hash. Whatever ECDSA library you are using to produce private keys will most likely have a signature method as well. You need to sign the hash (the hash text is the message) with the secp256k1 key and then combine it with the public key.

- Once signed the signature is DER encoded and converted to Base64 (toDer)

  The Public key from the address minus the hex identifier (remove the 04 at beginning of publickey if it is there) and then base58 encoded.
  Combine `a + a period + b`

  You would effectively have something that looks like this:

  - `MEUCIQDUv9BwYH4Gw0pzxOLH8/WQXRbCoFDCo5h1VwVWqi/3UQIgenGuQr1yVAUlU7tPG81PpBuT6lNvVjOH/XPchpqHhvo=.5E4DHQM6XsjAxxC9v72npK574LKocviirFyUaHmYDnQGb7r5Ry7VoqL2NLR1JcKPNjz1pnskQrTu5qCjxsZee7PX`
  - `MEUCIQDUv9BwYH4Gw0pzxOLH8/WQXRbCoFDCo5h1VwVWqi/3UQIgenGuQr1yVAUlU7tPG81PpBuT6lNvVjOH/XPchpqHhvo=` - This is the Base64 (toDer) signature script
  - `5E4DHQM6XsjAxxC9v72npK574LKocviirFyUaHmYDnQGb7r5Ry7VoqL2NLR1JcKPNjz1pnskQrTu5qCjxsZee7PX` - this is the public key with a Base58 Encoding on it minus the hex identifier of '04'
  - If you would like to see the method of signing it can be found here: **[https://github.com/VerifiedXBlockchain/VerifiedX-Core/blob/main/VerifiedXCore/EllipticCurve/Ecdsa.cs](https://github.com/VerifiedXBlockchain/VerifiedX-Core/blob/main/VerifiedXCore/EllipticCurve/Ecdsa.cs)**

- The method is **public static Signature sign(string message, PrivateKey privateKey)**. ECDSA signatures are randomized, so signing the same hash twice gives a different, equally valid signature.

- Once you have a signature you need to add it back to your Transaction class you have been creating. You should have this now:

```csharp
Transaction tx4 = new Transaction{
   ToAddress = "xWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ",
   FromAddress = "xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s",
   Amount = 1.0M,
   Data = null,
   Nonce = 0,
   TransactionType = TransactionType.TX,
   Fee = 0.00000604M,
   Timestamp = 1793533801,
   Hash = "f774360a86bf044b982ddcc2e6fcb1f3483177a521f9bd94733c2cfac7196a63",
   Signature = "MEUCIQDUv9BwYH4Gw0pzxOLH8/WQXRbCoFDCo5h1VwVWqi/3UQIgenGuQr1yVAUlU7tPG81PpBuT6lNvVjOH/XPchpqHhvo=.5E4DHQM6XsjAxxC9v72npK574LKocviirFyUaHmYDnQGb7r5Ry7VoqL2NLR1JcKPNjz1pnskQrTu5qCjxsZee7PX"
};
```

- With the signature in place you are ready to verify the TX.

  `{"Hash":"f774360a86bf044b982ddcc2e6fcb1f3483177a521f9bd94733c2cfac7196a63","ToAddress":"xWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ","FromAddress":"xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s","Amount":1.0,"Nonce":0,"Fee":0.00000604,"Timestamp":1793533801,"Data":null,"Signature":"MEUCIQDUv9BwYH4Gw0pzxOLH8/WQXRbCoFDCo5h1VwVWqi/3UQIgenGuQr1yVAUlU7tPG81PpBuT6lNvVjOH/XPchpqHhvo=.5E4DHQM6XsjAxxC9v72npK574LKocviirFyUaHmYDnQGb7r5Ry7VoqL2NLR1JcKPNjz1pnskQrTu5qCjxsZee7PX","Height":0,"TransactionType":0,"TransactionRating":null,"TransactionStatus":null}`
  **[http://localhost:17292/txapi/TXV1/VerifyRawTransaction](http://localhost:17292/txapi/TXV1/VerifyRawTransaction)**

- Passing: `{"Result":"Success","Message":"Transaction has been verified.","Hash":"f774360a86bf044b982ddcc2e6fcb1f3483177a521f9bd94733c2cfac7196a63"}`

- Should it fail. The response will contain something like:

  - `{"Result":"Fail","Message":"Transaction was not verified. Error: The timestamp of this transaction is too old or too far in the future."}`
  - `{"Result":"Fail","Message":"Transaction was not verified. Error: This transactions hash is not equal to the original hash."}`

- Once the payload above has a **"Success"** then you can send the same JSON out to be broadcasted

  - **[http://localhost:17292/txapi/TXV1/SendRawTransaction](http://localhost:17292/txapi/TXV1/SendRawTransaction)**
  - `{"Result":"Success","Message":"Transaction has been broadcasted.","Hash":"f774360a86bf044b982ddcc2e6fcb1f3483177a521f9bd94733c2cfac7196a63"}`

At this point you have successfully created a raw TX, signed it, and broadcasted it out

### You are now done.

![The broadcast transaction in the explorer](../../../../assets/media/integration/complete-transaction-image.png)

## Extra:

---

If you however do have the key associated to the wallet You can simply use the in built API to send a TX:

![SendTransaction in the Swagger page](../../../../assets/media/integration/api-transaction-image.png)
**http://localhost:17292/txapi/TXV1/SendTransaction/{faddr}/{taddr}/{amt}** (testnet; `7292` on mainnet)

```text
Faddr = xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s
Taddr = xWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ
Amt = 1.0
http://localhost:17292/txapi/TXV1/SendTransaction/xVQKToMgUsL7gMja2gfL9D7ahAN7iZE45s/xWDAi25ybtTexeEMsLAi4TGS6TY3sZGPgQ/1
Response body is: {"Result":"Success","Message":"Transaction has been broadcasted.","Hash":"<transaction hash>"}
```

The from address must be an account held by that node's wallet, and an encrypted wallet must be unlocked first.
