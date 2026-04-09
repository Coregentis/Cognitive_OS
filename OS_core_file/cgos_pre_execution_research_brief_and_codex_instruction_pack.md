# Coregentis Cognitive OS — Pre-Execution Research Brief v0.1

## Document Control

- **Document ID**: CGOS-PRE-EXECUTION-RESEARCH-BRIEF-v0.1
- **Status**: Draft Execution-Governance Baseline
- **Authority**: Coregentis Pre-Execution Governance Brief
- **Scope**: Defines the pre-execution research phase, mandatory inputs, forbidden shortcuts, required outputs, file placement rules, naming rules, and management order for the next-stage Cognitive OS implementation planning work
- **Depends On**:
  - MPLP Protocol v1.0.0
  - Coregentis Cognitive OS — Master Architecture Baseline v0.1
  - Coregentis Cognitive OS — MPLP Binding Spec v0.1
  - Coregentis Cognitive OS — Runtime Constitution Spec v0.1
  - Coregentis Cognitive OS — Product Projection Baseline v0.1
  - Coregentis Cognitive OS — Cognitive Object Registry Baseline v0.1
  - TracePilot — Product Projection Baseline v0.1
  - TracePilot — M0 First Wow Moment & Validation Spec v0.1
  - TracePilot — M0 Death Paths & Failure Matrix v0.1
  - TracePilot — M0 Validation Interview Framework v0.1
  - TracePilot — M0 Scenario Pack v0.1
  - TracePilot — M0 Success Metrics & Evidence Model v0.1
- **Trace Tags**:
  - `coregentis/pre-execution`
  - `research-brief`
  - `schema-first`
  - `runtime-skeleton-first`
  - `codex-instruction-pack`

---

# 1. Purpose

This document defines the **pre-execution research phase** for Coregentis Cognitive OS and the corresponding **instruction package** for Codex.

Its purpose is to prevent incorrect sequence execution at the moment when the project must transition from mother-architecture freezing into repository truth reading, asset inventory, gap analysis, schema planning, and minimal runtime skeleton planning.

This document exists because the project must not drift into any of the following:

- product-first implementation
- TracePilot-first runtime invention
- UI-first pseudo-progress
- ad hoc object creation
- protocol/runtime/product boundary collapse
- architecture-free repo hacking

This document is therefore a **phase-governance and execution-order brief**, not a product PRD and not a coding task by itself.

---

# 2. Canonical Phase Definition

## 2.1 Current Phase

The project is now in the following phase:

**Mother-architecture frozen → Pre-execution research and implementation planning phase**

## 2.2 What This Phase Is For

This phase exists to:

- read the real repository and asset truth
- normalize all currently authoritative inputs
- identify what already exists and can be reused
- identify the exact missing implementation gaps
- define the first-batch core schemas
- define the machine-readable object/binding layer requirements
- define the minimal Cognitive OS runtime skeleton
- define the readiness boundary before TracePilot implementation work may legitimately begin

## 2.3 What This Phase Is Not For

This phase does **not** exist to:

- build TracePilot UI
- design product cards or workflow screens as if they are runtime truth
- directly code product features before schema and runtime skeleton exist
- invent a TracePilot-native runtime
- rewrite mother architecture because of short-term convenience

---

# 3. Fixed Architectural Order

The following order is non-negotiable and must be preserved in all research and planning work:

**MPLP Protocol Constitution → Coregentis Cognitive OS → Product Projections → TracePilot**

## 3.1 Implication

- MPLP remains the protocol constitution.
- Coregentis remains the mother runtime/governance substrate.
- Product projections remain profiled surfaces of the runtime.
- TracePilot remains the first developer-facing projection.

## 3.2 Forbidden Reversal

The following reversals are forbidden:

- product redefining runtime law
- runtime redefining protocol law
- projection convenience being silently promoted into constitutional truth

---

