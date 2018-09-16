import Vue from 'vue'
import Vuex, { StoreOptions, ModuleTree, Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { Taxonomii } from 'lodger'
import { setupFromFile, setupSharedMethods, createEmptyStoreModule } from 'lodger/lib/helpers/store'
import { LodgerError } from 'lodger/lib/Errors';
import * as RootModule from 'lodger/lib/store/index'
import Debug from 'debug'
const debug = Debug('lodger:Store')

Vue.use(Vuex)

const modules: ModuleTree<RootState> = {}

enum Errors {
  invalidModule = 'Invalid Module'
}

export default class LodgerStore implements StoreOptions<RootState> {
  readonly modules: ModuleTree<any> = {}

  constructor (    
    private taxonomii?: Taxonomii[],
  ) {
    
    /**
     * Builds modules based on taxonomies
     * TODO: make this a method ?!
     */
    if (taxonomii && taxonomii.length) {
      taxonomii.forEach(tax => {
        modules[tax] = setupSharedMethods(undefined, createEmptyStoreModule())
      })
    }
    
    if (RootModule && RootModule.modules) {
      Object.keys(RootModule.modules).forEach(module => {
        LodgerStore.use({ module: RootModule.modules[module] })
      })
    }
    
    const { state, getters, actions, mutations } = RootModule
    
    Object.assign(this, {
      state,
      actions,
      mutations,
      getters
    })
    this.modules = modules

    // FUCK YOU TS
    return new Vuex.Store<RootState>(this)
  }

  static use (module: Module<any, RootState>) {
    if (!module || typeof module !== 'object') {
      throw new LodgerError(Errors.invalidModule)
    }
    const key = Object.keys(module)[0]
    if (!key || !module[key]) throw new LodgerError(Errors.invalidModule)
    debug('using module', key)
    modules[key] = module[key]
  }
}
