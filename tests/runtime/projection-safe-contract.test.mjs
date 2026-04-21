import test from "node:test";
import assert from "node:assert/strict";

import { DeterministicProjectionService } from "../../runtime/core/projection-service.ts";
import {
  FORBIDDEN_PROJECTION_ACTION_LABELS,
  FORBIDDEN_PROJECTION_RAW_KEYS,
} from "../../runtime/core/projection-types.ts";
import { InMemoryProjectionStore } from "../../runtime/in-memory/projection-store.ts";

function createStateExposureInput(overrides = {}) {
  return {
    projection_id: "projection_state_01",
    project_id: "00000000-0000-4000-8000-710000000001",
    source_runtime_ref: "runtime_ref_01",
    state_summary: {
      initial_state: "state_initial",
      transition_event: "event_transition",
      requested_next_state: "state_requested",
      evaluated_next_state: "state_evaluated",
      transition_accepted: true,
      final_state: "state_final",
      terminal: false,
    },
    created_at: "2026-04-20T00:00:00.000Z",
    ...overrides,
  };
}

function createEvidenceInput(overrides = {}) {
  return {
    evidence_summary_id: "evidence_summary_01",
    project_id: "00000000-0000-4000-8000-710000000001",
    evidence_refs: [
      "evidence_ref_02",
      "evidence_ref_01",
    ],
    evidence_summary: "bounded evidence summary",
    stale: false,
    insufficient: false,
    created_at: "2026-04-20T00:00:00.000Z",
    ...overrides,
  };
}

function createRecommendationInput(overrides = {}) {
  return {
    recommendation_id: "recommendation_01",
    project_id: "00000000-0000-4000-8000-710000000001",
    recommendation_summary: "bounded recommendation summary",
    recommended_next_posture: "review_posture",
    allowed_next_step: "bounded_next_step",
    created_at: "2026-04-20T00:00:00.000Z",
    ...overrides,
  };
}

function createProjectionSummary(service, overrides = {}) {
  const state_exposure = service.create_state_exposure(createStateExposureInput());
  const evidence_posture = service.create_evidence_posture_summary(createEvidenceInput());
  const recommendation = service.create_non_executing_recommendation(
    createRecommendationInput()
  );

  return service.create_projection_summary_envelope({
    projection_summary_id: "projection_summary_01",
    project_id: "00000000-0000-4000-8000-710000000001",
    state_exposure,
    evidence_posture,
    recommendation,
    source_refs: [
      "source_ref_02",
      "source_ref_01",
    ],
    created_at: "2026-04-20T00:00:00.000Z",
    ...overrides,
  });
}

function createEvidenceInsufficiencyInput(overrides = {}) {
  return {
    detail_id: "evidence_detail_01",
    project_id: "00000000-0000-4000-8000-710000000001",
    evidence_available: false,
    insufficient: true,
    stale: false,
    insufficiency_category: "missing_required_context",
    omission_reason: "bounded omission",
    required_evidence_class: "context_summary",
    safe_evidence_refs: ["safe_ref_02", "safe_ref_01"],
    safe_clarification_prompt: "Provide additional bounded context summary.",
    non_executing: true,
    runtime_private_fields_omitted: true,
    ...overrides,
  };
}

function createProjectionRevisionInput(service, overrides = {}) {
  return {
    revision_id: "projection_revision_01",
    project_id: "00000000-0000-4000-8000-710000000001",
    previous_projection_summary_id: "projection_summary_01",
    revision_reason: "insufficient_evidence",
    revision_input_summary: "bounded revision input summary",
    evidence_insufficiency:
      service.create_evidence_insufficiency_detail(createEvidenceInsufficiencyInput()),
    resulting_projection_summary_id: "projection_summary_02",
    non_executing: true,
    runtime_private_fields_omitted: true,
    ...overrides,
  };
}

test("[runtime] projection-safe contracts create deterministic state exposure summary", () => {
  const service = new DeterministicProjectionService();
  const input = createStateExposureInput({
    projection_id: undefined,
  });

  const first = service.create_state_exposure(input);
  const second = service.create_state_exposure(input);

  assert.deepEqual(first, second);
  assert.equal(first.non_executing, true);
});

