import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import test from "node:test";

const dtoFiles = [
  {
    path: "runtime/public/runtime-readiness-status-dto.ts",
    requiredTypeNames: [
      "RuntimeReadinessStatusDto",
      "RuntimeActionStatusDto",
      "RuntimeReadinessBoundaryProfile",
      "RuntimeReadinessStatusValueDto",
      "RuntimeActionClassDto",
      "RuntimeArtifactClassDto",
      "RuntimeLearningStatusDto",
      "RuntimeContinuationPostureDto",
    ],
    requiredFields: [
      "readiness_status_id",
      "action_class",
      "readiness_status",
      "artifact_class",
      "learning_status",
      "continuation_posture",
      "interpretation",
    ],
  },
  {
    path: "runtime/public/runtime-projection-summary-dto.ts",
    requiredTypeNames: [
      "RuntimeProjectionSummaryDto",
      "RuntimeOperationalUnitSummaryDto",
      "RuntimeStatePostureSummaryDto",
      "RuntimeProjectionBoundaryProfile",
      "RuntimeProjectionSummaryRefDto",
      "RuntimeProjectionSourceRefDto",
      "RuntimeProjectionOmissionMarkerDto",
    ],
    requiredFields: [
      "projection_summary_id",
      "project_scope_ref",
      "operational_unit_summaries",
      "state_posture_summary",
      "readiness_summary_refs",
      "artifact_summary_refs",
      "learning_summary_refs",
      "continuity_summary_refs",
      "safe_evidence_refs",
    ],
  },
  {
    path: "runtime/public/runtime-execution-event-dto.ts",
    requiredTypeNames: [
      "BoundedExecutionEventDto",
      "BoundedExecutionRequestEnvelopeDto",
      "BoundedExecutionOutcomeDto",
      "BoundedExecutionBoundaryProfile",
      "BoundedExecutionEventStatusDto",
      "BoundedExecutionOutcomeStatusDto",
      "BoundedExecutionBlockReasonDto",
    ],
    requiredFields: [
      "execution_event_id",
      "request_envelope_id",
      "dispatch_outcome_id",
      "event_contract_id",
      "event_status",
      "requested_action_summary",
      "outcome_summary",
      "blocked_or_deferred_reason",
      "safe_evidence_refs",
      "non_executing",
      "no_provider_dispatch",
      "no_channel_dispatch",
      "no_tool_invocation",
    ],
  },
  {
    path: "runtime/public/runtime-objective-continuity-dto.ts",
    requiredTypeNames: [
      "ObjectiveContinuityDto",
      "ObjectiveComparisonSummaryDto",
      "ObjectiveContinuityBoundaryProfile",
      "ObjectiveComparisonStatusDto",
      "ObjectiveContinuityRecommendationPostureDto",
    ],
    requiredFields: [
      "objective_continuity_id",
      "objective_ref",
      "comparison_status",
      "previous_objective_summary_ref",
      "current_objective_summary_ref",
      "continuity_recommendation_posture",
      "continuity_rationale_summary",
      "safe_evidence_refs",
    ],
  },
];

const commonMetadataFields = [
  "contract_version",
  "runtime_contract_version",
  "compatibility_profile",
  "source_runtime_surface_ref",
  "source_commit_ref",
  "version_refs",
  "omission_markers",
  "runtime_private_fields_omitted",
  "boundary_flags",
];

const commonBoundaryFlags = [
  "projection_safe",
  "runtime_private_payload_omitted",
  "no_package_publish",
  "no_certification_or_endorsement",
];

const internalRuntimeImportFragments = [
  "runtime/core",
  "runtime/lifecycle",
  "runtime/state",
  "runtime/learning",
  "runtime/execution",
];

const forbiddenDirectFields = [
  "raw_runtime_private_payload",
  "sqlite_handle",
  "database_connection",
  "file_system_write",
];

const forbiddenCanonicalNames = [
  "founder",
  "dashboard",
  "cell",
  "engagement",
  "customer",
  "route",
  "paid_pilot",
  "commercial_readiness",
];

const positiveAuthorityFields = [
  "provider_dispatch",
  "channel_dispatch",
  "tool_invocation",
];

const approvedExports = {
  "./runtime/public/operator-review-loop-dto":
    "./runtime/public/operator-review-loop-dto.ts",
  "./runtime/public/operator-review-loop-handoff-bundle":
    "./runtime/public/operator-review-loop-handoff-bundle.ts",
};

function readSource(filePath) {
  return readFileSync(filePath, "utf8");
}

function sourceWithoutAllowedNoFlags(source) {
  return source
    .replaceAll("no_provider_dispatch", "")
    .replaceAll("no_channel_dispatch", "")
    .replaceAll("no_tool_invocation", "");
}

