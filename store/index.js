import { ldgSchema, notificari, defs } from 'lodger'
import Db from 'db'
import Debug from 'debug'
import createPersistedState from 'vuex-persistedstate'
import { createModule } from 'vuex-toast'
import { predefinite } from 'forms/serviciu'
import { searchMap } from 'helpers/store'
import { trm } from 'helpers/functions'
import { sanitizeDBItems } from 'helpers/db'

const debug = Debug('lodger:rxstore')

/**
  Subscriberii la actiunile din DB
*/
let subs = []

/** Store izemz
*/
const getters = {}
const actions = {}
const mutations = {}
const _state = {}

const updateMutationName = key => `set_${key}`

/**
 * Normalize DB items (based on defs) and pass them to store
*/
defs.forEach(defPlural => {
  getters[defPlural] = state => {
    const obj = {}
    state[defPlural].forEach(item => obj[item._id] = item)
    return obj
  }
  Object.assign(mutations, {
    [updateMutationName(defPlural)]: (state, data) => state[defPlural] = data
  })
  // default state data for all defs
  _state[defPlural] = []
})

console.log('mutations', mutations)

// const dataFlow = (db, store) => {
//   console.log(arguments, this, db, store)
//   const { getters, commit } = store
  
// }

// let asociatieActiva

// const initAsoc = async (db, { commit, getters }, { id, _$ }) => {
//   if (!id) throw eroare('Cerere de initializare asociatie fara id. Nepermis')
  
  

//   // // cleanup subs from prev asoc
//   // subs.forEach((sub, i) => {
//   //   if (i < 2) return // keep asocs & servicii sub
//   //   sub.unsubscribe()
//   // })

//   // subs.push(db.blocuri.find(findCriteria('bloc')).$.subscribe(blocuri => {
//   //   store.commit('set_blocuri', sanitizeDBItems(blocuri))

//   //   subs.push(db.apartamente.find(findCriteria('apartament')).$.subscribe(apartamente => {
//   //     store.commit('set_apartamente', sanitizeDBItems(apartamente))
//   //   }))
//   // }))

//   // subs.push(db.incasari.find(findCriteria('incasare')).sort({la: -1}).limit(25).$.subscribe(incasari => {
//   //   store.commit('set_incasari', sanitizeDBItems(incasari))
//   // }))

//   asociatieActiva = _$ || await db.asociatii.findOne({ name: id }).exec()
  
//   debug('Asociatie initializata, ', id, asociatieActiva)
// }

// de exportat 
const unsubscribeDBsubscribers = subs => async ({ type }) => {
  if (type !== 'DESTROYMAIN') return
  subs.forEach(sub => sub.unsubscribe())
}

const schimbaAsociatie = (db, store, id) => async ({ type }) => {
  if (!type.indexOf('SCHIMBA_ACTIVA')) return
}

const addDelete = (db, { commit, getters }, defs) => async ({ type, payload }) => {
  if (!['ADAUGA', 'STERGE'].indexOf(type)) return
  const what = type.split('/')[0] // added item type
  const col = db[defs.get(what)] // collection
  if (!col || !what) return
  
  // add = true, delete = false
  const addOrDelete = type.indexOf('ADAUGA') > -1

  /**
   * ADD
   */
  const newItem = await col[payload._id ? 'upsert' : 'insert']({ ...payload })
  if (!newItem) throw eroare('ceva a mers prost la adaugarea itemului')
  commit(`${what}/set_ultimul_adaugat`, newItem._id)
  
  await handleFollowingMutations(what, payload, newItem, store)
  
  if (what === 'incasare') {
    const incasData = { id: newItem._id, suma: newItem.suma }
    commit('asociatie/incaseaza', incasData)
    commit('apartament/incaseaza', Object.assign(incasData, { deLa: payload.deLa }))
  }
  // if (what === 'asociatie') store.dispatch('asociatie/schimba', newItem.name)
  if (what === 'asociatie') asocAdaugatTFlag = newItem.name
  debug('Adaugat ', what, newItem)
  return
}

