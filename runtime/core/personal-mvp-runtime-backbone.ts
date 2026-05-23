import type {
  PersonalMvpAelActivitySummary,
  PersonalMvpDirectionChangeSummary,
  PersonalMvpLearningFeedbackSummary,
  PersonalMvpPsgMemoryLayerSummary,
  PersonalMvpPsgMemorySummary,
  PersonalMvpRuntimeActivityKind,
  PersonalMvpRuntimeBackboneBoundaryFlags,
  PersonalMvpRuntimeBackboneProjection,
  PersonalMvpRuntimeDecisionState,
  PersonalMvpRuntimeDirectionChangeState,
  PersonalMvpRuntimeEvidenceRef,
  PersonalMvpRuntimeLearningState,
  PersonalMvpRuntimeOmission,
  PersonalMvpRuntimePsgLayer,
  PersonalMvpVslContinuitySummary,
} from "../public/personal-mvp-runtime-backbone-dto.ts";

export type PersonalMvpLearningFeedbackKind =
  | "style_preference"
  | "workflow_preference"
  | "output_quality_feedback";

export interface PersonalMvpRuntimeBackboneClock {
  now(): string;
}

export interface PersonalMvpRuntimeBackboneIdProvider {
  create_id(prefix: string): string;
}

export interface RecordPersonalMvpActivityInput {
  project_id: string;
  activity_kind: PersonalMvpRuntimeActivityKind;
  summary: string;
  source_ref?: string;
  evidence_refs?: readonly string[];
}

export interface PersonalMvpAelActivityRecord
  extends RecordPersonalMvpActivityInput {
  activity_ref: string;
  recorded_at: string;
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  export_class: "runtime_private_non_exportable";
  no_provider_execution: true;
  no_tool_execution: true;
  notes: readonly string[];
}

export interface WritePersonalMvpContinuityStateInput {
  project_id: string;
  continuity_ref?: string;
  current_mission_state: string;
  scope_progress_state: string;
  review_state: PersonalMvpRuntimeDecisionState;
  packet_state: string;
  artifact_state: string;
  resume_pointer: string;
  last_confirmed_direction?: string;
  next_safe_action: string;
  evidence_refs?: readonly string[];
}

export interface PersonalMvpVslContinuityState
  extends WritePersonalMvpContinuityStateInput {
  continuity_ref: string;
  revision: number;
  updated_at: string;
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  export_class: "runtime_private_non_exportable";
}

export interface UpsertPersonalMvpMemoryLayerInput {
  project_id: string;
  layer: PersonalMvpRuntimePsgLayer;
  summary: string;
  node_refs?: readonly string[];
  relation_refs?: readonly string[];
  evidence_refs?: readonly string[];
}

export interface PersonalMvpPsgMemoryLayerState
  extends UpsertPersonalMvpMemoryLayerInput {
  node_refs: readonly string[];
  relation_refs: readonly string[];
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  updated_at: string;
  export_class: "runtime_private_non_exportable";
}

export interface PersonalMvpPsgMemoryGraphState {
  project_id: string;
  graph_ref: string;
  graph_revision: number;
  layers: readonly PersonalMvpPsgMemoryLayerState[];
  updated_at: string;
  export_class: "runtime_private_non_exportable";
}

export interface CapturePersonalMvpLearningFeedbackInput {
  project_id: string;
  learning_kind: PersonalMvpLearningFeedbackKind;
  summary: string;
  candidate_ref?: string;
  state?: PersonalMvpRuntimeLearningState;
  target_ref?: string;
  evidence_refs?: readonly string[];
}

export interface PersonalMvpLearningFeedbackCandidate
  extends CapturePersonalMvpLearningFeedbackInput {
  candidate_ref: string;
  state: PersonalMvpRuntimeLearningState;
  captured_at: string;
  updated_at: string;
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  export_class: "runtime_private_non_exportable";
  mutation_applied: false;
  training_applied: false;
}

export interface CreatePersonalMvpDirectionChangeInput {
  project_id: string;
  previous_direction_ref?: string;
  proposed_direction_ref: string;
  change_summary: string;
  impact_summary: string;
  evidence_refs?: readonly string[];
}

