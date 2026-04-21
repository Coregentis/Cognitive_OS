import type {
  RuntimeProjectionRevisionEnvelope,
  RuntimeProjectionSummaryEnvelope,
} from "../core/projection-types.ts";

function clone_summary(
  summary: RuntimeProjectionSummaryEnvelope
): RuntimeProjectionSummaryEnvelope {
  return structuredClone(summary);
}

function clone_revision(
  envelope: RuntimeProjectionRevisionEnvelope
): RuntimeProjectionRevisionEnvelope {
  return structuredClone(envelope);
}

export class InMemoryProjectionStore {
  private readonly summaries = new Map<
    string,
    Map<string, RuntimeProjectionSummaryEnvelope>
  >();
  private readonly revisions = new Map<
    string,
    Map<string, RuntimeProjectionRevisionEnvelope>
  >();

  put_projection_summary(
    project_id: string,
    summary: RuntimeProjectionSummaryEnvelope
  ): RuntimeProjectionSummaryEnvelope {
    if (summary.project_id !== project_id) {
      throw new Error("Projection summary project_id must match storage project_id.");
    }

    const project_summaries =
      this.summaries.get(project_id) ??
      new Map<string, RuntimeProjectionSummaryEnvelope>();
    const persisted = clone_summary(summary);

    project_summaries.set(persisted.projection_summary_id, persisted);
    this.summaries.set(project_id, project_summaries);

    return clone_summary(persisted);
  }

  list_projection_summaries(
    project_id: string
  ): RuntimeProjectionSummaryEnvelope[] {
    return [...(this.summaries.get(project_id)?.values() ?? [])].map(
      (summary) => clone_summary(summary)
    );
  }

  get_projection_summary(
    project_id: string,
    summary_id: string
  ): RuntimeProjectionSummaryEnvelope | undefined {
    const summary = this.summaries.get(project_id)?.get(summary_id);
    return summary ? clone_summary(summary) : undefined;
  }

  put_projection_revision_envelope(
    envelope: RuntimeProjectionRevisionEnvelope
  ): RuntimeProjectionRevisionEnvelope {
    const project_revisions =
      this.revisions.get(envelope.project_id) ??
      new Map<string, RuntimeProjectionRevisionEnvelope>();
    const persisted = clone_revision(envelope);

    project_revisions.set(persisted.revision_id, persisted);
    this.revisions.set(envelope.project_id, project_revisions);

    return clone_revision(persisted);
  }

  get_projection_revision_envelope(
    project_id: string,
    revision_id: string
  ): RuntimeProjectionRevisionEnvelope | undefined {
    const envelope = this.revisions.get(project_id)?.get(revision_id);
    return envelope ? clone_revision(envelope) : undefined;
  }

  list_projection_revision_envelopes(
    project_id: string
  ): RuntimeProjectionRevisionEnvelope[] {
    return [...(this.revisions.get(project_id)?.values() ?? [])].map(
      (envelope) => clone_revision(envelope)
    );
  }
}
