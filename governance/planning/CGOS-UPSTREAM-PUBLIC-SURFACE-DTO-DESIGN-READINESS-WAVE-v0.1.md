# CGOS-UPSTREAM-PUBLIC-SURFACE-DTO-DESIGN-READINESS-WAVE-v0.1

## Document Control

- doc_id: CGOS-UPSTREAM-PUBLIC-SURFACE-DTO-DESIGN-READINESS-WAVE-v0.1
- task_id: CGOS-UPSTREAM-PUBLIC-SURFACE-DTO-DESIGN-READINESS-WAVE-01
- status: upstream public-surface DTO design-readiness only
- date: 2026-05-06
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: 4c67a33606b4b038f5cfbf249686d287bfb2743c
- solocrew_reference_head: bac12dd5548e85fb3c5804481418ab6d0097c69c
- mplp_reference_head: 214939ab6ba522036d376868d1fe8d04d960420f
- evaluated_track_count: 3
- at_least_one_track_ready_for_contract_planning: true
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
this readiness record was created.

| Repo | Local HEAD | origin/main HEAD | Expected | Worktree |
| --- | --- | --- | --- | --- |
| Cognitive_OS | `4c67a33606b4b038f5cfbf249686d287bfb2743c` | `4c67a33606b4b038f5cfbf249686d287bfb2743c` | `4c67a33606b4b038f5cfbf249686d287bfb2743c` | clean before edits |
| SoloCrew | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | clean, read-only |
| MPLP-Protocol | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | clean, read-only |

This wave modifies only this Cognitive_OS governance planning record and the
Cognitive_OS changelog. It does not modify runtime source, DTO source, package
exports, schemas, registry entries, bindings, runtime behavior, tests, package
files, publication state, release state, SoloCrew, or MPLP-Protocol.

## Input Baselines Inspected

Cognitive_OS inputs inspected:

- `governance/planning/CGOS-UPSTREAM-PUBLIC-SURFACE-FIELD-DESIGN-WAVE-v0.1.md`
- `governance/planning/CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-v0.1.md`
- `governance/planning/CGOS-UPSTREAM-PUBLIC-SURFACE-REQUEST-CANDIDATE-WAVE-v0.1.md`
- `package.json`
- all current `runtime/public/*.ts` DTO/evidence/public bundle files

SoloCrew read-only inputs inspected:

- `governance/planning/TRI-REPO-BRIDGE-REPLACEMENT-PLAN-WAVE-v0.1.md`
- `governance/audits/SOLOCREW-CGOS-LEGACY-BRIDGE-OWNERSHIP-AND-QUARANTINE-WAVE-v0.1.md`

MPLP-Protocol read-only input inspected:

- `governance/candidates/MPGC-CANDIDATE-BACKLOG-v0.1.md`

The inspected baselines show that the three selected tracks have complete
field-family designs and explicit forbidden field families. They are ready for
readiness classification, but not for implementation in this wave.

## DTO Design-Readiness Scope

This record decides whether each selected field-design track may proceed to a
future DTO contract planning wave.

Allowed in this record:

- readiness outcomes by track;
- likely future DTO name candidates;
- likely future DTO categories;
- top-level field-group candidates in prose;
- literal boundary-flag obligations;
- evidence/ref, omission marker, and version-ref structure obligations;
- future test obligations;
- risk and boundary classifications.

Not allowed in this record:

- TypeScript interfaces, exported source types, runtime/public source files,
  runtime APIs, package exports, package publication, tests, schemas, registry
  entries, bindings, SoloCrew edits, or MPLP edits.

Readiness does not mean bridge replacement readiness, downstream migration,
package dependency availability, runtime API approval, or protocol validation.
It means only that a future planning wave may draft exact type-only DTO
contracts under the constraints in this record.

## Current 16-Export Baseline

Cognitive_OS currently exposes exactly 16 private `runtime/public` package
subpaths:

