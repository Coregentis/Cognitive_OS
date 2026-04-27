# CGOS-BINDING-LAYER-RELATIONSHIP-AUDIT-v0.1

## 1. Document Control

- doc_id: CGOS-BINDING-LAYER-RELATIONSHIP-AUDIT-v0.1
- task_id: CGOS-BINDING-LAYER-RELATIONSHIP-AUDIT-01
- status: Binding Layer Relationship Audit
- authority_order: MPLP -> Cognitive_OS -> Product Projections
- primary_repo: Cognitive_OS
- audit_scope: relationship between object/semantic binding and Kernel Duty binding
- audit_posture: audit-only; no binding refactor; no runtime implementation

## 2. Remote Truth Snapshot

| Repo | URL | Branch | Local HEAD | origin/main HEAD | Worktree | Relevant tags |
| --- | --- | --- | --- | --- | --- | --- |
| Cognitive_OS | https://github.com/Coregentis/Cognitive_OS.git | main | a022d33fa5814299f799b65f8e74243f413a014d | a022d33fa5814299f799b65f8e74243f413a014d | clean | cgos-projection-revision-runtime-rc-20260421 |
| MPLP-Protocol | https://github.com/Coregentis/MPLP-Protocol.git | main | 0cf0477938340a443614d03d9fb51ac764b960c7 | 0cf0477938340a443614d03d9fb51ac764b960c7 | clean | protocol-v1.0.0, v1.0.0 |
| SoloCrew | https://github.com/Coregentis/SoloCrew.git | main | 72a9f79054051527b9a28aa7c4435bf80d148d94 | 72a9f79054051527b9a28aa7c4435bf80d148d94 | clean | solocrew-v2.1-rc-review-only-chain-20260427 |

## 3. Scope and Non-Goals

This audit inspects:

- `bindings/mplp-coregentis-binding-matrix.v0.yaml`
- `bindings/mplp-kernel-duty-coregentis-binding.v0.yaml`
- `bindings/coregentis-export-rules.v0.yaml`
- `registry/coregentis-object-registry.v0.yaml`
- `runtime/core/binding-service.ts`
- `runtime/core/runtime-types.ts`
- `governance/baselines/CGOS-KERNEL-DUTY-BINDING-BASELINE-v0.1.md`
- `governance/audits/CGOS-BINDING-REVIEW-R3-v0.1.md`
- MPLP Kernel Duty SSOT and informative duty-matrix pages
- SoloCrew V2.2 duty audit and V2.2 planning context

Non-goals:

- no MPLP protocol, schema, taxonomy, profile, or invariant change
- no existing binding YAML modification
- no third binding or coverage matrix creation
- no Cognitive_OS runtime behavior implementation
- no product-specific Cognitive_OS runtime law
- no SoloCrew V2.2 implementation
- no release, tag, package, publish artifact, certification, or endorsement

## 4. Object/Semantic Binding Summary

Primary artifact:

- `bindings/mplp-coregentis-binding-matrix.v0.yaml`

Architectural question answered:

> What is this Coregentis object relative to MPLP protocol semantics?

Evidence:

- The matrix shape is object-indexed: `coregentis_object`, `mplp_object`, `binding_class`, `import_rule`, `export_rule`, `reconstruction_rule`, `compatibility_notes`, `runtime_substrate_hint`.
- `governance/audits/CGOS-BINDING-REVIEW-R3-v0.1.md` freezes this shape as the binding-entry family.
- `runtime/core/binding-service.ts` loads this object binding and export rules to plan protocol import/export by object type.
- `runtime/core/runtime-types.ts` models `BindingMatrixEntryRecord`, `RuntimeProtocolBindingRef`, `ExportRuleRecord`, and object-level binding classes.

Authority owned by this layer:

- object identity relative to MPLP semantics
- import posture
- export posture
- reconstructability posture
- compatibility boundary
- runtime-private versus protocol-adjacent versus shallow reconstructable object classification

This layer does not assign Kernel Duties to runtime services, evidence posture, or product projection exposure rules.

## 5. Kernel Duty Binding Summary

Primary artifact:

- `bindings/mplp-kernel-duty-coregentis-binding.v0.yaml`

Architectural question answered:

> Which cross-cutting MPLP duties govern this runtime responsibility, service posture, evidence posture, and projection-safe exposure?

Evidence:

