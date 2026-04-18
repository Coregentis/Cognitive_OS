# CGOS-SOLOCREW-PROJECTION-READINESS-BASELINE-v0.1

## Purpose

This baseline freezes what current `Cognitive_OS` runtime first-pass closure is
ready to provide to SoloCrew later, and what it is not ready to provide.

Its job is bounded:

- define readiness posture from the `Cognitive_OS` side only
- prevent SoloCrew from depending directly on runtime-private internals
- require an explicit projection contract before downstream consumption

This document does not define SoloCrew product behavior.
It does not define founder-facing workflow law.
It does not create product DTO law.

## Readiness Status

Current readiness status:

- `READY_FOR_SOLOCREW_EXCEPTION_PLANE_PREPARATION`

Meaning:

- SoloCrew may begin a downstream preparation audit for exception-plane
  projection
- SoloCrew may identify candidate projection inputs from current runtime
  outputs
- SoloCrew may not directly bind to raw runtime stores, runtime-private schema
  objects, or service internals

## Allowed Future Projection Inputs

The following are candidate projection inputs only after an explicit projection
contract is defined:

- bounded continuity summaries derived from `RuntimeVslContinuityState`
  - continuation-anchor ref
  - replay / rollback / retention horizon summaries
  - continuation disposition
- bounded semantic relation summaries derived from `RuntimePsgGraphUpdateSummary`
  - changed node refs
  - changed relation refs
  - evidence-linked graph update summary
- bounded drift / impact summaries derived from
  `RuntimeDeltaDriftImpactAssessment` and `RuntimeReconciliationSnapshot`
  - affected object refs
  - baseline object refs
  - impact summary
  - explicit conflict presence or absence
- bounded activation summaries derived from `RuntimeAelAssessment`
  - activation outcome
  - gating basis
  - confirm-required or escalation signal
- bounded evidence and confirmation summaries derived from:
  - `RuntimeConfirmSummary`
  - `RuntimeEvidenceSummary`
  - lawful `Confirm` / `Trace` export results when present
- bounded learning suggestion summaries derived from
  `RuntimeGovernedLearningAssessment`
  - suggestion-only candidate kind
  - source evidence refs
  - source object refs
  - future-sample eligibility metadata

All such inputs remain candidate projection inputs rather than automatic product
dependencies.

## Forbidden Direct Dependencies

SoloCrew must not directly depend on:

- `runtime/core/*` service internals
- `runtime/in-memory/*` store internals
- raw `RuntimeVslStore` layout
- raw `RuntimePsgGraphState` node / edge internals
- raw `MinimalLoopRunResult` as a product DTO
- raw `learning-candidate` internal object records
- raw `drift-record` internal object records
- raw `conflict-case` internal object records
- raw `activation-signal` or `action-unit` object records
- raw `memory-promotion-record` object records
- binding-matrix hints as if they were product contracts
- Confirm / Trace bounded export as if it implied full protocol reconstruction

No downstream product may treat current runtime-private objects as stable public
interfaces.

## Required Projection Contract Before SoloCrew Consumption

Before SoloCrew consumes any current runtime output, a projection contract must
be documented and frozen.

That projection contract must define:

- exact input source
  - which runtime output or export surface is being consumed
- allowed field subset
  - only the bounded fields needed downstream
- omission semantics
  - what the product must do when runtime truth is absent or intentionally
    omitted
- refresh semantics
  - whether the projection is snapshot-based, run-result-based, or
    export-artifact-based
- evidence handling
  - which evidence refs may surface downstream and which remain internal
- boundary guarantees
  - what remains runtime-private and non-exportable
- versioning posture
  - how contract changes are reviewed before SoloCrew dependency is allowed

No projection contract may:

- widen MPLP law
- redefine runtime-private objects as product law
- imply provider execution, dispatch execution, rollback execution, or
  compensation execution
- create product DTO law from runtime-first-pass internals

## Non-Goals

This baseline does not claim:

- full runtime completion
- full protocol export/reconstruction
- SoloCrew operational readiness
- direct readiness for founder queue behavior
- direct readiness for Secretary packet or product card design
- direct readiness for product workflow execution

It also preserves current active non-goals:

- no full VSL
- no full PSG
- no full drift engine
- no full AEL
- no full learning engine
- no product DTO law

## Boundary Conclusion

`Cognitive_OS` is now ready to support a SoloCrew exception-plane preparation
audit, but only through future projection contracts.

It is ready to provide:

- bounded continuity summaries
- bounded semantic relation summaries
- bounded drift / impact summaries
- bounded activation summaries
- bounded confirm / trace / evidence summaries
- bounded learning suggestion summaries

It is not ready to provide:

- direct runtime-private store access
- raw substrate internals as product interfaces
- full protocol reconstruction
- product workflow law
- founder-facing DTOs or review semantics

The next lawful downstream move is therefore:

- define projection contract candidates first
- keep current runtime internals non-exportable by default
- let SoloCrew consume only contracted, bounded, and versioned projection
  surfaces later
