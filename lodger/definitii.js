import { traverse, no$ } from './helpers/functions'
import schema from './schema'

const helperCautare = {}
const definitii = new Map()

/**
 * Traverseaza recursiv schema (un obiect)
 * in functie de chei
 * callback: k = key, v = value
 */
traverse(schema, (k, v) => {
  if (v._cheiCautare && v._cheiCautare.length > 0) helperCautare[no$(k)] = v._cheiCautare
  if (v._singular) definitii.set(v._singular, no$(k))
})

export { definitii, helperCautare }
