# Coregentis Registry v0

## Why Registry Comes After Schema Freeze

Registry comes after schema freeze because registry is not the place where object semantics should be invented.

The order is:

1. freeze base schemas
2. freeze first-batch object schemas
3. classify those frozen objects in a machine-readable registry

If registry came first, it would force premature interpretation over unstable schemas.
If runtime came first, it would invent classifications ad hoc in code.

Registry is therefore the first interpretation layer *after* schema truth, not a replacement for schema truth.

## How Registry Differs From Schemas

Schemas define:

- field structure
- object shape
- required properties
- allowable value domains

Registry defines:

- object classification
- functional family
- authority interpretation
- dominant memory placement interpretation
- dominant temporal interpretation
- dominant mutation interpretation
- allowed relationship vocabulary for each object

These are draft classification judgments, not executable runtime commitments.

In short:

- schemas define what an object can look like
- registry defines how the frozen object family is classified and used

## How Registry Differs From Binding

Registry is internal classification over Coregentis objects.

Binding is a later phase that must define:

- exact MPLP <-> Coregentis mapping rules
- reconstructability rules
- import rules
- export rules
- field-level or object-level binding semantics

This registry may note shallow protocol-binding policy, but it does **not** implement the binding matrix.

It also does not decide:

- field-level protocol reconstruction
- runtime state transitions
- execution-side relationship application

## What This Phase Still Intentionally Does NOT Implement

This phase does not implement:

- MPLP <-> Coregentis binding files
- runtime services
- storage
- execution flow
- TracePilot projection work
- product vocabulary
- new object families beyond the frozen 17-schema first batch

It is still a mother-runtime foundation step only.

## What Is Included In This Phase

This phase includes:

- `coregentis-object-registry.v0.yaml`
- `coregentis-relationship-rules.v0.yaml`

Together they provide the first machine-readable classification layer for the frozen v0 Coregentis object family while preserving the authority order:

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> TracePilot`
