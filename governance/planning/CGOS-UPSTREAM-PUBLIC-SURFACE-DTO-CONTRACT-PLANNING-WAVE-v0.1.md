# CGOS-UPSTREAM-PUBLIC-SURFACE-DTO-CONTRACT-PLANNING-WAVE-v0.1

## Document Control

- doc_id: CGOS-UPSTREAM-PUBLIC-SURFACE-DTO-CONTRACT-PLANNING-WAVE-v0.1
- task_id: CGOS-UPSTREAM-PUBLIC-SURFACE-DTO-CONTRACT-PLANNING-WAVE-01
- status: upstream public-surface DTO contract planning only
- date: 2026-05-06
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: 40ba02e0d933d435cd275cd852fbd108a86456f0
- solocrew_reference_head: bac12dd5548e85fb3c5804481418ab6d0097c69c
- mplp_reference_head: 214939ab6ba522036d376868d1fe8d04d960420f
- planned_candidate_dto_count: 3
- no_implementation_change: true
- no_runtime_public_source_change: true
- no_typescript_interface_or_type_source_change: true
- no_runtime_api_change: true
- no_package_export_change: true
- no_schema_registry_binding_change: true
- no_package_publication: true
- no_release_or_tag: true
- no_solocrew_modification: true
- no_mplp_modification: true
- no_protocol_change: true

## Remote Truth

Remote truth was fetched for Cognitive_OS, SoloCrew, and MPLP-Protocol before
this contract-planning record was created.

| Repo | Local HEAD | origin/main HEAD | Expected | Worktree |
| --- | --- | --- | --- | --- |
| Cognitive_OS | `40ba02e0d933d435cd275cd852fbd108a86456f0` | `40ba02e0d933d435cd275cd852fbd108a86456f0` | `40ba02e0d933d435cd275cd852fbd108a86456f0` | clean before edits |
| SoloCrew | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | clean, read-only |
| MPLP-Protocol | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | clean, read-only |

This wave modifies only this Cognitive_OS governance planning record and the
Cognitive_OS changelog. It does not modify runtime source, DTO source, package
exports, schemas, registry entries, bindings, runtime behavior, tests, package
files, publication state, release state, SoloCrew, or MPLP-Protocol.

## Input Baselines Inspected

Cognitive_OS inputs inspected:

- `governance/planning/CGOS-UPSTREAM-PUBLIC-SURFACE-DTO-DESIGN-READINESS-WAVE-v0.1.md`
- `governance/planning/CGOS-UPSTREAM-PUBLIC-SURFACE-FIELD-DESIGN-WAVE-v0.1.md`
- `governance/planning/CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-v0.1.md`
- `package.json`
- all current `runtime/public/*.ts` DTO/evidence/public bundle files

SoloCrew read-only inputs inspected:

- `governance/planning/TRI-REPO-BRIDGE-REPLACEMENT-PLAN-WAVE-v0.1.md`
- `governance/audits/SOLOCREW-CGOS-LEGACY-BRIDGE-OWNERSHIP-AND-QUARANTINE-WAVE-v0.1.md`

MPLP-Protocol read-only input inspected:

- `governance/candidates/MPGC-CANDIDATE-BACKLOG-v0.1.md`

The inspected baselines show that the three readiness-approved candidate DTOs
may be planned as future type-only contracts. This wave does not authorize
source implementation, package export changes, runtime APIs, downstream
migration, bridge retirement, or protocol changes.

## DTO Contract-Planning Scope

This record plans future DTO contracts in prose and tables only. It defines
candidate names, candidate package subpaths, field group semantics, evidence
and omission structures, boundary flag obligations, downstream ownership
boundaries, and future implementation-planning gates.

Allowed in this record:

- candidate DTO identity and category;
- top-level contract group plans;
- semantic value posture descriptions without TypeScript enum/type creation;
- safe and forbidden examples in prose;
- evidence/ref and omission marker structure planning;
- future implementation-planning obligations;
- readiness-to-implementation-planning gate outcomes.

Not allowed in this record:

- TypeScript interfaces, exported source types, `runtime/public/*.ts` files,
  runtime APIs, package exports, package subpaths in `package.json`, tests,
  schemas, registry entries, bindings, package publication, releases, tags,
  SoloCrew edits, or MPLP edits.

Contract planning does not mean implementation planning has started. Contract
planning only says a later implementation-planning wave may decide whether
source files can be implemented safely.

## Current 16-Export Baseline

Cognitive_OS currently exposes exactly 16 private `runtime/public` package
subpaths:

| Surface family | Current exports | Contract-planning implication |
| --- | --- | --- |
| operator review loop | `operator-review-loop-dto`, `operator-review-loop-handoff-bundle` | remains valid and unchanged |
| first-wave runtime DTOs | `runtime-readiness-status-dto`, `runtime-projection-summary-dto`, `runtime-execution-event-dto`, `runtime-objective-continuity-dto` | provides readiness/projection/event/objective refs |
| second-wave DTOs | `state-port-summary-dto`, `persistence-roundtrip-evidence-dto`, `memory-preference-summary-dto`, `learning-correction-evidence-dto`, `runtime-action-request-summary-dto`, `runtime-dispatch-boundary-evidence-dto` | provides state/persistence/memory/learning/action/dispatch refs |
| third-wave DTOs | `runtime-session-summary-dto`, `runtime-session-evidence-dto`, `worker-lifecycle-summary-dto`, `worker-lifecycle-evidence-dto` | provides session/lifecycle posture and evidence refs |

