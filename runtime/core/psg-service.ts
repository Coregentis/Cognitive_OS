import { createHash } from "node:crypto";

import type { RegistryService } from "./registry-service.ts";
import type {
  CoregentisObjectType,
  RegistryEntryRecord,
  RuntimeObjectRecord,
  RuntimePsgGraphState,
  RuntimePsgGraphUpdateSummary,
  RuntimePsgNodeRecord,
  RuntimePsgRelationEdge,
  RuntimePsgRelationOrigin,
  RuntimePsgStore,
  RuntimeRelationshipType,
} from "./runtime-types.ts";

export interface UpsertProjectNodeRequest {
  record: RuntimeObjectRecord;
}

export interface CreateProjectRelationRequest {
  project_id: string;
  relation_type: RuntimeRelationshipType;
  source_object_id: string;
  target_object_id: string;
  origin: RuntimePsgRelationOrigin;
  origin_field: string;
  evidence_refs?: string[];
  notes?: string[];
}

export interface IngestRuntimeObjectsRequest {
  project_id: string;
  object_records: RuntimeObjectRecord[];
}

export interface PsgIngestResult {
  graph_state: RuntimePsgGraphState;
  update_summary: RuntimePsgGraphUpdateSummary;
}

export interface PsgService {
  upsert_project_node(
    request: UpsertProjectNodeRequest
  ): RuntimePsgNodeRecord;
  create_project_relation(
    request: CreateProjectRelationRequest
  ): RuntimePsgRelationEdge;
  ingest_runtime_objects(
    request: IngestRuntimeObjectsRequest
  ): PsgIngestResult;
  inspect_project_graph(
    project_id: string
  ): RuntimePsgGraphState | undefined;
}

function unique_ids(values: unknown[]): string[] {
  return [...new Set(
    values.filter(
      (value): value is string => typeof value === "string" && value.length > 0
    )
  )];
}

function get_record_time(record: RuntimeObjectRecord): string {
  const cognition_time = record.temporal?.cognition_time;
  return typeof cognition_time === "string"
    ? cognition_time
    : "1970-01-01T00:00:00.000Z";
}

function get_array_refs(value: unknown): string[] {
  return Array.isArray(value) ? unique_ids(value) : [];
}

function sort_graph_state(
  state: RuntimePsgGraphState
): RuntimePsgGraphState {
  return {
    ...state,
    node_records: [...state.node_records].sort((left, right) =>
      left.object_id.localeCompare(right.object_id)
    ),
    relation_edges: [...state.relation_edges].sort((left, right) => {
      const bySource = left.source_object_id.localeCompare(right.source_object_id);
      if (bySource !== 0) {
        return bySource;
      }

      const byTarget = left.target_object_id.localeCompare(right.target_object_id);
      if (byTarget !== 0) {
        return byTarget;
      }

      const byType = left.relation_type.localeCompare(right.relation_type);
      if (byType !== 0) {
        return byType;
      }

      return left.origin_field.localeCompare(right.origin_field);
    }),
  };
}

function deterministic_uuid(seed: string): string {
  const hex = createHash("sha1").update(seed).digest("hex").slice(0, 32).split("");
  hex[12] = "4";
  hex[16] = "8";

  return [
    hex.slice(0, 8).join(""),
    hex.slice(8, 12).join(""),
    hex.slice(12, 16).join(""),
    hex.slice(16, 20).join(""),
    hex.slice(20, 32).join(""),
  ].join("-");
}

function create_empty_graph_state(
  project_id: string
): RuntimePsgGraphState {
  return {
    graph_id: project_id,
    project_id,
    graph_revision: 0,
    updated_at: "1970-01-01T00:00:00.000Z",
    export_class: "runtime_private_non_exportable",
    node_records: [],
    relation_edges: [],
    notes: [
      "PSG first pass remains a runtime-private, project-scoped semantic relation substrate.",
      "Graph state is internal inspection truth and is not an MPLP-native export object.",
    ],
  };
}

function create_relation_id(args: {
  project_id: string;
  relation_type: RuntimeRelationshipType;
  source_object_id: string;
  target_object_id: string;
  origin_field: string;
}): string {
  return deterministic_uuid(
    [
      args.project_id,
      args.relation_type,
      args.source_object_id,
      args.target_object_id,
      args.origin_field,
    ].join(":")
  );
}

