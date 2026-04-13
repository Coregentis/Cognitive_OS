# Runtime Test Scaffolds

## Purpose

This directory is reserved for later runtime-skeleton and minimal-loop tests.

At this phase, only the first in-memory execution baseline is implemented.
This directory now exists to hold neutral mother-runtime tests for that baseline.

Public verification note:

- the active `main` test tree includes the four `workforce-*.test.mjs` files listed below

## Later Intended Coverage

Current test buckets:

- `minimal-loop.test.mjs`
  - main-flow / E2E / golden-path coverage
  - repeated-run determinism coverage
- `failure-paths.test.mjs`
  - edge / failure-path coverage
- `workforce-schema-registry.test.mjs`
  - workforce schema compilation and registry / binding / export coverage
- `workforce-lifecycle.test.mjs`
  - worker lifecycle state machine and runtime service coverage
- `workforce-state-persistence.test.mjs`
  - in-memory and SQLite workforce persistence coverage
- `workforce-execution-contract.test.mjs`
  - execution contract-only boundary coverage

Current tests verify:

- service boundary wiring
- registry and binding usage
- minimal loop dry-run planning
- minimal in-memory execution for neutral scenarios
- working / episodic / semantic / evidence distinction
- ordered step outcomes and grouped object ids
- explicit object status transitions
- ordered event timeline
- confirm / evidence / reconcile summaries
- export-preparation summaries derived from frozen binding/export truth
- optional protocol export bundle generation for executed runs
- truthful omission reporting for unsupported protocol families
- locked-schema validation of supported trace / confirm exports
- export manifest / audit surface determinism
- bounded export error reporting for missing truth and validation failure paths
- explicit frozen-truth consultation
- progression toward the minimal cognitive loop
- workforce schema presence and truth alignment
- worker lifecycle legal and illegal transitions
- workforce persistence round-trip across in-memory and SQLite adapters
- execution bridge contracts without provider implementation leakage

## Test Commands

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
rm -rf .coverage-runtime && NODE_V8_COVERAGE=.coverage-runtime node --experimental-test-coverage --test tests/runtime/*.test.mjs --test-coverage-include='runtime/core/**/*.ts' --test-coverage-include='runtime/lifecycle/**/*.ts' --test-coverage-include='runtime/state/**/*.ts' --test-coverage-include='runtime/execution/**/*.ts' --test-coverage-include='runtime/harness/**/*.ts' --test-coverage-include='runtime/in-memory/**/*.ts' --test-coverage-include='runtime/export/**/*.ts' --test-coverage-include='tests/runtime/*.mjs'
```

Coverage output location:

- `.coverage-runtime/`
- stdout coverage summary from the Node test runner

Node requirement for these commands:

- `Node 22 LTS`

## What Is Not Here Yet

- full runtime completion tests
- product tests
- TracePilot tests
- provider integration tests