Current exports remain DTO/evidence surfaces, not runtime authority APIs. They
omit runtime-private payloads, constructors, service instances, mutable state
handles, lifecycle transition authority, storage write authority, mutation
writeback authority, training authority, provider dispatch, channel dispatch,
and tool invocation.

This wave does not add, remove, widen, rename, publish, or verify new exports.

## MPLP Candidate / Protocol Boundary

MPLP MPGC backlog entries are non-normative background only:

- `MPGC-CANDIDATE-EVIDENCE-OMISSION-BOUNDARY-FLAGS-01`
- `MPGC-CANDIDATE-RUNTIME-SESSION-EVIDENCE-01`
- `MPGC-CANDIDATE-DOWNSTREAM-RUNTIME-BRIDGE-MIGRATION-01`
- `MPGC-CANDIDATE-PROJECTION-SAFE-PACKAGE-SURFACE-01`
- `MPGC-CANDIDATE-LEARNING-CORRECTION-EVIDENCE-01`

This contract-planning record does not request or perform any MPLP schema,
spec, core-law, module, profile, binding, conformance, certification,
endorsement, official implementation, or canonical implementation change.
Cognitive_OS candidate DTO plans remain implementation-layer planning, not
protocol law.

## Contract Planning Principles

- Future DTO contracts must be type-only, projection-safe, evidence-safe,
  non-executing, no-authority, and runtime-private-payload omitted.
- Field groups must describe posture, evidence, result, refs, or omissions;
  they must not create behavior.
- Candidate package subpaths are planning labels only until separate export
  readiness, export implementation, and export verification waves authorize
  them.
- Existing 16 exports remain valid and must be reused as refs where possible.
- Runtime behavior, local storage policy, correction UX, preference
  application, dependency strategy, and bridge retirement timing remain
  downstream-owned unless a separate owner-approved task changes that.
- MPLP remains candidate/non-normative background only.
- This plan must prefer explicit conditions over false readiness where
  storage, writeback, training, or runtime construction risks remain.

## RuntimeSessionBehaviorBoundarySnapshotDto Contract Plan

### Candidate Contract Identity

| Field | Plan |
| --- | --- |
| candidate DTO name | `RuntimeSessionBehaviorBoundarySnapshotDto` |
| candidate package subpath, not authorized yet | `runtime-session-behavior-boundary-snapshot-dto` |
| candidate category | `runtime_public_snapshot_dto` |
| source readiness outcome | `READY_FOR_DTO_CONTRACT_PLANNING` |
| source field-design track | runtime session behavior-boundary snapshot |
| contract-planning status | complete; may proceed to future implementation-planning wave |

### Top-Level Contract Group Plan

| Group | Purpose | Allowed semantic posture | Safe examples in prose | Forbidden examples in prose | Existing export relationship | Why it does not replace runtime behavior |
| --- | --- | --- | --- | --- | --- | --- |
| identity/version metadata | identify the snapshot and contract baseline | stable id, contract version, source surface version, source commit, governance refs | snapshot id and source commit ref | live session object id or constructor identity | follows existing contract/source metadata pattern | metadata cannot create or operate a session |
| session posture | summarize session availability and readiness posture | available, summary-only, deferred, blocked, unsupported, unknown | "configured posture observed through public evidence" | "construct this session" or live facade status | composes `runtime-session-summary-dto` and readiness refs | posture is descriptive only |
| construction boundary posture | describe construction attempt/result boundary without executable details | created-observed, deferred, blocked, not evaluated, unsupported | "construction blocked because dependency family omitted" | constructor args, factory args, orchestrator class names | complements `runtime-session-evidence-dto` | no constructor or factory is exposed |
| dependency family posture | summarize dependency-family presence or omission | configured, summary-only, evidence-only, omitted, blocked, deferred, unsupported | "state dependency omitted as runtime-private" | service instance, dependency bundle, injected registry | composes session evidence and second-wave refs | refs do not expose dependency handles |
| state mode posture | describe state mode posture relevant to the session | memory, persisted, unavailable, degraded, unknown | "persisted posture observed via public evidence" | sqlite handle, store instance, transaction object | references state and persistence DTOs | no storage read or write occurs |
| safe evidence refs | link to bounded public evidence | public DTO refs, governance refs, test evidence refs | readiness ref, session evidence ref | live object pointer, private runtime path | reuses existing evidence ref pattern | refs are not executable |
| omission markers | make omitted private payloads explicit | constructor omitted, service omitted, store omitted, live handle omitted | "service instance omitted because private" | hidden constructor payload or serialized private service | follows existing omission marker pattern | omissions deny access |
| literal boundary flags | machine-visible no-authority posture | required boolean true flags | `non_executing: true` | permissive capability flag | follows current boundary profile pattern | flags deny authority |
| version refs | separate runtime/public, package, governance, and protocol refs | runtime contract ref, public surface ref, package baseline ref, governance ref | package export baseline ref | protocol conformance assertion | reuses current version ref pattern | version refs are descriptive |
| future parity hints | provide neutral downstream parity hints | neutral missing-field or fixture-hint posture | "compare session boundary posture" | page, route, dashboard, customer, founder terms | supports later SoloCrew parity evidence | hints do not migrate code |

