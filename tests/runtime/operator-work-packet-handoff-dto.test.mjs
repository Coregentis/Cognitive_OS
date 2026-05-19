import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  OPERATOR_WORK_PACKET_ACCEPTANCE_STATES,
  OPERATOR_WORK_PACKET_KERNEL_DUTIES,
  OPERATOR_WORK_PACKET_KERNEL_DUTY_POSTURE_VALUES,
  OPERATOR_WORK_PACKET_MPLP_MODULES,
} from "../../runtime/public/operator-work-packet-handoff-dto.ts";

const dtoPath = "runtime/public/operator-work-packet-handoff-dto.ts";
const packageJsonPath = "package.json";
const dtoSource = readFileSync(dtoPath, "utf8");

const requiredTypes = [
  "OperatorWorkPacketHandoffEnvelope",
  "OperatorIntentSummary",
  "WorkIntakeSummary",
  "WorkPacketSummary",
  "ObjectivePacketSummary",
  "AssignmentSummary",
  "WorkerActivitySummary",
  "ReviewableOutputSummary",
  "AcceptanceState",
  "AcceptanceStateSummary",
  "OperatorFeedbackSummary",
  "DeliveryArtifactSummary",
  "ContinuityPointer",
  "AdvancedRuntimePosture",
  "KernelDutyPosture",
  "ProjectionSafeEnvelope",
];

const requiredAdditionalFields = [
  "dialog_ref",
  "clarification_ref",
  "source_intent_ref",
  "intent_drift_marker",
  "semantic_loss_marker",
  "psg_pointer",
  "ael_event_ref",
  "vsl_state_ref",
  "value_state_ref",
  "learning_feedback_ref",
  "kernel_duty_posture",
  "omission_markers",
  "non_execution_boundary",
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_tool_invocation",
  "no_training_authority",
  "no_automatic_mutation",
];

const forbiddenRuntimePrivateFields = [
  "raw_prompt:",
  "raw_trace:",
  "provider:",
  "provider_response",
  "model_response",
  "sqlite",
  "store:",
  "constructor:",
  "service_instance",
  "mutable_handle",
  "worker_private_state",
  "dispatcher",
  "tool_result_raw",
];

const forbiddenProductTerms = [
  "SoloCrew",
  "founder",
  "secretary",
  "cell",
  "company dashboard",
  "mission room",
  "OPC",
  "one-person company",
  "portfolio",
  "Dev Pack",
  "Media Pack",
  "Operational V1",
];

const forbiddenFullImplementationTerms = [
  "FullDialogRuntime",
  "AelRuntime",
  "VslRuntime",
  "PsgRuntime",
  "DriftEngine",
  "LearningEngine",
  "ProviderBridge",
  "WorkerExecutionBridge",
];

function stripAllowedNoFlags(source) {
  return source
    .replaceAll("no_provider_dispatch", "")
    .replaceAll("no_channel_dispatch", "")
    .replaceAll("no_tool_invocation", "")
    .replaceAll("no_publishing", "")
    .replaceAll("no_payment", "")
    .replaceAll("no_customer_outreach", "")
    .replaceAll("no_autonomous_external_action", "")
    .replaceAll("no_training_authority", "")
    .replaceAll("no_automatic_mutation", "")
    .replaceAll("no_automatic_writeback_authority", "")
    .replaceAll("no_package_publication", "")
    .replaceAll("no_certification_claim", "")
    .replaceAll("no_formal_assurance_claim", "")
    .replaceAll("no_endorsement_claim", "")
    .replaceAll("no_regulator_approval_claim", "")
    .replaceAll("no_official_compliance_claim", "")
    .replaceAll("no_certification_or_endorsement", "");
}

test("[runtime] operator work-packet DTO exports required contract types", () => {
  for (const typeName of requiredTypes) {
    assert.match(dtoSource, new RegExp(`export type ${typeName}\\b`, "u"));
  }

  assert.doesNotMatch(dtoSource, /export function\b/u);
  assert.doesNotMatch(dtoSource, /export class\b/u);
  assert.doesNotMatch(dtoSource, /\bclass\s/u);
});

