import type { RuntimeObjectRecord } from "../core/runtime-types";
import {
  assert_persisted_runtime_state_record,
  matches_state_store_filter,
  type PersistedRuntimeStateRecord,
  type StateStoreListFilter,
  type StateStorePort,
} from "./state-store-port.ts";

function clone_state_record(
  record: PersistedRuntimeStateRecord
): PersistedRuntimeStateRecord {
  return structuredClone(record);
}

export class InMemoryStateStore implements StateStorePort {
  private readonly records = new Map<string, PersistedRuntimeStateRecord>();

  save(record: PersistedRuntimeStateRecord): PersistedRuntimeStateRecord {
    assert_persisted_runtime_state_record(record as RuntimeObjectRecord);

    const persisted = clone_state_record(record);
    this.records.set(persisted.object_id, persisted);
    return clone_state_record(persisted);
  }

  load(object_id: string): PersistedRuntimeStateRecord | undefined {
    const record = this.records.get(object_id);
    return record ? clone_state_record(record) : undefined;
  }

  list(filter?: StateStoreListFilter): PersistedRuntimeStateRecord[] {
    return [...this.records.values()]
      .filter((record) => matches_state_store_filter(record, filter))
      .map((record) => clone_state_record(record));
  }

  delete(object_id: string): boolean {
    return this.records.delete(object_id);
  }

  exists(object_id: string): boolean {
    return this.records.has(object_id);
  }

  clear(): void {
    this.records.clear();
  }
}
