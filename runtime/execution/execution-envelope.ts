export const EXECUTION_BRIDGE_KINDS = ["llm", "agent"] as const;

export type ExecutionBridgeKind =
  (typeof EXECUTION_BRIDGE_KINDS)[number];

export const EXECUTION_REQUEST_KINDS = [
  "plan",
  "task",
  "review",
  "synthesize",
] as const;

export type ExecutionRequestKind =
  (typeof EXECUTION_REQUEST_KINDS)[number];

export const EXECUTION_RESULT_STATUSES = [
  "accepted",
  "completed",
  "failed",
] as const;

export type ExecutionResultStatus =
  (typeof EXECUTION_RESULT_STATUSES)[number];

export interface ExecutionWorkerRef {
  worker_id: string;
  group_id?: string;
  role_profile_id?: string;
}

export interface ExecutionContextRef {
  project_id: string;
  objective_id?: string;
  work_item_id?: string;
  memory_profile_id?: string;
  preference_profile_id?: string;
}

export interface ExecutionInstructionSet {
  task_brief: string;
  system_brief?: string;
  constraints?: string[];
  expected_artifacts?: string[];
}

export interface ExecutionRequestEnvelope {
  request_id: string;
  bridge_kind: ExecutionBridgeKind;
  request_kind: ExecutionRequestKind;
  created_at: string;
  worker_ref: ExecutionWorkerRef;
  context_ref: ExecutionContextRef;
  instruction_set: ExecutionInstructionSet;
  metadata?: Record<string, unknown>;
}

export interface ExecutionErrorSurface {
  code:
    | "bridge_unavailable"
    | "invalid_request"
    | "execution_rejected"
    | "execution_failed";
  message: string;
  details?: Record<string, unknown>;
}

export interface ExecutionOutputEnvelope {
  summary: string;
  artifacts?: Record<string, unknown>[];
  raw_result?: Record<string, unknown>;
}

export interface ExecutionResultEnvelope {
  request_id: string;
  execution_id: string;
  bridge_kind: ExecutionBridgeKind;
  worker_id: string;
  status: ExecutionResultStatus;
  started_at?: string;
  completed_at?: string;
  output?: ExecutionOutputEnvelope;
  error?: ExecutionErrorSurface;
  notes: string[];
}
