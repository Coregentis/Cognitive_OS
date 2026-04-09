# Coregentis Cognitive OS — Cognitive Object Registry Baseline v0.1

## Document Control

- **Document ID**: CGOS-CORB-v0.1
- **Status**: Draft Object Registry Baseline
- **Authority**: Coregentis Runtime Object Baseline
- **Scope**: Defines the authoritative first-class cognitive object registry for Coregentis Cognitive OS
- **Depends On**:
  - MPLP Protocol v1.0.0
  - Coregentis Cognitive OS — Master Architecture Baseline v0.1
  - Coregentis Cognitive OS — MPLP Binding Spec v0.1
  - Coregentis Cognitive OS — Runtime Constitution Spec v0.1
  - Coregentis Cognitive OS — Product Projection Baseline v0.1
- **Trace Tags**:
  - `coregentis/object-registry`
  - `runtime-objects`
  - `authority-classification`
  - `object-baseline`

---

# 1. Purpose

This document defines the **authoritative first-class cognitive object registry** for Coregentis Cognitive OS.

Its purpose is to prevent object drift across runtime, governance, memory, execution, and product layers by freezing the baseline object universe that Coregentis may reason over, persist, activate, govern, trace, and project.

This document does not define full schema fields for every object. It defines:

- the first-class object families
- the baseline first-class object set
- object authority classes
- object layer affiliation
- object lifecycle relationships
- object derivation and promotion rules
- object boundary rules across protocol, runtime, and product

---

# 2. Why This Document Exists

Without an explicit object registry, the system will drift in the following ways:

1. runtime subsystems will invent overlapping object concepts independently
2. product surfaces will define ad hoc user-facing pseudo-objects
3. memory structures will mix raw storage artifacts with semantic objects
4. policy, conflict, learning, and trace systems will compete for object ownership
5. MPLP-bound objects and Coregentis-private objects will become ambiguous

Therefore, a formal object registry is mandatory.

---

# 3. Canonical Definition

## 3.1 Object Registry Definition

The **Cognitive Object Registry** is the authoritative registry of all first-class object types that Coregentis Cognitive OS may treat as semantically significant runtime entities.

## 3.2 First-Class Object Rule

A first-class object is an object that the runtime may:

- identify independently
- place in memory/state
- activate or suppress
- govern through policy
- trace with evidence
- use in conflict resolution
- consolidate into learning structures
- project into product surfaces

## 3.3 Registry Rule

No major runtime behavior should depend on semantically important objects that are not either:

- protocol-native and bound explicitly, or
- registry-recognized runtime objects, or
- explicitly marked derived/product-only objects

---

# 4. Registry Axes

Each registered object must be classified across the following axes.

## 4.1 Authority Axis

Every object must belong to one of these authority classes:

- **A — Protocol-Native**
- **B — Runtime-Bound**
- **C — Coregentis-Private Runtime**
- **D — Product-Projected**
- **E — Derived / Ephemeral**

## 4.2 Functional Axis

Every object must belong to at least one of these functional families:

- Entry
- Memory
- Action
- Governance
- Evidence
- Learning
- Organization
- Projection

## 4.3 Layer Axis

Every object must declare its primary layer affiliation:

- MPLP Protocol Constitution
- Cognitive Constitution Layer
- Cognitive Runtime Core
- Organization Runtime Layer
- Product Projection Layer

## 4.4 Temporal Axis

Every object must declare its temporal behavior class:

- ephemeral
- session-bounded
- replayable
- promotable
- durable
- expirable
- archival

## 4.5 Mutation Axis

Every object must declare whether it is:

- immutable after creation
- append-only
- stateful/mutable
- promotion-based
- policy-mutable
- derivation-only

---

# 5. Object Family Baseline

The following object families are constitutionally recognized.

## 5.1 Entry Objects

Objects that introduce new material into the runtime.

## 5.2 Memory Objects

Objects that hold retained cognitive structures across working, episodic, and semantic layers.

