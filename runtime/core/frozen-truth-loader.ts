import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type {
  BindingMatrixEntryRecord,
  ExportRuleRecord,
  RegistryEntryRecord,
  RuntimeRelationshipType,
} from "./runtime-types.ts";
import { runtimePrivateManagementObjectTypes } from "./runtime-types.ts";

interface RegistryDocument {
  objects: RegistryEntryRecord[];
}

interface RelationshipRulesDocument {
  relationship_rules: Array<{
    relationship_type: RuntimeRelationshipType;
    allowed_source_families: string[];
    allowed_target_families: string[];
    description: string;
    notes: string;
  }>;
}

interface BindingMatrixDocument {
  bindings: BindingMatrixEntryRecord[];
}

interface ExportRulesDocument {
  export_rules: ExportRuleRecord[];
}

export interface ImportLockDocument {
  lock_id: string;
  protocol_version: string;
  schema_bundle_version: string;
  source_reference_type: string;
  source_reference_value: string;
  required_protocol_artifacts: {
    module_schemas: string[];
  };
}

function load_yaml_document<T>(path: string): T {
  const ruby = [
    "require 'yaml'",
    "require 'json'",
    "data = YAML.load_file(ARGV[0])",
    "puts JSON.generate(data)",
  ].join(";");

  const output = execFileSync("ruby", ["-e", ruby, path], {
    encoding: "utf8",
  });

  return JSON.parse(output) as T;
}

export function load_json_document<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function load_registry_schema_document<T>(
  repo_root: string,
  schema_ref: string
): T {
  return load_json_document<T>(
    join(repo_root, schema_ref.replace(/^\/+/, ""))
  );
}

export function load_registry_document(
  repo_root: string
): RegistryDocument {
  return load_yaml_document<RegistryDocument>(
    join(repo_root, "registry", "coregentis-object-registry.v0.yaml")
  );
}

export function load_relationship_rules_document(
  repo_root: string
): RelationshipRulesDocument {
  return load_yaml_document<RelationshipRulesDocument>(
    join(repo_root, "registry", "coregentis-relationship-rules.v0.yaml")
  );
}

export function load_binding_matrix_document(
  repo_root: string
): BindingMatrixDocument {
  return load_yaml_document<BindingMatrixDocument>(
    join(repo_root, "bindings", "mplp-coregentis-binding-matrix.v0.yaml")
  );
}

export function load_runtime_private_management_registry_entries(
  repo_root: string
): RegistryEntryRecord[] {
  return load_registry_document(repo_root).objects.filter((entry) =>
    runtimePrivateManagementObjectTypes.includes(entry.object_type)
  );
}

export function load_runtime_private_management_binding_entries(
  repo_root: string
): BindingMatrixEntryRecord[] {
  return load_binding_matrix_document(repo_root).bindings.filter((entry) =>
    runtimePrivateManagementObjectTypes.includes(entry.coregentis_object)
  );
}

export function load_export_rules_document(
  repo_root: string
): ExportRulesDocument {
  return load_yaml_document<ExportRulesDocument>(
    join(repo_root, "bindings", "coregentis-export-rules.v0.yaml")
  );
}

export function load_import_lock_document(
  repo_root: string
): ImportLockDocument {
  return load_yaml_document<ImportLockDocument>(
    join(repo_root, "imports", "mplp-lock.yaml")
  );
}
