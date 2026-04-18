import type { ActivationService } from "./activation-service";
import {
  DeterministicAelService,
  type AelService,
} from "./ael-service.ts";
import type { BindingService } from "./binding-service";
import type { ConsolidationService } from "./consolidation-service";
import type { ConfirmService } from "./confirm-service";
import type { FormService } from "./form-service";
import type { MemoryService } from "./memory-service";
import type { PolicyService } from "./policy-service";
import type { ReconcileService } from "./reconcile-service";
import type { RegistryService } from "./registry-service";
import type { TraceService } from "./trace-service";
import type { VslService } from "./vsl-service.ts";
import type { PsgService } from "./psg-service.ts";
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
  RuntimeAelAssessment,
  RuntimeContinuationAnchor,
  RuntimeEventTimelineEntry,
  RuntimeEvidenceSummary,
  RuntimeExportPreparationSummary,
  RuntimeObjectRecord,
  RuntimeObjectStore,
  RuntimePsgGraphState,
  RuntimePsgGraphUpdateSummary,
  RuntimePolicySnapshot,
  RuntimeReconciliationSnapshot,
  RuntimeStatusTransition,
  RuntimeStepOutcome,
  RuntimeStoreSnapshot,
  RuntimeTruthConsultationSummary,
  RuntimeVslContinuityState,
} from "./runtime-types";

export interface RuntimeSkeletonDependencies {
  registry_service: RegistryService;
  binding_service: BindingService;
  form_service: FormService;
  memory_service: MemoryService;
  activation_service: ActivationService;
  ael_service?: AelService;
  policy_service: PolicyService;
  confirm_service: ConfirmService;
  trace_service: TraceService;
  reconcile_service: ReconcileService;
  consolidation_service: ConsolidationService;
  working_store: RuntimeObjectStore;
  episodic_store: RuntimeObjectStore;
  semantic_store: RuntimeObjectStore;
  evidence_store: RuntimeObjectStore;
  vsl_service?: VslService;
  psg_service?: PsgService;
  action_dispatcher?: ActionDispatcher;
  objective_anchor?: ObjectiveAnchorPort;
  correction_capture?: CorrectionCapturePort;
  preference_writeback?: PreferenceWritebackPort;
}

export interface RuntimeOrchestrator {
  readonly loop_steps: MinimalLoopStep[];
  plan_minimal_loop(
    input: MinimalLoopInput
  ): MinimalLoopPlan;
  dry_run_minimal_loop(
    input: MinimalLoopInput
  ): MinimalLoopRunResult;
  execute_minimal_loop(
    input: MinimalLoopInput
  ): MinimalLoopRunResult;
  load_project_continuity(
    project_id: string
  ): RuntimeVslContinuityState | undefined;
  recover_continuation_anchor(
    project_id: string
  ): RuntimeContinuationAnchor | undefined;
  inspect_project_graph(
    project_id: string
  ): RuntimePsgGraphState | undefined;
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
  private readonly ael_service: AelService;

  constructor(deps: RuntimeSkeletonDependencies) {
    this.deps = deps;
    this.ael_service = deps.ael_service ?? new DeterministicAelService();
  }

  private assert_supported_scenario(scenario_id: string): void {
    if (
      scenario_id !== "fresh-intent" &&
      scenario_id !== "requirement-change-midflow"
    ) {
      throw new Error(`Unsupported minimal loop scenario: ${scenario_id}`);
    }
  }

