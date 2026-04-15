# CGOS-SUMMARY-PROJECTION-RUNTIME-SURFACE-v0.1

## Purpose

This baseline freezes the minimum mother-runtime preconditions for a later summary-projection capability in response to SoloCrew `v0.4`.

It keeps one rule explicit:

- summary projection must not silently become runtime law just because a downstream product now wants top-level summaries

## Current Repo Truth

Current `Cognitive_OS` already exposes bounded local truth through:

- workforce state stores
- worker lifecycle surfaces
- objective and work-item state
- review, correction, and preference glue surfaces
- evidence and export-oriented runtime summaries for the minimal loop baseline

It does not yet expose a neutral runtime capability whose job is:

- `full local truth -> bounded upward summary truth`

## When Summary Can Stay Purely Product-Projected

Summary may remain downstream product projection while all of the following remain true:

1. the summary is reconstructable from already lawful downstream reads over current runtime truth
2. the summary is inspect-oriented rather than execution-authoritative
3. the summary does not need reusable neutral runtime policies
4. the summary is still product-specific enough that `Cognitive_OS` should not absorb it

This is the current SoloCrew `v0.4` posture.

## When Summary Might Later Need Runtime Support

Summary becomes a plausible mother-runtime candidate only when one or more of the following become true:

1. multiple downstream products need the same neutral summary extraction behavior
2. summary generation requires reusable runtime-side reduction or governance logic
3. downstream reconstruction becomes too ad hoc or too lossy to stay truthful
4. summary posture begins to depend on runtime-family policy, scoping, or evidence rules rather than product presentation alone

## Minimum Runtime-Side Preconditions

If later promoted, a summary-projection runtime surface should remain narrow:

- read local runtime truth
- reduce it into bounded summary-safe seeds
- stay neutral about product wording and layout
- preserve explicit boundaries around omitted or unavailable truth

It should not:

- render cards
- define product DTOs
- define dashboard sections
- define Secretary product behavior

## Runtime Neutrality Rule

Any later runtime summary surface must remain:

- runtime-family neutral
- product-agnostic
- bounded in authority

It may own:

- neutral truth extraction
- neutral reduction rules
- neutral omission and boundary signaling

It may not own:

- product labels
- product hierarchy
- product card layout
- product-specific management vocabulary

## Explicit Non-Claims

This baseline does not claim:

- that summary projection is already implemented
- that current product summary objects are runtime authority
- that broad KPI rollups belong in `Cognitive_OS`
- that portfolio or Secretary behavior is already a mother-runtime surface

## Baseline Judgment

Current judgment is:

- product-projected summary remains acceptable now
- a later runtime-family summary surface is plausible
- promotion is justified only by reusable neutral runtime need, not by product convenience
