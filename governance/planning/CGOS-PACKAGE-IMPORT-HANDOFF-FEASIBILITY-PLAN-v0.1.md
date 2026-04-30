# CGOS-PACKAGE-IMPORT-HANDOFF-FEASIBILITY-PLAN-v0.1

## Document Control

- doc_id: CGOS-PACKAGE-IMPORT-HANDOFF-FEASIBILITY-PLAN-v0.1
- task_id: CGOS-PACKAGE-IMPORT-HANDOFF-FEASIBILITY-PLANNING-01
- status: feasibility planning only
- date: 2026-04-30
- authority_order: MPLP -> Cognitive_OS -> downstream products
- cgos_repo_head: 16d559ab89a7c3f9fffa66da7d31c6d65a6c667f
- downstream_evidence_repo_head: 2ef5875116db7f33e82a2bb28c83e1719880aee3
- mplp_repo_head: 2b89ee839fbf54c1fb282bca93ae1fc080aa1772
- no_implementation_performed: true
- no_package_publish_performed: true
- no_release_tag_package_performed: true
- no_package_export_change_performed: true
- no_schema_registry_binding_change_performed: true

## Executive Summary

The accepted closure audit recorded a bounded import-path gap after the neutral
operator review loop contract implementation and downstream structural adapter
proof. This feasibility plan evaluates whether Cognitive_OS should create a
formal package/import handoff surface for downstream products to consume the
neutral operator review loop projection-safe output without structural
duplication.

Feasibility result: a formal handoff is needed before stronger dependency
closure or deeper downstream migration, but the minimum safe first step should
not expose the full runtime tree. Cognitive_OS should design a generated
projection-safe handoff bundle / export surface first, preserving runtime-private
internals and leaving package publication for a separately governed wave.

No package/export implementation, package publish, dependency change, schema
change, registry change, binding change, release, tag, or package action is
performed in this wave.

## Current Packaging Reality

Current Cognitive_OS packaging status:

- `package.json` declares `"name": "cognitive_os"` and `"private": true`.
- `package.json` has no `exports`, `main`, `types`, `files`, publish script, or
  downstream package boundary.
- `tsconfig.json` is configured for in-repo TypeScript checking with
  `noEmit: true`, `allowImportingTsExtensions: true`, and `include` limited to
  `runtime/**/*.ts` and `types/**/*.d.ts`.
- No workspace config was found for package-backed downstream consumption.
- Runtime tests import `.ts` files directly from repo-relative paths such as
  `../../runtime/core/operator-review-loop-contract.ts`.
- `runtime/core/` is the neutral runtime/projection implementation area, not an
  external package API boundary today.
- `runtime/fixtures/` contains deterministic projection-safe fixtures, but
  fixture availability is currently repo-internal rather than package-exported.
- Existing runtime consumption governance says downstream products should
  consume neutral projection-safe envelopes and should not consume raw runtime
  internals directly.

Conclusion: Cognitive_OS does not currently expose a stable package/export
boundary. Direct package-backed downstream import is not safe until an explicit
export boundary, versioning policy, and validation strategy are designed.

## Current Downstream Consumption Reality

Current downstream consumption status:

- The downstream adapter uses a structural projection-safe input shape rather
  than importing Cognitive_OS runtime files.
- The downstream repository has no Cognitive_OS package dependency and no
  workspace config for safe local package resolution.
- A historical repo-relative runtime bridge exists downstream, but it is sealed
  for already-shipped compatibility surfaces and is not appropriate for new
  operator review loop consumption.
- The adapter records structural import posture explicitly and does not claim
  package-backed consumption.
- The adapter preserves omission markers, safe evidence refs, boundary flags,
  blocked posture, deterministic output, and raw runtime-private omission.

Conclusion: structural consumption was the correct bounded interim posture, but
it should not become the long-term dependency model because the structural shape
can drift from the Cognitive_OS source surface.

## Candidate Handoff Options

| Option | Summary | Pros | Cons | Risk |
| --- | --- | --- | --- | --- |
| Option A: keep structural projection-safe DTO only | Downstream continues to define a local structural input shape. | lowest immediate implementation cost; no package governance required; preserves current closure state | duplicate shape knowledge; drift risk; weak dependency truth | medium |
| Option B: publish / expose package-level runtime contracts | Cognitive_OS exposes runtime contract modules as package imports. | direct source ownership; reduces downstream structural duplication | may expose too much runtime tree; requires export/version/package governance; risks treating runtime helpers as downstream API | high |
| Option C: expose generated projection-safe handoff bundle only | Cognitive_OS exposes a stable projection-safe DTO/bundle output and narrow creation/validation surface. | minimizes runtime-private leakage; downstream consumes stable safe objects; aligns with existing envelope posture; can be versioned independently | requires new export-boundary design; may need generated fixture or bundle tooling later | low-medium |
| Option D: monorepo/workspace dependency | Repos consume Cognitive_OS through local workspace linking. | efficient for local development; avoids publish step | creates repo coupling; does not solve public export boundary; brittle outside one filesystem layout | medium-high |
| Option E: evidence-pack / fixture-pack handoff | Cognitive_OS emits a copied JSON or fixture evidence pack for downstream tests. | simple, deterministic, easy to inspect; useful for regression fixtures | not a live contract import; can become stale; insufficient for full adapter typing | medium |

