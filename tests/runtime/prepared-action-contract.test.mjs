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
  createPreparedActionConfirmationRequirement,
  createPreparedActionEvidenceSufficiency,
  createPreparedActionIntentSummary,
  createPreparedActionMissingInformation,
  createPreparedActionProjection,
  createPreparedActionRiskSummary,
  is_prepared_action_projection,
  validate_prepared_action_projection,
} from "../../runtime/core/prepared-action-contract.ts";

function createPreparedActionIntentSummaryInput(overrides = {}) {
  return {
    action_label: "draft action summary",
    action_summary: "Possible future action remains draft-only and non-executing.",
    ...overrides,
  };
}

function createPreparedActionRiskSummaryInput(overrides = {}) {
  return {
    risk_summary: "Risk summary remains explanatory only.",
    boundary_summary:
      "Boundary summary stays below execution, approval, dispatch, and queue semantics.",
    ...overrides,
  };
}

function createPreparedActionEvidenceSufficiencyInput(overrides = {}) {
  return {
    sufficiency_state: "partial",
    sufficiency_summary:
      "Evidence sufficiency is partial and remains a bounded summary only.",
    ...overrides,
  };
}

function createPreparedActionMissingInformationInput(overrides = {}) {
  return {
    missing_information_summary:
      "Missing information remains visible in bounded terms.",
    missing_information_items: [
      "bounded operator clarification",
      "bounded risk context",
    ],
    ...overrides,
  };
}

function createPreparedActionConfirmationRequirementInput(overrides = {}) {
  return {
    confirmation_required: true,
    confirmation_summary:
      "Human confirmation requirement is visible as a summary, not approval control.",
    ...overrides,
  };
}

function createPreparedActionProjectionInput(overrides = {}) {
  return {
    prepared_action_id: "prepared_action_01",
    project_id: "project_01",
    intent_summary: createPreparedActionIntentSummaryInput(),
    risk_summary: createPreparedActionRiskSummaryInput(),
    evidence_sufficiency: createPreparedActionEvidenceSufficiencyInput(),
    missing_information: createPreparedActionMissingInformationInput(),
    confirmation_requirement:
      createPreparedActionConfirmationRequirementInput(),
    safe_evidence_refs: [
      "evidence_ref_01",
      {
        evidence_ref: "evidence_ref_02",
        evidence_label: "bounded evidence reference",
      },
    ],
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
  assert.equal(typeof createPreparedActionProjection, "function");
});

test("[runtime] prepared-action scaffold creates a valid projection-safe draft surface", () => {
  const projection = createPreparedActionProjection(
    createPreparedActionProjectionInput({
      prepared_action_id: undefined,
    })
  );
  const result = validate_prepared_action_projection(projection);

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(is_prepared_action_projection(projection), true);
  assert.match(projection.prepared_action_id, /^prepared_action_/);
  assert.equal(projection.boundary_posture.provider_channel_execution_available, false);
  assert.equal(
    projection.boundary_posture.approval_dispatch_execution_available,
    false
  );
  assert.equal(projection.boundary_posture.queue_available, false);
});

test("[runtime] prepared-action scaffold helpers produce neutral draft-only output", () => {
  const intent = createPreparedActionIntentSummary(
    createPreparedActionIntentSummaryInput()
  );
  const risk = createPreparedActionRiskSummary(
    createPreparedActionRiskSummaryInput()
  );
  const evidence = createPreparedActionEvidenceSufficiency(
    createPreparedActionEvidenceSufficiencyInput()
  );
  const missing = createPreparedActionMissingInformation(
    createPreparedActionMissingInformationInput()
  );
  const confirmation = createPreparedActionConfirmationRequirement(
    createPreparedActionConfirmationRequirementInput()
  );

  assert.match(intent.non_executing_posture, /draft-only/i);
  assert.match(risk.non_executing_posture, /projection-safe/i);
  assert.equal(evidence.runtime_private_fields_omitted, true);
  assert.equal(missing.runtime_private_fields_omitted, true);
  assert.equal(confirmation.runtime_private_fields_omitted, true);
  assert.match(confirmation.non_executing_posture, /non-executing/i);
});

test("[runtime] prepared-action scaffold keeps safe_evidence_refs reference-only", () => {
  const projection = createPreparedActionProjection(
    createPreparedActionProjectionInput()
  );

  assert.deepEqual(projection.safe_evidence_refs, [
    { evidence_ref: "evidence_ref_01" },
    {
      evidence_ref: "evidence_ref_02",
      evidence_label: "bounded evidence reference",
    },
  ]);
  assert.deepEqual(Object.keys(projection.safe_evidence_refs[0]), ["evidence_ref"]);
  assert.deepEqual(
    Object.keys(projection.safe_evidence_refs[1]),
    ["evidence_ref", "evidence_label"]
  );
});

test("[runtime] prepared-action contract requires runtime_private_fields_omitted", () => {
  const result = validate_prepared_action_projection(
    {
      ...createPreparedActionProjection(
        createPreparedActionProjectionInput({
          prepared_action_id: "prepared_action_01",
        })
      ),
      runtime_private_fields_omitted: false,
    }
  );

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /runtime_private_fields_omitted must be true/);
});

test("[runtime] prepared-action contract rejects forbidden raw runtime-private fields", () => {
  const result = validate_prepared_action_projection(
    {
      ...createPreparedActionProjection(createPreparedActionProjectionInput()),
      raw_vsl: { forbidden: true },
    }
  );

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /forbidden runtime-private field: raw_vsl/);
});

test("[runtime] prepared-action contract rejects forbidden execution and queue fields", () => {
  const with_execution = validate_prepared_action_projection(
    {
      ...createPreparedActionProjection(createPreparedActionProjectionInput()),
      dispatch_result: "forbidden",
    }
  );
  const with_queue = validate_prepared_action_projection(
    {
      ...createPreparedActionProjection(createPreparedActionProjectionInput()),
      queue_state: "forbidden",
    }
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
    {
      ...createPreparedActionProjection(createPreparedActionProjectionInput()),
      risk_summary: {
        risk_summary: "approval granted",
        boundary_summary: "provider/channel execution available",
        non_executing_posture:
          "Prepared action remains draft-only, projection-safe, and non-executing.",
      },
    }
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
  const projection = createPreparedActionProjection(
    createPreparedActionProjectionInput()
  );
  const result = validate_prepared_action_projection(projection);
  const copySurface = JSON.stringify(projection);

  assert.equal(result.ok, true);
  assert.match(copySurface, /draft-only/i);
  assert.match(copySurface, /projection-safe/i);
  assert.match(copySurface, /non-executing/i);
  assert.doesNotMatch(copySurface, /provider\/channel execution available/i);
  assert.doesNotMatch(copySurface, /approve\/reject\/dispatch\/execute available/i);
  assert.doesNotMatch(copySurface, /queue implementation available/i);
});
