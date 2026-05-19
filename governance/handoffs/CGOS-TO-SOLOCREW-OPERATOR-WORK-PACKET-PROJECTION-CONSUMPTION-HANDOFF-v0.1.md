# CGOS-TO-SOLOCREW-OPERATOR-WORK-PACKET-PROJECTION-CONSUMPTION-HANDOFF-v0.1

## 1. Document Control

- doc_id: CGOS-TO-SOLOCREW-OPERATOR-WORK-PACKET-PROJECTION-CONSUMPTION-HANDOFF-v0.1
- task_id: PROJECTION-CONSUMPTION-HANDOFF
- status: HANDOFF_READY
- date: 2026-05-19
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- primary_repo: Cognitive_OS
- reference_only_repos: SoloCrew, MPLP-Protocol
- source_contract_files:
  - `runtime/public/operator-work-packet-handoff-dto.ts`
  - `runtime/public/operator-work-packet-handoff-bundle.ts`
- source_commit: 85cbe5d46f0c37e0bc466c98ad9bed97bdd6b58c
- no_runtime_behavior_change: true
- no_solocrew_app_implementation: true
- no_provider_execution: true
- no_worker_execution_bridge: true
- no_mplp_schema_change: true
- no_mplp_protocol_law_change: true
- no_mplp_normative_binding_change: true
- no_package_publication: true

## 2. Repo Truth Snapshot

| Repo | URL | Branch | Local HEAD | origin HEAD | Worktree status |
| --- | --- | --- | --- | --- | --- |
| Cognitive_OS | https://github.com/Coregentis/Cognitive_OS.git | main | 85cbe5d46f0c37e0bc466c98ad9bed97bdd6b58c | 85cbe5d46f0c37e0bc466c98ad9bed97bdd6b58c | approved untracked `.DS_Store` noise only |
| SoloCrew | https://github.com/Coregentis/SoloCrew.git | main | efd50070f01a7fb1a0ece92b0c476edbf742764a | efd50070f01a7fb1a0ece92b0c476edbf742764a | clean |
| MPLP-Protocol | https://github.com/Coregentis/MPLP-Protocol.git | main | 214939ab6ba522036d376868d1fe8d04d960420f | 214939ab6ba522036d376868d1fe8d04d960420f | approved untracked `.DS_Store` noise only |

## 3. Handoff Purpose

This handoff authorizes downstream planning and later consumption of the
Cognitive_OS public projection-safe operator work-packet contract. It does not
authorize SoloCrew to consume runtime-private internals, reuse sealed legacy
bridges as compliant evidence, or infer execution capability from projection
posture.

The handoff is Cognitive_OS-side guidance for downstream consumption. Product
surface names in this record are downstream interpretation examples only and do
not become Cognitive_OS canonical naming.

## 4. Allowed Downstream Imports

For operator work-packet consumption, downstream products may import only these
source-local public contract files:

- `runtime/public/operator-work-packet-handoff-dto.ts`
- `runtime/public/operator-work-packet-handoff-bundle.ts`

Equivalent package export paths are:

- `./runtime/public/operator-work-packet-handoff-dto`
- `./runtime/public/operator-work-packet-handoff-bundle`

These exports are approved for projection-safe DTOs, deterministic helper
validation, deterministic helper summary, boundary flags, MPLP 10-module
posture, advanced runtime refs/markers, and Kernel Duty posture only.

## 5. Explicitly Forbidden Downstream Imports

This handoff does not authorize downstream import or use of:

- `runtime/core`
- `runtime/state`
- `runtime/in-memory`
- `runtime/private`
- runtime stores
- SQLite handles
- provider internals
- dispatcher handles
- service instances
- constructors
- mutable handles
- worker-private state
- raw prompts
- raw traces
- model responses
- provider responses
- sealed legacy SoloCrew bridge paths as evidence of compliant consumption

The sealed legacy SoloCrew bridge remains legacy-only debt. It must not be used
for OPC Foundation paths and must not be cited as proof of projection-safe
Cognitive_OS consumption.

## 6. SoloCrew Product Consumption Guidance

| Cognitive_OS field/component | Permitted SoloCrew display/use | Prohibited interpretation | Required label/posture |
| --- | --- | --- | --- |
| `OperatorIntentSummary` | Secretary intent intake display | not a raw prompt and not full Dialog runtime | intent summary with raw input omitted |
| `WorkIntakeSummary` | Secretary clarification/intake state | not autonomous task creation | intake posture with blocked/deferred/insufficient state |
| `WorkPacketSummary` | mission/work packet card | not proof of execution | objective and constraints summary only |
| `AssignmentSummary` | Cell assignment display | not runtime worker dispatch | assignment status without dispatch authority |
| `WorkerActivitySummary` | AI Worker activity surface | not real provider execution | projection-safe activity summary |
| `ReviewableOutputSummary` | Review Queue item | not final accepted delivery | reviewable output awaiting judgment |
| `AcceptanceStateSummary` | accept/revise/reject/parked state | not autonomous acceptance | human judgment posture |
| `OperatorFeedbackSummary` | feedback/correction candidate | not training authority and not automatic writeback | correction/preference candidate only |
| `DeliveryArtifactSummary` | Delivery Vault reference | not publishing and not external delivery | artifact reference with private payload omitted |
| `ContinuityPointer` | continue next session/history | not full Company Reality Model | continuation reference with PSG omission or pointer |
| `AdvancedRuntimePosture` | show refs/omission markers for Dialog, AEL, VSL, PSG, drift, and learning | not full runtime implementation | refs, markers, and omissions only |
| `KernelDutyPosture` | internal boundary/status display or hidden developer view | not certification, compliance, or assurance | posture metadata only |
| `ProjectionSafeEnvelope` | validation and boundary guard | not protocol conformance certification | projection-safe guard with non-execution boundary |

