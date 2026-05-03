# CGOS-THIRD-WAVE-RUNTIME-SESSION-WORKER-LIFECYCLE-FIELD-DESIGN-WAVE-v0.1

## Document Control

- doc_id: CGOS-THIRD-WAVE-RUNTIME-SESSION-WORKER-LIFECYCLE-FIELD-DESIGN-WAVE-v0.1
- task_id: CGOS-THIRD-WAVE-RUNTIME-SESSION-WORKER-LIFECYCLE-FIELD-DESIGN-WAVE-01
- status: field design and implementation readiness only
- date: 2026-05-03
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: 014af7f629fdc9d4533196f53b4119b3ec62ce9a
- solocrew_second_wave_coverage_ref: 9175b012a1fa40ccc702232d2e97bdd6e21785a9
- mplp_no_change_ref: 2b89ee839fbf54c1fb282bca93ae1fc080aa1772
- no_export_change: true
- no_package_change: true
- no_runtime_change: true
- no_schema_registry_binding_change: true
- no_solocrew_modification: true
- no_mplp_modification: true

## Executive Summary

Third-wave design result: ready with conditions.

Implementation readiness result: all four runtime-session and worker-lifecycle
DTO candidates are implementation-ready with conditions. The conditions are
strict: each future file must stay type-only, summary/evidence-only,
non-executing, and free of constructors, mutable state, service instances,
lifecycle transition authority, runtime-private payloads, package export
changes, schemas, registry entries, and bindings.

All four DTO candidates may be implemented together in the next bounded
implementation wave:

- `runtime-session-summary-dto`
- `runtime-session-evidence-dto`
- `worker-lifecycle-summary-dto`
- `worker-lifecycle-evidence-dto`

SoloCrew quarantine remains required. These DTOs can reduce bridge planning
ambiguity, but they do not replace SoloCrew product display models, local
session facade behavior, historical compatibility fixtures, or downstream
bridge migration work.

Next boundary:

`CGOS-THIRD-WAVE-RUNTIME-SESSION-WORKER-LIFECYCLE-DTO-IMPLEMENTATION-WAVE-01`

## Third-Wave Design Principles

- Summary/evidence-only posture: third-wave files define data contracts, not
  executable APIs.
- Non-executing semantics: DTOs must not create sessions, run lifecycle
  transitions, invoke stores, call dispatchers, or mutate runtime objects.
- No constructor exposure: runtime session constructors and lifecycle class
  constructors remain private.
- No mutable state exposure: mutable stores, live handles, raw records, and
  revision mutation details remain private.
- No lifecycle transition authority: transition methods and state-machine
  execution are not public DTO concepts.
- No service dependency bundle exposure: injected registry, binding, memory,
  activation, policy, confirm, trace, reconcile, consolidation, VSL, PSG,
  dispatch, objective, correction, and preference services remain private.
- No runtime-private payloads: runtime objects, worker records, and service
  instances must be represented only by safe refs or omission markers.
- No provider/channel/tool dispatch: public DTOs must not grant dispatch,
  provider, channel, handler, or tool invocation authority.
- No storage write: state and persistence posture can be summarized, but store
  writes and handles remain private.
- No mutation/writeback: learning, preference, worker, and runtime mutation
  authority must stay out of the DTO surface.
- No training authority: evidence and summary DTOs must not imply model
  training, correction application, or learning writeback authority.
- Versioned metadata: every top-level DTO must carry contract and runtime
  contract versions.
- Omission markers: every DTO must make omitted private fields explicit and
  machine-readable.
- Safe evidence refs: refs must point to bounded evidence or summaries, not
  live objects or runtime internals.
- `first_wave_refs` and `second_wave_refs`: third-wave DTOs may reference
  existing first-wave and second-wave DTO evidence without widening those
  contracts.
- No SoloCrew product semantics: product display terms, local route concepts,
  customer concepts, and downstream facades must not become CGOS public fields.
- No MPLP normative change: this wave is implementation-layer design only.

## Candidate-by-Candidate Field Design

### A. `runtime-session-summary-dto`

- Proposed file name: `runtime/public/runtime-session-summary-dto.ts`
- Candidate type: summary DTO
- Purpose: summarize runtime session posture and capability availability without
  constructing or exposing a runtime session.
