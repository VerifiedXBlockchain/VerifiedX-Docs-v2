---
title: "VFX Address Creation"
description: "How a VFX address is derived from an ECDSA private key, step by step."
sidebar:
  order: 3
---

## Summary:

The purpose of this document is to teach you how a VFX address is
created. This will walk you through from the starting step to the very
end which is a human readable address.

## How to create a VFX Address

**The correct way to create a VFX address is to use well tested, opensource, peer reviewed wallet software.** Handling keys manually can and has resulted in fund loss over and over again. Unlike other centralized systems, losses in VFX are usually unrecoverable. Please proceed at your own risk.

Here is a brief overview of how address generation works, for
informational purposes:

- Having a private ECDSA key

  `18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725`

1.  Take the corresponding uncompressed public key and add the '04' hex
    identifier. VFX keys use the secp256k1 curve, and the public key is
    created from Ecdsa multiplication of
    `(curve.G, secret, curve.N, curve.A, curve.P)`. In code it appears as
    this:

    ```csharp
    multiply(Point p, BigInteger n, BigInteger N, BigInteger A, BigInteger P)
    ```

    Scalar multiplication of an elliptic curve point:

    - param p: Point on the curve to multiply

    - param n: Scalar multiplier

    - param N: Order of the elliptic curve

    - param A: Coefficient of the first-order term of the equation `Y^2 = X^3 + A*X + B (mod p)`

    - param P: Prime number in the modulus of the equation `Y^2 = X^3 + A*X + B (mod p)`

    - return: **The resulting point n·p**

    This can be seen in code under `VerifiedXCore/EllipticCurve/Math.cs`

    > Please note many ECDSA libraries out there handle public keys this
    > way, so you may not have to do the above jacobian math.

    ```text
    [04 added]50863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b23522cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6 =
    0450863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b23522cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6
    ```

1.  Perform SHA-256 hashing on the public key from step 1.

    `600ffe422b4e00731a59557a5cca46cc183944191006324a447bdb2d98d4b408`

1.  Perform RIPEMD-160 hashing on the result of SHA-256 from step 2.

    `010966776006953d5567439e5e39f86a0d273bee`

1.  Add version byte in front of RIPEMD-160 hash from step 3 (0x3C for
    mainnet, which gives addresses starting with `R`; 0x89 for testnet,
    which gives addresses starting with `x`).

    `3c010966776006953d5567439e5e39f86a0d273bee`

    > _(note that below steps are the Base58Check encoding, which has multiple
    > library options available implementing it)_

1.  Perform SHA-256 hash on the extended RIPEMD-160 result from step 4.

    `24295fdd7e8c04bbc84f1e5151b4afa3380f900a5da58533a647c36fdc2d4cfd`

1.  Perform SHA-256 hash on the result of the previous SHA-256 hash from
    step 5.

    `3699e7d4f297550311c32721b57c801f873d07ef5a886cbd07146f478178b362`

1.  Take the first 4 bytes of the second SHA-256 hash. This is the
    address checksum from step 6.

    `3699e7d4`

1.  Add the 4 checksum bytes from stage 7 at the end of extended
    RIPEMD-160 hash from stage 4. This is the 25-byte binary VFX Address.

    `3c010966776006953d5567439e5e39f86a0d273bee3699e7d4`

1.  Convert the result from a byte string into a base58 string using
    Base58Check encoding from step 8.

    `R9Ng1rDS2YgB7R2bJMU3RKzVXSriXLRsBR`

    With the testnet version byte 0x89, the same key gives
    `x8Q7qDAchSMe5nmGBf7akyx4zHhMMLp9gD`. A node refuses an address that
    carries the other network's version byte as a recipient.
