import { Schema } from 'lodger/lib/Schema'
import { Plural } from 'lodger/typings/defs'
import { plural } from 'lodger/helpers/functions'
// import { Collection } from 'lodger/typings/lib/Collection'

declare interface Collection {
  new(): Collection
}

const CollectionError = Error

enum Errors {
  noName = 'Collection is missing a (plural) name'
}

type CollectionOptions = {
  name: Plural,
  sync?: boolean
}

class Collection {
  name: Plural
  sync?: boolean = false
  schema: Schema
  constructor (schema: Schema, config?: CollectionOptions) {
    this.schema = schema

    const { name, sync } = config
    if (!name) {
      throw new CollectionError(Errors.noName)
    }
    this.name = name
    if (sync) this.sync = sync
  }
}

export { Collection, Errors }
