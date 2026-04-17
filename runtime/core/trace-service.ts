import type { RuntimeObjectRecord } from "./runtime-types";
import type { BindingService } from "./binding-service";
import type { RegistryService } from "./registry-service";
import { DeterministicExecutionFactory } from "./execution-support.ts";

export interface CreateTraceEvidenceRequest {
  project_id: string;
  evidence_kind: string;
  evidence_summary: string;
  subject_object_refs: string[];
}

export interface CreateDecisionRecordRequest {
  project_id: string;
  decision_type: string;
  decision_summary: string;
  outcome: string;
  subject_object_refs: string[];
}

export interface TraceService {
  create_trace_evidence(
    request: CreateTraceEvidenceRequest
  ): RuntimeObjectRecord;

  create_decision_record(
    request: CreateDecisionRecordRequest
  ): RuntimeObjectRecord;
}

export class DeterministicTraceService implements TraceService {
  private readonly registry_service: RegistryService;
  private readonly binding_service: BindingService;
  private readonly factory: DeterministicExecutionFactory;
  private readonly scenario_id: string;

  constructor(args: {
    registry_service: RegistryService;
    binding_service: BindingService;
    factory: DeterministicExecutionFactory;
    scenario_id: string;
  }) {
    this.registry_service = args.registry_service;
    this.binding_service = args.binding_service;
    this.factory = args.factory;
    this.scenario_id = args.scenario_id;
  }

  create_trace_evidence(
    request: CreateTraceEvidenceRequest
  ): RuntimeObjectRecord {
    const entry = this.registry_service.get_object_definition("trace-evidence");
    const binding = this.binding_service.get_binding("trace-evidence");
    if (!entry || !binding) {
      throw new Error("Missing frozen truth for trace-evidence");
    }

    return this.factory.create_object({
      registry_entry: entry,
      project_id: request.project_id,
      status: "captured",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      protocol_binding: binding,
      lineage_overrides: {
        source_object_ids: request.subject_object_refs,
      },
      extra: {
        evidence_kind: request.evidence_kind,
        evidence_summary: request.evidence_summary,
        subject_object_refs: request.subject_object_refs,
      },
    });
  }

  create_decision_record(
    request: CreateDecisionRecordRequest
  ): RuntimeObjectRecord {
    const entry = this.registry_service.get_object_definition("decision-record");
    if (!entry) {
      throw new Error("Missing frozen truth for decision-record");
    }

    return this.factory.create_object({
      registry_entry: entry,
      project_id: request.project_id,
      status: "recorded",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      lineage_overrides: {
        source_object_ids: request.subject_object_refs,
      },
      extra: {
        decision_type: request.decision_type,
        decision_summary: request.decision_summary,
        outcome: request.outcome,
        subject_object_refs: request.subject_object_refs,
      },
    });
  }
}
