# CGOS-UPSTREAM-PUBLIC-SURFACE-REQUEST-CANDIDATE-WAVE-v0.1

## Document Control

- doc_id: CGOS-UPSTREAM-PUBLIC-SURFACE-REQUEST-CANDIDATE-WAVE-v0.1
- task_id: CGOS-UPSTREAM-PUBLIC-SURFACE-REQUEST-CANDIDATE-WAVE-01
- status: upstream public-surface request-candidate planning only
- date: 2026-05-06
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: 783288ca6ace61cf75dc203d0097e0263697b72d
- solocrew_reference_head: bac12dd5548e85fb3c5804481418ab6d0097c69c
- mplp_reference_head: 214939ab6ba522036d376868d1fe8d04d960420f
- no_implementation_change: true
- no_runtime_public_dto_change: true
- no_package_export_change: true
- no_runtime_behavior_change: true
- no_schema_registry_binding_change: true
- no_package_publication: true
- no_release_or_tag: true
- no_solocrew_modification: true
- no_mplp_modification: true
- no_protocol_change: true

## Remote Truth

Remote truth was fetched for Cognitive_OS, SoloCrew, and MPLP-Protocol before
this request-candidate record was created.

| Repo | Local HEAD | origin/main HEAD | Expected | Worktree |
| --- | --- | --- | --- | --- |
| Cognitive_OS | `783288ca6ace61cf75dc203d0097e0263697b72d` | `783288ca6ace61cf75dc203d0097e0263697b72d` | `783288ca6ace61cf75dc203d0097e0263697b72d` | clean before edits |
| SoloCrew | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | clean, read-only |
| MPLP-Protocol | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | clean, read-only |

This wave modifies only this Cognitive_OS governance planning record and the
Cognitive_OS changelog. It does not modify SoloCrew, MPLP-Protocol, runtime
source, DTO source, package exports, schemas, registry entries, bindings,
tests, package files, release state, or dependency strategy.

## Input Baselines Inspected

SoloCrew read-only inputs:

- `governance/planning/TRI-REPO-BRIDGE-REPLACEMENT-PLAN-WAVE-v0.1.md`
- `governance/audits/SOLOCREW-CGOS-LEGACY-BRIDGE-OWNERSHIP-AND-QUARANTINE-WAVE-v0.1.md`

Cognitive_OS inputs:

- `package.json`
- all current `runtime/public/*.ts` DTO/evidence/public bundle files
- `governance/planning/CGOS-PUBLIC-SURFACE-CANDIDATE-PLAN-v0.1.md`
- `governance/planning/CGOS-RUNTIME-SESSION-WORKER-LIFECYCLE-SURFACE-ANALYSIS-WAVE-v0.1.md`
- existing runtime package export boundary and self-reference tests

MPLP-Protocol read-only input:

- `governance/candidates/MPGC-CANDIDATE-BACKLOG-v0.1.md`

These baselines show that existing Cognitive_OS public surfaces are useful for
evidence/projection substitution, but they do not replace SoloCrew runtime
behavior such as local session construction, sqlite store behavior, lifecycle
transition methods, correction capture, preference writeback, or dispatch
mechanics.

## Product Demand Origin from SoloCrew

The request pressure comes from SoloCrew bridge replacement planning, not from
Cognitive_OS convenience. SoloCrew needs safer upstream boundaries for:

- runtime session continuity across local shell bootstrapping, sqlite reload,
  and return flow posture;
- worker lifecycle visibility without transition authority;
- state/sqlite posture and roundtrip evidence without store handles;
- learning/correction and memory/preference evidence without training,
  mutation writeback, or preference-service authority;
- bounded action review and dispatch denial posture without provider, channel,
  or tool authority;
- runtime projection parity so product pages can stop depending on runtime
  private shape where evidence-safe DTOs are enough;
- objective continuity comparison evidence without exporting anchor stores;
- bridge debt reduction while keeping package DTO imports evidence-only until a
  separate downstream migration and dependency strategy exists.

SoloCrew product vocabulary, page models, local fake motion behavior, sqlite
mode choice, and product display rules remain downstream concerns. They are
not Cognitive_OS canonical fields.

## Existing Cognitive_OS Public Surface Baseline

