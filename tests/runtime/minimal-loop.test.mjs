import test from "node:test";
import assert from "node:assert/strict";

import { execute_scenario_file } from "../../runtime/harness/minimal-loop-harness.ts";

const repoRoot = process.cwd();

test("fresh-intent executes a neutral minimal in-memory path", async () => {
  const result = await execute_scenario_file(
    repoRoot,
    "./tests/fixtures/min-loop/fresh-intent/scenario.json"
  );

  assert.equal(result.scenario_id, "fresh-intent");
  assert.equal(result.status, "executed");
  assert.ok(result.created_objects.length > 0);
  assert.equal(result.ordered_step_outcomes?.length, 7);
  assert.ok(result.event_timeline?.length);
  assert.equal(result.event_timeline?.[0]?.sequence, 1);
  assert.ok(
    result.event_timeline?.every(
      (entry, index) => entry.sequence === index + 1
    )
  );
  assert.deepEqual(
    result.ordered_step_outcomes?.map((outcome) => outcome.step),
    ["form", "place", "activate", "confirm", "trace", "reconcile", "consolidate"]
  );

  const objectTypes = new Set(result.created_objects.map((record) => record.object_type));
  assert.ok(objectTypes.has("external-input-record"));
  assert.ok(objectTypes.has("intent"));
  assert.ok(objectTypes.has("working-state-node"));
  assert.ok(objectTypes.has("episode"));
  assert.ok(objectTypes.has("activation-signal"));
  assert.ok(objectTypes.has("action-unit"));
  assert.ok(objectTypes.has("trace-evidence"));
  assert.ok(objectTypes.has("decision-record"));
  assert.ok(objectTypes.has("learning-candidate"));
  assert.ok(objectTypes.has("memory-promotion-record"));
  assert.ok(!objectTypes.has("delta-intent"));
  assert.ok(!objectTypes.has("conflict-case"));

  assert.ok(result.store_snapshot);
  assert.ok(result.store_snapshot.working_object_ids.length >= 2);
  assert.ok(result.store_snapshot.episodic_object_ids.length >= 3);
  assert.equal(result.store_snapshot.semantic_object_ids.length, 0);
  assert.ok(result.store_snapshot.evidence_object_ids.length >= 2);
  assert.ok(result.created_object_ids_by_type?.intent?.length);
  assert.ok(result.created_object_ids_by_type?.["trace-evidence"]?.length);
  assert.ok(result.status_transitions?.length);
  assert.ok(
    result.status_transitions?.some(
      (transition) =>
        transition.object_type === "intent" &&
        transition.from_status === "formed" &&
        transition.to_status === "active"
    )
  );
  assert.ok(
    result.status_transitions?.some(
      (transition) =>
        transition.object_type === "activation-signal" &&
        transition.to_status === "completed"
    )
  );

  assert.ok(result.policy_snapshots?.length);
  assert.equal(result.policy_snapshots?.[0]?.confirm_required, false);
  assert.equal(result.confirm_summary?.confirm_required, false);
  assert.equal(result.confirm_summary?.confirm_gate_id, undefined);
  assert.ok(result.evidence_summary?.trace_evidence_ids.length);
  assert.ok(result.evidence_summary?.decision_record_ids.length);
  assert.ok(result.truth_consultation);
  assert.ok(result.export_preparation);
  assert.ok(result.truth_consultation.registry_object_types.includes("intent"));
  assert.ok(result.truth_consultation.binding_object_types.includes("intent"));
  assert.ok(result.truth_consultation.export_rule_object_types.includes("intent"));
  assert.ok(
    result.created_objects.every((record) =>
      result.truth_consultation.registry_object_types.includes(record.object_type)
    )
  );
  assert.ok(result.export_preparation.protocol_relevant_object_ids.length >= 1);
  assert.equal(result.export_preparation.shallow_reconstructable_object_ids.length, 1);
  assert.ok(result.export_preparation.non_exportable_object_ids.length >= 1);
  assert.ok(result.export_preparation.export_restricted_object_ids.length >= 1);

  assert.ok(
    result.created_objects.every(
      (record) => !String(record.object_type).toLowerCase().includes("tracepilot")
    )
  );
});