## Recommended Handoff Strategy

Recommendation:

`Option C: expose generated projection-safe handoff bundle / export surface first`

Rationale:

- It keeps downstream consumers on projection-safe objects rather than raw
  runtime implementation modules.
- It can expose public DTOs and handoff output shapes while keeping helper
  internals, service internals, stores, registry internals, and runtime-private
  payloads hidden.
- It aligns with existing Cognitive_OS consumption guidance: consume neutral
  projection-safe envelopes, safe evidence refs, omission markers, version refs,
  and boundary posture.
- It keeps MPLP unchanged because package/import handoff is implementation and
  integration posture, not protocol law.
- It leaves package publication, package naming, export maps, and dependency
  onboarding to a later governed implementation wave.
- It gives downstream products a stable target before any deeper migration or
  replacement of local evidence paths.

Option A remains acceptable only as a temporary bounded posture. Option B should
not be first because it risks exposing the runtime core too broadly. Option D can
support local development later but should not be the governing handoff form.
Option E can supplement tests but should not be the main dependency contract.

## Proposed Export Boundary

Candidate public/export-safe artifacts:

- `OperatorWorkspace` public DTO
- `OperatorSession` public DTO
- `ReviewLoopState` public DTO
- `OperatorReviewPacket` public DTO
- `SessionEvidenceLedger` public DTO
- `DeterministicEvidenceBundle` public DTO
- `RuntimeBoundaryProfile` public DTO
- `LocalReviewLoopResult` public DTO
- `ProjectionSafeEnvelope` public DTO subset needed by the handoff
- `createProjectionSafeOperatorReviewLoopHandoff` output shape
- generated or fixture-backed projection-safe handoff bundle shape

Candidate export-safe fields:

- stable ids and refs;
- status values;
- boundary profile flags;
- safe evidence refs;
- omission markers;
- protocol, binding, and runtime version refs;
- projection envelope refs;
- deterministic summary fields;
- `runtime_private_fields_omitted: true`;
- `non_executing: true`.

Non-exportable/private:

- internal helper functions not required for downstream DTO validation;
- runtime-private payloads;
- raw service internals;
- execution internals;
- persistence internals;
- in-memory store internals;
- registry internals unless already separately public;
- binding internals unless reduced to projection-safe refs;
- provider/channel or external-service integration internals;
- raw `RuntimeObjectRecord` payloads as downstream API;
- package publication machinery until separately authorized.

The export boundary should be DTO-first and projection-bundle-first. It should
not turn all `runtime/core` modules into public downstream API by default.

## Versioning / Compatibility Policy

Future implementation should define:

- `contract_version`: stable identifier for public DTO field compatibility.
- `runtime_contract_version`: Cognitive_OS runtime contract generation version.
- `projection_bundle_version`: version of the generated handoff bundle shape.
- `compatibility_profile`: explicit downstream compatibility posture.
- `minimum_runtime_surface_ref`: commit or runtime version ref used to build the
  bundle.
- `deprecation_policy`: additive-compatible changes allowed first; removals or
  semantic changes require a new major compatibility profile and downstream
  closure audit.
- `downstream_validation_strategy`: downstream tests should validate boundary
  flags, omission markers, safe refs, deterministic construction, and absence of
  forbidden raw/private/action fields against the exported bundle.

Compatibility rules:

- Public DTO additions must be additive and projection-safe.
- Public DTO removals require explicit migration planning.
- Boundary flag weakening is a breaking change.
- Runtime-private payload exposure is never compatible.
- Product-specific naming in exported DTOs is never compatible.
- Package publication does not imply protocol endorsement or operational
  readiness.

## Future Implementation Slices

If authorized, future work should proceed in bounded slices:

1. CGOS export-boundary inventory and package surface design.
2. CGOS projection-safe public DTO module.
3. CGOS generated handoff bundle fixture/output.
4. Downstream import/consumption spike against CGOS exported DTOs.
5. Dual-path E2E update in the downstream product.
6. Tri-repo package/import closure audit.

No implementation is performed by this planning wave.

## MPLP Boundary

The package/import handoff remains an implementation/integration layer concern.
It does not require:

- MPLP schema change;
- MPLP spec/core law change;
- MPLP object creation;
- MPLP profile creation;
- MPLP binding change;
- certification or endorsement claim.

The existing candidate backlog remains adequate for future guide/profile notes
about runtime-private versus projection-safe evidence, review-only
non-executing posture, deterministic evidence bundles, Trace/Confirm guidance,
and runtime-glue guidance.

## Risks

- Exposing too much runtime internals could turn implementation files into
  accidental downstream API.
- Package stability burden could arrive before the DTO boundary is mature.
- Semantic drift may continue if structural DTOs remain the only downstream
  handoff.
- Downstream lock-in could occur if an early export map becomes too broad.
- Premature npm publish could create false readiness expectations.
- Monorepo coupling could hide missing package governance.
- Product semantic leakage could occur if downstream names flow into canonical
  Cognitive_OS exports.
- Version compatibility drift could break downstream adapters silently.

## Final Decision

`CGOS_PACKAGE_IMPORT_HANDOFF_FEASIBILITY_PASS_RECOMMEND_PROJECTION_BUNDLE_EXPORT`

## Next Allowed Task

`CGOS-PROJECTION-SAFE-EXPORT-BOUNDARY-DESIGN-01`
