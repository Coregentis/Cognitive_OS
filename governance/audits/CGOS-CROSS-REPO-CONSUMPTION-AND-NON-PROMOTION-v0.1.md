# CGOS Cross-Repo Consumption And Non-Promotion v0.1

## Purpose

This audit freezes the current cross-repo boundary for the landed `v0.4` runtime-private workforce line.

It clarifies:

- what SoloCrew currently consumes from `Cognitive_OS`
- what remains `Cognitive_OS`-private runtime truth
- what remains intentionally partial today
- what remains only MPLP candidate material
- what is explicitly not promoted into protocol law

## Authority Order

The governing order remains:

`MPLP Protocol -> Cognitive_OS -> SoloCrew`

This order is not optional.
It is the current cross-repo authority boundary.

## 1. What Downstream Products May Consume From `Cognitive_OS`

Current and future downstream products may consume workforce data only through
an explicit projection-safe envelope. Raw runtime-private workforce records are
not canonical downstream APIs.

Historical downstream consumption language in this record is therefore
reclassified as compatibility / history / research context. It records why the
boundary existed, but it must not be used as the current or future dependency
model.

The runtime-private workforce records affected by this clarification are:

- `cell-runtime-scope`
- `cell-summary-runtime-record`
- `management-directive-record`
- `delivery-return-record`
- `approval-request-record`

Downstream consumption must instead use a neutral projection-safe envelope that
exposes only bounded fields such as:

- `envelope_version`
- `envelope_kind`
- `source_runtime_family`
- `scope_ref`
- `scope_label`
- `scope_status`
- `summary_headline`
- `delivery_posture`
- `safe_evidence_refs`
- `projection_notes`
- `runtime_private_fields_omitted: true`

The envelope must not expose:

- `authority_class`
- `primary_layer`
- runtime `schema_version` truth
- raw runtime `object_type` identity
- registry classification
- binding class
- protocol-binding internals
- temporal, mutation, lineage, or governance internals
- raw store layout
- raw `RuntimeObjectRecord`
- raw runtime-private workforce record payloads

## 2. What Remains `Cognitive_OS`-Private Runtime Truth

The following remain `Cognitive_OS`-private. Downstream products may not read or
adapt these as canonical API fields:

- object identity and authority class
- schema truth
- registry classification
- binding and export classification
- runtime typing and frozen-truth loading classification
- runtime-side continuity, policy, persistence, and governance implications

Projection-safe envelope use does not transfer ownership of that truth.

## 3. What Remains Intentionally Partial Or Asymmetric Today

The current landed workforce family is intentionally not uniform in maturity.

More cohesive current pair:

- `cell-runtime-scope`
- `cell-summary-runtime-record`

More partial current trio:

- `management-directive-record`
- `delivery-return-record`
- `approval-request-record`

The asymmetry is currently acceptable because:

- the family has landed as runtime-private preconditions first
- different objects have different maturity relative to later neutral runtime-family promotion
- downstream normalization pressure has not been identical across all three management-like records

This asymmetry is not a hidden defect.
It is a named continuation risk that must stay explicit.

## 4. What Remains Only MPLP Candidate Material

The following remain candidate-only unless MPLP separately promotes them:

- delegation-envelope-like abstractions
- delivery/acceptance-envelope-like abstractions
- constraint/stop-condition/escalation-envelope-like abstractions

Current runtime-private workforce records are not those protocol objects.
At most they may create later candidate pressure.

## 5. What Is Explicitly Not Promoted Into MPLP Law

The following are not MPLP law because they exist or are consumed downstream:

- `cell-runtime-scope`
- `cell-summary-runtime-record`
- `management-directive-record`
- `delivery-return-record`
- `approval-request-record`
- current multi-cell runtime-private boundary semantics
- current downstream management-projection taxonomy

## Non-Promotion Rule

The following statements are required and true:

- `Cognitive_OS` does not define protocol law
- downstream product use does not imply MPLP promotion
- current runtime-private workforce objects are not protocol objects
- current asymmetry does not imply brokenness, but it must be named explicitly
- usage volume is not promotion evidence

Promotion would require separate upstream judgment in the correct repository.

## Current Practical Classification

| Category | Current Location Of Truth | Current Rule |
| --- | --- | --- |
| runtime-private workforce objects | `Cognitive_OS` | keep runtime-private, non-exportable, and not downstream public API |
| workforce projection-safe envelope | `Cognitive_OS` | only current canonical downstream consumption boundary for workforce data |
| downstream inspection and summary surfaces | downstream products | may adapt projection-safe envelope output into product projections without claiming runtime ownership |
| protocol-envelope candidates | MPLP candidate backlog only | do not imply promotion from `Cognitive_OS` or SoloCrew usage |
| current asymmetry in management-object-family maturity | `Cognitive_OS` closure/governance truth | name it explicitly; do not silently overstate normalization |

## Continuation Rule

If a future continuation would:

- overstate symmetry that is not yet present
- treat runtime-private records as public protocol objects
- use downstream product success as proof of protocol promotion
- collapse product and runtime ownership into one layer
- treat historical bounded runtime-private consumption as the current canonical
  dependency model

then the continuation should pause and be reclassified before proceeding.