test("requirement-change-midflow executes a neutral change-aware path", async () => {
  const result = await execute_scenario_file(
    repoRoot,
    "./tests/fixtures/min-loop/requirement-change-midflow/scenario.json"
  );

  assert.equal(result.scenario_id, "requirement-change-midflow");
  assert.equal(result.status, "executed");
  assert.ok(result.created_objects.length > 0);
  assert.equal(result.ordered_step_outcomes?.length, 7);
  assert.ok(result.event_timeline?.length);
  assert.equal(result.event_timeline?.[0]?.sequence, 1);
  assert.ok(
    result.event_timeline?.every(
      (entry, index) => entry.sequence === index + 1
    )
  );
  assert.deepEqual(
    result.ordered_step_outcomes?.map((outcome) => outcome.step),
    ["form", "place", "activate", "confirm", "trace", "reconcile", "consolidate"]
  );

  const objectTypes = new Set(result.created_objects.map((record) => record.object_type));
  assert.ok(objectTypes.has("external-input-record"));
  assert.ok(objectTypes.has("delta-intent"));
  assert.ok(objectTypes.has("semantic-fact"));
  assert.ok(objectTypes.has("drift-record"));
  assert.ok(objectTypes.has("conflict-case"));
  assert.ok(objectTypes.has("confirm-gate"));
  assert.ok(objectTypes.has("trace-evidence"));
  assert.ok(objectTypes.has("decision-record"));
  assert.ok(objectTypes.has("learning-candidate"));
  assert.ok(objectTypes.has("memory-promotion-record"));
  assert.ok(!objectTypes.has("intent"));

  assert.ok(result.store_snapshot);
  assert.ok(result.store_snapshot.working_object_ids.length >= 2);
  assert.ok(result.store_snapshot.episodic_object_ids.length >= 5);
  assert.ok(result.store_snapshot.semantic_object_ids.length >= 1);
  assert.ok(result.store_snapshot.evidence_object_ids.length >= 2);
  assert.ok(result.created_object_ids_by_type?.["delta-intent"]?.length);
  assert.ok(result.created_object_ids_by_type?.["drift-record"]?.length);
  assert.ok(result.created_object_ids_by_type?.["conflict-case"]?.length);
  assert.ok(result.status_transitions?.length);
  assert.ok(
    result.status_transitions?.some(
      (transition) =>
        transition.object_type === "delta-intent" &&
        transition.from_status === "proposed" &&
        transition.to_status === "accepted"
    )
  );
  assert.ok(
    result.status_transitions?.some(
      (transition) =>
        transition.object_type === "confirm-gate" &&
        transition.from_status === "pending" &&
        transition.to_status === "approved"
    )
  );
  assert.ok(
    result.status_transitions?.some(
      (transition) =>
        transition.object_type === "conflict-case" &&
        transition.from_status === "open" &&
        transition.to_status === "classified"
    )
  );

  assert.ok(result.policy_snapshots?.length);
  assert.equal(result.policy_snapshots?.[0]?.confirm_required, true);
  assert.equal(result.confirm_summary?.confirm_required, true);
  assert.ok(result.confirm_summary?.confirm_gate_id);
  assert.equal(result.confirm_summary?.confirm_status, "approved");

  assert.ok(result.reconciliation);
  assert.equal(result.reconciliation?.can_continue, false);
  assert.ok(result.reconciliation?.drift_record_ids?.length);
  assert.ok(result.reconciliation?.conflict_case_ids?.length);
  assert.ok(result.evidence_summary?.trace_evidence_ids.length);
  assert.ok(result.evidence_summary?.decision_record_ids.length);
  assert.ok(result.truth_consultation);
  assert.ok(result.export_preparation);
  assert.ok(result.truth_consultation.registry_object_types.includes("delta-intent"));
  assert.ok(result.truth_consultation.registry_object_types.includes("conflict-case"));
  assert.ok(result.truth_consultation.binding_object_types.includes("delta-intent"));
  assert.ok(result.truth_consultation.binding_object_types.includes("confirm-gate"));
  assert.ok(result.truth_consultation.binding_object_types.includes("trace-evidence"));
  assert.ok(
    result.created_objects.every((record) =>
      result.truth_consultation.registry_object_types.includes(record.object_type)
    )
  );
  assert.ok(result.export_preparation.protocol_relevant_object_ids.length >= 2);
  assert.ok(result.export_preparation.shallow_reconstructable_object_ids.length >= 2);
  assert.ok(result.export_preparation.export_restricted_object_ids.length >= 1);

  assert.ok(
    result.created_objects.every(
      (record) => !String(record.object_type).toLowerCase().includes("pilot")
    )
  );
});

test("repeated execution of the same fixture remains deterministic", async () => {
  const first = await execute_scenario_file(
    repoRoot,
    "./tests/fixtures/min-loop/fresh-intent/scenario.json"
  );
  const second = await execute_scenario_file(
    repoRoot,
    "./tests/fixtures/min-loop/fresh-intent/scenario.json"
  );

  assert.deepEqual(first.created_object_ids_by_type, second.created_object_ids_by_type);
  assert.deepEqual(first.store_snapshot, second.store_snapshot);
  assert.deepEqual(first.confirm_summary, second.confirm_summary);
  assert.deepEqual(first.export_preparation, second.export_preparation);
  assert.deepEqual(
    first.event_timeline?.map((entry) => ({
      step: entry.step,
      event_kind: entry.event_kind,
      related_object_ids: entry.related_object_ids,
      status_transition: entry.status_transition,
    })),
    second.event_timeline?.map((entry) => ({
      step: entry.step,
      event_kind: entry.event_kind,
      related_object_ids: entry.related_object_ids,
      status_transition: entry.status_transition,
    }))
  );
});

test("repeated execution of requirement-change-midflow remains deterministic", async () => {
  const first = await execute_scenario_file(
    repoRoot,
    "./tests/fixtures/min-loop/requirement-change-midflow/scenario.json"
  );
  const second = await execute_scenario_file(
    repoRoot,
    "./tests/fixtures/min-loop/requirement-change-midflow/scenario.json"
  );

  assert.deepEqual(first.created_object_ids_by_type, second.created_object_ids_by_type);
  assert.deepEqual(first.store_snapshot, second.store_snapshot);
  assert.deepEqual(first.confirm_summary, second.confirm_summary);
  assert.deepEqual(first.reconciliation, second.reconciliation);
  assert.deepEqual(first.export_preparation, second.export_preparation);
  assert.deepEqual(
    first.event_timeline?.map((entry) => ({
      step: entry.step,
      event_kind: entry.event_kind,
      related_object_ids: entry.related_object_ids,
      status_transition: entry.status_transition,
    })),
    second.event_timeline?.map((entry) => ({
      step: entry.step,
      event_kind: entry.event_kind,
      related_object_ids: entry.related_object_ids,
      status_transition: entry.status_transition,
    }))
  );
});
