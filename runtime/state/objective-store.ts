import type { WorkforceStateRecord, StateStorePort } from "./state-store-port.ts";
import { assert_workforce_object_type } from "./state-store-port.ts";

export interface ObjectiveRecord extends WorkforceStateRecord {
  object_type: "objective";
  objective_summary: string;
}

function assert_objective_record(
  record: WorkforceStateRecord
): asserts record is ObjectiveRecord {
  assert_workforce_object_type(record.object_type);

  if (record.object_type !== "objective") {
    throw new Error(`Expected objective record, received ${record.object_type}`);
  }
}

export class ObjectiveStore {
  private readonly state_store: StateStorePort;

  constructor(state_store: StateStorePort) {
    this.state_store = state_store;
  }

  save(record: ObjectiveRecord): ObjectiveRecord {
    return this.state_store.save(record) as ObjectiveRecord;
  }

  load(object_id: string): ObjectiveRecord | undefined {
    const record = this.state_store.load(object_id);

    if (!record) {
      return undefined;
    }

    assert_objective_record(record);
    return record;
  }

  list(project_id?: string): ObjectiveRecord[] {
    return this.state_store
      .list({
        object_type: "objective",
        project_id,
      })
      .map((record) => {
        assert_objective_record(record);
        return record;
      });
  }
}
