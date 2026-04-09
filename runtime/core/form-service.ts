import type {
  MinimalLoopInput,
  RegistryEntryRecord,
  RuntimeObjectRecord,
} from "./runtime-types";
import type { BindingService } from "./binding-service";
import type { RegistryService } from "./registry-service";
import { DeterministicExecutionFactory } from "./execution-support.ts";

export interface CaptureExternalInputRequest {
  project_id: string;
  raw_input: Record<string, unknown>;
}

export interface FormIntentRequest {
  project_id: string;
  external_input_record: RuntimeObjectRecord;
}

export interface FormDeltaIntentRequest {
  project_id: string;
  external_input_record: RuntimeObjectRecord;
  base_intent_id: string;
}

export interface FormService {
  capture_external_input(
    request: CaptureExternalInputRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  form_intent(
    request: FormIntentRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  form_delta_intent(
    request: FormDeltaIntentRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  plan_form_step(
    input: MinimalLoopInput
  ): Promise<RuntimeObjectRecord[]> | RuntimeObjectRecord[];
}

export class DeterministicFormService implements FormService {
  private readonly registry_service: RegistryService;
  private readonly binding_service: BindingService;
  private readonly factory: DeterministicExecutionFactory;
  private readonly scenario_id: string;

  constructor(args: {
    registry_service: RegistryService;
    binding_service: BindingService;
    factory: DeterministicExecutionFactory;
    scenario_id: string;
  }) {
    this.registry_service = args.registry_service;
    this.binding_service = args.binding_service;
    this.factory = args.factory;
    this.scenario_id = args.scenario_id;
  }

  private get_registry_entry(
    object_type: "external-input-record" | "intent" | "delta-intent"
  ): RegistryEntryRecord {
    const entry = this.registry_service.get_object_definition(object_type);
    if (!entry) {
      throw new Error(`Missing registry entry for ${object_type}`);
    }
    return entry;
  }

  capture_external_input(
    request: CaptureExternalInputRequest
  ): RuntimeObjectRecord {
    return this.factory.create_object({
      registry_entry: this.get_registry_entry("external-input-record"),
      project_id: request.project_id,
      status: "captured",
      scenario_id: this.scenario_id,
      creation_source: "user_entry",
      derivation_mode: "origin",
      extra: {
        source_kind: "user",
        input_format: String(request.raw_input.input_kind ?? "text"),
        payload_summary: String(
          request.raw_input.summary ?? "external input captured"
        ),
        source_label: "fixture-input",
      },
    });
  }

  form_intent(
    request: FormIntentRequest
  ): RuntimeObjectRecord {
    const binding = this.binding_service.get_binding("intent");
    return this.factory.create_object({
      registry_entry: this.get_registry_entry("intent"),
      project_id: request.project_id,
      status: "formed",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      protocol_binding: binding,
      lineage_overrides: {
        source_object_ids: [request.external_input_record.object_id],
      },
      extra: {
        intent_kind: "task",
        intent_summary: String(
          request.external_input_record.payload_summary ??
            "formed intent"
        ),
        source_input_ref: request.external_input_record.object_id,
        ambiguity_level: "low",
        clarification_required: false,
      },
    });
  }

  form_delta_intent(
    request: FormDeltaIntentRequest
  ): RuntimeObjectRecord {
    const binding = this.binding_service.get_binding("delta-intent");
    return this.factory.create_object({
      registry_entry: this.get_registry_entry("delta-intent"),
      project_id: request.project_id,
      status: "proposed",
      scenario_id: this.scenario_id,
      creation_source: "runtime_derivation",
      derivation_mode: "derived",
      protocol_binding: binding,
      lineage_overrides: {
        source_object_ids: [
          request.external_input_record.object_id,
          request.base_intent_id,
        ],
      },
      extra: {
        base_intent_id: request.base_intent_id,
        delta_kind: "redirect",
        change_summary: String(
          request.external_input_record.payload_summary ??
            "delta intent formed"
        ),
        source_input_ref: request.external_input_record.object_id,
      },
    });
  }

  plan_form_step(input: MinimalLoopInput): RuntimeObjectRecord[] {
    const external_input = this.capture_external_input({
      project_id: input.project_id,
      raw_input: input.raw_input,
    });

    if (input.scenario_id === "requirement-change-midflow") {
      return [
        external_input,
        this.form_delta_intent({
          project_id: input.project_id,
          external_input_record: external_input,
          base_intent_id:
            input.prior_object_refs?.[0] ??
            "00000000-0000-4000-8000-000000000999",
        }),
      ];
    }

    return [
      external_input,
      this.form_intent({
        project_id: input.project_id,
        external_input_record: external_input,
      }),
    ];
  }
}