export interface PersonalMvpDirectionChangeRecord
  extends CreatePersonalMvpDirectionChangeInput {
  direction_change_ref: string;
  state: PersonalMvpRuntimeDirectionChangeState;
  created_at: string;
  updated_at: string;
  requires_operator_confirmation: true;
  safe_evidence_refs: readonly PersonalMvpRuntimeEvidenceRef[];
  export_class: "runtime_private_non_exportable";
  automatic_acceptance_applied: false;
}

export interface CreatePersonalMvpRuntimeBackboneProjectionInput {
  project_id: string;
  runtime_backbone_ref?: string;
  source_commit_ref: string;
  protocol_version_ref?: string;
  binding_version_ref?: string;
  runtime_version_ref?: string;
}

interface MemoryGraphDraft {
  graph_ref: string;
  graph_revision: number;
  layers: Map<PersonalMvpRuntimePsgLayer, PersonalMvpPsgMemoryLayerState>;
  updated_at: string;
}

class SequentialIdProvider implements PersonalMvpRuntimeBackboneIdProvider {
  private next_id = 1;

  create_id(prefix: string): string {
    const suffix = String(this.next_id).padStart(4, "0");
    this.next_id += 1;

    return `${prefix}:${suffix}`;
  }
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function unique_strings(values: readonly (string | undefined)[]): string[] {
  return [...new Set(
    values.filter(
      (value): value is string =>
        typeof value === "string" && value.length > 0
    )
  )].sort();
}

function sort_memory_layers(
  layers: readonly PersonalMvpPsgMemoryLayerState[]
): PersonalMvpPsgMemoryLayerState[] {
  const order = new Map<PersonalMvpRuntimePsgLayer, number>([
    ["operator_intake_psg", 0],
    ["project_scope_psg", 1],
    ["task_scope_psg", 2],
  ]);

  return [...layers].sort((left, right) => {
    const byLayer = (order.get(left.layer) ?? 99) - (order.get(right.layer) ?? 99);

    if (byLayer !== 0) {
      return byLayer;
    }

    return left.summary.localeCompare(right.summary);
  });
}

function make_evidence_refs(
  evidence_refs: readonly string[] | undefined,
  evidence_kind: string
): PersonalMvpRuntimeEvidenceRef[] {
  return unique_strings(evidence_refs ?? []).map((evidence_ref) => ({
    evidence_ref,
    evidence_kind,
    source_ref: evidence_ref,
    summary: `Reference-only ${evidence_kind} evidence.`,
    privacy_treatment: "reference_only",
    runtime_private_payload_omitted: true,
  }));
}

function aggregate_evidence_refs(
  groups: readonly (readonly PersonalMvpRuntimeEvidenceRef[] | undefined)[]
): PersonalMvpRuntimeEvidenceRef[] {
  const byRef = new Map<string, PersonalMvpRuntimeEvidenceRef>();

  for (const group of groups) {
    for (const evidence of group ?? []) {
      byRef.set(evidence.evidence_ref, evidence);
    }
  }

  return [...byRef.values()].sort((left, right) =>
    left.evidence_ref.localeCompare(right.evidence_ref)
  );
}

function create_boundary_flags(): PersonalMvpRuntimeBackboneBoundaryFlags {
  return {
    projection_safe: true,
    runtime_private_payload_omitted: true,
    runtime_private_fields_omitted: true,
    personal_mvp_ael_activity_runtime_available: true,
    personal_mvp_vsl_continuity_runtime_available: true,
    personal_mvp_psg_memory_runtime_available: true,
    personal_mvp_learning_feedback_runtime_available: true,
    personal_mvp_direction_change_runtime_available: true,
    full_enterprise_ael_runtime_claimed: false,
    full_enterprise_vsl_runtime_claimed: false,
    full_enterprise_psg_runtime_claimed: false,
    full_enterprise_learning_engine_claimed: false,
    provider_execution_authorized: false,
    model_execution_authorized: false,
    tool_execution_authorized: false,
    worker_execution_authorized: false,
    publishing_authorized: false,
    external_action_authorized: false,
    automatic_mutation_authorized: false,
    autonomous_acceptance_authorized: false,
    training_authorized: false,
    writeback_authorized: false,
    no_package_publish: true,
    no_certification_or_endorsement: true,
  };
}

function create_omissions(): PersonalMvpRuntimeOmission[] {
  return [
    {
      marker: "personal-mvp-ael-runtime-records-omitted",
      reason: "Activity runtime records remain runtime-private.",
      omitted_field: "runtime_private_activity_records",
      omission_reason: "Public consumers receive activity summaries and refs only.",
      runtime_private: true,
      safe_alternative_ref: "ael_activity_summary",
    },
    {
      marker: "personal-mvp-vsl-continuity-state-omitted",
      reason: "Continuity runtime state remains runtime-private.",
      omitted_field: "runtime_private_continuity_state",
      omission_reason: "Public consumers receive continuity summaries and refs only.",
      runtime_private: true,
      safe_alternative_ref: "vsl_continuity_summary",
    },
    {
      marker: "personal-mvp-psg-memory-graph-omitted",
      reason: "Memory graph internals remain runtime-private.",
      omitted_field: "runtime_private_memory_graph",
      omission_reason: "Public consumers receive memory layer summaries and refs only.",
      runtime_private: true,
      safe_alternative_ref: "psg_memory_summary",
    },
    {
      marker: "personal-mvp-learning-feedback-records-omitted",
      reason: "Learning feedback records remain runtime-private.",
      omitted_field: "runtime_private_learning_feedback_records",
      omission_reason: "Public consumers receive feedback summaries and candidate refs only.",
      runtime_private: true,
      safe_alternative_ref: "learning_feedback_summary",
    },
    {
      marker: "personal-mvp-direction-change-records-omitted",
      reason: "Direction-change records remain runtime-private.",
      omitted_field: "runtime_private_direction_change_records",
      omission_reason: "Public consumers receive direction-change confirmation summaries only.",
      runtime_private: true,
      safe_alternative_ref: "direction_change_summary",
    },
  ];
}

export class DeterministicPersonalMvpRuntimeBackbone {
  private readonly clock: PersonalMvpRuntimeBackboneClock;
  private readonly id_provider: PersonalMvpRuntimeBackboneIdProvider;
  private readonly activities_by_project = new Map<string, PersonalMvpAelActivityRecord[]>();
  private readonly continuity_by_project = new Map<string, PersonalMvpVslContinuityState>();
  private readonly memory_by_project = new Map<string, MemoryGraphDraft>();
  private readonly learning_by_project = new Map<string, PersonalMvpLearningFeedbackCandidate[]>();
  private readonly direction_by_project = new Map<string, PersonalMvpDirectionChangeRecord[]>();

