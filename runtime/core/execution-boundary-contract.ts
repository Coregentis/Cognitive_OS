import {
  EXECUTION_BOUNDARY_DEFAULT_NON_EXECUTING_POSTURE,
} from "./execution-boundary-types.ts";
import type {
  CreateExecutionBoundaryAcknowledgmentRequirementInput,
  CreateExecutionBoundaryPreflightChecklistInput,
  CreateExecutionBoundaryProjectionInput,
  CreateExecutionBoundaryRequirementSummaryInput,
  CreateExecutionBoundaryRiskWarningInput,
  CreateExecutionBoundaryTransitionPostureInput,
  ExecutionBoundaryAcknowledgmentRequirement,
  ExecutionBoundaryPreflightChecklist,
  ExecutionBoundaryProjection,
  ExecutionBoundaryRequirementSummary,
  ExecutionBoundaryRiskWarning,
  ExecutionBoundarySafeEvidenceRef,
  ExecutionBoundarySafeEvidenceRefInput,
  ExecutionBoundaryTransitionPosture,
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

const DEFAULT_CREATED_AT = "1970-01-01T00:00:00.000Z";

function as_record(value: unknown): ExecutionBoundaryRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as ExecutionBoundaryRecord;
}

function is_non_empty_string(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

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
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return `${prefix}_${hash.toString(16).padStart(8, "0")}`;
}

