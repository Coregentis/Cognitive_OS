import { createHash } from "node:crypto";

import {
  PREPARED_ACTION_DEFAULT_NON_EXECUTING_POSTURE,
  type CreatePreparedActionBoundaryPostureInput,
  type CreatePreparedActionConfirmationRequirementInput,
  type CreatePreparedActionEvidenceSufficiencyInput,
  type CreatePreparedActionIntentSummaryInput,
  type CreatePreparedActionMissingInformationInput,
  type CreatePreparedActionProjectionInput,
  type CreatePreparedActionRiskSummaryInput,
  type PreparedActionBoundaryPosture,
  type PreparedActionConfirmationRequirement,
  type PreparedActionEvidenceSufficiency,
  type PreparedActionIntentSummary,
  type PreparedActionMissingInformation,
  type PreparedActionProjection,
  type PreparedActionRiskSummary,
  type PreparedActionSafeEvidenceRef,
  type PreparedActionSafeEvidenceRefInput,
} from "./prepared-action-types.ts";

type PreparedActionRecord = Record<string, unknown>;

const DEFAULT_CREATED_AT = "1970-01-01T00:00:00.000Z";

export const FORBIDDEN_PREPARED_ACTION_RAW_KEYS = [
  "raw_vsl",
  "raw_psg",
  "raw_trace",
  "runtime_private_payload",
] as const;

export const FORBIDDEN_PREPARED_ACTION_EXECUTION_KEYS = [
  "execution_result",
  "dispatch_result",
  "approval_result",
  "provider_channel_result",
  "queue_state",
] as const;

const FORBIDDEN_PREPARED_ACTION_POSITIVE_PHRASES = [
  "provider/channel execution available",
  "approve/reject/dispatch/execute available",
  "queue implementation available",
  "autonomous operation available",
  "approval granted",
  "execution completed",
  "execution ready",
  "dispatch-ready",
] as const;

function stable_stringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stable_stringify(entry)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value).sort(([left], [right]) =>
      left.localeCompare(right)
    );
    return `{${entries
      .map(([key, nested]) => `${JSON.stringify(key)}:${stable_stringify(nested)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function deterministic_id(prefix: string, seed: string): string {
  return `${prefix}_${createHash("sha1").update(seed).digest("hex").slice(0, 16)}`;
}

function created_at_or_default(value: unknown): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : DEFAULT_CREATED_AT;
}

function as_record(value: unknown): PreparedActionRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as PreparedActionRecord;
}

