import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  create_projection_safe_downstream_handoff_fixture,
} from "../../runtime/fixtures/projection-safe-downstream-handoff-fixture.ts";

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
  "MPLP certification",
  "MPLP endorsement",
];

test("[runtime] downstream handoff fixture is product-neutral and projection-safe", () => {
  const fixture = create_projection_safe_downstream_handoff_fixture(".");

  assert.equal(fixture.consumer_kind, "projection_consumer");
  assert.equal(fixture.handoff_surface, "downstream_projection");
  assert.equal(fixture.runtime_private_fields_omitted, true);
  assert.equal(fixture.non_executing, true);

  const envelope = fixture.projection_safe_runtime_envelope;
  assert.equal(envelope.object_export_binding_posture_refs.length, 2);
  assert.equal(envelope.module_posture_summary.length, 10);
  assert.equal(envelope.kernel_duty_posture_summary.length, 11);
  assert.ok(envelope.safe_evidence_refs.length > 0);
  assert.ok(envelope.omission_markers.length > 0);
  assert.ok(envelope.protocol_version_refs.length > 0);
  assert.ok(envelope.binding_version_refs.length > 0);

  assert.deepEqual(fixture.state_snapshot_posture.kernel_duty_posture_links, ["KD-10"]);
  assert.ok(fixture.transaction_export_posture.kernel_duty_posture_links.includes("KD-11"));
  assert.deepEqual(fixture.error_insufficiency_posture.kernel_duty_posture_links, ["KD-02"]);
});

test("[runtime] downstream handoff fixture keeps Extension and Network unavailable without external routing", () => {
  const fixture = create_projection_safe_downstream_handoff_fixture(".");
  const safeDeferredModules = fixture.projection_safe_runtime_envelope
    .module_posture_summary
    .filter((module) => ["Extension", "Network"].includes(module.module_name));

  assert.equal(safeDeferredModules.length, 2);

  for (const module of safeDeferredModules) {
    assert.equal(module.realization_status, "unavailable_safe_deferred");
    const combined = JSON.stringify(module).toLowerCase();
    assert.match(combined, /not enabled|unavailable/);
    assert.match(combined, /provider/);
    assert.match(combined, /channel/);
    assert.match(combined, /dispatch/);
    assert.match(combined, /marketplace/);
  }
});

test("[runtime] downstream handoff fixture source contains no product-specific terms", () => {
  const content = readFileSync(
    "runtime/fixtures/projection-safe-downstream-handoff-fixture.ts",
    "utf8"
  );

  for (const term of forbiddenTerms) {
    assert.equal(content.includes(term), false, `forbidden term: ${term}`);
  }
});
