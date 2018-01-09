import Model from '../src/model'

describe('Model', () => {
  test('#constructor takes some default values', () => {
    const data = [1,{a: 'foo'}, 'bar']
    const model = new Model({data})
    expect(model.all()).toEqual(data)
  })

  test('#find returns an Entry based on the primary key and null if none is found', () => {
    const data = [{id: 1, name: 'Shoes'}, {id: 2, name: 'Jackets'}]
    const model = new Model({data})
    expect(model.find(1).fold()).toEqual(data[0])
    expect(model.find(3)).toEqual(null)
  })

  test('#record allows for adding new records', () => {
    const model = new Model
    expect(model.size).toBe(0)
    model.record(1)
    expect(model.size).toBe(1)
  })

  describe('#update', () => {
    test('returns false if record is not found', () => {
      const model = new Model
      expect(model.update(1, {name: 'Kiwi'})).toBe(false)
    })

    test('returns false if record is not found', () => {

      const data = [{id: 1, name: 'Orange'}]

      const model = new Model({data})
      expect(model.update(1, {name: 'Kiwi'})).toBe(true)
      expect(model.find(1).fold()).toEqual({id: 1, name: 'Kiwi'})
    })
  })

  describe('instantiation', () => {
    test('primaryKey prop can be overruled', () => {
      const Fruits = {
        primaryKey: 'name'
      }

      const fruits = new Model(Fruits)
      fruits.record({name: 'Banana'}, {name: 'Apple'})
      expect(fruits.size).toBe(2)
      expect(fruits.find('Apple').fold()).toEqual({name: 'Apple'})
    })

    test('methods prop will be parsed onto Entry and can be used individually or in map', () => {
      const Fruits = {
        primaryKey: 'name',
        data: [
          {name: 'Banana'},
          {name: 'Apple'}
        ],
        methods: {
          makeSalad: (e) => `${e.name} Salad`,
          uppercase: (s) => s.toUpperCase()
        }
      }

      const fruits = new Model(Fruits)
      expect(fruits.find('Apple').makeSalad()).toEqual('Apple Salad')
      expect(fruits.find('Apple').map('makeSalad').uppercase()).toEqual('APPLE SALAD')
    })
  })
})
