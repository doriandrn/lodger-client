import { Plural } from 'lodger/typings/defs'
import { Schema } from 'lodger/typings/lib/Schema'

export interface Collection {
  name: Plural
  schema: Schema
  sync?: boolean
  new(): Collection
}
