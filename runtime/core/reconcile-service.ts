import type { RuntimeObjectRecord } from "./runtime-types";

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
