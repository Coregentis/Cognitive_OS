import test from "node:test";
import assert from "node:assert/strict";

import { DeterministicProjectionService } from "../../runtime/core/projection-service.ts";
import {
  classify_runtime_action,
  MinimalPolicyService,
} from "../../runtime/core/policy-service.ts";
import { InMemoryProjectionStore } from "../../runtime/in-memory/projection-store.ts";

function createRuntimeRecord(overrides = {}) {
  return {
    schema_version: "0.1.0",
    authority_class: "coregentis_private_runtime",
    primary_layer: "organization_runtime_layer",
    project_id: "00000000-0000-4000-8000-910000000001",
    temporal: {
      cognition_time: "2026-04-26T00:00:00.000Z",
      event_time: "2026-04-26T00:00:00.000Z",
    },
    mutation: {
      mutation_class: "stateful_mutable",
      current_revision: 1,
    },
    lineage: {
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
    },
    governance: {
      governance_scope: "project",
      approval_state: "not_required",
    },
    ...overrides,
  };
}

function createOperationalUnitRecord(overrides = {}) {
  return createRuntimeRecord({
    object_id: "00000000-0000-4000-8000-910000000010",
    object_type: "cell-runtime-scope",
    status: "active",
    scope_name: "Operational Unit A",
    scope_summary: "Primary bounded operational unit.",
    scope_mode: "multi_scope_bounded",
    ...overrides,
  });
}

function createDirectiveRecord(overrides = {}) {
  return createRuntimeRecord({
    object_id: "00000000-0000-4000-8000-910000000011",
    object_type: "management-directive-record",
    status: "active",
    cell_runtime_scope_id: "00000000-0000-4000-8000-910000000010",
    management_record_kind: "directive",
    directive_summary: "Keep the next bounded update review-first.",
    directive_priority: "review_first",
    approval_posture: "operator_required",
    ...overrides,
  });
}

function createWorkItemRecord(overrides = {}) {
  return createRuntimeRecord({
    object_id: "00000000-0000-4000-8000-910000000012",
    object_type: "work-item",
    status: "active",
    objective_id: "00000000-0000-4000-8000-910000000110",
    work_summary: "Assemble one bounded runtime summary.",
    work_kind: "analysis",
    deliverable_refs: ["artifact-runtime-summary"],
    ...overrides,
  });
}

function createReviewRecord(overrides = {}) {
  return createRuntimeRecord({
    object_id: "00000000-0000-4000-8000-910000000013",
    object_type: "approval-request-record",
    status: "pending",
    cell_runtime_scope_id: "00000000-0000-4000-8000-910000000010",
    management_record_kind: "approval_request",
    request_kind: "approval",
    request_summary: "Review the bounded local update before use.",
    requested_decision: "review_only",
    urgency: "high",
    ...overrides,
  });
}

function createActionRecord(overrides = {}) {
  return createRuntimeRecord({
    object_id: "00000000-0000-4000-8000-910000000014",
    object_type: "action-unit",
    status: "pending",
    cell_runtime_scope_id: "00000000-0000-4000-8000-910000000010",
    action_kind: "local_file_update",
    action_summary: "Update one bounded local file candidate.",
    target_object_refs: ["00000000-0000-4000-8000-910000000012"],
    supporting_evidence_refs: ["evidence-action-01"],
    ...overrides,
  });
}

