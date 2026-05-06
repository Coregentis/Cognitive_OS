# CGOS-UPSTREAM-PUBLIC-SURFACE-FIELD-DESIGN-WAVE-v0.1

## Document Control

- doc_id: CGOS-UPSTREAM-PUBLIC-SURFACE-FIELD-DESIGN-WAVE-v0.1
- task_id: CGOS-UPSTREAM-PUBLIC-SURFACE-FIELD-DESIGN-WAVE-01
- status: upstream public-surface field design only
- date: 2026-05-06
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: 62b1111b043d1908b5329f3093a0aaf46366a1ce
- solocrew_reference_head: bac12dd5548e85fb3c5804481418ab6d0097c69c
- mplp_reference_head: 214939ab6ba522036d376868d1fe8d04d960420f
- selected_design_candidate_count: 3
- no_implementation_change: true
- no_runtime_public_source_change: true
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
this field-design record was created.

| Repo | Local HEAD | origin/main HEAD | Expected | Worktree |
| --- | --- | --- | --- | --- |
| Cognitive_OS | `62b1111b043d1908b5329f3093a0aaf46366a1ce` | `62b1111b043d1908b5329f3093a0aaf46366a1ce` | `62b1111b043d1908b5329f3093a0aaf46366a1ce` | clean before edits |
| SoloCrew | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | clean, read-only |
| MPLP-Protocol | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | clean, read-only |

This wave modifies only this Cognitive_OS governance planning record and the
Cognitive_OS changelog. It does not modify runtime source, DTO source, package
exports, schemas, registry entries, bindings, runtime behavior, tests, package
files, publication state, release state, SoloCrew, or MPLP-Protocol.

## Input Baselines Inspected

Cognitive_OS inputs inspected:

- `governance/planning/CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-v0.1.md`
- `governance/planning/CGOS-UPSTREAM-PUBLIC-SURFACE-REQUEST-CANDIDATE-WAVE-v0.1.md`
- `governance/planning/CGOS-THIRD-WAVE-RUNTIME-SESSION-WORKER-LIFECYCLE-FIELD-DESIGN-WAVE-v0.1.md`
- `package.json`
- all current `runtime/public/*.ts` DTO/evidence/public bundle files

SoloCrew read-only inputs inspected:

- `governance/planning/TRI-REPO-BRIDGE-REPLACEMENT-PLAN-WAVE-v0.1.md`
- `governance/audits/SOLOCREW-CGOS-LEGACY-BRIDGE-OWNERSHIP-AND-QUARANTINE-WAVE-v0.1.md`

MPLP-Protocol read-only input inspected:

- `governance/candidates/MPGC-CANDIDATE-BACKLOG-v0.1.md`

The inspected baselines show exactly three selected upstream request
candidates for this field-design wave:

- `CGOS-UPSTREAM-CANDIDATE-RUNTIME-SESSION-BEHAVIOR-SNAPSHOT-01`
- `CGOS-UPSTREAM-CANDIDATE-STATE-ROUNDTRIP-BEHAVIOR-RESULT-01`
- `CGOS-UPSTREAM-CANDIDATE-LEARNING-CORRECTION-BEHAVIOR-RESULT-01`

All three tracks are evidence/snapshot/result field-design tracks only. They
are not DTO implementation tracks, runtime API tracks, package export tracks,
schema tracks, registry tracks, or binding tracks.

## Field Design Scope

This record defines neutral field families for later DTO design-readiness
review. It intentionally stops before source implementation.

Allowed in this record:

- candidate identities and selected design track names;
- field family names and intended posture;
- required positive constraints;
- forbidden field families;
- future DTO shape constraints;
- relationship to the existing 16 exports;
- downstream ownership boundaries;
- MPLP candidate-only background.

Not allowed in this record:

- TypeScript interfaces, exported types, runtime/public source files, runtime
  APIs, package exports, tests, schemas, registry entries, bindings, package
  publication, release artifacts, SoloCrew edits, or MPLP edits.

Product demand still originates downstream from SoloCrew needs for runtime
session continuity, state/sqlite roundtrip confidence, correction/preference
continuity, and bridge debt reduction. Cognitive_OS may design neutral
projection/evidence field families, but it must not absorb SoloCrew product
display law or downstream local behavior.

## Current 16-Export Baseline

Cognitive_OS currently exposes exactly 16 private `runtime/public` package
subpaths:

