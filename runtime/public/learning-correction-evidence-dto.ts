// DTO/evidence implementation only.
// Not package-exported yet.
// No runtime behavior.
// No storage write.
// No mutation writeback.
// No dispatch authority.
// No package publication.

export type RuntimePublicSurfaceContractVersion = string;

export type RuntimePublicSurfaceRuntimeContractVersion = string;

export type RuntimePublicSurfaceCompatibilityProfile = string;

export type RuntimePublicSurfaceVersionRefDto = {
  ref_kind: "protocol" | "binding" | "runtime" | "contract" | "bundle";
  ref_id: string;
  ref_version: string;
};

export type RuntimePublicSurfaceVersionRefs = {
  protocol_version_refs: readonly RuntimePublicSurfaceVersionRefDto[];
  binding_version_refs: readonly RuntimePublicSurfaceVersionRefDto[];
  runtime_version_refs: readonly RuntimePublicSurfaceVersionRefDto[];
  contract_version_refs?: readonly RuntimePublicSurfaceVersionRefDto[];
  bundle_version_refs?: readonly RuntimePublicSurfaceVersionRefDto[];
};

export type RuntimePublicSurfaceEvidenceRefDto = {
  evidence_ref: string;
  evidence_kind?: string;
  summary?: string;
};

export type RuntimePublicSurfaceOmissionMarkerDto = {
  marker: string;
  reason: string;
};

export type LearningCorrectionCaptureDto = {
  capture_ref: string;
  capture_status: "not_evaluated" | "captured" | "blocked" | "deferred";
  capture_summary: string;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  runtime_private_fields_omitted: true;
};

export type LearningCorrectionOutcomeDto = {
  outcome_ref: string;
  outcome_status: "summary_only" | "evidence_only" | "blocked" | "deferred";
  correction_summary: string;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  runtime_private_fields_omitted: true;
};

export type LearningCorrectionBoundaryProfile = {
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  evidence_safe: true;
  runtime_private_payload_omitted: true;
  non_executing: true;
  no_mutation_writeback: true;
  no_training_authority: true;
  no_package_publish: true;
  no_certification_or_endorsement: true;
};

export type LearningCorrectionEvidenceDto = {
  learning_correction_evidence_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  capture_status: LearningCorrectionCaptureDto["capture_status"];
  capture_summary: string;
  correction_summary: string;
  capture: LearningCorrectionCaptureDto;
  outcome: LearningCorrectionOutcomeDto;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  version_refs: RuntimePublicSurfaceVersionRefs;
  omission_markers: readonly RuntimePublicSurfaceOmissionMarkerDto[];
  runtime_private_fields_omitted: true;
  boundary_flags: LearningCorrectionBoundaryProfile;
};
