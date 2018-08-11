/**
 * Forms for Lodger
 * are quite diferrently structured
 * than a normal JsonSchema
 */
import Debug from 'debug'
import { RxJsonSchema, RxCollectionCreator } from 'rxdb'
import { pushFieldToSchema } from 'lodger/helpers/forms'
import { FormError } from 'lodger/lib/Errors'
import {
  LodgerForm, FormName
} from 'lodger/typings/forms'

// import { plural } from 'lodger/helpers/functions';

if (process.env.NODE_ENV === 'test') {
  Debug.enable('Form:*')
}

/**
 * Form Errors Definition
 * 
 * TODO: account for translations
 */
enum Errors {
  invalidRequested = 'Invalid form requested: %%',
  invalidName = 'Invalid name supplied',
  noData = 'Form %% is missing data',
  missingName = 'Forms should have a name',
  missingPlural = 'A plural definition is required'
}

/**
 * Require path for known forms
 */
const formsPath: string = `lodger/forms/${process.env.NODE_ENV === 'test'
    // ? `__stubs__`
    ? ''
    : ''
  }`


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
  name: FormName

  constructor (
    private data: LodgerForm,
  ) {
    // if (!this.data) {
    //   console.error(data)
    //   throw new FormError(Errors.noData)
    // }
    const { fields, name, plural } = this.data
    if (!name) throw new FormError(Errors.missingName)
    if (!fields || !fields.length) throw new FormError(Errors.noData, name)
    if (!plural) {
      throw new FormError(Errors.missingPlural)
    }
    this.name = name
  }

  /**
   * A valid RxJsonSchema out of the form
   */
  get schema (): RxJsonSchema {
    const { name, fields } = this.data
    const schema: RxJsonSchema = JSON.parse(JSON.stringify(defaultSchema))
    schema.title = name
    fields
      .filter(field => !field.notInDb)
      .forEach(field => {
        pushFieldToSchema(field, schema)
      })
    
    return <RxJsonSchema>schema
  }

  /**
   * 
   */
  get collection (): RxCollectionCreator {
    const {
      schema,
      data: { plural }
    } = this
    const name = plural
    return <RxCollectionCreator>{ name, schema }
  }

  /**
   * Loads a known form by name
   * 
   * @param name 
   */
  static loadByName (name: string): Form {
    const debug = Debug('lodger:Form')
    let form

    try {
      form = require(`${formsPath}/${name}`)
      if (form.default) form = form.default
      Object.assign(form, { name })
      debug('✓', name)
    } catch (e) {
      throw new FormError(Errors.invalidRequested, name)
    }
    return new Form(form)
  }
}

export {
  Form,
  Errors
}
