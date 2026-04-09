# CGOS-REGISTRY-REVIEW-R2-v0.1

## Purpose

This memo is the Registry Review Round 2:

- minimality review
- narrowing review
- targeted patch justification

Scope is limited to:

- `/registry/coregentis-object-registry.v0.yaml`
- `/registry/coregentis-relationship-rules.v0.yaml`
- `/registry/README.md`

This review does not enter binding, runtime, or TracePilot phases.

## 1. `memory_layer` Minimality

### Current state

The registry assigns:

- `working_memory`
- `episodic_memory`
- `semantic_memory`
- `null`

depending on dominant object interpretation.

### Judgment

This is already reasonably minimal.

No assignment appears grossly over-interpretive, and `null` is used where the object is better understood as scope, governance law, or action-phase rather than retained memory.

The `null` assignments that appear justified:

- `project`
- `activation-signal`
- `action-unit`
- `policy-rule`

### Recommended action

- `keep`
- `clarify` via note language that these are draft dominant interpretations, not schema truth

## 2. `temporal_class` Minimality

### Current state

Objects are assigned `durable`, `session_bounded`, `ephemeral`, `replayable`, or `promotable`.

### Judgment

The assignments are appropriately restrained.

No temporal class appears overstated enough to narrow now.

### Recommended action

- `keep`

## 3. `mutation_class` Minimality

### Current state

Objects are assigned:

- `stateful_mutable`
- `append_only`
- `promotion_based`
- `policy_mutable`

### Judgment

These are acceptable draft interpretations.

The only point to watch later is evidence-record nuance, but not enough to narrow at R2.

### Recommended action

- `keep`

## 4. Relationship-Rule Breadth

### 4.1 `contains`

#### Current state

`contains` currently allows source families:

- `organization`
- `memory`
- `evidence`

#### Judgment

`evidence` as a source family is broader than needed for this phase.

There is no strong frozen object evidence structure that clearly requires evidence-containing objects at the registry level.

#### Recommended action

- `narrow`

#### Exact patch

Remove `evidence` from `contains.allowed_source_families`.

### 4.2 `promoted_from`

#### Current state

`promoted_from` currently allows target families:

- `memory`
- `evidence`
- `learning`

#### Judgment

`evidence` as a target family is slightly too broad for the current registry draft.

Promotion in the current frozen object family is mainly about:

- memory-to-memory promotion
- learning-from-memory or learning-from-learning lineage

#### Recommended action

- `narrow`

#### Exact patch

Remove `evidence` from `promoted_from.allowed_target_families`.

### 4.3 `evidences`

#### Current state

`evidences` currently allows source families:

- `evidence`
- `governance`
- `memory`
- `learning`

#### Judgment

`memory` and `learning` as source families are broader than needed at this phase.

The safer draft reading is:

- evidence objects can evidence
- governance objects may also evidence because governance records can serve as justification records

That is enough for the current frozen family.

#### Recommended action

- `narrow`

#### Exact patch

Remove `memory` and `learning` from `evidences.allowed_source_families`.

## 5. Note Language Minimality

### Current state

Several object notes use language that leans toward runtime behavior or stronger interpretation.

Examples:

- “Registry interprets... retained primarily...”
- “Impact semantics remain deferred to runtime...”
- “Replayable divergence record...”

### Judgment

This is not catastrophic, but some notes are slightly too runtime-sounding for a registry draft.

### Recommended action

- `clarify`

### Exact patch

Rewrite notes to:

- emphasize draft interpretation
- avoid sounding like execution behavior
- keep deferred issues explicit without describing runtime machinery

## 6. `semantic-fact` Handling

### Current state

`semantic-fact` remains:

- `authority_class: coregentis_private_runtime`
- `memory_layer: semantic_memory`
- `temporal_class: durable`
- `mutation_class: promotion_based`

### Judgment

This should remain unchanged and explicitly deferred.

No silent reclassification is justified at this stage.

### Recommended action

- `defer`

### Exact patch

No classification patch.
Only note language may be softened.

## Patch Summary

### `coregentis-object-registry.v0.yaml`

- clarify note language across several objects so it sounds less like runtime behavior and more like draft classification

### `coregentis-relationship-rules.v0.yaml`

- narrow `contains.allowed_source_families`
- narrow `promoted_from.allowed_target_families`
- narrow `evidences.allowed_source_families`

### `registry/README.md`

- clarify that registry fields are draft classification judgments, not runtime commitments
- clarify that registry does not decide field-level protocol reconstruction or runtime-side relationship application

## What Should Remain Open for R3

- whether any remaining note wording still needs normalization for freeze
- whether `project` should retain `governs` in its allowed object-level relationship list
- whether any remaining `null` `memory_layer` interpretations need one more freeze pass
- whether `semantic-fact` classification should remain exactly as-is for freeze
