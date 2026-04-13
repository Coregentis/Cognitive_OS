export const WORKER_LIFECYCLE_STATES = [
  "idle",
  "active",
  "blocked",
  "paused",
  "retired",
] as const;

export type WorkerLifecycleState =
  (typeof WORKER_LIFECYCLE_STATES)[number];

const WORKER_STATE_TRANSITIONS: Record<
  WorkerLifecycleState,
  WorkerLifecycleState[]
> = {
  idle: ["active", "blocked", "retired"],
  active: ["idle", "blocked", "paused", "retired"],
  blocked: ["active", "retired"],
  paused: ["active", "blocked", "retired"],
  retired: [],
};

export function is_worker_lifecycle_state(
  value: string
): value is WorkerLifecycleState {
  return WORKER_LIFECYCLE_STATES.includes(
    value as WorkerLifecycleState
  );
}

export function list_allowed_worker_state_transitions(
  state: WorkerLifecycleState
): WorkerLifecycleState[] {
  return [...WORKER_STATE_TRANSITIONS[state]];
}

export function can_transition_worker_state(
  from_state: WorkerLifecycleState,
  to_state: WorkerLifecycleState
): boolean {
  return WORKER_STATE_TRANSITIONS[from_state].includes(to_state);
}

export function assert_worker_state_transition(
  from_state: WorkerLifecycleState,
  to_state: WorkerLifecycleState
): void {
  if (!can_transition_worker_state(from_state, to_state)) {
    throw new Error(
      `Illegal worker lifecycle transition: ${from_state} -> ${to_state}`
    );
  }
}
