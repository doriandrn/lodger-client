import Db from 'db'
import Debug from 'debug'
import createPersistedState from 'vuex-persistedstate'

import { ldgSchema, notificari, defs } from 'lodger'
import { createModule } from 'vuex-toast'
import { predefinite } from 'forms/serviciu'
import { searchMap } from 'helpers/store'
import { trm, traverse, spleet } from 'helpers/functions'
import { sanitizeDBItems } from 'helpers/db'
import { isRxDocument } from 'db'

const debug = Debug('lodger:rxstore')

/**
  Subscriberii la actiunile din DB
*/
let subs = {}

// temp docs for db manip
const active = {}

/** Store izemz
*/
const getters = {}
const actions = {}
const mutations = {}
const _state = {}

const updateMutationName = key => `set_${key}`
const globalSubs = Object.keys(ldgSchema).filter(key => key.indexOf('$') === 0)

for (let [k, v] of defs) {
  active[k] = null
}

let asociatieActiva

const dbKeys = {
  asociatie: 'name',
  serviciu: 'denumire'
}

/**
 * Normalize DB items (based on defs) and pass them to store
*/
defs.forEach((plural, singular) => {
  const ADAUGA = `${singular}/ADAUGA`
  const STERGE = `${singular}/STERGE`
  const SET_ULTIM = `${singular}/SET_ULTIM`
  const SET_ACTIV = `${singular}/SET_ACTIV`
  const UNSET_ACTIV = `${singular}/UNSET_ACTIV`

  Object.assign(_state, {
    [`${singular}/ultim`]: null,
    [plural]: []
  })
  Object.assign(mutations, {
    [updateMutationName(plural)]: (state, data) => state[plural] = data,
    [ADAUGA]: (state, data) => {},
    [STERGE]: (state, _id) => {},
    [SET_ULTIM]: (state, _id) => { state[`${singular}/ultim`] = _id },
    [SET_ACTIV]: (state, _id) => {},
  })
  Object.assign(actions, {
    [`${singular}/adauga`]: ({ commit }, data) => { commit(ADAUGA, data) },
    [`${singular}/sterge`]: ({ commit }, _id) => { commit(STERGE, _id) },
    [`${singular}/set_activ`]: ({ commit }, _id) => { commit(SET_ACTIV, _id) },
    [`${singular}/unset_activ`]: ({ commit }, _id) => { commit(UNSET_ACTIV, _id) }
    // [`${singular}/set_ultimul_adaugat`]: ({ commit }, _id) => { commit(SET_ULTIM, _id) }
  })
  Object.assign(getters, {
    [`${singular}/ultim`]: state => state[`${singular}/ultim`],
    [plural]: state => {
      const o = {}
      Object.values(state[plural]).forEach(i => o[i[dbKeys[singular] || '_id']] = i)
      return o
    },
    [`${singular}/ids`]: (state, getters) => Object.keys(getters[plural])
  })
})

Object.assign(getters, {
  searchMap
})

Object.assign(_state, { active })


// de exportat 
const schimbaAsociatie = (subs, subscribe, db) => async ({ type, payload }) => {
  if (type.indexOf('SCHIMBA_ACTIVA') < 0) return
  asociatieActiva = isRxDocument(payload) ? payload : await db.asociatii.findOne({ name: payload.name }).exec()
  // debug('defSubs', defSubscriptions)
  
  // subs.forEach((sub, i) => { if (i < defSubscriptions.length) return
  //   sub.unsubscribe()
  // })
  subscribe(ldgSchema.$asociatii)
  debug('subscribers', subs)
  return { asociatieActiva }
}

const unsubscribeDBsubscribers = subs => async ({ type }) => {
  if (type !== 'DESTROYMAIN') return
  subs.forEach(sub => sub.unsubscribe())
}

