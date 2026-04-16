import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import Ajv from "ajv";
import addFormats from "ajv-formats";

import {
  load_binding_matrix_document,
  load_export_rules_document,
  load_json_document,
  load_runtime_private_management_binding_entries,
  load_runtime_private_management_registry_entries,
  load_registry_schema_document,
  load_registry_document,
  load_relationship_rules_document,
} from "../../runtime/core/frozen-truth-loader.ts";

const repoRoot = process.cwd();

const runtimePrivateManagementTypes = [
  "management-directive-record",
  "delivery-return-record",
  "approval-request-record",
];

const workforceTypes = [
  "agent-group",
  "agent-worker",
  "role-profile",
  "objective",
  "work-item",
  "review-cycle",
  "memory-profile",
  "preference-profile",
  "cell-runtime-scope",
  "cell-summary-runtime-record",
  "management-directive-record",
  "delivery-return-record",
  "approval-request-record",
];

const baseSchemaPaths = [
  "schemas/coregentis/v0/base/cognitive-object-envelope.schema.json",
  "schemas/coregentis/v0/base/temporal-record.schema.json",
  "schemas/coregentis/v0/base/mutation-record.schema.json",
  "schemas/coregentis/v0/base/lineage-record.schema.json",
  "schemas/coregentis/v0/base/governance-record.schema.json",
];

function loadSchema(relativePath) {
  return load_json_document(join(repoRoot, relativePath));
}

test("[workforce] schema family compiles and stays product-neutral", () => {
  const registryDocument = load_registry_document(repoRoot);
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateSchema: true,
  });
  addFormats(ajv);

  for (const relativePath of baseSchemaPaths) {
    ajv.addSchema(loadSchema(relativePath));
  }

  for (const objectType of workforceTypes) {
    const registryEntry = registryDocument.objects.find(
      (entry) => entry.object_type === objectType
    );

    assert.ok(registryEntry, `registry missing schema ref for ${objectType}`);

    const relativePath = registryEntry.schema_ref.replace(/^\//u, "");
    const schema = load_registry_schema_document(repoRoot, registryEntry.schema_ref);
    const fileContents = readFileSync(join(repoRoot, relativePath), "utf8");

    assert.doesNotThrow(() => ajv.compile(schema), relativePath);
    assert.match(
      fileContents,
      new RegExp(`"const": "${objectType}"`, "u")
    );
    assert.ok(!/SoloCrew|Secretary|Portfolio UI|CrewMember|Crew\b/u.test(fileContents));
  }
});

test("[workforce] registry, binding, export, and runtime types cover all workforce objects", () => {
  const registryDocument = load_registry_document(repoRoot);
  const bindingDocument = load_binding_matrix_document(repoRoot);
  const exportDocument = load_export_rules_document(repoRoot);
  const relationshipDocument = load_relationship_rules_document(repoRoot);
  const runtimeTypesSource = readFileSync(
    join(repoRoot, "runtime/core/runtime-types.ts"),
    "utf8"
  );

  const registryTypes = new Set(
    registryDocument.objects.map((entry) => entry.object_type)
  );
  const bindingTypes = new Set(
    bindingDocument.bindings.map((entry) => entry.coregentis_object)
  );
  const exportTypes = new Set(
    exportDocument.export_rules.flatMap((rule) => rule.eligible_object_types)
  );
  const relationshipTypes = new Set(
    relationshipDocument.relationship_rules.map(
      (rule) => rule.relationship_type
    )
  );

  assert.equal(registryDocument.objects.length, 30);

  for (const objectType of workforceTypes) {
    assert.ok(registryTypes.has(objectType), `registry missing ${objectType}`);
    assert.ok(bindingTypes.has(objectType), `binding missing ${objectType}`);
    assert.ok(exportTypes.has(objectType), `export rules missing ${objectType}`);
    assert.match(runtimeTypesSource, new RegExp(`"${objectType}"`, "u"));

    const registryEntry = registryDocument.objects.find(
      (entry) => entry.object_type === objectType
    );

    assert.ok(registryEntry);

    for (const relationshipType of registryEntry.allowed_relationships) {
      assert.ok(
        relationshipTypes.has(relationshipType),
        `${objectType} has unknown relationship ${relationshipType}`
      );
    }
  }
});

