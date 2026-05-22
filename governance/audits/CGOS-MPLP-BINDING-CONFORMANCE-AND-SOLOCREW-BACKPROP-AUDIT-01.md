---
doc_id: CGOS-MPLP-BINDING-CONFORMANCE-AND-SOLOCREW-BACKPROP-AUDIT-01
version: v0.1
status: research_complete
scope: mplp_schema_inventory_cgos_binding_conformance_solocrew_backpropagation
created_at: 2026-05-22
repos:
  cognitive_os:
    url: https://github.com/Coregentis/Cognitive_OS.git
    branch: main
    local_head: 373656c0b3312cbfad7be912d058c7ed4ee8c9cd
    origin_head: 373656c0b3312cbfad7be912d058c7ed4ee8c9cd
    status: "tracked clean; untracked .DS_Store noise present"
    latest_tags:
      - cgos-projection-revision-runtime-rc-20260421
  mplp_protocol:
    url: https://github.com/Coregentis/MPLP-Protocol.git
    branch: main
    local_head: 214939ab6ba522036d376868d1fe8d04d960420f
    origin_head: 214939ab6ba522036d376868d1fe8d04d960420f
    status: "tracked clean; untracked .DS_Store noise present"
    latest_tags:
      - protocol-v1.0.0
      - v1.0.0
  solocrew:
    url: https://github.com/Coregentis/SoloCrew.git
    branch: main
    local_head: ff39ac72b371901b13b6a776ad5d7266bf0b5d0e
    origin_head: ff39ac72b371901b13b6a776ad5d7266bf0b5d0e
    status: tracked clean
    latest_tags:
      - solocrew-opc-true-mvp-candidate-v0.1
      - solocrew-opc-internal-mvp-candidate-v0.1
      - solocrew-runtime-production-baseline-v1.0-20260512
---

# CGOS MPLP Binding Conformance and SoloCrew Backprop Audit 01

## Executive Decision Summary

This audit pauses the SoloCrew P0 console shell wave and inserts the missing
MPLP -> Cognitive_OS -> SoloCrew binding layer.

The current MPLP schema truth is broader than the 10 core module schemas. The
inventory found 68 JSON/YAML files under `MPLP-Protocol/schemas/`, including
core modules, common schemas, events, integration events, invariants, learning
schemas, profiles, taxonomy, examples, and manifests. The current
`Cognitive_OS/imports/mplp-lock.yaml` still pins the MPLP schema import to
`8df1f0a4151d74b02b03f3807380ea33d5fadad6`; a direct schema diff from that
commit to current MPLP `main` shows no schema-path changes, so this audit can
read current MPLP `main` as schema-equivalent to the import lock for the
inventoryed files.

Cognitive_OS is partly aligned:

- `operator-work-packet-handoff-dto` and `operator-work-packet-handoff-bundle`
  are real package-exported, projection-safe public contracts mapped to the 10
  MPLP modules and all 11 kernel duties.
- `operator-review-loop-*` surfaces cover review-loop evidence posture but are
  bounded to local/review/evidence bundles.
- runtime-private AEL, VSL, PSG, drift, learning, confirm, trace, and state
  stores exist and are tested, but they are not safe public contracts.
- first/second/third-wave public DTOs expose useful summaries, yet several
  source files still state "Not package-exported yet" even though `package.json`
  now exports them; this is documentation drift in comments, not a package-map
  failure.

The SoloCrew P0 shell is therefore not cleared as a full P0 implementation yet.
It may reuse existing public operator work-packet, review, evidence, action
boundary, session, worker, and continuity summary DTOs for a reduced or
scaffolded read-only display, but the full Personal MVP v1.0 P0 shell is blocked
until Cognitive_OS adds or selects one neutral public projection-safe contract
for memory/continuity/direction-change aggregation.

Final verdict:

`B. BLOCKED_UNTIL_CGOS_PUBLIC_MEMORY_CONTINUITY_CONTRACT`

Next recommended wave:

`CGOS-PERSONAL-MVP-PUBLIC-MEMORY-CONTINUITY-CONTRACT`

That wave should stay in Cognitive_OS, add no SoloCrew product names, modify no
MPLP schemas, and expose only neutral summaries, refs, review states, evidence
refs, omission markers, and no-authority boundary flags.

## Repo Truth Snapshot

| Repo | URL | Branch | Local HEAD | Origin HEAD | Status | Latest tags |
| --- | --- | --- | --- | --- | --- | --- |
| Cognitive_OS | `https://github.com/Coregentis/Cognitive_OS.git` | `main` | `373656c0b3312cbfad7be912d058c7ed4ee8c9cd` | `373656c0b3312cbfad7be912d058c7ed4ee8c9cd` | tracked clean; untracked `.DS_Store`, `governance/.DS_Store`, `runtime/.DS_Store`, `tests/.DS_Store` | `cgos-projection-revision-runtime-rc-20260421` |
| MPLP-Protocol | `https://github.com/Coregentis/MPLP-Protocol.git` | `main` | `214939ab6ba522036d376868d1fe8d04d960420f` | `214939ab6ba522036d376868d1fe8d04d960420f` | tracked clean; untracked `.DS_Store` family noise | `protocol-v1.0.0`, `v1.0.0` |
| SoloCrew | `https://github.com/Coregentis/SoloCrew.git` | `main` | `ff39ac72b371901b13b6a776ad5d7266bf0b5d0e` | `ff39ac72b371901b13b6a776ad5d7266bf0b5d0e` | clean | `solocrew-opc-true-mvp-candidate-v0.1`, `solocrew-opc-internal-mvp-candidate-v0.1`, `solocrew-runtime-production-baseline-v1.0-20260512` |

## MPLP Full Schema Inventory

Discovery command:

```bash
find schemas -type f \( -name "*.json" -o -name "*.schema.json" -o -name "*.yaml" -o -name "*.yml" \) | sort
```

Inventory count: 68 JSON/YAML files.

