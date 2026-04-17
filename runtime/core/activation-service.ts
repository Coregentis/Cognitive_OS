import type { RuntimeObjectRecord } from "./runtime-types";
import type { RegistryService } from "./registry-service";
import { DeterministicExecutionFactory } from "./execution-support.ts";

export interface CreateActivationSignalRequest {
  project_id: string;
  trigger_object_id: string;
  signal_kind: string;
  scope: string;
  priority: string;
}

export interface CreateActionUnitRequest {
  project_id: string;
  activation_signal_id: string;
  action_kind: string;
  action_summary: string;
  target_object_refs?: string[];
}

export interface ActivationService {
  create_activation_signal(
    request: CreateActivationSignalRequest
  ): RuntimeObjectRecord;

  create_action_unit(
    request: CreateActionUnitRequest
  ): RuntimeObjectRecord;
}

export class DeterministicActivationService implements ActivationService {
  private readonly registry_service: RegistryService;
  private readonly factory: DeterministicExecutionFactory;
  private readonly scenario_id: string;

  constructor(args: {
    registry_service: RegistryService;
    factory: DeterministicExecutionFactory;
    scenario_id: string;
  }) {
    this.registry_service = args.registry_service;
    this.factory = args.factory;
    this.scenario_id = args.scenario_id;
  }

  create_activation_signal(
    request: CreateActivationSignalRequest
  ): RuntimeObjectRecord {
    const entry = this.registry_service.get_object_definition(
      "activation-signal"
    );
    if (!entry) {
      throw new Error("Missing registry entry for activation-signal");
    }

    return this.factory.create_object({
      registry_entry: entry,
      project_id: request.project_id,
      status: "proposed",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      lineage_overrides: {
        source_object_ids: [request.trigger_object_id],
      },
      extra: {
        trigger_object_id: request.trigger_object_id,
        signal_kind: request.signal_kind,
        scope: request.scope,
        priority: request.priority,
      },
    });
  }

  create_action_unit(
    request: CreateActionUnitRequest
  ): RuntimeObjectRecord {
    const entry = this.registry_service.get_object_definition("action-unit");
    if (!entry) {
      throw new Error("Missing registry entry for action-unit");
    }

    return this.factory.create_object({
      registry_entry: entry,
      project_id: request.project_id,
      status: "pending",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      lineage_overrides: {
        source_object_ids: [request.activation_signal_id],
      },
      extra: {
        activation_signal_id: request.activation_signal_id,
        action_kind: request.action_kind,
        action_summary: request.action_summary,
        target_object_refs: request.target_object_refs ?? [],
      },
    });
  }
}
