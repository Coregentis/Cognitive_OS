import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  EXECUTION_BOUNDARY_DESIGN_SURFACES,
  EXECUTION_BOUNDARY_NON_CAPABILITY_LINES,
} from "../../runtime/core/execution-boundary-types.ts";
import {
  FORBIDDEN_EXECUTION_BOUNDARY_EXECUTION_KEYS,
  FORBIDDEN_EXECUTION_BOUNDARY_RAW_KEYS,
  is_execution_boundary_projection,
  validate_execution_boundary_projection,
} from "../../runtime/core/execution-boundary-contract.ts";

function createExecutionBoundaryProjection(overrides = {}) {
  return {
    execution_boundary_id: "execution_boundary_01",
    project_id: "project_01",
    requirement_summary: {
      requirement_summary:
        "Possible future human-confirmed transition remains below execution semantics.",
      non_executing_posture:
        "Execution boundary remains projection-safe and non-executing.",
    },
    risk_warning: {
      risk_warning:
        "Risk warning remains explanatory only and does not authorize side effects.",
      non_executing_posture:
        "Execution boundary remains projection-safe and non-executing.",
    },
    preflight_checklist: {
      preflight_checklist: [
        "confirm bounded operator-visible context",
        "review bounded safe evidence refs",
      ],
      runtime_private_fields_omitted: true,
    },
    acknowledgment_requirement: {
      acknowledgment_required: true,
      acknowledgment_requirement:
        "Acknowledgment requirement remains a bounded requirement summary only.",
      runtime_private_fields_omitted: true,
      non_executing_posture:
        "Execution boundary remains projection-safe and non-executing.",
    },
    transition_posture: {
      non_executing_posture:
        "Execution boundary remains projection-safe and non-executing.",
      provider_channel_execution_available: false,
      approval_dispatch_execution_available: false,
      queue_available: false,
      authoritative_transition_state_available: false,
      runtime_private_fields_omitted: true,
    },
    safe_evidence_refs: [
      {
        evidence_ref: "evidence_ref_01",
        evidence_label: "bounded evidence reference",
      },
    ],
    runtime_private_fields_omitted: true,
    created_at: "2026-04-25T00:00:00.000Z",
    ...overrides,
  };
}

test("[runtime] execution-boundary contract exports the required neutral design surfaces", () => {
  assert.deepEqual(EXECUTION_BOUNDARY_DESIGN_SURFACES, [
    "ExecutionBoundaryProjection",
    "ExecutionBoundaryRequirementSummary",
    "ExecutionBoundaryRiskWarning",
    "ExecutionBoundaryPreflightChecklist",
    "ExecutionBoundaryAcknowledgmentRequirement",
    "ExecutionBoundaryTransitionPosture",
    "ExecutionBoundarySafeEvidenceRef",
  ]);

  assert.match(
    EXECUTION_BOUNDARY_NON_CAPABILITY_LINES.join(" "),
    /not execution/i
  );
  assert.equal(typeof validate_execution_boundary_projection, "function");
});

test("[runtime] execution-boundary contract validates a projection-safe neutral envelope", () => {
  const projection = createExecutionBoundaryProjection();
  const result = validate_execution_boundary_projection(projection);

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(is_execution_boundary_projection(projection), true);
});

test("[runtime] execution-boundary contract requires runtime_private_fields_omitted", () => {
  const result = validate_execution_boundary_projection({
    ...createExecutionBoundaryProjection(),
    runtime_private_fields_omitted: false,
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /runtime_private_fields_omitted must be true/);
});

test("[runtime] execution-boundary contract rejects forbidden raw runtime-private fields", () => {
  const result = validate_execution_boundary_projection({
    ...createExecutionBoundaryProjection(),
    nested: {
      raw_vsl: { forbidden: true },
    },
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /forbidden runtime-private field: raw_vsl/);
  assert.ok(FORBIDDEN_EXECUTION_BOUNDARY_RAW_KEYS.includes("raw_vsl"));
});

test("[runtime] execution-boundary contract rejects forbidden execution queue and authoritative transition fields", () => {
  const result = validate_execution_boundary_projection({
    ...createExecutionBoundaryProjection(),
    nested: {
      dispatch_result: "forbidden",
      queue_state: "forbidden",
      authoritative_transition_state: "forbidden",
    },
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /forbidden execution field: dispatch_result/);
  assert.match(result.errors.join(" "), /forbidden queue field: queue_state/);
  assert.match(
    result.errors.join(" "),
    /forbidden authoritative transition field: authoritative_transition_state/
  );
  assert.ok(FORBIDDEN_EXECUTION_BOUNDARY_EXECUTION_KEYS.includes("dispatch_result"));
});

test("[runtime] execution-boundary contract preserves projection-safe posture and rejects positive capability wording", () => {
  const validProjection = createExecutionBoundaryProjection();
  const validResult = validate_execution_boundary_projection(validProjection);
  const validSurface = JSON.stringify(validProjection);

  assert.equal(validResult.ok, true);
  assert.match(validSurface, /projection-safe/i);
  assert.match(validSurface, /non-executing/i);

  const invalidResult = validate_execution_boundary_projection({
    ...createExecutionBoundaryProjection(),
    risk_warning: {
      risk_warning: "provider/channel execution available after review.",
      non_executing_posture:
        "Execution boundary remains projection-safe and non-executing.",
    },
  });

  assert.equal(invalidResult.ok, false);
  assert.match(invalidResult.errors.join(" "), /forbidden capability wording/i);
});

test("[runtime] execution-boundary changed files stay free of product-specific naming", () => {
  const contents = [
    readFileSync(
      new URL("../../runtime/core/execution-boundary-types.ts", import.meta.url),
      "utf8"
    ),
    readFileSync(
      new URL("../../runtime/core/execution-boundary-contract.ts", import.meta.url),
      "utf8"
    ),
  ].join("\n");

  assert.doesNotMatch(contents, /SoloCrew/u);
  assert.doesNotMatch(contents, /founder/u);
  assert.doesNotMatch(contents, /Secretary/u);
  assert.doesNotMatch(contents, /portfolio/u);
  assert.doesNotMatch(contents, /packet revision/u);
});
