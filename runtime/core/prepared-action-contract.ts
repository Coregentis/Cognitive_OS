import type {
  PreparedActionProjection,
  PreparedActionSafeEvidenceRef,
} from "./prepared-action-types.ts";

type PreparedActionRecord = Record<string, unknown>;

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

function as_record(value: unknown): PreparedActionRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as PreparedActionRecord;
}

function is_non_empty_string(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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
