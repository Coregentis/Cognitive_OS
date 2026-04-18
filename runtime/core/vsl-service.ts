import type {
  MinimalLoopStep,
  RuntimeContinuationAnchor,
  RuntimeObjectRecord,
  RuntimeReconciliationSnapshot,
  RuntimeStoreSnapshot,
  RuntimeVslContinuityState,
  RuntimeVslStore,
} from "./runtime-types";

export interface CheckpointProjectContinuityRequest {
  project_id: string;
  scenario_id: string;
  last_completed_step: MinimalLoopStep;
  created_objects: RuntimeObjectRecord[];
  store_snapshot: RuntimeStoreSnapshot;
  reconciliation: RuntimeReconciliationSnapshot;
}

export interface VslService {
  checkpoint_project_continuity(
    request: CheckpointProjectContinuityRequest
  ): RuntimeVslContinuityState;
  load_project_continuity(
    project_id: string
  ): RuntimeVslContinuityState | undefined;
  recover_continuation_anchor(
    project_id: string
  ): RuntimeContinuationAnchor | undefined;
}

function unique_ids(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}

function get_record_time(record: RuntimeObjectRecord): string {
  const cognition_time = record.temporal?.cognition_time;
  return typeof cognition_time === "string"
    ? cognition_time
    : "1970-01-01T00:00:00.000Z";
}

function get_anchor_source_object_ids(record: RuntimeObjectRecord): string[] {
  const anchor_object_refs = Array.isArray(record.anchor_object_refs)
    ? record.anchor_object_refs.filter(
        (value): value is string => typeof value === "string"
      )
    : [];
  const lineage_source_object_ids = Array.isArray(record.lineage?.source_object_ids)
    ? record.lineage.source_object_ids.filter(
        (value): value is string => typeof value === "string"
      )
    : [];

  return unique_ids([
    ...anchor_object_refs,
    ...lineage_source_object_ids,
  ]);
}

function select_anchor_object(
  created_objects: RuntimeObjectRecord[]
): RuntimeObjectRecord {
  const preferred_types = [
    "episode",
    "delta-intent",
    "intent",
    "working-state-node",
  ];

  for (let index = created_objects.length - 1; index >= 0; index -= 1) {
    const record = created_objects[index]!;

    if (preferred_types.includes(record.object_type)) {
      return record;
    }
  }

  const fallback = created_objects.at(-1);

  if (!fallback) {
    throw new Error(
      "Cannot checkpoint VSL continuity without at least one created runtime object."
    );
  }

  return fallback;
}

export class DeterministicVslService implements VslService {
  private readonly vsl_store: RuntimeVslStore;

  constructor(args: {
    vsl_store: RuntimeVslStore;
  }) {
    this.vsl_store = args.vsl_store;
  }

  checkpoint_project_continuity(
    request: CheckpointProjectContinuityRequest
  ): RuntimeVslContinuityState {
    const anchor_object = select_anchor_object(request.created_objects);
    const existing_state = this.vsl_store.load(request.project_id);
    const continuity_status =
      request.reconciliation.can_continue
        ? "recoverable"
        : "review_required";
    const replayable_object_ids = unique_ids(
      request.store_snapshot.episodic_object_ids
    );
    const rollback_candidate_object_ids = unique_ids([
      ...request.store_snapshot.working_object_ids,
      ...request.store_snapshot.episodic_object_ids,
      ...request.store_snapshot.semantic_object_ids,
    ]);
    const retained_object_ids = unique_ids([
      ...request.store_snapshot.episodic_object_ids,
      ...request.store_snapshot.semantic_object_ids,
      ...request.store_snapshot.evidence_object_ids,
    ]);
    const expirable_object_ids = unique_ids(
      request.store_snapshot.working_object_ids
    );
    const updated_at = get_record_time(anchor_object);

    const continuity_state: RuntimeVslContinuityState = {
      project_id: request.project_id,
      scenario_id: request.scenario_id,
      continuity_revision: (existing_state?.continuity_revision ?? 0) + 1,
      durability_mode: "runtime_instance_bounded_in_memory",
      continuity_status,
      updated_at,
      last_completed_step: request.last_completed_step,
      continuation_anchor: {
        project_id: request.project_id,
        scenario_id: request.scenario_id,
        anchor_object_id: anchor_object.object_id,
        anchor_object_type: anchor_object.object_type,
        anchored_at: updated_at,
        source_object_ids: get_anchor_source_object_ids(anchor_object),
        last_completed_step: request.last_completed_step,
        disposition: continuity_status,
        notes: [
          "Continuation anchor is runtime-private and project-scoped.",
          "Anchor selection prefers episodic checkpoints before entry or working-state fallbacks.",
        ],
      },
      replay_horizon: {
        mode: "episodic_checkpoint_window",
        anchor_object_id: anchor_object.object_id,
        replayable_object_ids,
        notes: [
          "Replay horizon is bounded to the current in-memory episodic checkpoint set.",
          "No replay engine or generic event-log reconstruction is claimed in this wave.",
        ],
      },
      rollback_horizon: {
        mode: "checkpoint_boundary_only",
        anchor_object_id: anchor_object.object_id,
        boundary_step: request.last_completed_step,
        rollback_candidate_object_ids,
        notes: [
          "Rollback horizon is metadata-only in this wave.",
          "Rollback semantics stop at bounded checkpoint boundary capture rather than executable rollback behavior.",
        ],
      },
      retention_horizon: {
        mode: "bounded_memory_partition",
        retained_object_ids,
        expirable_object_ids,
        notes: [
          "Retention horizon preserves which project-scoped objects are treated as retained versus expirable in the current in-memory baseline.",
          "No TTL enforcement, archival policy, or production durability is claimed in this wave.",
        ],
      },
      store_snapshot: request.store_snapshot,
      notes: [
        "VSL first pass checkpoints continuity state as an explicit runtime-private record rather than relying only on implicit object placement.",
        "Continuity state remains product-neutral and does not introduce downstream DTO law.",
      ],
    };

    return this.vsl_store.write(continuity_state);
  }

  load_project_continuity(
    project_id: string
  ): RuntimeVslContinuityState | undefined {
    return this.vsl_store.load(project_id);
  }

  recover_continuation_anchor(
    project_id: string
  ): RuntimeContinuationAnchor | undefined {
    return this.vsl_store.recover_continuation_anchor(project_id);
  }
}
