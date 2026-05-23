import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import test from "node:test";

const dtoFiles = [
  {
    path: "runtime/public/runtime-session-behavior-boundary-snapshot-dto.ts",
    fragment: "runtime-session-behavior-boundary-snapshot-dto",
    typeNames: [
      "RuntimeSessionBehaviorBoundarySnapshotDto",
      "RuntimeSessionBehaviorBoundaryProfile",
      "RuntimeSessionBehaviorBoundarySessionPostureDto",
      "RuntimeSessionBehaviorBoundaryConstructionPostureDto",
      "RuntimeSessionDependencyFamilyPostureDto",
      "RuntimeSessionStateModePostureDto",
    ],
    requiredFields: [
      "runtime_session_behavior_boundary_snapshot_id",
      "session_posture",
      "construction_boundary_posture",
      "dependency_family_posture",
      "state_mode_posture",
    ],
    boundaryFlags: [
      "projection_safe",
      "evidence_safe",
      "runtime_private_payload_omitted",
      "non_executing",
      "no_authority",
      "no_constructor_exposure",
      "no_service_instance_exposure",
      "no_mutable_state_exposure",
      "no_storage_write_authority",
      "no_mutation_writeback_authority",
      "no_provider_dispatch",
      "no_channel_dispatch",
      "no_tool_invocation",
    ],
  },
  {
    path: "runtime/public/state-roundtrip-behavior-result-snapshot-dto.ts",
    fragment: "state-roundtrip-behavior-result-snapshot-dto",
    typeNames: [
      "StateRoundtripBehaviorResultSnapshotDto",
      "StateRoundtripBehaviorResultBoundaryProfile",
      "StateRoundtripStateModePostureDto",
      "StateRoundtripResultPostureDto",
      "StateRoundtripPersistencePostureDto",
      "StateRoundtripReloadRehydrationPostureDto",
    ],
    requiredFields: [
      "state_roundtrip_behavior_result_snapshot_id",
      "state_mode_posture",
      "roundtrip_result_posture",
      "persistence_posture",
      "reload_rehydration_posture",
    ],
    boundaryFlags: [
      "projection_safe",
      "evidence_safe",
      "runtime_private_payload_omitted",
      "non_executing",
      "no_authority",
      "no_constructor_exposure",
      "no_service_instance_exposure",
      "no_mutable_state_exposure",
      "no_storage_write_authority",
      "no_sqlite_handle_exposure",
      "no_store_adapter_exposure",
      "no_transaction_authority",
      "no_mutation_writeback_authority",
    ],
  },
  {
    path: "runtime/public/learning-correction-behavior-result-snapshot-dto.ts",
    fragment: "learning-correction-behavior-result-snapshot-dto",
    typeNames: [
      "LearningCorrectionBehaviorResultSnapshotDto",
      "LearningCorrectionBehaviorResultBoundaryProfile",
      "LearningCorrectionCapturePostureDto",
      "LearningCorrectionPreferenceEffectPostureDto",
      "LearningCorrectionObjectiveComparisonRefDto",
      "LearningCorrectionResultPostureDto",
    ],
    requiredFields: [
      "learning_correction_behavior_result_snapshot_id",
      "correction_capture_posture",
      "preference_effect_posture",
      "objective_comparison_refs",
      "learning_correction_result_posture",
    ],
    boundaryFlags: [
      "projection_safe",
      "evidence_safe",
      "runtime_private_payload_omitted",
      "non_executing",
      "no_authority",
      "no_constructor_exposure",
      "no_service_instance_exposure",
      "no_mutable_state_exposure",
      "no_training_authority",
      "no_mutation_writeback_authority",
      "no_preference_service_handle_exposure",
      "no_learning_service_exposure",
      "no_storage_write_authority",
    ],
  },
];

const existingSixteenExports = [
  "./runtime/public/operator-review-loop-dto",
  "./runtime/public/operator-review-loop-handoff-bundle",
  "./runtime/public/runtime-readiness-status-dto",
  "./runtime/public/runtime-projection-summary-dto",
  "./runtime/public/runtime-execution-event-dto",
  "./runtime/public/runtime-objective-continuity-dto",
  "./runtime/public/state-port-summary-dto",
  "./runtime/public/persistence-roundtrip-evidence-dto",
  "./runtime/public/memory-preference-summary-dto",
  "./runtime/public/learning-correction-evidence-dto",
  "./runtime/public/runtime-action-request-summary-dto",
  "./runtime/public/runtime-dispatch-boundary-evidence-dto",
  "./runtime/public/runtime-session-summary-dto",
  "./runtime/public/runtime-session-evidence-dto",
  "./runtime/public/worker-lifecycle-summary-dto",
  "./runtime/public/worker-lifecycle-evidence-dto",
];

