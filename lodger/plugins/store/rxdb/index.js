import Db from '../../../db'
import CRUD from './methods/CRUD'
import dynamic from './methods/dynamic'
import unsubscribe from './methods/unsubscribe'
import ldgSchema from '../../../schema'
import { no$ } from '../../../helpers/functions'

function rxdb (dateConectare) {
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
      const cheiPrincipale = Object.keys(o).filter(k => k.indexOf('$') === 0)
      if (!cheiPrincipale.length) return
      cheiPrincipale.forEach(key => {
        const k = no$(key)
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

    store.subscribe(unsubscribe(subs))
    store.subscribe(CRUD(db, { commit, getters, dispatch }))
    // store.subscribe(schimbaAsociatie(subs, subscribe, db))
    store.subscribe(dynamic(db))

    // test
    store.subscribe(({ type, payload }) => {
      if (type !== 'TEST') return
      console.error('GOT HERE')
    })
  }
}

export default rxdb
