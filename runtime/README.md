# Coregentis Runtime

## Purpose

This directory now contains the first executable mother-runtime baseline for `Cognitive_OS`.

The baseline is still intentionally minimal:

- deterministic
- fixture-driven
- neutral
- frozen-truth-disciplined
- bounded to the minimal cognitive loop plus P0-A workforce persistence

The workforce additions remain intentionally bounded:

- neutral organization-runtime only
- contract-first
- no provider implementation
- no full VSL / PSG / correction runtime
- publicly visible on `main` as part of the P0-A mother-runtime baseline

## Included Layers

- Public verification note:
  - the active `main` runtime tree includes `core/`, `execution/`, `export/`, `harness/`, `in-memory/`, `lifecycle/`, `learning/`, and `state/`

- `core/`
  - runtime service interfaces and first-pass implementations
- `lifecycle/`
  - neutral worker lifecycle state machine and runtime service
- `state/`
  - workforce persistence ports and adapters
- `execution/`
  - execution bridge contracts and event envelopes only
- `learning/`
  - bounded P0-B anchor, correction-capture, and preference write-back glue
- `export/`
  - minimal MPLP export and reconstruction path for the current execution baseline
- `in-memory/`
  - temporary in-memory stores
- `harness/`
  - scenario loader and minimal loop execution harness

## What This Baseline Can Do

It can execute the two neutral mother-runtime fixtures:

- `fresh-intent`
- `requirement-change-midflow`

through the minimal loop:

`Form -> Place -> Activate -> Confirm -> Trace -> Reconcile -> Consolidate`

It can also host the first workforce P0-A foundation surfaces:

- worker lifecycle state transitions
- workforce state persistence ports
- SQLite-backed workforce state persistence
- execution request/result/event contracts without provider realization

It now also exposes the bounded P0-B glue surfaces:

- action dispatch over registered bounded handlers
- objective anchor capture and bounded comparison
- correction capture without autonomous learning
- preference write-back without a full correction loop

Projection handoff readiness is now documented separately under `governance/`
to keep downstream integration guidance outside the executable runtime files.

The execution result is now more inspectable and audit-oriented, including:

- ordered step outcomes
- created object ids grouped by type
- explicit status transitions
- neutral event timeline
- store snapshot by layer
- confirm summary
- evidence summary
- reconcile summary
- frozen-truth consultation summary
- export-preparation summary derived from frozen binding and export truth
- optional protocol export bundle with:
  - export manifest / audit surface
  - exported artifacts by protocol family
  - explicit omission reporting for unsupported families
  - locked-schema validation summary with family-level disposition
  - bounded export error reporting
  - frozen-truth export summary

## Current Gate-Oriented Verification Commands

The canonical repository-visible command surface is the `package.json` runtime scripts.
The direct Node commands below are equivalent direct invocations only.

Canonical runtime test command:

```bash
npm run test:runtime
```

Canonical targeted workforce test command:

```bash
npm run test:runtime:workforce
```

Equivalent direct command only:

```bash
node --test tests/runtime/*.test.mjs
```

Canonical runtime coverage command:

```bash
npm run coverage:runtime
```

Equivalent direct command only:

```bash
rm -rf .coverage-runtime && NODE_V8_COVERAGE=.coverage-runtime node --experimental-test-coverage --test tests/runtime/*.test.mjs --test-coverage-include='runtime/core/**/*.ts' --test-coverage-include='runtime/lifecycle/**/*.ts' --test-coverage-include='runtime/state/**/*.ts' --test-coverage-include='runtime/execution/**/*.ts' --test-coverage-include='runtime/learning/**/*.ts' --test-coverage-include='runtime/harness/**/*.ts' --test-coverage-include='runtime/in-memory/**/*.ts' --test-coverage-include='runtime/export/**/*.ts' --test-coverage-include='tests/runtime/*.mjs'
```

Coverage output location:

- `.coverage-runtime/`

Node requirement for these commands:

- `Node 22 LTS`

## What This Baseline Does Not Claim

This is not:

- full runtime completion
- full AEL
- full VSL
- full PSG
- full correction runtime
- full workforce graph/runtime realization
- provider-specific execution bridges
- full policy engine
- full confirm workflow
- full trace export
- full MPLP artifact export completeness
- full MPLP interoperability guarantee
- full reconcile engine
- any product or TracePilot runtime

## Projection Revision / Evidence Insufficiency Draft

`Cognitive_OS` now has a draft governance-level abstraction review for generic
projection revision envelopes and evidence insufficiency detail.

This is not runtime implementation. It introduces no schema change, no
provider/channel execution, no approve/reject/dispatch/execute behavior, and
no downstream product-specific semantics.

## Durable Lifecycle Continuity Planning

Durable lifecycle continuity interface scaffold is present for projection-safe
continuity projections, pending review projections, and continuity snapshots.

Full durable persistence remains out of scope.
Verification is complete.
The available neutral surfaces are lifecycle continuity projections, pending
review projections, and continuity snapshot projections.
Full durable persistence, execution, approval, queue, schema, and MPLP
changes remain out of scope.

## Prepared-Action Interface Skeleton

Prepared-action surfaces are currently neutral interface skeletons only.
They exist to define projection-safe downstream consumption boundaries and are
not executable runtime behaviors.
Prepared-action work is now scoped to minimal neutral scaffold planning only.
Execution, approval, dispatch, provider/channel, queue, and runtime state
mutation remain out of scope.
