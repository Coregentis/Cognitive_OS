import type { RuntimeObjectRecord } from "./runtime-types";

export interface CreateConfirmGateRequest {
  project_id: string;
  target_object_id: string;
  confirm_kind: string;
  requested_by_ref?: string;
}

export interface ResolveConfirmGateRequest {
  confirm_gate: RuntimeObjectRecord;
  resolution_status: string;
}

export interface ConfirmService {
  create_confirm_gate(
    request: CreateConfirmGateRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;

  resolve_confirm_gate(
    request: ResolveConfirmGateRequest
  ): Promise<RuntimeObjectRecord> | RuntimeObjectRecord;
}
