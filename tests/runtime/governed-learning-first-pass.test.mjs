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

function collectKeys(value, target = new Set()) {
  if (!value || typeof value !== "object") {
    return target;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectKeys(item, target);
    }
    return target;
  }

  for (const [key, nested] of Object.entries(value)) {
    target.add(key);
    collectKeys(nested, target);
  }

  return target;
}

function seedFreshIntent(projectId) {
  const shared = {
    vsl_store: new InMemoryVslStore(),
    psg_store: new InMemoryPsgStore(),
  };
  const freshEnvironment = createEnvironment("fresh-intent", shared);
  const seededFreshResult = freshEnvironment.orchestrator.execute_minimal_loop({
    scenario_id: "fresh-intent",
    project_id: projectId,
    raw_input: {
      input_kind: "text",
      summary: "seed fresh intent before later learning checks",
    },
  });
  const seededIntent = getObject(seededFreshResult, "intent");
  const seededEpisode = getObject(seededFreshResult, "episode");

  return {
    shared,
    seededFreshResult,
    prior_object_refs: [seededIntent.object_id, seededEpisode.object_id],
  };
}

test("[runtime] Governed Learning first pass captures a bounded fresh-intent candidate with evidence refs", () => {
  const result = executeWithExport(createEnvironment("fresh-intent"), {
    scenario_id: "fresh-intent",
    project_id: "00000000-0000-4000-8000-770000000001",
    raw_input: {
      input_kind: "text",
      summary: "capture a bounded fresh-intent learning candidate",
    },
  });
  const learningCandidate = getObject(result, "learning-candidate");
  const traceEvidence = getObject(result, "trace-evidence");
  const decisionRecord = getObject(result, "decision-record");

  assert.equal(result.governed_learning_assessment?.candidate_kind, "reuse_pattern");
  assert.equal(
    result.governed_learning_assessment?.candidate_hint_type,
    "reuse_pattern_candidate"
  );
  assert.deepEqual(
    learningCandidate.source_evidence_refs,
    [decisionRecord.object_id, traceEvidence.object_id].sort()
  );
  assert.equal(learningCandidate.suggestion_only, true);
  assert.equal(learningCandidate.policy_mutation_applied, false);
  assert.equal(
    learningCandidate.future_protocol_export_eligibility,
    "derived_only_future_governance"
  );
  assert.equal(learningCandidate.future_protocol_sample_family, "intent_resolution");
  assert.equal(
    result.protocol_export?.export_summary.exported_artifact_counts_by_type.trace,
    1
  );
  assert.ok(
    !result.protocol_export?.export_summary.exported_runtime_object_ids.includes(
      learningCandidate.object_id
    )
  );
});

test("[runtime] Governed Learning first pass captures a delta-drift-aware policy suggestion candidate", () => {
  const projectId = "00000000-0000-4000-8000-770000000002";
  const { shared, prior_object_refs } = seedFreshIntent(projectId);
  const result = executeWithExport(
    createEnvironment("requirement-change-midflow", shared),
    {
      scenario_id: "requirement-change-midflow",
      project_id: projectId,
      raw_input: {
        input_kind: "text",
        summary: "capture bounded delta-drift learning candidate",
      },
      prior_object_refs,
    }
  );
  const learningCandidate = getObject(result, "learning-candidate");

  assert.equal(result.governed_learning_assessment?.candidate_kind, "policy_suggestion");
  assert.equal(
    result.governed_learning_assessment?.candidate_hint_type,
    "policy_suggestion_candidate"
  );
  assert.equal(learningCandidate.activation_outcome, "confirm_required");
  assert.equal(learningCandidate.future_protocol_sample_family, "delta_impact");
  assert.ok(learningCandidate.drift_record_refs.length > 0);
  assert.ok(learningCandidate.impacted_object_refs.length > 0);
  assert.ok(learningCandidate.source_relation_refs.length > 0);
  assert.equal(learningCandidate.policy_mutation_applied, false);
});

test("[runtime] Governed Learning first pass captures conflict/tension as a failure-pattern candidate", () => {
  const projectId = "00000000-0000-4000-8000-770000000003";
  const { shared, prior_object_refs } = seedFreshIntent(projectId);
  const result = executeWithExport(
    createEnvironment("requirement-change-midflow", shared),
    {
      scenario_id: "requirement-change-midflow",
      project_id: projectId,
      raw_input: {
        input_kind: "text",
        summary: "bounded conflict path for governed learning",
        change_conflict_signal: "conflict",
      },
      prior_object_refs,
    }
  );
  const learningCandidate = getObject(result, "learning-candidate");
  const serializedKeys = Array.from(
    collectKeys({
      candidate: learningCandidate,
      assessment: result.governed_learning_assessment,
    })
  );

  assert.equal(result.governed_learning_assessment?.candidate_kind, "failure_pattern");
  assert.equal(
    result.governed_learning_assessment?.candidate_hint_type,
    "failure_pattern_candidate"
  );
  assert.ok(learningCandidate.conflict_case_refs.length > 0);
  assert.equal(learningCandidate.semantic_promotion_applied, false);
  assert.equal(learningCandidate.policy_mutation_applied, false);
  assert.ok(
    !serializedKeys.some((key) =>
      /secretary|portfolio|founder|dto|projection/u.test(key)
    )
  );
});

test("[runtime] Governed Learning first pass can capture a continuity-aware reuse candidate", () => {
  const projectId = "00000000-0000-4000-8000-770000000004";
  const shared = {
    vsl_store: new InMemoryVslStore(),
    psg_store: new InMemoryPsgStore(),
  };
  const firstEnvironment = createEnvironment("fresh-intent", shared);
  const secondEnvironment = createEnvironment("fresh-intent", shared);
  const firstResult = firstEnvironment.orchestrator.execute_minimal_loop({
    scenario_id: "fresh-intent",
    project_id: projectId,
    raw_input: {
      input_kind: "text",
      summary: "seed continuity before second fresh-intent run",
    },
  });
  const secondResult = executeWithExport(secondEnvironment, {
    scenario_id: "fresh-intent",
    project_id: projectId,
    raw_input: {
      input_kind: "text",
      summary: "second fresh-intent run should observe prior continuity",
    },
  });
  const learningCandidate = getObject(secondResult, "learning-candidate");

  assert.ok(firstResult.continuity_state);
  assert.equal(
    secondResult.governed_learning_assessment?.candidate_hint_type,
    "continuity_pattern_candidate"
  );
  assert.equal(
    learningCandidate.continuity_anchor_ref,
    firstResult.continuity_state?.continuation_anchor.anchor_object_id
  );
  assert.equal(learningCandidate.candidate_kind, "reuse_pattern");
});