| Surface family | Current exports | Relationship to this field design |
| --- | --- | --- |
| operator review loop | `operator-review-loop-dto`, `operator-review-loop-handoff-bundle` | prior safe handoff evidence; not extended here |
| first-wave runtime DTOs | `runtime-readiness-status-dto`, `runtime-projection-summary-dto`, `runtime-execution-event-dto`, `runtime-objective-continuity-dto` | readiness, projection, bounded event, and objective continuity refs may be cited |
| second-wave DTOs | `state-port-summary-dto`, `persistence-roundtrip-evidence-dto`, `memory-preference-summary-dto`, `learning-correction-evidence-dto`, `runtime-action-request-summary-dto`, `runtime-dispatch-boundary-evidence-dto` | direct inputs for state roundtrip and learning/correction field families |
| third-wave DTOs | `runtime-session-summary-dto`, `runtime-session-evidence-dto`, `worker-lifecycle-summary-dto`, `worker-lifecycle-evidence-dto` | direct inputs for runtime session behavior-boundary field families |

The current exports remain DTO/evidence surfaces, not runtime authority APIs.
They omit runtime-private payloads, constructors, service instances, mutable
state handles, worker lifecycle transition authority, storage write authority,
mutation writeback authority, training authority, provider dispatch, channel
dispatch, and tool invocation.

This wave does not add, remove, widen, rename, or publish any export.

## MPLP Candidate / Protocol Boundary

MPLP MPGC backlog entries are non-normative background only:

- `MPGC-CANDIDATE-EVIDENCE-OMISSION-BOUNDARY-FLAGS-01`
- `MPGC-CANDIDATE-RUNTIME-SESSION-EVIDENCE-01`
- `MPGC-CANDIDATE-DOWNSTREAM-RUNTIME-BRIDGE-MIGRATION-01`
- `MPGC-CANDIDATE-PROJECTION-SAFE-PACKAGE-SURFACE-01`
- `MPGC-CANDIDATE-LEARNING-CORRECTION-EVIDENCE-01`

This Cognitive_OS record does not request or perform any MPLP schema, spec,
core-law, module, profile, binding, conformance, certification, endorsement,
official implementation, or canonical implementation change. Field families
defined here are implementation-layer planning material, not protocol law.

## Global Field Design Principles

- Projection-safe: fields describe bounded posture, summary, refs, or evidence
  suitable for downstream projection.
- Evidence-safe: fields point to safe evidence refs or bounded result posture,
  never live runtime payloads.
- Runtime-private-payload omitted: every track must make private omissions
  explicit.
- Non-executing: fields must not create sessions, run state roundtrips, capture
  corrections, mutate preferences, dispatch actions, invoke tools, or call
  lifecycle transitions.
- No-authority: fields must not grant storage write, mutation writeback,
  training, provider dispatch, channel dispatch, tool invocation, lifecycle
  transition, or runtime construction authority.
- Versioned: every future DTO direction must carry contract and runtime/public
  surface version refs.
- Explicit boundaries: safe evidence refs, omission markers, and boundary
  flags are required in each track.
- Neutral vocabulary: fields must avoid SoloCrew product-specific names,
  product display wording, page language, and downstream route concepts.
- Implementation-layer only: field families are not MPLP protocol law and are
  not evidence of conformance, certification, endorsement, or official
  implementation status.

## Runtime Session Behavior-Boundary Snapshot Field Design

### Candidate Identity

- candidate_id: CGOS-UPSTREAM-CANDIDATE-RUNTIME-SESSION-BEHAVIOR-SNAPSHOT-01
- selected design track name: runtime session behavior-boundary snapshot
- source SoloCrew usage family: runtime session creation/posture
- gap type: behavior_gap
- selected outcome from prior wave: ADVANCE_TO_NEUTRAL_FIELD_DESIGN
- field-design status: READY_FOR_DTO_DESIGN_READINESS_REVIEW

### Field Family Design

