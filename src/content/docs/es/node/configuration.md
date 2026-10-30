---
sourceHash: d56948f6c31a
title: "Configuración del CLI"
description: "Cada opción del archivo de configuración del Core CLI, con su tipo, su valor predeterminado y un ejemplo."
sidebar:
  order: 3
---

El archivo de configuración del CLI se encuentra en `~/RBX/Config/config.txt`.
> Nota: es necesario reiniciar el CLI después de hacer cambios.

```
1.	Port (predeterminado: 3338)
	+ a. Tipo int
	+ b. Ej.: Port=3338.
	+ c. Es el puerto para todas las funciones p2p. Debe mantenerse en 3338.
  
2.	APIPort (predeterminado: 7292)
	+ a.	Tipo int
	+ b.	Ej.: APIPort=7292
	+ c.	Es el puerto para llamar a la API. Puedes cambiarlo al que quieras.

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
	+ d.    Tendrás que llamar a UnlockWallet para desbloquear la API con esta contraseña.

6.	AlwaysRequireAPIPassword (predeterminado: false)
	+ a.	Tipo boolean
	+ b.	Ej.: AlwaysRequireAPIPassword=true
	+ c.	Si se establece en true, debes incluir la contraseña en todas las solicitudes a la API.

7.	APICallURL (predeterminado: null)
	+ a.	Tipo string
	+ b.	Ej.: APICallURL=https://mycallbackurl.com
	+ c.	Esta URL se usa para enviar las transacciones entrantes a una URL externa. Se usa, por ejemplo, para depósitos entrantes u otros servicios de notificación.

8.	WalletUnlockTime (predeterminado: 15)
	+ a.	Tipo int
	+ b.	Ej.: WalletUnlockTime=5
	+ c.	Es el tiempo durante el cual, una vez ingresada la contraseña, la billetera permanece desbloqueada y no vuelve a pedirla. Si alguna de las opciones RequirePassword anteriores está en true, anula esta opción y pide la contraseña cada vez. 

9.	ChainCheckPoint (predeterminado: false)
	+ a.	Tipo Boolean
	+ b.	Ej.: ChainCheckPoint=true
	+ c.	Esta función activa los puntos de control de la cadena. Crea una copia COMPLETA del estado de la cadena, la respalda y crea un punto de control al que puedes volver si tu estructura actual se corrompe. 

10.	ChainCheckPointInterval (predeterminado: 12)
	+ a.	Tipo int
	+ b.	Ej.: ChainCheckPointInterval=4
	+ c.	Este intervalo está en horas y significa que el punto de control se ejecuta cada X horas; el mínimo permitido es 1.

11.	ChainCheckPointRetain (predeterminado: 2)
	+ a.	Tipo int
	+ b.	Ej.: ChainCheckPointRetain=4
	+ c.	Determina cuántos respaldos se conservan antes de empezar a eliminar el más antiguo para dejar espacio al nuevo.

12.	ChainCheckPointLocation (predeterminado: ruta predeterminada)
	+ a.	Tipo string
	+ b.	Ej.: ChainCheckPointLocation=C:\somelocation\otherthan\default\
	+ c.	Si no quieres la ruta predeterminada, puedes configurar una nueva ubicación para los respaldos.

13.	APICallURLLogging (predeterminado: false)
	+ a.	Tipo Boolean
	+ b.	Ej.: APICallURLLogging=true 
	+ c.	Depura la URL de llamada de la API en caso de que haya un problema con las transacciones enviadas a tu URL. Se recomienda activarlo durante las pruebas iniciales de tu URL.

14.	ValidatorAddress (predeterminado: null)
	+ a.	Tipo string
	+ b.	Ej.: ValidatorAddress=RBcHyS2AF4Z4jgzTLZNBVLvtxQ6MtB2vUN
	+ c.	Puedes ingresar una dirección de validador (validator) predeterminada para empezar a validar de inmediato. Ten en cuenta que también debes importar la dirección de la billetera mediante los comandos de inicio. Ej.: VerifiedXCore.exe privKey=MyPrivateKey.

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

18.	AutoDownloadNFTAsset (predeterminado: true)
	+ a.	Tipo Boolean
	+ b.	Ej.: AutoDownloadNFTAsset=false
	+ c.	Controla si el recurso de un NFT se descarga automáticamente o no

19.	IgnoreIncomingNFTs (predeterminado: false)
	+ a.	Tipo Boolean
	+ b.	Ej.: IgnoreIncomingNFTs=false
	+ c.	Controla si los NFTs entrantes se procesan o solo se agregan como un registro de transacción

20.	RejectAssetExtensionTypes (predeterminado: una lista de recursos rechazados)
	+ a.	Tipo List<string>
	+ b.	Ej.: RejectAssetExtensionTypes=exe,zip,pdf... (asegúrate de que no haya espacios entre los tipos)
	+ c.	Agrega tipos de extensión a la lista ya definida y rechaza cualquier recurso de NFT con estas extensiones conocidas

21.	AllowedExtensionsTypes (predeterminado: null)
	+ a.	Tipo List<string>
	+ b.	Ej.: AllowedExtensionsTypes=pdf,doc,xls
	+ c.	Quita tipos de extensión de la lista ya definida y permite descargar cualquier recurso de NFT con estas extensiones conocidas
	
22.     MotherAddress (predeterminado: null)
	+ a. Tipo string
	+ b. Ej.: 111.222.333.444
	+ c. La dirección IP de la billetera en la que alojas MOTHER

23.     MotherPassword (predeterminado: null)
	+ a. Tipo string
	+ b. Ej.: MyPassword
	+ c. La contraseña establecida al configurar MOTHER
	
	
```
