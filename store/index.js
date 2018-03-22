import createPersistedState from 'vuex-persistedstate'
import Db from 'db'
import Debug from 'debug'
import { defs } from 'db/_defs'
import { createModule } from 'vuex-toast'
import { predefinite } from 'forms/serviciu'

const debug = Debug('lodger:rxstore')
const toast = '@@toast/ADD_TOAST_MESSAGE'

const getters = {
  asociatii: state => Object.values(state.asociatii).map(asoc => asoc.name),
  blocuri: state => state.blocuri,
  apartamente: state => { 
    const aps = {}
    state.apartamente.forEach(ap => aps[ap._id] = ap)
    return aps
  },
  incasari: state => state.incasari,
  servicii: state => state.servicii,
  searchMap: (state, getters) => {
    const apartamente = new Map()
    Object.values(getters['apartamente']).forEach(ap => {
      apartamente.set(ap._id, `${ getters['bloc/data'](ap.bloc).nume } ${ ap.scara } ${ ap.nr } ${ ap.proprietar }`)
    })
    return { apartamente }
  }
}

// subscriberi actiuni db
let subs = []
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
    if (i < 2) return // keep asocs & servicii sub
    debug('SUBSCRIBER TO UNSUB: ', sub, i)
    sub.unsubscribe()
  })

  subs.push(db.blocuri.find(findCriteria('bloc')).$.subscribe(blocuri => {
    store.commit('set_blocuri', sanitizeDBItems(blocuri))

    subs.push(db.apartamente.find(findCriteria('apartament')).$.subscribe(apartamente => {
      store.commit('set_apartamente', sanitizeDBItems(apartamente))
    }))
  }))

  subs.push(db.incasari.find(findCriteria('incasare')).sort({la: -1}).limit(25).$.subscribe(incasari => {
    store.commit('set_incasari', sanitizeDBItems(incasari))
  }))

  asociatieActiva = _$ || await db.asociatii.findOne({ name: id }).exec()
  debug('initAsoc', id, asociatieActiva)
}

function rxdb () {
  return async function (store) {
    const db = await Db

    let asociatieId = store.getters['asociatie/activa']
    let asocAdaugatTFlag = false

    if (asociatieId) await initAsoc(db, store, { id: asociatieId })

    store.subscribe(async ({ type, payload }) => {
      debug('type', type)
      const what = type.split('/')[0]
      if (['set', 'modal'].indexOf(what) > -1) return

      const col = db[defs.get(what)]
      if (!col) return

      if (type === 'DESTROYMAIN') {
        subs.forEach(sub => sub.unsubscribe())
        return
      }

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
          if (what) store.commit(`${what}/set_ultimul_adaugat`, what === 'asociatie' ? newItem.name : newItem._id)
          if (what === 'incasare') {
            const incasData = { id: newItem._id, suma: newItem.suma }
            store.commit('asociatie/incaseaza', incasData)
            store.commit('apartament/incaseaza', Object.assign(incasData, { deLa: payload.deLa }))
          }
          // if (what === 'asociatie') store.dispatch('asociatie/schimba', newItem.name)
          if (what === 'asociatie') asocAdaugatTFlag = newItem.name
          debug('Adaugat ', what, newItem)
          return

        case 'sterge':
          const tobedel = await col.findOne(what === 'serviciu' ? { denumire: payload } : { _id: payload }).exec()
          if (what === 'asociatie') {
            const { asociatii } = store.getters
            asocAdaugatTFlag = asociatii.length > 1 ? asociatii.splice(asociatii.indexOf( payload.id ), 1)[0] : null
            debug('LALLALALALLA', asocAdaugatTFlag)
          }
          if (!tobedel) {
            store.dispatch(toast, {
              type: 'error',
              text: `${what}.notFoundToBeDeleted`
            })
            return
          }
          await tobedel.remove()
          debug('Sters ', col)
          return
      }

      // if none of above happened, run custom ones
      switch (what) {
        case 'asociatie':
          if (asociatieActiva && typeof asociatieActiva[mutation] === 'function') {
            await asociatieActiva[mutation](payload)
            debug('DUN')
          }
          break

        case 'apartament':
          if (mutation === 'incaseaza') {
            const ap = await db.apartamente.findOne({ _id: payload.deLa }).exec()
            ap.incaseaza(payload)
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
      if (asocAdaugatTFlag) {
        store.dispatch('asociatie/schimba', { id: asocAdaugatTFlag })
        asocAdaugatTFlag = false
      }
    }))

    subs.push(db.servicii.find().$.subscribe(async servicii => {
      if (!servicii.length) {
        predefinite.forEach(async serviciu => {
          await db.servicii.insert({ denumire: serviciu })
        })
      }
      store.commit('set_servicii', sanitizeDBItems(servicii))
    }))
  }
}

export const state = () => ({
  locale: 'ro',
  asociatii: [],
  blocuri: [],
  apartamente: [],
  incasari: [],
  servicii: [],
  furnizori: []
})

export const mutations = {
  set_asociatii: (state, data) => { state.asociatii = data },
  set_blocuri: (state, data) => { state.blocuri = data },
  set_apartamente: (state, data) => { state.apartamente = data },
  set_incasari: (state, data) => { state.incasari = data },
  set_servicii: (state, data) => { state.servicii = data },
  DESTROYMAIN: (state, data) => {}
}

export { getters }

export const plugins = [
  // createPersistedState(),
  rxdb()
]

export const modules = {
  toast: createModule({
    dismissInterval: 8000
  })
}
