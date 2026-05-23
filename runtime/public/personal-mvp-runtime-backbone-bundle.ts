import {
  DeterministicPersonalMvpRuntimeBackbone,
  type PersonalMvpLearningFeedbackKind,
} from "../core/personal-mvp-runtime-backbone.ts";
import type {
  PersonalMvpRuntimeActivityKind,
  PersonalMvpRuntimeBackboneProjection,
  PersonalMvpRuntimeDecisionState,
  PersonalMvpRuntimeDirectionChangeState,
  PersonalMvpRuntimeLearningState,
  PersonalMvpRuntimePsgLayer,
} from "./personal-mvp-runtime-backbone-dto.ts";

export type PersonalMvpRuntimeBackboneActivityInput = {
  activity_kind: PersonalMvpRuntimeActivityKind;
  summary: string;
  source_ref?: string;
  evidence_refs?: readonly string[];
};

export type PersonalMvpRuntimeBackboneContinuityInput = {
  current_mission_state: string;
  progress_state: string;
  review_state: PersonalMvpRuntimeDecisionState;
  packet_state: string;
  artifact_state: string;
  resume_pointer: string;
  last_confirmed_direction?: string;
  next_safe_action: string;
  evidence_refs?: readonly string[];
};

export type PersonalMvpRuntimeBackboneMemoryLayerInput = {
  layer: PersonalMvpRuntimePsgLayer;
  summary: string;
  node_refs?: readonly string[];
  relation_refs?: readonly string[];
  evidence_refs?: readonly string[];
};

export type PersonalMvpRuntimeBackboneLearningFeedbackInput = {
  learning_kind: PersonalMvpLearningFeedbackKind;
  summary: string;
  candidate_ref?: string;
  state?: PersonalMvpRuntimeLearningState;
  target_ref?: string;
  evidence_refs?: readonly string[];
};

export type PersonalMvpRuntimeBackboneDirectionChangeInput = {
  previous_direction_ref?: string;
  proposed_direction_ref: string;
  change_summary: string;
  impact_summary: string;
  state?: PersonalMvpRuntimeDirectionChangeState;
  evidence_refs?: readonly string[];
};

export type CreatePersonalMvpRuntimeBackboneProjectionInput = {
  project_id: string;
  source_commit_ref: string;
  runtime_backbone_ref?: string;
  generated_at?: string;
  protocol_version_ref?: string;
  binding_version_ref?: string;
  runtime_version_ref?: string;
  activities?: readonly PersonalMvpRuntimeBackboneActivityInput[];
  continuity_state?: PersonalMvpRuntimeBackboneContinuityInput;
  memory_layers?: readonly PersonalMvpRuntimeBackboneMemoryLayerInput[];
  learning_feedback?: readonly PersonalMvpRuntimeBackboneLearningFeedbackInput[];
  direction_change?: PersonalMvpRuntimeBackboneDirectionChangeInput;
};

