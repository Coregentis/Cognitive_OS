import type {
  RuntimeObjectRecord,
  RuntimeReconciliationOutcome,
} from "./runtime-types";
import type { RegistryService } from "./registry-service";
import { DeterministicExecutionFactory } from "./execution-support.ts";

export interface CreateDriftRecordRequest {
  project_id: string;
  drift_kind: string;
  drift_summary: string;
  severity: string;
  observed_object_refs: string[];
  baseline_object_refs?: string[];
}

export interface CreateConflictCaseRequest {
  project_id: string;
  conflict_kind: string;
  conflict_summary: string;
  object_refs: string[];
  proposed_resolution?: string;
}

export interface ReconciliationAssessment {
  outcome: RuntimeReconciliationOutcome;
  can_continue: boolean;
  notes: string[];
}

export interface ReconcileService {
  create_drift_record(
    request: CreateDriftRecordRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  create_conflict_case(
    request: CreateConflictCaseRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  assess_reconciliation(
    input: RuntimeObjectRecord[]
  ): Promise<ReconciliationAssessment> | ReconciliationAssessment;
}

export class DeterministicReconcileService implements ReconcileService {
  private readonly registry_service: RegistryService;
  private readonly factory: DeterministicExecutionFactory;
  private readonly scenario_id: string;

  constructor(args: {
    registry_service: RegistryService;
    factory: DeterministicExecutionFactory;
    scenario_id: string;
  }) {
    this.registry_service = args.registry_service;
    this.factory = args.factory;
    this.scenario_id = args.scenario_id;
  }

  create_drift_record(
    request: CreateDriftRecordRequest
  ): RuntimeObjectRecord {
    const entry = this.registry_service.get_object_definition("drift-record");
    if (!entry) {
      throw new Error("Missing frozen truth for drift-record");
    }

    return this.factory.create_object({
      registry_entry: entry,
      project_id: request.project_id,
      status: "detected",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      lineage_overrides: {
        source_object_ids: request.observed_object_refs,
      },
      extra: {
        drift_kind: request.drift_kind,
        drift_summary: request.drift_summary,
        severity: request.severity,
        baseline_object_refs: request.baseline_object_refs ?? [],
        observed_object_refs: request.observed_object_refs,
      },
    });
  }

  create_conflict_case(
    request: CreateConflictCaseRequest
  ): RuntimeObjectRecord {
    const entry = this.registry_service.get_object_definition("conflict-case");
    if (!entry) {
      throw new Error("Missing frozen truth for conflict-case");
    }

    return this.factory.create_object({
      registry_entry: entry,
      project_id: request.project_id,
      status: "open",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      lineage_overrides: {
        source_object_ids: request.object_refs,
      },
      extra: {
        conflict_kind: request.conflict_kind,
        conflict_summary: request.conflict_summary,
        object_refs: request.object_refs,
        proposed_resolution:
          request.proposed_resolution ?? "branch",
      },
    });
  }

  assess_reconciliation(
    input: RuntimeObjectRecord[]
  ): ReconciliationAssessment {
    const has_drift = input.some(
      (record) => record.object_type === "drift-record"
    );
    const has_conflict = input.some(
      (record) => record.object_type === "conflict-case"
    );

    if (has_conflict) {
      return {
        outcome: "needs_review",
        can_continue: false,
        notes: [
          "Conflict-case present. Change path now requires bounded review before continue semantics can be claimed.",
        ],
      };
    }

    if (has_drift) {
      return {
        outcome: "can_continue_with_change",
        can_continue: true,
        notes: [
          "Drift detected without conflict-case. Change path can continue with bounded change-handling semantics.",
        ],
      };
    }

    return {
      outcome: "can_continue",
      can_continue: true,
      notes: [
        "No drift or conflict-case present. Continue remains allowed in the execution baseline.",
      ],
    };
  }
}
