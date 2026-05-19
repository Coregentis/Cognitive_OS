# TRI-REPO-SOLOCREW-TO-CGOS-MPLP-BINDING-RECURSIVE-RESEARCH-v0.1

## Document Control

- doc_id: TRI-REPO-SOLOCREW-TO-CGOS-MPLP-BINDING-RECURSIVE-RESEARCH-v0.1
- task_id: TRI-REPO-SOLOCREW-TO-CGOS-MPLP-BINDING-RECURSIVE-RESEARCH-01
- wave_type: Research Audit + Product-to-Runtime-to-Protocol Recursive Capability Planning
- date: 2026-05-19
- status: research audit only
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- record_location: Cognitive_OS governance/audits
- no_runtime_contract_implementation: true
- no_solocrew_app_implementation: true
- no_provider_execution: true
- no_worker_execution_bridge: true
- no_company_reality_model_implementation: true
- no_human_agent_evolution_bridge_implementation: true
- no_mplp_schema_change: true
- no_mplp_protocol_law_change: true
- no_mplp_normative_binding_change: true
- no_package_publication: true

This record is planning and audit only. It creates no runtime service, no DTO,
no package export, no product app surface, no provider bridge, no worker bridge,
no protocol/schema/binding change, no release, no tag, no package publication,
no formal assurance claim, and no endorsement claim.

## Repo Truth

Remote truth was fetched before this research record.

| Repo | URL | Branch | Starting local HEAD | Starting origin HEAD | Worktree at start |
| --- | --- | --- | --- | --- | --- |
| SoloCrew | https://github.com/Coregentis/SoloCrew.git | main | efd50070f01a7fb1a0ece92b0c476edbf742764a | efd50070f01a7fb1a0ece92b0c476edbf742764a | clean |
| Cognitive_OS | https://github.com/Coregentis/Cognitive_OS.git | main | bc2e530416ca9393a341d3e73780677f032ecc94 | bc2e530416ca9393a341d3e73780677f032ecc94 | approved untracked `.DS_Store` local noise only |
| MPLP-Protocol | https://github.com/Coregentis/MPLP-Protocol.git | main | 214939ab6ba522036d376868d1fe8d04d960420f | 214939ab6ba522036d376868d1fe8d04d960420f | approved untracked `.DS_Store` local noise only |

Approved local noise observed and left untracked:

- Cognitive_OS: `.DS_Store`, `governance/.DS_Store`, `runtime/.DS_Store`,
  `tests/.DS_Store`
- MPLP-Protocol: `.DS_Store`, `.github/.DS_Store`,
  `examples/.DS_Store`, `governance/.DS_Store`, `packages/.DS_Store`,
  `scripts/.DS_Store`, `tests/.DS_Store`

No `.DS_Store` file is tracked, staged, committed, or pushed by this wave.

## Scope And Non-goals

This research starts from SoloCrew's product route and derives upstream neutral
Cognitive_OS capabilities before mapping them to MPLP. It intentionally does
not start from existing `runtime/public` surfaces alone.

Reviewed source families:

- SoloCrew product truth: README, CHANGELOG, OPC Wave 00 scope, V2.0 AIGC
  operating baseline, V3.0 Engagement Operating Loop records, founder
  dogfooding MVP records, app/projection/test surfaces, and legacy bridge
  exception gate.
- Cognitive_OS truth: current architecture baseline, operator work-packet
  readiness, historical audit, boundary correction, MPLP binding correction,
  module/duty posture files, AEL/VSL/PSG/drift/learning plans and tests, and
  package-exported `runtime/public` surfaces.
- MPLP truth: 10 module schemas/docs, module interaction docs, profile docs,
  runtime guides, `schemas/v2/taxonomy/kernel-duties.yaml`, and informative
  module/flow duty boundary pages.

Non-goals:

- no new Cognitive_OS runtime or public DTO implementation;
- no SoloCrew app implementation;
- no provider, tool, channel, payment, publishing, customer outreach, or
  autonomous external action implementation;
- no Company Reality Model or Human-Agent Evolution Bridge implementation;
- no MPLP schema, protocol law, normative binding, profile, or guide change.

## Executive Decision

Research decision:

`RECURSIVE_RESEARCH_PASS_WITH_GAPS`

Current next task validation:

