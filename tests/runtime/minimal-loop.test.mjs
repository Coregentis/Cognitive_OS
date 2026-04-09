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

  assert.ok(result.policy_snapshots?.length);
  assert.equal(result.policy_snapshots?.[0]?.confirm_required, false);

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

  assert.ok(result.policy_snapshots?.length);
  assert.equal(result.policy_snapshots?.[0]?.confirm_required, true);

  assert.ok(result.reconciliation);
  assert.equal(result.reconciliation?.can_continue, false);

  assert.ok(
    result.created_objects.every(
      (record) => !String(record.object_type).toLowerCase().includes("pilot")
    )
  );
});
