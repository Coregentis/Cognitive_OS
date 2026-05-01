import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const packageJsonPath = "package.json";

const approvedExports = {
  "./runtime/public/operator-review-loop-dto":
    "./runtime/public/operator-review-loop-dto.ts",
  "./runtime/public/operator-review-loop-handoff-bundle":
    "./runtime/public/operator-review-loop-handoff-bundle.ts",
};

const forbiddenExportPathFragments = [
  "runtime/core",
  "runtime/in-memory",
  "schemas",
  "registry",
  "bindings",
  "fixtures",
  "tests",
];

function readPackageJson() {
  return JSON.parse(readFileSync(packageJsonPath, "utf8"));
}

test("[runtime] package export boundary remains private and minimal", () => {
  const packageJson = readPackageJson();

  assert.equal(packageJson.private, true);
  assert.deepEqual(packageJson.exports, approvedExports);
  assert.deepEqual(
    Object.keys(packageJson.exports).sort(),
    Object.keys(approvedExports).sort()
  );
});

test("[runtime] package export targets are the approved projection-safe surfaces", () => {
  const packageJson = readPackageJson();

  for (const [exportKey, exportTarget] of Object.entries(approvedExports)) {
    assert.equal(packageJson.exports[exportKey], exportTarget);
    assert.equal(existsSync(exportTarget), true, `${exportTarget} should exist`);
  }
});

test("[runtime] package export map does not expose private repository surfaces", () => {
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

test("[runtime] package export map does not add publication or broad entry fields", () => {
  const packageJson = readPackageJson();

  assert.equal(Object.hasOwn(packageJson, "main"), false);
  assert.equal(Object.hasOwn(packageJson, "types"), false);
  assert.equal(Object.hasOwn(packageJson, "files"), false);
  assert.equal(Object.hasOwn(packageJson, "bin"), false);
  assert.equal(Object.hasOwn(packageJson, "publishConfig"), false);
});
