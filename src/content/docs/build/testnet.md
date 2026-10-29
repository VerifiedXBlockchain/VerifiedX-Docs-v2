---
title: "Testnet"
description: "Run the CLI and GUI on testnet, its ports and addresses, the VerifiedX signet and how to get test funds."
sidebar:
  order: 3
---

## CLI

You can access testnet by running the CLI with the `testnet` flag.

Testnet database files are stored as a sibling file to your mainnet db files with the suffix `test`.

All ports are one digit longer, prefixed with a `1`:

| | Mainnet | Testnet |
|---|---|---|
| Peer-to-peer | `3338`, `3339` | `13338`, `13339` |
| Validator API | `7294` | `17294` |
| Validator (FROST) | `7295` | `17295` |
| Validator (FROST) over TLS | `7296` | `17296` |
| Wallet API | `7292` | `17292` |

Thus, you would access swagger through this link: `http://localhost:17292/swagger`.


## GUI

You can launch the GUI in testnet mode by appending the `--testnet` flag through the command line when launching.

### MacOS

On MacOS, use this terminal command to launch into testnet:
```shell
/Applications/VFXWallet.app/Contents/MacOS/VFX\ Switchblade --testnet
```

### Windows
On Windows, use this terminal command to launch into testnet:
```shell
"C:\Program Files\VFXWallet\VFXWallet.exe" --testnet
```

> You can also update this in your shortcut's settings by right clicking to edit the properties, then updating the Target to the snippet above.

## Addresses

Please note that all testnet addresses begin with an `x` instead of an `R`.

## Important Links

Testnet Explorer: https://spyglass-testnet.verifiedx.io

Testnet Faucet: https://spyglass-testnet.verifiedx.io/faucet

## Bitcoin: the VerifiedX signet

For anything Bitcoin related, the VerifiedX testnet uses the VerifiedX signet, a private Bitcoin signet run by the VerifiedX team. It replaces Bitcoin testnet4. See [VerifiedX Signet](/build/signet/) for how it works, its explorer and APIs, and mining blocks on demand.

Bitcoin Signet Explorer: https://signet.verifiedx.io

Bitcoin Signet Esplora API: https://signet.verifiedx.io/api

The signet keeps Bitcoin's 10-minute blocks. A vBTC vault event (a deposit, or a withdrawal's payment) counts once 3 signet blocks are on top of its block. The testnet restarted from genesis in October 2026 for the move to the signet: every vault on it is watched (the attestation recording height is 400). See [vBTC](/build/vbtc/integration/).

Bitcoin addresses look the same as on other Bitcoin test networks (`tb1…`).

## Getting test funds

The [testnet faucet](https://spyglass-testnet.verifiedx.io/faucet) pays both testnet VFX and signet BTC:

1. Open the faucet and pick the **VFX** or **Signet BTC** tab.
2. Enter your address (a VFX address starting with `x`, or a signet address starting with `tb1`), the amount and your phone number.
3. Enter the code you receive by SMS. The faucet sends the funds and shows the transaction.

Each phone number can receive up to the limits shown on the faucet page (currently 1,000 VFX and 0.01 BTC in total). Signet BTC confirms in the next signet block, about 10 minutes. For more, ask in the `Testnet Faucet` channel on Discord.

The same faucet is available as an API: see [Web API: Faucet](/build/web-api/faucet/).

### For test automation

Teams that run automated tests against the testnet can ask for:

- **A faucet automation token**, which funds addresses through the faucet API without the SMS step.
- **Signet blocks on demand**, so a test does not wait about 10 minutes for each confirmation.

Both come with [Partner API access](/build/signet/#partner-api-access), which explains how to ask for it and how to call both APIs.

---

The developers will welcome your questions in the Discord.
