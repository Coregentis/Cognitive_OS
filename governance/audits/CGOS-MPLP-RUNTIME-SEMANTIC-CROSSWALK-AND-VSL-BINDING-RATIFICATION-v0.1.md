# CGOS-MPLP-RUNTIME-SEMANTIC-CROSSWALK-AND-VSL-BINDING-RATIFICATION-v0.1

## A. Purpose

This audit exists because runtime features must not be invented from downstream
product pressure or from runtime nouns alone.

The required order remains:

- MPLP truth source
- Cognitive_OS binding and registry classification
- bounded runtime realization
- only later downstream projection

This document therefore does four narrow things:

- cross-check current MPLP truth for `VSL`, `AEL`, `PSG`, `Learning`, and
  `Delta Intent / Drift / Conflict`
- classify how those concepts should be read inside `Cognitive_OS`
- ratify whether the just-added `VSL first pass` wave is lawful
- freeze the implementation gate template that later runtime-substrate waves
  must satisfy before code changes proceed

## B. MPLP Truth-Source Findings

### 1. VSL

Current MPLP truth read:

- `VSL` does **not** appear as a protocol-native top-level schema object in
  `schemas/v2/mplp-context.schema.json`,
  `schemas/v2/mplp-plan.schema.json`,
  `schemas/v2/mplp-confirm.schema.json`, or
  `schemas/v2/mplp-trace.schema.json`.
- `VSL` does appear in MPLP runtime documentation as an informative runtime
  persistence abstraction.
- `VSL` is therefore absent from MPLP protocol core object law and belongs to
  downstream runtime realization.

Exact evidence:

- `MPLP-Protocol/README.md`
  - MPLP is "Not a framework. Not a runtime. Not a platform."
- `MPLP-Protocol/docs/docs/guides/runtime/vsl.md`
  - says VSL is a "runtime persistence abstraction"
  - says it "does not define a protocol object"
  - says VSL is "not itself a protocol truth source"
- `MPLP-Protocol/docs/docs/guides/runtime/index.mdx`
  - labels runtime guides as informative only
- absence from:
  - `MPLP-Protocol/schemas/v2/mplp-context.schema.json`
  - `MPLP-Protocol/schemas/v2/mplp-plan.schema.json`
  - `MPLP-Protocol/schemas/v2/mplp-confirm.schema.json`
  - `MPLP-Protocol/schemas/v2/mplp-trace.schema.json`

### 2. AEL

Current MPLP truth read:

- `AEL` does **not** appear as a protocol-native top-level schema object.
- `AEL` does appear in MPLP runtime documentation as an informative runtime
  execution abstraction.
- MPLP does define protocol-level execution evidence families such as
  `runtime_execution`, but that is not the same thing as making `AEL` a
  protocol-native object.
- `AEL` therefore belongs to downstream runtime realization and may emit
  protocol-relevant evidence.

Exact evidence:

- `MPLP-Protocol/docs/docs/guides/runtime/ael.md`
  - says AEL is a "runtime execution abstraction"
  - says AEL is "not a protocol schema object"
- `MPLP-Protocol/docs/docs/guides/runtime/runtime-authority.md`
  - says runtimes may execute and emit evidence but do not define protocol
    truth
- `MPLP-Protocol/schemas/v2/events/mplp-runtime-execution-event.schema.json`
  - defines `RuntimeExecutionEvent`
- `MPLP-Protocol/schemas/v2/taxonomy/event-taxonomy.yaml`
  - includes `runtime_execution` as a recommended event family
- absence from the four top-level MPLP module schemas listed above

### 3. PSG

Current MPLP truth read:

- `PSG` does **not** appear as a protocol-native top-level schema object.
- `PSG` does appear as an informative runtime logical state model in MPLP
  runtime documentation.
- MPLP does define protocol-level graph-oriented evidence via
  `graph_update` event taxonomy and schema.
