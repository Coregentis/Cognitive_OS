import type { RuntimeProjectionSummaryEnvelope } from "../core/projection-types.ts";

function clone_summary(
  summary: RuntimeProjectionSummaryEnvelope
): RuntimeProjectionSummaryEnvelope {
  return structuredClone(summary);
}

export class InMemoryProjectionStore {
  private readonly summaries = new Map<
    string,
    Map<string, RuntimeProjectionSummaryEnvelope>
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
}