### Required Literal Boundary Flags

Required future literal flags:

- `projection_safe: true`
- `evidence_safe: true`
- `runtime_private_payload_omitted: true`
- `non_executing: true`
- `no_authority: true`
- `no_constructor_exposure: true`
- `no_service_instance_exposure: true`
- `no_mutable_state_exposure: true`
- `no_storage_write_authority: true`
- `no_mutation_writeback_authority: true`
- `no_provider_dispatch: true`
- `no_channel_dispatch: true`
- `no_tool_invocation: true`

### Evidence / Ref Structure Planning

Safe evidence refs should be bounded records with a ref id, ref kind, optional
summary, optional source public-surface family, and optional governance ref.
Allowed source ref categories include current public DTO refs, governance
planning refs, package export baseline refs, test evidence refs, and source
commit refs. Forbidden refs include live runtime objects, constructors,
service instances, dependency bundles, private runtime paths, stores, sqlite
handles, dispatcher handles, and lifecycle runtime handles.

Version refs must separate runtime contract refs, public surface refs, package
export baseline refs, governance refs, and any MPLP background refs. Governance
refs must point to planning/readiness records and must not imply protocol
approval.

### Omission Marker Structure Planning

Required omission marker families:

- constructor and constructor argument omissions;
- service instance and dependency-bundle omissions;
- store, sqlite, and mutable record omissions;
- live runtime handle omissions;
- dispatch, provider, channel, and tool authority omissions;
- storage write and mutation writeback omissions;
- runtime-private path omissions.

### Existing 16-Export Relationship

Related existing exports:

- `runtime-session-summary-dto`
- `runtime-session-evidence-dto`
- `runtime-readiness-status-dto`
- `runtime-projection-summary-dto`
- `state-port-summary-dto`
- `persistence-roundtrip-evidence-dto`
- `runtime-objective-continuity-dto`
- `runtime-execution-event-dto`

Existing exports cover session posture, evidence, readiness, projection,
state-port posture, persistence evidence, objective continuity, and bounded
events. The candidate contract composes those surfaces into a behavior-boundary
snapshot for session construction/dependency/state-mode posture. This is not a
duplicate because current exports do not provide one cross-family boundary
snapshot. Current exports remain valid, and this candidate does not authorize
bridge replacement because it cannot create sessions or replace constructors.

### Downstream Ownership Boundary

SoloCrew retains local runtime session facade creation, shell lifecycle wiring,
sqlite mode choice, product return-flow behavior, dependency strategy, and
bridge retirement timing. Cognitive_OS runtime constructors, services, stores,
or orchestrator internals remain private. Dependency strategy and bridge
retirement remain blocked until later SoloCrew-owned decisions. Future
SoloCrew parity evidence must show which boundary snapshot fields are needed
before source implementation is authorized.

### Future Implementation-Planning Obligations

Future implementation planning must require type-only source posture, no
runtime behavior, no runtime/private imports, no helper bundle unless
separately approved, package export readiness gate, package export
implementation gate, package export verification gate, empty/non-executing
runtime module test, forbidden authority grep, no positive forbidden claim
grep, and package export exactness test.

### Readiness-to-Implementation Gate

Gate outcome:

`READY_FOR_IMPLEMENTATION_PLANNING`

Meaning: a future implementation-planning wave may plan exact source-file
constraints for this candidate, but this wave does not create source files or
exports.

## StateRoundtripBehaviorResultSnapshotDto Contract Plan

### Candidate Contract Identity

| Field | Plan |
| --- | --- |
| candidate DTO name | `StateRoundtripBehaviorResultSnapshotDto` |
| candidate package subpath, not authorized yet | `state-roundtrip-behavior-result-snapshot-dto` |
| candidate category | `runtime_public_result_snapshot_dto` |
| source readiness outcome | `READY_WITH_CONDITIONS` |
| source field-design track | state roundtrip behavior-result snapshot |
| contract-planning status | complete with conditions; may proceed to future implementation-planning wave with storage-authority guardrails |

### Top-Level Contract Group Plan