test("[runtime] runtime state projection summarizes multiple operational scopes deterministically", () => {
  const service = new DeterministicProjectionService();

  const scopeA = service.create_runtime_scope_summary_from_record(
    createOperationalUnitRecord()
  );
  const scopeB = service.create_runtime_scope_summary_from_record(
    createOperationalUnitRecord({
      object_id: "00000000-0000-4000-8000-910000000020",
      scope_name: "Operational Unit B",
      scope_summary: "Secondary bounded operational unit.",
    })
  );

  const learningCandidateA = service.create_scoped_learning_candidate({
    project_id: "00000000-0000-4000-8000-910000000001",
    learning_scope: {
      scope_id: scopeA.scope_id,
      scope_kind: scopeA.scope_kind,
    },
    application_scope: "scope_only",
    status: "accepted",
    candidate_kind: "reuse_pattern",
    candidate_summary: "Accepted bounded reuse pattern for the current scope.",
    evidence_refs: ["evidence-learning-01"],
    source_refs: ["source-learning-01"],
  });

  const learningSummaryA = service.create_runtime_learning_summary({
    project_id: "00000000-0000-4000-8000-910000000001",
    scope_id: scopeA.scope_id,
    scope_kind: scopeA.scope_kind,
    learning_candidates: [learningCandidateA],
  });

  const actionClassification = classify_runtime_action({
    updates_local_files: true,
    action_kind: "local_file_update",
    action_summary: "Update one bounded local file candidate.",
    evidence_refs: ["evidence-action-01"],
  });

  const actionSummaryA = service.create_runtime_action_summary_from_record(
    createActionRecord(),
    actionClassification
  );

  const unitA = service.create_operational_unit_runtime_projection({
    operational_unit_id: "operational-unit-a",
    project_id: "00000000-0000-4000-8000-910000000001",
    scope_summary: scopeA,
    priority_summaries: [
      service.create_runtime_priority_summary_from_record(createDirectiveRecord()),
    ],
    pending_review_summaries: [
      service.create_runtime_review_summary_from_record(createReviewRecord()),
    ],
    recent_artifact_summaries: [
      service.create_runtime_artifact_summary({
        artifact_id: "artifact-01",
        scope_id: scopeA.scope_id,
        artifact_kind: "analysis_note",
        title: "Bounded Runtime Summary",
        status: "current",
        artifact_class: "local_generated",
        source_refs: ["runtime-source-01"],
        evidence_refs: ["evidence-artifact-01"],
        created_at: "2026-04-26T00:00:00.000Z",
      }),
    ],
    task_summaries: [
      service.create_runtime_task_summary_from_record(createWorkItemRecord()),
    ],
    action_summaries: [actionSummaryA],
    learning_summaries: [learningSummaryA],
    drift_summaries: [
      service.create_runtime_drift_impact_summary({
        project_id: "00000000-0000-4000-8000-910000000001",
        scope_id: scopeA.scope_id,
        drift_kind: "intent_drift",
        impact_summary: "Bounded change affects one local artifact.",
        affected_artifact_refs: ["artifact-01"],
        evidence_refs: ["evidence-drift-01"],
      }),
    ],
    suggested_next_actions: [
      service.create_runtime_suggested_next_action({
        project_id: "00000000-0000-4000-8000-910000000001",
        scope_id: scopeA.scope_id,
        title: "Review bounded local file candidate",
        rationale: "Local file updates remain reviewable before use.",
        action_class: actionSummaryA.action_class,
        requires_confirmation: actionSummaryA.requires_confirmation,
        blocked: actionSummaryA.blocked,
        evidence_refs: actionSummaryA.evidence_refs,
        related_task_refs: actionSummaryA.related_task_refs,
        related_artifact_refs: actionSummaryA.related_artifact_refs,
      }),
    ],
  });

  const unitB = service.create_operational_unit_runtime_projection({
    operational_unit_id: "operational-unit-b",
    project_id: "00000000-0000-4000-8000-910000000001",
    scope_summary: scopeB,
  });

  const first = service.create_runtime_state_projection({
    project_id: "00000000-0000-4000-8000-910000000001",
    operational_unit_projections: [unitB, unitA],
    created_at: "2026-04-26T00:00:00.000Z",
  });
  const second = service.create_runtime_state_projection({
    project_id: "00000000-0000-4000-8000-910000000001",
    operational_unit_projections: [unitB, unitA],
    created_at: "2026-04-26T00:00:00.000Z",
  });

  assert.equal(first.operational_unit_projections.length, 2);
  assert.equal(first.operational_unit_projections[0]?.scope_summary.title, "Operational Unit A");
  assert.equal(first.operational_unit_projections[1]?.scope_summary.title, "Operational Unit B");
  assert.equal(first.operational_unit_projections[0]?.task_summaries.length, 1);
  assert.equal(first.operational_unit_projections[0]?.pending_review_summaries.length, 1);
  assert.equal(first.operational_unit_projections[0]?.recent_artifact_summaries.length, 1);
  assert.equal(first.operational_unit_projections[0]?.action_summaries.length, 1);
  assert.equal(first.operational_unit_projections[0]?.learning_summaries.length, 1);
  assert.equal(first.operational_unit_projections[0]?.drift_summaries.length, 1);
  assert.equal(first.operational_unit_projections[0]?.suggested_next_actions.length, 1);
  assert.deepEqual(first, second);

  const projectionStore = new InMemoryProjectionStore();
  projectionStore.put_runtime_state_projection(first.project_id, first);
  assert.deepEqual(
    projectionStore.get_runtime_state_projection(
      first.project_id,
      first.state_projection_id
    ),
    first
  );
});

