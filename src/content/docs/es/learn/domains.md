---
sourceHash: 377e93adaf35
title: "Servicios de dominio de VFX"
description: Los servicios de dominio de VFX (ADNR), que asocian direcciones de Bitcoin y de VFX con nombres legibles .btc y .vfx.
sidebar:
  order: 13
---

La plataforma VerifiedX (VFX) incluye un servicio único llamado **servicios de dominio de VFX** (VFX Domain Services) o **ADNR**, que simplifica el manejo de las direcciones públicas de blockchain tanto en la red Bitcoin (BTC) como en la red VFX (VerifiedX). Este servicio permite a los usuarios convertir direcciones públicas complejas y difíciles de leer en nombres de dominio fáciles de recordar y de usar, como `easyaddress.btc` o `someverified.vfx`.

## Resumen de los servicios de dominio de VFX

Los servicios de dominio de VFX ofrecen una forma práctica de crear un alias personalizado y legible para las direcciones públicas en las blockchains de Bitcoin y de VFX. El servicio se basa en el concepto de **resolución de nombres de direcciones (Address Name Resolution, ADNR)**, que vincula nombres legibles por personas con las direcciones de blockchain tradicionales.

### Funciones clave

- **Asociación de dirección a dominio**: 
  - Los usuarios pueden asociar una dirección pública difícil de leer, como `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`, con un dominio más legible y con identidad de marca, como `mybitcoin.btc` o `john.vfx`.
  - Esta asociación simplifica compartir direcciones para recibir fondos o NFTs.

- **Compatibilidad con varias blockchains**: 
  - El servicio admite las blockchains de **Bitcoin** y de **VerifiedX**, lo que permite a los usuarios crear alias para direcciones en cualquiera de las dos redes.
  - Formatos de ejemplo: `easyaddress.btc` para direcciones de Bitcoin y `simple.vfx` para direcciones de VerifiedX.

- **Dominios personalizables**: 
  - Los usuarios pueden crear dominios únicos y personalizados que se ajusten a sus necesidades personales o de negocio.
  - Los dominios se pueden vincular a identidades, lo que facilita reconocer al destinatario de una transacción.

### Cómo funciona

El núcleo de los servicios de dominio de VFX es el **modelo ADNR (Address Name Resolution)**, que almacena las asociaciones entre las direcciones públicas y los nombres legibles por personas. El modelo ADNR está definido en el archivo `Adnr.cs` dentro del proyecto VerifiedX-Core.

#### Modelo ADNR (`Adnr.cs`)
El modelo ADNR se encarga de la creación, la gestión y la resolución de los nombres de dominio legibles por personas a sus direcciones de blockchain correspondientes.

Las propiedades clave del modelo ADNR incluyen:
- **Id**: un identificador único para cada entrada ADNR.
- **Address**: la dirección pública de blockchain (de VFX o de BTC) que se asocia con el nombre legible.
- **Name**: el alias legible por personas (por ejemplo, `myaddress.vfx` o `example.btc`).
- **DateCreated**: la marca de tiempo del momento en que se creó la asociación.
- **Signature**: una firma digital que garantiza la autenticidad de la entrada ADNR.

#### Métodos clave
- **CreateAdnr()**: este método permite a los usuarios crear una nueva entrada ADNR que vincula una dirección pública de blockchain con un nombre de dominio personalizado.
- **ResolveAdnr()**: este método resuelve el dominio legible de vuelta a su dirección de blockchain original, lo que permite buscar direcciones sin complicaciones durante las transacciones.
- **DeleteAdnr()**: los usuarios también pueden eliminar entradas ADNR si ya no quieren un dominio asociado a una dirección determinada.

#### Reglas de nombres (Core 9.0.1)

A partir de la altura de reglas del libro mayor de Core 9.0.1 (bloque 7,575,250 en mainnet, bloque 7,400 en testnet), un nuevo nombre `.vfx` se compone de letras minúsculas, dígitos y `-`, tiene de 1 a 65 caracteres y se envía sin sufijo. No se puede tomar una etiqueta cuyo nombre `.rbx` heredado exista. Una dirección de Bitcoin tiene como máximo un nombre `.btc`, y una eliminación o transferencia actúa solo sobre el propio registro del remitente en esa dirección.

