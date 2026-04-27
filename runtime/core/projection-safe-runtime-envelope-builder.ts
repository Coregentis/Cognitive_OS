import {
  DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES,
} from "./default-kernel-duty-posture.ts";
import {
  DEFAULT_MPLP_MODULE_POSTURES,
} from "./default-mplp-module-posture.ts";
import {
  summarize_kernel_duty_runtime_posture,
  type KernelDutyRuntimePostureRecord,
} from "./kernel-duty-runtime-posture.ts";
import {
  summarize_mplp_module_posture,
  type MplpModulePostureRecord,
} from "./mplp-module-posture.ts";
import {
  build_projection_binding_posture_ref,
  summarize_binding_posture_collection,
  type ProjectionBindingPostureRef,
} from "./projection-binding-consumption.ts";
import {
  create_projection_safe_envelope,
  type ProjectionSafeEnvelope,
  type ProjectionSafeEvidenceRef,
  type ProjectionSafeOmissionMarker,
  type ProjectionSafeVersionRef,
} from "./projection-safe-envelope.ts";
import type { BindingService } from "./binding-service.ts";
import type { RuntimeObjectRecord } from "./runtime-types.ts";

const DEFAULT_PROTOCOL_VERSION_REFS: ProjectionSafeVersionRef[] = [
  {
    ref_kind: "protocol",
    ref_id: "MPLP",
    ref_version: "1.0.0",
  },
];

const DEFAULT_BINDING_VERSION_REFS: ProjectionSafeVersionRef[] = [
  {
    ref_kind: "binding",
    ref_id: "mplp-coregentis-binding-matrix-v0",
    ref_version: "v0",
  },
  {
    ref_kind: "binding",
    ref_id: "coregentis-export-rules-v0",
    ref_version: "v0",
  },
  {
    ref_kind: "binding",
    ref_id: "mplp-kernel-duty-coregentis-binding",
    ref_version: "0.1",
  },
];

export type BuildProjectionSafeRuntimeEnvelopeInput = {
  projection_envelope_id: string;
  source_runtime_object_refs: string[];
  object_export_binding_posture_refs: ProjectionBindingPostureRef[];
  module_postures?: MplpModulePostureRecord[];
  kernel_duty_postures?: KernelDutyRuntimePostureRecord[];
  safe_evidence_refs?: ProjectionSafeEvidenceRef[];
  omission_markers?: ProjectionSafeOmissionMarker[];
  protocol_version_refs?: ProjectionSafeVersionRef[];
  binding_version_refs?: ProjectionSafeVersionRef[];
  product_boundary_notices?: string[];
  created_at?: string;
};

export type BuildProjectionSafeRuntimeEnvelopeFromRecordsInput = Omit<
  BuildProjectionSafeRuntimeEnvelopeInput,
  "source_runtime_object_refs" | "object_export_binding_posture_refs"
> & {
  runtime_object_records: RuntimeObjectRecord[];
  binding_service: Pick<BindingService, "get_binding" | "get_export_rule">;
};

export type ProjectionSafeRuntimeEnvelopeSummary = {
  projection_envelope_id: string;
  source_runtime_object_count: number;
  exportable_object_count: number;
  non_exportable_object_count: number;
  module_count: number;
  kernel_duty_count: number;
  evidence_ref_count: number;
  omission_markers: string[];
  protocol_version_refs: string[];
  binding_version_refs: string[];
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export function build_projection_safe_runtime_envelope(
  input: BuildProjectionSafeRuntimeEnvelopeInput
): ProjectionSafeEnvelope {
  const module_postures = input.module_postures ?? DEFAULT_MPLP_MODULE_POSTURES;
  const kernel_duty_postures =
    input.kernel_duty_postures ?? DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES;

  return create_projection_safe_envelope({
    projection_envelope_id: input.projection_envelope_id,
    source_runtime_object_refs: input.source_runtime_object_refs,
    object_export_binding_posture_refs:
      input.object_export_binding_posture_refs,
    module_posture_summary: module_postures.map(summarize_mplp_module_posture),
    kernel_duty_posture_summary: kernel_duty_postures.map(
      summarize_kernel_duty_runtime_posture
    ),
    safe_evidence_refs: input.safe_evidence_refs,
    omission_markers: [
      {
        marker: "runtime_private_payload_omitted",
        reason: "Runtime object records are represented only by references and binding posture summaries.",
      },
      ...(input.omission_markers ?? []),
    ],
    protocol_version_refs:
      input.protocol_version_refs ?? DEFAULT_PROTOCOL_VERSION_REFS,
    binding_version_refs:
      input.binding_version_refs ?? DEFAULT_BINDING_VERSION_REFS,
    product_boundary_notices: input.product_boundary_notices,
    created_at: input.created_at,
  });
}

export function build_projection_safe_runtime_envelope_from_records(
  input: BuildProjectionSafeRuntimeEnvelopeFromRecordsInput
): ProjectionSafeEnvelope {
  const posture_refs = input.runtime_object_records.map((record) =>
    build_projection_binding_posture_ref({
      object_record: record,
      binding: input.binding_service.get_binding(record.object_type),
      export_rule: input.binding_service.get_export_rule(record.object_type),
    })
  );

  return build_projection_safe_runtime_envelope({
    projection_envelope_id: input.projection_envelope_id,
    source_runtime_object_refs: input.runtime_object_records.map(
      (record) => record.object_id
    ),
    object_export_binding_posture_refs: posture_refs,
    module_postures: input.module_postures,
    kernel_duty_postures: input.kernel_duty_postures,
    safe_evidence_refs: input.safe_evidence_refs,
    omission_markers: input.omission_markers,
    protocol_version_refs: input.protocol_version_refs,
    binding_version_refs: input.binding_version_refs,
    product_boundary_notices: input.product_boundary_notices,
    created_at: input.created_at,
  });
}

export function summarize_projection_safe_runtime_envelope(
  envelope: ProjectionSafeEnvelope
): ProjectionSafeRuntimeEnvelopeSummary {
  const binding_summary = summarize_binding_posture_collection(
    envelope.object_export_binding_posture_refs
  );

  const omission_markers = new Set<string>([
    ...binding_summary.omission_markers,
    ...envelope.omission_markers.map((marker) => marker.marker),
  ]);

  return {
    projection_envelope_id: envelope.projection_envelope_id,
    source_runtime_object_count: envelope.source_runtime_object_refs.length,
    exportable_object_count: binding_summary.exportable_count,
    non_exportable_object_count: binding_summary.non_exportable_count,
    module_count: envelope.module_posture_summary.length,
    kernel_duty_count: envelope.kernel_duty_posture_summary.length,
    evidence_ref_count: envelope.safe_evidence_refs.length,
    omission_markers: [...omission_markers].sort(),
    protocol_version_refs: envelope.protocol_version_refs.map(
      (ref) => `${ref.ref_id}@${ref.ref_version}`
    ),
    binding_version_refs: envelope.binding_version_refs.map(
      (ref) => `${ref.ref_id}@${ref.ref_version}`
    ),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}