| Field family | Intended posture |
| --- | --- |
| identity/version fields | stable snapshot id, contract version, source surface version, and source commit/version refs |
| session posture fields | session availability posture, readiness posture, construction attempt posture, and result posture without constructors |
| dependency family posture fields | summarized dependency-family presence/omission posture for state, memory, learning, objective, dispatch, lifecycle, projection, and observability families |
| state mode posture fields | in-memory, persisted, unavailable, or unknown state mode posture without storage handles |
| construction boundary fields | created/deferred/blocked posture, blocker category, and omitted constructor/service families without executable details |
| safe evidence refs | refs to readiness, projection, persistence, objective, session, and bounded execution evidence |
| omission markers | machine-readable markers for omitted runtime-private dependency bundles, services, stores, constructors, and live handles |
| boundary flags | projection_safe, evidence_safe, non_executing, no_authority, runtime_private_payload_omitted, no_constructor_exposure, no_service_instance_exposure, no_mutable_state_exposure |
| version refs | runtime contract version, public surface version, package export baseline ref, and source governance refs |
| future parity hints | optional neutral hints for future downstream parity checks without product page vocabulary |

### Required Positive Constraints

- The field design must be projection-safe, evidence-safe, runtime-private
  payload omitted, non-executing, no-authority, versioned, and neutral.
- It must include safe evidence refs, omission markers, and explicit boundary
  flags.
- It must avoid SoloCrew product display law and must remain implementation
  layer, not protocol law.

### Required Forbidden Fields

Forbidden for this track:

- constructors and constructor arguments;
- service instances and dependency bundles;
- stores, sqlite handles, live runtime handles, and mutable state records;
- lifecycle transition methods;
- provider dispatch, channel dispatch, and tool invocation;
- storage write authority and mutation writeback authority;
- training authority;
- runtime-private imports;
- schema, registry, or binding references as implementation authority;
- SoloCrew product-specific names;
- MPLP conformance, certification, or endorsement flags.

### Future DTO Shape Constraints

- Allowed future DTO direction: type-only runtime/public snapshot or evidence
  DTO if a later readiness wave approves it.
- Required type-only posture: future source must export types only and must not
  execute runtime behavior.
- Expected runtime module shape if package-exported later: empty or
  non-executing runtime shape consistent with existing type-only DTO export
  tests.
- Package export preconditions: separate DTO implementation, export readiness,
  export implementation, and export verification waves.
- Runtime behavior API non-goals: no session constructor API, no factory API,
  no live dependency accessor, and no orchestrator façade.
- Future test obligations: type-only import tests, package subpath resolution
  tests, no private-path export tests, and runtime module shape tests.
- Future grep obligations: scan for constructor/service/store/dispatch/tool/
  writeback/training authority and forbidden positive claims.

### Existing 16-Export Relationship

Related exports:

- `runtime-session-summary-dto`
- `runtime-session-evidence-dto`
- `runtime-readiness-status-dto`
- `runtime-projection-summary-dto`
- `state-port-summary-dto`
- `persistence-roundtrip-evidence-dto`
- `runtime-objective-continuity-dto`
- `runtime-execution-event-dto`

Existing exports already cover session posture, session evidence, readiness,
projection summary, state-port posture, persistence roundtrip evidence,
objective continuity, and bounded event evidence. This field design adds a
neutral behavior-boundary composition layer for construction/dependency/state
mode posture. It is not duplicate because it organizes cross-family boundary
posture; it does not replace runtime behavior because it carries no
constructors, services, stores, or live handles.

### Downstream Ownership Boundary

SoloCrew retains ownership of local runtime session facade creation, shell
lifecycle wiring, sqlite mode choice, product return-flow behavior, dependency
strategy, and bridge retirement timing. Runtime-private constructor and
service implementation remains private. Future SoloCrew parity evidence must
show exactly which session boundary fields are needed before any DTO
implementation request is authorized.

### MPLP Boundary

Relevant MPGC background:

- `MPGC-CANDIDATE-RUNTIME-SESSION-EVIDENCE-01`
- `MPGC-CANDIDATE-EVIDENCE-OMISSION-BOUNDARY-FLAGS-01`
- `MPGC-CANDIDATE-DOWNSTREAM-RUNTIME-BRIDGE-MIGRATION-01`

No MPLP schema, spec, core-law, profile, or binding change is needed. This is
not protocol law; it is a Cognitive_OS implementation-layer field-design
record for possible future DTO review.

## State Roundtrip Behavior-Result Snapshot Field Design

### Candidate Identity

- candidate_id: CGOS-UPSTREAM-CANDIDATE-STATE-ROUNDTRIP-BEHAVIOR-RESULT-01
- selected design track name: state roundtrip behavior-result snapshot
- source SoloCrew usage family: state/sqlite posture
- gap type: behavior_gap
- selected outcome from prior wave: ADVANCE_TO_NEUTRAL_FIELD_DESIGN
- field-design status: READY_FOR_DTO_DESIGN_READINESS_REVIEW

