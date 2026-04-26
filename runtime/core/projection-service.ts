import { createHash } from "node:crypto";

import {
  FORBIDDEN_PROJECTION_ACTION_LABELS,
  FORBIDDEN_PROJECTION_RAW_KEYS,
  type CreateOperationalUnitRuntimeProjectionInput,
  type CreateWorkforceProjectionSafeEnvelopeInput,
  type CreateRuntimeContinuitySnapshotProjectionInput,
  type CreateRuntimeEvidenceInsufficiencyDetailInput,
  type CreateRuntimeEvidencePostureSummaryInput,
  type CreateRuntimeLifecycleContinuityProjectionInput,
  type CreateRuntimePendingReviewItemSummaryInput,
  type CreateRuntimePendingReviewProjectionInput,
  type CreateRuntimeNonExecutingRecommendationEnvelopeInput,
  type CreateRuntimeArtifactSummaryInput,
  type CreateRuntimeActionSummaryInput,
  type CreateRuntimeProjectionRevisionEnvelopeInput,
  type CreateRuntimeProjectionSafeStateExposureInput,
  type CreateRuntimeProjectionSummaryEnvelopeInput,
  type CreateRuntimePrioritySummaryInput,
  type CreateRuntimeReviewSummaryInput,
  type CreateRuntimeScopeSummaryInput,
  type CreateRuntimeStateProjectionInput,
  type CreateRuntimeSuggestedNextActionInput,
  type CreateRuntimeTaskSummaryInput,
  type CreateScopedLearningCandidateInput,
  type CreatePreferenceSuggestionInput,
  type CreateRuntimeLearningSummaryInput,
  type CreateRuntimeDriftImpactSummaryInput,
  type LearningScope,
  type OperationalUnitRuntimeProjection,
  type PreferenceSuggestion,
  type RuntimeActionSummary,
  type RuntimeArtifactSummary,
  type RuntimeBlockedProjectionAction,
  type RuntimeContinuitySnapshotProjection,
  type RuntimeEvidenceInsufficiencyCategory,
  type RuntimeEvidenceInsufficiencyDetail,
  type RuntimeEvidencePostureSummary,
  type RuntimeDriftImpactSummary,
  type RuntimeLearningSummary,
  type RuntimeLifecycleContinuityProjection,
  type RuntimePrioritySummary,
  type RuntimePendingReviewItemSummary,
  type RuntimePendingReviewProjection,
  type RuntimeNonExecutingRecommendationEnvelope,
  type RuntimeProjectionRevisionEnvelope,
  type RuntimeProjectionRevisionReason,
  type RuntimeProjectionSafeStateExposure,
  type RuntimeProjectionSummaryEnvelope,
  type RuntimeReviewSummary,
  type RuntimeScopeKind,
  type RuntimeScopeSummary,
  type RuntimeStateProjection,
  type RuntimeSuggestedNextAction,
  type RuntimeTaskSummary,
  type WorkforceProjectionSafeEnvelope,
  type ScopedLearningCandidate,
} from "./projection-types.ts";
import {
  classify_runtime_action,
} from "./policy-service.ts";
import type {
  RuntimeActionClass,
  RuntimeActionClassEvaluation,
  RuntimeActionReadinessStatus,
  RuntimeDeltaDriftImpactAssessment,
  RuntimeObjectRecord,
  RuntimeReconciliationSnapshot,
} from "./runtime-types.ts";

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

const FORBIDDEN_LIFECYCLE_RUNTIME_PRIVATE_FIELDS = [
  "raw_vsl",
  "raw_psg",
  "raw_trace",
  "runtime_private_payload",
] as const;

const FORBIDDEN_LIFECYCLE_EXECUTION_FIELDS = [
  "provider_channel_result",
  "dispatch_result",
  "approval_result",
  "execution_result",
] as const;

const FORBIDDEN_LIFECYCLE_QUEUE_FIELDS = [
  "queue_worker_state",
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

function collect_lifecycle_projection_forbidden_field_errors(
  value: unknown,
  target: string[] = []
): string[] {
  if (Array.isArray(value)) {
    value.forEach((item) => {
      collect_lifecycle_projection_forbidden_field_errors(item, target);
    });
    return target;
  }

  if (!value || typeof value !== "object") {
    return target;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      (
        FORBIDDEN_LIFECYCLE_RUNTIME_PRIVATE_FIELDS as readonly string[]
      ).includes(key)
    ) {
      target.push(`forbidden runtime-private field: ${key}`);
    }

    if (
      (
        FORBIDDEN_LIFECYCLE_EXECUTION_FIELDS as readonly string[]
      ).includes(key)
    ) {
      target.push(`forbidden execution field: ${key}`);
    }

    if (
      (
        FORBIDDEN_LIFECYCLE_QUEUE_FIELDS as readonly string[]
      ).includes(key)
    ) {
      target.push(`forbidden queue field: ${key}`);
    }

    collect_lifecycle_projection_forbidden_field_errors(nested, target);
  }

  return target;
}

function validate_safe_evidence_refs(
  value: unknown,
  field_name: string,
  target: string[]
): void {
  if (value === undefined) {
    return;
  }

  if (!Array.isArray(value)) {
    target.push(`${field_name} must be an array`);
    return;
  }

  if (
    value.some(
      (entry) => typeof entry !== "string" || entry.trim().length === 0
    )
  ) {
    target.push(`${field_name} must contain only non-empty strings`);
  }
}

function validate_required_string(
  candidate: Record<string, unknown>,
  key: string,
  target: string[]
): void {
  if (typeof candidate[key] !== "string" || (candidate[key] as string).length === 0) {
    target.push(`${key} is required`);
  }
}