## 5.3 Action Objects

Objects that govern activation, execution, suppression, escalation, and runtime progression.

## 5.4 Governance Objects

Objects that govern authority, policy, confirm logic, conflict, rollback, and compensation.

## 5.5 Evidence Objects

Objects that carry trace, proof, decision history, replay linkage, and audit meaning.

## 5.6 Learning Objects

Objects that represent candidate, consolidated, or replayable experience structures.

## 5.7 Organization Objects

Objects that represent tenant, workspace, project, authority scope, and cross-project coordination meaning.

## 5.8 Projection Objects

Objects that represent product-surface views, simplified abstractions, and projection-specific packaging.

---

# 6. Baseline First-Class Object Registry

The following objects are frozen as the first baseline object set for Coregentis Cognitive OS.

---

## 6.1 Entry Object Set

### 6.1.1 Intent
- **Authority**: A/B
- **Family**: Entry
- **Layer**: MPLP-bound / Runtime-bound
- **Description**: Structured incoming intent unit entering the cognitive runtime.

### 6.1.2 Delta Intent
- **Authority**: B/C
- **Family**: Entry / Governance
- **Layer**: Cognitive Runtime Core
- **Description**: A structured intent change object representing change against an existing intent state.

### 6.1.3 Clarification Unit
- **Authority**: C
- **Family**: Entry
- **Layer**: Cognitive Runtime Core
- **Description**: A bounded clarification artifact used to reduce ambiguity before promotion into stronger intent structures.

### 6.1.4 External Input Record
- **Authority**: C
- **Family**: Entry / Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A normalized incoming input artifact from user, agent, tool, system, or external source.

### 6.1.5 Imported Protocol Artifact
- **Authority**: A/B
- **Family**: Entry / Evidence
- **Layer**: MPLP-bound / Runtime-bound
- **Description**: A protocol-valid artifact imported into Coregentis for runtime use.

---

## 6.2 Memory Object Set

### 6.2.1 Working State Node
- **Authority**: C
- **Family**: Memory
- **Layer**: Cognitive Runtime Core
- **Description**: A node in the active working memory layer representing currently live task cognition.

### 6.2.2 Episode
- **Authority**: C
- **Family**: Memory / Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A bounded runtime episode representing a coherent event/history segment.

### 6.2.3 Episodic Fragment
- **Authority**: C
- **Family**: Memory / Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A smaller memory fragment captured within or across episodes.

### 6.2.4 Semantic Fact
- **Authority**: B/C
- **Family**: Memory
- **Layer**: Cognitive Runtime Core
- **Description**: A consolidated, durable fact structure held in semantic memory.

### 6.2.5 Semantic Relation
- **Authority**: C
- **Family**: Memory
- **Layer**: Cognitive Runtime Core
- **Description**: A durable relation between semantic facts, entities, intents, or plans.

### 6.2.6 Recall Candidate
- **Authority**: E
- **Family**: Memory / Derived
- **Layer**: Cognitive Runtime Core
- **Description**: A dynamically proposed object for retrieval into active cognition.

### 6.2.7 Memory Promotion Record
- **Authority**: C
- **Family**: Memory / Governance / Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A record that a memory object has been promoted across memory layers.

---

## 6.3 Action Object Set

### 6.3.1 Activation Signal
- **Authority**: C
- **Family**: Action
- **Layer**: Cognitive Runtime Core
- **Description**: A signal that may activate bounded execution or reasoning pathways.

### 6.3.2 Action Unit
- **Authority**: C
- **Family**: Action
- **Layer**: Cognitive Runtime Core
- **Description**: A bounded executionable unit under AEL control.

### 6.3.3 Execution Envelope
- **Authority**: C
- **Family**: Action / Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A governed container describing the scope, constraints, and context of execution.

### 6.3.4 Suppression Marker
- **Authority**: C
- **Family**: Action / Governance
- **Layer**: Cognitive Runtime Core
- **Description**: An object recording a blocked or suppressed activation/execution.

