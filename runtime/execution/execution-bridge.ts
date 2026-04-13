import type {
  ExecutionBridgeKind,
  ExecutionRequestEnvelope,
  ExecutionResultEnvelope,
} from "./execution-envelope.ts";

export interface ExecutionBridgeCapabilities {
  bridge_kind: ExecutionBridgeKind;
  supports_async_completion: boolean;
  supports_streaming: boolean;
  supports_structured_output: boolean;
  notes: string[];
}

export interface ExecutionBridgeContract {
  execute(
    request: ExecutionRequestEnvelope
  ):
    | Promise<ExecutionResultEnvelope>
    | ExecutionResultEnvelope;

  describe_capabilities?():
    | Promise<ExecutionBridgeCapabilities>
    | ExecutionBridgeCapabilities;
}

export function is_execution_bridge_contract(
  value: unknown
): value is ExecutionBridgeContract {
  return Boolean(
    value &&
      typeof value === "object" &&
      "execute" in value &&
      typeof (value as { execute?: unknown }).execute === "function"
  );
}

export function assert_execution_bridge_contract(
  value: unknown
): asserts value is ExecutionBridgeContract {
  if (!is_execution_bridge_contract(value)) {
    throw new Error("Value does not satisfy ExecutionBridgeContract");
  }
}
