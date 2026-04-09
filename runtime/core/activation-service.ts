import type { RuntimeObjectRecord } from "./runtime-types";

export interface CreateActivationSignalRequest {
  project_id: string;
  trigger_object_id: string;
  signal_kind: string;
  scope: string;
  priority: string;
}

export interface CreateActionUnitRequest {
  project_id: string;
  activation_signal_id: string;
  action_kind: string;
  action_summary: string;
  target_object_refs?: string[];
}

export interface ActivationService {
  create_activation_signal(
    request: CreateActivationSignalRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  create_action_unit(
    request: CreateActionUnitRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;
}