function build_node_record(
  record: RuntimeObjectRecord,
  registry_entry: RegistryEntryRecord
): RuntimePsgNodeRecord {
  const supporting_evidence_refs = get_array_refs(
    record.supporting_evidence_refs
  );
  const source_object_ids = get_array_refs(record.lineage?.source_object_ids);

  return {
    node_id: record.object_id,
    object_id: record.object_id,
    object_type: record.object_type,
    project_id: String(record.project_id),
    authority_class: record.authority_class,
    functional_family: registry_entry.functional_family,
    primary_layer: record.primary_layer,
    memory_layer: record.memory_layer ?? null,
    status: record.status,
    protocol_binding_ref: record.protocol_binding_ref,
    source_object_ids,
    evidence_refs: supporting_evidence_refs,
    export_class: "runtime_private_non_exportable",
    notes: [
      "Node identity is derived from an existing runtime object record.",
      "PSG first pass stores runtime-private node metadata only and does not create a product-facing DTO.",
    ],
  };
}

function create_update_summary(args: {
  graph_state: RuntimePsgGraphState;
  previous_node_count: number;
  previous_edge_count: number;
  affected_node_ids: Set<string>;
  affected_relation_ids: Set<string>;
  notes: string[];
}): RuntimePsgGraphUpdateSummary {
  return {
    graph_id: args.graph_state.graph_id,
    project_id: args.graph_state.project_id,
    graph_revision: args.graph_state.graph_revision,
    update_kind: "node_edge_bulk_upsert",
    node_delta: args.graph_state.node_records.length - args.previous_node_count,
    edge_delta: args.graph_state.relation_edges.length - args.previous_edge_count,
    affected_node_ids: [...args.affected_node_ids].sort(),
    affected_relation_ids: [...args.affected_relation_ids].sort(),
    export_class: "runtime_private_non_exportable",
    notes: args.notes,
  };
}

export class DeterministicPsgService implements PsgService {
  private readonly registry_service: RegistryService;
  private readonly psg_store: RuntimePsgStore;

  constructor(args: {
    registry_service: RegistryService;
    psg_store: RuntimePsgStore;
  }) {
    this.registry_service = args.registry_service;
    this.psg_store = args.psg_store;
  }

  private load_or_create_project_graph(
    project_id: string
  ): RuntimePsgGraphState {
    return this.psg_store.load(project_id) ?? create_empty_graph_state(project_id);
  }

  private write_project_graph(
    graph_state: RuntimePsgGraphState
  ): RuntimePsgGraphState {
    return this.psg_store.write(sort_graph_state(graph_state));
  }

  private assert_project_id(
    project_id: string | undefined
  ): string {
    if (!project_id) {
      throw new Error("PSG first pass requires project-scoped runtime objects.");
    }
    return project_id;
  }

  private get_registry_entry(
    object_type: CoregentisObjectType
  ): RegistryEntryRecord {
    const entry = this.registry_service.get_object_definition(object_type);
    if (!entry) {
      throw new Error(`Missing registry truth for PSG object ${object_type}`);
    }
    return entry;
  }

  private assert_relation_allowed(
    source_object_type: CoregentisObjectType,
    relation_type: RuntimeRelationshipType
  ): void {
    const allowed = this.registry_service.get_allowed_relationships(
      source_object_type
    );

    if (!allowed.includes(relation_type)) {
      throw new Error(
        `Relation ${relation_type} is not allowed for ${source_object_type}`
      );
    }
  }

