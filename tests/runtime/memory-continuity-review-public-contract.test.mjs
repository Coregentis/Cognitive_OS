import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const dtoPath = "runtime/public/memory-continuity-review-dto.ts";
const helperPath = "runtime/public/memory-continuity-review-bundle.ts";
const packageJsonPath = "package.json";
const dtoSource = readFileSync(dtoPath, "utf8");

const forbiddenPrivateImportPatterns = [
  /from "\.\.\/core\//u,
  /from "\.\.\/state\//u,
  /from "\.\.\/lifecycle\//u,
  /from "\.\.\/learning\//u,
  /from "\.\.\/execution\//u,
  /from "\.\.\/in-memory\//u,
  /\.\.\/\.\.\/runtime\/core\//u,
  /\.\.\/\.\.\/runtime\/state\//u,
  /\.\.\/\.\.\/runtime\/lifecycle\//u,
  /\.\.\/\.\.\/runtime\/learning\//u,
  /\.\.\/\.\.\/runtime\/execution\//u,
  /\.\.\/\.\.\/runtime\/in-memory\//u,
];

const forbiddenRawKeys = new Set([
  "raw_memory_payload",
  "raw_graph_payload",
  "raw_learning_payload",
  "raw_runtime_private_payload",
  "provider_response",
  "model_response",
  "tool_result_raw",
  "runtime_private_store",
  "runtime_private_service",
]);

const falseBoundaryFlags = [
  "implements_full_vsl_runtime",
  "implements_full_psg_runtime",
  "implements_full_ael_runtime",
  "implements_full_dialog_runtime",
  "implements_full_drift_engine",
  "implements_full_learning_engine",
  "authorizes_provider_execution",
  "authorizes_model_execution",
  "authorizes_worker_execution",
  "authorizes_tool_execution",
  "authorizes_external_action",
  "authorizes_automatic_mutation",
  "authorizes_automatic_acceptance",
  "authorizes_training",
  "authorizes_writeback",
  "authorizes_mplp_schema_change",
  "authorizes_mplp_protocol_law_change",
  "authorizes_mplp_normative_binding_change",
];

function term(codes) {
  return String.fromCharCode(...codes);
}

const forbiddenProductTerms = [
  [83, 111, 108, 111, 67, 114, 101, 119],
  [70, 111, 117, 110, 100, 101, 114],
  [83, 101, 99, 114, 101, 116, 97, 114, 121],
  [68, 101, 118, 101, 108, 111, 112, 109, 101, 110, 116, 32, 67, 111, 109, 112, 97, 110, 121],
  [77, 101, 100, 105, 97, 32, 79, 112, 101, 114, 97, 116, 105, 111, 110, 32, 67, 111, 109, 112, 97, 110, 121],
  [67, 69, 79, 32, 87, 111, 114, 107, 115, 112, 97, 99, 101],
  [76, 105, 110, 107, 101, 100, 73, 110],
  [98, 114, 97, 110, 100, 32, 111, 112, 101, 114, 97, 116, 105, 111, 110],
  [100, 111, 103, 102, 111, 111, 100],
  [80, 101, 114, 115, 111, 110, 97, 108, 32, 77, 86, 80],
].map(term);

function createBoundaryFlags() {
  return {
    projection_safe: true,
    summary_only: true,
    evidence_safe: true,
    non_executing: true,
    runtime_private_payload_omitted: true,
    runtime_private_fields_omitted: true,
    no_runtime_private_service_exposure: true,
    no_runtime_private_store_exposure: true,
    no_raw_memory_payload: true,
    no_raw_graph_payload: true,
    no_raw_learning_payload: true,
    implements_full_vsl_runtime: false,
    implements_full_psg_runtime: false,
    implements_full_ael_runtime: false,
    implements_full_dialog_runtime: false,
    implements_full_drift_engine: false,
    implements_full_learning_engine: false,
    authorizes_provider_execution: false,
    authorizes_model_execution: false,
    authorizes_worker_execution: false,
    authorizes_tool_execution: false,
    authorizes_external_action: false,
    authorizes_automatic_mutation: false,
    authorizes_automatic_acceptance: false,
    authorizes_training: false,
    authorizes_writeback: false,
    authorizes_mplp_schema_change: false,
    authorizes_mplp_protocol_law_change: false,
    authorizes_mplp_normative_binding_change: false,
    no_certification_or_endorsement: true,
  };
}