| Group | Purpose | Allowed semantic posture | Safe examples in prose | Forbidden examples in prose | Existing export relationship | Why it does not replace runtime behavior |
| --- | --- | --- | --- | --- | --- | --- |
| identity/version metadata | identify the result snapshot and contract baseline | stable id, contract version, source surface version, source commit, governance refs | result snapshot id and source commit ref | database record id as live handle | follows current metadata pattern | metadata cannot run storage behavior |
| state mode posture | describe observed state mode posture | memory, persisted, unavailable, degraded, unknown | "persistent posture evidence available" | sqlite connection or store object | composes `state-port-summary-dto` | posture does not expose store mechanics |
| roundtrip result posture | summarize observed roundtrip evidence | completed, blocked, deferred, unsupported, not evaluated, degraded | "roundtrip evidence reports blocked" | method that executes a roundtrip | composes `persistence-roundtrip-evidence-dto` | result does not perform roundtrip |
| persistence posture | describe persistence availability and durability posture | available, evidence-only, degraded, blocked, unsupported, unknown | "durability posture summarized" | transaction or write operation | references state/persistence exports | no write authority is exposed |
| reload/rehydration posture | summarize reload or rehydration evidence | observed, not evaluated, blocked, degraded, unsupported | "rehydration posture observed by evidence ref" | reload function, hydrate API, raw snapshot | composes state/persistence/session refs | no reload/rehydration execution occurs |
| safe evidence refs | link to bounded public evidence | public DTO refs, governance refs, test evidence refs | persistence evidence ref | raw persisted record or sqlite path | reuses existing evidence ref pattern | refs cannot write or read |
| omission markers | make omitted storage payloads explicit | store omitted, sqlite handle omitted, transaction omitted, raw record omitted | "transaction object omitted" | embedded transaction payload | follows existing omission marker pattern | omissions deny storage access |
| literal boundary flags | machine-visible no-storage authority posture | required boolean true flags | `no_storage_write_authority: true` | "can write state" flag | follows current boundary profile pattern | flags deny writes |
| version refs | separate runtime/public, package, governance, and protocol refs | runtime contract ref, public surface ref, package baseline ref, governance ref | package baseline ref | protocol validation assertion | reuses current version ref pattern | version refs are descriptive |
| future parity hints | provide neutral parity hints for later downstream checks | neutral reload/roundtrip posture hints | "compare reload result posture" | local sqlite policy names | supports later SoloCrew parity evidence | hints do not migrate storage |

### Required Literal Boundary Flags

Required future literal flags:

- `projection_safe: true`
- `evidence_safe: true`
- `runtime_private_payload_omitted: true`
- `non_executing: true`
- `no_authority: true`
- `no_constructor_exposure: true`
- `no_service_instance_exposure: true`
- `no_mutable_state_exposure: true`
- `no_storage_write_authority: true`
- `no_sqlite_handle_exposure: true`
- `no_store_adapter_exposure: true`
- `no_transaction_authority: true`
- `no_mutation_writeback_authority: true`

### Evidence / Ref Structure Planning

Safe evidence refs should identify public DTO evidence or governance evidence
only. Allowed source ref categories include state-port summaries, persistence
roundtrip evidence, runtime session evidence, objective continuity evidence,
package export baseline refs, test evidence refs, governance refs, and source
commit refs. Forbidden refs include sqlite handles, store instances, raw
state records, transaction objects, storage adapters, rehydration functions,
runtime-private paths, and mutable records.

Version refs must separate runtime contract refs, public surface refs, package
export baseline refs, governance refs, and MPLP background refs. Governance
refs must not imply approval to write, read, reload, or mutate state.

### Omission Marker Structure Planning

Required omission marker families:

- store and storage adapter omissions;
- sqlite handle and connection omissions;
- transaction and write-operation omissions;
- raw snapshot and raw record omissions;
- mutable state record omissions;
- reload/rehydration function omissions;
- mutation writeback omissions;
- runtime-private path omissions.

### Existing 16-Export Relationship

Related existing exports:

- `state-port-summary-dto`
- `persistence-roundtrip-evidence-dto`
- `runtime-session-summary-dto`
- `runtime-session-evidence-dto`
- `runtime-readiness-status-dto`
- `runtime-objective-continuity-dto`

Existing exports cover state-port posture and persistence roundtrip evidence.
The candidate contract composes state mode, roundtrip result posture,
persistence posture, reload/rehydration posture, and storage omissions into one
neutral result snapshot. This is not a duplicate because current exports do
not combine those result and omission families. Current exports remain valid,
and this candidate does not authorize bridge replacement because it cannot
read, write, reload, rehydrate, transact, or expose store handles.

### Downstream Ownership Boundary

SoloCrew retains sqlite/in-memory mode choice, local store lifecycle, reload
behavior, data-loss policy, dependency strategy, and bridge retirement timing.
Cognitive_OS runtime stores, sqlite implementation, transactions, adapters,
and mutable records remain private. Dependency strategy and bridge retirement
remain blocked until later SoloCrew-owned decisions. Future SoloCrew parity
evidence must show exact result-posture fields and prove that the field shape
does not encode local storage policy.

### Future Implementation-Planning Obligations

Future implementation planning must require type-only source posture, no
runtime behavior, no runtime/private imports, no helper bundle unless
separately approved, package export readiness gate, package export
implementation gate, package export verification gate, empty/non-executing
runtime module test, forbidden authority grep for store/sqlite/transaction/
write/reload/rehydration terms, no positive forbidden claim grep, and package
export exactness test.

