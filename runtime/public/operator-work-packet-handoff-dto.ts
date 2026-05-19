// DTO/projection contract implementation only.
// No runtime behavior.
// No external side-effect authority.
// No training, mutation, or package publication.

export type OperatorWorkPacketContractVersion = string;

export type OperatorWorkPacketRuntimeContractVersion = string;

export type OperatorWorkPacketCompatibilityProfile = string;

export type OperatorWorkPacketProjectionBundleVersion = string;

export type OperatorWorkPacketVersionRefDto = {
  ref_kind: "protocol" | "binding" | "runtime" | "contract" | "bundle";
  ref_id: string;
  ref_version: string;
};

export type OperatorWorkPacketVersionRefs = {
  protocol_version_refs: readonly OperatorWorkPacketVersionRefDto[];
  binding_version_refs: readonly OperatorWorkPacketVersionRefDto[];
  runtime_version_refs: readonly OperatorWorkPacketVersionRefDto[];
  contract_version_refs?: readonly OperatorWorkPacketVersionRefDto[];
  bundle_version_refs?: readonly OperatorWorkPacketVersionRefDto[];
};

export type OperatorWorkPacketEvidenceRef = {
  evidence_ref: string;
  evidence_kind?: string;
  summary?: string;
};

export type OperatorWorkPacketOmissionMarker = {
  marker: string;
  reason: string;
};

export type OperatorWorkPacketMplpModuleName =
  | "Context"
  | "Plan"
  | "Confirm"
  | "Trace"
  | "Role"
  | "Extension"
  | "Dialog"
  | "Collab"
  | "Core"
  | "Network";

export type OperatorWorkPacketMplpBindingStrength =
  | "required"
  | "supportive"
  | "optional"
  | "not_applicable";

export type OperatorWorkPacketMplpModuleBinding = {
  module_name: OperatorWorkPacketMplpModuleName;
  binding_strength: OperatorWorkPacketMplpBindingStrength;
  rationale: string;
};

export type OperatorWorkPacketMplpBindingRef = {
  binding_ref: string;
  component_ref: string;
  module_mapping: readonly OperatorWorkPacketMplpModuleBinding[];
  mpgc_mapping_gate: "satisfied";
  existing_mplp_semantics_sufficient: true;
  cognitive_os_side_non_normative: true;
  no_mplp_schema_change: true;
  no_mplp_protocol_law_change: true;
  no_mplp_normative_binding_change: true;
  no_schema_level_conformance_claim: true;
  no_certification_claim: true;
  no_formal_assurance_claim: true;
  no_endorsement_claim: true;
  no_regulator_approval_claim: true;
  no_official_compliance_claim: true;
};

export type OperatorWorkPacketClarificationPosture =
  | "not_required"
  | "requested"
  | "provided"
  | "blocked"
  | "deferred";

export type OperatorWorkPacketIntakePosture =
  | "captured"
  | "clarification_required"
  | "blocked"
  | "deferred"
  | "insufficient";

export type OperatorWorkPacketAssignmentStatus =
  | "not_assigned"
  | "assigned"
  | "blocked"
  | "deferred";

export type OperatorWorkPacketWorkerActivityStatus =
  | "not_started"
  | "in_progress_summary"
  | "blocked"
  | "deferred"
  | "review_ready"
  | "completed_summary";

export type OperatorWorkPacketReviewPosture =
  | "not_reviewed"
  | "review_ready"
  | "review_in_progress"
  | "blocked"
  | "deferred";

export type AcceptanceState =
  | "not_reviewed"
  | "accepted"
  | "needs_revision"
  | "rejected"
  | "parked";

export type OperatorWorkPacketFeedbackInfluencePosture =
  | "summary_only"
  | "correction_candidate"
  | "preference_candidate"
  | "blocked"
  | "deferred";

export type OperatorWorkPacketStorageExportPosture =
  | "summary_only"
  | "stored_reference_only"
  | "export_prepared_reference_only"
  | "blocked"
  | "deferred";

export type OperatorWorkPacketContinuityPosture =
  | "active"
  | "stale"
  | "blocked"
  | "deferred"
  | "closed";