Cognitive_OS currently has a private package with exactly 16 approved
`runtime/public` exports.

| Surface family | Current exports | Current coverage |
| --- | --- | --- |
| operator review loop | `operator-review-loop-dto`, `operator-review-loop-handoff-bundle` | operator review and projection-safe handoff evidence |
| first-wave runtime DTOs | `runtime-readiness-status-dto`, `runtime-projection-summary-dto`, `runtime-execution-event-dto`, `runtime-objective-continuity-dto` | readiness, projection summary, bounded execution event, objective continuity evidence |
| second-wave DTOs | `state-port-summary-dto`, `persistence-roundtrip-evidence-dto`, `memory-preference-summary-dto`, `learning-correction-evidence-dto`, `runtime-action-request-summary-dto`, `runtime-dispatch-boundary-evidence-dto` | state/persistence, memory/preference, correction, action request, and dispatch boundary evidence |
| third-wave DTOs | `runtime-session-summary-dto`, `runtime-session-evidence-dto`, `worker-lifecycle-summary-dto`, `worker-lifecycle-evidence-dto` | runtime session and worker lifecycle posture/evidence |

Current boundary assessment:

- the current 16 exports are DTO/evidence/package-public surfaces, not runtime
  behavior APIs;
- they omit runtime-private payloads, constructors, service instances, mutable
  state handles, lifecycle transition authority, storage writes, mutation
  writeback, training authority, provider dispatch, channel dispatch, and tool
  invocation;
- the operator handoff bundle is the only helper-like public surface in the
  export map;
- no `runtime/core`, `runtime/state`, `runtime/lifecycle`,
  `runtime/learning`, `runtime/execution`, schema, registry, or binding
  private path is exported;
- package publication and downstream dependency availability are not part of
  the current line.

The package export map is the current package truth. Any historical comments in
DTO source files are not changed here because this wave forbids DTO edits.

## MPLP Candidate / Protocol Boundary

The MPLP MPGC backlog is non-normative background only. Relevant entries:

- `MPGC-CANDIDATE-EVIDENCE-OMISSION-BOUNDARY-FLAGS-01`
- `MPGC-CANDIDATE-RUNTIME-SESSION-EVIDENCE-01`
- `MPGC-CANDIDATE-WORKER-LIFECYCLE-EVIDENCE-01`
- `MPGC-CANDIDATE-DOWNSTREAM-RUNTIME-BRIDGE-MIGRATION-01`
- `MPGC-CANDIDATE-PROJECTION-SAFE-PACKAGE-SURFACE-01`
- `MPGC-CANDIDATE-ACTION-DISPATCH-BOUNDARY-EVIDENCE-01`
- `MPGC-CANDIDATE-LEARNING-CORRECTION-EVIDENCE-01`

This request-candidate wave does not request or perform any MPLP schema, spec,
core-law, module, profile, binding, conformance, certification, endorsement,
official implementation, or canonical implementation change. Cognitive_OS
candidate records remain implementation-layer planning, not protocol law.

## Upstream Public-Surface Request Candidate Matrix

### CGOS-UPSTREAM-CANDIDATE-RUNTIME-SESSION-BEHAVIOR-SNAPSHOT-01

- candidate_id: CGOS-UPSTREAM-CANDIDATE-RUNTIME-SESSION-BEHAVIOR-SNAPSHOT-01
- source SoloCrew usage family: runtime session creation/posture.
- product demand origin: local runtime session continuity, sqlite reload
  posture, and bridge removal planning.
- current Cognitive_OS coverage: `runtime-session-summary-dto`,
  `runtime-session-evidence-dto`, `state-port-summary-dto`,
  `persistence-roundtrip-evidence-dto`, `runtime-readiness-status-dto`, and
  `runtime-projection-summary-dto`.
- gap type: behavior_gap.
- proposed Cognitive_OS neutral abstraction: a session behavior-boundary
  snapshot that summarizes construction posture, dependency family posture,
  state mode, and omitted runtime-private dependencies without constructors,
  stores, service instances, or live handles.
- should be: runtime_public_evidence_candidate.
- existing 16 exports cover it enough?: partially; they cover posture and
  evidence, not replacement behavior.