#### Crear un nombre `.btc`

A partir de la altura del firmante de nombres BTC (`BtcNameSignerOwnsAddressHeight`: bloque 7,575,250 en mainnet, bloque 7,400 en testnet), un nombre `.btc` se crea con una firma de la clave de la dirección de Bitcoin a la que apunta. El mensaje firmado es `<unix seconds>:<VFX owner>:<name>.btc`, así que la firma sirve solo para ese dueño y ese nombre, y es válida durante 30 minutos. El nombre en sí se envía sin `.btc`. Cuando la clave de Bitcoin está en la billetera, `CreateAdnr` firma el mensaje por sí mismo. Antes de esa altura, el mensaje es solo una marca de tiempo.

#### Transferir un nombre `.btc`

A partir de la misma altura, la dirección de Bitcoin que recibe tiene que aceptar la transferencia de un nombre `.btc`. El receptor firma una aceptación, el mensaje `<unix seconds>:<new VFX owner>:<name>.btc` firmado con la clave de la dirección de Bitcoin que recibirá el nombre, y el remitente la incluye en la transferencia. Una aceptación es válida durante 24 horas.

Cuando ambas direcciones de Bitcoin están en la misma billetera, el nodo firma la aceptación por sí mismo. Entre billeteras, el receptor la crea con `SignAdnrTransferAcceptance` y se la entrega al remitente, que la pasa a `TransferAdnr` (consulta la [referencia de la API del CLI](/es/build/node-api/details/#gestión-de-adnr)). En la billetera SwitchBlade, el receptor la copia como un solo código de aceptación, `<message>|<signature>`, y el remitente lo pega en la transferencia.

### Beneficios de los servicios de dominio de VFX

1. **Transacciones fáciles de usar**: 
   - En lugar de compartir direcciones largas y complejas, los usuarios pueden compartir nombres de dominio fáciles de recordar.
   - Esto reduce la probabilidad de errores al ingresar o compartir direcciones.

2. **Mayor confianza y reconocimiento**: 
   - Los nombres de dominio se pueden vincular a identidades personales o de negocio, lo que facilita confiar en el destinatario de una transacción.
   - Un dominio reconocible, como `mycompany.vfx`, inspira más confianza que una cadena desconocida de caracteres alfanuméricos.

3. **Flexibilidad entre blockchains**: 
   - Los usuarios pueden crear dominios tanto para direcciones de Bitcoin como de VFX, lo que hace que el servicio sea muy versátil.
   - Esto abre la posibilidad de usar el mismo nombre para direcciones de Bitcoin y de VFX (por ejemplo, `john.btc` y `john.vfx`).

## Casos de uso

- **Transacciones personales**: 
  - Los usuarios pueden crear dominios personalizados que representen sus direcciones personales para transacciones de Bitcoin y de VFX. Por ejemplo, en lugar de compartir una dirección de Bitcoin larga, podrías compartir `mike.btc`.

- **Transacciones de negocios y comercios**: 
  - Los negocios pueden registrar su marca o el nombre de su empresa como dominio para facilitar el cobro de pagos. Por ejemplo, una cafetería podría usar `coffeeco.vfx` como su dirección de VerifiedX para recibir pagos.

- **Transacciones de NFTs**: 
  - Los servicios de dominio de VFX pueden ser especialmente útiles en el ámbito de los NFTs, donde los nombres de dominio pueden representar al dueño o al creador de un NFT determinado, lo que facilita verificar su propiedad.

## Conclusión

Los servicios de dominio de VFX ofrecen una solución potente y fácil de usar para simplificar el intercambio y la gestión de direcciones de blockchain. Con la posibilidad de crear nombres de dominio personalizados para direcciones de Bitcoin y de VFX, los usuarios disfrutan de una experiencia de transacción más intuitiva y confiable.

Para más detalles técnicos y de implementación, puedes consultar el **modelo ADNR** y las clases relacionadas en el [repositorio de VerifiedX-Core en GitHub](https://github.com/VerifiedXBlockchain/VerifiedX-Core/blob/testnet/ReserveBlockCore/Models/Adnr.cs).
