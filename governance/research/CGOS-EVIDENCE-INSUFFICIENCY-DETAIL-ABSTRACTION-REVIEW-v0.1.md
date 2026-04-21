# CGOS Evidence Insufficiency Detail Abstraction Review v0.1

`doc_id: CGOS-EVIDENCE-INSUFFICIENCY-DETAIL-ABSTRACTION-REVIEW-v0.1`

## A. Purpose

This review evaluates whether `Cognitive_OS` should support a generic evidence
insufficiency detail abstraction.

## B. Problem Statement

A downstream projection consumer may need structured explanation of why
evidence is insufficient, stale, omitted, or not available, without exposing
raw runtime-private records.

## C. Candidate Abstraction

Candidate abstraction:

- generic evidence insufficiency detail

The abstraction should describe:

- evidence availability
- insufficiency category
- stale category
- omission reason
- required evidence class
- safe evidence references
- safe next clarification prompt
- non-executing posture
- runtime-private omission

## D. Fit Assessment

| Criterion | Assessment | Notes |
|---|---|---|
| generic across downstream products | `YES` | insufficiency explanation is not inherently product-specific |
| compatible with existing RuntimeEvidencePostureSummary | `YES` | the candidate can extend posture semantics without widening execution |
| does not expose raw trace / raw graph / raw runtime store | `YES` | safe refs and omission-aware detail can remain summary-only |
| supports projection revision without execution | `YES` | insufficiency detail can inform revision while staying non-executing |
| does not require schema change | `YES` | current wave is review/draft only |
| does not require MPLP change | `YES` | the candidate remains below protocol law |

## E. Risks

- evidence summary being mistaken as proof
- insufficiency detail being mistaken as rejection
- stale evidence being mistaken as execution failure
- product-specific terms leaking into runtime abstraction

## F. Decision

`CGOS_EVIDENCE_INSUFFICIENCY_DETAIL_ABSTRACTION_REVIEW_READY`
