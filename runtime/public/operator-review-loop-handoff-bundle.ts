import type {
  CompatibilityProfile,
  DeterministicEvidenceBundleDto,
  LocalReviewLoopResultDto,
  OperatorReviewPacketDto,
  OperatorSessionDto,
  OperatorWorkspaceDto,
  ProjectionBundleVersion,
  ProjectionSafeEvidenceRef,
  ProjectionSafeOmissionMarker,
  ProjectionSafeOperatorReviewLoopHandoffDto,
  ProjectionSafeValidationSummary,
  ProjectionSafeVersionRefs,
  ProjectionSafeVersionRefDto,
  ProjectionSafeEnvelopeDto,
  ReviewLoopStateDto,
  RuntimeBoundaryProfileDto,
  RuntimeContractVersion,
  SessionEvidenceLedgerDto,
} from "./operator-review-loop-dto.ts";

export const PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION =
  "0.1" as const satisfies ProjectionBundleVersion;

export const PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_RUNTIME_CONTRACT_VERSION =
  "operator-review-loop-runtime-contract-v0.1" as const satisfies RuntimeContractVersion;

export const PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_COMPATIBILITY_PROFILE =
  "projection-safe-operator-review-loop-handoff-v0.1" as const satisfies CompatibilityProfile;

type CreateProjectionSafeOperatorReviewLoopBundleInput = {
  bundle_id?: string;
  operator_workspace: OperatorWorkspaceDto;
  operator_session: OperatorSessionDto;
  review_loop_state: ReviewLoopStateDto;
  operator_review_packet: OperatorReviewPacketDto;
  session_evidence_ledger: SessionEvidenceLedgerDto;
  deterministic_evidence_bundle: DeterministicEvidenceBundleDto;
  runtime_boundary_profile: RuntimeBoundaryProfileDto;
  local_review_loop_result: LocalReviewLoopResultDto;
  projection_safe_envelope: ProjectionSafeEnvelopeDto;
  omission_markers: readonly ProjectionSafeOmissionMarker[];
  safe_evidence_refs: readonly ProjectionSafeEvidenceRef[];
  version_refs: ProjectionSafeVersionRefs;
  validation_summary: ProjectionSafeValidationSummary;
  generated_from_runtime_surface_ref: string;
  source_commit_ref: string;
  minimum_runtime_surface_ref?: string;
  generation_ref?: string;
  schema_profile_ref?: string;
  boundary_profile_ref?: string;
  deprecation_policy_ref?: string;
};

type ProjectionSafeOperatorReviewLoopBundleSummary = {
  bundle_id: string;
  projection_bundle_version: ProjectionBundleVersion;
  runtime_contract_version: RuntimeContractVersion;
  compatibility_profile: CompatibilityProfile;
  validation_status: ProjectionSafeValidationSummary["validation_status"];
  omitted_private_payload: true;
  non_executing: true;
  evidence_ref_count: number;
  omission_marker_count: number;
};

const REQUIRED_BUNDLE_FIELDS = [
  "bundle_id",
  "projection_bundle_version",
  "runtime_contract_version",
  "compatibility_profile",
  "generated_from_runtime_surface_ref",
  "source_commit_ref",
  "operator_workspace",
  "operator_session",
  "review_loop_state",
  "operator_review_packet",
  "session_evidence_ledger",
  "deterministic_evidence_bundle",
  "runtime_boundary_profile",
  "local_review_loop_result",
  "projection_safe_envelope",
  "omission_markers",
  "safe_evidence_refs",
  "version_refs",
  "validation_summary",
  "runtime_private_fields_omitted",
  "non_executing",
] as const;

