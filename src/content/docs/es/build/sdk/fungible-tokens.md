---
sourceHash: 298e6f3a29f9
title: "Tokens fungibles: emite y administra tokens VFX20"
description: Despliega un token VFX20 con el VerifiedX Web SDK, emite y transfiere el suministro, y usa los controles del propietario para pausar, bloquear, transferir la propiedad y abrir votaciones de los tenedores.
sidebar:
  label: Tokens fungibles
  order: 3
---

Esta guía recorre la vida completa de un token fungible (VFX20) con el VerifiedX Web SDK: el despliegue del contrato, la emisión del suministro, su movimiento entre tenedores y los controles del propietario (pausa, bloqueo, transferencia de la propiedad, votaciones de los tenedores).

## Requisitos previos

- `vfx-web-sdk` 3.4.0 o posterior
- Una dirección de VFX con fondos. Las operaciones con tokens pagan solo la comisión normal de la red en VFX (unas milésimas de VFX cada una); no hay ningún cargo de despliegue aparte de eso.
- Te recomendamos usar testnet mientras aprendes: un bloqueo no se puede deshacer y un token no se puede eliminar.

## Cómo funcionan los tokens en VerifiedX

Un token VFX20 es un contrato inteligente que despliega su propietario. Su identificador, el `scIdentifier` (por ejemplo `9dbadf6ca06b4b75ac8594ca4de52cba:1791216037`), es a lo que se dirige cada llamada posterior.

- **El propietario** despliega, emite (si el token es emitible), pausa, bloquea, transfiere la propiedad y abre votaciones.
- **Los tenedores** transfieren, queman su propio saldo (si el token es quemable) y votan.
- **El suministro** es fijo desde el despliegue o emitible. Un token emitible empieza en cero y el propietario emite lo que haga falta.
- La validación ocurre on-chain. Spyglass, el explorador de VerifiedX, indexa el resultado, y el SDK lee de ahí el estado del token.

## Paso 1: configura un cliente y un par de claves

```typescript
import { VfxClient, Network } from 'vfx-web-sdk';

const client = new VfxClient(Network.Testnet);

const privateKey = process.env.VFX_PRIVATE_KEY!;
const owner = {
  privateKey,
  publicKey: client.publicFromPrivate(privateKey),
  address: client.addressFromPrivate(privateKey),
};
```

Cada método de abajo también acepta un `Signer` en lugar del par de claves, así que la clave puede estar en un HSM o en un servicio de MPC. Consulta [Firma externa](/es/build/sdk/external-signing/).

## Paso 2: despliega el token

```typescript
const deployed = await client.deployToken(owner, {
  name: 'Acme Fund',
  ticker: 'ACME',         // up to 20 characters, stored upper-case
  decimalPlaces: 2,       // 1–18, default 8
  mintable: true,
  burnable: true,
  // initialSupply: 1_000_000,  // whole tokens, for a fixed-supply token (must be 0 when mintable)
  // voting: true,              // enables holder votes
  // image: { url: 'https://example.com/acme.png' }, // optional, must be publicly fetchable
});

if (!deployed) throw new Error('Deploy was rejected before reaching the node');
const { scIdentifier, transactionHash } = deployed;
```

El `scIdentifier` se devuelve en cuanto el contrato compila, antes de que se confirme la transacción. Guárdalo: es el identificador permanente del token.

Sin una `image`, la red asigna una imagen de token predeterminada.

## Paso 3: espera la confirmación

Los métodos que modifican el estado devuelven el hash de la transacción en cuanto el nodo la acepta. Los bloques llegan más o menos cada 10 segundos y Spyglass los indexa poco después. Antes de actuar sobre un resultado, confírmalo leyendo el estado:

```typescript
async function waitForToken(scIdentifier: string) {
  for (let i = 0; i < 30; i++) {
    try {
      const { token } = await client.getFungibleToken(scIdentifier);
      return token;
    } catch {
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  throw new Error(`Token ${scIdentifier} not indexed yet`);
}

const token = await waitForToken(scIdentifier);
console.log(token.owner_address, token.can_mint, token.is_paused);
```

Lo mismo aplica entre pasos que dependen uno del otro: emite, espera hasta que aparezca el saldo y luego transfiere.

## Paso 4: emite, transfiere y quema

```typescript
// Owner only, token must be mintable. Tokens are credited to the signer.
await client.mintToken(owner, { scIdentifier, amount: 10 });

// Any holder.
await client.transferToken(owner, { scIdentifier, toAddress: 'xRecipient...', amount: 3 });

// Any holder, from their own balance. Token must be burnable; there is no issuer-side burn.
await client.burnToken(owner, { scIdentifier, amount: 2 });
```

