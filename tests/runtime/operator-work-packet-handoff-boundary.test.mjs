import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  OPERATOR_WORK_PACKET_HANDOFF_BUNDLE_VERSION,
  OPERATOR_WORK_PACKET_HANDOFF_COMPATIBILITY_PROFILE,
  OPERATOR_WORK_PACKET_HANDOFF_CONTRACT_VERSION,
  OPERATOR_WORK_PACKET_HANDOFF_RUNTIME_CONTRACT_VERSION,
  createOperatorWorkPacketHandoffEnvelope,
  summarizeOperatorWorkPacketHandoffEnvelope,
  validateOperatorWorkPacketHandoffEnvelope,
} from "../../runtime/public/operator-work-packet-handoff-bundle.ts";
import {
  createOperatorWorkPacketFixtureInput,
} from "./operator-work-packet-handoff-fixture.mjs";

const bundlePath = "runtime/public/operator-work-packet-handoff-bundle.ts";
const bundleSource = readFileSync(bundlePath, "utf8");

test("[runtime] operator work-packet helper exports deterministic constants", () => {
  assert.equal(
    OPERATOR_WORK_PACKET_HANDOFF_CONTRACT_VERSION,
    "operator-work-packet-handoff-contract-v0.1"
  );
  assert.equal(
    OPERATOR_WORK_PACKET_HANDOFF_RUNTIME_CONTRACT_VERSION,
    "operator-work-packet-runtime-contract-v0.1"
  );
  assert.equal(
    OPERATOR_WORK_PACKET_HANDOFF_COMPATIBILITY_PROFILE,
    "projection-safe-operator-work-packet-handoff-v0.1"
  );
  assert.equal(OPERATOR_WORK_PACKET_HANDOFF_BUNDLE_VERSION, "0.1");
});

test("[runtime] operator work-packet envelope can represent every required component", () => {
  const input = createOperatorWorkPacketFixtureInput();
  const envelope = createOperatorWorkPacketHandoffEnvelope(input);

  for (const componentKey of [
    "operator_intent_summary",
    "work_intake_summary",
    "work_packet_summary",
    "assignment_summary",
    "worker_activity_summary",
    "reviewable_output_summary",
    "acceptance_state",
    "operator_feedback_summary",
    "delivery_artifact_summary",
    "continuity_pointer",
    "advanced_runtime_posture",
    "kernel_duty_posture",
    "projection_safe_envelope",
  ]) {
    assert.ok(envelope[componentKey], componentKey);
  }

  assert.equal(envelope.runtime_private_fields_omitted, true);
  assert.equal(envelope.non_executing, true);
  assert.equal(envelope.boundary_profile.mplp_bound, true);
  assert.equal(envelope.projection_safe_envelope.projection_safe, true);
});

test("[runtime] operator work-packet helper is deterministic and normalizes refs", () => {
  const input = createOperatorWorkPacketFixtureInput();
  const first = createOperatorWorkPacketHandoffEnvelope(input);
  const second = createOperatorWorkPacketHandoffEnvelope({
    ...input,
    safe_evidence_refs: [...input.safe_evidence_refs].reverse(),
    omission_markers: [...input.omission_markers].reverse(),
  });

  assert.equal(first.handoff_envelope_ref, second.handoff_envelope_ref);
  assert.deepEqual(first.safe_evidence_refs, second.safe_evidence_refs);
  assert.deepEqual(first.omission_markers, second.omission_markers);
});

test("[runtime] operator work-packet validation rejects unsupported acceptance states", () => {
  const input = createOperatorWorkPacketFixtureInput();
  const envelope = createOperatorWorkPacketHandoffEnvelope(input);

  assert.throws(
    () =>
      validateOperatorWorkPacketHandoffEnvelope({
        ...envelope,
        acceptance_state: {
          ...envelope.acceptance_state,
          state: "approved_by_runtime",
        },
      }),
    /acceptance_state\.state is unsupported/u
  );
});

test("[runtime] operator work-packet validation rejects missing advanced refs and boundary flags", () => {
  const input = createOperatorWorkPacketFixtureInput();
  const envelope = createOperatorWorkPacketHandoffEnvelope(input);

  assert.throws(
    () =>
      validateOperatorWorkPacketHandoffEnvelope({
        ...envelope,
        advanced_runtime_posture: {
          ...envelope.advanced_runtime_posture,
          source_intent_ref: undefined,
          implements_full_ael_runtime: true,
        },
      }),
    /advanced_runtime_posture\.implements_full_ael_runtime must be false/u
  );

  assert.throws(
    () =>
      validateOperatorWorkPacketHandoffEnvelope({
        ...envelope,
        boundary_profile: {
          ...envelope.boundary_profile,
          no_provider_dispatch: false,
        },
      }),
    /boundary_profile\.no_provider_dispatch must be true/u
  );
});

test("[runtime] operator work-packet validation rejects runtime-private and authority keys", () => {
  const input = createOperatorWorkPacketFixtureInput();
  const envelope = createOperatorWorkPacketHandoffEnvelope(input);

  assert.throws(
    () =>
      validateOperatorWorkPacketHandoffEnvelope({
        ...envelope,
        worker_activity_summary: {
          ...envelope.worker_activity_summary,
          provider: "provider_handle_fixture",
        },
      }),
    /forbidden runtime-private or authority key/u
  );

  assert.throws(
    () =>
      validateOperatorWorkPacketHandoffEnvelope({
        ...envelope,
        projection_safe_envelope: {
          ...envelope.projection_safe_envelope,
          tool_invocation: true,
        },
      }),
    /forbidden runtime-private or authority key/u
  );
});

test("[runtime] operator work-packet summary stays bounded and non-executing", () => {
  const input = createOperatorWorkPacketFixtureInput();
  const envelope = createOperatorWorkPacketHandoffEnvelope(input);
  const summary = summarizeOperatorWorkPacketHandoffEnvelope(envelope);

  assert.equal(summary.contract_version, OPERATOR_WORK_PACKET_HANDOFF_CONTRACT_VERSION);
  assert.equal(summary.acceptance_state, "not_reviewed");
  assert.equal(summary.kernel_duty_count, 11);
  assert.equal(summary.advanced_runtime_refs_projection_safe_only, true);
  assert.equal(summary.omitted_private_payload, true);
  assert.equal(summary.non_executing, true);
});

test("[runtime] operator work-packet helper avoids runtime/service/provider APIs", () => {
  for (const pattern of [
    /from "\.\.\/core/u,
    /from "\.\.\/state/u,
    /from "\.\.\/in-memory/u,
    /\bfetch\s*\(/u,
    /\bnew\s+Worker/u,
    /\bnew\s+Provider/u,
    /\bwriteFile/u,
    /\bappendFile/u,
    /\bcreateWriteStream/u,
    /\bDate\.now\b/u,
    /\bMath\.random\b/u,
  ]) {
    assert.doesNotMatch(bundleSource, pattern);
  }
});
