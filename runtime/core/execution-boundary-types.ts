// Neutral execution-boundary surfaces now include a minimal scaffold in this
// wave. They remain projection-safe, non-executing, non-approving,
// non-dispatching, non-provider, and non-queueing.

export const EXECUTION_BOUNDARY_DESIGN_SURFACES = [
  "ExecutionBoundaryProjection",
  "ExecutionBoundaryRequirementSummary",
  "ExecutionBoundaryRiskWarning",
  "ExecutionBoundaryPreflightChecklist",
  "ExecutionBoundaryAcknowledgmentRequirement",
  "ExecutionBoundaryTransitionPosture",
  "ExecutionBoundarySafeEvidenceRef",
] as const;

export const EXECUTION_BOUNDARY_NON_CAPABILITY_LINES = [
  "Execution boundary is explanatory and draft-like.",
  "Execution boundary is projection-safe.",
  "Execution boundary is not execution.",
  "Execution boundary is not approval automation.",
  "Execution boundary is not dispatch.",
  "Execution boundary is not provider/channel send.",
  "Execution boundary is not queue insertion.",
  "Execution boundary is not autonomous operation.",
] as const;

export const EXECUTION_BOUNDARY_DEFAULT_NON_EXECUTING_POSTURE =
  "Execution boundary remains projection-safe and non-executing." as const;

export interface ExecutionBoundarySafeEvidenceRef {
  evidence_ref: string;
  evidence_label?: string;
}

export type ExecutionBoundarySafeEvidenceRefInput =
  | string
  | ExecutionBoundarySafeEvidenceRef;

export interface ExecutionBoundaryRequirementSummary {
  requirement_summary: string;
  non_executing_posture: string;
}

export interface ExecutionBoundaryRiskWarning {
  risk_warning: string;
  non_executing_posture: string;
}

export interface ExecutionBoundaryPreflightChecklist {
  preflight_checklist: string[];
  runtime_private_fields_omitted: true;
}

export interface ExecutionBoundaryAcknowledgmentRequirement {
  acknowledgment_required: boolean;
  acknowledgment_requirement: string;
  runtime_private_fields_omitted: true;
  non_executing_posture: string;
}

export interface ExecutionBoundaryTransitionPosture {
  non_executing_posture: string;
  provider_channel_execution_available: false;
  approval_dispatch_execution_available: false;
  queue_available: false;
  authoritative_transition_state_available: false;
  runtime_private_fields_omitted: true;
}

export interface ExecutionBoundaryProjection {
  execution_boundary_id: string;
  project_id: string;
  requirement_summary: ExecutionBoundaryRequirementSummary;
  risk_warning: ExecutionBoundaryRiskWarning;
  preflight_checklist: ExecutionBoundaryPreflightChecklist;
  acknowledgment_requirement: ExecutionBoundaryAcknowledgmentRequirement;
  transition_posture: ExecutionBoundaryTransitionPosture;
  safe_evidence_refs: ExecutionBoundarySafeEvidenceRef[];
  runtime_private_fields_omitted: true;
  created_at: string;
}

export interface CreateExecutionBoundaryRequirementSummaryInput {
  requirement_summary: string;
  non_executing_posture?: string;
}

export interface CreateExecutionBoundaryRiskWarningInput {
  risk_warning: string;
  non_executing_posture?: string;
}

export interface CreateExecutionBoundaryPreflightChecklistInput {
  preflight_checklist: string[];
}

export interface CreateExecutionBoundaryAcknowledgmentRequirementInput {
  acknowledgment_required: boolean;
  acknowledgment_requirement: string;
  non_executing_posture?: string;
}

export interface CreateExecutionBoundaryTransitionPostureInput {
  non_executing_posture?: string;
}

export interface CreateExecutionBoundaryProjectionInput {
  execution_boundary_id?: string;
  project_id: string;
  requirement_summary:
    | ExecutionBoundaryRequirementSummary
    | CreateExecutionBoundaryRequirementSummaryInput;
  risk_warning:
    | ExecutionBoundaryRiskWarning
    | CreateExecutionBoundaryRiskWarningInput;
  preflight_checklist:
    | ExecutionBoundaryPreflightChecklist
    | CreateExecutionBoundaryPreflightChecklistInput;
  acknowledgment_requirement:
    | ExecutionBoundaryAcknowledgmentRequirement
    | CreateExecutionBoundaryAcknowledgmentRequirementInput;
  transition_posture?:
    | ExecutionBoundaryTransitionPosture
    | CreateExecutionBoundaryTransitionPostureInput;
  safe_evidence_refs?: ExecutionBoundarySafeEvidenceRefInput[];
  created_at?: string;
}
