import "core-js/fn/object/entries";

import { isPlainObject } from "lodash"; 
import { Entry, Schema } from "@/types"

export function validateAgainstSchema(obj: Entry , schema: Schema): boolean {
  let objValid = true;

  Object.entries(schema).forEach(([key, type]) => {
    if(!obj.hasOwnProperty(key)) {
      console.warn(`Entry is missing the defined schema key '${key}'`, obj);
      return (objValid = false);
    }

    const [valid, expectedType] = checkType(obj[key], type);

    if (!valid) {
      console.warn(`Key '${key}' is not of type '${expectedType}'`, obj);
      return (objValid = false);
    }
  });

  return objValid;
}

const primitivesRE = /^(String|Number|Boolean|Function|Symbol)$/;

function checkType(value: any, type: any): [boolean, any] {
  const valueType = typeof value;
  const expectedType = getType(type);

  let valid;

  function respond(bool: boolean): [boolean, any] {
    return [bool, expectedType]
  }

  if (!primitivesRE.test(expectedType))
    return respond(value instanceof type)
  if (valueType === expectedType.toLowerCase())
    return respond(true)
  if (expectedType === 'Array')
    return respond(Array.isArray(value))
  if (expectedType === 'Object')
    return respond(isPlainObject(value))
  return respond(value instanceof type)
}

function getType(type: object): string {
  const parts = type.toString().match(/^\s*function (\w+)/);
  return parts ? parts[1] : "";
}
