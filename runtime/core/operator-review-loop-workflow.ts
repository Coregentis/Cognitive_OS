import {
  create_error_insufficiency_posture,
} from "./error-insufficiency-posture.ts";
import {
  DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES,
} from "./default-kernel-duty-posture.ts";
import {
  DEFAULT_MPLP_MODULE_POSTURES,
} from "./default-mplp-module-posture.ts";
import type {
  KernelDutyRuntimePostureRecord,
} from "./kernel-duty-runtime-posture.ts";
import type {
  MplpModulePostureRecord,
} from "./mplp-module-posture.ts";
import {
  build_projection_safe_runtime_envelope,
} from "./projection-safe-runtime-envelope-builder.ts";
import type {
  ProjectionSafeEvidenceRef,
  ProjectionSafeOmissionMarker,
} from "./projection-safe-envelope.ts";
import {
  create_state_snapshot_posture,
} from "./state-snapshot-posture.ts";
import {
  create_transaction_export_posture,
} from "./transaction-export-posture.ts";
import type {
  DeterministicEvidenceBundle,
  EvidenceBundleKind,
  LocalReviewLoopResult,
  OperatorEntrySurface,
  OperatorReviewPacket,
  OperatorSession,
  OperatorSessionStatus,
  OperatorWorkspace,
  OperatorWorkspaceStatus,
  ProjectionSafeHandoffEnvelope,
  ReviewLoopRunner,
  ReviewLoopState,
  ReviewLoopStatus,
  ReviewStepRef,
  RuntimeBoundaryProfile,
  SessionEvidenceLedger,
} from "./operator-review-loop-contract.ts";

const DEFAULT_CREATED_AT = "1970-01-01T00:00:00.000Z";

const DEFAULT_BOUNDARY_PROFILE: RuntimeBoundaryProfile = {
  local_only: true,
  manual_first: true,
  review_only: true,
  deterministic: true,
  non_executing: true,
  runtime_private_payload_omitted: true,
  projection_safe: true,
  no_external_service: true,
  no_filesystem_write: true,
  no_database_storage: true,
  no_persistence_adapter: true,
  no_file_export_path: true,
  no_cloud_sync: true,
  no_provider_dispatch: true,
  no_channel_dispatch: true,
  no_marketplace: true,
  no_crm: true,
  no_email_dispatch: true,
  no_public_publishing: true,
  no_payment: true,
  no_llm_or_tool_invocation: true,
  no_autonomy: true,
  no_package_publish: true,
  no_certification_or_endorsement: true,
};

export type CreateRuntimeBoundaryProfileInput = Record<string, never>;

export type CreateOperatorWorkspaceInput = {
  workspace_id: string;
  status?: OperatorWorkspaceStatus;
  session_refs?: readonly string[];
  state_snapshot_ref?: string;
  evidence_refs?: readonly string[];
  boundary_profile?: RuntimeBoundaryProfile;
  projection_envelope_ref?: string;
};

export type CreateOperatorSessionInput = {
  session_id: string;
  status?: OperatorSessionStatus;
  workspace_ref?: string;
  review_loop_ref?: string;
  evidence_refs?: readonly string[];
  boundary_profile?: RuntimeBoundaryProfile;
  projection_envelope_ref?: string;
};

export type CreateReviewLoopStateInput = {
  loop_state_id: string;
  status?: ReviewLoopStatus;
  workspace_ref?: string;
  session_ref?: string;
  reviewed_step_refs?: readonly string[];
  blocked_step_refs?: readonly string[];
  evidence_refs?: readonly string[];
  boundary_profile?: RuntimeBoundaryProfile;
  projection_envelope_ref?: string;
};

export type CreateOperatorEntrySurfaceInput = {
  entry_surface_id: string;
  status?: OperatorSessionStatus;
  workspace_ref?: string;
  session_ref?: string;
  allowed_manual_actions?: readonly string[];
  boundary_profile?: RuntimeBoundaryProfile;
  projection_envelope_ref?: string;
};