- `PSG` therefore belongs to downstream runtime realization, while
  `graph_update` remains the protocol-facing evidence family.

Exact evidence:

- `MPLP-Protocol/docs/docs/guides/runtime/psg.md`
  - says PSG is a "runtime concept and logical state model"
  - says PSG is "not a separate L0 schema object"
- `MPLP-Protocol/docs/docs/guides/runtime/crosscut-psg-event-binding.md`
  - describes PSG/event relations illustratively, not as canonical PSG law
- `MPLP-Protocol/schemas/v2/events/mplp-graph-update-event.schema.json`
  - defines `GraphUpdateEvent`
- `MPLP-Protocol/schemas/v2/taxonomy/event-taxonomy.yaml`
  - marks `graph_update` as required
- absence from the four top-level MPLP module schemas listed above

### 4. Learning

Current MPLP truth read:

- `Learning` is not a top-level MPLP core module like `Context`, `Plan`,
  `Confirm`, or `Trace`.
- MPLP **does** define protocol-facing learning sample schemas and a learning
  taxonomy.
- MPLP therefore owns the shape of learning samples and learning-oriented event
  collection references, but it does **not** automatically own a full runtime
  learning or consolidation engine.
- runtime consolidation, candidate scoring, promotion, and local preference
  writeback remain downstream runtime concerns unless separately promoted.

Exact evidence:

- `MPLP-Protocol/schemas/v2/common/learning-sample.schema.json`
  - defines a structured learning sample surface
- `MPLP-Protocol/schemas/v2/learning/mplp-learning-sample-core.schema.json`
  - defines `LearningSample` core structure
- `MPLP-Protocol/schemas/v2/learning/mplp-learning-sample-intent.schema.json`
  - defines `intent_resolution`
- `MPLP-Protocol/schemas/v2/learning/mplp-learning-sample-delta.schema.json`
  - defines `delta_impact`
- `MPLP-Protocol/schemas/v2/taxonomy/learning-taxonomy.yaml`
  - defines sample families and collection points
- `MPLP-Protocol/docs/docs/guides/examples/learning-notes/*`
  - treats learning as sample capture and collection guidance rather than a
    mandated runtime engine

### 5. Delta Intent / Drift / Conflict

Current MPLP truth read:

- `delta_intent` does appear in MPLP as an event family and as learning-sample
  input vocabulary.
- `impact_analysis` and `compensation_plan` also appear as protocol-level event
  families.
- `drift` appears in MPLP runtime documentation as a runtime-observed
  discrepancy, not as a protocol-native top-level object.
- `conflict` does not appear as a protocol-native schema object in the current
  MPLP core module schemas.
- Therefore:
  - protocol-native top-level object law is absent for `delta-intent`,
    `drift-record`, and `conflict-case`
  - protocol-level semantic duty / event / evidence concepts exist for
    `delta_intent`, `impact_analysis`, `graph_update`, `runtime_execution`, and
    `compensation_plan`
  - Coregentis runtime objects for delta/drift/conflict remain downstream
    runtime realization unless schema proves otherwise

Exact evidence:

- `MPLP-Protocol/schemas/v2/taxonomy/event-taxonomy.yaml`
  - includes `delta_intent`, `impact_analysis`, and `compensation_plan`
- `MPLP-Protocol/schemas/v2/events/mplp-event-core.schema.json`
  - includes those event families in the core enum
- `MPLP-Protocol/schemas/v2/common/learning-sample.schema.json`
  - includes `delta_intents`
- `MPLP-Protocol/schemas/v2/learning/mplp-learning-sample-delta.schema.json`
  - includes `delta_id`, `intent_id`, impact scope, compensation and rollback
    fields
- `MPLP-Protocol/docs/docs/guides/runtime/drift-and-rollback.md`
  - says drift is a runtime-observed discrepancy
  - says the page "does not define new protocol requirements or introduce new
    protocol event types"
- no top-level protocol schema file defines `delta-intent`, `drift-record`, or
  `conflict-case` as MPLP-native objects

