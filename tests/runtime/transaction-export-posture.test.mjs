import test from "node:test";
import assert from "node:assert/strict";

import {
  create_transaction_export_posture,
} from "../../runtime/core/transaction-export-posture.ts";

test("[runtime] transaction export posture carries KD-11 and avoids distributed transaction claims", () => {
  const posture = create_transaction_export_posture({
    posture_id: "transaction_export_posture_01",
    transaction_status: "exported_snapshot",
    export_consistency_posture: "consistent",
    deterministic_snapshot_boundary_summary:
      "Snapshot boundary is deterministic for export posture.",
    safe_evidence_refs: [{ evidence_ref: "evidence_ref_01" }],
    user_safe_summary: "Export snapshot is consistent.",
  });

  assert.deepEqual(posture.kernel_duty_posture_links, [
    "KD-11",
    "KD-09",
    "KD-05",
    "KD-08",
  ]);
  assert.equal(posture.distributed_transaction_claimed, false);
  assert.equal(posture.runtime_private_fields_omitted, true);
  assert.equal(posture.non_executing, true);
  assert.ok(posture.omission_markers.some((marker) => marker.marker === "raw_transaction_store_payload_omitted"));
  assert.doesNotMatch(
    JSON.stringify(posture),
    /full distributed transaction|distributed transaction: true/i
  );
});
