# CGOS-PROJECTION-HANDOFF-SURFACE-INVENTORY-v0.1

## Document Control

- Document ID: `CGOS-PROJECTION-HANDOFF-SURFACE-INVENTORY-v0.1`
- Status: `Projection Handoff Baseline`
- Authority: `Mother-runtime surface inventory`
- Scope: `P0-A and bounded P0-B runtime surfaces available to downstream projection work`
- Phase Constraint: `This inventory does not authorize provider implementation, product workflow ownership, or direct product runtime coding inside Cognitive_OS`

## Purpose

This note inventories the current mother-runtime surfaces that a downstream SoloCrew Projection layer may read, wrap, or adapt.

It distinguishes between:

- schema truth
- contract-only runtime surfaces
- bounded implementation surfaces
- explicitly absent surfaces

## Schema Surfaces

### Workforce schemas

Available under:

- `schemas/coregentis/v0/workforce/agent-group.schema.json`
- `schemas/coregentis/v0/workforce/agent-worker.schema.json`
- `schemas/coregentis/v0/workforce/role-profile.schema.json`
- `schemas/coregentis/v0/workforce/objective.schema.json`
- `schemas/coregentis/v0/workforce/work-item.schema.json`
- `schemas/coregentis/v0/workforce/review-cycle.schema.json`
- `schemas/coregentis/v0/workforce/memory-profile.schema.json`
- `schemas/coregentis/v0/workforce/preference-profile.schema.json`

Role for downstream projection:

- source-of-truth object naming
- source-of-truth required fields
- source-of-truth mother-runtime neutrality boundary

### Registry / binding / export truth

Available under:

- `registry/coregentis-object-registry.v0.yaml`
- `bindings/mplp-coregentis-binding-matrix.v0.yaml`
- `bindings/coregentis-export-rules.v0.yaml`
- `runtime/core/runtime-types.ts`

Role for downstream projection:

- object type enumeration
- authority and layer interpretation
- exportability constraints
- binding class expectations

## P0-A Runtime Surfaces

### Contract-only execution surfaces

Available under:

- `runtime/execution/execution-envelope.ts`
- `runtime/execution/execution-events.ts`
- `runtime/execution/execution-bridge.ts`

Classification:

- contract-only

Projection may:

- build adapters around the envelope and event shapes
- supply downstream execution implementations outside this repository

Projection may not:

- treat these files as provider implementations

### Worker lifecycle surfaces

Available under:

- `runtime/lifecycle/worker-state-machine.ts`
- `runtime/lifecycle/worker-lifecycle.ts`

Classification:

- bounded implementation

Projection may:

- consume lifecycle states and legal transitions
- wrap worker lifecycle operations in projection-facing workflow

Projection may not:

- reinterpret lifecycle state law in product code as if product were authoritative

### State persistence surfaces

Available under:

- `runtime/state/state-store-port.ts`
- `runtime/state/in-memory-state-store.ts`
- `runtime/state/sqlite-state-store.ts`
- `runtime/state/worker-store.ts`
- `runtime/state/objective-store.ts`
- `runtime/state/memory-store.ts`
- `runtime/state/preference-store.ts`

Classification:

- bounded implementation

Projection may:

- read/write workforce state via these stores
- choose the adapter appropriate to the environment

Projection may not:

- treat these stores as a full VSL realization

## Bounded P0-B Runtime Surfaces

### Action dispatch

Available under:

- `runtime/execution/action-dispatcher.ts`

Classification:

- bounded implementation

Role:

- register bounded handlers
- dispatch request envelopes
- return `success`, `failure`, or `unsupported`

### Objective anchor

Available under:

- `runtime/learning/objective-anchor.ts`

Classification:

- bounded implementation

Role:

- capture objective anchor snapshots
- compare current objective state to a bounded anchor

### Correction capture

Available under:

- `runtime/learning/correction-capture.ts`

Classification:

- bounded implementation

Role:

- capture structured correction records
- expose bounded correction read/list/status transitions

### Preference write-back

Available under:

- `runtime/learning/preference-writeback.ts`

Classification:

- bounded implementation

Role:

- apply local preference profile updates
- write back bounded preference changes from captured correction data

### Orchestrator facades

Available under:

- `runtime/core/runtime-orchestrator.ts`

Bounded facade methods:

- `dispatch_bounded_action()`
- `anchor_objective()`
- `compare_objective_to_anchor()`
- `capture_correction()`
- `writeback_preference()`

Classification:

- bounded orchestration glue

## Explicitly Absent Surfaces

The following remain absent by design:

- provider bridge implementation
- full PSG runtime
- full correction runtime
- channel runtime
- budget runtime
- product projection logic
- product workflow ownership
- application shell logic

## Downstream Interpretation Rule

Projection should treat the surfaces above as:

- stable enough to integrate against for bounded projection work
- still mother-runtime authority, not product authority

Projection must own:

- product naming
- adapter composition
- product workflow packaging
- provider configuration and execution implementation
