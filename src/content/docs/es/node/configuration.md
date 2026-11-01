---
sourceHash: 02262e7bc1a5
title: "Configuración del CLI"
description: "Cada opción del archivo de configuración del Core CLI, con su tipo, su valor predeterminado y un ejemplo."
sidebar:
  order: 3
---

El CLI crea su archivo de configuración, `config.txt`, en la primera ejecución. La carpeta de datos todavía usa los nombres heredados `RBX` (mainnet) y `RBXTest` (testnet), porque son los que usa el código.

| Sistema operativo | Mainnet | Testnet |
|---|---|---|
| macOS | `~/rbx/Config/config.txt` | `~/rbxtest/ConfigTestNet/config.txt` |
| Linux | `~/.local/share/RBX/Config/config.txt` | `~/.local/share/RBXTest/ConfigTestNet/config.txt` |
| Windows | `%LOCALAPPDATA%\RBX\Config\config.txt` | `%LOCALAPPDATA%\RBXTest\ConfigTestNet\config.txt` |

En el código, la carpeta de macOS es `rbx` en minúsculas. El sistema de archivos predeterminado de macOS no distingue mayúsculas de minúsculas, así que `~/RBX` abre la misma carpeta. La clave `CustomPath` mueve todo el árbol de datos.

En la primera ejecución, el CLI escribe `Port`, `APIPort`, `TestNet`, `NFTTimeout=15`, `AutoDownloadNFTAsset=true`, `BitcoinAddressFormat=1` y las claves del puente de Base. En testnet escribe `Port=13338` y `APIPort=17292`.

:::note
Es necesario reiniciar el CLI después de hacer cambios. Escribe un `Key=Value` por línea, sin líneas en blanco: el CLI deja de leer en la primera línea vacía. Un valor no puede contener `=`, porque la línea se divide en ese carácter.
:::

