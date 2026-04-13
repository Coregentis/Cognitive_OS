import type { WorkforceStateRecord, StateStorePort } from "./state-store-port.ts";
import { assert_workforce_object_type } from "./state-store-port.ts";

import type { WorkerLifecycleState } from "../lifecycle/worker-state-machine.ts";

export interface AgentWorkerRecord extends WorkforceStateRecord {
  object_type: "agent-worker";
  status: WorkerLifecycleState;
  role_profile_id: string;
  worker_name: string;
}

function assert_agent_worker_record(
  record: WorkforceStateRecord
): asserts record is AgentWorkerRecord {
  assert_workforce_object_type(record.object_type);

  if (record.object_type !== "agent-worker") {
    throw new Error(
      `Expected agent-worker record, received ${record.object_type}`
    );
  }
}

export class WorkerStore {
  private readonly state_store: StateStorePort;

  constructor(state_store: StateStorePort) {
    this.state_store = state_store;
  }

  save(record: AgentWorkerRecord): AgentWorkerRecord {
    return this.state_store.save(record) as AgentWorkerRecord;
  }

  load(object_id: string): AgentWorkerRecord | undefined {
    const record = this.state_store.load(object_id);

    if (!record) {
      return undefined;
    }

    assert_agent_worker_record(record);
    return record;
  }

  list(project_id?: string): AgentWorkerRecord[] {
    return this.state_store
      .list({
        object_type: "agent-worker",
        project_id,
      })
      .map((record) => {
        assert_agent_worker_record(record);
        return record;
      });
  }

  delete(object_id: string): boolean {
    const record = this.load(object_id);

    if (!record) {
      return false;
    }

    return this.state_store.delete(object_id);
  }

  exists(object_id: string): boolean {
    const record = this.state_store.load(object_id);
    return record?.object_type === "agent-worker";
  }
}
