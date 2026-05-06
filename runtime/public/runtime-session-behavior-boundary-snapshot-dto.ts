// Type-only runtime/public DTO contract.
// No runtime behavior.
// No constructor exposure.
// No service instance exposure.
// No mutable state exposure.
// No storage write authority.
// No mutation writeback authority.
// No provider, channel, or tool dispatch.
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
    | "runtime_readiness"
    | "runtime_projection"
    | "runtime_execution_event"
    | "runtime_objective_continuity"
    | "state_port"
    | "persistence_roundtrip"
    | "runtime_session"
    | "worker_lifecycle"
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

export type RuntimeSessionBehaviorBoundarySessionPostureDto =
  | "available"
  | "summary_only"
  | "deferred"
  | "blocked"
  | "unsupported"
  | "unknown";

export type RuntimeSessionBehaviorBoundaryConstructionPostureDto =
  | "created_observed"
  | "deferred"
  | "blocked"
  | "not_evaluated"
  | "unsupported";

export type RuntimeSessionDependencyFamilyPostureDto = {
  dependency_family_ref: string;
  dependency_family:
    | "state"
    | "memory"
    | "learning"
    | "objective"
    | "dispatch"
    | "lifecycle"
    | "projection"
    | "observability";
  dependency_posture:
    | "configured"
    | "summary_only"
    | "evidence_only"
    | "omitted"
    | "blocked"
    | "deferred"
    | "unsupported"
    | "unknown";
  summary: string;
  runtime_private_fields_omitted: true;
};

export type RuntimeSessionStateModePostureDto = {
  state_mode_ref: string;
  state_mode: "memory" | "persisted" | "unavailable" | "degraded" | "unknown";
  state_mode_posture:
    | "configured"
    | "summary_only"
    | "evidence_only"
    | "blocked"
    | "deferred"
    | "unsupported"
    | "unknown";
  summary: string;
  runtime_private_fields_omitted: true;
};

export type RuntimeSessionBehaviorBoundaryProfile = {
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
  no_storage_write_authority: true;
  no_mutation_writeback_authority: true;
  no_provider_dispatch: true;
  no_channel_dispatch: true;
  no_tool_invocation: true;
};

export type RuntimeSessionBehaviorBoundarySnapshotDto = {
  runtime_session_behavior_boundary_snapshot_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  session_posture: RuntimeSessionBehaviorBoundarySessionPostureDto;
  construction_boundary_posture: RuntimeSessionBehaviorBoundaryConstructionPostureDto;
  dependency_family_posture: readonly RuntimeSessionDependencyFamilyPostureDto[];
  state_mode_posture: RuntimeSessionStateModePostureDto;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  omission_markers: readonly RuntimePublicSurfaceOmissionMarkerDto[];
  boundary_flags: RuntimeSessionBehaviorBoundaryProfile;
  version_refs: RuntimePublicSurfaceVersionRefs;
  future_parity_hints: readonly RuntimePublicSurfaceFutureParityHintDto[];
  runtime_private_fields_omitted: true;
};
