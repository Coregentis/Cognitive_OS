# Coregentis Runtime

## Purpose

This directory now contains the first executable mother-runtime baseline for `Cognitive_OS`.

The baseline is still intentionally minimal:

- in-memory only
- deterministic
- fixture-driven
- neutral
- frozen-truth-disciplined

## Included Layers

- `core/`
  - runtime service interfaces and first-pass implementations
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
  - exported artifacts by protocol family
  - explicit omission reporting for unsupported families
  - locked-schema validation summary
  - frozen-truth export summary

## Current Gate-Oriented Verification Commands

The canonical repository-visible command surface is the `package.json` runtime scripts.
The direct Node commands below are equivalent direct invocations only.

Canonical runtime test command:

```bash
npm run test:runtime
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
rm -rf .coverage-runtime && NODE_V8_COVERAGE=.coverage-runtime node --experimental-test-coverage --test tests/runtime/*.test.mjs --test-coverage-include='runtime/core/**/*.ts' --test-coverage-include='runtime/harness/**/*.ts' --test-coverage-include='runtime/in-memory/**/*.ts' --test-coverage-include='tests/runtime/*.mjs'
```

Coverage output location:

- `.coverage-runtime/`

Node requirement for these commands:

- `Node >= 25.0.0`

## What This Baseline Does Not Claim

This is not:

- full runtime completion
- full AEL
- full VSL
- full PSG
- full policy engine
- full confirm workflow
- full trace export
- full MPLP artifact export completeness
- full MPLP interoperability guarantee
- full reconcile engine
- any product or TracePilot runtime
