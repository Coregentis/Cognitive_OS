import test from "node:test";
import assert from "node:assert/strict";

import { FrozenBindingService } from "../../runtime/core/binding-service.ts";
import {
  build_projection_safe_runtime_envelope_from_records,
  summarize_projection_safe_runtime_envelope,
} from "../../runtime/core/projection-safe-runtime-envelope-builder.ts";
import {
  assert_no_forbidden_projection_keys,
} from "../../runtime/core/projection-safe-envelope.ts";

const PROJECT_ID = "00000000-0000-4000-8000-730000000001";

function createRuntimeRecords() {
  return [
    {
      object_id: "project_ref_01",
      object_type: "project",
      authority_class: "coregentis_private_runtime",
      primary_layer: "cognitive_runtime_core",
      status: "active",
      project_id: PROJECT_ID,
      temporal: {},
      mutation: {},
      lineage: {},
      governance: {},
    },
    {
      object_id: "trace_evidence_ref_01",
      object_type: "trace-evidence",
      authority_class: "runtime_bound",
      primary_layer: "cognitive_runtime_core",
      status: "active",
      project_id: PROJECT_ID,
      protocol_binding_ref: {
        binding_class: "runtime_bound",
        protocol_object_type: "mplp-trace",
        protocol_object_id: "trace_ref_01",
        reconstructable: true,
      },
      temporal: {},
      mutation: {},
      lineage: {},
      governance: {},
    },
  ];
}

test("[runtime] projection-safe runtime envelope builder composes records with binding, module, duty, evidence, omission, and version posture", () => {
  const envelope = build_projection_safe_runtime_envelope_from_records({
    projection_envelope_id: "runtime_projection_envelope_01",
    runtime_object_records: createRuntimeRecords(),
    binding_service: FrozenBindingService.from_repo_root("."),
    safe_evidence_refs: [
      {
        evidence_ref: "trace_evidence_ref_01",
        evidence_kind: "trace_summary",
        summary: "bounded evidence",
      },
    ],
    omission_markers: [
      {
        marker: "representative_record_payloads_omitted",
        reason: "Only safe references and posture summaries are exposed.",
      },
    ],
    created_at: "2026-04-27T00:00:00.000Z",
  });

  assert.deepEqual(envelope.source_runtime_object_refs, [
    "project_ref_01",
    "trace_evidence_ref_01",
  ]);
  assert.equal(envelope.object_export_binding_posture_refs.length, 2);
  assert.equal(envelope.module_posture_summary.length, 10);
  assert.equal(envelope.kernel_duty_posture_summary.length, 11);
  assert.equal(envelope.safe_evidence_refs.length, 1);
  assert.ok(envelope.omission_markers.some((marker) => marker.marker === "runtime_private_payload_omitted"));
  assert.ok(envelope.protocol_version_refs.some((ref) => ref.ref_id === "MPLP"));
  assert.ok(envelope.binding_version_refs.some((ref) => ref.ref_id === "mplp-coregentis-binding-matrix-v0"));
  assert.doesNotThrow(() => assert_no_forbidden_projection_keys(envelope));
});

test("[runtime] projection-safe runtime envelope summary reports exportable and non-exportable posture", () => {
  const envelope = build_projection_safe_runtime_envelope_from_records({
    projection_envelope_id: "runtime_projection_envelope_02",
    runtime_object_records: createRuntimeRecords(),
    binding_service: FrozenBindingService.from_repo_root("."),
  });

  const summary = summarize_projection_safe_runtime_envelope(envelope);

  assert.equal(summary.source_runtime_object_count, 2);
  assert.equal(summary.exportable_object_count, 1);
  assert.equal(summary.non_exportable_object_count, 1);
  assert.equal(summary.module_count, 10);
  assert.equal(summary.kernel_duty_count, 11);
  assert.equal(summary.runtime_private_fields_omitted, true);
  assert.equal(summary.non_executing, true);
  assert.ok(summary.omission_markers.includes("direct_protocol_export_not_allowed"));
});