- The artifact is duty-indexed: `id`, `name`, `slug`, `cognitive_os_responsibility`, `owner_services`, `runtime_object_families`, `evidence_posture`, `projection_safe_exposure`, `product_boundary_rule`, `implementation_status`.
- `tests/governance/kernel-duty-binding.test.mjs` verifies all 11 duties match the MPLP SSOT and that forbidden product terms do not appear in the machine-readable binding.
- `governance/baselines/CGOS-KERNEL-DUTY-BINDING-BASELINE-v0.1.md` explicitly distinguishes protocol duty definition, Cognitive_OS duty realization, and product projection duty exposure.

Authority owned by this layer:

- duty responsibility posture
- neutral owner service or planned owner service posture
- evidence and trace posture by duty
- projection-safe exposure rules
- product boundary rules
- blocking relevance of each duty for product projections

This layer does not define object import/export, MPLP object equivalence, or object reconstructability.

## 6. Overlap Matrix

| Shared surface | Relationship classification | Evidence | Judgment |
| --- | --- | --- | --- |
| confirm-gate | COMPLEMENTARY_CROSS_AXIS | Object binding marks `confirm-gate` as shallow reconstructable to MPLP Confirm; Kernel Duty binding references confirm services under KD-06 and version/export posture under KD-08/KD-09. | No duplication. Object binding owns Confirm object semantics; duty binding owns orchestration/security/version obligations around confirm usage. |
| trace-evidence | COMPLEMENTARY_CROSS_AXIS | Object binding marks `trace-evidence` as shallow reconstructable to MPLP Trace; export rules allow narrow protocol export; duty binding references trace under KD-03/KD-05/KD-06. | No conflict. Object binding governs exportability; duty binding governs observability/event/orchestration posture. |
| decision-record | LEGITIMATE_OVERLAP | Object binding/export rules classify it runtime-private/non-exportable; duty binding uses decision refs in coordination, error handling, transaction, and observability posture. | Legitimate overlap. The same object can be private by object semantics and still serve duty evidence internally. |
| projection-envelope / projection-safe exposure | LEGITIMATE_OVERLAP | Object binding does not define projection-envelope identity; Kernel Duty binding defines projection-safe exposure rules across duties. | Not duplication. Duty binding covers exposure posture; object binding remains object/protocol focused. |
| export-rule | COMPLEMENTARY_CROSS_AXIS | `coregentis-export-rules.v0.yaml` classifies object export eligibility; Kernel Duty binding KD-05/KD-08/KD-09 references export, version, omission, and certification boundaries. | Complementary. Export rules are object-level decisions; duty binding sets cross-cutting constraints around export posture. |
| protocol-binding-ref | COMPLEMENTARY_CROSS_AXIS | Runtime types and object binding use `protocol_binding_ref` for shallow reconstructability; Kernel Duty binding KD-08 says expose version/binding refs without implying protocol updates. | No conflict. Object binding owns reference semantics; duty binding owns versioning and product-claim boundaries. |
| runtime-private omission | LEGITIMATE_OVERLAP | Object binding/export rules classify private/non-exportable objects; projection services and duty binding KD-09 require omission markers and safe exposure. | Legitimate overlap. Private-object classification and duty-level security exposure reinforce each other. |
| state/snapshot/continuity posture | NEEDS_FUTURE_CROSSWALK | Object binding gives runtime substrate hints such as VSL/multi-substrate; runtime types include continuity/snapshot; duty binding KD-10/KD-11 owns state sync and transaction posture. | Not a current conflict. A future object-duty coverage crosswalk may be useful after more runtime/product usage evidence. |
| evidence posture | COMPLEMENTARY_CROSS_AXIS | Object binding classifies `trace-evidence` and `decision-record`; duty binding KD-02/KD-05/KD-09 defines evidence summaries, insufficiency, omission, and proof/certification boundaries. | Complementary. Object binding says what evidence objects are; duty binding says how evidence must behave across responsibilities. |
| event/timeline posture | SAFE_DEFER | Object binding references event-family semantics for `intent`/`delta-intent`; runtime has event timeline entries; duty binding KD-03 defines event posture but no full bus. | Safe defer. No third event binding is needed until reusable event bus semantics become necessary. |

## 7. Conflict/Duplication Analysis

No `TRUE_DUPLICATION` was found.

No `POTENTIAL_CONFLICT` was found.

