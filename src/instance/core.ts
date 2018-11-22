import { defaultTo, forEach, isString, isUndefined } from "lodash";
// import { processRecordEntry } from "./helpers";
// import { validateAgainstSchema } from "@/schema/schema";

const processRecordEntry = function (entry: object, options: object): object { return entry };

export default class Core {
  $collection: object[] = [];
  $options: object;

  constructor(options: object, data: object[]) {
    this.$options = options;

    this.record(...data);
  }

  /**
   * Return all entries of the collection
   */
  all() {
    return this.$collection.slice(0);
  }

  /**
   * Record one or more entries
   */
  record(...entries: object[]) {
    forEach(entries, entry =>
      this.$collection.push(processRecordEntry(entry, this.$options))
    );
  }

  /**
   * Remove one or more entries
   */
  destroy(key: string | number) {
    const index = this.__findByKey(this.$options.primaryKey, key);
    if (isUndefined(index)) return false;

    this.$collection.splice(index, 1);
    return true;
  }

  /**
   * Update entry based on primary key
   */
  update(key: string | number, update: object): boolean {
    const index = this.__findByKey(this.$options.primaryKey, key);
    if (isUndefined(index)) return false;

    this.$collection.splice(index, 1, {
      ...this.$collection[index],
      ...update
    });
    return true
  }

  /**
   * Replace one or more entries completely based on the primary key
   */
  replace(...entries: object[]): void {
    entries.forEach(entry => {
      const index = this.__findByKey(this.$options.primaryKey, entry[this.$options.primaryKey]);
      if (isUndefined(index)) return this.record(entry)

      this.$collection.splice(index, 1, entry)
    })
  }

  /**
   * Get the first element of the collection
   */
  first(): object | null {
    return this.$collection[0] ? this.__wrap(this.$collection[0]) : null;
  }

  /**
   * Get the last element of the collection
   */
  last(): object | null {
    const lastIndex = this.$collection.length - 1;
    return this.$collection[lastIndex]
      ? this.__wrap(this.$collection[lastIndex])
      : null;
  }

  /**
   * Check if element with primary key exists
   */
  has(key: string | number): boolean {
    const index = this.__findByKey(this.$options.primaryKey, key);
    return isUndefined(index) ? false : true;
  }

  /**
   * Find entry by primary key value
   */
  find(key: string | number) {
    const index = this.__findByKey(this.$options.primaryKey, key);
    return isUndefined(index) ? null : this.__wrap(this.all()[index]);
  }

  /**
   * Find entry by custom key and its value
   **/
  findBy(key: string | number, val: any) {
    const index = this.__findByKey(key, val);
    return isUndefined(index) ? null : this.__wrap(this.all()[index]);
  }

  /**
   * Expose the validate functionality for manual checkings
   */
  validate(obj: object) {
    return validateAgainstSchema(obj, this.$options.schema);
  }

  /**
   * Reset the collection and drop every stored record
   */
  $$reset(): void {
    this.$collection.splice(0, this.$collection.length);
  }

  /**
   * Return size of current collection
   */
  get size() {
    return this.$collection.length;
  }

  /** PRIVATE */

  private __findByKey(keyName: string | number, keyValue: any): number | undefined {
    let index = 0;

    const filter = (v: any, i: number) => {
      index = i;
      return v[keyName] === keyValue;
    };

    if (this.$collection.some(filter)) return index;
    return undefined;
  }

  private __wrap(value: object) {
    return this.$options.entryFactory(value);
  }
}
