import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const bindingPath = resolve(
  repoRoot,
  "bindings/mplp-kernel-duty-coregentis-binding.v0.yaml"
);
const mplpKernelDutyPath = resolve(
  repoRoot,
  "../MPLP-Protocol/schemas/v2/taxonomy/kernel-duties.yaml"
);

const EXPECTED_DUTIES = [
  ["KD-01", "Coordination", "coordination"],
  ["KD-02", "Error Handling", "error-handling"],
  ["KD-03", "Event Bus", "event-bus"],
  ["KD-04", "Learning Feedback", "learning-feedback"],
  ["KD-05", "Observability", "observability"],
  ["KD-06", "Orchestration", "orchestration"],
  ["KD-07", "Performance", "performance"],
  ["KD-08", "Protocol Versioning", "protocol-versioning"],
  ["KD-09", "Security", "security"],
  ["KD-10", "State Sync", "state-sync"],
  ["KD-11", "Transaction", "transaction"],
];

const FORBIDDEN_PRODUCT_TERMS = [
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

function extractDutyBlocks(yamlText) {
  const dutySection = yamlText.split("\nduties:\n")[1];
  assert.ok(dutySection, "binding artifact must include duties section");
  return dutySection
    .split(/\n(?=  - id: )/g)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
}

function extractQuotedField(block, fieldName) {
  const match = block.match(new RegExp(`${fieldName}: "([^"]+)"`));
  return match?.[1] ?? "";
}

function extractList(block, fieldName) {
  const match = block.match(
    new RegExp(`${fieldName}:\\n((?:      - "[^"]+"\\n?)+)`)
  );
  if (!match) {
    return [];
  }

  return [...match[1].matchAll(/      - "([^"]+)"/g)].map((entry) => entry[1]);
}

function extractMplpDuties(yamlText) {
  return [...yamlText.matchAll(
    /  - id: "([^"]+)"\n    name: "([^"]+)"\n    slug: "([^"]+)"/g
  )].map((match) => [match[1], match[2], match[3]]);
}

test("[governance] Kernel Duty binding artifact exists and matches MPLP SSOT", () => {
  const bindingText = readFileSync(bindingPath, "utf8");
  const mplpText = readFileSync(mplpKernelDutyPath, "utf8");

  const expectedFromMplp = extractMplpDuties(mplpText);
  assert.deepEqual(expectedFromMplp, EXPECTED_DUTIES);

  const dutyBlocks = extractDutyBlocks(bindingText);
  assert.equal(dutyBlocks.length, 11);

  const seenIds = new Set();
  for (const [expectedId, expectedName, expectedSlug] of EXPECTED_DUTIES) {
    const matchingBlocks = dutyBlocks.filter(
      (block) => extractQuotedField(block, "id") === expectedId
    );
    assert.equal(matchingBlocks.length, 1, `${expectedId} must appear once`);

    const block = matchingBlocks[0];
    seenIds.add(expectedId);
    assert.equal(extractQuotedField(block, "name"), expectedName);
    assert.equal(extractQuotedField(block, "slug"), expectedSlug);
    assert.ok(
      extractQuotedField(block, "cognitive_os_responsibility").length > 0,
      `${expectedId} must define Cognitive_OS responsibility`
    );
    assert.ok(
      extractList(block, "owner_services").length > 0,
      `${expectedId} must define owner or planned owner service`
    );
    assert.ok(
      extractQuotedField(block, "evidence_posture").length > 0,
      `${expectedId} must define evidence posture`
    );
    assert.ok(
      extractQuotedField(block, "projection_safe_exposure").length > 0,
      `${expectedId} must define projection-safe exposure rule`
    );
    assert.ok(
      extractQuotedField(block, "product_boundary_rule").length > 0,
      `${expectedId} must define product boundary rule`
    );
  }

  assert.equal(seenIds.size, 11);
});

test("[governance] Kernel Duty binding remains product-neutral", () => {
  const bindingText = readFileSync(bindingPath, "utf8");

  for (const forbiddenTerm of FORBIDDEN_PRODUCT_TERMS) {
    assert.equal(
      bindingText.includes(forbiddenTerm),
      false,
      `machine-readable binding must not contain product-specific term: ${forbiddenTerm}`
    );
  }
});
