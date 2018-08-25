import Debug from 'debug'
import { Store } from 'vuex'
import { RxDatabase, RxCollectionCreator, RxDocument } from 'rxdb'
import fs from 'fs'
import downloadsFolder from 'downloads-folder'
import yaml from 'json2yaml'

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
  pluralsAlreadyDefined = 'Plurals are already defined, aborting',
  missingCoreDefinitions = 'Invalid Lodger build. Missing core definitions',
  invalidPreferenceIndex = 'Invalid preference index supplied',
  invalidPropertySupplied = 'Invalid property supplied',
  couldNotWriteFile = 'Cannot write file'
}

// Debug.enable(['test', 'dev'].indexOf(String(NODE_ENV)) >= -1 ? 'lodger:*' : null)

// function plural<T>

const loadForms = (taxonomies: Taxonomii[]) => taxonomies.map((tax: Taxonomii) => Form.loadByName(tax))

type SubscribersList = {
  main: Subscriber,
  [k: string]: Subscriber
}

type Subscriber = {
  [k in Taxonomii]?: any
}

const singular = (tax: Plural<Taxonomii>) => {}

// /**
//  * Private, internal stuff
//  * ** initialize on build **
//  * 
//  */
// let forms: Form[] | undefined
// let db: RxDatabase | undefined
// let store: Store<RootState> | undefined
// let plurals: PluralsMap | undefined
const plugins: Plugin[] = []

class Lodger {
  constructor (
    protected taxonomii: Taxonomii[],
    protected forms: Form[],
    private readonly plurals: PluralsMap,
    protected db: RxDatabase,
    protected store: Store<RootState>,
    protected subscribers: SubscribersList
  ) {
    const debug = Debug('lodger:new')
    // if (!(db && plurals && plurals.size)) {
    //   throw new LodgerError(Errors.missingCoreDefinitions)
    // }
    
    // /**
    //  * Short API access for taxonomies
    //  */
    // for (const [singular, plural] of plurals) {

    //   Object.defineProperties(this, {
    //     [plural]: {
    //       // getterul custom cu criteri
    //       // eg. lodger.asociatii({ querycautare })
    //       get () {
    //         return async (criteriu?: Criteriu, subscriberName?: SubscriberName) => {
              
             

    //         }
    //       }
    //     }
    //   })
    // }

    // for (const plugin of this.plugins) {
    //   debug('loading plugin:', plugin)
    // }
    // debug('inited', subscribers)
  }

  /**
   * Updateaza datele subscriberi-lor,
   * date folosite de getteri pentru a fi
   * afisate in interfata
   */
  async $get (
    taxonomie: Plural<Taxonomii>,
    criteriu?: Criteriu,
    subscriberName?: string
  ) {
    const { db, subscribers } = this
    let { limit, index, sort, find } = getCriteriu(singular(taxonomie), criteriu)

    const paging = Number(limit || 0) * (index || 1)

    const colectie = db.collections[taxonomie]
    const subscriber = <Subscriber>subscribers[subscriberName || 'main']

    subscriber[taxonomie] = colectie
      .find(find)
      .limit(paging)
      .sort(sort)
      .$.subscribe(async schimbariInColectie => {
        if (!schimbariInColectie) return
        if (taxonomie === 'servicii' && schimbariInColectie.length < 0) {
          // insertPredefinedServices()
        }
        return schimbariInColectie.map((item: RxDocument<any>) => item._data)
      })
  }
  
  /**
   * Adds / updates an entry in the DB
   * 
   * @param taxonomie 
   * @param data 
   */
  async put (taxonomie: Taxonomii, data: DateTaxonomie) {
    const { db, plurals, store } = this
    const plural = plurals.get(taxonomie)
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
    const { plurals, db } = this
    const debug = Debug('lodger:trash')
    const plural = plurals.get(taxonomie)
    if (!plural) throw new LodgerError('wtf')
    const col = db.collections[plural]
    const doc: RxDocument<Taxonomii> = await col.findOne(id)
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
    const { db, store } = this
    const allowedTaxonomies = ['client', 'user']
    if (!preference) throw new LodgerError(Errors.invalidPreferenceIndex)
    const taxonomy = preference.split('.')[0]
    if (!taxonomy || allowedTaxonomies.indexOf(taxonomy) < 0) {
      throw new LodgerError(Errors.invalidPreferenceIndex)
    }
    debug('setting preference', preference, value)
    switch (taxonomy) {
      case 'client':
        store.commit('preferences/update', {
          path: preference.replace('client.', ''),
          value
        })

        break
      
      case 'user':
        // db.collections.utilizator....
        break
    }
  }

  /**
   * Active plugins list
   */
  private get plugins () {
    return plugins
  }

  /**
   * Lodger Getters
   * All UI connects with this
   * combines DB & Store getters
   * 
   */
  get __getters () {
    const { db, store } = this
    if (!store) throw new LodgerError(Errors.missingCoreDefinitions)
    return {
      ...store.getters
    }
  }

  get preferences () {
    const { db, store } = this
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

    const forms = loadForms(taxonomii)
    const plurals: PluralsMap = new Map()
    forms.forEach(form => {
      const { name, plural } = form
      plurals.set(name, plural)
    })
    const collections: RxCollectionCreator[] = forms.map(form => form.collection)
    const db = await DB(collections, dbCon)
    const store = LodgerStore(taxonomii)
    const subscribers: SubscribersList = {
      main: {},
      // altSubscriber: { ... }
    }

    if (options) {
      Object.assign(buildOpts, { ...options })
    }

    return new Lodger(
      taxonomii,
      forms,
      plurals,
      db,
      store,
      subscribers
    )
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

  /**
   * Exports the DB
   */
  async export (path?: string, cryptedData?: boolean, filename?: string) {
    const debug = Debug('lodger:export')
    const json = await this.db.dump()
    const extension = 'ldb'
    if (!path) path = downloadsFolder()
  
    if (!filename) {
      const date = new Date()
      filename = `LdgDB-${date}`
    }
    fs.writeFile(`${path}/${filename}.${extension}`, yaml.stringify(json), (e: Error) => {
      if (e) throw new LodgerError(Errors.couldNotWriteFile)
      debug(`written ${filename}.${extension} in path`)
    })
  }

  /**
   * TODO!!
   */
  async import () {

  }
}

export {
  Lodger,
  Errors,
  Taxonomii
}