test("[workforce] v0.4 runtime-private preconditions stay non-protocol and loadable from frozen truth", () => {
  const registryDocument = load_registry_document(repoRoot);
  const bindingDocument = load_binding_matrix_document(repoRoot);
  const exportDocument = load_export_rules_document(repoRoot);
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateSchema: true,
  });
  addFormats(ajv);

  for (const relativePath of baseSchemaPaths) {
    ajv.addSchema(loadSchema(relativePath));
  }

  const v04RuntimePrivateTypes = [
    "cell-runtime-scope",
    "cell-summary-runtime-record",
    "management-directive-record",
    "delivery-return-record",
    "approval-request-record",
  ];

  for (const objectType of v04RuntimePrivateTypes) {
    const registryEntry = registryDocument.objects.find(
      (entry) => entry.object_type === objectType
    );
    const bindingEntry = bindingDocument.bindings.find(
      (entry) => entry.coregentis_object === objectType
    );
    const exportRule = exportDocument.export_rules.find((rule) =>
      rule.eligible_object_types.includes(objectType)
    );

    assert.ok(registryEntry, `missing registry entry for ${objectType}`);
    assert.ok(bindingEntry, `missing binding entry for ${objectType}`);
    assert.ok(exportRule, `missing export rule for ${objectType}`);

    assert.equal(registryEntry.authority_class, "coregentis_private_runtime");
    assert.equal(registryEntry.protocol_binding_ref_policy, "not_applicable");
    assert.equal(bindingEntry.binding_class, "runtime_private_only");
    assert.equal(bindingEntry.mplp_object, null);
    assert.equal(exportRule.export_class, "runtime_private_non_exportable");
    assert.match(bindingEntry.export_rule, /not directly exportable/u);

    const schema = load_registry_schema_document(
      repoRoot,
      registryEntry.schema_ref
    );

    assert.doesNotThrow(() => ajv.compile(schema), objectType);
    assert.equal(schema.properties.authority_class.const, "coregentis_private_runtime");
    assert.equal(schema.properties.object_type.const, objectType);
  }
});

test("[workforce] management-family trio shares normalized scope fields while retaining role-specific posture", () => {
  const registryDocument = load_registry_document(repoRoot);
  const exportDocument = load_export_rules_document(repoRoot);
  const registryEntries = load_runtime_private_management_registry_entries(repoRoot);
  const bindingEntries = load_runtime_private_management_binding_entries(repoRoot);
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateSchema: true,
  });
  addFormats(ajv);

  for (const relativePath of baseSchemaPaths) {
    ajv.addSchema(loadSchema(relativePath));
  }

  const expectedKinds = {
    "management-directive-record": "directive",
    "delivery-return-record": "delivery_return",
    "approval-request-record": "approval_request",
  };

  const expectedStatusEnums = {
    "management-directive-record": ["draft", "active", "superseded", "closed"],
    "delivery-return-record": [
      "in_progress",
      "ready_for_review",
      "blocked",
      "returned",
      "archived",
    ],
    "approval-request-record": [
      "pending",
      "resolved",
      "withdrawn",
      "archived",
    ],
  };

  const roleSpecificFields = {
    "management-directive-record": [
      "directive_summary",
      "directive_priority",
      "approval_posture",
    ],
    "delivery-return-record": [
      "completed_summary",
      "blocked_summary",
      "next_directive_needed",
    ],
    "approval-request-record": [
      "request_kind",
      "request_summary",
      "requested_decision",
    ],
  };

  assert.deepEqual(
    registryEntries.map((entry) => entry.object_type).sort(),
    [...runtimePrivateManagementTypes].sort()
  );
  assert.deepEqual(
    bindingEntries.map((entry) => entry.coregentis_object).sort(),
    [...runtimePrivateManagementTypes].sort()
  );

  for (const objectType of runtimePrivateManagementTypes) {
    const registryEntry = registryDocument.objects.find(
      (entry) => entry.object_type === objectType
    );
    const bindingEntry = bindingEntries.find(
      (entry) => entry.coregentis_object === objectType
    );
    const exportRule = exportDocument.export_rules.find((rule) =>
      rule.eligible_object_types.includes(objectType)
    );

    assert.ok(registryEntry, `missing registry entry for ${objectType}`);
    assert.ok(bindingEntry, `missing binding entry for ${objectType}`);
    assert.ok(exportRule, `missing export rule for ${objectType}`);

    const schema = load_registry_schema_document(
      repoRoot,
      registryEntry.schema_ref
    );

    assert.doesNotThrow(() => ajv.compile(schema), objectType);
    assert.equal(schema.properties.authority_class.const, "coregentis_private_runtime");
    assert.equal(schema.properties.primary_layer.const, "organization_runtime_layer");
    assert.ok(schema.properties.project_id, `${objectType} missing project_id`);
    assert.ok(
      schema.properties.cell_runtime_scope_id,
      `${objectType} missing cell_runtime_scope_id`
    );
    assert.ok(schema.properties.objective_id, `${objectType} missing objective_id`);
    assert.equal(
      schema.properties.management_record_kind.const,
      expectedKinds[objectType]
    );
    assert.ok(
      schema.required.includes("management_record_kind"),
      `${objectType} missing required management_record_kind`
    );
    assert.deepEqual(
      schema.properties.status.enum,
      expectedStatusEnums[objectType]
    );

    for (const fieldName of roleSpecificFields[objectType]) {
      assert.ok(
        schema.properties[fieldName],
        `${objectType} missing role-specific field ${fieldName}`
      );
    }

    assert.equal(registryEntry.authority_class, "coregentis_private_runtime");
    assert.equal(bindingEntry.binding_class, "runtime_private_only");
    assert.equal(exportRule.export_class, "runtime_private_non_exportable");
    assert.match(registryEntry.notes, /management-family/u);
    assert.match(bindingEntry.compatibility_notes, /Management-family/u);
  }
});
