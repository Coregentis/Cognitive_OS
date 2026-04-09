# CGOS-BINDING-REVIEW-R1-v0.1

## Purpose

This memo is the Binding Review Round 1:

- completeness review
- boundary sanity review

Scope is limited to:

- `/bindings/mplp-coregentis-binding-matrix.v0.yaml`
- `/bindings/coregentis-export-rules.v0.yaml`
- `/bindings/README.md`

This round does not patch the binding files.
It does not create runtime or TracePilot artifacts.

## A. Object Coverage and Binding-Class Sanity

### Current state

The binding matrix includes all 17 frozen Coregentis objects:

1. `project`
2. `external-input-record`
3. `intent`
4. `delta-intent`
5. `working-state-node`
6. `episode`
7. `semantic-fact`
8. `activation-signal`
9. `action-unit`
10. `policy-rule`
11. `confirm-gate`
12. `trace-evidence`
13. `decision-record`
14. `drift-record`
15. `conflict-case`
16. `memory-promotion-record`
17. `learning-candidate`

Binding classes used are:

- `shallow_reconstructable_runtime_bound`
- `protocol_adjacent_but_not_exportable`
- `runtime_private_only`
- `export_restricted_internal`

### Judgment

Coverage is complete enough for this phase.

No frozen object is omitted.
No new object is invented.

The binding-class vocabulary is disciplined and appropriately separates:

- directly runtime-bound but shallowly reconstructable
- protocol-adjacent but not directly exportable
- runtime-private only
- internal/export-restricted structures

No object appears misclassified badly enough to block continuation.

### Recommended action

- `keep`

## B. MPLP Semantic Mapping Sanity

### `intent`

#### Current state

- `mplp_object: "mplp intent-related event semantics"`
- binding class: `protocol_adjacent_but_not_exportable`

#### Judgment

Directionally correct and acceptably partial for this phase.

It is deliberately not claiming a canonical MPLP top-level object equivalence.
That restraint is correct.

The phrase is somewhat broad, but not dangerously broad.

#### Recommended action

- `clarify`

Meaning:

No immediate patch required for R1, but wording precision may be reviewed in R2.

### `delta-intent`

#### Current state

- `mplp_object: "mplp delta_intent event semantics"`
- binding class: `protocol_adjacent_but_not_exportable`

#### Judgment

Directionally correct and acceptably partial for this phase.

It does not overclaim direct MPLP object equivalence.

#### Recommended action

- `keep`

### `confirm-gate`

#### Current state

- `mplp_object: "mplp-confirm"`
- binding class: `shallow_reconstructable_runtime_bound`

#### Judgment

Correct and appropriately stronger than the intent-side mappings.

This object is one of the few places where direct protocol-adjacent artifact reconstruction makes sense in `v0`.

The mapping is not too strong because it still explicitly says shallow reconstructable, not full mirror.

#### Recommended action

- `keep`

### `trace-evidence`

#### Current state

- `mplp_object: "mplp-trace"`
- binding class: `shallow_reconstructable_runtime_bound`

#### Judgment

Correct and appropriately bounded.

This is one of the few direct protocol-relevant artifacts where shallow reconstructability is justified.

#### Recommended action

- `keep`

## C. Export-Rule Sanity

### Current state

Export classes are:

- `protocol_compliant_export`
- `protocol_adjacent_export_restricted`
- `runtime_private_non_exportable`
- `internal_derived_only`

Mapped object groups are non-overlapping and cover all relevant export postures.

### Judgment

The export classes form a coherent set.

They clearly distinguish:

- what may leave as protocol-compliant artifacts
- what is protocol-adjacent but still restricted
- what is runtime-private and non-exportable
- what is internal/derived-only

No obvious overlap or ambiguity is severe enough to block continuation.

The only item worth watching later is whether `semantic-fact` and `learning-candidate` should remain together under the same export class forever, but this is not a blocker now.

### Recommended action

- `keep`
- `defer` later nuance for internal retained structures

## D. Boundary Sanity

### D1. Binding vs schema

#### Current state

The README explicitly states that binding comes after schema freeze and that binding is not simple variable renaming.

The matrix classifies frozen objects and maps them to protocol-relevant meaning, but it does not redefine object shape.

#### Judgment

Boundary preserved.

#### Recommended action

- `keep`

### D2. Binding vs registry

#### Current state

Registry classifies object family and dominant interpretation.
Binding adds import/export/reconstruction rules and compatibility notes.

#### Judgment

Boundary preserved.

Binding is doing more than registry, but it is not redoing registry’s job.

#### Recommended action

- `keep`

### D3. Binding vs runtime

#### Current state

Binding uses:

- `runtime_substrate_hint`
- `runtime_substrate_note`

but the README explicitly says these are informational and not implementation.

#### Judgment

Boundary preserved.

No executable runtime behavior is encoded.

#### Recommended action

- `keep`

### D4. Binding vs TracePilot / product

#### Current state

No TracePilot object, projection object, or product surface appears in the matrix or export rules.

#### Judgment

Boundary preserved.

#### Recommended action

- `keep`

## E. `runtime_substrate_hint` Sanity

### Current state

Hints used:

- `psg`
- `vsl`
- `ael`
- `multi_substrate`

No object uses these hints to encode actual runtime behavior.

### Judgment

These hints remain informational only.

Some wording in the notes is slightly more confident than the bare minimum, but not enough to count as runtime implementation.

No hint overcommits later runtime design badly enough to block continuation.

### Recommended action

- `clarify`

Meaning:

Later R2 review can tighten wording if needed, but no immediate correction is required for R1.

## Top 10 Binding Review Findings

1. The binding matrix covers all 17 frozen Coregentis objects. Coverage is complete for this phase.
2. No Coregentis-private object has been silently promoted into MPLP-native status.
3. The binding-class vocabulary is coherent and non-overlapping enough for a draft binding layer.
4. `intent` and `delta-intent` are appropriately treated as protocol-adjacent rather than direct MPLP object mirrors.
5. `confirm-gate` and `trace-evidence` are appropriately treated as shallowly reconstructable runtime-bound objects.
6. The export-rule set is coherent and gives clear separation between compliant export, restricted export, private non-export, and internal-only semantics.
7. The binding layer remains distinct from schema truth and registry truth.
8. The binding layer remains distinct from runtime implementation; `runtime_substrate_hint` is still informational only.
9. No TracePilot or product binding leakage is present.
10. The draft is complete enough to continue into R2. The next review should focus on wording precision and narrowness, not structural rescue.

## Continue Decision

Decision:

The binding draft is complete enough to continue into R2.

Reason:

- object coverage is complete
- no category-level misclassification blocks continuation
- export classes are coherent
- boundary separation is preserved
- runtime substrate hints remain informational

## Boundary Confirmation

This step is review-only.

It does not:

- patch binding files
- create runtime files
- create TracePilot files
