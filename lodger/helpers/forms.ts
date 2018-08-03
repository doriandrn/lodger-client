import { Item, RxDBType, KnownItemTypes } from 'lodger/typings/forms'
import { Schema } from 'lodger/lib/Schema'
import { RxJsonSchema } from 'rxdb'
import FormItemTypes from 'lodger/defs/FormItemTypes'

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
export function toRxDBtype(type: KnownItemTypes): RxDBType {
  const _default = 'string'
  const { strings, numbers, arrays } = FormItemTypes

  if (!type || strings.indexOf(type) > -1) return _default
  if (numbers.indexOf(type) > -1) return 'number'
  if (arrays.indexOf(type) > -1) return 'array'
  return _default
}

/**
 * Transforms a lodger form field to a valid RxSchema one
 * 
 * @param formItem 
 */
export const toSchemaField = (formItem: Item) => {
  if (!formItem.id)
    throw new Error('camp fara id')

  const { id, step, indexRef } = formItem
  let { type, ref } = formItem

  type = toRxDBtype(type)
  ref = ref ? {
    ref,
    items: {
      // Folosim doar id-uri pt. referinta intre obiecte, de aici 'string'
      type: 'string'
    }
  } : undefined

  if (ref && indexRef) {
    Object.assign(ref, { index: indexRef })
  }

  const descriereCamp = {
    type
  }

  // cheiImutabile.forEach(((cheie: string) => {
  //   if (!formItem[cheie]) return
  //   Object.assign(descriereCamp, { [cheie]: formItem[cheie] })
  // })

  if (step) Object.assign(descriereCamp, { multipleOf: step })
  if (ref) Object.assign(descriereCamp, ref)

  return {
    [id]: descriereCamp
  }
}


/**
 * Adauga un camp la schema Rx
 * 
 * @param {Object} formItem - campu'
 * @param {Object} schema - schema colectiei
 * @returns {object} schema modificata
 */
export const pushFieldToSchema = (formItem: Item, schema: RxJsonSchema | Schema) => {
  if (!formItem || !schema)
    throw new TypeError('parametri insuficienti')
  if (typeof formItem !== 'object' || typeof schema !== 'object')
    throw new TypeError('parametri incorecti')

  schema.properties = schema.properties || {}
  schema.required = schema.required || []

  if (formItem.required) schema.required.push(formItem.id)
  Object.assign(schema.properties, toSchemaField(formItem))
  return schema
}
