import { basename, dirname, resolve } from "node:path";

import {
  load_import_lock_document,
  load_json_document,
} from "../core/frozen-truth-loader.ts";
import type {
  ProtocolArtifactType,
  ProtocolSchemaValidationError,
} from "../core/runtime-types";

type JsonSchema = Record<string, unknown>;

interface SchemaDocumentContext {
  root_schema: JsonSchema;
  schema_path: string;
}

function as_schema(value: unknown): JsonSchema {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Schema node is not an object.");
  }

  return value as JsonSchema;
}

function get_pointer_value(
  document: JsonSchema,
  pointer: string
): unknown {
  if (pointer === "" || pointer === "#") {
    return document;
  }

  const tokens = pointer
    .replace(/^#?\//u, "")
    .split("/")
    .map((token) => token.replace(/~1/gu, "/").replace(/~0/gu, "~"));

  let current: unknown = document;
  for (const token of tokens) {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[token];
  }

  return current;
}

function is_plain_object(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validate_date_time(value: string): boolean {
  return (
    Number.isFinite(Date.parse(value)) &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(value)
  );
}

function resolve_schema_ref(
  ref: string,
  context: SchemaDocumentContext
): SchemaDocumentContext & { schema: JsonSchema } {
  if (ref.startsWith("#")) {
    const resolved = get_pointer_value(context.root_schema, ref);
    return {
      ...context,
      schema: as_schema(resolved),
    };
  }

  const [relative_path, hash] = ref.split("#", 2);
  const resolved_path = resolve(dirname(context.schema_path), relative_path);
  const document = load_json_document<JsonSchema>(resolved_path);
  const resolved = hash
    ? get_pointer_value(document, `#${hash}`)
    : document;

  return {
    root_schema: document,
    schema_path: resolved_path,
    schema: as_schema(resolved),
  };
}

function validate_schema_node(args: {
  value: unknown;
  schema: JsonSchema;
  context: SchemaDocumentContext;
  path: string;
}): ProtocolSchemaValidationError[] {
  const { value, schema, context, path } = args;

  if (typeof schema.$ref === "string") {
    const resolved = resolve_schema_ref(schema.$ref, context);
    return validate_schema_node({
      value,
      schema: resolved.schema,
      context: {
        root_schema: resolved.root_schema,
        schema_path: resolved.schema_path,
      },
      path,
    });
  }

  if (Array.isArray(schema.anyOf)) {
    const branches = schema.anyOf
      .map((candidate) =>
        validate_schema_node({
          value,
          schema: as_schema(candidate),
          context,
          path,
        })
      )
      .sort((left, right) => left.length - right.length);

    return branches[0]?.length === 0
      ? []
      : [
          {
            path,
            message: "does not satisfy any allowed schema branch",
          },
          ...(branches[0] ?? []),
        ];
  }

  const errors: ProtocolSchemaValidationError[] = [];
  const schema_type = schema.type;

  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
    errors.push({
      path,
      message: `must be one of: ${schema.enum.join(", ")}`,
    });
    return errors;
  }

  if (schema_type === "object") {
    if (!is_plain_object(value)) {
      return [{ path, message: "must be an object" }];
    }

    const required = Array.isArray(schema.required)
      ? schema.required.filter((candidate): candidate is string =>
          typeof candidate === "string"
        )
      : [];

    for (const key of required) {
      if (!(key in value)) {
        errors.push({
          path,
          message: `missing required property "${key}"`,
        });
      }
    }

    const properties = is_plain_object(schema.properties)
      ? schema.properties
      : {};

    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in properties)) {
          errors.push({
            path: path === "/" ? `/${key}` : `${path}/${key}`,
            message: "additional property is not allowed",
          });
        }
      }
    }

    for (const [key, property_schema] of Object.entries(properties)) {
      if (!(key in value)) {
        continue;
      }

      errors.push(
        ...validate_schema_node({
          value: value[key],
          schema: as_schema(property_schema),
          context,
          path: path === "/" ? `/${key}` : `${path}/${key}`,
        })
      );
    }

    return errors;
  }

  if (schema_type === "array") {
    if (!Array.isArray(value)) {
      return [{ path, message: "must be an array" }];
    }

    if (
      typeof schema.minItems === "number" &&
      value.length < schema.minItems
    ) {
      errors.push({
        path,
        message: `must contain at least ${schema.minItems} item(s)`,
      });
    }

    if (schema.items) {
      for (const [index, item] of value.entries()) {
        errors.push(
          ...validate_schema_node({
            value: item,
            schema: as_schema(schema.items),
            context,
            path: `${path}/${index}`,
          })
        );
      }
    }

    return errors;
  }

  if (schema_type === "string") {
    if (typeof value !== "string") {
      return [{ path, message: "must be a string" }];
    }

    if (
      typeof schema.minLength === "number" &&
      value.length < schema.minLength
    ) {
      errors.push({
        path,
        message: `must contain at least ${schema.minLength} character(s)`,
      });
    }

    if (
      typeof schema.pattern === "string" &&
      !(new RegExp(schema.pattern, "u").test(value))
    ) {
      errors.push({
        path,
        message: "does not match the required pattern",
      });
    }

    if (schema.format === "date-time" && !validate_date_time(value)) {
      errors.push({
        path,
        message: "must be a valid ISO 8601 date-time",
      });
    }

    return errors;
  }

  if (schema_type === "integer") {
    return Number.isInteger(value)
      ? []
      : [{ path, message: "must be an integer" }];
  }

  if (schema_type === "boolean") {
    return typeof value === "boolean"
      ? []
      : [{ path, message: "must be a boolean" }];
  }

  return [];
}

export function resolve_locked_protocol_schema_paths(
  repo_root: string
): Record<ProtocolArtifactType, string> {
  const import_lock = load_import_lock_document(repo_root);
  const schema_paths = {} as Record<ProtocolArtifactType, string>;

  for (const schema_path of import_lock.required_protocol_artifacts.module_schemas) {
    const filename = basename(schema_path);
    if (filename === "mplp-context.schema.json") {
      schema_paths.context = schema_path;
    }
    if (filename === "mplp-plan.schema.json") {
      schema_paths.plan = schema_path;
    }
    if (filename === "mplp-confirm.schema.json") {
      schema_paths.confirm = schema_path;
    }
    if (filename === "mplp-trace.schema.json") {
      schema_paths.trace = schema_path;
    }
  }

  for (const artifact_type of ["context", "plan", "confirm", "trace"] as const) {
    if (!schema_paths[artifact_type]) {
      throw new Error(
        `Missing locked MPLP schema path for ${artifact_type} in import lock.`
      );
    }
  }

  return schema_paths;
}

export function load_protocol_schema_document(
  schema_path: string
): JsonSchema {
  return load_json_document<JsonSchema>(schema_path);
}

export function validate_protocol_artifact_against_schema(args: {
  artifact: Record<string, unknown>;
  schema_path: string;
}): {
  schema_id: string;
  errors: ProtocolSchemaValidationError[];
} {
  const root_schema = load_protocol_schema_document(args.schema_path);
  const errors = validate_schema_node({
    value: args.artifact,
    schema: root_schema,
    context: {
      root_schema,
      schema_path: args.schema_path,
    },
    path: "/",
  });

  return {
    schema_id: String(root_schema.$id ?? args.schema_path),
    errors,
  };
}
