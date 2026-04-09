# CGOS-ASSET-INVENTORY-AND-GAP-ANALYSIS-v0.1

## Document Control

- Document ID: `CGOS-ASSET-INVENTORY-AND-GAP-ANALYSIS-v0.1`
- Status: `Execution-Governance Baseline`
- Authority: `Coregentis Pre-Execution Research Output`
- Scope: `Asset inventory, reuse classification, gap analysis, and architectural risk control for pre-implementation governance only`
- Phase Constraint: `This document does not authorize product implementation, TracePilot runtime implementation, or runtime shortcutting`

## Executive Summary

### What the docs say

The Coregentis architecture baseline is already materially frozen at the constitutional level:

- `MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> TracePilot`
- Coregentis is the mother runtime and governance substrate, not a product
- implementation must proceed schema-first, object-first, binding-first, and runtime-skeleton-first
- TracePilot is a projection and must not define runtime law

### What the repo actually has

The current `Cognitive_OS` workspace is documentation-only. It contains the required Coregentis and TracePilot markdown baselines, but no runtime code, no Coregentis schemas, no object registry implementation, no binding matrix implementation, no tests, and no governance output structure beyond the source docs.

The real reusable implementation substrate currently exists in the MPLP repository:

- frozen protocol schemas under `schemas/v2/`
- frozen taxonomy and invariant YAML under `schemas/v2/taxonomy/` and `schemas/v2/invariants/`
- golden flow fixtures under `tests/golden/flows/`
- a validator source package under `packages/sources/validator/`
- learning examples and protocol fixtures under `examples/`

### What is inferred as the correct next step

The next correct stage is not product coding. The next correct stage is to turn the Coregentis constitutional baseline into machine-readable and testable implementation truth:

1. define Coregentis base schemas
2. define the machine-readable Coregentis object registry
3. define the machine-readable MPLP <-> Coregentis binding matrix
4. build the smallest legitimate Coregentis runtime skeleton
5. run the minimal cognitive loop in a deterministic harness
6. only then define the TracePilot runtime/profile boundary

### Top priorities

1. Replace Coregentis markdown-only object and binding truth with machine-readable artifacts.
2. Build an in-memory minimal runtime around `Form -> Place -> Activate -> Confirm -> Trace -> Reconcile -> Consolidate`.
3. Reuse MPLP protocol schemas as imported protocol SSOT instead of re-stating them inside Coregentis.

### Top things not to do yet

1. Do not build TracePilot UI, cards, or workflow surfaces as if they are runtime truth.
2. Do not implement a generic memory blob and call it Cognitive OS.
3. Do not treat MPLP helper/runtime package naming as Coregentis constitutional implementation SSOT.

## What Is Already Frozen / Non-Negotiable

### Protocol truths

#### What the docs say

- MPLP is protocol constitution, not runtime, not framework, not platform.
- MPLP repository truth is authoritative for protocol definitions, schema truth, invariant truth, and governance records.
- MPLP L3 runtime remains non-prescriptive, so runtime realization belongs downstream of protocol.

#### What the repo actually has

- frozen module schemas for Context, Plan, Confirm, Trace, Role, Dialog, Collab, Extension, Core, Network
- frozen common schemas for metadata, identifiers, trace base, events, learning sample
- frozen taxonomy for event families, module-event mapping, learning taxonomy, and kernel duties
- frozen examples and golden flow fixtures

#### Non-negotiable implication

Coregentis may import and bind MPLP semantics, but may not quietly rewrite protocol meaning or require Coregentis-private machinery for MPLP compatibility.

### Runtime truths

#### What the docs say

- Coregentis is the mother runtime and governance substrate built on MPLP.
- Coregentis runtime must be grounded in typed first-class cognitive objects.
- time, memory layers, activation, conflict, learning, policy, and evidence are constitutional runtime concerns.
- working, episodic, and semantic memory must remain distinct.
- major runtime decisions must remain evidence-recoverable.

#### What the repo actually has

- these truths exist only in the Coregentis markdown baselines
- there is no Coregentis schema tree
- there is no machine-readable object registry
- there is no machine-readable binding matrix
- there is no Coregentis runtime implementation

#### Non-negotiable implication

Implementation cannot legally start from ad hoc classes, UI objects, or chat-thread history. It must start from typed runtime objects with authority, temporal, mutation, and lineage semantics.

### Projection truths

#### What the docs say

- product projections are profiled surfaces of the mother runtime
- TracePilot is the first developer-facing, single-project-first projection
- product projections may simplify exposure, defaults, and workflow packaging, but may not redefine protocol law or runtime constitutional law

#### What the repo actually has

- TracePilot has a strong projection and M0 validation baseline in docs
- there is no TracePilot code
- there is no TracePilot runtime profile implementation
- there are no projection DTOs or projection object contracts

#### Non-negotiable implication

TracePilot must consume Coregentis runtime truth. It must not become the place where runtime truth is invented.

## Repository / Asset Inventory

### 1. Current `Cognitive_OS` workspace

