// Type-only runtime/public DTO contract.
// No runtime behavior.
// No training authority.
// No mutation writeback authority.
// No preference service handle exposure.
// No learning service exposure.
// No correction service instance exposure.
// No package publication.

export type RuntimePublicSurfaceContractVersion = string;

export type RuntimePublicSurfaceRuntimeContractVersion = string;

export type RuntimePublicSurfaceCompatibilityProfile = string;

export type RuntimePublicSurfaceVersionRefDto = {
  ref_kind:
    | "runtime_contract"
    | "public_surface"
    | "package_export_baseline"
    | "governance"
    | "source_commit"
    | "protocol_background";
  ref_id: string;
  ref_version?: string;
};

export type RuntimePublicSurfaceVersionRefs = {
  runtime_contract_refs: readonly RuntimePublicSurfaceVersionRefDto[];
  public_surface_refs: readonly RuntimePublicSurfaceVersionRefDto[];
  package_export_baseline_refs: readonly RuntimePublicSurfaceVersionRefDto[];
  governance_refs: readonly RuntimePublicSurfaceVersionRefDto[];
  source_commit_refs: readonly RuntimePublicSurfaceVersionRefDto[];
  protocol_background_refs?: readonly RuntimePublicSurfaceVersionRefDto[];
};

export type RuntimePublicSurfaceEvidenceRefDto = {
  evidence_ref: string;
  evidence_kind:
    | "learning_correction"
    | "memory_preference"
    | "runtime_objective_continuity"
    | "runtime_projection"
    | "runtime_readiness"
    | "runtime_session"
    | "governance"
    | "test";
  summary?: string;
  source_public_surface_ref?: string;
};

export type RuntimePublicSurfaceOmissionMarkerDto = {
  omitted_family: string;
  omission_reason: string;
  boundary_flag_ref?: string;
};

export type RuntimePublicSurfaceFutureParityHintDto = {
  hint_ref: string;
  hint_kind: "field_presence" | "evidence_link" | "posture_comparison";
  summary: string;
  safe_evidence_ref?: string;
};

export type LearningCorrectionCapturePostureDto = {
  capture_ref: string;
  capture_posture:
    | "captured"
    | "not_captured"
    | "deferred"
    | "blocked"
    | "not_evaluated"
    | "unsupported";
  summary: string;
  runtime_private_fields_omitted: true;
};

export type LearningCorrectionPreferenceEffectPostureDto = {
  preference_effect_ref: string;
  preference_effect_posture:
    | "candidate"
    | "applied_observed"
    | "not_applied"
    | "deferred"
    | "blocked"
    | "unknown";
  summary: string;
  runtime_private_fields_omitted: true;
};

export type LearningCorrectionObjectiveComparisonRefDto = {
  objective_comparison_ref: string;
  comparison_ref_kind:
    | "objective_continuity"
    | "projection_summary"
    | "governance"
    | "test";
  summary?: string;
};

export type LearningCorrectionResultPostureDto = {
  result_ref: string;
  result_posture:
    | "evidence_only"
    | "summary_only"
    | "reviewed"
    | "blocked"
    | "deferred"
    | "unsupported";
  summary: string;
  runtime_private_fields_omitted: true;
};

export type LearningCorrectionBehaviorResultBoundaryProfile = {
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  projection_safe: true;
  evidence_safe: true;
  runtime_private_payload_omitted: true;
  non_executing: true;
  no_authority: true;
  no_constructor_exposure: true;
  no_service_instance_exposure: true;
  no_mutable_state_exposure: true;
  no_training_authority: true;
  no_mutation_writeback_authority: true;
  no_preference_service_handle_exposure: true;
  no_learning_service_exposure: true;
  no_storage_write_authority: true;
};

export type LearningCorrectionBehaviorResultSnapshotDto = {
  learning_correction_behavior_result_snapshot_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  correction_capture_posture: LearningCorrectionCapturePostureDto;
  preference_effect_posture: LearningCorrectionPreferenceEffectPostureDto;
  objective_comparison_refs: readonly LearningCorrectionObjectiveComparisonRefDto[];
  learning_correction_result_posture: LearningCorrectionResultPostureDto;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  omission_markers: readonly RuntimePublicSurfaceOmissionMarkerDto[];
  boundary_flags: LearningCorrectionBehaviorResultBoundaryProfile;
  version_refs: RuntimePublicSurfaceVersionRefs;
  future_parity_hints: readonly RuntimePublicSurfaceFutureParityHintDto[];
  runtime_private_fields_omitted: true;
};