| # | Schema Path | Schema Kind | Primary Object(s) | Key Required Fields | Key Optional Fields | Lifecycle Layer | Relevant MPLP Module(s) | Relevant Cognitive_OS Runtime/Public Surface | Relevant SoloCrew MVP Need | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `schemas/v2/_manifests/bundle/generator-fingerprint.json` | manifest | generator fingerprint | n/a | n/a | truth-chain support | Core | import/freeze evidence only | none direct | not directly relevant to current MVP |
| 2 | `schemas/v2/_manifests/bundle/truth-source-inventory.json` | manifest | truth source inventory | n/a | n/a | truth-chain support | Core | import/freeze evidence only | none direct | not directly relevant to current MVP |
| 3 | `schemas/v2/_manifests/tsv/ref-closure.json` | manifest | ref closure | n/a | n/a | truth-chain support | Core | import/freeze evidence only | none direct | not directly relevant to current MVP |
| 4 | `schemas/v2/_manifests/xc/cross-consistency-verdict.json` | manifest | cross-consistency verdict | n/a | n/a | validation support | Core | import/freeze evidence only | none direct | not directly relevant to current MVP |
| 5 | `schemas/v2/_manifests/xc/xcv-points.yaml` | governance YAML | XCV point registry | `version`, `points` | severity mapping | validation support | Core, events, learning, invariants | binding evidence method | evidence export discipline | relevant as consistency method, not runtime law |
| 6 | `schemas/v2/_manifests/yaml/scope-domain-rule.yaml` | governance YAML | invariant scope domains | `version`, `domains` | extension policy | validation support | Core, invariants | binding guardrail | none direct | relevant to invariant scope discipline |
| 7 | `schemas/v2/common/common-types.schema.json` | JSON schema | common refs/meta defs | definitions only | n/a | common support | all | DTO version/evidence refs | all summary surfaces | supportive |
| 8 | `schemas/v2/common/events.schema.json` | JSON schema | base event | `event_id`, `event_type`, `source`, `timestamp` | `trace_id`, `data` | observability | Trace, events | runtime event summaries | Activity Timeline, Evidence Export | relevant |
| 9 | `schemas/v2/common/identifiers.schema.json` | JSON schema | identifier format | n/a | n/a | common support | all | DTO refs | all ref surfaces | supportive |
| 10 | `schemas/v2/common/learning-sample.schema.json` | JSON schema | structured learning sample | `sample_id`, `project_id`, `success_flag`, `timestamps` | `intent_before`, `plan`, `delta_intents`, `graph_before`, `graph_after`, `token_usage`, `user_feedback`, `governance_decisions` | learning support | learning, Trace, Context, Plan | governed learning test/runtime-private substrate | Learning Drawer, Three-Layer Project Memory | relevant but not a learning engine |
| 11 | `schemas/v2/common/metadata.schema.json` | JSON schema | protocol metadata | `protocol_version`, `schema_version` | timestamps, actors, tags | common support | Core | version refs | evidence/export posture | supportive |
| 12 | `schemas/v2/common/trace-base.schema.json` | JSON schema | trace/span base | `trace_id`, `span_id` | `parent_span_id`, `context_id`, `attributes` | observability | Trace | trace/evidence DTOs | Activity Timeline | relevant |
| 13 | `schemas/v2/events/mplp-event-core.schema.json` | JSON schema | core event | `event_id`, `event_type`, `event_family`, `timestamp` | `project_id`, `payload` | observability | Trace, Core | event/evidence summaries | Timeline, Evidence Export | relevant |
| 14 | `schemas/v2/events/mplp-graph-update-event.schema.json` | JSON schema | GraphUpdateEvent | via `allOf`: `event_family`, `graph_id`, `update_kind`, `node_delta`, `edge_delta` | `source_module` | PSG evidence | Trace, Context, Plan, Role, Confirm, Network | runtime-private PSG and summary refs | Three-Layer Project Memory | relevant as evidence, not PSG schema |
| 15 | `schemas/v2/events/mplp-map-event.schema.json` | JSON schema | MAP event | `event_id`, `event_type`, `timestamp`, `session_id` | `initiator_role`, `target_roles`, `payload` | profile event | Collab, Dialog, Network, Trace | worker/collab summaries | Company workspace handoff | relevant for multi-agent evidence only |
| 16 | `schemas/v2/events/mplp-pipeline-stage-event.schema.json` | JSON schema | PipelineStageEvent | via `allOf`: `event_family`, `pipeline_id`, `stage_id`, `stage_status` | `stage_name`, `stage_order` | stage lifecycle | Plan, Confirm, Collab, Core, Trace | runtime/session step summaries | Activity Timeline, Review Queue | relevant |
| 17 | `schemas/v2/events/mplp-runtime-execution-event.schema.json` | JSON schema | RuntimeExecutionEvent | via `allOf`: `event_family`, `execution_id`, `executor_kind`, `status` | `executor_role` | runtime evidence | Extension, Network, Collab, Trace | bounded execution event DTO | Timeline only; no execution authority | relevant as evidence only |
| 18 | `schemas/v2/events/mplp-sa-event.schema.json` | JSON schema | SA event | `event_id`, `event_type`, `timestamp`, `sa_id` | `context_id`, `plan_id`, `trace_id`, `payload` | profile event | Context, Plan, Trace, Role, Core | minimal loop tests | Timeline | relevant for runtime evidence only |
| 19 | `schemas/v2/examples/collab.minimal.json` | example | Collab example | example-specific | n/a | example | Collab | tests/reference only | none direct | not directly relevant to current MVP |
| 20 | `schemas/v2/examples/collab.with-events.json` | example | Collab with events | example-specific | n/a | example | Collab, Trace | tests/reference only | none direct | not directly relevant to current MVP |
| 21 | `schemas/v2/examples/confirm.minimal.json` | example | Confirm example | example-specific | n/a | example | Confirm | tests/reference only | Decision Queue | supportive example only |
| 22 | `schemas/v2/examples/confirm.with-events.json` | example | Confirm with events | example-specific | n/a | example | Confirm, Trace | tests/reference only | Decision Queue, Evidence | supportive example only |
| 23 | `schemas/v2/examples/context.minimal.json` | example | Context example | example-specific | n/a | example | Context | tests/reference only | Secretary context | supportive example only |
| 24 | `schemas/v2/examples/context.with-events.json` | example | Context with events | example-specific | n/a | example | Context, Trace | tests/reference only | Secretary context, Timeline | supportive example only |
| 25 | `schemas/v2/examples/core.minimal.json` | example | Core example | example-specific | n/a | example | Core | tests/reference only | none direct | not directly relevant to current MVP |
| 26 | `schemas/v2/examples/core.with-events.json` | example | Core with events | example-specific | n/a | example | Core, Trace | tests/reference only | evidence posture | supportive example only |
| 27 | `schemas/v2/examples/dialog.minimal.json` | example | Dialog example | example-specific | n/a | example | Dialog | tests/reference only | Secretary conversation | supportive example only |
| 28 | `schemas/v2/examples/dialog.with-events.json` | example | Dialog with events | example-specific | n/a | example | Dialog, Trace | tests/reference only | Secretary conversation timeline | supportive example only |
| 29 | `schemas/v2/examples/event.valid.json` | example | event example | example-specific | n/a | example | Trace/events | tests/reference only | Activity Timeline | supportive example only |
| 30 | `schemas/v2/examples/extension.minimal.json` | example | Extension example | example-specific | n/a | example | Extension | tests/reference only | none direct | not directly relevant to current MVP |
| 31 | `schemas/v2/examples/extension.with-events.json` | example | Extension with events | example-specific | n/a | example | Extension, Trace | tests/reference only | execution boundary | supportive only; no execution authorization |
| 32 | `schemas/v2/examples/network.minimal.json` | example | Network example | example-specific | n/a | example | Network | tests/reference only | company topology only by analogy | supportive example only |
| 33 | `schemas/v2/examples/network.with-events.json` | example | Network with events | example-specific | n/a | example | Network, Trace | tests/reference only | topology/timeline only by analogy | supportive example only |
| 34 | `schemas/v2/examples/plan.minimal.json` | example | Plan example | example-specific | n/a | example | Plan | tests/reference only | Work packet | supportive example only |
| 35 | `schemas/v2/examples/plan.with-events.json` | example | Plan with events | example-specific | n/a | example | Plan, Trace | tests/reference only | Work packet, Timeline | supportive example only |
| 36 | `schemas/v2/examples/role.minimal.json` | example | Role example | example-specific | n/a | example | Role | tests/reference only | responsibility mapping | supportive example only |
| 37 | `schemas/v2/examples/role.with-events.json` | example | Role with events | example-specific | n/a | example | Role, Trace | tests/reference only | responsibility/timeline | supportive example only |
| 38 | `schemas/v2/examples/trace.minimal.json` | example | Trace example | example-specific | n/a | example | Trace | tests/reference only | Timeline/evidence | supportive example only |
| 39 | `schemas/v2/examples/trace.with-events.json` | example | Trace with events | example-specific | n/a | example | Trace/events | tests/reference only | Timeline/evidence | supportive example only |
| 40 | `schemas/v2/integration/mplp-ci-event.schema.json` | JSON schema | CI event | `ci_provider`, `pipeline_id`, `run_id`, `status` | branch, commit, URL, stages | integration evidence | Extension, Trace | not currently public | future evidence only | not needed for P0 |
| 41 | `schemas/v2/integration/mplp-file-update-event.schema.json` | JSON schema | file update event | `file_path`, `change_type`, `timestamp` | workspace, summary, line counts | integration evidence | Extension, Trace | not currently public | future evidence only | not needed for P0 |
| 42 | `schemas/v2/integration/mplp-git-event.schema.json` | JSON schema | git event | `repo_url`, `commit_id`, `ref_name`, `event_kind`, `timestamp` | author, files, insertions, deletions | integration evidence | Extension, Trace | not currently public | Evidence Export Candidate | optional later |
| 43 | `schemas/v2/integration/mplp-tool-event.schema.json` | JSON schema | tool event | `tool_id`, `tool_kind`, `invocation_id`, `status` | times, exit code, output summary, args | integration evidence | Extension, Trace | bounded tool-event evidence only | not authorized for execution | do not treat as tool invocation authority |
| 44 | `schemas/v2/invariants/integration-invariants.yaml` | invariant YAML | integration invariants | tool/git/file/CI field rules | notes | invariant layer | Extension, Trace | future evidence validation only | future evidence export | not needed for P0 |
| 45 | `schemas/v2/invariants/learning-invariants.yaml` | invariant YAML | learning invariants | sample id/family/time/input/output | feedback/delta rules | learning invariant | learning, Trace | learning correction evidence | Learning Drawer | relevant |
| 46 | `schemas/v2/invariants/map-invariants.yaml` | invariant YAML | MAP invariants | collab participants, mode, ids | event consistency notes | profile invariant | Collab, Dialog, Network, Trace | worker/collab posture | Company routing/handoff | relevant as constraint only |
| 47 | `schemas/v2/invariants/observability-invariants.yaml` | invariant YAML | observability invariants | event id/type/family/timestamp | pipeline/graph/runtime notes | observability invariant | Trace/events | evidence refs and event summaries | Timeline, Evidence Export | relevant |
| 48 | `schemas/v2/invariants/sa-invariants.yaml` | invariant YAML | SA invariants | Context/Plan/Trace binding rules | role/step notes | profile invariant | Context, Plan, Trace, Role | minimal loop tests | Work packet/timeline | relevant |
| 49 | `schemas/v2/learning/mplp-learning-sample-core.schema.json` | JSON schema | LearningSample core | `sample_id`, `sample_family`, `created_at`, `input`, `output` | `state`, `meta` | learning schema | learning, Trace | learning evidence DTO | Learning Drawer | relevant |
| 50 | `schemas/v2/learning/mplp-learning-sample-delta.schema.json` | JSON schema | delta impact sample | via `allOf`: input `delta_id`, `intent_id`, `change_summary`; output `actual_impact_summary`, `impact_scope` | `delta_type`, risk, compensation, rollback | learning/drift | learning, Trace, Context | drift/impact runtime tests | Direction Change Confirmation | relevant; not drift object law |
| 51 | `schemas/v2/learning/mplp-learning-sample-intent.schema.json` | JSON schema | intent resolution sample | via `allOf`: input `intent_id`, `raw_request_summary`; output `final_intent_summary` | constraints, dialog turns, quality label | learning/intent | learning, Dialog, Context, Plan | intake/learning summaries | Secretary Conversation | relevant |
| 52 | `schemas/v2/mplp-collab.schema.json` | JSON schema | Collab module | `meta`, `collab_id`, `context_id`, `title`, `purpose`, `mode`, `status`, `participants`, `created_at` | `updated_at`, `trace`, `events` | core module | Collab | assignment/collab summaries | Multi-company/CEO handoff | relevant |
| 53 | `schemas/v2/mplp-confirm.schema.json` | JSON schema | Confirm module | `meta`, `confirm_id`, `target_type`, `target_id`, `status`, `requested_by_role`, `requested_at` | `reason`, `decisions`, `trace`, `events` | core module | Confirm | confirm/review/acceptance summaries | Needs Your Decision | relevant |
| 54 | `schemas/v2/mplp-context.schema.json` | JSON schema | Context module | `meta`, `context_id`, `root`, `title`, `status` | `summary`, `constraints`, `owner_role`, `trace`, `events` | core module | Context | intent/intake/context summaries | Secretary context, memory scope | relevant |
| 55 | `schemas/v2/mplp-core.schema.json` | JSON schema | Core module | `meta`, `core_id`, `protocol_version`, `status`, `modules` | `trace`, `events` | core module | Core | version/boundary posture | all surfaces | relevant |
| 56 | `schemas/v2/mplp-dialog.schema.json` | JSON schema | Dialog module | `meta`, `dialog_id`, `context_id`, `status`, `messages` | `thread_id`, times, `trace`, `events` | core module | Dialog | dialog refs only | Secretary Conversation | relevant but CGOS public dialog is marker-only |
| 57 | `schemas/v2/mplp-extension.schema.json` | JSON schema | Extension module | `meta`, `extension_id`, `context_id`, `name`, `extension_type`, `version`, `status` | `config`, `trace`, `events` | core module | Extension | unavailable/no-dispatch boundary | execution boundary | relevant only as no-authority boundary |
| 58 | `schemas/v2/mplp-network.schema.json` | JSON schema | Network module | `meta`, `network_id`, `context_id`, `name`, `topology_type`, `status` | `description`, `nodes`, `trace`, `events` | core module | Network | unavailable/no-routing boundary | company topology by product projection | relevant only as no-authority boundary |
| 59 | `schemas/v2/mplp-plan.schema.json` | JSON schema | Plan module | `meta`, `plan_id`, `context_id`, `title`, `objective`, `status`, `steps` | `trace`, `events` | core module | Plan | work packet/plan summaries | Dev/Media work packets | relevant |
| 60 | `schemas/v2/mplp-role.schema.json` | JSON schema | Role module | `meta`, `role_id`, `name` | description, capabilities, times, `trace`, `events` | core module | Role | assignment/worker summaries | Human responsibility and company roles | relevant |
| 61 | `schemas/v2/mplp-trace.schema.json` | JSON schema | Trace module | `meta`, `trace_id`, `context_id`, `root_span`, `status` | `plan_id`, times, `segments`, `events` | core module | Trace | evidence refs, trace summaries | Activity Timeline, Evidence Export | relevant |
| 62 | `schemas/v2/profiles/map-profile.yaml` | profile YAML | MAP profile | Collab/Dialog/Network profile rules | lifecycle phases | profile layer | Collab, Dialog, Network | worker/collab posture | multi-company handoff by analogy | relevant as profile guidance only |
| 63 | `schemas/v2/profiles/sa-profile.yaml` | profile YAML | SA profile | Context/Plan/Trace/Role/Core profile rules | lifecycle phases | profile layer | Context, Plan, Trace, Role, Core | minimal loop tests | work packet/timeline | relevant as profile guidance only |
| 64 | `schemas/v2/taxonomy/event-taxonomy.yaml` | taxonomy YAML | event families | 12 event families | profile events | taxonomy | Trace/events | event/evidence posture | Timeline/evidence | relevant |
| 65 | `schemas/v2/taxonomy/integration-event-taxonomy.yaml` | taxonomy YAML | integration families | tool/git/file/CI family definitions | use cases | taxonomy | Extension, Trace | future evidence only | future evidence export | not needed for P0 |
| 66 | `schemas/v2/taxonomy/kernel-duties.yaml` | taxonomy YAML | 11 kernel duties | `KD-01` through `KD-11` | n/a | cross-cutting duties | Core/all | kernel duty posture | all surfaces | relevant |
| 67 | `schemas/v2/taxonomy/learning-taxonomy.yaml` | taxonomy YAML | learning sample families | intent/delta/pipeline/confirm/graph/coordination families | collection points | learning taxonomy | learning, Trace, Confirm | learning/drift summaries | Learning Drawer, Direction Change | relevant |
| 68 | `schemas/v2/taxonomy/module-event-matrix.yaml` | taxonomy YAML | module-event mapping | module event mappings | reverse mapping | observability taxonomy | all modules, Trace | event/evidence posture | Activity Timeline | relevant |

