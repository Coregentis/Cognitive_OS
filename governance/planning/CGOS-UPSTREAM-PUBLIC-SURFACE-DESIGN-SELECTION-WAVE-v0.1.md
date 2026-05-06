# CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-v0.1

## Document Control

- doc_id: CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-v0.1
- task_id: CGOS-UPSTREAM-PUBLIC-SURFACE-DESIGN-SELECTION-WAVE-01
- status: upstream public-surface design selection only
- date: 2026-05-06
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: bb0d2de9d86b0177db57f159eb25f0f25263cdde
- solocrew_reference_head: bac12dd5548e85fb3c5804481418ab6d0097c69c
- mplp_reference_head: 214939ab6ba522036d376868d1fe8d04d960420f
- no_implementation_change: true
- no_runtime_public_dto_change: true
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
this design-selection record was created.

| Repo | Local HEAD | origin/main HEAD | Expected | Worktree |
| --- | --- | --- | --- | --- |
| Cognitive_OS | `bb0d2de9d86b0177db57f159eb25f0f25263cdde` | `bb0d2de9d86b0177db57f159eb25f0f25263cdde` | `bb0d2de9d86b0177db57f159eb25f0f25263cdde` | clean before edits |
| SoloCrew | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | `bac12dd5548e85fb3c5804481418ab6d0097c69c` | clean, read-only |
| MPLP-Protocol | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | clean, read-only |

This wave modifies only this Cognitive_OS governance planning record and the
Cognitive_OS changelog. It does not modify runtime source, DTO source, package
exports, schemas, registry entries, bindings, tests, package files,
publication state, release state, SoloCrew, or MPLP-Protocol.

## Input Baselines Inspected

Inspected Cognitive_OS inputs:

- `governance/planning/CGOS-UPSTREAM-PUBLIC-SURFACE-REQUEST-CANDIDATE-WAVE-v0.1.md`
- `package.json`
- all current `runtime/public/*.ts` DTO/evidence/public bundle files

Inspected SoloCrew inputs, read-only:

- `governance/planning/TRI-REPO-BRIDGE-REPLACEMENT-PLAN-WAVE-v0.1.md`
- `governance/audits/SOLOCREW-CGOS-LEGACY-BRIDGE-OWNERSHIP-AND-QUARANTINE-WAVE-v0.1.md`

Inspected MPLP-Protocol input, read-only:

- `governance/candidates/MPGC-CANDIDATE-BACKLOG-v0.1.md`

The baselines show nine request candidates. Three have enough evidence to move
to neutral field design as DTO/evidence snapshots. Six should first exercise
the existing 16 exports, defer for SoloCrew parity evidence, or remain
downstream-owned behavior.

## Product Demand Origin

SoloCrew product demand remains the downstream source:

- runtime session continuity for local shell, sqlite reload, and return flow
  posture;
- worker lifecycle visibility without lifecycle transition authority;
- state/sqlite roundtrip and storage posture evidence without store handles;
- correction, preference, memory, action, dispatch, objective continuity, and
  projection evidence for the one-person company operating loop;
- bridge debt reduction without adding direct runtime-private imports or
  treating package DTO spikes as dependency availability.

This selection does not make SoloCrew page models, product terms, local fake
motion, sqlite mode choice, correction UX policy, dependency strategy, or
bridge retirement timing into Cognitive_OS law.

## Current 16-Export Baseline

Cognitive_OS currently exposes exactly 16 private `runtime/public` package
subpaths:

| Surface family | Current exports | Selection implication |
| --- | --- | --- |
| operator review loop | `operator-review-loop-dto`, `operator-review-loop-handoff-bundle` | no new design needed in this wave |
| first-wave runtime DTOs | `runtime-readiness-status-dto`, `runtime-projection-summary-dto`, `runtime-execution-event-dto`, `runtime-objective-continuity-dto` | exercise before adding projection/action/objective surfaces |
| second-wave DTOs | `state-port-summary-dto`, `persistence-roundtrip-evidence-dto`, `memory-preference-summary-dto`, `learning-correction-evidence-dto`, `runtime-action-request-summary-dto`, `runtime-dispatch-boundary-evidence-dto` | enough for several adapter/parity exercises; partial for state and learning behavior-result gaps |
| third-wave DTOs | `runtime-session-summary-dto`, `runtime-session-evidence-dto`, `worker-lifecycle-summary-dto`, `worker-lifecycle-evidence-dto` | enough for initial session/lifecycle evidence; partial for session behavior-boundary design pressure |