`CGOS-OPERATOR-WORK-PACKET-MPLP-BOUND-PROJECTION-CONTRACT-IMPLEMENTATION-WITH-ADDITIONAL-FIELDS`

Rationale:

- SoloCrew's next product step is still the OPC Foundation intent-to-delivery
  work loop, but it remains blocked until Cognitive_OS implements a tested,
  MPLP-bound, projection-safe neutral public contract.
- The historical boundary correction and MPLP binding correction have reduced
  the main legacy risks: the SoloCrew legacy bridge is exception-gated, current
  public surfaces are mapped, and MPLP-Protocol remains unchanged.
- Recursing from the full SoloCrew route shows the operator work-packet
  contract must include more than the earlier readiness fields. The near-term
  contract should carry projection-safe refs or omission markers for dialog,
  clarification, source intent, intent drift, semantic loss, PSG, AEL, VSL,
  learning feedback, and kernel-duty posture.
- Existing MPLP semantics are sufficient for the next implementation wave as a
  Cognitive_OS-side runtime/projection mapping. No MPLP candidate/backlog note
  is required before the next contract implementation.

## SoloCrew Product-stage Analysis

| Stage | User-facing goal | Primary scenario and wow moment | Required product surfaces | Explicit out of scope now | Required upstream dependency | Current status |
| --- | --- | --- | --- | --- | --- | --- |
| OPC Foundation | One operator can use a company-like work surface to turn one real goal into a reviewable, deliverable work packet. | Operator gives intent; assistant-like intake clarifies; work routes to a business area; worker activity is visible; review item is accepted/revised/rejected; delivery is saved for continuity. Wow moment: one real goal becomes assigned, reviewable, and deliverable across the surface. | intent intake, clarification, work packet, assignment view, activity status, review queue, delivery vault, continuity view | provider execution, external action, publishing, payment, customer outreach, Team Lite, Company Reality Model, full OS | `operator_intent_summary`, `work_intake_summary`, `objective_packet`, `assignment_summary`, `worker_activity_summary`, `reviewable_output_summary`, `acceptance_state`, `delivery_artifact_summary`, `continuity_pointer`, `projection_safe_envelope` plus extra refs listed below | Blocked until Cognitive_OS public contract is implemented, tested, and handed off |
| Operating Loop | Keep work moving across sessions with accepted outcomes, repeatable rhythms, and bounded memory. | Operator resumes ongoing work, sees active/blocked/waiting items, reviews outcomes, records feedback, and returns later with continuity intact. | operating board, history, accepted outcome ledger, evidence view, correction/preference loop, cost/time/attention hints | autonomous execution, broad external channels, budget runtime as authority | continuity runtime, VSL refs, objective continuity, evidence runtime, learning feedback, preference/correction summary, action/request boundary | Partially supported by existing runtime surfaces; blocked for product loop until OPC handoff exists |
| Team Lite | A founder-led small team can share human/agent roles, review responsibility, and handoffs. | Owner/operator/reviewer roles coordinate work, assign review, preserve shared context, and track human judgment. | role-aware review queue, handoff ledger, shared memory, responsibility view, team feedback | enterprise role system, SSO/admin, unbounded multi-user collaboration | role/collab posture, assignment/coordination runtime, worker lifecycle summaries, review/acceptance gates, security/omission duties | Backlog until OPC and Operating Loop foundations are stable |
| Company Reality Model / Business Reality Graph | The product understands company reality as projects, customers, capabilities, evidence, gaps, and outcomes. | Operator sees the business graph, detects load/gaps/drift, and receives suggested mission candidates grounded in evidence. | business graph view, objective graph, evidence pointer graph, capability gap view, proactive suggestion view | full Company Reality Model implementation now, graph database doctrine, automatic decisioning | PSG projection refs, graph projection summary, semantic drift markers, VSL value state, evidence pointers, learning pattern summaries | P4; Cognitive_OS has runtime-private PSG first pass but no downstream graph contract |
| AI-native Company OS | Founder-led teams operate company work through human judgment, agent workforce, continuity, learning, and safe external boundaries. | Company reality, human roles, agent workforce, missions, delivery, customer/revenue loops, and learning all operate through an MPLP-bound runtime substrate. | company operating workspace, workforce lifecycle, capability market posture, delivery/revenue loop, learning/memory promotion, advanced mission OS | not authorized in this wave; no provider/customer/revenue automation now | full neutral runtime suite: work packet, roles/collab, AEL, VSL, PSG, drift, learning, state, event, transaction, extension/network boundaries | P5 long-term route only |

