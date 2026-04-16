# CGOS v0.5 Upstream Workflow-Truth Decision v0.1

## Decision

`NOT_ADOPTED_UPSTREAM_NOW`

## Purpose

This document records the current upstream decision on whether `Cognitive_OS`
should introduce a runtime-private workflow-truth family for the current
SoloCrew `v0.5` review/handoff/revision packet semantics.

It exists to answer five things explicitly:

- whether an upstream workflow-truth family should be introduced now
- if not, why not
- what remains product-only
- what explicit boundary should govern later reopening
- what evidence would be required before any future upstream adoption discussion

## Current Repo Reality

Current `Cognitive_OS` truth already includes:

- runtime-private scope truth
- runtime-private summary truth
- runtime-private management-family records

It does not currently include:

- a handoff packet runtime family
- a review packet runtime family
- a revision-return packet runtime family
- a shared state machine for draft / staged / review-ready / revision-return
  semantics

The current upstream object family is therefore not missing a silently promised
workflow layer.
It simply has not adopted one.

## Why The Decision Is Not Adoption Now

An upstream workflow-truth family should not be introduced now because the
current evidence remains insufficient.

More specifically:

- the current downstream packet states are still SoloCrew-facing product
  posture semantics
- those semantics do not yet reduce cleanly to a neutral runtime-private kernel
- the nearby upstream management-family records are still intentionally partial
  and asymmetric rather than a finished workflow family
- adopting a new family now would risk encoding SoloCrew surface phrasing as if
  it were neutral mother-runtime truth

Repeated downstream usefulness alone is not enough.
Current product coherence alone is also not enough.

## What Remains Product-Only

The following remain downstream product-only today:

- staged handoff packet framing
- ready-for-cell-review packet posture
- returned-for-revision packet posture
- packet-level revision loop interpretation
- the exact way SoloCrew organizes shell, staging, and review packet views

These may remain useful product semantics without becoming upstream runtime
objects.

## What Smallest Lawful Upstream Kernel Would Need To Look Like

If this question ever reopens, the smallest lawful upstream kernel would need
to be narrower than current SoloCrew wording.

That future kernel would need to be:

- runtime-private
- neutral across downstream surface phrasing
- bounded to one clear mother-runtime meaning
- classifiable in schema, registry, binding, and export terms without implying
  execution authority

It would not be lawful simply to copy:

- `staged`
- `ready_for_cell_review`
- `returned_for_revision`

straight from SoloCrew product language into upstream schema truth.

## Explicit Boundary For Later Reopening

The current boundary rule is:

- no adoption by convenience
- no adoption by repeated product usage alone
- no adoption by semantic proximity to current management-family records alone
- no adoption unless the proposed meaning is smaller and more neutral than the
  current SoloCrew packet phrasing

Later reopening must begin from the current non-adoption judgment rather than
presuming partial adoption.

## Future Evidence Required Before Reopening

Future upstream reopening would require all of the following:

- evidence that the semantics recur across more than one downstream surface or
  usage shape without depending on SoloCrew-specific UI phrasing
- evidence that the meaning can be expressed as neutral runtime-private truth
  rather than as product workflow posture
- evidence that a machine-readable schema family can be written with clear
  authority class, registry notes, binding classification, and non-exportable
  treatment
- evidence that the semantics do not collapse into direct approve, reject,
  dispatch, execute, or workflow-engine authority
- evidence that SoloCrew downstream usage would become clearer, not blurrier,
  after the upstream reduction
- evidence that MPLP non-promotion boundaries would remain unaffected

## Net Decision Rule

The correct current upstream judgment is:

- do not introduce a workflow-truth family for review/return/handoff packet
  states now
- keep current downstream packet states as product-only posture semantics
- keep current workforce/runtime-private line unchanged
- require separate explicit evidence before this question is reopened
