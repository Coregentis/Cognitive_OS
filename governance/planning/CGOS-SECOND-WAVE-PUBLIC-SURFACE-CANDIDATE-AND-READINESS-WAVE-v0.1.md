# CGOS-SECOND-WAVE-PUBLIC-SURFACE-CANDIDATE-AND-READINESS-WAVE-v0.1

## Document Control

- doc_id: CGOS-SECOND-WAVE-PUBLIC-SURFACE-CANDIDATE-AND-READINESS-WAVE-v0.1
- task_id: CGOS-SECOND-WAVE-PUBLIC-SURFACE-CANDIDATE-AND-READINESS-WAVE-01
- status: candidate planning and readiness prefilter only
- date: 2026-05-03
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: 709536d82d482939b992e083e473b91e955d0fa2
- solocrew_bridge_readiness_ref: b4ceae647b6bb43c8ec5e8d20c4f7368f4403165
- mplp_no_change_ref: 2b89ee839fbf54c1fb282bca93ae1fc080aa1772
- no_export_change: true
- no_package_change: true
- no_runtime_change: true
- no_schema_registry_binding_change: true
- no_solocrew_modification: true
- no_mplp_modification: true

## Executive Summary

First-wave DTOs are insufficient for bridge replacement. Second-wave candidates
are needed. Not all bridge gaps belong in CGOS. No implementation is
authorized.

The first-wave readiness wave and SoloCrew bridge coverage map together show
that package-backed, type-only evidence surfaces are useful, but they do not
cover the full runtime session, lifecycle, store, learning, and dispatch
capability set. The highest-ROI boundary now is to separate neutral CGOS public
surfaces from SoloCrew-owned projections and from outright rejected internal
exposures.

## Bridge Gap Input Summary

SoloCrew uncovered or partially covered capability groups:

- runtime session creation
- worker lifecycle modeling
- state persistence / sqlite roundtrip
- projection shaping
- memory/preference behavior
- objective continuity
- action/event modeling
- learning/correction capture
- dashboard/cell projections
- test-only historical compatibility

These groups are the candidate input set for second-wave planning. They do not
imply that all should be moved to CGOS.

## Candidate Evaluation Criteria

Candidate surfaces must be:

- neutral across products
- projection-safe or evidence-safe
- free of runtime-private payloads
- free of direct runtime/core exposure
- free of direct store/sqlite adapter exposure
- free of dispatcher/provider/channel/tool authority
- deterministic in summary or evidence shape
- versioned in metadata
- useful for bridge debt reduction without promoting SoloCrew product semantics
- implementation-testable without package publication

## Second-Wave Candidate Matrix

| Capability group | CGOS candidate? | SoloCrew-owned? | reject? | Proposed candidate surface | Candidate type | Risk level | Readiness |
| --- | --- | --- | --- | --- | --- | --- | --- |
| runtime session creation | partial | partial | no | `runtime-session-summary-dto` | DTO / summary | high | NEEDS_ANALYSIS |
| worker lifecycle modeling | partial | partial | no | `worker-lifecycle-summary-dto` | DTO / summary | high | NEEDS_ANALYSIS |
| state persistence / sqlite roundtrip | yes | partial | no | `state-port-summary-dto`, `persistence-roundtrip-evidence-dto` | port descriptor / evidence envelope | high | READY_FOR_FIELD_DESIGN |
| projection shaping | partial | yes | no | `runtime-projection-summary-dto` already exists; second-wave may add narrower display summaries only if needed | summary | medium | SOLOCREW_OWNED |
| memory/preference behavior | yes | partial | no | `memory-preference-summary-dto` | summary | medium | READY_FOR_FIELD_DESIGN |
| objective continuity | partial | yes | no | `objective-continuity-dto` already exists; second-wave may add a smaller continuity evidence companion only if needed | summary / evidence | medium | SOLOCREW_OWNED |
| action/event modeling | yes | partial | no | `runtime-action-request-summary-dto`, `runtime-dispatch-boundary-evidence-dto` | DTO / evidence envelope | medium | READY_FOR_FIELD_DESIGN |
| learning/correction capture | yes | partial | no | `learning-correction-evidence-dto` | evidence envelope | high | READY_FOR_FIELD_DESIGN |
| dashboard/cell projections | no | yes | yes | none | not candidate | medium | SOLOCREW_OWNED |
| test-only historical compatibility | no | yes | yes | none | not candidate | low | SOLOCREW_OWNED |

