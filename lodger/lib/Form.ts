/**
 * Forms for Lodger
 * are quite diferrently structured
 * than a normal JsonSchema
 */
import Debug from 'debug'
import { RxJsonSchema, RxCollectionCreator } from 'rxdb'
import {
  pushFieldToSchema,
  addCommonFieldsToSchema
} from 'lodger/lib/helpers/forms'
import { FormError } from 'lodger/lib/Errors'
import { GetterTree } from 'vuex';

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

    if (name !== 'serviciu') addCommonFieldsToSchema(schema)

    return <RxJsonSchema>schema
  }

  /**
   * Makes a RxCollection valid collection from the form
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
   * @returns {Array} the ids of all fields with index: true
   */
  get indexables () {
    const { fields } = this.data

    return fields
      .filter(field => field.index)
      .map(field => field.id)
  }

  /**
   * gets the sorting options for tax
   * @returns an object with each key used as a sorting option
   */
  get sortOptions () {
    const { indexables, name } = this
    const debug = Debug('lodger:sortOptions')

    if (!['serviciu', 'contor'].indexOf(name)) {
      indexables.push('la')
    }

    // TODO: !!! ia din common methods
    const sorts = {}
    indexables.forEach(indexable => {
      const label = `sort.${indexable === 'name' ? 'az' : indexable}`
      Object.assign(sorts, { [indexable]: { label } })
    })

    debug('sorts 4', name, sorts)

    return sorts
  }

  /**
   * Makes a Vue-ready $data {object} suitable to be completed
   * by the user in the end form
   * as it will turn reactive
   */
  componentData (
    isNewForm: boolean,
    getters?: GetterTree<any, RootState>
  ) {
    const { data: { fields }, name } = this
    const debug = Debug('lodger:Form.ts:componentData')
    let $data = {} as any

    fields.forEach(camp => {
      const {
        label,
        required,
        click,
        notInForm,
        notInDb
      } = camp
      let { id, value } = camp
      debug('CV -> should be func', value)
      let _def = camp.default

      if (click && !id) camp.id = click

      // skip fields
      if (isNewForm) {
        if (!notInForm || notInDb) value = null
      }

      // apply getters to funcs
      if (typeof value === 'function' && getters) {
        try {
          debug('incerc sa pun val')
          value = value(getters)
          debug('am incercat, val: ', value)
        } catch (e) {
          debug('failed to get val', label, getters)
          value = null
        }
      }

      if (typeof _def === 'function') _def = _def(getters)

      // label
      camp.label = label || `${name ? `${name}.new.` : ''}${id}`

      // validarea de required
      if (required || (camp.v && camp.v.indexOf('required') < 0)) camp.v = `required|${camp.v || ''}`

      // valoarea finala
      $data[id] = null
      $data[id] = value !== null && value !== undefined ? value : _def
    })

    return $data
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
      // form = JSON.parse(JSON.stringify(form))
      Object.assign(form, { name })
      debug('✓', name)
    } catch (e) {
      debug('Error', e)
      throw new FormError(Errors.invalidRequested, name)
    }
    return new Form(form, name, form.plural)
  }

  /**
   * Items to be display to user,
   * @returns {Object} the keys of the fields: their position
   *
   */
  get __displayItemKeys () {
    const { fields } = this.data

    return Object.assign({}, ...fields
      .filter(field => field.showInList)
      .map(field => ({ [field.id]: field.showInList }) )
    )
  }
}

export {
  Form,
  Errors
}
