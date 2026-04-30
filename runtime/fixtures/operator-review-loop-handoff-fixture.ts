import type { LocalReviewLoopResult } from "../core/operator-review-loop-contract.ts";
import {
  createLocalReviewLoopResult,
} from "../core/operator-review-loop-workflow.ts";

export function createOperatorReviewLoopHandoffFixture(): LocalReviewLoopResult {
  return createLocalReviewLoopResult({
    result_id: "local_review_loop_result_fixture_01",
    workspace_id: "operator_workspace_fixture_01",
    session_id: "operator_session_fixture_01",
    loop_state_id: "review_loop_state_fixture_01",
    entry_surface_id: "operator_entry_surface_fixture_01",
    runner_id: "review_loop_runner_fixture_01",
    packet_id: "operator_review_packet_fixture_01",
    ledger_id: "session_evidence_ledger_fixture_01",
    bundle_id: "deterministic_evidence_bundle_fixture_01",
    projection_envelope_id: "operator_review_loop_handoff_fixture_01",
    state_snapshot_ref: "state_snapshot_ref_fixture_01",
    reviewed_step_refs: ["review_step_fixture_01"],
    step_refs: [
      {
        step_ref: "review_step_fixture_01",
        status: "reviewed",
      },
    ],
    evidence_refs: ["safe_evidence_ref_fixture_01"],
    allowed_manual_actions: [
      "continue_review",
      "mark_blocked",
      "request_more_context",
    ],
    manual_decision_options: [
      "continue_review",
      "mark_blocked",
      "request_more_context",
    ],
    bundle_kind: "in_memory_evidence_bundle",
    bundle_summary:
      "Deterministic in-memory evidence bundle for fixture review posture.",
    created_at: "1970-01-01T00:00:00.000Z",
  });
}
