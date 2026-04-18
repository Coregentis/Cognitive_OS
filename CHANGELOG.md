# Changelog

All notable repository-level changes for `Cognitive_OS` should be recorded in this file.

## Unreleased

- added a first-pass VSL continuity substrate with project-scoped checkpoints, continuation-anchor recovery, and bounded replay / rollback / retention horizon metadata over the current minimal runtime
- kept that VSL wave explicitly below full VSL realization, full storage completion, replay/rollback execution, product DTO semantics, and protocol-law promotion
- added a first-pass PSG semantic relation substrate with project-scoped graph state, typed runtime-private edges, lineage/evidence-aware graph inspection, and bounded graph-update summaries over the current minimal runtime
- kept that PSG wave explicitly below full PSG realization, graph database commitments, MPLP graph export semantics, product DTO semantics, and protocol-law promotion
- added the first bounded MPLP reconstruction/export path on top of the runnable minimal loop, with lawful `Confirm` / `Trace` reconstruction, explicit `Context` / `Plan` omissions, and locked-schema validation over frozen import/binding/export truth
- kept that Wave 3 export path explicitly below full protocol reconstruction, full MPLP interoperability guarantees, product semantics, and protocol-law promotion
- added the first runnable Wave 2 delta-intent / requirement-change minimal cognitive loop path with structured reconcile outcomes, real drift usage, and conditional conflict creation only when explicit reconcile tension is present
- kept that Wave 2 runnable-path upgrade explicitly below full conflict-engine behavior, rollback/compensation behavior, product semantics, and protocol-law promotion
- added the first runnable Wave 1 fresh-intent minimal cognitive loop path with deterministic in-memory semantic placement and bounded reconcile assessment
- kept that runnable-path wave explicitly below full runtime realization, workflow-engine semantics, and protocol-law promotion
- completed an upstream boundary review for current downstream packet-state pressure and recorded that no new workflow-truth family is adopted in `Cognitive_OS` now
- kept that boundary wave governance-only and explicitly out of scope for new runtime behavior, new object families, schema change, and protocol-law promotion
- hardened the internal symmetry and schema/runtime-core consistency of the runtime-private management-object family without adding new runtime behavior, product behavior, or protocol law
- added a bounded `v0.4` workforce/runtime-private closure pack, multi-cell runtime boundary closure pack, cross-repo consumption/non-promotion closure pack, and a formal workforce runtime closure record
- kept that closure wave governance-only and explicitly out of scope for new runtime behavior, new product behavior, schema or binding changes, and protocol-law promotion
- added the first machine-readable runtime-private `v0.4` workforce preconditions for bounded cell scope, summary, directive, delivery-return, and approval-request records
- updated registry, binding, export, runtime-type, and frozen-truth loading surfaces for those runtime-private objects without claiming protocol law or full portfolio runtime behavior
- performed a `v0.4` foundation reality refresh, added SoloCrew-driven runtime blocker intake and precondition docs, and did not claim full runtime expansion or product implementation
- execution baseline R7 governance closure aligned
- first executable mother-runtime baseline now present rather than schema/binding/skeleton-only
- public remote verification surfaces aligned with the current P0-A mother-runtime baseline
- public control-plane files touched again to force a single BAT-verifiable remote truth on `main`
- neutral workforce schema family added under `schemas/coregentis/v0/workforce/`
- runtime truth extended for workforce object registry, binding, and export classification
- worker lifecycle runtime, workforce state persistence ports/adapters, and execution bridge contracts added
- bounded P0-B glue added for action dispatch, objective anchor, correction capture, and preference write-back
- projection handoff readiness pack added to freeze current integration boundaries for downstream consumption
- runtime baseline aligned to `Node 22 LTS`
- deterministic neutral fixture support present for:
  - `fresh-intent`
  - `requirement-change-midflow`
- deterministic minimal cognitive loop present:
  - `Form -> Place -> Activate -> Confirm -> Trace -> Reconcile -> Consolidate`
- canonical runtime command surface present:
  - `npm run test:runtime`
  - `npm run coverage:runtime`
- bounded export / omission / validation surface present for the current mother-runtime baseline
- no remote release truth is claimed yet in this environment

## v0.1.0 - Mother Runtime Foundation Baseline

Planned release only.

Current repository contents for the planned `v0.1.0` baseline:

- repository governance baseline
- repository versioning and release baseline
- testing and coverage gate baseline
- repository baseline seal record
- import lock baseline
- Coregentis base schema layer
- Coregentis object schema layer
- Coregentis registry layer
- Coregentis binding layer
- first executable mother-runtime baseline
- neutral fixture support for `fresh-intent` and `requirement-change-midflow`
- deterministic minimal cognitive loop harness
- canonical runtime test / coverage command surface
- bounded export / omission / validation surface

Not implied by this planned entry:

- remote git release truth
- full runtime completion
- full AEL / VSL / PSG realization
- full policy engine
- full confirm workflow richness
- full trace export
- full MPLP artifact export completeness
- full MPLP interoperability guarantee
- TracePilot runtime
- product / projection / DTO / UI implementation
