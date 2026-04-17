declare module "better-sqlite3" {
  interface Statement {
    run(params?: unknown): { changes: number };
    get(params?: unknown): unknown;
    all(params?: unknown): unknown[];
  }

  export default class Database {
    constructor(path?: string);
    exec(sql: string): void;
    prepare(sql: string): Statement;
    close(): void;
  }
}
