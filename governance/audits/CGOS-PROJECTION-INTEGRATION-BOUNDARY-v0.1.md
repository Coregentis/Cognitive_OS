# CGOS-PROJECTION-INTEGRATION-BOUNDARY-v0.1

## Purpose

This note records the allowed integration boundary between `Cognitive_OS` and a downstream SoloCrew Projection layer.

## Allowed Projection Entry Points

Projection may directly consume:

- workforce schemas
- registry and binding truth
- runtime type unions
- worker lifecycle services
- state persistence ports and adapters
- execution envelopes and events
- bounded P0-B glue surfaces:
  - action dispatch
  - objective anchor
  - correction capture
  - preference write-back
  - orchestrator bounded facades

## Forbidden Interpretation

Projection may not treat `Cognitive_OS` as if it already provides:

- provider implementation
- full PSG runtime
- full correction runtime
- product workflow ownership
- channel runtime
- budget runtime

Projection may not:

- rename mother-runtime truth and then feed that renamed product vocabulary back upward as runtime authority
- treat bounded P0-B glue as a full autonomous runtime

## Downstream Responsibilities

Projection must own:

- product naming and DTO shape
- adapter composition
- provider and execution backend selection
- projection-specific workflow assembly
- UX-oriented state packaging
- any downstream product coordination logic

## Authority Rule

The authority order remains:

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> Product/App`

Projection is therefore:

- a consumer of the mother runtime
- not an authority over the mother runtime

## Boundary Judgment

The current `Cognitive_OS` surface is integration-ready for bounded projection work only.

It is not a replacement for a dedicated projection repository.