Non-10-module schema directories inspected:

- `schemas/v2/_manifests`
- `schemas/v2/common`
- `schemas/v2/events`
- `schemas/v2/examples`
- `schemas/v2/integration`
- `schemas/v2/invariants`
- `schemas/v2/learning`
- `schemas/v2/profiles`
- `schemas/v2/taxonomy`

## MPLP Schema Relevance Map

### Claim: MPLP Confirm can represent human review decisions.

Evidence:

- schema: `schemas/v2/mplp-confirm.schema.json`
- json_pointers:
  - `/properties/target_type`
  - `/properties/target_id`
  - `/properties/status`
  - `/properties/decisions`
  - `/definitions/confirm_decision_core/properties/status`
  - `/definitions/confirm_decision_core/properties/decided_by_role`

Cognitive_OS Mapping:

- `runtime/public/operator-work-packet-handoff-dto.ts`: `ReviewableOutputSummary`, `AcceptanceStateSummary`, `OPERATOR_WORK_PACKET_ACCEPTANCE_STATES`.
- `runtime/core/confirm-service.ts`: runtime-private `DeterministicConfirmService`.
- `bindings/mplp-coregentis-binding-matrix.v0.yaml`: `confirm-gate` maps to `mplp confirm object semantics` as `shallow_reconstructable_runtime_bound`.

SoloCrew Mapping:

- `P0-03 Needs Your Decision`
- `P0-06 Human Responsibility Review Queue`
- `P0-10 Direction Change Confirmation`

Gap:

- Public review/acceptance summary exists; a product-wide decision queue can use it.
- Direction-change review still needs a neutral public continuity/memory review bundle, not a SoloCrew-specific CGOS object.

### Claim: MPLP Trace and events can represent activity timeline and evidence refs.

Evidence:

- schema: `schemas/v2/mplp-trace.schema.json`
- json_pointers:
  - `/properties/trace_id`
  - `/properties/context_id`
  - `/properties/root_span`
  - `/properties/status`
  - `/properties/segments`
  - `/properties/events`
