import { RxJsonSchema } from 'rxdb'
import FormItemTypes from 'lodger/lib/defs/FormItemTypes'
import { Form } from 'lodger/lib/Form';

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
function toRxDBtype(type: KnownItemTypes): RxDBType {
  const _default = 'string'
  const { strings, numbers, arrays, objects } = FormItemTypes

  if (!type || strings.indexOf(type) > -1) return _default
  if (objects.indexOf(type) > -1) return 'object'
  if (numbers.indexOf(type) > -1) return 'number'
  if (arrays.indexOf(type) > -1) return 'array'
  return _default
}

/**
 * Transforms a lodger form field to a valid RxSchema one
 * 
 * @param formItem 
 */
const toSchemaField = (formItem: Item) => {
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

  const field = { type }

  // cheiImutabile.forEach(((cheie: string) => {
  //   if (!formItem[cheie]) return
  //   Object.assign(descriereCamp, { [cheie]: formItem[cheie] })
  // })

  if (step) Object.assign(field, { multipleOf: step })
  if (ref) Object.assign(field, ref)

  return { [id]: field }
}


/**
 * Adauga un camp la schema Rx
 * 
 * @param {Object} formItem - campu'
 * @param {Object} schema - schema colectiei
 * @returns {object} schema modificata
 */
const pushFieldToSchema = (formItem: Item, schema: RxJsonSchema) => {
  if (!formItem || !schema)
    throw new TypeError('parametri insuficienti')
  if (typeof formItem !== 'object' || typeof schema !== 'object')
    throw new TypeError('parametri incorecti')

  const { required, properties } = schema

  schema.properties = properties || {}
  schema.required = required || []
  
  const { id } = formItem
  if (!id) {
    throw new TypeError(`No ID supplied for formItem ${formItem}`)
  }

  if (formItem.required && required && required.indexOf(id) < 0) schema.required.push(id)
  Object.assign(schema.properties, toSchemaField(formItem))
  return schema
}

/**
 * Manipulates the final data before submitting the form to the DB
 * 
 * @param data
 */
const handleOnSubmit = (data: LodgerFormData) => {
  const manipulatedData = {}
  Object.keys(data).forEach(what => {
    let value = data[what]
    // TODO: adauga data la indecsii numiti 'la'
    if (what === 'la') value = Date.now()
    if (value === null || value === 'undefined') return

    manipulatedData[what] = value
  })
  return manipulatedData
}

export {
  toRxDBtype,
  toSchemaField,
  pushFieldToSchema,
  handleOnSubmit
}
