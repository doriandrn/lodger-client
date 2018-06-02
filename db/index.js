import * as RxDB from 'rxdb'
import { remoteURL } from 'cfg'
import Debug from 'debug'

const debug = Debug('lodger:DB')

RxDB.plugin(require('pouchdb-adapter-idb'))
// RxDB.plugin(require('pouchdb-adapter-memory'))
RxDB.plugin(require('pouchdb-adapter-http'))
RxDB.plugin(require('pouchdb-authentication'))

import collections from './collections'

const conInfo = {
  name: 'lodger32',
  password: '10dg3rP@55',
  adapter: 'idb',
  multiInstance: false
  // adapter: 'memory',
  // ignoreDuplicate: true
}

const getdb = async (con) => await RxDB.create(con)
const db = getdb(conInfo)

debug('DatabaseService: created database', db)
if (typeof window !== 'undefined') window['db'] = db // write to window for debugging

export const { isRxDocument } = RxDB

export default (async function (dbdata) {
  const rdb = await db

  // show leadership in title
  rdb.waitForLeadership().then(() => {
    debug('♛')
    document.title = '♛ ' + document.title
  })

  // create collections
  debug('Creez colectiile')
  await Promise.all(collections.map(colData => rdb.collection(colData)))

  // hooks
  // debug('Adaug Carlige')
  // db.collections.heroes.preInsert(function (docObj) {
  //   const color = docObj.color
  //   return db.collections.heroes.findOne({
  //     color
  //   }).exec().then(has => {
  //     if (has != null) {
  //       alert('another hero already has the color ' + color)
  //       throw new Error('color already there')
  //     }
  //     return db
  //   })
  // })
  // await insertPredefinedDocs(db)

  // TODO: activeaza la loc pt sync, ai server pe 10101 veziin package.json
  // collections
  //   .filter(col => col.sync)
  //   .map(col => col.name)
  //   .map(colName => rdb[colName].sync({
  //     remote: remoteURL + colName + '/'
  //   }))

  return rdb
})()
