import { RxJsonSchema, RxCollection } from 'rxdb'
import { FormData } from '../typings/forms'

export class FormError extends Error {
  constructor(m: string) {
    super(m)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, FormError.prototype)
  }
}

enum FormErrors {
  invalidRequested = 'Invalid form requested.',
  noData = 'Form is missing data'
}
type Without<T, K> = {
  [L in Exclude<keyof T, K>]: T[L]
}
type ExcludedOverwrites = 'properties' | 'required' | 'title'
type AllowedSchemaOverwrites = Without<RxJsonSchema, ExcludedOverwrites>

export class Form {
  readonly data?: FormData
  readonly _schema?: RxJsonSchema
  readonly _collection?: RxCollection

  constructor(name: string) {
    try {
      this.data = Object.assign(require(`../forms/${name}`), { name })
    } catch (e) {
      throw new FormError(FormErrors.invalidRequested)
    }

    this._schema = this.toRxSchema()
  }
  private toRxSchema(overwrites?: AllowedSchemaOverwrites): RxJsonSchema {
    const { data } = this
    if (!data) {
      throw new FormError(FormErrors.noData)
    }
    const { name } = data
    const startingSchema: RxJsonSchema = {
      type: 'object',
      version: 0,
      title: name,
      // name,
      // autoMigrate: true,
      properties: {},
      required: []
    }

    const schema = startingSchema

    if (overwrites) {
      Object.assign(schema, overwrites)
    }

    return schema
  }
  toRxCollection(): RxCollection {
    
  }
}
