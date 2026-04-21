import { createHash } from "node:crypto";

import {
  FORBIDDEN_PROJECTION_ACTION_LABELS,
  FORBIDDEN_PROJECTION_RAW_KEYS,
  type CreateRuntimeEvidenceInsufficiencyDetailInput,
  type CreateRuntimeEvidencePostureSummaryInput,
  type CreateRuntimeNonExecutingRecommendationEnvelopeInput,
  type CreateRuntimeProjectionRevisionEnvelopeInput,
  type CreateRuntimeProjectionSafeStateExposureInput,
  type CreateRuntimeProjectionSummaryEnvelopeInput,
  type RuntimeBlockedProjectionAction,
  type RuntimeEvidenceInsufficiencyCategory,
  type RuntimeEvidenceInsufficiencyDetail,
  type RuntimeEvidencePostureSummary,
  type RuntimeNonExecutingRecommendationEnvelope,
  type RuntimeProjectionRevisionEnvelope,
  type RuntimeProjectionRevisionReason,
  type RuntimeProjectionSafeStateExposure,
  type RuntimeProjectionSummaryEnvelope,
} from "./projection-types.ts";

const DEFAULT_CREATED_AT = "1970-01-01T00:00:00.000Z";

const CANONICAL_BLOCKED_ACTIONS: RuntimeBlockedProjectionAction[] = [
  "approve",
  "reject",
  "dispatch",
  "execute",
  "provider_channel_send",
];

const STATE_INTERPRETATION = {
  transition_accepted_meaning: "state evaluation accepted, not approval",
  terminal_meaning: "state line terminal, not execution complete",
  blocked_reason_meaning: "blocked state transition reason, not task failure verdict",
} as const;

const EVIDENCE_INTERPRETATION = {
  evidence_summary_meaning: "summary, not proof or certification",
} as const;

const REVISION_REASONS: RuntimeProjectionRevisionReason[] = [
  "insufficient_evidence",
  "stale_context",
  "operator_clarification",
  "contract_blocked",
  "other",
];

const INSUFFICIENCY_CATEGORIES: RuntimeEvidenceInsufficiencyCategory[] = [
  "missing_required_context",
  "stale_context",
  "conflicting_evidence",
  "runtime_private_omitted",
  "other",
];

const FORBIDDEN_RUNTIME_SEMANTIC_PATTERNS = [
  {
    pattern: /provider\/channel execution/i,
    error: "provider/channel execution is not allowed",
  },
  {
    pattern: /\bqueue(?:\s+implementation|\s+execution)?\b/i,
    error: "queue implementation is not allowed",
  },
] as const;

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

function unique_strings(values: unknown[] = []): string[] {
  return [...new Set(
    values.filter(
      (value): value is string => typeof value === "string" && value.length > 0
    )
  )].sort();
}

function deterministic_id(prefix: string, seed: string): string {
  return `${prefix}_${createHash("sha1").update(seed).digest("hex").slice(0, 16)}`;
}

function created_at_or_default(value: string | undefined): string {
  return typeof value === "string" && value.length > 0
    ? value
    : DEFAULT_CREATED_AT;
}

function collect_forbidden_raw_key_errors(
  value: unknown,
  path = "root",
  target: string[] = []
): string[] {
  if (!value || typeof value !== "object") {
    return target;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collect_forbidden_raw_key_errors(item, `${path}[${index}]`, target);
    });
    return target;
  }

  for (const [key, nested] of Object.entries(value)) {
    if ((FORBIDDEN_PROJECTION_RAW_KEYS as readonly string[]).includes(key)) {
      target.push(`forbidden raw key at ${path}.${key}`);
    }
    collect_forbidden_raw_key_errors(nested, `${path}.${key}`, target);
  }

  return target;
}

function collect_forbidden_action_label_errors(
  value: unknown,
  path = "root",
  target: string[] = []
): string[] {
  if (typeof value === "string") {
    if ((FORBIDDEN_PROJECTION_ACTION_LABELS as readonly string[]).includes(value)) {
      target.push(`forbidden action label at ${path}: ${value}`);
    }
    return target;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collect_forbidden_action_label_errors(item, `${path}[${index}]`, target);
    });
    return target;
  }

  if (!value || typeof value !== "object") {
    return target;
  }

  for (const [key, nested] of Object.entries(value)) {
    collect_forbidden_action_label_errors(nested, `${path}.${key}`, target);
  }

  return target;
}