Cada transacción lleva el ticker y el nombre del token para los indexadores y las billeteras. Pasa `ticker` y `name` para omitir la consulta a Spyglass que el SDK hace de lo contrario:

```typescript
await client.transferToken(owner, { scIdentifier, toAddress, amount: 1, ticker: 'ACME', name: 'Acme Fund' });
```

## Paso 5: consulta saldos y tenedores

```typescript
// Every token an address holds
const balances = await client.getFungibleTokenBalances(owner.address);
// [{ token: { sc_identifier, ticker, ... }, balance: 5 }]

// One token, with its holder map
const { token, holders } = await client.getFungibleToken(scIdentifier);
// holders: { 'xOwner...': 5, 'xRecipient...': 3 }

// Browse all tokens
const page = await client.listFungibleTokens(1, 25);
```

## Paso 6: controles del propietario

### Pausa y reanuda

```typescript
await client.toggleTokenPause(owner, { scIdentifier }); // active -> paused
// ...later
await client.toggleTokenPause(owner, { scIdentifier }); // paused -> active
```

La pausa es un **interruptor**: la red invierte el estado actual. Envíala una vez por cada cambio que quieras hacer y confirma `is_paused` antes de enviarla de nuevo, porque un segundo cambio deshace el primero. El SDK lee el estado actual antes de enviar, así que la transacción se etiqueta con el estado que produce (que muestran los exploradores y las billeteras).

### Bloquea una dirección

```typescript
await client.banTokenAddress(owner, { scIdentifier, address: 'xBadActor...' });
```

Una dirección bloqueada ya no puede enviar el token, pero todavía puede recibirlo. **La red no tiene forma de levantar un bloqueo**, así que trátalo como permanente.

### Transfiere la propiedad

```typescript
await client.transferTokenOwnership(owner, { scIdentifier, toAddress: 'xNewOwner...' });
```

## Paso 7: votaciones de los tenedores

En los tokens desplegados con `voting: true`, el propietario abre un tema y los tenedores votan:

```typescript
await client.createTokenVoteTopic(owner, {
  scIdentifier,
  name: 'Distribute Q3',
  description: 'Pay out the Q3 distribution',
  votingDays: 7,
  minimumVoteRequirement: 51,
});

const topics = await client.listTokenVotingTopics(scIdentifier);
await client.castTokenVote(holder, { scIdentifier, topicUid: topics.results[0].topic_id, vote: true });
```

## Ejecuciones de prueba

Un cliente creado con `dryRun` construye, firma y hace que el nodo verifique cada transacción, y luego se detiene antes de enviarla. Es una forma segura de revisar los parámetros en mainnet:

```typescript
const dry = new VfxClient(Network.Mainnet, true);
const check = await dry.deployToken(owner, { name: 'Acme Fund', ticker: 'ACME', initialSupply: 1_000_000 });
// check.scIdentifier and check.transactionHash are returned; nothing is broadcast
```

## Cuentas de reserva y tokens

Los métodos de tokens se pueden firmar desde una cuenta de reserva (bóveda, vault) y aceptan `unlockHours`. Ten en cuenta que una transferencia de tokens desde una bóveda lleva la hora de desbloqueo que exige la red, pero **se liquida de inmediato**: una bóveda protege VFX, vBTC y NFTs, no los tokens fungibles. Desplegar un token desde una bóveda se rechaza. Consulta [Cuentas de reserva](/es/build/sdk/reserve-accounts/).

## Problemas comunes

### `A non-mintable token with initialSupply 0 could never have any supply`
Configura `mintable: true` o dale un `initialSupply` a un token de suministro fijo.

### La emisión o la transferencia se rechaza justo después del despliegue
El despliegue todavía no se confirma. Espera hasta que `getFungibleToken` devuelva el token.

### Se rechaza la transferencia de un tenedor
Puede que el token esté pausado o que el remitente esté bloqueado. Revisa `is_paused` y `banned_addresses` en `getFungibleToken`.

## ¿Qué sigue?

- [Firma externa](/es/build/sdk/external-signing/): guarda la clave del emisor en un HSM o en un servicio de MPC
- [Cuentas de reserva](/es/build/sdk/reserve-accounts/): cuentas de tesorería con retraso y recuperables
- [Referencia de la API de VfxClient](/es/build/sdk/reference/vfx-client/): cada método de tokens y sus parámetros
