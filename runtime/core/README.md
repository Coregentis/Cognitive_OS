# Coregentis Runtime Core Skeleton

## Purpose

This directory defines the first runtime core layer for the `v0.1` execution baseline.

It does not implement the full runtime.
It now contains:

- service interfaces
- first-pass in-memory service implementations
- orchestrator execution scaffolding

All of that remains limited to the minimal cognitive loop:

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
- `vsl-service.ts`
  - handles first-pass project-scoped continuity checkpoints, continuation-anchor recovery, and bounded replay / rollback / retention horizon metadata
- `runtime-orchestrator.ts`
  - stitches service interfaces into the current deterministic minimal-loop execution path
- `runtime-types.ts`
  - shared skeleton types aligned with frozen schema, registry, and binding layers
  - keeps registry authority classification separate from binding taxonomy

## Why This Is A Skeleton And Not Full Runtime Implementation

This phase is still skeleton-first and baseline-first by design.

It does not implement:

- full runtime behavior
- state transition engines
- policy evaluation logic
- full or generic binding reconstruction logic inside runtime core
- AEL realization
- full VSL realization
- PSG realization
- drift-resolution mechanics

The purpose is narrower:

- stabilize runtime service boundaries
- align those boundaries with frozen schemas, registry, and binding artifacts
- provide one deterministic in-memory execution baseline for the fresh-intent path and a bounded delta-intent / requirement-change path without skipping directly into full runtime realization
- expose one bounded frozen-truth-first MPLP reconstruction/export path adjacent to runtime core without claiming full protocol reconstruction

## Relation To Later AEL / VSL / PSG Realization

These interfaces intentionally leave room for later substrate realization.

Examples:

- activation-facing services are later candidates for AEL-backed realization
- durable stores and evidence records are later candidates for fuller VSL-backed realization beyond the current first-pass continuity slice
- graph-shaped cognitive and semantic structures are later candidates for PSG-backed realization

But none of that is implemented here.

## What Is Intentionally Deferred

This phase intentionally defers:

- production logic
- production persistence
- field-level protocol transformation
- full in-memory execution behavior beyond the current minimal fresh-intent and bounded change-aware baseline
- TracePilot/product concerns
- substrate implementation details

A narrow frozen-truth-first reconstruction/export path now exists under
`runtime/export/`, but it remains intentionally limited:

- it reconstructs/exports only the currently lawful `Confirm` / `Trace` subset
- it reports `Context` / `Plan` omissions explicitly when canonical
  reconstruction is not currently justified by frozen truth
- it does not imply full protocol completeness or protocol promotion

It also does not treat:

- registry authority classification as binding classification
- runtime dry-run planning as runtime execution
- substrate hints as substrate implementation

This directory is therefore still a mother-runtime skeleton-first runtime core, even though the first deterministic runnable baseline now exists.
