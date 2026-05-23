---
doc_id: CGOS-HUMAN-CONFIRMED-ACTION-PREPARATION-CONTRACT-01
version: v0.1
status: implementation_complete
scope: neutral_public_contract_for_human_confirmed_action_preparation
created_at: 2026-05-24T02:08:36+08:00
solocrew_run04_baseline: a4397108dc2b15891442d40a2e04220a9c30ce36
---

# CGOS Human-Confirmed Action Preparation Contract 01

## Frontmatter

This wave implements a neutral public contract for preparing
human-confirmed actions.

It does not execute actions. It does not authorize autonomous execution. It
does not implement provider, model, tool, or worker calls. It does not modify
MPLP. It does not modify SoloCrew.

## Starting Repo Truth

| Field | Value |
| --- | --- |
| Repo URL | `https://github.com/Coregentis/Cognitive_OS.git` |
| Branch | `main` |
| Starting HEAD | `382d844e5e36a56261d081e89229cc7937727c61` |
| Starting origin/main | `382d844e5e36a56261d081e89229cc7937727c61` |
| Starting status | untracked `.DS_Store` files only |

Preflight inspected:

- `runtime/public/`
- `runtime/core/`
- `tests/runtime/`
- `governance/audits/`
- `governance/architecture/`
- `package.json`

The repo already contained runtime-private prepared-action and confirmation
concepts. This wave adds a neutral public contract surface instead of exposing
runtime-private services.

## SoloCrew Run 04 Baseline

SoloCrew Personal Console Run 04 reached:

```text
DOGFOODING_READY_FOR_DAILY_READONLY_USE
```

Baseline commit:

```text
a4397108dc2b15891442d40a2e04220a9c30ce36
```

This Cognitive_OS wave does not modify SoloCrew. SoloCrew remains a downstream
consumer candidate for a later consumption wave.

## Contract Scope

Added public files:

- `runtime/public/human-confirmed-action-preparation-dto.ts`
- `runtime/public/human-confirmed-action-preparation-bundle.ts`

Added package exports:

- `./runtime/public/human-confirmed-action-preparation-dto`
- `./runtime/public/human-confirmed-action-preparation-bundle`

The contract supports preparing reviewable action packets with:

- objective and target surface refs
- prepared action title and summary
- action kind
- requested-by ref
- explicit human authority requirement
- safe evidence refs
- risk summary
- expected outcome
- allowed next states
- blocked actions
- omissions
- boundary flags

Prepared action packets remain projection-safe summaries. They do not contain
provider, model, tool, worker, queue, external channel, or runtime-private
handles.

## Neutral Runtime Boundary

The new public contract uses neutral terms:

- `HumanConfirmedActionPreparation`
- `createHumanConfirmedActionPreparation`
- `validateHumanConfirmedActionPreparation`
- `summarizeHumanConfirmedActionPreparation`
- `transitionHumanConfirmedActionPreparationState`

It does not use downstream product labels as contract names or contract law.

The contract is public and projection-safe, but it is not a runtime-private
service export and not an execution bridge.

## Public DTO

The DTO defines:

- `HumanConfirmedActionPreparation`
- `HumanConfirmedActionPreparationActionKind`
- `HumanConfirmedActionPreparationState`
- `HumanConfirmedActionPreparationConfirmationBoundary`
- `HumanConfirmedActionPreparationBoundaryFlags`
- evidence, risk, blocked-action, omission, and transition-record shapes

Required invariant fields include:

```text
human_authority_required: true
autonomous_execution_authorized: false
confirmation_is_not_execution: true
prepares_action: true
executes_action: false
```

## Public Bundle

The bundle exports:

- `createHumanConfirmedActionPreparation(input)`
- `validateHumanConfirmedActionPreparation(preparation)`
- `summarizeHumanConfirmedActionPreparation(preparation)`
- `transitionHumanConfirmedActionPreparationState(input)`

The bundle accepts plain input and returns DTO output. It does not import
runtime-private services. It does not open providers, models, tools, workers,
publishing channels, payment channels, outreach channels, mutation paths,
training paths, or writeback paths.

