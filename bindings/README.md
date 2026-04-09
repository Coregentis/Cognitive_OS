# Coregentis Binding v0

## Why Binding Comes After Registry Freeze

Binding comes after registry freeze because binding should map stabilized object classes, not moving targets.

The order is:

1. freeze base schemas
2. freeze object schemas
3. freeze registry classifications
4. draft binding

If binding came earlier, it would either:

- overfit unstable object semantics
- or collapse protocol and runtime too early

## Why Binding Is Not Simple Variable Renaming

Binding is not a rename table.

Fields such as `mplp_object` in the binding matrix are semantic reference labels only.
They are not field-level mapping instructions.

It must define how MPLP protocol semantics are:

- imported into Coregentis
- represented by Coregentis runtime-bound objects
- reconstructed back to protocol-relevant meaning where allowed
- exported back out as protocol-compliant artifacts where allowed

That is a semantic bridge, not a key-mapping exercise.

## Why Coregentis Does Not Simply Use MPLP Objects As Its Full Internal Runtime Object System

MPLP is the protocol constitution.
Coregentis is the mother runtime and governance substrate.

Therefore:

- MPLP defines interoperable protocol meaning
- Coregentis defines longer-horizon runtime, governance, memory, activation, conflict, and learning structures

Coregentis may preserve protocol recoverability, but it does not collapse its internal runtime object system into direct MPLP object mirrors.

If it did, protocol and runtime would become one layer, which would violate the architecture order.

## How Binding Differs From Registry

Registry classifies frozen Coregentis objects.

Binding defines:

- which objects correspond to MPLP-relevant meaning
- how protocol semantics may enter
- whether objects are exportable
- what reconstructability means at this phase

In short:

- registry says what kind of Coregentis object this is
- binding says how that object relates, if at all, to MPLP semantics

## How Binding Differs From Runtime Substrate Realization

Binding does not implement:

- state transitions
- execution logic
- memory placement mechanics
- activation mechanics
- graph persistence

Binding only defines the semantic bridge.

Runtime substrate realization is later work.

## Why AEL / VSL / PSG / Intent Drift Are Not Implemented Here

These are later runtime-substrate concerns:

- AEL: governed activation realization
- VSL: durable evolving runtime state realization
- PSG: graph-like cognitive and semantic realization
- Intent drift handling: later reconcile/conflict/runtime logic

They matter, but implementing them here would incorrectly turn binding into runtime.

This phase therefore does not implement any of them.

## Why `runtime_substrate_hint` Exists

`runtime_substrate_hint` exists to prevent the binding layer from becoming disconnected from later runtime realization.

It is informational only.

It does **not**:

- implement substrate logic
- choose final substrate architecture
- replace runtime design

It only says which later substrate family an object is most likely to live in:

- `psg`
- `vsl`
- `ael`
- `multi_substrate`
- `unresolved`

## What This Phase Intentionally Does NOT Implement

This phase does not implement:

- runtime code
- AEL
- VSL
- PSG
- Intent drift runtime logic
- TracePilot bindings
- product bindings
- full MPLP field-level mapping

It remains a mother-runtime foundation step only.

## Authority Order Preserved

This binding layer preserves:

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> TracePilot`

Protocol meaning remains recoverable.
Runtime-private structures remain explicitly private.
Product and TracePilot concerns remain out of scope.
