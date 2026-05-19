import type {
  AcceptanceState,
  AdvancedRuntimePosture,
  DeliveryArtifactSummary,
  KernelDutyId,
  KernelDutyPosture,
  KernelDutyPostureValue,
  OperatorFeedbackSummary,
  OperatorIntentSummary,
  OperatorWorkPacketBoundaryProfile,
  OperatorWorkPacketCompatibilityProfile,
  OperatorWorkPacketContractVersion,
  OperatorWorkPacketEvidenceRef,
  OperatorWorkPacketHandoffEnvelope,
  OperatorWorkPacketOmissionMarker,
  OperatorWorkPacketProjectionBundleVersion,
  OperatorWorkPacketRuntimeContractVersion,
  OperatorWorkPacketValidationSummary,
  OperatorWorkPacketVersionRefDto,
  OperatorWorkPacketVersionRefs,
  ProjectionSafeEnvelope,
  ReviewableOutputSummary,
  WorkIntakeSummary,
  WorkPacketSummary,
  AssignmentSummary,
  WorkerActivitySummary,
  AcceptanceStateSummary,
  ContinuityPointer,
} from "./operator-work-packet-handoff-dto.ts";
import {
  OPERATOR_WORK_PACKET_ACCEPTANCE_STATES,
  OPERATOR_WORK_PACKET_KERNEL_DUTIES,
  OPERATOR_WORK_PACKET_KERNEL_DUTY_POSTURE_VALUES,
} from "./operator-work-packet-handoff-dto.ts";

export const OPERATOR_WORK_PACKET_HANDOFF_CONTRACT_VERSION =
  "operator-work-packet-handoff-contract-v0.1" as const satisfies OperatorWorkPacketContractVersion;

export const OPERATOR_WORK_PACKET_HANDOFF_RUNTIME_CONTRACT_VERSION =
  "operator-work-packet-runtime-contract-v0.1" as const satisfies OperatorWorkPacketRuntimeContractVersion;

export const OPERATOR_WORK_PACKET_HANDOFF_COMPATIBILITY_PROFILE =
  "projection-safe-operator-work-packet-handoff-v0.1" as const satisfies OperatorWorkPacketCompatibilityProfile;

export const OPERATOR_WORK_PACKET_HANDOFF_BUNDLE_VERSION =
  "0.1" as const satisfies OperatorWorkPacketProjectionBundleVersion;

type CreateOperatorWorkPacketHandoffEnvelopeInput = {
  handoff_envelope_ref?: string;
  generated_from_runtime_surface_ref: string;
  source_commit_ref: string;
  operator_intent_summary: OperatorIntentSummary;
  work_intake_summary: WorkIntakeSummary;
  work_packet_summary: WorkPacketSummary;
  assignment_summary: AssignmentSummary;
  worker_activity_summary: WorkerActivitySummary;
  reviewable_output_summary: ReviewableOutputSummary;
  acceptance_state: AcceptanceStateSummary;
  operator_feedback_summary: OperatorFeedbackSummary;
  delivery_artifact_summary: DeliveryArtifactSummary;
  continuity_pointer: ContinuityPointer;
  advanced_runtime_posture: AdvancedRuntimePosture;
  kernel_duty_posture: KernelDutyPosture;
  projection_safe_envelope: ProjectionSafeEnvelope;
  boundary_profile: OperatorWorkPacketBoundaryProfile;
  version_refs: OperatorWorkPacketVersionRefs;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  validation_summary: OperatorWorkPacketValidationSummary;
};

type OperatorWorkPacketHandoffEnvelopeSummary = {
  handoff_envelope_ref: string;
  contract_version: OperatorWorkPacketContractVersion;
  runtime_contract_version: OperatorWorkPacketRuntimeContractVersion;
  compatibility_profile: OperatorWorkPacketCompatibilityProfile;
  acceptance_state: AcceptanceState;
  kernel_duty_count: number;
  evidence_ref_count: number;
  omission_marker_count: number;
  advanced_runtime_refs_projection_safe_only: true;
  omitted_private_payload: true;
  non_executing: true;
};

