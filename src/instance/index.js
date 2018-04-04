import ModelCore from "./core";
import EntryFactory from "./entry";
import { mergeFilters } from "./merge";
import { defaultTo } from "lodash";

function parseConfigObject(config) {
  const primaryKey = defaultTo(config.primaryKey, "id");

  return {
    data: defaultTo(config.data, []),
    filters: defaultTo(config.filters, {}),
    options: {
      primaryKey,
      setPrimaryKey: defaultTo(config.setPrimaryKey, false),
      schema: defaultTo(config.schema, { [primaryKey]: String }),
      validate: defaultTo(config.validate, false),
      convertStringToObject: defaultTo(config.convert, false),
      entryFactory: EntryFactory(defaultTo(config.methods, {}))
    }
  };
}

class Model extends ModelCore {
  constructor(config = {}) {
    const { data, filters, options } = parseConfigObject(config);
    super(options, data);
    mergeFilters(this, filters);
  }
}

export default Model;