export type CreateReviewLoopRunnerInput = {
  runner_id: string;
  status?: ReviewLoopStatus;
  loop_state_ref?: string;
  step_refs?: readonly ReviewStepRef[];
  boundary_profile?: RuntimeBoundaryProfile;
  projection_envelope_ref?: string;
};

export type CreateOperatorReviewPacketInput = {
  packet_id: string;
  status?: OperatorSessionStatus;
  loop_state_ref?: string;
  reviewed_step_refs?: readonly string[];
  blocked_step_refs?: readonly string[];
  manual_decision_options?: readonly string[];
  evidence_refs?: readonly string[];
  boundary_profile?: RuntimeBoundaryProfile;
  projection_envelope_ref?: string;
};

export type CreateSessionEvidenceLedgerInput = {
  ledger_id: string;
  status?: OperatorWorkspaceStatus;
  session_ref?: string;
  entry_refs?: readonly string[];
  latest_packet_ref?: string;
  latest_bundle_ref?: string;
  boundary_profile?: RuntimeBoundaryProfile;
  projection_envelope_ref?: string;
};

export type CreateDeterministicEvidenceBundleInput = {
  bundle_id: string;
  bundle_kind?: EvidenceBundleKind;
  status?: OperatorSessionStatus;
  ledger_ref?: string;
  packet_ref?: string;
  evidence_refs?: readonly string[];
  summary?: string;
  boundary_profile?: RuntimeBoundaryProfile;
  projection_envelope_ref?: string;
};

export type CreateProjectionSafeOperatorReviewLoopHandoffInput = {
  projection_envelope_id: string;
  source_refs?: readonly string[];
  evidence_refs?: readonly string[];
  blocked?: boolean;
  created_at?: string;
};

export type CreateLocalReviewLoopResultInput = {
  result_id?: string;
  workspace_id?: string;
  session_id?: string;
  loop_state_id?: string;
  entry_surface_id?: string;
  runner_id?: string;
  packet_id?: string;
  ledger_id?: string;
  bundle_id?: string;
  projection_envelope_id?: string;
  state_snapshot_ref?: string;
  reviewed_step_refs?: readonly string[];
  blocked_step_refs?: readonly string[];
  step_refs?: readonly ReviewStepRef[];
  evidence_refs?: readonly string[];
  allowed_manual_actions?: readonly string[];
  manual_decision_options?: readonly string[];
  bundle_kind?: EvidenceBundleKind;
  bundle_summary?: string;
  created_at?: string;
};

function cloneSortedStrings(values: readonly string[] | undefined): string[] {
  return [...new Set(values ?? [])]
    .filter((value) => value.trim().length > 0)
    .sort();
}

function cloneSortedSteps(
  values: readonly ReviewStepRef[] | undefined
): ReviewStepRef[] {
  return [...(values ?? [])]
    .filter((step) => step.step_ref.trim().length > 0)
    .map((step) => ({ step_ref: step.step_ref, status: step.status }))
    .sort((a, b) => a.step_ref.localeCompare(b.step_ref));
}

function cloneBoundaryProfile(
  boundary_profile: RuntimeBoundaryProfile | undefined
): RuntimeBoundaryProfile {
  return { ...(boundary_profile ?? DEFAULT_BOUNDARY_PROFILE) };
}

function isMissingRef(value: string | undefined): boolean {
  return !value || value.trim().length === 0;
}

function isMissingList(values: readonly unknown[] | undefined): boolean {
  return !values || values.length === 0;
}

function refOrMissing(value: string | undefined, fallback: string): string {
  if (value === undefined || value.trim().length === 0) {
    return fallback;
  }

  return value;
}

function statusOrBlocked<T extends string>(
  blocked: boolean,
  requested: T | undefined,
  fallback: T
): T | "blocked" {
  return blocked ? "blocked" : requested ?? fallback;
}

