# CGOS-EXECUTION-BASELINE-R5A-REVIEW-v0.1

## Purpose

This note records the R5a narrow command-surface correction pass for the accepted R5 execution baseline.

## What Regression Existed After R5

After R5, the repository-visible runtime command surface drifted in documentation emphasis.

The `package.json` scripts were already the intended canonical runtime command surface, but some README and review wording did not make the canonical-vs-equivalent distinction explicit enough.

R5a corrects that documentation regression without changing runtime or export behavior.

## Files Corrected

- `runtime/README.md`
- `tests/runtime/README.md`
- `governance/audits/CGOS-EXECUTION-BASELINE-R5-REVIEW-v0.1.md`

This pass also adds this audit note:

- `governance/audits/CGOS-EXECUTION-BASELINE-R5A-REVIEW-v0.1.md`

## Canonical Commands

Canonical runtime test command:

```bash
npm run test:runtime
```

Canonical runtime coverage command:

```bash
npm run coverage:runtime
```

## How Direct Commands Are Now Labeled

Equivalent direct commands are still documented where useful, but they are now labeled explicitly as:

- equivalent direct command only
- equivalent direct test command only
- equivalent direct coverage command only

They are no longer presented as the canonical repository-visible command surface.

## Package Command Surface Status

`package.json` remains the authoritative canonical command surface for runtime testing and runtime coverage.

No script changes were required in this pass.

## Semantic Boundary Confirmation

No runtime, export, schema, registry, or binding semantics were changed.

R5a is documentation and reproducibility correction only.

## Contamination Boundary Confirmation

No product / Pilot contamination was introduced.

Specifically:

- no product-facing DTOs were added
- no projection logic was added
- no TracePilot logic was added