The apparent overlaps are caused by shared runtime surfaces that naturally sit at the intersection of two axes:

- object/protocol semantic axis: what object is this, can it be imported/exported, and how is protocol meaning reconstructed?
- cross-cutting duty axis: what obligation constrains a service, evidence posture, projection exposure, or product boundary?

The new Kernel Duty binding does not claim that objects such as `confirm-gate` or `trace-evidence` are MPLP-native, exportable, or reconstructable. It only cites object families as involved runtime surfaces. The object binding does not claim to own duty responsibility, owner services, or product projection consumption rules.

## 8. Complementarity Analysis

The two binding layers are orthogonal and complementary:

- Object/Semantic Binding answers: "What is this Coregentis object relative to MPLP protocol semantics?"
- Kernel Duty Binding answers: "Which MPLP cross-cutting duties govern this neutral runtime responsibility and projection-safe exposure posture?"
- Product Projection Consumption answers: "How can a downstream product consume object posture plus duty posture without defining protocol or runtime law?"

Together they give downstream products two independent reads:

1. object/export safety: whether an object or derived artifact can be exposed, summarized, reconstructed, or exported;
2. duty posture: which cross-cutting obligations must be preserved when a product builds history, review packets, dashboards, or export surfaces.

## 9. Product Projection Consumption Rule

Product projections must consume both layers in this order:

1. Use `mplp-coregentis-binding-matrix.v0.yaml` and `coregentis-export-rules.v0.yaml` to determine object identity, import/export posture, reconstructability, and runtime-private omission.
2. Use `mplp-kernel-duty-coregentis-binding.v0.yaml` to determine duty responsibility posture, owner service expectations, evidence posture, projection-safe exposure, and product-boundary requirements.
3. Render product-specific journeys, dashboards, packets, and local histories only after the first two reads; product surfaces may not redefine object semantics or duty semantics.

For SoloCrew V2.2 specifically, implementation should:

- use object/export binding to avoid exporting raw runtime-private objects or overclaiming MPLP reconstructability;
- use Kernel Duty binding to tag workspace continuity, saved history, review packet export, evidence trail, and dashboard continuation acceptance checks;
- keep product-local workspace and review-packet semantics downstream of Cognitive_OS;
- avoid treating product history as a Cognitive_OS event bus or product packet consistency as a full Cognitive_OS transaction layer.

## 10. Third Object-Duty Coverage Matrix Decision

Decision: defer.

A third derived object-duty coverage matrix is not needed now. The current overlap is understandable without another artifact, and adding a matrix now would likely create document sprawl and premature authority. A future object-duty coverage matrix may be justified if one of these conditions appears:

- multiple product projections repeatedly ask which duties apply to specific object families;
- V2.2/V2.3 implementation reviews reveal ambiguous duty ownership for object surfaces;
- runtime services begin enforcing duty posture programmatically by object family;
- event/timeline or continuity/transaction surfaces need reusable cross-object coverage gates.

Until then, this audit is sufficient as a governance cross-reference.

## 11. Recommended Minimal Next Actions

1. Keep both binding YAML files unchanged.
2. Use this audit as the cross-reference between object binding and duty binding.
3. In future product implementation plans, require both object/export posture and Kernel Duty posture to be cited for projection-safe exports.
4. Defer a third object-duty matrix until actual implementation ambiguity appears.
5. If future docs are edited, add only minimal cross-reference language rather than changing binding semantics.

## 12. Explicit No MPLP Change Statement

No MPLP-Protocol files are modified or recommended for modification by this audit. MPLP remains the authority for the frozen Kernel Duty taxonomy and protocol object schemas. This audit does not change protocol, schema, taxonomy, invariants, profiles, certification posture, or endorsement posture.

## 13. Explicit No Product-Specific Runtime Law Statement

This audit does not create product-specific Cognitive_OS runtime law. Product projection terms and downstream journeys remain outside Cognitive_OS binding semantics.

## 14. Explicit No SoloCrew Implementation Statement

This audit does not implement SoloCrew V2.2 and does not modify SoloCrew. It only clarifies how a product projection should consume Cognitive_OS object/export binding and Kernel Duty binding later.

## 15. Final Decision

BINDING_LAYER_RELATIONSHIP_PASS_WITH_FUTURE_OBJECT_DUTY_COVERAGE_DEFERRED
