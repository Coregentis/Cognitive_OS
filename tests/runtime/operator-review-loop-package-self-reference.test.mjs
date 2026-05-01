import assert from "node:assert/strict";
import test from "node:test";

const bundleSubpath = "cognitive_os/runtime/public/operator-review-loop-handoff-bundle";
const dtoSubpath = "cognitive_os/runtime/public/operator-review-loop-dto";

const expectedBundleExports = [
  "PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_BUNDLE_VERSION",
  "PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_COMPATIBILITY_PROFILE",
  "PROJECTION_SAFE_OPERATOR_REVIEW_LOOP_RUNTIME_CONTRACT_VERSION",
  "createProjectionSafeOperatorReviewLoopBundle",
  "summarizeProjectionSafeOperatorReviewLoopBundle",
  "validateProjectionSafeOperatorReviewLoopBundle",
];

test("[runtime] package self-reference resolves handoff bundle subpath", async () => {
  const module = await import(bundleSubpath);

  for (const exportName of expectedBundleExports) {
    assert.equal(Object.hasOwn(module, exportName), true, exportName);
  }

  assert.equal(typeof module.createProjectionSafeOperatorReviewLoopBundle, "function");
  assert.equal(typeof module.validateProjectionSafeOperatorReviewLoopBundle, "function");
  assert.equal(typeof module.summarizeProjectionSafeOperatorReviewLoopBundle, "function");
});

test("[runtime] package self-reference resolves type-only DTO subpath", async () => {
  const module = await import(dtoSubpath);

  assert.deepEqual(Object.keys(module), []);
});
