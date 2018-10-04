import Debug from 'debug'
import { Store, GetterTree } from 'vuex'
import { RxDatabase, RxCollectionCreator, RxDocument } from 'rxdb'
import fs from 'fs'
import osHomedir from 'os-homedir'
import yaml from 'json2yaml'

import LodgerStore from 'lodger/lib/Store'
import { getCriteriu } from 'lodger/lib/helpers/functions'
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
  missingData = 'Missing data',
  couldNotWriteFile = 'Cannot write file'
}

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
  taxonomii: Taxonomii[],
  plural: Plural,
  criteriu ?: Criteriu,
  subscriberName : string = 'main',
  docs ?: []
) {
  const debug = Debug('lodger:subscribe')

  const { db: { collections }, plurals } = <RxDatabase>this
  if (!collections || !plurals) {
    throw new LodgerError(Errors.missingCoreDefinitions)
  }

  // always have it as an array
  if (typeof taxonomii === 'string') {
    taxonomii = Array(taxonomii)
  }

  const multipleTaxonomies: boolean = taxonomii.length > 1

  const subscriber = <Subscriber>subscribers[subscriberName]

  taxonomii.forEach(taxonomie => {
    let { limit, index, sort, find } = getCriteriu(plural, criteriu)
    const paging = Number(limit || 0) * (index || 1)
    const pluralTaxonomie = plurals.get(taxonomie)
    const colectie = collections[<Plural>pluralTaxonomie]
    if (!colectie) throw new LodgerError('invalid collection %%', plural)

    subscriber[taxonomie] = colectie
      .find(find)
      .limit(paging)
      .sort(sort)
      .$
      .subscribe((changes: RxDocument<any>[]) => {
        // DO NOT RETURN IF NO CHANGES!!!!!!!
        debug(`${plural} for subscriber[${subscriberName}]`, changes)
        // assuming this is the first time ?!
        if (plural === 'servicii' && !changes.length) {
          predefinite.forEach(async denumire => { await collections[pluralTaxonomie].insert({ denumire }) })
          debug('first init, adaugat predefinite')
        }

        // utilizatorul default
        // if (pluralTaxonomie === 'utilizatori' && !changes.length) {
        //   debug('YOLO');
        //   (async () => {
        //     const usersCol = await collections.utilizatori
        //     await usersCol.insert({
        //       name: 'implicit',
        //       rol: 'administrator'
        //     })

        //     await usersCol.insert({
        //       name: 'vizitator',
        //       rol: 'vizitator'
        //     })
        //   })()
        // }

        // check if comes from Vue data() -> if it's observable
        // if (binder.__ob__) {
        //   // cleanup first
        //   // Object.keys(binder.items).forEach(id => {
        //   //   Vue.delete(binder, id)
        //   // })
        //   // binder.items = {}

        //   // // update data obj
        //   // changes.map((item: RxDocument<any>) => {
        //   //   Vue.set(binder.items, item._id, item._data)
        //   // })
        //   // if (docs) docs = changes\
        //   // Object.defineProperty(binder, 'docs', {
        //   //   configurable: false,
        //   //   value: changes
        //   // })
        //   // Vue.set(binder, 'docs', Object.freeze(changes))
        //   // binder.docs = [...Object.freeze(changes)]
        //   debug('BINDER', binder)

        const { length } = colectie
        Vue.set(binder, 'itemsCount', length)

        // remove preloading
        if (binder.fetching) { binder.fetching = false }

        // binder._docs = Object.freeze(changes)

        Vue.set(multipleTaxonomies ? binder.combinedItems : binder, multipleTaxonomies ? taxonomie : 'items', Object.assign({},
          ...changes.map((item: RxDocument<any>) => ({ [item._id]: item._data }))
        ))
      })
  })

}


const plugins: Plugin[] = []

// ACTIVE & SELECTED documents
async function handleSelectChanges(context, { type, payload }) {
  if (!type.indexOf('select')) return
  const namespace = type.split('/')[0]
  const debug = Debug('lodger:handleSelectChanges')
  const { collections, store, plurals } = context
  const { commit } = store
  // let doc: RxDocument<any>

  const plural = plurals.get(namespace)
  debug('yolo', context)

//   try {
//     // const doc = await collections[plural].findOne(payload).exec()
//     // commit(`${namespace}/SEL_DOC`, doc)
//   } catch (e) {
//     debug(e)
//   }
}

