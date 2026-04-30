export type ProjectionSafeContractVersion = string;

export type ProjectionBundleVersion = string;

export type RuntimeContractVersion = string;

export type CompatibilityProfile = string;

export type ProjectionSafeDeprecationPolicyRef = string;

export type ProjectionSafeVersionRefDto = {
  ref_kind: "protocol" | "binding" | "runtime" | "contract" | "bundle";
  ref_id: string;
  ref_version: string;
};

export type ProjectionSafeVersionRefs = {
  protocol_version_refs: ProjectionSafeVersionRefDto[];
  binding_version_refs: ProjectionSafeVersionRefDto[];
  runtime_version_refs: ProjectionSafeVersionRefDto[];
  contract_version_refs?: ProjectionSafeVersionRefDto[];
  bundle_version_refs?: ProjectionSafeVersionRefDto[];
};

export type ProjectionSafeOmissionMarker = {
  marker: string;
  reason: string;
};

export type ProjectionSafeEvidenceRef = {
  evidence_ref: string;
  evidence_kind?: string;
  summary?: string;
};

export type ProjectionSafeValidationSummary = {
  validation_summary_id: string;
  validation_status: "valid" | "blocked" | "invalid";
  validation_notes: string[];
  missing_required_refs: string[];
  boundary_flags_verified: true;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type ProjectionSafeDtoMetadata = {
  contract_version: ProjectionSafeContractVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
};

export type ProjectionSafeBundleMetadata = {
  bundle_id: string;
  projection_bundle_version: ProjectionBundleVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  generated_from_runtime_surface_ref: string;
  source_commit_ref: string;
  minimum_runtime_surface_ref?: string;
  generation_ref?: string;
  schema_profile_ref?: string;
  boundary_profile_ref?: string;
  deprecation_policy_ref?: ProjectionSafeDeprecationPolicyRef;
};

export type OperatorWorkspaceStatusDto =
  | "draft"
  | "active"
  | "blocked"
  | "archived";

export type OperatorSessionStatusDto =
  | "draft"
  | "review_ready"
  | "blocked"
  | "archived";

export type ReviewLoopStatusDto =
  | "draft"
  | "review_running"
  | "review_ready"
  | "blocked"
  | "closed";

export type ReviewStepStatusDto =
  | "pending"
  | "reviewed"
  | "skipped"
  | "blocked";

export type EvidenceBundleKindDto =
  | "in_memory_evidence_bundle"
  | "deterministic_summary_bundle"
  | "audit_snapshot_bundle";

export type RuntimeBoundaryProfileDto = {
  contract_version: ProjectionSafeContractVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
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
  boundary_profile_ref?: string;
};

export type OperatorWorkspaceDto = {
  contract_version: ProjectionSafeContractVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  workspace_id: string;
  status: OperatorWorkspaceStatusDto;
  session_refs: string[];
  state_snapshot_ref: string;
  evidence_refs: string[];
  boundary_profile: RuntimeBoundaryProfileDto;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type OperatorSessionDto = {
  contract_version: ProjectionSafeContractVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  session_id: string;
  status: OperatorSessionStatusDto;
  workspace_ref: string;
  review_loop_ref: string;
  evidence_refs: string[];
  boundary_profile: RuntimeBoundaryProfileDto;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type ReviewStepRefDto = {
  step_ref: string;
  status: ReviewStepStatusDto;
};

export type ReviewLoopStateDto = {
  contract_version: ProjectionSafeContractVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  loop_state_id: string;
  status: ReviewLoopStatusDto;
  workspace_ref: string;
  session_ref: string;
  reviewed_step_refs: string[];
  blocked_step_refs: string[];
  evidence_refs: string[];
  boundary_profile: RuntimeBoundaryProfileDto;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type OperatorReviewPacketDto = {
  contract_version: ProjectionSafeContractVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  packet_id: string;
  status: OperatorSessionStatusDto;
  loop_state_ref: string;
  reviewed_step_refs: string[];
  blocked_step_refs: string[];
  manual_decision_options: string[];
  evidence_refs: string[];
  boundary_profile: RuntimeBoundaryProfileDto;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type SessionEvidenceLedgerDto = {
  contract_version: ProjectionSafeContractVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  ledger_id: string;
  status: OperatorWorkspaceStatusDto;
  session_ref: string;
  entry_refs: string[];
  latest_packet_ref: string;
  latest_bundle_ref: string;
  boundary_profile: RuntimeBoundaryProfileDto;
  projection_envelope_ref: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type DeterministicEvidenceBundleDto = {
  contract_version: ProjectionSafeContractVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  bundle_id: string;
  bundle_kind: EvidenceBundleKindDto;
  status: OperatorSessionStatusDto;
  ledger_ref: string;
  packet_ref: string;
  evidence_refs: string[];
  summary: string;
  boundary_profile: RuntimeBoundaryProfileDto;
  projection_envelope_ref: string;
  projection_bundle_version?: ProjectionBundleVersion;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type ProjectionBindingPostureRefDto = {
  source_object_ref: string;
  core_object_ref: string;
  protocol_object_ref: string | null;
  semantic_binding_posture: string;
  exportability: {
    export_class: string;
    export_allowed: boolean;
    reconstruction_expectation: string;
  };
  safe_summary: string;
  omission_markers: string[];
  protocol_binding_ref_present: boolean;
  runtime_private_fields_omitted: true;
};

export type ModulePostureSummaryDto = {
  module_id: string;
  module_name: string;
  realization_status: string;
  blocking_for_projection: boolean;
  projection_safe_exposure: string;
  evidence_posture: string;
  boundary_rule: string;
};

export type DutyPostureSummaryDto = {
  duty_id: string;
  duty_name: string;
  duty_slug: string;
  realization_status: string;
  blocking_for_projection: boolean;
  projection_safe_exposure: string;
  evidence_posture: string;
  boundary_rule: string;
};

export type ProjectionSafeEnvelopeDto = {
  contract_version: ProjectionSafeContractVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  projection_envelope_id: string;
  projection_envelope_version: string;
  source_runtime_object_refs: string[];
  object_export_binding_posture_refs: ProjectionBindingPostureRefDto[];
  module_posture_summary: ModulePostureSummaryDto[];
  duty_posture_summary: DutyPostureSummaryDto[];
  safe_evidence_refs: ProjectionSafeEvidenceRef[];
  omission_markers: ProjectionSafeOmissionMarker[];
  version_refs: ProjectionSafeVersionRefs;
  boundary_notices: string[];
  projection_bundle_version?: ProjectionBundleVersion;
  schema_profile_ref?: string;
  boundary_profile_ref?: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
  created_at: string;
};

export type LocalReviewLoopResultDto = {
  contract_version: ProjectionSafeContractVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  result_id: string;
  workspace: OperatorWorkspaceDto;
  session: OperatorSessionDto;
  review_loop_state: ReviewLoopStateDto;
  review_packet: OperatorReviewPacketDto;
  evidence_ledger: SessionEvidenceLedgerDto;
  evidence_bundle: DeterministicEvidenceBundleDto;
  projection_handoff: ProjectionSafeEnvelopeDto;
  boundary_profile: RuntimeBoundaryProfileDto;
  projection_bundle_version?: ProjectionBundleVersion;
  source_commit_ref?: string;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type ProjectionSafeOperatorReviewLoopHandoffDto = {
  bundle_id: string;
  projection_bundle_version: ProjectionBundleVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  generated_from_runtime_surface_ref: string;
  source_commit_ref: string;
  minimum_runtime_surface_ref?: string;
  generation_ref?: string;
  schema_profile_ref?: string;
  boundary_profile_ref?: string;
  deprecation_policy_ref?: ProjectionSafeDeprecationPolicyRef;
  operator_workspace: OperatorWorkspaceDto;
  operator_session: OperatorSessionDto;
  review_loop_state: ReviewLoopStateDto;
  operator_review_packet: OperatorReviewPacketDto;
  session_evidence_ledger: SessionEvidenceLedgerDto;
  deterministic_evidence_bundle: DeterministicEvidenceBundleDto;
  runtime_boundary_profile: RuntimeBoundaryProfileDto;
  local_review_loop_result: LocalReviewLoopResultDto;
  projection_safe_envelope: ProjectionSafeEnvelopeDto;
  omission_markers: ProjectionSafeOmissionMarker[];
  safe_evidence_refs: ProjectionSafeEvidenceRef[];
  version_refs: ProjectionSafeVersionRefs;
  validation_summary: ProjectionSafeValidationSummary;
  runtime_private_fields_omitted: true;
  non_executing: true;
};
