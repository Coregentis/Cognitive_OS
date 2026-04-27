# CGOS-CURRENT-ARCHITECTURE-BASELINE-v0.1

## 1. Document Control

- doc_id: CGOS-CURRENT-ARCHITECTURE-BASELINE-v0.1
- status: Current Architecture Baseline
- authority_order: MPLP -> Cognitive_OS -> Product Projections
- purpose: consolidate the current Cognitive_OS architecture stack, projection boundary, strict E2E status, and document supersession map after drift convergence
- source_audit: governance/audits/CGOS-ARCHITECTURE-CONSISTENCY-LAYERING-PROJECTION-E2E-AUDIT-v0.1.md
- task_id: CGOS-DRIFT-E2E-DOC-CONVERGENCE-01

## 2. Current Executive Truth

Cognitive_OS is not documentation-only. It now contains neutral machine-readable
schemas, registry truth, object/export binding truth, Kernel Duty binding truth,
runtime core services, module/duty posture contracts, projection-safe envelope
builders, state/snapshot/transaction/error posture helpers, downstream handoff
fixtures, governance handoff manifests, and runtime/governance tests.

This baseline does not claim:

- full production implementation of every MPLP module;
- full production implementation of every Kernel Duty;
- MPLP certification or endorsement;
- provider dispatch, channel dispatch, marketplace implementation, or autonomous execution;
- SoloCrew V2.2 completion or paid-product readiness;
- MPLP protocol/schema changes.

## 3. Current Layer Model

| Layer | Responsibility | Current artifacts | Boundary |
| --- | --- | --- | --- |
| Layer 0: MPLP imported protocol truth | MPLP schemas, 10 Modules, 11 Kernel Duties, taxonomy, invariants, and golden flows | inspected in MPLP-Protocol only | Cognitive_OS consumes; it does not redefine MPLP |
| Layer 1: Schema / registry / binding | Cognitive_OS object families, relationship rules, object/protocol binding, export rules, Kernel Duty binding | `schemas/`, `registry/`, `bindings/` | no product journey law |
| Layer 2: Runtime core | neutral runtime object lifecycle and core services | `runtime/core/runtime-types.ts`, orchestrator and service files, stores | no product UI or product workflow semantics |
| Layer 3: Module / duty posture | neutral MPLP module posture and Kernel Duty runtime/projection posture | `runtime/core/mplp-module-posture.ts`, `runtime/core/kernel-duty-runtime-posture.ts`, default posture files | posture is not a claim of full production realization |
| Layer 4: Projection-safe envelope | safe composition of binding posture, module posture, duty posture, evidence refs, omission markers, and version refs | `runtime/core/projection-safe-envelope.ts`, `runtime/core/projection-safe-runtime-envelope-builder.ts`, state/transaction/error posture helpers | no raw runtime-private payloads |
| Layer 5: Product projection handoff | downstream-neutral consumption rules and fixtures | `runtime/fixtures/projection-safe-downstream-handoff-fixture.ts`, `governance/handoffs/`, `handoffs/` | product projections consume posture; they do not define runtime/protocol law |

## 4. Projection Boundary

Projection in Cognitive_OS is a safety envelope and downstream adapter boundary.
It is currently implemented through runtime/core projection-safe contracts,
builders, posture helpers, runtime fixtures, and handoff governance. There is no
top-level `projection/` directory in the current baseline.

Projection owns:

- projection-safe envelope structure;
- safe evidence refs;
- omission markers;
- object/export binding posture summaries;
- module posture summaries;
- Kernel Duty posture summaries;
- protocol and binding version refs;
- downstream boundary notices.

Projection does not own:

- MPLP protocol definitions;
- Cognitive_OS runtime law;
- product workspace behavior;
- provider/channel dispatch;
- marketplace behavior;
- autonomous execution;
- raw runtime-private payload exposure.

## 5. Strict E2E Status

Current strict E2E hardening includes:

- `tests/runtime/strict-module-duty-projection-e2e.test.mjs`
- `tests/runtime/strict-state-transaction-error-e2e.test.mjs`
- `tests/runtime/strict-downstream-handoff-e2e.test.mjs`
- `tests/runtime/strict-boundary-negative-e2e.test.mjs`

These tests prove that representative runtime object records can flow through
the binding service into projection-safe envelopes that include all 10 MPLP
Modules, all 11 Kernel Duties, safe evidence refs, omission markers, protocol
version refs, binding version refs, state/snapshot posture, transaction/export
posture, error/insufficiency posture, and downstream handoff surfaces.

This is an E2E hardening baseline for projection-safe consumption readiness. It
is not a claim that every module and duty has full production implementation.

## 6. Active Source-of-Truth Docs

Current authoritative governance entry points:

- `governance/baselines/CGOS-CURRENT-ARCHITECTURE-BASELINE-v0.1.md`
- `governance/audits/CGOS-ARCHITECTURE-CONSISTENCY-LAYERING-PROJECTION-E2E-AUDIT-v0.1.md`
- `governance/baselines/CGOS-KERNEL-DUTY-BINDING-BASELINE-v0.1.md`
- `governance/research/CGOS-BINDING-LAYER-RELATIONSHIP-AUDIT-v0.1.md`
- `governance/research/CGOS-UPSTREAM-COMPLETION-DEEP-AUDIT-AND-REFACTOR-PLAN-v0.1.md`
- `governance/handoffs/CGOS-SOLOCREW-V2.2-CONSUMPTION-HANDOFF-v0.1.md`
- `handoffs/solocrew-v2.2-cgos-consumption-handoff.v0.yaml`
- `bindings/mplp-coregentis-binding-matrix.v0.yaml`
- `bindings/coregentis-export-rules.v0.yaml`
- `bindings/mplp-kernel-duty-coregentis-binding.v0.yaml`

## 7. Historical / Superseded Docs

Historical documents retain trace value but are no longer current architecture
truth when they conflict with this baseline:

- `governance/research/CGOS-ASSET-INVENTORY-AND-GAP-ANALYSIS-v0.1.md`:
  superseded for current implementation state because it records an early
  documentation-only repository phase.
- Earlier projection-revision-runtime release/gate documents: still valid for
  that capability-line history, but superseded as the current architecture
  overview by this baseline.
- Earlier execution-baseline review documents: retained as evidence of runtime
  evolution, not current full-stack architecture truth.

No evidence-bearing governance documents were deleted in this convergence wave.

## 8. SoloCrew Posture

SoloCrew V2.2 remains paused until owner authorization starts downstream
implementation against the accepted Cognitive_OS handoff. The current
Cognitive_OS baseline is intended to prevent product projections from
redefining Context, Plan, Confirm, Trace, Core, State Sync, Transaction,
Security omission, Observability evidence, Protocol Versioning, or object/export
binding semantics locally.

## 9. Final Baseline Decision

CGOS_DRIFT_E2E_DOC_CONVERGENCE_PASS

Cognitive_OS drift has been reduced, strict projection-safe E2E hardening has
been added, and documentation now points to a single current architecture
baseline while preserving historical trace records.
