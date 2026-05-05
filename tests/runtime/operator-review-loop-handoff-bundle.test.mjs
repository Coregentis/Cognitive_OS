import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION,
  PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_COMPATIBILITY_PROFILE,
  PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_RUNTIME_CONTRACT_VERSION,
  createProjectionSafeOperatorReviewLoopBundle,
  summarizeProjectionSafeOperatorReviewLoopBundle,
  validateProjectionSafeOperatorReviewLoopBundle,
} from "../../runtime/public/operator-review-loop-handoff-bundle.ts";

const bundleSourcePath = "runtime/public/operator-review-loop-handoff-bundle.ts";
const testSourcePath = "tests/runtime/operator-review-loop-handoff-bundle.test.mjs";
const packageJsonPath = "package.json";

const bundleSource = readFileSync(bundleSourcePath, "utf8");
const testSource = readFileSync(testSourcePath, "utf8");

const approvedPackageExports = {
  "./runtime/public/operator-review-loop-dto":
    "./runtime/public/operator-review-loop-dto.ts",
  "./runtime/public/operator-review-loop-handoff-bundle":
    "./runtime/public/operator-review-loop-handoff-bundle.ts",
  "./runtime/public/runtime-readiness-status-dto":
    "./runtime/public/runtime-readiness-status-dto.ts",
  "./runtime/public/runtime-projection-summary-dto":
    "./runtime/public/runtime-projection-summary-dto.ts",
  "./runtime/public/runtime-execution-event-dto":
    "./runtime/public/runtime-execution-event-dto.ts",
  "./runtime/public/runtime-objective-continuity-dto":
    "./runtime/public/runtime-objective-continuity-dto.ts",
  "./runtime/public/state-port-summary-dto":
    "./runtime/public/state-port-summary-dto.ts",
  "./runtime/public/persistence-roundtrip-evidence-dto":
    "./runtime/public/persistence-roundtrip-evidence-dto.ts",
  "./runtime/public/memory-preference-summary-dto":
    "./runtime/public/memory-preference-summary-dto.ts",
  "./runtime/public/learning-correction-evidence-dto":
    "./runtime/public/learning-correction-evidence-dto.ts",
  "./runtime/public/runtime-action-request-summary-dto":
    "./runtime/public/runtime-action-request-summary-dto.ts",
  "./runtime/public/runtime-dispatch-boundary-evidence-dto":
    "./runtime/public/runtime-dispatch-boundary-evidence-dto.ts",
  "./runtime/public/runtime-session-summary-dto":
    "./runtime/public/runtime-session-summary-dto.ts",
  "./runtime/public/runtime-session-evidence-dto":
    "./runtime/public/runtime-session-evidence-dto.ts",
  "./runtime/public/worker-lifecycle-summary-dto":
    "./runtime/public/worker-lifecycle-summary-dto.ts",
  "./runtime/public/worker-lifecycle-evidence-dto":
    "./runtime/public/worker-lifecycle-evidence-dto.ts",
};

const meta = {
  contract_version: "operator-review-loop-dto-contract-v0.1",
  runtime_contract_version:
    PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_RUNTIME_CONTRACT_VERSION,
  compatibility_profile: PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_COMPATIBILITY_PROFILE,
};

const boundaryProfile = {
  ...meta,
  local_only: true,
  manual_first: true,
  review_only: true,
  deterministic: true,
  non_executing: true,
  runtime_private_payload_omitted: true,
  projection_safe: true,
  no_external_service: true,
  no_filesystem_write: true,
  no_database_storage: true,
  no_persistence_adapter: true,
  no_file_export_path: true,
  no_cloud_sync: true,
  no_provider_dispatch: true,
  no_channel_dispatch: true,
  no_marketplace: true,
  no_crm: true,
  no_email_dispatch: true,
  no_public_publishing: true,
  no_payment: true,
  no_llm_or_tool_invocation: true,
  no_autonomy: true,
  no_package_publish: true,
  no_certification_or_endorsement: true,
  boundary_profile_ref: "operator_review_loop_boundary_profile_fixture_01",
};

const safeEvidenceRefs = [
  {
    evidence_ref: "safe_evidence_ref_fixture_01",
    evidence_kind: "safe_reference",
    summary: "Bounded reference used by the public handoff bundle test.",
  },
];

const omissionMarkers = [
  {
    marker: "runtime_private_payload_omitted",
    reason: "Only bounded references and summaries are present.",
  },
];