- Bridge capability addressed: runtime session creation / runtime session
  posture.
- Required exported type concepts:
  - `RuntimeSessionSummaryDto`
  - `RuntimeSessionPostureDto`
  - `RuntimeSessionCapabilitySummaryDto`
  - `RuntimeSessionBoundaryProfile`
- Required field families:
  - `runtime_session_summary_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `session_posture`
  - `configured_capability_summaries`
  - `step_family_coverage_summary`
  - `first_wave_refs`
  - `second_wave_refs`
  - `safe_evidence_refs`
  - `version_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Required boundary flags:
  - common third-wave boundary flags
  - `projection_safe`
  - `evidence_safe`
  - `non_executing`
  - `no_constructor_exposure`
  - `no_service_instance_exposure`
  - `no_mutable_state_exposure`
  - `no_lifecycle_transition_authority`
- Forbidden fields:
  - `constructor_args`
  - `service_instances`
  - `session_facade`
  - `RuntimeObjectStore`
  - `ActionDispatcher`
  - `MinimalRuntimeOrchestratorSkeleton`
  - `VSL_live_handle`
  - `PSG_live_handle`
  - `runtime_object_creation`
- Relationship to first/second-wave DTOs:
  - may reference `RuntimeReadinessStatusDto` for readiness posture
  - may reference `RuntimeProjectionSummaryDto` for projection-safe summary
    posture
  - may reference `BoundedExecutionEventDto` and `ObjectiveContinuityDto` for
    bounded event and continuity evidence
  - may reference second-wave state, persistence, memory, learning, action, and
    dispatch DTOs through `second_wave_refs` and `safe_evidence_refs`
  - must not duplicate or widen first-wave or second-wave field contracts
- Implementation readiness: `READY_WITH_CONDITIONS`

### B. `runtime-session-evidence-dto`

- Proposed file name: `runtime/public/runtime-session-evidence-dto.ts`
- Candidate type: evidence DTO
- Purpose: record bounded evidence about session creation posture and omitted
  dependency families without exposing initialized runtime services.
- Bridge capability addressed: runtime session creation evidence.
- Required exported type concepts:
  - `RuntimeSessionEvidenceDto`
  - `RuntimeSessionCreationPostureDto`
  - `RuntimeSessionDependencyFamilyPostureDto`
  - `RuntimeSessionEvidenceBoundaryProfile`
- Required field families:
  - `runtime_session_evidence_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `creation_posture`
  - `dependency_family_posture`
  - `blocked_or_deferred_reason`
  - `first_wave_refs`
  - `second_wave_refs`
  - `safe_evidence_refs`
  - `version_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Required boundary flags:
  - common third-wave boundary flags
  - `evidence_safe`
  - `runtime_private_payload_omitted`
  - `non_executing`
  - `no_constructor_exposure`
  - `no_service_instance_exposure`
  - `no_mutable_state_exposure`
  - `no_provider_dispatch`
  - `no_channel_dispatch`
  - `no_tool_invocation`
- Forbidden fields:
  - initialized services
  - mutable session objects
  - raw runtime records
  - invocation authority
  - `constructor_args`
  - `service_instances`
  - `session_facade`
  - `runtime_object_creation`
- Relationship to first/second-wave DTOs:
  - complements first-wave bounded event and readiness evidence without
    becoming an execution envelope
  - can reference second-wave dispatch boundary evidence and action request
    posture without adding dispatch authority
  - can reference state and persistence evidence without exposing store handles
- Implementation readiness: `READY_WITH_CONDITIONS`

### C. `worker-lifecycle-summary-dto`

- Proposed file name: `runtime/public/worker-lifecycle-summary-dto.ts`
- Candidate type: summary DTO
- Purpose: summarize worker lifecycle posture, state families, transition
  posture, and worker scope without exporting lifecycle runtime classes.
- Bridge capability addressed: worker lifecycle modeling / worker lifecycle
  posture.
- Required exported type concepts:
  - `WorkerLifecycleSummaryDto`
  - `WorkerLifecyclePostureDto`
  - `WorkerLifecycleStateFamilyDto`
  - `WorkerLifecycleBoundaryProfile`