## Cognitive_OS Upstream Capability Derivation

Neutral names below are Cognitive_OS capability names, not SoloCrew product
surface names.

| Cognitive_OS capability | Product route need | Current classification | Current repo coverage | Gap | Priority |
| --- | --- | --- | --- | --- | --- |
| `operator_intent_summary` | Bound the original operator goal before work formation. | Designed but not implemented | readiness record only; Context posture exists | public DTO component and source refs missing | P0 |
| `dialog_ref` / `clarification_ref` | Clarification before work packet and drift-sensitive handoff. | Missing / implicit only | module posture marks Dialog `implicit_only`; no dedicated public handoff field | projection-safe dialog/clarification refs or omission markers | P0 |
| `source_intent_ref` | Trace current work back to source request. | Designed but not implemented | source refs appear in existing DTO patterns | first-class source-intent ref in work handoff | P0 |
| `work_intake_summary` | Convert operator intent into bounded neutral intake. | Designed but not implemented | readiness record only | intake status, blocked/deferred posture, clarification refs | P0 |
| `work_packet` / `objective_packet` | Stable neutral work unit for assignment/review/delivery. | Designed but not implemented | objective continuity DTO is partial | packet/objective contract linking constraints, expected outputs, and evidence refs | P0 |
| `assignment_summary` / `coordination_scope` | Route work to responsibility/capability without exposing runtime-private internals. | Partial | worker lifecycle, role/collab posture, module/duty posture | work-specific assignment summary and coordination-scope refs | P0 |
| `worker_activity_summary` | Show safe activity status without raw worker state. | Partial | worker lifecycle summary/evidence DTOs | work-linked activity summary component | P0 |
| `reviewable_output_summary` | Present output for human review. | Partial | operator review loop DTO exists | work-packet-linked output summary | P0 |
| `acceptance_state` | Preserve human judgment over output. | Partial | review loop and Confirm posture exist | accepted/revise/reject/parked state in handoff contract | P0 |
| `operator_feedback_summary` | Record correction/preference signal without training authority. | Partial | memory/preference and learning/correction DTOs | feedback summary tied to acceptance state and no-training boundary | P0 |
| `delivery_artifact_summary` | Save delivery metadata without raw payload or publishing. | Missing / partial | objective continuity and evidence refs | delivery artifact summary and storage/export posture | P0 |
| `continuity_pointer` | Resume future work safely. | Partial | VSL first pass, objective continuity DTO, projection envelope | handoff-level continuity pointer | P0 |
| `projection_safe_envelope` | Enforce public handoff boundary. | Already implemented and usable | projection-safe envelope builder, public DTO patterns, tests | adapt into new contract | P0 |
| `non_execution_boundary` / `no_provider_dispatch` | Prevent product overclaim and external side effects. | Already implemented and usable | dispatch boundary DTOs, module posture, tests | include in new contract as explicit boundary markers | P0 |
| `ael_event_ref` | Bind bounded action event posture without dispatch authority. | Partial, runtime-private first pass | AEL service/tests; execution event DTO | projection-safe event ref or omission marker in work handoff | P0 near-term ref, P1+ full runtime |
| `vsl_state_ref` / `value_state_ref` | Link accepted outcome and continuity. | Partial, runtime-private first pass | VSL service/store/tests, objective continuity DTO | handoff-level VSL/value-state ref or omission marker | P0 near-term ref, P2 full loop |
| `psg_pointer` / `graph_projection_summary` | Ground future business reality graph without exposing PSG internals. | Partial, runtime-private first pass | PSG service/store/tests | projection-safe pointer/omission marker now; graph contract later | P0 marker, P4 full graph |
| `intent_drift_marker` / `semantic_loss_marker` | Detect source-vs-current work divergence. | Partial | delta drift impact first pass, drift records in runtime tests | handoff markers for drift/loss posture | P0 marker, P2 stronger loop |
| `learning_feedback_ref` | Preserve correction/learning suggestion posture. | Partial | learning/correction DTOs, governed learning first pass | feedback ref tied to no-training/no-mutation boundary | P0 marker, P2/P5 expansion |
| `kernel_duty_posture` | Show cross-cutting duty coverage in the handoff. | Already implemented and usable | default kernel duty posture and projection-safe envelope | include compact duty posture refs in the new contract | P0 |