### Readiness-to-Implementation Gate

Gate outcome:

`READY_FOR_IMPLEMENTATION_PLANNING_WITH_CONDITIONS`

Conditions:

- future planning must use result/posture vocabulary only;
- future planning must not define storage adapters, sqlite handles,
  transaction authority, reload authority, or write authority;
- future planning must preserve SoloCrew ownership of local storage policy.

## LearningCorrectionBehaviorResultSnapshotDto Contract Plan

### Candidate Contract Identity

| Field | Plan |
| --- | --- |
| candidate DTO name | `LearningCorrectionBehaviorResultSnapshotDto` |
| candidate package subpath, not authorized yet | `learning-correction-behavior-result-snapshot-dto` |
| candidate category | `runtime_public_result_snapshot_dto` |
| source readiness outcome | `READY_WITH_CONDITIONS` |
| source field-design track | learning/correction behavior-result snapshot |
| contract-planning status | complete with conditions; may proceed to future implementation-planning wave with no-training/no-writeback guardrails |

### Top-Level Contract Group Plan

| Group | Purpose | Allowed semantic posture | Safe examples in prose | Forbidden examples in prose | Existing export relationship | Why it does not replace runtime behavior |
| --- | --- | --- | --- | --- | --- | --- |
| identity/version metadata | identify the result snapshot and contract baseline | stable id, contract version, source surface version, source commit, governance refs | result snapshot id and source commit ref | correction service object identity | follows current metadata pattern | metadata cannot capture correction |
| correction capture posture | summarize observed capture posture | captured, not captured, deferred, blocked, not evaluated, unsupported | "capture evidence observed" | correction capture service handle | composes `learning-correction-evidence-dto` | posture does not capture corrections |
| preference effect posture | summarize candidate preference effect posture | candidate, applied-observed, not applied, deferred, blocked, unknown | "candidate effect evidence exists" | preference writeback service or mutation call | composes memory/preference and learning refs | no preference application authority |
| objective comparison refs | link to safe objective comparison evidence | objective continuity ref, comparison evidence ref, governance ref | objective continuity ref | objective anchor store or comparison service | references `runtime-objective-continuity-dto` | refs do not run comparisons |
| learning/correction result posture | summarize result and reviewability posture | evidence-only, summary-only, reviewed, blocked, deferred, unsupported | "reviewable correction evidence" | train model, mutate memory, write preference | composes learning and objective refs | no training or writeback occurs |
| safe evidence refs | link to bounded public evidence | public DTO refs, governance refs, test evidence refs | learning evidence ref | private correction record or service handle | reuses existing evidence ref pattern | refs are non-executing |
| omission markers | make omitted mutation payloads explicit | training omitted, writeback omitted, service omitted, anchor store omitted | "preference service handle omitted" | hidden writeback payload | follows current omission marker pattern | omissions deny mutation |
| literal boundary flags | machine-visible no-training/no-writeback posture | required boolean true flags | `no_training_authority: true` | "can train" or "can writeback" flag | follows current boundary profile pattern | flags deny learning authority |
| version refs | separate runtime/public, package, governance, and protocol refs | runtime contract ref, public surface ref, package baseline ref, governance ref | package baseline ref | protocol endorsement assertion | reuses current version ref pattern | version refs are descriptive |
| future parity hints | provide neutral parity hints for downstream checks | neutral correction/preference posture hints | "compare correction result posture" | product UX, page wording, customer language | supports later SoloCrew parity evidence | hints do not migrate UX |

### Required Literal Boundary Flags

Required future literal flags:

- `projection_safe: true`
- `evidence_safe: true`
- `runtime_private_payload_omitted: true`
- `non_executing: true`
- `no_authority: true`
- `no_constructor_exposure: true`
- `no_service_instance_exposure: true`
- `no_mutable_state_exposure: true`
- `no_training_authority: true`
- `no_mutation_writeback_authority: true`
- `no_preference_service_handle_exposure: true`
- `no_learning_service_exposure: true`
- `no_storage_write_authority: true`

### Evidence / Ref Structure Planning

Safe evidence refs should identify public DTO evidence or governance evidence
only. Allowed source ref categories include learning correction evidence,
memory preference summary, objective continuity, runtime projection summary,
runtime readiness, runtime session evidence, package export baseline refs,
test evidence refs, governance refs, and source commit refs. Forbidden refs
include correction services, preference writeback services, learning services,
training pipelines, model training hooks, objective anchor stores, mutation
functions, private correction records, runtime-private paths, and live handles.

Version refs must separate runtime contract refs, public surface refs, package
export baseline refs, governance refs, and MPLP background refs. Governance
refs must not imply approval to capture, write back, mutate, or train.

### Omission Marker Structure Planning

Required omission marker families:

- training pipeline and training hook omissions;
- learning service omissions;
- correction capture service omissions;
- preference writeback service omissions;
- objective anchor store and comparison service omissions;
- mutation function and mutable record omissions;
- storage write omissions;
- runtime-private path omissions.