  private collect_derived_relations(
    record: RuntimeObjectRecord
  ): Array<{
    relation_type: RuntimeRelationshipType;
    source_object_id: string;
    target_object_id: string;
    origin: RuntimePsgRelationOrigin;
    origin_field: string;
    evidence_refs: string[];
    notes: string[];
  }> {
    const relations: Array<{
      relation_type: RuntimeRelationshipType;
      source_object_id: string;
      target_object_id: string;
      origin: RuntimePsgRelationOrigin;
      origin_field: string;
      evidence_refs: string[];
      notes: string[];
    }> = [];
    const lineage_source_object_ids = get_array_refs(record.lineage?.source_object_ids);
    const supporting_evidence_refs = get_array_refs(record.supporting_evidence_refs);
    const promoted_from_object_id =
      typeof record.lineage?.promoted_from_object_id === "string"
        ? record.lineage.promoted_from_object_id
        : undefined;

    if (promoted_from_object_id) {
      relations.push({
        relation_type: "promoted_from",
        source_object_id: record.object_id,
        target_object_id: promoted_from_object_id,
        origin: "lineage",
        origin_field: "lineage.promoted_from_object_id",
        evidence_refs: supporting_evidence_refs,
        notes: [
          "Promotion relation derived from the runtime object's lineage metadata.",
        ],
      });
    }

    for (const source_object_id of lineage_source_object_ids) {
      if (source_object_id === promoted_from_object_id) {
        continue;
      }

      relations.push({
        relation_type: "derived_from",
        source_object_id: record.object_id,
        target_object_id: source_object_id,
        origin: "lineage",
        origin_field: "lineage.source_object_ids",
        evidence_refs: supporting_evidence_refs,
        notes: [
          "Lineage relation derived from the runtime object's source_object_ids.",
        ],
      });
    }

    for (const target_object_id of get_array_refs(record.anchor_object_refs)) {
      relations.push({
        relation_type: "contains",
        source_object_id: record.object_id,
        target_object_id,
        origin: "anchor",
        origin_field: "anchor_object_refs",
        evidence_refs: [],
        notes: [
          "Episode-style containment relation derived from anchor_object_refs.",
        ],
      });
    }

    for (const target_object_id of get_array_refs(record.target_object_refs)) {
      relations.push({
        relation_type: "references",
        source_object_id: record.object_id,
        target_object_id,
        origin: "reference",
        origin_field: "target_object_refs",
        evidence_refs: supporting_evidence_refs,
        notes: [
          "Reference relation derived from target_object_refs.",
        ],
      });
    }

    if (typeof record.target_object_id === "string") {
      relations.push({
        relation_type: "references",
        source_object_id: record.object_id,
        target_object_id: record.target_object_id,
        origin: "reference",
        origin_field: "target_object_id",
        evidence_refs: supporting_evidence_refs,
        notes: [
          "Reference relation derived from target_object_id.",
        ],
      });
    }

    for (const target_object_id of get_array_refs(record.subject_object_refs)) {
      relations.push({
        relation_type: "evidences",
        source_object_id: record.object_id,
        target_object_id,
        origin: "evidence_support",
        origin_field: "subject_object_refs",
        evidence_refs: [record.object_id],
        notes: [
          "Evidence-support relation derived from subject_object_refs.",
        ],
      });
    }

    for (const source_object_id of supporting_evidence_refs) {
      relations.push({
        relation_type: "evidences",
        source_object_id,
        target_object_id: record.object_id,
        origin: "evidence_support",
        origin_field: "supporting_evidence_refs",
        evidence_refs: [source_object_id],
        notes: [
          "Evidence-support relation derived from supporting_evidence_refs.",
        ],
      });
    }

    for (const target_object_id of get_array_refs(record.baseline_object_refs)) {
      relations.push({
        relation_type: "references",
        source_object_id: record.object_id,
        target_object_id,
        origin: "reference",
        origin_field: "baseline_object_refs",
        evidence_refs: supporting_evidence_refs,
        notes: [
          "Reference relation derived from baseline_object_refs.",
        ],
      });
    }

    for (const target_object_id of get_array_refs(record.affected_object_refs)) {
      relations.push({
        relation_type: "references",
        source_object_id: record.object_id,
        target_object_id,
        origin: "reference",
        origin_field: "affected_object_refs",
        evidence_refs: supporting_evidence_refs,
        notes: [
          "Reference relation derived from affected_object_refs.",
        ],
      });
    }

    if (typeof record.continuation_anchor_ref === "string") {
      relations.push({
        relation_type: "references",
        source_object_id: record.object_id,
        target_object_id: record.continuation_anchor_ref,
        origin: "reference",
        origin_field: "continuation_anchor_ref",
        evidence_refs: supporting_evidence_refs,
        notes: [
          "Reference relation derived from continuation_anchor_ref.",
        ],
      });
    }

    for (const target_object_id of get_array_refs(record.observed_object_refs)) {
      relations.push({
        relation_type: "references",
        source_object_id: record.object_id,
        target_object_id,
        origin: "reference",
        origin_field: "observed_object_refs",
        evidence_refs: supporting_evidence_refs,
        notes: [
          "Reference relation derived from observed_object_refs.",
        ],
      });
    }

    for (const target_object_id of get_array_refs(record.object_refs)) {
      relations.push({
        relation_type: "references",
        source_object_id: record.object_id,
        target_object_id,
        origin: "reference",
        origin_field: "object_refs",
        evidence_refs: supporting_evidence_refs,
        notes: [
          "Reference relation derived from object_refs.",
        ],
      });
    }

    return relations;
  }