const REQUIRED_ENVELOPE_FIELDS = [
  "handoff_envelope_ref",
  "contract_version",
  "runtime_contract_version",
  "compatibility_profile",
  "generated_from_runtime_surface_ref",
  "source_commit_ref",
  "operator_intent_summary",
  "work_intake_summary",
  "work_packet_summary",
  "assignment_summary",
  "worker_activity_summary",
  "reviewable_output_summary",
  "acceptance_state",
  "operator_feedback_summary",
  "delivery_artifact_summary",
  "continuity_pointer",
  "advanced_runtime_posture",
  "kernel_duty_posture",
  "projection_safe_envelope",
  "boundary_profile",
  "version_refs",
  "safe_evidence_refs",
  "omission_markers",
  "validation_summary",
  "runtime_private_fields_omitted",
  "non_executing",
] as const;

const REQUIRED_BOUNDARY_TRUE_FLAGS = [
  "projection_safe",
  "deterministic",
  "non_execution_boundary",
  "non_executing",
  "runtime_private_payload_omitted",
  "runtime_private_fields_omitted",
  "provider_free",
  "dispatch_free",
  "product_neutral",
  "mplp_bound",
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_tool_invocation",
  "no_payment",
  "no_publishing",
  "no_customer_outreach",
  "no_autonomous_external_action",
  "no_training_authority",
  "no_automatic_mutation",
  "no_automatic_writeback_authority",
  "no_package_publication",
  "no_full_dialog_runtime",
  "no_full_ael_runtime",
  "no_full_vsl_runtime",
  "no_full_psg_runtime",
  "no_drift_engine",
  "no_learning_engine",
  "no_mplp_schema_change",
  "no_mplp_protocol_law_change",
  "no_mplp_normative_binding_change",
  "no_certification_or_endorsement",
] as const satisfies readonly (keyof OperatorWorkPacketBoundaryProfile)[];

const REQUIRED_PROJECTION_TRUE_FLAGS = [
  "non_execution_boundary",
  "runtime_private_fields_omitted",
  "projection_safe",
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_tool_invocation",
  "no_payment",
  "no_publishing",
  "no_customer_outreach",
  "no_autonomous_external_action",
  "no_training_authority",
  "no_automatic_mutation",
  "no_package_publication",
  "no_mplp_schema_change",
  "no_mplp_protocol_law_change",
  "no_mplp_normative_binding_change",
] as const satisfies readonly (keyof ProjectionSafeEnvelope)[];

const REQUIRED_ADVANCED_FALSE_FLAGS = [
  "implements_full_dialog_runtime",
  "implements_full_ael_runtime",
  "implements_full_vsl_runtime",
  "implements_full_psg_runtime",
  "implements_full_drift_engine",
  "implements_full_learning_engine",
  "grants_execution_authority",
  "grants_training_authority",
  "grants_mutation_authority",
] as const satisfies readonly (keyof AdvancedRuntimePosture)[];

const REQUIRED_ADVANCED_FIELDS = [
  "dialog_ref",
  "clarification_ref",
  "source_intent_ref",
  "intent_drift_marker",
  "semantic_loss_marker",
  "psg_pointer",
  "ael_event_ref",
  "learning_feedback_ref",
] as const satisfies readonly (keyof AdvancedRuntimePosture)[];

const REQUIRED_COMPONENT_KEYS = [
  "operator_intent_summary",
  "work_intake_summary",
  "work_packet_summary",
  "assignment_summary",
  "worker_activity_summary",
  "reviewable_output_summary",
  "acceptance_state",
  "operator_feedback_summary",
  "delivery_artifact_summary",
  "continuity_pointer",
] as const;

const FORBIDDEN_KEY_CODES: readonly (readonly number[])[] = [
  [114, 97, 119, 95, 112, 114, 111, 109, 112, 116],
  [114, 97, 119, 95, 116, 114, 97, 99, 101],
  [112, 114, 111, 118, 105, 100, 101, 114],
  [112, 114, 111, 118, 105, 100, 101, 114, 95, 114, 101, 115, 112, 111, 110, 115, 101],
  [109, 111, 100, 101, 108, 95, 114, 101, 115, 112, 111, 110, 115, 101],
  [115, 113, 108, 105, 116, 101],
  [115, 116, 111, 114, 101],
  [99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114],
  [115, 101, 114, 118, 105, 99, 101, 95, 105, 110, 115, 116, 97, 110, 99, 101],
  [109, 117, 116, 97, 98, 108, 101, 95, 104, 97, 110, 100, 108, 101],
  [119, 111, 114, 107, 101, 114, 95, 112, 114, 105, 118, 97, 116, 101, 95, 115, 116, 97, 116, 101],
  [100, 105, 115, 112, 97, 116, 99, 104, 101, 114],
  [116, 111, 111, 108, 95, 114, 101, 115, 117, 108, 116, 95, 114, 97, 119],
];

