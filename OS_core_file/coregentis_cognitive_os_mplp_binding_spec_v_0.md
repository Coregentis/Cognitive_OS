# Coregentis Cognitive OS — MPLP Binding Spec v0.1

## Document Control

- **Document ID**: CGOS-MBS-v0.1
- **Status**: Draft Binding Baseline
- **Authority**: Coregentis Runtime Boundary Spec
- **Scope**: Defines the authoritative binding model between MPLP protocol semantics and Coregentis Cognitive OS runtime semantics
- **Depends On**:
  - MPLP Protocol v1.0.0
  - Coregentis Cognitive OS — Master Architecture Baseline v0.1
- **Trace Tags**:
  - `coregentis/mplp-binding`
  - `protocol-runtime-boundary`
  - `runtime-authority`
  - `compatibility-rules`

---

# 1. Purpose

This document defines the **authoritative binding specification** between:

- **MPLP protocol semantics**
- **Coregentis Cognitive OS runtime semantics**
- **Coregentis private extension semantics**

Its purpose is to prevent future boundary collapse across protocol, runtime, and product layers.

This document is not an implementation guide. It is a **boundary law and semantic binding specification**.

---

# 2. Why This Document Exists

If MPLP and Coregentis are not explicitly bound through a formal binding specification, future work will inevitably produce boundary drift in one or more of the following forms:

1. protocol concepts being silently reinterpreted by runtime implementation
2. runtime-private concepts being accidentally elevated into protocol law
3. product convenience behaviors being mistaken for protocol semantics
4. future third-party compatibility claims becoming ambiguous or invalid

Therefore, the **MPLP Binding Spec** is mandatory for all Coregentis runtime work.

---

# 3. Canonical Position

## 3.1 Relationship Statement

**MPLP defines the open lifecycle protocol constitution. Coregentis Cognitive OS binds, executes, and governs those semantics as a long-horizon cognitive runtime. Coregentis private runtime mechanisms may extend protocol usage, but may not silently redefine protocol meaning.**

## 3.2 Boundary Law

**Protocol semantics remain protocol semantics. Runtime semantics remain runtime semantics. Product semantics remain product semantics. Binding connects these layers; binding does not erase them.**

---

# 4. Binding Objectives

The binding layer exists to satisfy six objectives.

## 4.1 Semantic Fidelity

Coregentis must preserve the meaning of MPLP protocol objects and invariants.

## 4.2 Runtime Executability

Coregentis must map protocol semantics into executable runtime objects and processes.

## 4.3 Boundary Transparency

It must always be clear whether an object or behavior is:

- protocol-native
- runtime-derived
- Coregentis-private
- product-projected

## 4.4 Compatibility Protection

Third-party MPLP implementations must not be required to replicate Coregentis-private runtime structures in order to remain protocol-compatible.

## 4.5 Evolution Discipline

If Coregentis discovers a broadly useful runtime abstraction, it may be proposed upstream into MPLP through explicit RFC and version governance, not through silent de facto adoption.

## 4.6 Product Isolation

TracePilot and future product surfaces must not redefine protocol semantics through UX shortcuts or product-specific assumptions.

---

# 5. Binding Layer Scope

This spec governs the following categories:

1. **Object Binding**
2. **Authority Binding**
3. **Event Binding**
4. **State Binding**
5. **Evidence Binding**
6. **Extension Binding**
7. **Compatibility Binding**
8. **Evolution Binding**

---

# 6. Binding Taxonomy

All bound concepts in Coregentis must be classified under one of the following four classes.

## 6.1 Class A — Protocol-Native Objects

Objects whose semantics are defined by MPLP.

Examples:

- Context
- Plan
- Confirm
- Trace
- Role
- Dialog
- Collab
- Extension
- Core
- Network
- protocol-level lifecycle events
- schema-governed evidence structures

## 6.2 Class B — Runtime-Bound Objects

Objects that are not protocol-native in full form, but are direct runtime bindings or operational embodiments of MPLP-defined semantics.

Examples:

- context nodes in active memory structures
- runtime plan units
- confirm gates bound to approval mechanics
- trace evidence bundles and linked execution spans
- protocol object projections into stateful runtime containers

## 6.3 Class C — Coregentis-Private Runtime Objects

Objects that are internal to Coregentis Cognitive OS and not part of MPLP.

Examples:

- PSG layered graph nodes and promotion records
- VSL hot/warm/cold state records
- activation signals and suppression markers
- conflict case objects
- consolidation records
- policy profile objects
- tenant/runtime governance descriptors

## 6.4 Class D — Product-Projected Objects

Objects that exist only for product surfaces or user interaction layers.

Examples:

- TracePilot task cards
- UI review panels
- product-facing memory widgets
- domain-specific workflow controls
- pricing/plan capability flags

---

# 7. Object Binding Rules

## 7.1 Rule 1 — Protocol Objects Must Be Traceable

Every MPLP protocol-native object used in Coregentis must retain a clear traceable mapping to its protocol identity.

Coregentis must not collapse multiple protocol concepts into an opaque private runtime object without preserved mapping.

## 7.2 Rule 2 — Runtime Embodiment Is Allowed

Coregentis may represent MPLP protocol-native objects through richer runtime structures, provided:

- the original protocol meaning is preserved
- protocol compatibility remains reconstructable
- private enrichments are explicitly marked as non-protocol

## 7.3 Rule 3 — Private Runtime Objects Must Be Explicitly Marked

Any runtime object not defined by MPLP must be explicitly classified as Coregentis-private.

No private object may be implied to be protocol law.

## 7.4 Rule 4 — Product Objects Must Not Pretend to Be Runtime Law

UI-facing and product-facing objects must never be used as the authoritative definition of runtime or protocol semantics.

---

# 8. Authority Binding Model

Authority must be separated by source.

## 8.1 Protocol Authority

Protocol authority comes from MPLP specification, schemas, invariants, and approved versioned protocol semantics.

## 8.2 Runtime Authority

Runtime authority comes from Coregentis Cognitive OS constitutional layers:

- Cognitive Object Model
- Temporal Semantics Layer
- Cognitive Policy Layer
- runtime state and execution governance

## 8.3 Product Authority

Product authority is limited to surface behavior, workflow packaging, and UX projection.

## 8.4 Non-Negotiable Rule

**No lower layer may silently claim authority over a higher layer.**

This means:

- product cannot redefine runtime law
- runtime cannot redefine protocol law
- private convenience behavior cannot imply protocol semantics

---

# 9. Core Binding Axes

## 9.1 Object Binding Axis

Maps protocol objects into runtime object structures.

## 9.2 State Binding Axis

Maps protocol semantics into persistent or evolving runtime state.

## 9.3 Event Binding Axis

Maps protocol lifecycle events into runtime event streams and state transitions.

## 9.4 Evidence Binding Axis

Maps protocol trace/evidence semantics into runtime evidence generation, storage, replay, and audit structures.

## 9.5 Policy Binding Axis

Maps protocol confirm/governance semantics into runtime decision gates and execution constraints.

## 9.6 Learning Binding Axis

Maps protocol-observable events and lifecycle objects into learning/consolidation candidates without conflating protocol truth with private learned structures.

---

# 10. Initial Binding Table

The following is a first baseline-level mapping model.

## 10.1 Context Binding

### MPLP Meaning
Structured context object under protocol semantics.

### Coregentis Binding
- Working Graph context nodes
- Episodic context fragments
- Context-linked semantic anchors
- VSL state references

### Binding Rule
Coregentis may decompose and stratify context internally, but must preserve reconstructable protocol-level context identity.

## 10.2 Plan Binding

### MPLP Meaning
Structured lifecycle plan object.

### Coregentis Binding
- runtime plan units
- activation dependencies
- plan execution windows
- plan status/state projections

### Binding Rule
Internal decomposition is allowed, but plan semantics must remain reconstructable as a protocol-valid plan form.

## 10.3 Confirm Binding

### MPLP Meaning
Structured confirmation / approval semantics.

### Coregentis Binding
- policy gates
- approval checkpoints
- authority escalation flows
- confirm-triggered execution suppression rules

