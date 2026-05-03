# CGOS-RUNTIME-SESSION-WORKER-LIFECYCLE-SURFACE-ANALYSIS-WAVE-v0.1

## Document Control

- doc_id: CGOS-RUNTIME-SESSION-WORKER-LIFECYCLE-SURFACE-ANALYSIS-WAVE-v0.1
- task_id: CGOS-RUNTIME-SESSION-WORKER-LIFECYCLE-SURFACE-ANALYSIS-WAVE-01
- status: analysis / public surface strategy only
- date: 2026-05-03
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: a5f8326a9198fef1a5f51b9cbdec69b8d5692e11
- solocrew_second_wave_coverage_ref: 9175b012a1fa40ccc702232d2e97bdd6e21785a9
- mplp_no_change_ref: 2b89ee839fbf54c1fb282bca93ae1fc080aa1772
- no_export_change: true
- no_package_change: true
- no_runtime_change: true
- no_schema_registry_binding_change: true
- no_solocrew_modification: true
- no_mplp_modification: true

## Executive Summary

Runtime session creation and worker lifecycle modeling remain the two major
bridge blockers after the first-wave and second-wave public DTO surfaces.
Candidate public surfaces are justified, but only as neutral summary/evidence
DTOs. Constructors, mutable state, store handles, dispatcher authority, and
lifecycle runtime classes must remain private.

Bridge replacement planning remains blocked for full replacement. Partial
planning can continue only for package-backed evidence usage and local
quarantine candidates.

Selected next boundary:

`CGOS-THIRD-WAVE-RUNTIME-SESSION-WORKER-LIFECYCLE-FIELD-DESIGN-WAVE-01`

## Runtime Session Analysis

SoloCrew currently depends on runtime session assembly through its sealed
bridge. The key downstream consumer is `app/shell/create-runtime-session.ts`,
which wires `WorkerLifecycleRuntime`, state stores, learning services,
objective anchors, correction capture, preference writeback, and bounded action
dispatch into a local session facade.

Cognitive_OS currently implements runtime session behavior as a composition of
private runtime services rather than as one package-safe public session object.
`MinimalRuntimeOrchestratorSkeleton` accepts injected registry, binding, form,
memory, activation, policy, confirm, trace, reconcile, consolidation, VSL, PSG,
dispatch, objective-anchor, correction-capture, and preference-writeback
dependencies. It plans, dry-runs, executes, stores runtime objects, updates
continuity/graph state, and exposes optional action/learning operations when
those services are configured.

Must remain runtime-private:

- runtime session constructors and dependency injection parameters
- injected service instances and mutable stores
- `RuntimeObjectStore` instances and raw runtime object records
- optional `ActionDispatcher`, objective anchor, correction capture, and
  preference writeback services
- VSL/PSG live state mutation, store clearing, and runtime object creation
- direct `runtime/core` type passthrough that exposes object-store or execution
  internals

Can be summarized safely:

- session posture, such as scaffold-only, executing, blocked, unavailable, or
  summary-only
- configured capability posture, expressed as refs or booleans rather than
  service instances
- step-family coverage, such as form/place/activate/confirm/trace/reconcile/
  consolidate
- state, dispatch, learning, continuity, and projection evidence refs to
  existing public DTO families
- omission markers and boundary flags proving no runtime-private payload,
  storage write, mutation writeback, provider dispatch, channel dispatch, or
  tool invocation

A future `runtime-session-summary-dto` is valid if it remains posture-only and
non-executing. It should summarize session capability availability and point to
first-wave/second-wave evidence refs without exposing the session facade or
constructor.

A future `runtime-session-evidence-dto` is also justified. It should represent
read-only evidence about session creation posture, dependency family posture,
and omitted private fields. It must not contain session objects, initialized
services, live handles, raw runtime records, or invocation authority.

Rejected behavior/export path:

- exporting runtime session constructors
- exporting mutable session state
- exporting `MinimalRuntimeOrchestratorSkeleton` as a downstream bridge
  replacement surface
- exporting service dependency bundles
- exporting any runtime behavior that can execute a loop, dispatch action, write
  state, capture correction, or mutate preference state

## Worker Lifecycle Analysis