  constructor(args?: {
    clock?: PersonalMvpRuntimeBackboneClock;
    id_provider?: PersonalMvpRuntimeBackboneIdProvider;
  }) {
    this.clock = args?.clock ?? {
      now() {
        return new Date().toISOString();
      },
    };
    this.id_provider = args?.id_provider ?? new SequentialIdProvider();
  }

  record_activity(
    input: RecordPersonalMvpActivityInput
  ): PersonalMvpAelActivityRecord {
    const record: PersonalMvpAelActivityRecord = {
      ...input,
      activity_ref: this.id_provider.create_id("personal-mvp-ael-activity"),
      recorded_at: this.clock.now(),
      safe_evidence_refs: make_evidence_refs(input.evidence_refs, "activity"),
      export_class: "runtime_private_non_exportable",
      no_provider_execution: true,
      no_tool_execution: true,
      notes: [
        "Activity is recorded as an internal event only.",
        "No provider, model, tool, or external action authority is created.",
      ],
    };
    const records = this.activities_by_project.get(input.project_id) ?? [];

    this.activities_by_project.set(input.project_id, [...records, record]);
    return clone(record);
  }

  list_activity(project_id: string): PersonalMvpAelActivityRecord[] {
    return clone(this.activities_by_project.get(project_id) ?? []);
  }

  write_continuity_state(
    input: WritePersonalMvpContinuityStateInput
  ): PersonalMvpVslContinuityState {
    const previous = this.continuity_by_project.get(input.project_id);
    const state: PersonalMvpVslContinuityState = {
      ...input,
      continuity_ref:
        input.continuity_ref ??
        previous?.continuity_ref ??
        this.id_provider.create_id("personal-mvp-vsl-continuity"),
      revision: (previous?.revision ?? 0) + 1,
      updated_at: this.clock.now(),
      safe_evidence_refs: make_evidence_refs(input.evidence_refs, "continuity"),
      export_class: "runtime_private_non_exportable",
    };

    this.continuity_by_project.set(input.project_id, state);
    return clone(state);
  }

