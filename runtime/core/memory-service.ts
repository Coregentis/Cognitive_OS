import type {
  CoregentisMemoryLayer,
  RuntimeObjectRecord,
} from "./runtime-types";

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
