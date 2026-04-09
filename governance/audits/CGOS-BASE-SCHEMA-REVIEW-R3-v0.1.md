# CGOS-BASE-SCHEMA-REVIEW-R3-v0.1

## Purpose

This memo is the Round 3 consistency review and freeze-readiness check for the 6 Coregentis base schemas.

This round does not revisit architecture or add new semantic scope.
It answers one narrower question:

Are the 6 base schemas now consistent enough to freeze as one coherent base-schema family and allow object-schema implementation to begin next?

## 1. Naming Consistency

### 1.1 File naming

#### Current state

All six schema files use:

- lowercase
- kebab-case
- `<semantic-name>.schema.json`

#### Consistency judgment

Consistent.

#### Freeze recommendation

Freeze as-is.

#### Patch action

None.

### 1.2 Field naming

#### Current state

Cross-file fields use snake_case consistently.

#### Consistency judgment

Consistent.

#### Freeze recommendation

Freeze snake_case as the base-field default.

#### Patch action

None.

### 1.3 Enum naming

#### Current state

Enum values across the six schemas use lowercase snake_case.

#### Consistency judgment

Consistent.

#### Freeze recommendation

Freeze as-is.

#### Patch action

None.

### 1.4 `object_type` kebab-case exception handling

#### Current state

`object_type` in the envelope uses a kebab-case pattern while enums use snake_case.

#### Consistency judgment

Acceptable and intentional.

#### Freeze recommendation

Freeze `object_type` as a governed kebab-case exception because it is an identifier-style field, not an enum symbol.

#### Patch action

No schema patch required.
Governance baseline already carries the exception rule.

## 2. Version Consistency

### 2.1 Path version

#### Current state

All base schemas live under `/schemas/coregentis/v0/base/`.

#### Consistency judgment

Consistent.

#### Freeze recommendation

Freeze `v0` as the base-schema stream namespace.

#### Patch action

None.

### 2.2 `$id` version

#### Current state

All `$id` values use `/cgos/v0/base/...`.

#### Consistency judgment

Consistent with path version.

#### Freeze recommendation

Freeze `$id` versioning at stream version only, not markdown revision version.

#### Patch action

None.

### 2.3 `schema_version` interpretation

#### Current state

`schema_version` exists only in the envelope and is optional.

#### Consistency judgment

Acceptable if interpreted as stream compatibility rather than document revision.

#### Freeze recommendation

Freeze the field as optional and treat it as a schema stream compatibility marker only.

#### Patch action

Governance baseline patched to define this explicitly.
No further schema patch required.

### 2.4 `x-coregentis-meta.version_stream`

#### Current state

All six schemas now carry `version_stream: "v0"`.

#### Consistency judgment

Consistent.

#### Freeze recommendation

Freeze as required base metadata.

#### Patch action

None.

## 3. Metadata Consistency

### Current state

All six schemas now carry the same `x-coregentis-meta` keys:

- `schema_role`
- `phase`
- `version_stream`
- `authority_order_preserved`
- `governing_doc`

#### Consistency judgment

Consistent.

#### Freeze recommendation

Freeze this metadata shape as the required `v0` base-schema metadata contract.

#### Patch action

None.

## 4. Reference Consistency

### Current state

The schemas use plain string refs in places such as:

- policy refs
- authority refs
- confirm refs
- artifact refs

No shared typed ref schema has been introduced yet.

### Consistency judgment

Acceptable for `v0`.

### Freeze recommendation

Freeze plain string refs as acceptable in the base layer for `v0`.
Do not introduce a typed shared ref pattern now.

### Exact patch action

Governance baseline patched to make this explicit.
No schema patch required.

## 5. Envelope Boundary Consistency

### Current state

Before Round 3, the envelope still carried:

- `relations`
- `evidence_refs`
- `trace_refs`

Those fields were optional, but they widened the envelope beyond the minimum identity/governance/composition role.

### Consistency judgment

Too broad for a frozen `v0` base envelope.

### Freeze recommendation

The base envelope should remain limited to:

- identity
- authority
- primary layer
- shallow protocol binding linkage
- temporal record
- mutation record
- lineage record
- governance record

Generic relation/evidence/trace collections should not remain default envelope fields.

### Exact patch action

Remove:

- `relations`
- `evidence_refs`
- `trace_refs`

Patch applied.

## 6. Governance Scope Consistency

### Current state

`governance_scope` currently allows:

- `global_runtime`
- `tenant`
- `organization`
- `project`
- `role`
- `session`
- `object`

### Consistency judgment

Acceptable for `v0`.

The enum is broader than the immediate single-project implementation focus, but it remains constitutionally aligned and does not force implementation of all scopes now.

### Freeze recommendation

Freeze as-is.

### Exact patch action

No schema patch required.
Governance baseline patched to clarify that accepted enum breadth does not equal immediate implementation commitment.

## 7. Schema-by-Schema Freeze Readiness

### `cognitive-object-envelope.schema.json`

- freeze judgment: ready after envelope-boundary tightening
- final stance:
  - keep identity, authority, primary layer, status, shallow binding, and composition refs
  - keep optional `schema_version`
  - freeze without generic relation/evidence/trace collections

### `temporal-record.schema.json`

- freeze judgment: ready
- final stance:
  - keep as current
  - `drift_horizon_until` naming is now constitutionally aligned enough for `v0`

### `lineage-record.schema.json`

- freeze judgment: ready
- final stance:
  - keep as current
  - projection leakage has already been removed

### `governance-record.schema.json`

- freeze judgment: ready
- final stance:
  - keep as current
  - current scope breadth is acceptable for the stream

### `mutation-record.schema.json`

- freeze judgment: ready
- final stance:
  - keep as current
  - required mutation semantics are minimal enough now

### `relation-record.schema.json`

- freeze judgment: ready
- final stance:
  - keep as current
  - projection-facing relation leakage has already been removed

## 8. Exact Round 3 Patch Summary

### Schema patch

Applied to the envelope only:

- removed `relations`
- removed `evidence_refs`
- removed `trace_refs`

### Governance patch

Applied to the schema governance baseline:

- formalized `schema_version` interpretation
- formalized `v0` plain string ref acceptability
- formalized the `v0` envelope boundary rule
- formalized governance-scope acceptance for `v0`

### README patch

Applied to the base README:

- added note that generic relation/evidence/trace collections are intentionally deferred out of the base envelope

## 9. What Is Now Frozen in the Base Layer

The following are now considered frozen for the `v0` base-schema family:

- file naming convention
- field naming convention
- enum naming convention
- `object_type` kebab-case exception
- JSON Schema Draft-07 dialect
- `$id` stream versioning on `v0`
- normalized `x-coregentis-meta` shape
- optional `schema_version` interpretation
- plain string ref acceptability in the base layer for `v0`
- governance scope enum breadth
- envelope boundary limited to identity, authority, shallow binding, and compositional record refs

## 10. Issues Intentionally Deferred Beyond R3

1. A shared typed ref schema or ref-envelope pattern.
2. Whether some governance-scope values become narrower in a later implementation profile.
3. Whether `status` eventually becomes a shared constrained status vocabulary or remains object-narrowed later.
4. Object-specific relation, evidence, and trace collection structures.

## 11. Freeze Readiness Decision

Decision:

The base schema layer is now ready to freeze for the `v0` mother-runtime foundation stream.

That means:

- no further semantic expansion should occur in the base layer before object-schema work starts
- object-schema implementation may proceed next, provided it composes from these frozen base schemas rather than re-defining cross-cutting semantics
