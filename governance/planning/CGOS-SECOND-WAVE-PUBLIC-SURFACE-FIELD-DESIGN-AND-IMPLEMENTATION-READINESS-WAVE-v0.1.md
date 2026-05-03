# CGOS-SECOND-WAVE-PUBLIC-SURFACE-FIELD-DESIGN-AND-IMPLEMENTATION-READINESS-WAVE-v0.1

## Document Control

- doc_id: CGOS-SECOND-WAVE-PUBLIC-SURFACE-FIELD-DESIGN-AND-IMPLEMENTATION-READINESS-WAVE-v0.1
- task_id: CGOS-SECOND-WAVE-PUBLIC-SURFACE-FIELD-DESIGN-AND-IMPLEMENTATION-READINESS-WAVE-01
- status: field design and implementation readiness wave only
- date: 2026-05-03
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: abbd9d7dcb4faae4610c7d12a4f38ef66eee7836
- solocrew_bridge_readiness_ref: b4ceae647b6bb43c8ec5e8d20c4f7368f4403165
- mplp_no_change_ref: 2b89ee839fbf54c1fb282bca93ae1fc080aa1772
- no_export_change: true
- no_package_change: true
- no_runtime_change: true
- no_schema_registry_binding_change: true
- no_solocrew_modification: true
- no_mplp_modification: true

## Executive Summary

Second-wave field design result: ready with conditions.

Implementation readiness result: the first implementation batch is ready, but
the wave as a whole remains ready with conditions because two candidates still
need deeper usage analysis.

Recommended first implementation batch:

- `state-port-summary-dto`
- `persistence-roundtrip-evidence-dto`
- `memory-preference-summary-dto`
- `learning-correction-evidence-dto`
- `runtime-action-request-summary-dto`
- `runtime-dispatch-boundary-evidence-dto`

Deferred candidates:

- `runtime-session-summary-dto`
- `worker-lifecycle-summary-dto`

Rejected surfaces:

- direct `WorkerLifecycleRuntime` export
- direct `SQLiteStateStore` export
- direct `runtime/core` passthrough
- direct dispatch service export
- mutation/writeback service export
- provider/channel/tool authority
- product-specific dashboard/cell/founder semantics as CGOS canonical fields
- test-only historical fixtures as CGOS public surfaces

Next boundary:

`CGOS-SECOND-WAVE-PUBLIC-SURFACE-DTO-IMPLEMENTATION-WAVE-01`

No implementation is authorized in this wave.

## Design Principles

- DTO/evidence-only posture.
- Projection-safe and evidence-safe semantics.
- No runtime-private payloads.
- No direct store/sqlite/worker/runtime class export.
- No dispatcher/provider/channel/tool authority.
- Versioned metadata on every top-level surface.
- Omission markers are explicit and machine-readable.
- Safe evidence refs must be bounded, stable, and non-authoritative.
- First-wave DTOs remain the semantic anchor for readiness, projection,
  bounded event, and continuity language.
- No SoloCrew product semantics become canonical CGOS fields.
- No MPLP normative change is implied.

## Candidate-by-Candidate Field Design

### A. `state-port-summary-dto`

- Proposed file name: `runtime/public/state-port-summary-dto.ts`
- Candidate type: port descriptor
- Capability addressed: state persistence / sqlite roundtrip posture
- Required exported type concepts:
  - `StatePortSummaryDto`
  - `StatePortModeDto`
  - `StatePortPostureDto`
  - `StatePortBoundaryProfile`
- Required field families:
  - `state_port_summary_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `port_mode`
  - `supported_persistence_modes`
  - `storage_posture_summary`
  - `roundtrip_support_summary`
  - `safe_evidence_refs`
  - `version_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Boundary flags:
  - common second-wave boundary flags
  - `no_storage_write`
  - `no_mutation_writeback`
- Forbidden fields:
  - `SQLiteStateStore`
  - `sqlite_handle`
  - `database_connection`
  - `file_system_write`
  - `state_store_instance`
  - raw store records
  - write APIs
- Relationship to first-wave DTOs:
  - mirrors the first-wave contract metadata discipline
  - can reference `RuntimeProjectionSummaryDto` style summary/ref families
  - should stay adjacent to `RuntimeReadinessStatusDto` boundary language
- Implementation readiness:
  - `READY_FOR_IMPLEMENTATION`

### B. `persistence-roundtrip-evidence-dto`

- Proposed file name: `runtime/public/persistence-roundtrip-evidence-dto.ts`
- Candidate type: evidence envelope
- Capability addressed: persistence roundtrip evidence
- Required exported type concepts:
  - `PersistenceRoundtripEvidenceDto`
  - `PersistenceRoundtripOutcomeDto`
  - `PersistenceRoundtripPathDto`
  - `PersistenceRoundtripBoundaryProfile`
