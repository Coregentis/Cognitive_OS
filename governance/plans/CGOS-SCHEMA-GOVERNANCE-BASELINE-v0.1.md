# CGOS-SCHEMA-GOVERNANCE-BASELINE-v0.1

## Purpose

This document freezes the schema-governance baseline for the first Coregentis mother-runtime implementation phase.

It exists to stabilize the schema layer before work proceeds into:

- object schemas
- machine-readable object registry
- MPLP <-> Coregentis binding matrix
- runtime skeleton interfaces

This baseline preserves the authority order:

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> TracePilot`

## 1. Base Schema Role vs Object Schema Role

### Base schema role

Base schemas define cross-cutting runtime semantics that multiple Coregentis objects must share.

They exist to carry:

- identity structure
- authority structure
- primary layer semantics
- temporal semantics
- mutation semantics
- lineage semantics
- governance references
- relationship semantics

Base schemas are compositional foundations. They are not domain objects.

### Object schema role

Object schemas define first-class Coregentis runtime objects such as:

- Intent
- Delta Intent
- Working State Node
- Episode
- Semantic Fact
- Activation Signal
- Confirm Gate
- Trace Evidence

Object schemas must compose from base schemas rather than re-invent their own cross-cutting semantics.

### Governance rule

If a field expresses a reusable cross-cutting semantic, it belongs in a base schema.
If a field expresses the specific meaning of a runtime object, it belongs in an object schema.

## 2. Naming Convention

### 2.1 Base schema naming

Pattern:

`<semantic-name>.schema.json`

Style:

- lowercase
- kebab-case
- singular semantic noun phrase

Examples:

- `cognitive-object-envelope.schema.json`
- `temporal-record.schema.json`
- `lineage-record.schema.json`

### 2.2 Object schema naming

Pattern:

`<object-name>.schema.json`

Style:

- lowercase
- kebab-case
- singular object name

Examples:

- `intent.schema.json`
- `delta-intent.schema.json`
- `semantic-fact.schema.json`

### 2.3 Registry naming

Registry files must use:

- lowercase
- kebab-case
- explicit artifact role
- machine-readable extension that matches actual content

Examples:

- `coregentis-object-registry.v0.yaml`
- `coregentis-relationship-rules.v0.yaml`

### 2.4 Binding naming

Binding files must use:

- lowercase
- kebab-case
- explicit upstream/downstream scope

Examples:

- `mplp-coregentis-binding-matrix.v0.yaml`
- `coregentis-export-rules.v0.yaml`

## 3. Versioning Convention

### 3.1 Path version rule

Path version is the implementation stream version.

Example:

- `/schemas/coregentis/v0/base/`

Interpretation:

- `v0` means pre-freeze implementation stream
- `v0` is intentionally broad and may hold multiple governance review rounds before a stable `v1`

### 3.2 Document version rule

Document version expresses governance-review maturity for the markdown artifact.

Example:

- `CGOS-SCHEMA-GOVERNANCE-BASELINE-v0.1.md`

Interpretation:

- `v0.1` means first governed review baseline inside the broader `v0` implementation stream

### 3.3 Schema `$id` version rule

Schema `$id` must use the path stream version, not the markdown document revision version.

Example:

- `https://schemas.coregentis.dev/cgos/v0/base/temporal-record.schema.json`

Interpretation:

- `$id` tracks the machine-readable namespace stream
- governance revision belongs in metadata, not in the `$id` path

### 3.4 How `v0` vs `v0.1` should be interpreted

- `v0` = implementation namespace stream
- `v0.1` = governance/document revision within that stream

Rule:

Do not encode `v0.1` directly into schema file paths or `$id` paths during this phase.
Do encode `v0.1` in governance docs and review artifacts.

### 3.5 `schema_version` interpretation rule

If `schema_version` appears in a Coregentis object envelope during the `v0` stream:

- it is optional
- it refers to machine-readable schema stream compatibility
- it does not replace path version
- it does not encode markdown governance revision

## 4. Schema Dialect Rule

The Coregentis base and early object schemas must use:

- JSON Schema Draft-07

Reason:

- it aligns with imported MPLP schema dialect
- it minimizes unnecessary cross-dialect complexity during the mother-runtime foundation phase

