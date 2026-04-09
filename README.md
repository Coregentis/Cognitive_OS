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
