import { createHash } from "node:crypto";

import type {
  HumanConfirmedActionPreparation,
  HumanConfirmedActionPreparationActionKind,
  HumanConfirmedActionPreparationBlockedAction,
  HumanConfirmedActionPreparationBoundaryFlags,
  HumanConfirmedActionPreparationConfirmationBoundary,
  HumanConfirmedActionPreparationEvidenceRef,
  HumanConfirmedActionPreparationOmission,
  HumanConfirmedActionPreparationRiskSummary,
  HumanConfirmedActionPreparationState,
  HumanConfirmedActionPreparationStateTransitionRecord,
} from "./human-confirmed-action-preparation-dto.ts";

export type CreateHumanConfirmedActionPreparationInput = {
  action_preparation_id?: string;
  objective_ref: string;
  prepared_action_title: string;
  prepared_action_summary: string;
  action_kind: HumanConfirmedActionPreparationActionKind;
  target_surface_ref: string;
  requested_by_ref: string;
  current_state?: HumanConfirmedActionPreparationState;
  evidence_refs?: readonly HumanConfirmedActionPreparationEvidenceRefInput[];
  risk_summary: HumanConfirmedActionPreparationRiskSummaryInput;
  expected_outcome: string;
  blocked_actions?: readonly HumanConfirmedActionPreparationBlockedActionInput[];
  omissions?: readonly HumanConfirmedActionPreparationOmissionInput[];
  state_transition_record?: readonly HumanConfirmedActionPreparationStateTransitionRecord[];
};

export type HumanConfirmedActionPreparationEvidenceRefInput =
  | string
  | {
      evidence_ref: string;
      evidence_kind?: string;
      summary?: string;
    };

export type HumanConfirmedActionPreparationRiskSummaryInput = {
  risk_level?: HumanConfirmedActionPreparationRiskSummary["risk_level"];
  summary: string;
  boundary_summary: string;
  mitigations?: readonly string[];
};

export type HumanConfirmedActionPreparationBlockedActionInput =
  | HumanConfirmedActionPreparationBlockedAction["action"]
  | {
      action: HumanConfirmedActionPreparationBlockedAction["action"];
      reason?: string;
    };

export type HumanConfirmedActionPreparationOmissionInput = {
  marker: string;
  reason: string;
};

export type HumanConfirmedActionPreparationSummary = {
  action_preparation_id: string;
  prepared_action_title: string;
  action_kind: HumanConfirmedActionPreparationActionKind;
  current_state: HumanConfirmedActionPreparationState;
  human_authority_required: true;
  autonomous_execution_authorized: false;
  confirmation_is_not_execution: true;
  prepares_action: true;
  executes_action: false;
  allowed_next_states: readonly HumanConfirmedActionPreparationState[];
  evidence_ref_count: number;
  blocked_action_count: number;
  omission_count: number;
  eligible_for_future_execution_bridge_only_after_separate_authorization: boolean;
};

export type TransitionHumanConfirmedActionPreparationStateInput = {
  preparation: HumanConfirmedActionPreparation;
  to_state: HumanConfirmedActionPreparationState;
  transitioned_by_ref?: string;
  transitioned_at?: string;
  transition_summary?: string;
};

const ACTION_KINDS = [
  "review_decision",
  "draft_message",
  "draft_content",
  "prepare_change",
  "prepare_export",
  "prepare_internal_handoff",
  "other",
] as const satisfies readonly HumanConfirmedActionPreparationActionKind[];

const STATES = [
  "prepared",
  "needs_human_review",
  "confirmed_by_human",
  "rejected_by_human",
  "revised_by_human",
  "parked",
  "expired",
] as const satisfies readonly HumanConfirmedActionPreparationState[];

export const HUMAN_CONFIRMED_ACTION_PREPARATION_ALLOWED_TRANSITIONS = {
  prepared: ["needs_human_review", "parked"],
  needs_human_review: [
    "confirmed_by_human",
    "rejected_by_human",
    "revised_by_human",
    "parked",
  ],
  confirmed_by_human: ["parked"],
  rejected_by_human: ["revised_by_human", "parked"],
  revised_by_human: ["needs_human_review", "parked"],
  parked: ["needs_human_review"],
  expired: ["parked"],
} as const satisfies Record<
  HumanConfirmedActionPreparationState,
  readonly HumanConfirmedActionPreparationState[]
