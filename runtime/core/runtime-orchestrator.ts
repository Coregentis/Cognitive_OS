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
  ActionDispatchOutcome,
  ActionDispatcher,
} from "../execution/action-dispatcher.ts";
import type {
  ExecutionRequestEnvelope,
} from "../execution/execution-envelope.ts";
import type {
  CorrectionCaptureInput,
  CorrectionCapturePort,
  CorrectionCaptureRecord,
} from "../learning/correction-capture.ts";
import type {
  ObjectiveAnchorComparison,
  ObjectiveAnchorPort,
  ObjectiveAnchorSnapshot,
} from "../learning/objective-anchor.ts";
import type {
  PreferenceWritebackPort,
  PreferenceWritebackRequest,
  PreferenceWritebackResult,
} from "../learning/preference-writeback.ts";
import type {
  CreatedObjectIdsByType,
  CoregentisObjectType,
  MinimalLoopInput,
  MinimalLoopPlan,
  MinimalLoopRunResult,
  MinimalLoopStep,
  RegistryEntryRecord,
  RuntimeConfirmSummary,
  RuntimeEventTimelineEntry,
  RuntimeEvidenceSummary,
  RuntimeExportPreparationSummary,
  RuntimeObjectRecord,
  RuntimeObjectStore,
  RuntimePolicySnapshot,
  RuntimeReconciliationSnapshot,
  RuntimeStatusTransition,
  RuntimeStepOutcome,
  RuntimeStoreSnapshot,
  RuntimeTruthConsultationSummary,
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
  working_store: RuntimeObjectStore;
  episodic_store: RuntimeObjectStore;
  semantic_store: RuntimeObjectStore;
  evidence_store: RuntimeObjectStore;
  action_dispatcher?: ActionDispatcher;
  objective_anchor?: ObjectiveAnchorPort;
  correction_capture?: CorrectionCapturePort;
  preference_writeback?: PreferenceWritebackPort;
}

export interface RuntimeOrchestrator {
  readonly loop_steps: MinimalLoopStep[];
  plan_minimal_loop(
    input: MinimalLoopInput
  ): Promise<MinimalLoopPlan> | MinimalLoopPlan;
  dry_run_minimal_loop(
    input: MinimalLoopInput
  ): Promise<MinimalLoopRunResult> | MinimalLoopRunResult;
  execute_minimal_loop(
    input: MinimalLoopInput
  ): Promise<MinimalLoopRunResult> | MinimalLoopRunResult;
  dispatch_bounded_action(
    request: ExecutionRequestEnvelope
  ): Promise<ActionDispatchOutcome> | ActionDispatchOutcome;
  anchor_objective(
    objective_id: string
  ): Promise<ObjectiveAnchorSnapshot> | ObjectiveAnchorSnapshot;
  compare_objective_to_anchor(
    objective_id: string
  ):
    | Promise<ObjectiveAnchorComparison>
    | ObjectiveAnchorComparison;
  capture_correction(
    input: CorrectionCaptureInput
  ):
    | Promise<CorrectionCaptureRecord>
    | CorrectionCaptureRecord;
  writeback_preference(
    request: PreferenceWritebackRequest
  ):
    | Promise<PreferenceWritebackResult>
    | PreferenceWritebackResult;
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
  private readonly deps: RuntimeSkeletonDependencies;

  constructor(deps: RuntimeSkeletonDependencies) {
    this.deps = deps;
  }

  private assert_supported_scenario(scenario_id: string): void {
    if (
      scenario_id !== "fresh-intent" &&
      scenario_id !== "requirement-change-midflow"
    ) {
      throw new Error(`Unsupported minimal loop scenario: ${scenario_id}`);
    }
  }

  private get_registry_entry(
    object_type: CoregentisObjectType
  ): RegistryEntryRecord {
    const entry = this.deps.registry_service.get_object_definition(object_type);
    if (!entry) {
      throw new Error(`Missing registry entry for ${object_type}`);
    }
    return entry;
  }

  private assert_registered_target_object_types(
    target_object_types: CoregentisObjectType[]
  ): void {
    for (const object_type of target_object_types) {
      this.deps.registry_service.assert_registered(object_type);
    }
  }