function createEvidenceRef(overrides = {}) {
  return {
    evidence_ref: "trace:evidence:memory-continuity-001",
    evidence_kind: "trace_summary",
    source_module: "Trace",
    source_ref: "trace:summary:001",
    summary: "Reference-only evidence summary for continuity review.",
    privacy_treatment: "summary_only",
    runtime_private_payload_omitted: true,
    ...overrides,
  };
}

function createOmission(overrides = {}) {
  return {
    marker: "runtime-private-vsl-state-omitted",
    reason: "Raw continuity state is runtime-private.",
    omitted_field: "runtime_private_vsl_state",
    omission_reason: "Raw continuity state is runtime-private.",
    runtime_private: true,
    safe_alternative_ref: "continuity:summary:001",
    ...overrides,
  };
}

function createSummary() {
  const evidence = createEvidenceRef();
  const omission = createOmission();

  return {
    summary_id: "memory-continuity-review:001",
    contract_version: "memory-continuity-review-contract-v0.1",
    runtime_contract_version: "memory-continuity-review-runtime-contract-v0.1",
    compatibility_profile: "projection-safe-memory-continuity-review-v0.1",
    objective_ref: "objective:001",
    context_ref: "context:001",
    operator_ref: "operator:001",
    generated_at: "2026-05-23T00:00:00.000Z",
    source_runtime_surface_ref: "runtime/public/memory-continuity-review-dto",
    source_commit_ref: "local-test",
    version_refs: {
      protocol_version_refs: [
        { ref_kind: "protocol", ref_id: "mplp", ref_version: "1.0.0" },
      ],
      binding_version_refs: [
        { ref_kind: "binding", ref_id: "cgos-public-memory-continuity-review", ref_version: "0.1" },
      ],
      runtime_version_refs: [
        { ref_kind: "runtime", ref_id: "cognitive-os", ref_version: "0.1.0" },
      ],
    },
    continuity_state: {
      current_state_summary: "Continuity summary is ready for manual review.",
      resume_ref: "resume:001",
      last_session_ref: "session:001",
      open_decision_refs: ["decision:001"],
      next_action_summary: "Review the direction change before continuing.",
      decision_state: "needs_review",
      safe_evidence_refs: [evidence],
      omissions: [omission],
      runtime_private_payload_omitted: true,
    },
    memory_layers: [
      {
        layer_id: "memory-layer:session:001",
        layer_kind: "session",
        summary: "Session-level continuity summary.",
        source_refs: ["session:001"],
        last_updated_at: "2026-05-23T00:00:00.000Z",
        confidence: "high",
        safe_evidence_refs: [evidence],
        omissions: [omission],
        runtime_private_payload_omitted: true,
      },
      {
        layer_id: "memory-layer:graph:001",
        layer_kind: "graph_summary",
        summary: "Graph-level summary is represented as a pointer only.",
        source_refs: ["graph-summary:001"],
        confidence: "medium",
        stale_or_missing_reason: "Raw graph state is private.",
        safe_evidence_refs: [createEvidenceRef({ source_module: "PublicProjection" })],
        omissions: [createOmission({ omitted_field: "runtime_private_psg_graph" })],
        runtime_private_payload_omitted: true,
      },
    ],
    direction_change: {
      direction_change_id: "direction-change:001",
      previous_objective_ref: "objective:001",
      proposed_objective_ref: "objective:002",
      change_summary: "Objective scope changed and requires manual confirmation.",
      impact_summary: "Review may affect the current continuity summary.",
      affected_memory_layer_refs: ["memory-layer:session:001", "memory-layer:graph:001"],
      source_classification: "objective_change",
      requires_operator_confirmation: true,
      decision_state: "needs_review",
      safe_evidence_refs: [createEvidenceRef({ source_module: "Confirm" })],
      omissions: [omission],
      runtime_private_payload_omitted: true,
    },
    safe_evidence_refs: [evidence],
    omissions: [omission],
    boundary_flags: createBoundaryFlags(),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}

function walk(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value) {
      walk(item, visit);
    }
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      visit(key, nested);
      walk(nested, visit);
    }
  }
}

