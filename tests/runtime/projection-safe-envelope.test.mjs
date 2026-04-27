import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES,
} from "../../runtime/core/default-kernel-duty-posture.ts";
import {
  DEFAULT_MPLP_MODULE_POSTURES,
} from "../../runtime/core/default-mplp-module-posture.ts";
import {
  build_projection_binding_posture_ref,
} from "../../runtime/core/projection-binding-consumption.ts";
import {
  assert_no_forbidden_projection_keys,
  create_projection_safe_envelope,
} from "../../runtime/core/projection-safe-envelope.ts";
import {
  summarize_kernel_duty_runtime_posture,
} from "../../runtime/core/kernel-duty-runtime-posture.ts";
import {
  summarize_mplp_module_posture,
} from "../../runtime/core/mplp-module-posture.ts";

const objectRecord = {
  object_id: "trace_evidence_01",
  object_type: "trace-evidence",
  authority_class: "runtime_bound",
  primary_layer: "cognitive_runtime_core",
  status: "active",
  project_id: "00000000-0000-4000-8000-710000000001",
  protocol_binding_ref: {
    binding_class: "runtime_bound",
    protocol_object_type: "mplp-trace",
    protocol_object_id: "trace_01",
    reconstructable: true,
  },
  temporal: {},
  mutation: {},
  lineage: {},
  governance: {},
};

const binding = {
  coregentis_object: "trace-evidence",
  mplp_object: "mplp-trace",
  binding_class: "shallow_reconstructable_runtime_bound",
  import_rule: "bounded import rule",
  export_rule: "bounded export rule",
  reconstruction_rule: "bounded reconstruction rule",
  compatibility_notes: "bounded compatibility notes",
  runtime_substrate_hint: "multi_substrate",
  runtime_substrate_note: "informational only",
};

const exportRule = {
  export_class: "protocol_compliant_export",
  eligible_object_types: ["trace-evidence"],
  export_conditions: ["runtime-private fields are excluded"],
  non_exportable_reasons: [],
  reconstruction_expectation: "shallow_reconstructable",
  notes: "bounded notes",
};

function createEnvelope(overrides = {}) {
  const bindingRef = build_projection_binding_posture_ref({
    object_record: objectRecord,
    binding,
    export_rule: exportRule,
  });

  return create_projection_safe_envelope({
    projection_envelope_id: "projection_envelope_01",
    source_runtime_object_refs: ["trace_evidence_01"],
    object_export_binding_posture_refs: [bindingRef],
    module_posture_summary: DEFAULT_MPLP_MODULE_POSTURES.map(
      summarize_mplp_module_posture
    ),
    kernel_duty_posture_summary: DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES.map(
      summarize_kernel_duty_runtime_posture
    ),
    safe_evidence_refs: [
      {
        evidence_ref: "trace_evidence_01",
        evidence_kind: "trace_summary",
        summary: "bounded trace evidence",
      },
    ],
    omission_markers: [
      {
        marker: "runtime_private_payload_omitted",
        reason: "Projection envelope exposes summaries and references only.",
      },
    ],
    protocol_version_refs: [
      {
        ref_kind: "protocol",
        ref_id: "MPLP",
        ref_version: "1.0.0",
      },
    ],
    binding_version_refs: [
      {
        ref_kind: "binding",
        ref_id: "mplp-coregentis-binding-matrix-v0",
        ref_version: "v0",
      },
      {
        ref_kind: "binding",
        ref_id: "mplp-kernel-duty-coregentis-binding",
        ref_version: "0.1",
      },
    ],
    created_at: "2026-04-27T00:00:00.000Z",
    ...overrides,
  });
}

test("[runtime] object/export binding helper creates projection-safe posture summary", () => {
  const summary = build_projection_binding_posture_ref({
    object_record: objectRecord,
    binding,
    export_rule: exportRule,
  });

  assert.equal(summary.source_object_ref, "trace_evidence_01");
  assert.equal(summary.coregentis_object_ref, "trace-evidence");
  assert.equal(summary.protocol_object_ref, "mplp-trace");
  assert.equal(summary.exportability.export_allowed, true);
  assert.equal(summary.runtime_private_fields_omitted, true);
  assert.ok(summary.omission_markers.includes("raw_runtime_private_payload_omitted"));
});

test("[runtime] projection-safe envelope composes binding, module, duty, evidence, omission, and version posture", () => {
  const envelope = createEnvelope();

  assert.equal(envelope.projection_envelope_version, "0.1");
  assert.equal(envelope.non_executing, true);
  assert.equal(envelope.runtime_private_fields_omitted, true);
  assert.equal(envelope.object_export_binding_posture_refs.length, 1);
  assert.equal(envelope.module_posture_summary.length, 10);
  assert.equal(envelope.kernel_duty_posture_summary.length, 11);
  assert.equal(envelope.safe_evidence_refs.length, 1);
  assert.equal(envelope.omission_markers.length, 1);
  assert.equal(envelope.protocol_version_refs.length, 1);
  assert.equal(envelope.binding_version_refs.length, 2);
  assert.ok(envelope.product_boundary_notices.length >= 2);
});

test("[runtime] projection-safe envelope contains no raw runtime-private payload fields", () => {
  const envelope = createEnvelope();

  assert.doesNotThrow(() => assert_no_forbidden_projection_keys(envelope));
  const serialized = JSON.stringify(envelope);
  assert.doesNotMatch(serialized, /raw_vsl|raw_psg|raw_trace|runtime_object_record/);
});

test("[runtime] projection-safe envelope rejects forbidden raw runtime-private keys", () => {
  assert.throws(
    () =>
      assert_no_forbidden_projection_keys({
        safe: true,
        runtime_store: {},
      }),
    /Forbidden projection key/
  );
});
