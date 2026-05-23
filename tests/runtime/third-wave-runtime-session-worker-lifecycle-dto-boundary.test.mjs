import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const thirdWaveDtoFiles = [
  {
    path: "runtime/public/runtime-session-summary-dto.ts",
    fragment: "runtime-session-summary-dto",
    requiredTypeNames: [
      "RuntimeSessionSummaryDto",
      "RuntimeSessionPostureDto",
      "RuntimeSessionCapabilitySummaryDto",
      "RuntimeSessionBoundaryProfile",
    ],
    requiredFields: [
      "runtime_session_summary_id",
      "session_posture",
      "configured_capability_summaries",
      "step_family_coverage_summary",
    ],
  },
  {
    path: "runtime/public/runtime-session-evidence-dto.ts",
    fragment: "runtime-session-evidence-dto",
    requiredTypeNames: [
      "RuntimeSessionEvidenceDto",
      "RuntimeSessionCreationPostureDto",
      "RuntimeSessionDependencyFamilyPostureDto",
      "RuntimeSessionEvidenceBoundaryProfile",
    ],
    requiredFields: [
      "runtime_session_evidence_id",
      "creation_posture",
      "dependency_family_posture",
      "blocked_or_deferred_reason",
    ],
  },
  {
    path: "runtime/public/worker-lifecycle-summary-dto.ts",
    fragment: "worker-lifecycle-summary-dto",
    requiredTypeNames: [
      "WorkerLifecycleSummaryDto",
      "WorkerLifecyclePostureDto",
      "WorkerLifecycleStateFamilyDto",
      "WorkerLifecycleBoundaryProfile",
    ],
    requiredFields: [
      "worker_lifecycle_summary_id",
      "lifecycle_posture",
      "supported_state_families",
      "transition_posture_summary",
      "worker_scope_summary",
    ],
  },
  {
    path: "runtime/public/worker-lifecycle-evidence-dto.ts",
    fragment: "worker-lifecycle-evidence-dto",
    requiredTypeNames: [
      "WorkerLifecycleEvidenceDto",
      "WorkerLifecycleTransitionEvidencePostureDto",
      "WorkerLifecycleObservationOutcomeDto",
      "WorkerLifecycleEvidenceBoundaryProfile",
    ],
    requiredFields: [
      "worker_lifecycle_evidence_id",
      "transition_evidence_posture",
      "observed_state_ref",
      "target_state_ref",
      "outcome_summary",
    ],
  },
];

const commonMetadataFields = [
  "contract_version",
  "runtime_contract_version",
  "compatibility_profile",
  "source_runtime_surface_ref",
  "source_commit_ref",
  "first_wave_refs",
  "second_wave_refs",
  "safe_evidence_refs",
  "version_refs",
  "omission_markers",
  "runtime_private_fields_omitted",
  "boundary_flags",
];

const requiredBoundaryFlags = [
  "projection_safe",
  "evidence_safe",
  "runtime_private_payload_omitted",
  "non_executing",
  "no_constructor_exposure",
  "no_service_instance_exposure",
  "no_mutable_state_exposure",
  "no_lifecycle_transition_authority",
  "no_storage_write",
  "no_mutation_writeback",
  "no_training_authority",
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_tool_invocation",
  "no_package_publish",
  "no_certification_or_endorsement",
];

const allowedNoBoundaryFlags = [
  "no_constructor_exposure",
  "no_service_instance_exposure",
  "no_mutable_state_exposure",
  "no_lifecycle_transition_authority",
  "no_storage_write",
  "no_mutation_writeback",
  "no_training_authority",
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_tool_invocation",
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
  "constructor_args",
  "service_instances",
  "session_facade",
  "RuntimeObjectStore",
  "ActionDispatcher",
  "MinimalRuntimeOrchestratorSkeleton",
  "VSL_live_handle",
  "PSG_live_handle",
  "runtime_object_creation",
  "WorkerLifecycleRuntime",
  "WorkerStore",
  "AgentWorkerRecord",
  "lifecycle_transition_method",
  "transition_function",
  "mutable_worker_record",
  "revision_mutation_details",
  "initialized_services",
  "mutable_session_objects",
  "raw_runtime_records",
  "invocation_authority",
  "state_machine_execution",
  "provider_dispatch",
  "channel_dispatch",
  "tool_invocation",
  "storage_write",
  "mutation_writeback",
  "training_authority",
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
  "./runtime/public/memory-continuity-review-dto":
    "./runtime/public/memory-continuity-review-dto.ts",
  "./runtime/public/personal-mvp-runtime-backbone-dto":
    "./runtime/public/personal-mvp-runtime-backbone-dto.ts",
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
  "./runtime/public/operator-work-packet-handoff-dto":
    "./runtime/public/operator-work-packet-handoff-dto.ts",
  "./runtime/public/operator-work-packet-handoff-bundle":
    "./runtime/public/operator-work-packet-handoff-bundle.ts",
};

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