>;

const DEFAULT_BLOCKED_ACTIONS: readonly HumanConfirmedActionPreparationBlockedAction[] =
  [
    {
      action: "provider_execution",
      blocked: true,
      reason: "Prepared actions do not authorize provider execution.",
    },
    {
      action: "model_execution",
      blocked: true,
      reason: "Prepared actions do not authorize model execution.",
    },
    {
      action: "tool_execution",
      blocked: true,
      reason: "Prepared actions do not authorize tool execution.",
    },
    {
      action: "worker_execution",
      blocked: true,
      reason: "Prepared actions do not authorize worker execution.",
    },
    {
      action: "publishing",
      blocked: true,
      reason: "Prepared actions do not authorize publishing.",
    },
    {
      action: "payment",
      blocked: true,
      reason: "Prepared actions do not authorize payment.",
    },
    {
      action: "customer_outreach",
      blocked: true,
      reason: "Prepared actions do not authorize customer outreach.",
    },
    {
      action: "external_action",
      blocked: true,
      reason: "Prepared actions do not authorize external action.",
    },
    {
      action: "automatic_mutation",
      blocked: true,
      reason: "Prepared actions do not authorize automatic mutation.",
    },
    {
      action: "autonomous_acceptance",
      blocked: true,
      reason: "Prepared actions do not authorize autonomous acceptance.",
    },
    {
      action: "training",
      blocked: true,
      reason: "Prepared actions do not authorize training.",
    },
    {
      action: "writeback",
      blocked: true,
      reason: "Prepared actions do not authorize writeback.",
    },
    {
      action: "execution_bridge",
      blocked: true,
      reason:
        "Prepared actions require a later separately authorized execution bridge before any execution can exist.",
    },
  ];

const DEFAULT_CONFIRMATION_BOUNDARY = {
  human_final_authority: true,
  explicit_confirmation_required: true,
  confirmation_is_not_execution: true,
  no_autonomous_approval: true,
} as const satisfies HumanConfirmedActionPreparationConfirmationBoundary;

const DEFAULT_BOUNDARY_FLAGS = {
  projection_safe: true,
  summary_only: true,
  non_executing: true,
  evidence_safe: true,
  prepares_action: true,
  executes_action: false,
  authorizes_provider_execution: false,
  authorizes_model_execution: false,
  authorizes_tool_execution: false,
  authorizes_worker_execution: false,
  authorizes_publishing: false,
  authorizes_payment: false,
  authorizes_customer_outreach: false,
  authorizes_external_action: false,
  authorizes_automatic_mutation: false,
  authorizes_autonomous_acceptance: false,
  authorizes_training: false,
  authorizes_writeback: false,
  requires_human_confirmation_before_execution_bridge: true,
} as const satisfies HumanConfirmedActionPreparationBoundaryFlags;

const REQUIRED_TRUE_FLAG_KEYS = [
  "projection_safe",
  "summary_only",
  "non_executing",
  "evidence_safe",
  "prepares_action",
  "requires_human_confirmation_before_execution_bridge",
] as const satisfies readonly (keyof HumanConfirmedActionPreparationBoundaryFlags)[];