| Surface family | Current exports | Current readiness implication |
| --- | --- | --- |
| operator review loop | `operator-review-loop-dto`, `operator-review-loop-handoff-bundle` | remains valid and unchanged |
| first-wave runtime DTOs | `runtime-readiness-status-dto`, `runtime-projection-summary-dto`, `runtime-execution-event-dto`, `runtime-objective-continuity-dto` | provides readiness/projection/event/objective refs for future DTO planning |
| second-wave DTOs | `state-port-summary-dto`, `persistence-roundtrip-evidence-dto`, `memory-preference-summary-dto`, `learning-correction-evidence-dto`, `runtime-action-request-summary-dto`, `runtime-dispatch-boundary-evidence-dto` | provides state/persistence/memory/learning/action/dispatch evidence refs |
| third-wave DTOs | `runtime-session-summary-dto`, `runtime-session-evidence-dto`, `worker-lifecycle-summary-dto`, `worker-lifecycle-evidence-dto` | provides runtime session and lifecycle posture/evidence refs |

The package export map is the current package truth. Some historical source
comments still say "not package-exported yet"; those comments are not edited
because this wave forbids DTO source changes.

The current exports remain type/evidence/public surfaces, not runtime
authority APIs. They omit runtime-private payloads, constructors, service
instances, mutable state handles, lifecycle transition authority, storage
write authority, mutation writeback authority, training authority, provider
dispatch, channel dispatch, and tool invocation.

This wave does not change the export map.

## MPLP Candidate / Protocol Boundary

MPLP MPGC backlog entries are non-normative background only:

- `MPGC-CANDIDATE-EVIDENCE-OMISSION-BOUNDARY-FLAGS-01`
- `MPGC-CANDIDATE-RUNTIME-SESSION-EVIDENCE-01`
- `MPGC-CANDIDATE-DOWNSTREAM-RUNTIME-BRIDGE-MIGRATION-01`
- `MPGC-CANDIDATE-PROJECTION-SAFE-PACKAGE-SURFACE-01`
- `MPGC-CANDIDATE-LEARNING-CORRECTION-EVIDENCE-01`

This readiness record does not request or perform any MPLP schema, spec,
core-law, module, profile, binding, conformance, certification, endorsement,
official implementation, or canonical implementation change. Cognitive_OS DTO
readiness remains implementation-layer planning, not protocol law.

## Readiness Evaluation Principles

- A track may proceed only if the field design can be represented as
  type-only, projection-safe, evidence-safe, non-executing, no-authority DTO
  contract planning.
- A track must not proceed if it requires constructors, service instances,
  stores, sqlite handles, live runtime handles, mutable records, lifecycle
  transition methods, provider dispatch, channel dispatch, tool invocation,
  storage writes, mutation writeback, or training authority.
- A track must not proceed if it requires SoloCrew product vocabulary,
  product display wording, local route language, or protocol-law naming.
- A track must not proceed if existing 16 exports already fully cover the
  neutral need.
- A track must not proceed if package/dependency strategy is a prerequisite.
- Conditions are allowed when they are future DTO-planning guardrails rather
  than current blockers.
- Runtime behavior, local storage policy, correction UX, preference
  application, dependency strategy, and bridge retirement timing remain
  downstream-owned unless a separate owner-authorized task changes that.
- MPLP remains candidate/non-normative background only.

## Runtime Session Behavior-Boundary Snapshot DTO Readiness

### Readiness Outcome

- candidate_id: CGOS-UPSTREAM-CANDIDATE-RUNTIME-SESSION-BEHAVIOR-SNAPSHOT-01
- selected design track: runtime session behavior-boundary snapshot
- likely DTO name candidate: `RuntimeSessionBehaviorBoundarySnapshotDto`
- likely package subpath candidate, not authorized here: `runtime-session-behavior-boundary-snapshot-dto`
- likely DTO category: runtime_public_snapshot_dto
- readiness outcome: READY_FOR_DTO_CONTRACT_PLANNING

### Field Completeness

