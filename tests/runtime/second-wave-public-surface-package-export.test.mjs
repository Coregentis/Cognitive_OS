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
  "./runtime/public/memory-continuity-review-dto":
    "./runtime/public/memory-continuity-review-dto.ts",
  "./runtime/public/personal-mvp-runtime-backbone-dto":
    "./runtime/public/personal-mvp-runtime-backbone-dto.ts",
  "./runtime/public/personal-mvp-runtime-backbone-bundle":
    "./runtime/public/personal-mvp-runtime-backbone-bundle.ts",
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
  "./runtime/public/human-confirmed-action-preparation-dto":
    "./runtime/public/human-confirmed-action-preparation-dto.ts",
  "./runtime/public/human-confirmed-action-preparation-bundle":
    "./runtime/public/human-confirmed-action-preparation-bundle.ts",
};

const secondWaveDtoSelfReferenceSubpaths = [
  "cognitive_os/runtime/public/state-port-summary-dto",
  "cognitive_os/runtime/public/persistence-roundtrip-evidence-dto",
  "cognitive_os/runtime/public/memory-preference-summary-dto",
  "cognitive_os/runtime/public/learning-correction-evidence-dto",
  "cognitive_os/runtime/public/runtime-action-request-summary-dto",
  "cognitive_os/runtime/public/runtime-dispatch-boundary-evidence-dto",
];

const secondWaveExportFragments = [
  "state-port-summary-dto",
  "persistence-roundtrip-evidence-dto",
  "memory-preference-summary-dto",
  "learning-correction-evidence-dto",
  "runtime-action-request-summary-dto",
  "runtime-dispatch-boundary-evidence-dto",
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

test("[runtime] second-wave package export map is exact and private", () => {
  const packageJson = readPackageJson();

  assert.equal(packageJson.private, true);
  assert.deepEqual(packageJson.exports, approvedExports);
  assert.deepEqual(
    Object.keys(packageJson.exports).sort(),
    Object.keys(approvedExports).sort()
  );
  assert.equal(Object.keys(packageJson.exports).length, 26);
});

test("[runtime] second-wave package export map preserves existing six exports", () => {
  const packageJson = readPackageJson();

  for (const exportKey of [
    "./runtime/public/operator-review-loop-dto",
    "./runtime/public/operator-review-loop-handoff-bundle",
    "./runtime/public/runtime-readiness-status-dto",
    "./runtime/public/runtime-projection-summary-dto",
    "./runtime/public/runtime-execution-event-dto",
    "./runtime/public/runtime-objective-continuity-dto",
  ]) {
    assert.equal(packageJson.exports[exportKey], approvedExports[exportKey]);
  }
});

test("[runtime] second-wave package export map adds all six DTO exports", () => {
  const packageJson = readPackageJson();

  for (const secondWaveFragment of secondWaveExportFragments) {
    const exportKey = `./runtime/public/${secondWaveFragment}`;
    const exportTarget = `./runtime/public/${secondWaveFragment}.ts`;

    assert.equal(packageJson.exports[exportKey], exportTarget);
    assert.equal(existsSync(exportTarget), true, `${exportTarget} should exist`);
  }
});

test("[runtime] second-wave package export map avoids private surfaces", () => {
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

test("[runtime] second-wave package export map has no publication fields", () => {
  const packageJson = readPackageJson();

  assert.equal(Object.hasOwn(packageJson, "main"), false);
  assert.equal(Object.hasOwn(packageJson, "types"), false);
  assert.equal(Object.hasOwn(packageJson, "files"), false);
  assert.equal(Object.hasOwn(packageJson, "bin"), false);
  assert.equal(Object.hasOwn(packageJson, "publishConfig"), false);
});

test("[runtime] second-wave DTO self-reference imports resolve as empty modules", async () => {
  for (const subpath of secondWaveDtoSelfReferenceSubpaths) {
    const module = await import(subpath);

    assert.deepEqual(Object.keys(module), [], subpath);
  }
});

test("[runtime] second-wave package export adds no helper schema registry or binding", () => {
  assert.equal(
    existsSync("runtime/public/second-wave-public-surface-helper-bundle.ts"),
    false
  );

  for (const secondWaveFragment of secondWaveExportFragments) {
    assert.equal(existsSync(`schemas/${secondWaveFragment}.json`), false);
    assert.equal(existsSync(`registry/${secondWaveFragment}.json`), false);
    assert.equal(existsSync(`bindings/${secondWaveFragment}.ts`), false);
  }
});
