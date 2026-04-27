# CGOS-SOLOCREW-V2.2-CONSUMPTION-HANDOFF-v0.1

## 1. Document Control

- doc_id: CGOS-SOLOCREW-V2.2-CONSUMPTION-HANDOFF-v0.1
- task_id: CGOS-SOLOCREW-V2.2-CONSUMPTION-HANDOFF-01
- status: Consumption Handoff Baseline
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- primary_repo: Cognitive_OS
- supporting_repos_inspected: SoloCrew, MPLP-Protocol
- machine_readable_manifest: `handoffs/solocrew-v2.2-cgos-consumption-handoff.v0.yaml`
- posture: handoff-only; no SoloCrew implementation

## 2. Remote Truth Snapshot

| Repo | URL | Branch | Local HEAD | origin/main HEAD | Worktree | Relevant tags |
| --- | --- | --- | --- | --- | --- | --- |
| Cognitive_OS | https://github.com/Coregentis/Cognitive_OS.git | main | b8668f28e3dddc580fac1d2df18c2a5ee7aa384a | b8668f28e3dddc580fac1d2df18c2a5ee7aa384a | clean | cgos-projection-revision-runtime-rc-20260421 |
| SoloCrew | https://github.com/Coregentis/SoloCrew.git | main | 72a9f79054051527b9a28aa7c4435bf80d148d94 | 72a9f79054051527b9a28aa7c4435bf80d148d94 | clean | solocrew-v2.1-rc-review-only-chain-20260427 |
| MPLP-Protocol | https://github.com/Coregentis/MPLP-Protocol.git | main | 0cf0477938340a443614d03d9fb51ac764b960c7 | 0cf0477938340a443614d03d9fb51ac764b960c7 | clean | protocol-v1.0.0, v1.0.0 |

## 3. Scope and Non-Goals

This handoff defines how SoloCrew V2.2 may consume Cognitive_OS projection-safe posture after the upstream posture foundation work.

Non-goals:

- no SoloCrew implementation
- no SoloCrew modification
- no MPLP modification
- no product-specific Cognitive_OS runtime law
- no third object-duty matrix
- no claim that all MPLP modules or Kernel Duties are fully production implemented
- no autonomous execution, provider dispatch, channel dispatch, marketplace implementation, release, tag, package, or paid-product readiness claim

## 4. Why SoloCrew Remains Paused

SoloCrew V2.2 remains paused until this handoff is accepted by owner review. Cognitive_OS now provides neutral projection-safe posture contracts and a downstream-neutral handoff fixture, but SoloCrew must consume those as upstream posture rather than redefining runtime law in a product-local workspace implementation.

The next SoloCrew implementation wave may resume only after this handoff is accepted. The next allowed task name is:

- `SOLOCREW-V2.2-IMPL-01-WORKSPACE-SESSION-CONTINUITY-WITH-CGOS-CONSUMPTION`

## 5. Upstream Cognitive_OS Assets SoloCrew Must Consume

SoloCrew V2.2 must treat these Cognitive_OS files as upstream source of truth for consumption posture:

- `runtime/core/projection-safe-envelope.ts`
- `runtime/core/projection-safe-runtime-envelope-builder.ts`
- `runtime/core/state-snapshot-posture.ts`
- `runtime/core/transaction-export-posture.ts`
- `runtime/core/error-insufficiency-posture.ts`
- `runtime/core/projection-binding-consumption.ts`
- `runtime/core/mplp-module-posture.ts`
- `runtime/core/kernel-duty-runtime-posture.ts`
- `runtime/core/default-mplp-module-posture.ts`
- `runtime/core/default-kernel-duty-posture.ts`
- `runtime/fixtures/projection-safe-downstream-handoff-fixture.ts`

Governance context:

- `governance/research/CGOS-UPSTREAM-COMPLETION-DEEP-AUDIT-AND-REFACTOR-PLAN-v0.1.md`
- `governance/research/CGOS-BINDING-LAYER-RELATIONSHIP-AUDIT-v0.1.md`
- `governance/baselines/CGOS-KERNEL-DUTY-BINDING-BASELINE-v0.1.md`

## 6. SoloCrew V2.2 Feature-To-CGOS Consumption Map

| SoloCrew V2.2 feature | Cognitive_OS posture SoloCrew must consume | SoloCrew local scope |
| --- | --- | --- |
| Workspace/session continuity | projection-safe runtime envelope; state/snapshot posture; Context, Core, Trace posture; KD-10, KD-09, KD-05, KD-08, KD-11 references | Product workspace UX shell, local workspace ids, labels, storage paths, and local continuation display |
| Saved workspace history | projection-safe runtime envelope refs; safe evidence refs; omission markers; transaction/export posture | Product-local ordered history display and deterministic local persistence |
| Review packet export later | object/export binding posture; Trace, Confirm, Plan, Core posture; KD-05, KD-08, KD-09, KD-11, KD-02 references | Human-readable packet rendering only; no raw runtime-private payloads |
| Founder dashboard continuation later | projection-safe runtime envelope refs; state/snapshot posture; error/insufficiency posture | Dashboard layout and product-local copy |
| Developer Company / Project Governance journey later | neutral posture refs and safe summaries from Cognitive_OS | Product journey copy and review-only chain rendering |