| Dimension | Readiness |
| --- | --- |
| identity/version fields | ready; stable snapshot id, contract version, source surface version, source commit refs, and governance refs are defined |
| posture/result fields | ready; session availability, construction posture, dependency-family posture, state-mode posture, and blocker categories are defined |
| evidence refs | ready; readiness, projection, persistence, objective, session, and bounded execution refs are defined |
| omission markers | ready; runtime-private dependency bundles, services, stores, constructors, and live handles are explicit omissions |
| boundary flags | ready; projection-safe, evidence-safe, non-executing, no-authority, no constructor, no service instance, and no mutable state flags are required |
| version refs | ready; runtime contract, public surface, package export baseline, and governance refs are separated |
| future parity hints | ready with guardrail; hints must remain neutral and cannot encode downstream page or product vocabulary |

### Naming Readiness

Neutral naming is ready. The likely DTO name uses behavior-boundary and
snapshot language rather than constructor, facade, orchestrator, session
factory, product page, route, or protocol object language. Future contract
planning must reject runtime-private implementation names and SoloCrew product
display names.

### Boundary Readiness

Boundary posture is ready for future contract planning because the field
design is projection-safe, evidence-safe, runtime-private-payload omitted,
non-executing, and no-authority. The track explicitly denies constructors,
service instances, stores, sqlite handles, live runtime handles, mutable
records, lifecycle methods, provider dispatch, channel dispatch, tool
invocation, storage writes, mutation writeback, and training authority.

### Existing Export Relationship Readiness

Related current exports:

- `runtime-session-summary-dto`
- `runtime-session-evidence-dto`
- `runtime-readiness-status-dto`
- `runtime-projection-summary-dto`
- `state-port-summary-dto`
- `persistence-roundtrip-evidence-dto`
- `runtime-objective-continuity-dto`
- `runtime-execution-event-dto`

Non-duplication rationale: existing exports cover posture and evidence, but do
not compose a neutral behavior-boundary snapshot for construction dependency
families, state mode, and omitted private services. A future DTO would not
replace runtime behavior because it would carry only snapshot/evidence fields
and no constructors, services, stores, or live handles. Existing exports remain
valid and may become refs within the future contract.

### Future DTO Contract Shape Readiness

Likely top-level field groups:

- identity/version metadata;
- session posture;
- construction boundary posture;
- dependency family posture;
- state mode posture;
- safe evidence refs;
- omission markers;
- literal boundary flags;
- version refs;
- future parity hints.

Required literal boundary flags:

- `projection_safe: true`
- `evidence_safe: true`
- `runtime_private_payload_omitted: true`
- `non_executing: true`
- `no_authority: true`
- `no_constructor_exposure: true`
- `no_service_instance_exposure: true`
- `no_mutable_state_exposure: true`

Required evidence/ref objects must be bounded refs only and must not contain
live objects. Required omission markers must classify omitted constructor,
service, store, dependency-bundle, and live-handle families. Required version
refs must distinguish runtime/public surface refs from MPLP refs and package
export baseline refs. No runtime API fields are allowed.

### Test Readiness for Future Implementation

Future implementation must add tests for:

- type-only DTO source posture;
- package subpath resolution if an export is later authorized;
- empty or non-executing runtime module shape;
- no runtime/private imports;
- forbidden authority field grep;
- package export exactness;
- no positive forbidden claim grep.

### Risk Readiness

Main risks are constructor leakage, dependency-bundle leakage, duplicate
session posture fields, and downstream misreading of snapshots as behavior.
These risks are manageable in contract planning because forbidden field
families and literal boundary flags are already explicit.

## State Roundtrip Behavior-Result Snapshot DTO Readiness

### Readiness Outcome

- candidate_id: CGOS-UPSTREAM-CANDIDATE-STATE-ROUNDTRIP-BEHAVIOR-RESULT-01
- selected design track: state roundtrip behavior-result snapshot
- likely DTO name candidate: `StateRoundtripBehaviorResultSnapshotDto`
- likely package subpath candidate, not authorized here: `state-roundtrip-behavior-result-snapshot-dto`
- likely DTO category: runtime_public_result_snapshot_dto
- readiness outcome: READY_WITH_CONDITIONS

Conditions:

- future contract planning must rename or constrain any field that implies
  performing a roundtrip, reload, rehydration, persistence write, transaction,
  or storage adapter operation;