const versionRefs = {
  protocol_version_refs: [
    {
      ref_kind: "protocol",
      ref_id: "MPLP",
      ref_version: "1.0.0",
    },
  ],
  binding_version_refs: [
    {
      ref_kind: "binding",
      ref_id: "neutral-binding-profile",
      ref_version: "0.1",
    },
  ],
  runtime_version_refs: [
    {
      ref_kind: "runtime",
      ref_id: "operator-review-loop",
      ref_version:
        PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_RUNTIME_CONTRACT_VERSION,
    },
  ],
  contract_version_refs: [
    {
      ref_kind: "contract",
      ref_id: "operator-review-loop-dto",
      ref_version: meta.contract_version,
    },
  ],
  bundle_version_refs: [
    {
      ref_kind: "bundle",
      ref_id: "operator-review-loop-handoff",
      ref_version: PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION,
    },
  ],
};

const operatorWorkspace = {
  ...meta,
  workspace_id: "operator_workspace_fixture_01",
  status: "active",
  session_refs: ["operator_session_fixture_01"],
  state_snapshot_ref: "state_snapshot_ref_fixture_01",
  evidence_refs: ["safe_evidence_ref_fixture_01"],
  boundary_profile: boundaryProfile,
  projection_envelope_ref: "projection_envelope_fixture_01",
  runtime_private_fields_omitted: true,
  non_executing: true,
};

const operatorSession = {
  ...meta,
  session_id: "operator_session_fixture_01",
  status: "review_ready",
  workspace_ref: "operator_workspace_fixture_01",
  review_loop_ref: "review_loop_state_fixture_01",
  evidence_refs: ["safe_evidence_ref_fixture_01"],
  boundary_profile: boundaryProfile,
  projection_envelope_ref: "projection_envelope_fixture_01",
  runtime_private_fields_omitted: true,
  non_executing: true,
};

const reviewLoopState = {
  ...meta,
  loop_state_id: "review_loop_state_fixture_01",
  status: "review_ready",
  workspace_ref: "operator_workspace_fixture_01",
  session_ref: "operator_session_fixture_01",
  reviewed_step_refs: ["review_step_fixture_01"],
  blocked_step_refs: [],
  evidence_refs: ["safe_evidence_ref_fixture_01"],
  boundary_profile: boundaryProfile,
  projection_envelope_ref: "projection_envelope_fixture_01",
  runtime_private_fields_omitted: true,
  non_executing: true,
};

const operatorReviewPacket = {
  ...meta,
  packet_id: "operator_review_packet_fixture_01",
  status: "review_ready",
  loop_state_ref: "review_loop_state_fixture_01",
  reviewed_step_refs: ["review_step_fixture_01"],
  blocked_step_refs: [],
  manual_decision_options: [
    "continue_review",
    "mark_blocked",
    "request_more_context",
  ],
  evidence_refs: ["safe_evidence_ref_fixture_01"],
  boundary_profile: boundaryProfile,
  projection_envelope_ref: "projection_envelope_fixture_01",
  runtime_private_fields_omitted: true,
  non_executing: true,
};

const sessionEvidenceLedger = {
  ...meta,
  ledger_id: "session_evidence_ledger_fixture_01",
  status: "active",
  session_ref: "operator_session_fixture_01",
  entry_refs: ["operator_entry_surface_fixture_01"],
  latest_packet_ref: "operator_review_packet_fixture_01",
  latest_bundle_ref: "deterministic_evidence_bundle_fixture_01",
  boundary_profile: boundaryProfile,
  projection_envelope_ref: "projection_envelope_fixture_01",
  runtime_private_fields_omitted: true,
  non_executing: true,
};

const deterministicEvidenceBundle = {
  ...meta,
  bundle_id: "deterministic_evidence_bundle_fixture_01",
  bundle_kind: "in_memory_evidence_bundle",
  status: "review_ready",
  ledger_ref: "session_evidence_ledger_fixture_01",
  packet_ref: "operator_review_packet_fixture_01",
  evidence_refs: ["safe_evidence_ref_fixture_01"],
  summary: "Deterministic in-memory summary for the public handoff bundle.",
  boundary_profile: boundaryProfile,
  projection_envelope_ref: "projection_envelope_fixture_01",
  projection_bundle_version: PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION,
  runtime_private_fields_omitted: true,
  non_executing: true,
};

