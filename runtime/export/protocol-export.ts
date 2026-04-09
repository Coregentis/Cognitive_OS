import type { BindingService } from "../core/binding-service.ts";
import {
  load_import_lock_document,
  type ImportLockDocument,
} from "../core/frozen-truth-loader.ts";
import type {
  MinimalLoopRunResult,
  ProtocolArtifactType,
  ProtocolArtifactValidationRecord,
  ProtocolExportOmissionRecord,
  ProtocolExportedArtifactRecord,
  RuntimeObjectRecord,
  RuntimeProtocolExportBundle,
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

function create_empty_artifact_index<T>(): Record<ProtocolArtifactType, T[]> {
  return {
    context: [],
    plan: [],
    confirm: [],
    trace: [],
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

function build_context_omission(
  run_result: MinimalLoopRunResult
): ProtocolExportOmissionRecord {
  return {
    artifact_type: "context",
    source_object_ids: run_result.export_preparation?.protocol_relevant_object_ids ?? [],
    omission_code: "artifact_family_not_reconstructable",
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
    reasons: [
      "No confirm-gate runtime object was created in this execution path.",
      "The current scenario did not require explicit confirm semantics under the frozen minimal policy path.",
      "R5 exports Confirm only when confirm semantics actually exist in runtime state.",
    ],
  };
}

function build_export_block_omission(args: {
  artifact_type: ProtocolArtifactType;
  source_object: RuntimeObjectRecord;
  reasons: string[];
}): ProtocolExportOmissionRecord {
  return {
    artifact_type: args.artifact_type,
    source_object_type: args.source_object.object_type,
    source_object_ids: [args.source_object.object_id],
    omission_code: "frozen_truth_blocks_export",
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
    reasons: [
      "The reconstructed artifact did not satisfy the locked MPLP schema validation path.",
      ...args.errors.map(
        (error) => `${error.path}: ${error.message}`
      ),
    ],
  };
}

function build_confirm_artifact(args: {
  confirm_gate: RuntimeObjectRecord;
  created_objects: RuntimeObjectRecord[];
  import_lock: ImportLockDocument;
}): Record<string, unknown> {
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
    reason:
      string_value(args.confirm_gate.confirm_kind) ?? "runtime confirm gate",
  };

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
      decided_at:
        temporal_timestamp(decision_record) ?? requested_at,
    };

    const decision_reason = string_value(decision_record.decision_summary);
    if (decision_reason) {
      decision.reason = decision_reason;
    }

    artifact.decisions = [decision];
  }

  return artifact;
}

function build_trace_artifact(args: {
  trace_evidence: RuntimeObjectRecord;
  created_objects: RuntimeObjectRecord[];
  import_lock: ImportLockDocument;
  project_id: string;
  scenario_id: string;
  planned_steps: string[];
}): Record<string, unknown> {
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

  return artifact;
}

