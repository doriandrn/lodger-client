const sanitizeDBItems = items => Object.freeze(items.map(item => item._data))

/**
 * Converteste tipurile campurilor 'noastre' in primare
 * 
 * Explicatie:
 * DB-ul nu stie decat de tipurile primare:
 * -> boolean, string, number, array, object
 * Schema noastra e mult mai detaliata
 * 
 * @param {string} type 
 */
const toDBtype = type => {
  if (!type || ['text', 'textarea', 'select', 'search'].indexOf(type) > -1) return 'string'
  if (['date-time', 'bani', 'date'].indexOf(type) > -1) return 'number'
  if (['scari', 'servicii', 'furnizori', 'contactFields', 'contoare', 'distribuire', 'selApartamente'].indexOf(type) > -1) return 'array'
  return type
}

/**
 * Incarca si returneaza datele formularului dupa numele acestuia
 * 
 * @param {string} numeFormular 
 */
const getFormData = numeFormular => {
  if (!numeFormular) throw new Error('getFormData( -- ) - apelat fara a cere vreun nume de formular')
  return require(`../forms/${numeFormular}`)
}

/**
 * Initializeaza o schema default a unei colectii
 * 
 * @param {string} name - numele colectiei
 * @param {string} schemaType - tipul (default: 'object')
 */
const collectionSchemaInitial = (name, schemaType) => {
  if (!name) throw new Error('Niciun nume dat schemei')
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
 * @param { Object } formItem - campul din formular
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
    encrypted
  }

  if (step) Object.assign(descriereCamp, { multipleOf: step })

  return {
    [id]: descriereCamp
  }
}

/**
 * Adauga un camp la schema unei colectii
 * 
 * @param {Object} formItem - campu'
 * @param {Object} schema - schema colectiei
 */
const addFieldToColSchema = (formItem, schema) => {
  if (!formItem || !schema)
    throw new Error('parametri insuficienti')
  if (typeof formItem !== 'object' || typeof schema !== 'object')
    throw new Error('parametri incorecti')
  
  if (formItem.required) schema.required.push(formItem.id)
  Object.assign(schema.properties, formItem)
  return schema
}

/**
 * Transforma campurile din datele unui formular intr-o colectie RXDB
 * pentru a fi interpretata de DB
 * 
 * @param {object} data 
 * @returns {object} Datele colectiei pentru RXDB
 */
const makeCollection = data => {
  if (!data) throw new Error('makeCollection apelat fara data')
  const { key, value } = data
  const { campuri, metode } = getFormData(key)
  const schema = collectionSchemaInitial(key)

  campuri
    .filter(camp => !camp.notInDb)
    .forEach(addFieldToColSchema(formItem, schema))

  return {
    name: value,
    schema,
    methods: metode,
    sync: true
  }
}

export { 
  toDBtype,
  getFormData, 
  sanitizeDBItems, 
  makeCollection,
  collectionSchemaInitial,
  addFieldToColSchema,
  toCollectionField
}
