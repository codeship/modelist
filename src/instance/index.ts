import Core from "./core";
import EntryFactory from "./entry";
import { mergeFilters } from "./merge";
import { defaultTo } from "lodash";
import { IOptionsConfig } from '@/types'

function parseConfigObject(config: IOptionsConfig) {
  const primaryKey = defaultTo(config.primaryKey, "id");

  return {
    data: defaultTo(config.data, []),
    filters: defaultTo(config.filters, {}),
    options: {
      primaryKey,
      setPrimaryKey: defaultTo(config.setPrimaryKey, false),
      schema: defaultTo(config.schema, { [primaryKey]: String }),
      validate: defaultTo(config.validate, false),
      entryFactory: EntryFactory(defaultTo(config.methods, {}))
    }
  };
}

class Model extends Core {
  constructor(config = {}) {
    const { data, filters, options } = parseConfigObject(config);
    super(options, data);
    mergeFilters(this, filters);
  }
}

export default Model;
