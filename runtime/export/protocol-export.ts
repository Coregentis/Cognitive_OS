import type { BindingService } from "../core/binding-service.ts";
import {
  load_import_lock_document,
  type ImportLockDocument,
} from "../core/frozen-truth-loader.ts";
import type {
  CoregentisObjectType,
  MinimalLoopRunResult,
  ProtocolArtifactType,
  ProtocolArtifactValidationRecord,
  ProtocolExportErrorCode,
  ProtocolExportErrorRecord,
  ProtocolExportOmissionRecord,
  ProtocolExportReasonCode,
  ProtocolExportedArtifactRecord,
  RuntimeObjectRecord,
  RuntimeProtocolExportBundle,
  RuntimeProtocolExportFamilyValidationSummary,
} from "../core/runtime-types";
import {
  resolve_locked_protocol_schema_paths,
  validate_protocol_artifact_against_schema,
} from "./export-support.ts";

const PROTOCOL_ARTIFACT_TYPES = [
  "context",
  "plan",
  "confirm",
  "trace",
] as const satisfies readonly ProtocolArtifactType[];

interface ExportRunRequest {
  project_id: string;
  run_result: MinimalLoopRunResult;
}

interface BuiltArtifactResult {
  artifact: Record<string, unknown>;
  source_runtime_object_refs: string[];
}

function create_empty_artifact_index<T>(): Record<ProtocolArtifactType, T[]> {
  return {
    context: [],
    plan: [],
    confirm: [],
    trace: [],
  };
}

function create_empty_family_validation_summary_index(): Record<
  ProtocolArtifactType,
  RuntimeProtocolExportFamilyValidationSummary
> {
  return {
    context: {
      validated_and_passed_source_object_ids: [],
      omitted_by_truth_source_object_ids: [],
      blocked_by_export_truth_source_object_ids: [],
      invalid_source_object_ids: [],
      export_error_codes: [],
    },
    plan: {
      validated_and_passed_source_object_ids: [],
      omitted_by_truth_source_object_ids: [],
      blocked_by_export_truth_source_object_ids: [],
      invalid_source_object_ids: [],
      export_error_codes: [],
    },
    confirm: {
      validated_and_passed_source_object_ids: [],
      omitted_by_truth_source_object_ids: [],
      blocked_by_export_truth_source_object_ids: [],
      invalid_source_object_ids: [],
      export_error_codes: [],
    },
    trace: {
      validated_and_passed_source_object_ids: [],
      omitted_by_truth_source_object_ids: [],
      blocked_by_export_truth_source_object_ids: [],
      invalid_source_object_ids: [],
      export_error_codes: [],
    },
  };
}

