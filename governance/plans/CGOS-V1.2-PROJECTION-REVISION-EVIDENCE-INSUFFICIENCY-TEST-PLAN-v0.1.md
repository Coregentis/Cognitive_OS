# CGOS V1.2 Projection Revision and Evidence Insufficiency Test Plan v0.1

`doc_id: CGOS-V1.2-PROJECTION-REVISION-EVIDENCE-INSUFFICIENCY-TEST-PLAN-v0.1`

## A. Purpose

This document plans future tests for projection revision envelopes and evidence
insufficiency detail.

## B. Required Future Tests

| Test | Purpose | Expected result |
|---|---|---|
| creates valid evidence insufficiency detail | prove happy-path insufficiency detail construction | detail object created deterministically |
| rejects missing detail_id | enforce required identifiers if applicable to validation path | validation fails deterministically |
| rejects non_executing false | preserve non-executing boundary | validation fails deterministically |
| rejects runtime_private_fields_omitted false | preserve omission boundary | validation fails deterministically |
| rejects evidence-as-proof wording if present as claim | keep evidence detail below proof semantics | validation fails deterministically |
| creates valid projection revision envelope | prove happy-path revision envelope construction | revision envelope created deterministically |
| rejects missing previous_projection_summary_id | preserve revision lineage | validation fails deterministically |
| rejects invalid revision_reason | preserve enum discipline | validation fails deterministically |
| rejects evidence_insufficiency project mismatch | preserve nested project consistency | validation fails deterministically |
| rejects raw runtime-like keys | keep raw runtime internals out | validation fails deterministically |
| rejects forbidden action labels | keep action/control semantics out | validation fails deterministically |
| preserves safe_evidence_refs only | prove safe refs survive while unsafe refs do not | safe refs remain bounded |
| store persists and retrieves revision envelope if store option selected | prove project-adjacent revision retrieval | deterministic retrieval succeeds |
| no provider/channel semantics | protect execution boundary | no such semantics appear |
| no approve/reject/dispatch/execute semantics | protect direct-control boundary | no such semantics appear |
| no queue semantics | protect queue boundary | no such semantics appear |

## C. Validation Command Plan

- inspect package scripts first
- run targeted node test files if present
- if no `test` script exists, use planned targeted test command
- do not report missing `npm` test script as implementation failure

## D. Decision

`CGOS_V1_2_PROJECTION_REVISION_EVIDENCE_INSUFFICIENCY_TEST_PLAN_READY`
