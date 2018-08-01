import { RxJsonSchema } from 'rxdb'
import { pushFieldToSchema } from 'lodger/helpers/forms'
import { FormData, AllowedSchemaOverwrites } from 'lodger/typings/forms'
import { Form } from 'lodger/lib/Form'

/**
 * 
 */
export class Schema extends Form {
  readonly defaultSchema: RxJsonSchema = {
    type: 'object',
    version: 0,
    properties: {},
    required: []
  }
  readonly schema?: RxJsonSchema

  constructor(data: FormData, overwrites?: AllowedSchemaOverwrites) {
    super(data)
    const { name, fields, defaultSchema } = this
    const schema = { ...defaultSchema }
    Object.assign(schema, { title: name })
    if (overwrites) {
      Object.assign(schema, overwrites)
    }
    fields
      .filter(field => !field.notInDb)
      .forEach(field => {
        pushFieldToSchema(field, schema)
      })
    this.schema = schema
  }
}
