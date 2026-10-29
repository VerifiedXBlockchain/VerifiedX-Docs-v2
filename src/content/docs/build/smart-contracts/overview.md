---
title: "Smart Contracts"
description: Integrate VFX smart contracts with third-party applications through the Core CLI's API, with setup notes and an index of the operations.
sidebar:
  order: 0
---

This section covers integration for VFX Smart Contracts with third party applications via the Core CLI's API.

## Example Code

Checkout this repository which includes full examples of all the smart contract integrations in node/javascript:
<a href="https://github.com/ReserveBlockIO/rbx-integration-js-examples" target="_blank">https://github.com/ReserveBlockIO/rbx-integration-js-examples</a>

<p></p>

:::note[Tip]
Snippets from this repo are also included within the following docs, but the example repo will allow you to interact with the code.
:::

## General Notes

1. You will need a core CLI running with its API enabled
    - Either press `10` to enable the API in the CLI's interface
    - Or, you can launch it like so: `./VerifiedXCore enableapi`

2. If the wallet will be running on an alternate machine, you'll need to enable the `openapi` flag when launching
    - `./VerifiedXCore enableapi openapi`
    - This will allow you to communicate to the CLI's API outside of localhost

3. If you are planning on running it using openapi, it is recommended you seed an `apitoken` to block non-authenticated access.
    - `./VerifiedXCore enableapi openapi apitoken=random_lowercase_string`
    - Then, in all requests you will need to add this key/value into your headers: `{"apitoken": "random_lowercase_string"}`
    - If this is not included and/or is not the correct token, the API will throw a 403 error

4. There are many more API endpoints available. Please visit http://localhost:7292/swagger on the machine running the CLI+API to review and interact with everything that's available.

5. You'll see a reference to `CLI_BASE_URL` throughout the examples. This should be set to `http://localhost:7292` in most cases.

## Contents

1. [Compiling & Minting](/build/smart-contracts/compiling-and-minting/)

2. [Tranferring NFTs](/build/smart-contracts/transferring/)

3. [Burning NFTs](/build/smart-contracts/burning/)

4. [Evolving NFTs](/build/smart-contracts/evolving/)

5. [Auction Houses](/build/smart-contracts/auction-house/)

6. [Collections](/build/smart-contracts/collections/)

7. [Listings](/build/smart-contracts/listings/)
