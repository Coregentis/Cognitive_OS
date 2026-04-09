# CGOS-RELEASE-CHECKLIST-AND-GATES-v0.1

## Purpose

This document establishes the first executable release checklist and gate model for the `Cognitive_OS` repository.

It governs what must be true before claiming the first baseline release target:

- `v0.1.0`

## 1. Required Conditions Before Claiming `v0.1.0`

All of the following must be true:

1. the repository is initialized as a git repository
2. baseline branch exists
3. baseline branch is committed
4. baseline branch is pushed to remote
5. remote branch visibility is confirmed
6. release tag is created
7. changelog is aligned
8. baseline seal record exists
9. required governance review records exist

## 2. Exact Release Checklist

Checklist:

- repository governance baseline exists
- versioning and release baseline exists
- git truth-chain and branching baseline exists
- release checklist and gates baseline exists
- public repo visibility and IP boundary note exists
- baseline seal record exists
- changelog includes `Unreleased` and planned `v0.1.0`
- current implementation baseline artifacts intended for `v0.1.0` are present
- branch push is confirmed
- tag creation is confirmed

## 3. Required Artifacts

Required governance artifacts before claiming `v0.1.0`:

- `governance/baselines/CGOS-REPO-GOVERNANCE-BASELINE-v0.1.md`
- `governance/baselines/CGOS-VERSIONING-AND-RELEASE-BASELINE-v0.1.md`
- `governance/baselines/CGOS-GIT-TRUTH-CHAIN-AND-BRANCHING-BASELINE-v0.1.md`
- `governance/baselines/CGOS-RELEASE-CHECKLIST-AND-GATES-v0.1.md`
- `governance/baselines/CGOS-PUBLIC-REPO-VISIBILITY-AND-IP-BOUNDARY-NOTE-v0.1.md`
- `governance/records/CGOS-REPO-BASELINE-SEAL-v0.1.md`
- `CHANGELOG.md`

Required review/audit artifacts before claiming `v0.1.0`:

- repository governance review notes
- schema freeze review notes
- registry freeze review notes
- binding freeze review notes
- runtime-skeleton review note

## 4. FAIL Conditions

`v0.1.0` claim must fail if any of the following is true:

- repo is not initialized in git
- branch is not pushed
- remote visibility is not confirmed
- tag is not created
- changelog is missing or inconsistent
- seal record is missing
- required review records are missing
- release is claimed from local-only filesystem truth

## 5. Planned Release vs Actual Release

### Planned release

A planned release means:

- release target is named
- release scope is described
- baseline artifacts exist locally

It does **not** mean release truth exists.

### Actual release

An actual release means:

- git truth exists
- remote branch truth exists
- tag truth exists
- release checklist passes

## 6. Current Status Rule

Until git branch visibility and tag truth are confirmed, `v0.1.0` must be described only as:

- planned
- intended
- target

It must not be described as:

- released
- published
- tagged
- remotely visible baseline
