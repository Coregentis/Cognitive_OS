import type {
  CoregentisObjectType,
  RuntimeObjectRecord,
} from "../core/runtime-types";

export const WORKFORCE_OBJECT_TYPES = [
  "agent-group",
  "agent-worker",
  "role-profile",
  "objective",
  "work-item",
  "review-cycle",
  "memory-profile",
  "preference-profile",
] as const;

export type WorkforceObjectType = (typeof WORKFORCE_OBJECT_TYPES)[number];

export const PERSISTED_RUNTIME_STATE_OBJECT_TYPES = [
  ...WORKFORCE_OBJECT_TYPES,
  "cell-runtime-scope",
  "cell-summary-runtime-record",
  "management-directive-record",
  "delivery-return-record",
  "approval-request-record",
] as const;

export type PersistedRuntimeStateObjectType =
  (typeof PERSISTED_RUNTIME_STATE_OBJECT_TYPES)[number];

export interface PersistedRuntimeStateRecord extends RuntimeObjectRecord {
  object_type: PersistedRuntimeStateObjectType;
  project_id: string;
}

export interface WorkforceStateRecord extends PersistedRuntimeStateRecord {
  object_type: WorkforceObjectType;
}

export interface StateStoreListFilter {
  object_type?: PersistedRuntimeStateObjectType;
  project_id?: string;
  status?: string;
}

export interface StateStorePort {
  save(record: PersistedRuntimeStateRecord): PersistedRuntimeStateRecord;
  load(object_id: string): PersistedRuntimeStateRecord | undefined;
  list(filter?: StateStoreListFilter): PersistedRuntimeStateRecord[];
  delete(object_id: string): boolean;
  exists(object_id: string): boolean;
  clear(): void;
}

export function is_persisted_runtime_state_object_type(
  value: CoregentisObjectType | string
): value is PersistedRuntimeStateObjectType {
  return PERSISTED_RUNTIME_STATE_OBJECT_TYPES.includes(
    value as PersistedRuntimeStateObjectType
  );
}

export function is_workforce_object_type(
  value: CoregentisObjectType | string
): value is WorkforceObjectType {
  return WORKFORCE_OBJECT_TYPES.includes(value as WorkforceObjectType);
}

export function assert_persisted_runtime_state_object_type(
  value: CoregentisObjectType | string
): asserts value is PersistedRuntimeStateObjectType {
  if (!is_persisted_runtime_state_object_type(value)) {
    throw new Error(`Unsupported persisted runtime state object type: ${value}`);
  }
}

export function assert_workforce_object_type(
  value: CoregentisObjectType | string
): asserts value is WorkforceObjectType {
  if (!is_workforce_object_type(value)) {
    throw new Error(`Unsupported workforce object type: ${value}`);
  }
}

export function assert_persisted_runtime_state_record(
  record: RuntimeObjectRecord
): asserts record is PersistedRuntimeStateRecord {
  assert_persisted_runtime_state_object_type(record.object_type);

  if (typeof record.project_id !== "string" || record.project_id.length < 1) {
    throw new Error(
      `Persisted runtime state record ${record.object_id} is missing required project_id`
    );
  }
}

export function matches_state_store_filter(
  record: PersistedRuntimeStateRecord,
  filter?: StateStoreListFilter
): boolean {
  if (!filter) {
    return true;
  }

  if (filter.object_type && record.object_type !== filter.object_type) {
    return false;
  }

  if (filter.project_id && record.project_id !== filter.project_id) {
    return false;
  }

  if (filter.status && record.status !== filter.status) {
    return false;
  }

  return true;
}

export function assert_workforce_record(
  record: RuntimeObjectRecord
): asserts record is WorkforceStateRecord {
  assert_persisted_runtime_state_record(record);
  assert_workforce_object_type(record.object_type);
}
