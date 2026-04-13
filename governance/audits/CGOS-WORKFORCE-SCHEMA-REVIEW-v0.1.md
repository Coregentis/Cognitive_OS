# CGOS-WORKFORCE-SCHEMA-REVIEW-v0.1

## Purpose

This audit records the first review pass over the neutral workforce schema family added for the P0-A mother-runtime extension.

## Scope Reviewed

- `schemas/coregentis/v0/workforce/`
- `registry/coregentis-object-registry.v0.yaml`
- `bindings/mplp-coregentis-binding-matrix.v0.yaml`
- `bindings/coregentis-export-rules.v0.yaml`
- `runtime/core/runtime-types.ts`

## Review Outcomes

### 1. Product naming did not leak into mother-runtime authority

Confirmed:

- no `solocrew/` schema namespace was added
- no `Crew` / `CrewMember` product nouns define schema filenames
- workforce objects use neutral names only

### 2. All eight workforce schemas exist and compile

Confirmed for:

- `agent-group`
- `agent-worker`
- `role-profile`
- `objective`
- `work-item`
- `review-cycle`
- `memory-profile`
- `preference-profile`

Validation gate used:

- `npm run test:runtime:workforce`

### 3. Registry truth is aligned

Confirmed:

- registry object count increased from `17` to `25`
- each workforce object now has:
  - `functional_family`
  - `primary_layer`
  - `memory_layer`
  - `temporal_class`
  - `mutation_class`
  - `allowed_relationships`

### 4. Binding and export truth stay private

Confirmed:

- all workforce objects are classified `runtime_private_only` in the binding matrix
- all workforce objects are classified `runtime_private_non_exportable` in export rules
- no workforce object claims MPLP equivalence

### 5. Runtime type union matches the new schema family

Confirmed:

- `CoregentisObjectType` now includes all eight workforce objects

## Boundary Confirmation

This batch did not introduce:

- product DTOs
- SoloCrew authority naming
- provider-specific execution code
- full PSG realization
- full correction-loop realization

The schema family remains a neutral mother-runtime extension only.