- future contract planning must use result/posture language only;
- future contract planning must keep sqlite mode choice and local storage
  policy downstream-owned.

### Field Completeness

| Dimension | Readiness |
| --- | --- |
| identity/version fields | ready; stable result snapshot id, contract version, source surface version, source commit refs, and governance refs are defined |
| posture/result fields | ready with conditions; state mode, roundtrip result posture, persistence posture, and reload/rehydration posture are defined as observed/result posture only |
| evidence refs | ready; state-port, persistence roundtrip, readiness, session, and objective continuity refs are defined |
| omission markers | ready; stores, sqlite handles, mutable records, transactions, raw snapshots, and storage adapters are explicit omissions |
| boundary flags | ready; projection-safe, evidence-safe, non-executing, no-authority, no storage write, no mutable state, and no mutation writeback flags are required |
| version refs | ready; runtime contract, public surface, package export baseline, and governance refs are separated |
| future parity hints | ready with guardrail; hints may cover reload posture and roundtrip evidence but cannot encode local storage policy vocabulary |

### Naming Readiness

Naming is ready with conditions. "Behavior-result snapshot" is acceptable only
if future contract planning makes clear that the DTO reports result posture and
does not perform behavior. Names such as sqlite adapter, state store, storage
writer, transaction runner, reload API, or rehydration API are not ready and
must be rejected.

### Boundary Readiness

Boundary posture is ready with conditions because the field design denies
storage write authority, mutation writeback, sqlite handles, stores, raw
records, live runtime handles, and transaction authority. Future planning must
ensure no field implies executable storage behavior.

### Existing Export Relationship Readiness

Related current exports:

- `state-port-summary-dto`
- `persistence-roundtrip-evidence-dto`
- `runtime-session-summary-dto`
- `runtime-session-evidence-dto`
- `runtime-readiness-status-dto`
- `runtime-objective-continuity-dto`

Non-duplication rationale: existing exports cover state-port posture and
persistence evidence, but do not compose state mode, reload/rehydration result
posture, roundtrip result posture, and storage omission posture into one
neutral result snapshot. A future DTO would not replace runtime behavior
because it would not read, write, reload, rehydrate, transact, or expose store
handles. Existing exports remain valid and may become refs within the future
contract.

### Future DTO Contract Shape Readiness

Likely top-level field groups:

- identity/version metadata;
- state mode posture;
- roundtrip result posture;
- persistence posture;
- reload/rehydration posture;
- safe evidence refs;
- omission markers;
- literal boundary flags;
- version refs;
- future parity hints.

Required literal boundary flags:

- `projection_safe: true`
- `evidence_safe: true`
- `runtime_private_payload_omitted: true`
- `non_executing: true`
- `no_authority: true`
- `no_storage_write: true`
- `no_mutable_state_exposure: true`
- `no_mutation_writeback: true`

Required evidence/ref objects must be bounded refs only and must not contain
raw records, sqlite handles, transactions, stores, or adapters. Required
omission markers must classify omitted store, sqlite, transaction, raw record,
and storage adapter families. Required version refs must distinguish runtime
contract refs, public surface refs, package export baseline refs, and
governance refs. No runtime API fields are allowed.

### Test Readiness for Future Implementation

Future implementation must add tests for:

- type-only DTO source posture;
- package subpath resolution if an export is later authorized;
- empty or non-executing runtime module shape;
- no runtime/private imports;
- forbidden authority field grep for store, sqlite, transaction, reload,
  rehydration, write, adapter, and mutable record terms;
- package export exactness;
- no positive forbidden claim grep.

### Risk Readiness

Main risks are duplicate state/persistence fields, storage behavior leakage,
sqlite policy contamination, and downstream treating evidence as replacement
storage behavior. These risks are acceptable only with the listed conditions
and must remain visible in the next contract planning wave.

## Learning / Correction Behavior-Result Snapshot DTO Readiness

### Readiness Outcome

