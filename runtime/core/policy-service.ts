import type {
  RegistryEntryRecord,
  RuntimeObjectRecord,
} from "./runtime-types";

export interface PolicyEvaluationRequest {
  scenario_id?: string;
  candidate_object: RuntimeObjectRecord;
  registry_entry?: RegistryEntryRecord;
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
  evaluate_policies(
    request: PolicyEvaluationRequest
  ): PolicyEvaluationResult {
    const is_change_scenario =
      request.scenario_id === "requirement-change-midflow";

    return {
      matched_rule_ids: is_change_scenario
        ? ["change_requires_confirm"]
        : ["fresh_intent_default_path"],
      confirm_required: is_change_scenario,
      suppressed: false,
      notes: is_change_scenario
        ? ["Requirement-change path requires explicit confirm in the execution baseline."]
        : ["Fresh-intent path proceeds without a required confirm gate in the execution baseline."],
    };
  }
}
