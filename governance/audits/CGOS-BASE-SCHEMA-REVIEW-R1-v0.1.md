# CGOS-BASE-SCHEMA-REVIEW-R1-v0.1

## Review Scope

This review covers only these 6 schemas:

- `cognitive-object-envelope.schema.json`
- `temporal-record.schema.json`
- `lineage-record.schema.json`
- `governance-record.schema.json`
- `mutation-record.schema.json`
- `relation-record.schema.json`

This review does not create object schemas, registry files, binding files, runtime files, or TracePilot files.

## Round 1 Focus

This is a Round 1 completeness review with targeted early consistency and minimality observations.

The main question is:

Do the current base schemas cover the constitutional cross-cutting concerns needed before object schemas exist?

## Schema-by-Schema Review

### 1. `cognitive-object-envelope.schema.json`

#### Constitutional role served

This schema is the mother base envelope for first-class Coregentis objects.
It carries the constitutional minimum for:

- identity
- authority class
- primary layer
- linkage to temporal, mutation, lineage, governance, and relation semantics

#### What is correct and should stay

- `object_id` and `object_type` are correctly first-class at the envelope layer.
- `authority_class` is correctly first-class at the envelope layer.
- `primary_layer` is correctly first-class at the envelope layer.
- composition into `temporal`, `mutation`, `lineage`, and `governance` is the right structural move.
- `additionalProperties: false` is correct for a governed base layer.

#### What appears too heavy for base layer

- `protocol_binding_ref` is useful, but parts of its shape may belong more properly to binding artifacts than to the base envelope.
- `relations`, `evidence_refs`, and `trace_refs` may be too opinionated for the absolute minimum envelope and may become repetitive when object schemas mature.
- `memory_layer` in the envelope may over-assume that every first-class object has a memory placement dimension.

#### What may be deferred to object / registry / binding layers

- protocol reconstruction detail inside `protocol_binding_ref`
- object-specific evidence and trace linking patterns
- precise memory placement rules

#### Naming consistency issues

- `object_type` uses kebab-case while most enums use snake_case. This is acceptable if explicitly governed, but it must be documented as an intentional exception.

#### Versioning or `$id` consistency issues

- `$id` uses `/v0/`, which is acceptable if path version means stream version.
- metadata does not yet declare `schema_role` or `version_stream`, which should be normalized later.

#### Field-level concerns

- `schema_version` is ambiguous: it could mean schema document revision, schema stream version, or object-carried schema version.
- `protocol_binding_ref.protocol_object_id` is only typed as generic string, which is probably right for now, but should be clarified as binding-layer subject.

#### Recommended action

- `keep`: identity, authority, primary layer, compositional refs
- `simplify`: envelope-level evidence/trace/relation assumptions in a later pass
- `defer`: detailed protocol binding semantics
- `clarify`: `schema_version`, `memory_layer`, exception styling for `object_type`

### 2. `temporal-record.schema.json`

#### Constitutional role served

This schema realizes temporal integrity requirements from the Runtime Constitution:

- cognition time
- event time
- validity window
- replay horizon
- rollback horizon
- drift horizon
- retention horizon
- consolidation timing

#### What is correct and should stay

- separating temporal semantics into its own record is correct.
- requiring `temporal_class` and `cognition_time` is a sound minimal choice.
- carrying multiple optional horizon fields is constitutionally aligned.

#### What appears too heavy for base layer

- the number of horizon-specific fields may be slightly heavy for a first-pass base record if downstream objects will not use many of them immediately.

#### What may be deferred to object / registry / binding layers

- object-specific mandatory horizon rules
- temporal-policy interpretation

#### Naming consistency issues

- `drift_review_until` is semantically close to the constitution's `drift horizon` language, but the name adds a review-specific gloss not present in the constitutional vocabulary.

#### Versioning or `$id` consistency issues

- `$id` style is consistent with the other base files.
- metadata is still lighter than the governance baseline will now require.

#### Field-level concerns

- `event_time` is optional, which is correct for runtime-derived objects.
- `drift_review_until` likely should be renamed later to something closer to `drift_until` or `drift_horizon_until`.

#### Recommended action

- `keep`: separate temporal record and optional horizon structure
- `rename`: `drift_review_until`
- `clarify`: which horizons are cross-cutting optional vs object-specific required

### 3. `lineage-record.schema.json`

#### Constitutional role served

This schema realizes the lineage-preservation requirement:

- creation source
- derivation mode
- source object lineage
- source event lineage
- promotion lineage
- protocol import lineage

#### What is correct and should stay

- `creation_source` and `derivation_mode` are correct and necessary.
- `source_object_ids` and `source_event_ids` are correct base-layer lineage carriers.
- `promoted_from_object_id` is correctly separated from generic derivation.

#### What appears too heavy for base layer

- `product_projection` and `projected` appear in the base lineage enums before any projection-phase schema work has started.
- `source_artifact_refs` plus `imported_protocol_object_id` may overlap with binding-layer specificity.

#### What may be deferred to object / registry / binding layers

- projection-specific lineage vocabulary
- import-specific protocol linkage details
- richer artifact reference typing

#### Naming consistency issues

- enum style is consistent internally.
- conceptually, `product_projection` is valid architecture-wide, but it is early for this phase and risks projection leakage into the base layer.

#### Versioning or `$id` consistency issues

- same normalization issue as the other base schemas: metadata is structurally lighter than the governance baseline now requires.

#### Field-level concerns

- `parent_object_id` is underspecified: parent in what sense, structural or causal?
- `imported_protocol_object_id` may duplicate a future binding-layer field.

#### Recommended action