export type KernelDutyPostureValue =
  | "enforced"
  | "projected"
  | "evidenced"
  | "documented_only"
  | "omitted"
  | "deferred"
  | "not_applicable";

export type KernelDutyId =
  | "KD-01"
  | "KD-02"
  | "KD-03"
  | "KD-04"
  | "KD-05"
  | "KD-06"
  | "KD-07"
  | "KD-08"
  | "KD-09"
  | "KD-10"
  | "KD-11";

export type KernelDutyName =
  | "Coordination"
  | "Error Handling"
  | "Event Bus"
  | "Learning Feedback"
  | "Observability"
  | "Orchestration"
  | "Performance"
  | "Protocol Versioning"
  | "Security"
  | "State Sync"
  | "Transaction";

export type KernelDutyPostureEntry = {
  duty_id: KernelDutyId;
  duty_name: KernelDutyName;
  posture: KernelDutyPostureValue;
  component_refs: readonly string[];
  evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  projection_safe: true;
};

export type KernelDutyPosture = {
  posture_ref: string;
  duties: readonly KernelDutyPostureEntry[];
  all_kernel_duties_represented: true;
  posture_values_limited_to_allowed_set: true;
  no_full_duty_enforcement_claim_without_evidence: true;
  runtime_private_fields_omitted: true;
};

export type AdvancedRuntimePosture = {
  posture_ref: string;
  dialog_ref: string | null;
  clarification_ref: string | null;
  source_intent_ref: string;
  intent_drift_marker: string | null;
  semantic_loss_marker: string | null;
  psg_pointer: string | null;
  ael_event_ref: string | null;
  vsl_state_ref?: string | null;
  value_state_ref?: string | null;
  learning_feedback_ref: string | null;
  unavailable_substrate_omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  implements_full_dialog_runtime: false;
  implements_full_ael_runtime: false;
  implements_full_vsl_runtime: false;
  implements_full_psg_runtime: false;
  implements_full_drift_engine: false;
  implements_full_learning_engine: false;
  grants_execution_authority: false;
  grants_training_authority: false;
  grants_mutation_authority: false;
  projection_safe_refs_only: true;
};

export type OperatorIntentSummary = {
  intent_summary_ref: string;
  source_intent_ref: string;
  summary: string;
  dialog_ref: string | null;
  clarification_ref: string | null;
  clarification_posture: OperatorWorkPacketClarificationPosture;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  mplp_binding: OperatorWorkPacketMplpBindingRef;
  raw_prompt_omitted: true;
  raw_conversation_transcript_omitted: true;
  runtime_private_fields_omitted: true;
};

