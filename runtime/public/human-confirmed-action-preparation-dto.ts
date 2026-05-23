// DTO/projection contract only.
// No runtime behavior.
// No provider, model, tool, worker, publishing, payment, outreach, mutation,
// acceptance, training, writeback, or execution authority.

export type HumanConfirmedActionPreparationActionKind =
  | "review_decision"
  | "draft_message"
  | "draft_content"
  | "prepare_change"
  | "prepare_export"
  | "prepare_internal_handoff"
  | "other";

export type HumanConfirmedActionPreparationState =
  | "prepared"
  | "needs_human_review"
  | "confirmed_by_human"
  | "rejected_by_human"
  | "revised_by_human"
  | "parked"
  | "expired";

export type HumanConfirmedActionPreparationEvidenceRef = {
  evidence_ref: string;
  evidence_kind?: string;
  summary?: string;
  ref_only: true;
  runtime_private_payload_omitted: true;
};

export type HumanConfirmedActionPreparationRiskSummary = {
  risk_level: "low" | "medium" | "high" | "unknown";
  summary: string;
  boundary_summary: string;
  mitigations?: readonly string[];
  summary_only: true;
};

export type HumanConfirmedActionPreparationBlockedAction = {
  action:
    | "provider_execution"
    | "model_execution"
    | "tool_execution"
    | "worker_execution"
    | "publishing"
    | "payment"
    | "customer_outreach"
    | "external_action"
    | "automatic_mutation"
    | "autonomous_acceptance"
    | "training"
    | "writeback"
    | "execution_bridge";
  blocked: true;
  reason: string;
};

export type HumanConfirmedActionPreparationOmission = {
  marker: string;
  reason: string;
  runtime_private: true;
};

export type HumanConfirmedActionPreparationConfirmationBoundary = {
  human_final_authority: true;
  explicit_confirmation_required: true;
  confirmation_is_not_execution: true;
  no_autonomous_approval: true;
};

export type HumanConfirmedActionPreparationBoundaryFlags = {
  projection_safe: true;
  summary_only: true;
  non_executing: true;
  evidence_safe: true;
  prepares_action: true;
  executes_action: false;
  authorizes_provider_execution: false;
  authorizes_model_execution: false;
  authorizes_tool_execution: false;
  authorizes_worker_execution: false;
  authorizes_publishing: false;
  authorizes_payment: false;
  authorizes_customer_outreach: false;
  authorizes_external_action: false;
  authorizes_automatic_mutation: false;
  authorizes_autonomous_acceptance: false;
  authorizes_training: false;
  authorizes_writeback: false;
  requires_human_confirmation_before_execution_bridge: true;
};

export type HumanConfirmedActionPreparationStateTransitionRecord = {
  transition_ref: string;
  from_state: HumanConfirmedActionPreparationState;
  to_state: HumanConfirmedActionPreparationState;
  transitioned_by_ref?: string;
  transitioned_at?: string;
  transition_summary?: string;
  confirmation_is_not_execution: true;
  non_executing: true;
};

export type HumanConfirmedActionPreparation = {
  action_preparation_id: string;
  objective_ref: string;
  prepared_action_title: string;
  prepared_action_summary: string;
  action_kind: HumanConfirmedActionPreparationActionKind;
  target_surface_ref: string;
  requested_by_ref: string;
  human_authority_required: true;
  autonomous_execution_authorized: false;
  current_state: HumanConfirmedActionPreparationState;
  confirmation_boundary: HumanConfirmedActionPreparationConfirmationBoundary;
  evidence_refs: readonly HumanConfirmedActionPreparationEvidenceRef[];
  risk_summary: HumanConfirmedActionPreparationRiskSummary;
  expected_outcome: string;
  allowed_next_states: readonly HumanConfirmedActionPreparationState[];
  blocked_actions: readonly HumanConfirmedActionPreparationBlockedAction[];
  omissions: readonly HumanConfirmedActionPreparationOmission[];
  boundary_flags: HumanConfirmedActionPreparationBoundaryFlags;
  state_transition_record: readonly HumanConfirmedActionPreparationStateTransitionRecord[];
};
