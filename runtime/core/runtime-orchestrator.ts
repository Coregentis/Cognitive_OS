import type { ActivationService } from "./activation-service";
import type { BindingService } from "./binding-service";
import type { ConsolidationService } from "./consolidation-service";
import type { ConfirmService } from "./confirm-service";
import type { FormService } from "./form-service";
import type { MemoryService } from "./memory-service";
import type { PolicyService } from "./policy-service";
import type { ReconcileService } from "./reconcile-service";
import type { RegistryService } from "./registry-service";
import type { TraceService } from "./trace-service";
import type {
  CoregentisObjectType,
  MinimalLoopInput,
  MinimalLoopPlan,
  MinimalLoopRunResult,
  MinimalLoopStep,
} from "./runtime-types";

export interface RuntimeSkeletonDependencies {
  registry_service: RegistryService;
  binding_service: BindingService;
  form_service: FormService;
  memory_service: MemoryService;
  activation_service: ActivationService;
  policy_service: PolicyService;
  confirm_service: ConfirmService;
  trace_service: TraceService;
  reconcile_service: ReconcileService;
  consolidation_service: ConsolidationService;
}

export interface RuntimeOrchestrator {
  readonly loop_steps: MinimalLoopStep[];
  plan_minimal_loop(
    input: MinimalLoopInput
  ): Promise<MinimalLoopPlan> | MinimalLoopPlan;
  dry_run_minimal_loop(
    input: MinimalLoopInput
  ): Promise<MinimalLoopRunResult> | MinimalLoopRunResult;
}

export class MinimalRuntimeOrchestratorSkeleton
  implements RuntimeOrchestrator
{
  readonly loop_steps: MinimalLoopStep[] = [
    "form",
    "place",
    "activate",
    "confirm",
    "trace",
    "reconcile",
    "consolidate",
  ];

  constructor(private readonly deps: RuntimeSkeletonDependencies) {}

  plan_minimal_loop(input: MinimalLoopInput): MinimalLoopPlan {
    const shared_steps: MinimalLoopStep[] = this.loop_steps;

    if (input.scenario_id === "requirement-change-midflow") {
      const target_object_types: CoregentisObjectType[] = [
        "external-input-record",
        "delta-intent",
        "working-state-node",
        "episode",
        "semantic-fact",
        "activation-signal",
        "action-unit",
        "confirm-gate",
        "trace-evidence",
        "decision-record",
        "drift-record",
        "conflict-case",
        "learning-candidate",
        "memory-promotion-record",
      ];

      return {
        scenario_id: input.scenario_id,
        steps: shared_steps,
        target_object_types,
        notes: [
          "Skeleton-only requirement-change plan.",
          "Delta Intent is explicitly targeted for the change path.",
          "This scenario is expected to relate to an existing intent, episode, and semantic-fact context through prior_object_refs.",
          "This scenario reserves later drift-record and conflict-case creation points without implementing reconcile behavior.",
          "No runtime behavior is executed in this phase.",
        ],
      };
    }

    const target_object_types: CoregentisObjectType[] = [
      "external-input-record",
      "intent",
      "working-state-node",
      "episode",
      "activation-signal",
      "action-unit",
      "confirm-gate",
      "trace-evidence",
      "decision-record",
      "learning-candidate",
      "memory-promotion-record",
    ];

    return {
      scenario_id: input.scenario_id,
      steps: shared_steps,
      target_object_types,
      notes: [
        "Skeleton-only fresh-intent plan.",
        "This scenario prepares initial intake, intent formation, placement, bounded activation, confirm, trace, and consolidation scaffolding.",
        "No runtime behavior is executed in this phase.",
        "Registry and binding services are expected to gate later execution behavior.",
      ],
    };
  }

  dry_run_minimal_loop(input: MinimalLoopInput): MinimalLoopRunResult {
    const plan = this.plan_minimal_loop(input);
    void this.deps;

    return {
      scenario_id: input.scenario_id,
      status: "scaffold_only",
      planned_steps: plan.steps,
      touched_object_types: plan.target_object_types,
      notes: [
        "Dry-run produced by runtime skeleton only.",
        "No Form, Place, Activate, Confirm, Trace, Reconcile, or Consolidate logic has been implemented yet.",
      ],
    };
  }
}