  load_continuity_state(
    project_id: string
  ): PersonalMvpVslContinuityState | undefined {
    const state = this.continuity_by_project.get(project_id);

    return state ? clone(state) : undefined;
  }

  upsert_memory_layer(
    input: UpsertPersonalMvpMemoryLayerInput
  ): PersonalMvpPsgMemoryLayerState {
    const existing = this.memory_by_project.get(input.project_id);
    const graph: MemoryGraphDraft = existing ?? {
      graph_ref: this.id_provider.create_id("personal-mvp-psg-memory"),
      graph_revision: 0,
      layers: new Map(),
      updated_at: this.clock.now(),
    };
    const layer_state: PersonalMvpPsgMemoryLayerState = {
      ...input,
      node_refs: unique_strings(input.node_refs ?? []),
      relation_refs: unique_strings(input.relation_refs ?? []),
      safe_evidence_refs: make_evidence_refs(input.evidence_refs, "memory"),
      updated_at: this.clock.now(),
      export_class: "runtime_private_non_exportable",
    };

    graph.layers.set(input.layer, layer_state);
    graph.graph_revision += 1;
    graph.updated_at = layer_state.updated_at;
    this.memory_by_project.set(input.project_id, graph);

    return clone(layer_state);
  }

  inspect_memory_graph(
    project_id: string
  ): PersonalMvpPsgMemoryGraphState | undefined {
    const graph = this.memory_by_project.get(project_id);

    if (!graph) {
      return undefined;
    }

    return clone({
      project_id,
      graph_ref: graph.graph_ref,
      graph_revision: graph.graph_revision,
      layers: sort_memory_layers([...graph.layers.values()]),
      updated_at: graph.updated_at,
      export_class: "runtime_private_non_exportable",
    });
  }

  capture_learning_feedback(
    input: CapturePersonalMvpLearningFeedbackInput
  ): PersonalMvpLearningFeedbackCandidate {
    const now = this.clock.now();
    const candidate: PersonalMvpLearningFeedbackCandidate = {
      ...input,
      candidate_ref:
        input.candidate_ref ??
        this.id_provider.create_id("personal-mvp-learning-feedback"),
      state: input.state ?? "suggested",
      captured_at: now,
      updated_at: now,
      safe_evidence_refs: make_evidence_refs(input.evidence_refs, "learning"),
      export_class: "runtime_private_non_exportable",
      mutation_applied: false,
      training_applied: false,
    };
    const records = this.learning_by_project.get(input.project_id) ?? [];

    this.learning_by_project.set(input.project_id, [...records, candidate]);
    return clone(candidate);
  }

  update_learning_feedback_state(
    candidate_ref: string,
    state: PersonalMvpRuntimeLearningState
  ): PersonalMvpLearningFeedbackCandidate {
    for (const [project_id, records] of this.learning_by_project.entries()) {
      const index = records.findIndex(
        (candidate) => candidate.candidate_ref === candidate_ref
      );

      if (index === -1) {
        continue;
      }

      const updated: PersonalMvpLearningFeedbackCandidate = {
        ...records[index]!,
        state,
        updated_at: this.clock.now(),
        mutation_applied: false,
        training_applied: false,
      };
      const next = [...records];

      next[index] = updated;
      this.learning_by_project.set(project_id, next);
      return clone(updated);
    }

    throw new Error(`Unknown learning feedback candidate: ${candidate_ref}`);
  }

  list_learning_feedback(
    project_id: string
  ): PersonalMvpLearningFeedbackCandidate[] {
    return clone(this.learning_by_project.get(project_id) ?? []);
  }