test("[runtime] projection-safe contracts preserve transition_accepted as state evaluation, not approval", () => {
  const service = new DeterministicProjectionService();
  const summary = service.create_state_exposure(createStateExposureInput());

  assert.equal(summary.state_summary.transition_accepted, true);
  assert.equal(
    summary.interpretation.transition_accepted_meaning,
    "state evaluation accepted, not approval"
  );
});

test("[runtime] projection-safe contracts preserve terminal as state-line terminal, not execution complete", () => {
  const service = new DeterministicProjectionService();
  const summary = service.create_state_exposure(
    createStateExposureInput({
      state_summary: {
        ...createStateExposureInput().state_summary,
        terminal: true,
      },
    })
  );

  assert.equal(summary.state_summary.terminal, true);
  assert.equal(
    summary.interpretation.terminal_meaning,
    "state line terminal, not execution complete"
  );
});

test("[runtime] projection-safe contracts create evidence posture summary without proof semantics", () => {
  const service = new DeterministicProjectionService();
  const summary = service.create_evidence_posture_summary(createEvidenceInput());

  assert.equal(summary.evidence_available, true);
  assert.deepEqual(summary.evidence_refs, ["evidence_ref_01", "evidence_ref_02"]);
  assert.equal(
    summary.interpretation.evidence_summary_meaning,
    "summary, not proof or certification"
  );
});

test("[runtime] projection-safe contracts mark stale and insufficient evidence distinctly", () => {
  const service = new DeterministicProjectionService();
  const summary = service.create_evidence_posture_summary(
    createEvidenceInput({
      stale: true,
      insufficient: true,
      confidence_posture: "stale",
      omission_reason: "bounded omission",
    })
  );

  assert.equal(summary.stale, true);
  assert.equal(summary.insufficient, true);
  assert.equal(summary.confidence_posture, "stale");
  assert.equal(summary.omission_reason, "bounded omission");
});

test("[runtime] projection-safe contracts create non-executing recommendation envelope", () => {
  const service = new DeterministicProjectionService();
  const recommendation = service.create_non_executing_recommendation(
    createRecommendationInput()
  );

  assert.equal(recommendation.non_executing, true);
  assert.equal(recommendation.requires_later_authorization, true);
  assert.deepEqual(recommendation.blocked_actions, [
    "approve",
    "reject",
    "dispatch",
    "execute",
    "provider_channel_send",
  ]);
});

test("[runtime] projection-safe contracts block forbidden action labels as inputs", () => {
  const service = new DeterministicProjectionService();

  for (const forbidden_action of FORBIDDEN_PROJECTION_ACTION_LABELS) {
    assert.throws(() =>
      service.create_non_executing_recommendation(
        createRecommendationInput({
          blocked_actions: [forbidden_action],
        })
      )
    );
  }
});

test("[runtime] projection-safe contracts create projection summary envelope without raw runtime internals", () => {
  const service = new DeterministicProjectionService();
  const summary = createProjectionSummary(service);

  assert.equal(summary.non_executing, true);
  assert.equal(summary.runtime_private_fields_omitted, true);
  assert.deepEqual(summary.source_refs, ["source_ref_01", "source_ref_02"]);
});

test("[runtime] projection-safe contracts reject raw runtime-like keys", () => {
  const service = new DeterministicProjectionService();

  for (const forbidden_key of FORBIDDEN_PROJECTION_RAW_KEYS) {
    assert.throws(() =>
      service.create_projection_summary_envelope({
        ...createProjectionSummary(service),
        [forbidden_key]: "forbidden",
      })
    );
  }
});

test("[runtime] projection-safe contracts reject envelope with mismatched state_exposure.project_id", () => {
  const service = new DeterministicProjectionService();
  const invalid = {
    ...createProjectionSummary(service),
    state_exposure: service.create_state_exposure(
      createStateExposureInput({
        project_id: "00000000-0000-4000-8000-710000000099",
      })
    ),
  };

  assert.throws(() =>
    service.create_projection_summary_envelope({
      ...invalid,
    })
  );

  assert.deepEqual(service.validate_projection_summary(invalid), {
    valid: false,
    errors: ["state_exposure.project_id must match envelope project_id"],
  });
});

