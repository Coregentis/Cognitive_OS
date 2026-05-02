# CGOS-PUBLIC-SURFACE-READINESS-AUDIT-v0.1

## Document Control

- doc_id: CGOS-PUBLIC-SURFACE-READINESS-AUDIT-v0.1
- task_id: CGOS-PUBLIC-SURFACE-READINESS-AUDIT-01
- status: readiness audit only
- date: 2026-05-02
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- cgos_repo_head_start: f469c28de432f9377f43f5f7d50876074d5c0503
- solocrew_usage_map_ref: ffb81c3c03c5411072d61b38e7f3b0ddd63dd7e7
- mplp_no_change_ref: 2b89ee839fbf54c1fb282bca93ae1fc080aa1772
- no_export_change: true
- no_package_change: true
- no_runtime_change: true
- no_schema_registry_binding_change: true
- no_solocrew_modification: true
- no_mplp_modification: true

## Executive Summary

The Cognitive_OS public surface candidate set is ready with conditions for a
bounded first design wave, not for direct implementation.

The first wave should stay type-only / DTO-first and should not create helper
bundles, service constructors, store adapters, dispatch services, package
exports, schemas, registry entries, bindings, or package publication.

The strongest first-wave candidates are neutral runtime projection DTOs,
runtime readiness / action-status DTOs, bounded execution event DTOs, and
possibly objective continuity DTOs after a small field design pass. State
snapshot and learning correction evidence surfaces remain important but need
more field-level design before implementation readiness. The optional helper
bundle is explicitly deferred until DTO surfaces exist and are verified.

Selected decision:

`CGOS_PUBLIC_SURFACE_READINESS_PASS_WITH_CONDITIONS`

## Candidate Readiness Matrix

| Candidate | Readiness decision | Export risk | Runtime-private exposure risk | Product-semantic leakage risk | Implementation complexity | Downstream bridge replacement value | Priority | Required preconditions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Runtime projection DTO / summary surface | CONDITIONALLY_READY | Medium | Medium | Medium | Medium | High | P1 | Define neutral field families, preserve omission markers, map `RuntimeStateProjection` and `OperationalUnitRuntimeProjection` without exposing `runtime/core`, and add adapter-parity tests in a future wave. |
| Runtime readiness / action-status DTO surface | READY | Low-medium | Low | Low | Low | High | P1 | Version action/readiness/status values, keep them non-authoritative, and prove no execution authority is implied. |
| State snapshot / state-port summary surface | NEEDS_FIELD_DESIGN | Medium-high | High | Low | High | Medium-high | P2 | Separate store-agnostic snapshots from `StateStorePort`, sqlite adapters, and internal record persistence before implementation. |
| Learning correction evidence DTO surface | NEEDS_FIELD_DESIGN | Medium | Medium-high | Medium | Medium-high | Medium | P2 | Separate immutable evidence from mutation/writeback services and define neutral correction/preference evidence fields. |
| Objective continuity DTO surface | CONDITIONALLY_READY | Low-medium | Medium | Low | Low-medium | Medium | P2 | Represent comparison output and continuity posture without exposing `InMemoryObjectiveAnchor` or storage strategy. |
| Bounded execution event DTO surface | CONDITIONALLY_READY | Medium | Medium | Low-medium | Medium | High | P1 | Require non-executing flags, provider/channel dispatch exclusions, evidence refs, and clear distinction between event evidence and execution authority. |
| Optional runtime projection handoff bundle helper | NEEDS_FIELD_DESIGN | Medium-high | Medium | Medium | High | Medium | P3 | Defer until DTOs are implemented, tested, and separately approved; then review deterministic helper behavior and package-boundary risk. |

## First Implementation Wave Recommendation

Recommended bounded first wave:

1. Runtime readiness / action-status DTO surface.
2. Runtime projection DTO / summary surface.
3. Bounded execution event DTO surface.
4. Objective continuity DTO surface only if its field design stays small and
   type-only.

This first wave should be pure DTO/type-first and should not include helper
bundles or package export map changes. It should use the operator review loop
public surfaces as a boundary pattern: version metadata, compatibility profile,
source refs, omission markers, runtime-private omission flags, and
non-executing flags where applicable.

Deferred from the first wave:

- State snapshot / state-port summary surface until persistence and store
  semantics are separated from public DTO shape.
- Learning correction evidence DTO surface until mutation services and evidence
  records are cleanly separated.
- Optional runtime projection handoff bundle helper until the underlying DTOs
  exist and pass readiness / implementation / verification gates.

## Field-Level Design Requirements

Every READY or CONDITIONALLY_READY candidate must define these common field
families before implementation:

- `contract_version`
- `runtime_contract_version`
- `compatibility_profile`
- `source_runtime_surface_ref`
- `source_commit_ref`
- `version_refs`
- `omission_markers`
- `runtime_private_fields_omitted`
- `boundary_profile` or `boundary_flags`
- `safe_evidence_refs` or summary refs where applicable

