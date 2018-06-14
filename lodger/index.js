import connectToDb from './db'
import { definitii, helperCautare } from './definitii'
import colectii  from './db/collections'

let initializat
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

    this._db = context._db

    /**
     * props accesibile doar pentru teste
     */
    if (NODE_ENV === 'test') {
      this.definitii = definitii
      this.helperCautare = helperCautare
      // this.notifica = notifica
    }

    /* Indicator initializare - flag */
    initializat = true
    return this
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
    if (!this.initializat) return
    await this._db.destroy()
  }
}
