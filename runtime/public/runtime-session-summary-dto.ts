// DTO/evidence implementation only.
// Not package-exported yet.
// No runtime behavior.
// No constructor exposure.
// No service instance exposure.
// No mutable state exposure.
// No lifecycle transition authority.
// No storage write.
// No mutation writeback.
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

export type RuntimePublicSurfaceWaveRefDto = {
  surface_ref: string;
  surface_kind?: string;
  evidence_ref?: string;
  summary?: string;
};

export type RuntimePublicSurfaceOmissionMarkerDto = {
  marker: string;
  reason: string;
};

export type RuntimeSessionPostureDto =
  | "not_evaluated"
  | "summary_only"
  | "configured"
  | "blocked"
  | "deferred"
  | "unsupported";

export type RuntimeSessionCapabilityPostureDto =
  | "available"
  | "summary_only"
  | "evidence_only"
  | "blocked"
  | "deferred"
  | "unsupported";

export type RuntimeSessionStepFamilyCoverageDto = {
  step_family_ref: string;
  step_family_posture:
    | "covered"
    | "partially_covered"
    | "not_covered"
    | "deferred";
  summary: string;
  runtime_private_fields_omitted: true;
};

export type RuntimeSessionCapabilitySummaryDto = {
  capability_summary_ref: string;
  capability_family:
    | "readiness"
    | "projection"
    | "bounded_event"
    | "objective_continuity"
    | "state_port"
    | "persistence"
    | "memory_preference"
    | "learning_correction"
    | "action_request"
    | "dispatch_boundary"
    | "worker_lifecycle";
  capability_posture: RuntimeSessionCapabilityPostureDto;
  summary: string;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  runtime_private_fields_omitted: true;
};

export type RuntimeSessionBoundaryProfile = {
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  projection_safe: true;
  evidence_safe: true;
  runtime_private_payload_omitted: true;
  non_executing: true;
  no_constructor_exposure: true;
  no_service_instance_exposure: true;
  no_mutable_state_exposure: true;
  no_lifecycle_transition_authority: true;
  no_storage_write: true;
  no_mutation_writeback: true;
  no_training_authority: true;
  no_provider_dispatch: true;
  no_channel_dispatch: true;
  no_tool_invocation: true;
  no_package_publish: true;
  no_certification_or_endorsement: true;
};

export type RuntimeSessionSummaryDto = {
  runtime_session_summary_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  session_posture: RuntimeSessionPostureDto;
  configured_capability_summaries: readonly RuntimeSessionCapabilitySummaryDto[];
  step_family_coverage_summary: readonly RuntimeSessionStepFamilyCoverageDto[];
  first_wave_refs: readonly RuntimePublicSurfaceWaveRefDto[];
  second_wave_refs: readonly RuntimePublicSurfaceWaveRefDto[];
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  version_refs: RuntimePublicSurfaceVersionRefs;
  omission_markers: readonly RuntimePublicSurfaceOmissionMarkerDto[];
  runtime_private_fields_omitted: true;
  boundary_flags: RuntimeSessionBoundaryProfile;
};