## Recommended Candidate Surface Set

### 1. `runtime-session-summary-dto`

- Purpose: summarize a session boundary for planning, without recreating the
  lifecycle machinery.
- Bridge capability addressed: runtime session creation.
- Must not expose: runtime session constructors, lifecycle classes, store
  adapters, or execution authority.
- Field families needed: contract metadata, source refs, session posture,
  summary refs, omission markers, boundary flags.
- Readiness classification: NEEDS_ANALYSIS.
- Depends on first-wave DTOs: yes, by analogy and boundary pattern.

### 2. `worker-lifecycle-summary-dto`

- Purpose: summarize lifecycle posture and lifecycle transitions in neutral
  terms.
- Bridge capability addressed: worker lifecycle modeling.
- Must not expose: `WorkerLifecycleRuntime`, direct lifecycle methods, or
  lifecycle state mutation.
- Field families needed: contract metadata, lifecycle phase summary, event
  refs, omission markers, boundary flags.
- Readiness classification: NEEDS_ANALYSIS.
- Depends on first-wave DTOs: yes, boundary style only.

### 3. `state-port-summary-dto`

- Purpose: describe state-port capability and state persistence posture without
  exposing adapters.
- Bridge capability addressed: state persistence / sqlite roundtrip.
- Must not expose: `SQLiteStateStore`, `InMemoryStateStore`, `StateStorePort`
  passthroughs, or database handles.
- Field families needed: contract metadata, state-port posture, supported
  persistence modes, summary refs, omission markers, boundary flags.
- Readiness classification: READY_FOR_FIELD_DESIGN.
- Depends on first-wave DTOs: no direct dependency, but should mirror
  first-wave metadata discipline.

### 4. `persistence-roundtrip-evidence-dto`

- Purpose: capture deterministic evidence that a bounded state roundtrip
  occurred or was intentionally deferred.
- Bridge capability addressed: state persistence / sqlite roundtrip.
- Must not expose: database handles, filesystem writes, raw store records.
- Field families needed: contract metadata, roundtrip outcome, evidence refs,
  roundtrip path posture, omission markers, boundary flags.
- Readiness classification: READY_FOR_FIELD_DESIGN.
- Depends on first-wave DTOs: yes, for evidence and non-executing boundary
  style.

### 5. `memory-preference-summary-dto`

- Purpose: summarize memory/preference behavior in neutral planning language.
- Bridge capability addressed: memory/preference behavior.
- Must not expose: preference writeback services, raw correction records, or
  product-facing semantics.
- Field families needed: contract metadata, preference posture, summary refs,
  evidence refs, omission markers, boundary flags.
- Readiness classification: READY_FOR_FIELD_DESIGN.
- Depends on first-wave DTOs: yes, through metadata and evidence pattern.

### 6. `learning-correction-evidence-dto`

- Purpose: provide evidence of correction or learning capture without
  exposing internal learning services.
- Bridge capability addressed: learning/correction capture.
- Must not expose: `InMemoryCorrectionCapture`, `PreferenceWritebackService`,
  writeback authority, or internal learning records.
- Field families needed: contract metadata, evidence refs, capture posture,
  omission markers, boundary flags.
- Readiness classification: READY_FOR_FIELD_DESIGN.
- Depends on first-wave DTOs: yes, for evidence and non-executing semantics.

### 7. `runtime-action-request-summary-dto`

- Purpose: summarize action request posture and bounded action intent.
- Bridge capability addressed: action/event modeling.
- Must not expose: dispatcher services, handler services, tool invocation,
  provider dispatch, or channel dispatch.
