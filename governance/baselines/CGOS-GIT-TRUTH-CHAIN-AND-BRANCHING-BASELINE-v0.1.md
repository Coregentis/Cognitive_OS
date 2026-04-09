# CGOS-GIT-TRUTH-CHAIN-AND-BRANCHING-BASELINE-v0.1

## Purpose

This document establishes the first git truth-chain and branching baseline for the `Cognitive_OS` repository.

It exists to turn repository governance from principle-level baseline into executable git discipline.

## 1. Branch Roles

### Baseline branch

Expected baseline branch:

- `main`

Role:

- canonical public baseline branch
- intended branch for sealed baseline visibility
- intended branch for future release tagging

### Working branches

Allowed working branch roles:

- feature branches
- phase branches
- repair branches

Examples:

- `feature/runtime-skeleton-r1`
- `phase/mother-runtime-foundation`
- `repair/release-checklist-fix`

Role:

- isolated work before baseline integration
- no claim of baseline truth by default

## 2. Baseline Branch Expectation

The baseline branch should hold:

- sealed governance baselines
- sealed schema/registry/binding/runtime-skeleton artifacts for the current stream
- changelog state aligned with release intent

The baseline branch must not be treated as authoritative if:

- local-only edits exist
- push has not succeeded
- branch visibility on remote is not confirmed

## 3. Commit Discipline

Required discipline:

- commits should group coherent governance or implementation units
- one commit should not mix unrelated governance and runtime changes without reason
- commit messages should reflect repository truth rather than task chatter

Recommended commit style:

- `governance: add repo baseline and release gates`
- `schemas: freeze v0 base schema layer`
- `runtime: add minimal skeleton interfaces`

## 4. Push-Before-Review Rule

Rule:

No repository state should be treated as public review truth unless the relevant branch is pushed and visible on the configured remote.

Implication:

- local filesystem truth is not enough for public repo review
- local changes may support drafting
- pushed branch truth is required before claiming public branch visibility

## 5. Tag Creation Rule

Rule:

A git tag may only be created when:

- baseline branch state is committed
- baseline branch is pushed
- release checklist passes
- seal record exists
- changelog and release baseline are aligned

No tag should be created for:

- local-only states
- unpushed branches
- incomplete baseline states

## 6. What Counts As Git Truth For This Repo

Git truth for this repo means:

- a committed state in a git repository
- on a named branch
- visible on the configured remote where applicable
- tag-backed when claiming a release

## 7. What Does Not Count As Git Truth

The following do not count as git truth by themselves:

- local working directory edits
- copied files outside a git repository
- markdown release intentions without commit/tag state
- screenshots or memory of prior repo state
- public URL intention without visible pushed branch

## 8. Current Practical Caution

In the current local environment, `Cognitive_OS` has not been confirmed as a local git repository.

Therefore:

- this baseline defines the rules for future git truth
- it does not claim that current local state already satisfies them