- Required field families:
  - `roundtrip_evidence_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `roundtrip_outcome`
  - `roundtrip_mode`
  - `pre_state_ref`
  - `post_state_ref`
  - `safe_evidence_refs`
  - `version_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Boundary flags:
  - common second-wave boundary flags
  - `no_storage_write`
  - `no_mutation_writeback`
- Forbidden fields:
  - database handles
  - filesystem writes
  - raw persistence records
  - storage mutation APIs
  - store class exports
- Relationship to first-wave DTOs:
  - extends the non-executing evidence style used by `BoundedExecutionEventDto`
  - can reuse first-wave safe evidence language and omission markers
- Implementation readiness:
  - `READY_FOR_IMPLEMENTATION`

### C. `memory-preference-summary-dto`

- Proposed file name: `runtime/public/memory-preference-summary-dto.ts`
- Candidate type: summary
- Capability addressed: memory/preference behavior summary
- Required exported type concepts:
  - `MemoryPreferenceSummaryDto`
  - `MemorySummaryDto`
  - `PreferenceSummaryDto`
  - `MemoryPreferenceBoundaryProfile`
- Required field families:
  - `memory_preference_summary_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `memory_posture_summary`
  - `preference_posture_summary`
  - `supported_projection_scopes`
  - `safe_evidence_refs`
  - `version_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Boundary flags:
  - common second-wave boundary flags
  - `no_mutation_writeback`
  - `no_storage_write`
- Forbidden fields:
  - raw memory payload
  - raw preference payload
  - preference writeback APIs
  - mutation authority
  - product-specific semantics such as `founder`, `customer`, `route`, or `engagement`
- Relationship to first-wave DTOs:
  - can build on `RuntimeProjectionSummaryDto` and `ObjectiveContinuityDto` style safe summaries
  - should remain evidence-safe rather than state-authoritative
- Implementation readiness:
  - `READY_FOR_IMPLEMENTATION`

### D. `learning-correction-evidence-dto`

- Proposed file name: `runtime/public/learning-correction-evidence-dto.ts`
- Candidate type: evidence envelope
- Capability addressed: learning/correction capture evidence
- Required exported type concepts:
  - `LearningCorrectionEvidenceDto`
  - `LearningCorrectionCaptureDto`
  - `LearningCorrectionOutcomeDto`
  - `LearningCorrectionBoundaryProfile`
- Required field families:
  - `learning_correction_evidence_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `capture_status`
  - `capture_summary`
  - `correction_summary`
  - `safe_evidence_refs`
  - `version_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Boundary flags:
  - common second-wave boundary flags
  - `no_mutation_writeback`
  - `no_training_authority`
- Forbidden fields:
  - `InMemoryCorrectionCapture`
  - `PreferenceWritebackService`
  - training authority
  - writeback APIs
  - raw learning records
- Relationship to first-wave DTOs:
  - complements `RuntimeReadinessStatusDto` and `BoundedExecutionEventDto` by staying evidence-only
  - can reference continuity and projection summaries without exposing learning internals
- Implementation readiness:
  - `READY_FOR_IMPLEMENTATION`

### E. `runtime-action-request-summary-dto`

- Proposed file name: `runtime/public/runtime-action-request-summary-dto.ts`
- Candidate type: summary
- Capability addressed: action request posture
- Required exported type concepts:
  - `RuntimeActionRequestSummaryDto`
  - `RuntimeActionIntentDto`
  - `RuntimeActionRequestBoundaryProfile`
- Required field families:
  - `action_request_summary_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `requested_action_summary`
  - `action_class`
  - `request_posture`
  - `blocked_or_deferred_reason`
  - `safe_evidence_refs`
  - `version_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Boundary flags:
  - common second-wave boundary flags
  - `no_provider_dispatch`
  - `no_channel_dispatch`
  - `no_tool_invocation`
- Forbidden fields:
  - execution authority
  - dispatch authority
  - provider dispatch
  - channel dispatch
  - handler services
- Relationship to first-wave DTOs:
  - extends the action/readiness language in `RuntimeReadinessStatusDto`
  - keeps the event/request boundary non-executing like `BoundedExecutionEventDto`
- Implementation readiness:
  - `READY_FOR_IMPLEMENTATION`

### F. `runtime-dispatch-boundary-evidence-dto`

- Proposed file name: `runtime/public/runtime-dispatch-boundary-evidence-dto.ts`
- Candidate type: evidence envelope
- Capability addressed: dispatch boundary posture
- Required exported type concepts:
  - `RuntimeDispatchBoundaryEvidenceDto`
  - `RuntimeDispatchPermissionSummaryDto`
  - `RuntimeDispatchBoundaryProfile`
