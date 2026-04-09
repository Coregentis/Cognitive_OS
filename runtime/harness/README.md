# Coregentis Minimal Loop Harness Scaffold

## Purpose

This directory provides the first mother-runtime minimal loop harness baseline.

The target loop is:

`Form -> Place -> Activate -> Confirm -> Trace -> Reconcile -> Consolidate`

## What This Harness Does Now

- loads a scenario fixture
- delegates to the runtime orchestrator for:
  - plan output
  - dry-run output
  - first-pass in-memory execution output
- can optionally attach a minimal protocol export bundle after an executed run

## What This Harness Does Not Do Yet

- implement loop behavior itself
- implement full runtime services
- implement AEL, VSL, PSG, or drift runtime behavior
- emit product-facing or TracePilot-facing DTOs
- claim full MPLP artifact completeness

It remains a minimal mother-runtime harness only, not a product-facing runtime surface.
