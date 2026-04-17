import type { RuntimeObjectRecord } from "./runtime-types";
import type { RegistryService } from "./registry-service";
import { DeterministicExecutionFactory } from "./execution-support.ts";

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
  ): RuntimeObjectRecord;

  create_memory_promotion_record(
    request: CreateMemoryPromotionRecordRequest
  ): RuntimeObjectRecord;
}

export class DeterministicConsolidationService
  implements ConsolidationService
{
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

  create_learning_candidate(
    request: CreateLearningCandidateRequest
  ): RuntimeObjectRecord {
    const entry =
      this.registry_service.get_object_definition("learning-candidate");
    if (!entry) {
      throw new Error("Missing frozen truth for learning-candidate");
    }

    return this.factory.create_object({
      registry_entry: entry,
      project_id: request.project_id,
      status: "captured",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      lineage_overrides: {
        source_object_ids: request.source_episode_refs,
      },
      extra: {
        candidate_kind: request.candidate_kind,
        candidate_summary: request.candidate_summary,
        source_episode_refs: request.source_episode_refs,
        source_evidence_refs: request.source_evidence_refs ?? [],
        score_label: "medium",
      },
    });
  }

  create_memory_promotion_record(
    request: CreateMemoryPromotionRecordRequest
  ): RuntimeObjectRecord {
    const entry =
      this.registry_service.get_object_definition(
        "memory-promotion-record"
      );
    if (!entry) {
      throw new Error("Missing frozen truth for memory-promotion-record");
    }

    return this.factory.create_object({
      registry_entry: entry,
      project_id: request.project_id,
      status: "proposed",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "promoted",
      lineage_overrides: {
        source_object_ids: [request.source_object_id],
        promoted_from_object_id: request.source_object_id,
      },
      extra: {
        source_memory_layer: request.source_memory_layer,
        target_memory_layer: request.target_memory_layer,
        source_object_id: request.source_object_id,
        promotion_reason: request.promotion_reason,
        approved_by_ref: request.approved_by_ref ?? "runtime-consolidation-service",
      },
    });
  }
}
