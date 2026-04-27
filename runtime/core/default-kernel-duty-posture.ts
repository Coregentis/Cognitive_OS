import type { KernelDutyRuntimePostureRecord } from "./kernel-duty-runtime-posture.ts";

export const DEFAULT_KERNEL_DUTY_RUNTIME_POSTURES: KernelDutyRuntimePostureRecord[] = [
  {
    duty_id: "KD-01",
    duty_name: "Coordination",
    duty_slug: "coordination",
    cognitive_os_responsibility:
      "Coordinate registered runtime objects, policy checks, continuation anchors, and bounded handoffs without downstream workflow semantics.",
    owner_service_refs: ["RuntimeOrchestrator", "RegistryService", "FrozenBindingService"],
    runtime_object_family_refs: ["project", "objective", "work-item", "review-cycle", "agent-worker"],
    evidence_posture:
      "Coordination decisions that affect continuation or handoff posture must leave safe decision or trace references.",
    projection_safe_exposure:
      "Expose bounded coordination summaries, source references, and runtime-private omission markers only.",
    product_boundary_rule:
      "Downstream projections may name workflows, but Cognitive_OS owns neutral coordination posture.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: true,
    notes: "Runtime orchestration and registry or binding services provide substrate; completion gates still apply.",
  },
  {
    duty_id: "KD-02",
    duty_name: "Error Handling",
    duty_slug: "error-handling",
    cognitive_os_responsibility:
      "Represent recoverable runtime gaps, blocked states, stale context, and evidence insufficiency without product verdict semantics.",
    owner_service_refs: ["ProjectionService", "PolicyService", "ReconcileService"],
    runtime_object_family_refs: ["conflict-case", "drift-record", "decision-record", "trace-evidence"],
    evidence_posture:
      "Error posture must distinguish insufficiency, stale state, conflict, and policy block with safe evidence references.",
    projection_safe_exposure:
      "Expose bounded error and insufficiency summaries; never expose raw runtime-private payloads.",
    product_boundary_rule:
      "Downstream projections may render error copy but must preserve neutral error posture.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: true,
    notes: "Projection revision, evidence insufficiency, and policy blocks cover first-pass posture.",
  },
  {
    duty_id: "KD-03",
    duty_name: "Event Bus",
    duty_slug: "event-bus",
    cognitive_os_responsibility:
      "Preserve neutral event and timeline posture for runtime steps without requiring a downstream event bus.",
    owner_service_refs: ["RuntimeOrchestrator", "TraceService", "future:EventPostureService"],
    runtime_object_family_refs: ["runtime-event-timeline-entry", "trace-evidence", "decision-record"],
    evidence_posture:
      "Events that affect runtime state or export posture must be traceable by id or reference, not treated as proof.",
    projection_safe_exposure:
      "Expose event summaries and references only; omit internal routing mechanics.",
    product_boundary_rule:
      "Downstream projections may create local histories, but may not redefine Cognitive_OS event semantics.",
    realization_status: "implicit_only",
    blocking_for_product_projection: false,
    notes: "Timeline substrate exists; a full neutral event bus is not claimed in this foundation.",
  },
  {
    duty_id: "KD-04",
    duty_name: "Learning Feedback",
    duty_slug: "learning-feedback",
    cognitive_os_responsibility:
      "Capture neutral correction, preference, and learning-candidate posture without automatic global learning or training semantics.",
    owner_service_refs: ["CorrectionCapturePort", "PreferenceWritebackService", "governed learning path"],
    runtime_object_family_refs: ["learning-candidate", "preference-profile", "memory-promotion-record"],
    evidence_posture:
      "Feedback evidence must identify source correction or preference references and whether learning is candidate, accepted, rejected, or deferred.",
    projection_safe_exposure:
      "Expose suggestion and candidate posture only; no raw training data or automatic mutation claim.",
    product_boundary_rule:
      "Downstream projections may surface feedback loops but cannot promote them into Cognitive_OS runtime law.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: false,
    notes: "Current correction and preference writeback services provide neutral first-pass coverage.",
  },
  {
    duty_id: "KD-05",
    duty_name: "Observability",
    duty_slug: "observability",
    cognitive_os_responsibility:
      "Preserve trace, evidence, omission, and export-preparation posture for runtime and projection surfaces.",
    owner_service_refs: ["TraceService", "ProjectionService", "FrozenBindingService"],
    runtime_object_family_refs: ["trace-evidence", "decision-record", "evidence-summary", "projection-envelope"],
    evidence_posture:
      "Evidence is referenceable summary, not proof or certification; omission must be explicit.",
    projection_safe_exposure:
      "Expose evidence references, bounded summaries, confidence or insufficiency posture, and omission markers only.",
    product_boundary_rule:
      "Downstream projections may format observability, but must not claim proof, certification, or hidden runtime truth.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: true,
    notes: "Trace and projection-safe evidence posture are already first-class, but unified downstream composition is new.",
  },
  {
    duty_id: "KD-06",
    duty_name: "Orchestration",
    duty_slug: "orchestration",
    cognitive_os_responsibility:
      "Run or plan ordered runtime service steps while preserving registry and binding authority and avoiding downstream workflow law.",
    owner_service_refs: ["RuntimeOrchestrator", "FormService", "MemoryService", "ActivationService", "ConfirmService", "TraceService"],
    runtime_object_family_refs: ["external-input-record", "intent", "activation-signal", "confirm-gate", "trace-evidence"],
    evidence_posture:
      "Orchestration must produce enough trace or decision posture to reconstruct bounded step outcomes.",
    projection_safe_exposure:
      "Expose step summaries and safe outcome posture, not internal runtime control payloads.",
    product_boundary_rule:
      "Downstream projections may compose journeys from orchestration outputs but do not own orchestration law.",
    realization_status: "explicit_runtime_realization",
    blocking_for_product_projection: false,
    notes: "The minimal loop provides an explicit ordered runtime skeleton.",
  },
  {
    duty_id: "KD-07",
    duty_name: "Performance",
    duty_slug: "performance",
    cognitive_os_responsibility:
      "Maintain deterministic bounded runtime behavior and future measurable posture without declaring downstream service-level objectives.",
    owner_service_refs: ["state stores", "in-memory stores", "SQLiteStateStore"],
    runtime_object_family_refs: ["store-snapshot", "runtime-state-projection", "runtime-object-record"],
    evidence_posture:
      "Performance posture should be auditable through deterministic tests, bounded record counts, and timing notes where needed.",
    projection_safe_exposure:
      "Expose bounded performance indicators only when defined; no downstream readiness guarantee.",
    product_boundary_rule:
      "Downstream projections may set their own UX targets but cannot treat them as Cognitive_OS duty semantics.",
    realization_status: "implicit_only",
    blocking_for_product_projection: false,
    notes: "Deterministic stores support private runtime confidence; no formal performance service is claimed.",
  },
  {
    duty_id: "KD-08",
    duty_name: "Protocol Versioning",
    duty_slug: "protocol-versioning",
    cognitive_os_responsibility:
      "Preserve protocol-source, binding-version, export-rule, and runtime-version boundaries without changing MPLP.",
    owner_service_refs: ["FrozenBindingService", "RegistryService", "frozen truth loader"],
    runtime_object_family_refs: ["protocol-binding-ref", "registry-entry", "export-rule", "import-lock"],
    evidence_posture:
      "Version posture must cite source versions and distinguish protocol truth from runtime interpretation.",
    projection_safe_exposure:
      "Expose version references and binding references only; do not imply protocol updates or certification.",
    product_boundary_rule:
      "Downstream projections consume version posture but cannot claim MPLP changes or endorsement.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: true,
    notes: "Existing binding, registry, export, and import-lock artifacts preserve version boundaries.",
  },
  {
    duty_id: "KD-09",
    duty_name: "Security",
    duty_slug: "security",
    cognitive_os_responsibility:
      "Keep runtime-private state private, enforce omission, restrict exportability, and prevent unsafe side-effect semantics from leaking into projections.",
    owner_service_refs: ["ProjectionService", "FrozenBindingService", "export rules", "execution boundary contract"],
    runtime_object_family_refs: ["runtime-private-object-families", "projection-envelope", "execution-boundary-envelope"],
    evidence_posture:
      "Security evidence must show omission, rejection, or non-exportability posture where relevant.",
    projection_safe_exposure:
      "Expose only safe fields and explicit omission markers; reject forbidden raw, private, or export fields.",
    product_boundary_rule:
      "Downstream projections may consume safe envelopes only and must not request raw runtime law as product DTOs.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: true,
    notes: "Projection and export rules already enforce key private-field and non-exportability boundaries.",
  },
  {
    duty_id: "KD-10",
    duty_name: "State Sync",
    duty_slug: "state-sync",
    cognitive_os_responsibility:
      "Maintain project-scoped runtime state, continuity, snapshot, replay, and projection consistency across neutral stores.",
    owner_service_refs: ["VslService", "VSL store", "state stores", "projection store"],
    runtime_object_family_refs: ["project", "objective", "work-item", "continuity-state", "snapshot"],
    evidence_posture:
      "State-sync evidence must show project scope, continuity id, source references, and omission posture.",
    projection_safe_exposure:
      "Expose continuity and snapshot summaries, not raw VSL, PSG, or Trace payloads.",
    product_boundary_rule:
      "Downstream projections may store local display state, but Cognitive_OS owns neutral state-sync posture.",
    realization_status: "partial_runtime_realization",
    blocking_for_product_projection: true,
    notes: "VSL, stores, and continuity projections provide substrate; a unified state posture gate remains required.",
  },
  {
    duty_id: "KD-11",
    duty_name: "Transaction",
    duty_slug: "transaction",
    cognitive_os_responsibility:
      "Preserve deterministic commit, block, rollback, snapshot, and export consistency posture without claiming distributed transactions.",
    owner_service_refs: ["state stores", "SQLiteStateStore", "projection store", "future:TransactionPostureService"],
    runtime_object_family_refs: ["state-snapshot", "runtime-object-record", "export-preparation-summary"],
    evidence_posture:
      "Transaction evidence must record accepted, blocked, rolled back, or exported snapshot posture where available.",
    projection_safe_exposure:
      "Expose commit, snapshot, and export consistency posture only as bounded summary.",
    product_boundary_rule:
      "Downstream projections may require consistent packets or workspaces but must consume neutral transaction posture.",
    realization_status: "implicit_only",
    blocking_for_product_projection: true,
    notes: "Deterministic stores exist; a formal transaction posture is not yet claimed.",
  },
];
