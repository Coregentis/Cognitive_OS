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

function createEnvironment(scenarioId) {
  const registry_service = FrozenRegistryService.from_repo_root(repoRoot);
  const binding_service = FrozenBindingService.from_repo_root(repoRoot);
  const factory = new DeterministicExecutionFactory(scenarioId);
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
      vsl_store: new InMemoryVslStore(),
    }),
    psg_service: new DeterministicPsgService({
      registry_service,
      psg_store: new InMemoryPsgStore(),
    }),
  });
  const protocol_export_service = FrozenProtocolExportService.from_repo_root(
    repoRoot,
    binding_service
  );

  return {
    orchestrator,
    protocol_export_service,
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

test("[runtime] AEL first pass marks the fresh-intent path as activate", () => {
  const result = executeWithExport(createEnvironment("fresh-intent"), {
    scenario_id: "fresh-intent",
    project_id: "00000000-0000-4000-8000-660000000001",
    raw_input: {
      input_kind: "text",
      summary: "execute a bounded fresh intent path",
    },
  });
  const activationSignal = getObject(result, "activation-signal");
  const actionUnit = getObject(result, "action-unit");

  assert.equal(result.ael_assessment?.outcome, "activate");
  assert.equal(result.ael_assessment?.gating_basis, "policy_allow");
  assert.equal(result.ael_assessment?.confirm_gate_id, undefined);
  assert.deepEqual(
    result.ael_assessment?.evidence_refs,
    [
      getObject(result, "decision-record").object_id,
      getObject(result, "trace-evidence").object_id,
    ].sort()
  );
  assert.equal(result.ael_assessment?.export_class, "runtime_private_non_exportable");
  assert.equal(activationSignal.status, "completed");
  assert.equal(actionUnit.status, "completed");
  assert.equal(actionUnit.governance.approval_state, "not_required");
  assert.ok(actionUnit.governance.notes.includes("AEL first-pass outcome=activate"));
  assert.ok(
    !result.export_preparation?.protocol_relevant_object_ids.includes(
      actionUnit.object_id
    )
  );
});

test("[runtime] AEL first pass links confirm-required requirement-change paths to confirm gates", () => {
  const result = executeWithExport(
    createEnvironment("requirement-change-midflow"),
    {
      scenario_id: "requirement-change-midflow",
      project_id: "00000000-0000-4000-8000-660000000002",
      raw_input: {
        input_kind: "text",
        summary: "apply a bounded requirement change",
      },
      prior_object_refs: [
        "00000000-0000-4000-8000-660000000010",
      ],
    }
  );
  const confirmGate = getObject(result, "confirm-gate");
  const actionUnit = getObject(result, "action-unit");

  assert.equal(result.ael_assessment?.outcome, "confirm_required");
  assert.equal(result.ael_assessment?.gating_basis, "confirm_gate");
  assert.equal(result.ael_assessment?.confirm_gate_id, confirmGate.object_id);
  assert.equal(result.confirm_summary?.confirm_gate_id, confirmGate.object_id);
  assert.equal(actionUnit.status, "completed");
  assert.deepEqual(actionUnit.governance.confirm_refs, [confirmGate.object_id]);
  assert.equal(result.protocol_export?.export_summary.exported_artifact_counts_by_type.confirm, 1);
  assert.ok(
    !result.protocol_export?.export_summary.exported_runtime_object_ids.includes(
      actionUnit.object_id
    )
  );
});

test("[runtime] AEL first pass represents suppression without widening protocol export", () => {
  const result = executeWithExport(createEnvironment("fresh-intent"), {
    scenario_id: "fresh-intent",
    project_id: "00000000-0000-4000-8000-660000000003",
    raw_input: {
      input_kind: "text",
      summary: "stay bounded under suppression",
      suppression_signal: "suppress",
    },
  });
  const activationSignal = getObject(result, "activation-signal");
  const actionUnit = getObject(result, "action-unit");
  const decisionRecord = getObject(result, "decision-record");

  assert.equal(result.ael_assessment?.outcome, "suppressed");
  assert.equal(result.ael_assessment?.gating_basis, "policy_suppression");
  assert.match(
    String(result.ael_assessment?.suppression_reason),
    /suppressed the action/i
  );
  assert.equal(activationSignal.status, "suppressed");
  assert.equal(actionUnit.status, "cancelled");
  assert.equal(actionUnit.governance.approval_state, "rejected");
  assert.equal(decisionRecord.decision_type, "suppression");
  assert.equal(decisionRecord.outcome, "suppressed");
  assert.equal(result.confirm_summary?.confirm_gate_id, undefined);
  assert.equal(result.protocol_export?.export_summary.exported_artifact_counts_by_type.confirm, 0);
  assert.equal(result.protocol_export?.export_summary.exported_artifact_counts_by_type.trace, 1);
});

test("[runtime] AEL first pass escalates explicit tension while keeping AEL runtime-private", () => {
  const result = executeWithExport(
    createEnvironment("requirement-change-midflow"),
    {
      scenario_id: "requirement-change-midflow",
      project_id: "00000000-0000-4000-8000-660000000004",
      raw_input: {
        input_kind: "text",
        summary: "require escalation because conflict is explicit",
        change_conflict_signal: "conflict",
      },
      prior_object_refs: [
        "00000000-0000-4000-8000-660000000020",
      ],
    }
  );
  const activationSignal = getObject(result, "activation-signal");
  const actionUnit = getObject(result, "action-unit");
  const decisionRecord = getObject(result, "decision-record");
  const serializedKeys = Array.from(collectKeys(result.ael_assessment));

  assert.equal(result.ael_assessment?.outcome, "escalate");
  assert.equal(result.ael_assessment?.gating_basis, "reconcile_tension");
  assert.ok(result.ael_assessment?.confirm_gate_id);
  assert.match(
    String(result.ael_assessment?.escalation_reason),
    /requires escalation/i
  );
  assert.equal(activationSignal.status, "failed");
  assert.equal(actionUnit.status, "cancelled");
  assert.equal(actionUnit.governance.approval_state, "escalated");
  assert.equal(decisionRecord.decision_type, "conflict_resolution");
  assert.equal(decisionRecord.outcome, "branched");
  assert.ok(result.reconciliation?.conflict_case_ids?.length);
  assert.equal(result.protocol_export?.export_summary.exported_artifact_counts_by_type.confirm, 1);
  assert.equal(result.protocol_export?.export_summary.exported_artifact_counts_by_type.trace, 1);
  assert.ok(
    !serializedKeys.some((key) =>
      /secretary|portfolio|founder|dto|projection/u.test(key)
    )
  );
});