### 6.3.5 Escalation Request
- **Authority**: C
- **Family**: Action / Governance
- **Layer**: Cognitive Runtime Core
- **Description**: An object requesting higher authority or stronger governance before continuation.

---

## 6.4 Governance Object Set

### 6.4.1 Confirm Gate
- **Authority**: A/B
- **Family**: Governance
- **Layer**: MPLP-bound / Runtime-bound
- **Description**: A runtime-bound governance gate rooted in MPLP confirm semantics.

### 6.4.2 Policy Rule
- **Authority**: C
- **Family**: Governance
- **Layer**: Cognitive Constitution Layer / Organization Runtime Layer
- **Description**: A runtime policy object governing execution, memory, learning, retention, conflict, or authority behavior.

### 6.4.3 Authority Binding
- **Authority**: C
- **Family**: Governance
- **Layer**: Cognitive Constitution Layer / Organization Runtime Layer
- **Description**: A binding object defining who or what may act upon a cognitive object.

### 6.4.4 Conflict Case
- **Authority**: C
- **Family**: Governance / Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A typed runtime conflict object representing semantic, policy, authority, plan, or execution collision.

### 6.4.5 Drift Record
- **Authority**: C
- **Family**: Governance / Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A record of detected divergence or change relative to prior expectations or established structures.

### 6.4.6 Compensation Plan
- **Authority**: C
- **Family**: Governance / Action
- **Layer**: Cognitive Runtime Core
- **Description**: A structured object representing corrective or compensatory action after conflict, drift, or failure.

### 6.4.7 Rollback Boundary
- **Authority**: C
- **Family**: Governance / Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A governed boundary beyond which rollback is constrained or disallowed.

---

## 6.5 Evidence Object Set

### 6.5.1 Trace Evidence
- **Authority**: A/B
- **Family**: Evidence
- **Layer**: MPLP-bound / Runtime-bound
- **Description**: A protocol-relevant trace/evidence artifact preserved by the runtime.

### 6.5.2 Execution Span
- **Authority**: C
- **Family**: Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A runtime execution trace span tied to activation and action flow.

### 6.5.3 Decision Record
- **Authority**: C
- **Family**: Evidence / Governance
- **Layer**: Cognitive Runtime Core
- **Description**: A record of a significant runtime decision and its basis.

### 6.5.4 Evidence Chain Link
- **Authority**: C
- **Family**: Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A linkage object connecting decisions, actions, sources, and trace artifacts.

### 6.5.5 Replay Record
- **Authority**: C
- **Family**: Evidence / Learning
- **Layer**: Cognitive Runtime Core
- **Description**: A record supporting replay of prior episodes, decisions, or execution paths.

### 6.5.6 Audit Projection
- **Authority**: D/E
- **Family**: Evidence / Projection
- **Layer**: Product Projection Layer
- **Description**: A user-facing projection of underlying evidence structures.

---

## 6.6 Learning Object Set

### 6.6.1 Learning Candidate
- **Authority**: C
- **Family**: Learning
- **Layer**: Cognitive Runtime Core
- **Description**: A candidate object representing experience potentially useful for consolidation.

### 6.6.2 Learning Sample
- **Authority**: C
- **Family**: Learning / Evidence
- **Layer**: Cognitive Runtime Core
- **Description**: A structured reusable experience object preserved after governed consolidation.

### 6.6.3 Consolidation Batch
- **Authority**: C
- **Family**: Learning
- **Layer**: Cognitive Runtime Core
- **Description**: A grouping object for candidate-to-consolidated learning processing.

### 6.6.4 Reuse Pattern
- **Authority**: E/C
- **Family**: Learning / Derived
- **Layer**: Cognitive Runtime Core
- **Description**: A detected recurring pattern of successful or reusable behavior.

