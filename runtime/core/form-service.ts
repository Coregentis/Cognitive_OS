import type {
  MinimalLoopInput,
  RuntimeObjectRecord,
} from "./runtime-types";

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
