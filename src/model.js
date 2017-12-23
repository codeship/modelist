import { isUndefined } from 'lodash'

import Entry from './entry'

export default class {
  // Array keeping the main data
  _collection = []

  // Key used by find, replace, update method to identify the record
  primaryKey = 'id'

  // Optional
  schema = {
    id: String
  }

  constructor(entries = []) {
    this._collection = [...entries]
  }

  // Return all records
  all() {
    return this._collection.slice(0)
  }

  // Add new entries to the collection
  record(...entries) {
    entries.forEach(e => this._collection.push(e))
  }

  // Takes an entry and updates it with the passed in values
  update(key, update) {
    const index = this.__findByKey(this.primaryKey, key)
    if( isUndefined(index) ) return false

    this._collection[index] = {...this._collection[index], ...update }
    return true
  }

  // Find a record by the primary key
  find(key) {
    const index = this.__findByKey(this.primaryKey, key)
    return isUndefined(index) ? null : this.__wrap(this._collection[index])
  }

  // Return length of current collection
  get size() {
    return this._collection.length
  }

  // PRIVATE

  // find element in the collection based on a key
  __findByKey(keyName, keyValue) {
    let index = 0
    const filter = (v, i) => {
      index = i
      return v[keyName] === keyValue
    }

    if(this._collection.some(filter)) return index
    return undefined
  }

  __wrap(value) {
    return Entry(value)
  }
}