const projectionSafeEnvelope = {
  ...meta,
  projection_envelope_id: "projection_envelope_fixture_01",
  projection_envelope_version: "0.1",
  source_runtime_object_refs: [
    "operator_workspace_fixture_01",
    "operator_session_fixture_01",
    "review_loop_state_fixture_01",
  ],
  object_export_binding_posture_refs: [],
  module_posture_summary: [],
  duty_posture_summary: [],
  safe_evidence_refs: safeEvidenceRefs,
  omission_markers: omissionMarkers,
  version_refs: versionRefs,
  boundary_notices: [
    "Projection-safe bundle is a bounded neutral summary only.",
  ],
  projection_bundle_version: PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION,
  schema_profile_ref: "projection_safe_schema_profile_fixture_01",
  boundary_profile_ref: "operator_review_loop_boundary_profile_fixture_01",
  runtime_private_fields_omitted: true,
  non_executing: true,
  created_at: "1970-01-01T00:00:00.000Z",
};

const localReviewLoopResult = {
  ...meta,
  result_id: "local_review_loop_result_fixture_01",
  workspace: operatorWorkspace,
  session: operatorSession,
  review_loop_state: reviewLoopState,
  review_packet: operatorReviewPacket,
  evidence_ledger: sessionEvidenceLedger,
  evidence_bundle: deterministicEvidenceBundle,
  projection_handoff: projectionSafeEnvelope,
  boundary_profile: boundaryProfile,
  projection_bundle_version: PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION,
  source_commit_ref: "cgos_test_source_commit_ref",
  runtime_private_fields_omitted: true,
  non_executing: true,
};

const validationSummary = {
  validation_summary_id: "operator_review_loop_bundle_validation_fixture_01",
  validation_status: "valid",
  validation_notes: ["Required metadata and boundary markers are present."],
  missing_required_refs: [],
  boundary_flags_verified: true,
  runtime_private_fields_omitted: true,
  non_executing: true,
};

const requiredBundleFields = [
  "bundle_id",
  "projection_bundle_version",
  "runtime_contract_version",
  "compatibility_profile",
  "generated_from_runtime_surface_ref",
  "source_commit_ref",
  "operator_workspace",
  "operator_session",
  "review_loop_state",
  "operator_review_packet",
  "session_evidence_ledger",
  "deterministic_evidence_bundle",
  "runtime_boundary_profile",
  "local_review_loop_result",
  "projection_safe_envelope",
  "omission_markers",
  "safe_evidence_refs",
  "version_refs",
  "validation_summary",
  "runtime_private_fields_omitted",
  "non_executing",
];

const forbiddenPositiveFields = [
  "raw_runtime_private_payload",
  "payment_processor",
  "checkout",
  "subscription",
  "automated_billing",
  "crm",
  "email_dispatch",
  "public_publishing",
  "testimonial_publish",
  "external_analytics",
  "llm_call",
  "model_call",
  "agent_dispatch",
  "tool_invocation",
  "saas_sharing",
  "customer_account",
  "automatic_conversion",
  "provider_dispatch",
  "channel_dispatch",
  "marketplace",
  "autonomous_execution",
  "package_publish",
  "npm_publish",
  "mplp_certification",
  "mplp_endorsement",
  "persistence_adapter",
  "database_ref",
  "file_export_path",
  "route_url",
  "file_system_write",
  "database_storage",
  "cloud_sync",
];

function textFromCodes(codes) {
  return String.fromCharCode(...codes);
}

const forbiddenNeutralityTerms = [
  [83, 111, 108, 111, 67, 114, 101, 119],
  [102, 111, 117, 110, 100, 101, 114],
  [69, 110, 103, 97, 103, 101, 109, 101, 110, 116],
  [101, 110, 103, 97, 103, 101, 109, 101, 110, 116],
  [112, 97, 105, 100, 32, 112, 105, 108, 111, 116],
  [99, 111, 109, 109, 101, 114, 99, 105, 97, 108, 32, 114, 101, 97, 100, 105, 110, 101, 115, 115],
  [111, 110, 101, 45, 112, 101, 114, 115, 111, 110, 32, 99, 111, 109, 112, 97, 110, 121],
  [99, 97, 115, 101, 45, 115, 116, 117, 100, 121, 32, 99, 111, 110, 118, 101, 114, 115, 105, 111, 110],
  [86, 51, 46, 48],
  [86, 50, 46, 53],
  [100, 101, 108, 105, 118, 101, 114, 97, 98, 108, 101, 32, 101, 110, 103, 97, 103, 101, 109, 101, 110, 116, 32, 108, 111, 111, 112],
].map(textFromCodes);

