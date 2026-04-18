import test from "node:test";
import assert from "node:assert/strict";

import { InMemoryVslStore } from "../../runtime/in-memory/vsl-store.ts";
import { MinimalLoopHarness } from "../../runtime/harness/minimal-loop-harness.ts";

const repoRoot = process.cwd();

function createContinuityState(overrides = {}) {
  return {
    project_id: "00000000-0000-4000-8000-510000000001",
    scenario_id: "fresh-intent",
    continuity_revision: 1,
    durability_mode: "runtime_instance_bounded_in_memory",
    continuity_status: "recoverable",
    updated_at: "2026-04-18T00:00:00.000Z",
    last_completed_step: "consolidate",
    continuation_anchor: {
      project_id: "00000000-0000-4000-8000-510000000001",
      scenario_id: "fresh-intent",
      anchor_object_id: "00000000-0000-4000-8000-510000000010",
      anchor_object_type: "episode",
      anchored_at: "2026-04-18T00:00:00.000Z",
      source_object_ids: [
        "00000000-0000-4000-8000-510000000011",
        "00000000-0000-4000-8000-510000000012",
      ],
      last_completed_step: "consolidate",
      disposition: "recoverable",
      notes: ["bounded anchor"],
    },
    replay_horizon: {
      mode: "episodic_checkpoint_window",
      anchor_object_id: "00000000-0000-4000-8000-510000000010",
      replayable_object_ids: [
        "00000000-0000-4000-8000-510000000010",
      ],
      notes: ["bounded replay metadata"],
    },
    rollback_horizon: {
      mode: "checkpoint_boundary_only",
      anchor_object_id: "00000000-0000-4000-8000-510000000010",
      boundary_step: "consolidate",
      rollback_candidate_object_ids: [
        "00000000-0000-4000-8000-510000000013",
      ],
      notes: ["bounded rollback metadata"],
    },
    retention_horizon: {
      mode: "bounded_memory_partition",
      retained_object_ids: [
        "00000000-0000-4000-8000-510000000010",
      ],
      expirable_object_ids: [
        "00000000-0000-4000-8000-510000000014",
      ],
      notes: ["bounded retention metadata"],
    },
    store_snapshot: {
      working_object_ids: ["00000000-0000-4000-8000-510000000014"],
      episodic_object_ids: ["00000000-0000-4000-8000-510000000010"],
      semantic_object_ids: ["00000000-0000-4000-8000-510000000015"],
      evidence_object_ids: ["00000000-0000-4000-8000-510000000016"],
    },
    notes: ["runtime-private continuity snapshot"],
    ...overrides,
  };
}

test("[runtime] VSL first-pass store writes and reads continuity state", () => {
  const store = new InMemoryVslStore();
  const state = createContinuityState();

  store.write(state);
  const loaded = store.load(state.project_id);

  assert.ok(loaded);
  assert.deepEqual(loaded, state);
  assert.notEqual(loaded, state);
  loaded.notes.push("mutated outside store");
  assert.equal(
    store.load(state.project_id)?.notes.includes("mutated outside store"),
    false
  );
});

test("[runtime] VSL first pass isolates projects and recovers continuation anchors", () => {
  const harness = MinimalLoopHarness.create_default(repoRoot, "fresh-intent");
  const alphaProjectId = "00000000-0000-4000-8000-520000000001";
  const betaProjectId = "00000000-0000-4000-8000-520000000002";

  const alphaResult = harness.execute_scenario({
    scenario_id: "fresh-intent",
    project_id: alphaProjectId,
    raw_input: {
      input_kind: "text",
      summary: "alpha continuity checkpoint",
    },
  });
  const betaResult = harness.execute_scenario({
    scenario_id: "fresh-intent",
    project_id: betaProjectId,
    raw_input: {
      input_kind: "text",
      summary: "beta continuity checkpoint",
    },
  });

  const alphaState = harness.load_project_continuity(alphaProjectId);
  const betaState = harness.load_project_continuity(betaProjectId);
  const alphaAnchor = harness.recover_continuation_anchor(alphaProjectId);
  const betaAnchor = harness.recover_continuation_anchor(betaProjectId);

  assert.ok(alphaResult.continuity_state);
  assert.ok(betaResult.continuity_state);
  assert.deepEqual(alphaState, alphaResult.continuity_state);
  assert.deepEqual(betaState, betaResult.continuity_state);
  assert.ok(alphaAnchor);
  assert.ok(betaAnchor);
  assert.equal(alphaAnchor.anchor_object_type, "episode");
  assert.equal(betaAnchor.anchor_object_type, "episode");
  assert.equal(
    alphaAnchor.anchor_object_id,
    alphaState?.continuation_anchor.anchor_object_id
  );
  assert.equal(
    betaAnchor.anchor_object_id,
    betaState?.continuation_anchor.anchor_object_id
  );
  assert.equal(alphaState?.project_id, alphaProjectId);
  assert.equal(betaState?.project_id, betaProjectId);
  assert.notEqual(
    alphaState?.continuation_anchor.anchor_object_id,
    betaState?.continuation_anchor.anchor_object_id
  );
  assert.deepEqual(
    alphaState?.replay_horizon.replayable_object_ids,
    alphaResult.store_snapshot?.episodic_object_ids
  );
  assert.deepEqual(
    betaState?.replay_horizon.replayable_object_ids,
    betaResult.store_snapshot?.episodic_object_ids
  );
  assert.equal(alphaState?.rollback_horizon.boundary_step, "consolidate");
  assert.equal(betaState?.rollback_horizon.boundary_step, "consolidate");
  assert.deepEqual(
    [...(alphaState?.retention_horizon.expirable_object_ids ?? [])].sort(),
    [...(alphaResult.store_snapshot?.working_object_ids ?? [])].sort()
  );
  assert.deepEqual(
    [...(betaState?.retention_horizon.expirable_object_ids ?? [])].sort(),
    [...(betaResult.store_snapshot?.working_object_ids ?? [])].sort()
  );
  assert.deepEqual(
    [...(alphaState?.retention_horizon.retained_object_ids ?? [])].sort(),
    [
      ...(alphaResult.store_snapshot?.episodic_object_ids ?? []),
      ...(alphaResult.store_snapshot?.semantic_object_ids ?? []),
      ...(alphaResult.store_snapshot?.evidence_object_ids ?? []),
    ].sort()
  );
  assert.deepEqual(
    [...(betaState?.retention_horizon.retained_object_ids ?? [])].sort(),
    [
      ...(betaResult.store_snapshot?.episodic_object_ids ?? []),
      ...(betaResult.store_snapshot?.semantic_object_ids ?? []),
      ...(betaResult.store_snapshot?.evidence_object_ids ?? []),
    ].sort()
  );
  assert.doesNotMatch(
    JSON.stringify(alphaState),
    /SoloCrew|Secretary|portfolio|founder|handoff|review_queue/i
  );
});