function created_at_or_default(value: unknown): string {
  return is_non_empty_string(value) ? value.trim() : DEFAULT_CREATED_AT;
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

function require_string_strict(value: unknown, field_name: string): string {
  const errors: string[] = [];
  const result = require_string(value, field_name, errors);

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  return result;
}

function require_string_array_strict(
  value: unknown,
  field_name: string
): string[] {
  const errors: string[] = [];
  const result = require_string_array(value, field_name, errors);

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  return result;
}

function normalize_non_executing_posture(value: unknown): string {
  if (value === undefined) {
    return EXECUTION_BOUNDARY_DEFAULT_NON_EXECUTING_POSTURE;
  }

  if (!is_non_empty_string(value)) {
    throw new Error("non_executing_posture is required");
  }

  return value.trim();
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

function normalize_safe_evidence_ref_input(
  value: ExecutionBoundarySafeEvidenceRefInput,
  index: number
): ExecutionBoundarySafeEvidenceRef {
  if (typeof value === "string") {
    return {
      evidence_ref: require_string_strict(
        value,
        `safe_evidence_refs[${index}]`
      ),
    };
  }

  const record = as_record(value);
  const allowed_keys = ["evidence_ref", "evidence_label"];
  const unexpected_keys = Object.keys(record).filter(
    (key) => !allowed_keys.includes(key)
  );

  if (unexpected_keys.length > 0) {
    throw new Error(`safe_evidence_refs[${index}] must remain reference-only`);
  }

  return {
    evidence_ref: require_string_strict(
      record.evidence_ref,
      `safe_evidence_refs[${index}].evidence_ref`
    ),
    evidence_label:
      record.evidence_label === undefined
        ? undefined
        : require_string_strict(
            record.evidence_label,
            `safe_evidence_refs[${index}].evidence_label`
          ),
  };
}

function normalize_safe_evidence_refs_input(
  value: ExecutionBoundarySafeEvidenceRefInput[] | undefined
): ExecutionBoundarySafeEvidenceRef[] {
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

function assert_execution_boundary(value: unknown): void {
  const errors = [
    ...collect_forbidden_key_errors(value),
    ...collect_forbidden_phrase_errors(value),
  ];

  if (errors.length > 0) {
    throw new Error([...new Set(errors)].join("; "));
  }
}

export function createExecutionBoundaryRequirementSummary(
  input:
    | ExecutionBoundaryRequirementSummary
    | CreateExecutionBoundaryRequirementSummaryInput
): ExecutionBoundaryRequirementSummary {
  assert_execution_boundary(input);

  return {
    requirement_summary: require_string_strict(
      input.requirement_summary,
      "requirement_summary"
    ),
    non_executing_posture: normalize_non_executing_posture(
      input.non_executing_posture
    ),
  };
}

export function createExecutionBoundaryRiskWarning(
  input:
    | ExecutionBoundaryRiskWarning
    | CreateExecutionBoundaryRiskWarningInput
): ExecutionBoundaryRiskWarning {
  assert_execution_boundary(input);

  return {
    risk_warning: require_string_strict(input.risk_warning, "risk_warning"),
    non_executing_posture: normalize_non_executing_posture(
      input.non_executing_posture
    ),
  };
}

export function createExecutionBoundaryPreflightChecklist(
  input:
    | ExecutionBoundaryPreflightChecklist
    | CreateExecutionBoundaryPreflightChecklistInput
): ExecutionBoundaryPreflightChecklist {
  assert_execution_boundary(input);

  return {
    preflight_checklist: require_string_array_strict(
      input.preflight_checklist,
      "preflight_checklist"
    ),
    runtime_private_fields_omitted: true,
  };
}

export function createExecutionBoundaryAcknowledgmentRequirement(
  input:
    | ExecutionBoundaryAcknowledgmentRequirement
    | CreateExecutionBoundaryAcknowledgmentRequirementInput
): ExecutionBoundaryAcknowledgmentRequirement {
  assert_execution_boundary(input);

  if (typeof input.acknowledgment_required !== "boolean") {
    throw new Error("acknowledgment_required is required");
  }

  return {
    acknowledgment_required: input.acknowledgment_required,
    acknowledgment_requirement: require_string_strict(
      input.acknowledgment_requirement,
      "acknowledgment_requirement"
    ),
    runtime_private_fields_omitted: true,
    non_executing_posture: normalize_non_executing_posture(
      input.non_executing_posture
    ),
  };
}

export function createExecutionBoundaryTransitionPosture(
  input:
    | ExecutionBoundaryTransitionPosture
    | CreateExecutionBoundaryTransitionPostureInput = {}
): ExecutionBoundaryTransitionPosture {
  assert_execution_boundary(input);

  return {
    non_executing_posture: normalize_non_executing_posture(
      input.non_executing_posture
    ),
    provider_channel_execution_available: false,
    approval_dispatch_execution_available: false,
    queue_available: false,
    authoritative_transition_state_available: false,
    runtime_private_fields_omitted: true,
  };
}

export function createExecutionBoundaryProjection(
  input: CreateExecutionBoundaryProjectionInput
): ExecutionBoundaryProjection {
  assert_execution_boundary(input);

  const requirement_summary = createExecutionBoundaryRequirementSummary(
    input.requirement_summary
  );
  const risk_warning = createExecutionBoundaryRiskWarning(input.risk_warning);
  const preflight_checklist = createExecutionBoundaryPreflightChecklist(
    input.preflight_checklist
  );
  const acknowledgment_requirement =
    createExecutionBoundaryAcknowledgmentRequirement(
      input.acknowledgment_requirement
    );
  const transition_posture = createExecutionBoundaryTransitionPosture(
    input.transition_posture ?? {}
  );
  const safe_evidence_refs = normalize_safe_evidence_refs_input(
    input.safe_evidence_refs
  );

  const projection: ExecutionBoundaryProjection = {
    execution_boundary_id: is_non_empty_string(input.execution_boundary_id)
      ? input.execution_boundary_id.trim()
      : deterministic_id(
          "execution_boundary",
          stable_stringify({
            project_id: input.project_id,
            requirement_summary,
            risk_warning,
            preflight_checklist,
            acknowledgment_requirement,
            transition_posture,
            safe_evidence_refs,
            created_at: created_at_or_default(input.created_at),
          })
        ),
    project_id: require_string_strict(input.project_id, "project_id"),
    requirement_summary,
    risk_warning,
    preflight_checklist,
    acknowledgment_requirement,
    transition_posture,
    safe_evidence_refs,
    runtime_private_fields_omitted: true,
    created_at: created_at_or_default(input.created_at),
  };

  const result = validate_execution_boundary_projection(projection);
  if (!result.ok) {
    throw new Error(result.errors.join("; "));
  }

  return projection;
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
