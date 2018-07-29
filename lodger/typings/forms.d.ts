import { Taxonomie } from './defs'

type Strings = 'text' | 'textarea' | 'select' | 'search'
type Numbers = 'number' | 'date-time' | 'bani' | 'date'
type Arrays = 'scari' | 'contactFields' | Taxonomie

type KnownItemTypes = Strings | Numbers | Arrays
type cheiImutabile = 'primary' | 'index' | 'encrypted' | 'required'

type ItemName = string

type RxDBType = string

type Item = {
  id: string,
  name?: ItemName,
  step?: number,
  index?: boolean,
  type: KnownItemTypes,
  ref?: Taxonomie,
  items?: object,
  indexRef?: boolean,
  required?: boolean,
  encrypted?: boolean,
  notInDb?: boolean
}

type FormData = {
  readonly name: ItemName
  readonly campuri: Item[]
  readonly metode?: Function[]
}


/**
 * Converteste tipurile campurilor 'noastre' in primare
 * 
 * Explicatie:
 * DB-ul nu stie decat de tipurile primare:
 * -> boolean, string, number, array, object
 * Schema noastra e mult mai detaliata
 * 
 * @param {string} type 
 * @returns {string} - tipul primar, eg. 'string'
 */
// export function toRxDBtype(type: KnownItemTypes): RxDBType {
//   const _default = 'string'
//   if (type instanceof Strings) return _default
//   // const strings = ['text', 'textarea', 'select', 'search']
//   // const numbers = ['number', 'date-time', 'bani', 'date']
//   // const arrays = ['scari', 'servicii', 'furnizori', 'contactFields', 'contoare', 'distribuire', 'selApartamente']

//   // if (!type || strings.indexOf(type) > -1) return _default
//   // if (numbers.indexOf(type) > -1) return 'number'
//   // if (arrays.indexOf(type) > -1) return 'array'
//   return _default
// }
