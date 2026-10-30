---
sourceHash: 2c2c201d61c7
title: "Transacciones"
description: Usa la pestaña Transacciones para revisar la actividad de tus cuentas, los componentes de las transacciones y los tipos de transacción.
sidebar:
  order: 5
---

La pestaña Transacciones ofrece herramientas completas para administrar la actividad de tus cuentas:


- **Opciones de filtro**: ordena las transacciones por tipo, dirección o estado.
- **Vista detallada**: inspecciona los detalles de las transacciones, incluidas las marcas de tiempo y las confirmaciones.
- **Integración con Spyglass**: abre las transacciones en el explorador de la red para analizarlas a fondo.

## Componentes de una transacción
- **Hash**: lo crea la billetera una vez que la TX completa está preparada. Un hash se compone de los siguientes datos: `Timestamp + FromAddress + ToAddress + Amount + Fee + Nonce + TransactionType + Data`
- **ToAddress**: la dirección de VFX a la que se envía la transacción
- **FromAddress**: la dirección de VFX desde la que se envía la transacción.
- **Amount**: la cantidad de VFX que se envía en una transacción
- **Nonce**: el contador de transacciones de una dirección determinada. A medida que se envían transacciones, este contador aumenta en 1
- **Fee**: la comisión atómica casi nula asociada a una transacción, que la billetera calcula.
- **Timestamp**: una marca de tiempo unix en segundos
- **Data**: los datos de la tx asociados cuando una transacción es algo más que una transferencia básica de VFX (por ejemplo: NFTs, ADNR, etc.). Será _null_ en una tx básica de VFX.
- **Signature**: una firma ECDSA cuyo mensaje es siempre el hash de la transacción.
- **Height**: la altura del bloque al que se asocia una TX una vez creada.
- **TransactionType**: el tipo de transacción.
- **TransactionStatus**: Pendiente, Éxito, Fallido

## Tipos de transacción

- **TX**: una transferencia estándar de la moneda VFX
- **Emitir NFT**: un contrato inteligente se emitió como token no fungible
- **NFT Tx**: una transacción vinculada a un NFT (transferencia, evolución, etc.)
- **Quemar NFT**: una transacción que quema (destruye) un NFT
- **Venta NFT**: una transacción por la venta de un NFT
- **ADNR**: una transacción relacionada con dominios
- **Registro DST**: una transacción de registro de una tienda p2p
- **Crear tema**: una transacción de creación de un tema de votación de validación
- **Votar tema**: una transacción de voto en un tema de votación de validadores
- **TX de bóveda (Vault TX)**: una transacción relacionada con una bóveda (vault) (activación, devolución, recuperación, etc.)
- **Emitir contrato int.**: una transacción de emisión de un contrato inteligente
- **Tx contrato int.**: una transacción relacionada con un contrato inteligente (evolución)
- **Quemar contrato int.**: una transacción de quema de un contrato inteligente
- **Emitir token**: una emisión de un token fungible sin suministro fijo
- **Tx de token**: una transacción relacionada con un token fungible (transferencia, voto, etc.)
- **Quemar token**: una transferencia de una cantidad de tokens fungibles.
- **Tokenización: emitir**: la creación de un token vBTC
- **Tokenización: tx**: una transacción relacionada con un token vBTC (por ejemplo, transferir fondos)
- **Tokenización: retiro (Tokenization Withdrawl)**: una transacción de retiro de vBTC
