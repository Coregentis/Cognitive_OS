import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import Database from "better-sqlite3";

import type { RuntimeObjectRecord } from "../core/runtime-types";
import {
  assert_workforce_record,
  matches_state_store_filter,
  type StateStoreListFilter,
  type StateStorePort,
  type WorkforceStateRecord,
} from "./state-store-port.ts";

function clone_state_record(
  record: WorkforceStateRecord
): WorkforceStateRecord {
  return structuredClone(record);
}

export class SQLiteStateStore implements StateStorePort {
  private readonly db;

  constructor(database_path = ":memory:") {
    if (database_path !== ":memory:" && !database_path.startsWith("file:")) {
      mkdirSync(dirname(database_path), { recursive: true });
    }

    this.db = new Database(database_path);
    this.initialize_schema();
  }

  private initialize_schema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS workforce_state (
        object_id TEXT PRIMARY KEY,
        object_type TEXT NOT NULL,
        project_id TEXT NOT NULL,
        status TEXT NOT NULL,
        payload TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS workforce_state_object_type_project_idx
      ON workforce_state (object_type, project_id);
    `);
  }

  save(record: WorkforceStateRecord): WorkforceStateRecord {
    assert_workforce_record(record as RuntimeObjectRecord);

    const persisted = clone_state_record(record);
    const updated_at = new Date().toISOString();

    this.db
      .prepare(
        `
          INSERT INTO workforce_state (
            object_id,
            object_type,
            project_id,
            status,
            payload,
            updated_at
          )
          VALUES (
            @object_id,
            @object_type,
            @project_id,
            @status,
            @payload,
            @updated_at
          )
          ON CONFLICT(object_id) DO UPDATE SET
            object_type = excluded.object_type,
            project_id = excluded.project_id,
            status = excluded.status,
            payload = excluded.payload,
            updated_at = excluded.updated_at
        `
      )
      .run({
        object_id: persisted.object_id,
        object_type: persisted.object_type,
        project_id: persisted.project_id,
        status: persisted.status,
        payload: JSON.stringify(persisted),
        updated_at,
      });

    return clone_state_record(persisted);
  }

  load(object_id: string): WorkforceStateRecord | undefined {
    const row = this.db
      .prepare(
        `
          SELECT payload
          FROM workforce_state
          WHERE object_id = ?
        `
      )
      .get(object_id) as { payload: string } | undefined;

    if (!row) {
      return undefined;
    }

    const record = JSON.parse(row.payload) as WorkforceStateRecord;
    assert_workforce_record(record as RuntimeObjectRecord);
    return clone_state_record(record);
  }

  list(filter?: StateStoreListFilter): WorkforceStateRecord[] {
    const clauses: string[] = [];
    const params: Record<string, string> = {};

    if (filter?.object_type) {
      clauses.push("object_type = @object_type");
      params.object_type = filter.object_type;
    }

    if (filter?.project_id) {
      clauses.push("project_id = @project_id");
      params.project_id = filter.project_id;
    }

    if (filter?.status) {
      clauses.push("status = @status");
      params.status = filter.status;
    }

    const where_clause =
      clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

    const rows = this.db
      .prepare(
        `
          SELECT payload
          FROM workforce_state
          ${where_clause}
          ORDER BY object_type, object_id
        `
      )
      .all(params) as Array<{ payload: string }>;

    return rows
      .map((row) => JSON.parse(row.payload) as WorkforceStateRecord)
      .filter((record) => matches_state_store_filter(record, filter))
      .map((record) => {
        assert_workforce_record(record as RuntimeObjectRecord);
        return clone_state_record(record);
      });
  }

  delete(object_id: string): boolean {
    const result = this.db
      .prepare(
        `
          DELETE FROM workforce_state
          WHERE object_id = ?
        `
      )
      .run(object_id);

    return result.changes > 0;
  }

  exists(object_id: string): boolean {
    const row = this.db
      .prepare(
        `
          SELECT 1
          FROM workforce_state
          WHERE object_id = ?
          LIMIT 1
        `
      )
      .get(object_id);

    return Boolean(row);
  }

  clear(): void {
    this.db.exec("DELETE FROM workforce_state");
  }

  close(): void {
    this.db.close();
  }
}
