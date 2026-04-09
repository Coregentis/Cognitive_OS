import type { RuntimeObjectRecord } from "./runtime-types";

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
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  create_decision_record(
    request: CreateDecisionRecordRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;
}
