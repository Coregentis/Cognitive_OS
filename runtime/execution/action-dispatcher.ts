import {
  build_execution_events,
  type ExecutionEventContract,
} from "./execution-events.ts";
import type {
  ExecutionErrorSurface,
  ExecutionRequestEnvelope,
  ExecutionResultEnvelope,
} from "./execution-envelope.ts";

export type ActionDispatchDisposition =
  | "success"
  | "failure"
  | "unsupported";

export interface ActionDispatchHandler {
  handler_id: string;
  can_handle(request: ExecutionRequestEnvelope): boolean;
  handle(
    request: ExecutionRequestEnvelope
  ):
    | Promise<ExecutionResultEnvelope>
    | ExecutionResultEnvelope;
}

export interface ActionDispatchOutcome {
  disposition: ActionDispatchDisposition;
  handler_id?: string;
  result: ExecutionResultEnvelope;
  events: ExecutionEventContract[];
  notes: string[];
}

function build_dispatch_result(
  request: ExecutionRequestEnvelope,
  params: {
    execution_id: string;
    status: ExecutionResultEnvelope["status"];
    error?: ExecutionErrorSurface;
    output?: ExecutionResultEnvelope["output"];
    notes: string[];
  }
): ExecutionResultEnvelope {
  const completed_at = new Date().toISOString();

  return {
    request_id: request.request_id,
    execution_id: params.execution_id,
    bridge_kind: request.bridge_kind,
    worker_id: request.worker_ref.worker_id,
    status: params.status,
    started_at: completed_at,
    completed_at,
    output: params.output,
    error: params.error,
    notes: [...params.notes],
  };
}

export function build_unsupported_action_dispatch_outcome(
  request: ExecutionRequestEnvelope,
  notes: string[] = []
): ActionDispatchOutcome {
  const result = build_dispatch_result(request, {
    execution_id: `${request.request_id}:unsupported`,
    status: "failed",
    error: {
      code: "bridge_unavailable",
      message: "No bounded action handler accepted the request.",
    },
    notes: [
      "Action dispatch returned unsupported.",
      ...notes,
    ],
  });

  return {
    disposition: "unsupported",
    result,
    events: build_execution_events(request, result),
    notes: [...result.notes],
  };
}

export function build_failed_action_dispatch_outcome(
  request: ExecutionRequestEnvelope,
  error: ExecutionErrorSurface,
  handler_id?: string,
  notes: string[] = []
): ActionDispatchOutcome {
  const result = build_dispatch_result(request, {
    execution_id: `${request.request_id}:failed`,
    status: "failed",
    error,
    notes: [
      "Action dispatch failed before completion.",
      ...notes,
    ],
  });

  return {
    disposition: "failure",
    handler_id,
    result,
    events: build_execution_events(request, result),
    notes: [...result.notes],
  };
}

export class ActionDispatcher {
  private readonly handlers = new Map<string, ActionDispatchHandler>();

  register_handler(handler: ActionDispatchHandler): void {
    if (this.handlers.has(handler.handler_id)) {
      throw new Error(
        `Duplicate bounded action handler id: ${handler.handler_id}`
      );
    }

    this.handlers.set(handler.handler_id, handler);
  }

  list_handler_ids(): string[] {
    return [...this.handlers.keys()];
  }

  async dispatch(
    request: ExecutionRequestEnvelope
  ): Promise<ActionDispatchOutcome> {
    const handler = [...this.handlers.values()].find((candidate) =>
      candidate.can_handle(request)
    );

    if (!handler) {
      return build_unsupported_action_dispatch_outcome(request, [
        `No handler accepted request kind ${request.request_kind}.`,
      ]);
    }

    try {
      const result = await handler.handle(request);

      return {
        disposition:
          result.status === "failed" ? "failure" : "success",
        handler_id: handler.handler_id,
        result,
        events: build_execution_events(request, result),
        notes: [
          `Bounded action handler ${handler.handler_id} processed the request.`,
        ],
      };
    } catch (error) {
      return build_failed_action_dispatch_outcome(
        request,
        {
          code: "execution_failed",
          message:
            error instanceof Error
              ? error.message
              : "Unknown bounded action dispatch failure.",
        },
        handler.handler_id,
        [
          `Handler ${handler.handler_id} threw during bounded action dispatch.`,
        ]
      );
    }
  }
}
