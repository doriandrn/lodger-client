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
import { rejects } from 'assert';

const { NODE_ENV } = process.env

const buildOpts: BuildOptions = {
  dbCon: {
    name: 'Lodger/',
    adapter: NODE_ENV === 'test' ? 'memory' : 'idp',
    password: 'l0dg3rp4$$'
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

const shortcuts = {
  // asociatii: {}
}

const handlerTaxonomyChanges = (taxonomie, changes, resolve) => {
  const debug = Debug('lodger:hTC')
  debug('SCHIMBAT')
  if (taxonomie === 'servicii' && changes.length < 0) {
    // insertPredefinedServices()
    // servicii.instaleazaPredefinite()
  }

  const xx = Object.assign({},
    ...changes.map((item: RxDocument<any>) => {
      return { [item._id]: item._data }
    })
  )
  // debug('xx', taxonomie, xx)
  shortcuts[taxonomie] = xx
  debug('UPDATAT shortcut', taxonomie, Object.keys(xx).length)
  resolve(xx)
}

function $get (
  taxonomie: Plural,
  criteriu ?: Criteriu,
  subscriberName ?: string
) {
  const debug = Debug('lodger:$get')

  const { collections } = <RxDatabase>this
  if (!collections) {
    throw new LodgerError(Errors.missingCoreDefinitions)
  }
  let { limit, index, sort, find } = getCriteriu(taxonomie, criteriu)

  const paging = Number(limit || 0) * (index || 1)

  const colectie = collections[<Plural>taxonomie]
  debug('tax', taxonomie)
  const subscriber = <Subscriber>subscribers[subscriberName || 'main']

  return new Promise((resolve, reject) => {
    if (subscriber[taxonomie]) reject('subscriber exists')
    subscriber[taxonomie] = colectie
      .find(find)
      .limit(paging)
      .sort(sort)
      .$
      .subscribe(changes => {
        if (!changes) reject('no changes')
        handlerTaxonomyChanges(taxonomie, changes, resolve)
        debug('INSCRIS', taxonomie)
      })
  })
}

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
    protected store: Store<RootState>
  ) {
    const debug = Debug('lodger:new')
    
    /**
     * Short API access for taxonomies
     */
    

    // for (const plugin of this.plugins) {
    //   debug('loading plugin:', plugin)
    // }
    this.$get = $get.bind(db)
    // this.shortcus = shortcuts
    Object.keys(shortcuts).forEach(shortcut => {
      Object.defineProperty(this, shortcut, {
        get () {
          debug('getter apelat, intorc: ', shortcuts[shortcut])
          return shortcuts[shortcut]
        }
      })

      // Object.defineProperty(this, {
      //   [shortcut]: {
      //     get () {
      //       return shortcuts[shortcut]
      //     }
      //   }
      // }, {})
      // this[shortcut] = () => shortcuts[shortcut]
    })
    debug('inited', Object.keys(this))
  }

  /**
   * Updateaza datele subscriberi-lor,
   * date folosite de getteri pentru a fi
   * afisate in interfata
   */
  // async $get (
  //   taxonomie: Plural,
  //   criteriu?: Criteriu,
  //   subscriberName?: string
  // ) {
  //   const debug = Debug('lodger:$get')
  //   const {
  //     db: { collections },
  //     subscribers
  //   } = this
  //   let { limit, index, sort, find } = getCriteriu(taxonomie, criteriu)

  //   const paging = Number(limit || 0) * (index || 1)

  //   const colectie = collections[<Plural>taxonomie]
  //   debug('tax', taxonomie)
  //   const subscriber = <Subscriber>subscribers[subscriberName || 'main']

  //   if (subscriber[taxonomie]) return

  //   subscriber[taxonomie] = colectie
  //     .find(find)
  //     .limit(paging)
  //     .sort(sort)
  //     .$
  //     .subscribe(async changes => {
  //       await this.handlerTaxonomyChanges(taxonomie, changes)
  //       debug('GoT', taxonomie)
  //     })
  // }
  
  /**
   * Adds / updates an entry in the DB
   * 
   * @param taxonomie 
   * @param data 
   */
  async put (taxonomie: Taxonomii, data: DateTaxonomie) {
    const debug = Debug('lodger:put')
    const { db, plurals, store } = this
    const plural = plurals.get(taxonomie)
    if (!plural) throw new LodgerError('noPlural')
    let { _id } = data
    const colectie = db.collections[plural]
    const method = _id ? 'upsert' : 'insert'
    const { _data } = await colectie[method](data)
    debug('pus', taxonomie)
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

    if (options) {
      Object.assign(buildOpts, { ...options })
    }

    for (const [s, p] of plurals) { await $get.call(db, p) }

    // plurals.forEach(async taxonomie => { 
    //   await $get(db, taxonomie)
    // })

    return new Lodger(
      taxonomii,
      forms,
      plurals,
      db,
      store
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
