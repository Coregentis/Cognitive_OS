import type { RuntimeObjectRecord } from "../core/runtime-types";

export class InMemoryWorkingStore {
  private readonly records = new Map<string, RuntimeObjectRecord>();

  put(record: RuntimeObjectRecord): void {
    this.records.set(record.object_id, record);
  }

  get(object_id: string): RuntimeObjectRecord | undefined {
    return this.records.get(object_id);
  }

  list_by_project(project_id?: string): RuntimeObjectRecord[] {
    if (!project_id) {
      return [...this.records.values()];
    }

    return [...this.records.values()].filter(
      (record) => record.project_id === project_id
    );
  }

  clear(): void {
    this.records.clear();
  }
}