function toSafeEvidenceRefs(
  evidence_refs: readonly string[] | undefined
): ProjectionSafeEvidenceRef[] {
  return cloneSortedStrings(evidence_refs).map((evidence_ref) => ({
    evidence_ref,
    evidence_kind: "safe_reference",
    summary: "Bounded evidence reference for local review loop posture.",
  }));
}

function uniqueOmissionMarkers(
  markers: readonly ProjectionSafeOmissionMarker[]
): ProjectionSafeOmissionMarker[] {
  const byMarker = new Map<string, ProjectionSafeOmissionMarker>();

  for (const marker of markers) {
    byMarker.set(marker.marker, marker);
  }

  return [...byMarker.values()].sort((a, b) =>
    a.marker.localeCompare(b.marker)
  );
}

function neutralizePostureText(value: string): string {
  return value
    .replace(/certifi[a-z]*/giu, "formal-assurance")
    .replace(/endorse[a-z]*/giu, "external-approval")
    .replace(/market[a-z]*/giu, "catalog")
    .replace(/provider/giu, "external-system")
    .replace(/channel/giu, "route")
    .replace(/dispatch/giu, "routing")
    .replace(/cloud/giu, "remote")
    .replace(/database/giu, "state-store");
}

function neutralizeModulePosture(
  posture: MplpModulePostureRecord
): MplpModulePostureRecord {
  return {
    ...posture,
    cognitive_os_responsibility: neutralizePostureText(
      posture.cognitive_os_responsibility
    ),
    projection_safe_exposure: neutralizePostureText(
      posture.projection_safe_exposure
    ),
    evidence_posture: neutralizePostureText(posture.evidence_posture),
    product_boundary_rule: neutralizePostureText(
      posture.product_boundary_rule
    ),
    notes: neutralizePostureText(posture.notes),
  };
}

function neutralizeDutyPosture(
  posture: KernelDutyRuntimePostureRecord
): KernelDutyRuntimePostureRecord {
  return {
    ...posture,
    cognitive_os_responsibility: neutralizePostureText(
      posture.cognitive_os_responsibility
    ),
    evidence_posture: neutralizePostureText(posture.evidence_posture),
    projection_safe_exposure: neutralizePostureText(
      posture.projection_safe_exposure
    ),
    product_boundary_rule: neutralizePostureText(
      posture.product_boundary_rule
    ),
    notes: neutralizePostureText(posture.notes),
  };
}

export function createRuntimeBoundaryProfile(
  _input?: CreateRuntimeBoundaryProfileInput
): RuntimeBoundaryProfile {
  return { ...DEFAULT_BOUNDARY_PROFILE };
}

