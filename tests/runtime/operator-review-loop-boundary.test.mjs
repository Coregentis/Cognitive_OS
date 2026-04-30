import test from "node:test";
import assert from "node:assert/strict";

import {
  createLocalReviewLoopResult,
} from "../../runtime/core/operator-review-loop-workflow.ts";

const forbiddenPositiveFields = [
  "raw_runtime_private_payload",
  "payment_processor",
  "checkout",
  "subscription",
  "automated_billing",
  "crm",
  "email_dispatch",
  "public_publishing",
  "testimonial_publish",
  "external_analytics",
  "llm_call",
  "model_call",
  "agent_dispatch",
  "tool_invocation",
  "saas_sharing",
  "customer_account",
  "automatic_conversion",
  "provider_dispatch",
  "channel_dispatch",
  "marketplace",
  "autonomous_execution",
  "package_publish",
  "npm_publish",
  "certification",
  "endorsement",
  "persistence_adapter",
  "database_ref",
  "file_export_path",
  "route_url",
  "file_system_write",
  "database_storage",
  "cloud_sync",
];

function walk(value, visit) {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, visit));
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    visit(key, nested);
    walk(nested, visit);
  }
}

test("[runtime] operator review loop objects omit raw runtime payload fields", () => {
  const result = createLocalReviewLoopResult();
  const serialized = JSON.stringify(result);

  assert.doesNotMatch(serialized, /"raw_runtime_private_payload"\s*:/u);
  assert.doesNotMatch(serialized, /"runtime_private_payload"\s*:/u);
  assert.equal(result.runtime_private_fields_omitted, true);
  assert.equal(result.non_executing, true);
});

test("[runtime] operator review loop objects expose no positive external fields", () => {
  const result = createLocalReviewLoopResult();

  walk(result, (key, nested) => {
    for (const field of forbiddenPositiveFields) {
      if (key === field) {
        assert.fail(`positive field present: ${field}`);
      }

      if (typeof nested === "string") {
        assert.equal(
          nested.includes(field),
          false,
          `positive field value present: ${field}`
        );
      }
    }
  });
});

test("[runtime] operator review loop boundary flags remain true", () => {
  const result = createLocalReviewLoopResult();

  for (const [flag, value] of Object.entries(result.boundary_profile)) {
    assert.equal(value, true, `boundary flag: ${flag}`);
  }

  assert.equal(result.boundary_profile.no_provider_dispatch, true);
  assert.equal(result.boundary_profile.no_channel_dispatch, true);
  assert.equal(result.boundary_profile.no_crm, true);
  assert.equal(result.boundary_profile.no_email_dispatch, true);
  assert.equal(result.boundary_profile.no_public_publishing, true);
  assert.equal(result.boundary_profile.no_payment, true);
  assert.equal(result.boundary_profile.no_llm_or_tool_invocation, true);
  assert.equal(result.boundary_profile.no_cloud_sync, true);
  assert.equal(result.boundary_profile.no_autonomy, true);
});
