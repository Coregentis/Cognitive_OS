# CGOS-EXECUTION-BASELINE-R6-REVIEW-v0.1

## Purpose

This note records the R6 export-integrity and seal-readiness hardening pass for the neutral `Cognitive_OS` execution baseline.

## What Export-Integrity Hardening Was Added

R6 keeps the accepted R5 export scope, but hardens the export layer into a more auditable and testable surface.

The export bundle now includes:

- deterministic export metadata
- explicit `export_manifest`
- exported artifact ids grouped by protocol family
- omitted targets grouped by protocol family with stable omission codes and reason codes
- per-artifact validation result records
- family-level validation disposition summaries
- bounded `export_errors` for missing frozen export truth or validation failure
- explicit frozen-truth source summary

## What Export Manifest / Audit Surface Now Exists

`export_manifest` now exposes:

- `bundle_status`
- `exported_artifact_ids_by_type`
- `exported_source_object_ids_by_type`
- `runtime_source_object_refs_by_artifact_id`
- `omitted_targets_by_type`
- `family_validation_disposition_by_type`
- `export_error_codes`
- `frozen_truth_sources_consulted`

This keeps the export layer deterministic, neutral, and bounded to the currently supported families.

## How Omission Semantics Are Now Expressed

Omissions remain truthful and explicit.

R6 strengthens them by adding:

- stable omission codes
- stable reason codes
- family grouping in both the manifest and omission records
- explicit blocked-vs-omitted-vs-invalid separation in family validation disposition

Current omitted families remain:

- `Context`
- `Plan`

`Confirm` remains omitted in `fresh-intent` because confirm semantics do not exist in that path.

## How Validation Discipline Was Strengthened

R5 already validated exported `Trace` and `Confirm` artifacts against locked MPLP schemas.

R6 strengthens this by:

- carrying `artifact_id` and source runtime refs into validation records
- recording validation disposition per validated artifact
- adding bundle-level family disposition summaries
- surfacing validation failure as both:
  - an explicit omission entry
  - a bounded `export_errors` record

Validation still remains intentionally minimal and schema-truth-focused.
R6 does not introduce a full generic validator framework.

## What Export-Focused Tests Were Added / Strengthened

Main flow tests in `tests/runtime/minimal-loop.test.mjs` were strengthened to verify:

- export manifest presence and structure
- deterministic artifact ids and runtime source refs
- stable omission reason codes for `Context`, `Plan`, and confirm absence
- family-level validation disposition summaries
- empty `export_errors` surface on the accepted main flows
- stronger deterministic equality checks for:
  - `export_metadata`
  - `export_manifest`
  - `exported_artifacts_by_type`
  - `omitted_artifacts_by_type`
  - `export_validation_summary`
  - `export_truth_summary`

Failure-path tests in `tests/runtime/failure-paths.test.mjs` were expanded to cover:

- missing export-rule truth for an otherwise exportable `Trace`
- missing binding truth for an otherwise exportable `Confirm`
- export validation failure surfaced as a bounded error

## Canonical Commands

Canonical runtime test command:

```bash
npm run test:runtime
```

Canonical runtime coverage command:

```bash
npm run coverage:runtime
```

Equivalent direct coverage command only:

```bash
rm -rf .coverage-runtime && NODE_V8_COVERAGE=.coverage-runtime node --experimental-test-coverage --test tests/runtime/*.test.mjs --test-coverage-include='runtime/core/**/*.ts' --test-coverage-include='runtime/harness/**/*.ts' --test-coverage-include='runtime/in-memory/**/*.ts' --test-coverage-include='tests/runtime/*.mjs'
```

Node requirement:

- `Node >= 25.0.0`

## Current Test / Coverage Evidence

Executed test command:

```bash
npm run test:runtime
```

Executed coverage command:

```bash
npm run coverage:runtime
```

Measured runtime coverage after R6:

- line coverage: `89.99%`
- branch coverage: `80.35%`
- function coverage: `91.04%`

Gate comparison:

- executable-code overall coverage >= `75%`: **met**
- main-flow coverage = `100%`: **met**
- edge / failure-path coverage >= `50%`: **met**

## What Remains Intentionally Deferred

- canonical MPLP `Context` export
- canonical MPLP `Plan` export
- full MPLP artifact completeness
- full MPLP interoperability guarantee
- full generic validator framework
- full policy engine
- full rollback / compensation behavior
- full AEL / VSL / PSG realization
- product-facing contracts
- product / projection / Pilot runtime preparation

## Boundary Confirmation

No product / Pilot contamination was introduced in this R6 pass.

Specifically:

- no TracePilot logic was added
- no product-facing DTOs were added
- no UI or product API surface was added
- no projection-specific vocabulary was introduced into the export contract
