---
sourceHash: c6c87bd45e97
title: "SDK de JavaScript"
description: Descripción general del VerifiedX Web SDK, una interfaz unificada para la blockchain de VerifiedX y la red de Bitcoin, con instalación, uso básico y un mapa de las guías.
sidebar:
  label: Descripción general
  order: 0
---

Te damos la bienvenida a la documentación del VerifiedX Web SDK. Este SDK ofrece una interfaz unificada para interactuar tanto con la blockchain de VerifiedX como con la red de Bitcoin, lo que permite crear potentes aplicaciones multicadena.

## Descripción general del SDK

El VerifiedX Web SDK está diseñado pensando en la simplicidad y la potencia:

```typescript
import { VfxClient, btc, Network } from 'vfx-web-sdk';

// VerifiedX operations
const vfxClient = new VfxClient(Network.Testnet);

// Bitcoin operations
const btcClient = new btc.BtcClient('testnet');
```

## Funciones clave

### Compatibilidad con dos blockchains
- **Operaciones nativas de VFX**: compatibilidad completa con las transacciones de la blockchain de VerifiedX, la gestión de dominios y las operaciones con direcciones
- **Integración con Bitcoin**: funcionalidad completa de Bitcoin, incluida la gestión de billeteras, las transacciones y la interacción con la mempool
- **Compatibilidad multicadena**: integración fluida entre las operaciones de VFX y las de Bitcoin

### Emisión y custodia
- **Tokens fungibles (VFX20)**: despliega, emite, transfiere, quema, pausa, bloquea y vota
- **Firma externa**: firma cada transacción con una clave de HSM, KMS o MPC que el SDK nunca ve
- **Cuentas de reserva**: envíos de bóveda (vault) con retraso que se pueden devolver, con recuperación de claves

### Experiencia de desarrollo
- **TypeScript primero**: seguridad de tipos completa con definiciones exhaustivas
- **Compatibilidad universal**: funciona en Node.js, navegadores y empaquetadores modernos
- **Varios destinos de compilación**: CommonJS, ES Modules y paquetes listos para el navegador
- **API coherente**: patrones similares en las operaciones de VFX y de Bitcoin


## Inicio rápido

### Instalación

```bash
npm install vfx-web-sdk
```

### Uso básico

```typescript
import { VfxClient, btc, Network } from 'vfx-web-sdk';

function quickStart() {
  // Initialize clients
  const vfxClient = new VfxClient(Network.Testnet);
  const btcClient = new btc.BtcClient('testnet');

  // Generate VFX wallet
  const vfxPrivateKey = vfxClient.generatePrivateKey();
  const vfxAddress = vfxClient.addressFromPrivate(vfxPrivateKey);

  // Generate Bitcoin wallet
  const btcKeypair = btcClient.generatePrivateKey();

  console.log('VFX Address:', vfxAddress);
  console.log('BTC Address:', btcKeypair.address);
}
```

## Estructura de la documentación

Esta documentación se organiza en varias secciones:

### Primeros pasos
- [Conceptos básicos de VFX](/es/build/sdk/vfx-basics/): aprende los fundamentos de VerifiedX
- [Conceptos básicos de Bitcoin](/es/build/sdk/bitcoin-basics/): operaciones de Bitcoin con el SDK
- [Guía multicadena](/es/build/sdk/cross-chain/): crea aplicaciones multicadena
- [Tokens fungibles](/es/build/sdk/fungible-tokens/): emite y administra tokens VFX20
- [Firma externa](/es/build/sdk/external-signing/): claves de HSM, KMS y MPC
- [Cuentas de reserva](/es/build/sdk/reserve-accounts/): bóvedas con retraso y recuperables

### Referencia de la API
- [API de VfxClient](/es/build/sdk/reference/vfx-client/): documentación completa del cliente de VFX
- [API de BtcClient](/es/build/sdk/reference/btc-client/): documentación completa del cliente de Bitcoin
- [Tipos e interfaces](/es/build/sdk/reference/types/): definiciones de TypeScript


### Ejemplos
- [Fragmentos de código](/es/build/sdk/examples/snippets/)

## Comunidad y soporte

- **GitHub**: [repositorio de VerifiedX WebSDK](https://github.com/VerifiedXBlockchain/VerifiedX-WebSdk)
- **Issues**: reporta errores y solicita funciones
- **Discusiones**: únete a las discusiones de la comunidad

## Próximos pasos

¿Listo para empezar a construir? Elige tu camino:

1. **¿Eres nuevo en VerifiedX?** Empieza con los [conceptos básicos de VFX](/es/build/sdk/vfx-basics/)
2. **¿Desarrollas con Bitcoin?** Ve directo a los [conceptos básicos de Bitcoin](/es/build/sdk/bitcoin-basics/)
3. **¿Creas apps multicadena?** Explora la [guía multicadena](/es/build/sdk/cross-chain/)
4. **¿Vas a emitir un token?** Lee [Tokens fungibles](/es/build/sdk/fungible-tokens/) y [Firma externa](/es/build/sdk/external-signing/)
4. **¿Necesitas ejemplos?** Explora las [aplicaciones completas](/es/build/sdk/examples/applications/)

¡Construyamos juntos el futuro de las aplicaciones multicadena!
