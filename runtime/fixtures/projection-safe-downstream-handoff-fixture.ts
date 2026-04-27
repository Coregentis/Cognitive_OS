import { FrozenBindingService } from "../core/binding-service.ts";
import {
  create_error_insufficiency_posture,
  type ErrorInsufficiencyPosture,
} from "../core/error-insufficiency-posture.ts";
import {
  build_projection_safe_runtime_envelope_from_records,
} from "../core/projection-safe-runtime-envelope-builder.ts";
import type { ProjectionSafeEnvelope } from "../core/projection-safe-envelope.ts";
import type { RuntimeObjectRecord } from "../core/runtime-types.ts";
import {
  create_state_snapshot_posture,
  type StateSnapshotPosture,
} from "../core/state-snapshot-posture.ts";
import {
  create_transaction_export_posture,
  type TransactionExportPosture,
} from "../core/transaction-export-posture.ts";

export type ProjectionSafeDownstreamHandoffFixture = {
  fixture_id: string;
  consumer_kind: "projection_consumer";
  handoff_surface: "downstream_projection";
  projection_safe_runtime_envelope: ProjectionSafeEnvelope;
  state_snapshot_posture: StateSnapshotPosture;
  transaction_export_posture: TransactionExportPosture;
  error_insufficiency_posture: ErrorInsufficiencyPosture;
  consumption_notes: string[];
  runtime_private_fields_omitted: true;
  non_executing: true;
};

const PROJECT_ID = "00000000-0000-4000-8000-720000000001";

export function create_representative_handoff_runtime_records(): RuntimeObjectRecord[] {
  return [
    {
      object_id: "project_ref_01",
      object_type: "project",
      authority_class: "coregentis_private_runtime",
      primary_layer: "cognitive_runtime_core",
      status: "active",
      project_id: PROJECT_ID,
      temporal: {},
      mutation: {},
      lineage: {},
      governance: {},
    },
    {
      object_id: "trace_evidence_ref_01",
      object_type: "trace-evidence",
      authority_class: "runtime_bound",
      primary_layer: "cognitive_runtime_core",
      status: "active",
      project_id: PROJECT_ID,
      protocol_binding_ref: {
        binding_class: "runtime_bound",
        protocol_object_type: "mplp-trace",
        protocol_object_id: "trace_ref_01",
        reconstructable: true,
      },
      temporal: {},
      mutation: {},
      lineage: {},
      governance: {},
    },
  ];
}

export function create_projection_safe_downstream_handoff_fixture(
  repo_root: string
): ProjectionSafeDownstreamHandoffFixture {
  const binding_service = FrozenBindingService.from_repo_root(repo_root);
  const safe_evidence_refs = [
    {
      evidence_ref: "trace_evidence_ref_01",
      evidence_kind: "trace_summary",
      summary: "Bounded evidence reference for projection handoff.",
    },
  ];

  const projection_safe_runtime_envelope =
    build_projection_safe_runtime_envelope_from_records({
      projection_envelope_id: "handoff_projection_envelope_01",
      runtime_object_records: create_representative_handoff_runtime_records(),
      binding_service,
      safe_evidence_refs,
      omission_markers: [
        {
          marker: "downstream_handoff_uses_safe_refs_only",
          reason: "The handoff fixture is consumable without raw runtime object payloads.",
        },
      ],
      product_boundary_notices: [
        "Downstream projection may render these summaries without defining runtime or protocol law.",
      ],
      created_at: "2026-04-27T00:00:00.000Z",
    });

  return {
    fixture_id: "projection_safe_downstream_handoff_fixture_01",
    consumer_kind: "projection_consumer",
    handoff_surface: "downstream_projection",
    projection_safe_runtime_envelope,
    state_snapshot_posture: create_state_snapshot_posture({
      posture_id: "state_snapshot_posture_01",
      continuity_ref: "continuity_ref_01",
      snapshot_ref: "snapshot_ref_01",
      restore_posture: "restorable",
      source_refs: ["project_ref_01", "trace_evidence_ref_01"],
      safe_evidence_refs,
      user_safe_summary: "Continuation and snapshot posture are available as bounded references.",
    }),
    transaction_export_posture: create_transaction_export_posture({
      posture_id: "transaction_export_posture_01",
      transaction_status: "exported_snapshot",
      export_consistency_posture: "consistent",
      deterministic_snapshot_boundary_summary:
        "Export posture is tied to a deterministic snapshot boundary summary.",
      safe_evidence_refs,
      user_safe_summary: "Export consistency is represented without a distributed transaction claim.",
    }),
    error_insufficiency_posture: create_error_insufficiency_posture({
      posture_id: "error_insufficiency_posture_01",
      status: "recoverable",
      safe_evidence_refs,
      user_safe_summary: "No blocking insufficiency is present for this neutral handoff fixture.",
    }),
    consumption_notes: [
      "Projection consumer reads envelope summaries, posture links, safe evidence references, omission markers, and version references.",
      "Projection consumer does not need direct MPLP internals or raw runtime-private records.",
    ],
    runtime_private_fields_omitted: true,
    non_executing: true,
  };
}