test("[runtime] third-wave DTO files exist", () => {
  for (const dtoFile of thirdWaveDtoFiles) {
    assert.equal(existsSync(dtoFile.path), true, `${dtoFile.path} should exist`);
  }
});

test("[runtime] third-wave DTO files are type-only", () => {
  for (const dtoFile of thirdWaveDtoFiles) {
    const source = readSource(dtoFile.path);

    for (const typeName of dtoFile.requiredTypeNames) {
      assert.match(source, new RegExp(`export type ${typeName}\\b`, "u"));
    }

    assert.doesNotMatch(source, /export function\b/u, dtoFile.path);
    assert.doesNotMatch(source, /export class\b/u, dtoFile.path);
    assert.doesNotMatch(source, /\bclass\s/u, dtoFile.path);
    assert.doesNotMatch(source, /\bnew\s/u, dtoFile.path);
    assert.doesNotMatch(source, /constructor\s*\(/u, dtoFile.path);
    assert.doesNotMatch(source, /export\s+.*Service\b/u, dtoFile.path);
  }
});

test("[runtime] third-wave DTO files avoid internal runtime imports", () => {
  for (const dtoFile of thirdWaveDtoFiles) {
    const source = readSource(dtoFile.path);

    assert.doesNotMatch(source, /^\s*import\b/mu, dtoFile.path);

    for (const fragment of internalRuntimeImportFragments) {
      assert.equal(
        source.includes(fragment),
        false,
        `${dtoFile.path} must not import ${fragment}`
      );
    }
  }
});

test("[runtime] third-wave DTO files carry required fields", () => {
  for (const dtoFile of thirdWaveDtoFiles) {
    const source = readSource(dtoFile.path);

    for (const field of [...commonMetadataFields, ...dtoFile.requiredFields]) {
      assert.match(
        source,
        new RegExp(`\\b${field}\\b`, "u"),
        `${dtoFile.path}.${field}`
      );
    }
  }
});

test("[runtime] third-wave DTO files carry required boundary flags", () => {
  for (const dtoFile of thirdWaveDtoFiles) {
    const source = readSource(dtoFile.path);

    for (const field of requiredBoundaryFlags) {
      assert.match(
        source,
        new RegExp(`\\b${field}\\b`, "u"),
        `${dtoFile.path}.${field}`
      );
    }
  }
});

test("[runtime] third-wave DTO files avoid forbidden direct fields", () => {
  for (const dtoFile of thirdWaveDtoFiles) {
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

test("[runtime] third-wave DTO files stay product-neutral", () => {
  for (const dtoFile of thirdWaveDtoFiles) {
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

test("[runtime] package exports include approved third-wave DTOs exactly", () => {
  const packageJson = JSON.parse(readSource("package.json"));

  assert.deepEqual(packageJson.exports, approvedExports);
  assert.deepEqual(
    Object.keys(packageJson.exports).sort(),
    Object.keys(approvedExports).sort()
  );
  assert.equal(Object.keys(packageJson.exports).length, 23);

  for (const dtoFile of thirdWaveDtoFiles) {
    const exportKey = `./runtime/public/${dtoFile.fragment}`;
    const exportTarget = `./runtime/public/${dtoFile.fragment}.ts`;

    assert.equal(packageJson.exports[exportKey], exportTarget);
  }
});

test("[runtime] third-wave helper bundle is absent", () => {
  assert.equal(
    existsSync(
      "runtime/public/third-wave-runtime-session-worker-lifecycle-helper-bundle.ts"
    ),
    false
  );
});

test("[runtime] third-wave implementation adds no schema registry or binding surfaces", () => {
  for (const dtoFile of thirdWaveDtoFiles) {
    assert.equal(existsSync(`schemas/${dtoFile.fragment}.json`), false);
    assert.equal(existsSync(`registry/${dtoFile.fragment}.json`), false);
    assert.equal(existsSync(`bindings/${dtoFile.fragment}.ts`), false);
  }
});
