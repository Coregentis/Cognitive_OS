# Cognitive_OS Prepared-Action Dependency Baseline v0.1

`doc_id: CGOS-PREPARED-ACTION-DEPENDENCY-BASELINE-v0.1`

## A. Purpose

Define neutral Cognitive_OS dependency requirements for prepared-action
capability before downstream product consumption.

Downstream product planning identified a need for bounded action-preparation
semantics.

## B. Documentation Budget

| Artifact type | Decision | Reason |
|---|---|---|
| Prepared-action dependency baseline | allowed | one canonical neutral baseline |
| Separate audit | not created | avoid governance sprawl |
| Separate gate | not created | embedded boundary decisions |
| Separate implementation plan | not created | not an implementation wave |
| Schema change | not performed | planning only |
| Runtime source change | not performed | planning only |
| MPLP change | not performed | candidate/backlog only |

## C. Existing Asset Inventory

| Existing asset | Reuse decision | Reason |
|---|---|---|
| `runtime/core/runtime-types.ts` | reuse as current neutral runtime type inventory | already defines neutral runtime object families and authority/layer classes |
| `runtime/core/projection-service.ts` | reuse as current projection-safe validation/service reference | already shows how neutral projection-safe envelopes are validated below execution semantics |
| continuity projection assets | reuse | durable lifecycle continuity projection types and services show the current neutral continuity pattern for downstream-safe consumption |
| evidence / trace references | reuse | existing evidence refs and trace-linked projection-safe patterns already establish safe reference handling without proof/certification drift |
| governance baselines | reuse | durable lifecycle continuity dependency baseline provides the closest current neutral dependency-planning pattern |
| runtime tests | reuse | `tests/runtime/projection-safe-contract.test.mjs` and existing runtime tests already show boundary-focused validation patterns |
| README / CHANGELOG | reuse | current repository status surfaces already explain neutral runtime scope and non-capability boundaries |

## D. Neutral Capability Definition

Planning-only neutral capability names:

- `PreparedActionProjection`
- `PreparedActionIntentSummary`
- `PreparedActionRiskSummary`
- `PreparedActionEvidenceSufficiency`
- `PreparedActionMissingInformation`
- `PreparedActionConfirmationRequirement`
- `PreparedActionBoundaryPosture`

These are planning names only in this wave, not implemented source types.

## E. Required Semantics

- Prepared action is not execution.
- Prepared action is not approval.
- Prepared action is not dispatch.
- Prepared action is not provider/channel send.
- Prepared action is not queue insertion.
- Prepared action is not autonomous operation.
- Prepared action is a projection-safe representation of a possible future
  action requiring human-confirmed downstream handling.

## F. Projection-Safe Contract Requirements

| Contract surface | Required behavior | Boundary |
|---|---|---|
| action intent summary | express a bounded summary of a possible action without implying execution | summary-only and non-executing |
| risk summary | expose bounded risk narration without becoming policy verdict or execution authorization | explanatory only |
| evidence sufficiency | expose whether evidence appears sufficient in bounded terms | not approval, not readiness-to-execute |
| missing information | expose what remains absent in bounded terms | gap visibility only |
| confirmation requirement | expose whether human confirmation is required | display of requirement only, not approval control |
| safe evidence refs | preserve projection-safe evidence references only | references only, not proof/certification |
| runtime_private_fields_omitted | remain explicit when raw runtime-private state is omitted | boundary marker only |
| non-executing posture | state explicitly that the prepared action surface is not execution | non-executing and non-dispatching |

## G. Runtime Boundary Requirements

| Runtime concern | Required boundary | Needs implementation later? |
|---|---|---|
| risk policy | must remain outside current prepared-action display planning until neutral policy semantics are defined | yes |
| confirmation eligibility | must remain outside current prepared-action display planning until neutral confirmation semantics are defined | yes |
| execution eligibility | stays out of current prepared-action scope | yes |
| provider/channel side effect | out of scope for prepared-action dependency planning | no |
| queue semantics | out of scope for prepared-action dependency planning | no |
| runtime-private state | must remain omitted from any downstream-consumable prepared-action projection | yes |
| trace/evidence linkage | may be referenced only through projection-safe evidence refs and bounded summary fields | yes |

Expected boundary:

- risk policy / confirmation eligibility may need future implementation
- execution eligibility stays out of current prepared-action scope
- provider/channel side effects out of scope
- queue semantics out of scope

## H. Downstream Consumption Handoff

Downstream product repositories may consume projection-safe prepared-action
envelopes only after Cognitive_OS exposes a neutral contract.
Downstream products must not import runtime-private internals.
Downstream products must not infer approval, dispatch, execution, or queue
semantics from prepared-action projections.

## I. MPLP Posture

- No MPLP protocol change.
- No MPLP schema change.
- No MPLP binding change.
- Any promotion of prepared-action or execution-boundary semantics into MPLP
  requires candidate/backlog handling and MPGC review.

## J. Recommended Next Step

`CGOS_PREPARED_ACTION_DEPENDENCY_READY_FOR_DESIGN`

