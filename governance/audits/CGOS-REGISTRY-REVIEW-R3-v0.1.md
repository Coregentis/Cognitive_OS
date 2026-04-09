# CGOS-REGISTRY-REVIEW-R3-v0.1

## Purpose

This memo is the Registry Review Round 3:

- consistency review
- freeze-readiness review

Scope is limited to:

- `/registry/coregentis-object-registry.v0.yaml`
- `/registry/coregentis-relationship-rules.v0.yaml`
- `/registry/README.md`

This round asks one narrower question:

Is the registry layer now consistent enough to freeze as the `v0` registry family and allow the next binding phase to begin?

## 1. Registry Entry Consistency

### Current state

Every object entry uses the same field shape:

- `object_type`
- `schema_ref`
- `authority_class`
- `functional_family`
- `primary_layer`
- `memory_layer`
- `temporal_class`
- `mutation_class`
- `protocol_binding_ref_policy`
- `allowed_relationships`
- `notes`

### Consistency judgment

Structurally consistent.

No entry is missing a required registry field.
No entry introduces a private one-off classification key.

### Freeze recommendation

Freeze this as the required `v0` registry entry shape.

### Exact patch action

None.

## 2. Note Wording Consistency

### Current state

Before this round, note wording was mostly consistent but not fully uniform:

- some entries started with `Draft registry interpretation:`
- some entries described classification more directly without the same framing

### Consistency judgment

Close, but not fully normalized.

### Freeze recommendation

All object notes should consistently read as registry interpretation, not runtime behavior.

### Exact patch action

Normalize remaining note phrasing in the object registry so entries consistently frame themselves as:

- draft registry interpretation
- classification-layer language
- non-runtime commitments

Patch applied.

## 3. Relationship Rule Consistency

### Current state

All relationship rules share the same shape:

- `relationship_type`
- `allowed_source_families`
- `allowed_target_families`
- `description`
- `notes`

Relationship names are all snake_case:

- `references`
- `contains`
- `derived_from`
- `promoted_from`
- `conflicts_with`
- `governs`
- `evidences`

Description style is consistently definitional.
Note style is consistently scope- or caution-oriented.

### Consistency judgment

Consistent enough for freeze.

### Freeze recommendation

Freeze the current relationship rule family as the `v0` registry relationship vocabulary.

### Exact patch action

None.

## 4. Deferred-Issue Freeze Handling

### 4.1 `project.governs`

#### Current state

`project` currently allows:

- `contains`
- `references`
- `governs`

#### Consistency judgment

This is slightly broader than the most conservative reading, but not inconsistent enough to block freeze.

#### Freeze recommendation

Freeze as deferred.

Meaning:

- do not patch it in this round
- do not silently expand it
- revisit only if the binding or runtime phase exposes a concrete problem

#### Exact patch action

None.

### 4.2 `semantic-fact` classification

#### Current state

`semantic-fact` remains:

- `authority_class: coregentis_private_runtime`
- `memory_layer: semantic_memory`
- `temporal_class: durable`
- `mutation_class: promotion_based`

#### Consistency judgment

Consistent with the current registry family.

#### Freeze recommendation

Freeze as deferred.

Meaning:

- keep current classification
- do not silently reclassify in the registry phase
- revisit only if later binding work forces a contradiction

#### Exact patch action

None.

### 4.3 Remaining `null` `memory_layer` justifications

#### Current state

Objects with `memory_layer: null` are:

- `project`
- `activation-signal`
- `action-unit`
- `policy-rule`

Before this round, their justifications were mostly present but not fully uniform.

#### Consistency judgment

The `null` pattern itself is consistent and justified.
The explanatory wording needed one final normalization pass.

#### Freeze recommendation

Freeze the `null` assignments as valid for:

- scope objects
- action-phase objects
- governance-law objects

#### Exact patch action

Normalize the remaining note wording so `null` memory-layer cases are explained consistently as classification choices, not runtime mechanics.

Patch applied.

## 5. README Consistency

### Current state

The README already distinguishes registry from:

- schema truth
- binding semantics
- runtime behavior

### Consistency judgment

Consistent enough for freeze.

### Freeze recommendation

Freeze as-is.

### Exact patch action

None.

## 6. What Is Now Considered Frozen in the Registry Layer

The following are now frozen for the `v0` registry family:

- registry entry shape
- object coverage of all 17 frozen objects
- relationship rule shape
- relationship type naming
- current `memory_layer`, `temporal_class`, `mutation_class`, and `protocol_binding_ref_policy` interpretation surfaces
- note framing as registry interpretation rather than runtime behavior
- README boundary language separating registry from schemas, binding, and runtime

## 7. Any Issue Intentionally Deferred Beyond R3

1. Whether `project.governs` should remain exactly as-is.
2. Whether `semantic-fact` should ever be reclassified in a later phase.
3. Whether future binding work should force any change in `optional_shallow_runtime_bound`.

These are now frozen as deferred, not open for more registry churn.

## 8. Freeze Decision

Decision:

The registry layer is now ready to freeze for the `v0` mother-runtime foundation stream.

That means:

- the registry family is coherent enough to stop refinement
- no further registry semantic expansion is required before binding work starts
- the next phase may begin with binding implementation
