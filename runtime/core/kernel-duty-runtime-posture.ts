export const MPLP_KERNEL_DUTIES = [
  { duty_id: "KD-01", duty_name: "Coordination", duty_slug: "coordination" },
  { duty_id: "KD-02", duty_name: "Error Handling", duty_slug: "error-handling" },
  { duty_id: "KD-03", duty_name: "Event Bus", duty_slug: "event-bus" },
  { duty_id: "KD-04", duty_name: "Learning Feedback", duty_slug: "learning-feedback" },
  { duty_id: "KD-05", duty_name: "Observability", duty_slug: "observability" },
  { duty_id: "KD-06", duty_name: "Orchestration", duty_slug: "orchestration" },
  { duty_id: "KD-07", duty_name: "Performance", duty_slug: "performance" },
  { duty_id: "KD-08", duty_name: "Protocol Versioning", duty_slug: "protocol-versioning" },
  { duty_id: "KD-09", duty_name: "Security", duty_slug: "security" },
  { duty_id: "KD-10", duty_name: "State Sync", duty_slug: "state-sync" },
  { duty_id: "KD-11", duty_name: "Transaction", duty_slug: "transaction" },
] as const;

export type MplpKernelDutyId = typeof MPLP_KERNEL_DUTIES[number]["duty_id"];
export type MplpKernelDutyName = typeof MPLP_KERNEL_DUTIES[number]["duty_name"];
export type MplpKernelDutySlug = typeof MPLP_KERNEL_DUTIES[number]["duty_slug"];

export type KernelDutyRealizationStatus =
  | "explicit_runtime_realization"
  | "partial_runtime_realization"
  | "binding_only"
  | "projection_only"
  | "implicit_only"
  | "planned"
  | "unavailable_safe_deferred";

export type KernelDutyRuntimePostureRecord = {
  duty_id: MplpKernelDutyId;
  duty_name: MplpKernelDutyName;
  duty_slug: MplpKernelDutySlug;
  cognitive_os_responsibility: string;
  owner_service_refs: string[];
  runtime_object_family_refs: string[];
  evidence_posture: string;
  projection_safe_exposure: string;
  product_boundary_rule: string;
  realization_status: KernelDutyRealizationStatus;
  blocking_for_product_projection: boolean;
  notes: string;
};

export type KernelDutyRuntimePostureSummary = {
  duty_id: MplpKernelDutyId;
  duty_name: MplpKernelDutyName;
  duty_slug: MplpKernelDutySlug;
  realization_status: KernelDutyRealizationStatus;
  blocking_for_product_projection: boolean;
  projection_safe_exposure: string;
  evidence_posture: string;
  product_boundary_rule: string;
};

export function summarize_kernel_duty_runtime_posture(
  posture: KernelDutyRuntimePostureRecord
): KernelDutyRuntimePostureSummary {
  return {
    duty_id: posture.duty_id,
    duty_name: posture.duty_name,
    duty_slug: posture.duty_slug,
    realization_status: posture.realization_status,
    blocking_for_product_projection: posture.blocking_for_product_projection,
    projection_safe_exposure: posture.projection_safe_exposure,
    evidence_posture: posture.evidence_posture,
    product_boundary_rule: posture.product_boundary_rule,
  };
}
