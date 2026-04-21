# CGOS Projection Revision Runtime Service Behavior Plan v0.1

`doc_id: CGOS-PROJECTION-REVISION-RUNTIME-PROJECTION-SERVICE-BEHAVIOR-PLAN-v0.1`

## A. Purpose

This document plans future `DeterministicProjectionService` behavior for
projection revision and evidence insufficiency detail.

## B. Future Methods

| Method | Input | Output | Behavior | Non-goals |
|---|---|---|---|---|
| `create_evidence_insufficiency_detail(input)` | neutral insufficiency detail input | `RuntimeEvidenceInsufficiencyDetail` | creates deterministic insufficiency detail with omission-safe refs and clarification prompt | no raw runtime exposure |
| `validate_evidence_insufficiency_detail(input)` | neutral insufficiency detail input or object | validation result | validates required fields, flags, enums, and safety boundaries | no execution semantics |
| `create_projection_revision_envelope(input)` | neutral revision envelope input | `RuntimeProjectionRevisionEnvelope` | creates deterministic revision envelope tied to prior projection summary | no approval/rejection semantics |
| `validate_projection_revision_envelope(input)` | neutral revision envelope input or object | validation result | validates project consistency, enum values, and non-executing/runtime-private flags | no queue or provider/channel behavior |

## C. Validation Rules

- `project_id` required
- nested `project_id` consistency
- `non_executing` must be true
- `runtime_private_fields_omitted` must be true
- `previous_projection_summary_id` required
- `revision_reason` must be allowed enum
- evidence detail must not be proof/certification
- `safe_evidence_refs` must be safe refs only
- no raw runtime-like keys
- no forbidden action labels
- no provider/channel
- no queue

## D. Deterministic Errors

Planned deterministic error strings:

- `revision_id is required`
- `project_id is required`
- `previous_projection_summary_id is required`
- `revision_reason must be one of insufficient_evidence, stale_context, operator_clarification, contract_blocked, other`
- `non_executing must be true`
- `runtime_private_fields_omitted must be true`
- `evidence_insufficiency.project_id must match revision project_id`
- `evidence detail is not proof or certification`

## E. Decision

`CGOS_PROJECTION_REVISION_RUNTIME_PROJECTION_SERVICE_BEHAVIOR_PLAN_READY`
