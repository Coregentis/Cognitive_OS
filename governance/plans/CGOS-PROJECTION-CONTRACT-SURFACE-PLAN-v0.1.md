# CGOS Projection Contract Surface Plan v0.1

`CGOS-PROJECTION-CONTRACT-SURFACE-PLAN-v0.1`

## A. Purpose

This plan defines how a later implementation wave may create neutral contract
surfaces for projection-safe consumption.

This wave does not implement those surfaces.

## B. Proposed Future Files

A later implementation wave may create:

- `runtime/core/projection-types.ts`
- `runtime/core/projection-service.ts`
- `runtime/in-memory/projection-store.ts`
- `tests/runtime/projection-safe-contract.test.mjs`

This wave must not create those files.

## C. Proposed Contract Families

- `RuntimeProjectionSafeStateExposure`
- `RuntimeEvidencePostureSummary`
- `RuntimeNonExecutingRecommendationEnvelope`
- `RuntimeProjectionSummaryEnvelope`
- `RuntimeAggregatePostureSummary`

## D. Dependency Boundary

Future implementation may read from:

- AEL first-pass assessment
- PSG graph summary
- VSL continuity summary
- drift and impact assessment
- trace and evidence summary
- learning candidate summary

Future implementation must not expose:

- raw VSL store
- raw PSG graph
- raw trace object
- raw drift record
- raw learning candidate
- provider or channel execution result
- product DTO

## E. Test Plan

Future tests must prove:

- summary objects are deterministic
- no raw runtime keys leak
- `transition_accepted` is not approval
- `terminal` is not execution complete
- evidence summary is not proof
- recommendation does not execute
- downstream can consume projection summaries without runtime-private imports

## F. Decision

`CGOS_PROJECTION_CONTRACT_SURFACE_PLAN_READY_FOR_IMPLEMENTATION_WAVE`

The design is now specific enough that a later implementation-planning wave may
draft contract files and tests without widening runtime authority or protocol
scope.
