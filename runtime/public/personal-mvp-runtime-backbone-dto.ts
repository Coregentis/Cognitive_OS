// DTO/projection contract only.
// No runtime-private service or store exposure.
// No provider, model, tool, worker, external action, mutation, acceptance,
// training, writeback, package publication, or assurance authority.

import type {
  RuntimePublicSurfaceEvidenceRefDto,
  RuntimePublicSurfaceOmissionMarkerDto,
  RuntimePublicSurfaceVersionRefs,
} from "./runtime-objective-continuity-dto.ts";

export type PersonalMvpRuntimeBackboneContractVersion = string;

export type PersonalMvpRuntimeBackboneRuntimeContractVersion = string;

export type PersonalMvpRuntimeBackboneCompatibilityProfile = string;

export type PersonalMvpRuntimeDecisionState =
  | "needs_review"
  | "accepted"
  | "needs_revision"
  | "rejected"
  | "parked"
  | "blocked"
  | "not_required";

export type PersonalMvpRuntimeActivityKind =
  | "operator_goal_captured"
  | "memory_read"
  | "direction_change_detected"
  | "confirmation_requested"
  | "task_decomposed"
  | "output_recorded"
  | "human_review_recorded"
  | "evidence_recorded";

export type PersonalMvpRuntimePsgLayer =
  | "operator_intake_psg"
  | "project_scope_psg"
  | "task_scope_psg";

export type PersonalMvpRuntimeLearningState =
  | "suggested"
  | "confirmed"
  | "rejected"
  | "archived";

export type PersonalMvpRuntimeDirectionChangeState =
  | "pending_confirmation"
  | "confirmed"
  | "revised"
  | "rejected"
  | "parked";

export type PersonalMvpRuntimeEvidenceRef =
  RuntimePublicSurfaceEvidenceRefDto & {
    source_ref: string;
    privacy_treatment:
      | "summary_only"
      | "reference_only"
      | "runtime_private_payload_omitted";
    runtime_private_payload_omitted: true;
  };

export type PersonalMvpRuntimeOmission =
  RuntimePublicSurfaceOmissionMarkerDto & {
    omitted_field: string;
    omission_reason: string;
    runtime_private: true;
    safe_alternative_ref?: string;
  };

export type PersonalMvpAelActivitySummary = {
  activity_count: number;
  latest_activity_ref?: string;
  activity_kinds: readonly PersonalMvpRuntimeActivityKind[];
  activity_refs: readonly string[];
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  runtime_private_payload_omitted: true;
};

export type PersonalMvpVslContinuitySummary = {
  continuity_ref: string;
  current_mission_state: string;
  progress_state: string;
  review_state: PersonalMvpRuntimeDecisionState;
  packet_state: string;
  artifact_state: string;
  resume_pointer: string;
  last_confirmed_direction?: string;
  next_safe_action: string;
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  runtime_private_payload_omitted: true;
};

export type PersonalMvpPsgMemoryLayerSummary = {
  layer: PersonalMvpRuntimePsgLayer;
  summary: string;
  node_refs: readonly string[];
  relation_refs: readonly string[];
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  runtime_private_payload_omitted: true;
};

export type PersonalMvpPsgMemorySummary = {
  graph_ref: string;
  graph_revision: number;
  layers: readonly PersonalMvpPsgMemoryLayerSummary[];
  runtime_private_payload_omitted: true;
};

export type PersonalMvpLearningFeedbackSummary = {
  feedback_count: number;
  states_present: readonly PersonalMvpRuntimeLearningState[];
  candidate_refs: readonly string[];
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  runtime_private_payload_omitted: true;
};

export type PersonalMvpDirectionChangeSummary = {
  direction_change_ref?: string;
  state: PersonalMvpRuntimeDirectionChangeState;
  previous_direction_ref?: string;
  proposed_direction_ref?: string;
  change_summary: string;
  impact_summary: string;
  requires_operator_confirmation: boolean;
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  runtime_private_payload_omitted: true;
};

export type PersonalMvpRuntimeBackboneBoundaryFlags = {
  projection_safe: true;
  runtime_private_payload_omitted: true;
  runtime_private_fields_omitted: true;
  personal_mvp_ael_activity_runtime_available: true;
  personal_mvp_vsl_continuity_runtime_available: true;
  personal_mvp_psg_memory_runtime_available: true;
  personal_mvp_learning_feedback_runtime_available: true;
  personal_mvp_direction_change_runtime_available: true;
  full_enterprise_ael_runtime_claimed: false;
  full_enterprise_vsl_runtime_claimed: false;
  full_enterprise_psg_runtime_claimed: false;
  full_enterprise_learning_engine_claimed: false;
  provider_execution_authorized: false;
  model_execution_authorized: false;
  tool_execution_authorized: false;
  worker_execution_authorized: false;
  publishing_authorized: false;
  external_action_authorized: false;
  automatic_mutation_authorized: false;
  autonomous_acceptance_authorized: false;
  training_authorized: false;
  writeback_authorized: false;
  no_package_publish: true;
  no_certification_or_endorsement: true;
};

export type PersonalMvpRuntimeBackboneProjection = {
  runtime_backbone_ref: string;
  contract_version: PersonalMvpRuntimeBackboneContractVersion;
  runtime_contract_version: PersonalMvpRuntimeBackboneRuntimeContractVersion;
  compatibility_profile: PersonalMvpRuntimeBackboneCompatibilityProfile;
  generated_at: string;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  version_refs: RuntimePublicSurfaceVersionRefs;
  ael_activity_summary: PersonalMvpAelActivitySummary;
  vsl_continuity_summary: PersonalMvpVslContinuitySummary;
  psg_memory_summary: PersonalMvpPsgMemorySummary;
  learning_feedback_summary: PersonalMvpLearningFeedbackSummary;
  direction_change_summary: PersonalMvpDirectionChangeSummary;
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  omissions: readonly PersonalMvpRuntimeOmission[];
  boundary_flags: PersonalMvpRuntimeBackboneBoundaryFlags;
  runtime_private_fields_omitted: true;
  non_executing: true;
};