- schema: `schemas/v2/events/mplp-event-core.schema.json`
- json_pointers:
  - `/properties/event_id`
  - `/properties/event_type`
  - `/properties/event_family`
  - `/properties/timestamp`
  - `/properties/payload`
- schema: `schemas/v2/taxonomy/event-taxonomy.yaml`
- yaml_paths:
  - `.event_families[].id`
- schema: `schemas/v2/invariants/observability-invariants.yaml`
- yaml_paths:
  - `.invariants[].id`

Cognitive_OS Mapping:

- `runtime/public/operator-work-packet-handoff-dto.ts`: `OperatorWorkPacketEvidenceRef`, `DeliveryArtifactSummary`, `ProjectionSafeEnvelope`.
- `runtime/public/runtime-execution-event-dto.ts`: bounded execution event summaries with no dispatch.
- `runtime/core/trace-service.ts`: runtime-private trace evidence and decision record creation.
- `bindings/coregentis-export-rules.v0.yaml`: `trace-evidence` may be `protocol_compliant_export` when shallow fields are reconstructable.

SoloCrew Mapping:

- `P0-08 Activity Timeline`
- `P0-12 Evidence Export Candidate`

Gap:

- Evidence refs exist. A unified product timeline aggregator can be local, but if it claims CGOS continuity across memory layers it must wait for a public memory/continuity contract.

### Claim: MPLP Context, Dialog, and Plan can support Secretary intent intake and work packets.

Evidence:

- schema: `schemas/v2/mplp-context.schema.json`
- json_pointers:
  - `/properties/context_id`
  - `/properties/root`
  - `/properties/title`
  - `/properties/summary`
  - `/properties/constraints`
  - `/properties/status`
- schema: `schemas/v2/mplp-dialog.schema.json`
- json_pointers:
  - `/properties/dialog_id`
  - `/properties/context_id`
  - `/properties/thread_id`
  - `/properties/status`
  - `/properties/messages`
- schema: `schemas/v2/mplp-plan.schema.json`
- json_pointers:
  - `/properties/plan_id`
  - `/properties/context_id`
  - `/properties/objective`
  - `/properties/status`
  - `/properties/steps`

Cognitive_OS Mapping:

- `runtime/public/operator-work-packet-handoff-dto.ts`: `OperatorIntentSummary`, `WorkIntakeSummary`, `WorkPacketSummary`, `ObjectivePacketSummary`.
- `runtime/core/default-mplp-module-posture.ts`: Dialog remains `implicit_only`, Context/Plan are `partial_runtime_realization`.
- `governance/audits/CGOS-OPERATOR-WORK-PACKET-MPLP-BOUND-PROJECTION-CONTRACT-IMPLEMENTATION-v0.1.md`: component-level mapping to Context/Plan/Dialog/Core.

SoloCrew Mapping:

- `P0-01 Secretary Conversation Console`
- `P0-04 Development Company Workspace`
- `P0-05 Media Operation Company Workspace`
- `P0-14 Work Packet / Review / Continuity Mapping`

Gap:

- Intake/work-packet public contract exists.
- Full Dialog runtime is not implemented or public; Secretary conversation must remain product-local transcript/summary and must not be presented as CGOS full Dialog runtime.

### Claim: MPLP Role, Collab, and Network can support responsibility and handoff semantics, but not SoloCrew product company ontology.

Evidence:

- schema: `schemas/v2/mplp-role.schema.json`
- json_pointers:
  - `/properties/role_id`
  - `/properties/name`
  - `/properties/capabilities`
- schema: `schemas/v2/mplp-collab.schema.json`
- json_pointers:
  - `/properties/collab_id`
  - `/properties/context_id`
  - `/properties/mode`
  - `/properties/participants`
  - `/definitions/collab_participant_core/properties/role_id`
  - `/definitions/collab_participant_core/properties/kind`
- schema: `schemas/v2/mplp-network.schema.json`
- json_pointers:
  - `/properties/network_id`
  - `/properties/context_id`
  - `/properties/topology_type`
  - `/properties/nodes`
  - `/definitions/network_node_core/properties/role_id`
- schema: `schemas/v2/profiles/map-profile.yaml`
- yaml_paths:
  - `.map_profile.additional_modules`
  - `.map_profile.participant_kinds`

Cognitive_OS Mapping:

- `runtime/public/operator-work-packet-handoff-dto.ts`: `AssignmentSummary`, `WorkerActivitySummary`.
- `runtime/public/worker-lifecycle-summary-dto.ts` and `worker-lifecycle-evidence-dto.ts`: package-exported observation DTOs.
- `runtime/core/default-mplp-module-posture.ts`: Extension and Network are safe-deferred; Collab is partial.

SoloCrew Mapping:

- `P0-02 Multi-Company Overview`
- `P0-04 Development Company Workspace`
- `P0-05 Media Operation Company Workspace`
- `P0-06 Human Responsibility Review Queue`

Gap:

- "Development Company" and "Media Operation Company" must remain SoloCrew product terms.
- Cognitive_OS can expose neutral assignment, capability lane, worker/activity, review, and handoff summaries only.

### Claim: MPLP supports learning samples and graph-update evidence, but not a mandated learning engine, PSG object, VSL object, or drift object.

Evidence:

- schema: `schemas/v2/learning/mplp-learning-sample-core.schema.json`
- json_pointers:
  - `/properties/sample_id`
  - `/properties/sample_family`
  - `/properties/input`
  - `/properties/state`
  - `/properties/output`
  - `/properties/meta`
- schema: `schemas/v2/learning/mplp-learning-sample-delta.schema.json`
- json_pointers:
  - `/allOf/1/properties/input/properties/delta_id`
  - `/allOf/1/properties/input/properties/change_summary`
  - `/allOf/1/properties/output/properties/actual_impact_summary`
  - `/allOf/1/properties/output/properties/impact_scope`
- schema: `schemas/v2/events/mplp-graph-update-event.schema.json`
- json_pointers:
  - `/allOf/1/properties/event_family/const`
  - `/allOf/1/properties/graph_id`
  - `/allOf/1/properties/update_kind`
- schema: `schemas/v2/taxonomy/kernel-duties.yaml`
- yaml_paths:
  - `.duties[].id` for `KD-04` Learning Feedback and `KD-10` State Sync

Cognitive_OS Mapping:

- `runtime/core/vsl-service.ts`, `runtime/core/psg-service.ts`, `runtime/core/ael-service.ts`, `tests/runtime/vsl-first-pass.test.mjs`, `tests/runtime/psg-first-pass.test.mjs`, `tests/runtime/ael-first-pass.test.mjs`: runtime-private first-pass substrate.
- `runtime/public/memory-preference-summary-dto.ts`, `learning-correction-evidence-dto.ts`, `runtime-objective-continuity-dto.ts`: public summary/evidence DTOs.
- `runtime/public/operator-work-packet-handoff-dto.ts`: `AdvancedRuntimePosture` explicitly has `implements_full_vsl_runtime: false`, `implements_full_psg_runtime: false`, `implements_full_learning_engine: false`, and ref/marker fields only.

SoloCrew Mapping:

- `P0-07 Three-Layer Project Memory`
- `P0-09 Continuity State`
- `P0-10 Direction Change Confirmation`
- `P0-11 Learning Drawer`

Gap:

- This is the decisive P0 blocker. Cognitive_OS needs a neutral public
  memory/continuity/direction-change projection contract before SoloCrew can
  claim a full P0 shell with three-layer memory and continuity.

## MPLP Binding / Guide / Runtime Method Inventory

