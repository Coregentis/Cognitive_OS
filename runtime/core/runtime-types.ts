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

export interface MinimalLoopRunResult {
  scenario_id: string;
  status: "scaffold_only";
  planned_steps: MinimalLoopStep[];
  touched_object_types: CoregentisObjectType[];
  notes: string[];
}
