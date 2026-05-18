# TRI-REPO-BOUNDARY-CORRECTION-PATCH-v0.1

## Document Control

- doc_id: TRI-REPO-BOUNDARY-CORRECTION-PATCH-v0.1
- task_id: TRI-REPO-BOUNDARY-CORRECTION-PATCH
- wave_type: Correction Patch + Boundary Sanitization
- date: 2026-05-18
- authority_order: MPLP -> Cognitive_OS -> SoloCrew
- reference_audit:
  `governance/audits/TRI-REPO-HISTORICAL-MPLP-BOUNDARY-COMPLIANCE-AUDIT-v0.1.md`
- status: boundary correction with legacy exceptions
- no_new_operator_work_packet_contract: true
- no_solocrew_app_implementation: true
- no_provider_execution: true
- no_mplp_schema_change: true
- no_mplp_protocol_law_change: true
- no_mplp_normative_binding_change: true

## Repo Truth Snapshot

Remote truth was fetched before this correction patch.

| Repo | URL | Branch | Starting local HEAD | Starting origin HEAD | Worktree at start |
| --- | --- | --- | --- | --- | --- |
| SoloCrew | https://github.com/Coregentis/SoloCrew.git | main | e7c9e96e90643b17a7b4609474bb18c229f0d59e | e7c9e96e90643b17a7b4609474bb18c229f0d59e | clean |
| Cognitive_OS | https://github.com/Coregentis/Cognitive_OS.git | main | 4b3ba6036c2cb1a7ad531bdcde3a6df4f2a8e789 | 4b3ba6036c2cb1a7ad531bdcde3a6df4f2a8e789 | approved untracked `.DS_Store` local noise only |
| MPLP-Protocol | https://github.com/Coregentis/MPLP-Protocol.git | main | 214939ab6ba522036d376868d1fe8d04d960420f | 214939ab6ba522036d376868d1fe8d04d960420f | approved untracked `.DS_Store` local noise only |

Approved local noise observed:

- Cognitive_OS: `.DS_Store`, `governance/.DS_Store`, `runtime/.DS_Store`,
  `tests/.DS_Store`
- MPLP-Protocol: `.DS_Store`, `.github/.DS_Store`,
  `examples/.DS_Store`, `governance/.DS_Store`, `packages/.DS_Store`,
  `scripts/.DS_Store`, `tests/.DS_Store`

No `.DS_Store` file is tracked, staged, committed, or pushed by this patch.

## Scope

This patch addresses the two boundary findings accepted from the historical
audit:

1. SoloCrew's sealed legacy bridge directly imports Cognitive_OS
   runtime-private internals.
2. Cognitive_OS has historical runtime-private `cell-*` / `cell_` naming.

This patch does not implement a new Cognitive_OS operator work-packet
contract, does not implement SoloCrew OPC app capability, and does not modify
MPLP-Protocol.

## SoloCrew Legacy Bridge Decision

Decision:

`EXPLICIT_LEGACY_EXCEPTION_GATE`

Rationale:

- `runtime-imports/cognitive-runtime.ts` is still used by existing SoloCrew
  runtime-session compatibility paths.
- Earlier bridge-replacement records require separate authorization before
  bridge deletion, reduction, bypass, or retirement.
- Current Cognitive_OS public DTO surfaces are evidence/projection surfaces and
  are not sufficient to replace all runtime-session construction, state,
  learning, lifecycle, and local bounded dispatcher compatibility behavior.

Correction implemented:

- The bridge source remains byte-for-byte protected; existing SoloCrew tests
  treat unauthorized bridge-file mutation as a retirement/bypass risk.
- `SOLOCREW_RUNTIME_SESSION_FACADE_BOUNDARY` now carries machine-checkable
  exception-gate fields:
  - `legacy_exception_gate: true`
  - `opc_foundation_use_allowed: false`
  - `projection_safe_consumption_evidence: false`
  - `release_blocking_migration_debt: true`
  - `no_new_use: true`
- Focused tests assert that the bridge remains quarantined, cannot evidence
  OPC projection-safe consumption, and remains the only direct relative
  Cognitive_OS runtime importer.

Boundary result:

`SOLOCREW_LEGACY_BRIDGE_EXCEPTION_GATED`

The bridge remains retained compatibility debt. It is not a compliant
downstream consumption proof under the current hard gate, and new OPC
Foundation paths must not route through it.

## Cognitive_OS Legacy Naming Decision

Decision:

`EXPLICIT_RUNTIME_PRIVATE_LEGACY_EXCEPTION_GATE`

Rationale:

