import test from "node:test";
import assert from "node:assert/strict";

import { MinimalRuntimeOrchestratorSkeleton } from "../../runtime/core/runtime-orchestrator.ts";
import { FrozenRegistryService } from "../../runtime/core/registry-service.ts";
import { FrozenBindingService } from "../../runtime/core/binding-service.ts";
import { DeterministicFormService } from "../../runtime/core/form-service.ts";
import { DeterministicMemoryService } from "../../runtime/core/memory-service.ts";
import { DeterministicActivationService } from "../../runtime/core/activation-service.ts";
import { MinimalPolicyService } from "../../runtime/core/policy-service.ts";
import { DeterministicConfirmService } from "../../runtime/core/confirm-service.ts";
import { DeterministicTraceService } from "../../runtime/core/trace-service.ts";
import { DeterministicReconcileService } from "../../runtime/core/reconcile-service.ts";
import { DeterministicConsolidationService } from "../../runtime/core/consolidation-service.ts";
import { DeterministicExecutionFactory } from "../../runtime/core/execution-support.ts";
import { DeterministicVslService } from "../../runtime/core/vsl-service.ts";
import { DeterministicPsgService } from "../../runtime/core/psg-service.ts";
import { InMemoryWorkingStore } from "../../runtime/in-memory/working-store.ts";
import { InMemoryEpisodicStore } from "../../runtime/in-memory/episodic-store.ts";
import { InMemorySemanticStore } from "../../runtime/in-memory/semantic-store.ts";
import { InMemoryEvidenceStore } from "../../runtime/in-memory/evidence-store.ts";
import { InMemoryVslStore } from "../../runtime/in-memory/vsl-store.ts";
import { InMemoryPsgStore } from "../../runtime/in-memory/psg-store.ts";
import { FrozenProtocolExportService } from "../../runtime/export/protocol-export.ts";

const repoRoot = process.cwd();

function createEnvironment(scenarioId, shared = {}) {
  const registry_service = FrozenRegistryService.from_repo_root(repoRoot);
  const binding_service = FrozenBindingService.from_repo_root(repoRoot);
  const factory = new DeterministicExecutionFactory(scenarioId);
  const vsl_store = shared.vsl_store ?? new InMemoryVslStore();
  const psg_store = shared.psg_store ?? new InMemoryPsgStore();
  const orchestrator = new MinimalRuntimeOrchestratorSkeleton({
    registry_service,
    binding_service,
    form_service: new DeterministicFormService({
      registry_service,
      binding_service,
      factory,
      scenario_id: scenarioId,
    }),
    memory_service: new DeterministicMemoryService({
      registry_service,
      factory,
      scenario_id: scenarioId,
    }),
    activation_service: new DeterministicActivationService({
      registry_service,
      factory,
      scenario_id: scenarioId,
    }),
    policy_service: new MinimalPolicyService(),
    confirm_service: new DeterministicConfirmService({
      registry_service,
      binding_service,
      factory,
      scenario_id: scenarioId,
    }),
    trace_service: new DeterministicTraceService({
      registry_service,
      binding_service,
      factory,
      scenario_id: scenarioId,
    }),
    reconcile_service: new DeterministicReconcileService({
      registry_service,
      factory,
      scenario_id: scenarioId,
    }),
    consolidation_service: new DeterministicConsolidationService({
      registry_service,
      factory,
      scenario_id: scenarioId,
    }),
    working_store: new InMemoryWorkingStore(),
    episodic_store: new InMemoryEpisodicStore(),
    semantic_store: new InMemorySemanticStore(),
    evidence_store: new InMemoryEvidenceStore(),
    vsl_service: new DeterministicVslService({
      vsl_store,
    }),
    psg_service: new DeterministicPsgService({
      registry_service,
      psg_store,
    }),
  });
  const protocol_export_service = FrozenProtocolExportService.from_repo_root(
    repoRoot,
    binding_service
  );

  return {
    orchestrator,
    protocol_export_service,
    shared: {
      vsl_store,
      psg_store,
    },
  };
}

