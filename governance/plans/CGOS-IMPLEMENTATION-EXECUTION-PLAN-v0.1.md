# CGOS-IMPLEMENTATION-EXECUTION-PLAN-v0.1

## Document Control

- Document ID: `CGOS-IMPLEMENTATION-EXECUTION-PLAN-v0.1`
- Status: `Execution-Governance Plan Baseline`
- Authority: `Coregentis Pre-Execution Planning Output`
- Scope: `Schema-first and runtime-skeleton-first implementation sequencing for the first Coregentis execution batch`
- Phase Constraint: `This plan remains pre-implementation governance only and does not authorize TracePilot runtime implementation or product-first work`

## Sequence Verification

This plan preserves the required authority order:

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> TracePilot`

No phase below allows TracePilot, UI convenience, or helper-package convenience to define protocol law or Coregentis runtime law.

## Recommended Execution Order

### Phase 0 - Repo truth reading and normalization

#### Objective

Freeze the real implementation inputs, the reuse rules, and the boundary labels before any Coregentis implementation artifact is created.

#### Why this phase belongs here

The repo currently contains:

- strong constitutional docs
- strong MPLP protocol assets
- weak or missing Coregentis implementation assets
- package/test surfaces in MPLP that are partially stale, partial, or absent in checkout

Without normalization, the next phase will import the wrong truth.

#### Required inputs

- the 5 Coregentis mother architecture docs
- the 6 TracePilot projection/M0 docs
- MPLP `schemas/v2/`
- MPLP taxonomy and invariants
- MPLP tests, examples, and validator source

#### Expected outputs

- `imports/mplp-lock.yaml`
- a short source-of-truth manifest
- a terminology normalization note covering protocol-native, runtime-bound, Coregentis-private, product-projected, and derived objects

#### Required minimum fields for `imports/mplp-lock.yaml`

The lock file must include at least:

- `protocol_version`
- `schema_bundle_version`
- `source_repo`
- one of `commit_sha` or `tag`
- `imported_paths`
- `lock_created_at`

`imported_paths` must be an explicit allowlist of imported MPLP paths. It must not be a vague reference to the entire MPLP repository.

Minimum shape:

```yaml
protocol_version: "1.0.0"
schema_bundle_version: "2.0.0"
source_repo: "https://github.com/Coregentis/MPLP-Protocol.git"
commit_sha: "<pinned-commit-sha>" # or use immutable tag instead
imported_paths:
  - "schemas/v2/common/"
  - "schemas/v2/events/"
  - "schemas/v2/learning/"
  - "schemas/v2/mplp-context.schema.json"
  - "schemas/v2/mplp-plan.schema.json"
  - "schemas/v2/mplp-confirm.schema.json"
  - "schemas/v2/mplp-trace.schema.json"
  - "schemas/v2/taxonomy/kernel-duties.yaml"
  - "schemas/v2/taxonomy/module-event-matrix.yaml"
