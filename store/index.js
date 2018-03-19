import createPersistedState from 'vuex-persistedstate'
import Db from 'db'
import Debug from 'debug'
import { defs } from 'db/_defs'

const debug = Debug('lodger:rxstore')

const getters = {
  asociatii: state => Object.values(state.asociatii).map(asoc => asoc.name),
  blocuri: state => state.blocuri,
  apartamente: state => { 
    const aps = {}
    state.apartamente.forEach(ap => aps[ap._id] = ap)
    return aps
  },
  incasari: state => state.incasari,
  searchMap: (state, getters) => {
    const apartamente = new Map()
    Object.values(getters['apartamente']).forEach(ap => {
      apartamente.set(ap._id, `${ getters['bloc/data'](ap.bloc).nume } ${ ap.scara } ${ ap.nr } ${ ap.proprietar }`)
    })
    return { apartamente }
  }
}

// subscriberi actiuni db
const subs = []
let asociatieActiva
const sanitizeDBItems = items => Object.freeze(items.map(item => item._data))

const initAsoc = async (db, store, { id, _$ }) => {
  if (!id) {
    console.error('initasoc fara id')
    return
  }
  const findCriteria = key => {
    if (!id) return
    switch (key) {
      case 'bloc': case 'incasare': return { asociatieId: id }
      case 'apartament': return { bloc: { $in: store.getters['bloc/ids'] } }
      case 'incasare': return { asociatieId: id }
    }
    return
  }

  // cleanup subs from prev asoc
  subs.forEach((sub, i) => {
    if (i === 0) return // keep asocs sub
    debug('SUBSCRIBER TO UNSUB: ', sub, i)
    sub.unsubscribe()
  })

  subs.push(db.blocuri.find(findCriteria('bloc')).$.subscribe(blocuri => {
    store.commit('set_blocuri', sanitizeDBItems(blocuri))

    subs.push(db.apartamente.find(findCriteria('apartament')).$.subscribe(apartamente => {
      store.commit('set_apartamente', sanitizeDBItems(apartamente))
    }))
  }))

  subs.push(db.incasari.find(findCriteria('incasare')).$.subscribe(incasari => {
    store.commit('set_incasari', sanitizeDBItems(incasari))
  }))

  asociatieActiva = _$ || await db.asociatii.findOne({ name: id }).exec()
  debug('initAsoc', id, asociatieActiva)
}

function rxdb () {
  return async function (store) {
    const db = await Db

    let asociatieId = store.getters['asociatie/activa']
    if (asociatieId) await initAsoc(db, store, { id: asociatieId })

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
        return type.split('/')[1]
      })(type)

      // global mutations, applied to all collections
      switch (mutation) {
        case 'schimba':
          await initAsoc(db, store, payload)
          debug('Asociatie initializata', payload, asociatieActiva)
          return

        case 'adauga':
          const action = payload._id ? 'upsert' : 'insert'
          const newItem = await col[action]({ ...payload })
          store.commit(`${what}/set_ultimul_adaugat`, what === 'asociatie' ? newItem.name : newItem._id)
          debug('Adaugat ', newItem)
          return

        case 'sterge':
          const tobedel = await col.findOne({ _id: payload }).exec()
          await tobedel.remove()
          debug('Sters ', col)
          return
      }

      // if none of above happened, run custom ones
      switch (what) {
        case 'asociatie':
          if (typeof asociatieActiva[mutation] === 'function') {
            await asociatieActiva[mutation](payload)
            debug('DUN')
          }
          break
      }
    })

    subs.push(db.asociatii.find().$.subscribe(async items => {
      store.commit(`set_asociatii`, sanitizeDBItems(items))
      if (!asociatieId) {
        const asoc0 = items[0]
        asociatieId = asoc0 && asoc0.name ? asoc0.name : null
        debug('XXXXX', asociatieId)
        if (asociatieId) store.dispatch('asociatie/schimba', { id: asociatieId, '_$': asoc0  })
      }
    }))
  }
}

export const state = () => ({
  asociatii: [],
  blocuri: [],
  apartamente: [],
  incasari: []
})

export const mutations = {
  set_asociatii: (state, data) => {
    state.asociatii = data
  },
  set_blocuri: (state, data) => {
    state.blocuri = data
  },
  set_apartamente: (state, data) => {
    state.apartamente = data
  },
  set_incasari: (state, data) => {
    state.incasari = data
  }
}

export { getters }

export const plugins = [
  // createPersistedState(),
  rxdb()
]