export function createOperatorWorkspace(
  input: CreateOperatorWorkspaceInput
): OperatorWorkspace {
  const blocked =
    isMissingList(input.session_refs) ||
    isMissingRef(input.state_snapshot_ref) ||
    isMissingRef(input.projection_envelope_ref);

  return {
    workspace_id: refOrMissing(input.workspace_id, "missing_workspace_id"),
    status: statusOrBlocked(blocked, input.status, "active"),
    session_refs: cloneSortedStrings(input.session_refs),
    state_snapshot_ref: refOrMissing(
      input.state_snapshot_ref,
      "missing_state_snapshot_ref"
    ),
    evidence_refs: cloneSortedStrings(input.evidence_refs),
    boundary_profile: cloneBoundaryProfile(input.boundary_profile),
    projection_envelope_ref: refOrMissing(
      input.projection_envelope_ref,
      "missing_projection_envelope_ref"
    ),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}

export function createOperatorSession(
  input: CreateOperatorSessionInput
): OperatorSession {
  const blocked =
    isMissingRef(input.workspace_ref) ||
    isMissingRef(input.review_loop_ref) ||
    isMissingRef(input.projection_envelope_ref);

  return {
    session_id: refOrMissing(input.session_id, "missing_session_id"),
    status: statusOrBlocked(blocked, input.status, "review_ready"),
    workspace_ref: refOrMissing(input.workspace_ref, "missing_workspace_ref"),
    review_loop_ref: refOrMissing(
      input.review_loop_ref,
      "missing_review_loop_ref"
    ),
    evidence_refs: cloneSortedStrings(input.evidence_refs),
    boundary_profile: cloneBoundaryProfile(input.boundary_profile),
    projection_envelope_ref: refOrMissing(
      input.projection_envelope_ref,
      "missing_projection_envelope_ref"
    ),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}

export function createReviewLoopState(
  input: CreateReviewLoopStateInput
): ReviewLoopState {
  const blocked =
    isMissingRef(input.workspace_ref) ||
    isMissingRef(input.session_ref) ||
    isMissingRef(input.projection_envelope_ref);
  const blockedStepRefs = cloneSortedStrings(input.blocked_step_refs);
  const fallbackStatus: ReviewLoopStatus =
    blockedStepRefs.length > 0 ? "blocked" : "review_ready";

  return {
    loop_state_id: refOrMissing(
      input.loop_state_id,
      "missing_loop_state_id"
    ),
    status: statusOrBlocked(blocked, input.status, fallbackStatus),
    workspace_ref: refOrMissing(input.workspace_ref, "missing_workspace_ref"),
    session_ref: refOrMissing(input.session_ref, "missing_session_ref"),
    reviewed_step_refs: cloneSortedStrings(input.reviewed_step_refs),
    blocked_step_refs: blockedStepRefs,
    evidence_refs: cloneSortedStrings(input.evidence_refs),
    boundary_profile: cloneBoundaryProfile(input.boundary_profile),
    projection_envelope_ref: refOrMissing(
      input.projection_envelope_ref,
      "missing_projection_envelope_ref"
    ),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}

export function createOperatorEntrySurface(
  input: CreateOperatorEntrySurfaceInput
): OperatorEntrySurface {
  const blocked =
    isMissingRef(input.workspace_ref) ||
    isMissingRef(input.session_ref) ||
    isMissingList(input.allowed_manual_actions) ||
    isMissingRef(input.projection_envelope_ref);

  return {
    entry_surface_id: refOrMissing(
      input.entry_surface_id,
      "missing_entry_surface_id"
    ),
    status: statusOrBlocked(blocked, input.status, "review_ready"),
    workspace_ref: refOrMissing(input.workspace_ref, "missing_workspace_ref"),
    session_ref: refOrMissing(input.session_ref, "missing_session_ref"),
    allowed_manual_actions: cloneSortedStrings(input.allowed_manual_actions),
    boundary_profile: cloneBoundaryProfile(input.boundary_profile),
    projection_envelope_ref: refOrMissing(
      input.projection_envelope_ref,
      "missing_projection_envelope_ref"
    ),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}

export function createReviewLoopRunner(
  input: CreateReviewLoopRunnerInput
): ReviewLoopRunner {
  const stepRefs = cloneSortedSteps(input.step_refs);
  const hasBlockedStep = stepRefs.some((step) => step.status === "blocked");
  const blocked =
    hasBlockedStep ||
    isMissingRef(input.loop_state_ref) ||
    stepRefs.length === 0 ||
    isMissingRef(input.projection_envelope_ref);
  const fallbackStatus: ReviewLoopStatus = stepRefs.every(
    (step) => step.status === "reviewed"
  )
    ? "review_ready"
    : "review_running";

  return {
    runner_id: refOrMissing(input.runner_id, "missing_runner_id"),
    status: statusOrBlocked(blocked, input.status, fallbackStatus),
    loop_state_ref: refOrMissing(
      input.loop_state_ref,
      "missing_loop_state_ref"
    ),
    step_refs: stepRefs,
    boundary_profile: cloneBoundaryProfile(input.boundary_profile),
    projection_envelope_ref: refOrMissing(
      input.projection_envelope_ref,
      "missing_projection_envelope_ref"
    ),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}

export function createOperatorReviewPacket(
  input: CreateOperatorReviewPacketInput
): OperatorReviewPacket {
  const blocked =
    isMissingRef(input.loop_state_ref) ||
    isMissingList(input.manual_decision_options) ||
    isMissingRef(input.projection_envelope_ref);

  return {
    packet_id: refOrMissing(input.packet_id, "missing_packet_id"),
    status: statusOrBlocked(blocked, input.status, "review_ready"),
    loop_state_ref: refOrMissing(
      input.loop_state_ref,
      "missing_loop_state_ref"
    ),
    reviewed_step_refs: cloneSortedStrings(input.reviewed_step_refs),
    blocked_step_refs: cloneSortedStrings(input.blocked_step_refs),
    manual_decision_options: cloneSortedStrings(input.manual_decision_options),
    evidence_refs: cloneSortedStrings(input.evidence_refs),
    boundary_profile: cloneBoundaryProfile(input.boundary_profile),
    projection_envelope_ref: refOrMissing(
      input.projection_envelope_ref,
      "missing_projection_envelope_ref"
    ),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}

export function createSessionEvidenceLedger(
  input: CreateSessionEvidenceLedgerInput
): SessionEvidenceLedger {
  const blocked =
    isMissingRef(input.session_ref) ||
    isMissingList(input.entry_refs) ||
    isMissingRef(input.latest_packet_ref) ||
    isMissingRef(input.latest_bundle_ref) ||
    isMissingRef(input.projection_envelope_ref);

  return {
    ledger_id: refOrMissing(input.ledger_id, "missing_ledger_id"),
    status: statusOrBlocked(blocked, input.status, "active"),
    session_ref: refOrMissing(input.session_ref, "missing_session_ref"),
    entry_refs: cloneSortedStrings(input.entry_refs),
    latest_packet_ref: refOrMissing(
      input.latest_packet_ref,
      "missing_latest_packet_ref"
    ),
    latest_bundle_ref: refOrMissing(
      input.latest_bundle_ref,
      "missing_latest_bundle_ref"
    ),
    boundary_profile: cloneBoundaryProfile(input.boundary_profile),
    projection_envelope_ref: refOrMissing(
      input.projection_envelope_ref,
      "missing_projection_envelope_ref"
    ),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}

export function createDeterministicEvidenceBundle(
  input: CreateDeterministicEvidenceBundleInput
): DeterministicEvidenceBundle {
  const blocked =
    isMissingRef(input.ledger_ref) ||
    isMissingRef(input.packet_ref) ||
    isMissingList(input.evidence_refs) ||
    isMissingRef(input.summary) ||
    isMissingRef(input.projection_envelope_ref);

  return {
    bundle_id: refOrMissing(input.bundle_id, "missing_bundle_id"),
    bundle_kind: input.bundle_kind ?? "in_memory_evidence_bundle",
    status: statusOrBlocked(blocked, input.status, "review_ready"),
    ledger_ref: refOrMissing(input.ledger_ref, "missing_ledger_ref"),
    packet_ref: refOrMissing(input.packet_ref, "missing_packet_ref"),
    evidence_refs: cloneSortedStrings(input.evidence_refs),
    summary: refOrMissing(input.summary, "missing_summary"),
    boundary_profile: cloneBoundaryProfile(input.boundary_profile),
    projection_envelope_ref: refOrMissing(
      input.projection_envelope_ref,
      "missing_projection_envelope_ref"
    ),
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}

export function createProjectionSafeOperatorReviewLoopHandoff(
  input: CreateProjectionSafeOperatorReviewLoopHandoffInput
): ProjectionSafeHandoffEnvelope {
  const evidenceRefs = toSafeEvidenceRefs(input.evidence_refs);
  const sourceRefs = cloneSortedStrings(input.source_refs);
  const blocked = input.blocked ?? false;
  const stateSnapshotPosture = create_state_snapshot_posture({
    posture_id: `${input.projection_envelope_id}_state_snapshot_posture`,
    continuity_ref: "local_review_loop_continuity_ref",
    snapshot_ref: "local_review_loop_snapshot_ref",
    restore_posture: blocked ? "blocked" : "restorable",
    source_refs: sourceRefs,
    safe_evidence_refs: evidenceRefs,
    user_safe_summary:
      "State snapshot posture is represented with bounded references only.",
  });
  const transactionExportPosture = create_transaction_export_posture({
    posture_id: `${input.projection_envelope_id}_transaction_export_posture`,
    transaction_status: blocked ? "blocked" : "exported_snapshot",
    export_consistency_posture: blocked ? "blocked" : "consistent",
    deterministic_snapshot_boundary_summary:
      "Deterministic summary stays in memory and exposes references only.",
    safe_evidence_refs: evidenceRefs,
    user_safe_summary:
      "Export posture is an in-memory summary without storage side effects.",
  });
  const errorInsufficiencyPosture = create_error_insufficiency_posture({
    posture_id: `${input.projection_envelope_id}_error_insufficiency_posture`,
    status: blocked ? "blocked" : "recoverable",
    safe_evidence_refs: evidenceRefs,
    user_safe_summary: blocked
      ? "Required references are missing, so the posture is blocked."
      : "No blocking insufficiency is present for this local review loop.",
  });
  const postureRefs = [
    stateSnapshotPosture.posture_id,
    transactionExportPosture.posture_id,
    errorInsufficiencyPosture.posture_id,
  ];

  return build_projection_safe_runtime_envelope({
    projection_envelope_id: input.projection_envelope_id,
    source_runtime_object_refs:
      sourceRefs.length > 0
        ? cloneSortedStrings([...sourceRefs, ...postureRefs])
        : cloneSortedStrings(["local_review_loop_ref", ...postureRefs]),
    object_export_binding_posture_refs: [],
    module_postures: DEFAULT_MPLP_MODULE_POSTURES.map(neutralizeModulePosture),
    kernel_duty_postures: DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES.map(
      neutralizeDutyPosture
    ),
    safe_evidence_refs: evidenceRefs,
    omission_markers: uniqueOmissionMarkers([
      ...stateSnapshotPosture.omission_markers,
      ...transactionExportPosture.omission_markers,
      ...errorInsufficiencyPosture.omission_markers,
      {
        marker: "operator_review_loop_uses_safe_refs_only",
        reason:
          "Local review loop handoff exposes safe references and summaries only.",
      },
    ]),
    product_boundary_notices: [
      "Projection-safe handoff is a bounded local review loop summary only.",
    ],
    created_at: input.created_at ?? DEFAULT_CREATED_AT,
  });
}

export function createLocalReviewLoopResult(
  input: CreateLocalReviewLoopResultInput = {}
): LocalReviewLoopResult {
  const resultId = input.result_id ?? "local_review_loop_result_01";
  const workspaceId = input.workspace_id ?? "operator_workspace_01";
  const sessionId = input.session_id ?? "operator_session_01";
  const loopStateId = input.loop_state_id ?? "review_loop_state_01";
  const entrySurfaceId = input.entry_surface_id ?? "operator_entry_surface_01";
  const runnerId = input.runner_id ?? "review_loop_runner_01";
  const packetId = input.packet_id ?? "operator_review_packet_01";
  const ledgerId = input.ledger_id ?? "session_evidence_ledger_01";
  const bundleId = input.bundle_id ?? "deterministic_evidence_bundle_01";
  const projectionEnvelopeId =
    input.projection_envelope_id ?? "operator_review_loop_handoff_01";
  const boundaryProfile = createRuntimeBoundaryProfile();
  const evidenceRefs = cloneSortedStrings(
    input.evidence_refs ?? ["safe_evidence_ref_01"]
  );
  const reviewedStepRefs = cloneSortedStrings(
    input.reviewed_step_refs ?? ["review_step_01"]
  );
  const blockedStepRefs = cloneSortedStrings(input.blocked_step_refs);
  const stepRefs = cloneSortedSteps(
    input.step_refs ?? [{ step_ref: "review_step_01", status: "reviewed" }]
  );
  const allowedManualActions = cloneSortedStrings(
    input.allowed_manual_actions ?? [
      "continue_review",
      "mark_blocked",
      "request_more_context",
    ]
  );
  const manualDecisionOptions = cloneSortedStrings(
    input.manual_decision_options ?? [
      "continue_review",
      "mark_blocked",
      "request_more_context",
    ]
  );
  const projectionHandoff = createProjectionSafeOperatorReviewLoopHandoff({
    projection_envelope_id: projectionEnvelopeId,
    source_refs: [
      workspaceId,
      sessionId,
      loopStateId,
      entrySurfaceId,
      runnerId,
      packetId,
      ledgerId,
      bundleId,
    ],
    evidence_refs: evidenceRefs,
    blocked: blockedStepRefs.length > 0,
    created_at: input.created_at,
  });

  const workspace = createOperatorWorkspace({
    workspace_id: workspaceId,
    session_refs: [sessionId],
    state_snapshot_ref: input.state_snapshot_ref ?? "state_snapshot_ref_01",
    evidence_refs: evidenceRefs,
    boundary_profile: boundaryProfile,
    projection_envelope_ref: projectionEnvelopeId,
  });
  const session = createOperatorSession({
    session_id: sessionId,
    workspace_ref: workspaceId,
    review_loop_ref: loopStateId,
    evidence_refs: evidenceRefs,
    boundary_profile: boundaryProfile,
    projection_envelope_ref: projectionEnvelopeId,
  });
  const loopState = createReviewLoopState({
    loop_state_id: loopStateId,
    workspace_ref: workspaceId,
    session_ref: sessionId,
    reviewed_step_refs: reviewedStepRefs,
    blocked_step_refs: blockedStepRefs,
    evidence_refs: evidenceRefs,
    boundary_profile: boundaryProfile,
    projection_envelope_ref: projectionEnvelopeId,
  });
  const runner = createReviewLoopRunner({
    runner_id: runnerId,
    loop_state_ref: loopStateId,
    step_refs: stepRefs,
    boundary_profile: boundaryProfile,
    projection_envelope_ref: projectionEnvelopeId,
  });
  const reviewPacket = createOperatorReviewPacket({
    packet_id: packetId,
    loop_state_ref: loopStateId,
    reviewed_step_refs: reviewedStepRefs,
    blocked_step_refs: blockedStepRefs,
    manual_decision_options: manualDecisionOptions,
    evidence_refs: evidenceRefs,
    boundary_profile: boundaryProfile,
    projection_envelope_ref: projectionEnvelopeId,
  });
  const evidenceLedger = createSessionEvidenceLedger({
    ledger_id: ledgerId,
    session_ref: sessionId,
    entry_refs: [entrySurfaceId],
    latest_packet_ref: packetId,
    latest_bundle_ref: bundleId,
    boundary_profile: boundaryProfile,
    projection_envelope_ref: projectionEnvelopeId,
  });
  const evidenceBundle = createDeterministicEvidenceBundle({
    bundle_id: bundleId,
    bundle_kind: input.bundle_kind,
    ledger_ref: ledgerId,
    packet_ref: packetId,
    evidence_refs: evidenceRefs,
    summary:
      input.bundle_summary ??
      "Deterministic in-memory evidence bundle for local review loop posture.",
    boundary_profile: boundaryProfile,
    projection_envelope_ref: projectionEnvelopeId,
  });

  return {
    result_id: resultId,
    workspace,
    session,
    loop_state: loopState,
    runner,
    review_packet: reviewPacket,
    evidence_ledger: evidenceLedger,
    evidence_bundle: evidenceBundle,
    projection_handoff: projectionHandoff,
    boundary_profile: boundaryProfile,
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}
