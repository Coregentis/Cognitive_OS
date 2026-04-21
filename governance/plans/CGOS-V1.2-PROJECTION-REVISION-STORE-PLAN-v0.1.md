# CGOS V1.2 Projection Revision Store Plan v0.1

`doc_id: CGOS-V1.2-PROJECTION-REVISION-STORE-PLAN-v0.1`

## A. Purpose

This document plans whether the in-memory projection store needs support for
revision envelopes and evidence insufficiency detail.

## B. Store Options

| Option | Description | Pros | Cons | Decision |
|---|---|---|---|---|
| no store change, revision envelopes remain caller-managed | revision records stay outside store | simplest | weak retrieval consistency for revision lineage | not preferred |
| store revision envelopes as projection-adjacent records | store revision envelopes near projection summaries | keeps lineage queryable and project-scoped | requires additive store methods later | recommended |
| store evidence insufficiency details independently | separate store lane for detail records | maximum isolation | extra persistence surface | not preferred initially |
| store only as metadata inside projection summary envelope | embed everything into summary envelope metadata | fewer object families | risks overloading summary envelope semantics | possible fallback only |

## C. Recommended Approach

Recommended approach:

- store revision envelopes as projection-adjacent records
- keep evidence insufficiency details embedded or safely referenced inside the
  revision envelope unless a later independent store need becomes justified

## D. Guardrails

- no raw runtime-private persistence
- `project_id` consistency
- deterministic retrieval
- no execution state
- no queue semantics

## E. Decision

`CGOS_V1_2_PROJECTION_REVISION_STORE_PLAN_READY`
