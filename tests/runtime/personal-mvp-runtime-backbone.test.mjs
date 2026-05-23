import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import {
  DeterministicPersonalMvpRuntimeBackbone,
} from "../../runtime/core/personal-mvp-runtime-backbone.ts";

const dtoPath = "runtime/public/personal-mvp-runtime-backbone-dto.ts";
const runtimePath = "runtime/core/personal-mvp-runtime-backbone.ts";
const packageJsonPath = "package.json";

function createBackbone() {
  let tick = 0;

  return new DeterministicPersonalMvpRuntimeBackbone({
    clock: {
      now() {
        tick += 1;

        return `2026-05-23T00:00:${String(tick).padStart(2, "0")}.000Z`;
      },
    },
  });
}

function createSeededBackbone() {
  const backbone = createBackbone();
  const projectId = "project:personal-runtime-backbone";

  backbone.record_activity({
    project_id: projectId,
    activity_kind: "operator_goal_captured",
    summary: "Captured the operator goal as an internal event.",
    source_ref: "objective:001",
    evidence_refs: ["trace:activity:001"],
  });
  backbone.record_activity({
    project_id: projectId,
    activity_kind: "human_review_recorded",
    summary: "Recorded human review as an internal event.",
    source_ref: "review:001",
    evidence_refs: ["trace:activity:002"],
  });
  backbone.write_continuity_state({
    project_id: projectId,
    current_mission_state: "mission_state:active",
    scope_progress_state: "progress_state:in_review",
    review_state: "needs_review",
    packet_state: "packet_state:ready_for_review",
    artifact_state: "artifact_state:draft_available",
    resume_pointer: "resume:checkpoint:001",
    last_confirmed_direction: "direction:confirmed:001",
    next_safe_action: "request_operator_confirmation",
    evidence_refs: ["trace:continuity:001"],
  });

  for (const [layer, suffix] of [
    ["operator_intake_psg", "intake"],
    ["project_scope_psg", "project"],
    ["task_scope_psg", "task"],
  ]) {
    backbone.upsert_memory_layer({
      project_id: projectId,
      layer,
      summary: `Memory summary for ${suffix} scope.`,
      node_refs: [`node:${suffix}:001`],
      relation_refs: [`relation:${suffix}:001`],
      evidence_refs: [`trace:memory:${suffix}`],
    });
  }

  const suggested = backbone.capture_learning_feedback({
    project_id: projectId,
    learning_kind: "style_preference",
    summary: "Prefer concise review summaries.",
    target_ref: "preference:style:001",
    evidence_refs: ["trace:learning:001"],
  });
  const confirmed = backbone.capture_learning_feedback({
    project_id: projectId,
    learning_kind: "workflow_preference",
    summary: "Review before continuing on scope changes.",
    target_ref: "preference:workflow:001",
    evidence_refs: ["trace:learning:002"],
  });
  const rejected = backbone.capture_learning_feedback({
    project_id: projectId,
    learning_kind: "output_quality_feedback",
    summary: "Do not promote vague artifact claims.",
    target_ref: "preference:quality:001",
    evidence_refs: ["trace:learning:003"],
  });
  const archived = backbone.capture_learning_feedback({
    project_id: projectId,
    learning_kind: "workflow_preference",
    summary: "Archive obsolete review preference.",
    target_ref: "preference:workflow:old",
    evidence_refs: ["trace:learning:004"],
  });

  backbone.update_learning_feedback_state(confirmed.candidate_ref, "confirmed");
  backbone.update_learning_feedback_state(rejected.candidate_ref, "rejected");
  backbone.update_learning_feedback_state(archived.candidate_ref, "archived");

  const directionChange = backbone.create_direction_change({
    project_id: projectId,
    previous_direction_ref: "direction:confirmed:001",
    proposed_direction_ref: "direction:proposed:002",
    change_summary: "Objective scope changed and requires human confirmation.",
    impact_summary: "Continuity and task memory should be reviewed before continuing.",
    evidence_refs: ["trace:direction:001"],
  });

  return {
    backbone,
    projectId,
    suggested,
    confirmed,
    rejected,
    archived,
    directionChange,
  };
}

test("[runtime] Personal MVP AEL activity runtime records internal activity events", () => {
  const { backbone, projectId } = createSeededBackbone();
  const activities = backbone.list_activity(projectId);

  assert.equal(activities.length, 2);
  assert.deepEqual(
    activities.map((activity) => activity.activity_kind),
    ["operator_goal_captured", "human_review_recorded"]
  );
  assert.ok(
    activities.every(
      (activity) =>
        activity.export_class === "runtime_private_non_exportable" &&
        activity.no_provider_execution === true &&
        activity.no_tool_execution === true
    )
  );
});

test("[runtime] Personal MVP VSL continuity runtime stores and returns continuity state", () => {
  const { backbone, projectId } = createSeededBackbone();
  const continuity = backbone.load_continuity_state(projectId);

  assert.equal(continuity?.current_mission_state, "mission_state:active");
  assert.equal(continuity?.scope_progress_state, "progress_state:in_review");
  assert.equal(continuity?.review_state, "needs_review");
  assert.equal(continuity?.resume_pointer, "resume:checkpoint:001");
  assert.equal(continuity?.revision, 1);
  assert.equal(continuity?.export_class, "runtime_private_non_exportable");
});

