import type {
  RegistryEntryRecord,
  RuntimeActionClass,
  RuntimeActionClassEvaluation,
  RuntimeActionReadinessStatus,
  RuntimeObjectRecord,
} from "./runtime-types";

export interface PolicyEvaluationRequest {
  scenario_id?: string;
  candidate_object: RuntimeObjectRecord;
  registry_entry?: RegistryEntryRecord;
  raw_input?: Record<string, unknown>;
  explicit_reconcile_tension?: boolean;
}

export interface PolicyEvaluationResult {
  matched_rule_ids: string[];
  confirm_required: boolean;
  suppressed: boolean;
  action_class: RuntimeActionClass;
  allowed: boolean;
  requires_confirmation: boolean;
  blocked: boolean;
  readiness_status: RuntimeActionReadinessStatus;
  reason: string;
  evidence_refs: string[];
  risk_notes: string[];
  notes: string[];
}

export interface RuntimeActionClassificationInput {
  action_kind?: string;
  action_summary?: string;
  updates_local_state?: boolean;
  updates_local_files?: boolean;
  prepares_external_draft?: boolean;
  requests_external_dispatch?: boolean;
  irreversible_risk?: boolean;
  evidence_refs?: string[];
  risk_notes?: string[];
}

function unique_strings(values: unknown[] = []): string[] {
  return [...new Set(
    values.filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0
    ).map((value) => value.trim())
  )].sort();
}

function has_irreversible_risk_text(value: string): boolean {
  return /\b(payment|trading|purchase|legal|irreversible)\b/i.test(value);
}

function derive_runtime_action_readiness_status(args: {
  action_class: RuntimeActionClass;
  blocked: boolean;
  requires_confirmation: boolean;
}): RuntimeActionReadinessStatus {
  if (args.blocked) {
    return "blocked";
  }

  if (args.action_class === "limited_external_dispatch") {
    return "deferred";
  }

  if (args.requires_confirmation) {
    return "needs_review";
  }

  return "ready";
}