function createBundleInput(overrides = {}) {
  return {
    operator_workspace: operatorWorkspace,
    operator_session: operatorSession,
    review_loop_state: reviewLoopState,
    operator_review_packet: operatorReviewPacket,
    session_evidence_ledger: sessionEvidenceLedger,
    deterministic_evidence_bundle: deterministicEvidenceBundle,
    runtime_boundary_profile: boundaryProfile,
    local_review_loop_result: localReviewLoopResult,
    projection_safe_envelope: projectionSafeEnvelope,
    omission_markers: omissionMarkers,
    safe_evidence_refs: safeEvidenceRefs,
    version_refs: versionRefs,
    validation_summary: validationSummary,
    generated_from_runtime_surface_ref:
      "operator_review_loop_runtime_surface_fixture_01",
    source_commit_ref: "cgos_test_source_commit_ref",
    minimum_runtime_surface_ref:
      "operator_review_loop_minimum_runtime_surface_fixture_01",
    generation_ref: "operator_review_loop_generation_fixture_01",
    schema_profile_ref: "projection_safe_schema_profile_fixture_01",
    boundary_profile_ref: "operator_review_loop_boundary_profile_fixture_01",
    deprecation_policy_ref:
      "operator_review_loop_deprecation_policy_fixture_01",
    ...overrides,
  };
}

function walk(value, visit) {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, visit));
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    visit(key, nested);
    walk(nested, visit);
  }
}

test("[runtime] operator review loop handoff bundle builder exports exist", () => {
  assert.equal(
    PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION,
    "0.1"
  );
  assert.equal(
    PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_RUNTIME_CONTRACT_VERSION,
    "operator-review-loop-runtime-contract-v0.1"
  );
  assert.equal(
    PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_COMPATIBILITY_PROFILE,
    "projection-safe-operator-review-loop-handoff-v0.1"
  );
  assert.equal(typeof createProjectionSafeOperatorReviewLoopBundle, "function");
  assert.equal(typeof validateProjectionSafeOperatorReviewLoopBundle, "function");
  assert.equal(typeof summarizeProjectionSafeOperatorReviewLoopBundle, "function");
});

test("[runtime] operator review loop handoff bundle generation is deterministic", () => {
  const input = createBundleInput({
    bundle_id: "operator_review_loop_handoff_bundle_fixture_01",
  });

  assert.deepEqual(
    createProjectionSafeOperatorReviewLoopBundle(input),
    createProjectionSafeOperatorReviewLoopBundle(input)
  );
});

test("[runtime] operator review loop handoff bundle id is deterministic when omitted", () => {
  const first = createProjectionSafeOperatorReviewLoopBundle(createBundleInput());
  const second = createProjectionSafeOperatorReviewLoopBundle(createBundleInput());

  assert.equal(first.bundle_id, second.bundle_id);
  assert.match(first.bundle_id, /^operator_review_loop_handoff_bundle_[a-z0-9]+$/u);
});

test("[runtime] operator review loop handoff bundle contains required metadata", () => {
  const bundle = createProjectionSafeOperatorReviewLoopBundle(
    createBundleInput({
      bundle_id: "operator_review_loop_handoff_bundle_metadata_01",
    })
  );

  for (const field of requiredBundleFields) {
    assert.ok(Object.hasOwn(bundle, field), field);
  }

  assert.equal(
    bundle.projection_bundle_version,
    PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION
  );
  assert.equal(
    bundle.runtime_contract_version,
    PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_RUNTIME_CONTRACT_VERSION
  );
  assert.equal(
    bundle.compatibility_profile,
    PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_COMPATIBILITY_PROFILE
  );
  assert.equal(bundle.runtime_private_fields_omitted, true);
  assert.equal(bundle.non_executing, true);
});

test("[runtime] operator review loop handoff bundle validates and summarizes deterministically", () => {
  const bundle = createProjectionSafeOperatorReviewLoopBundle(
    createBundleInput({
      bundle_id: "operator_review_loop_handoff_bundle_summary_01",
    })
  );

  assert.deepEqual(
    validateProjectionSafeOperatorReviewLoopBundle(bundle),
    validationSummary
  );
  assert.deepEqual(
    summarizeProjectionSafeOperatorReviewLoopBundle(bundle),
    summarizeProjectionSafeOperatorReviewLoopBundle(bundle)
  );
  assert.deepEqual(summarizeProjectionSafeOperatorReviewLoopBundle(bundle), {
    bundle_id: "operator_review_loop_handoff_bundle_summary_01",
    projection_bundle_version:
      PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION,
    runtime_contract_version:
      PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_RUNTIME_CONTRACT_VERSION,
    compatibility_profile:
      PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_COMPATIBILITY_PROFILE,
    validation_status: "valid",
    omitted_private_payload: true,
    non_executing: true,
    evidence_ref_count: 1,
    omission_marker_count: 1,
  });
});

