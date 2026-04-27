import test from "node:test";
import assert from "node:assert/strict";

import {
  create_error_insufficiency_posture,
} from "../../runtime/core/error-insufficiency-posture.ts";

test("[runtime] error insufficiency posture carries KD-02 and user-safe summary", () => {
  const posture = create_error_insufficiency_posture({
    posture_id: "error_insufficiency_posture_01",
    status: "insufficient_evidence",
    safe_evidence_refs: [{ evidence_ref: "evidence_ref_01" }],
    user_safe_summary: "Additional bounded evidence is needed before continuing.",
  });

  assert.deepEqual(posture.kernel_duty_posture_links, ["KD-02"]);
  assert.equal(posture.recoverable, true);
  assert.equal(posture.user_safe_summary, "Additional bounded evidence is needed before continuing.");
  assert.equal(posture.runtime_private_fields_omitted, true);
  assert.equal(posture.non_executing, true);
  assert.ok(posture.omission_markers.some((marker) => marker.marker === "raw_error_payload_omitted"));
});
