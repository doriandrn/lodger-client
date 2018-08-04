import Schema from './Schema'
import { plural } from 'lodger/helpers/functions'
import { FormData } from 'lodger/typings/forms'
import { Collection } from 'lodger/typings/lib/Collection'

export interface LodgerCollection extends Collection {}

export class LodgerCollection {
  constructor (data: FormData, sync?: boolean | undefined) {
    const { title } = this.schema = new Schema(data)
    this.name = plural(title)
    this.sync = sync
  }
}