test("[runtime] memory continuity public DTO source defines required neutral contract types", () => {
  for (const typeName of [
    "MemoryContinuityReviewSummary",
    "MemoryContinuityLayerSummary",
    "ContinuityReviewState",
    "DirectionChangeReviewSummary",
    "ContinuityDecisionState",
    "MemoryContinuityEvidenceRef",
    "MemoryContinuityOmission",
    "MemoryContinuityBoundaryFlags",
  ]) {
    assert.match(dtoSource, new RegExp(`export type ${typeName}\\b`, "u"));
  }
});

test("[runtime] memory layer summaries are representable as projection-safe summaries", () => {
  const summary = createSummary();

  assert.equal(summary.memory_layers.length, 2);
  assert.deepEqual(
    summary.memory_layers.map((layer) => layer.layer_kind),
    ["session", "graph_summary"]
  );

  for (const layer of summary.memory_layers) {
    assert.equal(layer.runtime_private_payload_omitted, true);
    assert.ok(layer.summary.length > 0);
    assert.ok(layer.source_refs.length > 0);
  }
});

test("[runtime] continuity review state represents resume next action and manual decision posture", () => {
  const summary = createSummary();

  assert.equal(summary.continuity_state.decision_state, "needs_review");
  assert.equal(summary.continuity_state.resume_ref, "resume:001");
  assert.deepEqual(summary.continuity_state.open_decision_refs, ["decision:001"]);
  assert.match(summary.continuity_state.next_action_summary, /Review/u);
});

test("[runtime] direction-change review summary stays review-only and confirmation-bound", () => {
  const summary = createSummary();

  assert.equal(summary.direction_change.requires_operator_confirmation, true);
  assert.equal(summary.direction_change.decision_state, "needs_review");
  assert.deepEqual(summary.direction_change.affected_memory_layer_refs, [
    "memory-layer:session:001",
    "memory-layer:graph:001",
  ]);
  assert.equal(summary.direction_change.runtime_private_payload_omitted, true);
});

test("[runtime] evidence refs and omissions remain summary/ref only", () => {
  const summary = createSummary();

  walk(summary, (key, value) => {
    assert.equal(forbiddenRawKeys.has(key), false, key);

    if (key === "runtime_private_payload_omitted") {
      assert.equal(value, true);
    }

    if (key === "runtime_private") {
      assert.equal(value, true);
    }
  });

  assert.equal(summary.safe_evidence_refs[0].privacy_treatment, "summary_only");
  assert.equal(summary.safe_evidence_refs[0].runtime_private_payload_omitted, true);
  assert.equal(summary.omissions[0].runtime_private, true);
});

test("[runtime] boundary flags deny full runtime engines and execution authority", () => {
  const summary = createSummary();

  for (const flag of falseBoundaryFlags) {
    assert.equal(summary.boundary_flags[flag], false, flag);
    assert.match(dtoSource, new RegExp(`${flag}: false`, "u"));
  }

  assert.equal(summary.boundary_flags.projection_safe, true);
  assert.equal(summary.boundary_flags.summary_only, true);
  assert.equal(summary.boundary_flags.non_executing, true);
});

test("[runtime] memory continuity DTO package export resolves as type-only module", async () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  assert.equal(
    packageJson.exports["./runtime/public/memory-continuity-review-dto"],
    "./runtime/public/memory-continuity-review-dto.ts"
  );

  const module = await import("cognitive_os/runtime/public/memory-continuity-review-dto");

  assert.deepEqual(Object.keys(module), []);
});

test("[runtime] memory continuity public contract avoids product terms and private imports", () => {
  for (const forbiddenTerm of forbiddenProductTerms) {
    assert.equal(dtoSource.includes(forbiddenTerm), false, forbiddenTerm);
  }

  for (const pattern of forbiddenPrivateImportPatterns) {
    assert.doesNotMatch(dtoSource, pattern, pattern.source);
  }
});

test("[runtime] memory continuity helper bundle is not introduced in this wave", () => {
  assert.equal(existsSync(helperPath), false);
});
