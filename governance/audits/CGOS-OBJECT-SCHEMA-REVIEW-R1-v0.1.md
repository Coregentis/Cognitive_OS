# CGOS-OBJECT-SCHEMA-REVIEW-R1-v0.1

## Purpose

This memo is the Round 1 completeness review for the first-batch Coregentis object schemas under:

- `/schemas/coregentis/v0/objects/`

This round does not try to freeze consistency or trim minimality.
It asks a narrower question:

Is the drafted first-batch object family complete enough to support:

- the minimal cognitive loop
- the next registry phase
- the next binding phase
- the next runtime skeleton phase

without yet expanding into product, TracePilot, or enterprise-specific work?

## Scope

Reviewed schemas:

- `project`
- `external-input-record`
- `intent`
- `delta-intent`
- `working-state-node`
- `episode`
- `semantic-fact`
- `activation-signal`
- `action-unit`
- `policy-rule`
- `confirm-gate`
- `trace-evidence`
- `decision-record`
- `drift-record`
- `conflict-case`
- `memory-promotion-record`
- `learning-candidate`

This review does not patch schemas.
It does not create registry, binding, runtime, or TracePilot artifacts.

## Family-Level Completeness Assessment

### Current family shape

The object family currently covers the full minimum loop:

- `Form`
  - `external-input-record`
  - `intent`
  - `delta-intent`
- `Place`
  - `working-state-node`
  - `episode`
  - `semantic-fact`
- `Activate`
  - `activation-signal`
  - `action-unit`
- `Confirm`
  - `policy-rule`
  - `confirm-gate`
- `Trace`
  - `trace-evidence`
  - `decision-record`
- `Reconcile`
  - `drift-record`
  - `conflict-case`
- `Consolidate`
  - `memory-promotion-record`
  - `learning-candidate`

`project` provides the single-project-first scope anchor across the whole family.

### Completeness judgment

The first-batch family is directionally complete enough to continue into R2.

It is not fully mature yet, but it is complete enough for the next review phase because:

- no major loop stage is unrepresented
- no first-order object family is missing entirely
- the objects are typed distinctly enough to support later registry and runtime planning

### Is any first-batch object missing entirely?

No fatal object is missing for this phase.

Possible later additions that are not blockers for R2:

- `clarification-unit`
- `authority-binding`
- `suppression-marker`
- `rollback-boundary`
- `compensation-plan`
- `learning-sample`

These are valid later candidates, but their absence does not prevent the current first-batch family from entering R2.

### Is any current object premature?

No object is clearly premature enough to remove now.

The most borderline objects are:

- `project`
- `policy-rule`
- `semantic-fact`

But each is justified:

- `project` anchors single-project-first runtime scope
- `policy-rule` is required because policy is constitutional
- `semantic-fact` is required because semantic memory is constitutional

## Object-by-Object Review

### 1. `project`

- constitutional/runtime role served:
  - runtime scope anchor for single-project-first mother-runtime work
- why it belongs in first batch:
  - later objects need a common project boundary before multi-project is ever introduced
- sufficiently defined for this phase:
  - mostly yes
- essential field missing:
  - probably a stable `project_code` or `slug` is not required yet
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - indirect but clear as host scope
- recommended action:
  - `keep`

### 2. `external-input-record`

- constitutional/runtime role served:
  - raw intake anchor before governed cognition
- why it belongs in first batch:
  - `Form` cannot be evidence-grade without preserving source intake separately from intent
- sufficiently defined for this phase:
  - yes
- essential field missing:
  - a stronger source identity field may be useful later, but not required now
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - clear for `Form`
- recommended action:
  - `keep`

### 3. `intent`

- constitutional/runtime role served:
  - governed entry controller object for new cognition
- why it belongs in first batch:
  - the runtime constitution explicitly centers intent at entry
- sufficiently defined for this phase:
  - mostly yes
- essential field missing:
  - a stronger target or subject reference could help later runtime planning
- authority classification direction:
  - directionally correct as `runtime_bound`
- minimal loop relation clarity:
  - very clear for `Form`
- recommended action:
  - `clarify`

### 4. `delta-intent`

