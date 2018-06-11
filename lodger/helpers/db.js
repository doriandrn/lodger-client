const sanitizeDBItems = items => Object.freeze(items.map(item => item._data))
import { definitii } from '../definitii'

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
const toDBtype = type => {
  const _default = 'string'
  const strings = ['text', 'textarea', 'select', 'search']
  const numbers = ['date-time', 'bani', 'date']
  const arrays = ['scari', 'servicii', 'furnizori', 'contactFields', 'contoare', 'distribuire', 'selApartamente']

  if (!type || strings.indexOf(type) > -1) return _default
  if (numbers.indexOf(type) > -1) return 'number'
  if (arrays.indexOf(type) > -1) return 'array'
  return _default
}

/**
 * Incarca si returneaza datele formularului dupa numele acestuia
 * 
 * @param {string} numeFormular 
 * @returns {object} datele formularului
 */
const getFormData = (id, name) => {
  if (!id || !name)
    throw new Error('parametri insuficienti')
  return Object.assign(require(`../forms/${id}`), { name: id })
}

/**
 * Initializeaza o schema default a unei colectii
 * 
 * @param {string} name - numele colectiei
 * @param {string} schemaType - tipul (default: 'object')
 * @returns {object} detaliile schemei
 */
const collectionSchemaInitial = (name, schemaType) => {
  if (!name)
    throw new Error('Niciun nume dat schemei')

  const type = schemaType || 'object'

  return {
    name,
    type,
    version: 0,
    autoMigrate: true,
    properties: {},
    required: []
  }
}

/**
 * Transforma / maniPULeAza un camp de-al nostru din forms intr-unu' compatibil RXDB
 * 
 * @param {object} formItem - campul din formular
 * @returns {object} campul transformat, ready pt rxdb
 */
const toCollectionField = formItem => {
  if (!formItem.id)
    throw new Error('camp fara id')

  const { id, required, primary, step, encrypted, index, indexRef } = formItem
  let { type, ref } = formItem

  type = toDBtype(type)
  ref = ref ? {
    ref,
    items: {
      // Folosim doar id-uri pt. referinta intre obiecte, de aici 'string'
      type: 'string'
    },
    index: indexRef
  } : undefined

  const descriereCamp = {
    type,
    primary,
    index,
    encrypted,
    required
  }

  if (step) Object.assign(descriereCamp, { multipleOf: step })
  if (ref) Object.assign(descriereCamp, { ref })

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
const addFieldToColSchema = (formItem, schema) => {
  if (!formItem || !schema)
    throw new Error('parametri insuficienti')
  if (typeof formItem !== 'object' || typeof schema !== 'object')
    throw new Error('parametri incorecti')

  schema.properties = schema.properties || {}
  schema.required = schema.required || []
  
  if (formItem.required) schema.required.push(formItem.id)
  Object.assign(schema.properties, formItem)
  return schema
}

/**
 * Face schema unei colectii din datele formularului
 * 
 * @param {*} param0 
 * @returns {object} schema modificata
 */
const makeSchemaForCollection = ({ name, campuri }) => {
  if (!name) throw new Error('makeCollection apelat fara nume')

  const schema = collectionSchemaInitial(name)

  campuri
    .filter(camp => !camp.notInDb)
    .forEach(camp => {
      addFieldToColSchema(toCollectionField(camp), schema)
    })
  return schema
}

/**
 * Transforma campurile din datele unui formular intr-o colectie RXDB
 * pentru a fi interpretata de DB
 * 
 * @param {object} data 
 * @returns {object} Datele colectiei pentru RXDB
 */
const makeCollection = (formData) => {
  let { name, metode } = formData
  const colNamePlural = definitii.get(name)

  if (!colNamePlural)
    throw new Error(`nume colectie: '${name}' negasit in definitii`)
  const schema = makeSchemaForCollection(formData)

  return {
    name: colNamePlural,
    schema,
    methods: metode,
    sync: true
  }
}

export { 
  toDBtype,
  getFormData, 
  sanitizeDBItems,
  makeSchemaForCollection,
  makeCollection,
  collectionSchemaInitial,
  addFieldToColSchema,
  toCollectionField
}