export function classify_runtime_action(
  input: RuntimeActionClassificationInput
): RuntimeActionClassEvaluation {
  const action_summary_text = [
    input.action_kind,
    input.action_summary,
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ");
  const evidence_refs = unique_strings(input.evidence_refs ?? []);
  const risk_notes = unique_strings(input.risk_notes ?? []);

  if (input.irreversible_risk === true || has_irreversible_risk_text(action_summary_text)) {
    return {
      action_class: "forbidden_irreversible",
      allowed: false,
      requires_confirmation: true,
      blocked: true,
      readiness_status: "blocked",
      reason:
        "Irreversible financial, purchase, trading, or legal action is always blocked in the current runtime foundation.",
      evidence_refs,
      risk_notes: unique_strings([
        ...risk_notes,
        "forbidden_irreversible actions are always blocked",
      ]),
    };
  }

  if (input.requests_external_dispatch === true) {
    return {
      action_class: "limited_external_dispatch",
      allowed: true,
      requires_confirmation: true,
      blocked: false,
      readiness_status: "deferred",
      reason:
        "Limited external dispatch may be classified, but execution remains deferred until a separately authorized runtime surface exists.",
      evidence_refs,
      risk_notes: unique_strings([
        ...risk_notes,
        "external dispatch remains strongly confirmed and deferred",
      ]),
    };
  }

  if (input.prepares_external_draft === true) {
    return {
      action_class: "external_draft",
      allowed: true,
      requires_confirmation: true,
      blocked: false,
      readiness_status: "needs_review",
      reason:
        "External draft preparation is allowed as draft-only output and requires confirmation before any downstream external use.",
      evidence_refs,
      risk_notes: unique_strings([
        ...risk_notes,
        "external drafts remain non-dispatched",
      ]),
    };
  }

  if (input.updates_local_files === true) {
    return {
      action_class: "reviewable_local",
      allowed: true,
      requires_confirmation: true,
      blocked: false,
      readiness_status: "needs_review",
      reason:
        "Local file or task updates are reviewable-local and require a light review boundary.",
      evidence_refs,
      risk_notes: unique_strings([
        ...risk_notes,
        "local updates remain bounded to reviewable scope",
      ]),
    };
  }

  return {
    action_class: "auto_local",
    allowed: true,
    requires_confirmation: false,
    blocked: false,
    readiness_status: derive_runtime_action_readiness_status({
      action_class: "auto_local",
      blocked: false,
      requires_confirmation: false,
    }),
    reason:
      input.updates_local_state === false
        ? "No bounded local update path was declared, so the action defaults to the safest auto-local classification."
        : "Local memory, task, or artifact updates remain auto-local when no external side effect or file-level review boundary is present.",
    evidence_refs,
    risk_notes,
  };
}

export interface PolicyService {
  evaluate_policies(
    request: PolicyEvaluationRequest
  ): PolicyEvaluationResult;
}

export class MinimalPolicyService implements PolicyService {
  private matches_control_signal(
    value: unknown,
    candidates: string[]
  ): boolean {
    const normalized = String(value ?? "")
      .trim()
      .toLowerCase();

    return candidates.includes(normalized);
  }

  evaluate_policies(
    request: PolicyEvaluationRequest
  ): PolicyEvaluationResult {
    const is_change_scenario =
      request.scenario_id === "requirement-change-midflow";
    const action_classification = classify_runtime_action({
      action_kind:
        typeof request.candidate_object.action_kind === "string"
          ? request.candidate_object.action_kind
          : undefined,
      action_summary:
        typeof request.candidate_object.action_summary === "string"
          ? request.candidate_object.action_summary
          : typeof request.raw_input?.action_summary === "string"
            ? request.raw_input.action_summary
            : undefined,
      updates_local_state:
        request.raw_input?.updates_local_state !== false,
      updates_local_files:
        request.raw_input?.updates_local_files === true ||
        request.raw_input?.local_file_update === true,
      prepares_external_draft:
        request.raw_input?.prepares_external_draft === true,
      requests_external_dispatch:
        request.raw_input?.requests_external_dispatch === true,
      irreversible_risk:
        request.raw_input?.irreversible_risk === true,
      evidence_refs:
        Array.isArray(request.raw_input?.evidence_refs)
          ? request.raw_input.evidence_refs
          : [],
      risk_notes:
        Array.isArray(request.raw_input?.risk_notes)
          ? request.raw_input.risk_notes
          : [],
    });
    const suppression_requested =
      this.matches_control_signal(
        request.raw_input?.suppression_signal,
        ["suppress", "suppressed", "block", "blocked"]
      ) ||
      this.matches_control_signal(
        request.raw_input?.activation_control,
        ["suppress", "suppressed", "block", "blocked"]
      );
    const matched_rule_ids = is_change_scenario
      ? ["change_requires_confirm"]
      : ["fresh_intent_default_path"];
    const notes = is_change_scenario
      ? ["Requirement-change path requires explicit confirm in the execution baseline."]
      : ["Fresh-intent path proceeds without a required confirm gate in the execution baseline."];

    if (suppression_requested) {
      matched_rule_ids.push("runtime_policy_suppression");
      notes.push(
        "Runtime-private suppression hint matched, so the action must remain bounded and non-executable."
      );
    }

    if (request.explicit_reconcile_tension) {
      matched_rule_ids.push("explicit_reconcile_tension_observed");
      notes.push(
        "Explicit reconcile tension was observed and will be considered by governed activation assessment."
      );
    }

    if (action_classification.requires_confirmation) {
      matched_rule_ids.push("runtime_action_class_confirmation_required");
      notes.push(
        `Runtime action class ${action_classification.action_class} requires confirmation or review posture.`
      );
    }

    if (action_classification.blocked) {
      matched_rule_ids.push("runtime_action_class_blocked");
      notes.push(action_classification.reason);
    }

    return {
      matched_rule_ids,
      confirm_required:
        is_change_scenario || action_classification.requires_confirmation,
      suppressed: suppression_requested || action_classification.blocked,
      action_class: action_classification.action_class,
      allowed: action_classification.allowed,
      requires_confirmation: action_classification.requires_confirmation,
      blocked: action_classification.blocked,
      readiness_status: action_classification.readiness_status,
      reason: action_classification.reason,
      evidence_refs: [...action_classification.evidence_refs],
      risk_notes: [...action_classification.risk_notes],
      notes,
    };
  }
}
