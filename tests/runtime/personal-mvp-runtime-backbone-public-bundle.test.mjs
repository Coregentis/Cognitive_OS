import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import {
  createPersonalMvpRuntimeBackboneProjection,
  summarizePersonalMvpRuntimeBackboneProjection,
  validatePersonalMvpRuntimeBackboneProjection,
} from "../../runtime/public/personal-mvp-runtime-backbone-bundle.ts";

const packageJsonPath = "package.json";
const bundlePath = "runtime/public/personal-mvp-runtime-backbone-bundle.ts";
const runtimePrivatePath = "runtime/core/personal-mvp-runtime-backbone.ts";

function createBundleInput() {
  return {
    project_id: "project:public-bundle",
    runtime_backbone_ref: "personal-mvp-runtime-backbone:public-bundle",
    source_commit_ref: "test-head",
    generated_at: "2026-05-23T00:00:00.000Z",
    activities: [
      {
        activity_kind: "operator_goal_captured",
        summary: "Captured goal as an internal runtime event.",
        source_ref: "objective:bundle:001",
        evidence_refs: ["trace:bundle:activity:001"],
      },
      {
        activity_kind: "confirmation_requested",
        summary: "Requested confirmation for a direction change.",
        source_ref: "direction:bundle:001",
        evidence_refs: ["trace:bundle:activity:002"],
      },
    ],
    continuity_state: {
      current_mission_state: "mission_state:bundle_active",
      progress_state: "progress_state:review_ready",
      review_state: "needs_review",
      packet_state: "packet_state:summary_ready",
      artifact_state: "artifact_state:refs_only",
      resume_pointer: "resume:bundle:001",
      last_confirmed_direction: "direction:bundle:confirmed",
      next_safe_action: "confirm_direction_change",
      evidence_refs: ["trace:bundle:continuity:001"],
    },
    memory_layers: [
      {
        layer: "operator_intake_psg",
        summary: "Operator intake memory summary.",
        node_refs: ["node:operator:001"],
        relation_refs: ["relation:operator:001"],
        evidence_refs: ["trace:bundle:memory:operator"],
      },
      {
        layer: "project_scope_psg",
        summary: "Project scope memory summary.",
        node_refs: ["node:project:001"],
        relation_refs: ["relation:project:001"],
        evidence_refs: ["trace:bundle:memory:project"],
      },
      {
        layer: "task_scope_psg",
        summary: "Task scope memory summary.",
        node_refs: ["node:task:001"],
        relation_refs: ["relation:task:001"],
        evidence_refs: ["trace:bundle:memory:task"],
      },
    ],
    learning_feedback: [
      {
        learning_kind: "style_preference",
        summary: "Prefer concise summaries.",
        state: "suggested",
        target_ref: "preference:style:001",
        evidence_refs: ["trace:bundle:learning:001"],
      },
      {
        learning_kind: "workflow_preference",
        summary: "Confirm before direction changes.",
        state: "confirmed",
        target_ref: "preference:workflow:001",
        evidence_refs: ["trace:bundle:learning:002"],
      },
    ],
    direction_change: {
      previous_direction_ref: "direction:bundle:confirmed",
      proposed_direction_ref: "direction:bundle:proposed",
      change_summary: "Direction changed and needs confirmation.",
      impact_summary: "Continuity, memory, and review state must remain inspectable.",
      state: "pending_confirmation",
      evidence_refs: ["trace:bundle:direction:001"],
    },
  };
}

test("[runtime] Personal MVP runtime backbone public bundle is package-exported", async () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  assert.equal(
    packageJson.exports["./runtime/public/personal-mvp-runtime-backbone-bundle"],
    "./runtime/public/personal-mvp-runtime-backbone-bundle.ts"
  );
  assert.equal(existsSync(bundlePath), true);

  const bundleModule = await import(
    "cognitive_os/runtime/public/personal-mvp-runtime-backbone-bundle"
  );

  assert.deepEqual(
    Object.keys(bundleModule).sort(),
    [
      "createPersonalMvpRuntimeBackboneProjection",
      "summarizePersonalMvpRuntimeBackboneProjection",
      "validatePersonalMvpRuntimeBackboneProjection",
    ].sort()
  );
});

test("[runtime] Personal MVP runtime-private backbone remains not package-exported", () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const exportedText = JSON.stringify(packageJson.exports, null, 2);

  assert.equal(
    packageJson.exports["./runtime/core/personal-mvp-runtime-backbone"],
    undefined
  );
  assert.equal(exportedText.includes(runtimePrivatePath), false);
});