#### What exists

- `OS_core_file/` with the 5 Coregentis constitutional baseline documents
- `Tracepilot_Core/` with the 6 TracePilot projection and M0 validation documents

#### Reuse assessment

- reusable as constitutional SSOT for Coregentis and TracePilot planning
- not reusable as implementation artifacts because they are prose only

#### Quality / maturity

- strong architectural clarity
- zero machine-readable realization

### 2. Current MPLP workspace

#### What exists

- root protocol repo with frozen protocol baseline
- `schemas/v2/` with JSON schemas, invariants, taxonomy, learning schemas, and examples
- `tests/` with golden flows, runtime-compat tests, and schema-alignment tests
- `examples/` with protocol usage examples and learning samples
- `packages/sources/validator/` with validator source code
- package manifests for `@mplp/schema`, `@mplp/core`, `@mplp/sdk-ts`, `@mplp/runtime-minimal`, `@mplp/coordination`, and others

#### Reusable immediately

- `schemas/v2/mplp-context.schema.json`
- `schemas/v2/mplp-plan.schema.json`
- `schemas/v2/mplp-confirm.schema.json`
- `schemas/v2/mplp-trace.schema.json`
- `schemas/v2/common/*.schema.json`
- `schemas/v2/events/*.schema.json`
- `schemas/v2/learning/*.schema.json`
- `schemas/v2/taxonomy/kernel-duties.yaml`
- `schemas/v2/taxonomy/module-event-matrix.yaml`
- `tests/golden/flows/`
- `tests/schema-alignment/ts-schema-alignment.test.ts`
- `packages/sources/validator/src/engine/schema.ts`

#### Partial or weak assets

- npm package surfaces point to `dist/index.js`, but checked-in `dist` artifacts are absent
- runtime-minimal tests reference source files that do not exist in the checked-in package tree
- runtime tests and runtime-compat tests drift from frozen schemas in several places
- validator source is usable, but some files contain encoding noise and are narrow in coverage

#### What should not be treated as SSOT

- package README claims where the corresponding checked-in runtime implementation is absent
- helper/runtime naming in package surfaces when it is not backed by constitutional Coregentis binding rules
- projection concepts in TracePilot docs as mother runtime object definitions

### 3. Concrete reusable assets

| Asset | Location | Reuse decision | Why |
|---|---|---|---|
| Protocol module schemas | `V1.0_release/schemas/v2/*.schema.json` | Reuse directly | Frozen MPLP protocol SSOT |
| Common metadata/ID/event/trace schemas | `V1.0_release/schemas/v2/common/` | Reuse directly | Best base for Coregentis protocol-bound projections |
| Event family taxonomy | `V1.0_release/schemas/v2/taxonomy/module-event-matrix.yaml` | Reuse with binding translation | Good protocol event coverage baseline |
| Kernel duty taxonomy | `V1.0_release/schemas/v2/taxonomy/kernel-duties.yaml` | Reuse as imported reference | Protocol governance baseline |
| Golden flow fixtures | `V1.0_release/tests/golden/flows/` | Reuse as protocol regression fixtures | Good for protocol export projection checks |
| Validator AJV pattern | `V1.0_release/packages/sources/validator/src/engine/schema.ts` | Reuse pattern only | Narrow but useful for schema gates |
| Learning sample schemas | `V1.0_release/schemas/v2/learning/` | Reuse as export/interop target | Useful downstream, not Coregentis internal SSOT |
| Coregentis docs | `Cognitive_OS/OS_core_file/` | Reuse as constitutional SSOT | Runtime law baseline |
| TracePilot docs | `Cognitive_OS/Tracepilot_Core/` | Reuse as projection/M0 SSOT | Projection boundary and validation baseline |

### 4. Missing assets

- Coregentis schema root
- Coregentis base envelope schema
- Coregentis machine-readable object registry
- Coregentis machine-readable relationship rules
- Coregentis machine-readable MPLP binding matrix
- Coregentis runtime event model
- Coregentis memory placement and promotion rules
- Coregentis policy profile realization
- Coregentis runtime skeleton
- Coregentis cognitive loop harness
- TracePilot runtime profile spec
- TracePilot projection object contract

## Gap Analysis