### 6.6.5 Failure Pattern
- **Authority**: E/C
- **Family**: Learning / Derived
- **Layer**: Cognitive Runtime Core
- **Description**: A detected recurring pattern of failure, instability, or drift.

### 6.6.6 Policy Suggestion Record
- **Authority**: E/C
- **Family**: Learning / Governance
- **Layer**: Cognitive Runtime Core
- **Description**: A learned suggestion that may inform later policy review but is not policy law by default.

---

## 6.7 Organization Object Set

### 6.7.1 Tenant
- **Authority**: C
- **Family**: Organization
- **Layer**: Organization Runtime Layer
- **Description**: A top-level organizational isolation boundary.

### 6.7.2 Workspace
- **Authority**: C
- **Family**: Organization
- **Layer**: Organization Runtime Layer
- **Description**: A bounded runtime collaboration and governance space within a tenant.

### 6.7.3 Project
- **Authority**: C
- **Family**: Organization / Memory
- **Layer**: Organization Runtime Layer
- **Description**: A bounded semantic and operational unit with its own truth structures, policies, and runtime history.

### 6.7.4 Role Profile
- **Authority**: C
- **Family**: Organization / Governance
- **Layer**: Organization Runtime Layer
- **Description**: A runtime authority and capability descriptor for human or agent actors.

### 6.7.5 Cross-Project Link
- **Authority**: C
- **Family**: Organization / Memory
- **Layer**: Organization Runtime Layer
- **Description**: A governed relation between projects for semantic reuse or dependency.

### 6.7.6 Governance Scope
- **Authority**: C
- **Family**: Organization / Governance
- **Layer**: Organization Runtime Layer
- **Description**: A bounded scope over which policy, authority, and runtime rules apply.

---

## 6.8 Projection Object Set

### 6.8.1 Projection Card
- **Authority**: D
- **Family**: Projection
- **Layer**: Product Projection Layer
- **Description**: A product-facing card or simplified unit that represents one or more runtime objects.

### 6.8.2 Review Surface Object
- **Authority**: D
- **Family**: Projection / Governance
- **Layer**: Product Projection Layer
- **Description**: A product-facing object for review, approval, conflict inspection, or impact inspection.

### 6.8.3 Product Capability Flag
- **Authority**: D
- **Family**: Projection
- **Layer**: Product Projection Layer
- **Description**: A product packaging or exposure object; not a runtime constitutional object.

---

# 7. Object Authority Classes

## 7.1 Class A — Protocol-Native

The object is defined by MPLP and remains protocol-authoritative.

## 7.2 Class B — Runtime-Bound

The object is a runtime embodiment of protocol semantics and must remain reconstructable to protocol meaning.

## 7.3 Class C — Coregentis-Private Runtime

The object is part of Coregentis runtime law or machinery but not part of MPLP.

## 7.4 Class D — Product-Projected

The object exists to support projection, presentation, or packaging and must not define runtime law.

## 7.5 Class E — Derived / Ephemeral

The object is derived, inferred, proposed, or temporary and must not be treated as durable authority by default.

---

# 8. Object Lifecycle Rules

## 8.1 Creation Rule

An object must declare its creation source:

- user entry
- agent action
- tool result
- runtime derivation
- protocol import
- product projection

## 8.2 Placement Rule

Every object must declare which layer(s) it may inhabit:

- working memory
- episodic memory
- semantic memory
- organization runtime
- projection layer

## 8.3 Promotion Rule

Some objects may promote across layers or authority states.

Examples:
- Clarification Unit → Intent support material
- Episodic Fragment → Learning Candidate
- Learning Candidate → Learning Sample
- Working State Node → Semantic Fact candidate

Promotion must be explicit and governed.

## 8.4 Demotion / Expiry Rule

Objects may also demote, archive, or expire under temporal and policy constraints.

## 8.5 Derivation Rule

Derived objects must preserve lineage back to source objects and must not silently replace them as authority.

---

# 9. Object Boundary Rules

## 9.1 Protocol Boundary Rule

