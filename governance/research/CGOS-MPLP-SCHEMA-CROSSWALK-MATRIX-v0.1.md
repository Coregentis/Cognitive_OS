# CGOS-MPLP-SCHEMA-CROSSWALK-MATRIX-v0.1

## Purpose

This matrix cross-checks the currently relevant MPLP public schemas against the accepted Cognitive_OS R6 export layer.

Public MPLP truth source used for this matrix:

- repository: `https://github.com/Coregentis/MPLP-Protocol.git`
- locked commit: `8df1f0a4151d74b02b03f3807380ea33d5fadad6`

## Crosswalk

| MPLP artifact family | Public MPLP schema source | Required fields | Current Cognitive_OS export support | Supporting Cognitive_OS evidence | Alignment judgment | Blockers to canonical / full / interoperable status |
| --- | --- | --- | --- | --- | --- | --- |
| `Context` | `schemas/v2/mplp-context.schema.json` | Top-level required: `meta`, `context_id`, `root`, `title`, `status`. Nested `root` requires `domain`, `environment`. | Explicitly omitted. | `bindings/mplp-coregentis-binding-matrix.v0.yaml`: `project` not exportable; no direct Context binding. `runtime/export/protocol-export.ts`: `build_context_omission()` emits structured omission with reason codes. `governance/audits/CGOS-EXECUTION-BASELINE-R5-REVIEW-v0.1.md`: omission justified because required fields are not reconstructable. | Aligned. | No frozen binding authorizes canonical Context reconstruction. Current runtime state does not expose canonical `root`, `title`, or lifecycle `status` as MPLP truth. |
| `Plan` | `schemas/v2/mplp-plan.schema.json` | Top-level required: `meta`, `plan_id`, `context_id`, `title`, `objective`, `status`, `steps`. Each step requires `step_id`, `description`, `status`. | Explicitly omitted. | `bindings/mplp-coregentis-binding-matrix.v0.yaml`: no direct Plan binding. `runtime/export/protocol-export.ts`: `build_plan_omission()` emits structured omission with reason codes. `governance/audits/CGOS-EXECUTION-BASELINE-R5-REVIEW-v0.1.md`: internal loop plan is not treated as canonical MPLP Plan. | Aligned. | No frozen binding authorizes canonical Plan reconstruction. Current runtime loop plan is an internal execution plan, not a protocol-native Plan with canonical `objective` and `steps`. |
| `Confirm` | `schemas/v2/mplp-confirm.schema.json` | Top-level required: `meta`, `confirm_id`, `target_type`, `target_id`, `status`, `requested_by_role`, `requested_at`. Decision records, if present, require `decision_id`, `status`, `decided_by_role`, `decided_at`. | Minimal schema-valid export when confirm semantics exist; explicitly absent in `fresh-intent`. | `bindings/mplp-coregentis-binding-matrix.v0.yaml`: `confirm-gate` is `shallow_reconstructable_runtime_bound`. `bindings/coregentis-export-rules.v0.yaml`: `confirm-gate` is `protocol_compliant_export`. `runtime/export/protocol-export.ts`: `build_confirm_artifact()` reconstructs exported fields; export path validates against locked schema and records bounded errors. `tests/runtime/minimal-loop.test.mjs`: exported artifact is asserted and schema-valid. | Partially aligned. | Export is schema-valid but not canonical: `target_type` is currently `"other"` because the governed target is a runtime action unit rather than a canonical MPLP `Context`, `Plan`, or `Trace`. No evidence of full artifact completeness or interoperability guarantee. |
| `Trace` | `schemas/v2/mplp-trace.schema.json` | Top-level required: `meta`, `trace_id`, `context_id`, `root_span`, `status`. Nested `root_span` requires `trace_id`, `span_id`. Optional trace segments, events, `plan_id`, `started_at`, `finished_at` remain absent unless reconstructable. | Minimal schema-valid export for both current scenarios. | `bindings/mplp-coregentis-binding-matrix.v0.yaml`: `trace-evidence` is `shallow_reconstructable_runtime_bound`. `bindings/coregentis-export-rules.v0.yaml`: `trace-evidence` is `protocol_compliant_export`. `runtime/export/protocol-export.ts`: `build_trace_artifact()` reconstructs exported fields; export path validates against locked schema and records bounded errors. `tests/runtime/minimal-loop.test.mjs`: exported artifacts for both scenarios are asserted and schema-valid. | Partially aligned. | Export is schema-valid but not canonical: `context_id` currently reuses the neutral project-scope anchor while canonical MPLP `Context` remains omitted; no canonical `Plan` linkage, segments, events, or interoperability proof exists. |

## Export Layer Classification

Per-family classification:

- `Context`: `explicitly omitted`
- `Plan`: `explicitly omitted`
- `Confirm`: `minimal schema-valid export`
- `Trace`: `minimal schema-valid export`

Current overall export-layer classification:

- `minimal schema-valid export`

Current classifications explicitly rejected by evidence:

- `canonical export`
- `full artifact completeness`
- `interoperability-guaranteed`

## Evidence Basis

The judgments above are based on:

- public MPLP schemas under the locked commit
- frozen Cognitive_OS binding matrix
- frozen Cognitive_OS export rules
- current `runtime/export/protocol-export.ts` implementation
- accepted R5 / R6 audit notes