| Area | Required by architecture? | Present in repo? | Quality / maturity | Gap severity | Recommendation |
|---|---|---|---|---|---|
| Core schema layer | Yes | Partial via MPLP only; absent in `Cognitive_OS` | MPLP side frozen, Coregentis side absent | Critical | Create Coregentis base schemas and first-batch object schemas, importing MPLP common/protocol schemas instead of redefining them |
| Object registry implementation | Yes | Docs only | Clear conceptually, absent mechanically | Critical | Create a machine-readable Coregentis registry with object type, authority class, layer, temporal class, mutation class, lineage model, schema ref |
| Binding matrix implementation | Yes | Docs only | Clear conceptually, absent mechanically | Critical | Create machine-readable MPLP <-> Coregentis mapping rules with import/export and reconstruction rules |
| Memory model implementation | Yes | No | Absent | Critical | Implement working, episodic, semantic memory abstractions plus governed promotion records |
| Activation model implementation | Yes | No Coregentis implementation; partial MPLP helper naming only | Naming exists, implementation absent | Critical | Implement Coregentis activation from constitutional rules, not from package README claims |
| Conflict/drift implementation | Yes | No | Absent | Critical | Define `Drift Record` and `Conflict Case` schemas and a first-pass reconciliation service |
| Learning/consolidation implementation | Yes | Partial via MPLP learning schemas/examples | Export shape exists, runtime absent | High | Implement `Learning Candidate` first, and delay richer learning packs until the minimal loop works |
| Policy profile implementation | Yes | Docs only | Constitutional but not executable | Critical | Create `Policy Rule` and profile schemas plus inspectable evaluation logic |
| Trace/evidence implementation | Yes | Partial via MPLP trace/event schemas | Protocol evidence good, Coregentis evidence absent | High | Implement `Trace Evidence`, `Decision Record`, and evidence chain linkage with MPLP trace projection support |
| Minimal cognitive loop | Yes | No | Absent | Critical | Build deterministic loop harness for `Form -> Place -> Activate -> Confirm -> Trace -> Reconcile -> Consolidate` |
| TracePilot projection prerequisites | Yes | Docs only | Projection baseline strong, runtime inputs absent | High | Freeze readiness boundary and prohibit product runtime work until mother runtime phases are complete |

## Reuse Assessment

### Treat as SSOT

#### What the docs say

Protocol truth belongs to MPLP; runtime truth belongs to Coregentis constitutional docs; projection truth belongs to projection baselines.

#### What the repo actually has

- MPLP schemas and taxonomy are the strongest machine-readable truth in the environment
- Coregentis docs are the strongest runtime constitutional truth in the environment
- TracePilot docs are the strongest projection truth in the environment

#### What is inferred as the right reuse rule

Use the following as SSOT:

- MPLP `schemas/v2/**` for protocol semantics
- Coregentis constitutional and object/binding docs for runtime law until replaced by machine-readable Coregentis artifacts
- TracePilot projection/M0 docs for projection and validation boundaries

### Reuse with caution

- MPLP validator source: reuse the validation pattern, not the current scope as sufficient
- MPLP golden flows: reuse for protocol projection/regression, not as Coregentis runtime semantics
- MPLP learning sample schemas: reuse as export/interoperability target, not as Coregentis internal learning object model
- MPLP runtime/helper package naming: reuse only after explicit binding classification
- MPLP repo imports in general: reuse only through an explicit lock file and explicit imported path allowlist, not by broad repo copying

### Do not treat as authoritative implementation truth

- absent `dist`-backed npm runtime surfaces
- tests that reference missing runtime source files
- tests whose object fields drift from frozen schemas
- TracePilot projected objects such as cards, review surfaces, and summaries

## Top Architectural Risks

1. TracePilot projection objects become the real runtime object model.
2. A single undifferentiated memory store is implemented and mislabeled as Cognitive OS.
3. Coregentis starts runtime coding without a machine-readable object registry.
4. Coregentis starts runtime coding without a machine-readable binding matrix.
5. MPLP helper/runtime package naming is mistaken for protocol law or Coregentis law.
6. Conflict and drift are reduced to logs, warnings, or generic exceptions instead of typed runtime objects.
7. Learning is implemented as uncontrolled write-back instead of governed consolidation.
8. Protocol-bound object identity is lost inside richer runtime containers and cannot be reconstructed.
9. Evidence/trace is treated as observability exhaust only and not as decision-grade runtime evidence.
10. Product urgency or demo pressure bends the mother runtime before the minimal cognitive loop is stable.
11. Intent and Delta Intent remain underspecified in machine-readable form and later absorb product-specific semantics.
12. Runtime implementation reuses stale or schema-drifting MPLP test/package assumptions instead of frozen schemas.

## Bottom-Line Assessment

### What the docs say

The project is ready to move from architecture prose into pre-execution research and planning.

### What the repo actually has

That pre-execution research result is now clear:

- mother architecture: strong
- projection validation baseline: strong
- reusable protocol substrate: strong
- Coregentis implementation substrate: almost entirely absent

### What is inferred as the correct next step

The project is not ready for product implementation execution yet. It is ready for a tightly scoped first implementation batch focused on:

1. Coregentis core schema baseline
2. Coregentis machine-readable object registry
3. Coregentis machine-readable binding matrix
4. Coregentis minimal runtime skeleton
5. minimal cognitive loop harness

Until those exist, TracePilot should remain in projection-boundary and validation-prep mode only.

## Phase Confirmation

This document remains a pre-implementation governance artifact only.

It strengthens:

- repository truth clarity
- reuse discipline
- gap visibility
- anti-drift constraints

It does not authorize:

- product feature implementation
- TracePilot runtime/profile implementation
- runtime shortcutting around schema, registry, or binding work