test("[runtime] runtime state projection omits runtime-private fields", () => {
  const service = new DeterministicProjectionService();
  const projection = service.create_runtime_state_projection({
    project_id: "00000000-0000-4000-8000-910000000001",
    operational_unit_projections: [
      service.create_operational_unit_runtime_projection({
        project_id: "00000000-0000-4000-8000-910000000001",
        scope_summary: service.create_runtime_scope_summary({
          scope_id: "scope-01",
          scope_kind: "operational_unit",
          status: "active",
          title: "Operational Unit",
        }),
      }),
    ],
  });

  assert.equal(projection.runtime_private_fields_omitted, true);
  assert.equal(
    projection.operational_unit_projections[0]?.scope_summary.runtime_private_fields_omitted,
    true
  );
  assert.deepEqual(
    service.validate_runtime_state_projection({
      ...projection,
      raw_vsl: { forbidden: true },
    }),
    {
      valid: false,
      errors: ["forbidden raw key at projection.raw_vsl"],
    }
  );
});

test("[runtime] runtime action classifier covers all five classes", () => {
  assert.equal(
    classify_runtime_action({
      updates_local_state: true,
      action_kind: "memory_update",
    }).action_class,
    "auto_local"
  );
  assert.equal(
    classify_runtime_action({
      updates_local_files: true,
      action_kind: "local_file_update",
    }).action_class,
    "reviewable_local"
  );
  assert.equal(
    classify_runtime_action({
      prepares_external_draft: true,
      action_kind: "external_draft",
    }).action_class,
    "external_draft"
  );
  assert.equal(
    classify_runtime_action({
      requests_external_dispatch: true,
      action_kind: "dispatch_request",
    }).action_class,
    "limited_external_dispatch"
  );
  assert.equal(
    classify_runtime_action({
      irreversible_risk: true,
      action_summary: "payment approval for an irreversible purchase",
    }).action_class,
    "forbidden_irreversible"
  );
});

test("[runtime] forbidden irreversible actions are blocked", () => {
  const policyService = new MinimalPolicyService();
  const result = policyService.evaluate_policies({
    candidate_object: createActionRecord({
      action_kind: "payment_request",
      action_summary: "payment approval for an irreversible purchase",
    }),
    raw_input: {
      irreversible_risk: true,
    },
  });

  assert.equal(result.action_class, "forbidden_irreversible");
  assert.equal(result.allowed, false);
  assert.equal(result.blocked, true);
  assert.equal(result.suppressed, true);
  assert.match(result.reason, /always blocked/i);
});

