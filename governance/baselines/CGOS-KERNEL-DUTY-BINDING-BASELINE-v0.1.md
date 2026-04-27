# CGOS-KERNEL-DUTY-BINDING-BASELINE-v0.1

## 1. Document Control

- doc_id: CGOS-KERNEL-DUTY-BINDING-BASELINE-v0.1
- task_id: CGOS-KERNEL-DUTY-BINDING-BASELINE-01
- status: Neutral Kernel Duty Binding Baseline
- authority_order: MPLP -> Cognitive_OS -> Product Projections
- protocol_source: MPLP Protocol v1.0.0
- machine_readable_binding: `bindings/mplp-kernel-duty-coregentis-binding.v0.yaml`
- governance_gate: `tests/governance/kernel-duty-binding.test.mjs`

## 2. MPLP Kernel Duty SSOT

The frozen MPLP source of truth for Kernel Duties is:

- `schemas/v2/taxonomy/kernel-duties.yaml`

The supporting MPLP documentation pages inspected are informative boundary
surfaces, not assignment authorities:

- `docs/docs/specification/module-to-duty-matrix.md`
- `docs/docs/specification/flow-to-duty-matrix.md`
- `docs/docs/specification/normative-coverage-report.md`

## 3. Why Cognitive_OS Needs Neutral Binding

MPLP names the 11 frozen Kernel Duties. Cognitive_OS must realize those duties
as neutral runtime obligations, service ownership, evidence posture, and
projection-safe exposure rules. Product projections may consume that posture,
but they must not define the duty semantics for Cognitive_OS.

This baseline keeps three layers distinct:

| Layer | Responsibility | Boundary |
| --- | --- | --- |
| MPLP protocol duty definition | Names the frozen duties and slugs | Does not assign product journeys or runtime services |
| Cognitive_OS duty realization | Binds duties to neutral runtime responsibilities, owner services, evidence posture, and projection-safe exposure | Does not redefine MPLP duties or encode product law |
| Product projection duty exposure | Consumes neutral duty posture in product-specific UX, packets, reports, and workflows | Does not become the source of duty semantics |

## 4. Binding Matrix