## Runtime And Service Requirement Matrix

| Cognitive_OS capability | Required runtime/service family | Required public projection-safe surface | Required internal runtime support | Current repo asset to reuse | Missing asset | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `operator_intent_summary`, `dialog_ref`, `clarification_ref` | Intent Intake Runtime + Dialog Posture Runtime | intent/intake summary with dialog and clarification refs | source refs, clarification required/complete posture, omission markers | Form/intake substrate; Dialog module posture | public handoff DTO fields | P0 |
| `work_intake_summary`, `objective_packet` | Work Packet Runtime + Objective/Plan Runtime | neutral work/objective packet summary | objective records, constraints, expected output posture | objective continuity DTO, Plan/Context posture | unified work packet public contract | P0 |
| `assignment_summary`, `coordination_scope` | Assignment / Coordination Runtime | assignment summary and capability/role refs | role/collab posture, worker lifecycle records | worker lifecycle public DTOs, Role/Collab posture | work-linked assignment summary | P0 |
| `worker_activity_summary` | Worker Lifecycle Runtime | work-linked activity summary | lifecycle state, transition evidence, omission | worker lifecycle summary/evidence DTOs | activity component scoped to packet | P0 |
| `reviewable_output_summary`, `acceptance_state` | Review / Acceptance Runtime | reviewable output and acceptance state | Confirm posture, trace refs, review result | operator review loop DTO | link to work packet and delivery | P0 |
| `delivery_artifact_summary`, `continuity_pointer` | Delivery Artifact Runtime + Continuity Runtime | delivery artifact summary, continuity pointer | VSL continuity, artifact refs, export/storage posture | objective continuity DTO, VSL first pass | delivery summary contract | P0 |
| `ael_event_ref`, `non_execution_boundary` | AEL / Execution Event Runtime + Boundary Runtime | event ref, non-execution flags, no-dispatch flags | AEL assessment, policy/confirm/trace link | AEL service, execution event DTO, dispatch boundary DTO | work-packet-level AEL ref | P0 ref, P1 full bridge prerequisite |
| `vsl_state_ref`, `value_state_ref` | VSL / Value State Layer Runtime | value/continuity state ref | continuity checkpoint, accepted outcome posture | VSL service/store, state roundtrip DTO | value-state projection marker | P0 ref, P2 full loop |
| `psg_pointer`, `graph_projection_summary` | PSG / Business Reality Graph Runtime | graph pointer/summary or omission marker | project-scoped graph, node/edge lineage | PSG service/store | projection-safe graph pointer contract | P0 marker, P4 full graph |
| `intent_drift_marker`, `semantic_loss_marker` | Intent Drift / Semantic Loss Runtime | drift/loss markers | delta intent assessment, affected refs, conflict posture | delta drift impact first pass | first-class handoff markers | P0 marker, P2 stronger loop |
| `learning_feedback_ref`, `operator_feedback_summary` | Learning Feedback Runtime + Memory/Preference Runtime | feedback summary and learning ref | correction capture, preference writeback, learning candidate | memory/preference DTO, learning correction DTO, governed learning path | no-training/no-mutation field set in handoff | P0 |
| `projection_safe_envelope`, `kernel_duty_posture` | Projection Runtime + Boundary/Safety Runtime | envelope, module refs, duty refs, version refs | binding service, module/duty posture, omission | projection envelope builder, module/duty posture files | integrate in new contract | P0 |
| provider/channel/tool boundaries | Provider Bridge Boundary Runtime + Channel Boundary Runtime | unavailable/deferred boundary markers only | no enabled provider/channel runtime | Extension/Network safe-deferred posture | full provider/channel runtime intentionally absent | P1/P5, not current |
| budget/cost hints | Budget / Cost Runtime | optional cost/time/attention summary later | cost accounting not present | none | budget runtime | P2/backlog |

## MPLP 10 Module Binding Matrix

MPLP modules are read from MPLP-Protocol schemas/docs as:
Context, Plan, Confirm, Trace, Role, Dialog, Collab, Extension, Core, Network.

All mappings below are Cognitive_OS-side interpretive runtime/projection
mappings. They do not assign new MPLP law.

