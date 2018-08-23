import Debug from 'debug'
import { Store } from 'vuex'
import { RxDatabase, RxCollectionCreator } from 'rxdb'

import LodgerStore from 'lodger/lib/Store'
import { getCriteriu } from 'lodger/helpers/functions'
import DB from 'lodger/lib/DB'
import { Form } from 'lodger/lib/Form'
import { LodgerError } from 'lodger/lib/Errors'

const { NODE_ENV } = process.env

const buildOpts: BuildOptions = {
  dbCon: {
    name: 'Lodger/',
    adapter: NODE_ENV === 'test' ? 'memory' : 'idp',
    password: 'l0dg3rp4$$'
  },
  usePersistedState: false
}


enum Taxonomii {
  asociatie = 'asociatie',
  bloc = 'bloc',
  apartament = 'apartament',
  incasare = 'incasare',
  cheltuiala = 'cheltuiala',
  serviciu = 'serviciu',
  furnizor = 'furnizor',
  utilizator = 'utilizator'
}


enum Errors {
  missingDB = 'Missing database',
  invalidPluginDefinition = 'Invalid plugin definition',
  pluralsAlreadyDefined = 'Plurals already defined, aborting',
  missingCoreDefinitions = 'Invalid Lodger build. Missing core definitions',
  invalidPreferenceIndex = 'Invalid preference index supplied',
  invalidPropertySupplied = 'Invalid property supplied'
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
      // Object.defineProperties(this, {
      //   [plural]: {
      //     value: db.collections[plural].find
      //   },
      //   // [singular]: {}
      // })
      // this[plural] = db.collections[plural].find

      Object.defineProperties(this, {
        [plural]: {
          // getterul custom cu criteri
          // eg. lodger.asociatii({ querycautare })
          get () {
            return async (criteriu?: Criteriu) => {
              if (!db) throw new LodgerError(Errors.missingCoreDefinitions)
              let { limit, index, sort, find } = getCriteriu(<Taxonomii>singular, criteriu)

              const paging = Number(limit || 0) * (index || 1)
              const rezultate = Object.create(null)
              const colectie = db.collections[plural]
              const documente = await colectie
                .find(find)
                .limit(paging)
                .sort(sort)
                .exec()

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

    for (const plugin of this.plugins) {
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
   * Sets a preference either in DB or store
   * 
   */
  async setPreference (preference: string, value: any) {
    const debug = Debug('lodger:set')
    const allowedTaxonomies = ['client', 'user']
    if (!preference) throw new LodgerError(Errors.invalidPreferenceIndex)
    const taxonomy = preference.split('.')[0]
    if (!taxonomy || allowedTaxonomies.indexOf(taxonomy) < 0) {
      throw new LodgerError(Errors.invalidPreferenceIndex)
    }
    debug('setting preference', preference, value)
    switch (taxonomy) {
      case 'client':
        if (!store) throw new LodgerError(Errors.missingCoreDefinitions)
        store.commit('preferences/update', {
          path: preference.replace('client.', ''),
          value
        })

        break
      
      case 'user':
        if (!db) throw new LodgerError(Errors.missingCoreDefinitions)
        // db.collections.utilizator....
        break
    }
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
  Errors,
  Taxonomii
}
