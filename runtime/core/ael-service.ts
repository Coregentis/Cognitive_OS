import type { PolicyEvaluationResult } from "./policy-service";
import type {
  RuntimeAelAssessment,
  RuntimeObjectRecord,
  RuntimeReconciliationSnapshot,
} from "./runtime-types";

export interface AssessActivationRequest {
  project_id: string;
  trigger_object: RuntimeObjectRecord;
  activation_signal: RuntimeObjectRecord;
  action_unit: RuntimeObjectRecord;
  policy_result: PolicyEvaluationResult;
  confirm_gate?: RuntimeObjectRecord;
  explicit_reconcile_tension?: boolean;
  reconciliation?: RuntimeReconciliationSnapshot;
  evidence_refs?: string[];
}

export interface AelService {
  assess_activation(
    request: AssessActivationRequest
  ): RuntimeAelAssessment;
}

export class DeterministicAelService implements AelService {
  private unique_ids(values: unknown[]): string[] {
    return [...new Set(
      values.filter(
        (value): value is string =>
          typeof value === "string" && value.length > 0
      )
    )].sort();
  }

  assess_activation(
    request: AssessActivationRequest
  ): RuntimeAelAssessment {
    const has_explicit_tension =
      request.explicit_reconcile_tension === true ||
      request.reconciliation?.outcome === "needs_review";

    let outcome: RuntimeAelAssessment["outcome"];
    let gating_basis: RuntimeAelAssessment["gating_basis"];
    let suppression_reason: string | undefined;
    let escalation_reason: string | undefined;

    if (request.policy_result.suppressed) {
      outcome = "suppressed";
      gating_basis = "policy_suppression";
      suppression_reason =
        "Current runtime policy suppressed the action before any provider execution could occur.";
    } else if (has_explicit_tension) {
      outcome = "escalate";
      gating_basis = "reconcile_tension";
      escalation_reason =
        "Explicit reconcile tension requires escalation in the minimal governed-activation baseline.";
    } else if (request.policy_result.confirm_required) {
      outcome = "confirm_required";
      gating_basis = "confirm_gate";
    } else {
      outcome = "activate";
      gating_basis = "policy_allow";
    }

    const evidence_refs = this.unique_ids(request.evidence_refs ?? []);

    return {
      project_id: request.project_id,
      trigger_object_id: request.trigger_object.object_id,
      activation_signal_id: request.activation_signal.object_id,
      action_unit_id: request.action_unit.object_id,
      action_kind: String(request.action_unit.action_kind),
      activation_scope: String(request.activation_signal.scope),
      priority: String(request.activation_signal.priority),
      outcome,
      gating_basis,
      confirm_required: request.policy_result.confirm_required,
      matched_rule_ids: [...request.policy_result.matched_rule_ids],
      confirm_gate_id: request.confirm_gate?.object_id,
      suppression_reason,
      escalation_reason,
      evidence_refs,
      export_class: "runtime_private_non_exportable",
      notes: [
        "AEL first pass remains a runtime-private governed activation assessment.",
        "This assessment does not define provider execution or product workflow law.",
        ...request.policy_result.notes,
      ],
    };
  }
}
