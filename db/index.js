// import 'babel-polyfill'
import * as RxDB from 'rxdb'

RxDB.plugin(require('pouchdb-adapter-idb'))
// RxDB.plugin(require('pouchdb-replication'))
RxDB.plugin(require('pouchdb-adapter-http'))

import collections from './collections'

const syncURL = 'http://lodger.ro:10101/'

export default (async function (dbdata) {
  // console.log('DatabaseService: creating database..')
  const conInfo = {
    name: 'lodger10',
    password: '10dg3rP@55',
    adapter: 'idb'
  }
  if (dbdata) Object.assign(conInfo, dbdata)
  
  const db = await RxDB.create(conInfo)
  console.log('DatabaseService: created database')
  window['db'] = db // write to window for debugging

  // show leadership in title
  db.waitForLeadership().then(() => {
    console.log('isLeader now')
    // document.title = '♛ ' + document.title
  })

  // create collections
  console.log('DatabaseService: create collections')
  await Promise.all(collections.map(colData => db.collection(colData)))

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

  return db
})()
