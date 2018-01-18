import Model from '../src/model'

describe('Model', () => {
  test('#find returns an Entry based on the primary key and null if none is found', () => {
    const data = [{id: 1, name: 'Shoes'}, {id: 2, name: 'Jackets'}]
    const model = new Model({data})
    expect(model.find(1).fold()).toEqual(data[0])
    expect(model.find(3)).toEqual(null)
  })

  test('#first return the first Entry of the collection', () => {
    const data = [{id: 1, name: 'Shoes'}, {id: 2, name: 'Jackets'}]
    const model = new Model({data})
    expect(model.first(1).fold()).toEqual(data[0])
  })

  test('#record allows for adding new records', () => {
    const model = new Model
    expect(model.size).toBe(0)
    model.record(1)
    expect(model.size).toBe(1)
  })

  test('#destroy one specific record', () => {
    const model = new Model
    model.record({id: 1, name: 'Banana'})
    model.destroy(1)
    expect(model.size).toBe(0)
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

  describe('#size', () => {
    test('returns length of collection', () => {
      const model = new Model({
        data: [1,2,3,4,5,6]
      })
      expect(model.size).toBe(6)
    })
  })

  describe('instantiation', () => {
    test('takes some default values passed as data and they can be retrieved with #all', () => {
      const data = [1,{a: 'foo'}, 'bar']
      const model = new Model({data})
      expect(model.all()).toEqual(data)
    })

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

      const saladMaker = function(Entry) {
        return Entry
          .map('makeSalad')
          .uppercase()
      }

      expect(fruits.find('Apple').makeSalad()).toEqual('Apple Salad')
      expect(saladMaker(fruits.find('Apple'))).toEqual('APPLE SALAD')
    })

    test('passing validate:true will throw warnings for contents not fitting schemas', () => {
      console.warn = jest.fn()

      const data_valid = { id: 'a1', name: 'Phone', amount: 2}
      const data_false = { name: 'Choclate', amount: 99}
      const products  = new Model({
        validate: true,
        schema: {
          id: String,
          name: String,
          amount: Number,
        }
      })

      products.record(data_valid)
      products.record(data_false)

      expect(console.warn).toBeCalledWith("Entry is missing the defined schema key 'id'", data_false)
    })
  })
})
