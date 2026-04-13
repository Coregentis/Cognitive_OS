import test from "node:test";
import assert from "node:assert/strict";

import { MinimalRuntimeOrchestratorSkeleton } from "../../runtime/core/runtime-orchestrator.ts";
import { InMemoryCorrectionCapture } from "../../runtime/learning/correction-capture.ts";
import { PreferenceWritebackService } from "../../runtime/learning/preference-writeback.ts";
import { InMemoryStateStore } from "../../runtime/state/in-memory-state-store.ts";
import { PreferenceStore } from "../../runtime/state/preference-store.ts";

function createPreferenceRecord(overrides = {}) {
  return {
    schema_version: "0.1.0",
    object_id: "00000000-0000-4000-8000-430000000010",
    object_type: "preference-profile",
    authority_class: "coregentis_private_runtime",
    primary_layer: "organization_runtime_layer",
    status: "active",
    project_id: "00000000-0000-4000-8000-430000000000",
    scope_kind: "project",
    scope_ref_id: "00000000-0000-4000-8000-430000000000",
    preference_summary: "Prefer concise language",
    preference_signals: ["concise"],
    correction_refs: [],
    last_revised_at: "2026-04-13T10:00:00.000Z",
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

function createCorrectionCapture(capture) {
  return capture.capture({
    project_id: "00000000-0000-4000-8000-430000000000",
    correction_source: "user",
    correction_target: "preference",
    preference_profile_id: "00000000-0000-4000-8000-430000000010",
    correction_summary: "Prefer a more forceful tone",
    corrected_value: "Use a sharper tone",
  });
}

test("[p0b] preference write-back updates an existing bounded preference profile", () => {
  const stateStore = new InMemoryStateStore();
  const preferenceStore = new PreferenceStore(stateStore);
  const correctionCapture = new InMemoryCorrectionCapture();

  preferenceStore.save(createPreferenceRecord());

  const correction = createCorrectionCapture(correctionCapture);
  const writeback = new PreferenceWritebackService({
    preference_store: preferenceStore,
    correction_capture: correctionCapture,
    clock: {
      now() {
        return "2026-04-13T11:30:00.000Z";
      },
    },
  });

  const result = writeback.writeback({ correction });
  assert.equal(result.disposition, "applied");
  assert.equal(result.preference_profile?.preference_summary, "Prefer a more forceful tone");
  assert.deepEqual(result.preference_profile?.correction_refs, [
    correction.correction_id,
  ]);
  assert.equal(result.preference_profile?.mutation.current_revision, 2);
  assert.equal(
    correctionCapture.get(correction.correction_id)?.status,
    "written_back"
  );
});

test("[p0b] preference write-back skips when no bounded profile is available", () => {
  const writeback = new PreferenceWritebackService({
    preference_store: new PreferenceStore(new InMemoryStateStore()),
  });
  const correctionCapture = new InMemoryCorrectionCapture();
  const correction = correctionCapture.capture({
    project_id: "00000000-0000-4000-8000-430000000001",
    correction_source: "user",
    correction_target: "preference",
    target_ref_id: "explicit-target",
    correction_summary: "Prefer shorter answers",
    corrected_value: "Shorter answers",
  });

  const result = writeback.writeback({ correction });
  assert.equal(result.disposition, "skipped");
});

test("[p0b] preference write-back fails when an explicit profile is missing", () => {
  const writeback = new PreferenceWritebackService({
    preference_store: new PreferenceStore(new InMemoryStateStore()),
  });
  const correctionCapture = new InMemoryCorrectionCapture();
  const correction = correctionCapture.capture({
    project_id: "00000000-0000-4000-8000-430000000002",
    correction_source: "user",
    correction_target: "preference",
    preference_profile_id: "00000000-0000-4000-8000-430000000099",
    correction_summary: "Missing profile test",
    corrected_value: "Missing profile value",
  });

  const result = writeback.writeback({ correction });
  assert.equal(result.disposition, "failed");
});

test("[p0b] orchestrator exposes preference write-back glue without adding a full learning loop", () => {
  const stateStore = new InMemoryStateStore();
  const preferenceStore = new PreferenceStore(stateStore);
  const correctionCapture = new InMemoryCorrectionCapture();

  preferenceStore.save(createPreferenceRecord());

  const writeback = new PreferenceWritebackService({
    preference_store: preferenceStore,
    correction_capture: correctionCapture,
  });

  const orchestrator = new MinimalRuntimeOrchestratorSkeleton({
    preference_writeback: writeback,
  });

  const correction = createCorrectionCapture(correctionCapture);
  const result = orchestrator.writeback_preference({ correction });
  assert.equal(result.disposition, "applied");
});
