import type { MplpModulePostureRecord } from "./mplp-module-posture.ts";

export const DEFAULT_MPLP_MODULE_POSTURES: MplpModulePostureRecord[] = [
  {
    module_id: "MPLP-CONTEXT",
    module_name: "Context",
    cognitive_os_responsibility:
      "Maintain neutral context intake, source references, continuation context, insufficiency posture, and safe summary boundaries.",
    runtime_owner_refs: ["FormService", "MemoryService", "ProjectionService"],
    projection_safe_exposure:
      "Expose bounded context summaries, source references, and omission markers; never expose raw workspace memory.",
    evidence_posture:
      "Context evidence must cite source references, stale or insufficient state, and runtime-private omission when relevant.",
    product_boundary_rule:
      "Downstream projections may label context for their experience, but Cognitive_OS owns neutral context posture.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: true,
    notes: "Current intake, memory, and projection services provide substrate; complete downstream handoff posture remains required.",
  },
  {
    module_id: "MPLP-PLAN",
    module_name: "Plan",
    cognitive_os_responsibility:
      "Represent neutral plan and next-step preparation posture without turning downstream workflow copy into runtime law.",
    runtime_owner_refs: ["RuntimeOrchestrator", "PolicyService", "ProjectionService"],
    projection_safe_exposure:
      "Expose plan summaries, proposed next posture, confirmation references, and evidence references only.",
    evidence_posture:
      "Plan posture must show whether required evidence is available, stale, insufficient, or blocked.",
    product_boundary_rule:
      "Downstream projections may render plans, but may not redefine planning semantics or execution readiness.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: true,
    notes: "Objective, work-item, and action-unit substrate exists; canonical plan posture is still minimum-foundation level.",
  },
  {
    module_id: "MPLP-CONFIRM",
    module_name: "Confirm",
    cognitive_os_responsibility:
      "Preserve human confirmation posture, bounded acceptance or rejection state, and non-executing review boundaries.",
    runtime_owner_refs: ["ConfirmService", "ProjectionService", "FrozenBindingService"],
    projection_safe_exposure:
      "Expose confirmation state summaries with safe evidence references and runtime-private omission markers.",
    evidence_posture:
      "Confirm evidence must cite confirm-gate references and distinguish review posture from side-effect completion.",
    product_boundary_rule:
      "Downstream projections may render confirmation UI, but Cognitive_OS owns confirmation posture.",
    realization_status: "explicit_runtime_realization",
    blocking_for_product_projection: false,
    notes: "Confirm-gate binding, export rules, and runtime tests already provide explicit first-pass realization.",
  },
  {
    module_id: "MPLP-TRACE",
    module_name: "Trace",
    cognitive_os_responsibility:
      "Preserve trace, evidence reference, omission, insufficiency, and non-proof posture for runtime and projection surfaces.",
    runtime_owner_refs: ["TraceService", "ProjectionService", "FrozenBindingService"],
    projection_safe_exposure:
      "Expose trace and evidence summaries with safe references, confidence posture, and explicit omission markers.",
    evidence_posture:
      "Trace evidence is a referenceable summary, not proof, certification, or hidden runtime truth.",
    product_boundary_rule:
      "Downstream projections may format trace summaries, but may not claim runtime proof or protocol authority.",
    realization_status: "explicit_runtime_realization",
    blocking_for_product_projection: true,
    notes: "Trace-evidence export is narrow and explicit; review/export packet composition still depends on this posture.",
  },
  {
    module_id: "MPLP-ROLE",
    module_name: "Role",
    cognitive_os_responsibility:
      "Maintain neutral role, worker, and responsibility posture without exposing private lifecycle records.",
    runtime_owner_refs: ["RegistryService", "ProjectionService", "worker lifecycle surfaces"],
    projection_safe_exposure:
      "Expose role and workforce summaries only through safe envelopes with private record omission.",
    evidence_posture:
      "Role evidence must cite assignment or lifecycle references without exporting raw worker state.",
    product_boundary_rule:
      "Downstream projections may name roles for display, but Cognitive_OS owns neutral role posture.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: false,
    notes: "Workforce projection-safe envelopes provide useful substrate but not complete module realization.",
  },
  {
    module_id: "MPLP-DIALOG",
    module_name: "Dialog",
    cognitive_os_responsibility:
      "Represent neutral request and turn posture when runtime continuation depends on conversational input.",
    runtime_owner_refs: ["FormService", "ProjectionService", "planned:DialogPostureService"],
    projection_safe_exposure:
      "Expose request summaries, source references, and omission markers only.",
    evidence_posture:
      "Dialog evidence must cite request sources and insufficiency posture without exposing raw conversational payloads.",
    product_boundary_rule:
      "Downstream projections may render conversation, but may not define dialog runtime law.",
    realization_status: "implicit_only",
    blocking_for_product_projection: true,
    notes: "Intent and delta-intent binding provides protocol-adjacent substrate; a neutral dialog posture remains needed.",
  },
  {
    module_id: "MPLP-COLLAB",
    module_name: "Collab",
    cognitive_os_responsibility:
      "Maintain neutral collaboration, review, coordination, and handoff posture across runtime participants.",
    runtime_owner_refs: ["RegistryService", "RuntimeOrchestrator", "ProjectionService"],
    projection_safe_exposure:
      "Expose collaboration summaries, participant role references, and handoff evidence references only.",
    evidence_posture:
      "Collaboration evidence must cite review, decision, or trace references without exposing private coordination internals.",
    product_boundary_rule:
      "Downstream projections may present collaboration flows, but Cognitive_OS owns neutral collaboration posture.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: false,
    notes: "Agent group, review cycle, and lifecycle substrate exist; product-facing consumption remains bounded.",
  },
  {
    module_id: "MPLP-EXTENSION",
    module_name: "Extension",
    cognitive_os_responsibility:
      "Maintain an explicit unavailable posture for extension surfaces until a governed neutral extension scope exists.",
    runtime_owner_refs: ["FrozenBindingService", "ProjectionService", "future:ExtensionPostureService"],
    projection_safe_exposure:
      "Expose only that extension capability is not enabled; do not expose external provider, channel routing, dispatch, or marketplace surfaces.",
    evidence_posture:
      "Evidence posture is an omission and unavailability marker with no side-effect claim.",
    product_boundary_rule:
      "Downstream projections must treat extension behavior as unavailable unless a later neutral contract authorizes it.",
    realization_status: "unavailable_safe_deferred",
    blocking_for_product_projection: false,
    notes: "Safe deferral is intentional for private-alpha posture.",
  },
  {
    module_id: "MPLP-CORE",
    module_name: "Core",
    cognitive_os_responsibility:
      "Maintain runtime identity, project scope, registry, binding, protocol version, and safe continuation posture.",
    runtime_owner_refs: ["RegistryService", "FrozenBindingService", "RuntimeOrchestrator", "ProjectionService"],
    projection_safe_exposure:
      "Expose core runtime summaries with protocol source references, binding version references, and omission markers.",
    evidence_posture:
      "Core evidence must distinguish protocol source truth, runtime interpretation, and projection-safe summary.",
    product_boundary_rule:
      "Downstream projections may consume core posture, but may not redefine runtime identity or protocol binding boundaries.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: true,
    notes: "Registry and binding assets exist; a unified downstream-ready core posture remains required.",
  },
  {
    module_id: "MPLP-NETWORK",
    module_name: "Network",
    cognitive_os_responsibility:
      "Maintain an explicit unavailable posture for network surfaces until governed neutral network scope exists.",
    runtime_owner_refs: ["FrozenBindingService", "ProjectionService", "future:NetworkPostureService"],
    projection_safe_exposure:
      "Expose only that network capability is not enabled; do not expose external provider, channel routing, dispatch, or marketplace surfaces.",
    evidence_posture:
      "Evidence posture is an omission and unavailability marker with no side-effect claim.",
    product_boundary_rule:
      "Downstream projections must treat network behavior as unavailable unless a later neutral contract authorizes it.",
    realization_status: "unavailable_safe_deferred",
    blocking_for_product_projection: false,
    notes: "Safe deferral preserves no external routing boundary for this foundation.",
  },
];
