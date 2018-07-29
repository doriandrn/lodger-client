import { traverse, no$ } from './helpers/functions'
import schema from './schema'

type LodgerDefinitii = Map<string, object>
type HelperCautare = {
  [taxonomie: string]: any
}

const helperCautare: HelperCautare = {}
const definitii: LodgerDefinitii = new Map()

/**
 * Traverseaza recursiv schema (un obiect)
 * in functie de chei
 * callback: k = key, v = value
 */
traverse(schema, (k: string, v: any) => {
  if (v._cheiCautare && v._cheiCautare.length > 0) helperCautare[no$(k)] = v._cheiCautare
  if (v._singular) definitii.set(v._singular, no$(k))
})

export { definitii, helperCautare }
