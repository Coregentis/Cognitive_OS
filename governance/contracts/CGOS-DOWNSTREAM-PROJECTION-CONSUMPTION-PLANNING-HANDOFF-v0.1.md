# CGOS Downstream Projection Consumption Planning Handoff v0.1

`CGOS-DOWNSTREAM-PROJECTION-CONSUMPTION-PLANNING-HANDOFF-v0.1`

## A. Purpose

This handoff defines what downstream planning may assume after a future
projection-safe contract implementation wave.

It is:

- planning handoff only
- not a runtime API release
- no downstream product dependency
- no product-specific naming
- no runtime internals as product API

Downstream planning may not consume contracts until implementation lands.

## B. Future Consumable Surfaces

After a future implementation wave, downstream planning may expect these
surfaces:

- `RuntimeProjectionSafeStateExposure`
- `RuntimeEvidencePostureSummary`
- `RuntimeNonExecutingRecommendationEnvelope`
- `RuntimeProjectionSummaryEnvelope`

## C. Not Yet Consumable

Until implementation lands, downstream planning must not assume that any
projection-safe runtime API already exists.

## D. Consumption Rules

Downstream planning and later downstream implementation must:

- consume projection summaries only
- not import raw runtime internals
- not infer approval from `transition_accepted`
- not infer execution completion from `terminal`
- not treat evidence summary as proof or certification
- not dispatch or execute a recommendation envelope

## E. Final Decision

`CGOS_DOWNSTREAM_PROJECTION_CONSUMPTION_HANDOFF_READY_FOR_PLANNING_ONLY`

This handoff is ready to guide downstream planning while keeping the runtime
boundary non-executing and contract-first.
