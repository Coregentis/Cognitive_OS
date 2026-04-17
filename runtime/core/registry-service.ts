import type {
  CoregentisObjectType,
  RegistryEntryRecord,
  RuntimeRelationshipType,
} from "./runtime-types";
import {
  load_registry_document,
  load_relationship_rules_document,
} from "./frozen-truth-loader.ts";

export interface RegistryService {
  get_object_definition(
    object_type: CoregentisObjectType
  ): RegistryEntryRecord | undefined;

  list_object_definitions(): RegistryEntryRecord[];

  assert_registered(object_type: CoregentisObjectType): void;

  get_allowed_relationships(
    object_type: CoregentisObjectType
  ): RuntimeRelationshipType[];
}

export class FrozenRegistryService implements RegistryService {
  private readonly object_map = new Map<
    CoregentisObjectType,
    RegistryEntryRecord
  >();

  constructor(entries: RegistryEntryRecord[]) {
    for (const entry of entries) {
      this.object_map.set(entry.object_type, entry);
    }
  }

  static from_repo_root(repo_root: string): FrozenRegistryService {
    const document = load_registry_document(repo_root);
    void load_relationship_rules_document(repo_root);
    return new FrozenRegistryService(document.objects);
  }

  get_object_definition(
    object_type: CoregentisObjectType
  ): RegistryEntryRecord | undefined {
    return this.object_map.get(object_type);
  }

  list_object_definitions(): RegistryEntryRecord[] {
    return [...this.object_map.values()];
  }

  assert_registered(object_type: CoregentisObjectType): void {
    if (!this.object_map.has(object_type)) {
      throw new Error(`Unregistered Coregentis object type: ${object_type}`);
    }
  }

  get_allowed_relationships(
    object_type: CoregentisObjectType
  ): RuntimeRelationshipType[] {
    return this.object_map.get(object_type)?.allowed_relationships ?? [];
  }
}
