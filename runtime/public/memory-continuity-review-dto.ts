// DTO/projection contract only.
// No runtime behavior.
// No runtime-private service or store exposure.
// No external side-effect authority.
// No training, mutation, acceptance, or execution authority.

import type {
  RuntimePublicSurfaceEvidenceRefDto,
  RuntimePublicSurfaceOmissionMarkerDto,
  RuntimePublicSurfaceVersionRefs,
} from "./runtime-objective-continuity-dto.ts";

export type MemoryContinuityReviewContractVersion = string;

export type MemoryContinuityReviewRuntimeContractVersion = string;

export type MemoryContinuityReviewCompatibilityProfile = string;

export type ContinuityDecisionState =
  | "needs_review"
  | "accepted"
  | "needs_revision"
  | "rejected"
  | "parked"
  | "blocked"
  | "not_required";

export type MemoryContinuityLayerKind =
  | "session"
  | "objective"
  | "project"
  | "operator_preference"
  | "graph_summary"
  | "external_ref";

export type MemoryContinuityConfidence =
  | "high"
  | "medium"
  | "low"
  | "insufficient"
  | "not_evaluated";

export type MemoryContinuitySourceModule =
  | "Context"
  | "Plan"
  | "Confirm"
  | "Trace"
  | "Role"
  | "Extension"
  | "Dialog"
  | "Collab"
  | "Core"
  | "Network"
  | "KernelDuty"
  | "Learning"
  | "RuntimeGuide"
  | "PublicProjection";

export type MemoryContinuityEvidenceRef =
  RuntimePublicSurfaceEvidenceRefDto & {
    source_module: MemoryContinuitySourceModule;
    source_ref: string;
    privacy_treatment:
      | "summary_only"
      | "reference_only"
      | "runtime_private_payload_omitted"
      | "not_applicable";
    runtime_private_payload_omitted: true;
  };

export type MemoryContinuityOmission =
  RuntimePublicSurfaceOmissionMarkerDto & {
    omitted_field: string;
    omission_reason: string;
    runtime_private: true;
    safe_alternative_ref?: string;
  };

export type MemoryContinuityLayerSummary = {
  layer_id: string;
  layer_kind: MemoryContinuityLayerKind;
  summary: string;
  source_refs: readonly string[];
  last_updated_at?: string;
  confidence: MemoryContinuityConfidence;
  stale_or_missing_reason?: string;
  safe_evidence_refs: readonly MemoryContinuityEvidenceRef[];
  omissions: readonly MemoryContinuityOmission[];
  runtime_private_payload_omitted: true;
};

export type ContinuityReviewState = {
  current_state_summary: string;
  resume_ref?: string;
  last_session_ref?: string;
  open_decision_refs: readonly string[];
  next_action_summary: string;
  stale_or_missing_reason?: string;
  decision_state: ContinuityDecisionState;
  safe_evidence_refs: readonly MemoryContinuityEvidenceRef[];
  omissions: readonly MemoryContinuityOmission[];
  runtime_private_payload_omitted: true;
};

export type DirectionChangeReviewSummary = {
  direction_change_id: string;
  previous_objective_ref: string;
  proposed_objective_ref: string;
  change_summary: string;
  impact_summary: string;
  affected_memory_layer_refs: readonly string[];
  source_classification?: "objective_change" | "context_change" | "scope_change" | "unknown";
  requires_operator_confirmation: true;
  decision_state: ContinuityDecisionState;
  safe_evidence_refs: readonly MemoryContinuityEvidenceRef[];
  omissions: readonly MemoryContinuityOmission[];
  runtime_private_payload_omitted: true;
};

export type MemoryContinuityBoundaryFlags = {
  projection_safe: true;
  summary_only: true;
  evidence_safe: true;
  non_executing: true;
  runtime_private_payload_omitted: true;
  runtime_private_fields_omitted: true;
  no_runtime_private_service_exposure: true;
  no_runtime_private_store_exposure: true;
  no_raw_memory_payload: true;
  no_raw_graph_payload: true;
  no_raw_learning_payload: true;
  implements_full_vsl_runtime: false;
  implements_full_psg_runtime: false;
  implements_full_ael_runtime: false;
  implements_full_dialog_runtime: false;
  implements_full_drift_engine: false;
  implements_full_learning_engine: false;
  authorizes_provider_execution: false;
  authorizes_model_execution: false;
  authorizes_worker_execution: false;
  authorizes_tool_execution: false;
  authorizes_external_action: false;
  authorizes_automatic_mutation: false;
  authorizes_automatic_acceptance: false;
  authorizes_training: false;
  authorizes_writeback: false;
  authorizes_mplp_schema_change: false;
  authorizes_mplp_protocol_law_change: false;
  authorizes_mplp_normative_binding_change: false;
  no_certification_or_endorsement: true;
};

export type MemoryContinuityReviewSummary = {
  summary_id: string;
  contract_version: MemoryContinuityReviewContractVersion;
  runtime_contract_version: MemoryContinuityReviewRuntimeContractVersion;
  compatibility_profile: MemoryContinuityReviewCompatibilityProfile;
  objective_ref: string;
  context_ref?: string;
  operator_ref?: string;
  generated_at: string;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  version_refs: RuntimePublicSurfaceVersionRefs;
  continuity_state: ContinuityReviewState;
  memory_layers: readonly MemoryContinuityLayerSummary[];
  direction_change?: DirectionChangeReviewSummary;
  safe_evidence_refs: readonly MemoryContinuityEvidenceRef[];
  omissions: readonly MemoryContinuityOmission[];
  boundary_flags: MemoryContinuityBoundaryFlags;
  runtime_private_fields_omitted: true;
  non_executing: true;
};
