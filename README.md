Modelist
========

Flexible modelstructure for clean data mangement.

## Installation

Add `modelist` to your project by:

```sh
yarn add @codeship/modelist
```

## Usage

Modelist aims to give you good control about local collection managment.

```js
import Model from '@codeship/modelist'

const users = new Model
```

Your new Model comes with a bunch of methods:

```js
// Add entries to the collection
users.record({id: 1, name: 'Jane Doe'})

// Get all entries of the collection
users.all()

// Get one specific element of the collection based on the primary key (default: id)
users.find(1)

// Update an entry based on the primary key
// Only the values that should be changed need to get passed in
users.update(1, {name: 'Jane Goodall'})

// Remove an entry from the collection
users.destroy(1)

// Get the number of elements in the collection
users.size
```

All alternations of the collection use Array methods.

## Entries

When searching for one element you get a Entry object returned wrapping the current value of the entry.
Entries aim to support composition, so it comes with default functionality that can be used to alter the value you received.

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

You can actually add custom methods for your entries, so let's see how to configure the model.
## Customize the Model

The Model comes with a bunch of preconfigured values that should make live easy and get you started quickly without making you jump through a bunch of hoops.
Let's stary easy by changing the primaryKey.

```js
const products = new Model({
  primaryKey: 'secret_id'
})
```

Now products will use `secret_id` as main identification for all the find, update and destroy methods.
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

If you passed in methods to the Model, they are made available for you on the Entry object.
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

## TBD

Documentation and added support for Schema
