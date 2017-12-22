import { isObjectLike } from 'lodash'

const Entry = (x) => ({
  map: (f) => Entry(f(x)),
  fold: (f) => f ? f(x) : x,

  toString: () => `Entry(${ isObjectLike(x) ? JSON.stringify(x) : x})`
})

export default Entry