test("[runtime] operator review loop handoff bundle rejects malformed bundles", () => {
  const bundle = createProjectionSafeOperatorReviewLoopBundle(
    createBundleInput({
      bundle_id: "operator_review_loop_handoff_bundle_malformed_01",
    })
  );

  assert.throws(
    () =>
      validateProjectionSafeOperatorReviewLoopBundle({
        ...bundle,
        runtime_private_fields_omitted: false,
      }),
    /runtime_private_fields_omitted/u
  );

  assert.throws(
    () =>
      validateProjectionSafeOperatorReviewLoopBundle({
        ...bundle,
        runtime_boundary_profile: {
          ...bundle.runtime_boundary_profile,
          no_external_service: false,
        },
      }),
    /runtime_boundary_profile\.no_external_service/u
  );

  assert.throws(
    () =>
      validateProjectionSafeOperatorReviewLoopBundle({
        ...bundle,
        bundle_id: "",
      }),
    /bundle_id/u
  );
});

test("[runtime] operator review loop handoff bundle blocks forbidden positive keys", () => {
  const bundle = createProjectionSafeOperatorReviewLoopBundle(
    createBundleInput({
      bundle_id: "operator_review_loop_handoff_bundle_forbidden_key_01",
    })
  );

  for (const field of forbiddenPositiveFields) {
    assert.throws(
      () =>
        validateProjectionSafeOperatorReviewLoopBundle({
          ...bundle,
          [field]: "blocked",
        }),
      /forbidden positive key/u,
      field
    );
  }
});

test("[runtime] operator review loop handoff bundle exposes no positive fields", () => {
  const bundle = createProjectionSafeOperatorReviewLoopBundle(
    createBundleInput({
      bundle_id: "operator_review_loop_handoff_bundle_boundary_01",
    })
  );

  walk(bundle, (key) => {
    for (const field of forbiddenPositiveFields) {
      assert.notEqual(key, field, field);
    }
  });

  assert.equal(bundle.runtime_boundary_profile.no_provider_dispatch, true);
  assert.equal(bundle.runtime_boundary_profile.no_channel_dispatch, true);
  assert.equal(bundle.runtime_boundary_profile.no_payment, true);
  assert.equal(bundle.runtime_boundary_profile.no_crm, true);
  assert.equal(bundle.runtime_boundary_profile.no_email_dispatch, true);
  assert.equal(bundle.runtime_boundary_profile.no_autonomy, true);
});

test("[runtime] operator review loop handoff bundle builder avoids unstable sources", () => {
  const forbiddenRuntimePatterns = [
    /Date\.now/u,
    /new Date/u,
    /Math\.random/u,
    /randomUUID/u,
    /process\./u,
    /process\.env/u,
    /readFile/u,
    /writeFile/u,
    /appendFile/u,
    /createWriteStream/u,
  ];

  for (const pattern of forbiddenRuntimePatterns) {
    assert.doesNotMatch(bundleSource, pattern);
  }
});

test("[runtime] operator review loop handoff bundle changed files stay neutral", () => {
  for (const forbiddenTerm of forbiddenNeutralityTerms) {
    assert.equal(bundleSource.includes(forbiddenTerm), false, forbiddenTerm);
    assert.equal(testSource.includes(forbiddenTerm), false, forbiddenTerm);
  }
});

test("[runtime] operator review loop handoff bundle package boundary remains narrow", () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  assert.equal(packageJson.private, true);
  assert.deepEqual(packageJson.exports, approvedPackageExports);
  assert.deepEqual(
    Object.keys(packageJson.exports).sort(),
    Object.keys(approvedPackageExports).sort()
  );
  assert.equal(Object.hasOwn(packageJson, "main"), false);
  assert.equal(Object.hasOwn(packageJson, "types"), false);
  assert.equal(Object.hasOwn(packageJson, "files"), false);
  assert.equal(Object.hasOwn(packageJson, "bin"), false);
  assert.equal(Object.hasOwn(packageJson, "publishConfig"), false);
});