- candidate_id: CGOS-UPSTREAM-CANDIDATE-LEARNING-CORRECTION-BEHAVIOR-RESULT-01
- selected design track: learning/correction behavior-result snapshot
- likely DTO name candidate: `LearningCorrectionBehaviorResultSnapshotDto`
- likely package subpath candidate, not authorized here: `learning-correction-behavior-result-snapshot-dto`
- likely DTO category: runtime_public_result_snapshot_dto
- readiness outcome: READY_WITH_CONDITIONS

Conditions:

- future contract planning must keep correction capture and preference effect
  fields as observed/result posture, not writeback behavior;
- future contract planning must not imply training, mutation writeback,
  preference application, or correction UX policy;
- future contract planning must keep objective anchor behavior and comparison
  services private or downstream-owned.

### Field Completeness

| Dimension | Readiness |
| --- | --- |
| identity/version fields | ready; stable result snapshot id, contract version, source surface version, source commit refs, and governance refs are defined |
| posture/result fields | ready with conditions; correction capture posture, preference effect posture, objective comparison refs, and learning/correction result posture are defined as evidence/result posture only |
| evidence refs | ready; learning correction, memory preference, objective continuity, readiness, projection, and session evidence refs are defined |
| omission markers | ready; training pipelines, preference writeback services, correction services, anchor stores, mutation functions, and private records are explicit omissions |
| boundary flags | ready; projection-safe, evidence-safe, non-executing, no-authority, no training, no mutation writeback, and no preference writeback handle flags are required |
| version refs | ready; runtime contract, public surface, package export baseline, and governance refs are separated |
| future parity hints | ready with guardrail; hints may support correction display and preference posture parity but cannot encode product UX wording |

### Naming Readiness

Naming is ready with conditions. "Behavior-result snapshot" is acceptable only
if future contract planning makes clear that the DTO reports result posture and
does not capture corrections, apply preferences, mutate memory, or train
models. Names such as correction service, preference writeback API, learning
pipeline, training hook, objective anchor service, or product correction UX are
not ready and must be rejected.

### Boundary Readiness

Boundary posture is ready with conditions because the field design denies
training authority, mutation writeback, preference writeback service handles,
correction capture service handles, objective anchor stores, live handles, and
mutable records. Future planning must ensure no field implies executable
learning or preference behavior.

### Existing Export Relationship Readiness

Related current exports:

- `learning-correction-evidence-dto`
- `memory-preference-summary-dto`
- `runtime-objective-continuity-dto`
- `runtime-projection-summary-dto`
- `runtime-readiness-status-dto`
- `runtime-session-evidence-dto`

Non-duplication rationale: existing exports cover correction evidence,
memory/preference summary, objective continuity, projection, readiness, and
session evidence, but do not compose capture posture, preference effect
posture, objective comparison refs, and mutation-service omissions into one
neutral result snapshot. A future DTO would not replace runtime behavior
because it would not capture corrections, apply preferences, mutate memory,
write back learning state, or train models. Existing exports remain valid and
may become refs within the future contract.

### Future DTO Contract Shape Readiness

Likely top-level field groups:

- identity/version metadata;
- correction capture posture;
- preference effect posture;
- objective comparison refs;
- learning/correction result posture;
- safe evidence refs;
- omission markers;
- literal boundary flags;
- version refs;
- future parity hints.

Required literal boundary flags:

- `projection_safe: true`
- `evidence_safe: true`
- `runtime_private_payload_omitted: true`
- `non_executing: true`
- `no_authority: true`
- `no_training_authority: true`
- `no_mutation_writeback: true`
- `no_preference_writeback_service_handle: true`

Required evidence/ref objects must be bounded refs only and must not contain
correction services, preference services, training pipelines, anchor stores, or
private records. Required omission markers must classify omitted training,
writeback, correction service, preference service, objective anchor, and
mutation function families. Required version refs must distinguish runtime
contract refs, public surface refs, package export baseline refs, and
governance refs. No runtime API fields are allowed.

### Test Readiness for Future Implementation

Future implementation must add tests for:

- type-only DTO source posture;
- package subpath resolution if an export is later authorized;
- empty or non-executing runtime module shape;
- no runtime/private imports;
- forbidden authority field grep for training, mutation, writeback,
  correction service, preference service, anchor store, and private record
  terms;
