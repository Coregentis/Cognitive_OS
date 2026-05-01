# CGOS-PUBLIC-SURFACE-CANDIDATE-PLAN-v0.1

## Document Control

- doc_id: CGOS-PUBLIC-SURFACE-CANDIDATE-PLAN-v0.1
- task_id: CGOS-PUBLIC-SURFACE-CANDIDATE-PLAN-01
- status: candidate planning only
- date: 2026-05-02
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: 3a72cf15c5718a89d00c802a06bffc479aad3aea
- solocrew_usage_map_ref: ffb81c3c03c5411072d61b38e7f3b0ddd63dd7e7
- mplp_no_change_ref: 2b89ee839fbf54c1fb282bca93ae1fc080aa1772
- no_export_change: true
- no_package_change: true
- no_runtime_change: true
- no_schema_registry_binding_change: true
- no_solocrew_modification: true
- no_mplp_modification: true

## Executive Summary

This is candidate planning only. It does not implement a public surface, change
the package export map, publish a package, modify runtime source, add schema /
registry / binding entries, or modify SoloCrew or MPLP.

The current Cognitive_OS public package exports are intentionally narrow:

- `cognitive_os/runtime/public/operator-review-loop-dto`
- `cognitive_os/runtime/public/operator-review-loop-handoff-bundle`

Those exports remain valid, but they are insufficient for replacing the
SoloCrew legacy bridge at `runtime-imports/cognitive-runtime.ts`. The bridge
currently consumes lifecycle, state, runtime-core type, learning, and execution
internals that are not approved package surfaces.

Not all bridge internals should become public Cognitive_OS surfaces. Future
candidate surfaces must be neutral, projection-safe or evidence-safe, versioned,
deterministic where applicable, and free of runtime-private internals or
SoloCrew product semantics.

Selected decision:

`CGOS_PUBLIC_SURFACE_CANDIDATE_PLAN_PASS_CANDIDATES_IDENTIFIED`

## Candidate Evaluation Criteria

A legacy bridge capability may become a future Cognitive_OS public surface
candidate only if it satisfies these criteria:

- The surface is neutral across downstream products.
- The surface is projection-safe or evidence-safe.
- The surface does not expose runtime/core/private internals.
- The surface can carry explicit version metadata.
- The surface can be deterministic where helper behavior is included.
- The surface does not encode SoloCrew product semantics.
- The surface can support replacement of relative bridge usage.
- The surface does not mutate MPLP semantics or protocol law.
- The surface can be tested independently from downstream product code.
- The surface preserves omission markers for runtime-private fields where
  applicable.

## Capability Group Assessment

| Capability group | Bridge symbols involved | Candidate? | Candidate surface type | Rationale | Risks | Likely owner | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Runtime session creation | `WorkerLifecycleRuntime`, `InMemoryStateStore`, `SQLiteStateStore`, `WorkerStore`, `ObjectiveStore`, `MemoryStore`, `PreferenceStore`, `PreferenceWritebackService`, `ActionDispatcher`, `StateStorePort` | Partial | state/session summary DTO or port summary, not service constructors | SoloCrew needs a replaceable session-facing summary, but direct runtime construction is private. | Over-exporting service behavior or store lifecycle. | both | P2 |
| Worker lifecycle modeling | `WorkerLifecycleRuntime`, `WorkerStore` | Partial | lifecycle projection summary DTO | Lifecycle state may be useful as neutral posture, but the runtime class must remain internal. | Exposing lifecycle engine behavior instead of summary state. | CGOS | P2 |
| State persistence / sqlite roundtrip | `InMemoryStateStore`, `SQLiteStateStore`, `StateStorePort`, `AgentWorkerRecord`, `ObjectiveRecord`, `MemoryProfileRecord`, `PreferenceProfileRecord`, `ExecutionRequestEnvelope` | Partial | state snapshot / state-port summary DTO | Downstream replacement may need bounded state snapshots and roundtrip evidence, not store adapters. | Store layout and sqlite implementation leakage. | both | P2 |
| Runtime projection shaping | `OperationalUnitRuntimeProjection`, `RuntimeStateProjection`, runtime action/status/artifact/learning types | Yes | runtime projection DTO / summary surface | This is the strongest neutral candidate because downstream adapters primarily need projection-safe shape. | Under-specifying projection fields needed for adapter parity. | CGOS | P1 |
| Memory/preference projection | `CorrectionCaptureRecord`, `PreferenceWritebackResult` | Yes | learning evidence DTO / projection summary | Correction and preference results can be represented as evidence-safe records without exposing learning services. | Accidentally making downstream preference behavior canonical. | CGOS | P2 |
| Objective continuity | `ObjectiveAnchorComparison`, `InMemoryObjectiveAnchor` | Yes | objective continuity DTO | Continuity comparison can be public as a neutral result shape; the in-memory anchor stays private. | Coupling consumers to internal anchoring strategy. | CGOS | P2 |
| Learning/correction capture | `InMemoryCorrectionCapture`, `CorrectionCaptureInput`, `CorrectionCaptureRecord`, `PreferenceWritebackService`, `PreferenceWritebackResult` | Partial | correction evidence DTO and helper candidate | Evidence records are candidates; in-memory capture and writeback services are not. | Exporting learning mutation behavior or policy internals. | both | P2 |
| Action dispatch / execution event modeling | `ActionDispatcher`, `ActionDispatchHandler`, `ActionDispatchOutcome`, `ExecutionRequestEnvelope`, `ExecutionEventContract` | Partial | bounded execution event DTO / evidence envelope | Non-executing action/event evidence can be public; dispatcher and handlers stay private. | Consumers may confuse event evidence with execution authority. | CGOS | P2 |
| Founder dashboard projection | `RuntimeStateProjection`, `OperationalUnitRuntimeProjection`, runtime action/status/artifact/learning types | No as named | not candidate; covered only by neutral projection DTO candidates | The dashboard label is SoloCrew product-specific even if its inputs reveal neutral projection needs. | Product semantics leaking into Cognitive_OS. | SoloCrew | P3 |
| Cell operations projection | `OperationalUnitRuntimeProjection`, `RuntimeStateProjection`, runtime action/status/artifact/learning/continuation types | No as named | not candidate; covered only by neutral projection DTO candidates | The cell-operations label is downstream product vocabulary, not a Cognitive_OS public surface name. | Making product projection terms canonical upstream. | SoloCrew | P3 |
| Test-only historical compatibility | `ExecutionRequestEnvelope`, runtime projection types, runtime action/status types | No | not candidate | Test-only compatibility should be quarantined or converted to downstream fixtures, not promoted upstream. | Freezing historical test shapes as public API. | SoloCrew | P3 |

