import type { ProjectionSafeEnvelope } from "./projection-safe-envelope.ts";

export const operator_workspace_status = [
  "draft",
  "active",
  "blocked",
  "archived",
] as const;

export const operator_session_status = [
  "draft",
  "review_ready",
  "blocked",
  "archived",
] as const;

export const review_loop_status = [
  "draft",
  "review_running",
  "review_ready",
  "blocked",
  "closed",
] as const;

export const review_step_status = [
  "pending",
  "reviewed",
  "skipped",
  "blocked",
] as const;

export const evidence_bundle_kind = [
  "in_memory_evidence_bundle",
  "deterministic_summary_bundle",
  "audit_snapshot_bundle",
] as const;

export type OperatorWorkspaceStatus =
  typeof operator_workspace_status[number];
export type OperatorSessionStatus = typeof operator_session_status[number];
export type ReviewLoopStatus = typeof review_loop_status[number];
export type ReviewStepStatus = typeof review_step_status[number];
export type EvidenceBundleKind = typeof evidence_bundle_kind[number];

export type RuntimeBoundaryProfile = {
  local_only: true;
  manual_first: true;
  review_only: true;
  deterministic: true;
  non_executing: true;
  runtime_private_payload_omitted: true;
  projection_safe: true;
  no_external_service: true;
  no_filesystem_write: true;
  no_database_storage: true;
  no_persistence_adapter: true;
  no_file_export_path: true;
  no_cloud_sync: true;
  no_provider_dispatch: true;
  no_channel_dispatch: true;
  no_marketplace: true;
  no_crm: true;
  no_email_dispatch: true;
  no_public_publishing: true;
  no_payment: true;
  no_llm_or_tool_invocation: true;
  no_autonomy: true;
  no_package_publish: true;
  no_certification_or_endorsement: true;
};

export type ProjectionSafeHandoffEnvelope = ProjectionSafeEnvelope;

export type ReviewStepRef = {
  step_ref: string;
  status: ReviewStepStatus;
};

export type OperatorWorkspace = {
  workspace_id: string;
  status: OperatorWorkspaceStatus;
  session_refs: string[];
  state_snapshot_ref: string;
  evidence_refs: string[];
  boundary_profile: RuntimeBoundaryProfile;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type OperatorSession = {
  session_id: string;
  status: OperatorSessionStatus;
  workspace_ref: string;
  review_loop_ref: string;
  evidence_refs: string[];
  boundary_profile: RuntimeBoundaryProfile;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type ReviewLoopState = {
  loop_state_id: string;
  status: ReviewLoopStatus;
  workspace_ref: string;
  session_ref: string;
  reviewed_step_refs: string[];
  blocked_step_refs: string[];
  evidence_refs: string[];
  boundary_profile: RuntimeBoundaryProfile;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type OperatorEntrySurface = {
  entry_surface_id: string;
  status: OperatorSessionStatus;
  workspace_ref: string;
  session_ref: string;
  allowed_manual_actions: string[];
  boundary_profile: RuntimeBoundaryProfile;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type ReviewLoopRunner = {
  runner_id: string;
  status: ReviewLoopStatus;
  loop_state_ref: string;
  step_refs: ReviewStepRef[];
  boundary_profile: RuntimeBoundaryProfile;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type OperatorReviewPacket = {
  packet_id: string;
  status: OperatorSessionStatus;
  loop_state_ref: string;
  reviewed_step_refs: string[];
  blocked_step_refs: string[];
  manual_decision_options: string[];
  evidence_refs: string[];
  boundary_profile: RuntimeBoundaryProfile;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type SessionEvidenceLedger = {
  ledger_id: string;
  status: OperatorWorkspaceStatus;
  session_ref: string;
  entry_refs: string[];
  latest_packet_ref: string;
  latest_bundle_ref: string;
  boundary_profile: RuntimeBoundaryProfile;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type DeterministicEvidenceBundle = {
  bundle_id: string;
  bundle_kind: EvidenceBundleKind;
  status: OperatorSessionStatus;
  ledger_ref: string;
  packet_ref: string;
  evidence_refs: string[];
  summary: string;
  boundary_profile: RuntimeBoundaryProfile;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type LocalReviewLoopResult = {
  result_id: string;
  workspace: OperatorWorkspace;
  session: OperatorSession;
  loop_state: ReviewLoopState;
  runner: ReviewLoopRunner;
  review_packet: OperatorReviewPacket;
  evidence_ledger: SessionEvidenceLedger;
  evidence_bundle: DeterministicEvidenceBundle;
  projection_handoff: ProjectionSafeHandoffEnvelope;
  boundary_profile: RuntimeBoundaryProfile;
  runtime_private_fields_omitted: true;
  non_executing: true;
};