The current exports are DTO/evidence surfaces, not runtime authority APIs. They
omit runtime-private payloads, constructors, service instances, mutable state
handles, lifecycle transition authority, storage writes, mutation writeback,
training authority, provider dispatch, channel dispatch, and tool invocation.

The package export map is not changed by this wave.

## MPLP Candidate / Protocol Boundary

MPLP MPGC backlog entries are non-normative background only:

- `MPGC-CANDIDATE-EVIDENCE-OMISSION-BOUNDARY-FLAGS-01`
- `MPGC-CANDIDATE-RUNTIME-SESSION-EVIDENCE-01`
- `MPGC-CANDIDATE-WORKER-LIFECYCLE-EVIDENCE-01`
- `MPGC-CANDIDATE-DOWNSTREAM-RUNTIME-BRIDGE-MIGRATION-01`
- `MPGC-CANDIDATE-PROJECTION-SAFE-PACKAGE-SURFACE-01`
- `MPGC-CANDIDATE-ACTION-DISPATCH-BOUNDARY-EVIDENCE-01`
- `MPGC-CANDIDATE-LEARNING-CORRECTION-EVIDENCE-01`

No MPLP schema, spec, core-law, module, profile, binding, conformance,
certification, endorsement, official implementation, or canonical
implementation change is requested or made.

## Design Selection Principles

- Select no more than three candidates for immediate field design.
- Prefer DTO/evidence/snapshot field design over runtime API design.
- Do not advance runtime behavior APIs in this wave.
- Do not advance a candidate when existing 16 exports should be exercised first.
- Do not advance a candidate only because downstream wants to delete a bridge.
- Keep SoloCrew-owned local behavior downstream-owned.
- Keep MPLP candidate material non-normative.
- Do not claim package publication, dependency availability, bridge
  replacement readiness, downstream migration completion, or repo-wide import
  hygiene.

## Design Selection Matrix

