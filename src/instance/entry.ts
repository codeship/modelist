import { isObjectLike, isString, mapValues } from 'lodash'
import { IMethods } from '@/types'

export default function(methods: IMethods = {}) {

  delete methods['map']
  delete methods['fold']

  const Entry = (x: any) => ({
    map: (f: (x: object) => object) => {
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
    fold: (f: (x: object) => any) => f ? f(x) : x,
    toString: () => `Entry(${ isObjectLike(x) ? JSON.stringify(x) : x})`,
    ...mapValues(methods, (f) => f.bind(null, x))
  })

  return Entry
}