### Existing 16-Export Relationship

Related existing exports:

- `learning-correction-evidence-dto`
- `memory-preference-summary-dto`
- `runtime-objective-continuity-dto`
- `runtime-projection-summary-dto`
- `runtime-readiness-status-dto`
- `runtime-session-evidence-dto`

Existing exports cover correction evidence, memory/preference summary,
objective continuity, projection, readiness, and session evidence. The
candidate contract composes correction capture posture, preference effect
posture, objective comparison refs, learning/correction result posture, and
mutation omissions into one neutral result snapshot. This is not a duplicate
because current exports do not combine capture/result/writeback-omission
posture. Current exports remain valid, and this candidate does not authorize
bridge replacement because it cannot capture corrections, apply preferences,
mutate memory, write back learning state, or train models.

### Downstream Ownership Boundary

SoloCrew retains correction UX policy, preference application policy, product
wording, local review flows, dependency strategy, and bridge retirement
timing. Cognitive_OS runtime correction capture, preference writeback,
learning services, objective anchors, and mutation records remain private.
Dependency strategy and bridge retirement remain blocked until later
SoloCrew-owned decisions. Future SoloCrew parity evidence must show exact
result-posture fields and prove that the field shape does not encode product
correction UX or preference application policy.

### Future Implementation-Planning Obligations

Future implementation planning must require type-only source posture, no
runtime behavior, no runtime/private imports, no helper bundle unless
separately approved, package export readiness gate, package export
implementation gate, package export verification gate, empty/non-executing
runtime module test, forbidden authority grep for training/mutation/writeback/
correction service/preference service/learning service/objective anchor terms,
no positive forbidden claim grep, and package export exactness test.

### Readiness-to-Implementation Gate

Gate outcome:

`READY_FOR_IMPLEMENTATION_PLANNING_WITH_CONDITIONS`

Conditions:

- future planning must use result/posture vocabulary only;
- future planning must not define training, mutation writeback, preference
  service handles, correction service handles, learning service exposure, or
  objective anchor service exposure;
- future planning must preserve SoloCrew ownership of correction UX and
  preference application policy.

## Cross-DTO Contract Consistency Rules

All three candidate DTO contracts must follow these rules:

- identity/version metadata must be stable and descriptive, not live runtime
  identity;
- safe evidence refs must point only to bounded public DTO evidence,
  governance refs, test evidence refs, source commit refs, or package export
  baseline refs;
- omission markers must be explicit, machine-readable, and tied to omitted
  authority families;
- boundary flags must include shared literal no-authority flags and any
  candidate-specific denial flags;
- field groups must use posture/result/ref language rather than behavior/API
  language;
- future parity hints must be neutral and must not encode SoloCrew page,
  dashboard, route, cell, customer, founder, engagement, UX, or display law;
- candidate subpaths are planning labels only and do not modify `package.json`;
- current 16 exports remain valid and must not be widened by copy.

## Required Literal Boundary Flags

Shared required flags for all future candidates:

- `projection_safe: true`
- `evidence_safe: true`
- `runtime_private_payload_omitted: true`
- `non_executing: true`
- `no_authority: true`
- `no_constructor_exposure: true`
- `no_service_instance_exposure: true`
- `no_mutable_state_exposure: true`
- `no_provider_dispatch: true`
- `no_channel_dispatch: true`
- `no_tool_invocation: true`

Additional required flags for `StateRoundtripBehaviorResultSnapshotDto`:

- `no_storage_write_authority: true`
- `no_sqlite_handle_exposure: true`
- `no_store_adapter_exposure: true`
- `no_transaction_authority: true`
- `no_mutation_writeback_authority: true`

Additional required flags for `LearningCorrectionBehaviorResultSnapshotDto`:

- `no_training_authority: true`
- `no_mutation_writeback_authority: true`
- `no_preference_service_handle_exposure: true`
- `no_learning_service_exposure: true`
- `no_storage_write_authority: true`

## Evidence / Ref Structure Plan

Each future candidate should use evidence/ref groups that include:

- bounded ref id;
- ref kind;
- source public surface family;
- optional neutral summary;
- optional source commit ref;
- optional governance ref;
- optional package export baseline ref.

Allowed source ref categories:

- current `runtime/public` DTO refs;
- governance planning/readiness refs;
- package export baseline refs;
- source commit refs;
- test evidence refs from future implementation verification.

Forbidden ref categories:

- live runtime objects;
- constructors or factory functions;
- service instances;
- stores, sqlite handles, transactions, adapters, or mutable records;
- dispatchers, provider routes, channels, tools, or handlers;
- learning services, correction services, preference services, training
  pipelines, objective anchor stores, or mutation functions;
- runtime-private source paths;
- protocol conformance, certification, endorsement, official implementation,
  or canonical implementation refs.

## Omission Marker Structure Plan

Each future candidate should use omission marker groups that include:

- omitted family;
- omission reason;
- boundary flag relationship;
- safe replacement posture;
- optional governance ref.

