# CGOS-REPO-GOVERNANCE-BASELINE-v0.1

## Purpose

This document establishes the first repository-level governance baseline for the Coregentis Cognitive OS repository as a mother-runtime foundation repository.

It defines what this repository is for, what belongs here, what does not belong here, and what authority order must remain intact as implementation expands.

## Repository Purpose

This repository exists to hold the governed implementation foundation of:

- Coregentis Cognitive OS as the mother runtime/governance substrate

It is a repository for:

- governance baselines
- imported protocol lock references
- Coregentis schema truth
- Coregentis registry truth
- Coregentis binding truth
- Coregentis runtime skeletons
- mother-runtime fixtures and tests

It is not a product repository first.

## Repository Scope

In scope for this repository:

- repository governance documents
- schema, registry, and binding artifacts
- runtime-skeleton and harness scaffolds
- mother-runtime test fixtures and test scaffolds
- future mother-runtime implementation modules

## Out-Of-Scope Items

Out of scope by default:

- TracePilot UI implementation
- product projection implementation
- product packaging/pricing logic
- projection DTOs that define product semantics
- domain-specific or enterprise-specific product surfaces
- product-only workflow abstractions treated as runtime truth

## Authority Order

This repository must preserve:

`MPLP Protocol Constitution -> Coregentis Cognitive OS -> Product Projections -> TracePilot`

Implications:

- MPLP remains upstream protocol constitution
- Coregentis remains the mother runtime substrate
- product projections remain downstream surfaces
- TracePilot remains downstream of product-projection rules

## Allowed Artifact Classes

Allowed artifact classes in this repo:

- governance baselines
- governance audits
- governance records
- imported protocol lock files
- Coregentis schema artifacts
- Coregentis registry artifacts
- Coregentis binding artifacts
- runtime skeleton and later runtime implementation artifacts
- test fixtures and test scaffolds
- mother-runtime technical documentation

## Forbidden Artifact Classes

Forbidden artifact classes in this repo unless governance explicitly expands scope later:

- TracePilot implementation code
- product UI code
- product-projection objects treated as runtime law
- ad hoc product-first APIs
- projection-specific workflow definitions masquerading as Coregentis constitution
- release claims that imply remote git truth when no remote release exists

## Current Open / Closed Boundary Caution

### Closed / frozen for the `v0` mother-runtime foundation stream

- import lock layer
- base schema layer
- object schema layer
- registry layer
- binding layer

### Open / still evolving

- runtime skeleton
- harness behavior
- future runtime implementation
- later product-projection work

### Caution

This repository is not yet established as a remote release truth chain in the current environment.

Therefore:

- local governance and implementation baselines may be drafted here
- but repository release claims must remain conditional until git truth, remote branch visibility, and release tagging are actually established
