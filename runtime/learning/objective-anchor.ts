import {
  ObjectiveStore,
  type ObjectiveRecord,
} from "../state/objective-store.ts";

export interface ObjectiveAnchorClock {
  now(): string;
}

export interface ObjectiveAnchorSnapshot {
  objective_id: string;
  project_id: string;
  objective_summary: string;
  progress_summary?: string;
  work_item_ids: string[];
  target_due_at?: string;
  status: string;
  source_revision: number;
  anchored_at: string;
}

export interface ObjectiveAnchorComparison {
  objective_id: string;
  anchor_present: boolean;
  changed: boolean;
  changed_fields: string[];
  notes: string[];
}

export interface ObjectiveAnchorPort {
  capture_anchor(objective_id: string): ObjectiveAnchorSnapshot;
  get_anchor(objective_id: string): ObjectiveAnchorSnapshot | undefined;
  compare_to_anchor(objective_id: string): ObjectiveAnchorComparison;
  refresh_anchor(objective_id: string): ObjectiveAnchorSnapshot;
}

function clone_anchor(
  snapshot: ObjectiveAnchorSnapshot
): ObjectiveAnchorSnapshot {
  return structuredClone(snapshot);
}

function get_revision(record: ObjectiveRecord): number {
  const current_revision = record.mutation?.current_revision;
  return typeof current_revision === "number" ? current_revision : 1;
}

function derive_anchor_snapshot(
  record: ObjectiveRecord,
  anchored_at: string
): ObjectiveAnchorSnapshot {
  return {
    objective_id: record.object_id,
    project_id: record.project_id,
    objective_summary: record.objective_summary,
    progress_summary:
      typeof record.progress_summary === "string"
        ? record.progress_summary
        : undefined,
    work_item_ids: Array.isArray(record.work_item_ids)
      ? [...record.work_item_ids]
      : [],
    target_due_at:
      typeof record.target_due_at === "string"
        ? record.target_due_at
        : undefined,
    status: record.status,
    source_revision: get_revision(record),
    anchored_at,
  };
}

export class InMemoryObjectiveAnchor implements ObjectiveAnchorPort {
  private readonly objective_store: ObjectiveStore;
  private readonly clock: ObjectiveAnchorClock;
  private readonly anchors = new Map<string, ObjectiveAnchorSnapshot>();

  constructor(params: {
    objective_store: ObjectiveStore;
    clock?: ObjectiveAnchorClock;
  }) {
    this.objective_store = params.objective_store;
    this.clock = params.clock ?? {
      now() {
        return new Date().toISOString();
      },
    };
  }

  capture_anchor(objective_id: string): ObjectiveAnchorSnapshot {
    const record = this.load_required_objective(objective_id);
    const snapshot = derive_anchor_snapshot(record, this.clock.now());
    this.anchors.set(objective_id, snapshot);
    return clone_anchor(snapshot);
  }

  get_anchor(objective_id: string): ObjectiveAnchorSnapshot | undefined {
    const anchor = this.anchors.get(objective_id);
    return anchor ? clone_anchor(anchor) : undefined;
  }

  compare_to_anchor(objective_id: string): ObjectiveAnchorComparison {
    const current = this.load_required_objective(objective_id);
    const anchor = this.anchors.get(objective_id);

    if (!anchor) {
      return {
        objective_id,
        anchor_present: false,
        changed: false,
        changed_fields: [],
        notes: ["No objective anchor has been captured yet."],
      };
    }

    const current_snapshot = derive_anchor_snapshot(current, anchor.anchored_at);
    const changed_fields: string[] = [];

    if (current_snapshot.objective_summary !== anchor.objective_summary) {
      changed_fields.push("objective_summary");
    }

    if (current_snapshot.progress_summary !== anchor.progress_summary) {
      changed_fields.push("progress_summary");
    }

    if (
      JSON.stringify(current_snapshot.work_item_ids) !==
      JSON.stringify(anchor.work_item_ids)
    ) {
      changed_fields.push("work_item_ids");
    }

    if (current_snapshot.target_due_at !== anchor.target_due_at) {
      changed_fields.push("target_due_at");
    }

    if (current_snapshot.status !== anchor.status) {
      changed_fields.push("status");
    }

    return {
      objective_id,
      anchor_present: true,
      changed: changed_fields.length > 0,
      changed_fields,
      notes:
        changed_fields.length > 0
          ? ["Objective drift from anchor is bounded and inspectable."]
          : ["Objective still matches the current bounded anchor."],
    };
  }

  refresh_anchor(objective_id: string): ObjectiveAnchorSnapshot {
    return this.capture_anchor(objective_id);
  }

  private load_required_objective(objective_id: string): ObjectiveRecord {
    const record = this.objective_store.load(objective_id);

    if (!record) {
      throw new Error(`Unknown objective for bounded anchor: ${objective_id}`);
    }

    return record;
  }
}
