
import Debug from 'debug'
import createPersistedState from 'vuex-persistedstate'
import FileSaver from 'file-saver'

import { createModule } from 'vuex-toast'
// import { definitii } from 'lodger/definitii'
import { predefinite } from 'forms/serviciu'
import { searchMap } from '../lodger/plugins/search/index'
import { trm, spleet } from 'helpers/functions'
// import { sanitizeDBItems } from 'helpers/db'
import { isRxDocument } from 'rxdb'

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

// for (let [k, v] of defs) {
//   active[k] = null
// }

let asociatieActiva

// normalizarea datelor dupa chei - indecsi, daca e altceva decat '_id'
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
Object.keys(Taxonomii).forEach((plural, singular) => {
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
  searchMap,
  locale: state => state.locale,
  limbiChoose: () => ['ro', 'en']
})

Object.assign(_state, { active })

Object.assign(mutations, {
  DESTROYMAIN: (state, data) => {}
})

const plugins = [
  // createPersistedState(),
  // rxdb()
]

const modules = {
  toast: createModule({ dismissInterval: 5000 })
}

const state = () => ( Object.assign(_state, { locale: 'ro' }) )
export {
  state,
  getters,
  mutations,
  actions,
  plugins,
  modules
}
