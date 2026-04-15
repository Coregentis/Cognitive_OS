# CGOS-CREW-COMPILER-RUNTIME-SURFACE-v0.1

## Document Control

- Document ID: `CGOS-CREW-COMPILER-RUNTIME-SURFACE-v0.1`
- Status: `Runtime-Family Surface Draft`
- Authority: `Mother-runtime research draft derived from SoloCrew Crew Compiler contract`
- Scope: `Crew Compiler as a bounded Cognitive runtime surface`
- Phase Constraint: `Docs-only. No runtime interface or implementation is created by this note.`

## Purpose

This note defines the bounded meaning of `Crew Compiler` as a possible future `Cognitive_OS` runtime surface.

The trigger for this draft is SoloCrew's frozen product-side contract for:

- `CEO Orchestrator`
- compile inputs
- compile outputs
- recompile conditions

This note does not make `Crew Compiler`:

- an MPLP protocol-kernel concept
- an already-implemented runtime service
- a provider execution engine

## Runtime-Family Position

If later realized, `Crew Compiler` should be treated as:

- a `Cognitive_OS` runtime-family planning / organization surface
- adjacent to the organization-runtime layer
- upstream of concrete execution
- downstream of product-originated directives once those directives are normalized into lawful runtime intake

## Why The Current Runtime Is Not Enough For This Surface

Current `Cognitive_OS` already has:

- `runtime/core/runtime-orchestrator.ts`
- `policy-service.ts`
- bounded action dispatch
- bounded objective-anchor / correction / preference glue

These are useful, but they do not yet provide:

- a compile-phase surface that turns organization state into crew topology
- runtime-owned role policy binding outputs
- runtime-owned recompile conditions
- summary projection seeds suitable for higher layers

## Relation To Existing Runtime Pieces

### Relation to the orchestrator

The current minimal orchestrator is execution-oriented and loop-oriented.

If `Crew Compiler` later exists, it should:

- sit before execution
- prepare the operating shape for execution
- not replace the minimal loop orchestrator

### Relation to policy

`Crew Compiler` should depend on runtime policy surfaces for:

- role-model constraints
- tool constraints
- cost / stop-loss posture
- escalation conditions

It should not itself become the full policy engine.

### Relation to execution

`Crew Compiler` may output an `Execution Plan` shape.
It should not:

- dispatch provider calls
- own execution bridges
- be conflated with AEL realization

### Relation to later runtime realization

The likely realization sequence is:

1. define bounded compile inputs and outputs
2. bind compile logic to runtime-family organization state
3. optionally persist compile artifacts later if that proves necessary

## Draft Inputs

If later realized, the runtime-family `Crew Compiler` should consume bounded inputs equivalent to:

- normalized directive intake from product / management layers
- current `Cell` runtime scope or equivalent operating-unit state
- current objective and work-state context
- memory / preference / evidence continuity state that runtime already lawfully owns
- current capability supply
- current constraint and policy surfaces

This draft does not require product objects such as `Management Directive` to become protocol law.

## Draft Outputs

If later realized, the runtime-family `Crew Compiler` should produce bounded outputs equivalent to:

- `Crew Topology`
- `Role Policy Bindings`
- `Execution Plan`
- `Summary Projection Seed`
- `Recompile Conditions`

These outputs are runtime-family planning outputs.
They are not:

- provider execution traces
- product cards
- UI presentation objects

## Non-Goals

This draft does not define:

- a full autonomous planner
- provider routing
- channel execution behavior
- business-pack-specific compile behavior
- protocol promotion

## Net Draft Judgment

`Crew Compiler` is a plausible near-term `Cognitive_OS` runtime-family surface because:

- SoloCrew has now frozen compile semantics product-side
- current runtime has adjacent orchestrator and policy pieces but no compile surface
- the compile phase needs to remain distinct from runtime execution

It should remain a runtime-family concept, not a protocol-kernel concept.
