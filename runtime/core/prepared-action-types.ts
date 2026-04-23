// Neutral prepared-action surfaces are interface-first only in this wave.
// They are draft-only, projection-safe, non-executing, non-dispatching,
// non-approving, and non-queueing.

export const PREPARED_ACTION_DESIGN_SURFACES = [
  "PreparedActionProjection",
  "PreparedActionIntentSummary",
  "PreparedActionRiskSummary",
  "PreparedActionEvidenceSufficiency",
  "PreparedActionMissingInformation",
  "PreparedActionConfirmationRequirement",
  "PreparedActionBoundaryPosture",
  "PreparedActionSafeEvidenceRef",
] as const;

export const PREPARED_ACTION_NON_CAPABILITY_LINES = [
  "Prepared action is draft-only.",
  "Prepared action is projection-safe.",
  "Prepared action is not execution.",
  "Prepared action is not approval.",
  "Prepared action is not dispatch.",
  "Prepared action is not provider/channel send.",
  "Prepared action is not queue insertion.",
  "Prepared action is not autonomous operation.",
] as const;

export interface PreparedActionSafeEvidenceRef {
  evidence_ref: string;
  evidence_label?: string;
}

export interface PreparedActionIntentSummary {
  action_label: string;
  action_summary: string;
  non_executing_posture: string;
}

export interface PreparedActionRiskSummary {
  risk_summary: string;
  boundary_summary: string;
  non_executing_posture: string;
}

export interface PreparedActionEvidenceSufficiency {
  sufficiency_state: "insufficient" | "partial" | "sufficient";
  sufficiency_summary: string;
  runtime_private_fields_omitted: true;
}

export interface PreparedActionMissingInformation {
  missing_information_summary: string;
  missing_information_items: string[];
  runtime_private_fields_omitted: true;
}

export interface PreparedActionConfirmationRequirement {
  confirmation_required: boolean;
  confirmation_summary: string;
  runtime_private_fields_omitted: true;
  non_executing_posture: string;
}

export interface PreparedActionBoundaryPosture {
  non_executing_posture: string;
  provider_channel_execution_available: false;
  approval_dispatch_execution_available: false;
  queue_available: false;
  runtime_private_fields_omitted: true;
}

export interface PreparedActionProjection {
  prepared_action_id: string;
  project_id: string;
  intent_summary: PreparedActionIntentSummary;
  risk_summary: PreparedActionRiskSummary;
  evidence_sufficiency: PreparedActionEvidenceSufficiency;
  missing_information: PreparedActionMissingInformation;
  confirmation_requirement: PreparedActionConfirmationRequirement;
  boundary_posture: PreparedActionBoundaryPosture;
  safe_evidence_refs: PreparedActionSafeEvidenceRef[];
  runtime_private_fields_omitted: true;
  created_at: string;
}
