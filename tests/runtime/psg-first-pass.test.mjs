import test from "node:test";
import assert from "node:assert/strict";

import { FrozenRegistryService } from "../../runtime/core/registry-service.ts";
import { DeterministicPsgService } from "../../runtime/core/psg-service.ts";
import { InMemoryPsgStore } from "../../runtime/in-memory/psg-store.ts";
import { MinimalLoopHarness } from "../../runtime/harness/minimal-loop-harness.ts";

const repoRoot = process.cwd();

function createRuntimeRecord(registryService, objectType, overrides = {}) {
  const entry = registryService.get_object_definition(objectType);

  assert.ok(entry, `missing registry entry for ${objectType}`);

  return {
    schema_version: "0.1.0",
    object_id: "00000000-0000-4000-8000-900000000001",
    object_type: objectType,
    authority_class: entry.authority_class,
    primary_layer: entry.primary_layer,
    memory_layer: entry.memory_layer,
    status: "active",
    project_id: "00000000-0000-4000-8000-530000000001",
    temporal: {
      temporal_class: entry.temporal_class,
      cognition_time: "2026-04-18T08:00:00.000Z",
      event_time: "2026-04-18T08:00:00.000Z",
    },
    mutation: {
      mutation_class: entry.mutation_class,
      current_revision: 1,
    },
    lineage: {
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
    },
    governance: {
      governance_scope: "project",
      approval_state: "not_required",
    },
    ...overrides,
  };
}

test("[runtime] PSG first pass upserts nodes, creates typed edges, and isolates projects", () => {
  const registryService = FrozenRegistryService.from_repo_root(repoRoot);
  const service = new DeterministicPsgService({
    registry_service: registryService,
    psg_store: new InMemoryPsgStore(),
  });
  const alphaProjectId = "00000000-0000-4000-8000-530000000001";
  const betaProjectId = "00000000-0000-4000-8000-530000000002";

  const alphaIntent = createRuntimeRecord(registryService, "intent", {
    object_id: "00000000-0000-4000-8000-530000000010",
    project_id: alphaProjectId,
    protocol_binding_ref: {
      binding_class: "runtime_bound",
      protocol_object_type: "mplp intent event-family semantics",
      reconstructable: false,
    },
  });
  const alphaEpisode = createRuntimeRecord(registryService, "episode", {
    object_id: "00000000-0000-4000-8000-530000000011",
    project_id: alphaProjectId,
    status: "open",
    lineage: {
      creation_source: "runtime_derivation",
      derivation_mode: "origin",
      source_object_ids: [alphaIntent.object_id],
    },
    anchor_object_refs: [alphaIntent.object_id],
  });
  const alphaTraceEvidence = createRuntimeRecord(registryService, "trace-evidence", {
    object_id: "00000000-0000-4000-8000-530000000012",
    project_id: alphaProjectId,
    status: "captured",
    protocol_binding_ref: {
      binding_class: "runtime_bound",
      protocol_object_type: "mplp trace",
      reconstructable: true,
    },
    lineage: {
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      source_object_ids: [alphaIntent.object_id],
    },
    subject_object_refs: [alphaIntent.object_id],
  });
  const betaIntent = createRuntimeRecord(registryService, "intent", {
    object_id: "00000000-0000-4000-8000-530000000020",
    project_id: betaProjectId,
    protocol_binding_ref: {
      binding_class: "runtime_bound",
      protocol_object_type: "mplp intent event-family semantics",
      reconstructable: false,
    },
  });

  service.upsert_project_node({
    record: alphaIntent,
  });
  service.upsert_project_node({
    record: alphaEpisode,
  });
  service.upsert_project_node({
    record: alphaTraceEvidence,
  });
  service.create_project_relation({
    project_id: alphaProjectId,
    relation_type: "contains",
    source_object_id: alphaEpisode.object_id,
    target_object_id: alphaIntent.object_id,
    origin: "anchor",
    origin_field: "anchor_object_refs",
    notes: ["manual anchor relation"],
  });
  service.create_project_relation({
    project_id: alphaProjectId,
    relation_type: "evidences",
    source_object_id: alphaTraceEvidence.object_id,
    target_object_id: alphaIntent.object_id,
    origin: "evidence_support",
    origin_field: "subject_object_refs",
    evidence_refs: [alphaTraceEvidence.object_id],
  });
  service.upsert_project_node({
    record: betaIntent,
  });

  const alphaGraph = service.inspect_project_graph(alphaProjectId);
  const betaGraph = service.inspect_project_graph(betaProjectId);

  assert.ok(alphaGraph);
  assert.ok(betaGraph);
  assert.equal(alphaGraph.export_class, "runtime_private_non_exportable");
  assert.equal(betaGraph.export_class, "runtime_private_non_exportable");
  assert.deepEqual(
    alphaGraph.node_records.map((node) => node.object_id),
    [
      alphaIntent.object_id,
      alphaEpisode.object_id,
      alphaTraceEvidence.object_id,
    ]
  );
  assert.deepEqual(
    alphaGraph.relation_edges.map((edge) => edge.relation_type),
    ["contains", "evidences"]
  );
  assert.equal(alphaGraph.node_records.length, 3);
  assert.equal(betaGraph.node_records.length, 1);
  assert.equal(alphaGraph.relation_edges[1]?.evidence_refs[0], alphaTraceEvidence.object_id);
  assert.equal(alphaGraph.relation_edges[0]?.origin_field, "anchor_object_refs");
  assert.ok(
    alphaGraph.node_records.every(
      (node) => node.export_class === "runtime_private_non_exportable"
    )
  );
  assert.ok(
    alphaGraph.relation_edges.every(
      (edge) => edge.export_class === "runtime_private_non_exportable"
    )
  );
  assert.doesNotMatch(
    JSON.stringify(alphaGraph),
    /GraphUpdateEvent|artifact_type|SoloCrew|Secretary|founder/i
  );
});

