import {
  assert_worker_state_transition,
  is_worker_lifecycle_state,
  type WorkerLifecycleState,
} from "./worker-state-machine.ts";
import {
  type AgentWorkerRecord,
  WorkerStore,
} from "../state/worker-store.ts";

export interface WorkerLifecycleClock {
  now(): string;
}

function get_current_revision(record: AgentWorkerRecord): number {
  const current_revision = record.mutation?.current_revision;

  if (typeof current_revision === "number" && current_revision >= 1) {
    return current_revision;
  }

  return 1;
}

export class WorkerLifecycleRuntime {
  private readonly worker_store: WorkerStore;
  private readonly clock: WorkerLifecycleClock;

  constructor(params: {
    worker_store: WorkerStore;
    clock?: WorkerLifecycleClock;
  }) {
    this.worker_store = params.worker_store;
    this.clock = params.clock ?? {
      now() {
        return new Date().toISOString();
      },
    };
  }

  activate_worker(object_id: string): AgentWorkerRecord {
    return this.transition_worker(object_id, "active");
  }

  pause_worker(object_id: string): AgentWorkerRecord {
    return this.transition_worker(object_id, "paused");
  }

  block_worker(object_id: string): AgentWorkerRecord {
    return this.transition_worker(object_id, "blocked");
  }

  resume_worker(object_id: string): AgentWorkerRecord {
    return this.transition_worker(object_id, "active");
  }

  release_worker(object_id: string): AgentWorkerRecord {
    return this.transition_worker(object_id, "idle");
  }

  retire_worker(object_id: string): AgentWorkerRecord {
    return this.transition_worker(object_id, "retired");
  }

  transition_worker(
    object_id: string,
    next_state: WorkerLifecycleState
  ): AgentWorkerRecord {
    const current = this.load_required_worker(object_id);

    if (!is_worker_lifecycle_state(current.status)) {
      throw new Error(
        `Worker ${object_id} has invalid lifecycle state: ${current.status}`
      );
    }

    assert_worker_state_transition(current.status, next_state);

    const mutated_at = this.clock.now();
    const next_record: AgentWorkerRecord = {
      ...current,
      status: next_state,
      temporal: {
        ...current.temporal,
        event_time: mutated_at,
      },
      mutation: {
        ...current.mutation,
        mutation_class: "stateful_mutable",
        current_revision: get_current_revision(current) + 1,
        last_mutated_at: mutated_at,
      },
    };

    return this.worker_store.save(next_record);
  }

  private load_required_worker(object_id: string): AgentWorkerRecord {
    const record = this.worker_store.load(object_id);

    if (!record) {
      throw new Error(`Unknown worker lifecycle record: ${object_id}`);
    }

    return record;
  }
}
