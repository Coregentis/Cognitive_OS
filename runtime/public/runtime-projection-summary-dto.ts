// DTO implementation only.
// Not package-exported yet.
// No runtime behavior.
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

export type RuntimeProjectionOmissionMarkerDto = {
  marker: string;
  reason: string;
};

export type RuntimeProjectionSummaryRefDto = {
  summary_ref: string;
  summary_kind?: string;
};

export type RuntimeProjectionSourceRefDto = {
  source_ref: string;
  source_kind?: string;
};

export type RuntimeProjectionBoundaryProfile = {
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  projection_safe: true;
  runtime_private_payload_omitted: true;
  non_executing: true;
  no_provider_dispatch: true;
  no_channel_dispatch: true;
  no_tool_invocation: true;
  no_package_publish: true;
  no_certification_or_endorsement: true;
};

export type RuntimeStatePostureSummaryDto = {
  state_posture_summary_id: string;
  status: "not_evaluated" | "active" | "blocked" | "deferred" | "archived";
  state_summary: string;
  transition_summary?: string;
  blocked_or_deferred_reason?: string;
  source_refs: readonly RuntimeProjectionSourceRefDto[];
  runtime_private_fields_omitted: true;
};

export type RuntimeOperationalUnitSummaryDto = {
  operational_unit_summary_id: string;
  unit_ref: string;
  unit_summary: string;
  readiness_summary_refs: readonly RuntimeProjectionSummaryRefDto[];
  artifact_summary_refs: readonly RuntimeProjectionSummaryRefDto[];
  learning_summary_refs: readonly RuntimeProjectionSummaryRefDto[];
  continuity_summary_refs: readonly RuntimeProjectionSummaryRefDto[];
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  runtime_private_fields_omitted: true;
};

export type RuntimeProjectionSummaryDto = {
  projection_summary_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  project_scope_ref: string;
  operational_unit_summaries: readonly RuntimeOperationalUnitSummaryDto[];
  state_posture_summary: RuntimeStatePostureSummaryDto;
  readiness_summary_refs: readonly RuntimeProjectionSummaryRefDto[];
  artifact_summary_refs: readonly RuntimeProjectionSummaryRefDto[];
  learning_summary_refs: readonly RuntimeProjectionSummaryRefDto[];
  continuity_summary_refs: readonly RuntimeProjectionSummaryRefDto[];
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  version_refs: RuntimePublicSurfaceVersionRefs;
  omission_markers: readonly RuntimeProjectionOmissionMarkerDto[];
  runtime_private_fields_omitted: true;
  boundary_flags: RuntimeProjectionBoundaryProfile;
};
