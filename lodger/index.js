import connectToDb from './db'
// import Vuex from 'vuex'
import { definitii, helperCautare } from './definitii'
import colectii  from './db/collections'

let initializat
let _db
let store
const subscriberiPrincipali = {}

const storeDecorator = () => {}

const { NODE_ENV } = process.env

/**
 * Creates an instance of Lodger.
 * @param {object} config
 * @param {object} context
 * @memberof Lodger
 */
export default class Lodger {
  constructor (config, context) {
    if (!context || typeof context._db === 'undefined') {
      throw new Error('DB neinitializat')
    }
    _db = context._db

    /**
     * API-ul principal
     * Pentru fiecare definitie creeaza metode si getteri
     */
    for (const [singular, plural] of definitii) {
      const colectie = _db[plural]
  
      Object.defineProperties(this, {
        [plural]: {
          // getterul custom cu criteri
          // eg. lodger.asociatii({ querycautare })
          get () {
            return async ({ limit, index, sort, find }) => {
              const paging = limit * (index || 1)
              const rezultate = Object.create(null)
              const documente = await colectie.find(find).limit(paging).sort(sort).exec()
              for (const doc of documente) {
                const { _data } = doc
                const { _id } = _data
                if (!_id) continue
                Object.assign(rezultate, { [_id]: _data })
              }
              return rezultate
            }
          }
        }
      })
    }

    /* Indicator initializare - flag */
    initializat = true
    console.log('store', store)
  }

  /**
   * Adaugă un item/document nou
   * @param {object} date 
   */
  async adauga (date) {
    if (typeof date !== 'object')
      throw new Error('parametri incorecti')

    const { ce } = date

    if (!ce) {
      throw new Error('taxonomie nedfinita')
    }
    if (!definitii.has(ce)) {
      throw new Error('taxonomie incorecta')
    }
    if (Object.keys(date).length === 1) {
      throw new Error('parametri insuficienti')
    }
    const plural = definitii.get(ce)
    if (!plural) {
      throw new Error(`${ce} e de negasit(a) in definitii`)
    }
    const colectie = _db[plural]
    const metoda = date._id ? 'upsert' : 'insert'
    delete date.ce

    try {
      const adaugat = await colectie[metoda](date)
      return adaugat
    } catch (e) {
      throw new Error(e)
    }
  }

  get _db () {
    return _db
  }

  get initializat () {
    return initializat
  }

  get store () {
    return store
  }

  /**
   * Functie de initializare / build
   * @param {object} config 
   */
  static async build (config, modules) {
    const dbConfig = config && config.dbCon ? config.dbCon : {}
    const _db = await connectToDb(dbConfig, colectii)
    if (!_db) throw new Error('DB nu s-a putut incarca')
    const { store } = modules || { store: null }
    return new Lodger(config, { _db, store })
  }

  /**
   * functionalitatea de plugin
   */
  injectStore () {
    return async Store => {
      store = Store
    }
  }

  async destroy () {
    if (!this._db || !this.initializat) return
    await this._db.destroy()
  }
}
