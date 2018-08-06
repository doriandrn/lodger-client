import { Config, ConstructContext, CriteriuGetterTaxonomie, Taxonomie, Plugin } from './typings/defs'
import { LodgerPublicAPI, LodgerInit } from './typings'
// import connectToDb from './db'
import { DB } from 'lodger/lib/DB'
// import colectii from './db/collections'

export default class Lodger implements LodgerInit, LodgerPublicAPI {
  constructor (config: Config, context: ConstructContext) {

  }

  adauga (orice: Taxonomie) {

  }
  /**
   * Functie de initializare / build
   * @param {object} config 
   */
  static async build (config: Config) {
    const _db = new DB({})
    if (!_db) throw new Error('DB nu s-a putut incarca')
    // const { store } = modules || { store: null }
    return new Lodger(config, { _db })
  }

  /**
   * Metoda de introdus plugin-uri in clasa
   * @param {*} plugin 
   */
  static use (plugin: Plugin) {
    console.error('PLUGIN: ', plugin)
    if (!plugin || typeof plugin !== 'object') throw new Error('Definitie plugin incorectă')
    const { name } = plugin
    console.info('ew plugin', name)
  }
}