- package export exactness;
- no positive forbidden claim grep.

### Risk Readiness

Main risks are writeback overclaim, product correction UX contamination,
training implication, duplicate learning evidence fields, and downstream
misreading of result posture as preference application behavior. These risks
are acceptable only with the listed conditions and must remain visible in the
next contract planning wave.

## Cross-Track DTO Readiness Matrix

| Track | Field completeness | Naming readiness | Boundary readiness | Existing export relationship | Future contract shape | Test readiness | Risk readiness | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| runtime session behavior-boundary snapshot | ready | ready | ready | ready; current exports partial and remain valid | ready for snapshot DTO planning | ready | manageable | READY_FOR_DTO_CONTRACT_PLANNING |
| state roundtrip behavior-result snapshot | ready with conditions | ready with conditions | ready with conditions | ready; current exports partial and remain valid | ready with conditions for result snapshot planning | ready | manageable with conditions | READY_WITH_CONDITIONS |
| learning/correction behavior-result snapshot | ready with conditions | ready with conditions | ready with conditions | ready; current exports partial and remain valid | ready with conditions for result snapshot planning | ready | manageable with conditions | READY_WITH_CONDITIONS |

No track is approved for implementation. The two conditional outcomes are not
blockers for future contract planning; they are mandatory guardrails for that
future planning wave.

## Future DTO Contract Shape Candidates

| Candidate DTO name | Candidate subpath, not authorized here | Category | Top-level field groups | Contract-planning posture |
| --- | --- | --- | --- | --- |
| `RuntimeSessionBehaviorBoundarySnapshotDto` | `runtime-session-behavior-boundary-snapshot-dto` | runtime_public_snapshot_dto | identity/version, session posture, construction boundary posture, dependency family posture, state mode posture, safe evidence refs, omission markers, boundary flags, version refs, parity hints | may be planned next |
| `StateRoundtripBehaviorResultSnapshotDto` | `state-roundtrip-behavior-result-snapshot-dto` | runtime_public_result_snapshot_dto | identity/version, state mode posture, roundtrip result posture, persistence posture, reload/rehydration posture, safe evidence refs, omission markers, boundary flags, version refs, parity hints | may be planned next with conditions |
| `LearningCorrectionBehaviorResultSnapshotDto` | `learning-correction-behavior-result-snapshot-dto` | runtime_public_result_snapshot_dto | identity/version, correction capture posture, preference effect posture, objective comparison refs, learning/correction result posture, safe evidence refs, omission markers, boundary flags, version refs, parity hints | may be planned next with conditions |

These are candidate names only. They do not create source files, package
exports, package subpaths, runtime APIs, schemas, registry entries, bindings,
or downstream migration status.

## Future Test Obligations

Any future DTO implementation-planning or implementation wave must require:

- type-only source posture checks for each future DTO file;
- package subpath resolution tests only after package export authorization;
- empty or non-executing runtime module shape tests;
- forbidden runtime/private import tests;
- forbidden authority field grep for constructors, services, stores, sqlite
  handles, live handles, mutable records, lifecycle methods, provider dispatch,
  channel dispatch, tool invocation, storage writes, mutation writeback, and
  training authority;
- package export exactness tests;
- no positive forbidden claim grep;
- package/private path grep to ensure no `runtime/core`, `runtime/state`,
  `runtime/lifecycle`, `runtime/learning`, `runtime/execution`, schema,
  registry, or binding surfaces are exposed;
- downstream vocabulary grep for SoloCrew product-specific names if any future
  DTO source is created.

## Existing Export Relationship

The existing 16 exports remain valid and unchanged. They are insufficient only
for the three neutral composition/result needs selected here:

- runtime session behavior-boundary snapshot composes session, readiness,
  projection, state, persistence, objective, and event evidence into one
  construction/dependency/state-mode boundary posture;
- state roundtrip behavior-result snapshot composes state-port and persistence
  evidence into one result/reload/storage-omission posture;
- learning/correction behavior-result snapshot composes learning correction,
  memory preference, objective continuity, projection, readiness, and session
  evidence into one capture/preference-effect/mutation-omission posture.

