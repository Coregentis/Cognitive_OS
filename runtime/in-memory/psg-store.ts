import type {
  RuntimePsgGraphState,
  RuntimePsgStore,
} from "../core/runtime-types.ts";

function clone_graph_state(
  state: RuntimePsgGraphState
): RuntimePsgGraphState {
  return structuredClone(state);
}

export class InMemoryPsgStore implements RuntimePsgStore {
  private readonly graphs = new Map<string, RuntimePsgGraphState>();

  write(state: RuntimePsgGraphState): RuntimePsgGraphState {
    const persisted = clone_graph_state(state);
    this.graphs.set(persisted.project_id, persisted);
    return clone_graph_state(persisted);
  }

  load(project_id: string): RuntimePsgGraphState | undefined {
    const state = this.graphs.get(project_id);
    return state ? clone_graph_state(state) : undefined;
  }

  clear(): void {
    this.graphs.clear();
  }
}
