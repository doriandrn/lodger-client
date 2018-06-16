import connectToDb from './db'
import { definitii, helperCautare } from './definitii'
import colectii  from './db/collections'

let initializat
let _db
const api = {}
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
        // [singular]: {
        //   value: {
        //     adauga: colectie.insert.bind(colectie),
        //     modifica: colectie.upsert.bind(colectie),
        //     sterge: colectie.remove.bind(colectie),
        //     ... colectie._methods,
        //   }
        // },
        [plural]: {
          get () {
            if (!arguments) {
              return 'default search - limit etc'
            }
            // getterul custom cu criteri
            // eg. lodger.asociatii({ querycautare })
            return async criteriu => {
              return await colectie.find(criteriu).exec()
            }
          }
        }
      })
    }

    /* Indicator initializare - flag */
    initializat = true
    console.dir('api', api)

    // return this
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

    return await colectie[metoda](date)
  }

  get _db () {
    return _db
  }

  get initializat () {
    return initializat
  }

  /**
   * Functie de initializare / build
   * @param {object} config 
   */
  static async build (config) {
    const dbConfig = config && config.dbCon ? config.dbCon : {}
    const _db = await connectToDb(dbConfig, colectii)
    if (!_db) throw new Error('DB nu s-a putut incarca')

    return new Lodger(config, { _db })
  }

  async destroy () {
    if (!this._db || !this.initializat) return
    await this._db.destroy()
  }
}
