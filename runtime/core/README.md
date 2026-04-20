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
- `ael-service.ts`
  - handles first-pass runtime-private governed activation assessment over the
    bounded action path
- `policy-service.ts`
  - handles policy evaluation and confirm/suppression gating decisions
- `confirm-service.ts`
  - handles confirm-gate creation and resolution
- `trace-service.ts`
  - handles trace evidence and decision record creation
- `reconcile-service.ts`
  - handles drift/conflict record creation, delta-drift impact assessment, and later reconcile assessment
- `consolidation-service.ts`
  - handles first-pass governed learning assessment, learning candidate
    creation, and memory promotion record creation
- `vsl-service.ts`
  - handles first-pass project-scoped continuity checkpoints, continuation-anchor recovery, and bounded replay / rollback / retention horizon metadata
- `psg-service.ts`
  - handles first-pass project-scoped semantic node/edge state, lineage/evidence-aware relation ingestion, and deterministic graph inspection
- `runtime-orchestrator.ts`
  - stitches service interfaces into the current deterministic minimal-loop execution path
- `runtime-types.ts`
  - shared skeleton types aligned with frozen schema, registry, and binding layers
  - keeps registry authority classification separate from binding taxonomy
- `projection-types.ts`
  - defines neutral projection-safe contract types for state exposure, evidence
    posture, non-executing recommendation, and projection summary envelopes
- `projection-service.ts`
  - builds deterministic projection-safe summaries without provider or channel
    execution, approve/reject/dispatch/execute semantics, product-specific
    naming, or raw runtime internals as downstream API

## Why This Is A Skeleton And Not Full Runtime Implementation

This phase is still skeleton-first and baseline-first by design.

It does not implement:

- full runtime behavior
- state transition engines
- policy evaluation logic
- full or generic binding reconstruction logic inside runtime core
- full AEL realization
- full VSL realization
- full PSG realization
- full governed learning realization
- drift-resolution mechanics
- full drift/impact propagation

The purpose is narrower:

- stabilize runtime service boundaries
- align those boundaries with frozen schemas, registry, and binding artifacts
- provide one deterministic in-memory execution baseline for the fresh-intent path and a bounded delta-intent / requirement-change path without skipping directly into full runtime realization
- expose one bounded frozen-truth-first MPLP reconstruction/export path adjacent to runtime core without claiming full protocol reconstruction

## Relation To Later AEL / VSL / PSG Realization

These interfaces intentionally leave room for later substrate realization.

Examples:

- activation-facing services now include a first-pass runtime-private AEL
  assessment, but not provider execution, dispatch execution, or full policy
  richness
- durable stores and evidence records are later candidates for fuller VSL-backed realization beyond the current first-pass continuity slice
- graph-shaped cognitive and semantic structures now have a first-pass runtime-private PSG substrate, but not full PSG realization, impact propagation, or graph export semantics
- delta-intent change handling now has a first-pass drift/impact enrichment slice using prior VSL continuity anchors and direct PSG relation discovery, but not rollback, compensation, or full conflict resolution
- consolidation-facing services now include first-pass governed learning
  candidate capture, but not autonomous policy mutation, MPLP learning-sample
  export, model training, or downstream preference projection

Only bounded first-pass AEL / VSL / PSG / governed-learning substrate slices
are now implemented here.

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
