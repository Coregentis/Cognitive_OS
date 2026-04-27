import test from "node:test";
import assert from "node:assert/strict";

import {
  create_state_snapshot_posture,
} from "../../runtime/core/state-snapshot-posture.ts";

test("[runtime] state snapshot posture carries KD-10 and Context/Core/Trace module links", () => {
  const posture = create_state_snapshot_posture({
    posture_id: "state_snapshot_posture_01",
    continuity_ref: "continuity_ref_01",
    snapshot_ref: "snapshot_ref_01",
    restore_posture: "stale",
    source_refs: ["source_02", "source_01"],
    safe_evidence_refs: [{ evidence_ref: "evidence_ref_01" }],
    user_safe_summary: "State snapshot is stale and needs refresh.",
  });

  assert.equal(posture.stale_or_insufficient_state, true);
  assert.deepEqual(posture.kernel_duty_posture_links, ["KD-10"]);
  assert.deepEqual(posture.module_posture_links, ["Context", "Core", "Trace"]);
  assert.deepEqual(posture.source_refs, ["source_01", "source_02"]);
  assert.equal(posture.runtime_private_fields_omitted, true);
  assert.equal(posture.non_executing, true);
  assert.ok(posture.omission_markers.some((marker) => marker.marker === "raw_state_store_payload_omitted"));
});
