export const MPLP_MODULES = [
  { module_id: "MPLP-CONTEXT", module_name: "Context" },
  { module_id: "MPLP-PLAN", module_name: "Plan" },
  { module_id: "MPLP-CONFIRM", module_name: "Confirm" },
  { module_id: "MPLP-TRACE", module_name: "Trace" },
  { module_id: "MPLP-ROLE", module_name: "Role" },
  { module_id: "MPLP-DIALOG", module_name: "Dialog" },
  { module_id: "MPLP-COLLAB", module_name: "Collab" },
  { module_id: "MPLP-EXTENSION", module_name: "Extension" },
  { module_id: "MPLP-CORE", module_name: "Core" },
  { module_id: "MPLP-NETWORK", module_name: "Network" },
] as const;

export type MplpModuleId = typeof MPLP_MODULES[number]["module_id"];
export type MplpModuleName = typeof MPLP_MODULES[number]["module_name"];

export type MplpModuleRealizationStatus =
  | "explicit_runtime_realization"
  | "partial_runtime_realization"
  | "binding_only"
  | "projection_only"
  | "implicit_only"
  | "unavailable_safe_deferred"
  | "absent";

export type MplpModulePostureRecord = {
  module_id: MplpModuleId;
  module_name: MplpModuleName;
  cognitive_os_responsibility: string;
  runtime_owner_refs: string[];
  projection_safe_exposure: string;
  evidence_posture: string;
  product_boundary_rule: string;
  realization_status: MplpModuleRealizationStatus;
  blocking_for_product_projection: boolean;
  notes: string;
};

export type MplpModulePostureSummary = {
  module_id: MplpModuleId;
  module_name: MplpModuleName;
  realization_status: MplpModuleRealizationStatus;
  blocking_for_product_projection: boolean;
  projection_safe_exposure: string;
  evidence_posture: string;
  product_boundary_rule: string;
};

export function summarize_mplp_module_posture(
  posture: MplpModulePostureRecord
): MplpModulePostureSummary {
  return {
    module_id: posture.module_id,
    module_name: posture.module_name,
    realization_status: posture.realization_status,
    blocking_for_product_projection: posture.blocking_for_product_projection,
    projection_safe_exposure: posture.projection_safe_exposure,
    evidence_posture: posture.evidence_posture,
    product_boundary_rule: posture.product_boundary_rule,
  };
}