Required omitted authority categories:

- runtime construction authority;
- service instance authority;
- mutable state authority;
- storage write authority;
- mutation writeback authority;
- dispatch authority;
- provider/channel/tool authority;
- lifecycle transition authority;
- training authority.

Required omitted runtime-private payload categories:

- constructors and constructor arguments;
- dependency bundles;
- private services;
- stores, sqlite handles, transactions, adapters, and raw records;
- live runtime handles;
- dispatchers and handlers;
- learning/correction/preference/objective services;
- runtime-private paths.

Omission markers must deny access rather than hint at hidden retrieval paths.

## Existing Export Relationship

The current 16 exports remain valid and unchanged. Candidate contracts may
compose existing refs, but they must not duplicate current DTOs by widening or
copying their fields wholesale.

| Candidate | Related exports | What current exports cover | Candidate composition/addition | Why not duplicate | Why no bridge replacement authorization |
| --- | --- | --- | --- | --- | --- |
| `RuntimeSessionBehaviorBoundarySnapshotDto` | session summary/evidence, readiness, projection, state, persistence, objective, execution event | session posture and related evidence | construction/dependency/state-mode boundary snapshot | current exports do not provide cross-family boundary posture | no constructors or live handles |
| `StateRoundtripBehaviorResultSnapshotDto` | state port, persistence roundtrip, session, readiness, objective | state and persistence evidence | result/reload/storage-omission snapshot | current exports do not compose roundtrip result with storage omission posture | no store, sqlite, transaction, read, write, reload, or rehydration authority |
| `LearningCorrectionBehaviorResultSnapshotDto` | learning correction, memory preference, objective continuity, projection, readiness, session | correction evidence and preference/objective posture | capture/preference-effect/mutation-omission result snapshot | current exports do not compose capture/result/writeback omission posture | no correction capture, preference application, mutation, writeback, or training authority |

## Downstream Ownership Boundary

SoloCrew remains responsible for:

- local runtime session facade creation and shell lifecycle wiring;
- sqlite/in-memory mode choice, local state lifecycle, reload behavior, and
  data-loss policy;
- correction UX policy, preference application policy, and review flow wording;
- product page, projection adapter, route, dashboard, cell, engagement,
  customer, and founder-facing language;
- local fake motion handler and bounded action policy;
- dependency/package strategy, downstream migration sequencing, and bridge
  retirement timing;
- historical regression fixture ownership and parity test migration.

Cognitive_OS remains responsible only for neutral implementation-layer public
surface planning unless a later authorized task changes that. Cognitive_OS
runtime-private constructors, services, stores, dispatchers, lifecycle
methods, correction capture, preference writeback, objective anchors, and
learning services remain private. MPLP remains non-normative background only.

## Future Implementation-Planning Obligations

Any future implementation-planning wave must define, before source work:

- exact file candidates and whether all three should be implemented together
  or phased;
- exact type-only source constraints;
- exact no-import constraints for runtime-private paths;
- exact no-helper-bundle rule unless separately approved;
- package export readiness gate;
- package export implementation gate;
- package export verification gate;
- empty/non-executing runtime module test plan;
- forbidden authority grep plan;
- no positive forbidden claim grep plan;
- package export exactness test plan;
- protected path diff check plan;
- downstream product vocabulary grep plan;
- SoloCrew parity evidence required before downstream consumption.

Implementation planning still must not implement source files unless a later
implementation task explicitly authorizes that work.

## Readiness-to-Implementation Gate

| Candidate | Gate outcome | Conditions |
| --- | --- | --- |
| `RuntimeSessionBehaviorBoundarySnapshotDto` | READY_FOR_IMPLEMENTATION_PLANNING | future planning must preserve no-constructor, no-service, no-store, no-live-handle posture |
| `StateRoundtripBehaviorResultSnapshotDto` | READY_FOR_IMPLEMENTATION_PLANNING_WITH_CONDITIONS | future planning must preserve result/posture vocabulary and deny storage adapter, sqlite handle, transaction, reload, rehydration, write, and mutation authority |
| `LearningCorrectionBehaviorResultSnapshotDto` | READY_FOR_IMPLEMENTATION_PLANNING_WITH_CONDITIONS | future planning must preserve result/posture vocabulary and deny training, mutation writeback, preference service, correction service, learning service, and objective anchor service exposure |

No gate outcome authorizes source implementation, package export changes,
runtime APIs, bridge replacement, downstream migration, or protocol changes.

## Why No Implementation Is Authorized

No implementation is authorized because this wave is DTO contract planning
only. It intentionally stops before:

- adding or modifying `runtime/public/*.ts`;
- adding TypeScript interfaces or exported source types;
- changing `package.json` or package exports;
- adding package subpaths;
- adding runtime APIs, constructors, services, stores, dispatchers, lifecycle
  methods, storage writes, mutation writeback, training hooks, provider
  dispatch, channel dispatch, or tool invocation;
- modifying `runtime/core`, `runtime/state`, `runtime/lifecycle`,
  `runtime/learning`, or `runtime/execution`;
