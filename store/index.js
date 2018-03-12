import createPersistedState from 'vuex-persistedstate'
import Db from 'db'
import { defs } from 'db/_defs'
let blocuri = []
// let db
const getters = {
  asociatii: state => state.asociatii,
  blocuri: state => state.blocuri
}
// let asociatii
// Db().then(async rxdb => {
//   db = rxdb
//   db.asociatii.find().$.subscribe(asocs => {
//     asociatii = asocs
//   })
//   // const collectionDoc = await rxdb.collectionsCollection.findOne({ name: 'asociatii' }).exec()
//   // await collectionDoc.remove()
// })


function rxdb () {
  return async function (store) {
    const subs = []
    store.getters.db = () => {}
    const db = await Db
    
    subs.push(db.asociatii.find().$.subscribe(asocs => {
      store.commit('DB_INITED', asocs.map(asoc => asoc.name))
      // store.getters.db = function () { return {...store.getters.db, asociatii: asocs } }
    }))
    // store.getters.asociatii = state => asociatii
    
    // store.$db = () => subs
    
    console.log('store', store)
    
    store.subscribe(async ({ type, payload }) => {
      const what = type.split('/')[0]
      const col = db[defs[what]]

      if (type.indexOf(['SCHIMBA_ACTIVA']) > -1) {
        subs.push(db.blocuri.find({ asociatieId: payload }).$.subscribe(blocs => {
          store.commit('GOTNEWBLOCS', Object.freeze(blocs))
          // store.getters.db = { ...store.getters.db, blocuri: blocs }
          // store.getters.db = function () { return { ...store.getters.db, blocuri: blocs } }
        }))
      }
      
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
  blocuri: []
})

export const mutations = {
  DB_INITED: (state, data) => {
    state.asociatii = data
    console.log('data', data)
  },
  GOTNEWBLOCS: (state, blocs) => {
    console.log('GNB', blocs)
    state.blocuri = blocs
    // state.blocuri = { ...state.blocuri, blocs }
  }
}


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
