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
};

const existingApprovedExportKeys = [
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
];

const thirdWaveExportFragments = [
  "runtime-session-summary-dto",
  "runtime-session-evidence-dto",
  "worker-lifecycle-summary-dto",
  "worker-lifecycle-evidence-dto",
];

const thirdWaveDtoSelfReferenceSubpaths = thirdWaveExportFragments.map(
  (fragment) => `cognitive_os/runtime/public/${fragment}`
);

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

test("[runtime] third-wave package export map is exact and private", () => {
  const packageJson = readPackageJson();

  assert.equal(packageJson.private, true);
  assert.deepEqual(packageJson.exports, approvedExports);
  assert.deepEqual(
    Object.keys(packageJson.exports).sort(),
    Object.keys(approvedExports).sort()
  );
  assert.equal(Object.keys(packageJson.exports).length, 19);
});

test("[runtime] third-wave package export preserves existing twelve exports", () => {
  const packageJson = readPackageJson();

  for (const exportKey of existingApprovedExportKeys) {
    assert.equal(packageJson.exports[exportKey], approvedExports[exportKey]);
  }
});

test("[runtime] third-wave package export adds all four DTO exports", () => {
  const packageJson = readPackageJson();

  for (const thirdWaveFragment of thirdWaveExportFragments) {
    const exportKey = `./runtime/public/${thirdWaveFragment}`;
    const exportTarget = `./runtime/public/${thirdWaveFragment}.ts`;

    assert.equal(packageJson.exports[exportKey], exportTarget);
    assert.equal(existsSync(exportTarget), true, `${exportTarget} should exist`);
  }
});

test("[runtime] third-wave package export map avoids private surfaces", () => {
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
});

test("[runtime] third-wave package export map has no publication fields", () => {
  const packageJson = readPackageJson();

  assert.equal(Object.hasOwn(packageJson, "main"), false);
  assert.equal(Object.hasOwn(packageJson, "types"), false);
  assert.equal(Object.hasOwn(packageJson, "files"), false);
  assert.equal(Object.hasOwn(packageJson, "bin"), false);
  assert.equal(Object.hasOwn(packageJson, "publishConfig"), false);
});

test("[runtime] third-wave DTO self-reference imports resolve as empty modules", async () => {
  for (const subpath of thirdWaveDtoSelfReferenceSubpaths) {
    const module = await import(subpath);

    assert.deepEqual(Object.keys(module), [], subpath);
  }
});

test("[runtime] third-wave package export adds no helper schema registry or binding", () => {
  assert.equal(
    existsSync(
      "runtime/public/third-wave-runtime-session-worker-lifecycle-helper-bundle.ts"
    ),
    false
  );

  for (const thirdWaveFragment of thirdWaveExportFragments) {
    assert.equal(existsSync(`schemas/${thirdWaveFragment}.json`), false);
    assert.equal(existsSync(`registry/${thirdWaveFragment}.json`), false);
    assert.equal(existsSync(`bindings/${thirdWaveFragment}.ts`), false);
  }
});