- behavior replacement required?: yes, but behavior should not be exposed by
  DTOs and may remain SoloCrew-owned unless a later CGOS runtime API is
  separately justified.
- package export change eventually required?: only if a new DTO/evidence file
  is later designed, implemented, verified, and export-approved.
- runtime implementation eventually required?: not for the snapshot; only a
  separate runtime_behavior_api_candidate could require implementation.
- MPLP candidate/backlog coverage: covered as non-normative pressure by
  runtime session evidence and downstream bridge migration candidates.
- why no implementation is authorized in this wave: this wave classifies the
  request and must not add DTOs, APIs, exports, or runtime behavior.
- allowed future wave: CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-01.
- forbidden shortcut: exporting session constructors, orchestrator classes,
  state stores, dependency bundles, or mutable runtime handles.

### CGOS-UPSTREAM-CANDIDATE-WORKER-LIFECYCLE-OBSERVATION-SNAPSHOT-01

- candidate_id: CGOS-UPSTREAM-CANDIDATE-WORKER-LIFECYCLE-OBSERVATION-SNAPSHOT-01
- source SoloCrew usage family: worker lifecycle modeling/posture.
- product demand origin: worker lifecycle visibility in product/projection
  surfaces without transition authority.
- current Cognitive_OS coverage: `worker-lifecycle-summary-dto` and
  `worker-lifecycle-evidence-dto`.
- gap type: evidence_gap.
- proposed Cognitive_OS neutral abstraction: a richer observation snapshot for
  lifecycle state family, observed transition posture, and safe outcome refs
  without lifecycle mutation methods or worker store records.
- should be: runtime_public_evidence_candidate.
- existing 16 exports cover it enough?: likely enough for initial observation
  evidence; richer design should be selected only if SoloCrew parity mapping
  proves missing fields.
- behavior replacement required?: yes for transition methods, but that behavior
  is downstream-owned or runtime-private and must not be exposed here.
- package export change eventually required?: no if existing third-wave DTOs
  are sufficient; yes only for a separately approved richer DTO.
- runtime implementation eventually required?: no for evidence-only
  observation.
- MPLP candidate/backlog coverage: covered as non-normative pressure by worker
  lifecycle evidence candidate.
- why no implementation is authorized in this wave: existing DTOs may be enough
  and no field-level design selection has occurred.
- allowed future wave: CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-01.
- forbidden shortcut: exposing `WorkerLifecycleRuntime`, transition methods,
  worker stores, mutable worker records, or revision mutation behavior.

### CGOS-UPSTREAM-CANDIDATE-STATE-ROUNDTRIP-BEHAVIOR-RESULT-01

- candidate_id: CGOS-UPSTREAM-CANDIDATE-STATE-ROUNDTRIP-BEHAVIOR-RESULT-01
- source SoloCrew usage family: state/sqlite posture.
- product demand origin: local sqlite/in-memory continuity and roundtrip
  evidence during bridge reduction.
- current Cognitive_OS coverage: `state-port-summary-dto` and
  `persistence-roundtrip-evidence-dto`.
- gap type: behavior_gap.
- proposed Cognitive_OS neutral abstraction: persisted-state roundtrip behavior
  result or snapshot summary that records mode, roundtrip outcome, safe refs,
  and omission markers without storage handles or sqlite adapter details.
- should be: runtime_public_evidence_candidate.
- existing 16 exports cover it enough?: partially; they cover state-port
  posture and roundtrip evidence, not local store replacement behavior.
- behavior replacement required?: yes for store mechanics, and that should
  remain SoloCrew-owned unless future CGOS runtime behavior is explicitly
  authorized.
- package export change eventually required?: only if a new behavior-result DTO
  is selected and implemented later.
- runtime implementation eventually required?: no for evidence; yes only if a
  future upstream runtime API is authorized separately.
- MPLP candidate/backlog coverage: related to bridge migration and
  evidence/omission backlog entries.
- why no implementation is authorized in this wave: the owner has not decided
  whether state/sqlite should be local infrastructure or an upstream CGOS
  behavior request.
- allowed future wave: CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-01
  after SoloCrew clarifies local persistence ownership.