lock_created_at: "2026-04-08T00:00:00Z"
```

#### What explicitly waits

- runtime code
- profile code
- TracePilot runtime work

### Phase 1 - Core schema baseline

#### Objective

Create the first machine-readable Coregentis schema layer.

#### Why this phase belongs here

The runtime constitution requires typed first-class objects with explicit authority, temporal, mutation, and lineage semantics. Today those rules exist only in prose.

#### Required inputs

- Coregentis Runtime Constitution
- Coregentis Cognitive Object Registry baseline
- Coregentis MPLP Binding Spec
- MPLP common schemas
- MPLP Context/Plan/Confirm/Trace schemas

#### Expected outputs

- `schemas/coregentis/v0/base/cognitive-object-envelope.schema.json`
- `schemas/coregentis/v0/base/temporal-record.schema.json`
- `schemas/coregentis/v0/base/lineage-record.schema.json`
- `schemas/coregentis/v0/base/governance-record.schema.json`
- `schemas/coregentis/v0/base/mutation-record.schema.json`
- `schemas/coregentis/v0/base/relation-record.schema.json`
- first-batch object schemas under `schemas/coregentis/v0/objects/`

#### Coregentis schema naming rules

Coregentis schema files must use the following convention:

- directory roots:
  - `schemas/coregentis/v0/base/` for shared envelopes, records, and refs
  - `schemas/coregentis/v0/objects/` for first-class runtime object schemas
- filename pattern: lowercase kebab-case plus `.schema.json`
- canonical rule: registry object names are normalized into lowercase kebab-case schema filenames
- base/shared schema suffix rules:
  - shared records end with `-record.schema.json`
  - shared refs end with `-ref.schema.json`
  - envelopes end with `-envelope.schema.json` only where envelope is the canonical concept
- object schema rule: one first-class object per schema file
- forbidden naming:
  - CamelCase filenames
  - spaces
  - mixed object and projection naming in the same schema filename

Examples:

- `schemas/coregentis/v0/base/temporal-record.schema.json`
- `schemas/coregentis/v0/base/protocol-binding-ref.schema.json`
- `schemas/coregentis/v0/objects/working-state-node.schema.json`
- `schemas/coregentis/v0/objects/memory-promotion-record.schema.json`

#### What explicitly waits

- service logic
- orchestration
- projection DTOs

### Phase 2 - Object registry + binding implementation

#### Objective

Turn the Coregentis object/binding prose into machine-readable runtime law.

#### Why this phase belongs here

If registry and binding are not fixed before runtime work, the implementation will silently invent objects, hide authority, and lose protocol reconstructability.

#### Required inputs

- Phase 1 Coregentis schemas
- MPLP protocol schemas
- Coregentis Binding Spec
- Coregentis Object Registry baseline

#### Expected outputs

- `registry/coregentis-object-registry.v0.yaml`
- `registry/coregentis-relationship-rules.v0.yaml`
- `bindings/mplp-coregentis-binding-matrix.v0.yaml`
- `bindings/coregentis-export-rules.v0.yaml`

#### Required minimum fields for `registry/coregentis-object-registry.v0.yaml`

The registry file must be machine-readable and include at least:

- top-level fields:
  - `registry_version`
  - `protocol_version`
  - `runtime_line`
  - `objects`
- per-object minimum fields:
  - `object_name`
  - `object_family`
  - `authority_class`
  - `primary_layer`
  - `temporal_class`
  - `mutation_class`
  - `schema_ref`
  - `protocol_binding`
  - `allowed_relationship_types`
  - `lineage_requirements`
  - `placement_rules`
  - `implementation_tier`

Minimum shape:

```yaml
registry_version: "0.1"
protocol_version: "1.0.0"
runtime_line: "cgos-v0"
objects:
  - object_name: "Intent"
    object_family: "Entry"
    authority_class: "B"
    primary_layer: "Cognitive Runtime Core"
    temporal_class: "session-bounded"
    mutation_class: "stateful/mutable"
    schema_ref: "schemas/coregentis/v0/objects/intent.schema.json"
    protocol_binding: "runtime-bound"
    allowed_relationship_types: ["derived-from", "references", "evidences"]
    lineage_requirements: ["source_lineage", "protocol_binding"]
    placement_rules: ["working-memory", "episodic-memory"]
    implementation_tier: "first-batch"
