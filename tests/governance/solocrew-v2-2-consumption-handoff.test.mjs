import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const manifestPath = resolve(
  repoRoot,
  "handoffs/solocrew-v2.2-cgos-consumption-handoff.v0.yaml"
);

const REQUIRED_UPSTREAM_CONTRACTS = [
  "runtime/core/projection-safe-envelope.ts",
  "runtime/core/projection-safe-runtime-envelope-builder.ts",
  "runtime/core/state-snapshot-posture.ts",
  "runtime/core/transaction-export-posture.ts",
  "runtime/core/error-insufficiency-posture.ts",
  "runtime/fixtures/projection-safe-downstream-handoff-fixture.ts",
];

const REQUIRED_MODULE_POSTURES = [
  "Context",
  "Core",
  "Trace",
  "Plan",
  "Confirm",
];

const REQUIRED_KERNEL_DUTIES = [
  "KD-02",
  "KD-05",
  "KD-08",
  "KD-09",
  "KD-10",
  "KD-11",
];

const REQUIRED_MUST_NOT_OWN = [
  "Context law",
  "Plan law",
  "Confirm law",
  "Trace law",
  "Core law",
  "State Sync law",
  "Transaction law",
  "Security omission law",
  "Observability evidence law",
  "Protocol versioning posture",
  "Object/export binding semantics",
];

const REQUIRED_TRUE_BOUNDARIES = [
  "non_executing",
  "no_autonomous_execution",
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_marketplace_implementation",
  "no_mplp_certification",
  "no_mplp_endorsement",
];

const FORBIDDEN_MANIFEST_CLAIMS = [
  "SoloCrew owns Context",
  "SoloCrew owns State Sync",
  "SoloCrew owns Transaction",
  "SoloCrew owns Security",
  "SoloCrew owns Observability",
  "MPLP certification",
  "MPLP endorsement",
  "autonomous execution",
  "provider dispatch",
  "channel dispatch",
  "marketplace implemented",
];

function extractYamlList(yamlText, key) {
  const match = yamlText.match(new RegExp(`^${key}:\\n((?:  - "[^"]+"\\n?)+)`, "m"));
  assert.ok(match, `manifest must include ${key}`);
  return [...match[1].matchAll(/  - "([^"]+)"/g)].map((entry) => entry[1]);
}

function extractNestedYamlList(yamlText, parentKey, key) {
  const parentMatch = yamlText.match(new RegExp(`^${parentKey}:\\n([\\s\\S]*?)(?=^[a-zA-Z_]+:|\\z)`, "m"));
  assert.ok(parentMatch, `manifest must include ${parentKey}`);
  const nestedMatch = parentMatch[1].match(new RegExp(`^  ${key}:\\n((?:    - "[^"]+"\\n?)+)`, "m"));
  assert.ok(nestedMatch, `manifest must include ${parentKey}.${key}`);
  return [...nestedMatch[1].matchAll(/    - "([^"]+)"/g)].map((entry) => entry[1]);
}

function extractBoundaryValue(yamlText, key) {
  const match = yamlText.match(new RegExp(`^  ${key}: (true|false)$`, "m"));
  assert.ok(match, `manifest must include boundary ${key}`);
  return match[1] === "true";
}

function extractQuotedScalar(yamlText, key) {
  const match = yamlText.match(new RegExp(`^${key}: "([^"]+)"$`, "m"));
  assert.ok(match, `manifest must include ${key}`);
  return match[1];
}

test("[governance] SoloCrew V2.2 consumption handoff manifest exists", () => {
  assert.equal(existsSync(manifestPath), true);
});

test("[governance] SoloCrew V2.2 consumption handoff lists required upstream contracts", () => {
  const yamlText = readFileSync(manifestPath, "utf8");
  assert.deepEqual(
    extractNestedYamlList(yamlText, "source", "upstream_contracts"),
    REQUIRED_UPSTREAM_CONTRACTS
  );
});

test("[governance] SoloCrew V2.2 consumption handoff pins required module and duty posture", () => {
  const yamlText = readFileSync(manifestPath, "utf8");
  assert.deepEqual(
    extractYamlList(yamlText, "required_module_postures"),
    REQUIRED_MODULE_POSTURES
  );
  assert.deepEqual(
    extractYamlList(yamlText, "required_kernel_duties"),
    REQUIRED_KERNEL_DUTIES
  );
});

test("[governance] SoloCrew V2.2 consumption handoff preserves upstream ownership boundaries", () => {
  const yamlText = readFileSync(manifestPath, "utf8");
  assert.deepEqual(
    extractYamlList(yamlText, "solocrew_must_not_own"),
    REQUIRED_MUST_NOT_OWN
  );
});

test("[governance] SoloCrew V2.2 consumption handoff requires all safety boundaries", () => {
  const yamlText = readFileSync(manifestPath, "utf8");

  for (const boundary of REQUIRED_TRUE_BOUNDARIES) {
    assert.equal(extractBoundaryValue(yamlText, boundary), true);
  }
});

test("[governance] SoloCrew V2.2 consumption handoff pins the next allowed SoloCrew task", () => {
  const yamlText = readFileSync(manifestPath, "utf8");
  assert.equal(
    extractQuotedScalar(yamlText, "next_allowed_solocrew_task"),
    "SOLOCREW-V2.2-IMPL-01-WORKSPACE-SESSION-CONTINUITY-WITH-CGOS-CONSUMPTION"
  );
});

test("[governance] SoloCrew V2.2 consumption manifest has no forbidden product-runtime-law claims", () => {
  const yamlText = readFileSync(manifestPath, "utf8");

  for (const forbiddenClaim of FORBIDDEN_MANIFEST_CLAIMS) {
    assert.equal(
      yamlText.includes(forbiddenClaim),
      false,
      `manifest must not contain forbidden claim: ${forbiddenClaim}`
    );
  }
});