test("[runtime] public bundle creates runtime-backed projection from plain input", () => {
  const projection = createPersonalMvpRuntimeBackboneProjection(createBundleInput());
  const validationIssues =
    validatePersonalMvpRuntimeBackboneProjection(projection);
  const summary = summarizePersonalMvpRuntimeBackboneProjection(projection);

  assert.deepEqual(validationIssues, []);
  assert.equal(projection.runtime_backbone_ref, "personal-mvp-runtime-backbone:public-bundle");
  assert.equal(projection.ael_activity_summary.activity_count, 2);
  assert.equal(projection.vsl_continuity_summary.current_mission_state, "mission_state:bundle_active");
  assert.deepEqual(
    projection.psg_memory_summary.layers.map((layer) => layer.layer),
    ["operator_intake_psg", "project_scope_psg", "task_scope_psg"]
  );
  assert.deepEqual(
    projection.learning_feedback_summary.states_present.sort(),
    ["confirmed", "suggested"]
  );
  assert.equal(
    projection.direction_change_summary.state,
    "pending_confirmation"
  );
  assert.equal(summary.personal_mvp_runtime_available, true);
  assert.equal(summary.full_enterprise_runtime_claimed, false);
  assert.equal(summary.execution_authority_granted, false);
  assert.equal(summary.automatic_change_authority_granted, false);
});

test("[runtime] public bundle validates missing AEL VSL PSG Learning and direction-change summaries", () => {
  const projection = createPersonalMvpRuntimeBackboneProjection({
    project_id: "project:invalid-bundle",
    source_commit_ref: "test-head",
    generated_at: "2026-05-23T00:00:00.000Z",
  });
  const issues = validatePersonalMvpRuntimeBackboneProjection(projection);

  assert.ok(issues.includes("ael_activity_summary requires at least one activity"));
  assert.ok(issues.includes("vsl_continuity_summary.current_mission_state is missing"));
  assert.ok(issues.includes("psg_memory_summary missing operator_intake_psg"));
  assert.ok(issues.includes("psg_memory_summary missing project_scope_psg"));
  assert.ok(issues.includes("psg_memory_summary missing task_scope_psg"));
  assert.ok(issues.includes("learning_feedback_summary requires at least one candidate"));
  assert.ok(issues.includes("direction_change_summary.direction_change_ref is required"));
});

test("[runtime] public bundle preserves all execution-denial flags", () => {
  const projection = createPersonalMvpRuntimeBackboneProjection(createBundleInput());
  const flags = projection.boundary_flags;

  assert.equal(flags.personal_mvp_ael_activity_runtime_available, true);
  assert.equal(flags.personal_mvp_vsl_continuity_runtime_available, true);
  assert.equal(flags.personal_mvp_psg_memory_runtime_available, true);
  assert.equal(flags.personal_mvp_learning_feedback_runtime_available, true);
  assert.equal(flags.personal_mvp_direction_change_runtime_available, true);
  assert.equal(flags.full_enterprise_ael_runtime_claimed, false);
  assert.equal(flags.full_enterprise_vsl_runtime_claimed, false);
  assert.equal(flags.full_enterprise_psg_runtime_claimed, false);
  assert.equal(flags.full_enterprise_learning_engine_claimed, false);
  assert.equal(flags.provider_execution_authorized, false);
  assert.equal(flags.model_execution_authorized, false);
  assert.equal(flags.tool_execution_authorized, false);
  assert.equal(flags.worker_execution_authorized, false);
  assert.equal(flags.publishing_authorized, false);
  assert.equal(flags.external_action_authorized, false);
  assert.equal(flags.automatic_mutation_authorized, false);
  assert.equal(flags.autonomous_acceptance_authorized, false);
  assert.equal(flags.training_authorized, false);
  assert.equal(flags.writeback_authorized, false);
});

test("[runtime] public bundle does not expose runtime-private service store or handles", () => {
  const projection = createPersonalMvpRuntimeBackboneProjection(createBundleInput());
  const serialized = JSON.stringify(projection);
  const forbiddenTerms = [
    "runtime_class_instance",
    "private_state",
    "mutable_handle",
    "service_instance",
    "private_store",
    "ael_raw_state",
    "vsl_raw_state",
    "psg_raw_state",
    "learning_engine_handle",
    "provider_handle",
    "model_handle",
    "tool_handle",
    "worker_handle",
  ];

  for (const term of forbiddenTerms) {
    assert.equal(serialized.includes(term), false, term);
  }

  assert.ok(
    projection.omissions.every((omission) => omission.runtime_private === true)
  );
  assert.equal(projection.runtime_private_fields_omitted, true);
});

test("[runtime] public bundle can be consumed without importing runtime core from tests", () => {
  const testSource = readFileSync(
    "tests/runtime/personal-mvp-runtime-backbone-public-bundle.test.mjs",
    "utf8"
  );
  const bundleSource = readFileSync(bundlePath, "utf8");

  assert.doesNotMatch(
    testSource,
    /from\s+["'][^"']*runtime\/core\/personal-mvp-runtime-backbone/u
  );
  assert.match(
    bundleSource,
    /from "\.\.\/core\/personal-mvp-runtime-backbone\.ts"/u
  );
});
