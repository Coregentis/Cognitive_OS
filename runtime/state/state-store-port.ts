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

export interface WorkforceStateRecord extends RuntimeObjectRecord {
  object_type: WorkforceObjectType;
  project_id: string;
}

export interface StateStoreListFilter {
  object_type?: WorkforceObjectType;
  project_id?: string;
  status?: string;
}

export interface StateStorePort {
  save(record: WorkforceStateRecord): WorkforceStateRecord;
  load(object_id: string): WorkforceStateRecord | undefined;
  list(filter?: StateStoreListFilter): WorkforceStateRecord[];
  delete(object_id: string): boolean;
  exists(object_id: string): boolean;
  clear(): void;
}

export function is_workforce_object_type(
  value: CoregentisObjectType | string
): value is WorkforceObjectType {
  return WORKFORCE_OBJECT_TYPES.includes(value as WorkforceObjectType);
}

export function assert_workforce_object_type(
  value: CoregentisObjectType | string
): asserts value is WorkforceObjectType {
  if (!is_workforce_object_type(value)) {
    throw new Error(`Unsupported workforce object type: ${value}`);
  }
}

export function assert_workforce_record(
  record: RuntimeObjectRecord
): asserts record is WorkforceStateRecord {
  assert_workforce_object_type(record.object_type);

  if (typeof record.project_id !== "string" || record.project_id.length < 1) {
    throw new Error(
      `Workforce record ${record.object_id} is missing required project_id`
    );
  }
}

export function matches_state_store_filter(
  record: WorkforceStateRecord,
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