## State Machine

Allowed transitions:

| From | To |
| --- | --- |
| `prepared` | `needs_human_review`, `parked` |
| `needs_human_review` | `confirmed_by_human`, `rejected_by_human`, `revised_by_human`, `parked` |
| `confirmed_by_human` | `parked` |
| `rejected_by_human` | `revised_by_human`, `parked` |
| `revised_by_human` | `needs_human_review`, `parked` |
| `parked` | `needs_human_review` |
| `expired` | `parked` |

Invalid transitions are rejected by
`transitionHumanConfirmedActionPreparationState`.

## Evidence and Risk Summary

Evidence refs are summary/ref only:

- `evidence_ref`
- optional `evidence_kind`
- optional `summary`
- `ref_only: true`
- `runtime_private_payload_omitted: true`

Risk summaries are bounded:

- `risk_level`
- `summary`
- `boundary_summary`
- optional `mitigations`
- `summary_only: true`

## Confirmation Is Not Execution

This wave preserves the invariant:

```text
Prepared != confirmed.
Confirmed != executed.
```

`confirmed_by_human` only means the prepared action is eligible for a future
execution bridge if such a bridge is separately implemented and separately
authorized. It does not flip any execution authorization flag.

## MPLP Mapping

This mapping is guide/profile-level only. It does not claim an MPLP schema
change, protocol law change, or normative binding change.

- Plan: prepared action intent and expected outcome
- Confirm: explicit human confirmation boundary
- Trace: evidence refs and state transition record
- Context: objective / target surface refs
- Role: human authority holder