| Document Path | Status | Relevant Schema Paths | Relevant Cognitive_OS Area | Relevant SoloCrew MVP Gap | Boundary |
| --- | --- | --- | --- | --- | --- |
| `schemas/v2/profiles/sa-profile.yaml` | profile, schema-derived | Context, Plan, Trace, Role, Core, SA event, SA invariants | minimal loop, plan/context/trace posture | Work packet and timeline | profile guidance, not product shell law |
| `schemas/v2/profiles/map-profile.yaml` | profile, schema-derived | Collab, Dialog, Network, MAP event, MAP invariants | collaboration/worker posture | Multi-company handoff | profile guidance, not company ontology |
| `schemas/v2/taxonomy/kernel-duties.yaml` | taxonomy / invariant anchor | all modules | kernel duty posture | all P0 surfaces | protocol taxonomy; not implementation claim |
| `schemas/v2/taxonomy/module-event-matrix.yaml` | taxonomy | events + modules | event/evidence posture | Activity Timeline, Evidence Export | schema-derived observability map |
| `schemas/v2/taxonomy/learning-taxonomy.yaml` | taxonomy | learning schemas | learning evidence and feedback | Learning Drawer, Direction Change | learning sample guidance, not engine law |
| `schemas/v2/invariants/*.yaml` | invariants | events, learning, SA, MAP, integration | validation posture | Timeline, evidence, learning | invariant law for schemas; custom runtime checks still implementation |
| `docs/docs/guides/runtime/ael.md` | informative runtime guide | runtime execution event, Extension | AEL runtime-private first pass | execution boundary only | not protocol schema object |
| `docs/docs/guides/runtime/vsl.md` | informative runtime guide | State Sync duty, Trace/events | VSL runtime-private first pass | Continuity State | not protocol object or storage mandate |
| `docs/docs/guides/runtime/psg.md` | informative runtime guide | GraphUpdateEvent, event taxonomy | PSG runtime-private first pass | Three-Layer Project Memory | logical runtime model, not schema law |
| `docs/docs/guides/runtime/drift-and-rollback.md` | informative runtime guide | delta_intent, impact_analysis, compensation_plan events; learning delta | drift/impact runtime-private first pass | Direction Change Confirmation | no new protocol event or drift object |
| `docs/docs/guides/runtime/runtime-authority.md` | informative runtime boundary | all schemas | runtime authority boundary | all P0 surfaces | runtime may emit evidence, not define protocol truth |
| `docs/docs/guides/runtime/runtime-capability-matrix.md` | informative, profile-specific | runtime execution, tool, file, SA/MAP events, invariants | evidence profile comparison | evidence only | not protocol-wide obligation |
| `governance/02-methods/schema/METHOD-SUC-01_SCHEMA_USAGE_CONFORMANCE_VERIFICATION.md` | governance method | 10 module schemas | schema usage conformance method | binding audit method | method, not schema |
| `governance/mpgc-intake/MPLP-MPGC-INTAKE-EVIDENCE-VOCABULARY-CANDIDATE-v0.1.md` | candidate | Trace, Confirm, evidence refs by implication | evidence vocabulary candidate | Evidence Export, review | candidate only |
| `governance/candidates/MPGC-CANDIDATE-BACKLOG-v0.1.md` | candidate backlog | Trace, Confirm, Core, Context, Role, Collab | projection-safe package and evidence candidates | future hardening only | non-normative backlog |
| `docs/docs/evaluation/conformance/evidence-model.md` | informative guide | Context, Plan, Confirm, Trace, Events | evidence reading aid | Evidence Export Candidate | not standalone evidence contract |

## Cognitive_OS Asset Inventory

| Cognitive_OS Asset | File Path | Export Status | Runtime/Public Boundary | MPLP Schema Source | MPLP JSON Pointer(s) | MPLP Guide/Binding Source | Current Conformance | Known Gap | Safe for SoloCrew Consumption? | Required Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Operator work-packet DTO | `runtime/public/operator-work-packet-handoff-dto.ts` | package-exported | PUBLIC_PROJECTION_SAFE / PUBLIC_DTO_ONLY | Context, Plan, Confirm, Trace, Role, Dialog, Collab, Core; kernel duties | Context `/properties/summary`; Plan `/properties/objective`; Confirm `/properties/decisions`; Trace `/properties/events`; Role `/properties/capabilities` | `CGOS-OPERATOR-WORK-PACKET-MPLP-BOUND-PROJECTION-CONTRACT-IMPLEMENTATION-v0.1.md` | PARTIAL_PUBLIC, strong for work packet/review/evidence | advanced substrates are refs/markers only | yes | reuse for P0 work packet, decision, evidence shell |
| Operator work-packet bundle | `runtime/public/operator-work-packet-handoff-bundle.ts` | package-exported | PUBLIC_BUNDLE | same as above | same as above | same implementation audit | PARTIAL_PUBLIC helper; deterministic validation only | no runtime behavior | yes | reuse for handoff generation/validation |
| Operator review loop DTO | `runtime/public/operator-review-loop-dto.ts` | package-exported | PUBLIC_PROJECTION_SAFE / PUBLIC_DTO_ONLY | Confirm, Trace, Core, Context | Confirm `/properties/status`; Trace `/properties/events`; Core `/properties/modules` | operator review loop tests | PARTIAL_PUBLIC | local review loop only, no product-wide queue | yes | reuse for review queue summary |
| Operator review loop bundle | `runtime/public/operator-review-loop-handoff-bundle.ts` | package-exported | PUBLIC_BUNDLE | Confirm, Trace, Core | same | operator review loop tests | PARTIAL_PUBLIC | deterministic bundle only | yes | reuse where current bundle shape fits |
| Runtime objective continuity DTO | `runtime/public/runtime-objective-continuity-dto.ts` | package-exported, comment drift says not exported | PUBLIC_DTO_ONLY | Context, Trace, KD-10 | Context `/properties/status`; Trace `/properties/context_id`; KD-10 in kernel duties | public-surface DTO tests | PARTIAL_PUBLIC | objective comparison only, not memory/continuity aggregate | yes as summary only | feed future public memory/continuity contract |
| Runtime projection summary DTO | `runtime/public/runtime-projection-summary-dto.ts` | package-exported, comment drift says not exported | PUBLIC_DTO_ONLY | Core, Trace, Context | Core `/properties/modules`; Trace `/properties/events` | public-surface DTO tests | PARTIAL_PUBLIC | operational unit summaries are generic; no P0 memory contract | yes as summary only | reuse for overview cards |
| Runtime execution event DTO | `runtime/public/runtime-execution-event-dto.ts` | package-exported, comment drift says not exported | PUBLIC_DTO_ONLY | runtime execution event, Trace | RuntimeExecution `/allOf/1/properties/status`; Trace `/properties/events` | public-surface DTO tests | PARTIAL_PUBLIC | explicitly non-executing; no execution authority | yes as denied/bounded event evidence | keep as boundary evidence |
| Memory preference summary DTO | `runtime/public/memory-preference-summary-dto.ts` | package-exported, comment drift says not exported | PUBLIC_DTO_ONLY | learning sample, KD-04, KD-10 | Learning core `/properties/state`; kernel duties KD-04/KD-10 | public-surface DTO tests | PARTIAL_PUBLIC | not a three-layer memory contract | yes as summary only | include in new memory/continuity contract |
| Learning correction evidence DTO | `runtime/public/learning-correction-evidence-dto.ts` | package-exported, comment drift says not exported | PUBLIC_DTO_ONLY | learning schemas, Trace | Learning core `/properties/input`, `/properties/output`; Trace `/properties/events` | public-surface DTO tests | PARTIAL_PUBLIC | correction evidence only, no learning engine | yes | reuse for Learning Drawer evidence |
| Runtime session / evidence DTOs | `runtime/public/runtime-session-summary-dto.ts`, `runtime-session-evidence-dto.ts` | package-exported | PUBLIC_DTO_ONLY | Context, Trace, Core, runtime guides | Context `/properties/context_id`; Trace `/properties/events` | third-wave tests | PARTIAL_PUBLIC | no live session authority | yes as evidence | reuse as session posture |
| Worker lifecycle DTOs | `runtime/public/worker-lifecycle-summary-dto.ts`, `worker-lifecycle-evidence-dto.ts` | package-exported | PUBLIC_DTO_ONLY | Role, Collab, Trace | Role `/properties/role_id`; Collab `/properties/participants`; Trace `/properties/events` | third-wave tests | PARTIAL_PUBLIC | observation only, no lifecycle transition authority | yes | reuse for CEO workspace activity summaries |
| Binding service | `runtime/core/binding-service.ts` | not package-exported | RUNTIME_PRIVATE_SERVICE | Confirm, Trace export classes via binding matrix | n/a direct | `bindings/*.yaml` | CONFORMANT_PRIVATE_ONLY | not consumable downstream | no | keep private |
| Confirm service | `runtime/core/confirm-service.ts` | not package-exported | RUNTIME_PRIVATE_SERVICE | Confirm | Confirm `/properties/target_id`, `/properties/status` | binding matrix `confirm-gate` | CONFORMANT_PRIVATE_ONLY | public queue uses summaries only | no | expose only review/acceptance summaries |
| Trace service | `runtime/core/trace-service.ts` | not package-exported | RUNTIME_PRIVATE_SERVICE | Trace | Trace `/properties/trace_id`, `/properties/events` | binding matrix `trace-evidence` | CONFORMANT_PRIVATE_ONLY | public timeline aggregate missing | no | expose via evidence refs only |
| AEL service | `runtime/core/ael-service.ts` | not package-exported | RUNTIME_PRIVATE_SERVICE | runtime execution event and AEL guide | RuntimeExecution `/allOf/1/properties/executor_kind` | AEL guide | CONFORMANT_PRIVATE_ONLY | no public full AEL runtime | no | keep private |
| VSL service/store | `runtime/core/vsl-service.ts`, `runtime/in-memory/vsl-store.ts` | not package-exported | RUNTIME_PRIVATE_SERVICE / store | KD-10, VSL guide, Trace | KD-10; Trace refs | VSL guide | CONFORMANT_PRIVATE_ONLY | no public VSL-backed continuity contract | no | create projection-safe memory/continuity contract |
| PSG service/store | `runtime/core/psg-service.ts`, `runtime/in-memory/psg-store.ts` | not package-exported | RUNTIME_PRIVATE_SERVICE / store | GraphUpdateEvent, PSG guide | GraphUpdate `/allOf/1/properties/graph_id`, `/update_kind` | PSG guide | CONFORMANT_PRIVATE_ONLY | no public PSG/memory projection contract | no | create projection-safe memory/continuity contract |
| Governed learning runtime | `runtime/learning/*`, `tests/runtime/governed-learning-first-pass.test.mjs` | not package-exported | RUNTIME_PRIVATE_IMPLEMENTATION | learning schemas and taxonomy | Learning core `/properties/sample_family`; delta `/allOf/1/properties/output/properties/impact_scope` | learning taxonomy | CONFORMANT_PRIVATE_ONLY | public learning drawer has only evidence summaries | no | expose reviewable learning candidate summaries only |
| Binding/export YAML | `bindings/mplp-coregentis-binding-matrix.v0.yaml`, `bindings/coregentis-export-rules.v0.yaml` | repository truth, not package API | GOVERNANCE_DOC_ONLY / machine-readable binding | Confirm, Trace, event/taxonomy | n/a | binding matrix | PARTIAL binding, narrow export | only confirm/trace are protocol-compliant export | no direct product import | use as audit truth |
| Import lock | `imports/mplp-lock.yaml` | repository truth | GOVERNANCE_DOC_ONLY | selected MPLP schemas | n/a | import lock | aligned with current schema paths | locked commit is older but schema diff is empty | no direct product import | keep lock discipline |

