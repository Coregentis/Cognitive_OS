import type {
  PersistedRuntimeStateRecord,
  StateStorePort,
  WorkforceStateRecord,
} from "./state-store-port.ts";
import { assert_workforce_object_type } from "./state-store-port.ts";

export interface PreferenceProfileRecord extends WorkforceStateRecord {
  object_type: "preference-profile";
  preference_summary: string;
}

function assert_preference_profile_record(
  record: PersistedRuntimeStateRecord
): asserts record is PreferenceProfileRecord {
  assert_workforce_object_type(record.object_type);

  if (record.object_type !== "preference-profile") {
    throw new Error(
      `Expected preference-profile record, received ${record.object_type}`
    );
  }
}

export class PreferenceStore {
  private readonly state_store: StateStorePort;

  constructor(state_store: StateStorePort) {
    this.state_store = state_store;
  }

  save(record: PreferenceProfileRecord): PreferenceProfileRecord {
    return this.state_store.save(record) as PreferenceProfileRecord;
  }

  load(object_id: string): PreferenceProfileRecord | undefined {
    const record = this.state_store.load(object_id);

    if (!record) {
      return undefined;
    }

    assert_preference_profile_record(record);
    return record;
  }

  list(project_id?: string): PreferenceProfileRecord[] {
    return this.state_store
      .list({
        object_type: "preference-profile",
        project_id,
      })
      .map((record) => {
        assert_preference_profile_record(record);
        return record;
      });
  }
}
