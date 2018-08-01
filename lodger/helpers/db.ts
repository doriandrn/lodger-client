// import { definitii } from '../definitii'
// import { RxDocument, RxCollection, RxJsonSchema } from 'rxdb'
// import { KnownItemTypes, Item, Form, FormItemName } from '../typings/forms'

// /**
//  * Ingheata item-urile din DB in caz de e nevoie sa le paseze in state
//  * state-ul nu suporta chestii reactive, e el reactiv
//  * @param {*} items 
//  */
// const sanitizeDBItems = (items: RxCollection<any, [RxDocument<any>]>) => Object.freeze(Array(items).map((item: RxDocument<any>) => item._data))



// // /**
// //  * Incarca si returneaza datele formularului dupa numele acestuia
// //  * 
// //  * @param {string} numeFormular 
// //  * @returns {object} datele formularului
// //  */
// // const getFormData = (name: FormItemName) => {
// //   if (!name)
// //     throw new Error('parametri insuficienti')
// //   return Object.assign(require(`../forms/${name}`), { name })
// // }

// /**
//  * Initializeaza o schema default a unei colectii
//  * 
//  * @param {string} name - numele colectiei
//  * @returns {object} detaliile schemei
//  */
// // const collectionSchemaInitial = (name: string): RxSchema => {
// //   if (!name)
// //     throw new Error('Niciun nume dat schemei')

// //   return {
// //     name,
// //     type: 'object',
// //     version: 0,
// //     autoMigrate: true,
// //     properties: {},
// //     required: []
// //   }
// // }

// /**
//  * Transforma / maniPULeAza un camp de-al nostru din forms intr-unu' compatibil RXDB
//  * 
//  * @param {object} formItem - campul din formular
//  * @returns {object} campul transformat, ready pt rxdb
//  */
// const toCollectionField = (formItem: Item) => {
//   if (!formItem.id)
//     throw new Error('camp fara id')

//   const { id, step, indexRef } = formItem
//   let { type, ref } = formItem

//   type = toDBtype(type)
//   ref = ref ? {
//     ref,
//     items: {
//       // Folosim doar id-uri pt. referinta intre obiecte, de aici 'string'
//       type: 'string'
//     }
//   } : undefined

//   if (ref && indexRef) {
//     Object.assign(ref, { index: indexRef })
//   }

  
//   const descriereCamp = {
//     type
//   }
//   // cheiImutabile.forEach(((cheie: string) => {
//   //   if (!formItem[cheie]) return
//   //   Object.assign(descriereCamp, { [cheie]: formItem[cheie] })
//   // })

//   if (step) Object.assign(descriereCamp, { multipleOf: step })
//   if (ref) Object.assign(descriereCamp, ref)

//   return {
//     [id]: descriereCamp
//   }
// }

// /**
//  * Adauga un camp la schema unei colectii
//  * 
//  * @param {Object} formItem - campu'
//  * @param {Object} schema - schema colectiei
//  * @returns {object} schema modificata
//  */
// const addFieldToSchema = (formItem: Item, schema: RxJsonSchema) => {
//   if (!formItem || !schema)
//     throw new TypeError('parametri insuficienti')
//   if (typeof formItem !== 'object' || typeof schema !== 'object')
//     throw new TypeError('parametri incorecti')

//   schema.properties = schema.properties || {}
//   schema.required = schema.required || []
  
//   if (formItem.required) schema.required.push(formItem.id)
//   Object.assign(schema.properties, toCollectionField(formItem))
//   return schema
// }

// /**
//  * Face schema unei colectii din datele formularului
//  * 
//  * @param {*} param0 
//  * @returns {object} schema modificata
//  */
// // const makeSchemaForCollection = ({ name, campuri }: Form) => {
// //   if (!name) throw new Error('makeCollection apelat fara nume')

// //   const schema = collectionSchemaInitial(name)

// //   campuri
// //     .filter(camp => !camp.notInDb)
// //     .forEach(camp => {
// //       addFieldToColSchema(camp, schema)
// //     })
// //   return schema
// // }

// /**
//  * Transforma campurile din datele unui formular intr-o colectie RXDB
//  * pentru a fi interpretata de DB
//  * 
//  * @param {object} data 
//  * @returns {object} Datele colectiei pentru RXDB
//  */
// const makeCollection = (formData: Form) => {
//   let { name, metode } = formData
//   const colNamePlural = definitii.get(name)

//   if (!colNamePlural)
//     throw new Error(`nume colectie: '${name}' negasit in definitii`)
//   const schema = makeSchemaForCollection(formData)
//   const colectie = {
//     name: colNamePlural,
//     schema,
//     sync: true
//   }

//   if (!metode) return colectie
//   const cheiMetode = Object.keys(metode)
//   if (metode && cheiMetode.length > -1) {
//     Object.assign(colectie, { methods: { ...metode } })
//   }

//   return colectie
// }

// export { 
//   toDBtype,
//   getFormData, 
//   sanitizeDBItems,
//   makeSchemaForCollection,
//   makeCollection,
//   collectionSchemaInitial,
//   addFieldToSchema,
//   toCollectionField
// }
