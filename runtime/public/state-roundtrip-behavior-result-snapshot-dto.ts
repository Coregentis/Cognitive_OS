// Type-only runtime/public DTO contract.
// No runtime behavior.
// No roundtrip execution.
// No reload or rehydration execution.
// No persistence write.
// No storage handle exposure.
// No store adapter exposure.
// No transaction authority.
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
    | "state_port"
    | "persistence_roundtrip"
    | "runtime_session"
    | "runtime_readiness"
    | "runtime_objective_continuity"
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

export type StateRoundtripStateModePostureDto = {
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

export type StateRoundtripResultPostureDto = {
  result_ref: string;
  result_posture:
    | "completed"
    | "blocked"
    | "deferred"
    | "unsupported"
    | "not_evaluated"
    | "degraded";
  result_summary: string;
  runtime_private_fields_omitted: true;
};

export type StateRoundtripPersistencePostureDto = {
  persistence_ref: string;
  persistence_posture:
    | "available"
    | "evidence_only"
    | "degraded"
    | "blocked"
    | "unsupported"
    | "unknown";
  summary: string;
  runtime_private_fields_omitted: true;
};

export type StateRoundtripReloadRehydrationPostureDto = {
  reload_rehydration_ref: string;
  reload_rehydration_posture:
    | "observed"
    | "not_evaluated"
    | "blocked"
    | "degraded"
    | "unsupported";
  summary: string;
  runtime_private_fields_omitted: true;
};

export type StateRoundtripBehaviorResultBoundaryProfile = {
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
  no_sqlite_handle_exposure: true;
  no_store_adapter_exposure: true;
  no_transaction_authority: true;
  no_mutation_writeback_authority: true;
};

export type StateRoundtripBehaviorResultSnapshotDto = {
  state_roundtrip_behavior_result_snapshot_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  state_mode_posture: StateRoundtripStateModePostureDto;
  roundtrip_result_posture: StateRoundtripResultPostureDto;
  persistence_posture: StateRoundtripPersistencePostureDto;
  reload_rehydration_posture: StateRoundtripReloadRehydrationPostureDto;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  omission_markers: readonly RuntimePublicSurfaceOmissionMarkerDto[];
  boundary_flags: StateRoundtripBehaviorResultBoundaryProfile;
  version_refs: RuntimePublicSurfaceVersionRefs;
  future_parity_hints: readonly RuntimePublicSurfaceFutureParityHintDto[];
  runtime_private_fields_omitted: true;
};
