import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  PREPARED_ACTION_DESIGN_SURFACES,
  PREPARED_ACTION_NON_CAPABILITY_LINES,
} from "../../runtime/core/prepared-action-types.ts";
import {
  FORBIDDEN_PREPARED_ACTION_EXECUTION_KEYS,
  FORBIDDEN_PREPARED_ACTION_RAW_KEYS,
  is_prepared_action_projection,
  validate_prepared_action_projection,
} from "../../runtime/core/prepared-action-contract.ts";

function createPreparedActionProjection(overrides = {}) {
  return {
    prepared_action_id: "prepared_action_01",
    project_id: "project_01",
    intent_summary: {
      action_label: "draft action summary",
      action_summary: "Possible future action remains draft-only and non-executing.",
      non_executing_posture:
        "Prepared action remains draft-only, projection-safe, and non-executing.",
    },
    risk_summary: {
      risk_summary: "Risk summary remains explanatory only.",
      boundary_summary: "Boundary summary stays below execution, approval, dispatch, and queue semantics.",
      non_executing_posture:
        "Prepared action remains draft-only, projection-safe, and non-executing.",
    },
    evidence_sufficiency: {
      sufficiency_state: "partial",
      sufficiency_summary: "Evidence sufficiency is partial and remains a bounded summary only.",
      runtime_private_fields_omitted: true,
    },
    missing_information: {
      missing_information_summary: "Missing information remains visible in bounded terms.",
      missing_information_items: [
        "bounded operator clarification",
        "bounded risk context",
      ],
      runtime_private_fields_omitted: true,
    },
    confirmation_requirement: {
      confirmation_required: true,
      confirmation_summary:
        "Human confirmation requirement is visible as a summary, not approval control.",
      runtime_private_fields_omitted: true,
      non_executing_posture:
        "Prepared action remains draft-only, projection-safe, and non-executing.",
    },
    boundary_posture: {
      non_executing_posture:
        "Prepared action remains draft-only, projection-safe, and non-executing.",
      provider_channel_execution_available: false,
      approval_dispatch_execution_available: false,
      queue_available: false,
      runtime_private_fields_omitted: true,
    },
    safe_evidence_refs: [
      {
        evidence_ref: "evidence_ref_01",
        evidence_label: "bounded evidence reference",
      },
    ],
    runtime_private_fields_omitted: true,
    created_at: "2026-04-23T00:00:00.000Z",
    ...overrides,
  };
}

test("[runtime] prepared-action contract exports the required neutral design surfaces", () => {
  assert.deepEqual(PREPARED_ACTION_DESIGN_SURFACES, [
    "PreparedActionProjection",
    "PreparedActionIntentSummary",
    "PreparedActionRiskSummary",
    "PreparedActionEvidenceSufficiency",
    "PreparedActionMissingInformation",
    "PreparedActionConfirmationRequirement",
    "PreparedActionBoundaryPosture",
    "PreparedActionSafeEvidenceRef",
  ]);

  assert.match(
    PREPARED_ACTION_NON_CAPABILITY_LINES.join(" "),
    /not execution/i
  );
});

test("[runtime] prepared-action contract accepts a valid projection-safe draft surface", () => {
  const result = validate_prepared_action_projection(
    createPreparedActionProjection()
  );

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(is_prepared_action_projection(createPreparedActionProjection()), true);
});

test("[runtime] prepared-action contract requires runtime_private_fields_omitted", () => {
  const result = validate_prepared_action_projection(
    createPreparedActionProjection({
      runtime_private_fields_omitted: false,
    })
  );

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /runtime_private_fields_omitted must be true/);
});

test("[runtime] prepared-action contract rejects forbidden raw runtime-private fields", () => {
  const result = validate_prepared_action_projection(
    createPreparedActionProjection({
      raw_vsl: { forbidden: true },
    })
  );

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /forbidden runtime-private field: raw_vsl/);
});

test("[runtime] prepared-action contract rejects forbidden execution and queue fields", () => {
  const with_execution = validate_prepared_action_projection(
    createPreparedActionProjection({
      dispatch_result: "forbidden",
    })
  );
  const with_queue = validate_prepared_action_projection(
    createPreparedActionProjection({
      queue_state: "forbidden",
    })
  );

  assert.equal(with_execution.ok, false);
  assert.match(with_execution.errors.join(" "), /forbidden execution field: dispatch_result/);
  assert.equal(with_queue.ok, false);
  assert.match(with_queue.errors.join(" "), /forbidden queue field: queue_state/);
  assert.ok(FORBIDDEN_PREPARED_ACTION_RAW_KEYS.includes("raw_vsl"));
  assert.ok(FORBIDDEN_PREPARED_ACTION_EXECUTION_KEYS.includes("dispatch_result"));
});

test("[runtime] prepared-action contract rejects positive execution capability wording", () => {
  const result = validate_prepared_action_projection(
    createPreparedActionProjection({
      risk_summary: {
        risk_summary: "approval granted",
        boundary_summary: "provider/channel execution available",
        non_executing_posture:
          "Prepared action remains draft-only, projection-safe, and non-executing.",
      },
    })
  );

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /forbidden capability wording/i);
});

test("[runtime] prepared-action changed files stay free of product-specific naming", () => {
  const contents = [
    readFileSync(new URL("../../runtime/core/prepared-action-types.ts", import.meta.url), "utf8"),
    readFileSync(new URL("../../runtime/core/prepared-action-contract.ts", import.meta.url), "utf8"),
  ].join("\n");

  assert.doesNotMatch(contents, /SoloCrew/u);
  assert.doesNotMatch(contents, /founder/u);
  assert.doesNotMatch(contents, /Secretary/u);
  assert.doesNotMatch(contents, /portfolio/u);
  assert.doesNotMatch(contents, /packet revision/u);
});

test("[runtime] prepared-action projection-safe posture is preserved", () => {
  const result = validate_prepared_action_projection(
    createPreparedActionProjection()
  );
  const copySurface = JSON.stringify(createPreparedActionProjection());

  assert.equal(result.ok, true);
  assert.match(copySurface, /draft-only/i);
  assert.match(copySurface, /projection-safe/i);
  assert.match(copySurface, /non-executing/i);
  assert.doesNotMatch(copySurface, /provider\/channel execution available/i);
  assert.doesNotMatch(copySurface, /approve\/reject\/dispatch\/execute available/i);
  assert.doesNotMatch(copySurface, /queue implementation available/i);
});
