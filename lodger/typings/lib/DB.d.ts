import { RxDatabase, RxDatabaseCreator } from 'rxdb'
import { Collection } from 'lodger/lib/Collection'

type DBDetails = RxDatabaseCreator

type DBConfig = {
  collections: Collection[],
  details: DBDetails
}

type DBContext = {
  instance: RxDatabase
}

export enum DBErrors {
  noConfig = 'A configuration object must be supplied to create a database',
  useCreate = 'Not initialized. Please use the .create() method instead',
  emptyCollections = 'No collections were found'
}

export interface DB {
  new(): RxDatabase
  create(config: DBConfig): DBContext
}