const DBMethods = db => async ({ type, payload }) => {
  if (type.indexOf('/') < 0) return
  const { what, mutation } = spleet(type)
  const col = db[defs.get(what)] // collection
  if (!col || !what) return
  debug('DBMethod:', type, payload)

  switch (what) {
    case 'asociatie':
      debug('DBM:asociatieActiva', asociatieActiva)
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
}

const addDelete = (db, { commit, dispatch, getters }) => async ({ type, payload }) => {
  if (type.indexOf('/') < 0) return
  if (['ADAUGA', 'STERGE'].indexOf(String(type).split('/')[1]) < 0) return

  const what = String(type).split('/')[0] // added item type
  const col = db[defs.get(what)] // collection
  if (!col || !what) return
  
  // add = true, delete = false
  const add = type.indexOf('ADAUGA') > -1
  // debug('addOrDelete:add', add)

  /**
   * ADD
   */
  if (add) {
    const newItem = await col[payload._id ? 'upsert' : 'insert']({ ...payload })
    if (!newItem) throw eroare('ceva a mers prost la adaugarea itemului')
    commit(`${what}/SET_ULTIM`, newItem._id)
    if (what === 'asociatie') dispatch('asociatie/schimba', newItem)
    if (what === 'incasare') {
      const incasData = { id: newItem._id, suma: newItem.suma }
      commit('asociatie/incaseaza', incasData)
      commit('apartament/incaseaza', Object.assign(incasData, { deLa: payload.deLa }))
    }
    debug('Adaugat: ', newItem)
    notificari.success('Adaugat!', 'added')
  } else {
  /**
   * DELETE
   */
    const tobedel = await col.findOne(what === 'serviciu' ? { denumire: payload } : { _id: payload }).exec()
    if (!tobedel) throw eroare(`${what}.notFoundToBeDeleted`)
    await tobedel.remove()
    if (what === 'asociatie') asociatieActiva = null
    notificari.success('Dun')
    debug('Sters ', col)
  }
  // await handleFollowingMutations(what, payload, newItem, store, add)

}

function rxdb () {
  return async function (store) {
    const db = await Db
    const { commit, getters, dispatch } = store
    const findCriteria = key => {
      // if (['blocuri', 'incasari', 'cheltuieli'].indexOf)
      switch (key) {
        case 'blocuri':
        case 'incasari':
        case 'cheltuieli':
          return { asociatieId: getters['asociatie/activa'] }

        case 'apartament':
          return { bloc: { $in: getters['bloc/ids'] } }
      }
      // servicii,furnizori, asociatii sunt globale, n-au nevoie de criteriu de cautare
      return
    }

    // let subscribers = []
    const subscribedTo = item => Object.keys(subs).indexOf(item._singular) > -1

    // inscrie recursiv to
    const subscribe = (o) => {
      const keys = Object.keys(o).filter(k => k.indexOf('$') === 0)
      if (!keys.length) return
      keys.forEach(key => {
        const k = trm(key)
        if (!db[k]) return

        if (k !== 'asociatii' && !subscribedTo(o[key])) {
          // subscribers.push(o[key]._singular)
          // debug('inscriu', o[key])
          subscribe(o[key])
        }

        subs[o[key]._singular] = db[k].find(findCriteria(k)).$.subscribe(items => {
          if (!items) return
          if (!items.length) {
            if (k === 'servicii') predefinite.forEach(async denumire => { await db[k].insert({ denumire }) })
          }

          if (!asociatieActiva) {
            // subscribers = []
            dispatch('asociatie/schimba', items[0])
          }
          // if (pre) pre(k, items)
          // debug('XXSUBS', subs)
          store.commit(`set_${k}`, sanitizeDBItems(items))
        })
      })
    }
    
    Object.keys(notificari).forEach(type => notificari[type] = notificari[type]({ dispatch }))
    subscribe(ldgSchema)

    store.subscribe(unsubscribeDBsubscribers(subs))
    store.subscribe(addDelete(db, { commit, getters, dispatch } ))
    store.subscribe(schimbaAsociatie(subs, subscribe, db))
    store.subscribe(DBMethods(db))
  }
}


Object.assign(mutations, {
  DESTROYMAIN: (state, data) => {}
})

const plugins = [
  // createPersistedState(),
  rxdb()
]

const modules = {
  toast: createModule({ dismissInterval: 5000 })
}

export const state = () => ( Object.assign(_state, { locale: 'ro' }) )
export { getters, mutations, actions, plugins, modules }
