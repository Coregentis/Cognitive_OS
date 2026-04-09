import type {
  BindingMatrixEntryRecord,
  CoregentisObjectType,
  ExportClass,
  ExportRuleRecord,
  RuntimeObjectRecord,
} from "./runtime-types";

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
