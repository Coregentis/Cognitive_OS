export type CoregentisObjectType =
  | "project"
  | "agent-group"
  | "agent-worker"
  | "role-profile"
  | "objective"
  | "work-item"
  | "review-cycle"
  | "memory-profile"
  | "preference-profile"
  | "cell-runtime-scope"
  | "cell-summary-runtime-record"
  | "management-directive-record"
  | "delivery-return-record"
  | "approval-request-record"
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

export const runtimePrivateManagementObjectTypes = [
  "management-directive-record",
  "delivery-return-record",
  "approval-request-record",
] as const;

export type RuntimePrivateManagementObjectType =
  typeof runtimePrivateManagementObjectTypes[number];

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

export type ProtocolArtifactType =
  | "context"
  | "plan"
  | "confirm"
  | "trace";

export type ProtocolExportOmissionCode =
  | "artifact_family_not_reconstructable"
  | "confirm_semantics_not_present"
  | "frozen_truth_blocks_export"
  | "validation_failed";

export type ProtocolExportReasonCode =
  | "no_direct_context_binding"
  | "context_required_fields_not_reconstructable"
  | "project_scope_not_exportable_as_context"
  | "no_direct_plan_binding"
  | "internal_runtime_plan_not_canonical_plan"
  | "plan_required_fields_not_reconstructable"
  | "no_confirm_gate_runtime_object"
  | "scenario_confirm_not_required"
  | "missing_binding_truth"
  | "missing_export_rule_truth"
  | "missing_locked_schema_path"
  | "protocol_export_not_allowed"
  | "missing_expected_mplp_object"
  | "schema_validation_failed";

export type ProtocolExportErrorCode =
  | "missing_required_binding_truth"
  | "missing_required_export_rule_truth"
  | "missing_locked_schema_truth"
  | "artifact_validation_failed";

export type ProtocolArtifactValidationDisposition =
  | "validated_and_passed"
  | "invalid";

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

export type RuntimeVslDurabilityMode =
  | "runtime_instance_bounded_in_memory";

export type RuntimeContinuationDisposition =
  | "recoverable"
  | "review_required";

export interface RuntimeContinuationAnchor {
  project_id: string;
  scenario_id: string;
  anchor_object_id: string;
  anchor_object_type: CoregentisObjectType;
  anchored_at: string;
  source_object_ids: string[];
  last_completed_step: MinimalLoopStep;
  disposition: RuntimeContinuationDisposition;
  notes: string[];
}

export interface RuntimeReplayHorizon {
  mode: "episodic_checkpoint_window";
  anchor_object_id: string;
  replayable_object_ids: string[];
  notes: string[];
}

export interface RuntimeRollbackHorizon {
  mode: "checkpoint_boundary_only";
  anchor_object_id: string;
  boundary_step: MinimalLoopStep;
  rollback_candidate_object_ids: string[];
  notes: string[];
}

export interface RuntimeRetentionHorizon {
  mode: "bounded_memory_partition";
  retained_object_ids: string[];
  expirable_object_ids: string[];
  notes: string[];
}

export interface RuntimeVslContinuityState {
  project_id: string;
  scenario_id: string;
  continuity_revision: number;
  durability_mode: RuntimeVslDurabilityMode;
  continuity_status: RuntimeContinuationDisposition;
  updated_at: string;
  last_completed_step: MinimalLoopStep;
  continuation_anchor: RuntimeContinuationAnchor;
  replay_horizon: RuntimeReplayHorizon;
  rollback_horizon: RuntimeRollbackHorizon;
  retention_horizon: RuntimeRetentionHorizon;
  store_snapshot: RuntimeStoreSnapshot;
  notes: string[];
}

export interface RuntimeVslStore {
  write(state: RuntimeVslContinuityState): RuntimeVslContinuityState;
  load(project_id: string): RuntimeVslContinuityState | undefined;
  recover_continuation_anchor(
    project_id: string
  ): RuntimeContinuationAnchor | undefined;
  clear(): void;
}

export interface RuntimePolicySnapshot {
  matched_rule_ids: string[];
  confirm_required: boolean;
  suppressed: boolean;
  notes: string[];
}

export type RuntimeReconciliationOutcome =
  | "can_continue"
  | "can_continue_with_change"
  | "needs_review";

