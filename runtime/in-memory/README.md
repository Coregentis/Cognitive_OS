# Coregentis In-Memory Scaffold

## Purpose

This directory provides minimal in-memory scaffolds for the first executable minimal loop baseline.

These stores are:

- non-production
- in-memory only
- intentionally shallow

## Included Scaffolds

- `working-store.ts`
  - placeholder store for working-layer objects
- `episodic-store.ts`
  - placeholder store for replayable episodic objects
- `semantic-store.ts`
  - placeholder store for durable semantic objects
- `evidence-store.ts`
  - placeholder store for evidence-oriented records
  - temporarily serves as the event/evidence scaffold for this phase
- `vsl-store.ts`
  - first-pass project-scoped continuity store for continuation anchors and bounded replay / rollback / retention metadata
- `psg-store.ts`
  - first-pass project-scoped semantic graph store for runtime-private node and edge state
- `projection-store.ts`
  - project-isolated storage for projection summary envelopes only
  - does not expose raw runtime storage or provide durability guarantees
  - project-scoped storage for projection-adjacent revision envelopes
  - project-scoped storage for lifecycle continuity projections
  - project-scoped storage for pending review projections
  - project-scoped storage for continuity snapshot projections
  - supports project-scoped retrieval and listing of revision envelopes
  - does not expose raw runtime-private storage, queue semantics, or execution
    state

## What This Is Not

This is not a complete VSL realization.

It does not implement:

- persistence guarantees
- retention policies
- replay engines
- promotion/demotion mechanics
- concurrency control
- audit-grade storage guarantees

The only role of these files is to provide a minimal scaffold so later skeleton work can hold objects in memory without pretending production durability already exists.

The new `vsl-store.ts` is still bounded to:

- runtime-instance in-memory continuity checkpoints
- project-scoped continuation recovery
- metadata-only replay / rollback / retention horizons

It is not a replay engine, rollback engine, or production storage layer.

The new `psg-store.ts` is still bounded to:

- runtime-instance in-memory project graphs
- runtime-private node and relation inspection
- lineage/evidence-aware graph state capture

It is not a graph database commitment, impact engine, or protocol export layer.

There is intentionally no separate event-store scaffold yet.
For this phase only, `evidence-store.ts` is the temporary event/evidence scaffold.
That is a skeleton convenience, not a full eventing design and not a completed VSL boundary.
