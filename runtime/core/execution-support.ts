import type {
  BindingMatrixEntryRecord,
  RegistryEntryRecord,
  RuntimeObjectRecord,
} from "./runtime-types";

export interface RuntimeStoreSnapshot {
  working_object_ids: string[];
  episodic_object_ids: string[];
  semantic_object_ids: string[];
  evidence_object_ids: string[];
}

export interface CreateObjectParams {
  registry_entry: RegistryEntryRecord;
  project_id?: string;
  status: string;
  scenario_id: string;
  creation_source:
    | "user_entry"
    | "agent_action"
    | "tool_result"
    | "runtime_derivation"
    | "protocol_import"
    | "product_projection";
  derivation_mode:
    | "origin"
    | "imported"
    | "derived"
    | "promoted"
    | "replayed";
  protocol_binding?: BindingMatrixEntryRecord | undefined;
  lineage_overrides?: Record<string, unknown>;
  governance_overrides?: Record<string, unknown>;
  extra: Record<string, unknown>;
}

export class DeterministicExecutionFactory {
  private object_counter = 1;
  private time_counter = 0;
  private readonly base_epoch_ms: number;
  private readonly scenario_id: string;

  constructor(scenario_id: string) {
    this.scenario_id = scenario_id;
    this.base_epoch_ms =
      scenario_id === "requirement-change-midflow"
        ? Date.parse("2026-01-02T00:00:00.000Z")
        : Date.parse("2026-01-01T00:00:00.000Z");
  }

  next_id(): string {
    const suffix = String(this.object_counter).padStart(12, "0");
    this.object_counter += 1;
    return `00000000-0000-4000-8000-${suffix}`;
  }

  next_timestamp(): string {
    const value = new Date(this.base_epoch_ms + this.time_counter * 1000);
    this.time_counter += 1;
    return value.toISOString();
  }

  create_object(params: CreateObjectParams): RuntimeObjectRecord {
    const cognition_time = this.next_timestamp();
    const object_id = this.next_id();

    if (
      params.protocol_binding &&
      params.registry_entry.protocol_binding_ref_policy !==
        "optional_shallow_runtime_bound"
    ) {
      throw new Error(
        `Protocol binding is not permitted by frozen registry policy for ${params.registry_entry.object_type}`
      );
    }

    const record: RuntimeObjectRecord = {
      schema_version: "0.1.0",
      object_id,
      object_type: params.registry_entry.object_type,
      authority_class: params.registry_entry.authority_class,
      primary_layer: params.registry_entry.primary_layer,
      memory_layer: params.registry_entry.memory_layer,
      status: params.status,
      project_id: params.project_id,
      temporal: {
        temporal_class: params.registry_entry.temporal_class,
        cognition_time,
        event_time: cognition_time,
      },
      mutation: {
        mutation_class: params.registry_entry.mutation_class,
        current_revision: 1,
      },
      lineage: {
        creation_source: params.creation_source,
        derivation_mode: params.derivation_mode,
        source_artifact_refs: [`fixture:${this.scenario_id}`],
        ...params.lineage_overrides,
      },
      governance: {
        governance_scope: params.project_id ? "project" : "object",
        approval_state: "not_required",
        ...params.governance_overrides,
      },
      ...params.extra,
    };

    if (params.protocol_binding) {
      record.protocol_binding_ref = {
        binding_class: "runtime_bound",
        protocol_object_type: params.protocol_binding.mplp_object ?? undefined,
        reconstructable:
          params.protocol_binding.binding_class ===
          "shallow_reconstructable_runtime_bound",
      };
    }

    return record;
  }
}
