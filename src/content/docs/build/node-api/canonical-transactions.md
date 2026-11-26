---
title: "Canonical Raw Transactions"
description: "From Core 9.2, a raw transaction's Amount and Fee have one accepted spelling, Data is hashed exactly as it is sent, and Data that is JSON is read by one strict reader. What a client building raw transactions must send."
sidebar:
  label: Canonical transactions
  order: 5
---

A transaction's hash covers the text of its fields, not only their values. Until Core 9.2, one transaction could be written several ways (`1`, `1.0` and `1.00` for the same amount; Data re-written by the node before hashing; JSON that different readers read differently), and each spelling had its own hash. Core 9.2 gives every raw transaction one form, through three rules that switch on together:

| Rule | Height name in Core | What it requires |
|---|---|---|
| One spelling of Amount and Fee | `CanonicalInputHeight` | The shortest decimal with at least one digit after the point |
| Data as sent | `RawDataVerbatimHeight` | The raw routes hash and keep Data exactly as it arrived |
| Strict Data reader | `StrictDataReaderHeight` | Data that is a JSON object or array is strict JSON |

**When they apply:** testnet from block **230,750**. On mainnet they are not set yet; they switch on with the release that sets a mainnet height. A transaction is judged for the next block, so a client should send the canonical form now on both networks: it is accepted before the height as well.

The hash itself is unchanged (see [Transaction Creation](/build/node-api/transaction-creation/)):

```text
Hash = SHA-256( lowercase hex of SHA-256( Timestamp + FromAddress + ToAddress + Amount + Fee + Nonce + TransactionType + Data [+ UnlockTime] ) )
```

The fields are joined in that order with no separators, `TransactionType` is the enum name (`TX`, `VBTC_V2_TRANSFER`), and `UnlockTime` is added only when it is set. What the rules fix is the text that goes into `Amount`, `Fee` and `Data`.

## Amount and Fee

From the height, `Amount` and `Fee` are each written one way: **the shortest decimal with at least one digit after the point.**

| Value | Accepted | Refused |
|---|---|---|
| one | `1.0` | `1`, `1.00` |
| one and a half | `1.5` | `1.50` |
| zero | `0.0` | `0`, `0.00` |
| a fee of 0.000006 | `0.000006` | `0.00000600` |

- The rule reads the number as the transaction arrived, before the node does anything to it. A transaction that breaks it is refused with `A transaction's Amount must be written as the shortest decimal with at least one digit after the point (for example 1.0, 1.5 or 0.0).` (or the same for `Fee`).
- The node no longer tries other spellings when it checks a hash. A transaction signed over `1` is not the transaction that carries `1.0`.
- Hash the plain decimal text, never an exponent. The node reads `6e-7` in the request body as `0.0000006` and hashes `0.0000006`, so a client that puts `6e-7` into its own hash signs a different hash.
- `GetRawTxFee` returns the fee in this spelling from the height (`0.000006`, not `0.00000600`). Use it as returned.
- Two rules from earlier releases still hold: a non-zero `Fee` must have decimal places, and a transaction with an `UnlockTime` may not have `Data` ending in a digit or `-`.
- Private transactions: a shield's `Amount` follows the rule; the other private types do not hash their amounts and are not judged by it.

**JavaScript:** `JSON.stringify(1.0)` writes `1`, which is refused. Write whole numbers with their `.0` yourself (build the JSON text, or use the [SDK](/build/sdk/external-signing/)). Spyglass's raw hash, verify and send routes (see [Raw](/build/web-api/raw/)) add the `.0` to a whole-number top-level `Amount` or `Fee` before they pass the transaction on; its fee route and the node's own routes do not.

## Data is hashed exactly as sent

The raw routes are `GetRawTxFee`, `GetTxHash`, `VerifyRawTransaction` and `SendRawTransaction` (under `txapi/TXV1/`). Before the height they parsed `Data` and wrote it back out, so the hash covered the node's re-written text. From the height they keep `Data` as it arrived:

| `Data` in the request body | What is hashed and stored |
|---|---|
| a JSON object or array, `"Data": {"Function":"…"}` | the exact text of that value, byte for byte |
| a JSON string, `"Data": "a note"` | the string's value, without the quotes |
| `null`, or no `Data` key | nothing: the hash ends with the `TransactionType` |

**Order and spacing inside Data now matter.** The hash covers Data's exact text: the order of its keys, its spaces, and how its numbers and strings are written. `{"a":1,"b":2}` and `{"b":2,"a":1}` are the same JSON and two different hashes. So:

1. Build the Data text once.
2. Send that same text, byte for byte, to `GetRawTxFee`, `GetTxHash`, `VerifyRawTransaction` and `SendRawTransaction`.
3. Do not parse and re-serialize the transaction between those calls: re-serializing can reorder keys, change spacing or re-spell numbers, and the transaction sent is then not the one that was hashed and signed.

The order of the other fields in the request body does not matter; only the text of Data is kept.

Refused from the height:

- **Data sent as a string that holds JSON**, such as `"Data": "{\"Function\":\"Transfer()\"}"`, for every type except a plain transfer (`TX`): `Data was sent as a string that holds JSON. Send Data as the JSON object or array itself…`. Send the object or array itself. If a builder gave you Data as a string, put that string's text into the body as the JSON value, unchanged (do not decode it and encode it again).
- **A string Data that starts or ends with whitespace**: the node's store trims a string's ends, so the stored transaction would no longer match its hash.
- **A body the node cannot read Data from**: `Data could not be read as it was sent…`. Send the transaction as one JSON object.

Routes that build a transaction for you and keep it on the node (the vBTC `GetRaw…` and `SendRaw…` pairs in [Raw vBTC integration](/build/vbtc/raw-integration/)) are not affected: you sign the returned `Hash` and submit the hash, and the node sends the Data it built.

## Strict JSON in Data

From the height, Data that is a JSON object or array is read once, by one strict reader, in validation and when the transaction is applied. Data that the reader refuses is refused on admission and in a block. The reader follows RFC 8259 with fixed settings:

- a name used twice in one object is refused, and so are two names that differ only in case (`"Amount"` and `"amount"`);
- names must match exactly: `"amount"` does not fill `Amount`, and Data that names a field in the wrong case is refused;
- comments, trailing commas, single quotes, unquoted names, hexadecimal numbers, numbers with leading zeros, `NaN`, `undefined` and anything after the closing bracket are refused;
- a number with a fraction or an exponent is read as an exact decimal, never through a binary float, and refused when a decimal cannot hold it exactly (more than 28 significant digits);
- strings stay strings (a date-like string is not converted), and an escape that is not valid UTF-16 (a lone surrogate) is refused;
- nesting deeper than 64 levels is refused.

Plain text Data, such as a memo, is not JSON and is not read by this rule.

## Checklist for a raw client

- `Amount` and `Fee` as the shortest decimal with at least one digit after the point: `1.0`, `0.0`, `0.000006`.
- No exponents in the Amount and Fee text you hash.
- Data as a JSON object or array, not a string holding JSON.
- One Data text, sent unchanged to every raw route.
- Data is strict JSON with each name spelled once, in the case the call expects.
- For a plain transfer, leave `Data` out or send `null`; the hash then ends with `TX`.

The [JavaScript SDK](/build/sdk/external-signing/) follows these rules from version 9.1.4: it hashes Amount and Fee in their canonical text, sends Data as the JSON value, and checks the node's hash against the Data text it sent before it signs. It sends through Spyglass, whose hash, verify and send routes add the `.0` to a whole-number Amount or Fee that `JSON.stringify` writes without one.