function executeWithExport(environment, input) {
  const runResult = environment.orchestrator.execute_minimal_loop(input);

  return {
    ...runResult,
    protocol_export: environment.protocol_export_service.export_run({
      project_id: input.project_id,
      run_result: runResult,
    }),
  };
}

function getObject(result, objectType) {
  const record = result.created_objects.find(
    (candidate) => candidate.object_type === objectType
  );

  assert.ok(record, `missing runtime object ${objectType}`);
  return record;
}

function buildSeededRequirementChangeEnvironment(projectId) {
  const shared = {
    vsl_store: new InMemoryVslStore(),
    psg_store: new InMemoryPsgStore(),
  };
  const freshEnvironment = createEnvironment("fresh-intent", shared);
  const changeEnvironment = createEnvironment("requirement-change-midflow", shared);
  const freshResult = freshEnvironment.orchestrator.execute_minimal_loop({
    scenario_id: "fresh-intent",
    project_id: projectId,
    raw_input: {
      input_kind: "text",
      summary: "seed fresh intent before requirement change",
    },
  });
  const seededIntent = getObject(freshResult, "intent");
  const seededEpisode = getObject(freshResult, "episode");

  return {
    changeEnvironment,
    freshResult,
    prior_object_refs: [seededIntent.object_id, seededEpisode.object_id],
  };
}

test("[runtime] Delta Drift & Impact first pass uses VSL anchor and PSG neighbors in requirement-change path", () => {
  const projectId = "00000000-0000-4000-8000-550000000001";
  const {
    changeEnvironment,
    freshResult,
    prior_object_refs,
  } = buildSeededRequirementChangeEnvironment(projectId);
  const result = executeWithExport(changeEnvironment, {
    scenario_id: "requirement-change-midflow",
    project_id: projectId,
    raw_input: {
      input_kind: "text",
      summary: "apply a bounded requirement change against the seeded intent",
    },
    prior_object_refs,
  });
  const driftRecord = getObject(result, "drift-record");
  const currentTraceEvidence = getObject(result, "trace-evidence");
  const currentDecisionRecord = getObject(result, "decision-record");

  assert.ok(freshResult.continuity_state);
  assert.ok(freshResult.graph_state);
  assert.equal(
    result.reconciliation?.continuation_anchor_ref,
    freshResult.continuity_state.continuation_anchor.anchor_object_id
  );
  assert.equal(
    driftRecord.continuation_anchor_ref,
    freshResult.continuity_state.continuation_anchor.anchor_object_id
  );
  assert.deepEqual(driftRecord.baseline_object_refs, prior_object_refs);
  assert.ok(Array.isArray(driftRecord.affected_object_refs));
  assert.ok(driftRecord.affected_object_refs.length > 0);
  assert.deepEqual(
    driftRecord.affected_object_refs,
    result.reconciliation?.affected_object_refs
  );
  assert.match(
    driftRecord.impact_summary,
    /Continuation anchor .* was available\./
  );
  assert.ok(
    driftRecord.supporting_evidence_refs.includes(currentTraceEvidence.object_id)
  );
  assert.ok(
    driftRecord.supporting_evidence_refs.includes(currentDecisionRecord.object_id)
  );
  assert.equal(result.reconciliation?.conflict_case_ids, undefined);
  assert.equal(result.reconciliation?.outcome, "can_continue_with_change");
  assert.ok(result.protocol_export);
  assert.equal(
    result.protocol_export.export_summary.exported_artifact_counts_by_type.confirm,
    1
  );
  assert.equal(
    result.protocol_export.export_summary.exported_artifact_counts_by_type.trace,
    1
  );
  assert.ok(
    !result.export_preparation?.protocol_relevant_object_ids.includes(
      driftRecord.object_id
    )
  );
});

