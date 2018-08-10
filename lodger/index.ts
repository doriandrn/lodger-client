import * as RxDB from 'rxdb'
import Debug from 'debug'
import Vue from 'vue'
import Vuex, { Store, StoreOptions, ModuleTree } from 'vuex'
import { BuildOptions, Plugin } from './typings/defs'
import { RootState } from './typings/index'
import { Form } from 'lodger/lib/Form'
import { LodgerError } from 'lodger/lib/Errors'
import { version } from '../lodger.config'
import { RxDatabase, RxCollectionCreator } from 'rxdb';

const { NODE_ENV } = process.env

const buildOpts: BuildOptions = {
  dbCon: {
    name: 'Lodger/',
    adapter: NODE_ENV === 'test' ? 'memory' : 'idp',
    password: 'l0dg3rp4$$'
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

if (NODE_ENV === 'test') {
  Debug.enable('lodger:*')
}

class Lodger {
  constructor (
    private db: RxDatabase,
    private store: Store<RootState>,
    private plurals: PluralsMap
  ) {}

  // async put (taxonomie, data) {

  // }

  // async trash (taxonomie, id) {}

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
    const taxonomii = Object.keys(Taxonomie).filter(x => (+x) + '' !== x)
    
    /**
     * DB connection
     */
    const { dbCon } = buildOpts
    const collections: RxCollectionCreator[] = taxonomii.map(tax => Form.loadByName(tax).collection)

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
    Vue.use(Vuex)
    const storeModules: ModuleTree<RootState> = {}

    const storeOptions: StoreOptions<RootState> = {
      state: {
        version
      },
      modules: storeModules
    }

    const store = new Vuex.Store<RootState>(storeOptions)

    return new Lodger(db, store)
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
  Taxonomie,
  Lodger,
}
