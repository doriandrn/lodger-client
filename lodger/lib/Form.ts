/**
 * Forms for Lodger
 * are quite diferrently structured
 * than a normal JsonSchema
 */
import Debug from 'debug'
import { RxJsonSchema, RxCollectionCreator } from 'rxdb'
import { pushFieldToSchema } from 'lodger/lib/helpers/forms'
import { FormError } from 'lodger/lib/Errors'

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
  missingPlural = 'A plural definition is required for %%'
}

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
  constructor (
    readonly data: LodgerForm,
    readonly name: string,
    readonly plural: string
  ) {}

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
      data: { plural, methods, statics }
    } = this
    const name = plural
    return <RxCollectionCreator>{ name, schema, methods, statics }
  }

  /**
   * Makes an object suitabble to be completed
   * by the user in the end form
   * and bindable to Vue Data object
   * as it will turn reactive
   */
  componentData (
    isNewForm: boolean
  ) {
    const { data: { fields }, name } = this
    let data = {} as any
    fields.forEach(camp => {
      const {
        label,
        required,
        click,
        notInForm,
        notInDb
      } = camp
      let { id, value } = camp
      let _def = camp.default

      if (click && !id) camp.id = click
      
      // skip fields
      if (isNewForm) {
        if (!notInForm || notInDb) value = null
      }
      
      // apply getters to funcs
      if (typeof value === 'function') {
        try {
          value = value(store.getters)
        } catch (e) {
          value = null
        }
      }

      if (typeof _def === 'function') _def = _def(store.getters)

      // label
      camp.label = label || `${name ? `${name}.new.` : ''}${id}`

      // validarea de required
      if (required || (camp.v && camp.v.indexOf('required') < 0)) camp.v = `required|${camp.v || ''}`

      // valoarea finala
      data[id] = null
      data[id] = value !== null && value !== undefined ? value : _def
    })

    return data
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
      form = require("forms/" + name)
      if (form.default) form = form.default
      // change prototype to object for Vue
      form = JSON.parse(JSON.stringify(form))
      debug(form)
      Object.assign(form, { name })
      debug('✓', name)
    } catch (e) {
      debug('Error', e)
      throw new FormError(Errors.invalidRequested, name)
    }
    return new Form(form, name, form.plural)
  }
}

export {
  Form,
  Errors
}