- Required field families:
  - `worker_lifecycle_summary_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `lifecycle_posture`
  - `supported_state_families`
  - `transition_posture_summary`
  - `worker_scope_summary`
  - `first_wave_refs`
  - `second_wave_refs`
  - `safe_evidence_refs`
  - `version_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Required boundary flags:
  - common third-wave boundary flags
  - `projection_safe`
  - `evidence_safe`
  - `runtime_private_payload_omitted`
  - `non_executing`
  - `no_mutable_state_exposure`
  - `no_lifecycle_transition_authority`
  - `no_storage_write`
  - `no_mutation_writeback`
- Forbidden fields:
  - `WorkerLifecycleRuntime`
  - `WorkerStore`
  - `AgentWorkerRecord`
  - `lifecycle_transition_method`
  - `transition_function`
  - `mutable_worker_record`
  - `revision_mutation_details`
- Relationship to first/second-wave DTOs:
  - can reference first-wave readiness, projection, event, and continuity
    posture for contextual summary only
  - can reference second-wave state-port and persistence DTOs for worker storage
    posture without exposing stores
  - can reference second-wave dispatch boundary DTOs without implying lifecycle
    transition authority
- Implementation readiness: `READY_WITH_CONDITIONS`

### D. `worker-lifecycle-evidence-dto`

- Proposed file name: `runtime/public/worker-lifecycle-evidence-dto.ts`
- Candidate type: evidence DTO
- Purpose: record bounded lifecycle transition evidence posture and observation
  outcomes without exposing transition functions or mutable worker records.
- Bridge capability addressed: worker lifecycle evidence.
- Required exported type concepts:
  - `WorkerLifecycleEvidenceDto`
  - `WorkerLifecycleTransitionEvidencePostureDto`
  - `WorkerLifecycleObservationOutcomeDto`
  - `WorkerLifecycleEvidenceBoundaryProfile`
- Required field families:
  - `worker_lifecycle_evidence_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `transition_evidence_posture`
  - `observed_state_ref`
  - `target_state_ref`
  - `outcome_summary`
  - `first_wave_refs`
  - `second_wave_refs`
  - `safe_evidence_refs`
  - `version_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Required boundary flags:
  - common third-wave boundary flags
  - `evidence_safe`
  - `runtime_private_payload_omitted`
  - `non_executing`
  - `no_lifecycle_transition_authority`
  - `no_mutable_state_exposure`
  - `no_storage_write`
  - `no_mutation_writeback`
- Forbidden fields:
  - transition functions
  - mutable records
  - lifecycle runtime class
  - state machine execution
  - `WorkerLifecycleRuntime`
  - `WorkerStore`
  - `AgentWorkerRecord`
  - `revision_mutation_details`
- Relationship to first/second-wave DTOs:
  - complements `BoundedExecutionEventDto` evidence style without becoming an
    execution event or transition API
  - can reference `StatePortSummaryDto` and
    `PersistenceRoundtripEvidenceDto` for storage posture context
  - can reference `RuntimeDispatchBoundaryEvidenceDto` to prove no dispatch
    authority was granted
- Implementation readiness: `READY_WITH_CONDITIONS`

## Common Metadata Contract

Every third-wave DTO must include these shared fields:

- `contract_version`
- `runtime_contract_version`
- `compatibility_profile`
- `source_runtime_surface_ref`
- `source_commit_ref`
- `first_wave_refs`
- `second_wave_refs`
- `safe_evidence_refs`
- `version_refs`
- `omission_markers`
- `runtime_private_fields_omitted`
- `boundary_flags`

`first_wave_refs` and `second_wave_refs` must be reference-only. They may name
or point to existing DTO evidence, but they must not inline private runtime
payloads, runtime objects, worker records, service instances, store handles, or
dispatch authority.

## Boundary Flag Requirements

Every third-wave boundary profile must include these required flags, and the
shared boundary tests must assert the full required set for each candidate:

- `projection_safe`
- `evidence_safe`
- `runtime_private_payload_omitted`
- `non_executing`
- `no_constructor_exposure`
- `no_service_instance_exposure`
- `no_mutable_state_exposure`
- `no_lifecycle_transition_authority`
- `no_storage_write`
- `no_mutation_writeback`
- `no_training_authority`
- `no_provider_dispatch`
- `no_channel_dispatch`
- `no_tool_invocation`
- `no_package_publish`
- `no_certification_or_endorsement`