  private should_create_conflict_case(input: MinimalLoopInput): boolean {
    const explicit_signals = [
      input.raw_input.change_conflict_signal,
      input.raw_input.reconcile_signal,
    ];

    return explicit_signals.some((value) => {
      const normalized = String(value ?? "")
        .trim()
        .toLowerCase();

      return (
        normalized === "conflict" ||
        normalized === "blocking" ||
        normalized === "requires_review"
      );
    });
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

  private unique_ids(values: unknown[]): string[] {
    return [...new Set(
      values.filter(
        (value): value is string =>
          typeof value === "string" && value.length > 0
      )
    )].sort();
  }

  private approval_state_from_ael(
    assessment: RuntimeAelAssessment
  ): "not_required" | "pending" | "approved" | "rejected" | "escalated" | "bypassed" {
    switch (assessment.outcome) {
      case "confirm_required":
        return assessment.confirm_gate_id ? "approved" : "pending";
      case "suppressed":
        return "rejected";
      case "escalate":
        return "escalated";
      case "activate":
      default:
        return "not_required";
    }
  }

  private attach_ael_governance(
    object: RuntimeObjectRecord,
    assessment: RuntimeAelAssessment
  ): RuntimeObjectRecord {
    const policy_refs = this.unique_ids([
      ...(Array.isArray(object.governance?.policy_refs)
        ? object.governance.policy_refs
        : []),
      ...assessment.matched_rule_ids,
    ]);
    const confirm_refs = this.unique_ids([
      ...(Array.isArray(object.governance?.confirm_refs)
        ? object.governance.confirm_refs
        : []),
      assessment.confirm_gate_id,
    ]);
    const note_parts = [
      String(object.governance?.notes ?? "").trim(),
      `AEL first-pass outcome=${assessment.outcome}; basis=${assessment.gating_basis}.`,
      assessment.suppression_reason,
      assessment.escalation_reason,
    ].filter(
      (value): value is string => typeof value === "string" && value.length > 0
    );

    return {
      ...object,
      governance: {
        ...object.governance,
        locked:
          assessment.outcome === "suppressed" ||
          assessment.outcome === "escalate",
        review_required:
          assessment.outcome === "escalate",
        approval_state: this.approval_state_from_ael(assessment),
        policy_refs,
        confirm_refs,
        notes: note_parts.join(" "),
      },
    };
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
          "This scenario always emits drift-record output and emits conflict-case output only when explicit reconcile tension is present.",
        ],
      };
    }

    const target_object_types: CoregentisObjectType[] = [
      "external-input-record",
      "intent",
      "working-state-node",
      "episode",
      "semantic-fact",
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
        "This scenario prepares intake, intent formation, explicit working/episodic/semantic placement, bounded activation, trace, and consolidation output.",
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
    let aelAssessment: RuntimeAelAssessment | undefined;
    const consulted_registry = new Set<CoregentisObjectType>();
    const consulted_binding = new Set<CoregentisObjectType>();
    const consulted_export = new Set<CoregentisObjectType>();
    let event_sequence = 1;
    let reconciliation: RuntimeReconciliationSnapshot = {
      outcome: "can_continue",
      can_continue: true,
      notes: ["Reconcile assessment pending."],
    };
    const priorContinuityState = this.deps.vsl_service?.load_project_continuity(
      input.project_id
    );
    const priorProjectGraph = this.deps.psg_service?.inspect_project_graph(
      input.project_id
    );
    const explicitReconcileTension = this.should_create_conflict_case(input);

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
      const object_ids_for_type =
        (created_object_ids_by_type[object.object_type] ??= []);

      if (!object_ids_for_type.includes(object.object_id)) {
        object_ids_for_type.push(object.object_id);
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
          ...new Set([
            ...objects.map((object) => object.object_type),
            ...extra_registry,
          ]),
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
    push_event(
      "form",
      "object_created",
      [external_input.object_id, entry_object.object_id],
      ["External input record and governed entry object created."]
    );
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
    push_event(
      "place",
      "object_created",
      [working_state.object_id, episode.object_id],
      ["Working-state and episode records created."]
    );
    const place_objects: RuntimeObjectRecord[] = [working_state, episode];

    let semantic_fact: RuntimeObjectRecord | undefined;
    consult_registry("semantic-fact");
    semantic_fact = record(
      this.deps.memory_service.register_semantic_fact({
        project_id: input.project_id,
        source_object: entry_object,
        fact_type:
          input.scenario_id === "requirement-change-midflow"
            ? "requirement_change"
            : "fresh_intent",
        fact_statement:
          input.scenario_id === "requirement-change-midflow"
            ? "semantic fact captures the requirement-change path for later reconcile pressure"
            : "semantic fact captures the fresh-intent objective for later bounded reuse",
        confidence_level:
          input.scenario_id === "requirement-change-midflow"
            ? "medium"
            : "low",
        source_object_refs:
          input.scenario_id === "requirement-change-midflow"
            ? [external_input.object_id, entry_object.object_id]
            : [entry_object.object_id],
      })
    );
    push_event("place", "object_created", [semantic_fact.object_id], [
      input.scenario_id === "requirement-change-midflow"
        ? "Semantic fact created for the requirement-change path."
        : "Semantic fact created for the fresh-intent path.",
    ]);
    place_objects.push(semantic_fact);

    push_step_outcome(
      "place",
      place_objects,
      "executed",
      [
        "Objects placed into explicit working, episodic, and semantic layers where applicable.",
      ],
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
          input.scenario_id === "requirement-change-midflow"
            ? "high"
            : "normal",
      })
    );
    push_event("activate", "object_created", [activation_signal.object_id], [
      "Activation signal created.",
    ]);
    activation_signal = transition_status(
      "activate",
      activation_signal,
      "active",
      ["Activation signal moved into active state."]
    );

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
            ? [
                working_state.object_id,
                episode.object_id,
                semantic_fact.object_id,
              ]
            : [working_state.object_id, episode.object_id],
      })
    );
    push_event("activate", "object_created", [action_unit.object_id], [
      "Action unit created.",
    ]);
    action_unit = transition_status(
      "activate",
      action_unit,
      "in_progress",
      ["Action unit moved into in-progress state."]
    );
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
      raw_input: input.raw_input,
      explicit_reconcile_tension: explicitReconcileTension,
    });
    policy_snapshots.push(policy_result);
    push_event("confirm", "policy_evaluated", [action_unit.object_id], [
      ...policy_result.notes,
    ]);

    let confirm_gate: RuntimeObjectRecord | undefined;
    if (policy_result.confirm_required && !policy_result.suppressed) {
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
      const resolved_confirm_gate =
        this.deps.confirm_service.resolve_confirm_gate({
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
        policy_result.suppressed
          ? "Confirm stage skipped because the action was suppressed before confirm handling."
          : "Confirm stage skipped in the fresh-intent path.",
      ]);
      push_step_outcome(
        "confirm",
        [],
        "skipped",
        [
          "Policy evaluation did not require an explicit confirm gate in this scenario.",
        ],
        [],
        [],
        []
      );
    }

    aelAssessment = this.ael_service.assess_activation({
      project_id: input.project_id,
      trigger_object: entry_object,
      activation_signal,
      action_unit,
      policy_result,
      confirm_gate,
      explicit_reconcile_tension: explicitReconcileTension,
    });
    activation_signal = this.attach_ael_governance(activation_signal, aelAssessment);
    record(activation_signal);
    action_unit = this.attach_ael_governance(action_unit, aelAssessment);
    record(action_unit);
    push_event(
      "confirm",
      "activation_assessed",
      this.unique_ids([
        activation_signal.object_id,
        action_unit.object_id,
        aelAssessment.confirm_gate_id,
      ]),
      [
        `AEL assessed outcome ${aelAssessment.outcome}.`,
        ...aelAssessment.notes,
      ]
    );

    const trace_subjects = confirm_gate
      ? [action_unit.object_id, confirm_gate.object_id]
      : [action_unit.object_id];

    consult_registry("trace-evidence");
    consult_binding("trace-evidence");
    consult_registry("decision-record");
    const trace_evidence = record(
      this.deps.trace_service.create_trace_evidence({
        project_id: input.project_id,
        evidence_kind:
          aelAssessment.outcome === "suppressed"
            ? "decision_basis"
            : aelAssessment.outcome === "escalate"
              ? "conflict"
              : "execution",
        evidence_summary:
          aelAssessment.outcome === "suppressed"
            ? "governed suppression trace"
            : aelAssessment.outcome === "escalate"
              ? "activation escalation trace"
              : input.scenario_id === "requirement-change-midflow"
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
        decision_type:
          aelAssessment.outcome === "suppressed"
            ? "suppression"
            : aelAssessment.outcome === "escalate"
              ? "conflict_resolution"
              : policy_result.confirm_required
                ? "approval"
                : "activation",
        decision_summary:
          aelAssessment.outcome === "suppressed"
            ? "governed suppression decision recorded"
            : aelAssessment.outcome === "escalate"
              ? "activation escalation decision recorded"
              : input.scenario_id === "requirement-change-midflow"
                ? "change path decision recorded"
                : "fresh path decision recorded",
        outcome:
          aelAssessment.outcome === "suppressed"
            ? "suppressed"
            : aelAssessment.outcome === "escalate"
              ? "branched"
              : policy_result.confirm_required
                ? "approved"
                : "continued",
        subject_object_refs: [action_unit.object_id],
      })
    );
    push_event("trace", "object_created", [decision_record.object_id], [
      "Decision record created.",
    ]);
    aelAssessment = this.ael_service.assess_activation({
      project_id: input.project_id,
      trigger_object: entry_object,
      activation_signal,
      action_unit,
      policy_result,
      confirm_gate,
      explicit_reconcile_tension: explicitReconcileTension,
      evidence_refs: [trace_evidence.object_id, decision_record.object_id],
    });
    activation_signal = this.attach_ael_governance(activation_signal, aelAssessment);
    record(activation_signal);
    action_unit = this.attach_ael_governance(action_unit, aelAssessment);
    record(action_unit);
    activation_signal = transition_status(
      "trace",
      activation_signal,
      aelAssessment.outcome === "suppressed"
        ? "suppressed"
        : aelAssessment.outcome === "escalate"
          ? "failed"
          : "completed",
      [
        aelAssessment.outcome === "suppressed"
          ? "Activation signal marked suppressed after governed activation assessment."
          : aelAssessment.outcome === "escalate"
            ? "Activation signal failed closed because governed activation escalated the path."
            : "Activation signal completed after trace emission.",
      ]
    );
    action_unit = transition_status(
      "trace",
      action_unit,
      aelAssessment.outcome === "activate" ||
        aelAssessment.outcome === "confirm_required"
        ? "completed"
        : "cancelled",
      [
        aelAssessment.outcome === "suppressed"
          ? "Action unit cancelled after governed suppression."
          : aelAssessment.outcome === "escalate"
            ? "Action unit cancelled because the path escalated under explicit tension."
            : "Action unit completed after trace emission.",
      ]
    );
    push_step_outcome(
      "trace",
      [trace_evidence, decision_record],
      "executed",
      [
        "Trace evidence and decision record emitted for the current execution path.",
      ],
      [],
      ["trace-evidence"],
      ["trace-evidence", "decision-record"]
    );

    if (input.scenario_id === "requirement-change-midflow") {
      const deltaDriftAssessment =
        this.deps.reconcile_service.assess_delta_drift_impact({
          project_id: input.project_id,
          delta_intent: entry_object,
          prior_object_refs: input.prior_object_refs,
          continuity_state: priorContinuityState,
          graph_state: priorProjectGraph,
          current_evidence_refs: [
            trace_evidence.object_id,
            decision_record.object_id,
          ],
        });
      consult_registry("drift-record");
      let drift_record = record(
        this.deps.reconcile_service.create_drift_record({
          project_id: input.project_id,
          drift_kind: deltaDriftAssessment.drift_kind,
          drift_summary:
            "Requirement change diverges from prior intent path under bounded delta-drift assessment.",
          severity: deltaDriftAssessment.severity,
          observed_object_refs: deltaDriftAssessment.observed_object_refs,
          baseline_object_refs: deltaDriftAssessment.baseline_object_refs,
          affected_object_refs: deltaDriftAssessment.affected_object_refs,
          continuation_anchor_ref:
            deltaDriftAssessment.continuation_anchor_ref,
          impact_summary: deltaDriftAssessment.impact_summary,
          supporting_evidence_refs:
            deltaDriftAssessment.supporting_evidence_refs,
        })
      );
      push_event("reconcile", "object_created", [drift_record.object_id], [
        "Drift record created.",
        deltaDriftAssessment.impact_summary,
      ]);

      drift_record = transition_status("reconcile", drift_record, "reviewed", [
        "Drift record reviewed for the change path.",
      ]);

      const reconcile_objects: RuntimeObjectRecord[] = [drift_record];
      let conflict_case: RuntimeObjectRecord | undefined;

      if (explicitReconcileTension) {
        consult_registry("conflict-case");
        conflict_case = record(
          this.deps.reconcile_service.create_conflict_case({
            project_id: input.project_id,
            conflict_kind: "plan_conflict",
            conflict_summary: [
              "Existing plan context conflicts with the new change path.",
              deltaDriftAssessment.impact_summary,
            ].join(" "),
            object_refs: [...new Set([
              entry_object.object_id,
              drift_record.object_id,
              ...(semantic_fact ? [semantic_fact.object_id] : []),
              ...deltaDriftAssessment.affected_object_refs,
              ...deltaDriftAssessment.supporting_evidence_refs,
            ])],
            proposed_resolution: "branch",
          })
        );
        push_event("reconcile", "object_created", [conflict_case.object_id], [
          "Conflict case created.",
        ]);
        conflict_case = transition_status(
          "reconcile",
          conflict_case,
          "classified",
          ["Conflict case classified for the change path."]
        );
        reconcile_objects.push(conflict_case);
      }

      reconciliation = this.deps.reconcile_service.assess_reconciliation(
        reconcile_objects
      );
      reconciliation = {
        ...reconciliation,
        drift_record_ids: [drift_record.object_id],
        conflict_case_ids: conflict_case
          ? [conflict_case.object_id]
          : undefined,
        baseline_object_refs: deltaDriftAssessment.baseline_object_refs,
        affected_object_refs: deltaDriftAssessment.affected_object_refs,
        continuation_anchor_ref:
          deltaDriftAssessment.continuation_anchor_ref,
        supporting_evidence_refs:
          deltaDriftAssessment.supporting_evidence_refs,
        impact_summary: deltaDriftAssessment.impact_summary,
        notes: [
          ...reconciliation.notes,
          ...deltaDriftAssessment.notes,
        ],
      };
      push_event(
        "reconcile",
        "reconcile_assessed",
        conflict_case
          ? [drift_record.object_id, conflict_case.object_id]
          : [drift_record.object_id],
        [...reconciliation.notes]
      );
      push_step_outcome(
        "reconcile",
        reconcile_objects,
        "executed",
        conflict_case
          ? [
              "Requirement-change path emitted both drift and conflict artifacts because explicit reconcile tension was present.",
            ]
          : [
              "Requirement-change path emitted drift without forcing a conflict-case, then returned a bounded continue-with-change assessment.",
            ],
        [],
        [],
        []
      );
    } else {
      reconciliation = this.deps.reconcile_service.assess_reconciliation([
        action_unit,
        decision_record,
        semantic_fact,
      ].filter(Boolean) as RuntimeObjectRecord[]);
      push_event(
        "reconcile",
        "reconcile_assessed",
        semantic_fact
          ? [semantic_fact.object_id, action_unit.object_id]
          : [action_unit.object_id],
        [...reconciliation.notes]
      );
      push_step_outcome(
        "reconcile",
        [],
        "executed",
        [
          "Fresh-intent path performs a bounded reconcile assessment without emitting drift or conflict artifacts.",
        ],
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
            ? reconciliation.outcome === "needs_review"
              ? "review_pattern"
              : "change_pattern"
            : "success_pattern",
        candidate_summary:
          input.scenario_id === "requirement-change-midflow"
            ? reconciliation.outcome === "needs_review"
              ? "change path captured for later bounded review"
              : "change path captured for future bounded change reuse"
            : "fresh intent path captured for future reuse",
        source_episode_refs: [episode.object_id],
        source_evidence_refs: [
          trace_evidence.object_id,
          decision_record.object_id,
        ],
      })
    );
    push_event(
      "consolidate",
      "object_created",
      [learning_candidate.object_id],
      ["Learning candidate created."]
    );
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
            ? reconciliation.outcome === "needs_review"
              ? "episodic_memory"
              : "semantic_memory"
            : "episodic_memory",
        source_object_id: working_state.object_id,
        promotion_reason:
          input.scenario_id === "requirement-change-midflow"
            ? reconciliation.outcome === "needs_review"
              ? "change path retained episodically until later review semantics exist"
              : "change path stabilized for later semantic reuse"
            : "fresh path retained for later replay",
        approved_by_ref: "runtime-consolidation-service",
      })
    );
    push_event(
      "consolidate",
      "object_created",
      [promotion_record.object_id],
      ["Memory promotion record created."]
    );
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
      [
        "Learning candidate and promotion record created for deterministic consolidation inspection.",
      ],
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
          const binding = this.deps.binding_service.get_binding(
            record.object_type
          );
          return Boolean(binding?.mplp_object);
        })
        .map((record) => record.object_id),
      shallow_reconstructable_object_ids: creation_order
        .map((id) => object_map.get(id)!)
        .filter((record) => {
          const binding = this.deps.binding_service.get_binding(
            record.object_type
          );
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
        "Final MPLP artifact materialization is not performed inside runtime-core execution itself.",
        "The optional frozen export service may materialize only the bounded protocol subset justified by this preparation surface.",
      ],
    };
    push_event(
      "trace",
      "export_prepared",
      [...exportPreparation.protocol_relevant_object_ids],
      [...exportPreparation.notes]
    );

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
    const storeSnapshot = this.build_store_snapshot(input.project_id);
    const continuityState = this.deps.vsl_service?.checkpoint_project_continuity({
      project_id: input.project_id,
      scenario_id: input.scenario_id,
      last_completed_step: plan.steps.at(-1) ?? "consolidate",
      created_objects: finalCreatedObjects,
      store_snapshot: storeSnapshot,
      reconciliation,
    });
    const psgIngestResult = this.deps.psg_service?.ingest_runtime_objects({
      project_id: input.project_id,
      object_records: finalCreatedObjects,
    });
    const graphState: RuntimePsgGraphState | undefined =
      psgIngestResult?.graph_state;
    const graphUpdateSummary: RuntimePsgGraphUpdateSummary | undefined =
      psgIngestResult?.update_summary;

    return {
      scenario_id: input.scenario_id,
      status: "executed",
      planned_steps: plan.steps,
      touched_object_types: [
        ...new Set(finalCreatedObjects.map((record) => record.object_type)),
      ],
      created_objects: finalCreatedObjects,
      created_object_ids_by_type,
      status_transitions,
      event_timeline,
      ordered_step_outcomes,
      store_snapshot: storeSnapshot,
      continuity_state: continuityState,
      graph_state: graphState,
      graph_update_summary: graphUpdateSummary,
      policy_snapshots,
      ael_assessment: aelAssessment,
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
        continuityState
          ? `Project-scoped VSL continuity state checkpointed at ${continuityState.continuation_anchor.anchor_object_id}.`
          : "No VSL service configured, so continuity state was not checkpointed.",
        graphUpdateSummary
          ? `Project-scoped PSG graph updated with ${graphUpdateSummary.node_delta} net nodes and ${graphUpdateSummary.edge_delta} net edges.`
          : "No PSG service configured, so semantic graph state was not updated.",
      ],
    };
  }

  load_project_continuity(
    project_id: string
  ): RuntimeVslContinuityState | undefined {
    return this.deps.vsl_service?.load_project_continuity(project_id);
  }

  recover_continuation_anchor(
    project_id: string
  ): RuntimeContinuationAnchor | undefined {
    return this.deps.vsl_service?.recover_continuation_anchor(project_id);
  }

  inspect_project_graph(
    project_id: string
  ): RuntimePsgGraphState | undefined {
    return this.deps.psg_service?.inspect_project_graph(project_id);
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
