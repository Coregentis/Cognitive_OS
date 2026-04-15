# CGOS-ROLE-MODEL-TOOL-CONSTRAINT-POLICY-v0.1

## Document Control

- Document ID: `CGOS-ROLE-MODEL-TOOL-CONSTRAINT-POLICY-v0.1`
- Status: `Runtime Policy Surface Draft`
- Authority: `Mother-runtime research draft derived from SoloCrew compile and management demands`
- Scope: `Bounded runtime policy surfaces only`
- Phase Constraint: `Docs-only. This note does not implement a new policy engine.`

## Purpose

This note drafts the runtime policy surface that SoloCrew is beginning to need beyond the current minimal confirm-gate baseline.

The current runtime truth is:

- `policy-rule` already exists as a runtime object type
- `policy-service.ts` currently supports only the minimal scenario-based confirm path

This draft defines the next bounded policy surface family without claiming it already exists in code.

## Draft Policy Families

### 1. Role-model binding policy

Purpose:

- determine which roles may use which model classes or execution classes
- preserve bounded role-specific execution posture without turning product prompts into runtime law

This surface is likely to govern relations among:

- `role-profile`
- `agent-worker`
- compiled crew topology
- available capability supply

### 2. Tool policy

Purpose:

- determine which roles or work modes may access which tool classes
- constrain tool usage by scope, role, or approval conditions

This surface should remain:

- provider-neutral
- product-neutral
- reusable across products

### 3. Cost / constraint policy

Purpose:

- enforce bounded runtime constraints such as cost posture, risk posture, and execution ceilings
- provide runtime-side constraint meaning without turning product budgets into mother-runtime dashboards

This is not a budget runtime.
It is a runtime constraint surface.

### 4. Stop-loss / escalation policy

Purpose:

- define when runtime should stop, suppress, or escalate
- bind approval or review triggers into reusable runtime behavior

This surface should relate to existing runtime concepts such as:

- `policy-rule`
- `confirm-gate`
- `review-cycle`
- bounded later escalation outputs

## Distinction From Business-Pack Specifics

This runtime policy draft does not own domain business logic.

Business-pack specifics may later contribute:

- policy inputs
- policy overlays
- domain-specific thresholds

But the runtime policy surface itself should remain generic and reusable.

Examples of what should stay out of core runtime policy by default:

- product-specific KPI dashboards
- niche domain operating playbooks
- UI approval wording
- market-specific or app-specific business logic

## Relation To Crew Compiler

If `Crew Compiler` later exists as a runtime-family surface, it should depend on this policy family for:

- role policy bindings
- tool constraints
- escalation triggers
- stop-loss posture

The compiler should not swallow the policy engine.

## Relation To Current Runtime

Current runtime remains truthful and minimal:

- minimal confirm gating exists
- no broad role/tool/cost policy surface exists yet

This draft therefore records a bounded extension direction, not a claim of existing implementation.

## Non-Goals

This draft does not define:

- provider-specific routing
- business-pack dashboards
- channel policy
- budget product features
- full autonomous governance
- protocol promotion

## Net Draft Judgment

The next bounded policy family `Cognitive_OS` may need for SoloCrew is:

- role-model binding
- tool policy
- cost / constraint policy
- stop-loss / escalation policy

It should stay runtime-family and generic, while business-pack specifics remain layered above it.
