import {
  PreferenceStore,
  type PreferenceProfileRecord,
} from "../state/preference-store.ts";
import type {
  CorrectionCapturePort,
  CorrectionCaptureRecord,
} from "./correction-capture.ts";

export type PreferenceWritebackDisposition =
  | "applied"
  | "skipped"
  | "failed";

export interface PreferenceWritebackClock {
  now(): string;
}

export interface PreferenceWritebackRequest {
  correction: CorrectionCaptureRecord;
  target_preference_profile_id?: string;
}

export interface PreferenceWritebackResult {
  disposition: PreferenceWritebackDisposition;
  preference_profile?: PreferenceProfileRecord;
  notes: string[];
}

export interface PreferenceProfileFactory {
  create_from_correction(
    correction: CorrectionCaptureRecord,
    now: string
  ): PreferenceProfileRecord;
}

export interface PreferenceWritebackPort {
  writeback(
    request: PreferenceWritebackRequest
  ): PreferenceWritebackResult;
}

function dedupe_strings(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}

function next_revision(profile: PreferenceProfileRecord): number {
  const current_revision = profile.mutation?.current_revision;
  return typeof current_revision === "number" ? current_revision + 1 : 2;
}

export class PreferenceWritebackService
  implements PreferenceWritebackPort
{
  private readonly preference_store: PreferenceStore;
  private readonly correction_capture?: CorrectionCapturePort;
  private readonly profile_factory?: PreferenceProfileFactory;
  private readonly clock: PreferenceWritebackClock;

  constructor(params: {
    preference_store: PreferenceStore;
    correction_capture?: CorrectionCapturePort;
    profile_factory?: PreferenceProfileFactory;
    clock?: PreferenceWritebackClock;
  }) {
    this.preference_store = params.preference_store;
    this.correction_capture = params.correction_capture;
    this.profile_factory = params.profile_factory;
    this.clock = params.clock ?? {
      now() {
        return new Date().toISOString();
      },
    };
  }

  writeback(
    request: PreferenceWritebackRequest
  ): PreferenceWritebackResult {
    const now = this.clock.now();
    const correction = request.correction;
    const target_profile_id =
      request.target_preference_profile_id ??
      correction.preference_profile_id;

    let profile: PreferenceProfileRecord | undefined;

    if (target_profile_id) {
      profile = this.preference_store.load(target_profile_id);

      if (!profile) {
        return {
          disposition: "failed",
          notes: [
            `Preference profile ${target_profile_id} was not found for bounded write-back.`,
          ],
        };
      }
    } else {
      const project_profiles = this.preference_store.list(
        correction.project_id
      );

      if (project_profiles.length === 1) {
        [profile] = project_profiles;
      }
    }

    if (!profile) {
      if (!this.profile_factory) {
        return {
          disposition: "skipped",
          notes: [
            "No bounded preference profile was available and no factory was configured.",
          ],
        };
      }

      profile = this.profile_factory.create_from_correction(
        correction,
        now
      );
    }

    const updated_profile: PreferenceProfileRecord = {
      ...profile,
      status: "active",
      preference_summary: correction.correction_summary,
      preference_signals: dedupe_strings([
        ...(Array.isArray(profile.preference_signals)
          ? profile.preference_signals
          : []),
        correction.corrected_value,
      ]),
      correction_refs: dedupe_strings([
        ...(Array.isArray(profile.correction_refs)
          ? profile.correction_refs
          : []),
        correction.correction_id,
      ]),
      temporal: {
        ...profile.temporal,
        event_time: now,
      },
      mutation: {
        ...profile.mutation,
        mutation_class: "stateful_mutable",
        current_revision: next_revision(profile),
        last_mutated_at: now,
      },
      last_revised_at: now,
    };

    const saved_profile = this.preference_store.save(updated_profile);

    if (this.correction_capture) {
      this.correction_capture.mark_written_back(
        correction.correction_id
      );
    }

    return {
      disposition: "applied",
      preference_profile: saved_profile,
      notes: [
        "Bounded preference write-back completed without autonomous learning.",
      ],
    };
  }
}