function validate_exported_artifact(args: {
  artifact_type: ProtocolArtifactType;
  source_object: RuntimeObjectRecord;
  artifact: Record<string, unknown>;
  schema_path: string;
}): ProtocolArtifactValidationRecord & { schema_id: string } {
  const { schema_id, errors } = validate_protocol_artifact_against_schema({
    artifact: args.artifact,
    schema_path: args.schema_path,
  });

  return {
    artifact_type: args.artifact_type,
    source_object_id: args.source_object.object_id,
    schema_path: args.schema_path,
    schema_id,
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
    const validation_results: Array<
      ProtocolArtifactValidationRecord & { schema_id: string }
    > = [];
    const created_objects = request.run_result.created_objects;
    const exported_runtime_object_ids: string[] = [];

    omitted_artifacts_by_type.context.push(
      build_context_omission(request.run_result)
    );
    omitted_artifacts_by_type.plan.push(build_plan_omission(request.run_result));

    const confirm_gates = created_objects.filter(
      (record) => record.object_type === "confirm-gate"
    );

    if (confirm_gates.length === 0) {
      omitted_artifacts_by_type.confirm.push(
        build_confirm_absence_omission(request.run_result)
      );
    }

    for (const confirm_gate of confirm_gates) {
      const export_plan = this.binding_service.plan_protocol_export({
        object_record: confirm_gate,
      });

      if (!export_plan.allowed || export_plan.expected_mplp_object === null) {
        omitted_artifacts_by_type.confirm.push(
          build_export_block_omission({
            artifact_type: "confirm",
            source_object: confirm_gate,
            reasons: [
              ...export_plan.notes,
              "Frozen binding/export truth did not permit Confirm export for this runtime object.",
            ],
          })
        );
        continue;
      }

      const artifact = build_confirm_artifact({
        confirm_gate,
        created_objects,
        import_lock: this.import_lock,
      });
      const validation = validate_exported_artifact({
        artifact_type: "confirm",
        source_object: confirm_gate,
        artifact,
        schema_path: this.schema_paths.confirm,
      });

      validation_results.push(validation);
      if (!validation.valid) {
        omitted_artifacts_by_type.confirm.push(
          build_validation_failure_omission({
            artifact_type: "confirm",
            source_object: confirm_gate,
            errors: validation.errors,
          })
        );
        continue;
      }

      exported_runtime_object_ids.push(confirm_gate.object_id);
      exported_artifacts_by_type.confirm.push({
        artifact_type: "confirm",
        source_object_id: confirm_gate.object_id,
        source_object_type: confirm_gate.object_type,
        schema_path: validation.schema_path,
        schema_id: validation.schema_id,
        artifact,
        notes: [
          ...export_plan.notes,
          "Confirm export uses the runtime confirm gate plus indirect decision lineage where available.",
          'Confirm target_type is "other" because the governed target is a runtime action unit rather than a canonical MPLP Context, Plan, or Trace object.',
        ],
      });
    }

    const trace_evidences = created_objects.filter(
      (record) => record.object_type === "trace-evidence"
    );

    for (const trace_evidence of trace_evidences) {
      const export_plan = this.binding_service.plan_protocol_export({
        object_record: trace_evidence,
      });

      if (!export_plan.allowed || export_plan.expected_mplp_object === null) {
        omitted_artifacts_by_type.trace.push(
          build_export_block_omission({
            artifact_type: "trace",
            source_object: trace_evidence,
            reasons: [
              ...export_plan.notes,
              "Frozen binding/export truth did not permit Trace export for this runtime object.",
            ],
          })
        );
        continue;
      }

      const artifact = build_trace_artifact({
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
        artifact,
        schema_path: this.schema_paths.trace,
      });

      validation_results.push(validation);
      if (!validation.valid) {
        omitted_artifacts_by_type.trace.push(
          build_validation_failure_omission({
            artifact_type: "trace",
            source_object: trace_evidence,
            errors: validation.errors,
          })
        );
        continue;
      }

      exported_runtime_object_ids.push(trace_evidence.object_id);
      exported_artifacts_by_type.trace.push({
        artifact_type: "trace",
        source_object_id: trace_evidence.object_id,
        source_object_type: trace_evidence.object_type,
        schema_path: validation.schema_path,
        schema_id: validation.schema_id,
        artifact,
        notes: [
          ...export_plan.notes,
          "Trace export uses trace-evidence lineage plus the bound action-unit execution subject.",
          "Trace context_id reuses the neutral project scope identifier as a host-scope anchor; Context itself remains omitted because no canonical Context artifact is reconstructable in R5.",
        ],
      });
    }

    const deterministic_anchor_timestamp =
      temporal_timestamp(created_objects.at(-1)) ?? "1970-01-01T00:00:00.000Z";

    return {
      export_metadata: {
        bundle_version: "0.1.0",
        scenario_id: request.run_result.scenario_id,
        project_id: request.project_id,
        export_scope: "minimal_mplp_reconstruction",
        deterministic_anchor_timestamp,
        created_object_count: created_objects.length,
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
        artifact_results: validation_results.map((result) => ({
          artifact_type: result.artifact_type,
          source_object_id: result.source_object_id,
          schema_path: result.schema_path,
          valid: result.valid,
          error_count: result.error_count,
          errors: result.errors,
          notes: result.notes,
        })),
        notes: [
          "Validation resolves locked MPLP schema refs used by the exported artifact shape.",
          "The validator covers required fields, object shape, enum, pattern, array, integer, boolean, and date-time constraints needed by the current R5 export surface.",
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
          "Context and Plan stay omitted in R5 because no frozen truth authorizes canonical reconstruction from the current runtime object layer.",
        ],
      },
      notes: [
        "R5 emits only truthful partial reconstruction and explicit omissions.",
        "No product, projection, Pilot, or UI contract is introduced by this bundle.",
      ],
    };
  }
}
