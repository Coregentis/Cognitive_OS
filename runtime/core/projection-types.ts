export type RuntimeProjectionSafeStateExposure = {
  projection_id: string;
  project_id: string;
  source_runtime_ref: string;
  state_summary: {
    initial_state: string;
    transition_event: string;
    requested_next_state?: string;
    evaluated_next_state?: string;
    transition_accepted: boolean;
    final_state: string;
    blocked_reason?: string;
    terminal: boolean;
  };
  interpretation: {
    transition_accepted_meaning: "state evaluation accepted, not approval";
    terminal_meaning: "state line terminal, not execution complete";
    blocked_reason_meaning: "blocked state transition reason, not task failure verdict";
  };
  non_executing: true;
  created_at: string;
};

export type RuntimeEvidencePostureSummary = {
  evidence_summary_id: string;
  project_id: string;
  evidence_available: boolean;
  evidence_refs: string[];
  evidence_summary: string;
  stale: boolean;
  insufficient: boolean;
  omission_reason?: string;
  confidence_posture?: "bounded" | "insufficient" | "stale" | "not_evaluated";
  interpretation: {
    evidence_summary_meaning: "summary, not proof or certification";
  };
  created_at: string;
};

export type RuntimeBlockedProjectionAction =
  | "approve"
  | "reject"
  | "dispatch"
  | "execute"
  | "provider_channel_send";

export type RuntimeNonExecutingRecommendationEnvelope = {
  recommendation_id: string;
  project_id: string;
  recommendation_summary: string;
  recommended_next_posture?: string;
  allowed_next_step?: string;
  blocked_actions: RuntimeBlockedProjectionAction[];
  non_executing: true;
  requires_later_authorization: true;
  created_at: string;
};

export type RuntimeProjectionSummaryEnvelope = {
  projection_summary_id: string;
  project_id: string;
  state_exposure?: RuntimeProjectionSafeStateExposure;
  evidence_posture?: RuntimeEvidencePostureSummary;
  recommendation?: RuntimeNonExecutingRecommendationEnvelope;
  source_refs: string[];
  non_executing: true;
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimeProjectionRevisionReason =
  | "insufficient_evidence"
  | "stale_context"
  | "operator_clarification"
  | "contract_blocked"
  | "other";

export type RuntimeEvidenceInsufficiencyCategory =
  | "missing_required_context"
  | "stale_context"
  | "conflicting_evidence"
  | "runtime_private_omitted"
  | "other";

export type RuntimeEvidenceInsufficiencyDetail = {
  detail_id: string;
  project_id: string;
  evidence_available: boolean;
  insufficient: boolean;
  stale: boolean;
  insufficiency_category?: RuntimeEvidenceInsufficiencyCategory;
  omission_reason?: string;
  required_evidence_class?: string;
  safe_evidence_refs?: string[];
  safe_clarification_prompt?: string;
  non_executing: true;
  runtime_private_fields_omitted: true;
};

export type RuntimeProjectionRevisionEnvelope = {
  revision_id: string;
  project_id: string;
  previous_projection_summary_id: string;
  revision_reason: RuntimeProjectionRevisionReason;
  revision_input_summary: string;
  evidence_insufficiency?: RuntimeEvidenceInsufficiencyDetail;
  resulting_projection_summary_id?: string;
  non_executing: true;
  runtime_private_fields_omitted: true;
};

export type CreateRuntimeProjectionSafeStateExposureInput = {
  projection_id?: string;
  project_id: string;
  source_runtime_ref: string;
  state_summary: {
    initial_state: string;
    transition_event: string;
    requested_next_state?: string;
    evaluated_next_state?: string;
    transition_accepted: boolean;
    final_state: string;
    blocked_reason?: string;
    terminal: boolean;
  };
  created_at?: string;
};

export type CreateRuntimeEvidencePostureSummaryInput = {
  evidence_summary_id?: string;
  project_id: string;
  evidence_available?: boolean;
  evidence_refs?: string[];
  evidence_summary: string;
  stale: boolean;
  insufficient: boolean;
  omission_reason?: string;
  confidence_posture?: "bounded" | "insufficient" | "stale" | "not_evaluated";
  created_at?: string;
};

export type CreateRuntimeNonExecutingRecommendationEnvelopeInput = {
  recommendation_id?: string;
  project_id: string;
  recommendation_summary: string;
  recommended_next_posture?: string;
  allowed_next_step?: string;
  blocked_actions?: string[];
  created_at?: string;
};

export type CreateRuntimeProjectionSummaryEnvelopeInput = {
  projection_summary_id?: string;
  project_id: string;
  state_exposure?: RuntimeProjectionSafeStateExposure;
  evidence_posture?: RuntimeEvidencePostureSummary;
  recommendation?: RuntimeNonExecutingRecommendationEnvelope;
  source_refs?: string[];
  created_at?: string;
};

export type CreateRuntimeEvidenceInsufficiencyDetailInput = {
  detail_id: string;
  project_id: string;
  evidence_available: boolean;
  insufficient: boolean;
  stale: boolean;
  insufficiency_category?: RuntimeEvidenceInsufficiencyCategory;
  omission_reason?: string;
  required_evidence_class?: string;
  safe_evidence_refs?: string[];
  safe_clarification_prompt?: string;
  non_executing: true;
  runtime_private_fields_omitted: true;
};

export type CreateRuntimeProjectionRevisionEnvelopeInput = {
  revision_id: string;
  project_id: string;
  previous_projection_summary_id: string;
  revision_reason: RuntimeProjectionRevisionReason;
  revision_input_summary: string;
  evidence_insufficiency?: RuntimeEvidenceInsufficiencyDetail;
  resulting_projection_summary_id?: string;
  non_executing: true;
  runtime_private_fields_omitted: true;
};

export const FORBIDDEN_PROJECTION_RAW_KEYS = [
  "raw_vsl",
  "raw_psg",
  "raw_trace",
  "drift_record",
  "learning_candidate",
  "provider_channel_result",
  "product_dto",
  "runtime_store",
  "runtime_private_object",
] as const;

export const FORBIDDEN_PROJECTION_ACTION_LABELS = [
  "approved",
  "rejected",
  "dispatched",
  "executed",
  "provider_sent",
  "channel_published",
] as const;