- forbidden shortcut: treating persistence evidence as a sqlite store adapter
  or exporting storage write authority.

### CGOS-UPSTREAM-CANDIDATE-LEARNING-CORRECTION-BEHAVIOR-RESULT-01

- candidate_id: CGOS-UPSTREAM-CANDIDATE-LEARNING-CORRECTION-BEHAVIOR-RESULT-01
- source SoloCrew usage family: learning/correction posture.
- product demand origin: correction capture, preference continuity, and
  reviewable learning evidence.
- current Cognitive_OS coverage: `learning-correction-evidence-dto`,
  `memory-preference-summary-dto`, and
  `runtime-objective-continuity-dto`.
- gap type: behavior_gap.
- proposed Cognitive_OS neutral abstraction: correction capture and preference
  writeback result snapshot that distinguishes captured evidence, candidate
  preference effects, objective comparison refs, and omitted mutation services.
- should be: runtime_public_evidence_candidate.
- existing 16 exports cover it enough?: partially; they cover evidence and
  summary posture, not capture/writeback behavior.
- behavior replacement required?: yes for capture and writeback mechanics; that
  behavior should stay local or runtime-private unless separately designed.
- package export change eventually required?: only for a new result snapshot
  DTO after design selection.
- runtime implementation eventually required?: no for evidence; yes only for a
  separately authorized runtime behavior API.
- MPLP candidate/backlog coverage: covered as non-normative pressure by the
  learning correction evidence candidate.
- why no implementation is authorized in this wave: capture/writeback ownership
  has not been separated into local behavior versus neutral upstream evidence
  design.
- allowed future wave: CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-01.
- forbidden shortcut: adding training authority, mutation writeback authority,
  preference-service handles, or learning service exports.

### CGOS-UPSTREAM-CANDIDATE-BOUNDED-ACTION-REQUEST-OUTCOME-01

- candidate_id: CGOS-UPSTREAM-CANDIDATE-BOUNDED-ACTION-REQUEST-OUTCOME-01
- source SoloCrew usage family: action request posture.
- product demand origin: task/action review and bounded local fake motion
  evidence.
- current Cognitive_OS coverage: `runtime-action-request-summary-dto` and
  `runtime-execution-event-dto`.
- gap type: projection_gap.
- proposed Cognitive_OS neutral abstraction: bounded action request/outcome
  snapshot that joins request intent, non-executing outcome posture, safe
  evidence refs, and no-authority boundary flags.
- should be: no_new_surface_needed for initial adapter work; possible
  runtime_public_dto_candidate only if parity mapping proves a field gap.
- existing 16 exports cover it enough?: likely enough for initial
  evidence-only substitution.
- behavior replacement required?: yes for local fake action handling, but that
  remains SoloCrew-owned.
- package export change eventually required?: not expected unless design
  selection finds a missing neutral outcome shape.
- runtime implementation eventually required?: no.
- MPLP candidate/backlog coverage: covered as non-normative pressure by action
  dispatch boundary evidence candidate.
- why no implementation is authorized in this wave: existing action/request
  exports should be tried through downstream adapter mapping before any new
  CGOS surface is requested.
- allowed future wave: SoloCrew evidence-adapter spike after guardrail/design
  sequencing, or CGOS design selection only if a gap is proven.
- forbidden shortcut: adding provider dispatch, channel dispatch, tool
  invocation, approval authority, or live dispatch handles.

### CGOS-UPSTREAM-CANDIDATE-DISPATCH-DENIAL-OUTCOME-EVIDENCE-01

- candidate_id: CGOS-UPSTREAM-CANDIDATE-DISPATCH-DENIAL-OUTCOME-EVIDENCE-01
- source SoloCrew usage family: dispatch boundary posture.
- product demand origin: dispatch denial display and bounded action review
  without external authority.
- current Cognitive_OS coverage: `runtime-dispatch-boundary-evidence-dto` and
  `runtime-execution-event-dto`.
- gap type: evidence_gap.
- proposed Cognitive_OS neutral abstraction: dispatch denial/outcome evidence
  snapshot that records denied target classes, boundary reason, safe refs, and
  omitted dispatcher internals.
- should be: no_new_surface_needed for initial evidence-only adapter work;
  possible runtime_public_evidence_candidate only if current dispatch evidence
  cannot support parity.
