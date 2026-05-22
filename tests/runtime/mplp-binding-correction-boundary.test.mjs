import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const correctionRecordPath =
  "governance/audits/CGOS-MPLP-BINDING-CORRECTION-PATCH-v0.1.md";
const operatorWorkPacketRecordPath =
  "governance/audits/CGOS-OPERATOR-WORK-PACKET-MPLP-BOUND-PROJECTION-CONTRACT-IMPLEMENTATION-v0.1.md";
const memoryContinuityReviewRecordPath =
  "governance/audits/CGOS-PERSONAL-MVP-PUBLIC-MEMORY-CONTINUITY-CONTRACT-v0.1.md";

const allowedLifecycleFamilies = new Set([
  "Context",
  "Plan",
  "Confirm",
  "Trace",
  "Role",
  "Collab",
  "Core",
  "Extension",
  "Network",
]);

const allowedMplpModules = new Set([
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

const requiredDocumentControlFlags = [
  "no_schema_change",
  "no_protocol_law_change",
  "no_normative_binding_change",
  "no_runtime_behavior_change",
  "no_provider_execution",
  "no_downstream_app_implementation",
  "no_package_publication",
  "existing_mplp_semantics_sufficient",
];

const forbiddenPositiveClaimPatterns = [
  /\bcertified\b/iu,
  /\bendorsed\b/iu,
  /\bregulator-approved\b/iu,
  /\bofficial compliance claim\b/iu,
  /\bformal assurance claim\b/iu,
  /\bschema-level conformance\b/iu,
  /\bprotocol law changed\b/iu,
  /\bnormative binding changed\b/iu,
];

const forbiddenProductPatterns = [
  /\bSoloCrew\b/u,
  /\bfounder\b/iu,
  /\bsecretary\b/iu,
  /\bOPC\b/u,
  /\bone-person company\b/iu,
  /\bcompany dashboard\b/iu,
  /\bmission room\b/iu,
  /\bDev Pack\b/u,
  /\bMedia Pack\b/u,
  /\bcell\b/iu,
];

const runtimePrivateLeakPatterns = [
  /\braw_prompt\b/u,
  /\braw_trace\b/u,
  /\bprovider_response\b/u,
  /\bmodel_response\b/u,
  /\bsqlite_handle\b/u,
  /\bstore_constructor\b/u,
  /\bservice_instance\b/u,
  /\bmutable_handle\b/u,
  /\bworker_private_state\b/u,
  /\bruntime_private_record_payload\b/u,
  /\braw_runtime_private_payload\b/u,
];

const allowedNoRuntimePrivateFlags = [
  "no_sqlite_handle_exposure",
  "no_store_adapter_exposure",
  "no_constructor_exposure",
  "no_service_instance_exposure",
  "no_mutable_state_exposure",
  "runtime_private_payload_omitted",
];

const positiveAuthorityPatterns = [
  /\bprovider_dispatch\s*:\s*true\b/u,
  /\bchannel_dispatch\s*:\s*true\b/u,
  /\btool_invocation\s*:\s*true\b/u,
  /\bpayment\b/iu,
  /\bpublishing\b/iu,
  /\bcustomer outreach\b/iu,
];

const allowedNoAuthorityFlags = [
  "no_provider_dispatch",
  "no_channel_dispatch",
  "no_tool_invocation",
  "no_payment",
  "no_publishing",
  "no_customer_outreach",
  "no_autonomous_external_action",
  "no_training_authority",
  "no_automatic_mutation",
  "no_automatic_writeback_authority",
  "no_public_publishing",
  "no_package_publish",
];

function readSource(filePath) {
  return readFileSync(filePath, "utf8");
}

function readPackageJson() {
  return JSON.parse(readSource("package.json"));
}

function normalizeRepoPath(filePath) {
  return filePath.replace(/^\.\//u, "");
}

function extractBindingMap() {
  const source = readSource(correctionRecordPath);
  const match = source.match(
    /<!-- CGOS_MPLP_BINDING_MAP_START -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- CGOS_MPLP_BINDING_MAP_END -->/u
  );

  assert.ok(match, "binding map block should exist");

  return JSON.parse(match[1]);
}

function extractOperatorWorkPacketBindingMap() {
  const source = readSource(operatorWorkPacketRecordPath);
  const match = source.match(
    /<!-- CGOS_OPERATOR_WORK_PACKET_BINDING_MAP_START -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- CGOS_OPERATOR_WORK_PACKET_BINDING_MAP_END -->/u
  );

  assert.ok(match, "operator work-packet binding map block should exist");

  return JSON.parse(match[1]);
}

function extractMemoryContinuityReviewBindingMap() {
  const source = readSource(memoryContinuityReviewRecordPath);
  const match = source.match(
    /<!-- CGOS_MEMORY_CONTINUITY_REVIEW_BINDING_MAP_START -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- CGOS_MEMORY_CONTINUITY_REVIEW_BINDING_MAP_END -->/u
  );

  assert.ok(match, "memory continuity review binding map block should exist");

  return JSON.parse(match[1]);
}

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      return listFiles(path);
    }

    return [path];
  });
}