## C. Cognitive_OS Binding Classification

### 1. VSL

Binding classification:

- `Coregentis-private runtime`

Reason:

- current `Cognitive_OS` binding matrix and registry classify the substrate
  through runtime-private objects and hints, not as protocol-native law
- `RuntimeVslContinuityState` and `RuntimeVslStore` live only in
  `runtime/core/runtime-types.ts`
  and are not first-class MPLP objects or export surfaces

Evidence:

- `Cognitive_OS/runtime/core/runtime-types.ts`
  - VSL continuity types exist only as runtime-private TypeScript types
- `Cognitive_OS/runtime/core/vsl-service.ts`
  - continuity checkpointing is runtime-private
- `Cognitive_OS/bindings/mplp-coregentis-binding-matrix.v0.yaml`
  - multiple durable objects carry `runtime_substrate_hint: "vsl"` only as
    informative annotation
- `Cognitive_OS/imports/mplp-lock.yaml`
  - says protocol import does not import runtime law

### 2. AEL

Binding classification:

- `Coregentis-private runtime`

Reason:

- current activation/runtime objects are internal execution/governance objects
- they may emit protocol-relevant evidence later, but they are not MPLP-native
  objects

Evidence:

- `Cognitive_OS/bindings/mplp-coregentis-binding-matrix.v0.yaml`
  - `activation-signal` and `action-unit` are `runtime_private_only`
  - both are tagged with `runtime_substrate_hint: "ael"`
- `Cognitive_OS/registry/coregentis-object-registry.v0.yaml`
  - `activation-signal` and `action-unit` have
    `authority_class: "coregentis_private_runtime"`

### 3. PSG

Binding classification:

- `Coregentis-private runtime`

Reason:

- current `Cognitive_OS` uses PSG only as substrate hint / runtime concept
- protocol-bound artifacts may be organized through PSG-like runtime structures,
  but PSG itself is not encoded as MPLP schema law here

Evidence:

- `Cognitive_OS/bindings/mplp-coregentis-binding-matrix.v0.yaml`
  - `intent`, `delta-intent`, `working-state-node`, and `semantic-fact` are
    tied to `psg` as runtime hint, not as protocol-native schema promotion
- `Cognitive_OS/runtime/core/runtime-types.ts`
  - substrate hints are explicitly informational

### 4. Learning

Binding classification:

- mixed
  - protocol-facing learning samples = `runtime-bound` only at the level of
    later derived export targets, not present as current top-level Coregentis
    objects
  - current `learning-candidate` and consolidation path = `Coregentis-private
    runtime`

Reason:

- MPLP defines learning sample shapes
- current `Cognitive_OS` only has internal pre-consolidation capture objects,
  not canonical MPLP learning sample export

Evidence:

- `Cognitive_OS/bindings/mplp-coregentis-binding-matrix.v0.yaml`
  - `learning-candidate` is `export_restricted_internal`
  - export rule says it may contribute to later derived learning-sample output
- `Cognitive_OS/registry/coregentis-object-registry.v0.yaml`
  - `learning-candidate` has
    `authority_class: "coregentis_private_runtime"`
- `Cognitive_OS/runtime/core/runtime-types.ts`
  - no protocol-native learning object type exists

### 5. Delta Intent / Drift / Conflict

Binding classification:

- `delta-intent` = `runtime-bound`
- `drift-record` = `Coregentis-private runtime`
- `conflict-case` = `Coregentis-private runtime`

Reason:

- `delta-intent` is explicitly protocol-adjacent in the binding matrix because
  MPLP has `delta_intent` event-family semantics
- `drift-record` and `conflict-case` remain runtime-private governance/reconcile
  objects
- none of them are currently MPLP-native top-level schema objects

Evidence:

