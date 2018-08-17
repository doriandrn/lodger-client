import Debug from 'debug'
import { Store } from 'vuex'
import { RxDatabase, RxCollectionCreator } from 'rxdb'
import { RootState } from 'lodger/types/index'

import LodgerStore from 'lodger/lib/Store'
import DB from 'lodger/lib/DB'
import { Form } from 'lodger/lib/Form'
import { LodgerError } from 'lodger/lib/Errors'

const { NODE_ENV } = process.env

enum Taxonomii {
  asociatie = 'asociatie',
  bloc = 'bloc',
  apartament = 'apartament',
  incasare = 'incasare',
  cheltuiala = 'cheltuiala'
}

const buildOpts: BuildOptions = {
  dbCon: {
    name: 'Lodger/',
    adapter: NODE_ENV === 'test' ? 'memory' : 'idp',
    password: 'l0dg3rp4$$'
  },
  usePersistedState: false
}

enum Errors {
  missingDB = 'Missing database',
  invalidPluginDefinition = 'Invalid plugin definition',
  pluralsAlreadyDefined = 'Plurals already defined, aborting',
  missingCoreDefinitions = 'Invalid Lodger build. Missing core definitions'
}

// Debug.enable(['test', 'dev'].indexOf(String(NODE_ENV)) >= -1 ? 'lodger:*' : null)

const loadForms = (taxonomies: Taxonomii[]) => taxonomies.map((tax: Taxonomii) => Form.loadByName(tax))

const definePlurals = (forms: Form[]): PluralsMap => {
  const plrls: PluralsMap = plurals || new Map()
  if (plrls.size) throw new LodgerError(Errors.pluralsAlreadyDefined)
  forms.forEach(form => {
    const { name, plural } = form
    plrls.set(name, plural)
  })
  return plrls
}

/**
 * Private, internal stuff
 * ** initialize on build **
 * 
 */
let forms: Form[] | null = null
let db: RxDatabase | null = null
let store: Store<RootState> | null = null
let plurals: PluralsMap | null = null
const plugins: Plugin[] = []



class Lodger {
  constructor () {
    const debug = Debug('lodger:new')
    // debug('db', db)
    // debug('store', store)
    // debug('plurals', plurals)
    if (!(db && plurals && plurals.size)) {
      throw new LodgerError(Errors.missingCoreDefinitions)
    }
    
    /**
     * Short API access for taxonomies
     */
    for (const [singular, plural] of plurals) {
      Object.defineProperties(this, {
        [plural]: {
          value: db.collections[plural]
        },
        // [singular]: {}
      })
    }

    for (const plugin of plugins) {
      debug('loading plugin:', plugin)
    }
    debug('inited')
    // debug('plurals', plurals)
  }
  
  /**
   * Adds / updates an entry in the DB
   * 
   * @param taxonomie 
   * @param data 
   */
  async put (taxonomie: Taxonomii, data: DateTaxonomie) {
    if (!db) throw new LodgerError(Errors.missingCoreDefinitions)
    const plural = plurals && plurals.size > 0 ? plurals.get(taxonomie) : null
    if (!plural) throw new LodgerError('noPlural')
    let { _id } = data
    const colectie = db.collections[plural]
    const method = _id ? 'upsert' : 'insert'
    const { _data } = await colectie[method](data)
    // debug('should update store here', _data)

    if (store) await store.dispatch(`${taxonomie}/setLast`, _data._id)
    return _data
  }

  /**
   * Removes a Document from the DB
   * 
   * @param taxonomie 
   * @param id 
   */
  async trash (taxonomie: Taxonomii, id: ItemID) {
    const debug = Debug('lodger:trash')
    if (!(plurals && db)) throw new LodgerError(Errors.missingCoreDefinitions)
    const plural = plurals.get(taxonomie)
    if (!plural) throw new LodgerError('wtf')
    const col = db.collections[plural]
    const doc = await col.findOne(id)
    debug(`deleting ${taxonomie} ID ${id}`)
    await doc.remove()
    debug('deleted')
    return true
  }

  /**
   * set
   */
  setPreference (preference: string, value: any) {
    return 1
  }

  private get plugins () {
    return plugins
  }

  get __getters () {
    if (!store) throw new LodgerError(Errors.missingCoreDefinitions)
    return store.getters
  }

  get preferences () {
    if (!(db && store)) throw new LodgerError(Errors.missingCoreDefinitions)
    const preferences: Preferences = {
      client: store.getters.preferences,
      user: db.collections['preferences']
    }
    return preferences
  }

  /**
   * Init / build function
   * 
   * Build steps: (order matters)
   * 1. Lodger Forms
   * 2. Plurals
   * 3. DB
   * 4. Store
   * 
   * @param {object} options
   * @returns {Lodger}
   * 
   */
  static async build (options?: BuildOptions) {
    let { dbCon } = options || buildOpts
    const debug = Debug('lodger:build')
    debug('building...')
    
    const taxonomii: Taxonomii[] = <Taxonomii[]>Object.keys(Taxonomii)

    forms = loadForms(taxonomii)
    plurals = definePlurals(forms)
    const collections: RxCollectionCreator[] = forms.map(form => form.collection)
    db = await DB(collections, dbCon)
    store = LodgerStore(taxonomii)

    if (options) {
      Object.assign(buildOpts, { ...options })
    }

    return new Lodger()
  }

  /**
   * Metoda de introdus plugin-uri in clasa
   * 
   * @param {Plugin} plugin 
   * 
   */
  static use (plugin: Plugin) {
    const debug = Debug('lodger:use')
    if (!plugin || typeof plugin !== 'object') {
      throw new LodgerError(Errors.invalidPluginDefinition)
    }
    const { name } = plugin
    debug('using plugin', name)
    plugins.push(plugin)
  }

  /**
   * Destroys the Lodger instance
   * 
   */
  async destroy () {
    if (!db) return
    await db.destroy()
  }
}

export {
  Lodger,
  Taxonomii
}
