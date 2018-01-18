import { isUndefined, forEach, has, defaultTo } from 'lodash'
import uuid from 'uuid/v4'

import EntryWrapper from './entry'
import { validate } from './utils/schema'

export default class {

  constructor(config = {}) {
    this.__collection = []
    this.__primaryKey = defaultTo(config.primaryKey, 'id')
    this.__schema = defaultTo(config.schema, {id: String})
    this.__entry = EntryWrapper(defaultTo(config.methods, {}))
    this.__options = {
      validate: defaultTo(config.validate, false),
      setPrimaryKey: defaultTo(config.setPrimaryKey, false)
    }
    // If there is passed in data, record it right away
    this.record(...defaultTo(config.data, []))
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
    forEach(entries, e => {
      if(this.__options.setPrimaryKey && isUndefined(e[this.__primaryKey]))
        e[this.__primaryKey] = uuid()
      const validated = this.__tryValidate(e)
      this.__collection.push(validated)
    })
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

  __tryValidate(data) {
    if(this.__options.validate)
      return validate(data, this.__schema)
    return data
  }
}
