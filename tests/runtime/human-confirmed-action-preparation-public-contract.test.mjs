import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import {
  HUMAN_CONFIRMED_ACTION_PREPARATION_ALLOWED_TRANSITIONS,
  createHumanConfirmedActionPreparation,
  summarizeHumanConfirmedActionPreparation,
  transitionHumanConfirmedActionPreparationState,
  validateHumanConfirmedActionPreparation,
} from "../../runtime/public/human-confirmed-action-preparation-bundle.ts";

const packageJsonPath = "package.json";
const dtoPath = "runtime/public/human-confirmed-action-preparation-dto.ts";
const bundlePath = "runtime/public/human-confirmed-action-preparation-bundle.ts";
const testPath =
  "tests/runtime/human-confirmed-action-preparation-public-contract.test.mjs";

function createPreparationInput(overrides = {}) {
  return {
    action_preparation_id: "human_confirmed_action_preparation_test_01",
    objective_ref: "objective:test:001",
    prepared_action_title: "Review prepared neutral action",
    prepared_action_summary:
      "Prepare a reviewable action packet that waits for explicit human confirmation.",
    action_kind: "review_decision",
    target_surface_ref: "surface:test:001",
    requested_by_ref: "operator:test:001",
    risk_summary: {
      risk_level: "medium",
      summary: "Risk remains bounded because the action is prepared only.",
      boundary_summary:
        "Prepared and confirmed states do not execute or authorize execution.",
      mitigations: ["Keep provider, worker, and external action flags false."],
    },
    expected_outcome:
      "A human can review the packet before any later separately authorized bridge exists.",
    evidence_refs: [
      "trace:test:001",
      {
        evidence_ref: "confirm:test:001",
        evidence_kind: "confirmation_boundary",
        summary: "Explicit human confirmation remains required.",
      },
    ],
    omissions: [
      {
        marker: "runtime_private_payload",
        reason: "Only safe refs and summaries are exposed.",
      },
    ],
    ...overrides,
  };
}

function falseAuthorityFlags(flags) {
  return [
    flags.executes_action,
    flags.authorizes_provider_execution,
    flags.authorizes_model_execution,
    flags.authorizes_tool_execution,
    flags.authorizes_worker_execution,
    flags.authorizes_publishing,
    flags.authorizes_payment,
    flags.authorizes_customer_outreach,
    flags.authorizes_external_action,
    flags.authorizes_automatic_mutation,
    flags.authorizes_autonomous_acceptance,
    flags.authorizes_training,
    flags.authorizes_writeback,
  ];
}

test("[runtime] human-confirmed action preparation DTO and bundle are package-exported", async () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  assert.equal(
    packageJson.exports[
      "./runtime/public/human-confirmed-action-preparation-dto"
    ],
    "./runtime/public/human-confirmed-action-preparation-dto.ts"
  );
  assert.equal(
    packageJson.exports[
      "./runtime/public/human-confirmed-action-preparation-bundle"
    ],
    "./runtime/public/human-confirmed-action-preparation-bundle.ts"
  );
  assert.equal(existsSync(dtoPath), true);
  assert.equal(existsSync(bundlePath), true);

  const bundleModule = await import(
    "cognitive_os/runtime/public/human-confirmed-action-preparation-bundle"
  );

  assert.deepEqual(
    Object.keys(bundleModule).sort(),
    [
      "HUMAN_CONFIRMED_ACTION_PREPARATION_ALLOWED_TRANSITIONS",
      "createHumanConfirmedActionPreparation",
      "summarizeHumanConfirmedActionPreparation",
      "transitionHumanConfirmedActionPreparationState",
      "validateHumanConfirmedActionPreparation",
    ].sort()
  );
});

test("[runtime] createHumanConfirmedActionPreparation creates a non-executing prepared action", () => {
  const preparation = createHumanConfirmedActionPreparation(
    createPreparationInput({ action_preparation_id: undefined })
  );
  const summary = summarizeHumanConfirmedActionPreparation(preparation);

  assert.match(
    preparation.action_preparation_id,
    /^human_confirmed_action_preparation_/u
  );
  assert.deepEqual(validateHumanConfirmedActionPreparation(preparation), []);
  assert.equal(preparation.current_state, "prepared");
  assert.equal(preparation.human_authority_required, true);
  assert.equal(preparation.autonomous_execution_authorized, false);
  assert.equal(
    preparation.confirmation_boundary.confirmation_is_not_execution,
    true
  );
  assert.equal(preparation.boundary_flags.prepares_action, true);
  assert.equal(preparation.boundary_flags.executes_action, false);
  assert.equal(summary.executes_action, false);
});

test("[runtime] human authority and confirmation boundary stay explicit", () => {
  const preparation = createHumanConfirmedActionPreparation(
    createPreparationInput()
  );

  assert.equal(preparation.human_authority_required, true);
  assert.equal(preparation.confirmation_boundary.human_final_authority, true);
  assert.equal(
    preparation.confirmation_boundary.explicit_confirmation_required,
    true
  );
  assert.equal(
    preparation.confirmation_boundary.confirmation_is_not_execution,
    true
  );
  assert.equal(preparation.confirmation_boundary.no_autonomous_approval, true);
});

test("[runtime] execution, publishing, mutation, training, and writeback flags remain false", () => {
  const preparation = createHumanConfirmedActionPreparation(
    createPreparationInput()
  );
  const flags = preparation.boundary_flags;

  assert.equal(flags.projection_safe, true);
  assert.equal(flags.summary_only, true);
  assert.equal(flags.non_executing, true);
  assert.equal(flags.evidence_safe, true);
  assert.deepEqual(
    falseAuthorityFlags(flags),
    Array.from({ length: falseAuthorityFlags(flags).length }, () => false)
  );
  assert.equal(
    flags.requires_human_confirmation_before_execution_bridge,
    true
  );
});

