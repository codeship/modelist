import { defaultTo, forEach, isString, isUndefined } from "lodash";
import { processRecordEntry } from "./helpers";
import { validateAgainstSchema } from "@/schema/schema";

export default class ModelCore {
  constructor(options, data) {
    this.$collection = [];
    this.$options = options;

    this.record(...data);
  }

  /*
   * Return all entries of the collection
   *
   **/
  all() {
    return this.$collection.slice(0);
  }

  /*
   * Record one or more entries
   *
   * @param entries <Array>
   * @return undefined
   **/
  record(...entries) {
    forEach(entries, entry =>
      this.$collection.push(processRecordEntry(entry, this.$options))
    );
  }

  /*
   * Remove one or more entries
   *
   * @param key <String|Number>
   * @return undefined
   **/
  destroy(key) {
    const index = this.__findByKey(this.$options.primaryKey, key);
    if (isUndefined(index)) return false;

    this.$collection.splice(index, 1);
    return true;
  }

  /*
   * Update entry based on primary key
   *
   * @param key <String|Number>
   * @params update <Object>
   *
   * @return Boolean
   **/
  update(key, update) {
    const index = this.__findByKey(this.$options.primaryKey, key);
    if (isUndefined(index)) return false;

    this.$collection.splice(index, 1, {
      ...this.$collection[index],
      ...update
    });
    return true;
  }

  /*
   * Get the first element of the collection
   *
   * @return <null:Entry>
   *
   **/
  first() {
    return this.$collection[0] ? this.__wrap(this.$collection[0]) : null;
  }

  /*
   * Get the last element of the collection
   *
   * @return <null:Entry>
   *
   **/
  last() {
    const lastIndex = this.$collection.length - 1;
    return this.$collection[lastIndex]
      ? this.__wrap(this.$collection[lastIndex])
      : null;
  }

  /*
   * Check if element with primary key exists
   *
   * @param key <String|Number>
   *
   * @return <Boolean>
   *
   **/
  has(key) {
    const index = this.__findByKey(this.$options.primaryKey, key);
    return isUndefined(index) ? false : true;
  }

  /*
   * Find entry by primary key value
   *
   * @param key <String|Number>
   *
   * @return <null:Entry>
   *
   **/
  find(key) {
    const index = this.__findByKey(this.$options.primaryKey, key);
    return isUndefined(index) ? null : this.__wrap(this.all()[index]);
  }

  /*
   * Find entry by custom key and its value
   *
   * @param key <String>
   * @param val <Any>
   *
   * @return <null:Entry>
   *
   **/
  findBy(key, val) {
    const index = this.__findByKey(key, val);
    return isUndefined(index) ? null : this.__wrap(this.all()[index]);
  }

  /*
   * Expose the validate functionality for manual checkings
   *
   * @param obj <Object>
   *
   * @return <Boolean>
   *
   **/
  validate(obj) {
    return validateAgainstSchema(obj, this.$options.schema);
  }

  /*
   * Reset the collection and drop every stored record
   *
   * @return <void>
   *
   **/
  $$reset() {
    this.$collection.splice(0, this.$collection.length);
  }

  /*
   * Return size of current collection
   *
   * @return <Number>
   **/
  get size() {
    return this.$collection.length;
  }

  /*
   * -------
   * PRIVATE
   * -------
   **/

  __findByKey(keyName, keyValue) {
    let index = 0;

    const filter = (v, i) => {
      index = i;
      return v[keyName] === keyValue;
    };

    if (this.$collection.some(filter)) return index;
    return undefined;
  }

  __wrap(value) {
    return this.$options.entryFactory(value);
  }
}
