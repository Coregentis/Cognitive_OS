# Cognitive_OS

## What This Repository Is

`Cognitive_OS` is the neutral Coregentis mother-runtime foundation repository.

It exists to hold:

- mother-runtime governance baselines
- schema, registry, and binding truth
- runtime skeleton and harness scaffolds
- mother-runtime tests and fixtures

It is not a product repository.

## What Belongs Here

Allowed repository truth surfaces:

- `governance/`
- `imports/`
- `schemas/`
- `registry/`
- `bindings/`
- `runtime/`
- `tests/`

These are the active foundation surfaces for the `v0.1` mother-runtime baseline stream.

## What Does Not Belong Here

Out of scope for this repository:

- product repositories
- projection repositories
- TracePilot implementation
- PublishPilot implementation
- GrowthPilot implementation
- any future Pilot-branded application repository
- product UI surfaces
- product DTOs or application-specific workflow surfaces

Application-specific projection and product development belongs in separate repositories.

## Authority Order

This repository preserves:

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> TracePilot`

Implication:

- MPLP remains upstream protocol constitution
- this repository remains the mother-runtime foundation layer
- product projections come later and elsewhere

## Repository Neutrality

This repository is intentionally neutral with respect to specific product repos.

It may retain general product-projection theory where that theory remains application-neutral.
It must not expose product-specific implementation surfaces as repository authority.

## Public Visibility Caution

Public visibility of a repository does not by itself define:

- product scope
- open-source grant scope
- commercial boundary

This repository should therefore be read as a public mother-runtime foundation surface, not as a product repository.
