# Coregentis First-Batch Object Schemas v0

## Why These Are the First-Batch Objects

These schemas are the first object layer above the frozen Coregentis base schemas.

They were chosen because they are the smallest object family that can support the minimal cognitive loop:

`Form -> Place -> Activate -> Confirm -> Trace -> Reconcile -> Consolidate`

The first batch therefore covers:

- runtime scope
- intake
- intent formation
- working and durable memory
- activation and bounded action
- policy and confirmation
- evidence and decision capture
- drift and conflict handling
- promotion and learning capture

This is the minimum real object family needed before registry, binding, and runtime phases can proceed.

## How They Relate to the Minimal Cognitive Loop

- `Project`
  - host runtime scope for single-project-first execution
- `External Input Record`
  - raw intake anchor for `Form`
- `Intent`
  - governed entry object for `Form`
- `Delta Intent`
  - governed change object for change-handling and correction
- `Working State Node`
  - working-memory placement object for `Place`
- `Episode`
  - episodic memory and replay anchor for `Place` and later `Trace`
- `Semantic Fact`
  - stable retained truth anchor for later reuse
- `Activation Signal`
  - bounded activation request for `Activate`
- `Action Unit`
  - bounded executable unit for `Activate`
- `Policy Rule`
  - explicit runtime policy law for `Confirm`
- `Confirm Gate`
  - confirm-stage governance object for `Confirm`
- `Trace Evidence`
  - evidence-grade trace object for `Trace`
- `Decision Record`
  - explicit decision artifact for `Trace`
- `Drift Record`
  - change/divergence artifact for `Reconcile`
- `Conflict Case`
  - typed conflict artifact for `Reconcile`
- `Memory Promotion Record`
  - governed promotion artifact across memory layers
- `Learning Candidate`
  - governed learning/consolidation capture for `Consolidate`

## How These Schemas Compose from the Base Layer

These object schemas do not redefine:

- identity semantics
- authority semantics
- primary layer semantics
- temporal semantics
- mutation semantics
- lineage semantics
- governance semantics

Instead, they compose from the frozen base layer by reusing:

- envelope field definitions from `../base/cognitive-object-envelope.schema.json`
- record schemas from:
  - `../base/temporal-record.schema.json`
  - `../base/mutation-record.schema.json`
  - `../base/lineage-record.schema.json`
  - `../base/governance-record.schema.json`

Composition is done at the property level.

This is intentional for the `v0` stream because:

- the base envelope is a closed Draft-07 schema
- property-level reuse keeps object schemas aligned with the base layer
- object schemas can remain specific without weakening the frozen base rules

## What Is Intentionally Deferred

This phase still does **not** implement:

- machine-readable object registry files
- machine-readable MPLP <-> Coregentis binding files
- runtime services or runtime code
- projection objects
- TracePilot semantics
- a typed shared reference schema
- richer organization, enterprise, or domain object packs

Where runtime-bound objects preserve protocol reconstructability, they do so only through shallow `protocol_binding_ref` reuse.

For the `v0` object layer, shallow binding linkage may appear without being universally required.
That is intentional.
The object layer preserves a place for reconstructability, but it does not force full binding commitments before the binding phase exists.

The full meaning of:

- protocol mapping
- export rules
- reconstruction rules
- authority promotion rules

is intentionally deferred to the registry and binding phases.

Explicit project scoping remains broadly acceptable for the single-project-first `v0` stream, but objects should not over-require project-scoped detail when that would pre-commit later registry or runtime behavior.
