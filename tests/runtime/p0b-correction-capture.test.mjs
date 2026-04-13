import test from "node:test";
import assert from "node:assert/strict";

import { MinimalRuntimeOrchestratorSkeleton } from "../../runtime/core/runtime-orchestrator.ts";
import { InMemoryCorrectionCapture } from "../../runtime/learning/correction-capture.ts";

function createInput(overrides = {}) {
  return {
    project_id: "00000000-0000-4000-8000-420000000000",
    correction_source: "user",
    correction_target: "objective",
    objective_id: "00000000-0000-4000-8000-420000000010",
    correction_summary: "Use a sharper success metric",
    corrected_value: "Ship a narrower metric",
    ...overrides,
  };
}

test("[p0b] correction capture records bounded correction events", () => {
  const capture = new InMemoryCorrectionCapture({
    now() {
      return "2026-04-13T11:00:00.000Z";
    },
  });

  const record = capture.capture(createInput());

  assert.equal(record.status, "captured");
  assert.equal(record.captured_at, "2026-04-13T11:00:00.000Z");
  assert.equal(capture.list({ project_id: record.project_id }).length, 1);

  const updated = capture.mark_written_back(record.correction_id);
  assert.equal(updated.status, "written_back");
});

test("[p0b] correction capture rejects invalid bounded inputs", () => {
  const capture = new InMemoryCorrectionCapture();

  assert.throws(() =>
    capture.capture(
      createInput({
        correction_summary: "",
      })
    )
  );

  assert.throws(() =>
    capture.capture(
      createInput({
        objective_id: undefined,
        worker_id: undefined,
        preference_profile_id: undefined,
        target_ref_id: undefined,
      })
    )
  );
});

test("[p0b] correction capture rejects unknown write-back marks", () => {
  const capture = new InMemoryCorrectionCapture();

  assert.throws(() =>
    capture.mark_written_back("00000000-0000-4000-8000-420000000999")
  );
});

test("[p0b] orchestrator exposes correction capture glue as a bounded facade", () => {
  const capture = new InMemoryCorrectionCapture();
  const orchestrator = new MinimalRuntimeOrchestratorSkeleton({
    correction_capture: capture,
  });

  const record = orchestrator.capture_correction(createInput());
  assert.equal(record.correction_target, "objective");
});
