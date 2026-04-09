# CGOS-OBJECT-SCHEMA-REVIEW-R2-v0.1

## Purpose

This memo is the Round 2 minimality review for the 17 first-batch Coregentis object schemas.

This round asks:

- which fields are truly necessary now
- which fields are prematurely stealing work from registry, binding, or runtime
- which fields should stay, become optional, or wait

This is not a freeze review.
It is a reduction and boundary-tightening review.

## Family-Level Minimality Judgment

The family remains valid and necessary, but some schemas were starting to overreach in three places:

1. runtime-bound objects were beginning to make shallow protocol binding feel structurally required before the binding phase exists
2. a few fields were carrying runtime interpretation hints too early
3. some object fields were close to registry/runtime concerns but are still acceptable if kept light

Minimality action therefore focuses on:

- keeping the family intact
- lightening a few requirements
- avoiding premature binding/runtime commitments

## Shared Minimality Decisions

### `source_input_ref`

#### Judgment

Keep as-is on `intent` and `delta-intent`.

#### Why

It is object-layer essential for entry objects because it ties governed cognition back to intake without requiring registry or binding machinery.

#### Patch action

None.

### `subject_object_refs`

#### Judgment

Keep as-is on `trace-evidence` and `decision-record`.

#### Why

These evidence objects need explicit subject targeting to remain useful in later trace/reconcile/runtime phases.

#### Patch action

None.

### `target_object_refs`

#### Judgment

Keep as-is on `action-unit`.

#### Why

It remains optional and does not overreach yet.
It is a reasonable object-level extension point for bounded execution targeting.

#### Patch action

None.

### `object_refs`

#### Judgment

Keep as-is on `conflict-case`.

#### Why

Conflict requires a generic multi-object collision surface.
This is object-layer appropriate and not yet overbuilt.

#### Patch action

None.

### `anchor_object_refs`

#### Judgment

Keep as-is on `episode`.

#### Why

Episodes are replay containers, and object anchors are a reasonable episodic affordance.
The field is optional and not too heavy yet.

#### Patch action

None.

### `project_id` breadth

#### Judgment

Current explicit project scoping is broadly acceptable for the `v0` single-project-first stream.

#### Why

The family is explicitly single-project-first at this stage, so broad `project_id` usage does not currently overreach.

#### Patch action

None.

## Object-by-Object Minimality Review

### 1. `project`

- what should stay:
  - `name`, `summary`, lifecycle status, and inherited base records
- what is too heavy:
  - nothing critical
- what can wait:
  - richer organization references, portfolio relations, external IDs
- exact patch recommendation:
  - no patch

### 2. `external-input-record`

- what should stay:
  - `source_kind`, `input_format`, `payload_summary`
- what is too heavy:
  - nothing critical
- what can wait:
  - richer source actor identity, stronger ingestion provenance
- exact patch recommendation:
  - no patch

### 3. `intent`

- what should stay:
  - `intent_kind`, `intent_summary`, `source_input_ref`
- what is too heavy:
  - no major overreach
- what can wait:
  - stricter protocol-binding requirement
  - richer target or subject semantics
- exact patch recommendation:
  - no patch

### 4. `delta-intent`

- what should stay:
  - `base_intent_id`, `delta_kind`, `change_summary`, `source_input_ref`
- what is too heavy:
  - `impact_scope_hint`
- what can wait:
  - impact scope reasoning belongs more naturally to drift/conflict/runtime analysis
- exact patch recommendation:
  - remove `impact_scope_hint`

### 5. `working-state-node`

- what should stay:
  - `node_kind`, `state_summary`
- what is too heavy:
  - nothing critical
- what can wait:
  - stronger placement or salience policy semantics
- exact patch recommendation:
  - no patch

### 6. `episode`

- what should stay:
  - `episode_kind`, `opened_at`, `closed_at`
- what is too heavy:
  - nothing critical
- what can wait:
  - richer actor/participant structure
- exact patch recommendation:
  - no patch

### 7. `semantic-fact`

- what should stay:
  - `fact_type`, `fact_statement`
  - optional `confidence_level`
  - optional `supporting_evidence_refs`
- what is too heavy:
  - current schema is not overbuilt
- what can wait:
  - stronger evidence model
  - stronger truth-status semantics
