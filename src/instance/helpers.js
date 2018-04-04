import uuid from "uuid/v4";
import { isString, isUndefined } from "lodash";
import { validateAgainstSchema } from "@/schema/schema";

export function convert(value) {
  return { text: value };
}

export function setPrimaryKey(obj, key) {
  if (isString(obj))
    console.warn(
      "You are trying to set a primary Key on a String. Please use the `convert` option."
    );
  else if (isUndefined(obj[key])) obj[key] = uuid();
  return obj;
}

export function validate(obj, schema) {
  validateAgainstSchema(obj, schema);
  return obj;
}

export function processRecordEntry(entry, options) {
  const shouldConvert = options.convertStringToObject && isString(entry);
  const shouldValidate = options.validate;
  const shouldSetPrimaryKey =
    options.setPrimaryKey || options.convertStringToObject;

  entry = shouldConvert ? convert(entry) : entry;
  entry = shouldSetPrimaryKey
    ? setPrimaryKey(entry, options.primaryKey)
    : entry;
  entry = shouldValidate ? validate(entry, options.schema) : entry;
  return entry;
}