const REQUIRED_FALSE_FLAG_KEYS = [
  "executes_action",
  "authorizes_provider_execution",
  "authorizes_model_execution",
  "authorizes_tool_execution",
  "authorizes_worker_execution",
  "authorizes_publishing",
  "authorizes_payment",
  "authorizes_customer_outreach",
  "authorizes_external_action",
  "authorizes_automatic_mutation",
  "authorizes_autonomous_acceptance",
  "authorizes_training",
  "authorizes_writeback",
] as const satisfies readonly (keyof HumanConfirmedActionPreparationBoundaryFlags)[];

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function requireText(value: unknown, fieldName: string): string {
  if (!hasText(value)) {
    throw new Error(`${fieldName} is required`);
  }

  return value.trim();
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value).sort(([left], [right]) =>
      left.localeCompare(right)
    );
    return `{${entries
      .map(([key, nested]) => `${JSON.stringify(key)}:${stableStringify(nested)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function deterministicId(prefix: string, seed: unknown): string {
  return `${prefix}_${createHash("sha1")
    .update(stableStringify(seed))
    .digest("hex")
    .slice(0, 16)}`;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeState(
  state: HumanConfirmedActionPreparationState | undefined
): HumanConfirmedActionPreparationState {
  if (state === undefined) {
    return "prepared";
  }

  if (!(STATES as readonly string[]).includes(state)) {
    throw new Error("current_state is unsupported");
  }

  return state;
}

function normalizeEvidenceRef(
  value: HumanConfirmedActionPreparationEvidenceRefInput,
  index: number
): HumanConfirmedActionPreparationEvidenceRef {
  if (typeof value === "string") {
    return {
      evidence_ref: requireText(value, `evidence_refs[${index}]`),
      ref_only: true,
      runtime_private_payload_omitted: true,
    };
  }

  if (!isRecord(value)) {
    throw new Error(`evidence_refs[${index}] must be a string or object`);
  }

  const allowedKeys = ["evidence_ref", "evidence_kind", "summary"];
  const unexpectedKeys = Object.keys(value).filter(
    (key) => !allowedKeys.includes(key)
  );
  if (unexpectedKeys.length > 0) {
    throw new Error(`evidence_refs[${index}] must remain ref-only`);
  }

  return {
    evidence_ref: requireText(value.evidence_ref, `evidence_refs[${index}].evidence_ref`),
    evidence_kind: hasText(value.evidence_kind) ? value.evidence_kind.trim() : undefined,
    summary: hasText(value.summary) ? value.summary.trim() : undefined,
    ref_only: true,
    runtime_private_payload_omitted: true,
  };
}

function normalizeEvidenceRefs(
  refs: readonly HumanConfirmedActionPreparationEvidenceRefInput[] | undefined
): HumanConfirmedActionPreparationEvidenceRef[] {
  return (refs ?? []).map((ref, index) => normalizeEvidenceRef(ref, index));
}

function normalizeRiskSummary(
  riskSummary: HumanConfirmedActionPreparationRiskSummaryInput
): HumanConfirmedActionPreparationRiskSummary {
  const riskLevel = riskSummary.risk_level ?? "unknown";

  if (!["low", "medium", "high", "unknown"].includes(riskLevel)) {
    throw new Error("risk_summary.risk_level is unsupported");
  }

  return {
    risk_level: riskLevel,
    summary: requireText(riskSummary.summary, "risk_summary.summary"),
    boundary_summary: requireText(
      riskSummary.boundary_summary,
      "risk_summary.boundary_summary"
    ),
    mitigations: riskSummary.mitigations?.map((mitigation, index) =>
      requireText(mitigation, `risk_summary.mitigations[${index}]`)
    ),
    summary_only: true,
  };
}

function normalizeBlockedAction(
  value: HumanConfirmedActionPreparationBlockedActionInput,
  index: number
): HumanConfirmedActionPreparationBlockedAction {
  if (typeof value === "string") {
    return {
      action: value,
      blocked: true,
      reason: `Prepared actions do not authorize ${value}.`,
    };
  }

  if (!isRecord(value)) {
    throw new Error(`blocked_actions[${index}] must be a string or object`);
  }

  return {
    action: requireText(value.action, `blocked_actions[${index}].action`) as
      HumanConfirmedActionPreparationBlockedAction["action"],
    blocked: true,
    reason: hasText(value.reason)
      ? value.reason.trim()
      : "Prepared actions do not authorize this action.",
  };
}

function normalizeBlockedActions(
  value: readonly HumanConfirmedActionPreparationBlockedActionInput[] | undefined
): HumanConfirmedActionPreparationBlockedAction[] {
  if (value === undefined) {
    return cloneJson([...DEFAULT_BLOCKED_ACTIONS]);
  }

  return value.map((entry, index) => normalizeBlockedAction(entry, index));
}

function normalizeOmissions(
  omissions: readonly HumanConfirmedActionPreparationOmissionInput[] | undefined
): HumanConfirmedActionPreparationOmission[] {
  return (omissions ?? []).map((omission, index) => ({
    marker: requireText(omission.marker, `omissions[${index}].marker`),
    reason: requireText(omission.reason, `omissions[${index}].reason`),
    runtime_private: true,
  }));
}

function createTransitionRef(
  fromState: HumanConfirmedActionPreparationState,
  toState: HumanConfirmedActionPreparationState,
  existingCount: number,
  summary?: string
): string {
  return deterministicId("action_preparation_transition", {
    fromState,
    toState,
    existingCount,
    summary,
  });
}

function allowedNextStates(
  state: HumanConfirmedActionPreparationState
): readonly HumanConfirmedActionPreparationState[] {
  return HUMAN_CONFIRMED_ACTION_PREPARATION_ALLOWED_TRANSITIONS[state];
}

export function createHumanConfirmedActionPreparation(
  input: CreateHumanConfirmedActionPreparationInput
): HumanConfirmedActionPreparation {
  const currentState = normalizeState(input.current_state);
  const evidenceRefs = normalizeEvidenceRefs(input.evidence_refs);
  const riskSummary = normalizeRiskSummary(input.risk_summary);
  const blockedActions = normalizeBlockedActions(input.blocked_actions);
  const omissions = normalizeOmissions(input.omissions);
  const actionKind = input.action_kind;

  if (!(ACTION_KINDS as readonly string[]).includes(actionKind)) {
    throw new Error("action_kind is unsupported");
  }

  const normalizedInputForId = {
    objective_ref: input.objective_ref,
    prepared_action_title: input.prepared_action_title,
    prepared_action_summary: input.prepared_action_summary,
    action_kind: actionKind,
    target_surface_ref: input.target_surface_ref,
    requested_by_ref: input.requested_by_ref,
    expected_outcome: input.expected_outcome,
    evidenceRefs,
    riskSummary,
  };

  const preparation: HumanConfirmedActionPreparation = {
    action_preparation_id: hasText(input.action_preparation_id)
      ? input.action_preparation_id.trim()
      : deterministicId("human_confirmed_action_preparation", normalizedInputForId),
    objective_ref: requireText(input.objective_ref, "objective_ref"),
    prepared_action_title: requireText(
      input.prepared_action_title,
      "prepared_action_title"
    ),
    prepared_action_summary: requireText(
      input.prepared_action_summary,
      "prepared_action_summary"
    ),
    action_kind: actionKind,
    target_surface_ref: requireText(input.target_surface_ref, "target_surface_ref"),
    requested_by_ref: requireText(input.requested_by_ref, "requested_by_ref"),
    human_authority_required: true,
    autonomous_execution_authorized: false,
    current_state: currentState,
    confirmation_boundary: cloneJson(DEFAULT_CONFIRMATION_BOUNDARY),
    evidence_refs: evidenceRefs,
    risk_summary: riskSummary,
    expected_outcome: requireText(input.expected_outcome, "expected_outcome"),
    allowed_next_states: [...allowedNextStates(currentState)],
    blocked_actions: blockedActions,
    omissions,
    boundary_flags: cloneJson(DEFAULT_BOUNDARY_FLAGS),
    state_transition_record: cloneJson([
      ...(input.state_transition_record ?? []),
    ]),
  };

  const issues = validateHumanConfirmedActionPreparation(preparation);
  if (issues.length > 0) {
    throw new Error(issues.join("; "));
  }

  return preparation;
}

export function validateHumanConfirmedActionPreparation(
  preparation: HumanConfirmedActionPreparation
): readonly string[] {
  const issues: string[] = [];

  if (!hasText(preparation.action_preparation_id)) {
    issues.push("action_preparation_id is required");
  }
  if (!hasText(preparation.objective_ref)) {
    issues.push("objective_ref is required");
  }
  if (!hasText(preparation.prepared_action_title)) {
    issues.push("prepared_action_title is required");
  }
  if (!hasText(preparation.prepared_action_summary)) {
    issues.push("prepared_action_summary is required");
  }
  if (!(ACTION_KINDS as readonly string[]).includes(preparation.action_kind)) {
    issues.push("action_kind is unsupported");
  }
  if (!hasText(preparation.target_surface_ref)) {
    issues.push("target_surface_ref is required");
  }
  if (!hasText(preparation.requested_by_ref)) {
    issues.push("requested_by_ref is required");
  }
  if (preparation.human_authority_required !== true) {
    issues.push("human_authority_required must be true");
  }
  if (preparation.autonomous_execution_authorized !== false) {
    issues.push("autonomous_execution_authorized must be false");
  }
  if (!(STATES as readonly string[]).includes(preparation.current_state)) {
    issues.push("current_state is unsupported");
  }
  if (!hasText(preparation.expected_outcome)) {
    issues.push("expected_outcome is required");
  }

  const boundary = preparation.confirmation_boundary;
  if (boundary?.human_final_authority !== true) {
    issues.push("confirmation_boundary.human_final_authority must be true");
  }
  if (boundary?.explicit_confirmation_required !== true) {
    issues.push(
      "confirmation_boundary.explicit_confirmation_required must be true"
    );
  }
  if (boundary?.confirmation_is_not_execution !== true) {
    issues.push("confirmation_boundary.confirmation_is_not_execution must be true");
  }
  if (boundary?.no_autonomous_approval !== true) {
    issues.push("confirmation_boundary.no_autonomous_approval must be true");
  }

  const risk = preparation.risk_summary;
  if (!["low", "medium", "high", "unknown"].includes(risk?.risk_level)) {
    issues.push("risk_summary.risk_level is unsupported");
  }
  if (!hasText(risk?.summary)) {
    issues.push("risk_summary.summary is required");
  }
  if (!hasText(risk?.boundary_summary)) {
    issues.push("risk_summary.boundary_summary is required");
  }
  if (risk?.summary_only !== true) {
    issues.push("risk_summary.summary_only must be true");
  }

  if (!Array.isArray(preparation.evidence_refs)) {
    issues.push("evidence_refs must be an array");
  } else {
    preparation.evidence_refs.forEach((evidenceRef, index) => {
      if (!hasText(evidenceRef.evidence_ref)) {
        issues.push(`evidence_refs[${index}].evidence_ref is required`);
      }
      if (evidenceRef.ref_only !== true) {
        issues.push(`evidence_refs[${index}].ref_only must be true`);
      }
      if (evidenceRef.runtime_private_payload_omitted !== true) {
        issues.push(
          `evidence_refs[${index}].runtime_private_payload_omitted must be true`
        );
      }
    });
  }

  const expectedNextStates = allowedNextStates(preparation.current_state);
  if (!Array.isArray(preparation.allowed_next_states)) {
    issues.push("allowed_next_states must be an array");
  } else if (
    stableStringify([...preparation.allowed_next_states]) !==
    stableStringify([...expectedNextStates])
  ) {
    issues.push("allowed_next_states must match current_state transition table");
  }

  if (!Array.isArray(preparation.blocked_actions)) {
    issues.push("blocked_actions must be an array");
  } else {
    for (const [index, blockedAction] of preparation.blocked_actions.entries()) {
      if (!hasText(blockedAction.action)) {
        issues.push(`blocked_actions[${index}].action is required`);
      }
      if (blockedAction.blocked !== true) {
        issues.push(`blocked_actions[${index}].blocked must be true`);
      }
      if (!hasText(blockedAction.reason)) {
        issues.push(`blocked_actions[${index}].reason is required`);
      }
    }
  }

  if (!Array.isArray(preparation.omissions)) {
    issues.push("omissions must be an array");
  } else {
    for (const [index, omission] of preparation.omissions.entries()) {
      if (!hasText(omission.marker)) {
        issues.push(`omissions[${index}].marker is required`);
      }
      if (!hasText(omission.reason)) {
        issues.push(`omissions[${index}].reason is required`);
      }
      if (omission.runtime_private !== true) {
        issues.push(`omissions[${index}].runtime_private must be true`);
      }
    }
  }

  const flags = preparation.boundary_flags;
  for (const flag of REQUIRED_TRUE_FLAG_KEYS) {
    if (flags?.[flag] !== true) {
      issues.push(`boundary_flags.${flag} must be true`);
    }
  }
  for (const flag of REQUIRED_FALSE_FLAG_KEYS) {
    if (flags?.[flag] !== false) {
      issues.push(`boundary_flags.${flag} must be false`);
    }
  }

  if (!Array.isArray(preparation.state_transition_record)) {
    issues.push("state_transition_record must be an array");
  } else {
    for (const [index, transition] of preparation.state_transition_record.entries()) {
      if (!hasText(transition.transition_ref)) {
        issues.push(`state_transition_record[${index}].transition_ref is required`);
      }
      if (!(STATES as readonly string[]).includes(transition.from_state)) {
        issues.push(`state_transition_record[${index}].from_state is unsupported`);
      }
      if (!(STATES as readonly string[]).includes(transition.to_state)) {
        issues.push(`state_transition_record[${index}].to_state is unsupported`);
      }
      if (
        !HUMAN_CONFIRMED_ACTION_PREPARATION_ALLOWED_TRANSITIONS[
          transition.from_state
        ]?.includes(transition.to_state)
      ) {
        issues.push(`state_transition_record[${index}] transition is not allowed`);
      }
      if (transition.confirmation_is_not_execution !== true) {
        issues.push(
          `state_transition_record[${index}].confirmation_is_not_execution must be true`
        );
      }
      if (transition.non_executing !== true) {
        issues.push(`state_transition_record[${index}].non_executing must be true`);
      }
    }
  }

  return [...new Set(issues)];
}

export function summarizeHumanConfirmedActionPreparation(
  preparation: HumanConfirmedActionPreparation
): HumanConfirmedActionPreparationSummary {
  return {
    action_preparation_id: preparation.action_preparation_id,
    prepared_action_title: preparation.prepared_action_title,
    action_kind: preparation.action_kind,
    current_state: preparation.current_state,
    human_authority_required: true,
    autonomous_execution_authorized: false,
    confirmation_is_not_execution:
      preparation.confirmation_boundary.confirmation_is_not_execution,
    prepares_action: preparation.boundary_flags.prepares_action,
    executes_action: preparation.boundary_flags.executes_action,
    allowed_next_states: [...preparation.allowed_next_states],
    evidence_ref_count: preparation.evidence_refs.length,
    blocked_action_count: preparation.blocked_actions.length,
    omission_count: preparation.omissions.length,
    eligible_for_future_execution_bridge_only_after_separate_authorization:
      preparation.current_state === "confirmed_by_human" &&
      preparation.boundary_flags.executes_action === false,
  };
}

export function transitionHumanConfirmedActionPreparationState(
  input: TransitionHumanConfirmedActionPreparationStateInput
): HumanConfirmedActionPreparation {
  const fromState = input.preparation.current_state;
  const toState = input.to_state;
  const allowed = HUMAN_CONFIRMED_ACTION_PREPARATION_ALLOWED_TRANSITIONS[fromState];

  if (!allowed.includes(toState)) {
    throw new Error(
      `transition ${fromState} -> ${toState} is not allowed for human-confirmed action preparation`
    );
  }

  const transitionRecord: HumanConfirmedActionPreparationStateTransitionRecord = {
    transition_ref: createTransitionRef(
      fromState,
      toState,
      input.preparation.state_transition_record.length,
      input.transition_summary
    ),
    from_state: fromState,
    to_state: toState,
    transitioned_by_ref: hasText(input.transitioned_by_ref)
      ? input.transitioned_by_ref.trim()
      : undefined,
    transitioned_at: hasText(input.transitioned_at)
      ? input.transitioned_at.trim()
      : undefined,
    transition_summary: hasText(input.transition_summary)
      ? input.transition_summary.trim()
      : undefined,
    confirmation_is_not_execution: true,
    non_executing: true,
  };

  const transitioned: HumanConfirmedActionPreparation = {
    ...cloneJson(input.preparation),
    current_state: toState,
    allowed_next_states: [...allowedNextStates(toState)],
    human_authority_required: true,
    autonomous_execution_authorized: false,
    confirmation_boundary: cloneJson(DEFAULT_CONFIRMATION_BOUNDARY),
    boundary_flags: cloneJson(DEFAULT_BOUNDARY_FLAGS),
    state_transition_record: [
      ...cloneJson(input.preparation.state_transition_record),
      transitionRecord,
    ],
  };

  const issues = validateHumanConfirmedActionPreparation(transitioned);
  if (issues.length > 0) {
    throw new Error(issues.join("; "));
  }

  return transitioned;
}
