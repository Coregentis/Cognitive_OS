import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = new URL("../..", import.meta.url);

const postureContractFiles = [
  "runtime/core/mplp-module-posture.ts",
  "runtime/core/kernel-duty-runtime-posture.ts",
  "runtime/core/default-mplp-module-posture.ts",
  "runtime/core/default-kernel-duty-posture.ts",
  "runtime/core/projection-safe-envelope.ts",
  "runtime/core/projection-binding-consumption.ts",
  "runtime/core/projection-safe-runtime-envelope-builder.ts",
  "runtime/core/state-snapshot-posture.ts",
  "runtime/core/transaction-export-posture.ts",
  "runtime/core/error-insufficiency-posture.ts",
  "runtime/fixtures/projection-safe-downstream-handoff-fixture.ts",
];

const forbiddenTerms = [
  "SoloCrew",
  "founder",
  "Secretary",
  "Developer Company",
  "Project Governance journey",
  "TracePilot Cell",
  "paid pilot",
  "marketplace implemented",
  "provider dispatch",
  "channel dispatch",
  "autonomous execution",
];

const forbiddenClaims = [
  "MPLP certification",
  "MPLP endorsement",
  "Kernel Duties fully implemented",
  "protocol updated",
];

test("[governance] runtime posture contracts remain free of product-specific law", () => {
  for (const file of postureContractFiles) {
    const content = readFileSync(join(repoRoot.pathname, file), "utf8");

    for (const term of forbiddenTerms) {
      assert.equal(
        content.includes(term),
        false,
        `${file} must not contain forbidden product term: ${term}`
      );
    }
  }
});

test("[governance] runtime posture contracts make no certification or endorsement claims", () => {
  for (const file of postureContractFiles) {
    const content = readFileSync(join(repoRoot.pathname, file), "utf8");

    for (const claim of forbiddenClaims) {
      assert.equal(
        content.includes(claim),
        false,
        `${file} must not contain forbidden claim: ${claim}`
      );
    }
  }
});