- creating schemas, registry entries, bindings, profiles, or protocol law;
- changing SoloCrew or MPLP-Protocol;
- starting downstream migration or bridge replacement implementation.

The next Cognitive_OS step, if owner-approved, should plan implementation
constraints without creating source files unless that later task explicitly
authorizes implementation.

## Risk Register

| Risk | Severity | Contract-planning response |
| --- | --- | --- |
| contract plan drifts into source design | High | prose/tables only; no TypeScript source or interfaces |
| runtime behavior authority leakage | High | shared no-authority flags and omission markers are mandatory |
| session constructor leakage | High | runtime session candidate gate requires no constructors, services, stores, or live handles |
| state/sqlite authority leakage | High | state candidate gate carries storage-specific conditions |
| correction/training/writeback leakage | High | learning candidate gate carries learning/writeback-specific conditions |
| duplicate existing exports | Medium | candidates compose refs and omissions rather than widening existing DTOs |
| downstream product-law contamination | High | SoloCrew product vocabulary remains downstream-owned |
| package/export sequencing confusion | Medium | candidate subpaths are planning labels only |
| protocol pollution | High | MPLP remains non-normative background only |
| false bridge readiness | High | this plan denies bridge replacement and downstream migration claims |

## Forbidden Claims Classification

| Claim or change class | Classification |
| --- | --- |
| official dependency availability | denied |
| bridge replacement readiness | denied |
| bridge replacement complete | denied |
| downstream migration complete | denied |
| repository-wide import hygiene complete | denied |
| package publication | denied |
| release or tag | denied |
| DTO implementation | denied |
| TypeScript interface or source type implementation | denied |
| package export change | denied |
| runtime behavior API | denied |
| runtime-private constructor, service, store, dispatcher, lifecycle, mutable handle, storage write, mutation writeback, training, provider dispatch, channel dispatch, or tool invocation exposure | denied |
| schema, registry, or binding change | denied |
| MPLP conformance, certification, endorsement, official implementation, or canonical implementation claim | denied |
| Cognitive_OS canonical MPLP implementation claim | denied |
| SoloCrew product vocabulary as Cognitive_OS canonical fields | denied |

Occurrences of these phrases in this document are negative guardrails and
classifications, not positive claims.

## Test / Check Results

Commands run during this wave:

| Command | Result |
| --- | --- |
| `git status --short` | clean before edits |
| `git diff --check` | PASS |
| `git diff --cached --check` | PASS after staging |
| `npm run test:runtime` | PASS, 259 tests, 259 pass, 0 fail, 0 skipped |
| `./node_modules/.bin/tsc --noEmit` | PASS |
| package export count check | PASS, exactly 16 `runtime/public` exports, forbidden planned-candidate export count 0 |
| protected path diff check | PASS, no diff in `package.json`, `package-lock.json`, `runtime/public`, runtime behavior directories, schemas, registry, bindings, or tests |
| forbidden claim grep on changed files | PASS, occurrences are negative guardrails/classifications only |
| forbidden package/private path grep | PASS, occurrences are negative guardrails/omissions only; no source import or package export introduced |
| SoloCrew head/status check | PASS, clean/read-only at expected reference |
| MPLP-Protocol head/status check | PASS, clean/read-only at expected reference |

Final check details are reported in the task final report after commit.

## Decision

Selected:

`CGOS_UPSTREAM_PUBLIC_SURFACE_DTO_CONTRACT_PLANNING_READY_NO_IMPLEMENTATION`

Rejected:

- `CGOS_UPSTREAM_PUBLIC_SURFACE_DTO_CONTRACT_PLANNING_READY_WITH_CONDITIONS`
- `CGOS_UPSTREAM_PUBLIC_SURFACE_DTO_CONTRACT_PLANNING_BLOCKED`

Meaning:

- all three candidate DTOs receive complete contract plans;
- each candidate receives an implementation-planning gate outcome;
- no candidate plan implies runtime behavior authority;
- current 16 exports are not overclaimed;
- downstream-owned SoloCrew behavior remains explicitly separated;
- no runtime/public source, package export, runtime API, schema, registry,
  binding, SoloCrew, or MPLP change occurs;
- no implementation starts;
- no P0/P1 blocker remains for a future implementation-planning wave.

## Next Allowed Task

Recommended first:

`CGOS-UPSTREAM-PUBLIC-SURFACE-DTO-IMPLEMENTATION-PLANNING-WAVE-01`

Reason:

- contract planning has narrowed the candidate DTOs, field groups, boundary
  flags, evidence/ref structures, omission markers, and gate conditions;
- implementation planning is the next safe Cognitive_OS step to decide exact
  source-file constraints, phasing, and test obligations before any code is
  written;
- SoloCrew existing-export parity work remains valuable, but it should not
  assume unplanned implementation details before the implementation-planning
  wave fixes the source constraints and sequencing.

Alternative after implementation planning:

`SOLOCREW-EXISTING-CGOS-EXPORTS-EXERCISE-PARITY-WAVE-01`

Owner may also pause development.
