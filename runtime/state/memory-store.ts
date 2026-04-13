import type { WorkforceStateRecord, StateStorePort } from "./state-store-port.ts";
import { assert_workforce_object_type } from "./state-store-port.ts";

export interface MemoryProfileRecord extends WorkforceStateRecord {
  object_type: "memory-profile";
  memory_summary: string;
}

function assert_memory_profile_record(
  record: WorkforceStateRecord
): asserts record is MemoryProfileRecord {
  assert_workforce_object_type(record.object_type);

  if (record.object_type !== "memory-profile") {
    throw new Error(
      `Expected memory-profile record, received ${record.object_type}`
    );
  }
}

export class MemoryStore {
  private readonly state_store: StateStorePort;

  constructor(state_store: StateStorePort) {
    this.state_store = state_store;
  }

  save(record: MemoryProfileRecord): MemoryProfileRecord {
    return this.state_store.save(record) as MemoryProfileRecord;
  }

  load(object_id: string): MemoryProfileRecord | undefined {
    const record = this.state_store.load(object_id);

    if (!record) {
      return undefined;
    }

    assert_memory_profile_record(record);
    return record;
  }

  list(project_id?: string): MemoryProfileRecord[] {
    return this.state_store
      .list({
        object_type: "memory-profile",
        project_id,
      })
      .map((record) => {
        assert_memory_profile_record(record);
        return record;
      });
  }
}