# 4. Why Pre-Execution Research Must Happen Before Implementation

The current architecture and validation baselines are sufficiently developed at the constitutional level.

However, the project still lacks certainty in the following areas:

- actual repository truth versus document truth
- reusable implementation assets versus documentation-only concepts
- minimal first-batch schema boundaries
- machine-readable object registry realization
- machine-readable MPLP↔Coregentis binding realization
- minimal runnable Cognitive OS skeleton

Therefore, coding must not start from assumptions.
It must start from a governed truth-reading and planning pass.

---

# 5. Mandatory Inputs for This Phase

All pre-execution research work must begin from the following input categories.

## 5.1 Category A — Mother Architecture Baselines

Required documents:

1. Coregentis Cognitive OS — Master Architecture Baseline v0.1
2. Coregentis Cognitive OS — MPLP Binding Spec v0.1
3. Coregentis Cognitive OS — Runtime Constitution Spec v0.1
4. Coregentis Cognitive OS — Product Projection Baseline v0.1
5. Coregentis Cognitive OS — Cognitive Object Registry Baseline v0.1

## 5.2 Category B — TracePilot Projection and M0 Validation Baselines

Required documents:

6. TracePilot — Product Projection Baseline v0.1
7. TracePilot — M0 First Wow Moment & Validation Spec v0.1
8. TracePilot — M0 Death Paths & Failure Matrix v0.1
9. TracePilot — M0 Validation Interview Framework v0.1
10. TracePilot — M0 Scenario Pack v0.1
11. TracePilot — M0 Success Metrics & Evidence Model v0.1

## 5.3 Category C — Repository Truth Sources

Required repositories and asset domains:

- current Cognitive_OS repository/workspace
- current MPLP repository/workspace
- current MPLP schemas, invariants, taxonomy, tests, validator, and examples
- any already existing Coregentis or TracePilot implementation-related files in the current working environment

---

# 6. Core Research Questions

The pre-execution phase must answer the following questions.

## 6.1 Asset Truth Questions

- What already exists in the repo?
- What is reusable immediately?
- What is only conceptual/document-level?
- What is stale, weak, partial, or non-authoritative?

## 6.2 Schema Questions

- What are the first-batch Coregentis core schemas that must exist first?
- Which objects must be first-class machine-readable objects before any product work?
- Which protocol-bound concepts need explicit runtime mapping first?

## 6.3 Binding Questions

- What exact MPLP↔Coregentis mapping matrix must exist before runtime work is legitimate?
- Which current concepts are protocol-native, runtime-bound, Coregentis-private, product-projected, or derived?

## 6.4 Runtime Skeleton Questions

- What is the smallest legitimate Coregentis runtime skeleton?
- What is the minimal object/service/event/state set required to run the minimal cognitive loop?

## 6.5 TracePilot Readiness Questions

- What must be completed before TracePilot runtime/profile work is meaningful?
- Which TracePilot work is safe to do now?
- Which TracePilot work would currently be architectural drift?

---

# 7. Mandatory Sequence Rules

The correct implementation-planning order for this phase is frozen as follows.

## 7.1 Sequence

1. repo truth reading and normalization
2. source-of-truth identification and reuse classification
3. gap analysis
4. core schema first-batch recommendation
5. object registry machine-readable realization planning
6. MPLP↔Coregentis binding matrix realization planning
7. minimal runtime skeleton planning
8. minimal cognitive loop implementation planning
9. TracePilot readiness boundary definition
10. only then: TracePilot-specific runtime/profile planning

## 7.2 Sequence Rule

No output may recommend skipping core schemas, object registry, or binding matrix in order to move faster into TracePilot product work.

---

# 8. Explicitly Forbidden Actions in This Phase

The following actions are forbidden during this phase unless explicitly approved later.

## 8.1 Product-First Actions

- building TracePilot UI first
- building task cards or workflow surfaces as if they define runtime truth
- implementing product objects before runtime objects are fixed