- Field families needed: contract metadata, request posture, action summary,
  evidence refs, omission markers, boundary flags.
- Readiness classification: READY_FOR_FIELD_DESIGN.
- Depends on first-wave DTOs: yes, especially readiness and execution-event
  semantics.

### 8. `runtime-dispatch-boundary-evidence-dto`

- Purpose: evidence that dispatch authority is absent or intentionally bounded.
- Bridge capability addressed: action/event modeling.
- Must not expose: dispatcher, provider, channel, or tool authority.
- Field families needed: contract metadata, dispatch denial posture, evidence
  refs, omission markers, boundary flags.
- Readiness classification: READY_FOR_FIELD_DESIGN.
- Depends on first-wave DTOs: yes, via execution-event boundary patterns.

## Explicit Non-Candidates / Rejections

Reject the following:

- direct `WorkerLifecycleRuntime` export
- direct `SQLiteStateStore` export
- direct `runtime/core` type passthrough
- direct dispatch service export
- mutation/writeback service export
- provider/channel/tool authority
- product-specific dashboard/cell/founder semantics as CGOS canonical fields
- test-only historical fixtures as CGOS public surfaces

These forms either expose runtime internals directly or collapse SoloCrew-owned
display semantics into CGOS canonical fields.

## SoloCrew-Owned Surface Candidates

Likely SoloCrew-owned:

- dashboard/cell display model
- product-facing projection fixture
- test-only historical compatibility wrapper
- any route/customer/engagement-specific shape

These are better treated as SoloCrew projection or fixture concerns unless a
neutral CGOS surface is explicitly required for bridge debt reduction.

## First-Cut Readiness Recommendation

### First second-wave design candidates

- `state-port-summary-dto`
- `persistence-roundtrip-evidence-dto`
- `memory-preference-summary-dto`
- `learning-correction-evidence-dto`
- `runtime-action-request-summary-dto`
- `runtime-dispatch-boundary-evidence-dto`

### Needs more analysis

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
- test-only historical fixtures as public CGOS surfaces

## Relationship to First-Wave DTOs

Second-wave surfaces build on first-wave readiness/status, runtime projection
summary, bounded execution event, and objective continuity by extending the
same versioned, neutral, type-first boundary style into the capability gaps the
SoloCrew bridge still depends on.

## Relationship to Package Exports

- no package export change in this task
- second-wave candidates must go through design, readiness, implementation,
  verification, export readiness, and export implementation if approved
- package publication remains out of scope

## Relationship to SoloCrew

- no SoloCrew change in this task
- bridge replacement remains blocked until second-wave surface strategy is
  settled
- some bridge debt may be retired or quarantined in SoloCrew rather than
  elevated to CGOS

## Relationship to MPLP

- no MPLP schema/spec/core-law change
- implementation-layer candidate surfaces only
- any MPLP mapping is future, non-normative, and owner-authorized

## Risk Register

- over-exporting internals
- under-specifying neutral surfaces
- SoloCrew product semantic leakage
- false bridge replacement readiness
- dependency strategy hiding bridge debt
- package publication confusion

## Decision Options

Selected:

`CGOS_SECOND_WAVE_PUBLIC_SURFACE_CANDIDATE_READINESS_PASS_PARTIAL_DESIGN_READY`

Not selected:

- `CGOS_SECOND_WAVE_PUBLIC_SURFACE_CANDIDATE_READINESS_PASS_DESIGN_READY`
- `CGOS_SECOND_WAVE_PUBLIC_SURFACE_CANDIDATE_READINESS_PASS_SOLOCREW_OWNED_BIAS`
- `CGOS_SECOND_WAVE_PUBLIC_SURFACE_CANDIDATE_READINESS_BLOCKED_NEEDS_MORE_USAGE_DATA`

## Next Allowed Task

`CGOS-SECOND-WAVE-PUBLIC-SURFACE-FIELD-DESIGN-WAVE-01`

Owner may also pause development.
