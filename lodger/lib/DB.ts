import * as RxDB from 'rxdb'
import Debug from 'debug'
// import memoryAdapter from 'pouchdb-adapter-memory'
// import idbAdapter from 'pouchdb-adapter-idb'

const debug = Debug('lodger:db')
const { NODE_ENV } = process.env
/**
 * DB plugins
 */
if (NODE_ENV === 'test') {
  RxDB.plugin(require('pouchdb-adapter-memory'))
} else {
  RxDB.plugin(require('pouchdb-adapter-idb'))
}

// RxDB.plugin(require('pouchdb-adapter-http'))
// RxDB.plugin(require('pouchdb-authentication'))

// interface DB {
//   readonly db: RxDB.RxDatabase
//   new(): RxDB.RxDatabase
// }

export default async function (
  collections: RxDB.RxCollectionCreator[],
  config?: RxDB.RxDatabaseCreator
) {
  debug('Initing')
  const db = await RxDB.create(Object.assign({}, config))

  // show leadership in title
  db.waitForLeadership().then(() => {
    if (NODE_ENV !== 'dev') return
    document.title = `♛ ${document.title}`
  })
  await Promise.all(collections.map(c => db.collection(c)))

  return db
}
