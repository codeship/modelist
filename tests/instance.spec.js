import Model from "@/instance";
import ModelCore from "@/instance/core";

// PK = primaryKey (default: id)

const personArray = [
  { id: 1, name: "Jane" },
  { id: 2, name: "John" },
  { id: 3, name: "Wally" }
];

const factory = (options = {}) => {
  return new Model(options);
};

describe("instantiation", () => {
  test("takes some default values passed as data and they can be retrieved with #all", () => {
    const data = [1, { a: "foo" }, "bar"];
    const model = factory({ data });
    expect(model.all()).toEqual(data);
  });

  test("accepts strings and coverts it to objects", () => {
    const model = factory({
      convert: true,
      data: ["Banana"]
    });
    expect(model.first().fold().text).toEqual("Banana");
  });

  test("primaryKey prop can be overruled", () => {
    const Fruits = {
      primaryKey: "name"
    };

    const fruits = factory(Fruits);
    fruits.record({ name: "Banana" }, { name: "Apple" });
    expect(fruits.size).toBe(2);
    expect(fruits.find("Apple").fold()).toEqual({ name: "Apple" });
  });

  test("setPrimaryKey will ensure that a primaryKey is set", () => {
    const products = factory({
      primaryKey: "productId",
      setPrimaryKey: true,
      data: [{ name: "Snickers" }]
    });

    expect(products.first().fold(p => p.productId)).toBeDefined();
  });

  describe("#filters", () => {
    test("filters return a fresh core instance", () => {
      const model = factory({
        filters: {
          same: c => c
        }
      });

      expect(model.same).toBeInstanceOf(ModelCore);
    });

    test("allow for customized collections on the model", () => {
      const Tasks = {
        data: [
          { task: "Go for a walk", done: false },
          { task: "Buy Milk", done: true },
          { taks: "Feed the cat", done: true }
        ],
        filters: {
          completed: c => c.filter(t => t.done === true)
        }
      };

      const tasks = factory(Tasks);
      expect(tasks.completed.size).toBe(2);
    });
  });

  test("methods prop will be parsed onto Entry and can be used individually or in map", () => {
    const Fruits = {
      primaryKey: "name",
      data: [{ name: "Banana" }, { name: "Apple" }],
      methods: {
        makeSalad: e => `${e.name} Salad`,
        uppercase: s => s.toUpperCase()
      }
    };

    const fruits = factory(Fruits);

    const saladMaker = function(Entry) {
      return Entry.map("makeSalad").uppercase();
    };

    expect(fruits.find("Apple").makeSalad()).toEqual("Apple Salad");
    expect(saladMaker(fruits.find("Apple"))).toEqual("APPLE SALAD");
  });

  test("passing validate:true will throw warnings for contents not fitting schemas", () => {
    console.warn = jest.fn();

    const data_valid = { id: "a1", name: "Phone", amount: 2 };
    const data_false = { name: "Choclate", amount: 99 };
    const products = factory({
      validate: true,
      schema: {
        id: String,
        name: String,
        amount: Number
      }
    });

    products.record(data_valid);
    products.record(data_false);

    expect(console.warn).toBeCalledWith(
      "Entry is missing the defined schema key 'id'",
      data_false
    );
  });
});

describe("#has", () => {
  test("returns true if an element with a given PK exists", () => {
    const model = factory({ data: personArray });
    expect(model.has(1)).toBe(true);
  });

  test("returns false if missing an element with a given PK", () => {
    const model = factory({ data: personArray });
    expect(model.has(4)).toBe(false);
  });
});

describe("#validate", () => {
  test("by default validates for a PK to be a String", () => {
    const model = factory();
    expect(model.validate({})).toBe(false);
    expect(model.validate({ id: 1 })).toBe(false);
    expect(model.validate({ id: "123" })).toBe(true);
  });

  test("will take custom PK into account", () => {
    const model = factory({
      primaryKey: "name"
    });

    expect(model.validate({ name: "Jane" })).toBe(true);
  });
});

test("#find returns an Entry Object based on the PK and null if none is found", () => {
  const model = factory({ data: personArray });
  expect(model.find(1).fold()).toEqual(personArray[0]);
  expect(model.find(4)).toEqual(null);
});

test("#findBy", () => {
  const model = factory({ data: personArray });
  expect(model.findBy("name", personArray[1].name).fold()).toEqual(
    personArray[1]
  );
});

test("#first return the first Entry of the collection", () => {
  const model = factory({ data: personArray });
  expect(model.first().fold()).toEqual(personArray[0]);
});

test("#last return the last Entry of the collection", () => {
  const model = factory({ data: personArray });
  expect(model.last().fold()).toEqual(personArray[2]);
});

test("#record allows for adding new records", () => {
  const model = factory();
  expect(model.size).toBe(0);
  model.record(1);
  expect(model.size).toBe(1);
});

test("#replace allows to replace an existing entry", () => {
  const model = factory({ data: personArray })
  const replaceEntry = { id: 3, name: 'Bruce Willis', new: true }
  model.replace(replaceEntry)
  expect(model.find(3).fold()).toEqual(replaceEntry)
})

test("#replace creates a new entry if primareyKey won't match", () => {
  const model = factory({ data: personArray })
  expect(model.size).toBe(3)
  const replaceEntry = { id: 4, name: 'Bruce Willis', new: true }
  model.replace(replaceEntry)
  expect(model.size).toBe(4)
})

test("#destroy one specific record", () => {
  const model = factory();
  model.record({ id: 1, name: "Banana" });
  model.destroy(1);
  expect(model.size).toBe(0);
});

describe("#update", () => {
  test("returns false if record is not found", () => {
    const model = factory();
    expect(model.update(1, { name: "Kiwi" })).toBe(false);
  });

  test("returns false if record is not found", () => {
    const data = [{ id: 1, name: "Orange" }];

    const model = factory({ data });
    expect(model.update(1, { name: "Kiwi" })).toBe(true);
    expect(model.find(1).fold()).toEqual({ id: 1, name: "Kiwi" });
  });
});

describe("#size", () => {
  test("returns length of collection", () => {
    const model = factory({
      data: [1, 2, 3, 4, 5, 6]
    });
    expect(model.size).toBe(6);
  });
});

describe("#$$reset", () => {
  test("will drop all existing data from the collection", () => {
    const model = factory({
      data: [1, 2, 3, 4, 5, 6]
    });
    model.$$reset();
    expect(model.size).toBe(0);
  });
});
