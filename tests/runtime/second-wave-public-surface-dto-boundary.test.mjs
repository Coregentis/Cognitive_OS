import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const secondWaveDtoFiles = [
  {
    path: "runtime/public/state-port-summary-dto.ts",
    requiredTypeNames: [
      "StatePortSummaryDto",
      "StatePortModeDto",
      "StatePortPostureDto",
      "StatePortBoundaryProfile",
    ],
    requiredFields: [
      "state_port_summary_id",
      "port_mode",
      "supported_persistence_modes",
      "storage_posture_summary",
      "roundtrip_support_summary",
    ],
    requiredBoundaryFlags: [
      "projection_safe",
      "evidence_safe",
      "runtime_private_payload_omitted",
      "non_executing",
      "no_storage_write",
      "no_mutation_writeback",
      "no_package_publish",
      "no_certification_or_endorsement",
    ],
  },
  {
    path: "runtime/public/persistence-roundtrip-evidence-dto.ts",
    requiredTypeNames: [
      "PersistenceRoundtripEvidenceDto",
      "PersistenceRoundtripOutcomeDto",
      "PersistenceRoundtripPathDto",
      "PersistenceRoundtripBoundaryProfile",
    ],
    requiredFields: [
      "roundtrip_evidence_id",
      "roundtrip_outcome",
      "roundtrip_mode",
      "pre_state_ref",
      "post_state_ref",
    ],
    requiredBoundaryFlags: [
      "evidence_safe",
      "runtime_private_payload_omitted",
      "non_executing",
      "no_storage_write",
      "no_mutation_writeback",
      "no_package_publish",
      "no_certification_or_endorsement",
    ],
  },
  {
    path: "runtime/public/memory-preference-summary-dto.ts",
    requiredTypeNames: [
      "MemoryPreferenceSummaryDto",
      "MemorySummaryDto",
      "PreferenceSummaryDto",
      "MemoryPreferenceBoundaryProfile",
    ],
    requiredFields: [
      "memory_preference_summary_id",
      "memory_posture_summary",
      "preference_posture_summary",
      "supported_projection_scopes",
    ],
    requiredBoundaryFlags: [
      "projection_safe",
      "evidence_safe",
      "runtime_private_payload_omitted",
      "non_executing",
      "no_storage_write",
      "no_mutation_writeback",
      "no_training_authority",
      "no_package_publish",
      "no_certification_or_endorsement",
    ],
  },
  {
    path: "runtime/public/learning-correction-evidence-dto.ts",
    requiredTypeNames: [
      "LearningCorrectionEvidenceDto",
      "LearningCorrectionCaptureDto",
      "LearningCorrectionOutcomeDto",
      "LearningCorrectionBoundaryProfile",
    ],
    requiredFields: [
      "learning_correction_evidence_id",
      "capture_status",
      "capture_summary",
      "correction_summary",
    ],
    requiredBoundaryFlags: [
      "evidence_safe",
      "runtime_private_payload_omitted",
      "non_executing",
      "no_mutation_writeback",
      "no_training_authority",
      "no_package_publish",
      "no_certification_or_endorsement",
    ],
  },
  {
    path: "runtime/public/runtime-action-request-summary-dto.ts",
    requiredTypeNames: [
      "RuntimeActionRequestSummaryDto",
      "RuntimeActionIntentDto",
      "RuntimeActionRequestBoundaryProfile",
    ],
    requiredFields: [
      "action_request_summary_id",
      "requested_action_summary",
      "action_class",
      "request_posture",
      "blocked_or_deferred_reason",
    ],
    requiredBoundaryFlags: [
      "evidence_safe",
      "runtime_private_payload_omitted",
      "non_executing",
      "no_provider_dispatch",
      "no_channel_dispatch",
      "no_tool_invocation",
      "no_package_publish",
      "no_certification_or_endorsement",
    ],
  },
  {
    path: "runtime/public/runtime-dispatch-boundary-evidence-dto.ts",
    requiredTypeNames: [
      "RuntimeDispatchBoundaryEvidenceDto",
      "RuntimeDispatchPermissionSummaryDto",
      "RuntimeDispatchBoundaryProfile",
    ],
    requiredFields: [
      "dispatch_boundary_evidence_id",
      "dispatch_posture_summary",
      "blocked_dispatch_targets",
      "rejection_reason_summary",
    ],
    requiredBoundaryFlags: [
      "evidence_safe",
      "runtime_private_payload_omitted",
      "non_executing",
      "no_provider_dispatch",
      "no_channel_dispatch",
      "no_tool_invocation",
      "no_package_publish",
      "no_certification_or_endorsement",
    ],
  },
];

const commonMetadataFields = [
  "contract_version",
  "runtime_contract_version",
  "compatibility_profile",
  "source_runtime_surface_ref",
  "source_commit_ref",
  "safe_evidence_refs",
  "version_refs",
  "omission_markers",
  "runtime_private_fields_omitted",
  "boundary_flags",
];