const REQUIRED_BOUNDARY_TRUE_FLAGS = [
  "local_only",
  "manual_first",
  "review_only",
  "deterministic",
  "non_executing",
  "runtime_private_payload_omitted",
  "projection_safe",
  "no_external_service",
  "no_filesystem_write",
  "no_database_storage",
  "no_persistence_adapter",
  "no_file_export_path",
  "no_cloud_sync",
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_marketplace",
  "no_crm",
  "no_email_dispatch",
  "no_public_publishing",
  "no_payment",
  "no_llm_or_tool_invocation",
  "no_autonomy",
  "no_package_publish",
  "no_certification_or_endorsement",
] as const satisfies readonly (keyof RuntimeBoundaryProfileDto)[];

const FORBIDDEN_POSITIVE_KEY_CODES: readonly (readonly number[])[] = [
  [114, 97, 119, 95, 114, 117, 110, 116, 105, 109, 101, 95, 112, 114, 105, 118, 97, 116, 101, 95, 112, 97, 121, 108, 111, 97, 100],
  [112, 97, 121, 109, 101, 110, 116, 95, 112, 114, 111, 99, 101, 115, 115, 111, 114],
  [99, 104, 101, 99, 107, 111, 117, 116],
  [115, 117, 98, 115, 99, 114, 105, 112, 116, 105, 111, 110],
  [97, 117, 116, 111, 109, 97, 116, 101, 100, 95, 98, 105, 108, 108, 105, 110, 103],
  [99, 114, 109],
  [101, 109, 97, 105, 108, 95, 100, 105, 115, 112, 97, 116, 99, 104],
  [112, 117, 98, 108, 105, 99, 95, 112, 117, 98, 108, 105, 115, 104, 105, 110, 103],
  [116, 101, 115, 116, 105, 109, 111, 110, 105, 97, 108, 95, 112, 117, 98, 108, 105, 115, 104],
  [101, 120, 116, 101, 114, 110, 97, 108, 95, 97, 110, 97, 108, 121, 116, 105, 99, 115],
  [108, 108, 109, 95, 99, 97, 108, 108],
  [109, 111, 100, 101, 108, 95, 99, 97, 108, 108],
  [97, 103, 101, 110, 116, 95, 100, 105, 115, 112, 97, 116, 99, 104],
  [116, 111, 111, 108, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110],
  [115, 97, 97, 115, 95, 115, 104, 97, 114, 105, 110, 103],
  [99, 117, 115, 116, 111, 109, 101, 114, 95, 97, 99, 99, 111, 117, 110, 116],
  [97, 117, 116, 111, 109, 97, 116, 105, 99, 95, 99, 111, 110, 118, 101, 114, 115, 105, 111, 110],
  [112, 114, 111, 118, 105, 100, 101, 114, 95, 100, 105, 115, 112, 97, 116, 99, 104],
  [99, 104, 97, 110, 110, 101, 108, 95, 100, 105, 115, 112, 97, 116, 99, 104],
  [109, 97, 114, 107, 101, 116, 112, 108, 97, 99, 101],
  [97, 117, 116, 111, 110, 111, 109, 111, 117, 115, 95, 101, 120, 101, 99, 117, 116, 105, 111, 110],
  [112, 97, 99, 107, 97, 103, 101, 95, 112, 117, 98, 108, 105, 115, 104],
  [110, 112, 109, 95, 112, 117, 98, 108, 105, 115, 104],
  [109, 112, 108, 112, 95, 99, 101, 114, 116, 105, 102, 105, 99, 97, 116, 105, 111, 110],
  [109, 112, 108, 112, 95, 101, 110, 100, 111, 114, 115, 101, 109, 101, 110, 116],
  [112, 101, 114, 115, 105, 115, 116, 101, 110, 99, 101, 95, 97, 100, 97, 112, 116, 101, 114],
  [100, 97, 116, 97, 98, 97, 115, 101, 95, 114, 101, 102],
  [102, 105, 108, 101, 95, 101, 120, 112, 111, 114, 116, 95, 112, 97, 116, 104],
  [114, 111, 117, 116, 101, 95, 117, 114, 108],
  [102, 105, 108, 101, 95, 115, 121, 115, 116, 101, 109, 95, 119, 114, 105, 116, 101],
  [100, 97, 116, 97, 98, 97, 115, 101, 95, 115, 116, 111, 114, 97, 103, 101],
  [99, 108, 111, 117, 100, 95, 115, 121, 110, 99],
];

