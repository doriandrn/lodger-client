import * as RxDB from 'rxdb'
import { remoteURL, dbCon } from '../config'
import collections from './collections'
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

const getdb = async (con) => await RxDB.create(con)
const db = getdb(dbCon)

debug('DatabaseService: created database', db)
/** 
 * Pentru acces usor la DB pe dev, 'db' in consola
*/
if (NODE_ENV === 'dev' && typeof window !== 'undefined') window['db'] = db

export const { isRxDocument } = RxDB

export default async function (dbdata) {
  const rdb = await db

  // show leadership in title
  rdb.waitForLeadership().then(() => {
    debug('♛')
    // document.title = '♛ ' + document.title
  })

  // create collections
  debug('Creez colectiile')
  // console.dir(collections)
  // console.info(rdb)
  // collections.forEach(col => {
  //   const { schema: { properties }, } = col
  //   console.info(properties)
  // })
  try {
    await Promise.all(collections.map(colData => rdb.collection(colData)))
  } catch (e) {
    console.error('eroare la crearea colectiilor', e)
  }

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
}
