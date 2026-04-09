# Coregentis Base Schemas v0

## Why Base Schemas Exist Before Object Schemas

Coregentis cannot safely start by writing object-specific schemas directly.

The Runtime Constitution and Cognitive Object Registry baseline already require every first-class runtime object to carry cross-cutting semantics for:

- identity
- authority class
- primary layer
- temporal positioning
- mutation behavior
- lineage
- governance references
- relationship semantics

If these semantics are copied separately into every object schema, the project will recreate the exact drift problem that the object registry baseline is trying to prevent.

These base schemas therefore exist first so later object schemas can compose from a common machine-readable foundation instead of re-inventing shared runtime meaning.

## Relationship to the Runtime Constitution and Object Registry Baseline

These files are the machine-readable base layer for the Coregentis runtime constitution.

They map directly to the constitutional requirements:

- `cognitive-object-envelope.schema.json`
  - object identity
  - authority class
  - primary layer
  - compositional links to temporal, mutation, lineage, governance, and relation semantics

- `temporal-record.schema.json`
  - event time vs cognition time
  - validity window
  - replay / rollback / drift / retention / consolidation horizons
  - temporal class

- `lineage-record.schema.json`
  - creation source
  - derivation mode
  - source objects
  - source events
  - promotion lineage
  - protocol import lineage

- `governance-record.schema.json`
  - governance scope
  - policy refs
  - authority refs
  - confirm refs
  - review / approval / rollback / compensation references

- `mutation-record.schema.json`
  - mutation class
  - revision state
  - promotion and demotion control hooks

- `relation-record.schema.json`
  - explicit relationship typing across runtime objects

Taken together, these schemas are the minimum machine-readable substrate required before first-batch Coregentis object schemas can be written.

## How They Differ From MPLP Protocol Schemas

These base schemas are not MPLP protocol schemas.

MPLP protocol schemas define protocol-native artifacts such as:

- Context
- Plan
- Confirm
- Trace

These Coregentis base schemas define runtime-supporting structure for Coregentis mother-runtime objects and runtime-bound realizations.

They intentionally do **not** redefine MPLP module truth.
Instead, they provide the common runtime envelope and record types that Coregentis object schemas will later compose with.

In other words:

- MPLP schemas define protocol constitution
- these base schemas define Coregentis runtime substrate

That preserves the required authority order:

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> TracePilot`

## Round 2 Minimality Refinement

The base layer has been intentionally tightened in Round 2 so it does not overreach into downstream layers.

The following semantics are intentionally deferred out of the base layer:

- memory placement details such as `memory_layer`
- deep protocol-binding detail beyond a shallow reconstructability stub
- projection-facing lineage and relation vocabulary
- mutation policy and promotion/demotion control fields
- rollback and compensation references that belong in richer governance objects later
- generic relation, evidence, and trace collections in the base envelope

This keeps the base layer lighter and more composable before object-schema expansion begins.

## Reuse / Alignment Choices

These base schemas align with imported MPLP patterns where useful:

- draft-07 JSON Schema dialect
- UUID v4 identifier shape aligned with MPLP identifier conventions
- date-time formatting aligned with MPLP temporal fields

They do **not** import MPLP module definitions directly because this layer is not a protocol mirror.
This layer is a Coregentis runtime foundation.

## What This Phase Still Intentionally Does Not Implement

This phase does not yet implement:

- any Coregentis object-specific schemas under `/schemas/coregentis/v0/objects/`
- machine-readable object registry files
- machine-readable MPLP <-> Coregentis binding files
- runtime services or runtime code
- policy logic
- storage implementation
- memory implementation
- TracePilot runtime profile or UI

The only goal of this step is to establish a clean, minimal, composable base schema layer that future object schemas can build on without semantic duplication or layer collapse.
