import { traverse, no$ } from './helpers/functions'
import schema from './schema'

const helperCautare = {}
const definitii = new Map()

/**
 * Traverseaza recursiv schema si in functie de chei face chestii
 * k = key, v = value
 */
traverse(schema, (k, v) => {
  if (v._cheiCautare && v._cheiCautare.length > 0) helperCautare[no$(k)] = v._cheiCautare
  if (v._singular) definitii.set(v._singular, no$(k))
})

export { definitii, helperCautare }