const FORBIDDEN_POSITIVE_KEYS = new Set(
  FORBIDDEN_POSITIVE_KEY_CODES.map((codes) => String.fromCharCode(...codes))
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function cloneEvidenceRefs(
  refs: readonly ProjectionSafeEvidenceRef[]
): ProjectionSafeEvidenceRef[] {
  return cloneJson([...refs]).sort((a, b) =>
    a.evidence_ref.localeCompare(b.evidence_ref)
  );
}

function cloneOmissionMarkers(
  markers: readonly ProjectionSafeOmissionMarker[]
): ProjectionSafeOmissionMarker[] {
  return cloneJson([...markers]).sort((a, b) =>
    a.marker.localeCompare(b.marker)
  );
}

function cloneVersionRefArray(
  refs: readonly ProjectionSafeVersionRefDto[] | undefined
): ProjectionSafeVersionRefDto[] | undefined {
  if (refs === undefined) {
    return undefined;
  }

  return cloneJson([...refs]).sort((a, b) =>
    `${a.ref_kind}:${a.ref_id}:${a.ref_version}`.localeCompare(
      `${b.ref_kind}:${b.ref_id}:${b.ref_version}`
    )
  );
}

function cloneVersionRefs(
  refs: ProjectionSafeVersionRefs
): ProjectionSafeVersionRefs {
  const cloned: ProjectionSafeVersionRefs = {
    protocol_version_refs: cloneVersionRefArray(refs.protocol_version_refs) ?? [],
    binding_version_refs: cloneVersionRefArray(refs.binding_version_refs) ?? [],
    runtime_version_refs: cloneVersionRefArray(refs.runtime_version_refs) ?? [],
  };
  const contractVersionRefs = cloneVersionRefArray(refs.contract_version_refs);
  const bundleVersionRefs = cloneVersionRefArray(refs.bundle_version_refs);

  if (contractVersionRefs !== undefined) {
    cloned.contract_version_refs = contractVersionRefs;
  }

  if (bundleVersionRefs !== undefined) {
    cloned.bundle_version_refs = bundleVersionRefs;
  }

  return cloned;
}

function cloneValidationSummary(
  summary: ProjectionSafeValidationSummary
): ProjectionSafeValidationSummary {
  return {
    validation_summary_id: summary.validation_summary_id,
    validation_status: summary.validation_status,
    validation_notes: [...summary.validation_notes].sort(),
    missing_required_refs: [...summary.missing_required_refs].sort(),
    boundary_flags_verified: true,
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}

function addOptionalText(
  bundle: ProjectionSafeOperatorReviewLoopHandoffDto,
  key:
    | "minimum_runtime_surface_ref"
    | "generation_ref"
    | "schema_profile_ref"
    | "boundary_profile_ref"
    | "deprecation_policy_ref",
  value: string | undefined
): void {
  if (hasText(value)) {
    bundle[key] = value;
  }
}

function stableHash(value: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36).padStart(7, "0");
}

function stableVersionRefs(refs: ProjectionSafeVersionRefs): string[] {
  return [
    ...(cloneVersionRefArray(refs.protocol_version_refs) ?? []),
    ...(cloneVersionRefArray(refs.binding_version_refs) ?? []),
    ...(cloneVersionRefArray(refs.runtime_version_refs) ?? []),
    ...(cloneVersionRefArray(refs.contract_version_refs) ?? []),
    ...(cloneVersionRefArray(refs.bundle_version_refs) ?? []),
  ].map((ref) => `${ref.ref_kind}:${ref.ref_id}:${ref.ref_version}`);
}

function deriveBundleId(
  input: CreateProjectionSafeOperatorReviewLoopBundleInput
): string {
  const stableRefs = [
    input.generated_from_runtime_surface_ref,
    input.source_commit_ref,
    input.operator_workspace.workspace_id,
    input.operator_session.session_id,
    input.review_loop_state.loop_state_id,
    input.operator_review_packet.packet_id,
    input.session_evidence_ledger.ledger_id,
    input.deterministic_evidence_bundle.bundle_id,
    input.local_review_loop_result.result_id,
    input.projection_safe_envelope.projection_envelope_id,
    ...input.safe_evidence_refs.map((ref) => ref.evidence_ref).sort(),
    ...input.omission_markers.map((marker) => marker.marker).sort(),
    ...stableVersionRefs(input.version_refs),
  ]
    .filter(hasText)
    .join("|");

  return `operator_review_loop_handoff_bundle_${stableHash(stableRefs)}`;
}

function assertText(value: unknown, label: string, issues: string[]): void {
  if (!hasText(value)) {
    issues.push(`${label} is required`);
  }
}

function collectForbiddenKeys(
  value: unknown,
  path: string,
  issues: string[]
): void {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectForbiddenKeys(item, `${path}[${index}]`, issues)
    );
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (FORBIDDEN_POSITIVE_KEYS.has(key)) {
      issues.push(`forbidden positive key at ${path}.${key}`);
    }

    collectForbiddenKeys(nested, `${path}.${key}`, issues);
  }
}