## 8.2 Runtime Shortcut Actions

- implementing a generic undifferentiated memory store and calling it Cognitive OS
- skipping machine-readable object registry realization
- skipping binding matrix realization
- skipping evidence/trace model requirements
- skipping conflict/drift objects in favor of generic logs or errors

## 8.3 Boundary-Violating Actions

- treating product convenience as constitutional runtime law
- treating runtime-private helpers as protocol truth
- mutating mother runtime structure based on demo-only needs
- silently introducing new semantically important objects without registry review

---

# 9. Mandatory Research Outputs

The pre-execution research phase must produce the following outputs.

## 9.1 Executive Summary

A concise summary of:

- current state
- next correct implementation stage
- top priorities
- top things not to do yet

## 9.2 Frozen Truths / Non-Negotiables

A structured summary of:

- protocol truths
- runtime truths
- projection truths

## 9.3 Repository / Asset Inventory

A structured inventory of:

- what exists
- what is reusable
- what is partial or weak
- what is missing

## 9.4 Gap Analysis

A gap matrix including at minimum:

- core schema layer
- object registry implementation
- binding matrix implementation
- memory model implementation
- activation model implementation
- conflict/drift implementation
- learning/consolidation implementation
- policy profile implementation
- trace/evidence implementation
- minimal cognitive loop
- TracePilot projection prerequisites

## 9.5 Recommended Execution Order

A phase-by-phase plan explaining:

- objective
- why the phase belongs there
- required inputs
- expected outputs
- what explicitly waits

## 9.6 Minimal Core Schema Recommendation

A first-batch schema proposal including:

- exact object names
- protocol-bound vs Coregentis-private classification
- why each object belongs in the first batch

## 9.7 Minimal Runtime Skeleton Recommendation

A concrete recommendation for:

- minimal services/modules
- minimal state transitions
- minimal evidence emission
- minimal object movement across layers
- minimal cognitive loop realization

## 9.8 TracePilot Readiness Boundary

An explicit answer to:

- what must be finished before TracePilot runtime/profile work is meaningful
- what TracePilot work can safely start now
- what TracePilot work is premature

## 9.9 Architectural Risk List

A top-risk list focused on:

- drift risks
- wrong-sequence risks
- object pollution risks
- product/runtime collapse risks

## 9.10 Immediate Next-Step Plan

A concrete 1–2 week plan with repo/file/schema-level specificity where possible.

---

# 10. Required Output Discipline

## 10.1 Reality-First Rule

All claims must distinguish clearly between:

- what the architecture documents say
- what the repository actually contains
- what is inferred as the correct next step

## 10.2 No Generic Brainstorming Rule

Outputs must be concrete and execution-usable, not open-ended ideation.

## 10.3 Reuse-First Rule

Before recommending new files, schemas, modules, or structures, the research must first prove that existing assets are insufficient.

## 10.4 Schema-First Rule

Recommendations must prioritize:

- machine-readable schema truth
- object registry truth
- binding truth
- runtime skeleton truth

before product-profile implementation.

---

# 11. File Placement Rules

All outputs produced in or after this phase must be stored in an explicit governance structure.

## 11.1 Required Governance Structure

Recommended root structure:

/governance
  /briefs
  /research
  /plans
  /audits
  /templates

## 11.2 File Placement Rules

### Briefs
Store all upper-level governance and phase-control documents in:
- `/governance/briefs/`

### Research Outputs
Store repository truth, asset inventory, and gap analysis outputs in:
- `/governance/research/`

### Planning Outputs
Store phase execution plans and implementation sequencing plans in:
- `/governance/plans/`

### Audits
Store review and correction documents in:
- `/governance/audits/`

### Templates
Store reusable templates for future validation or decision memos in:
- `/governance/templates/`

---

# 12. Naming Rules

## 12.1 Naming Style

