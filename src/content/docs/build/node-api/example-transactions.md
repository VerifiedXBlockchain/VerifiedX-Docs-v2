---
title: "Example Transactions"
description: "Real mainnet transaction examples by type, each with its hash, Spyglass link and data payload."
sidebar:
  order: 5
---

Below are real-world transaction examples from mainnet, organized by type. Each transaction includes the complete data payload to simplify integration testing. For additional transaction details (fees, block height, timestamps, etc.), use the provided Spyglass URLs or query the transaction hash via the Core CLI or Web API.

For an exausted list of all transaction types, please visit the [Transaction Creation Docs](/build/node-api/transaction-creation/).

## Basic

### VFX Transfer

**Transaction Hash:** `c2d57fb7ded81ffd0b3ecb95567dd4fc0e46e71fa253d9304b03b02150070513`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/c2d57fb7ded81ffd0b3ecb95567dd4fc0e46e71fa253d9304b03b02150070513

**Transaction Data:**
```json
null
```

## Smart Contracts

### Smart Contract Mint

**Transaction Hash:** `46b0e70e963aad1f4344c811169bed8f0378541355bc48a751f4bd882342e86f`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/46b0e70e963aad1f4344c811169bed8f0378541355bc48a751f4bd882342e86f

**Transaction Data:**
```json
[{
  "Function": "Mint()",
  "ContractUID": "edb8e3640dd54b09976c9c0d2e24d84f:1684697415",
  "Data": "H4sIAAAAAAAAE6VV227TQBA9z/0KNy8kqkG05AKVihRaAlVFhZpWorw5sR0CiV1st1Cg/87ZWV/izYbGQpa9MzvXMzO7XiBABgfn8LAk7eCIbwsfMEdESQCfvKIdvMECMab4RnqfGi3scEfbn3BNKUuoe8OdOTWj0tslvnAnlTgjcg5+MJ7il5Y4F4z0CU9ErrwEeCp6Cz7ab0Z/DiZlPrvk3lMv4avtMkoKa8ewVnwsurs1DBXmBEPm44tOKv40jguc4Rpdft/iM6XXjL6PK3zFAHekz2i/xC3GzOk7jvk9xkdiHeEnVxU73hjR7MAl7kUvITem7E7o+5r9mBYedzPG0XVJyE+5XuGUPSl8qepO8JLrC/SZ/3NB1yM1If2Kz4D7U65TkR1Q84BSnzZdhDgkyr7QfdHtku/VMhlx9Ujd5jUrItd15kKPuf5aQTpgrJ74tWmbdbFPxDP24Aazmoeh9E7RQ+alZiZuWOeQdpHUs5icc+5l7JsnnWuzQgq1R8kh31Q6oCQzdCx7O/jN15FJD/mtrI/ybCLxX+y3cm2ntKueRJCpequ83gmnT9dJbt0usbobT6j7z7nvlFEfcipgrVKp3iYEM8lE4/DKDvwfoqqTFTZzPlzLhLmPTsE6wnoWLWrGUqMgt/VXbktfNBzs1Sqxl+8Wd1xIKzVHPqdU4X+wTpa9g1E5reYsuRJT99QuLe7WoqfNJtSsRJWJxveHZ/D1CvoiE5vUzGSbGth6Hq7dCTbc4do9Y9PyrHPR9BybVbLlaKvIeo42LXuOna3qd8pKtxtm/9j/ZJu45p+gaQ6mvY75FzAWd6WoCAAA",
  "MD5List": "one-million.jpg::8bffe1996acfdbffb4c9a432c9de2c6e"
}]
```

### Smart Contract Transfer

**Transaction Hash:** `6ebcd32f0b6bd020f8ca3cd930dcc79cd38fbfd5b7c8ea8458306f8a1964d29f`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/6ebcd32f0b6bd020f8ca3cd930dcc79cd38fbfd5b7c8ea8458306f8a1964d29f