<!-- CGOS_HUMAN_CONFIRMED_ACTION_PREPARATION_BINDING_MAP_START -->
```json
{
  "document_control": {
    "task_id": "CGOS-HUMAN-CONFIRMED-ACTION-PREPARATION-CONTRACT-01",
    "authority_order": "MPLP -> Cognitive_OS -> downstream products",
    "mplp_protocol_modified": false,
    "cognitive_os_runtime_behavior_modified": false,
    "package_export_added": true,
    "downstream_app_modified": false,
    "no_schema_change": true,
    "no_protocol_law_change": true,
    "no_normative_binding_change": true,
    "no_provider_execution": true,
    "no_model_execution": true,
    "no_tool_execution": true,
    "no_worker_execution": true,
    "no_publishing": true,
    "no_external_action": true,
    "no_automatic_mutation": true,
    "no_automatic_acceptance": true,
    "no_training": true,
    "no_writeback": true,
    "no_runtime_private_handle_exposure": true
  },
  "allowed_lifecycle_families": [
    "Context",
    "Plan",
    "Confirm",
    "Trace",
    "Role",
    "Extension",
    "Dialog",
    "Collab",
    "Core",
    "Network"
  ],
  "public_surface_bindings": [
    {
      "package_export": "./runtime/public/human-confirmed-action-preparation-dto",
      "file_path": "runtime/public/human-confirmed-action-preparation-dto.ts",
      "public_surface_name": "human-confirmed-action-preparation-dto",
      "surface_families": [
        "Context",
        "Plan",
        "Confirm",
        "Trace",
        "Role",
        "Core"
      ],
      "purpose": "Projection-safe public DTO for non-executing prepared actions that require explicit human confirmation before any later separately authorized execution bridge can exist.",
      "sufficiency": "Existing lifecycle semantics cover objective and target context refs, prepared action intent and expected outcome, human confirmation boundary, evidence refs and transition trace, and human authority holder role without changing MPLP schema or protocol law.",
      "candidate_followup_needed": false,
      "correction_status": "mapped",
      "components": [
        {
          "name": "HumanConfirmedActionPreparation",
          "families": [
            "Context",
            "Plan",
            "Confirm",
            "Trace",
            "Role",
            "Core"
          ]
        },
        {
          "name": "HumanConfirmedActionPreparationBoundaryFlags",
          "families": [
            "Confirm",
            "Core"
          ]
        }
      ],
      "non_claims": [
        "non_normative_runtime_mapping",
        "no_schema_mutation",
        "no_protocol_law_mutation",
        "no_normative_binding_mutation",
        "no_runtime_private_service_exposure",
        "no_runtime_private_store_exposure",
        "no_provider_execution",
        "no_model_execution",
        "no_tool_execution",
        "no_worker_execution",
        "no_publishing",
        "no_external_action",
        "no_training_authority",
        "no_writeback_authority",
        "no_automatic_mutation",
        "no_automatic_acceptance"
      ]
    },
    {
      "package_export": "./runtime/public/human-confirmed-action-preparation-bundle",
      "file_path": "runtime/public/human-confirmed-action-preparation-bundle.ts",
      "public_surface_name": "human-confirmed-action-preparation-bundle",
      "surface_families": [
        "Context",
        "Plan",
        "Confirm",
        "Trace",
        "Role",
        "Core"
      ],
      "purpose": "Projection-safe public helper for creating, validating, summarizing, and state-transitioning non-executing prepared action packets from plain input.",
      "sufficiency": "Existing lifecycle semantics cover prepared intent creation, human confirmation boundary validation, transition trace records, and summary-only refs while preserving non-execution and no-authority flags.",
      "candidate_followup_needed": false,
      "correction_status": "mapped",
      "components": [
        {
          "name": "createHumanConfirmedActionPreparation",
          "families": [
            "Context",
            "Plan",
            "Confirm",
            "Trace",
            "Role",
            "Core"
          ]
        },
        {
          "name": "validateHumanConfirmedActionPreparation",
          "families": [
            "Confirm",
            "Trace",
            "Core"
          ]
        },
        {
          "name": "summarizeHumanConfirmedActionPreparation",
          "families": [
            "Plan",
            "Confirm",
            "Trace",
            "Core"
          ]
        },
        {
          "name": "transitionHumanConfirmedActionPreparationState",
          "families": [
            "Confirm",
            "Trace",
            "Role",
            "Core"
          ]
        }
      ],
      "non_claims": [
        "non_normative_runtime_mapping",
        "no_schema_mutation",
        "no_protocol_law_mutation",
        "no_normative_binding_mutation",
        "no_runtime_private_service_exposure",
        "no_runtime_private_store_exposure",
        "no_provider_execution",
        "no_model_execution",
        "no_tool_execution",
        "no_worker_execution",
        "no_publishing",
        "no_external_action",
        "no_training_authority",
        "no_writeback_authority",
        "no_automatic_mutation",
        "no_automatic_acceptance"
      ]
    }
  ]
}
```
<!-- CGOS_HUMAN_CONFIRMED_ACTION_PREPARATION_BINDING_MAP_END -->

## Boundary Preservation

This wave does not:

- execute actions
- authorize autonomous execution
- implement provider/model/tool/worker calls
- implement publishing, payment, outreach, or external action
- enable automatic mutation
- enable autonomous acceptance
- enable training
- enable writeback
- modify MPLP
- modify SoloCrew

Boundary flags preserve:

```text
projection_safe: true
summary_only: true
non_executing: true
evidence_safe: true
prepares_action: true
executes_action: false
```

All execution and external side-effect authority flags remain false.

## Test Results

Added:

- `tests/runtime/human-confirmed-action-preparation-public-contract.test.mjs`

The test covers:

- package exports
- non-executing prepared action creation
- human authority requirement
- autonomous execution denial
- confirmation-is-not-execution invariant
- provider/model/tool/worker execution denial
- publishing/payment/outreach/external action denial
- automatic mutation/autonomous acceptance/training/writeback denial
- allowed and invalid transitions
- `confirmed_by_human` preserving false execution flags
- refs-only evidence
- no runtime-private service export
- no downstream product terms in the public contract files

## Remaining Gaps

- No downstream product consumes this contract yet.
- No execution bridge exists.
- No durable confirmation storage or product UI is introduced.
- This is not a production readiness claim.

## Next Recommended Wave

```text
SOLOCREW-HUMAN-CONFIRMED-ACTION-PREPARATION-CONSUMPTION-01
```

The next wave can let SoloCrew consume this neutral public contract to prepare
reviewable action packets from read-only decisions. It must still not execute.
