# CGOS-PROJECTION-SAFE-EXPORT-BOUNDARY-DESIGN-v0.1

## Document Control

- doc_id: CGOS-PROJECTION-SAFE-EXPORT-BOUNDARY-DESIGN-v0.1
- task_id: CGOS-PROJECTION-SAFE-EXPORT-BOUNDARY-DESIGN-01
- status: export-boundary design only
- date: 2026-04-30
- authority_order: MPLP -> Cognitive_OS -> downstream products
- source_feasibility_plan: governance/planning/CGOS-PACKAGE-IMPORT-HANDOFF-FEASIBILITY-PLAN-v0.1.md
- cgos_repo_head: 8df1918124a57de4b0fede1b89046b7a665a7dfd
- downstream_evidence_repo_head: 2ef5875116db7f33e82a2bb28c83e1719880aee3
- mplp_repo_head: 2b89ee839fbf54c1fb282bca93ae1fc080aa1772
- no_implementation_performed: true
- no_package_export_change_performed: true
- no_package_publish_performed: true
- no_schema_registry_binding_change_performed: true
- no_runtime_behavior_change_performed: true

## Executive Summary

The accepted feasibility plan selected a projection-safe bundle/export surface
as the first safe handoff strategy. This design defines the future
public/export-safe boundary for neutral operator review loop handoff data and
separates that boundary from runtime internals.

The design is DTO-first and bundle-first. It allows a future implementation to
expose stable projection-safe objects while keeping runtime constructors,
service internals, store internals, registry internals, execution internals,
provider/channel internals, and raw runtime-private payloads private.

No package/export implementation, package publish, runtime behavior change,
schema change, registry change, binding change, release, tag, or package action
is performed in this wave.

## Design Principles

- DTO-first: public handoff should expose data contracts, not the whole runtime
  implementation tree.
- Projection-safe only: every public artifact must preserve safe refs, omission
  markers, version refs, and no-execution posture.
- No runtime-private payload: raw runtime-private records or payloads must never
  cross the boundary.
- No broad `runtime/core` exposure: implementation files are not public API by
  default.
- No product semantic leakage: downstream products may adapt locally, but
  Cognitive_OS canonical exports stay neutral.
- Versioned compatibility profile: public artifacts need explicit version and
  compatibility metadata before export.
- Additive-compatible changes first: public DTO changes should be additive
  unless a separately governed migration is authorized.
- No package publication until separate authorization.

## Export Boundary Layers

| Layer | Name | Boundary decision |
| --- | --- | --- |
| Layer 0 | Private runtime internals | Never export. Includes raw runtime-private payloads, raw records, service internals, stores, execution internals, provider/channel internals, registry internals, and persistence internals. |
| Layer 1 | Internal runtime constructors/helpers | Not public by default. Constructors and builder helpers may generate safe objects but should not become the first downstream API surface. |
| Layer 2 | Projection-safe DTO types | Candidate export-safe. Public only after version fields and compatibility metadata are added or wrapped. |
| Layer 3 | Projection-safe handoff bundle shape | Preferred first export target. Provides the downstream-consumable bundle assembled from DTOs, envelope posture, refs, omissions, and validation summary. |
| Layer 4 | Validation/test fixture bundle | Optional generated export target. Useful for downstream contract tests but not a replacement for the public DTO boundary. |
| Layer 5 | Package export map | Future implementation only. No package export map change is made in this design wave. |

## Public DTO Candidate Matrix

