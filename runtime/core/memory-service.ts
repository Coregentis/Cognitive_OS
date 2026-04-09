import type {
  CoregentisMemoryLayer,
  RegistryEntryRecord,
  RuntimeObjectRecord,
} from "./runtime-types";
import type { RegistryService } from "./registry-service";
import { DeterministicExecutionFactory } from "./execution-support.ts";

export interface PlaceWorkingStateRequest {
  project_id: string;
  source_object: RuntimeObjectRecord;
}

export interface OpenEpisodeRequest {
  project_id: string;
  source_object_refs: string[];
  episode_kind: string;
  title: string;
}

export interface RegisterSemanticFactRequest {
  project_id: string;
  source_object: RuntimeObjectRecord;
}

export interface MemoryPlacementRecord {
  object_id: string;
  memory_layer: CoregentisMemoryLayer;
  notes: string[];
}

export interface MemoryService {
  place_working_state(
    request: PlaceWorkingStateRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  open_episode(
    request: OpenEpisodeRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  register_semantic_fact(
    request: RegisterSemanticFactRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  inspect_memory_placement(
    object_record: RuntimeObjectRecord
  ): Promise<MemoryPlacementRecord> | MemoryPlacementRecord;
}

export class DeterministicMemoryService implements MemoryService {
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

  private get_registry_entry(
    object_type: "working-state-node" | "episode" | "semantic-fact"
  ): RegistryEntryRecord {
    const entry = this.registry_service.get_object_definition(object_type);
    if (!entry) {
      throw new Error(`Missing registry entry for ${object_type}`);
    }
    return entry;
  }

  place_working_state(
    request: PlaceWorkingStateRequest
  ): RuntimeObjectRecord {
    return this.factory.create_object({
      registry_entry: this.get_registry_entry("working-state-node"),
      project_id: request.project_id,
      status: "active",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      lineage_overrides: {
        source_object_ids: [request.source_object.object_id],
      },
      extra: {
        node_kind: "task_state",
        state_summary: `working state for ${request.source_object.object_type}`,
      },
    });
  }

  open_episode(
    request: OpenEpisodeRequest
  ): RuntimeObjectRecord {
    return this.factory.create_object({
      registry_entry: this.get_registry_entry("episode"),
      project_id: request.project_id,
      status: "open",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "origin",
      lineage_overrides: {
        source_object_ids: request.source_object_refs,
      },
      extra: {
        episode_kind: request.episode_kind,
        title: request.title,
        opened_at: this.factory.next_timestamp(),
        anchor_object_refs: request.source_object_refs,
      },
    });
  }

  register_semantic_fact(
    request: RegisterSemanticFactRequest
  ): RuntimeObjectRecord {
    return this.factory.create_object({
      registry_entry: this.get_registry_entry("semantic-fact"),
      project_id: request.project_id,
      status: "candidate",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "promoted",
      lineage_overrides: {
        source_object_ids: [request.source_object.object_id],
        promoted_from_object_id: request.source_object.object_id,
      },
      extra: {
        fact_type: "requirement",
        fact_statement: `semantic fact from ${request.source_object.object_type}`,
        confidence_level: "medium",
      },
    });
  }

  inspect_memory_placement(
    object_record: RuntimeObjectRecord
  ): MemoryPlacementRecord {
    return {
      object_id: object_record.object_id,
      memory_layer: object_record.memory_layer ?? null,
      notes: [
        object_record.memory_layer
          ? `Object classified into ${object_record.memory_layer}.`
          : "Object has no dominant retained memory layer in the runtime skeleton.",
      ],
    };
  }
}