function is_non_empty_string(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function assert_prepared_action_boundary(value: unknown): void {
  const errors = [
    ...collect_forbidden_key_errors(value),
    ...collect_forbidden_phrase_errors(value),
  ];

  if (errors.length > 0) {
    throw new Error([...new Set(errors)].join("; "));
  }
}

function require_string(value: unknown, field_name: string): string {
  if (!is_non_empty_string(value)) {
    throw new Error(`${field_name} is required`);
  }

  return value.trim();
}

function require_string_array(value: unknown, field_name: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${field_name} must be an array`);
  }

  return value.map((entry, index) =>
    require_string(entry, `${field_name}[${index}]`)
  );
}

function normalize_non_executing_posture(value: unknown): string {
  if (value === undefined) {
    return PREPARED_ACTION_DEFAULT_NON_EXECUTING_POSTURE;
  }

  return require_string(value, "non_executing_posture");
}

function collect_forbidden_key_errors(
  value: unknown,
  target: string[] = []
): string[] {
  if (!value || typeof value !== "object") {
    return target;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => {
      collect_forbidden_key_errors(entry, target);
    });
    return target;
  }

  for (const [key, nested] of Object.entries(value)) {
    if ((FORBIDDEN_PREPARED_ACTION_RAW_KEYS as readonly string[]).includes(key)) {
      target.push(`forbidden runtime-private field: ${key}`);
    }

    if (
      (FORBIDDEN_PREPARED_ACTION_EXECUTION_KEYS as readonly string[]).includes(key)
    ) {
      if (key === "queue_state") {
        target.push(`forbidden queue field: ${key}`);
      } else {
        target.push(`forbidden execution field: ${key}`);
      }
    }

    collect_forbidden_key_errors(nested, target);
  }

  return target;
}

function collect_forbidden_phrase_errors(
  value: unknown,
  path = "input",
  target: string[] = []
): string[] {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    for (const phrase of FORBIDDEN_PREPARED_ACTION_POSITIVE_PHRASES) {
      if (normalized.includes(phrase)) {
        target.push(`forbidden capability wording at ${path}`);
      }
    }

    return target;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      collect_forbidden_phrase_errors(entry, `${path}[${index}]`, target);
    });
    return target;
  }

  if (!value || typeof value !== "object") {
    return target;
  }

  for (const [key, nested] of Object.entries(value)) {
    collect_forbidden_phrase_errors(nested, `${path}.${key}`, target);
  }

  return target;
}

function validate_safe_evidence_refs(
  value: unknown,
  errors: string[]
): PreparedActionSafeEvidenceRef[] {
  if (!Array.isArray(value)) {
    errors.push("safe_evidence_refs must be an array");
    return [];
  }

  const results: PreparedActionSafeEvidenceRef[] = [];

  value.forEach((entry, index) => {
    const record = as_record(entry);
    const evidence_ref = record.evidence_ref;
    const evidence_label = record.evidence_label;

    if (!is_non_empty_string(evidence_ref)) {
      errors.push(`safe_evidence_refs[${index}].evidence_ref is required`);
      return;
    }

    if (
      evidence_label !== undefined &&
      !is_non_empty_string(evidence_label)
    ) {
      errors.push(
        `safe_evidence_refs[${index}].evidence_label must remain a non-empty bounded field.`
      );
      return;
    }

    results.push({
      evidence_ref: evidence_ref.trim(),
      evidence_label:
        typeof evidence_label === "string" ? evidence_label.trim() : undefined,
    });
  });

  return results;
}

function normalize_safe_evidence_ref_input(
  value: PreparedActionSafeEvidenceRefInput,
  index: number
): PreparedActionSafeEvidenceRef {
  if (typeof value === "string") {
    return {
      evidence_ref: require_string(value, `safe_evidence_refs[${index}]`),
    };
  }

  const record = as_record(value);
  const allowed_keys = ["evidence_ref", "evidence_label"];
  const unexpected_keys = Object.keys(record).filter(
    (key) => !allowed_keys.includes(key)
  );

  if (unexpected_keys.length > 0) {
    throw new Error(
      `safe_evidence_refs[${index}] must remain reference-only`
    );
  }

  return {
    evidence_ref: require_string(
      record.evidence_ref,
      `safe_evidence_refs[${index}].evidence_ref`
    ),
    evidence_label:
      record.evidence_label === undefined
        ? undefined
        : require_string(
            record.evidence_label,
            `safe_evidence_refs[${index}].evidence_label`
          ),
  };
}

function normalize_safe_evidence_refs_input(
  value: PreparedActionSafeEvidenceRefInput[] | undefined
): PreparedActionSafeEvidenceRef[] {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error("safe_evidence_refs must be an array");
  }

  return value.map((entry, index) =>
    normalize_safe_evidence_ref_input(entry, index)
  );
}

export function createPreparedActionIntentSummary(
  input: CreatePreparedActionIntentSummaryInput
): PreparedActionIntentSummary {
  assert_prepared_action_boundary(input);

  return {
    action_label: require_string(input.action_label, "action_label"),
    action_summary: require_string(input.action_summary, "action_summary"),
    non_executing_posture: normalize_non_executing_posture(
      input.non_executing_posture
    ),
  };
}

export function createPreparedActionRiskSummary(
  input: CreatePreparedActionRiskSummaryInput
): PreparedActionRiskSummary {
  assert_prepared_action_boundary(input);

  return {
    risk_summary: require_string(input.risk_summary, "risk_summary"),
    boundary_summary: require_string(
      input.boundary_summary,
      "boundary_summary"
    ),
    non_executing_posture: normalize_non_executing_posture(
      input.non_executing_posture
    ),
  };
}

export function createPreparedActionEvidenceSufficiency(
  input: CreatePreparedActionEvidenceSufficiencyInput
): PreparedActionEvidenceSufficiency {
  assert_prepared_action_boundary(input);

  if (
    input.sufficiency_state !== "insufficient" &&
    input.sufficiency_state !== "partial" &&
    input.sufficiency_state !== "sufficient"
  ) {
    throw new Error("sufficiency_state is required");
  }

  return {
    sufficiency_state: input.sufficiency_state,
    sufficiency_summary: require_string(
      input.sufficiency_summary,
      "sufficiency_summary"
    ),
    runtime_private_fields_omitted: true,
  };
}

export function createPreparedActionMissingInformation(
  input: CreatePreparedActionMissingInformationInput
): PreparedActionMissingInformation {
  assert_prepared_action_boundary(input);

  return {
    missing_information_summary: require_string(
      input.missing_information_summary,
      "missing_information_summary"
    ),
    missing_information_items: require_string_array(
      input.missing_information_items,
      "missing_information_items"
    ),
    runtime_private_fields_omitted: true,
  };
}

export function createPreparedActionConfirmationRequirement(
  input: CreatePreparedActionConfirmationRequirementInput
): PreparedActionConfirmationRequirement {
  assert_prepared_action_boundary(input);

  if (typeof input.confirmation_required !== "boolean") {
    throw new Error("confirmation_required is required");
  }

  return {
    confirmation_required: input.confirmation_required,
    confirmation_summary: require_string(
      input.confirmation_summary,
      "confirmation_summary"
    ),
    runtime_private_fields_omitted: true,
    non_executing_posture: normalize_non_executing_posture(
      input.non_executing_posture
    ),
  };
}

export function createPreparedActionBoundaryPosture(
  input: CreatePreparedActionBoundaryPostureInput = {}
): PreparedActionBoundaryPosture {
  assert_prepared_action_boundary(input);

  return {
    non_executing_posture: normalize_non_executing_posture(
      input.non_executing_posture
    ),
    provider_channel_execution_available: false,
    approval_dispatch_execution_available: false,
    queue_available: false,
    runtime_private_fields_omitted: true,
  };
}

export function createPreparedActionProjection(
  input: CreatePreparedActionProjectionInput
): PreparedActionProjection {
  assert_prepared_action_boundary(input);

  const created_at = created_at_or_default(input.created_at);
  const intent_summary = createPreparedActionIntentSummary(input.intent_summary);
  const risk_summary = createPreparedActionRiskSummary(input.risk_summary);
  const evidence_sufficiency = createPreparedActionEvidenceSufficiency(
    input.evidence_sufficiency
  );
  const missing_information = createPreparedActionMissingInformation(
    input.missing_information
  );
  const confirmation_requirement = createPreparedActionConfirmationRequirement(
    input.confirmation_requirement
  );
  const boundary_posture = createPreparedActionBoundaryPosture(
    input.boundary_posture ?? {
      non_executing_posture:
        confirmation_requirement.non_executing_posture ||
        risk_summary.non_executing_posture ||
        intent_summary.non_executing_posture,
    }
  );
  const safe_evidence_refs = normalize_safe_evidence_refs_input(
    input.safe_evidence_refs
  );

  const prepared_action_id =
    typeof input.prepared_action_id === "string" &&
    input.prepared_action_id.trim().length > 0
      ? input.prepared_action_id.trim()
      : deterministic_id(
          "prepared_action",
          stable_stringify({
            project_id: input.project_id,
            intent_summary,
            risk_summary,
            evidence_sufficiency,
            missing_information,
            confirmation_requirement,
            boundary_posture,
            safe_evidence_refs,
            created_at,
          })
        );

  const projection: PreparedActionProjection = {
    prepared_action_id,
    project_id: require_string(input.project_id, "project_id"),
    intent_summary,
    risk_summary,
    evidence_sufficiency,
    missing_information,
    confirmation_requirement,
    boundary_posture,
    safe_evidence_refs,
    runtime_private_fields_omitted: true,
    created_at,
  };

  const validation = validate_prepared_action_projection(projection);
  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  return projection;
}

export function validate_prepared_action_projection(
  value: unknown
): { ok: boolean; errors: string[]; value?: PreparedActionProjection } {
  const errors = [
    ...collect_forbidden_key_errors(value),
    ...collect_forbidden_phrase_errors(value),
  ];
  const candidate = as_record(value);

  if (!is_non_empty_string(candidate.prepared_action_id)) {
    errors.push("prepared_action_id is required");
  }

  if (!is_non_empty_string(candidate.project_id)) {
    errors.push("project_id is required");
  }

  if (candidate.runtime_private_fields_omitted !== true) {
    errors.push("runtime_private_fields_omitted must be true");
  }

  const intent_summary = as_record(candidate.intent_summary);
  const risk_summary = as_record(candidate.risk_summary);
  const evidence_sufficiency = as_record(candidate.evidence_sufficiency);
  const missing_information = as_record(candidate.missing_information);
  const confirmation_requirement = as_record(candidate.confirmation_requirement);
  const boundary_posture = as_record(candidate.boundary_posture);

  if (!is_non_empty_string(intent_summary.action_label)) {
    errors.push("intent_summary.action_label is required");
  }
  if (!is_non_empty_string(intent_summary.action_summary)) {
    errors.push("intent_summary.action_summary is required");
  }
  if (!is_non_empty_string(intent_summary.non_executing_posture)) {
    errors.push("intent_summary.non_executing_posture is required");
  }

  if (!is_non_empty_string(risk_summary.risk_summary)) {
    errors.push("risk_summary.risk_summary is required");
  }
  if (!is_non_empty_string(risk_summary.boundary_summary)) {
    errors.push("risk_summary.boundary_summary is required");
  }
  if (!is_non_empty_string(risk_summary.non_executing_posture)) {
    errors.push("risk_summary.non_executing_posture is required");
  }

  if (
    evidence_sufficiency.sufficiency_state !== "insufficient" &&
    evidence_sufficiency.sufficiency_state !== "partial" &&
    evidence_sufficiency.sufficiency_state !== "sufficient"
  ) {
    errors.push("evidence_sufficiency.sufficiency_state is required");
  }
  if (!is_non_empty_string(evidence_sufficiency.sufficiency_summary)) {
    errors.push("evidence_sufficiency.sufficiency_summary is required");
  }
  if (evidence_sufficiency.runtime_private_fields_omitted !== true) {
    errors.push("evidence_sufficiency.runtime_private_fields_omitted must be true");
  }

  if (!is_non_empty_string(missing_information.missing_information_summary)) {
    errors.push("missing_information.missing_information_summary is required");
  }
  if (!Array.isArray(missing_information.missing_information_items)) {
    errors.push("missing_information.missing_information_items must be an array");
  } else {
    missing_information.missing_information_items.forEach((entry, index) => {
      if (!is_non_empty_string(entry)) {
        errors.push(
          `missing_information.missing_information_items[${index}] must remain a non-empty bounded field.`
        );
      }
    });
  }
  if (missing_information.runtime_private_fields_omitted !== true) {
    errors.push("missing_information.runtime_private_fields_omitted must be true");
  }

  if (typeof confirmation_requirement.confirmation_required !== "boolean") {
    errors.push("confirmation_requirement.confirmation_required is required");
  }
  if (!is_non_empty_string(confirmation_requirement.confirmation_summary)) {
    errors.push("confirmation_requirement.confirmation_summary is required");
  }
  if (!is_non_empty_string(confirmation_requirement.non_executing_posture)) {
    errors.push("confirmation_requirement.non_executing_posture is required");
  }
  if (confirmation_requirement.runtime_private_fields_omitted !== true) {
    errors.push(
      "confirmation_requirement.runtime_private_fields_omitted must be true"
    );
  }

  if (!is_non_empty_string(boundary_posture.non_executing_posture)) {
    errors.push("boundary_posture.non_executing_posture is required");
  }
  if (boundary_posture.provider_channel_execution_available !== false) {
    errors.push(
      "boundary_posture.provider_channel_execution_available must be false"
    );
  }
  if (boundary_posture.approval_dispatch_execution_available !== false) {
    errors.push(
      "boundary_posture.approval_dispatch_execution_available must be false"
    );
  }
  if (boundary_posture.queue_available !== false) {
    errors.push("boundary_posture.queue_available must be false");
  }
  if (boundary_posture.runtime_private_fields_omitted !== true) {
    errors.push("boundary_posture.runtime_private_fields_omitted must be true");
  }

  const safe_evidence_refs = validate_safe_evidence_refs(
    candidate.safe_evidence_refs,
    errors
  );

  if (!is_non_empty_string(candidate.created_at)) {
    errors.push("created_at is required");
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors: [...new Set(errors)],
    };
  }

  return {
    ok: true,
    errors: [],
    value: value as PreparedActionProjection,
  };
}

export function is_prepared_action_projection(
  value: unknown
): value is PreparedActionProjection {
  return validate_prepared_action_projection(value).ok;
}