## Cognitive_OS vs MPLP Binding Alignment Matrix

| MPLP Area | MPLP Schema Files | MPLP JSON Pointers / YAML Paths | MPLP Method Docs | Cognitive_OS Files | Cognitive Current State | SoloCrew Current Need | Gap Severity | Required Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Context | `mplp-context.schema.json` | `/properties/context_id`, `/properties/root`, `/properties/summary`, `/properties/constraints`, `/properties/status` | SA profile, Context module docs | operator work-packet DTO, runtime projection summary DTO, binding matrix | PARTIAL_PUBLIC | Secretary context, company scope | BLOCKS_SOLOCREW_P0 if claiming CGOS context memory | Use existing summaries; include in new memory/continuity contract |
| Plan | `mplp-plan.schema.json` | `/properties/plan_id`, `/properties/objective`, `/properties/status`, `/properties/steps` | SA profile | work-packet DTO, minimal loop, binding matrix | PARTIAL_PUBLIC | Dev/Media work packet | NOT_RELEVANT_NOW as blocker | Reuse existing work packet summaries |
| Confirm | `mplp-confirm.schema.json` | `/properties/target_type`, `/properties/target_id`, `/properties/status`, `/properties/decisions` | risk-confirmation example, SA/MAP profiles | review DTOs, confirm service private, binding matrix | PARTIAL_PUBLIC plus private service | Needs Your Decision, review queue | NOT_RELEVANT_NOW | Reuse public review/acceptance summaries |
| Trace | `mplp-trace.schema.json`, event schemas | `/properties/segments`, `/properties/events`, event `/properties/event_family` | evidence model, observability docs | evidence refs, trace service private, runtime event DTO | PARTIAL_PUBLIC plus private service | Timeline, Evidence Export | NEEDED_FOR_SOLOCREW_P1 for richer timeline | Reuse safe refs; local aggregate allowed |
| Role | `mplp-role.schema.json` | `/properties/role_id`, `/properties/name`, `/properties/capabilities` | MAP profile | assignment summaries, worker lifecycle DTO | PARTIAL_PUBLIC | human/CEO responsibility | NOT_RELEVANT_NOW | Reuse as neutral roles only |
| Extension | `mplp-extension.schema.json`, runtime execution/integration schemas | `/properties/extension_id`, `/properties/status`, runtime event executor fields | AEL guide, runtime authority | bounded execution/action request DTOs | MARKER_ONLY / unavailable boundary | no provider/tool execution | NOT_RELEVANT_NOW | Preserve no-execution boundary |
| Dialog | `mplp-dialog.schema.json` | `/properties/dialog_id`, `/properties/context_id`, `/properties/thread_id`, `/properties/messages` | MAP profile | dialog refs in work-packet DTO; default posture `implicit_only` | MARKER_ONLY | Secretary Conversation | BLOCKS_SOLOCREW_P0 if claiming CGOS Dialog runtime | Product-local conversation allowed; no CGOS full Dialog claim |
| Collab | `mplp-collab.schema.json`, MAP event/profile | `/properties/participants`, `/properties/mode`, participant `/role_id`, `/kind` | MAP profile | assignment, worker lifecycle, review loop summaries | PARTIAL_PUBLIC | company handoff/workspaces | NOT_RELEVANT_NOW | Reuse neutral assignment/collab summaries |
| Core | `mplp-core.schema.json`, kernel duties | `/properties/core_id`, `/properties/protocol_version`, `/properties/modules` | runtime authority | version refs, boundary profiles, default module/duty postures | PARTIAL_PUBLIC | all shell boundaries | NOT_RELEVANT_NOW | Reuse version/boundary posture |
| Network | `mplp-network.schema.json` | `/properties/network_id`, `/properties/topology_type`, `/properties/nodes` | MAP profile | safe-deferred in module posture | MARKER_ONLY | multi-company topology by analogy | NOT_RELEVANT_NOW | Keep product company topology in SoloCrew |
| Events | `events/*.schema.json` | event core `/event_family`; graph/pipeline/runtime `allOf` fields | event taxonomy, capability matrix | runtime execution event DTO, trace/evidence refs | PARTIAL_PUBLIC | timeline/evidence | NEEDED_FOR_SOLOCREW_P1 | Use summary/evidence refs first |
| Invariants | `invariants/*.yaml` | `.invariants[].id`, `.invariants[].scope`, `.invariants[].path` | SUC/TSV methods | runtime tests and binding gates | DOC_ONLY/PARTIAL_PRIVATE | conformance discipline | FUTURE_RUNTIME | Do not expose as product controls |
| Learning | `learning/*.schema.json`, `learning-taxonomy.yaml` | `/properties/sample_family`, `/properties/input`, `/properties/output`, delta impact fields | learning notes | learning correction evidence DTO; governed learning private tests | PARTIAL_PUBLIC plus private runtime | Learning Drawer | BLOCKS_SOLOCREW_P0 for full learning drawer | Add learning/memory continuity summary to new contract |
| Taxonomy | `taxonomy/*.yaml` | kernel duty `.duties`, event families, module event mapping | runtime docs | kernel duty posture, module posture | PARTIAL_PUBLIC | shell boundary/evidence | NOT_RELEVANT_NOW | Reuse in report/boundary copy |
| AEL | no top-level schema; runtime execution event | RuntimeExecution `/executor_kind`, `/status` | AEL guide | AEL service private, bounded event DTO | CONFORMANT_PRIVATE_ONLY / marker public | execution boundary | NOT_RELEVANT_NOW | No provider/tool execution |
| VSL | no top-level schema; KD-10 and VSL guide | KD-10; Trace refs | VSL guide | VSL service/store private; objective continuity DTO public | CONFORMANT_PRIVATE_ONLY with PARTIAL_PUBLIC summary | Continuity State | BLOCKS_SOLOCREW_P0 | Create public memory/continuity contract |
| PSG | graph update event, PSG guide | GraphUpdate `/graph_id`, `/update_kind`; learning graph_evolution | PSG guide | PSG service/store private; memory summary DTO public | CONFORMANT_PRIVATE_ONLY with PARTIAL_PUBLIC summary | Three-Layer Project Memory | BLOCKS_SOLOCREW_P0 | Create public memory/continuity contract |
| Semantic Loss / Intent Drift | event taxonomy, learning delta, drift guide | delta learning `/change_summary`, `/impact_scope`; event `delta_intent` | drift-and-rollback guide | drift/impact private tests; work-packet markers public | MARKER_ONLY/PARTIAL_PRIVATE | Direction Change Confirmation | BLOCKS_SOLOCREW_P0 | Add public direction-change review summary |
| Evidence / Export | Trace, event schemas, evidence guide | Trace `/events`, event `/payload`; Confirm `/decisions` | evidence model | safe evidence refs, projection envelope, export rules | PARTIAL_PUBLIC | Evidence Export Candidate | NEEDED_FOR_SOLOCREW_P1 | local evidence export can start; no proof/certification claim |
| State Sync / Continuity | KD-10, VSL guide, Trace | kernel duty KD-10; Trace context refs | VSL guide | VSL private, objective continuity DTO public | PARTIAL_PUBLIC | Continuity State | BLOCKS_SOLOCREW_P0 | Create public memory/continuity contract |
| Runtime Authority | Core, runtime guides | Core `/modules`; runtime guide boundaries | runtime-authority.md | boundary profiles and no-authority flags | PARTIAL_PUBLIC | all shell boundaries | NOT_RELEVANT_NOW | Preserve no-authority posture |
| Projection-Safe Envelope | no MPLP object; maps to Core/Trace/Confirm | Core `/modules`, Trace `/events`, Confirm `/decisions` | evidence/model and MPGC candidate backlog | projection-safe envelope and DTO boundary flags | PARTIAL_PUBLIC | P0-13 consumption | NOT_RELEVANT_NOW | Reuse as non-normative implementation pattern |
| Human Review / Accepted Outcome | Confirm + Trace | Confirm `/status`, `/decisions`; Trace `/events` | risk confirmation guide | review loop DTO, acceptance state | PARTIAL_PUBLIC | P0-03/P0-06 | NOT_RELEVANT_NOW | Reuse |
| Responsibility Transfer | Role + Collab + Plan | Role `/capabilities`; Collab `/participants`; Plan `/steps` | MAP profile | assignment and worker lifecycle DTOs | PARTIAL_PUBLIC | workspaces/company lanes | NOT_RELEVANT_NOW | Product company names stay downstream |
| Tool Action / Execution Boundary | Extension + runtime/tool events | Extension `/status`; ToolEvent `/tool_kind`, `/status`; RuntimeEvent `/executor_kind` | AEL/runtime authority | runtime dispatch boundary DTO, execution boundary contract | PARTIAL_PUBLIC as denial/evidence | no execution in Personal MVP | NOT_RELEVANT_NOW | No bridge; boundary evidence only |

