import test from "node:test";
import assert from "node:assert/strict";

import {
  evidence_bundle_kind,
  operator_session_status,
  operator_workspace_status,
  review_loop_status,
  review_step_status,
} from "../../runtime/core/operator-review-loop-contract.ts";
import {
  createRuntimeBoundaryProfile,
} from "../../runtime/core/operator-review-loop-workflow.ts";

const requiredBoundaryFlags = [
  "local_only",
  "manual_first",
  "review_only",
  "deterministic",
  "non_executing",
  "runtime_private_payload_omitted",
  "projection_safe",
  "no_external_service",
  "no_filesystem_write",
  "no_database_storage",
  "no_persistence_adapter",
  "no_file_export_path",
  "no_cloud_sync",
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_marketplace",
  "no_crm",
  "no_email_dispatch",
  "no_public_publishing",
  "no_payment",
  "no_llm_or_tool_invocation",
  "no_autonomy",
  "no_package_publish",
  "no_certification_or_endorsement",
];

test("[runtime] operator review loop contract exports neutral status sets", () => {
  assert.deepEqual(operator_workspace_status, [
    "draft",
    "active",
    "blocked",
    "archived",
  ]);
  assert.deepEqual(operator_session_status, [
    "draft",
    "review_ready",
    "blocked",
    "archived",
  ]);
  assert.deepEqual(review_loop_status, [
    "draft",
    "review_running",
    "review_ready",
    "blocked",
    "closed",
  ]);
  assert.deepEqual(review_step_status, [
    "pending",
    "reviewed",
    "skipped",
    "blocked",
  ]);
  assert.deepEqual(evidence_bundle_kind, [
    "in_memory_evidence_bundle",
    "deterministic_summary_bundle",
    "audit_snapshot_bundle",
  ]);
});

test("[runtime] operator review loop boundary profile exposes required true flags", () => {
  const boundaryProfile = createRuntimeBoundaryProfile();

  for (const flag of requiredBoundaryFlags) {
    assert.equal(boundaryProfile[flag], true, `boundary flag: ${flag}`);
  }

  assert.deepEqual(Object.keys(boundaryProfile).sort(), [
    ...requiredBoundaryFlags,
  ].sort());
});
