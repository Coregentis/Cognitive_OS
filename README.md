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

Cognitive_OS currently includes a projection-safe, non-executing projection
revision runtime surface with evidence insufficiency support.

This surface is release-gated as a runtime capability surface, but it is not
an independent Cognitive_OS V1.2 release. Cognitive_OS version assignment
remains pending a separate versioning decision.
The selected line is the projection-revision-runtime RC capability line, not a
full Cognitive_OS platform release.

Current status:

- Runtime surface implemented and hardened.
- Runtime tests passing.
- Downstream evidence reviewed through neutral, projection-safe boundaries.
- Release-readiness gate complete.
- Independent versioning decision complete.
- Projection-revision-runtime RC tag/release/seal executed.
- Durable lifecycle continuity dependency planning open.
- No schema change.
- No MPLP protocol law change.
- No downstream product dependency.
- No provider/channel execution.
- No approve/reject/dispatch/execute.
- No queue implementation.

Active governance references:

- `[CGOS-PROJECTION-REVISION-RUNTIME-RELEASE-GATE-v0.1.md](/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS/governance/gates/CGOS-PROJECTION-REVISION-RUNTIME-RELEASE-GATE-v0.1.md)`
- `[CGOS-PROJECTION-REVISION-RUNTIME-RELEASE-SCOPE-AND-BOUNDARY-v0.1.md](/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS/governance/releases/CGOS-PROJECTION-REVISION-RUNTIME-RELEASE-SCOPE-AND-BOUNDARY-v0.1.md)`
- `[CGOS-PROJECTION-REVISION-RUNTIME-RELEASE-PLANNING-AUDIT-v0.1.md](/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS/governance/audits/CGOS-PROJECTION-REVISION-RUNTIME-RELEASE-PLANNING-AUDIT-v0.1.md)`
- `[CGOS-INDEPENDENT-VERSIONING-DECISION-RECORD-v0.1.md](/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS/governance/releases/CGOS-INDEPENDENT-VERSIONING-DECISION-RECORD-v0.1.md)`
- `[CGOS-DURABLE-LIFECYCLE-CONTINUITY-DEPENDENCY-BASELINE-v0.1.md](/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS/governance/baselines/CGOS-DURABLE-LIFECYCLE-CONTINUITY-DEPENDENCY-BASELINE-v0.1.md)`

Current dependency planning line:

Cognitive_OS now includes an interface-first durable lifecycle continuity
scaffold for projection-safe lifecycle history, pending review summaries below
queue semantics, and continuity snapshots. This is not full durable
persistence and does not add execution, queue, approval, schema, or MPLP
changes.

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

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> TracePilot`

This means:

- MPLP remains the upstream protocol constitution
- `Cognitive_OS` remains the mother-runtime foundation layer
- product projections remain downstream
- TracePilot remains downstream of product-projection rules rather than part of this repository’s active authority surface

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