const ALLOWED_BOUNDARY_KEYS = new Set([
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_tool_invocation",
  "provider_free",
  "dispatch_free",
  "runtime_private_payload_omitted",
  "runtime_private_fields_omitted",
  "no_full_dialog_runtime",
  "no_full_ael_runtime",
  "no_full_vsl_runtime",
  "no_full_psg_runtime",
  "no_drift_engine",
  "no_learning_engine",
  "no_package_publication",
  "no_publishing",
]);

const FORBIDDEN_POSITIVE_KEY_CODES: readonly (readonly number[])[] = [
  [112, 114, 111, 118, 105, 100, 101, 114, 95, 100, 105, 115, 112, 97, 116, 99, 104],
  [99, 104, 97, 110, 110, 101, 108, 95, 100, 105, 115, 112, 97, 116, 99, 104],
  [116, 111, 111, 108, 95, 105, 110, 118, 111, 99, 97, 116, 105, 111, 110],
  [112, 117, 98, 108, 105, 115, 104, 105, 110, 103],
  [112, 97, 121, 109, 101, 110, 116],
  [99, 117, 115, 116, 111, 109, 101, 114, 95, 111, 117, 116, 114, 101, 97, 99, 104],
  [97, 117, 116, 111, 110, 111, 109, 111, 117, 115, 95, 101, 120, 116, 101, 114, 110, 97, 108, 95, 97, 99, 116, 105, 111, 110],
  [116, 114, 97, 105, 110, 105, 110, 103, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121],
  [97, 117, 116, 111, 109, 97, 116, 105, 99, 95, 109, 117, 116, 97, 116, 105, 111, 110],
  [97, 117, 116, 111, 109, 97, 116, 105, 99, 95, 119, 114, 105, 116, 101, 98, 97, 99, 107, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121],
];

const FORBIDDEN_POSITIVE_KEYS = new Set(
  FORBIDDEN_POSITIVE_KEY_CODES.map((codes) => String.fromCharCode(...codes))
);

const FORBIDDEN_KEYS = new Set(
  FORBIDDEN_KEY_CODES.map((codes) => String.fromCharCode(...codes))
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
  refs: readonly OperatorWorkPacketEvidenceRef[]
): OperatorWorkPacketEvidenceRef[] {
  return cloneJson([...refs]).sort((a, b) =>
    a.evidence_ref.localeCompare(b.evidence_ref)
  );
}

function cloneOmissionMarkers(
  markers: readonly OperatorWorkPacketOmissionMarker[]
): OperatorWorkPacketOmissionMarker[] {
  return cloneJson([...markers]).sort((a, b) =>
    a.marker.localeCompare(b.marker)
  );
}

function cloneVersionRefArray(
  refs: readonly OperatorWorkPacketVersionRefDto[] | undefined
): OperatorWorkPacketVersionRefDto[] | undefined {
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
  refs: OperatorWorkPacketVersionRefs
): OperatorWorkPacketVersionRefs {
  const cloned: OperatorWorkPacketVersionRefs = {
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

function stableHash(value: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36).padStart(7, "0");
}

function stableVersionRefs(refs: OperatorWorkPacketVersionRefs): string[] {
  return [
    ...(cloneVersionRefArray(refs.protocol_version_refs) ?? []),
    ...(cloneVersionRefArray(refs.binding_version_refs) ?? []),
    ...(cloneVersionRefArray(refs.runtime_version_refs) ?? []),
    ...(cloneVersionRefArray(refs.contract_version_refs) ?? []),
    ...(cloneVersionRefArray(refs.bundle_version_refs) ?? []),
  ].map((ref) => `${ref.ref_kind}:${ref.ref_id}:${ref.ref_version}`);
}

function deriveEnvelopeRef(
  input: CreateOperatorWorkPacketHandoffEnvelopeInput
): string {
  const stableRefs = [
    input.generated_from_runtime_surface_ref,
    input.source_commit_ref,
    input.operator_intent_summary.intent_summary_ref,
    input.work_intake_summary.intake_ref,
    input.work_packet_summary.packet_ref,
    input.assignment_summary.assignment_ref,
    input.worker_activity_summary.activity_summary_ref,
    input.reviewable_output_summary.output_ref,
    input.acceptance_state.acceptance_ref,
    input.operator_feedback_summary.feedback_ref,
    input.delivery_artifact_summary.artifact_ref,
    input.continuity_pointer.continuation_ref,
    input.advanced_runtime_posture.posture_ref,
    input.kernel_duty_posture.posture_ref,
    input.projection_safe_envelope.envelope_ref,
    ...input.safe_evidence_refs.map((ref) => ref.evidence_ref).sort(),
    ...input.omission_markers.map((marker) => marker.marker).sort(),
    ...stableVersionRefs(input.version_refs),
  ]
    .filter(hasText)
    .join("|");

  return `operator_work_packet_handoff_${stableHash(stableRefs)}`;
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
    if (
      (FORBIDDEN_KEYS.has(key) || FORBIDDEN_POSITIVE_KEYS.has(key)) &&
      !ALLOWED_BOUNDARY_KEYS.has(key)
    ) {
      issues.push(`forbidden runtime-private or authority key at ${path}.${key}`);
    }

    collectForbiddenKeys(nested, `${path}.${key}`, issues);
  }
}