- existing 16 exports cover it enough?: likely enough for denial evidence and
  blocked dispatch posture.
- behavior replacement required?: yes for dispatcher mechanics, but that
  remains SoloCrew-owned local behavior or runtime-private CGOS behavior.
- package export change eventually required?: not expected unless parity
  mapping shows insufficient evidence shape.
- runtime implementation eventually required?: no.
- MPLP candidate/backlog coverage: covered as non-normative pressure by action
  dispatch boundary evidence candidate.
- why no implementation is authorized in this wave: no proven gap exists beyond
  downstream adapter mapping.
- allowed future wave: SoloCrew bridge replacement Phase B evidence-only
  adapter planning, after guardrails.
- forbidden shortcut: exporting `ActionDispatcher`, dispatch handlers, provider
  routes, channel dispatch, tool invocation, or execution authority.

### CGOS-UPSTREAM-CANDIDATE-RUNTIME-PROJECTION-PARITY-SNAPSHOT-01

- candidate_id: CGOS-UPSTREAM-CANDIDATE-RUNTIME-PROJECTION-PARITY-SNAPSHOT-01
- source SoloCrew usage family: runtime readiness/projection/execution/objective
  continuity posture.
- product demand origin: page/projection parity after bridge reduction.
- current Cognitive_OS coverage: `runtime-projection-summary-dto`,
  `runtime-readiness-status-dto`, `runtime-execution-event-dto`,
  `runtime-objective-continuity-dto`, plus second/third-wave evidence refs.
- gap type: projection_gap.
- proposed Cognitive_OS neutral abstraction: projection parity snapshot that
  composes existing public DTO refs and omission markers without downstream
  page vocabulary or runtime-private projection records.
- should be: runtime_public_dto_candidate only if downstream fixture parity
  proves existing projection summary is under-specified; otherwise
  no_new_surface_needed.
- existing 16 exports cover it enough?: probably enough for first parity spike,
  but not yet proven by SoloCrew adapter work.
- behavior replacement required?: usually no for display summaries; yes only
  where current records are generated from live stores.
- package export change eventually required?: only if a new parity snapshot DTO
  is selected.
- runtime implementation eventually required?: no for DTO parity; live store
  generation remains separate.
- MPLP candidate/backlog coverage: related to evidence/omission and
  projection-safe package surface candidates.
- why no implementation is authorized in this wave: parity evidence must come
  from downstream adapter mapping before adding another upstream DTO.
- allowed future wave: CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-01
  after SoloCrew identifies exact projection parity misses.
- forbidden shortcut: encoding SoloCrew page, dashboard, route, cell, founder,
  engagement, or customer vocabulary in Cognitive_OS fields.

### CGOS-UPSTREAM-CANDIDATE-OBJECTIVE-CONTINUITY-COMPARISON-RESULT-01

- candidate_id: CGOS-UPSTREAM-CANDIDATE-OBJECTIVE-CONTINUITY-COMPARISON-RESULT-01
- source SoloCrew usage family: objective anchor / continuity comparison.
- product demand origin: continuity comparison and reviewable objective drift
  evidence without exposing anchor stores.
- current Cognitive_OS coverage: `runtime-objective-continuity-dto` and
  `learning-correction-evidence-dto`.
- gap type: evidence_gap.
- proposed Cognitive_OS neutral abstraction: objective comparison result
  snapshot with source refs, comparison status, recommendation posture, and
  omitted anchor implementation details.
- should be: no_new_surface_needed initially; possible
  runtime_public_evidence_candidate only if comparison result detail is missing.
- existing 16 exports cover it enough?: likely enough for objective continuity
  posture; downstream parity mapping must verify.
- behavior replacement required?: no for comparison evidence; yes for anchor
  service behavior, which remains private or downstream-owned.
- package export change eventually required?: not expected unless a richer
  comparison result DTO is selected.
- runtime implementation eventually required?: no.
- MPLP candidate/backlog coverage: related to evidence/omission and learning
  correction candidates.
- why no implementation is authorized in this wave: existing continuity DTO is
  the preferred first-use surface.