- `Cognitive_OS/bindings/mplp-coregentis-binding-matrix.v0.yaml`
  - `delta-intent` is `protocol_adjacent_but_not_exportable`
  - `drift-record` is `runtime_private_only`
  - `conflict-case` is `runtime_private_only`
- `Cognitive_OS/registry/coregentis-object-registry.v0.yaml`
  - `delta-intent` has `authority_class: "runtime_bound"`
  - `drift-record` and `conflict-case` have
    `authority_class: "coregentis_private_runtime"`

## D. VSL First-Pass Ratification

### What the VSL wave lawfully adds

The current `VSL first pass` lawfully adds:

- explicit project-scoped continuity state
- continuation-anchor recovery by project
- replay / rollback / retention horizon metadata
- runtime-private checkpointing over the existing bounded minimal loop
- no product DTO dependence

Evidence:

- `Cognitive_OS/governance/plans/CGOS-VSL-FIRST-PASS-PLAN-v0.1.md`
- `Cognitive_OS/runtime/core/vsl-service.ts`
- `Cognitive_OS/runtime/in-memory/vsl-store.ts`
- `Cognitive_OS/runtime/core/runtime-types.ts`
- `Cognitive_OS/tests/runtime/vsl-first-pass.test.mjs`

### What it must not claim

The current VSL wave must not claim:

- full VSL realization
- production durability
- replay engine behavior
- rollback execution behavior
- retention enforcement
- protocol-native VSL object law
- downstream product semantics

Evidence:

- `Cognitive_OS/governance/plans/CGOS-VSL-FIRST-PASS-PLAN-v0.1.md`
- `Cognitive_OS/runtime/in-memory/README.md`
- `Cognitive_OS/runtime/core/README.md`
- `MPLP-Protocol/docs/docs/guides/runtime/vsl.md`

### Whether it needs an additional binding matrix entry

Judgment:

- no additional binding matrix entry is required for this wave

Reason:

- `VSL` in this wave is a runtime-private substrate/service/store concept, not a
  new first-class Coregentis object family and not an MPLP-native artifact
- the current binding matrix already classifies the affected object families and
  carries `runtime_substrate_hint` for VSL-shaped durable state

### Whether it needs registry clarification

Judgment:

- no immediate registry change is required for this wave

Reason:

- the wave added runtime-private continuity substrate types rather than new
  registry-tracked object schemas
- if future VSL work promotes continuity checkpoints into first-class governed
  Coregentis objects, a later schema + registry + binding wave will be needed

### Whether current tests are sufficient for this wave

Judgment:

- `PASS WITH FOLLOW-UP`

Current sufficient coverage:

- continuity state write/read back
- project isolation
- deterministic continuation-anchor recovery
- replay / rollback / retention metadata preservation
- no SoloCrew/product DTO dependence
- full runtime suite still passing

Evidence:

- `Cognitive_OS/tests/runtime/vsl-first-pass.test.mjs`
- `Cognitive_OS/runtime/core/vsl-service.ts`

### Further test gaps that still exist

Remaining gaps:

- no test yet checks how continuity behaves across bounded
  `requirement-change-midflow` drift path
- no test yet checks continuity revision bump across repeated checkpoints within
  the same project
- no exportability-negative test explicitly states that VSL continuity state is
  not part of MPLP export surfaces

Those gaps do not invalidate `VSL first pass`, but they should be addressed in
later substrate or export-guard waves.

## E. Implementation Gate Template For Future Waves

### 1. AEL first pass

Pre-implementation checklist:

- MPLP schema check
  - confirm no MPLP top-level schema object makes AEL protocol-native
- MPLP event/evidence check
  - inspect `runtime_execution`, `pipeline_stage`, `confirm`, and `trace`
    evidence obligations
- Cognitive_OS binding class
  - classify any new AEL objects as `coregentis_private_runtime` unless schema
    proves otherwise
- registry/object ownership
  - decide whether any new AEL structures are first-class objects or only
    service-layer internals
- exportability
  - define which evidence may be exported and which execution objects remain
    non-exportable
