# CGOS-REGISTRY-REVIEW-R1-v0.1

## Purpose

This memo is the Registry Review Round 1:

- completeness review
- interpretation sanity review

Scope is limited to:

- `/registry/coregentis-object-registry.v0.yaml`
- `/registry/coregentis-relationship-rules.v0.yaml`
- `/registry/README.md`

This review does not patch registry files.
It does not create binding, runtime, or TracePilot artifacts.

## A. Object Coverage Completeness

### Current state

The object registry declares:

- `object_count: 17`
- 17 concrete object entries under `objects:`

The covered object types are:

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

### Judgment

Coverage is complete against the frozen 17-object family.

No frozen object is missing.
No extra object has been silently invented.

### Recommended action

- `keep`

### Misclassification sanity

No object appears misclassified badly enough to block continuation.

The only noteworthy classification watchpoint is:

- `semantic-fact` remains `coregentis_private_runtime`

This is not a blocking problem.
It is a later registry/binding question, not an R1 failure.

### Recommended action

- `defer`

## B. Interpretation Sanity

## B1. `memory_layer` assignments

### Current state

The registry assigns:

- `null` to non-retained or non-memory-dominant objects such as `project`, `activation-signal`, `action-unit`, `policy-rule`
- `working_memory` to `intent`, `delta-intent`, `working-state-node`
- `episodic_memory` to `external-input-record`, `episode`, `confirm-gate`, `trace-evidence`, `decision-record`, `drift-record`, `conflict-case`, `memory-promotion-record`, `learning-candidate`
- `semantic_memory` to `semantic-fact`

### Judgment

This is broadly sane and does not overclaim schema truth because the registry README explicitly frames registry as an interpretation layer after schema freeze.

The use of `null` instead of fake values is correct.

The main places to watch later:

- `policy-rule` as `null` is acceptable, but later runtime/profile work may want a distinct notion of constitutional rather than memory placement
- `external-input-record` as `episodic_memory` is reasonable, but it is still an interpretation, not a schema fact

### Recommended action

- `keep`
- `clarify` that these are dominant placement interpretations, not schema-declared fields

## B2. `temporal_class` assignments

### Current state

Examples:

- `project` -> `durable`
- `intent` / `delta-intent` -> `session_bounded`
- `working-state-node` / `activation-signal` -> `ephemeral`
- `episode`, `trace-evidence`, `decision-record`, `drift-record`, `conflict-case`, `memory-promotion-record` -> `replayable`
- `learning-candidate` -> `promotable`
- `semantic-fact` -> `durable`

### Judgment

These are directionally sane and appropriately conservative.

No assignment appears wildly inconsistent with the object family.
The registry is not pretending these are runtime-verified behaviors yet.

### Recommended action

- `keep`

## B3. `mutation_class` assignments

### Current state

Examples:

- `semantic-fact` -> `promotion_based`
- `policy-rule` -> `policy_mutable`
- `trace-evidence` / `decision-record` -> `append_only`
- most others -> `stateful_mutable`

### Judgment

Mostly sane.

The only place to watch later is whether `decision-record` should remain strictly `append_only` or become more nuanced once runtime evidence chains are designed.

This is not a blocker now.

### Recommended action

- `keep`
- `defer` later nuance for evidence records

## B4. `protocol_binding_ref_policy` assignments

### Current state

- `intent`, `delta-intent`, `confirm-gate`, `trace-evidence` -> `optional_shallow_runtime_bound`
- all others -> `not_applicable`

### Judgment

This is the right level of restraint for the registry draft.

It preserves reconstructability without importing full binding semantics.

No object is overclaimed as fully bound.

### Recommended action

- `keep`

## C. Relationship Sanity

## C1. `allowed_relationships` per object

### Current state

Each object declares a small relationship subset.

Examples:

- `project` -> `contains`, `references`, `governs`
- `intent` -> `references`, `derived_from`, `conflicts_with`, `evidences`
- `policy-rule` -> `governs`, `references`, `evidences`
- `trace-evidence` -> `evidences`, `references`

### Judgment

This is appropriately minimal.

The registry does not yet try to encode object-to-object pairwise constraints too aggressively.
That is good for this phase.

The only mild watchpoint is:

- `project` carrying `governs`

This is acceptable if read as allowed vocabulary rather than mandated behavior, but it edges near governance/runtime semantics.

### Recommended action

- `keep`
- `clarify` that allowed relationships are permitted vocabulary, not required runtime behavior

