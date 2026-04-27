import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  create_projection_safe_downstream_handoff_fixture,
} from "../../runtime/fixtures/projection-safe-downstream-handoff-fixture.ts";

const runtimePathsToScan = ["runtime/core", "runtime/fixtures"];
const forbiddenRuntimeTerms = [
  "provider dispatch",
  "channel dispatch",
  "marketplace implemented",
  "autonomous execution",
  "MPLP certification",
  "MPLP endorsement",
  "SoloCrew",
  "founder",
  "Secretary",
  "Developer Company",
  "Project Governance journey",
];

function listFiles(path) {
  const entry = statSync(path);
  if (entry.isFile()) {
    return [path];
  }

  return readdirSync(path)
    .flatMap((child) => listFiles(join(path, child)))
    .filter((file) => /\.(ts|mjs|js|json|yaml)$/.test(file));
}

function walkKeys(value, callback) {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      walkKeys(item, callback);
    }
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    callback(key, nested);
    walkKeys(nested, callback);
  }
}

test("[strict-e2e] downstream fixture does not expose forbidden positive boundary fields", () => {
  const fixture = create_projection_safe_downstream_handoff_fixture(".");
  const forbiddenKeys = new Set([
    "raw_runtime_private_payload",
    "provider_dispatch",
    "channel_dispatch",
    "marketplace_implemented",
    "autonomous_execution",
    "mplp_certification",
    "mplp_endorsement",
    "full_distributed_transaction_claimed",
  ]);

  walkKeys(fixture, (key, value) => {
    assert.equal(forbiddenKeys.has(key), false, `forbidden key: ${key}`);
    if (key === "distributed_transaction_claimed") {
      assert.equal(value, false);
    }
  });

  assert.doesNotMatch(
    JSON.stringify(fixture),
    /"provider_dispatch"\s*:\s*true|"channel_dispatch"\s*:\s*true|"marketplace_implemented"\s*:\s*true|"autonomous_execution"\s*:\s*true/i
  );
});

test("[strict-e2e] runtime core and fixture sources contain no product law or forbidden positive claims", () => {
  const files = runtimePathsToScan.flatMap(listFiles);

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    assert.doesNotMatch(
      content,
      /raw_runtime_private_payload\s*[?:=]/,
      `forbidden raw runtime-private payload field in ${file}`
    );
    for (const term of forbiddenRuntimeTerms) {
      assert.equal(
        content.includes(term),
        false,
        `forbidden runtime term ${JSON.stringify(term)} in ${file}`
      );
    }
  }
});
