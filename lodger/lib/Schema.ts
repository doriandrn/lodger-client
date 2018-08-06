// import { AllowedSchemaOverwrites } from 'lodger/typings/forms'
// // import { SchemaErrors } from 'lodger/typings/lib/Schema'

// import { pushFieldToSchema } from 'lodger/helpers/forms'
// import { Form } from 'lodger/lib/Form'
// import { RxSchema } from 'rxdb'

// // export interface LodgerSchema extends Schema {
// //   new(): LodgerSchema
// // }
// const SchemaError = Error

// enum Errors {
//   invalidForm = 'Invalid form supplied'
// }

// declare interface Schema extends RxSchema {
//   description?: string
//   new (): Schema
// }


// /**
//  * Makes a RxSchema from a Lodger Form
//  */
// class Schema {
//   title: string
//   properties: object = {}
//   required: string[] = []
//   type: string = 'object'
//   version: number = 0

//   constructor (form: Form, overwrites?: AllowedSchemaOverwrites) {
//     if ( !(form && (form instanceof Form)) ) {
//       throw new SchemaError(Errors.invalidForm)
//     }
//     const { name, fields } = form
//     this.title = name

//     if (overwrites) {
//       Object.assign(this, overwrites)
//     }

//     fields
//       .filter(field => !field.notInDb)
//       .forEach(field => { pushFieldToSchema(field, this) })
//   }
// }

// export { Schema, Errors }
