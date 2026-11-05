---
title: "VFX Integration Setup"
description: "Set up the Core CLI for a third-party integration: wallets, building, config, the RPC interface, testnet and recommended practices for exchanges."
sidebar:
  order: 2
---

## Summary

This document is intended to be used by all third-party integrators including, but not limited to, exchanges, third-party APIs, explorers, web tools/web wallets, and any other integrable products that the core CLI can connect to.

This document will outline the core CLI functions and give recommended practices. Please note that you should always follow the highest levels of security based on your own environment. This document is merely a guide to get you up and running.


## Wallet Information

Currently VFX has both a GUI and CLI wallet. These wallets will run in all environments **(windows, linux, and mac)**.
The VFX Core was built with **.Net 6 and C#.**
The VFX GUI was built with **Flutter/Dart**

> .Net 6 can be found here: [https://dotnet.microsoft.com/en-us/download/dotnet/6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)

> The recommended IDE for VFX is Visual Studio 2022, or Visual Code.

> It is recommended for production level environments to run the CLI and communicate through the API. For personal use the GUI wallet is more than suitable.

**You can find pre-compiled binaries here:**  
CLI - [https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases](https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases)  
GUI - [https://github.com/VerifiedXBlockchain/VerifiedX-GUI/releases](https://github.com/VerifiedXBlockchain/VerifiedX-GUI/releases)

If you are wanting to build from source, please choose the correct repo from here:
**https://github.com/VerifiedXBlockchain**

VFX wallet generates addresses based on the ECDSA curve.

Mainnet addresses start with an `R`.
Testnet addresses start with an `x`.

For the VFX P2P Layer, the wallet is using SignalR. More information on SignalR can be found here: **https://dotnet.microsoft.com/en-us/apps/aspnet/signalr**

For Beacons and asset transfer the wallet runs a separate HTTP server on port 23339 (testnet 33339), so asset transfers never interfere with the P2P layer. See [Beacons](/node/beacons/).

The wallet is a multi-threaded application. Normal performance has been consistent with 2 CPU Cores - 2GB of ram. Any less than the recommended could result in slowed performance. An ideal setup is 3+ CPU Cores and 4 GB of ram. Your operating system will also determine this. As an example, Windows needing more resources you might want more, however a Linux with no GUI will require less.

The wallet main connection port 3338 must be configured to at least allow outgoing. If you do not want people connecting to you simply do not open that port for any incoming connections.

## Compile your own CLI

If you are wanting to compile your own CLI from source here is how to do this.  
The instructions below can be found here: [Build Instructions](/node/build-from-source/)

### Linux

Linux Install For Ubuntu 22.04:

1. `sudo apt-get update && sudo apt-get install -y dotnet-sdk-6.0`
2. `sudo apt-get update && sudo apt-get install -y aspnetcore-runtime-6.0`
3. Run `dotnet --version`. You should see a version number of 6.0.xxx
4. `mkdir vfx` - Makes a directory for VFX
5. `cd vfx`
6. - Clone the repo with git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`
   - Or download the packaged release (`verifiedx-core-linux-x64.zip` or `verifiedx-core-linux-arm64.zip`) from https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. If you do this, unzip it, navigate to that folder, and skip to step 11, running `./VerifiedXCore` instead. Release builds are self-contained and don't need .NET.
7. `cd VerifiedX-Core`
8. `dotnet build` - There should be 0 (zero) errors.
9. `dotnet publish VerifiedXCore/VerifiedXCore.csproj -c Release -r linux-x64 --output ./vfxpublished`
   > Please note the `linux-x64` can be changed if you are on a different architecture, for example `linux-arm64`.
10. `cd vfxpublished`
11. `dotnet VerifiedXCore.dll`

From here you are done. The wallet will be running. To turn on the API simply type `10` and press enter, or pass it in as a command argument.

`dotnet VerifiedXCore.dll enableapi`

You are done! You should now see a wallet running! Some common errors are usually related to file permissions. Please ensure you have given proper permission to the newly created data folder (`~/.local/share/RBX`, a legacy folder name the code still uses).

### Windows

1. Install the latest .NET 6 SDK from here: **https://dotnet.microsoft.com/en-us/download/dotnet/6.0** Once that is installed follow the steps below.
2. Create a directory for VFX and then open a command prompt as administrator and navigate to that directory.
3. Please ensure you have a working version of git installed.
4. - Clone the repo with git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`
   - Or download the packaged release `verifiedx-core-win-x64.zip` from https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. If you do this, unzip it, navigate to that folder, and skip to step 9, running `VerifiedXCore.exe` instead.
5. `cd VerifiedX-Core`
6. `dotnet build` - There should be 0 (zero) errors.
7. `dotnet publish VerifiedXCore/VerifiedXCore.csproj -c Release -r win-x64 --output ./vfxpublished`
   > please note the `win-x64` can be changed if you are on a different architecture
8. `cd vfxpublished`
9. `dotnet VerifiedXCore.dll` (or run `VerifiedXCore.exe`)

### macOS

1. Install the latest .NET 6 SDK from here: **https://dotnet.microsoft.com/en-us/download/dotnet/6.0** Once that is installed follow the steps below.
2. Create a directory for VFX, then open a terminal and navigate to that directory.
3. Please ensure you have a working version of git installed.
4. - Clone the repo with git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`
   - Or download the packaged release (`verifiedx-core-osx-arm64.zip` for Apple silicon, `verifiedx-core-osx-x64.zip` for Intel) from **https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/**. If you do this, unzip it, navigate to that folder, and skip to step 9, running `./VerifiedXCore` instead.
5. `cd VerifiedX-Core`
6. `dotnet build` - There should be 0 (zero) errors.
7. `dotnet publish VerifiedXCore/VerifiedXCore.csproj -c Release -r osx-x64 --output ./vfxpublished`
   > please note the `osx-x64` should be `osx-arm64` on Apple silicon.
8. `cd vfxpublished`
9. `dotnet VerifiedXCore.dll`

## Wallet Config Setup

### Summary

The point of this section is to outline the config file setup and features it has. The file is `config.txt`: `~/rbx/Config/` on macOS, `~/.local/share/RBX/Config/` on Linux and `%LOCALAPPDATA%\RBX\Config\` on Windows. On testnet the folders are `RBXTest` (macOS `rbxtest`) and `ConfigTestNet`. `RBX` is a legacy folder name the code still uses. Write one `Key=Value` per line with no blank lines: the CLI stops reading at the first empty line. The value is everything after the first `=`. See [CLI Configuration](/node/configuration/) for every key.

1. Port (default is 3338)

   - Type `int`
   - Ex: `Port=3338.`
   - This is the port for all p2p functions. This should remain as 3338.

2. APIPort (default is 7292)

   - Type `int`
   - Ex: `APIPort=7292`
   - This is the port to call the API. This may be changed to whatever you want.

3. WalletPassword (default is null)

   - Type `string`
   - Ex: `WalletPassword=SomePassword1234!`
   - This is a password that will lock all functions in wallet and require you input a password to unlock wallet functions.

4. AlwaysRequireWalletPassword (default is false)

   - Type `boolean`
   - Ex: `AlwaysRequireWalletPassword=true`
   - If set to true you will be required to input password before every function call.

5. APIPassword (default is null)

   - Type `string`
   - Ex: `APIPassword=SomePassword1234!`
   - This is a password set to lock down control of the API. This password must be inputted to call any API function.
   - You will need to call `/api/V1/UnlockWallet/{password}` to unlock the API with this password.

6. AlwaysRequireAPIPassword (default is false)

   - Type `boolean`
   - Ex: `AlwaysRequireAPIPassword=true`
   - If set to true then you must include the password in all API requests, as the segment before the action (`/api/V1/{password}/<Action>`, for example `/api/V1/{password}/GetWalletInfo`).

7. APICallURL (default is null)

   - Type `string`
   - Ex: `APICallURL=https://mycallbackurl.com`
   - This URL is used to send incoming transactions to an outside URL. This is something used for incoming deposits or other notification services.

8. WalletUnlockTime (default is 15)

   - Type `int`
   - Ex: `WalletUnlockTime=5`
   - This is the amount of time once a password has been entered the wallet will remain unlocked and not need password again. If any of the RequirePasswords above are set to true, then it will override this setting and require the password everytime.

9. ChainCheckPoint (default is false)

   - Type `Boolean`
   - Ex: ChainCheckPoint=true
   - This is a feature that will turn on chain check points. What this will do is create a FULL copy of the chains state and back it up and create a checkpoint you can revert back to in the event your current structure becomes corrupted.

10. ChainCheckPointInterval (default is 12)

    - Type `int`
    - Ex: `ChainCheckPointInterval=4`
    - This interval is in hours and means it will run the checkpoint every X amount of hours. Use 1 or more.
    - Core 9.0.2 reads `ChainCheckPointInterval` and the older spelling `ChainCheckPointInternal`. Earlier versions read only `ChainCheckPointInternal`.

11. ChainCheckPointRetain (default is 2)

    - Type `int`
    - Ex: `ChainCheckPointRetain=4`
    - Retain is what will determine how many backups to keep before it will begin to remove the oldest backup to make room for new one.

12. ChainCheckPointLocation (default is the Checkpoint folder in the data directory)

    - Type `string`
    - Ex: `ChainCheckPointLocation=C:\somelocation\otherthan\default\`
    - Core 9.0.2 reads `ChainCheckPointLocation` and the older spelling `ChainCheckpointLocation`. Earlier versions read only `ChainCheckpointLocation`.
    - If the default path is not wanted you can setup a new location for them to go to.

13. APICallURLLogging (default is false)

    - Type `Boolean`
    - Ex: `APICallURLLogging=true`
    - This will debug the API call URL in the event there is an issue with TX’s being sent to your URL. This is recommended to be turned on during the initial testing of your URL.

14. ValidatorAddress (default is null)

    - Type `string`
    - Ex: `ValidatorAddress=RBcHyS2AF4Z4jgzTLZNBVLvtxQ6MtB2vUN`
    - You can input a default validator address to instantly start validating. Please note you must also import the wallet address through the launch commands. Ex: `VerifiedXCore.exe privkey=MyPrivateKey` (Linux and macOS: `dotnet VerifiedXCore.dll privkey=MyPrivateKey`).

15. ValidatorName (default is new guid)

    - Type `string`
    - Ex: `ValidatorName=MyValidatorVFX1`
    - This is the name for the above validator that will be used. Once validator has been imported once then these settings won’t do anything and can be removed or left there.

16. NFTTimeout (default is 15 secs)

    - Type `int`
    - Ex: `NFTTimeout=5`
    - This will control the timeout for processing an incoming NFT

17. PasswordClearTime (default is 10 mins)

    - Type `int`
    - Ex: `PasswordClearTime=5`
    - This will control the clear time for an encrypted wallet's password

18. AutoDownloadNFTAsset (default is true in the file written at first run; false if the key is missing)

    - Type `Boolean`
    - Ex: `AutoDownloadNFTAsset=false`
    - This will control whether or not an NFT's asset is automatically downloaded
19. IgnoreIncomingNFTs (default is false)

    - Type `Boolean`
    - Ex: `IgnoreIncomingNFTs=false`
    - This will control whether or not incoming NFTs are processed or just added as a TX record

20. RejectAssetExtensionTypes (default is a List of rejected assets)

    - Type `List of string`
    - Ex: `RejectAssetExtensionTypes=.iso,.apk,.pdf` (from Core 9.0.2, `pdf` and `.pdf` are the same entry and spaces around entries are ignored; earlier versions need the leading dot and no spaces)
    - This will add extension types to the already defined list and will reject any NFT assets with these known extension types

21. AllowedExtensionsTypes (default is null)

    - Type `List of string`
    - Ex: `AllowedExtensionsTypes=.doc,.xls` (from Core 9.0.2 the leading dot is optional and the match ignores case; earlier versions need the dot and the list's exact case)
    - This will remove extension types from the already defined list and will allow any NFT assets with these known extension types to be downloaded

An example config setup could appear like this:
![Example config.txt](../../../assets/media/integration/config-example.png)

> The full list of keys, including the ones added since, is on [CLI Configuration](/node/configuration/).

## RPC Interface Connection

#### Mainnet : http://localhost:7292/

#### TestNet: http://localhost:17292/

> The ports above can be changed in the config document.

The config setting is APIPort=[Insert new Port number, no brackets]

Example: APIPort=1337

The default ports are:

Mainnet : 7292
Testnet : 17292

The API is enabled with the `enableapi` launch argument (or menu option `10`); it is off by default. The core CLI groups its endpoints by controller. The main ones are:

1. General - /api/V1 and /api/V2
2. Transactions - /txapi/TXV1
3. Smart Contracts - /scapi/SCV1
4. Tokens - /tkapi/TKV2
5. Beacons - /bcapi/BCV1
6. Voting - /voapi/VOV1
7. Reserve (vault) accounts - /rsapi/RSV1
8. Bitcoin - /btcapi/BTCV2
9. vBTC - /vbtcapi/VBTC
10. Decentralized shops and auctions - /dstapi/DSTV1 and /wsapi/WebShopV1

See the [Node API reference](/build/node-api/overview/) for the endpoints.

## RPC Interface Config

Before interfacing with RPC You will want to ensure you have the config settings you desire.

The main config options are the following:

1. APIPort
   - Changes default API port to something else
   - `APIPort=1337`
2. APIPassword
   - Creates an API password to access all endpoints. Password is stored for 15 minutes or whatever is specified in WalletUnlockTime
   - `APIPassword=SomePassword123!`
3. AlwaysRequireAPIPassword
   - This makes the password required for every call regardless of WalletUnlockTime
   - `AlwaysRequireAPIPassword=true`
4. APICallURL
   - This is a custom URL that whenever a transaction is received will be called to deliver this information
   - `APICallURL=http://somecustomurl.com/api/`
5. WalletUnlockTime
   - Sets the time a password will keep the wallet unlocked when entered in minutes
   - `WalletUnlockTime=5`

## RPC Interface

The VerifiedX Core CLI uses a json based interface. You will want to create some type of Http client request and send “application/json” to the interface. From there you will want to await a result (post) from the client.

The best way to test the interface is to use Swagger.

The swagger location can be found here:

Mainnet: http://localhost:7292/swagger/index.html
Testnet: http://localhost:17292/swagger/index.html

A node started with `openapi` serves Swagger only to callers that send its `apitoken` header.
Each API Endpoint has a list of methods with a description. Some of the most commonly used endpoints are as follows:

```text
/api/V1/
    CheckStatus
    CheckPasswordNeeded
    GetIsWalletEncrypted
    GetIsEncryptedPasswordStored
    GetEncryptWallet/{password}
    GetDecryptWallet/{password}
    GetEncryptLock
    GetCLIVersion
    GetWalletInfo
    GetAllAddresses
    GetValidatorAddresses
    ImportPrivateKey/{key}/{scan?}
    GetNewAddress
    SendTransaction/{from}/{to}/{amount}
    StartValidating/{address}/{username}
    TurnOnValidator/{id}
    TurnOffValidator/{id}
    GetValidatorInfo/{address}
    SendBlock/{height}
    GetMasternodes
    GetPeerInfo
    GetDebugInfo
    GetRollbackBlocks/{id}
    SendExit
    ClearRBXLog
    ChangeValidatorName/{name}

===================

/voapi/VOV1/
    GetAllTopics
    GetActiveTopics
    GetInactiveTopics
    GetMyTopics
    GetSearchTopics/{search}

    GetTopicDetails/{topicUid}
    GetMyVotes
    GetTopicVotes/{topicUid}
    CastTopicVote/{topicUid}/{vote}

===================

/scapi/SCV1/
    GetAllSmartContracts/{pageNumber}
    GetAllSmartContracts/{pageNumber}/{excludeToken?}
    GetMintedSmartContracts/{pageNumber}
    GetSingleSmartContract/{id}
    ChangeNFTPublicState/{id}
    GetSmartContractData/{id}
    CreateSmartContract
    MintSmartContract/{id}
    TransferNFT/{id}/{address}
    TransferNFT/{id}/{address}/{url}
    EvolveSpecific/{id}/{address}/{stage}
    Burn/{id}
    AssociateNFTAsset/{id}/{path}
    GetNFTAssetLocation/{id}/{filename}


===================

/bcapi/BCV1/
    GetBeacons
    AddBeacon/{name}/{port}/{ip}
    CreateBeacon/{name}/{isPrivate}/{autoDelete}/{fileCachePeriod}/{port}
    DeleteBeacon/{id}

====

/txapi/TXV1/
    CreateAdnr/{address}/{name}
    TransferAdnr/{from}/{to}
    DeleteAdnr/{address}
```

### Example

A short example would be as followed (C#)

```csharp
HttpClient client = new HttpClient();
client.DefaultRequestHeaders.Add("apitoken", "YOUR_API_TOKEN"); // only if the node was started with apitoken=
var httpResponse = await client.GetAsync("http://localhost:7292/api/V1/CheckStatus");

var responseString = await httpResponse.Content.ReadAsStringAsync();
```

This results in the following: a response body of `Online`
![CheckStatus call returning Online](../../../assets/media/integration/checkStatusApiCall.png)

The curl example is as follows:

```bash
curl -X 'GET' \
  'http://localhost:7292/api/V1/CheckStatus' \
  -H 'accept: text/plain'
```

Another basic example in Go is as follows:

```go
package main

import (
    "fmt"
    "net/http"
    "io/ioutil"
    "os"
    )

func main() {
    response, err := http.Get("http://localhost:7292/api/v1/CheckStatus")
    if err != nil {
        fmt.Printf("%s", err)
        os.Exit(1)
    } else {
        defer response.Body.Close()
        contents, err := ioutil.ReadAll(response.Body)
        if err != nil {
            fmt.Printf("%s", err)
            os.Exit(1)
        }
        fmt.Printf("%s\n", string(contents))
    }
}
```

## Testnet Information

Start the node with the `testnet` argument to run it on testnet:

- Ex: `VerifiedXCore.exe testnet` (Linux and macOS: `dotnet VerifiedXCore.dll testnet`, or `./VerifiedXCore testnet` for a release build)

The `testnet` start argument is the only way to select testnet. Do not set `TestNet=true` or `TestNetName` in `config.txt` yourself: a node started without the `testnet` argument whose `config.txt` selects testnet exits at startup with an error telling you to use the argument instead.

![The CLI started on testnet](../../../assets/media/integration/testnetCli.png)

Please be sure you are on testnet so as to not make any mistakes with your mainnet accounts.
VFX addresses on testnet will ALWAYS start with an `x`. For Example:
`xC1zNn7596TC4Bcyn1vE88pj12hfieqCoa`

There are three ways to get testnet funds:

1. Use the testnet faucet on the explorer (https://spyglass-testnet.verifiedx.io/faucet). It pays testnet VFX and signet BTC after an SMS check. See [Testnet](/build/testnet/#getting-test-funds).
2. Message the Discord channel titled `Testnet Faucet` with your address and funds will be sent.
3. Reach out to your point of contact through your current chat tool (telegram, skype, email, etc.) and ask them to send funds to a requested testnet address.

It is advised to begin with testnet to ensure all functions are working with your environment before moving over to mainnet.

## The CLI

![The CLI main menu](../../../assets/media/integration/cliMenu.png)

The VFX CLI is recommended for most enterprise or third-party integrators as it runs headless and the most efficiently.

The CLI is still rather robust and the main menu options are seen above, and more options can be discovered by typing /help and pressing enter.

For example:
![The CLI /help output](../../../assets/media/integration/cliHelp.png)
Once a CLI is started you may type commands at any point and time and interact with the wallet and not need to worry about stopping any of the background processes. Closing the wallet is the only thing to stop all functions.

The wallet must be left open for items to continue running. If using Linux and SSH it is recommended to use screen or other tool to keep it running.

Screen example:

```bash
screen dotnet VerifiedXCore.dll enableapi
```

> Press `Ctrl+A`, then `D`, to detach from the screen session.

> To return, type `screen -r` and press enter.

## Third Party Interfacing for Exchanges and other Entities

### Summary

This section will outline the best practices for setting up an VFX wallet in your environment. While many of these features are optional it is recommended to leverage as many, if not all, as you can.

The section will cover the config.txt setup, password setup, and how to use the API in some common and general scenarios that will fit most environments.

The VFX Architecture very closely follows the philosophies and principles of Bitcoin so integration will also very similarly mimic that. This was done by design to ease the burden of the solution and the fact it is a layer 1.

### Build the Project

Depending on your environment you will find build instructions for Windows, Linux, and Mac here: [CLI Build Instructions](/node/build-from-source/)

Follow the instructions and you can either build the project from source to ensure you are receiving a clean version of the program, or you can run a binary posted in the release section here: **https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases**

### Configuration File Setup (Config.txt)

A full list of configuration options can be seen here: [CLI Configuration](/node/configuration/)

First you want to start up the wallet to generate a stock configuration file. It is created in the `Config` folder next to the `Databases` folder: `~/rbx/Config/config.txt` on macOS, `~/.local/share/RBX/Config/config.txt` on Linux, `%LOCALAPPDATA%\RBX\Config\config.txt` on Windows (testnet: `RBXTest/ConfigTestNet`).

First thing is to change the APIPort and set an APIPassword. You can choose to require the API password always, or if you don’t the API is set to stay unlocked for 15 minutes by default. You can change that with the WalletUnlockTime setting.

You can also configure a wallet password here as well if you plan to feed commands directly into the CLI. An example could look like this:
![Example config.txt](../../../assets/media/integration/config-example.png)

These are the most relevant config options:

1. Port (default is 3338)

   - Type int
   - Ex: `Port=3338.`
   - This is the port for all p2p functions. This should remain as 3338.

2. APIPort (default is 7292)

   - Type int
   - Ex: `APIPort=7292`
   - This is the port to call the API. This may be changed to whatever you want.

3. WalletPassword (default is null)

   - Type string
   - Ex: `WalletPassword=SomePassword1234!`
   - This is a password that will lock all functions in the wallet and require you input a password to unlock wallet functions.

4. AlwaysRequireWalletPassword (default is false)

   - Type boolean
   - Ex: `AlwaysRequireWalletPassword=true`
   - If set to true you will be required to input a password before every function call.

5. APIPassword (default is null)

   - Type string
   - Ex: `APIPassword=SomePassword1234!`
   - This is a password set to lock down control of the API. This password must be inputted to call any API function.

6. AlwaysRequireAPIPassword (default is false)

   - Type boolean
   - Ex: `AlwaysRequireAPIPassword=true`
   - If set to true then you must include the password in all API requests, as the segment before the action (`/api/V1/{password}/<Action>`, for example `/api/V1/{password}/GetWalletInfo`).

7. APICallURL (default is null)

   - Type string
   - Ex: `APICallURL=https://mycallbackurl.com`
   - This URL is used to send incoming transactions to an outside URL. This is something used for incoming deposits or other notification services.

8. WalletUnlockTime (default is 15)

   - Type int
   - Ex: `WalletUnlockTime=5`
   - This is the amount of time once a password has been entered the wallet will remain unlocked and not need a password again. If any of the RequirePasswords above are set to true, then it will override this setting and require the password every time.

## Optional APICallURL

You can also set up an APICallURL. This will be a URL you input that the VFX wallet upon receiving any new incoming transaction the wallet will call out to this URL sending a json response following the transaction model. This will allow you to easily get incoming transactions in real time and immediately.

## Setting Up Wallet & Private Key Encryption

You can set up a wallet simply by opening the VFX wallet. From there you can generate an infinite number of addresses or set up a 24 word mnemonic to create an HD wallet.

Recommend you backup your phrase offline or create it in an air gapped environment.
It is strongly recommended you encrypt your private keys. This will protect you if your database files are stolen they will not be able to access funds as the private keys will be encrypted.
To encrypt your private keys simply type `/encrypt` in the wallet and follow the instructions. It will have you type in a password twice, to ensure it is correct. The password can be at most 32 characters and cannot contain `=`. Encryption does not support HD wallets yet. 1000 addresses will be auto generated at the start. Should more be needed, that is fine.

The only time you need to type a password in is when you want to do something with a private key. The two main functions are sending a transaction or signing a message. This process is very similar to Bitcoin and if you are already doing this then you won’t feel any difference.
When you type in your password it is stored as a SecureString for 10 minutes, unless specified otherwise. After 10 minutes Garbage collection is called and it is both cleared from the application as well as the system RAM.

## General Use

From here how you integrate to your application or systems is dependent on your current environment. The Swagger endpoint has all the APIs needed for integrating and all use cases. If you are an exchange one possible route is to do the following:

1. Generate all your deposit addresses
2. Store the addresses in memory in a list.
3. Every 30-60 seconds perform a check
   - Check each new block against the list stored in step 2 and see if any incoming transactions exist. If so then you have a new deposit
   - Keep a list of all TX hashes and then run a scan against the last time checked with a timestamp and if any next hashes exist that you don’t have stored then you also know you have a new deposit.
4. Credit the account associated with the deposit address.
5. For withdrawals simply verify funds against your own DB and execute a SendTransaction/ API call.

The above example is a simple use case for processing incoming deposits. If your environment has any special needs they obviously would be added in, but the above model does work.

You can attempt to use the APICallURL which will send a new TX everytime one is detected, but only from a deposit perspective as a withdrawal would not make sense.

If you have any needs or specific questions it's recommended to reach out over [Discord](https://discord.gg/7cd5ebDQCj) or the current chat tool you are using like telegram, skype, email, etc.

## Conclusion

This document will get most integrations started in the right direction, however, please don’t hesitate to reach out to the VFX community and devs through discord or if you are currently talking to anyone through other social channels please reach out to them there with any questions.
