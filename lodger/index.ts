import * as RxDB from 'rxdb'
import Debug from 'debug'
import { BuildOptions, ConstructContext, Plugin } from './typings/defs'
import { LodgerPublicAPI, LodgerInit } from 'lodger/typings'
import { Form } from 'lodger/lib/Form'
import { RxDatabase, RxCollection } from 'rxdb'

const { NODE_ENV } = process.env
const buildOpts: BuildOptions = {
  dbCon: {
    name: 'Lodger',
    adapter: 'memory'
  }
}

enum Taxonomie {
  asociatie,
  bloc,
  apartament,
  incasare,
  cheltuiala
}

enum Errors {
  missingDB = 'Missing database',
  invalidPluginDefinition = 'Invalid plugin definition'
}

/**
 * Error logger for forms
 */
class LodgerError extends Error {
  constructor(m: string) {
    super(m)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, LodgerError.prototype)
  }
}


class Lodger implements LodgerInit, LodgerPublicAPI {
  private readonly db: RxDatabase
  private readonly forms: Form[]
  private readonly collections: RxCollection<any>[]
  // preferences: Preferences

  constructor (context: ConstructContext) {
    const { db, forms, collections } = context
    const debug = Debug('lodger:new')
    
    if (!db) throw new LodgerError(Errors.missingDB)
    this.db = db
    this.forms = forms
    this.collections = collections

    debug('DB', this.db)
    debug('forms', this.forms)
    debug('collections', this.collections)
    // Object.keys(context).forEach(assignable => {
    //   if (!context[assignable]) return
    //   Object.assign(this, assignable, { ...context[assignable] })
    // })
  }

  adauga (orice: Taxonomie) {

  }
  /**
   * Functie de initializare / build
   * @param {object} options
   */
  static async build (options?: BuildOptions) {
    const debug = Debug('lodger:build')
    debug('starting build')
    if (options) {
      Object.assign(buildOpts, { ...options })
    }
    const forms = Object.keys(Taxonomie).map(tax => Form.loadByName(Taxonomie[tax]))
    const collections = forms.map(form => form.collection)
    const { dbCon } = buildOpts
    const db = await RxDB.create(dbCon)
    
    // show leadership in title
    db.waitForLeadership().then(() => {
      debug('♛')
      if (NODE_ENV === 'dev') {
        document.title = `♛ ${document.title}`
      }
    })
    await Promise.all(collections.map(c => db.collection(c)))

    return new Lodger({
      db,
      forms,
      // store,
      collections
    })
  }

  /**
   * Metoda de introdus plugin-uri in clasa
   * @param {*} plugin 
   */
  static use (plugin: Plugin) {
    const debug = Debug('lodger:use')
    if (!plugin || typeof plugin !== 'object') {
      throw new LodgerError(Errors.invalidPluginDefinition)
    }
    const { name } = plugin
    debug('using plugin', name)
  }
}

export {
  Taxonomie,
  Lodger
}
