import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const handoffPath = resolve(
  repoRoot,
  "governance/handoffs/CGOS-TO-SOLOCREW-OPERATOR-WORK-PACKET-PROJECTION-CONSUMPTION-HANDOFF-v0.1.md"
);

const HANDOFF_MAP_START =
  "<!-- CGOS_OPERATOR_WORK_PACKET_CONSUMPTION_HANDOFF_START -->";
const HANDOFF_MAP_END =
  "<!-- CGOS_OPERATOR_WORK_PACKET_CONSUMPTION_HANDOFF_END -->";

const APPROVED_SOURCE_PATHS = [
  "runtime/public/operator-work-packet-handoff-dto.ts",
  "runtime/public/operator-work-packet-handoff-bundle.ts",
];

const APPROVED_PACKAGE_EXPORTS = [
  "./runtime/public/operator-work-packet-handoff-dto",
  "./runtime/public/operator-work-packet-handoff-bundle",
];

const FORBIDDEN_IMPORT_PATHS = [
  "runtime/core",
  "runtime/state",
  "runtime/in-memory",
  "runtime/private",
];

const FORBIDDEN_PRIVATE_ASSETS = [
  "runtime stores",
  "SQLite handles",
  "provider internals",
  "dispatcher handles",
  "service instances",
  "constructors",
  "mutable handles",
  "worker-private state",
  "raw prompts",
  "raw traces",
  "model responses",
  "provider responses",
];

const REQUIRED_COMPONENT_GUIDANCE = [
  "OperatorIntentSummary",
  "WorkIntakeSummary",
  "WorkPacketSummary",
  "AssignmentSummary",
  "WorkerActivitySummary",
  "ReviewableOutputSummary",
  "AcceptanceStateSummary",
  "OperatorFeedbackSummary",
  "DeliveryArtifactSummary",
  "ContinuityPointer",
  "AdvancedRuntimePosture",
  "KernelDutyPosture",
  "ProjectionSafeEnvelope",
];

const REQUIRED_FUTURE_CONSTRAINTS = [
  "consume_only_public_package_exports",
  "never_use_sealed_legacy_bridge_for_opc_foundation",
  "keep_fake_local_bounded_motion_separate_from_real_execution",
  "label_worker_activity_as_projection_safe_activity_summary",
  "label_advanced_substrates_as_refs_markers_or_omissions",
  "preserve_no_provider_tool_channel_payment_publishing_customer_outreach",
  "preserve_no_training_and_no_automatic_mutation",
  "preserve_mplp_bound_posture_without_changing_mplp",
];

const REQUIRED_FUTURE_TESTS = [
  "import_only_public_cognitive_os_exports",
  "fail_on_runtime_private_imports",
  "fail_if_sealed_legacy_bridge_is_used_in_opc_foundation_path",
  "render_only_allowed_acceptance_states",
  "render_worker_activity_without_provider_execution_claim",
  "render_delivery_artifact_without_publishing_or_export_authority",
  "preserve_no_training_no_automatic_mutation",
  "preserve_kernel_duty_posture_as_status_metadata_not_compliance_claim",
  "preserve_advanced_runtime_refs_as_refs_markers_or_omissions",
];

function loadHandoffText() {
  assert.equal(existsSync(handoffPath), true, "handoff record must exist");
  return readFileSync(handoffPath, "utf8");
}

function extractHandoffMap() {
  const handoffText = loadHandoffText();
  const startIndex = handoffText.indexOf(HANDOFF_MAP_START);
  const endIndex = handoffText.indexOf(HANDOFF_MAP_END);

  assert.notEqual(startIndex, -1, "handoff map start marker must exist");
  assert.notEqual(endIndex, -1, "handoff map end marker must exist");
  assert.ok(endIndex > startIndex, "handoff map end marker must follow start");

  const fencedBlock = handoffText.slice(
    startIndex + HANDOFF_MAP_START.length,
    endIndex
  );
  const jsonMatch = fencedBlock.match(/```json\s*([\s\S]*?)\s*```/u);
  assert.ok(jsonMatch, "handoff map must include a fenced json block");
  return JSON.parse(jsonMatch[1]);
}