All governance/research/planning files must use:

- uppercase project prefix
- concise controlled title
- version suffix
- markdown file extension

## 12.2 Canonical Naming Pattern

`<PROJECT>-<DOCUMENT-TITLE>-v<MAJOR>.<MINOR>.md`

## 12.3 Immediate Required Filenames

This brief:
- `CGOS-PRE-EXECUTION-RESEARCH-BRIEF-v0.1.md`

Expected Codex research output options:
- `CGOS-ASSET-INVENTORY-AND-GAP-ANALYSIS-v0.1.md`
- `CGOS-IMPLEMENTATION-EXECUTION-PLAN-v0.1.md`

Optional split outputs if needed:
- `CGOS-ASSET-INVENTORY-v0.1.md`
- `CGOS-GAP-ANALYSIS-v0.1.md`
- `CGOS-MINIMAL-RUNTIME-SKELETON-PLAN-v0.1.md`
- `CGOS-TRACEPILOT-READINESS-BOUNDARY-v0.1.md`

---

# 13. Management Model

## 13.1 Authority Order

All outputs must preserve:

**MPLP Protocol Constitution → Coregentis Cognitive OS → Product Projections → TracePilot**

## 13.2 Document Role Separation

### Briefs
Upper-level constraints and phase governance. Not editable by execution agents unless explicitly requested.

### Research
Reality reading and gap identification. May evolve.

### Plans
Sequenced execution proposals. May evolve after audit.

### Audits
Architectural review, correction, and anti-drift control.

## 13.3 Non-Collapse Rule

Research documents may not silently rewrite architecture baselines.
They may only:

- read reality
- compare against baseline
- identify gaps
- recommend execution order

They may not redefine constitutional law.

---

# 14. Pre-Execution Completion Criteria

This phase should be considered complete only if all of the following are true.

## 14.1 Input Boundary Clarity

All authoritative input documents and repos are explicitly identified.

## 14.2 Asset Truth Clarity

Existing reusable and missing assets are clearly distinguished.

## 14.3 Sequence Clarity

The next implementation order is clear and schema-first/runtime-skeleton-first.

## 14.4 Forbidden Shortcut Clarity

The major incorrect next-step temptations are explicitly documented.

## 14.5 First-Batch Output Clarity

There is an agreed first-batch implementation focus on:

- core schema baseline
- object registry realization
- binding matrix realization
- minimal runtime skeleton
- minimal cognitive loop harness

If these are not all true, the project is not ready for implementation execution.

---

# 15. Required Codex Role in This Phase

Codex is NOT the authority that defines this phase.
Codex is the execution agent that performs research under this brief.

Codex must:

- read the documents first
- inspect repo truth second
- compare truth against baseline third
- produce structured research and execution planning outputs fourth

Codex must not:

- skip directly to building TracePilot
- invent product-native runtime logic
- redefine mother-runtime structure for convenience
- produce vague narrative analysis without concrete outputs

---

# 16. Freeze Statement

This document establishes the pre-execution research baseline for Coregentis Cognitive OS.

No implementation effort should be treated as architecturally valid unless it is preceded by:

- authoritative input reading
- repo truth reading
- asset inventory
- gap analysis
- schema-first planning
- minimal runtime skeleton planning
- TracePilot readiness boundary clarification

This phase is therefore frozen as a required bridge between mother-architecture completion and legitimate implementation execution.

---

# Codex Instruction Pack — Pre-Execution Research and Planning

## 1. Role

You are Codex, acting as a senior architecture researcher, runtime planner, and implementation strategist.

You are NOT being asked to start coding product features.
You are being asked to conduct a disciplined pre-execution research pass and produce execution-usable planning outputs.

## 2. What You Must Assume

Assume the following order is fixed and non-negotiable:

**MPLP Protocol Constitution → Coregentis Cognitive OS → Product Projections → TracePilot**

You must preserve that order in all reasoning.