- constitutional/runtime role served:
  - governed change object against existing intent state
- why it belongs in first batch:
  - requirement-change and correction paths depend on it
- sufficiently defined for this phase:
  - mostly yes
- essential field missing:
  - perhaps an explicit `change_basis_ref` or prior-state anchor beyond `base_intent_id`
- authority classification direction:
  - directionally correct as `runtime_bound`
- minimal loop relation clarity:
  - very clear for change-aware `Form` and `Reconcile`
- recommended action:
  - `clarify`

### 5. `working-state-node`

- constitutional/runtime role served:
  - working-memory carrier for live cognition
- why it belongs in first batch:
  - `Place` needs a typed working-memory object
- sufficiently defined for this phase:
  - yes
- essential field missing:
  - explicit memory placement need not be added because base-layer memory placement was intentionally deferred
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - clear for `Place`
- recommended action:
  - `keep`

### 6. `episode`

- constitutional/runtime role served:
  - bounded episodic-memory and replay container
- why it belongs in first batch:
  - resumption, replay, and later explanation depend on it
- sufficiently defined for this phase:
  - mostly yes
- essential field missing:
  - optional participant or actor refs may help later, but not required now
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - clear for `Place` and later `Trace`
- recommended action:
  - `keep`

### 7. `semantic-fact`

- constitutional/runtime role served:
  - durable retained truth anchor in semantic memory
- why it belongs in first batch:
  - semantic memory is not optional in the runtime constitution
- sufficiently defined for this phase:
  - mostly yes
- essential field missing:
  - possibly an explicit relation or provenance strength field later
- authority classification direction:
  - directionally acceptable as `coregentis_private_runtime`, though this may deserve later classification review
- minimal loop relation clarity:
  - clear for `Place` and `Consolidate`
- recommended action:
  - `reclassify later`

### 8. `activation-signal`

- constitutional/runtime role served:
  - bounded activation request under governed activation
- why it belongs in first batch:
  - `Activate` cannot remain implicit
- sufficiently defined for this phase:
  - yes
- essential field missing:
  - no blocker
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - very clear for `Activate`
- recommended action:
  - `keep`

### 9. `action-unit`

- constitutional/runtime role served:
  - bounded executable target for activation
- why it belongs in first batch:
  - activation without an executable unit would remain underspecified
- sufficiently defined for this phase:
  - yes
- essential field missing:
  - maybe explicit execution envelope linkage later, but not required now
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - clear for `Activate`
- recommended action:
  - `keep`

### 10. `policy-rule`

- constitutional/runtime role served:
  - explicit policy law object
- why it belongs in first batch:
  - policy is constitutional, not a later convenience feature
- sufficiently defined for this phase:
  - mostly yes
- essential field missing:
  - a stronger condition structure is absent, but acceptable for this pre-runtime draft
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - clear for `Confirm`, `Activate`, `Reconcile`, and `Consolidate`
- recommended action:
  - `expand slightly`

### 11. `confirm-gate`

- constitutional/runtime role served:
  - runtime-bound confirm object tied to approval mechanics
- why it belongs in first batch:
  - `Confirm` cannot remain implicit
- sufficiently defined for this phase:
  - mostly yes
- essential field missing:
  - perhaps a clearer decision actor or resolver field beyond `requested_by_ref`
- authority classification direction:
  - directionally correct as `runtime_bound`
- minimal loop relation clarity:
  - very clear for `Confirm`
- recommended action:
  - `clarify`

### 12. `trace-evidence`

- constitutional/runtime role served:
  - evidence-grade runtime trace object with protocol-relevant linkage
- why it belongs in first batch:
  - `Trace` and evidence recoverability are constitutional invariants
- sufficiently defined for this phase:
  - mostly yes
- essential field missing:
  - perhaps explicit trace root identifier or evidence chain linkage later
- authority classification direction:
  - directionally correct as `runtime_bound`
- minimal loop relation clarity:
  - very clear for `Trace`
- recommended action:
  - `clarify`

### 13. `decision-record`

- constitutional/runtime role served:
  - explicit decision artifact for meaningful runtime choices
- why it belongs in first batch:
  - trust and explanation depend on it