**Transaction Data:**
```json
[{
  "Function": "Transfer()",
  "ContractUID": "9f8b025c76aa480fa45dd3c2310f86b6:1754578265",
  "ToAddress": "RTAmbi8R11vbDQcnaqbaWNpDHcNc63pfhk",
  "Data": "H4sIAAAAAAAAA6VW007bQBCdZ77C4qUgQsS1UCQqpVAKbUEtoUVIfTGOEwxJnNrh1pZ/75mz67WdbAsIWbbXu7MzZ85c1n2JZSyBHEkoA4wD2cY9K2189/j9UZp47ksCuRwyoQyxPiN9u3MX71wiySAxwkwiKSQKPR+s1BlmryETyCE0ZJRTTU1aSPGle8ZyQZvHeJ7j7uMy+pryA0+9dzAXYnYAuXunNcI7x/6U8yH3xdSZSIejMT2450zVVhuoQ+zX8SmeMeQD+QaZRG7wlUGvri1SbwA7uvITb53tYNyjZrWpOFKijjFSi+ccG2shmehBY0g8ufMgsAgzh089KTF+kc+yR+5SYhpY+UDmsBY7/J/tegDpPsa3Fr8ivyL6E6cxw/qlxak7EzKeEWURwz1KqaX5SgRMLF9hTTUN8aUaLm0EAlhVHREsqSe9ih8mQsZL5bFLtjqW3fuaXpWNEZuR01Lyonw3Ga+EuquZUM+vYmWLyH25ZrSq5yNm1pAZG1qUGbM7IRpdU56NJn8eGh2R01zaiREZ9fbG+TOklYLxG6dZc0+jFyFmuu8Ooz7ZTWx0B8Qb0fOBXYkY5SHZHBBxbuOYW73fGSndb6J7hXERiXqud5gXyZSGfdbkCKMuK2xUi23ZAwoLxdoRPY2YiYaVNqwmtgYK1F2yrfLvbQwv7Kyp6sjmYkYei2w8YZ4ZzbmNWNWXQ9cH9PnOxucKGVHiq+eMwZS5uo1ZtSmuDkfXYC13HcFgr+duyizSd9fpGFQqqMzCIatUc/kA4wt2kZh5VFR1k3zcVdbqPBitp4xMRKYM7mr/yDz9tNrDDytV0II/HZv3uevjx+D5k/xCBuwCRwt6N9Hb1+QrbJ7Byzvs2AE3a0B+KavyRl6DE9XSwnqIa/+fFqfPnqd05Kq2Ns8ljeCO4yZkZ/sGXned5jdAugkmlmRF1rG+AZSKbQ2zS1jT0Tr9X8XqCp7LnN+E3DnuLXxvQEKlNjC7grn1GpI9xm3MbhBX+Kuj3UEtGj+qp+VyTU/CcRvvXxVuVmFvGfZf04dZz45JNnN7ki8iLouslfIcX4SuTeTCJRjv1bS1GH0dt+CL5lH6okh12WWiytlyhLkxK08zYQ47Q/bYgJWZM4amU8575mbkN+6Add1lxyp2b1tsQ+ov5metdOD2lVdGPzViisv8sRyBzxPmuu6ec5435F9/PI3/1tG8s/pgR1qNuT0n/B70iMT4Ebp4vMyjMq6lb5OZ0/DkX+PRnJj2sI5iFpKp7cdmb0fK/84OJQJZqDGxYGdv6X/A/4VrdlzTvx68meWP4NDl7mQuNcSceDnPUN/qwMa1iOnzMnSSiRKJ8e8P6vBtxfsCiW91EslTOPDFvDvVLXx+d6e6kE8q9ObFc+t4kiUfRh8j0xh9Un6M80/i7wBMzz0T/WMn0lPsTp4lz8Uwud/Y/AuLWC1N8g0AAA==",
  "Locators": "eyJJUEFkZHJlc3MiOiIxNDQuMTI2LjE1Ni4xNzYiLCJQb3J0IjoyMzMzOSwiTmFtZSI6Ildpc3RlcmlhIEJlYWNvbiBWMiIsIkJlYWNvblVJRCI6Ildpc3RlcmlhQmVhY29uVjIifQ==",
  "MD5List": "sage-j-hitsman-18.jpg::6087a76e47bda60bf33eb4005429ddfa"
}]
```

