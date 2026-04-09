# Coregentis Runtime

## Purpose

This directory now contains the first executable mother-runtime baseline for `Cognitive_OS`.

The baseline is still intentionally minimal:

- in-memory only
- deterministic
- fixture-driven
- neutral

## Included Layers

- `core/`
  - runtime service interfaces and first-pass implementations
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

## What This Baseline Does Not Claim

This is not:

- full runtime completion
- full AEL
- full VSL
- full PSG
- full policy engine
- full confirm workflow
- full trace export
- full reconcile engine
- any product or TracePilot runtime