## 7. Workspace/Session Continuity Consumption Rule

SoloCrew may store workspace ids, labels, storage paths, active journey id, latest step, next review action, and product-local history records.

SoloCrew must store Cognitive_OS posture only as consumed references or bounded summaries:

- `projection_safe_runtime_envelope_ref`
- `state_snapshot_posture_ref`
- `transaction_export_posture_ref`
- `error_insufficiency_posture_ref`
- object/export binding posture references
- module posture summaries
- Kernel Duty posture summaries
- safe evidence refs
- omission markers
- protocol version refs
- binding version refs

SoloCrew must not store raw Cognitive_OS runtime-private records or reconstruct Cognitive_OS runtime semantics in its workspace store.

## 8. Saved Workspace History Consumption Rule

Saved workspace history is product-local. It may record user-facing event summaries, safe source refs, safe evidence refs, and continuation refs. It must not become a Cognitive_OS event bus, State Sync law, Transaction law, Security omission law, or Observability evidence law.

History events must preserve:

- `runtime_private_fields_omitted: true`
- `non_executing: true`
- safe evidence refs only
- omission markers where Cognitive_OS posture omits private state
- protocol and binding version refs when export or protocol posture is displayed

## 9. Review Packet Export Future Consumption Rule

Review packet export is not implemented by this handoff. When SoloCrew later implements review packet export, it must consume:

- object/export binding posture from Cognitive_OS
- Trace, Confirm, Plan, and Core module posture
- KD-02 Error Handling, KD-05 Observability, KD-08 Protocol Versioning, KD-09 Security, and KD-11 Transaction posture
- safe evidence refs and omission markers

The packet renderer may be product-local, but exportability, reconstructability, protocol versioning, evidence posture, and security omission semantics remain Cognitive_OS-owned.

## 10. Founder Dashboard Continuation Future Consumption Rule

Founder dashboard continuation is not implemented by this handoff. When SoloCrew later implements dashboard continuation, it must consume projection-safe runtime envelope refs, state/snapshot posture, error/insufficiency posture, safe evidence refs, and omission markers. Dashboard layout and copy may remain product-local.

## 11. Required V2.2 Module And Duty Posture

Required module posture names for SoloCrew V2.2:

- Context
- Core
- Trace
- Plan
- Confirm

Required Kernel Duty ids for SoloCrew V2.2:

- KD-02
- KD-05
- KD-08
- KD-09
- KD-10
- KD-11

## 12. Ownership Boundary

SoloCrew may own:

- product workspace UX shell
- product-local labels
- product-local history display
- review packet rendering later
- dashboard layout later
- private-alpha journey copy

SoloCrew must not own:

- Context law
- Plan law
- Confirm law
- Trace law
- Core law
- State Sync law
- Transaction law
- Security omission law
- Observability evidence law
- Protocol versioning posture
- Object/export binding semantics

## 13. Required SoloCrew IMPL-01 Acceptance Checks

The later SoloCrew IMPL-01 wave must prove:

- workspace can be created, saved, listed, loaded, and restored
- workspace history appends deterministically
- workspace stores Cognitive_OS posture refs and bounded summaries, not raw runtime-private payloads
- required module postures are present: Context, Core, Trace, Plan, Confirm
- required Kernel Duties are present: KD-02, KD-05, KD-08, KD-09, KD-10, KD-11
- state/snapshot posture is consumed for continuation
- transaction/export posture is consumed for consistency summaries
- error/insufficiency posture is consumed for blocked or stale restore cases
- `runtime_private_fields_omitted` is true
- `non_executing` is true
- review packet export is not implemented in IMPL-01

## 14. Required Leakage And Boundary Checks

SoloCrew IMPL-01 must add no-product-law-leakage checks proving that product code does not redefine:

- Context law
- Plan law
- Confirm law
- Trace law
- Core law
- State Sync law
- Transaction law
- Security omission law
- Observability evidence law
- Protocol versioning posture
- Object/export binding semantics

It must also prove:

- no MPLP certification claim
- no MPLP endorsement claim
- no provider dispatch
- no channel dispatch
- no marketplace implementation
- no autonomous execution
- no paid-product readiness claim
- no V2.2 complete claim
- no V3.0 release claim

## 15. Resume Decision

SoloCrew may resume only after this handoff is accepted by owner review.

Next allowed SoloCrew wave:

- `SOLOCREW-V2.2-IMPL-01-WORKSPACE-SESSION-CONTINUITY-WITH-CGOS-CONSUMPTION`

This handoff is a baseline for consumption and testing. It is not SoloCrew implementation and does not unblock later review packet export, dashboard continuation, paid-pilot, public beta, or GA work by itself.
