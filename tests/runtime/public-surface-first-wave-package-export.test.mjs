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