### Field Family Design

| Field family | Intended posture |
| --- | --- |
| identity/version fields | stable result snapshot id, contract version, source surface version, and source commit/version refs |
| state mode fields | in-memory, persisted, unavailable, degraded, or unknown state mode posture without store or sqlite handle exposure |
| roundtrip result fields | attempted/not attempted posture, success/degraded/failed/unknown result posture, evidence category, and blocked reason category |
| persistence posture fields | persistence availability posture, durability posture, reload posture, and storage-private omission posture |
| reload/rehydration posture fields | reload attempted posture, rehydration result posture, and safe comparison refs without raw records |
| safe evidence refs | refs to state port summaries, persistence roundtrip evidence, readiness summaries, session evidence, and objective continuity evidence |
| omission markers | markers for omitted stores, sqlite handles, mutable records, transactions, raw snapshots, and storage adapters |
| boundary flags | projection_safe, evidence_safe, non_executing, no_authority, runtime_private_payload_omitted, no_storage_write, no_mutable_state_exposure, no_mutation_writeback |
| version refs | runtime contract version, public surface version, package export baseline ref, and source governance refs |
| future parity hints | optional neutral hints for downstream parity checks around reload posture and roundtrip evidence without local storage policy vocabulary |

### Required Positive Constraints

- The field design must be projection-safe, evidence-safe, runtime-private
  payload omitted, non-executing, no-authority, versioned, and neutral.
- It must include safe evidence refs, omission markers, and explicit boundary
  flags.
- It must describe result posture only; it must not become a storage adapter,
  sqlite adapter, transaction API, or write surface.

### Required Forbidden Fields

Forbidden for this track:

- stores, sqlite handles, live runtime handles, mutable state records, raw
  records, transactions, state mutation functions, and storage adapter handles;
- constructors and service instances;
- storage write authority and mutation writeback authority;
- lifecycle transition methods;
- provider dispatch, channel dispatch, and tool invocation;
- training authority;
- runtime-private imports;
- schema, registry, or binding references as implementation authority;
- SoloCrew product-specific names and local storage policy names;
- MPLP conformance, certification, or endorsement flags.

### Future DTO Shape Constraints

- Allowed future DTO direction: type-only runtime/public evidence or result
  snapshot DTO if a later readiness wave approves it.
- Required type-only posture: future source must export types only and must not
  execute state roundtrips, reloads, writes, or rehydration.
- Expected runtime module shape if package-exported later: empty or
  non-executing runtime shape consistent with existing type-only DTO export
  tests.
- Package export preconditions: separate DTO implementation, export readiness,
  export implementation, and export verification waves.
- Runtime behavior API non-goals: no storage adapter API, no sqlite API, no
  state store API, no transaction API, and no writeback API.
- Future test obligations: type-only import tests, package subpath resolution
  tests, no private-path export tests, and no storage/write authority scans.
- Future grep obligations: scan for sqlite handles, stores, mutable records,
  write authority, mutation authority, and forbidden positive claims.

### Existing 16-Export Relationship

Related exports:

- `state-port-summary-dto`
- `persistence-roundtrip-evidence-dto`
- `runtime-session-summary-dto`
- `runtime-session-evidence-dto`
- `runtime-readiness-status-dto`
- `runtime-objective-continuity-dto`

Existing exports already cover state-port posture and persistence roundtrip
evidence. This field design adds a neutral behavior-result snapshot layer that
can describe mode, reload, rehydration, result posture, and omitted storage
authority together. It is not duplicate because current exports do not compose
the state mode and roundtrip result boundary; it does not replace runtime
behavior because it cannot perform storage writes, reads, reloads, or
rehydration.

### Downstream Ownership Boundary

SoloCrew retains ownership of local sqlite/in-memory mode choice, local store
lifecycle, reload behavior, data-loss policy, dependency strategy, and bridge
retirement timing. Runtime-private state stores and sqlite implementation
remain private. Future SoloCrew parity evidence must show which result posture
fields are needed and whether local ownership is sufficient before any DTO
implementation request is authorized.

### MPLP Boundary

Relevant MPGC background:

