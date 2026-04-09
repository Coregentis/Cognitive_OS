import type { RuntimeObjectRecord } from "./runtime-types";

export interface CreateLearningCandidateRequest {
  project_id: string;
  candidate_kind: string;
  candidate_summary: string;
  source_episode_refs: string[];
  source_evidence_refs?: string[];
}

export interface CreateMemoryPromotionRecordRequest {
  project_id: string;
  source_memory_layer: string;
  target_memory_layer: string;
  source_object_id: string;
  promotion_reason: string;
  approved_by_ref?: string;
}

export interface ConsolidationService {
  create_learning_candidate(
    request: CreateLearningCandidateRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  create_memory_promotion_record(
    request: CreateMemoryPromotionRecordRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;
}