test("[runtime] operator work-packet DTO includes required additional refs and boundary flags", () => {
  for (const field of requiredAdditionalFields) {
    assert.match(dtoSource, new RegExp(`\\b${field}\\b`, "u"), field);
  }

  assert.match(dtoSource, /\bimplements_full_dialog_runtime:\s*false\b/u);
  assert.match(dtoSource, /\bimplements_full_ael_runtime:\s*false\b/u);
  assert.match(dtoSource, /\bimplements_full_vsl_runtime:\s*false\b/u);
  assert.match(dtoSource, /\bimplements_full_psg_runtime:\s*false\b/u);
  assert.match(dtoSource, /\bimplements_full_drift_engine:\s*false\b/u);
  assert.match(dtoSource, /\bimplements_full_learning_engine:\s*false\b/u);
});

test("[runtime] operator work-packet acceptance states and kernel duties are canonical", () => {
  assert.deepEqual(OPERATOR_WORK_PACKET_ACCEPTANCE_STATES, [
    "not_reviewed",
    "accepted",
    "needs_revision",
    "rejected",
    "parked",
  ]);

  assert.deepEqual(
    OPERATOR_WORK_PACKET_KERNEL_DUTIES.map((duty) => `${duty.duty_id} ${duty.duty_name}`),
    [
      "KD-01 Coordination",
      "KD-02 Error Handling",
      "KD-03 Event Bus",
      "KD-04 Learning Feedback",
      "KD-05 Observability",
      "KD-06 Orchestration",
      "KD-07 Performance",
      "KD-08 Protocol Versioning",
      "KD-09 Security",
      "KD-10 State Sync",
      "KD-11 Transaction",
    ]
  );

  assert.deepEqual(OPERATOR_WORK_PACKET_KERNEL_DUTY_POSTURE_VALUES, [
    "enforced",
    "projected",
    "evidenced",
    "documented_only",
    "omitted",
    "deferred",
    "not_applicable",
  ]);

  assert.deepEqual(OPERATOR_WORK_PACKET_MPLP_MODULES, [
    "Context",
    "Plan",
    "Confirm",
    "Trace",
    "Role",
    "Extension",
    "Dialog",
    "Collab",
    "Core",
    "Network",
  ]);
});

test("[runtime] operator work-packet DTO omits runtime-private and positive authority fields", () => {
  const strippedSource = stripAllowedNoFlags(dtoSource);

  for (const forbiddenField of forbiddenRuntimePrivateFields) {
    assert.equal(
      strippedSource.includes(forbiddenField),
      false,
      `${forbiddenField} must be absent`
    );
  }

  for (const forbiddenAuthority of [
    "provider dispatch",
    "tool invocation",
    "channel dispatch",
    "publishing authority",
    "payment",
    "customer outreach",
    "autonomous external action",
    "training authority",
    "automatic mutation",
  ]) {
    assert.equal(
      strippedSource.toLowerCase().includes(forbiddenAuthority),
      false,
      `${forbiddenAuthority} must only appear as a no_* boundary`
    );
  }
});

test("[runtime] operator work-packet DTO remains product-neutral and does not implement full substrates", () => {
  for (const forbiddenTerm of forbiddenProductTerms) {
    assert.equal(dtoSource.includes(forbiddenTerm), false, forbiddenTerm);
  }

  for (const forbiddenTerm of forbiddenFullImplementationTerms) {
    assert.equal(dtoSource.includes(forbiddenTerm), false, forbiddenTerm);
  }
});

test("[runtime] operator work-packet DTO has private package exports only", () => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  assert.equal(packageJson.private, true);
  assert.equal(
    packageJson.exports["./runtime/public/operator-work-packet-handoff-dto"],
    "./runtime/public/operator-work-packet-handoff-dto.ts"
  );
  assert.equal(Object.hasOwn(packageJson, "main"), false);
  assert.equal(Object.hasOwn(packageJson, "types"), false);
  assert.equal(Object.hasOwn(packageJson, "files"), false);
  assert.equal(Object.hasOwn(packageJson, "publishConfig"), false);
});