test("[runtime] projection-safe contracts reject envelope with mismatched evidence_posture.project_id", () => {
  const service = new DeterministicProjectionService();
  const invalid = {
    ...createProjectionSummary(service),
    evidence_posture: service.create_evidence_posture_summary(
      createEvidenceInput({
        project_id: "00000000-0000-4000-8000-710000000099",
      })
    ),
  };

  assert.throws(() =>
    service.create_projection_summary_envelope({
      ...invalid,
    })
  );

  assert.deepEqual(service.validate_projection_summary(invalid), {
    valid: false,
    errors: ["evidence_posture.project_id must match envelope project_id"],
  });
});

test("[runtime] projection-safe contracts reject envelope with mismatched recommendation.project_id", () => {
  const service = new DeterministicProjectionService();
  const invalid = {
    ...createProjectionSummary(service),
    recommendation: service.create_non_executing_recommendation(
      createRecommendationInput({
        project_id: "00000000-0000-4000-8000-710000000099",
      })
    ),
  };

  assert.throws(() =>
    service.create_projection_summary_envelope({
      ...invalid,
    })
  );

  assert.deepEqual(service.validate_projection_summary(invalid), {
    valid: false,
    errors: ["recommendation.project_id must match envelope project_id"],
  });
});

test("[runtime] projection-safe contracts preserve project isolation in projection store", () => {
  const service = new DeterministicProjectionService();
  const store = new InMemoryProjectionStore();
  const alpha = createProjectionSummary(service, {
    projection_summary_id: "projection_summary_alpha",
    project_id: "00000000-0000-4000-8000-710000000010",
    state_exposure: service.create_state_exposure(
      createStateExposureInput({
        projection_id: "projection_state_alpha",
        project_id: "00000000-0000-4000-8000-710000000010",
      })
    ),
    evidence_posture: service.create_evidence_posture_summary(
      createEvidenceInput({
        evidence_summary_id: "evidence_summary_alpha",
        project_id: "00000000-0000-4000-8000-710000000010",
      })
    ),
    recommendation: service.create_non_executing_recommendation(
      createRecommendationInput({
        recommendation_id: "recommendation_alpha",
        project_id: "00000000-0000-4000-8000-710000000010",
      })
    ),
  });
  const beta = createProjectionSummary(service, {
    projection_summary_id: "projection_summary_beta",
    project_id: "00000000-0000-4000-8000-710000000020",
    state_exposure: service.create_state_exposure(
      createStateExposureInput({
        projection_id: "projection_state_beta",
        project_id: "00000000-0000-4000-8000-710000000020",
      })
    ),
    evidence_posture: service.create_evidence_posture_summary(
      createEvidenceInput({
        evidence_summary_id: "evidence_summary_beta",
        project_id: "00000000-0000-4000-8000-710000000020",
      })
    ),
    recommendation: service.create_non_executing_recommendation(
      createRecommendationInput({
        recommendation_id: "recommendation_beta",
        project_id: "00000000-0000-4000-8000-710000000020",
      })
    ),
  });

  store.put_projection_summary(alpha.project_id, alpha);
  store.put_projection_summary(beta.project_id, beta);

  assert.deepEqual(
    store.list_projection_summaries(alpha.project_id).map(
      (summary) => summary.projection_summary_id
    ),
    ["projection_summary_alpha"]
  );
  assert.equal(
    store.get_projection_summary(beta.project_id, "projection_summary_beta")
      ?.project_id,
    "00000000-0000-4000-8000-710000000020"
  );
});

test("[runtime] projection-safe contracts avoid downstream product object references", () => {
  const service = new DeterministicProjectionService();
  const summary = createProjectionSummary(service);
  const serialized = JSON.stringify(summary);

  assert.doesNotMatch(
    serialized,
    /product_dto|product_projection_layer|route_path|page_mount/u
  );
});

test("[runtime] projection-safe contracts are JSON-serializable", () => {
  const service = new DeterministicProjectionService();
  const summary = createProjectionSummary(service);
  const serialized = JSON.stringify(summary);
  const parsed = JSON.parse(serialized);
  const validation = service.validate_projection_summary(parsed);

  assert.equal(typeof serialized, "string");
  assert.equal(parsed.runtime_private_fields_omitted, true);
  assert.deepEqual(validation, {
    valid: true,
    errors: [],
  });
});

