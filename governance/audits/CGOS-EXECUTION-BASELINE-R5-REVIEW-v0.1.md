# CGOS-EXECUTION-BASELINE-R5-REVIEW-v0.1

## Purpose

This note records the R5 minimal MPLP artifact export and reconstruction pass for the neutral `Cognitive_OS` mother-runtime baseline.

## What Minimal Export / Reconstruction Path Now Exists

The runtime baseline can now attach an optional protocol export bundle after an executed run.

Current implementation surface:

- `runtime/export/protocol-export.ts`
- `runtime/export/export-support.ts`
- `runtime/harness/minimal-loop-harness.ts`

The bundle is:

- deterministic
- inspectable
- derived from current runtime results plus frozen truth
- bounded to the mother-runtime repository
- non-product-shaped

The bundle now exposes:

- export metadata and export summary
- exported artifacts grouped by protocol family
- explicit omission reporting grouped by protocol family
- locked-schema validation summary
- frozen-truth export summary

## Supported MPLP Artifact Families In R5

Currently supported:

- `Trace`
  - exported for both current scenarios
  - reconstructed from `trace-evidence` plus execution-subject lineage
- `Confirm`
  - exported only when confirm semantics actually exist
  - reconstructed from `confirm-gate` plus indirect decision lineage where available

Currently omitted:

- `Context`
- `Plan`

## Why Context / Plan Remain Omitted

R5 does not invent a canonical MPLP `Context` or `Plan` artifact just to make the bundle look more complete.

They remain omitted because:

- no frozen binding entry authorizes direct `Context` reconstruction from the current runtime object layer
- no frozen binding entry authorizes direct `Plan` reconstruction from the current runtime object layer
- the current runtime result does not expose the required `Context` fields such as `root`, `title`, and lifecycle `status` as frozen protocol truth
- the current minimal loop plan is an internal runtime plan and is not treated as a canonical MPLP `Plan`

Important nuance:

- `Trace.context_id` currently reuses the neutral project-scope identifier as a stable host-scope anchor because the trace schema requires `context_id`
- this does **not** mean Coregentis `Project` is exported as MPLP `Context`
- canonical `Context` export remains intentionally deferred

## How Binding / Export Truth Constrains Export

R5 export stays inside frozen truth:

- locked protocol schema paths come from `imports/mplp-lock.yaml`
- export eligibility comes from `bindings/coregentis-export-rules.v0.yaml`
- reconstructability boundaries come from `bindings/mplp-coregentis-binding-matrix.v0.yaml`

Practical consequences in R5:

- `trace-evidence` and `confirm-gate` may export only because frozen truth marks them as shallow reconstructable and protocol-compliant export candidates
- `intent` and `delta-intent` remain protocol-adjacent but not directly exportable
- internal objects such as `episode`, `action-unit`, `decision-record`, `drift-record`, and `conflict-case` may contribute indirectly, but are not exported as top-level MPLP artifacts
- unsupported families are omitted explicitly rather than silently fabricated

## What Validation Discipline Exists

R5 does not add a full generic validator framework.

It does add a locked-schema validation path that:

- resolves locked MPLP module schemas from the import lock
- resolves the schema refs needed by the current R5 export surface
- validates required fields
- validates object shape and `additionalProperties: false`
- validates enum, pattern, array, integer, boolean, and date-time constraints used by the current exported artifacts

This validation path currently covers the exported `Trace` and `Confirm` artifacts produced in R5.

## What Tests Were Added / Strengthened

Main flow coverage continues in:

- `tests/runtime/minimal-loop.test.mjs`

R5 strengthened it to verify:

- export bundle generation for `fresh-intent`
- export bundle generation for `requirement-change-midflow`
- `Trace` export presence for both scenarios
- `Confirm` export presence only where confirm semantics exist
- explicit omission of `Context` and `Plan`
- deterministic export bundle equality across repeated runs
- locked-schema validation summary presence and success
- export truth summary anchored to the frozen import lock and frozen truth consultation
- absence of Pilot / projection / DTO-shaped key contamination in the export surface

Failure-path coverage remains in:

- `tests/runtime/failure-paths.test.mjs`

## Canonical Commands

Canonical runtime test command:

```bash
npm run test:runtime
```

Canonical runtime coverage command:

```bash
npm run coverage:runtime
```

Equivalent direct coverage command:

```bash
rm -rf .coverage-runtime && NODE_V8_COVERAGE=.coverage-runtime node --experimental-test-coverage --test tests/runtime/*.test.mjs --test-coverage-include='runtime/core/**/*.ts' --test-coverage-include='runtime/harness/**/*.ts' --test-coverage-include='runtime/in-memory/**/*.ts' --test-coverage-include='tests/runtime/*.mjs'
```

## Current Coverage Evidence

Measured runtime coverage after R5:

- line coverage: `91.35%`
- branch coverage: `78.40%`
- function coverage: `91.53%`

Gate comparison:

- executable-code overall coverage >= `75%`: **met**
- main-flow coverage = `100%`: **met**
- edge / failure-path coverage >= `50%`: **still met by the retained failure-path suite and passing coverage baseline**

## What Remains Intentionally Deferred

- canonical MPLP `Context` export
- canonical MPLP `Plan` export
- full MPLP artifact export completeness
- full MPLP interoperability guarantee
- full generic schema validator framework
- full AEL / VSL / PSG realization
- full rollback / compensation behavior
- full policy engine richness
- product-facing contracts
- product / projection / Pilot runtime preparation

## Boundary Confirmation

No product / Pilot contamination was introduced in this R5 pass.

Specifically:

- no TracePilot logic was added
- no product-facing DTOs were added
- no UI or product API surface was added
- no projection-specific vocabulary was introduced into the export contract
