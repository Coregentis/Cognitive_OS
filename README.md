# Cognitive_OS

## Repository Identity

`Cognitive_OS` is the neutral Coregentis mother-runtime foundation repository.

Its role is to hold the governed implementation foundation for Coregentis as a runtime and governance substrate, not as an application or product surface.

## What Belongs Here

This repository is the home for the mother-runtime foundation layers:

- `governance/`
- `imports/`
- `schemas/`
- `registry/`
- `bindings/`
- `runtime/`
- `tests/`

These surfaces together define the active `v0.1` foundation baseline stream.

## Current Runtime Surface Status

Cognitive_OS is no longer documentation-only. It now has a governed neutral
runtime/projection foundation that remains below product implementation and
below a full platform release claim.

Current architecture stack:

1. `schemas/`, `registry/`, and `bindings/` preserve Cognitive_OS object,
   relationship, export, MPLP object/semantic binding, and Kernel Duty binding
   posture.
2. `runtime/core/` provides the neutral runtime core services and runtime
   object types.
3. `runtime/core/mplp-module-posture.ts` and
   `runtime/core/kernel-duty-runtime-posture.ts` define neutral MPLP module and
   Kernel Duty posture contracts.
4. `runtime/core/projection-safe-*.ts` files implement the Projection layer as
   a safety envelope and downstream adapter boundary. There is no separate
   top-level `projection/` directory; projection-safe behavior lives in
   runtime/core contracts, builders, helpers, fixtures, and handoff governance.
5. `runtime/fixtures/projection-safe-downstream-handoff-fixture.ts`,
   `governance/handoffs/`, and `handoffs/` define downstream-neutral product
   projection consumption posture.

Current hardening status:

- Strict module/duty/projection E2E tests now cover representative runtime
  object records through binding service, module posture, Kernel Duty posture,
  projection-safe envelopes, evidence refs, omission markers, version refs,
  state/snapshot posture, transaction/export posture, error/insufficiency
  posture, and downstream handoff.
- These tests prove upstream projection-safe consumption readiness for the
  current baseline. They do not claim full production implementation of every
  MPLP module or Kernel Duty.
- SoloCrew V2.2 remains paused until owner authorization starts product
  implementation against the accepted handoff.
- No MPLP schema or protocol change is included.
- No provider dispatch, channel dispatch, marketplace implementation,
  autonomous execution, product paid-readiness claim, MPLP certification, or
  MPLP endorsement is included.

Active current governance references:

- `[CGOS-CURRENT-ARCHITECTURE-BASELINE-v0.1.md](/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS/governance/baselines/CGOS-CURRENT-ARCHITECTURE-BASELINE-v0.1.md)`
- `[CGOS-ARCHITECTURE-CONSISTENCY-LAYERING-PROJECTION-E2E-AUDIT-v0.1.md](/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS/governance/audits/CGOS-ARCHITECTURE-CONSISTENCY-LAYERING-PROJECTION-E2E-AUDIT-v0.1.md)`
- `[CGOS-KERNEL-DUTY-BINDING-BASELINE-v0.1.md](/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS/governance/baselines/CGOS-KERNEL-DUTY-BINDING-BASELINE-v0.1.md)`
- `[CGOS-SOLOCREW-V2.2-CONSUMPTION-HANDOFF-v0.1.md](/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS/governance/handoffs/CGOS-SOLOCREW-V2.2-CONSUMPTION-HANDOFF-v0.1.md)`

## What Does Not Belong Here

This repository is not the place for product-specific or application-specific implementation.

Out of scope by default:

- product repositories
- projection repositories
- TracePilot implementation
- PublishPilot implementation
- GrowthPilot implementation
- future Pilot-branded application repositories
- product UI surfaces
- product DTOs
- application-specific workflow surfaces

Application-specific projection and product development must live in separate repositories.

## Authority Order

This repository preserves the following order:

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections`

This means:

- MPLP remains the upstream protocol constitution
- `Cognitive_OS` remains the mother-runtime foundation layer
- product projections remain downstream and must consume Cognitive_OS posture
  instead of redefining protocol or runtime law

## Repository Neutrality

This repository is intentionally neutral with respect to any specific product repo.

It may retain generic product-projection theory where that theory is application-neutral and necessary to preserve the Coregentis architecture boundary.
It must not expose product-specific implementation surfaces as repository authority.

## Public Visibility Caution

Public visibility of a repository does not by itself define:

- product scope
- open-source grant scope
- commercial boundary

This repository should therefore be read as a public mother-runtime foundation surface, not as a product repository.