test("[runtime] projection-safe contracts create valid evidence insufficiency detail", () => {
  const service = new DeterministicProjectionService();
  const detail = service.create_evidence_insufficiency_detail(
    createEvidenceInsufficiencyInput()
  );

  assert.equal(detail.detail_id, "evidence_detail_01");
  assert.equal(detail.project_id, "00000000-0000-4000-8000-710000000001");
  assert.equal(detail.non_executing, true);
  assert.equal(detail.runtime_private_fields_omitted, true);
  assert.deepEqual(detail.safe_evidence_refs, ["safe_ref_01", "safe_ref_02"]);
});

test("[runtime] projection-safe contracts validate valid evidence insufficiency detail", () => {
  const service = new DeterministicProjectionService();
  const detail = service.create_evidence_insufficiency_detail(
    createEvidenceInsufficiencyInput()
  );

  assert.deepEqual(service.validate_evidence_insufficiency_detail(detail), {
    valid: true,
    errors: [],
  });
});

test("[runtime] projection-safe contracts reject missing detail_id", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_evidence_insufficiency_detail(
      createEvidenceInsufficiencyInput({
        detail_id: "",
      })
    ),
    {
      valid: false,
      errors: ["detail_id is required"],
    }
  );
});

test("[runtime] projection-safe contracts reject evidence insufficiency non_executing false", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_evidence_insufficiency_detail({
      ...createEvidenceInsufficiencyInput(),
      non_executing: false,
    }),
    {
      valid: false,
      errors: ["non_executing must be true"],
    }
  );
});

test("[runtime] projection-safe contracts reject evidence insufficiency runtime_private_fields_omitted false", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_evidence_insufficiency_detail({
      ...createEvidenceInsufficiencyInput(),
      runtime_private_fields_omitted: false,
    }),
    {
      valid: false,
      errors: ["runtime_private_fields_omitted must be true"],
    }
  );
});

test("[runtime] projection-safe contracts reject invalid insufficiency_category", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_evidence_insufficiency_detail({
      ...createEvidenceInsufficiencyInput(),
      insufficiency_category: "invalid_category",
    }),
    {
      valid: false,
      errors: [
        "insufficiency_category must be one of missing_required_context, stale_context, conflicting_evidence, runtime_private_omitted, other",
      ],
    }
  );
});

test("[runtime] projection-safe contracts reject safe_evidence_refs when not array", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_evidence_insufficiency_detail({
      ...createEvidenceInsufficiencyInput(),
      safe_evidence_refs: "not_array",
    }),
    {
      valid: false,
      errors: ["safe_evidence_refs must be an array"],
    }
  );
});

test("[runtime] projection-safe contracts reject raw runtime-like keys in evidence detail", () => {
  const service = new DeterministicProjectionService();

  assert.throws(() =>
    service.create_evidence_insufficiency_detail({
      ...createEvidenceInsufficiencyInput(),
      raw_vsl: "forbidden",
    })
  );
});

test("[runtime] projection-safe contracts reject forbidden action labels in evidence detail", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_evidence_insufficiency_detail({
      ...createEvidenceInsufficiencyInput(),
      safe_clarification_prompt: "approved",
    }),
    {
      valid: false,
      errors: ["forbidden action label at detail.safe_clarification_prompt: approved"],
    }
  );
});

test("[runtime] projection-safe contracts create valid projection revision envelope", () => {
  const service = new DeterministicProjectionService();
  const envelope = service.create_projection_revision_envelope(
    createProjectionRevisionInput(service)
  );

  assert.equal(envelope.revision_id, "projection_revision_01");
  assert.equal(envelope.previous_projection_summary_id, "projection_summary_01");
  assert.equal(envelope.revision_reason, "insufficient_evidence");
  assert.equal(envelope.non_executing, true);
  assert.equal(envelope.runtime_private_fields_omitted, true);
});

test("[runtime] projection-safe contracts validate valid projection revision envelope", () => {
  const service = new DeterministicProjectionService();
  const envelope = service.create_projection_revision_envelope(
    createProjectionRevisionInput(service)
  );

  assert.deepEqual(service.validate_projection_revision_envelope(envelope), {
    valid: true,
    errors: [],
  });
});

test("[runtime] projection-safe contracts reject missing previous_projection_summary_id", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_projection_revision_envelope({
      ...createProjectionRevisionInput(service),
      previous_projection_summary_id: "",
    }),
    {
      valid: false,
      errors: ["previous_projection_summary_id is required"],
    }
  );
});

