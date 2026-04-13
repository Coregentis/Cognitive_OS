import test from "node:test";
import assert from "node:assert/strict";

import {
  assert_execution_bridge_contract,
} from "../../runtime/execution/execution-bridge.ts";
import { build_execution_events } from "../../runtime/execution/execution-events.ts";

function createRequest() {
  return {
    request_id: "req-001",
    bridge_kind: "llm",
    request_kind: "task",
    created_at: "2026-04-13T00:00:00.000Z",
    worker_ref: {
      worker_id: "00000000-0000-4000-8000-300000000010",
      group_id: "00000000-0000-4000-8000-300000000001",
    },
    context_ref: {
      project_id: "00000000-0000-4000-8000-300000000000",
      objective_id: "00000000-0000-4000-8000-300000000020",
      work_item_id: "00000000-0000-4000-8000-300000000030",
    },
    instruction_set: {
      task_brief: "Prepare a neutral execution summary",
      constraints: ["Stay inside mother-runtime boundaries"],
      expected_artifacts: ["summary"],
    },
  };
}

test("[workforce] execution contracts remain provider-neutral", () => {
  const request = createRequest();
  const result = {
    request_id: request.request_id,
    execution_id: "exec-001",
    bridge_kind: request.bridge_kind,
    worker_id: request.worker_ref.worker_id,
    status: "completed",
    started_at: "2026-04-13T00:00:10.000Z",
    completed_at: "2026-04-13T00:00:30.000Z",
    output: {
      summary: "Completed neutral execution summary",
    },
    notes: ["Bridge returned a bounded result."],
  };

  const events = build_execution_events(request, result);
  const serialized = JSON.stringify({
    request,
    result,
    events,
  });

  assert.deepEqual(
    events.map((event) => event.event_type),
    ["execution_requested", "execution_started", "execution_completed"]
  );
  assert.ok(!/openai|anthropic|langgraph|crewai|provider/u.test(serialized));
});

test("[workforce] execution bridge contract accepts generic bridges and rejects invalid values", async () => {
  const bridge = {
    async execute(request) {
      return {
        request_id: request.request_id,
        execution_id: "exec-002",
        bridge_kind: request.bridge_kind,
        worker_id: request.worker_ref.worker_id,
        status: "failed",
        started_at: "2026-04-13T00:01:00.000Z",
        completed_at: "2026-04-13T00:01:05.000Z",
        error: {
          code: "execution_failed",
          message: "Synthetic failure for contract verification",
        },
        notes: ["Generic mock bridge only."],
      };
    },
    describe_capabilities() {
      return {
        bridge_kind: "llm",
        supports_async_completion: true,
        supports_streaming: false,
        supports_structured_output: true,
        notes: ["No provider implementation attached."],
      };
    },
  };

  assert.doesNotThrow(() => assert_execution_bridge_contract(bridge));
  assert.throws(() => assert_execution_bridge_contract({}));

  const result = await bridge.execute(createRequest());
  const events = build_execution_events(createRequest(), result);

  assert.equal(result.status, "failed");
  assert.equal(events.at(-1)?.event_type, "execution_failed");
});
