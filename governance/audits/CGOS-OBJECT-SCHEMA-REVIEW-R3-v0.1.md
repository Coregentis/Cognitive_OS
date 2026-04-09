# CGOS-OBJECT-SCHEMA-REVIEW-R3-v0.1

## Purpose

This memo is the Round 3 consistency review and freeze-readiness check for the 17 first-batch Coregentis object schemas.

This round does not expand semantics.
It asks one narrower question:

Are the current 17 object schemas consistent enough to freeze as one coherent `v0` object layer and allow the next registry phase to begin?

## 1. Naming Consistency

### 1.1 File naming

#### Current state

All object schema filenames use:

- lowercase
- kebab-case
- singular object names
- `.schema.json`

Examples:

- `delta-intent.schema.json`
- `trace-evidence.schema.json`
- `memory-promotion-record.schema.json`

#### Consistency judgment

Consistent.

#### Freeze recommendation

Freeze as-is.

#### Exact patch action

None.

### 1.2 Field naming

#### Current state

Field names across the family use snake_case.

Examples:

- `source_input_ref`
- `subject_object_refs`
- `policy_scope_level`
- `promotion_reason`

#### Consistency judgment

Consistent.

#### Freeze recommendation

Freeze snake_case as the object-field default.

#### Exact patch action

None.

### 1.3 Enum naming

#### Current state

Enum values across the family use lowercase snake_case.

Examples:

- `runtime_bound`
- `not_required`
- `intent_drift`
- `decision_basis`

#### Consistency judgment

Consistent.

#### Freeze recommendation

Freeze as-is.

#### Exact patch action

None.

### 1.4 Object-type consistency across the family

#### Current state

Each object schema sets `object_type` as a `const`, and the value matches the filename stem.

Examples:

- `intent.schema.json` -> `intent`
- `confirm-gate.schema.json` -> `confirm-gate`
- `memory-promotion-record.schema.json` -> `memory-promotion-record`

#### Consistency judgment

Consistent.

#### Freeze recommendation

Freeze this filename-to-`object_type` alignment rule.

#### Exact patch action

None.

## 2. Metadata Consistency

### Current state

All 17 object schemas carry the same `x-coregentis-meta` shape:

- `schema_role`
- `phase`
- `version_stream`
- `authority_order_preserved`
- `governing_doc`
- `object_family`

### Consistency judgment

Consistent.

### Freeze recommendation

Freeze this metadata shape as the required object-schema metadata contract for the `v0` stream.

### Exact patch action

None.

## 3. Reference-Family Consistency

### 3.1 `source_input_ref`

#### Current state

Used on `intent` and `delta-intent` to refer back to intake.

#### Consistency judgment

Semantically distinct and coherent.

#### Freeze recommendation

Keep as semantically distinct.

#### Exact patch action

None.

### 3.2 `subject_object_refs`

#### Current state

Used on `trace-evidence` and `decision-record` for evidence subjects.

#### Consistency judgment

Semantically distinct and coherent.

#### Freeze recommendation

Keep as semantically distinct.

#### Exact patch action

None.

### 3.3 `target_object_refs`

#### Current state

Used on `action-unit` for bounded execution targeting.

#### Consistency judgment

Semantically distinct and coherent.

#### Freeze recommendation

Keep as semantically distinct.

#### Exact patch action

None.

### 3.4 `object_refs`

#### Current state

Used on `conflict-case` for generic participating objects in a conflict.

#### Consistency judgment

Semantically distinct and coherent.

#### Freeze recommendation

Keep as semantically distinct.

#### Exact patch action

None.

### 3.5 `anchor_object_refs`

#### Current state

Used on `episode` to anchor replayable episodic scope.

#### Consistency judgment

Semantically distinct and coherent.

#### Freeze recommendation

Keep as semantically distinct.

#### Exact patch action

None.

### Family-level reference judgment

The reference family is not drifting.
It is specialized.

These names do not need forced renaming for stronger uniformity because the semantic targets differ:

- intake source
- evidence subject
- execution target
- conflict participants
- episode anchors

