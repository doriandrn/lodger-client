// import { RxJsonSchema } from 'rxdb'
import { pushFieldToSchema } from 'lodger/helpers/forms'
import { FormData, AllowedSchemaOverwrites } from 'lodger/typings/forms'
import { Form } from 'lodger/lib/Form'

/**
 * Makes a RxSchema from a Lodger Form
 */
export class Schema extends Form {
  title: string
  type: string = 'object'
  version: number = 0
  description?: string
  properties: object = {}
  required: string[] = []

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
  }
}
