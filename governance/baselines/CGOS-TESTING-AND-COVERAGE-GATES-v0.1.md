# CGOS-TESTING-AND-COVERAGE-GATES-v0.1

## Purpose

This document establishes the first formal testing and coverage gate baseline for `Cognitive_OS` as a neutral mother-runtime repository.

Its purpose is not vanity coverage.
Its purpose is semantic and runtime reliability for the mother-runtime foundation stream.

## A. Scope Of The Gate

### In-scope executable code surfaces

The current gate applies to executable mother-runtime surfaces such as:

- `runtime/core/**`
- `runtime/harness/**`
- `runtime/in-memory/**`
- `tests/runtime/**`
- any future executable schema / registry / binding validation logic

### Out-of-scope surfaces for coverage math

The following are out of scope for coverage percentage math:

- governance markdown
- architecture prose docs
- root repository explanation docs
- historical review notes
- non-executable reference files
- imported normative source documents kept as reference truth

## B. Coverage Thresholds

The baseline gate defines:

- executable-code overall coverage >= `75%`
- main-flow coverage = `100%`
- edge / failure-path scenario coverage >= `50%`

These thresholds apply to the neutral mother-runtime track.

## C. Main-Flow Definition

The current required main flows are:

- `fresh-intent`
- `requirement-change-midflow`

Rule:

All declared main flows must be fully covered before an execution phase may be considered sealed.

## D. Edge / Failure-Path Definition

At this stage, edge / failure-path coverage includes categories such as:

- unknown object type
- missing registry truth
- missing binding truth
- missing export-rule truth
- invalid scenario input
- confirm skipped vs confirm required
- reconcile skipped vs reconcile triggered
- repeated-run determinism
- frozen-truth load failure or equivalent truth-discipline failure

Rule:

Not every imaginable failure path must be covered now.
At least `50%` of the currently identified edge/failure categories must be covered before sealing.

## E. Required Test Classes

Minimum required classes of tests:

1. schema / contract tests
2. registry / binding truth tests
3. runtime execution tests
4. E2E / golden-path tests

Rule:

E2E / golden-path tests are mandatory for execution-baseline sealing.

## F. Gate Enforcement Rule

No schema / registry / binding / runtime phase may be considered sealed if:

- executable-code coverage is below threshold
- main flows are not fully covered
- edge/failure-path coverage is below threshold
- E2E / golden-path tests are absent or failing

## G. Phase Activation Rule

This testing baseline is established now.

It becomes a hard blocking gate for:

- execution hardening R4 and beyond
- later execution-baseline sealing decisions

## H. Neutrality Rule

Testing and coverage gates must remain neutral.

They must not import:

- product semantics
- projection semantics
- Pilot or TracePilot assumptions

into mother-runtime test logic.

## I. Measurement / Reporting Rule

Once coverage tooling is introduced, execution reviews must produce:

- coverage report source
- executed test command(s)
- pass / fail summary
- main-flow test evidence
- edge / failure-path evidence
- E2E evidence

This baseline may exist before final tooling is fully wired.
However, the enforcement rule becomes real once R4 begins.