function validateVersionRefs(
  refs: unknown,
  issues: string[],
  label: string
): void {
  if (!isRecord(refs)) {
    issues.push(`${label} must be an object`);
    return;
  }

  for (const field of [
    "protocol_version_refs",
    "binding_version_refs",
    "runtime_version_refs",
  ]) {
    if (!Array.isArray(refs[field])) {
      issues.push(`${label}.${field} must be an array`);
    }
  }
}

function validateMplpBinding(
  value: unknown,
  label: string,
  issues: string[]
): void {
  if (!isRecord(value)) {
    issues.push(`${label}.mplp_binding must be an object`);
    return;
  }

  assertText(value.binding_ref, `${label}.mplp_binding.binding_ref`, issues);

  if (!Array.isArray(value.module_mapping) || value.module_mapping.length !== 10) {
    issues.push(`${label}.mplp_binding.module_mapping must cover all 10 modules`);
  }

  for (const flag of [
    "existing_mplp_semantics_sufficient",
    "cognitive_os_side_non_normative",
    "no_mplp_schema_change",
    "no_mplp_protocol_law_change",
    "no_mplp_normative_binding_change",
    "no_schema_level_conformance_claim",
    "no_certification_claim",
    "no_formal_assurance_claim",
    "no_endorsement_claim",
    "no_regulator_approval_claim",
    "no_official_compliance_claim",
  ]) {
    if (value[flag] !== true) {
      issues.push(`${label}.mplp_binding.${flag} must be true`);
    }
  }
}

