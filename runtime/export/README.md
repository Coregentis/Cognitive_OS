# Runtime Protocol Export

## Purpose

This directory contains the minimal R5 MPLP export and reconstruction path for the neutral Coregentis mother-runtime baseline.

## Current Scope

R5 export remains intentionally narrow:

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

## What This Layer Uses

- frozen import lock under `imports/`
- frozen binding matrix under `bindings/`
- frozen export rules under `bindings/`
- current executed runtime result

## What This Layer Does Not Claim

- full MPLP export completeness
- full MPLP interoperability
- product contracts
- product DTOs
- TracePilot or projection logic
