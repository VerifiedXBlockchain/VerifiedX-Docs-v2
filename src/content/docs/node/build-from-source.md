---
title: "CLI Build Instructions"
description: "Build and run the VerifiedX Core CLI from source on Linux, Windows and Mac with .NET 6, including its native FROST and PLONK libraries."
sidebar:
  order: 2
---

The following instructions will cover building and running the VFX on Windows, Linux, and Mac.
The most important step is to install .net core 6.

For Linux you can find install instructions here https://docs.microsoft.com/en-us/dotnet/core/install/linux. This document will cover how to install for Ubuntu.

In the last step for _dotnet VerifiedXCore(.dll or .exe or blank)_ if that does not work you can also try _dotnet run VerifiedXCore(.dll or .exe or blank)_

## Linux

Linux Install For Ubuntu 22.04:

1. wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
2. sudo dpkg -i packages-microsoft-prod.deb
3. rm packages-microsoft-prod.deb
4. sudo apt-get update && sudo apt-get install -y dotnet-sdk-6.0
5. sudo apt-get update && sudo apt-get install -y aspnetcore-runtime-6.0
6. run `dotnet --version`. You should see a version number of 6.0.xxx
7. `mkdir vfx` - Makes a directory for VFX
8. cd vfx
9. a) Clone the repo with git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`

   b) Download the already packaged release https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. If you do this please navigate to folder you downloaded binaries from and skip to step 12.

8. `cd VerifiedX-Core`
9. `dotnet build` - There should be 0 (zero) errors.
10. `dotnet publish -c Release -r linux-x64 --output ./vfxpublished` \*\*please note the `linux-x64` can be changed if you are on a different architecture
11. `cd vfxpublished`
12. `dotnet VerifiedXCore.dll`

You are done! You should now see a wallet running! Some common errors are usually related to file permissions. Please ensure you have given proper permission to the newly created VFX folder

### Dotnet Conflicts

If you see an error like this, it means your have a conflict with dotnet versions.
```
A fatal error occurred. The folder [/usr/share/dotnet/host/fxr] does not exist
```
To fix, run the following commands:
```
sudo apt remove dotnet*
sudo apt remove aspnetcore*
sudo apt remove netstandard*

sudo nano /etc/apt/preferences.d/99microsoft-dotnet.pref
```

Then paste in the following and save/exit nano:
```
Package: *
Pin: origin "packages.microsoft.com"
Pin-Priority: 1001
```

Then run:
```
sudo apt update
sudo apt install dotnet-sdk-6.0
```


## Windows

Install the latest dotnet sdk from here: https://dotnet.microsoft.com/en-us/download/dotnet/6.0
Once that is installed follow steps below.

1. Create a directory for VFX and then open command prompt in admin and navigate to that directory.
2. Please ensure you have a working version of git installed.
3. a) Clone the repo with git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`
   b) Download the already packaged release https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. If you do this please navigate to folder you downloaded binaries from and skip to step 8.
4. `cd VerifiedX-Core`
5. `dotnet build` - There should be 0 (zero) errors.
6. `dotnet publish` -c Release -r win-x64 --output ./vfxpublished \*\*please note the `win-x64` can be changed if you are on a different architecture
7. `cd vfxpublished`
8. `dotnet VerifiedXCore.exe`

## Mac OSX

Install the latest dotnet sdk from here: https://dotnet.microsoft.com/en-us/download/dotnet/6.0
Once that is installed follow steps below.

1. Create a directory for VFX and then open command prompt in admin and navigate to that directory.
2. Please ensure you have a working version of git installed.
3. - Clone the repo with git. `git clone https://github.com/VerifiedXBlockchain/VerifiedX-Core.git`
   - Download the already packaged release https://github.com/VerifiedXBlockchain/VerifiedX-Core/releases/. If you do this please navigate to folder you downloaded binaries from and skip to step 8.
4. cd VerifiedX-Core
5. `dotnet build` - There should be 0 (zero) errors.
6. `dotnet publish -c Release -r osx-x64 --output ./vfxpublished `\*\*please note the `osx-x64` can be changed if you are on a different architecture like arm.
7. `cd vfxpublished`
8. `dotnet VerifiedXCore`

## Native libraries and PLONK parameters

The publish output includes the native FROST and PLONK libraries for the runtime you chose (`-r`), including arm64 builds for `linux-arm64`. Run the libraries that ship with the release: the FROST library is pinned to version `0.2.0-frost-real`, and a node that loads any other version stays out of vBTC key ceremonies and signings.

On first start the node downloads `vfx_plonk_v4.params` (about 400 MB) into `PlonkParams` in its data directory and verifies its SHA-256. Set `VFX_PLONK_PARAMS_PATH` to the full path of an existing copy to skip the download. A copy that doesn't match the pinned hash is ignored.
