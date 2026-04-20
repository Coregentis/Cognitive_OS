# CGOS Projection-Safe Contract Implementation Plan v0.1

`CGOS-PROJECTION-SAFE-CONTRACT-IMPLEMENTATION-PLAN-v0.1`

## A. Purpose

This plan defines the next implementation wave for neutral projection-safe
runtime contracts.

It is:

- planning only
- no runtime implementation in this wave
- no code changes in this wave
- no schema change
- no product-specific names
- no downstream product dependency
- no provider or channel execution
- no approve, reject, dispatch, or execute semantics

## B. Implementation Scope For Next Wave

The next implementation wave may create:

- `runtime/core/projection-types.ts`
- `runtime/core/projection-service.ts`
- `runtime/in-memory/projection-store.ts`
- `tests/runtime/projection-safe-contract.test.mjs`

This wave must not create those files.

## C. Contract Families In First Implementation Wave

The first implementation wave should include only:

- `RuntimeProjectionSafeStateExposure`
- `RuntimeEvidencePostureSummary`
- `RuntimeNonExecutingRecommendationEnvelope`
- `RuntimeProjectionSummaryEnvelope`

Explicitly deferred:

- `RuntimeAggregatePostureSummary`

Reason:

- `aggregate_posture_reduction` remains `NEEDS_MORE_EVIDENCE`

## D. Field-Level Contract Draft

Planned TypeScript-level shapes for the later implementation wave:

```ts
type RuntimeProjectionSafeStateExposure = {
  projection_id: string;
  project_id: string;
  source_runtime_ref: string;
  state_summary: {
    initial_state: string;
    transition_event: string;
    requested_next_state?: string;
    evaluated_next_state?: string;
    transition_accepted: boolean;
    final_state: string;
    blocked_reason?: string;
    terminal: boolean;
  };
  interpretation: {
    transition_accepted_meaning: "state evaluation accepted, not approval";
    terminal_meaning: "state line terminal, not execution complete";
    blocked_reason_meaning: "blocked state transition reason, not task failure verdict";
  };
  non_executing: true;
  created_at: string;
};

type RuntimeEvidencePostureSummary = {
  evidence_summary_id: string;
  project_id: string;
  evidence_available: boolean;
  evidence_refs: string[];
  evidence_summary: string;
  stale: boolean;
  insufficient: boolean;
  omission_reason?: string;
  confidence_posture?: "bounded" | "insufficient" | "stale" | "not_evaluated";
  interpretation: {
    evidence_summary_meaning: "summary, not proof or certification";
  };
  created_at: string;
};

type RuntimeNonExecutingRecommendationEnvelope = {
  recommendation_id: string;
  project_id: string;
  recommendation_summary: string;
  recommended_next_posture?: string;
  allowed_next_step?: string;
  blocked_actions: Array<
    | "approve"
    | "reject"
    | "dispatch"
    | "execute"
    | "provider_channel_send"
  >;
  non_executing: true;
  requires_later_authorization: true;
  created_at: string;
};

type RuntimeProjectionSummaryEnvelope = {
  projection_summary_id: string;
  project_id: string;
  state_exposure?: RuntimeProjectionSafeStateExposure;
  evidence_posture?: RuntimeEvidencePostureSummary;
  recommendation?: RuntimeNonExecutingRecommendationEnvelope;
  source_refs: string[];
  non_executing: true;
  runtime_private_fields_omitted: true;
  created_at: string;
};
```

## E. Service Behavior Planning

Future `projection-service.ts` should provide:

- `create_state_exposure(input)`
- `create_evidence_posture_summary(input)`
- `create_non_executing_recommendation(input)`
- `create_projection_summary_envelope(input)`
- `validate_projection_summary(summary)`

Future implementation must remain deterministic and must not execute external
actions.

## F. Store Behavior Planning

Future `projection-store.ts` may support:

- `put_projection_summary(project_id, summary)`
- `list_projection_summaries(project_id)`
- `get_projection_summary(project_id, summary_id)`

The store must not expose raw runtime stores or runtime-private objects.

## G. Dependency Boundary

Allowed future read sources:

- AEL assessment summary
- PSG graph summary
- VSL continuity summary
- drift or impact assessment summary
- trace or evidence summary
- learning suggestion summary

Forbidden:

- raw VSL store
- raw PSG graph
- raw trace object
- raw drift record
- raw learning candidate
- provider or channel execution result
- product DTO
- downstream product object

## H. Final Decision

`CGOS_PROJECTION_SAFE_CONTRACT_IMPLEMENTATION_PLAN_READY`

The current design pack now supports a later implementation wave that drafts
neutral projection-safe runtime contracts without widening runtime authority,
schema scope, or protocol scope.
