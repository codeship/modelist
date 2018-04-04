import { isObjectLike, isString, mapValues } from 'lodash'

export default function(methods = {}) {

  delete methods['map']
  delete methods['fold']

  const Entry = (x) => ({
    map: (f) => {
      if(isString(f)) {
        try {
          return Entry(methods[f](x))
        }
        catch (e) {
          console.warn(`No method named ${f} is defined!`)
        }
      }
      else
        return Entry(f(x))
    },
    fold: (f) => f ? f(x) : x,
    toString: () => `Entry(${ isObjectLike(x) ? JSON.stringify(x) : x})`,
    ...mapValues(methods, (f) => f.bind(null, x))
  })

  return Entry
}