  create_direction_change(
    input: CreatePersonalMvpDirectionChangeInput
  ): PersonalMvpDirectionChangeRecord {
    const now = this.clock.now();
    const record: PersonalMvpDirectionChangeRecord = {
      ...input,
      direction_change_ref: this.id_provider.create_id(
        "personal-mvp-direction-change"
      ),
      state: "pending_confirmation",
      created_at: now,
      updated_at: now,
      requires_operator_confirmation: true,
      safe_evidence_refs: make_evidence_refs(input.evidence_refs, "direction_change"),
      export_class: "runtime_private_non_exportable",
      automatic_acceptance_applied: false,
    };
    const records = this.direction_by_project.get(input.project_id) ?? [];

    this.direction_by_project.set(input.project_id, [...records, record]);
    return clone(record);
  }

  update_direction_change_state(
    direction_change_ref: string,
    state: PersonalMvpRuntimeDirectionChangeState
  ): PersonalMvpDirectionChangeRecord {
    for (const [project_id, records] of this.direction_by_project.entries()) {
      const index = records.findIndex(
        (record) => record.direction_change_ref === direction_change_ref
      );

      if (index === -1) {
        continue;
      }

      const updated: PersonalMvpDirectionChangeRecord = {
        ...records[index]!,
        state,
        updated_at: this.clock.now(),
        automatic_acceptance_applied: false,
      };
      const next = [...records];

      next[index] = updated;
      this.direction_by_project.set(project_id, next);
      return clone(updated);
    }

    throw new Error(`Unknown direction-change record: ${direction_change_ref}`);
  }

  list_direction_changes(
    project_id: string
  ): PersonalMvpDirectionChangeRecord[] {
    return clone(this.direction_by_project.get(project_id) ?? []);
  }

  create_public_projection(
    input: CreatePersonalMvpRuntimeBackboneProjectionInput
  ): PersonalMvpRuntimeBackboneProjection {
    const activities = this.activities_by_project.get(input.project_id) ?? [];
    const continuity = this.continuity_by_project.get(input.project_id);
    const memory = this.inspect_memory_graph(input.project_id);
    const learning = this.learning_by_project.get(input.project_id) ?? [];
    const direction_changes = this.direction_by_project.get(input.project_id) ?? [];
    const latest_direction_change = direction_changes.at(-1);
    const ael_activity_summary = this.create_activity_summary(activities);
    const vsl_continuity_summary = this.create_continuity_summary(
      input.project_id,
      continuity
    );
    const psg_memory_summary = this.create_memory_summary(input.project_id, memory);
    const learning_feedback_summary = this.create_learning_summary(learning);
    const direction_change_summary = this.create_direction_change_summary(
      latest_direction_change
    );
    const safe_evidence_refs = aggregate_evidence_refs([
      ael_activity_summary.safe_evidence_refs,
      vsl_continuity_summary.safe_evidence_refs,
      psg_memory_summary.layers.flatMap((layer) => layer.safe_evidence_refs),
      learning_feedback_summary.safe_evidence_refs,
      direction_change_summary.safe_evidence_refs,
    ]);

    return {
      runtime_backbone_ref:
        input.runtime_backbone_ref ??
        `personal-mvp-runtime-backbone:${input.project_id}`,
      contract_version: "personal-mvp-runtime-backbone-contract-v0.1",
      runtime_contract_version: "personal-mvp-runtime-backbone-runtime-v0.1",
      compatibility_profile: "personal-mvp-runtime-backbone-projection-v0.1",
      generated_at: this.clock.now(),
      source_runtime_surface_ref: "runtime/public/personal-mvp-runtime-backbone-dto",
      source_commit_ref: input.source_commit_ref,
      version_refs: {
        protocol_version_refs: [
          {
            ref_kind: "protocol",
            ref_id: "mplp",
            ref_version: input.protocol_version_ref ?? "not-mutated",
          },
        ],
        binding_version_refs: [
          {
            ref_kind: "binding",
            ref_id: "cgos-personal-mvp-runtime-backbone",
            ref_version: input.binding_version_ref ?? "0.1",
          },
        ],
        runtime_version_refs: [
          {
            ref_kind: "runtime",
            ref_id: "cognitive-os",
            ref_version: input.runtime_version_ref ?? "0.1.0",
          },
        ],
      },
      ael_activity_summary,
      vsl_continuity_summary,
      psg_memory_summary,
      learning_feedback_summary,
      direction_change_summary,
      safe_evidence_refs,
      omissions: create_omissions(),
      boundary_flags: create_boundary_flags(),
      runtime_private_fields_omitted: true,
      non_executing: true,
    };
  }

