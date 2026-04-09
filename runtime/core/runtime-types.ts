export type CoregentisObjectType =
  | "project"
  | "external-input-record"
  | "intent"
  | "delta-intent"
  | "working-state-node"
  | "episode"
  | "semantic-fact"
  | "activation-signal"
  | "action-unit"
  | "policy-rule"
  | "confirm-gate"
  | "trace-evidence"
  | "decision-record"
  | "drift-record"
  | "conflict-case"
  | "memory-promotion-record"
  | "learning-candidate";

export type CoregentisAuthorityClass =
  | "protocol_native"
  | "runtime_bound"
  | "coregentis_private_runtime"
  | "product_projected"
  | "derived_ephemeral";

export type CoregentisPrimaryLayer =
  | "mplp_protocol_constitution"
  | "cognitive_constitution_layer"
  | "cognitive_runtime_core"
  | "organization_runtime_layer"
  | "product_projection_layer";

export type CoregentisMemoryLayer =
  | "working_memory"
  | "episodic_memory"
  | "semantic_memory"
  | null;

export type CoregentisTemporalClass =
  | "ephemeral"
  | "session_bounded"
  | "replayable"
  | "promotable"
  | "durable"
  | "expirable"
  | "archival";

export type CoregentisMutationClass =
  | "immutable_after_creation"
  | "append_only"
  | "stateful_mutable"
  | "promotion_based"
  | "policy_mutable"
  | "derivation_only";

export type RuntimeRelationshipType =
  | "references"
  | "contains"
  | "derived_from"
  | "promoted_from"
  | "conflicts_with"
  | "governs"
  | "evidences";

export type BindingClass =
  | "shallow_reconstructable_runtime_bound"
  | "protocol_adjacent_but_not_exportable"
  | "runtime_private_only"
  | "export_restricted_internal";

export type ExportClass =
  | "protocol_compliant_export"
  | "protocol_adjacent_export_restricted"
  | "runtime_private_non_exportable"
  | "internal_derived_only";

export type RuntimeSubstrateHint =
  | "psg"
  | "vsl"
  | "ael"
  | "multi_substrate"
  | "unresolved";

export type MinimalLoopStep =
  | "form"
  | "place"
  | "activate"
  | "confirm"
  | "trace"
  | "reconcile"
  | "consolidate";

export interface RuntimeProtocolBindingRef {
  binding_class: "protocol_native" | "runtime_bound";
  protocol_object_type?: string;
  protocol_object_id?: string;
  reconstructable: boolean;
}

export interface RuntimeObjectRecord {
  schema_version?: string;
  object_id: string;
  object_type: CoregentisObjectType;
  authority_class: CoregentisAuthorityClass;
  primary_layer: CoregentisPrimaryLayer;
  memory_layer?: CoregentisMemoryLayer;
  status: string;
  project_id?: string;
  protocol_binding_ref?: RuntimeProtocolBindingRef;
  temporal: Record<string, unknown>;
  mutation: Record<string, unknown>;
  lineage: Record<string, unknown>;
  governance: Record<string, unknown>;
  [key: string]: unknown;
}

export interface RuntimeObjectStore {
  put(record: RuntimeObjectRecord): void;
  get(object_id: string): RuntimeObjectRecord | undefined;
  list_by_project(project_id?: string): RuntimeObjectRecord[];
  clear(): void;
  snapshot_ids(project_id?: string): string[];
}

export interface RegistryEntryRecord {
  object_type: CoregentisObjectType;
  schema_ref: string;
  authority_class: CoregentisAuthorityClass;
  functional_family:
    | "organization"
    | "entry"
    | "memory"
    | "action"
    | "governance"
    | "evidence"
    | "learning";
  primary_layer: CoregentisPrimaryLayer;
  memory_layer: CoregentisMemoryLayer;
  temporal_class: CoregentisTemporalClass;
  mutation_class: CoregentisMutationClass;
  protocol_binding_ref_policy:
    | "optional_shallow_runtime_bound"
    | "not_applicable";
  allowed_relationships: RuntimeRelationshipType[];
  notes: string;
}

