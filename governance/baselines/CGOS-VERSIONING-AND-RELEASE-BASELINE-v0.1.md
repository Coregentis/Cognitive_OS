# CGOS-VERSIONING-AND-RELEASE-BASELINE-v0.1

## Purpose

This document establishes the first versioning and release baseline for the Coregentis Cognitive OS repository.

It governs:

- repository governance versioning
- content stream versioning
- git tag and release versioning
- release naming
- release qualification

## 1. Version Domains

### 1.1 Governance document versioning

Governance markdown documents use:

`v<major>.<minor>`

Examples:

- `CGOS-REPO-GOVERNANCE-BASELINE-v0.1.md`
- `CGOS-BINDING-REVIEW-R3-v0.1.md`

Meaning:

- `v0.1` = first governed baseline or review revision within the `v0` stream

### 1.2 Content stream versioning

Repository content streams use path-level stream versions such as:

- `v0`

Meaning:

- `v0` = pre-release implementation stream
- stream version is broader than any single document revision

### 1.3 Git tag / release versioning

Git tag and release versioning use:

`v<major>.<minor>.<patch>`

Examples:

- `v0.1.0`
- `v0.1.1`
- `v0.2.0`
- `v1.0.0`

## 2. Version Bump Rules

### Patch bump

Patch bump applies when:

- wording or governance clarifications are added
- non-breaking repository baseline improvements are added
- release metadata or documentation is corrected

Example:

- `v0.1.0` -> `v0.1.1`

### Minor bump

Minor bump applies when:

- a new bounded implementation phase is added cleanly
- a new artifact class is added within the current authority order
- non-breaking foundational capability is added to the repository

Example:

- `v0.1.0` -> `v0.2.0`

### Major bump

Major bump applies when:

- repository scope or authority order changes materially
- compatibility assumptions across the repository baseline change materially
- a release marks transition from `v0` pre-release stream to a declared stable stream such as `v1.0.0`

## 3. Release Naming Rule

Release names must use:

- semantic version
- concise phase identity

Example release name:

- `v0.1.0 - Mother Runtime Foundation Baseline`

## 4. Release Qualification Rule

A repository release may only be claimed when all of the following are true:

- the repository exists as an initialized git repository
- the intended branch is committed
- the intended branch is visible on the configured remote
- the release tag exists in git truth
- the release notes/changelog entry is present

If any of these are missing, the repository may have a planned release target, but it may not claim an actual released state.

## 5. Baseline Definition For `v0.1.0`

The intended first git release target is:

- `v0.1.0`

Meaning:

- first repository-level mother-runtime foundation baseline
- governance baseline established
- schema, registry, and binding baselines present
- runtime skeleton phase started
- no claim of full runtime or product completeness

## 6. Current Release-State Caution

In the current local environment, there is no verified git repository state for `Cognitive_OS`.

Therefore:

- `v0.1.0` is an intended first git release target
- `v0.1.0` is not yet an achieved remote release truth in this environment
