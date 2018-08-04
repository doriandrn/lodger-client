import { traverse, no$ } from 'lodger/helpers/functions'
import { Singular, Plural } from 'lodger/typings/defs'
import schema from './schema'

type Plurals = Map<Singular, Plural>
type HelperCautare = {
  [taxonomie: string]: any
}

const helperCautare: HelperCautare = {}
const plurals: Plurals = new Map()

const definePlural = (singular: Singular, plural: Plural) => {
  plurals.set(no$(singular), plural)
}

/**
 * Traverseaza recursiv schema (un obiect)
 * in functie de chei
 * callback: k = key, v = value
 */
// traverse(schema, (k: string, v: any) => {
//   if (v._cheiCautare && v._cheiCautare.length > 0) helperCautare[no$(k)] = v._cheiCautare
//   if (v._plural) definePlural(k, v._plural)
// })

export { plurals, helperCautare }
