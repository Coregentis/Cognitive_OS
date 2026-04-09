# CGOS-EXECUTION-BASELINE-R6A-REVIEW-v0.1

## Purpose

This note records the R6a narrow coverage-gate correction pass for the accepted R6 execution baseline.

## What Coverage-Gate Gap Existed After R6

After R6, the canonical runtime coverage command did not explicitly include `runtime/export/**/*.ts` in the repository-visible runtime executable-code coverage surface.

That created a gate-evidence gap because the export layer was executable runtime code and should have been declared in the canonical coverage denominator explicitly.

## What Was Corrected

`runtime/export/**/*.ts` is now included explicitly in the canonical runtime coverage surface in:

- `package.json`
- `runtime/README.md`
- `tests/runtime/README.md`
- `governance/audits/CGOS-EXECUTION-BASELINE-R6-REVIEW-v0.1.md`

This pass also adds this audit note:

- `governance/audits/CGOS-EXECUTION-BASELINE-R6A-REVIEW-v0.1.md`

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
rm -rf .coverage-runtime && NODE_V8_COVERAGE=.coverage-runtime node --experimental-test-coverage --test tests/runtime/*.test.mjs --test-coverage-include='runtime/core/**/*.ts' --test-coverage-include='runtime/harness/**/*.ts' --test-coverage-include='runtime/in-memory/**/*.ts' --test-coverage-include='runtime/export/**/*.ts' --test-coverage-include='tests/runtime/*.mjs'
```

## Updated Measured Coverage Evidence

Measured runtime coverage after explicit inclusion of `runtime/export/**/*.ts`:

- line coverage: `89.99%`
- branch coverage: `80.35%`
- function coverage: `91.04%`

## Recomputed Gate Status

- executable-code overall coverage >= `75%`: **met**
- main-flow coverage = `100%`: **met**
- edge / failure-path coverage >= `50%`: **met**

The testing/coverage gate remains satisfied after truthful inclusion of the export layer.

## Semantic Boundary Confirmation

No runtime or export semantics were changed in this pass beyond what was needed for truthful coverage-gate evidence.

No schema, registry, or binding semantics were changed.

## Contamination Boundary Confirmation

No product / Pilot contamination was introduced.

Specifically:

- no product-facing DTOs were added
- no projection logic was added
- no TracePilot logic was added
