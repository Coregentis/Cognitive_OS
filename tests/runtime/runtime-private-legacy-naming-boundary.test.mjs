import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const legacyRuntimePrivateTerms = [
  "cell-runtime-scope",
  "cell-summary-runtime-record",
  "cell_runtime_scope",
  "cell_summary_runtime_record",
  "CellRuntimeScopeRecord",
  "CellSummaryRuntimeRecord",
];

const publicRuntimeDirs = ["runtime/public"];

const allowedLegacyRuntimePrivateTermFiles = new Set([
  "bindings/mplp-coregentis-binding-matrix.v0.yaml",
  "bindings/coregentis-export-rules.v0.yaml",
  "registry/coregentis-object-registry.v0.yaml",
  "schemas/coregentis/v0/workforce/cell-runtime-scope.schema.json",
  "schemas/coregentis/v0/workforce/cell-summary-runtime-record.schema.json",
  "schemas/coregentis/v0/workforce/approval-request-record.schema.json",
  "schemas/coregentis/v0/workforce/delivery-return-record.schema.json",
  "schemas/coregentis/v0/workforce/management-directive-record.schema.json",
  "runtime/core/runtime-types.ts",
  "runtime/core/projection-types.ts",
  "runtime/core/projection-service.ts",
  "runtime/state/state-store-port.ts",
  "tests/runtime/projection-safe-contract.test.mjs",
  "tests/runtime/runtime-private-legacy-naming-boundary.test.mjs",
  "tests/runtime/runtime-readiness-foundation.test.mjs",
  "tests/runtime/upstream-public-surface-dto-implementation-export.test.mjs",
  "tests/runtime/workforce-schema-registry.test.mjs",
  "tests/runtime/workforce-state-persistence.test.mjs",
  "governance/audits/CGOS-CROSS-REPO-CONSUMPTION-AND-NON-PROMOTION-v0.1.md",
  "governance/audits/CGOS-MULTI-CELL-RUNTIME-BOUNDARY-CLOSURE-v0.1.md",
  "governance/audits/CGOS-SOLOCREW-v0.4-RUNTIME-BLOCKER-INTAKE-v0.1.md",
  "governance/audits/CGOS-v0.4-WORKFORCE-CLOSURE-MATRIX-v0.1.md",
  "governance/audits/CGOS-v0.5-DOWNSTREAM-PACKET-STATE-BOUNDARY-REVIEW-v0.1.md",
  "governance/audits/CGOS-v0.5-UPSTREAM-WORKFLOW-TRUTH-DECISION-v0.1.md",
  "governance/audits/TRI-REPO-HISTORICAL-MPLP-BOUNDARY-COMPLIANCE-AUDIT-v0.1.md",
  "governance/audits/TRI-REPO-BOUNDARY-CORRECTION-PATCH-v0.1.md",
  "governance/baselines/CGOS-SOLOCREW-PROJECTION-READINESS-BASELINE-v0.1.md",
  "governance/guides/CGOS-RUNTIME-CONSUMPTION-BOUNDARY-ADDENDUM-v0.1.md",
  "governance/planning/CGOS-PUBLIC-SURFACE-CANDIDATE-PLAN-v0.1.md",
  "governance/research/CGOS-UPSTREAM-COMPLETION-DEEP-AUDIT-AND-REFACTOR-PLAN-v0.1.md",
  "governance/releases/CGOS-v0.4-WORKFORCE-RUNTIME-CLOSURE-RECORD.md",
  "governance/releases/CGOS-v0.5-UPSTREAM-BOUNDARY-CLOSURE-RECORD.md",
]);

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.name === "node_modules" || entry.name === ".git") {
      return [];
    }

    if (entry.isDirectory()) {
      return listFiles(path);
    }

    return [path];
  });
}

test("[runtime] legacy cell naming remains absent from public runtime exports", () => {
  const publicSources = publicRuntimeDirs
    .flatMap(listFiles)
    .map((filePath) => readFileSync(filePath, "utf8"))
    .join("\n");

  for (const legacyTerm of legacyRuntimePrivateTerms) {
    assert.equal(
      publicSources.includes(legacyTerm),
      false,
      `${legacyTerm} must not appear in runtime/public`
    );
  }
});

test("[runtime] legacy cell naming is confined to runtime-private or governance exception files", () => {
  const filesWithLegacyTerms = listFiles(".").filter((filePath) => {
    if (!/\.(?:ts|mjs|json|yaml|md)$/u.test(filePath)) {
      return false;
    }

    const source = readFileSync(filePath, "utf8");
    return legacyRuntimePrivateTerms.some((legacyTerm) =>
      source.includes(legacyTerm)
    );
  });

  for (const filePath of filesWithLegacyTerms) {
    const normalizedPath = filePath.replace(/^\.\//u, "");

    assert.equal(
      allowedLegacyRuntimePrivateTermFiles.has(normalizedPath),
      true,
      `${normalizedPath} must be exception-gated before using legacy cell naming`
    );
  }
});
