import createPersistedState from 'vuex-persistedstate'
import PouchDB from 'pouchdb-browser'
PouchDB.plugin(require('relational-pouch'))
const db = new PouchDB('lodger')
db.setSchema([
  { 
    singular: 'asociatie', 
    plural: 'asociatii', 
    relations: {
      blocuri: { hasMany: 'bloc' },
      incasari: { hasMany: 'incasare' },
      cheltuieli: { hasMany: 'cheltuiala' }
    } 
  },
  {
    singular: 'bloc',
    plural: 'blocuri',
    relations: {
      asociatie: { belongsTo: 'asociatie' },
      apartamente: { hasMany: 'apartament' }
    }
  },
  {
    singular: 'serviciu',
    plural: 'servicii',
    relations: {
      asociatii: { belongsTo: 'asociatii' }
    }
  },
  {
    singular: 'apartament',
    plural: 'apartamente',
    relations: {
      asociatie: { belongsTo: 'asociatie' }
    }
  },
  {
    singular: 'incasare',
    plural: 'incasari',
    relations: {
      apartament: { belongsTo: 'apartament' }
    }
  },
  {
    singular: 'cheltuiala',
    plural: 'cheltuieli',
    relations: {
      
    }
  }
])
export const state = () => ({
})

export const getters = {}

const mine = function (db) {
  return function (store) {
    store.subscribe(mutation => {
      const { type } = mutation
      switch (type) {
        case 'asociatie/ADAUGA_ASOCIATIE':
          db.$put('asociatii', payload)
          break
      }
      console.log(mutation, db, 'omg')
    })
  }
}

export const plugins = [
  createPersistedState(),
  mine()
]