function stripAllowedNoFlags(source, allowedFlags) {
  return allowedFlags.reduce(
    (stripped, flag) => stripped.replaceAll(flag, ""),
    source
  );
}

test("[runtime] MPLP binding correction record exists and preserves no-change flags", () => {
  assert.equal(existsSync(correctionRecordPath), true);

  const bindingMap = extractBindingMap();

  assert.equal(
    bindingMap.document_control.task_id,
    "CGOS-MPLP-BINDING-CORRECTION-PATCH"
  );
  assert.equal(
    bindingMap.document_control.authority_order,
    "MPLP -> Cognitive_OS -> downstream products"
  );
  assert.equal(bindingMap.document_control.mplp_protocol_modified, false);

  for (const flag of requiredDocumentControlFlags) {
    assert.equal(
      bindingMap.document_control[flag],
      true,
      `document control flag ${flag} should be true`
    );
  }
});

test("[runtime] every package-exported public surface has a binding mapping", () => {
  const packageJson = readPackageJson();
  const bindingMap = extractBindingMap();
  const operatorWorkPacketBindingMap = extractOperatorWorkPacketBindingMap();
  const memoryContinuityReviewBindingMap =
    extractMemoryContinuityReviewBindingMap();

  const runtimePublicExports = Object.keys(packageJson.exports).filter(
    (exportKey) => exportKey.startsWith("./runtime/public/")
  );
  const allBindingEntries = [
    ...bindingMap.public_surface_bindings,
    ...operatorWorkPacketBindingMap.public_surface_bindings,
    ...memoryContinuityReviewBindingMap.public_surface_bindings,
  ];
  const mappedExports = allBindingEntries.map((entry) => entry.package_export);

  assert.deepEqual(
    [...mappedExports].sort(),
    [...runtimePublicExports].sort()
  );

  for (const entry of allBindingEntries) {
    assert.equal(
      normalizeRepoPath(packageJson.exports[entry.package_export]),
      normalizeRepoPath(entry.file_path)
    );
    assert.equal(existsSync(entry.file_path), true, entry.file_path);
    assert.equal(entry.candidate_followup_needed, false);
    assert.equal(entry.correction_status, "mapped");
    assert.ok(entry.components.length > 0, `${entry.package_export} components`);
  }
});

test("[runtime] binding mappings use only allowed MPLP lifecycle families", () => {
  const bindingMap = extractBindingMap();
  const operatorWorkPacketBindingMap = extractOperatorWorkPacketBindingMap();
  const memoryContinuityReviewBindingMap =
    extractMemoryContinuityReviewBindingMap();
  const allBindingEntries = [
    ...bindingMap.public_surface_bindings,
    ...operatorWorkPacketBindingMap.public_surface_bindings,
    ...memoryContinuityReviewBindingMap.public_surface_bindings,
  ];

  assert.deepEqual(
    new Set(bindingMap.allowed_lifecycle_families),
    allowedLifecycleFamilies
  );
  assert.deepEqual(
    new Set(operatorWorkPacketBindingMap.allowed_lifecycle_families),
    allowedMplpModules
  );
  assert.deepEqual(
    new Set(memoryContinuityReviewBindingMap.allowed_lifecycle_families),
    allowedMplpModules
  );

  for (const entry of allBindingEntries) {
    for (const family of entry.surface_families) {
      assert.equal(
        allowedMplpModules.has(family),
        true,
        `${entry.package_export} uses unsupported family ${family}`
      );
    }

    for (const component of entry.components) {
      assert.ok(component.families.length > 0, component.name);

      for (const family of component.families) {
        assert.equal(
          allowedMplpModules.has(family),
          true,
          `${entry.package_export}.${component.name} uses unsupported family ${family}`
        );
      }
    }
  }
});

