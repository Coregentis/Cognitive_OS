import type {
  BindingClass,
  BindingMatrixEntryRecord,
  CoregentisObjectType,
  ExportClass,
  ExportRuleRecord,
  RuntimeObjectRecord,
} from "./runtime-types.ts";

export type ProjectionBindingPostureRef = {
  source_object_ref: string;
  coregentis_object_ref: CoregentisObjectType;
  protocol_object_ref: string | null;
  semantic_binding_posture: BindingClass | "unresolved";
  exportability: {
    export_class: ExportClass | "runtime_private_non_exportable";
    export_allowed: boolean;
    reconstruction_expectation: string;
  };
  safe_summary: string;
  omission_markers: string[];
  protocol_binding_ref_present: boolean;
  runtime_private_fields_omitted: true;
};

export type BuildProjectionBindingPostureRefInput = {
  object_record: RuntimeObjectRecord;
  binding?: BindingMatrixEntryRecord;
  export_rule?: ExportRuleRecord;
};

export function build_projection_binding_posture_ref(
  input: BuildProjectionBindingPostureRefInput
): ProjectionBindingPostureRef {
  const export_class = input.export_rule?.export_class ?? "runtime_private_non_exportable";
  const export_allowed = export_class === "protocol_compliant_export";
  const omission_markers = [
    "raw_runtime_private_payload_omitted",
    export_allowed ? "export_conditions_required" : "direct_protocol_export_not_allowed",
  ];

  if (!input.binding) {
    omission_markers.push("binding_entry_not_found");
  }

  if (!input.export_rule) {
    omission_markers.push("export_rule_not_found");
  }

  return {
    source_object_ref: input.object_record.object_id,
    coregentis_object_ref: input.object_record.object_type,
    protocol_object_ref: input.binding?.mplp_object ?? null,
    semantic_binding_posture: input.binding?.binding_class ?? "unresolved",
    exportability: {
      export_class,
      export_allowed,
      reconstruction_expectation:
        input.export_rule?.reconstruction_expectation ?? "not_applicable",
    },
    safe_summary: export_allowed
      ? "Object can contribute to a governed protocol-compliant export when all conditions are met."
      : "Object is not directly exportable as a protocol artifact in this posture.",
    omission_markers,
    protocol_binding_ref_present: Boolean(input.object_record.protocol_binding_ref),
    runtime_private_fields_omitted: true,
  };
}

export function summarize_binding_posture_collection(
  refs: ProjectionBindingPostureRef[]
): {
  object_count: number;
  exportable_count: number;
  non_exportable_count: number;
  omission_markers: string[];
} {
  const omission_markers = new Set<string>();
  let exportable_count = 0;

  for (const ref of refs) {
    if (ref.exportability.export_allowed) {
      exportable_count += 1;
    }

    for (const marker of ref.omission_markers) {
      omission_markers.add(marker);
    }
  }

  return {
    object_count: refs.length,
    exportable_count,
    non_exportable_count: refs.length - exportable_count,
    omission_markers: [...omission_markers].sort(),
  };
}
