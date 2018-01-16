Modelist
========

Flexible modelstructure for clean data mangement.

## What is Modelist

Modelist is a client based collection system that makes handling data convenient.
It works great in reactive systems and flux stores like `Vuex`.

If you want to see some real life examples, you'll find the further down.

## Installation

`Modelist` can be added to your project with ease.

```sh
npm install -D @codeship/modelist

# or

yarn add @codeship/modelist
```

## Usage

After adding `modelist` to your project, usage is quite simple.

```js
import Model from '@codeship/modelist'
```
This gives you access to the Model contructor. The easiest way to create a new collection is to instantiate a new Model.

```js
const users = new Model
```

That's about it. Nothing more that needs to be done to get access to a new collection and all the default methods that come with it.


**Add entries to the collection**

```js
users.record({id: 1, name: 'Jane Doe'})
```

**Get all entries of the collection**
```js
users.all()
```

**Retrieve the first element of the collection**
```js
users.first()
```

**Retrieve one specific element of the collection based on the primary key**_(default: id)_
```js
users.find(1)
```

**Update an entry based on the primary key**
Only the values that should be changed need to get passed in
```js
users.update(1, {name: 'Jane Goodall'})
```

**Remove an entry from the collection**
```js
users.destroy(1)
```

**Get the number of elements in the collection**
```js
users.size
```

Internally all collection operations `destroy`, `record` and `update` use default Array methods, so reactive systems can track changes to the collection.

## Single Entries

Usually there is something that needs to be done with an entry of the collection when it gets retrieved on it's own.
Therfore `Modelist` will wrap that result in an `Entry1 object.
Single entries aim to support functional composition. Entries come with default functionality that can be used to alter the value you received.
Let's see this in action right away:


```js
const fruits = new Model
fruits.record({ id: 1, name: 'Banana' })

// This will return the Entry object
const entry = fruits.find(1)

// Inspect a entry by using .toString() for easy debugging
entry.toString() //= Entry({ id: 1, name: 'Banana' })

// By default an Entry comes with two functions
// map() to map over the current value and wrap the output in another Entry
// fold() to get the value out of the entry

entry.fold() //= {id: 1, name: 'Banana'}

// Let's say you want only the name
entry.fold(e => e.name) //= 'Banana'

// What if you want to change the name before folding
entry.map(e => e.name.toUpperCase()).fold() //= 'Banana'

// What happened here is, that we actually only took one value of the object
// and transformed it. We can still fold it afterwards as we receive a wrapped Entry.
// This gives you full control over the flow of what's happening with your entries
```

You can even add custom methods to your entries, so let's see how to configure the model.
## Customize a Model

The Model comes with a bunch of preconfigured values that should make live easy and get you started quickly without making you jump through a bunch of hoops. But sometimes those values are not right, and that's why you can configure a model instance to your liking
Let's stary easy by changing the primaryKey.

```js
const products = new Model({
  primaryKey: 'secret_id'
})
```

Now products will use `secret_id` as main identification for all the `find`, `update` and `destroy` methods.
Here is a full list of available params:

```js
{
  // Change the primaryKey
  primaryKey: 'custom',

  // Pass in data by default
  data: [...]

  // Add methods to entries
  methods: {
    customMethod: (e) => {
      e.amount--
      return e
    },
  }
}
```

## Using custom methods for entries

If you passed in methods to the Model, they're made available for you on the Entry object.
By default those methods will be applied as folds so they just return whatever the function returns.

```js
const fruits = new Model({
  primaryKey: 'name',

  data: [
    {name: 'Apple'}
  ],

  methods: {
    getSaladName: (e) => `${e.name} Salad`
  }
})

fruits.find('Apple').getSaladName() //= Apple Salad
```

But you can actually also map over the value and get another Entry should you want to do something else or chain various methods. In this case the method name needs to be passed as a String.

```js
fruits.find('Apple').map('getSaladName').toString() //= Entry('Apple Salad')
```

## Examples

### Use Modelist within in Vuex

Let's see a simple example how to use Modelist within in Vuex.
This makes mutations, and actions way more convenient, but can also make your components a little more structured.

```js
import Model from '@codeship/modelist'
import uuid from 'uuid/v1'

export default {
  state: {
    tasks: new Model()
  },

  mutations: {
    recordTask(state, entry) {
      tasks.record(entry)
    },

    updateTask(state, id, data) {
      tasks.update(id, data)
    }
  },

  actions: {
    addTask({ commit }, task ) {
      const newTask = { id: uuid(), body: task, done: false }
      commit('recordTask', newTask)
    },

    completeTask({ commit }, task ) {
      commit('updateTask', task.id, { done: true })
    },


    changeTask({ commit }, task, body ) {
      commit('updateTask', task.id, { body })
    },
  },

  getters: {
    tasks: (state) => state.tasks
  }
}
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


## TBD

Documentation and added support for Schema
