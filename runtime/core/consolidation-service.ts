import type {
  RuntimeAelAssessment,
  RuntimeDeltaDriftImpactAssessment,
  RuntimeGovernedLearningAssessment,
  RuntimeObjectRecord,
  RuntimePsgGraphState,
  RuntimeReconciliationSnapshot,
  RuntimeVslContinuityState,
} from "./runtime-types";
import type { RegistryService } from "./registry-service";
import { DeterministicExecutionFactory } from "./execution-support.ts";

export interface CreateLearningCandidateRequest {
  project_id: string;
  candidate_kind: string;
  candidate_summary: string;
  candidate_hint_type?: string;
  source_episode_refs: string[];
  source_object_refs?: string[];
  source_evidence_refs?: string[];
  source_relation_refs?: string[];
  activation_outcome?: string;
  continuity_anchor_ref?: string;
  impacted_object_refs?: string[];
  drift_record_refs?: string[];
  conflict_case_refs?: string[];
  future_protocol_sample_family?: string;
  future_protocol_export_eligibility?: string;
  suggestion_only?: boolean;
  policy_mutation_applied?: boolean;
  semantic_promotion_applied?: boolean;
  linked_promotion_record_refs?: string[];
  score_label?: string;
}

export interface CreateMemoryPromotionRecordRequest {
  project_id: string;
  source_memory_layer: string;
  target_memory_layer: string;
  source_object_id: string;
  promotion_reason: string;
  approved_by_ref?: string;
}

export interface AssessGovernedLearningRequest {
  project_id: string;
  scenario_id: string;
  entry_object: RuntimeObjectRecord;
  working_state: RuntimeObjectRecord;
  episode: RuntimeObjectRecord;
  semantic_fact?: RuntimeObjectRecord;
  action_unit: RuntimeObjectRecord;
  ael_assessment: RuntimeAelAssessment;
  trace_evidence: RuntimeObjectRecord;
  decision_record: RuntimeObjectRecord;
  reconciliation: RuntimeReconciliationSnapshot;
  continuity_state?: RuntimeVslContinuityState;
  graph_state?: RuntimePsgGraphState;
  delta_drift_assessment?: RuntimeDeltaDriftImpactAssessment;
  drift_record?: RuntimeObjectRecord;
  conflict_case?: RuntimeObjectRecord;
}

export interface ConsolidationService {
  assess_governed_learning(
    request: AssessGovernedLearningRequest
  ): RuntimeGovernedLearningAssessment;

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

  private unique_ids(values: unknown[]): string[] {
    return [...new Set(
      values.filter(
        (value): value is string =>
          typeof value === "string" && value.length > 0
      )
    )].sort();
  }