test("[runtime] runtime artifact summary can be created without provider dispatch", () => {
  const service = new DeterministicProjectionService();
  const artifactSummary = service.create_runtime_artifact_summary({
    artifact_id: "artifact-01",
    scope_id: "scope-01",
    artifact_kind: "bounded_note",
    title: "Bounded Note",
    status: "draft",
    artifact_class: "external_draft",
    source_refs: ["source-ref-01"],
    evidence_refs: ["evidence-ref-01"],
    created_at: "2026-04-26T00:00:00.000Z",
    updated_at: "2026-04-26T00:05:00.000Z",
  });

  assert.equal(artifactSummary.artifact_class, "external_draft");
  assert.equal(artifactSummary.runtime_private_fields_omitted, true);
  assert.deepEqual(artifactSummary.source_refs, ["source-ref-01"]);
  assert.deepEqual(artifactSummary.evidence_refs, ["evidence-ref-01"]);
});

test("[runtime] scoped learning does not leak across scopes", () => {
  const service = new DeterministicProjectionService();
  const acceptedScopeOnly = service.create_scoped_learning_candidate({
    project_id: "project-01",
    learning_scope: {
      scope_id: "scope-a",
      scope_kind: "operational_unit",
    },
    application_scope: "scope_only",
    status: "accepted",
    candidate_kind: "reuse_pattern",
    candidate_summary: "Accepted learning for scope A only.",
    evidence_refs: ["evidence-a"],
    source_refs: ["source-a"],
  });
  const acceptedOtherScope = service.create_scoped_learning_candidate({
    project_id: "project-01",
    learning_scope: {
      scope_id: "scope-b",
      scope_kind: "operational_unit",
    },
    application_scope: "scope_only",
    status: "accepted",
    candidate_kind: "reuse_pattern",
    candidate_summary: "Accepted learning for scope B only.",
    evidence_refs: ["evidence-b"],
    source_refs: ["source-b"],
  });

  const learningSummary = service.create_runtime_learning_summary({
    project_id: "project-01",
    scope_id: "scope-a",
    scope_kind: "operational_unit",
    learning_candidates: [acceptedScopeOnly, acceptedOtherScope],
  });

  assert.deepEqual(
    learningSummary.active_candidates.map((candidate) => candidate.learning_candidate_id),
    [acceptedScopeOnly.learning_candidate_id]
  );
});

test("[runtime] global candidate learning remains visible but does not become active global truth automatically", () => {
  const service = new DeterministicProjectionService();
  const globalCandidate = service.create_scoped_learning_candidate({
    project_id: "project-01",
    learning_scope: {
      scope_id: "scope-a",
      scope_kind: "operational_unit",
    },
    application_scope: "global_candidate",
    status: "candidate",
    candidate_kind: "policy_suggestion",
    candidate_summary: "Candidate for later cross-scope promotion only.",
    evidence_refs: ["evidence-global"],
    source_refs: ["source-global"],
  });

  const learningSummary = service.create_runtime_learning_summary({
    project_id: "project-01",
    scope_id: "scope-a",
    scope_kind: "operational_unit",
    learning_candidates: [globalCandidate],
  });

  assert.equal(learningSummary.active_candidate_count, 0);
  assert.deepEqual(
    learningSummary.global_candidate_summaries.map(
      (candidate) => candidate.learning_candidate_id
    ),
    [globalCandidate.learning_candidate_id]
  );
});