## Forbidden Field / Surface Rules

Explicitly forbidden in third-wave DTO files, tests, package exports, schemas,
registry entries, bindings, and helper bundles:

- `constructor_args`
- `service_instances`
- `session_facade`
- `RuntimeObjectStore`
- `ActionDispatcher`
- `MinimalRuntimeOrchestratorSkeleton`
- `VSL_live_handle`
- `PSG_live_handle`
- `runtime_object_creation`
- `WorkerLifecycleRuntime`
- `WorkerStore`
- `AgentWorkerRecord`
- `lifecycle_transition_method`
- `transition_function`
- `mutable_worker_record`
- `revision_mutation_details`
- `runtime/core passthrough`
- `runtime/lifecycle passthrough`
- `runtime/state passthrough`
- `runtime/learning passthrough`
- `runtime/execution passthrough`
- `provider_dispatch`
- `channel_dispatch`
- `tool_invocation`
- `storage_write`
- `mutation_writeback`
- `training_authority`
- `founder`
- `dashboard`
- `cell`
- `engagement`
- `customer`
- `route`
- `paid_pilot`
- `commercial_readiness`

## Implementation Readiness Matrix

| Candidate | Batch classification | Conditions | Readiness |
| --- | --- | --- | --- |
| `runtime-session-summary-dto` | Ready first implementation batch | Type-only summary DTO; no constructors, session facade, stores, services, dispatchers, or runtime object creation. | READY_WITH_CONDITIONS |
| `runtime-session-evidence-dto` | Ready first implementation batch | Type-only evidence DTO; no initialized services, mutable session objects, raw runtime records, or invocation authority. | READY_WITH_CONDITIONS |
| `worker-lifecycle-summary-dto` | Ready first implementation batch | Type-only summary DTO; no lifecycle class, worker store, raw worker record, transition methods, or revision mutation details. | READY_WITH_CONDITIONS |
| `worker-lifecycle-evidence-dto` | Ready first implementation batch | Type-only evidence DTO; no transition functions, mutable records, lifecycle runtime class, or state machine execution. | READY_WITH_CONDITIONS |

Rejected implementation paths:

- package export map changes in the implementation wave
- helper bundle creation
- runtime behavior or function/class/service exports
- schemas, registry entries, or bindings
- SoloCrew bridge replacement or quarantine implementation
- MPLP schema, spec, or core-law changes

## Future Implementation Scope

If implementation proceeds, the exact future allowed files are:

- `runtime/public/runtime-session-summary-dto.ts`
- `runtime/public/runtime-session-evidence-dto.ts`
- `runtime/public/worker-lifecycle-summary-dto.ts`
- `runtime/public/worker-lifecycle-evidence-dto.ts`
- `tests/runtime/third-wave-runtime-session-worker-lifecycle-dto-boundary.test.mjs`

Future implementation wave boundaries:

- no package export map change
- no package publication
- no helper bundle
- no runtime behavior
- no runtime classes/functions/services
- no schema/registry/binding change
- no SoloCrew changes
- no MPLP changes

## Required Future Tests

Future implementation must verify:

- all four files exist
- type-only DTO/evidence boundary
- no internal runtime imports
- required metadata fields
- required boundary flags
- forbidden fields absent
- no runtime classes/functions/services
- no constructor exposure
- no lifecycle transition authority
- no mutable state exposure
- no service instance exposure
- no provider/channel/tool authority
- no product vocabulary
- package exports unchanged
- no schema/registry/binding changes

The boundary test should also assert that each third-wave file stays out of the
package export map until a separate export-readiness and export-implementation
wave authorizes subpath publication.

## Relationship to Existing DTO Waves

Third-wave DTOs should reference or complement existing DTOs as follows:

- `RuntimeReadinessStatusDto`: source for readiness, action class, artifact,
  learning, and continuation posture language.
- `RuntimeProjectionSummaryDto`: source for projection-safe summary discipline,
  state posture summaries, operational-unit refs, and omission markers.
- `BoundedExecutionEventDto`: source for bounded event evidence style without
  dispatch or execution authority.
- `ObjectiveContinuityDto`: source for objective continuity references without
  exposing objective stores or anchors.
