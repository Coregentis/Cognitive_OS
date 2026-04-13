# SCHEMA-CROSSWALK-SOLOCREW-v0.1

## Document Control

- Document ID: `SCHEMA-CROSSWALK-SOLOCREW-v0.1`
- Status: `Research Baseline`
- Authority: `Mother-runtime schema crosswalk note`
- Scope: `Neutral workforce schema naming versus downstream SoloCrew projection naming`
- Phase Constraint: `This note does not authorize product naming to replace mother-runtime authority`

## Purpose

This note records how the new neutral workforce schema family maps to likely SoloCrew projection nouns without allowing the product layer to define mother-runtime law.

## Crosswalk

| Downstream SoloCrew noun | Coregentis workforce object | Reason for neutral mother-runtime name |
|---|---|---|
| `Crew` | `agent-group` | Keeps the mother runtime reusable across products with different team nouns |
| `CrewMember` | `agent-worker` | Preserves lifecycle-bearing worker semantics without product branding |
| `Role` | `role-profile` | Treats the role definition as a reusable runtime profile |
| `Objective` | `objective` | Already neutral and reusable |
| `Task` / `Assignment` | `work-item` | Avoids product-specific workflow naming |
| `Review` / `Brief Cycle` | `review-cycle` | Keeps cadence governance neutral |
| `Crew Memory` | `memory-profile` | Retained memory surface stays runtime-private |
| `Preference` | `preference-profile` | Learned preference surface stays runtime-private |

## Binding Boundary

The crosswalk does not imply:

- MPLP binding
- protocol exportability
- product DTO shape
- UI vocabulary authority

All eight workforce objects remain `coregentis_private_runtime` objects.

## Relationship Hooks Preserved

The registry now preserves neutral relationship hooks needed for later downstream realization:

- `agent-group`
  - `contains`
  - `references`
  - `governs`
- `agent-worker`
  - `contains`
  - `references`
- `objective`
  - `contains`
  - `references`
  - `governs`
- `work-item`
  - `references`
  - `derived_from`
- `review-cycle`
  - `references`
  - `governs`
  - `evidences`
- `memory-profile`
  - `references`
  - `promoted_from`
  - `conflicts_with`
- `preference-profile`
  - `references`
  - `derived_from`
  - `promoted_from`

These hooks preserve room for later PSG and correction-loop work without implementing those runtime surfaces now.
