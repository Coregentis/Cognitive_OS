import type {
  ExecutionBridgeKind,
  ExecutionRequestEnvelope,
  ExecutionResultEnvelope,
} from "./execution-envelope.ts";

export const EXECUTION_EVENT_TYPES = [
  "execution_requested",
  "execution_started",
  "execution_completed",
  "execution_failed",
] as const;

export type ExecutionEventType =
  (typeof EXECUTION_EVENT_TYPES)[number];

export interface ExecutionEventContract {
  event_id: string;
  event_type: ExecutionEventType;
  request_id: string;
  execution_id?: string;
  bridge_kind: ExecutionBridgeKind;
  worker_id: string;
  occurred_at: string;
  notes: string[];
  payload?: Record<string, unknown>;
}

export function create_execution_event(
  event: ExecutionEventContract
): ExecutionEventContract {
  return {
    ...event,
    notes: [...event.notes],
    payload: event.payload ? structuredClone(event.payload) : undefined,
  };
}

export function build_execution_events(
  request: ExecutionRequestEnvelope,
  result: ExecutionResultEnvelope
): ExecutionEventContract[] {
  const events: ExecutionEventContract[] = [
    create_execution_event({
      event_id: `${request.request_id}:requested`,
      event_type: "execution_requested",
      request_id: request.request_id,
      bridge_kind: request.bridge_kind,
      worker_id: request.worker_ref.worker_id,
      occurred_at: request.created_at,
      notes: ["Execution request accepted by contract layer."],
      payload: {
        request_kind: request.request_kind,
      },
    }),
  ];

  if (result.started_at) {
    events.push(
      create_execution_event({
        event_id: `${result.execution_id}:started`,
        event_type: "execution_started",
        request_id: result.request_id,
        execution_id: result.execution_id,
        bridge_kind: result.bridge_kind,
        worker_id: result.worker_id,
        occurred_at: result.started_at,
        notes: ["Execution bridge reported start."],
      })
    );
  }

  if (result.status === "completed" && result.completed_at) {
    events.push(
      create_execution_event({
        event_id: `${result.execution_id}:completed`,
        event_type: "execution_completed",
        request_id: result.request_id,
        execution_id: result.execution_id,
        bridge_kind: result.bridge_kind,
        worker_id: result.worker_id,
        occurred_at: result.completed_at,
        notes: [...result.notes],
        payload: result.output
          ? {
              output_summary: result.output.summary,
            }
          : undefined,
      })
    );
  }

  if (result.status === "failed") {
    events.push(
      create_execution_event({
        event_id: `${result.execution_id}:failed`,
        event_type: "execution_failed",
        request_id: result.request_id,
        execution_id: result.execution_id,
        bridge_kind: result.bridge_kind,
        worker_id: result.worker_id,
        occurred_at:
          result.completed_at ?? result.started_at ?? request.created_at,
        notes: [...result.notes],
        payload: result.error
          ? {
              code: result.error.code,
            }
          : undefined,
      })
    );
  }

  return events;
}
