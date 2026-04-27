import type { MplpKernelDutyId } from "./kernel-duty-runtime-posture.ts";
import type {
  ProjectionSafeEvidenceRef,
  ProjectionSafeOmissionMarker,
} from "./projection-safe-envelope.ts";

export type TransactionExportStatus =
  | "commit"
  | "blocked"
  | "rollback"
  | "exported_snapshot";

export type TransactionExportPosture = {
  posture_id: string;
  transaction_status: TransactionExportStatus;
  export_consistency_posture: "consistent" | "blocked" | "rolled_back" | "not_exported";
  deterministic_snapshot_boundary_summary: string;
  distributed_transaction_claimed: false;
  safe_evidence_refs: ProjectionSafeEvidenceRef[];
  omission_markers: ProjectionSafeOmissionMarker[];
  kernel_duty_posture_links: MplpKernelDutyId[];
  user_safe_summary: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type CreateTransactionExportPostureInput = {
  posture_id: string;
  transaction_status: TransactionExportStatus;
  export_consistency_posture: TransactionExportPosture["export_consistency_posture"];
  deterministic_snapshot_boundary_summary: string;
  safe_evidence_refs?: ProjectionSafeEvidenceRef[];
  omission_markers?: ProjectionSafeOmissionMarker[];
  user_safe_summary: string;
};

export function create_transaction_export_posture(
  input: CreateTransactionExportPostureInput
): TransactionExportPosture {
  return {
    posture_id: input.posture_id,
    transaction_status: input.transaction_status,
    export_consistency_posture: input.export_consistency_posture,
    deterministic_snapshot_boundary_summary:
      input.deterministic_snapshot_boundary_summary,
    distributed_transaction_claimed: false,
    safe_evidence_refs: [...(input.safe_evidence_refs ?? [])].sort((a, b) =>
      a.evidence_ref.localeCompare(b.evidence_ref)
    ),
    omission_markers: [
      {
        marker: "raw_transaction_store_payload_omitted",
        reason: "Transaction/export posture exposes consistency summaries only.",
      },
      ...(input.omission_markers ?? []),
    ].sort((a, b) => a.marker.localeCompare(b.marker)),
    kernel_duty_posture_links: ["KD-11", "KD-09", "KD-05", "KD-08"],
    user_safe_summary: input.user_safe_summary,
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}
