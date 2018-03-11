import createPersistedState from 'vuex-persistedstate'
import Db from 'db'
import { defs } from 'db/_defs'

let db
const getters = {}
let asociatii
Db().then(async rxdb => {
  db = rxdb

  db.asociatii.find().$.subscribe(asocs => {
    asociatii = asocs
  })
  // const collectionDoc = await rxdb.collectionsCollection.findOne({ name: 'asociatii' }).exec()
  // await collectionDoc.remove()
})
getters.pula = () => 'mare'
getters.asociatii = () => asociatii

function rxdb () {
  return function (store) {
    store.subscribe(async ({ type, payload }) => {
      const what = type.split('/')[0]
      const col = db[defs[what]]
      
      if (type.indexOf('ADAUGA') > -1) {
        if (payload._id) await col.upsert({ ...payload })
        else await col.insert({ ...payload })
      }
    })
  }
}

// const subs = []
// db.blocuri.find().$.filter(bloc => bloc !== null).subscribe(blocuri => {
//   console.log('bllblblb', blocuri)
// })
export const state = () => ({
})



// const getters = {
//   asociatii: async () => {
//     if (!db) return
//     const data = await db.asociatii.find().$.exec()
//     console.log('da', data)
//     return data
//   },
//   // blocuri: () => {
//   //   db.blocuri.find({ asociatieId: 'buna' })
//   // }
// }

export { getters }

export const plugins = [
  createPersistedState(),
  rxdb()
]
