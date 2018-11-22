import uuid from "uuid/v4";
import { isString, isUndefined } from "lodash";
import { validateAgainstSchema } from "@/schema/schema";

export function convertValueToObject(value: any): object {
  return { text: value };
}

export function setPrimaryKey(obj: object, key: string): object {
  obj[key] = uuid();
  return obj;
}

export function validate(obj: object, schema: object): object {
  validateAgainstSchema(obj, schema);
  return obj;
}

export function processRecordEntry(entry: object, options: object): object {
  const shouldConvert = options.convertStringToObject && isString(entry);
  const shouldValidate = options.validate;
  const shouldSetPrimaryKey =
    options.setPrimaryKey || options.convertStringToObject;

  entry = shouldConvert ? convertValueToObject(entry) : entry;
  entry = shouldSetPrimaryKey
    ? setPrimaryKey(entry, options.primaryKey)
    : entry;
  entry = shouldValidate ? validate(entry, options.schema) : entry;
  return entry;
}
