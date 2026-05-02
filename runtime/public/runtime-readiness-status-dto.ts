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

export type RuntimeActionClassDto =
  | "auto_local"
  | "reviewable_local"
  | "external_draft"
  | "limited_external_deferred"
  | "forbidden_irreversible";

export type RuntimeReadinessStatusValueDto =
  | "not_evaluated"
  | "review_ready"
  | "blocked"
  | "deferred"
  | "unsupported";

export type RuntimeArtifactClassDto =
  | "none"
  | "local_draft"
  | "review_packet"
  | "evidence_summary"
  | "external_draft";

export type RuntimeLearningStatusDto =
  | "not_applicable"
  | "candidate"
  | "same_scope_recalled"
  | "rejected"
  | "blocked";

export type RuntimeContinuationPostureDto =
  | "continue"
  | "review_before_continue"
  | "clarify"
  | "blocked"
  | "not_applicable";

export type RuntimeReadinessBoundaryProfile = {
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

export type RuntimeActionStatusDto = {
  action_status_id: string;
  action_class: RuntimeActionClassDto;
  readiness_status: RuntimeReadinessStatusValueDto;
  artifact_class: RuntimeArtifactClassDto;
  learning_status: RuntimeLearningStatusDto;
  continuation_posture: RuntimeContinuationPostureDto;
  requested_action_summary?: string;
  interpretation: {
    readiness_meaning: "review/projection posture only";
    execution_authority: "not execution authority";
    dispatch_permission: "not dispatch permission";
  };
  safe_evidence_refs?: readonly RuntimePublicSurfaceEvidenceRefDto[];
};

export type RuntimeReadinessStatusDto = {
  readiness_status_id: string;
  contract_version: RuntimePublicSurfaceContractVersion;
  runtime_contract_version: RuntimePublicSurfaceRuntimeContractVersion;
  compatibility_profile: RuntimePublicSurfaceCompatibilityProfile;
  source_runtime_surface_ref: string;
  source_commit_ref: string;
  action_class: RuntimeActionClassDto;
  readiness_status: RuntimeReadinessStatusValueDto;
  artifact_class: RuntimeArtifactClassDto;
  learning_status: RuntimeLearningStatusDto;
  continuation_posture: RuntimeContinuationPostureDto;
  interpretation: {
    readiness_meaning: "review/projection posture only";
    execution_authority: "not execution authority";
    dispatch_permission: "not dispatch permission";
    provider_or_channel_execution: "not provider or channel execution";
  };
  version_refs: RuntimePublicSurfaceVersionRefs;
  omission_markers: readonly RuntimePublicSurfaceOmissionMarkerDto[];
  safe_evidence_refs?: readonly RuntimePublicSurfaceEvidenceRefDto[];
  runtime_private_fields_omitted: true;
  boundary_flags: RuntimeReadinessBoundaryProfile;
};
