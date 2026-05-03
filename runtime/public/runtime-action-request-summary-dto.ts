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

export type RuntimeActionClassDto =
  | "auto_local"
  | "reviewable_local"
  | "external_draft"
  | "limited_external_deferred"
  | "forbidden_irreversible";

export type RuntimeActionIntentDto = {
  action_intent_ref: string;
  requested_action_summary: string;
  action_class: RuntimeActionClassDto;
  request_posture: "summary_only" | "review_required" | "blocked" | "deferred";
  runtime_private_fields_omitted: true;
};

export type RuntimeActionRequestBoundaryProfile = {
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  evidence_safe: true;
  runtime_private_payload_omitted: true;
  non_executing: true;
  no_provider_dispatch: true;
  no_channel_dispatch: true;
  no_tool_invocation: true;
  no_package_publish: true;
  no_certification_or_endorsement: true;
};

export type RuntimeActionRequestSummaryDto = {
  action_request_summary_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  requested_action_summary: string;
  action_class: RuntimeActionClassDto;
  request_posture: RuntimeActionIntentDto["request_posture"];
  blocked_or_deferred_reason?: string;
  action_intent: RuntimeActionIntentDto;
  safe_evidence_refs: readonly RuntimePublicSurfaceEvidenceRefDto[];
  version_refs: RuntimePublicSurfaceVersionRefs;
  omission_markers: readonly RuntimePublicSurfaceOmissionMarkerDto[];
  runtime_private_fields_omitted: true;
  boundary_flags: RuntimeActionRequestBoundaryProfile;
};