test("[runtime] binding entries avoid product terms and positive assurance claims", () => {
  const bindingMap = extractBindingMap();
  const operatorWorkPacketBindingMap = extractOperatorWorkPacketBindingMap();
  const memoryContinuityReviewBindingMap =
    extractMemoryContinuityReviewBindingMap();
  const mappingEntriesText = JSON.stringify([
    ...bindingMap.public_surface_bindings,
    ...operatorWorkPacketBindingMap.public_surface_bindings,
    ...memoryContinuityReviewBindingMap.public_surface_bindings,
  ]);
  const fullMapText = JSON.stringify([
    bindingMap,
    operatorWorkPacketBindingMap,
    memoryContinuityReviewBindingMap,
  ]);

  for (const pattern of forbiddenProductPatterns) {
    assert.doesNotMatch(mappingEntriesText, pattern, pattern.source);
  }

  for (const pattern of forbiddenPositiveClaimPatterns) {
    assert.doesNotMatch(fullMapText, pattern, pattern.source);
  }
});

test("[runtime] runtime/public remains product-neutral and free of legacy private naming", () => {
  const publicText = listFiles("runtime/public")
    .map((filePath) => readSource(filePath))
    .join("\n");
  const legacyPrivateTerms = [
    String.fromCharCode(99, 101, 108, 108, 45, 114, 117, 110, 116, 105, 109, 101, 45, 115, 99, 111, 112, 101),
    String.fromCharCode(99, 101, 108, 108, 45, 115, 117, 109, 109, 97, 114, 121, 45, 114, 117, 110, 116, 105, 109, 101, 45, 114, 101, 99, 111, 114, 100),
    String.fromCharCode(99, 101, 108, 108, 95, 114, 117, 110, 116, 105, 109, 101, 95, 115, 99, 111, 112, 101),
    String.fromCharCode(99, 101, 108, 108, 95, 115, 117, 109, 109, 97, 114, 121, 95, 114, 117, 110, 116, 105, 109, 101, 95, 114, 101, 99, 111, 114, 100),
  ];

  for (const pattern of forbiddenProductPatterns) {
    assert.doesNotMatch(publicText, pattern, pattern.source);
  }

  for (const term of legacyPrivateTerms) {
    assert.equal(publicText.includes(term), false, term);
  }
});

test("[runtime] runtime/public still omits runtime-private payload and authority fields", () => {
  const strippedPublicText = stripAllowedNoFlags(
    stripAllowedNoFlags(
      listFiles("runtime/public")
        .map((filePath) => readSource(filePath))
        .join("\n"),
      allowedNoRuntimePrivateFlags
    ),
    allowedNoAuthorityFlags
  );

  for (const pattern of runtimePrivateLeakPatterns) {
    assert.doesNotMatch(strippedPublicText, pattern, pattern.source);
  }

  for (const pattern of positiveAuthorityPatterns) {
    assert.doesNotMatch(strippedPublicText, pattern, pattern.source);
  }
});

test("[runtime] binding correction record remains historical and delegates new work-packet mapping to implementation record", () => {
  const historicalSource = readSource(correctionRecordPath);
  const operatorWorkPacketBindingMap = extractOperatorWorkPacketBindingMap();
  const memoryContinuityReviewBindingMap =
    extractMemoryContinuityReviewBindingMap();
  const mappedExports = operatorWorkPacketBindingMap.public_surface_bindings.map(
    (entry) => entry.package_export
  );
  const memoryMappedExports =
    memoryContinuityReviewBindingMap.public_surface_bindings.map(
      (entry) => entry.package_export
    );

  assert.match(
    historicalSource,
    /No operator work-packet contract was introduced\./u
  );
  assert.deepEqual(mappedExports.sort(), [
    "./runtime/public/operator-work-packet-handoff-bundle",
    "./runtime/public/operator-work-packet-handoff-dto",
  ]);
  assert.deepEqual(memoryMappedExports.sort(), [
    "./runtime/public/memory-continuity-review-dto",
  ]);
});