export type PersonalMvpRuntimeBackboneProjectionSummary = {
  runtime_backbone_ref: string;
  generated_at: string;
  activity_count: number;
  memory_layer_count: number;
  learning_feedback_count: number;
  direction_change_state: PersonalMvpRuntimeDirectionChangeState;
  evidence_ref_count: number;
  omission_count: number;
  personal_mvp_runtime_available: true;
  full_enterprise_runtime_claimed: false;
  execution_authority_granted: false;
  automatic_change_authority_granted: false;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

const REQUIRED_MEMORY_LAYERS = [
  "operator_intake_psg",
  "project_scope_psg",
  "task_scope_psg",
] as const satisfies readonly PersonalMvpRuntimePsgLayer[];

const PERSONAL_MVP_TRUE_FLAGS = [
  "personal_mvp_ael_activity_runtime_available",
  "personal_mvp_vsl_continuity_runtime_available",
  "personal_mvp_psg_memory_runtime_available",
  "personal_mvp_learning_feedback_runtime_available",
  "personal_mvp_direction_change_runtime_available",
] as const;

const ENTERPRISE_FALSE_FLAGS = [
  "full_enterprise_ael_runtime_claimed",
  "full_enterprise_vsl_runtime_claimed",
  "full_enterprise_psg_runtime_claimed",
  "full_enterprise_learning_engine_claimed",
] as const;

const AUTHORITY_FALSE_FLAGS = [
  "provider_execution_authorized",
  "model_execution_authorized",
  "tool_execution_authorized",
  "worker_execution_authorized",
  "publishing_authorized",
  "external_action_authorized",
  "automatic_mutation_authorized",
  "autonomous_acceptance_authorized",
  "training_authorized",
  "writeback_authorized",
] as const;

const FORBIDDEN_OUTPUT_KEYS = new Set([
  "runtime_class_instance",
  "private_state",
  "ael_raw_state",
  "vsl_raw_state",
  "psg_raw_state",
  "learning_engine_handle",
  "provider_handle",
  "model_handle",
  "tool_handle",
  "worker_handle",
]);

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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
    if (FORBIDDEN_OUTPUT_KEYS.has(key)) {
      issues.push(`forbidden output key at ${path}.${key}`);
    }

    collectForbiddenKeys(nested, `${path}.${key}`, issues);
  }
}

function createBundleClock(generated_at?: string): { now(): string } {
  const generatedAt = hasText(generated_at)
    ? generated_at
    : new Date().toISOString();

  return {
    now() {
      return generatedAt;
    },
  };
}

export function createPersonalMvpRuntimeBackboneProjection(
  input: CreatePersonalMvpRuntimeBackboneProjectionInput
): PersonalMvpRuntimeBackboneProjection {
  const backbone = new DeterministicPersonalMvpRuntimeBackbone({
    clock: createBundleClock(input.generated_at),
  });

  for (const activity of input.activities ?? []) {
    backbone.record_activity({
      project_id: input.project_id,
      ...activity,
    });
  }

  if (input.continuity_state) {
    backbone.write_continuity_state({
      project_id: input.project_id,
      current_mission_state: input.continuity_state.current_mission_state,
      scope_progress_state: input.continuity_state.progress_state,
      review_state: input.continuity_state.review_state,
      packet_state: input.continuity_state.packet_state,
      artifact_state: input.continuity_state.artifact_state,
      resume_pointer: input.continuity_state.resume_pointer,
      last_confirmed_direction: input.continuity_state.last_confirmed_direction,
      next_safe_action: input.continuity_state.next_safe_action,
      evidence_refs: input.continuity_state.evidence_refs,
    });
  }

  for (const memoryLayer of input.memory_layers ?? []) {
    backbone.upsert_memory_layer({
      project_id: input.project_id,
      ...memoryLayer,
    });
  }

  for (const learningFeedback of input.learning_feedback ?? []) {
    backbone.capture_learning_feedback({
      project_id: input.project_id,
      ...learningFeedback,
    });
  }

  if (input.direction_change) {
    const directionChange = backbone.create_direction_change({
      project_id: input.project_id,
      previous_direction_ref: input.direction_change.previous_direction_ref,
      proposed_direction_ref: input.direction_change.proposed_direction_ref,
      change_summary: input.direction_change.change_summary,
      impact_summary: input.direction_change.impact_summary,
      evidence_refs: input.direction_change.evidence_refs,
    });

    if (
      input.direction_change.state &&
      input.direction_change.state !== "pending_confirmation"
    ) {
      backbone.update_direction_change_state(
        directionChange.direction_change_ref,
        input.direction_change.state
      );
    }
  }

  return backbone.create_public_projection({
    project_id: input.project_id,
    runtime_backbone_ref: input.runtime_backbone_ref,
    source_commit_ref: input.source_commit_ref,
    protocol_version_ref: input.protocol_version_ref,
    binding_version_ref: input.binding_version_ref,
    runtime_version_ref: input.runtime_version_ref,
  });
}

