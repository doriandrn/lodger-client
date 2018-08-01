/**
 * Forms for Lodger
 * are quite diferrently structured
 * than a normal JsonSchema
 */

import { RxJsonSchema } from 'rxdb'

import {
  FormData,
  Fields,
  FormName,
  FormMethods
} from '../typings/forms'

/**
 * Form Errors Definition
 * 
 * TODO: account for translations
 */
export const enum FormErrors {
  invalidRequested = 'Invalid form requested.',
  noData = 'Form is missing data',
  missingName = 'Forms should have a name'
}

/**
 * Error logger for forms
 */
export class FormError extends Error {
  constructor(m: string) {
    super(m)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, FormError.prototype)
  }
}

/**
 * Require path for known forms
 */
const formsPath: string = `lodger/forms/${process.env.NODE_ENV === 'test'
    ? `__mocks__`
    : ''
  }`

/**
 * Form class
 */
export class Form {
  readonly name: FormName
  readonly fields: Fields
  readonly methods: FormMethods

  readonly _schema?: RxJsonSchema
  readonly _collection?: RxJsonSchema

  constructor(data: FormData) {
    if (!data) throw new FormError(FormErrors.noData)
    const { fields, name, methods } = data
    if (!name) throw new FormError(FormErrors.missingName)
    if (!fields || !fields.length) throw new FormError(FormErrors.noData)
    this.name = name
    this.fields = fields
    this.methods = methods || []
  }

  /**
   * Loads a known form by name
   * 
   * @param name 
   */
  static loadByName(name: string) {
    let form
    try {
      form = require(`${formsPath}/${name}`)
      if (form.default) form = form.default
      Object.assign(form, { name })
    } catch (e) {
      throw new FormError(FormErrors.invalidRequested)
    }
    return new Form(form)
  }
}
