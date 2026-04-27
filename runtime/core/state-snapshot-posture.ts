import type { MplpKernelDutyId } from "./kernel-duty-runtime-posture.ts";
import type { MplpModuleName } from "./mplp-module-posture.ts";
import type {
  ProjectionSafeEvidenceRef,
  ProjectionSafeOmissionMarker,
} from "./projection-safe-envelope.ts";

export type RestorePosture =
  | "not_requested"
  | "restorable"
  | "blocked"
  | "stale"
  | "insufficient_state";

export type StateSnapshotPosture = {
  posture_id: string;
  continuity_ref: string;
  snapshot_ref: string;
  restore_posture: RestorePosture;
  stale_or_insufficient_state: boolean;
  source_refs: string[];
  safe_evidence_refs: ProjectionSafeEvidenceRef[];
  omission_markers: ProjectionSafeOmissionMarker[];
  kernel_duty_posture_links: MplpKernelDutyId[];
  module_posture_links: MplpModuleName[];
  user_safe_summary: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type CreateStateSnapshotPostureInput = {
  posture_id: string;
  continuity_ref: string;
  snapshot_ref: string;
  restore_posture: RestorePosture;
  stale_or_insufficient_state?: boolean;
  source_refs?: string[];
  safe_evidence_refs?: ProjectionSafeEvidenceRef[];
  omission_markers?: ProjectionSafeOmissionMarker[];
  user_safe_summary: string;
};

export function create_state_snapshot_posture(
  input: CreateStateSnapshotPostureInput
): StateSnapshotPosture {
  return {
    posture_id: input.posture_id,
    continuity_ref: input.continuity_ref,
    snapshot_ref: input.snapshot_ref,
    restore_posture: input.restore_posture,
    stale_or_insufficient_state:
      input.stale_or_insufficient_state ??
      ["stale", "insufficient_state", "blocked"].includes(input.restore_posture),
    source_refs: [...(input.source_refs ?? [])].sort(),
    safe_evidence_refs: [...(input.safe_evidence_refs ?? [])].sort((a, b) =>
      a.evidence_ref.localeCompare(b.evidence_ref)
    ),
    omission_markers: [
      {
        marker: "raw_state_store_payload_omitted",
        reason: "State snapshot posture exposes references and summaries only.",
      },
      ...(input.omission_markers ?? []),
    ].sort((a, b) => a.marker.localeCompare(b.marker)),
    kernel_duty_posture_links: ["KD-10"],
    module_posture_links: ["Context", "Core", "Trace"],
    user_safe_summary: input.user_safe_summary,
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}