| Capability family | Required modules | Supportive modules | Rationale | Existing MPLP semantics sufficient? | Follow-up |
| --- | --- | --- | --- | --- | --- |
| Intent intake and clarification | Context, Dialog, Confirm, Trace, Core | Plan | Context carries source/input posture; Dialog covers turn/clarification posture; Confirm covers clarification-before-action; Trace records safe evidence; Core carries envelope/version posture. | yes | no MPLP change; add Dialog refs in CGOS contract |
| Work/objective packet | Context, Plan, Trace, Core | Confirm | Plan carries objective and planned work; Context carries constraints/source refs; Trace carries evidence; Core anchors identity/boundary. | yes | no MPLP change |
| Assignment and coordination | Role, Collab, Plan, Trace, Core | Context | Role covers responsibility/capability; Collab covers handoff/coordination; Plan links assignment to planned work; Trace records assignment evidence. | yes | no MPLP change |
| Worker activity summary | Role, Collab, Trace, Core | Plan | Role/Collab represent participant and coordination posture; Trace carries activity refs; Core preserves omission/version posture. | yes | no MPLP change |
| Reviewable output and acceptance | Confirm, Trace, Plan, Context, Core | Role | Confirm carries human judgment posture; Trace carries output/decision evidence; Plan links expected vs produced output. | yes | no MPLP change |
| Delivery artifact and continuity | Trace, Context, Plan, Core | Confirm | Trace carries artifact refs; Context and Core carry continuation identity and versioning; Plan links artifact to objective; Confirm links accepted state. | yes | no MPLP change |
| AEL / bounded event posture | Trace, Confirm, Plan, Extension, Network, Core | Role | Event posture binds to Trace/Confirm/Plan; Extension/Network are boundary families for unavailable external surfaces, not dispatch authority. | yes | no MPLP change; include no-dispatch markers |
| VSL / value and continuity posture | Context, Trace, Core, Plan | Confirm | State/value/continuity refs bind to Context/Trace/Core and planned work; Confirm links accepted outcome state. | yes | no MPLP change |
| PSG / graph pointer posture | Context, Trace, Core, Plan, Role, Collab | Network optional later | Graph pointers are source/evidence/context/relationship posture, not exported graph internals. Network becomes relevant only for governed inter-agent or external topology. | yes for pointer; full graph export not requested | no MPLP change now |
| Intent drift and semantic loss | Context, Plan, Confirm, Trace, Core | Dialog | Drift compares source context, current plan, confirmation needs, and trace evidence; Dialog supports clarification drift. | yes | no MPLP change |
| Learning feedback | Confirm, Trace, Context, Plan, Core | Role | Feedback is confirmation/evidence/context posture with future plan influence; no training or automatic mutation authority. | yes | no MPLP change |
| Projection-safe envelope and duties | Core, Trace, Context, Confirm | all as refs | Core anchors runtime/protocol version and boundary; Trace carries evidence/omission; Context/Confirm preserve interpretation and gates. | yes | no MPLP change |

Special module findings:

- Dialog must become visible in the next work-packet contract through
  `dialog_ref` and `clarification_ref` because intent clarification is a first
  product-stage requirement and current Dialog posture is only implicit.
- Extension and Network must remain explicit safe-deferred boundary posture in
  near-term contracts. They are relevant to provider/tool/channel boundaries,
  but the next contract must not grant dispatch authority.
- Confirm and Trace are mandatory for review, human judgment, delivery
  evidence, continuity, audit, and no-autonomous-external-action boundaries.

## AEL / VSL / PSG / Intent Drift / Learning Matrix

| Substrate | OPC Foundation | Operating Loop | Team Lite | Company Reality Model | AI-native Company OS | Current Cognitive_OS asset | Near-term contract posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AEL | required as event/ref boundary only | required for bounded action lifecycle evidence | required before worker bridge | supportive for graph-triggered actions | required for governed external/action surface | AEL first-pass runtime-private service; execution event and dispatch boundary DTOs | add `ael_event_ref`, `non_execution_boundary`, `no_provider_dispatch`, `no_channel_dispatch`, `no_tool_invocation` |
| VSL | required for continuity and accepted outcome ref | required for persistent operating loop | required for shared state | required for value-state graph | required for company OS state layer | VSL first-pass continuity service/store; objective continuity DTO | add `vsl_state_ref` or `value_state_ref` plus omission marker |
| PSG / Business Reality Graph | optional pointer/omission marker | supportive for recurring work links | supportive for role/capability graph | required | required | PSG first-pass runtime-private graph service/store | add `psg_pointer` as pointer/omission only; defer full graph contract |
| Intent Drift / Semantic Loss | required as drift/loss markers | required for loop safety and revision | required for handoff safety | required for graph suggestions | required | Delta Drift & Impact first pass | add `intent_drift_marker`, `semantic_loss_marker`, `source_intent_ref`, clarification drift posture |
| Learning | required as feedback/no-training posture | required for correction/preference continuity | required for team preference governance | required for pattern learning | required | governed learning first pass; correction/preference DTOs | add `learning_feedback_ref`, `operator_feedback_summary`, `no_training_authority`, `no_automatic_mutation` |