export interface RuntimeReconciliationSnapshot {
  outcome: RuntimeReconciliationOutcome;
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

export interface ProtocolSchemaValidationError {
  path: string;
  message: string;
}

export interface ProtocolExportedArtifactRecord {
  artifact_type: ProtocolArtifactType;
  artifact_id: string;
  source_object_id: string;
  source_object_type: CoregentisObjectType;
  source_runtime_object_refs: string[];
  schema_path: string;
  schema_id: string;
  artifact: Record<string, unknown>;
  notes: string[];
}

export interface ProtocolExportOmissionRecord {
  artifact_type: ProtocolArtifactType;
  source_object_type?: CoregentisObjectType;
  source_object_ids: string[];
  omission_code: ProtocolExportOmissionCode;
  reason_codes: ProtocolExportReasonCode[];
  reasons: string[];
}

export interface ProtocolArtifactValidationRecord {
  artifact_type: ProtocolArtifactType;
  artifact_id: string;
  source_object_id: string;
  source_runtime_object_refs: string[];
  schema_path: string;
  schema_id: string;
  disposition: ProtocolArtifactValidationDisposition;
  valid: boolean;
  error_count: number;
  errors: ProtocolSchemaValidationError[];
  notes: string[];
}

export interface ProtocolExportErrorRecord {
  artifact_type: ProtocolArtifactType;
  source_object_id?: string;
  source_object_type?: CoregentisObjectType;
  error_code: ProtocolExportErrorCode;
  reason_codes: ProtocolExportReasonCode[];
  message: string;
  notes: string[];
}

export interface RuntimeProtocolExportFamilyValidationSummary {
  validated_and_passed_source_object_ids: string[];
  omitted_by_truth_source_object_ids: string[];
  blocked_by_export_truth_source_object_ids: string[];
  invalid_source_object_ids: string[];
  export_error_codes: ProtocolExportErrorCode[];
}

export interface RuntimeProtocolExportManifest {
  manifest_version: "0.1.0";
  bundle_status: "complete_with_omissions" | "complete_with_errors";
  exported_artifact_ids_by_type: Record<ProtocolArtifactType, string[]>;
  exported_source_object_ids_by_type: Record<ProtocolArtifactType, string[]>;
  runtime_source_object_refs_by_artifact_id: Record<string, string[]>;
  omitted_targets_by_type: Record<
    ProtocolArtifactType,
    Array<{
      source_object_ids: string[];
      omission_code: ProtocolExportOmissionCode;
      reason_codes: ProtocolExportReasonCode[];
    }>
  >;
  family_validation_disposition_by_type: Record<
    ProtocolArtifactType,
    RuntimeProtocolExportFamilyValidationSummary
  >;
  export_error_codes: ProtocolExportErrorCode[];
  frozen_truth_sources_consulted: {
    import_lock_id: string;
    locked_schema_paths: Record<ProtocolArtifactType, string>;
    binding_object_types_consulted: CoregentisObjectType[];
    export_rule_object_types_consulted: CoregentisObjectType[];
  };
  notes: string[];
}

export interface RuntimeProtocolExportSummary {
  exported_artifact_counts_by_type: Record<ProtocolArtifactType, number>;
  omitted_artifact_counts_by_type: Record<ProtocolArtifactType, number>;
  protocol_relevant_runtime_object_ids: string[];
  exported_runtime_object_ids: string[];
  notes: string[];
}

export interface RuntimeProtocolExportValidationSummary {
  validation_mode: "locked_schema_truth_minimal";
  validated_artifact_count: number;
  valid_artifact_count: number;
  invalid_artifact_count: number;
  artifact_results: ProtocolArtifactValidationRecord[];
  family_disposition_by_type: Record<
    ProtocolArtifactType,
    RuntimeProtocolExportFamilyValidationSummary
  >;
  notes: string[];
}

export interface RuntimeProtocolExportTruthSummary {
  import_lock_id: string;
  protocol_version: string;
  schema_bundle_version: string;
  source_reference_type: string;
  source_reference_value: string;
  locked_schema_paths: Record<ProtocolArtifactType, string>;
  binding_object_types_consulted: CoregentisObjectType[];
  export_rule_object_types_consulted: CoregentisObjectType[];
  notes: string[];
}

export interface RuntimeProtocolExportBundle {
  export_metadata: {
    bundle_version: "0.1.0";
    scenario_id: string;
    project_id: string;
    export_scope: "minimal_mplp_reconstruction";
    deterministic_anchor_timestamp: string;
    created_object_count: number;
  };
  export_manifest: RuntimeProtocolExportManifest;
  export_summary: RuntimeProtocolExportSummary;
  exported_artifacts_by_type: Record<
    ProtocolArtifactType,
    ProtocolExportedArtifactRecord[]
  >;
  omitted_artifacts_by_type: Record<
    ProtocolArtifactType,
    ProtocolExportOmissionRecord[]
  >;
  export_validation_summary: RuntimeProtocolExportValidationSummary;
  export_truth_summary: RuntimeProtocolExportTruthSummary;
  export_errors: ProtocolExportErrorRecord[];
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
  continuity_state?: RuntimeVslContinuityState;
  policy_snapshots?: RuntimePolicySnapshot[];
  confirm_summary?: RuntimeConfirmSummary;
  evidence_summary?: RuntimeEvidenceSummary;
  reconciliation?: RuntimeReconciliationSnapshot;
  truth_consultation?: RuntimeTruthConsultationSummary;
  export_preparation?: RuntimeExportPreparationSummary;
  protocol_export?: RuntimeProtocolExportBundle;
  notes: string[];
}
