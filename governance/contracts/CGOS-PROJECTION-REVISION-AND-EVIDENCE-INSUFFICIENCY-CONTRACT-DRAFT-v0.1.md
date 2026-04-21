# CGOS Projection Revision and Evidence Insufficiency Contract Draft v0.1

`doc_id: CGOS-PROJECTION-REVISION-AND-EVIDENCE-INSUFFICIENCY-CONTRACT-DRAFT-v0.1`

## A. Purpose

This document defines a draft neutral contract surface for future
implementation.

## B. Draft Type Shapes

```ts
type RuntimeProjectionRevisionEnvelopeDraft = {
  revision_id: string;
  project_id: string;
  previous_projection_summary_id: string;
  revision_reason:
    | "insufficient_evidence"
    | "stale_context"
    | "operator_clarification"
    | "contract_blocked"
    | "other";
  revision_input_summary: string;
  evidence_insufficiency?: RuntimeEvidenceInsufficiencyDetailDraft;
  resulting_projection_summary_id?: string;
  non_executing: true;
  runtime_private_fields_omitted: true;
};

type RuntimeEvidenceInsufficiencyDetailDraft = {
  detail_id: string;
  project_id: string;
  evidence_available: boolean;
  insufficient: boolean;
  stale: boolean;
  insufficiency_category?:
    | "missing_required_context"
    | "stale_context"
    | "conflicting_evidence"
    | "runtime_private_omitted"
    | "other";
  omission_reason?: string;
  required_evidence_class?: string;
  safe_evidence_refs?: string[];
  safe_clarification_prompt?: string;
  non_executing: true;
  runtime_private_fields_omitted: true;
};
```

## C. Guard Rules

- project_id consistency required
- no raw VSL / raw PSG / raw trace exposure
- no approve/reject/dispatch/execute
- no provider/channel
- no queue
- evidence detail is not proof/certification
- revision is not execution
- revision is not approval/rejection

## D. Implementation Status

Draft only. No runtime implementation in this wave.

## E. Decision

`CGOS_PROJECTION_REVISION_EVIDENCE_INSUFFICIENCY_CONTRACT_DRAFT_READY`
