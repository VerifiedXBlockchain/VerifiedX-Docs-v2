---
title: "CLI Configuration"
description: "Every setting in the Core CLI configuration file, with its type, default and an example."
sidebar:
  order: 3
---

The CLI creates its configuration file, `config.txt`, on first run. The data folder still uses the legacy names `RBX` (mainnet) and `RBXTest` (testnet), because that is what the code uses.

| OS | Mainnet | Testnet |
|---|---|---|
| macOS | `~/rbx/Config/config.txt` | `~/rbxtest/ConfigTestNet/config.txt` |
| Linux | `~/.local/share/RBX/Config/config.txt` | `~/.local/share/RBXTest/ConfigTestNet/config.txt` |
| Windows | `%LOCALAPPDATA%\RBX\Config\config.txt` | `%LOCALAPPDATA%\RBXTest\ConfigTestNet\config.txt` |

The macOS folder is lowercase `rbx` in the code. The default macOS file system is case-insensitive, so `~/RBX` opens the same folder. The `CustomPath` key moves the whole data tree.

On first run the CLI writes `Port`, `APIPort`, `TestNet`, `NFTTimeout=15`, `AutoDownloadNFTAsset=true`, `BitcoinAddressFormat=1` and the Base bridge keys. On testnet it writes `Port=13338` and `APIPort=17292`.

:::note
A restart of the CLI is required after making changes. Write one `Key=Value` per line with no blank lines: the CLI stops reading at the first empty line. A value cannot contain `=`, because the line is split on it.
:::

