# CGOS Projection-Safe Contract Test Plan v0.1

`CGOS-PROJECTION-SAFE-CONTRACT-TEST-PLAN-v0.1`

## A. Purpose

This test plan defines the required tests for the future projection-safe
contract implementation wave.

## B. Required Test File

The future implementation wave must create:

- `tests/runtime/projection-safe-contract.test.mjs`

## C. Required Test Cases

At minimum, the future test file must prove:

- creates deterministic state exposure summary
- preserves `transition_accepted` as state evaluation, not approval
- preserves `terminal` as state-line terminal, not execution complete
- creates evidence posture summary without proof or certification semantics
- marks stale and insufficient evidence distinctly
- creates non-executing recommendation envelope
- blocks approve, reject, dispatch, execute, and provider-channel labels as
  actions
- creates projection summary envelope without raw runtime internals
- rejects raw runtime-like keys
- preserves project isolation
- avoids downstream product object references
- all summaries are JSON-serializable

## D. Required Negative Fixtures

Future tests must include negative fixtures for:

- `raw_vsl`
- `raw_psg`
- `raw_trace`
- `drift_record`
- `learning_candidate`
- `provider_channel_result`
- `product_dto`
- `approved`
- `rejected`
- `dispatched`
- `executed`

## E. Final Decision

`CGOS_PROJECTION_SAFE_CONTRACT_TEST_PLAN_READY`

The future implementation wave now has a bounded and explicit test checklist
for proving deterministic, non-executing, projection-safe contract behavior.