Near-term implication:

The next contract should not implement full AEL/VSL/PSG/drift/learning. It
should include projection-safe refs, omission markers, and boundary flags so
SoloCrew can render truthful current/future posture without treating absent
substrates as implemented product capability.

## 11 Kernel Duties / Cross-cutting Duties Mapping

Authoritative MPLP source:

- `MPLP-Protocol/schemas/v2/taxonomy/kernel-duties.yaml`

Canonical duties found:

- `KD-01 Coordination`
- `KD-02 Error Handling`
- `KD-03 Event Bus`
- `KD-04 Learning Feedback`
- `KD-05 Observability`
- `KD-06 Orchestration`
- `KD-07 Performance`
- `KD-08 Protocol Versioning`
- `KD-09 Security`
- `KD-10 State Sync`
- `KD-11 Transaction`

Boundary source:

- `MPLP-Protocol/docs/docs/specification/module-to-duty-matrix.md`
- `MPLP-Protocol/docs/docs/specification/flow-to-duty-matrix.md`

Those pages explicitly state that MPLP does not freeze a canonical assignment
from modules or flows to duties. The following mapping is therefore
Cognitive_OS-side, interpretive, and non-normative.

| Duty | Relevance to required Cognitive_OS capabilities | Current status | Required carrier in next contract or later runtime | Test/gate expectation | Downstream consumption |
| --- | --- | --- | --- | --- | --- |
| KD-01 Coordination | work intake, assignment, worker activity, handoff, continuity | projected/partial | `assignment_summary`, `coordination_scope`, `continuity_pointer` | contract includes coordination refs without runtime handles | projection-safe summary only |
| KD-02 Error Handling | blocked/deferred intake, insufficiency, drift, policy blocks | projected/partial | `omission_marker`, insufficiency flags, `semantic_loss_marker` | blocked/deferred states remain non-executing | projection-safe summary only |
| KD-03 Event Bus | runtime event summaries, AEL refs, activity timeline | implicit/projected | `runtime_event_summary`, `ael_event_ref` | event refs do not expose internal bus or dispatch | projection-safe refs only |
| KD-04 Learning Feedback | feedback, correction, preference, learning candidate posture | projected/partial | `operator_feedback_summary`, `learning_feedback_ref`, no-training flags | no training or automatic mutation fields are enforced | projection-safe candidate/ref only |
| KD-05 Observability | evidence, output, delivery, continuity, audit trail | projected/partial | evidence refs, trace refs, delivery refs, envelope | evidence is summary/ref, not proof or assurance | projection-safe summary only |
| KD-06 Orchestration | ordered intake-to-review handoff | enforced/explicit in minimal loop, projected in contract | work packet lifecycle status and step refs | no product workflow law or service instances exposed | projection-safe summary only |
| KD-07 Performance | deterministic bounded behavior, future cost/time hints | documented/implicit | optional later cost/time/attention posture | no service-level or readiness claim | not required for OPC P0 except omission |
| KD-08 Protocol Versioning | protocol/binding/runtime refs | projected/partial | version refs and binding refs in envelope | contract cites versions without MPLP mutation claim | projection-safe refs only |
| KD-09 Security | runtime-private omission and no-dispatch boundaries | projected/partial | omission markers, non-execution flags, no raw payload fields | public DTO excludes raw private fields and handles | projection-safe summary only |
| KD-10 State Sync | continuity, VSL refs, accepted outcome state | projected/partial | `continuity_pointer`, `vsl_state_ref`, snapshot refs | no raw store/SQLite handle exposure | projection-safe summary/ref only |
| KD-11 Transaction | accepted/rejected/revised, delivery save/export consistency | implicit/projected | acceptance and delivery artifact state refs | no distributed transaction or storage guarantee claim | projection-safe posture only |