test("[runtime] operator work-packet consumption handoff record exists", () => {
  assert.equal(existsSync(handoffPath), true);
});

test("[runtime] operator work-packet handoff approves only the two public exports", () => {
  const handoffMap = extractHandoffMap();

  assert.deepEqual(handoffMap.allowed_source_paths, APPROVED_SOURCE_PATHS);
  assert.deepEqual(handoffMap.allowed_package_exports, APPROVED_PACKAGE_EXPORTS);
});

test("[runtime] operator work-packet handoff forbids runtime-private imports and assets", () => {
  const handoffMap = extractHandoffMap();
  const handoffText = loadHandoffText();

  assert.deepEqual(handoffMap.forbidden_import_paths, FORBIDDEN_IMPORT_PATHS);
  assert.deepEqual(
    handoffMap.forbidden_runtime_private_assets,
    FORBIDDEN_PRIVATE_ASSETS
  );

  for (const forbiddenPath of FORBIDDEN_IMPORT_PATHS) {
    assert.match(handoffText, new RegExp(forbiddenPath.replace("/", "\\/"), "u"));
  }
});

test("[runtime] operator work-packet handoff preserves non-implementation boundaries", () => {
  const handoffMap = extractHandoffMap();
  const documentControl = handoffMap.document_control;

  assert.equal(documentControl.no_runtime_behavior_change, true);
  assert.equal(documentControl.no_solocrew_app_implementation, true);
  assert.equal(documentControl.no_provider_execution, true);
  assert.equal(documentControl.no_worker_execution_bridge, true);
  assert.equal(documentControl.no_mplp_schema_change, true);
  assert.equal(documentControl.no_mplp_protocol_law_change, true);
  assert.equal(documentControl.no_mplp_normative_binding_change, true);
  assert.equal(documentControl.no_package_publication, true);
});

test("[runtime] operator work-packet handoff blocks the sealed legacy bridge for OPC Foundation", () => {
  const handoffMap = extractHandoffMap();

  assert.equal(
    handoffMap.legacy_bridge_rule.sealed_legacy_bridge_allowed_for_opc_foundation,
    false
  );
  assert.equal(
    handoffMap.legacy_bridge_rule.legacy_bridge_is_compliant_consumption_evidence,
    false
  );
  assert.equal(
    handoffMap.legacy_bridge_rule.legacy_bridge_must_remain_legacy_only,
    true
  );
});

test("[runtime] operator work-packet handoff covers every downstream component guidance item", () => {
  const handoffMap = extractHandoffMap();
  const components = handoffMap.field_to_product_surface_guidance.map(
    (entry) => entry.cognitive_os_component
  );

  assert.deepEqual(components, REQUIRED_COMPONENT_GUIDANCE);

  for (const entry of handoffMap.field_to_product_surface_guidance) {
    assert.ok(entry.permitted_solocrew_display);
    assert.ok(entry.prohibited_interpretation);
    assert.ok(entry.required_posture);
  }
});

test("[runtime] operator work-packet handoff pins future SoloCrew constraints and tests", () => {
  const handoffMap = extractHandoffMap();

  assert.deepEqual(
    handoffMap.future_solocrew_constraints,
    REQUIRED_FUTURE_CONSTRAINTS
  );
  assert.deepEqual(handoffMap.future_solocrew_tests, REQUIRED_FUTURE_TESTS);
});

test("[runtime] operator work-packet handoff authorizes the next SoloCrew implementation wave only after handoff readiness", () => {
  const handoffMap = extractHandoffMap();

  assert.equal(handoffMap.handoff_decision, "HANDOFF_READY");
  assert.equal(
    handoffMap.next_allowed_task,
    "SOLOCREW-OPC-FOUNDATION-APP-IMPLEMENTATION"
  );
});
