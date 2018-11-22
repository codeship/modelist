// require("core-js/fn/object/entries");

import { isPlainObject } from "lodash";

export function validateAgainstSchema(obj: object, schema: object): boolean {
  let objValid = true;
  Object.entries(schema).forEach(([key, type]) => {
    const value = obj[key];

    if (!value) {
      console.warn(`Entry is missing the defined schema key '${key}'`, obj);
      return (objValid = false);
    }

    const { valid, expectedType } = checkType(value, type);

    if (!valid) {
      console.warn(`Key '${key}' is not of type '${expectedType}'`, obj);
      return (objValid = false);
    }
  });

  return objValid;
}

const primitivesRE = /^(String|Number|Boolean|Function|Symbol)$/;

function checkType(value: any, type: object): object {
  const valueType = typeof value;
  const expectedType = getType(type);

  let valid;

  if (primitivesRE.test(expectedType)) {
    valid = valueType === expectedType.toLowerCase();
    if (!valid && valueType === "object") {
      valid = valueType instanceof type;
    }
  } else if (expectedType === "Array") {
    valid = Array.isArray(value);
  } else if (expectedType === "Object") {
    valid = isPlainObject(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}

function getType(type: object): string {
  const parts = type.toString().match(/^\s*function (\w+)/);
  return parts ? parts[1] : "";
}
