export interface IEntry {
  id?: string | number,
  [key: string]: any
}
export interface ISchema {
  [key: string]: any
}

export interface IMethods {
  [key: string]: any,
  map?(val?: any): any,
  fold?(val?: any): any
}
export interface IOptionsConfig {
  data?: [],
  filters?: object,
  methods?: IMethods,
  primaryKey?: string,
  setPrimaryKey?: boolean,
  schema?: ISchema,
  validate?: boolean,
  entryFactory?(obj?: IEntry): any
}