### Binding Rule
Coregentis may enrich confirm behavior through policy engines, but may not redefine confirm as mere UI acknowledgment.

## 10.4 Trace Binding

### MPLP Meaning
Structured traceability and evidence semantics.

### Coregentis Binding
- trace evidence bundles
- runtime execution spans
- episode back-links
- evidence chain records
- replay and audit references

### Binding Rule
Coregentis may store trace in richer structures, but protocol trace meaning and evidence reconstructability must be preserved.

## 10.5 Role Binding

### MPLP Meaning
Role semantics for actor function and behavior constraints.

### Coregentis Binding
- runtime role descriptors
- permission profiles
- actor capability envelopes
- multi-user / multi-agent authority mappings

### Binding Rule
Runtime permissions may extend role realization, but protocol role meaning must not be collapsed into tenant-specific authorization only.

## 10.6 Dialog Binding

### MPLP Meaning
Structured interaction and conversational lifecycle semantics.

### Coregentis Binding
- conversational episodes
- intent formation history
- clarification chains
- replayable interaction fragments

## 10.7 Collab Binding

### MPLP Meaning
Structured collaboration semantics among actors.

### Coregentis Binding
- collaboration sessions
- handoff units
- coordination threads
- conflict-linked collaboration records

## 10.8 Extension Binding

### MPLP Meaning
Extension point semantics under protocol-defined extension boundaries.

### Coregentis Binding
- runtime adapters
- domain packs
- private extension objects
- integration descriptors

### Binding Rule
All Coregentis extensions must explicitly distinguish:
- protocol-compliant extension usage
- Coregentis-private runtime extension behavior

## 10.9 Core Binding

### MPLP Meaning
Core shared semantics and baseline protocol logic.

### Coregentis Binding
- runtime constitutional constraints
- shared state transition rules
- baseline execution obligations

## 10.10 Network Binding

### MPLP Meaning
Cross-agent / cross-node / distributed lifecycle semantics.

### Coregentis Binding
- tenant-aware coordination links
- distributed runtime interaction contracts
- cross-project semantic references
- organization-level routing/governance descriptors

---

# 11. State Binding Rules

## 11.1 Protocol Objects Must Not Be Reduced to Raw Storage Records

A protocol object stored inside VSL is not equivalent to a VSL record itself.

Storage embodiment must not replace semantic identity.

## 11.2 Runtime State May Be Richer Than Protocol State

Coregentis may maintain:

- hot state
- warm state
- cold state
- ephemeral execution state
- promotion and demotion metadata

These are runtime capabilities, not automatic protocol categories.

## 11.3 Semantic Graph State Is Runtime, Not Protocol Law

PSG and all layered memory graph structures are Coregentis runtime mechanisms.

They may carry protocol-bound objects, but PSG itself is not MPLP.

---

# 12. Event Binding Rules

## 12.1 Protocol Events Remain Protocol Events

When Coregentis emits or ingests protocol-bound lifecycle events, their protocol meaning must remain intact.

## 12.2 Runtime Events May Extend But Must Be Labeled

Coregentis may emit additional runtime events such as:

- activation events
- suppression events
- conflict classification events
- memory promotion events
- consolidation events
- tenant governance events

These must be explicitly identified as runtime-private unless standardized by MPLP.

## 12.3 Product UI Events Are Not Protocol Events

Surface-level UI events must not be conflated with protocol lifecycle events.

---

# 13. Evidence Binding Rules

## 13.1 Evidence Must Preserve Protocol Traceability

If a runtime decision is presented as protocol-relevant, the evidence chain must preserve a route back to protocol objects and runtime actions.

## 13.2 Derived Evidence Must Be Marked as Derived

Examples:

- conflict summaries
- memory salience rankings
- impact projections
- replay suggestions

These are valuable, but they are derived runtime artifacts, not direct protocol evidence by default.

## 13.3 Auditability Over Convenience

Whenever runtime convenience conflicts with evidence recoverability, evidence recoverability takes precedence.

---

# 14. Learning Binding Rules

