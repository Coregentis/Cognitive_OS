import { createHash } from "node:crypto";

import {
  FORBIDDEN_PROJECTION_ACTION_LABELS,
  FORBIDDEN_PROJECTION_RAW_KEYS,
  type CreateRuntimeEvidencePostureSummaryInput,
  type CreateRuntimeNonExecutingRecommendationEnvelopeInput,
  type CreateRuntimeProjectionSafeStateExposureInput,
  type CreateRuntimeProjectionSummaryEnvelopeInput,
  type RuntimeBlockedProjectionAction,
  type RuntimeEvidencePostureSummary,
  type RuntimeNonExecutingRecommendationEnvelope,
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