test("[runtime] accepted same-scope learning is recalled and rejected learning is inactive", () => {
  const service = new DeterministicProjectionService();
  const acceptedCandidate = service.create_scoped_learning_candidate({
    project_id: "project-01",
    learning_scope: {
      scope_id: "scope-a",
      scope_kind: "operational_unit",
    },
    application_scope: "scope_only",
    status: "accepted",
    candidate_kind: "reuse_pattern",
    candidate_summary: "Accepted learning remains active for the same scope.",
    evidence_refs: ["evidence-accepted"],
    source_refs: ["source-accepted"],
  });
  const rejectedCandidate = service.create_scoped_learning_candidate({
    project_id: "project-01",
    learning_scope: {
      scope_id: "scope-a",
      scope_kind: "operational_unit",
    },
    application_scope: "scope_only",
    status: "rejected",
    candidate_kind: "failure_pattern",
    candidate_summary: "Rejected learning remains visible but inactive.",
    evidence_refs: ["evidence-rejected"],
    source_refs: ["source-rejected"],
  });

  const learningSummary = service.create_runtime_learning_summary({
    project_id: "project-01",
    scope_id: "scope-a",
    scope_kind: "operational_unit",
    learning_candidates: [acceptedCandidate, rejectedCandidate],
  });

  assert.equal(learningSummary.active_candidate_count, 1);
  assert.deepEqual(
    learningSummary.active_candidates.map((candidate) => candidate.learning_candidate_id),
    [acceptedCandidate.learning_candidate_id]
  );
  assert.deepEqual(
    learningSummary.inactive_candidates.map((candidate) => candidate.learning_candidate_id),
    [rejectedCandidate.learning_candidate_id]
  );
});

test("[runtime] drift impact summary produces clarify or block recommendation for contradiction and continue or revise for safe change", () => {
  const service = new DeterministicProjectionService();

  const clarifySummary = service.create_runtime_drift_impact_summary({
    project_id: "project-01",
    scope_id: "scope-a",
    drift_kind: "intent_drift",
    impact_summary: "Contradictory change request detected.",
    contradiction_detected: true,
    evidence_refs: ["evidence-clarify"],
  });
  const continueSummary = service.create_runtime_drift_impact_summary({
    project_id: "project-01",
    scope_id: "scope-a",
    drift_kind: "intent_drift",
    impact_summary: "Safe local change remains bounded.",
    evidence_refs: ["evidence-continue"],
  });
  const reviseSummary = service.create_runtime_drift_impact_summary({
    project_id: "project-01",
    scope_id: "scope-a",
    drift_kind: "intent_drift",
    impact_summary: "Change affects one artifact.",
    affected_artifact_refs: ["artifact-01"],
    evidence_refs: ["evidence-revise"],
  });
  const blockSummary = service.create_runtime_drift_impact_summary({
    project_id: "project-01",
    scope_id: "scope-a",
    drift_kind: "intent_drift",
    impact_summary: "Change remains blocked by bounded review.",
    blocked: true,
    evidence_refs: ["evidence-block"],
  });

  assert.equal(clarifySummary.recommendation, "clarify");
  assert.equal(continueSummary.recommendation, "continue");
  assert.equal(reviseSummary.recommendation, "revise");
  assert.equal(blockSummary.recommendation, "block");
});

test("[runtime] suggested next action summary respects action-class readiness", () => {
  const service = new DeterministicProjectionService();

  const readyAction = service.create_runtime_suggested_next_action({
    project_id: "project-01",
    scope_id: "scope-a",
    title: "Apply bounded memory update",
    rationale: "Auto-local updates can proceed inside bounded local scope.",
    action_class: "auto_local",
  });
  const reviewAction = service.create_runtime_suggested_next_action({
    project_id: "project-01",
    scope_id: "scope-a",
    title: "Review bounded local file change",
    rationale: "Local file changes remain reviewable.",
    action_class: "reviewable_local",
    requires_confirmation: true,
  });
  const deferredAction = service.create_runtime_suggested_next_action({
    project_id: "project-01",
    scope_id: "scope-a",
    title: "Hold limited external dispatch candidate",
    rationale: "Dispatch remains deferred until a separately authorized runtime surface exists.",
    action_class: "limited_external_dispatch",
  });
  const blockedAction = service.create_runtime_suggested_next_action({
    project_id: "project-01",
    scope_id: "scope-a",
    title: "Reject irreversible request",
    rationale: "Irreversible action remains forbidden.",
    action_class: "forbidden_irreversible",
    blocked: true,
  });

  assert.equal(readyAction.readiness_status, "ready");
  assert.equal(reviewAction.readiness_status, "needs_review");
  assert.equal(deferredAction.readiness_status, "deferred");
  assert.equal(blockedAction.readiness_status, "blocked");
});