## SoloCrew P0 Gap Backpropagation Matrix

| Solo Requirement | Product-Layer Meaning | Product Only? | Required Cognitive_OS Neutral Capability | Existing Cognitive Assets | Cognitive Gap | MPLP Schema Basis / Pointers | MPLP Method Basis | MPLP Gap | Implementation Order |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0-01 Secretary Conversation Console | Founder-facing Secretary intake and status console | Secretary persona yes | intent/intake summary, dialog refs, clarification state, continuity refs | `OperatorIntentSummary`, `WorkIntakeSummary`, `ObjectiveContinuityDto` | no full public Dialog runtime; conversation must be product-local | Context `/summary`; Dialog `/messages`; Plan `/objective`; Trace `/events` | SA/MAP profiles | NO_MPLP_GAP | CGOS memory/continuity contract first; then product-local Secretary shell |
| P0-02 Multi-Company Overview | Development Company and Media Operation Company overview | company names yes | neutral operational unit / assignment / review / continuity summaries | `AssignmentSummary`, `RuntimeOperationalUnitSummaryDto`, worker DTOs | no neutral public multi-lane memory/continuity aggregate | Role `/capabilities`; Collab `/participants`; Network `/nodes` | MAP profile | NO_MPLP_GAP | SoloCrew product projection after CGOS continuity contract |
| P0-03 Needs Your Decision | product decision queue | UI wording yes | reviewable output, acceptance state, confirm-like decision summary | review loop DTO, work-packet acceptance summaries | sufficient for queue skeleton | Confirm `/status`, `/decisions`; Trace `/events` | risk confirmation guide | NO_MPLP_GAP | reusable now |
| P0-04 Development Company Workspace | product workspace for dev company | company name yes | work packet, assignment, review, evidence, continuity refs | work-packet DTO/bundle | continuity/memory aggregate missing | Plan `/objective`, `/steps`; Role `/capabilities`; Trace `/events` | SA profile | NO_MPLP_GAP | wait for continuity contract if full P0; reduced packet view reusable now |
| P0-05 Media Operation Company Workspace | product workspace for media company | company name yes | work packet, channel-agnostic output/review/evidence refs | work-packet DTO/bundle | same as P0-04 | Plan `/objective`, Confirm `/decisions`, Trace `/events` | SA profile | NO_MPLP_GAP | wait for continuity contract if full P0; reduced packet view reusable now |
| P0-06 Human Responsibility Review Queue | founder-owned review queue | UI yes | neutral review loop, acceptance state, evidence refs | operator review loop DTO/bundle, acceptance state | enough for first queue; direction-change integration missing | Confirm `/decisions`, Role `/role_id`, Trace `/events` | risk confirmation guide | NO_MPLP_GAP | reusable now plus later continuity link |
| P0-07 Three-Layer Project Memory | product memory projection across local/session/project layers | product layering yes | public projection-safe memory + continuity + PSG/VSL summary contract | memory-preference DTO; VSL/PSG runtime-private services | decisive public contract gap | GraphUpdate `/graph_id`, `/update_kind`; Learning `/state`; KD-10 | PSG/VSL guides | MPLP_GUIDE_ONLY | CGOS contract required before full P0 shell |
| P0-08 Activity Timeline | product timeline | UI aggregation yes | event/evidence refs and bounded event summaries | trace/evidence refs, runtime event DTO | timeline aggregate can be local; CGOS full event bus absent | Trace `/segments`, `/events`; EventCore `/event_family` | event taxonomy | NO_MPLP_GAP | local aggregate allowed, no full event bus claim |
| P0-09 Continuity State | resume/next state across founder work | product copy yes | objective continuity + VSL-backed public continuity summary | objective continuity DTO; VSL private service | no public VSL-backed continuity aggregate | Context `/status`; Trace `/context_id`; KD-10 | VSL guide | MPLP_GUIDE_ONLY | CGOS contract required before full P0 shell |
| P0-10 Direction Change Confirmation | founder confirms pivots/revisions | UI yes | public direction-change impact/review summary | drift/impact private tests; work-packet markers | no public direction-change bundle | Confirm `/target_id`, `/decisions`; learning delta `/impact_scope`; event taxonomy `delta_intent` | drift-and-rollback guide | MPLP_CANDIDATE_REQUIRED only if repeated cross-runtime need | include in CGOS memory/continuity contract |
| P0-11 Learning Drawer | product drawer for learning/corrections | drawer UI yes | learning correction summaries, memory/preference summaries | learning correction DTO, memory preference DTO; learning private runtime | enough for evidence-only drawer; not enough for learning engine claim | Learning `/sample_family`, `/input`, `/output`; KD-04 | learning taxonomy | NO_MPLP_GAP | reuse as evidence drawer; no engine claim |
| P0-12 Evidence Export Candidate | product export candidate | export layout yes | safe evidence refs, delivery artifact summary, trace refs | work-packet evidence refs, review loop bundle, export rules | enough for candidate list, not certification/proof | Trace `/events`; Confirm `/decisions`; EventCore `/payload` | evidence model | NO_MPLP_GAP | local export candidate allowed |
| P0-13 Projection-Safe Cognitive Consumption | safe downstream import | product adapter yes | public DTO package exports and no-private boundaries | package exports, tests, handoff docs | sufficient for existing surfaces | Core `/modules`; Trace `/events`; Confirm `/decisions` | SUC method | NO_MPLP_GAP | reuse only `cognitive_os/runtime/public/*` |
| P0-14 Work Packet / Review / Continuity Mapping | product operating loop mapping | product composition yes | work packet, review, acceptance, continuity summary | work-packet DTO/bundle; objective continuity DTO | continuity aggregate missing | Context/Plan/Confirm/Trace pointers above | SA profile, VSL guide | MPLP_GUIDE_ONLY | work/review now; continuity contract before full P0 |

