# Runtime Protocol Export

## Purpose

This directory contains the R6-hardened minimal MPLP export and reconstruction path for the neutral Coregentis mother-runtime baseline.

## Current Scope

The export layer remains intentionally narrow:

- deterministic
- frozen-truth-first
- schema-disciplined
- non-product-shaped

Current supported exported families:

- `trace`
- `confirm`
  - only when confirm semantics actually exist in runtime state

Current explicitly omitted families:

- `context`
- `plan`

These omissions are reported in the export bundle rather than silently invented.

The bundle now includes:

- export metadata
- explicit export manifest / audit surface
- exported artifacts grouped by family
- omitted targets grouped by family with typed reason codes
- per-artifact validation results
- bounded export errors for missing truth or validation failures
- frozen-truth source summary

## What This Layer Uses

- frozen import lock under `imports/`
- frozen binding matrix under `bindings/`
- frozen export rules under `bindings/`
- current executed runtime result

## What This Layer Does Not Claim

- full MPLP export completeness
- full MPLP interoperability
- full generic validator platform
- product contracts
- product DTOs
- TracePilot or projection logic