function collectEnvelopeValidationIssues(envelope: unknown): string[] {
  const issues: string[] = [];

  if (!isRecord(envelope)) {
    return ["envelope must be an object"];
  }

  for (const field of REQUIRED_ENVELOPE_FIELDS) {
    if (!(field in envelope)) {
      issues.push(`${field} is required`);
    }
  }

  assertText(envelope.handoff_envelope_ref, "handoff_envelope_ref", issues);
  assertText(envelope.contract_version, "contract_version", issues);
  assertText(envelope.runtime_contract_version, "runtime_contract_version", issues);
  assertText(envelope.compatibility_profile, "compatibility_profile", issues);
  assertText(
    envelope.generated_from_runtime_surface_ref,
    "generated_from_runtime_surface_ref",
    issues
  );
  assertText(envelope.source_commit_ref, "source_commit_ref", issues);

  if (envelope.runtime_private_fields_omitted !== true) {
    issues.push("runtime_private_fields_omitted must be true");
  }

  if (envelope.non_executing !== true) {
    issues.push("non_executing must be true");
  }

  validateVersionRefs(envelope.version_refs, issues, "version_refs");

  if (!Array.isArray(envelope.safe_evidence_refs)) {
    issues.push("safe_evidence_refs must be an array");
  }

  if (!Array.isArray(envelope.omission_markers)) {
    issues.push("omission_markers must be an array");
  }

  if (!isRecord(envelope.boundary_profile)) {
    issues.push("boundary_profile must be an object");
  } else {
    for (const flag of REQUIRED_BOUNDARY_TRUE_FLAGS) {
      if (envelope.boundary_profile[flag] !== true) {
        issues.push(`boundary_profile.${flag} must be true`);
      }
    }
  }

  if (!isRecord(envelope.projection_safe_envelope)) {
    issues.push("projection_safe_envelope must be an object");
  } else {
    for (const flag of REQUIRED_PROJECTION_TRUE_FLAGS) {
      if (envelope.projection_safe_envelope[flag] !== true) {
        issues.push(`projection_safe_envelope.${flag} must be true`);
      }
    }
  }

  if (!isRecord(envelope.advanced_runtime_posture)) {
    issues.push("advanced_runtime_posture must be an object");
  } else {
    for (const field of REQUIRED_ADVANCED_FIELDS) {
      if (!(field in envelope.advanced_runtime_posture)) {
        issues.push(`advanced_runtime_posture.${field} is required`);
      }
    }

    const hasValueState =
      "vsl_state_ref" in envelope.advanced_runtime_posture ||
      "value_state_ref" in envelope.advanced_runtime_posture;

    if (!hasValueState) {
      issues.push("advanced_runtime_posture requires vsl_state_ref or value_state_ref");
    }

    for (const flag of REQUIRED_ADVANCED_FALSE_FLAGS) {
      if (envelope.advanced_runtime_posture[flag] !== false) {
        issues.push(`advanced_runtime_posture.${flag} must be false`);
      }
    }

    if (envelope.advanced_runtime_posture.projection_safe_refs_only !== true) {
      issues.push("advanced_runtime_posture.projection_safe_refs_only must be true");
    }
  }

  if (!isRecord(envelope.kernel_duty_posture)) {
    issues.push("kernel_duty_posture must be an object");
  } else if (!Array.isArray(envelope.kernel_duty_posture.duties)) {
    issues.push("kernel_duty_posture.duties must be an array");
  } else {
    const expectedDutyIds = new Set(
      OPERATOR_WORK_PACKET_KERNEL_DUTIES.map((duty) => duty.duty_id)
    );
    const seenDutyIds = new Set<KernelDutyId>();
    const allowedPostures = new Set<KernelDutyPostureValue>(
      OPERATOR_WORK_PACKET_KERNEL_DUTY_POSTURE_VALUES
    );

    for (const duty of envelope.kernel_duty_posture.duties) {
      if (!isRecord(duty)) {
        issues.push("kernel_duty_posture duty must be an object");
        continue;
      }

      if (!expectedDutyIds.has(duty.duty_id as KernelDutyId)) {
        issues.push(`unsupported kernel duty ${String(duty.duty_id)}`);
      } else {
        seenDutyIds.add(duty.duty_id as KernelDutyId);
      }

      if (!allowedPostures.has(duty.posture as KernelDutyPostureValue)) {
        issues.push(`unsupported kernel duty posture ${String(duty.posture)}`);
      }

      if (duty.projection_safe !== true) {
        issues.push(`kernel_duty_posture.${String(duty.duty_id)} projection_safe must be true`);
      }
    }

    if (
      seenDutyIds.size !== OPERATOR_WORK_PACKET_KERNEL_DUTIES.length ||
      OPERATOR_WORK_PACKET_KERNEL_DUTIES.some(
        (duty) => !seenDutyIds.has(duty.duty_id)
      )
    ) {
      issues.push("kernel_duty_posture must represent all 11 duties");
    }
  }

  for (const componentKey of REQUIRED_COMPONENT_KEYS) {
    const component = envelope[componentKey];
    if (!isRecord(component)) {
      issues.push(`${componentKey} must be an object`);
      continue;
    }

    validateMplpBinding(component.mplp_binding, componentKey, issues);

    if (component.runtime_private_fields_omitted !== true) {
      issues.push(`${componentKey}.runtime_private_fields_omitted must be true`);
    }
  }

  if (!OPERATOR_WORK_PACKET_ACCEPTANCE_STATES.includes(
    (envelope.acceptance_state as AcceptanceStateSummary | undefined)
      ?.state as AcceptanceState
  )) {
    issues.push("acceptance_state.state is unsupported");
  }

  if (!isRecord(envelope.validation_summary)) {
    issues.push("validation_summary must be an object");
  } else if (
    envelope.validation_summary.boundary_flags_verified !== true ||
    envelope.validation_summary.runtime_private_fields_omitted !== true ||
    envelope.validation_summary.non_executing !== true
  ) {
    issues.push("validation_summary boundary markers must be true");
  }

  collectForbiddenKeys(envelope, "$", issues);

  return [...new Set(issues)].sort();
}

