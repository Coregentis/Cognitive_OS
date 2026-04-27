import type { KernelDutyRuntimePostureSummary } from "./kernel-duty-runtime-posture.ts";
import type { MplpModulePostureSummary } from "./mplp-module-posture.ts";
import type { ProjectionBindingPostureRef } from "./projection-binding-consumption.ts";
import { FORBIDDEN_PROJECTION_RAW_KEYS } from "./projection-types.ts";

export type ProjectionSafeEnvelopeVersion = "0.1";

export type ProjectionSafeEvidenceRef = {
  evidence_ref: string;
  evidence_kind?: string;
  summary?: string;
};

export type ProjectionSafeOmissionMarker = {
  marker: string;
  reason: string;
};

export type ProjectionSafeVersionRef = {
  ref_kind: "protocol" | "binding" | "runtime";
  ref_id: string;
  ref_version: string;
};

export type ProjectionSafeEnvelope = {
  projection_envelope_id: string;
  projection_envelope_version: ProjectionSafeEnvelopeVersion;
  source_runtime_object_refs: string[];
  object_export_binding_posture_refs: ProjectionBindingPostureRef[];
  module_posture_summary: MplpModulePostureSummary[];
  kernel_duty_posture_summary: KernelDutyRuntimePostureSummary[];
  safe_evidence_refs: ProjectionSafeEvidenceRef[];
  omission_markers: ProjectionSafeOmissionMarker[];
  protocol_version_refs: ProjectionSafeVersionRef[];
  binding_version_refs: ProjectionSafeVersionRef[];
  product_boundary_notices: string[];
  non_executing: true;
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type CreateProjectionSafeEnvelopeInput = {
  projection_envelope_id: string;
  source_runtime_object_refs: string[];
  object_export_binding_posture_refs: ProjectionBindingPostureRef[];
  module_posture_summary: MplpModulePostureSummary[];
  kernel_duty_posture_summary: KernelDutyRuntimePostureSummary[];
  safe_evidence_refs?: ProjectionSafeEvidenceRef[];
  omission_markers?: ProjectionSafeOmissionMarker[];
  protocol_version_refs: ProjectionSafeVersionRef[];
  binding_version_refs: ProjectionSafeVersionRef[];
  product_boundary_notices?: string[];
  created_at?: string;
};

export function create_projection_safe_envelope(
  input: CreateProjectionSafeEnvelopeInput
): ProjectionSafeEnvelope {
  const envelope: ProjectionSafeEnvelope = {
    projection_envelope_id: input.projection_envelope_id,
    projection_envelope_version: "0.1",
    source_runtime_object_refs: [...input.source_runtime_object_refs].sort(),
    object_export_binding_posture_refs: [...input.object_export_binding_posture_refs],
    module_posture_summary: [...input.module_posture_summary],
    kernel_duty_posture_summary: [...input.kernel_duty_posture_summary],
    safe_evidence_refs: [...(input.safe_evidence_refs ?? [])].sort((a, b) =>
      a.evidence_ref.localeCompare(b.evidence_ref)
    ),
    omission_markers: [...(input.omission_markers ?? [])].sort((a, b) =>
      a.marker.localeCompare(b.marker)
    ),
    protocol_version_refs: [...input.protocol_version_refs],
    binding_version_refs: [...input.binding_version_refs],
    product_boundary_notices: [
      "Projection envelope is a bounded summary, not runtime-private state.",
      "Product projection may render this posture but must not define protocol or runtime law.",
      ...(input.product_boundary_notices ?? []),
    ],
    non_executing: true,
    runtime_private_fields_omitted: true,
    created_at: input.created_at ?? new Date(0).toISOString(),
  };

  assert_projection_safe_envelope(envelope);
  return envelope;
}

export function assert_projection_safe_envelope(
  envelope: ProjectionSafeEnvelope
): void {
  if (!envelope.runtime_private_fields_omitted) {
    throw new Error("Projection envelope must omit runtime-private fields.");
  }

  if (!envelope.non_executing) {
    throw new Error("Projection envelope must remain non-executing.");
  }

  assert_no_forbidden_projection_keys(envelope);
}

export function assert_no_forbidden_projection_keys(value: unknown): void {
  const forbidden_keys = new Set<string>(FORBIDDEN_PROJECTION_RAW_KEYS);

  function walk(candidate: unknown, path: string): void {
    if (!candidate || typeof candidate !== "object") {
      return;
    }

    if (Array.isArray(candidate)) {
      candidate.forEach((item, index) => walk(item, `${path}[${index}]`));
      return;
    }

    for (const [key, nested] of Object.entries(candidate)) {
      if (forbidden_keys.has(key)) {
        throw new Error(`Forbidden projection key at ${path}.${key}`);
      }

      walk(nested, `${path}.${key}`);
    }
  }

  walk(value, "$");
}
