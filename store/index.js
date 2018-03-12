import createPersistedState from 'vuex-persistedstate'
import Db from 'db'
import { defs } from 'db/_defs'

// let db
const getters = {
  asociatii: state => Object.values(state.asociatii).map(asoc => asoc.name),
  blocuri: state => state.blocuri,
  apartamente: state => state.apartamente
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


// subscriberi actiuni db
const subs = []
const initAsoc = (db, store, asociatieId) => {
  let findCriteria = null

  Object.keys(defs).forEach(def => {
    if (asociatieId) {
      switch (def) {
        case 'bloc':
          findCriteria = { asociatieId }
          break

        case 'apartament':
          findCriteria = { bloc: { $in: store.getters['bloc/ids'] } }
          break
      }
    }

    const col = db[defs[def]]

    if (!col) return

    subs.push(col.find(findCriteria).$.subscribe(items => {
      store.commit(`set_${defs[def]}`, Object.freeze(items))
    }))
  })
}

function rxdb () {
  return async function (store) {
    const subs = []
    const db = await Db

    const asociatieId = store.getters['asociatie/activa']
    console.log('asociatieId', asociatieId)
    if (asociatieId) {
      initAsoc(db, store, asociatieId)
    } else  {
      const oneAsoc = await db.asociatii.findOne().exec()
      if (oneAsoc && oneAsoc.name) {
        store.dispatch('asociatie/schimba', oneAsoc.name)
      }
    }
    
    
    
    store.subscribe(async ({ type, payload }) => {
      const what = type.split('/')[0]
      const col = db[defs[what]]

      if (type.indexOf(['SCHIMBA_ACTIVA']) > -1) {
        initAsoc(db, store, payload)
      }
      
      if (type.indexOf('ADAUGA') > -1) {
        if (payload._id) await col.upsert({ ...payload })
        else await col.insert({ ...payload })
      }

      if (type.indexOf('STERGE') > -1) {
        const tobedel = await col.findOne({ _id: payload }).exec()
        await tobedel.remove()
      }
    })
  }
}

// const subs = []
// db.blocuri.find().$.filter(bloc => bloc !== null).subscribe(blocuri => {
//   console.log('bllblblb', blocuri)
// })
export const state = () => ({
  asociatii: [],
  blocuri: [],
  apartamente: []
})

export const mutations = {
  set_asociatii: (state, data) => {
    state.asociatii = data
  },
  set_blocuri: (state, blocs) => {
    state.blocuri = blocs
  },
  set_apartamente: (state, aps) => {
    state.apartamente = aps
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
  // createPersistedState(),
  rxdb()
]
