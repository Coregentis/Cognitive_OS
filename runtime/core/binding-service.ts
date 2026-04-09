import type {
  BindingMatrixEntryRecord,
  CoregentisObjectType,
  ExportClass,
  ExportRuleRecord,
  RuntimeObjectRecord,
} from "./runtime-types";
import {
  load_binding_matrix_document,
  load_export_rules_document,
} from "./frozen-truth-loader.ts";

export interface ProtocolImportRequest {
  source_artifact: Record<string, unknown>;
  declared_mplp_object: string | null;
}

export interface ProtocolImportPlan {
  accepted: boolean;
  target_coregentis_object?: CoregentisObjectType;
  notes: string[];
}

export interface ProtocolExportRequest {
  object_record: RuntimeObjectRecord;
}

export interface ProtocolExportPlan {
  export_class: ExportClass;
  allowed: boolean;
  expected_mplp_object: string | null;
  notes: string[];
}

export interface BindingService {
  get_binding(
    object_type: CoregentisObjectType
  ):
    | Promise<BindingMatrixEntryRecord | undefined>
    | BindingMatrixEntryRecord
    | undefined;

  get_export_rule(
    object_type: CoregentisObjectType
  ): Promise<ExportRuleRecord | undefined> | ExportRuleRecord | undefined;

  plan_protocol_import(
    request: ProtocolImportRequest
  ): Promise<ProtocolImportPlan> | ProtocolImportPlan;

  plan_protocol_export(
    request: ProtocolExportRequest
  ): Promise<ProtocolExportPlan> | ProtocolExportPlan;
}

export class FrozenBindingService implements BindingService {
  private readonly binding_map = new Map<
    CoregentisObjectType,
    BindingMatrixEntryRecord
  >();
  private readonly export_rule_map = new Map<
    CoregentisObjectType,
    ExportRuleRecord
  >();

  constructor(
    bindings: BindingMatrixEntryRecord[],
    export_rules: ExportRuleRecord[]
  ) {
    for (const binding of bindings) {
      this.binding_map.set(binding.coregentis_object, binding);
    }

    for (const rule of export_rules) {
      for (const object_type of rule.eligible_object_types) {
        this.export_rule_map.set(object_type, rule);
      }
    }
  }

  static from_repo_root(repo_root: string): FrozenBindingService {
    const binding_doc = load_binding_matrix_document(repo_root);
    const export_doc = load_export_rules_document(repo_root);
    return new FrozenBindingService(binding_doc.bindings, export_doc.export_rules);
  }

  get_binding(
    object_type: CoregentisObjectType
  ): BindingMatrixEntryRecord | undefined {
    return this.binding_map.get(object_type);
  }

  get_export_rule(
    object_type: CoregentisObjectType
  ): ExportRuleRecord | undefined {
    return this.export_rule_map.get(object_type);
  }

  plan_protocol_import(
    request: ProtocolImportRequest
  ): ProtocolImportPlan {
    if (!request.declared_mplp_object) {
      return {
        accepted: true,
        notes: [
          "No explicit MPLP object declared.",
          "Treating input as neutral runtime ingress for the execution baseline.",
        ],
      };
    }

    const binding = [...this.binding_map.values()].find(
      (candidate) => candidate.mplp_object === request.declared_mplp_object
    );

    return {
      accepted: Boolean(binding),
      target_coregentis_object: binding?.coregentis_object,
      notes: binding
        ? ["Binding match found in frozen binding matrix."]
        : ["No frozen binding match found for declared MPLP object."],
    };
  }

  plan_protocol_export(
    request: ProtocolExportRequest
  ): ProtocolExportPlan {
    const binding = this.get_binding(request.object_record.object_type);
    const rule = this.get_export_rule(request.object_record.object_type);

    return {
      export_class: rule?.export_class ?? "runtime_private_non_exportable",
      allowed: rule?.export_class === "protocol_compliant_export",
      expected_mplp_object: binding?.mplp_object ?? null,
      notes: [
        rule
          ? "Export classification resolved from frozen export rules."
          : "No export rule found; treated as non-exportable.",
      ],
    };
  }
}
