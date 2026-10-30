---
sourceHash: 1859af041aef
title: "Creación de transacciones y firmas de VFX"
description: "Construye, aplica el hash, firma, verifica y transmite una transacción de VFX en bruto a través de la API de Core sin exponer la clave privada, y las reglas del libro mayor de Core 9.0.1."
sidebar:
  label: Creación de transacciones
  order: 4
---

## Resumen:

El propósito de este documento es enseñarte cómo crear una transacción y firmarla para luego transmitirla por la red de VFX. Ten en cuenta que con este proceso nunca necesitas exponer tu clave privada a la billetera ni a ningún lugar fuera de la aplicación que estás construyendo. Al final de este documento, en la sección extra, se explica cómo enviar una TX si tu clave privada está asociada a una billetera.

## Reglas del libro mayor de Core 9.0.1

Core 9.0 se lanzó con un lote de reglas del libro mayor y de consenso desactivadas. Core 9.0.1 las activa a una sola altura (`LedgerRulesBatchHeight`): el bloque **7,575,250** en mainnet y el bloque **7,400** en testnet. Todos los validadores (validators) y casters deben ejecutar Core 9.0.1 antes de esa altura. Lo que cambia para los integradores a partir de esa altura:

- **Creación de un nombre `.btc`:** la firma la clave de la dirección de Bitcoin a la que apunta el nombre. El mensaje firmado es `<unix seconds>:<VFX owner>:<name>.btc` y es válido durante 30 minutos. El nombre se envía sin `.btc`. Consulta [Servicios de dominio de VFX](/es/learn/domains/#crear-un-nombre-btc).
- **Transferencia de un nombre `.btc`:** incluye la aceptación de la clave de Bitcoin receptora, `<unix seconds>:<new VFX owner>:<name>.btc`, válida durante 24 horas. Consulta [`TransferAdnr`](/es/build/node-api/details/#gestión-de-adnr).
- **Nombres `.vfx` (`AdnrCreate()`):** letras minúsculas, dígitos y `-`, de 1 a 65 caracteres, enviados sin sufijo. No se puede tomar una etiqueta cuyo nombre heredado `.rbx` ya exista.
- **Emisiones de tokens (`TokenMint()`):** se rechazan en un contrato pausado, con más decimales que los `DecimalPlaces` del token, o cuando el suministro o el saldo del titular se desbordarían. Una emisión por contrato por bloque.
- **`Update()`, `Transfer()`, `Burn()`, `Evolve()`, `Devolve()` y `ChangeEvolveStateSpecific()` de NFT:** `Data` debe tener la forma de arreglo. Un objeto único, que antes se minaba sin efecto, se rechaza.
- **Evolve:** `Evolve()`, `Devolve()` y `ChangeEvolveStateSpecific()` solo se aplican a un contrato con la función Evolving, y llevan un cuerpo que la conserva.
- **Movimientos de contratos:** un bloque mueve un contrato (`Transfer()` o `Burn()`) como máximo una vez.
- **Temas de votación (`VOTE_TOPIC`):** la función es solo `TopicAdd()`. La cadena define el propietario, el conteo, la hora de creación y la cantidad de validadores del nuevo tema; los valores que se envíen para ellos no se usan.
- **`DecShopCreate()`:** el propietario de la tienda es el remitente de la transacción.
- **`TokenContractOwnerChange()`:** el nuevo propietario es el destinatario de la transacción (`ToAddress`).
- **Comisión:** menor que 1 VFX (las transacciones privadas aplican el hash de otra forma y están exentas).
- **Montos fraccionarios:** una transacción con un `Amount` no entero debe aplicar el hash con ese monto. Se rechaza una firma sobre un hash hecho con `0`.
- **Red del destinatario:** `ToAddress` lleva el byte de versión de esta red. Se rechaza una dirección de testnet en mainnet, o al revés (los nodos ya la rechazan en la admisión).
- **Productores de bloques (semilla VRF):** la VRF de un productor toma como semilla el bloque ancla de su época, 100 bloques por debajo de la primera altura de la época, no el hash del bloque padre. Las épocas son de 8,640 bloques contados desde la altura de activación. Un validador registrado después del ancla de una época produce a partir de la época siguiente.
- **Tamaño de bloque:** como máximo 3,000 transacciones por bloque, incluida la coinbase.

La misma altura también activa: que el `Recover()` de una reserva lea todas las filas pendientes; ningún `Amount` en una transacción de reserva que no sea una transferencia; que cada clave se nombre una sola vez en el `Data` de una transferencia de vBTC V2 por llamada a contrato; la protección contra repetición mantenida por la hora del bloque; transferencias de tokens que acreditan al destinatario antes de debitar al remitente; un nombre `.btc` por dirección de Bitcoin, con eliminación y transferencia que solo actúan sobre el registro propio del remitente; `TopicAdd()` evaluado solo sobre el estado que tienen todos los nodos; blindajes que no llevan nullifier; y la regla de antigüedad del firmante para el conjunto de firmantes de los informes de Bitcoin.

## Cómo crear una transacción de VFX

Para crear una transacción, primero debes entender cómo está hecha la clase de transacción. A continuación verás la clase completa y los enums asociados a ella.

```csharp
public class Transaction {

   public ObjectId Id { get; set; }

   public string Hash { get; set; }

   public string ToAddress { get; set; }

   public string FromAddress { get; set; }

   public decimal Amount { get; set; }

   public long Nonce { get; set; }

   public decimal Fee { get; set; }

   public long Timestamp { get; set; }

   public string? Data { get; set; }

   public string Signature { get; set; }

   public long Height { get; set; }

   public TransactionType TransactionType { get; set; }

   public TransactionRating? TransactionRating { get; set; }

   public TransactionStatus? TransactionStatus { get; set; }

}
```

- **Id** - Este campo se genera automáticamente y no necesitas hacer nada con él

- **Hash** - Lo crea la billetera una vez que se prepara una TX completa. Un hash se compone de los siguientes datos: `Timestamp + FromAddress + ToAddress + Amount + Fee + Nonce + TransactionType + Data`
- **ToAddress** - Es la dirección de VFX a la que se envía la transacción
- **FromAddress** - Es la dirección de VFX desde la que se envía la transacción.
- **Amount** - Es la cantidad de VFX que se envía en una transacción
- **Nonce** - Es el contador de transacciones de una dirección. A medida que se envían transacciones, este contador aumenta en 1
- **Fee** - Es la comisión atómica cercana a cero asociada a una transacción, y la calcula la billetera.
- **Timestamp** - Es una marca de tiempo Unix en segundos
- **Data** - Son los datos de TX asociados cuando una transacción es más que una transferencia básica de VFX (ej.: NFTs, ADNR, etc.). Puede dejarse en _null_ si realizas una TX básica de VFX.
- **Signature** - Es una firma ECDSA cuyo mensaje es siempre el Hash de la transacción.
- **Height** - Es la altura de bloque a la que se asocia una TX una vez creada. Se completa automáticamente y puede dejarse en 0 al crear una TX.
- **TransactionType** - Proviene del enum siguiente. Si realizas una TX básica, elegirías TransactionType.TX o 0.
- **TransactionRating** - Se completa automáticamente mediante TX Verify y puede dejarse en _null._
- **TransactionStatus** - Debe tener 1 como valor predeterminado.

Los enums siguientes coinciden con `VerifiedXCore/Models/Transaction.cs` en Core 9.0. Los tipos 43, 45 y 46 los crean los validadores y no tienen remitente (`From` y `To` son `BTC_Attestation`, sin monto y sin comisión), así que un cliente nunca los construye; aun así, puede verlos en los bloques y en las listas de transacciones. El tipo 44 es una transacción ordinaria firmada por quien solicita el retiro.

```csharp
 public enum TransactionType
{
    TX = 0,
    NODE = 1,
    NFT_MINT = 2, //mint
    NFT_TX = 3, //transfer or other process (not for sale or burn)
    NFT_BURN = 4, //burn nft
    NFT_SALE = 5, //sale NFT
    ADNR = 6, //address dnr
    DSTR = 7, //DST shop registration
    VOTE_TOPIC = 8, //voting topic for validators to vote on
    VOTE = 9, //cast vote for topic
    RESERVE = 10, //create a reserve TX
    SC_MINT = 11, //standard sc mint
    SC_TX = 12, //standard sc tx
    SC_BURN = 13, //standard sc burn
    FTKN_MINT = 14, //fungible token mint
    FTKN_TX = 15, //fungible token tx
    FTKN_BURN = 16, //fungible token burn
    TKNZ_MINT = 17, //tokenization token mint
    TKNZ_TX = 18, //tokenization token tx
    TKNZ_BURN = 19, //tokenization token burn
    TKNZ_WD_ARB = 20,
    TKNZ_WD_OWNER = 21,
    VBTC_V2_VALIDATOR_REGISTER = 22, //validator registers for vBTC v2
    VBTC_V2_VALIDATOR_HEARTBEAT = 23, //validator heartbeat
    VBTC_V2_VALIDATOR_EXIT = 24, //validator exits the vBTC v2 pool
    VBTC_V2_CONTRACT_CREATE = 25, //create a vBTC v2 contract
    VBTC_V2_TRANSFER = 26, //transfer vBTC v2 tokens
    VBTC_V2_WITHDRAWAL_REQUEST = 27, //request a withdrawal to BTC
    VBTC_V2_WITHDRAWAL_COMPLETE = 28, //complete a withdrawal
    VBTC_V2_WITHDRAWAL_CANCEL = 29, //request a cancellation
    VBTC_V2_WITHDRAWAL_VOTE = 30, //validator votes on a cancellation
    VFX_SHIELD = 31,
    VFX_UNSHIELD = 32,
    VFX_PRIVATE_TRANSFER = 33,
    VBTC_V2_SHIELD = 34,
    VBTC_V2_UNSHIELD = 35,
    VBTC_V2_PRIVATE_TRANSFER = 36,
    VBTC_V2_BRIDGE_LOCK = 37, //lock vBTC for bridging to Base
    VBTC_V2_BRIDGE_UNLOCK = 38, //unlock vBTC after a burn on Base (legacy, single lock)
    VBTC_V2_BRIDGE_POOL_UNLOCK = 39, //pool unlock: credit vBTC from several locks to a VFX address
    VBTC_V2_BRIDGE_EXIT_TO_BTC = 40, //Base burn for a BTC exit: records the withdrawal on VFX
    VBTC_V2_BRIDGE_EXIT_TO_BTC_COMPLETE = 41, //after the BTC broadcast
    VBTC_V2_BRIDGE_EXIT_TO_BTC_FAIL = 42, //FROST failed for some locks: reverse and retry
    VBTC_V2_BTC_REPORT = 43, //Bitcoin headers and the vault transactions of one Bitcoin block (validators, sender-less)
    VBTC_V2_COIN_PIN = 44, //the requester re-pins its withdrawal at a higher Bitcoin fee rate (fee bump; watched vaults)
    VBTC_V2_BTC_REORG = 45, //Bitcoin reorganised below reported events: they are taken back (validators, sender-less)
    VBTC_V2_VAULT_REKEY = 46 //a vault's key is replaced by one the current validators made (validators, sender-less)
}

public enum TransactionStatus {
   Pending,
   Success,
   Failed,
   Reserved,
   CalledBack,
   Recovered,
   ReplacedByFee,
   Invalid = 999
}

public enum TransactionRating {
   A = 1,
   B = 2,
   C = 3,
   D = 4,
   E = 5,
   F = 6
}
```

Ahora que entiendes para qué sirve cada elemento, aprenderás a crear una TX y enviarla al mempool para su confirmación.

- Primero debes conocer las direcciones de destino (To) y de origen (From)

  - To: xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9
  - From: xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC

- Debes obtener el siguiente nonce de tu dirección de origen
  **[http://localhost:7292/txapi/TXV1/GetAddressNonce/xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC](http://localhost:7292/txapi/TXV1/GetAddressNonce/xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC)**  
   La respuesta es la siguiente:
  `{"Result":"Success","Message":"Next Nonce Found.","Nonce":38}`
- El siguiente nonce de nuestra dirección de origen `(xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC)` es: 38

- También querrás obtener una marca de tiempo. Puedes generar tu propia marca de tiempo UNIX en segundos o usar la API de la billetera para obtenerla:
  - **[http://localhost:7292/txapi/TXV1/GetTimestamp](http://localhost:7292/txapi/TXV1/GetTimestamp)**
  - `{"Result":"Success","Message":"Timestamp Acquired.","Timestamp":1672795597}`
- Luego crearás tu clase de Transaction

```csharp
 Transaction tx1 = new Transaction {
   ToAddress = "xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9",
   FromAddress = "xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC",
   Amount = 1.0M,
   Data = null,
   Nonce = 38,
   TransactionType = TransactionType.TX, // or 0
   Fee = 0.0M,
   Timestamp = 1672795597,
   TransactionRating = TransactionRating.A, //or 1
};
```

- Después tomarás esa clase, la serializarás en JSON y la enviarás a la siguiente llamada de la API para obtener la comisión.

  ` {"Hash":null,"ToAddress":"xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9","FromAddress":"xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC","Amount":1.0,"Nonce":38,"Fee":0.0,"Timestamp":1672789611,"Data":null,"Signature":null,"Height":0,"TransactionType":0,"TransactionRating":1,"TransactionStatus":null}`
  **[http://localhost:7292/txapi/TXV1/GetRawTxFee](http://localhost:7292/txapi/TXV1/GetRawTxFee)**

  La respuesta del método **POST** es la siguiente:  
  `{"Result":"Success","Message":"TX Fee Calculated","Fee":0.0000028515625}`

- Tomarás la comisión **0.0000028515625** y la pegarás en tu clase. Ahora tienes la siguiente transacción:

```csharp
  Transaction tx2 = new Transaction{
      ToAddress = "xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9",
      FromAddress = "xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC",
      Amount = 1.0M,
      Data = null,
      Nonce = 38,
      TransactionType = TransactionType.TX,
      Fee = 0.0000028515625M,
      Timestamp = 1672795597,
      TransactionRating = TransactionRating.A, //or 1
  };
```

- Tomarás esa clase, la serializarás en JSON otra vez y la enviarás al método **POST** para obtener el hash.

  - `{"Hash":null,"ToAddress":"xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9","FromAddress":"xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC","Amount":1.0,"Nonce":38,"Fee":0.0000028515625,"Timestamp":1672789611,"Data":null,"Signature":null,"Height":0,"TransactionType":0,"TransactionRating":1,"TransactionStatus":null}`

    **[http://localhost:7292/txapi/TXV1/GetTxHash](http://localhost:7292/txapi/TXV1/GetTxHash)**

    La respuesta del método **POST** es la siguiente:

    `{"Result":"Success","Message":"TX Fee Calculated","Hash":"9528d9693a824e55c456bd8646df10a060e7d6bdfcf0d5e04fcbfec9d718742a"}`

- Ahora tienes una TX casi completa. Solo necesitas tomar el hash `(“9528d9693a824e55c456bd8646df10a060e7d6bdfcf0d5e04fcbfec9d718742a”)` e insertarlo en el campo Hash de la clase. Tendrás una clase de TX como esta:

```csharp
Transaction tx3 = new Transaction{
   ToAddress = "xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9",
   FromAddress = "xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC",
   Amount = 1.0M,
   Data = null,
   Nonce = 38,
   TransactionType = TransactionType.TX,
   Fee = 0.0000028515625M,
   Timestamp = 1672795597,
   TransactionRating = TransactionRating.A, //or 1
   Hash = "9528d9693a824e55c456bd8646df10a060e7d6bdfcf0d5e04fcbfec9d718742a"
};
```

- Lo único que falta es firmar el hash. Cualquier biblioteca ECDSA que uses para producir claves privadas probablemente tenga también un método de firma. Debes firmar el hash y luego combinarlo con la clave pública.

- Una vez firmada, la firma se convierte a Base64 (toDer)

  La clave pública de la dirección sin el identificador hexadecimal (quita el 04 al inicio de la clave pública si está ahí) y luego codificada en base58.  
  Combina `a + un punto + b`

  En efecto, tendrías algo parecido a esto:

  - ` MEYCIQDd141oBoBfcznYAI05CnoCWVhEkMaBpthmqG8bLjusqgIhAOkywWZ2h0cYjcbFx6MT5Yc1pJmRdQvMzZdQP4O2O3QE.`
  - `5msmMuPGKwpvtYofSdr6zk1AWG5Rz1vmf5z5DTVb6PYXibwovzkKM7Eg2BTQ5KDeUKwSyEAzHq9KjTFc1hyhfiFg`
  - `MEYCIQDd141oBoBfcznYAI05CnoCWVhEkMaBpthmqG8bLjusqgIhAOkywWZ2h0cYjcbFx6MT5Yc1pJmRdQvMzZdQP4O2O3QE` - Este es el script de firma en Base64 (toDer)
  - `5msmMuPGKwpvtYofSdr6zk1AWG5Rz1vmf5z5DTVb6PYXibwovzkKM7Eg2BTQ5KDeUKwSyEAzHq9KjTFc1hyhfiFg` - esta es la clave pública con codificación Base58, sin el identificador hexadecimal ‘04’
  - Si quieres ver el método de firma, lo encuentras aquí:**[https://github.com/VerifiedXBlockchain/VerifiedX-Core/blob/main/ReserveBlockCore/EllipticCurve/Ecdsa.cs](https://github.com/VerifiedXBlockchain/VerifiedX-Core/blob/main/ReserveBlockCore/EllipticCurve/Ecdsa.cs)**

- El método es **public static Signature sign(string message, PrivateKey privateKey)**

- Una vez que tengas una firma, debes agregarla a la clase Transaction que has estado creando. Ahora deberías tener esto:

```csharp
Transaction tx3 = new Transaction{
   ToAddress = "xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9",
   FromAddress = "xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC",
   Amount = 1.0M,
   Data = null,
   Nonce = 38,
   TransactionType = TransactionType.TX,
   Fee = 0.0000028515625M,
   Timestamp = 1672795597,
   TransactionRating = TransactionRating.A, //or 1
   Hash = "9528d9693a824e55c456bd8646df10a060e7d6bdfcf0d5e04fcbfec9d718742a"
   Signature = "MEUCIQCUckWn1yDGpyQfbrylYMg50pOn2LrTyvErwcPA6CMKNQIgJYUxe1/xJ+MVnprGgY7tYR3fDZyqtarlgaailYBC/Ek=.5msmMuPGKwpvtYofSdr6zk1AWG5Rz1vmf5z5DTVb6PYXibwovzkKM7Eg2BTQ5KDeUKwSyEAzHq9KjTFc1hyhfiFg"
};
```

- Con la firma en su lugar, estás listo para verificar la TX.

  `{"Hash":"9528d9693a824e55c456bd8646df10a060e7d6bdfcf0d5e04fcbfec9d718742a","ToAddress":"xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9","FromAddress":"xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC","Amount":1.0,"Nonce":38,"Fee":0.0000028515625,"Timestamp":1672789611,"Data":null,"Signature":"MEUCIQCUckWn1yDGpyQfbrylYMg50pOn2LrTyvErwcPA6CMKNQIgJYUxe1/xJ+MVnprGgY7tYR3fDZyqtarlgaailYBC/Ek=.5msmMuPGKwpvtYofSdr6zk1AWG5Rz1vmf5z5DTVb6PYXibwovzkKM7Eg2BTQ5KDeUKwSyEAzHq9KjTFc1hyhfiFg","Height":0,"TransactionType":0,"TransactionRating":1,"TransactionStatus":null}`
  **[http://localhost:7292/txapi/TXV1/VerifyRawTransaction](http://localhost:7292/txapi/TXV1/VerifyRawTransaction)**

- Si pasa: `{"Result":"Success","Message":"Transaction has been verified.","Hash":"67d97333e5b62abfd6dc8d28a3200677a53b58526aecafd80190b13c5507083e"}`

- Si falla, la respuesta contendrá algo como:

  - `{"Result":"Fail","Message":"Transaction was not verified. Error: The timestamp of this transactions is too old to be sent now."}`
  - `{"Result":"Fail","Message":"Transaction was not verified. Error: This transactions hash is not equal to the original hash."}`

- Una vez que el payload anterior devuelva **“Success”**, puedes enviar la TX para que se transmita

  - {"Hash":"67d97333e5b62abfd6dc8d28a3200677a53b58526aecafd80190b13c5507083e","ToAddress":"xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9","FromAddress":"xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC","Amount":1.0,"Nonce":38,"Fee":0.0000028515625,"Timestamp":1672795597,"Data":null,"Signature":"MEQCIF+sAjfQ07bBRxjv7eFwlcoz5OUn3t8rRAkdWqUJj1MRAiARlubEIprX2tlHw6eBUZUGTDOGf9/IzdKSte67m0Y6pw==.5msmMuPGKwpvtYofSdr6zk1AWG5Rz1vmf5z5DTVb6PYXibwovzkKM7Eg2BTQ5KDeUKwSyEAzHq9KjTFc1hyhfiFg","Height":0,"TransactionType":0,"TransactionRating":1,"TransactionStatus":null}

  - **[http://localhost:7292/txapi/TXV1/SendRawTransaction](http://localhost:7292/txapi/TXV1/SendRawTransaction)**
  - `{"Result":"Success","Message":"Transaction has been broadcasted.","Hash":"67d97333e5b62abfd6dc8d28a3200677a53b58526aecafd80190b13c5507083e"}`

En este punto has creado con éxito una TX en bruto, la has firmado y la has transmitido

### Ya terminaste.

![La transacción transmitida en el explorador](../../../../../assets/media/integration/complete-transaction-image.png)

## Extra:

---

Sin embargo, si tienes la clave asociada a la billetera, puedes usar simplemente la API integrada para enviar una TX:

![SendTransaction en la página de Swagger](../../../../../assets/media/integration/api-transaction-image.png)
**[http://localhost:7292/txapi/TXV1/SendTransaction](http://localhost:7292/txapi/TXV1/SendTransaction/)/faddr/taddr/amt**

```
Faddr = xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC
Taddr = xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9
Amt = 1.0
http://localhost:7292/txapi/TXV1/SendTransaction/xMpa8DxDLdC9SQPcAFBc2vqwyPsoFtrWyC/xJuWfvE3pp73wno85k3QFWwK9wM9XRhhd9/1
Response body is: Success! TxId: a09f62b718c7552c33fd5fe213341af39881668fa41ad9ffbe67d3140739aa4b
```