## C2. Relationship rule family breadth

### Current state

The baseline vocabulary contains exactly:

- `references`
- `contains`
- `derived_from`
- `promoted_from`
- `conflicts_with`
- `governs`
- `evidences`

No projection-specific relationship type was added.

### Judgment

Correct.

The set is minimal and aligned with the earlier schema and planning phases.

### Recommended action

- `keep`

## C3. Relationship rule breadth by type

### `references`

- current state:
  - effectively allowed across all source and target families
- judgment:
  - acceptable as a default v0 relation
- recommended action:
  - `keep`

### `contains`

- current state:
  - source families include `organization`, `memory`, `evidence`
- judgment:
  - `organization` and `memory` are clearly sane
  - `evidence` as a source family may be slightly broad for v0
- recommended action:
  - `clarify`

### `derived_from`

- current state:
  - broad but still excludes `organization` as source
- judgment:
  - acceptable
- recommended action:
  - `keep`

### `promoted_from`

- current state:
  - target families include `memory`, `evidence`, `learning`
- judgment:
  - `memory` and `learning` are clearly right
  - `evidence` as a promotion source may be plausible but needs later review
- recommended action:
  - `clarify`

### `conflicts_with`

- current state:
  - covers `entry`, `memory`, `action`, `governance`
- judgment:
  - sane and not overbroad
- recommended action:
  - `keep`

### `governs`

- current state:
  - source family restricted to `governance`
- judgment:
  - correct and importantly constrained
- recommended action:
  - `keep`

### `evidences`

- current state:
  - source families include `evidence`, `governance`, `memory`, `learning`
- judgment:
  - broader than pure evidence-only, but still defensible in a cognitive runtime where governance and retained structures can evidence other objects
- recommended action:
  - `keep`

## D. Boundary Sanity

## D1. Registry vs schema truth

### Current state

The registry README explicitly says:

- schemas define shape
- registry defines classification and interpretation

The registry file also uses registry-only fields such as:

- `memory_layer`
- `temporal_class`
- `mutation_class`
- `protocol_binding_ref_policy`

### Judgment

Boundary is preserved.

The registry is interpreting frozen schema truth, not pretending to replace it.

### Recommended action

- `keep`

## D2. Registry vs binding semantics

### Current state

The registry uses only shallow policy labels such as:

- `optional_shallow_runtime_bound`
- `not_applicable`

It does not define:

- field-level MPLP mappings
- export rules
- reconstruction logic
- compatibility logic

### Judgment

Boundary is preserved.

### Recommended action

- `keep`

## D3. Registry vs runtime behavior

### Current state

The registry classifies likely dominant memory, temporal, and mutation interpretations, but it does not encode executable services, state transitions, or orchestration.

### Judgment

Boundary is preserved, though some notes are close to behavioral language.

### Recommended action

- `clarify` in future R2 wording if needed

## Top 10 Registry Review Findings

1. The registry covers all 17 frozen objects exactly once. Coverage is complete.
2. No new object has been invented and no frozen object is missing.
3. The registry’s `memory_layer` assignments are broadly sane, and `null` is used correctly where a fake placement would be misleading.
4. `temporal_class` assignments are directionally correct and conservative enough for a draft registry.
5. `mutation_class` assignments are mostly sound; any nuance left in evidence records is not a blocker.
6. `protocol_binding_ref_policy` is appropriately shallow and does not collapse into binding semantics.
7. The relationship vocabulary is minimal and correctly excludes projection-specific types.
8. `contains` and `promoted_from` may be slightly broad in a couple of family slots, but not badly enough to block continuation.
9. The registry remains distinct from schema truth, binding semantics, and runtime behavior. The README is clear on those boundaries.
10. The draft is complete enough to continue into R2. The next review should focus on narrowing and wording precision rather than structural rescue.

## Continue Decision

Decision:

The registry draft is complete enough to continue into R2.

Reason:

- object coverage is complete
- classification is directionally sane
- relationship rules are minimal and non-projectional
- no boundary collapse with schema, binding, or runtime layers is visible

## Recommended R2 Focus

If and when Registry Review R2 happens, it should focus on:

- narrowing any slightly broad relationship family allowances
- checking whether any notes are over-interpreting likely runtime behavior
- deciding whether `semantic-fact` should stay exactly where it is
- confirming the few `null` memory-layer uses are consistently justified

## Boundary Confirmation

This step is review-only.

It does not:

- patch registry files
- create binding files
- create runtime files
- create TracePilot files