  assess_governed_learning(
    request: AssessGovernedLearningRequest
  ): RuntimeGovernedLearningAssessment {
    const continuity_anchor_ref =
      request.continuity_state?.project_id === request.project_id
        ? request.continuity_state.continuation_anchor.anchor_object_id
        : undefined;
    const impacted_object_refs = this.unique_ids([
      ...(request.delta_drift_assessment?.affected_object_refs ?? []),
      ...(request.reconciliation.affected_object_refs ?? []),
    ]);
    const drift_record_refs = this.unique_ids([
      request.drift_record?.object_id,
    ]);
    const conflict_case_refs = this.unique_ids([
      request.conflict_case?.object_id,
    ]);
    const source_object_refs = this.unique_ids([
      request.entry_object.object_id,
      request.working_state.object_id,
      request.episode.object_id,
      request.semantic_fact?.object_id,
      request.action_unit.object_id,
      ...drift_record_refs,
      ...conflict_case_refs,
      ...impacted_object_refs,
    ]);
    const source_evidence_refs = this.unique_ids([
      request.trace_evidence.object_id,
      request.decision_record.object_id,
      ...(request.delta_drift_assessment?.supporting_evidence_refs ?? []),
    ]);
    const source_relation_refs = this.unique_ids(
      (request.graph_state?.project_id === request.project_id
        ? request.graph_state.relation_edges
        : []
      )
        .filter(
          (edge) =>
            source_object_refs.includes(edge.source_object_id) ||
            source_object_refs.includes(edge.target_object_id) ||
            impacted_object_refs.includes(edge.source_object_id) ||
            impacted_object_refs.includes(edge.target_object_id)
        )
        .map((edge) => edge.relation_id)
    );

    let candidate_kind: RuntimeGovernedLearningAssessment["candidate_kind"];
    let candidate_hint_type: RuntimeGovernedLearningAssessment["candidate_hint_type"];
    let candidate_summary: string;
    let score_label: RuntimeGovernedLearningAssessment["score_label"];
    let future_protocol_sample_family:
      | RuntimeGovernedLearningAssessment["future_protocol_sample_family"]
      | undefined;

    if (
      conflict_case_refs.length > 0 ||
      request.reconciliation.outcome === "needs_review" ||
      request.ael_assessment.outcome === "suppressed" ||
      request.ael_assessment.outcome === "escalate"
    ) {
      candidate_kind = "failure_pattern";
      candidate_hint_type = "failure_pattern_candidate";
      score_label = "high";
      future_protocol_sample_family =
        request.scenario_id === "requirement-change-midflow"
          ? "delta_impact"
          : "pipeline_outcome";
      candidate_summary =
        request.scenario_id === "requirement-change-midflow"
          ? "Bounded failure/tension pattern captured from change assessment for later governed review."
          : "Bounded failure pattern captured from governed activation for later review.";
    } else if (request.scenario_id === "requirement-change-midflow") {
      candidate_kind = "policy_suggestion";
      candidate_hint_type = "policy_suggestion_candidate";
      score_label = "medium";
      future_protocol_sample_family = "delta_impact";
      candidate_summary =
        "Bounded delta-drift and confirm-aware path captured as a policy suggestion candidate without mutating runtime policy.";
    } else if (continuity_anchor_ref) {
      candidate_kind = "reuse_pattern";
      candidate_hint_type = "continuity_pattern_candidate";
      score_label = "medium";
      future_protocol_sample_family = "pipeline_outcome";
      candidate_summary =
        "Bounded successful path captured as a continuity-aware reuse candidate using prior continuation context.";
    } else {
      candidate_kind = "reuse_pattern";
      candidate_hint_type = "reuse_pattern_candidate";
      score_label = "medium";
      future_protocol_sample_family = "intent_resolution";
      candidate_summary =
        "Bounded successful path captured as a reuse candidate for later governed review.";
    }

    return {
      project_id: request.project_id,
      scenario_id: request.scenario_id,
      candidate_kind,
      candidate_hint_type,
      candidate_summary,
      score_label,
      source_episode_refs: [request.episode.object_id],
      source_object_refs,
      source_evidence_refs,
      source_relation_refs,
      activation_outcome: request.ael_assessment.outcome,
      decision_outcome: String(request.decision_record.outcome),
      continuity_anchor_ref,
      impacted_object_refs,
      drift_record_refs,
      conflict_case_refs,
      future_protocol_sample_family,
      future_protocol_export_eligibility:
        future_protocol_sample_family
          ? "derived_only_future_governance"
          : "not_eligible",
      suggestion_only: true,
      policy_mutation_applied: false,
      semantic_promotion_applied: false,
      export_class: "runtime_private_non_exportable",
      notes: [
        "Governed Learning first pass remains runtime-private and suggestion-only.",
        "No automatic MPLP learning-sample export is performed in this wave.",
        "No autonomous policy mutation or semantic promotion is performed in this wave.",
      ],
    };
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
        source_object_ids:
          request.source_object_refs?.length
            ? request.source_object_refs
            : request.source_episode_refs,
      },
      extra: {
        candidate_kind: request.candidate_kind,
        candidate_summary: request.candidate_summary,
        candidate_hint_type: request.candidate_hint_type,
        source_episode_refs: request.source_episode_refs,
        source_object_refs: request.source_object_refs ?? [],
        source_evidence_refs: request.source_evidence_refs ?? [],
        source_relation_refs: request.source_relation_refs ?? [],
        activation_outcome: request.activation_outcome,
        continuity_anchor_ref: request.continuity_anchor_ref,
        impacted_object_refs: request.impacted_object_refs ?? [],
        drift_record_refs: request.drift_record_refs ?? [],
        conflict_case_refs: request.conflict_case_refs ?? [],
        future_protocol_sample_family:
          request.future_protocol_sample_family,
        future_protocol_export_eligibility:
          request.future_protocol_export_eligibility ??
          "derived_only_future_governance",
        suggestion_only: request.suggestion_only ?? true,
        policy_mutation_applied: request.policy_mutation_applied ?? false,
        semantic_promotion_applied:
          request.semantic_promotion_applied ?? false,
        linked_promotion_record_refs:
          request.linked_promotion_record_refs ?? [],
        score_label: request.score_label ?? "medium",
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
