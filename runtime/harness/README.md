# Coregentis Minimal Loop Harness Scaffold

## Purpose

This directory provides a scaffold for the later mother-runtime minimal loop harness.

The target loop is:

`Form -> Place -> Activate -> Confirm -> Trace -> Reconcile -> Consolidate`

## What This Harness Does Now

- loads a scenario fixture
- delegates to the runtime orchestrator skeleton for plan and dry-run output

## What This Harness Does Not Do Yet

- execute the loop
- mutate stores through real runtime services
- implement AEL, VSL, PSG, or drift runtime behavior
- emit product-facing or TracePilot-facing DTOs

It is a harness scaffold only.
