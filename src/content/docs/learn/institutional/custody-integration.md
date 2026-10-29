---
title: "Custody Integration"
description: How institutional custodians, digital asset banks, and infrastructure providers integrate with VerifiedX to support vBTC.
sidebar:
  order: 2
---

**Secure, Verifiable Bitcoin Infrastructure for Institutional Partners**

VerifiedX provides a custody integration framework that enables institutions to securely support native, non-synthetic Bitcoin (vBTC) while maintaining full control, auditability, and compliance.

The system is designed to integrate with institutional custody providers, digital asset banks, and infrastructure platforms — allowing Bitcoin to become fully programmable without introducing synthetic risk or compromising ownership.

This is not a wrapper.
This is verifiable Bitcoin infrastructure.

---

## Integration Model

VerifiedX custody integration operates through a coordinated system of:

- FROST threshold signing, with each vault's key held only in shares
- Bitcoin-aware consensus that verifies every vault deposit and spend
- Deterministic deposit and redemption workflows, with withdrawals fixed by consensus
- 1:1 vBTC issuance and burn mechanics

Custodians maintain control of underlying Bitcoin, while VerifiedX enables programmable utility on-chain.

---

## Core Capabilities

### Native Bitcoin Support

- Direct integration with Bitcoin custody systems
- No wrapping into synthetic assets or IOUs
- Strict 1:1 asset backing at all times
- Transparent, verifiable reserve tracking

### Deterministic Mint & Redemption

- Bitcoin deposit → consensus-verified and buried 6 blocks → vBTC credited
- vBTC withdrawal request → consensus-fixed Bitcoin transaction → Bitcoin release
- Fully auditable lifecycle for every asset movement
- No discretionary or opaque processes

### Proof-of-Reserves & Movement

- Every vault deposit and spend recorded by consensus from Bitcoin's own proof-of-work and Merkle proofs
- Independent verification of reserves and flows
- Real-time visibility into system integrity
- Cryptographic guarantees across all transactions

### Self-Custody Preservation

- End users and institutions retain asset ownership
- Custodians act as secure infrastructure providers — not asset intermediaries
- No rehypothecation or balance sheet risk introduced

### Compliance-Ready Architecture

- Integration with AML and transaction monitoring systems
- Address screening and policy enforcement capabilities
- Support for jurisdictional compliance requirements
- Full audit trail across all custody and settlement activity

---

## Integration Pathways

VerifiedX supports multiple institutional integration models:

### Custodian Integration

- Direct connection to custody infrastructure
- Participation in deposit and redemption flows
- Support for institutional client accounts

### Digital Asset Banks

- Treasury management and asset servicing
- Client-facing vBTC enablement
- Yield and liquidity program participation

### Infrastructure Providers

- API-based integration for custody orchestration
- Validator or service provider participation
- Embedded support within institutional platforms

### Allocator-Operated Signing

- Run three or more of your own validators and restrict a vault's key ceremony and signing to them (S3C)
- The public validator set never holds a share of those vaults' keys
- See [Institutional Signing (S3C)](/learn/institutional/s3c-signing/)

---

## Security Model

- FROST threshold signing with distributed key generation; optionally restricted to allocator-operated validators (S3C)
- Bitcoin deposits and spends verified at the consensus layer
- Multi-layer audit coverage across custody and protocol layers
- Deterministic transaction validation and execution
- Validator consensus thresholds for critical operations

---

## Institutional Benefits

- Enable Bitcoin programmability without synthetic exposure
- Maintain full custody control and operational oversight
- Offer new revenue streams through yield and liquidity services
- Provide clients with transparent, on-chain financial capabilities
- Integrate seamlessly into existing custody and compliance frameworks

---

VerifiedX custody integration allows institutions to extend Bitcoin from passive storage into active financial infrastructure — securely, transparently, and without compromise.

Custody is no longer just storage. With VerifiedX, it becomes the foundation for programmable Bitcoin finance.