## 3. Your Mission

Your mission is to:

1. read all authoritative architecture and validation documents
2. inspect the actual repository/assets
3. identify reusable truth and missing implementation pieces
4. define the correct schema-first and runtime-skeleton-first execution order
5. define what must exist before TracePilot runtime/profile implementation is meaningful

## 4. Documents You Must Read First

Read all authoritative documents listed in Section 5 of the brief before making any planning recommendation.

## 5. Required Repo Truth Reading

You must inspect:

- current Cognitive_OS repository/workspace
- current MPLP repository/workspace
- current MPLP schemas, tests, taxonomy, examples, validator surfaces
- any existing Coregentis or TracePilot implementation-related assets

Do not assume documents match code.
You must compare them.

## 6. Hard Constraints

You must obey all of the following:

1. do not redesign the constitutional architecture unless you find a direct contradiction
2. do not jump into TracePilot UI/feature work
3. do not treat product objects as runtime law
4. do not treat helper/runtime convenience surfaces as protocol law
5. do not skip schema/object/binding work
6. reuse existing assets wherever possible
7. explicitly justify any new file/module/schema you recommend
8. prioritize object-first, binding-first, schema-first, runtime-skeleton-first sequencing

## 7. Required Analysis Topics

You must explicitly analyze:

### A. MPLP ↔ Coregentis boundary
- which protocol-native concepts need immediate runtime mapping?
- which current concepts are clearly Coregentis-private?
- are the current bindings sufficiently specific for first implementation?

### B. Coregentis core schema requirements
- what are the first-batch core schemas?
- which objects must be first-class first?
- what relationship types are minimally required?
- which authority / temporal / mutation / lineage properties must be first-class?

### C. Minimal runtime skeleton
- what is the smallest legitimate Coregentis runtime skeleton?
- how should the minimal cognitive loop be realized first?
- what minimal modules / services / events / states are required?

### D. Existing asset reuse
- what already exists and is reusable?
- what should be treated as SSOT?
- what is weak, partial, stale, or misleading?

### E. TracePilot prerequisite boundary
- what must be complete before TracePilot runtime/profile work is meaningful?
- what TracePilot work can begin in parallel without damage?
- what TracePilot work is premature?

### F. Risk analysis
- what are the top architectural drift risks if implementation starts incorrectly?
- what are the most likely wrong-sequence mistakes?
- what should be explicitly forbidden in the first implementation stage?

## 8. Required Outputs

You must produce the following files.

### Required File 1
Path:
- `/governance/research/CGOS-ASSET-INVENTORY-AND-GAP-ANALYSIS-v0.1.md`

This file must contain:
- Executive Summary
- What Is Already Frozen / Non-Negotiable
- Repository / Asset Inventory
- Gap Analysis table
- Reuse assessment
- Top architectural risks

### Required File 2
Path:
- `/governance/plans/CGOS-IMPLEMENTATION-EXECUTION-PLAN-v0.1.md`

This file must contain:
- Recommended execution order
- minimal core schema first batch
- minimal runtime skeleton recommendation
- TracePilot readiness boundary
- immediate 1–2 week next-step plan

## 9. Output Format Requirements

In your outputs, you must distinguish clearly between:

- what the docs say
- what the repo actually has
- what you infer must be next

Be concrete.
Avoid generic architecture prose.
Prefer sharp prioritization over broad brainstorming.

## 10. Forbidden Outputs

Do not output:

- generic encouragement
- product ideation unrelated to current phase
- TracePilot UI speculation
- vague “future work” lists without priority
- recommendations that bypass schema/object/binding/runtimeskeleton sequencing

## 11. Final Verification Rule

Before finalizing your outputs, explicitly verify that your plan preserves:

**MPLP Protocol Constitution → Coregentis Cognitive OS → Product Projections → TracePilot**

If any part of your plan violates that order, revise it before finalizing.

