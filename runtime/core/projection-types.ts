import type {
  RuntimeActionClass,
  RuntimeActionReadinessStatus,
} from "./runtime-types.ts";

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

export type RuntimeLifecycleHistoryEntry = {
  history_entry_id: string;
  project_id: string;
  lifecycle_stage: string;
  lifecycle_label: string;
  history_summary: string;
  evidence_gap_summary?: string;
  review_posture?: string;
  non_executing_posture: string;
  safe_evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimePendingReviewItemSummary = {
  review_item_id: string;
  project_id: string;
  continuity_id?: string;
  lifecycle_stage: string;
  lifecycle_label: string;
  evidence_gap_summary?: string;
  review_posture: string;
  non_executing_posture: string;
  safe_evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimeLifecycleContinuityProjection = {
  continuity_id: string;
  project_id: string;
  lifecycle_stage: string;
  lifecycle_label: string;
  history_summary: string;
  review_posture: string;
  non_executing_posture: string;
  safe_evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimePendingReviewProjection = {
  continuity_id: string;
  project_id: string;
  pending_review_count: number;
  pending_review_items: RuntimePendingReviewItemSummary[];
  review_posture: string;
  non_executing_posture: string;
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimeContinuitySnapshotProjection = {
  continuity_id: string;
  project_id: string;
  lifecycle_stage: string;
  lifecycle_label: string;
  history_summary: string;
  pending_review_count: number;
  safe_evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type CreateRuntimeLifecycleHistoryEntryInput = {
  history_entry_id?: string;
  project_id: string;
  lifecycle_stage: string;
  lifecycle_label: string;
  history_summary: string;
  evidence_gap_summary?: string;
  review_posture?: string;
  non_executing_posture: string;
  safe_evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at?: string;
};

export type CreateRuntimePendingReviewItemSummaryInput = {
  review_item_id?: string;
  project_id: string;
  continuity_id?: string;
  lifecycle_stage: string;
  lifecycle_label: string;
  evidence_gap_summary?: string;
  review_posture: string;
  non_executing_posture: string;
  safe_evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at?: string;
};

export type CreateRuntimeLifecycleContinuityProjectionInput = {
  continuity_id?: string;
  project_id: string;
  lifecycle_stage: string;
  lifecycle_label: string;
  history_summary: string;
  review_posture: string;
  non_executing_posture: string;
  safe_evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at?: string;
};

export type CreateRuntimePendingReviewProjectionInput = {
  continuity_id?: string;
  project_id: string;
  pending_review_items: CreateRuntimePendingReviewItemSummaryInput[];
  pending_review_count?: number;
  review_posture: string;
  non_executing_posture: string;
  runtime_private_fields_omitted: true;
  created_at?: string;
};

export type CreateRuntimeContinuitySnapshotProjectionInput = {
  continuity_id?: string;
  project_id: string;
  lifecycle_stage: string;
  lifecycle_label: string;
  history_summary: string;
  pending_review_count: number;
  safe_evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at?: string;
};

export type RuntimeScopeKind =
  | "project"
  | "operational_unit"
  | "work_scope"
  | "runtime_scope"
  | "other";

export type RuntimePriorityLevel =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type RuntimeArtifactClass =
  | "local_generated"
  | "external_draft"
  | "imported"
  | "archived";

export type RuntimeLearningApplicationScope =
  | "scope_only"
  | "global_candidate";

export type RuntimeScopedLearningStatus =
  | "candidate"
  | "accepted"
  | "rejected"
  | "deferred";

export type RuntimeContinuationRecommendation =
  | "continue"
  | "clarify"
  | "revise"
  | "branch"
  | "block";

export type RuntimeScopeSummary = {
  scope_id: string;
  scope_kind: RuntimeScopeKind;
  status: string;
  title: string;
  summary?: string;
  evidence_refs?: string[];
  runtime_private_fields_omitted: true;
};

export type RuntimePrioritySummary = {
  priority_id: string;
  scope_id: string;
  title: string;
  priority_level: RuntimePriorityLevel;
  rationale: string;
  related_task_refs?: string[];
  evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimeReviewSummary = {
  review_id: string;
  scope_id: string;
  title: string;
  status: string;
  review_kind?: string;
  review_summary?: string;
  evidence_gap_summary?: string;
  evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimeTaskSummary = {
  task_id: string;
  scope_id: string;
  title: string;
  status: string;
  task_kind?: string;
  related_artifact_refs?: string[];
  evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimeArtifactSummary = {
  artifact_id: string;
  scope_id: string;
  artifact_kind: string;
  title: string;
  status: string;
  artifact_class: RuntimeArtifactClass;
  source_refs: string[];
  evidence_refs: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
  updated_at?: string;
};

export type RuntimeActionSummary = {
  action_id: string;
  scope_id: string;
  title: string;
  action_class: RuntimeActionClass;
  readiness_status: RuntimeActionReadinessStatus;
  requires_confirmation: boolean;
  blocked: boolean;
  reason: string;
  evidence_refs: string[];
  related_task_refs: string[];
  related_artifact_refs: string[];
  risk_notes: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type PreferenceSuggestion = {
  preference_suggestion_id: string;
  project_id: string;
  scope_id: string;
  scope_kind: RuntimeScopeKind;
  summary: string;
  application_scope: RuntimeLearningApplicationScope;
  status: RuntimeScopedLearningStatus;
  evidence_refs?: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type LearningScope = {
  scope_id: string;
  scope_kind: RuntimeScopeKind;
};

export type ScopedLearningCandidate = {
  learning_candidate_id: string;
  project_id: string;
  learning_scope: LearningScope;
  application_scope: RuntimeLearningApplicationScope;
  status: RuntimeScopedLearningStatus;
  candidate_kind: string;
  candidate_summary: string;
  evidence_refs: string[];
  source_refs: string[];
  preference_suggestion?: PreferenceSuggestion;
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimeLearningSummary = {
  learning_summary_id: string;
  project_id: string;
  scope_id: string;
  scope_kind: RuntimeScopeKind;
  active_candidates: ScopedLearningCandidate[];
  global_candidate_summaries: ScopedLearningCandidate[];
  inactive_candidates: ScopedLearningCandidate[];
  preference_suggestions: PreferenceSuggestion[];
  active_candidate_count: number;
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimeDriftImpactSummary = {
  drift_summary_id: string;
  project_id: string;
  scope_id: string;
  drift_kind: string;
  affected_scope_refs: string[];
  affected_artifact_refs: string[];
  impact_summary: string;
  recommendation: RuntimeContinuationRecommendation;
  evidence_refs: string[];
  confidence_posture?: "bounded" | "insufficient" | "stale";
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type RuntimeSuggestedNextAction = {
  action_id: string;
  project_id: string;
  scope_id: string;
  title: string;
  rationale: string;
  action_class: RuntimeActionClass;
  readiness_status: RuntimeActionReadinessStatus;
  evidence_refs: string[];
  related_task_refs: string[];
  related_artifact_refs: string[];
  runtime_private_fields_omitted: true;
  created_at: string;
};

export type OperationalUnitRuntimeProjection = {
  operational_unit_id: string;
  project_id: string;
  scope_summary: RuntimeScopeSummary;
  status: string;
  priority_summaries: RuntimePrioritySummary[];
  pending_review_summaries: RuntimeReviewSummary[];
  recent_artifact_summaries: RuntimeArtifactSummary[];
  task_summaries: RuntimeTaskSummary[];
  action_summaries: RuntimeActionSummary[];
  learning_summaries: RuntimeLearningSummary[];
  drift_summaries: RuntimeDriftImpactSummary[];
  suggested_next_actions: RuntimeSuggestedNextAction[];
  evidence_refs: string[];
  runtime_private_fields_omitted: true;
  non_executing: true;
  created_at: string;
};

export type RuntimeStateProjection = {
  state_projection_id: string;
  project_id: string;
  operational_unit_projections: OperationalUnitRuntimeProjection[];
  evidence_refs: string[];
  runtime_private_fields_omitted: true;
  non_executing: true;
  created_at: string;
};

export type CreateRuntimeScopeSummaryInput = {
  scope_id: string;
  scope_kind: RuntimeScopeKind;
  status: string;
  title: string;
  summary?: string;
  evidence_refs?: string[];
};

export type CreateRuntimePrioritySummaryInput = {
  priority_id?: string;
  scope_id: string;
  title: string;
  priority_level: RuntimePriorityLevel;
  rationale: string;
  related_task_refs?: string[];
  evidence_refs?: string[];
  created_at?: string;
};

export type CreateRuntimeReviewSummaryInput = {
  review_id?: string;
  scope_id: string;
  title: string;
  status: string;
  review_kind?: string;
  review_summary?: string;
  evidence_gap_summary?: string;
  evidence_refs?: string[];
  created_at?: string;
};

export type CreateRuntimeTaskSummaryInput = {
  task_id?: string;
  scope_id: string;
  title: string;
  status: string;
  task_kind?: string;
  related_artifact_refs?: string[];
  evidence_refs?: string[];
  created_at?: string;
};

export type CreateRuntimeArtifactSummaryInput = {
  artifact_id: string;
  scope_id: string;
  artifact_kind: string;
  title: string;
  status: string;
  artifact_class: RuntimeArtifactClass;
  source_refs?: string[];
  evidence_refs?: string[];
  created_at?: string;
  updated_at?: string;
};

export type CreateRuntimeActionSummaryInput = {
  action_id?: string;
  scope_id: string;
  title: string;
  action_class: RuntimeActionClass;
  readiness_status: RuntimeActionReadinessStatus;
  requires_confirmation: boolean;
  blocked: boolean;
  reason: string;
  evidence_refs?: string[];
  related_task_refs?: string[];
  related_artifact_refs?: string[];
  risk_notes?: string[];
  created_at?: string;
};

export type CreatePreferenceSuggestionInput = {
  preference_suggestion_id?: string;
  project_id: string;
  scope_id: string;
  scope_kind: RuntimeScopeKind;
  summary: string;
  application_scope: RuntimeLearningApplicationScope;
  status: RuntimeScopedLearningStatus;
  evidence_refs?: string[];
  created_at?: string;
};

export type CreateScopedLearningCandidateInput = {
  learning_candidate_id?: string;
  project_id: string;
  learning_scope: LearningScope;
  application_scope: RuntimeLearningApplicationScope;
  status: RuntimeScopedLearningStatus;
  candidate_kind: string;
  candidate_summary: string;
  evidence_refs?: string[];
  source_refs?: string[];
  preference_suggestion?: PreferenceSuggestion;
  created_at?: string;
};

export type CreateRuntimeLearningSummaryInput = {
  learning_summary_id?: string;
  project_id: string;
  scope_id: string;
  scope_kind: RuntimeScopeKind;
  learning_candidates?: ScopedLearningCandidate[];
  preference_suggestions?: PreferenceSuggestion[];
  created_at?: string;
};

export type CreateRuntimeDriftImpactSummaryInput = {
  drift_summary_id?: string;
  project_id: string;
  scope_id: string;
  drift_kind: string;
  affected_scope_refs?: string[];
  affected_artifact_refs?: string[];
  impact_summary: string;
  contradiction_detected?: boolean;
  stale_context?: boolean;
  branch_recommended?: boolean;
  blocked?: boolean;
  evidence_refs?: string[];
  confidence_posture?: "bounded" | "insufficient" | "stale";
  created_at?: string;
};

export type CreateRuntimeSuggestedNextActionInput = {
  action_id?: string;
  project_id: string;
  scope_id: string;
  title: string;
  rationale: string;
  action_class: RuntimeActionClass;
  readiness_status?: RuntimeActionReadinessStatus;
  requires_confirmation?: boolean;
  blocked?: boolean;
  evidence_refs?: string[];
  related_task_refs?: string[];
  related_artifact_refs?: string[];
  created_at?: string;
};

export type CreateOperationalUnitRuntimeProjectionInput = {
  operational_unit_id?: string;
  project_id: string;
  scope_summary: RuntimeScopeSummary;
  priority_summaries?: RuntimePrioritySummary[];
  pending_review_summaries?: RuntimeReviewSummary[];
  recent_artifact_summaries?: RuntimeArtifactSummary[];
  task_summaries?: RuntimeTaskSummary[];
  action_summaries?: RuntimeActionSummary[];
  learning_summaries?: RuntimeLearningSummary[];
  drift_summaries?: RuntimeDriftImpactSummary[];
  suggested_next_actions?: RuntimeSuggestedNextAction[];
  evidence_refs?: string[];
  created_at?: string;
};

export type CreateRuntimeStateProjectionInput = {
  state_projection_id?: string;
  project_id: string;
  operational_unit_projections: OperationalUnitRuntimeProjection[];
  evidence_refs?: string[];
  created_at?: string;
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