const commonFields = [
  "contract_version",
  "runtime_contract_version",
  "compatibility_profile",
  "source_runtime_surface_ref",
  "source_commit_ref",
  "safe_evidence_refs",
  "omission_markers",
  "boundary_flags",
  "version_refs",
  "future_parity_hints",
  "runtime_private_fields_omitted",
];

const forbiddenImportFragments = [
  "runtime/private",
  "runtime/core",
  "runtime/state",
  "runtime/lifecycle",
  "runtime/learning",
  "runtime/execution",
  "schemas/",
  "registry/",
  "bindings/",
];

const forbiddenExecutablePatterns = [
  /export function\b/u,
  /export class\b/u,
  /export const\b/u,
  /\bfunction\s/u,
  /\bclass\s/u,
  /\bnew\s/u,
  /constructor\s*\(/u,
  /=>/u,
];

const allowedNoAuthorityFlags = [
  "no_authority",
  "no_constructor_exposure",
  "no_service_instance_exposure",
  "no_mutable_state_exposure",
  "no_lifecycle_method_exposure",
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_tool_invocation",
  "no_storage_write_authority",
  "no_sqlite_handle_exposure",
  "no_store_adapter_exposure",
  "no_transaction_authority",
  "no_mutation_writeback_authority",
  "no_training_authority",
  "no_preference_service_handle_exposure",
  "no_learning_service_exposure",
];

const forbiddenAuthorityTerms = [
  "constructor",
  "factory",
  "orchestrator",
  "service_instance",
  "store_adapter",
  "sqlite_handle",
  "live_handle",
  "mutable_record",
  "lifecycle_method",
  "provider_dispatch",
  "channel_dispatch",
  "tool_invocation",
  "storage_write",
  "mutation_writeback",
  "training_authority",
  "preference_service_handle",
  "learning_service",
  "correction_service",
];

const forbiddenProductTerms = [
  "SoloCrew",
  "founder",
  "secretary",
  "OPC",
  "company dashboard",
  "mission room",
  "work packet",
  "dashboard",
  "cell",
  "engagement",
  "customer",
  "route",
  "paid_pilot",
  "commercial_readiness",
];

const forbiddenProtocolClaimTerms = [
  "conformance",
  "certification",
  "endorsement",
  "official implementation",
  "canonical implementation",
  "canonical MPLP implementation",
];

const forbiddenExportPathFragments = [
  "runtime/core",
  "runtime/state",
  "runtime/lifecycle",
  "runtime/learning",
  "runtime/execution",
  "schemas",
  "registry",
  "bindings",
  "fixtures",
  "tests",
];

function readSource(filePath) {
  return readFileSync(filePath, "utf8");
}

function sourceWithoutAllowedNoFlags(source) {
  let stripped = source.replaceAll(/^\/\/.*$/gmu, "");

  for (const allowedFlag of allowedNoAuthorityFlags) {
    stripped = stripped.replaceAll(allowedFlag, "");
  }

  return stripped;
}

function readPackageJson() {
  return JSON.parse(readSource("package.json"));
}

test("[runtime] upstream public-surface DTO source files exist", () => {
  for (const dtoFile of dtoFiles) {
    assert.equal(existsSync(dtoFile.path), true, `${dtoFile.path} should exist`);
  }
});

test("[runtime] upstream public-surface DTO source files are type-only", () => {
  for (const dtoFile of dtoFiles) {
    const source = readSource(dtoFile.path);

    for (const typeName of dtoFile.typeNames) {
      assert.match(source, new RegExp(`export type ${typeName}\\b`, "u"));
    }

    for (const pattern of forbiddenExecutablePatterns) {
      assert.doesNotMatch(source, pattern, dtoFile.path);
    }

    assert.equal(source.includes("export interface"), false, dtoFile.path);
  }
});

test("[runtime] upstream public-surface DTO source files avoid forbidden imports", () => {
  for (const dtoFile of dtoFiles) {
    const source = readSource(dtoFile.path);

    assert.doesNotMatch(source, /^\s*import\b/mu, dtoFile.path);

    for (const fragment of forbiddenImportFragments) {
      assert.equal(
        source.includes(fragment),
        false,
        `${dtoFile.path} must not include ${fragment}`
      );
    }
  }
});

test("[runtime] upstream public-surface DTO source files carry required fields and flags", () => {
  for (const dtoFile of dtoFiles) {
    const source = readSource(dtoFile.path);

    for (const field of [...commonFields, ...dtoFile.requiredFields]) {
      assert.match(source, new RegExp(`\\b${field}\\b`, "u"), `${dtoFile.path}.${field}`);
    }

    for (const flag of dtoFile.boundaryFlags) {
      assert.match(source, new RegExp(`\\b${flag}: true\\b`, "u"), `${dtoFile.path}.${flag}`);
    }
  }
});

test("[runtime] upstream public-surface DTO source files avoid positive authority fields", () => {
  for (const dtoFile of dtoFiles) {
    const strippedSource = sourceWithoutAllowedNoFlags(readSource(dtoFile.path));

    for (const term of forbiddenAuthorityTerms) {
      assert.equal(
        strippedSource.includes(term),
        false,
        `${dtoFile.path} must not contain positive ${term}`
      );
    }
  }
});

test("[runtime] upstream public-surface DTO source files stay product-neutral and non-protocol", () => {
  for (const dtoFile of dtoFiles) {
    const source = readSource(dtoFile.path);

    for (const term of [...forbiddenProductTerms, ...forbiddenProtocolClaimTerms]) {
      assert.equal(
        source.includes(term),
        false,
        `${dtoFile.path} must not include ${term}`
      );
    }
  }
});

test("[runtime] upstream public-surface package exports omit legacy runtime-private cell names", () => {
  const packageJson = readPackageJson();
  const publicSurfaceText = [
    JSON.stringify(packageJson.exports, null, 2),
    ...Object.values(packageJson.exports).map((exportTarget) =>
      readSource(exportTarget)
    ),
  ].join("\n");

  const forbiddenLegacyRuntimePrivateTerms = [
    "cell-runtime-scope",
    "cell-summary-runtime-record",
    "cell_runtime_scope",
    "cell_summary_runtime_record",
    "CellRuntimeScopeRecord",
    "CellSummaryRuntimeRecord",
  ];

  for (const forbiddenTerm of forbiddenLegacyRuntimePrivateTerms) {
    assert.equal(
      publicSurfaceText.includes(forbiddenTerm),
      false,
      `${forbiddenTerm} must remain absent from runtime/public exports`
    );
  }
});

test("[runtime] upstream public-surface package exports preserve prior surfaces and add operator work-packet surfaces", () => {
  const packageJson = readPackageJson();

  assert.equal(packageJson.private, true);
  assert.equal(Object.keys(packageJson.exports).length, 24);

  for (const exportKey of existingSixteenExports) {
    assert.equal(
      packageJson.exports[exportKey],
      `${exportKey}.ts`,
      `${exportKey} should preserve existing target`
    );
  }

  for (const dtoFile of dtoFiles) {
    const exportKey = `./runtime/public/${dtoFile.fragment}`;
    const exportTarget = `./runtime/public/${dtoFile.fragment}.ts`;

    assert.equal(packageJson.exports[exportKey], exportTarget);
    assert.equal(existsSync(exportTarget), true, `${exportTarget} should exist`);
  }
});

test("[runtime] upstream public-surface package exports avoid private paths and publication metadata", () => {
  const packageJson = readPackageJson();
  const exportEntries = Object.entries(packageJson.exports).flat();

  for (const exportEntry of exportEntries) {
    for (const forbiddenFragment of forbiddenExportPathFragments) {
      assert.equal(
        exportEntry.includes(forbiddenFragment),
        false,
        `${exportEntry} must not include ${forbiddenFragment}`
      );
    }
  }

  assert.equal(Object.hasOwn(packageJson, "main"), false);
  assert.equal(Object.hasOwn(packageJson, "types"), false);
  assert.equal(Object.hasOwn(packageJson, "files"), false);
  assert.equal(Object.hasOwn(packageJson, "bin"), false);
  assert.equal(Object.hasOwn(packageJson, "publishConfig"), false);
});

test("[runtime] upstream public-surface package subpaths resolve as empty modules", async () => {
  for (const dtoFile of dtoFiles) {
    const packageModule = await import(`cognitive_os/runtime/public/${dtoFile.fragment}`);
    const fileModule = await import(pathToFileURL(dtoFile.path).href);

    assert.deepEqual(Object.keys(packageModule), [], dtoFile.fragment);
    assert.deepEqual(Object.keys(fileModule), [], dtoFile.path);
  }
});

test("[runtime] upstream public-surface DTO implementation adds no helper schema registry or binding", () => {
  for (const dtoFile of dtoFiles) {
    assert.equal(existsSync(`runtime/public/${dtoFile.fragment}-helper-bundle.ts`), false);
    assert.equal(existsSync(`schemas/${dtoFile.fragment}.json`), false);
    assert.equal(existsSync(`registry/${dtoFile.fragment}.json`), false);
    assert.equal(existsSync(`bindings/${dtoFile.fragment}.ts`), false);
  }
});