- exact patch recommendation:
  - no patch

### 8. `activation-signal`

- what should stay:
  - `trigger_object_id`, `signal_kind`, `scope`, `priority`
- what is too heavy:
  - nothing critical
- what can wait:
  - richer suppression/escalation data
- exact patch recommendation:
  - no patch

### 9. `action-unit`

- what should stay:
  - `activation_signal_id`, `action_kind`, `action_summary`
- what is too heavy:
  - nothing critical
- what can wait:
  - stronger execution envelope or target semantics
- exact patch recommendation:
  - no patch

### 10. `policy-rule`

- what should stay:
  - `policy_type`, `policy_scope_level`, `rule_name`, `rule_statement`
- what is too heavy:
  - nothing clearly overbuilt for this phase
- what can wait:
  - richer condition model, profile-pack semantics, evaluation logic
- exact patch recommendation:
  - no patch

### 11. `confirm-gate`

- what should stay:
  - `target_object_id`, `confirm_kind`
- what is too heavy:
  - required `protocol_binding_ref`
- what can wait:
  - exact reconstructability requirements belong to the binding phase
- exact patch recommendation:
  - keep `protocol_binding_ref` field
  - remove it from required

### 12. `trace-evidence`

- what should stay:
  - `evidence_kind`, `evidence_summary`, `subject_object_refs`
- what is too heavy:
  - required `protocol_binding_ref`
- what can wait:
  - exact export/reconstruction guarantees belong to the binding phase
- exact patch recommendation:
  - keep `protocol_binding_ref` field
  - remove it from required

### 13. `decision-record`

- what should stay:
  - `decision_type`, `decision_summary`, `outcome`, `subject_object_refs`
- what is too heavy:
  - nothing critical
- what can wait:
  - stronger decision basis structure
- exact patch recommendation:
  - no patch

### 14. `drift-record`

- what should stay:
  - `drift_kind`, `drift_summary`, `severity`, `observed_object_refs`
- what is too heavy:
  - no blocker
- what can wait:
  - impact basis
  - confidence model
  - detection basis
- exact patch recommendation:
  - no patch

### 15. `conflict-case`

- what should stay:
  - `conflict_kind`, `conflict_summary`, `object_refs`
- what is too heavy:
  - no blocker
- what can wait:
  - impact scope
  - confidence
  - stronger resolution structure
- exact patch recommendation:
  - no patch

### 16. `memory-promotion-record`

- what should stay:
  - `source_memory_layer`, `target_memory_layer`, `source_object_id`, `promotion_reason`
- what is too heavy:
  - no blocker
- what can wait:
  - richer approval/evidence structure
- exact patch recommendation:
  - no patch

### 17. `learning-candidate`

- what should stay:
  - `candidate_kind`, `candidate_summary`, `source_episode_refs`
- what is too heavy:
  - no blocker
- what can wait:
  - stronger scoring model
  - later promotion into learning sample
- exact patch recommendation:
  - no patch

## Runtime-Bound Object Judgment

### `intent`

- current `protocol_binding_ref` usage is shallow enough
- it is optional, which is appropriate before binding phase
- no patch

### `delta-intent`

- current `protocol_binding_ref` usage is shallow enough
- it is optional, which is appropriate before binding phase
- patch only removes `impact_scope_hint`, not binding

### `confirm-gate`

- current `protocol_binding_ref` shape is shallow enough
- current requiredness is too strong for this phase
- patch: make it optional by removing it from required

### `trace-evidence`

- current `protocol_binding_ref` shape is shallow enough
- current requiredness is too strong for this phase
- patch: make it optional by removing it from required

## Summary of Justified Patches

1. remove `delta-intent.impact_scope_hint`
2. make `confirm-gate.protocol_binding_ref` optional
3. make `trace-evidence.protocol_binding_ref` optional
4. update objects README to document shallow optional binding and project-scope minimality

## What Should Wait for R3

- shared reference-family consistency:
  - `source_input_ref`
  - `subject_object_refs`
  - `target_object_refs`
  - `object_refs`
  - `anchor_object_refs`
- possible reclassification review of `semantic-fact`
- whether some governance/evidence objects need stronger common status patterns
- whether runtime-bound objects should re-require binding stubs after the binding phase