Shared typed-ref normalization remains a later concern, not a blocker for object-layer freeze.

## 4. Authority Classification Consistency

### `intent`

#### Current state

- `authority_class: runtime_bound`
- optional `protocol_binding_ref`

#### Consistency judgment

Coherent.

#### Freeze recommendation

Freeze as `runtime_bound` for `v0`.

#### Exact patch action

None.

### `delta-intent`

#### Current state

- `authority_class: runtime_bound`
- optional `protocol_binding_ref`

#### Consistency judgment

Coherent.

#### Freeze recommendation

Freeze as `runtime_bound` for `v0`.

#### Exact patch action

None.

### `confirm-gate`

#### Current state

- `authority_class: runtime_bound`
- optional `protocol_binding_ref`

#### Consistency judgment

Coherent.

#### Freeze recommendation

Freeze as `runtime_bound` for `v0`.

#### Exact patch action

None.

### `trace-evidence`

#### Current state

- `authority_class: runtime_bound`
- optional `protocol_binding_ref`

#### Consistency judgment

Coherent.

#### Freeze recommendation

Freeze as `runtime_bound` for `v0`.

#### Exact patch action

None.

### `semantic-fact`

#### Current state

- `authority_class: coregentis_private_runtime`

#### Consistency judgment

Directionally acceptable for `v0`.
This object is a retained runtime semantic structure rather than a protocol object mirror.

#### Freeze recommendation

Freeze as `coregentis_private_runtime` for the `v0` stream.
Any future reclassification should wait for registry/binding review, not happen now.

#### Exact patch action

None.

### Family-level authority judgment

Authority-class usage is coherent across the family:

- runtime-bound is used only where shallow protocol reconstructability is plausibly needed now
- Coregentis-private is used for the rest of the mother-runtime object family

No consistency patch is required.

## 5. Status Vocabulary Consistency

### Current state

Status enums vary across objects.

Examples:

- `intent`: `formed`, `active`, `resolved`, `superseded`, `blocked`
- `confirm-gate`: `not_required`, `pending`, `approved`, `rejected`, `bypassed`, `escalated`
- `trace-evidence`: `captured`, `linked`, `archived`
- `conflict-case`: `open`, `classified`, `resolved`, `branched`, `escalated`, `dismissed`

### Consistency judgment

Acceptably object-specific.

These are not drifting unnecessarily.
They reflect different object roles rather than accidental naming noise.

### Freeze recommendation

Freeze object-specific status vocabularies as acceptable for `v0`.
Do not force a shared status vocabulary at this phase.

### Exact patch action

None.

## 6. Shallow Protocol-Binding Consistency

### Current state

All four runtime-bound objects:

- `intent`
- `delta-intent`
- `confirm-gate`
- `trace-evidence`

carry the same shallow `protocol_binding_ref` field and none require deeper binding structure.

### Consistency judgment

Consistent enough for `v0`.

### Freeze recommendation

Freeze this rule:

- runtime-bound objects may expose optional shallow `protocol_binding_ref`
- they must not encode full binding semantics yet

### Exact patch action

None.

## 7. Freeze Readiness Summary

### What is now considered frozen in the object layer

- file naming pattern
- field naming pattern
- enum naming pattern
- `object_type` constant alignment with filename stem
- normalized `x-coregentis-meta` shape
- semantically distinct reference-family naming
- current authority classification pattern across the family
- object-specific status vocabularies
- optional shallow `protocol_binding_ref` pattern for runtime-bound objects

### What is intentionally deferred beyond R3

1. shared typed reference schema or ref-envelope pattern
2. any possible later reclassification of `semantic-fact`
3. any stronger status normalization across object families
4. full binding semantics
5. registry-owned cross-object naming or rule harmonization

## 8. Freeze Decision

Decision:

The object schema layer is now ready to freeze for the `v0` mother-runtime foundation stream.

This means:

- no further semantic expansion is required before registry work
- the family is coherent enough to support machine-readable registry drafting next
- remaining open questions are not blockers for starting the registry phase
