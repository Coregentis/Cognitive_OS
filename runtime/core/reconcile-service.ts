import type {
  RuntimeDeltaDriftImpactAssessment,
  RuntimeObjectRecord,
  RuntimePsgGraphState,
  RuntimeReconciliationOutcome,
  RuntimeVslContinuityState,
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
  affected_object_refs?: string[];
  continuation_anchor_ref?: string;
  impact_summary?: string;
  supporting_evidence_refs?: string[];
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

export interface AssessDeltaDriftImpactRequest {
  project_id: string;
  delta_intent: RuntimeObjectRecord;
  prior_object_refs?: string[];
  continuity_state?: RuntimeVslContinuityState;
  graph_state?: RuntimePsgGraphState;
  current_evidence_refs?: string[];
}

export interface ReconcileService {
  assess_delta_drift_impact(
    request: AssessDeltaDriftImpactRequest
  ): RuntimeDeltaDriftImpactAssessment;

  create_drift_record(
    request: CreateDriftRecordRequest
  ): RuntimeObjectRecord;

  create_conflict_case(
    request: CreateConflictCaseRequest
  ): RuntimeObjectRecord;

  assess_reconciliation(
    input: RuntimeObjectRecord[]
  ): ReconciliationAssessment;
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

  private unique_ids(values: unknown[]): string[] {
    return [...new Set(
      values.filter(
        (value): value is string =>
          typeof value === "string" && value.length > 0
      )
    )].sort();
  }

  assess_delta_drift_impact(
    request: AssessDeltaDriftImpactRequest
  ): RuntimeDeltaDriftImpactAssessment {
    const base_intent_id =
      typeof request.delta_intent.base_intent_id === "string"
        ? request.delta_intent.base_intent_id
        : undefined;
    const continuation_anchor_ref =
      request.continuity_state?.project_id === request.project_id
        ? request.continuity_state.continuation_anchor.anchor_object_id
        : undefined;
    const baseline_object_refs = this.unique_ids([
      ...(request.prior_object_refs ?? []),
      base_intent_id,
    ]);
    const graph_seed_object_refs = this.unique_ids([
      ...baseline_object_refs,
      continuation_anchor_ref,
    ]);
    const directly_related_edges = (request.graph_state?.project_id === request.project_id
      ? request.graph_state.relation_edges
      : []
    ).filter(
      (edge) =>
        graph_seed_object_refs.includes(edge.source_object_id) ||
        graph_seed_object_refs.includes(edge.target_object_id)
    );
    const affected_object_refs = this.unique_ids(
      directly_related_edges.flatMap((edge) => {
        if (graph_seed_object_refs.includes(edge.source_object_id)) {
          return [edge.target_object_id];
        }

        return [edge.source_object_id];
      })
    ).filter((object_id) => !graph_seed_object_refs.includes(object_id));
    const supporting_evidence_refs = this.unique_ids([
      ...(request.current_evidence_refs ?? []),
      ...directly_related_edges.flatMap((edge) => edge.evidence_refs),
      ...(
        request.graph_state?.project_id === request.project_id
          ? request.graph_state.node_records
          : []
      )
        .filter((node) => affected_object_refs.includes(node.object_id))
        .flatMap((node) => node.evidence_refs),
    ]);
    const observed_object_refs = this.unique_ids([
      request.delta_intent.object_id,
      ...affected_object_refs,
    ]);
    const assessment_mode =
      continuation_anchor_ref || directly_related_edges.length > 0
        ? "vsl_anchor_and_direct_psg_neighbors"
        : "baseline_only";
    const severity =
      affected_object_refs.length >= 3
        ? "high"
        : baseline_object_refs.length > 0 || continuation_anchor_ref
          ? "medium"
          : "low";
    const impact_summary = [
      `Delta intent ${request.delta_intent.object_id} assessed in ${assessment_mode} mode.`,
      continuation_anchor_ref
        ? `Continuation anchor ${continuation_anchor_ref} was available.`
        : "No prior continuation anchor was available.",
      `Baseline refs: ${baseline_object_refs.length}.`,
      `Directly affected graph-linked objects: ${affected_object_refs.length}.`,
    ].join(" ");

    return {
      project_id: request.project_id,
      delta_intent_id: request.delta_intent.object_id,
      drift_kind: "intent_drift",
      severity,
      assessment_mode,
      baseline_object_refs,
      observed_object_refs,
      affected_object_refs,
      continuation_anchor_ref,
      supporting_evidence_refs,
      impact_summary,
      notes: [
        "Delta Drift & Impact first pass remains project-scoped, evidence-aware, and runtime-private.",
        "Only direct PSG neighbors are considered in this wave.",
        "No compensation execution or rollback execution is performed in this wave.",
      ],
    };
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
        affected_object_refs: request.affected_object_refs ?? [],
        observed_object_refs: request.observed_object_refs,
        continuation_anchor_ref: request.continuation_anchor_ref,
        impact_summary: request.impact_summary,
        supporting_evidence_refs: request.supporting_evidence_refs ?? [],
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
