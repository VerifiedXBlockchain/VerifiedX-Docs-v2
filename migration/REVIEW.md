# Content flagged during the v1 migration

The migration kept v1's wording. These are the problems the migrating agents found and left alone for a decision. Nothing was deleted.

## Facts that conflict

- **Block time:** learn/about-verifiedx says about 12 s (target 12, min 10, max 15) and node/validator says "12 seconds a block" twice; other material says 10 s.
- **Supply figures:** learn/about-verifiedx gives 132.7M effective supply and a 67.3M treasury; learn/coinomics also gives supply and burn figures. Confirm they agree.
- **Config path:** node/configuration says `~/RBX/Config/config.txt`; node/validator says `~/.local/share/RBX/Config/config.txt`.
- **"Sidechain":** build/sdk/cross-chain calls VerifiedX "a Bitcoin sidechain" (positioning is a Layer 1 reliever chain).
- **SEN:** build/trillium/overview expands SEN as "Self-Executing NFTs"; elsewhere it is "Self-Executing Nodes".
- **Bitcoin test network:** build/sdk/bitcoin-basics says Mempool.space and "Testnet" with `tb1` prefixes; build/sdk/reference/btc-client and the page's own troubleshooting say the VerifiedX signet.
- **Butterfly:** learn/applications calls it a "decentralized marketplace"; learn/butterfly-and-pulsexai calls it a payments and financial access app.
- **API counts:** build/setup says "five total API endpoints"; build/node-api/overview lists 13 namespaces. build/node-api/details ends "covers all 14 API controllers" but has 16 sections.
- **Trillium IDE URL:** build/trillium/overview links https://trillium.VFX.network; build/trillium/web-ide uses https://trillium.verifiedx.io.
- **Fees:** build/trillium/web-ide says "Gasless Deployment … without any transaction fees", which may conflict with how fees (burned) are described elsewhere.
- **Node API descriptions:** build/node-api/overview describes the Reserve API as "reserve block operations" and the Adjudicator API as "dispute resolution"; both may be wrong. Its Swagger URL lacks `/swagger`.

## Stale

- **Legacy names and links:** build/setup (github.com/ReserveBlockIO, RBXBuildInstructions.md, `reserveblockcore.exe testnet`, "RBX folder", `./rbxpublished`); wallet/troubleshooting ("RBX folder"); build/smart-contracts/overview (ReserveBlockIO/rbx-integration-js-examples); build/trillium/overview (ReserveBlockIO/Trillium); build/node-api/transaction-creation (ReserveBlockCore/... Ecdsa.cs link may be dead); build/web-api/master-node ("master nodes").
- **Roadmap:** resources/roadmap Q4 2026 lists "vBTC integration launches" and "Prism privacy features live"; vBTC V2 is on mainnet since 9.0. Q1 2027 lists "VFX integration launches".
- **Release-pinned links:** learn/applications download links point at GUI 9.0.1 release assets.
- **Wallet transactions:** wallet/transactions predates the 9.0 transaction types that wallet/vbtc names (Fee Raise, Release, Bitcoin Report); "Fungible Token Burn" is described as a transfer.
- **First launch:** wallet/first-launch describes a snapshot-import prompt; the snapshot pipeline's status is uncertain.
- **SDK migration notes:** build/sdk/reference/btc-client (old `vfx-btc-js` package) and build/sdk/reference/vfx-client ("v1.x to v2.x") predate Core-aligned 9.x versions.
- **Index pages:** node/overview is the old Core index and mostly links into Learn; build/overview has no SDK or Signet entry; resources/documents/overview omits the MiCA white paper and links Prism Privacy outside Documents.

## Stubs and loose ends

- learn/vbtc-defi-vaults and build/sdk/examples/applications only say "Activating Soon"; four SDK pages link to the latter as "Complete Applications".
- learn/security is generic boilerplate with nothing specific to VFX.
- resources/network-assets keeps a "What is VerifiedX Video" heading and embed code after the YouTube embed was removed: drop the section or link the video.
- resources/documents/whitepaper: the PDF is on S3 (opens instead of downloading); the local public/documents/ has only the old RBX whitepapers.
- Unlinked files in public/: Privacy Matrix, Prism Architecture/Explainer/FAQ, Privacy Layer paper, RBX/ReserveBlock whitepapers and LitePaper; network-assets vfx-banner.png, vfx-cube.png, vfx-cube-black-bg.jpg, vfx-wordmark-short.svg (actually the Butterfly mark), vbtc-ecosystem.jpg, ecosystem-console.png, website.png.
- learn/institutional/overview ends with a button to the VFX Ecosystem Console page, which looks like a leftover.
- node/beacons ends "Link is above on the first page", pointing at nothing.
- build/sdk/overview: "Next Steps" numbers two items "4."; "Issues" and "Discussions" have no links; no link to vBTC V2.

## Overlap

- learn/vbtc-protocol, learn/vbtc (About vBTC) and learn/bitcoin-integration cover the same how-it-works and attestation material.
- learn/institutional/overview and learn/institutional/custody-integration repeat Security Model, Institutional Benefits and the S3C summary.
- build/setup duplicates node/build-from-source and lists the config options twice plus again in node/configuration.
- wallet/validating overlaps node/validator; wallet/vault-accounts overlaps the reserve-accounts part of wallet/vbtc.
- build/trillium/web-ide overlaps the tIDE section of build/trillium/overview.
- build/sdk/reference/types overlaps the types sections inside vfx-client and btc-client.

## Placement

- learn/domains goes into code internals (Adnr.cs model, height-gated naming rules) and reads like Build reference.

## Typos and small errors kept from v1

"API Enpoint" (smart-contract pages), "Tranferring NFTs", "Trilliam" (node/overview), "rom here" and `WaleltUnlockTime=5` (build/setup), "exausted" and "Withdrawl" (build/node-api/example-transactions, wallet/transactions), missing comma before `Signature` in the C# sample (build/node-api/transaction-creation), literal `\^` in inline code (build/node-api/address-creation), Linux step numbering 9, 8, 9 so "skip to step 12" lands wrong and misplaced backticks in Windows step 6 (node/build-from-source), heading "Create Voting Topic Ownership" (build/node-api/fungible-tokens), uneven heading levels (wallet/overview).