## Candidate Surface Set

These are candidate surfaces only. They are not implemented, not exported, and
not package-published by this plan.

| Candidate | Proposed module name | Tentative path | Conceptual inputs / outputs | Non-exported internals replaced | Export eligibility | Implementation preconditions |
| --- | --- | --- | --- | --- | --- | --- |
| Runtime projection DTO / summary surface | `runtime-projection-summary-dto` | `runtime/public/runtime-projection-summary-dto.ts` | Versioned runtime state and operational-unit summaries with omission markers and source refs. | `RuntimeStateProjection`, `OperationalUnitRuntimeProjection`, projection type aliases from `runtime/core/projection-types.ts`. | candidate only | Field-level neutrality review, parity check against downstream usage map, forbidden-private-field tests, typecheck. |
| Runtime readiness / action-status DTO surface | `runtime-readiness-status-dto` | `runtime/public/runtime-readiness-status-dto.ts` | Action class, readiness status, artifact class, learning status, and continuation posture as bounded DTO values. | `RuntimeActionClass`, `RuntimeActionReadinessStatus`, projection status aliases. | candidate only | Confirm names remain neutral, add version metadata, prove no execution authority is implied. |
| State snapshot / state-port summary surface | `runtime-state-snapshot-dto` | `runtime/public/runtime-state-snapshot-dto.ts` | Bounded state snapshot records and persistence-posture summaries without store constructors or sqlite details. | `StateStorePort`, state records, store-specific persistence details. | candidate only | Define store-agnostic shape, exclude sqlite adapter APIs, add deterministic serialization tests. |
| Learning correction evidence DTO surface | `runtime-learning-evidence-dto` | `runtime/public/runtime-learning-evidence-dto.ts` | Correction capture records and preference writeback evidence as immutable projection-safe evidence. | `CorrectionCaptureInput`, `CorrectionCaptureRecord`, `PreferenceWritebackResult`. | candidate only | Separate evidence from mutation services, preserve runtime-private omissions, define downstream-neutral language. |
| Objective continuity DTO surface | `runtime-objective-continuity-dto` | `runtime/public/runtime-objective-continuity-dto.ts` | Objective anchor comparison summaries and continuity posture refs. | `ObjectiveAnchorComparison`, in-memory objective anchor output shapes. | candidate only | Confirm comparison semantics are generic, avoid exposing anchor storage strategy. |
| Bounded execution event DTO surface | `runtime-execution-event-dto` | `runtime/public/runtime-execution-event-dto.ts` | Non-executing request envelopes, dispatch outcomes, and execution-event evidence summaries. | `ExecutionRequestEnvelope`, `ActionDispatchOutcome`, `ExecutionEventContract`. | candidate only | Add strict non-executing flags, reject provider/channel dispatch implication, prove event evidence only. |
| Optional helper bundle for neutral runtime projection | `runtime-projection-handoff-bundle` | `runtime/public/runtime-projection-handoff-bundle.ts` | Deterministic create/validate/summarize helper for selected DTOs after readiness. | Multiple internal projection, state, learning, and execution records. | candidate only | Only after DTO surfaces are approved; helper must stay controlled and deterministic like the operator review loop bundle. |

