import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  MinimalRuntimeOrchestratorSkeleton,
  type RuntimeOrchestrator,
} from "../core/runtime-orchestrator.ts";
import type {
  MinimalLoopInput,
  MinimalLoopPlan,
  MinimalLoopRunResult,
  RuntimeContinuationAnchor,
  RuntimeVslContinuityState,
} from "../core/runtime-types";
import { FrozenRegistryService } from "../core/registry-service.ts";
import { FrozenBindingService } from "../core/binding-service.ts";
import { DeterministicFormService } from "../core/form-service.ts";
import { DeterministicMemoryService } from "../core/memory-service.ts";
import { DeterministicActivationService } from "../core/activation-service.ts";
import { MinimalPolicyService } from "../core/policy-service.ts";
import { DeterministicConfirmService } from "../core/confirm-service.ts";
import { DeterministicTraceService } from "../core/trace-service.ts";
import { DeterministicReconcileService } from "../core/reconcile-service.ts";
import { DeterministicConsolidationService } from "../core/consolidation-service.ts";
import { DeterministicExecutionFactory } from "../core/execution-support.ts";
import { InMemoryWorkingStore } from "../in-memory/working-store.ts";
import { InMemoryEpisodicStore } from "../in-memory/episodic-store.ts";
import { InMemorySemanticStore } from "../in-memory/semantic-store.ts";
import { InMemoryEvidenceStore } from "../in-memory/evidence-store.ts";
import { InMemoryVslStore } from "../in-memory/vsl-store.ts";
import { DeterministicVslService } from "../core/vsl-service.ts";
import { FrozenProtocolExportService } from "../export/protocol-export.ts";

export type MinimalLoopScenarioName =
  | "fresh-intent"
  | "requirement-change-midflow";

export interface MinimalLoopScenario {
  scenario_id: string;
  description: string;
  project_id: string;
  raw_input: Record<string, unknown>;
  prior_object_refs?: string[];
}

export interface MinimalLoopExecutionOptions {
  include_protocol_export?: boolean;
}

export class MinimalLoopHarness {
  private readonly orchestrator: RuntimeOrchestrator;
  private readonly protocol_export_service?: FrozenProtocolExportService;

  constructor(
    orchestrator: RuntimeOrchestrator,
    protocol_export_service?: FrozenProtocolExportService
  ) {
    this.orchestrator = orchestrator;
    this.protocol_export_service = protocol_export_service;
  }

  static create_default(
    repo_root: string,
    scenario_id: string
  ): MinimalLoopHarness {
    const registry_service = FrozenRegistryService.from_repo_root(repo_root);
    const binding_service = FrozenBindingService.from_repo_root(repo_root);
    const protocol_export_service = FrozenProtocolExportService.from_repo_root(
      repo_root,
      binding_service
    );
    const factory = new DeterministicExecutionFactory(scenario_id);
    const working_store = new InMemoryWorkingStore();
    const episodic_store = new InMemoryEpisodicStore();
    const semantic_store = new InMemorySemanticStore();
    const evidence_store = new InMemoryEvidenceStore();
    const vsl_store = new InMemoryVslStore();

    const orchestrator = new MinimalRuntimeOrchestratorSkeleton({
      registry_service,
      binding_service,
      form_service: new DeterministicFormService({
        registry_service,
        binding_service,
        factory,
        scenario_id,
      }),
      memory_service: new DeterministicMemoryService({
        registry_service,
        factory,
        scenario_id,
      }),
      activation_service: new DeterministicActivationService({
        registry_service,
        factory,
        scenario_id,
      }),
      policy_service: new MinimalPolicyService(),
      confirm_service: new DeterministicConfirmService({
        registry_service,
        binding_service,
        factory,
        scenario_id,
      }),
      trace_service: new DeterministicTraceService({
        registry_service,
        binding_service,
        factory,
        scenario_id,
      }),
      reconcile_service: new DeterministicReconcileService({
        registry_service,
        factory,
        scenario_id,
      }),
      consolidation_service: new DeterministicConsolidationService({
        registry_service,
        factory,
        scenario_id,
      }),
      working_store,
      episodic_store,
      semantic_store,
      evidence_store,
      vsl_service: new DeterministicVslService({
        vsl_store,
      }),
    });

    return new MinimalLoopHarness(orchestrator, protocol_export_service);
  }

  async load_scenario(
    scenario_path: string
  ): Promise<MinimalLoopScenario> {
    const raw = await readFile(scenario_path, "utf8");
    return JSON.parse(raw) as MinimalLoopScenario;
  }

  plan_scenario(input: MinimalLoopInput): MinimalLoopPlan {
    return this.orchestrator.plan_minimal_loop(input);
  }

  dry_run_scenario(input: MinimalLoopInput): MinimalLoopRunResult {
    return this.orchestrator.dry_run_minimal_loop(input);
  }

  load_project_continuity(
    project_id: string
  ): RuntimeVslContinuityState | undefined {
    return this.orchestrator.load_project_continuity(project_id);
  }

  recover_continuation_anchor(
    project_id: string
  ): RuntimeContinuationAnchor | undefined {
    return this.orchestrator.recover_continuation_anchor(project_id);
  }

  execute_scenario(
    input: MinimalLoopInput,
    options: MinimalLoopExecutionOptions = {}
  ): MinimalLoopRunResult {
    const result = this.orchestrator.execute_minimal_loop(input);

    if (
      options.include_protocol_export &&
      result.status === "executed" &&
      this.protocol_export_service
    ) {
      return {
        ...result,
        protocol_export: this.protocol_export_service.export_run({
          project_id: input.project_id,
          run_result: result,
        }),
        notes: [
          ...result.notes,
          "Bounded MPLP reconstruction/export was attempted through the frozen protocol export service.",
        ],
      };
    }

    return result;
  }
}

export async function execute_scenario_file(
  repo_root: string,
  scenario_path: string,
  options: MinimalLoopExecutionOptions = {}
): Promise<MinimalLoopRunResult> {
  const scenario_file = resolve(scenario_path);
  const raw = await readFile(scenario_file, "utf8");
  const scenario = JSON.parse(raw) as MinimalLoopScenario;
  const harness = MinimalLoopHarness.create_default(
    repo_root,
    scenario.scenario_id
  );

  return harness.execute_scenario({
    scenario_id: scenario.scenario_id,
    project_id: scenario.project_id,
    raw_input: scenario.raw_input,
    prior_object_refs: scenario.prior_object_refs,
  }, options);
}