export function validatePersonalMvpRuntimeBackboneProjection(
  projection: PersonalMvpRuntimeBackboneProjection
): readonly string[] {
  const issues: string[] = [];

  if (!hasText(projection.runtime_backbone_ref)) {
    issues.push("runtime_backbone_ref is required");
  }

  if (!hasText(projection.source_commit_ref)) {
    issues.push("source_commit_ref is required");
  }

  if (projection.ael_activity_summary.activity_count < 1) {
    issues.push("ael_activity_summary requires at least one activity");
  }

  if (!hasText(projection.vsl_continuity_summary.resume_pointer)) {
    issues.push("vsl_continuity_summary.resume_pointer is required");
  }

  if (projection.vsl_continuity_summary.current_mission_state === "not_recorded") {
    issues.push("vsl_continuity_summary.current_mission_state is missing");
  }

  const memoryLayers = new Set(
    projection.psg_memory_summary.layers.map((layer) => layer.layer)
  );

  for (const requiredLayer of REQUIRED_MEMORY_LAYERS) {
    if (!memoryLayers.has(requiredLayer)) {
      issues.push(`psg_memory_summary missing ${requiredLayer}`);
    }
  }

  if (projection.learning_feedback_summary.feedback_count < 1) {
    issues.push("learning_feedback_summary requires at least one candidate");
  }

  if (!projection.direction_change_summary.direction_change_ref) {
    issues.push("direction_change_summary.direction_change_ref is required");
  }

  if (!projection.direction_change_summary.requires_operator_confirmation) {
    issues.push("direction_change_summary must require operator confirmation");
  }

  for (const flag of PERSONAL_MVP_TRUE_FLAGS) {
    if (projection.boundary_flags[flag] !== true) {
      issues.push(`boundary_flags.${flag} must be true`);
    }
  }

  for (const flag of [...ENTERPRISE_FALSE_FLAGS, ...AUTHORITY_FALSE_FLAGS]) {
    if (projection.boundary_flags[flag] !== false) {
      issues.push(`boundary_flags.${flag} must be false`);
    }
  }

  if (!projection.runtime_private_fields_omitted) {
    issues.push("runtime_private_fields_omitted must be true");
  }

  if (!projection.non_executing) {
    issues.push("non_executing must be true");
  }

  collectForbiddenKeys(projection, "projection", issues);

  return issues;
}

export function summarizePersonalMvpRuntimeBackboneProjection(
  projection: PersonalMvpRuntimeBackboneProjection
): PersonalMvpRuntimeBackboneProjectionSummary {
  const flags = projection.boundary_flags;
  const personalMvpRuntimeAvailable = PERSONAL_MVP_TRUE_FLAGS.every(
    (flag) => flags[flag] === true
  );
  const fullEnterpriseRuntimeClaimed = ENTERPRISE_FALSE_FLAGS.some(
    (flag) => flags[flag] === true
  );
  const executionAuthorityGranted = AUTHORITY_FALSE_FLAGS.some(
    (flag) => flags[flag] === true
  );

  return {
    runtime_backbone_ref: projection.runtime_backbone_ref,
    generated_at: projection.generated_at,
    activity_count: projection.ael_activity_summary.activity_count,
    memory_layer_count: projection.psg_memory_summary.layers.length,
    learning_feedback_count:
      projection.learning_feedback_summary.feedback_count,
    direction_change_state: projection.direction_change_summary.state,
    evidence_ref_count: projection.safe_evidence_refs.length,
    omission_count: projection.omissions.length,
    personal_mvp_runtime_available: personalMvpRuntimeAvailable as true,
    full_enterprise_runtime_claimed: fullEnterpriseRuntimeClaimed as false,
    execution_authority_granted: executionAuthorityGranted as false,
    automatic_change_authority_granted: (
      flags.automatic_mutation_authorized ||
      flags.autonomous_acceptance_authorized ||
      flags.training_authorized ||
      flags.writeback_authorized
    ) as false,
    runtime_private_fields_omitted: projection.runtime_private_fields_omitted,
    non_executing: projection.non_executing,
  };
}
