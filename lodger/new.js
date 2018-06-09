import connectToDb from './db'
import { traverse, no$ } from "./helpers/functions";
import schema from "./schema";
import { ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants';

let initializat
const definitii = new Map()
const helperCautare = {}

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
    }

    /**
     * Traverseaza recursiv schema si in functie de chei face chestii
     * k = key, v = value
     */
    traverse(schema, (k, v) => {
      // if (v._cheiCautare && v._cheiCautare.length > 0) searchables[no$(k)] = v._cheiCautare
      if (v._singular) definitii.set(v._singular, no$(k))
    })

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
    const _db = await connectToDb()
    if (!_db) throw new Error('DB nu s-a putut incarca')

    return new Lodger(config, { _db })
  }
}
