import test from "node:test";
import assert from "node:assert/strict";

import {
  assert_no_forbidden_projection_keys,
} from "../../runtime/core/projection-safe-envelope.ts";
import {
  createDeterministicEvidenceBundle,
  createLocalReviewLoopResult,
  createOperatorSession,
  createProjectionSafeOperatorReviewLoopHandoff,
  createReviewLoopRunner,
} from "../../runtime/core/operator-review-loop-workflow.ts";

test("[runtime] operator review loop workflow composes projection-safe objects", () => {
  const result = createLocalReviewLoopResult();

  assert.equal(result.result_id, "local_review_loop_result_01");
  assert.equal(result.workspace.status, "active");
  assert.equal(result.session.status, "review_ready");
  assert.equal(result.loop_state.status, "review_ready");
  assert.equal(result.runner.status, "review_ready");
  assert.equal(result.review_packet.status, "review_ready");
  assert.equal(result.evidence_ledger.status, "active");
  assert.equal(result.evidence_bundle.status, "review_ready");
  assert.equal(result.projection_handoff.non_executing, true);
  assert.equal(result.projection_handoff.runtime_private_fields_omitted, true);
  assert.equal(result.projection_handoff.module_posture_summary.length, 10);
  assert.equal(result.projection_handoff.kernel_duty_posture_summary.length, 11);
  assert.equal(result.projection_handoff.safe_evidence_refs.length, 1);
  assert.doesNotThrow(() => assert_no_forbidden_projection_keys(result));
});

test("[runtime] operator review loop workflow does not mutate caller input", () => {
  const input = {
    result_id: "local_review_loop_result_input_01",
    evidence_refs: ["safe_evidence_ref_b", "safe_evidence_ref_a"],
    reviewed_step_refs: ["review_step_b", "review_step_a"],
    step_refs: [
      { step_ref: "review_step_b", status: "reviewed" },
      { step_ref: "review_step_a", status: "reviewed" },
    ],
    allowed_manual_actions: ["mark_blocked", "continue_review"],
    manual_decision_options: ["request_more_context", "continue_review"],
  };
  const before = structuredClone(input);

  const result = createLocalReviewLoopResult(input);

  assert.deepEqual(input, before);
  assert.deepEqual(result.evidence_bundle.evidence_refs, [
    "safe_evidence_ref_a",
    "safe_evidence_ref_b",
  ]);
  assert.deepEqual(result.runner.step_refs.map((step) => step.step_ref), [
    "review_step_a",
    "review_step_b",
  ]);
});

test("[runtime] operator review loop missing references produce blocked posture", () => {
  const session = createOperatorSession({
    session_id: "operator_session_blocked_01",
    review_loop_ref: "review_loop_state_blocked_01",
    projection_envelope_ref: "projection_envelope_blocked_01",
  });
  const runner = createReviewLoopRunner({
    runner_id: "review_loop_runner_blocked_01",
    loop_state_ref: "review_loop_state_blocked_01",
    projection_envelope_ref: "projection_envelope_blocked_01",
  });
  const bundle = createDeterministicEvidenceBundle({
    bundle_id: "deterministic_evidence_bundle_blocked_01",
    ledger_ref: "session_evidence_ledger_blocked_01",
    packet_ref: "operator_review_packet_blocked_01",
    projection_envelope_ref: "projection_envelope_blocked_01",
  });
  const handoff = createProjectionSafeOperatorReviewLoopHandoff({
    projection_envelope_id: "projection_envelope_blocked_01",
    blocked: true,
  });

  assert.equal(session.status, "blocked");
  assert.equal(runner.status, "blocked");
  assert.equal(bundle.status, "blocked");
  assert.ok(
    handoff.source_runtime_object_refs.includes(
      "projection_envelope_blocked_01_error_insufficiency_posture"
    )
  );
  assert.ok(
    handoff.omission_markers.some(
      (marker) => marker.marker === "operator_review_loop_uses_safe_refs_only"
    )
  );
});
