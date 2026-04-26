# CGOS Runtime Consumption Boundary Addendum v0.1

`CGOS-RUNTIME-CONSUMPTION-BOUNDARY-ADDENDUM-v0.1`

## A. Purpose

This addendum clarifies downstream consumption boundary after the downstream
projection backflow.

## B. Allowed Downstream Consumption

Downstream products may consume:

- projection-safe state exposure
- evidence posture summary
- non-executing recommendation envelope
- workforce projection-safe envelope
- aggregate posture summary
- release or governance evidence summary

## C. Forbidden Downstream Consumption

Downstream products must not consume directly:

- `runtime/core` private services
- `runtime/in-memory` stores
- raw VSL, PSG, or AEL internals
- raw drift, conflict, or learning-candidate internals
- raw runtime-private workforce records, including `cell-runtime-scope`,
  `cell-summary-runtime-record`, `management-directive-record`,
  `delivery-return-record`, and `approval-request-record`
- provider or channel execution surfaces
- runtime-private object identities as stable product APIs

## D. Naming Boundary

- `Cognitive_OS` does not adopt product names as runtime law
- downstream products may maintain product-layer names in their own repos
- neutral projection contracts are the only valid shared boundary

## E. Workforce Envelope Boundary

The only current downstream-facing workforce boundary is the neutral
`WorkforceProjectionSafeEnvelope`.

The envelope may expose bounded labels, status, headline, delivery posture,
safe evidence references, projection notes, and
`runtime_private_fields_omitted: true`.

It must not expose runtime authority fields, schema truth, registry or binding
classification, protocol-binding internals, temporal / mutation / lineage /
governance internals, raw store layout, raw `RuntimeObjectRecord`, or raw
runtime-private workforce record payloads.

## F. Decision

`CGOS_RUNTIME_CONSUMPTION_ADDENDUM_READY`

This addendum is ready to act as the bounded naming and consumption rule for a
later projection-contract implementation-planning wave.