## 7. Required SoloCrew App Implementation Constraints

Future SoloCrew implementation must:

- consume only public package exports approved for this handoff;
- never use the sealed legacy bridge for OPC Foundation;
- keep fake/local bounded motion separate from real execution;
- label `WorkerActivitySummary` as projection-safe activity summary until a
  separately authorized provider bridge exists;
- label AEL, VSL, PSG, Intent Drift, Semantic Loss, Dialog, and Learning as
  refs, markers, or omissions, not implemented runtime;
- preserve no-provider, no-tool, no-channel, no-payment, no-publishing, and
  no-customer-outreach boundaries;
- preserve no-training and no-automatic-mutation boundaries;
- preserve MPLP-bound posture without changing MPLP;
- avoid treating Kernel Duty posture as certification, compliance, assurance,
  endorsement, regulator approval, or official status.

## 8. Required Future SoloCrew Tests

Future SoloCrew implementation must add tests that prove:

- only the approved public Cognitive_OS exports are imported;
- runtime-private Cognitive_OS imports fail boundary checks;
- the sealed legacy bridge is not used in the OPC Foundation path;
- acceptance states are rendered only from the allowed enum;
- `WorkerActivitySummary` is rendered without claiming provider execution;
- `DeliveryArtifactSummary` is rendered without publishing or export authority;
- no-training and no-automatic-mutation boundaries remain visible;
- Kernel Duty posture is internal/status metadata, not a compliance claim;
- advanced runtime posture is represented as refs, markers, or omissions only.

## 9. Contract Truth Confirmed

The source contract files expose:

- public projection-safe DTO and helper surfaces;
- package exports for the DTO and helper;
- all 10 MPLP modules including `Dialog`;
- all 11 Kernel Duties in `KernelDutyPosture`;
- Dialog, Intent Drift, Semantic Loss, PSG, AEL, VSL, and Learning as
  projection-safe refs, markers, or omission posture only;
- deterministic helper assembly, validation, normalization, and summary only;
- no provider dispatch, channel dispatch, tool invocation, payment,
  publishing, customer outreach, autonomous external action, training
  authority, automatic mutation, package publication, runtime store access, or
  runtime-private payload access.

## 10. Handoff Decision

- decision: HANDOFF_READY
- next_allowed_task: SOLOCREW-OPC-FOUNDATION-APP-IMPLEMENTATION

This decision means the Cognitive_OS public operator work-packet contract is
ready for downstream consumption planning and a later SoloCrew OPC Foundation
implementation wave. It does not implement that downstream app wave.

## 11. Machine-readable Handoff Map

The block below is used by tests. It is non-normative and records only this
handoff's consumption boundary.