test("[runtime] projection-safe contracts reject invalid revision_reason", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_projection_revision_envelope({
      ...createProjectionRevisionInput(service),
      revision_reason: "invalid_reason",
    }),
    {
      valid: false,
      errors: [
        "revision_reason must be one of insufficient_evidence, stale_context, operator_clarification, contract_blocked, other",
      ],
    }
  );
});

test("[runtime] projection-safe contracts reject evidence_insufficiency project mismatch", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_projection_revision_envelope({
      ...createProjectionRevisionInput(service),
      evidence_insufficiency: service.create_evidence_insufficiency_detail(
        createEvidenceInsufficiencyInput({
          project_id: "00000000-0000-4000-8000-710000000099",
        })
      ),
    }),
    {
      valid: false,
      errors: ["evidence_insufficiency.project_id must match revision project_id"],
    }
  );
});

test("[runtime] projection-safe contracts reject raw runtime-like keys in revision envelope", () => {
  const service = new DeterministicProjectionService();

  assert.throws(() =>
    service.create_projection_revision_envelope({
      ...createProjectionRevisionInput(service),
      raw_trace: "forbidden",
    })
  );
});

test("[runtime] projection-safe contracts reject forbidden action labels in revision envelope", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_projection_revision_envelope({
      ...createProjectionRevisionInput(service),
      revision_input_summary: "dispatch",
    }),
    {
      valid: false,
      errors: ["forbidden action label at revision.revision_input_summary: dispatch"],
    }
  );
});

test("[runtime] projection-safe contracts reject provider/channel or queue semantics in revision surfaces", () => {
  const service = new DeterministicProjectionService();

  assert.deepEqual(
    service.validate_projection_revision_envelope({
      ...createProjectionRevisionInput(service),
      revision_input_summary: "provider/channel execution available",
    }),
    {
      valid: false,
      errors: ["provider/channel execution is not allowed"],
    }
  );

  assert.deepEqual(
    service.validate_evidence_insufficiency_detail({
      ...createEvidenceInsufficiencyInput(),
      safe_clarification_prompt: "queue implementation available",
    }),
    {
      valid: false,
      errors: ["queue implementation is not allowed"],
    }
  );
});

test("[runtime] projection-safe contracts preserve safe_evidence_refs only", () => {
  const service = new DeterministicProjectionService();
  const detail = service.create_evidence_insufficiency_detail(
    createEvidenceInsufficiencyInput({
      safe_evidence_refs: ["safe_ref_03", "safe_ref_01", "safe_ref_01"],
    })
  );

  assert.deepEqual(detail.safe_evidence_refs, ["safe_ref_01", "safe_ref_03"]);
});

test("[runtime] projection-safe contracts store persists and retrieves revision envelope", () => {
  const service = new DeterministicProjectionService();
  const store = new InMemoryProjectionStore();
  const alpha = service.create_projection_revision_envelope(
    createProjectionRevisionInput(service, {
      revision_id: "projection_revision_alpha",
      project_id: "00000000-0000-4000-8000-710000000010",
      previous_projection_summary_id: "projection_summary_alpha",
      evidence_insufficiency: service.create_evidence_insufficiency_detail(
        createEvidenceInsufficiencyInput({
          detail_id: "evidence_detail_alpha",
          project_id: "00000000-0000-4000-8000-710000000010",
        })
      ),
    })
  );
  const beta = service.create_projection_revision_envelope(
    createProjectionRevisionInput(service, {
      revision_id: "projection_revision_beta",
      project_id: "00000000-0000-4000-8000-710000000020",
      previous_projection_summary_id: "projection_summary_beta",
      evidence_insufficiency: service.create_evidence_insufficiency_detail(
        createEvidenceInsufficiencyInput({
          detail_id: "evidence_detail_beta",
          project_id: "00000000-0000-4000-8000-710000000020",
        })
      ),
    })
  );

  store.put_projection_revision_envelope(alpha);
  store.put_projection_revision_envelope(beta);

  assert.deepEqual(
    store.list_projection_revision_envelopes(alpha.project_id).map(
      (envelope) => envelope.revision_id
    ),
    ["projection_revision_alpha"]
  );
  assert.equal(
    store.get_projection_revision_envelope(
      beta.project_id,
      "projection_revision_beta"
    )?.project_id,
    "00000000-0000-4000-8000-710000000020"
  );
});
