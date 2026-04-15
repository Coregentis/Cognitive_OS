# CGOS-MANAGEMENT-OBJECT-FAMILY-DRAFT-v0.1

## Purpose

This baseline freezes the minimum generic mother-runtime implications of the management object family that SoloCrew `v0.4` has now formalized downstream.

The three downstream pressures are:

- directive-like control objects
- delivery-return-like result objects
- approval-request-like gate objects

This baseline does not claim these are:

- MPLP protocol objects
- implemented runtime objects
- product DTO authority inside `Cognitive_OS`

## Separation Rule

This baseline preserves a strict separation between:

- product contract semantics owned downstream
- possible future runtime backing semantics owned upstream

Downstream SoloCrew may freeze the product contracts now.
`Cognitive_OS` may only freeze what a future neutral runtime-family backing would have to mean if promotion becomes justified later.

## Current Repo Truth

Current `Cognitive_OS` already has nearby generic runtime concepts such as:

- `policy-rule`
- `confirm-gate`
- `decision-record`
- `trace-evidence`
- bounded policy and confirm service surfaces

It does not yet have an implemented runtime family for:

- management directives
- delivery returns
- approval requests

## Object-Family Draft

### 1. Directive-Like Control Objects

Possible generic runtime implication later:

- a neutral coordination or control-intent surface
- scoped interpretation rather than raw execution
- policy-aware rather than provider-bound

Must remain distinct from:

- product management wording
- product dispatch UX
- provider execution requests

Current judgment:

- keep product semantics downstream for now

### 2. Delivery-Return-Like Result Objects

Possible generic runtime implication later:

- a neutral bounded return or completion posture surface
- reusable result summarization over runtime-local state
- evidence-aware but not full timeline-complete

Must remain distinct from:

- product report DTOs
- dashboard cards
- enterprise analytics

Current judgment:

- keep product semantics downstream for now

### 3. Approval-Request-Like Gate Objects

Possible generic runtime implication later:

- a neutral gate or escalation surface
- policy and confirm aligned rather than UI-driven
- bounded decision-waiting posture rather than workflow engine breadth

Must remain distinct from:

- Secretary queue behavior
- enterprise approval chains
- channel approval routing

Current judgment:

- this is the closest family to an eventual runtime candidate because it touches existing confirm/policy concerns
- even so, current product contract authority remains downstream today

## What Promotion Would Need To Mean

If any of these families later move upward, promotion would need to mean:

- reusable neutral runtime semantics
- bounded scope and authority
- no silent product DTO import
- no silent protocol promotion

If promotion mainly serves:

- product UI convenience
- Secretary behavior
- dashboards
- channel routing

then the promotion is not justified.

## Non-Goals

This baseline does not define:

- schemas
- registry entries
- new runtime code
- new storage families
- new protocol content

## Baseline Judgment

The disciplined current judgment is:

- directive-like control objects: downstream product contract for now
- delivery-return-like result objects: downstream product contract for now
- approval-request-like gate objects: plausible later runtime candidate, but not yet runtime truth
