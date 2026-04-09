import { readFile } from "node:fs/promises";

import type { RuntimeOrchestrator } from "../core/runtime-orchestrator";
import type {
  MinimalLoopInput,
  MinimalLoopPlan,
  MinimalLoopRunResult,
} from "../core/runtime-types";

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

export class MinimalLoopHarness {
  constructor(private readonly orchestrator: RuntimeOrchestrator) {}

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
}
