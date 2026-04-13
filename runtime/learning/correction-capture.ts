import { randomUUID } from "node:crypto";

export type CorrectionCaptureSource = "user" | "system";
export type CorrectionCaptureTarget =
  | "objective"
  | "worker"
  | "preference"
  | "execution";
export type CorrectionCaptureStatus =
  | "captured"
  | "written_back";

export interface CorrectionCaptureClock {
  now(): string;
}

export interface CorrectionCaptureInput {
  project_id: string;
  correction_source: CorrectionCaptureSource;
  correction_target: CorrectionCaptureTarget;
  correction_summary: string;
  corrected_value: string;
  previous_value?: string;
  objective_id?: string;
  worker_id?: string;
  preference_profile_id?: string;
  target_ref_id?: string;
  metadata?: Record<string, unknown>;
}

export interface CorrectionCaptureRecord extends CorrectionCaptureInput {
  correction_id: string;
  captured_at: string;
  status: CorrectionCaptureStatus;
}

export interface CorrectionCaptureListFilter {
  project_id?: string;
  status?: CorrectionCaptureStatus;
}

export interface CorrectionCapturePort {
  capture(input: CorrectionCaptureInput): CorrectionCaptureRecord;
  get(correction_id: string): CorrectionCaptureRecord | undefined;
  list(filter?: CorrectionCaptureListFilter): CorrectionCaptureRecord[];
  mark_written_back(correction_id: string): CorrectionCaptureRecord;
}

function clone_record(
  record: CorrectionCaptureRecord
): CorrectionCaptureRecord {
  return structuredClone(record);
}

function matches_filter(
  record: CorrectionCaptureRecord,
  filter?: CorrectionCaptureListFilter
): boolean {
  if (!filter) {
    return true;
  }

  if (filter.project_id && record.project_id !== filter.project_id) {
    return false;
  }

  if (filter.status && record.status !== filter.status) {
    return false;
  }

  return true;
}

function validate_capture_input(input: CorrectionCaptureInput): void {
  if (!input.project_id) {
    throw new Error("Correction capture requires project_id.");
  }

  if (!input.correction_summary) {
    throw new Error("Correction capture requires correction_summary.");
  }

  if (!input.corrected_value) {
    throw new Error("Correction capture requires corrected_value.");
  }

  if (
    !input.objective_id &&
    !input.worker_id &&
    !input.preference_profile_id &&
    !input.target_ref_id
  ) {
    throw new Error(
      "Correction capture requires at least one bounded target reference."
    );
  }
}

export class InMemoryCorrectionCapture implements CorrectionCapturePort {
  private readonly clock: CorrectionCaptureClock;
  private readonly records = new Map<string, CorrectionCaptureRecord>();

  constructor(clock?: CorrectionCaptureClock) {
    this.clock = clock ?? {
      now() {
        return new Date().toISOString();
      },
    };
  }

  capture(input: CorrectionCaptureInput): CorrectionCaptureRecord {
    validate_capture_input(input);

    const record: CorrectionCaptureRecord = {
      ...input,
      correction_id: randomUUID(),
      captured_at: this.clock.now(),
      status: "captured",
    };

    this.records.set(record.correction_id, record);
    return clone_record(record);
  }

  get(correction_id: string): CorrectionCaptureRecord | undefined {
    const record = this.records.get(correction_id);
    return record ? clone_record(record) : undefined;
  }

  list(filter?: CorrectionCaptureListFilter): CorrectionCaptureRecord[] {
    return [...this.records.values()]
      .filter((record) => matches_filter(record, filter))
      .map((record) => clone_record(record));
  }

  mark_written_back(correction_id: string): CorrectionCaptureRecord {
    const current = this.records.get(correction_id);

    if (!current) {
      throw new Error(
        `Unknown bounded correction capture: ${correction_id}`
      );
    }

    const updated: CorrectionCaptureRecord = {
      ...current,
      status: "written_back",
    };

    this.records.set(correction_id, updated);
    return clone_record(updated);
  }
}
