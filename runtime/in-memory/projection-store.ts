import type {
  RuntimeContinuitySnapshotProjection,
  RuntimeLifecycleContinuityProjection,
  RuntimePendingReviewProjection,
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

function clone_lifecycle_continuity_projection(
  projection: RuntimeLifecycleContinuityProjection
): RuntimeLifecycleContinuityProjection {
  return structuredClone(projection);
}

function clone_pending_review_projection(
  projection: RuntimePendingReviewProjection
): RuntimePendingReviewProjection {
  return structuredClone(projection);
}

function clone_continuity_snapshot_projection(
  projection: RuntimeContinuitySnapshotProjection
): RuntimeContinuitySnapshotProjection {
  return structuredClone(projection);
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
  private readonly lifecycle_continuity_projections = new Map<
    string,
    Map<string, RuntimeLifecycleContinuityProjection>
  >();
  private readonly pending_review_projections = new Map<
    string,
    Map<string, RuntimePendingReviewProjection>
  >();
  private readonly continuity_snapshot_projections = new Map<
    string,
    Map<string, RuntimeContinuitySnapshotProjection>
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

  put_lifecycle_continuity_projection(
    project_id: string,
    projection: RuntimeLifecycleContinuityProjection
  ): RuntimeLifecycleContinuityProjection {
    if (projection.project_id !== project_id) {
      throw new Error(
        "Lifecycle continuity projection project_id must match storage project_id."
      );
    }

    const project_projections =
      this.lifecycle_continuity_projections.get(project_id) ??
      new Map<string, RuntimeLifecycleContinuityProjection>();
    const persisted = clone_lifecycle_continuity_projection(projection);

    project_projections.set(persisted.continuity_id, persisted);
    this.lifecycle_continuity_projections.set(project_id, project_projections);

    return clone_lifecycle_continuity_projection(persisted);
  }

  get_lifecycle_continuity_projection(
    project_id: string,
    continuity_id: string
  ): RuntimeLifecycleContinuityProjection | undefined {
    const projection =
      this.lifecycle_continuity_projections.get(project_id)?.get(continuity_id);
    return projection ? clone_lifecycle_continuity_projection(projection) : undefined;
  }

  list_lifecycle_continuity_projections(
    project_id: string
  ): RuntimeLifecycleContinuityProjection[] {
    return [
      ...(this.lifecycle_continuity_projections.get(project_id)?.values() ?? []),
    ].map((projection) => clone_lifecycle_continuity_projection(projection));
  }

  put_pending_review_projection(
    project_id: string,
    projection: RuntimePendingReviewProjection
  ): RuntimePendingReviewProjection {
    if (projection.project_id !== project_id) {
      throw new Error(
        "Pending review projection project_id must match storage project_id."
      );
    }

    const project_projections =
      this.pending_review_projections.get(project_id) ??
      new Map<string, RuntimePendingReviewProjection>();
    const persisted = clone_pending_review_projection(projection);

    project_projections.set(persisted.continuity_id, persisted);
    this.pending_review_projections.set(project_id, project_projections);

    return clone_pending_review_projection(persisted);
  }

  get_pending_review_projection(
    project_id: string,
    continuity_id: string
  ): RuntimePendingReviewProjection | undefined {
    const projection =
      this.pending_review_projections.get(project_id)?.get(continuity_id);
    return projection ? clone_pending_review_projection(projection) : undefined;
  }

  list_pending_review_projections(
    project_id: string
  ): RuntimePendingReviewProjection[] {
    return [...(this.pending_review_projections.get(project_id)?.values() ?? [])].map(
      (projection) => clone_pending_review_projection(projection)
    );
  }

  put_continuity_snapshot_projection(
    project_id: string,
    projection: RuntimeContinuitySnapshotProjection
  ): RuntimeContinuitySnapshotProjection {
    if (projection.project_id !== project_id) {
      throw new Error(
        "Continuity snapshot projection project_id must match storage project_id."
      );
    }

    const project_projections =
      this.continuity_snapshot_projections.get(project_id) ??
      new Map<string, RuntimeContinuitySnapshotProjection>();
    const persisted = clone_continuity_snapshot_projection(projection);

    project_projections.set(persisted.continuity_id, persisted);
    this.continuity_snapshot_projections.set(project_id, project_projections);

    return clone_continuity_snapshot_projection(persisted);
  }

  get_continuity_snapshot_projection(
    project_id: string,
    continuity_id: string
  ): RuntimeContinuitySnapshotProjection | undefined {
    const projection =
      this.continuity_snapshot_projections.get(project_id)?.get(continuity_id);
    return projection ? clone_continuity_snapshot_projection(projection) : undefined;
  }

  list_continuity_snapshot_projections(
    project_id: string
  ): RuntimeContinuitySnapshotProjection[] {
    return [
      ...(this.continuity_snapshot_projections.get(project_id)?.values() ?? []),
    ].map((projection) => clone_continuity_snapshot_projection(projection));
  }
}
