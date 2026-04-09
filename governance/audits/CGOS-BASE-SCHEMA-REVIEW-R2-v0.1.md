# CGOS-BASE-SCHEMA-REVIEW-R2-v0.1

## Purpose

This memo is the Round 2 minimality review for the 6 Coregentis base schemas.

Its purpose is narrower than Round 1:

- identify what is truly base-layer essential
- identify what is too heavy for the base layer
- specify exact patch actions

This memo covers only:

- `cognitive-object-envelope.schema.json`
- `temporal-record.schema.json`
- `lineage-record.schema.json`
- `governance-record.schema.json`
- `mutation-record.schema.json`
- `relation-record.schema.json`

## Global Minimality Decisions

### `schema_version`

- judgment: not base-layer essential as a required envelope field
- action: keep the field but make it optional and clarify that its exact governance interpretation is defined outside the base envelope

### `memory_layer`

- judgment: too heavy for the base envelope because not every first-class object is primarily a memory-placed object
- action: defer to object schemas

### `protocol_binding_ref` depth

- judgment: shallow linkage is base-layer appropriate, but detailed protocol schema/binding structure is not
- action: keep `binding_class`, `protocol_object_type`, `protocol_object_id`, and `reconstructable`; defer deeper binding detail such as protocol schema reference to the binding layer

### `drift_review_until`

- judgment: naming is too review-flavored and not aligned tightly enough to constitutional temporal language
- action: rename to `drift_horizon_until`

### Projection-facing vocabulary

- `product_projection`
  - judgment: too early for base lineage enums
  - action: defer to later projection-aware schemas or layers
- `projected`
  - judgment: too early for base derivation mode enum
  - action: defer
- `projects_as`
  - judgment: too early for base relation vocabulary during mother-runtime foundation
  - action: defer

### `current_revision` requirement

- judgment: useful field, but too heavy as a required base invariant for immutable objects
- action: keep the field, make it optional by removing it from required

### `x-coregentis-meta` normalization

- judgment: base schemas need a consistent metadata shape before object-schema expansion
- action: normalize to:
  - `schema_role`
  - `phase`
  - `version_stream`
  - `authority_order_preserved`
  - `governing_doc`

## Schema-by-Schema Minimality Review

### 1. `cognitive-object-envelope.schema.json`

#### Truly base-layer essential

- `object_id`
- `object_type`
- `authority_class`
- `primary_layer`
- `temporal`
- `mutation`
- `lineage`
- `governance`

#### Too heavy for base layer

- `memory_layer`
- deep binding detail inside `protocol_binding_ref`
- required `schema_version`

#### Field actions

- `schema_version`
  - action: keep, make optional, clarify meaning
- `memory_layer`
  - action: defer to object schemas
- `protocol_binding_ref.protocol_schema_ref`
  - action: defer to binding layer
- `x-coregentis-meta`
  - action: normalize

#### Exact patch action

- remove `memory_layer`
- remove `protocol_schema_ref`
- remove `schema_version` from required
- normalize metadata shape

### 2. `temporal-record.schema.json`

#### Truly base-layer essential

- `temporal_class`
- `cognition_time`
- optional event/validity/replay/rollback/retention/consolidation horizons

#### Too heavy for base layer

- no major structural overreach, but one field name is too implementation-flavored

#### Field actions

- `drift_review_until`
  - action: rename
- `x-coregentis-meta`
  - action: normalize

#### Exact patch action

- rename `drift_review_until` -> `drift_horizon_until`
- normalize metadata shape

### 3. `lineage-record.schema.json`

#### Truly base-layer essential

- `creation_source`
- `derivation_mode`
- `source_object_ids`
- `source_event_ids`
- `promoted_from_object_id`

#### Too heavy for base layer

- `product_projection` in `creation_source`
- `projected` in `derivation_mode`
- `imported_protocol_object_id`

#### Field actions

- `product_projection`
  - action: defer to projection-aware layer
- `projected`
  - action: defer
- `imported_protocol_object_id`
  - action: defer to binding layer
- `x-coregentis-meta`
  - action: normalize

#### Exact patch action

- remove `product_projection` enum value
- remove `projected` enum value
- remove `imported_protocol_object_id`
- normalize metadata shape

### 4. `governance-record.schema.json`

#### Truly base-layer essential

- `governance_scope`
- `locked`
- `review_required`
- `approval_state`
- `policy_refs`
- `authority_refs`
- `confirm_refs`

#### Too heavy for base layer

- `rollback_boundary_ref`
- `compensation_ref`

#### Field actions

- `rollback_boundary_ref`
  - action: defer to richer governance objects later
- `compensation_ref`
  - action: defer
- `x-coregentis-meta`
  - action: normalize

#### Exact patch action

- remove `rollback_boundary_ref`
- remove `compensation_ref`
- normalize metadata shape

### 5. `mutation-record.schema.json`

#### Truly base-layer essential

- `mutation_class`
- optional `current_revision`
- optional `last_mutated_at`

#### Too heavy for base layer

- required `current_revision`
- `promotion_required`
- `demotion_allowed`
- `mutation_policy_refs`

#### Field actions

- `current_revision`
  - action: keep, make optional
- `promotion_required`
  - action: defer to object/policy layer
- `demotion_allowed`
  - action: defer
- `mutation_policy_refs`
  - action: defer
- `x-coregentis-meta`
  - action: normalize

#### Exact patch action

- remove `current_revision` from required
- remove `promotion_required`
- remove `demotion_allowed`
- remove `mutation_policy_refs`
- normalize metadata shape

### 6. `relation-record.schema.json`

#### Truly base-layer essential

- `relation_id`
- `relation_type`
- `source_object_id`
- `target_object_id`
- optional `status`
- optional `evidence_refs`

#### Too heavy for base layer

- `projects_as`
- `relation_layer`

#### Field actions

- `projects_as`
  - action: defer to projection-aware relation vocabulary later
- `relation_layer`
  - action: defer
- `x-coregentis-meta`
  - action: normalize

#### Exact patch action

- remove `projects_as`
- remove `relation_layer`
- normalize metadata shape

## R2 Patch Summary

### Keep as-is

- envelope identity and authority backbone
- temporal core structure
- lineage source backbone
- governance scope and approval backbone
- mutation class
- relation backbone

### Make optional

- `schema_version`
- `current_revision`

### Rename

- `drift_review_until` -> `drift_horizon_until`

### Defer to object schemas

- `memory_layer`

### Defer to registry / binding layer

- deep `protocol_binding_ref` detail
- `imported_protocol_object_id`

### Defer to later projection-aware layers

- `product_projection`
- `projected`
- `projects_as`

## Round 3 Items Intentionally Left Open

The following are intentionally left for Round 3 consistency review instead of being over-patched now:

- whether `object_type` exception style needs more explicit machine-readable tagging
- whether governance scope values should be narrowed further for the first runtime stream
- whether string refs should converge on a typed shared reference pattern
- whether `relations`, `evidence_refs`, and `trace_refs` in the envelope should stay in the base layer or move outward

## Conclusion

The exact R2 patch should make the base layer:

- lighter
- less projection-contaminated
- less binding-heavy
- more consistent in metadata shape
- safer for later object-schema composition

without redesigning the mother-runtime architecture.
