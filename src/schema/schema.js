require("core-js/fn/object/entries");

import { isPlainObject } from "lodash";

export function validateAgainstSchema(entry, schema) {
  Object.entries(schema).forEach(([key, type]) => {
    const value = entry[key];

    if (!value) {
      return console.warn(
        `Entry is missing the defined schema key '${key}'`,
        entry
      );
    }

    const { valid, expectedType } = checkType(value, type);

    if (!valid) {
      return console.warn(
        `Key '${key}' is not of type '${expectedType}'`,
        entry
      );
    }
  });

  return entry;
}

const primitivesRE = /^(String|Number|Boolean|Function|Symbol)$/;

function checkType(value, type) {
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

function getType(type) {
  const parts = type.toString().match(/^\s*function (\w+)/);
  return parts ? parts[1] : "";
}
