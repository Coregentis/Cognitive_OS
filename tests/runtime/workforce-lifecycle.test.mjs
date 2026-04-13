import test from "node:test";
import assert from "node:assert/strict";

import {
  assert_worker_state_transition,
  can_transition_worker_state,
  list_allowed_worker_state_transitions,
} from "../../runtime/lifecycle/worker-state-machine.ts";
import { WorkerLifecycleRuntime } from "../../runtime/lifecycle/worker-lifecycle.ts";
import { InMemoryStateStore } from "../../runtime/state/in-memory-state-store.ts";
import { WorkerStore } from "../../runtime/state/worker-store.ts";

function createWorkerRecord(overrides = {}) {
  return {
    schema_version: "0.1.0",
    object_id: "00000000-0000-4000-8000-100000000001",
    object_type: "agent-worker",
    authority_class: "coregentis_private_runtime",
    primary_layer: "organization_runtime_layer",
    status: "idle",
    project_id: "00000000-0000-4000-8000-100000000010",
    role_profile_id: "00000000-0000-4000-8000-100000000020",
    worker_name: "Builder",
    temporal: {
      temporal_class: "durable",
      cognition_time: "2026-04-13T00:00:00.000Z",
      event_time: "2026-04-13T00:00:00.000Z",
    },
    mutation: {
      mutation_class: "stateful_mutable",
      current_revision: 1,
    },
    lineage: {
      creation_source: "user_entry",
      derivation_mode: "origin",
    },
    governance: {
      governance_scope: "project",
      approval_state: "not_required",
    },
    ...overrides,
  };
}

test("[workforce] worker lifecycle state machine exposes legal transitions", () => {
  assert.deepEqual(list_allowed_worker_state_transitions("active"), [
    "idle",
    "blocked",
    "paused",
    "retired",
  ]);
  assert.equal(can_transition_worker_state("idle", "active"), true);
  assert.equal(can_transition_worker_state("paused", "idle"), false);
  assert.doesNotThrow(() => assert_worker_state_transition("blocked", "active"));
  assert.throws(() => assert_worker_state_transition("blocked", "paused"));
});

test("[workforce] lifecycle runtime persists transitions and revision bumps", () => {
  const timestamps = [
    "2026-04-13T00:01:00.000Z",
    "2026-04-13T00:02:00.000Z",
    "2026-04-13T00:03:00.000Z",
    "2026-04-13T00:04:00.000Z",
  ];
  const stateStore = new InMemoryStateStore();
  const workerStore = new WorkerStore(stateStore);

  workerStore.save(createWorkerRecord());

  const lifecycle = new WorkerLifecycleRuntime({
    worker_store: workerStore,
    clock: {
      now() {
        return timestamps.shift() ?? "2026-04-13T00:05:00.000Z";
      },
    },
  });

  const activated = lifecycle.activate_worker(
    "00000000-0000-4000-8000-100000000001"
  );
  const paused = lifecycle.pause_worker(
    "00000000-0000-4000-8000-100000000001"
  );
  const resumed = lifecycle.resume_worker(
    "00000000-0000-4000-8000-100000000001"
  );
  const released = lifecycle.release_worker(
    "00000000-0000-4000-8000-100000000001"
  );

  assert.equal(activated.status, "active");
  assert.equal(activated.mutation.current_revision, 2);
  assert.equal(paused.status, "paused");
  assert.equal(paused.mutation.current_revision, 3);
  assert.equal(resumed.status, "active");
  assert.equal(resumed.mutation.current_revision, 4);
  assert.equal(released.status, "idle");
  assert.equal(released.mutation.current_revision, 5);
  assert.equal(released.temporal.event_time, "2026-04-13T00:04:00.000Z");

  const persisted = workerStore.load(
    "00000000-0000-4000-8000-100000000001"
  );
  assert.equal(persisted?.status, "idle");
  assert.equal(persisted?.mutation.last_mutated_at, "2026-04-13T00:04:00.000Z");
});

test("[workforce] lifecycle runtime rejects illegal transitions without mutating state", () => {
  const stateStore = new InMemoryStateStore();
  const workerStore = new WorkerStore(stateStore);
  const objectId = "00000000-0000-4000-8000-100000000099";

  workerStore.save(
    createWorkerRecord({
      object_id: objectId,
    })
  );

  const lifecycle = new WorkerLifecycleRuntime({
    worker_store: workerStore,
  });

  assert.throws(() => lifecycle.pause_worker(objectId));

  const persisted = workerStore.load(objectId);
  assert.equal(persisted?.status, "idle");
  assert.equal(persisted?.mutation.current_revision, 1);
});
