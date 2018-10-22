import Debug from 'debug'
import { Store, GetterTree } from 'vuex'
import { RxDatabase, RxCollectionCreator, RxDocument, isRxDocument } from 'rxdb'
import fs from 'fs'
import osHomedir from 'os-homedir'
import yaml from 'json2yaml'

import LodgerStore from 'lodger/lib/Store'
import { getCriteriu, taxIsMultipleSelect } from 'lodger/lib/helpers/functions'
import { handleOnSubmit, assignRefIdsFromStore } from 'lodger/lib/helpers/forms'
import DB from 'lodger/lib/DB'
import { Form } from 'lodger/lib/Form'
import { LodgerError } from 'lodger/lib/Errors'

import Vue from 'vue'
import { Observer } from 'rxjs';

import { predefinite } from 'lodger/lib/forms/serviciu'

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
  registru: {},
  listeDePlata: {},
  statistici: {}
  // altSubscriber: { ... }
}

enum Taxonomii {
  asociatie = 'asociatie',
  bloc = 'bloc',
  apartament = 'apartament',
  factura = 'factura',
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
  missingData = 'Missing data %%',
  couldNotWriteFile = 'Cannot write file'
}

const loadForms = (taxonomies: Taxonomii[]) => Object.assign({}, ...taxonomies.map((tax: Taxonomii) => ({ [tax]: Form.loadByName(tax) }) ))

type SubscribersList = {
  main: Subscriber,
  [k: string]: Subscriber
}

type Subscriber = {
  [k: string]: Asociatii | undefined
}


const plugins: Plugin[] = []

interface LdgGetters extends GetterTree<IndexState, RootState> {}

/**
 * Main holder for temporary items subscribed to
 *
 * -> a vue helper for reactivity
 * holds RX documents
 * and methods to accezss / manipulate them
 */
const docsHolderObj = { docs: [], items: {}, criteriu: {} }
const docsHolder = new Vue({
  data: { main: {}, playground: {} },
  methods: {
    async getItem (
      taxonomie: Plural<Taxonomii>,
      id: string | object,
      subscriberName : string = 'main'
    ) {
      let item
      const debug = Debug('lodger:getItem')

      // const _sub
      // Filters the documents array for the one with the id
      const _theDoc = docs => {
        const doc = docs.filter(doc => doc._id === id)[0]
        if (!(doc && isRxDocument(doc))) throw new LodgerError('no doc found %%', id)
        return doc
      }

      const { $data } = this

      try {
        const s = this[subscriberName][taxonomie]
        item = _theDoc(s.docs)
        if (item) debug('item gasit din prima', { taxonomie, subscriberName, s, item })
      } catch (e) {
        Object.keys($data).forEach(sub => {
          debug('SEX', sub)
          if (item) return
          const s = this[sub][taxonomie]
          debug('tried s', sub, s, taxonomie)
          if (!(s && s.docs)) return
          debug('SBF', s)
          item = _theDoc(s.docs)
          if (item) debug('item gasit din a 2a', { taxonomie, subscriberName, s, item })
        })

      } finally {
        if (!item) {
          debug('item negasit pe subscriber, iau din db', taxonomie, id)
          // item = await collections[plural].findOne(id).exec()
          console.error('ITEM NEGASIT', taxonomie, id)
          // item = await db.collections[taxonomie].findOne.exec()
        }
      }

      return item
    }
  }
})

class Lodger {
  constructor (
    protected taxonomii: Taxonomii[],
    protected forms: Form[],
    private readonly plurals: PluralsMap,
    protected db: RxDatabase,
    readonly store: Store<RootState>
  ) {
    const debug = Debug('lodger:constructor')
    const { subscriberData } = this

    taxonomii.forEach(tax => {
      const plural = plurals.get(tax)

      Object.defineProperty(this, plural, {
        get () {
          return (subscriberName: string = 'main') => subscriberData(tax, subscriberName)
        }
      })
    })

    store.subscribe(async ({ type, payload }) => {
      const path = type.split('/')
      if (path[1] !== 'select') return
      const taxonomie = path[0]
      const { plural } = forms[taxonomie]

      if (!payload.hadDoc) {
        let doc
        doc = await docsHolder.getItem(plural, payload.id, payload.subscriber)
        this._activeDocument = { taxonomie, doc }
      }
    })

    // todo, remove on prod
    if (window) window.dh = docsHolder
  }