```text
1.	Port (default is 3338)
	+ a. Type int
	+ b. Ex: Port=3338.
	+ c. This is the port for all p2p functions. This should remain as 3338. On testnet the CLI always uses 13338.
  
2.	APIPort (default is 7292)
	+ a.	Type int
	+ b.	Ex: APIPort=7292
	+ c.	This is the port to call the API. This may be changed to whatever you want. On testnet the CLI always uses 17292.

3.	WalletPassword (default is null)
	+ a.	Type string
	+ b.	Ex: WalletPassword=SomePassword1234!
	+ c.	This is a password that will lock all functions in wallet and require you input a password to unlock wallet functions.

4.	AlwaysRequireWalletPassword (default is false)
	+ a.	Type boolean
	+ b.	Ex: AlwaysRequireWalletPassword=true
	+ c.	If set to true you will be required to input password before every function call. 

5.	APIPassword (default is null)
	+ a.	Type string
	+ b.	Ex: APIPassword=SomePassword1234!
	+ c.	This is a password set to lock down control of the API. This password must be inputted to call any API function.
	+ d.	You will need to call `/api/V1/UnlockWallet/{password}` to unlock the API with this password. It stays unlocked for WalletUnlockTime minutes.

6.	AlwaysRequireAPIPassword (default is false)
	+ a.	Type boolean
	+ b.	Ex: AlwaysRequireAPIPassword=true
	+ c.	If set to true then you must include the password in all API requests, as the last path segment (`/api/V1/<Action>/{password}`). A missing or wrong password returns 403.

7.	APICallURL (default is null)
	+ a.	Type string
	+ b.	Ex: APICallURL=https://mycallbackurl.com
	+ c.	This URL is used to send incoming transactions to an outside URL, for example for incoming deposits or other notification services.

8.	WalletUnlockTime (default is 15)
	+ a.	Type int
	+ b.	Ex: WalletUnlockTime=5
	+ c.	This is the number of minutes the wallet or API stays unlocked once the password has been entered. If any of the AlwaysRequire settings above are true, they override this setting and require the password every time.

9.	ChainCheckPoint (default is false)
	+ a.	Type Boolean
	+ b.	Ex: ChainCheckPoint=true
	+ c.	This is a feature that will turn on chain check points. What this will do is create a FULL copy of the chains state and back it up and create a checkpoint you can revert back to in the event your current structure becomes corrupted. 

10.	ChainCheckPointInternal (default is 12)
	+ a.	Type int
	+ b.	Ex: ChainCheckPointInternal=4
	+ c.	This interval is in hours and means it will run the checkpoint every X amount of hours. Use 1 or more.
	+ d.	The key is spelled ChainCheckPointInternal, which is what the CLI reads. Older material spells it ChainCheckPointInterval; that spelling is ignored.

11.	ChainCheckPointRetain (default is 2)
	+ a.	Type int
	+ b.	Ex: ChainCheckPointRetain=4
	+ c.	Retain is what will determine how many backups to keep before it will begin to remove the oldest backup to make room for new one.

12.	ChainCheckpointLocation (default is the Checkpoint folder in the data directory)
	+ a.	Type string
	+ b.	Ex: ChainCheckpointLocation=C:\somelocation\otherthan\default\
	+ c.	If the default path is not wanted you can setup a new location for them to go to.

13.	APICallURLLogging (default is false)
	+ a.	Type Boolean
	+ b.	Ex: APICallURLLogging=true 
	+ c.	This will debug the API call URL in the event there is an issue with TX’s being sent to your URL. This is recommended to be turned on during the initial testing of your URL.

14.	ValidatorAddress (default is null)
	+ a.	Type string
	+ b.	Ex: ValidatorAddress=RBcHyS2AF4Z4jgzTLZNBVLvtxQ6MtB2vUN
	+ c.	You can input a default validator address to instantly start validating. Please note you must also import the wallet address through the launch commands. Ex: VerifiedXCore.exe privkey=MyPrivateKey (Linux and macOS: dotnet VerifiedXCore.dll privkey=MyPrivateKey). Mainnet addresses start with R, testnet addresses with x.

15.	ValidatorName (default is new guid)
	+ a.	Type string
	+ b.	Ex: ValidatorName=MyValidator1
	+ c.	This is the name for the above validator that will be used. Once validator has been imported once then these settings won’t do anything and can be removed or left there. 

16.	NFTTimeout (default is 15 secs)
	+ a.	Type int
	+ b.	Ex: NFTTimeout=5
	+ c.	This will control the timeout for processing an incoming NFT 

17.	PasswordClearTime (default is 10 mins)
	+ a.	Type int
	+ b.	Ex: PasswordClearTime=5
	+ c.	This will control the clear time for an encrypted wallets password

18.	AutoDownloadNFTAsset (default is true in the file written at first run; false if the key is missing)
	+ a.	Type Boolean
	+ b.	Ex: AutoDownloadNFTAsset=false
	+ c.	This will control whether or not an NFT's asset is automatically downloaded

19.	IgnoreIncomingNFTs (default is false)
	+ a.	Type Boolean
	+ b.	Ex: IgnoreIncomingNFTs=false
	+ c.	This will control whether or not incoming NFTs are processed or just added as a TX record

20.	RejectAssetExtensionTypes (default is a List of rejected assets)
	+ a.	Type List<string>
	+ b.	Ex: RejectAssetExtensionTypes=.iso,.apk,.pdf (include the leading dot and no spaces between types; entries without the dot match nothing)
	+ c.	This will add extension types to the already defined list and will reject any NFT assets with these known extension types

21.	AllowedExtensionsTypes (default is null)
	+ a.	Type List<string>
	+ b.	Ex: AllowedExtensionsTypes=.doc,.xls (include the leading dot)
	+ c.	This will remove extension types from the already defined list and will allow any NFT assets with these known extension types to be downloaded
	
22.     MotherAddress (default is null)
	+ a. Type string
	+ b. Ex: 111.222.333.444
	+ c. The IP address of the wallet you are hosting MOTHER on

23.     MotherPassword (default is null)
	+ a. Type string
	+ b. Ex: MyPassword
	+ c. The password set when configuring MOTHER

24.	CustomPath (default is null)
	+ a.	Type string
	+ b.	Ex: CustomPath=/mnt/vfxdata/
	+ c.	Moves the whole data tree (databases, checkpoints, config and assets) under this folder. The CLI appends RBX or RBXTest, so end the value with a path separator.

25.	OpenAPI (default is false)
	+ a.	Type Boolean
	+ b.	Ex: OpenAPI=true
	+ c.	Listens for the API on all interfaces instead of localhost only, the same as the openapi launch argument. The node refuses it and stays on localhost unless an apitoken launch argument (or APIPassword with AlwaysRequireAPIPassword=true) is set. The Swagger page at /swagger then requires the apitoken header.

26.	IPAddress (default is null)
	+ a.	Type string
	+ b.	Ex: IPAddress=203.0.113.10
	+ c.	The public IP this node reports to peers, set by hand instead of detected. ReportedIP is read when IPAddress is absent.

27.	SkipIPs (default is null)
	+ a.	Type string (comma separated)
	+ b.	Ex: SkipIPs=203.0.113.10,198.51.100.7
	+ c.	Peers and validators at these IPs are skipped.

28.	ElectrumServers (default is the built-in list)
	+ a.	Type string (comma separated)
	+ b.	Ex: ElectrumServers=https://electrum.blockstream.info:50002,https://bitcoin.lu.ke:50002
	+ c.	Replaces the Bitcoin Electrum servers the node uses. Prefix a server with https:// for TLS; without it the connection is plain. Testnet defaults to the VerifiedX signet servers on port 50002.

29.	BitcoinAddressFormat (default is 1)
	+ a.	Type int
	+ b.	Ex: BitcoinAddressFormat=2
	+ c.	The Bitcoin address type for new keys: 0 = SegWit P2SH, 1 = native SegWit, 2 = Taproot.

30.	MaxBtcFeeRateSatPerVb (default is 2000)
	+ a.	Type int
	+ b.	Ex: MaxBtcFeeRateSatPerVb=500
	+ c.	The highest Bitcoin fee rate, in sat/vB, any signing path on this node will use.

31.	S3C (default is null)
	+ a.	Type string (comma separated IP:ValidatorAddress pairs)
	+ b.	Ex: S3C=203.0.113.10:Rxxxx,203.0.113.11:Rxxxx,203.0.113.12:Rxxxx
	+ c.	Self-Custodial Smart Contract mode for a minting node: vBTC vault ceremonies use only these validators. At least 3 entries with public IPs and valid VFX addresses are required. If the value is invalid, vBTC minting refuses until it is corrected.

32.	S3CValidator (default is false)
	+ a.	Type Boolean
	+ b.	Ex: S3CValidator=true
	+ c.	Marks this validator as an S3C validator in its registration and heartbeats, so S3C pools can use it.
	
	
```