| Candidate artifact | Export status | Reason | Required version fields | Private fields excluded |
| --- | --- | --- | --- | --- |
| `OperatorWorkspace` | candidate export-safe DTO | Contains stable refs, status, evidence refs, boundary profile, and projection envelope ref. | `contract_version`, `runtime_contract_version`, `compatibility_profile` | raw workspace runtime payload, store metadata, persistence metadata |
| `OperatorSession` | candidate export-safe DTO | Contains stable session refs and review-loop linkage without execution behavior. | `contract_version`, `runtime_contract_version`, `compatibility_profile` | raw session runtime payload, lifecycle service internals |
| `ReviewLoopState` | candidate export-safe DTO | Represents deterministic review state summary with reviewed/blocked refs only. | `contract_version`, `runtime_contract_version`, `compatibility_profile` | raw state machine internals, private transition payloads |
| `OperatorEntrySurface` | candidate export-safe DTO with caution | Manual-action posture can be safe if it remains neutral and non-executing. | `contract_version`, `runtime_contract_version`, `compatibility_profile` | UI behavior, product entry semantics, execution routes |
| `ReviewLoopRunner` | candidate export-safe DTO with caution | Step refs are safe if exposed as review sequence posture, not runner control. | `contract_version`, `runtime_contract_version`, `compatibility_profile` | runner execution internals, scheduling, automation |
| `OperatorReviewPacket` | candidate export-safe DTO | Carries neutral packet refs, manual decision options, and evidence refs. | `contract_version`, `runtime_contract_version`, `compatibility_profile` | private packet payload, product rendering, approval semantics |
| `SessionEvidenceLedger` | candidate export-safe DTO | Ledger refs are safe as reference-only evidence posture. | `contract_version`, `runtime_contract_version`, `compatibility_profile` | raw ledger entries, database refs, store payloads |
| `DeterministicEvidenceBundle` | candidate export-safe DTO | Summary and evidence refs can be exported as deterministic evidence posture. | `contract_version`, `runtime_contract_version`, `projection_bundle_version`, `compatibility_profile` | file export path, raw evidence payload, persistence adapter |
| `RuntimeBoundaryProfile` | candidate export-safe DTO | Boundary flags are required for downstream no-execution/no-claim validation. | `contract_version`, `boundary_profile_ref`, `compatibility_profile` | positive capability fields, provider/channel/payment/autonomy fields |
| `LocalReviewLoopResult` | candidate export-safe aggregate DTO | Aggregates safe DTOs and projection handoff under one deterministic result. | `contract_version`, `runtime_contract_version`, `projection_bundle_version`, `compatibility_profile`, `source_commit_ref` | raw runtime-private payload, constructor inputs, service internals |
| `ProjectionSafeEnvelope` DTO subset | candidate export-safe subset | Safe refs, omission markers, module/duty posture summaries, and version refs are valid handoff posture. | `projection_bundle_version`, `schema_profile_ref`, `boundary_profile_ref`, `compatibility_profile` | raw runtime object records, binding service internals, registry internals |
| `ProjectionSafeOperatorReviewLoopHandoff` bundle shape | preferred first export target | Bundles DTOs, envelope subset, omission markers, safe evidence refs, version refs, and validation summary. | `projection_bundle_version`, `runtime_contract_version`, `compatibility_profile`, `generated_from_runtime_surface_ref`, `source_commit_ref` | raw runtime-private payload, execution internals, persistence internals, package machinery |

## Non-Exportable Matrix

| Internal artifact | Reason not exportable | Allowed replacement |
| --- | --- | --- |
| raw runtime-private payload | Violates projection-safe omission boundary. | safe refs, summaries, and omission markers |
| service internals | Runtime service behavior is not a downstream API contract. | public DTO result and validation summary |
| execution internals | Would imply control or action semantics outside this handoff. | non-executing boundary flags and review-only status |
| persistence internals | Store layout and persistence adapters are private implementation details. | deterministic refs and omission markers |
| registry internals | Registry truth is governance/runtime-owned and not a handoff payload. | reduced projection-safe registry/version refs if later authorized |
| store internals | In-memory or durable store data is runtime-private. | session/evidence refs and summaries |
| provider/channel internals | External routing is outside the neutral handoff boundary. | `no_provider_dispatch` and `no_channel_dispatch` flags |
| helper constructors not needed downstream | Helpers can expose too much implementation shape and change more often than DTOs. | generated DTO bundle and narrow validation helpers if later authorized |
| raw `RuntimeObjectRecord` payloads | Runtime object records contain private authority, layer, lineage, mutation, and governance payloads. | `source_runtime_object_refs` and binding/export posture summaries |
| package publication machinery | Publication is a separate governance and release decision. | design document and future export-boundary implementation plan |

## Required Public Metadata

Future public/export-safe artifacts must include or be wrapped by:

- `contract_version`
- `runtime_contract_version`
- `projection_bundle_version`
- `compatibility_profile`
- `minimum_runtime_surface_ref`
- `generated_at` or `generation_ref` if generation is automated
- `source_commit_ref`
- `schema_profile_ref` if a schema profile is later introduced
- `boundary_profile_ref`
- `deprecation_policy_ref`