- `MPGC-CANDIDATE-EVIDENCE-OMISSION-BOUNDARY-FLAGS-01`
- `MPGC-CANDIDATE-DOWNSTREAM-RUNTIME-BRIDGE-MIGRATION-01`
- `MPGC-CANDIDATE-PROJECTION-SAFE-PACKAGE-SURFACE-01`

No MPLP schema, spec, core-law, profile, or binding change is needed. This is
not protocol law; it is a Cognitive_OS implementation-layer field-design
record for possible future DTO review.

## Learning / Correction Behavior-Result Snapshot Field Design

### Candidate Identity

- candidate_id: CGOS-UPSTREAM-CANDIDATE-LEARNING-CORRECTION-BEHAVIOR-RESULT-01
- selected design track name: learning/correction behavior-result snapshot
- source SoloCrew usage family: learning/correction posture
- gap type: behavior_gap
- selected outcome from prior wave: ADVANCE_TO_NEUTRAL_FIELD_DESIGN
- field-design status: READY_FOR_DTO_DESIGN_READINESS_REVIEW

### Field Family Design

| Field family | Intended posture |
| --- | --- |
| identity/version fields | stable result snapshot id, contract version, source surface version, and source commit/version refs |
| correction capture posture fields | captured/not captured/deferred/blocked posture, safe correction evidence category, and blocker reason category without capture service exposure |
| preference effect posture fields | candidate preference effect posture, applied/not applied/deferred/unknown posture, and omitted writeback service markers |
| objective comparison refs | safe refs to objective continuity or comparison evidence without anchor store or comparison service exposure |
| learning/correction result fields | result status, correction family, learning signal posture, reviewability posture, and no-training/no-writeback posture |
| safe evidence refs | refs to learning correction evidence, memory preference summary, objective continuity, readiness, projection, and session evidence |
| omission markers | markers for omitted training pipelines, preference writeback services, correction services, anchor stores, mutation functions, and private records |
| boundary flags | projection_safe, evidence_safe, non_executing, no_authority, runtime_private_payload_omitted, no_training_authority, no_mutation_writeback, no_preference_writeback_service_handle |
| version refs | runtime contract version, public surface version, package export baseline ref, and source governance refs |
| future parity hints | optional neutral hints for downstream parity checks around correction display and preference posture without product UX vocabulary |

### Required Positive Constraints

- The field design must be projection-safe, evidence-safe, runtime-private
  payload omitted, non-executing, no-authority, versioned, and neutral.
- It must include safe evidence refs, omission markers, and explicit boundary
  flags.
- It must describe result posture only; it must not grant training, mutation
  writeback, preference writeback, or correction capture authority.

### Required Forbidden Fields

Forbidden for this track:

- training authority, model training hooks, learning pipeline handles,
  mutation writeback authority, preference writeback service handles,
  correction capture service handles, objective anchor stores, and comparison
  service handles;
- constructors, service instances, stores, live runtime handles, and mutable
  state records;
- storage write authority;
- lifecycle transition methods;
- provider dispatch, channel dispatch, and tool invocation;
- runtime-private imports;
- schema, registry, or binding references as implementation authority;
- SoloCrew product-specific names, product correction UX names, and page
  display wording;
- MPLP conformance, certification, or endorsement flags.

### Future DTO Shape Constraints

- Allowed future DTO direction: type-only runtime/public evidence or result
  snapshot DTO if a later readiness wave approves it.
- Required type-only posture: future source must export types only and must not
  capture corrections, apply preferences, mutate memory, train models, or write
  back learning state.
- Expected runtime module shape if package-exported later: empty or
  non-executing runtime shape consistent with existing type-only DTO export
  tests.
- Package export preconditions: separate DTO implementation, export readiness,
  export implementation, and export verification waves.
- Runtime behavior API non-goals: no correction capture API, no preference
  writeback API, no learning service API, no training API, and no objective
  anchor service API.
- Future test obligations: type-only import tests, package subpath resolution
  tests, no private-path export tests, and no training/writeback authority
  scans.
- Future grep obligations: scan for training, mutation writeback, preference
  service handles, correction service handles, objective anchor stores, and
  forbidden positive claims.

### Existing 16-Export Relationship

Related exports:

- `learning-correction-evidence-dto`
- `memory-preference-summary-dto`
- `runtime-objective-continuity-dto`
- `runtime-projection-summary-dto`
- `runtime-readiness-status-dto`
- `runtime-session-evidence-dto`