| Duty | Cognitive_OS neutral runtime responsibility | Owner service(s) or planned owner(s) | Runtime object families involved | Evidence/trace posture | Projection-safe exposure rule | Product boundary rule | Status | Blocking relevance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| KD-01 Coordination | Coordinate registered runtime objects, policy checks, continuation anchors, and bounded handoffs without product workflow semantics. | `MinimalRuntimeOrchestratorSkeleton`, `RegistryService`, `BindingService`, planned `CoordinationDutyPostureService` | project, objective, work-item, review-cycle, agent-worker, management-family records | Coordination decisions must leave decision or trace refs when they affect continuation or handoff posture. | Expose only bounded coordination summaries, source refs, and omission markers. | Products may name workflows, but Cognitive_OS owns neutral coordination posture. | partial | Blocking for product projections that need ordered continuation or handoff truth. |
| KD-02 Error Handling | Represent recoverable runtime gaps, blocked states, stale context, and evidence insufficiency without converting them into product verdicts. | `ProjectionService`, `PolicyService`, `ReconcileService`, planned `ErrorDutyPostureService` | conflict-case, drift-record, decision-record, trace-evidence, projection revision envelopes | Error posture must distinguish insufficiency, stale state, conflict, and policy block with safe evidence refs. | Expose bounded error and insufficiency summaries; never expose raw runtime-private payloads. | Products may render error copy but must preserve neutral error posture. | partial | Blocking for projections that need safe review, retry, restore, or export failure handling. |
| KD-03 Event Bus | Preserve neutral event and timeline posture for runtime steps without requiring a product event bus. | `RuntimeOrchestrator`, `TraceService`, execution event surfaces, planned `EventDutyPostureService` | runtime event timeline entries, trace-evidence, decision-record, action-unit | Events that affect runtime state or export posture must be traceable by id/ref, not treated as proof. | Expose event summaries and references only; omit internal dispatch mechanics. | Products may create local histories, but not redefine Cognitive_OS event semantics. | implicit | Non-blocking for simple projections; blocking only when reusable event posture is required. |
| KD-04 Learning Feedback | Capture neutral correction, preference, and learning-candidate posture without automatic global learning or product-specific training semantics. | `CorrectionCapturePort`, `PreferenceWritebackService`, governed learning path, planned `LearningDutyPostureService` | learning-candidate, preference-profile, memory-promotion-record, objective | Feedback evidence must identify source correction/preference refs and whether learning is candidate, accepted, rejected, or deferred. | Expose suggestion/candidate posture only; no raw training data or automatic mutation claim. | Products may surface feedback loops but cannot promote them into Cognitive_OS product law. | partial | Blocking when downstream products need reusable feedback posture. |
| KD-05 Observability | Preserve trace, evidence, omission, and export-preparation posture for runtime and projection surfaces. | `TraceService`, `ProjectionService`, `FrozenBindingService`, protocol export support, planned `ObservabilityDutyPostureService` | trace-evidence, decision-record, evidence summaries, projection envelopes | Evidence is referenceable summary, not proof or certification; omission must be explicit. | Expose evidence refs, bounded summaries, confidence/insufficiency posture, and omission markers only. | Products may format observability, but must not claim proof, certification, or hidden runtime truth. | explicit | Blocking for review packets, dashboards, exports, and audit trails. |
| KD-06 Orchestration | Run or plan ordered runtime service steps while preserving registry/binding authority and no product workflow law. | `MinimalRuntimeOrchestratorSkeleton`, `FormService`, `MemoryService`, `ActivationService`, `ConfirmService`, `TraceService`, `ReconcileService`, `ConsolidationService` | external-input-record, intent, activation-signal, confirm-gate, trace-evidence, conflict-case | Orchestration must produce enough trace/decision posture to reconstruct bounded step outcomes. | Expose step summaries and safe outcome posture, not internal runtime control payloads. | Products may compose journeys from orchestration outputs but do not own orchestration law. | explicit | Blocking for any product projection that depends on repeatable runtime step order. |
| KD-07 Performance | Maintain deterministic bounded runtime behavior and future measurable posture without declaring product service-level objectives. | state stores, in-memory stores, SQLite store, planned `PerformanceDutyPostureService` | store snapshots, runtime state projections, object records | Performance posture should be auditable through deterministic tests, bounded record counts, and timing notes where needed. | Expose bounded performance indicators only when defined; no product readiness guarantee. | Products may set their own UX targets but cannot treat them as Cognitive_OS duty semantics. | implicit | Non-blocking now; becomes blocking when public-scale or multi-product performance claims appear. |
| KD-08 Protocol Versioning | Preserve protocol-source, binding-version, export-rule, and runtime-version boundaries without changing MPLP. | `FrozenBindingService`, `FrozenRegistryService`, frozen truth loader, release governance | protocol binding refs, registry entries, export rules, import locks | Version posture must cite source versions and distinguish protocol truth from runtime interpretation. | Expose version refs and binding refs only; do not imply protocol updates or certification. | Products consume version posture but cannot claim MPLP changes or endorsement. | partial | Blocking for exports and external claims that cite protocol compatibility. |
| KD-09 Security | Keep runtime-private state private, enforce omission, restrict exportability, and prevent unsafe side-effect semantics from leaking into projections. | `ProjectionService`, `FrozenBindingService`, export rules, execution boundary contract, planned `SecurityDutyPostureService` | runtime-private object families, projection envelopes, execution-boundary envelopes | Security evidence must show omission, rejection, or non-exportability posture where relevant. | Expose only safe fields and explicit omission markers; reject forbidden raw/private/export fields. | Products may consume safe envelopes only and must not request raw runtime law as product DTOs. | partial | Blocking for any projection-safe export, dashboard, packet, or user-facing surface. |
| KD-10 State Sync | Maintain project-scoped runtime state, continuity, snapshot, replay, and projection consistency across neutral stores. | VSL service/store, state stores, projection store, `RuntimeOrchestrator`, planned `StateSyncDutyPostureService` | project, objective, work-item, continuity state, lifecycle projections, snapshots | State-sync evidence must show project scope, continuity id, source refs, and omission posture. | Expose continuity/snapshot summaries, not raw VSL/PSG/Trace payloads. | Products may store product-local workspace state, but Cognitive_OS owns neutral state-sync posture. | partial | Blocking for product projections needing return, continuation, recovery, or export snapshots. |
| KD-11 Transaction | Preserve deterministic commit, rollback, snapshot, and export consistency posture for runtime changes without claiming full distributed transactions. | state stores, SQLite store, projection store, planned `TransactionDutyPostureService` | state snapshots, object records, export-preparation summaries, decision-record | Transaction evidence must record accepted, blocked, rolled back, or exported snapshot posture where available. | Expose commit/snapshot posture only as bounded summary; do not expose internal store payloads. | Products may require consistent packets or workspaces but must consume neutral transaction posture. | implicit | Blocking when a product projection depends on consistent saved history or export snapshot truth. |

## 5. Machine-Readable Binding

`bindings/mplp-kernel-duty-coregentis-binding.v0.yaml` is the canonical
machine-readable artifact for this baseline. It contains all 11 MPLP Kernel
Duties exactly once and binds each duty to:

- Cognitive_OS responsibility
- owner services or planned owner services
- runtime object families
- evidence posture
- projection-safe exposure rule
- product boundary rule
- implementation status

## 6. Explicit Boundaries

- This baseline does not change MPLP protocol, schema, taxonomy, profile, or
  invariant files.
- This baseline does not create product-specific Cognitive_OS runtime law.
- Product projections consume duty posture but do not define duty semantics.
- This baseline does not claim all Kernel Duties are fully implemented.
- This baseline does not create release, tag, package, publish artifact, or
  protocol certification.

## 7. Next Step

Future runtime work may introduce neutral duty-posture helper services only if
they remain product-agnostic and projection-safe. Product-specific vocabulary,
journeys, dashboards, packets, or workflows belong downstream of this binding.

Decision: `CGOS_KERNEL_DUTY_BINDING_BASELINE_READY`.
