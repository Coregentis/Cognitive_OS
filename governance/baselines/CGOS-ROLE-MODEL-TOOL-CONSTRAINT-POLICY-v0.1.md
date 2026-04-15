# CGOS-ROLE-MODEL-TOOL-CONSTRAINT-POLICY-v0.1

## Purpose

This baseline freezes the narrow mother-runtime precondition language for later role/model/tool/constraint policy support.

It is intentionally narrower than a policy-engine implementation.

## Current Repo Reality

Current `main` already contains policy-related foundation truth:

- `schemas/coregentis/v0/objects/policy-rule.schema.json`
- `schemas/coregentis/v0/objects/confirm-gate.schema.json`
- `runtime/core/policy-service.ts`
- `runtime/core/confirm-service.ts`
- workforce role and worker schemas such as:
  - `schemas/coregentis/v0/workforce/role-profile.schema.json`
  - `schemas/coregentis/v0/workforce/agent-worker.schema.json`

That means policy-related foundation work already exists.

Current repo truth does **not** yet provide:

- a full role-model policy engine
- a full tool-governance engine
- a full cost-control engine
- a full stop-loss or escalation engine

## Narrow Policy Families

### 1. Role / Model Binding Preconditions

Later runtime policy may need a neutral way to express:

- which runtime roles may use which model classes
- which role postures imply which execution posture
- where policy interpretation must stay separate from product prompts or UI wording

### 2. Tool Policy Preconditions

Later runtime policy may need a neutral way to express:

- tool access boundaries
- scope-limited tool eligibility
- approval- or review-sensitive tool restrictions

This must remain:

- provider-neutral
- product-neutral
- channel-neutral

### 3. Constraint Policy Preconditions

Later runtime policy may need a neutral way to express:

- cost posture
- risk posture
- execution ceilings
- bounded suppression or refusal conditions

This is not a budget product surface.
It is a runtime-side constraint precondition only.

### 4. Stop-Loss / Escalation Preconditions

Later runtime policy may need a neutral way to express:

- when runtime should stop
- when runtime should suppress
- when runtime should surface an approval or escalation gate

This is the narrowest lawful bridge from current `policy-rule` and `confirm-gate` truth toward later approval-like runtime candidates.

## Mother-Runtime Safety Rule

This policy baseline may define:

- generic runtime-side preconditions
- generic runtime-side family names
- generic runtime-side constraints

It may not define:

- SoloCrew-specific management UX
- Secretary behavior
- product dashboard semantics
- provider routing logic
- channel policy products

## Why This Is Still Unfinished

Current repo reality is enough to say:

- policy-related foundation work exists
- the repo is not policy-empty

Current repo reality is also explicit that:

- full policy realization remains unfinished
- later blocker waves would still need bounded neutral runtime design work before implementation

## Baseline Judgment

The correct mother-runtime statement now is:

- the repo already has real policy-related foundations
- later role/model/tool/constraint policy support is a plausible bounded extension direction
- this wave freezes preconditions only and does not widen into a full policy engine