<!-- CGOS_OPERATOR_WORK_PACKET_CONSUMPTION_HANDOFF_START -->
```json
{
  "document_control": {
    "doc_id": "CGOS-TO-SOLOCREW-OPERATOR-WORK-PACKET-PROJECTION-CONSUMPTION-HANDOFF-v0.1",
    "task_id": "PROJECTION-CONSUMPTION-HANDOFF",
    "status": "HANDOFF_READY",
    "authority_order": "MPLP -> Cognitive_OS -> SoloCrew",
    "source_commit": "85cbe5d46f0c37e0bc466c98ad9bed97bdd6b58c",
    "no_runtime_behavior_change": true,
    "no_solocrew_app_implementation": true,
    "no_provider_execution": true,
    "no_worker_execution_bridge": true,
    "no_mplp_schema_change": true,
    "no_mplp_protocol_law_change": true,
    "no_mplp_normative_binding_change": true,
    "no_package_publication": true
  },
  "allowed_source_paths": [
    "runtime/public/operator-work-packet-handoff-dto.ts",
    "runtime/public/operator-work-packet-handoff-bundle.ts"
  ],
  "allowed_package_exports": [
    "./runtime/public/operator-work-packet-handoff-dto",
    "./runtime/public/operator-work-packet-handoff-bundle"
  ],
  "forbidden_import_paths": [
    "runtime/core",
    "runtime/state",
    "runtime/in-memory",
    "runtime/private"
  ],
  "forbidden_runtime_private_assets": [
    "runtime stores",
    "SQLite handles",
    "provider internals",
    "dispatcher handles",
    "service instances",
    "constructors",
    "mutable handles",
    "worker-private state",
    "raw prompts",
    "raw traces",
    "model responses",
    "provider responses"
  ],
  "legacy_bridge_rule": {
    "sealed_legacy_bridge_allowed_for_opc_foundation": false,
    "legacy_bridge_is_compliant_consumption_evidence": false,
    "legacy_bridge_must_remain_legacy_only": true
  },
  "field_to_product_surface_guidance": [
    {
      "cognitive_os_component": "OperatorIntentSummary",
      "permitted_solocrew_display": "Secretary intent intake display",
      "prohibited_interpretation": "raw prompt or full Dialog runtime",
      "required_posture": "intent summary with raw input omitted"
    },
    {
      "cognitive_os_component": "WorkIntakeSummary",
      "permitted_solocrew_display": "Secretary clarification/intake state",
      "prohibited_interpretation": "autonomous task creation",
      "required_posture": "intake posture with blocked/deferred/insufficient state"
    },
    {
      "cognitive_os_component": "WorkPacketSummary",
      "permitted_solocrew_display": "mission/work packet card",
      "prohibited_interpretation": "proof of execution",
      "required_posture": "objective and constraints summary only"
    },
    {
      "cognitive_os_component": "AssignmentSummary",
      "permitted_solocrew_display": "Cell assignment display",
      "prohibited_interpretation": "runtime worker dispatch",
      "required_posture": "assignment status without dispatch authority"
    },
    {
      "cognitive_os_component": "WorkerActivitySummary",
      "permitted_solocrew_display": "AI Worker activity surface",
      "prohibited_interpretation": "real provider execution",
      "required_posture": "projection-safe activity summary"
    },
    {
      "cognitive_os_component": "ReviewableOutputSummary",
      "permitted_solocrew_display": "Review Queue item",
      "prohibited_interpretation": "final accepted delivery",
      "required_posture": "reviewable output awaiting judgment"
    },
    {
      "cognitive_os_component": "AcceptanceStateSummary",
      "permitted_solocrew_display": "accept/revise/reject/parked state",
      "prohibited_interpretation": "autonomous acceptance",
      "required_posture": "human judgment posture"
    },
    {
      "cognitive_os_component": "OperatorFeedbackSummary",
      "permitted_solocrew_display": "feedback/correction candidate",
      "prohibited_interpretation": "training authority or automatic writeback",
      "required_posture": "correction/preference candidate only"
    },
    {
      "cognitive_os_component": "DeliveryArtifactSummary",
      "permitted_solocrew_display": "Delivery Vault reference",
      "prohibited_interpretation": "publishing or external delivery",
      "required_posture": "artifact reference with private payload omitted"
    },
    {
      "cognitive_os_component": "ContinuityPointer",
      "permitted_solocrew_display": "continue next session/history",
      "prohibited_interpretation": "full Company Reality Model",
      "required_posture": "continuation reference with PSG omission or pointer"
    },
    {
      "cognitive_os_component": "AdvancedRuntimePosture",
      "permitted_solocrew_display": "refs/omission markers for Dialog, AEL, VSL, PSG, drift, and learning",
      "prohibited_interpretation": "full runtime implementation",
      "required_posture": "refs, markers, and omissions only"
    },
    {
      "cognitive_os_component": "KernelDutyPosture",
      "permitted_solocrew_display": "internal boundary/status display or hidden developer view",
      "prohibited_interpretation": "certification, compliance, or assurance",
      "required_posture": "posture metadata only"
    },
    {
      "cognitive_os_component": "ProjectionSafeEnvelope",
      "permitted_solocrew_display": "validation and boundary guard",
      "prohibited_interpretation": "protocol conformance certification",
      "required_posture": "projection-safe guard with non-execution boundary"
    }
  ],
  "future_solocrew_constraints": [
    "consume_only_public_package_exports",
    "never_use_sealed_legacy_bridge_for_opc_foundation",
    "keep_fake_local_bounded_motion_separate_from_real_execution",
    "label_worker_activity_as_projection_safe_activity_summary",
    "label_advanced_substrates_as_refs_markers_or_omissions",
    "preserve_no_provider_tool_channel_payment_publishing_customer_outreach",
    "preserve_no_training_and_no_automatic_mutation",
    "preserve_mplp_bound_posture_without_changing_mplp"
  ],
  "future_solocrew_tests": [
    "import_only_public_cognitive_os_exports",
    "fail_on_runtime_private_imports",
    "fail_if_sealed_legacy_bridge_is_used_in_opc_foundation_path",
    "render_only_allowed_acceptance_states",
    "render_worker_activity_without_provider_execution_claim",
    "render_delivery_artifact_without_publishing_or_export_authority",
    "preserve_no_training_no_automatic_mutation",
    "preserve_kernel_duty_posture_as_status_metadata_not_compliance_claim",
    "preserve_advanced_runtime_refs_as_refs_markers_or_omissions"
  ],
  "handoff_decision": "HANDOFF_READY",
  "next_allowed_task": "SOLOCREW-OPC-FOUNDATION-APP-IMPLEMENTATION"
}
```
<!-- CGOS_OPERATOR_WORK_PACKET_CONSUMPTION_HANDOFF_END -->