  private store_runtime_object(record: RuntimeObjectRecord): void {
    if (
      record.object_type === "trace-evidence" ||
      record.object_type === "decision-record"
    ) {
      this.deps.evidence_store.put(record);
      return;
    }

    switch (record.memory_layer) {
      case "working_memory":
        this.deps.working_store.put(record);
        return;
      case "episodic_memory":
        this.deps.episodic_store.put(record);
        return;
      case "semantic_memory":
        this.deps.semantic_store.put(record);
        return;
      default:
        return;
    }
  }

  private build_store_snapshot(project_id: string): RuntimeStoreSnapshot {
    return {
      working_object_ids: this.deps.working_store.snapshot_ids(project_id),
      episodic_object_ids: this.deps.episodic_store.snapshot_ids(project_id),
      semantic_object_ids: this.deps.semantic_store.snapshot_ids(project_id),
      evidence_object_ids: this.deps.evidence_store.snapshot_ids(project_id),
    };
  }

  plan_minimal_loop(input: MinimalLoopInput): MinimalLoopPlan {
    this.assert_supported_scenario(input.scenario_id);
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
      this.assert_registered_target_object_types(target_object_types);

      return {
        scenario_id: input.scenario_id,
        steps: shared_steps,
        target_object_types,
        notes: [
          "Requirement-change plan uses delta-intent rather than intent.",
          "This scenario is expected to relate to existing intent, episode, and semantic-fact context via prior_object_refs.",
          "This scenario reserves explicit drift-record and conflict-case output in the execution baseline.",
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
    this.assert_registered_target_object_types(target_object_types);

    return {
      scenario_id: input.scenario_id,
      steps: shared_steps,
      target_object_types,
      notes: [
        "Fresh-intent plan uses the simpler non-drifted path.",
        "This scenario prepares intake, intent formation, placement, bounded activation, trace, and consolidation output.",
      ],
    };
  }

  dry_run_minimal_loop(input: MinimalLoopInput): MinimalLoopRunResult {
    const plan = this.plan_minimal_loop(input);
    return {
      scenario_id: input.scenario_id,
      status: "scaffold_only",
      planned_steps: plan.steps,
      touched_object_types: plan.target_object_types,
      created_objects: [],
      notes: [
        "Dry-run produced by runtime skeleton only.",
        "No Form, Place, Activate, Confirm, Trace, Reconcile, or Consolidate behavior has been executed in this mode.",
      ],
    };
  }

  execute_minimal_loop(input: MinimalLoopInput): MinimalLoopRunResult {
    const plan = this.plan_minimal_loop(input);
    const created_objects: RuntimeObjectRecord[] = [];
    const object_map = new Map<string, RuntimeObjectRecord>();
    const creation_order: string[] = [];
    const created_object_ids_by_type: CreatedObjectIdsByType = {};
    const ordered_step_outcomes: RuntimeStepOutcome[] = [];
    const status_transitions: RuntimeStatusTransition[] = [];
    const event_timeline: RuntimeEventTimelineEntry[] = [];
    const policy_snapshots: RuntimePolicySnapshot[] = [];
    const consulted_registry = new Set<CoregentisObjectType>();
    const consulted_binding = new Set<CoregentisObjectType>();
    const consulted_export = new Set<CoregentisObjectType>();
    let event_sequence = 1;
    let reconciliation: RuntimeReconciliationSnapshot = {
      can_continue: true,
      notes: ["Reconcile step not triggered."],
    };

    const consult_registry = (
      object_type: CoregentisObjectType
    ): RegistryEntryRecord => {
      this.deps.registry_service.assert_registered(object_type);
      consulted_registry.add(object_type);
      return this.get_registry_entry(object_type);
    };

    const consult_binding = (object_type: CoregentisObjectType): void => {
      const binding = this.deps.binding_service.get_binding(object_type);
      if (binding) {
        consulted_binding.add(object_type);
      }
    };

    const consult_export_rule = (object_type: CoregentisObjectType): void => {
      const export_rule = this.deps.binding_service.get_export_rule(object_type);
      if (!export_rule) {
        throw new Error(`Missing export rule for ${object_type}`);
      }
      consulted_export.add(object_type);
    };

    const push_event = (
      step: MinimalLoopStep,
      event_kind: RuntimeEventTimelineEntry["event_kind"],
      related_object_ids: string[],
      notes: string[],
      status_transition?: RuntimeStatusTransition
    ): void => {
      event_timeline.push({
        sequence: event_sequence,
        step,
        event_kind,
        related_object_ids,
        status_transition,
        notes,
      });
      event_sequence += 1;
    };

    const record = (object: RuntimeObjectRecord): RuntimeObjectRecord => {
      this.deps.registry_service.assert_registered(object.object_type);
      consult_registry(object.object_type);

      if (object.protocol_binding_ref) {
        const binding = this.deps.binding_service.get_binding(object.object_type);
        if (!binding) {
          throw new Error(
            `Missing binding entry for runtime-bound object ${object.object_type}`
          );
        }
        consulted_binding.add(object.object_type);
      }

      consult_export_rule(object.object_type);

      if (!object_map.has(object.object_id)) {
        creation_order.push(object.object_id);
      }

      object_map.set(object.object_id, object);
      created_object_ids_by_type[object.object_type] ??= [];
      if (!created_object_ids_by_type[object.object_type]?.includes(object.object_id)) {
        created_object_ids_by_type[object.object_type].push(object.object_id);
      }

      this.store_runtime_object(object);
      return object;
    };

    const transition_status = (
      step: MinimalLoopStep,
      object: RuntimeObjectRecord,
      to_status: string,
      notes: string[]
    ): RuntimeObjectRecord => {
      const updated: RuntimeObjectRecord = {
        ...object,
        status: to_status,
      };

      const transition: RuntimeStatusTransition = {
        object_id: object.object_id,
        object_type: object.object_type,
        from_status: object.status,
        to_status,
      };

      status_transitions.push(transition);
      record(updated);
      push_event(step, "status_transition", [object.object_id], notes, transition);
      return updated;
    };

    const push_step_outcome = (
      step: MinimalLoopStep,
      objects: RuntimeObjectRecord[],
      status: "executed" | "skipped",
      notes: string[],
      extra_registry: CoregentisObjectType[] = [],
      extra_binding: CoregentisObjectType[] = [],
      extra_export: CoregentisObjectType[] = []
    ): void => {
      for (const object_type of extra_registry) consulted_registry.add(object_type);
      for (const object_type of extra_binding) consulted_binding.add(object_type);
      for (const object_type of extra_export) consulted_export.add(object_type);

      ordered_step_outcomes.push({
        step,
        status,
        created_object_ids: objects.map((object) => object.object_id),
        created_object_types: objects.map((object) => object.object_type),
        consulted_registry_object_types: [
          ...new Set([...objects.map((object) => object.object_type), ...extra_registry]),
        ],
        consulted_binding_object_types: [...new Set(extra_binding)],
        consulted_export_object_types: [...new Set(extra_export)],
        notes,
      });
    };

    for (const store of [
      this.deps.working_store,
      this.deps.episodic_store,
      this.deps.semantic_store,
      this.deps.evidence_store,
    ]) {
      store.clear();
    }

    consult_registry("external-input-record");
    if (input.scenario_id === "requirement-change-midflow") {
      consult_registry("delta-intent");
      consult_binding("delta-intent");
    } else {
      consult_registry("intent");
      consult_binding("intent");
    }

    const formed_objects = this.deps.form_service.plan_form_step(input);
    const external_input = record(formed_objects[0]!);
    let entry_object = record(formed_objects[1]!);
    push_event("form", "object_created", [external_input.object_id, entry_object.object_id], [
      "External input record and governed entry object created.",
    ]);
    entry_object = transition_status(
      "form",
      entry_object,
      input.scenario_id === "requirement-change-midflow" ? "accepted" : "active",
      ["Entry object advanced to its first active execution state."]
    );
    push_step_outcome(
      "form",
      [external_input, entry_object],
      "executed",
      ["Scenario intake captured and governed entry object formed."],
      [],
      entry_object.protocol_binding_ref ? [entry_object.object_type] : [],
      ["external-input-record", entry_object.object_type]
    );

    consult_registry("working-state-node");
    consult_registry("episode");
    const working_state = record(
      this.deps.memory_service.place_working_state({
        project_id: input.project_id,
        source_object: entry_object,
      })
    );
    const episode = record(
      this.deps.memory_service.open_episode({
        project_id: input.project_id,
        source_object_refs: [external_input.object_id, entry_object.object_id],
        episode_kind:
          input.scenario_id === "requirement-change-midflow"
            ? "reconciliation"
            : "intake",
        title:
          input.scenario_id === "requirement-change-midflow"
            ? "Requirement Change Episode"
            : "Fresh Intent Episode",
      })
    );
    push_event("place", "object_created", [working_state.object_id, episode.object_id], [
      "Working-state and episode records created.",
    ]);
    const place_objects: RuntimeObjectRecord[] = [working_state, episode];

    let semantic_fact: RuntimeObjectRecord | undefined;
    if (input.scenario_id === "requirement-change-midflow") {
      consult_registry("semantic-fact");
      semantic_fact = record(
        this.deps.memory_service.register_semantic_fact({
          project_id: input.project_id,
          source_object: entry_object,
        })
      );
      push_event("place", "object_created", [semantic_fact.object_id], [
        "Semantic fact created for the requirement-change path.",
      ]);
      place_objects.push(semantic_fact);
    }

    push_step_outcome(
      "place",
      place_objects,
      "executed",
      ["Objects placed into explicit working, episodic, and semantic layers where applicable."],
      [],
      [],
      place_objects.map((object) => object.object_type)
    );

    consult_registry("activation-signal");
    consult_registry("action-unit");
    let activation_signal = record(
      this.deps.activation_service.create_activation_signal({
        project_id: input.project_id,
        trigger_object_id: entry_object.object_id,
        signal_kind: "execute",
        scope: "local",
        priority:
          input.scenario_id === "requirement-change-midflow" ? "high" : "normal",
      })
    );
    push_event("activate", "object_created", [activation_signal.object_id], [
      "Activation signal created.",
    ]);
    activation_signal = transition_status("activate", activation_signal, "active", [
      "Activation signal moved into active state.",
    ]);

    let action_unit = record(
      this.deps.activation_service.create_action_unit({
        project_id: input.project_id,
        activation_signal_id: activation_signal.object_id,
        action_kind:
          input.scenario_id === "requirement-change-midflow"
            ? "reconcile"
            : "execute",
        action_summary:
          input.scenario_id === "requirement-change-midflow"
            ? "apply requirement change path"
            : "run fresh intent path",
        target_object_refs:
          input.scenario_id === "requirement-change-midflow" && semantic_fact
            ? [working_state.object_id, episode.object_id, semantic_fact.object_id]
            : [working_state.object_id, episode.object_id],
      })
    );
    push_event("activate", "object_created", [action_unit.object_id], [
      "Action unit created.",
    ]);
    action_unit = transition_status("activate", action_unit, "in_progress", [
      "Action unit moved into in-progress state.",
    ]);
    push_step_outcome(
      "activate",
      [activation_signal, action_unit],
      "executed",
      ["Bounded activation and action objects created deterministically."],
      [],
      [],
      ["activation-signal", "action-unit"]
    );

    const policy_result = this.deps.policy_service.evaluate_policies({
      scenario_id: input.scenario_id,
      candidate_object: action_unit,
      registry_entry: this.get_registry_entry(action_unit.object_type),
    });
    policy_snapshots.push(policy_result);
    push_event("confirm", "policy_evaluated", [action_unit.object_id], [
      ...policy_result.notes,
    ]);

    let confirm_gate: RuntimeObjectRecord | undefined;
    if (policy_result.confirm_required) {
      consult_registry("confirm-gate");
      consult_binding("confirm-gate");
      confirm_gate = this.deps.confirm_service.create_confirm_gate({
        project_id: input.project_id,
        target_object_id: action_unit.object_id,
        confirm_kind: "review",
        requested_by_ref: "runtime-policy-service",
      });
      record(confirm_gate);
      push_event("confirm", "object_created", [confirm_gate.object_id], [
        "Confirm gate created.",
      ]);
      const resolved_confirm_gate = this.deps.confirm_service.resolve_confirm_gate({
        confirm_gate,
        resolution_status: "approved",
      });
      confirm_gate = transition_status(
        "confirm",
        confirm_gate,
        String(resolved_confirm_gate.status),
        ["Confirm gate status advanced to approved."]
      );
      confirm_gate = {
        ...confirm_gate,
        governance: resolved_confirm_gate.governance,
      };
      record(confirm_gate);
      push_event("confirm", "confirm_resolution", [confirm_gate.object_id], [
        "Confirm gate resolved in the minimal execution baseline.",
      ]);
      push_step_outcome(
        "confirm",
        [confirm_gate],
        "executed",
        ["Confirm gate created and resolved under the minimal policy path."],
        [],
        ["confirm-gate"],
        ["confirm-gate"]
      );
    } else {
      push_event("confirm", "stage_skipped", [], [
        "Confirm stage skipped in the fresh-intent path.",
      ]);
      push_step_outcome(
        "confirm",
        [],
        "skipped",
        ["Policy evaluation did not require an explicit confirm gate in this scenario."],
        [],
        [],
        []
      );
    }

    const trace_subjects = confirm_gate
      ? [action_unit.object_id, confirm_gate.object_id]
      : [action_unit.object_id];

    consult_registry("trace-evidence");
    consult_binding("trace-evidence");
    consult_registry("decision-record");
    const trace_evidence = record(
      this.deps.trace_service.create_trace_evidence({
        project_id: input.project_id,
        evidence_kind: "execution",
        evidence_summary:
          input.scenario_id === "requirement-change-midflow"
            ? "requirement change execution trace"
            : "fresh intent execution trace",
        subject_object_refs: trace_subjects,
      })
    );
    push_event("trace", "object_created", [trace_evidence.object_id], [
      "Trace evidence created.",
    ]);
    const decision_record = record(
      this.deps.trace_service.create_decision_record({
        project_id: input.project_id,
        decision_type: policy_result.confirm_required ? "approval" : "activation",
        decision_summary:
          input.scenario_id === "requirement-change-midflow"
            ? "change path decision recorded"
            : "fresh path decision recorded",
        outcome: policy_result.confirm_required ? "approved" : "continued",
        subject_object_refs: [action_unit.object_id],
      })
    );
    push_event("trace", "object_created", [decision_record.object_id], [
      "Decision record created.",
    ]);
    activation_signal = transition_status("trace", activation_signal, "completed", [
      "Activation signal completed after trace emission.",
    ]);
    action_unit = transition_status("trace", action_unit, "completed", [
      "Action unit completed after trace emission.",
    ]);
    push_step_outcome(
      "trace",
      [trace_evidence, decision_record],
      "executed",
      ["Trace evidence and decision record emitted for the current execution path."],
      [],
      ["trace-evidence"],
      ["trace-evidence", "decision-record"]
    );

    if (input.scenario_id === "requirement-change-midflow") {
      consult_registry("drift-record");
      consult_registry("conflict-case");
      let drift_record = record(
        this.deps.reconcile_service.create_drift_record({
          project_id: input.project_id,
          drift_kind: "intent_drift",
          drift_summary: "Requirement change diverges from prior intent path.",
          severity: "medium",
          observed_object_refs: [entry_object.object_id],
          baseline_object_refs: input.prior_object_refs ?? [],
        })
      );
      push_event("reconcile", "object_created", [drift_record.object_id], [
        "Drift record created.",
      ]);

      let conflict_case = record(
        this.deps.reconcile_service.create_conflict_case({
          project_id: input.project_id,
          conflict_kind: "plan_conflict",
          conflict_summary: "Existing plan context conflicts with the new change path.",
          object_refs: semantic_fact
            ? [entry_object.object_id, semantic_fact.object_id, drift_record.object_id]
            : [entry_object.object_id, drift_record.object_id],
          proposed_resolution: "branch",
        })
      );
      push_event("reconcile", "object_created", [conflict_case.object_id], [
        "Conflict case created.",
      ]);

      drift_record = transition_status("reconcile", drift_record, "reviewed", [
        "Drift record reviewed for the change path.",
      ]);
      conflict_case = transition_status("reconcile", conflict_case, "classified", [
        "Conflict case classified for the change path.",
      ]);

      reconciliation = this.deps.reconcile_service.assess_reconciliation([
        drift_record,
        conflict_case,
      ]);
      reconciliation = {
        ...reconciliation,
        drift_record_ids: [drift_record.object_id],
        conflict_case_ids: [conflict_case.object_id],
      };
      push_event(
        "reconcile",
        "reconcile_assessed",
        [drift_record.object_id, conflict_case.object_id],
        [...reconciliation.notes]
      );
      push_step_outcome(
        "reconcile",
        [drift_record, conflict_case],
        "executed",
        ["Requirement-change path emitted drift and conflict artifacts deterministically."],
        [],
        [],
        ["drift-record", "conflict-case"]
      );
    } else {
      push_event("reconcile", "stage_skipped", [], [
        "Reconcile stage skipped in the fresh-intent path.",
      ]);
      push_step_outcome(
        "reconcile",
        [],
        "skipped",
        ["Fresh-intent path does not emit drift or conflict artifacts in the minimal baseline."],
        [],
        [],
        []
      );
    }

    consult_registry("learning-candidate");
    consult_registry("memory-promotion-record");
    let learning_candidate = record(
      this.deps.consolidation_service.create_learning_candidate({
        project_id: input.project_id,
        candidate_kind:
          input.scenario_id === "requirement-change-midflow"
            ? "failure_pattern"
            : "success_pattern",
        candidate_summary:
          input.scenario_id === "requirement-change-midflow"
            ? "change path captured for future reconcile learning"
            : "fresh intent path captured for future reuse",
        source_episode_refs: [episode.object_id],
        source_evidence_refs: [trace_evidence.object_id, decision_record.object_id],
      })
    );
    push_event("consolidate", "object_created", [learning_candidate.object_id], [
      "Learning candidate created.",
    ]);
    learning_candidate = transition_status(
      "consolidate",
      learning_candidate,
      "scored",
      ["Learning candidate scored for deterministic inspection."]
    );

    let promotion_record = record(
      this.deps.consolidation_service.create_memory_promotion_record({
        project_id: input.project_id,
        source_memory_layer: "working_memory",
        target_memory_layer:
          input.scenario_id === "requirement-change-midflow"
            ? "semantic_memory"
            : "episodic_memory",
        source_object_id: working_state.object_id,
        promotion_reason:
          input.scenario_id === "requirement-change-midflow"
            ? "change path stabilized for later semantic reuse"
            : "fresh path retained for later replay",
        approved_by_ref: "runtime-consolidation-service",
      })
    );
    push_event("consolidate", "object_created", [promotion_record.object_id], [
      "Memory promotion record created.",
    ]);
    promotion_record = transition_status(
      "consolidate",
      promotion_record,
      "applied",
      ["Memory promotion record applied for deterministic inspection."]
    );
    push_step_outcome(
      "consolidate",
      [learning_candidate, promotion_record],
      "executed",
      ["Learning candidate and promotion record created for deterministic consolidation inspection."],
      [],
      [],
      ["learning-candidate", "memory-promotion-record"]
    );

    const evidenceSummary: RuntimeEvidenceSummary = {
      trace_evidence_ids: creation_order
        .map((id) => object_map.get(id)!)
        .filter((record) => record.object_type === "trace-evidence")
        .map((record) => record.object_id),
      decision_record_ids: creation_order
        .map((id) => object_map.get(id)!)
        .filter((record) => record.object_type === "decision-record")
        .map((record) => record.object_id),
      notes: [
        "Evidence summary is neutral and internal to the mother-runtime baseline.",
      ],
    };

    const exportPreparation: RuntimeExportPreparationSummary = {
      protocol_relevant_object_ids: creation_order
        .map((id) => object_map.get(id)!)
        .filter((record) => {
          const binding = this.deps.binding_service.get_binding(record.object_type);
          return Boolean(binding?.mplp_object);
        })
        .map((record) => record.object_id),
      shallow_reconstructable_object_ids: creation_order
        .map((id) => object_map.get(id)!)
        .filter((record) => {
          const binding = this.deps.binding_service.get_binding(record.object_type);
          return (
            binding?.binding_class === "shallow_reconstructable_runtime_bound"
          );
        })
        .map((record) => record.object_id),
      non_exportable_object_ids: creation_order
        .map((id) => object_map.get(id)!)
        .filter((record) => {
          const export_rule = this.deps.binding_service.get_export_rule(
            record.object_type
          );
          return export_rule?.export_class === "runtime_private_non_exportable";
        })
        .map((record) => record.object_id),
      export_restricted_object_ids: creation_order
        .map((id) => object_map.get(id)!)
        .filter((record) => {
          const export_rule = this.deps.binding_service.get_export_rule(
            record.object_type
          );
          return (
            export_rule?.export_class === "protocol_adjacent_export_restricted" ||
            export_rule?.export_class === "internal_derived_only"
          );
        })
        .map((record) => record.object_id),
      notes: [
        "Export-preparation summary is derived from frozen binding and export truth only.",
        "No final MPLP artifact materialization is performed in this phase.",
      ],
    };
    push_event("trace", "export_prepared", [
      ...exportPreparation.protocol_relevant_object_ids,
    ], [...exportPreparation.notes]);

    const confirmSummary: RuntimeConfirmSummary = {
      confirm_required: policy_result.confirm_required,
      confirm_gate_id: confirm_gate?.object_id,
      confirm_status: confirm_gate?.status,
      matched_rule_ids: policy_result.matched_rule_ids,
      notes: policy_result.notes,
    };

    const truthConsultation: RuntimeTruthConsultationSummary = {
      registry_object_types: [...consulted_registry],
      binding_object_types: [...consulted_binding],
      export_rule_object_types: [...consulted_export],
      notes: [
        "Runtime execution consulted frozen registry truth.",
        "Runtime execution consulted frozen binding truth only where needed for neutral runtime-bound behavior.",
        "Unknown object types would fail through registry assertions.",
      ],
    };

    const finalCreatedObjects = creation_order.map((id) => object_map.get(id)!);

    return {
      scenario_id: input.scenario_id,
      status: "executed",
      planned_steps: plan.steps,
      touched_object_types: [...new Set(finalCreatedObjects.map((record) => record.object_type))],
      created_objects: finalCreatedObjects,
      created_object_ids_by_type,
      status_transitions,
      event_timeline,
      ordered_step_outcomes,
      store_snapshot: this.build_store_snapshot(input.project_id),
      policy_snapshots,
      confirm_summary: confirmSummary,
      evidence_summary: evidenceSummary,
      reconciliation,
      truth_consultation: truthConsultation,
      export_preparation: exportPreparation,
      notes: [
        "Minimal execution baseline ran in-memory only.",
        "Behavior remains deterministic and fixture-driven.",
        `Created ${creation_order.length} runtime objects.`,
        `Learning candidate recorded: ${learning_candidate.object_id}.`,
      ],
    };
  }

  dispatch_bounded_action(
    request: ExecutionRequestEnvelope
  ): Promise<ActionDispatchOutcome> | ActionDispatchOutcome {
    if (!this.deps.action_dispatcher) {
      throw new Error(
        "Bounded P0-B action dispatcher is not configured."
      );
    }

    return this.deps.action_dispatcher.dispatch(request);
  }

  anchor_objective(
    objective_id: string
  ): ObjectiveAnchorSnapshot {
    if (!this.deps.objective_anchor) {
      throw new Error(
        "Bounded P0-B objective anchor is not configured."
      );
    }

    return this.deps.objective_anchor.capture_anchor(objective_id);
  }

  compare_objective_to_anchor(
    objective_id: string
  ): ObjectiveAnchorComparison {
    if (!this.deps.objective_anchor) {
      throw new Error(
        "Bounded P0-B objective anchor is not configured."
      );
    }

    return this.deps.objective_anchor.compare_to_anchor(objective_id);
  }

  capture_correction(
    input: CorrectionCaptureInput
  ): CorrectionCaptureRecord {
    if (!this.deps.correction_capture) {
      throw new Error(
        "Bounded P0-B correction capture is not configured."
      );
    }

    return this.deps.correction_capture.capture(input);
  }

  writeback_preference(
    request: PreferenceWritebackRequest
  ): PreferenceWritebackResult {
    if (!this.deps.preference_writeback) {
      throw new Error(
        "Bounded P0-B preference write-back is not configured."
      );
    }

    return this.deps.preference_writeback.writeback(request);
  }
}