## K. Prepared-Action Design Baseline and Neutral Interface Skeleton

### K1. Design Objective

Define neutral prepared-action interface surfaces for projection-safe
downstream consumption, without introducing execution, approval, dispatch,
provider/channel send, queue semantics, or runtime behavior.

### K2. Design Surface

| Surface | Purpose | Boundary |
|---|---|---|
| `PreparedActionProjection` | top-level projection-safe prepared-action envelope | draft-only, non-executing |
| `PreparedActionIntentSummary` | bounded summary of a possible future action | not execution or dispatch |
| `PreparedActionRiskSummary` | bounded risk and boundary narration | explanatory only |
| `PreparedActionEvidenceSufficiency` | bounded sufficiency posture | not approval or eligibility grant |
| `PreparedActionMissingInformation` | bounded missing-information list | gap visibility only |
| `PreparedActionConfirmationRequirement` | bounded confirmation requirement summary | not approval control |
| `PreparedActionBoundaryPosture` | explicit non-executing and non-queueing posture | no provider/channel, no queue, no execution |
| `PreparedActionSafeEvidenceRef` | projection-safe evidence reference shape | references only |

### K3. Neutral Field Rules

Allowed categories:

- `summary`
- `risk_summary`
- `evidence_sufficiency`
- `missing_information`
- `confirmation_requirement`
- `boundary_posture`
- `safe_evidence_refs`
- `runtime_private_fields_omitted`
- `non_executing_posture`

Forbidden categories:

- `execution_result`
- `dispatch_result`
- `approval_result`
- `provider_channel_result`
- `queue_state`
- `runtime_private_payload`
- `raw_vsl`
- `raw_psg`
- `raw_trace`

### K4. Downstream-Safe Semantics

- Prepared action is draft-only.
- Prepared action is projection-safe.
- Prepared action may describe a possible future action.
- Prepared action must not imply execution eligibility as a granted capability.
- Prepared action may express confirmation requirement only as a requirement
  summary, not as an approval control.

### K5. Interface Skeleton Decision

`CGOS_PREPARED_ACTION_INTERFACE_SKELETON_DEFINED`

## L. Minimal Prepared-Action Scaffold Planning

### L1. Planning Objective

Define the smallest safe prepared-action scaffold that Cognitive_OS may
expose next, while remaining projection-safe, draft-only, non-executing,
non-approving, non-dispatching, non-provider, and non-queueing.

### L2. File-Level Scaffold Target Map

| File | Current role | Minimal next scaffold allowed? | Boundary |
|---|---|---|---|
| `runtime/core/prepared-action-types.ts` | neutral prepared-action interface surface | yes; extend type surface only if still neutral | no behavior, no product naming, no execution semantics |
| `runtime/core/prepared-action-contract.ts` | projection-safe prepared-action validation helpers | yes; extend validation / projection-safe helpers only | no side effects, no dispatch, no approval, no queue |
| `tests/runtime/prepared-action-contract.test.mjs` | contract-level regression coverage for prepared-action interfaces | yes; expand harness / regression coverage | negative-boundary and projection-safe checks only |
| `runtime/core/projection-types.ts` | active shipped projection-safe runtime contracts | no by default | remain unchanged unless a strictly necessary neutral alias is justified later |
| `runtime/core/projection-service.ts` | active deterministic projection-safe service for shipped surfaces | no for behaviorful prepared-action logic | must not take prepared-action runtime behavior in the next scaffold wave |
| `runtime/core/runtime-types.ts` | global neutral runtime object taxonomy | maybe, only if a neutral non-behavioral cross-reference is strictly required | no behavior, no product naming, no execution semantics |
| `runtime/core/runtime-orchestrator.ts` | executable minimal runtime orchestration | no | must remain untouched in the next prepared-action scaffold wave |

### L3. Allowed vs Forbidden Scaffold Scope

| Candidate scaffold | Allowed now? | Boundary |
|---|---|---|
| projection-safe envelope constructor | yes, if side-effect-free | constructor only, no runtime state mutation, no execution semantics |
| validation helper expansion | yes | validation-only and projection-safe |
| non-behavioral mapper | yes | neutral mapping only, no policy or execution meaning |
| evidence-ref linkage helper | yes | reference-only and projection-safe |
| risk summary formatter | yes | explanatory only |
| confirmation requirement formatter | yes | descriptive only, not approval control |
| execution eligibility logic | no | not allowed until a later neutral upstream design/implementation wave |
| dispatch/provider bridge | no | out of scope |
| queue insertion bridge | no | out of scope |
| approval control path | no | out of scope |
| runtime state mutation | no | out of scope |

### L4. Downstream Consumption Handoff

Downstream products may only consume a minimal projection-safe prepared-action
scaffold after Cognitive_OS exposes it explicitly.
Downstream products must not infer execution, approval, dispatch,
provider/channel send, or queue semantics from it.
Downstream products must not import runtime-private state or bypass contract
helpers.

### L5. Recommended Next Step

`CGOS_MINIMAL_PREPARED_ACTION_SCAFFOLD_READY`
