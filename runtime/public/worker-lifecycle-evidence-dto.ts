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

export type WorkerLifecycleTransitionEvidencePostureDto =
  | "not_evaluated"
  | "evidence_only"
  | "observed"
  | "blocked"
  | "deferred"
  | "unsupported";

export type WorkerLifecycleObservationOutcomeDto = {
  outcome_ref: string;
  outcome_posture:
    | "observed"
    | "accepted"
    | "rejected"
    | "blocked"
    | "deferred"
    | "not_applicable";
  outcome_summary: string;
  runtime_private_fields_omitted: true;
};

export type WorkerLifecycleStateRefDto = {
  state_ref: string;
  state_family?: string;
  summary?: string;
  runtime_private_fields_omitted: true;
};

export type WorkerLifecycleEvidenceBoundaryProfile = {
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

export type WorkerLifecycleEvidenceDto = {
  worker_lifecycle_evidence_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  transition_evidence_posture: WorkerLifecycleTransitionEvidencePostureDto;
  observed_state_ref: WorkerLifecycleStateRefDto;
  target_state_ref?: WorkerLifecycleStateRefDto;
  outcome_summary: WorkerLifecycleObservationOutcomeDto;
  first_wave_refs: readonly RuntimePublicSurfaceWaveRefDto[];
  second_wave_refs: readonly RuntimePublicSurfaceWaveRefDto[];
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  version_refs: RuntimePublicSurfaceVersionRefs;
  omission_markers: readonly RuntimePublicSurfaceOmissionMarkerDto[];
  runtime_private_fields_omitted: true;
  boundary_flags: WorkerLifecycleEvidenceBoundaryProfile;
};
