import type {
  RegistryEntryRecord,
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
  notes: string[];
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

    return {
      matched_rule_ids,
      confirm_required: is_change_scenario,
      suppressed: suppression_requested,
      notes,
    };
  }
}
