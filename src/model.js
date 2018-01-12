import { isUndefined, forEach, has, defaultTo } from 'lodash'

import EntryWrapper from './entry'

export default class {

  constructor(config = {}) {
    this.__primaryKey = defaultTo(config.primaryKey, 'id')
    this.__schema = defaultTo(config.schema, {id: String})
    this.__collection = defaultTo(config.data, [])
    this.__entry = EntryWrapper(defaultTo(config.methods, {}))
  }

  /*
   * Return all entries of the collection
   *
   **/
  all() {
    return this.__collection.slice(0)
  }

  /*
   * Record one or more entries
   *
   * @param entries <Array>
   * @return undefined
   **/
  record(...entries) {
    forEach(entries, e => this.__collection.push(e))
  }

  /*
   * Remove one or more entries
   *
   * @param key <String|Number>
   * @return undefined
   **/
  destroy(key) {
    const index = this.__findByKey(this.__primaryKey, key)
    if( isUndefined(index) ) return false

    this.__collection.splice(index, 1)
    return true
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
    const index = this.__findByKey(this.__primaryKey, key)
    if( isUndefined(index) ) return false

    this.__collection.splice(index, 1, {...this.__collection[index], ...update })
    return true
  }

  /*
   * Get the first element of the collection
   *
   * @return <null:Entry>
   *
   **/
  first() {
    return this.__collection[0] ? this.__wrap(this.__collection[0]) : null
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
    const index = this.__findByKey(this.__primaryKey, key)
    return isUndefined(index) ? null : this.__wrap(this.all()[index])
  }

  /*
   * Return size of current collection
   *
   * @return <Number>
   **/
  get size() {
    return this.__collection.length
  }

  /*
   * -------
   * PRIVATE
   * -------
   **/

  __findByKey(keyName, keyValue) {
    let index = 0

    const filter = (v, i) => {
      index = i
      return v[keyName] === keyValue
    }

    if(this.__collection.some(filter)) return index
    return undefined
  }

  __wrap(value) {
    return this.__entry(value)
  }
}
