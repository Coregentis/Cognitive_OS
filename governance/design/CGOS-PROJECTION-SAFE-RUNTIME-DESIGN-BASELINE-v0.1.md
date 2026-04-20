# CGOS Projection-Safe Runtime Design Baseline v0.1

`CGOS-PROJECTION-SAFE-RUNTIME-DESIGN-BASELINE-v0.1`

## A. Purpose

This baseline defines neutral projection-safe runtime design for downstream
product consumption.

It is:

- design baseline only
- no runtime implementation
- no code changes
- no schema change
- no product-specific names
- no downstream product dependency
- no MPLP schema or protocol law change

## B. Scope

Design scope includes only these neutral patterns:

- `projection_safe_state_exposure`
- `evidence_posture_summary`
- `non_executing_recommendation_envelope`
- `runtime_private_vs_projection_safe_boundary`
- `aggregate_posture_reduction`

Out of scope:

- product intake objects
- product UI rendering
- product route or page language
- provider or channel execution
- approve, reject, dispatch, or execute semantics
- named downstream queue semantics
- protocol schema changes

## C. Design Principles

- runtime-private state is not a product API
- projection-safe summaries are the stable consumption boundary
- evidence summaries are not proof or certification
- state transitions are not approval
- terminal state is not execution completion
- recommendation is not dispatch or execution
- downstream products may consume summaries but must not import runtime stores
  or runtime-private objects

## D. Pattern Definitions

### 1. `projection_safe_state_exposure`

Proposed fields:

```yaml
projection_id: string
source_runtime_ref: string
state_summary:
  initial_state: string
  transition_event: string
  requested_next_state: string?
  evaluated_next_state: string?
  transition_accepted: boolean
  final_state: string
  blocked_reason: string?
  terminal: boolean
interpretation:
  transition_accepted_meaning: "state evaluation accepted, not approval"
  terminal_meaning: "state line terminal, not execution complete"
  blocked_reason_meaning: "blocked state transition reason, not task failure verdict"
non_executing: true
```

Design note:

- this pattern reduces reducer, drift, and activation-adjacent evaluation into a
  stable consumption summary without exposing internal service inputs or store
  references

### 2. `evidence_posture_summary`

Proposed fields:

```yaml
evidence_summary_id: string
evidence_available: boolean
evidence_refs:
  - string
evidence_summary: string
stale: boolean
insufficient: boolean
omission_reason: string?
confidence_posture: "bounded" | "insufficient" | "stale" | "not_evaluated"?
interpretation:
  evidence_summary_meaning: "summary, not proof or certification"
```

Design note:

- this pattern compresses evidence presence, bounded references, and posture
  flags into a safe summary surface that stays below certification or verdict
  semantics

### 3. `non_executing_recommendation_envelope`

Proposed fields:

```yaml
recommendation_id: string
recommendation_summary: string
recommended_next_posture: string?
allowed_next_step: string?
blocked_actions:
  - "approve"
  - "reject"
  - "dispatch"
  - "execute"
  - "provider_channel_send"
non_executing: true
requires_later_authorization: true
```

Design note:

- this pattern may derive from bounded activation, reconcile, and evidence
  posture summaries, but it must never imply execution authority

### 4. `runtime_private_vs_projection_safe_boundary`

Boundary definition:

- runtime stores and raw objects remain internal
- projection summaries are the only downstream-facing contract
- no direct import of runtime internals by products

Design note:

- this pattern is governance and contract discipline more than a runtime feature
- any future contract wave must fail closed if a raw runtime-private type tries
  to cross the summary boundary

### 5. `aggregate_posture_reduction`

Boundary definition:

- multiple bounded summaries may reduce into a safe aggregate posture
- aggregate posture may summarize concentration of review, stale, insufficient,
  blocked, or terminal signals
- aggregate posture must not create execution authority, approval semantics, or
  queue semantics

Design note:

- this pattern remains weaker than the other four because current evidence is
  still limited to a small set of downstream summary examples

## E. Candidate-to-Implementation Readiness

| Pattern | Design Status | Implementation Risk | Dependencies | Next Implementation Artifact |
| --- | --- | --- | --- | --- |
| `projection_safe_state_exposure` | `READY_FOR_CONTRACT_DRAFT` | medium | runtime-private evaluation surfaces, bounded transition interpretation, export-safe naming discipline | `RuntimeProjectionSafeStateExposure` |
| `evidence_posture_summary` | `READY_FOR_CONTRACT_DRAFT` | low | trace summary discipline, omission posture wording, bounded evidence refs | `RuntimeEvidencePostureSummary` |
| `non_executing_recommendation_envelope` | `READY_FOR_CONTRACT_DRAFT` | medium | AEL first-pass outcome mapping, reconcile posture discipline, blocked-action freeze | `RuntimeNonExecutingRecommendationEnvelope` |
| `runtime_private_vs_projection_safe_boundary` | `GOVERNANCE_ONLY` | low | runtime consumption guide, cross-repo non-promotion discipline | boundary assertions and guide references only |
| `aggregate_posture_reduction` | `NEEDS_MORE_EVIDENCE` | medium | more repeated summary patterns, neutral reduction ordering, stronger non-authority wording | `RuntimeAggregatePostureSummary` draft later |

## F. Decision

`CGOS_PROJECTION_SAFE_RUNTIME_DESIGN_READY_FOR_CONTRACT_DRAFTING`

The current evidence is strong enough to draft neutral contract surfaces in a
later wave without treating runtime-private internals as a downstream-facing
API.