### Smart Contract Burn

**Transaction Hash:** `3d674fa4054c56583e6e68d111233771214d7affd350b47b05d7c23aa5b1f694`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/3d674fa4054c56583e6e68d111233771214d7affd350b47b05d7c23aa5b1f694

**Transaction Data:**
```json
[
  {
    "Function": "Burn()",
    "ContractUID": "00dac86af0054a03b8ca5cbbefae8609:1752207991",
    "FromAddress": "RT9PGBrPFe1ykqi3auEEpCRcoG158V7JN7"
  }
]
```


## Domains

### Buy Domain

**Transaction Hash:** `4577381c227eba9baf18670118b6b810856fdb9def8c4026a1628a6852eabac9`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/4577381c227eba9baf18670118b6b810856fdb9def8c4026a1628a6852eabac9

**Transaction Data:**
```json
{
  "Function": "BTCAdnrCreate()",
  "Name": "Gabriel",
  "BTCAddress": "bc1qez3ztm2umw84kmkdjm20lw85p0pyzapnl63vrp",
  "Message": "1756340763",
  "Signature": "30440220c3bce77a1dcbb2050b3ccd030294ac6ec67c4b0e102519a708f10eef73d3b1830220694f25e81d5db48425c25c9f09e5c8d608b5af5b07b6cf929a0aedab4ed5c8e0.02c41221387674554593a7fca0533425315e9d4922419846ddab419e638e6e1e6e"
}
```

### Create Shop

**Transaction Hash:** `474035236ed106930f14d9ffb0b7cc8cc5d17b9e86debad7c8105a2faa592cbd`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/474035236ed106930f14d9ffb0b7cc8cc5d17b9e86debad7c8105a2faa592cbd

**Transaction Data:**
```json
{
  "Function": "DecShopCreate()",
  "DecShop": {
    "Id": 1,
    "UniqueId": "RmqaazLWnZ1752182823",
    "Name": "VFX HERO CHALLENGE",
    "DecShopURL": "rbx://VFXHEROCHALLENGE",
    "ThirdPartyBaseURL": "https://wallet.verifiedx.io",
    "ThirdPartyAPIURL": "https://data.verifiedx.io/api",
    "Description": "Discover 4 limited-edition superhero NFTs in your VFX Wallet. Each is 25 VFX—own the most-retweeted hero to claim the $100 USDT prize!",
    "OwnerAddress": "RM1EWP1nP2k6sjDuwM2oqPULac4T8SLUH1",
    "HostingType": 2,
    "IP": "NA",
    "Port": 0,
    "STUNServerGroup": 0,
    "OriginalBlockHeight": 0,
    "OriginalTXHash": null,
    "LatestBlockHeight": 0,
    "LatestTXHash": null,
    "UpdateTimestamp": 0,
    "AutoUpdateNetworkDNS": true,
    "NeedsPublishToNetwork": true,
    "IsOffline": false,
    "IsPublished": true,
    "CollectionCount": 0,
    "ListingCount": 0,
    "AuctionCount": 0,
    "IsIPDifferent": false
  }
}
```

### Shop Sale

**Transaction Hash:** `558b39d79df72033ce67344a3051f1a21a304b1450cecfcc552ffdc66848adc3`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/558b39d79df72033ce67344a3051f1a21a304b1450cecfcc552ffdc66848adc3

