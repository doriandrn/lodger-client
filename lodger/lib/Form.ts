/**
 * Forms for Lodger
 * are quite diferrently structured
 * than a normal JsonSchema
 */

import { RxJsonSchema, RxCollectionCreator } from 'rxdb'
import { pushFieldToSchema } from 'lodger/helpers/forms'
import {
  FormData,
  Fields,
  FormName,
  FormMethods
} from '../typings/forms'
import { Plural } from '../typings/defs';
import { plural } from '../helpers/functions';

/**
 * Form Errors Definition
 * 
 * TODO: account for translations
 */
enum Errors {
  invalidRequested = 'Invalid form requested',
  noData = 'Form is missing data',
  missingName = 'Forms should have a name',
  missingPlural = 'A plural definition is required'
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

// interface Schema extends RxJsonSchema {
//   title: string,
//   required: string[],
//   type: string,
//   version: number
// }

const defaultSchema: RxJsonSchema = {
  title: '',
  properties: {},
  required: [],
  type: 'object',
  version: 0
}

/**
 * Form class
 */
class Form {
  readonly name: FormName
  readonly fields: Fields
  readonly methods: FormMethods
  private readonly _plural: Plural

  constructor (data: FormData) {
    if (!data) throw new FormError(Errors.noData)
    const { fields, name, methods } = data
    if (!name) throw new FormError(Errors.missingName)
    if (!fields || !fields.length) throw new FormError(Errors.noData)
    this.name = name
    this.fields = fields
    this.methods = methods || []
    const _plural = plural(name) || data.plural
    if (!plural) {
      throw new FormError(Errors.missingPlural)
    }
    this._plural = _plural
  }

  /**
   * A valid RxJsonSchema out of the form
   */
  get schema (): RxJsonSchema {
    const { name, fields } = this
    const schema = { ...defaultSchema }
    schema.title = name
    fields
      .filter(field => !field.notInDb)
      .forEach(field => { pushFieldToSchema(field, schema) })
    
    return schema
  }

  /**
   * 
   */
  get collection (): RxCollectionCreator {
    const { schema, _plural } = this
    const name = _plural
    return { name, schema }
  }

  /**
   * Loads a known form by name
   * 
   * @param name 
   */
  static loadByName (name: string): Form {
    let form
    try {
      form = require(`${formsPath}/${name}`)
      if (form.default) form = form.default
      Object.assign(form, { name })
    } catch (e) {
      throw new FormError(Errors.invalidRequested)
    }
    return new Form(form)
  }
}

export {
  Form,
  Errors
}