function string_value(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function string_array(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((candidate): candidate is string => typeof candidate === "string")
    : [];
}

function unique_strings(values: string[]): string[] {
  return [...new Set(values)];
}

function temporal_timestamp(
  record: RuntimeObjectRecord | undefined
): string | undefined {
  if (!record || typeof record.temporal !== "object" || !record.temporal) {
    return undefined;
  }

  return string_value((record.temporal as Record<string, unknown>).event_time);
}

function get_object_by_id(
  created_objects: RuntimeObjectRecord[],
  object_id: string | undefined
): RuntimeObjectRecord | undefined {
  if (!object_id) {
    return undefined;
  }

  return created_objects.find((candidate) => candidate.object_id === object_id);
}

function normalize_confirm_status(status: unknown): string | undefined {
  if (
    status === "pending" ||
    status === "approved" ||
    status === "rejected" ||
    status === "cancelled"
  ) {
    return status;
  }

  return undefined;
}

function derive_trace_status(
  action_unit: RuntimeObjectRecord | undefined
): string | undefined {
  if (!action_unit) {
    return "completed";
  }

  if (action_unit.status === "completed") {
    return "completed";
  }
  if (action_unit.status === "in_progress" || action_unit.status === "active") {
    return "running";
  }
  if (action_unit.status === "failed") {
    return "failed";
  }
  if (action_unit.status === "cancelled") {
    return "cancelled";
  }

  return "pending";
}

function build_meta(import_lock: ImportLockDocument): Record<string, unknown> {
  return {
    protocol_version: import_lock.protocol_version,
    schema_version: import_lock.schema_bundle_version,
  };
}

function extract_artifact_id(
  artifact_type: ProtocolArtifactType,
  artifact: Record<string, unknown>,
  fallback_id: string
): string {
  const field_name = {
    context: "context_id",
    plan: "plan_id",
    confirm: "confirm_id",
    trace: "trace_id",
  }[artifact_type];

  return string_value(artifact[field_name]) ?? fallback_id;
}

function append_unique(target: string[], values: string[]): void {
  for (const value of values) {
    if (value && !target.includes(value)) {
      target.push(value);
    }
  }
}

function record_family_disposition(args: {
  family_summary_by_type: Record<
    ProtocolArtifactType,
    RuntimeProtocolExportFamilyValidationSummary
  >;
  artifact_type: ProtocolArtifactType;
  disposition:
    | "validated_and_passed_source_object_ids"
    | "omitted_by_truth_source_object_ids"
    | "blocked_by_export_truth_source_object_ids"
    | "invalid_source_object_ids";
  source_object_ids: string[];
  error_code?: ProtocolExportErrorCode;
}): void {
  const summary = args.family_summary_by_type[args.artifact_type];
  append_unique(summary[args.disposition], args.source_object_ids);
  if (
    args.error_code &&
    !summary.export_error_codes.includes(args.error_code)
  ) {
    summary.export_error_codes.push(args.error_code);
  }
}

function build_context_omission(
  run_result: MinimalLoopRunResult
): ProtocolExportOmissionRecord {
  return {
    artifact_type: "context",
    source_object_ids: run_result.export_preparation?.protocol_relevant_object_ids ?? [],
    omission_code: "artifact_family_not_reconstructable",
    reason_codes: [
      "no_direct_context_binding",
      "context_required_fields_not_reconstructable",
      "project_scope_not_exportable_as_context",
    ],
    reasons: [
      "No frozen binding entry authorizes direct Context reconstruction from the current runtime object set.",
      "The current runtime result does not expose MPLP Context required fields such as root.domain, root.environment, title, and status as frozen protocol truth.",
      "Project scope may host protocol artifacts, but Project is not exported as Context in v0.",
    ],
  };
}

function build_plan_omission(
  run_result: MinimalLoopRunResult
): ProtocolExportOmissionRecord {
  return {
    artifact_type: "plan",
    source_object_ids: run_result.export_preparation?.protocol_relevant_object_ids ?? [],
    omission_code: "artifact_family_not_reconstructable",
    reason_codes: [
      "no_direct_plan_binding",
      "internal_runtime_plan_not_canonical_plan",
      "plan_required_fields_not_reconstructable",
    ],
    reasons: [
      "No frozen binding entry authorizes direct Plan reconstruction from the current runtime object set.",
      "The execution baseline plan is an internal loop plan and is not treated as a canonical MPLP Plan artifact in v0.",
      "Required MPLP Plan fields such as plan title, objective, and protocol-step decomposition are not frozen runtime truth in the current baseline.",
    ],
  };
}

function build_confirm_absence_omission(
  run_result: MinimalLoopRunResult
): ProtocolExportOmissionRecord {
  return {
    artifact_type: "confirm",
    source_object_ids: [],
    omission_code: "confirm_semantics_not_present",
    reason_codes: [
      "no_confirm_gate_runtime_object",
      "scenario_confirm_not_required",
    ],
    reasons: [
      "No confirm-gate runtime object was created in this execution path.",
      "The current scenario did not require explicit confirm semantics under the frozen minimal policy path.",
      "R6 exports Confirm only when confirm semantics actually exist in runtime state.",
    ],
  };
}

function build_export_block_omission(args: {
  artifact_type: ProtocolArtifactType;
  source_object: RuntimeObjectRecord;
  reason_codes: ProtocolExportReasonCode[];
  reasons: string[];
}): ProtocolExportOmissionRecord {
  return {
    artifact_type: args.artifact_type,
    source_object_type: args.source_object.object_type,
    source_object_ids: [args.source_object.object_id],
    omission_code: "frozen_truth_blocks_export",
    reason_codes: args.reason_codes,
    reasons: args.reasons,
  };
}

function build_validation_failure_omission(args: {
  artifact_type: ProtocolArtifactType;
  source_object: RuntimeObjectRecord;
  errors: ProtocolArtifactValidationRecord["errors"];
}): ProtocolExportOmissionRecord {
  return {
    artifact_type: args.artifact_type,
    source_object_type: args.source_object.object_type,
    source_object_ids: [args.source_object.object_id],
    omission_code: "validation_failed",
    reason_codes: ["schema_validation_failed"],
    reasons: [
      "The reconstructed artifact did not satisfy the locked MPLP schema validation path.",
      ...args.errors.map((error) => `${error.path}: ${error.message}`),
    ],
  };
}

function build_export_error(args: {
  artifact_type: ProtocolArtifactType;
  source_object?: RuntimeObjectRecord;
  error_code: ProtocolExportErrorCode;
  reason_codes: ProtocolExportReasonCode[];
  message: string;
  notes: string[];
}): ProtocolExportErrorRecord {
  return {
    artifact_type: args.artifact_type,
    source_object_id: args.source_object?.object_id,
    source_object_type: args.source_object?.object_type,
    error_code: args.error_code,
    reason_codes: args.reason_codes,
    message: args.message,
    notes: args.notes,
  };
}

function build_confirm_artifact(args: {
  confirm_gate: RuntimeObjectRecord;
  created_objects: RuntimeObjectRecord[];
  import_lock: ImportLockDocument;
}): BuiltArtifactResult {
  const confirm_status = normalize_confirm_status(args.confirm_gate.status);
  const target_id =
    string_value(args.confirm_gate.target_object_id) ??
    string_array(args.confirm_gate.lineage?.source_object_ids)[0] ??
    args.confirm_gate.object_id;
  const requested_by_role =
    string_value(args.confirm_gate.requested_by_ref) ?? "runtime-policy-service";
  const requested_at =
    temporal_timestamp(args.confirm_gate) ?? "1970-01-01T00:00:00.000Z";
  const artifact: Record<string, unknown> = {
    meta: build_meta(args.import_lock),
    confirm_id: args.confirm_gate.object_id,
    target_type: "other",
    target_id,
    status: confirm_status,
    requested_by_role,
    requested_at,
    reason: string_value(args.confirm_gate.confirm_kind) ?? "runtime confirm gate",
  };
  const source_runtime_object_refs = unique_strings(
    string_array(args.confirm_gate.lineage?.source_object_ids)
  );

  const decision_record = args.created_objects.find((candidate) => {
    if (candidate.object_type !== "decision-record") {
      return false;
    }

    const subject_refs = string_array(candidate.subject_object_refs);
    return subject_refs.includes(target_id);
  });

  const decision_status = normalize_confirm_status(args.confirm_gate.status);
  if (decision_record && decision_status && decision_status !== "pending") {
    const decision: Record<string, unknown> = {
      decision_id: decision_record.object_id,
      status: decision_status,
      decided_by_role: requested_by_role,
      decided_at: temporal_timestamp(decision_record) ?? requested_at,
    };

    const decision_reason = string_value(decision_record.decision_summary);
    if (decision_reason) {
      decision.reason = decision_reason;
    }

    artifact.decisions = [decision];
    append_unique(source_runtime_object_refs, [decision_record.object_id]);
  }

  return {
    artifact,
    source_runtime_object_refs,
  };
}

function build_trace_artifact(args: {
  trace_evidence: RuntimeObjectRecord;
  created_objects: RuntimeObjectRecord[];
  import_lock: ImportLockDocument;
  project_id: string;
  scenario_id: string;
  planned_steps: string[];
}): BuiltArtifactResult {
  const source_object_ids = string_array(args.trace_evidence.subject_object_refs);
  const action_unit = source_object_ids
    .map((object_id) => get_object_by_id(args.created_objects, object_id))
    .find((candidate) => candidate?.object_type === "action-unit");
  const confirm_gate = source_object_ids
    .map((object_id) => get_object_by_id(args.created_objects, object_id))
    .find((candidate) => candidate?.object_type === "confirm-gate");
  const trace_status = derive_trace_status(action_unit);
  const context_id = args.project_id;
  const root_span_attributes: Record<string, unknown> = {
    scenario_id: args.scenario_id,
    evidence_kind:
      string_value(args.trace_evidence.evidence_kind) ?? "execution",
    source_object_ids,
    step_count: args.planned_steps.length,
  };

  if (confirm_gate?.object_id) {
    root_span_attributes.confirm_gate_id = confirm_gate.object_id;
  }

  const artifact: Record<string, unknown> = {
    meta: build_meta(args.import_lock),
    trace_id: args.trace_evidence.object_id,
    context_id,
    root_span: {
      trace_id: args.trace_evidence.object_id,
      span_id: action_unit?.object_id ?? args.trace_evidence.object_id,
      context_id,
      attributes: root_span_attributes,
    },
    status: trace_status,
  };

  const started_at =
    temporal_timestamp(action_unit) ?? temporal_timestamp(args.trace_evidence);
  if (started_at) {
    artifact.started_at = started_at;
  }

  return {
    artifact,
    source_runtime_object_refs: unique_strings(source_object_ids),
  };
}

function validate_exported_artifact(args: {
  artifact_type: ProtocolArtifactType;
  source_object: RuntimeObjectRecord;
  artifact: Record<string, unknown>;
  source_runtime_object_refs: string[];
  schema_path: string;
}): ProtocolArtifactValidationRecord {
  const { schema_id, errors } = validate_protocol_artifact_against_schema({
    artifact: args.artifact,
    schema_path: args.schema_path,
  });
  const artifact_id = extract_artifact_id(
    args.artifact_type,
    args.artifact,
    args.source_object.object_id
  );

  return {
    artifact_type: args.artifact_type,
    artifact_id,
    source_object_id: args.source_object.object_id,
    source_runtime_object_refs: args.source_runtime_object_refs,
    schema_path: args.schema_path,
    schema_id,
    disposition: errors.length === 0 ? "validated_and_passed" : "invalid",
    valid: errors.length === 0,
    error_count: errors.length,
    errors,
    notes: [
      "Validated against the locked MPLP schema path with the minimal schema-truth validator.",
    ],
  };
}

export class FrozenProtocolExportService {
  private readonly binding_service: BindingService;
  private readonly import_lock: ImportLockDocument;
  private readonly schema_paths: Record<ProtocolArtifactType, string>;

  constructor(args: {
    binding_service: BindingService;
    import_lock: ImportLockDocument;
    schema_paths: Record<ProtocolArtifactType, string>;
  }) {
    this.binding_service = args.binding_service;
    this.import_lock = args.import_lock;
    this.schema_paths = args.schema_paths;
  }

  static from_repo_root(
    repo_root: string,
    binding_service: BindingService
  ): FrozenProtocolExportService {
    return new FrozenProtocolExportService({
      binding_service,
      import_lock: load_import_lock_document(repo_root),
      schema_paths: resolve_locked_protocol_schema_paths(repo_root),
    });
  }

  export_run(request: ExportRunRequest): RuntimeProtocolExportBundle {
    if (request.run_result.status !== "executed") {
      throw new Error("Protocol export requires an executed runtime result.");
    }

    const exported_artifacts_by_type =
      create_empty_artifact_index<ProtocolExportedArtifactRecord>();
    const omitted_artifacts_by_type =
      create_empty_artifact_index<ProtocolExportOmissionRecord>();
    const family_validation_summary_by_type =
      create_empty_family_validation_summary_index();
    const validation_results: ProtocolArtifactValidationRecord[] = [];
    const export_errors: ProtocolExportErrorRecord[] = [];
    const created_objects = request.run_result.created_objects;
    const exported_runtime_object_ids: string[] = [];
    const runtime_source_object_refs_by_artifact_id: Record<string, string[]> = {};

    const record_omission = (
      omission: ProtocolExportOmissionRecord
    ): void => {
      omitted_artifacts_by_type[omission.artifact_type].push(omission);

      const disposition =
        omission.omission_code === "artifact_family_not_reconstructable" ||
        omission.omission_code === "confirm_semantics_not_present"
          ? "omitted_by_truth_source_object_ids"
          : "blocked_by_export_truth_source_object_ids";

      record_family_disposition({
        family_summary_by_type: family_validation_summary_by_type,
        artifact_type: omission.artifact_type,
        disposition:
          omission.omission_code === "validation_failed"
            ? "invalid_source_object_ids"
            : disposition,
        source_object_ids: omission.source_object_ids,
      });
    };

    const record_export_error = (error: ProtocolExportErrorRecord): void => {
      export_errors.push(error);
      record_family_disposition({
        family_summary_by_type: family_validation_summary_by_type,
        artifact_type: error.artifact_type,
        disposition: "blocked_by_export_truth_source_object_ids",
        source_object_ids: error.source_object_id ? [error.source_object_id] : [],
        error_code: error.error_code,
      });
    };

    record_omission(build_context_omission(request.run_result));
    record_omission(build_plan_omission(request.run_result));

    const confirm_gates = created_objects.filter(
      (record) => record.object_type === "confirm-gate"
    );

    if (confirm_gates.length === 0) {
      record_omission(build_confirm_absence_omission(request.run_result));
    }

    for (const confirm_gate of confirm_gates) {
      const binding = this.binding_service.get_binding("confirm-gate");
      const rule = this.binding_service.get_export_rule("confirm-gate");
      const export_plan = this.binding_service.plan_protocol_export({
        object_record: confirm_gate,
      });
      const schema_path = this.schema_paths.confirm;

      if (!binding) {
        record_omission(
          build_export_block_omission({
            artifact_type: "confirm",
            source_object: confirm_gate,
            reason_codes: ["missing_binding_truth"],
            reasons: [
              "The frozen binding entry required for Confirm export is missing.",
            ],
          })
        );
        record_export_error(
          build_export_error({
            artifact_type: "confirm",
            source_object: confirm_gate,
            error_code: "missing_required_binding_truth",
            reason_codes: ["missing_binding_truth"],
            message: "Missing frozen binding truth for confirm export.",
            notes: [
              "Confirm is a protocol-compliant export family in the current baseline only when frozen binding truth is present.",
            ],
          })
        );
        continue;
      }

      if (!rule) {
        record_omission(
          build_export_block_omission({
            artifact_type: "confirm",
            source_object: confirm_gate,
            reason_codes: ["missing_export_rule_truth"],
            reasons: [
              "The frozen export rule required for Confirm export is missing.",
            ],
          })
        );
        record_export_error(
          build_export_error({
            artifact_type: "confirm",
            source_object: confirm_gate,
            error_code: "missing_required_export_rule_truth",
            reason_codes: ["missing_export_rule_truth"],
            message: "Missing frozen export-rule truth for confirm export.",
            notes: [
              "Confirm export cannot proceed without the frozen export-rule classification.",
            ],
          })
        );
        continue;
      }

      if (!schema_path) {
        record_omission(
          build_export_block_omission({
            artifact_type: "confirm",
            source_object: confirm_gate,
            reason_codes: ["missing_locked_schema_path"],
            reasons: [
              "The locked MPLP Confirm schema path is unavailable for export validation.",
            ],
          })
        );
        record_export_error(
          build_export_error({
            artifact_type: "confirm",
            source_object: confirm_gate,
            error_code: "missing_locked_schema_truth",
            reason_codes: ["missing_locked_schema_path"],
            message: "Missing locked MPLP Confirm schema path.",
            notes: [
              "Export validation remains bound to the import lock schema paths in the current baseline.",
            ],
          })
        );
        continue;
      }

      if (!export_plan.allowed) {
        record_omission(
          build_export_block_omission({
            artifact_type: "confirm",
            source_object: confirm_gate,
            reason_codes: ["protocol_export_not_allowed"],
            reasons: [
              ...export_plan.notes,
              "Frozen export truth does not currently allow this Confirm export.",
            ],
          })
        );
        continue;
      }

      if (!binding.mplp_object || export_plan.expected_mplp_object === null) {
        record_omission(
          build_export_block_omission({
            artifact_type: "confirm",
            source_object: confirm_gate,
            reason_codes: ["missing_expected_mplp_object"],
            reasons: [
              "The Confirm binding does not expose the required MPLP object reference for canonical export.",
            ],
          })
        );
        record_export_error(
          build_export_error({
            artifact_type: "confirm",
            source_object: confirm_gate,
            error_code: "missing_required_binding_truth",
            reason_codes: ["missing_expected_mplp_object"],
            message: "Confirm export is missing its expected MPLP object binding.",
            notes: [
              "Shallow reconstruction depends on a protocol object reference in the frozen binding entry.",
            ],
          })
        );
        continue;
      }

      const built = build_confirm_artifact({
        confirm_gate,
        created_objects,
        import_lock: this.import_lock,
      });
      const validation = validate_exported_artifact({
        artifact_type: "confirm",
        source_object: confirm_gate,
        artifact: built.artifact,
        source_runtime_object_refs: built.source_runtime_object_refs,
        schema_path,
      });
      validation_results.push(validation);

      if (!validation.valid) {
        record_omission(
          build_validation_failure_omission({
            artifact_type: "confirm",
            source_object: confirm_gate,
            errors: validation.errors,
          })
        );
        export_errors.push(
          build_export_error({
            artifact_type: "confirm",
            source_object: confirm_gate,
            error_code: "artifact_validation_failed",
            reason_codes: ["schema_validation_failed"],
            message: "Confirm export failed locked-schema validation.",
            notes: validation.errors.map(
              (error) => `${error.path}: ${error.message}`
            ),
          })
        );
        record_family_disposition({
          family_summary_by_type: family_validation_summary_by_type,
          artifact_type: "confirm",
          disposition: "invalid_source_object_ids",
          source_object_ids: [confirm_gate.object_id],
          error_code: "artifact_validation_failed",
        });
        continue;
      }

      const artifact_id = validation.artifact_id;
      exported_runtime_object_ids.push(confirm_gate.object_id);
      runtime_source_object_refs_by_artifact_id[artifact_id] =
        built.source_runtime_object_refs;
      exported_artifacts_by_type.confirm.push({
        artifact_type: "confirm",
        artifact_id,
        source_object_id: confirm_gate.object_id,
        source_object_type: confirm_gate.object_type,
        source_runtime_object_refs: built.source_runtime_object_refs,
        schema_path: validation.schema_path,
        schema_id: validation.schema_id,
        artifact: built.artifact,
        notes: [
          ...export_plan.notes,
          "Confirm export uses the runtime confirm gate plus indirect decision lineage where available.",
          'Confirm target_type is "other" because the governed target is a runtime action unit rather than a canonical MPLP Context, Plan, or Trace object.',
        ],
      });
      record_family_disposition({
        family_summary_by_type: family_validation_summary_by_type,
        artifact_type: "confirm",
        disposition: "validated_and_passed_source_object_ids",
        source_object_ids: [confirm_gate.object_id],
      });
    }

    const trace_evidences = created_objects.filter(
      (record) => record.object_type === "trace-evidence"
    );

    for (const trace_evidence of trace_evidences) {
      const binding = this.binding_service.get_binding("trace-evidence");
      const rule = this.binding_service.get_export_rule("trace-evidence");
      const export_plan = this.binding_service.plan_protocol_export({
        object_record: trace_evidence,
      });
      const schema_path = this.schema_paths.trace;

      if (!binding) {
        record_omission(
          build_export_block_omission({
            artifact_type: "trace",
            source_object: trace_evidence,
            reason_codes: ["missing_binding_truth"],
            reasons: [
              "The frozen binding entry required for Trace export is missing.",
            ],
          })
        );
        record_export_error(
          build_export_error({
            artifact_type: "trace",
            source_object: trace_evidence,
            error_code: "missing_required_binding_truth",
            reason_codes: ["missing_binding_truth"],
            message: "Missing frozen binding truth for trace export.",
            notes: [
              "Trace is a protocol-compliant export family in the current baseline only when frozen binding truth is present.",
            ],
          })
        );
        continue;
      }

      if (!rule) {
        record_omission(
          build_export_block_omission({
            artifact_type: "trace",
            source_object: trace_evidence,
            reason_codes: ["missing_export_rule_truth"],
            reasons: [
              "The frozen export rule required for Trace export is missing.",
            ],
          })
        );
        record_export_error(
          build_export_error({
            artifact_type: "trace",
            source_object: trace_evidence,
            error_code: "missing_required_export_rule_truth",
            reason_codes: ["missing_export_rule_truth"],
            message: "Missing frozen export-rule truth for trace export.",
            notes: [
              "Trace export cannot proceed without the frozen export-rule classification.",
            ],
          })
        );
        continue;
      }

      if (!schema_path) {
        record_omission(
          build_export_block_omission({
            artifact_type: "trace",
            source_object: trace_evidence,
            reason_codes: ["missing_locked_schema_path"],
            reasons: [
              "The locked MPLP Trace schema path is unavailable for export validation.",
            ],
          })
        );
        record_export_error(
          build_export_error({
            artifact_type: "trace",
            source_object: trace_evidence,
            error_code: "missing_locked_schema_truth",
            reason_codes: ["missing_locked_schema_path"],
            message: "Missing locked MPLP Trace schema path.",
            notes: [
              "Export validation remains bound to the import lock schema paths in the current baseline.",
            ],
          })
        );
        continue;
      }

      if (!export_plan.allowed) {
        record_omission(
          build_export_block_omission({
            artifact_type: "trace",
            source_object: trace_evidence,
            reason_codes: ["protocol_export_not_allowed"],
            reasons: [
              ...export_plan.notes,
              "Frozen export truth does not currently allow this Trace export.",
            ],
          })
        );
        continue;
      }

      if (!binding.mplp_object || export_plan.expected_mplp_object === null) {
        record_omission(
          build_export_block_omission({
            artifact_type: "trace",
            source_object: trace_evidence,
            reason_codes: ["missing_expected_mplp_object"],
            reasons: [
              "The Trace binding does not expose the required MPLP object reference for canonical export.",
            ],
          })
        );
        record_export_error(
          build_export_error({
            artifact_type: "trace",
            source_object: trace_evidence,
            error_code: "missing_required_binding_truth",
            reason_codes: ["missing_expected_mplp_object"],
            message: "Trace export is missing its expected MPLP object binding.",
            notes: [
              "Shallow reconstruction depends on a protocol object reference in the frozen binding entry.",
            ],
          })
        );
        continue;
      }

      const built = build_trace_artifact({
        trace_evidence,
        created_objects,
        import_lock: this.import_lock,
        project_id: request.project_id,
        scenario_id: request.run_result.scenario_id,
        planned_steps: request.run_result.planned_steps,
      });
      const validation = validate_exported_artifact({
        artifact_type: "trace",
        source_object: trace_evidence,
        artifact: built.artifact,
        source_runtime_object_refs: built.source_runtime_object_refs,
        schema_path,
      });
      validation_results.push(validation);

      if (!validation.valid) {
        record_omission(
          build_validation_failure_omission({
            artifact_type: "trace",
            source_object: trace_evidence,
            errors: validation.errors,
          })
        );
        export_errors.push(
          build_export_error({
            artifact_type: "trace",
            source_object: trace_evidence,
            error_code: "artifact_validation_failed",
            reason_codes: ["schema_validation_failed"],
            message: "Trace export failed locked-schema validation.",
            notes: validation.errors.map(
              (error) => `${error.path}: ${error.message}`
            ),
          })
        );
        record_family_disposition({
          family_summary_by_type: family_validation_summary_by_type,
          artifact_type: "trace",
          disposition: "invalid_source_object_ids",
          source_object_ids: [trace_evidence.object_id],
          error_code: "artifact_validation_failed",
        });
        continue;
      }

      const artifact_id = validation.artifact_id;
      exported_runtime_object_ids.push(trace_evidence.object_id);
      runtime_source_object_refs_by_artifact_id[artifact_id] =
        built.source_runtime_object_refs;
      exported_artifacts_by_type.trace.push({
        artifact_type: "trace",
        artifact_id,
        source_object_id: trace_evidence.object_id,
        source_object_type: trace_evidence.object_type,
        source_runtime_object_refs: built.source_runtime_object_refs,
        schema_path: validation.schema_path,
        schema_id: validation.schema_id,
        artifact: built.artifact,
        notes: [
          ...export_plan.notes,
          "Trace export uses trace-evidence lineage plus the bound action-unit execution subject.",
          "Trace context_id reuses the neutral project scope identifier as a host-scope anchor; Context itself remains omitted because no canonical Context artifact is reconstructable in R6.",
        ],
      });
      record_family_disposition({
        family_summary_by_type: family_validation_summary_by_type,
        artifact_type: "trace",
        disposition: "validated_and_passed_source_object_ids",
        source_object_ids: [trace_evidence.object_id],
      });
    }

    const deterministic_anchor_timestamp =
      temporal_timestamp(created_objects.at(-1)) ?? "1970-01-01T00:00:00.000Z";

    const exported_artifact_ids_by_type = {
      context: exported_artifacts_by_type.context.map((record) => record.artifact_id),
      plan: exported_artifacts_by_type.plan.map((record) => record.artifact_id),
      confirm: exported_artifacts_by_type.confirm.map((record) => record.artifact_id),
      trace: exported_artifacts_by_type.trace.map((record) => record.artifact_id),
    };

    const exported_source_object_ids_by_type = {
      context: exported_artifacts_by_type.context.map(
        (record) => record.source_object_id
      ),
      plan: exported_artifacts_by_type.plan.map((record) => record.source_object_id),
      confirm: exported_artifacts_by_type.confirm.map(
        (record) => record.source_object_id
      ),
      trace: exported_artifacts_by_type.trace.map((record) => record.source_object_id),
    };

    const omitted_targets_by_type = {
      context: omitted_artifacts_by_type.context.map((record) => ({
        source_object_ids: record.source_object_ids,
        omission_code: record.omission_code,
        reason_codes: record.reason_codes,
      })),
      plan: omitted_artifacts_by_type.plan.map((record) => ({
        source_object_ids: record.source_object_ids,
        omission_code: record.omission_code,
        reason_codes: record.reason_codes,
      })),
      confirm: omitted_artifacts_by_type.confirm.map((record) => ({
        source_object_ids: record.source_object_ids,
        omission_code: record.omission_code,
        reason_codes: record.reason_codes,
      })),
      trace: omitted_artifacts_by_type.trace.map((record) => ({
        source_object_ids: record.source_object_ids,
        omission_code: record.omission_code,
        reason_codes: record.reason_codes,
      })),
    };

    const export_error_codes = unique_strings(
      export_errors.map((error) => error.error_code)
    ) as ProtocolExportErrorCode[];

    return {
      export_metadata: {
        bundle_version: "0.1.0",
        scenario_id: request.run_result.scenario_id,
        project_id: request.project_id,
        export_scope: "minimal_mplp_reconstruction",
        deterministic_anchor_timestamp,
        created_object_count: created_objects.length,
      },
      export_manifest: {
        manifest_version: "0.1.0",
        bundle_status:
          export_errors.length > 0 ? "complete_with_errors" : "complete_with_omissions",
        exported_artifact_ids_by_type,
        exported_source_object_ids_by_type,
        runtime_source_object_refs_by_artifact_id,
        omitted_targets_by_type,
        family_validation_disposition_by_type: family_validation_summary_by_type,
        export_error_codes,
        frozen_truth_sources_consulted: {
          import_lock_id: this.import_lock.lock_id,
          locked_schema_paths: this.schema_paths,
          binding_object_types_consulted:
            request.run_result.truth_consultation?.binding_object_types ?? [],
          export_rule_object_types_consulted:
            request.run_result.truth_consultation?.export_rule_object_types ?? [],
        },
        notes: [
          "The export manifest is a deterministic audit surface over the current bounded export layer.",
          "Unsupported families remain present here as explicit omissions rather than silent absences.",
        ],
      },
      export_summary: {
        exported_artifact_counts_by_type: {
          context: exported_artifacts_by_type.context.length,
          plan: exported_artifacts_by_type.plan.length,
          confirm: exported_artifacts_by_type.confirm.length,
          trace: exported_artifacts_by_type.trace.length,
        },
        omitted_artifact_counts_by_type: {
          context: omitted_artifacts_by_type.context.length,
          plan: omitted_artifacts_by_type.plan.length,
          confirm: omitted_artifacts_by_type.confirm.length,
          trace: omitted_artifacts_by_type.trace.length,
        },
        protocol_relevant_runtime_object_ids:
          request.run_result.export_preparation?.protocol_relevant_object_ids ?? [],
        exported_runtime_object_ids,
        notes: [
          "Export summary is derived from the executed runtime result plus frozen binding/export truth.",
          "Only schema-valid reconstructed artifacts are included in exported_artifacts_by_type.",
          export_errors.length > 0
            ? "At least one export family encountered a bounded error surface."
            : "No bounded export errors were encountered in this run.",
        ],
      },
      exported_artifacts_by_type,
      omitted_artifacts_by_type,
      export_validation_summary: {
        validation_mode: "locked_schema_truth_minimal",
        validated_artifact_count: validation_results.length,
        valid_artifact_count: validation_results.filter((result) => result.valid)
          .length,
        invalid_artifact_count: validation_results.filter((result) => !result.valid)
          .length,
        artifact_results: validation_results,
        family_disposition_by_type: family_validation_summary_by_type,
        notes: [
          "Validation resolves locked MPLP schema refs used by the exported artifact shape.",
          "The validator covers required fields, object shape, enum, pattern, array, integer, boolean, and date-time constraints needed by the current R6 export surface.",
          "Family disposition distinguishes validated-and-passed, omitted-by-truth, blocked-by-export-truth, and invalid export paths.",
        ],
      },
      export_truth_summary: {
        import_lock_id: this.import_lock.lock_id,
        protocol_version: this.import_lock.protocol_version,
        schema_bundle_version: this.import_lock.schema_bundle_version,
        source_reference_type: this.import_lock.source_reference_type,
        source_reference_value: this.import_lock.source_reference_value,
        locked_schema_paths: this.schema_paths,
        binding_object_types_consulted:
          request.run_result.truth_consultation?.binding_object_types ?? [],
        export_rule_object_types_consulted:
          request.run_result.truth_consultation?.export_rule_object_types ?? [],
        notes: [
          "Locked MPLP schema paths were resolved from imports/mplp-lock.yaml.",
          "Artifact export remained constrained by the frozen Coregentis binding matrix and export rules.",
          "Context and Plan stay omitted in R6 because no frozen truth authorizes canonical reconstruction from the current runtime object layer.",
        ],
      },
      export_errors,
      notes: [
        "R6 emits a deterministic export manifest, explicit omissions, and bounded export errors over the current minimal export layer.",
        "No product, projection, Pilot, or UI contract is introduced by this bundle.",
      ],
    };
  }
}