Capability-family duty coverage:

| Capability family | Duties that must be represented now | Duties that may stay omitted/deferred now |
| --- | --- | --- |
| Intent/dialog/intake | KD-01, KD-02, KD-03, KD-05, KD-06, KD-08, KD-09 | KD-07 as omission; KD-11 unless state mutation occurs |
| Work/objective packet | KD-01, KD-02, KD-05, KD-06, KD-08, KD-09, KD-10 | KD-07 as omission; KD-11 as snapshot/export posture only |
| Assignment/activity | KD-01, KD-03, KD-05, KD-06, KD-08, KD-09 | KD-07 omitted; KD-11 if persisted |
| Review/acceptance | KD-01, KD-02, KD-04, KD-05, KD-06, KD-08, KD-09, KD-11 | KD-07 omitted |
| Delivery/continuity | KD-01, KD-02, KD-05, KD-08, KD-09, KD-10, KD-11 | KD-07 omitted |
| AEL boundary | KD-02, KD-03, KD-05, KD-06, KD-08, KD-09, KD-11 | KD-07 omitted unless measured |
| VSL/PSG/drift/learning refs | KD-02, KD-04, KD-05, KD-08, KD-09, KD-10, KD-11 | KD-07 omitted unless measured |

## Recursive Master Dependency Matrix

| SoloCrew stage | Product capability | Wow moment | Required Cognitive_OS neutral capability | Runtime/service family | Public contract need | MPLP modules | Advanced posture | Kernel duties | Current coverage | Gap type | Priority | Next wave candidate | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OPC Foundation | intent intake and clarification | one goal enters the system safely | `operator_intent_summary`, `dialog_ref`, `clarification_ref`, `source_intent_ref` | Intent Intake + Dialog Posture | intent/intake summary | Context, Dialog, Confirm, Trace, Core | intent drift marker optional-now | KD-01,02,03,05,06,08,09 | partial/implicit | missing public component | P0 | operator work-packet contract with additional fields | blocked |
| OPC Foundation | work packet formation | intent becomes bounded work | `work_intake_summary`, `objective_packet` | Work Packet + Plan Runtime | objective packet | Context, Plan, Trace, Core | semantic loss marker | KD-01,02,05,06,08,09,10 | designed only | missing DTO | P0 | operator work-packet contract | blocked |
| OPC Foundation | assignment and activity | work is visibly routed | `assignment_summary`, `coordination_scope`, `worker_activity_summary` | Assignment + Worker Lifecycle | assignment/activity summaries | Role, Collab, Plan, Trace, Core | AEL event ref as boundary only | KD-01,03,05,06,08,09 | partial worker surfaces | not work-linked | P0 | operator work-packet contract | blocked |
| OPC Foundation | review and delivery | output is reviewed and saved | `reviewable_output_summary`, `acceptance_state`, `delivery_artifact_summary`, `continuity_pointer` | Review + Delivery + Continuity | review/output/delivery summaries | Confirm, Trace, Plan, Context, Core | VSL state ref, learning feedback ref | KD-01,02,04,05,06,08,09,10,11 | partial review/objective surfaces | missing unified handoff | P0 | operator work-packet contract | blocked |
| Operating Loop | repeatable session continuity | work resumes with context | `continuity_pointer`, `vsl_state_ref`, `runtime_event_summary` | Continuity + VSL + Event Runtime | continuity and event posture | Context, Trace, Core, Plan | VSL required | KD-03,05,08,09,10,11 | partial | needs stronger projection | P2 | operating-loop continuity contract | blocked until P0 |
| Operating Loop | correction and preference loop | feedback influences future work safely | `operator_feedback_summary`, `learning_feedback_ref`, `preference_summary` | Learning + Memory/Preference | feedback/preference posture | Confirm, Trace, Context, Plan, Core | Learning required | KD-04,05,08,09,10 | partial | needs loop-level contract | P2 | learning feedback projection wave | blocked until P0 |
| Team Lite | role review and handoff | humans and agents share responsibility | `role_summary`, `collaboration_summary`, `coordination_scope` | Role/Collab + Review Runtime | role-aware handoff | Role, Collab, Confirm, Trace, Core | AEL later for worker bridge | KD-01,03,05,06,08,09 | partial role/worker surfaces | team semantics not authorized | P3 | Team Lite upstream readiness | backlog |
| Company Reality Model | business graph and capability gaps | company reality becomes inspectable | `graph_projection_summary`, `psg_pointer`, `value_state_summary` | PSG + VSL + Evidence Runtime | graph pointer/summary | Context, Plan, Trace, Core, Role, Collab | PSG/VSL required | KD-01,02,05,08,09,10,11 | runtime-private first pass | public graph contract missing | P4 | graph projection planning wave | backlog |
| AI-native Company OS | agent workforce and external boundary | company work runs through governed human-agent system | `workforce_lifecycle_summary`, `execution_event_posture`, `extension_boundary`, `network_boundary`, `learning_feedback_summary` | Worker Lifecycle + AEL + Extension/Network + Learning | workforce/action boundary contracts | all 10 modules as applicable | AEL/VSL/PSG/drift/learning all required | all 11 duties | partial foundations | full OS runtime missing | P5 | OS architecture roadmap wave | backlog |

