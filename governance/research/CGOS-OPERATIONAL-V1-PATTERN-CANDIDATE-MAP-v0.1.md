# CGOS Operational V1 Pattern Candidate Map

`CGOS-OPERATIONAL-V1-PATTERN-CANDIDATE-MAP-v0.1`

## A. Purpose

This note maps sealed SoloCrew Operational V1 learnings into neutral
`Cognitive_OS` candidate patterns.

It is:

- research / candidate map only
- no runtime implementation
- no schema change
- no product semantics
- no SoloCrew-specific terms becoming runtime law

## B. Candidate Pattern Table

| candidate_id | candidate_name | source SoloCrew capability | existing Cognitive_OS support | proposed layer | status | next action |
| --- | --- | --- | --- | --- | --- | --- |
| `cgos_opv1_01` | `operator_request_intake_boundary` | founder-facing request intake | bounded runtime-consumption boundary exists, but no neutral intake abstraction | governance / projection boundary | `CANDIDATE_NEEDS_MORE_EVIDENCE` | define whether a neutral operator-intake boundary is truly reusable beyond SoloCrew |
| `cgos_opv1_02` | `projection_safe_state_exposure` | packet / review / staging state exposure | runtime first-pass closure already calls for projection-safe continuity / semantic / drift / activation contracts | projection-safe read-model layer | `CANDIDATE_CONFIRMED` | draft a neutral projection-safe exposure contract family in a later design wave |
| `cgos_opv1_03` | `evidence_posture_summary` | evidence / stale / insufficiency visibility | evidence refs and summary-projection drafting exist, but no explicit posture-summary contract | summary projection / governance | `CANDIDATE_CONFIRMED` | draft neutral evidence-posture summary seeds |
| `cgos_opv1_04` | `non_executing_recommendation_envelope` | non-executing boundary plus bounded recommendation posture | AEL first pass already classifies activate / confirm_required / suppressed / escalate without provider execution | runtime-private activation summary / projection-safe envelope | `CANDIDATE_CONFIRMED` | define a neutral non-executing recommendation envelope derived from AEL outcomes |
| `cgos_opv1_05` | `governed_review_handoff_summary` | handoff staging preview and handoff review explanation | downstream packet-state boundary review exists, but no neutral upstream handoff kernel is adopted | governance / projection boundary | `CANDIDATE_NEEDS_MORE_EVIDENCE` | keep current SoloCrew wording downstream until a smaller neutral kernel is proven |
| `cgos_opv1_06` | `release_evidence_pack` | release evidence chain | closure records and evidence-pack governance already exist strongly | governance | `GOVERNANCE_ONLY` | normalize reuse guidance only; do not implement runtime code |
| `cgos_opv1_07` | `forbidden_claim_scan` | forbidden claim scan | boundary/non-promotion governance exists, but no explicit scan pattern is standardized | governance | `GOVERNANCE_ONLY` | define reusable governance checklist / grep pattern only |
| `cgos_opv1_08` | `disclosed_gap_governance` | disclosed gap pack | deferred-non-goals and boundary closure records already provide close governance analogs | governance | `GOVERNANCE_ONLY` | keep as governance-only template, not runtime behavior |
| `cgos_opv1_09` | `runtime_private_vs_projection_safe_boundary` | non-executing boundary and state exposure separation | already explicit across README, runtime closure audit, and consumption guide | governance / runtime-consumption rule | `CANDIDATE_CONFIRMED` | tighten naming and cross-reference clarity only |
| `cgos_opv1_10` | `aggregate_posture_reduction` | portfolio aggregate posture | summary projection runtime draft exists; current aggregate posture remains Secretary-shaped downstream | summary projection layer | `CANDIDATE_NEEDS_MORE_EVIDENCE` | reduce the pattern to neutral upward-safe summary aggregation before design work |

## C. Existing Support Alignment

This map is grounded in current `Cognitive_OS` truth:

- VSL first pass
- PSG first pass
- Delta Drift & Impact first pass
- AEL first pass
- Governed Learning first pass
- runtime first-pass closure audit
- summary projection runtime draft
- runtime consumption guide
- downstream packet-state boundary review

Current alignment read:

- the repo already owns runtime-private substrate patterns
- the repo already owns governance rules for downstream consumption and
  non-promotion
- the repo does not yet own neutral product-facing projection contracts for the
  new SoloCrew sealed patterns

## D. Boundary Rules

- do not import founder, Secretary, or portfolio names into `Cognitive_OS`
  runtime law
- `Cognitive_OS` may define neutral operator, projection, evidence, and
  governance patterns
- implementation requires a later separate wave
- the current wave records candidate map only

## E. Decision

`CGOS_PATTERN_MAP_READY_FOR_RUNTIME_DESIGN_WAVE`

The candidate set is now clear enough for a later neutral design wave, but this
wave does not authorize implementation, schema work, or product-semantic
promotion.