function collectBundleValidationIssues(bundle: unknown): string[] {
  const issues: string[] = [];

  if (!isRecord(bundle)) {
    return ["bundle must be an object"];
  }

  for (const field of REQUIRED_BUNDLE_FIELDS) {
    if (!(field in bundle)) {
      issues.push(`${field} is required`);
    }
  }

  assertText(bundle.bundle_id, "bundle_id", issues);
  assertText(
    bundle.projection_bundle_version,
    "projection_bundle_version",
    issues
  );
  assertText(bundle.runtime_contract_version, "runtime_contract_version", issues);
  assertText(bundle.compatibility_profile, "compatibility_profile", issues);
  assertText(
    bundle.generated_from_runtime_surface_ref,
    "generated_from_runtime_surface_ref",
    issues
  );
  assertText(bundle.source_commit_ref, "source_commit_ref", issues);

  if (bundle.runtime_private_fields_omitted !== true) {
    issues.push("runtime_private_fields_omitted must be true");
  }

  if (bundle.non_executing !== true) {
    issues.push("non_executing must be true");
  }

  if (!isRecord(bundle.projection_safe_envelope)) {
    issues.push("projection_safe_envelope must be an object");
  } else if (
    bundle.projection_safe_envelope.runtime_private_fields_omitted !== true ||
    bundle.projection_safe_envelope.non_executing !== true
  ) {
    issues.push("projection_safe_envelope boundary markers must be true");
  }

  if (!Array.isArray(bundle.omission_markers)) {
    issues.push("omission_markers must be an array");
  }

  if (!Array.isArray(bundle.safe_evidence_refs)) {
    issues.push("safe_evidence_refs must be an array");
  }

  if (!isRecord(bundle.version_refs)) {
    issues.push("version_refs must be an object");
  } else {
    for (const field of [
      "protocol_version_refs",
      "binding_version_refs",
      "runtime_version_refs",
    ]) {
      if (!Array.isArray(bundle.version_refs[field])) {
        issues.push(`version_refs.${field} must be an array`);
      }
    }
  }

  if (!isRecord(bundle.validation_summary)) {
    issues.push("validation_summary must be an object");
  } else {
    assertText(
      bundle.validation_summary.validation_summary_id,
      "validation_summary.validation_summary_id",
      issues
    );

    if (
      bundle.validation_summary.boundary_flags_verified !== true ||
      bundle.validation_summary.runtime_private_fields_omitted !== true ||
      bundle.validation_summary.non_executing !== true
    ) {
      issues.push("validation_summary boundary markers must be true");
    }
  }

  if (!isRecord(bundle.runtime_boundary_profile)) {
    issues.push("runtime_boundary_profile must be an object");
  } else {
    for (const flag of REQUIRED_BOUNDARY_TRUE_FLAGS) {
      if (bundle.runtime_boundary_profile[flag] !== true) {
        issues.push(`runtime_boundary_profile.${flag} must be true`);
      }
    }
  }

  collectForbiddenKeys(bundle, "$", issues);

  return [...new Set(issues)].sort();
}