const internalRuntimeImportFragments = [
  "runtime/core",
  "runtime/lifecycle",
  "runtime/state",
  "runtime/learning",
  "runtime/execution",
];

const forbiddenDirectFields = [
  "SQLiteStateStore",
  "sqlite_handle",
  "database_connection",
  "file_system_write",
  "state_store_instance",
  "dispatch_service",
  "handler_service",
  "provider_dispatch",
  "channel_dispatch",
  "tool_invocation",
  "mutation_writeback",
  "training_authority",
  "raw_memory_payload",
  "raw_preference_payload",
  "raw_learning_payload",
  "raw_runtime_private_payload",
];

const allowedNoBoundaryFlags = [
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_tool_invocation",
  "no_storage_write",
  "no_mutation_writeback",
  "no_training_authority",
  "no_certification_or_endorsement",
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

const approvedExports = {
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
  "./runtime/public/runtime-session-behavior-boundary-snapshot-dto":
    "./runtime/public/runtime-session-behavior-boundary-snapshot-dto.ts",
  "./runtime/public/state-roundtrip-behavior-result-snapshot-dto":
    "./runtime/public/state-roundtrip-behavior-result-snapshot-dto.ts",
  "./runtime/public/learning-correction-behavior-result-snapshot-dto":
    "./runtime/public/learning-correction-behavior-result-snapshot-dto.ts",
};

const secondWaveExportFragments = [
  "state-port-summary-dto",
  "persistence-roundtrip-evidence-dto",
  "memory-preference-summary-dto",
  "learning-correction-evidence-dto",
  "runtime-action-request-summary-dto",
  "runtime-dispatch-boundary-evidence-dto",
];

function readSource(filePath) {
  return readFileSync(filePath, "utf8");
}

function sourceWithoutAllowedNoFlags(source) {
  let strippedSource = source;

  for (const allowedFlag of allowedNoBoundaryFlags) {
    strippedSource = strippedSource.replaceAll(allowedFlag, "");
  }

  return strippedSource;
}

test("[runtime] second-wave public DTO files exist", () => {
  for (const dtoFile of secondWaveDtoFiles) {
    assert.equal(existsSync(dtoFile.path), true, `${dtoFile.path} should exist`);
  }
});

test("[runtime] second-wave public DTO files are type-only", () => {
  for (const dtoFile of secondWaveDtoFiles) {
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

test("[runtime] second-wave public DTO files avoid internal runtime imports", () => {
  for (const dtoFile of secondWaveDtoFiles) {
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

test("[runtime] second-wave public DTO files carry required fields", () => {
  for (const dtoFile of secondWaveDtoFiles) {
    const source = readSource(dtoFile.path);

    for (const field of [...commonMetadataFields, ...dtoFile.requiredFields]) {
      assert.match(source, new RegExp(`\\b${field}\\b`, "u"), `${dtoFile.path}.${field}`);
    }
  }
});

test("[runtime] second-wave public DTO files carry required boundary flags", () => {
  for (const dtoFile of secondWaveDtoFiles) {
    const source = readSource(dtoFile.path);

    for (const field of dtoFile.requiredBoundaryFlags) {
      assert.match(source, new RegExp(`\\b${field}\\b`, "u"), `${dtoFile.path}.${field}`);
    }
  }
});

test("[runtime] second-wave public DTO files avoid forbidden direct fields", () => {
  for (const dtoFile of secondWaveDtoFiles) {
    const source = sourceWithoutAllowedNoFlags(readSource(dtoFile.path));

    for (const field of forbiddenDirectFields) {
      assert.equal(
        source.includes(field),
        false,
        `${dtoFile.path} must not contain positive ${field}`
      );
    }
  }
});

test("[runtime] second-wave public DTO files stay product-neutral", () => {
  for (const dtoFile of secondWaveDtoFiles) {
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

test("[runtime] package exports include approved second-wave DTOs exactly", () => {
  const packageJson = JSON.parse(readSource("package.json"));

  assert.deepEqual(packageJson.exports, approvedExports);
  assert.deepEqual(
    Object.keys(packageJson.exports).sort(),
    Object.keys(approvedExports).sort()
  );
  assert.equal(Object.keys(packageJson.exports).length, 19);

  for (const secondWaveFragment of secondWaveExportFragments) {
    const exportKey = `./runtime/public/${secondWaveFragment}`;
    const exportTarget = `./runtime/public/${secondWaveFragment}.ts`;

    assert.equal(packageJson.exports[exportKey], exportTarget);
  }
});

test("[runtime] second-wave helper bundle remains absent", () => {
  assert.equal(
    existsSync("runtime/public/second-wave-public-surface-helper-bundle.ts"),
    false
  );
});

test("[runtime] second-wave implementation adds no schema registry or binding surfaces", () => {
  for (const secondWaveFragment of secondWaveExportFragments) {
    assert.equal(existsSync(`schemas/${secondWaveFragment}.json`), false);
    assert.equal(existsSync(`registry/${secondWaveFragment}.json`), false);
    assert.equal(existsSync(`bindings/${secondWaveFragment}.ts`), false);
  }
});