  /**
   * Notifies the user about an update/change
   * - Store action wrapper -
   */
  notify (notification: Toast | Notification) {
    this.store.dispatch('notify', notification)
  }

  /**
   * Adds / updates an entry in the DB
   *
   * @param taxonomie
   * @param data
   */
  async put (
    taxonomy: Taxonomii,
    data: LodgerFormData
  ) {
    const debug = Debug('lodger:put')
    if (!data || Object.keys(data).length < 1) throw new LodgerError(Errors.missingData, data)

    const {
      db,
      plurals,
      store,
      forms
    } = this

    const plural = plurals.get(taxonomy)
    if (!plural) throw new LodgerError(Errors.noPlural, taxonomy)
    const colectie = db.collections[plural]

    /**
     * If form submitted with an _id, must be an upsert
     */
    const method = data._id ?
      'upsert' :
      'insert'

    const form = forms[taxonomy]
    const references = form.referenceTaxonomies
    const referencesIds = this.activeReferencesIds(references)

    /**
     * add references, default values, etc
     */
    const internallyHandledData = handleOnSubmit(data, { referencesIds, store })

    /**
     * do the insert / upsert and following actions
     */
    try {
      const doc = await colectie[method](internallyHandledData)
      const id = doc._id
      store.dispatch(`${taxonomy}/set_last`, id)
      this.select(taxonomy, { doc, id })

      debug('pus', taxonomy, id, doc)
      return doc
    } catch (e) {
      this.notify({
        type: 'error', text: String(e)
      })
    }
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
   *
   * @param taxonomie
   * @param id
   */
  async select (
    taxonomie: Taxonomii,
    data: string | object
  ) {
    const debug = Debug('lodger:select')
    const { dispatch } = this.store

    if (typeof data === 'object') {
      const { doc } = data

      if (doc) {
        debug('!!! DOC pe data', doc)
        this._activeDocument = { taxonomie, doc }
        data.doc = undefined
        data.hadDoc = true
      }
    }

    await dispatch(`${taxonomie}/select`, data)
  }

  /**
   * Active document for taxonomy
  */
  protected set _activeDocument (docHolder) {
    let { taxonomie, doc } = docHolder
    const debug = Debug('lodger:_activeDocument')
    debug('set active', docHolder)
    const gName = `${taxonomie}/activeDoc`
    debug('gName', gName)
    const { store } = this

    if (!store.getters.hasOwnProperty(gName)) {
      Object.defineProperty(store.getters, gName, {
        configurable: false,
        get () { return doc },
        set (newDoc) { doc = newDoc; debug('resetat', newDoc, doc) }
      })
    } else {
      store.getters[gName] = doc
    }
  }

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
  subscribe (
    subscriberName : string = 'main',
    taxonomii: Taxonomii[],
    criteriuCerut ?: Criteriu
  ) {
    const debug = Debug('lodger:subscribe')

    const {
      db: { collections },
      plurals,
      activeReferencesIds,
      forms,
      store: { dispatch }
     } = <Lodger>this

    if (!collections || !plurals) {
      throw new LodgerError(Errors.missingCoreDefinitions)
    }

    // always have it as an array
    if (typeof taxonomii === 'string') {
      taxonomii = Array(taxonomii)
    }

    debug('subscribe chemat. criteriu cerut: ', criteriuCerut, taxonomii)

    // const multipleTaxonomies: boolean = taxonomii.length > 1
    if (!subscribers[subscriberName]) Object.assign(subscribers, { [subscriberName]: {} })
    // debug('subscribers', subscribers)

    const subscriber = <Subscriber>subscribers[subscriberName]

    if (!docsHolder[subscriberName]) {
      Vue.set(docsHolder, subscriberName, {})
    }

    taxonomii.forEach(taxonomie => {
      const form = forms[taxonomie]
      if (!form) throw new LodgerError('missing form for %%', taxonomie)
      const { plural, referenceTaxonomies } = form
      const colectie = collections[<Plural>plural]
      if (!colectie) throw new LodgerError('invalid collection %%', plural)

      const criteriu = getCriteriu(plural, criteriuCerut)
      let { limit, index, sort, find } = criteriu
      const paging = Number(limit || 0) * (index || 1)

      if (!docsHolder[subscriberName][plural]) {
        Vue.set(docsHolder[subscriberName], plural, docsHolderObj)
      }

      debug(`${taxonomie} CRITERIA ->`, {...criteriu})

      subscriber[plural] = colectie
        .find(find)
        .limit(paging)
        .sort(sort)
        .$
        .subscribe((changes: RxDocument<any>[]) => {
          // DO NOT RETURN IF NO CHANGES!!!!!!!
          debug(`${plural} for subscriber[${subscriberName}]`, changes)
          // assuming this is the first time ?!
          if (plural === 'servicii' && !changes.length) {
            predefinite.forEach(async denumire => { await collections[plural].insert({ denumire }) })
            debug('first init, adaugat predefinite')
          }

          Vue.set(docsHolder[subscriberName], plural, {
            criteriu,
            docs: changes.map(change => Object.freeze(change)) || [],
            items: Object.assign({},
              ...changes.map((item: RxDocument<any>) => ({ [item._id]: item._data }))
            )
          })

        })
    })

  }

  // get docsHolder () {
  //   return docsHolder
  // }

  /**
   * Array of taxonomies that have no reference
   * root taxonomies
   */
  get taxonomiesWithoutReference () {
    const { form } = this
    return this.taxonomii.filter(tax => {
      const refs = form(tax).referenceTaxonomies
      return !(refs && refs.length)
    })
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
    return this.store.getters
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

    Object.keys(forms).forEach(form => {
      const { name, plural } = forms[form]
      plurals.set(name, plural)
    })
    // rly custom n hardcoded shit
    plurals.set('tranzactie', 'tranzactii')

    const _collections: RxCollectionCreator[] = taxonomii.map(tax => forms[tax].collection)
    const db = await DB(_collections, dbCon)
    const store = new LodgerStore(taxonomii, plurals)
    const { collections } = await db

    // store.subscribe(DBGettersMethods({ collections, plurals, store }) )

    if (options) {
      Object.assign(buildOpts, { ...options })
    }

    /**
     * Custom DB getters on store.getters
     * This is for SELECT mutation
     */
    store.subscribe(async ({ type, payload }, state) => {
      const path = type.split('/')
      if (path[1] !== 'select') return

      const debug = Debug('lodger:SELECTstoreSubscriber')

      const tax = path[0]
      // const { plural } = forms[tax]

      debug('payload', payload)

      const id = typeof payload === 'string' ? payload : payload.id

      /**
       * commit DB methods
       * eg. multiple selects
       */
      const isMultiple = taxIsMultipleSelect(tax)
      if (isMultiple) {
        debug('ISML')
        const getter = store.getters[`${tax}/referencesIds`]
        if (getter) {
          Object.keys(getter).forEach(async refTaxId => {
            const reftax = refTaxId.replace('Id', '')
            const refdoc = store.getters[`${reftax}/activeDoc`]
            if (!refdoc) return
            console.error('REFDOC', refdoc)
            await refdoc[`toggle_${tax}`](id)
          })
        }

      }


    })

    // for (const [s, p] of plurals) { await subscribe.call(db, p) }

    return new Lodger(
      taxonomii,
      forms,
      plurals,
      db,
      store
    )
  }

  /**
   * Extend Lodger :)
   * Todo!
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
   * as a YML file with ext .ldb
   * date is captured
   *
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

  /**
   * Kills all active listeners for a given subscriber name
   * @param subscriberName
   */
  async unsubscribeAll (subscriberName: string = 'main') {
    const sub = subscribers[subscriberName || 'main']
    const debug = Debug('lodger:unsub')
    return await Promise.all(
      Object.keys(sub).map(async subscriber => {
        debug('unsubscribing', sub)
        await sub[subscriber].unsubscribe()
      })
    )
  }

  /**
   * For taxonomies that have references
   * get the referred ids
   *
   * @returns {Object}
   */
  get activeReferencesIds () {
    const { getters } = this.store
    return (references: Taxonomii[]) => assignRefIdsFromStore({
      references,
      getters
    })
  }

  get subscriberData () {
    const { plurals } = this

    return (
      taxonomy: Taxonomii,
      subscriberName: string
    ) => docsHolder[subscriberName][plurals.get(taxonomy)] || docsHolderObj

  }
}

export {
  Lodger,
  Errors,
  Taxonomii
}
