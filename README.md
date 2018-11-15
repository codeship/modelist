# Modelist

Flexible & Customizable Modelstructure for awesome data management.

## What is Modelist

Modelist is a client based collection model that makes handling data surprisingly convenient.
It works great in reactive systems like `Vue` and `React` or flux stores like `Vuex` or `Redux`.
Common tasks like recording, updating, deleting and selecting are made easy.

For Real-life examples checkout the [Examples](#examples) section.

## Contributing

Contributions to this project are very welcome. Please read the [Contributing.md](CONTRIBUTING.md) document first.

## Table of Contents:

1.  [Installation](#installation)
2.  [Basic Usage](#usage)
3.  [The Entry Object](#entry)
4.  [Customize a Model](#customize)
    * [Add custom filters](#customize-filters)
    * [Customize the Entry Object](#customize-entry)
    * [Use Schemas](#schema)
5.  [Examples](#examples)
    * [Using Modelist with Vuex](#example-vuex)
6.  [Meta](#meta)

## Installation <a name="installation"></a>

`Modelist` can be added to your project with ease.

```sh
npm install -D @codeship/modelist

# or

yarn add @codeship/modelist
```

## Basic Usage <a name="usage"></a>

After adding `modelist` to your project, usage is quite simple.

```js
import Model from "@codeship/modelist";
```

This gives you access to the Model contructor. That one can be used as is to have direct access to the everything `Modelist` brings to the table. Create a new instance, and start using it right away.

```js
const users = new Model();
```

**That's it**. Nothing more that needs to be done to get access to a new collection and all the default methods that come with it.

**Add entries to the collection**

```js
users.record({ id: 1, name: "Jane Doe" });
```

**Get all entries of the collection**

```js
users.all();
```

**Retrieve the first element of the collection**

```js
users.first();
```

**Retrieve the last element of the collection**

```js
users.last();
```

**Check if the collection has a record based on the primary key**_(default: id)_

```js
users.has(1);
```

**Retrieve one specific element of the collection based on the primary key**_(default: id)_

```js
users.find(1);
```

**Retrieve one specific element of the collection based on a custom key**

```js
users.findBy("name", "Jane Doe");
```

**Update an entry based on the primary key**
Only the values that should be changed need to get passed in

```js
users.update(1, { name: "Jane Goodall" });
```

**Replace entries based on the primary key**
If you want to update multiple entries at once you can leverage `replace`.
Notice though that this will really replace the element and not merge the existing values.

```js
users.replace(1, { name: "Jane Goodall" });
```

Should replace be called on an element that can't be matched it will be recorded instead.
If you want to record elements though, `record` is recommended as it's faster.

**Remove an entry from the collection**

```js
users.destroy(1);
```

**Get the number of elements in the collection**

```js
users.size;
```

**$$reset**
This method will reset the Model and drop every data that's currently stored in the collection.

```js
users.$$reset();
```

Internally all collection operations `destroy`, `record` and `update` use default Array methods, so reactive systems can track changes to the collection.

## Single Entries <a name="entry"></a>

Usually there is something that needs to be done with an entry of the collection when it gets retrieved on it's own.
Therfore `Modelist` will wrap that result in an `Entry1 object.
Single entries aim to support functional composition. Entries come with default functionality that can be used to alter the value you received.
Let's see this in action right away:

```js
const fruits = new Model();
fruits.record({ id: 1, name: "Banana" });

// This will return the Entry object
const entry = fruits.find(1);

// Inspect a entry by using .toString() for easy debugging
entry.toString(); //= Entry({ id: 1, name: 'Banana' })

// By default an Entry comes with two functions
// map() to map over the current value and wrap the output in another Entry
// fold() to get the value out of the entry

entry.fold(); //= {id: 1, name: 'Banana'}

// Let's say you want only the name
entry.fold(e => e.name); //= 'Banana'

// What if you want to change the name before folding
entry.map(e => e.name.toUpperCase()).fold(); //= 'Banana'

// What happened here is, that we actually only took one value of the object
// and transformed it. We can still fold it afterwards as we receive a wrapped Entry.
// This gives you full control over the flow of what's happening with your entries
```

You can even add custom methods to your entries, so let's see how to configure the model.

## Customize a Model <a name="customize"></a>

The Model comes with a bunch of preconfigured values that should make live easy and get you started quickly without making you jump through a bunch of hoops. But sometimes those values are not right, and that's why you can configure a model instance to your liking
Let's stary easy by changing the primaryKey.

```js
const products = new Model({
  primaryKey: "secret_id"
});
```

Now products will use `secret_id` as main identification for all the `find`, `update` and `destroy` methods.
Here is a full list of available params:

```js
{
  // Change the primaryKey
  primaryKey: 'custom',

  // Enforce a primary key to be set on each record by Modelist (uuid/v4)
  // default: false
  setPrimaryKey: true

  // Allow Modelist to convert strings into objects with the value on the key text
  // and and id based on the primaryKey
  // e.g: ['Banana'] -> will be stored as [{text: 'Banana', id: uuid()}]
  // default: false
  convert: false,

  // Enforce that every entry is matched against the schema
  // default: false
  validate: false,

  // Schema can be defined where each entry will be matched against
  schema: {
    custom: 'String'
  },

  // Pass in data by default
  data: [...],

  // Add custom filters to the collection that will be made available
  // as getters on the root of the model.
  filters: {
    // i.e.: return all completed tasks of a task list
    // This will also give you access to the subset of the collection as a fresh Model instance
    completed: (collection) => collection.filter( item => item.done === true)
  },

  // Add methods to entries
  methods: {
    customMethod: (e) => {
      e.amount--
      return e
    },
  }
}
```

### Extending the model with custom filters <a name="customize-filters"></a>

Sometimes you want specific subsets of all the stored data of your Model.
That's a perfect opportunity to add filters to your instance.
_Filters_ are custom methods that allow you to retrieve a subset of the passed in collection.
The result is than passed down for you as a fresh `Model` instance.

**Some caveat**:
The new instance gives you access to all core functions but without the filters.
So it's not possible to call a filter method and chain another custom filter.

```js
const tasks = new Model({
  data: [
    { task: "Go for a walk", done: false },
    { task: "Buy Milk", done: true },
    { taks: "Feed the cat", done: true }
  ],
  filters: {
    completed: c => c.filter(t => t.done === true)
  }
});

console.log(tasks.completed.size); //= 2
console.log(tasks.completed.all()); //= [{task: 'Buy Milk', done: true}, {taks: 'Feed the cat', done: true}]
```

### Using custom methods for entries <a name="customize-entry"></a>

If you passed in methods to the Model, they're made available for you on the Entry object.
By default those methods will be applied as folds so they just return whatever the function returns.

```js
const fruits = new Model({
  primaryKey: "name",

  data: [{ name: "Apple" }],

  methods: {
    getSaladName: e => `${e.name} Salad`
  }
});

fruits.find("Apple").getSaladName(); //= Apple Salad
```

But you can actually also map over the value and get another Entry should you want to do something else or chain various methods. In this case the method name needs to be passed as a String.

```js
fruits
  .find("Apple")
  .map("getSaladName")
  .toString(); //= Entry('Apple Salad')
```

### Schemas <a name="schemas"></a>

Schemas allow defining how the root data structure of each data sent into the collection should look like.
It support primiteves like `Number`, `String`, `Boolean`, `Object`, `Array` or event custom types.

To leverage the schema validation, just add the `validation` key to your Model.
For example you can successfully match this data:

```js
const data = {
  id: 1,
  name: "Jane",
  favs: ["a", "b"],
  settings: {},
  custom: new Custom()
};
```

against this schema

```js
const schema = {
  id: Number,
  name: String,
  favs: Array,
  settings: Object,
  custom: Custom
};
```

If something is not fitting that schema it will print out a warning, but still try to process the data.

## Examples <a name="examples"></a>

### Use Modelist within in Vuex <a name="example-vuex"></a>

Let's see a simple example how to use Modelist within in Vuex.
This makes mutations, and actions way more convenient, but can also make your components a little more structured.

```js
import Model from "@codeship/modelist";
import uuid from "uuid/v1";

export default {
  state: {
    tasks: new Model()
  },

  mutations: {
    recordTask(state, entry) {
      state.tasks.record(entry);
    },

    updateTask(state, id, data) {
      state.tasks.update(id, data);
    }
  },

  actions: {
    addTask({ commit }, task) {
      const newTask = { id: uuid(), body: task, done: false };
      commit("recordTask", newTask);
    },

    completeTask({ commit }, task) {
      commit("updateTask", task.id, { done: true });
    },

    changeTask({ commit }, task, body) {
      commit("updateTask", task.id, { body });
    }
  },

  getters: {
    tasks: state => state.tasks
  }
};
```

Eventually you can structure the store in a very convenient way and, see that the `updateTask` mutation can actually be used for two different actions.
For the getter, it's very easy to just return the whole collection and give the components access to it's internal functions if you like.
On the client this could look like this:

```html
<ul>
  <task v-for="task in tasks.all()" :task="task">
</ul>
```

The important piece here is, that by using the whole task collection, `task` will be the plain object for your convenience.

## Meta <a name="meta"></a>

This Project is managed by [Roman Kuba <rkuba@cloudbees.com>](mailto:rkuba@cloudbees.com) from the Codeship Team.
You can best reach me on Twitter [@Codebryo](https://twitter.com/Codebryo).
