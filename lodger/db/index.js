import * as RxDB from 'rxdb'
import Debug from 'debug'

const debug = Debug('lodger:DB')
const { NODE_ENV } = process.env

if (NODE_ENV === 'test') {
  RxDB.plugin(require('pouchdb-adapter-memory'))
} else {
  RxDB.plugin(require('pouchdb-adapter-idb'))
}

RxDB.plugin(require('pouchdb-adapter-http'))
RxDB.plugin(require('pouchdb-authentication'))

export const { isRxDocument } = RxDB

export default async function (dbConfig, collections) {
  const defaultConfig = {
    name: 'ldg',
    adapter: 'memory'
  }
  Object.assign(defaultConfig, dbConfig)
  const rdb = await RxDB.create(defaultConfig)
  debug('DatabaseService: created database', rdb)

  // show leadership in title
  rdb.waitForLeadership().then(() => {
    debug('♛')
    if (NODE_ENV === 'dev') {
      document.title = '♛ ' + document.title
    }
  })

  /** 
  * Pentru acces usor la DB pe dev, 'db' in consola
  */
  if (NODE_ENV === 'dev' && typeof window !== 'undefined') window['db'] = rdb

  if (!collections ||
    (collections instanceof Array && collections.length < 0))
      return rdb

  try {
    debug('Creez colectiile')
    await Promise.all(collections.map(colData => rdb.collection(colData)))
  } catch (e) {
    console.error('eroare la crearea colectiilor', e)
  }

  return rdb
}