Existing exports already cover correction evidence, memory/preference summary,
objective continuity, projection, readiness, and session evidence. This field
design adds a neutral behavior-result snapshot layer for capture posture,
candidate preference effect posture, objective comparison refs, and omitted
mutation services. It is not duplicate because current exports do not compose
capture/result/writeback-omission posture; it does not replace runtime behavior
because it cannot capture corrections, apply preferences, mutate memory, or
train models.

### Downstream Ownership Boundary

SoloCrew retains ownership of correction UX policy, preference application
policy, product wording, local review flows, dependency strategy, and bridge
retirement timing unless a separate owner-authorized design changes that
boundary. Runtime-private correction capture, preference writeback, and
objective anchor behavior remain private. Future SoloCrew parity evidence must
show exact result-posture needs before any DTO implementation request is
authorized.

### MPLP Boundary

Relevant MPGC background:

- `MPGC-CANDIDATE-LEARNING-CORRECTION-EVIDENCE-01`
- `MPGC-CANDIDATE-EVIDENCE-OMISSION-BOUNDARY-FLAGS-01`
- `MPGC-CANDIDATE-DOWNSTREAM-RUNTIME-BRIDGE-MIGRATION-01`

No MPLP schema, spec, core-law, profile, or binding change is needed. This is
not protocol law; it is a Cognitive_OS implementation-layer field-design
record for possible future DTO review.

## Cross-Track Field Consistency Rules

All three tracks must use consistent field-family posture:

- identity/version fields must identify the snapshot/result and the contract
  baseline without exposing runtime-private object identity;
- safe evidence refs must reference bounded public evidence or governance refs,
  not live runtime objects;
- omission markers must be explicit and machine-readable;
- boundary flags must make no-authority posture visible;
- result/posture fields must describe observed or declared posture, not
  execute behavior;
- future parity hints must stay neutral and must not encode SoloCrew page,
  route, dashboard, cell, customer, founder, engagement, or product display
  vocabulary;
- version refs must distinguish runtime/public surface version, source commit
  refs, and governance refs from MPLP protocol versioning;
- field families must be additive planning material until a later readiness
  wave selects exact DTO names and source implementation constraints.

## Forbidden Field Families

The following field families are forbidden globally:

- constructors;
- service instances;
- stores;
- sqlite handles;
- live runtime handles;
- mutable state records;
- lifecycle transition methods;
- provider dispatch;
- channel dispatch;
- tool invocation;
- training authority;
- mutation writeback authority;
- preference writeback service handles;
- storage write authority;
- runtime-private imports;
- schema, registry, or binding references as implementation authority;
- SoloCrew product-specific names;
- MPLP conformance, certification, or endorsement flags.

If a later wave needs to mention one of these items, it must do so only as an
omission marker, boundary flag, or forbidden-field classification.

## Future DTO Shape Constraints

Any future DTO readiness or implementation wave for these tracks must satisfy:

- source files remain type-only, projection-safe, evidence-safe, non-executing,
  no-authority, and runtime-private-payload omitted;
- runtime module shape remains empty or non-executing when package subpaths are
  imported at runtime;
- field names avoid downstream product vocabulary and do not create protocol
  object vocabulary;
- package export changes wait for a separate export readiness and
  implementation wave;
- tests cover package self-reference, type-only runtime shape, no private path
  exports, and forbidden authority omissions;
- grep checks cover forbidden positive claims and authority-bearing field names;
- no runtime behavior API, constructor, store, dispatcher, lifecycle method,
  writeback service, storage write, training hook, schema, registry, or binding
  is introduced.

## Existing Export Relationship

The existing 16 exports remain the current package truth. This field design
does not duplicate them because each selected track composes existing posture
or evidence into a higher-level neutral boundary/result family:

| Track | Existing coverage | New field-design addition | Why runtime behavior is not replaced |
| --- | --- | --- | --- |
| runtime session behavior-boundary snapshot | session summary/evidence, readiness, projection, state, persistence, objective, execution evidence | construction/dependency/state-mode boundary posture | no constructors, services, stores, or live handles |
| state roundtrip behavior-result snapshot | state port summary and persistence roundtrip evidence | roundtrip result, reload/rehydration posture, storage omission posture | no storage adapter, sqlite handle, transaction, write, or rehydration execution |
| learning/correction behavior-result snapshot | learning correction evidence, memory/preference summary, objective continuity | capture posture, preference effect posture, objective comparison refs, mutation omission posture | no capture service, preference writeback, mutation, training, or anchor service authority |

