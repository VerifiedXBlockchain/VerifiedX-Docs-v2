---
sourceHash: "f3cb70e3ffde"
title: "Transacciones de ejemplo"
description: "Ejemplos reales de transacciones de mainnet por tipo, cada uno con su hash, su enlace de Spyglass y su payload de datos."
sidebar:
  order: 5
---

A continuación encontrarás ejemplos reales de transacciones de mainnet, organizados por tipo. Cada transacción incluye el payload de datos completo para simplificar las pruebas de integración. Para ver más detalles de la transacción (comisiones, altura del bloque, marcas de tiempo, etc.), usa las URL de Spyglass que se proporcionan o consulta el hash de la transacción con el Core CLI o la Web API.

Para ver una lista exhaustiva de todos los tipos de transacción, visita la [documentación de creación de transacciones](/es/build/node-api/transaction-creation/).

## Básicas

### Transferencia de VFX

**Hash de la transacción:** `c2d57fb7ded81ffd0b3ecb95567dd4fc0e46e71fa253d9304b03b02150070513`

**Tipo:** 0 (`TX`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/c2d57fb7ded81ffd0b3ecb95567dd4fc0e46e71fa253d9304b03b02150070513

**Datos de la transacción:**
```json
null
```

## Contratos inteligentes

### Emisión de un contrato inteligente

**Hash de la transacción:** `46b0e70e963aad1f4344c811169bed8f0378541355bc48a751f4bd882342e86f`

**Tipo:** 2 (`NFT_MINT`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/46b0e70e963aad1f4344c811169bed8f0378541355bc48a751f4bd882342e86f

**Datos de la transacción:**
```json
[{
  "Function": "Mint()",
  "ContractUID": "edb8e3640dd54b09976c9c0d2e24d84f:1684697415",
  "Data": "H4sIAAAAAAAAE6VV227TQBA9z/0KNy8kqkG05AKVihRaAlVFhZpWorw5sR0CiV1st1Cg/87ZWV/izYbGQpa9MzvXMzO7XiBABgfn8LAk7eCIbwsfMEdESQCfvKIdvMECMab4RnqfGi3scEfbn3BNKUuoe8OdOTWj0tslvnAnlTgjcg5+MJ7il5Y4F4z0CU9ErrwEeCp6Cz7ab0Z/DiZlPrvk3lMv4avtMkoKa8ewVnwsurs1DBXmBEPm44tOKv40jguc4Rpdft/iM6XXjL6PK3zFAHekz2i/xC3GzOk7jvk9xkdiHeEnVxU73hjR7MAl7kUvITem7E7o+5r9mBYedzPG0XVJyE+5XuGUPSl8qepO8JLrC/SZ/3NB1yM1If2Kz4D7U65TkR1Q84BSnzZdhDgkyr7QfdHtku/VMhlx9Ujd5jUrItd15kKPuf5aQTpgrJ74tWmbdbFPxDP24Aazmoeh9E7RQ+alZiZuWOeQdpHUs5icc+5l7JsnnWuzQgq1R8kh31Q6oCQzdCx7O/jN15FJD/mtrI/ybCLxX+y3cm2ntKueRJCpequ83gmnT9dJbt0usbobT6j7z7nvlFEfcipgrVKp3iYEM8lE4/DKDvwfoqqTFTZzPlzLhLmPTsE6wnoWLWrGUqMgt/VXbktfNBzs1Sqxl+8Wd1xIKzVHPqdU4X+wTpa9g1E5reYsuRJT99QuLe7WoqfNJtSsRJWJxveHZ/D1CvoiE5vUzGSbGth6Hq7dCTbc4do9Y9PyrHPR9BybVbLlaKvIeo42LXuOna3qd8pKtxtm/9j/ZJu45p+gaQ6mvY75FzAWd6WoCAAA",
  "MD5List": "one-million.jpg::8bffe1996acfdbffb4c9a432c9de2c6e"
}]
```

### Transferencia de un contrato inteligente

**Hash de la transacción:** `6ebcd32f0b6bd020f8ca3cd930dcc79cd38fbfd5b7c8ea8458306f8a1964d29f`

**Tipo:** 3 (`NFT_TX`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/6ebcd32f0b6bd020f8ca3cd930dcc79cd38fbfd5b7c8ea8458306f8a1964d29f

**Datos de la transacción:**
```json
[{
  "Function": "Transfer()",
  "ContractUID": "9f8b025c76aa480fa45dd3c2310f86b6:1754578265",
  "ToAddress": "RTAmbi8R11vbDQcnaqbaWNpDHcNc63pfhk",
  "Data": "H4sIAAAAAAAAA6VW207bQBCdZ77C4qUgQsS1UCQqpVAKbUEtoUVIfTGOEwxJnNrh1pZ/75mz67WdbAsIWbbXu7MzZ85c1n2JZSyBHEkoA4wD2cY9K2189/j9UZp47ksCuRwyoQyxPiN9u3MX71wiySAxwkwiKSQKPR+s1BlmryETyCE0ZJRTTU1aSPGle8ZyQZvHeJ7j7uMy+pryA0+9dzAXYnYAuXunNcI7x/6U8yH3xdSZSIejMT2450zVVhuoQ+zX8SmeMeQD+QaZRG7wlUGvri1SbwA7uvITb53tYNyjZrWpOFKijjFSi+ccG2shmehBY0g8ufMgsAgzh089KTF+kc+yR+5SYhpY+UDmsBY7/J/tegDpPsa3Fr8ivyL6E6cxw/qlxak7EzKeEWURwz1KqaX5SgRMLF9hTTUN8aUaLm0EAlhVHREsqSe9ih8mQsZL5bFLtjqW3fuaXpWNEZuR01Lyonw3Ga+EuquZUM+vYmWLyH25ZrSq5yNm1pAZG1qUGbM7IRpdU56NJn8eGh2R01zaiREZ9fbG+TOklYLxG6dZc0+jFyFmuu8Ooz7ZTWx0B8Qb0fOBXYkY5SHZHBBxbuOYW73fGSndb6J7hXERiXqud5gXyZSGfdbkCKMuK2xUi23ZAwoLxdoRPY2YiYaVNqwmtgYK1F2yrfLvbQwv7Kyp6sjmYkYei2w8YZ4ZzbmNWNWXQ9cH9PnOxucKGVHiq+eMwZS5uo1ZtSmuDkfXYC13HcFgr+duyizSd9fpGFQqqMzCIatUc/kA4wt2kZh5VFR1k3zcVdbqPBitp4xMRKYM7mr/yDz9tNrDDytV0II/HZv3uevjx+D5k/xCBuwCRwt6N9Hb1+QrbJ7Byzvs2AE3a0B+KavyRl6DE9XSwnqIa/+fFqfPnqd05Kq2Ns8ljeCO4yZkZ/sGXned5jdAugkmlmRF1rG+AZSKbQ2zS1jT0Tr9X8XqCp7LnN+E3DnuLXxvQEKlNjC7grn1GpI9xm3MbhBX+Kuj3UEtGj+qp+VyTU/CcRvvXxVuVmFvGfZf04dZz45JNnN7ki8iLouslfIcX4SuTeTCJRjv1bS1GH0dt+CL5lH6okh12WWiytlyhLkxK08zYQ47Q/bYgJWZM4amU8575mbkN+6Add1lxyp2b1tsQ+ov5metdOD2lVdGPzViisv8sRyBzxPmuu6ec5435F9/PI3/1tG8s/pgR1qNuT0n/B70iMT4Ebp4vMyjMq6lb5OZ0/DkX+PRnJj2sI5iFpKp7cdmb0fK/84OJQJZqDGxYGdv6X/A/4VrdlzTvx68meWP4NDl7mQuNcSceDnPUN/qwMa1iOnzMnSSiRKJ8e8P6vBtxfsCiW91EslTOPDFvDvVLXx+d6e6kE8q9ObFc+t4kiUfRh8j0xh9Un6M80/i7wBMzz0T/WMn0lPsTp4lz8Uwud/Y/AuLWC1N8g0AAA==",
  "Locators": "eyJJUEFkZHJlc3MiOiIxNDQuMTI2LjE1Ni4xNzYiLCJQb3J0IjoyMzMzOSwiTmFtZSI6Ildpc3RlcmlhIEJlYWNvbiBWMiIsIkJlYWNvblVJRCI6Ildpc3RlcmlhQmVhY29uVjIifQ==",
  "MD5List": "sage-j-hitsman-18.jpg::6087a76e47bda60bf33eb4005429ddfa"
}]
```

### Quema de un contrato inteligente

**Hash de la transacción:** `3d674fa4054c56583e6e68d111233771214d7affd350b47b05d7c23aa5b1f694`

**Tipo:** 4 (`NFT_BURN`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/3d674fa4054c56583e6e68d111233771214d7affd350b47b05d7c23aa5b1f694

**Datos de la transacción:**
```json
[
  {
    "Function": "Burn()",
    "ContractUID": "00dac86af0054a03b8ca5cbbefae8609:1752207991",
    "FromAddress": "RT9PGBrPFe1ykqi3auEEpCRcoG158V7JN7"
  }
]
```


## Dominios

### Compra de un dominio BTC (`.btc`)

**Hash de la transacción:** `4577381c227eba9baf18670118b6b810856fdb9def8c4026a1628a6852eabac9`

**Tipo:** 6 (`ADNR`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/4577381c227eba9baf18670118b6b810856fdb9def8c4026a1628a6852eabac9

**Datos de la transacción:**
```json
{
  "Function": "BTCAdnrCreate()",
  "Name": "Gabriel",
  "BTCAddress": "bc1qez3ztm2umw84kmkdjm20lw85p0pyzapnl63vrp",
  "Message": "1756340763",
  "Signature": "30440220c3bce77a1dcbb2050b3ccd030294ac6ec67c4b0e102519a708f10eef73d3b1830220694f25e81d5db48425c25c9f09e5c8d608b5af5b07b6cf929a0aedab4ed5c8e0.02c41221387674554593a7fca0533425315e9d4922419846ddab419e638e6e1e6e"
}
```

:::note
Este nombre se creó antes de Core 9.0.1, cuando `Message` era solo una marca de tiempo. Desde el bloque 7,575,250 (testnet 7,400), el mensaje firmado es `<unix seconds>:<VFX owner>:<name>.btc`; consulta las [reglas del libro mayor de Core 9.0.1](/es/build/node-api/transaction-creation/#reglas-del-libro-mayor-de-core-901).
:::

### Creación de una tienda

**Hash de la transacción:** `474035236ed106930f14d9ffb0b7cc8cc5d17b9e86debad7c8105a2faa592cbd`

**Tipo:** 7 (`DSTR`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/474035236ed106930f14d9ffb0b7cc8cc5d17b9e86debad7c8105a2faa592cbd

**Datos de la transacción:**
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

### Venta en una tienda

**Hash de la transacción:** `558b39d79df72033ce67344a3051f1a21a304b1450cecfcc552ffdc66848adc3`

**Tipo:** 5 (`NFT_SALE`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/558b39d79df72033ce67344a3051f1a21a304b1450cecfcc552ffdc66848adc3

**Datos de la transacción:**
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

## Cuentas de bóveda (vault)

### Activación de una bóveda

**Hash de la transacción:** `2673d456a12827f9ee7b37b93ca22ee87c943385281ad1ea98aa8d063ccb0013`

**Tipo:** 10 (`RESERVE`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/2673d456a12827f9ee7b37b93ca22ee87c943385281ad1ea98aa8d063ccb0013

**Datos de la transacción:**
```json
{
  "Function": "Register()",
  "RecoveryAddress": "RHttbdSBbMAzMDhvw8yvmPqc6Py4ZHtzNN"
}
```

## Tokens fungibles


### Despliegue de un token fungible

**Hash de la transacción:** `fea007bd641a77189f7d7eaab66f26f4d3a1f3c5b9a2cc3a17924f6cb260d841`

**Tipo:** 17 (`TKNZ_MINT`; los despliegues de tokens fungibles usan este tipo)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/fea007bd641a77189f7d7eaab66f26f4d3a1f3c5b9a2cc3a17924f6cb260d841

**Datos de la transacción:**
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

### Transferencia de un token fungible

**Hash de la transacción:** `33e67878f96ed012ad3485a25240511ee938ec25c8d4b953729665890c15b1a8`

**Tipo:** 15 (`FTKN_TX`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/33e67878f96ed012ad3485a25240511ee938ec25c8d4b953729665890c15b1a8

**Datos de la transacción:**
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

### Quema de un token fungible

**Hash de la transacción:** `b30ad8d63651edd823cd1d21e7ee0a202cc6a4bc017f125ba69d05e77ae42378`

**Tipo:** 16 (`FTKN_BURN`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/b30ad8d63651edd823cd1d21e7ee0a202cc6a4bc017f125ba69d05e77ae42378

**Datos de la transacción:**
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

Estas son transacciones de vBTC V2 en mainnet desde una bóveda vigilada (watched vault) (Core 9.0).

### Creación de un contrato vBTC V2

**Hash de la transacción:** `ede9ff7c1a45974e3cae32faafaa4fa8163e0bcb3abe884a1b76e82047a2bcaf`

**Tipo:** 25 (`VBTC_V2_CONTRACT_CREATE`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/ede9ff7c1a45974e3cae32faafaa4fa8163e0bcb3abe884a1b76e82047a2bcaf

**Datos de la transacción** (el contrato comprimido en `Data` aparece acortado aquí; tiene 121,746 caracteres):
```json
[
  {
    "Function": "Mint()",
    "ContractUID": "438b3416cb6849fc91ac436bd87362c1:1793428067",
    "Data": "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…",
    "MD5List": "defaultvBTC.png::150b90aa9d06f7e4fc5703ca6d7f01db"
  }
]
```

### Transferencia de vBTC V2

**Hash de la transacción:** `42ae512e722389757f06a093c5c0fddb7081ecc96e8ce4228c66dd1259ac49b3`

**Tipo:** 26 (`VBTC_V2_TRANSFER`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/42ae512e722389757f06a093c5c0fddb7081ecc96e8ce4228c66dd1259ac49b3

**Datos de la transacción:**
```json
{
  "Function": "TransferVBTCV2()",
  "ContractUID": "9344ffaded944166b2992957f133c8df:1793028387",
  "FromAddress": "RU3XgUWc8M9vCVFzAw1ae9hjzYhgFmbGnj",
  "ToAddress": "RVDy2D9aCxUXujgE1oxZgJMEqzwnkAt8SF",
  "Amount": 0.00001248
}
```

### Solicitud de retiro de vBTC V2

**Hash de la transacción:** `9a644175629c5c7cd4f95a6626d6f7392b65dcfa03d45eeaa64d03510739113f`

**Tipo:** 27 (`VBTC_V2_WITHDRAWAL_REQUEST`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/9a644175629c5c7cd4f95a6626d6f7392b65dcfa03d45eeaa64d03510739113f

**Datos de la transacción:**
```json
{
  "Function": "VBTCWithdrawalRequest()",
  "ContractUID": "9344ffaded944166b2992957f133c8df:1793028387",
  "RequestorAddress": "RVDy2D9aCxUXujgE1oxZgJMEqzwnkAt8SF",
  "BTCAddress": "bc1pqjh96q5dqvjysmxqcjrqxmz5n7ukr6nsu3yljz788x5luygmvmgsdlluyd",
  "Amount": 0.00027636,
  "FeeRate": 20,
  "UniqueId": null
}
```

### Reporte de Bitcoin de vBTC V2 (retiro completado)

En una bóveda vigilada, el retiro anterior se completa cuando los validadores (validators) reportan el bloque de Bitcoin que contiene su transacción de Bitcoin. Ese reporte es una transacción de tipo 43 sin remitente (`From` y `To` son `BTC_Attestation`); los clientes solo la leen.

**Hash de la transacción:** `170d6dac76c72d153dcafaa66742297880d753fc61ac06db944fc103a270c182`

**Tipo:** 43 (`VBTC_V2_BTC_REPORT`)

**URL de Spyglass:** https://spyglass.verifiedx.io/transaction/170d6dac76c72d153dcafaa66742297880d753fc61ac06db944fc103a270c182

**Datos de la transacción** (campos de nivel superior; los arreglos y las cadenas largas aparecen acortados aquí):
```json
{
  "V": 1,
  "Scope": "all",
  "BlockHeight": 973263,
  "ReplaceAbove": 0,
  "Headers": ["00c00520461a90a33c2157565f9745ffa3c1943d331eaa28b91001000000000000000000f3b3703a22504c11f9e2ebae82b467a8942f2c344f609d9f608860a31865212d2a86df6a9300021744b1f72d", "…"],
  "CoinbaseTxHex": "…",
  "CoinbaseBranch": ["…"],
  "Events": ["…"],
  "Part": 1,
  "Final": true,
  "SignerEpoch": 29,
  "Signatures": ["…"],
  "BlockHash": "00000000000000000000012368a0228acdad7797e27d4beac544842c7ad4b830"
}
```
