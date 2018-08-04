import { RxJsonSchema, RxSchema, RxJsonSchemaTopLevel } from 'rxdb'

export declare interface Schema extends RxSchema {
  title: string
  description?: string
  properties: object
  required: string[]
  type: string
  version: number
  new(): RxJsonSchemaTopLevel
}
