import type {
  RuntimeContinuationAnchor,
  RuntimeVslContinuityState,
  RuntimeVslStore,
} from "../core/runtime-types";

function clone_continuity_state(
  state: RuntimeVslContinuityState
): RuntimeVslContinuityState {
  return structuredClone(state);
}

function clone_continuation_anchor(
  anchor: RuntimeContinuationAnchor
): RuntimeContinuationAnchor {
  return structuredClone(anchor);
}

export class InMemoryVslStore implements RuntimeVslStore {
  private readonly continuity_states = new Map<string, RuntimeVslContinuityState>();

  write(state: RuntimeVslContinuityState): RuntimeVslContinuityState {
    const persisted = clone_continuity_state(state);
    this.continuity_states.set(persisted.project_id, persisted);
    return clone_continuity_state(persisted);
  }

  load(project_id: string): RuntimeVslContinuityState | undefined {
    const state = this.continuity_states.get(project_id);
    return state ? clone_continuity_state(state) : undefined;
  }

  recover_continuation_anchor(
    project_id: string
  ): RuntimeContinuationAnchor | undefined {
    const state = this.continuity_states.get(project_id);
    return state
      ? clone_continuation_anchor(state.continuation_anchor)
      : undefined;
  }

  clear(): void {
    this.continuity_states.clear();
  }
}