  private create_activity_summary(
    activities: readonly PersonalMvpAelActivityRecord[]
  ): PersonalMvpAelActivitySummary {
    return {
      activity_count: activities.length,
      latest_activity_ref: activities.at(-1)?.activity_ref,
      activity_kinds: unique_strings(
        activities.map((activity) => activity.activity_kind)
      ) as PersonalMvpRuntimeActivityKind[],
      activity_refs: unique_strings(
        activities.map((activity) => activity.activity_ref)
      ),
      safe_evidence_refs: aggregate_evidence_refs(
        activities.map((activity) => activity.safe_evidence_refs)
      ),
      runtime_private_payload_omitted: true,
    };
  }

  private create_continuity_summary(
    project_id: string,
    continuity: PersonalMvpVslContinuityState | undefined
  ): PersonalMvpVslContinuitySummary {
    if (!continuity) {
      return {
        continuity_ref: `personal-mvp-vsl-continuity:missing:${project_id}`,
        current_mission_state: "not_recorded",
        progress_state: "not_recorded",
        review_state: "not_required",
        packet_state: "not_recorded",
        artifact_state: "not_recorded",
        resume_pointer: "not_recorded",
        next_safe_action: "record_continuity_state",
        safe_evidence_refs: [],
        runtime_private_payload_omitted: true,
      };
    }

    return {
      continuity_ref: continuity.continuity_ref,
      current_mission_state: continuity.current_mission_state,
      progress_state: continuity.scope_progress_state,
      review_state: continuity.review_state,
      packet_state: continuity.packet_state,
      artifact_state: continuity.artifact_state,
      resume_pointer: continuity.resume_pointer,
      last_confirmed_direction: continuity.last_confirmed_direction,
      next_safe_action: continuity.next_safe_action,
      safe_evidence_refs: continuity.safe_evidence_refs,
      runtime_private_payload_omitted: true,
    };
  }

  private create_memory_summary(
    project_id: string,
    memory: PersonalMvpPsgMemoryGraphState | undefined
  ): PersonalMvpPsgMemorySummary {
    return {
      graph_ref: memory?.graph_ref ?? `personal-mvp-psg-memory:missing:${project_id}`,
      graph_revision: memory?.graph_revision ?? 0,
      layers: (memory?.layers ?? []).map(
        (layer): PersonalMvpPsgMemoryLayerSummary => ({
          layer: layer.layer,
          summary: layer.summary,
          node_refs: layer.node_refs,
          relation_refs: layer.relation_refs,
          safe_evidence_refs: layer.safe_evidence_refs,
          runtime_private_payload_omitted: true,
        })
      ),
      runtime_private_payload_omitted: true,
    };
  }

  private create_learning_summary(
    candidates: readonly PersonalMvpLearningFeedbackCandidate[]
  ): PersonalMvpLearningFeedbackSummary {
    return {
      feedback_count: candidates.length,
      states_present: unique_strings(
        candidates.map((candidate) => candidate.state)
      ) as PersonalMvpRuntimeLearningState[],
      candidate_refs: unique_strings(
        candidates.map((candidate) => candidate.candidate_ref)
      ),
      safe_evidence_refs: aggregate_evidence_refs(
        candidates.map((candidate) => candidate.safe_evidence_refs)
      ),
      runtime_private_payload_omitted: true,
    };
  }

  private create_direction_change_summary(
    record: PersonalMvpDirectionChangeRecord | undefined
  ): PersonalMvpDirectionChangeSummary {
    if (!record) {
      return {
        state: "parked",
        change_summary: "No direction-change record is pending.",
        impact_summary: "No recorded impact.",
        requires_operator_confirmation: false,
        safe_evidence_refs: [],
        runtime_private_payload_omitted: true,
      };
    }

    return {
      direction_change_ref: record.direction_change_ref,
      state: record.state,
      previous_direction_ref: record.previous_direction_ref,
      proposed_direction_ref: record.proposed_direction_ref,
      change_summary: record.change_summary,
      impact_summary: record.impact_summary,
      requires_operator_confirmation: record.requires_operator_confirmation,
      safe_evidence_refs: record.safe_evidence_refs,
      runtime_private_payload_omitted: true,
    };
  }
}