test("[runtime] Delta Drift & Impact first pass creates conflict only for explicit tension and preserves project isolation", () => {
  const alphaProjectId = "00000000-0000-4000-8000-550000000002";
  const betaProjectId = "00000000-0000-4000-8000-550000000003";
  const {
    changeEnvironment,
    freshResult,
    prior_object_refs,
  } = buildSeededRequirementChangeEnvironment(alphaProjectId);
  const conflictResult = changeEnvironment.orchestrator.execute_minimal_loop({
    scenario_id: "requirement-change-midflow",
    project_id: alphaProjectId,
    raw_input: {
      input_kind: "text",
      summary: "apply a conflicting requirement change",
      change_conflict_signal: "conflict",
    },
    prior_object_refs,
  });
  const betaResult = changeEnvironment.orchestrator.execute_minimal_loop({
    scenario_id: "requirement-change-midflow",
    project_id: betaProjectId,
    raw_input: {
      input_kind: "text",
      summary: "beta project change without seeded continuity",
    },
    prior_object_refs,
  });
  const alphaConflictCase = getObject(conflictResult, "conflict-case");
  const alphaDriftRecord = getObject(conflictResult, "drift-record");
  const seededAnchorRef =
    freshResult.continuity_state?.continuation_anchor.anchor_object_id;

  assert.ok(conflictResult.reconciliation?.conflict_case_ids?.length);
  assert.ok(alphaConflictCase.object_refs.includes(alphaDriftRecord.object_id));
  assert.ok(
    alphaConflictCase.object_refs.some((objectId) =>
      alphaDriftRecord.affected_object_refs.includes(objectId)
    )
  );
  assert.equal(betaResult.reconciliation?.continuation_anchor_ref, undefined);
  assert.deepEqual(betaResult.reconciliation?.affected_object_refs, []);
  assert.notEqual(
    betaResult.reconciliation?.continuation_anchor_ref,
    seededAnchorRef
  );
  assert.equal(betaResult.reconciliation?.conflict_case_ids, undefined);
});

test("[runtime] Delta Drift & Impact first pass remains deterministic for the same seeded project state", () => {
  const firstProjectId = "00000000-0000-4000-8000-550000000004";
  const secondProjectId = "00000000-0000-4000-8000-550000000005";
  const firstSeeded = buildSeededRequirementChangeEnvironment(firstProjectId);
  const secondSeeded = buildSeededRequirementChangeEnvironment(secondProjectId);
  const firstResult = firstSeeded.changeEnvironment.orchestrator.execute_minimal_loop({
    scenario_id: "requirement-change-midflow",
    project_id: firstProjectId,
    raw_input: {
      input_kind: "text",
      summary: "deterministic delta drift check",
    },
    prior_object_refs: firstSeeded.prior_object_refs,
  });
  const secondResult = secondSeeded.changeEnvironment.orchestrator.execute_minimal_loop({
    scenario_id: "requirement-change-midflow",
    project_id: secondProjectId,
    raw_input: {
      input_kind: "text",
      summary: "deterministic delta drift check",
    },
    prior_object_refs: secondSeeded.prior_object_refs,
  });
  const firstDrift = getObject(firstResult, "drift-record");
  const secondDrift = getObject(secondResult, "drift-record");

  assert.deepEqual(firstDrift.baseline_object_refs, secondDrift.baseline_object_refs);
  assert.deepEqual(firstDrift.affected_object_refs, secondDrift.affected_object_refs);
  assert.equal(firstDrift.impact_summary, secondDrift.impact_summary);
  assert.deepEqual(
    [...firstDrift.supporting_evidence_refs].sort(),
    [...secondDrift.supporting_evidence_refs].sort()
  );
  assert.equal(
    firstResult.reconciliation?.impact_summary,
    secondResult.reconciliation?.impact_summary
  );
  assert.deepEqual(
    firstResult.reconciliation?.affected_object_refs,
    secondResult.reconciliation?.affected_object_refs
  );
});