- allowed future wave: SoloCrew adapter parity spike or CGOS design selection
  if exact missing comparison fields are documented.
- forbidden shortcut: exporting objective anchor stores, comparison services,
  or mutation policy internals.

### CGOS-UPSTREAM-CANDIDATE-MEMORY-PREFERENCE-PROJECTION-SNAPSHOT-01

- candidate_id: CGOS-UPSTREAM-CANDIDATE-MEMORY-PREFERENCE-PROJECTION-SNAPSHOT-01
- source SoloCrew usage family: memory/preference posture.
- product demand origin: memory/preference continuity and reviewable
  preference posture in projection surfaces.
- current Cognitive_OS coverage: `memory-preference-summary-dto` and
  `learning-correction-evidence-dto`.
- gap type: projection_gap.
- proposed Cognitive_OS neutral abstraction: memory/preference projection
  snapshot with summary refs, preference posture, correction evidence refs, and
  omitted writeback services.
- should be: no_new_surface_needed for initial evidence adapter work; possible
  runtime_public_dto_candidate if current summaries are insufficient.
- existing 16 exports cover it enough?: likely enough for initial projection
  substitution.
- behavior replacement required?: yes for preference writeback, but that
  behavior remains downstream-owned or runtime-private.
- package export change eventually required?: not expected unless parity
  mapping proves a missing neutral snapshot.
- runtime implementation eventually required?: no.
- MPLP candidate/backlog coverage: related to learning correction evidence and
  evidence/omission candidates.
- why no implementation is authorized in this wave: current DTO coverage should
  be exercised first before adding new upstream fields.
- allowed future wave: SoloCrew evidence-adapter parity wave after guardrail
  sequencing.
- forbidden shortcut: treating memory/preference DTOs as preference mutation
  law or exporting writeback service behavior.

## Downstream-Owned Behavior Classification

The following behaviors should remain SoloCrew-owned unless a future
owner-authorized design proves a neutral Cognitive_OS runtime API is necessary:

- local runtime session facade creation and shell lifecycle wiring;
- sqlite/in-memory mode selection, local store lifecycle, and reload behavior;
- product-facing worker lifecycle display wording and any fake state changes;
- local fake motion handler and bounded action policy;
- product page, projection adapter, route, dashboard, cell, engagement, and
  customer-facing language;
- correction UX policy and preference application policy;
- dependency strategy, package migration sequencing, and bridge retirement
  timing;
- historical regression fixture ownership and parity test migration.

These items may reference Cognitive_OS DTO/evidence surfaces later, but they
must not be converted into Cognitive_OS runtime law by convenience.

## Candidate Priority and Sequencing

| Priority | Candidate area | Recommendation | Reason |
| --- | --- | --- | --- |
| P0 | request-candidate registration | complete in this record | all requested candidates are classified without implementation |
| P1 | runtime session behavior-boundary snapshot | design-selection candidate | highest bridge pressure and existing DTOs do not replace behavior |
| P1 | state roundtrip behavior-result | design-selection candidate with local ownership check | sqlite/store behavior is high-risk and evidence-only coverage is partial |
| P1 | learning/correction behavior-result | design-selection candidate with local ownership check | capture/writeback behavior must be separated from evidence |
| P2 | worker lifecycle observation snapshot | use existing third-wave DTOs first; design richer surface only if parity misses appear | transition authority must stay private/downstream-owned |
| P2 | runtime projection parity snapshot | test existing projection summary first | current first-wave projection coverage may be enough |
| P2 | bounded action request/outcome and dispatch denial/outcome | use existing second-wave DTOs first | local fake motion and dispatcher mechanics are downstream-owned |
| P3 | objective continuity and memory/preference projection snapshots | use existing DTOs first | likely covered enough for initial adapter parity |

Recommended next sequencing:

1. Run a CGOS design-selection wave to narrow P1 candidates into approved,
   deferred, or downstream-owned design tracks.
2. Return to SoloCrew for Phase A guardrail hardening only if the existing
   perimeter test needs expansion before adapter work.
3. Start any DTO design/implementation only after design selection explicitly
   approves a neutral surface and restates package/export boundaries.

## Why No Implementation Is Authorized in This Wave

No implementation is authorized because this wave is a request-candidate
classification boundary. It intentionally stops before:

- adding or modifying `runtime/public/*.ts`;
- changing package exports;
- adding package fields, dependencies, or publication metadata;
- adding runtime APIs, constructors, service instances, stores, dispatchers, or
  lifecycle transition methods;
- modifying `runtime/core`, `runtime/state`, `runtime/lifecycle`,
  `runtime/learning`, or `runtime/execution`;
- creating schemas, registry entries, bindings, profiles, or protocol law;
- changing SoloCrew or MPLP-Protocol;
- starting downstream migration or bridge replacement implementation.

This preserves the tri-repo flow: SoloCrew product pressure is mapped into
neutral Cognitive_OS request candidates, MPLP remains candidate-only
background, and implementation waits for an explicit design-selection wave.

## Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| DTO/evidence mistaken for behavior replacement | High | keep behavior_gap and evidence_gap separated in every future wave |
| over-requesting CGOS surfaces for SoloCrew-owned local behavior | High | require downstream-owned classification before design approval |
| runtime-private exposure through convenience exports | High | reject constructors, stores, service instances, dispatchers, lifecycle methods, and mutable records |
| package export overclaim | Medium | require separate package export readiness and verification for any future DTO |
| stale source comments versus current package export truth | Low | treat package.json as current truth and avoid DTO edits in this planning wave |
| protocol pollution | High | keep MPLP backlog non-normative and require separate owner authorization for protocol changes |
| downstream migration overclaim | High | keep package DTO imports evidence-only until a separate SoloCrew migration task |
| dependency strategy confusion | Medium | keep dependency/package availability outside this wave |

## Forbidden Claims Classification

| Claim or change class | Classification |
| --- | --- |
| bridge replacement readiness | denied |
| bridge replacement complete | denied |
| downstream migration complete | denied |
| repository-wide import hygiene complete | denied |
| official dependency availability | denied |
| package publication | denied |
| release or tag | denied |
| new DTO implementation | denied |
| package export change | denied |
| runtime behavior API | denied |
| runtime-private constructor, service, store, dispatcher, lifecycle, or mutable handle exposure | denied |
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
| `npm run test:runtime` | PASS, 259 tests |
| `./node_modules/.bin/tsc --noEmit` | PASS |
| package export count check | PASS, exactly 16 approved private exports |
| forbidden claim grep on changed files | PASS with classification: hits are negative guardrails only |
| forbidden package/private path grep | PASS, package exports contain no forbidden private paths |
| SoloCrew head/status check | PASS before edits; clean/read-only at expected reference |
| MPLP-Protocol head/status check | PASS before edits; clean/read-only at expected reference |

Final check results are reported in the task final report after commit.

## Decision

Selected:

`CGOS_UPSTREAM_PUBLIC_SURFACE_REQUEST_CANDIDATES_REGISTERED_NO_IMPLEMENTATION`

Rejected:

- `CGOS_UPSTREAM_PUBLIC_SURFACE_REQUEST_CANDIDATES_REGISTERED_WITH_CONDITIONS`
- `CGOS_UPSTREAM_PUBLIC_SURFACE_REQUEST_CANDIDATES_BLOCKED`

Meaning:

- all requested candidate areas are classified;
- downstream-owned SoloCrew behavior is separated from neutral Cognitive_OS
  request candidates;
- existing 16 exports are useful but not overclaimed;
- no package/export/runtime/schema/registry/binding change occurs;
- no SoloCrew or MPLP modification occurs;
- no implementation is started;
- no P0/P1 blocker remains for candidate registration.

## Next Allowed Task

Recommended first:

`CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-01`

Reason:

- this wave completes request-candidate classification;
- SoloCrew guardrails already exist at the quarantine perimeter;
- the highest next uncertainty is which P1 candidate surfaces should advance to
  neutral field design, which should be deferred, and which should be assigned
  back to SoloCrew-owned local behavior;
- design selection before SoloCrew adapter work reduces the risk of downstream
  code targeting a surface that Cognitive_OS later rejects.

Alternative after design selection:

`SOLOCREW-BRIDGE-REPLACEMENT-PHASE-A-GUARDRAIL-HARDENING-WAVE-01`

Owner may also pause development.
