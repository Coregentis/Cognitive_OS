import test from "node:test";
import assert from "node:assert/strict";

import {
  execute_scenario_file,
  MinimalLoopHarness,
} from "../../runtime/harness/minimal-loop-harness.ts";
import { MinimalRuntimeOrchestratorSkeleton } from "../../runtime/core/runtime-orchestrator.ts";
import { FrozenRegistryService } from "../../runtime/core/registry-service.ts";
import { FrozenBindingService } from "../../runtime/core/binding-service.ts";
import { load_import_lock_document } from "../../runtime/core/frozen-truth-loader.ts";
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
import { resolve_locked_protocol_schema_paths } from "../../runtime/export/export-support.ts";
import { FrozenProtocolExportService } from "../../runtime/export/protocol-export.ts";

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

function createProtocolExportService(binding_service, schema_paths) {
  return new FrozenProtocolExportService({
    binding_service,
    import_lock: load_import_lock_document(repoRoot),
    schema_paths:
      schema_paths ?? resolve_locked_protocol_schema_paths(repoRoot),
  });
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

test("[failure] export surfaces missing export-rule truth for trace as a bounded error", async () => {
  const runResult = await execute_scenario_file(
    repoRoot,
    "./tests/fixtures/min-loop/fresh-intent/scenario.json"
  );
  const realBinding = FrozenBindingService.from_repo_root(repoRoot);
  const missingTraceExportRule = {
    get_binding(objectType) {
      return realBinding.get_binding(objectType);
    },
    get_export_rule(objectType) {
      if (objectType === "trace-evidence") {
        return undefined;
      }
      return realBinding.get_export_rule(objectType);
    },
    plan_protocol_import(request) {
      return realBinding.plan_protocol_import(request);
    },
    plan_protocol_export(request) {
      return realBinding.plan_protocol_export(request);
    },
  };
  const exportService = createProtocolExportService(missingTraceExportRule);

  const bundle = exportService.export_run({
    project_id: "00000000-0000-4000-8000-000000000001",
    run_result: runResult,
  });

  assert.equal(bundle.export_manifest.bundle_status, "complete_with_errors");
  assert.equal(bundle.export_summary.exported_artifact_counts_by_type.trace, 0);
  assert.equal(bundle.export_validation_summary.validated_artifact_count, 0);
  assert.equal(
    bundle.omitted_artifacts_by_type.trace[0]?.omission_code,
    "frozen_truth_blocks_export"
  );
  assert.deepEqual(
    bundle.omitted_artifacts_by_type.trace[0]?.reason_codes,
    ["missing_export_rule_truth"]
  );
  assert.ok(
    bundle.export_errors.some(
      (error) =>
        error.artifact_type === "trace" &&
        error.error_code === "missing_required_export_rule_truth"
    )
  );
  assert.deepEqual(
    bundle.export_validation_summary.family_disposition_by_type.trace
      .blocked_by_export_truth_source_object_ids,
    ["00000000-0000-4000-8000-000000000007"]
  );
  assert.ok(
    bundle.export_manifest.export_error_codes.includes(
      "missing_required_export_rule_truth"
    )
  );
});

test("[failure] export surfaces missing binding truth for confirm as a bounded error", async () => {
  const runResult = await execute_scenario_file(
    repoRoot,
    "./tests/fixtures/min-loop/requirement-change-midflow/scenario.json"
  );
  const realBinding = FrozenBindingService.from_repo_root(repoRoot);
  const missingConfirmBinding = {
    get_binding(objectType) {
      if (objectType === "confirm-gate") {
        return undefined;
      }
      return realBinding.get_binding(objectType);
    },
    get_export_rule(objectType) {
      return realBinding.get_export_rule(objectType);
    },
    plan_protocol_import(request) {
      return realBinding.plan_protocol_import(request);
    },
    plan_protocol_export(request) {
      return realBinding.plan_protocol_export(request);
    },
  };
  const exportService = createProtocolExportService(missingConfirmBinding);

  const bundle = exportService.export_run({
    project_id: "00000000-0000-4000-8000-000000000001",
    run_result: runResult,
  });

  assert.equal(bundle.export_manifest.bundle_status, "complete_with_errors");
  assert.equal(bundle.export_summary.exported_artifact_counts_by_type.confirm, 0);
  assert.equal(bundle.export_summary.exported_artifact_counts_by_type.trace, 1);
  assert.equal(
    bundle.omitted_artifacts_by_type.confirm[0]?.omission_code,
    "frozen_truth_blocks_export"
  );
  assert.deepEqual(
    bundle.omitted_artifacts_by_type.confirm[0]?.reason_codes,
    ["missing_binding_truth"]
  );
  assert.ok(
    bundle.export_errors.some(
      (error) =>
        error.artifact_type === "confirm" &&
        error.error_code === "missing_required_binding_truth"
    )
  );
  assert.deepEqual(
    bundle.export_validation_summary.family_disposition_by_type.confirm
      .blocked_by_export_truth_source_object_ids,
    ["00000000-0000-4000-8000-000000000008"]
  );
  assert.ok(
    bundle.export_manifest.export_error_codes.includes(
      "missing_required_binding_truth"
    )
  );
});

test("[failure] export surfaces validation failure as a bounded error", async () => {
  const runResult = await execute_scenario_file(
    repoRoot,
    "./tests/fixtures/min-loop/requirement-change-midflow/scenario.json"
  );
  const realBinding = FrozenBindingService.from_repo_root(repoRoot);
  const schema_paths = resolve_locked_protocol_schema_paths(repoRoot);
  const exportService = createProtocolExportService(realBinding, {
    ...schema_paths,
    confirm: schema_paths.trace,
  });

  const bundle = exportService.export_run({
    project_id: "00000000-0000-4000-8000-000000000001",
    run_result: runResult,
  });

  assert.equal(bundle.export_manifest.bundle_status, "complete_with_errors");
  assert.equal(bundle.export_validation_summary.invalid_artifact_count, 1);
  assert.equal(bundle.export_validation_summary.valid_artifact_count, 1);
  assert.equal(bundle.exported_artifacts_by_type.confirm.length, 0);
  assert.equal(bundle.exported_artifacts_by_type.trace.length, 1);
  assert.equal(
    bundle.omitted_artifacts_by_type.confirm[0]?.omission_code,
    "validation_failed"
  );
  assert.deepEqual(
    bundle.omitted_artifacts_by_type.confirm[0]?.reason_codes,
    ["schema_validation_failed"]
  );
  assert.ok(
    bundle.export_errors.some(
      (error) =>
        error.artifact_type === "confirm" &&
        error.error_code === "artifact_validation_failed"
    )
  );
  assert.deepEqual(
    bundle.export_validation_summary.family_disposition_by_type.confirm
      .invalid_source_object_ids,
    ["00000000-0000-4000-8000-000000000008"]
  );
  assert.ok(
    bundle.export_manifest.export_error_codes.includes(
      "artifact_validation_failed"
    )
  );
});
