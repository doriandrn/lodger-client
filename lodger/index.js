import connectToDb from './db'

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

    /**
     * props accesibile doar pentru teste
     */
    if (NODE_ENV === 'test') {
      this._db = context._db
      this.definitii = definitii
      this.helperCautare = helperCautare
      this.notifica = notifica
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
    const colectii = []
    const _db = await connectToDb()
    if (!_db) throw new Error('DB nu s-a putut incarca')

    return new Lodger(config, { _db })
  }
}
