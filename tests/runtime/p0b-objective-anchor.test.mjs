import test from "node:test";
import assert from "node:assert/strict";

import { MinimalRuntimeOrchestratorSkeleton } from "../../runtime/core/runtime-orchestrator.ts";
import { InMemoryObjectiveAnchor } from "../../runtime/learning/objective-anchor.ts";
import { InMemoryStateStore } from "../../runtime/state/in-memory-state-store.ts";
import { ObjectiveStore } from "../../runtime/state/objective-store.ts";

function createObjectiveRecord(overrides = {}) {
  return {
    schema_version: "0.1.0",
    object_id: "00000000-0000-4000-8000-410000000010",
    object_type: "objective",
    authority_class: "coregentis_private_runtime",
    primary_layer: "organization_runtime_layer",
    status: "active",
    project_id: "00000000-0000-4000-8000-410000000000",
    objective_summary: "Ship bounded P0-B glue",
    progress_summary: "baseline",
    work_item_ids: ["00000000-0000-4000-8000-410000000020"],
    temporal: {
      temporal_class: "durable",
      cognition_time: "2026-04-13T10:00:00.000Z",
      event_time: "2026-04-13T10:00:00.000Z",
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

test("[p0b] objective anchor captures and compares bounded objective baselines", () => {
  const stateStore = new InMemoryStateStore();
  const objectiveStore = new ObjectiveStore(stateStore);
  const objectiveId = "00000000-0000-4000-8000-410000000010";

  objectiveStore.save(createObjectiveRecord());

  const anchor = new InMemoryObjectiveAnchor({
    objective_store: objectiveStore,
    clock: {
      now() {
        return "2026-04-13T10:05:00.000Z";
      },
    },
  });

  const snapshot = anchor.capture_anchor(objectiveId);
  assert.equal(snapshot.objective_summary, "Ship bounded P0-B glue");

  objectiveStore.save(
    createObjectiveRecord({
      progress_summary: "changed",
      work_item_ids: [
        "00000000-0000-4000-8000-410000000020",
        "00000000-0000-4000-8000-410000000021",
      ],
      mutation: {
        mutation_class: "stateful_mutable",
        current_revision: 2,
      },
    })
  );

  const comparison = anchor.compare_to_anchor(objectiveId);
  assert.equal(comparison.anchor_present, true);
  assert.equal(comparison.changed, true);
  assert.deepEqual(comparison.changed_fields, [
    "progress_summary",
    "work_item_ids",
  ]);
});

test("[p0b] objective anchor returns a bounded no-anchor state before capture", () => {
  const stateStore = new InMemoryStateStore();
  const objectiveStore = new ObjectiveStore(stateStore);

  objectiveStore.save(createObjectiveRecord());

  const anchor = new InMemoryObjectiveAnchor({
    objective_store: objectiveStore,
  });

  const comparison = anchor.compare_to_anchor(
    "00000000-0000-4000-8000-410000000010"
  );
  assert.equal(comparison.anchor_present, false);
  assert.equal(comparison.changed, false);
});

test("[p0b] objective anchor rejects unknown objectives", () => {
  const anchor = new InMemoryObjectiveAnchor({
    objective_store: new ObjectiveStore(new InMemoryStateStore()),
  });

  assert.throws(() =>
    anchor.capture_anchor("00000000-0000-4000-8000-410000000999")
  );
});

test("[p0b] orchestrator exposes objective anchor glue without changing loop steps", () => {
  const stateStore = new InMemoryStateStore();
  const objectiveStore = new ObjectiveStore(stateStore);
  objectiveStore.save(createObjectiveRecord());

  const anchor = new InMemoryObjectiveAnchor({
    objective_store: objectiveStore,
  });

  const orchestrator = new MinimalRuntimeOrchestratorSkeleton({
    objective_anchor: anchor,
  });

  const snapshot = orchestrator.anchor_objective(
    "00000000-0000-4000-8000-410000000010"
  );
  assert.equal(snapshot.objective_id, "00000000-0000-4000-8000-410000000010");
});
