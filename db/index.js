// import 'babel-polyfill'
import * as RxDB from 'rxdb'

RxDB.plugin(require('pouchdb-adapter-idb'))
// RxDB.plugin(require('pouchdb-adapter-memory'))
// RxDB.plugin(require('pouchdb-replication'))
// RxDB.plugin(require('pouchdb-adapter-http'))

import collections from './collections'

const syncURL = 'http://lodger.ro:10101/'

const conInfo = {
  name: 'lodger23',
  password: '10dg3rP@55',
  // adapter: 'memory',
  adapter: 'idb',
  // ignoreDuplicate: true
}

const getdb = async (con) => await RxDB.create(con)
const db = getdb(conInfo)

console.log('DatabaseService: created database', db)
if (typeof window !== 'undefined') window['db'] = db // write to window for debugging



export const { isRxDocument } = RxDB

export default (async function (dbdata) {
  const rdb = await db
  // show leadership in title
  rdb.waitForLeadership().then(() => {
    console.log('isLeader now')
    // document.title = '♛ ' + document.title
  })
  // console.log('DatabaseService: creating database..')
  

  // create collections
  console.log('DatabaseService: create collections')
  await Promise.all(collections.map(colData => rdb.collection(colData)))

  // hooks
  console.log('DatabaseService: add hooks')
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

  // collections.filter(col => col.sync).map(col => col.name).map(colName => db[colName].sync(syncURL + colName + '/'))

  // await insertPredefinedDocs(db)

  return rdb
})()