export type WorkIntakeSummary = {
  intake_ref: string;
  source_intent_ref: string;
  dialog_ref: string | null;
  clarification_ref: string | null;
  intake_posture: OperatorWorkPacketIntakePosture;
  blocked_or_deferred_reason?: string;
  insufficiency_markers: readonly string[];
  intent_drift_marker: string | null;
  semantic_loss_marker: string | null;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  mplp_binding: OperatorWorkPacketMplpBindingRef;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type WorkPacketSummary = {
  packet_ref: string;
  source_intent_ref: string;
  objective_summary: string;
  constraints_summary: string;
  expected_output_posture: string;
  semantic_loss_marker: string | null;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  kernel_duty_posture_refs: readonly string[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  mplp_binding: OperatorWorkPacketMplpBindingRef;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type ObjectivePacketSummary = WorkPacketSummary;

export type AssignmentSummary = {
  assignment_ref: string;
  packet_ref: string;
  assigned_unit_refs: readonly string[];
  assigned_capability_refs: readonly string[];
  coordination_scope: string;
  assignment_status: OperatorWorkPacketAssignmentStatus;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  mplp_binding: OperatorWorkPacketMplpBindingRef;
  runtime_private_worker_state_omitted: true;
  no_dispatch_authority: true;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type WorkerActivitySummary = {
  activity_summary_ref: string;
  packet_ref: string;
  worker_ref?: string;
  capability_refs: readonly string[];
  activity_refs: readonly string[];
  activity_status: OperatorWorkPacketWorkerActivityStatus;
  ael_event_ref: string | null;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  mplp_binding: OperatorWorkPacketMplpBindingRef;
  runtime_private_omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  no_provider_dispatch: true;
  no_tool_invocation: true;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type ReviewableOutputSummary = {
  output_ref: string;
  packet_ref: string;
  output_summary: string;
  review_posture: OperatorWorkPacketReviewPosture;
  insufficiency_flags: readonly string[];
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  mplp_binding: OperatorWorkPacketMplpBindingRef;
  raw_output_payload_omitted_unless_projection_safe_summary: true;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type AcceptanceStateSummary = {
  acceptance_ref: string;
  state: AcceptanceState;
  feedback_refs: readonly string[];
  operator_judgment_posture: "manual_judgment_required" | "manual_judgment_recorded";
  value_state_ref?: string | null;
  vsl_state_ref?: string | null;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  mplp_binding: OperatorWorkPacketMplpBindingRef;
  no_protocol_assurance_claim: true;
  no_autonomous_acceptance: true;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type OperatorFeedbackSummary = {
  feedback_ref: string;
  acceptance_ref: string;
  correction_preference_influence_posture: OperatorWorkPacketFeedbackInfluencePosture;
  learning_feedback_ref: string | null;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  mplp_binding: OperatorWorkPacketMplpBindingRef;
  no_training_authority: true;
  no_automatic_mutation: true;
  no_automatic_writeback_authority: true;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type DeliveryArtifactSummary = {
  artifact_ref: string;
  output_ref: string;
  artifact_kind_summary: string;
  storage_export_posture: OperatorWorkPacketStorageExportPosture;
  value_state_ref?: string | null;
  vsl_state_ref?: string | null;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  mplp_binding: OperatorWorkPacketMplpBindingRef;
  private_payload_omitted_marker: OperatorWorkPacketOmissionMarker;
  no_publishing_authority: true;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type ContinuityPointer = {
  continuation_ref: string;
  source_packet_ref: string;
  source_output_ref?: string;
  source_artifact_ref?: string;
  continuity_posture: OperatorWorkPacketContinuityPosture;
  value_state_ref?: string | null;
  vsl_state_ref?: string | null;
  psg_pointer: string | null;
  psg_omission_marker?: OperatorWorkPacketOmissionMarker;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  mplp_binding: OperatorWorkPacketMplpBindingRef;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type ProjectionSafeEnvelope = {
  envelope_ref: string;
  contract_version: OperatorWorkPacketContractVersion;
  runtime_contract_version: OperatorWorkPacketRuntimeContractVersion;
  compatibility_profile: OperatorWorkPacketCompatibilityProfile;
  protocol_version_refs: readonly OperatorWorkPacketVersionRefDto[];
  binding_version_refs: readonly OperatorWorkPacketVersionRefDto[];
  runtime_version_refs: readonly OperatorWorkPacketVersionRefDto[];
  contract_version_refs?: readonly OperatorWorkPacketVersionRefDto[];
  bundle_version_refs?: readonly OperatorWorkPacketVersionRefDto[];
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  kernel_duty_posture: KernelDutyPosture;
  advanced_runtime_posture: AdvancedRuntimePosture;
  non_execution_boundary: true;
  runtime_private_fields_omitted: true;
  projection_safe: true;
  no_provider_dispatch: true;
  no_channel_dispatch: true;
  no_tool_invocation: true;
  no_payment: true;
  no_publishing: true;
  no_customer_outreach: true;
  no_autonomous_external_action: true;
  no_training_authority: true;
  no_automatic_mutation: true;
  no_package_publication: true;
  no_mplp_schema_change: true;
  no_mplp_protocol_law_change: true;
  no_mplp_normative_binding_change: true;
};

export type OperatorWorkPacketBoundaryProfile = {
  contract_version: OperatorWorkPacketContractVersion;
  runtime_contract_version: OperatorWorkPacketRuntimeContractVersion;
  compatibility_profile: OperatorWorkPacketCompatibilityProfile;
  projection_safe: true;
  deterministic: true;
  non_execution_boundary: true;
  non_executing: true;
  runtime_private_payload_omitted: true;
  runtime_private_fields_omitted: true;
  provider_free: true;
  dispatch_free: true;
  product_neutral: true;
  mplp_bound: true;
  no_provider_dispatch: true;
  no_channel_dispatch: true;
  no_tool_invocation: true;
  no_payment: true;
  no_publishing: true;
  no_customer_outreach: true;
  no_autonomous_external_action: true;
  no_training_authority: true;
  no_automatic_mutation: true;
  no_automatic_writeback_authority: true;
  no_package_publication: true;
  no_full_dialog_runtime: true;
  no_full_ael_runtime: true;
  no_full_vsl_runtime: true;
  no_full_psg_runtime: true;
  no_drift_engine: true;
  no_learning_engine: true;
  no_mplp_schema_change: true;
  no_mplp_protocol_law_change: true;
  no_mplp_normative_binding_change: true;
  no_certification_or_endorsement: true;
};

export type OperatorWorkPacketValidationSummary = {
  validation_summary_ref: string;
  validation_status: "valid" | "blocked" | "invalid";
  validation_notes: readonly string[];
  missing_required_refs: readonly string[];
  boundary_flags_verified: true;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export type OperatorWorkPacketHandoffEnvelope = {
  handoff_envelope_ref: string;
  contract_version: OperatorWorkPacketContractVersion;
  runtime_contract_version: OperatorWorkPacketRuntimeContractVersion;
  compatibility_profile: OperatorWorkPacketCompatibilityProfile;
  generated_from_runtime_surface_ref: string;
  source_commit_ref: string;
  operator_intent_summary: OperatorIntentSummary;
  work_intake_summary: WorkIntakeSummary;
  work_packet_summary: WorkPacketSummary;
  assignment_summary: AssignmentSummary;
  worker_activity_summary: WorkerActivitySummary;
  reviewable_output_summary: ReviewableOutputSummary;
  acceptance_state: AcceptanceStateSummary;
  operator_feedback_summary: OperatorFeedbackSummary;
  delivery_artifact_summary: DeliveryArtifactSummary;
  continuity_pointer: ContinuityPointer;
  advanced_runtime_posture: AdvancedRuntimePosture;
  kernel_duty_posture: KernelDutyPosture;
  projection_safe_envelope: ProjectionSafeEnvelope;
  boundary_profile: OperatorWorkPacketBoundaryProfile;
  version_refs: OperatorWorkPacketVersionRefs;
  safe_evidence_refs: readonly OperatorWorkPacketEvidenceRef[];
  omission_markers: readonly OperatorWorkPacketOmissionMarker[];
  validation_summary: OperatorWorkPacketValidationSummary;
  runtime_private_fields_omitted: true;
  non_executing: true;
};

export const OPERATOR_WORK_PACKET_ACCEPTANCE_STATES = [
  "not_reviewed",
  "accepted",
  "needs_revision",
  "rejected",
  "parked",
] as const satisfies readonly AcceptanceState[];

export const OPERATOR_WORK_PACKET_KERNEL_DUTIES = [
  { duty_id: "KD-01", duty_name: "Coordination" },
  { duty_id: "KD-02", duty_name: "Error Handling" },
  { duty_id: "KD-03", duty_name: "Event Bus" },
  { duty_id: "KD-04", duty_name: "Learning Feedback" },
  { duty_id: "KD-05", duty_name: "Observability" },
  { duty_id: "KD-06", duty_name: "Orchestration" },
  { duty_id: "KD-07", duty_name: "Performance" },
  { duty_id: "KD-08", duty_name: "Protocol Versioning" },
  { duty_id: "KD-09", duty_name: "Security" },
  { duty_id: "KD-10", duty_name: "State Sync" },
  { duty_id: "KD-11", duty_name: "Transaction" },
] as const satisfies readonly { duty_id: KernelDutyId; duty_name: KernelDutyName }[];

export const OPERATOR_WORK_PACKET_KERNEL_DUTY_POSTURE_VALUES = [
  "enforced",
  "projected",
  "evidenced",
  "documented_only",
  "omitted",
  "deferred",
  "not_applicable",
] as const satisfies readonly KernelDutyPostureValue[];

export const OPERATOR_WORK_PACKET_MPLP_MODULES = [
  "Context",
  "Plan",
  "Confirm",
  "Trace",
  "Role",
  "Extension",
  "Dialog",
  "Collab",
  "Core",
  "Network",
] as const satisfies readonly OperatorWorkPacketMplpModuleName[];
