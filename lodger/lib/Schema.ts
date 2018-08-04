// import { RxJsonSchema } from 'rxdb'
import { pushFieldToSchema } from 'lodger/helpers/forms'
import { FormData, AllowedSchemaOverwrites } from 'lodger/typings/forms'
import { Form } from 'lodger/lib/Form'
import { Schema } from 'lodger/typings/lib/Schema'

export default interface LodgerSchema extends Schema {}

/**
 * Makes a RxSchema from a Lodger Form
 */
export default class LodgerSchema extends Form {
  properties = {}
  required = []
  type = 'object'
  version = 0

  constructor (data: FormData, overwrites?: AllowedSchemaOverwrites) {
    super(data)
    this.title = this.name

    if (overwrites) {
      Object.assign(this, overwrites)
    }
    this.fields
      .filter(field => !field.notInDb)
      .forEach(field => {
        pushFieldToSchema(field, this)
      })
    return this
  }
}
