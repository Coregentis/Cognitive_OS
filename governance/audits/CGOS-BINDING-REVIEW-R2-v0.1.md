# CGOS-BINDING-REVIEW-R2-v0.1

## Purpose

This memo is the Binding Review Round 2:

- minimality review
- wording precision review
- targeted patch justification

Scope is limited to:

- `/bindings/mplp-coregentis-binding-matrix.v0.yaml`
- `/bindings/coregentis-export-rules.v0.yaml`
- `/bindings/README.md`

This round does not change binding direction.
It only tightens wording so binding remains a semantic bridge and not a hidden runtime or protocol-collapse layer.

## 1. `mplp_object` Wording Minimality

### `intent`

#### Current state

The original draft used:

- `mplp_object: "mplp intent-related event semantics"`

#### Judgment

Directionally right, but slightly vague.

The phrase `intent-related` is broader than needed and could imply more MPLP surface than this draft actually binds.

#### Recommended action

- `narrow`

#### Exact patch

Change to:

- `mplp intent event-family semantics`

### `delta-intent`

#### Current state

The original draft used:

- `mplp_object: "mplp delta_intent event semantics"`

#### Judgment

Directionally right, but slightly less precise than it could be.

#### Recommended action

- `clarify`

#### Exact patch

Change to:

- `mplp delta_intent event-family semantics`

### `confirm-gate`

#### Current state

The original draft used:

- `mplp_object: "mplp-confirm"`

#### Judgment

This is directionally correct, but it reads more like a filename or package token than a semantic label.

#### Recommended action

- `clarify`

#### Exact patch

Change to:

- `mplp confirm object semantics`

### `trace-evidence`

#### Current state

The original draft used:

- `mplp_object: "mplp-trace"`

#### Judgment

Same issue as `confirm-gate`: directionally right, but slightly too token-like.

#### Recommended action

- `clarify`

#### Exact patch

Change to:

- `mplp trace object semantics`

## 2. `binding_class` Minimality

### Current state

The current vocabulary is:

- `shallow_reconstructable_runtime_bound`
- `protocol_adjacent_but_not_exportable`
- `runtime_private_only`
- `export_restricted_internal`

### Judgment

This remains the minimal coherent set for the draft.

It distinguishes:

- true runtime-bound but shallowly reconstructable objects
- protocol-adjacent but non-exportable objects
- fully runtime-private objects
- internal/export-restricted retained structures

No class appears redundant enough to remove now.
No new class is needed.

### Recommended action

- `keep`

## 3. Export-Rule Wording Precision

### Current state

Export classes are:

- `protocol_compliant_export`
- `protocol_adjacent_export_restricted`
- `runtime_private_non_exportable`
- `internal_derived_only`

### Judgment

The class set is already clear and non-overlapping enough.

The wording does not currently collapse:

- compliant export
- restricted export
- private non-export
- internal derived-only contribution

### Recommended action

- `keep`

## 4. `runtime_substrate_hint` Wording Precision

### Current state

The README already states that `runtime_substrate_hint` is informational only.
The matrix uses per-object `runtime_substrate_note`, but there was no top-level machine-readable rule stating that the hint is non-binding.

### Judgment

This is mostly safe, but a top-level clarification in the matrix would make the limitation more explicit and reduce overread risk.

### Recommended action

- `clarify`

### Exact patch

Add top-level fields to the binding matrix:

- `runtime_substrate_hint_policy: informational_only`
- `runtime_substrate_hint_note: ... do not select or implement runtime architecture`

## 5. README Boundary Wording Precision

### Current state

The README already clearly states:

- binding is not simple variable renaming
- Coregentis is not just MPLP object reuse
- binding does not implement AEL/VSL/PSG
- `runtime_substrate_hint` is informational only

### Judgment

Boundary wording is strong.

One useful tightening remains:

- clarify that `mplp_object` is a semantic reference label, not a field-level mapping instruction

### Recommended action

- `clarify`

### Exact patch

Add one sentence in README stating:

- `mplp_object` is a semantic reference label, not a field mapping instruction

## Summary of Justified Patches

1. narrow `intent.mplp_object`
2. clarify `delta-intent.mplp_object`
3. clarify `confirm-gate.mplp_object`
4. clarify `trace-evidence.mplp_object`
5. add a top-level informational-only policy line for `runtime_substrate_hint`
6. clarify in README that `mplp_object` is not field mapping

## What Should Remain Open for R3

- whether any per-object `runtime_substrate_note` wording is still too confident
- whether any `compatibility_notes` should be shortened further
- whether `protocol_adjacent_but_not_exportable` wording should be shortened for freeze without losing precision