```text
1.	Port (predeterminado: 3338)
	+ a. Tipo int
	+ b. Ej.: Port=3338.
	+ c. Es el puerto para todas las funciones p2p. Debe mantenerse en 3338. En testnet, el CLI siempre usa 13338.
  
2.	APIPort (predeterminado: 7292)
	+ a.	Tipo int
	+ b.	Ej.: APIPort=7292
	+ c.	Es el puerto para llamar a la API. Puedes cambiarlo al que quieras. En testnet, el CLI siempre usa 17292.

3.	WalletPassword (predeterminado: null)
	+ a.	Tipo string
	+ b.	Ej.: WalletPassword=SomePassword1234!
	+ c.	Es una contraseña que bloquea todas las funciones de la billetera y te pide ingresarla para desbloquear las funciones de la billetera.

4.	AlwaysRequireWalletPassword (predeterminado: false)
	+ a.	Tipo boolean
	+ b.	Ej.: AlwaysRequireWalletPassword=true
	+ c.	Si se establece en true, deberás ingresar la contraseña antes de cada llamada a una función. 

5.	APIPassword (predeterminado: null)
	+ a.	Tipo string
	+ b.	Ej.: APIPassword=SomePassword1234!
	+ c.	Es una contraseña que restringe el control de la API. Debes ingresarla para llamar a cualquier función de la API.
	+ d.	Tendrás que llamar a `/api/V1/UnlockWallet/{password}` para desbloquear la API con esta contraseña. Permanece desbloqueada durante WalletUnlockTime minutos.

6.	AlwaysRequireAPIPassword (predeterminado: false)
	+ a.	Tipo boolean
	+ b.	Ej.: AlwaysRequireAPIPassword=true
	+ c.	Si se establece en true, debes incluir la contraseña en todas las solicitudes a la API, como último segmento de la ruta (`/api/V1/<Action>/{password}`). Si falta la contraseña o es incorrecta, se devuelve 403.

7.	APICallURL (predeterminado: null)
	+ a.	Tipo string
	+ b.	Ej.: APICallURL=https://mycallbackurl.com
	+ c.	Esta URL se usa para enviar las transacciones entrantes a una URL externa, por ejemplo para depósitos entrantes u otros servicios de notificación.

8.	WalletUnlockTime (predeterminado: 15)
	+ a.	Tipo int
	+ b.	Ej.: WalletUnlockTime=5
	+ c.	Es la cantidad de minutos que la billetera o la API permanecen desbloqueadas una vez ingresada la contraseña. Si alguna de las opciones AlwaysRequire anteriores está en true, anula esta opción y pide la contraseña cada vez.

9.	ChainCheckPoint (predeterminado: false)
	+ a.	Tipo Boolean
	+ b.	Ej.: ChainCheckPoint=true
	+ c.	Esta función activa los puntos de control de la cadena. Crea una copia COMPLETA del estado de la cadena, la respalda y crea un punto de control al que puedes volver si tu estructura actual se corrompe. 

10.	ChainCheckPointInternal (predeterminado: 12)
	+ a.	Tipo int
	+ b.	Ej.: ChainCheckPointInternal=4
	+ c.	Este intervalo está en horas y significa que el punto de control se ejecuta cada X horas. Usa 1 o más.
	+ d.	La clave se escribe ChainCheckPointInternal, que es la que lee el CLI. El material más antiguo la escribe ChainCheckPointInterval; esa forma se ignora.

11.	ChainCheckPointRetain (predeterminado: 2)
	+ a.	Tipo int
	+ b.	Ej.: ChainCheckPointRetain=4
	+ c.	Determina cuántos respaldos se conservan antes de empezar a eliminar el más antiguo para dejar espacio al nuevo.

12.	ChainCheckpointLocation (predeterminado: la carpeta Checkpoint del directorio de datos)
	+ a.	Tipo string
	+ b.	Ej.: ChainCheckpointLocation=C:\somelocation\otherthan\default\
	+ c.	Si no quieres la ruta predeterminada, puedes configurar una nueva ubicación para los respaldos.

13.	APICallURLLogging (predeterminado: false)
	+ a.	Tipo Boolean
	+ b.	Ej.: APICallURLLogging=true 
	+ c.	Depura la URL de llamada de la API en caso de que haya un problema con las transacciones enviadas a tu URL. Se recomienda activarlo durante las pruebas iniciales de tu URL.

14.	ValidatorAddress (predeterminado: null)
	+ a.	Tipo string
	+ b.	Ej.: ValidatorAddress=RBcHyS2AF4Z4jgzTLZNBVLvtxQ6MtB2vUN
	+ c.	Puedes ingresar una dirección de validador (validator) predeterminada para empezar a validar de inmediato. Ten en cuenta que también debes importar la dirección de la billetera mediante los comandos de inicio. Ej.: VerifiedXCore.exe privkey=MyPrivateKey (Linux y macOS: dotnet VerifiedXCore.dll privkey=MyPrivateKey). Las direcciones de mainnet empiezan con R y las de testnet con x.

15.	ValidatorName (predeterminado: nuevo guid)
	+ a.	Tipo string
	+ b.	Ej.: ValidatorName=MyValidator1
	+ c.	Es el nombre que se usará para el validador anterior. Una vez que el validador se haya importado, estas opciones ya no hacen nada y puedes eliminarlas o dejarlas. 

16.	NFTTimeout (predeterminado: 15 s)
	+ a.	Tipo int
	+ b.	Ej.: NFTTimeout=5
	+ c.	Controla el tiempo de espera para procesar un NFT entrante 

17.	PasswordClearTime (predeterminado: 10 min)
	+ a.	Tipo int
	+ b.	Ej.: PasswordClearTime=5
	+ c.	Controla el tiempo tras el cual se borra la contraseña de una billetera cifrada

18.	AutoDownloadNFTAsset (predeterminado: true en el archivo escrito en la primera ejecución; false si falta la clave)
	+ a.	Tipo Boolean
	+ b.	Ej.: AutoDownloadNFTAsset=false
	+ c.	Controla si el recurso de un NFT se descarga automáticamente o no

19.	IgnoreIncomingNFTs (predeterminado: false)
	+ a.	Tipo Boolean
	+ b.	Ej.: IgnoreIncomingNFTs=false
	+ c.	Controla si los NFTs entrantes se procesan o solo se agregan como un registro de transacción

20.	RejectAssetExtensionTypes (predeterminado: una lista de recursos rechazados)
	+ a.	Tipo List<string>
	+ b.	Ej.: RejectAssetExtensionTypes=.iso,.apk,.pdf (incluye el punto inicial y no dejes espacios entre los tipos; las entradas sin el punto no coinciden con nada)
	+ c.	Agrega tipos de extensión a la lista ya definida y rechaza cualquier recurso de NFT con estas extensiones conocidas

21.	AllowedExtensionsTypes (predeterminado: null)
	+ a.	Tipo List<string>
	+ b.	Ej.: AllowedExtensionsTypes=.doc,.xls (incluye el punto inicial)
	+ c.	Quita tipos de extensión de la lista ya definida y permite descargar cualquier recurso de NFT con estas extensiones conocidas
	
22.     MotherAddress (predeterminado: null)
	+ a. Tipo string
	+ b. Ej.: 111.222.333.444
	+ c. La dirección IP de la billetera en la que alojas MOTHER

23.     MotherPassword (predeterminado: null)
	+ a. Tipo string
	+ b. Ej.: MyPassword
	+ c. La contraseña establecida al configurar MOTHER

24.	CustomPath (predeterminado: null)
	+ a.	Tipo string
	+ b.	Ej.: CustomPath=/mnt/vfxdata/
	+ c.	Mueve todo el árbol de datos (bases de datos, puntos de control, configuración y recursos) a esta carpeta. El CLI agrega RBX o RBXTest, así que termina el valor con un separador de ruta.

25.	OpenAPI (predeterminado: false)
	+ a.	Tipo Boolean
	+ b.	Ej.: OpenAPI=true
	+ c.	Escucha la API en todas las interfaces en lugar de solo en localhost, igual que el argumento de inicio openapi. El nodo lo rechaza y se queda en localhost a menos que se establezca un argumento de inicio apitoken (o APIPassword con AlwaysRequireAPIPassword=true). Entonces la página de Swagger en /swagger requiere el encabezado apitoken.

26.	IPAddress (predeterminado: null)
	+ a.	Tipo string
	+ b.	Ej.: IPAddress=203.0.113.10
	+ c.	La IP pública que este nodo informa a sus pares, establecida a mano en lugar de detectada. Se lee ReportedIP cuando falta IPAddress.

27.	SkipIPs (predeterminado: null)
	+ a.	Tipo string (separado por comas)
	+ b.	Ej.: SkipIPs=203.0.113.10,198.51.100.7
	+ c.	Se omiten los pares y validadores en estas IP.

28.	ElectrumServers (predeterminado: la lista integrada)
	+ a.	Tipo string (separado por comas)
	+ b.	Ej.: ElectrumServers=https://electrum.blockstream.info:50002,https://bitcoin.lu.ke:50002
	+ c.	Reemplaza los servidores Electrum de Bitcoin que usa el nodo. Antepón https:// a un servidor para usar TLS; sin él, la conexión es sin cifrar. En testnet, el valor predeterminado son los servidores signet de VerifiedX en el puerto 50002.

29.	BitcoinAddressFormat (predeterminado: 1)
	+ a.	Tipo int
	+ b.	Ej.: BitcoinAddressFormat=2
	+ c.	El tipo de dirección de Bitcoin para las claves nuevas: 0 = SegWit P2SH, 1 = SegWit nativo, 2 = Taproot.

30.	MaxBtcFeeRateSatPerVb (predeterminado: 2000)
	+ a.	Tipo int
	+ b.	Ej.: MaxBtcFeeRateSatPerVb=500
	+ c.	La tasa de comisión de Bitcoin más alta, en sat/vB, que usará cualquier ruta de firma de este nodo.

31.	S3C (predeterminado: null)
	+ a.	Tipo string (pares IP:ValidatorAddress separados por comas)
	+ b.	Ej.: S3C=203.0.113.10:Rxxxx,203.0.113.11:Rxxxx,203.0.113.12:Rxxxx
	+ c.	Modo Self-Custodial Smart Contract para un nodo que emite: las ceremonias de las bóvedas vBTC usan solo estos validadores. Se requieren al menos 3 entradas con IP públicas y direcciones de VFX válidas. Si el valor no es válido, la emisión de vBTC se rechaza hasta que se corrija.

32.	S3CValidator (predeterminado: false)
	+ a.	Tipo Boolean
	+ b.	Ej.: S3CValidator=true
	+ c.	Marca este validador como validador S3C en su registro y en sus latidos (heartbeats), para que los pools S3C puedan usarlo.
	
	
```
