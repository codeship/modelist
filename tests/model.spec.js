import Model from '../src/model'
import Entry from '../src/entry'

describe('Model', () => {
  test('#constructor takes some default values', () => {
    const data = [1,{a: 'foo'}, 'bar']
    const model = new Model(data)
    expect(model.all()).toEqual(data)
  })

  test('#find returns an Entry based on the primary key and null if none is found', () => {
    const data = [{id: 1, name: 'Shoes'}, {id: 2, name: 'Jackets'}]
    const model = new Model(data)
    expect(model.find(1).fold()).toEqual(data[0])
    expect(model.find(3)).toEqual(null)
  })

  test('#record allows for adding new records', () => {
    const model = new Model
    expect(model.size).toBe(0)
    model.record(1)
    expect(model.size).toBe(1)
   })

  describe('instantiation', () => {
    test('primaryKey prop can be overruled', () => {
      class Fruits extends Model {
        primaryKey = 'name'
      }

      const fruits = new Fruits
      fruits.record({name: 'Banana'}, {name: 'Apple'})
      expect(fruits.size).toBe(2)
      expect(fruits.find('Apple').fold()).toEqual({name: 'Apple'})
    })
  })
})
