# CGOS Durable Lifecycle Continuity Dependency Baseline v0.1

`doc_id: CGOS-DURABLE-LIFECYCLE-CONTINUITY-DEPENDENCY-BASELINE-v0.1`

## A. Purpose

Define Cognitive_OS dependency planning for a generic durable lifecycle
continuity capability.

## B. Documentation Budget

This wave uses one canonical dependency baseline rather than separate
audit/gate/dependency/design documents.

| Artifact type | Decision | Reason |
|---|---|---|
| Dependency baseline | allowed | one canonical consolidated baseline |
| Separate audit | not created | avoid governance sprawl |
| Separate gate | not created | embedded readiness gate in baseline |
| Separate design doc | not created | design included in baseline |
| Separate release doc | not created | not a release wave |

## C. Existing Runtime Surface Summary

Current Cognitive_OS runtime surface already includes:

- generic projection revision envelope
- generic evidence insufficiency detail
- projection-safe validation / creation
- projection-adjacent storage
- runtime-private omission
- non-executing posture

Current reuse-oriented observations:

- project-scoped continuity state already exists as runtime-private VSL
  substrate
- projection-adjacent revision storage already exists for bounded revision
  envelopes
- what does not yet exist is a neutral projection-safe durable lifecycle
  continuity surface suitable for downstream consumption

## D. Downstream Need Abstracted Into Neutral Capability

A downstream projection consumer now requires durable lifecycle continuity:
cross-session lifecycle state, local lifecycle history, pending review item
visibility below queue/execution semantics, and projection-safe summaries
suitable for downstream UI consumption.

This is treated here as a neutral runtime/projection requirement rather than a
product dependency.

## E. Capability Options Matrix

| Option | Runtime value | Projection value | Implementation pressure | Decision |
|---|---|---|---|---|
| Durable lifecycle history store | durable continuity record for one project/runtime scope | enables readable lifecycle history summaries | medium-high | selected for dependency design |
| Projection-safe lifecycle continuity envelope | neutral continuity carrier over durable runtime state | enables downstream continuity rendering without raw runtime exposure | medium | selected for dependency design |
| Pending review item list below queue semantics | bounded non-executing pending-review visibility | enables downstream review list without queue behavior | medium-high | selected for dependency design |
| Session continuity summary | compact cross-session continuity read | enables quick downstream continuity recap | medium | selected for dependency design |
| Exportable continuity snapshot | bounded portable continuity summary | enables downstream export/readback of continuity-safe state | medium | selected for dependency design |
| Action-preparation draft surface | bounded draft semantics adjacent to review continuity | could support later downstream preparation surfaces | high | explicitly deferred unless separately scoped |
| Provider/channel execution | execution capability | not projection-safe continuity work | unacceptable | out of scope |
| Approve/reject/dispatch/execute | direct-control capability | not projection-safe continuity work | unacceptable | out of scope |

## F. Recommended Cognitive_OS Capability Direction

`CGOS_DURABLE_LIFECYCLE_CONTINUITY_DIRECTION_READY_FOR_DESIGN`

## G. Runtime Design Boundary

| Runtime object | Purpose | Must include | Must not include |
|---|---|---|---|
| `DurableLifecycleContinuityEnvelope` | represent one durable continuity envelope for project-scoped lifecycle state | continuity id, project id, lifecycle stage, lifecycle label, continuity summary, non-executing posture, runtime-private-fields-omitted marker | provider/channel execution, approve/reject/dispatch/execute, queue execution semantics, raw VSL/PSG/Trace payload, protocol certification, product-specific naming |
| `LifecycleHistoryEntry` | represent one bounded lifecycle-history record | history entry id, project id, prior continuity ref, lifecycle stage, lifecycle label, created at, safe evidence refs | provider/channel execution, approve/reject/dispatch/execute, queue execution semantics, raw VSL/PSG/Trace payload, protocol certification, product-specific naming |
| `PendingReviewItemSummary` | represent one bounded pending-review item below queue semantics | review item id, project id, lifecycle stage, lifecycle label, evidence gap summary, review posture, non-executing posture | provider/channel execution, approve/reject/dispatch/execute, queue worker state, raw VSL/PSG/Trace payload, protocol certification, product-specific naming |
| `ContinuitySnapshotSummary` | represent a bounded continuity snapshot for downstream consumption/export | snapshot id, project id, history summary, pending review count, continuity status, runtime-private-fields-omitted marker | provider/channel execution, approve/reject/dispatch/execute, queue execution semantics, raw VSL/PSG/Trace payload, protocol certification, product-specific naming |

