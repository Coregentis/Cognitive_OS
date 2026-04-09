import type { RuntimeObjectRecord } from "./runtime-types";
import type { BindingService } from "./binding-service";
import type { RegistryService } from "./registry-service";
import { DeterministicExecutionFactory } from "./execution-support.ts";

export interface CreateConfirmGateRequest {
  project_id: string;
  target_object_id: string;
  confirm_kind: string;
  requested_by_ref?: string;
}

export interface ResolveConfirmGateRequest {
  confirm_gate: RuntimeObjectRecord;
  resolution_status: string;
}

export interface ConfirmService {
  create_confirm_gate(
    request: CreateConfirmGateRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  resolve_confirm_gate(
    request: ResolveConfirmGateRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;
}

export class DeterministicConfirmService implements ConfirmService {
  private readonly registry_service: RegistryService;
  private readonly binding_service: BindingService;
  private readonly factory: DeterministicExecutionFactory;
  private readonly scenario_id: string;

  constructor(args: {
    registry_service: RegistryService;
    binding_service: BindingService;
    factory: DeterministicExecutionFactory;
    scenario_id: string;
  }) {
    this.registry_service = args.registry_service;
    this.binding_service = args.binding_service;
    this.factory = args.factory;
    this.scenario_id = args.scenario_id;
  }

  create_confirm_gate(
    request: CreateConfirmGateRequest
  ): RuntimeObjectRecord {
    const entry = this.registry_service.get_object_definition("confirm-gate");
    const binding = this.binding_service.get_binding("confirm-gate");
    if (!entry || !binding) {
      throw new Error("Missing frozen truth for confirm-gate");
    }

    return this.factory.create_object({
      registry_entry: entry,
      project_id: request.project_id,
      status: "pending",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      protocol_binding: binding,
      lineage_overrides: {
        source_object_ids: [request.target_object_id],
      },
      governance_overrides: {
        approval_state: "pending",
      },
      extra: {
        target_object_id: request.target_object_id,
        confirm_kind: request.confirm_kind,
        requested_by_ref: request.requested_by_ref ?? "runtime-policy-service",
      },
    });
  }

  resolve_confirm_gate(
    request: ResolveConfirmGateRequest
  ): RuntimeObjectRecord {
    return {
      ...request.confirm_gate,
      status: request.resolution_status,
      governance: {
        ...request.confirm_gate.governance,
        approval_state: request.resolution_status,
      },
    };
  }
}
