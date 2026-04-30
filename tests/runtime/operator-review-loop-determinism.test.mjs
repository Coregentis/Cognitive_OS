import test from "node:test";
import assert from "node:assert/strict";

import {
  createLocalReviewLoopResult,
  createOperatorReviewPacket,
} from "../../runtime/core/operator-review-loop-workflow.ts";

test("[runtime] operator review loop construction is deterministic", () => {
  const input = {
    result_id: "local_review_loop_result_determinism_01",
    evidence_refs: ["safe_evidence_ref_b", "safe_evidence_ref_a"],
    reviewed_step_refs: ["review_step_b", "review_step_a"],
    step_refs: [
      { step_ref: "review_step_b", status: "reviewed" },
      { step_ref: "review_step_a", status: "reviewed" },
    ],
    allowed_manual_actions: ["request_more_context", "continue_review"],
    manual_decision_options: ["mark_blocked", "continue_review"],
  };

  assert.deepEqual(
    createLocalReviewLoopResult(input),
    createLocalReviewLoopResult(input)
  );
});

test("[runtime] operator review loop packet ordering is stable", () => {
  const packet = createOperatorReviewPacket({
    packet_id: "operator_review_packet_determinism_01",
    loop_state_ref: "review_loop_state_determinism_01",
    reviewed_step_refs: ["review_step_c", "review_step_a", "review_step_b"],
    blocked_step_refs: ["review_step_z", "review_step_y"],
    manual_decision_options: ["mark_blocked", "continue_review"],
    evidence_refs: ["safe_evidence_ref_c", "safe_evidence_ref_a"],
    projection_envelope_ref: "projection_envelope_determinism_01",
  });

  assert.deepEqual(packet.reviewed_step_refs, [
    "review_step_a",
    "review_step_b",
    "review_step_c",
  ]);
  assert.deepEqual(packet.blocked_step_refs, [
    "review_step_y",
    "review_step_z",
  ]);
  assert.deepEqual(packet.evidence_refs, [
    "safe_evidence_ref_a",
    "safe_evidence_ref_c",
  ]);
});