test("[runtime] first-wave public DTO files exist", () => {
  for (const dtoFile of dtoFiles) {
    assert.equal(existsSync(dtoFile.path), true, `${dtoFile.path} should exist`);
  }
});

test("[runtime] first-wave public DTO files are type-only", () => {
  for (const dtoFile of dtoFiles) {
    const source = readSource(dtoFile.path);

    for (const typeName of dtoFile.requiredTypeNames) {
      assert.match(source, new RegExp(`export type ${typeName}\\b`, "u"));
    }

    assert.doesNotMatch(source, /export function\b/u, dtoFile.path);
    assert.doesNotMatch(source, /export class\b/u, dtoFile.path);
    assert.doesNotMatch(source, /\bclass\s/u, dtoFile.path);
    assert.doesNotMatch(source, /\bnew\s/u, dtoFile.path);
    assert.doesNotMatch(source, /Service\b/u, dtoFile.path);
    assert.doesNotMatch(source, /Constructor\b/u, dtoFile.path);
  }
});

test("[runtime] first-wave public DTO files avoid internal runtime imports", () => {
  for (const dtoFile of dtoFiles) {
    const source = readSource(dtoFile.path);

    for (const fragment of internalRuntimeImportFragments) {
      assert.equal(
        source.includes(fragment),
        false,
        `${dtoFile.path} must not import ${fragment}`
      );
    }
  }
});

test("[runtime] first-wave public DTO files carry required fields", () => {
  for (const dtoFile of dtoFiles) {
    const source = readSource(dtoFile.path);

    for (const field of [...commonMetadataFields, ...dtoFile.requiredFields]) {
      assert.match(source, new RegExp(`\\b${field}\\b`, "u"), `${dtoFile.path}.${field}`);
    }
  }
});

test("[runtime] first-wave public DTO files carry boundary flags", () => {
  for (const dtoFile of dtoFiles) {
    const source = readSource(dtoFile.path);

    for (const field of commonBoundaryFlags) {
      assert.match(source, new RegExp(`\\b${field}\\b`, "u"), `${dtoFile.path}.${field}`);
    }
  }

  const executionSource = readSource("runtime/public/runtime-execution-event-dto.ts");
  for (const field of [
    "non_executing",
    "no_provider_dispatch",
    "no_channel_dispatch",
    "no_tool_invocation",
  ]) {
    assert.match(executionSource, new RegExp(`\\b${field}\\b`, "u"), field);
  }
});

test("[runtime] first-wave public DTO files avoid forbidden direct fields", () => {
  for (const dtoFile of dtoFiles) {
    const source = sourceWithoutAllowedNoFlags(readSource(dtoFile.path));

    for (const field of [...forbiddenDirectFields, ...positiveAuthorityFields]) {
      assert.equal(
        source.includes(field),
        false,
        `${dtoFile.path} must not contain positive ${field}`
      );
    }
  }
});

test("[runtime] first-wave public DTO files stay product-neutral", () => {
  for (const dtoFile of dtoFiles) {
    const source = readSource(dtoFile.path);

    for (const canonicalName of forbiddenCanonicalNames) {
      assert.equal(
        source.includes(canonicalName),
        false,
        `${dtoFile.path} must not contain ${canonicalName}`
      );
    }
  }
});

test("[runtime] package export map remains unchanged", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

  assert.equal(packageJson.private, true);
  assert.deepEqual(packageJson.exports, approvedExports);

  const serializedExports = JSON.stringify(packageJson.exports);
  for (const dtoPathFragment of [
    "runtime-readiness-status-dto",
    "runtime-projection-summary-dto",
    "runtime-execution-event-dto",
    "runtime-objective-continuity-dto",
  ]) {
    assert.equal(serializedExports.includes(dtoPathFragment), false, dtoPathFragment);
  }
});

test("[runtime] first-wave helper bundle file is absent", () => {
  assert.equal(
    existsSync("runtime/public/runtime-projection-handoff-bundle.ts"),
    false
  );
});

test("[runtime] first-wave public DTO files resolve as empty runtime modules", async () => {
  for (const dtoFile of dtoFiles) {
    const module = await import(pathToFileURL(dtoFile.path).href);

    assert.deepEqual(Object.keys(module), [], dtoFile.path);
  }
});

test("[runtime] first-wave implementation does not add schema registry or binding surfaces", () => {
  for (const dtoFile of dtoFiles) {
    const source = readSource(dtoFile.path);

    assert.equal(source.includes("schemas/"), false, dtoFile.path);
    assert.equal(source.includes("registry/"), false, dtoFile.path);
    assert.equal(source.includes("bindings/"), false, dtoFile.path);
  }
});