**Transaction Data:**
```json
{
  "Function": "Sale_Complete()",
  "ContractUID": "12358bd759f041ed857e31c357b4a965:1752128781",
  "Royalty": false,
  "RoyaltyAmount": null,
  "RoyaltyPayTo": null,
  "Transactions": [
    {
      "Hash": "bf80bcf30e10abbf77c392ce7135a6b149cc14119feb59246d44ba1cebe4839d",
      "ToAddress": "RM1EWP1nP2k6sjDuwM2oqPULac4T8SLUH1",
      "FromAddress": "RT9PGBrPFe1ykqi3auEEpCRcoG158V7JN7",
      "TransactionType": 5,
      "Amount": 25,
      "Nonce": 2,
      "Fee": 8.34e-06,
      "Timestamp": 1752786109681,
      "Signature": "MEUCIFmJ05JUmP8Y9FQIQlLE4ZYRgFUwR4WKxIcWBk5sjS7qAiEAmGmWl4tDq6XDvUtBfqqO8OfGQCHteR9k9SN1gykzZ4U=.2NmbMDMS24cxbpQebodSknTXyDLkHxC1Fip4ZuQ8oz1LE6tzNUQinKAFTkeHdVm66a5u4HjssQDhxurfQpYHZbhW",
      "Height": 0,
      "Data": "{\"Function\":\"Sale_Complete()\",\"ContractUID\":\"12358bd759f041ed857e31c357b4a965:1752128781\"}",
      "UnlockTime": null
    }
  ],
  "KeySign": "MYCSLJsiRj1752195719"
}
```

## Vault Accounts

### Activate Vault

**Transaction Hash:** `2673d456a12827f9ee7b37b93ca22ee87c943385281ad1ea98aa8d063ccb0013`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/2673d456a12827f9ee7b37b93ca22ee87c943385281ad1ea98aa8d063ccb0013

**Transaction Data:**
```json
{
  "Function": "Register()",
  "RecoveryAddress": "RHttbdSBbMAzMDhvw8yvmPqc6Py4ZHtzNN"
}
```

## Fungible Tokens


### Fungible Token Deploy

**Transaction Hash:** `fea007bd641a77189f7d7eaab66f26f4d3a1f3c5b9a2cc3a17924f6cb260d841`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/fea007bd641a77189f7d7eaab66f26f4d3a1f3c5b9a2cc3a17924f6cb260d841

**Transaction Data:**
```json
[
  {
    "Function": "TokenDeploy()",
    "ContractUID": "d09cd22201214381af71eef51cab9b61:1754273952",
    "Data": "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",
    "MD5List": "popcorn.png::ba8e4dbe2f97f5d1747dca5ebf8f3cea"
  }
]
```

### Fungible Token Transfer

**Transaction Hash:** `33e67878f96ed012ad3485a25240511ee938ec25c8d4b953729665890c15b1a8`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/33e67878f96ed012ad3485a25240511ee938ec25c8d4b953729665890c15b1a8

**Transaction Data:**
```json
{
  "Function": "TokenTransfer()",
  "ContractUID": "d09cd22201214381af71eef51cab9b61:1754273952",
  "FromAddress": "RPhUHjLg8FmSsKYAa91FN8fQWoXyvHBZnQ",
  "ToAddress": "R9MuyZUrDaH1bVJrdng8GY8XsDeFcxmDTj",
  "Amount": 246.0,
  "TokenTicker": "ATNY",
  "TokenName": "A Theater Near You"
}
```

### Fungible Token Burn

**Transaction Hash:** `b30ad8d63651edd823cd1d21e7ee0a202cc6a4bc017f125ba69d05e77ae42378`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/b30ad8d63651edd823cd1d21e7ee0a202cc6a4bc017f125ba69d05e77ae42378

**Transaction Data:**
```json
{
  "Function": "TokenBurn()",
  "ContractUID": "8281b383c8b148bc8bd39277f7fd701d:1737456487",
  "FromAddress": "RCgVe39M8XdFPCvuCajo6ND9gn1sVXgFFf",
  "Amount": 0.0,
  "TokenTicker": "OURFANS",
  "TokenName": "OF"
}
```

