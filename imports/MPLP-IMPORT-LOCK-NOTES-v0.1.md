# MPLP-IMPORT-LOCK-NOTES-v0.1

## What Is Being Locked

This note explains the import lock defined in [mplp-lock.yaml](/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS/imports/mplp-lock.yaml).

The lock freezes the exact MPLP upstream reference and the exact MPLP asset classes that Coregentis may treat as authoritative input during the first mother-runtime implementation phase.

The locked upstream reference is:

- source repo: `https://github.com/Coregentis/MPLP-Protocol.git`
- local repo path: `/Users/jasonwang/Documents/AI_Dev/Coregentis/MPLP-Protocol`
- source reference type: `git-commit-sha`
- source reference value: `8df1f0a4151d74b02b03f3807380ea33d5fadad6`

The current active sibling MPLP checkout now contains newer governance/tooling
commits beyond the locked reference.

This does not widen the lock automatically.
The lock remains commit-pinned because the first mother-runtime implementation
phase still treats the exact locked commit as the authoritative import boundary.

Current truthful read:

- the current local MPLP checkout still contains
  `8df1f0a4151d74b02b03f3807380ea33d5fadad6` in history as the locked source
  reference
- the public `Coregentis/MPLP-Protocol` repository still exposes that locked
  commit in history even though current `HEAD` has advanced beyond it
- the actual imported schema files used by Cognitive_OS are content-aligned with the public repository at that locked reference

The locked import surface includes:

- protocol module schemas
- protocol common schemas
- protocol event schemas
- protocol learning schemas
- protocol taxonomy
- protocol invariants
- golden flow fixtures
- protocol examples
- validator source pattern

## Why These Assets Are Authoritative

### What MPLP says

The MPLP repository is the authoritative source of:

- protocol definitions
- schema truth
- invariant truth
- governance source records

MPLP also explicitly states that it is not a runtime and not a platform.

### What this means for Coregentis

Coregentis may import MPLP protocol truth, but only as upstream constitutional input. Coregentis must then realize that protocol truth as a separate mother runtime layer.

That is why the lock covers:

- `schemas/v2/**`
- taxonomy and invariants
- golden fixtures as protocol regression material
- validator source as an implementation pattern

These are authoritative because they express protocol truth or protocol-adjacent verification structure.

## What Is Intentionally Excluded From SSOT

The lock intentionally excludes anything that would collapse protocol, runtime, and product boundaries.

Excluded from SSOT:

- TracePilot semantics
- product projection objects
- product UX behaviors
- package README claims that are not backed by checked-in implementation truth
- missing `dist` artifacts in MPLP package surfaces
- stale or schema-drifting runtime tests used as if they outrank frozen schemas
- runtime helper/package naming treated as constitutional protocol law

## Why Helper / Package Surfaces Are Not Protocol Law

MPLP package surfaces such as `@mplp/runtime-minimal`, `@mplp/sdk-ts`, `@mplp/core`, and `@mplp/coordination` are useful implementation surfaces, but they are not the protocol constitution.

This matters for two reasons:

1. Some package manifests in the current MPLP checkout point to `dist` artifacts that are not present locally.
2. Some runtime-facing tests and helper assumptions drift from the frozen protocol schemas.

Therefore:

- package helper terminology may inform implementation
- package helper surfaces may be reused carefully
- package helper surfaces may not override frozen schema truth

Coregentis must bind against MPLP protocol truth first, not against convenience package lore.

## Why Commit SHA Was Used

The lock uses a commit SHA instead of a tag because:

- the aligned public MPLP source exposes a valid commit SHA at the locked reference
- `git describe --tags --exact-match HEAD` does not return an exact matching tag for that commit

Because the phase requirement prefers commit SHA when available, the lock uses the commit SHA as the authoritative source reference and marks the tag as unavailable.

## How This Lock Preserves the Authority Order

This lock preserves:

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> TracePilot`

It does that by enforcing the following rules:

- MPLP is locked as protocol input, not imported as runtime implementation
- Coregentis must create its own machine-readable schemas, object registry, binding matrix, and runtime skeleton downstream of MPLP
- product projections remain downstream of Coregentis runtime realization
- TracePilot remains downstream of projection rules and does not enter this phase

In practical terms, the lock prevents the following invalid moves:

- treating package runtime helpers as protocol law
- treating product objects as mother-runtime truth
- jumping from MPLP directly into TracePilot-specific runtime invention

## Phase Boundary

This import lock is a phase-0 and phase-1 prerequisite artifact only.

It does not authorize:

- Coregentis schema implementation beyond the import boundary itself
- object registry implementation
- binding matrix implementation
- runtime skeleton implementation
- TracePilot runtime or UI work

Its role is narrower:

- freeze the upstream protocol input
- freeze the allowed import surface
- freeze the exclusion rules
- preserve the constitutional order before downstream implementation begins