test("[runtime] Personal MVP PSG memory runtime represents three memory layers as summaries", () => {
  const { backbone, projectId } = createSeededBackbone();
  const graph = backbone.inspect_memory_graph(projectId);

  assert.equal(graph?.graph_revision, 3);
  assert.deepEqual(
    graph?.layers.map((layer) => layer.layer),
    ["operator_intake_psg", "project_scope_psg", "task_scope_psg"]
  );
  assert.ok(
    graph?.layers.every(
      (layer) =>
        layer.node_refs.length === 1 &&
        layer.relation_refs.length === 1 &&
        layer.export_class === "runtime_private_non_exportable"
    )
  );
});

test("[runtime] Personal MVP Learning feedback runtime stores all reviewable states", () => {
  const { backbone, projectId } = createSeededBackbone();
  const candidates = backbone.list_learning_feedback(projectId);

  assert.deepEqual(
    candidates.map((candidate) => candidate.state).sort(),
    ["archived", "confirmed", "rejected", "suggested"]
  );
  assert.ok(
    candidates.every(
      (candidate) =>
        candidate.mutation_applied === false &&
        candidate.training_applied === false &&
        candidate.export_class === "runtime_private_non_exportable"
    )
  );
});

test("[runtime] Personal MVP direction-change runtime creates pending human confirmation records", () => {
  const { backbone, projectId, directionChange } = createSeededBackbone();
  const records = backbone.list_direction_changes(projectId);

  assert.equal(records.length, 1);
  assert.equal(directionChange.state, "pending_confirmation");
  assert.equal(directionChange.requires_operator_confirmation, true);
  assert.equal(directionChange.automatic_acceptance_applied, false);
  assert.equal(records[0]?.proposed_direction_ref, "direction:proposed:002");
});

test("[runtime] Personal MVP runtime backbone projection reports runtime availability while denying execution authority", () => {
  const { backbone, projectId, directionChange } = createSeededBackbone();
  const projection = backbone.create_public_projection({
    project_id: projectId,
    source_commit_ref: "test-head",
  });

  assert.equal(projection.ael_activity_summary.activity_count, 2);
  assert.equal(
    projection.vsl_continuity_summary.current_mission_state,
    "mission_state:active"
  );
  assert.deepEqual(
    projection.psg_memory_summary.layers.map((layer) => layer.layer),
    ["operator_intake_psg", "project_scope_psg", "task_scope_psg"]
  );
  assert.deepEqual(
    projection.learning_feedback_summary.states_present.sort(),
    ["archived", "confirmed", "rejected", "suggested"]
  );
  assert.equal(
    projection.direction_change_summary.direction_change_ref,
    directionChange.direction_change_ref
  );
  assert.equal(
    projection.direction_change_summary.state,
    "pending_confirmation"
  );
  assert.equal(
    projection.boundary_flags.personal_mvp_ael_activity_runtime_available,
    true
  );
  assert.equal(
    projection.boundary_flags.personal_mvp_vsl_continuity_runtime_available,
    true
  );
  assert.equal(
    projection.boundary_flags.personal_mvp_psg_memory_runtime_available,
    true
  );
  assert.equal(
    projection.boundary_flags.personal_mvp_learning_feedback_runtime_available,
    true
  );
  assert.equal(
    projection.boundary_flags.personal_mvp_direction_change_runtime_available,
    true
  );
  assert.equal(projection.boundary_flags.full_enterprise_ael_runtime_claimed, false);
  assert.equal(projection.boundary_flags.full_enterprise_vsl_runtime_claimed, false);
  assert.equal(projection.boundary_flags.full_enterprise_psg_runtime_claimed, false);
  assert.equal(
    projection.boundary_flags.full_enterprise_learning_engine_claimed,
    false
  );
  assert.equal(projection.boundary_flags.provider_execution_authorized, false);
  assert.equal(projection.boundary_flags.model_execution_authorized, false);
  assert.equal(projection.boundary_flags.tool_execution_authorized, false);
  assert.equal(projection.boundary_flags.worker_execution_authorized, false);
  assert.equal(projection.boundary_flags.automatic_mutation_authorized, false);
  assert.equal(projection.boundary_flags.autonomous_acceptance_authorized, false);
  assert.equal(projection.boundary_flags.training_authorized, false);
  assert.equal(projection.boundary_flags.writeback_authorized, false);
  assert.ok(projection.safe_evidence_refs.length >= 5);
  assert.ok(
    projection.omissions.every((omission) => omission.runtime_private === true)
  );
});

test("[runtime] Personal MVP runtime backbone public DTO is type-only and package exported", async () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  assert.equal(
    packageJson.exports["./runtime/public/personal-mvp-runtime-backbone-dto"],
    "./runtime/public/personal-mvp-runtime-backbone-dto.ts"
  );
  assert.equal(existsSync(dtoPath), true);

  const module = await import("cognitive_os/runtime/public/personal-mvp-runtime-backbone-dto");

  assert.deepEqual(Object.keys(module), []);
});

test("[runtime] Personal MVP runtime-private service is not package exported directly", () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const exportedText = JSON.stringify(packageJson.exports, null, 2);

  assert.equal(packageJson.exports["./runtime/core/personal-mvp-runtime-backbone"], undefined);
  assert.equal(exportedText.includes(runtimePath), false);
});

test("[runtime] Personal MVP backbone sources avoid MPLP schema mutation and external execution claims", () => {
  const dtoSource = readFileSync(dtoPath, "utf8");
  const runtimeSource = readFileSync(runtimePath, "utf8");

  assert.doesNotMatch(dtoSource, /export function\b|export class\b|export const\b/u);
  assert.doesNotMatch(
    `${dtoSource}\n${runtimeSource}`,
    /modify_mplp_schema|schema_mutation|provider_execution_authorized:\s*true|tool_execution_authorized:\s*true|automatic_mutation_authorized:\s*true|autonomous_acceptance_authorized:\s*true/u
  );
});