| Candidate ID | Request source | Gap type | Current Cognitive_OS coverage | Selected outcome | Design selection rationale | Field design allowed next? | DTO implementation allowed next? | Runtime API design allowed next? | Package export change allowed next? | SoloCrew-owned behavior remains required? | Exercise existing DTOs before new design? | MPLP background sufficient? | Blocking evidence before advancement | Forbidden shortcut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CGOS-UPSTREAM-CANDIDATE-RUNTIME-SESSION-BEHAVIOR-SNAPSHOT-01` | runtime session creation/posture | behavior_gap | session summary/evidence plus state, persistence, readiness, projection DTOs | ADVANCE_TO_NEUTRAL_FIELD_DESIGN | current exports show posture but do not compose a neutral behavior-boundary snapshot for construction dependencies, state mode, and omitted private services | yes, evidence/snapshot only | no | no | no | yes, local session facade and shell lifecycle remain downstream-owned | yes, as field-design inputs | yes | field design must prove no constructors, service instances, stores, or live handles | exporting session constructors, orchestrator classes, dependency bundles, or mutable runtime handles |
| `CGOS-UPSTREAM-CANDIDATE-WORKER-LIFECYCLE-OBSERVATION-SNAPSHOT-01` | worker lifecycle modeling/posture | evidence_gap | worker lifecycle summary/evidence DTOs | EXERCISE_EXISTING_16_EXPORTS_FIRST | existing third-wave DTOs already expose lifecycle posture and transition evidence without authority; richer design needs downstream parity misses first | no | no | no | no | yes, transition behavior and product display remain downstream-owned | yes | yes | SoloCrew parity exercise must identify missing observation fields | exposing lifecycle transition methods, worker stores, mutable records, or `WorkerLifecycleRuntime` |
| `CGOS-UPSTREAM-CANDIDATE-STATE-ROUNDTRIP-BEHAVIOR-RESULT-01` | state/sqlite posture | behavior_gap | state port summary and persistence roundtrip evidence DTOs | ADVANCE_TO_NEUTRAL_FIELD_DESIGN | current DTOs cover posture and roundtrip evidence but not a neutral behavior-result snapshot that can distinguish state mode, reload posture, and omitted storage authority | yes, evidence/result snapshot only | no | no | no | yes, sqlite mode choice and local store mechanics remain downstream-owned unless separately authorized | yes, as field-design inputs | yes | field design must prove no storage write, no store adapter, no sqlite handle, and no mutation authority | treating persistence evidence as a sqlite adapter or storage API |
| `CGOS-UPSTREAM-CANDIDATE-LEARNING-CORRECTION-BEHAVIOR-RESULT-01` | learning/correction posture | behavior_gap | learning correction evidence, memory preference summary, objective continuity DTOs | ADVANCE_TO_NEUTRAL_FIELD_DESIGN | capture/writeback behavior is still private/downstream-owned, but a neutral result snapshot can clarify captured evidence, candidate preference effect, objective refs, and omitted mutation services | yes, evidence/result snapshot only | no | no | no | yes, correction UX and preference application policy remain downstream-owned | yes, as field-design inputs | yes | field design must prove no training, mutation writeback, preference service, or learning service authority | adding training authority, writeback service handles, or preference mutation law |
| `CGOS-UPSTREAM-CANDIDATE-BOUNDED-ACTION-REQUEST-OUTCOME-01` | action request posture | projection_gap | action request summary and bounded execution event DTOs | EXERCISE_EXISTING_16_EXPORTS_FIRST | existing second/first-wave DTOs likely cover request/outcome evidence; local fake motion remains downstream behavior | no | no | no | no | yes, local fake motion and action policy remain downstream-owned | yes | yes | SoloCrew adapter parity must prove missing neutral outcome fields | adding provider dispatch, channel dispatch, tool invocation, approval authority, or live dispatch handles |
| `CGOS-UPSTREAM-CANDIDATE-DISPATCH-DENIAL-OUTCOME-EVIDENCE-01` | dispatch boundary posture | evidence_gap | dispatch boundary evidence and bounded execution event DTOs | EXERCISE_EXISTING_16_EXPORTS_FIRST | existing dispatch evidence already captures denial posture and blocked targets without authority | no | no | no | no | yes, dispatcher mechanics remain downstream-owned or runtime-private | yes | yes | parity exercise must prove current dispatch DTOs cannot represent denial outcome evidence | exporting dispatcher classes, handlers, provider routes, channels, tools, or execution authority |
| `CGOS-UPSTREAM-CANDIDATE-RUNTIME-PROJECTION-PARITY-SNAPSHOT-01` | runtime readiness/projection/execution/objective continuity posture | projection_gap | projection summary, readiness, execution event, objective continuity, and evidence DTOs | DEFER_PENDING_SOLOCREW_PARITY_EVIDENCE | existing exports should be mapped against SoloCrew fixtures before adding a composite parity snapshot | no | no | no | no | yes, product page wording and adapters remain downstream-owned | yes | yes | SoloCrew must identify exact parity misses after exercising existing exports | encoding page, dashboard, route, cell, founder, engagement, or customer vocabulary |
| `CGOS-UPSTREAM-CANDIDATE-OBJECTIVE-CONTINUITY-COMPARISON-RESULT-01` | objective anchor / continuity comparison | evidence_gap | objective continuity and learning correction DTOs | EXERCISE_EXISTING_16_EXPORTS_FIRST | existing objective continuity DTO is the intended first-use surface for comparison posture | no | no | no | no | yes, anchor service behavior remains private/downstream-owned | yes | yes | adapter parity must prove current comparison summary fields are insufficient | exporting objective anchor stores, comparison services, or mutation policy internals |
| `CGOS-UPSTREAM-CANDIDATE-MEMORY-PREFERENCE-PROJECTION-SNAPSHOT-01` | memory/preference posture | projection_gap | memory preference summary and learning correction evidence DTOs | EXERCISE_EXISTING_16_EXPORTS_FIRST | existing summaries likely cover initial projection substitution; writeback behavior is not upstream public law | no | no | no | no | yes, preference application policy remains downstream-owned | yes | yes | parity exercise must prove missing neutral preference/memory fields | treating DTO summaries as preference mutation law or exporting writeback service behavior |

## Candidates Advanced to Field Design

Exactly three candidates advance to neutral field design:

| Candidate | Allowed design shape | Hard limit |
| --- | --- | --- |
| `CGOS-UPSTREAM-CANDIDATE-RUNTIME-SESSION-BEHAVIOR-SNAPSHOT-01` | runtime/public evidence/snapshot field design for session behavior-boundary posture | no constructors, service instances, stores, dependency bundles, or runtime handles |
| `CGOS-UPSTREAM-CANDIDATE-STATE-ROUNDTRIP-BEHAVIOR-RESULT-01` | runtime/public evidence/result snapshot for persisted-state roundtrip behavior posture | no storage adapter, sqlite handle, storage write, or mutation authority |
| `CGOS-UPSTREAM-CANDIDATE-LEARNING-CORRECTION-BEHAVIOR-RESULT-01` | runtime/public evidence/result snapshot for correction capture and preference-effect posture | no training, mutation writeback, learning service, or preference service authority |

The next field-design wave may design fields only. It may not implement DTOs,
modify package exports, add runtime APIs, or change schemas/registry/bindings.

## Candidates Deferred or Kept Downstream-Owned

| Candidate | Outcome | Reason |
| --- | --- | --- |
| `CGOS-UPSTREAM-CANDIDATE-WORKER-LIFECYCLE-OBSERVATION-SNAPSHOT-01` | EXERCISE_EXISTING_16_EXPORTS_FIRST | third-wave lifecycle DTOs already cover observation/evidence enough for initial parity |
| `CGOS-UPSTREAM-CANDIDATE-BOUNDED-ACTION-REQUEST-OUTCOME-01` | EXERCISE_EXISTING_16_EXPORTS_FIRST | action request and execution-event DTOs should be tried before adding a new shape |
| `CGOS-UPSTREAM-CANDIDATE-DISPATCH-DENIAL-OUTCOME-EVIDENCE-01` | EXERCISE_EXISTING_16_EXPORTS_FIRST | dispatch boundary evidence DTO already captures denial posture without authority |
| `CGOS-UPSTREAM-CANDIDATE-RUNTIME-PROJECTION-PARITY-SNAPSHOT-01` | DEFER_PENDING_SOLOCREW_PARITY_EVIDENCE | a composite parity snapshot needs exact downstream fixture misses before design |
| `CGOS-UPSTREAM-CANDIDATE-OBJECTIVE-CONTINUITY-COMPARISON-RESULT-01` | EXERCISE_EXISTING_16_EXPORTS_FIRST | objective continuity DTO is already the preferred comparison surface |
| `CGOS-UPSTREAM-CANDIDATE-MEMORY-PREFERENCE-PROJECTION-SNAPSHOT-01` | EXERCISE_EXISTING_16_EXPORTS_FIRST | memory/preference summary DTO should be adapter-tested before adding fields |

Downstream-owned behavior remains required for local session facade wiring,
sqlite mode selection, local store lifecycle, lifecycle transition behavior,
fake motion/action policy, dispatcher mechanics, product page wording,
preference application policy, dependency strategy, and bridge retirement
timing.

## Existing Export Exercise Requirements

Before requesting new design for deferred or existing-export-first candidates,
SoloCrew should exercise current package subpaths against bridge replacement
parity needs:

- use `worker-lifecycle-summary-dto` and `worker-lifecycle-evidence-dto` for
  lifecycle observation parity before requesting a richer lifecycle snapshot;
- use `runtime-action-request-summary-dto`, `runtime-execution-event-dto`, and
  `runtime-dispatch-boundary-evidence-dto` for action and dispatch denial
  projection parity;
- use `runtime-projection-summary-dto`, `runtime-readiness-status-dto`,
  `runtime-execution-event-dto`, and `runtime-objective-continuity-dto` for
  projection/page fixture parity;
- use `runtime-objective-continuity-dto` for objective comparison posture;
- use `memory-preference-summary-dto` and `learning-correction-evidence-dto`
  for memory/preference and correction display parity.

Any future request for a richer CGOS surface must include exact missing neutral
field families and evidence that existing DTOs cannot represent them without
overclaiming behavior.

## Field Design Scope Limits

The next CGOS field-design task may only:

- define candidate field families for the three advanced evidence/snapshot
  surfaces;
- define required boundary flags, omission markers, version refs, and safe
  evidence refs;
- define explicit non-fields and rejected authority-bearing fields;
- classify package export readiness as a later question.

The next CGOS field-design task must not:

- implement or modify `runtime/public/*.ts`;
- modify `package.json`;
- add package exports;
- add runtime behavior APIs;
- expose constructors, services, stores, mutable state, dispatchers, lifecycle
  methods, storage writes, mutation writeback, training authority, provider
  dispatch, channel dispatch, or tool invocation;
- modify schemas, registry, bindings, SoloCrew, or MPLP-Protocol;
- claim package publication, official dependency availability, bridge
  replacement readiness, downstream migration completion, or protocol
  conformance/certification/endorsement.

## Why No Implementation Is Authorized

This wave is design selection only. Implementation would be premature because:

- field families for the three advanced candidates have not yet been designed;
- existing 16 exports must still be exercised for six candidate areas before
  new surfaces are justified;
- runtime behavior remains separate from DTO/evidence/snapshot design;
- package export changes require separate readiness, implementation, and
  verification waves;
- SoloCrew and MPLP are read-only references in this task.

## Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| selecting too many new surfaces | High | advance exactly three candidates and require existing-export exercises for the rest |
| behavior API creep | High | field design is evidence/snapshot only; runtime API design is not allowed next |
| state/sqlite storage authority leakage | High | state candidate must deny store adapters, sqlite handles, writes, and mutation authority |
| learning writeback or training overclaim | High | learning candidate must deny training, mutation writeback, and service handles |
| existing exports underused | Medium | require SoloCrew parity exercise before new projection/action/lifecycle/objective/memory surfaces |
| product vocabulary leakage | High | reject SoloCrew page, dashboard, route, cell, founder, engagement, customer vocabulary in CGOS fields |
| protocol pollution | High | keep MPLP backlog non-normative and no-change |
| package/dependency overclaim | Medium | keep package export and dependency strategy in later authorized waves |

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
| `npm run test:runtime` | PASS, 259 tests |
| `./node_modules/.bin/tsc --noEmit` | PASS |
| package export count check | PASS, exactly 16 approved private exports |
| protected path diff check | PASS, no package/runtime/DTO/schema/registry/binding/test diff |
| forbidden claim grep on changed files | PASS with classification: hits are negative guardrails only |
| forbidden package/private path grep | PASS, package exports contain no forbidden private paths |
| SoloCrew head/status check | PASS before edits; clean/read-only at expected reference |
| MPLP-Protocol head/status check | PASS before edits; clean/read-only at expected reference |

Final check results are reported in the task final report after commit.

## Decision

Selected:

`CGOS_UPSTREAM_PUBLIC_SURFACE_DESIGN_SELECTION_READY_NO_IMPLEMENTATION`

Rejected:

- `CGOS_UPSTREAM_PUBLIC_SURFACE_DESIGN_SELECTION_READY_WITH_CONDITIONS`
- `CGOS_UPSTREAM_PUBLIC_SURFACE_DESIGN_SELECTION_BLOCKED`

Meaning:

- all nine candidates receive one selection outcome;
- exactly three candidates advance to field design;
- advanced candidates are evidence/snapshot oriented, not runtime authority
  APIs;
- downstream-owned SoloCrew behavior remains explicitly separated;
- existing 16 exports are not overclaimed;
- no DTO/package/export/runtime/schema/registry/binding change occurs;
- no SoloCrew or MPLP modification occurs;
- no implementation is started;
- no P0/P1 blocker remains for field-design planning.

## Next Allowed Task

Recommended first:

`CGOS-UPSTREAM-PUBLIC-SURFACE-FIELD-DESIGN-WAVE-01`

Reason:

- this wave selects the exact three field-design tracks;
- the selected tracks are prerequisite inputs for later SoloCrew parity and
  bridge-replacement work;
- starting field design now clarifies neutral field families and hard
  non-fields before downstream code targets unstable assumptions;
- six other areas are explicitly held for existing-export exercise and should
  not drive new upstream design yet.

Alternative after field design:

`SOLOCREW-EXISTING-CGOS-EXPORTS-EXERCISE-PARITY-WAVE-01`

Owner may also pause development.
