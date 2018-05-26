import Db from 'db'
import Debug from 'debug'
import createPersistedState from 'vuex-persistedstate'
import FileSaver from 'file-saver'

import { ldgSchema, notificari, defs } from 'lodger'
import { createModule } from 'vuex-toast'
import { predefinite } from 'forms/serviciu'
import { searchMap } from 'helpers/store'
import { trm, spleet } from 'helpers/functions'
import { sanitizeDBItems } from 'helpers/db'
import { isRxDocument } from 'db'

const debug = Debug('lodger:rxstore')
debug('process', process)
/**
  Subscriberii la actiunile din DB
*/
let subs = {}

// temp docs for db manip
const active = {}

/** Store izemz
*/
const getters = {}
const actions = {
  notificare: ({ dispatch }, notificare) => {
    dispatch('@@toast/ADD_TOAST_MESSAGE', notificare)
  }
}
const mutations = {}
const _state = {}

const updateMutationName = key => `set_${key}`
const globalSubs = Object.keys(ldgSchema).filter(key => key.indexOf('$') === 0)

for (let [k, v] of defs) {
  active[k] = null
}

let asociatieActiva

// normalizarea datelor dupa chei - indecsi
const dbKeys = {
  serviciu: 'denumire'
}

/**
 * Metode share-uite pentru toate colectiile
 */
const metodeComune = {
  defaults: {
    selecteaza: 'selectat',
    set_ultim: 'ultim'
  },
  db: {
    adauga: 'adaugat',
    sterge: 'sters',
    updateaza: 'updatat',
    set_activ: 'activ'
  }
}

let toateMetodele = []
Object.values(metodeComune).forEach(metode => {
  toateMetodele = toateMetodele.concat(Object.keys(metode))
})

debug('toateMetodele', toateMetodele)

/**
 * Normalize DB items (based on defs) and pass them to store
*/
defs.forEach((plural, singular) => {
  const { defaults } = metodeComune
  const mut = numeMetoda => `${singular}/${String(numeMetoda).toUpperCase()}`

  toateMetodele
    .forEach(numeMetoda => {
      const mutatie = mut(numeMetoda)
      const actiune = `${singular}/${numeMetoda}`

      Object.assign(mutations, { [mutatie]: (state, params) => {} })
      Object.assign(actions, { [actiune]: ({ commit }, data) => { commit(mutatie, data) } })
    })

  Object.keys(defaults).forEach(numeMetoda => {
    const stat = `${singular}/${defaults[numeMetoda]}`
    const mutatie = mut(numeMetoda)

    Object.assign(_state, { [stat]: null })

    mutations[mutatie] = (state, id) => {
      state[stat] = id
    }
  })

  Object.assign(_state, {
    [plural]: []
  })

  Object.assign(mutations, {
    [updateMutationName(plural)]: (state, data) => state[plural] = data,
    // [SET_ULTIM]: (state, _id) => { state[`${singular}/ultim`] = _id },
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
  const asociatie = isRxDocument(payload) ? payload : await db.asociatii.findOne().exec()

  if (!asociatie) return
  asociatieActiva = asociatie
  subscribe(ldgSchema.$asociatii)
  debug('schimbat asociatie, activa (rxdoc): ', asociatieActiva)
  return { asociatieActiva }
}

/**
 * Sterge subscriberii de DB cand se demonteaza
 * @param {*} subs - obiectul cu subscriberi
 */
const unsubscribeDBsubscribers = subs => async ({ type }) => {
  if (type !== 'DESTROYMAIN') return
  debug('subscriberii la destrymain', subs)
  // TODO: nu e ok, trebuie luata fiecare cheie si apelat .unsubsribe() si dupa sters
  subs = {}
}

const DBMethods = db => async ({ type, payload }) => {
  if (type.indexOf('/') < 0) return
  const { what, mutation } = spleet(type)
  const col = db[defs.get(what)]
  if (!col || !what) return
  debug('DBMethod:', type, payload)
  debug('-> asociatieActiva', asociatieActiva)

  switch (what) {
    case 'asociatie':
      if (asociatieActiva) {
        if (typeof asociatieActiva[mutation] === 'function') {
          await asociatieActiva[mutation](payload)
          debug(`Executat DB method: asociatieActiva[${mutation}]; Parametri: `, payload)
        }
        if (mutation === 'EXPORT') {
          // TODO: fiecare colectie, nu doar asociatiile
          col.dump().then(json => {
            debug('exportez', json)
            // TODO: nu merge, JSON 2 YML
            const file = new File(JSON.stringify(json), 'export.lodger', { type: "text/json;charset=utf-8" })
            FileSaver.saveAs(file)
          })
        }
      }
      break

    case 'apartament':
      if (mutation === 'incaseaza') {
        const ap = await db.apartamente.findOne({ _id: payload.deLa }).exec()
        ap.incaseaza(payload)
        debug('Incasat si la apartament')
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
  debug(`Urmeaza sa ${add ? 'adauga' : 'sterg'} ${what}`)

  /**
   * ADD
   */
  if (add) {
    const newItem = await col[payload._id ? 'upsert' : 'insert']({ ...payload })
    if (!newItem) throw eroare('ceva a mers prost la adaugarea itemului')
    commit(`${what}/SET_ULTIM`, newItem._id)
    if (what === 'asociatie') dispatch('asociatie/schimba', newItem._id)
    if (what === 'incasare') {
      const incasData = { id: newItem._id, suma: newItem.suma }
      commit('asociatie/incaseaza', incasData)
      commit('apartament/incaseaza', Object.assign(incasData, { deLa: payload.deLa }))
    }
    debug('OK! Adaugat: ', newItem)
    const ss = `${what}.${payload._id ? 'updatat' : 'adaugat'}`
    const heading = `${ss}.h`
    const text = `${ss}.p`
    // selecteaza un item dupa ce a fost adaugat / updatat
    dispatch(`${what}/selecteaza`, payload._id || newItem._id)
    dispatch('notificare', {
      type: 'success',
      text: {
        heading,
        text
      }
    })
  } else {
    /**
    * DELETE
    */
    debug('PL', payload)
    const tobedel = await col.findOne(what === 'serviciu' ? { denumire: payload } : payload).exec()
    debug('de sters:', tobedel)
    if (!tobedel) throw eroare(`${what}.notFoundToBeDeleted`)
    await tobedel.remove()
    if (what === 'asociatie') asociatieActiva = null
    // TODO: notificare succes ca a fost sters
    debug('OK! Sters: ', col)
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
          return { asociatieId: getters['asociatie/activa']._id }

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
          subscribe(o[key])
        }

        subs[o[key]._singular] = db[k].find(findCriteria(k)).$.subscribe(async items => {
          if (!items) return
          if (items.length < -1) {
            if (k === 'servicii') predefinite.forEach(async denumire => { await db[k].insert({ denumire }) })
            return
          }

          commit(`set_${k}`, sanitizeDBItems(items))

          if (!asociatieActiva && k === 'asociatii') {
            const asociatie = items[0]
            if (asociatie) commit('asociatie/SCHIMBA_ACTIVA', asociatie._id)
          }
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
