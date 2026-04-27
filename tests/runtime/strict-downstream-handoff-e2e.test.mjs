import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  create_projection_safe_downstream_handoff_fixture,
} from "../../runtime/fixtures/projection-safe-downstream-handoff-fixture.ts";
import { assert_no_forbidden_projection_keys } from "../../runtime/core/projection-safe-envelope.ts";

const requiredSoloCrewV22Modules = ["Context", "Core", "Trace", "Plan", "Confirm"];
const requiredSoloCrewV22Duties = ["KD-02", "KD-05", "KD-08", "KD-09", "KD-10", "KD-11"];
const forbiddenRuntimeFixtureTerms = [
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

test("[strict-e2e] downstream handoff fixture is complete, projection-safe, and consumable without runtime-private payloads", () => {
  const fixture = create_projection_safe_downstream_handoff_fixture(".");
  const envelope = fixture.projection_safe_runtime_envelope;
  const moduleNames = envelope.module_posture_summary.map(
    (module) => module.module_name
  );
  const dutyIds = envelope.kernel_duty_posture_summary.map((duty) => duty.duty_id);

  assert.equal(fixture.consumer_kind, "projection_consumer");
  assert.equal(fixture.handoff_surface, "downstream_projection");
  assert.equal(fixture.runtime_private_fields_omitted, true);
  assert.equal(fixture.non_executing, true);
  assert.ok(envelope);
  assert.ok(fixture.state_snapshot_posture);
  assert.ok(fixture.transaction_export_posture);
  assert.ok(fixture.error_insufficiency_posture);
  assert.ok(envelope.safe_evidence_refs.length > 0);
  assert.ok(envelope.omission_markers.length > 0);
  assert.ok(envelope.protocol_version_refs.length > 0);
  assert.ok(envelope.binding_version_refs.length > 0);
  assert.equal(moduleNames.length, 10);
  assert.equal(dutyIds.length, 11);

  for (const moduleName of requiredSoloCrewV22Modules) {
    assert.ok(moduleNames.includes(moduleName), `required module: ${moduleName}`);
  }

  for (const dutyId of requiredSoloCrewV22Duties) {
    assert.ok(dutyIds.includes(dutyId), `required duty: ${dutyId}`);
  }

  assert.doesNotThrow(() => assert_no_forbidden_projection_keys(fixture));
  assert.doesNotMatch(
    JSON.stringify(fixture),
    /"raw_runtime_private_payload"\s*:|"runtime_private_record_payload"\s*:|"provider_dispatch"\s*:\s*true|"channel_dispatch"\s*:\s*true|"marketplace_implemented"\s*:\s*true/i
  );
});

test("[strict-e2e] downstream handoff runtime fixture source stays product-neutral", () => {
  const content = readFileSync(
    "runtime/fixtures/projection-safe-downstream-handoff-fixture.ts",
    "utf8"
  );

  for (const term of forbiddenRuntimeFixtureTerms) {
    assert.equal(content.includes(term), false, `forbidden term: ${term}`);
  }
});
