# CGOS-VSL-FIRST-PASS-PLAN-v0.1

## Purpose

This plan freezes what `VSL first pass` means in current `Cognitive_OS` repo reality.

It does not claim full VSL realization.
It defines only the first lawful continuity slice that can now be added on top of the bounded executable minimal runtime.

## Current Repo Reality

`Cognitive_OS` already has:

- a bounded executable minimal cognitive loop
- explicit working / episodic / semantic / evidence object placement
- a deterministic in-memory baseline for fresh-intent and bounded requirement-change paths

`Cognitive_OS` does not yet have:

- full VSL realization
- production durability
- replay engines
- rollback execution
- retention enforcement
- full AEL / PSG substrate realization

That means the next lawful move is not "full storage completion."
The next lawful move is a bounded continuity substrate that captures continuity truth more explicitly than the current object-placement-only baseline.

## What VSL First Pass Means Now

In current repo reality, `VSL first pass` means:

- continuity-relevant runtime state is checkpointed as an explicit runtime-private record
- that record is project-scoped
- the current continuation anchor can be recovered by project
- replay horizon metadata is preserved
- rollback horizon metadata is preserved
- retention horizon metadata is preserved
- the whole slice remains product-neutral and runtime-private

For this wave, "durable continuity state" means:

- explicit continuity state survives for the lifetime of the configured runtime VSL store instance
- continuity no longer depends only on transient in-process references to created objects

It does not mean:

- disk durability
- clustered durability
- production-grade persistence guarantees

## Included In This Wave

- a project-scoped VSL continuity state record
- continuation-anchor capture and recovery
- bounded replay horizon metadata
- bounded rollback horizon metadata
- bounded retention horizon metadata
- project isolation for continuity snapshots
- minimal runtime APIs for loading continuity state and recovering continuation anchors
- tests proving bounded continuity behavior without any product DTO dependency

## Explicitly Not Included

- full VSL realization
- replay execution
- rollback execution
- retention policy enforcement
- archival or TTL logic
- concurrency control
- distributed storage
- product DTO law
- founder-facing or downstream product semantics
- AEL policy/execution expansion beyond what continuity capture already needs
- PSG graph realization

## Relation To The Current Minimal Runtime

This wave extends the bounded minimal runtime.
It does not replace it.

The lawful relationship is:

- `Form -> Place -> Activate -> Confirm -> Trace -> Reconcile -> Consolidate` still remains the current executable loop
- VSL first pass writes a continuity checkpoint after that bounded loop completes
- the checkpoint remains runtime-private and project-scoped
- the checkpoint records only continuity substrate truth, not product workflow truth

## Why This Wave Is Lawful Now

This wave is lawful now because:

- MPLP defines VSL as a runtime-side persistence / continuity substrate rather than a protocol object family
- current `Cognitive_OS` already owns runtime-private continuity and memory placement concerns
- this wave does not widen MPLP protocol law
- this wave does not invent downstream product semantics
- this wave stays below full runtime-completion claims

## Later Waves Still Owned Elsewhere

This wave does not take ownership away from later substrate work.

Later VSL/AEL/PSG waves still own:

- full replay and rollback behavior
- state-transition orchestration over continuity checkpoints
- activation governance coupled to continuity resumption
- PSG-backed impact propagation and graph reconstruction
- governed learning over longer-horizon continuity state

## Acceptance Boundary

This wave is complete only if:

- continuity state can be written and read back
- continuation anchor can be recovered deterministically by project
- replay / rollback / retention metadata survive checkpointing
- project A continuity does not bleed into project B continuity
- no SoloCrew-specific or other downstream product DTO law is required

If those conditions are met, this wave counts as `VSL first pass / continuity slice`.
It still does not count as full VSL completion or full runtime completion.
