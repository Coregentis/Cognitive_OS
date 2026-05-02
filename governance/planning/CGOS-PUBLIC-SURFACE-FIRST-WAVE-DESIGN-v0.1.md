# CGOS-PUBLIC-SURFACE-FIRST-WAVE-DESIGN-v0.1

## Document Control

- doc_id: CGOS-PUBLIC-SURFACE-FIRST-WAVE-DESIGN-v0.1
- task_id: CGOS-PUBLIC-SURFACE-FIRST-WAVE-DESIGN-01
- status: field-level design only
- date: 2026-05-02
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: df8275ddf9acf0017fe6f8d141d49f6750516952
- solocrew_usage_map_ref: ffb81c3c03c5411072d61b38e7f3b0ddd63dd7e7
- mplp_no_change_ref: 2b89ee839fbf54c1fb282bca93ae1fc080aa1772
- no_export_change: true
- no_package_change: true
- no_runtime_change: true
- no_schema_registry_binding_change: true
- no_solocrew_modification: true
- no_mplp_modification: true

## Executive Summary

This first wave is DTO/type-first design only. It creates no
`runtime/public` implementation file, no package export, no helper bundle, no
schema, no registry entry, no binding entry, and no downstream modification.

The design prepares, but does not authorize, a future implementation readiness
audit for four public DTO surfaces:

- runtime readiness / action-status DTO;
- runtime projection DTO / summary;
- bounded execution event DTO;
- objective continuity DTO.

State snapshot / state-port summary, learning correction evidence, runtime
projection handoff bundle helpers, service constructors, store/sqlite adapters,
and dispatcher/handler implementations remain deferred.

Selected decision:

`CGOS_PUBLIC_SURFACE_FIRST_WAVE_DESIGN_PASS_READY_FOR_IMPLEMENTATION_READINESS`

## Public Surface Design Principles

- Use neutral naming that can apply across downstream products.
- Keep every shape projection-safe or evidence-safe.
- Make runtime-private omission an explicit field family.
- Use `non_executing` semantics wherever an event, action, recommendation, or
  continuity posture could be mistaken for execution authority.
- Expose no provider or channel dispatch authority.
- Carry versioned contract metadata on every top-level DTO.
- Keep interpretation deterministic and textually bounded.
- Encode no SoloCrew product semantics in DTO names or canonical field names.
- Make no MPLP schema, spec, core-law, or normative claim.

## First-Wave Surface Overview

| Surface | Proposed module name | Tentative path | Status | Purpose | Bridge capability helped | Explicitly does not expose | Priority | Future implementation eligibility |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Runtime readiness / action-status DTO | `runtime-readiness-status-dto` | `runtime/public/runtime-readiness-status-dto.ts` | DESIGN_ONLY | Describe bounded readiness, action, artifact, learning, and continuation posture. | Runtime action/status projection and readiness helper usage. | No dispatcher, handler, provider, channel, execution permission, or runtime/core passthrough. | P1 | Eligible for implementation readiness after field/design gates pass. |
| Runtime projection DTO / summary | `runtime-projection-summary-dto` | `runtime/public/runtime-projection-summary-dto.ts` | DESIGN_ONLY | Describe neutral runtime projection summaries and operational-unit summaries without private payloads. | `RuntimeStateProjection` and `OperationalUnitRuntimeProjection` bridge usage. | No direct `RuntimeStateProjection` passthrough, no direct `OperationalUnitRuntimeProjection` passthrough, no runtime/core export. | P1 | Eligible with adapter-parity test planning and forbidden-field gates. |
| Bounded execution event DTO | `runtime-execution-event-dto` | `runtime/public/runtime-execution-event-dto.ts` | DESIGN_ONLY | Describe non-executing request, outcome, and event evidence. | Execution request envelope, outcome, and event contract bridge usage. | No dispatch service, handler implementation, tool invocation authority, provider dispatch, or channel dispatch. | P1 | Eligible with strict non-execution and dispatch-exclusion gates. |
| Objective continuity DTO | `runtime-objective-continuity-dto` | `runtime/public/runtime-objective-continuity-dto.ts` | DESIGN_ONLY | Describe small objective comparison and continuity posture summaries. | Objective anchor comparison bridge usage. | No `InMemoryObjectiveAnchor`, storage strategy, mutation, or writeback path. | P2 | Eligible only if implementation remains small, type-only, and boundary-safe. |

## Field-Level DTO Design

### A. Runtime Readiness / Action-Status DTO

Proposed type concepts:

