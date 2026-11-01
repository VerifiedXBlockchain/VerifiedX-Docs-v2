---
sourceHash: 8e79e226b206
title: "Transacciones"
description: Usa la pestaña Transacciones para revisar la actividad de tus cuentas, los componentes de las transacciones y los tipos de transacción.
sidebar:
  order: 5
---

La pestaña Transacciones ofrece herramientas completas para administrar la actividad de tus cuentas:


- **Opciones de filtro**: filtra las transacciones por tipo o dirección.
- **Vista detallada**: inspecciona los detalles de las transacciones, incluidas las marcas de tiempo y las confirmaciones.
- **Integración con Spyglass**: abre las transacciones en el explorador de la red para analizarlas a fondo.

## Componentes de una transacción
- **Hash**: lo crea la billetera una vez que la TX completa está preparada. Un hash se compone de los siguientes datos, a los que se aplica SHA-256 dos veces: `Timestamp + FromAddress + ToAddress + Amount + Fee + Nonce + TransactionType + Data` (más `UnlockTime` cuando la transacción lo tiene)
- **ToAddress**: la dirección de VFX a la que se envía la transacción
- **FromAddress**: la dirección de VFX desde la que se envía la transacción.
- **Amount**: la cantidad de VFX que se envía en una transacción
- **Nonce**: el contador de transacciones de una dirección determinada. A medida que se envían transacciones, este contador aumenta en 1
- **Fee**: la comisión de red casi nula asociada a una transacción. La billetera la calcula a partir del tamaño de la transacción, y la red la quema.
- **Timestamp**: una marca de tiempo unix en segundos
- **Data**: los datos de la tx asociados cuando una transacción es algo más que una transferencia básica de VFX (por ejemplo: NFTs, ADNR, etc.). Será _null_ en una tx básica de VFX.
- **Signature**: una firma ECDSA cuyo mensaje es siempre el hash de la transacción.
- **Height**: la altura del bloque al que se asocia una TX una vez creada.
- **TransactionType**: el tipo de transacción.
- **TransactionStatus**: Pendiente, Éxito, Fallido. Las transacciones de cuentas de bóveda también pueden mostrar De bóveda, Retornado o Recuperado.

## Tipos de transacción

La billetera etiqueta cada transacción con uno de estos tipos. Algunas etiquetas agregan detalles de los datos de la transacción, como el monto y el ticker.

- **Tx**: una transferencia estándar de la moneda VFX
- **Nodo**: una transacción relacionada con un nodo
- **Emitir NFT**: un contrato inteligente se emitió como token no fungible
- **Transferir NFT**, **Evolución NFT**, **NFT Tx**: una transacción vinculada a un NFT (transferencia, evolución, etc.)
- **Quemar NFT**: una transacción que quema (destruye) un NFT
- **Inicio venta NFT**, **Venta NFT completa**, **Venta NFT**: una transacción por la venta de un NFT
- **Crear ADNR**, **Transferir ADNR**, **Eliminar ADNR**: una transacción de un dominio de VFX
- **Crear ADNR BTC**, **Transferir ADNR BTC**, **Eliminar ADNR BTC**: una transacción de un dominio BTC
- **Registro DST**: una transacción de registro de una tienda P2P (Auction House)
- **Crear tema**: una transacción de creación de un tema de votación de validadores
- **Votar tema**: una transacción de voto en un tema de votación de validadores
- **Bóveda (registro)**, **Bóveda (retorno)**, **Bóveda (recuperar)**: una transacción de una cuenta de bóveda (activación, devolución, recuperación)
- **Emitir contrato int.**: una transacción de emisión de un contrato inteligente
- **Tx contrato int.**: una transacción relacionada con un contrato inteligente (evolución)
- **Quemar contrato int.**: una transacción de quema de un contrato inteligente
- **Desplegar token**: el despliegue de un token fungible
- **Emitir token**: una emisión de un token fungible sin suministro fijo
- **Transferir token**: una transferencia de una cantidad de tokens fungibles
- **Quemar token**: una quema de una cantidad de tokens fungibles
- **Pausar token**, **Reanudar token**, **Bloquear dirección**, **Cambio dueño token**, **Tema de token creado**, **Voto de token**: una transacción de administración o votación de un token fungible (se muestra como **Tx de token** cuando no hay detalles disponibles)
- **Registrar validador vBTC**, **Latido validador vBTC**, **Salida validador vBTC**: un validador (validator) que entra, permanece o sale del conjunto de validadores de vBTC
- **Emitir contrato vBTC**: la creación de un contrato de bóveda (vault) de vBTC
- **Transferir vBTC**, **Transf. masiva vBTC**: una transferencia de vBTC, desde un contrato de bóveda o desde varios a la vez
- **Solicitud retiro vBTC**, **Retiro vBTC completo**, **Cancelar retiro vBTC**, **Votar retiro vBTC**: los pasos de un retiro de vBTC a Bitcoin
- **Aumento de comisión de retiro vBTC**: el solicitante vuelve a fijar un retiro pendiente con una tasa de comisión de Bitcoin más alta
- **Liberación de retiro vBTC**: el solicitante renuncia a un retiro pendiente; cuando Bitcoin muestra las monedas de vuelta en la bóveda, el vBTC regresa, menos esa comisión de Bitcoin
- **Fijación de retiro vBTC**: cualquier otra fijación del pago en Bitcoin de un retiro
- **Informe de Bitcoin**: encabezados de Bitcoin y las transacciones de un bloque de Bitcoin que afectan a una bóveda, registrados on-chain con firmas de validadores
- **Reorganización de Bitcoin**: Bitcoin se reorganizó por debajo de eventos ya informados, así que esos eventos se revierten y los encabezados se reemplazan
- **Cambio de clave de bóveda vBTC**: la clave de una bóveda se reemplaza por una nueva creada por los validadores actuales
- **Blindar VFX**, **Desblindar VFX**, **Transf. privada VFX**: una transacción privada de VFX
- **Bloqueo puente vBTC**, **Desbloqueo puente vBTC**, **Desbloqueo del pool del puente vBTC**, **Salida del puente vBTC a BTC**, **Salida del puente vBTC a BTC completada**, **Salida del puente vBTC a BTC fallida**: una transacción de vBTC para el puente a Base (vBTC.b)