function read_required_string(
  value: unknown,
  key: string
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function read_optional_string(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function read_string_array(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return unique_strings(value);
}

function assert_runtime_private_fields_omitted(value: unknown): true {
  if (value !== true) {
    throw new Error("runtime_private_fields_omitted must be true");
  }

  return true;
}

function as_non_negative_integer(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return undefined;
  }

  return value;
}

function normalize_scope_kind(
  value: unknown
): RuntimeScopeKind {
  switch (value) {
    case "project":
    case "operational_unit":
    case "work_scope":
    case "runtime_scope":
    case "other":
      return value;
    default:
      return "other";
  }
}

function stable_sort_by_key<TValue extends Record<string, unknown>>(
  values: TValue[],
  key: keyof TValue
): TValue[] {
  return [...values].sort((left, right) =>
    String(left[key] ?? "").localeCompare(String(right[key] ?? ""))
  );
}

function derive_runtime_action_readiness(args: {
  action_class: RuntimeActionClass;
  blocked?: boolean;
  requires_confirmation?: boolean;
}): RuntimeActionReadinessStatus {
  if (args.blocked === true || args.action_class === "forbidden_irreversible") {
    return "blocked";
  }

  if (args.action_class === "limited_external_dispatch") {
    return "deferred";
  }

  if (
    args.requires_confirmation === true ||
    args.action_class === "reviewable_local" ||
    args.action_class === "external_draft"
  ) {
    return "needs_review";
  }

  return "ready";
}

function derive_runtime_drift_recommendation(input: {
  contradiction_detected?: boolean;
  stale_context?: boolean;
  branch_recommended?: boolean;
  blocked?: boolean;
  affected_scope_refs?: string[];
  affected_artifact_refs?: string[];
}): "continue" | "clarify" | "revise" | "branch" | "block" {
  if (input.blocked === true) {
    return "block";
  }

  if (input.contradiction_detected === true || input.stale_context === true) {
    return "clarify";
  }

  if (input.branch_recommended === true) {
    return "branch";
  }

  if (
    (input.affected_scope_refs?.length ?? 0) > 0 ||
    (input.affected_artifact_refs?.length ?? 0) > 0
  ) {
    return "revise";
  }

  return "continue";
}

function runtime_scope_kind_from_record(
  record: RuntimeObjectRecord
): RuntimeScopeKind {
  if (record.object_type === "project") {
    return "project";
  }

  if (record.object_type === "cell-runtime-scope") {
    return "operational_unit";
  }

  return "other";
}

function runtime_scope_title_from_record(
  record: RuntimeObjectRecord
): string {
  return (
    read_optional_string(record.scope_name) ??
    read_optional_string(record.summary_headline) ??
    read_optional_string(record.directive_summary) ??
    read_optional_string(record.request_summary) ??
    `${record.object_type}:${record.object_id}`
  );
}

function runtime_scope_summary_from_record(
  record: RuntimeObjectRecord
): string | undefined {
  return (
    read_optional_string(record.scope_summary) ??
    read_optional_string(record.continuity_hint) ??
    read_optional_string(record.completed_summary) ??
    read_optional_string(record.blocked_summary)
  );
}

function runtime_scope_id_from_record(
  record: RuntimeObjectRecord
): string {
  return (
    read_optional_string(record.cell_runtime_scope_id) ??
    read_optional_string(record.scope_id) ??
    read_optional_string(record.project_id) ??
    record.object_id
  );
}

function runtime_created_at_from_record(
  record: RuntimeObjectRecord
): string | undefined {
  return (
    read_optional_string(record.temporal?.event_time) ??
    read_optional_string(record.temporal?.cognition_time)
  );
}

function create_pending_review_item_summary(
  input: CreateRuntimePendingReviewItemSummaryInput,
  fallback_continuity_id: string,
  created_at: string
): RuntimePendingReviewItemSummary {
  const safe_evidence_refs = unique_strings(input.safe_evidence_refs ?? []);
  const review_item_id =
    input.review_item_id ??
    deterministic_id(
      "pending_review_item",
      stable_stringify({
        continuity_id: input.continuity_id ?? fallback_continuity_id,
        project_id: input.project_id,
        lifecycle_stage: input.lifecycle_stage,
        lifecycle_label: input.lifecycle_label,
        evidence_gap_summary: input.evidence_gap_summary,
        review_posture: input.review_posture,
        non_executing_posture: input.non_executing_posture,
        safe_evidence_refs,
        created_at,
      })
    );

  return {
    review_item_id,
    project_id: input.project_id,
    continuity_id: input.continuity_id ?? fallback_continuity_id,
    lifecycle_stage: input.lifecycle_stage,
    lifecycle_label: input.lifecycle_label,
    evidence_gap_summary: input.evidence_gap_summary,
    review_posture: input.review_posture,
    non_executing_posture: input.non_executing_posture,
    safe_evidence_refs,
    runtime_private_fields_omitted: true,
    created_at:
      typeof input.created_at === "string" && input.created_at.length > 0
        ? input.created_at
        : created_at,
  };
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

  create_lifecycle_continuity_projection(
    input: CreateRuntimeLifecycleContinuityProjectionInput
  ): RuntimeLifecycleContinuityProjection {
    const created_at = created_at_or_default(input.created_at);
    const safe_evidence_refs = unique_strings(input.safe_evidence_refs ?? []);
    const continuity_id =
      input.continuity_id ??
      deterministic_id(
        "lifecycle_continuity_projection",
        stable_stringify({
          project_id: input.project_id,
          lifecycle_stage: input.lifecycle_stage,
          lifecycle_label: input.lifecycle_label,
          history_summary: input.history_summary,
          review_posture: input.review_posture,
          non_executing_posture: input.non_executing_posture,
          safe_evidence_refs,
          created_at,
        })
      );
    const projection: RuntimeLifecycleContinuityProjection = {
      continuity_id,
      project_id: input.project_id,
      lifecycle_stage: input.lifecycle_stage,
      lifecycle_label: input.lifecycle_label,
      history_summary: input.history_summary,
      review_posture: input.review_posture,
      non_executing_posture: input.non_executing_posture,
      safe_evidence_refs,
      runtime_private_fields_omitted: true,
      created_at,
    };

    assert_valid_result(
      this.validate_lifecycle_continuity_projection(projection)
    );
    return projection;
  }

  create_pending_review_projection(
    input: CreateRuntimePendingReviewProjectionInput
  ): RuntimePendingReviewProjection {
    const created_at = created_at_or_default(input.created_at);
    const continuity_id =
      input.continuity_id ??
      deterministic_id(
        "pending_review_projection",
        stable_stringify({
          project_id: input.project_id,
          pending_review_items: input.pending_review_items,
          review_posture: input.review_posture,
          non_executing_posture: input.non_executing_posture,
          created_at,
        })
      );
    const pending_review_items = input.pending_review_items.map((item) =>
      create_pending_review_item_summary(item, continuity_id, created_at)
    );
    const projection: RuntimePendingReviewProjection = {
      continuity_id,
      project_id: input.project_id,
      pending_review_count:
        typeof input.pending_review_count === "number"
          ? input.pending_review_count
          : pending_review_items.length,
      pending_review_items,
      review_posture: input.review_posture,
      non_executing_posture: input.non_executing_posture,
      runtime_private_fields_omitted: true,
      created_at,
    };

    assert_valid_result(this.validate_pending_review_projection(projection));
    return projection;
  }

  create_continuity_snapshot_projection(
    input: CreateRuntimeContinuitySnapshotProjectionInput
  ): RuntimeContinuitySnapshotProjection {
    const created_at = created_at_or_default(input.created_at);
    const safe_evidence_refs = unique_strings(input.safe_evidence_refs ?? []);
    const continuity_id =
      input.continuity_id ??
      deterministic_id(
        "continuity_snapshot_projection",
        stable_stringify({
          project_id: input.project_id,
          lifecycle_stage: input.lifecycle_stage,
          lifecycle_label: input.lifecycle_label,
          history_summary: input.history_summary,
          pending_review_count: input.pending_review_count,
          safe_evidence_refs,
          created_at,
        })
      );
    const projection: RuntimeContinuitySnapshotProjection = {
      continuity_id,
      project_id: input.project_id,
      lifecycle_stage: input.lifecycle_stage,
      lifecycle_label: input.lifecycle_label,
      history_summary: input.history_summary,
      pending_review_count: input.pending_review_count,
      safe_evidence_refs,
      runtime_private_fields_omitted: true,
      created_at,
    };

    assert_valid_result(this.validate_continuity_snapshot_projection(projection));
    return projection;
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

  create_runtime_scope_summary(
    input: CreateRuntimeScopeSummaryInput
  ): RuntimeScopeSummary {
    return {
      scope_id: read_required_string(input.scope_id, "scope_id"),
      scope_kind: normalize_scope_kind(input.scope_kind),
      status: read_required_string(input.status, "status"),
      title: read_required_string(input.title, "title"),
      summary: read_optional_string(input.summary),
      evidence_refs: read_string_array(input.evidence_refs),
      runtime_private_fields_omitted: true,
    };
  }

  create_runtime_scope_summary_from_record(
    record: RuntimeObjectRecord
  ): RuntimeScopeSummary {
    return this.create_runtime_scope_summary({
      scope_id: runtime_scope_id_from_record(record),
      scope_kind: runtime_scope_kind_from_record(record),
      status: record.status,
      title: runtime_scope_title_from_record(record),
      summary: runtime_scope_summary_from_record(record),
      evidence_refs: read_string_array(
        record.supporting_evidence_refs ?? record.evidence_refs
      ),
    });
  }

  create_runtime_priority_summary(
    input: CreateRuntimePrioritySummaryInput
  ): RuntimePrioritySummary {
    const created_at = created_at_or_default(input.created_at);
    const related_task_refs = read_string_array(input.related_task_refs);
    const evidence_refs = read_string_array(input.evidence_refs);
    const priority_id =
      input.priority_id ??
      deterministic_id(
        "runtime_priority",
        stable_stringify({
          scope_id: input.scope_id,
          title: input.title,
          priority_level: input.priority_level,
          rationale: input.rationale,
          related_task_refs,
          evidence_refs,
          created_at,
        })
      );

    return {
      priority_id,
      scope_id: read_required_string(input.scope_id, "scope_id"),
      title: read_required_string(input.title, "title"),
      priority_level: input.priority_level,
      rationale: read_required_string(input.rationale, "rationale"),
      related_task_refs,
      evidence_refs,
      runtime_private_fields_omitted: true,
      created_at,
    };
  }

  create_runtime_priority_summary_from_record(
    record: RuntimeObjectRecord
  ): RuntimePrioritySummary {
    const directive_priority = read_optional_string(record.directive_priority);
    const priority_level =
      directive_priority === "focus_now"
        ? "critical"
        : directive_priority === "stabilize"
          ? "high"
          : directive_priority === "review_first"
            ? "medium"
            : record.status === "blocked"
              ? "high"
              : "medium";

    return this.create_runtime_priority_summary({
      scope_id: runtime_scope_id_from_record(record),
      title: runtime_scope_title_from_record(record),
      priority_level,
      rationale:
        read_optional_string(record.directive_summary) ??
        read_optional_string(record.summary_headline) ??
        `Priority derived from ${record.object_type}.`,
      related_task_refs: read_string_array(
        record.objective_ids ?? record.source_object_ids
      ),
      evidence_refs: read_string_array(
        record.supporting_evidence_refs ?? record.evidence_refs
      ),
      created_at: runtime_created_at_from_record(record),
    });
  }

  create_runtime_review_summary(
    input: CreateRuntimeReviewSummaryInput
  ): RuntimeReviewSummary {
    const created_at = created_at_or_default(input.created_at);
    const evidence_refs = read_string_array(input.evidence_refs);
    const review_id =
      input.review_id ??
      deterministic_id(
        "runtime_review",
        stable_stringify({
          scope_id: input.scope_id,
          title: input.title,
          status: input.status,
          review_kind: input.review_kind,
          review_summary: input.review_summary,
          evidence_gap_summary: input.evidence_gap_summary,
          evidence_refs,
          created_at,
        })
      );

    return {
      review_id,
      scope_id: read_required_string(input.scope_id, "scope_id"),
      title: read_required_string(input.title, "title"),
      status: read_required_string(input.status, "status"),
      review_kind: read_optional_string(input.review_kind),
      review_summary: read_optional_string(input.review_summary),
      evidence_gap_summary: read_optional_string(input.evidence_gap_summary),
      evidence_refs,
      runtime_private_fields_omitted: true,
      created_at,
    };
  }

  create_runtime_review_summary_from_record(
    record: RuntimeObjectRecord
  ): RuntimeReviewSummary {
    return this.create_runtime_review_summary({
      scope_id: runtime_scope_id_from_record(record),
      title:
        read_optional_string(record.review_scope_summary) ??
        read_optional_string(record.request_summary) ??
        runtime_scope_title_from_record(record),
      status: record.status,
      review_kind:
        read_optional_string(record.request_kind) ??
        read_optional_string(record.cadence_kind) ??
        record.object_type,
      review_summary:
        read_optional_string(record.requested_decision) ??
        read_optional_string(record.request_summary) ??
        read_optional_string(record.completed_summary),
      evidence_gap_summary: read_optional_string(record.blocked_summary),
      evidence_refs: read_string_array(
        record.supporting_evidence_refs ?? record.evidence_refs
      ),
      created_at: runtime_created_at_from_record(record),
    });
  }

  create_runtime_task_summary(
    input: CreateRuntimeTaskSummaryInput
  ): RuntimeTaskSummary {
    const created_at = created_at_or_default(input.created_at);
    const evidence_refs = read_string_array(input.evidence_refs);
    const related_artifact_refs = read_string_array(input.related_artifact_refs);
    const task_id =
      input.task_id ??
      deterministic_id(
        "runtime_task",
        stable_stringify({
          scope_id: input.scope_id,
          title: input.title,
          status: input.status,
          task_kind: input.task_kind,
          evidence_refs,
          related_artifact_refs,
          created_at,
        })
      );

    return {
      task_id,
      scope_id: read_required_string(input.scope_id, "scope_id"),
      title: read_required_string(input.title, "title"),
      status: read_required_string(input.status, "status"),
      task_kind: read_optional_string(input.task_kind),
      related_artifact_refs,
      evidence_refs,
      runtime_private_fields_omitted: true,
      created_at,
    };
  }

  create_runtime_task_summary_from_record(
    record: RuntimeObjectRecord
  ): RuntimeTaskSummary {
    return this.create_runtime_task_summary({
      task_id: record.object_id,
      scope_id: runtime_scope_id_from_record(record),
      title:
        read_optional_string(record.work_summary) ??
        read_optional_string(record.objective_summary) ??
        runtime_scope_title_from_record(record),
      status: record.status,
      task_kind:
        read_optional_string(record.work_kind) ??
        read_optional_string(record.task_kind) ??
        record.object_type,
      related_artifact_refs: read_string_array(record.deliverable_refs),
      evidence_refs: read_string_array(
        record.supporting_evidence_refs ?? record.evidence_refs
      ),
      created_at: runtime_created_at_from_record(record),
    });
  }

  create_runtime_artifact_summary(
    input: CreateRuntimeArtifactSummaryInput
  ): RuntimeArtifactSummary {
    const source_refs = read_string_array(input.source_refs);
    const evidence_refs = read_string_array(input.evidence_refs);

    return {
      artifact_id: read_required_string(input.artifact_id, "artifact_id"),
      scope_id: read_required_string(input.scope_id, "scope_id"),
      artifact_kind: read_required_string(input.artifact_kind, "artifact_kind"),
      title: read_required_string(input.title, "title"),
      status: read_required_string(input.status, "status"),
      artifact_class: input.artifact_class,
      source_refs,
      evidence_refs,
      runtime_private_fields_omitted: true,
      created_at: created_at_or_default(input.created_at),
      updated_at: read_optional_string(input.updated_at),
    };
  }

  create_runtime_action_summary(
    input: CreateRuntimeActionSummaryInput
  ): RuntimeActionSummary {
    const created_at = created_at_or_default(input.created_at);
    const evidence_refs = read_string_array(input.evidence_refs);
    const related_task_refs = read_string_array(input.related_task_refs);
    const related_artifact_refs = read_string_array(input.related_artifact_refs);
    const risk_notes = read_string_array(input.risk_notes);
    const action_id =
      input.action_id ??
      deterministic_id(
        "runtime_action",
        stable_stringify({
          scope_id: input.scope_id,
          title: input.title,
          action_class: input.action_class,
          readiness_status: input.readiness_status,
          requires_confirmation: input.requires_confirmation,
          blocked: input.blocked,
          reason: input.reason,
          evidence_refs,
          related_task_refs,
          related_artifact_refs,
          risk_notes,
          created_at,
        })
      );

    return {
      action_id,
      scope_id: read_required_string(input.scope_id, "scope_id"),
      title: read_required_string(input.title, "title"),
      action_class: input.action_class,
      readiness_status: input.readiness_status,
      requires_confirmation: input.requires_confirmation,
      blocked: input.blocked,
      reason: read_required_string(input.reason, "reason"),
      evidence_refs,
      related_task_refs,
      related_artifact_refs,
      risk_notes,
      runtime_private_fields_omitted: true,
      created_at,
    };
  }

  create_runtime_action_summary_from_record(
    record: RuntimeObjectRecord,
    action_classification?: RuntimeActionClassEvaluation
  ): RuntimeActionSummary {
    const classification =
      action_classification ??
      classify_runtime_action({
        action_kind: read_optional_string(record.action_kind),
        action_summary: read_optional_string(record.action_summary),
        updates_local_state: true,
        updates_local_files: record.local_file_update === true,
        prepares_external_draft: record.prepares_external_draft === true,
        requests_external_dispatch:
          record.requests_external_dispatch === true,
        irreversible_risk: record.irreversible_risk === true,
        evidence_refs: read_string_array(
          record.supporting_evidence_refs ?? record.evidence_refs
        ),
        risk_notes: read_string_array(record.risk_notes),
      });

    return this.create_runtime_action_summary({
      action_id: record.object_id,
      scope_id: runtime_scope_id_from_record(record),
      title:
        read_optional_string(record.action_summary) ??
        read_optional_string(record.action_kind) ??
        runtime_scope_title_from_record(record),
      action_class: classification.action_class,
      readiness_status: classification.readiness_status,
      requires_confirmation: classification.requires_confirmation,
      blocked: classification.blocked,
      reason: classification.reason,
      evidence_refs: classification.evidence_refs,
      related_task_refs: read_string_array(record.target_object_refs),
      related_artifact_refs: read_string_array(record.artifact_refs),
      risk_notes: classification.risk_notes,
      created_at: runtime_created_at_from_record(record),
    });
  }

  create_preference_suggestion(
    input: CreatePreferenceSuggestionInput
  ): PreferenceSuggestion {
    const created_at = created_at_or_default(input.created_at);
    const evidence_refs = read_string_array(input.evidence_refs);
    const preference_suggestion_id =
      input.preference_suggestion_id ??
      deterministic_id(
        "preference_suggestion",
        stable_stringify({
          project_id: input.project_id,
          scope_id: input.scope_id,
          scope_kind: input.scope_kind,
          summary: input.summary,
          application_scope: input.application_scope,
          status: input.status,
          evidence_refs,
          created_at,
        })
      );

    return {
      preference_suggestion_id,
      project_id: read_required_string(input.project_id, "project_id"),
      scope_id: read_required_string(input.scope_id, "scope_id"),
      scope_kind: normalize_scope_kind(input.scope_kind),
      summary: read_required_string(input.summary, "summary"),
      application_scope: input.application_scope,
      status: input.status,
      evidence_refs,
      runtime_private_fields_omitted: true,
      created_at,
    };
  }

  create_scoped_learning_candidate(
    input: CreateScopedLearningCandidateInput
  ): ScopedLearningCandidate {
    const created_at = created_at_or_default(input.created_at);
    const evidence_refs = read_string_array(input.evidence_refs);
    const source_refs = read_string_array(input.source_refs);
    const learning_candidate_id =
      input.learning_candidate_id ??
      deterministic_id(
        "scoped_learning_candidate",
        stable_stringify({
          project_id: input.project_id,
          learning_scope: input.learning_scope,
          application_scope: input.application_scope,
          status: input.status,
          candidate_kind: input.candidate_kind,
          candidate_summary: input.candidate_summary,
          evidence_refs,
          source_refs,
          preference_suggestion_id:
            input.preference_suggestion?.preference_suggestion_id,
          created_at,
        })
      );

    return {
      learning_candidate_id,
      project_id: read_required_string(input.project_id, "project_id"),
      learning_scope: {
        scope_id: read_required_string(
          input.learning_scope.scope_id,
          "learning_scope.scope_id"
        ),
        scope_kind: normalize_scope_kind(input.learning_scope.scope_kind),
      },
      application_scope: input.application_scope,
      status: input.status,
      candidate_kind: read_required_string(input.candidate_kind, "candidate_kind"),
      candidate_summary: read_required_string(
        input.candidate_summary,
        "candidate_summary"
      ),
      evidence_refs,
      source_refs,
      preference_suggestion: input.preference_suggestion,
      runtime_private_fields_omitted: true,
      created_at,
    };
  }

  create_runtime_learning_summary(
    input: CreateRuntimeLearningSummaryInput
  ): RuntimeLearningSummary {
    const created_at = created_at_or_default(input.created_at);
    const learning_candidates = stable_sort_by_key(
      [...(input.learning_candidates ?? [])],
      "learning_candidate_id"
    );
    const preference_suggestions = stable_sort_by_key(
      [...(input.preference_suggestions ?? [])],
      "preference_suggestion_id"
    );
    const scope_id = read_required_string(input.scope_id, "scope_id");
    const scope_kind = normalize_scope_kind(input.scope_kind);
    const active_candidates = learning_candidates.filter(
      (candidate) =>
        candidate.learning_scope.scope_id === scope_id &&
        candidate.learning_scope.scope_kind === scope_kind &&
        candidate.application_scope === "scope_only" &&
        candidate.status === "accepted"
    );
    const global_candidate_summaries = learning_candidates.filter(
      (candidate) =>
        candidate.application_scope === "global_candidate" &&
        candidate.status !== "rejected"
    );
    const inactive_candidates = learning_candidates.filter(
      (candidate) =>
        !active_candidates.some(
          (active) =>
            active.learning_candidate_id === candidate.learning_candidate_id
        ) &&
        !global_candidate_summaries.some(
          (global_candidate) =>
            global_candidate.learning_candidate_id ===
            candidate.learning_candidate_id
        )
    );
    const visible_preference_suggestions = preference_suggestions.filter(
      (suggestion) =>
        (
          suggestion.scope_id === scope_id &&
          suggestion.scope_kind === scope_kind
        ) ||
        suggestion.application_scope === "global_candidate"
    ).filter((suggestion) => suggestion.status !== "rejected");
    const learning_summary_id =
      input.learning_summary_id ??
      deterministic_id(
        "runtime_learning_summary",
        stable_stringify({
          project_id: input.project_id,
          scope_id,
          scope_kind,
          active_candidate_ids: active_candidates.map(
            (candidate) => candidate.learning_candidate_id
          ),
          global_candidate_ids: global_candidate_summaries.map(
            (candidate) => candidate.learning_candidate_id
          ),
          inactive_candidate_ids: inactive_candidates.map(
            (candidate) => candidate.learning_candidate_id
          ),
          preference_suggestion_ids: visible_preference_suggestions.map(
            (suggestion) => suggestion.preference_suggestion_id
          ),
          created_at,
        })
      );

    return {
      learning_summary_id,
      project_id: read_required_string(input.project_id, "project_id"),
      scope_id,
      scope_kind,
      active_candidates,
      global_candidate_summaries,
      inactive_candidates,
      preference_suggestions: visible_preference_suggestions,
      active_candidate_count: active_candidates.length,
      runtime_private_fields_omitted: true,
      created_at,
    };
  }

  create_runtime_drift_impact_summary(
    input: CreateRuntimeDriftImpactSummaryInput
  ): RuntimeDriftImpactSummary {
    const created_at = created_at_or_default(input.created_at);
    const affected_scope_refs = read_string_array(input.affected_scope_refs);
    const affected_artifact_refs = read_string_array(input.affected_artifact_refs);
    const evidence_refs = read_string_array(input.evidence_refs);
    const recommendation = derive_runtime_drift_recommendation({
      contradiction_detected: input.contradiction_detected,
      stale_context: input.stale_context,
      branch_recommended: input.branch_recommended,
      blocked: input.blocked,
      affected_scope_refs,
      affected_artifact_refs,
    });
    const drift_summary_id =
      input.drift_summary_id ??
      deterministic_id(
        "runtime_drift_summary",
        stable_stringify({
          project_id: input.project_id,
          scope_id: input.scope_id,
          drift_kind: input.drift_kind,
          affected_scope_refs,
          affected_artifact_refs,
          impact_summary: input.impact_summary,
          recommendation,
          evidence_refs,
          confidence_posture: input.confidence_posture,
          created_at,
        })
      );

    return {
      drift_summary_id,
      project_id: read_required_string(input.project_id, "project_id"),
      scope_id: read_required_string(input.scope_id, "scope_id"),
      drift_kind: read_required_string(input.drift_kind, "drift_kind"),
      affected_scope_refs,
      affected_artifact_refs,
      impact_summary: read_required_string(input.impact_summary, "impact_summary"),
      recommendation,
      evidence_refs,
      confidence_posture: input.confidence_posture,
      runtime_private_fields_omitted: true,
      created_at,
    };
  }

  create_runtime_drift_impact_summary_from_assessment(input: {
    project_id: string;
    scope_id: string;
    assessment: RuntimeDeltaDriftImpactAssessment;
    reconciliation?: RuntimeReconciliationSnapshot;
    contradiction_detected?: boolean;
    stale_context?: boolean;
    branch_recommended?: boolean;
    affected_scope_refs?: string[];
    affected_artifact_refs?: string[];
    created_at?: string;
  }): RuntimeDriftImpactSummary {
    return this.create_runtime_drift_impact_summary({
      project_id: input.project_id,
      scope_id: input.scope_id,
      drift_kind: input.assessment.drift_kind,
      affected_scope_refs: input.affected_scope_refs,
      affected_artifact_refs: input.affected_artifact_refs,
      impact_summary: input.assessment.impact_summary,
      contradiction_detected: input.contradiction_detected,
      stale_context: input.stale_context,
      branch_recommended: input.branch_recommended,
      blocked: input.reconciliation?.can_continue === false,
      evidence_refs: input.assessment.supporting_evidence_refs,
      confidence_posture:
        input.stale_context === true
          ? "stale"
          : input.contradiction_detected === true
            ? "insufficient"
            : "bounded",
      created_at: input.created_at,
    });
  }

  create_runtime_suggested_next_action(
    input: CreateRuntimeSuggestedNextActionInput
  ): RuntimeSuggestedNextAction {
    const created_at = created_at_or_default(input.created_at);
    const evidence_refs = read_string_array(input.evidence_refs);
    const related_task_refs = read_string_array(input.related_task_refs);
    const related_artifact_refs = read_string_array(input.related_artifact_refs);
    const readiness_status =
      input.readiness_status ??
      derive_runtime_action_readiness({
        action_class: input.action_class,
        blocked: input.blocked,
        requires_confirmation: input.requires_confirmation,
      });
    const action_id =
      input.action_id ??
      deterministic_id(
        "runtime_suggested_next_action",
        stable_stringify({
          project_id: input.project_id,
          scope_id: input.scope_id,
          title: input.title,
          rationale: input.rationale,
          action_class: input.action_class,
          readiness_status,
          evidence_refs,
          related_task_refs,
          related_artifact_refs,
          created_at,
        })
      );

    return {
      action_id,
      project_id: read_required_string(input.project_id, "project_id"),
      scope_id: read_required_string(input.scope_id, "scope_id"),
      title: read_required_string(input.title, "title"),
      rationale: read_required_string(input.rationale, "rationale"),
      action_class: input.action_class,
      readiness_status,
      evidence_refs,
      related_task_refs,
      related_artifact_refs,
      runtime_private_fields_omitted: true,
      created_at,
    };
  }

  create_workforce_projection_safe_envelope(
    input: CreateWorkforceProjectionSafeEnvelopeInput
  ): WorkforceProjectionSafeEnvelope {
    const created_at = created_at_or_default(input.created_at);
    const envelope: WorkforceProjectionSafeEnvelope = {
      envelope_version: "0.1",
      envelope_kind: "workforce_projection_safe_envelope",
      source_runtime_family: "workforce",
      project_id: read_required_string(input.project_id, "project_id"),
      scope_ref: read_required_string(input.scope_ref, "scope_ref"),
      scope_label: read_required_string(input.scope_label, "scope_label"),
      scope_status: read_required_string(input.scope_status, "scope_status"),
      summary_headline: read_optional_string(input.summary_headline),
      delivery_posture: input.delivery_posture ?? "unknown",
      safe_evidence_refs: read_string_array(input.safe_evidence_refs),
      projection_notes: read_string_array(input.projection_notes),
      runtime_private_fields_omitted: true,
      non_executing: true,
      created_at,
    };

    assert_valid_result(this.validate_workforce_projection_safe_envelope(envelope));
    return envelope;
  }

  create_operational_unit_runtime_projection(
    input: CreateOperationalUnitRuntimeProjectionInput
  ): OperationalUnitRuntimeProjection {
    const created_at = created_at_or_default(input.created_at);
    const scope_summary = input.scope_summary;
    const priority_summaries = stable_sort_by_key(
      [...(input.priority_summaries ?? [])],
      "priority_id"
    );
    const pending_review_summaries = stable_sort_by_key(
      [...(input.pending_review_summaries ?? [])],
      "review_id"
    );
    const recent_artifact_summaries = stable_sort_by_key(
      [...(input.recent_artifact_summaries ?? [])],
      "artifact_id"
    );
    const task_summaries = stable_sort_by_key(
      [...(input.task_summaries ?? [])],
      "task_id"
    );
    const action_summaries = stable_sort_by_key(
      [...(input.action_summaries ?? [])],
      "action_id"
    );
    const learning_summaries = stable_sort_by_key(
      [...(input.learning_summaries ?? [])],
      "learning_summary_id"
    );
    const drift_summaries = stable_sort_by_key(
      [...(input.drift_summaries ?? [])],
      "drift_summary_id"
    );
    const suggested_next_actions = stable_sort_by_key(
      [...(input.suggested_next_actions ?? [])],
      "action_id"
    );
    const evidence_refs = unique_strings([
      ...(input.evidence_refs ?? []),
      ...(scope_summary.evidence_refs ?? []),
      ...priority_summaries.flatMap((summary) => summary.evidence_refs ?? []),
      ...pending_review_summaries.flatMap((summary) => summary.evidence_refs ?? []),
      ...recent_artifact_summaries.flatMap((summary) => summary.evidence_refs),
      ...task_summaries.flatMap((summary) => summary.evidence_refs ?? []),
      ...action_summaries.flatMap((summary) => summary.evidence_refs),
      ...learning_summaries.flatMap((summary) =>
        summary.active_candidates.flatMap((candidate) => candidate.evidence_refs)
      ),
      ...learning_summaries.flatMap((summary) =>
        summary.global_candidate_summaries.flatMap(
          (candidate) => candidate.evidence_refs
        )
      ),
      ...drift_summaries.flatMap((summary) => summary.evidence_refs),
      ...suggested_next_actions.flatMap((summary) => summary.evidence_refs),
    ]);
    const operational_unit_id =
      input.operational_unit_id ??
      deterministic_id(
        "operational_unit_projection",
        stable_stringify({
          project_id: input.project_id,
          scope_id: scope_summary.scope_id,
          scope_kind: scope_summary.scope_kind,
          status: scope_summary.status,
          priority_ids: priority_summaries.map((summary) => summary.priority_id),
          review_ids: pending_review_summaries.map((summary) => summary.review_id),
          artifact_ids: recent_artifact_summaries.map((summary) => summary.artifact_id),
          task_ids: task_summaries.map((summary) => summary.task_id),
          action_ids: action_summaries.map((summary) => summary.action_id),
          learning_ids: learning_summaries.map(
            (summary) => summary.learning_summary_id
          ),
          drift_ids: drift_summaries.map((summary) => summary.drift_summary_id),
          next_action_ids: suggested_next_actions.map((summary) => summary.action_id),
          evidence_refs,
          created_at,
        })
      );

    return {
      operational_unit_id,
      project_id: read_required_string(input.project_id, "project_id"),
      scope_summary,
      status: scope_summary.status,
      priority_summaries,
      pending_review_summaries,
      recent_artifact_summaries,
      task_summaries,
      action_summaries,
      learning_summaries,
      drift_summaries,
      suggested_next_actions,
      evidence_refs,
      runtime_private_fields_omitted: true,
      non_executing: true,
      created_at,
    };
  }

  create_runtime_state_projection(
    input: CreateRuntimeStateProjectionInput
  ): RuntimeStateProjection {
    const created_at = created_at_or_default(input.created_at);
    const operational_unit_projections = stable_sort_by_key(
      [...input.operational_unit_projections],
      "operational_unit_id"
    );
    const evidence_refs = unique_strings([
      ...(input.evidence_refs ?? []),
      ...operational_unit_projections.flatMap(
        (projection) => projection.evidence_refs
      ),
    ]);
    const state_projection_id =
      input.state_projection_id ??
      deterministic_id(
        "runtime_state_projection",
        stable_stringify({
          project_id: input.project_id,
          operational_unit_ids: operational_unit_projections.map(
            (projection) => projection.operational_unit_id
          ),
          evidence_refs,
          created_at,
        })
      );
    const projection: RuntimeStateProjection = {
      state_projection_id,
      project_id: read_required_string(input.project_id, "project_id"),
      operational_unit_projections,
      evidence_refs,
      runtime_private_fields_omitted: true,
      non_executing: true,
      created_at,
    };

    assert_valid_result(this.validate_runtime_state_projection(projection));
    return projection;
  }

  validate_workforce_projection_safe_envelope(envelope: unknown): ValidationResult {
    const errors = [
      ...collect_forbidden_raw_key_errors(envelope, "envelope"),
      ...collect_forbidden_action_label_errors(envelope, "envelope"),
      ...collect_forbidden_direct_action_errors(envelope, "envelope"),
      ...collect_forbidden_runtime_semantic_errors(envelope),
    ];

    if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
      errors.push("envelope must be an object");
      return {
        valid: false,
        errors: [...new Set(errors)].sort(),
      };
    }

    const candidate = envelope as Record<string, unknown>;
    validate_required_string(candidate, "project_id", errors);
    validate_required_string(candidate, "scope_ref", errors);
    validate_required_string(candidate, "scope_label", errors);
    validate_required_string(candidate, "scope_status", errors);

    if (candidate.envelope_version !== "0.1") {
      errors.push("envelope_version must be 0.1");
    }

    if (candidate.envelope_kind !== "workforce_projection_safe_envelope") {
      errors.push("envelope_kind must be workforce_projection_safe_envelope");
    }

    if (candidate.source_runtime_family !== "workforce") {
      errors.push("source_runtime_family must be workforce");
    }

    if (candidate.runtime_private_fields_omitted !== true) {
      errors.push("runtime_private_fields_omitted must be true");
    }

    if (candidate.non_executing !== true) {
      errors.push("non_executing must be true");
    }

    if (
      candidate.delivery_posture !== undefined &&
      !["steady", "attention", "blocked", "unknown"].includes(
        String(candidate.delivery_posture)
      )
    ) {
      errors.push("delivery_posture must be steady, attention, blocked, or unknown");
    }

    validate_safe_evidence_refs(
      candidate.safe_evidence_refs,
      "safe_evidence_refs",
      errors
    );

    if (!Array.isArray(candidate.projection_notes)) {
      errors.push("projection_notes must be an array");
    } else if (
      candidate.projection_notes.some(
        (note) => typeof note !== "string" || note.trim().length === 0
      )
    ) {
      errors.push("projection_notes must contain only non-empty strings");
    }

    return {
      valid: errors.length === 0,
      errors: [...new Set(errors)].sort(),
    };
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

  validate_runtime_state_projection(
    projection: unknown
  ): ValidationResult {
    const errors = [
      ...collect_forbidden_raw_key_errors(projection, "projection"),
      ...collect_forbidden_action_label_errors(projection, "projection"),
      ...collect_forbidden_direct_action_errors(projection, "projection"),
      ...collect_forbidden_runtime_semantic_errors(projection),
    ];

    if (!projection || typeof projection !== "object" || Array.isArray(projection)) {
      errors.push("projection must be an object");
      return {
        valid: false,
        errors: [...new Set(errors)].sort(),
      };
    }

    const candidate = projection as Record<string, unknown>;

    validate_required_string(candidate, "state_projection_id", errors);
    validate_required_string(candidate, "project_id", errors);

    if (candidate.runtime_private_fields_omitted !== true) {
      errors.push("runtime_private_fields_omitted must be true");
    }

    if (candidate.non_executing !== true) {
      errors.push("non_executing must be true");
    }

    validate_safe_evidence_refs(candidate.evidence_refs, "evidence_refs", errors);

    const operational_units = candidate.operational_unit_projections;
    if (!Array.isArray(operational_units)) {
      errors.push("operational_unit_projections must be an array");
      return {
        valid: false,
        errors: [...new Set(errors)].sort(),
      };
    }

    const project_id =
      typeof candidate.project_id === "string" ? candidate.project_id : undefined;

    for (const unit of operational_units) {
      if (!unit || typeof unit !== "object" || Array.isArray(unit)) {
        errors.push("operational_unit_projections entries must be objects");
        continue;
      }

      const record = unit as Record<string, unknown>;
      validate_required_string(record, "operational_unit_id", errors);
      validate_required_string(record, "project_id", errors);
      validate_required_string(record, "status", errors);

      if (project_id && record.project_id !== project_id) {
        errors.push(
          "operational_unit_projections.project_id must match projection project_id"
        );
      }

      if (record.runtime_private_fields_omitted !== true) {
        errors.push(
          "operational_unit_projections.runtime_private_fields_omitted must be true"
        );
      }

      if (record.non_executing !== true) {
        errors.push("operational_unit_projections.non_executing must be true");
      }

      validate_safe_evidence_refs(
        record.evidence_refs,
        "operational_unit_projections.evidence_refs",
        errors
      );

      const scope_summary = record.scope_summary;
      if (!scope_summary || typeof scope_summary !== "object" || Array.isArray(scope_summary)) {
        errors.push("operational_unit_projections.scope_summary must be an object");
      } else {
        const scope_record = scope_summary as Record<string, unknown>;
        validate_required_string(scope_record, "scope_id", errors);
        validate_required_string(scope_record, "scope_kind", errors);
        validate_required_string(scope_record, "status", errors);
        validate_required_string(scope_record, "title", errors);

        if (scope_record.runtime_private_fields_omitted !== true) {
          errors.push(
            "operational_unit_projections.scope_summary.runtime_private_fields_omitted must be true"
          );
        }
      }

      const nested_collections: Array<{
        key:
          | "priority_summaries"
          | "pending_review_summaries"
          | "recent_artifact_summaries"
          | "task_summaries"
          | "action_summaries"
          | "learning_summaries"
          | "drift_summaries"
          | "suggested_next_actions";
        id_key: string;
      }> = [
        { key: "priority_summaries", id_key: "priority_id" },
        { key: "pending_review_summaries", id_key: "review_id" },
        { key: "recent_artifact_summaries", id_key: "artifact_id" },
        { key: "task_summaries", id_key: "task_id" },
        { key: "action_summaries", id_key: "action_id" },
        { key: "learning_summaries", id_key: "learning_summary_id" },
        { key: "drift_summaries", id_key: "drift_summary_id" },
        { key: "suggested_next_actions", id_key: "action_id" },
      ];

      for (const collection of nested_collections) {
        const items = record[collection.key];

        if (!Array.isArray(items)) {
          errors.push(`${collection.key} must be an array`);
          continue;
        }

        for (const item of items) {
          if (!item || typeof item !== "object" || Array.isArray(item)) {
            errors.push(`${collection.key} entries must be objects`);
            continue;
          }

          const item_record = item as Record<string, unknown>;
          validate_required_string(item_record, collection.id_key, errors);

          if (item_record.runtime_private_fields_omitted !== true) {
            errors.push(
              `${collection.key}.runtime_private_fields_omitted must be true`
            );
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: [...new Set(errors)].sort(),
    };
  }

  validate_lifecycle_continuity_projection(
    projection: unknown
  ): ValidationResult {
    const errors = [
      ...collect_lifecycle_projection_forbidden_field_errors(projection),
      ...collect_forbidden_action_label_errors(projection, "projection"),
      ...collect_forbidden_direct_action_errors(projection, "projection"),
      ...collect_forbidden_runtime_semantic_errors(projection),
    ];

    if (!projection || typeof projection !== "object" || Array.isArray(projection)) {
      errors.push("projection must be an object");
      return {
        valid: false,
        errors: [...new Set(errors)].sort(),
      };
    }

    const candidate = projection as Record<string, unknown>;

    validate_required_string(candidate, "project_id", errors);
    validate_required_string(candidate, "continuity_id", errors);
    validate_required_string(candidate, "lifecycle_stage", errors);
    validate_required_string(candidate, "lifecycle_label", errors);
    validate_required_string(candidate, "history_summary", errors);
    validate_required_string(candidate, "review_posture", errors);
    validate_required_string(candidate, "non_executing_posture", errors);

    if (candidate.runtime_private_fields_omitted !== true) {
      errors.push("runtime_private_fields_omitted must be true");
    }

    validate_safe_evidence_refs(candidate.safe_evidence_refs, "safe_evidence_refs", errors);

    return {
      valid: errors.length === 0,
      errors: [...new Set(errors)].sort(),
    };
  }

  validate_pending_review_projection(projection: unknown): ValidationResult {
    const errors = [
      ...collect_lifecycle_projection_forbidden_field_errors(projection),
      ...collect_forbidden_action_label_errors(projection, "projection"),
      ...collect_forbidden_direct_action_errors(projection, "projection"),
      ...collect_forbidden_runtime_semantic_errors(projection),
    ];

    if (!projection || typeof projection !== "object" || Array.isArray(projection)) {
      errors.push("projection must be an object");
      return {
        valid: false,
        errors: [...new Set(errors)].sort(),
      };
    }

    const candidate = projection as Record<string, unknown>;

    validate_required_string(candidate, "project_id", errors);
    validate_required_string(candidate, "continuity_id", errors);
    validate_required_string(candidate, "review_posture", errors);
    validate_required_string(candidate, "non_executing_posture", errors);

    if (candidate.runtime_private_fields_omitted !== true) {
      errors.push("runtime_private_fields_omitted must be true");
    }

    if (
      typeof candidate.pending_review_count !== "number" ||
      !Number.isInteger(candidate.pending_review_count) ||
      candidate.pending_review_count < 0
    ) {
      errors.push("pending_review_count must be a non-negative integer");
    }

    const project_id =
      typeof candidate.project_id === "string" ? candidate.project_id : undefined;
    const items = candidate.pending_review_items;
    if (!Array.isArray(items)) {
      errors.push("pending_review_items must be an array");
    } else {
      if (
        typeof candidate.pending_review_count === "number" &&
        candidate.pending_review_count !== items.length
      ) {
        errors.push("pending_review_count must match pending_review_items length");
      }

      for (const item of items) {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push("pending_review_items must contain only objects");
          continue;
        }

        const record = item as Record<string, unknown>;

        if (
          typeof record.project_id !== "string" ||
          record.project_id.length === 0
        ) {
          errors.push("pending_review_items.project_id is required");
        } else if (
          project_id &&
          record.project_id !== project_id
        ) {
          errors.push("pending_review_items.project_id must match projection project_id");
        }

        validate_required_string(record, "review_item_id", errors);
        validate_required_string(record, "lifecycle_stage", errors);
        validate_required_string(record, "lifecycle_label", errors);
        validate_required_string(record, "review_posture", errors);
        validate_required_string(record, "non_executing_posture", errors);

        if (record.runtime_private_fields_omitted !== true) {
          errors.push("pending_review_items.runtime_private_fields_omitted must be true");
        }

        validate_safe_evidence_refs(
          record.safe_evidence_refs,
          "pending_review_items.safe_evidence_refs",
          errors
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors: [...new Set(errors)].sort(),
    };
  }

  validate_continuity_snapshot_projection(
    projection: unknown
  ): ValidationResult {
    const errors = [
      ...collect_lifecycle_projection_forbidden_field_errors(projection),
      ...collect_forbidden_action_label_errors(projection, "projection"),
      ...collect_forbidden_direct_action_errors(projection, "projection"),
      ...collect_forbidden_runtime_semantic_errors(projection),
    ];

    if (!projection || typeof projection !== "object" || Array.isArray(projection)) {
      errors.push("projection must be an object");
      return {
        valid: false,
        errors: [...new Set(errors)].sort(),
      };
    }

    const candidate = projection as Record<string, unknown>;

    validate_required_string(candidate, "project_id", errors);
    validate_required_string(candidate, "continuity_id", errors);
    validate_required_string(candidate, "lifecycle_stage", errors);
    validate_required_string(candidate, "lifecycle_label", errors);
    validate_required_string(candidate, "history_summary", errors);

    if (candidate.runtime_private_fields_omitted !== true) {
      errors.push("runtime_private_fields_omitted must be true");
    }

    if (
      typeof candidate.pending_review_count !== "number" ||
      !Number.isInteger(candidate.pending_review_count) ||
      candidate.pending_review_count < 0
    ) {
      errors.push("pending_review_count must be a non-negative integer");
    }

    validate_safe_evidence_refs(candidate.safe_evidence_refs, "safe_evidence_refs", errors);

    return {
      valid: errors.length === 0,
      errors: [...new Set(errors)].sort(),
    };
  }
}