## H. Projection Contract Boundary

| Projection surface | Downstream value | Safe fields | Forbidden fields |
|---|---|---|---|
| `RuntimeLifecycleContinuityProjection` | downstream continuity rendering | `project_id`, `continuity_id`, `lifecycle_stage`, `lifecycle_label`, `history_summary`, `review_posture`, `non_executing_posture`, `runtime_private_fields_omitted` | `raw_vsl`, `raw_psg`, `raw_trace`, `provider_channel_result`, `dispatch_result`, `approval_result`, `execution_result`, `queue_worker_state`, `runtime_private_payload` |
| `RuntimePendingReviewProjection` | downstream pending-review visibility below queue semantics | `project_id`, `continuity_id`, `pending_review_count`, `pending_review_items`, `evidence_gap_summary`, `review_posture`, `non_executing_posture`, `safe_evidence_refs`, `runtime_private_fields_omitted` | `raw_vsl`, `raw_psg`, `raw_trace`, `provider_channel_result`, `dispatch_result`, `approval_result`, `execution_result`, `queue_worker_state`, `runtime_private_payload` |
| `RuntimeContinuitySnapshotProjection` | downstream continuity snapshot or export surface | `project_id`, `continuity_id`, `lifecycle_stage`, `lifecycle_label`, `history_summary`, `pending_review_count`, `safe_evidence_refs`, `runtime_private_fields_omitted` | `raw_vsl`, `raw_psg`, `raw_trace`, `provider_channel_result`, `dispatch_result`, `approval_result`, `execution_result`, `queue_worker_state`, `runtime_private_payload` |

## I. Storage / VSL Posture

Cognitive_OS may need projection-adjacent durable storage for lifecycle
continuity summaries.

This design posture reuses the existence of project-scoped continuity state and
projection-adjacent revision storage as a starting point, but it does not yet
claim a durable projection-safe lifecycle continuity implementation.

This does not expose raw VSL / PSG / Trace internals.
This does not implement provider/channel execution or queue semantics.

## J. MPLP Mapping Posture

| Concern | MPLP posture | Reason |
|---|---|---|
| durable lifecycle continuity | candidate/backlog only | continuity semantics may later inform neutral protocol-level discussion, but not in this wave |
| lifecycle history | candidate/backlog only | history vocabulary may later need review, but no schema/protocol change is justified now |
| pending review item below queue semantics | candidate/backlog only | review visibility below queue semantics is not protocol law in this wave |
| continuity snapshot | candidate/backlog only | snapshot/export framing may later need neutral guidance only |
| action-preparation draft | candidate/backlog only | if revisited later, it still remains non-normative and below protocol law in this wave |

Required conclusion:

- MPLP posture is candidate/backlog only.
- No MPLP schema change.
- No MPLP protocol law change.
- No MPLP binding change in this wave.

## K. Implementation Readiness Gate Embedded

| Gate | Requirement | Status |
|---|---|---|
| existing runtime surface reviewed | projection revision / evidence insufficiency / continuity substrate reviewed | PASS |
| downstream need abstracted neutrally | durable lifecycle continuity need described without product dependency | PASS |
| runtime design boundary drafted | neutral runtime objects defined | PASS |
| projection contract boundary drafted | neutral projection-safe surfaces defined | PASS |
| storage/VSL posture drafted | storage and VSL posture defined without implementation claim | PASS |
| MPLP posture assessed | candidate/backlog-only posture recorded | PASS |
| documentation budget respected | one canonical dependency baseline only | PASS |
| delivery ROI respected | reuse research, design boundary, and next-step decision landed together | PASS |
| no implementation in this wave | governance/design only | PASS |
| no schema change | no schema files changed | PASS |
| no tag/release/seal | no tag, GitHub Release, or seal record created | PASS |

Decision enum:

`CGOS_DURABLE_LIFECYCLE_CONTINUITY_DEPENDENCY_BASELINE_READY`

## L. Next Step Decision

`Cognitive_OS durable lifecycle continuity implementation planning`
