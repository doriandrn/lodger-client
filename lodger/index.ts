import * as RxDB from 'rxdb'
import Debug from 'debug'
import Vue from 'vue'
import Vuex, { Store, StoreOptions, ModuleTree } from 'vuex'
import { 
  BuildOptions,
  Plugin,
  PluralsMap,
  DateTaxonomie,
  CriteriuGetterTaxonomii
} from './typings/defs'
import { RootState } from './typings/index'
import { Form } from 'lodger/lib/Form'
import { LodgerError } from 'lodger/lib/Errors'
import { version } from '../lodger.config'
import { RxDatabase, RxCollectionCreator, RxCollection } from 'rxdb';

const { NODE_ENV } = process.env

const buildOpts: BuildOptions = {
  dbCon: {
    name: 'Lodger/',
    adapter: NODE_ENV === 'test' ? 'memory' : 'idp',
    password: 'l0dg3rp4$$'
  }
}

enum Taxonomii {
  asociatie = 'asociatie',
  bloc = 'bloc',
  apartament = 'apartament',
  incasare = 'incasare',
  cheltuiala = 'cheltuiala'
}

enum Errors {
  missingDB = 'Missing database',
  invalidPluginDefinition = 'Invalid plugin definition'
}

if (NODE_ENV === 'test') {
  Debug.enable('lodger:*')
}

const plugins: Plugin[] = []

Vue.use(Vuex)

class Lodger {
  constructor (
    private db: RxDatabase,
    private store: Store<RootState>,
    private plurals: PluralsMap
  ) {
    const debug = Debug('lodger:new')
    debug('db', db)

    /**
     * Short API access for taxonomies
     */
    for (const [singular, plural] of plurals) {
      const colectie: RxCollection<any> = db.collections[plural]

      Object.defineProperties(this, {
        [`_${plural}`]: db[plural],
        [plural]: {
          // getterul custom cu criteri
          // eg. lodger.asociatii({ querycautare })
          get () {
            return async (criteriu: CriteriuGetterTaxonomii) => {
              let { limit, index, sort, find } = getCriteriu(criteriu, plural)
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
    // debug('plurals', plurals)
  }

  async put (taxonomie: Taxonomii, data: DateTaxonomie) {
    const debug = Debug('lodger:put')
    const plural = this.plurals.get(taxonomie)
    if (!plural) throw new LodgerError('noPlural')
    const { _id } = data
    const colectie = this.db.collections[plural]
    const method = _id ? 'upsert' : 'insert'
    const { _data } = await colectie[method](data)
    debug('should update store here', _data)
    return _data
  }

  // async trash (taxonomie, id) {}

  private get plugins () {
    return plugins
  }

  /**
   * Functie de initializare / build
   * @param {object} options
   */
  static async build (options?: BuildOptions) {
    const debug = Debug('lodger:build')
    debug('building...')
    if (options) {
      Object.assign(buildOpts, { ...options })
    }
    const taxonomii = Object.keys(Taxonomii).filter(x => (+x) + '' !== x)
    const plurals: PluralsMap = new Map()
    const storeModules: ModuleTree<RootState> = {}
    
    /**
     * DB + plurals
     */
    const { dbCon } = buildOpts
    const collections: RxCollectionCreator[] = taxonomii.map(tax => {
      const { collection } = Form.loadByName(tax)
      const { name } = collection
      plurals.set(tax, name)
      return collection
    })
    // debug('COLS', collections)

    taxonomii.forEach(tax => {
      
    })

    /**
     * DB plugins
     */
    if (NODE_ENV === 'test') {
      RxDB.plugin(require('pouchdb-adapter-memory'))
    } else {
      RxDB.plugin(require('pouchdb-adapter-idb'))
    }

    // RxDB.plugin(require('pouchdb-adapter-http'))
    // RxDB.plugin(require('pouchdb-authentication'))
    const db = await RxDB.create(dbCon)
    
    // show leadership in title
    db.waitForLeadership().then(() => {
      if (NODE_ENV !== 'dev') return
      document.title = `♛ ${document.title}`
    })
    await Promise.all(collections.map(c => db.collection(c)))


    /**
     * Store
     */

    const storeOptions: StoreOptions<RootState> = {
      state: {
        version
      },
      modules: storeModules
    }

    const store = new Vuex.Store<RootState>(storeOptions)

    return new Lodger(db, store, plurals)
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
    await this.db.destroy()
  }
}

export {
  Taxonomii,
  Lodger,
}