test("[runtime] PSG first pass ingests fresh-intent runtime objects into deterministic project graph state", () => {
  const harness = MinimalLoopHarness.create_default(repoRoot, "fresh-intent");
  const projectId = "00000000-0000-4000-8000-540000000001";
  const result = harness.execute_scenario({
    scenario_id: "fresh-intent",
    project_id: projectId,
    raw_input: {
      input_kind: "text",
      summary: "psg first-pass fresh-intent run",
    },
  });
  const inspectedGraph = harness.inspect_project_graph(projectId);

  assert.ok(result.graph_state);
  assert.ok(result.graph_update_summary);
  assert.deepEqual(inspectedGraph, result.graph_state);
  assert.equal(result.graph_state.project_id, projectId);
  assert.equal(result.graph_state.export_class, "runtime_private_non_exportable");
  assert.equal(
    result.graph_update_summary.export_class,
    "runtime_private_non_exportable"
  );
  assert.equal(
    result.graph_update_summary.node_delta,
    result.created_objects.length
  );
  assert.equal(
    result.graph_update_summary.affected_node_ids.length,
    result.created_objects.length
  );
  assert.ok(result.graph_update_summary.edge_delta > 0);
  assert.ok(
    result.graph_state.node_records.some(
      (node) => node.object_type === "semantic-fact"
    )
  );
  assert.ok(
    result.graph_state.relation_edges.some(
      (edge) => edge.relation_type === "contains"
    )
  );
  assert.ok(
    result.graph_state.relation_edges.some(
      (edge) => edge.relation_type === "promoted_from"
    )
  );
  assert.ok(
    result.graph_state.relation_edges.some(
      (edge) => edge.relation_type === "evidences"
    )
  );
  assert.ok(
    result.graph_state.relation_edges.every(
      (edge) => edge.export_class === "runtime_private_non_exportable"
    )
  );
  assert.ok(
    result.graph_state.relation_edges.every(
      (edge) => edge.target_object_type
    )
  );
  assert.deepEqual(
    result.graph_state.node_records.map((node) => node.object_id),
    [...result.graph_state.node_records.map((node) => node.object_id)].sort()
  );
  assert.doesNotMatch(
    JSON.stringify(result.graph_state),
    /GraphUpdateEvent|artifact_type|SoloCrew|Secretary|founder/i
  );
});
