import ModelCore from "./core";
import EntryFactory from "./entry";
import { mergeFilters } from "./merge";
import { defaultTo } from "lodash";

function parseConfigObject(config) {
  return {
    data: defaultTo(config.data, []),
    filters: defaultTo(config.filters, {}),
    options: {
      primaryKey: defaultTo(config.primaryKey, "id"),
      setPrimaryKey: defaultTo(config.setPrimaryKey, false),
      schema: defaultTo(config.schema, { id: String }),
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