- Required field families:
  - `dispatch_boundary_evidence_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `dispatch_posture_summary`
  - `blocked_dispatch_targets`
  - `rejection_reason_summary`
  - `safe_evidence_refs`
  - `version_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Boundary flags:
  - common second-wave boundary flags
  - `no_provider_dispatch`
  - `no_channel_dispatch`
  - `no_tool_invocation`
- Forbidden fields:
  - dispatcher services
  - handler services
  - provider/channel/tool execution
  - authority-bearing request envelopes
- Relationship to first-wave DTOs:
  - sharpens the non-executing dispatch boundary already modeled by `BoundedExecutionEventDto`
  - can cite first-wave event evidence without exposing runtime authority
- Implementation readiness:
  - `READY_FOR_IMPLEMENTATION`

### G. `runtime-session-summary-dto`

- Proposed file name: `runtime/public/runtime-session-summary-dto.ts`
- Candidate type: summary
- Capability addressed: runtime session creation
- Required exported type concepts:
  - `RuntimeSessionSummaryDto`
  - `RuntimeSessionStateSummaryDto`
  - `RuntimeSessionBoundaryProfile`
- Required field families:
  - `runtime_session_summary_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `session_posture_summary`
  - `session_scope_ref`
  - `session_phase_summary`
  - `safe_evidence_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Boundary flags:
  - common second-wave boundary flags
  - `no_storage_write`
  - `no_mutation_writeback`
- Forbidden fields:
  - runtime session constructor
  - internal session state
  - lifecycle runtime classes
  - store/adapters
  - product semantics
- Relationship to first-wave DTOs:
  - only adjacent via readiness and continuity language
  - should not be forced into first-batch implementation without more usage data
- Implementation readiness:
  - `NEEDS_ANALYSIS`

### H. `worker-lifecycle-summary-dto`

- Proposed file name: `runtime/public/worker-lifecycle-summary-dto.ts`
- Candidate type: summary
- Capability addressed: worker lifecycle modeling
- Required exported type concepts:
  - `WorkerLifecycleSummaryDto`
  - `WorkerLifecyclePhaseSummaryDto`
  - `WorkerLifecycleBoundaryProfile`
- Required field families:
  - `worker_lifecycle_summary_id`
  - `contract_version`
  - `runtime_contract_version`
  - `compatibility_profile`
  - `source_runtime_surface_ref`
  - `source_commit_ref`
  - `lifecycle_phase_summary`
  - `transition_summary`
  - `safe_evidence_refs`
  - `omission_markers`
  - `runtime_private_fields_omitted`
  - `boundary_flags`
- Boundary flags:
  - common second-wave boundary flags
  - `no_storage_write`
  - `no_mutation_writeback`
- Forbidden fields:
  - `WorkerLifecycleRuntime`
  - lifecycle runtime classes
  - internal transition methods
  - state mutation
  - product semantics
- Relationship to first-wave DTOs:
  - can mirror the contract discipline of the first-wave readiness and continuity DTOs
  - remains too close to runtime lifecycle internals for immediate design closure
- Implementation readiness:
  - `NEEDS_ANALYSIS`

## Common Metadata Contract

Every implementation-ready second-wave surface should carry the same top-level
metadata family:

- `contract_version`
- `runtime_contract_version`
- `compatibility_profile`
- `source_runtime_surface_ref`
- `source_commit_ref`
- `version_refs`
- `safe_evidence_refs`
- `omission_markers`
- `runtime_private_fields_omitted`
- `boundary_flags`

Where applicable, second-wave surfaces should also include:

- `first_wave_refs`
- `source_surface_kind`
- `evidence_kind`
- `compatibility_note`

The metadata family must remain stable enough for downstream verification but
must not become a vehicle for runtime-private payloads.

## Boundary Flag Requirements

All implementation-ready candidates must support the following boundary flags:

- `projection_safe`
- `evidence_safe`
- `runtime_private_payload_omitted`
- `non_executing`
- `no_provider_dispatch`
- `no_channel_dispatch`
- `no_tool_invocation`
- `no_storage_write`
- `no_mutation_writeback`
- `no_training_authority`
- `no_package_publish`
- `no_certification_or_endorsement`

These flags are not optional labels. They are the expected contract posture for
every second-wave public surface that enters implementation.

## Forbidden Field / Surface Rules

The following fields or surface families are explicitly forbidden:

- runtime/core passthrough
- `WorkerLifecycleRuntime`
- runtime session constructor
- `SQLiteStateStore`
- `sqlite_handle`
- `database_connection`
- `file_system_write`
- `state_store_instance`
- `dispatch_service`
- `handler_service`
- `provider_dispatch`
- `channel_dispatch`
- `tool_invocation`
- `mutation_writeback`
- `training_authority`
- `raw_memory_payload`
- `raw_preference_payload`
- `founder`
- `dashboard`
- `cell`
- `engagement`
- `customer`
- `route`
- `paid_pilot`
- `commercial_readiness`