## Downstream Ownership Boundary

SoloCrew remains responsible for downstream product behavior and migration
sequencing:

- local runtime session facade creation and shell lifecycle wiring;
- sqlite/in-memory mode choice, local state lifecycle, reload behavior, and
  data-loss policy;
- product-facing worker lifecycle display and local fake state changes;
- local fake motion handler and bounded action policy;
- correction UX policy, preference application policy, and review flow wording;
- product page, projection adapter, route, dashboard, cell, engagement,
  customer, and founder-facing language;
- dependency/package strategy, downstream migration sequencing, and bridge
  retirement timing;
- historical regression fixture ownership and parity test migration.

Cognitive_OS field design may provide neutral evidence/snapshot/result
families later, but it must not become the owner of downstream product law by
convenience.

## Why No Implementation Is Authorized

No implementation is authorized because this wave is field design only. It
intentionally stops before:

- adding or modifying `runtime/public/*.ts`;
- adding exact TypeScript interfaces or exported type names;
- changing `package.json` or package exports;
- adding runtime APIs, constructors, services, stores, dispatchers, lifecycle
  methods, storage writes, mutation writeback, training hooks, provider
  dispatch, channel dispatch, or tool invocation;
- modifying `runtime/core`, `runtime/state`, `runtime/lifecycle`,
  `runtime/learning`, or `runtime/execution`;
- creating schemas, registry entries, bindings, profiles, or protocol law;
- changing SoloCrew or MPLP-Protocol;
- starting downstream migration or bridge replacement implementation.

The next Cognitive_OS step, if owner-approved, should be DTO design-readiness
review. That review must decide whether any field family is implementable as a
type-only DTO without leaking runtime authority.

## Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| field design turns into DTO implementation | High | this record defines field families only and forbids source edits |
| behavior API creep | High | all tracks are evidence/snapshot/result only; runtime API design remains out of scope |
| runtime session constructor leakage | High | require constructor/service/store/live-handle omissions and boundary flags |
| state/sqlite write authority leakage | High | forbid sqlite handles, stores, transactions, storage writes, and mutable records |
| learning training or writeback overclaim | High | forbid training, mutation writeback, preference writeback service handles, and correction service handles |
| existing exports overclaimed as behavior replacement | High | record existing export relationship as evidence-only and non-executing |
| downstream product vocabulary leakage | High | require neutral vocabulary and keep product display law downstream-owned |
| MPLP protocol pollution | High | keep MPGC backlog non-normative and no-change |
| package/dependency overclaim | Medium | keep package export and dependency strategy for later authorized waves |

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

`CGOS_UPSTREAM_PUBLIC_SURFACE_FIELD_DESIGN_READY_NO_IMPLEMENTATION`

Rejected:

- `CGOS_UPSTREAM_PUBLIC_SURFACE_FIELD_DESIGN_READY_WITH_CONDITIONS`
- `CGOS_UPSTREAM_PUBLIC_SURFACE_FIELD_DESIGN_BLOCKED`

Meaning:

- all three selected tracks receive complete field-family design;
- forbidden field families are explicit;
- future DTO shape constraints are explicit;
- existing 16-export relationship is clear;
- downstream-owned SoloCrew behavior remains separated;
- no runtime/public source, package export, runtime API, schema, registry,
  binding, SoloCrew, or MPLP change occurs;
- no implementation starts;
- no P0/P1 blocker remains for a future DTO design-readiness or
  implementation-planning wave.

## Next Allowed Task

Recommended first:

`CGOS-UPSTREAM-PUBLIC-SURFACE-DTO-DESIGN-READINESS-WAVE-01`

Reason:

- the three selected tracks now have field-family designs and explicit
  forbidden field families;
- DTO readiness should determine whether any field family can become a
  type-only DTO without leaking runtime authority before downstream code
  targets those shapes;
- SoloCrew existing-export parity work remains valuable, but it should not
  assume new upstream field shapes before DTO readiness confirms which designs
  are implementable.

Alternative after DTO design-readiness:

`SOLOCREW-EXISTING-CGOS-EXPORTS-EXERCISE-PARITY-WAVE-01`

Owner may also pause development.
