# CGOS-PACKAGE-EXPORT-GOVERNANCE-PLAN-v0.1

## Document Control

- doc_id: CGOS-PACKAGE-EXPORT-GOVERNANCE-PLAN-v0.1
- task_id: CGOS-PACKAGE-EXPORT-GOVERNANCE-PLAN-01
- status: governance plan only
- date: 2026-05-01
- authority_order: MPLP -> Cognitive_OS -> Product Projections -> downstream consumers
- cgos_repo_head: cf0c56a2e9bc6641712a3985b78cdce984efd356
- downstream_closure_evidence_ref: 2482f6e78ce3e23048fb7158c5896eb929f2c734
- no_package_json_change: true
- no_export_map_change: true
- no_package_publication: true
- no_downstream_dependency_claim: true
- no_mplp_normative_change: true

## Executive Summary

Package-backed import is not implemented. The current state is a
projection-safe structural handoff posture, not an official package dependency
or active package contract.

This plan defines the governance preconditions that must be true before
Cognitive_OS can expose any package-backed import surface to downstream
consumers. Future package/export implementation requires separate owner
authorization, a readiness audit, and explicit package boundary review.

No package export map, package publication, dependency work, runtime behavior
change, schema change, registry change, binding change, release, tag, or package
action is performed by this plan.

## Current State Assessment

- Cognitive_OS has neutral DTO and generated handoff bundle surfaces:
  `runtime/public/operator-review-loop-dto.ts` and
  `runtime/public/operator-review-loop-handoff-bundle.ts`.
- `package.json` remains private.
- `package.json` has no `exports`, `main`, `types`, or `files` package export
  boundary.
- No public package boundary exists.
- No package publication has occurred.
- Runtime tests still rely on repo-local TypeScript source usage rather than a
  package import path.
- Downstream structural consumption exists in SoloCrew as downstream evidence
  only; that structural spike does not equal package-backed import and does not
  create Cognitive_OS package law.
- The inspected tri-repo closure audit classifies the remaining package/import
  gap as a P2 bounded future integration gap, not as a closed package boundary.

## Export Surface Classification

| Layer | Surface class | Governance status |
| --- | --- | --- |
| Layer 0 | Private runtime internals | Never exported. Runtime-private payloads, stores, execution internals, service internals, persistence internals, registry internals, and raw object records remain private. |
| Layer 1 | Internal constructors/helpers | Not package-stable. Internal builders may construct safe objects but are not automatically public API. |
| Layer 2 | Projection-safe DTO types | Candidate export surface only after export-class declaration, version metadata, and validation gates. |
| Layer 3 | Projection-safe handoff bundle helpers | Candidate controlled export surface only after deterministic behavior and validation gates are documented. |
| Layer 4 | Validation fixtures / evidence samples | Optional test/export pack only if converted into explicit validation evidence with stable boundaries. |
| Layer 5 | Package export map | Future implementation only. No active package contract exists in this wave. |

## Candidate Exportable Surfaces

| Candidate surface | Export eligibility | Runtime-private exposure risk | Product-semantic pollution risk | Versioning requirement | Test requirement | May be package-exported later |
| --- | --- | --- | --- | --- | --- | --- |
| `runtime/public/operator-review-loop-dto.ts` | Candidate DTO/type export. | Low if exported as DTO types only with omission flags preserved. | Low if neutral names remain unchanged and downstream terms stay absent from canonical DTO names. | Requires `contract_version`, `runtime_contract_version`, `projection_bundle_version` where applicable, and `compatibility_profile`. | Static surface tests, forbidden vocabulary grep, runtime-private exposure grep, and typecheck. | Yes, after readiness audit and package export authorization. |
| `runtime/public/operator-review-loop-handoff-bundle.ts` | Candidate controlled helper export. | Medium because helper behavior must not expose raw internals through nested objects. | Low-medium because summary and validation text must remain neutral. | Requires bundle constants, `generated_from_runtime_surface_ref`, `source_commit_ref`, `version_refs`, and compatibility profile. | Determinism tests, malformed bundle rejection, forbidden positive key tests, package boundary tests, and runtime tests. | Yes, after readiness audit and package export authorization. |

These candidates are not active package exports today. They remain repo-internal
until a future package/export implementation wave is explicitly authorized.

## Non-Exportable Surfaces

The following surfaces are non-exportable by default:

- `runtime/core` internals.
- `runtime/in-memory` internals.
- Private state constructors.
- Local test-only fixtures unless converted into an explicit validation/evidence
  pack.
- Any surface containing product-specific `SoloCrew`, `founder`, `Engagement`,
  or commercial wording. These strings are listed here only as non-exportable
  examples and are not Cognitive_OS canonical export vocabulary.
