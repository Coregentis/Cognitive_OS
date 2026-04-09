# CGOS-RUNTIME-SKELETON-R1-REVIEW-v0.1

## Purpose

This note records the first structural correction pass over the Coregentis runtime skeleton.

It is intentionally narrow:

- interface-first
- scaffold-first
- harness-first

It does not add full runtime behavior.

## Structural Corrections Applied

### 1. Registry authority separated from binding taxonomy

Applied to:

- `runtime/core/runtime-types.ts`

Correction:

- `RegistryEntryRecord.authority_class` now uses `CoregentisAuthorityClass` only
- binding classification remains in binding-layer types only

Why this preserves phase boundary:

- registry and binding remain distinct
- runtime skeleton does not collapse registry authority semantics into binding semantics

### 2. Runtime object shape now carries memory-layer identity

Applied to:

- `runtime/core/runtime-types.ts`

Correction:

- added `memory_layer?: CoregentisMemoryLayer` to `RuntimeObjectRecord`

Why this preserves phase boundary:

- the field only reflects frozen registry/base-layer concepts
- it does not implement memory behavior

### 3. Minimal loop planning is now scenario-aware

Applied to:

- `runtime/core/runtime-orchestrator.ts`

Correction:

- `plan_minimal_loop()` now branches between:
  - `fresh-intent`
  - `requirement-change-midflow`
- the change scenario explicitly includes `delta-intent`
- the change scenario notes now explicitly reference:
  - existing intent
  - episode
  - semantic-fact
  - drift-record
  - conflict-case

Why this preserves phase boundary:

- still dry-run only
- no runtime execution behavior was added
- no AEL/VSL/PSG logic was added

### 4. Event vs evidence scaffold boundary clarified

Applied to:

- `runtime/in-memory/README.md`

Correction:

- explicitly documented that `evidence-store.ts` temporarily serves as the event/evidence scaffold
- explicitly stated that no separate event-store exists yet

Why this preserves phase boundary:

- the clarification avoids pretending eventing design is complete
- it avoids overbuilding a new subsystem before needed

### 5. README wording tightened to reflect exact phase truth

Applied to:

- `runtime/core/README.md`
- `runtime/in-memory/README.md`

Correction:

- clarified that the skeleton does not implement runtime behavior
- clarified that registry authority and binding taxonomy remain separate
- clarified that dry-run planning is not execution
- clarified that substrate hints remain non-implementation

Why this preserves phase boundary:

- prevents readers from mistaking scaffold interfaces for implemented runtime law

## Boundary Confirmation

No product/runtime boundary was violated.

Specifically:

- no TracePilot or product service API was added
- no AEL implementation was added
- no VSL implementation was added
- no PSG implementation was added
- no intent-drift runtime module was added
- no full policy/confirm/trace/reconcile logic was added

This remains a runtime-skeleton-only correction pass.
