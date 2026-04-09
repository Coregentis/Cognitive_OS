# Coregentis In-Memory Scaffold

## Purpose

This directory provides minimal in-memory scaffolds for the later minimal loop harness.

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

There is intentionally no separate event-store scaffold yet.
For this phase only, `evidence-store.ts` is the temporary event/evidence scaffold.
That is a skeleton convenience, not a full eventing design and not a completed VSL boundary.
