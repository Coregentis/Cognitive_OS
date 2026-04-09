import type {
  RegistryEntryRecord,
  RuntimeObjectRecord,
} from "./runtime-types";

export interface PolicyEvaluationRequest {
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
  ): Promise<PolicyEvaluationResult> | PolicyEvaluationResult;
}
