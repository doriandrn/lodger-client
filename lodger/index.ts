import Debug from 'debug'
import { Store, GetterTree } from 'vuex'
import { RxDatabase, RxCollectionCreator, RxDocument } from 'rxdb'
import fs from 'fs'
import osHomedir from 'os-homedir'
import yaml from 'json2yaml'

import LodgerStore from 'lodger/lib/Store'
import { getCriteriu } from 'lodger/lib/helpers/functions'
import { handleOnSubmit } from 'lodger/lib/helpers/forms'
import DB from 'lodger/lib/DB'
import { Form } from 'lodger/lib/Form'
import { LodgerError } from 'lodger/lib/Errors'

import Vue from 'vue'
import { Observer } from 'rxjs';

const { NODE_ENV } = process.env

const buildOpts: BuildOptions = {
  dbCon: {
    name: 'Lodger/',
    adapter: 'memory',
    password: 'l0dg3rp4$$',
    ignoreDuplicate: NODE_ENV === 'test'
  },
  usePersistedState: false
}

const subscribers: SubscribersList = {
  main: {},
  // altSubscriber: { ... }
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
  noPlural = 'Could not find plural definition for %%',
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
  [k: string]: Asociatii | undefined
}

// const shortcuts = {
//   // asociatii: {}
// }

interface LdgGetters extends GetterTree<IndexState, RootState> {}

  /**
   * Updateaza datele subscriberi-lor,
   * date folosite de getteri pentru a fi
   * afisate in interfata
   * 
   * TODO: de exportat de -aici
   * 
   * Usage: subscribes DB changes to a given variable (binder)
   * 
   */
function subscribe (
  binder: Observer<object>,
  taxonomie: Plural,
  criteriu ?: Criteriu,
  subscriberName ?: string
) {
  // const debug = Debug('lodger:subscribe')

  const { collections } = <RxDatabase>this
  if (!collections) {
    throw new LodgerError(Errors.missingCoreDefinitions)
  }
  let { limit, index, sort, find } = getCriteriu(taxonomie, criteriu)
  const paging = Number(limit || 0) * (index || 1)
  const colectie = collections[<Plural>taxonomie]
  const subscriber = <Subscriber>subscribers[subscriberName || 'main']

  subscriber[taxonomie] = colectie
    .find(find)
    .limit(paging)
    .sort(sort)
    .$
    .subscribe((changes: RxDocument<any>[]) => {
      if (!changes) return
      
      // check if comes from Vue data() -> if it's observable
      if (binder.__ob__) {
        // cleanup first
        Object.keys(binder).forEach(id => { delete binder[id] })

        // update data obj
        changes.map((item: RxDocument<any>) => {
          Vue.set(binder, item._id, item._data)
        })
      } else {
        binder = Object.assign({},
          ...changes.map((item: RxDocument<any>) => ({ [item._id]: item._data }))
        )
      }
    })
}


const plugins: Plugin[] = []

class Lodger {
  constructor (
    protected taxonomii: Taxonomii[],
    protected forms: Form[],
    private readonly plurals: PluralsMap,
    protected db: RxDatabase,
    readonly store: Store<RootState>,
    readonly subscribe: () => Promise<any>
  ) {}

  /**
   * Adds / updates an entry in the DB
   * 
   * @param taxonomie 
   * @param data 
   */
  async put (taxonomie: Taxonomii, data: LodgerFormData) {
    const debug = Debug('lodger:put')
    const { db, plurals, store } = this
    const plural = plurals.get(taxonomie)
    if (!plural) throw new LodgerError(Errors.noPlural, taxonomie)
    const colectie = db.collections[plural]
    const method = data._id ? 'upsert' : 'insert'
    const { _data } = await colectie[method](handleOnSubmit(data))
    if (store) await store.dispatch(`${taxonomie}/setLast`, _data._id)
    debug('pus', taxonomie, _data._id)
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
    await doc.remove()
    debug(`deleted ${taxonomie} ID ${id}`)
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
  get getters () {
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
    debug(`building in ${NODE_ENV} mode ...`)

    const taxonomii: Taxonomii[] = <Taxonomii[]>Object.keys(Taxonomii)

    const forms = loadForms(taxonomii)
    const plurals: PluralsMap = new Map()
    forms.forEach(form => {
      const { name, plural } = form
      plurals.set(name, plural)
    })
    const collections: RxCollectionCreator[] = forms.map(form => form.collection)
    const db = await DB(collections, dbCon)
    const store = new LodgerStore(taxonomii)

    if (options) {
      Object.assign(buildOpts, { ...options })
    }

    // for (const [s, p] of plurals) { await subscribe.call(db, p) }

    return new Lodger(
      taxonomii,
      forms,
      plurals,
      db,
      store,
      subscribe.bind(db)
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
    await this.unsubscribeAll()
    await this.db.destroy()
  }

  /**
   * Exports the DB
   */
  async export (path?: string, cryptedData?: boolean, filename?: string) {
    const debug = Debug('lodger:export')
    const json = await this.db.dump()
    const extension = 'ldb'
    if (!path) path = `${osHomedir()}/downloads/`
  
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

  async unsubscribeAll (subscriberName: string = 'main') {
    const sub = subscribers[subscriberName || 'main']
    const debug = Debug('lodger:unsub')
    return await Promise.all(
      Object.keys(sub).map(async subscriber => {
        debug('unsub', sub)
        await sub[subscriber].unsubscribe()
      })
    )
  }
}

export {
  Lodger,
  Errors,
  Taxonomii
}