function rxdb () {
  return async function (store) {
    const db = await Db
    Object.keys(notificari).forEach(type => notificari[type].bind(store))
    const findCriteria = key => {
      const { getters } = store
      switch (key) {
        case 'blocuri':
        case 'incasari':
        case 'cheltuieli':
          return { asociatieId: getters['asociatie/activa'].id }

        case 'apartament':
          return { bloc: { $in: getters['bloc/ids'] } }
      }
      // servicii,furnizori, asociatii sunt globale, n-au nevoie de criteriu de cautare
      return
    }

    // inscrie recursiv to
    const subscribe = o => {
      const keys = Object.keys(o).filter(k => k.indexOf('$') === 0)
      if (!keys.length) return
      keys.forEach(key => {
        const k = trm(key)
        if (!db[k]) return
        subs.push(db[k].find(findCriteria(k)).$.subscribe(items => {
          store.commit(`set_${k}`, sanitizeDBItems(items))
          // mutations[updateMutationName(k)](sanitizeDBItems(items))
          subscribe(o[key])
        }))
      })
    }
    subscribe(ldgSchema)

    // let asociatieId = store.getters['asociatie/activa']
    // let asocAdaugatTFlag = false

    // if (asociatieId) await initAsoc(db, store, { id: asociatieId })

    // store.subscribe(dataFlow(db, store))
    store.subscribe(unsubscribeDBsubscribers(subs))
    // store.subscribe(schimbaAsociatie)
    
    // store.subscribe(adaugaChestii)
    // store.subscribe(stergeChestii)
    // store.subscribe(DBMethods)


    // store.subscribe(async ({ type, payload }) => {

      // const mutation = (t => {
      //   if (t.indexOf(['SCHIMBA_ACTIVA']) > -1) return 'schimba'
      //   if (t.indexOf('ADAUGA') > -1) return 'adauga'
      //   if (t.indexOf('STERGE') > -1) return 'sterge'
      //   return type.split('/')[1]
      // })(type)

      // global mutations, applied to all collections
    //   switch (mutation) {
    //     case 'schimba':
    //       await initAsoc(db, store, payload)
    //       debug('Asociatie initializata', payload, asociatieActiva)
    //       return

    //     case 'adauga':
    //       const action = payload._id ? 'upsert' : 'insert'
    //       const newItem = await col[action]({ ...payload })
    //       if (what) store.commit(`${what}/set_ultimul_adaugat`, what === 'asociatie' ? newItem.name : newItem._id)
    //       if (what === 'incasare') {
    //         const incasData = { id: newItem._id, suma: newItem.suma }
    //         store.commit('asociatie/incaseaza', incasData)
    //         store.commit('apartament/incaseaza', Object.assign(incasData, { deLa: payload.deLa }))
    //       }
    //       // if (what === 'asociatie') store.dispatch('asociatie/schimba', newItem.name)
    //       if (what === 'asociatie') asocAdaugatTFlag = newItem.name
    //       debug('Adaugat ', what, newItem)
    //       return

    //     case 'sterge':
    //       const tobedel = await col.findOne(what === 'serviciu' ? { denumire: payload } : { _id: payload }).exec()
    //       if (what === 'asociatie') {
    //         const { asociatii } = store.getters
    //         asocAdaugatTFlag = asociatii.length > 1 ? asociatii.splice(asociatii.indexOf( payload.id ), 1)[0] : null
    //         debug('LALLALALALLA', asocAdaugatTFlag)
    //       }
    //       if (!tobedel) throw eroare(`${what}.notFoundToBeDeleted`)
            
    //         return
    //       }
    //       await tobedel.remove()
    //       debug('Sters ', col)
    //       return
    //   }

    //   // if none of above happened, run custom ones
    //   switch (what) {
    //     case 'asociatie':
    //       if (asociatieActiva && typeof asociatieActiva[mutation] === 'function') {
    //         await asociatieActiva[mutation](payload)
    //         debug('DUN')
    //       }
    //       break

    //     case 'apartament':
    //       if (mutation === 'incaseaza') {
    //         const ap = await db.apartamente.findOne({ _id: payload.deLa }).exec()
    //         ap.incaseaza(payload)
    //       }
    //       break
    //   }
    // })

    // subs.push(db.asociatii.find().$.subscribe(async items => {
    //   store.commit(`set_asociatii`, sanitizeDBItems(items))
    //   if (!asociatieId) {
    //     const asoc0 = items[0]
    //     asociatieId = asoc0 && asoc0.name ? asoc0.name : null
    //     debug('XXXXX', asociatieId)
    //     if (asociatieId) store.dispatch('asociatie/schimba', { id: asociatieId, '_$': asoc0  })
    //   }
    //   if (asocAdaugatTFlag) {
    //     store.dispatch('asociatie/schimba', { id: asocAdaugatTFlag })
    //     asocAdaugatTFlag = false
    //   }
    // }))

    // subs.push(db.servicii.find().$.subscribe(async servicii => {
    //   if (!servicii.length) {
    //     predefinite.forEach(async denumire => { await db.servicii.insert({ denumire }) })
    //   }
    //   store.commit('set_servicii', sanitizeDBItems(servicii))
    // }))
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