Runtime projection DTO / summary surface must additionally define:

- projection or summary id
- project or scope ref
- operational unit refs without product-specific names
- state posture summaries
- readiness posture refs
- artifact / learning / continuity summary refs where needed
- private payload omission reasons

Runtime readiness / action-status DTO surface must additionally define:

- bounded action class
- readiness status
- artifact class
- learning status
- continuation posture
- explicit interpretation text that the status is review / projection posture,
  not execution authority

Bounded execution event DTO surface must additionally define:

- request envelope id
- dispatch outcome id
- event contract id
- event status
- non_executing
- no_provider_dispatch
- no_channel_dispatch
- safe_evidence_refs
- blocked or deferred reason where applicable
- interpretation text that event evidence is not provider/channel dispatch

Objective continuity DTO surface must additionally define:

- continuity id
- objective ref
- comparison status
- previous / current objective summary refs
- continuity recommendation posture
- safe evidence refs
- runtime-private omission markers

## Explicit Rejections / Deferrals

Rejected as public surfaces:

- Direct service or runtime class exports.
- Direct `runtime/core` internals.
- Direct lifecycle runtime class exports.
- Stores, sqlite adapters, and persistence adapters.
- Mutation services.
- Dispatch services and dispatch handlers.
- Product-specific dashboard, cell, founder, engagement, route, or commercial
  surfaces.
- Fixture-only historical compatibility surfaces.

Deferred:

- Helper bundle before DTOs are approved.
- State snapshot / state-port summary until store and persistence semantics are
  field-designed.
- Learning correction evidence until mutation and evidence boundaries are
  field-designed.

## Package / Export Governance

No `package.json` change is made in this audit. The current package export map
remains limited to the two approved operator review loop public surfaces.

A future implementation may create files only after separate authorization, but
file creation does not make them package exports. A future package export map
change must remain a separate governance / readiness / implementation /
verification chain.

Package publication remains out of scope.

## Relationship to SoloCrew Bridge Replacement

SoloCrew bridge replacement must wait until first DTO surfaces exist and are
verified. Not all bridge usages will be replaced by Cognitive_OS. Some usages
may remain SoloCrew-owned fixtures, product projection models, or quarantine
records.

SoloCrew remains unchanged in this audit. The SoloCrew usage map remains
evidence for candidate selection, not product law inside Cognitive_OS.

## Relationship to MPLP

No MPLP schema, spec, or core-law change is made or required.

The candidate public surfaces remain Cognitive_OS implementation-layer surfaces.
Any MPLP candidate or backlog mapping must be separate, non-normative, and
owner-authorized.

No MPLP conformance, certification, or endorsement claim is created by this
audit.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Over-exporting internals | High | Keep service classes, stores, dispatchers, and `runtime/core` internals non-exportable. |
| Premature helper bundle | Medium-high | Defer helper bundle until DTOs are implemented and separately verified. |
| DTO under-specification | Medium | Require field-level design and downstream bridge parity review before implementation. |
| Event evidence mistaken for execution authority | High | Require `non_executing`, provider/channel dispatch exclusions, and explicit interpretation fields. |
| Field naming leaking product semantics | High | Use neutral runtime/projection/evidence vocabulary only. |
| Package export confusion | Medium | Keep package export map changes as a separate task after implementation verification. |
| Downstream replacement drift | Medium | Require SoloCrew bridge replacement planning after CGOS DTOs exist. |
| State persistence leakage | High | Keep sqlite and store adapters private; expose only bounded summaries if approved later. |
| Learning mutation leakage | Medium-high | Separate evidence DTOs from writeback and mutation services before implementation. |

## Decision Options

Selected decision:

`CGOS_PUBLIC_SURFACE_READINESS_PASS_WITH_CONDITIONS`

Rationale:

- A narrow first wave is feasible if it is DTO/type-first and excludes helper
  bundles, stores, services, dispatchers, package exports, and downstream
  product semantics.
- Runtime readiness/action-status DTOs are ready for first-wave design.
- Runtime projection DTOs, bounded execution event DTOs, and objective
  continuity DTOs are conditionally ready with explicit field-design gates.
- State snapshot and learning correction evidence remain deferred for deeper
  field-level design.

Rejected options:

- `CGOS_PUBLIC_SURFACE_READINESS_PASS_FIRST_WAVE_READY`: rejected because
  several fields still require design before implementation.
- `CGOS_PUBLIC_SURFACE_READINESS_PARTIAL_FIELD_DESIGN_REQUIRED`: rejected
  because a bounded first-wave design path is clear for the highest-value DTO
  candidates.
- `CGOS_PUBLIC_SURFACE_READINESS_BLOCKED`: rejected because no P0/P1 blocker was
  found for a DTO-first design wave.

## Next Allowed Task

`CGOS-PUBLIC-SURFACE-FIRST-WAVE-DESIGN-01`

Owner may also pause development. This audit does not recommend direct
implementation.
