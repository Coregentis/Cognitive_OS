# CGOS Projection Revision Runtime Type Placement Plan v0.1

`doc_id: CGOS-PROJECTION-REVISION-RUNTIME-TYPE-PLACEMENT-PLAN-v0.1`

## A. Purpose

This document plans where future type definitions should live.

## B. Proposed Type Surfaces

| Draft type | Future runtime type | File | Why here | Compatibility |
|---|---|---|---|---|
| `RuntimeProjectionRevisionEnvelopeDraft` | `RuntimeProjectionRevisionEnvelope` | `runtime/core/projection-types.ts` | keeps revision contract aligned with existing projection-safe runtime types | additive alongside existing projection-safe types |
| `RuntimeEvidenceInsufficiencyDetailDraft` | `RuntimeEvidenceInsufficiencyDetail` | `runtime/core/projection-types.ts` | keeps insufficiency detail aligned with existing evidence posture types | additive alongside existing evidence posture types |

## C. Field Plan

Future projection revision fields:

- `revision_id`
- `project_id`
- `previous_projection_summary_id`
- `revision_reason`
- `revision_input_summary`
- `evidence_insufficiency`
- `resulting_projection_summary_id`
- `non_executing`
- `runtime_private_fields_omitted`

Future evidence insufficiency detail fields:

- `detail_id`
- `project_id`
- `evidence_available`
- `insufficient`
- `stale`
- `insufficiency_category`
- `omission_reason`
- `required_evidence_class`
- `safe_evidence_refs`
- `safe_clarification_prompt`
- `non_executing`
- `runtime_private_fields_omitted`

## D. Enum Plan

Planned `revision_reason` enum:

- `insufficient_evidence`
- `stale_context`
- `operator_clarification`
- `contract_blocked`
- `other`

Planned `insufficiency_category` enum:

- `missing_required_context`
- `stale_context`
- `conflicting_evidence`
- `runtime_private_omitted`
- `other`

## E. Boundary

- no raw VSL / PSG / trace
- no provider/channel
- no approve/reject/dispatch/execute
- no queue
- no proof/certification claim

## F. Decision

`CGOS_PROJECTION_REVISION_RUNTIME_TYPE_PLACEMENT_PLAN_READY`