```

#### Required minimum fields for `bindings/mplp-coregentis-binding-matrix.v0.yaml`

The binding matrix must be machine-readable and include at least:

- top-level fields:
  - `binding_version`
  - `protocol_version`
  - `runtime_line`
  - `bindings`
- per-binding minimum fields:
  - `mplp_concept`
  - `mplp_source_ref`
  - `coregentis_object`
  - `binding_class`
  - `direction`
  - `authority_boundary`
  - `import_rule`
  - `export_rule`
  - `reconstructability_rule`
  - `protocol_identity_preserved`
  - `projection_forbidden_as_authority`

Minimum shape:

```yaml
binding_version: "0.1"
protocol_version: "1.0.0"
runtime_line: "cgos-v0"
bindings:
  - mplp_concept: "Plan"
    mplp_source_ref: "schemas/v2/mplp-plan.schema.json"
    coregentis_object: "Intent"
    binding_class: "runtime-bound"
    direction: "import-export"
    authority_boundary: "protocol-remains-authoritative"
    import_rule: "import plan identity and retain protocol fields"
    export_rule: "reconstruct MPLP-valid plan artifact from bound runtime state"
    reconstructability_rule: "protocol plan identity and required fields must remain recoverable"
    protocol_identity_preserved: true
    projection_forbidden_as_authority: true