SoloCrew currently depends on `WorkerLifecycleRuntime` and `WorkerStore` through
the sealed bridge. It uses them as part of runtime session wiring rather than as
neutral package DTOs.

Cognitive_OS currently implements worker lifecycle as a mutable runtime class
backed by a worker store. `WorkerLifecycleRuntime` loads required worker
records, checks valid lifecycle transitions through `worker-state-machine.ts`,
updates status, event time, mutation class, revision, and last mutation time,
then saves the mutated worker record.

Must remain runtime-private:

- `WorkerLifecycleRuntime`
- worker lifecycle class constructors and store dependencies
- `WorkerStore` instances
- raw `AgentWorkerRecord` payloads
- lifecycle mutation methods such as activate, pause, block, resume, release,
  retire, and transition
- revision mutation details and internal clock behavior
- lifecycle runtime classes as package exports

Can be summarized safely:

- allowed lifecycle state vocabulary as neutral posture metadata
- transition posture summary without granting transition authority
- worker lifecycle availability as summary-only, evidence-only, blocked,
  deferred, or unsupported
- safe evidence refs for transition attempts or lifecycle inspection
- omission markers confirming raw worker records and mutable state are omitted
- boundary flags proving non-execution and no mutation/writeback authority

A future `worker-lifecycle-summary-dto` is valid if it describes lifecycle
posture and allowed state families without exporting runtime methods. It should
not be a state machine API.

A future `worker-lifecycle-evidence-dto` is justified for transition evidence
and lifecycle posture observations. It should record safe references and
outcomes, but it must not expose transition functions or mutable records.

Lifecycle runtime classes must remain non-exportable. They are runtime behavior,
not public DTO surfaces.

## Candidate Surface Options

| Surface | Purpose | Field-family sketch | Risk level | Bridge replacement value | Runtime-private exposure risk | Readiness |
| --- | --- | --- | --- | --- | --- | --- |
| `runtime-session-summary-dto` | Summarize runtime session posture without constructing a session. | `session_summary_id`, contract metadata, source refs, session_posture, configured_capability_summaries, first_wave_refs, second_wave_refs, safe_evidence_refs, omission_markers, boundary_flags. | medium | high for planning, partial for replacement | medium if capability refs become service refs | READY_FOR_FIELD_DESIGN |
| `runtime-session-evidence-dto` | Evidence envelope for session creation posture and omitted private dependencies. | `session_evidence_id`, contract metadata, creation_posture, dependency_family_posture, blocked_or_deferred_reason, safe_evidence_refs, runtime_private_fields_omitted, boundary_flags. | medium-high | high for bridge audit evidence, partial for replacement | high if constructors or live instances leak | READY_FOR_FIELD_DESIGN |
| `worker-lifecycle-summary-dto` | Summarize worker lifecycle state/posture without lifecycle runtime authority. | `worker_lifecycle_summary_id`, contract metadata, lifecycle_posture, supported_state_families, transition_posture_summary, worker_scope_summary, safe_evidence_refs, omission_markers, boundary_flags. | medium | high for replacing direct lifecycle type dependency | medium if state machine is mistaken for behavior API | READY_FOR_FIELD_DESIGN |
| `worker-lifecycle-evidence-dto` | Evidence envelope for lifecycle transition posture and observation results. | `worker_lifecycle_evidence_id`, contract metadata, transition_evidence_posture, observed_state_ref, target_state_ref, outcome_summary, safe_evidence_refs, runtime_private_fields_omitted, boundary_flags. | medium-high | high for bridge coverage evidence, partial for replacement | high if transition authority or raw records leak | READY_FOR_FIELD_DESIGN |

## Explicit Non-Candidates / Rejections

Rejected surfaces:

- runtime session constructors
- runtime session mutable state
- `WorkerLifecycleRuntime` direct export
- lifecycle runtime classes
- execution orchestrator internals
- state store handles
- dispatcher/provider/channel/tool authority
- direct `runtime/core` passthrough
- product-specific SoloCrew semantics

These rejected surfaces would turn a public DTO wave into runtime behavior
exposure. They are not candidates for package exports.

## Bridge Replacement Impact

Adding summary/evidence DTOs would not remove bridge usage by itself.

