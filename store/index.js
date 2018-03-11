import createPersistedState from 'vuex-persistedstate'
import Db from 'db'
import { defs } from 'db/_defs'

// const db = (async () => {
//   const db = await Db()
//   return db
// })()

// const subs = []
// db.blocuri.find().$.filter(bloc => bloc !== null).subscribe(blocuri => {
//   console.log('bllblblb', blocuri)
// })
export const state = () => ({
})

export const getters = {}
let db
Db().then(rxdb => db = rxdb)

const mine = function () {
  return function (store) {
    store.subscribe(async ({ type, payload }) => {
      if (type.indexOf('ADAUGA') > -1) {
        const what = type.split('/')[0]
        await db[defs[what]].upsert({ ...payload })
      }
    })
  }
}

export const plugins = [
  createPersistedState(),
  mine()
]