- `keep`: creation and derivation backbone
- `simplify`: generic parent semantics
- `defer`: projection-specific and import-detail fields
- `clarify`: distinction between parent, source object, and promoted-from semantics

### 4. `governance-record.schema.json`

#### Constitutional role served

This schema realizes explicit governance and inspectability requirements:

- governance scope
- lock state
- review requirement
- approval state
- policy refs
- authority refs
- confirm refs
- rollback / compensation references

#### What is correct and should stay

- governance is correctly separated into its own cross-cutting record.
- `governance_scope` is correctly required.
- `approval_state` is useful and constitutionally aligned.
- policy and authority refs are appropriate base-layer anchors.

#### What appears too heavy for base layer

- `tenant` and `organization` scope values may be slightly ahead of the current single-project-first implementation phase, though constitutionally valid.
- `rollback_boundary_ref` and `compensation_ref` may be premature as mandatory governance vocabulary at the base layer.

#### What may be deferred to object / registry / binding layers

- strong organization-runtime scope semantics
- compensation plan and rollback boundary typing

#### Naming consistency issues

- naming is internally consistent.
- `approval_state` is a good generic term and should stay.

#### Versioning or `$id` consistency issues

- same metadata normalization issue as the other files.

#### Field-level concerns

- refs are plain strings, which is acceptable for now, but should later normalize around a typed identifier-or-reference convention.
- `governance_scope` may need later distinction between runtime scope and policy application scope.

#### Recommended action

- `keep`: governance scope, lock/review/approval fields, policy/authority/confirm refs
- `defer`: more advanced rollback/compensation detail
- `clarify`: string ref convention

### 5. `mutation-record.schema.json`

#### Constitutional role served

This schema realizes mutation-governance requirements:

- mutation class
- revision state
- mutation timing
- promotion and demotion control hooks

#### What is correct and should stay

- `mutation_class` is correctly first-class.
- `current_revision` is useful and minimal.
- `last_mutated_at` is useful and light.

#### What appears too heavy for base layer

- `promotion_required` and `demotion_allowed` may be closer to policy/runtime behavior than pure base mutation semantics.
- `mutation_policy_refs` may overlap with governance-layer references.

#### What may be deferred to object / registry / binding layers

- policy-driven promotion and demotion behavior
- object-specific revision semantics

#### Naming consistency issues

- naming is internally consistent.

#### Versioning or `$id` consistency issues

- same metadata normalization issue as other files.

#### Field-level concerns

- requiring `current_revision` in the base record may be heavier than necessary for some immutable objects.
- the schema does not currently distinguish creation revision from mutable revision semantics.

#### Recommended action

- `keep`: mutation class and last mutation timestamp
- `simplify`: base requirement around `current_revision`
- `defer`: promotion/demotion policy hooks
- `clarify`: whether immutable objects really need revision counters in the base layer

### 6. `relation-record.schema.json`

#### Constitutional role served

This schema realizes explicit relationship semantics:

- relation identity
- relation type
- source and target object identity
- supporting evidence

#### What is correct and should stay

- making relations first-class is correct.
- `relation_id`, `relation_type`, `source_object_id`, and `target_object_id` are the correct minimum backbone.
- status and evidence refs are useful extensions.

#### What appears too heavy for base layer

- `projects_as` introduces projection-layer vocabulary into the base relation type list during a pre-object, pre-projection phase.
- `relation_layer` may be useful later, but it may be heavier than necessary for the minimum base relation contract.

#### What may be deferred to object / registry / binding layers

- projection-facing relation types
- more specialized relation-layer semantics

#### Naming consistency issues

- relation enum values use snake_case, which is consistent with internal enum style.
- `projects_as` is naming-consistent but phase-inconsistent.

#### Versioning or `$id` consistency issues

- same metadata normalization issue as the other files.

#### Field-level concerns

- `created_at` is optional, which is fine.
- `status` may be helpful, but relation lifecycle semantics should not overgrow before object schemas exist.

#### Recommended action

- `keep`: relation backbone and evidence refs
- `defer`: `projects_as`
- `clarify`: whether `relation_layer` is necessary at base layer

## Top 10 Review Findings

1. The base layer is directionally correct and constitutionally aligned, but the envelope is carrying some semantics that may belong later to binding or object layers.
2. `schema_version` in the envelope is underdefined and needs a formal interpretation rule before object schemas compose from it.
3. `$id` versioning is consistent enough if `v0` is treated as stream version, but that rule must now be frozen explicitly.
4. `x-coregentis-meta` exists everywhere, which is good, but its shape is inconsistent and should be normalized before expansion.
5. `memory_layer` in the envelope may be too broad for all first-class objects and should be clarified before object schemas rely on it.
6. `protocol_binding_ref` is useful but should remain shallow; binding detail belongs in the future binding matrix, not in the base envelope.
7. `drift_review_until` in the temporal record should be renamed to align more cleanly with constitutional time vocabulary.
8. `product_projection`, `projected`, and `projects_as` introduce projection-facing vocabulary too early in the base layer and should likely be deferred or at least explicitly flagged.
9. `current_revision` as required in the mutation record may be too heavy for truly immutable objects.
10. Plain string refs across governance and evidence fields are acceptable for now, but a typed ref convention should be defined before object/registry expansion.

## Overall R1 Assessment

### What is already good enough

- the six schemas cover the required constitutional cross-cutting concerns
- the separation of concerns is sound
- the files are parse-valid and structurally composable

### What should happen before object schemas

- freeze governance rules for naming, versioning, metadata, and composition
- accept or revise the early projection-facing vocabulary in base enums
- clarify the boundary between base-layer semantics and future binding-layer detail

### Recommended next review posture

Proceed to a focused minimality and consistency pass before object-schema implementation begins.
