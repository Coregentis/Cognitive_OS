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

export type MemorySummaryDto = {
  memory_summary_ref: string;
  memory_posture_summary: string;
  supported_projection_scopes: readonly string[];
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  runtime_private_fields_omitted: true;
};

export type PreferenceSummaryDto = {
  preference_summary_ref: string;
  preference_posture_summary: string;
  supported_projection_scopes: readonly string[];
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  runtime_private_fields_omitted: true;
};

export type MemoryPreferenceBoundaryProfile = {
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  projection_safe: true;
  evidence_safe: true;
  runtime_private_payload_omitted: true;
  non_executing: true;
  no_storage_write: true;
  no_mutation_writeback: true;
  no_training_authority: true;
  no_package_publish: true;
  no_certification_or_endorsement: true;
};

export type MemoryPreferenceSummaryDto = {
  memory_preference_summary_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  memory_posture_summary: string;
  preference_posture_summary: string;
  supported_projection_scopes: readonly string[];
  memory_summary: MemorySummaryDto;
  preference_summary: PreferenceSummaryDto;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  version_refs: RuntimePublicSurfaceVersionRefs;
  omission_markers: readonly RuntimePublicSurfaceOmissionMarkerDto[];
  runtime_private_fields_omitted: true;
  boundary_flags: MemoryPreferenceBoundaryProfile;
};
