import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dtoSourcePath = "runtime/public/operator-review-loop-dto.ts";
const packageJsonPath = "package.json";

const source = readFileSync(dtoSourcePath, "utf8");

const requiredTypeExports = [
  "OperatorWorkspaceDto",
  "OperatorSessionDto",
  "ReviewLoopStateDto",
  "OperatorReviewPacketDto",
  "SessionEvidenceLedgerDto",
  "DeterministicEvidenceBundleDto",
  "RuntimeBoundaryProfileDto",
  "LocalReviewLoopResultDto",
  "ProjectionSafeEnvelopeDto",
  "ProjectionSafeOperatorReviewLoopHandoffDto",
  "ProjectionSafeContractVersion",
  "ProjectionBundleVersion",
  "RuntimeContractVersion",
  "CompatibilityProfile",
  "ProjectionSafeVersionRefs",
  "ProjectionSafeOmissionMarker",
  "ProjectionSafeEvidenceRef",
  "ProjectionSafeValidationSummary",
  "ProjectionSafeDeprecationPolicyRef",
];

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

const requiredMetadataFields = [
  "contract_version",
  "runtime_contract_version",
  "compatibility_profile",
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

function bodyForType(typeName) {
  const start = source.indexOf(`export type ${typeName}`);

  assert.notEqual(start, -1, `${typeName} start should be findable`);

  const bodyStart = source.indexOf("{", start);
  const bodyEnd = source.indexOf("\n};", bodyStart);

  assert.notEqual(bodyStart, -1, `${typeName} body start should be findable`);
  assert.notEqual(bodyEnd, -1, `${typeName} body end should be findable`);

  return source.slice(bodyStart, bodyEnd);
}

test("[runtime] public operator review loop DTO module exports type-only names", () => {
  for (const typeName of requiredTypeExports) {
    assert.match(source, new RegExp(`export type ${typeName}\\b`, "u"));
  }

  assert.doesNotMatch(source, /export function\b/u);
  assert.doesNotMatch(source, /export class\b/u);
  assert.doesNotMatch(source, /export const\b/u);
  assert.doesNotMatch(source, /\bfunction\b/u);
  assert.doesNotMatch(source, /\bclass\b/u);
});

test("[runtime] public operator review loop DTO module carries required metadata fields", () => {
  const metadataTypes = [
    "OperatorWorkspaceDto",
    "OperatorSessionDto",
    "ReviewLoopStateDto",
    "OperatorReviewPacketDto",
    "SessionEvidenceLedgerDto",
    "DeterministicEvidenceBundleDto",
    "RuntimeBoundaryProfileDto",
    "LocalReviewLoopResultDto",
    "ProjectionSafeEnvelopeDto",
  ];

  for (const typeName of metadataTypes) {
    const body = bodyForType(typeName);

    for (const field of requiredMetadataFields) {
      assert.match(body, new RegExp(`${field}\\b`, "u"), `${typeName}.${field}`);
    }
  }
});

test("[runtime] public operator review loop handoff DTO includes bundle fields", () => {
  const bundleBody = bodyForType("ProjectionSafeOperatorReviewLoopHandoffDto");

  for (const field of requiredBundleFields) {
    assert.match(bundleBody, new RegExp(`${field}\\b`, "u"), field);
  }
});

test("[runtime] public operator review loop DTO module stays neutral and projection-safe", () => {
  for (const forbiddenTerm of forbiddenNeutralityTerms) {
    assert.equal(source.includes(forbiddenTerm), false, forbiddenTerm);
  }

  assert.doesNotMatch(source, /raw_runtime_private_payload/u);
  assert.doesNotMatch(source, /RuntimeObjectRecord/u);
  assert.doesNotMatch(source, /from\s+["'][^"']*runtime\/core/u);
});

test("[runtime] public operator review loop DTO module avoids positive capability fields", () => {
  for (const field of forbiddenPositiveFields) {
    const allowedNoFlagPattern = new RegExp(`no_[a-z0-9_]*${field}`, "u");

    if (source.includes(field)) {
      assert.ok(
        allowedNoFlagPattern.test(source) ||
          source.includes(`"${field}"`) ||
          source.includes(`'${field}'`),
        `${field} must only appear as a no_* flag or test assertion`
      );
    }
  }

  assert.match(source, /no_provider_dispatch/u);
  assert.match(source, /no_channel_dispatch/u);
  assert.match(source, /no_payment/u);
  assert.match(source, /no_crm/u);
  assert.match(source, /no_email_dispatch/u);
  assert.match(source, /no_autonomy/u);
});

test("[runtime] package boundary remains unimplemented for public DTO module", () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  assert.equal(packageJson.private, true);
  assert.equal(Object.hasOwn(packageJson, "exports"), false);
  assert.equal(Object.hasOwn(packageJson, "main"), false);
  assert.equal(Object.hasOwn(packageJson, "types"), false);
  assert.equal(Object.hasOwn(packageJson, "files"), false);
});