export function createOperatorWorkPacketHandoffEnvelope(
  input: CreateOperatorWorkPacketHandoffEnvelopeInput
): OperatorWorkPacketHandoffEnvelope {
  const envelope: OperatorWorkPacketHandoffEnvelope = {
    handoff_envelope_ref: hasText(input.handoff_envelope_ref)
      ? input.handoff_envelope_ref
      : deriveEnvelopeRef(input),
    contract_version: OPERATOR_WORK_PACKET_HANDOFF_CONTRACT_VERSION,
    runtime_contract_version: OPERATOR_WORK_PACKET_HANDOFF_RUNTIME_CONTRACT_VERSION,
    compatibility_profile: OPERATOR_WORK_PACKET_HANDOFF_COMPATIBILITY_PROFILE,
    generated_from_runtime_surface_ref: input.generated_from_runtime_surface_ref,
    source_commit_ref: input.source_commit_ref,
    operator_intent_summary: cloneJson(input.operator_intent_summary),
    work_intake_summary: cloneJson(input.work_intake_summary),
    work_packet_summary: cloneJson(input.work_packet_summary),
    assignment_summary: cloneJson(input.assignment_summary),
    worker_activity_summary: cloneJson(input.worker_activity_summary),
    reviewable_output_summary: cloneJson(input.reviewable_output_summary),
    acceptance_state: cloneJson(input.acceptance_state),
    operator_feedback_summary: cloneJson(input.operator_feedback_summary),
    delivery_artifact_summary: cloneJson(input.delivery_artifact_summary),
    continuity_pointer: cloneJson(input.continuity_pointer),
    advanced_runtime_posture: cloneJson(input.advanced_runtime_posture),
    kernel_duty_posture: cloneJson(input.kernel_duty_posture),
    projection_safe_envelope: cloneJson(input.projection_safe_envelope),
    boundary_profile: cloneJson(input.boundary_profile),
    version_refs: cloneVersionRefs(input.version_refs),
    safe_evidence_refs: cloneEvidenceRefs(input.safe_evidence_refs),
    omission_markers: cloneOmissionMarkers(input.omission_markers),
    validation_summary: {
      validation_summary_ref: input.validation_summary.validation_summary_ref,
      validation_status: input.validation_summary.validation_status,
      validation_notes: [...input.validation_summary.validation_notes].sort(),
      missing_required_refs: [...input.validation_summary.missing_required_refs].sort(),
      boundary_flags_verified: true,
      runtime_private_fields_omitted: true,
      non_executing: true,
    },
    runtime_private_fields_omitted: true,
    non_executing: true,
  };

  validateOperatorWorkPacketHandoffEnvelope(envelope);

  return envelope;
}

export function validateOperatorWorkPacketHandoffEnvelope(
  envelope: unknown
): OperatorWorkPacketValidationSummary {
  const issues = collectEnvelopeValidationIssues(envelope);

  if (issues.length > 0) {
    throw new Error(
      `Operator work-packet handoff envelope validation failed: ${issues.join("; ")}`
    );
  }

  const validationSummary = (envelope as OperatorWorkPacketHandoffEnvelope)
    .validation_summary;

  return cloneJson(validationSummary);
}

export function summarizeOperatorWorkPacketHandoffEnvelope(
  envelope: OperatorWorkPacketHandoffEnvelope
): OperatorWorkPacketHandoffEnvelopeSummary {
  validateOperatorWorkPacketHandoffEnvelope(envelope);

  return {
    handoff_envelope_ref: envelope.handoff_envelope_ref,
    contract_version: envelope.contract_version,
    runtime_contract_version: envelope.runtime_contract_version,
    compatibility_profile: envelope.compatibility_profile,
    acceptance_state: envelope.acceptance_state.state,
    kernel_duty_count: envelope.kernel_duty_posture.duties.length,
    evidence_ref_count: envelope.safe_evidence_refs.length,
    omission_marker_count: envelope.omission_markers.length,
    advanced_runtime_refs_projection_safe_only: true,
    omitted_private_payload: true,
    non_executing: true,
  };
}