- sufficiently defined for this phase:
  - yes
- essential field missing:
  - no blocker
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - clear for `Trace` and `Reconcile`
- recommended action:
  - `keep`

### 14. `drift-record`

- constitutional/runtime role served:
  - explicit divergence artifact before or alongside conflict handling
- why it belongs in first batch:
  - the architecture treats drift as first-class, not as logging noise
- sufficiently defined for this phase:
  - mostly yes
- essential field missing:
  - likely a stronger detection basis field later
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - clear for `Reconcile`
- recommended action:
  - `clarify`

### 15. `conflict-case`

- constitutional/runtime role served:
  - typed runtime collision object
- why it belongs in first batch:
  - `Reconcile` cannot proceed with generic errors only
- sufficiently defined for this phase:
  - mostly yes
- essential field missing:
  - maybe explicit conflict severity or impact scope later
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - very clear for `Reconcile`
- recommended action:
  - `expand slightly`

### 16. `memory-promotion-record`

- constitutional/runtime role served:
  - governed record of promotion across memory layers
- why it belongs in first batch:
  - layered memory law requires explicit upward movement, not silent mutation
- sufficiently defined for this phase:
  - yes
- essential field missing:
  - perhaps evidence refs later, but not required now
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - clear for `Consolidate`
- recommended action:
  - `keep`

### 17. `learning-candidate`

- constitutional/runtime role served:
  - governed pre-consolidation learning capture
- why it belongs in first batch:
  - enough to close the minimal loop without overbuilding learning
- sufficiently defined for this phase:
  - yes
- essential field missing:
  - no blocker
- authority classification direction:
  - correct as `coregentis_private_runtime`
- minimal loop relation clarity:
  - very clear for `Consolidate`
- recommended action:
  - `keep`

## Top 10 Completeness Findings Across the Family

1. The 17-object family covers every stage of the minimal cognitive loop. There is no fatal gap at the family level.
2. The family correctly distinguishes intake, intent, memory, action, governance, evidence, conflict, promotion, and learning instead of collapsing them into a generic runtime blob.
3. `Intent`, `Delta Intent`, `Confirm Gate`, and `Trace Evidence` are directionally classified correctly as `runtime_bound`, but their exact protocol-binding semantics should be revisited after the binding phase begins.
4. `Semantic Fact` is present, which is necessary, but its classification may deserve review later once the binding matrix clarifies how protocol-derived durable truth should be labeled.
5. `Policy Rule` is necessary in the first batch, but it is still structurally light; later review should decide whether it needs a richer condition/evaluation shape.
6. `Conflict Case` is present and justified, but it likely needs richer impact/resolution structure in a later round.
7. `Drift Record` is present and justified, but later rounds may need a clearer detection-basis or comparison-basis field.
8. `Project` is correctly included and not premature, because the family needs a scope anchor even before multi-project features exist.
9. No first-order projection pollution is visible. The object family remains mother-runtime-oriented and does not leak TracePilot object vocabulary.
10. The family is complete enough to continue into R2, but several schemas need clarification rather than expansion, especially the runtime-bound ones.

## Open Family-Level Questions for Later Rounds

- Should `semantic-fact` remain `coregentis_private_runtime`, or become more explicitly runtime-bound in some cases?
- Should `policy-rule` later separate rule declaration from rule condition structure?
- Should `confirm-gate` and `trace-evidence` gain stronger mandatory reconstructability hints?
- Should `conflict-case` and `drift-record` later distinguish impact scope and confidence more explicitly?
- Should a later object round introduce:
  - `clarification-unit`
  - `authority-binding`
  - `suppression-marker`
  - `rollback-boundary`
  - `compensation-plan`

These are valid later questions, but none block movement into R2.

## Continue Decision

Decision:

The current first-batch object family is complete enough to continue into R2.

Reason:

- the family is loop-complete
- no fatal first-batch object is missing
- no current object is clearly misplaced enough to halt review progression
- the remaining issues are clarification and structure-depth questions, not family-completeness failures

## Review Boundary Confirmation

This step is review-only.

It does not:

- patch object schemas
- create registry files
- create binding files
- create runtime files
- create TracePilot files
