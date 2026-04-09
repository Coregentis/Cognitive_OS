# Coregentis Runtime Core Skeleton

## Purpose

This directory defines the first runtime-skeleton interface layer for Coregentis.

It does not implement the full runtime.
It defines the service boundaries the later mother-runtime implementation will need in order to run the minimal cognitive loop:

`Form -> Place -> Activate -> Confirm -> Trace -> Reconcile -> Consolidate`

## Service Roles

- `registry-service.ts`
  - reads frozen object and relationship classifications
- `binding-service.ts`
  - reads frozen binding and export rules
- `form-service.ts`
  - handles intake capture and intent formation
- `memory-service.ts`
  - handles working/episodic/semantic placement and memory promotion inspection
- `activation-service.ts`
  - handles bounded activation and action-unit creation
- `policy-service.ts`
  - handles policy evaluation and confirm/suppression gating decisions
- `confirm-service.ts`
  - handles confirm-gate creation and resolution
- `trace-service.ts`
  - handles trace evidence and decision record creation
- `reconcile-service.ts`
  - handles drift/conflict record creation and later reconcile assessment
- `consolidation-service.ts`
  - handles learning candidate and memory promotion record creation
- `runtime-orchestrator.ts`
  - stitches service interfaces into a later minimal-loop execution path
- `runtime-types.ts`
  - shared skeleton types aligned with frozen schema, registry, and binding layers
  - keeps registry authority classification separate from binding taxonomy

## Why This Is A Skeleton And Not Full Runtime Implementation

This phase is interface-first by design.

It does not implement:

- full runtime behavior
- state transition engines
- policy evaluation logic
- binding reconstruction logic
- AEL realization
- VSL realization
- PSG realization
- drift-resolution mechanics

The purpose is narrower:

- stabilize runtime service boundaries
- align those boundaries with frozen schemas, registry, and binding artifacts
- prepare the next phase without skipping directly into behavior

## Relation To Later AEL / VSL / PSG Realization

These interfaces intentionally leave room for later substrate realization.

Examples:

- activation-facing services are later candidates for AEL-backed realization
- durable stores and evidence records are later candidates for VSL-backed realization
- graph-shaped cognitive and semantic structures are later candidates for PSG-backed realization

But none of that is implemented here.

## What Is Intentionally Deferred

This phase intentionally defers:

- production logic
- production persistence
- field-level protocol transformation
- full in-memory execution behavior
- TracePilot/product concerns
- substrate implementation details

It also does not treat:

- registry authority classification as binding classification
- runtime dry-run planning as runtime execution
- substrate hints as substrate implementation

This directory is therefore a mother-runtime skeleton only.