It would reduce planning ambiguity by creating neutral package subpaths for the
two remaining uncovered capability groups. That would let SoloCrew prove import
coverage and compare field families against legacy bridge usage without
touching runtime internals.

It would still require SoloCrew-owned quarantine for product display shapes,
local session facade wiring, test-only historical fixtures, and any route,
customer, dashboard, cell, or engagement-specific model.

Some legacy bridge usage may require no additional CGOS surface if the owner
chooses to retire or quarantine it locally instead of preserving upstream-backed
semantics.

## Relationship to Existing First/Second-Wave DTOs

The third-wave candidates would sit above the existing public DTO families:

- `RuntimeReadinessStatusDto` already provides action/readiness/status
  vocabulary that session summary can reference.
- `RuntimeProjectionSummaryDto` already provides projection-safe summary and
  omission conventions.
- `BoundedExecutionEventDto` already models bounded event evidence without
  dispatch authority.
- `ObjectiveContinuityDto` already provides continuity posture language.
- `StatePortSummaryDto` already covers state-port posture without store
  handles.
- `PersistenceRoundtripEvidenceDto` already covers roundtrip evidence without
  storage authority.
- `MemoryPreferenceSummaryDto` already covers memory/preference projection
  posture.
- `LearningCorrectionEvidenceDto` already covers correction evidence without
  writeback or training authority.
- `RuntimeActionRequestSummaryDto` already covers request posture without
  execution authority.
- `RuntimeDispatchBoundaryEvidenceDto` already covers dispatch boundary
  evidence without provider, channel, or tool authority.

Runtime-session and worker-lifecycle DTOs should reference these surfaces rather
than duplicate or widen them.

## Recommended Strategy

Selected strategy:

Split: CGOS summary/evidence DTOs + SoloCrew quarantine.

Cognitive_OS should proceed to field design for four third-wave DTO candidates:

- `runtime-session-summary-dto`
- `runtime-session-evidence-dto`
- `worker-lifecycle-summary-dto`
- `worker-lifecycle-evidence-dto`

SoloCrew should still quarantine or own product-specific display models, local
session facade behavior, and historical compatibility tests. CGOS should not
attempt to make downstream bridge replacement automatic through public DTOs.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| over-exporting runtime internals | Would expose constructors, stores, or service authority as public surface. | Restrict third-wave work to type-only summary/evidence DTOs. |
| making lifecycle summaries look like execution authority | Could imply downstream code may perform transitions through public DTOs. | Require non-executing and no-mutation boundary flags. |
| confusing evidence with behavior | Could make import success look like runtime replacement. | Keep evidence refs separate from functions/classes/services. |
| under-covering bridge debt | Could leave SoloCrew still blocked after DTO import proof. | Pair CGOS field design with SoloCrew quarantine planning. |
| SoloCrew product semantic leakage | Could promote downstream display semantics into CGOS canonical fields. | Keep field families neutral and reject product-specific terms. |
| dependency strategy hiding unresolved bridge risks | Could make package availability look like migration completion. | Keep dependency strategy separate from bridge replacement evidence. |

## Decision Options

Selected:

`CGOS_RUNTIME_SESSION_WORKER_LIFECYCLE_ANALYSIS_PASS_SPLIT_CGOS_DTO_AND_SOLOCREW_QUARANTINE_NEEDED`

Not selected:

- `CGOS_RUNTIME_SESSION_WORKER_LIFECYCLE_ANALYSIS_PASS_THIRD_WAVE_DESIGN_READY`
- `CGOS_RUNTIME_SESSION_WORKER_LIFECYCLE_ANALYSIS_PASS_KEEP_PRIVATE_QUARANTINE_READY`
- `CGOS_RUNTIME_SESSION_WORKER_LIFECYCLE_ANALYSIS_BLOCKED_NEEDS_MORE_USAGE_DATA`

## Next Allowed Task

`CGOS-THIRD-WAVE-RUNTIME-SESSION-WORKER-LIFECYCLE-FIELD-DESIGN-WAVE-01`

Expected follow-on or parallel owner-approved boundary:

`SOLOCREW-CGOS-LEGACY-BRIDGE-OWNERSHIP-AND-QUARANTINE-WAVE-01`

Owner may also pause development.
