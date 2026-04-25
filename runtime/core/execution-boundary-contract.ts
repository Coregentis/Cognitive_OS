import type {
  ExecutionBoundaryProjection,
  ExecutionBoundarySafeEvidenceRef,
} from "./execution-boundary-types.ts";

type ExecutionBoundaryRecord = Record<string, unknown>;

export type ExecutionBoundaryValidationResult = {
  ok: boolean;
  errors: string[];
};

export const FORBIDDEN_EXECUTION_BOUNDARY_RAW_KEYS = [
  "raw_vsl",
  "raw_psg",
  "raw_trace",
  "runtime_private_payload",
] as const;

export const FORBIDDEN_EXECUTION_BOUNDARY_EXECUTION_KEYS = [
  "execution_result",
  "dispatch_result",
  "approval_result",
  "provider_channel_result",
  "queue_state",
  "authoritative_transition_state",
] as const;

const FORBIDDEN_EXECUTION_BOUNDARY_POSITIVE_PHRASES = [
  "provider/channel execution available",
  "approve/reject/dispatch/execute available",
  "queue implementation available",
  "autonomous operation available",
  "approval granted",
  "execution completed",
  "execution ready",
  "dispatch-ready",
] as const;

function as_record(value: unknown): ExecutionBoundaryRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as ExecutionBoundaryRecord;
}

function is_non_empty_string(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function require_string(
  value: unknown,
  field_name: string,
  errors: string[]
): string {
  if (!is_non_empty_string(value)) {
    errors.push(`${field_name} is required`);
    return "";
  }

  return value.trim();
}

function require_string_array(
  value: unknown,
  field_name: string,
  errors: string[]
): string[] {
  if (!Array.isArray(value)) {
    errors.push(`${field_name} must be an array`);
    return [];
  }

  return value.map((entry, index) =>
    require_string(entry, `${field_name}[${index}]`, errors)
  );
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
    if (
      (FORBIDDEN_EXECUTION_BOUNDARY_RAW_KEYS as readonly string[]).includes(key)
    ) {
      target.push(`forbidden runtime-private field: ${key}`);
    }

    if (
      (FORBIDDEN_EXECUTION_BOUNDARY_EXECUTION_KEYS as readonly string[]).includes(key)
    ) {
      if (key === "queue_state") {
        target.push(`forbidden queue field: ${key}`);
      } else if (key === "authoritative_transition_state") {
        target.push(`forbidden authoritative transition field: ${key}`);
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

    for (const phrase of FORBIDDEN_EXECUTION_BOUNDARY_POSITIVE_PHRASES) {
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
): ExecutionBoundarySafeEvidenceRef[] {
  if (!Array.isArray(value)) {
    errors.push("safe_evidence_refs must be an array");
    return [];
  }

  const refs: ExecutionBoundarySafeEvidenceRef[] = [];

  value.forEach((entry, index) => {
    const record = as_record(entry);
    const allowed_keys = ["evidence_ref", "evidence_label"];
    const unexpected_keys = Object.keys(record).filter(
      (key) => !allowed_keys.includes(key)
    );

    if (unexpected_keys.length > 0) {
      errors.push(`safe_evidence_refs[${index}] must remain reference-only`);
      return;
    }

    const evidence_ref = require_string(
      record.evidence_ref,
      `safe_evidence_refs[${index}].evidence_ref`,
      errors
    );
    const evidence_label =
      record.evidence_label === undefined
        ? undefined
        : require_string(
            record.evidence_label,
            `safe_evidence_refs[${index}].evidence_label`,
            errors
          );

    if (evidence_ref.length > 0) {
      refs.push({
        evidence_ref,
        evidence_label:
          typeof evidence_label === "string" ? evidence_label : undefined,
      });
    }
  });

  return refs;
}

export function validate_execution_boundary_projection(
  candidate: unknown
): ExecutionBoundaryValidationResult {
  const errors = [
    ...collect_forbidden_key_errors(candidate),
    ...collect_forbidden_phrase_errors(candidate),
  ];

  const record = as_record(candidate);
  const requirement_summary = as_record(record.requirement_summary);
  const risk_warning = as_record(record.risk_warning);
  const preflight_checklist = as_record(record.preflight_checklist);
  const acknowledgment_requirement = as_record(record.acknowledgment_requirement);
  const transition_posture = as_record(record.transition_posture);

  require_string(record.execution_boundary_id, "execution_boundary_id", errors);
  require_string(record.project_id, "project_id", errors);
  require_string(
    requirement_summary.requirement_summary,
    "requirement_summary.requirement_summary",
    errors
  );
  require_string(
    requirement_summary.non_executing_posture,
    "requirement_summary.non_executing_posture",
    errors
  );
  require_string(
    risk_warning.risk_warning,
    "risk_warning.risk_warning",
    errors
  );
  require_string(
    risk_warning.non_executing_posture,
    "risk_warning.non_executing_posture",
    errors
  );
  require_string_array(
    preflight_checklist.preflight_checklist,
    "preflight_checklist.preflight_checklist",
    errors
  );

  if (preflight_checklist.runtime_private_fields_omitted !== true) {
    errors.push(
      "preflight_checklist.runtime_private_fields_omitted must be true"
    );
  }

  if (typeof acknowledgment_requirement.acknowledgment_required !== "boolean") {
    errors.push(
      "acknowledgment_requirement.acknowledgment_required is required"
    );
  }

  require_string(
    acknowledgment_requirement.acknowledgment_requirement,
    "acknowledgment_requirement.acknowledgment_requirement",
    errors
  );
  require_string(
    acknowledgment_requirement.non_executing_posture,
    "acknowledgment_requirement.non_executing_posture",
    errors
  );

  if (acknowledgment_requirement.runtime_private_fields_omitted !== true) {
    errors.push(
      "acknowledgment_requirement.runtime_private_fields_omitted must be true"
    );
  }

  require_string(
    transition_posture.non_executing_posture,
    "transition_posture.non_executing_posture",
    errors
  );

  if (transition_posture.provider_channel_execution_available !== false) {
    errors.push(
      "transition_posture.provider_channel_execution_available must be false"
    );
  }

  if (transition_posture.approval_dispatch_execution_available !== false) {
    errors.push(
      "transition_posture.approval_dispatch_execution_available must be false"
    );
  }

  if (transition_posture.queue_available !== false) {
    errors.push("transition_posture.queue_available must be false");
  }

  if (transition_posture.authoritative_transition_state_available !== false) {
    errors.push(
      "transition_posture.authoritative_transition_state_available must be false"
    );
  }

  if (transition_posture.runtime_private_fields_omitted !== true) {
    errors.push(
      "transition_posture.runtime_private_fields_omitted must be true"
    );
  }

  validate_safe_evidence_refs(record.safe_evidence_refs, errors);

  if (record.runtime_private_fields_omitted !== true) {
    errors.push("runtime_private_fields_omitted must be true");
  }

  require_string(record.created_at, "created_at", errors);

  return {
    ok: errors.length === 0,
    errors: [...new Set(errors)].sort(),
  };
}

export function is_execution_boundary_projection(
  candidate: unknown
): candidate is ExecutionBoundaryProjection {
  return validate_execution_boundary_projection(candidate).ok;
}