## Non-Candidate Surfaces

The following are explicitly not candidates for direct public export:

- Direct export of `runtime/core` internals.
- Direct export of `runtime/lifecycle` runtime classes.
- Direct export of `runtime/state` stores or sqlite adapters, including
  `SQLiteStateStore`, `InMemoryStateStore`, `WorkerStore`, `ObjectiveStore`,
  `MemoryStore`, and `PreferenceStore`.
- Direct export of `WorkerLifecycleRuntime` if it exposes runtime internals.
- Direct export of learning mutation services such as `InMemoryCorrectionCapture`
  or `PreferenceWritebackService`.
- Direct export of execution services such as `ActionDispatcher` or dispatch
  handlers.
- Product-specific dashboard, cell, founder, engagement, route, or commercial
  semantics from downstream repositories.
- SoloCrew fixture-only historical compatibility surfaces.
- Any surface implying package publication or MPLP conformance.

## Relationship to Existing CGOS Public Exports

The current operator review loop DTO and handoff bundle exports remain valid and
narrow. This plan does not widen them, replace them, or add sibling exports.

Any new candidate requires a separate governance, readiness, implementation, and
verification chain before it can be added to `package.json`. Candidate planning
does not create a package contract.

## Relationship to SoloCrew

No SoloCrew change is made in this task.

SoloCrew bridge replacement cannot proceed safely until candidate surfaces are
selected, rejected, or assigned back to SoloCrew ownership. Some bridge
capabilities may remain better owned by SoloCrew as fixtures, product
projection models, or quarantine-only compatibility records.

SoloCrew product semantics must not become canonical Cognitive_OS public
surface vocabulary.

## Relationship to MPLP

No MPLP schema, spec, or core-law change is made or required.

These candidates are Cognitive_OS implementation-layer public surface
candidates. Any MPLP candidate or backlog mapping must remain separate,
non-normative, and owner-authorized.

No MPLP conformance, certification, or endorsement claim is created by this
plan.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Over-exporting runtime internals | High | Reject direct `runtime/core`, store, lifecycle, learning service, and dispatcher exports. |
| Under-exporting needed neutral surfaces | Medium | Use the SoloCrew usage map to drive readiness audit field coverage. |
| Product semantics leaking into CGOS | High | Keep dashboard, cell, founder, and downstream product labels out of candidate module names. |
| Bridge replacement blocked by under-specified DTOs | Medium | Require downstream parity review before implementation. |
| Package publication confusion | Medium | Keep package action out of candidate planning and future readiness by default. |
| TypeScript source export tooling risk | Medium | Verify package subpath behavior in any future implementation chain. |
| Future schema / registry drift | Medium | Keep schema, registry, and binding changes out of scope unless separately authorized. |
| Event evidence mistaken for execution authority | High | Require `non_executing` flags and provider/channel dispatch exclusions on execution-event candidates. |

## Decision Options

Selected decision:

`CGOS_PUBLIC_SURFACE_CANDIDATE_PLAN_PASS_CANDIDATES_IDENTIFIED`

Rationale:

- The usage map identifies real bridge capabilities that current exports do not
  cover.
- Several capabilities can be converted into neutral DTO, evidence envelope, or
  projection summary candidates.
- Direct runtime service, store, dispatcher, lifecycle, fixture-only, and
  product-specific surfaces remain non-candidates.

Rejected options:

- `CGOS_PUBLIC_SURFACE_CANDIDATE_PLAN_PASS_WITH_SOLOCREW_OWNED_FIXTURE_BIAS`:
  rejected because multiple active app/projection-facing capabilities appear
  neutral enough to evaluate as CGOS candidates before assigning all ownership
  downstream.
- `CGOS_PUBLIC_SURFACE_CANDIDATE_PLAN_BLOCKED_NEEDS_MORE_USAGE_DATA`: rejected
  because the SoloCrew usage map is sufficient for candidate planning.
- `CGOS_PUBLIC_SURFACE_CANDIDATE_PLAN_REJECT_PUBLIC_SURFACE_EXPANSION`: rejected
  because neutral projection-safe candidates can be evaluated without exposing
  runtime-private internals.

## Next Allowed Task

`CGOS-PUBLIC-SURFACE-READINESS-AUDIT-01`

Alternative:

`SOLOCREW-LEGACY-CGOS-RELATIVE-BRIDGE-REPLACEMENT-PLAN-01`

Owner may also pause development. This plan does not recommend direct
implementation.