## VBTC

These are V1 vBTC transactions (types 17 to 21), mined before V1 vBTC was retired at block 7,400,500. The network no longer accepts them; they are kept to help decode history.

### VBTC Deploy

**Transaction Hash:** `e6a91c9ff6267bc63b449c34a10e4c75230187597efd0bcc489331f682f9f574`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/e6a91c9ff6267bc63b449c34a10e4c75230187597efd0bcc489331f682f9f574

**Transaction Data:**
```json
[
  {
    "Function": "Mint()",
    "ContractUID": "320c5271fc04465cb24c4f1cd48affd4:1736625395",
    "Data": "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",
    "MD5List": "defaultvBTC.png::150b90aa9d06f7e4fc5703ca6d7f01db"
  }
]
```


### VBTC Transfer

**Transaction Hash:** `9ac768584dd74ff251670f3b1edbf255a57489cf9ef7b345cd7cbf9e85db293c`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/9ac768584dd74ff251670f3b1edbf255a57489cf9ef7b345cd7cbf9e85db293c

**Transaction Data:**
```json
[
  {
    "Function": "Transfer()",
    "ContractUID": "d7c08f7bab2941ca95dddd59b63e0f2f:1736961214",
    "ToAddress": "xRBXapXc1PGevze59V7Wc4Gb5pK32ShvT9",
    "Data": "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",
    "Locators": "eyJJUEFkZHJlc3MiOiI2Ni43Ni4yNS4xNSIsIlBvcnQiOjIzMzM5LCJOYW1lIjoiQmFjb24iLCJCZWFjb25VSUQiOiJiZmJmOGQ4ZTE5NToxNzQ5NzY4NDEwIn0=",
    "MD5List": "defaultvBTC.png::150b90aa9d06f7e4fc5703ca6d7f01db"
  }
]
```

### VBTC Multi Transfer

**Transaction Hash:** `2e635d5430d610b128b8ca99c81f032c3aa88f2915261827a0c41d5a6543814c`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/2e635d5430d610b128b8ca99c81f032c3aa88f2915261827a0c41d5a6543814c

**Transaction Data:**
```json
{
  "Function": "TransferCoinMulti()",
  "Inputs": [
    {
      "SCUID": "d7c08f7bab2941ca95dddd59b63e0f2f:1736961214",
      "FromAddress": "RJSVaUXjkTysZSVVaRZmkXUwVbNDenavs2",
      "Amount": 0.00000001,
      "Signature": "MEQCIL+vV88N7Thwj1fQb1sI5R23v1oi/VHcJoA9IyaRzh7nAiAmFifvFByKLPD6z0G7IdkZcMOUdUvamUkdzhvw3DLPdQ==.2DQVUCUe8B8HgfrcWmJRvKaM1NhyhhretxfGL7h1jK7zDvnVvBA2teAXf4GKRR1VGeYeoAwtmRqvJmpQ9eRcU4T9"
    }
  ],
  "Amount": 0.00000001,
  "SignatureInput": "hbkKy7z2Xwjn"
}
```


### VBTC Withdrawl Complete

**Transaction Hash:** `0316516d0739239c01b613b8b5df2010ba4637fbc2e6f17d6702e6fc732bf7e2`

**Spyglass URL:** https://spyglass.verifiedx.io/transaction/0316516d0739239c01b613b8b5df2010ba4637fbc2e6f17d6702e6fc732bf7e2

**Transaction Data:**
```json
{
  "Function": "TokenizedWithdrawalComplete()",
  "ContractUID": "aa314a95ce474cffa8448b0af1efabbd:1736752601",
  "UniqueId": "QiSqdTuVUasVgjKd",
  "TransactionHash": "a8c2a9e55d0b85f435afd994783c6d387cf678115f094f69a416435f686304c4"
}
```