Rule:

Do not introduce a newer schema dialect unless there is a concrete blocker in the imported MPLP alignment path.

## 5. Enum Naming / Style Rule

### Rule

Coregentis internal enum values must use:

- lowercase
- snake_case

Examples:

- `runtime_bound`
- `cognitive_runtime_core`
- `immutable_after_creation`

### Exception rule

String identifiers that are not enum symbols may use other controlled styles when semantically appropriate:

- `object_type`: kebab-case
- filenames: kebab-case
- markdown governance docs: uppercase project prefix pattern

### Why

This keeps internal symbolic vocabularies visually stable and distinguishable from filenames and object-type identifiers.

## 6. Required Metadata Rule

Every Coregentis schema in this phase must include:

- `$schema`
- `$id`
- `title`
- `description`
- `type`
- `additionalProperties`
- `x-coregentis-meta`

### `x-coregentis-meta` minimum shape

Required keys for future normalization:

- `schema_role`
- `phase`
- `version_stream`

Recommended keys:

- `authority_order_preserved`
- `governing_doc`

Rule:

Base schemas created before this governance baseline may be slightly inconsistent, but downstream schema work must normalize to this metadata contract before expansion continues.

## 7. Ref / Composition Rule

### Base-layer rule

Base schemas may reference:

- local `$defs`
- sibling base schemas

Base schemas must not reference:

- object schemas
- registry files
- binding files
- product projection schemas

### V0 reference shape rule

Plain string references remain acceptable in the `v0` base layer for:

- policy refs
- authority refs
- confirm refs
- evidence refs
- artifact refs

Rule:

Do not introduce a shared typed reference pattern into the base layer during `v0` unless a concrete ambiguity blocks object-schema composition.
Typed reference normalization is deferred to post-freeze registry or object-layer work.

### Object-layer rule

Object schemas should compose from base schemas using:

- `allOf` for structural composition when appropriate
- direct property `$ref` for contained records when more readable

### Non-shadowing rule

Object schemas must not silently redefine the meaning of fields already established by the base layer.

If a field needs stricter constraints later, the object schema may narrow the value domain, but may not invert the base semantic.

## 8. Envelope Boundary Rule

For the `v0` base-layer freeze, the cognitive object envelope must remain limited to:

- identity
- authority
- primary layer
- optional shallow protocol binding linkage
- temporal record
- mutation record
- lineage record
- governance record

The envelope must not carry generic relation collections, evidence collections, or trace collections by default.
Those belong in object schemas unless later freeze review proves they are universally cross-cutting.

## 9. Governance Scope Rule

The current `governance_scope` enum is accepted for the `v0` freeze as:

- `global_runtime`
- `tenant`
- `organization`
- `project`
- `role`
- `session`
- `object`

Rule:

This enum is accepted as a constitutional compatibility surface, not as a commitment to implement all those scopes in the current phase.
No narrowing patch is required for `v0`.

## 10. Review-Cycle Rule

Schema progression must pass three review rounds before object-schema expansion is considered stable enough.

### Round 1: Completeness review

Question:

Does the base layer cover all constitutional cross-cutting concerns required before object schemas exist?

Check:

- identity
- authority
- layer
- temporal
- mutation
- lineage
- governance
- relation

### Round 2: Minimality review

Question:

Has the base layer become too heavy or too object-specific?

Check:

- fields that belong in object schemas instead
- fields that belong in registry/binding instead
- product/projection leakage

### Round 3: Consistency review

Question:

Are naming, versioning, enum style, metadata shape, and `$id` discipline consistent across the base layer?

Check:

- naming style
- `$id` path discipline
- metadata consistency
- enum style consistency
- composition style consistency

## 11. Non-Goals

This schema-governance phase does not implement:

- product-first schema structures
- TracePilot projection objects
- TracePilot runtime/profile semantics
- helper-surface-driven naming drift from package README surfaces
- runtime services
- object registry content
- binding matrix content

## 12. Immediate Governance Implications

Before object schema work starts:

1. the existing 6 base schemas must be reviewed against this baseline
2. any heavy or misplaced semantics must be identified
3. naming/versioning inconsistencies must be called out explicitly

Only after that review is accepted should object-schema implementation proceed.