## 14.1 Protocol Truth Is Not the Same as Learned Structure

A learned pattern or consolidated memory artifact must not silently become protocol truth.

## 14.2 Learning Outputs Must Be Classified

All learning outputs must be classified as one of:

- candidate
- consolidated private runtime knowledge
- promoted policy suggestion
- protocol-relevant evidence-derived summary

## 14.3 Promotion to Protocol-Level Semantics Requires Governance

No learning-generated abstraction may become protocol law without explicit standardization path and governance approval.

---

# 15. Extension Binding Rules

## 15.1 Extension Classes

Coregentis must distinguish at least three extension classes:

1. **Protocol-Compliant Extensions**
2. **Runtime-Private Extensions**
3. **Product-Specific Extensions**

## 15.2 Labeling Requirement

Every extension must declare:

- protocol impact
- runtime impact
- compatibility impact
- whether it is exportable outside Coregentis

## 15.3 No Silent Standard Capture

No widely-used Coregentis extension may be treated as MPLP standard behavior unless formally promoted through an explicit RFC path.

---

# 16. Compatibility Rules

## 16.1 Core Compatibility Principle

A system may be MPLP-compatible without being Coregentis-compatible.

A system may be Coregentis-integrated without having all Coregentis-private runtime features standardized by MPLP.

## 16.2 Third-Party Protection Rule

Coregentis must not define compatibility in a way that requires third parties to implement Coregentis-private memory/runtime/governance structures to claim MPLP conformance.

## 16.3 Export Rule

When exporting protocol-relevant artifacts outside Coregentis, they must be exportable in MPLP-valid terms without leaking dependence on Coregentis-private semantics.

---

# 17. Evolution Rules

## 17.1 Runtime Innovation Is Allowed

Coregentis is allowed to innovate aggressively at the runtime layer.

## 17.2 Upstream Promotion Requires Explicit Governance

If a Coregentis-private runtime abstraction appears broadly useful for open interoperability, it may be proposed upstream into MPLP through explicit RFC and versioned protocol evolution.

## 17.3 Promotion Criteria

An abstraction should not be considered for MPLP promotion unless it demonstrates:

- semantic generality
- vendor neutrality
- protocol relevance
- implementation-independent value
- stable evidence of usefulness across scenarios

## 17.4 Default Rule

**Private runtime innovation stays private by default until explicitly promoted.**

---

# 18. Binding Invariants

The following invariants must always hold.

## 18.1 Protocol Meaning Preservation

No Coregentis runtime convenience may silently alter MPLP object meaning.

## 18.2 Runtime Explicitness

All Coregentis-private runtime constructs must be explicitly identifiable as private.

## 18.3 Product Non-Authority

No product projection may define protocol or runtime law.

## 18.4 Evidence Recoverability

Protocol-relevant decisions must remain explainable and evidence-recoverable.

## 18.5 Compatibility Honesty

Coregentis must distinguish protocol compatibility from Coregentis-native enhancement.

---

# 19. Required Follow-On Artifacts

This document should be followed by the following detailed artifacts.

1. **Object Mapping Matrix**
2. **Runtime Object Registry**
3. **Protocol vs Runtime vs Product Labeling Rules**
4. **Export Compatibility Ruleset**
5. **RFC Promotion Criteria and Workflow**
6. **TracePilot Binding Profile**

---

# 20. Open Questions

The following questions remain open for the next stage.

- Which runtime objects should be made mandatory in the first Object Registry?
- Which current Coregentis-private objects are likely RFC candidates for future MPLP promotion?
- What is the minimal exportable protocol artifact bundle for Coregentis-generated results?
- Which product projection shortcuts are most likely to create binding ambiguity and should be forbidden early?
- What is the first frozen compatibility profile for TracePilot?

---

# 21. Freeze Statement

This document establishes the first formal boundary law for how Coregentis Cognitive OS binds to MPLP.

All downstream runtime, platform, and product work must preserve the following order of authority:

**MPLP Protocol Constitution → Coregentis Runtime Constitution → Product Projection Semantics**

Binding is the bridge across these layers.
It is not permission to collapse them.

