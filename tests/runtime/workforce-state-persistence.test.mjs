import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { InMemoryStateStore } from "../../runtime/state/in-memory-state-store.ts";
import { SQLiteStateStore } from "../../runtime/state/sqlite-state-store.ts";
import { WorkerStore } from "../../runtime/state/worker-store.ts";
import { ObjectiveStore } from "../../runtime/state/objective-store.ts";
import { MemoryStore } from "../../runtime/state/memory-store.ts";
import { PreferenceStore } from "../../runtime/state/preference-store.ts";

const projectId = "00000000-0000-4000-8000-200000000001";

function createBaseRecord(overrides = {}) {
  return {
    schema_version: "0.1.0",
    authority_class: "coregentis_private_runtime",
    primary_layer: "organization_runtime_layer",
    project_id: projectId,
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

function createWorkerRecord() {
  return createBaseRecord({
    object_id: "00000000-0000-4000-8000-200000000010",
    object_type: "agent-worker",
    status: "idle",
    role_profile_id: "00000000-0000-4000-8000-200000000020",
    worker_name: "Research",
  });
}

function createObjectiveRecord() {
  return createBaseRecord({
    object_id: "00000000-0000-4000-8000-200000000030",
    object_type: "objective",
    status: "active",
    objective_summary: "Stabilize workforce baseline",
  });
}

function createMemoryRecord() {
  return createBaseRecord({
    object_id: "00000000-0000-4000-8000-200000000040",
    object_type: "memory-profile",
    status: "active",
    scope_kind: "agent_worker",
    scope_ref_id: "00000000-0000-4000-8000-200000000010",
    memory_summary: "Prefers concise audit output",
    update_basis: "manual",
    last_revised_at: "2026-04-13T00:00:00.000Z",
  });
}

function createPreferenceRecord() {
  return createBaseRecord({
    object_id: "00000000-0000-4000-8000-200000000050",
    object_type: "preference-profile",
    status: "active",
    scope_kind: "project",
    scope_ref_id: projectId,
    preference_summary: "Default to neutral naming",
    last_revised_at: "2026-04-13T00:00:00.000Z",
  });
}

test("[workforce] in-memory state adapters persist typed records", () => {
  const stateStore = new InMemoryStateStore();
  const workerStore = new WorkerStore(stateStore);
  const objectiveStore = new ObjectiveStore(stateStore);
  const memoryStore = new MemoryStore(stateStore);
  const preferenceStore = new PreferenceStore(stateStore);

  workerStore.save(createWorkerRecord());
  objectiveStore.save(createObjectiveRecord());
  memoryStore.save(createMemoryRecord());
  preferenceStore.save(createPreferenceRecord());

  assert.equal(workerStore.list(projectId).length, 1);
  assert.equal(objectiveStore.list(projectId).length, 1);
  assert.equal(memoryStore.list(projectId).length, 1);
  assert.equal(preferenceStore.list(projectId).length, 1);
  assert.equal(
    workerStore.load("00000000-0000-4000-8000-200000000010")?.worker_name,
    "Research"
  );
});

test("[workforce] SQLite state adapter restores records across reopen", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cgos-workforce-state-"));
  const databasePath = join(tempRoot, "workforce.sqlite");

  try {
    const initialStore = new SQLiteStateStore(databasePath);
    const initialWorkerStore = new WorkerStore(initialStore);
    const initialObjectiveStore = new ObjectiveStore(initialStore);
    const initialMemoryStore = new MemoryStore(initialStore);
    const initialPreferenceStore = new PreferenceStore(initialStore);

    initialWorkerStore.save(createWorkerRecord());
    initialObjectiveStore.save(createObjectiveRecord());
    initialMemoryStore.save(createMemoryRecord());
    initialPreferenceStore.save(createPreferenceRecord());
    initialStore.close();

    const reopenedStore = new SQLiteStateStore(databasePath);
    const reopenedWorkerStore = new WorkerStore(reopenedStore);
    const reopenedObjectiveStore = new ObjectiveStore(reopenedStore);
    const reopenedMemoryStore = new MemoryStore(reopenedStore);
    const reopenedPreferenceStore = new PreferenceStore(reopenedStore);

    assert.equal(
      reopenedWorkerStore.load("00000000-0000-4000-8000-200000000010")?.status,
      "idle"
    );
    assert.equal(
      reopenedObjectiveStore.load("00000000-0000-4000-8000-200000000030")
        ?.objective_summary,
      "Stabilize workforce baseline"
    );
    assert.equal(
      reopenedMemoryStore.load("00000000-0000-4000-8000-200000000040")
        ?.memory_summary,
      "Prefers concise audit output"
    );
    assert.equal(
      reopenedPreferenceStore.load("00000000-0000-4000-8000-200000000050")
        ?.preference_summary,
      "Default to neutral naming"
    );
    assert.equal(reopenedStore.exists("00000000-0000-4000-8000-200000000050"), true);
    assert.equal(reopenedStore.delete("00000000-0000-4000-8000-200000000050"), true);
    assert.equal(reopenedStore.exists("00000000-0000-4000-8000-200000000050"), false);
    reopenedStore.close();
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});