If an object is protocol-native or runtime-bound to protocol meaning, its protocol identity must remain recoverable.

## 9.2 Runtime Boundary Rule

Coregentis-private runtime objects must be explicitly labeled as private and must not be presented as MPLP law.

## 9.3 Product Boundary Rule

Product-projected objects must not become the sole semantic identity of a runtime object.

## 9.4 Storage Boundary Rule

A storage record is not automatically a first-class cognitive object. Storage embodiment must not replace registry identity.

## 9.5 UI Boundary Rule

A UI widget is not automatically an object unless it maps to a registry-recognized object or an explicitly marked projection object.

---

# 10. Object Relationship Types

The following relationship types are baseline-recognized for registered objects.

## 10.1 References
An object points to another object without ownership.

## 10.2 Contains
An object structurally contains another object.

## 10.3 Derived-From
An object was derived from another object.

## 10.4 Promoted-From
An object originated through governed promotion of another object.

## 10.5 Conflicts-With
An object is in typed conflict with another object.

## 10.6 Governs
An object defines rules over another object or object class.

## 10.7 Evidences
An object provides supporting evidence for another object or decision.

## 10.8 Projects-As
A runtime object is represented in product space through a projection object.

---

# 11. Object Registry Invariants

The following invariants must hold.

## 11.1 Typed Object Invariant

Major runtime semantics must be represented through typed registered objects.

## 11.2 Authority Clarity Invariant

Every important object must have a declared authority class.

## 11.3 Layer Clarity Invariant

Every important object must have a declared layer affiliation.

## 11.4 Lineage Preservation Invariant

Derived, promoted, replayed, or projected objects must preserve lineage to their source objects.

## 11.5 Promotion Governance Invariant

Promotion of objects across layers or authority states must be policy-governed.

## 11.6 Projection Non-Authority Invariant

Projection objects must not silently become runtime or protocol authority.

## 11.7 Runtime/Product Separation Invariant

Product convenience abstractions must remain distinguishable from first-class runtime objects.

---

# 12. Object Registration Rules for Future Objects

## 12.1 New Object Proposal Rule

Any new first-class object must declare:

- name
- family
- authority class
- layer affiliation
- temporal class
- mutation class
- source lineage model
- relationship types
- whether it is protocol-bound, runtime-private, or product-only

## 12.2 No Silent Object Introduction Rule

No subsystem may introduce semantically critical objects without registry review.

## 12.3 Promotion to First-Class Rule

A commonly used derived or local object may be promoted to first-class only after explicit architectural decision.

---

# 13. Non-Goals

This document does not define:

- exact JSON schemas for each object
- physical storage schema
- exact graph labels or database tables
- UI design or screen names
- feature gating decisions
- commercial packaging

These belong to downstream registry, runtime, and product documents.

---

# 14. Required Follow-On Documents

The following downstream documents are recommended.

1. **Detailed Cognitive Object Registry v0.1**
2. **Object Relationship Ruleset v0.1**
3. **Memory Layer Placement Ruleset v0.1**
4. **Object Promotion & Demotion Ruleset v0.1**
5. **Developer Projection Object Profile v0.1**
6. **Runtime Object API Naming Rules v0.1**

---

# 15. Open Questions

The following questions remain open:

- Which baseline objects should be mandatory for first implementation versus optional?
- Which current derived objects are likely to become first-class quickly?
- Which projection objects should be forbidden from masquerading as runtime objects?
- What is the exact minimum relationship set for v0.1 implementation?
- Which object families need stronger authority subtyping in the next revision?

---

# 16. Freeze Statement

This document establishes the first authoritative cognitive object registry baseline for Coregentis Cognitive OS.

All downstream runtime, projection, and implementation work must preserve the following object law:

**Semantically important system behavior must be grounded in registered cognitive objects with explicit authority, layer, temporal, mutation, and lineage semantics.**

No runtime subsystem or product surface may bypass this requirement through ad hoc object invention.