These are either runtime internals, authority-bearing surfaces, or
product-specific canonical fields that should remain outside CGOS public
surfaces.

## Implementation Readiness Matrix

### Ready first implementation batch

- `state-port-summary-dto`
- `persistence-roundtrip-evidence-dto`
- `memory-preference-summary-dto`
- `learning-correction-evidence-dto`
- `runtime-action-request-summary-dto`
- `runtime-dispatch-boundary-evidence-dto`

### Ready with conditions

- None beyond the batch-wide conditions already stated in this wave.

### Needs analysis

- `runtime-session-summary-dto`
- `worker-lifecycle-summary-dto`

### SoloCrew-owned

- dashboard/cell display model
- product-facing projection fixture
- test-only historical compatibility wrapper
- route/customer/engagement-specific shape

### Rejected

- direct lifecycle/store/dispatcher/service exports
- direct runtime/core passthrough
- product semantic canonicalization inside CGOS
- test-only historical fixtures as CGOS public surfaces

Overall readiness is `READY_WITH_CONDITIONS` because the first batch is ready,
but the wave still depends on keeping the shared boundary conditions intact and
holding the deeper-analysis candidates out of implementation.

## Future Implementation Scope

If implementation is authorized later, the next wave may be limited to the
following files only:

- `runtime/public/state-port-summary-dto.ts`
- `runtime/public/persistence-roundtrip-evidence-dto.ts`
- `runtime/public/memory-preference-summary-dto.ts`
- `runtime/public/learning-correction-evidence-dto.ts`
- `runtime/public/runtime-action-request-summary-dto.ts`
- `runtime/public/runtime-dispatch-boundary-evidence-dto.ts`
- `tests/runtime/second-wave-public-surface-dto-boundary.test.mjs`

That later wave must still not change:

- `package.json`
- package export map
- helper bundle files
- `runtime/core/*`
- `runtime/lifecycle/*`
- `runtime/state/*`
- `runtime/learning/*`
- `runtime/execution/*`
- `schemas/*`
- `registry/*`
- `bindings/*`

The implementation wave remains separate from export readiness and export
implementation waves.

## Required Future Tests

Future implementation must verify:

- type-only DTO boundary
- no internal runtime imports
- required metadata fields
- required boundary flags
- forbidden fields
- no runtime classes, functions, or services
- no store/sqlite adapter exposure
- no dispatch/provider/channel/tool authority
- no product vocabulary
- package exports unchanged
- no schema/registry/binding changes

## Relationship to First-Wave DTOs

The second-wave surfaces extend the first-wave pattern established by:

- `RuntimeReadinessStatusDto`
- `RuntimeProjectionSummaryDto`
- `BoundedExecutionEventDto`
- `ObjectiveContinuityDto`

Those first-wave DTOs define the boundary style: versioned metadata, safe
evidence refs, omission markers, and explicit non-executing semantics. The
second-wave surfaces should reuse that style while becoming more specific about
state-port, roundtrip evidence, memory/preference summaries, learning capture,
action-request posture, and dispatch boundaries.

## Relationship to SoloCrew Bridge Replacement

- No SoloCrew change is made in this task.
- Bridge replacement remains future work.
- Second-wave implementation may improve bridge replacement planning, but it
  does not itself replace the bridge.
- Some dashboard/cell/product-facing usages should remain SoloCrew-owned rather
  than be elevated into CGOS public surfaces.

## Relationship to Package Exports

- No package export change occurs in this task.
- Future implementation creates files only; export readiness and export
  implementation remain separate waves.
- Package publication remains out of scope.

## Relationship to MPLP

- No MPLP schema/spec/core-law change occurs in this task.
- These are implementation-layer DTO/evidence surfaces only.
- Any MPLP mapping remains separate, future, and non-normative.

## Risk Register

- Over-exporting internals
- Under-specifying evidence
- Making evidence look like authority
- Leaking product semantics
- Confusing DTO files with package exports
- False bridge replacement readiness
- Dependency strategy hiding bridge debt

## Decision Options

Selected:

`CGOS_SECOND_WAVE_PUBLIC_SURFACE_FIELD_DESIGN_READY_WITH_CONDITIONS`

Not selected:

- `CGOS_SECOND_WAVE_PUBLIC_SURFACE_FIELD_DESIGN_READY_FOR_IMPLEMENTATION`
- `CGOS_SECOND_WAVE_PUBLIC_SURFACE_FIELD_DESIGN_PARTIAL_NEEDS_ANALYSIS`
- `CGOS_SECOND_WAVE_PUBLIC_SURFACE_FIELD_DESIGN_BLOCKED`

## Next Allowed Task

`CGOS-SECOND-WAVE-PUBLIC-SURFACE-DTO-IMPLEMENTATION-WAVE-01`

Owner may also pause development.
