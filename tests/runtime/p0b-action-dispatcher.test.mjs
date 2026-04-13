import test from "node:test";
import assert from "node:assert/strict";

import {
  ActionDispatcher,
} from "../../runtime/execution/action-dispatcher.ts";
import { MinimalRuntimeOrchestratorSkeleton } from "../../runtime/core/runtime-orchestrator.ts";

function createRequest(overrides = {}) {
  return {
    request_id: "p0b-req-001",
    bridge_kind: "agent",
    request_kind: "task",
    created_at: "2026-04-13T10:00:00.000Z",
    worker_ref: {
      worker_id: "00000000-0000-4000-8000-400000000010",
    },
    context_ref: {
      project_id: "00000000-0000-4000-8000-400000000000",
    },
    instruction_set: {
      task_brief: "Dispatch a bounded task",
    },
    ...overrides,
  };
}

test("[p0b] action dispatcher routes a bounded request to a registered handler", async () => {
  const dispatcher = new ActionDispatcher();

  dispatcher.register_handler({
    handler_id: "task-handler",
    can_handle(request) {
      return request.request_kind === "task";
    },
    handle(request) {
      return {
        request_id: request.request_id,
        execution_id: "p0b-exec-001",
        bridge_kind: request.bridge_kind,
        worker_id: request.worker_ref.worker_id,
        status: "completed",
        started_at: "2026-04-13T10:00:01.000Z",
        completed_at: "2026-04-13T10:00:02.000Z",
        output: {
          summary: "Bounded dispatch completed",
        },
        notes: ["Bounded handler succeeded."],
      };
    },
  });

  const outcome = await dispatcher.dispatch(createRequest());

  assert.deepEqual(dispatcher.list_handler_ids(), ["task-handler"]);
  assert.equal(outcome.disposition, "success");
  assert.equal(outcome.handler_id, "task-handler");
  assert.deepEqual(
    outcome.events.map((event) => event.event_type),
    ["execution_requested", "execution_started", "execution_completed"]
  );
});

test("[p0b] action dispatcher returns unsupported when no handler accepts the request", async () => {
  const dispatcher = new ActionDispatcher();
  const outcome = await dispatcher.dispatch(
    createRequest({
      request_kind: "review",
    })
  );

  assert.equal(outcome.disposition, "unsupported");
  assert.equal(outcome.result.status, "failed");
  assert.equal(outcome.result.error?.code, "bridge_unavailable");
});

test("[p0b] action dispatcher returns failure when handler throws", async () => {
  const dispatcher = new ActionDispatcher();

  dispatcher.register_handler({
    handler_id: "throwing-handler",
    can_handle() {
      return true;
    },
    handle() {
      throw new Error("Synthetic dispatcher failure");
    },
  });

  const outcome = await dispatcher.dispatch(createRequest());

  assert.equal(outcome.disposition, "failure");
  assert.equal(outcome.result.error?.code, "execution_failed");
});

test("[p0b] orchestrator exposes dispatcher glue without changing the minimal loop", async () => {
  const dispatcher = new ActionDispatcher();

  dispatcher.register_handler({
    handler_id: "orchestrator-handler",
    can_handle() {
      return true;
    },
    handle(request) {
      return {
        request_id: request.request_id,
        execution_id: "p0b-exec-002",
        bridge_kind: request.bridge_kind,
        worker_id: request.worker_ref.worker_id,
        status: "completed",
        notes: ["Orchestrator delegated bounded dispatch."],
      };
    },
  });

  const orchestrator = new MinimalRuntimeOrchestratorSkeleton({
    action_dispatcher: dispatcher,
  });

  const outcome = await orchestrator.dispatch_bounded_action(createRequest());
  assert.equal(outcome.disposition, "success");
});
