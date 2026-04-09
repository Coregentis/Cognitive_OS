# Runtime Test Scaffolds

## Purpose

This directory is reserved for later runtime-skeleton and minimal-loop tests.

At this phase, only the first in-memory execution baseline is implemented.
This directory now exists to hold neutral mother-runtime tests for that baseline.

## Later Intended Coverage

Current test buckets:

- `minimal-loop.test.mjs`
  - main-flow / E2E / golden-path coverage
  - repeated-run determinism coverage
- `failure-paths.test.mjs`
  - edge / failure-path coverage

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
- explicit frozen-truth consultation
- progression toward the minimal cognitive loop

## Test Commands

Canonical runtime test command:

```bash
npm run test:runtime
```

Equivalent direct command:

```bash
node --test tests/runtime/*.test.mjs
```

Canonical runtime coverage command:

```bash
npm run coverage:runtime
```

Equivalent direct command:

```bash
rm -rf .coverage-runtime && NODE_V8_COVERAGE=.coverage-runtime node --experimental-test-coverage --test tests/runtime/*.test.mjs --test-coverage-include='runtime/core/**/*.ts' --test-coverage-include='runtime/harness/**/*.ts' --test-coverage-include='runtime/in-memory/**/*.ts' --test-coverage-include='tests/runtime/*.mjs'
```

Coverage output location:

- `.coverage-runtime/`
- stdout coverage summary from the Node test runner

Node requirement for these commands:

- `Node >= 25.0.0`

## What Is Not Here Yet

- full runtime completion tests
- product tests
- TracePilot tests