export interface BindingMatrixEntryRecord {
  coregentis_object: CoregentisObjectType;
  mplp_object: string | null;
  binding_class: BindingClass;
  import_rule: string;
  export_rule: string;
  reconstruction_rule: string;
  compatibility_notes: string;
  runtime_substrate_hint: RuntimeSubstrateHint;
  runtime_substrate_note: string;
}

export interface ExportRuleRecord {
  export_class: ExportClass;
  eligible_object_types: CoregentisObjectType[];
  export_conditions: string[];
  non_exportable_reasons: string[];
  reconstruction_expectation:
    | "shallow_reconstructable"
    | "partial_only"
    | "not_applicable"
    | "indirect_only";
  notes: string;
}

export interface MinimalLoopInput {
  scenario_id: string;
  project_id: string;
  raw_input: Record<string, unknown>;
  prior_object_refs?: string[];
}

export interface MinimalLoopPlan {
  scenario_id: string;
  steps: MinimalLoopStep[];
  target_object_types: CoregentisObjectType[];
  notes: string[];
}

export interface RuntimeStoreSnapshot {
  working_object_ids: string[];
  episodic_object_ids: string[];
  semantic_object_ids: string[];
  evidence_object_ids: string[];
}

export interface RuntimePolicySnapshot {
  matched_rule_ids: string[];
  confirm_required: boolean;
  suppressed: boolean;
  notes: string[];
}

export interface RuntimeReconciliationSnapshot {
  can_continue: boolean;
  drift_record_ids?: string[];
  conflict_case_ids?: string[];
  notes: string[];
}

export interface RuntimeStatusTransition {
  object_id: string;
  object_type: CoregentisObjectType;
  from_status: string;
  to_status: string;
}

export interface RuntimeEventTimelineEntry {
  sequence: number;
  step: MinimalLoopStep;
  event_kind:
    | "object_created"
    | "status_transition"
    | "policy_evaluated"
    | "stage_skipped"
    | "confirm_resolution"
    | "reconcile_assessed"
    | "export_prepared";
  related_object_ids: string[];
  status_transition?: RuntimeStatusTransition;
  notes: string[];
}

export interface RuntimeStepOutcome {
  step: MinimalLoopStep;
  status: "executed" | "skipped";
  created_object_ids: string[];
  created_object_types: CoregentisObjectType[];
  consulted_registry_object_types: CoregentisObjectType[];
  consulted_binding_object_types: CoregentisObjectType[];
  consulted_export_object_types: CoregentisObjectType[];
  notes: string[];
}

export type CreatedObjectIdsByType = Partial<
  Record<CoregentisObjectType, string[]>
>;

export interface RuntimeConfirmSummary {
  confirm_required: boolean;
  confirm_gate_id?: string;
  confirm_status?: string;
  matched_rule_ids: string[];
  notes: string[];
}

export interface RuntimeEvidenceSummary {
  trace_evidence_ids: string[];
  decision_record_ids: string[];
  notes: string[];
}

export interface RuntimeTruthConsultationSummary {
  registry_object_types: CoregentisObjectType[];
  binding_object_types: CoregentisObjectType[];
  export_rule_object_types: CoregentisObjectType[];
  notes: string[];
}

export interface RuntimeExportPreparationSummary {
  protocol_relevant_object_ids: string[];
  shallow_reconstructable_object_ids: string[];
  non_exportable_object_ids: string[];
  export_restricted_object_ids: string[];
  notes: string[];
}

export interface MinimalLoopRunResult {
  scenario_id: string;
  status: "scaffold_only" | "executed";
  planned_steps: MinimalLoopStep[];
  touched_object_types: CoregentisObjectType[];
  created_objects: RuntimeObjectRecord[];
  created_object_ids_by_type?: CreatedObjectIdsByType;
  status_transitions?: RuntimeStatusTransition[];
  event_timeline?: RuntimeEventTimelineEntry[];
  ordered_step_outcomes?: RuntimeStepOutcome[];
  store_snapshot?: RuntimeStoreSnapshot;
  policy_snapshots?: RuntimePolicySnapshot[];
  confirm_summary?: RuntimeConfirmSummary;
  evidence_summary?: RuntimeEvidenceSummary;
  reconciliation?: RuntimeReconciliationSnapshot;
  truth_consultation?: RuntimeTruthConsultationSummary;
  export_preparation?: RuntimeExportPreparationSummary;
  notes: string[];
}
