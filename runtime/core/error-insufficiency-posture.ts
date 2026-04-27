import type { MplpKernelDutyId } from "./kernel-duty-runtime-posture.ts";
import type {
  ProjectionSafeEvidenceRef,
  ProjectionSafeOmissionMarker,
} from "./projection-safe-envelope.ts";

export type ErrorInsufficiencyStatus =
  | "blocked"
  | "failed"
  | "stale"
  | "insufficient_evidence"
  | "recoverable"
  | "non_recoverable";

export type ErrorInsufficiencyPosture = {
  posture_id: string;
  status: ErrorInsufficiencyStatus;
  recoverable: boolean;
  user_safe_summary: string;
  safe_evidence_refs: ProjectionSafeEvidenceRef[];
  omission_markers: ProjectionSafeOmissionMarker[];
  kernel_duty_posture_links: MplpKernelDutyId[];
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type CreateErrorInsufficiencyPostureInput = {
  posture_id: string;
  status: ErrorInsufficiencyStatus;
  recoverable?: boolean;
  user_safe_summary: string;
  safe_evidence_refs?: ProjectionSafeEvidenceRef[];
  omission_markers?: ProjectionSafeOmissionMarker[];
};

export function create_error_insufficiency_posture(
  input: CreateErrorInsufficiencyPostureInput
): ErrorInsufficiencyPosture {
  return {
    posture_id: input.posture_id,
    status: input.status,
    recoverable:
      input.recoverable ?? ["blocked", "stale", "insufficient_evidence", "recoverable"].includes(input.status),
    user_safe_summary: input.user_safe_summary,
    safe_evidence_refs: [...(input.safe_evidence_refs ?? [])].sort((a, b) =>
      a.evidence_ref.localeCompare(b.evidence_ref)
    ),
    omission_markers: [
      {
        marker: "raw_error_payload_omitted",
        reason: "Error posture exposes user-safe summaries and evidence references only.",
      },
      ...(input.omission_markers ?? []),
    ].sort((a, b) => a.marker.localeCompare(b.marker)),
    kernel_duty_posture_links: ["KD-02"],
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}
