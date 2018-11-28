import uuid from "uuid/v4";
import { isString, isNumber } from "lodash";
import { validateAgainstSchema } from "@/schema/schema";
import {IOptionsConfig, IEntry, ISchema} from '@/types'

export function setPrimaryKey(obj: IEntry, key: string): IEntry {
  obj[key] = uuid();
  return obj;
}

export function validate(obj: IEntry, schema: ISchema): IEntry {
  validateAgainstSchema(obj, schema);
  return obj;
}

export function processRecordEntry(entry: IEntry | number | string, options: IOptionsConfig): IEntry {
  const needsConversion = isString(entry) || isNumber(entry)
  const shouldSetPrimaryKey = needsConversion || options.setPrimaryKey;
  if (needsConversion) entry = { value: entry };
  entry = Object.assign({}, entry) as IEntry

  entry = shouldSetPrimaryKey && !entry[options.primaryKey]
    ? setPrimaryKey(entry, options.primaryKey)
    : entry;
  entry = options.validate ? validate(entry, options.schema) : entry;
  return entry;
}