test("[runtime] allowed state transitions work and invalid transitions are rejected", () => {
  assert.deepEqual(HUMAN_CONFIRMED_ACTION_PREPARATION_ALLOWED_TRANSITIONS, {
    prepared: ["needs_human_review", "parked"],
    needs_human_review: [
      "confirmed_by_human",
      "rejected_by_human",
      "revised_by_human",
      "parked",
    ],
    confirmed_by_human: ["parked"],
    rejected_by_human: ["revised_by_human", "parked"],
    revised_by_human: ["needs_human_review", "parked"],
    parked: ["needs_human_review"],
    expired: ["parked"],
  });

  const prepared = createHumanConfirmedActionPreparation(createPreparationInput());
  const inReview = transitionHumanConfirmedActionPreparationState({
    preparation: prepared,
    to_state: "needs_human_review",
    transitioned_by_ref: "operator:test:001",
    transition_summary: "Ready for human review.",
  });
  const confirmed = transitionHumanConfirmedActionPreparationState({
    preparation: inReview,
    to_state: "confirmed_by_human",
    transitioned_by_ref: "operator:test:001",
    transition_summary: "Human confirmed the prepared packet.",
  });

  assert.equal(inReview.current_state, "needs_human_review");
  assert.deepEqual(inReview.allowed_next_states, [
    "confirmed_by_human",
    "rejected_by_human",
    "revised_by_human",
    "parked",
  ]);
  assert.equal(confirmed.current_state, "confirmed_by_human");
  assert.equal(confirmed.state_transition_record.length, 2);
  assert.throws(
    () =>
      transitionHumanConfirmedActionPreparationState({
        preparation: prepared,
        to_state: "confirmed_by_human",
      }),
    /transition prepared -> confirmed_by_human is not allowed/u
  );
});

test("[runtime] confirmed_by_human does not flip execution authorization", () => {
  const prepared = createHumanConfirmedActionPreparation(createPreparationInput());
  const inReview = transitionHumanConfirmedActionPreparationState({
    preparation: prepared,
    to_state: "needs_human_review",
  });
  const confirmed = transitionHumanConfirmedActionPreparationState({
    preparation: inReview,
    to_state: "confirmed_by_human",
  });
  const summary = summarizeHumanConfirmedActionPreparation(confirmed);

  assert.equal(confirmed.current_state, "confirmed_by_human");
  assert.equal(confirmed.autonomous_execution_authorized, false);
  assert.deepEqual(
    falseAuthorityFlags(confirmed.boundary_flags),
    Array.from(
      { length: falseAuthorityFlags(confirmed.boundary_flags).length },
      () => false
    )
  );
  assert.equal(
    summary.eligible_for_future_execution_bridge_only_after_separate_authorization,
    true
  );
  assert.equal(summary.executes_action, false);
});

test("[runtime] evidence refs remain summary/ref only", () => {
  const preparation = createHumanConfirmedActionPreparation(
    createPreparationInput()
  );

  assert.deepEqual(Object.keys(preparation.evidence_refs[0]).sort(), [
    "evidence_ref",
    "ref_only",
    "runtime_private_payload_omitted",
  ]);
  assert.equal(preparation.evidence_refs[0].ref_only, true);
  assert.equal(
    preparation.evidence_refs[0].runtime_private_payload_omitted,
    true
  );
  assert.deepEqual(Object.keys(preparation.evidence_refs[1]).sort(), [
    "evidence_kind",
    "evidence_ref",
    "ref_only",
    "runtime_private_payload_omitted",
    "summary",
  ]);
  assert.throws(
    () =>
      createHumanConfirmedActionPreparation(
        createPreparationInput({
          evidence_refs: [
            {
              evidence_ref: "trace:test:bad",
              raw_trace: "forbidden",
            },
          ],
        })
      ),
    /ref-only/u
  );
});

test("[runtime] public package does not expose runtime-private action preparation services", () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const exportsText = JSON.stringify(packageJson.exports, null, 2);

  assert.equal(
    packageJson.exports[
      "./runtime/core/human-confirmed-action-preparation"
    ],
    undefined
  );
  assert.equal(exportsText.includes("runtime/core"), false);
  assert.equal(exportsText.includes("ConfirmService"), false);
  assert.equal(exportsText.includes("TraceService"), false);
});

test("[runtime] contract files stay free of downstream product terms", () => {
  const contents = [
    readFileSync(dtoPath, "utf8"),
    readFileSync(bundlePath, "utf8"),
    readFileSync(testPath, "utf8"),
  ].join("\n");

  for (const forbiddenTerm of [
    String.fromCharCode(83, 111, 108, 111, 67, 114, 101, 119),
    String.fromCharCode(
      68,
      101,
      118,
      101,
      108,
      111,
      112,
      109,
      101,
      110,
      116,
      32,
      67,
      111,
      109,
      112,
      97,
      110,
      121
    ),
    String.fromCharCode(
      77,
      101,
      100,
      105,
      97,
      32,
      79,
      112,
      101,
      114,
      97,
      116,
      105,
      111,
      110,
      32,
      67,
      111,
      109,
      112,
      97,
      110,
      121
    ),
    String.fromCharCode(70, 111, 117, 110, 100, 101, 114),
  ]) {
    assert.equal(contents.includes(forbiddenTerm), false, forbiddenTerm);
  }
});