These future DTO candidates would not replace runtime behavior. Existing
exports remain the preferred first-use surfaces for all other deferred or
existing-export-first candidate areas.

## Downstream Ownership Boundary

SoloCrew remains responsible for downstream product behavior and migration
sequencing:

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

Future Cognitive_OS DTO contract planning may define neutral evidence/result
contracts, but it must not take ownership of downstream product law or runtime
behavior by convenience.

## Why No Implementation Is Authorized

No implementation is authorized because this wave is DTO design-readiness only.
It intentionally stops before:

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

The next Cognitive_OS step, if owner-approved, should draft exact DTO contract
plans under these readiness guardrails. It still must not implement DTO source
unless a later implementation task explicitly authorizes that.

## Risk Register

| Risk | Severity | Readiness response |
| --- | --- | --- |
| runtime behavior leakage into DTO planning | High | all outcomes require type-only, non-executing, no-authority contract planning |
| state/sqlite policy contamination | High | state track is ready with conditions; local storage policy remains downstream-owned |
| correction UX or preference application contamination | High | learning track is ready with conditions; correction UX and preference application remain downstream-owned |
| duplicate existing export fields | Medium | contract planning must use refs and composition rather than widening existing DTOs by copy |
| overclaim that DTOs replace behavior | High | every track states why future DTOs would not replace runtime behavior |
| package/export sequencing confusion | Medium | subpaths are candidates only; export changes require separate authorization |
| protocol pollution | High | MPLP remains candidate/non-normative background only |
| false readiness | Medium | conditional outcomes are used where storage/writeback risks remain |
| downstream dependency overclaim | Medium | dependency strategy remains out of scope |

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
| `git diff --cached --check` | PASS |
| `npm run test:runtime` | PASS, 259 tests, 0 skipped |
| `./node_modules/.bin/tsc --noEmit` | PASS |
| package export count check | PASS, exactly 16 approved private exports |
| protected path diff check | PASS, no package/runtime/DTO/schema/registry/binding/test diff |
| forbidden claim grep on changed files | PASS with classification: hits are negative guardrails only |
| forbidden package/private path grep | PASS, package exports contain no forbidden private paths |
| SoloCrew head/status check | PASS, clean/read-only at expected reference |
| MPLP-Protocol head/status check | PASS, clean/read-only at expected reference |

Final check details are reported in the task final report after commit.

## Decision

Selected:

`CGOS_UPSTREAM_PUBLIC_SURFACE_DTO_DESIGN_READINESS_READY_NO_IMPLEMENTATION`

Rejected:

- `CGOS_UPSTREAM_PUBLIC_SURFACE_DTO_DESIGN_READINESS_READY_WITH_CONDITIONS`
- `CGOS_UPSTREAM_PUBLIC_SURFACE_DTO_DESIGN_READINESS_BLOCKED`

Meaning:

- all three tracks receive a readiness outcome;
- at least one track is ready for future DTO contract planning;
- conditional outcomes are planning guardrails, not implementation approval;
- no track is falsely advanced into runtime behavior;
- current 16 exports are not overclaimed;
- downstream-owned SoloCrew behavior remains explicitly separated;
- no runtime/public source, package export, runtime API, schema, registry,
  binding, SoloCrew, or MPLP change occurs;
- no implementation starts;
- no P0/P1 blocker remains for the next planning wave.

## Next Allowed Task

Recommended first:

`CGOS-UPSTREAM-PUBLIC-SURFACE-DTO-CONTRACT-PLANNING-WAVE-01`

Reason:

- the three selected tracks now have field families and DTO readiness
  outcomes;
- contract planning is the narrowest next Cognitive_OS step that can convert
  readiness into exact non-executing type-only contract plans without touching
  source;
- SoloCrew existing-export parity work remains valuable, but it should not
  assume candidate DTO names or field groups until contract planning fixes the
  neutral contract shape and conditions.

Alternative after DTO contract planning:

`SOLOCREW-EXISTING-CGOS-EXPORTS-EXERCISE-PARITY-WAVE-01`

Owner may also pause development.