- product projection allowance
  - confirm no SoloCrew-facing execution DTO or control-plane law is being
    invented upstream
- non-goals
  - no provider lock-in
  - no product workflow law
  - no runtime truth invented from UI pressure
- test minimums
  - bounded execution object creation
  - policy/confirm interaction coverage
  - protocol evidence surface coverage
  - negative tests for non-exportable internal execution objects

### 2. PSG first pass

Pre-implementation checklist:

- MPLP schema check
  - confirm PSG remains non-native to MPLP core object schemas
- MPLP event/evidence check
  - inspect `graph_update`, `trace`, and related observability duties
- Cognitive_OS binding class
  - classify PSG structures as `coregentis_private_runtime`
- registry/object ownership
  - decide whether graph nodes/edges are first-class Coregentis objects or only
    runtime-local substrate structures
- exportability
  - ensure only protocol-relevant graph evidence is exported, not local graph
    internals
- product projection allowance
  - confirm no product card, summary, or operating DTO is treated as PSG law
- non-goals
  - no canonical graph database doctrine
  - no automatic promotion of local graph structures into protocol truth
- test minimums
  - identity/linkage correctness
  - graph_update evidence coverage
  - drift-supporting relation coverage
  - negative tests for non-exportable PSG internals

### 3. Delta Drift expansion

Pre-implementation checklist:

- MPLP schema check
  - confirm `delta_intent` exists as event/taxonomy concept but not as
    top-level MPLP-native object law
- MPLP event/evidence check
  - inspect `delta_intent`, `impact_analysis`, `graph_update`,
    `compensation_plan`, `trace`
- Cognitive_OS binding class
  - preserve `delta-intent` as runtime-bound and `drift-record` /
    `conflict-case` as runtime-private unless upstream truth changes
- registry/object ownership
  - decide whether new drift/conflict helper structures need schema/registry
    promotion or remain service-layer only
- exportability
  - define only derived/exportable evidence, not direct export of local
    `drift-record` / `conflict-case`
- product projection allowance
  - confirm SoloCrew cannot consume raw drift/conflict runtime objects directly
    without projection contracts
- non-goals
  - no canonical drift event invented upstream
  - no canonical conflict doctrine invented from runtime convenience
- test minimums
  - typed drift/conflict creation
  - evidence lineage
  - recovery/continue/review branching
  - negative tests for non-protocol-native object export

### 4. Governed Learning first pass

Pre-implementation checklist:

- MPLP schema check
  - inspect learning sample schemas and learning taxonomy first
- MPLP event/evidence check
  - inspect collection points and event families that seed learning samples
- Cognitive_OS binding class
  - keep internal consolidation/candidate/promotion engine runtime-private
  - treat MPLP learning sample shapes as downstream derived/export targets only
- registry/object ownership
  - decide whether new learning records are first-class objects or only
    consolidation/service structures
- exportability
  - explicitly define which learning outputs may be exported as MPLP-shaped
    samples and which remain internal
- product projection allowance
  - no product preference or recommendation surface may redefine learning law
- non-goals
  - no silent promotion of local learned patterns into protocol or policy truth
  - no ungoverned writeback loop
- test minimums
  - candidate capture
  - consolidation gating
  - derived sample-shape validation if export exists
  - negative tests for non-exportable internal learning objects

## F. Boundary Conclusion

Final judgment:

- `VSL first pass` can stand if ratified
- this audit ratifies it as lawful `PASS WITH FOLLOW-UP`
- no further runtime substrate wave should proceed without this crosswalk
  template
- `SoloCrew` must not consume these raw runtime constructs directly until
  explicit projection contracts exist

Net frozen conclusion:

- MPLP remains protocol/schema/invariant/event-taxonomy authority only
- runtime substrate nouns do not become protocol law by convenience
- `Cognitive_OS` must classify substrate work before implementing it
- downstream product pressure must not back-define runtime substrate semantics
