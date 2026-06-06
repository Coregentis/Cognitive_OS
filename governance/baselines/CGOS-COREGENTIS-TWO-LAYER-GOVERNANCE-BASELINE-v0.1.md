---
entry_surface: repository
entry_model_class: runtime_downstream
doc_type: governance
status: final
authority: repository
doc_id: "CGOS-COREGENTIS-TWO-LAYER-GOVERNANCE-BASELINE-v0.1"
surface_role: runtime_downstream_governance
record_state: final
title: "CGOS Coregentis Two-Layer Governance Baseline v0.1"
---

# CGOS Coregentis Two-Layer Governance Baseline v0.1

## Purpose

This record closes the Coregentis two-layer governance baseline for
`Cognitive_OS` as the runtime downstream repo.

The Coregentis canonical workspace root is
`/Users/jasonwang/Documents/AI_Dev/Coregentis`.

## Repository Role

| Field | Value |
|:---|:---|
| Repo | `/Users/jasonwang/Documents/AI_Dev/Coregentis/Cognitive_OS` |
| Role | `RUNTIME_DOWNSTREAM` |
| Authoritative upstream | `/Users/jasonwang/Documents/AI_Dev/Coregentis/MPLP-Protocol-Dev` |
| Downstream | `/Users/jasonwang/Documents/AI_Dev/Coregentis/SoloCrew` |
| Remote authority | `origin` after inspection, task branches only unless explicitly authorized |
| Not authority for | MPLP protocol truth, package truth, public OSS projection truth, package publication |

## Two-Layer Governance

Layer A: Repository Governance defines runtime source surfaces, runtime-private
surfaces, projection-safe DTO surfaces, generated/evidence surfaces, remote
authority, and downstream boundaries.

Layer B: Codex Agentic Harness requires
`.agents/skills/agentic-harness-goal-preflight/SKILL.md` and
`governance/codex-goals/CODEX-GOAL-TEMPLATE.md` for every non-trivial Goal.
Goals must execute `SCTM`, `GLFB`, `ITCM`, `RBCT`, `VIM`, and `PRM`.

Repository methods `DIV`, `TSV`, `XCV`, `SCV`, `SUC`, and `EVC` apply only when
the Goal touches their relevant repository surfaces.

## SOT Boundary

| Layer | Boundary |
|:---|:---|
| `L0 Protocol Truth` | MPLP-Protocol-Dev only |
| `L1 Projection Source` | Runtime binding source and projection-safe DTO source |
| `L2 Generated Artifact` | Generated runtime artifacts only with provenance |
| `L3 Verification Evidence` | Runtime evidence only, not protocol mutation authority |
| `L4 Publication Surface` | Public runtime claims require owner approval |
| `L5 Downstream Runtime/Product` | Cognitive OS is runtime downstream; SoloCrew is product downstream |
| `L6 Codex Execution Governance` | `AGENTS.md`, `.codex/config.toml`, `.agents/skills`, `.codex/skills`, Goal Template |

## Discovery And Truth Chain

Discovery Chain:
SoloCrew user need / Wow moment -> product requirement -> Cognitive OS neutral
runtime requirement -> MPLP definition mapping -> MPLP Candidate / MPGC.

Truth Chain:
MPLP -> Cognitive OS -> SoloCrew.

Runtime evidence may become candidate input, but it must not directly mutate
MPLP L0 protocol truth.

## Forbidden Authority Misuse

This repo must not be used as MPLP protocol truth, package truth, package
publication root, public OSS projection authority, npm publish root, PyPI upload
root, registry mutation authority, tag authority, seal authority, PR merge
authority, or L0 schema mutation authority without explicit owner approval.

V1.0_release is frozen as migration/evidence source only and must not be
treated as global MPLP SOT.

## Cross-Repo Rules

MPLP -> Cognitive OS consumption requires an explicit runtime binding or
consumption goal. Cognitive OS -> SoloCrew projection requires explicit
projection/consumption scope. No cross-repo sync, copy, cherry-pick, source
restoration, or dist restoration is authorized by this baseline.

## Blocking Verdicts

Relevant blockers include:

- `BLOCKED_WORKSTREAM_AUTHORITY_MISMATCH`
- `BLOCKED_LOCAL_REPO_AUTHORITY_MISMATCH`
- `BLOCKED_REMOTE_AUTHORITY_MISMATCH`
- `BLOCKED_CROSS_REPO_SYNC_NOT_AUTHORIZED`
- `BLOCKED_OWNER_AUTHORIZATION_REQUIRED`
- `BLOCKED_PUBLIC_PROJECTION_AUTHORIZATION_REQUIRED`
- `BLOCKED_V1_USED_AS_GLOBAL_MPLP_SOT`
- `BLOCKED_DEV_TRUTH_REQUIRED`
- `BLOCKED_DOWNSTREAM_REPO_USED_AS_PROTOCOL_TRUTH`
- `BLOCKED_SCHEMA_TRUTH_SOURCE_MISSING`
- `BLOCKED_L0_MUTATION_WITHOUT_SCHEMA_INTAKE`
- `BLOCKED_RUNTIME_NEED_DIRECTLY_MUTATES_PROTOCOL`

## Forbidden Action Compliance

No npm publish. No PyPI upload. No tag. No seal. No merge. No registry
mutation. No package version change. No L0 schema mutation. No package artifact
generation. No source/dist restoration. No public projection push is authorized
by this baseline.

## Final Verdict

`RUNTIME_DOWNSTREAM_TWO_LAYER_GOVERNANCE_BASELINE_RECORDED`
