import type {
  CoregentisObjectType,
  RegistryEntryRecord,
  RuntimeRelationshipType,
} from "./runtime-types";

export interface RegistryService {
  get_object_definition(
    object_type: CoregentisObjectType
  ): Promise<RegistryEntryRecord | undefined> | RegistryEntryRecord | undefined;

  list_object_definitions():
    | Promise<RegistryEntryRecord[]>
    | RegistryEntryRecord[];

  assert_registered(object_type: CoregentisObjectType): Promise<void> | void;

  get_allowed_relationships(
    object_type: CoregentisObjectType
  ): Promise<RuntimeRelationshipType[]> | RuntimeRelationshipType[];
}
