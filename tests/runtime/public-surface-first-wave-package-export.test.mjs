import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const packageJsonPath = "package.json";

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
  "./runtime/public/operator-work-packet-handoff-dto":
    "./runtime/public/operator-work-packet-handoff-dto.ts",
  "./runtime/public/operator-work-packet-handoff-bundle":
    "./runtime/public/operator-work-packet-handoff-bundle.ts",
};

const firstWaveDtoSelfReferenceSubpaths = [
  "cognitive_os/runtime/public/runtime-readiness-status-dto",
  "cognitive_os/runtime/public/runtime-projection-summary-dto",
  "cognitive_os/runtime/public/runtime-execution-event-dto",
  "cognitive_os/runtime/public/runtime-objective-continuity-dto",
];

const forbiddenExportPathFragments = [
  "runtime/core",
  "runtime/lifecycle",
  "runtime/state",
  "runtime/learning",
  "runtime/execution",
  "schemas",
  "registry",
  "bindings",
  "fixtures",
  "tests",
];

function readPackageJson() {
  return JSON.parse(readFileSync(packageJsonPath, "utf8"));
}

test("[runtime] first-wave package export map is exact and private", () => {
  const packageJson = readPackageJson();

  assert.equal(packageJson.private, true);
  assert.deepEqual(packageJson.exports, approvedExports);
  assert.deepEqual(
    Object.keys(packageJson.exports).sort(),
    Object.keys(approvedExports).sort()
  );
});

test("[runtime] first-wave package export targets exist and avoid forbidden paths", () => {
  const packageJson = readPackageJson();
  const exportEntries = Object.entries(packageJson.exports).flat();

  for (const exportTarget of Object.values(approvedExports)) {
    assert.equal(existsSync(exportTarget), true, `${exportTarget} should exist`);
  }

  for (const exportEntry of exportEntries) {
    for (const forbiddenFragment of forbiddenExportPathFragments) {
      assert.equal(
        exportEntry.includes(forbiddenFragment),
        false,
        `${exportEntry} must not include ${forbiddenFragment}`
      );
    }
  }
});

test("[runtime] first-wave package export map has no broad publication fields", () => {
  const packageJson = readPackageJson();

  assert.equal(Object.hasOwn(packageJson, "main"), false);
  assert.equal(Object.hasOwn(packageJson, "types"), false);
  assert.equal(Object.hasOwn(packageJson, "files"), false);
  assert.equal(Object.hasOwn(packageJson, "bin"), false);
  assert.equal(Object.hasOwn(packageJson, "publishConfig"), false);
});

test("[runtime] first-wave DTO self-reference imports resolve as type-only modules", async () => {
  for (const subpath of firstWaveDtoSelfReferenceSubpaths) {
    const module = await import(subpath);

    assert.deepEqual(Object.keys(module), [], subpath);
  }
});

test("[runtime] first-wave package export adds no helper bundle", () => {
  assert.equal(
    existsSync("runtime/public/runtime-projection-handoff-bundle.ts"),
    false
  );
});
