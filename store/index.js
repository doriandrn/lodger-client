import createPersistedState from 'vuex-persistedstate'
import Db from 'db'
import { defs } from 'db/_defs'
let blocuri = []
// let db
const getters = {
  asociatii: state => Object.values(state.asociatii).map(asoc => asoc.name),
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
    const asociatieId = store.getters['asociatie/activa']
    console.log(asociatieId)
    Object.keys(defs).forEach(def => {
      subs.push(db[defs[def]].find(def === 'asociatie' ? null : { asociatieId }).$.subscribe(items => {
        store.commit(`get_${defs[def]}`, Object.freeze(items))
      }))
    })
    
    // subs.push(db.asociatii.find().$.subscribe(asocs => {
    //   store.commit('DB_INITED', asocs.map(asoc => asoc.name))
    //   // store.getters.db = function () { return {...store.getters.db, asociatii: asocs } }
    // }))
    // store.getters.asociatii = state => asociatii
    
    // store.$db = () => subs
    
    console.log('store', store)
    
    store.subscribe(async ({ type, payload }) => {
      const what = type.split('/')[0]
      const col = db[defs[what]]

      if (type.indexOf(['SCHIMBA_ACTIVA']) > -1) {
        subs.push(db.blocuri.find({ asociatieId: payload }).$.subscribe(blocs => {
          store.commit('get_blocuri', Object.freeze(blocs))
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
  get_asociatii: (state, data) => {
    state.asociatii = data
  },
  get_blocuri: (state, blocs) => {
    state.blocuri = blocs
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
