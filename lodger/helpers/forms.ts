import { Item } from 'lodger/typings/forms'
import { RxJsonSchema } from 'rxdb'

const toCollectionField = (formItem: Item) => {
  if (!formItem.id)
    throw new Error('camp fara id')

  const { id, step, indexRef } = formItem
  let { type, ref } = formItem

  type = toDBtype(type)
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
 * Adauga un camp la schema unei colectii
 * 
 * @param {Object} formItem - campu'
 * @param {Object} schema - schema colectiei
 * @returns {object} schema modificata
 */
export const addFieldToSchema = (formItem: Item, schema: RxJsonSchema) => {
  if (!formItem || !schema)
    throw new TypeError('parametri insuficienti')
  if (typeof formItem !== 'object' || typeof schema !== 'object')
    throw new TypeError('parametri incorecti')

  schema.properties = schema.properties || {}
  schema.required = schema.required || []

  if (formItem.required) schema.required.push(formItem.id)
  Object.assign(schema.properties, toCollectionField(formItem))
  return schema
}