function collect_forbidden_direct_action_errors(
  value: unknown,
  path = "root",
  target: string[] = []
): string[] {
  if (typeof value === "string") {
    if ((CANONICAL_BLOCKED_ACTIONS as readonly string[]).includes(value)) {
      target.push(`forbidden action label at ${path}: ${value}`);
    }
    return target;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collect_forbidden_direct_action_errors(item, `${path}[${index}]`, target);
    });
    return target;
  }

  if (!value || typeof value !== "object") {
    return target;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (key === "blocked_actions") {
      continue;
    }
    collect_forbidden_direct_action_errors(nested, `${path}.${key}`, target);
  }

  return target;
}

function stable_stringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stable_stringify(item)).join(",")}]`;
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

function assert_valid_result(result: ValidationResult): void {
  if (!result.valid) {
    throw new Error(result.errors.join("; "));
  }
}

function collect_evidence_claim_errors(
  value: unknown,
  target: string[] = []
): string[] {
  if (typeof value === "string") {
    if (/(proof|certification)/i.test(value)) {
      target.push("evidence detail is not proof or certification");
    }
    return target;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      collect_evidence_claim_errors(item, target);
    });
    return target;
  }

  if (!value || typeof value !== "object") {
    return target;
  }

  for (const nested of Object.values(value)) {
    collect_evidence_claim_errors(nested, target);
  }

  return target;
}

function collect_forbidden_runtime_semantic_errors(
  value: unknown,
  target: string[] = []
): string[] {
  if (typeof value === "string") {
    for (const { pattern, error } of FORBIDDEN_RUNTIME_SEMANTIC_PATTERNS) {
      if (pattern.test(value)) {
        target.push(error);
      }
    }
    return target;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      collect_forbidden_runtime_semantic_errors(item, target);
    });
    return target;
  }

  if (!value || typeof value !== "object") {
    return target;
  }

  for (const nested of Object.values(value)) {
    collect_forbidden_runtime_semantic_errors(nested, target);
  }

  return target;
}

function collect_nested_project_consistency_errors(
  summary: Record<string, unknown>,
  target: string[] = []
): string[] {
  const envelope_project_id = summary.project_id;
  if (typeof envelope_project_id !== "string" || envelope_project_id.length === 0) {
    return target;
  }

  const nested_checks: Array<{
    key: "state_exposure" | "evidence_posture" | "recommendation";
    error: string;
  }> = [
    {
      key: "state_exposure",
      error: "state_exposure.project_id must match envelope project_id",
    },
    {
      key: "evidence_posture",
      error: "evidence_posture.project_id must match envelope project_id",
    },
    {
      key: "recommendation",
      error: "recommendation.project_id must match envelope project_id",
    },
  ];

  for (const check of nested_checks) {
    const nested = summary[check.key];
    if (!nested || typeof nested !== "object") {
      continue;
    }

    const nested_project_id = (nested as Record<string, unknown>).project_id;
    if (
      typeof nested_project_id === "string" &&
      nested_project_id.length > 0 &&
      nested_project_id !== envelope_project_id
    ) {
      target.push(check.error);
    }
  }

  return target;
}

export class DeterministicProjectionService {
  create_evidence_insufficiency_detail(
    input: CreateRuntimeEvidenceInsufficiencyDetailInput
  ): RuntimeEvidenceInsufficiencyDetail {
    assert_valid_result(this.validate_evidence_insufficiency_detail(input));

    return {
      detail_id: input.detail_id,
      project_id: input.project_id,
      evidence_available: input.evidence_available,
      insufficient: input.insufficient,
      stale: input.stale,
      insufficiency_category: input.insufficiency_category,
      omission_reason: input.omission_reason,
      required_evidence_class: input.required_evidence_class,
      safe_evidence_refs: unique_strings(input.safe_evidence_refs ?? []),
      safe_clarification_prompt: input.safe_clarification_prompt,
      non_executing: true,
      runtime_private_fields_omitted: true,
    };
  }

  create_state_exposure(
    input: CreateRuntimeProjectionSafeStateExposureInput
  ): RuntimeProjectionSafeStateExposure {
    assert_valid_result(this.validate_projection_summary(input));

    const created_at = created_at_or_default(input.created_at);
    const projection_id =
      input.projection_id ??
      deterministic_id(
        "projection_state",
        stable_stringify({
          project_id: input.project_id,
          source_runtime_ref: input.source_runtime_ref,
          state_summary: input.state_summary,
          created_at,
        })
      );

    return {
      projection_id,
      project_id: input.project_id,
      source_runtime_ref: input.source_runtime_ref,
      state_summary: {
        ...input.state_summary,
      },
      interpretation: STATE_INTERPRETATION,
      non_executing: true,
      created_at,
    };
  }

  create_evidence_posture_summary(
    input: CreateRuntimeEvidencePostureSummaryInput
  ): RuntimeEvidencePostureSummary {
    assert_valid_result(this.validate_projection_summary(input));

    const created_at = created_at_or_default(input.created_at);
    const evidence_refs = unique_strings(input.evidence_refs ?? []);
    const evidence_available =
      typeof input.evidence_available === "boolean"
        ? input.evidence_available
        : evidence_refs.length > 0;
    const evidence_summary_id =
      input.evidence_summary_id ??
      deterministic_id(
        "evidence_posture",
        stable_stringify({
          project_id: input.project_id,
          evidence_refs,
          evidence_summary: input.evidence_summary,
          stale: input.stale,
          insufficient: input.insufficient,
          omission_reason: input.omission_reason,
          confidence_posture: input.confidence_posture,
          created_at,
        })
      );

    return {
      evidence_summary_id,
      project_id: input.project_id,
      evidence_available,
      evidence_refs,
      evidence_summary: input.evidence_summary,
      stale: input.stale,
      insufficient: input.insufficient,
      omission_reason: input.omission_reason,
      confidence_posture: input.confidence_posture,
      interpretation: EVIDENCE_INTERPRETATION,
      created_at,
    };
  }

  create_projection_revision_envelope(
    input: CreateRuntimeProjectionRevisionEnvelopeInput
  ): RuntimeProjectionRevisionEnvelope {
    assert_valid_result(this.validate_projection_revision_envelope(input));

    return {
      revision_id: input.revision_id,
      project_id: input.project_id,
      previous_projection_summary_id: input.previous_projection_summary_id,
      revision_reason: input.revision_reason,
      revision_input_summary: input.revision_input_summary,
      evidence_insufficiency: input.evidence_insufficiency,
      resulting_projection_summary_id: input.resulting_projection_summary_id,
      non_executing: true,
      runtime_private_fields_omitted: true,
    };
  }

  create_non_executing_recommendation(
    input: CreateRuntimeNonExecutingRecommendationEnvelopeInput
  ): RuntimeNonExecutingRecommendationEnvelope {
    assert_valid_result(this.validate_projection_summary(input));

    const created_at = created_at_or_default(input.created_at);
    const provided_labels = unique_strings(input.blocked_actions ?? []);
    const invalid_labels = provided_labels.filter((label) =>
      (FORBIDDEN_PROJECTION_ACTION_LABELS as readonly string[]).includes(label)
    );

    if (invalid_labels.length > 0) {
      throw new Error(
        `forbidden action labels in recommendation input: ${invalid_labels.join(", ")}`
      );
    }

    const recommendation_id =
      input.recommendation_id ??
      deterministic_id(
        "recommendation",
        stable_stringify({
          project_id: input.project_id,
          recommendation_summary: input.recommendation_summary,
          recommended_next_posture: input.recommended_next_posture,
          allowed_next_step: input.allowed_next_step,
          created_at,
        })
      );

    return {
      recommendation_id,
      project_id: input.project_id,
      recommendation_summary: input.recommendation_summary,
      recommended_next_posture: input.recommended_next_posture,
      allowed_next_step: input.allowed_next_step,
      blocked_actions: [...CANONICAL_BLOCKED_ACTIONS],
      non_executing: true,
      requires_later_authorization: true,
      created_at,
    };
  }

  create_projection_summary_envelope(
    input: CreateRuntimeProjectionSummaryEnvelopeInput
  ): RuntimeProjectionSummaryEnvelope {
    assert_valid_result(this.validate_projection_summary(input));

    const created_at = created_at_or_default(input.created_at);
    const source_refs = unique_strings(input.source_refs ?? []);
    const projection_summary_id =
      input.projection_summary_id ??
      deterministic_id(
        "projection_summary",
        stable_stringify({
          project_id: input.project_id,
          state_exposure_id: input.state_exposure?.projection_id,
          evidence_summary_id: input.evidence_posture?.evidence_summary_id,
          recommendation_id: input.recommendation?.recommendation_id,
          source_refs,
          created_at,
        })
      );

    const summary: RuntimeProjectionSummaryEnvelope = {
      projection_summary_id,
      project_id: input.project_id,
      state_exposure: input.state_exposure,
      evidence_posture: input.evidence_posture,
      recommendation: input.recommendation,
      source_refs,
      non_executing: true,
      runtime_private_fields_omitted: true,
      created_at,
    };

    assert_valid_result(this.validate_projection_summary(summary));
    return summary;
  }

  validate_evidence_insufficiency_detail(detail: unknown): ValidationResult {
    const errors = [
      ...collect_forbidden_raw_key_errors(detail, "detail"),
      ...collect_forbidden_action_label_errors(detail, "detail"),
      ...collect_forbidden_direct_action_errors(detail, "detail"),
      ...collect_evidence_claim_errors(detail),
      ...collect_forbidden_runtime_semantic_errors(detail),
    ];

    if (!detail || typeof detail !== "object" || Array.isArray(detail)) {
      errors.push("detail must be an object");
      return {
        valid: false,
        errors: [...new Set(errors)].sort(),
      };
    }

    const candidate = detail as Record<string, unknown>;

    if (typeof candidate.detail_id !== "string" || candidate.detail_id.length === 0) {
      errors.push("detail_id is required");
    }

    if (typeof candidate.project_id !== "string" || candidate.project_id.length === 0) {
      errors.push("project_id is required");
    }

    if (typeof candidate.evidence_available !== "boolean") {
      errors.push("evidence_available must be boolean");
    }

    if (typeof candidate.insufficient !== "boolean") {
      errors.push("insufficient must be boolean");
    }

    if (typeof candidate.stale !== "boolean") {
      errors.push("stale must be boolean");
    }

    if (candidate.non_executing !== true) {
      errors.push("non_executing must be true");
    }

    if (candidate.runtime_private_fields_omitted !== true) {
      errors.push("runtime_private_fields_omitted must be true");
    }

    if (
      candidate.insufficiency_category !== undefined &&
      !(
        typeof candidate.insufficiency_category === "string" &&
        INSUFFICIENCY_CATEGORIES.includes(
          candidate.insufficiency_category as RuntimeEvidenceInsufficiencyCategory
        )
      )
    ) {
      errors.push(
        "insufficiency_category must be one of missing_required_context, stale_context, conflicting_evidence, runtime_private_omitted, other"
      );
    }

    if (
      candidate.safe_evidence_refs !== undefined &&
      !Array.isArray(candidate.safe_evidence_refs)
    ) {
      errors.push("safe_evidence_refs must be an array");
    }

    if (Array.isArray(candidate.safe_evidence_refs)) {
      if (
        candidate.safe_evidence_refs.some(
          (value) => typeof value !== "string"
        )
      ) {
        errors.push("safe_evidence_refs must contain only non-empty strings");
      }

      if (
        candidate.safe_evidence_refs.some(
          (value) => typeof value === "string" && value.trim().length === 0
        )
      ) {
        errors.push("safe_evidence_refs must contain only non-empty strings");
      }
    }

    return {
      valid: errors.length === 0,
      errors: [...new Set(errors)].sort(),
    };
  }

  validate_projection_revision_envelope(revision: unknown): ValidationResult {
    const errors = [
      ...collect_forbidden_raw_key_errors(revision, "revision"),
      ...collect_forbidden_action_label_errors(revision, "revision"),
      ...collect_forbidden_direct_action_errors(revision, "revision"),
      ...collect_forbidden_runtime_semantic_errors(revision),
    ];

    if (!revision || typeof revision !== "object" || Array.isArray(revision)) {
      errors.push("revision must be an object");
      return {
        valid: false,
        errors: [...new Set(errors)].sort(),
      };
    }

    const candidate = revision as Record<string, unknown>;

    if (typeof candidate.revision_id !== "string" || candidate.revision_id.length === 0) {
      errors.push("revision_id is required");
    }

    if (typeof candidate.project_id !== "string" || candidate.project_id.length === 0) {
      errors.push("project_id is required");
    }

    if (
      typeof candidate.previous_projection_summary_id !== "string" ||
      candidate.previous_projection_summary_id.length === 0
    ) {
      errors.push("previous_projection_summary_id is required");
    }

    if (
      !(
        typeof candidate.revision_reason === "string" &&
        REVISION_REASONS.includes(
          candidate.revision_reason as RuntimeProjectionRevisionReason
        )
      )
    ) {
      errors.push(
        "revision_reason must be one of insufficient_evidence, stale_context, operator_clarification, contract_blocked, other"
      );
    }

    if (
      typeof candidate.revision_input_summary !== "string" ||
      candidate.revision_input_summary.length === 0
    ) {
      errors.push("revision_input_summary is required");
    }

    if (
      candidate.resulting_projection_summary_id !== undefined &&
      (
        typeof candidate.resulting_projection_summary_id !== "string" ||
        candidate.resulting_projection_summary_id.length === 0
      )
    ) {
      errors.push("resulting_projection_summary_id must be non-empty when provided");
    }

    if (candidate.non_executing !== true) {
      errors.push("non_executing must be true");
    }

    if (candidate.runtime_private_fields_omitted !== true) {
      errors.push("runtime_private_fields_omitted must be true");
    }

    const detail = candidate.evidence_insufficiency;
    if (detail !== undefined) {
      const detail_validation = this.validate_evidence_insufficiency_detail(detail);
      errors.push(...detail_validation.errors);

      if (
        detail &&
        typeof detail === "object" &&
        !Array.isArray(detail) &&
        typeof (detail as Record<string, unknown>).project_id === "string" &&
        typeof candidate.project_id === "string" &&
        (detail as Record<string, unknown>).project_id !== candidate.project_id
      ) {
        errors.push("evidence_insufficiency.project_id must match revision project_id");
      }
    }

    return {
      valid: errors.length === 0,
      errors: [...new Set(errors)].sort(),
    };
  }

  validate_projection_summary(summary: unknown): ValidationResult {
    const errors = [
      ...collect_forbidden_raw_key_errors(summary),
      ...collect_forbidden_action_label_errors(summary),
    ];

    if (!summary || typeof summary !== "object") {
      errors.push("summary must be an object");
      return {
        valid: false,
        errors: [...new Set(errors)].sort(),
      };
    }

    const candidate = summary as Record<string, unknown>;
    collect_nested_project_consistency_errors(candidate, errors);

    if ("non_executing" in candidate && candidate.non_executing !== true) {
      errors.push("non_executing must be true");
    }

    if (
      "runtime_private_fields_omitted" in candidate &&
      candidate.runtime_private_fields_omitted !== true
    ) {
      errors.push("runtime_private_fields_omitted must be true");
    }

    const recommendation = candidate.recommendation;
    if (recommendation && typeof recommendation === "object") {
      const blocked_actions = (recommendation as Record<string, unknown>).blocked_actions;
      if (!Array.isArray(blocked_actions)) {
        errors.push("recommendation.blocked_actions must be an array");
      } else {
        const action_labels = unique_strings(blocked_actions);
        const missing_actions = CANONICAL_BLOCKED_ACTIONS.filter(
          (label) => !action_labels.includes(label)
        );
        if (missing_actions.length > 0) {
          errors.push(
            `recommendation.blocked_actions missing required labels: ${missing_actions.join(", ")}`
          );
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: [...new Set(errors)].sort(),
    };
  }
}
