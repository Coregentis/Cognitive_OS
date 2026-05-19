import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const recordPath =
  "governance/audits/CGOS-OPERATOR-WORK-PACKET-MPLP-BOUND-PROJECTION-CONTRACT-IMPLEMENTATION-v0.1.md";

const allowedModules = new Set([
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

const canonicalDuties = [
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
];

const forbiddenProductTerms = [
  /\bSoloCrew\b/u,
  /\bfounder\b/iu,
  /\bsecretary\b/iu,
  /\bcell\b/iu,
  /\bOPC\b/u,
  /\bone-person company\b/iu,
  /\bcompany dashboard\b/iu,
  /\bmission room\b/iu,
  /\bDev Pack\b/u,
  /\bMedia Pack\b/u,
  /\bOperational V1\b/u,
];

const forbiddenClaimPatterns = [
  /\bcertified\b/iu,
  /\bendorsed\b/iu,
  /\bregulator-approved\b/iu,
  /\bofficial compliance claim\b/iu,
  /\bformal assurance claim\b/iu,
  /\bschema-level conformance claim: true\b/iu,
  /\bprotocol law changed\b/iu,
  /\bnormative binding changed\b/iu,
];

function extractBindingMap() {
  const source = readFileSync(recordPath, "utf8");
  const match = source.match(
    /<!-- CGOS_OPERATOR_WORK_PACKET_BINDING_MAP_START -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- CGOS_OPERATOR_WORK_PACKET_BINDING_MAP_END -->/u
  );

  assert.ok(match, "operator work-packet binding map block must exist");

  return JSON.parse(match[1]);
}

test("[runtime] operator work-packet binding record exists with no MPLP mutation flags", () => {
  assert.equal(existsSync(recordPath), true);
  const bindingMap = extractBindingMap();

  assert.equal(
    bindingMap.document_control.task_id,
    "CGOS-OPERATOR-WORK-PACKET-MPLP-BOUND-PROJECTION-CONTRACT-IMPLEMENTATION-WITH-ADDITIONAL-FIELDS"
  );
  assert.equal(bindingMap.document_control.mplp_protocol_modified, false);
  assert.equal(bindingMap.document_control.no_schema_change, true);
  assert.equal(bindingMap.document_control.no_protocol_law_change, true);
  assert.equal(bindingMap.document_control.no_normative_binding_change, true);
  assert.equal(bindingMap.document_control.existing_mplp_semantics_sufficient, true);
});

test("[runtime] operator work-packet public surfaces are package-exported and mapped", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const bindingMap = extractBindingMap();

  assert.deepEqual(
    bindingMap.public_surface_bindings.map((entry) => entry.package_export).sort(),
    [
      "./runtime/public/operator-work-packet-handoff-bundle",
      "./runtime/public/operator-work-packet-handoff-dto",
    ]
  );

  for (const entry of bindingMap.public_surface_bindings) {
    assert.equal(packageJson.exports[entry.package_export], `./${entry.file_path}`);
    assert.equal(existsSync(entry.file_path), true);
    assert.equal(entry.candidate_followup_needed, false);
    assert.equal(entry.correction_status, "mapped");
    assert.ok(entry.components.length > 0);
  }
});

test("[runtime] operator work-packet binding uses all 10 MPLP modules and valid component mappings", () => {
  const bindingMap = extractBindingMap();

  assert.deepEqual(new Set(bindingMap.allowed_lifecycle_families), allowedModules);

  const dtoBinding = bindingMap.public_surface_bindings.find(
    (entry) => entry.public_surface_name === "operator-work-packet-handoff-dto"
  );

  assert.ok(dtoBinding);
  assert.deepEqual(new Set(dtoBinding.surface_families), allowedModules);

  for (const entry of bindingMap.public_surface_bindings) {
    for (const family of entry.surface_families) {
      assert.equal(allowedModules.has(family), true, family);
    }

    for (const component of entry.components) {
      assert.ok(component.families.length > 0, component.name);
      for (const family of component.families) {
        assert.equal(allowedModules.has(family), true, `${component.name}.${family}`);
      }
    }
  }

  const componentNames = dtoBinding.components.map((component) => component.name);
  for (const expectedComponent of [
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
    "OperatorWorkPacketHandoffEnvelope",
  ]) {
    assert.equal(componentNames.includes(expectedComponent), true, expectedComponent);
  }
});

test("[runtime] operator work-packet advanced substrates are refs/markers only", () => {
  const bindingMap = extractBindingMap();

  for (const [substrate, posture] of Object.entries(
    bindingMap.advanced_substrate_posture
  )) {
    assert.equal(posture.implements_full_runtime, false, substrate);
    assert.equal(posture.carries_projection_safe_refs_or_markers, true, substrate);
    assert.equal(
      posture.uses_omission_markers_for_unavailable_substrate,
      true,
      substrate
    );
    assert.equal(posture.grants_authority, false, substrate);
  }
});

test("[runtime] operator work-packet binding covers canonical kernel duties and allowed posture values", () => {
  const bindingMap = extractBindingMap();

  assert.deepEqual(bindingMap.kernel_duties, canonicalDuties);
  assert.deepEqual(bindingMap.kernel_duty_posture_values, [
    "enforced",
    "projected",
    "evidenced",
    "documented_only",
    "omitted",
    "deferred",
    "not_applicable",
  ]);
});

test("[runtime] operator work-packet binding avoids product leakage and positive claims", () => {
  const bindingMap = extractBindingMap();
  const mappingText = JSON.stringify(bindingMap);

  for (const pattern of forbiddenProductTerms) {
    assert.doesNotMatch(mappingText, pattern, pattern.source);
  }

  for (const pattern of forbiddenClaimPatterns) {
    assert.doesNotMatch(mappingText, pattern, pattern.source);
  }
});