## Required Cognitive_OS Work Before SoloCrew P0 Shell

| Potential Cognitive_OS Requirement | Classification | Reason | Blocks Full SoloCrew P0? |
| --- | --- | --- | --- |
| Operator work-packet and review summaries | REUSE_EXISTING_PUBLIC_CONTRACT | package-exported DTO/bundle with tests and binding audit | no |
| Safe evidence refs and local evidence export candidate | REUSE_EXISTING_PUBLIC_CONTRACT / SOLOCREW_CAN_AGGREGATE_LOCALLY | Trace/evidence refs exist; product export layout is downstream | no |
| Multi-company product registry | SOLOCREW_CAN_AGGREGATE_LOCALLY | company names and lanes are product ontology, not CGOS | no, if memory/continuity refs are bounded |
| Secretary conversation transcript/display | SOLOCREW_CAN_AGGREGATE_LOCALLY | Dialog schema exists, but full CGOS Dialog runtime is marker-only | no for local product display; yes for CGOS-backed Dialog claim |
| Three-layer project memory public projection | COGNITIVE_PUBLIC_CONTRACT_NEEDED_BEFORE_SOLOCREW_P0 | VSL/PSG/memory are private or fragmented public summaries | yes |
| Continuity state public aggregate | COGNITIVE_PUBLIC_CONTRACT_NEEDED_BEFORE_SOLOCREW_P0 | `ObjectiveContinuityDto` is too narrow for whole P0 shell | yes |
| Direction-change confirmation summary | COGNITIVE_PUBLIC_CONTRACT_NEEDED_BEFORE_SOLOCREW_P0 | drift/impact exists private; public markers are insufficient | yes |
| Learning drawer evidence-only display | REUSE_EXISTING_PUBLIC_CONTRACT | learning correction + memory preference DTOs are enough for evidence-only drawer | no, if no learning engine claim |
| Full AEL/provider/tool execution | NOT_NEEDED_FOR_P0 | Personal MVP remains non-executing | no; do not implement |
| MPLP schema update | MPLP_CANDIDATE_ONLY | no schema-level gap proven by this audit | no; not authorized |

Decision answers:

- Can SoloCrew P0 Console Shell start with existing Cognitive_OS public DTOs?
  Not as the full P0 shell. A reduced read-only scaffold can start, but full P0
  is blocked by memory/continuity/direction-change public contract gaps.
- Which parts can SoloCrew safely implement locally as product projections?
  Secretary UI copy, company names, company overview layout, local timeline
  aggregation, local evidence candidate layout, and product workspace labels.
- Which parts require new Cognitive_OS public projection-safe contracts first?
  Three-layer memory, continuity state, direction-change impact/review summary,
  and a single aggregate that binds those to safe evidence refs and omission
  markers.
- Which parts must wait because Cognitive_OS only has runtime-private
  implementations?
  VSL-backed continuity, PSG-backed graph/memory, AEL activation, drift/impact,
  and governed learning engine behavior.
- Which parts are product-only and must not be upstreamed?
  Secretary persona, Development Company, Media Operation Company, founder copy,
  LinkedIn/X channel language, and SoloCrew Personal MVP route claims.

## Boundary Violation / Drift Risk Scan

| Finding | Evidence | Risk | Required Correction |
| --- | --- | --- | --- |
| Cognitive_OS public comments drift from package export truth. | `runtime/public/*-dto.ts` comments say "Not package-exported yet"; `package.json` exports them. | Low confusion risk during audits. | Future comment cleanup only; no export change in this audit. |
| VSL/PSG/AEL services are runtime-private but attractive for SoloCrew. | `runtime/core/vsl-service.ts`, `runtime/core/psg-service.ts`, `runtime/core/ael-service.ts`; tests prove first-pass private behavior. | High if SoloCrew imports them directly. | Do not consume private services; add public projection-safe contract first. |
| Product company terms would pollute Cognitive_OS if upstreamed. | SoloCrew audit P0-02 and P0-04/P0-05; CGOS registry uses neutral objects. | High semantic drift. | Keep Development Company and Media Operation Company in SoloCrew only. |
| MPLP runtime guides could be over-read as schema law. | `ael.md`, `vsl.md`, `psg.md`, `drift-and-rollback.md` all mark informative/non-authoritative. | Medium. | Use guide text only as runtime method basis; cite schemas for protocol claims. |
| Existing operator work-packet contract is 10-module mapped but not full advanced runtime. | `AdvancedRuntimePosture` false flags in `operator-work-packet-handoff-dto.ts`. | Medium if overclaimed as full substrate. | Preserve refs/markers/omission posture. |
| MPLP candidate backlog already tracks evidence/boundary pressure. | `governance/candidates/MPGC-CANDIDATE-BACKLOG-v0.1.md`. | Low; useful pressure ledger. | Do not convert candidate backlog into schema change from this wave. |
| Provider/model/tool execution remains unauthorized. | public DTO boundary flags; runtime authority docs; SoloCrew audit boundaries. | High if P0 shell implies action execution. | Keep non-executing, no dispatch, no publishing. |

## Final Verdict

`B. BLOCKED_UNTIL_CGOS_PUBLIC_MEMORY_CONTINUITY_CONTRACT`

Justification:

- MPLP schema truth already covers enough Context, Plan, Confirm, Trace, Role,
  Collab, Dialog, events, learning samples, graph-update evidence, kernel
  duties, and runtime guide semantics for mapping. No MPLP schema change is
  authorized.
- Cognitive_OS public operator work-packet and review-loop surfaces are
  reusable and package-exported.
- Cognitive_OS advanced substrate is still either runtime-private
  implementation or fragmented public summary DTOs.
- SoloCrew Personal MVP v1.0 P0 requires three-layer memory, continuity state,
  and direction-change confirmation as coherent product surfaces. Those cannot
  be truthfully claimed as CGOS-backed from the current public contract set.

## Next Recommended Wave

```yaml
next_wave:
  wave_id: CGOS-PERSONAL-MVP-PUBLIC-MEMORY-CONTINUITY-CONTRACT
  repo_scope:
    primary: Cognitive_OS
    reference_only:
      - MPLP-Protocol
      - SoloCrew
  objective: >
    Define and implement a neutral public projection-safe memory/continuity/
    direction-change summary contract that SoloCrew can consume without
    importing runtime-private VSL, PSG, drift, or learning services.
  deliverables:
    - public DTO for memory continuity aggregate
    - optional deterministic bundle/helper only if needed
    - fields for objective/context refs, continuity status, memory layer
      summaries, direction-change review posture, learning candidate refs,
      safe evidence refs, omission markers, and no-authority boundary flags
    - package export only after boundary tests pass
    - governance audit with MPLP schema pointer basis
  files_likely_to_touch:
    - runtime/public/
    - tests/runtime/
    - package.json
    - governance/audits/
    - CHANGELOG.md
  must_reuse:
    - runtime/public/operator-work-packet-handoff-dto.ts
    - runtime/public/runtime-objective-continuity-dto.ts
    - runtime/public/memory-preference-summary-dto.ts
    - runtime/public/learning-correction-evidence-dto.ts
    - runtime/public/runtime-projection-summary-dto.ts
    - runtime/core/default-kernel-duty-posture.ts
    - runtime/core/default-mplp-module-posture.ts
  must_not_touch:
    - MPLP schemas or normative docs
    - SoloCrew product implementation
    - runtime-private service/store exports
    - provider/model/tool/channel execution
  acceptance_gates:
    - schema pointer evidence for each mapped MPLP basis
    - product-neutral field names
    - no SoloCrew / Founder / Secretary / Development Company / Media Operation Company terms
    - runtime-private fields omitted
    - no full VSL/PSG/AEL/drift/learning engine claim
    - package export boundary tests if exported
    - `npm run test:runtime`
```

SoloCrew P0 shell remains paused as a full P0 implementation. A later SoloCrew
wave may build a reduced read-only scaffold only if it explicitly excludes
three-layer memory/CGOS continuity claims; otherwise it should wait for the
recommended Cognitive_OS contract.