```

#### What explicitly waits

- runtime loop execution
- TracePilot profile realization

### Phase 3 - Minimal runtime skeleton

#### Objective

Build the smallest legitimate Coregentis runtime skeleton that can host the constitutional loop.

#### Why this phase belongs here

Once schemas and binding rules are fixed, runtime code can be written without object drift and without product leakage.

#### Required inputs

- Phase 1 schemas
- Phase 2 registry and binding matrix
- deterministic in-memory storage choice

#### Expected outputs

- runtime interfaces for registry, binding, memory, activation, policy, confirm, trace, reconcile, consolidation
- in-memory adapters for working, episodic, semantic, and evidence/event stores
- runtime orchestrator interface

#### What explicitly waits

- product-facing surfaces
- enterprise/multi-project features
- advanced learning packs

### Phase 4 - Minimal cognitive loop runnable path

#### Objective

Run `Form -> Place -> Activate -> Confirm -> Trace -> Reconcile -> Consolidate` end to end in a deterministic harness.

#### Why this phase belongs here

The architecture explicitly states that the minimal cognitive loop must anchor early implementation strategy. The system is not ready for projections until this loop exists.

#### Required inputs

- Phase 3 runtime skeleton
- test fixtures for fresh intent and requirement-change flows
- initial policy defaults

#### Expected outputs

- a CLI or test harness that executes the minimal loop
- emitted Coregentis objects across memory/evidence/governance layers
- export-preparation output plus bounded MPLP Confirm/Trace export with explicit omission of unsupported Context/Plan families
- end-to-end tests for fresh intent and delta intent change handling

#### What explicitly waits

- TracePilot runtime profile code
- TracePilot projection object implementation
- non-essential UI

### Phase 5 - TracePilot projection preconditions

#### Objective

Freeze what TracePilot may depend on from the mother runtime.

#### Why this phase belongs here

TracePilot must consume stabilized Coregentis runtime truth, not define it.

#### Required inputs

- passing Phase 4 runtime tests
- object registry
- binding matrix
- builder-oriented policy defaults
- TracePilot baseline and M0 docs

#### Expected outputs

- `tracepilot/runtime-profile-v0.md`
- `tracepilot/projection-object-contract-v0.md`
- scenario output DTO definitions for M0 validation

#### What explicitly waits

- product implementation beyond DTO/mock boundary
- any market-driven shortcut that changes mother runtime law

### Phase 6 - TracePilot-specific profile/surface work

#### Objective

Implement the first developer-facing projection on top of stabilized Coregentis runtime inputs.

#### Why this phase belongs here

Only at this point can TracePilot remain a projection instead of becoming an ad hoc runtime.

#### Required inputs

- Phase 5 projection contract
- scenario pack
- M0 success and death-path metrics model

#### Expected outputs

- projection-specific DTOs and product objects
- continuation/change/correction surfaces
- scenario-driven validation prototypes

#### What explicitly waits

- enterprise projections
- domain packs
- cross-tenant governance surfaces

## Minimal Core Schema First Batch

### Cross-cutting base schemas that must exist first

These are mandatory before object-specific schemas:

- `cognitive-object-envelope`
- `temporal-record`
- `lineage-record`
- `governance-record`
- `mutation-record`
- `relation-record`
- `protocol-binding-ref`
- `evidence-ref`

These are first because the constitutional baseline requires every major runtime object to declare identity, source lineage, temporal positioning, authority class, and layer association.

### First-batch object set

| Object name | Why it is first-class | Protocol-bound or Coregentis-private | Why first batch, not later |
|---|---|---|---|
| Project | runtime scope anchor for all single-project-first work | Coregentis-private | TracePilot depends on it immediately and all memory/policy/evidence need a host scope |
| External Input Record | preserves raw source material before interpretation | Coregentis-private | required for evidence-grade intake |
| Intent | governs what enters cognition | Runtime-bound | required for `Form` and continuity control |
| Delta Intent | represents governed change against existing intent state | Runtime-bound / private | required for requirement-change and drift scenarios |
| Working State Node | minimal working-memory object | Coregentis-private | required for `Place` without generic session blobs |
| Episode | minimal episodic memory and replay container | Coregentis-private | required for resumption and explanation |
| Semantic Fact | minimal long-term truth anchor | Runtime-bound / private | required for long-horizon continuity |
| Activation Signal | bounded activation request | Coregentis-private | required for governed activation |
| Action Unit | minimal bounded executable unit | Coregentis-private | required so activation has a typed target |
| Policy Rule | explicit runtime policy law | Coregentis-private | policy is constitutional, not optional |
| Confirm Gate | runtime-bound confirm object | Protocol-bound / runtime-bound | required to realize confirm semantics correctly |
| Trace Evidence | evidence-carrying trace object | Protocol-bound / runtime-bound | required for `Trace` and export reconstructability |
| Decision Record | records major runtime decisions | Coregentis-private | required for trust and inspectability |
| Drift Record | records divergence from prior expectation or truth | Coregentis-private | required for change handling |
| Conflict Case | typed conflict object | Coregentis-private | required for `Reconcile` |
| Memory Promotion Record | records governed promotion across memory layers | Coregentis-private | required to preserve layered memory law |
| Learning Candidate | minimal governed consolidation candidate | Coregentis-private | enough to close the first cognitive loop without overbuilding learning |

### Minimal relationship types

The first batch should support these relationship types only:

- `references`
- `contains`
- `derived-from`
- `promoted-from`
- `conflicts-with`
- `governs`
- `evidences`

`projects-as` should wait until TracePilot projection preconditions are frozen because it is projection-facing.

### Required first-class properties on every Coregentis object

- `object_id`
- `object_type`
- `authority_class`
- `primary_layer`
- `memory_layer`
- `project_id`
- `protocol_binding`
- `event_time`
- `cognition_time`
- `valid_from`
- `valid_until`
- `mutation_class`
- `status`
- `source_lineage`
- `policy_refs`
- `trace_refs`

## Minimal Runtime Skeleton Recommendation

### Smallest legitimate service set

The smallest Coregentis runtime that still respects the constitution should include:

- `RegistryService`
- `BindingService`
- `FormService`
- `MemoryService`
- `ActivationService`
- `PolicyService`
- `ConfirmService`
- `TraceService`
- `ReconcileService`
- `ConsolidationService`
- `RuntimeOrchestrator`

### Concrete role of each service

- `RegistryService`: validates object type, authority, and schema registration
- `BindingService`: imports MPLP artifacts and reconstructs exportable protocol artifacts
- `FormService`: turns raw input into `Intent` or `Delta Intent`
- `MemoryService`: places, recalls, promotes, and demotes working, episodic, and semantic objects
- `ActivationService`: turns intent into bounded activation and action objects
- `PolicyService`: applies policy rules, thresholds, and suppression logic
- `ConfirmService`: creates and resolves confirm gates
- `TraceService`: emits evidence, decision records, evidence chain links, and MPLP trace projections
- `ReconcileService`: detects drift/conflict and determines continue, branch, compensate, or escalate
- `ConsolidationService`: creates learning candidates and governs promotion into stable retained structures
- `RuntimeOrchestrator`: enforces loop order and prevents skipped stages

### Minimal state transitions

#### Core loop state

`received -> formed -> placed -> activated -> confirm_pending|confirm_bypassed -> confirmed|suppressed -> traced -> reconciled -> consolidated|deferred`

#### Object state examples

- `Intent`: `formed -> active -> resolved|superseded`
- `Activation Signal`: `proposed -> active|suppressed -> completed|failed`
- `Confirm Gate`: `not_required|pending -> approved|rejected|cancelled`
- `Conflict Case`: `open -> classified -> resolved|branched|escalated`
- `Learning Candidate`: `captured -> scored -> promoted|deferred|discarded`

### Minimal evidence emission

Each loop step must emit evidence:

- `Form`: intake evidence from raw source to intent
- `Place`: memory placement evidence
- `Activate`: activation proposal and policy outcome evidence
- `Confirm`: gate-required or gate-bypassed decision evidence
- `Trace`: execution evidence and trace linkage
- `Reconcile`: drift/conflict classification evidence
- `Consolidate`: promotion/defer/discard evidence

### Minimal object movement across layers

- raw input becomes `External Input Record`
- `External Input Record` produces `Intent` or `Delta Intent`
- `Intent` is placed into working memory and anchored into an `Episode`
- activation generates `Activation Signal` and `Action Unit`
- policy evaluation may produce `Confirm Gate`
- trace generates `Trace Evidence` and `Decision Record`
- reconcile may create `Drift Record` and `Conflict Case`
- consolidate may create `Memory Promotion Record` and `Learning Candidate`
- governed promotion may create `Semantic Fact`

### Minimal cognitive loop realization

#### Fresh intent path

1. ingest raw input
2. create `External Input Record`
3. form `Intent`
4. place `Intent` into working memory and create/update `Episode`
5. generate `Activation Signal` and `Action Unit`
6. evaluate policy, optionally create `Confirm Gate`
7. emit `Trace Evidence` and `Decision Record`
8. reconcile against existing semantic and episodic structures
9. create `Learning Candidate` and optional `Memory Promotion Record`

#### Requirement-change path

1. ingest changed input
2. create new `External Input Record`
3. form `Delta Intent`
4. relate `Delta Intent` to existing `Intent`, `Episode`, and `Semantic Fact`
5. create `Drift Record`
6. if contradictions exist, create `Conflict Case`
7. run bounded re-activation with policy/confirm gates
8. emit updated evidence and continuation recommendation
9. consolidate only after reconciliation succeeds

## TracePilot Readiness Boundary

### What must be finished before TracePilot runtime/profile work is meaningful

The following must exist first:

1. Coregentis base schema layer
2. machine-readable Coregentis object registry
3. machine-readable MPLP <-> Coregentis binding matrix
4. working/episodic/semantic memory abstractions
5. policy and confirm path
6. drift/conflict object path
7. trace/evidence path
8. runnable minimal cognitive loop harness
9. bounded MPLP Confirm/Trace export path with explicit Context/Plan omission and reconstruction only where currently supported

Without those, TracePilot runtime/profile work will be inventing mother-runtime semantics.

### What TracePilot work can safely start now

The following work is safe in parallel:

- scenario-instance design for M0
- interview operations and synthesis templates
- projection vocabulary work
- DTO mockups and output-contract design
- low-fidelity surface exploration that consumes declared runtime DTOs but does not define runtime semantics

### What TracePilot work is premature

- runtime profile code before Coregentis runtime skeleton exists
- projection cards or review widgets treated as authoritative object identities
- ad hoc project memory logic inside product code
- requirement-change handling implemented only in product space
- multi-project/team runtime behavior
- enterprise/governance surfaces

## Immediate 1-2 Week Next-Step Plan

### Week 1

1. Create the implementation root structure:
   - `imports/`
   - `schemas/coregentis/v0/base/`
   - `schemas/coregentis/v0/objects/`
   - `registry/`
   - `bindings/`
   - `runtime/`
   - `tests/fixtures/`
   - `tests/schema/`
   - `tests/runtime/`

2. Add `imports/mplp-lock.yaml` that pins:
   - `protocol_version: 1.0.0`
   - `schema_bundle_version: 2.0.0`
   - `source_repo`
   - one of `commit_sha` or `tag`
   - `imported_paths`
   - `lock_created_at`

3. Copy or sync the minimum required MPLP protocol artifacts into a controlled import surface.

4. Author:
   - `registry/coregentis-object-registry.v0.yaml`
   - `registry/coregentis-relationship-rules.v0.yaml`
   - `bindings/mplp-coregentis-binding-matrix.v0.yaml`

5. Author base schemas:
   - `cognitive-object-envelope.schema.json`
   - `temporal-record.schema.json`
   - `lineage-record.schema.json`
   - `governance-record.schema.json`
   - `mutation-record.schema.json`
   - `relation-record.schema.json`

6. Author first-batch object schemas:
   - `project.schema.json`
   - `external-input-record.schema.json`
   - `intent.schema.json`
   - `delta-intent.schema.json`
   - `working-state-node.schema.json`
   - `episode.schema.json`
   - `semantic-fact.schema.json`
   - `activation-signal.schema.json`
   - `action-unit.schema.json`
   - `policy-rule.schema.json`
   - `confirm-gate.schema.json`
   - `trace-evidence.schema.json`
   - `decision-record.schema.json`
   - `drift-record.schema.json`
   - `conflict-case.schema.json`
   - `memory-promotion-record.schema.json`
   - `learning-candidate.schema.json`

7. Add schema validation tests that verify:
   - required first-class properties exist
   - authority/layer/temporal/mutation metadata is present
   - protocol-bound objects retain reconstructable protocol identity

### Week 2

1. Choose TypeScript for the first pass unless a hidden constraint appears. This is the most reuse-compatible choice with current MPLP validator/tests/examples.

2. Build runtime interfaces under `runtime/core/`:
   - `registry-service.ts`
   - `binding-service.ts`
   - `form-service.ts`
   - `memory-service.ts`
   - `activation-service.ts`
   - `policy-service.ts`
   - `confirm-service.ts`
   - `trace-service.ts`
   - `reconcile-service.ts`
   - `consolidation-service.ts`
   - `runtime-orchestrator.ts`

3. Build in-memory adapters under `runtime/in-memory/`:
   - `working-store.ts`
   - `episodic-store.ts`
   - `semantic-store.ts`
   - `evidence-store.ts`

4. Create deterministic runtime fixtures:
   - `tests/fixtures/min-loop/fresh-intent/`
   - `tests/fixtures/min-loop/requirement-change-midflow/`

5. Implement the first runnable harness under `runtime/harness/` or `runtime/cli/` that executes:
   - one fresh intent path
   - one delta intent requirement-change path

6. Add runtime tests that assert:
   - working, episodic, semantic placement is distinct
   - policy and confirm are inspectable
   - trace/evidence is emitted
   - drift/conflict objects appear when change introduces tension
   - protocol export artifacts are reconstructable

7. Add one explicit anti-drift test:
   - no TracePilot projection object may appear in mother-runtime phases 1 to 4

## Phase Confirmation

This document remains a pre-implementation governance plan only.

It strengthens:

- file and schema naming discipline
- import lock rigor
- machine-readable registry requirements
- machine-readable binding requirements

It does not authorize:

- product feature implementation
- TracePilot runtime/profile implementation
- architectural redefinition of MPLP or Coregentis

## Final Control Rule

This execution plan is valid only if implementation follows this order:

`protocol import -> Coregentis schemas -> Coregentis registry -> Coregentis binding -> Coregentis runtime skeleton -> minimal cognitive loop -> TracePilot readiness -> TracePilot projection work`

If execution pressure attempts to skip any of the bolded middle layers, implementation should pause and treat that as architectural drift, not acceleration.