- `RuntimeReadinessStatusDto`
- `RuntimeActionStatusDto`
- `RuntimeReadinessBoundaryProfile`

Proposed status/value families:

- `RuntimeReadinessStatusValueDto`
- `RuntimeActionClassDto`
- `RuntimeArtifactClassDto`
- `RuntimeLearningStatusDto`
- `RuntimeContinuationPostureDto`

Required field families:

- `readiness_status_id`
- `contract_version`
- `runtime_contract_version`
- `compatibility_profile`
- `source_runtime_surface_ref`
- `source_commit_ref`
- `action_class`
- `readiness_status`
- `artifact_class`
- `learning_status`
- `continuation_posture`
- `interpretation`
- `version_refs`
- `omission_markers`
- `runtime_private_fields_omitted`
- `boundary_flags`

Boundary semantics:

- This DTO is not execution authority.
- This DTO is not dispatch permission.
- This DTO does not authorize provider or channel execution.
- `interpretation` must state that readiness is review/projection posture only.

### B. Runtime Projection DTO / Summary

Proposed type concepts:

- `RuntimeProjectionSummaryDto`
- `RuntimeOperationalUnitSummaryDto`
- `RuntimeStatePostureSummaryDto`
- `RuntimeProjectionBoundaryProfile`

Proposed supporting type concepts:

- `RuntimeProjectionSummaryRefDto`
- `RuntimeProjectionSourceRefDto`
- `RuntimeProjectionOmissionMarkerDto`

Required field families:

- `projection_summary_id`
- `contract_version`
- `runtime_contract_version`
- `compatibility_profile`
- `source_runtime_surface_ref`
- `source_commit_ref`
- `project_scope_ref`
- `operational_unit_summaries`
- `state_posture_summary`
- `readiness_summary_refs`
- `artifact_summary_refs`
- `learning_summary_refs`
- `continuity_summary_refs`
- `safe_evidence_refs`
- `version_refs`
- `omission_markers`
- `runtime_private_fields_omitted`
- `boundary_flags`

Boundary semantics:

- This DTO is not an `OperationalUnitRuntimeProjection` passthrough.
- This DTO is not a `RuntimeStateProjection` passthrough.
- This DTO does not export `runtime/core`.
- Operational unit summaries must use neutral refs and summaries, not product
  labels.

### C. Bounded Execution Event DTO

Proposed type concepts:

- `BoundedExecutionEventDto`
- `BoundedExecutionRequestEnvelopeDto`
- `BoundedExecutionOutcomeDto`
- `BoundedExecutionBoundaryProfile`

Proposed status/value families:

- `BoundedExecutionEventStatusDto`
- `BoundedExecutionOutcomeStatusDto`
- `BoundedExecutionBlockReasonDto`

Required field families:

- `execution_event_id`
- `request_envelope_id`
- `dispatch_outcome_id`
- `event_contract_id`
- `contract_version`
- `runtime_contract_version`
- `compatibility_profile`
- `source_runtime_surface_ref`
- `source_commit_ref`
- `event_status`
- `requested_action_summary`
- `outcome_summary`
- `blocked_or_deferred_reason`
- `safe_evidence_refs`
- `non_executing`
- `no_provider_dispatch`
- `no_channel_dispatch`
- `version_refs`
- `omission_markers`
- `runtime_private_fields_omitted`
- `boundary_flags`

Boundary semantics:

- This DTO is event evidence only.
- This DTO authorizes no provider dispatch.
- This DTO authorizes no channel dispatch.
- This DTO grants no tool invocation authority.
- `outcome_summary` must remain descriptive and non-authoritative.

### D. Objective Continuity DTO

Proposed type concepts:

- `ObjectiveContinuityDto`
- `ObjectiveComparisonSummaryDto`
- `ObjectiveContinuityBoundaryProfile`

Proposed status/value families:

- `ObjectiveComparisonStatusDto`
- `ObjectiveContinuityRecommendationPostureDto`

Required field families:

- `objective_continuity_id`
- `objective_ref`
- `comparison_status`
- `previous_objective_summary_ref`
- `current_objective_summary_ref`
- `continuity_recommendation_posture`
- `continuity_rationale_summary`
- `safe_evidence_refs`
- `contract_version`
- `runtime_contract_version`
- `compatibility_profile`
- `source_runtime_surface_ref`
- `source_commit_ref`
- `version_refs`
- `omission_markers`
- `runtime_private_fields_omitted`
- `boundary_flags`

Boundary semantics:

- This DTO is not an `InMemoryObjectiveAnchor` export.
- This DTO exposes no storage strategy.
- This DTO is not a mutation or writeback path.
- Continuity recommendation posture must stay advisory and non-executing.

## Forbidden Field / Forbidden Surface Rules

The first-wave DTOs must not include these fields or surfaces:

- `runtime/core` passthrough.
- Lifecycle class export.
- Store/sqlite adapter export.
- Dispatcher/handler export.
- Mutation/writeback service export.
- `provider_dispatch`.
- `channel_dispatch`.
- `tool_invocation`.
- `raw_runtime_private_payload`.
- `sqlite_handle`.
- `database_connection`.
- `file_system_write`.
- `founder`.
- `dashboard`.
- `cell`.
- `engagement`.
- `customer`.
- `route`.
- `paid_pilot`.
- `commercial_readiness`.
- MPLP conformance, certification, or endorsement claims.

## Cross-Surface Common Metadata

Every first-wave top-level DTO should use this shared metadata pattern:

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

`boundary_flags` should be explicit enough to carry:

- `projection_safe`
- `runtime_private_payload_omitted`
- `non_executing` where applicable
- `no_provider_dispatch` where applicable
- `no_channel_dispatch` where applicable
- `no_tool_invocation` where applicable
- `no_package_publish`
- `no_certification_or_endorsement`

## Test Design Requirements For Future Implementation

A future implementation wave must add tests for:

- Type-only imports for each DTO file.
- Forbidden field grep coverage.
- No runtime-private payload exposure.
- Non-executing, provider-dispatch exclusion, and channel-dispatch exclusion.
- Neutral naming and no downstream product vocabulary.
- Package export map unchanged during DTO implementation.
- DTO shape validation for required metadata and boundary flags.
- Runtime/public source remains type-only unless separately authorized.
- Downstream parity planning hooks against the SoloCrew bridge usage map, with
  no SoloCrew import change in the Cognitive_OS implementation wave.

## Package / Export Boundary

A future implementation may create `runtime/public` DTO files only after
separate authorization. Creating files does not add package exports.

Package export map changes require a separate package export governance chain.
Package publication remains out of scope.

## Relationship To SoloCrew Bridge Replacement

This design enables future bridge replacement planning, but it does not replace
the SoloCrew bridge. SoloCrew remains unchanged.

Not all bridge usages will be replaced by Cognitive_OS public surfaces. Some
bridge usages may remain SoloCrew-owned, fixture-only, or explicitly
quarantined in a later downstream task.

## Relationship To MPLP

No MPLP schema, spec, or core-law change is made or required.

These are Cognitive_OS implementation-layer DTO designs. Any MPLP candidate or
backlog mapping must be separate, non-normative, and owner-authorized.

## Implementation Readiness Gates

Before implementation can proceed:

- This design is accepted.
- No product semantic leakage is present.
- Forbidden fields are absent.
- Runtime-private passthrough is absent.
- No package export change is included.
- First-wave file list is approved.
- Tests are planned.
- Downstream replacement is not claimed.
- Package publication remains out of scope.
- SoloCrew and MPLP remain unchanged.

## Decision Options

Selected decision:

`CGOS_PUBLIC_SURFACE_FIRST_WAVE_DESIGN_PASS_READY_FOR_IMPLEMENTATION_READINESS`

Rationale:

- The four first-wave surfaces have exact proposed module names, type concepts,
  field families, boundary semantics, forbidden fields, and future test gates.
- The objective continuity DTO remains small, type-only, and boundary-safe in
  this design.
- Deferred state, learning, helper bundle, service, store, and dispatcher
  surfaces stay outside the first wave.

Rejected options:

- `CGOS_PUBLIC_SURFACE_FIRST_WAVE_DESIGN_PASS_WITH_FIELD_CONDITIONS`: rejected
  because this document defines the necessary field families for the first-wave
  implementation readiness audit.
- `CGOS_PUBLIC_SURFACE_FIRST_WAVE_DESIGN_NEEDS_REVISION`: rejected because no
  unresolved field-design blocker remains for the first-wave DTO set.
- `CGOS_PUBLIC_SURFACE_FIRST_WAVE_DESIGN_BLOCKED`: rejected because the design
  stays type-only and avoids forbidden implementation/export boundaries.

## Next Allowed Task

`CGOS-PUBLIC-SURFACE-FIRST-WAVE-IMPLEMENTATION-READINESS-01`

Owner may also pause development. This design does not recommend direct
implementation.