- Any surface exposing runtime_private payloads.
- Any surface implying MPLP certification or endorsement.
- Any surface that turns protocol candidate backlog evidence into normative
  protocol law.
- Any package publication machinery unless separately authorized.

## Package Export Governance Rules

A future package export implementation must follow these rules:

- No export without an explicit export-class declaration.
- No export without versioned contract metadata.
- No export without runtime-private omission markers.
- No export without deterministic behavior guarantee where applicable.
- No export that requires downstream consumers to import Coregentis private
  runtime internals.
- No export that mutates MPLP semantics.
- No export that implies public product readiness.
- No export that implies package publication unless separately authorized.
- No export that converts downstream structural compatibility into an official
  dependency claim.
- No export that weakens projection-safe boundary flags.

## Candidate Future Export Map

Proposal only. Not implemented. Not an active package contract.

| Proposed package path | Candidate class | Governance note |
| --- | --- | --- |
| `./runtime/public/operator-review-loop-dto` | candidate type/DTO export | DTO-first projection-safe surface only; no runtime/core exposure. |
| `./runtime/public/operator-review-loop-handoff-bundle` | candidate controlled bundle helper export | Narrow helper surface for deterministic bundle creation, validation, and summary only. |

No `package.json` change is made by this plan.

## Versioning / Contract Governance

Future export readiness must define and verify:

- `contract_version`: stable DTO field compatibility identifier.
- `runtime_contract_version`: runtime contract generation identifier.
- `projection_bundle_version`: generated handoff bundle shape identifier.
- `compatibility_profile`: explicit downstream compatibility posture.
- `generated_from_runtime_surface_ref`: source runtime surface reference used to
  construct the bundle.
- `source_commit_ref`: source commit reference for traceable export generation.
- `version_refs`: protocol, binding, runtime, contract, and bundle version refs
  carried by the projection-safe handoff.

Downstream consumers may rely only on declared projection-safe fields. They may
never rely on runtime-private internals, private constructor behavior, store
layout, registry internals, raw runtime records, or any field not declared in
the export surface.

## Readiness Gates for Future Implementation

Before any package export implementation can proceed:

- Package.json export plan reviewed.
- Typecheck passes.
- `npm run test:runtime` passes.
- Public surface grep passes.
- Forbidden product vocabulary grep passes.
- `runtime_private` exposure grep passes.
- No MPLP normative claim grep passes.
- No SoloCrew dependency assumption in Cognitive_OS code/docs.
- Export surface snapshot documented.
- Downstream structural consumer impact assessed.
- Package publication remains separately authorized or explicitly absent.
- Schema, registry, and binding change assessment remains no-change unless a
  separate owner authorization changes scope.

## Explicit Non-Goals

- No `package.json` edit.
- No `exports`, `main`, `types`, or `files` edit.
- No npm package publication.
- No release, tag, or package action.
- No official `@coregentis/cognitive-os` dependency claim.
- No SoloCrew import migration.
- No MPLP schema, spec, or core-law change.
- No certification, endorsement, or MPLP conformance claim.
- No public/private beta claim.
- No production ready claim.
- No downstream product feature expansion.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Exporting runtime internals too early | Downstream consumers may depend on unstable behavior. | Keep `runtime/core` and private constructors non-exportable by default. |
| Downstream consumers depending on unstable private fields | Future runtime refactors become blocked by accidental API promises. | Export only declared projection-safe fields with version metadata. |
| Product terms leaking into Cognitive_OS export law | Neutral runtime authority could be polluted by downstream vocabulary. | Run forbidden vocabulary grep and keep product terms non-exportable. |
| Package export mistaken for product readiness | Consumers may overinterpret package availability. | Require no-readiness wording and no positive product claim gates. |
| CGOS compatibility confused with MPLP conformance | Implementation compatibility may be mistaken for protocol authority. | Preserve MPLP no-change/candidate-only posture and no conformance claims. |
| Future publish pressure bypassing governance | Package action could happen before export stability is ready. | Require owner authorization, readiness audit, and separate publication decision. |
| Export map grows too broad | Private runtime tree becomes public by accident. | Start only with DTO and controlled bundle candidates after review. |

## Decision

`CGOS_PACKAGE_EXPORT_GOVERNANCE_PLAN_PASS_READY_FOR_PACKAGE_EXPORT_READINESS_AUDIT`

## Next Allowed Task

`TRI-REPO-PACKAGE-EXPORT-IMPLEMENTATION-READINESS-01`

Owner may also choose development pause / owner decision. This plan does not
recommend implementation directly and does not recommend SoloCrew V3.1.
