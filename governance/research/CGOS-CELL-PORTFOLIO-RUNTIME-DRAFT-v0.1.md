# CGOS-CELL-PORTFOLIO-RUNTIME-DRAFT-v0.1

## Document Control

- Document ID: `CGOS-CELL-PORTFOLIO-RUNTIME-DRAFT-v0.1`
- Status: `Runtime-Family Draft`
- Authority: `Mother-runtime research draft responding to SoloCrew structural constitution`
- Scope: `Draft runtime-family meaning for Cell and Portfolio only`
- Phase Constraint: `Docs-only. No schema, registry, or runtime implementation is created by this note.`

## Purpose

This note drafts `Cell` and `Portfolio` as possible future `Cognitive_OS` runtime-family objects.

They are drafted here because SoloCrew now needs:

- a first valid operating unit smaller than a portfolio
- a later expansion unit above a single `Cell`

This note does not make either object:

- an MPLP protocol object
- a product DTO
- an implemented runtime surface

## Runtime-Family Classification

If later promoted into `Cognitive_OS`, both objects should be treated as:

- `coregentis_private_runtime`
- organization-family or governance-adjacent runtime objects
- runtime-family objects inside the mother-runtime boundary

They are not candidates for direct MPLP equivalence in this draft.

## Why Existing Objects Are Not Enough Forever

Current `Cognitive_OS` already has:

- `project`
- `agent-group`
- `agent-worker`
- `objective`
- `work-item`
- `review-cycle`
- `memory-profile`
- `preference-profile`

These are enough for the sealed `v0.1` SoloCrew baseline.

They are not obviously enough for later structural waves because:

- `agent-group` is crew grouping, not necessarily the whole operating unit
- `project` is the broadest current scoping object and is too coarse to stand in for every later `Cell`
- there is no explicit runtime-family concept yet for multi-cell aggregation or portfolio coordination

## Draft: Cell

### Role

`Cell` is the bounded runtime-family operating unit that groups one coherent business/work unit inside a broader project scope.

### What Cell Should Own

If later realized in runtime, `Cell` should own or govern references to:

- one active crew grouping or equivalent worker topology surface
- one active objective set
- one review rhythm or review governance posture
- one bounded execution context
- one bounded memory / evidence continuity scope
- optional pack mounts

### What Cell Should Relate To

Likely bounded relationships:

- `project` contains or scopes `cell`
- `cell` governs or references `agent-group`
- `cell` governs or references `objective`
- `cell` governs or references `review-cycle`
- `cell` references memory and preference continuity surfaces

This draft intentionally avoids locking the exact relationship vocabulary into registry law yet.

### What Cell Should Not Be

`Cell` should not be:

- a product UI card
- a portfolio dashboard tile
- a direct replacement for `agent-group`
- a container for every product constitution object by default

### Product Boundary Note

The following may still stay downstream even if `Cell` later exists as a runtime-family object:

- `Cell Charter`
- `Delivery Contract`
- product-specific console state
- product wording and UI packaging

## Draft: Portfolio

### Role

`Portfolio` is the bounded runtime-family aggregation scope over one or more `Cell`s.

It is a later runtime-family concern than `Cell`.

### What Portfolio Should Own

If later realized in runtime, `Portfolio` should own or govern references to:

- participating `Cell`s
- portfolio-level prioritization posture
- cross-cell coordination or escalation context
- later bounded management summary inputs

### What Portfolio Should Not Be

`Portfolio` should not be:

- a broad KPI cockpit
- an enterprise analytics warehouse
- a Secretary UI
- a product management dashboard

### Expansion Rule

`Portfolio` should remain a later layer.
It should not become a day-one requirement for creating a valid single `Cell`.

## Non-Goals

This draft does not define:

- exact schemas
- registry entries
- storage formats
- multi-cell execution logic
- management UI objects
- protocol promotion

## Net Draft Judgment

The bounded runtime-family direction is:

- `Cell` is the earlier and tighter runtime-family operating unit candidate
- `Portfolio` is the later and broader runtime-family aggregation candidate
- both should remain `Cognitive_OS` runtime-family concepts if they move upward
- neither should be confused with MPLP protocol objects or SoloCrew UI surfaces
