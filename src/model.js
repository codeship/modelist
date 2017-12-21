export default class {
  collection = []
  primaryKey = 'id'

  constructor(initialData = []) {
    this.collection = [...initialData]
  }

  record(...entries) {
    entries.forEach(e => this.collection.push(e))
  }

  find(key) {
    let index = 0
    const filter = (v, i) => {
      index = i
      return v[this.primaryKey] === key
    }

    if(this.collection.some(filter)) return this.collection[index]
    return null
  }

  all() {
    return this.collection.slice(0)
  }

  get size() {
    return this.collection.length
  }

}
