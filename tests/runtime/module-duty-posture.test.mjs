import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES,
} from "../../runtime/core/default-kernel-duty-posture.ts";
import {
  DEFAULT_MPLP_MODULE_POSTURES,
} from "../../runtime/core/default-mplp-module-posture.ts";
import {
  MPLP_KERNEL_DUTIES,
} from "../../runtime/core/kernel-duty-runtime-posture.ts";
import {
  MPLP_MODULES,
} from "../../runtime/core/mplp-module-posture.ts";

const REQUIRED_MODULE_NAMES = [
  "Context",
  "Plan",
  "Confirm",
  "Trace",
  "Role",
  "Dialog",
  "Collab",
  "Extension",
  "Core",
  "Network",
];

const REQUIRED_DUTY_IDS = [
  "KD-01",
  "KD-02",
  "KD-03",
  "KD-04",
  "KD-05",
  "KD-06",
  "KD-07",
  "KD-08",
  "KD-09",
  "KD-10",
  "KD-11",
];

function assertNonEmptyString(value, label) {
  assert.equal(typeof value, "string", label);
  assert.ok(value.trim().length > 0, label);
}

test("[runtime] MPLP module posture contract represents all 10 modules exactly once", () => {
  assert.equal(MPLP_MODULES.length, 10);
  assert.deepEqual(
    MPLP_MODULES.map((module) => module.module_name),
    REQUIRED_MODULE_NAMES
  );

  assert.equal(DEFAULT_MPLP_MODULE_POSTURES.length, 10);
  assert.deepEqual(
    DEFAULT_MPLP_MODULE_POSTURES.map((posture) => posture.module_name).sort(),
    [...REQUIRED_MODULE_NAMES].sort()
  );
  assert.equal(
    new Set(DEFAULT_MPLP_MODULE_POSTURES.map((posture) => posture.module_id)).size,
    10
  );
});

test("[runtime] MPLP module postures have minimum runtime and projection fields", () => {
  for (const posture of DEFAULT_MPLP_MODULE_POSTURES) {
    assertNonEmptyString(posture.cognitive_os_responsibility, `${posture.module_name} responsibility`);
    assert.ok(posture.runtime_owner_refs.length > 0, `${posture.module_name} owners`);
    assertNonEmptyString(posture.projection_safe_exposure, `${posture.module_name} exposure`);
    assertNonEmptyString(posture.evidence_posture, `${posture.module_name} evidence`);
    assertNonEmptyString(posture.product_boundary_rule, `${posture.module_name} boundary`);
    assertNonEmptyString(posture.realization_status, `${posture.module_name} status`);
  }
});

test("[runtime] Extension and Network are safe-deferred with explicit side-effect boundaries", () => {
  for (const module_name of ["Extension", "Network"]) {
    const posture = DEFAULT_MPLP_MODULE_POSTURES.find(
      (candidate) => candidate.module_name === module_name
    );

    assert.ok(posture, `${module_name} posture exists`);
    assert.equal(posture.realization_status, "unavailable_safe_deferred");

    const combined = [
      posture.cognitive_os_responsibility,
      posture.projection_safe_exposure,
      posture.evidence_posture,
      posture.product_boundary_rule,
      posture.notes,
    ].join(" ").toLowerCase();

    assert.match(combined, /not enabled|unavailable/);
    assert.match(combined, /provider/);
    assert.match(combined, /channel/);
    assert.match(combined, /dispatch/);
    assert.match(combined, /marketplace/);
  }
});

test("[runtime] Kernel Duty runtime posture contract represents all 11 duties exactly once", () => {
  assert.equal(MPLP_KERNEL_DUTIES.length, 11);
  assert.deepEqual(
    MPLP_KERNEL_DUTIES.map((duty) => duty.duty_id),
    REQUIRED_DUTY_IDS
  );

  assert.equal(DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES.length, 11);
  assert.deepEqual(
    DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES.map((posture) => posture.duty_id),
    REQUIRED_DUTY_IDS
  );
  assert.equal(
    new Set(DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES.map((posture) => posture.duty_id)).size,
    11
  );
});

test("[runtime] Kernel Duty runtime postures have minimum responsibility and exposure fields", () => {
  for (const posture of DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES) {
    assertNonEmptyString(posture.cognitive_os_responsibility, `${posture.duty_id} responsibility`);
    assert.ok(posture.owner_service_refs.length > 0, `${posture.duty_id} owners`);
    assert.ok(posture.runtime_object_family_refs.length > 0, `${posture.duty_id} object families`);
    assertNonEmptyString(posture.evidence_posture, `${posture.duty_id} evidence`);
    assertNonEmptyString(posture.projection_safe_exposure, `${posture.duty_id} exposure`);
    assertNonEmptyString(posture.product_boundary_rule, `${posture.duty_id} boundary`);
    assertNonEmptyString(posture.realization_status, `${posture.duty_id} status`);
  }
});
