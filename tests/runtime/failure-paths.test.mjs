import test from "node:test";
import assert from "node:assert/strict";

import { MinimalLoopHarness } from "../../runtime/harness/minimal-loop-harness.ts";
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
import { InMemoryWorkingStore } from "../../runtime/in-memory/working-store.ts";
import { InMemoryEpisodicStore } from "../../runtime/in-memory/episodic-store.ts";
import { InMemorySemanticStore } from "../../runtime/in-memory/semantic-store.ts";
import { InMemoryEvidenceStore } from "../../runtime/in-memory/evidence-store.ts";

const repoRoot = process.cwd();

function createDefaultDependencies(
  scenarioId,
  overrides = {}
) {
  const registry_service =
    overrides.registry_service ?? FrozenRegistryService.from_repo_root(repoRoot);
  const binding_service =
    overrides.binding_service ?? FrozenBindingService.from_repo_root(repoRoot);
  const factory = overrides.factory ?? new DeterministicExecutionFactory(scenarioId);

  return {
    registry_service,
    binding_service,
    form_service:
      overrides.form_service ??
      new DeterministicFormService({
        registry_service,
        binding_service,
        factory,
        scenario_id: scenarioId,
      }),
    memory_service:
      overrides.memory_service ??
      new DeterministicMemoryService({
        registry_service,
        factory,
        scenario_id: scenarioId,
      }),
    activation_service:
      overrides.activation_service ??
      new DeterministicActivationService({
        registry_service,
        factory,
        scenario_id: scenarioId,
      }),
    policy_service: overrides.policy_service ?? new MinimalPolicyService(),
    confirm_service:
      overrides.confirm_service ??
      new DeterministicConfirmService({
        registry_service,
        binding_service,
        factory,
        scenario_id: scenarioId,
      }),
    trace_service:
      overrides.trace_service ??
      new DeterministicTraceService({
        registry_service,
        binding_service,
        factory,
        scenario_id: scenarioId,
      }),
    reconcile_service:
      overrides.reconcile_service ??
      new DeterministicReconcileService({
        registry_service,
        factory,
        scenario_id: scenarioId,
      }),
    consolidation_service:
      overrides.consolidation_service ??
      new DeterministicConsolidationService({
        registry_service,
        factory,
        scenario_id: scenarioId,
      }),
    working_store: overrides.working_store ?? new InMemoryWorkingStore(),
    episodic_store: overrides.episodic_store ?? new InMemoryEpisodicStore(),
    semantic_store: overrides.semantic_store ?? new InMemorySemanticStore(),
    evidence_store: overrides.evidence_store ?? new InMemoryEvidenceStore(),
  };
}

function createOrchestrator(scenarioId, overrides = {}) {
  return new MinimalRuntimeOrchestratorSkeleton(
    createDefaultDependencies(scenarioId, overrides)
  );
}

test("[failure] unsupported scenario input is rejected", () => {
  const harness = MinimalLoopHarness.create_default(repoRoot, "fresh-intent");

  assert.throws(() =>
    harness.execute_scenario({
      scenario_id: "unsupported-scenario",
      project_id: "00000000-0000-4000-8000-000000000001",
      raw_input: { input_kind: "text", summary: "unsupported" },
    })
  );
});

test("[failure] unknown object type is rejected", () => {
  const realFormService = new DeterministicFormService({
    registry_service: FrozenRegistryService.from_repo_root(repoRoot),
    binding_service: FrozenBindingService.from_repo_root(repoRoot),
    factory: new DeterministicExecutionFactory("fresh-intent"),
    scenario_id: "fresh-intent",
  });

  const orchestrator = createOrchestrator("fresh-intent", {
    form_service: {
      plan_form_step(input) {
        const formed = realFormService.plan_form_step(input);
        return [
          formed[0],
          {
            ...formed[1],
            object_type: "unknown-object-type",
          },
        ];
      },
    },
  });

  assert.throws(() =>
    orchestrator.execute_minimal_loop({
      scenario_id: "fresh-intent",
      project_id: "00000000-0000-4000-8000-000000000001",
      raw_input: { input_kind: "text", summary: "fresh" },
      prior_object_refs: [],
    })
  );
});

test("[failure] missing registry truth is rejected", () => {
  const realRegistry = FrozenRegistryService.from_repo_root(repoRoot);
  const missingIntentRegistry = {
    list_object_definitions() {
      return realRegistry.list_object_definitions();
    },
    get_object_definition(objectType) {
      if (objectType === "intent") {
        return undefined;
      }
      return realRegistry.get_object_definition(objectType);
    },
    assert_registered(objectType) {
      if (objectType === "intent") {
        throw new Error("Missing registry truth for intent");
      }
      return realRegistry.assert_registered(objectType);
    },
  };

  const orchestrator = createOrchestrator("fresh-intent", {
    registry_service: missingIntentRegistry,
  });

  assert.throws(() =>
    orchestrator.execute_minimal_loop({
      scenario_id: "fresh-intent",
      project_id: "00000000-0000-4000-8000-000000000001",
      raw_input: { input_kind: "text", summary: "fresh" },
      prior_object_refs: [],
    })
  );
});

test("[failure] missing binding truth where required is rejected", () => {
  const realBinding = FrozenBindingService.from_repo_root(repoRoot);
  const missingConfirmBinding = {
    get_export_rule(objectType) {
      return realBinding.get_export_rule(objectType);
    },
    plan_protocol_import(request) {
      return realBinding.plan_protocol_import(request);
    },
    plan_protocol_export(request) {
      return realBinding.plan_protocol_export(request);
    },
    get_binding(objectType) {
      if (objectType === "confirm-gate") {
        return undefined;
      }
      return realBinding.get_binding(objectType);
    },
  };

  const orchestrator = createOrchestrator("requirement-change-midflow", {
    binding_service: missingConfirmBinding,
  });

  assert.throws(() =>
    orchestrator.execute_minimal_loop({
      scenario_id: "requirement-change-midflow",
      project_id: "00000000-0000-4000-8000-000000000001",
      raw_input: { input_kind: "text", summary: "change" },
      prior_object_refs: [
        "00000000-0000-4000-8000-000000000101",
        "00000000-0000-4000-8000-000000000102",
      ],
    })
  );
});

test("[failure] missing export-rule truth where required is rejected", () => {
  const realBinding = FrozenBindingService.from_repo_root(repoRoot);
  const missingTraceExportRule = {
    get_binding(objectType) {
      return realBinding.get_binding(objectType);
    },
    plan_protocol_import(request) {
      return realBinding.plan_protocol_import(request);
    },
    plan_protocol_export(request) {
      return realBinding.plan_protocol_export(request);
    },
    get_export_rule(objectType) {
      if (objectType === "trace-evidence") {
        return undefined;
      }
      return realBinding.get_export_rule(objectType);
    },
  };

  const orchestrator = createOrchestrator("fresh-intent", {
    binding_service: missingTraceExportRule,
  });

  assert.throws(() =>
    orchestrator.execute_minimal_loop({
      scenario_id: "fresh-intent",
      project_id: "00000000-0000-4000-8000-000000000001",
      raw_input: { input_kind: "text", summary: "fresh" },
      prior_object_refs: [],
    })
  );
});

test("[failure] frozen-truth load failure is surfaced", () => {
  assert.throws(() => FrozenRegistryService.from_repo_root("/definitely/missing/repo/root"));
});