  upsert_project_node(
    request: UpsertProjectNodeRequest
  ): RuntimePsgNodeRecord {
    const project_id = this.assert_project_id(request.record.project_id);
    const registry_entry = this.get_registry_entry(request.record.object_type);
    const node_record = build_node_record(request.record, registry_entry);
    const graph_state = this.load_or_create_project_graph(project_id);
    const node_map = new Map(
      graph_state.node_records.map((node) => [node.object_id, node])
    );

    node_map.set(node_record.object_id, node_record);

    return this.write_project_graph({
      ...graph_state,
      graph_revision: graph_state.graph_revision + 1,
      updated_at: get_record_time(request.record),
      node_records: [...node_map.values()],
    }).node_records.find((node) => node.object_id === node_record.object_id)!;
  }

  create_project_relation(
    request: CreateProjectRelationRequest
  ): RuntimePsgRelationEdge {
    const graph_state = this.load_or_create_project_graph(request.project_id);
    const node_map = new Map(
      graph_state.node_records.map((node) => [node.object_id, node])
    );
    const source_node = node_map.get(request.source_object_id);
    const target_node = node_map.get(request.target_object_id);

    if (!source_node || !target_node) {
      throw new Error(
        `Cannot create PSG relation without source and target nodes in project ${request.project_id}`
      );
    }

    this.assert_relation_allowed(source_node.object_type, request.relation_type);
    const relation_id = create_relation_id(request);
    const relation_edge: RuntimePsgRelationEdge = {
      relation_id,
      project_id: request.project_id,
      relation_type: request.relation_type,
      source_object_id: request.source_object_id,
      source_object_type: source_node.object_type,
      target_object_id: request.target_object_id,
      target_object_type: target_node.object_type,
      status: "active",
      created_at: graph_state.updated_at,
      origin: request.origin,
      origin_field: request.origin_field,
      source_lineage_object_ids: source_node.source_object_ids,
      evidence_refs: unique_ids(request.evidence_refs ?? []),
      export_class: "runtime_private_non_exportable",
      notes: [
        ...(request.notes ?? []),
        "PSG edge remains runtime-private and is not an MPLP-native export object.",
      ],
    };
    const edge_map = new Map(
      graph_state.relation_edges.map((edge) => [edge.relation_id, edge])
    );

    edge_map.set(relation_id, relation_edge);

    return this.write_project_graph({
      ...graph_state,
      graph_revision: graph_state.graph_revision + 1,
      relation_edges: [...edge_map.values()],
    }).relation_edges.find((edge) => edge.relation_id === relation_id)!;
  }

  ingest_runtime_objects(
    request: IngestRuntimeObjectsRequest
  ): PsgIngestResult {
    const previous_graph = this.inspect_project_graph(request.project_id) ??
      create_empty_graph_state(request.project_id);
    const affected_node_ids = new Set<string>();
    const affected_relation_ids = new Set<string>();
    const notes = [
      "PSG first pass ingested project-scoped runtime objects into a runtime-private semantic relation substrate.",
    ];

    for (const record of request.object_records) {
      if (record.project_id !== request.project_id) {
        continue;
      }

      const node = this.upsert_project_node({
        record,
      });
      affected_node_ids.add(node.object_id);
    }

    for (const record of request.object_records) {
      if (record.project_id !== request.project_id) {
        continue;
      }

      for (const relation of this.collect_derived_relations(record)) {
        try {
          const edge = this.create_project_relation({
            project_id: request.project_id,
            relation_type: relation.relation_type,
            source_object_id: relation.source_object_id,
            target_object_id: relation.target_object_id,
            origin: relation.origin,
            origin_field: relation.origin_field,
            evidence_refs: relation.evidence_refs,
            notes: relation.notes,
          });
          affected_relation_ids.add(edge.relation_id);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          notes.push(
            `Skipped one derived relation because the target node was not currently available: ${message}`
          );
        }
      }
    }

    const graph_state = this.inspect_project_graph(request.project_id) ??
      create_empty_graph_state(request.project_id);

    return {
      graph_state,
      update_summary: create_update_summary({
        graph_state,
        previous_node_count: previous_graph.node_records.length,
        previous_edge_count: previous_graph.relation_edges.length,
        affected_node_ids,
        affected_relation_ids,
        notes,
      }),
    };
  }

  inspect_project_graph(
    project_id: string
  ): RuntimePsgGraphState | undefined {
    const graph_state = this.psg_store.load(project_id);
    return graph_state ? sort_graph_state(graph_state) : undefined;
  }
}
