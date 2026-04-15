# CGOS-SUMMARY-PROJECTION-RUNTIME-DRAFT-v0.1

## Document Control

- Document ID: `CGOS-SUMMARY-PROJECTION-RUNTIME-DRAFT-v0.1`
- Status: `Runtime Capability Draft`
- Authority: `Mother-runtime research draft derived from SoloCrew management / cell layering`
- Scope: `Summary projection as a runtime capability, not a UI surface`
- Phase Constraint: `Docs-only. No summary runtime implementation is created by this note.`

## Purpose

This note defines `summary projection` as a possible future `Cognitive_OS` runtime capability.

The capability is:

`full local truth -> bounded upward summary truth`

This draft exists because SoloCrew now distinguishes:

- `Cell`-local operating truth
- higher-level management / Secretary-facing summary surfaces

## What Summary Projection Means Here

Runtime summary projection means:

- reading richer local runtime truth
- compressing it into bounded, upward-safe summary truth
- handing summary seeds to downstream product layers

It does not mean:

- rendering cards
- choosing UI labels
- placing widgets
- becoming a product dashboard

## Why Current Runtime Needs A Draft Here

Current runtime already exposes:

- local object stores
- bounded lifecycle state
- bounded execution outcomes
- bounded correction and preference surfaces

Current runtime does not yet expose:

- a governed capability that turns that local truth into reusable summary bundles for upper layers

## Relation To SoloCrew Secretary / Cell Layering

In SoloCrew terms:

- the `Cell Console` consumes local operating truth
- the later Secretary / management layer should consume bounded summaries, not every raw runtime detail

In `Cognitive_OS` terms:

- summary projection should provide upstream-safe summary seeds
- SoloCrew remains responsible for product-specific summary cards and UI

## Draft Inputs

If later realized, summary projection should be allowed to read:

- worker state and role posture
- objective and work-item state
- review and escalation posture
- bounded memory / preference continuity signals
- bounded evidence and delivery-relevant state

## Draft Outputs

If later realized, summary projection should be able to produce bounded summary seeds such as:

- `Cell summary seed`
- escalation summary seed
- delivery return seed
- continuity summary seed

These are runtime summary outputs, not product render objects.

## Distinction From Product Card UI

Runtime summary projection:

- owns the bounded truth extraction
- owns the reduction from richer local truth to summary-safe truth
- should remain neutral to product wording and component design

Product card UI:

- owns labels
- owns layout
- owns page hierarchy
- owns downstream product vocabulary

The two must not be collapsed.

## Non-Goals

This draft does not define:

- KPI dashboards
- event-history analytics
- budget reporting
- Secretary UI
- channel summaries
- protocol export semantics

## Net Draft Judgment

Summary projection is a plausible runtime capability because it creates a lawful boundary between:

- detailed runtime-local truth
- and bounded upward summary truth

It should remain neutral runtime capability, while SoloCrew keeps product cards and management UI downstream.
