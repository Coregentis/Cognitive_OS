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

export type RuntimePublicSurfaceOmissionMarkerDto = {
  marker: string;
  reason: string;
};

export type BoundedExecutionEventStatusDto =
  | "recorded"
  | "blocked"
  | "deferred"
  | "unsupported"
  | "failed";

export type BoundedExecutionOutcomeStatusDto =
  | "local_summary_only"
  | "review_required"
  | "blocked"
  | "deferred"
  | "unsupported";

export type BoundedExecutionBlockReasonDto =
  | "policy_boundary"
  | "insufficient_evidence"
  | "external_authority_required"
  | "irreversible_action"
  | "not_supported";

export type BoundedExecutionBoundaryProfile = {
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

export type BoundedExecutionRequestEnvelopeDto = {
  request_envelope_id: string;
  requested_action_summary: string;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  non_executing: true;
  no_provider_dispatch: true;
  no_channel_dispatch: true;
  no_tool_invocation: true;
  runtime_private_fields_omitted: true;
};

export type BoundedExecutionOutcomeDto = {
  dispatch_outcome_id: string;
  outcome_status: BoundedExecutionOutcomeStatusDto;
  outcome_summary: string;
  blocked_or_deferred_reason?: BoundedExecutionBlockReasonDto;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  non_executing: true;
  no_provider_dispatch: true;
  no_channel_dispatch: true;
  no_tool_invocation: true;
  runtime_private_fields_omitted: true;
};

export type BoundedExecutionEventDto = {
  execution_event_id: string;
  request_envelope_id: string;
  dispatch_outcome_id: string;
  event_contract_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  event_status: BoundedExecutionEventStatusDto;
  requested_action_summary: string;
  outcome_summary: string;
  blocked_or_deferred_reason?: BoundedExecutionBlockReasonDto;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  non_executing: true;
  no_provider_dispatch: true;
  no_channel_dispatch: true;
  no_tool_invocation: true;
  version_refs: RuntimePublicSurfaceVersionRefs;
  omission_markers: readonly RuntimePublicSurfaceOmissionMarkerDto[];
  runtime_private_fields_omitted: true;
  boundary_flags: BoundedExecutionBoundaryProfile;
};
