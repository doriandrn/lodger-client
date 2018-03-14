import createPersistedState from 'vuex-persistedstate'
import Db from 'db'
import Debug from 'debug'
import { defs } from 'db/_defs'

const debug = Debug('lodger:rxstore')
// let db
const getters = {
  asociatii: state => Object.values(state.asociatii).map(asoc => asoc.name),
  blocuri: state => state.blocuri,
  apartamente: state => state.apartamente
}

// subscriberi actiuni db
const subs = []

const initAsoc = async (db, store, asociatieId) => {
  const findCriteria = key => {
    if (!asociatieId) return
    switch (key) {
      case 'bloc': return { asociatieId }
      case 'apartament': return { bloc: { $in: store.getters['bloc/ids'] } }
    }
    return
  }

  subs.push(db.blocuri.find(findCriteria('bloc')).$.subscribe(blocuri => {
    store.commit('set_blocuri', Object.freeze(blocuri))

    subs.push(db.apartamente.find(findCriteria('apartament')).$.subscribe(apartamente => {
      store.commit('set_apartamente', Object.freeze(apartamente))
    }))
  }))
}

function rxdb () {
  return async function (store) {
    const db = await Db

    let asociatieId = store.getters['asociatie/activa']
    debug('aId', asociatieId)

    store.subscribe(async ({ type, payload }) => {
      const what = type.split('/')[0]
      if (['set', 'modal'].indexOf(what) > -1) return

      const col = db[defs.get(what)]
      if (!col) return

      // debug('ARGUMENTS', arguments)
      debug('type', type)
      // debug('db', db)
      const mutation = (t => {
        if (t.indexOf(['SCHIMBA_ACTIVA']) > -1) return 'schimba'
        if (t.indexOf('ADAUGA') > -1) return 'adauga'
        if (t.indexOf('STERGE') > -1) return 'sterge'
        return null
      })(type)

      switch (mutation) {
        case 'schimba':
          await initAsoc(db, store, payload)
          debug('Asociatie initializata', payload)
          break

        case 'adauga':
          const action = payload._id ? 'upsert' : 'insert'
          const newItem = await col[action]({ ...payload })
          store.commit(`${what}/set_ultimul_adaugat`, what === 'asociatie' ? newItem.name : newItem._id)
          debug('Adaugat ', newItem)
          break

        case 'sterge':
          const tobedel = await col.findOne({ _id: payload }).exec()
          await tobedel.remove()
          debug('Sters ', col)
          break
      }
    })

    subs.push(db.asociatii.find().$.subscribe(items => {
      asociatieId = store.getters['asociatie/activa']
      console.log('AID', store.getters)
      store.commit(`set_asociatii`, Object.freeze(items))
      if (asociatieId) initAsoc(db, store, asociatieId)
      else if (items.length > 0) store.dispatch('asociatie/schimba', items[0].name)
    }))
  }
}

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

export { getters }

export const plugins = [
  // createPersistedState(),
  rxdb()
]