The metadata must be present at the bundle boundary even if individual nested
DTOs carry only a subset.

## Projection Bundle Shape

Future generated bundle candidate:

```ts
type ProjectionSafeOperatorReviewLoopHandoffBundle = {
  bundle_id: string;
  projection_bundle_version: string;
  runtime_contract_version: string;
  compatibility_profile: string;
  generated_from_runtime_surface_ref: string;
  source_commit_ref: string;
  operator_workspace: OperatorWorkspace;
  operator_session: OperatorSession;
  review_loop_state: ReviewLoopState;
  operator_review_packet: OperatorReviewPacket;
  session_evidence_ledger: SessionEvidenceLedger;
  deterministic_evidence_bundle: DeterministicEvidenceBundle;
  runtime_boundary_profile: RuntimeBoundaryProfile;
  local_review_loop_result: LocalReviewLoopResult;
  projection_safe_envelope: ProjectionSafeEnvelope;
  omission_markers: ProjectionSafeOmissionMarker[];
  safe_evidence_refs: ProjectionSafeEvidenceRef[];
  version_refs: ProjectionSafeVersionRef[];
  validation_summary: ProjectionSafeOperatorReviewLoopValidationSummary;
  runtime_private_fields_omitted: true;
  non_executing: true;
};
```

Bundle rules:

- no raw runtime-private payload;
- no execution, persistence, provider/channel, payment, CRM/email, analytics,
  LLM/tool/agent, SaaS/cloud, or autonomy fields;
- no product-specific names;
- no commercial/readiness claims;
- no certification/endorsement claims;
- deterministic generation;
- all boundary flags preserved;
- all omitted private surfaces represented by omission markers.

## Export Validation Gates

Future implementation must pass these gates before package/export use:

- all public DTOs include or inherit required version fields;
- no runtime-private payload;
- no forbidden downstream/product terms in public DTO names, fixture ids,
  comments, tests, or string values;
- no provider/payment/CRM/email/LLM/tool/autonomy fields;
- deterministic generation across repeated construction;
- additive compatibility test against previous bundle profile;
- downstream structural adapter compatibility test;
- runtime tests pass;
- no package publish;
- no package export map change until explicitly authorized for that wave.

## Future Implementation Plan

Next implementation task:

`CGOS-PROJECTION-SAFE-PUBLIC-DTO-MODULE-IMPLEMENTATION-01`

Later tasks:

1. `CGOS-GENERATED-HANDOFF-BUNDLE-IMPLEMENTATION-01`
2. `DOWNSTREAM-CGOS-EXPORTED-BUNDLE-CONSUMPTION-SPIKE-01`
3. `TRI-REPO-PACKAGE-IMPORT-HANDOFF-CLOSURE-AUDIT-01`

No implementation is performed now.

## MPLP Boundary

This design does not require:

- MPLP schema change;
- MPLP spec/core-law change;
- MPLP object creation;
- MPLP profile creation;
- MPLP binding change;
- certification or endorsement claim.

The export boundary remains an L3/L4 implementation/export boundary. The
existing candidate backlog remains sufficient for future guide/profile questions
about runtime-private versus projection-safe evidence, review-only
non-executing posture, deterministic evidence bundles, Trace/Confirm guidance,
and runtime-glue guidance.

## Risks

- Accidental broad `runtime/core` API exposure.
- DTO drift from runtime implementation.
- Premature package export before metadata and validation gates exist.
- Package stability burden before the handoff shape matures.
- Semantic leakage from downstream products into Cognitive_OS canonical terms.
- Downstream lock-in to a too-broad first export map.
- Boundary flag weakening during future refactors.
- Hidden raw payload exposure through nested helper output.
- Version compatibility ambiguity if bundle metadata is incomplete.

## Final Decision

`CGOS_PROJECTION_SAFE_EXPORT_BOUNDARY_DESIGN_PASS_READY_FOR_PUBLIC_DTO_MODULE`

## Next Allowed Task

`CGOS-PROJECTION-SAFE-PUBLIC-DTO-MODULE-IMPLEMENTATION-01`
