import test from "node:test";
import assert from "node:assert/strict";

import { FrozenBindingService } from "../../runtime/core/binding-service.ts";
import { create_error_insufficiency_posture } from "../../runtime/core/error-insufficiency-posture.ts";
import { assert_no_forbidden_projection_keys } from "../../runtime/core/projection-safe-envelope.ts";
import {
  build_projection_safe_runtime_envelope_from_records,
} from "../../runtime/core/projection-safe-runtime-envelope-builder.ts";
import { create_state_snapshot_posture } from "../../runtime/core/state-snapshot-posture.ts";
import { create_transaction_export_posture } from "../../runtime/core/transaction-export-posture.ts";
import {
  create_projection_safe_downstream_handoff_fixture,
  create_representative_handoff_runtime_records,
} from "../../runtime/fixtures/projection-safe-downstream-handoff-fixture.ts";

const safeEvidenceRefs = [
  {
    evidence_ref: "strict_state_trace_ref_01",
    evidence_kind: "trace_summary",
    summary: "Bounded evidence reference for strict state/transaction/error E2E.",
  },
];

function assertNoRawPayload(value) {
  const serialized = JSON.stringify(value);
  assert.doesNotMatch(
    serialized,
    /"raw_state_payload"\s*:|"raw_transaction_payload"\s*:|"raw_error_payload"\s*:|"raw_runtime_private_payload"\s*:/i
  );
  assert.doesNotThrow(() => assert_no_forbidden_projection_keys(value));
}

test("[strict-e2e] state, transaction, and error postures compose with projection-safe envelope and handoff", () => {
  const envelope = build_projection_safe_runtime_envelope_from_records({
    projection_envelope_id: "strict_state_transaction_error_envelope_01",
    runtime_object_records: create_representative_handoff_runtime_records(),
    binding_service: FrozenBindingService.from_repo_root("."),
    safe_evidence_refs: safeEvidenceRefs,
    omission_markers: [
      {
        marker: "strict_state_transaction_error_payloads_omitted",
        reason: "State, transaction, and error postures expose safe refs and summaries only.",
      },
    ],
    created_at: "2026-04-27T00:00:00.000Z",
  });

  const stateSnapshotPosture = create_state_snapshot_posture({
    posture_id: "strict_state_snapshot_posture_01",
    continuity_ref: "strict_continuity_ref_01",
    snapshot_ref: "strict_snapshot_ref_01",
    restore_posture: "restorable",
    source_refs: envelope.source_runtime_object_refs,
    safe_evidence_refs: safeEvidenceRefs,
    user_safe_summary: "Strict E2E state posture is represented as bounded references.",
  });

  const transactionExportPosture = create_transaction_export_posture({
    posture_id: "strict_transaction_export_posture_01",
    transaction_status: "exported_snapshot",
    export_consistency_posture: "consistent",
    deterministic_snapshot_boundary_summary:
      "Strict E2E export posture is tied to a deterministic snapshot boundary.",
    safe_evidence_refs: safeEvidenceRefs,
    user_safe_summary: "Strict E2E export consistency is summarized without transaction payloads.",
  });

  const errorInsufficiencyPosture = create_error_insufficiency_posture({
    posture_id: "strict_error_insufficiency_posture_01",
    status: "recoverable",
    safe_evidence_refs: safeEvidenceRefs,
    user_safe_summary: "Strict E2E error posture is recoverable and user-safe.",
  });

  const handoffFixture = create_projection_safe_downstream_handoff_fixture(".");
  const composite = {
    projection_safe_runtime_envelope: envelope,
    state_snapshot_posture: stateSnapshotPosture,
    transaction_export_posture: transactionExportPosture,
    error_insufficiency_posture: errorInsufficiencyPosture,
    downstream_handoff_fixture: handoffFixture,
  };

  assert.deepEqual(stateSnapshotPosture.kernel_duty_posture_links, ["KD-10"]);
  assert.ok(transactionExportPosture.kernel_duty_posture_links.includes("KD-11"));
  assert.ok(transactionExportPosture.kernel_duty_posture_links.includes("KD-05"));
  assert.ok(transactionExportPosture.kernel_duty_posture_links.includes("KD-08"));
  assert.ok(transactionExportPosture.kernel_duty_posture_links.includes("KD-09"));
  assert.deepEqual(errorInsufficiencyPosture.kernel_duty_posture_links, ["KD-02"]);
  assert.equal(transactionExportPosture.distributed_transaction_claimed, false);
  assert.equal(stateSnapshotPosture.runtime_private_fields_omitted, true);
  assert.equal(transactionExportPosture.runtime_private_fields_omitted, true);
  assert.equal(errorInsufficiencyPosture.runtime_private_fields_omitted, true);
  assert.equal(envelope.runtime_private_fields_omitted, true);
  assert.ok(stateSnapshotPosture.omission_markers.some((marker) => marker.marker === "raw_state_store_payload_omitted"));
  assert.ok(transactionExportPosture.omission_markers.some((marker) => marker.marker === "raw_transaction_store_payload_omitted"));
  assert.ok(errorInsufficiencyPosture.omission_markers.some((marker) => marker.marker === "raw_error_payload_omitted"));
  assertNoRawPayload(composite);
});