- Historical `cell-runtime-scope`, `cell-summary-runtime-record`, and
  `cell_runtime_scope_id` names are embedded in runtime-private schemas,
  registry, binding metadata, runtime state persistence, projection rejection
  checks, and existing tests.
- A direct rename would risk schema/registry churn and compatibility fallout
  during a boundary-correction wave.
- The terms are not present in `runtime/public` package exports and must not
  become public contract names, MPLP binding terminology, or protocol law.

Correction implemented:

- Added a runtime test that proves legacy cell naming remains absent from
  `runtime/public`.
- Added a runtime test that confines legacy cell naming to an explicit
  allowlist of runtime-private, test, governance, or historical exception
  files.
- Tightened public-surface DTO export tests so downstream/product terms
  including `secretary`, `OPC`, `company dashboard`, `mission room`, and
  `work packet` remain absent from current public DTO files.
- Tightened public-surface package export tests so `cell-runtime-scope`,
  `cell-summary-runtime-record`, `cell_runtime_scope`,
  `cell_summary_runtime_record`, `CellRuntimeScopeRecord`, and
  `CellSummaryRuntimeRecord` remain absent from exported public DTO surfaces.

Boundary result:

`CGOS_LEGACY_CELL_NAMING_EXCEPTION_GATED`

The current legacy names remain runtime-private historical debt only. They are
not protocol terminology, not MPLP binding terminology, not public DTO/export
terminology, and not product semantics promotion. Future neutralization remains
required before any such family is exposed publicly.

## MPLP-Protocol Boundary

MPLP-Protocol was reference-only in this patch.

- no MPLP schema change
- no MPLP protocol law change
- no MPLP normative binding change
- no product-specific language added to MPLP
- no runtime endorsement, certification, formal assurance, or compliance claim

No anonymous candidate/backlog note was required because this patch only gates
existing downstream/runtime boundary debt and does not reveal an MPLP semantic
gap.

## Files Changed

SoloCrew:

- `app/shell/runtime-session-facade.ts`
- `tests/app/runtime-session-boundary.test.ts`
- `CHANGELOG.md`

Cognitive_OS:

- `tests/runtime/upstream-public-surface-dto-implementation-export.test.mjs`
- `tests/runtime/runtime-private-legacy-naming-boundary.test.mjs`
- `governance/audits/TRI-REPO-BOUNDARY-CORRECTION-PATCH-v0.1.md`
- `CHANGELOG.md`

MPLP-Protocol:

- none

## Test Evidence

Focused checks completed before final full-suite verification:

| Repo | Command | Result |
| --- | --- | --- |
| SoloCrew | `node --experimental-strip-types --test tests/app/runtime-session-boundary.test.ts` | PASS, 5 tests |
| Cognitive_OS | `node --test tests/runtime/upstream-public-surface-dto-implementation-export.test.mjs tests/runtime/runtime-private-legacy-naming-boundary.test.mjs` | PASS, 13 tests |

Full-suite and grep evidence is recorded in the final operator report for this
patch.

## Boundary Proof

- SoloCrew legacy bridge was exception-gated, not retired or replaced.
- No new SoloCrew direct Cognitive_OS runtime-private import was introduced.
- Cognitive_OS historical `cell-*` / `cell_` naming was exception-gated as
  runtime-private legacy debt.
- No `cell-*` / `cell_` naming appears in `runtime/public` exports.
- No SoloCrew app implementation was introduced.
- No new Cognitive_OS operator work-packet contract was introduced.
- No provider execution, worker execution bridge, external channel, payment,
  publishing, or customer outreach capability was introduced.
- No MPLP schema, protocol law, or normative binding changed.
- No product semantic leakage entered MPLP.

## Remaining Debt

P1 remaining:

- `CGOS-MPLP-BINDING-CORRECTION-PATCH`: add non-normative Cognitive_OS-side
  MPLP Binding / MPGC mapping for existing `runtime/public` package surfaces.

P2 remaining:

- SoloCrew bridge retirement or replacement requires a separate public-contract
  handoff and migration plan.
- Cognitive_OS legacy runtime-private `cell-*` naming should be neutralized or
  aliased in a future compatibility-aware runtime-private schema migration
  before any related family becomes public.

## Correction Decision

`BOUNDARY_CORRECTION_PASS_WITH_LEGACY_EXCEPTION`

## Next Allowed Task

`CGOS-MPLP-BINDING-CORRECTION-PATCH`

Reason:

Boundary debt is now exception-gated, but existing Cognitive_OS public surfaces
still need explicit per-surface and per-component MPLP Binding / MPGC mapping
before new operator work-packet contract implementation should proceed.