- `StatePortSummaryDto`: source for state-port posture without `WorkerStore`,
  sqlite, or state store handles.
- `PersistenceRoundtripEvidenceDto`: source for persistence evidence without
  storage writes or raw persistence records.
- `MemoryPreferenceSummaryDto`: source for memory/preference posture without
  raw memory, preference payloads, or writeback authority.
- `LearningCorrectionEvidenceDto`: source for correction evidence without
  correction capture service export or training authority.
- `RuntimeActionRequestSummaryDto`: source for request posture without
  execution or dispatcher authority.
- `RuntimeDispatchBoundaryEvidenceDto`: source for dispatch denial and boundary
  evidence without provider, channel, or tool invocation.

Third-wave DTOs must not widen any first-wave or second-wave DTO. They should
only add neutral runtime-session and worker-lifecycle summary/evidence layers
that point to existing evidence by safe refs.

## Relationship to SoloCrew Quarantine

No SoloCrew change is authorized in this task.

SoloCrew quarantine remains required for:

- product display models
- local session facade behavior
- app shell wiring
- historical compatibility fixtures
- route/customer/dashboard/cell/engagement-specific semantics
- test-only bridge compatibility surfaces

Bridge replacement is not authorized by this field-design wave. A future
SoloCrew quarantine or bridge replacement plan must separately decide which
usages become SoloCrew-owned, which usages consume future CGOS DTO exports, and
which usages remain blocked.

## Relationship to Package Exports

- no package export change now
- future implementation creates files only
- export readiness and export implementation are separate future waves
- package publication remains out of scope
- third-wave DTO files must not be claimed as package exports until a later
  package-export task changes `package.json`

## Relationship to MPLP

- no MPLP schema/spec/core-law change
- implementation-layer DTO/evidence surfaces only
- any MPLP candidate mapping must be separate and non-normative

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| constructor leakage | Would expose runtime session creation as public API. | Require `no_constructor_exposure` and deny `constructor_args`. |
| service instance leakage | Would expose dependency bundles or live services. | Require `no_service_instance_exposure` and safe refs only. |
| lifecycle transition authority leakage | Would turn lifecycle DTOs into mutation APIs. | Require `no_lifecycle_transition_authority` and deny transition functions. |
| summary mistaken for executable session API | Could make downstream code treat DTO imports as runtime behavior. | Require non-executing wording and empty-runtime-module expectations. |
| evidence mistaken for behavior | Could make evidence refs look like action or lifecycle authority. | Keep evidence refs bounded and non-authoritative. |
| SoloCrew product semantic leakage | Would promote downstream product display semantics into CGOS. | Deny product vocabulary and keep quarantine required. |
| false bridge replacement readiness | Could obscure remaining downstream migration and quarantine work. | State that implementation reduces ambiguity but does not replace the bridge. |
| package export confusion | Could make file creation look like package publication. | Keep implementation and export waves separate. |

## Remaining Gap Classification

- P2 third-wave DTO implementation gap
- P2 third-wave package export readiness gap after implementation
- P2 SoloCrew quarantine/ownership gap
- P2 bridge replacement gap
- P2 downstream import migration gap
- P2 dependency strategy gap
- P2/P3 package publication gap
- No P0/P1 blocker found

## Decision Options

Selected:

`CGOS_THIRD_WAVE_RUNTIME_SESSION_WORKER_LIFECYCLE_FIELD_DESIGN_READY_WITH_CONDITIONS`

Not selected:

- `CGOS_THIRD_WAVE_RUNTIME_SESSION_WORKER_LIFECYCLE_FIELD_DESIGN_READY_FOR_IMPLEMENTATION`
- `CGOS_THIRD_WAVE_RUNTIME_SESSION_WORKER_LIFECYCLE_FIELD_DESIGN_PARTIAL_NEEDS_ANALYSIS`
- `CGOS_THIRD_WAVE_RUNTIME_SESSION_WORKER_LIFECYCLE_FIELD_DESIGN_BLOCKED`

## Next Allowed Task

`CGOS-THIRD-WAVE-RUNTIME-SESSION-WORKER-LIFECYCLE-DTO-IMPLEMENTATION-WAVE-01`

Owner may also pause development.