/**
 * Custom DB getters!!
 */
// function DBGettersMethods () {
//   const args = { ...arguments[0] }
//   return async (mutation) => {
//     await handleSelectChanges(args, mutation)
//   }
// }

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
    taxonomie: Taxonomii,
    data: LodgerFormData,
    references ?: Taxonomii[]
  ) {
    const debug = Debug('lodger:put')
    if (!data || Object.keys(data).length < 1) throw new LodgerError(Errors.missingData)
    const { db, plurals, store } = this
    const { getters } = store
    const plural = plurals.get(taxonomie)
    if (!plural) throw new LodgerError(Errors.noPlural, taxonomie)
    const colectie = db.collections[plural]

    /**
     * If form submitted with an _id, must be an upsert
     */
    const method = data._id ?
      'upsert' :
      'insert'

    const internallyHandledData = handleOnSubmit(data, {
      getters,
      references
    })

    try {
      const { _data } = await colectie[method](internallyHandledData)
      if (store) await store.dispatch(`${taxonomie}/set_last`, _data._id)
      debug('pus', taxonomie, _data._id)
      return _data
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
    id: string,
    isMultiple: boolean = false
  ) {
    const debug = Debug('lodger:select')
    // const plural = this.plurals.get(taxonomie)
    // dbGetters[`$${taxonomie}`] = await this.db[plural].findOne(id).exec()
    if (!isMultiple) {
      this.store.commit(`${taxonomie}/select`, id)
    } else {
      const metoda = `toggle_${taxonomie}`
      const references = this.referenceTaxonomies(taxonomie)
      debug('references', references)
      references.forEach(async (reference: Taxonomii) => {
        const doc = this.store.getters[`${reference}/activeDoc`]
        debug('fac la referinta', doc)
        if (!doc) throw new LodgerError('nicio/niciun %% selectat(a)', reference)
        const _toExecute = doc[metoda]
        if (typeof _toExecute !== 'function') throw new LodgerError('nu e functie %%', metoda)
        await _toExecute(id)
      });
    }
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
    const { store } = this
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
    // rly custom n hardcoded shit
    plurals.set('tranzactie', 'tranzactii')

    const _collections: RxCollectionCreator[] = forms.map(form => form.collection)
    const db = await DB(_collections, dbCon)
    const store = new LodgerStore(taxonomii)
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
      const debug = Debug('lodger:SELECTstoreSubscriber')
      if (path[1] !== 'select') return
      const tax = path[0]
      const plural = plurals.get(tax)
      let doc = await collections[plural].findOne(payload).exec()
      debug(`ACTIVE ${tax}`, doc)
      // store.getters[`${tax}/active`]
      const gName = `${tax}/activeDoc`
      if (!store.getters[gName]) {
        Object.defineProperty(store.getters, gName, {
          configurable: false,
          get () {
            return doc
          },
          set (newDoc) {
            doc = newDoc
          }
        })
      } else {
        // state[tax].doc = doc
        store.getters[gName] = doc
      }

      // state[tax]._activeDoc = doc
      debug('state param', state)
    })

    // for (const [s, p] of plurals) { await subscribe.call(db, p) }

    return new Lodger(
      taxonomii,
      forms,
      plurals,
      db,
      store,
      subscribe.bind({ db, plurals })
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

  /**
   * More of like a helper to return the speciffied form
   * as we need this in components
   *
   * @param {string} formName
   * @returns {Form} the form
   * @memberof Lodger
   */
  get _formData () {
    const { forms } = this
    if (!forms) return

    return (formName: string) => {
      const form = forms.filter(form => form.name === formName)[0]
      return form ? form.data : {}
    }
  }

  get _collection () {
    return (colName: string) => this.db.collections[colName]
  }

  get referenceTaxonomies () {
    const { _formData } = this

    return (taxonomy: Taxonomii) => {
      const { fields } = _formData(taxonomy)
      return fields
        .filter(field => field.id.indexOf('Id') === field.id.length - 2)
        .map(field => field.id.replace('Id', ''))
    }
  }
}

export {
  Lodger,
  Errors,
  Taxonomii
}
