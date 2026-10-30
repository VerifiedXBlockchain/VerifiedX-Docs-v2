---
sourceHash: 652e43229e9a
title: "Servicio de contratos de tokens de VerifiedX"
description: El servicio de contratos de tokens para crear, gestionar y transferir tokens fungibles escritos en Trillium.
sidebar:
  order: 12
  label: Contratos de tokens
---

El **servicio de contratos de tokens** (Token Contract Service) de la **blockchain VerifiedX** se encarga de gestionar los contratos inteligentes basados en tokens e interactuar con ellos. Estos contratos son clave para crear tokens fungibles, como monedas personalizadas, que se pueden emitir, transferir y rastrear en la **blockchain VerifiedX**.

El servicio facilita la creación de tokens fungibles mediante el lenguaje de contratos inteligentes **Trillium**, lo que permite a los usuarios desplegar tokens en la blockchain y definir sus propias reglas personalizadas para ellos. La red VerifiedX ofrece una experiencia sin gas, lo que significa que los usuarios no necesitan pagar comisiones de gas para desplegar estos contratos de tokens ni para interactuar con ellos.

## Funciones clave

### 1. **Crea y despliega tokens fungibles**
El **servicio de contratos de tokens** permite a los desarrolladores crear tokens personalizados escribiendo contratos inteligentes en Trillium que definen el comportamiento de los tokens. Estos tokens pueden representar cualquier cosa, desde activos digitales hasta monedas dentro de un juego, puntos de lealtad y más.

### 2. **Gestiona la oferta de tokens**
Con el **servicio de contratos de tokens**, los desarrolladores pueden controlar la oferta total del token, gestionar los procesos de emisión y quema, y definir reglas para la transferencia y la propiedad del token. Esto ofrece un marco flexible para diversos casos de uso de tokenización.

### 3. **Operaciones con tokens sin gas**
Una característica única de la blockchain VerifiedX es que el **servicio de contratos de tokens** funciona sin requerir pagos de gas. Este entorno sin gas hace que las operaciones con tokens (por ejemplo, transferir tokens o crearlos) sean más eficientes y económicas para usuarios y desarrolladores.

### 4. **Compatibilidad con lógica de tokens personalizada**
El **servicio de contratos de tokens** ofrece flexibilidad en el comportamiento de los tokens. Los desarrolladores pueden definir lógica personalizada para las transferencias de tokens, las condiciones en las que se emiten o se queman, y otras funcionalidades especiales como el staking o las recompensas.

### 5. **Seguimiento de transacciones**
El servicio de contratos de tokens lleva el registro de las transacciones de tokens en la blockchain, lo que garantiza que todas las transferencias y los cambios en los saldos de tokens queden registrados de forma segura e inmutable.

### 6. **Votación**
Los tokens también tienen un mecanismo de votación único que les permite realizar votaciones verdaderamente on-chain. 

## Código de Trillium para crear tokens

El **TokenSourceGenerator** genera código de **Trillium** para crear tokens fungibles. Este código está escrito de forma que simplifica el despliegue de nuevos tokens al abstraer las complejidades técnicas de la creación de contratos. A continuación se muestra un ejemplo de cómo podría verse un contrato de token básico escrito en **Trillium**:

### Ejemplo de contrato de token en Trillium:

```trillium
let TokenName = "Vote Demo"
let TokenTicker = "VOTE"
let TokenDecimalPlaces = 8
let TokenSupply = 0
let TokenBurnable = true
let TokenVoting = true
let TokenMintable = true
let TokenImageURL = ""
let TokenImageBase = "base64_of_image"
let Name = "Vote Demo"
let Description = "VOTE"
let MinterAddress = "xJcWLXPJ8rGcs4CrKmhY35RC9JZP4NefC1"
let MinterName = "xJcWLXPJ8rGcs4CrKmhY35RC9JZP4NefC1"
let SmartContractUID = "54b75872cf2d4078bb66273ae933de5a:1734577732"
let Features = "13"
let SCVersion = 1
let FileSize = "5456"
let FileName = "5a7zyFswUAYDmlGK.png"
let AssetAuthorName = "xJcWLXPJ8rGcs4CrKmhY35RC9JZP4NefC1"
function NftMain(data : string) : string
{
  if data == "nftdata"
   {
       return GetNFTData(Name, Description, MinterAddress)
   }
  else if data == "getnftassetdata"
   {
       return GetNFTAssetData(FileName, FileSize, AssetAuthorName)
   }
  return "No Method Named " + data + " was found."
}
function GetNFTData(name : string, desc : string, mintAddr: string) : string
{
   return name + "|->" + desc + "|->" + mintAddr
}
function GetNFTAssetData(fileName : string, fileSize : string, assetAuthor : string) : string
{
   return (fileName + "|->" + fileSize + "|->" + assetAuthor)
}
function GetNFTId() : string
{
   return SmartContractUID
}
function GetNFTFeatures() : string
{
   return Features
}
function GetTokenDetails() : any
{
   return getTokenDetails(TokenName, TokenTicker, TokenDecimalPlaces, TokenSupply, TokenVoting, TokenBurnable, TokenImageURL, TokenImageBase)
}
function GetVotingRules() : any
{
   return getVotingRules(1, "nDPkmoWjuUDmhNxbtR", 30, true)
}
function GetBurnRules() : int
{
   return 0
}
function GetTokenFunctions() : any
{
   return "TokenTransfer()" + "|->""TokenDeploy()" + "|->" + "TokenVote()" + "|->" + "TokenCreateVote()" + "|->" + "TokenBurn()" + "|->" + "TokenMint()"
}
```