Note: `workforce_lifecycle_summary` above is a planning label for the long
route and must be normalized before any public contract is implemented.

## Current Next Task Validation

Validation answer:

`YES_WITH_ADDITIONAL_FIELDS`

The next implementation wave should still be:

`CGOS-OPERATOR-WORK-PACKET-MPLP-BOUND-PROJECTION-CONTRACT-IMPLEMENTATION`

But it should be renamed or scoped in the prompt as:

`CGOS-OPERATOR-WORK-PACKET-MPLP-BOUND-PROJECTION-CONTRACT-IMPLEMENTATION-WITH-ADDITIONAL-FIELDS`

Required additions to the planned contract:

- `dialog_ref`
- `clarification_ref`
- `source_intent_ref`
- `intent_drift_marker`
- `semantic_loss_marker`
- `psg_pointer`
- `ael_event_ref`
- `vsl_state_ref` or `value_state_ref`
- `learning_feedback_ref`
- `kernel_duty_posture`
- `omission_marker`
- `non_execution_boundary`
- `no_provider_dispatch`
- `no_channel_dispatch`
- `no_tool_invocation`
- `no_training_authority`
- `no_automatic_mutation`

Implementation boundary for those fields:

- Use refs, summaries, markers, and booleans only.
- Do not implement full Dialog runtime, full AEL, full VSL, full PSG, full
  drift engine, full learning engine, provider dispatch, channel dispatch,
  tool invocation, or external action.
- Treat unavailable substrates as explicit omission/deferred markers.
- Keep the contract deterministic, product-neutral, projection-safe, and
  MPLP-bound through Cognitive_OS-side mapping.

## Required Next Waves

1. `CGOS-OPERATOR-WORK-PACKET-MPLP-BOUND-PROJECTION-CONTRACT-IMPLEMENTATION-WITH-ADDITIONAL-FIELDS`
   - Primary repo: Cognitive_OS.
   - Implement public DTO/helper only after recording component-level MPLP
     binding, advanced-substrate refs/omissions, and kernel-duty posture.
   - No SoloCrew or MPLP-Protocol changes by default.

2. `PROJECTION-CONSUMPTION-HANDOFF`
   - Primary repo: Cognitive_OS, reference SoloCrew.
   - Hand off the tested public contract and explicitly state what downstream
     products may consume.

3. `SOLOCREW-OPC-FOUNDATION-APP-IMPLEMENTATION`
   - Only after handoff is complete and SoloCrew consumes public package
     exports rather than the legacy bridge.

4. Later backlog waves:
   - Operating Loop continuity and learning projection.
   - Team Lite role/collab readiness.
   - Company Reality Graph projection planning.
   - governed provider/channel boundary planning.

## Boundary Proof

- no SoloCrew app implementation was introduced;
- no Cognitive_OS runtime implementation was introduced;
- no new Cognitive_OS public DTO or package export was introduced;
- no provider execution was introduced;
- no worker execution bridge was introduced;
- no Company Reality Model implementation was introduced;
- no Human-Agent Evolution Bridge implementation was introduced;
- no MPLP schema change occurred;
- no MPLP protocol law change occurred;
- no MPLP normative binding change occurred;
- no product semantic leakage was introduced into MPLP;
- `.DS_Store` local noise remained untracked and unstaged.
