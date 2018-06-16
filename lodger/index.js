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

    // api-ul
    for (const [singular, plural] of definitii) {
      const colectie = _db[plural]
  
      Object.defineProperties(this, {
        [singular]: {
          value: { 
            ... colectie._methods,
            adauga: colectie.insert.bind(colectie)
          }
        },
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

    return this
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
