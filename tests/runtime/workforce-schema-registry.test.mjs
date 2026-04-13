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
  load_registry_document,
  load_relationship_rules_document,
} from "../../runtime/core/frozen-truth-loader.ts";

const repoRoot = process.cwd();

const workforceTypes = [
  "agent-group",
  "agent-worker",
  "role-profile",
  "objective",
  "work-item",
  "review-cycle",
  "memory-profile",
  "preference-profile",
];

const baseSchemaPaths = [
  "schemas/coregentis/v0/base/cognitive-object-envelope.schema.json",
  "schemas/coregentis/v0/base/temporal-record.schema.json",
  "schemas/coregentis/v0/base/mutation-record.schema.json",
  "schemas/coregentis/v0/base/lineage-record.schema.json",
  "schemas/coregentis/v0/base/governance-record.schema.json",
];

const workforceSchemaPaths = workforceTypes.map(
  (objectType) =>
    `schemas/coregentis/v0/workforce/${objectType}.schema.json`
);

function loadSchema(relativePath) {
  return load_json_document(join(repoRoot, relativePath));
}

test("[workforce] schema family compiles and stays product-neutral", () => {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateSchema: true,
  });
  addFormats(ajv);

  for (const relativePath of baseSchemaPaths) {
    ajv.addSchema(loadSchema(relativePath));
  }

  for (const relativePath of workforceSchemaPaths) {
    const schema = loadSchema(relativePath);
    const fileContents = readFileSync(join(repoRoot, relativePath), "utf8");
    const expectedObjectType = relativePath
      .split("/")
      .at(-1)
      ?.replace(".schema.json", "");

    assert.doesNotThrow(() => ajv.compile(schema), relativePath);
    assert.ok(expectedObjectType);
    assert.match(
      fileContents,
      new RegExp(`"const": "${expectedObjectType}"`, "u")
    );
    assert.ok(!/SoloCrew|CrewMember|Crew\b/u.test(fileContents));
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

  assert.equal(registryDocument.objects.length, 25);

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