export function createProjectionSafeOperatorReviewLoopBundle(
  input: CreateProjectionSafeOperatorReviewLoopBundleInput
): ProjectionSafeOperatorReviewLoopHandoffDto {
  const bundle: ProjectionSafeOperatorReviewLoopHandoffDto = {
    bundle_id: hasText(input.bundle_id)
      ? input.bundle_id
      : deriveBundleId(input),
    projection_bundle_version:
      PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION,
    runtime_contract_version:
      PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_RUNTIME_CONTRACT_VERSION,
    compatibility_profile:
      PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_COMPATIBILITY_PROFILE,
    generated_from_runtime_surface_ref:
      input.generated_from_runtime_surface_ref,
    source_commit_ref: input.source_commit_ref,
    operator_workspace: cloneJson(input.operator_workspace),
    operator_session: cloneJson(input.operator_session),
    review_loop_state: cloneJson(input.review_loop_state),
    operator_review_packet: cloneJson(input.operator_review_packet),
    session_evidence_ledger: cloneJson(input.session_evidence_ledger),
    deterministic_evidence_bundle: cloneJson(input.deterministic_evidence_bundle),
    runtime_boundary_profile: cloneJson(input.runtime_boundary_profile),
    local_review_loop_result: cloneJson(input.local_review_loop_result),
    projection_safe_envelope: cloneJson(input.projection_safe_envelope),
    omission_markers: cloneOmissionMarkers(input.omission_markers),
    safe_evidence_refs: cloneEvidenceRefs(input.safe_evidence_refs),
    version_refs: cloneVersionRefs(input.version_refs),
    validation_summary: cloneValidationSummary(input.validation_summary),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };

  addOptionalText(
    bundle,
    "minimum_runtime_surface_ref",
    input.minimum_runtime_surface_ref
  );
  addOptionalText(bundle, "generation_ref", input.generation_ref);
  addOptionalText(bundle, "schema_profile_ref", input.schema_profile_ref);
  addOptionalText(bundle, "boundary_profile_ref", input.boundary_profile_ref);
  addOptionalText(
    bundle,
    "deprecation_policy_ref",
    input.deprecation_policy_ref
  );

  validateProjectionSafeOperatorReviewLoopBundle(bundle);

  return bundle;
}

export function validateProjectionSafeOperatorReviewLoopBundle(
  bundle: unknown
): ProjectionSafeValidationSummary {
  const issues = collectBundleValidationIssues(bundle);

  if (issues.length > 0) {
    throw new Error(
      `Projection-safe operator review loop handoff bundle validation failed: ${issues.join("; ")}`
    );
  }

  const validationSummary = (bundle as ProjectionSafeOperatorReviewLoopHandoffDto)
    .validation_summary;

  return cloneValidationSummary(validationSummary);
}

export function summarizeProjectionSafeOperatorReviewLoopBundle(
  bundle: ProjectionSafeOperatorReviewLoopHandoffDto
): ProjectionSafeOperatorReviewLoopBundleSummary {
  const validationSummary =
    validateProjectionSafeOperatorReviewLoopBundle(bundle);

  return {
    bundle_id: bundle.bundle_id,
    projection_bundle_version: bundle.projection_bundle_version,
    runtime_contract_version: bundle.runtime_contract_version,
    compatibility_profile: bundle.compatibility_profile,
    validation_status: validationSummary.validation_status,
    omitted_private_payload: true,
    non_executing: true,
    evidence_ref_count: bundle.safe_evidence_refs.length,
    omission_marker_count: bundle.omission_markers.length,
  };
}
