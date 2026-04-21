# CGOS Independent Versioning Decision Record v0.1

`doc_id: CGOS-INDEPENDENT-VERSIONING-DECISION-RECORD-v0.1`

## A. Purpose

Record an independent Cognitive_OS versioning decision for the projection
revision runtime surface.

## B. Problem

Cognitive_OS cannot inherit downstream product version numbers. Projection
revision runtime surface readiness must be assigned to an independent
Cognitive_OS release line.

## C. Candidate Version Options

| Option | Meaning | Pros | Cons | Decision |
| --- | --- | --- | --- | --- |
| `Cognitive_OS v0.2` | early broader runtime version increment | stays inside the current `v0.x` family | still implies a broader platform-line move without a general version policy | `NOT_SELECTED` |
| `Cognitive_OS v0.3` | later broader runtime version increment | leaves room for multiple capability surfaces | still overstates a broader platform-line decision not yet made | `NOT_SELECTED` |
| `Cognitive_OS projection-revision-runtime RC` | capability-line RC for the projection revision runtime surface | matches the actual bounded runtime capability, keeps versioning independent, and avoids false platform-level claims | not a full platform version assignment | `SELECTED` |
| `Cognitive_OS v1.0` | first full platform release line | simple and recognizable | far beyond the independently sealed scope of the current capability surface | `NOT_SELECTED` |
| `Cognitive_OS v1.2` | downstream-aligned version import | would align numerically with a downstream product line | invalid because downstream-aligned versioning is not an independent Cognitive_OS version decision | `REJECTED` |

## D. Decision

`CGOS_VERSION_DECISION_PROJECTION_REVISION_RUNTIME_RC`
