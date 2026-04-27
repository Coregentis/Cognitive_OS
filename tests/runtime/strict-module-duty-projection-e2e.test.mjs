import test from "node:test";
import assert from "node:assert/strict";

import { FrozenBindingService } from "../../runtime/core/binding-service.ts";
import { MPLP_KERNEL_DUTIES } from "../../runtime/core/kernel-duty-runtime-posture.ts";
import { MPLP_MODULES } from "../../runtime/core/mplp-module-posture.ts";
import { assert_no_forbidden_projection_keys } from "../../runtime/core/projection-safe-envelope.ts";
import {
  build_projection_safe_runtime_envelope_from_records,
  summarize_projection_safe_runtime_envelope,
} from "../../runtime/core/projection-safe-runtime-envelope-builder.ts";

const PROJECT_ID = "00000000-0000-4000-8000-740000000001";

function representativeRuntimeObjectRecords() {
  return [
    {
      object_id: "strict_project_ref_01",
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
      object_id: "strict_confirm_gate_ref_01",
      object_type: "confirm-gate",
      authority_class: "runtime_bound",
      primary_layer: "cognitive_runtime_core",
      status: "active",
      project_id: PROJECT_ID,
      protocol_binding_ref: {
        binding_class: "runtime_bound",
        protocol_object_type: "mplp-confirm",
        protocol_object_id: "strict_confirm_ref_01",
        reconstructable: true,
      },
      temporal: {},
      mutation: {},
      lineage: {},
      governance: {},
    },
    {
      object_id: "strict_trace_evidence_ref_01",
      object_type: "trace-evidence",
      authority_class: "runtime_bound",
      primary_layer: "cognitive_runtime_core",
      status: "active",
      project_id: PROJECT_ID,
      protocol_binding_ref: {
        binding_class: "runtime_bound",
        protocol_object_type: "mplp-trace",
        protocol_object_id: "strict_trace_ref_01",
        reconstructable: true,
      },
      temporal: {},
      mutation: {},
      lineage: {},
      governance: {},
    },
  ];
}

test("[strict-e2e] runtime object records flow through binding service into complete module and duty projection posture", () => {
  const envelope = build_projection_safe_runtime_envelope_from_records({
    projection_envelope_id: "strict_module_duty_projection_envelope_01",
    runtime_object_records: representativeRuntimeObjectRecords(),
    binding_service: FrozenBindingService.from_repo_root("."),
    safe_evidence_refs: [
      {
        evidence_ref: "strict_trace_evidence_ref_01",
        evidence_kind: "trace_summary",
        summary: "Bounded trace reference for strict module/duty projection E2E.",
      },
    ],
    omission_markers: [
      {
        marker: "strict_e2e_runtime_records_omitted",
        reason: "Strict E2E exposes references, binding posture, and posture summaries only.",
      },
    ],
    product_boundary_notices: [
      "Downstream projection may consume posture summaries without defining runtime or protocol law.",
    ],
    created_at: "2026-04-27T00:00:00.000Z",
  });

  const summary = summarize_projection_safe_runtime_envelope(envelope);
  const moduleNames = envelope.module_posture_summary.map(
    (module) => module.module_name
  );
  const dutyIds = envelope.kernel_duty_posture_summary.map(
    (duty) => duty.duty_id
  );

  assert.deepEqual(moduleNames, MPLP_MODULES.map((module) => module.module_name));
  assert.deepEqual(dutyIds, MPLP_KERNEL_DUTIES.map((duty) => duty.duty_id));
  assert.equal(envelope.source_runtime_object_refs.length, 3);
  assert.equal(envelope.object_export_binding_posture_refs.length, 3);
  assert.ok(envelope.safe_evidence_refs.length > 0);
  assert.ok(envelope.omission_markers.length > 0);
  assert.ok(envelope.protocol_version_refs.length > 0);
  assert.ok(envelope.binding_version_refs.length > 0);
  assert.equal(envelope.runtime_private_fields_omitted, true);
  assert.equal(envelope.non_executing, true);
  assert.equal(summary.module_count, 10);
  assert.equal(summary.kernel_duty_count, 11);
  assert.equal(summary.runtime_private_fields_omitted, true);
  assert.equal(summary.non_executing, true);

  const extension = envelope.module_posture_summary.find(
    (module) => module.module_name === "Extension"
  );
  const network = envelope.module_posture_summary.find(
    (module) => module.module_name === "Network"
  );

  assert.equal(extension?.realization_status, "unavailable_safe_deferred");
  assert.equal(network?.realization_status, "unavailable_safe_deferred");
  assert.match(JSON.stringify(extension), /not enabled|unavailable/i);
  assert.match(JSON.stringify(network), /not enabled|unavailable/i);
  assert.doesNotMatch(
    JSON.stringify(envelope),
    /"provider_dispatch"\s*:\s*true|"channel_dispatch"\s*:\s*true|"marketplace_implemented"\s*:\s*true/i
  );
  assert.doesNotThrow(() => assert_no_forbidden_projection_keys(envelope));
});
